/**
* Wi-Fi chat-plugin. Only works in a room with id 'wifi'
* Handles giveaways in the formats: question, lottery, gts
* Written by bumbadadabum, based on the original plugin as written by Codelegend, SilverTactic, DanielCranham
**/

'use strict';

Punishments.roomPunishmentTypes.set('GIVEAWAYBAN', 'banned from giveaways');

const BAN_DURATION = 7 * 24 * 60 * 60 * 1000;

// Regex copied from the client
const domainRegex = '[a-z0-9\\-]+(?:[.][a-z0-9\\-]+)*';
const parenthesisRegex = '[(](?:[^\\s()<>&]|&amp;)*[)]';
const linkRegex = new RegExp(
	'\\b' +
	'(?:' +
		'(?:' +
			// When using www. or http://, allow any-length TLD (like .museum)
			'(?:https?://|www[.])' + domainRegex +
			'|' + domainRegex + '[.]' +
				// Allow a common TLD, or any 2-3 letter TLD followed by : or /
				'(?:com?|org|net|edu|info|us|jp|[a-z]{2,3}(?=[:/]))' +
		')' +
		'(?:[:][0-9]+)?' +
		'\\b' +
		'(?:' +
			'/' +
			'(?:' +
				'(?:' +
					'[^\\s()&]|&amp;|&quot;' +
					'|' + parenthesisRegex +
				')*' +
				// URLs usually don't end with punctuation, so don't allow
				// punctuation symbols that probably aren't related to URL.
				'(?:' +
					'[^\\s`()\\[\\]{}\'".,!?;:&]' +
					'|' + parenthesisRegex +
				')' +
			')?' +
		')?' +
		'|[a-z0-9.]+\\b@' + domainRegex + '[.][a-z]{2,3}' +
	')' +
	'(?!.*&gt;)',
	'ig'
);
const hyperlinkRegex = new RegExp(`(.+)&lt;(.+)&gt;`, 'i');

const formattingResolvers = [
	{token: "**", resolver: str => `<b>${str}</b>`},
	{token: "__", resolver: str => `<i>${str}</i>`},
	{token: "``", resolver: str => `<code>${str}</code>`},
	{token: "~~", resolver: str => `<s>${str}</s>`},
	{token: "^^", resolver: str => `<sup>${str}</sup>`},
	{token: "\\", resolver: str => `<sub>${str}</sub>`},
	{token: "&lt;&lt;", endToken: "&gt;&gt;", resolver: str => str.replace(/[a-z0-9-]/g, '').length ? false : `&laquo;<a href="${str}" target="_blank">${str}</a>&raquo;`},
	{token: "[[", endToken: "]]", resolver: str => {
		let hl = hyperlinkRegex.exec(str);
		if (hl) return `<a href="${hl[2].trim().replace(/^([a-z]*[^a-z:])/g, 'http://$1')}">${hl[1].trim()}</a>`;

		let query = str;
		let querystr = str;
		let split = str.split(':');
		if (split.length > 1) {
			let opt = toId(split[0]);
			query = split.slice(1).join(':').trim();

			switch (opt) {
			case 'wiki':
			case 'wikipedia':
				return `<a href="http://en.wikipedia.org/w/index.php?title=Special:Search&search=${encodeURIComponent(query)}" target="_blank">${querystr}</a>`;
			case 'yt':
			case 'youtube':
				query += " site:youtube.com";
				querystr = `yt: ${query}`;
			}
		}

		return `<a href="http://www.google.com/search?ie=UTF-8&btnI&q=${encodeURIComponent(query)}" target="_blank">${querystr}</a>`;
	}},
];

function toPokemonId(str) {
	return str.toLowerCase().replace(/é/g, 'e').replace(/[^a-z0-9 /]/g, '');
}

class Giveaway {
	constructor(host, giver, room, ot, tid, fc, prize) {
		if (room.gaNumber) {
			room.gaNumber++;
		} else {
			room.gaNumber = 1;
		}
		this.host = host;
		this.giver = giver;
		this.room = room;
		this.ot = ot;
		this.tid = tid;
		this.fc = `${fc.substr(0, 4)}-${fc.substr(4, 4)}-${fc.substr(8, 4)}`;

		this.prize = prize;
		this.phase = 'pending';

		this.joined = {};

		this.sprite = Giveaway.getSprite(prize);
	}

	send(content) {
		this.room.add(`|uhtml|giveaway${this.room.gaNumber}${this.phase}|<div class="broadcast-blue">${content}</div>`);
		this.room.update();
	}

