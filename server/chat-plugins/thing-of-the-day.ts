import { FS, Utils } from '../../lib';
import { YouTube } from './youtube';

const MINUTE = 60 * 1000;
const PRENOM_BUMP_TIME = 2 * 60 * MINUTE;

const PRENOMS_FILE = 'config/chat-plugins/otd-prenoms.json';
const DATA_FILE = 'config/chat-plugins/otds.json';

export const prenoms: { [k: string]: [string, AnyObject][] } = JSON.parse(FS(PRENOMS_FILE).readIfExistsSync() || "{}");
export const otdData: OtdData = JSON.parse(FS(DATA_FILE).readIfExistsSync() || "{}");
export const otds = new Map<string, OtdHandler>();

const FINISH_HANDLERS: { [k: string]: (winner: AnyObject) => Promise<void> } = {
	cotw: async winner => {
		const { channel, nominator } = winner;
		const searchResults = await YouTube.searchChannel(channel, 1);
		const result = searchResults?.[0];
		if (result) {
			if (YouTube.data.channels[result]) return;
			void YouTube.getChannelData(`https://www.youtube.com/channel/${result}`);
			const yt = Rooms.get('youtube');
			if (!yt) return;
			yt.sendMods(
				`|c|~|/log The channel with ID ${result} was added to the YouTube channel database.`
			);
			yt.modlog({
				action: `ADDCHANNEL`,
				note: `${result} (${toID(nominator)})`,
				loggedBy: toID(`COTW`),
			});
		}
	},
};

interface OtdSettings {
	id?: string;
	updateOnNom?: boolean;
	keys: string[];
	title: string;
	keyLabels: string[];
	timeLabel: string;
	roomid: RoomID;
}

interface OtdData {
	[k: string]: { settings: OtdSettings, winners: AnyObject[] };
}

function savePrenoms() {
	return FS(PRENOMS_FILE).writeUpdate(() => JSON.stringify(prenoms));
}

function toNominationId(nomination: string) {
	return nomination.toLowerCase().replace(/\s/g, '').replace(/\b&\b/g, '');
}

class OtdHandler {
	id: string;
	name: string;
	room: Room;
	nominations: Map<string, AnyObject>;
	removedNominations: Map<string, AnyObject>;
	voting: boolean;
	timer: NodeJS.Timeout | null;
	keys: string[];
	keyLabels: string[];
	timeLabel: string;
	settings: OtdSettings;
	lastPrenom: number;
	winners: AnyObject[];
	constructor(
		id: string, room: Room, settings: OtdSettings
	) {
		this.id = id;
		this.name = settings.title;
		this.room = room;

		this.nominations = new Map(prenoms[id]);
		this.removedNominations = new Map();

		this.voting = false;
		this.timer = null;

		this.keys = settings.keys;
		this.keyLabels = settings.keyLabels;
		this.timeLabel = settings.timeLabel;
		this.settings = settings;

		this.lastPrenom = 0;

		this.winners = otdData[this.id]?.winners || [];
	}

	static create(room: Room, settings: OtdSettings) {
		const { title, timeLabel } = settings;
		const id = settings.id || toID(title).charAt(0) + 'ot' + timeLabel.charAt(0);
		const handler = new OtdHandler(id, room, settings);
		otds.set(id, handler);
		let needsSave = false;
		for (const winner of handler.winners) {
			if (winner.timestamp) {
				winner.time = winner.timestamp;
				delete winner.timestamp;
				needsSave = true;
			}
		}
		if (needsSave) handler.save();
		return handler;
	}

	static parseOldWinners(content: string, keyLabels: string[], keys: string[]) {
		const data = `${content}`.split("\n");
		const winners = [];
		for (const arg of data) {
			if (!arg || arg === '\r') continue;
			if (arg.startsWith(`${keyLabels[0]}\t`)) {
				continue;
			}
			const entry: AnyObject = {};
			const vals = arg.trim().split("\t");
			for (let i = 0; i < vals.length; i++) {
				entry[keys[i]] = vals[i];
			}
			entry.time = Number(entry.time) || 0;
			winners.push(entry);
		}
		return winners;
	}

