/**
 * Main server ladder library
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file handles ladders for the main server on
 * play.pokemonshowdown.com.
 *
 * Ladders for all other servers is handled by ladders.js.
 *
 * Matchmaking is currently still implemented in rooms.js.
 *
 * @license MIT license
 */

'use strict';

let Ladders = module.exports = getLadder;

Ladders.get = Ladders;
Ladders.formatsListPrefix = '';

class Ladder {
	constructor(formatid) {
		this.formatid = toId(formatid);
	}

	getTop() {
		return Promise.resolve(null);
	}

	getRating(userid) {
		let formatid = this.formatid;
		let user = Users.getExact(userid);
		if (!user) {
			return Promise.reject(new Error(`Expired rating for ${userid}`));
		}
		if (user.mmrCache[formatid]) {
			return Promise.resolve(user.mmrCache[formatid]);
		}
		return new Promise((resolve, reject) => {
			LoginServer.request('mmr', {
				format: formatid,
				user: userid,
			}, (data, statusCode, error) => {
				if (!data) return resolve(1000);
				if (data.errorip) {
					return resolve(1000);
				}

				let mmr = parseInt(data);
				if (isNaN(mmr)) return resolve(1000);
				if (user.userid !== userid) return reject(new Error(`Expired rating for ${userid}`));

				user.mmrCache[formatid] = mmr;
				resolve(mmr);
			});
		});
	}

	updateRating(p1name, p2name, p1score, room) {
		let formatid = this.formatid;
		let p1rating, p2rating;
		room.update();
		room.send(`||Ladder updating...`);
		LoginServer.request('ladderupdate', {
			p1: p1name,
			p2: p2name,
			score: p1score,
			format: formatid,
		}, (data, statusCode, error) => {
			if (!room.battle) {
				console.log(`room expired before ladder update was received`);
				return;
			}
			if (!data) {
				room.add(`||Ladder (probably) updated, but score could not be retrieved (${error.message}).`);
				// log the battle anyway
				if (!Tools.getFormat(room.format).noLog) {
					room.logBattle(p1score);
				}
				return;
			} else if (data.errorip) {
				room.add(`||This server's request IP ${data.errorip} is not a registered server.`);
				room.add(`||We currently only support ladder ratings on registered servers.`);
				room.update();
				return;
			} else {
				try {
					p1rating = data.p1rating;
					p2rating = data.p2rating;

					let oldelo = Math.round(p1rating.oldelo);
					let elo = Math.round(p1rating.elo);
					let act = (p1score > 0.9 ? `winning` : (p1score < 0.1 ? `losing` : `tying`));
					let reasons = `${elo - oldelo} for ${act}`;
					if (reasons.charAt(0) !== '-') reasons = '+' + reasons;
					room.addRaw(Tools.html`${p1name}'s rating: ${oldelo} &rarr; <strong>${elo}</strong><br />(${reasons})`);

					oldelo = Math.round(p2rating.oldelo);
					elo = Math.round(p2rating.elo);
					act = (p1score > 0.9 ? `losing` : (p1score < 0.1 ? `winning` : `tying`));
					reasons = `${elo - oldelo} for ${act}`;
					if (reasons.charAt(0) !== '-') reasons = '+' + reasons;
					room.addRaw(Tools.html`${p2name}'s rating: ${oldelo} &rarr; <strong>${elo}</strong><br />(${reasons})`);

					let p1 = Users.getExact(p1name);
					if (p1) p1.mmrCache[formatid] = +p1rating.elo;
					let p2 = Users.getExact(p2name);
					if (p2) p2.mmrCache[formatid] = +p2rating.elo;
					room.update();
				} catch (e) {
					room.addRaw(`There was an error calculating rating changes.`);
					room.update();
				}

				if (!Tools.getFormat(formatid).noLog) {
					room.logBattle(p1score, p1rating, p2rating);
				}
			}
		});
	}
}

function getLadder(formatid) {
	return new Ladder(formatid);
}

Ladders.visualizeAll = function (username) {
	return Promise.resolve([`<tr><td><strong>Please use the official client at play.pokemonshowdown.com</strong></td></tr>`]);
};