	changeUhtml(content) {
		this.room.add(`|uhtmlchange|giveaway${this.room.gaNumber}${this.phase}|<div class="broadcast-blue">${content}</div>`);
		this.room.update();
	}

	clearTimer() {
		if (this.timer) {
			clearTimeout(this.timer);
			delete this.timer;
		}
	}

	checkJoined(user) {
		for (let ip in this.joined) {
			if (user.latestIp === ip) return ip;
			if (this.joined[ip] in user.prevNames) return this.joined[ip];
		}
		return false;
	}

	kickUser(user) {
		for (let ip in this.joined) {
			if (user.latestIp === ip || this.joined[ip] in user.prevNames) {
				if (this.generateReminder) user.sendTo(this.room, `|uhtmlchange|giveaway${this.room.gaNumber}${this.phase}|<div class="broadcast-blue">${this.generateReminder()}</div>`);
				delete this.joined[ip];
			}
		}
	}

	checkExcluded(user) {
		if (Giveaway.checkBanned(this.room, user)) return true;
		if (user === this.giver || user.latestIp in this.giver.ips || toId(user) in this.giver.prevNames) return true;
		if (user === this.host || user.latestIp in this.host.ips || toId(user) in this.host.prevNames) return true;
		return false;
	}

	static checkBanned(room, user) {
		return Punishments.getRoomPunishType(room, toId(user)) === 'GIVEAWAYBAN';
	}

	static ban(room, user, reason) {
		Punishments.roomPunish(room, user, ['GIVEAWAYBAN', toId(user), Date.now() + BAN_DURATION, reason]);
	}

	static unban(room, user) {
		Punishments.roomUnpunish(room, toId(user), 'GIVEAWAYBAN');
	}

	static getSprite(text) {
		text = toPokemonId(text);
		let mons = new Map();
		let output = '';
		for (let i in Tools.data.Pokedex) {
			let id = i;
			if (!Tools.data.Pokedex[i].baseSpecies && (Tools.data.Pokedex[i].species.includes(' '))) {
				id = toPokemonId(Tools.data.Pokedex[i].species);
			}
			let regexp = new RegExp(`\\b${id}\\b`);
			if (regexp.test(text)) {
				let mon = Tools.getTemplate(i);
				mons.set(mon.baseSpecies, mon);
			}
		}
		// the previous regex doesn't match "nidoran-m" or "nidoran male"
		if (/\bnidoran\W{0,1}m(ale){0,1}\b/.test(text)) {
			mons.set('Nidoran-M', Tools.getTemplate('nidoranm'));
		}
		if (/\bnidoran\W{0,1}f(emale){0,1}\b/.test(text)) {
			mons.set('Nidoran-F', Tools.getTemplate('nidoranf'));
		}
		text = toId(text);
		if (mons.size) {
			mons.forEach(function (value, key) {
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
				if (mons.size > 1) {
					let top = Math.floor(value.num / 12) * 30;
					let left = (value.num % 12) * 40;
					output += `<div style="display:inline-block;width:40px;height:30px;background:transparent url('/sprites/smicons-sheet.png?a1') no-repeat scroll -${left}px -${top}px'"></div>`;
				} else {
					let shiny = (text.includes("shiny") && !text.includes("shinystone") ? '-shiny' : '');
					output += `<img src="/sprites/xyani${shiny}/${spriteid}.gif">`;
				}
			});
		}
		return output;
	}

