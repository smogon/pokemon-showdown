/**
 * Rooms
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Every chat room and battle is a room, and what they do is done in
 * rooms.ts. There's also a global room which every user is in, and
 * handles miscellaneous things like welcoming the user.
 *
 * `Rooms.rooms` is the global table of all rooms, a `Map` of `RoomID:Room`.
 * Rooms should normally be accessed with `Rooms.get(roomid)`.
 *
 * All rooms extend `BasicRoom`, whose important properties like `.users`
 * and `.game` are documented near the the top of its class definition.
 *
 * @license MIT
 */

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');

const TIMEOUT_EMPTY_DEALLOCATE = 10 * 60 * 1000;
const TIMEOUT_INACTIVE_DEALLOCATE = 40 * 60 * 1000;
const REPORT_USER_STATS_INTERVAL = 10 * 60 * 1000;
const MAX_CHATROOM_ID_LENGTH = 225;

const CRASH_REPORT_THROTTLE = 60 * 60 * 1000;

const LAST_BATTLE_WRITE_THROTTLE = 10;

const RETRY_AFTER_LOGIN = null;

import { FS, Utils, Streams } from '../lib';
import { type RoomSection, RoomSections } from './chat-commands/room-settings';
import { type QueuedHunt } from './chat-plugins/scavengers';
import { type ScavengerGameTemplate } from './chat-plugins/scavenger-games';
import { type RepeatedPhrase } from './chat-plugins/repeats';
import {
	PM as RoomBattlePM, RoomBattle, RoomBattlePlayer, RoomBattleTimer, type RoomBattleOptions,
} from "./room-battle";
import { BestOfGame } from './room-battle-bestof';
import { RoomGame, SimpleRoomGame, RoomGamePlayer } from './room-game';
import { MinorActivity, type MinorActivityData } from './room-minor-activity';
import { Roomlogs, type Roomlog } from './roomlogs';
import { RoomAuth } from './user-groups';
import { type PartialModlogEntry, mainModlog } from './modlog';
import { Replays } from './replays';
import * as crypto from 'crypto';

/*********************************************************
 * the Room object.
 *********************************************************/

interface MuteEntry {
	userid: ID;
	time: number;
	guestNum: number;
	autoconfirmed: string;
}

interface ChatRoomTable {
	title: string;
	desc: string;
	userCount: number;
	section?: string;
	subRooms?: string[];
	spotlight?: string;
	privacy: RoomSettings['isPrivate'];
}

interface ShowRequest {
	name: string;
	link: string;
	comment: string;
	dimensions?: [number, number, boolean];
}

interface BattleRoomTable {
	p1?: string;
	p2?: string;
	minElo?: 'tour' | number;
}

interface UserTable {
	[userid: string]: User;
}

export interface RoomSettings {
	title: string;
	auth: { [userid: string]: GroupSymbol };
	creationTime: number;
	section?: RoomSection;

	readonly autojoin?: boolean;
	aliases?: string[];
	banwords?: string[];
	isPrivate?: PrivacySetting;
	modjoin?: AuthLevel | true | null;
	modchat?: AuthLevel | null;
	staffRoom?: boolean;
	language?: ID | false;
	slowchat?: number | false;
	events?: { [k: string]: RoomEvent | RoomEventAlias | RoomEventCategory };
	filterStretching?: boolean;
	filterEmojis?: boolean;
	filterCaps?: boolean;
	filterLinks?: boolean;
	jeopardyDisabled?: boolean;
	mafiaDisabled?: boolean;
	unoDisabled?: boolean;
	hangmanDisabled?: boolean;
	auctionDisabled?: boolean;
	gameNumber?: number;
	highTraffic?: boolean;
	spotlight?: string;
	parentid?: string | null;
	desc?: string | null;
	introMessage?: string | null;
	staffMessage?: string | null;
	rulesLink?: string | null;
	dataCommandTierDisplay?: 'tiers' | 'doubles tiers' | 'National Dex tiers' | 'numbers';
	requestShowEnabled?: boolean | null;
	permissions?: { [k: string]: GroupSymbol };
	minorActivity?: PollData | AnnouncementData;
	minorActivityQueue?: MinorActivityData[];
	repeats?: RepeatedPhrase[];
	topics?: string[];
	autoModchat?: {
		rank: GroupSymbol,
		time: number,
		// stores previous modchat setting. if true, modchat was fully off
		active: boolean | AuthLevel,
	};
	tournaments?: TournamentRoomSettings;
	defaultFormat?: string;

	scavSettings?: AnyObject;
	scavQueue?: QueuedHunt[];

	// should not ever be saved because they're inapplicable to persistent rooms
	/** This includes groupchats, battles, and help-ticket rooms. */
	isPersonal?: boolean;
	isHelp?: boolean;
	noLogTimes?: boolean;
	noAutoTruncate?: boolean;
	isMultichannel?: boolean;
}

export type MessageHandler = (room: BasicRoom, message: string) => void;
export type Room = GameRoom | ChatRoom;
export type PrivacySetting = boolean | 'hidden' | 'voice' | 'unlisted';

import type { AnnouncementData } from './chat-plugins/announcements';
import type { PollData } from './chat-plugins/poll';
import type { AutoResponder } from './chat-plugins/responder';
import type { RoomEvent, RoomEventAlias, RoomEventCategory } from './chat-plugins/room-events';
import type { Tournament, TournamentRoomSettings } from './tournaments/index';

export abstract class BasicRoom {
	/** to rename use room.rename */
	readonly roomid: RoomID;
	title: string;
	readonly type: 'chat' | 'battle';
	readonly users: UserTable;
	/**
	 * Scrollback log. This is the log that's sent to users when
	 * joining the room. Should roughly match what's on everyone's
	 * screen.
	 */
	readonly log: Roomlog;
	/**
	 * The room's current RoomGame, if it exists. Each room can have 0 to 2
	 * `RoomGame`s, and `this.game.room === this`.
	 * Rooms may also have an additional game in `this.subGame`.
	 * However, `subGame`s do not update `user.game`.
	 */
	game: RoomGame | null;
	subGame: RoomGame | null;
	/**
	 * The room's current battle. Battles are a type of RoomGame, so in battle
	 * rooms (which can only be `GameRoom`s), `this.battle === this.game`.
	 * In all other rooms, `this.battle` is `null`.
	 */
	battle: RoomBattle | null;
	/**
	 * The room's current best-of set. Best-of sets are a type of RoomGame, so in best-of set
	 * rooms (which can only be `GameRoom`s), `this.bestof === this.game`.
	 * In all other rooms, `this.bestof` is `null`.
	 */
	bestOf: BestOfGame | null;
	/**
	 * The game room's current tournament. If the room is a battle room whose
	 * battle is part of a tournament, `this.tour === this.parent.game`.
	 * In all other rooms, `this.tour` is `null`.
	 */
	tour: Tournament | null;

	auth: RoomAuth;
	/** use `setParent` to set this */
	readonly parent: Room | null;
	/** use `subroom.setParent` to set this, or `clearSubRooms` to clear it */
	readonly subRooms: ReadonlyMap<string, Room> | null;

	readonly muteQueue: MuteEntry[];
	userCount: number;
	active: boolean;
	muteTimer: NodeJS.Timeout | null;
	modchatTimer: NodeJS.Timeout | null;
	lastUpdate: number;
	lastBroadcast: string;
	lastBroadcastTime: number;
	settings: RoomSettings;
	/** If true, this room's settings will be saved in config/chatrooms.json, allowing it to stay past restarts. */
	persist: boolean;

	scavgame: ScavengerGameTemplate | null;
	scavLeaderboard: AnyObject;
	responder?: AutoResponder | null;
	privacySetter?: Set<ID> | null;
	hideReplay: boolean;

	reportJoins: boolean;
	batchJoins: number;
	reportJoinsInterval: NodeJS.Timeout | null;

	minorActivity: MinorActivity | null;
	minorActivityQueue: MinorActivityData[] | null;
	banwordRegex: RegExp | true | null;
	logUserStatsInterval: NodeJS.Timeout | null;
	expireTimer: NodeJS.Timeout | null;
	userList: string;
	pendingApprovals: Map<string, ShowRequest> | null;

	messagesSent: number;
	/**
	 * These handlers will be invoked every n messages.
	 * handler:number-of-messages map
	 */
	nthMessageHandlers: Map<MessageHandler, number>;

	constructor(roomid: RoomID, title?: string, options: Partial<RoomSettings> = {}) {
		this.users = Object.create(null);
		this.type = 'chat';
		this.muteQueue = [];

		this.battle = null;
		this.bestOf = null;
		this.game = null;
		this.subGame = null;
		this.tour = null;

		this.roomid = roomid;
		this.title = (title || roomid);
		this.parent = null;

		this.userCount = 0;

		this.game = null;
		this.active = false;

		this.muteTimer = null;

		this.lastUpdate = 0;
		this.lastBroadcast = '';
		this.lastBroadcastTime = 0;

		// room settings

		this.settings = {
			title: this.title,
			auth: Object.create(null),
			creationTime: Date.now(),
		};
		this.persist = false;
		this.hideReplay = false;
		this.subRooms = null;
		this.scavgame = null;
		this.scavLeaderboard = {};
		this.auth = new RoomAuth(this);

		this.reportJoins = true;
		this.batchJoins = 0;
		this.reportJoinsInterval = null;

		options.title = this.title;
		if (options.isHelp) options.noAutoTruncate = true;
		this.reportJoins = !!(Config.reportjoins || options.isPersonal);
		this.batchJoins = options.isPersonal ? 0 : Config.reportjoinsperiod || 0;
		if (!options.auth) options.auth = {};

		this.log = Roomlogs.create(this, options);

		this.banwordRegex = null;

		this.settings = options as RoomSettings;
		if (!this.settings.creationTime) this.settings.creationTime = Date.now();
		this.auth.load();

		if (!options.isPersonal) this.persist = true;

		this.minorActivity = null;
		this.minorActivityQueue = null;
		if (options.parentid) {
			this.setParent(Rooms.get(options.parentid) || null);
		}

		this.subRooms = null;

		this.active = false;
		this.muteTimer = null;
		this.modchatTimer = null;

		this.logUserStatsInterval = null;
		this.expireTimer = null;
		if (Config.logchat) {
			this.roomlog('NEW CHATROOM: ' + this.roomid);
			if (Config.loguserstats) {
				this.logUserStatsInterval = setInterval(() => this.logUserStats(), Config.loguserstats);
			}
		}

		this.userList = '';
		if (this.batchJoins) {
			this.userList = this.getUserList();
		}
		this.pendingApprovals = null;
		this.messagesSent = 0;
		this.nthMessageHandlers = new Map();
		this.tour = null;
		this.game = null;
		this.battle = null;
		this.validateTitle(this.title, this.roomid);
	}

