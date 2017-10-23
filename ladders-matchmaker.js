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
		/**
		 * formatid:userid:Search
		 * @type {Map<string, Map<string, Search>>}
		 */
		this.searches = new Map();
		/** @type {?NodeJS.Timer} */
		this.periodicMatchInterval = setInterval(
			() => this.periodicMatch(),
			PERIODIC_MATCH_INTERVAL
		);
	}

	/**
	 * @param {User} user
	 * @param {string} formatid
	 * @return {boolean}
	 */
	cancelSearch(user, formatid) {
		formatid = toId(formatid);

		const formatTable = this.searches.get(formatid);
		if (!formatTable) return false;
		if (!formatTable.has(user.userid)) return false;
		formatTable.delete(user.userid);

		user.updateSearch();
		return true;
	}

	/**
	 * @param {User} user
	 * @return {number} cancel count
	 */
	cancelSearches(user) {
		let cancelCount = 0;

		for (let formatTable of this.searches.values()) {
			const search = formatTable.get(user.userid);
			if (!search) continue;
			formatTable.delete(user.userid);
			cancelCount++;
		}

		user.updateSearch();
		return cancelCount;
	}

	/**
	 * @param {Search} search
	 * @param {string} formatid
	 */
	getSearcher(search, formatid) {
		const user = Users.get(search.userid);
		if (!user || !user.connected || user.userid !== search.userid) {
			const formatTable = this.searches.get(formatid);
			if (formatTable) formatTable.delete(search.userid);
			if (user && user.connected) {
				user.popup(`You changed your name and are no longer looking for a battle in ${formatid}`);
				user.updateSearch();
			}
			return;
		}
		return user;
	}

	/**
	 * @param {User} user
	 */
	getSearches(user) {
		let searches = [];
		for (const [formatid, formatTable] of this.searches) {
			if (formatTable.has(user.userid)) searches.push(formatid);
		}
		return searches;
	}
	/**
	 * @param {User} user
	 * @param {string} formatid
	 */
	hasSearch(user, formatid) {
		const formatTable = this.searches.get(formatid);
		if (!formatTable) return false;
		return formatTable.has(user.userid);
	}

	/**
	 * Validates a user's team and fetches their rating for a given format
	 * before creating a search for a battle.
	 * @param {User} user
	 * @param {string} formatid
	 * @return {Promise<void>}
	 */
	async searchBattle(user, formatid) {
		if (!user.connected) return;

		const format = Dex.getFormat(formatid);
		formatid = format.id;
		let oldUserid = user.userid;
		let validTeam;
		let rating;
		try {
			[validTeam, rating] = await Promise.all([
				user.prepBattle(formatid, 'search', null),
				format.rated !== false ? Ladders(formatid).getRating(user.userid) : Promise.resolve(-1),
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
	 * Verifies whether or not a match made between two users is valid. Returns
	 * @param {Search} search1
	 * @param {Search} search2
	 * @param {User=} user1
	 * @param {User=} user2
	 * @param {string} formatid
	 * @return {number | false | void}
	 */
	matchmakingOK(search1, search2, user1, user2, formatid) {
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
	 * Atarts a search for a battle for a user under the given format.
	 * @param {Search} newSearch
	 * @param {User} user
	 * @param {string} formatid
	 */
	addSearch(newSearch, user, formatid) {
		let formatTable = this.searches.get(formatid);
		if (!formatTable) {
			formatTable = new Map();
			this.searches.set(formatid, formatTable);
		}
		if (formatTable.has(user.userid)) {
			user.popup(`Couldn't search: You are already searching for a ${formatid} battle.`);
			return;
		}

		// In order from longest waiting to shortest waiting
		for (let search of formatTable.values()) {
			const searcher = this.getSearcher(search, formatid);
			if (!searcher) continue;
			let minRating = this.matchmakingOK(search, newSearch, searcher, user, formatid);
			if (minRating) {
				formatTable.delete(search.userid);
				Rooms.createBattle(formatid, {
					p1: searcher,
					p1team: search.team,
					p2: user,
					p2team: newSearch.team,
					rated: minRating,
				});
				return;
			}
		}

		formatTable.set(newSearch.userid, newSearch);
		user.updateSearch();
	}

	/**
	 * Creates a match for a new battle for each format in this.searches if a
	 * valid match can be made. This is run periodically depending on
	 * PERIODIC_MATCH_INTERVAL.
	 */
	periodicMatch() {
		// In order from longest waiting to shortest waiting
		for (const [formatid, formatTable] of this.searches) {
			let longestSearch, longestSearcher;
			for (let search of formatTable.values()) {
				if (!longestSearch) {
					longestSearcher = this.getSearcher(search, formatid);
					if (!longestSearcher) continue;
					longestSearch = search;
					continue;
				}
				let searcher = this.getSearcher(search, formatid);
				if (!searcher) continue;

				let minRating = this.matchmakingOK(search, longestSearch, searcher, longestSearcher, formatid);
				if (minRating) {
					formatTable.delete(search.userid);
					formatTable.delete(longestSearch.userid);
					Rooms.createBattle(formatid, {
						p1: searcher,
						p1team: search.team,
						p2: longestSearcher,
						p2team: longestSearch.team,
						rated: minRating,
					});
					return;
				}
			}
		}
	}
}

module.exports = {
	Search,
	Matchmaker,
	matchmaker: new Matchmaker(),
};
