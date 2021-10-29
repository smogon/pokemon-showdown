/**
 * Wi-Fi chat-plugin. Only works in a room with id 'wifi'
 * Handles giveaways in the formats: question, lottery, gts
 * Written by bumbadadabum, based on the original plugin as written by Codelegend, SilverTactic, DanielCranham
 */

import {FS, Utils} from '../../lib';

Punishments.addRoomPunishmentType({
	type: 'GIVEAWAYBAN',
	desc: 'banned from giveaways',
});

const BAN_DURATION = 7 * 24 * 60 * 60 * 1000;
const RECENT_THRESHOLD = 30 * 24 * 60 * 60 * 1000;

const DATA_FILE = 'config/chat-plugins/wifi.json';

type Game = 'swsh' | 'bdsp';

interface QuestionGiveawayData {
	targetUserid: string;
	ot: string;
	tid: string;
	game: Game;
	prize: PokemonSet;
	question: string;
	answers: string[];
}

interface LotteryGiveawayData {
	targetUserid: string;
	ot: string;
	tid: string;
	game: Game;
	prize: PokemonSet;
	winners: number;
}

interface WifiData {
	stats: {[k: string]: number[]};
	storedGiveaways: {question: QuestionGiveawayData[], lottery: LotteryGiveawayData[]};
	submittedGiveaways: {question: QuestionGiveawayData[], lottery: LotteryGiveawayData[]};
}

const wifiData: WifiData = (() => {
	try {
		return JSON.parse(FS(DATA_FILE).readIfExistsSync());
	} catch {
		return {
			stats: {},
			storedGiveaways: {
				question: [],
				lottery: [],
			},
			submittedGiveaways: {
				question: [],
				lottery: [],
			},
		};
	}
})();

function saveData() {
	FS(DATA_FILE).writeUpdate(() => JSON.stringify(wifiData));
}

// Convert old file type
if (!wifiData.stats && !wifiData.storedGiveaways && !wifiData.submittedGiveaways) {
	const stats = wifiData;
	for (const i in wifiData) {
		delete (wifiData as any)[i];
	}
	(wifiData as any).stats = stats;
	wifiData.storedGiveaways = wifiData.submittedGiveaways = {
		question: [],
		lottery: [],
	};
	saveData();
}

class Giveaway extends Rooms.RoomGame {
	gaNumber: number;
	host: User;
	giver: User;
	room: Room;
	ot: string;
	tid: string;
	game: Game;
	prize: PokemonSet;
	phase: string;
	/**
	 * IP:userid
	 */
	joined: Map<string, ID>;
	timer: NodeJS.Timer | null;
	monIDs: Set<string>;
	sprite: string;

	constructor(
		host: User, giver: User, room: Room,
		ot: string, tid: string, prize: PokemonSet, game: Game = 'bdsp'
	) {
		// Make into a sub-game if the gts ever opens up again
		super(room);
		this.gaNumber = room.nextGameNumber();
		this.host = host;
		this.giver = giver;
		this.room = room;
		this.ot = ot;
		this.tid = tid;

		this.game = game;
		this.prize = prize;
		this.phase = 'pending';

		this.joined = new Map();

		this.timer = null;

		this.monIDs = new Set();
		this.sprite = '';
		[this.monIDs, this.sprite] = Giveaway.getSprite(prize.species);
	}

	destroy() {
		this.clearTimer();
		super.destroy();
	}

	generateReminder() {}

	send(content: string) {
		this.room.add(`|uhtml|giveaway${this.gaNumber}${this.phase}|<div class="broadcast-blue">${content}</div>`);
		this.room.update();
	}

	changeUhtml(content: string) {
		this.room.uhtmlchange(`giveaway${this.gaNumber}${this.phase}`, `<div class="broadcast-blue">${content}</div>`);
		this.room.update();
	}

