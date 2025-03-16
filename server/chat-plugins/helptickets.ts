import { FS, Utils, Net, ProcessManager } from '../../lib';
import { getCommonBattles } from '../chat-commands/info';
import { checkRipgrepAvailability } from '../config-loader';
import type { Punishment } from '../punishments';
import type { PartialModlogEntry, ModlogID } from '../modlog';
import { runPunishments } from './helptickets-auto';

const TICKET_FILE = 'config/tickets.json';
const SETTINGS_FILE = 'config/chat-plugins/ticket-settings.json';
const TICKET_CACHE_TIME = 24 * 60 * 60 * 1000; // 24 hours
const TICKET_BAN_DURATION = 48 * 60 * 60 * 1000; // 48 hours
export const BATTLES_REGEX = /\bbattle-(?:[a-z0-9]+)-(?:[0-9]+)(?:-[a-z0-9]{31}pw)?/g;
export const REPLAY_REGEX = new RegExp(
	`${Utils.escapeRegex(Config.routes.replays)}/(?:[a-z0-9]-)?(?:[a-z0-9]+)-(?:[0-9]+)(?:-[a-z0-9]{31}pw)?`, "g"
);
const REPORT_NAMECOLORS: { [k: string]: string } = {
	p1: 'DodgerBlue',
	p2: 'Crimson',
	p3: '#FBa92C',
	p4: '#228B22',
	other: '#00000',
};

Punishments.addPunishmentType({
	type: 'TICKETBAN',
	desc: 'banned from creating help tickets',
});

interface TicketSettings {
	// {[ticketType]: {[button title]: response}}
	responses: { [ticketType: string]: { [title: string]: string } };
}

export interface TicketState {
	creator: string;
	userid: ID;
	open: boolean;
	active: boolean;
	type: string;
	created: number;
	claimed: string | null;
	ip: string;
	needsDelayWarning?: boolean;
	offline?: boolean;
	// text ticket properties
	/** [main text, context] */
	text?: [string, string];
	resolved?: ResolvedTicketInfo;
	meta?: string;
	notes?: { [userid: string]: string };
	/** Extra info that they might need for displays or whatnot.
	 * Use `TextTicketInfo#getState` to set it at creation (store properties of the user object, etc)
	 */
	state?: AnyObject & { claimTime?: number };
	/** Recommendations from the Artemis monitor, if it is set to only recommend. */
	recommended?: string[];
}

interface ResolvedTicketInfo {
	time: number;
	result: string;
	by: string;
	seen: boolean;
	staffReason: string;
	/** <small> note under the resolved */
	note?: string;
}

export interface TextTicketInfo {
	checker?: (
		input: string, context: string, pageId: string, user: User, reportTarget?: string
	) => boolean | string[] | Promise<boolean | string[]>;
	title: string;
	disclaimer?: string;
	/**
	 * Set this to prompt for more specific context beyond
	 * "Do you have any other information you want to provide? (this is optional)"
	 */
	contextMessage?: string;
	/** Should this be displayed with all the other tickets of the type on a singular page? */
	listOnly?: boolean;
	getReviewDisplay: (
		ticket: TicketState & { text: [string, string] }, staff: User, conn: Connection, state?: AnyObject
	) => Promise<string | void> | string | void;
	onSubmit?: (ticket: TicketState, text: [string, string], submitter: User, conn: Connection) => void | Promise<void>;
	getState?: (ticket: TicketState, user: User) => AnyObject;
}

interface BattleInfo {
	log: string[];
	url: string;
	title: string;
	players: { p1: ID, p2: ID, p3?: ID, p4?: ID };
	pokemon: Record<string, { species: string, name?: string }[]>;
}

type TicketResult = 'approved' | 'valid' | 'assisted' | 'denied' | 'invalid' | 'unassisted' | 'ticketban' | 'deleted';

const defaults: TicketSettings = { responses: {} };

export const tickets: { [k: string]: TicketState } = {};
export const settings: TicketSettings = (() => {
	try {
		// this ensures that if new settings are added to the defaults, they are added
		// to the JSON as well
		return { ...defaults, ...JSON.parse(FS(SETTINGS_FILE).readSync()) };
	} catch {
		return { ...defaults };
	}
})();

try {
	const ticketData = JSON.parse(FS(TICKET_FILE).readSync());
	for (const t in ticketData) {
		const ticket = ticketData[t];
		if (ticket.banned) {
			if (ticket.expires && ticket.expires <= Date.now()) continue;
			void Punishments.punish(ticket.userid, {
				type: 'TICKETBAN',
				id: ticket.userid,
				expireTime: ticket.expires,
				reason: ticket.reason,
			}, false);
			delete ticketData[t]; // delete the old format
		} else {
			if (ticket.created + TICKET_CACHE_TIME <= Date.now()) {
				// Tickets that have been open for 24+ hours will be automatically closed.
				const ticketRoom = Rooms.get(`help-${ticket.userid}`) as ChatRoom | null;
				if (ticketRoom) {
					const ticketGame = ticketRoom.game as HelpTicket;
					ticketGame.writeStats(false);
					ticketRoom.expire();
				} else if (ticket.text && ticket.open) {
					ticket.open = false;
					const startTime = ticket.state?.claimTime || ticket.created;
					writeStats(`${ticket.type}\t${Date.now() - startTime}\t0\t0\tdead\tvalid\t`);
				}
				continue;
			}
			// Close open tickets after a restart
			if (ticket.open && !Chat.oldPlugins.helptickets) ticket.open = false;
			tickets[t] = ticket;
		}
	}
} catch (e: any) {
	if (e.code !== 'ENOENT') throw e;
}

export function writeTickets() {
	FS(TICKET_FILE).writeUpdate(
		() => JSON.stringify(tickets), { throttle: 5000 }
	);
}

export function writeSettings() {
	FS(SETTINGS_FILE).writeUpdate(() => JSON.stringify(settings));
}

async function convertRoomPunishments() {
	for (const [id, punishment] of Punishments.getPunishments('staff')) {
		if (punishment.punishType !== 'TICKETBAN') continue;
		Punishments.roomUnpunish('staff', id, 'TICKETBAN');
		await HelpTicket.ban(id as ID, punishment.reason);
	}
}

export function writeStats(line: string) {
	// ticketType\ttotalTime\ttimeToFirstClaim\tinactiveTime\tresolution\tresult\tstaff,userids,seperated,with,commas
	const date = new Date();
	const month = Chat.toTimestamp(date).split(' ')[0].split('-', 2).join('-');
	try {
		Monitor.logPath(`tickets/${month}.tsv`).appendSync(line + '\n');
	} catch (e: any) {
		if (e.code !== 'ENOENT') throw e;
	}
}

export class HelpTicket extends Rooms.SimpleRoomGame {
	override readonly gameid = "helpticket" as ID;
	override readonly allowRenames = true;
	override room: ChatRoom;
	ticket: TicketState;
	claimQueue: string[];
	involvedStaff = new Set<ID>();
	createTime: number;
	activationTime: number;
	emptyRoom = false;
	firstClaimTime = 0;
	unclaimedTime = 0;
	lastUnclaimedStart: number;
	closeTime = 0;
	resolution: 'unknown' | 'dead' | 'unresolved' | 'resolved' = 'unknown';
	result: TicketResult | null = null;

	constructor(room: ChatRoom, ticket: TicketState) {
		super(room);
		this.room = room;
		this.room.settings.language = Users.get(ticket.creator)?.language || 'english' as ID;
		this.title = `Help Ticket - ${ticket.type}`;
		this.ticket = ticket;
		this.claimQueue = [];

		/* Stats */
		this.createTime = Date.now();
		this.activationTime = (ticket.active ? this.createTime : 0);
		this.lastUnclaimedStart = (ticket.active ? this.createTime : 0);
	}

	override onJoin(user: User, connection: Connection) {
		if (!this.ticket.open) return false;
		if (!user.isStaff || user.id === this.ticket.userid) {
			if (this.emptyRoom) this.emptyRoom = false;
			this.addPlayer(user);
			if (this.ticket.offline) {
				delete this.ticket.offline;
				writeTickets();
				notifyStaff();
			}
			return false;
		}
		if (!this.ticket.claimed) {
			this.ticket.claimed = user.name;
			if (!this.firstClaimTime) {
				this.firstClaimTime = Date.now();
				// I'd use the player list for this, but it dosen't track DCs so were checking the userlist
				// Non-staff users in the room currently (+ the ticket creator even if they are staff)
				const users = Object.entries(this.room.users).filter(
					u => !((u[1].isStaff && u[1].id !== this.ticket.userid) || !u[1].named)
				);
				if (!users.length) this.emptyRoom = true;
			}
			if (this.ticket.active) {
				this.unclaimedTime += Date.now() - this.lastUnclaimedStart;
				this.lastUnclaimedStart = 0; // Set back to 0 so we know that it was active when closed
			}
			tickets[this.ticket.userid] = this.ticket;
			writeTickets();
			this.room.modlog({ action: 'TICKETCLAIM', isGlobal: false, loggedBy: user.id });
			this.addText(`${user.name} claimed this ticket.`, user);
			notifyStaff();
		} else {
			this.claimQueue.push(user.name);
		}
	}

	override onLeave(user: User, oldUserid: ID) {
		const player = this.playerTable[oldUserid || user.id];
		if (player) {
			this.removePlayer(player);
			this.ticket.offline = true;
			writeTickets();
			notifyStaff();
			return;
		}
		if (!this.ticket.open) return;
		if (toID(this.ticket.claimed) === user.id) {
			if (this.claimQueue.length) {
				this.ticket.claimed = this.claimQueue.shift() || null;
				this.room.modlog({ action: 'TICKETCLAIM', isGlobal: false, loggedBy: toID(this.ticket.claimed) });
				this.addText(`This ticket is now claimed by ${this.ticket.claimed}.`, user);
			} else {
				const oldClaimed = this.ticket.claimed;
				this.ticket.claimed = null;
				this.lastUnclaimedStart = Date.now();
				this.room.modlog({ action: 'TICKETUNCLAIM', isGlobal: false, loggedBy: toID(oldClaimed) });
				this.addText(`This ticket is no longer claimed.`, user);
				notifyStaff();
			}
			tickets[this.ticket.userid] = this.ticket;
			writeTickets();
		} else {
			const index = this.claimQueue.map(toID).indexOf(user.id);
			if (index > -1) this.claimQueue.splice(index, 1);
		}
	}

