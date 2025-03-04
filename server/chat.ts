/**
 * Chat
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This handles chat and chat commands sent from users to chatrooms
 * and PMs. The main function you're looking for is Chat.parse
 * (scroll down to its definition for details)
 *
 * Individual commands are put in:
 *   chat-commands/ - "core" commands that shouldn't be modified
 *   chat-plugins/ - other commands that can be safely modified
 *
 * The command API is (mostly) documented in chat-plugins/COMMANDS.md
 *
 * @license MIT
 */

/*

To reload chat commands:

/hotpatch chat

*/

import type { RoomPermission, GlobalPermission } from './user-groups';
import type { Punishment } from './punishments';
import type { PartialModlogEntry } from './modlog';
import { FriendsDatabase, PM } from './friends';
import { SQL, Repl, FS, Utils } from '../lib';
import * as Artemis from './artemis';
import { Dex } from '../sim';
import { PrivateMessages } from './private-messages';
import * as pathModule from 'path';
import * as JSX from './chat-jsx';

export type PageHandler = (this: PageContext, query: string[], user: User, connection: Connection)
=> Promise<string | null | void | JSX.VNode> | string | null | void | JSX.VNode;
export interface PageTable {
	[k: string]: PageHandler | PageTable;
}

export type ChatHandler = (
	this: CommandContext,
	target: string,
	room: Room | null,
	user: User,
	connection: Connection,
	cmd: string,
	message: string
) => void;
export type AnnotatedChatHandler = ChatHandler & {
	requiresRoom: boolean | RoomID,
	hasRoomPermissions: boolean,
	broadcastable: boolean,
	cmd: string,
	fullCmd: string,
	isPrivate: boolean,
	disabled: boolean,
	aliases: string[],
	requiredPermission?: GlobalPermission | RoomPermission,
};
export interface ChatCommands {
	[k: string]: ChatHandler | string | string[] | ChatCommands;
}
export interface AnnotatedChatCommands {
	[k: string]: AnnotatedChatHandler | string | string[] | AnnotatedChatCommands;
}

export type HandlerTable = { [key in keyof Handlers]?: Handlers[key] };

interface Handlers {
	onRoomClose: (id: string, user: User, connection: Connection, page: boolean) => any;
	onRenameRoom: (oldId: RoomID, newID: RoomID, room: BasicRoom) => void;
	onBattleStart: (user: User, room: GameRoom) => void;
	onBattleLeave: (user: User, room: GameRoom) => void;
	onRoomJoin: (room: BasicRoom, user: User, connection: Connection) => void;
	onBeforeRoomJoin: (room: BasicRoom, user: User, connection: Connection) => void;
	onDisconnect: (user: User) => void;
	onRoomDestroy: (roomid: RoomID) => void;
	onBattleEnd: (battle: RoomBattle, winner: ID, players: ID[]) => void;
	onLadderSearch: (user: User, connection: Connection, format: ID) => void;
	onBattleRanked: (
		battle: Rooms.RoomBattle, winner: ID, ratings: (AnyObject | null | undefined)[], players: ID[]
	) => void;
	onRename: (user: User, oldID: ID, newID: ID) => void;
	onTicketCreate: (ticket: import('./chat-plugins/helptickets').TicketState, user: User) => void;
	onChallenge: (user: User, targetUser: User, format: string | ID) => void;
	onMessageOffline: (context: Chat.CommandContext, message: string, targetUserID: ID) => void;
	onBattleJoin: (slot: string, user: User, battle: RoomBattle) => void;
	onPunishUser: (type: string, user: User, room?: Room | null) => void;
}

export interface ChatPlugin {
	commands?: AnnotatedChatCommands;
	pages?: PageTable;
	destroy?: () => void;
	roomSettings?: SettingsHandler | SettingsHandler[];
	[k: string]: any;
}
export type SettingsHandler = (

	room: Room,
	user: User,
	connection: Connection
) => {
	label: string,
	permission: boolean | RoomPermission,
	// button label, command | disabled
	options: [string, string | true][],
};

export type CRQHandler = (this: CommandContext, target: string, user: User, trustable?: boolean) => any;
export type RoomCloseHandler = (id: string, user: User, connection: Connection, page: boolean) => any;

/**
 * Chat filters can choose to:
 * 1. return false OR null - to not send a user's message
 * 2. return an altered string - to alter a user's message
 * 3. return undefined to send the original message through
 */
export type ChatFilter = ((
	this: CommandContext,
	message: string,
	user: User,
	room: Room | null,
	connection: Connection,
	targetUser: User | null,
	originalMessage: string
) => string | false | null | undefined | void) & { priority?: number };

export type NameFilter = (name: string, user: User) => string;
export type NicknameFilter = (name: string, user: User) => string | false;
export type StatusFilter = (status: string, user: User) => string;
export type PunishmentFilter = (user: User | ID, punishment: Punishment) => void;
export type LoginFilter = (user: User, oldUser: User | null, userType: string) => void;
export type HostFilter = (host: string, user: User, connection: Connection, hostType: string) => void;

export interface Translations {
	name?: string;
	strings: { [english: string]: string };
}

const LINK_WHITELIST = [
	'*.pokemonshowdown.com', 'psim.us', 'smogtours.psim.us',
	'*.smogon.com', '*.pastebin.com', '*.hastebin.com',
];

const MAX_MESSAGE_LENGTH = 1000;

const BROADCAST_COOLDOWN = 20 * 1000;
const MESSAGE_COOLDOWN = 5 * 60 * 1000;

const MAX_PARSE_RECURSION = 10;

const VALID_COMMAND_TOKENS = '/!';
const BROADCAST_TOKEN = '!';

const PLUGIN_DATABASE_PATH = './databases/chat-plugins.db';
const MAX_PLUGIN_LOADING_DEPTH = 3;

import { formatText, linkRegex, stripFormatting } from './chat-formatter';

// @ts-expect-error no typedef available
import ProbeModule = require('probe-image-size');
const probe: (url: string) => Promise<{ width: number, height: number }> = ProbeModule;

const EMOJI_REGEX = /[\p{Emoji_Modifier_Base}\p{Emoji_Presentation}\uFE0F]/u;

const TRANSLATION_DIRECTORY = pathModule.resolve(__dirname, '..', 'translations');

class PatternTester {
	// This class sounds like a RegExp
	// In fact, one could in theory implement it as a RegExp subclass
	// However, ES2016 RegExp subclassing is a can of worms, and it wouldn't allow us
	// to tailor the test method for fast command parsing.
	readonly elements: string[];
	readonly fastElements: Set<string>;
	regexp: RegExp | null;
	constructor() {
		this.elements = [];
		this.fastElements = new Set();
		this.regexp = null;
	}
	fastNormalize(elem: string) {
		return elem.slice(0, -1);
	}
	update() {
		const slowElements = this.elements.filter(elem => !this.fastElements.has(this.fastNormalize(elem)));
		if (slowElements.length) {
			this.regexp = new RegExp('^(' + slowElements.map(elem => '(?:' + elem + ')').join('|') + ')', 'i');
		}
	}
	register(...elems: string[]) {
		for (const elem of elems) {
			this.elements.push(elem);
			if (/^[^ ^$?|()[\]]+ $/.test(elem)) {
				this.fastElements.add(this.fastNormalize(elem));
			}
		}
		this.update();
	}
	testCommand(text: string) {
		const spaceIndex = text.indexOf(' ');
		if (this.fastElements.has(spaceIndex >= 0 ? text.slice(0, spaceIndex) : text)) {
			return true;
		}
		if (!this.regexp) return false;
		return this.regexp.test(text);
	}
	test(text: string) {
		if (!text.includes('\n')) return null;
		if (this.testCommand(text)) return text;
		// The PM matching is a huge mess, and really needs to be replaced with
		// the new multiline command system soon.
		const pmMatches = /^(\/(?:pm|w|whisper|msg) [^,]*, ?)(.*)/i.exec(text);
		if (pmMatches && this.testCommand(pmMatches[2])) {
			if (text.split('\n').every(line => line.startsWith(pmMatches[1]))) {
				return text.replace(/\n\/(?:pm|w|whisper|msg) [^,]*, ?/g, '\n');
			}
			return text;
		}
		return null;
	}
}

/*********************************************************
 * Parser
 *********************************************************/

/**
 * An ErrorMessage will, if used in a command/page context, simply show the user
 * the error, rather than logging a crash. It's used to simplify showing errors.
 *
 * Outside of a command/page context, it would still cause a crash.
 */
export class ErrorMessage extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ErrorMessage';
		Error.captureStackTrace(this, ErrorMessage);
	}
}

export class Interruption extends Error {
	constructor() {
		super('');
		this.name = 'Interruption';
		Error.captureStackTrace(this, ErrorMessage);
	}
}

// These classes need to be declared here because they aren't hoisted
export abstract class MessageContext {
	readonly user: User;
	language: ID | null;
	recursionDepth: number;
	constructor(user: User, language: ID | null = null) {
		this.user = user;
		this.language = language;
		this.recursionDepth = 0;
	}

	splitOne(target: string) {
		const commaIndex = target.indexOf(',');
		if (commaIndex < 0) {
			return [target.trim(), ''];
		}
		return [target.slice(0, commaIndex).trim(), target.slice(commaIndex + 1).trim()];
	}
	meansYes(text: string) {
		switch (text.toLowerCase().trim()) {
		case 'on': case 'enable': case 'yes': case 'true': case 'allow': case '1':
			return true;
		}
		return false;
	}
	meansNo(text: string) {
		switch (text.toLowerCase().trim()) {
		case 'off': case 'disable': case 'no': case 'false': case 'disallow': case '0':
			return true;
		}
		return false;
	}
	/**
	 * Given an array of strings (or a comma-delimited string), check the
	 * first and last string for a format/mod/gen. If it exists, remove
	 * it from the array.
	 *
	 * @returns `format` (null if no format was found), `dex` (the dex
	 * for the format/mod, or the default dex if none was found), and
	 * `targets` (the rest of the array).
	 */
	splitFormat(target: string | string[], atLeastOneTarget?: boolean, allowRules?: boolean) {
		const targets = typeof target === 'string' ? target.split(',') : target;
		if (!targets[0].trim()) targets.pop();

		if (targets.length > (atLeastOneTarget ? 1 : 0)) {
			const { dex, format, isMatch } = this.extractFormat(targets[0].trim(), allowRules);
			if (isMatch) {
				targets.shift();
				return { dex, format, targets };
			}
		}
		if (targets.length > 1) {
			const { dex, format, isMatch } = this.extractFormat(targets[targets.length - 1].trim(), allowRules);
			if (isMatch) {
				targets.pop();
				return { dex, format, targets };
			}
		}

		const room = (this as any as CommandContext).room;
		const { dex, format } = this.extractFormat(room?.settings.defaultFormat || room?.battle?.format, allowRules);
		return { dex, format, targets };
	}
	extractFormat(formatOrMod?: string, allowRules?: boolean): { dex: ModdedDex, format: Format | null, isMatch: boolean } {
		if (!formatOrMod) {
			return { dex: Dex.includeData(), format: null, isMatch: false };
		}

		const format = Dex.formats.get(formatOrMod);
		if (format.effectType === 'Format' || allowRules && format.effectType === 'Rule') {
			return { dex: Dex.forFormat(format), format, isMatch: true };
		}

		if (toID(formatOrMod) in Dex.dexes) {
			return { dex: Dex.mod(toID(formatOrMod)), format: null, isMatch: true };
		}

		return this.extractFormat();
	}
	splitUser(target: string, { exactName }: { exactName?: boolean } = {}) {
		const [inputUsername, rest] = this.splitOne(target).map(str => str.trim());
		const targetUser = Users.get(inputUsername, exactName);

		return {
			targetUser,
			inputUsername,
			targetUsername: targetUser ? targetUser.name : inputUsername,
			rest,
		};
	}
	requireUser(target: string, options: { allowOffline?: boolean, exactName?: boolean } = {}) {
		const { targetUser, targetUsername, rest } = this.splitUser(target, options);

		if (!targetUser) {
			throw new Chat.ErrorMessage(`The user "${targetUsername}" is offline or misspelled.`);
		}
		if (!options.allowOffline && !targetUser.connected) {
			throw new Chat.ErrorMessage(`The user "${targetUsername}" is offline.`);
		}

		// `inputUsername` and `targetUsername` are never needed because we already handle the "user not found" error messages
		// just use `targetUser.name` where previously necessary
		return { targetUser, rest };
	}
	getUserOrSelf(target: string, { exactName }: { exactName?: boolean } = {}) {
		if (!target.trim()) return this.user;

		return Users.get(target, exactName);
	}
	tr(strings: TemplateStringsArray | string, ...keys: any[]) {
		return Chat.tr(this.language, strings, ...keys);
	}
}

export class PageContext extends MessageContext {
	readonly connection: Connection;
	room: Room | null;
	pageid: string;
	initialized: boolean;
	title: string;
	args: string[];
	constructor(options: { pageid: string, user: User, connection: Connection, language?: ID }) {
		super(options.user, options.language);

		this.connection = options.connection;
		this.room = null;
		this.pageid = options.pageid;
		this.args = this.pageid.split('-');

		this.initialized = false;
		this.title = 'Page';
	}

	checkCan(permission: RoomPermission, target: User | null, room: Room): boolean;
	checkCan(permission: GlobalPermission, target?: User | null): boolean;
	checkCan(permission: string, target: User | null = null, room: Room | null = null) {
		if (!this.user.can(permission as any, target, room as any)) {
			throw new Chat.ErrorMessage(`<h2>Permission denied.</h2>`);
		}
		return true;
	}

