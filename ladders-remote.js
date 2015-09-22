/**
 * Ladder library
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file handles ladder rating retrieval.
 *
 * @license MIT license
 */

/* global Ladders: true */
var Ladders = module.exports = getLadder;

function getLadder(formatid) {
	return new Ladder(formatid);
}

function Ladder(formatid) {
	this.formatid = toId(formatid);
}

Ladder.prototype.getTop = function () {
	return Promise.resolve(null);
};

Ladder.prototype.getRating = function (userid) {
	var formatid = this.formatid;
	var user = Users.getExact(userid);
	if (user && user.mmrCache[formatid]) {
		return Promise.resolve(user.mmrCache[formatid]);
	}
	return new Promise(function (resolve, reject) {
		LoginServer.request('mmr', {
			format: formatid,
			user: userid
		}, function (data, statusCode, error) {
			if (!data) return resolve(1000);
			if (data.errorip) {
				return resolve(1000);
			}

			var mmr = parseInt(data, 10);
			if (isNaN(mmr)) return resolve(1000);
			if (user.userid !== userid) return reject(new Error("Expired rating"));

			user.mmrCache[formatid] = mmr;
			resolve(mmr);
		});
	});
};

Ladder.prototype.updateRating = function (p1name, p2name, p1score, room) {
	var formatid = this.formatid;
	var p1rating, p2rating;
	room.update();
	room.send('||Ladder updating...');
	LoginServer.request('ladderupdate', {
		p1: p1name,
		p2: p2name,
		score: p1score,
		format: formatid
	}, function (data, statusCode, error) {
		if (!room.battle) {
			console.log('room expired before ladder update was received');
			return;
		}
		if (!data) {
			room.add('||Ladder (probably) updated, but score could not be retrieved (' + error.message + ').');
			// log the battle anyway
			if (!Tools.getFormat(room.format).noLog) {
				room.logBattle(p1score);
			}
			return;
		} else if (data.errorip) {
			room.add("||This server's request IP " + data.errorip + " is not a registered server.");
			room.add("||We currently only support ladder ratings on registered servers.");
			room.update();
			return;
		} else {
			try {
				p1rating = data.p1rating;
				p2rating = data.p2rating;

				var oldacre = Math.round(p1rating.oldacre);
				var acre = Math.round(p1rating.acre);
				var reasons = '' + (acre - oldacre) + ' for ' + (p1score > 0.9 ? 'winning' : (p1score < 0.1 ? 'losing' : 'tying'));
				if (reasons.charAt(0) !== '-') reasons = '+' + reasons;
				room.addRaw(Tools.escapeHTML(p1name) + '\'s rating: ' + oldacre + ' &rarr; <strong>' + acre + '</strong><br />(' + reasons + ')');

				oldacre = Math.round(p2rating.oldacre);
				acre = Math.round(p2rating.acre);
				reasons = '' + (acre - oldacre) + ' for ' + (p1score > 0.9 ? 'losing' : (p1score < 0.1 ? 'winning' : 'tying'));
				if (reasons.charAt(0) !== '-') reasons = '+' + reasons;
				room.addRaw(Tools.escapeHTML(p2name) + '\'s rating: ' + oldacre + ' &rarr; <strong>' + acre + '</strong><br />(' + reasons + ')');

				var p1 = Users.getExact(p1name);
				if (p1) p1.mmrCache[formatid] = +p1rating.acre;
				var p2 = Users.getExact(p2name);
				if (p2) p2.mmrCache[formatid] = +p2rating.acre;
				room.update();
			} catch (e) {
				room.addRaw('There was an error calculating rating changes.');
				room.update();
			}

			if (!Tools.getFormat(formatid).noLog) {
				room.logBattle(p1score, p1rating, p2rating);
			}
		}
	});
};

