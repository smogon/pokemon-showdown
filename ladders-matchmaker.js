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

/** @type {number} */
const PERIODIC_MATCH_INTERVAL = 60 * 1000;

/**
 * A validated team for a battle format.
 * @typedef {string | false} ValidatedTeam
 *
 * A battle format ID.
 * @typedef {string} FormatID
 *
 * A set containing all pending searches under a given battle format ID.
 * @typedef {Set<Search>} FormatSearches
 *
 * A map containing all SearchSets for all battle format IDs with pending
 * searches.
 * @typedef {Map<FormatID, FormatSearches>} Searches
 */

/**
 * Represents a user's search for a battle in a format.
 */
class Search {
	/**
	 * @param {string} userid
	 * @param {ValidatedTeam} team
	 * @param {number} [rating = 1000]
	 */
	constructor(userid, team, rating = 1000) {
		/** @type {string} */
		this.userid = userid;
		/** @type {ValidatedTeam} */
		this.team = team;
		/** @type {number} */
		this.rating = rating;
		/** @type {number} */
		this.time = Date.now();
	}
}

/**
 * Holds a map of all pending searches for battles in all formats at any given
 * point in time, periodically matching up pairs of searches in each format
 * within a reasonable rating range of each other.
 */
class Matchmaker {
	constructor() {
		/** @type {Searches} */
		this.searches = new Map();
		/** @type {NodeJS.Timer} */
		this.periodicMatchInterval = setInterval(
			() => this.periodicMatch(),
			PERIODIC_MATCH_INTERVAL
		);
	}

	/**
	 * Cancels a user's search for a battle. If a format is given, cancels the
	 * search under that specific format, otherwise cancels the first search
	 * found in the user's search list.
	 *
	 * @param {User} user
	 * @param {FormatID=} format
	 * @return {boolean}
	 */
	cancelSearch(user, format) {
		if (format && !user.searching[format]) return false;

		let searchedFormats = Object.keys(user.searching);
		if (!searchedFormats.length) return false;

		for (let searchedFormat of searchedFormats) {
			if (format && searchedFormat !== format) continue;

			let formatSearches = this.searches.get(searchedFormat);
			// @ts-ignore
			for (let search of formatSearches) {
				if (search.userid !== user.userid) continue;
				// @ts-ignore
				formatSearches.delete(search);
				delete user.searching[searchedFormat];
				break;
			}
		}

		user.updateSearch();
		return true;
	}

	/**
	 * Validates a user's team and rating for a given format before creating a
	 * search for a battle for them.
	 *
	 * @param {User} user
	 * @param {FormatID} format
	 * @return {Promise<void>}
	 */
	async searchBattle(user, format) {
		if (!user.connected) return;

		let formatid = Dex.getFormat(format).id;
		let userid;
		let validTeam;
		let rating;
		try {
			[userid, validTeam, rating] = await Promise.all([
				Promise.resolve(user.userid),
				user.prepBattle(formatid, 'search', null),
				Ladders(formatid).getRating(user.userid),
			]);
		} catch (e) {
			// Rejects if ladders are disabled, or if we retrieved the rating
			// but the user had changed their name.
			if (Ladders.disabled) user.popup(`The ladder is currently disabled due to high server load.`);

			// User feedback for renames handled elsewhere.
			return;
		}

		if (userid !== user.userid) return;
		return this.finishSearchBattle(user, formatid, validTeam, rating);
	}

	/**
	 * Constructs the search for a battle for a user after validating their
	 * team and fetching their rating in the given format.
	 *
	 * @param {User} user
	 * @param {FormatID} formatid
	 * @param {ValidatedTeam} validTeam
	 * @param {number} rating
	 */
	finishSearchBattle(user, formatid, validTeam, rating) {
		if (validTeam === false) return;

		const search = new Search(user.userid, validTeam, rating);
		this.addSearch(search, user, formatid);
	}

	/**
	 * Verifies whether or not a match made between two users' search instances
	 * is valid.
	 *
	 * @param {Search} search1
	 * @param {Search} search2
	 * @param {User} user1
	 * @param {User} user2
	 * @param {FormatID} formatid
	 * @return {number | false | void}
	 */
	matchmakingOK(search1, search2, user1, user2, formatid) {
		// This should never happen.
		if (!user1 || !user2) {
			return void require('./crashlogger')(new Error(`Matched user ${user1 ? search2.userid : search1.userid} not found`), "The main process");
		}

		// users must be different
		if (user1 === user2) return false;

		// users must have different IPs
		if (user1.latestIp === user2.latestIp) return false;

		// users must not have been matched immediately previously
		if (user1.lastMatch === user2.userid || user2.lastMatch === user1.userid) return false;

		// search must be within range
		let searchRange = 100, elapsed = Date.now() - Math.min(search1.time, search2.time);
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
		return Math.min(search1.rating, search2.rating) || 1;
	}