	privatelyCheckCan(permission: RoomPermission, target: User | null, room: Room): boolean;
	privatelyCheckCan(permission: GlobalPermission, target?: User | null): boolean;
	privatelyCheckCan(permission: string, target: User | null = null, room: Room | null = null) {
		if (!this.user.can(permission as any, target, room as any)) {
			this.pageDoesNotExist();
		}
		return true;
	}

	pageDoesNotExist(): never {
		throw new Chat.ErrorMessage(`Page "${this.pageid}" not found`);
	}

	requireRoom(pageid?: string) {
		const room = this.extractRoom(pageid);
		if (!room) {
			throw new Chat.ErrorMessage(`Invalid link: This page requires a room ID.`);
		}

		this.room = room;
		return room;
	}
	extractRoom(pageid?: string) {
		if (!pageid) pageid = this.pageid;
		const parts = pageid.split('-');

		// The roomid for the page should be view-pagename-roomid
		const room = Rooms.get(parts[2]) || null;

		this.room = room;
		return room;
	}

	setHTML(html: string) {
		const roomid = this.room ? `[${this.room.roomid}] ` : '';
		let content = `|title|${roomid}${this.title}\n|pagehtml|${html}`;
		if (!this.initialized) {
			content = `|init|html\n${content}`;
			this.initialized = true;
		}
		this.send(content);
	}
	errorReply(message: string) {
		this.setHTML(`<div class="pad"><p class="message-error">${message}</p></div>`);
	}

	send(content: string) {
		this.connection.send(`>${this.pageid}\n${content}`);
	}
	close() {
		this.send('|deinit');
	}

	async resolve(pageid?: string) {
		if (pageid) this.pageid = pageid;

		const parts = this.pageid.split('-');
		parts.shift(); // first part is always `view`

		if (!this.connection.openPages) this.connection.openPages = new Set();
		this.connection.openPages.add(parts.join('-'));

		let handler: PageHandler | PageTable = Chat.pages;
		while (handler) {
			if (typeof handler === 'function') {
				break;
			}
			handler = handler[parts.shift() || 'default'] || handler[''];
		}

		this.args = parts;

		let res;
		try {
			if (typeof handler !== 'function') this.pageDoesNotExist();
			res = await handler.call(this, parts, this.user, this.connection);
		} catch (err: any) {
			if (err.name?.endsWith('ErrorMessage')) {
				if (err.message) this.errorReply(err.message);
				return;
			}
			if (err.name.endsWith('Interruption')) {
				return;
			}
			Monitor.crashlog(err, 'A chat page', {
				user: this.user.name,
				room: this.room && this.room.roomid,
				pageid: this.pageid,
			});
			this.setHTML(
				`<div class="pad"><div class="broadcast-red">` +
				`<strong>Pokemon Showdown crashed!</strong><br />Don't worry, we're working on fixing it.` +
				`</div></div>`
			);
		}
		if (typeof res === 'object' && res) res = JSX.render(res);
		if (typeof res === 'string') {
			this.setHTML(res);
			res = undefined;
		}
		return res;
	}
}

/**
 * This is a message sent in a PM or to a chat/battle room.
 *
 * There are three cases to be aware of:
 * - PM to user: `context.pmTarget` will exist and `context.room` will be `null`
 * - message to room: `context.room` will exist and `context.pmTarget` will be `null`
 * - console command (PM to `~`): `context.pmTarget` and `context.room` will both be `null`
 */
export class CommandContext extends MessageContext {
	message: string;
	pmTarget: User | null;
	room: Room | null;
	connection: Connection;

	cmd: string;
	cmdToken: string;
	target: string;
	fullCmd: string;
	handler: AnnotatedChatHandler | null;

	isQuiet: boolean;
	bypassRoomCheck?: boolean;
	broadcasting: boolean;
	broadcastToRoom: boolean;
	/** Used only by !rebroadcast */
	broadcastPrefix: string;
	broadcastMessage: string;
	constructor(options: {
		message: string, user: User, connection: Connection,
		room?: Room | null, pmTarget?: User | null, cmd?: string, cmdToken?: string, target?: string, fullCmd?: string,
		recursionDepth?: number, isQuiet?: boolean, broadcastPrefix?: string, bypassRoomCheck?: boolean,
	}) {
		super(
			options.user, options.room && options.room.settings.language ?
				options.room.settings.language : options.user.language
		);

		this.message = options.message || ``;
		this.recursionDepth = options.recursionDepth || 0;

		// message context
		this.pmTarget = options.pmTarget || null;
		this.room = options.room || null;
		this.connection = options.connection;

		// command context
		this.cmd = options.cmd || '';
		this.cmdToken = options.cmdToken || '';
		this.target = options.target || ``;
		this.fullCmd = options.fullCmd || '';
		this.handler = null;
		this.isQuiet = options.isQuiet || false;
		this.bypassRoomCheck = options.bypassRoomCheck || false;

		// broadcast context
		this.broadcasting = false;
		this.broadcastToRoom = true;
		this.broadcastPrefix = options.broadcastPrefix || '';
		this.broadcastMessage = '';
	}

	// TODO: return should be void | boolean | Promise<void | boolean>
	parse(
		msg?: string,
		options: Partial<{ isQuiet: boolean, broadcastPrefix: string, bypassRoomCheck: boolean }> = {}
	): any {
		if (typeof msg === 'string') {
			// spawn subcontext
			const subcontext = new CommandContext({
				message: msg,
				user: this.user,
				connection: this.connection,
				room: this.room,
				pmTarget: this.pmTarget,
				recursionDepth: this.recursionDepth + 1,
				bypassRoomCheck: this.bypassRoomCheck,
				...options,
			});
			if (subcontext.recursionDepth > MAX_PARSE_RECURSION) {
				throw new Error("Too much command recursion");
			}
			return subcontext.parse();
		}
		let message: string | void | boolean | Promise<string | void | boolean> = this.message;

		const parsedCommand = Chat.parseCommand(message);
		if (parsedCommand) {
			this.cmd = parsedCommand.cmd;
			this.fullCmd = parsedCommand.fullCmd;
			this.cmdToken = parsedCommand.cmdToken;
			this.target = parsedCommand.target;
			this.handler = parsedCommand.handler;
		}

		if (!this.bypassRoomCheck && this.room && !(this.user.id in this.room.users)) {
			return this.popupReply(`You tried to send "${message}" to the room "${this.room.roomid}" but it failed because you were not in that room.`);
		}

		if (this.user.statusType === 'idle' && !['unaway', 'unafk', 'back'].includes(this.cmd)) {
			this.user.setStatusType('online');
		}

		try {
			if (this.handler) {
				if (this.handler.disabled) {
					throw new Chat.ErrorMessage(
						`The command /${this.fullCmd.trim()} is temporarily unavailable due to technical difficulties. ` +
						`Please try again in a few hours.`
					);
				}
				message = this.run(this.handler);
			} else {
				if (this.cmdToken) {
					// To guard against command typos, show an error message
					if (!(this.shouldBroadcast() && !/[a-z0-9]/.test(this.cmd.charAt(0)))) {
						this.commandDoesNotExist();
					}
				} else if (
					!VALID_COMMAND_TOKENS.includes(message.charAt(0)) &&
					VALID_COMMAND_TOKENS.includes(message.trim().charAt(0))
				) {
					message = message.trim();
					if (!message.startsWith(BROADCAST_TOKEN)) {
						message = message.charAt(0) + message;
					}
				}

				message = this.checkChat(message);
			}
		} catch (err: any) {
			if (err.name?.endsWith('ErrorMessage')) {
				this.errorReply(err.message);
				this.update();
				return false;
			}
			if (err.name.endsWith('Interruption')) {
				this.update();
				return;
			}
			Monitor.crashlog(err, 'A chat command', {
				user: this.user.name,
				room: this.room?.roomid,
				pmTarget: this.pmTarget?.name,
				message: this.message,
			});
			this.sendReply(`|html|<div class="broadcast-red"><b>Pokemon Showdown crashed!</b><br />Don't worry, we're working on fixing it.</div>`);
			return;
		}

		// Output the message
		if (message && typeof (message as any).then === 'function') {
			this.update();
			return (message as Promise<string | boolean | void>).then(resolvedMessage => {
				if (resolvedMessage && resolvedMessage !== true) {
					this.sendChatMessage(resolvedMessage);
				}
				this.update();
				if (resolvedMessage === false) return false;
			}).catch(err => {
				if (err.name?.endsWith('ErrorMessage')) {
					this.errorReply(err.message);
					this.update();
					return false;
				}
				if (err.name.endsWith('Interruption')) {
					this.update();
					return;
				}
				Monitor.crashlog(err, 'An async chat command', {
					user: this.user.name,
					room: this.room?.roomid,
					pmTarget: this.pmTarget?.name,
					message: this.message,
				});
				this.sendReply(`|html|<div class="broadcast-red"><b>Pokemon Showdown crashed!</b><br />Don't worry, we're working on fixing it.</div>`);
				return false;
			});
		} else if (message && message !== true) {
			this.sendChatMessage(message as string);
			message = true;
		}

		this.update();

		return message;
	}

	sendChatMessage(message: string) {
		if (this.pmTarget) {
			const blockInvites = this.pmTarget.settings.blockInvites;
			if (blockInvites && /^<<.*>>$/.test(message.trim())) {
				if (
					!this.user.can('lock') && blockInvites === true ||
					!Users.globalAuth.atLeast(this.user, blockInvites as GroupSymbol)
				) {
					Chat.maybeNotifyBlocked(`invite`, this.pmTarget, this.user);
					return this.errorReply(`${this.pmTarget.name} is blocking room invites.`);
				}
			}
			Chat.PrivateMessages.send(message, this.user, this.pmTarget);
		} else if (this.room) {
			this.room.add(`|c|${this.user.getIdentity(this.room)}|${message}`);
			this.room.game?.onLogMessage?.(message, this.user);
		} else {
			this.connection.popup(`Your message could not be sent:\n\n${message}\n\nIt needs to be sent to a user or room.`);
		}
	}
	run(handler: string | AnnotatedChatHandler) {
		if (typeof handler === 'string') handler = Chat.commands[handler] as AnnotatedChatHandler;
		if (!handler.broadcastable && this.cmdToken === '!') {
			this.errorReply(`The command "${this.fullCmd}" can't be broadcast.`);
			this.errorReply(`Use /${this.fullCmd} instead.`);
			return false;
		}
		let result: any = handler.call(this, this.target, this.room, this.user, this.connection, this.cmd, this.message);
		if (result === undefined) result = false;

		return result;
	}

	checkFormat(room: BasicRoom | null | undefined, user: User, message: string) {
		if (!room) return true;
		if (
			!room.settings.filterStretching && !room.settings.filterCaps &&
			!room.settings.filterEmojis && !room.settings.filterLinks
		) {
			return true;
		}
		if (user.can('mute', null, room)) return true;

		if (room.settings.filterStretching && /(.+?)\1{5,}/i.test(user.name)) {
			throw new Chat.ErrorMessage(`Your username contains too much stretching, which this room doesn't allow.`);
		}
		if (room.settings.filterLinks) {
			const bannedLinks = this.checkBannedLinks(message);
			if (bannedLinks.length) {
				throw new Chat.ErrorMessage(
					`You have linked to ${bannedLinks.length > 1 ? 'unrecognized external websites' : 'an unrecognized external website'} ` +
					`(${bannedLinks.join(', ')}), which this room doesn't allow.`
				);
			}
		}
		if (room.settings.filterCaps && /[A-Z\s]{6,}/.test(user.name)) {
			throw new Chat.ErrorMessage(`Your username contains too many capital letters, which this room doesn't allow.`);
		}
		if (room.settings.filterEmojis && EMOJI_REGEX.test(user.name)) {
			throw new Chat.ErrorMessage(`Your username contains emojis, which this room doesn't allow.`);
		}
		// Removes extra spaces and null characters
		// eslint-disable-next-line no-control-regex
		message = message.trim().replace(/[ \u0000\u200B-\u200F]+/g, ' ');

		if (room.settings.filterStretching && /(.+?)\1{7,}/i.test(message)) {
			throw new Chat.ErrorMessage(`Your message contains too much stretching, which this room doesn't allow.`);
		}
		if (room.settings.filterCaps && /[A-Z\s]{18,}/.test(message)) {
			throw new Chat.ErrorMessage(`Your message contains too many capital letters, which this room doesn't allow.`);
		}
		if (room.settings.filterEmojis && EMOJI_REGEX.test(message)) {
			throw new Chat.ErrorMessage(`Your message contains emojis, which this room doesn't allow.`);
		}

		return true;
	}

	checkSlowchat(room: Room | null | undefined, user: User) {
		if (!room?.settings.slowchat) return true;
		if (user.can('show', null, room)) return true;
		const lastActiveSeconds = (Date.now() - user.lastMessageTime) / 1000;
		if (lastActiveSeconds < room.settings.slowchat) {
			throw new Chat.ErrorMessage(this.tr`This room has slow-chat enabled. You can only talk once every ${room.settings.slowchat} seconds.`);
		}
		return true;
	}

