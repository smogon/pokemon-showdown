/**
 * Matchmaker
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This keeps track of challenges to battle made between users, setting up
 * matches between users looking for a battle, and starting new battles.
 *
 * @License MIT License
 */

'use strict';

/** @type {typeof LadderStoreT} */
const LadderStore = require(typeof Config === 'object' && Config.remoteladder ? './ladders-remote' : './ladders-local');

const SECONDS = 1000;
const PERIODIC_MATCH_INTERVAL = 60 * SECONDS;

/**
 * This represents a user's search for a battle under a format.
 */
class BattleReady {
	/**
	 * @param {string} userid
	 * @param {string} formatid
	 * @param {string} team
	 * @param {number} [rating = 1000]
	 */
	constructor(userid, formatid, team, rating = 0) {
		/** @type {string} */
		this.userid = userid;
		/** @type {string} */
		this.formatid = formatid;
		/** @type {string} */
		this.team = team;
		/** @type {number} */
		this.rating = rating;
		/** @type {number} */
		this.time = Date.now();
	}
}

/**
 * formatid:userid:BattleReady
 * @type {Map<string, Map<string, BattleReady>>}
 */
const searches = new Map();

class Challenge {
	/**
	 * @param {BattleReady} ready
	 * @param {string} to
	 */
	constructor(ready, to) {
		this.from = ready.userid;
		this.to = to;
		this.formatid = ready.formatid;
		this.ready = ready;
	}
}
/**
 * formatid:userid:BattleReady
 * @type {Map<string, Challenge[]>}
 */
const challenges = new Map();

/**
 * This keeps track of searches for battles, creating a new battle for a newly
 * added search if a valid match can be made, otherwise periodically
 * attempting to make a match with looser restrictions until one can be made.
 */
class Ladder extends LadderStore {
	/**
	 * @param {string} formatid
	 */
	constructor(formatid) {
		super(formatid);
	}

	/**
	 * @param {Connection} connection
	 * @param {string?} team
	 * @return {Promise<BattleReady?>}
	 */
	async prepBattle(connection, team = null, isRated = false) {
		// all validation for a battle goes through here
		const user = connection.user;
		const userid = user.userid;
		if (team === null) team = user.team;

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
		let gameCount = user.games.size;
		if (Monitor.countConcurrentBattle(gameCount, connection)) {
			return null;
		}
		if (Monitor.countPrepBattle(connection.ip, connection)) {
			return null;
		}

		try {
			// @ts-ignore TypeScript bug: self-reference
			this.formatid = Dex.validateFormat(this.formatid);
		} catch (e) {
			connection.popup(`Your selected format is invalid:\n\n- ${e.message}`);
			return null;
		}

		const regex = /(?:^|])([^|]*)\|/g;
		let match = regex.exec(team);
		while (match) {
			let nickname = match[1];
			if (nickname) {
				nickname = Chat.nicknamefilter(nickname, user);
				if (!nickname || nickname !== match[1]) {
					connection.popup(
						`Your team was rejected for the following reason:\n\n` +
						`- Your Pokémon has a banned nickname: ${match[1]}`
					);
					return null;
				}
			}
			match = regex.exec(team);
		}

		let rating = 0, valResult;
		if (isRated && !Ladders.disabled) {
			let userid = user.userid;
			[valResult, rating] = await Promise.all([
				TeamValidatorAsync(this.formatid).validateTeam(team, !!(user.locked || user.namelocked)),
				this.getRating(userid),
			]);
			if (userid !== user.userid) {
				// User feedback for renames handled elsewhere.
				return null;
			}
			if (!rating) rating = 1;
		} else {
			if (Ladders.disabled) {
				connection.popup(`The ladder is temporarily disabled due to technical difficulties - you will not receive ladder rating for this game.`);
				rating = 1;
			}
			valResult = await TeamValidatorAsync(this.formatid).validateTeam(team, !!(user.locked || user.namelocked));
		}

		if (valResult.charAt(0) !== '1') {
			connection.popup(
				`Your team was rejected for the following reasons:\n\n` +
				`- ` + valResult.slice(1).replace(/\n/g, `\n- `)
			);
			return null;
		}