	override onLogMessage(message: string, user: User) {
		if (!this.ticket.open) return;
		if (user.isStaff && this.ticket.userid !== user.id) this.involvedStaff.add(user.id);
		if (this.ticket.active) return;
		const blockedMessages = [
			'hello', 'hullo', 'hey',
			'hesrude', 'shesrude', 'hesinappropriate', 'shesinappropriate', 'heswore', 'sheswore',
			'help', 'yes',
		];
		if (
			(!user.isStaff || this.ticket.userid === user.id) && (message.length < 3 || blockedMessages.includes(toID(message)))
		) {
			this.room.add(`|c|~Staff|${this.room.tr`Hello! The global staff team would be happy to help you, but you need to explain what's going on first.`}`);
			this.room.add(`|c|~Staff|${this.room.tr`Please post the information I requested above so a global staff member can come to help.`}`);
			this.room.update();
			return false;
		}
		if ((!user.isStaff || this.ticket.userid === user.id) && !this.ticket.active) {
			this.ticket.active = true;
			this.activationTime = Date.now();
			if (!this.ticket.claimed) this.lastUnclaimedStart = Date.now();
			notifyStaff();
			this.room.add(`|c|~Staff|${this.room.tr`Thank you for the information, global staff will be here shortly. Please stay in the room.`}`).update();
			switch (this.ticket.type) {
			case 'PM Harassment':
				this.room.add(
					`|c|~Staff|Global staff might take more than a few minutes to handle your report. ` +
					`If you are being disturbed by another user, you can type \`\`/ignore [username]\`\` in any chat to ignore their messages immediately`
				).update();
				break;
			}
			this.ticket.needsDelayWarning = true;
		}
	}

	override forfeit(user: User) {
		if (!(user.id in this.playerTable)) return;
		this.removePlayer(this.playerTable[user.id]);
		if (!this.ticket.open) return;
		this.room.modlog({ action: 'TICKETABANDON', isGlobal: false, loggedBy: user.id });
		this.addText(`${user.name} is no longer interested in this ticket.`, user);
		if (this.playerCount - 1 > 0) return; // There are still users in the ticket room, dont close the ticket
		this.close(!!(this.firstClaimTime), user);
		return true;
	}

	addText(text: string, user?: User) {
		if (user) {
			this.room.addByUser(user, text);
		} else {
			this.room.add(text);
		}
		this.room.update();
	}

	getButton() {
		const color = this.ticket.claimed ? `` : this.ticket.offline ? `alt-notifying` : `notifying`;
		const creator = (
			this.ticket.claimed ? Utils.html`${this.ticket.creator}` : Utils.html`<strong>${this.ticket.creator}</strong>`
		);
		const user = Users.get(this.ticket.creator);
		let details = '';
		if (user?.namelocked && !this.ticket.state?.namelocked) {
			if (!this.ticket.state) this.ticket.state = {};
			this.ticket.state.namelocked = user.namelocked;
		}
		if (this.ticket.state?.namelocked) {
			details += ` [${this.ticket.state?.namelocked}]`;
		}
		if (user?.locked) {
			const punishment = Punishments.userids.getByType(user.locked, 'LOCK');
			if (punishment?.rest?.length) {
				// only #artemis uses this rn
				details += ` [${punishment.rest.join(', ')}]`;
			}
		}
		return (
			`<a class="button ${color}" href="/help-${this.ticket.userid}"` +
			` ${this.getPreview()}>Help ${creator}${details}: ${this.ticket.type}</a> `
		);
	}

	getPreview() {
		if (!this.ticket.active) return `title="The ticket creator has not spoken yet."`;
		const hoverText = [];
		const noteBuf = Object.entries(this.ticket.notes || {})
			.map(([userid, note]) => Utils.html`${note} (by ${userid})`)
			.join('&#10;');
		const notes = this.ticket.notes ? `&#10;Staff notes:&#10;${noteBuf}` : '';
		for (let i = this.room.log.log.length - 1; i >= 0; i--) {
			// Don't show anything after the first linebreak for multiline messages
			const entry = this.room.log.log[i].split('\n')[0].split('|');
			entry.shift(); // Remove empty string
			if (!/c:?/.test(entry[0])) continue;
			if (entry[0] === 'c:') entry.shift(); // c: includes a timestamp and needs an extra shift
			entry.shift();
			const user = entry.shift();
			let message = entry.join('|');
			message = message.startsWith('/log ') ? message.slice(5) : `${user}: ${message}`;
			hoverText.push(Utils.html`${message}`);
			if (hoverText.length >= 3) break;
		}
		if (!hoverText.length) return `title="The ticket creator has not spoken yet.${notes}"`;
		return `title="${hoverText.reverse().join(`&#10;`)}${notes}"`;
	}

	close(result: boolean | 'ticketban' | 'deleted', staff?: User) {
		this.ticket.open = false;
		tickets[this.ticket.userid] = this.ticket;
		writeTickets();
		this.room.modlog({ action: 'TICKETCLOSE', isGlobal: false, loggedBy: staff?.id || 'unknown' as ID });
		this.addText(staff ? `${staff.name} closed this ticket.` : `This ticket was closed.`, staff);
		notifyStaff();
		this.room.pokeExpireTimer();
		for (const ticketGameUser of Object.values(this.playerTable)) {
			this.removePlayer(ticketGameUser);
			const user = Users.get(ticketGameUser.id);
			if (user) user.updateSearch();
		}
		if (!this.involvedStaff.size) {
			if (staff?.isStaff && staff.id !== this.ticket.userid) {
				this.involvedStaff.add(staff.id);
			} else {
				this.involvedStaff.add(toID(this.ticket.claimed));
			}
		}
		this.writeStats(result);
	}

	writeStats(result: boolean | 'ticketban' | 'deleted') {
		// Only run when a ticket is closed/banned/deleted
		this.closeTime = Date.now();
		if (this.lastUnclaimedStart) this.unclaimedTime += this.closeTime - this.lastUnclaimedStart;
		if (!this.ticket.active) {
			this.resolution = "dead";
		} else if (!this.firstClaimTime || this.emptyRoom) {
			this.resolution = "unresolved";
		} else {
			this.resolution = "resolved";
		}
		if (typeof result === 'boolean') {
			switch (this.ticket.type) {
			case 'Appeal':
			case 'IP-Appeal':
				this.result = (result ? 'approved' : 'denied');
				break;
			case 'PM Harassment':
			case 'Battle Harassment':
			case 'Inappropriate Username':
			case 'Inappropriate Pokemon Nicknames':
				this.result = (result ? 'valid' : 'invalid');
				break;
			case 'Public Room Assistance Request':
			case 'Other':
			default:
				this.result = (result ? 'assisted' : 'unassisted');
				break;
			}
		} else {
			this.result = result;
		}
		let firstClaimWait = 0;
		let involvedStaff = '';
		if (this.activationTime) {
			firstClaimWait = (this.firstClaimTime ? this.firstClaimTime : this.closeTime) - this.activationTime;
			involvedStaff = Array.from(this.involvedStaff.entries()).map(s => s[0]).join(',');
		}
		// Write to TSV
		// ticketType\ttotalTime\ttimeToFirstClaim\tinactiveTime\tresolution\tresult\tstaff,userids,seperated,with,commas
		const line = `${this.ticket.type}\t${(this.closeTime - this.createTime)}\t${firstClaimWait}\t${this.unclaimedTime}\t${this.resolution}\t${this.result}\t${involvedStaff}`;
		writeStats(line);
	}

	deleteTicket(staff: User) {
		this.close('deleted', staff);
		this.room.modlog({ action: 'TICKETDELETE', isGlobal: false, loggedBy: staff.id });
		this.addText(`${staff.name} deleted this ticket.`, staff);
		delete tickets[this.ticket.userid];
		writeTickets();
		notifyStaff();
		this.room.destroy();
	}

	// Modified version of RoomGame.destory
	override destroy() {
		if (tickets[this.ticket.userid] && this.ticket.open) {
			// Ticket was not deleted - deleted tickets already have this done to them - and was not closed.
			// Write stats and change flags as appropriate prior to deletion.
			this.ticket.open = false;
			tickets[this.ticket.userid] = this.ticket;
			notifyStaff();
			writeTickets();
			this.writeStats(false);
		}

		this.room.game = null;
		(this.room as any) = null;
		this.setEnded();
		for (const player of this.players) player.destroy();
		(this.players as any) = null;
		(this.playerTable as any) = null;
	}
	override onChatMessage(message: string, user: User) {
		HelpTicket.uploadReplaysFrom(message, user, user.connections[0]);
	}
	// workaround to modlog for no room
	static async modlog(entry: PartialModlogEntry) {
		await Rooms.Modlog.write('help-texttickets' as ModlogID, entry);
	}
	static list(sorter?: (ticket: TicketState) => Utils.Comparable) {
		if (!sorter) {
			sorter = ticket => [
				!ticket.offline,
				ticket.open,
				ticket.open ? [ticket.active, !ticket.claimed, ticket.created] : 0,
			];
		}
		return Utils.sortBy(Object.values(tickets), sorter);
	}
	static logTextResult(ticket: TicketState & { text: [string, string], resolved: ResolvedTicketInfo }) {
		const entry = {
			text: ticket.text,
			resolved: ticket.resolved,
			meta: ticket.meta,
			created: ticket.created,
			userid: ticket.userid,
			type: ticket.type,
			claimed: ticket.claimed,
			state: ticket.state || {},
			recommended: ticket.recommended,
		};
		const date = Chat.toTimestamp(new Date()).split(' ')[0];
		void Monitor.logPath(`tickets/${date.slice(0, -3)}.jsonl`).append(JSON.stringify(entry) + '\n');
	}

	/**
	 * @param search [search key, search value] (ie ['userid', 'mia']
	 * returns tickets where the userid property === mia)
	 * If the [value] is omitted (index 1), searches just for tickets with the given property.
	 */
	static async getTextLogs(search: [string, string] | [string], date?: string) {
		if (Config.disableripgrep) {
			throw new Chat.ErrorMessage("Helpticket logs are currently disabled.");
		}
		const results = [];
		if (await checkRipgrepAvailability()) {
			const searchString = search.length > 1 ?
				// regex escaped to handle things like searching for arrays or objects
				// (JSON.stringify accounts for " strings are wrapped in and stuff. generally ensures that searching is easier.)
				Utils.escapeRegex(JSON.stringify(search[1]).slice(0, -1)) :
				"";
			const args = [
				`-e`, search.length > 1 ? `${search[0]}":${searchString}` : `${search[0]}":`,
				'--no-filename',
			];
			let lines;
			try {
				lines = await ProcessManager.exec([
					`rg`, Monitor.logPath(`tickets/${date ? `${date}.jsonl` : ''}`).path, ...args,
				]);
			} catch (e: any) {
				if (e.message.includes('No such file or directory')) {
					throw new Chat.ErrorMessage(`No ticket logs for that month.`);
				}
				if (e.code !== 1 && !e.message.includes('stdout maxBuffer')) {
					throw e; // 2 means an error in ripgrep
				}
				if (e.stdout) {
					lines = e;
				} else {
					lines = { stdout: "" };
				}
			}
			for (const line of lines.stdout.split('\n')) {
				if (line.trim()) results.push(JSON.parse(line));
			}
		} else {
			if (!date) throw new Chat.ErrorMessage(`Specify a month.`);
			const path = Monitor.logPath(`tickets/${date}.jsonl`);
			if (!path.existsSync()) {
				throw new Chat.ErrorMessage(`There are no logs for the month "${date}".`);
			}
			const stream = path.createReadStream();
			for await (const line of stream.byLine()) {
				if (line.trim()) {
					const data = JSON.parse(line);
					const searched = data[search[0]];
					let matched = !!searched;
					if (search[1]) matched = searched === search[1];
					if (matched) results.push(data);
				}
			}
		}
		return results;
	}
	static uploadReplaysFrom(text: string, user: User, conn: Connection) {
		const rooms = getBattleLinks(text);
		for (const roomid of rooms) {
			const room = Rooms.get(roomid) as GameRoom | undefined;
			void room?.uploadReplay?.(user, conn, "forpunishment");
		}
	}
	static colorName(id: ID, info: BattleInfo) {
		for (const k in info.players) {
			const player = info.players[k as SideID];
			if (player === id) {
				return REPORT_NAMECOLORS[k];
			}
		}
		return REPORT_NAMECOLORS.other;
	}
	static formatBattleLog(logs: string[], info: BattleInfo, reported?: ID) {
		const log = logs.filter(l => l.startsWith('|c|'));
		let buf = ``;
		for (const line of log) {
			const [,, username, message] = Utils.splitFirst(line, '|', 3);
			const userid = toID(username);
			buf += `<div class="chat chatmessage${reported === userid ? ' highlighted' : ""}">`;
			buf += `<span class="username"><strong style="color: ${this.colorName(userid, info)}">`;
			buf += Utils.html`${username}:</strong></span> ${message}</div>`;
		}
		if (buf) buf = `<div class="infobox"><strong><a href="${info.url}">${info.title}</a></strong><hr />${buf}</div>`;
		return buf;
	}
	static async visualizeBattleLogs(rooms: string[], reported?: ID) {
		const logs = [];
		for (const room of rooms) {
			const log = await getBattleLog(room);
			if (log) logs.push(log);
		}
		const existingRooms = logs.filter(Boolean);
		if (existingRooms.length) {
			const chatBuffer = existingRooms
				.map(room => this.formatBattleLog(room.log, room, reported))
				.filter(Boolean)
				.join('');
			if (chatBuffer) {
				return (
					`<div class="infobox"><details class="readmore"><summary><strong>Battle chat logs:</strong><br /></summary>` +
					`${chatBuffer}</details></div>`
				);
			}
		}
	}
	static displayPunishmentList(
		reportUserid: ID,
		proofString: string,
		ticket: TicketState,
		title?: string,
		inner?: string,
	) {
		if (ticket.resolved) return '';
		let buf = `<details class="readmore"><summary>${title || 'Punish reported user:'}</summary><div class="infobox">`;
		if (inner) buf += inner;
		const punishments = ['Warn', 'Lock', 'Weeklock', 'Namelock', 'Weeknamelock'];
		for (const name of punishments) {
			buf += `<form data-submitsend="/msgroom staff,/${toID(name)} ${reportUserid},{reason} spoiler: ${proofString}">`;
			buf += `<button class="button notifying" type="submit">${name}</button><br />`;
			buf += `Optional reason: <input name="reason" />`;
			buf += `</form><br />`;
		}
		buf += `</div></details><br />`;
		return buf;
	}
	static getTextButton(ticket: TicketState & { text: [string, string] }) {
		let buf = '';
		const titleBuf = [
			...ticket.text[0].split('\n').map(Utils.escapeHTML),
			...ticket.text[1].split('<br />').map(Utils.stripHTML),
		].slice(0, 3);
		const noteBuf = Object.entries(ticket.notes || {})
			.map(([userid, note]) => Utils.html`${note} (by ${userid})`)
			.join('&#10;');
		const notes = ticket.notes ? `&#10;Staff notes:&#10;${noteBuf}` : '';
		const title = `title="${titleBuf.join('&#10;')}${notes}"`;
		const user = Users.get(ticket.userid);
		let namelockDisplay = '';
		if (user?.namelocked && !ticket.state?.namelocked) {
			if (!ticket.state) ticket.state = {};
			ticket.state.namelocked = user.namelocked;
		}
		if (ticket.state?.namelocked) {
			namelockDisplay = ` <small>[${ticket.state.namelocked}]</small>`;
		}
		buf += `<a class="button${ticket.claimed ? `` : ` notifying`}" ${title} href="/view-help-text-${ticket.userid}">`;
		buf += ticket.claimed ?
			`${ticket.userid}${namelockDisplay}:` :
			`<strong>${ticket.userid}</strong>${namelockDisplay}:`;
		buf += ` ${ticket.type}</a>`;
		return buf;
	}
	static async ban(user: User | ID, reason = '') {
		const userid = toID(user);
		const userObj = Users.get(user);
		if (userObj) user = userObj;
		let duration = Date.now() + TICKET_BAN_DURATION;
		const punishments = Punishments.userids.get(userid) || [];
		// we're not gonna grab by IP because we don't wanna risk nuking schools
		for (const punishment of punishments) {
			// find the punishment with the highest expire time, take that time instead
			if (punishment.expireTime > duration) {
				duration = punishment.expireTime;
			}
		}
		return Punishments.punish(user, {
			type: 'TICKETBAN',
			id: userid,
			expireTime: duration,
			reason,
		}, false);
	}
	static unban(user: ID | User) {
		user = toID(user);
		return Punishments.unpunish(user, 'TICKETBAN');
	}
	static getBanMessage(userid: ID, punishment: Punishment) {
		if (userid !== punishment.id) {
			const { id: punished, reason } = punishment;
			return (
				`You are banned from creating help tickets` +
				`${punished !== userid ? `, because you have the same IP as ${userid}` : ''}. ${reason ? `Reason: ${reason}` : ''}`
			);
		}
		return `You are banned from creating help tickets.`;
	}
	static notifyResolved(user: User, ticket: TicketState, userid = user.id) {
		const { result, time, by, seen, note } = ticket.resolved!;
		if (seen) return;
		const timeString = (Date.now() - time) > 1000 ? `, ${Chat.toDurationString(Date.now() - time)} ago.` : '.';
		user.send(`|pm|~Staff|${user.getIdentity()}|Hello! Your report was resolved by ${by}${timeString}`);
		if (result?.trim()) {
			user.send(`|pm|~Staff|${user.getIdentity()}|The result was "${result}"`);
		}
		if (note?.trim()) {
			user.send(`|pm|~Staff|${user.getIdentity()}|/raw <small>${note}</small>`);
		}
		tickets[userid].resolved!.seen = true;
		writeTickets();
	}
	static getTypeId(name: string) {
		return Object.entries(ticketTitles).find(entry => entry[1] === name)?.[0] || toID(name);
	}
}

const NOTIFY_ALL_TIMEOUT = 5 * 60 * 1000;
const NOTIFY_ASSIST_TIMEOUT = 60 * 1000;
const unclaimedTicketTimer: { [k: string]: NodeJS.Timeout | null } = { upperstaff: null, staff: null };
const timerEnds: { [k: string]: number } = { upperstaff: 0, staff: 0 };
function pokeUnclaimedTicketTimer(hasUnclaimed: boolean, hasAssistRequest: boolean) {
	const room = Rooms.get('staff');
	if (!room) return;
	if (hasUnclaimed && !unclaimedTicketTimer[room.roomid]) {
		unclaimedTicketTimer[room.roomid] = setTimeout(
			() =>
				notifyUnclaimedTicket(hasAssistRequest), hasAssistRequest ? NOTIFY_ASSIST_TIMEOUT : NOTIFY_ALL_TIMEOUT
		);
		timerEnds[room.roomid] = Date.now() + (hasAssistRequest ? NOTIFY_ASSIST_TIMEOUT : NOTIFY_ALL_TIMEOUT);
	} else if (
		hasAssistRequest &&
		(timerEnds[room.roomid] - NOTIFY_ASSIST_TIMEOUT) > NOTIFY_ASSIST_TIMEOUT &&
		unclaimedTicketTimer[room.roomid]
	) {
		// Shorten timer
		clearTimeout(unclaimedTicketTimer[room.roomid]!);
		unclaimedTicketTimer[room.roomid] = setTimeout(() => notifyUnclaimedTicket(hasAssistRequest), NOTIFY_ASSIST_TIMEOUT);
		timerEnds[room.roomid] = Date.now() + NOTIFY_ASSIST_TIMEOUT;
	} else if (!hasUnclaimed && unclaimedTicketTimer[room.roomid]) {
		clearTimeout(unclaimedTicketTimer[room.roomid]!);
		unclaimedTicketTimer[room.roomid] = null;
		timerEnds[room.roomid] = 0;
	}
}
function notifyUnclaimedTicket(hasAssistRequest: boolean) {
	const room = Rooms.get('staff');
	if (!room) return;
	clearTimeout(unclaimedTicketTimer[room.roomid]!);
	unclaimedTicketTimer[room.roomid] = null;
	timerEnds[room.roomid] = 0;
	for (const ticket of Object.values(tickets)) {
		if (!ticket.open) continue;
		if (!ticket.active) continue;
		const ticketRoom = Rooms.get(`help-${ticket.userid}`) as ChatRoom;

		if (ticket.needsDelayWarning && !ticket.claimed && delayWarnings[ticket.type]) {
			ticketRoom.add(
				`|c|~Staff|${ticketRoom.tr(delayWarningPreamble)}${ticketRoom.tr(delayWarnings[ticket.type])}`
			).update();
			ticket.needsDelayWarning = false;
		}
	}
	for (const i in room.users) {
		const user: User = room.users[i];
		if (user.can('mute', null, room) && !user.settings.ignoreTickets) {
			user.sendTo(
				room,
				`|tempnotify|helptickets|Unclaimed help tickets!|${hasAssistRequest ? 'Public Room Staff need help' : 'There are unclaimed Help tickets'}`
			);
		}
	}
}

export function notifyStaff() {
	const room = Rooms.get('staff');
	if (!room) return;
	let buf = ``;
	const sortedTickets = HelpTicket.list();
	const listOnlyTypes = Object.keys(textTickets).filter(type => textTickets[type].listOnly);
	let count = 0;
	let hiddenTicketUnclaimedCount = 0;
	let hiddenTicketCount = 0;
	let hasUnclaimed = false;
	let fourthTicketIndex = 0;
	let hasAssistRequest = false;
	for (const ticket of sortedTickets) {
		if (!ticket.open || listOnlyTypes.includes(HelpTicket.getTypeId(ticket.type))) continue;
		if (!ticket.active) continue;
		if (count >= 3) {
			hiddenTicketCount++;
			if (!ticket.claimed) hiddenTicketUnclaimedCount++;
			if (hiddenTicketCount === 1) {
				fourthTicketIndex = buf.length;
			} else {
				continue;
			}
		}
		// should always exist if it's a normal ticket
		const ticketRoom = Rooms.get(`help-${ticket.userid}`);
		const ticketGame = ticketRoom?.getGame(HelpTicket);
		if (!ticket.claimed) {
			hasUnclaimed = true;
			if (ticket.type === 'Public Room Assistance Request') hasAssistRequest = true;
		}
		if (ticket.text) {
			buf += HelpTicket.getTextButton(ticket as TicketState & { text: [string, string] });
		} else if (ticketGame) {
			buf += ticketGame.getButton();
		}
		count++;
	}
	if (hiddenTicketCount > 1) {
		const notifying = hiddenTicketUnclaimedCount > 0 ? ` notifying` : ``;
		if (hiddenTicketUnclaimedCount > 0) hasUnclaimed = true;
		buf = buf.slice(0, fourthTicketIndex) +
			`<button class="button${notifying}" name="send" value="/ht list">and ${hiddenTicketCount} more Help ticket${Chat.plural(hiddenTicketCount)} (${hiddenTicketUnclaimedCount} unclaimed)</button>`;
	}
	for (const type of listOnlyTypes) {
		const matches = sortedTickets.filter(
			ticket => HelpTicket.getTypeId(ticket.type) === type && ticket.open && !ticket.resolved
		);
		if (matches.length) {
			hasUnclaimed = true;
			count += matches.length;
			buf += `<button class="button notifying" name="send" value="/j view-help-list-${type}">${ticketTitles[type]} (${matches.length} open)</button> `;
		}
	}
	buf = `|${hasUnclaimed ? 'uhtml' : 'uhtmlchange'}|latest-tickets|<div class="infobox" style="padding: 6px 4px">${buf}${count === 0 ? `There were open Help tickets, but they've all been closed now.` : ``}</div>`;
	room.send(buf);

	if (hasUnclaimed) {
		buf = `|tempnotify|helptickets|Unclaimed help tickets!|${hasAssistRequest ? 'Public Room Staff need help' : 'There are unclaimed Help tickets'}`;
	} else {
		buf = `|tempnotifyoff|helptickets`;
	}

	if (hasUnclaimed) {
		// only notify for people highlighting
		buf = `${buf}|${hasAssistRequest ? 'Public Room Staff need help' : 'There are unclaimed Help tickets'}`;
	}
	for (const user of Object.values(room.users)) {
		if (user.can('lock') && !user.settings.ignoreTickets) user.sendTo(room, buf);
		for (const connection of user.connections) {
			if (connection.openPages?.has('help-tickets')) {
				void Chat.resolvePage('view-help-tickets', user, connection);
			}
		}
	}
	pokeUnclaimedTicketTimer(hasUnclaimed, hasAssistRequest);
}

function checkIp(ip: string) {
	for (const t in tickets) {
		if (tickets[t].ip === ip && tickets[t].open && !Punishments.isSharedIp(ip)) {
			return tickets[t];
		}
	}
	return false;
}

export function getBattleLinks(text: string) {
	const rooms = new Set<string>();
	const battles = text.match(BATTLES_REGEX);
	const replays = text.match(REPLAY_REGEX);
	if (battles) {
		for (const battle of battles) rooms.add(battle);
	}
	if (replays) {
		for (const r of replays) {
			rooms.add(`battle-${r.split('/').pop()!}`);
		}
	}
	return [...rooms];
}

function getReportedUser(ticket: TicketState) {
	if (!ticket.meta?.startsWith('user-')) return null;
	const id = toID(ticket.meta.slice(5));
	// ignoreit if they report themselves for w/e reason
	return (!id || id === ticket.userid) ? null : id;
}

export async function listOpponentsFrom(
	ticket: TicketState & { text: [string, string] }
) {
	const opps = new Utils.Multiset<string>();
	const links = getBattleLinks(ticket.text[0]).concat(getBattleLinks(ticket.text[1]));
	for (const link of links) {
		const opp = await getOpponent(link, ticket.userid);
		if (opp && opp !== ticket.userid) opps.add(opp);
	}
	return Utils.sortBy([...opps], ([, count]) => -count).map(opp => toID(opp[0]));
}

export async function getOpponent(link: string, submitter: ID): Promise<string | null> {
	const room = Rooms.get(link) as GameRoom | undefined;
	// we can't determine this for FFA - valid guesses can be made for 2 player, but not 4p. not at all.
	if (room?.battle) {
		if (room.battle.playerCap > 2) return null;
		for (const k in room.battle.playerTable) {
			if (k === submitter) continue;
			return k;
		}
	}
	if (!room) {
		const battleData = await getBattleLog(link);
		if (battleData) {
			return battleData.players.p1 === submitter ? battleData.players.p2 : battleData.players.p1;
		}
	}
	return null;
}

export async function getBattleLog(battle: string, noReplay = false): Promise<BattleInfo | null> {
	const battleRoom = Rooms.get(battle);
	const seenPokemon = new Set<string>();
	let data: { log: string, players: string[] } | null = null;
	// try battle room first
	if (battleRoom && battleRoom.type !== 'chat' && battleRoom.battle) {
		data = {
			log: battleRoom.log.log.join('\n'),
			players: battleRoom.battle.players.map(x => x.id),
		};
	} else { // fall back to replay
		if (noReplay) return null;
		battle = battle.replace(`battle-`, ''); // don't wanna strip passwords

		if (Rooms.Replays.db) { // direct conn exists, use it
			if (battle.endsWith('pw')) {
				battle = battle.slice(0, battle.lastIndexOf("-", battle.length - 2));
			}
			data = await Rooms.Replays.get(battle);
		} else {
			// call out to API
			try {
				const raw = await Net(`https://${Config.routes.replays}/${battle}.json`).get();
				data = JSON.parse(raw);
			} catch {}
		}
	}

	// parse
	if (data?.log?.length) {
		const log = data.log.split('\n');
		const players: BattleInfo['players'] = {} as any;
		for (const [i, id] of data.players.entries()) {
			players[`p${i + 1}` as SideID] = toID(id);
		}
		const chat = [];
		const mons: BattleInfo['pokemon'] = {};
		for (const line of log) {
			if (line.startsWith('|c|')) {
				chat.push(line);
			} else if (line.startsWith('|switch|')) {
				const [, , playerWithNick, speciesWithGender] = line.split('|');
				const species = speciesWithGender.split(',')[0].trim(); // should always exist
				let [slot, name] = playerWithNick.split(':');
				slot = slot.slice(0, -1); // p2a -> p2
				// safe to not check here bc this should always exist in the players table.
				// if it doesn't, there's a problem
				const id = players[slot as SideID] as string;
				if (!mons[id]) mons[id] = [];
				name = name?.trim() || "";
				const setId = `${name || ""}-${species}`;
				if (seenPokemon.has(setId)) continue;
				seenPokemon.add(setId);
				mons[id].push({
					species, // don't want to see a name if it's the same as the species
					name: name === species ? undefined : name,
				});
			}
		}
		return {
			log: chat,
			title: `${players.p1} vs ${players.p2}`,
			url: `https://${Config.routes.replays}/${battle}`,
			players,
			pokemon: mons,
		};
	}
	return null;
}

// Prevent a desynchronization issue when hotpatching
for (const room of Rooms.rooms.values()) {
	if (!room.settings.isHelp || !room.game) continue;
	const game = room.getGame(HelpTicket)!;
	if (game.ticket && tickets[game.ticket.userid]) game.ticket = tickets[game.ticket.userid];
}

// convert old-style Staff-room ticketbans to regular ones
void convertRoomPunishments();

const delayWarningPreamble = `Hi! All global staff members are busy right now and we apologize for the delay. `;
const delayWarnings: { [k: string]: string } = {
	'PM Harassment': `Please make sure you have given us the permission to check the PMs between you and the user you reported. You can also provide any relevant context; for example, a replay of a battle with the person you're reporting.`,
	'Battle Harassment': `Please save the replay of the battle and provide a link to it in this chat, so we can see the harassment even if the battle expires. You can save the replay by clicking on the "Upload and share replay" button once the battle has ended.`,
	'Inappropriate Username': `Make sure you have provided the correct username, and if its meaning or why it is offensive is not obvious, please explain why it should not be allowed.`,
	'Inappropriate Pokemon Nicknames': `Please save the replay of the battle and provide a link to it in this chat, so we can see the nicknames even if the battle expires. You can save the replay by clicking on the "Upload and share replay" button once the battle has ended.`,
	'Appeal': `Please clearly explain why you should be unlocked and we will review it as soon as possible.`,
	'IP-Appeal': `Please give us all relevant information on how you are connecting to Pokémon Showdown (if it is through mobile data, at home, a school or work network, etc), and we will review your case as soon as possible.`,
	'Public Room Assistance Request': `Please tell us which room you need assistance with and a global staff member will join your room as soon as possible.`,
	other: `If your issue pertains to battle mechanics or is a question about Pokémon Showdown, you can ask in the <<help>> chatroom.`,
};
const ticketTitles: { [k: string]: string } = {
	pmharassment: `PM Harassment`,
	battleharassment: `Battle Harassment`,
	inapname: `Inappropriate Username`,
	inappokemon: `Inappropriate Pokemon Nicknames`,
	appeal: `Appeal`,
	ipappeal: `IP-Appeal`,
	roomhelp: `Public Room Assistance Request`,
	other: `Other`,
};
const ticketPages: { [k: string]: string } = {
	report: `I want to report someone`,
	pmharassment: `Someone is harassing me in PMs`,
	battleharassment: `Someone is harassing me in a battle`,
	inapname: `Someone is using an offensive username`,
	inappokemon: `Someone is using offensive Pokemon nicknames`,
	cheating: `Someone is hacking or cheating in my battle`,

	appeal: `I want to appeal a punishment`,
	permalock: `I want to appeal my permalock`,
	lock: `I want to appeal my lock`,
	ip: `I'm locked because I have the same IP as someone I don't recognize.`,
	homeip: `I'm locked because someone in my home was punished.`,
	device: `I'm locked because someone misused my device or account.`,
	mobileip: `I am using mobile data.`,
	public: `I am at a public place (school, library, workplace, etc) or was locked in one.`,
	timeleft: `I want to know how long is left on my lock.`,
	reason: `I want to know why I was locked.`,
	startedit: `The other user started it.`,
	semilock: `I can't talk in chat because of my ISP`,
	hostfilter: `I'm locked because of a proxy or VPN`,
	hasautoconfirmed: `Yes, I have an autoconfirmed account`,
	lacksautoconfirmed: `No, I don't have an autoconfirmed account`,
	appealother: `I want to appeal a mute/roomban/blacklist`,

	misc: `Something else`,
	password: `I lost my password`,
	roomhelp: `I need global staff to help watch a public room`,
	other: `Other`,

	confirmpmharassment: `Report harassment in a private message (PM)`,
	confirmbattleharassment: `Report harassment in a battle`,
	confirminapname: `Report an inappropriate username`,
	confirminappokemon: `Report inappropriate Pokemon nicknames`,
	confirmappeal: `Appeal your lock`,
	confirmipappeal: `Appeal IP lock`,
	confirmroomhelp: `Call a Global Staff member to help`,
	confirmother: `Call a Global Staff member`,
};
const cheatingScenarios = [
	[
		`My opponent's Pokemon used moves it couldn't learn`,
		`It was probably a disguised Zoroark (<psicon pokemon="zoroark" />), which has the ability <a href="//${Config.routes.dex}/abilities/illusion">Illusion</a>. This happens often in Random Battles!`,
	],
	[
		`My opponent got very lucky (critical hits, freezes, flinches, etc.)`,
		`Sometimes, <a href="//${Config.routes.root}/pages/rng">that's just how RNG works</a>!`,
	],
	[
		`My opponent used six of the same Pokemon or too many Legendaries`,
		`Certain tiers, like Anything Goes, do not have Species Clause, which normally restricts a player to only one of each Pokemon. In addition, many tiers allow lots of legendaries, and you are allowed to use them!`,
	],
	[
		`My Pokemon used a move I didn't choose`,
		`You accidentally selected the wrong move and didn't notice. It happens more often than you might think!`,
	],
	[
		`My Pokemon moved last when it shouldn't have`,
		`You probably accidentally chose a move with negative priority, like Trick Room, Dragon Tail, or Roar.`,
	],
	[
		`My Pokemon's Ability didn't work`,
		`Perhaps Weezing's <a href="//${Config.routes.dex}/abilities/neutralizinggas">Neutralizing Gas</a> was active (<psicon pokemon="weezinggalar" />), or another effect, like <a href="https://dex.pokemonshowdown.com/abilities/moldbreaker">Mold Breaker</a>, was suppressing the Ability.`,
	],
	[
		`My Pokemon's move failed when I attacked the opponent in a Double Battle)`,
		`You attacked your own partner Pokemon, which failed because no Pokemon was there.`,
	],
];

export const textTickets: { [k: string]: TextTicketInfo } = {
	pmharassment: {
		title: "Who's harassing you in PMs?",
		checker(input) {
			if (!Users.get(input)) {
				return ['That user was not found.'];
			}
			return true;
		},
		async getReviewDisplay(ticket, staff, conn) {
			let buf = '';
			const reportUserid = toID(ticket.text[0]);
			const sharedBattles = getCommonBattles(ticket.userid, null, reportUserid, null, conn);
			let replays = getBattleLinks(ticket.text[1]).concat(getBattleLinks(ticket.text[1]));
			replays = replays.filter((url, index) => replays.indexOf(url) === index).concat(sharedBattles);
			const replayString = replays.map(u => `https://${Config.routes.client}/${u}`).join(', ');
			buf += HelpTicket.displayPunishmentList(
				ticket.userid,
				`spoiler:PMs with ${reportUserid} (as ${ticket.userid})${replayString ? `, ${replayString}` : ''}`,
				ticket,
				`Punish <strong>${ticket.userid}</strong> (reporter)`,
				`<h2 style="color:red">You are about to punish the reporter. Are you sure you want to do this?</h2>`,
			);
			buf += `<strong>Reported user:</strong> <span class="username">${reportUserid}</span> </strong>`;
			buf += `<button class="button" name="send" value="/modlog room=global,user='${reportUserid}'">Global Modlog</button><br />`;
			buf += HelpTicket.displayPunishmentList(
				reportUserid,
				`spoiler:PMs with ${ticket.userid}${replayString ? `, ${replayString}` : ''}`,
				ticket,
				`Punish <strong>${reportUserid}</strong> (reported user)`
			);

			if (replays.length) {
				const battleLogHTML = await HelpTicket.visualizeBattleLogs(replays, reportUserid);
				if (battleLogHTML) {
					buf += `<br />`;
					buf += battleLogHTML;
					buf += `<br />`;
				}
			}

			return buf;
		},
		onSubmit(ticket, text, submitter, conn) {
			const targetId = toID(text[0]);
			// this does the saving for us so we don't have to do anything else
			getCommonBattles(targetId, Users.get(targetId), submitter.id, submitter, conn);
		},
	},
	inapname: {
		title: "What's the inappropriate username?",
		contextMessage: "If the username is offensive in a non-English language, or if it's not obvious, please be sure to explain below.",
		checker(input) {
			if (!Users.get(input)) {
				return [
					"Please specify a valid username - that name was not found.",
					"Maybe you spelled it wrong?",
				];
			}
			return true;
		},
		getReviewDisplay(ticket, staff, conn, state) {
			let buf = ``;
			if (!ticket.open) return buf;
			const cmds: [string, string][] = [
				['Forcerename', '/forcerename'],
				['Namelock', '/namelock'],
				['Weeknamelock', '/weeknamelock'],
			];
			const tar = toID(ticket.text[0]); // should always be the reported userid
			const name = Utils.escapeHTML(Users.getExact(tar)?.name || tar);
			buf += `<br /><strong>Reported user:</strong> <a href="https://${Config.routes.root}/users/${tar}">${name}</a> `;
			buf += `<button class="button" name="send" value="/modlog room=global,user='${tar}'">Global Modlog</button><br />`;
			buf += `<details ${state?.list ? 'open' : ''} class="readmore">`;
			buf += `<summary>Punish <strong>${name}</strong> (reported user)</summary>`;
			buf += `<div class="infobox">`;
			for (const [cmdName, cmd] of cmds) {
				buf += `<form data-submitsend="/msgroom staff,${cmd} ${tar},{reason}">`;
				buf += `<button class="button notifying" type="submit">${cmdName}</button><br />`;
				buf += `Reason (optional:) <input name="reason" /></form><br />`;
			}
			buf += `</div></details>`;
			return buf;
		},
		onSubmit(ticket, text) {
			if (!ticket.meta?.startsWith('user-')) {
				// we validate that `text` is the id of existing user, so this is safe.
				ticket.meta = `user-${toID(text)}`;
			}
		},
	},
	battleharassment: {
		title: "Please provide a link to the battle (taken from the \"Upload and share\" button or copied from the browser URL)",
		async checker(input, context) {
			const replays = getBattleLinks(input).concat(getBattleLinks(context));
			if (!replays.length) {
				return ['Please provide at least one valid battle or replay URL.'];
			}
			let atLeastOne = false;
			for (const replay of replays) {
				const log = await getBattleLog(replay);
				if (log) {
					atLeastOne = true;
					break;
				}
			}
			if (!atLeastOne) {
				return [
					'None of the battle links provided are valid.',
					'They may have expired, or you may have misspelled the URL.',
				];
			}
			return true;
		},
		onSubmit(ticket, text, submitter, conn) {
			for (const part of text) {
				HelpTicket.uploadReplaysFrom(part, submitter, conn);
			}
		},
		async getReviewDisplay(ticket, staff, connection) {
			let buf = ``;
			const [text, context] = ticket.text;
			let rooms = getBattleLinks(text);

			if (context) {
				rooms.push(...getBattleLinks(context));
			}
			if (ticket.meta?.startsWith('room-')) {
				rooms.push(...getBattleLinks(ticket.meta.slice(5)));
			}
			rooms = rooms.filter((url, index) => rooms.indexOf(url) === index);
			const proof = rooms.map(u => `https://${Config.routes.client}/${u}`).join(', ');
			buf += HelpTicket.displayPunishmentList(
				ticket.userid,
				proof,
				ticket,
				`Punish <strong>${ticket.userid}</strong> (reporter)`,
				`<h2 style="color:red">You are about to punish the reporter. Are you sure you want to do this?</h2>`
			);
			const opp = getReportedUser(ticket) || (await listOpponentsFrom(ticket))[0];
			if (opp) {
				buf += `<br /><strong>Reported user:</strong> <span class="username">${opp}</span> `;
				buf += `<button class="button" name="send" value="/modlog room=global,user='${opp}'">Global Modlog</button><br />`;
				buf += HelpTicket.displayPunishmentList(
					opp,
					proof,
					ticket,
					`Punish <strong>${opp}</strong> (reported user)`
				);
			}
			buf += `<strong>Battle links:</strong> ${rooms.map(url => Chat.formatText(`<<${url}>>`)).join(', ')}<br />`;
			buf += `<br />`;
			const battleLogHTML = await HelpTicket.visualizeBattleLogs(rooms, opp);
			if (battleLogHTML) buf += battleLogHTML;
			return buf;
		},
	},
	roomhelp: {
		title: "Enter the name of the room",
		getReviewDisplay(ticket, staff) {
			let buf = ``;
			const room = Rooms.search(ticket.text[0])!;
			if (!staff.inRooms.has(room.roomid)) {
				buf += `<button class="button" name="send" value="/msgroom staff,/join ${room.roomid}">Join room</button>`;
				buf += `<br />`;
			} else {
				buf += `<p>You're already in that room.</p>`;
			}
			return buf;
		},
		checker(input) {
			const room = Rooms.search(input);
			if (!room) {
				return [
					`That room was not found.`,
					`Enter either the room name or a room alias.`,
				];
			}
			if (room.settings.isPrivate) {
				return ['You may only request help for public rooms.'];
			}
			return true;
		},
	},
	inappokemon: {
		title: "Please provide replays of the battle with inappropriate Pokemon nicknames",
		disclaimer: "If the nickname is offensive in a non-english language, or if it's not obvious, please be sure to explain.",
		checker(input) {
			if (BATTLES_REGEX.test(input) || REPLAY_REGEX.test(input)) return true;
			return ['Please provide at least one valid battle or replay URL.'];
		},
		async getReviewDisplay(ticket, staff, conn) {
			let buf = ``;
			const [text, context] = ticket.text;
			let links = getBattleLinks(text);
			if (context) links.push(...getBattleLinks(context));
			const proof = links.join(', ');
			const opp = getReportedUser(ticket) || (await listOpponentsFrom(ticket))[0];
			buf += HelpTicket.displayPunishmentList(
				ticket.userid,
				proof,
				ticket,
				`Punish <strong>${ticket.userid}</strong> (reporter)`,
				`<h2 style="color:red">You are about to punish the reporter. Are you sure you want to do this?</h2>`
			);
			if (opp) {
				buf += `<strong>Reported user:</strong> <span class="username">${opp}</span> </strong>`;
				buf += `<button class="button" name="send" value="/modlog room=global,user='${opp}'">Global Modlog</button><br />`;
				buf += HelpTicket.displayPunishmentList(
					opp,
					proof,
					ticket,
					`Punish <strong>${opp}</strong> (reported)`,
				);
			}
			buf += `<p><strong>Battle links given:</strong><p>`;
			links = links.filter((url, i) => links.indexOf(url) === i);
			buf += links.map(uri => Chat.formatText(`<<${uri}>>`)).join(', ');
			buf += `<div class="infobox"><strong>Names in given battles:</strong><hr />`;
			for (const link of links) {
				const names = [];
				const roomData = await getBattleLog(link);
				if (!roomData) continue;
				for (const id of Object.values(roomData.players)) {
					const user = Users.get(id)?.name || id;
					const team = roomData.pokemon[id];
					if (team) {
						const teamNames = team.map(p => (
							p.name !== p.species ? Utils.html`${p.name} (${p.species})` : p.species
						));
						names.push(`<strong>${user}:</strong> ${teamNames.join(', ')}`);
					}
				}
				if (names.length) {
					buf += `<a href="/${getBattleLinks(link)[0]}">${roomData.title}</a><br />`;
					buf += names.join('<br />');
					buf += `<hr />`;
				}
			}
			buf += `</div>`;
			return buf;
		},
		onSubmit(ticket, text, submitter, conn) {
			for (const part of text) {
				HelpTicket.uploadReplaysFrom(part, submitter, conn);
			}
		},
	},
	ipappeal: {
		title: "Where are you currently connecting from? Please give its name, city, and country.",
		async getReviewDisplay(ticket, staff, conn, state) {
			const tarUser = Users.get(ticket.userid);
			let info = state?.ips;
			const stringIps = info?.some((f: any) => typeof f === 'string');
			if (!info || stringIps) {
				const ips = stringIps ? [...info] : tarUser?.ips;
				info = [];
				if (ips?.length) {
					for (const ip of ips) {
						info.push({ ...await IPTools.lookup(ip), ip });
					}
					if (!ticket.state) {
						ticket.state = info;
						writeTickets();
					}
				}
			}
			let buf = `<strong>IPs:</strong><br />`;
			for (const data of info) {
				const ip = data.ip;
				buf += `<details class="readmore"><summary>`;
				buf += `<strong><a href="https://whatismyipaddress.com/ip/${ip}">${ip}</a></strong></summary>`;
				const ipPunishments = Punishments.ips.get(ip);
				if (ipPunishments) {
					const str = ipPunishments.map(p => (
						`${Punishments.punishmentTypes.get(p.type)?.desc || p.type} as ` +
						`<a href="https://${Config.routes.root}/users/${p.id}">${p.id}</a>` +
						`${p.reason ? ` (${p.reason})` : ''}`
					));
					if (str) buf += `Punishments: ${str.join(' | ')}<br />`;
				}
				buf += `Host: ${data.shortHost} [${data.hostType}]<br />`;
				buf += `<button class="button" name="send" value="/modlog room=global,ip=${ip}">Modlog</button><br />`;
				if (ipPunishments) {
					const unlockCmd = staff.can('globalban') ?
						`/unlockip ${ip}` :
						`Can someone \`\`/unlockip ${ip}\`\` (${data.hostType} host)`;
					buf += `<button class="button" name="send" value="/msgroom staff,${unlockCmd}">Unlock IP</button><br />`;
					const marksharedCmd = staff.can('globalban') ?
						`/markshared ${ip}, {owner}` :
						`Can someone \`\`/markshared ${ip}, {owner}\`\``;
					buf += `<form data-submitsend="/msgroom staff,${marksharedCmd}">`;
					buf += `<input name="owner" placeholder="School/Organization Name, City, Country" size="40" required />`;
					buf += `<button class="button" type="submit">Mark as shared IP</button>`;
					buf += `</form>`;
				}
				buf += `</details>`;
			}

			return buf;
		},
		getState(ticket, user) {
			return { ips: user.ips };
		},
		checker(text, context, pageId, user) {
			if (!toID(text)) {
				return ['Please tell us where you are connecting from.'];
			}
			if (!(user.locked || user.namelocked || user.semilocked)) {
				return ['You are not punished.'];
			}
			if (!user.registered) {
				return [
					"Because this account isn't registered (with a password), we cannot verify your identity.",
					"Please come back with a different account you've registered in the past.",
				];
			}
			const punishments = Punishments.search(user.id);
			const userids = [user.id, ...user.previousIDs];

			if (punishments.length) {
				for (const [, , punishment] of punishments) {
					if (userids.includes(punishment.id as ID)) {
						return ['Your current punishment was explicitly given to you. Please open an Appeal ticket instead.'];
					}
				}
			}

			if (user.ips.some(i => Punishments.isBlacklistedSharedIp(i))) {
				return [
					"Your network has too many users who consistently misbehave on it. As such, we cannot unlock you, to ensure they don't abuse it.",
					"Apologies for the inconvenience. It should expire in a few days.",
				];
			}
			return true;
		},
		async onSubmit(ticket, text, user) {
			const ips = [];
			for (const ip of user.ips) {
				ips.push({ ...await IPTools.lookup(ip), ip });
			}
			ticket.state = ips;
			writeTickets();
		},
	},
};

export const pages: Chat.PageTable = {
	help: {
		request(query, user, connection) {
			if (!user.named) {
				const buf = `>view-help-request${query.length ? '-' + query.join('-') : ''}\n` +
					`|init|html\n` +
					`|title|Request Help\n` +
					`|pagehtml|<div class="pad"><h2>${this.tr`Request help from global staff`}</h2><p>${this.tr`Please <button name="login" class="button">Log In</button> to request help.`}</p></div>`;
				connection.send(buf);
				return Rooms.RETRY_AFTER_LOGIN;
			}
			this.title = this.tr`Request Help`;
			let buf = `<div class="pad"><h2>${this.tr`Request help from global staff`}</h2>`;

			const ticketBan = Punishments.isTicketBanned(user);
			if (ticketBan) {
				return connection.popup(HelpTicket.getBanMessage(user.id, ticketBan));
			}
			let ticket = tickets[user.id];
			const ipTicket = checkIp(user.latestIp);
			if (ticket?.open || ipTicket) {
				if (!ticket && ipTicket) ticket = ipTicket;
				const helpRoom = Rooms.get(`help-${ticket.userid}`);
				if (!helpRoom && !ticket.text) {
					// Should never happen
					tickets[ticket.userid].open = false;
					writeTickets();
				} else {
					if (helpRoom) {
						if (!helpRoom.auth.has(user.id)) helpRoom.auth.set(user.id, '+');
						user.joinRoom(`help-${ticket.userid}` as RoomID);
					}
					connection.popup(this.tr`You already have a Help ticket.`);
					return this.close();
				}
			}

			const isStaff = user.can('lock');
			// room / user being reported
			let meta = '';
			const targetTypeIndex = Math.max(query.indexOf('user'), query.indexOf('room'));
			if (targetTypeIndex >= 0) meta = '-' + query.splice(targetTypeIndex).join('-');
			if (!query.length) query = [''];
			for (const [i, page] of query.entries()) {
				const isLast = (i === query.length - 1);
				const isFirst = i === 1;
				if (page && page in ticketPages && !page.startsWith('confirm')) {
					let prevPageLink = query.slice(0, i).join('-');
					if (prevPageLink) prevPageLink = `-${prevPageLink}`;
					buf += `<p><a href="/view-help-request${prevPageLink}${!isFirst ? meta : ''}" target="replace"><button class="button">${this.tr`Back`}</button></a> <button class="button disabled" disabled>${this.tr(ticketPages[page])}</button></p>`;
				}
				switch (page) {
				case '':
					buf += `<p><b>${this.tr`What's going on?`}</b></p>`;
					if (isStaff) {
						buf += `<p class="message-error">${this.tr`Global staff cannot make Help requests. This form is only for reference.`}</p>`;
					} else {
						buf += `<p class="message-error">${this.tr`Abuse of Help requests can result in punishments.`}</p>`;
					}
					if (!isLast) break;
					buf += `<p><Button>report</Button></p>`;
					buf += `<p><Button>appeal</Button></p>`;
					buf += `<p><Button>misc</Button></p>`;
					break;
				case 'report':
					buf += `<p><b>${this.tr`What do you want to report someone for?`}</b></p>`;
					if (!isLast) break;
					buf += `<p><Button>pmharassment</Button></p>`;
					buf += `<p><Button>battleharassment</Button></p>`;
					buf += `<p><Button>inapname</Button></p>`;
					buf += `<p><Button>inappokemon</Button></p>`;
					buf += `<p><Button>cheating</Button></p>`;
					break;
				case 'pmharassment':
					buf += `<p>${this.tr`If someone is harassing you in private messages (PMs), click the button below and a global staff member will take a look. If you are being harassed in a chatroom, please ask a room staff member to handle it.`}`;
					if (!this.pageid.includes('confirm')) {
						buf += ` If it's a minor issue, consider using <code>/ignore [username]</code> instead.`;
					}
					buf += `</p>`;
					if (!isLast) break;
					buf += `<p><Button>confirmpmharassment</Button></p>`;
					break;
				case 'battleharassment':
					buf += `<p>${this.tr`If someone is harassing you in a battle, click the button below and a global staff member will take a look. If you are being harassed in a chatroom, please ask a room staff member to handle it.`}`;
					if (!this.pageid.includes('confirm')) {
						buf += ` If it's a minor issue, consider using <code>/ignore [username]</code> instead.`;
					}
					buf += `</p>`;
					buf += `<p>${this.tr`Please save a replay of the battle if it has ended, or provide a link to the battle if it is still ongoing.`}</p>`;
					if (!isLast) break;
					buf += `<p><Button>confirmbattleharassment</Button></p>`;
					break;
				case 'inapname':
					buf += `<p>${this.tr`If a user has an inappropriate name, click the button below and a global staff member will take a look.`}</p>`;
					if (!isLast) break;
					buf += `<p><Button>confirminapname</Button></p>`;
					break;
				case 'inappokemon':
					buf += `<p>${this.tr`If a user has inappropriate Pokemon nicknames, click the button below and a global staff member will take a look.`}</p>`;
					buf += `<p>${this.tr`Please save a replay of the battle if it has ended, or provide a link to the battle if it is still ongoing.`}</p>`;
					if (!isLast) break;
					buf += `<p><Button>confirminappokemon</Button></p>`;
					break;
				case 'cheating':
					buf += `<p>Your opponent cannot control how lucky or unlucky you are, what moves you choose, or the mechanics of the battle. You may just be misunderstanding what happened in your battle!</p>`;
					buf += `<h4>Some common situations</h4><ul>`;
					for (const [scenario, explanation] of cheatingScenarios) {
						buf += `<li><details class="readmore"><summary>${scenario}</summary><br />${explanation}<br /><br /></details></li>`;
					}
					buf += `</ul><p>There are many more situations like this where the opponent was not cheating or hacking. If you're confused about what happened, upload your battle replay and share it with the Help room. They can help you understand what happened!</p>`;
					buf += `<p style="text-align: center"><button class="button" name="send" value="/j help"><strong>Join the Help Room</strong></button></p>`;
					break;
				case 'appeal':
					// buf += `<p><b>${this.tr`What would you like to appeal?`}</b></p>`;
					if (!isLast) break;
					if (user.locked || isStaff) {
						const hostfiltered = user.locked === '#hostfilter' || (user.latestHostType === 'proxy' && user.locked !== user.id);
						if (!hostfiltered) {
							buf += `<p><strong>I want to appeal my lock.</strong></p>`;
							const namelocked = user.named && user.id.startsWith('guest');
							if (user.locked === user.id || namelocked || isStaff) {
								if (user.permalocked || isStaff) {
									buf += `<p><Button>permalock</Button></p>`;
								}
								if (!user.permalocked || isStaff) {
									buf += `<p><Button>lock</Button></p>`;
								}
							}
							for (const type of ['timeleft', 'reason', 'startedit']) {
								buf += `<p><Button>${type}</Button></p>`;
							}
						}
						buf += `<p><strong>I'm locked under a name or IP I don't recognize.</strong></p>`;
						if (hostfiltered) {
							buf += `<p><Button>hostfilter</Button></p>`;
						}
						if (!hostfiltered || isStaff) {
							for (const type of ['public', 'homeip', 'mobileip', 'device']) {
								buf += `<p><Button>${type}</Button></p>`;
							}
							if ((user.locked !== '#hostfilter' && user.latestHostType !== 'proxy' && user.locked !== user.id) || isStaff) {
								buf += `<p><Button>ip</Button></p>`;
							}
						}
					}
					buf += `<p><strong>I am punished but do not fall under any of the above.</strong></p>`;
					if (user.semilocked || isStaff) {
						buf += `<p><Button>semilock</Button></p>`;
					}
					buf += `<p><Button>appealother</Button></p>`;
					buf += `<p><Button>other</Button></p>`;
					break;
				case 'permalock':
					buf += `<p>${this.tr`Permalocks are usually for repeated incidents of poor behavior over an extended period of time, and rarely for a single severe infraction. Please keep this in mind when appealing a permalock.`}</p>`;
					buf += `<p>${this.tr`Please visit the <a href="https://www.smogon.com/forums/threads/discipline-appeal-rules.3583479/">Discipline Appeals</a> page to appeal your permalock.`}</p>`;
					break;
				case 'lock':
					buf += `<p>${this.tr`If you want to appeal your lock or namelock, click the button below and a global staff member will be with you shortly.`}</p>`;
					buf += `<p>You will have to explain in detail why your punishment is unjustified and why we would want to unlock you. Insufficient explanations such as "lol this is bs unlock me" will not be considered.</p>`;
					if (!isLast) break;
					buf += `<p><Button>confirmappeal</Button></p>`;
					break;
				case 'ip':
					buf += `<p>${this.tr`If you are locked or namelocked under a name you don't recognize, click the button below to call a global staff member so we can check.`}</p>`;
					if (!isLast) break;
					buf += `<p><Button>confirmipappeal</Button></p>`;
					break;
				case 'homeip':
					buf += `<p>If you are using your home's wifi network, it means that the person you are being mistaken for did as well (maybe a family member?).</p>`;
					buf += `<p>In any case, we have no ability to make the difference - for all we know, you are the same user. Please wait out the lock.</p>`;
					break;
				case 'device':
					buf += `<p>Sorry, but you are considered responsible for whoever has access to your computer.</p>`;
					buf += `<p>We have no way to make the difference between two people using the exact same computer. Please wait out the lock.</p>`;
					break;
				case 'mobileip':
					buf += `<p>If you are not the user who was punished, the lock should expire on its own within a few hours.</p>`;
					buf += `<p>If you are in a hurry to communicate with another user, you can click on the following button to open a ticket.</p>`;
					buf += `<p>A staff member will look at your case as soon as possible.</p>`;
					if (!isLast) break;
					buf += `<button name="send" value="/ht submit IP-Appeal|||I am on a mobile IP.|">Submit ticket</button>`;
					break;
				case 'public':
					if (user.ips.some(ip => Punishments.sharedIpBlacklist.has(ip))) {
						buf += "<p>The public place you are in has had frequent misbehavior. As such, we can not unlock it, to prevent the bad users on it from abusing this. We apologize for the inconvenience.</p>";
						break;
					} else {
						buf += `<p>If you have been locked at school or in a library, please write down its name, city and country in the form below so we can verify your claim. This information is strictly confidential, and global staff will only use it to deal with your appeal.</p>`;
						buf += `<p>If you have been locked using the wifi of another type of facility, please write down which kind it is in the form.</p>`;
						buf += `<p><Button>confirmipappeal</Button></p>`;
					}
					break;
				case 'timeleft':
					const expiry = Punishments.checkLockExpiration(user.id);
					if (typeof expiry !== 'string') {
						buf += `<p>You aren't locked.</p>`;
					} else {
						buf += `Your lock ${expiry.trim().replace('(', '').replace(')', '') || "expires soon"}.`;
					}
					break;
				case 'reason':
					const punishments = Punishments.search(user.id)
						.map(p => p[2])
						.filter(t => ['LOCK', 'NAMELOCK'].includes(t.type));
					if (!punishments.some(p => p.reason)) {
						buf += `<p>No reasons were found on your lock.</p>`;
						break;
					}
					for (const [idx, punishment] of punishments.entries()) {
						if (punishments.indexOf(punishment) !== idx) {
							continue;
						} else if (punishment.reason) {
							buf += Utils.html`<p>Your ${punishment.type} was for: ${punishment.reason}.</p>`;
						}
					}
					break;
				case 'startedit':
					buf += `<p>If you have been locked, it is because your behavior on its own has broken PS rules - whether someone else "started" it does not excuse it.</p>`;
					buf += `<p>If someone broke the rules during the interaction with led to your lock, they should have been punished as well when we addressed the report concerning you.</p>`;
					break;
				case 'hostfilter':
					buf += `<p>${this.tr`We automatically lock proxies and VPNs to prevent evasion of punishments and other attacks on our server. To get unlocked, you need to disable your proxy or VPN.`}</p>`;
					buf += `<p>${this.tr`If you must use a proxy / VPN to access Pokemon Showdown (e.g. your school blocks the site normally), you will only be able to battle, not chat. When you go home, you will be unlocked and able to freely chat again.`}</p>`;
					buf += `<p>For more detailed information, view the  <a href="//${Config.routes.root}/pages/proxyhelp">proxy help guide</a>.</p>`;
					buf += `<p>${this.tr`If you are certain that you are not currently using a proxy / VPN, please continue and open a ticket. Please explain in detail how you are connecting to Pokemon Showdown.`}</p>`;
					buf += `<p><Button>confirmipappeal</Button></p>`;
					break;
				case 'semilock':
					buf += `<p>${this.tr`Do you have an autoconfirmed account? An account is autoconfirmed when it has won at least one rated battle and has been registered for one week or longer.`}</p>`;
					if (!isLast) break;
					buf += `<p><Button>hasautoconfirmed</Button> <Button>lacksautoconfirmed</Button></p>`;
					break;
				case 'hasautoconfirmed':
					buf += `<p>${this.tr`Login to your autoconfirmed account by using the <code>/nick</code> command in any chatroom, and the semilock will automatically be removed. Afterwards, you can use the <code>/nick</code> command to switch back to your current username without being semilocked again.`}</p>`;
					buf += `<p>${this.tr`If the semilock does not go away, you can try asking a global staff member for help.`}</p>`;
					break;
				case 'lacksautoconfirmed':
					buf += `<p>${this.tr`If you don't have an autoconfirmed account, you will need to contact a global staff member to appeal your semilock.`}</p>`;
					break;
				case 'appealother':
					buf += `<p>${this.tr`Please PM the staff member who punished you. If you don't know who punished you, ask another room staff member; they will redirect you to the correct user. If you are banned or blacklisted from the room, use <code>/roomauth [name of room]</code> to get a list of room staff members. Bold names are online.`}</p>`;
					buf += `<p><strong>${this.tr`Do not PM staff if you are locked (signified by the symbol <code>‽</code> in front of your username). Locks are a different type of punishment; to appeal a lock, make a help ticket by clicking the Back button and then selecting the most relevant option.`}</strong></p>`;
					break;
				case 'misc':
					buf += `<p><b>${this.tr`Maybe one of these options will be helpful?`}</b></p>`;
					if (!isLast) break;
					buf += `<p><Button>password</Button></p>`;
					if (user.trusted || isStaff) buf += `<p><Button>roomhelp</Button></p>`;
					buf += `<p><Button>other</Button></p>`;
					break;
				case 'password':
					buf += `<p>If you need your Pokémon Showdown password reset, you can fill out a <a href="https://www.smogon.com/forums/password-reset-form/">Password Reset Form</a>.</p>`;
					buf += `<p>You will need to make a Smogon account to be able to fill out a form.`;
					break;
				case 'roomhelp':
					buf += `<p>${this.tr`If you are a room driver or up in a public room, and you need help watching the chat, one or more global staff members would be happy to assist you!`}</p>`;
					buf += `<p><Button>confirmroomhelp</Button></p>`;
					break;
				case 'other':
					buf += `<p>${this.tr`If your issue is not handled above, click the button below to talk to a global staff member. Please be ready to explain the situation.`}</p>`;
					if (!isLast) break;
					buf += `<p><Button>confirmother</Button></p>`;
					break;
				default:
					if (!page.startsWith('confirm') || !ticketTitles[page.slice(7)]) {
						buf += `<p>${this.tr`Malformed help request.`}</p>`;
						buf += `<a href="/view-help-request" target="replace"><button class="button">${this.tr`Back`}</button></a>`;
						break;
					}
					const type = this.tr(ticketTitles[page.slice(7)]);
					const submitMeta = Utils.splitFirst(meta, '-', 2).join('|'); // change the delimiter as some ticket titles include -
					const textTicket = textTickets[page.slice(7)];
					if (textTicket) {
						buf += `<p><b>${this.tr(textTicket.title)}</b></p>`;
						if (textTicket.disclaimer) {
							buf += `<p>${this.tr(textTicket.disclaimer)}</p>`;
						}
						buf += `<form data-submitsend="/helpticket submit ${ticketTitles[page.slice(7)]} ${submitMeta} | {text} | {context}">`;
						buf += `<textarea style="width: 100%" name="text"></textarea><br />`;
						buf += `<strong>${"Do you have any other information you want to provide? (this is optional)"}</strong>`;
						if (textTicket.contextMessage) {
							buf += `<br />${textTicket.contextMessage}`;
						}
						buf += `<br />`;
						buf += `<textarea style="width: 100%" name="context"></textarea><br />`;
						buf += `<br /><button class="button notifying" type="submit">Submit ticket</button></form>`;
					} else {
						buf += `<p><b>${this.tr`Are you sure you want to submit a ticket for ${type}?`}</b></p>`;
						buf += `<p><button class="button notifying" name="send" value="/helpticket submit ${ticketTitles[page.slice(7)]} ${submitMeta}">${this.tr`Yes, contact global staff`}</button> <a href="/view-help-request-${query.slice(0, i).join('-')}${meta}" target="replace">`;
						buf += `<button class="button">${this.tr`No, cancel`}</button></a></p>`;
					}
					if (textTicket || page.includes('confirmpmharassment')) {
						buf += `<p>`;
						buf += `Global staff might take more than a few minutes to handle your report. `;
						buf += `If you are being disturbed by another user, we advise you to type <code>/ignore [username]</code> in a chatroom to ignore their messages.`;
					}
					break;
				}
			}
			buf += '</div>';
			const curPageLink = query.length ? '-' + query.join('-') : '';
			buf = buf.replace(
				/<Button>([a-z]+)<\/Button>/g,
				(match, id) => (
					`<a class="button" href="/view-help-request${curPageLink}-${id}${meta}" target="replace">${this.tr(ticketPages[id])}</a>`
				)
			);
			return buf;
		},
		async list(query, user, connection) {
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			this.checkCan('lock');
			const type = toID(query.shift());
			let buf = `<div class="pad">`;
			this.title = '[Help Tickets]';
			if (!type) {
				buf += `<h2>Help Tickets</h2><hr />`;
				const keys = Object.keys(textTickets).filter(id => textTickets[id].listOnly);
				if (!keys.length) {
					buf += `<p class="message-error">Currently, no ticket types support mass-view in a list.</p>`;
					buf += `<p>Use <code>/ht text [username]</code> to view an individual user's ticket instead.</p>`;
					return buf;
				}
				if (type && !keys.includes(type)) {
					buf += `<p class="message-error">That ticket type does not support mass-view in a list.</p>`;
					buf += `<p>Use <code>/ht text [username]</code> to view an individual user's ticket instead.</p>`;
					return buf;
				}
				buf += `<p class="message-error">Please specify a valid ticket type.</p>`;
				buf += `<p>Valid mass-view ticket types:</p>`;
				buf += keys.map(k => `<a class="button" href="/view-help-list-${k}" target="replace">${k}</a>`).join(' | ');
				return buf;
			}
			this.title += ` ${type}`;
			buf += `<h2>Help Tickets (${ticketTitles[type]})</h2><hr />`;
			let count = 0;
			for (const k in tickets) {
				const ticket = tickets[k];
				const typeId = HelpTicket.getTypeId(ticket.type);
				if (!ticket.resolved && ticket.text && typeId === type) {
					count++;
					buf += `<strong>Reporter:</strong> ${ticket.userid}`;
					buf += await textTickets[typeId].getReviewDisplay(
						ticket as TicketState & { text: [string, string] },
						user,
						this.connection,
						{ list: true }
					);
					buf += `<form data-submitsend="/helpticket resolve ${ticket.userid},{text} spoiler:{private}">`;
					buf += `<br /><strong>Resolve:</strong><br />`;
					buf += `Respond to reporter: <textarea style="width: 100%" name="text" autocomplete="on"></textarea><br />`;
					buf += `Staff notes (optional): <textarea style="width: 100%" name="private"></textarea><br />`;
					buf += `<br /><button class="button notifying" type="submit">Resolve ticket</button></form>`;
					buf += `<hr />`;
				}
			}
			if (!count) {
				buf += `<p class="message-error">No active tickets of the type '${ticketTitles[type]}' were found.</p>`;
				return buf;
			}
			return buf;
		},
		tickets(query, user, connection) {
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			this.title = this.tr`Ticket List`;
			this.checkCan('lock');
			let buf = `<div class="pad ladder"><button class="button" name="send" value="/helpticket list" style="float:left"><i class="fa fa-refresh"></i> ${this.tr`Refresh`}</button> <button class="button" name="send" value="/helpticket stats" style="float: right"><i class="fa fa-th-list"></i> ${this.tr`Help Ticket Stats`}</button><br /><br />`;
			buf += `<table style="margin-left: auto; margin-right: auto"><tbody><tr><th colspan="5"><h2 style="margin: 5px auto">${this.tr`Help tickets`}</h1></th></tr>`;
			buf += `<tr><th>${this.tr`Status`}</th><th>${this.tr`Creator`}</th><th>${this.tr`Ticket Type`}</th><th>${this.tr`Claimed by`}</th><th>${this.tr`Action`}</th></tr>`;

			const sortedTickets = HelpTicket.list(ticket => [
				ticket.open,
				ticket.open ? [ticket.active, ticket.created] : -ticket.created,
			]);
			let count = 0;
			for (const ticket of sortedTickets) {
				if (count >= 100 && query[0] !== 'all') {
					buf += `<tr><td colspan="5">${this.tr`And ${sortedTickets.length - count} more tickets.`} <a class="button" href="/view-help-tickets-all" target="replace">${this.tr`View all tickets`}</a></td></tr>`;
					break;
				}
				let icon = `<span style="color:gray"><i class="fa fa-check-circle-o"></i> ${this.tr`Closed`}</span>`;
				if (ticket.open) {
					if (!ticket.active && !ticket.text) {
						icon = `<span style="color:gray"><i class="fa fa-circle-o"></i> ${this.tr`Inactive`}</span>`;
					} else if (ticket.claimed) {
						icon = `<span style="color:green"><i class="fa fa-circle-o"></i> ${this.tr`Claimed`}</span>`;
					} else {
						icon = `<span style="color:orange"><i class="fa fa-circle-o"></i> <strong>${this.tr`Unclaimed`}</strong></span>`;
					}
				}

				buf += `<tr><td>${icon}</td>`;
				buf += `<td>${Utils.escapeHTML(ticket.creator)}</td>`;
				buf += `<td>${ticket.type}</td>`;
				buf += Utils.html`<td>${ticket.claimed ? ticket.claimed : `-`}</td>`;
				buf += `<td>`;
				const roomid = 'help-' + ticket.userid;
				let logUrl = '';
				const created = new Date(ticket.created);
				if (ticket.text) {
					logUrl = `/view-help-logs-${ticket.userid}--${Chat.toTimestamp(created).split(' ')[0].slice(0, -3)}`;
				} else {
					logUrl = `/view-chatlog-help-${ticket.userid}--${Chat.toTimestamp(created).split(' ')[0]}`;
				}
				const room = Rooms.get(roomid);
				if (ticket.text) {
					let title = Object.entries(ticket.notes || {})
						.map(([userid, note]) => Utils.html`${note} (by ${userid})`)
						.join('&#10;');
					if (title) {
						title = `title="Staff notes:&#10;${title}"`;
					}
					buf += `<a class="button" ${title} href="/view-help-text-${ticket.userid}">${ticket.claimed ? `Claim` : `View`}</a>`;
				} else if (room) {
					const ticketGame = room.getGame(HelpTicket)!;
					buf += `<a href="/${roomid}"><button class="button" ${ticketGame.getPreview()}>${this.tr(!ticket.claimed && ticket.open ? 'Claim' : 'View')}</button></a> `;
				}
				if (logUrl) {
					buf += `<a href="${logUrl}"><button class="button">${this.tr`Log`}</button></a>`;
				}
				buf += '</td></tr>';
				count++;
			}
			buf += `</div></table><div class="ladder pad">`;
			buf += `<table style="margin-left: auto; margin-right: auto"><tbody>`;
			buf += `<tr><th colspan="5"><h2 style="margin: 5px auto">${this.tr`Ticket Bans`}<i class="fa fa-ban"></i></h2></th></tr>`;
			buf += `<tr><th>Userids</th><th>IPs</th><th>Expires</th><th>Reason</th></tr>`;
			const ticketBans = Utils.sortBy(
				[...Punishments.getPunishments()].filter(([id, entry]) => entry.punishType === 'TICKETBAN'),
				([id, entry]) => entry.expireTime
			);
			for (const [userid, entry] of ticketBans) {
				let ids = [userid];
				if (entry.userids) ids = ids.concat(entry.userids);
				buf += `<tr><td>${ids.map(Utils.escapeHTML).join(', ')}</td>`;
				buf += `<td>${entry.ips.join(', ')}</td>`;
				buf += `<td>${Chat.toDurationString(entry.expireTime - Date.now(), { precision: 1 })}</td>`;
				buf += `<td>${entry.reason || ''}</td></tr>`;
			}
			buf += `</tbody></table></div>`;
			return buf;
		},
		async text(query, user, connection) {
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			this.title = this.tr`Queued Tickets`;
			this.checkCan('lock');
			const userid = query.shift();
			if (!userid) {
				return this.errorReply(`Specify a userid to view the ticket for.`);
			}
			const ticket = tickets[toID(userid)];
			if (!ticket) {
				return this.errorReply(`Ticket not found.`);
			}
			if (!ticket.text) {
				return this.errorReply(`That is either not a text ticket, or it has not yet been submitted.`);
			}
			const ticketInfo = textTickets[HelpTicket.getTypeId(ticket.type)];
			this.title = `[Text Ticket] ${ticket.userid}`;
			let buf = `<div class="pad">`;
			buf += `<button class="button" name="send" value="/join ${this.pageid}" style="float:right"><i class="fa fa-refresh"></i> ${this.tr`Refresh`}</button>`;
			buf += `<h2>Issue: ${ticket.type}</h2>`;
			if (!ticket.claimed && ticket.open) {
				ticket.claimed = user.id;
				if (!ticket.state) ticket.state = {};
				ticket.state.claimTime = Date.now();
				writeTickets();
				notifyStaff();
				Chat.refreshPageFor(`help-text-${ticket.userid}`, 'staff', false, [user.id]);
			} else if (ticket.claimed) {
				buf += `<strong>Claimed:</strong> ${ticket.claimed}<br /><br />`;
			}
			buf += `<strong>From: <a href="https://${Config.routes.root}/users/${ticket.userid}">`;
			buf += `${ticket.userid}</a></strong>`;
			buf += `  <button class="button" name="send" value="/msgroom staff,/ht ban ${ticket.userid}">Ticketban</button> | `;
			buf += `<button class="button" name="send" value="/modlog room=global,user='${ticket.userid}'">Global Modlog</button><br />`;
			buf += await ticketInfo.getReviewDisplay(ticket as TicketState & { text: [string, string] }, user, connection);
			buf += `<br />`;
			buf += `<div class="infobox">`;
			const [text, context] = ticket.text;
			buf += `<p><strong>Report text:</strong></p><hr />`;
			buf += Chat.formatText(text);
			if (context) {
				buf += `<br /><hr /><strong>Context given: </strong><br />${context}`;
			}
			buf += `</div>`;

			if (ticket.notes) {
				buf += `<br /><div class="infobox">`;
				buf += `<details class="readmore"><summary>Hover notes:</summary>`;
				for (const staff in ticket.notes) {
					buf += Utils.html`<p>${ticket.notes[staff]} (by ${staff})</p>`;
				}
				buf += `<br /><form data-submitsend="/ht addnote ${ticket.userid},{note}&#10;/j view-help-text-${ticket.userid}">`;
				buf += `Add note: <input name="note" /> <button type="submit" class="button">Submit</button>`;
				buf += `</form>`;
				buf += `</details></div>`;
			} else {
				buf += `<br /><div class="infobox">`;
				buf += `<form data-submitsend="/ht note ${ticket.userid},{note}&#10;/j view-help-text-${ticket.userid}">`;
				buf += `Add note: <input name="note" /> <button type="submit" class="button">Submit</button>`;
				buf += `</form></div>`;
			}

			if (!ticket.resolved) {
				const typeId = HelpTicket.getTypeId(ticket.type);
				const responses = settings.responses[typeId];
				if (Object.keys(responses || {}).length) {
					buf += `<br /><div class="infobox">`;
					buf += `<details class="readmore"><summary><strong>Responses</strong></summary>`;
					const responseKeys = Object.keys(responses);
					for (const [i, name] of responseKeys.entries()) {
						buf += `<button class="button" name="send" value="/helpticket resolve ${ticket.userid},${responses[name]}">${name}</button>`;
						if (responseKeys[i + 1]) buf += `<br />`;
					}
					buf += `</details></div><br />`;
				}
				buf += `<form data-submitsend="/helpticket resolve ${ticket.userid},{text} spoiler:{private}">`;
				buf += `<br /><strong>Resolve:</strong><br />`;
				buf += `Respond to reporter: <textarea style="width: 100%" name="text" autocomplete="on"></textarea><br />`;
				buf += `Staff notes (optional): <textarea style="width: 100%" name="private"></textarea><br />`;
				buf += `<br /><button class="button notifying" type="submit">Resolve ticket</button></form>`;
			} else {
				buf += Utils.html`<strong>Resolved: by ${ticket.resolved.by}</strong><br />`;
				buf += Utils.html`<strong>Result:</strong> ${Chat.collapseLineBreaksHTML(ticket.resolved.result)}<br />`;
				if (ticket.resolved.staffReason.includes('PROOF')) { // a note was added, show it
					buf += Utils.html`<strong>Resolver notes:</strong> ${Chat.collapseLineBreaksHTML(ticket.resolved.staffReason)}<br />`;
				}
			}
			return buf;
		},
		async logs(query, user, connection) {
			this.checkCan('lock');
			const args = query.join('-').split('--');
			const userid = toID(args.shift());
			if (!userid) return this.errorReply(`Specify a userid to view ticket logs for.`);
			const date = args.shift();
			if (date) {
				const parsed = new Date(date);
				if (!/[0-9]{4}-[0-9]{2}/.test(date) || isNaN(parsed.getTime())) {
					return this.errorReply(`Invalid date.`);
				}
			}
			const logs = await HelpTicket.getTextLogs(['userid', userid], date);
			this.title = `[Ticket Logs] ${userid}${date ? ` (${date})` : ''}`;
			let buf = `<div class="pad"><h2>Ticket logs for ${userid}${date ? ` in the month of ${date}` : ''}</h2>`;
			buf += `<button class="button" name="send" value="/join ${this.pageid}"><i class="fa fa-refresh"></i> ${this.tr`Refresh`}</button>`;
			buf += `<hr />`;

			if (!logs.length) {
				buf += `<div class="message-error">None found.</div>`;
				return buf;
			}
			const stringifyDate = (num: number) => {
				const dateStrings = Chat.toTimestamp(new Date(num), { human: true }).split(' ');
				return { day: dateStrings[0], time: dateStrings[1] };
			};

			Utils.sortBy(logs, log => -log.resolved.time);

			for (const ticket of logs) {
				buf += `<details class="readmore"><summary>`;
				const curDate = stringifyDate(ticket.created);
				buf += `<strong>${ticket.type} - ${curDate.day} (${curDate.time})</strong></summary>`;
				const ticketInfo = textTickets[HelpTicket.getTypeId(ticket.type)];
				this.title = `[Text Ticket] ${ticket.userid}`;
				buf += `<h2>Issue: ${ticket.type}</h2>`;
				buf += `<strong>From: ${ticket.userid}</strong>`;
				buf += `  <button class="button" name="send" value="/msgroom staff,/ht ban ${ticket.userid}">Ticketban</button> | `;
				buf += `<button class="button" name="send" value="/modlog room=global,user='${ticket.userid}'">Global Modlog</button><br />`;
				if (ticket.claimed) {
					buf += `<br /><strong>Claimed:</strong> ${ticket.claimed}<br />`;
				}
				buf += await ticketInfo.getReviewDisplay(
					ticket as TicketState & { text: [string, string] },
					user,
					connection,
					ticket.state
				);
				buf += `<br />`;
				buf += `<div class="infobox">`;
				const [text, context] = ticket.text;
				buf += `<p><strong>Report text:</strong></p><hr />`;
				buf += Chat.formatText(text);
				if (context) {
					buf += `<br /><hr /><strong>Context given: </strong><br />`;
					// gotta account for the cases where we didn't escape html in context on submit
					// If it includes <br />, it has been escaped and has several lines.
					// If we can strip raw html out of it, it should be escaped.
					// Otherwise, let it be.
					const noEscape = !context.includes('<br />') ? Chat.stripHTML(context) !== context : false;
					buf += noEscape ? Chat.formatText(context) : context;
				}
				buf += `</div>`;
				buf += Utils.html`<strong>Resolved: by ${ticket.resolved.by}</strong><br />`;
				buf += Utils.html`<strong>Result:</strong> ${Chat.collapseLineBreaksHTML(ticket.resolved.result)}<br />`;
				if (ticket.resolved.staffReason.includes('PROOF')) { // a note was added, show it
					buf += Utils.html`<strong>Resolver notes:</strong> ${Chat.collapseLineBreaksHTML(ticket.resolved.staffReason)}<br />`;
				}
				buf += `</details><hr />`;
			}
			return buf;
		},
		stats(query, user, connection) {
			// view-help-stats-TABLE-YYYY-MM-COL
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			this.title = this.tr`Ticket Stats`;
			this.checkCan('lock');

			let [table, yearString, monthString, col] = query;
			if (!['staff', 'tickets'].includes(table)) table = 'tickets';
			const year = parseInt(yearString);
			const month = parseInt(monthString) - 1;
			let date = null;
			if (isNaN(year) || isNaN(month) || month < 0 || month > 11 || year < 2010) {
				// year/month not provided or is invalid, use current date
				date = new Date();
			} else {
				date = new Date(year, month);
			}
			const dateUrl = Chat.toTimestamp(date).split(' ')[0].split('-', 2).join('-');

			const rawTicketStats = Monitor.logPath(`tickets/${dateUrl}.tsv`).readIfExistsSync();
			if (!rawTicketStats) return `<div class="pad"><br />${this.tr`No ticket stats found.`}</div>`;

			// Calculate next/previous month for stats and validate stats exist for the month

			// date.getMonth() returns 0-11, we need 1-12 +/-1 for this
			const prevDate = new Date(
				date.getMonth() === 0 ?
					date.getFullYear() - 1 :
					date.getFullYear(),
				date.getMonth() === 0 ?
					11 :
					date.getMonth() - 1
			);
			const nextDate = new Date(
				date.getMonth() === 11 ?
					date.getFullYear() + 1 :
					date.getFullYear(),
				date.getMonth() === 11 ?
					0 :
					date.getMonth() + 1
			);
			const prevString = Chat.toTimestamp(prevDate).split(' ')[0].split('-', 2).join('-');
			const nextString = Chat.toTimestamp(nextDate).split(' ')[0].split('-', 2).join('-');

			let buttonBar = '';
			if (Monitor.logPath(`tickets/${prevString}.tsv`).readIfExistsSync()) {
				buttonBar += `<a class="button" href="/view-help-stats-${table}-${prevString}" target="replace" style="float: left">&lt; ${this.tr`Previous Month`}</a>`;
			} else {
				buttonBar += `<a class="button disabled" style="float: left">&lt; ${this.tr`Previous Month`}</a>`;
			}
			buttonBar += `<a class="button${table === 'tickets' ? ' disabled"' : `" href="/view-help-stats-tickets-${dateUrl}" target="replace"`}>${this.tr`Ticket Stats`}</a> <a class="button ${table === 'staff' ? ' disabled"' : `" href="/view-help-stats-staff-${dateUrl}" target="replace"`}>${this.tr`Staff Stats`}</a>`;
			if (Monitor.logPath(`tickets/${nextString}.tsv`).readIfExistsSync()) {
				buttonBar += `<a class="button" href="/view-help-stats-${table}-${nextString}" target="replace" style="float: right">${this.tr`Next Month`} &gt;</a>`;
			} else {
				buttonBar += `<a class="button disabled" style="float: right">${this.tr`Next Month`} &gt;</a>`;
			}

			let buf = `<div class="pad ladder"><div style="text-align: center">${buttonBar}</div><br />`;
			buf += `<table style="margin-left: auto; margin-right: auto"><tbody><tr><th colspan="${table === 'tickets' ? 7 : 3}"><h2 style="margin: 5px auto">${this.tr`Help Ticket Stats`} - ${date.toLocaleString('en-us', { month: 'long', year: 'numeric' })}</h1></th></tr>`;
			if (table === 'tickets') {
				if (!['type', 'totaltickets', 'total', 'initwait', 'wait', 'resolution', 'result'].includes(col)) col = 'type';
				buf += `<tr><th><Button>type</Button></th><th><Button>totaltickets</Button></th><th><Button>total</Button></th><th><Button>initwait</Button></th><th><Button>wait</Button></th><th><Button>resolution</Button></th><th><Button>result</Button></th></tr>`;
			} else {
				if (!['staff', 'num', 'time'].includes(col)) col = 'num';
				buf += `<tr><th><Button>staff</Button></th><th><Button>num</Button></th><th><Button>time</Button></th></tr>`;
			}

			const ticketStats: { [k: string]: string }[] = rawTicketStats.split('\n').filter(
				(line: string) => line
			).map(
				(line: string) => {
					const splitLine = line.split('\t');
					return {
						type: splitLine[0],
						total: splitLine[1],
						initwait: splitLine[2],
						wait: splitLine[3],
						resolution: splitLine[4],
						result: splitLine[5],
						staff: splitLine[6],
					};
				}
			);
			if (table === 'tickets') {
				const typeStats: { [key: string]: { [key: string]: number } } = {};
				for (const stats of ticketStats) {
					if (!typeStats[stats.type]) {
						typeStats[stats.type] = {
							total: 0,
							initwait: 0,
							wait: 0,
							dead: 0,
							unresolved: 0,
							resolved: 0,
							result: 0,
							totaltickets: 0,
						};
					}
					const type = typeStats[stats.type];
					type.totaltickets++;
					type.total += parseInt(stats.total);
					type.initwait += parseInt(stats.initwait);
					type.wait += parseInt(stats.wait);
					if (['approved', 'valid', 'assisted'].includes(stats.result.toString())) type.result++;
					if (['dead', 'unresolved', 'resolved'].includes(stats.resolution.toString())) {
						type[stats.resolution.toString()]++;
					}
				}

				// Calculate averages/percentages
				for (const t in typeStats) {
					const type = typeStats[t];
					// Averages
					for (const key of ['total', 'initwait', 'wait']) {
						type[key] = Math.round(type[key] / type.totaltickets);
					}
					// Percentages
					for (const key of ['result', 'dead', 'unresolved', 'resolved']) {
						type[key] = Math.round((type[key] / type.totaltickets) * 100);
					}
				}

				const sortedStats = Utils.sortBy(Object.keys(typeStats), t => {
					if (col === 'type') {
						// Alphabetize strings
						return t;
					} else if (col === 'resolution') {
						return -(typeStats[t].resolved || 0);
					}
					return -typeStats[t][col];
				});

				for (const type of sortedStats) {
					const resolution = `${this.tr`Resolved`}: ${typeStats[type].resolved}%<br/>${this.tr`Unresolved`}: ${typeStats[type].unresolved}%<br/>${this.tr`Dead`}: ${typeStats[type].dead}%`;
					buf += `<tr><td>${type}</td><td>${typeStats[type].totaltickets}</td><td>${Chat.toDurationString(typeStats[type].total, { hhmmss: true })}</td><td>${Chat.toDurationString(typeStats[type].initwait, { hhmmss: true }) || '-'}</td><td>${Chat.toDurationString(typeStats[type].wait, { hhmmss: true }) || '-'}</td><td>${resolution}</td><td>${typeStats[type].result}%</td></tr>`;
				}
			} else {
				const staffStats: { [key: string]: { [key: string]: number } } = {};
				for (const stats of ticketStats) {
					const staffArray = (typeof stats.staff === 'string' ? stats.staff.split(',') : []);
					for (const staff of staffArray) {
						if (!staff) continue;
						if (!staffStats[staff]) staffStats[staff] = { num: 0, time: 0 };
						staffStats[staff].num++;
						staffStats[staff].time += (parseInt(stats.total) - parseInt(stats.initwait));
					}
				}
				for (const staff in staffStats) {
					staffStats[staff].time = Math.round(staffStats[staff].time / staffStats[staff].num);
				}
				const sortedStaff = Utils.sortBy(Object.keys(staffStats), staff => {
					if (col === 'staff') {
						// Alphabetize strings
						return staff;
					}
					return -staffStats[staff][col];
				});
				for (const staff of sortedStaff) {
					buf += `<tr><td>${staff}</td><td>${staffStats[staff].num}</td><td>${Chat.toDurationString(staffStats[staff].time, { precision: 1 })}</td></tr>`;
				}
			}
			buf += `</tbody></table></div>`;
			const headerTitles: { [id: string]: string } = {
				type: 'Type',
				totaltickets: 'Total Tickets',
				total: 'Average Total Time',
				initwait: 'Average Initial Wait',
				wait: 'Average Total Wait',
				resolution: 'Resolutions',
				result: 'Positive Result',
				staff: 'Staff ID',
				num: 'Number of Tickets',
				time: 'Average Time Per Ticket',
			};
			buf = buf.replace(/<Button>([a-z]+)<\/Button>/g, (match, id) => {
				if (col === id) return this.tr(headerTitles[id]);
				return `<a class="button" href="/view-help-stats-${table}-${dateUrl}-${id}" target="replace">${this.tr(headerTitles[id])}</a>`;
			});
			return buf;
		},
	},
};

export const commands: Chat.ChatCommands = {
	report(target, room, user) {
		if (!this.runBroadcast()) return;
		const meta = this.pmTarget ? `-user-${this.pmTarget.id}` : this.room ? `-room-${this.room.roomid}` : '';
		if (this.broadcasting) {
			return this.sendReplyBox(`<button name="joinRoom" value="view-help-request--report${meta}" class="button"><strong>${this.tr`Report someone`}</strong></button>`);
		}

		return this.parse(`/join view-help-request--report${meta}`);
	},

	appeal(target, room, user) {
		if (!this.runBroadcast()) return;
		const meta = this.pmTarget ? `-user-${this.pmTarget.id}` : this.room ? `-room-${this.room.roomid}` : '';
		if (this.broadcasting) {
			return this.sendReplyBox(`<button name="joinRoom" value="view-help-request--appeal${meta}" class="button"><strong>${this.tr`Appeal a punishment`}</strong></button>`);
		}

		return this.parse(`/join view-help-request--appeal${meta}`);
	},

	requesthelp: 'helpticket',
	helprequest: 'helpticket',
	ht: 'helpticket',
	helpticket: {
		'': 'create',
		create(target, room, user) {
			if (!this.runBroadcast()) return;
			const meta = this.pmTarget ? `-user-${this.pmTarget.id}` : this.room ? `-room-${this.room.roomid}` : '';
			if (this.broadcasting) {
				return this.sendReplyBox(`<button name="joinRoom" value="view-help-request${meta}" class="button"><strong>${this.tr`Request help`}</strong></button>`);
			}
			if (user.can('lock')) {
				return this.parse('/join view-help-request'); // Globals automatically get the form for reference.
			}
			if (!user.named) return this.errorReply(this.tr`You need to choose a username before doing this.`);
			return this.parse(`/join view-help-request${meta}`);
		},
		createhelp: [`/helpticket create - Creates a new ticket requesting help from global staff.`],

		submittext: 'submit',
		async submit(target, room, user, connection, cmd) {
			if (user.can('lock') && !user.can('bypassall')) {
				return this.popupReply(this.tr`Global staff can't make tickets. They can only use the form for reference.`);
			}
			if (!user.named) return this.popupReply(this.tr`You need to choose a username before doing this.`);
			const ticketBan = Punishments.isTicketBanned(user);
			if (ticketBan) {
				return this.popupReply(HelpTicket.getBanMessage(user.id, ticketBan));
			}
			let ticket = tickets[user.id];
			const ipTicket = checkIp(user.latestIp);
			if (ticket?.open || ipTicket) {
				if (!ticket && ipTicket) ticket = ipTicket;
				if (ticket.text) {
					return this.popupReply(`You already have a pending ticket, please wait.`);
				}
				const helpRoom = Rooms.get(`help-${ticket.userid}`);
				if (!helpRoom) {
					ticket.open = false;
					return;
				}
				helpRoom.auth.set(user.id, '+');
				this.popupReply(`You already have a pending ticket, please wait.`);
				return this.parse(`/join help-${ticket.userid}`);
			}
			if (Monitor.countTickets(user.latestIp)) {
				const maxTickets = Punishments.isSharedIp(user.latestIp) ? `50` : `5`;
				return this.popupReply(this.tr`Due to high load, you are limited to creating ${maxTickets} tickets every hour.`);
			}
			let [
				ticketType, reportTargetType, reportTarget, text, contextString,
			] = Utils.splitFirst(target, '|', 4).map(s => s.trim());
			reportTarget = Utils.escapeHTML(reportTarget);
			if (!Object.values(ticketTitles).includes(ticketType)) return this.parse('/helpticket');
			const contexts: { [k: string]: string } = {
				'PM Harassment': `Hi! Who was harassing you in private messages?`,
				'Battle Harassment': `Hi! Who was harassing you, and in which battle did it happen? Please post a link to the battle or a replay of the battle.`,
				'Inappropriate Username': `Hi! Tell us the username that is inappropriate.`,
				'Inappropriate Pokemon Nicknames': `Hi! Which user has Pokemon with inappropriate nicknames, and in which battle? Please post a link to the battle or a replay of the battle.`,
				Appeal: `Hi! Can you please explain why you feel your punishment is undeserved?`,
				'IP-Appeal': `Hi! How are you connecting to Showdown right now? At home, at school, on a phone using mobile data, or some other way?`,
				'Public Room Assistance Request': `Hi! Which room(s) do you need us to help you watch?`,
				Other: `Hi! What seems to be the problem? Tell us about any people involved,` +
					` and if this happened in a specific place on the site.`,
			};
			const staffContexts: { [k: string]: string } = {
				'IP-Appeal': `<p><strong>${user.name}'s IP Addresses</strong>: ${user.ips.map(ip => `<a href="https://whatismyipaddress.com/ip/${ip}" target="_blank">${ip}</a>`).join(', ')}</p>`,
			};
			ticket = {
				creator: user.name,
				userid: user.id,
				open: true,
				active: !contexts[ticketType],
				type: ticketType,
				created: Date.now(),
				claimed: null,
				ip: user.latestIp,
			};

			if (toID(reportTarget)) {
				ticket.meta = `${reportTargetType}-${reportTarget}`;
			}
			const typeId = HelpTicket.getTypeId(ticketType);
			const textTicket = textTickets[typeId];
			if (textTicket) {
				let pageId = '';
				for (const page of connection.openPages || new Set()) {
					if (page.includes('confirm' + typeId)) {
						pageId = page;
					}
				}
				if (!toID(text)) {
					this.parse(`/join view-${pageId}`);
					return this.popupReply(`Please tell us what is happening.`);
				}
				text = text.replace(/\n/ig, ' ');
				contextString = contextString.split('\n').map(t => Chat.formatText(t)).join('<br />');
				if (text.length > 8192) {
					return this.popupReply(`Your report is too long. Please use fewer words.`);
				}
				const validation = await textTicket.checker?.(text, contextString || '', ticket.type, user, reportTarget);
				if (Array.isArray(validation) && validation.length) {
					this.parse(`/join view-${pageId}`);
					return this.popupReply(`|html|` + validation.join('<br />'));
				}
				ticket.text = [text, contextString];
				ticket.active = true;
				Chat.runHandlers('onTicketCreate', ticket, user);
				// eslint-disable-next-line require-atomic-updates
				tickets[user.id] = ticket;
				await HelpTicket.modlog({
					action: 'TEXTTICKET OPEN',
					loggedBy: user.id,
					note: `(${ticket.type}) ${text.replace(/<br \/>/ig, ' | ')}${contextString ? `, context: ${contextString}` : ''}`,
				});
				writeTickets();
				notifyStaff();
				void textTicket.onSubmit?.(ticket, [text, contextString], this.user, this.connection);
				void runPunishments(ticket as TicketState & { text: [string, string] }, typeId);
				if (textTicket.getState) {
					ticket.state = textTicket.getState(ticket, user);
				}

				connection.send(`>view-${pageId}\n|deinit`);
				Chat.refreshPageFor(`help-list-${HelpTicket.getTypeId(ticket.type)}`, 'staff');
				return this.popupReply(`Your report has been submitted.`);
			}

			let closeButtons = ``;
			switch (ticket.type) {
			case 'Appeal':
			case 'IP-Appeal':
				closeButtons = `<button class="button" style="margin: 5px 0" name="send" value="/helpticket close ${user.id}">Close Ticket as Appeal Granted</button> <button class="button" style="margin: 5px 0" name="send" value="/helpticket close ${user.id}, false">Close Ticket as Appeal Denied</button>`;
				break;
			case 'PM Harassment':
			case 'Battle Harassment':
			case 'Inappropriate Pokemon Nicknames':
			case 'Inappropriate Username':
				closeButtons = `<button class="button" style="margin: 5px 0" name="send" value="/helpticket close ${user.id}">Close Ticket as Valid Report</button> <button class="button" style="margin: 5px 0" name="send" value="/helpticket close ${user.id}, false">Close Ticket as Invalid Report</button>`;
				break;
			case 'Public Room Assistance Request':
			case 'Other':
			default:
				closeButtons = `<button class="button" style="margin: 5px 0" name="send" value="/helpticket close ${user.id}">Close Ticket as Assisted</button> <button class="button" style="margin: 5px 0" name="send" value="/helpticket close ${user.id}, false">Close Ticket as Unable to Assist</button>`;
			}
			let staffIntroButtons = '';
			let pmRequestButton = '';
			if (reportTargetType === 'user' && reportTarget) {
				switch (ticket.type) {
				case 'PM Harassment':
					if (!Config.pmLogButton) break;
					pmRequestButton = Config.pmLogButton(user.id, toID(reportTarget));
					contexts['PM Harassment'] = this.tr`Hi! Please click the button below to give global staff permission to check PMs.` +
						this.tr` Or if ${reportTarget} is not the user you want to report, please tell us the name of the user who you want to report.`;
					break;
				case 'Inappropriate Username':
					staffIntroButtons = Utils.html`<button class="button" name="send" value="/forcerename ${reportTarget}">Force-rename ${reportTarget}</button> `;
					break;
				}
				staffIntroButtons += Utils.html`<button class="button" name="send" value="/modlog room=global, user='${reportTarget}'">Global Modlog for ${reportTarget}</button> <button class="button" name="send" value="/sharedbattles ${user.id}, ${toID(reportTarget)}">Shared battles</button> `;
			}
			if (ticket.type === 'Appeal') {
				staffIntroButtons += Utils.html`<button class="button" name="send" value="/modlog room=global, user='${user.name}'">Global Modlog for ${user.name}</button>`;
			}
			const introMsg = Utils.html`<h2 style="margin:0">${this.tr`Help Ticket`} - ${user.name}</h2>` +
				`<p><b>${this.tr`Issue`}</b>: ${ticket.type}<br />${this.tr`A Global Staff member will be with you shortly.`}</p>`;
			const staffMessage = [
				`<p>${closeButtons} <details><summary class="button">More Options</summary> ${staffIntroButtons}`,
				`<button class="button" name="send" value="/modlog room=global, user='${ticket.userid}'"><small>Global Modlog for ${ticket.creator}</small></button>`,
				`<button class="button" name="send" value="/helpticket ban ${user.id}"><small>Ticketban</small></button>`,
				`<button class="button" name="send" value="/am edithistory ${ticket.userid}"><small>Artemis History for ${ticket.creator}</small></button></p></details>`,
			].join('<br />');
			const staffHint = staffContexts[ticketType] || '';
			let reportTargetInfo = '';
			if (reportTargetType === 'room') {
				reportTargetInfo = `Reported in room: <a href="/${reportTarget}">${reportTarget}</a>`;
				const reportRoom = Rooms.get(reportTarget) as GameRoom | undefined;
				void reportRoom?.uploadReplay?.(user, connection, 'forpunishment');
			} else if (reportTargetType === 'user') {
				reportTargetInfo = `Reported user: <strong class="username">${reportTarget}</strong><p></p>`;

				const targetID = toID(reportTarget);
				if (targetID !== ticket.userid) {
					const commonBattles = getCommonBattles(
						targetID, Users.get(reportTarget),
						ticket.userid, Users.get(ticket.userid),
						this.connection
					);

					if (!commonBattles.length) {
						reportTargetInfo += Utils.html`There are no common battles between '${reportTarget}' and '${ticket.creator}'.`;
					} else {
						reportTargetInfo += Utils.html`Showing ${commonBattles.length} common battle(s) between '${reportTarget}' and '${ticket.creator}': `;
						reportTargetInfo += commonBattles.map(
							roomid => Utils.html`<a href=/${roomid}>${roomid.replace(/^battle-/, '')}`
						).join(', ');
					}
				}
			}
			let helpRoom = Rooms.get(`help-${user.id}`) as ChatRoom | null;
			if (!helpRoom) {
				helpRoom = Rooms.createChatRoom(`help-${user.id}` as RoomID, `[H] ${user.name}`, {
					isPersonal: true,
					isHelp: true,
					isPrivate: 'hidden',
					modjoin: '%',
					auth: { [user.id]: '+' },
					introMessage: introMsg,
					staffMessage: staffMessage + staffHint + reportTargetInfo,
				});
				helpRoom.game = new HelpTicket(helpRoom, ticket);
			} else {
				helpRoom.pokeExpireTimer();
				helpRoom.settings.introMessage = introMsg;
				helpRoom.settings.staffMessage = staffMessage + staffHint + reportTargetInfo;
				if (helpRoom.game) helpRoom.game.destroy();
				helpRoom.game = new HelpTicket(helpRoom, ticket);
			}
			const ticketGame = helpRoom.getGame(HelpTicket)!;
			Chat.runHandlers('onTicketCreate', ticket, user);
			helpRoom.modlog({ action: 'TICKETOPEN', isGlobal: false, loggedBy: user.id, note: ticket.type });
			ticketGame.addText(`${user.name} opened a new ticket. Issue: ${ticket.type}`, user);
			void this.parse(`/join help-${user.id}`);
			if (!(user.id in ticketGame.playerTable)) {
				// User was already in the room, manually add them to the "game" so they get a popup if they try to leave
				ticketGame.addPlayer(user);
			}
			let context = contexts[ticket.type];
			switch (ticket.type) {
			case 'IP-Appeal':
				if (user.locked === '#hostfilter') {
					context += ` (Have you looked at https://${Config.routes.root}/pages/proxyhelp?)`;
				}
				break;
			}
			if (context) {
				helpRoom.add(`|c|~Staff|${this.tr(context)}`);
				helpRoom.update();
			}
			if (pmRequestButton) {
				helpRoom.add(pmRequestButton);
				helpRoom.update();
			}
			tickets[user.id] = ticket;
			writeTickets();
			notifyStaff();
			connection.send(`>view-help-request\n|deinit`);
		},

		text(target, room, user) {
			this.checkCan('lock');
			return this.parse(`/join view-help-text-${toID(target)}`);
		},

		async resolve(target, room, user) {
			this.checkCan('lock');
			const [ticketerName, result] = Utils.splitFirst(target, ',').map(i => i.trim());
			const ticketId = toID(ticketerName);
			if (!ticketId || !result) {
				return this.parse(`/help helpticket`);
			}
			const ticket = tickets[ticketId];
			if (!ticket) return this.popupReply(`That ticket was not found.`);
			if (ticket.resolved) {
				return this.popupReply(`That ticket has already been resolved.`);
			}
			if (!ticket.text) {
				return this.popupReply(`That ticket cannot be resolved with /helpticket resolve. Join it instead.`);
			}
			const { publicReason, privateReason } = this.parseSpoiler(result);
			ticket.resolved = {
				result: publicReason,
				time: Date.now(),
				by: user.name,
				seen: false,
				staffReason: privateReason,
			};
			ticket.open = false;
			writeTickets();
			const tarUser = Users.get(ticketId);
			if (tarUser) {
				HelpTicket.notifyResolved(tarUser, ticket, ticketId);
			}
			// ticketType\ttotalTime\ttimeToFirstClaim\tinactiveTime\tresolution\tresult\tstaff,userids,seperated,with,commas
			writeStats(`${ticket.type}\t${Date.now() - ticket.created}\t0\t0\tresolved\tvalid\t${user.id}`);
			this.popupReply(`You resolved ${ticketId}'s ticket.`);
			await HelpTicket.modlog({
				action: 'TEXTTICKET CLOSE',
				loggedBy: user.id,
				note: privateReason,
				userid: ticketId,
			});
			HelpTicket.logTextResult(ticket as TicketState & { text: [string, string], resolved: ResolvedTicketInfo });
			notifyStaff();
			// force a refresh for everyone in it, otherwise we potentially get two punishments at once
			// from different people clicking at the same time and reading it separately.
			// Yes. This was a real issue.
			Chat.refreshPageFor(`help-text-${ticketId}`, 'staff');
			Chat.refreshPageFor(`help-list-${HelpTicket.getTypeId(ticket.type)}`, 'staff');
		},

		list(target, room, user) {
			this.checkCan('lock');
			return this.parse('/join view-help-tickets');
		},
		listhelp: [`/helpticket list - Lists all tickets. Requires: % @ ~`],

		inapnames: 'massview',
		usernames: 'massview',
		massview(target, room, user) {
			this.checkCan('lock');
			target = toID(target);
			switch (this.cmd) {
			case 'inapnames': case 'usernames':
				target = 'inapname';
				break;
			}
			return this.parse(`/j view-help-list${target ? `-${target}` : ""}`);
		},

		stats(target, room, user) {
			this.checkCan('lock');
			return this.parse('/join view-help-stats');
		},
		statshelp: [`/helpticket stats - List the stats for help tickets. Requires: % @ ~`],

		note: 'addnote',
		addnote(target, room, user) {
			this.checkCan('lock');
			target = target.trim();
			if (!target) return this.parse(`/help helpticket addnote`);
			const [ticketName, note] = Utils.splitFirst(target, ',').map(i => i.trim());
			const ticketId = toID(ticketName);
			if (!ticketId) return this.errorReply(`Specify the userid that created the ticket you want to mark.`);
			const ticket = tickets[ticketId];
			if (!ticket) return this.errorReply(`${ticketId} does not have an active ticket.`);
			if (ticket.resolved) return this.errorReply(`${ticketId}'s ticket has already been resolved.`);
			if (!note) return this.errorReply(`You must specify a note to add.`);
			if (!ticket.notes) ticket.notes = {};
			ticket.notes[user.id] = note;
			writeTickets();
			notifyStaff();
			if (!room || room.roomid !== 'staff') this.sendReply(`Added the note "${note}" to ${ticketId}'s ticket.`);
			this.room = Rooms.get('staff') || null;
			this.addGlobalModAction(`${user.name} added the note "${note}" to ${ticket.userid}'s helpticket.`);
			this.globalModlog(`HELPTICKET NOTE`, ticket.userid, note);
		},
		addnotehelp: [
			`/helpticket note [ticket userid], [note] - Adds a note to the [ticket], to be displayed in the hover text. Requires: % @ ~`,
		],
		removenote(target, room, user) {
			this.checkCan('lock');
			target = target.trim();
			if (!target) return this.parse(`/help helpticket removenote`);
			let [ticketName, staff] = Utils.splitFirst(target, ',').map(i => i.trim());
			const targetId = toID(ticketName);
			if (!targetId) return this.errorReply(`Specify the userid that created the ticket you want to remove a note from.`);
			const ticket = tickets[targetId];
			if (!ticket || ticket.resolved) return this.errorReply(`${targetId} does not have a pending ticket.`);
			staff = toID(staff) || user.id;
			if (!ticket.notes) return this.errorReply(`${targetId}'s ticket does not have any notes.`);
			const note = ticket.notes[staff];
			if (!note) {
				return this.errorReply(`${staff === user.id ? 'you do' : `'${staff}' does`} not have a note on that ticket.`);
			}
			if (!room || room.roomid !== 'staff') {
				this.sendReply(`You removed the note '${note}' (by ${staff}) on ${ticket.userid}'s ticket.`);
			}
			delete ticket.notes[staff];
			if (!Object.keys(ticket.notes).length) delete ticket.notes;
			writeTickets();
			notifyStaff();
			this.room = Rooms.get('staff') || null;
			this.addModAction(`${user.name} removed ${staff}'s note ("${note}") from ${ticket.userid}'s helpticket.`);
			this.globalModlog(`HELPTICKET REMOVENOTE`, ticket.userid, `${note} (originally by ${staff})`);
		},
		removenotehelp: [
			`/helpticket removenote [ticket userid], [staff] - Removes a note from the [ticket].`,
			`If a [staff] userid is given, removes the note from that staff member (defaults to your userid).`,
			`Requires: % @ ~`,
		],

		ar: 'addresponse',
		forceaddresponse: 'addresponse',
		far: 'addresponse',
		addresponse(target, room, user) {
			this.checkCan('lock');
			const [type, name, response] = Utils.splitFirst(target, ',', 2).map(f => f.trim());
			if (!toID(type) || !toID(name) || !toID(response)) {
				return this.parse(`/help helpticket addresponse`);
			}
			const typeId = HelpTicket.getTypeId(type);
			if (!(typeId in textTickets)) {
				this.errorReply(`'${type}' is not a valid text ticket type.`);
				return this.errorReply(`Valid types: ${Object.keys(textTickets).join(', ')}.`);
			}
			if (!settings.responses[typeId]) {
				settings.responses[typeId] = {};
			}
			if (settings.responses[typeId][name] && !this.cmd.includes('f')) {
				this.errorReply(`That button already exists for that ticket type.`);
				return this.errorReply(`Use /ht forceaddresponse to override it if you're sure.`);
			}
			settings.responses[typeId][name] = response;
			writeSettings();
			this.privateGlobalModAction(`${user.name} added a response button '${name}' for the ticket type ${typeId} ("${response}")`);
			this.globalModlog(`HELPTICKET ADDRESPONSE`, null, `'${response}' named ${name} for ${typeId}`);
		},
		addresponsehelp: [
			`/helpticket addresponse [type], [name], [response] - Adds a [response] button to the given ticket [type] with the given [name].`,
			`Requires: % @ ~`,
		],

		rr: 'removeresponse',
		removeresponse(target, room, user) {
			this.checkCan('lock');
			const [type, name] = Utils.splitFirst(target, ',').map(f => f.trim());
			if (!toID(type) || !toID(name)) return this.parse(`/help helpticket removeresponse`);
			const typeId = HelpTicket.getTypeId(type);
			if (!(type in textTickets)) {
				return this.errorReply(`'${type}' is not a valid text ticket type.`);
			}
			if (!settings.responses[typeId]?.[name]) {
				return this.errorReply(`'${name}' is not a response for the ${typeId} ticket type .`);
			}
			delete settings.responses[typeId][name];
			if (!Object.keys(settings.responses[typeId]).length) {
				delete settings.responses[typeId];
			}
			writeSettings();
			this.privateGlobalModAction(`${user.name} removed the response named '${name}' from the responses for ${typeId} tickets`);
			this.globalModlog('HELPTICKET REMOVERESPONSE', null, `${name} (from ${typeId})`);
		},
		removeresponsehelp: [
			`/helpticket removeresponse [type], [name] - Removes the response button with the given [name] from the given ticket [type].`,
			`Requires: % @ ~`,
		],

		lr: 'listresponses',
		listresponses(target, room, user) {
			this.checkCan('lock');
			let buf = `<strong>Help ticket response buttons `;
			target = toID(target);
			if (target && !(target in textTickets)) {
				return this.errorReply(`Invalid ticket type: ${target}.`);
			}
			buf += `${target ? `for the type ${target}:` : ""}</strong><hr />`;
			const table = target ? { [target]: settings.responses[target] } : settings.responses;
			if (!Object.keys(table).length) {
				buf += `<p class="message-error">None</p>`;
				return this.sendReplyBox(buf);
			}
			buf += Object.keys(table).map(type => (
				`<p>${ticketTitles[type]}<p>` +
				Object.keys(settings.responses[type])
					.map(name => Utils.html`<p>- ${name}: "${settings.responses[type][name]}"</p>`).join('')
			)).join('<hr />');
			return this.sendReplyBox(buf);
		},
		listresponseshelp: [
			`/helpticket listresponses [optional type] - List current response buttons for text tickets. `,
			`If a [type] is given, lists responses only for that type. Requires: % @ ~`,
		],

		close(target, room, user) {
			if (!target) {
				if (room?.roomid.startsWith('help-')) {
					target = room.roomid.slice(5);
				} else {
					return this.parse(`/help helpticket close`);
				}
			}
			const [targetUsername, rest] = this.splitOne(target);
			let result = rest !== 'false';
			const ticket = tickets[toID(targetUsername)];
			if (!ticket?.open || (ticket.userid !== user.id && !user.can('lock'))) {
				return this.errorReply(this.tr`${targetUsername} does not have an open ticket.`);
			}
			if (typeof ticket.text !== 'undefined') {
				return this.parse(`/helpticket resolve ${target}`);
			}
			const helpRoom = Rooms.get(`help-${ticket.userid}`) as ChatRoom | null;
			if (helpRoom) {
				const ticketGame = helpRoom.getGame(HelpTicket)!;
				if (ticket.userid === user.id && !user.isStaff) {
					result = !!(ticketGame.firstClaimTime);
				}
				ticketGame.close(result, user);
			} else {
				ticket.open = false;
				notifyStaff();
				writeTickets();
			}
			ticket.claimed = user.name;
			this.sendReply(`You closed ${ticket.creator}'s ticket.`);
		},
		closehelp: [`/helpticket close [user] - Closes an open ticket. Requires: % @ ~`],

		tb: 'ban',
		ticketban: 'ban',
		async ban(target, room, user) {
			if (!target) return this.parse('/help helpticket ban');
			const { targetUser, targetUsername, rest: reason } = this.splitUser(target, { exactName: true });
			this.checkCan('lock', targetUser);

			const punishment = Punishments.roomUserids.nestedGet('staff', toID(targetUsername));
			if (!targetUser && !Punishments.search(toID(targetUsername)).length) {
				return this.errorReply(this.tr`User '${targetUsername}' not found.`);
			}
			if (reason.length > 300) {
				return this.errorReply(this.tr`The reason is too long. It cannot exceed 300 characters.`);
			}

			let username;
			let userid;

			if (targetUser) {
				username = targetUser.getLastName();
				userid = targetUser.getLastId();
				if (punishment) {
					return this.privateModAction(`${username} would be ticket banned by ${user.name} but was already ticket banned.`);
				}
				if (targetUser.trusted) {
					Monitor.log(`[CrisisMonitor] Trusted user ${targetUser.name}${(targetUser.trusted !== targetUser.id ? ` (${targetUser.trusted})` : ``)} was ticket banned by ${user.name}, and should probably be demoted.`);
				}
			} else {
				username = targetUsername;
				userid = toID(targetUsername);
				if (punishment) {
					return this.privateModAction(`${username} would be ticket banned by ${user.name} but was already ticket banned.`);
				}
			}

			if (targetUser) {
				targetUser.popup(`|modal|${user.name} has banned you from creating help tickets.${(reason ? `\n\nReason: ${reason}` : ``)}\n\nYour ban will expire in a few days.`);
			}

			const affected: (User | ID)[] = await HelpTicket.ban(targetUser || userid, reason);
			this.addGlobalModAction(`${username} was ticket banned by ${user.name}.${reason ? ` (${reason})` : ``}`);
			const acAccount = (targetUser && targetUser.autoconfirmed !== userid && targetUser.autoconfirmed);

			let displayMessage = '';
			if (affected.length > 1) {
				const alts = affected.slice(1).map(userObj => typeof userObj === 'string' ? userObj : userObj.getLastName()).join(", ");
				displayMessage = `${username}'s ${acAccount ? ` ac account: ${acAccount}, ` : ""}ticket banned alts: ${alts}`;
				this.privateModAction(displayMessage);
			} else if (acAccount) {
				displayMessage = `${username}'s ac account: ${acAccount}`;
				this.privateModAction(displayMessage);
			}
			if (targetUser?.previousIDs.length) {
				affected.push(...targetUser.previousIDs);
			}

			this.globalModlog(`TICKETBAN`, targetUser || userid, reason);
			const staffRoom = Rooms.get('staff');
			for (const userObj of affected) {
				const userObjID = (typeof userObj !== 'string' ? userObj.getLastId() : toID(userObj));
				const targetTicket = tickets[userObjID];
				if (targetTicket?.open) targetTicket.open = false;
				const helpRoom = Rooms.get(`help-${userObjID}`);
				if (helpRoom) {
					const ticketGame = helpRoom.getGame(HelpTicket)!;
					ticketGame.writeStats('ticketban');
					helpRoom.destroy();
				} else if (targetTicket?.text) {
					await HelpTicket.modlog({
						action: `TICKETBAN`,
						loggedBy: user.id,
						note: `(Ticket content: ${targetTicket.text.join(' ').replace(/\n/ig, ' ')})`,
					});
					targetTicket.resolved = {
						by: user.id,
						seen: true,
						time: Date.now(),
						result: 'Ticketban',
						staffReason: 'Ticketban',
					};
					if (staffRoom) {
						for (const curUser of Object.values(staffRoom.users)) {
							for (const conn of curUser.connections) {
								if (conn.openPages?.has(`help-text-${userObjID}`)) {
									conn.send(`>view-help-text-${userObj}\n|deinit|`);
									conn.openPages.delete(`help-text-${userObjID}`);
									if (!conn.openPages.size) conn.openPages = null;
								}
							}
						}
					}
				}
			}
			writeTickets();
			notifyStaff();
			return true;
		},
		banhelp: [`/helpticket ban [user], (reason) - Bans a user from creating tickets for 2 days. Requires: % @ ~`],

		unticketban: 'unban',
		unban(target, room, user) {
			if (!target) return this.parse('/help helpticket unban');

			this.checkCan('lock');
			target = toID(target);
			const targetID: ID = Users.get(target)?.id || target as ID;
			const banned = Punishments.isTicketBanned(targetID);
			if (!banned) {
				return this.errorReply(this.tr`${target} is not ticket banned.`);
			}

			const affected = HelpTicket.unban(targetID);
			this.addModAction(`${affected} was ticket unbanned by ${user.name}.`);
			this.globalModlog("UNTICKETBAN", toID(target));
			Users.get(target)?.popup(`${user.name} has ticket unbanned you.`);
		},
		unbanhelp: [`/helpticket unban [user] - Ticket unbans a user. Requires: % @ ~`],

		ignore(target, room, user) {
			this.checkCan('lock');
			if (user.settings.ignoreTickets) {
				return this.errorReply(this.tr`You are already ignoring help ticket notifications. Use /helpticket unignore to receive notifications again.`);
			}
			user.settings.ignoreTickets = true;
			user.update();
			this.sendReply(this.tr`You are now ignoring help ticket notifications.`);
		},
		ignorehelp: [`/helpticket ignore - Ignore notifications for unclaimed help tickets. Requires: % @ ~`],

		unignore(target, room, user) {
			this.checkCan('lock');
			if (!user.settings.ignoreTickets) {
				return this.errorReply(this.tr`You are not ignoring help ticket notifications. Use /helpticket ignore to stop receiving notifications.`);
			}
			user.settings.ignoreTickets = false;
			user.update();
			this.sendReply(this.tr`You will now receive help ticket notifications.`);
		},
		unignorehelp: [`/helpticket unignore - Stop ignoring notifications for help tickets. Requires: % @ ~`],

		delete(target, room, user) {
			// This is a utility only to be used if something goes wrong
			this.checkCan('makeroom');
			if (!target) return this.parse(`/help helpticket delete`);
			const ticket = tickets[toID(target)];
			if (!ticket) return this.errorReply(this.tr`${target} does not have a ticket.`);
			const targetRoom = Rooms.get(`help-${ticket.userid}`);
			if (targetRoom) {
				targetRoom.getGame(HelpTicket)!.deleteTicket(user);
			} else {
				delete tickets[ticket.userid];
				writeTickets();
				notifyStaff();
			}
			this.sendReply(this.tr`You deleted ${target}'s ticket.`);
		},
		deletehelp: [`/helpticket delete [user] - Deletes a user's ticket. Requires: ~`],

		logs(target, room, user) {
			this.checkCan('lock');
			const [targetString, dateString] = Utils.splitFirst(target, ',').map(i => i.trim());
			const id = toID(targetString);
			if (!id) return this.errorReply(`Specify a userid.`);
			return this.parse(`/j view-help-logs-${id}${dateString ? `--${dateString}` : ''}`);
		},
		logshelp: [
			`/helpticket logs [userid][, month] - View logs of the [userid]'s text tickets. `,
			`If a [month] is given, searches only that month.`,
			`Requires: % @ ~`,
		],

		async private(target, room, user) {
			this.checkCan('bypassall');
			if (!target) return this.parse(`/help helpticket`);
			const [username, date] = target.split(',');
			const userid = toID(username);
			if (!userid) return this.parse(`/help helpticket`);
			if (!/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(date)) {
				return this.errorReply(`Invalid date (must be YYYY-MM-DD format).`);
			}
			const logPath = Monitor.logPath(`chat/help-${userid}/${date.slice(0, -3)}/${date}.txt`);
			if (!(await logPath.exists())) {
				return this.errorReply(`There are no logs for tickets from '${userid}' on the date '${date}'.`);
			}
			if (!(await Monitor.logPath(`private/${userid}`).exists())) {
				await Monitor.logPath(`private/${userid}`).mkdirp();
			}
			await logPath.copyFile(Monitor.logPath(`private/${userid}/${date}.txt`).path);
			await logPath.write(''); // empty out the logfile
			this.globalModlog(`HELPTICKET PRIVATELOGS`, null, `${userid} (${date})`);
			this.privateGlobalModAction(`${user.name} set the ticket logs for '${userid}' on '${date}' to be private.`);
		},
		privatehelp: [
			`/helpticket private [user], [date] - Makes the ticket logs for a user on a date private to upperstaff. Requires: ~`,
		],
		async public(target, room, user) {
			this.checkCan('bypassall');
			if (!target) return this.parse(`/help helpticket`);
			const [username, date] = target.split(',');
			const userid = toID(username);
			if (!userid) return this.parse(`/help helpticket`);
			if (!/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(date)) {
				return this.errorReply(`Invalid date (must be YYYY-MM-DD format).`);
			}
			const logPath = Monitor.logPath(`private/${userid}/${date}.txt`);
			if (!(await logPath.exists())) {
				return this.errorReply(`There are no logs for tickets from '${userid}' on the date '${date}'.`);
			}
			const monthPath = Monitor.logPath(`chat/help-${userid}/${date.slice(0, -3)}`);
			if (!(await monthPath.exists())) {
				await monthPath.mkdirp();
			}
			await logPath.copyFile(Monitor.logPath(`chat/help-${userid}/${date.slice(0, -3)}/${date}.txt`).path);
			await logPath.unlinkIfExists();
			this.globalModlog(`HELPTICKET PUBLICLOGS`, null, `${userid} (${date})`);
			this.privateGlobalModAction(`${user.name} set the ticket logs for '${userid}' on '${date}' to be public.`);
		},
		publichelp: [
			`/helpticket public [user], [date] - Makes the ticket logs for the [user] on the [date] public to staff. Requires: ~`,
		],
	},