	checkBanwords(room: BasicRoom | null | undefined, message: string): boolean {
		if (!room) return true;
		if (!room.banwordRegex) {
			if (room.settings.banwords?.length) {
				room.banwordRegex = new RegExp('(?:\\b|(?!\\w))(?:' + room.settings.banwords.join('|') + ')(?:\\b|\\B(?!\\w))', 'i');
			} else {
				room.banwordRegex = true;
			}
		}
		if (!message) return true;
		if (room.banwordRegex !== true && room.banwordRegex.test(message)) {
			throw new Chat.ErrorMessage(`Your message contained a word banned by this room.`);
		}
		return this.checkBanwords(room.parent as ChatRoom, message);
	}
	checkGameFilter() {
		return this.room?.game?.onChatMessage?.(this.message, this.user);
	}
	pmTransform(originalMessage: string, sender?: User, receiver?: User | null | string) {
		if (!sender) {
			if (this.room) throw new Error(`Not a PM`);
			sender = this.user;
			receiver = this.pmTarget;
		}
		const targetIdentity = typeof receiver === 'string' ? ` ${receiver}` : receiver ? receiver.getIdentity() : '~';
		const prefix = `|pm|${sender.getIdentity()}|${targetIdentity}|`;
		return originalMessage.split('\n').map(message => {
			if (message.startsWith('||')) {
				return prefix + `/text ` + message.slice(2);
			} else if (message.startsWith(`|html|`)) {
				return prefix + `/raw ` + message.slice(6);
			} else if (message.startsWith(`|uhtml|`)) {
				const [uhtmlid, html] = Utils.splitFirst(message.slice(7), '|');
				return prefix + `/uhtml ${uhtmlid},${html}`;
			} else if (message.startsWith(`|uhtmlchange|`)) {
				const [uhtmlid, html] = Utils.splitFirst(message.slice(13), '|');
				return prefix + `/uhtmlchange ${uhtmlid},${html}`;
			} else if (message.startsWith(`|modaction|`)) {
				return prefix + `/log ` + message.slice(11);
			} else if (message.startsWith(`|raw|`)) {
				return prefix + `/raw ` + message.slice(5);
			} else if (message.startsWith(`|error|`)) {
				return prefix + `/error ` + message.slice(7);
			} else if (message.startsWith(`|c~|`)) {
				return prefix + message.slice(4);
			} else if (message.startsWith(`|c|~|/`)) {
				return prefix + message.slice(5);
			} else if (message.startsWith(`|c|~|`)) {
				return prefix + `/text ` + message.slice(5);
			}
			return prefix + `/text ` + message;
		}).join(`\n`);
	}
	sendReply(data: string) {
		if (this.isQuiet) return;
		if (this.broadcasting && this.broadcastToRoom) {
			// broadcasting
			this.add(data);
		} else {
			// not broadcasting
			if (!this.room) {
				data = this.pmTransform(data);
				this.connection.send(data);
			} else {
				this.connection.sendTo(this.room, data);
			}
		}
	}
	errorReply(message: string) {
		if (this.bypassRoomCheck) { // if they're not in the room, we still want a good error message for them
			return this.popupReply(
				`|html|<strong class="message-error">${message.replace(/\n/ig, '<br />')}</strong>`
			);
		}
		this.sendReply(`|error|` + message.replace(/\n/g, `\n|error|`));
	}
	addBox(htmlContent: string | JSX.VNode) {
		if (typeof htmlContent !== 'string') htmlContent = JSX.render(htmlContent);
		this.add(`|html|<div class="infobox">${htmlContent}</div>`);
	}
	sendReplyBox(htmlContent: string | JSX.VNode) {
		if (typeof htmlContent !== 'string') htmlContent = JSX.render(htmlContent);
		this.sendReply(`|c|${this.room && this.broadcasting ? this.user.getIdentity() : '~'}|/raw <div class="infobox">${htmlContent}</div>`);
	}
	popupReply(message: string) {
		this.connection.popup(message);
	}
	add(data: string) {
		if (this.room) {
			this.room.add(data);
		} else {
			this.send(data);
		}
	}
	send(data: string) {
		if (this.room) {
			this.room.send(data);
		} else {
			data = this.pmTransform(data);
			this.user.send(data);
			if (this.pmTarget && this.pmTarget !== this.user) {
				this.pmTarget.send(data);
			}
		}
	}

	/** like privateModAction, but also notify Staff room */
	privateGlobalModAction(msg: string) {
		if (this.room && !this.room.roomid.endsWith('staff')) {
			msg = msg.replace(IPTools.ipRegex, '<IP>');
		}
		this.privateModAction(msg);
		if (this.room?.roomid !== 'staff') {
			Rooms.get('staff')?.addByUser(this.user, `${this.room ? `<<${this.room.roomid}>>` : `<PM:${this.pmTarget}>`} ${msg}`).update();
		}
	}
	addGlobalModAction(msg: string) {
		if (this.room && !this.room.roomid.endsWith('staff')) {
			msg = msg.replace(IPTools.ipRegex, '<IP>');
		}
		this.addModAction(msg);
		if (this.room?.roomid !== 'staff') {
			Rooms.get('staff')?.addByUser(this.user, `${this.room ? `<<${this.room.roomid}>>` : `<PM:${this.pmTarget}>`} ${msg}`).update();
		}
	}

