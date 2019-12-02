/**
* Wi-Fi chat-plugin. Only works in a room with id 'wifi'
* Handles giveaways in the formats: question, lottery, gts
* Written by bumbadadabum, based on the original plugin as written by Codelegend, SilverTactic, DanielCranham
**/

'use strict';

/** @type {typeof import('../../lib/fs').FS} */
const FS = require(/** @type {any} */('../../.lib-dist/fs')).FS;

Punishments.roomPunishmentTypes.set('GIVEAWAYBAN', 'banned from giveaways');

const BAN_DURATION = 7 * 24 * 60 * 60 * 1000;
const RECENT_THRESHOLD = 30 * 24 * 60 * 60 * 1000;

const STATS_FILE = 'config/chat-plugins/wifi.json';

/** @type {{[k: string]: number[]}} */
let stats = {};
try {
	stats = require(`../../${STATS_FILE}`);
} catch (e) {
	if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') throw e;
}
if (!stats || typeof stats !== 'object') stats = {};

function saveStats() {
	FS(STATS_FILE).writeUpdate(() => JSON.stringify(stats));
}

/**
 * @param {string} str
 */
function toPokemonId(str) {
	return str.toLowerCase().replace(/é/g, 'e').replace(/[^a-z0-9 -/]/g, '');
}

class Giveaway {
	/**
	 * @param {User} host
	 * @param {User} giver
	 * @param {ChatRoom | GameRoom} room
	 * @param {string} ot
	 * @param {string} tid
	 * @param {string} fc
	 * @param {string} prize
	 */
	constructor(host, giver, room, ot, tid, fc, prize) {
		// The massive amounts of typescipt ignores are to work around something that is impossible to implement in the current typescipt version, but should be available soon.
		// I don't feel the need to fully overhaul the code structure to temporarily shut tsc up. I would rather use ignores for the time being to accomplish that.

		this.gaNumber = ++room.gameNumber;
		this.host = host;
		this.giver = giver;
		this.room = room;
		this.ot = ot;
		this.tid = tid;
		this.fc = `${fc.substr(0, 4)}-${fc.substr(4, 4)}-${fc.substr(8, 4)}`;

		this.prize = prize;
		this.phase = 'pending';

		/** @type {{[k: string]: string}} */
		this.joined = {};

		/** @type {NodeJS.Timer?} */
		this.timer = null;

		// This seems wrong but I can't find a better way to do this.
		/** @type {Set<string>} */
		// @ts-ignore
		this.monIds = null;
		this.sprite = '';
		[this.monIds, this.sprite] = Giveaway.getSprite(prize);
	}

	generateReminder() {}

	/**
	 * @param {string} content
	 */
	send(content) {
		this.room.add(`|uhtml|giveaway${this.gaNumber}${this.phase}|<div class="broadcast-blue">${content}</div>`);
		this.room.update();
	}

	/**
	 * @param {string} content
	 */
	changeUhtml(content) {
		this.room.add(`|uhtmlchange|giveaway${this.gaNumber}${this.phase}|<div class="broadcast-blue">${content}</div>`);
		this.room.update();
	}

	clearTimer() {
		if (this.timer) {
			clearTimeout(this.timer);
			delete this.timer;
		}
	}

	/**
	 * @param {User} user
	 */
	checkJoined(user) {
		for (let ip in this.joined) {
			if (user.latestIp === ip) return ip;
			if (this.joined[ip] in user.prevNames) return this.joined[ip];
		}
		return false;
	}

	/**
	 * @param {User} user
	 */
	kickUser(user) {
		for (let ip in this.joined) {
			if (user.latestIp === ip || this.joined[ip] in user.prevNames) {
				user.sendTo(this.room, `|uhtmlchange|giveaway${this.gaNumber}${this.phase}|<div class="broadcast-blue">${this.generateReminder()}</div>`);
				delete this.joined[ip];
			}
		}
	}

	/**
	 * @param {User} user
	 */
	checkExcluded(user) {
		if (user === this.giver || user.latestIp in this.giver.ips || toID(user) in this.giver.prevNames) return true;
		return false;
	}

	/**
	 * @param {ChatRoom | GameRoom} room
	 * @param {User} user
	 */
	static checkBanned(room, user) {
		return Punishments.getRoomPunishType(room, toID(user)) === 'GIVEAWAYBAN';
	}

	/**
	 * @param {ChatRoom | GameRoom} room
	 * @param {User} user
	 * @param {string} reason
	 */
	static ban(room, user, reason) {
		Punishments.roomPunish(room, user, ['GIVEAWAYBAN', toID(user), Date.now() + BAN_DURATION, reason]);
	}

	/**
	 * @param {ChatRoom | GameRoom} room
	 * @param {User} user
	 */
	static unban(room, user) {
		Punishments.roomUnpunish(room, toID(user), 'GIVEAWAYBAN', false);
	}