		return new BattleReady(userid, this.formatid, valResult.slice(1), rating);
	}

	/**
	 * @param {User} user
	 */
	static cancelChallenging(user) {
		const chall = Ladder.getChallenging(user.userid);
		if (chall) {
			Ladder.removeChallenge(chall);
			return true;
		}
		return false;
	}
	/**
	 * @param {User} user
	 * @param {User} targetUsername
	 */
	static rejectChallenge(user, targetUsername) {
		const targetUserid = toId(targetUsername);
		const chall = Ladder.getChallenging(targetUserid);
		if (chall && chall.to === user.userid) {
			Ladder.removeChallenge(chall);
			return true;
		}
		return false;
	}
	/**
	 * @param {string} username
	 */
	static clearChallenges(username) {
		const userid = toId(username);
		const userChalls = Ladders.challenges.get(userid);
		if (userChalls) {
			for (const chall of userChalls.slice()) {
				let otherUserid;
				if (chall.from === userid) {
					otherUserid = chall.to;
				} else {
					otherUserid = chall.from;
				}
				Ladder.removeChallenge(chall, true);
				const otherUser = Users(otherUserid);
				if (otherUser) Ladder.updateChallenges(otherUser);
			}
			const user = Users(userid);
			if (user) Ladder.updateChallenges(user);
			return true;
		}
		return false;
	}
	/**
	 * @param {Connection} connection
	 * @param {User} targetUser
	 */
	async makeChallenge(connection, targetUser) {
		const user = connection.user;
		if (targetUser === user) {
			connection.popup(`You can't battle yourself. The best you can do is open PS in Private Browsing (or another browser) and log into a different username, and battle that username.`);
			return false;
		}
		if (Ladder.getChallenging(user.userid)) {
			connection.popup(`You are already challenging someone. Cancel that challenge before challenging someone else.`);
			return false;
		}
		if (targetUser.blockChallenges && !user.can('bypassblocks', targetUser)) {
			connection.popup(`The user '${targetUser.name}' is not accepting challenges right now.`);
			return false;
		}
		if (Date.now() < user.lastChallenge + 10 * SECONDS) {
			// 10 seconds ago, probable misclick
			connection.popup(`You challenged less than 10 seconds after your last challenge! It's cancelled in case it's a misclick.`);
			return false;
		}
		const ready = await this.prepBattle(connection);
		if (!ready) return false;
		Ladder.addChallenge(new Challenge(ready, targetUser.userid));
		user.lastChallenge = Date.now();
		return true;
	}
	/**
	 * @param {Connection} connection
	 * @param {User} targetUser
	 */
	static async acceptChallenge(connection, targetUser) {
		const chall = Ladder.getChallenging(targetUser.userid);
		if (!chall || chall.to !== connection.user.userid) {
			connection.popup(`${targetUser.userid} is not challenging you. Maybe they cancelled before you accepted?`);
			return false;
		}
		const ladder = Ladders(chall.formatid);
		const ready = await ladder.prepBattle(connection);
		if (!ready) return false;
		if (Ladder.removeChallenge(chall)) {
			Ladders.match(chall.ready, ready);
		}
		return true;
	}

	/**
	 * @param {string} userid
	 */
	static getChallenging(userid) {
		const userChalls = Ladders.challenges.get(userid);
		if (userChalls) {
			for (const chall of userChalls) {
				if (chall.from === userid) return chall;
			}
		}
		return null;
	}
	/**
	 * @param {Challenge} challenge
	 */
	static addChallenge(challenge, skipUpdate = false) {
		let challs1 = Ladders.challenges.get(challenge.from);
		if (!challs1) Ladders.challenges.set(challenge.from, challs1 = []);
		let challs2 = Ladders.challenges.get(challenge.to);
		if (!challs2) Ladders.challenges.set(challenge.to, challs2 = []);
		challs1.push(challenge);
		challs2.push(challenge);
		if (!skipUpdate) {
			const fromUser = Users(challenge.from);
			if (fromUser) Ladder.updateChallenges(fromUser);
			const toUser = Users(challenge.to);
			if (toUser) Ladder.updateChallenges(toUser);
		}
	}
	/**
	 * @param {Challenge} challenge
	 */
	static removeChallenge(challenge, skipUpdate = false) {
		const fromChalls = /** @type {Challenge[]} */ (Ladders.challenges.get(challenge.from));
		// the challenge may have been cancelled
		if (!fromChalls) return false;
		const fromIndex = fromChalls.indexOf(challenge);
		if (fromIndex < 0) return false;
		fromChalls.splice(fromIndex, 1);
		if (!fromChalls.length) Ladders.challenges.delete(challenge.from);
		const toChalls = /** @type {Challenge[]} */ (Ladders.challenges.get(challenge.to));
		toChalls.splice(toChalls.indexOf(challenge), 1);
		if (!toChalls.length) Ladders.challenges.delete(challenge.to);
		if (!skipUpdate) {
			const fromUser = Users(challenge.from);
			if (fromUser) Ladder.updateChallenges(fromUser);
			const toUser = Users(challenge.to);
			if (toUser) Ladder.updateChallenges(toUser);
		}
		return true;
	}
	/**
	 * @param {User} user
	 * @param {Connection?} connection
	 */
	static updateChallenges(user, connection = null) {
		if (!user.connected) return;
		let challengeTo = null;
		/**@type {{[k: string]: string}} */
		let challengesFrom = {};
		const userChalls = Ladders.challenges.get(user.userid);
		if (userChalls) {
			for (const chall of userChalls) {
				if (chall.from === user.userid) {
					challengeTo = {
						to: chall.to,
						format: chall.formatid,
					};
				} else {
					challengesFrom[chall.from] = chall.formatid;
				}
			}
		}
		(connection || user).send(`|updatechallenges|` + JSON.stringify({
			challengesFrom: challengesFrom,
			challengeTo: challengeTo,
		}));
	}

	/**
	 * @param {User} user
	 * @return {boolean}
	 */
	cancelSearch(user) {
		const formatid = toId(this.formatid);

		const formatTable = Ladders.searches.get(formatid);
		if (!formatTable) return false;
		if (!formatTable.has(user.userid)) return false;
		formatTable.delete(user.userid);

		Ladder.updateSearch(user);
		return true;
	}

	/**
	 * @param {User} user
	 * @return {number} cancel count
	 */
	static cancelSearches(user) {
		let cancelCount = 0;

		for (let formatTable of Ladders.searches.values()) {
			const search = formatTable.get(user.userid);
			if (!search) continue;
			formatTable.delete(user.userid);
			cancelCount++;
		}

		Ladder.updateSearch(user);
		return cancelCount;
	}

	/**
	 * @param {BattleReady} search
	 */
	getSearcher(search) {
		const formatid = toId(this.formatid);
		const user = Users.get(search.userid);
		if (!user || !user.connected || user.userid !== search.userid) {
			const formatTable = Ladders.searches.get(formatid);
			if (formatTable) formatTable.delete(search.userid);
			if (user && user.connected) {
				user.popup(`You changed your name and are no longer looking for a battle in ${formatid}`);
				Ladder.updateSearch(user);
			}
			return null;
		}
		return user;
	}

	/**
	 * @param {User} user
	 */
	static getSearches(user) {
		let userSearches = [];
		for (const [formatid, formatTable] of Ladders.searches) {
			if (formatTable.has(user.userid)) userSearches.push(formatid);
		}
		return userSearches;
	}
	/**
	 * @param {User} user
	 * @param {Connection?} connection
	 */
	static updateSearch(user, connection = null) {
		let games = /** @type {any} */ ({});
		let atLeastOne = false;
		for (const roomid of user.games) {
			const room = Rooms(roomid);
			if (!room) {
				Monitor.warn(`while searching, room ${roomid} expired for user ${user.userid} in rooms ${[...user.inRooms]} and games ${[...user.games]}`);
				user.games.delete(roomid);
				return;
			}
			const game = room.game;
			if (!game) {
				Monitor.warn(`while searching, room ${roomid} has no game for user ${user.userid} in rooms ${[...user.inRooms]} and games ${[...user.games]}`);
				user.games.delete(roomid);
				return;
			}
			games[roomid] = game.title + (game.allowRenames ? '' : '*');
			atLeastOne = true;
		}
		if (!atLeastOne) games = null;
		let searching = Ladders.getSearches(user);
		(connection || user).send(`|updatesearch|` + JSON.stringify({
			searching: searching,
			games: games,
		}));
	}
	/**
	 * @param {User} user
	 */
	hasSearch(user) {
		const formatid = toId(this.formatid);
		const formatTable = Ladders.searches.get(formatid);
		if (!formatTable) return false;
		return formatTable.has(user.userid);
	}

	/**
	 * Validates a user's team and fetches their rating for a given format
	 * before creating a search for a battle.
	 * @param {User} user
	 * @param {Connection} connection
	 * @return {Promise<void>}
	 */
	async searchBattle(user, connection) {
		if (!user.connected) return;

		const format = Dex.getFormat(this.formatid);
		if (!format.searchShow) {
			connection.popup(`Error: Your format ${format.id} is not ladderable.`);
			return;
		}

		const roomid = this.needsToMove(user);
		if (roomid) {
			connection.popup(`Error: You need to make a move in <<${roomid}>> before you can look for another battle.\n\n(This restriction doesn't apply in the first five turns of a battle.)`);
			return;
		}

		if (roomid === null && Date.now() < user.lastDecision + 3 * SECONDS) {
			connection.popup(`Error: You need to wait until after making a move before you can look for another battle.\n\n(This restriction doesn't apply in the first five turns of a battle.)`);
			return;
		}

		let oldUserid = user.userid;
		const search = await this.prepBattle(connection, null, format.rated !== false);

		if (oldUserid !== user.userid) return;
		if (!search) return;

		this.addSearch(search, user);
	}

	/**
	 * null = all battles ok
	 * undefined = not in any battle
	 * @param {User} user
	 */
	needsToMove(user) {
		let out = undefined;
		for (const roomid of user.games) {
			const room = Rooms(roomid);
			if (!room || !room.battle || !room.battle.players[user.userid]) continue;
			const battle = /** @type {RoomBattle} */ (room.battle);
			if (battle.requestCount <= 16) {
				// it's fine as long as it's before turn 5
				// to be safe, we count off 8 requests for Team Preview, U-turn, and faints
				continue;
			}
			if (Dex.getFormat(battle.format).allowMultisearch) {
				continue;
			}
			const player = battle.players[user.userid];
			if (!battle.requests[player.slot].isWait) return roomid;
			out = null;
		}
		return out;
	}

	/**
	 * Verifies whether or not a match made between two users is valid. Returns
	 * @param {BattleReady} search1
	 * @param {BattleReady} search2
	 * @param {User=} user1
	 * @param {User=} user2
	 * @return {boolean}
	 */
	matchmakingOK(search1, search2, user1, user2) {
		const formatid = toId(this.formatid);
		if (!user1 || !user2) {
			// This should never happen.
			Monitor.crashlog(new Error(`Matched user ${user1 ? search2.userid : search1.userid} not found`), "The matchmaker");
			return false;
		}

		// users must be different
		if (user1 === user2) return false;

		if (Config.fakeladder) {
			user1.lastMatch = user2.userid;
			user2.lastMatch = user1.userid;
			return true;
		}

		// users must have different IPs
		if (user1.latestIp === user2.latestIp) return false;

		// users must not have been matched immediately previously
		if (user1.lastMatch === user2.userid || user2.lastMatch === user1.userid) return false;

		// search must be within range
		let searchRange = 100;
		let elapsed = Date.now() - Math.min(search1.time, search2.time);
		if (formatid === 'gen7ou' || formatid === 'gen7oucurrent' ||
				formatid === 'gen7oususpecttest' || formatid === 'gen7randombattle') {
			searchRange = 50;
		}

		searchRange += elapsed / 300; // +1 every .3 seconds
		if (searchRange > 300) searchRange = 300 + (searchRange - 300) / 10; // +1 every 3 sec after 300
		if (searchRange > 600) searchRange = 600;
		if (Math.abs(search1.rating - search2.rating) > searchRange) return false;

		user1.lastMatch = user2.userid;
		user2.lastMatch = user1.userid;
		return true;
	}

	/**
	 * Starts a search for a battle for a user under the given format.
	 * @param {BattleReady} newSearch
	 * @param {User} user
	 */
	addSearch(newSearch, user) {
		const formatid = newSearch.formatid;
		let formatTable = Ladders.searches.get(formatid);
		if (!formatTable) {
			formatTable = new Map();
			Ladders.searches.set(formatid, formatTable);
		}
		if (formatTable.has(user.userid)) {
			user.popup(`Couldn't search: You are already searching for a ${formatid} battle.`);
			return;
		}

		// In order from longest waiting to shortest waiting
		for (let search of formatTable.values()) {
			const searcher = this.getSearcher(search);
			if (!searcher) continue;
			const matched = this.matchmakingOK(search, newSearch, searcher, user);
			if (matched) {
				formatTable.delete(search.userid);
				Ladder.match(search, newSearch);
				return;
			}
		}

		formatTable.set(newSearch.userid, newSearch);
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
			const matchmaker = Ladders(formatid);
			let longest = /** @type {[BattleReady, User]?} */ (null);
			for (let search of formatTable.values()) {
				if (!longest) {
					const longestSearcher = matchmaker.getSearcher(search);
					if (!longestSearcher) continue;
					longest = [search, longestSearcher];
					continue;
				}
				let searcher = matchmaker.getSearcher(search);
				if (!searcher) continue;

				let [longestSearch, longestSearcher] = longest;
				let matched = matchmaker.matchmakingOK(search, longestSearch, searcher, longestSearcher);
				if (matched) {
					formatTable.delete(search.userid);
					formatTable.delete(longestSearch.userid);
					Ladder.match(longestSearch, search);
					return;
				}
			}
		}
	}

	/**
	 * @param {BattleReady} ready1
	 * @param {BattleReady} ready2
	 */
	static match(ready1, ready2) {
		if (ready1.formatid !== ready2.formatid) throw new Error(`Format IDs don't match`);
		const user1 = Users(ready1.userid);
		const user2 = Users(ready2.userid);
		if (!user1) {
			if (!user2) return false;
			user2.popup(`Sorry, your opponent ${ready1.userid} went offline before your battle could start.`);
			return false;
		}
		if (!user2) {
			user1.popup(`Sorry, your opponent ${ready2.userid} went offline before your battle could start.`);
			return false;
		}
		Rooms.createBattle(ready1.formatid, {
			p1: user1,
			p1team: ready1.team,
			p2: user2,
			p2team: ready2.team,
			rated: Math.min(ready1.rating, ready2.rating),
		});
	}
}

/**
 * @param {string} formatid
 */
function getLadder(formatid) {
	return new Ladder(formatid);
}

/** @type {?NodeJS.Timer} */
let periodicMatchInterval = setInterval(
	() => Ladder.periodicMatch(),
	PERIODIC_MATCH_INTERVAL
);

const Ladders = Object.assign(getLadder, {
	BattleReady,
	LadderStore,
	Ladder,

	cancelSearches: Ladder.cancelSearches,
	updateSearch: Ladder.updateSearch,
	rejectChallenge: Ladder.rejectChallenge,
	acceptChallenge: Ladder.acceptChallenge,
	cancelChallenging: Ladder.cancelChallenging,
	clearChallenges: Ladder.clearChallenges,
	updateChallenges: Ladder.updateChallenges,
	visualizeAll: Ladder.visualizeAll,
	getSearches: Ladder.getSearches,
	match: Ladder.match,

	searches,
	challenges,
	periodicMatchInterval,

	// tells the client to ask the server for format information
	formatsListPrefix: LadderStore.formatsListPrefix,
	/** @type {true | false | 'db'} */
	disabled: false,
});

module.exports = Ladders;