	clearTimer() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}

	checkJoined(user: User) {
		for (const ip in this.joined) {
			if (user.latestIp === ip && !Config.noipchecks) return ip;
			const joined = this.joined.get(ip);
			if (joined && user.previousIDs.includes(joined)) return joined;
		}
		return false;
	}

	kickUser(user: User) {
		for (const ip in this.joined) {
			if (user.latestIp === ip && !Config.noipchecks || (this.joined.get(ip) && user.previousIDs.includes(this.joined.get(ip)!))) {
				user.sendTo(
					this.room,
					`|uhtmlchange|giveaway${this.gaNumber}${this.phase}|<div class="broadcast-blue">${this.generateReminder()}</div>`
				);
				this.joined.delete(ip);
			}
		}
	}

	checkExcluded(user: User) {
		return (
			user === this.giver ||
			!Config.noipchecks && this.giver.ips.includes(user.latestIp) ||
			this.giver.previousIDs.includes(toID(user))
		);
	}

	static checkBanned(room: Room, user: User) {
		return Punishments.hasRoomPunishType(room, toID(user), 'GIVEAWAYBAN');
	}

	static ban(room: Room, user: User, reason: string) {
		Punishments.roomPunish(room, user, {
			type: 'GIVEAWAYBAN',
			id: toID(user),
			expireTime: Date.now() + BAN_DURATION,
			reason,
		});
	}

	static unban(room: Room, user: User) {
		Punishments.roomUnpunish(room, toID(user), 'GIVEAWAYBAN', false);
	}

	static getSprite(text: string): [Set<string>, string] {
		text = toID(text);
		const mons = new Map<string, Species>();
		let output = '';
		const monIDs = new Set<string>();
		for (const species of Dex.species.all()) {
			let id: string = species.id;
			if (species.baseSpecies === species.name && species.name.includes(' ')) {
				id = toID(species.name);
			}
			const regexp = new RegExp(`\\b${id}\\b`);
			if (regexp.test(text)) {
				const mon = Dex.species.get(species.id);
				mons.set(mon.baseSpecies, mon);
			}
		}
		// the previous regex doesn't match "nidoran-m" or "nidoran male"
		if (/\bnidoran\W{0,1}m(ale){0,1}\b/.test(text)) {
			mons.set('Nidoran-M', Dex.species.get('nidoranm'));
		}
		if (/\bnidoran\W{0,1}f(emale){0,1}\b/.test(text)) {
			mons.set('Nidoran-F', Dex.species.get('nidoranf'));
		}
		text = toID(text);
		if (mons.size) {
			for (const [name, species] of mons) {
				let spriteid = species.spriteid;
				if (species.cosmeticFormes) {
					for (const forme of species.cosmeticFormes.map(toID)) {
						if (text.includes(forme)) {
							spriteid += '-' + forme.slice(name.length);
							break; // We don't want to end up with deerling-summer-spring
						}
					}
				}
				if (species.otherFormes) {
					for (const forme of species.otherFormes.map(toID)) {
						// Allow "alolan <name>" to match as well.
						if (forme.endsWith('alola')) {
							if (/alolan?/.test(text)) {
								spriteid += '-alola';
								break;
							}
						}
						// Allow "galarian <name>" to match as well.
						if (forme.endsWith('galar')) {
							if (/galar(ian)?/.test(text)) {
								spriteid += '-galar';
								break;
							}
						}
						if (text.includes(forme)) {
							spriteid += '-' + forme.substr(name.length);
							break; // We don't want to end up with landorus-therian-therian
						}
					}
				}
				monIDs.add(spriteid);
				if (mons.size > 1) {
					output += `<psicon pokemon="${spriteid}" />`;
				} else {
					const shiny = (text.includes("shiny") && !text.includes("shinystone") ? '-shiny' : '');
					output += `<img src="/sprites/ani${shiny}/${spriteid}.gif">`;
				}
			}
		}
		return [monIDs, output];
	}

	static updateStats(monIDs: Set<string>) {
		for (const mon of monIDs) {
			if (!wifiData.stats[mon]) wifiData.stats[mon] = [];
			wifiData.stats[mon].push(Date.now());
		}
		saveData();
	}

	generateWindow(rightSide: string) {
		return `<p style="text-align:center;font-size:14pt;font-weight:bold;margin-bottom:2px;">It's giveaway time!</p>` +
			`<p style="text-align:center;font-size:7pt;">Giveaway started by ${Utils.escapeHTML(this.host.name)}</p>` +
			`<table style="margin-left:auto;margin-right:auto;"><tr><td style="text-align:center;width:45%">${this.sprite}<p style="font-weight:bold;">Giver: ${this.giver}</p>${Chat.formatText(this.prize.species, true)}<br />OT: ${Utils.escapeHTML(this.ot)}, TID: ${this.tid}</td>` +
			`<td style="text-align:center;width:45%">${rightSide}</td></tr></table><p style="text-align:center;font-size:7pt;font-weight:bold;"><u>Note:</u> You must have a Switch, Pokémon Sword/Shield, and Nintendo Switch Online to receive the prize. Do not join if you are currently unable to trade. Do not enter if you have already won this exact Pokémon, unless it is explicitly allowed.</p>`;
	}
}

export class QuestionGiveaway extends Giveaway {
	type: string;
	question: string;
	answers: string[];
	/** userid: number of guesses */
	answered: {[userid: string]: number};
	winner: User | null;

	constructor(
		host: User, giver: User, room: Room, ot: string, tid: string,
		game: Game, prize: PokemonSet, question: string, answers: string[]
	) {
		super(host, giver, room, ot, tid, prize, game);
		this.type = 'question';
		this.phase = 'pending';

		this.question = question;
		this.answers = QuestionGiveaway.sanitizeAnswers(answers);
		this.answered = {};
		this.winner = null;
		this.send(this.generateWindow('The question will be displayed in one minute! Use /ga to answer.'));

		this.timer = setTimeout(() => this.start(), 1000 * 60);
	}