	toString() {
		return this.roomid;
	}

	/**
	 * Send a room message to all users in the room, without recording it
	 * in the scrollback log.
	 */
	send(message: string) {
		if (this.roomid !== 'lobby') message = '>' + this.roomid + '\n' + message;
		if (this.userCount) Sockets.roomBroadcast(this.roomid, message);
	}
	sendMods(data: string) {
		this.sendRankedUsers(data, '*');
	}
	sendRankedUsers(data: string, minRank: GroupSymbol = '+') {
		if (this.settings.staffRoom) {
			if (!this.log) throw new Error(`Staff room ${this.roomid} has no log`);
			this.log.add(data);
			return;
		}

		for (const i in this.users) {
			const user = this.users[i];
			// hardcoded for performance reasons (this is an inner loop)
			if (user.isStaff || this.auth.atLeast(user, minRank)) {
				user.sendTo(this, data);
			}
		}
	}
	/**
	 * Send a room message to a single user.
	 */
	sendUser(user: Connection | User, message: string) {
		user.sendTo(this, message);
	}
	/**
	 * Add a room message to the room log, so it shows up in the room
	 * for everyone, and appears in the scrollback for new users who
	 * join.
	 */
	add(message: string) {
		this.log.add(message);
		return this;
	}
	roomlog(message: string) {
		this.log.roomlog(message);
		return this;
	}
	/**
	 * Writes an entry to the modlog for that room, and the global modlog if entry.isGlobal is true.
	 */
	modlog(entry: PartialModlogEntry) {
		const override = this.tour ? `${this.roomid} tournament: ${this.tour.roomid}` : undefined;
		this.log.modlog(entry, override);
		return this;
	}
	uhtmlchange(name: string, message: string) {
		this.log.uhtmlchange(name, message);
	}
	attributedUhtmlchange(user: User, name: string, message: string) {
		this.log.attributedUhtmlchange(user, name, message);
	}
	hideText(userids: ID[], lineCount = 0, hideRevealButton?: boolean) {
		const cleared = this.log.clearText(userids, lineCount);
		for (const userid of cleared) {
			this.send(`|hidelines|${hideRevealButton ? 'delete' : 'hide'}|${userid}|${lineCount}`);
		}
		this.update();
	}
	/**
	 * Inserts (sanitized) HTML into the room log.
	 */
	addRaw(message: string) {
		return this.add('|raw|' + message);
	}
	/**
	 * Inserts some text into the room log, attributed to user. The
	 * attribution will not appear, and is used solely as a hint not to
	 * highlight the user.
	 */
	addByUser(user: User, text: string): this {
		return this.add('|c|' + user.getIdentity(this) + '|/log ' + text);
	}
	/**
	 * Like addByUser, but without logging
	 */
	sendByUser(user: User | null, text: string) {
		this.send('|c|' + (user ? user.getIdentity(this) : '~') + '|/log ' + text);
	}
	/**
	 * Like addByUser, but sends to mods only.
	 */
	sendModsByUser(user: User, text: string) {
		this.sendMods('|c|' + user.getIdentity(this) + '|/log ' + text);
	}
	update() {
		if (!this.log.broadcastBuffer.length) return;
		if (this.reportJoinsInterval) {
			clearInterval(this.reportJoinsInterval);
			this.reportJoinsInterval = null;
			this.userList = this.getUserList();
		}
		this.send(this.log.broadcastBuffer.join('\n'));
		this.log.broadcastBuffer = [];
		this.log.truncate();

		this.pokeExpireTimer();
	}

	getUserList() {
		let buffer = '';
		let counter = 0;
		for (const i in this.users) {
			if (!this.users[i].named) {
				continue;
			}
			counter++;
			buffer += ',' + this.users[i].getIdentityWithStatus(this);
		}
		const msg = `|users|${counter}${buffer}`;
		return msg;
	}

	nextGameNumber() {
		const gameNumber = (this.settings.gameNumber || 0) + 1;
		this.settings.gameNumber = gameNumber;
		this.saveSettings();
		return gameNumber;
	}

	// mute handling

	runMuteTimer(forceReschedule = false) {
		if (forceReschedule && this.muteTimer) {
			clearTimeout(this.muteTimer);
			this.muteTimer = null;
		}
		if (this.muteTimer || this.muteQueue.length === 0) return;

		const timeUntilExpire = this.muteQueue[0].time - Date.now();
		if (timeUntilExpire <= 1000) { // one second of leeway
			this.unmute(this.muteQueue[0].userid, "Your mute in '" + this.title + "' has expired.");
			// runMuteTimer() is called again in unmute() so this function instance should be closed
			return;
		}
		this.muteTimer = setTimeout(() => {
			this.muteTimer = null;
			this.runMuteTimer(true);
		}, timeUntilExpire);
	}
	isMuted(user: User): ID | undefined {
		if (!user) return;
		if (this.muteQueue) {
			for (const entry of this.muteQueue) {
				if (user.id === entry.userid ||
					user.guestNum === entry.guestNum ||
					(user.autoconfirmed && user.autoconfirmed === entry.autoconfirmed)) {
					if (entry.time - Date.now() < 0) {
						this.unmute(user.id);
						return;
					} else {
						return entry.userid;
					}
				}
			}
		}
		if (this.parent) return this.parent.isMuted(user);
	}
	getMuteTime(user: User): number | undefined {
		const userid = this.isMuted(user);
		if (!userid) return;
		for (const entry of this.muteQueue) {
			if (userid === entry.userid) {
				return entry.time - Date.now();
			}
		}
		if (this.parent) return this.parent.getMuteTime(user);
	}
	getGame<T extends RoomGame>(constructor: new (...args: any[]) => T, subGame = false): T | null {
		// TODO: switch to `static readonly gameid` when all game files are TypeScripted
		if (subGame && this.subGame && this.subGame.constructor.name === constructor.name) return this.subGame as T;
		if (this.game && this.game.constructor.name === constructor.name) return this.game as T;
		return null;
	}
	getMinorActivity<T extends MinorActivity>(constructor: new (...args: any[]) => T): T | null {
		if (this.minorActivity?.constructor.name === constructor.name) return this.minorActivity as T;
		return null;
	}
	getMinorActivityQueue(settings = false): MinorActivityData[] | null {
		const usedQueue = settings ? this.settings.minorActivityQueue : this.minorActivityQueue;
		if (!usedQueue?.length) return null;
		return usedQueue;
	}
	queueMinorActivity(activity: MinorActivityData): void {
		if (!this.minorActivityQueue) this.minorActivityQueue = [];
		this.minorActivityQueue.push(activity);
		this.settings.minorActivityQueue = this.minorActivityQueue;
	}
	clearMinorActivityQueue(slot?: number, depth = 1) {
		if (!this.minorActivityQueue) return;
		if (slot === undefined) {
			this.minorActivityQueue = null;
			delete this.settings.minorActivityQueue;
			this.saveSettings();
		} else {
			this.minorActivityQueue.splice(slot, depth);
			this.settings.minorActivityQueue = this.minorActivityQueue;
			this.saveSettings();
			if (!this.minorActivityQueue.length) this.clearMinorActivityQueue();
		}
	}
	setMinorActivity(activity: MinorActivity | null, noDisplay = false): void {
		this.minorActivity?.endTimer();
		this.minorActivity = activity;
		if (this.minorActivity) {
			this.minorActivity.save();
			if (!noDisplay) this.minorActivity.display();
		} else {
			delete this.settings.minorActivity;
			this.saveSettings();
		}
	}
	saveSettings() {
		if (!this.persist) return;

		if (!Rooms.global) return; // during initialization

		Rooms.global.writeChatRoomData();
	}
	checkModjoin(user: User) {
		if (user.id in this.users) return true;
		if (!this.settings.modjoin) return true;
		// users with a room rank can always join
		if (this.auth.has(user.id)) return true;

		const modjoinSetting = this.settings.modjoin !== true ? this.settings.modjoin : this.settings.modchat;
		if (!modjoinSetting) return true;
		if (!Users.Auth.isAuthLevel(modjoinSetting)) {
			Monitor.error(`Invalid modjoin setting in ${this.roomid}: ${modjoinSetting}`);
		}
		return (
			this.auth.atLeast(user, modjoinSetting) || Users.globalAuth.atLeast(user, modjoinSetting)
		);
	}
	mute(user: User, setTime?: number) {
		const userid = user.id;

		if (!setTime) setTime = 7 * 60000; // default time: 7 minutes
		if (setTime > 90 * 60000) setTime = 90 * 60000; // limit 90 minutes

		// If the user is already muted, the existing queue position for them should be removed
		if (this.isMuted(user)) this.unmute(userid);

		// Place the user in a queue for the unmute timer
		for (let i = 0; i <= this.muteQueue.length; i++) {
			const time = Date.now() + setTime;
			if (i === this.muteQueue.length || time < this.muteQueue[i].time) {
				const entry = {
					userid,
					time,
					guestNum: user.guestNum,
					autoconfirmed: user.autoconfirmed,
				};
				this.muteQueue.splice(i, 0, entry);
				// The timer needs to be switched to the new entry if it is to be unmuted
				// before the entry the timer is currently running for
				if (i === 0 && this.muteTimer) {
					clearTimeout(this.muteTimer);
					this.muteTimer = null;
				}
				break;
			}
		}
		this.runMuteTimer();

		user.updateIdentity();

		if (!(this.settings.isPrivate === true || this.settings.isPersonal)) {
			void Punishments.monitorRoomPunishments(user);
		}

		return userid;
	}
	unmute(userid: string, notifyText?: string) {
		let successUserid = '';
		const user = Users.get(userid);
		let autoconfirmed = '';
		if (user) {
			userid = user.id;
			autoconfirmed = user.autoconfirmed;
		}

		for (const [i, entry] of this.muteQueue.entries()) {
			if (entry.userid === userid ||
				(user && entry.guestNum === user.guestNum) ||
				(autoconfirmed && entry.autoconfirmed === autoconfirmed)) {
				if (i === 0) {
					this.muteQueue.splice(0, 1);
					this.runMuteTimer(true);
				} else {
					this.muteQueue.splice(i, 1);
				}
				successUserid = entry.userid;
				break;
			}
		}

		if (user && successUserid && userid in this.users) {
			user.updateIdentity();
			if (notifyText) user.popup(notifyText);
		}
		return successUserid;
	}