	tb: 'ticketban',
	unticketban: 'ticketban',
	ticketban(target, room, user, connection, cmd) {
		return this.parse(`/helpticket ${cmd} ${target}`);
	},

	helptickethelp: [
		`/helpticket create - Creates a new ticket, requesting help from global staff.`,
		`/helpticket list - Lists all tickets. Requires: % @ ~`,
		`/helpticket close [user] - Closes an open ticket. Requires: % @ ~`,
		`/helpticket ban [user], (reason) - Bans a user from creating tickets for 2 days. Requires: % @ ~`,
		`/helpticket unban [user] - Ticket unbans a user. Requires: % @ ~`,
		`/helpticket ignore - Ignore notifications for unclaimed help tickets. Requires: % @ ~`,
		`/helpticket unignore - Stop ignoring notifications for help tickets. Requires: % @ ~`,
		`/helpticket delete [user] - Deletes a user's ticket. Requires: ~`,
		`/helpticket logs [userid][, month] - View logs of the [userid]'s text tickets. Requires: % @ ~`,
		`/helpticket note [ticket userid], [note] - Adds a note to the [ticket], to be displayed in the hover text. Requires: % @ ~`,
		`/helpticket private [user], [date] - Makes the ticket logs for a user on a date private to upperstaff. Requires: ~`,
		`/helpticket public [user], [date] - Makes the ticket logs for the [user] on the [date] public to staff. Requires: ~`,
	],
};