	privateModAction(msg: string) {
		if (this.room) {
			if (this.room.roomid === 'staff') {
				this.room.addByUser(this.user, `(${msg})`);
			} else {
				this.room.sendModsByUser(this.user, `(${msg})`);
				// roomlogging in staff causes a duplicate log message, since we do addByUser
				// and roomlogging in pms has no effect, so we can _just_ call this here
				this.roomlog(`(${msg})`);
			}
		} else {
			const data = this.pmTransform(`|modaction|${msg}`);
			this.user.send(data);
			if (this.pmTarget && this.pmTarget !== this.user && this.pmTarget.isStaff) {
				this.pmTarget.send(data);
			}
		}
	}
	globalModlog(action: string, user: string | User | null = null, note: string | null = null, ip?: string) {
		const entry: PartialModlogEntry = {
			action,
			isGlobal: true,
			loggedBy: this.user.id,
			note: note?.replace(/\n/gm, ' ') || '',
		};
		if (user) {
			if (typeof user === 'string') {
				entry.userid = toID(user);
			} else {
				entry.ip = user.latestIp;
				const userid = user.getLastId();
				entry.userid = userid;
				if (user.autoconfirmed && user.autoconfirmed !== userid) entry.autoconfirmedID = user.autoconfirmed;
				const alts = user.getAltUsers(false, true).slice(1).map(alt => alt.getLastId());
				if (alts.length) entry.alts = alts;
			}
		}
		if (ip) entry.ip = ip;
		if (this.room) {
			this.room.modlog(entry);
		} else {
			Rooms.global.modlog(entry);
		}
	}
	modlog(
		action: string,
		user: string | User | null = null,
		note: string | null = null,
		options: Partial<{ noalts: any, noip: any }> = {}
	) {
		const entry: PartialModlogEntry = {
			action,
			loggedBy: this.user.id,
			note: note?.replace(/\n/gm, ' ') || '',
		};
		if (user) {
			if (typeof user === 'string') {
				entry.userid = toID(user);
			} else {
				const userid = user.getLastId();
				entry.userid = userid;
				if (!options.noalts) {
					if (user.autoconfirmed && user.autoconfirmed !== userid) entry.autoconfirmedID = user.autoconfirmed;
					const alts = user.getAltUsers(false, true).slice(1).map(alt => alt.getLastId());
					if (alts.length) entry.alts = alts;
				}
				if (!options.noip) entry.ip = user.latestIp;
			}
		}
		(this.room || Rooms.global).modlog(entry);
	}
	parseSpoiler(reason: string) {
		if (!reason) return { publicReason: "", privateReason: "" };

		let publicReason = reason;
		let privateReason = reason;
		const targetLowercase = reason.toLowerCase();
		if (targetLowercase.includes('spoiler:') || targetLowercase.includes('spoilers:')) {
			const proofIndex = targetLowercase.indexOf(targetLowercase.includes('spoilers:') ? 'spoilers:' : 'spoiler:');
			const proofOffset = (targetLowercase.includes('spoilers:') ? 9 : 8);
			const proof = reason.slice(proofIndex + proofOffset).trim();
			publicReason = reason.slice(0, proofIndex).trim();
			privateReason = `${publicReason}${proof ? ` (PROOF: ${proof})` : ''}`;
		}
		return { publicReason, privateReason };
	}
	roomlog(data: string) {
		if (this.room) this.room.roomlog(data);
	}
	stafflog(data: string) {
		(Rooms.get('staff') || Rooms.lobby || this.room)?.roomlog(data);
	}
	addModAction(msg: string) {
		if (this.room) {
			this.room.addByUser(this.user, msg);
		} else {
			this.send(`|modaction|${msg}`);
		}
	}
	update() {
		if (this.room) this.room.update();
	}
	filter(message: string) {
		return Chat.filter(message, this);
	}
	statusfilter(status: string) {
		return Chat.statusfilter(status, this.user);
	}
	checkCan(permission: RoomPermission, target: User | ID | null, room: Room): undefined;
	checkCan(permission: GlobalPermission, target?: User | ID | null): undefined;
	checkCan(permission: string, target: User | ID | null = null, room: Room | null = null) {
		if (!Users.Auth.hasPermission(this.user, permission, target, room, this.fullCmd, this.cmdToken)) {
			throw new Chat.ErrorMessage(`${this.cmdToken}${this.fullCmd} - Access denied.`);
		}
	}
	privatelyCheckCan(permission: RoomPermission, target: User | ID | null, room: Room): boolean;
	privatelyCheckCan(permission: GlobalPermission, target?: User | ID | null): boolean;
	privatelyCheckCan(permission: string, target: User | ID | null = null, room: Room | null = null) {
		this.handler!.isPrivate = true;
		if (Users.Auth.hasPermission(this.user, permission, target, room, this.fullCmd, this.cmdToken)) {
			return true;
		}
		this.commandDoesNotExist();
	}
	canUseConsole() {
		if (!this.user.hasConsoleAccess(this.connection)) {
			throw new Chat.ErrorMessage(
				(this.cmdToken + this.fullCmd).trim() + " - Requires console access, please set up `Config.consoleips`."
			);
		}
		return true;
	}
	shouldBroadcast() {
		return this.cmdToken === BROADCAST_TOKEN;
	}
	checkBroadcast(overrideCooldown?: boolean | string, suppressMessage?: string | null) {
		if (this.broadcasting || !this.shouldBroadcast()) {
			return true;
		}

		if (this.user.locked && !(this.room?.roomid.startsWith('help-') || this.pmTarget?.can('lock'))) {
			this.errorReply(`You cannot broadcast this command's information while locked.`);
			throw new Chat.ErrorMessage(`To see it for yourself, use: /${this.message.slice(1)}`);
		}

		if (this.room && !this.user.can('show', null, this.room, this.cmd, this.cmdToken)) {
			const perm = this.room.settings.permissions?.[`!${this.cmd}`];
			const atLeast = perm ? `at least rank ${perm}` : 'voiced';
			this.errorReply(`You need to be ${atLeast} to broadcast this command's information.`);
			throw new Chat.ErrorMessage(`To see it for yourself, use: /${this.message.slice(1)}`);
		}

		if (!this.room && !this.pmTarget) {
			this.errorReply(`Broadcasting a command with "!" in a PM or chatroom will show it that user or room.`);
			throw new Chat.ErrorMessage(`To see it for yourself, use: /${this.message.slice(1)}`);
		}

		// broadcast cooldown
		const broadcastMessage = (suppressMessage || this.message).toLowerCase().replace(/[^a-z0-9\s!,]/g, '');
		const cooldownMessage = overrideCooldown === true ? null : (overrideCooldown || broadcastMessage);

		if (
			cooldownMessage && this.room && this.room.lastBroadcast === cooldownMessage &&
			this.room.lastBroadcastTime >= Date.now() - BROADCAST_COOLDOWN
		) {
			throw new Chat.ErrorMessage(`You can't broadcast this because it was just broadcasted. If this was intentional, use !rebroadcast ${this.message}`);
		}

		const message = this.checkChat(suppressMessage || this.message);
		if (!message) {
			throw new Chat.ErrorMessage(`To see it for yourself, use: /${this.message.slice(1)}`);
		}

		// checkChat will only return true with no message
		this.message = message;
		this.broadcastMessage = broadcastMessage;
		return true;
	}
	runBroadcast(overrideCooldown?: boolean | string, suppressMessage: string | null = null) {
		if (this.broadcasting || !this.shouldBroadcast()) {
			// Already being broadcast, or the user doesn't intend to broadcast.
			return true;
		}

		if (!this.broadcastMessage) {
			// Permission hasn't been checked yet. Do it now.
			this.checkBroadcast(overrideCooldown, suppressMessage);
		}

		this.broadcasting = true;

		const message = `${this.broadcastPrefix}${suppressMessage || this.message}`;
		if (this.pmTarget) {
			this.sendReply(`|c~|${message}`);
		} else {
			this.sendReply(`|c|${this.user.getIdentity(this.room)}|${message}`);
		}
		if (this.room) {
			// We don't want broadcasted messages in a room to be translated
			// according to a user's personal language setting.
			this.language = this.room.settings.language || null;
			if (overrideCooldown !== true) {
				this.room.lastBroadcast = overrideCooldown || this.broadcastMessage;
				this.room.lastBroadcastTime = Date.now();
			}
		}

		return true;
	}
	checkChat(message: string, room?: Room | null, targetUser?: User | null): string;
	checkChat(message?: null, room?: Room | null, targetUser?: User | null): void;
	checkChat(message: string | null = null, room: Room | null = null, targetUser: User | null = null) {
		if (!targetUser && this.pmTarget) {
			targetUser = this.pmTarget;
		}
		if (targetUser) {
			room = null;
		} else if (!room) {
			room = this.room;
		}
		const user = this.user;
		const connection = this.connection;

		if (!user.named) {
			throw new Chat.ErrorMessage(this.tr`You must choose a name before you can talk.`);
		}
		if (!user.can('bypassall')) {
			const lockType = (user.namelocked ? this.tr`namelocked` : user.locked ? this.tr`locked` : ``);
			const lockExpiration = Punishments.checkLockExpiration(user.namelocked || user.locked);
			if (room) {
				if (lockType && !room.settings.isHelp) {
					this.sendReply(`|html|<a href="view-help-request--appeal" class="button">${this.tr`Get help with this`}</a>`);
					if (user.locked === '#hostfilter') {
						throw new Chat.ErrorMessage(this.tr`You are locked due to your proxy / VPN and can't talk in chat.`);
					} else {
						throw new Chat.ErrorMessage(this.tr`You are ${lockType} and can't talk in chat. ${lockExpiration}`);
					}
				}
				if (!room.persist && !room.roomid.startsWith('help-') && !(user.registered || user.autoconfirmed)) {
					this.sendReply(
						this.tr`|html|<div class="message-error">You must be registered to chat in temporary rooms (like battles).</div>` +
						this.tr`You may register in the <button name="openOptions"><i class="fa fa-cog"></i> Options</button> menu.`
					);
					throw new Chat.Interruption();
				}
				if (room.isMuted(user)) {
					throw new Chat.ErrorMessage(this.tr`You are muted and cannot talk in this room.`);
				}
				if (room.settings.modchat && !room.auth.atLeast(user, room.settings.modchat)) {
					if (room.settings.modchat === 'autoconfirmed') {
						this.errorReply(
							this.tr`Moderated chat is set. To speak in this room, your account must be autoconfirmed, which means being registered for at least one week and winning at least one rated game (any game started through the 'Battle!' button).`
						);
						if (!user.registered) {
							this.sendReply(this.tr`|html|You may register in the <button name="openOptions"><i class="fa fa-cog"></i> Options</button> menu.`);
						}
						throw new Chat.Interruption();
					}
					if (room.settings.modchat === 'trusted') {
						throw new Chat.ErrorMessage(
							this.tr`Because moderated chat is set, your account must be staff in a public room or have a global rank to speak in this room.`
						);
					}
					const groupName = Config.groups[room.settings.modchat] && Config.groups[room.settings.modchat].name ||
						room.settings.modchat;
					throw new Chat.ErrorMessage(
						this.tr`Because moderated chat is set, you must be of rank ${groupName} or higher to speak in this room.`
					);
				}
				if (!this.bypassRoomCheck && !(user.id in room.users)) {
					connection.popup(`You can't send a message to this room without being in it.`);
					return null;
				}
			}
			if (targetUser) {
				// this accounts for users who are autoconfirmed on another alt, but not registered
				if (!(user.registered || user.autoconfirmed)) {
					this.sendReply(
						this.tr`|html|<div class="message-error">You must be registered to send private messages.</div>` +
						this.tr`You may register in the <button name="openOptions"><i class="fa fa-cog"></i> Options</button> menu.`
					);
					throw new Chat.Interruption();
				}
				if (targetUser.id !== user.id && !(targetUser.registered || targetUser.autoconfirmed)) {
					throw new Chat.ErrorMessage(this.tr`That user is unregistered and cannot be PMed.`);
				}
				if (lockType && !targetUser.can('lock')) {
					this.sendReply(`|html|<a href="view-help-request--appeal" class="button">${this.tr`Get help with this`}</a>`);
					if (user.locked === '#hostfilter') {
						throw new Chat.ErrorMessage(this.tr`You are locked due to your proxy / VPN and can only private message members of the global moderation team.`);
					} else {
						throw new Chat.ErrorMessage(this.tr`You are ${lockType} and can only private message members of the global moderation team. ${lockExpiration}`);
					}
				}
				if (targetUser.locked && !user.can('lock')) {
					throw new Chat.ErrorMessage(this.tr`The user "${targetUser.name}" is locked and cannot be PMed.`);
				}
				if (Config.pmmodchat && !Users.globalAuth.atLeast(user, Config.pmmodchat) &&
					!Users.Auth.hasPermission(targetUser, 'promote', Config.pmmodchat as GroupSymbol)) {
					const groupName = Config.groups[Config.pmmodchat] && Config.groups[Config.pmmodchat].name || Config.pmmodchat;
					throw new Chat.ErrorMessage(this.tr`On this server, you must be of rank ${groupName} or higher to PM users.`);
				}
				if (!this.checkCanPM(targetUser)) {
					Chat.maybeNotifyBlocked('pm', targetUser, user);
					if (!targetUser.can('lock')) {
						throw new Chat.ErrorMessage(this.tr`This user is blocking private messages right now.`);
					} else {
						this.sendReply(`|html|${this.tr`If you need help, try opening a <a href="view-help-request" class="button">help ticket</a>`}`);
						throw new Chat.ErrorMessage(this.tr`This ${Config.groups[targetUser.tempGroup].name} is too busy to answer private messages right now. Please contact a different staff member.`);
					}
				}
				if (!this.checkCanPM(user, targetUser)) {
					throw new Chat.ErrorMessage(this.tr`You are blocking private messages right now.`);
				}
			}
		}

		if (typeof message !== 'string') return true;

		if (!message) {
			throw new Chat.ErrorMessage(this.tr`Your message can't be blank.`);
		}
		let length = message.length;
		length += 10 * message.replace(/[^\ufdfd]*/g, '').length;
		if (length > MAX_MESSAGE_LENGTH && !user.can('ignorelimits')) {
			throw new Chat.ErrorMessage(this.tr`Your message is too long: ` + message);
		}

		// remove zalgo
		message = message.replace(
			/[\u0300-\u036f\u0483-\u0489\u0610-\u0615\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06ED\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g,
			''
		);
		if (/[\u3164\u115f\u1160\u239b-\u23b9]/.test(message)) {
			throw new Chat.ErrorMessage(this.tr`Your message contains banned characters.`);
		}

		// If the corresponding config option is set, non-AC users cannot send links, except to staff.
		if (Config.restrictLinks && !user.autoconfirmed) {
			if (this.checkBannedLinks(message).length && !(targetUser?.can('lock') || room?.settings.isHelp)) {
				throw new Chat.ErrorMessage("Your account must be autoconfirmed to send links to other users, except for global staff.");
			}
		}

		this.checkFormat(room, user, message);

		this.checkSlowchat(room, user);

		if (room && !user.can('mute', null, room)) this.checkBanwords(room, message);

		const gameFilter = this.checkGameFilter();
		if (typeof gameFilter === 'string') {
			if (gameFilter === '') throw new Chat.Interruption();
			throw new Chat.ErrorMessage(gameFilter);
		}

		if (room?.settings.highTraffic &&
			toID(message).replace(/[^a-z]+/, '').length < 2 &&
			!user.can('show', null, room)) {
			throw new Chat.ErrorMessage(
				this.tr`Due to this room being a high traffic room, your message must contain at least two letters.`
			);
		}

		if (room) {
			const normalized = message.trim();
			if (
				!user.can('bypassall') && (['help', 'lobby'].includes(room.roomid)) && (normalized === user.lastMessage) &&
				((Date.now() - user.lastMessageTime) < MESSAGE_COOLDOWN) && !Config.nothrottle
			) {
				throw new Chat.ErrorMessage(this.tr`You can't send the same message again so soon.`);
			}
			user.lastMessage = message;
			user.lastMessageTime = Date.now();
		}

		if (Chat.filters.length) {
			return this.filter(message);
		}

		return message;
	}
	checkCanPM(targetUser: User, user?: User) {
		if (!user) user = this.user;
		if (user.id === targetUser.id) return true; // lol.
		const setting = targetUser.settings.blockPMs;
		if (user.can('lock') || !setting) return true;
		if (setting === true && !user.can('lock')) return false; // this is to appease TS
		const friends = targetUser.friends || new Set();
		if (setting === 'friends') return friends.has(user.id);
		return Users.globalAuth.atLeast(user, setting as AuthLevel);
	}
	checkPMHTML(targetUser: User) {
		if (!(this.room && (targetUser.id in this.room.users)) && !this.user.can('addhtml')) {
			throw new Chat.ErrorMessage("You do not have permission to use PM HTML to users who are not in this room.");
		}
		const friends = targetUser.friends || new Set();
		if (
			targetUser.settings.blockPMs &&
			(targetUser.settings.blockPMs === true ||
				(targetUser.settings.blockPMs === 'friends' && !friends.has(this.user.id)) ||
				!Users.globalAuth.atLeast(this.user, targetUser.settings.blockPMs as AuthLevel)) &&
				!this.user.can('lock')
		) {
			Chat.maybeNotifyBlocked('pm', targetUser, this.user);
			throw new Chat.ErrorMessage("This user is currently blocking PMs.");
		}
		if (targetUser.locked && !this.user.can('lock')) {
			throw new Chat.ErrorMessage("This user is currently locked, so you cannot send them HTML.");
		}
		return true;
	}

	checkBannedLinks(message: string) {
		// RegExp#exec only returns one match, String#match returns all of them
		return (message.match(Chat.linkRegex) || []).filter(link => {
			link = link.toLowerCase();
			const domainMatches = /^(?:http:\/\/|https:\/\/)?(?:[^/]*\.)?([^/.]*\.[^/.]*)\.?($|\/|:)/.exec(link);
			const domain = domainMatches?.[1];
			const hostMatches = /^(?:http:\/\/|https:\/\/)?([^/]*[^/.])\.?($|\/|:)/.exec(link);
			let host = hostMatches?.[1];
			if (host?.startsWith('www.')) host = host.slice(4);
			if (!domain || !host) return null;
			return !(LINK_WHITELIST.includes(host) || LINK_WHITELIST.includes(`*.${domain}`));
		});
	}
	checkEmbedURI(uri: string) {
		if (uri.startsWith('https://')) return uri;
		if (uri.startsWith('//')) return uri;
		if (uri.startsWith('data:')) {
			return uri;
		} else {
			throw new Chat.ErrorMessage("Image URLs must begin with 'https://' or 'data:'; 'http://' cannot be used.");
		}
	}
	/**
	 * This is a quick and dirty first-pass "is this good HTML" check. The full
	 * sanitization is done on the client by Caja in `src/battle-log.ts`
	 * `BattleLog.sanitizeHTML`.
	 */
	checkHTML(htmlContent: string | null) {
		htmlContent = `${htmlContent || ''}`.trim();
		if (!htmlContent) return '';
		if (/>here.?</i.test(htmlContent) || /click here/i.test(htmlContent)) {
			throw new Chat.ErrorMessage('Do not use "click here" – See [[Design standard #2 <https://github.com/smogon/pokemon-showdown/blob/master/CONTRIBUTING.md#design-standards>]]');
		}

		// check for mismatched tags
		const tags = htmlContent.match(/<!--.*?-->|<\/?[^<>]*/g);
		if (tags) {
			const ILLEGAL_TAGS = [
				'script', 'head', 'body', 'html', 'canvas', 'base', 'meta', 'link', 'iframe',
			];
			const LEGAL_AUTOCLOSE_TAGS = [
				// void elements (no-close tags)
				'br', 'area', 'embed', 'hr', 'img', 'source', 'track', 'input', 'wbr', 'col',
				// autoclose tags
				'p', 'li', 'dt', 'dd', 'option', 'tr', 'th', 'td', 'thead', 'tbody', 'tfoot', 'colgroup',
				// PS custom element
				'psicon', 'youtube',
			];
			const stack = [];
			for (const tag of tags) {
				const isClosingTag = tag.charAt(1) === '/';
				const contentEndLoc = tag.endsWith('/') ? -1 : undefined;
				const tagContent = tag.slice(isClosingTag ? 2 : 1, contentEndLoc).replace(/\s+/, ' ').trim();
				const tagNameEndIndex = tagContent.indexOf(' ');
				const tagName = tagContent.slice(0, tagNameEndIndex >= 0 ? tagNameEndIndex : undefined).toLowerCase();
				if (tagName === '!--') continue;
				if (isClosingTag) {
					if (LEGAL_AUTOCLOSE_TAGS.includes(tagName)) continue;
					if (!stack.length) {
						throw new Chat.ErrorMessage(`Extraneous </${tagName}> without an opening tag.`);
					}
					const expectedTagName = stack.pop();
					if (tagName !== expectedTagName) {
						throw new Chat.ErrorMessage(`Extraneous </${tagName}> where </${expectedTagName}> was expected.`);
					}
					continue;
				}

				if (ILLEGAL_TAGS.includes(tagName) || !/^[a-z]+[0-9]?$/.test(tagName)) {
					throw new Chat.ErrorMessage(`Illegal tag <${tagName}> can't be used here.`);
				}
				if (!LEGAL_AUTOCLOSE_TAGS.includes(tagName)) {
					stack.push(tagName);
				}

				if (tagName === 'img') {
					if (!this.room || (this.room.settings.isPersonal && !this.user.can('lock'))) {
						throw new Chat.ErrorMessage(
							`This tag is not allowed: <${tagContent}>. Images are not allowed outside of chatrooms.`
						);
					}
					if (!/width ?= ?(?:[0-9]+|"[0-9]+")/i.test(tagContent) || !/height ?= ?(?:[0-9]+|"[0-9]+")/i.test(tagContent)) {
						// Width and height are required because most browsers insert the
						// <img> element before width and height are known, and when the
						// image is loaded, this changes the height of the chat area, which
						// messes up autoscrolling.
						this.errorReply(`This image is missing a width/height attribute: <${tagContent}>`);
						throw new Chat.ErrorMessage(`Images without predefined width/height cause problems with scrolling because loading them changes their height.`);
					}
					const srcMatch = / src ?= ?(?:"|')?([^ "']+)(?: ?(?:"|'))?/i.exec(tagContent);
					if (srcMatch) {
						this.checkEmbedURI(srcMatch[1]);
					} else {
						this.errorReply(`This image has a broken src attribute: <${tagContent}>`);
						throw new Chat.ErrorMessage(`The src attribute must exist and have no spaces in the URL`);
					}
				}
				if (tagName === 'button') {
					if ((!this.room || this.room.settings.isPersonal || this.room.settings.isPrivate === true) && !this.user.can('lock')) {
						const buttonName = / name ?= ?"([^"]*)"/i.exec(tagContent)?.[1];
						const buttonValue = / value ?= ?"([^"]*)"/i.exec(tagContent)?.[1];
						const msgCommandRegex = /^\/(?:msg|pm|w|whisper|botmsg) /;
						const botmsgCommandRegex = /^\/msgroom (?:[a-z0-9-]+), ?\/botmsg /;
						if (buttonName === 'send' && buttonValue && msgCommandRegex.test(buttonValue)) {
							const [pmTarget] = buttonValue.replace(msgCommandRegex, '').split(',');
							const auth = this.room ? this.room.auth : Users.globalAuth;
							if (auth.get(toID(pmTarget)) !== '*' && toID(pmTarget) !== this.user.id) {
								this.errorReply(`This button is not allowed: <${tagContent}>`);
								throw new Chat.ErrorMessage(`Your scripted button can't send PMs to ${pmTarget}, because that user is not a Room Bot.`);
							}
						} else if (buttonName === 'send' && buttonValue && botmsgCommandRegex.test(buttonValue)) {
							// no need to validate the bot being an actual bot; `/botmsg` will do it for us and is not abusable
						} else if (buttonName) {
							this.errorReply(`This button is not allowed: <${tagContent}>`);
							this.errorReply(`You do not have permission to use most buttons. Here are the two types you're allowed to use:`);
							this.errorReply(`1. Linking to a room: <a href="/roomid"><button>go to a place</button></a>`);
							throw new Chat.ErrorMessage(`2. Sending a message to a Bot: <button name="send" value="/msgroom BOT_ROOMID, /botmsg BOT_USERNAME, MESSAGE">send the thing</button>`);
						}
					}
				}
			}
			if (stack.length) {
				throw new Chat.ErrorMessage(`Missing </${stack.pop()}>.`);
			}
		}

		return htmlContent;
	}

	/**
	 * This is to be used for commands that replicate other commands
	 * (for example, `/pm username, command` or `/msgroom roomid, command`)
	 * to ensure they do not crash with too many levels of recursion.
	 */
	checkRecursion() {
		if (this.recursionDepth > 5) {
			throw new Chat.ErrorMessage(`/${this.cmd} - Too much command recursion has occurred.`);
		}
	}

	requireRoom(id?: RoomID) {
		if (!this.room) {
			throw new Chat.ErrorMessage(`/${this.cmd} - must be used in a chat room, not a ${this.pmTarget ? "PM" : "console"}`);
		}
		if (id && this.room.roomid !== id) {
			const targetRoom = Rooms.get(id);
			if (!targetRoom) {
				throw new Chat.ErrorMessage(`This command can only be used in the room '${id}', but that room does not exist.`);
			}
			throw new Chat.ErrorMessage(`This command can only be used in the ${targetRoom.title} room.`);
		}
		return this.room;
	}
	requireGame<T extends RoomGame>(constructor: new (...args: any[]) => T, subGame = false) {
		const room = this.requireRoom();
		if (subGame) {
			if (!room.subGame) {
				throw new Chat.ErrorMessage(`This command requires a sub-game of ${constructor.name} (this room has no sub-game).`);
			}
			const game = room.getGame(constructor, subGame);
			// must be a different game
			if (!game) {
				throw new Chat.ErrorMessage(`This command requires a sub-game of ${constructor.name} (this sub-game is ${room.subGame.title}).`);
			}
			return game;
		}
		if (!room.game) {
			throw new Chat.ErrorMessage(`This command requires a game of ${constructor.name} (this room has no game).`);
		}
		const game = room.getGame(constructor);
		// must be a different game
		if (!game) {
			throw new Chat.ErrorMessage(`This command requires a game of ${constructor.name} (this game is ${room.game.title}).`);
		}
		return game;
	}
	requireMinorActivity<T extends MinorActivity>(constructor: new (...args: any[]) => T) {
		const room = this.requireRoom();
		if (!room.minorActivity) {
			throw new Chat.ErrorMessage(`This command requires a ${constructor.name} (this room has no minor activity).`);
		}
		const game = room.getMinorActivity(constructor);
		// must be a different game
		if (!game) {
			throw new Chat.ErrorMessage(`This command requires a ${constructor.name} (this minor activity is a(n) ${room.minorActivity.name}).`);
		}
		return game;
	}
	commandDoesNotExist(): never {
		if (this.cmdToken === '!') {
			throw new Chat.ErrorMessage(`The command "${this.cmdToken}${this.fullCmd}" does not exist.`);
		}
		throw new Chat.ErrorMessage(
			`The command "${(this.cmdToken + this.fullCmd).trim()}" does not exist. To send a message starting with "${this.cmdToken}${this.fullCmd}", type "${this.cmdToken}${this.cmdToken}${this.fullCmd}".`
		);
	}
	refreshPage(pageid: string) {
		if (this.connection.openPages?.has(pageid)) {
			this.parse(`/join view-${pageid}`);
		}
	}
	closePage(pageid: string) {
		for (const connection of this.user.connections) {
			if (connection.openPages?.has(pageid)) {
				connection.send(`>view-${pageid}\n|deinit`);
				connection.openPages.delete(pageid);
				if (!connection.openPages.size) {
					connection.openPages = null;
				}
			}
		}
	}
}

