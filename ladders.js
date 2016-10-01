/**
 * Ladder library
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file handles ladders for all servers other than
 * play.pokemonshowdown.com.
 *
 * Specifically, this is the file that handles calculating and keeping
 * track of players' Elo ratings for all formats.
 *
 * Matchmaking is currently still implemented in rooms.js.
 *
 * @license MIT license
 */

'use strict';

const fs = require('fs');

let Ladders = module.exports = getLadder;

Ladders.get = Ladders;

// tells the client to ask the server for format information
Ladders.formatsListPrefix = '|,LL';

// ladderCaches = {formatid: ladder OR Promise(ladder)}
// Use Ladders(formatid).ladder to guarantee a Promise(ladder).
// ladder is basically a 2D array representing the corresponding ladder.tsv
//   with userid in front
// ladder = [ladderRow]
// ladderRow = [userid, elo, username, w, l, t]
let ladderCaches = Ladders.ladderCaches = Object.create(null);

class Ladder {
	constructor(formatid) {
		this.formatid = toId(formatid);
		this.loadedLadder = null;
		this.ladder = this.load();
	}

	/**
	 * Internal function, returns a Promise for a ladder
	 */
	load() {
		// ladderCaches[formatid]
		if (this.formatid in ladderCaches) {
			let cachedLadder = ladderCaches[this.formatid];
			if (cachedLadder.then) {
				return cachedLadder.then(ladder => {
					this.loadedLadder = ladder;
					return ladder;
				});
			} else {
				return Promise.resolve(this.loadedLadder = cachedLadder);
			}
		}
		return (ladderCaches[this.formatid] = new Promise((resolve, reject) => {
			fs.readFile('config/ladders/' + this.formatid + '.tsv', (err, data) => {
				if (err) {
					this.loadedLadder = ladderCaches[this.formatid] = [];
					// console.log('Ladders(' + this.formatid + ') err loading tsv: ' + JSON.stringify(this.loadedLadder));
					resolve(this.loadedLadder);
					return;
				}
				let ladder = [];
				let dataLines = ('' + data).split('\n');
				for (let i = 1; i < dataLines.length; i++) {
					let line = dataLines[i].trim();
					if (!line) continue;
					let row = line.split('\t');
					ladder.push([toId(row[1]), Number(row[0]), row[1], Number(row[2]), Number(row[3]), Number(row[4]), row[5]]);
				}
				this.loadedLadder = ladderCaches[this.formatid] = ladder;
				// console.log('Ladders(' + this.formatid + ') loaded tsv: ' + JSON.stringify(this.loadedLadder));
				resolve(this.loadedLadder);
			});
		}));
	}

	/**
	 * Saves the ladder in config/ladders/[formatid].tsv
	 *
	 * Called automatically by updateRating, so you don't need to manually
	 * call this.
	 */
	save() {
		if (this.saving) return;
		this.saving = true;
		if (!this.loadedLadder) {
			this.ladder.then(() => {
				this.save();
			});
			return;
		}
		if (!this.loadedLadder.length) {
			this.saving = false;
			return;
		}
		let stream = fs.createWriteStream('config/ladders/' + this.formatid + '.tsv');
		stream.write('Elo\tUsername\tW\tL\tT\tLast update\r\n');
		for (let i = 0; i < this.loadedLadder.length; i++) {
			let row = this.loadedLadder[i];
			stream.write(row.slice(1).join('\t') + '\r\n');
		}
		stream.end();
		this.saving = false;
	}

	/**
	 * Gets the index of a user in the ladder array.
	 *
	 * If createIfNeeded is true, the user will be created and added to
	 * the ladder array if it doesn't already exist.
	 */
	indexOfUser(username, createIfNeeded) {
		let userid = toId(username);
		for (let i = 0; i < this.loadedLadder.length; i++) {
			if (this.loadedLadder[i][0] === userid) return i;
		}
		if (createIfNeeded) {
			let index = this.loadedLadder.length;
			this.loadedLadder.push([userid, 1000, username, 0, 0, 0]);
			return index;
		}
		return -1;
	}