	/**
	 * @param {string} text
	 *
	 * @return {[Set<string>, string]}
	 */
	static getSprite(text) {
		text = toPokemonId(text);
		let mons = new Map();
		let output = '';
		let monIds = new Set();
		for (let i in Dex.data.Pokedex) {
			let id = i;
			if (!Dex.data.Pokedex[i].baseSpecies && (Dex.data.Pokedex[i].species.includes(' '))) {
				id = toPokemonId(Dex.data.Pokedex[i].species);
			}
			let regexp = new RegExp(`\\b${id}\\b`);
			if (regexp.test(text)) {
				let mon = Dex.getTemplate(i);
				mons.set(mon.baseSpecies, mon);
			}
		}
		// the previous regex doesn't match "nidoran-m" or "nidoran male"
		if (/\bnidoran\W{0,1}m(ale){0,1}\b/.test(text)) {
			mons.set('Nidoran-M', Dex.getTemplate('nidoranm'));
		}
		if (/\bnidoran\W{0,1}f(emale){0,1}\b/.test(text)) {
			mons.set('Nidoran-F', Dex.getTemplate('nidoranf'));
		}
		text = toID(text);
		if (mons.size) {
			for (const [key, value] of mons) {
				let spriteid = value.spriteid;
				if (value.otherForms) {
					for (let i = 0; i < value.otherForms.length; i++) {
						if (text.includes(value.otherForms[i])) {
							spriteid += '-' + value.otherForms[i].substr(key.length);
							break; // We don't want to end up with deerling-summer-spring
						}
					}
				}
				if (value.otherFormes) {
					for (let i = 0; i < value.otherFormes.length; i++) {
						// Allow "alolan <name>" to match as well.
						if (value.otherFormes[i].endsWith('alola')) {
							if (/alolan?/.test(text)) {
								spriteid += '-alola';
								break;
							}
						}
						if (text.includes(value.otherFormes[i])) {
							spriteid += '-' + value.otherFormes[i].substr(key.length);
							break; // We don't want to end up with landorus-therian-therian
						}
					}
				}
				monIds.add(spriteid);
				if (mons.size > 1) {
					output += `<psicon pokemon="${spriteid}" />`;
				} else {
					let shiny = (text.includes("shiny") && !text.includes("shinystone") ? '-shiny' : '');
					output += `<img src="/sprites/xyani${shiny}/${spriteid}.gif">`;
				}
			}
		}
		return [monIds, output];
	}

	/**
	 * @param {Set<string>} monIds
	 */
	static updateStats(monIds) {
		for (let mon of monIds) {
			if (!stats[mon]) stats[mon] = [];

			stats[mon].push(Date.now());
		}

		saveStats();
	}

	/**
	 * @param {string} rightSide
	 */
	generateWindow(rightSide) {
		return `<p style="text-align:center;font-size:14pt;font-weight:bold;margin-bottom:2px;">It's giveaway time!</p>` +
			`<p style="text-align:center;font-size:7pt;">Giveaway started by ${Chat.escapeHTML(this.host.name)}</p>` +
			`<table style="margin-left:auto;margin-right:auto;"><tr><td style="text-align:center;width:45%">${this.sprite}<p style="font-weight:bold;">Giver: ${this.giver}</p>${Chat.formatText(this.prize, true)}<br />OT: ${Chat.escapeHTML(this.ot)}, TID: ${this.tid}</td>` +
			`<td style="text-align:center;width:45%">${rightSide}</td></tr></table><p style="text-align:center;font-size:7pt;font-weight:bold;"><u>Note:</u> Unless otherwise stated, you must have a Switch and Pokémon Sword/Shield to receive the prize. Do not join if you are currently unable to trade.</p>`;
	}
}

class QuestionGiveaway extends Giveaway {
	/**
	 * @param {User} host
	 * @param {User} giver
	 * @param {ChatRoom} room
	 * @param {string} ot
	 * @param {string} tid
	 * @param {string} fc
	 * @param {string} prize
	 * @param {string} question
	 * @param {string[]} answers
	 */
	constructor(host, giver, room, ot, tid, fc, prize, question, answers) {
		super(host, giver, room, ot, tid, fc, prize);
		this.type = 'question';
		this.phase = 'pending';

		this.question = question;
		this.answers = QuestionGiveaway.sanitizeAnswers(answers);
		/** @type {{[k: string]: number}} */
		this.answered = {}; // userid: number of guesses

		this.send(this.generateWindow('The question will be displayed in one minute! Use /ga to answer.'));

		this.timer = setTimeout(() => this.start(), 1000 * 60);
	}

	generateQuestion() {
		return this.generateWindow(`<p style="text-align:center;font-size:13pt;">Giveaway Question: <b>${this.question}</b></p><p style="text-align:center;">use /ga to guess.</p>`);
	}

	start() {
		this.changeUhtml('<p style="text-align:center;font-size:13pt;font-weight:bold;">The giveaway has started! Scroll down to see the question.</p>');
		this.phase = 'started';
		this.send(this.generateQuestion());
		this.timer = setTimeout(() => this.end(false), 1000 * 60 * 5);
	}

	/**
	 * @param {User} user
	 * @param {string} guess
	 */
	guessAnswer(user, guess) {
		if (this.phase !== 'started') return user.sendTo(this.room, "The giveaway has not started yet.");

		if (this.checkJoined(user) && Object.values(this.joined).indexOf(user.id) < 0) return user.sendTo(this.room, "You have already joined the giveaway.");
		if (Giveaway.checkBanned(this.room, user)) return user.sendTo(this.room, "You are banned from entering giveaways.");
		if (this.checkExcluded(user)) return user.sendTo(this.room, "You are disallowed from entering the giveaway.");

		if (!this.answered[user.id]) this.answered[user.id] = 0;
		if (this.answered[user.id] >= 3) return user.sendTo(this.room, "You have already guessed three times. You cannot guess anymore in this giveaway.");

		let sanitized = toID(guess);

		for (let i = 0; i < this.answers.length; i++) {
			if (toID(this.answers[i]) === sanitized) {
				this.winner = user;
				this.clearTimer();
				return this.end(false);
			}
		}

		this.joined[user.latestIp] = user.id;
		this.answered[user.id]++;
		if (this.answered[user.id] >= 3) {
			user.sendTo(this.room, `Your guess '${guess}' is wrong. You have used up all of your guesses. Better luck next time!`);
		} else {
			user.sendTo(this.room, `Your guess '${guess}' is wrong. Try again!`);
		}
	}

