/**
 * Ladder library
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file handles ladders.
 *
 * @license MIT license
 */

/* global Ladders: true */
var Ladders = module.exports = getLadder;

var fs = require('fs');
var readline = require('readline');

function getLadder(formatid) {
	return new Ladder(formatid);
}

// tells the client to ask the server for format information
Ladders.formatsListPrefix = '|,LL';

// ladderCaches = {formatid: ladder OR Promise(ladder)}
// Use Ladders(formatid).ladder to guarantee a Promise(ladder).
// ladder is basically a 2D array representing the corresponding ladder.tsv
//   with userid in front
// ladder = [[userid, elo, username, w, l, t]]
var ladderCaches = Ladders.ladderCaches = Object.create(null);

function Ladder(formatid) {
	this.formatid = toId(formatid);
	this.loadedLadder = null;
	this.ladder = this.load();
}

Ladder.prototype.load = function () {
	// ladderCaches[formatid]
	if (this.formatid in ladderCaches) {
		var cachedLadder = ladderCaches[this.formatid];
		if (cachedLadder.then) {
			var self = this;
			return cachedLadder.then(function (ladder) {
				self.loadedLadder = ladder;
				return ladder;
			});
		} else {
			return Promise.resolve(this.loadedLadder = cachedLadder);
		}
	}
	var self = this;
	return (ladderCaches[this.formatid] = new Promise(function (resolve, reject) {
		fs.readFile('config/ladders/' + self.formatid + '.tsv', function (err, data) {
			if (err) {
				self.loadedLadder = ladderCaches[self.formatid] = [];
				console.log('Ladders(' + self.formatid + ') err loading tsv: ' + JSON.stringify(self.loadedLadder));
				resolve(self.loadedLadder);
				return;
			}
			var ladder = [];
			var dataLines = ('' + data).split('\n');
			for (var i = 1; i < dataLines.length; i++) {
				var line = dataLines[i].trim();
				if (!line) continue;
				var row = line.split('\t');
				ladder.push([toId(row[1]), Number(row[0]), row[1], Number(row[2]), Number(row[3]), Number(row[4]), row[5]]);
			}
			self.loadedLadder = ladderCaches[self.formatid] = ladder;
			console.log('Ladders(' + self.formatid + ') loaded tsv: ' + JSON.stringify(self.loadedLadder));
			resolve(self.loadedLadder);
		});
	}));
};

Ladder.prototype.save = function () {
	if (this.saving) return;
	this.saving = true;
	if (!this.loadedLadder) {
		var self = this;
		this.ladder.then(function () {
			self.save();
		});
		return;
	}
	if (!this.loadedLadder.length) {
		this.saving = false;
		return;
	}
	var stream = fs.createWriteStream('config/ladders/' + this.formatid + '.tsv');
	stream.write('Elo\tUsername\tW\tL\tT\tLast update\r\n');
	for (var i = 0; i < this.loadedLadder.length; i++) {
		var row = this.loadedLadder[i];
		stream.write(row.slice(1).join('\t') + '\r\n');
	}
	stream.end();
	this.saving = false;
};

Ladder.prototype.indexOfUser = function (username, createIfNeeded) {
	var userid = toId(username);
	for (var i = 0; i < this.loadedLadder.length; i++) {
		if (this.loadedLadder[i][0] === userid) return i;
	}
	if (createIfNeeded) {
		var index = this.loadedLadder.length;
		this.loadedLadder.push([userid, 1000, username, 0, 0, 0]);
		return index;
	}
	return -1;
};

Ladder.prototype.getTop = function () {
	var formatid = this.formatid;
	var name = Tools.getFormat(formatid).name;
	return this.ladder.then(function (ladder) {
		var buf = '<h3>' + name + ' Top 100</h3>';
		buf += '<table>';
		buf += '<tr><th>' + ['', 'Username', '<abbr title="Elo rating">Elo</abbr>', 'W', 'L', 'T'].join('</th><th>') + '</th></tr>';
		for (var i = 0; i < ladder.length; i++) {
			var row = ladder[i];
			buf += '<tr><td>' + [
				i + 1, row[2], '<strong>' + Math.round(row[1]) + '</strong>', row[3], row[4], row[5]
			].join('</td><td>') + '</td></tr>';
		}
		return [formatid, buf];
	});
};

Ladder.prototype.getRating = function (userid) {
	var formatid = this.formatid;
	var user = Users.getExact(userid);
	if (user && user.mmrCache[formatid]) {
		return Promise.resolve(user.mmrCache[formatid]);
	}
	var self = this;
	return this.ladder.then(function () {
		if (user.userid !== userid) return;
		var index = self.indexOfUser(userid);
		if (index < 0) return (user.mmrCache[formatid] = 1000);
		return (user.mmrCache[formatid] = self.loadedLadder[index][1]);
	});
};