	static parseText(str) {
		// Manually unescape '/' since this is needed for links.
		str = Chat.escapeHTML(str).replace(/&#x2f;/g, '/').replace(linkRegex, uri => `<a href=${uri.replace(/^([a-z]*[^a-z:])/g, 'http://$1')}>${uri}</a>`);

		// Primarily a test for a new way of parsing chat formatting. Will be moved to Chat once it's sufficiently finished and polished.
		let output = [''];
		let stack = [];

		let parse = true;

		let i = 0;
		mainLoop: while (i < str.length) {
			let token = str[i];

			// Hardcoded parsing
			if (parse && token === '`' && str.substr(i, 2) === '``') {
				stack.push('``');
				output.push('');
				parse = false;
				i += 2;
				continue;
			}

			for (let f = 0; f < formattingResolvers.length; f++) {
				let start = formattingResolvers[f].token;
				let end = formattingResolvers[f].endToken || start;

				if (stack.length && end.startsWith(token) && str.substr(i, end.length) === end && output[stack.length].replace(token, '').length) {
					for (let j = stack.length - 1; j >= 0; j--) {
						if (stack[j] === start) {
							parse = true;

							while (stack.length > j + 1) {
								output[stack.length - 1] += stack.pop() + output.pop();
							}

							let str = output.pop();
							let outstr = formattingResolvers[f].resolver(str.trim());
							if (!outstr) outstr = `${start}${str}${end}`;
							output[stack.length - 1] += outstr;
							i += end.length;
							stack.pop();
							continue mainLoop;
						}
					}
				}

				if (parse && start.startsWith(token) && str.substr(i, start.length) === start) {
					stack.push(start);
					output.push('');
					i += start.length;
					continue mainLoop;
				}
			}

			output[stack.length] += token;
			i++;
		}

		while (stack.length) {
			output[stack.length - 1] += stack.pop() + output.pop();
		}

		return output[0];
	}

	generateWindow(rightSide) {
		return `<p style="text-align:center;font-size:14pt;font-weight:bold;margin-bottom:2px;">It's giveaway time!</p>` +
			`<p style="text-align:center;font-size:7pt;">Giveaway started by ${Chat.escapeHTML(this.host.name)}</p>` +
			`<table style="margin-left:auto;margin-right:auto;"><tr><td style="text-align:center;width:45%">${this.sprite}<p style="font-weight:bold;">Giver: ${this.giver}</p>${Giveaway.parseText(this.prize)}<br />OT: ${Chat.escapeHTML(this.ot)}, TID: ${this.tid}</td>` +
			`<td style="text-align:center;width:45%">${rightSide}</td></tr></table><p style="text-align:center;font-size:7pt;font-weight:bold;"><u>Note:</u> Please do not join if you don't have a 3DS, a copy of Pokémon Sun/Moon, or are currently unable to receive the prize.</p>`;
	}
}

class QuestionGiveaway extends Giveaway {
	constructor(host, giver, room, ot, tid, fc, prize, question, answers) {
		super(host, giver, room, ot, tid, fc, prize);
		this.type = 'question';

		this.question = question;
		this.answers = QuestionGiveaway.sanitizeAnswers(answers);
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
		this.timer = setTimeout(() => this.end(), 1000 * 60 * 5);
	}

	guessAnswer(user, guess) {
		if (this.phase !== 'started') return user.sendTo(this.room, "The giveaway has not started yet.");

		if (this.checkJoined(user) && Object.values(this.joined).indexOf(user.userid) < 0) return user.sendTo(this.room, "You have already joined the giveaway.");
		if (this.checkExcluded(user)) return user.sendTo(this.room, "You are disallowed from entering the giveaway.");

		if (!this.answered[user.userid]) this.answered[user.userid] = 0;
		if (this.answered[user.userid] >= 3) return user.sendTo(this.room, "You have already guessed three times. You cannot guess anymore in this giveaway.");

		let sanitized = toId(guess);

		for (let i = 0; i < this.answers.length; i++) {
			if (toId(this.answers[i]) === sanitized) {
				this.winner = user;
				this.clearTimer();
				return this.end();
			}
		}

		this.joined[user.latestIp] = user.userid;
		this.answered[user.userid]++;
		if (this.answered[user.userid] >= 3) {
			user.sendTo(this.room, `Your guess '${guess}' is wrong. You have used up all of your guesses. Better luck next time!`);
		} else {
			user.sendTo(this.room, `Your guess '${guess}' is wrong. Try again!`);
		}
	}

	change(key, value, user) {
		if (user.userid !== this.host.userid) return user.sendTo(this.room, "Only the host can edit the giveaway.");
		if (this.phase !== 'pending') return user.sendTo(this.room, "You cannot change the question or answer once the giveaway has started.");
		if (key === 'question') {
			this.question = value;
			return user.sendTo(this.room, `The question has been changed to ${value}.`);
		}
		let ans = QuestionGiveaway.sanitizeAnswers(value);
		if (!ans.length) return user.sendTo(this.room, "You must specify at least one answer and it must not contain any special characters.");
		this.answers = ans;
		user.sendTo(this.room, `The answer${Chat.plural(ans, "s have", "has")} been changed to ${ans.join(', ')}.`);
	}

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
				this.room.modlog(`${this.winner.name} won ${this.giver.name}'s giveaway for a "${this.prize}" (OT: ${this.ot} TID: ${this.tid} FC: ${this.fc})`);
				this.send(this.generateWindow(`<p style="text-align:center;font-size:12pt;"><b>${Chat.escapeHTML(this.winner.name)}</b> won the giveaway! Congratulations!</p>` +
				`<p style="text-align:center;">${this.question}<br />Correct answer${Chat.plural(this.answers)}: ${this.answers.join(', ')}</p>`));
				this.winner.sendTo(this.room, `You have won the giveaway. PM **${Chat.escapeHTML(this.giver.name)}** (FC: ${this.fc}) to claim your prize!`);
				if (this.winner.connected) this.winner.popup(`You have won the giveaway. PM **${Chat.escapeHTML(this.giver.name)}** (FC: ${this.fc}) to claim your prize!`);
				if (this.giver.connected) this.giver.popup(`${Chat.escapeHTML(this.winner.name)} has won your question giveaway!`);
			}
		}

		delete this.room.giveaway;
	}

	static sanitize(str) {
		return str.toLowerCase().replace(/[^a-z0-9 .-]+/ig, "").trim();
	}

	static sanitizeAnswers(answers) {
		return answers.map(val => QuestionGiveaway.sanitize(val)).filter((val, index, array) => toId(val).length && array.indexOf(val) === index);
	}
}