	/**
	 * @param {string} key
	 * @param {string} value
	 * @param {User} user
	 */
	change(key, value, user) {
		if (user.id !== this.host.id) return user.sendTo(this.room, "Only the host can edit the giveaway.");
		if (this.phase !== 'pending') return user.sendTo(this.room, "You cannot change the question or answer once the giveaway has started.");
		if (key === 'question') {
			this.question = value;
			return user.sendTo(this.room, `The question has been changed to ${value}.`);
		}
		let ans = QuestionGiveaway.sanitizeAnswers(value.split(',').map(val => val.trim()));
		if (!ans.length) return user.sendTo(this.room, "You must specify at least one answer and it must not contain any special characters.");
		this.answers = ans;
		user.sendTo(this.room, `The answer${Chat.plural(ans, "s have", "has")} been changed to ${ans.join(', ')}.`);
	}

	/**
	 * @param {boolean} force
	 */
	end(force) {
		if (force) {
			this.clearTimer();
			this.changeUhtml('<p style="text-align:center;font-size:13pt;font-weight:bold;">The giveaway was forcibly ended.</p>');
			this.room.send("The giveaway was forcibly ended.");
		} else {
			if (!this.winner) {
				this.changeUhtml('<p style="text-align:center;font-size:13pt;font-weight:bold;">The giveaway was forcibly ended.</p>');
				this.room.send("The giveaway has been forcibly ended as no one has answered the question.");
			} else {
				this.changeUhtml('<p style="text-align:center;font-size:13pt;font-weight:bold;">The giveaway has ended! Scroll down to see the answer.</p>');
				this.phase = 'ended';
				this.clearTimer();
				this.room.modlog(`(wifi) GIVEAWAY WIN: ${this.winner.name} won ${this.giver.name}'s giveaway for a "${this.prize}" (OT: ${this.ot} TID: ${this.tid} FC: ${this.fc})`);
				this.send(this.generateWindow(`<p style="text-align:center;font-size:12pt;"><b>${Chat.escapeHTML(this.winner.name)}</b> won the giveaway! Congratulations!</p>` +
				`<p style="text-align:center;">${this.question}<br />Correct answer${Chat.plural(this.answers)}: ${this.answers.join(', ')}</p>`));
				this.winner.sendTo(this.room, `|raw|You have won the giveaway. PM <b>${Chat.escapeHTML(this.giver.name)}</b> (FC: ${this.fc}) to claim your prize!`);
				if (this.winner.connected) this.winner.popup(`You have won the giveaway. PM **${this.giver.name}** (FC: ${this.fc}) to claim your prize!`);
				if (this.giver.connected) this.giver.popup(`${this.winner.name} has won your question giveaway!`);
				Giveaway.updateStats(this.monIds);
			}
		}

		// @ts-ignore
		delete this.room.giveaway;
	}

	/**
	 * @param {string} str
	 *
	 * @return {string}
	 */
	static sanitize(str) {
		return str.toLowerCase().replace(/[^a-z0-9 .-]+/ig, "").trim();
	}

	/**
	 * @param {string[]} answers
	 */
	static sanitizeAnswers(answers) {
		return answers.map(val => QuestionGiveaway.sanitize(val)).filter((val, index, array) => toID(val).length && array.indexOf(val) === index);
	}

	/**
	 * @param {User} user
	 */
	checkExcluded(user) {
		if (user === this.host || user.latestIp in this.host.ips || toID(user) in this.host.prevNames) return true;
		return super.checkExcluded(user);
	}
}

class LotteryGiveaway extends Giveaway {
	/**
	 * @param {User} host
	 * @param {User} giver
	 * @param {ChatRoom} room
	 * @param {string} ot
	 * @param {string} tid
	 * @param {string} fc
	 * @param {string} prize
	 * @param {number} winners
	 */
	constructor(host, giver, room, ot, tid, fc, prize, winners) {
		super(host, giver, room, ot, tid, fc, prize);

		this.type = 'lottery';
		this.phase = 'pending';

		/** @type {User[]} */
		this.winners = [];

		this.maxwinners = winners || 1;

		this.send(this.generateReminder(false));

		this.timer = setTimeout(() => this.drawLottery(), 1000 * 60 * 2);
	}

	generateReminder(joined = false) {
		let cmd = (joined ? 'Leave' : 'Join');
		let button = `<button style="margin:4px;" name="send" value="/giveaway ${toID(cmd)}lottery"><font size=1><b>${cmd}</b></font></button>`;
		return this.generateWindow(`The lottery drawing will occur in 2 minutes, and with ${Chat.count(this.maxwinners, "winners")}!<br />${button}</p>`);
	}

	display() {
		let joined = this.generateReminder(true);
		let notJoined = this.generateReminder();

		for (let i in this.room.users) {
			let thisUser = this.room.users[i];
			if (this.checkJoined(thisUser)) {
				thisUser.sendTo(this.room, `|uhtmlchange|giveaway${this.gaNumber}${this.phase}|<div class="broadcast-blue">${joined}</div>`);
			} else {
				thisUser.sendTo(this.room, `|uhtmlchange|giveaway${this.gaNumber}${this.phase}|<div class="broadcast-blue">${notJoined}</div>`);
			}
		}
	}

