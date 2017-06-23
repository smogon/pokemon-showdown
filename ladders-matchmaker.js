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

function Search(userid, team, rating = 1000) {
	this.userid = userid;
	this.team = team;
	this.rating = rating;
	this.time = new Date().getTime();
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

	searchBattle(user, formatid) {
		if (!user.connected) return;
		formatid = Dex.getFormat(formatid).id;
		return user.prepBattle(formatid, 'search', null)
			.then(result => this.finishSearchBattle(user, formatid, result));
	}

	finishSearchBattle(user, formatid, result) {
		if (!result) return;

		// Get the user's rating before actually starting to search.
		Ladders(formatid).getRating(user.userid).then(rating => {
			let search = new Search(user.userid, user.team, rating);
			this.addSearch(search, user, formatid);
		}, error => {
			// Rejects if we retrieved the rating but the user had changed their name;
			// the search simply doesn't happen in this case.
		});
	}

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
				this.startBattle(searchUser, user, formatid, search.team, newSearch.team, {rated: minRating});
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
					this.startBattle(searchUser, longestSearcher, formatid, search.team, longestSearch.team, {rated: minRating});
					return;
				}
			}
		});
	}

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

	startBattle(p1, p2, format, p1team, p2team, options) {
		if (!this.verifyPlayers(p1, p2, format)) return;

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