	logUserStats() {
		let total = 0;
		let guests = 0;
		const groups: { [k: string]: number } = {};
		for (const group of Config.groupsranking) {
			groups[group] = 0;
		}
		for (const i in this.users) {
			const user = this.users[i];
			++total;
			if (!user.named) {
				++guests;
			}
			++groups[this.auth.get(user.id)];
		}
		let entry = `|userstats|total:${total}|guests:${guests}`;
		for (const i in groups) {
			entry += `|${i}:${groups[i]}`;
		}
		this.roomlog(entry);
	}

	pokeExpireTimer() {
		if (this.expireTimer) clearTimeout(this.expireTimer);
		if (this.settings.isPersonal) {
			this.expireTimer = setTimeout(() => this.expire(), TIMEOUT_INACTIVE_DEALLOCATE);
		} else {
			this.expireTimer = null;
		}
	}
	expire() {
		this.send('|expire|');
		this.destroy();
	}
	reportJoin(type: 'j' | 'l' | 'n', entry: string, user: User) {
		const canTalk = this.auth.atLeast(user, this.settings.modchat ?? 'unlocked') && !this.isMuted(user);
		if (this.reportJoins && (canTalk || this.auth.has(user.id))) {
			this.add(`|${type}|${entry}`).update();
			return;
		}
		let ucType = '';
		switch (type) {
		case 'j': ucType = 'J'; break;
		case 'l': ucType = 'L'; break;
		case 'n': ucType = 'N'; break;
		}
		entry = `|${ucType}|${entry}`;
		if (this.batchJoins) {
			this.log.broadcastBuffer.push(entry);

			if (!this.reportJoinsInterval) {
				this.reportJoinsInterval = setTimeout(
					() => this.update(), this.batchJoins
				);
			}
		} else {
			this.send(entry);
		}
		this.roomlog(entry);
	}
	getIntroMessage(user: User) {
		let message = Utils.html`\n|raw|<div class="infobox"> You joined ${this.title}`;
		if (this.settings.modchat) {
			message += ` [${this.settings.modchat} or higher to talk]`;
		}
		if (this.settings.modjoin) {
			const modjoin = this.settings.modjoin === true ? this.settings.modchat : this.settings.modjoin;
			message += ` [${modjoin} or higher to join]`;
		}
		if (this.settings.slowchat) {
			message += ` [Slowchat ${this.settings.slowchat}s]`;
		}
		message += `</div>`;
		if (this.settings.introMessage) {
			message += `\n|raw|<div class="infobox infobox-roomintro"><div ${(this.settings.section !== 'official' ? 'class="infobox-limited"' : '')}>` +
				this.settings.introMessage.replace(/\n/g, '') +
				`</div></div>`;
		}
		const staffIntro = this.getStaffIntroMessage(user);
		if (staffIntro) message += `\n${staffIntro}`;
		return message;
	}
	getStaffIntroMessage(user: User) {
		if (!user.can('mute', null, this)) return ``;
		const messages = [];
		if (this.settings.staffMessage) {
			messages.push(`|raw|<div class="infobox">(Staff intro:)<br /><div>` +
				this.settings.staffMessage.replace(/\n/g, '') +
				`</div>`);
		}
		if (this.pendingApprovals?.size) {
			let message = `|raw|<div class="infobox">`;
			message += `<details open><summary>(Pending media requests: ${this.pendingApprovals.size})</summary>`;
			for (const [userid, entry] of this.pendingApprovals) {
				message += `<div class="infobox">`;
				message += `<strong>Requester ID:</strong> ${userid}<br />`;
				if (entry.dimensions) {
					const [width, height, resized] = entry.dimensions;
					message += `<strong>Link:</strong><br /> <img src="${entry.link}" width="${width}" height="${height}"><br />`;
					if (resized) message += `(Resized)<br />`;
				} else {
					message += `<strong>Link:</strong><br /> <a href="${entry.link}"">Link</a><br />`;
				}
				message += `<strong>Comment:</strong> ${entry.comment ? entry.comment : 'None.'}<br />`;
				message += `<button class="button" name="send" value="/approveshow ${userid}">Approve</button>` +
					`<button class="button" name="send" value="/denyshow ${userid}">Deny</button></div>`;
				message += `<hr />`;
			}
			message += `</details></div>`;
			messages.push(message);
		}
		if (
			!this.settings.isPrivate && !this.settings.isPersonal &&
			this.settings.modchat && this.settings.modchat !== 'autoconfirmed'
		) {
			messages.push(`|raw|<div class="broadcast-red">Modchat currently set to ${this.settings.modchat}</div>`);
		}
		return messages.join('\n');
	}
	getSubRooms(includeSecret = false) {
		if (!this.subRooms) return [];
		return [...this.subRooms.values()].filter(
			room => includeSecret ? true : !room.settings.isPrivate && !room.settings.isPersonal
		);
	}
	validateTitle(newTitle: string, newID?: string, oldID?: string) {
		if (!newID) newID = toID(newTitle);
		// `,` is a delimiter used by a lot of /commands
		// `|` and `[` are delimiters used by the protocol
		// `-` has special meaning in roomids
		if (newTitle.includes(',') || newTitle.includes('|')) {
			throw new Chat.ErrorMessage(`Room title "${newTitle}" can't contain any of: ,|`);
		}
		if ((!newID.includes('-') || newID.startsWith('groupchat-')) && newTitle.includes('-')) {
			throw new Chat.ErrorMessage(`Room title "${newTitle}" can't contain -`);
		}
		if (newID.length > MAX_CHATROOM_ID_LENGTH) throw new Chat.ErrorMessage("The given room title is too long.");
		if (newID !== oldID && Rooms.search(newTitle)) throw new Chat.ErrorMessage(`The room '${newTitle}' already exists.`);
	}
	setParent(room: Room | null) {
		if (this.parent === room) return;

		if (this.parent) {
			(this.parent.subRooms as any).delete(this.roomid);
			if (!this.parent.subRooms!.size) {
				(this.parent.subRooms as any) = null;
			}
		}
		(this as any).parent = room;
		if (room) {
			if (!room.subRooms) {
				(room as any).subRooms = new Map();
			}
			(room as any).subRooms.set(this.roomid, this);
			this.settings.parentid = room.roomid;
		} else {
			delete this.settings.parentid;
		}

		this.saveSettings();

		for (const userid in this.users) {
			this.users[userid].updateIdentity(this.roomid);
		}
	}
	clearSubRooms() {
		if (!this.subRooms) return;
		for (const room of this.subRooms.values()) {
			(room as any).parent = null;
		}
		(this as any).subRooms = null;

		// this doesn't update parentid or subroom user symbols because it's
		// intended to be used for cleanup only
	}
	setPrivate(privacy: PrivacySetting) {
		this.settings.isPrivate = privacy;
		this.saveSettings();

		if (privacy) {
			for (const user of Object.values(this.users)) {
				if (!user.named) {
					user.leaveRoom(this.roomid);
					user.popup(`The room <<${this.roomid}>> has been made private; you must log in to be in private rooms.`);
				}
			}
		}

		if (this.battle || this.bestOf) {
			if (privacy) {
				if (this.roomid.endsWith('pw')) return true;

				// This is the same password generation approach as genPassword in the client replays.lib.php
				// but obviously will not match given mt_rand there uses a different RNG and seed.
				let password = '';
				for (let i = 0; i < 31; i++) password += ALPHABET[crypto.randomInt(0, ALPHABET.length - 1)];

				this.rename(this.title, `${this.roomid}-${password}pw` as RoomID, true);
			} else {
				if (!this.roomid.endsWith('pw')) return true;

				const lastDashIndex = this.roomid.lastIndexOf('-');
				if (lastDashIndex < 0) throw new Error(`invalid battle ID ${this.roomid}`);

				this.rename(this.title, this.roomid.slice(0, lastDashIndex) as RoomID);
			}
		}
		this.bestOf?.setPrivacyOfGames(privacy);

		if (this.game) {
			for (const player of this.game.players) {
				player.getUser()?.updateSearch();
			}
		}
	}
	validateSection(section: string) {
		const target = toID(section);
		if (!RoomSections.sections.includes(target as any)) {
			throw new Chat.ErrorMessage(`"${target}" is not a valid room section. Valid categories include: ${RoomSections.sections.join(', ')}`);
		}
		return target as RoomSection;
	}
	setSection(section?: string) {
		if (!this.persist) {
			throw new Chat.ErrorMessage(`You cannot change the section of temporary rooms.`);
		}
		if (section) {
			const validatedSection = this.validateSection(section);
			if (this.settings.isPrivate && [true, 'hidden'].includes(this.settings.isPrivate)) {
				throw new Chat.ErrorMessage(`Only public rooms can change their section.`);
			}
			const oldSection = this.settings.section;
			if (oldSection === section) {
				throw new Chat.ErrorMessage(`${this.title}'s room section is already set to "${RoomSections.sectionNames[oldSection]}".`);
			}
			this.settings.section = validatedSection;
			this.saveSettings();
			return validatedSection;
		}
		delete this.settings.section;
		this.saveSettings();
		return undefined;
	}