	/**
	 * Handles old-format data from the IP and userid refactor
	 */
	convertNominations() {
		for (const value of this.nominations.values()) {
			if (!Array.isArray(value.userids)) value.userids = Object.keys(value.userids);
			if (!Array.isArray(value.ips)) value.ips = Object.keys(value.ips);
		}
		for (const value of this.removedNominations.values()) {
			if (!Array.isArray(value.userids)) value.userids = Object.keys(value.userids);
			if (!Array.isArray(value.ips)) value.ips = Object.keys(value.ips);
		}
	}

	startVote() {
		this.voting = true;
		this.timer = setTimeout(() => this.rollWinner(), 20 * MINUTE);
		this.display();
	}

	finish() {
		this.voting = false;
		this.nominations = new Map();
		this.removedNominations = new Map();
		delete prenoms[this.id];
		void savePrenoms();
		if (this.timer) clearTimeout(this.timer);
	}

	addNomination(user: User, nomination: string) {
		const id = toNominationId(nomination);

		if (this.winners.slice(-30)
			.some(entry => toNominationId(entry[this.keys[0]]) === id)
		) {
			return user.sendTo(this.room, `This ${this.name.toLowerCase()} has already been ${this.id} in the past month.`);
		}
		for (const value of this.removedNominations.values()) {
			if (value.userids.includes(toID(user)) || (!Config.noipchecks && value.ips.includes(user.latestIp))) {
				return user.sendTo(
					this.room,
					`Since your nomination has been removed by staff, you cannot submit another ${this.name.toLowerCase()} until the next round.`
				);
			}
		}

		const prevNom = this.nominations.get(id);
		if (prevNom) {
			if (!(prevNom.userids.includes(toID(user)) || (!Config.noipchecks && prevNom.ips.includes(user.latestIp)))) {
				return user.sendTo(this.room, `This ${this.name.toLowerCase()} has already been nominated.`);
			}
		}

		for (const [key, value] of this.nominations) {
			if (value.userids.includes(toID(user)) || (!Config.noipchecks && value.ips.includes(user.latestIp))) {
				user.sendTo(this.room, `Your previous vote for ${value.nomination} will be removed.`);
				this.nominations.delete(key);
				if (prenoms[this.id]) {
					const idx = prenoms[this.id].findIndex(val => val[0] === key);
					if (idx > -1) {
						prenoms[this.id].splice(idx, 1);
						void savePrenoms();
					}
				}
			}
		}

		const obj: { [k: string]: string } = {};
		obj[user.id] = user.name;

		const nomObj = {
			nomination,
			name: user.name,
			userids: user.previousIDs.concat(user.id),
			ips: user.ips.slice(),
		};

		this.nominations.set(id, nomObj);

		if (!prenoms[this.id]) prenoms[this.id] = [];
		prenoms[this.id].push([id, nomObj]);
		void savePrenoms();

		user.sendTo(this.room, `Your nomination for ${nomination} was successfully submitted.`);

		let updateOnly = !this.voting;
		if (updateOnly) {
			const now = Date.now();
			if (now - this.lastPrenom > PRENOM_BUMP_TIME) {
				updateOnly = false;
				this.lastPrenom = now;
			}
		}

		if (this.settings.updateOnNom) {
			this.display(updateOnly);
		}
	}

	generateNomWindow() {
		let buffer = '';

		if (this.voting) {
			buffer += `<div class="broadcast-blue"><p style="font-weight:bold;text-align:center;font-size:12pt;">Nominations for ${this.name} of the ${this.timeLabel} are in progress! Use <code>/${this.id} nom</code> to nominate a${['A', 'E', 'I', 'O', 'U'].includes(this.name[0]) ? 'n' : ''} ${this.name.toLowerCase()}!</p>`;
			if (this.nominations.size) buffer += `<span style="font-weight:bold;">Nominations:</span>`;
		} else {
			buffer += `<div class="broadcast-blue"><p style="font-weight:bold;text-align:center;font-size:10pt;">Pre-noms for ${this.name} of the ${this.timeLabel}. Use <code>/${this.id} nom</code> to nominate a${['A', 'E', 'I', 'O', 'U'].includes(this.name[0]) ? 'n' : ''} ${this.name.toLowerCase()}:</p>`;
		}

		if (this.winners.length) {
			const winner = this.winners[this.winners.length - 1];

			buffer += `<p>Current winner: <b>${winner[this.keys[0]]}</b> (nominated by ${winner.nominator})</p>`;
		}

		const entries = [];

		for (const value of this.nominations.values()) {
			entries.push(Utils.html`<li><b>${value.nomination}</b> <i>(Submitted by ${value.name})</i></li>`);
		}

		if (entries.length > 20) {
			buffer += `<table><tr><td><ul>${entries.slice(0, Math.ceil(entries.length / 2)).join('')}</ul></td><td><ul>${entries.slice(Math.ceil(entries.length / 2)).join('')}</ul></td></tr></table>`;
		} else {
			buffer += `<ul>${entries.join('')}</ul>`;
		}

		buffer += `</div>`;

		return buffer;
	}