	static splitTarget(target: string, sep = '|', context: Chat.CommandContext) {
		let [giver, ot, tid, game, prize, question, ...answers] = target.split(sep).map(param => param.trim());
		if (!(giver && ot && tid && prize && question && answers.length)) {
			throw new Chat.ErrorMessage("Invalid arguments specified - /qg giver | ot | tid | prize | question | answer(s)");
		}
		if (!game) game = 'swsh';
		tid = toID(tid);
		if (isNaN(parseInt(tid)) || tid.length < 5 || tid.length > 6) throw new Chat.ErrorMessage("Invalid TID");
		const targetUser = Users.get(giver);
		if (!targetUser?.connected) throw new Chat.ErrorMessage(`User '${giver}' is not online.`);
		if (context.user !== targetUser && !context.user.can('show', null, context.room!)) {
			context.checkCan('warn', null, context.room!);
		}
		if (!targetUser.autoconfirmed) {
			throw new Chat.ErrorMessage(`User '${targetUser.name}' needs to be autoconfirmed to give something away.`);
		}
		if (Giveaway.checkBanned(context.room!, targetUser)) {
			throw new Chat.ErrorMessage(`User '${targetUser.name}' is giveaway banned.`);
		}
		return {targetUser, ot, tid, game: game as Game, prize, question, answers};
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

	guessAnswer(user: User, guess: string) {
		if (this.phase !== 'started') return user.sendTo(this.room, "The giveaway has not started yet.");

		if (this.checkJoined(user) && !Object.values(this.joined).includes(user.id)) {
			return user.sendTo(this.room, "You have already joined the giveaway.");
		}
		if (Giveaway.checkBanned(this.room, user)) return user.sendTo(this.room, "You are banned from entering giveaways.");
		if (this.checkExcluded(user)) return user.sendTo(this.room, "You are disallowed from entering the giveaway.");

		if (!this.answered[user.id]) this.answered[user.id] = 0;
		if (this.answered[user.id] >= 3) {
			return user.sendTo(
				this.room,
				"You have already guessed three times. You cannot guess anymore in this.giveaway."
			);
		}

		const sanitized = toID(guess);

		for (const answer of this.answers.map(toID)) {
			if (answer === sanitized) {
				this.winner = user;
				this.clearTimer();
				return this.end(false);
			}
		}

		this.joined.set(user.latestIp, user.id);
		this.answered[user.id]++;
		if (this.answered[user.id] >= 3) {
			user.sendTo(
				this.room,
				`Your guess '${guess}' is wrong. You have used up all of your guesses. Better luck next time!`
			);
		} else {
			user.sendTo(this.room, `Your guess '${guess}' is wrong. Try again!`);
		}
	}

	change(value: string, user: User, answer = false) {
		if (user.id !== this.host.id) return user.sendTo(this.room, "Only the host can edit the giveaway.");
		if (this.phase !== 'pending') {
			return user.sendTo(this.room, "You cannot change the question or answer once the giveaway has started.");
		}
		if (!answer) {
			this.question = value;
			return user.sendTo(this.room, `The question has been changed to ${value}.`);
		}
		const ans = QuestionGiveaway.sanitizeAnswers(value.split(',').map(val => val.trim()));
		if (!ans.length) {
			return user.sendTo(this.room, "You must specify at least one answer and it must not contain any special characters.");
		}
		this.answers = ans;
		user.sendTo(this.room, `The answer${Chat.plural(ans, "s have", "has")} been changed to ${ans.join(', ')}.`);
	}

	end(force: boolean) {
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
				this.room.modlog({
					action: 'GIVEAWAY WIN',
					userid: this.winner.id,
					note: `${this.giver.name}'s giveaway for a "${this.prize}" (OT: ${this.ot} TID: ${this.tid})`,
				});
				this.send(this.generateWindow(
					`<p style="text-align:center;font-size:12pt;"><b>${Utils.escapeHTML(this.winner.name)}</b> won the giveaway! Congratulations!</p>` +
					`<p style="text-align:center;">${this.question}<br />Correct answer${Chat.plural(this.answers)}: ${this.answers.join(', ')}</p>`
				));
				this.winner.sendTo(
					this.room,
					`|raw|You have won the giveaway. PM <b>${Utils.escapeHTML(this.giver.name)}</b> to claim your prize!`
				);
				if (this.winner.connected) {
					this.winner.popup(`You have won the giveaway. PM **${this.giver.name}** to claim your prize!`);
				}
				if (this.giver.connected) this.giver.popup(`${this.winner.name} has won your question giveaway!`);
				Giveaway.updateStats(this.monIDs);
			}
		}

		this.destroy();
	}

	static sanitize(str: string) {
		return str.toLowerCase().replace(/[^a-z0-9 .-]+/ig, "").trim();
	}

	static sanitizeAnswers(answers: string[]) {
		return answers.map(
			val => QuestionGiveaway.sanitize(val)
		).filter(
			(val, index, array) => toID(val).length && array.indexOf(val) === index
		);
	}

	checkExcluded(user: User) {
		if (user === this.host) return true;
		if (this.host.ips.includes(user.latestIp) && !Config.noipchecks) return true;
		if (this.host.previousIDs.includes(toID(user))) return true;
		return super.checkExcluded(user);
	}
}

export class LotteryGiveaway extends Giveaway {
	type: string;
	winners: User[];
	maxWinners: number;

	constructor(
		host: User, giver: User, room: Room, ot: string, tid: string,
		game: Game, prize: PokemonSet, winners: number
	) {
		super(host, giver, room, ot, tid, prize, game);

		this.type = 'lottery';
		this.phase = 'pending';

		this.winners = [];

		this.maxWinners = winners || 1;

		this.send(this.generateReminder(false));

		this.timer = setTimeout(() => this.drawLottery(), 1000 * 60 * 2);
	}

	static splitTarget(target: string, sep = '|', context: Chat.CommandContext) {
		let [giver, ot, tid, game, prize, winners] = target.split(sep).map(param => param.trim());
		if (!(giver && ot && tid && prize)) {
			throw new Chat.ErrorMessage("Invalid arguments specified - /lottery giver | ot | tid | prize | winners");
		}
		if (!game) game = 'swsh';
		tid = toID(tid);
		if (isNaN(parseInt(tid)) || tid.length < 5 || tid.length > 6) throw new Chat.ErrorMessage("Invalid TID");
		const targetUser = Users.get(giver);
		if (!targetUser?.connected) throw new Chat.ErrorMessage(`User '${giver}' is not online.`);
		if (context.user !== targetUser && !context.user.can('show', null, context.room!)) {
			context.checkCan('warn', null, context.room!);
		}
		if (!targetUser.autoconfirmed) {
			throw new Chat.ErrorMessage(`User '${targetUser.name}' needs to be autoconfirmed to give something away.`);
		}
		if (Giveaway.checkBanned(context.room!, targetUser)) {
			throw new Chat.ErrorMessage(`User '${targetUser.name}' is giveaway banned.`);
		}

		let numWinners = 1;
		if (winners) {
			numWinners = parseInt(winners);
			if (isNaN(numWinners) || numWinners < 1 || numWinners > 5) {
				throw new Chat.ErrorMessage("The lottery giveaway can have a minimum of 1 and a maximum of 5 winners.");
			}
		}
		return {targetUser, ot, tid, game: game as Game, prize, winners: numWinners};
	}

	generateReminder(joined = false) {
		const cmd = (joined ? 'Leave' : 'Join');
		const button = `<button style="margin:4px;" name="send" value="/giveaway ${toID(cmd)}lottery"><font size=1><b>${cmd}</b></font></button>`;
		return this.generateWindow(`The lottery drawing will occur in 2 minutes, and with ${Chat.count(this.maxWinners, "winners")}!<br />${button}</p>`);
	}

	display() {
		const joined = this.generateReminder(true);
		const notJoined = this.generateReminder();

		for (const i in this.room.users) {
			const thisUser = this.room.users[i];
			if (this.checkJoined(thisUser)) {
				thisUser.sendTo(
					this.room,
					`|uhtmlchange|giveaway${this.gaNumber}${this.phase}|<div class="broadcast-blue">${joined}</div>`
				);
			} else {
				thisUser.sendTo(
					this.room,
					`|uhtmlchange|giveaway${this.gaNumber}${this.phase}|<div class="broadcast-blue">${notJoined}</div>`
				);
			}
		}
	}