export const Chat = new class {
	constructor() {
		void this.loadTranslations().then(() => {
			Chat.translationsLoaded = true;
		});
	}
	translationsLoaded = false;
	/**
	 * As per the node.js documentation at https://nodejs.org/api/timers.html#timers_settimeout_callback_delay_args,
	 * timers with durations that are too long for a 32-bit signed integer will be invoked after 1 millisecond,
	 * which tends to cause unexpected behavior.
	 */
	readonly MAX_TIMEOUT_DURATION = 2147483647;
	readonly Friends = new FriendsDatabase();
	readonly PM = PM;
	readonly PrivateMessages = PrivateMessages;

	readonly multiLinePattern = new PatternTester();

	/*********************************************************
	 * Load command files
	 *********************************************************/
	baseCommands!: AnnotatedChatCommands;
	commands!: AnnotatedChatCommands;
	basePages!: PageTable;
	pages!: PageTable;
	readonly destroyHandlers: (() => void)[] = [Artemis.destroy];
	readonly crqHandlers: { [k: string]: CRQHandler } = {};
	readonly handlers: { [k: string]: ((...args: any) => any)[] } = Object.create(null);
	/** The key is the name of the plugin. */
	readonly plugins: { [k: string]: ChatPlugin } = {};
	/** Will be empty except during hotpatch */
	oldPlugins: { [k: string]: ChatPlugin } = {};
	roomSettings: SettingsHandler[] = [];

	/*********************************************************
	 * Load chat filters
	 *********************************************************/
	readonly filters: ChatFilter[] = [];
	filter(message: string, context: CommandContext) {
		// Chat filters can choose to:
		// 1. return false OR null - to not send a user's message
		// 2. return an altered string - to alter a user's message
		// 3. return undefined to send the original message through
		const originalMessage = message;
		for (const curFilter of Chat.filters) {
			const output = curFilter.call(
				context,
				message,
				context.user,
				context.room,
				context.connection,
				context.pmTarget,
				originalMessage
			);
			if (output === false) return null;
			if (!output && output !== undefined) return output;
			if (output !== undefined) message = output;
		}

		return message;
	}

	readonly namefilters: NameFilter[] = [];
	namefilter(name: string, user: User) {
		if (!Config.disablebasicnamefilter) {
			// whitelist
			// \u00A1-\u00BF\u00D7\u00F7  Latin punctuation/symbols
			// \u02B9-\u0362              basic combining accents
			// \u2012-\u2027\u2030-\u205E Latin punctuation/symbols extended
			// \u2050-\u205F              fractions extended
			// \u2190-\u23FA\u2500-\u2BD1 misc symbols
			// \u2E80-\u32FF              CJK symbols
			// \u3400-\u9FFF              CJK
			// \uF900-\uFAFF\uFE00-\uFE6F CJK extended
			name = name.replace(
				// eslint-disable-next-line no-misleading-character-class
				/[^a-zA-Z0-9 /\\.~()<>^*%&=+$#_'?!"\u00A1-\u00BF\u00D7\u00F7\u02B9-\u0362\u2012-\u2027\u2030-\u205E\u2050-\u205F\u2190-\u23FA\u2500-\u2BD1\u2E80-\u32FF\u3400-\u9FFF\uF900-\uFAFF\uFE00-\uFE6F-]+/g,
				''
			);

			// blacklist
			// \u00a1 upside-down exclamation mark (i)
			// \u2580-\u2590 black bars
			// \u25A0\u25Ac\u25AE\u25B0 black bars
			// \u534d\u5350 swastika
			// \u2a0d crossed integral (f)
			name = name.replace(/[\u00a1\u2580-\u2590\u25A0\u25Ac\u25AE\u25B0\u2a0d\u534d\u5350]/g, '');

			// e-mail address
			if (name.includes('@') && name.includes('.')) return '';

			// url
			if (/[a-z0-9]\.(com|net|org|us|uk|co|gg|tk|ml|gq|ga|xxx|download|stream)\b/i.test(name)) name = name.replace(/\./g, '');

			// Limit the amount of symbols allowed in usernames to 4 maximum, and
			// disallow (R) and (C) from being used in the middle of names.
			const nameSymbols = name.replace(
				/[^\u00A1-\u00BF\u00D7\u00F7\u02B9-\u0362\u2012-\u2027\u2030-\u205E\u2050-\u205F\u2090-\u23FA\u2500-\u2BD1]+/g,
				''
			);
			// \u00ae\u00a9 (R) (C)
			if (
				nameSymbols.length > 4 ||
				/[^a-z0-9][a-z0-9][^a-z0-9]/.test(name.toLowerCase() + ' ') || /[\u00ae\u00a9].*[a-zA-Z0-9]/.test(name)
			) {
				name = name.replace(
					// eslint-disable-next-line no-misleading-character-class
					/[\u00A1-\u00BF\u00D7\u00F7\u02B9-\u0362\u2012-\u2027\u2030-\u205E\u2050-\u205F\u2190-\u23FA\u2500-\u2BD1\u2E80-\u32FF\u3400-\u9FFF\uF900-\uFAFF\uFE00-\uFE6F]+/g,
					''
				).replace(/[^A-Za-z0-9]{2,}/g, ' ').trim();
			}
		}
		name = name.replace(/^[^A-Za-z0-9]+/, ""); // remove symbols from start
		name = name.replace(/@/g, ""); // Remove @ as this is used to indicate status messages

		// cut name length down to 18 chars
		if (/[A-Za-z0-9]/.test(name.slice(18))) {
			name = name.replace(/[^A-Za-z0-9]+/g, "");
		} else {
			name = name.slice(0, 18);
		}

		name = Dex.getName(name);
		for (const curFilter of Chat.namefilters) {
			name = curFilter(name, user);
			if (!name) return '';
		}
		return name;
	}

	readonly hostfilters: HostFilter[] = [];
	hostfilter(host: string, user: User, connection: Connection, hostType: string) {
		for (const curFilter of Chat.hostfilters) {
			curFilter(host, user, connection, hostType);
		}
	}

	readonly loginfilters: LoginFilter[] = [];
	loginfilter(user: User, oldUser: User | null, usertype: string) {
		for (const curFilter of Chat.loginfilters) {
			curFilter(user, oldUser, usertype);
		}
	}

	readonly punishmentfilters: PunishmentFilter[] = [];
	punishmentfilter(user: User | ID, punishment: Punishment) {
		for (const curFilter of Chat.punishmentfilters) {
			curFilter(user, punishment);
		}
	}

	readonly nicknamefilters: NicknameFilter[] = [];
	nicknamefilter(nickname: string, user: User) {
		for (const curFilter of Chat.nicknamefilters) {
			const filtered = curFilter(nickname, user);
			if (filtered === false) return false;
			if (!filtered) return '';
		}
		return nickname;
	}

	readonly statusfilters: StatusFilter[] = [];
	statusfilter(status: string, user: User) {
		status = status.replace(/\|/g, '');
		for (const curFilter of Chat.statusfilters) {
			status = curFilter(status, user);
			if (!status) return '';
		}
		return status;
	}
	/*********************************************************
	 * Translations
	 *********************************************************/
	/** language id -> language name */
	readonly languages = new Map<ID, string>();
	/** language id -> (english string -> translated string) */
	readonly translations = new Map<ID, Map<string, [string, string[], string[]]>>();

	async loadTranslations() {
		const directories = await FS(TRANSLATION_DIRECTORY).readdir();

		// ensure that english is the first entry when we iterate over Chat.languages
		Chat.languages.set('english' as ID, 'English');
		for (const dirname of directories) {
			// translation dirs shouldn't have caps, but things like sourceMaps and the README will
			if (/[^a-z0-9]/.test(dirname)) continue;
			const dir = FS(`${TRANSLATION_DIRECTORY}/${dirname}`);

			// For some reason, toID() isn't available as a global when this executes.
			const languageID = Dex.toID(dirname);
			const files = await dir.readdir();
			for (const filename of files) {
				if (!filename.endsWith('.js')) continue;

				const content: Translations = require(`${TRANSLATION_DIRECTORY}/${dirname}/${filename}`).translations;

				if (!Chat.translations.has(languageID)) {
					Chat.translations.set(languageID, new Map());
				}
				const translationsSoFar = Chat.translations.get(languageID)!;

				if (content.name && !Chat.languages.has(languageID)) {
					Chat.languages.set(languageID, content.name);
				}

				if (content.strings) {
					for (const key in content.strings) {
						const keyLabels: string[] = [];
						const valLabels: string[] = [];
						const newKey = key.replace(/\${.+?}/g, str => {
							keyLabels.push(str);
							return '${}';
						}).replace(/\[TN: ?.+?\]/g, '');
						const val = content.strings[key].replace(/\${.+?}/g, (str: string) => {
							valLabels.push(str);
							return '${}';
						}).replace(/\[TN: ?.+?\]/g, '');
						translationsSoFar.set(newKey, [val, keyLabels, valLabels]);
					}
				}
			}
			if (!Chat.languages.has(languageID)) {
				// Fallback in case no translation files provide the language's name
				Chat.languages.set(languageID, "Unknown Language");
			}
		}
	}
	tr(language: ID | null): (fStrings: TemplateStringsArray | string, ...fKeys: any) => string;
	tr(language: ID | null, strings: TemplateStringsArray | string, ...keys: any[]): string;
	tr(language: ID | null, strings: TemplateStringsArray | string = '', ...keys: any[]) {
		if (!language) language = 'english' as ID;
		// If strings is an array (normally the case), combine before translating.
		const trString = typeof strings === 'string' ? strings : strings.join('${}');

		if (Chat.translationsLoaded && !Chat.translations.has(language)) {
			throw new Error(`Trying to translate to a nonexistent language: ${language}`);
		}
		if (!strings.length) {
			return (fStrings: TemplateStringsArray | string, ...fKeys: any) => Chat.tr(language, fStrings, ...fKeys);
		}

		const entry = Chat.translations.get(language)?.get(trString);
		let [translated, keyLabels, valLabels] = entry || ["", [], []];
		if (!translated) translated = trString;

		// Replace the gaps in the species string
		if (keys.length) {
			let reconstructed = '';

			const left: (string | null)[] = keyLabels.slice();
			for (const [i, str] of translated.split('${}').entries()) {
				reconstructed += str;
				if (keys[i]) {
					let index = left.indexOf(valLabels[i]);
					if (index < 0) {
						index = left.findIndex(val => !!val);
					}
					if (index < 0) index = i;
					reconstructed += keys[index];
					left[index] = null;
				}
			}

			translated = reconstructed;
		}
		return translated;
	}

	/**
	 * SQL handler
	 *
	 * All chat plugins share one database.
	 * Chat.databaseReadyPromise will be truthy if the database is not yet ready.
	 */
	database = SQL(module, {
		file: global.Config?.nofswriting ? ':memory:' : PLUGIN_DATABASE_PATH,
		processes: global.Config?.chatdbprocesses,
	});
	databaseReadyPromise: Promise<void> | null = null;

	async prepareDatabase() {
		// PLEASE NEVER ACTUALLY ADD MIGRATIONS
		// things break in weird ways that are hard to reason about, probably because of subprocesses
		// it WILL crash and it WILL make your life and that of your users extremely unpleasant until it is fixed
		if (process.send) return; // We don't need a database in a subprocess that requires Chat.
		if (!Config.usesqlite) return;
		// check if we have the db_info table, which will always be present unless the schema needs to be initialized
		const { hasDBInfo } = await this.database.get(
			`SELECT count(*) AS hasDBInfo FROM sqlite_master WHERE type = 'table' AND name = 'db_info'`
		);
		if (!hasDBInfo) await this.database.runFile('./databases/schemas/chat-plugins.sql');

		const result = await this.database.get(
			`SELECT value as curVersion FROM db_info WHERE key = 'version'`
		);
		const curVersion = parseInt(result.curVersion);
		if (!curVersion) throw new Error(`db_info table is present, but schema version could not be parsed`);

		// automatically run migrations of the form "v{number}.sql" in the migrations/chat-plugins folder
		const migrationsFolder = './databases/migrations/chat-plugins';
		const migrationsToRun = [];
		for (const migrationFile of (await FS(migrationsFolder).readdir())) {
			const migrationVersion = parseInt(/v(\d+)\.sql$/.exec(migrationFile)?.[1] || '');
			if (!migrationVersion) continue;
			if (migrationVersion > curVersion) {
				migrationsToRun.push({ version: migrationVersion, file: migrationFile });
				Monitor.adminlog(`Pushing to migrationsToRun: ${migrationVersion} at ${migrationFile} - mainModule ${process.mainModule === module} !process.send ${!process.send}`);
			}
		}
		Utils.sortBy(migrationsToRun, ({ version }) => version);
		for (const { file } of migrationsToRun) {
			await this.database.runFile(pathModule.resolve(migrationsFolder, file));
		}

		Chat.destroyHandlers.push(
			() => void Chat.database?.destroy(),
			() => Chat.PrivateMessages.destroy(),
		);
	}

	readonly MessageContext = MessageContext;
	readonly CommandContext = CommandContext;
	readonly PageContext = PageContext;
	readonly ErrorMessage = ErrorMessage;
	readonly Interruption = Interruption;

	// JSX handling
	readonly JSX = JSX;
	readonly html = JSX.html;
	readonly h = JSX.h;
	readonly Fragment = JSX.Fragment;

	/**
	 * Command parser
	 *
	 * Usage:
	 *   Chat.parse(message, room, user, connection)
	 *
	 * Parses the message. If it's a command, the command is executed, if
	 * not, it's displayed directly in the room.
	 *
	 * Examples:
	 *   Chat.parse("/join lobby", room, user, connection)
	 *     will make the user join the lobby.
	 *
	 *   Chat.parse("Hi, guys!", room, user, connection)
	 *     will return "Hi, guys!" if the user isn't muted, or
	 *     if he's muted, will warn him that he's muted.
	 *
	 * The return value is the return value of the command handler, if any,
	 * or the message, if there wasn't a command. This value could be a success
	 * or failure (few commands report these) or a Promise for when the command
	 * is done executing, if it's not currently done.
	 *
	 * @param message - the message the user is trying to say
	 * @param room - the room the user is trying to say it in
	 * @param user - the user that sent the message
	 * @param connection - the connection the user sent the message from
	 */
	parse(message: string, room: Room | null | undefined, user: User, connection: Connection) {
		Chat.loadPlugins();

		const initialRoomlogLength = room?.log.getLineCount();
		const context = new CommandContext({ message, room, user, connection });
		const start = Date.now();
		const result = context.parse();
		if (typeof result?.then === 'function') {
			void result.then(() => {
				this.logSlowMessage(start, context);
			});
		} else {
			this.logSlowMessage(start, context);
		}
		if (room && room.log.getLineCount() !== initialRoomlogLength) {
			room.messagesSent++;
			for (const [handler, numMessages] of room.nthMessageHandlers) {
				if (room.messagesSent % numMessages === 0) handler(room, message);
			}
		}

		return result;
	}
	logSlowMessage(start: number, context: CommandContext) {
		const timeUsed = Date.now() - start;
		if (timeUsed < 1000) return;
		if (context.cmd === 'search' || context.cmd === 'savereplay') return;

		const logMessage = (
			`[slow command] ${timeUsed}ms - ${context.user.name} (${context.connection.ip}): ` +
			`<${context.room ? context.room.roomid : context.pmTarget ? `PM:${context.pmTarget?.name}` : 'CMD'}> ` +
			`${context.message.replace(/\n/ig, ' ')}`
		);

		Monitor.slow(logMessage);
	}

	packageData: AnyObject = {};

	getPluginName(file: string) {
		const nameWithExt = pathModule.relative(__dirname, file).replace(/^chat-(?:commands|plugins)./, '');
		let name = nameWithExt.slice(0, nameWithExt.lastIndexOf('.'));
		if (name.endsWith('/index')) name = name.slice(0, -6);
		return name;
	}

	loadPluginFile(file: string) {
		if (!file.endsWith('.js')) return;
		this.loadPlugin(require(file), this.getPluginName(file));
	}

	loadPluginDirectory(dir: string, depth = 0) {
		for (const file of FS(dir).readdirSync()) {
			const path = pathModule.resolve(dir, file);
			if (FS(path).isDirectorySync()) {
				depth++;
				if (depth > MAX_PLUGIN_LOADING_DEPTH) continue;
				this.loadPluginDirectory(path, depth);
			} else {
				try {
					this.loadPluginFile(path);
				} catch (e) {
					Monitor.crashlog(e, "A loading chat plugin");
					continue;
				}
			}
		}
	}
	annotateCommands(commandTable: AnyObject, namespace = ''): AnnotatedChatCommands {
		for (const cmd in commandTable) {
			const entry = commandTable[cmd];
			if (typeof entry === 'object') {
				this.annotateCommands(entry, `${namespace}${cmd} `);
			}
			if (typeof entry === 'string') {
				const base = commandTable[entry];
				if (!base) continue;
				if (!base.aliases) base.aliases = [];
				if (!base.aliases.includes(cmd)) base.aliases.push(cmd);
				continue;
			}
			if (typeof entry !== 'function') continue;

			const handlerCode = entry.toString();
			entry.requiresRoom = /requireRoom\((?:'|"|`)(.*?)(?:'|"|`)/.exec(handlerCode)?.[1] as RoomID || /this\.requireRoom\(/.test(handlerCode);
			entry.hasRoomPermissions = /\bthis\.(checkCan|can)\([^,)\n]*, [^,)\n]*,/.test(handlerCode);
			entry.broadcastable = cmd.endsWith('help') || /\bthis\.(?:(check|can|run|should)Broadcast)\(/.test(handlerCode);
			entry.isPrivate = /\bthis\.(?:privately(Check)?Can|commandDoesNotExist)\(/.test(handlerCode);
			entry.requiredPermission = /this\.(?:checkCan|privately(?:Check)?Can)\(['`"]([a-zA-Z0-9]+)['"`](\)|, )/.exec(handlerCode)?.[1];
			if (!entry.aliases) entry.aliases = [];

			// assign properties from the base command if the current command uses CommandContext.run.
			const runsCommand = /this.run\((?:'|"|`)(.*?)(?:'|"|`)\)/.exec(handlerCode);
			if (runsCommand) {
				const [, baseCommand] = runsCommand;
				const baseEntry = commandTable[baseCommand];
				if (baseEntry) {
					if (baseEntry.requiresRoom) entry.requiresRoom = baseEntry.requiresRoom;
					if (baseEntry.hasRoomPermissions) entry.hasRoomPermissions = baseEntry.hasRoomPermissions;
					if (baseEntry.broadcastable) entry.broadcastable = baseEntry.broadcastable;
					if (baseEntry.isPrivate) entry.isPrivate = baseEntry.isPrivate;
				}
			}
			// This is usually the same as `entry.name`, but some weirdness like
			// `commands.a = b` could screw it up. This should make it consistent.
			entry.cmd = cmd;
			entry.fullCmd = `${namespace}${cmd}`;
		}
		return commandTable;
	}
	loadPlugin(plugin: AnyObject, name: string) {
		// esbuild builds cjs exports in such a way that they use getters, leading to crashes
		// in the plugin.roomSettings = [plugin.roomSettings] action. So, we have to make them not getters
		plugin = { ...plugin };
		if (plugin.commands) {
			Object.assign(Chat.commands, this.annotateCommands(plugin.commands));
		}
		if (plugin.pages) {
			Object.assign(Chat.pages, plugin.pages);
		}

		if (plugin.destroy) {
			Chat.destroyHandlers.push(plugin.destroy);
		}
		if (plugin.crqHandlers) {
			Object.assign(Chat.crqHandlers, plugin.crqHandlers);
		}
		if (plugin.roomSettings) {
			if (!Array.isArray(plugin.roomSettings)) plugin.roomSettings = [plugin.roomSettings];
			Chat.roomSettings = Chat.roomSettings.concat(plugin.roomSettings);
		}
		if (plugin.chatfilter) Chat.filters.push(plugin.chatfilter);
		if (plugin.namefilter) Chat.namefilters.push(plugin.namefilter);
		if (plugin.hostfilter) Chat.hostfilters.push(plugin.hostfilter);
		if (plugin.loginfilter) Chat.loginfilters.push(plugin.loginfilter);
		if (plugin.punishmentfilter) Chat.punishmentfilters.push(plugin.punishmentfilter);
		if (plugin.nicknamefilter) Chat.nicknamefilters.push(plugin.nicknamefilter);
		if (plugin.statusfilter) Chat.statusfilters.push(plugin.statusfilter);
		if (plugin.onRenameRoom) {
			if (!Chat.handlers['onRenameRoom']) Chat.handlers['onRenameRoom'] = [];
			Chat.handlers['onRenameRoom'].push(plugin.onRenameRoom);
		}
		if (plugin.onRoomClose) {
			if (!Chat.handlers['onRoomClose']) Chat.handlers['onRoomClose'] = [];
			Chat.handlers['onRoomClose'].push(plugin.onRoomClose);
		}
		if (plugin.handlers) {
			for (const handlerName in plugin.handlers) {
				if (!Chat.handlers[handlerName]) Chat.handlers[handlerName] = [];
				Chat.handlers[handlerName].push(plugin.handlers[handlerName]);
			}
		}
		Chat.plugins[name] = plugin;
	}
	loadPlugins(oldPlugins?: { [k: string]: ChatPlugin }) {
		if (Chat.commands) return;
		if (oldPlugins) Chat.oldPlugins = oldPlugins;

		void FS('package.json').readIfExists().then(data => {
			if (data) Chat.packageData = JSON.parse(data);
		});

		// Install plug-in commands and chat filters

		Chat.commands = Object.create(null);
		Chat.pages = Object.create(null);
		this.loadPluginDirectory('dist/server/chat-commands');
		Chat.baseCommands = Chat.commands;
		Chat.basePages = Chat.pages;
		Chat.commands = Object.assign(Object.create(null), Chat.baseCommands);
		Chat.pages = Object.assign(Object.create(null), Chat.basePages);

		// Load filters from Config
		this.loadPlugin(Config, 'config');
		this.loadPlugin(Tournaments, 'tournaments');

		this.loadPluginDirectory('dist/server/chat-plugins');
		Chat.oldPlugins = {};
		// lower priority should run later
		Utils.sortBy(Chat.filters, filter => -(filter.priority || 0));
	}

	destroy() {
		for (const handler of Chat.destroyHandlers) {
			handler();
		}
	}

	runHandlers(name: keyof Handlers, ...args: Parameters<Handlers[typeof name]>) {
		const handlers = this.handlers[name];
		if (!handlers) return;
		for (const h of handlers) {
			void h.call(this, ...args);
		}
	}

	handleRoomRename(oldID: RoomID, newID: RoomID, room: Room) {
		Chat.runHandlers('onRenameRoom', oldID, newID, room);
	}

	handleRoomClose(roomid: RoomID, user: User, connection: Connection) {
		Chat.runHandlers('onRoomClose', roomid, user, connection, roomid.startsWith('view-'));
	}

	/**
	 * Takes a chat message and returns data about any command it's
	 * trying to use.
	 *
	 * Returning `null` means the chat message isn't trying to use
	 * a command, and returning `{handler: null}` means it's trying
	 * to use a command that doesn't exist.
	 */
	parseCommand(message: string, recursing = false): {
		cmd: string, fullCmd: string, cmdToken: string, target: string, handler: AnnotatedChatHandler | null,
	} | null {
		if (!message.trim()) return null;

		// hardcoded commands
		if (message.startsWith(`>> `)) {
			message = `/eval ${message.slice(3)}`;
		} else if (message.startsWith(`>>> `)) {
			message = `/evalbattle ${message.slice(4)}`;
		} else if (message.startsWith('>>sql ')) {
			message = `/evalsql ${message.slice(6)}`;
		} else if (message.startsWith(`/me`) && /[^A-Za-z0-9 ]/.test(message.charAt(3))) {
			message = `/mee ${message.slice(3)}`;
		} else if (message.startsWith(`/ME`) && /[^A-Za-z0-9 ]/.test(message.charAt(3))) {
			message = `/MEE ${message.slice(3)}`;
		}

		const cmdToken = message.charAt(0);
		if (!VALID_COMMAND_TOKENS.includes(cmdToken)) return null;
		if (cmdToken === message.charAt(1)) return null;
		if (cmdToken === BROADCAST_TOKEN && /[^A-Za-z0-9]/.test(message.charAt(1))) return null;

		let [cmd, target] = Utils.splitFirst(message.slice(1), ' ');
		cmd = cmd.toLowerCase();

		if (cmd.endsWith(',')) cmd = cmd.slice(0, -1);

		let curCommands: AnnotatedChatCommands = Chat.commands;
		let commandHandler;
		let fullCmd = cmd;
		let prevCmdName = '';

		do {
			if (cmd in curCommands) {
				commandHandler = curCommands[cmd];
			} else {
				commandHandler = undefined;
			}
			if (typeof commandHandler === 'string') {
				// in case someone messed up, don't loop
				commandHandler = curCommands[commandHandler];
			} else if (Array.isArray(commandHandler) && !recursing) {
				return this.parseCommand(cmdToken + 'help ' + fullCmd.slice(0, -4), true);
			}
			if (commandHandler && typeof commandHandler === 'object') {
				[cmd, target] = Utils.splitFirst(target, ' ');
				cmd = cmd.toLowerCase();

				prevCmdName = fullCmd;
				fullCmd += ' ' + cmd;
				curCommands = commandHandler as AnnotatedChatCommands;
			}
		} while (commandHandler && typeof commandHandler === 'object');

		if (!commandHandler && (curCommands.default || curCommands[''])) {
			commandHandler = curCommands.default || curCommands[''];
			fullCmd = prevCmdName;
			target = `${cmd}${target ? ` ${target}` : ''}`;
			cmd = fullCmd.split(' ').shift()!;
			if (typeof commandHandler === 'string') {
				commandHandler = curCommands[commandHandler];
			}
		}

		if (!commandHandler && !recursing) {
			for (const g in Config.groups) {
				const groupid = Config.groups[g].id;
				if (fullCmd === groupid) {
					return this.parseCommand(`/promote ${target}, ${g}`, true);
				} else if (fullCmd === 'global' + groupid) {
					return this.parseCommand(`/globalpromote ${target}, ${g}`, true);
				} else if (
					fullCmd === 'de' + groupid || fullCmd === 'un' + groupid ||
					fullCmd === 'globalde' + groupid || fullCmd === 'deglobal' + groupid
				) {
					return this.parseCommand(`/demote ${target}`, true);
				} else if (fullCmd === 'room' + groupid) {
					return this.parseCommand(`/roompromote ${target}, ${g}`, true);
				} else if (fullCmd === 'forceroom' + groupid) {
					return this.parseCommand(`/forceroompromote ${target}, ${g}`, true);
				} else if (fullCmd === 'roomde' + groupid || fullCmd === 'deroom' + groupid || fullCmd === 'roomun' + groupid) {
					return this.parseCommand(`/roomdemote ${target}`, true);
				}
			}
		}

		return {
			cmd,
			cmdToken,
			target,
			fullCmd,
			handler: commandHandler as AnnotatedChatHandler | null,
		};
	}
	allCommands(table: ChatCommands = Chat.commands) {
		const results: AnnotatedChatHandler[] = [];
		for (const cmd in table) {
			const handler = table[cmd];
			if (Array.isArray(handler) || !handler || ['string', 'boolean'].includes(typeof handler)) {
				continue;
			}
			if (typeof handler === 'object') {
				results.push(...this.allCommands(handler));
				continue;
			}
			results.push(handler as AnnotatedChatHandler);
		}
		if (table !== Chat.commands) return results;
		return results.filter((handler, i) => results.indexOf(handler) === i);
	}

	/**
	 * Strips HTML from a string.
	 */
	stripHTML(htmlContent: string) {
		if (!htmlContent) return '';
		return htmlContent.replace(/<[^>]*>/g, '');
	}
	/**
	 * Validates input regex and ensures it won't crash.
	 */
	validateRegex(word: string) {
		word = word.trim();
		if ((word.endsWith('|') && !word.endsWith('\\|')) || word.startsWith('|')) {
			throw new Chat.ErrorMessage(`Your regex was rejected because it included an unterminated |.`);
		}
		try {
			new RegExp(word);
		} catch (e: any) {
			throw new Chat.ErrorMessage(
				e.message.startsWith('Invalid regular expression: ') ?
					e.message :
					`Invalid regular expression: /${word}/: ${e.message}`
			);
		}
	}

	/**
	 * Returns singular (defaulting to '') if num is 1, or plural
	 * (defaulting to 's') otherwise. Helper function for pluralizing
	 * words.
	 */
	plural(num: any, pluralSuffix = 's', singular = '') {
		if (num && typeof num.length === 'number') {
			num = num.length;
		} else if (num && typeof num.size === 'number') {
			num = num.size;
		} else {
			num = Number(num);
		}
		return (num !== 1 ? pluralSuffix : singular);
	}

	/**
	 * Counts the thing passed.
	 *
	 *     Chat.count(2, "days") === "2 days"
	 *     Chat.count(1, "days") === "1 day"
	 *     Chat.count(["foo"], "things are") === "1 thing is"
	 *
	 */
	count(num: any, pluralSuffix: string, singular = "") {
		if (num && typeof num.length === 'number') {
			num = num.length;
		} else if (num && typeof num.size === 'number') {
			num = num.size;
		} else {
			num = Number(num);
		}
		if (!singular) {
			if (pluralSuffix.endsWith("s")) {
				singular = pluralSuffix.slice(0, -1);
			} else if (pluralSuffix.endsWith("s have")) {
				singular = pluralSuffix.slice(0, -6) + " has";
			} else if (pluralSuffix.endsWith("s were")) {
				singular = pluralSuffix.slice(0, -6) + " was";
			}
		}
		const space = singular.startsWith('<') ? '' : ' ';
		return `${num}${space}${num > 1 ? pluralSuffix : singular}`;
	}

	/**
	 * Returns a timestamp in the form {yyyy}-{MM}-{dd} {hh}:{mm}:{ss}.
	 *
	 * options.human = true will use a 12-hour clock
	 */
	toTimestamp(date: Date, options: { human?: boolean } = {}) {
		const human = options.human;
		let parts: any[] = [
			date.getFullYear(),	date.getMonth() + 1, date.getDate(),
			date.getHours(), date.getMinutes(),	date.getSeconds(),
		];
		if (human) {
			parts.push(parts[3] >= 12 ? 'pm' : 'am');
			parts[3] = parts[3] % 12 || 12;
		}
		parts = parts.map(val => `${val}`.padStart(2, '0'));
		return parts.slice(0, 3).join("-") + " " + parts.slice(3, 6).join(":") + (parts[6] || '');
	}

	/**
	 * Takes a number of milliseconds, and reports the duration in English: hours, minutes, etc.
	 *
	 * options.hhmmss = true will instead report the duration in 00:00:00 format
	 *
	 */
	toDurationString(val: number, options: { hhmmss?: boolean, precision?: number } = {}) {
		// TODO: replace by Intl.DurationFormat or equivalent when it becomes available (ECMA-402)
		// https://github.com/tc39/ecma402/issues/47
		const date = new Date(+val);
		if (isNaN(date.getTime())) return 'forever';

		const parts = [
			date.getUTCFullYear() - 1970, date.getUTCMonth(), date.getUTCDate() - 1,
			date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(),
		];
		const roundingBoundaries = [6, 15, 12, 30, 30];
		const unitNames = ["second", "minute", "hour", "day", "month", "year"];
		const positiveIndex = parts.findIndex(elem => elem > 0);
		let precision = (options?.precision ? options.precision : 3);
		if (options?.hhmmss) {
			const str = parts.slice(positiveIndex).map(value => `${value}`.padStart(2, '0')).join(":");
			return str.length === 2 ? "00:" + str : str;
		}

		// round least significant displayed unit
		if (positiveIndex + precision < parts.length && precision > 0 && positiveIndex >= 0) {
			if (parts[positiveIndex + precision] >= roundingBoundaries[positiveIndex + precision - 1]) {
				parts[positiveIndex + precision - 1]++;
			}
		}

		// don't display trailing 0's if the number is exact
		let precisionIndex = 5;
		while (precisionIndex > positiveIndex && !parts[precisionIndex]) {
			precisionIndex--;
		}
		precision = Math.min(precision, precisionIndex - positiveIndex + 1);

		return parts
			.slice(positiveIndex)
			.reverse()
			.map((value, index) => `${value} ${unitNames[index]}${value !== 1 ? "s" : ""}`)
			.reverse()
			.slice(0, precision)
			.join(" ")
			.trim();
	}

	/**
	 * Takes an array and turns it into a sentence string by adding commas and the word "and"
	 */
	toListString(arr: string[], conjunction = "and") {
		if (!arr.length) return '';
		if (arr.length === 1) return arr[0];
		if (arr.length === 2) return `${arr[0]} ${conjunction.trim()} ${arr[1]}`;
		return `${arr.slice(0, -1).join(", ")}, ${conjunction.trim()} ${arr.slice(-1)[0]}`;
	}

	/**
	 * Takes an array and turns it into a sentence string by adding commas and the word "or"
	 */
	toOrList(arr: string[]) {
		if (!arr.length) return '';
		if (arr.length === 1) return arr[0];
		if (arr.length === 2) return `${arr[0]} or ${arr[1]}`;
		return `${arr.slice(0, -1).join(", ")}, or ${arr.slice(-1)[0]}`;
	}

	/**
	 * Convert multiline HTML into a single line without losing whitespace (so
	 * <pre> blocks still render correctly). Linebreaks inside <> are replaced
	 * with ` `, and linebreaks outside <> are replaced with `&#10;`.
	 *
	 * PS's protocol often requires sending a block of HTML in a single line,
	 * so this ensures any block of HTML ends up as a single line.
	 */
	collapseLineBreaksHTML(htmlContent: string) {
		htmlContent = htmlContent.replace(/<[^>]*>/g, tag => tag.replace(/\n/g, ' '));
		htmlContent = htmlContent.replace(/\n/g, '&#10;');
		return htmlContent;
	}
	/**
	 * Takes a string of text and transforms it into a block of html using the details tag.
	 * If it has a newline, will make the 3 lines the preview, and fill the rest in.
	 * @param str string to block
	 */
	getReadmoreBlock(str: string, isCode?: boolean, cutoff = 3) {
		const params = str.slice(str.startsWith('\n') ? 1 : 0).split('\n');
		const output: string[] = [];
		for (const [i, param] of params.entries()) {
			if (output.length < cutoff && param.length > 80 && cutoff > 2) cutoff--;
			if (param.length > cutoff * 160 && i < cutoff) cutoff = i;
			output.push(Utils[isCode ? 'escapeHTMLForceWrap' : 'escapeHTML'](param));
		}

		if (output.length > cutoff) {
			return `<details class="readmore${isCode ? ` code" style="white-space: pre-wrap; display: table; tab-size: 3` : ``}"><summary>${
				output.slice(0, cutoff).join('<br />')
			}</summary>${
				output.slice(cutoff).join('<br />')
			}</details>`;
		} else {
			const tag = isCode ? `code` : `div`;
			return `<${tag} style="white-space: pre-wrap; display: table; tab-size: 3">${
				output.join('<br />')
			}</${tag}>`;
		}
	}

	getReadmoreCodeBlock(str: string, cutoff?: number) {
		return Chat.getReadmoreBlock(str, true, cutoff);
	}

	getDataPokemonHTML(species: Species, gen = 8, tier = '') {
		let buf = '<li class="result">';
		buf += `<span class="col numcol">${tier || species.tier}</span> `;
		buf += `<span class="col iconcol"><psicon pokemon="${species.id}"/></span> `;
		buf += `<span class="col pokemonnamecol" style="white-space:nowrap"><a href="https://${Config.routes.dex}/pokemon/${species.id}" target="_blank">${species.name}</a></span> `;
		buf += '<span class="col typecol">';
		if (species.types) {
			for (const type of species.types) {
				buf += `<img src="https://${Config.routes.client}/sprites/types/${type}.png" alt="${type}" height="14" width="32">`;
			}
		}
		buf += '</span> ';
		if (gen >= 3) {
			buf += '<span style="float:left;min-height:26px">';
			if (species.abilities['1'] && (gen >= 4 || Dex.abilities.get(species.abilities['1']).gen === 3)) {
				buf += `<span class="col twoabilitycol">${species.abilities['0']}<br />${species.abilities['1']}</span>`;
			} else {
				buf += `<span class="col abilitycol">${species.abilities['0']}</span>`;
			}
			if (species.abilities['H'] && species.abilities['S']) {
				buf += `<span class="col twoabilitycol${species.unreleasedHidden ? ' unreleasedhacol' : ''}"><em>${species.abilities['H']}<br />(${species.abilities['S']})</em></span>`;
			} else if (species.abilities['H']) {
				buf += `<span class="col abilitycol${species.unreleasedHidden ? ' unreleasedhacol' : ''}"><em>${species.abilities['H']}</em></span>`;
			} else if (species.abilities['S']) {
				// special case for Zygarde
				buf += `<span class="col abilitycol"><em>(${species.abilities['S']})</em></span>`;
			} else {
				buf += '<span class="col abilitycol"></span>';
			}
			buf += '</span>';
		}
		buf += '<span style="float:left;min-height:26px">';
		buf += `<span class="col statcol"><em>HP</em><br />${species.baseStats.hp}</span> `;
		buf += `<span class="col statcol"><em>Atk</em><br />${species.baseStats.atk}</span> `;
		buf += `<span class="col statcol"><em>Def</em><br />${species.baseStats.def}</span> `;
		if (gen <= 1) {
			buf += `<span class="col statcol"><em>Spc</em><br />${species.baseStats.spa}</span> `;
		} else {
			buf += `<span class="col statcol"><em>SpA</em><br />${species.baseStats.spa}</span> `;
			buf += `<span class="col statcol"><em>SpD</em><br />${species.baseStats.spd}</span> `;
		}
		buf += `<span class="col statcol"><em>Spe</em><br />${species.baseStats.spe}</span> `;
		buf += `<span class="col bstcol"><em>BST<br />${species.bst}</em></span> `;
		buf += '</span>';
		buf += '</li>';
		return `<div class="message"><ul class="utilichart">${buf}<li style="clear:both"></li></ul></div>`;
	}
	getDataMoveHTML(move: Move) {
		let buf = `<ul class="utilichart"><li class="result">`;
		buf += `<span class="col movenamecol"><a href="https://${Config.routes.dex}/moves/${move.id}">${move.name}</a></span> `;
		// encoding is important for the ??? type icon
		const encodedMoveType = encodeURIComponent(move.type);
		buf += `<span class="col typecol"><img src="//${Config.routes.client}/sprites/types/${encodedMoveType}.png" alt="${move.type}" width="32" height="14">`;
		buf += `<img src="//${Config.routes.client}/sprites/categories/${move.category}.png" alt="${move.category}" width="32" height="14"></span> `;
		if (move.basePower) {
			buf += `<span class="col labelcol"><em>Power</em><br>${typeof move.basePower === 'number' ? move.basePower : '—'}</span> `;
		}
		buf += `<span class="col widelabelcol"><em>Accuracy</em><br>${typeof move.accuracy === 'number' ? (`${move.accuracy}%`) : '—'}</span> `;
		const basePP = move.pp || 1;
		const pp = Math.floor(move.noPPBoosts ? basePP : basePP * 8 / 5);
		buf += `<span class="col pplabelcol"><em>PP</em><br>${pp}</span> `;
		buf += `<span class="col movedesccol">${move.shortDesc || move.desc}</span> `;
		buf += `</li><li style="clear:both"></li></ul>`;
		return buf;
	}
	getDataAbilityHTML(ability: Ability) {
		let buf = `<ul class="utilichart"><li class="result">`;
		buf += `<span class="col namecol"><a href="https://${Config.routes.dex}/abilities/${ability.id}">${ability.name}</a></span> `;
		buf += `<span class="col abilitydesccol">${ability.shortDesc || ability.desc}</span> `;
		buf += `</li><li style="clear:both"></li></ul>`;
		return buf;
	}
	getDataItemHTML(item: Item) {
		let buf = `<ul class="utilichart"><li class="result">`;
		buf += `<span class="col itemiconcol"><psicon item="${item.id}"></span> <span class="col namecol"><a href="https://${Config.routes.dex}/items/${item.id}">${item.name}</a></span> `;
		buf += `<span class="col itemdesccol">${item.shortDesc || item.desc}</span> `;
		buf += `</li><li style="clear:both"></li></ul>`;
		return buf;
	}

	/**
	 * Gets the dimension of the image at url. Returns 0x0 if the image isn't found, as well as the relevant error.
	 */
	getImageDimensions(url: string): Promise<{ height: number, width: number }> {
		return probe(url);
	}

	parseArguments(
		str: string,
		delim = ',',
		opts: Partial<{ paramDelim: string, useIDs: boolean, allowEmpty: boolean }> = { useIDs: true }
	) {
		const result: Record<string, string[]> = {};
		for (const part of str.split(delim)) {
			let [key, val] = Utils.splitFirst(part, opts.paramDelim ||= "=").map(f => f.trim());
			if (opts.useIDs) key = toID(key);
			if (!toID(key) || (!opts.allowEmpty && !toID(val))) {
				throw new Chat.ErrorMessage(`Invalid option ${part}. Must be in [key]${opts.paramDelim}[value] format.`);
			}
			if (!result[key]) result[key] = [];
			result[key].push(val);
		}
		return result;
	}

	/**
	 * Normalize a message for the purposes of applying chat filters.
	 *
	 * Not used by PS itself, but feel free to use it in your own chat filters.
	 */
	normalize(message: string) {
		message = message.replace(/'/g, '').replace(/[^A-Za-z0-9]+/g, ' ').trim();
		if (!/[A-Za-z][A-Za-z]/.test(message)) {
			message = message.replace(/ */g, '');
		} else if (!message.includes(' ')) {
			message = message.replace(/([A-Z])/g, ' $1').trim();
		}
		return ' ' + message.toLowerCase() + ' ';
	}

	/**
	 * Generates dimensions to fit an image at url into a maximum size of maxWidth x maxHeight,
	 * preserving aspect ratio.
	 *
	 * @return [width, height, resized]
	 */
	async fitImage(url: string, maxHeight = 300, maxWidth = 300): Promise<[number, number, boolean]> {
		const { height, width } = await Chat.getImageDimensions(url);

		if (width <= maxWidth && height <= maxHeight) return [width, height, false];

		const ratio = Math.min(maxHeight / height, maxWidth / width);

		return [Math.round(width * ratio), Math.round(height * ratio), true];
	}

	refreshPageFor(
		pageid: string,
		roomid: Room | RoomID,
		checkPrefix = false,
		ignoreUsers: ID[] | null = null
	) {
		const room = Rooms.get(roomid);
		if (!room) return false;
		for (const id in room.users) {
			if (ignoreUsers?.includes(id as ID)) continue;
			const u = room.users[id];
			for (const conn of u.connections) {
				if (conn.openPages) {
					for (const page of conn.openPages) {
						if ((checkPrefix ? page.startsWith(pageid) : page === pageid)) {
							void this.parse(`/j view-${page}`, room, u, conn);
						}
					}
				}
			}
		}
	}

	/**
	 * Notifies a targetUser that a user was blocked from reaching them due to a setting they have enabled.
	 */
	maybeNotifyBlocked(blocked: 'pm' | 'challenge' | 'invite', targetUser: User, user: User) {
		const prefix = `|pm|~|${targetUser.getIdentity()}|/nonotify `;
		const options = 'or change it in the <button name="openOptions" class="subtle">Options</button> menu in the upper right.';
		if (blocked === 'pm') {
			if (!targetUser.notified.blockPMs) {
				targetUser.send(`${prefix}The user '${Utils.escapeHTML(user.name)}' attempted to PM you but was blocked. To enable PMs, use /unblockpms ${options}`);
				targetUser.notified.blockPMs = true;
			}
		} else if (blocked === 'challenge') {
			if (!targetUser.notified.blockChallenges) {
				targetUser.send(`${prefix}The user '${Utils.escapeHTML(user.name)}' attempted to challenge you to a battle but was blocked. To enable challenges, use /unblockchallenges ${options}`);
				targetUser.notified.blockChallenges = true;
			}
		} else if (blocked === 'invite') {
			if (!targetUser.notified.blockInvites) {
				targetUser.send(`${prefix}The user '${Utils.escapeHTML(user.name)}' attempted to invite you to a room but was blocked. To enable invites, use /unblockinvites.`);
				targetUser.notified.blockInvites = true;
			}
		}
	}

	readonly formatText = formatText;
	readonly linkRegex = linkRegex;
	readonly stripFormatting = stripFormatting;

	/** Helper function to ensure no state issues occur when regex testing for links. */
	isLink(possibleUrl: string) {
		// if we don't do this, it starts spitting out false every other time even if it's a valid link
		//  since global regexes are stateful.
		// this took me so much pain to debug.
		// Yes, that is intended JS behavior. Yes, it fills me with unyielding rage.
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test
		this.linkRegex.lastIndex = -1;
		return this.linkRegex.test(possibleUrl);
	}

	readonly filterWords: { [k: string]: FilterWord[] } = {};
	readonly monitors: { [k: string]: Monitor } = {};

	registerMonitor(id: string, entry: Monitor) {
		if (!Chat.filterWords[id]) Chat.filterWords[id] = [];
		Chat.monitors[id] = entry;
	}

	resolvePage(pageid: string, user: User, connection: Connection) {
		return (new PageContext({ pageid, user, connection, language: user.language! })).resolve();
	}
};

// backwards compatibility; don't actually use these
// they're just there so forks have time to slowly transition
(Chat as any).escapeHTML = Utils.escapeHTML;
(Chat as any).splitFirst = Utils.splitFirst;
(Chat as any).sendPM = Chat.PrivateMessages.send.bind(Chat.PrivateMessages);
(CommandContext.prototype as any).can = CommandContext.prototype.checkCan;
(CommandContext.prototype as any).canTalk = CommandContext.prototype.checkChat;
(CommandContext.prototype as any).canBroadcast = CommandContext.prototype.checkBroadcast;
(CommandContext.prototype as any).canHTML = CommandContext.prototype.checkHTML;
(CommandContext.prototype as any).canEmbedURI = CommandContext.prototype.checkEmbedURI;
(CommandContext.prototype as any).privatelyCan = CommandContext.prototype.privatelyCheckCan;
(CommandContext.prototype as any).requiresRoom = CommandContext.prototype.requireRoom;
(CommandContext.prototype as any).targetUserOrSelf = function (this: any, target: string, exactName: boolean) {
	const user = this.getUserOrSelf(target, exactName);
	this.targetUser = user;
	this.inputUsername = target;
	this.targetUsername = user?.name || target;
	return user;
};
(CommandContext.prototype as any).splitTarget = function (this: any, target: string, exactName: boolean) {
	const { targetUser, inputUsername, targetUsername, rest } = this.splitUser(target, exactName);
	this.targetUser = targetUser;
	this.inputUsername = inputUsername;
	this.targetUsername = targetUsername;
	return rest;
};

/**
 * Used by ChatMonitor.
 */
export interface FilterWord {
	regex: RegExp;
	word: string;
	hits: number;
	reason?: string;
	publicReason?: string;
	replacement?: string;
}

export type MonitorHandler = (
	this: CommandContext,
	line: FilterWord,
	room: Room | null,
	user: User,
	message: string,
	lcMessage: string,
	isStaff: boolean
) => string | false | undefined;
export interface Monitor {
	location: string;
	punishment: string;
	label: string;
	condition?: string;
	monitor?: MonitorHandler;
}

// explicitly check this so it doesn't happen in other child processes
if (!process.send) {
	Chat.database.spawn(Config.chatdbprocesses || 1);
	Chat.databaseReadyPromise = Chat.prepareDatabase();
	// we need to make sure it is explicitly JUST the child of the original parent db process
	// no other child processes
} else if (process.mainModule === module) {
	global.Monitor = {
		crashlog(error: Error, source = 'A chat child process', details: AnyObject | null = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			process.send!(`THROW\n@!!@${repr}\n${error.stack}`);
		},
	} as any;
	process.on('uncaughtException', err => {
		Monitor.crashlog(err, 'A chat database process');
	});
	process.on('unhandledRejection', err => {
		Monitor.crashlog(err as Error, 'A chat database process');
	});
	global.Config = require('./config-loader').Config;
	// eslint-disable-next-line no-eval
	Repl.start('chat-db', cmd => eval(cmd));
}