export const punishmentfilter: Chat.PunishmentFilter = (user, punishment) => {
	if (punishment.type !== 'BAN') return;

	const userId = toID(user);
	if (typeof user === 'object') {
		const ids = [userId, ...user.previousIDs];
		for (const userid of ids) {
			punishmentfilter(userid, punishment);
		}
	} else {
		const helpRoom = Rooms.get(`help-${userId}`);
		if (helpRoom?.game?.gameid !== 'helpticket') return;
		const ticket = helpRoom.game as HelpTicket;
		ticket.close('ticketban');
	}
};

export const loginfilter: Chat.LoginFilter = user => {
	const ticket = tickets[user.id];
	if (ticket?.resolved) {
		HelpTicket.notifyResolved(user, ticket);
	}
};

export const handlers: Chat.Handlers = {
	onRoomClose(room, user, conn, isPage) {
		if (!isPage || !room.includes('view-help-text')) return;
		const userid = room.slice('view-help-text'.length + 1);
		const ticket = tickets[userid];
		if (ticket?.open && ticket.claimed === user.id) {
			ticket.claimed = null;
			if (ticket.state?.claimTime) {
				delete ticket.state.claimTime;
				if (!Object.keys(ticket.state).length) delete ticket.state;
			}
			writeTickets();
			notifyStaff();
		}
	},
};

process.nextTick(() => {
	Chat.multiLinePattern.register(
		'/ht resolve ', '/helpticket resolve ',
		'/requesthelp resolve ', '/helprequest resolve ',
		'/ht submit ', '/helpticket submit ',
	);
});