class LotteryGiveaway extends Giveaway {
	constructor(host, giver, room, ot, tid, fc, prize, winners) {
		super(host, giver, room, ot, tid, fc, prize);

		this.type = 'lottery';

		this.maxwinners = winners || 1;

		this.send(this.generateReminder(false));

		this.timer = setTimeout(() => this.drawLottery(), 1000 * 60 * 2);
	}

	generateReminder(joined) {
		let cmd = (joined ? 'Leave' : 'Join');
		let button = `<button style="margin:4px;" name="send" value="/giveaway ${toId(cmd)}lottery"><font size=1><b>${cmd}</b></font></button>`;
		return this.generateWindow(`The lottery drawing will occur in 2 minutes, and with ${this.maxwinners} winner${Chat.plural(this.maxwinners)}!<br />${button}</p>`);
	}

	display() {
		let joined = this.generateReminder(true);
		let notJoined = this.generateReminder();

		for (let i in this.room.users) {
			let thisUser = this.room.users[i];
			if (this.checkJoined(thisUser)) {
				thisUser.sendTo(this.room, `|uhtmlchange|giveaway${this.room.gaNumber}${this.phase}|<div class="broadcast-blue">${joined}</div>`);
			} else {
				thisUser.sendTo(this.room, `|uhtmlchange|giveaway${this.room.gaNumber}${this.phase}|<div class="broadcast-blue">${notJoined}</div>`);
			}
		}
	}

	addUser(user) {
		if (this.phase !== 'pending') return user.sendTo(this.room, "The join phase of the lottery giveaway has ended.");

		if (!user.named) return user.sendTo(this.room, "You need to choose a name before joining a lottery giveaway.");
		if (this.checkJoined(user)) return user.sendTo(this.room, "You have already joined the giveaway.");
		if (this.checkExcluded(user)) return user.sendTo(this.room, "You are disallowed from entering the giveaway.");

		this.joined[user.latestIp] = user.userid;
		user.sendTo(this.room, `|uhtmlchange|giveaway${this.room.gaNumber}${this.phase}|<div class="broadcast-blue">${this.generateReminder(true)}</div>`);
		user.sendTo(this.room, "You have successfully joined the lottery giveaway.");
	}

	removeUser(user) {
		if (this.phase !== 'pending') return user.sendTo(this.room, "The join phase of the lottery giveaway has ended.");
		if (!this.checkJoined(user)) return user.sendTo(this.room, "You have not joined the lottery giveaway.");
		for (let ip in this.joined) {
			if (ip === user.latestIp || this.joined[ip] === user.userid) {
				delete this.joined[ip];
			}
		}
		user.sendTo(this.room, `|uhtmlchange|giveaway${this.room.gaNumber}${this.phase}|<div class="broadcast-blue">${this.generateReminder(false)}</div>`);
		user.sendTo(this.room, "You have left the lottery giveaway.");
	}

	drawLottery() {
		this.clearTimer();

		let userlist = Object.values(this.joined);
		if (userlist.length < this.maxwinners) {
			this.changeUhtml('<p style="text-align:center;font-size:13pt;font-weight:bold;">The giveaway was forcibly ended.</p>');
			delete this.room.giveaway;
			return this.room.send("The giveaway has been forcibly ended as there are not enough participants.");
		}

		this.winners = [];
		while (this.winners.length < this.maxwinners) {
			let winner = Users(userlist.splice(Math.floor(Math.random() * userlist.length), 1)[0]);
			if (!winner) continue;
			this.winners.push(winner);
		}
		this.end();
	}