	/**
	 * Displays a warning popup to all non-staff users users in the room.
	 * Returns a list of all the user IDs that were warned.
	 */
	warnParticipants(message: string) {
		const warned = Object.values(this.users).filter(u => !u.can('lock'));
		for (const user of warned) {
			user.popup(`|modal|${message}`);
		}
		return warned;
	}

	/**
	 * @param newID Add this param if the roomid is different from `toID(newTitle)`
	 * @param noAlias Set this param to true to not redirect aliases and the room's old name to its new name.
	 */
	rename(newTitle: string, newID?: RoomID, noAlias?: boolean) {
		if (!newID) newID = toID(newTitle) as RoomID;
		const oldID = this.roomid;
		this.validateTitle(newTitle, newID, oldID);
		if (this.type === 'chat' && this.game) {
			throw new Chat.ErrorMessage(`Please finish your game (${this.game.title}) before renaming ${this.roomid}.`);
		}
		(this as any).roomid = newID;
		this.title = this.settings.title = newTitle;
		this.saveSettings();
		if (newID === oldID) {
			for (const user of Object.values(this.users)) {
				user.sendTo(this, `|title|${newTitle}`);
			}
			return;
		}

		Rooms.rooms.delete(oldID);
		Rooms.rooms.set(newID, this as Room);
		if (this.battle && oldID) {
			for (const player of this.battle.players) {
				if (player.invite) {
					const chall = Ladders.challenges.searchByRoom(player.invite, oldID);
					if (chall) chall.roomid = this.roomid;
				}
			}
		}

		if (oldID === 'lobby') {
			Rooms.lobby = null;
		} else if (newID === 'lobby') {
			Rooms.lobby = this as ChatRoom;
		}

		if (!noAlias) {
			for (const [alias, roomid] of Rooms.aliases.entries()) {
				if (roomid === oldID) {
					Rooms.aliases.set(alias, newID);
				}
			}

			// add an alias from the old id
			Rooms.aliases.set(oldID, newID);
			if (!this.settings.aliases) this.settings.aliases = [];
			// resolve an old (fixed) bug in /renameroom
			if (!this.settings.aliases.includes(oldID)) this.settings.aliases.push(oldID);
		} else {
			// clear aliases
			for (const [alias, roomid] of Rooms.aliases.entries()) {
				if (roomid === oldID) {
					Rooms.aliases.delete(alias);
				}
			}
			this.settings.aliases = undefined;
		}

		this.game?.renameRoom(newID);

		for (const user of Object.values(this.users)) {
			user.moveConnections(oldID, newID);
			user.send(`>${oldID}\n|noinit|rename|${newID}|${newTitle}`);
		}

		if (this.parent?.subRooms) {
			(this as any).parent.subRooms.delete(oldID);
			(this as any).parent.subRooms.set(newID, this as ChatRoom);
		}
		if (this.subRooms) {
			for (const subRoom of this.subRooms.values()) {
				(subRoom as any).parent = this as ChatRoom;
				subRoom.settings.parentid = newID;
			}
		}

		this.saveSettings();

		Punishments.renameRoom(oldID, newID);

		void this.log.rename(newID);
	}

	onConnect(user: User, connection: Connection) {
		const userList = this.userList ? this.userList : this.getUserList();
		this.sendUser(
			connection,
			'|init|chat\n|title|' + this.title + '\n' + userList + '\n' + this.log.getScrollback() + this.getIntroMessage(user)
		);
		this.minorActivity?.onConnect?.(user, connection);
		this.game?.onConnect?.(user, connection);
	}
	onJoin(user: User, connection: Connection) {
		if (!user) return false; // ???
		if (this.users[user.id]) return false;

		Chat.runHandlers('onBeforeRoomJoin', this, user, connection);
		if (user.named) {
			this.reportJoin('j', user.getIdentityWithStatus(this), user);
		}

		const staffIntro = this.getStaffIntroMessage(user);
		if (staffIntro) this.sendUser(user, staffIntro);

		this.users[user.id] = user;
		this.userCount++;
		this.checkAutoModchat(user);

		this.game?.onJoin?.(user, connection);
		Chat.runHandlers('onRoomJoin', this, user, connection);
		return true;
	}
	onRename(user: User, oldid: ID, joining: boolean) {
		if (user.id === oldid) {
			return this.onUpdateIdentity(user);
		}
		if (!this.users[oldid]) {
			Monitor.crashlog(new Error(`user ${oldid} not in room ${this.roomid}`));
		}
		if (this.users[user.id]) {
			Monitor.crashlog(new Error(`user ${user.id} already in room ${this.roomid}`));
		}
		delete this.users[oldid];
		this.users[user.id] = user;
		if (joining) {
			this.reportJoin('j', user.getIdentityWithStatus(this), user);
			const staffIntro = this.getStaffIntroMessage(user);
			if (staffIntro) this.sendUser(user, staffIntro);
		} else if (!user.named) {
			this.reportJoin('l', ' ' + oldid, user);
		} else {
			this.reportJoin('n', user.getIdentityWithStatus(this) + '|' + oldid, user);
		}
		this.minorActivity?.onRename?.(user, oldid, joining);
		this.checkAutoModchat(user);
		return true;
	}
	/**
	 * onRename, but without a userid change
	 */
	onUpdateIdentity(user: User) {
		if (user?.connected) {
			if (!this.users[user.id]) return false;
			if (user.named) {
				this.reportJoin('n', user.getIdentityWithStatus(this) + '|' + user.id, user);
			}
		}
		return true;
	}
	onLeave(user: User) {
		if (!user) return false; // ...

		if (!(user.id in this.users)) {
			Monitor.crashlog(new Error(`user ${user.id} already left`));
			return false;
		}
		delete this.users[user.id];
		this.userCount--;

		if (user.named) {
			this.reportJoin('l', user.getIdentity(this), user);
		}
		this.game?.onLeave?.(user);
		this.runAutoModchat();

		return true;
	}

	runAutoModchat() {
		if (!this.settings.autoModchat || this.settings.autoModchat.active) return;
		// they are staff and online
		const staff = Object.values(this.users).filter(u => this.auth.atLeast(u, '%'));
		if (!staff.length) {
			const { time } = this.settings.autoModchat;
			if (!time || time < 5) {
				throw new Error(`Invalid time setting for automodchat (${Utils.visualize(this.settings.autoModchat)})`);
			}
			if (this.modchatTimer) return;
			this.modchatTimer = setTimeout(() => {
				if (!this.settings.autoModchat) return;
				const { rank } = this.settings.autoModchat;
				const oldSetting = this.settings.modchat;
				this.settings.modchat = rank;
				this.add(
					// always gonna be minutes so we can just use the number directly lol
					`|raw|<div class="broadcast-blue"><strong>This room has had no active staff for ${time} minutes,` +
					` and has had modchat set to ${rank}.</strong></div>`
				).update();
				this.modlog({
					action: 'AUTOMODCHAT ACTIVATE',
				});
				// automodchat will always exist
				this.settings.autoModchat.active = oldSetting || true;
				this.saveSettings();
				this.modchatTimer = null;
			}, time * 60 * 1000);
		}
	}

	checkAutoModchat(user: User) {
		if (user.can('mute', null, this, 'modchat')) {
			if (this.modchatTimer) {
				clearTimeout(this.modchatTimer);
			}
			if (this.settings.autoModchat?.active) {
				const oldSetting = this.settings.autoModchat.active;
				if (typeof oldSetting === 'string') {
					this.settings.modchat = oldSetting;
				} else {
					delete this.settings.modchat;
				}
				this.settings.autoModchat.active = false;
				this.saveSettings();
			}
		}
	}

	destroy(): void {
		// deallocate ourself

		if (this.game) {
			this.game.destroy();
			this.game = null;
			this.battle = null;
			this.tour = null;
		}

		// remove references to ourself
		for (const i in this.users) {
			this.users[i].leaveRoom(this as Room, null);
			delete this.users[i];
		}

		this.setParent(null);
		this.clearSubRooms();

		Chat.runHandlers('onRoomDestroy', this.roomid);

		Rooms.global.deregisterChatRoom(this.roomid);
		Rooms.global.delistChatRoom(this.roomid);

		if (this.settings.aliases) {
			for (const alias of this.settings.aliases) {
				Rooms.aliases.delete(alias);
			}
		}

		this.active = false;

		// Ensure there aren't any pending messages that could restart the expire timer
		this.update();

		// Clear any active timers for the room
		if (this.muteTimer) {
			clearTimeout(this.muteTimer);
			this.muteTimer = null;
		}
		if (this.expireTimer) {
			clearTimeout(this.expireTimer);
			this.expireTimer = null;
		}
		if (this.reportJoinsInterval) {
			clearInterval(this.reportJoinsInterval);
		}
		this.reportJoinsInterval = null;
		if (this.logUserStatsInterval) {
			clearInterval(this.logUserStatsInterval);
		}
		this.logUserStatsInterval = null;

		void this.log.destroy();

		Rooms.rooms.delete(this.roomid);
		if (this.roomid === 'lobby') Rooms.lobby = null;
	}
	tr(strings: string | TemplateStringsArray, ...keys: any[]) {
		return Chat.tr(this.settings.language || 'english' as ID, strings, ...keys);
	}
}

