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

const fs = require('fs');

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
		if (('Config' in global) && Config.logladderip) {
			this.ladderIpLog = fs.createWriteStream('logs/ladderip/ladderip.txt', {encoding: 'utf8', flags: 'a'});
		} else {
			// Prevent there from being two possible hidden classes an instance
			// of Matchmaker can have.
			this.ladderIpLog = new (require('stream')).Writable();
		}

		let lastBattle;
		try {
			lastBattle = fs.readFileSync('logs/lastbattle.txt', 'utf8');
		} catch (e) {}
		this.lastBattle = (!lastBattle || isNaN(lastBattle)) ? 0 : +lastBattle;

		this.writeNumRooms = (() => {
			let writing = false;
			let lastBattle = -1; // last lastBattle to be written to file
			return () => {
				if (writing) return;

				// batch writing lastbattle.txt for every 10 battles
				if (lastBattle >= this.lastBattle) return;
				lastBattle = this.lastBattle + 10;

				let filename = 'logs/lastbattle.txt';
				writing = true;
				fs.writeFile(`${filename}.0`, '' + lastBattle, () => {
					fs.rename(`${filename}.0`, filename, () => {
						writing = false;
						lastBattle = null;
						filename = null;
						if (lastBattle < this.lastBattle) {
							setImmediate(() => this.writeNumRooms());
						}
					});
				});
			};
		})();

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
		formatid = Tools.getFormat(formatid).id;
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
		if (formatid === 'ou' || formatid === 'oucurrent' ||
				formatid === 'oususpecttest' || formatid === 'randombattle') {
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

	startBattle(p1, p2, format, p1team, p2team, options) {
		p1 = Users.get(p1);
		p2 = Users.get(p2);
		if (!p1 || !p2) {
			// most likely, a user was banned during the battle start procedure
			this.cancelSearch(p1);
			this.cancelSearch(p2);
			return;
		}
		if (p1 === p2) {
			this.cancelSearch(p1);
			this.cancelSearch(p2);
			p1.popup("You can't battle your own account. Please use something like Private Browsing to battle yourself.");
			return;
		}

		if (Rooms.global.lockdown === true) {
			this.cancelSearch(p1);
			this.cancelSearch(p2);
			p1.popup("The server is restarting. Battles will be available again in a few minutes.");
			p2.popup("The server is restarting. Battles will be available again in a few minutes.");
			return;
		}

		//console.log('BATTLE START BETWEEN: ' + p1.userid + ' ' + p2.userid);
		let i = this.lastBattle + 1;
		let roomPrefix = `battle-${format.toLowerCase().replace(/[^a-z0-9]+/g, '')}-`;
		while (Rooms.rooms.has(`${roomPrefix}${i}`)) {
			i++;
		}
		this.lastBattle = i;
		this.writeNumRooms();

		let newRoom = Rooms.createBattle(`${roomPrefix}${i}`, format, p1, p2, options);
		p1.joinRoom(newRoom);
		p2.joinRoom(newRoom);
		newRoom.battle.addPlayer(p1, p1team);
		newRoom.battle.addPlayer(p2, p2team);
		this.cancelSearch(p1);
		this.cancelSearch(p2);
		if (Config.reportbattles) {
			let reportRoom = Rooms(Config.reportbattles === true ? 'lobby' : Config.reportbattles);
			if (reportRoom) {
				reportRoom
					.add(`|b|${newRoom.id}|${p1.getIdentity()}|${p2.getIdentity()}`)
					.update();
			}
		}
		if (Config.logladderip && options.rated) {
			this.ladderIpLog.write(
				`${p1.userid}: ${p1.latestIp}\n` +
				`${p2.userid}: ${p2.latestIp}\n`
			);
		}
		return newRoom;
	}
}

module.exports = {
	Search,
	Matchmaker,
	matchmaker: new Matchmaker(),
};