	addUser(user: User) {
		if (this.phase !== 'pending') return user.sendTo(this.room, "The join phase of the lottery giveaway has ended.");

		if (!user.named) return user.sendTo(this.room, "You need to choose a name before joining a lottery giveaway.");
		if (this.checkJoined(user)) return user.sendTo(this.room, "You have already joined the giveaway.");
		if (Giveaway.checkBanned(this.room, user)) return user.sendTo(this.room, "You are banned from entering giveaways.");
		if (this.checkExcluded(user)) return user.sendTo(this.room, "You are disallowed from entering the giveaway.");

		this.joined.set(user.latestIp, user.id);
		user.sendTo(
			this.room,
			`|uhtmlchange|giveaway${this.gaNumber}${this.phase}|<div class="broadcast-blue">${this.generateReminder(true)}</div>`
		);
		user.sendTo(this.room, "You have successfully joined the lottery giveaway.");
	}

	removeUser(user: User) {
		if (this.phase !== 'pending') return user.sendTo(this.room, "The join phase of the lottery giveaway has ended.");
		if (!this.checkJoined(user)) return user.sendTo(this.room, "You have not joined the lottery giveaway.");
		for (const ip in this.joined) {
			if (ip === user.latestIp && !Config.noipchecks || this.joined.get(ip) === user.id) {
				this.joined.delete(ip);
			}
		}
		user.sendTo(
			this.room,
			`|uhtmlchange|giveaway${this.gaNumber}${this.phase}|<div class="broadcast-blue">${this.generateReminder(false)}</div>`
		);
		user.sendTo(this.room, "You have left the lottery giveaway.");
	}

	drawLottery() {
		this.clearTimer();

		const userlist = Object.values(this.joined);
		if (userlist.length === 0) {
			this.changeUhtml('<p style="text-align:center;font-size:13pt;font-weight:bold;">The giveaway was forcibly ended.</p>');
			this.destroy();
			return this.room.send("The giveaway has been forcibly ended as there are no participants.");
		}

		while (this.winners.length < this.maxWinners && userlist.length > 0) {
			const winner = Users.get(userlist.splice(Math.floor(Math.random() * userlist.length), 1)[0]);
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
			const winnerNames = this.winners.map(winner => winner.name).join(', ');
			this.room.modlog({
				action: 'GIVEAWAY WIN',
				note: `${winnerNames} won ${this.giver.name}'s giveaway for "${this.prize}" (OT: ${this.ot} TID: ${this.tid})`,
			});
			this.send(this.generateWindow(
				`<p style="text-align:center;font-size:10pt;font-weight:bold;">Lottery Draw</p>` +
				`<p style="text-align:center;">${Object.keys(this.joined).length} users joined the giveaway.<br />` +
				`Our lucky winner${Chat.plural(this.winners)}: <b>${Utils.escapeHTML(winnerNames)}!</b><br />Congratulations!</p>`
			));
			for (const winner of this.winners) {
				winner.sendTo(
					this.room,
					`|raw|You have won the lottery giveaway! PM <b>${this.giver.name}</b> to claim your prize!`
				);
				if (winner.connected) {
					winner.popup(`You have won the lottery giveaway! PM **${this.giver.name}** to claim your prize!`);
				}
			}
			if (this.giver.connected) this.giver.popup(`The following users have won your lottery giveaway:\n${winnerNames}`);
			Giveaway.updateStats(this.monIDs);
		}
		this.destroy();
	}
}

export class GTS extends Rooms.RoomGame {
	gtsNumber: number;
	room: Room;
	giver: User;
	left: number;
	summary: string;
	deposit: string;
	lookfor: string;
	monIDs: Set<string>;
	sprite: string;
	sent: string[];
	noDeposits: boolean;
	timer: NodeJS.Timer | null;

	constructor(
		room: Room, giver: User, amount: number,
		summary: string, deposit: string, lookfor: string
	) {
		// Always a sub-game so tours etc can be ran while GTS games are running
		super(room, true);
		this.gtsNumber = room.nextGameNumber();
		this.room = room;
		this.giver = giver;
		this.left = amount;
		this.summary = summary;
		this.deposit = GTS.linkify(Utils.escapeHTML(deposit));
		this.lookfor = lookfor;

		this.monIDs = new Set();
		this.sprite = '';
		[this.monIDs, this.sprite] = Giveaway.getSprite(this.summary);

		this.sent = [];
		this.noDeposits = false;

		this.timer = setInterval(() => this.send(this.generateWindow()), 1000 * 60 * 5);
		this.send(this.generateWindow());
	}

	send(content: string) {
		this.room.add(`|uhtml|gtsga${this.gtsNumber}|<div class="broadcast-blue">${content}</div>`);
		this.room.update();
	}

	changeUhtml(content: string) {
		this.room.uhtmlchange(`gtsga${this.gtsNumber}`, `<div class="broadcast-blue">${content}</div>`);
		this.room.update();
	}