export class GlobalRoomState {
	readonly settingsList: RoomSettings[];
	readonly chatRooms: ChatRoom[];
	/**
	 * Rooms that users autojoin upon connecting
	 */
	readonly autojoinList: RoomID[];
	/**
	 * Rooms that users autojoin upon logging in
	 */
	readonly modjoinedAutojoinList: RoomID[];
	readonly ladderIpLog: Streams.WriteStream;
	readonly reportUserStatsInterval: NodeJS.Timeout;
	lockdown: boolean | 'pre' | 'ddos';
	battleCount: number;
	lastReportedCrash: number;
	lastBattle: number;
	lastWrittenBattle: number;
	maxUsers: number;
	maxUsersDate: number;
	formatList: string;

	constructor() {
		this.settingsList = [];
		try {
			this.settingsList = require(FS('config/chatrooms.json').path);
			if (!Array.isArray(this.settingsList)) this.settingsList = [];
		} catch {} // file doesn't exist [yet]

		if (!this.settingsList.length) {
			this.settingsList = [{
				title: 'Lobby',
				auth: {},
				creationTime: Date.now(),
				autojoin: true,
				section: 'official',
			}, {
				title: 'Staff',
				auth: {},
				creationTime: Date.now(),
				isPrivate: 'hidden',
				modjoin: '%',
				autojoin: true,
			}];
		}

		this.chatRooms = [];

		this.autojoinList = [];
		this.modjoinedAutojoinList = [];
		for (const [i, settings] of this.settingsList.entries()) {
			if (!settings?.title) {
				Monitor.warn(`ERROR: Room number ${i} has no data and could not be loaded.`);
				continue;
			}
			if ((settings as any).staffAutojoin) {
				// convert old staffAutojoin format
				delete (settings as any).staffAutojoin;
				(settings as any).autojoin = true;
				if (!settings.modjoin) settings.modjoin = '%';
				if (settings.isPrivate === true) settings.isPrivate = 'hidden';
			}

			// We're okay with assinging type `ID` to `RoomID` here
			// because the hyphens in chatrooms don't have any special
			// meaning, unlike in helptickets, groupchats, battles etc
			// where they are used for shared modlogs and the like
			const id = toID(settings.title) as RoomID;
			Monitor.notice("RESTORE CHATROOM: " + id);
			const room = Rooms.createChatRoom(id, settings.title, settings);
			if (room.settings.aliases) {
				for (const alias of room.settings.aliases) {
					Rooms.aliases.set(alias, id);
				}
			}

			this.chatRooms.push(room);
			if (room.settings.autojoin) {
				if (room.settings.modjoin) {
					this.modjoinedAutojoinList.push(id);
				} else {
					this.autojoinList.push(id);
				}
			}
		}
		Rooms.lobby = Rooms.rooms.get('lobby') as ChatRoom;

		// init battle room logging
		if (Config.logladderip) {
			this.ladderIpLog = Monitor.logPath('ladderip/ladderip.txt').createAppendStream();
		} else {
			// Prevent there from being two possible hidden classes an instance
			// of GlobalRoom can have.
			this.ladderIpLog = new Streams.WriteStream({ write() { return undefined; } });
		}

		this.reportUserStatsInterval = setInterval(
			() => this.reportUserStats(),
			REPORT_USER_STATS_INTERVAL
		);

		// init users
		this.maxUsers = 0;
		this.maxUsersDate = 0;
		this.lockdown = false;

		this.battleCount = 0;
		this.lastReportedCrash = 0;

		this.formatList = '';

		let lastBattle;
		try {
			lastBattle = Monitor.logPath('lastbattle.txt').readSync('utf8');
		} catch {}
		this.lastBattle = Number(lastBattle) || 0;
		this.lastWrittenBattle = this.lastBattle;
		void this.loadBattles();
	}

	async serializeBattleRoom(room: Room) {
		if (!room.battle || room.battle.ended) return null;
		room.battle.frozen = true;
		const log = await room.battle.getLog();
		const players = room.battle.players.map(p => p.id).filter(Boolean);
		if (!players.length || !log?.length) return null; // shouldn't happen???
		// players can be empty right after `/importinputlog`
		return {
			roomid: room.roomid,
			inputLog: log.join('\n'),
			players,
			title: room.title,
			rated: room.battle.rated,
			timer: {
				...room.battle.timer.settings,
				active: !!room.battle.timer.timer || false,
			},
		};
	}
	deserializeBattleRoom(battle: NonNullable<Awaited<ReturnType<GlobalRoomState['serializeBattleRoom']>>>) {
		const { inputLog, players, roomid, title, rated, timer } = battle;
		const [, formatid] = roomid.split('-');
		const room = Rooms.createBattle({
			format: formatid,
			inputLog,
			roomid,
			title,
			rated: Number(rated),
			players: [],
			delayedTimer: timer.active,
		});
		if (!room?.battle) return false; // shouldn't happen???
		if (timer) { // json blob of settings
			Object.assign(room.battle.timer.settings, timer);
		}
		for (const [i, playerid] of players.entries()) {
			room.auth.set(playerid, Users.PLAYER_SYMBOL);
			const player = room.battle.players[i];
			(player.id as string) = playerid;
			room.battle.playerTable[playerid] = player;
			player.hasTeam = true;
			const user = Users.getExact(playerid);
			player.name = user?.name || playerid; // in case user hasn't reconnected yet
			user?.joinRoom(room);
		}
		return true;
	}

	async saveBattles() {
		let count = 0;
		const out = Monitor.logPath('battles.jsonl.progress').createAppendStream();
		for (const room of Rooms.rooms.values()) {
			if (!room.battle || room.battle.ended) continue;
			room.battle.frozen = true;
			room.battle.timer.stop();
			const b = await this.serializeBattleRoom(room);
			if (!b) continue;
			await out.writeLine(JSON.stringify(b));
			count++;
		}
		await out.writeEnd();
		await Monitor.logPath('battles.jsonl.progress').rename(Monitor.logPath('battles.jsonl').path);
		return count;
	}

	battlesLoading = false;
	async loadBattles() {
		this.battlesLoading = true;
		for (const u of Users.users.values()) {
			u.send(
				`|pm|~|${u.getIdentity()}|/uhtml restartmsg,` +
				`<div class="broadcast-red"><b>Your battles are currently being restored.<br />Please be patient as they load.</div>`
			);
		}
		const startTime = Date.now();
		let count = 0;
		let input;
		try {
			const stream = Monitor.logPath('battles.jsonl').createReadStream();
			await stream.fd;
			input = stream.byLine();
		} catch {
			return;
		}
		for await (const line of input) {
			if (!line) continue;
			if (this.deserializeBattleRoom(JSON.parse(line))) count++;
		}
		for (const u of Users.users.values()) {
			u.send(`|pm|~|${u.getIdentity()}|/uhtmlchange restartmsg,`);
		}
		await Monitor.logPath('battles.jsonl').unlinkIfExists();
		Monitor.notice(`Loaded ${count} battles in ${Date.now() - startTime}ms`);
		this.battlesLoading = false;
	}

	rejoinGames(user: User) {
		for (const room of Rooms.rooms.values()) {
			const player = room.game && !room.game.ended && room.game.playerTable[user.id];
			if (!player) continue;
			// prevents players from being re-added to games like Scavengers after they've finished
			if (player.completed) continue;
			user.games.add(room.roomid);
			player.name = user.name;
			user.joinRoom(room.roomid);
		}
	}

	modlog(entry: PartialModlogEntry, overrideID?: string) {
		void Rooms.Modlog.write('global', entry, overrideID);
	}

	writeChatRoomData() {
		FS('config/chatrooms.json').writeUpdate(() => (
			JSON.stringify(this.settingsList)
				.replace(/\{"title":/g, '\n{"title":')
				.replace(/\]$/, '\n]')
		), { throttle: 5000 });
	}

	writeNumRooms() {
		if (this.lockdown) {
			if (this.lastBattle === this.lastWrittenBattle) return;
			this.lastWrittenBattle = this.lastBattle;
		} else {
			// batch writes so we don't have to write them every new battle
			// very probably premature optimization, considering by default we
			// write significantly larger log files every new battle
			if (this.lastBattle < this.lastWrittenBattle) return;
			this.lastWrittenBattle = this.lastBattle + LAST_BATTLE_WRITE_THROTTLE;
		}
		Monitor.logPath('lastbattle.txt').writeUpdate(
			() => `${this.lastWrittenBattle}`
		);
	}

	reportUserStats() {
		if (this.maxUsersDate) {
			void LoginServer.request('updateuserstats', {
				date: this.maxUsersDate,
				users: this.maxUsers,
			});
			this.maxUsersDate = 0;
		}
		void LoginServer.request('updateuserstats', {
			date: Date.now(),
			users: Users.onlineCount,
		});
	}