	end(force) {
		if (force) {
			this.clearTimer();
			this.changeUhtml('<p style="text-align:center;font-size:13pt;font-weight:bold;">The giveaway was forcibly ended.</p>');
			this.room.send("The giveaway was forcibly ended.");
		} else {
			this.changeUhtml(`<p style="text-align:center;font-size:13pt;font-weight:bold;">The giveaway has ended! Scroll down to see the winner${Chat.plural(this.winners)}.</p>`);
			this.phase = 'ended';
			let winnerNames = this.winners.map(winner => winner.name).join(', ');
			this.room.modlog(`${winnerNames} won ${this.giver.name}'s giveaway for "${this.prize}" (OT: ${this.ot} TID: ${this.tid} FC: ${this.fc})`);
			this.send(this.generateWindow(`<p style="text-align:center;font-size:10pt;font-weight:bold;">Lottery Draw</p><p style="text-align:center;">${Object.keys(this.joined).length} users joined the giveaway.<br />Our lucky winner${Chat.plural(this.winners)}: <b>${Chat.escapeHTML(winnerNames)}!</b> Congratulations!</p>`));
			for (let i = 0; i < this.winners.length; i++) {
				this.winners[i].sendTo(this.room, `You have won the lottery giveaway! PM **${this.giver.name}** (FC: ${this.fc}) to claim your prize!`);
				if (this.winners[i].connected) this.winners[i].popup(`You have won the lottery giveaway! PM **${this.giver.name}** (FC: ${this.fc}) to claim your prize!`);
			}
			if (this.giver.connected) this.giver.popup(`The following users have won your lottery giveaway:\n${Chat.escapeHTML(winnerNames)}`);
		}
		delete this.room.giveaway;
	}
}

class GtsGiveaway {
	constructor(room, giver, amount, summary, deposit, lookfor) {
		if (room.gtsNumber) {
			room.gtsNumber++;
		} else {
			room.gtsNumber = 1;
		}
		this.room = room;
		this.giver = giver;
		this.left = amount;
		this.summary = summary;
		this.deposit = GtsGiveaway.linkify(Chat.escapeHTML(deposit));
		this.lookfor = lookfor;

		this.sprite = Giveaway.getSprite(this.summary);
		this.sent = [];

		this.timer = setInterval(() => this.send(this.generateWindow()), 1000 * 60 * 5);
		this.send(this.generateWindow());
	}

	send(content) {
		this.room.add(`|uhtml|gtsga${this.room.gtsNumber}|<div class="broadcast-blue">${content}</div>`);
		this.room.update();
	}

	changeUhtml(content) {
		this.room.add(`|uhtmlchange|gtsga${this.room.gtsNumber}|<div class="broadcast-blue">${content}</div>`);
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
		return `<p style="text-align:center;font-size:14pt;font-weight:bold;margin-bottom:2px;">There is a GTS giveaway going on!</p>` +
			`<p style="text-align:center;font-size:10pt;margin-top:0px;">Hosted by: ${Chat.escapeHTML(this.giver.name)} | Left: <b>${this.left}</b></p>` +
			`<table style="margin-left:auto;margin-right:auto;"><tr>` +
			(sentModifier ? `<td style="text-align:center;width:10%"><b>Last winners:</b><br/>${this.sent.join('<br/>')}</td>` : '') +
			`<td style="text-align:center;width:15%">${this.sprite}</td><td style="text-align:center;width:${40 - sentModifier}%">${Giveaway.parseText(this.summary)}</td>` +
			`<td style="text-align:center;width:${35 - sentModifier}%">To participate, deposit <strong>${this.deposit}</strong> into the GTS and look for <strong>${Chat.escapeHTML(this.lookfor)}</strong></td></tr></table>`;
	}

	updateLeft(number) {
		this.left = number;
		if (this.left < 1) return this.end();

		this.changeUhtml(this.generateWindow());
	}

	updateSent(ign) {
		this.left--;
		if (this.left < 1) return this.end();

		this.sent.push(Chat.escapeHTML(ign));
		if (this.sent.length > 5) this.sent.shift();

		this.changeUhtml(this.generateWindow());
	}

	end(force) {
		if (force) {
			this.clearTimer();
			this.changeUhtml('<p style="text-align:center;font-size:13pt;font-weight:bold;">The GTS giveaway was forcibly ended.</p>');
			this.room.send("The GTS giveaway was forcibly ended.");
		} else {
			this.clearTimer();
			this.changeUhtml(`<p style="text-align:center;font-size:13pt;font-weight:bold;">The GTS giveaway has finished.</p>`);
			this.room.modlog(`${this.giver.name} has finished their GTS giveaway for "${this.summary}"`);
			this.send(`<p style="text-align:center;font-size:11pt">The GTS giveaway for a "<strong>${Chat.escapeHTML(this.summary)}</strong>" has finished.</p>`);
		}
		delete this.room.gtsga;
	}