	display(update = false) {
		if (update) {
			this.room.uhtmlchange('otd', this.generateNomWindow());
		} else {
			this.room.add(`|uhtml|otd|${this.generateNomWindow()}`);
		}
	}

	displayTo(connection: Connection) {
		connection.sendTo(this.room, `|uhtml|otd|${this.generateNomWindow()}`);
	}

	rollWinner() {
		const keys = [...this.nominations.keys()];
		if (!keys.length) return false;

		const winner = this.nominations.get(keys[Math.floor(Math.random() * keys.length)]);
		if (!winner) return false; // Should never happen but shuts typescript up.
		const winnerEntry = this.appendWinner(winner.nomination, winner.name);

		const names = [...this.nominations.values()].map(obj => obj.name);

		const columns = names.length > 27 ? 4 : names.length > 18 ? 3 : names.length > 9 ? 2 : 1;
		let content = '';
		for (let i = 0; i < columns; i++) {
			content += `<td>${names.slice(Math.ceil((i / columns) * names.length), Math.ceil(((i + 1) / columns) * names.length)).join('<br />')}</td>`;
		}
		const namesHTML = `<table><tr>${content}</tr></table></p></div>`;

		const finishHandler = FINISH_HANDLERS[this.id];
		if (finishHandler) {
			void finishHandler(winnerEntry);
		}
		this.room.add(
			Utils.html`|uhtml|otd|<div class="broadcast-blue"><p style="font-weight:bold;text-align:center;font-size:12pt;">` +
			`Nominations for ${this.name} of the ${this.timeLabel} are over!</p><p style="tex-align:center;font-size:10pt;">` +
			`Out of ${keys.length} nominations, we randomly selected <strong>${winner.nomination}</strong> as the winner! ` +
			`(Nomination by ${winner.name})</p><p style="font-weight:bold;">Thanks to today's participants:` + namesHTML
		);
		this.room.update();

		this.finish();
		return true;
	}

	removeNomination(name: string) {
		name = toID(name);

		let success = false;
		for (const [key, value] of this.nominations) {
			if (value.userids.includes(name)) {
				this.removedNominations.set(key, value);
				this.nominations.delete(key);
				if (prenoms[this.id]) {
					const idx = prenoms[this.id].findIndex(val => val[0] === key);
					if (idx > -1) {
						prenoms[this.id].splice(idx, 1);
						void savePrenoms();
					}
				}
				success = true;
			}
		}

		if (this.voting) this.display();
		return success;
	}

	forceWinner(winner: string, user: string) {
		this.appendWinner(winner, user);
		this.finish();
	}

	appendWinner(nomination: string, user: string): AnyObject {
		const entry: AnyObject = { time: Date.now(), nominator: user };
		entry[this.keys[0]] = nomination;
		this.winners.push(entry);
		this.save();
		return entry;
	}

	removeWinner(nominationName: string) {
		for (const [i, entry] of this.winners.entries()) {
			if (toID(entry[this.keys[0]]) === toID(nominationName)) {
				const removed = this.winners.splice(i, 1);
				this.save();
				return removed[0];
			}
		}
		throw new Chat.ErrorMessage(`The winner with nomination ${nominationName} could not be found.`);
	}

	setWinnerProperty(properties: { [k: string]: string }) {
		if (!this.winners.length) return;
		for (const i in properties) {
			this.winners[this.winners.length - 1][i] = properties[i];
		}
		return this.save();
	}

	save(destroy = false) {
		if (!destroy) {
			otdData[this.id] = {
				settings: this.settings,
				winners: this.winners,
			};
		}
		FS(DATA_FILE).writeUpdate(() => JSON.stringify(otdData));
	}