	/**
	 * @param {User} user
	 */
	addUser(user) {
		if (this.phase !== 'pending') return user.sendTo(this.room, "The join phase of the lottery giveaway has ended.");

		if (!user.named) return user.sendTo(this.room, "You need to choose a name before joining a lottery giveaway.");
		if (this.checkJoined(user)) return user.sendTo(this.room, "You have already joined the giveaway.");
		if (Giveaway.checkBanned(this.room, user)) return user.sendTo(this.room, "You are banned from entering giveaways.");
		if (this.checkExcluded(user)) return user.sendTo(this.room, "You are disallowed from entering the giveaway.");

		this.joined[user.latestIp] = user.id;
		user.sendTo(this.room, `|uhtmlchange|giveaway${this.gaNumber}${this.phase}|<div class="broadcast-blue">${this.generateReminder(true)}</div>`);
		user.sendTo(this.room, "You have successfully joined the lottery giveaway.");
	}

	/**
	 * @param {User} user
	 */
	removeUser(user) {
		if (this.phase !== 'pending') return user.sendTo(this.room, "The join phase of the lottery giveaway has ended.");
		if (!this.checkJoined(user)) return user.sendTo(this.room, "You have not joined the lottery giveaway.");
		for (let ip in this.joined) {
			if (ip === user.latestIp || this.joined[ip] === user.id) {
				delete this.joined[ip];
			}
		}
		user.sendTo(this.room, `|uhtmlchange|giveaway${this.gaNumber}${this.phase}|<div class="broadcast-blue">${this.generateReminder(false)}</div>`);
		user.sendTo(this.room, "You have left the lottery giveaway.");
	}

	drawLottery() {
		this.clearTimer();

		let userlist = Object.values(this.joined);
		if (userlist.length < this.maxwinners) {
			this.changeUhtml('<p style="text-align:center;font-size:13pt;font-weight:bold;">The giveaway was forcibly ended.</p>');
			// @ts-ignore
			delete this.room.giveaway;
			return this.room.send("The giveaway has been forcibly ended as there are not enough participants.");
		}

		while (this.winners.length < this.maxwinners) {
			let winner = Users.get(userlist.splice(Math.floor(Math.random() * userlist.length), 1)[0]);
			if (!winner) continue;
			this.winners.push(winner);
		}
		this.end();
	}

	end(force = false) {
		if (force) {
			this.clearTimer();
			this.changeUhtml('<p style="text-align:center;font-size:13pt;font-weight:bold;">The giveaway was forcibly ended.</p>');
			this.room.send("The giveaway was forcibly ended.");
		} else {
			this.changeUhtml(`<p style="text-align:center;font-size:13pt;font-weight:bold;">The giveaway has ended! Scroll down to see the winner${Chat.plural(this.winners)}.</p>`);
			this.phase = 'ended';
			let winnerNames = this.winners.map(winner => winner.name).join(', ');
			this.room.modlog(`(wifi) GIVEAWAY WIN: ${winnerNames} won ${this.giver.name}'s giveaway for "${this.prize}" (OT: ${this.ot} TID: ${this.tid} FC: ${this.fc})`);
			this.send(this.generateWindow(`<p style="text-align:center;font-size:10pt;font-weight:bold;">Lottery Draw</p><p style="text-align:center;">${Object.keys(this.joined).length} users joined the giveaway.<br />Our lucky winner${Chat.plural(this.winners)}: <b>${Chat.escapeHTML(winnerNames)}!</b> Congratulations!</p>`));
			for (let i = 0; i < this.winners.length; i++) {
				this.winners[i].sendTo(this.room, `|raw|You have won the lottery giveaway! PM <b>${this.giver.name}</b> (FC: ${this.fc}) to claim your prize!`);
				if (this.winners[i].connected) this.winners[i].popup(`You have won the lottery giveaway! PM **${this.giver.name}** (FC: ${this.fc}) to claim your prize!`);
			}
			if (this.giver.connected) this.giver.popup(`The following users have won your lottery giveaway:\n${winnerNames}`);
			Giveaway.updateStats(this.monIds);
		}
		// @ts-ignore
		delete this.room.giveaway;
	}
}

class GtsGiveaway {
	/**
	 * @param {ChatRoom} room
	 * @param {User} giver
	 * @param {number} amount
	 * @param {string} summary
	 * @param {string} deposit
	 * @param {string} lookfor
	 */
	constructor(room, giver, amount, summary, deposit, lookfor) {
		this.gtsNumber = ++room.gameNumber;
		this.room = room;
		this.giver = giver;
		this.left = amount;
		this.summary = summary;
		this.deposit = GtsGiveaway.linkify(Chat.escapeHTML(deposit));
		this.lookfor = lookfor;

		// This seems wrong but I can't find a better way to do this.
		/** @type {Set<string>} */
		// @ts-ignore
		this.monIds = null;
		this.sprite = '';
		[this.monIds, this.sprite] = Giveaway.getSprite(this.summary);

		/** @type {string[]} */
		this.sent = [];
		this.noDeposits = false;

		this.timer = setInterval(() => this.send(this.generateWindow()), 1000 * 60 * 5);
		this.send(this.generateWindow());
	}

	/**
	 * @param {string} content
	 */
	send(content) {
		this.room.add(`|uhtml|gtsga${this.gtsNumber}|<div class="broadcast-blue">${content}</div>`);
		this.room.update();
	}

	/**
	 * @param {string} content
	 */
	changeUhtml(content) {
		this.room.add(`|uhtmlchange|gtsga${this.gtsNumber}|<div class="broadcast-blue">${content}</div>`);
		this.room.update();
	}

	clearTimer() {
		if (this.timer) {
			clearTimeout(this.timer);
			delete this.timer;
		}
	}

