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

const PERIODIC_MATCH_INTERVAL = 60 * 1000;

class Search {
	constructor(userid, team, rating = 1000) {
		this.userid = userid;
		this.team = team;
		this.rating = rating;
		this.time = Date.now();
	}

	setRating(rating) {
		this.rating = rating;
	}

	setStart() {
		this.time = Date.now();
	}
}

class Matchmaker {
	constructor() {
		this.searches = new Map();
		this.periodicMatchInterval = setInterval(
			() => this.periodicMatch(),
			PERIODIC_MATCH_INTERVAL
		);
	}

	cancelSearch(user, format) {
		if (format && !user.searching[format]) return false;
		let searchedFormats = Object.keys(user.searching);
		if (!searchedFormats.length) return false;

		for (let searchedFormat of searchedFormats) {
			if (format && searchedFormat !== format) continue;
			let formatSearches = this.searches.get(searchedFormat);
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

	async searchBattle(user, formatid) {
		if (!user.connected) return;
		formatid = Dex.getFormat(formatid).id;
		let oldUserid = user.userid;
		let validTeam, rating;
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
				Rooms.createBattle(formatid, {
					p1: searchUser,
					p1team: search.team,
					p2: user,
					p2team: newSearch.team,
					rated: !Ladders.disabled && minRating,
				});
				return;
			}
		}
		user.searching[formatid] = 1;
		formatSearches.add(newSearch);
		user.updateSearch();
	}

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
					Rooms.createBattle(formatid, {
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