	destroy() {
		this.room = null!;
		delete otdData[this.id];
		otds.delete(this.id);
		delete Chat.commands[this.id];
		delete Chat.pages[this.id];
		this.save(true);
	}

	async generateWinnerDisplay() {
		if (!this.winners.length) return false;
		const winner = this.winners[this.winners.length - 1];

		let output = `<div class="broadcast-blue" style="text-align:center;">` +
			Utils.html`<p><span style="font-weight:bold;font-size:11pt">The ${this.name} of the ${this.timeLabel} is ` +
			Utils.html`${winner[this.keys[0]]}${winner.author ? ` by ${winner.author}` : ''}.</span>`;

		if (winner.quote) output += Utils.html`<br /><span style="font-style:italic;">"${winner.quote}"</span>`;
		if (winner.tagline) output += Utils.html`<br />${winner.tagline}`;
		output += `</p><table style="margin:auto;"><tr>`;
		if (winner.image) {
			try {
				const [width, height] = await Chat.fitImage(winner.image, 100, 100);
				output += Utils.html`<td><img src="${winner.image}" width=${width} height=${height}></td>`;
			} catch {}
		}
		output += `<td style="text-align:right;margin:5px;">`;
		if (winner.event) output += Utils.html`<b>Event:</b> ${winner.event}<br />`;
		if (winner.song) {
			output += `<b>Song:</b> `;
			if (winner.link) {
				output += Utils.html`<a href="${winner.link}">${winner.song}</a>`;
			} else {
				output += Utils.escapeHTML(winner.song);
			}
			output += `<br />`;
		} else if (winner.link) {
			output += Utils.html`<b>Link:</b> <a href="${winner.link}">${winner.link}</a><br />`;
		}

		// Batch these together on 2 lines. Order intentional.
		const athleteDetails = [];
		if (winner.sport) athleteDetails.push(Utils.html`<b>Sport:</b> ${winner.sport}`);
		if (winner.team) athleteDetails.push(Utils.html`<b>Team:</b> ${winner.team}`);
		if (winner.age) athleteDetails.push(Utils.html`<b>Age:</b> ${winner.age}`);
		if (winner.country) athleteDetails.push(Utils.html`<b>Nationality:</b> ${winner.country}`);

		if (athleteDetails.length) {
			output += athleteDetails.slice(0, 2).join(' | ') + '<br />';
			if (athleteDetails.length > 2) output += athleteDetails.slice(2).join(' | ') + '<br />';
		}

		output += Utils.html`Nominated by ${winner.nominator}.`;
		output += `</td></tr></table></div>`;

		return output;
	}

	generateWinnerList(context: Chat.PageContext) {
		context.title = `${this.id.toUpperCase()} Winners`;
		let buf = `<div class="pad ladder"><h2>${this.name} of the ${this.timeLabel} Winners</h2>`;

		// Only use specific fields for displaying in winners list.
		const columns: string[] = [];
		const labels = [];

		for (let i = 0; i < this.keys.length; i++) {
			if (i === 0 || ['song', 'event', 'link', 'tagline', 'sport', 'country']
				.includes(this.keys[i]) && !(this.keys[i] === 'link' && this.keys.includes('song'))
			) {
				columns.push(this.keys[i]);
				labels.push(this.keyLabels[i]);
			}
		}
		if (!columns.includes('time')) {
			columns.push('time');
			labels.push('Timestamp');
		}

		let content = ``;

		content += `<tr>${labels.map(label => `<th><h3>${label}</h3></th>`).join('')}</tr>`;
		for (let i = this.winners.length - 1; i >= 0; i--) {
			const entry = columns.map(col => {
				let val = this.winners[i][col];
				if (!val) return '';
				switch (col) {
				case 'time':
					const date = new Date(parseInt(this.winners[i].time));

					const pad = (num: number) => `${num}`.padStart(2, '0');

					return Utils.html`${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${date.getFullYear()}`;
				case 'song':
					if (!this.winners[i].link) return val;
					// falls through
				case 'link':
					return `<a href="${this.winners[i].link}">${val}</a>`;
				case 'book':
					val = `${val}${this.winners[i].author ? ` by ${this.winners[i].author}` : ''}`;
					// falls through
				case columns[0]:
					return `${Utils.escapeHTML(val)}${this.winners[i].nominator ? Utils.html`<br /><span style="font-style:italic;font-size:8pt;">nominated by ${this.winners[i].nominator}</span>` : ''}`;
				default:
					return Utils.escapeHTML(val);
				}
			});
			content += `<tr>${entry.map(val => `<td style="max-width:${600 / columns.length}px;word-wrap:break-word;">${val}</td>`).join('')}</tr>`;
		}
		if (!content) {
			buf += `<p>There have been no ${this.id} winners.</p>`;
		} else {
			buf += `<table>${content}</table>`;
		}
		buf += `</div>`;
		return buf;
	}
}