	clearTimer() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}

	generateWindow() {
		const sentModifier = this.sent.length ? 5 : 0;
		const rightSide = this.noDeposits ?
			`<strong>More Pokémon have been deposited than there are prizes in this giveaway and new deposits will not be accepted.
			If you have already deposited a Pokémon, please be patient, and do not withdraw your Pokémon.</strong>
			` :
			`To participate, deposit <strong>${this.deposit}</strong> into the GTS and look for <strong>${Utils.escapeHTML(this.lookfor)}</strong>`;
		return `<p style="text-align:center;font-size:14pt;font-weight:bold;margin-bottom:2px;">There is a GTS giveaway going on!</p>` +
			`<p style="text-align:center;font-size:10pt;margin-top:0px;">Hosted by: ${Utils.escapeHTML(this.giver.name)} | Left: <b>${this.left}</b></p>` +
			`<table style="margin-left:auto;margin-right:auto;"><tr>` +
			(sentModifier ?
				`<td style="text-align:center;width:10%"><b>Last winners:</b><br/>${this.sent.join('<br/>')}</td>` :
				'') +
			`<td style="text-align:center;width:15%">${this.sprite}</td><td style="text-align:center;width:${40 - sentModifier}%">${Chat.formatText(this.summary, true)}</td>` +
			`<td style="text-align:center;width:${35 - sentModifier}%">${rightSide}</td></tr></table>`;
	}

	updateLeft(num: number) {
		this.left = num;
		if (this.left < 1) return this.end();

		this.changeUhtml(this.generateWindow());
	}

	updateSent(ign: string) {
		this.left--;
		if (this.left < 1) return this.end();

		this.sent.push(Utils.escapeHTML(ign));
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
			this.room.modlog({
				action: 'GTS FINISHED',
				userid: this.giver.id,
				note: `their GTS giveaway for "${this.summary}"`,
			});
			this.send(`<p style="text-align:center;font-size:11pt">The GTS giveaway for a "<strong>${Utils.escapeHTML(this.lookfor)}</strong>" has finished.</p>`);
			Giveaway.updateStats(this.monIDs);
		}
		this.room.subGame = null;
		return this.left;
	}

	// This currently doesn't match some of the edge cases the other pokemon matching function does account for
	// (such as Type: Null). However, this should never be used as a fodder mon anyway,
	// so I don't see a huge need to implement it.
	static linkify(text: string) {
		const parsed = toID(text);

		for (const species of Dex.species.all()) {
			const id = species.id;
			const regexp = new RegExp(`\\b${id}\\b`, 'ig');
			const res = regexp.exec(parsed);
			if (res) {
				const num = String(species.num).padStart(3, '0');
				return `${text.slice(0, res.index)}<a href="http://www.serebii.net/pokedex-sm/location/${num}.shtml">${text.slice(res.index, res.index + res[0].length)}</a>${text.slice(res.index + res[0].length)}`;
			}
		}
		return text;
	}
}

function hasSubmittedGiveaway(user: User) {
	for (const i in wifiData.submittedGiveaways) {
		for (const [index, giveaway] of wifiData.submittedGiveaways[i as 'question' | 'lottery'].entries()) {
			if (user.id === giveaway.targetUserid) {
				return {index, type: i as 'question' | 'lottery'};
			}
		}
	}
	return null;
}

export const handlers: Chat.Handlers = {
	onDisconnect(user) {
		const giveaway = hasSubmittedGiveaway(user);
		if (giveaway) {
			wifiData.submittedGiveaways[giveaway.type].splice(giveaway.index, 1);
			saveData();
		}
	},
};

const cmds: Chat.ChatCommands = {
	'': 'help',
	help(target, room, user) {
		room = this.requireRoom('wifi' as RoomID);

		let reply = '';
		switch (target) {
		case 'staff':
			this.checkCan('show', null, room);
			reply = '<strong>Staff commands:</strong><br />' +
					'- question or qg <em>User | OT | TID | Prize | Question | Answer[ | Answer2 | Answer3]</em> - Start a new question giveaway (voices can only host for themselves, staff can for all users) (Requires: + % @ # &)<br />' +
					'- lottery or lg <em>User | OT | TID | Prize[| Number of Winners]</em> - Starts a lottery giveaway (voices can only host for themselves, staff can for all users) (Requires: + % @ # &)<br />' +
					'- changequestion - Changes the question of a question giveaway (Requires: giveaway host)<br />' +
					'- changeanswer - Changes the answer of a question giveaway (Requires: giveaway host)<br />' +
					'- viewanswer - Shows the answer in a question giveaway (only to giveaway host/giver)<br />' +
					'- ban - Temporarily bans a user from entering giveaways (Requires: % @ # &)<br />' +
					'- end - Forcibly ends the current giveaway (Requires: % @ # &)<br />' +
					'- count <em>Mon</em> - Displays how often a certain mon has been given away. Use <code>!giveaway count</code> to broadcast this to the entire room<br />';
			break;
		case 'gts':
			this.checkCan('show', null, room);
			reply = '<strong>GTS giveaway commands:</strong><br />' +
					'- gts start <em>User | Amount | Summary of given mon | What to deposit | What to look for</em> - Starts a gts giveaway (Requires: % @ # &)<br />' +
					'- gts left <em>Amount</em> - Updates the amount left for the current GTS giveaway. Without an amount specified, shows how many Pokémon are left, and who the latest winners are.<br />' +
					'- gts sent <em>IGN</em> - Adds an ign to the list of latest winners, and updates left count accordingly.<br />' +
					'- gts full - Signifies enough mons have been received, and will update the GTS giveaway to reflect that.<br />' +
					'- gts end - Forcibly ends the current gts giveaway (Requires: % @ # &)<br />';
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
			'- help staff - shows giveaway staff commands (Requires: + % @ # &)<br />' +
			'- help gts - shows gts giveaway commands (Requires: + % @ # &)';
		}
		this.sendReplyBox(reply);
	},
};