	get formatListText() {
		if (this.formatList) {
			return this.formatList;
		}
		this.formatList = `|formats${Ladders.formatsListPrefix || ''}`;
		let section = '';
		let prevSection = '';
		let curColumn = 1;
		for (const format of Dex.formats.all()) {
			if (format.section) section = format.section;
			if (format.column) curColumn = format.column;
			if (!format.name) continue;
			if (!format.challengeShow && !format.searchShow && !format.tournamentShow) continue;

			if (section !== prevSection) {
				prevSection = section;
				this.formatList += `|,${curColumn}|${section}`;
			}
			this.formatList += `|${format.name}`;
			let displayCode = 0;
			if (format.team) displayCode |= 1;
			if (format.searchShow) displayCode |= 2;
			if (format.challengeShow) displayCode |= 4;
			if (format.tournamentShow) displayCode |= 8;
			const ruleTable = Dex.formats.getRuleTable(format);
			const level = ruleTable.adjustLevel || ruleTable.adjustLevelDown || ruleTable.maxLevel;
			if (level === 50) displayCode |= 16;
			// 32 was previously used for Multi Battles
			if (format.bestOfDefault) displayCode |= 64;
			if (format.teraPreviewDefault) displayCode |= 128;
			this.formatList += ',' + displayCode.toString(16);
		}
		return this.formatList;
	}
	get configRankList() {
		if (Config.nocustomgrouplist) return '';

		// putting the resultant object in Config would enable this to be run again should config.js be reloaded.
		if (Config.rankList) {
			return Config.rankList;
		}
		const rankList = [];

		for (const rank in Config.groups) {
			if (!Config.groups[rank] || !rank) continue;

			const tarGroup = Config.groups[rank];
			const groupType = tarGroup.id === 'bot' || (!tarGroup.mute && !tarGroup.root) ?
				'normal' : (tarGroup.root || tarGroup.declare) ? 'leadership' : 'staff';

			rankList.push({
				symbol: rank,
				name: (Config.groups[rank].name || null),
				type: groupType }); // send the first character in the rank, incase they put a string several characters long
		}

		const typeOrder = ['punishment', 'normal', 'staff', 'leadership'];

		Utils.sortBy(rankList, rank => -typeOrder.indexOf(rank.type));

		// add the punishment types at the very end.
		for (const rank in Config.punishgroups) {
			rankList.push({ symbol: Config.punishgroups[rank].symbol, name: Config.punishgroups[rank].name, type: 'punishment' });
		}

		Config.rankList = '|customgroups|' + JSON.stringify(rankList) + '\n';
		return Config.rankList;
	}

	/**
	 * @param filter formatfilter, elofilter, usernamefilter
	 */
	getBattles(filter: string) {
		const rooms: GameRoom[] = [];
		const [formatFilter, eloFilterString, usernameFilter] = filter.split(',');
		const eloFilter = +eloFilterString;
		for (const room of Rooms.rooms.values()) {
			if (!room?.active || room.settings.isPrivate) continue;
			if (room.type !== 'battle') continue;
			if (formatFilter && formatFilter !== room.format) continue;
			if (eloFilter && (!room.rated || room.rated < eloFilter)) continue;
			if (usernameFilter && room.battle) {
				const p1userid = room.battle.p1.id;
				const p2userid = room.battle.p2.id;
				if (!p1userid || !p2userid) continue;
				if (!p1userid.startsWith(usernameFilter) && !p2userid.startsWith(usernameFilter)) continue;
			}
			rooms.push(room);
		}

		const roomTable: { [roomid: string]: BattleRoomTable } = {};
		for (let i = rooms.length - 1; i >= rooms.length - 100 && i >= 0; i--) {
			const room = rooms[i];
			const roomData: BattleRoomTable = {};
			if (room.active && room.battle) {
				if (room.battle.p1) roomData.p1 = room.battle.p1.name;
				if (room.battle.p2) roomData.p2 = room.battle.p2.name;
				if (room.tour) roomData.minElo = 'tour';
				if (room.rated) roomData.minElo = Math.floor(room.rated);
			}
			if (!roomData.p1 || !roomData.p2) continue;
			roomTable[room.roomid] = roomData;
		}
		return roomTable;
	}
	getRooms(user: User) {
		const roomsData: {
			chat: ChatRoomTable[],
			sectionTitles: string[],
			userCount: number,
			battleCount: number,
		} = {
			chat: [],
			sectionTitles: Object.values(RoomSections.sectionNames),
			userCount: Users.onlineCount,
			battleCount: this.battleCount,
		};
		for (const room of this.chatRooms) {
			if (!room) continue;
			if (room.parent) continue;
			if (
				room.settings.modjoin ||
				(room.settings.isPrivate && !(['hidden', 'voice'] as any).includes(room.settings.isPrivate)) ||
				(room.settings.isPrivate === 'voice' && user.tempGroup === ' ')
			) continue;
			const roomData: ChatRoomTable = {
				title: room.title,
				desc: room.settings.desc || '',
				userCount: room.userCount,
				section: room.settings.section ?
					(RoomSections.sectionNames[room.settings.section] || room.settings.section) : undefined,
				privacy: !room.settings.isPrivate ? undefined : room.settings.isPrivate,
			};
			const subrooms = room.getSubRooms().map(r => r.title);
			if (subrooms.length) roomData.subRooms = subrooms;
			if (room.settings.spotlight) roomData.spotlight = room.settings.spotlight;

			roomsData.chat.push(roomData);
		}
		return roomsData;
	}
	sendAll(message: string) {
		Sockets.roomBroadcast('', message);
	}
	addChatRoom(title: string) {
		const id = toID(title) as RoomID;
		if (['battles', 'rooms', 'ladder', 'teambuilder', 'home', 'all', 'public'].includes(id)) {
			return false;
		}
		if (Rooms.rooms.has(id)) return false;

		const settings = {
			title,
			auth: {},
			creationTime: Date.now(),
		};
		const room = Rooms.createChatRoom(id, title, settings);
		if (id === 'lobby') Rooms.lobby = room;
		this.settingsList.push(settings);
		this.chatRooms.push(room);
		this.writeChatRoomData();
		return true;
	}

	prepBattleRoom(format: string) {
		// console.log('BATTLE START BETWEEN: ' + p1.id + ' ' + p2.id);
		const roomPrefix = `battle-${toID(Dex.formats.get(format).name)}-`;
		let battleNum = this.lastBattle;
		let roomid: RoomID;
		do {
			roomid = `${roomPrefix}${++battleNum}` as RoomID;
		} while (Rooms.rooms.has(roomid));

		this.lastBattle = battleNum;
		this.writeNumRooms();
		return roomid;
	}

	onCreateBattleRoom(players: User[], room: GameRoom, options: AnyObject) {
		for (const player of players) {
			if (player.statusType === 'idle') {
				player.setStatusType('online');
			}
		}
		if (Config.reportbattles) {
			if (typeof Config.reportbattles === 'string') {
				Config.reportbattles = [Config.reportbattles];
			} else if (Config.reportbattles === true) {
				Config.reportbattles = ['lobby'];
			}
			for (const roomid of Config.reportbattles) {
				const reportRoom = Rooms.get(roomid);
				if (reportRoom) {
					const reportPlayers = players.map(p => p.getIdentity()).join('|');
					reportRoom
						.add(`|b|${room.roomid}|${reportPlayers}`)
						.update();
				}
			}
		}
		if (Config.logladderip && options.rated) {
			const ladderIpLogString = players.map(p => `${p.id}: ${p.latestIp}\n`).join('');
			void this.ladderIpLog.write(ladderIpLogString);
		}
		for (const player of players) {
			Chat.runHandlers('onBattleStart', player, room);
		}
	}