function selectHandler(message: string) {
	const id = toID(message.substring(1).split(' ')[0]);
	const handler = otds.get(id);
	if (!handler) throw new Error("Invalid type for otd handler.");
	return handler;
}

export const otdCommands: Chat.ChatCommands = {
	start(target, room, user, connection, cmd) {
		this.checkChat();

		const handler = selectHandler(this.message);

		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);
		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);
		this.checkCan('mute', null, room);

		if (handler.voting) {
			return this.errorReply(
				`The nomination for the ${handler.name} of the ${handler.timeLabel} nomination is already in progress.`
			);
		}
		handler.startVote();

		this.privateModAction(`${user.name} has started nominations for the ${handler.name} of the ${handler.timeLabel}.`);
		this.modlog(`${handler.id.toUpperCase()} START`, null);
	},
	starthelp: [`/-otd start - Starts nominations for the Thing of the Day. Requires: % @ # ~`],

	end(target, room, user) {
		this.checkChat();

		const handler = selectHandler(this.message);

		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);
		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);
		this.checkCan('mute', null, room);

		if (!handler.voting) {
			return this.errorReply(`There is no ${handler.name} of the ${handler.timeLabel} nomination in progress.`);
		}
		if (!handler.nominations.size) {
			return this.errorReply(`Can't select the ${handler.name} of the ${handler.timeLabel} without nominations.`);
		}
		handler.rollWinner();

		this.privateModAction(`${user.name} has ended nominations for the ${handler.name} of the ${handler.timeLabel}.`);
		this.modlog(`${handler.id.toUpperCase()} END`, null);
	},
	endhelp: [
		`/-otd end - End nominations for the Thing of the Day and set it to a randomly selected nomination. Requires: % @ # ~`,
	],

	nom(target, room, user) {
		this.checkChat(target);
		if (!target) return this.parse('/help otd');

		const handler = selectHandler(this.message);

		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);
		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);

		if (!toNominationId(target).length || target.length > 75) {
			return this.sendReply(`'${target}' is not a valid ${handler.name.toLowerCase()} name.`);
		}
		handler.addNomination(user, target);
	},
	nomhelp: [`/-otd nom [nomination] - Nominate something for Thing of the Day.`],

	view(target, room, user, connection) {
		this.checkChat();
		if (!this.runBroadcast()) return false;

		const handler = selectHandler(this.message);

		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);
		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);

		if (this.broadcasting) {
			selectHandler(this.message).display();
		} else {
			selectHandler(this.message).displayTo(connection);
		}
	},
	viewhelp: [`/-otd view - View the current nominations for the Thing of the Day.`],

	remove(target, room, user) {
		this.checkChat();

		const handler = selectHandler(this.message);

		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);
		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);
		this.checkCan('mute', null, room);

		const userid = toID(target);
		if (!userid) return this.errorReply(`'${target}' is not a valid username.`);

		if (handler.removeNomination(userid)) {
			this.privateModAction(`${user.name} removed ${target}'s nomination for the ${handler.name} of the ${handler.timeLabel}.`);
			this.modlog(`${handler.id.toUpperCase()} REMOVENOM`, userid);
		} else {
			this.sendReply(`User '${target}' has no nomination for the ${handler.name} of the ${handler.timeLabel}.`);
		}
	},
	removehelp: [
		`/-otd remove [username] - Remove a user's nomination for the Thing of the Day.`,
		`Prevents them from voting again until the next round. Requires: % @ # ~`,
	],

	removewinner(target, room, user) {
		const handler = selectHandler(this.message);
		room = this.requireRoom(handler.room.roomid);
		this.checkCan('mute', null, room);

		if (!toID(target)) {
			return this.parse(`/help aotd removewinner`);
		}
		const removed = handler.removeWinner(target);
		this.privateModAction(`${user.name} removed the nomination for ${removed[handler.keys[0]]} from ${removed.nominator}`);
		this.modlog(`${handler.id.toUpperCase()} REMOVEWINNER`, removed.nominator, removed[handler.keys[0]]);
	},
	removewinnerhelp: [
		`/-otd removewinner [nomination] - Remove winners matching the given [nomination] from Thing of the Day.`,
		`Requires: % @ # ~`,
	],

	force(target, room, user) {
		this.checkChat();
		if (!target) return this.parse('/help aotd force');

		const handler = selectHandler(this.message);

		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);
		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);
		this.checkCan('declare', null, room);

		if (!toNominationId(target).length || target.length > 50) {
			return this.sendReply(`'${target}' is not a valid ${handler.name.toLowerCase()} name.`);
		}
		handler.forceWinner(target, user.name);
		this.privateModAction(`${user.name} forcibly set the ${handler.name} of the ${handler.timeLabel} to ${target}.`);
		this.modlog(`${handler.id.toUpperCase()} FORCE`, user.name, target);
		room.add(`The ${handler.name} of the ${handler.timeLabel} was forcibly set to '${target}'`);
	},
	forcehelp: [
		`/-otd force [nomination] - Forcibly sets the Thing of the Day without a nomination round. Requires: # ~`,
	],

	delay(target, room, user) {
		this.checkChat();

		const handler = selectHandler(this.message);

		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);
		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);
		this.checkCan('mute', null, room);

		if (!(handler.voting && handler.timer)) {
			return this.errorReply(`There is no ${handler.name} of the ${handler.timeLabel} nomination to disable the timer for.`);
		}
		clearTimeout(handler.timer);

		this.privateModAction(`${user.name} disabled the ${handler.name} of the ${handler.timeLabel} timer.`);
	},
	delayhelp: [
		`/-otd delay - Turns off the automatic 20 minute timer for Thing of the Day voting rounds. Requires: % @ # ~`,
	],

	set(target, room, user) {
		this.checkChat();

		const handler = selectHandler(this.message);

		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);
		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);
		this.checkCan('mute', null, room);

		const params = target.split(target.includes('|') ? '|' : ',').map(param => param.trim());

		const changelist: { [k: string]: string } = {};

		for (const param of params) {
			let [key, ...values] = param.split(':');
			if (!key || !values.length) return this.errorReply(`Syntax error in '${param}'`);

			key = key.trim();
			const value = values.join(':').trim();

			if (!handler.keys.includes(key)) {
				return this.errorReply(`Invalid key: '${key}'. Valid keys: ${handler.keys.join(', ')}`);
			}

			switch (key) {
			case 'artist':
			case 'film':
			case 'show':
			case 'channel':
			case 'book':
			case 'author':
			case 'athlete':
				if (!toNominationId(value) || value.length > 50) return this.errorReply(`Please enter a valid ${key} name.`);
				break;
			case 'quote':
			case 'tagline':
			case 'match':
			case 'event':
			case 'videogame':
				if (!value.length || value.length > 150) return this.errorReply(`Please enter a valid ${key}.`);
				break;
			case 'sport':
			case 'team':
			case 'song':
			case 'country':
				if (!value.length || value.length > 50) return this.errorReply(`Please enter a valid ${key} name.`);
				break;
			case 'link':
			case 'image':
				if (!/https?:\/\//.test(value)) {
					return this.errorReply(`Please enter a valid URL for the ${key} (starting with http:// or https://)`);
				}
				if (value.length > 200) return this.errorReply("URL too long.");
				break;
			case 'age':
				const num = parseInt(value);
				// let's assume someone isn't over 100 years old? Maybe we should for the memes
				// but i doubt there's any legit athlete over 100.
				if (isNaN(num) || num < 1 || num > 100) return this.errorReply('Please enter a valid number as an age');
				break;
			default:
				// another custom key w/o validation
				if (!toNominationId(value)) {
					return this.errorReply(`No value provided for key ${key}.`);
				}
				break;
			}

			changelist[key] = value;
		}

		const keys = Object.keys(changelist);

		if (keys.length) {
			void handler.setWinnerProperty(changelist);
			this.modlog(handler.id.toUpperCase(), null, `changed ${keys.join(', ')}`);
			return this.privateModAction(`${user.name} changed the following propert${Chat.plural(keys, 'ies', 'y')} of the ${handler.name} of the ${handler.timeLabel}: ${keys.join(', ')}`);
		}
	},
	sethelp: [
		`/-otd set property: value[, property: value] - Set the winner, quote, song, link or image for the current Thing of the Day.`,
		`Requires: % @ # ~`,
	],

	toggleupdate(target, room, user) {
		const otd = selectHandler(this.message);
		room = this.requireRoom(otd.room.roomid);

		this.checkCan('declare', null, room);
		let logMessage = '';

		if (this.meansYes(target)) {
			if (otd.settings.updateOnNom) {
				throw new Chat.ErrorMessage(`This -OTD is already set to update automatically on nomination.`);
			}
			otd.settings.updateOnNom = true;
			logMessage = 'update automatically on nomination';
		} else {
			if (!otd.settings.updateOnNom) {
				throw new Chat.ErrorMessage(`This -OTD is not set to update automatically on nomination.`);
			}
			delete otd.settings.updateOnNom;
			logMessage = 'not update on nomination';
		}
		this.privateModAction(`${user.name} set the ${otd.name} of the ${otd.timeLabel} to ${logMessage}`);
		this.modlog(`OTD TOGGLEUPDATE`, null, logMessage);
		otd.save();
	},

	winners(target, room, user, connection) {
		this.checkChat();

		const handler = selectHandler(this.message);

		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);
		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);

		return this.parse(`/join view-${handler.id}`);
	},
	winnershelp: [`/-otd winners - Displays a list of previous things of the day.`],

	async ''(target, room) {
		this.checkChat();
		if (!this.runBroadcast()) return false;

		const handler = selectHandler(this.message);
		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);

		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);

		const text = await handler.generateWinnerDisplay();
		if (!text) return this.errorReply("There is no winner yet.");
		this.sendReplyBox(text);
	},
};