export const commands: Chat.ChatCommands = {
	gts: {
		new: 'start',
		create: 'start',
		start(target, room, user) {
			room = this.room = Rooms.search('wifi') || null;
			if (!room) {
				throw new Chat.ErrorMessage(`This command must be used in ths Wi-Fi room.`);
			}
			if (room.getGame(GTS, true)) {
				throw new Chat.ErrorMessage(`There is already a GTS Giveaway going on.`);
			}

			const [giver, amountStr, summary, deposit, lookfor] = target.split(target.includes('|') ? '|' : ',').map(
				param => param.trim()
			);
			if (!(giver && amountStr && summary && deposit && lookfor)) {
				return this.errorReply("Invalid arguments specified - /gts start giver | amount | summary | deposit | lookfor");
			}
			const amount = parseInt(amountStr);
			if (!amount || amount < 20 || amount > 100) {
				return this.errorReply("Please enter a valid amount. For a GTS giveaway, you need to give away at least 20 mons, and no more than 100.");
			}
			const targetUser = Users.get(giver);
			if (!targetUser?.connected) return this.errorReply(`User '${giver}' is not online.`);
			this.checkCan('warn', null, room);
			if (!targetUser.autoconfirmed) {
				return this.errorReply(`User '${targetUser.name}' needs to be autoconfirmed to host a giveaway.`);
			}
			if (Giveaway.checkBanned(room, targetUser)) return this.errorReply(`User '${targetUser.name}' is giveaway banned.`);

			room.subGame = new GTS(room, targetUser, amount, summary, deposit, lookfor);

			this.privateModAction(`${user.name} started a GTS giveaway for ${targetUser.name} with ${amount} Pokémon`);
			this.modlog('GTS GIVEAWAY', null, `for ${targetUser.getLastId()} with ${amount} Pokémon`);
		},
		left(target, room, user) {
			room = this.requireRoom('wifi' as RoomID);
			const game = this.requireGame(GTS, true);
			if (!user.can('warn', null, room) && user !== game.giver) {
				throw new Chat.ErrorMessage("Only the host or a staff member can update GTS giveaways.");
			}
			if (!target) {
				if (!this.runBroadcast()) return;
				let output = `The GTS giveaway from ${game.giver} has ${game.left} Pokémon remaining!`;
				if (game.sent.length) output += `Last winners: ${game.sent.join(', ')}`;
				return this.sendReply(output);
			}
			const newamount = parseInt(target);
			if (isNaN(newamount)) return this.errorReply("Please enter a valid amount.");
			if (newamount > game.left) return this.errorReply("The new amount must be lower than the old amount.");
			if (newamount < game.left - 1) {
				this.modlog(`GTS GIVEAWAY`, null, `set from ${game.left} to ${newamount} left`);
			}

			game.updateLeft(newamount);
		},
		sent(target, room, user) {
			room = this.requireRoom('wifi' as RoomID);
			const game = this.requireGame(GTS, true);
			if (!user.can('warn', null, room) && user !== game.giver) {
				return this.errorReply("Only the host or a staff member can update GTS giveaways.");
			}

			if (!target || target.length > 12) return this.errorReply("Please enter a valid IGN.");

			game.updateSent(target);
		},
		full(target, room, user) {
			room = this.requireRoom('wifi' as RoomID);
			const game = this.requireGame(GTS, true);
			if (!user.can('warn', null, room) && user !== game.giver) {
				return this.errorReply("Only the host or a staff member can update GTS giveaways.");
			}
			if (game.noDeposits) return this.errorReply("The GTS giveaway was already set to not accept deposits.");

			game.stopDeposits();
		},
		end(target, room, user) {
			room = this.requireRoom('wifi' as RoomID);
			const game = this.requireGame(GTS, true);
			this.checkCan('warn', null, room);

			if (target && target.length > 300) {
				return this.errorReply("The reason is too long. It cannot exceed 300 characters.");
			}
			const amount = game.end(true);
			if (target) target = `: ${target}`;
			this.modlog('GTS END', null, `with ${amount} left${target}`);
			this.privateModAction(`The giveaway was forcibly ended by ${user.name} with ${amount} left${target}`);
		},
	},
	gtshelp: [],
	ga: 'giveaway',
	giveaway: {
		help() {
			this.run('giveawayhelp');
		},
		view: {
			''() {},
			stored(target, room, user) {
				this.room = room = Rooms.search('wifi') || null;
				if (!room) throw new Chat.ErrorMessage(`The Wi-Fi room doesn't exist on this server.`);
				this.checkCan('warn', null, room);
				this.parse(`/j view-giveaways-stored`);
			},
			submitted(target, room, user) {
				this.room = room = Rooms.search('wifi') || null;
				if (!room) throw new Chat.ErrorMessage(`The Wi-Fi room doesn't exist on this server.`);
				this.checkCan('warn', null, room);
				this.parse(`/j view-giveaways-submitted`);
			},
		},
		rm: 'remind',
		remind(target, room, user) {
			room = this.requireRoom('wifi' as RoomID);
			if (!this.runBroadcast()) return;
			let game: QuestionGiveaway | LotteryGiveaway | null = null;
			if (room.getGame(QuestionGiveaway)) {
				game = room.getGame(QuestionGiveaway)!;
				if (game.phase !== 'started') {
					throw new Chat.ErrorMessage(`The giveaway has not started yet.`);
				}
				game.send(game.generateQuestion());
			} else if (room.getGame(LotteryGiveaway)) {
				room.getGame(LotteryGiveaway)!.display();
			} else {
				throw new Chat.ErrorMessage(`There is no giveaway going on right now.`);
			}
		},
		leavelotto: 'join',
		leavelottery: 'join',
		leave: 'join',
		joinlotto: 'join',
		joinlottery: 'join',
		join(target, room, user, conn, cmd) {
			room = this.requireRoom('wifi' as RoomID);
			this.checkChat();
			if (user.semilocked) return;
			const giveaway = this.requireGame(LotteryGiveaway);
			if (cmd.includes('join')) {
				giveaway.addUser(user);
			} else {
				giveaway.removeUser(user);
			}
		},
		ban(target, room, user) {
			if (!target) return false;
			room = this.requireRoom('wifi' as RoomID);
			this.checkCan('warn', null, room);

			const {targetUser, rest: reason} = this.requireUser(target, {allowOffline: true});
			if (reason.length > 300) {
				return this.errorReply("The reason is too long. It cannot exceed 300 characters.");
			}
			if (Punishments.hasRoomPunishType(room, targetUser.name, 'GIVEAWAYBAN')) {
				return this.errorReply(`User '${targetUser.name}' is already giveawaybanned.`);
			}

			Giveaway.ban(room, targetUser, reason);
			if (room.getGame(Giveaway)) room.getGame(Giveaway)!.kickUser(targetUser);
			this.modlog('GIVEAWAYBAN', targetUser, reason);
			const reasonMessage = reason ? ` (${reason})` : ``;
			this.privateModAction(`${targetUser.name} was banned from entering giveaways by ${user.name}.${reasonMessage}`);
		},
		unban(target, room, user) {
			if (!target) return false;
			room = this.requireRoom('wifi' as RoomID);
			this.checkCan('warn', null, room);
	
			const {targetUser} = this.requireUser(target, {allowOffline: true});
			if (!Giveaway.checkBanned(room, targetUser)) {
				return this.errorReply(`User '${targetUser.name}' isn't banned from entering giveaways.`);
			}
	
			Giveaway.unban(room, targetUser);
			this.privateModAction(`${targetUser.name} was unbanned from entering giveaways by ${user.name}.`);
			this.modlog('GIVEAWAYUNBAN', targetUser, null, {noip: 1, noalts: 1});
		},
		new: 'create',
		start: 'create',
		create: {
			''(target, room, user) {
				room = this.requireRoom('wifi' as RoomID);
				this.checkCan('warn', null, room);
				this.parse('/j view-giveaway-create');
			},
			question(target, room, user) {
				room = this.room = Rooms.search('wifi') || null;
				if (!room) {
					throw new Chat.ErrorMessage(`This command must be used in ths Wi-Fi room.`);
				}
				if (room.subGame) throw new Chat.ErrorMessage(`There is already a room game (${room.subGame.constructor.name}) going on.`);
				const {targetUser, ot, tid, game, prize, question, answers} = QuestionGiveaway.splitTarget(target, '|', this);
				const set = Teams.import(prize)?.[0];
				if (!set) throw new Chat.ErrorMessage(`Please submit the prize in the form of a PS set importable.`);

				room.subGame = new QuestionGiveaway(user, targetUser, room, ot, tid, game, set, question, answers);

				this.privateModAction(`${user.name} started a question giveaway for ${targetUser.name}.`);
				this.modlog('QUESTION GIVEAWAY', null, `for ${targetUser.getLastId()}`);
			},
			lottery(target, room, user) {
				room = this.room = Rooms.search('wifi') || null;
				if (!room) {
					throw new Chat.ErrorMessage(`This command must be used in ths Wi-Fi room.`);
				}
				if (room.game) throw new Chat.ErrorMessage(`There is already a room game (${room.game.constructor.name}) going on.`);
				const {targetUser, ot, tid, game, prize, winners} = LotteryGiveaway.splitTarget(target, '|', this);
				const set = Teams.import(prize)?.[0];
				if (!set) throw new Chat.ErrorMessage(`Please submit the prize in the form of a PS set importable.`);

				room.game = new LotteryGiveaway(user, targetUser, room, ot, tid, game, set, winners);

				this.privateModAction(`${user.name} started a lottery giveaway for ${targetUser.name}.`);
				this.modlog('LOTTERY GIVEAWAY', null, `for ${targetUser.getLastId()}`);
			},
		},
		stop: 'end',
		end(target, room, user) {
			room = this.requireRoom('wifi' as RoomID);
			if (!room.game?.title.includes('Giveaway')) {
				throw new Chat.ErrorMessage(`There is no giveaway going on at the moment.`);
			}
			const game = room.game as LotteryGiveaway | QuestionGiveaway;
			if (user.id !== game.host.id) this.checkCan('warn', null, room);
	
			if (target && target.length > 300) {
				return this.errorReply("The reason is too long. It cannot exceed 300 characters.");
			}
			game.end(true);
			this.modlog('GIVEAWAY END', null, target);
			if (target) target = `: ${target}`;
			this.privateModAction(`The giveaway was forcibly ended by ${user.name}${target}`);
		},
		guess(target, room, user) {
			room = this.requireRoom('wifi' as RoomID);
			this.checkChat();
			const giveaway = this.requireGame(QuestionGiveaway);
			giveaway.guessAnswer(user, target);
		},
		changeanswer: 'changequestion',
		changequestion(target, room, user, connection, cmd) {
			room = this.requireRoom('wifi' as RoomID);
			const giveaway = this.requireGame(QuestionGiveaway);
			target = target.trim();
			if (!target) throw new Chat.ErrorMessage("You must include a question or an answer.");
			giveaway.change(target, user, cmd.includes('answer'));
		},
		showanswer: 'viewanswer',
		viewanswer(target, room, user) {
			room = this.requireRoom('wifi' as RoomID);
			const giveaway = this.requireGame(QuestionGiveaway);
			if (user.id !== giveaway.host.id && user.id !== giveaway.giver.id) return;
	
			this.sendReply(`The giveaway question is ${giveaway.question}.\nThe answer${Chat.plural(giveaway.answers, 's are', ' is')} ${giveaway.answers.join(', ')}.`);
		},
		save: 'store',
		store: {
			question(target, room, user) {
				room = this.room = Rooms.search('wifi') || null;
				if (!room) {
					throw new Chat.ErrorMessage(`This command must be used in ths Wi-Fi room.`);
				}
				const {targetUser, ot, tid, game, prize, question, answers} = QuestionGiveaway.splitTarget(target, '|', this);
				const set = Teams.import(prize)?.[0];
				if (!set) throw new Chat.ErrorMessage(`Please submit the prize in the form of a PS set importable.`);

				if (!wifiData.storedGiveaways.question) wifiData.storedGiveaways.question = [];
				const data = {targetUserid: targetUser.id, ot, tid, game, prize: set, question, answers};
				wifiData.storedGiveaways.question.push(data);
				saveData();

				this.privateModAction(`${user.name} saved a question giveaway for ${targetUser.name}.`);
				this.modlog('QUESTION GIVEAWAY SAVE');
			},
			lottery(target, room, user) {
				room = this.room = Rooms.search('wifi') || null;
				if (!room) {
					throw new Chat.ErrorMessage(`This command must be used in ths Wi-Fi room.`);
				}
				const {targetUser, ot, tid, game, prize, winners} = LotteryGiveaway.splitTarget(target, '|', this);
				const set = Teams.import(prize)?.[0];
				if (!set) throw new Chat.ErrorMessage(`Please submit the prize in the form of a PS set importable.`);

				if (!wifiData.storedGiveaways.lottery) wifiData.storedGiveaways.lottery = [];
				const data = {targetUserid: targetUser.id, ot, tid, game, prize: set, winners};
				wifiData.storedGiveaways.lottery.push(data);
				saveData();

				this.privateModAction(`${user.name} saved a question giveaway for ${targetUser.name}.`);
				this.modlog('LOTTERY GIVEAWAY SAVE');
			},
		},
		submit: {
			question(target, room, user) {
				room = this.room = Rooms.search('wifi') || null;
				if (!room) {
					throw new Chat.ErrorMessage(`This command must be used in ths Wi-Fi room.`);
				}
				const {targetUser, ot, tid, game, prize, question, answers} = QuestionGiveaway.splitTarget(target, '|', this);
				const set = Teams.import(prize)?.[0];
				if (!set) throw new Chat.ErrorMessage(`Please submit the prize in the form of a PS set importable.`);

				if (!wifiData.submittedGiveaways.question) wifiData.submittedGiveaways.question = [];
				const data = {targetUserid: targetUser.id, ot, tid, game, prize: set, question, answers};
				wifiData.submittedGiveaways.question.push(data);
				saveData();

				this.privateModAction(`${user.name} saved a question giveaway for ${targetUser.name}.`);
				this.modlog('QUESTION GIVEAWAY SAVE');
			},
			lottery(target, room, user) {
				room = this.room = Rooms.search('wifi') || null;
				if (!room) {
					throw new Chat.ErrorMessage(`This command must be used in ths Wi-Fi room.`);
				}
				const {targetUser, ot, tid, game, prize, winners} = LotteryGiveaway.splitTarget(target, '|', this);
				const set = Teams.import(prize)?.[0];
				if (!set) throw new Chat.ErrorMessage(`Please submit the prize in the form of a PS set importable.`);

				if (!wifiData.submittedGiveaways.lottery) wifiData.submittedGiveaways.lottery = [];
				const data = {targetUserid: targetUser.id, ot, tid, game, prize: set, winners};
				wifiData.submittedGiveaways.lottery.push(data);
				saveData();

				this.sendReply(`You have submitted a lottery giveaway for ${set.species}. If you log out or go offline, the giveaway won't go through.`);
				const message = `|tempnotify|pendingapprovals|Pending lottery giveaway request!` +
					`|${user.name} has requested to start a lottery giveaway for ${set.species}.|new lottery giveaway request`;
				room.sendRankedUsers(message, '%');
				room.sendMods(
					Utils.html`|uhtml|giveaway-request-${user.id}|<div class="infobox">${user.name} wants to start a lottery giveaway for ${set.species}<br>` +
					`<button class="button" name="send" value="/j view-giveaways-submitted">View pending giveaways</button></div>`
				);
			},
		},
		approve(target, room, user) {
			room = this.room = Rooms.search('wifi') || null;
			if (!room) {
				throw new Chat.ErrorMessage(`This command must be used in ths Wi-Fi room.`);
			}
			const targetUser = Users.get(target);
			if (!targetUser?.connected) {
				this.refreshPage('giveaway-submitted');
				throw new Chat.ErrorMessage(`${targetUser?.name || toID(target)} is offline, so their giveaway can't be run.`);
			}
			const hasGiveaway = hasSubmittedGiveaway(targetUser);
			if (!hasGiveaway) {
				this.refreshPage('giveaway-submitted');
				throw new Chat.ErrorMessage(`${targetUser?.name || toID(target)} is offline, so their giveaway can't be run.`);
			}
			const giveaway = wifiData.submittedGiveaways[hasGiveaway.type][hasGiveaway.index];
			if (hasGiveaway.type === 'question') {
				const data = giveaway as QuestionGiveawayData;
				this.parse(`/giveaway create question ${data.targetUserid}|${data.ot}|${data.tid}|${data.game}|${Teams.exportSet(data.prize)}|${data.question}|${data.answers.join(',')}|true`);
			} else {
				const data = giveaway as LotteryGiveawayData;
				this.parse(`/giveaway create lottery ${data.targetUserid}|${data.ot}|${data.tid}|${data.game}|${Teams.exportSet(data.prize)}|${data.winners}|true`);
			}
			targetUser.send(`${user.name} has approved your ${hasGiveaway.type} giveaway!`);
			this.privateModAction(`${user.name} approved a ${hasGiveaway.type} giveaway by ${targetUser.name}.`);
			this.modlog(`GIVEAWAY APPROVE ${hasGiveaway.type.toUpperCase()}`, targetUser, null, {noalts: true, noip: true});
		},
		count(target, room, user) {
			room = this.requireRoom('wifi' as RoomID);
			target = [...Giveaway.getSprite(target)[0]][0];
			if (!target) throw new Chat.ErrorMessage(`No Pok\u00e9mon entered. Proper syntax: /giveaway count pokemon`);
			if (!this.runBroadcast()) return;
	
			const count = wifiData.stats[target];
	
			if (!count) return this.sendReplyBox("This Pokémon has never been given away.");
			const recent = count.filter(val => val + RECENT_THRESHOLD > Date.now()).length;
	
			this.sendReplyBox(`This Pokémon has been given away ${Chat.count(count, "times")}, a total of ${Chat.count(recent, "times")} in the past month.`);
		},
	},
	giveawayhelp: [],
};

function makePageHeader() {
	return ``;
}

export const pages: Chat.PageTable = {
	giveaway: {
		create(args, user) {
			if (!Rooms.get('wifi')) return `<h2>There is no Wi-Fi room on this server.</h2>`;
			this.checkCan('warn', null, Rooms.get('wifi')!);
			const [type] = args;
			if (!type || !['lottery', 'question'].includes(type)) {

			}
		},
	},
};

Chat.multiLinePattern.register(`/giveaway (create|new|start) (question|lottery) `);