	generateWindow() {
		let sentModifier = this.sent.length ? 5 : 0;
		let rightSide = this.noDeposits ? `<strong>More Pokémon have been deposited than there are prizes in this giveaway and new deposits will not be accepted. If you have already deposited a Pokémon, please be patient, and do not withdraw your Pokémon.</strong>` : `To participate, deposit <strong>${this.deposit}</strong> into the GTS and look for <strong>${Chat.escapeHTML(this.lookfor)}</strong>`;
		return `<p style="text-align:center;font-size:14pt;font-weight:bold;margin-bottom:2px;">There is a GTS giveaway going on!</p>` +
			`<p style="text-align:center;font-size:10pt;margin-top:0px;">Hosted by: ${Chat.escapeHTML(this.giver.name)} | Left: <b>${this.left}</b></p>` +
			`<table style="margin-left:auto;margin-right:auto;"><tr>` +
			(sentModifier ? `<td style="text-align:center;width:10%"><b>Last winners:</b><br/>${this.sent.join('<br/>')}</td>` : '') +
			`<td style="text-align:center;width:15%">${this.sprite}</td><td style="text-align:center;width:${40 - sentModifier}%">${Chat.formatText(this.summary, true)}</td>` +
			`<td style="text-align:center;width:${35 - sentModifier}%">${rightSide}</td></tr></table>`;
	}

	/**
	 * @param {number} number
	 */
	updateLeft(number) {
		this.left = number;
		if (this.left < 1) return this.end();

		this.changeUhtml(this.generateWindow());
	}

	/**
	 * @param {string} ign
	 */
	updateSent(ign) {
		this.left--;
		if (this.left < 1) return this.end();

		this.sent.push(Chat.escapeHTML(ign));
		if (this.sent.length > 5) this.sent.shift();

		this.changeUhtml(this.generateWindow());
	}

	stopDeposits() {
		this.noDeposits = true;

		this.room.send(`|html|<p style="text-align:center;font-size:11pt">More Pokémon have been deposited than there are prizes in this giveaway and new deposits will not be accepted. If you have already deposited a Pokémon, please be patient, and do not withdraw your Pokémon.</p>`);
		this.changeUhtml(this.generateWindow());
	}

	end(force = false) {
		if (force) {
			this.clearTimer();
			this.changeUhtml('<p style="text-align:center;font-size:13pt;font-weight:bold;">The GTS giveaway was forcibly ended.</p>');
			this.room.send("The GTS giveaway was forcibly ended.");
		} else {
			this.clearTimer();
			this.changeUhtml(`<p style="text-align:center;font-size:13pt;font-weight:bold;">The GTS giveaway has finished.</p>`);
			this.room.modlog(`(wifi) GTS FINISHED: ${this.giver.name} has finished their GTS giveaway for "${this.summary}"`);
			this.send(`<p style="text-align:center;font-size:11pt">The GTS giveaway for a "<strong>${Chat.escapeHTML(this.lookfor)}</strong>" has finished.</p>`);
			Giveaway.updateStats(this.monIds);
		}
		// @ts-ignore
		delete this.room.gtsga;
		return this.left;
	}

	// This currently doesn't match some of the edge cases the other pokemon matching function does account for (such as Type: Null). However, this should never be used as a fodder mon anyway, so I don't see a huge need to implement it.
	/**
	 * @param {string} text
	 */
	static linkify(text) {
		let parsed = text.toLowerCase().replace(/é/g, 'e');

		for (let i in Dex.data.Pokedex) {
			let id = i;
			if (!Dex.data.Pokedex[i].baseSpecies && (Dex.data.Pokedex[i].species.includes(' '))) {
				id = toPokemonId(Dex.data.Pokedex[i].species);
			}
			let regexp = new RegExp(`\\b${id}\\b`, 'ig');
			let res = regexp.exec(parsed);
			if (res) {
				let num = Dex.data.Pokedex[i].num < 100 ? (Dex.data.Pokedex[i].num < 10 ? `00${Dex.data.Pokedex[i].num}` : `0${Dex.data.Pokedex[i].num}`) : Dex.data.Pokedex[i].num;
				return `${text.slice(0, res.index)}<a href="http://www.serebii.net/pokedex-sm/location/${num}.shtml">${text.slice(res.index, res.index + res[0].length)}</a>${text.slice(res.index + res[0].length)}`;
			}
		}
		return text;
	}
}