export const pages: Chat.PageTable = {};
export const commands: Chat.ChatCommands = {
	otd: {
		create(target, room, user) {
			room = this.requireRoom();
			if (room.settings.isPrivate) {
				return this.errorReply(`This command is only available in public rooms`);
			}
			const count = [...otds.values()].filter(otd => otd.room.roomid === room.roomid).length;
			if (count > 3) {
				return this.errorReply(`This room already has 3+ -otd's.`);
			}
			this.checkCan('rangeban');

			if (!toID(target)) {
				return this.parse(`/help otd`);
			}
			const [title, time, ...keyLabels] = target.split(',').map(i => i.trim());
			if (!toID(title)) {
				return this.errorReply(`Invalid title.`);
			}
			const timeLabel = toID(time);
			if (!['week', 'day'].includes(timeLabel)) {
				return this.errorReply("Invalid time label - use 'week' or 'month'");
			}
			const id = `${title.charAt(0)}ot${timeLabel.charAt(0)}`;
			const existing = otds.get(id);
			if (existing) {
				this.errorReply(`That -OTD already exists (${existing.name} of the ${existing.timeLabel}, in ${existing.room.title})`);
				return this.errorReply(`Try picking a new title.`);
			}
			const titleIdx = keyLabels.map(toID).indexOf(toID(title));
			if (titleIdx > -1) {
				keyLabels.splice(titleIdx, 1);
			}
			keyLabels.unshift(title);

			const filteredKeys = keyLabels.map(toNominationId).filter(Boolean);
			if (!filteredKeys.length) {
				return this.errorReply(`No valid key labels given.`);
			}
			if (new Set(filteredKeys).size !== keyLabels.length) {
				return this.errorReply(`Invalid keys in set - do not use duplicate key labels.`);
			}
			if (filteredKeys.length < 3) {
				return this.errorReply(`Specify at least 3 key labels.`);
			}
			if (filteredKeys.some(k => k.length < 3 || k.length > 50)) {
				return this.errorReply(`All labels must be more than 3 characters and less than 50 characters long.`);
			}
			const otd = OtdHandler.create(room, {
				keyLabels, keys: filteredKeys, title, timeLabel, roomid: room.roomid,
			});
			const name = `${otd.name} of the ${otd.timeLabel}`;
			this.globalModlog(`OTD CREATE`, null, `${name} - ${filteredKeys.join(', ')}`);
			this.privateGlobalModAction(`${user.name} created the ${name} for ${room.title}`);
			otd.save();
		},
		updateroom(target, room, user) {
			this.checkCan('rangeban');
			const [otdId, roomid] = target.split(',').map(i => toID(i));
			if (!otdId || !roomid) {
				return this.parse('/help otd');
			}
			const otd = otds.get(otdId);
			if (!otd) {
				return this.errorReply(`OTD ${otd} not found.`);
			}
			const targetRoom = Rooms.get(roomid);
			if (!targetRoom) {
				return this.errorReply(`Room ${roomid} not found.`);
			}
			const oldRoom = otd.settings.roomid.slice();
			otd.settings.roomid = targetRoom.roomid;
			otd.room = targetRoom;
			otd.save();
			this.privateGlobalModAction(
				`${user.name} updated the room for the ${otd.name} of the ${otd.timeLabel} from ${oldRoom} to ${targetRoom}`
			);
			this.globalModlog(`OTD UPDATEROOM`, null, `${otd.id} to ${targetRoom} from ${oldRoom}`);
		},
		delete(target, room, user) {
			this.checkCan('rangeban');
			target = toID(target);
			if (!target) {
				return this.parse(`/help otd`);
			}
			const otd = otds.get(target);
			if (!otd) return this.errorReply(`OTD ${target} not found.`);
			otd.destroy();
			this.globalModlog(`OTD DELETE`, null, target);
			this.privateGlobalModAction(`${user.name} deleted the OTD ${otd.name} of the ${otd.timeLabel}`);
		},
	},
	otdhelp: [
		`/otd create [title], [time], [...labels] - Creates a Thing of the Day with the given [name], [time], and [labels]. Requires: ~`,
		`/otd updateroom [otd], [room] - Updates the room for the given [otd] to the new [room]. Requires: ~`,
		`/otd delete [otd] - Removes the given Thing of the Day. Requires: ~`,
	],
};