	// This currently doesn't match some of the edge cases the other pokemon matching function does account for (such as Type: Null). However, this should never be used as a fodder mon anyway, so I don't see a huge need to implement it.
	static linkify(text) {
		let parsed = text.toLowerCase().replace(/é/g, 'e');

		for (let i in Tools.data.Pokedex) {
			let id = i;
			if (!Tools.data.Pokedex[i].baseSpecies && (Tools.data.Pokedex[i].species.includes(' '))) {
				id = toPokemonId(Tools.data.Pokedex[i].species);
			}
			let regexp = new RegExp(`\\b${id}\\b`, 'ig');
			let res = regexp.exec(parsed);
			if (res) {
				let num = Tools.data.Pokedex[i].num < 100 ? (Tools.data.Pokedex[i].num < 10 ? `00${Tools.data.Pokedex[i].num}` : `0${Tools.data.Pokedex[i].num}`) : Tools.data.Pokedex[i].num;
				return `${text.slice(0, res.index)}<a href="http://www.serebii.net/pokedex-sm/location/${num}.shtml">${text.slice(res.index, res.index + res[0].length)}</a>${text.slice(res.index + res[0].length)}`;
			}
		}
		return text;
	}
}

let commands = {
	// question giveaway.
	quiz: 'question',
	qg: 'question',
	question: function (target, room, user) {
		if (room.id !== 'wifi' || !target) return false;
		if (room.giveaway) return this.errorReply("There is already a giveaway going on!");

		let [giver, ot, tid, fc, prize, question, ...answers] = target.split(target.includes('|') ? '|' : ',').map(param => param.trim());
		if (!(giver && ot && tid && fc && prize && question && answers.length)) return this.errorReply("Invalid arguments specified - /question giver, ot, tid, fc, prize, question, answer(s)");
		tid = toId(tid);
		if (isNaN(tid) || tid.length < 5 || tid.length > 6) return this.errorReply("Invalid TID");
		fc = toId(fc);
		if (!parseInt(fc) || fc.length !== 12) return this.errorReply("Invalid FC");
		let targetUser = Users(giver);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User '${giver}' is not online.`);
		if (!this.can('warn', null, room) && !(this.can('broadcast', null, room) && user === targetUser)) return this.errorReply("Permission denied.");
		if (!targetUser.autoconfirmed) return this.errorReply(`User '${targetUser.name}' needs to be autoconfirmed to give something away.`);
		if (Giveaway.checkBanned(room, targetUser)) return this.errorReply(`User '${targetUser.name}' is giveaway banned.`);

		room.giveaway = new QuestionGiveaway(user, targetUser, room, ot, tid, fc, prize, question, answers);

		this.privateModCommand(`(${user.name} started a question giveaway for ${targetUser.name})`);
	},
	changeanswer: 'changequestion',
	changequestion: function (target, room, user, conn, cmd) {
		if (room.id !== 'wifi') return false;
		if (!room.giveaway) return this.errorReply("There is no giveaway going on at the moment.");
		if (room.giveaway.type !== 'question') return this.errorReply("This is not a question giveaway.");

		target = target.trim();
		if (!target) return this.errorReply("You must include a question or an answer.");
		room.giveaway.change(cmd.substr(6), target, user);
	},
	showanswer: 'viewanswer',
	viewanswer: function (target, room, user) {
		if (room.id !== 'wifi') return false;
		let giveaway = room.giveaway;
		if (!giveaway) return this.errorReply("There is no giveaway going on at the moment.");
		if (giveaway.type !== 'question') return this.errorReply("This is not a question giveaway.");
		if (user.userid !== giveaway.host.userid && user.userid !== giveaway.giver.userid) return;

		this.sendReply(`The giveaway question is ${giveaway.question}.\n` +
			`The answer${Chat.plural(giveaway.answers, 's are', ' is')} ${giveaway.answers.join(', ')}.`);
	},
	guessanswer: 'guess',
	guess: function (target, room, user) {
		if (room.id !== 'wifi') return this.errorReply("This command can only be used in the Wi-Fi room.");
		if (!this.canTalk()) return;
		if (!room.giveaway) return this.errorReply("There is no giveaway going on at the moment.");
		if (room.giveaway.type !== 'question') return this.errorReply("This is not a question giveaway.");
		room.giveaway.guessAnswer(user, target);
	},

	// lottery giveaway.
	lg: 'lottery',
	lotto: 'lottery',
	lottery: function (target, room, user) {
		if (room.id !== 'wifi' || !target) return false;
		if (room.giveaway) return this.errorReply("There is already a giveaway going on!");

		let [giver, ot, tid, fc, prize, winners] = target.split(target.includes('|') ? '|' : ',').map(param => param.trim());
		if (!(giver && ot && tid && fc && prize)) return this.errorReply("Invalid arguments specified - /lottery giver, ot, tid, fc, prize, winners");
		tid = toId(tid);
		if (isNaN(tid) || tid.length < 5 || tid.length > 6) return this.errorReply("Invalid TID");
		fc = toId(fc);
		if (!parseInt(fc) || fc.length !== 12) return this.errorReply("Invalid FC");
		let targetUser = Users(giver);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User '${giver}' is not online.`);
		if (!this.can('warn', null, room) && !(this.can('broadcast', null, room) && user === targetUser)) return this.errorReply("Permission denied.");
		if (!targetUser.autoconfirmed) return this.errorReply(`User '${targetUser.name}' needs to be autoconfirmed to give something away.`);
		if (Giveaway.checkBanned(room, targetUser)) return this.errorReply(`User '${targetUser.name}' is giveaway banned.`);

		let numWinners = 1;
		if (winners) {
			numWinners = parseInt(winners);
			if (isNaN(numWinners) || numWinners < 1 || numWinners > 10) return this.errorReply("The lottery giveaway can have a minimum of 1 and a maximum of 10 winners.");
		}

		room.giveaway = new LotteryGiveaway(user, targetUser, room, ot, tid, fc, prize, numWinners);

		this.privateModCommand(`(${user.name} started a lottery giveaway for ${targetUser.name})`);
	},
	leavelotto: 'join',
	leavelottery: 'join',
	leave: 'join',
	joinlotto: 'join',
	joinlottery: 'join',
	join: function (target, room, user, conn, cmd) {
		if (room.id !== 'wifi') return this.errorReply("This command can only be used in the Wi-Fi room.");
		if (!this.canTalk()) return;
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
	gts: function (target, room, user) {
		if (room.id !== 'wifi' || !target) return false;
		if (room.gtsga) return this.errorReply("There is already a GTS giveaway going on!");

		let [giver, amount, summary, deposit, lookfor] = target.split(target.includes('|') ? '|' : ',').map(param => param.trim());
		if (!(giver && amount && summary && deposit && lookfor)) return this.errorReply("Invalid arguments specified - /gts giver, amount, summary, deposit, lookfor");
		amount = parseInt(amount);
		if (!amount || amount < 30 || amount > 100) return this.errorReply("Please enter a valid amount. For a GTS giveaway, you need to give away at least 30 mons, and no more than 100.");
		let targetUser = Users(giver);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User '${giver}' is not online.`);
		if (!this.can('warn', null, room)) return this.errorReply("Permission denied.");
		if (!targetUser.autoconfirmed) return this.errorReply(`User '${targetUser.name}' needs to be autoconfirmed to host a giveaway.`);
		if (Giveaway.checkBanned(room, targetUser)) return this.errorReply(`User '${targetUser.name}' is giveaway banned.`);

		room.gtsga = new GtsGiveaway(room, targetUser, amount, summary, deposit, lookfor);

		this.privateModCommand(`(${user.name} started a GTS giveaway for ${targetUser.name})`);
	},
	left: function (target, room, user) {
		if (room.id !== 'wifi') return false;
		if (!room.gtsga) return this.errorReply("There is no GTS giveaway going on!");
		if (!user.can('warn', null, room) && user !== room.gtsga.giver) return this.errorReply("Only the host or a staff member can update GTS giveaways.");
		if (!target) {
			if (!this.runBroadcast()) return;
			return this.sendReply(`The GTS giveaway from ${room.gtsga.giver} has ${room.gtsga.left} Pokémon remaining!`);
		}
		let newamount = parseInt(target);
		if (isNaN(newamount)) return this.errorReply("Please enter a valid amount.");
		if (newamount > room.gtsga.left) return this.errorReply("The new amount must be lower than the old amount.");

		room.gtsga.updateLeft(newamount);
	},
	sent: function (target, room, user) {
		if (room.id !== 'wifi') return false;
		if (!room.gtsga) return this.errorReply("There is no GTS giveaway going on!");
		if (!user.can('warn', null, room) && user !== room.gtsga.giver) return this.errorReply("Only the host or a staff member can update GTS giveaways.");

		if (!target || target.length > 12) return this.errorReply("Please enter a valid IGN.");

		room.gtsga.updateSent(target);
	},
	endgts: function (target, room, user) {
		if (room.id !== 'wifi') return this.errorReply("This command can only be used in the Wi-Fi room.");
		if (!room.gtsga) return this.errorReply("There is no GTS giveaway going on at the moment.");
		if (!this.can('warn', null, room)) return false;

		if (target && target.length > 300) {
			return this.errorReply("The reason is too long. It cannot exceed 300 characters.");
		}
		room.gtsga.end(true);
		if (target) target = `: ${target}`;
		this.privateModCommand(`(The giveaway was forcibly ended by ${user.name}${target})`);
	},
	// general.
	ban: function (target, room, user) {
		if (!target) return false;
		if (room.id !== 'wifi') return this.errorReply("This command can only be used in the Wi-Fi room.");
		if (!this.can('warn', null, room)) return false;

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply(`User '${this.targetUsername}' not found.`);
		if (target.length > 300) {
			return this.errorReply("The reason is too long. It cannot exceed 300 characters.");
		}
		if (Giveaway.checkBanned(room, targetUser)) return this.errorReply(`User '${this.targetUsername}' is already banned from entering giveaways.`);

		Giveaway.ban(room, targetUser, target);
		if (room.giveaway) room.giveaway.kickUser(targetUser);
		if (target) target = ` (${target})`;
		this.privateModCommand(`(${targetUser.name} was banned from entering giveaways by ${user.name}.${target})`);
	},
	unban: function (target, room, user) {
		if (!target) return false;
		if (room.id !== 'wifi') return this.errorReply("This command can only be used in the Wi-Fi room.");
		if (!this.can('warn', null, room)) return false;

		this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply(`User '${this.targetUsername}' not found.`);
		if (!Giveaway.checkBanned(room, targetUser)) return this.errorReply(`User '${this.targetUsername}' isn't banned from entering giveaways.`);

		Giveaway.unban(room, targetUser);
		this.privateModCommand(`${targetUser.name} was unbanned from entering giveaways by ${user.name}.`);
	},
	stop: 'end',
	end: function (target, room, user) {
		if (room.id !== 'wifi') return this.errorReply("This command can only be used in the Wi-Fi room.");
		if (!room.giveaway) return this.errorReply("There is no giveaway going on at the moment.");
		if (!this.can('warn', null, room) && user.userid !== room.giveaway.host.userid) return false;

		if (target && target.length > 300) {
			return this.errorReply("The reason is too long. It cannot exceed 300 characters.");
		}
		room.giveaway.end(true);
		if (target) target = `: ${target}`;
		this.privateModCommand(`(The giveaway was forcibly ended by ${user.name}${target})`);
	},
	rm: 'remind',
	remind: function (target, room, user) {
		if (room.id !== 'wifi') return this.errorReply("This command can only be used in the Wi-Fi room.");
		let giveaway = room.giveaway;
		if (!giveaway) return this.errorReply("There is no giveaway going on at the moment.");
		if (!this.runBroadcast()) return;
		if (giveaway.type === 'question') {
			if (giveaway.phase !== 'started') return this.errorReply("The giveaway has not started yet.");
			room.giveaway.send(room.giveaway.generateQuestion());
		} else {
			room.giveaway.display();
		}
	},
	'': 'help',
	help: function (target, room, user) {
		if (room.id !== 'wifi') return this.errorReply("This command can only be used in the Wi-Fi room.");

		let reply = '';
		switch (target) {
		case 'staff':
			if (!this.can('broadcast', null, room)) return;
			reply = '<strong>Staff commands:</strong><br />' +
			        '- question or qg <em>User | OT | TID | Friend Code | Prize | Question | Answer[ | Answer2 | Answer3]</em> - Start a new question giveaway (voices can only host for themselves, staff can for all users) (Requires: + % @ * # & ~)<br />' +
			        '- lottery or lg <em>User | OT | TID | Friend Code | Prize[| Number of Winners]</em> - Starts a lottery giveaway (voices can only host for themselves, staff can for all users) (Requires: + % @ * # & ~)<br />' +
			        '- gts <em>User | Amount | Summary of given mon | What to deposit | What to look for</em> - Starts a gts giveaway (voices can only host for themselves, staff can for all users) (Requires: + % @ * # & ~)<br />' +
			        '- changequestion - Changes the question of a question giveaway (Requires: giveaway host)<br />' +
			        '- changeanswer - Changes the answer of a question giveaway (Requires: giveaway host)<br />' +
					'- viewanswer - Shows the answer in a question giveaway (only to giveaway host/giver)<br />' +
					'- left <em>Amount</em> - Updates the amount left for the current GTS giveaway.<br />' +
					'- ban - Temporarily bans a user from entering giveaways (Requires: % @ * # & ~)<br />' +
			        '- end - Forcibly ends the current giveaway (Requires: % @ * # & ~)<br />';
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
			'- help staff - shows giveaway staff commands (Requires: + % @ * # & ~)';
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