	/**
	 * Returns [formatid, html], where html is an the HTML source of a
	 * ladder toplist, to be displayed directly in the ladder tab of the
	 * client.
	 */
	getTop() {
		let formatid = this.formatid;
		let name = Tools.getFormat(formatid).name;
		return this.ladder.then(ladder => {
			let buf = `<h3>${name} Top 100</h3>`;
			buf += `<table>`;
			buf += `<tr><th>` + ['', 'Username', '<abbr title="Elo rating">Elo</abbr>', 'W', 'L', 'T'].join(`</th><th>`) + `</th></tr>`;
			for (let i = 0; i < ladder.length; i++) {
				let row = ladder[i];
				buf += `<tr><td>` + [
					i + 1, row[2], `<strong>${Math.round(row[1])}</strong>`, row[3], row[4], row[5],
				].join(`</td><td>`) + `</td></tr>`;
			}
			return [formatid, buf];
		});
	}

	/**
	 * Returns a Promise for the Elo rating of a user
	 */
	getRating(userid) {
		let formatid = this.formatid;
		let user = Users.getExact(userid);
		if (user && user.mmrCache[formatid]) {
			return Promise.resolve(user.mmrCache[formatid]);
		}
		return this.ladder.then(() => {
			if (user.userid !== userid) return;
			let index = this.indexOfUser(userid);
			if (index < 0) return (user.mmrCache[formatid] = 1000);
			return (user.mmrCache[formatid] = this.loadedLadder[index][1]);
		});
	}

	/**
	 * Internal method. Update the Elo rating of a user.
	 */
	updateRow(row, score, foeElo) {
		let elo = row[1];

		// The K factor determines how much your Elo changes when you win or
		// lose games. Larger K means more change.
		// In the "original" Elo, K is constant, but it's common for K to
		// get smaller as your rating goes up
		let K = 50;

		// dynamic K-scaling (optional)
		if (elo < 1200) {
			if (score < 0.5) {
				K = 10 + (elo - 1000) * 40 / 200;
			} else if (score > 0.5) {
				K = 90 - (elo - 1000) * 40 / 200;
			}
		} else if (elo > 1350) {
			K = 40;
		} else if (elo > 1600) {
			K = 32;
		}

		// main Elo formula
		let E = 1 / (1 + Math.pow(10, (foeElo - elo) / 400));
		elo += K * (score - E);

		if (elo < 1000) elo = 1000;

		row[1] = elo;
		if (score > 0.6) {
			row[3]++; // win
		} else if (score < 0.4) {
			row[4]++; // loss
		} else {
			row[5]++; // tie
		}
		row[6] = '' + new Date();
	}

