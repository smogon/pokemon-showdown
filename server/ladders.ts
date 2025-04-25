/**
 * Matchmaker
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This keeps track of challenges to battle made between users, setting up
 * matches between users looking for a battle, and starting new battles.
 *
 * @license MIT
 */

const LadderStore: typeof import('./ladders-remote').LadderStore = (
	typeof Config === 'object' && Config.remoteladder ? require('./ladders-remote') : require('./ladders-local')
).LadderStore;

const SECONDS = 1000;
const PERIODIC_MATCH_INTERVAL = 60 * SECONDS;

import type { ChallengeType } from './room-battle';
import { BattleReady, BattleChallenge, GameChallenge, BattleInvite, challenges } from './ladders-challenges';

/**
 * Keys are formatids
 */
const searches = new Map<string, {
	playerCount: number,
	/** userid:BattleReady */
	searches: Map<ID, BattleReady>,
}>();

/**
 * This keeps track of searches for battles, creating a new battle for a newly
 * added search if a valid match can be made, otherwise periodically
 * attempting to make a match with looser restrictions until one can be made.
 */
class Ladder extends LadderStore {
	async prepBattle(connection: Connection, challengeType: ChallengeType, team: string | null = null, isRated = false) {
		// all validation for a battle goes through here
		const user = connection.user;
		const userid = user.id;
		if (team === null) team = user.battleSettings.team;

		if (Rooms.global.lockdown && Rooms.global.lockdown !== 'pre') {
			let message = `The server is restarting. Battles will be available again in a few minutes.`;
			if (Rooms.global.lockdown === 'ddos') {
				message = `The server is under attack. Battles cannot be started at this time.`;
			}
			connection.popup(message);
			return null;
		}
		if (Punishments.isBattleBanned(user)) {
			connection.popup(`You are barred from starting any new games until your battle ban expires.`);
			return null;
		}
		const gameCount = user.games.size;
		if (Monitor.countConcurrentBattle(gameCount, connection)) {
			return null;
		}
		if (Monitor.countPrepBattle(connection.ip, connection)) {
			return null;
		}

		try {
			this.formatid = Dex.formats.validate(this.formatid);
		} catch (e: any) {
			connection.popup(`Your selected format is invalid:\n\n- ${e.message}`);
			return null;
		}

		let rating = 0;
		let valResult;
		let removeNicknames = !!(user.locked || user.namelocked);

		const regex = /(?:^|])([^|]*)\|([^|]*)\|/g;
		let match = regex.exec(team);
		let unownWord = '';
		while (match) {
			const nickname = match[1];
			const speciesid = toID(match[2] || match[1]);
			if (speciesid.length <= 6 && speciesid.startsWith('unown')) {
				unownWord += speciesid.charAt(5) || 'a';
			}
			if (nickname) {
				const filtered = Chat.nicknamefilter(nickname, user);
				if (typeof filtered === 'string' && (!filtered || filtered !== match[1])) {
					connection.popup(
						`Your team was rejected for the following reason:\n\n` +
						`- Your Pokémon has a banned nickname: ${match[1]}`
					);
					return null;
				} else if (filtered === false) {
					removeNicknames = true;
				}
			}
			match = regex.exec(team);
		}
		if (unownWord) {
			const filtered = Chat.nicknamefilter(unownWord, user);
			if (!filtered || filtered !== unownWord) {
				connection.popup(
					`Your team was rejected for the following reason:\n\n` +
					`- Your Unowns spell out a banned word: ${unownWord.toUpperCase()}`
				);
				return null;
			}
		}

		if (isRated && !Ladders.disabled) {
			const uid = user.id;
			[valResult, rating] = await Promise.all([
				TeamValidatorAsync.get(this.formatid).validateTeam(team, { removeNicknames, user: uid }),
				this.getRating(uid),
			]);
			if (uid !== user.id) {
				// User feedback for renames handled elsewhere.
				return null;
			}
			if (!rating) rating = 1;
		} else {
			if (Ladders.disabled) {
				connection.popup(`The ladder is temporarily disabled due to technical difficulties - you will not receive ladder rating for this game.`);
				rating = 1;
			}
			const validator = TeamValidatorAsync.get(this.formatid);
			valResult = await validator.validateTeam(team, { removeNicknames, user: user.id });
		}