/** @type {ChatCommands} */
let commands = {
	// question giveaway.
	quiz: 'question',
	qg: 'question',
	question(target, room, user) {
		if (room.roomid !== 'wifi' || !target) return false;
		// @ts-ignore
		if (room.giveaway) return this.errorReply("There is already a giveaway going on!");

		let [giver, ot, tid, fc, prize, question, ...answers] = target.split(target.includes('|') ? '|' : ',').map(param => param.trim());
		if (!(giver && ot && tid && fc && prize && question && answers.length)) return this.errorReply("Invalid arguments specified - /question giver | ot | tid | fc | prize | question | answer(s)");
		tid = toID(tid);
		if (isNaN(parseInt(tid)) || tid.length < 5 || tid.length > 6) return this.errorReply("Invalid TID");
		fc = toID(fc);
		if (!parseInt(fc) || fc.length !== 12) return this.errorReply("Invalid FC");
		let targetUser = Users.get(giver);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User '${giver}' is not online.`);
		if (!user.can('warn', null, room) && !(user.can('broadcast', null, room) && user === targetUser)) return this.errorReply("/qg - Access denied.");
		if (!targetUser.autoconfirmed) return this.errorReply(`User '${targetUser.name}' needs to be autoconfirmed to give something away.`);
		if (Giveaway.checkBanned(room, targetUser)) return this.errorReply(`User '${targetUser.name}' is giveaway banned.`);

		// @ts-ignore
		room.giveaway = new QuestionGiveaway(user, targetUser, room, ot, tid, fc, prize, question, answers);

		this.privateModAction(`(${user.name} started a question giveaway for ${targetUser.name})`);
		this.modlog('QUESTION GIVEAWAY', null, `for ${targetUser.getLastId()}`);
	},
	changeanswer: 'changequestion',
	changequestion(target, room, user, conn, cmd) {
		if (room.roomid !== 'wifi') return false;
		// @ts-ignore
		if (!room.giveaway) return this.errorReply("There is no giveaway going on at the moment.");
		// @ts-ignore
		if (room.giveaway.type !== 'question') return this.errorReply("This is not a question giveaway.");

		target = target.trim();
		if (!target) return this.errorReply("You must include a question or an answer.");
		// @ts-ignore
		room.giveaway.change(cmd.substr(6), target, user);
	},
	showanswer: 'viewanswer',
	viewanswer(target, room, user) {
		if (room.roomid !== 'wifi') return false;
		// @ts-ignore
		let giveaway = room.giveaway;
		if (!giveaway) return this.errorReply("There is no giveaway going on at the moment.");
		if (giveaway.type !== 'question') return this.errorReply("This is not a question giveaway.");
		if (user.id !== giveaway.host.id && user.id !== giveaway.giver.id) return;

		this.sendReply(`The giveaway question is ${giveaway.question}.\n` +
			`The answer${Chat.plural(giveaway.answers, 's are', ' is')} ${giveaway.answers.join(', ')}.`);
	},
	guessanswer: 'guess',
	guess(target, room, user) {
		if (room.roomid !== 'wifi') return this.errorReply("This command can only be used in the Wi-Fi room.");
		if (!this.canTalk()) return;
		// @ts-ignore
		if (!room.giveaway) return this.errorReply("There is no giveaway going on at the moment.");
		// @ts-ignore
		if (room.giveaway.type !== 'question') return this.errorReply("This is not a question giveaway.");
		// @ts-ignore
		room.giveaway.guessAnswer(user, target);
	},

	// lottery giveaway.
	lg: 'lottery',
	lotto: 'lottery',
	lottery(target, room, user) {
		if (room.roomid !== 'wifi' || !target) return false;
		// @ts-ignore
		if (room.giveaway) return this.errorReply("There is already a giveaway going on!");

		let [giver, ot, tid, fc, prize, winners] = target.split(target.includes('|') ? '|' : ',').map(param => param.trim());
		if (!(giver && ot && tid && fc && prize)) return this.errorReply("Invalid arguments specified - /lottery giver | ot | tid | fc | prize | winners");
		tid = toID(tid);
		if (isNaN(parseInt(tid)) || tid.length < 5 || tid.length > 6) return this.errorReply("Invalid TID");
		fc = toID(fc);
		if (!parseInt(fc) || fc.length !== 12) return this.errorReply("Invalid FC");
		let targetUser = Users.get(giver);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User '${giver}' is not online.`);
		if (!user.can('warn', null, room) && !(user.can('broadcast', null, room) && user === targetUser)) return this.errorReply("/lg - Access denied.");
		if (!targetUser.autoconfirmed) return this.errorReply(`User '${targetUser.name}' needs to be autoconfirmed to give something away.`);
		if (Giveaway.checkBanned(room, targetUser)) return this.errorReply(`User '${targetUser.name}' is giveaway banned.`);

		let numWinners = 1;
		if (winners) {
			numWinners = parseInt(winners);
			if (isNaN(numWinners) || numWinners < 1 || numWinners > 5) return this.errorReply("The lottery giveaway can have a minimum of 1 and a maximum of 5 winners.");
		}

		// @ts-ignore
		room.giveaway = new LotteryGiveaway(user, targetUser, room, ot, tid, fc, prize, numWinners);

		this.privateModAction(`(${user.name} started a lottery giveaway for ${targetUser.name})`);
		this.modlog('LOTTERY GIVEAWAY', null, `for ${targetUser.getLastId()}`);
	},
	leavelotto: 'join',
	leavelottery: 'join',
	leave: 'join',
	joinlotto: 'join',
	joinlottery: 'join',
	join(target, room, user, conn, cmd) {
		if (room.roomid !== 'wifi') return this.errorReply("This command can only be used in the Wi-Fi room.");
		if (!this.canTalk() || user.semilocked) return;
		// @ts-ignore
		let giveaway = room.giveaway;
		if (!giveaway) return this.errorReply("There is no giveaway going on at the moment.");
		if (giveaway.type !== 'lottery') return this.errorReply("This is not a lottery giveaway.");

		switch (cmd) {
		case 'joinlottery':
		case 'join':
		case 'joinlotto':
			giveaway.addUser(user);
			break;
		case 'leavelottery':
		case 'leave':
		case 'leavelotto':
			giveaway.removeUser(user);
			break;
		}
	},
	// gts commands
	gts: {
		new: 'start',
		start(target, room, user) {
			if (room.roomid !== 'wifi' || !target) return false;
			// @ts-ignore
			if (room.gtsga) return this.errorReply("There is already a GTS giveaway going on!");

			let [giver, amountStr, summary, deposit, lookfor] = target.split(target.includes('|') ? '|' : ',').map(param => param.trim());
			if (!(giver && amountStr && summary && deposit && lookfor)) return this.errorReply("Invalid arguments specified - /gts start giver | amount | summary | deposit | lookfor");
			let amount = parseInt(amountStr);
			if (!amount || amount < 20 || amount > 100) return this.errorReply("Please enter a valid amount. For a GTS giveaway, you need to give away at least 20 mons, and no more than 100.");
			let targetUser = Users.get(giver);
			if (!targetUser || !targetUser.connected) return this.errorReply(`User '${giver}' is not online.`);
			if (!this.can('warn', null, room)) return this.errorReply("Permission denied.");
			if (!targetUser.autoconfirmed) return this.errorReply(`User '${targetUser.name}' needs to be autoconfirmed to host a giveaway.`);
			if (Giveaway.checkBanned(room, targetUser)) return this.errorReply(`User '${targetUser.name}' is giveaway banned.`);

			// @ts-ignore
			room.gtsga = new GtsGiveaway(room, targetUser, amount, summary, deposit, lookfor);

			this.privateModAction(`(${user.name} started a GTS giveaway for ${targetUser.name} with ${amount} Pokémon)`);
			this.modlog('GTS GIVEAWAY', null, `for ${targetUser.getLastId()} with ${amount} Pokémon`);
		},
		left(target, room, user) {
			if (room.roomid !== 'wifi') return false;
			// @ts-ignore
			if (!room.gtsga) return this.errorReply("There is no GTS giveaway going on!");
			// @ts-ignore
			if (!user.can('warn', null, room) && user !== room.gtsga.giver) return this.errorReply("Only the host or a staff member can update GTS giveaways.");
			if (!target) {
				if (!this.runBroadcast()) return;
				// @ts-ignore
				let output = `The GTS giveaway from ${room.gtsga.giver} has ${room.gtsga.left} Pokémon remaining!`;
				// @ts-ignore
				if (room.gtsga.sent.length) output += `Last winners: ${room.gtsga.sent.join(', ')}`;
				return this.sendReply(output);
			}
			let newamount = parseInt(target);
			if (isNaN(newamount)) return this.errorReply("Please enter a valid amount.");
			// @ts-ignore
			if (newamount > room.gtsga.left) return this.errorReply("The new amount must be lower than the old amount.");
			// @ts-ignore
			if (newamount < room.gtsga.left - 1) this.modlog(`GTS GIVEAWAY`, null, `set from ${room.gtsga.left} to ${newamount} left`);

			// @ts-ignore
			room.gtsga.updateLeft(newamount);
		},
		sent(target, room, user) {
			if (room.roomid !== 'wifi') return false;
			// @ts-ignore
			if (!room.gtsga) return this.errorReply("There is no GTS giveaway going on!");
			// @ts-ignore
			if (!user.can('warn', null, room) && user !== room.gtsga.giver) return this.errorReply("Only the host or a staff member can update GTS giveaways.");

			if (!target || target.length > 12) return this.errorReply("Please enter a valid IGN.");

			// @ts-ignore
			room.gtsga.updateSent(target);
		},
		full(target, room, user) {
			if (room.roomid !== 'wifi') return false;
			// @ts-ignore
			if (!room.gtsga) return this.errorReply("There is no GTS giveaway going on!");
			// @ts-ignore
			if (!user.can('warn', null, room) && user !== room.gtsga.giver) return this.errorReply("Only the host or a staff member can update GTS giveaways.");
			// @ts-ignore
			if (room.gtsga.noDeposits) return this.errorReply("The GTS giveaway was already set to not accept deposits.");

			// @ts-ignore
			room.gtsga.stopDeposits();
		},
		end(target, room, user) {
			if (room.roomid !== 'wifi') return this.errorReply("This command can only be used in the Wi-Fi room.");
			// @ts-ignore
			if (!room.gtsga) return this.errorReply("There is no GTS giveaway going on at the moment.");
			if (!this.can('warn', null, room)) return false;

			if (target && target.length > 300) {
				return this.errorReply("The reason is too long. It cannot exceed 300 characters.");
			}
			// @ts-ignore
			const amount = room.gtsga.end(true);
			if (target) target = `: ${target}`;
			this.modlog('GTS END', null, `with ${amount} left${target}`);
			this.privateModAction(`(The giveaway was forcibly ended by ${user.name} with ${amount} left${target})`);
		},
	},
	// general.
	ban(target, room, user) {
		if (!target) return false;
		if (room.roomid !== 'wifi') return this.errorReply("This command can only be used in the Wi-Fi room.");
		if (!this.can('warn', null, room)) return false;

		target = this.splitTarget(target, false);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply(`User '${this.targetUsername}' not found.`);
		if (target.length > 300) {
			return this.errorReply("The reason is too long. It cannot exceed 300 characters.");
		}
		if (Punishments.getRoomPunishType(room, this.targetUsername)) return this.errorReply(`User '${this.targetUsername}' is already punished in this room.`);

		Giveaway.ban(room, targetUser, target);
		// @ts-ignore
		if (room.giveaway) room.giveaway.kickUser(targetUser);
		this.modlog('GIVEAWAYBAN', targetUser, target);
		if (target) target = ` (${target})`;
		this.privateModAction(`(${targetUser.name} was banned from entering giveaways by ${user.name}.${target})`);
	},
	unban(target, room, user) {
		if (!target) return false;
		if (room.roomid !== 'wifi') return this.errorReply("This command can only be used in the Wi-Fi room.");
		if (!this.can('warn', null, room)) return false;

		this.splitTarget(target, false);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply(`User '${this.targetUsername}' not found.`);
		if (!Giveaway.checkBanned(room, targetUser)) return this.errorReply(`User '${this.targetUsername}' isn't banned from entering giveaways.`);

		Giveaway.unban(room, targetUser);
		this.privateModAction(`${targetUser.name} was unbanned from entering giveaways by ${user.name}.`);
		this.modlog('GIVEAWAYUNBAN', targetUser, null, {noip: 1, noalts: 1});
	},
	stop: 'end',
	end(target, room, user) {
		if (room.roomid !== 'wifi') return this.errorReply("This command can only be used in the Wi-Fi room.");
		// @ts-ignore
		if (!room.giveaway) return this.errorReply("There is no giveaway going on at the moment.");
		// @ts-ignore
		if (!this.can('warn', null, room) && user.id !== room.giveaway.host.id) return false;

		if (target && target.length > 300) {
			return this.errorReply("The reason is too long. It cannot exceed 300 characters.");
		}
		// @ts-ignore
		room.giveaway.end(true);
		this.modlog('GIVEAWAY END', null, target);
		if (target) target = `: ${target}`;
		this.privateModAction(`(The giveaway was forcibly ended by ${user.name}${target})`);
	},
	rm: 'remind',
	remind(target, room, user) {
		if (room.roomid !== 'wifi') return this.errorReply("This command can only be used in the Wi-Fi room.");
		// @ts-ignore
		let giveaway = room.giveaway;
		if (!giveaway) return this.errorReply("There is no giveaway going on at the moment.");
		if (!this.runBroadcast()) return;
		if (giveaway.type === 'question') {
			if (giveaway.phase !== 'started') return this.errorReply("The giveaway has not started yet.");
			// @ts-ignore
			room.giveaway.send(room.giveaway.generateQuestion());
		} else {
			// @ts-ignore
			room.giveaway.display();
		}
	},
	count(target, room, user) {
		if (room.roomid !== 'wifi') return this.errorReply("This command can only be used in the Wi-Fi room.");
		target = [...Giveaway.getSprite(target)[0]][0];
		if (!target) return this.errorReply("No mon entered - /giveaway count pokemon.");
		if (!this.runBroadcast()) return;

		let count = stats[target];

		if (!count) return this.sendReplyBox("This Pokémon has never been given away.");
		let recent = count.filter(val => val + RECENT_THRESHOLD > Date.now()).length;

		this.sendReplyBox(`This Pokémon has been given away ${Chat.count(count, "times")}, a total of ${Chat.count(recent, "times")} in the past month.`);
	},
	'': 'help',
	help(target, room, user) {
		if (room.roomid !== 'wifi') return this.errorReply("This command can only be used in the Wi-Fi room.");

		let reply = '';
		switch (target) {
		case 'staff':
			if (!this.can('broadcast', null, room)) return;
			reply = '<strong>Staff commands:</strong><br />' +
			        '- question or qg <em>User | OT | TID | Friend Code | Prize | Question | Answer[ | Answer2 | Answer3]</em> - Start a new question giveaway (voices can only host for themselves, staff can for all users) (Requires: + % @ # & ~)<br />' +
			        '- lottery or lg <em>User | OT | TID | Friend Code | Prize[| Number of Winners]</em> - Starts a lottery giveaway (voices can only host for themselves, staff can for all users) (Requires: + % @ # & ~)<br />' +
			        '- changequestion - Changes the question of a question giveaway (Requires: giveaway host)<br />' +
			        '- changeanswer - Changes the answer of a question giveaway (Requires: giveaway host)<br />' +
					'- viewanswer - Shows the answer in a question giveaway (only to giveaway host/giver)<br />' +
					'- ban - Temporarily bans a user from entering giveaways (Requires: % @ # & ~)<br />' +
			        '- end - Forcibly ends the current giveaway (Requires: % @ # & ~)<br />' +
					'- count <em>Mon</em> - Displays how often a certain mon has been given away. Use <code>!giveaway count</code> to broadcast this to the entire room<br />';
			break;
		case 'gts':
			if (!this.can('broadcast', null, room)) return;
			reply = '<strong>GTS giveaway commands:</strong><br />' +
			        '- gts start <em>User | Amount | Summary of given mon | What to deposit | What to look for</em> - Starts a gts giveaway (Requires: % @ # & ~)<br />' +
					'- gts left <em>Amount</em> - Updates the amount left for the current GTS giveaway. Without an amount specified, shows how many Pokémon are left, and who the latest winners are.<br />' +
					'- gts sent <em>IGN</em> - Adds an ign to the list of latest winners, and updates left count accordingly.<br />' +
					'- gts full - Signifies enough mons have been received, and will update the GTS giveaway to reflect that.<br />' +
			        '- gts end - Forcibly ends the current gts giveaway (Requires: % @ # & ~)<br />';
			break;
		case 'game':
		case 'giveaway':
		case 'user':
			if (!this.runBroadcast()) return;
			reply = '<strong>Giveaway participation commands: </strong> (start with /giveaway, except for /ga) <br />' +
			        '- guess or /ga <em>answer</em> - Guesses the answer for a question giveaway<br />' +
			        '- viewanswer - Shows the answer in a question giveaway (only to host/giver)<br />' +
			        '- remind - Shows the details of the current giveaway (can be broadcast)<br />' +
			        '- join or joinlottery - Joins a lottery giveaway<br />' +
			        '- leave or leavelottery - Leaves a lottery giveaway<br />';
			break;
		default:
			if (!this.runBroadcast()) return;
			reply = '<b>Wi-Fi room Giveaway help and info</b><br />' +
			'- help user - shows list of participation commands<br />' +
			'- help staff - shows giveaway staff commands (Requires: + % @ # & ~)<br />' +
			'- help gts - shows gts giveaway commands (Requires: + % @ # & ~)';
		}
		this.sendReplyBox(reply);
	},
};

exports.commands = {
	'giveaway': commands,
	'ga': commands.guess,
	'gh': commands.help,
	'qg': commands.question,
	'lg': commands.lottery,
	'gts': commands.gts,
	'left': commands.left,
	'sent': commands.sent,
};