	/**
	 * Update the Elo rating for two players after a battle, and display
	 * the results in the passed room.
	 */
	updateRating(p1name, p2name, p1score, room) {
		let formatid = this.formatid;
		this.ladder.then(() => {
			let p1newElo, p2newElo;
			try {
				let p1index = this.indexOfUser(p1name, true);
				let p1elo = this.loadedLadder[p1index][1];

				let p2index = this.indexOfUser(p2name, true);
				let p2elo = this.loadedLadder[p2index][1];

				this.updateRow(this.loadedLadder[p1index], p1score, p2elo);
				this.updateRow(this.loadedLadder[p2index], 1 - p1score, p1elo);

				p1newElo = this.loadedLadder[p1index][1];
				p2newElo = this.loadedLadder[p2index][1];

				// console.log('L: ' + this.loadedLadder.map(r => ''+Math.round(r[1])+' '+r[2]).join('\n'));

				// move p1 to its new location
				let newIndex = p1index;
				while (newIndex > 0 && this.loadedLadder[newIndex - 1][1] <= p1newElo) newIndex--;
				while (newIndex === p1index || (this.loadedLadder[newIndex] && this.loadedLadder[newIndex][1] > p1newElo)) newIndex++;
				// console.log('ni='+newIndex+', p1i='+p1index);
				if (newIndex !== p1index && newIndex !== p1index + 1) {
					let row = this.loadedLadder.splice(p1index, 1)[0];
					// adjust for removed row
					if (newIndex > p1index) newIndex--;
					if (p2index > p1index) p2index--;

					this.loadedLadder.splice(newIndex, 0, row);
					// adjust for inserted row
					if (p2index >= newIndex) p2index++;
				}

				// move p2
				newIndex = p2index;
				while (newIndex > 0 && this.loadedLadder[newIndex - 1][1] <= p2newElo) newIndex--;
				while (newIndex === p2index || (this.loadedLadder[newIndex] && this.loadedLadder[newIndex][1] > p2newElo)) newIndex++;
				// console.log('ni='+newIndex+', p2i='+p2index);
				if (newIndex !== p2index && newIndex !== p2index + 1) {
					let row = this.loadedLadder.splice(p2index, 1)[0];
					// adjust for removed row
					if (newIndex > p2index) newIndex--;

					this.loadedLadder.splice(newIndex, 0, row);
				}

				let p1 = Users.getExact(p1name);
				if (p1) p1.mmrCache[formatid] = +p1newElo;
				let p2 = Users.getExact(p2name);
				if (p2) p2.mmrCache[formatid] = +p2newElo;
				this.save();

				if (!room.battle) {
					console.log(`room expired before ladder update was received`);
					return;
				}

				let reasons = '' + (Math.round(p1newElo) - Math.round(p1elo)) + ' for ' + (p1score > 0.9 ? 'winning' : (p1score < 0.1 ? 'losing' : 'tying'));
				if (reasons.charAt(0) !== '-') reasons = '+' + reasons;
				room.addRaw(Chat.html`${p1name}'s rating: ${Math.round(p1elo)} &rarr; <strong>${Math.round(p1newElo)}</strong><br />(${reasons})`);

				reasons = '' + (Math.round(p2newElo) - Math.round(p2elo)) + ' for ' + (p1score > 0.9 ? 'losing' : (p1score < 0.1 ? 'winning' : 'tying'));
				if (reasons.charAt(0) !== '-') reasons = '+' + reasons;
				room.addRaw(Chat.html`${p2name}'s rating: ${Math.round(p2elo)} &rarr; <strong>${Math.round(p2newElo)}</strong><br />(${reasons})`);

				room.update();
			} catch (e) {
				if (!room.battle) return;
				room.addRaw(`There was an error calculating rating changes:`);
				room.add(e.stack);
				room.update();
			}

			if (!Tools.getFormat(formatid).noLog) {
				room.logBattle(p1score, p1newElo, p2newElo);
			}
		});
	}

	/**
	 * Returns a promise for a <tr> with all ratings for the current format.
	 */
	visualize(username) {
		return this.ladder.then(() => {
			let index = this.indexOfUser(username, false);

			if (index < 0) return '';

			let ratings = this.loadedLadder[index];

			let output = `<tr><td>${this.formatid}</td><td><strong>${Math.round(ratings[1])}</strong></td>`;
			return `${output}<td>${ratings[3]}</td><td>${ratings[4]}</td><td>${ratings[3] + ratings[4]}</td></tr>`;
		});
	}

	/**
	 * Returns a Promise for an array of strings of <tr>s for ladder ratings of the user
	 */
	static visualizeAll(username) {
		let ratings = [];
		for (let i in Tools.data.Formats) {
			if (Tools.data.Formats[i].searchShow) {
				ratings.push(Ladders(i).visualize(username));
			}
		}
		return Promise.all(ratings);
	}
}

function getLadder(formatid) {
	return new Ladder(formatid);
}

Ladders.Ladder = Ladder;
Ladders.visualizeAll = Ladder.visualizeAll;
