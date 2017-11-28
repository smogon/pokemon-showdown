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
Object.assign(Ladders, require('./ladders-matchmaker'));

Ladders.get = Ladders;
Ladders.formatsListPrefix = '';
Ladders.disabled = false;

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
		if (Ladders.disabled === true || Ladders.disabled === 'db' && !user.mmrCache[formatid]) {
			return Promise.reject(new Error(`Ladders are disabled.`));
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

	async updateRating(p1name, p2name, p1score, room) {
		if (Ladders.disabled) {
			room.addRaw(`Ratings not updated. The ladders are currently disabled.`).update();
			return [p1score, undefined, undefined];
		}

		let formatid = this.formatid;
		room.update();
		room.send(`||Ladder updating...`);
		let data;
		try {
			data = await new Promise((resolve, reject) => {
				LoginServer.request('ladderupdate', {
					p1: p1name,
					p2: p2name,
					score: p1score,
					format: formatid,
				}, (data, statusCode, error) => {
					if (error) return reject(error);
					resolve(data);
				});
			});
		} catch (error) {
			room.add(`||Ladder (probably) updated, but score could not be retrieved (${error.message}).`);
			return [p1score, undefined, undefined];
		}
		if (!room.battle) {
			Monitor.warn(`room expired before ladder update was received`);
			return [p1score, undefined, undefined];
		}
		if (data.errorip) {
			room.add(`||This server's request IP ${data.errorip} is not a registered server.`);
			room.add(`||You should be using ladders.js and not ladders-remote.js for ladder tracking.`);
			room.update();
			return [p1score, undefined, undefined];
		}

		let p1rating, p2rating;
		try {
			p1rating = data.p1rating;
			p2rating = data.p2rating;

			let oldelo = Math.round(p1rating.oldelo);
			let elo = Math.round(p1rating.elo);
			let act = (p1score > 0.9 ? `winning` : (p1score < 0.1 ? `losing` : `tying`));
			let reasons = `${elo - oldelo} for ${act}`;
			if (reasons.charAt(0) !== '-') reasons = '+' + reasons;
			room.addRaw(Chat.html`${p1name}'s rating: ${oldelo} &rarr; <strong>${elo}</strong><br />(${reasons})`);
			let minElo = elo;

			oldelo = Math.round(p2rating.oldelo);
			elo = Math.round(p2rating.elo);
			act = (p1score > 0.9 || p1score < 0 ? `losing` : (p1score < 0.1 ? `winning` : `tying`));
			reasons = `${elo - oldelo} for ${act}`;
			if (reasons.charAt(0) !== '-') reasons = '+' + reasons;
			room.addRaw(Chat.html`${p2name}'s rating: ${oldelo} &rarr; <strong>${elo}</strong><br />(${reasons})`);
			if (elo < minElo) minElo = elo;
			room.rated = minElo;

			let p1 = Users.getExact(p1name);
			if (p1) p1.mmrCache[formatid] = +p1rating.elo;
			let p2 = Users.getExact(p2name);
			if (p2) p2.mmrCache[formatid] = +p2rating.elo;
			room.update();
		} catch (e) {
			room.addRaw(`There was an error calculating rating changes.`);
			room.update();
		}

		return [p1score, p1rating, p2rating];
	}
}

function getLadder(formatid) {
	return new Ladder(formatid);
}

Ladders.visualizeAll = function (username) {
	return Promise.resolve([`<tr><td><strong>Please use the official client at play.pokemonshowdown.com</strong></td></tr>`]);
};