const otdHelp = [
	`Thing of the Day plugin commands (aotd, fotd, sotd, cotd, botw, motw, anotd):`,
	`- /-otd - View the current Thing of the Day.`,
	`- /-otd start - Starts nominations for the Thing of the Day. Requires: % @ # ~`,
	`- /-otd nom [nomination] - Nominate something for Thing of the Day.`,
	`- /-otd remove [username] - Remove a user's nomination for the Thing of the Day and prevent them from voting again until the next round. Requires: % @ # ~`,
	`- /-otd end - End nominations for the Thing of the Day and set it to a randomly selected nomination. Requires: % @ # ~`,
	`- /-otd removewinner [nomination] - Remove a winner with the given [nomination] from the winners list. Requires: % @ # ~`,
	`- /-otd force [nomination] - Forcibly sets the Thing of the Day without a nomination round. Requires: # ~`,
	`- /-otd delay - Turns off the automatic 20 minute timer for Thing of the Day voting rounds. Requires: % @ # ~`,
	`- /-otd set property: value[, property: value] - Set the winner, quote, song, link or image for the current Thing of the Day. Requires: % @ # ~`,
	`- /-otd winners - Displays a list of previous things of the day.`,
	`- /-otd toggleupdate [on|off] - Changes the Thing of the Day to display on nomination ([on] to update, [off] to turn off updates). Requires: # ~`,
];

for (const otd in otdData) {
	const data = otdData[otd];
	const settings = data.settings;
	const room = Rooms.get(settings.roomid);
	if (!room) {
		Monitor.warn(`Room for -otd ${settings.title} of the ${settings.timeLabel} (${settings.roomid}) not found.`);
		continue;
	}
	OtdHandler.create(room, settings);
}

for (const [k, v] of otds) {
	pages[k] = function () {
		return v.generateWinnerList(this);
	};
	commands[k] = otdCommands;
	commands[`${k}help`] = otdHelp;
}

export const handlers: Chat.Handlers = {
	onRenameRoom(oldID, newID, room) {
		for (const otd in otdData) {
			const data = otdData[otd];
			if (data.settings.roomid === oldID) {
				data.settings.roomid = newID;
				const handler = otds.get(otd);
				handler!.room = room as Room;
				handler!.save();
			}
		}
	},
};

export const punishmentfilter: Chat.PunishmentFilter = (user, punishment) => {
	user = toID(user);
	if (!['NAMELOCK', 'BAN'].includes(punishment.type)) return;
	for (const handler of otds.values()) {
		handler.removeNomination(user);
	}
};