	deregisterChatRoom(id: string) {
		id = toID(id);
		const room = Rooms.get(id);
		if (!room) return false; // room doesn't exist
		if (!room.persist) return false; // room isn't registered
		// deregister from global settings
		// looping from the end is a pretty trivial optimization, but the
		// assumption is that more recently added rooms are more likely to
		// be deleted
		for (let i = this.settingsList.length - 1; i >= 0; i--) {
			if (id === toID(this.settingsList[i].title)) {
				this.settingsList.splice(i, 1);
				this.writeChatRoomData();
				break;
			}
		}
		room.persist = false;
		return true;
	}
	delistChatRoom(id: RoomID) {
		id = toID(id) as RoomID;
		if (!Rooms.rooms.has(id)) return false; // room doesn't exist
		for (let i = this.chatRooms.length - 1; i >= 0; i--) {
			if (id === this.chatRooms[i].roomid) {
				this.chatRooms.splice(i, 1);
				break;
			}
		}
	}
	removeChatRoom(id: string) {
		id = toID(id);
		const room = Rooms.get(id);
		if (!room) return false; // room doesn't exist
		room.destroy();
		return true;
	}
	autojoinRooms(user: User, connection: Connection) {
		// we only autojoin regular rooms if the client requests it with /autojoin
		// note that this restriction doesn't apply to modjoined autojoin rooms
		let includesLobby = false;
		for (const roomName of this.autojoinList) {
			user.joinRoom(roomName, connection);
			if (roomName === 'lobby') includesLobby = true;
		}
		if (!includesLobby && Config.serverid !== 'showdown') user.send(`>lobby\n|deinit`);
	}
	checkAutojoin(user: User, connection?: Connection) {
		if (!user.named) return;
		for (let [i, roomid] of this.modjoinedAutojoinList.entries()) {
			const room = Rooms.get(roomid);
			if (!room) {
				this.modjoinedAutojoinList.splice(i, 1);
				i--;
				continue;
			}
			if (room.checkModjoin(user)) {
				user.joinRoom(room.roomid, connection);
			}
		}
		for (const conn of user.connections) {
			if (conn.autojoins) {
				const autojoins = conn.autojoins.split(',') as RoomID[];
				for (const roomName of autojoins) {
					void user.tryJoinRoom(roomName, conn);
				}
				conn.autojoins = '';
			}
		}
	}
	handleConnect(user: User, connection: Connection) {
		connection.send(user.getUpdateuserText() + '\n' + this.configRankList + this.formatListText);
		if (Users.users.size > this.maxUsers) {
			this.maxUsers = Users.users.size;
			this.maxUsersDate = Date.now();
		}
	}
	startLockdown(err: Error | null = null, slow = false) {
		if (this.lockdown && err) return;
		const devRoom = Rooms.get('development');
		const stack = (err ? Utils.escapeHTML(err.stack!).split(`\n`).slice(0, 2).join(`<br />`) : ``);
		for (const [id, curRoom] of Rooms.rooms) {
			if (err) {
				if (id === 'staff' || id === 'development' || (!devRoom && id === 'lobby')) {
					curRoom.addRaw(`<div class="broadcast-red"><b>The server needs to restart because of a crash:</b> ${stack}<br />Please restart the server.</div>`);
					curRoom.addRaw(`<div class="broadcast-red">You will not be able to start new battles until the server restarts.</div>`);
					curRoom.update();
				} else {
					curRoom.addRaw(`<div class="broadcast-red"><b>The server needs to restart because of a crash.</b><br />No new battles can be started until the server is done restarting.</div>`).update();
				}
			} else {
				curRoom.addRaw(`<div class="broadcast-red"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>`).update();
			}
			const game = curRoom.game;
			// @ts-expect-error TODO: revisit when game.timer is standardized
			if (!slow && game?.timer && typeof game.timer.start === 'function' && !game.ended) {
				// @ts-expect-error see above
				game.timer.start();
				if (curRoom.settings.modchat !== '+') {
					curRoom.settings.modchat = '+';
					curRoom.addRaw(`<div class="broadcast-red"><b>Moderated chat was set to +!</b><br />Only users of rank + and higher can talk.</div>`).update();
				}
			}
		}
		for (const user of Users.users.values()) {
			user.send(`|pm|~|${user.tempGroup}${user.name}|/raw <div class="broadcast-red"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>`);
		}

		this.lockdown = true;
		this.writeNumRooms();
		this.lastReportedCrash = Date.now();
	}
	automaticKillRequest() {
		const notifyPlaces: RoomID[] = ['development', 'staff', 'upperstaff'];
		if (Config.autolockdown === undefined) Config.autolockdown = true; // on by default

		if (Config.autolockdown && Rooms.global.lockdown === true && Rooms.global.battleCount === 0) {
			// The server is in lockdown, the final battle has finished, and the option is set
			// so we will now automatically kill the server here if it is not updating.
			if (Monitor.updateServerLock) {
				this.notifyRooms(
					notifyPlaces,
					`|html|<div class="broadcast-red"><b>Automatic server lockdown kill canceled.</b><br /><br />The server tried to automatically kill itself upon the final battle finishing, but the server was updating while trying to kill itself.</div>`
				);
				return;
			}

			// final warning
			this.notifyRooms(
				notifyPlaces,
				`|html|<div class="broadcast-red"><b>The server is about to automatically kill itself in 10 seconds.</b></div>`
			);

			// kill server in 10 seconds if it's still set to
			setTimeout(() => {
				if (Config.autolockdown && Rooms.global.lockdown === true) {
					// finally kill the server
					process.exit();
				} else {
					this.notifyRooms(
						notifyPlaces,
						`|html|<div class="broadcsat-red"><b>Automatic server lockdown kill canceled.</b><br /><br />In the last final seconds, the automatic lockdown was manually disabled.</div>`
					);
				}
			}, 10 * 1000);
		}
	}
	notifyRooms(rooms: RoomID[], message: string) {
		if (!rooms || !message) return;
		for (const roomid of rooms) {
			const curRoom = Rooms.get(roomid);
			if (curRoom) curRoom.add(message).update();
		}
	}
	reportCrash(err: Error | string, crasher = "The server") {
		const time = Date.now();
		if (time - this.lastReportedCrash < CRASH_REPORT_THROTTLE) {
			return;
		}
		this.lastReportedCrash = time;

		const stack = typeof err === 'string' ? err : err?.stack || err?.message || err?.name || '';
		const [stackFirst, stackRest] = Utils.splitFirst(Utils.escapeHTML(stack), `<br />`);
		let fullStack = `<b>${crasher} crashed:</b> ` + stackFirst;
		if (stackRest) fullStack = `<details class="readmore"><summary>${fullStack}</summary>${stackRest}</details>`;

		let crashMessage = `|html|<div class="broadcast-red">${fullStack}</div>`;
		let privateCrashMessage = null;

		const upperStaffRoom = Rooms.get('upperstaff');

		let hasPrivateTerm = stack.includes('private');
		for (const term of (Config.privatecrashterms || [])) {
			if (typeof term === 'string' ? stack.includes(term) : term.test(stack)) {
				hasPrivateTerm = true;
				break;
			}
		}

		if (hasPrivateTerm) {
			if (upperStaffRoom) {
				privateCrashMessage = crashMessage;
				crashMessage = `|html|<div class="broadcast-red"><b>${crasher} crashed in private code</b> <a href="/upperstaff">Read more</a></div>`;
			} else {
				crashMessage = `|html|<div class="broadcast-red"><b>${crasher} crashed in private code</b></div>`;
			}
		}
		const devRoom = Rooms.get('development');
		if (devRoom) {
			devRoom.add(crashMessage).update();
		} else {
			Rooms.lobby?.add(crashMessage).update();
			Rooms.get('staff')?.add(crashMessage).update();
		}
		if (privateCrashMessage) {
			upperStaffRoom!.add(privateCrashMessage).update();
		}
	}
	/**
	 * Destroys personal rooms of a (punished) user
	 * Returns a list of the user's remaining public auth
	 */
	destroyPersonalRooms(userid: ID) {
		const roomauth = [];
		for (const [id, curRoom] of Rooms.rooms) {
			if (curRoom.settings.isPersonal && curRoom.auth.get(userid) === Users.HOST_SYMBOL) {
				curRoom.destroy();
			} else {
				if (curRoom.settings.isPrivate || curRoom.battle || !curRoom.persist) {
					continue;
				}

				if (curRoom.auth.has(userid)) {
					let oldGroup = curRoom.auth.get(userid) as string;
					if (oldGroup === ' ') oldGroup = 'whitelist in ';
					roomauth.push(`${oldGroup}${id}`);
				}
			}
		}
		return roomauth;
	}
}

export class ChatRoom extends BasicRoom {
	// This is not actually used, this is just a fake class to keep
	// TypeScript happy
	override battle = null;
	override active = false as const;
	override type = 'chat' as const;
}

export class GameRoom extends BasicRoom {
	declare readonly type: 'battle';
	readonly format: string;
	p1: User | null;
	p2: User | null;
	p3: User | null;
	p4: User | null;
	/**
	 * The lower player's rating, for searching purposes.
	 * 0 for unrated battles. 1 for unknown ratings.
	 */
	rated: number;
	declare battle: RoomBattle | null;
	declare bestOf: BestOfGame | null;
	declare game: RoomGame;
	modchatUser: string;
	constructor(roomid: RoomID, title: string, options: Partial<RoomSettings & RoomBattleOptions>) {
		options.noLogTimes = true;
		options.noAutoTruncate = true;
		options.isMultichannel = true;
		super(roomid, title, options);
		this.reportJoins = !!Config.reportbattlejoins;
		this.settings.modchat = (Config.battlemodchat || null);

		this.type = 'battle';

		this.format = options.format || '';
		// console.log("NEW BATTLE");

		this.tour = options.tour || null;
		this.setParent((options as any).parent || this.tour?.room || null);

		this.p1 = options.players?.[0]?.user || null;
		this.p2 = options.players?.[1]?.user || null;
		this.p3 = options.players?.[2]?.user || null;
		this.p4 = options.players?.[3]?.user || null;

		this.rated = options.rated === true ? 1 : options.rated || 0;

		this.battle = null;
		this.bestOf = null;
		this.game = null!;

		this.modchatUser = '';

		this.active = false;
	}
	/**
	 * - logNum = 0          : spectator log (no exact HP)
	 * - logNum = 1, 2, 3, 4 : player log (exact HP for that player)
	 * - logNum = -1         : debug log (exact HP for all players)
	 */
	getLog(channel: -1 | 0 | 1 | 2 | 3 | 4 = 0) {
		return this.log.getScrollback(channel);
	}
	getLogForUser(user: User) {
		if (!(user.id in this.game.playerTable)) return this.getLog();
		return this.getLog(this.game.playerTable[user.id].num as 0);
	}
	override update(excludeUser: User | null = null) {
		if (!this.log.broadcastBuffer.length) return;

		if (this.userCount) {
			Sockets.channelBroadcast(this.roomid, `>${this.roomid}\n${this.log.broadcastBuffer.join('\n')}`);
		}
		this.log.broadcastBuffer = [];

		this.pokeExpireTimer();
	}
	override pokeExpireTimer() {
		// empty rooms time out after ten minutes
		if (!this.userCount) {
			if (this.expireTimer) clearTimeout(this.expireTimer);
			this.expireTimer = setTimeout(() => this.expire(), TIMEOUT_EMPTY_DEALLOCATE);
		} else {
			if (this.expireTimer) clearTimeout(this.expireTimer);
			this.expireTimer = setTimeout(() => this.expire(), TIMEOUT_INACTIVE_DEALLOCATE);
		}
	}
	requestModchat(user: User | null) {
		if (!user) {
			this.modchatUser = '';
		} else if (!this.modchatUser || this.modchatUser === user.id || this.auth.get(user.id) !== Users.PLAYER_SYMBOL) {
			this.modchatUser = user.id;
		} else {
			return "Modchat can only be changed by the user who turned it on, or by staff";
		}
	}
	override onConnect(user: User, connection: Connection) {
		this.sendUser(connection, '|init|battle\n|title|' + this.title + '\n' + this.getLogForUser(user));
		this.game?.onConnect?.(user, connection);
	}
	override onJoin(user: User, connection: Connection) {
		if (!user) return false; // ???
		if (this.users[user.id]) return false;

		Chat.runHandlers('onBeforeRoomJoin', this, user, connection);
		if (user.named) {
			this.reportJoin('j', user.getIdentityWithStatus(this), user);
		}

		this.users[user.id] = user;
		this.userCount++;
		this.checkAutoModchat(user);

		this.minorActivity?.onConnect?.(user, connection);
		this.game?.onJoin?.(user, connection);
		Chat.runHandlers('onRoomJoin', this, user, connection);
		return true;
	}
	/**
	 * Sends this room's replay to the connection to be uploaded to the replay
	 * server. To be clear, the replay goes:
	 *
	 * PS server -> user -> loginserver
	 *
	 * NOT: PS server -> loginserver
	 *
	 * That's why this function requires a connection. For details, see the top
	 * comment inside this function.
	 */
	async uploadReplay(user?: User, connection?: Connection, options?: 'forpunishment' | 'silent' | 'auto') {
		// The reason we don't upload directly to the loginserver, unlike every
		// other interaction with the loginserver, is because it takes so much
		// bandwidth that it can get identified as a DoS attack by PHP, Apache, or
		// Cloudflare, and blocked.

		// While I'm sure this is configurable, it's a huge pain, and getting it
		// wrong, especially while migrating infrastructure, leads to everything
		// being unusable and panic while we figure out how to unblock our servers
		// from each other. It's just easier to "spread out" the bandwidth.

		// TODO: My ideal long-term fix would be to just have a database (probably
		// Postgres) shared between client and server, acting as both the server's
		// battle logs as well as the client's replay database, which both client
		// and server have write access to.

		const battle = this.battle;
		if (!battle) return;

		// retrieve spectator log (0) if there are privacy concerns
		const format = Dex.formats.get(this.format, true);

		// custom games always show full details
		// random-team battles show full details if the battle is ended
		// otherwise, don't show full details
		let hideDetails = !format.id.includes('customgame');
		if (format.team && battle.ended) hideDetails = false;

		const log = this.getLog(hideDetails ? 0 : -1);
		let rating: number | undefined;
		if (battle.ended && this.rated) rating = this.rated;
		let { id, password } = this.getReplayData();
		const silent = options === 'forpunishment' || options === 'silent' || options === 'auto';
		if (silent) connection = undefined;
		const isPrivate = this.settings.isPrivate || this.hideReplay;
		const hidden = options === 'auto' ? 10 :
			options === 'forpunishment' || (this as any).unlistReplay ? 2 :
			isPrivate ? 1 :
			0;
		if (isPrivate && hidden === 10) {
			password = Replays.generatePassword();
		}
		if (battle.replaySaved !== true && hidden === 10) {
			battle.replaySaved = 'auto';
		} else {
			battle.replaySaved = true;
		}

		// If we have a direct connetion to a Replays database, just upload the replay
		// directly.

		if (Replays.db) {
			const idWithServer = Config.serverid === 'showdown' ? id : `${Config.serverid}-${id}`;
			try {
				const fullid = await Replays.add({
					id: idWithServer,
					log,
					players: battle.players.map(p => p.name),
					format: format.name,
					rating: rating || null,
					private: hidden,
					password,
					inputlog: battle.inputLog?.join('\n') || null,
					uploadtime: Math.trunc(Date.now() / 1000),
				});
				const url = `https://${Config.routes.replays}/${fullid}`;
				connection?.popup(
					`|html|<p>Your replay has been uploaded! It's available at:</p><p> ` +
					`<a class="no-panel-intercept" href="${url}" target="_blank">${url}</a> ` +
					`<copytext value="${url}">Copy</copytext>`
				);
			} catch (e) {
				connection?.popup(`Your replay could not be saved: ${e}`);
				throw e;
			}
			return;
		}

		// Otherwise, (we're probably a side server), upload the replay through LoginServer

		const [result] = await LoginServer.request('addreplay', {
			id,
			log,
			players: battle.players.map(p => p.name).join(','),
			format: format.name,
			rating, // will probably do nothing
			hidden: hidden === 0 ? '' : hidden,
			inputlog: battle.inputLog?.join('\n') || undefined,
			password,
		});
		if (result?.errorip) {
			connection?.popup(`This server's request IP ${result.errorip} is not a registered server.`);
			return;
		}

		const fullid = result?.replayid;
		const url = `https://${Config.routes.replays}/${fullid}`;
		connection?.popup(
			`|html|<p>Your replay has been uploaded! It's available at:</p><p> ` +
			`<a class="no-panel-intercept" href="${url}" target="_blank">${url}</a> ` +
			`<copytext value="${url}">Copy</copytext>`
		);
	}