	/**
	 * Adds a search for a battle under a given format for a user.
	 *
	 * @param {Search} newSearch
	 * @param {User} user
	 * @param {FormatID} formatid
	 */
	addSearch(newSearch, user, formatid) {
		// Filter racing conditions
		if (!user.connected || user !== Users.getExact(user.userid)) return;
		if (user.searching[formatid]) return;

		// Prioritize players who have been searching for a match the longest.
		let formatSearches = this.searches.get(formatid);
		if (!formatSearches) {
			formatSearches = new Set();
			this.searches.set(formatid, formatSearches);
		}

		for (let search of formatSearches) {
			let searchUser = Users.getExact(search.userid);
			let minRating = this.matchmakingOK(search, newSearch, searchUser, user, formatid);
			if (minRating) {
				delete user.searching[formatid];
				delete searchUser.searching[formatid];
				formatSearches.delete(search);
				this.startBattle(searchUser, user, formatid, search.team, newSearch.team, {rated: !Ladders.disabled && minRating});
				return;
			}
		}
		user.searching[formatid] = 1;
		formatSearches.add(newSearch);
		user.updateSearch();
	}

	/**
	 * Performs matchmaking for each format containing any number of searches
	 * based on PERIODIC_MATCH_INTERVAL.
	 */
	periodicMatch() {
		this.searches.forEach((formatSearches, formatid) => {
			if (formatSearches.size < 2) return;

			// Prioritize players who have been searching for a match the longest.
			let [longestSearch, ...searches] = formatSearches;
			let longestSearcher = Users.getExact(longestSearch.userid);
			for (let search of searches) {
				let searchUser = Users.getExact(search.userid);
				let minRating = this.matchmakingOK(search, longestSearch, searchUser, longestSearcher, formatid);
				if (minRating) {
					delete longestSearcher.searching[formatid];
					delete searchUser.searching[formatid];
					formatSearches.delete(search);
					formatSearches.delete(longestSearch);
					this.startBattle(searchUser, longestSearcher, formatid, search.team, longestSearch.team, {rated: !Ladders.disabled && minRating});
					return;
				}
			}
		});
	}

	/**
	 * Verifies whether or not a match made between two users is valid before
	 * creating their battle room.
	 *
	 * @param {User | string} player1
	 * @param {User | string} player2
	 * @param {FormatID} format
	 * @return {boolean}
	 */
	verifyPlayers(player1, player2, format) {
		let p1 = (typeof player1 === 'string') ? Users(player1) : player1;
		let p2 = (typeof player2 === 'string') ? Users(player2) : player2;
		if (!p1 || !p2) {
			this.cancelSearch(p1, format);
			this.cancelSearch(p2, format);
			return false;
		}

		if (p1 === p2) {
			this.cancelSearch(p1, format);
			this.cancelSearch(p2, format);
			p1.popup("You can't battle your own account. Please use something like Private Browsing to battle yourself.");
			return false;
		}

		if (Rooms.global.lockdown === true) {
			this.cancelSearch(p1, format);
			this.cancelSearch(p2, format);
			p1.popup("The server is restarting. Battles will be available again in a few minutes.");
			p2.popup("The server is restarting. Battles will be available again in a few minutes.");
			return false;
		}

		return true;
	}

	/**
	 * Creates a battle room for two users after either one user accepts
	 * another's challenge request or after having been matched together by the
	 * matchmaker.
	 *
	 * @param {User | string} p1
	 * @param {User | string} p2
	 * @param {FormatID} format
	 * @param {ValidatedTeam} p1team
	 * @param {ValidatedTeam} p2team
	 * @param {Object} options
	 * @return {BattleRoom | void}
	 */
	startBattle(p1, p2, format, p1team, p2team, options) {
		if (!this.verifyPlayers(p1, p2, format)) return null;

		let roomid = Rooms.global.prepBattleRoom(format);
		let room = Rooms.createBattle(roomid, format, p1, p2, options);
		p1.joinRoom(room);
		p2.joinRoom(room);
		room.battle.addPlayer(p1, p1team);
		room.battle.addPlayer(p2, p2team);
		this.cancelSearch(p1, format);
		this.cancelSearch(p2, format);
		Rooms.global.onCreateBattleRoom(p1, p2, room, options);

		return room;
	}
}

module.exports = {
	Search,
	Matchmaker,
	matchmaker: new Matchmaker(),
};
