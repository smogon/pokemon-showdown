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
 * This represents a user's search for a battle under a format.
 */
class Search {
	/**
	 * @param {string} userid
	 * @param {string} team
	 * @param {number} [rating = 1000]
	 */
	constructor(userid, team, rating = 1000) {
		/** @type {string} */
		this.userid = userid;
		/** @type {string} */
		this.team = team;
		/** @type {number} */
		this.rating = rating;
		/** @type {number} */
		this.time = Date.now();
	}
}

/**
 * This keeps track of searches for battles, creating a new battle for a newly
 * added search if a valid match can be made, otherwise periodically
 * attempting to make a match with looser restrictions until one can be made.
 */
class Matchmaker {
	constructor() {
		/** @type {Map<string, Set<Search>>} */
		this.searches = new Map();
		/** @type {?NodeJS.Timer} */
		this.periodicMatchInterval = setInterval(
			() => this.periodicMatch(),
			PERIODIC_MATCH_INTERVAL
		);
	}

	/**
	 * Cancels a user's search for a battle under a given format.
	 * @param {User} user
	 * @param {string} format
	 * @return {boolean}
	 */
	cancelSearch(user, format) {
		if (format && !user.searching[format]) return false;
		let searchedFormats = Object.keys(user.searching);
		if (!searchedFormats.length) return false;

		for (let searchedFormat of searchedFormats) {
			if (format && searchedFormat !== format) continue;
			let formatSearches = this.searches.get(searchedFormat);
			if (!formatSearches) continue;
			for (let search of formatSearches) {
				if (search.userid !== user.userid) continue;
				formatSearches.delete(search);
				delete user.searching[searchedFormat];
				break;
			}
		}

		user.updateSearch();
		return true;
	}

	/**
	 * Validates a user's team and fetches their rating for a given format
	 * before creating a search for a battle.
	 * @param {User} user
	 * @param {string} format
	 * @return {Promise<void>}
	 */
	async searchBattle(user, format) {
		if (!user.connected) return;

		let formatid = Dex.getFormat(format).id;
		let oldUserid = user.userid;
		let validTeam;
		let rating;
		try {
			[validTeam, rating] = await Promise.all([
				user.prepBattle(formatid, 'search', null),
				Ladders(formatid).getRating(user.userid),
			]);
		} catch (e) {
			// Rejects iff ladders are disabled, or if we
			// retrieved the rating but the user had changed their name.
			if (Ladders.disabled) return user.popup(`The ladder is currently disabled due to high server load.`);
			// User feedback for renames handled elsewhere.
			return;
		}

		if (oldUserid !== user.userid) return;
		if (validTeam === false) return;

		const search = new Search(user.userid, validTeam, rating);
		this.addSearch(search, user, formatid);
	}

	/**
	 * Verifies whether or not a match made between two users is valid.
	 * @param {Search} search1
	 * @param {Search} search2
	 * @param {?User} [user1 = null]
	 * @param {?User} [user2 = null]
	 * @param {string} format
	 * @return {number | false | void}
	 */
	matchmakingOK(search1, search2, user1 = null, user2 = null, format) {
		if (!user1 || !user2) {
			// This should never happen.
			return void require('./crashlogger')(new Error(`Matched user ${user1 ? search2.userid : search1.userid} not found`), "The main process");
		}

		// users must be different
		if (user1 === user2) return false;

		// users must have different IPs
		if (user1.latestIp === user2.latestIp) return false;

		// users must not have been matched immediately previously
		if (user1.lastMatch === user2.userid || user2.lastMatch === user1.userid) return false;

		// search must be within range
		let searchRange = 100;
		let elapsed = Date.now() - Math.min(search1.time, search2.time);
		if (format === 'gen7ou' || format === 'gen7oucurrent' ||
				format === 'gen7oususpecttest' || format === 'gen7randombattle') {
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
	 * Atarts a search for a battle for a user under the given format.
	 * @param {Search} newSearch
	 * @param {User} user
	 * @param {string} format
	 */
	addSearch(newSearch, user, format) {
		// Filter racing conditions
		if (!user.connected || user !== Users.getExact(user.userid)) return;
		if (user.searching[format]) return;

		// Prioritize players who have been searching for a match the longest.
		let formatSearches = this.searches.get(format);
		if (!formatSearches) {
			formatSearches = new Set();
			this.searches.set(format, formatSearches);
		}

		for (let search of formatSearches) {
			let searchUser = Users.getExact(search.userid);
			let minRating = this.matchmakingOK(search, newSearch, searchUser, user, format);
			if (minRating) {
				delete user.searching[format];
				delete searchUser.searching[format];
				formatSearches.delete(search);
				Rooms.createBattle(format, {
					p1: searchUser,
					p1team: search.team,
					p2: user,
					p2team: newSearch.team,
					rated: !Ladders.disabled && minRating,
				});
				return;
			}
		}

		user.searching[format] = 1;
		formatSearches.add(newSearch);
		user.updateSearch();
	}

	/**
	 * Creates a match for a new battle for each format in this.searches if a
	 * valid match can be made. This is run periodically depending on
	 * PERIODIC_MATCH_INTERVAL.
	 */
	periodicMatch() {
		this.searches.forEach((formatSearches, format) => {
			if (formatSearches.size < 2) return;

			// Prioritize players who have been searching for a match the longest.
			let [longestSearch, ...searches] = formatSearches;
			let longestSearcher = Users.getExact(longestSearch.userid);
			for (let search of searches) {
				let searchUser = Users.getExact(search.userid);
				let minRating = this.matchmakingOK(search, longestSearch, searchUser, longestSearcher, format);
				if (minRating) {
					delete longestSearcher.searching[format];
					delete searchUser.searching[format];
					formatSearches.delete(search);
					formatSearches.delete(longestSearch);
					Rooms.createBattle(format, {
						p1: searchUser,
						p1team: search.team,
						p2: longestSearcher,
						p2team: longestSearch.team,
						rated: !Ladders.disabled && minRating,
					});
					return;
				}
			}
		});
	}
}

module.exports = {
	Search,
	Matchmaker,
	matchmaker: new Matchmaker(),
};