		if (!valResult.startsWith('1')) {
			connection.popup(
				`Your team was rejected for the following reasons:\n\n` +
				`- ` + valResult.slice(1).replace(/\n/g, `\n- `)
			);
			return null;
		}

		const settings = { ...user.battleSettings, team: valResult.slice(1) };
		user.battleSettings.inviteOnly = false;
		user.battleSettings.hidden = false;
		return new BattleReady(userid, this.formatid, settings, rating, challengeType);
	}

	static getChallenging(userid: ID) {
		const userChalls = Ladders.challenges.get(userid);
		if (userChalls) {
			for (const chall of userChalls) {
				if (chall.from === userid) return chall;
			}
		}
		return null;
	}

	async makeChallenge(connection: Connection, targetUser: User) {
		const user = connection.user;
		if (targetUser === user) {
			connection.popup(`You can't battle yourself. The best you can do is open PS in Private Browsing (or another browser) and log into a different username, and battle that username.`);
			return false;
		}
		if (Ladder.getChallenging(user.id)) {
			connection.popup(`You are already challenging someone. Cancel that challenge before challenging someone else.`);
			return false;
		}

		let blockChallenge: boolean;
		if (typeof targetUser.settings.blockChallenges === 'boolean') {
			blockChallenge = targetUser.settings.blockChallenges;
		} else if (targetUser.settings.blockChallenges === 'friends') {
			blockChallenge = !targetUser.friends?.has(user.id);
		} else {
			blockChallenge = !Users.globalAuth.atLeast(user, targetUser.settings.blockChallenges);
		}

		if (blockChallenge && !user.can('bypassblocks', targetUser)) {
			connection.popup(`The user '${targetUser.name}' is not accepting challenges right now.`);
			Chat.maybeNotifyBlocked('challenge', targetUser, user);
			return false;
		}
		if (Date.now() < user.lastChallenge + 10 * SECONDS && !Config.nothrottle) {
			// 10 seconds ago, probable misclick
			connection.popup(`You challenged less than 10 seconds after your last challenge! It's cancelled in case it's a misclick.`);
			return false;
		}
		const currentChallenges = Ladders.challenges.get(targetUser.id);
		if (currentChallenges && currentChallenges.length >= 3 && !user.autoconfirmed) {
			connection.popup(
				`This user already has 3 pending challenges.\n` +
				`You must be autoconfirmed to challenge them.`
			);
			return false;
		}
		const ready = await this.prepBattle(connection, 'challenge');
		if (!ready) return false;
		// If our target is already challenging us in the same format,
		// simply accept the pending challenge instead of creating a new one.
		const existingChall = Ladders.challenges.search(user.id, targetUser.id);
		if (existingChall) {
			if (
				existingChall.from === targetUser.id &&
				existingChall.to === user.id &&
				existingChall.format === this.formatid &&
				existingChall.ready
			) {
				if (Ladders.challenges.remove(existingChall)) {
					Ladders.match([existingChall.ready, ready]);
					return true;
				}
			} else {
				connection.popup(`There's already a challenge (${existingChall.format}) between you and ${targetUser.name}!`);
				Ladders.challenges.update(user.id, targetUser.id);
				return false;
			}
		}
		Ladders.challenges.add(new BattleChallenge(user.id, targetUser.id, ready));
		Ladders.challenges.send(user.id, targetUser.id, `/log ${user.name} wants to battle!`);
		user.lastChallenge = Date.now();
		Chat.runHandlers('onChallenge', user, targetUser, ready.formatid);
		return true;
	}
	static async acceptChallenge(connection: Connection, chall: BattleChallenge) {
		const ladder = Ladders(chall.format);
		const ready = await ladder.prepBattle(connection, 'challenge');
		if (!ready) return;
		if (Ladders.challenges.remove(chall)) {
			return Ladders.match([chall.ready, ready]);
		}
	}

	cancelSearch(user: User) {
		const formatid = toID(this.formatid);

		const formatTable = Ladders.searches.get(formatid);
		if (!formatTable) return false;
		if (!formatTable.searches.has(user.id)) return false;
		formatTable.searches.delete(user.id);

		Ladder.updateSearch(user);
		return true;
	}

	static cancelSearches(user: User) {
		let cancelCount = 0;

		for (const formatTable of Ladders.searches.values()) {
			const search = formatTable.searches.get(user.id);
			if (!search) continue;
			formatTable.searches.delete(user.id);
			cancelCount++;
		}

		Ladder.updateSearch(user);
		return cancelCount;
	}

	getSearcher(search: BattleReady) {
		const formatid = toID(this.formatid);
		const user = Users.get(search.userid);
		if (!user?.connected || user.id !== search.userid) {
			const formatTable = Ladders.searches.get(formatid);
			if (formatTable) formatTable.searches.delete(search.userid);
			if (user?.connected) {
				user.popup(`You changed your name and are no longer looking for a battle in ${formatid}`);
				Ladder.updateSearch(user);
			}
			return null;
		}
		return user;
	}

	static getSearches(user: User) {
		const userSearches = [];
		for (const [formatid, formatTable] of Ladders.searches) {
			if (formatTable.searches.has(user.id)) userSearches.push(formatid);
		}
		return userSearches;
	}
	static updateSearch(user: User, connection: Connection | null = null) {
		let games: { [k: string]: string } | null = {};
		let atLeastOne = false;
		for (const roomid of user.games) {
			const room = Rooms.get(roomid);
			if (!room) {
				Monitor.warn(`while searching, room ${roomid} expired for user ${user.id} in rooms ${[...user.inRooms]} and games ${[...user.games]}`);
				user.games.delete(roomid);
				continue;
			}
			const game = room.game;
			if (!game) {
				Monitor.warn(`while searching, room ${roomid} has no game for user ${user.id} in rooms ${[...user.inRooms]} and games ${[...user.games]}`);
				user.games.delete(roomid);
				continue;
			}
			games[roomid] = game.title + (game.allowRenames ? '' : '*');
			atLeastOne = true;
		}
		if (!atLeastOne) games = null;
		const searching = Ladders.getSearches(user);
		(connection || user).send(`|updatesearch|` + JSON.stringify({
			searching,
			games,
		}));
	}
	hasSearch(user: User) {
		const formatid = toID(this.formatid);
		const formatTable = Ladders.searches.get(formatid);
		if (!formatTable) return false;
		return formatTable.searches.has(user.id);
	}

	/**
	 * Validates a user's team and fetches their rating for a given format
	 * before creating a search for a battle.
	 */
	async searchBattle(user: User, connection: Connection) {
		if (!user.connected) return;

		const format = Dex.formats.get(this.formatid);
		if (!format.searchShow) {
			connection.popup(`Error: Your format ${format.id} is not ladderable.`);
			return;
		}

		const oldUserid = user.id;
		const search = await this.prepBattle(connection, format.rated ? 'rated' : 'unrated', null, format.rated !== false);

		if (oldUserid !== user.id) return;
		if (!search) return;

		this.addSearch(search, user);
	}

	/**
	 * Verifies whether or not a match made between two users is valid. Returns
	 */
	matchmakingOK(matches: [BattleReady, User][]) {
		const formatid = toID(this.formatid);
		const users = matches.map(([ready, user]) => user);
		const userids = users.map(user => user.id);

		// users must be different
		if (new Set(users).size !== users.length) return false;

		if (Config.noipchecks) {
			users[0].lastMatch = users[1].id;
			users[1].lastMatch = users[0].id;
			return true;
		}

		// users must have different IPs
		if (new Set(users.map(user => user.latestIp)).size !== users.length) return false;

		// users must not have been matched immediately previously
		for (const user of users) {
			if (userids.includes(user.lastMatch)) return false;
		}

		// search must be within range
		let searchRange = 100;
		const times = matches.map(([search]) => search.time);
		const elapsed = Date.now() - Math.min(...times);
		if (formatid === `gen${Dex.gen}ou` || formatid === `gen${Dex.gen}randombattle`) {
			searchRange = 50;
		}

		searchRange += elapsed / 300; // +1 every .3 seconds
		if (searchRange > 300) searchRange = 300 + (searchRange - 300) / 10; // +1 every 3 sec after 300
		if (searchRange > 600) searchRange = 600;
		const ratings = matches.map(([search]) => search.rating);
		if (Math.max(...ratings) - Math.min(...ratings) > searchRange) return false;

		matches[0][1].lastMatch = matches[1][1].id;
		matches[1][1].lastMatch = matches[0][1].id;
		return true;
	}

	/**
	 * Starts a search for a battle for a user under the given format.
	 */
	addSearch(newSearch: BattleReady, user: User) {
		const formatid = newSearch.formatid;
		let formatTable = Ladders.searches.get(formatid);
		if (!formatTable) {
			formatTable = {
				playerCount: Dex.formats.get(formatid).playerCount,
				searches: new Map(),
			};
			Ladders.searches.set(formatid, formatTable);
		}
		if (formatTable.searches.has(user.id)) {
			user.popup(`Couldn't search: You are already searching for a ${formatid} battle.`);
			return;
		}

		const matches = [newSearch];
		// In order from longest waiting to shortest waiting
		for (const search of formatTable.searches.values()) {
			const searcher = this.getSearcher(search);
			if (!searcher) continue;
			const matched = this.matchmakingOK([[search, searcher], [newSearch, user]]);
			if (matched) {
				matches.push(search);
			}
			if (matches.length >= formatTable.playerCount) {
				for (const matchedSearch of matches) formatTable.searches.delete(matchedSearch.userid);
				Ladder.match(matches);
				return;
			}
		}

		formatTable.searches.set(newSearch.userid, newSearch);
		Ladder.updateSearch(user);
	}

	/**
	 * Creates a match for a new battle for each format in this.searches if a
	 * valid match can be made. This is run periodically depending on
	 * PERIODIC_MATCH_INTERVAL.
	 */
	static periodicMatch() {
		// In order from longest waiting to shortest waiting
		for (const [formatid, formatTable] of Ladders.searches) {
			if (formatTable.playerCount > 2) continue; // TODO: implement
			const matchmaker = Ladders(formatid);
			let longest: [BattleReady, User] | null = null;
			for (const search of formatTable.searches.values()) {
				if (!longest) {
					const longestSearcher = matchmaker.getSearcher(search);
					if (!longestSearcher) continue;
					longest = [search, longestSearcher];
					continue;
				}
				const searcher = matchmaker.getSearcher(search);
				if (!searcher) continue;

				const [longestSearch, longestSearcher] = longest;
				const matched = matchmaker.matchmakingOK([[search, searcher], [longestSearch, longestSearcher]]);
				if (matched) {
					formatTable.searches.delete(search.userid);
					formatTable.searches.delete(longestSearch.userid);
					Ladder.match([longestSearch, search]);
					return;
				}
			}
		}
	}

	static match(readies: BattleReady[]) {
		const formatid = readies[0].formatid;
		if (readies.some(ready => ready.formatid !== formatid)) throw new Error(`Format IDs don't match`);
		const players = [];
		let missingUser = null;
		let minRating = Infinity;
		for (const ready of readies) {
			const user = Users.get(ready.userid);
			if (!user) {
				missingUser = ready.userid;
				break;
			}
			players.push({
				user,
				team: ready.settings.team,
				rating: ready.rating,
				hidden: ready.settings.hidden,
				inviteOnly: ready.settings.inviteOnly,
			});
			if (ready.rating < minRating) minRating = ready.rating;
		}
		if (missingUser) {
			for (const ready of readies) {
				Users.get(ready.userid)?.popup(`Sorry, your opponent ${missingUser} went offline before your battle could start.`);
			}
			return undefined;
		}
		const format = Dex.formats.get(formatid);
		const delayedStart = format.playerCount > players.length ? 'multi' : false;
		return Rooms.createBattle({
			format: formatid,
			players,
			rated: minRating,
			challengeType: readies[0].challengeType,
			delayedStart,
		});
	}
}

function getLadder(formatid: string) {
	return new Ladder(formatid);
}

const periodicMatchInterval = setInterval(
	() => Ladder.periodicMatch(),
	PERIODIC_MATCH_INTERVAL
);

export const Ladders = Object.assign(getLadder, {
	BattleReady,
	LadderStore,
	Ladder,

	BattleChallenge,
	GameChallenge,
	BattleInvite,

	cancelSearches: Ladder.cancelSearches,
	updateSearch: Ladder.updateSearch,
	acceptChallenge: Ladder.acceptChallenge,
	visualizeAll: Ladder.visualizeAll,
	getSearches: Ladder.getSearches,
	match: Ladder.match,

	searches,
	challenges,
	periodicMatchInterval,

	// tells the client to ask the server for format information
	formatsListPrefix: LadderStore.formatsListPrefix,
	disabled: false as boolean | 'db',
});