Ladder.prototype.updateRow = function (row, score, foeElo) {
	var elo = row[1];

	// The K factor determines how much your Elo changes when you win or
	// lose games. Larger K means more change.
	// In the "original" Elo, K is constant, but it's common for K to
	// get smaller as your rating goes up
	var K = 50;

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
	var E = 1 / (1 + Math.pow(10, (foeElo - elo) / 400));
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
};

Ladder.prototype.updateRating = function (p1name, p2name, p1score, room) {
	var formatid = this.formatid;
	var self = this;
	this.ladder.then(function () {
		if (!room.battle) {
			console.log('room expired before ladder update was received');
			return;
		}
		var p1newElo, p2newElo;
		try {
			var p1id = toId(p1name);
			var p1index = self.indexOfUser(p1name, true);
			var p1elo = self.loadedLadder[p1index][1];

			var p2id = toId(p2name);
			var p2index = self.indexOfUser(p2name, true);
			var p2elo = self.loadedLadder[p2index][1];

			self.updateRow(self.loadedLadder[p1index], p1score, p2elo);
			self.updateRow(self.loadedLadder[p2index], 1 - p1score, p1elo);

			p1newElo = self.loadedLadder[p1index][1];
			p2newElo = self.loadedLadder[p2index][1];

			// console.log('L: ' + self.loadedLadder.map(r => ''+Math.round(r[1])+' '+r[2]).join('\n'));

			// move p1 to its new location
			var newIndex = p1index;
			while (newIndex > 0 && self.loadedLadder[newIndex - 1][1] <= p1newElo) newIndex--;
			while (newIndex === p1index || (self.loadedLadder[newIndex] && self.loadedLadder[newIndex][1] > p1newElo)) newIndex++;
			// console.log('ni='+newIndex+', p1i='+p1index);
			if (newIndex !== p1index && newIndex !== p1index + 1) {
				var row = self.loadedLadder.splice(p1index, 1)[0];
				// adjust for removed row
				if (newIndex > p1index) newIndex--;
				if (p2index > p1index) p2index--;

				self.loadedLadder.splice(newIndex, 0, row);
				// adjust for inserted row
				if (p2index >= newIndex) p2index++;
			}

			// move p2
			newIndex = p2index;
			while (newIndex > 0 && self.loadedLadder[newIndex - 1][1] <= p2newElo) newIndex--;
			while (newIndex === p2index || (self.loadedLadder[newIndex] && self.loadedLadder[newIndex][1] > p2newElo)) newIndex++;
			// console.log('ni='+newIndex+', p2i='+p2index);
			if (newIndex !== p2index && newIndex !== p2index + 1) {
				var row = self.loadedLadder.splice(p2index, 1)[0];
				// adjust for removed row
				if (newIndex > p2index) newIndex--;

				self.loadedLadder.splice(newIndex, 0, row);
			}

			var reasons = '' + (Math.round(p1newElo) - Math.round(p1elo)) + ' for ' + (p1score > 0.9 ? 'winning' : (p1score < 0.1 ? 'losing' : 'tying'));
			if (reasons.charAt(0) !== '-') reasons = '+' + reasons;
			room.addRaw(Tools.escapeHTML(p1name) + '\'s rating: ' + Math.round(p1elo) + ' &rarr; <strong>' + Math.round(p1newElo) + '</strong><br />(' + reasons + ')');

			reasons = '' + (Math.round(p2newElo) - Math.round(p2elo)) + ' for ' + (p1score > 0.9 ? 'losing' : (p1score < 0.1 ? 'winning' : 'tying'));
			if (reasons.charAt(0) !== '-') reasons = '+' + reasons;
			room.addRaw(Tools.escapeHTML(p2name) + '\'s rating: ' + Math.round(p2elo) + ' &rarr; <strong>' + Math.round(p2newElo) + '</strong><br />(' + reasons + ')');

			var p1 = Users.getExact(p1name);
			if (p1) p1.mmrCache[formatid] = +p1newElo;
			var p2 = Users.getExact(p2name);
			if (p2) p2.mmrCache[formatid] = +p2newElo;
			self.save();
			room.update();
		} catch (e) {
			room.addRaw('There was an error calculating rating changes:');
			room.add(e.stack);
			room.update();
		}

		if (!Tools.getFormat(formatid).noLog) {
			room.logBattle(p1score, p1newElo, p2newElo);
		}
	});
};