	getReplayData() {
		if (!this.roomid.endsWith('pw')) return { id: this.roomid.slice(7), password: null };
		const end = this.roomid.length - 2;
		const lastHyphen = this.roomid.lastIndexOf('-', end);
		return { id: this.roomid.slice(7, lastHyphen), password: this.roomid.slice(lastHyphen + 1, end) };
	}
}

function getRoom(roomid?: string | BasicRoom) {
	if (typeof roomid === 'string') {
		// Accounts for private battles that were made public
		if ((roomid.startsWith('battle-') || roomid.startsWith('game-bestof')) && roomid.endsWith('pw')) {
			const room = Rooms.rooms.get(roomid.slice(0, roomid.lastIndexOf('-')) as RoomID);
			if (room) return room;
		}
		return Rooms.rooms.get(roomid as RoomID);
	}
	return roomid as Room;
}

export const Rooms = {
	Modlog: mainModlog,
	/**
	 * The main roomid:Room table. Please do not hold a reference to a
	 * room long-term; just store the roomid and grab it from here (with
	 * the Rooms.get(roomid) accessor) when necessary.
	 */
	rooms: new Map<RoomID, Room>(),
	aliases: new Map<string, RoomID>(),

	get: getRoom,
	search(name: string): Room | undefined {
		return getRoom(name) || getRoom(toID(name)) || getRoom(Rooms.aliases.get(toID(name)));
	},

	createGameRoom(roomid: RoomID, title: string, options: Partial<RoomSettings & RoomBattleOptions>) {
		if (Rooms.rooms.has(roomid)) throw new Error(`Room ${roomid} already exists`);
		Monitor.debug("NEW BATTLE ROOM: " + roomid);
		const room = new GameRoom(roomid, title, options);
		Rooms.rooms.set(roomid, room);
		return room;
	},
	createChatRoom(roomid: RoomID, title: string, options: Partial<RoomSettings>) {
		if (Rooms.rooms.has(roomid)) throw new Error(`Room ${roomid} already exists`);
		const room: ChatRoom = new (BasicRoom as any)(roomid, title, options);
		Rooms.rooms.set(roomid, room);
		return room;
	},
	/**
	 * Can return null during lockdown, so make sure to handle that case.
	 * No need for UI; this function sends popups to users.
	 */
	createBattle(options: RoomBattleOptions & Partial<RoomSettings>) {
		const players = options.players.map(player => player.user);
		const format = Dex.formats.get(options.format);
		if (players.length > format.playerCount) {
			throw new Error(`${players.length} players were provided, but the format is a ${format.playerCount}-player format.`);
		}
		if (new Set(players).size < players.length) {
			throw new Error(`Players can't battle themselves`);
		}

		for (const user of players) {
			Ladders.cancelSearches(user);
		}

		const isBestOf = Dex.formats.getRuleTable(format).valueRules.get('bestof');

		if (Rooms.global.lockdown === 'pre' && isBestOf && !options.isBestOfSubBattle) {
			for (const user of players) {
				user.popup(`The server will be restarting soon. Best-of-${isBestOf} battles cannot be started at this time.`);
			}
			return null;
		}

		// gotta allow new bo3 child battles to start
		if (Rooms.global.lockdown === true && !options.isBestOfSubBattle) {
			for (const user of players) {
				user.popup("The server is restarting. Battles will be available again in a few minutes.");
			}
			return null;
		}

		const p1Special = players.length ? players[0].battleSettings.special : undefined;
		let mismatch = `"${p1Special}"`;
		for (const user of players) {
			if (user.battleSettings.special !== p1Special) {
				mismatch += ` vs. "${user.battleSettings.special}"`;
			}
			user.battleSettings.special = undefined;
		}

		if (mismatch !== `"${p1Special}"`) {
			for (const user of players) {
				user.popup(`Your special battle settings don't match: ${mismatch}`);
			}
			return null;
		} else if (p1Special) {
			options.ratedMessage = p1Special;
		}

		// options.rated is a number representing the lowest player rating, for searching purposes
		// options.rated < 0 or falsy means "unrated", and will be converted to 0 here
		// options.rated === true is converted to 1 (used in tests sometimes)
		options.rated = Math.max(+options.rated! || 0, 0);
		const p1 = players[0];
		const p2 = players[1];
		const p1name = p1 ? p1.name : "Player 1";
		const p2name = p2 ? p2.name : "Player 2";
		let roomTitle;
		let roomid = options.roomid;
		if (format.gameType === 'multi') {
			roomTitle = `Team ${p1name} vs. Team ${p2name}`;
		} else if (format.gameType === 'freeforall') {
			// p1 vs. p2 vs. p3 vs. p4 is too long of a title
			roomTitle = `${p1name} and friends`;
		} else if (isBestOf && !options.isBestOfSubBattle) {
			roomTitle = `${p1name} vs. ${p2name}`;
			roomid ||= `game-bestof${isBestOf}-${format.id}-${++Rooms.global.lastBattle}` as RoomID;
		} else if (options.title) {
			roomTitle = options.title;
		} else {
			roomTitle = `${p1name} vs. ${p2name}`;
		}
		roomid ||= Rooms.global.prepBattleRoom(options.format);
		options.isPersonal = true;
		const room = Rooms.createGameRoom(roomid, roomTitle, options);
		let game: RoomBattle | BestOfGame;
		if (options.isBestOfSubBattle || !isBestOf) {
			game = new RoomBattle(room, options);
		} else {
			game = new BestOfGame(room, options);
		}
		room.game = game;
		if (options.isBestOfSubBattle && room.parent) {
			room.setPrivate(room.parent.settings.isPrivate || false);
		} else {
			game.checkPrivacySettings(options);
		}

		for (const p of players) {
			if (p) {
				p.joinRoom(room);
				Monitor.countBattle(p.latestIp, p.name);
			}
		}

		return room;
	},

	global: null! as GlobalRoomState,
	lobby: null as ChatRoom | null,

	BasicRoom,
	GlobalRoomState,
	GameRoom,
	ChatRoom: BasicRoom as typeof ChatRoom,

	RoomGame,
	SimpleRoomGame,
	RoomGamePlayer,

	MinorActivity,

	RETRY_AFTER_LOGIN,

	Roomlogs,

	RoomBattle,
	BestOfGame,
	RoomBattlePlayer,
	RoomBattleTimer,
	PM: RoomBattlePM,

	Replays,
};
