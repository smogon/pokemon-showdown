/**
 * Friends list plugin.
 * Allows for adding and removing friends, as well as seeing their activity.
 * Written by Mia.
 * @author mia-pi-git
 */
import type {Database, Transaction, Statement} from 'better-sqlite3';
import {Utils} from '../../lib/utils';
import {FS} from '../../lib/fs';
import {QueryProcessManager} from '../../lib/process-manager';
import {Repl} from '../../lib/repl';
import {Config} from '../config-loader';

/** Max friends per user */
const MAX_FRIENDS = 100;
/** Max friend requests. */
const MAX_REQUESTS = 6;
const REQUEST_EXPIRY_TIME = 30 * 24 * 60 * 60 * 1000;
const MAX_PROCESSES = 1;

interface DatabaseRequest {
	statement: string;
	type: 'all' | 'get' | 'run' | 'transaction';
	data: AnyObject | any[];
}

interface DatabaseResult {
	/** if there's an error, this is it. */
	error?: string;
	result?: any;
}

const STATUS_COLORS: {[k: string]: string} = {
	idle: '#ff7000',
	online: '#009900',
	busy: '#cc3838',
};

const STATUS_TITLES: {[k: string]: string} = {
	online: 'Online',
	idle: 'Idle',
	busy: 'Busy',
	offline: 'Offline',
};

export const Friends = new class {
	database?: Database;
	/** `Map<transferTo, transferFrom>` */
	transferRequests: Map<string, string>;
	constructor() {
		this.setupDatabase();
		const existingRequests = 'Chat' in global ? Chat.oldPlugins.friends?.transferRequests : undefined;
		this.transferRequests = existingRequests || new Map();
		this.checkExpiringRequests();
	}
	setupDatabase() {
		if (!Config.usesqlite) return;
		const Sqlite = require('better-sqlite3');
		try {
			this.database = new Sqlite(`${__dirname}/../../databases/friends.db`, {fileMustExist: true});
		} catch (e) {
			this.database = new Sqlite(`${__dirname}/../../databases/friends.db`);
			this.database!.exec(FS('databases/schemas/friends.sql').readSync());
		}
		const startup = FS(`databases/schemas/friends-startup.sql`);
		if (startup.existsSync()) {
			this.database?.exec(startup.readSync());
		}
	}
	checkExpiringRequests() {
		if (!this.database) return;
		// requests expire after one month. this is checked both on intialization
		// (hotpatch, to ensure accuracy in case they both don't log in)
		// and when the user the request is sent to / sent from logs in.
		this.database.function('should_expire', (sentTime: number) => {
			if (Date.now() - sentTime > REQUEST_EXPIRY_TIME) return 1;
			return 0;
		});
		const results = this.database.prepare(
			`DELETE FROM friend_requests WHERE EXISTS` +
			`(SELECT sent_at FROM friend_requests WHERE should_expire(sent_at) = 1)`
		).run();
		return results;
	}
	getFriends(user: User) {
		const data = [user.id, MAX_FRIENDS];
		return this.query({
			statement: 'get', type: 'all', data,
		});
	}
	async getRequests(user: User) {
		const sent: Set<string> = new Set();
		const received: Set<string> = new Set();
		if (user.settings.blockFriendRequests) {
			// delete any pending requests that may have been sent to them while offline and return
			await this.query({
				statement: 'deleteRequest', type: 'run', data: [user.id],
			});
			return {sent, received};
		}
		const sentResults = await this.query({
			statement: 'getSent', type: 'all', data: [user.id],
		});
		for (const request of sentResults) {
			sent.add(request.receiver);
		}
		const receivedResults = await this.query({
			statement: 'getReceived', data: [user.id], type: 'all',
		});
		for (const request of receivedResults) {
			received.add(request.sender);
		}
		return {sent, received};
	}
	async query(input: DatabaseRequest) {
		const result = await PM.query(input);
		if (result.error) {
			throw new Chat.ErrorMessage(result.error);
		}
		return result.result;
	}
	async request(user: User, receiverID: ID) {
		const receiver = Users.get(receiverID);
		if (receiver?.settings.blockFriendRequests) {
			throw new Chat.ErrorMessage(`${receiver.name} is blocking friend requests.`);
		}
		let buf = Utils.html`/raw <button class="button" name="send" value="/friends accept ${user.id}">Accept</button> | `;
		buf += Utils.html`<button class="button" name="send" value="/friends reject ${user.id}">Deny</button><br /> `;
		buf += `<small>(You can also stop this user from sending you friend requests with <code>/ignore</code>)</small>`;
		const disclaimer = (
			`/raw <small>Note: If this request is accepted, your friend will be notified when you come online, ` +
			`and you will be notified when they do, unless you opt out of receiving them.</small>`
		);
		if (receiver?.settings.blockFriendRequests) {
			throw new Chat.ErrorMessage(`This user is blocking friend requests.`);
		}
		if (receiver?.settings.blockPMs) {
			throw new Chat.ErrorMessage(`This user is blocking PMs, and cannot be friended right now.`);
		}

		const result = await this.query({type: 'transaction', data: [user.id, receiverID], statement: 'send'});
		if (receiver) {
			this.sendPM(`/text ${Utils.escapeHTML(user.name)} sent you a friend request!`, receiver.id);
			this.sendPM(buf, receiver.id);
			this.sendPM(disclaimer, receiver.id);
		}
		this.sendPM(`/text You sent a friend request to ${receiver?.connected ? receiver.name : receiverID}!`, user.id);
		this.sendPM(
			`/raw <button class="button" name="send" value="/friends undorequest ${Utils.escapeHTML(receiverID)}">` +
			`<i class="fa fa-undo"></i> Undo</button>`, user.id
		);
		this.sendPM(disclaimer, user.id);
		return result;
	}
	async removeRequest(receiverID: ID, senderID: ID) {
		if (!senderID) throw new Chat.ErrorMessage(`Invalid sender username.`);
		if (!receiverID) throw new Chat.ErrorMessage(`Invalid receiver username.`);

		return this.query({
			statement: 'deleteRequest', data: [senderID, receiverID], type: 'run',
		});
	}
	async approveRequest(receiverID: ID, senderID: ID) {
		return this.query({type: 'transaction', data: [senderID, receiverID], statement: 'accept'});
	}
	async visualizeList(user: User) {
		const friends = await this.getFriends(user);
		if (!friends.length) {
			return `<h3>Your friends:</h3> <h4>None.</h4>`;
		}
		const categorized: {[k: string]: string[]} = {
			online: [],
			idle: [],
			busy: [],
			offline: [],
		};
		const loginTimes: {[k: string]: number} = {};
		for (const {friend: friendID, last_login, allowing_login} of [...friends].sort()) {
			const friend = Users.get(friendID);
			if (friend?.connected) {
				categorized[friend.statusType].push(friend.id);
			} else {
				categorized.offline.push(friendID);
				if (!allowing_login) {
					loginTimes[friendID] = last_login;
				}
			}
		}

		const sorted = Object.keys(categorized)
			.filter(item => categorized[item].length > 0)
			.map(item => `${STATUS_TITLES[item]} (${categorized[item].length})`);

		let buf = `<h3>Your friends: <small> `;
		if (sorted.length > 0) {
			buf += `Total (${friends.size}) | ${sorted.join(' | ')}`;
		} else {
			buf += `</h3><em>you have no friends added on Showdown lol</em><br /><br /><br />`;
			buf += `<strong>To add a friend, use </strong><code>/friend add [username]</code>.<br /><br />`;
			buf += `<strong>To move over your friends to this account from a different account, `;
			buf += `sign into that account and use </strong><code>/friend requesttransfer [new name]</code>.`;
			return buf;
		}
		buf += `</h3> `;

		for (const key in categorized) {
			const friendArray = categorized[key].sort();
			if (friendArray.length === 0) continue;
			buf += `<h4>${STATUS_TITLES[key]} (${friendArray.length})</h4>`;
			for (const friend of friendArray) {
				const friendID = toID(friend);
				buf += `<div class="pad"><div>`;
				buf += this.displayFriend(friendID, loginTimes[friendID]);
				buf += `</div></div>`;
			}
		}

		return buf;
	}
	displayFriend(userid: ID, login?: number) {
		const user = Users.getExact(userid); // we want this to be exact
		const name = Utils.escapeHTML(user ? user.name : userid);
		const statusType = user?.connected ?
			`<strong style="color:${STATUS_COLORS[user.statusType]}">\u25C9 ${STATUS_TITLES[user.statusType]}</strong>` :
			'\u25CC Offline';
		let buf = user ?
			`<span class="username"> <strong>${name}</strong></span><span><small> (${statusType})</small></span>` :
			Utils.html`<i>${name}</i> <small>(${statusType})</small>`;
		buf += `<br />`;

		const curUser = Users.get(userid); // might be an alt
		if (user) {
			if (user.userMessage) buf += Utils.html`Status: <i>${user.userMessage}</i><br />`;
		} else if (curUser && curUser.id !== userid) {
			buf += `<small>On an alternate account</small><br />`;
		}
		if (login && typeof login === 'number' && !user?.connected) {
			// THIS IS A TERRIBLE HACK BUT IT WORKS OKAY
			const time = Chat.toTimestamp(new Date(Number(login)), {human: true});
			buf += `Last login: ${time.split(' ').reverse().join(', on ')}`;
			buf += ` (${Chat.toDurationString(Date.now() - login, {precision: 1})} ago)`;
		} else if (typeof login === 'string') {
			buf += `${login}`;
		}
		buf = `<div class="infobox">${buf}</div>`;
		return toLink(buf);
	}
	async removeFriend(userid: ID, friendID: ID) {
		if (!friendID || !userid) throw new Chat.ErrorMessage(`Invalid usernames supplied.`);

		const result = await this.query({
			statement: 'delete', type: 'run', data: [userid, friendID, friendID, userid],
		});
		if (result.changes < 2) {
			throw new Chat.ErrorMessage(`You do not have ${friendID} friended.`);
		}
	}
	sendPM(message: string, to: string, from = '&') {
		const senderID = toID(to);
		const receiverID = toID(from);
		const sendingUser = Users.get(senderID);
		const receivingUser = Users.get(receiverID);
		const fromIdentity = sendingUser ? sendingUser.getIdentity() : ` ${senderID}`;
		const toIdentity = receivingUser ? receivingUser.getIdentity() : ` ${receiverID}`;

		if (from === '&') {
			return sendingUser?.send(`|pm|&|${toIdentity}|${message}`);
		}
		if (sendingUser) {
			sendingUser.send(`|pm|${fromIdentity}|${toIdentity}|${message}`);
		}
		if (receivingUser) {
			receivingUser.send(`|pm|${fromIdentity}|${toIdentity}|${message}`);
		}
	}
	async notifyPending(user: User) {
		if (user.settings.blockFriendRequests) return;
		const friendRequests = await this.getRequests(user);
		const pendingCount = friendRequests.received.size;
		if (pendingCount < 1) return;
		this.sendPM(`/text You have ${pendingCount} friend requests pending!`, user.id);
		this.sendPM(`/raw <button class="button" name="send" value="/j view-friends-received">View</button></div>`, user.id);
	}
	async notifyConnection(user: User) {
		const connected = await this.getLastLogin(user.id);
		if ((Date.now() - connected) < 2 * 60 * 1000) {
			return;
		}
		const friends = await this.getFriends(user);
		const message = `/nonotify Your friend ${Utils.escapeHTML(user.name)} has just connected!`;
		for (const f of friends) {
			const {user1, user2} = f;
			const friend = user1 !== user.id ? user1 : user2;
			const curUser = Users.get(friend as string);
			if (curUser?.settings.allowFriendNotifications) {
				curUser.send(`|pm|&|${curUser.getIdentity()}|${message}`);
			}
		}
	}
	writeLogin(user: User) {
		return this.query({
			statement: 'login', type: 'run', data: [Date.now(), user.id],
		});
	}
	hideLoginData(user: User) {
		return this.query({
			statement: 'hideLogin', type: 'run', data: [user.id, Date.now()],
		});
	}
	allowLoginData(user: User) {
		return this.query({
			statement: 'showLogin', type: 'run', data: [user.id],
		});
	}
	async getLastLogin(userid: ID) {
		const result = await this.query({statement: 'checkLastLogin', type: 'get', data: [userid]});
		return parseInt(result['last_login']);
	}
	checkCanUse(context: CommandContext | PageContext) {
		const user = context.user;
		if (user.locked || user.namelocked || user.semilocked || user.permalocked) {
			throw new Chat.ErrorMessage(`You are locked, and so cannot use the friends feature.`);
		}
		if (!user.autoconfirmed) {
			throw new Chat.ErrorMessage(context.tr`You must be autoconfirmed to use the friends feature.`);
		}
		if (!Config.usesqlitefriends || !Config.usesqlite) {
			throw new Chat.ErrorMessage(`The friends list feature is currently disabled.`);
		}
		if (!Users.globalAuth.atLeast(user, Config.usesqlitefriends)) {
			throw new Chat.ErrorMessage(`You are currently unable to use the friends feature.`);
		}
	}
};

/** UI functions chiefly for the chat page. */

function toLink(buf: string) {
	return buf.replace(/<a roomid="/g, `<a target="replace" href="/`);
}

function headerButtons(type: string, user: User) {
	const buf = [];
	const icons: {[k: string]: string} = {
		sent: '<i class="fa fa-paper-plane"></i>',
		received: '<i class="fa fa-get-pocket"></i>',
		all: '<i class="fa fa-users"></i>',
		help: '<i class="fa fa-question-circle"></i>',
		settings: '<i class="fa fa-cog"></i>',
	};
	const titles: {[k: string]: string} = {
		all: 'All Friends',
		sent: 'Sent',
		received: 'Received',
		help: 'Help',
		settings: 'Settings',
	};
	for (const page of ['all', 'sent', 'received', 'settings', 'help']) {
		const title = titles[page];
		const icon = icons[page];
		if (page === type) {
			buf.push(`${icon} <strong>${user.tr(title)}</strong>`);
		} else {
			buf.push(`${icon} <a roomid="view-friends-${page}">${user.tr(title)}</a>`);
		}
	}
	const refresh = (
		`<button class="button" name="send" value="/j view-friends${type?.trim() ? `-${type}` : ''}" style="float: right">` +
		` <i class="fa fa-refresh"></i> ${user.tr('Refresh')}</button>`
	);
	return `<div style="line-height:25px">${buf.join(' / ')}${refresh}</div>`;
}

export const commands: ChatCommands = {
	unfriend(target) {
		return this.parse(`/friend remove ${target}`);
	},
	friend: 'friends',
	friendslist: 'friends',
	friends: {
		''(target) {
			return this.parse(`/friends list`);
		},
		request: 'add',
		async add(target, room, user, connection) {
			Friends.checkCanUse(this);
			target = toID(target);
			if (target.length > 18) {
				return this.errorReply(this.tr`That name is too long - choose a valid name.`);
			}
			if (!target) return this.parse('/help friends');
			await Friends.request(user, toID(target));
			if (connection.openPages?.has('friends-sent')) {
				this.parse(`/join view-friends-sent`);
			}
			return this.sendReply(this.tr`You sent a friend request to '${target}'.`);
		},
		unfriend: 'remove',
		async remove(target, room, user) {
			Friends.checkCanUse(this);
			target = toID(target);
			if (!target) return this.parse('/help friends');
			await Friends.removeFriend(user.id, toID(target));
			return this.sendReply(this.tr`Removed friend '${target}'.`);
		},
		view(target) {
			return this.parse(`/join view-friends-${target}`);
		},
		list() {
			return this.parse(`/join view-friends`);
		},
		async accept(target, room, user, connection) {
			Friends.checkCanUse(this);
			target = toID(target);
			if (user.settings.blockFriendRequests) {
				return this.errorReply(this.tr`You are currently blocking friend requests, and so cannot accept your own.`);
			}
			if (!target) return this.parse('/help friends');
			await Friends.approveRequest(user.id, toID(target));
			const targetUser = Users.get(target);
			Friends.sendPM(`You accepted a friend request from "${target}".`, user.id);
			if (connection.openPages?.has('friends-received')) {
				this.parse(`/j view-friends-received`);
			}
			if (targetUser) Friends.sendPM(`/text ${user.name} accepted your friend request!`, targetUser.id);
		},
		deny: 'reject',
		async reject(target, room, user, connection) {
			Friends.checkCanUse(this);
			target = toID(target);
			if (!target) return this.parse('/help friends');
			await Friends.removeRequest(user.id, toID(target));
			if (connection.openPages?.has('friends-received')) {
				this.parse(`/j view-friends-received`);
			}
			return Friends.sendPM(this.tr`You denied a friend request from '${target}'.`, user.id);
		},
		toggle(target, room, user, connection) {
			Friends.checkCanUse(this);
			const setting = user.settings.blockFriendRequests;
			target = target.trim();
			if (this.meansYes(target)) {
				if (!setting) return this.errorReply(this.tr`You already are allowing friend requests.`);
				user.settings.blockFriendRequests = false;
				this.sendReply(this.tr`You are now allowing friend requests.`);
			} else if (this.meansNo(target)) {
				if (setting) return this.errorReply(this.tr`You already are blocking incoming friend requests.`);
				user.settings.blockFriendRequests = true;
				this.sendReply(this.tr`You are now blocking incoming friend requests.`);
			} else {
				if (target) this.errorReply(this.tr`Unrecognized setting.`);
				this.sendReply(
					this.tr(setting ? `You are currently blocking friend requests.` : `You are not blocking friend requests.`)
				);
			}
			if (connection.openPages?.has('friends-settings')) {
				this.parse(`/j view-friends-settings`);
			}
			user.update();
		},
		async undorequest(target, room, user, connection) {
			Friends.checkCanUse(this);
			target = toID(target);
			if (user.settings.blockFriendRequests) {
				return Friends.sendPM(
					`/error ${this.tr`You are blocking friend requests, and so cannot undo requests, as you have none.`}`, user.id
				);
			}
			await Friends.removeRequest(toID(target), user.id);
			if (connection.openPages?.has('friends-sent')) {
				this.parse(`/j view-friends-sent`);
			}
			return Friends.sendPM(this.tr`You removed your friend request to '${target}'.`, user.id);
		},
		hidenotifs: 'viewnotifications',
		hidenotifications: 'viewnotifications',
		viewnotifs: 'viewnotifications',
		viewnotifications(target, room, user, connection, cmd) {
			Friends.checkCanUse(this);
			const setting = user.settings.allowFriendNotifications;
			target = target.trim();
			if (!cmd.includes('hide') || target && this.meansYes(target)) {
				if (setting) return this.errorReply(this.tr(`You are already allowing friend notifications.`));
				user.settings.allowFriendNotifications = true;
				this.sendReply(this.tr(`You will now receive friend notifications.`));
			} else if (cmd.includes('hide') || target && this.meansNo(target)) {
				if (!setting) return this.errorReply(this.tr`You are already not receiving friend notifications.`);
				user.settings.allowFriendNotifications = false;
				this.sendReply(this.tr`You will not receive friend notifications.`);
			} else {
				if (target) this.errorReply(this.tr`Unrecognized setting.`);
				this.sendReply(
					this.tr(setting ? `You are currently allowing friend notifications.` : `Your friend notifications are disabled.`)
				);
			}
			if (connection.openPages?.has('friends-settings')) {
				this.parse(`/j view-friends-settings`);
			}
			user.update();
		},
		hidelogins: 'togglelogins',
		showlogins: 'togglelogins',
		async togglelogins(target, room, user, connection, cmd) {
			Friends.checkCanUse(this);
			const setting = user.settings.hideLogins;
			if (cmd.includes('hide')) {
				if (setting) return this.errorReply(this.tr`You are already hiding your logins from friends.`);
				user.settings.hideLogins = true;
				await Friends.hideLoginData(user);
				this.sendReply(`You are now hiding your login times from your friends.`);
			} else if (cmd.includes('show')) {
				if (!setting) return this.errorReply(this.tr`You are already allowing friends to see your login times.`);
				user.settings.hideLogins = false;
				await Friends.allowLoginData(user);
				this.sendReply(`You are now allowing your friends to see your login times.`);
			} else {
				return this.errorReply(`Invalid setting.`);
			}
			if (connection.openPages?.has('friends-settings')) {
				this.parse(`/j view-friends-settings`);
			}
			user.update();
		},
	},
	friendshelp() {
		return this.parse('/join view-friends-help');
	},
};

export const pages: PageTable = {
	async friends(args, user) {
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		Friends.checkCanUse(this);
		const [type] = args;
		let buf = '<div class="pad">';
		switch (toID(type)) {
		case 'outgoing': case 'sent':
			this.title = `[Friends] Sent`;
			buf += headerButtons('sent', user);
			buf += `<hr />`;
			if (user.settings.blockFriendRequests) {
				buf += `<h3>${this.tr(`You are currently blocking friend requests`)}.</h3>`;
				return buf;
			}
			const {sent} = await Friends.getRequests(user);
			if (sent.size < 1) {
				buf += `<strong>You have no outgoing friend requests pending.</strong><br />`;
				buf += `<br />To add a friend, use <code>/friend add [username]</code>.`;
				buf += `</div>`;
				return toLink(buf);
			}
			buf += `<h3>You have ${Chat.count(sent.size, 'friend requests')} pending${sent.size === MAX_REQUESTS ? ` (maximum reached)` : ''}.</h3>`;
			for (const request of sent) {
				buf += `<br /><div class="infobox">`;
				buf += `<strong>${request}</strong>`;
				buf += ` <button class="button" name="send" value="/friends undorequest ${request}">`;
				buf += `<i class="fa fa-undo"></i> ${this.tr('Undo')}</button>`;
				buf += `</div>`;
			}
			break;
		case 'received': case 'incoming':
			this.title = `[Friends] Received`;
			buf += headerButtons('received', user);
			buf += `<hr />`;
			const {received} = await Friends.getRequests(user);
			if (received.size < 1) {
				buf += `<strong>You have no pending friend requests.</strong>`;
				buf += `</div>`;
				return toLink(buf);
			}
			buf += `<h3>You have ${received.size} pending friend requests.</h3>`;
			for (const request of received) {
				buf += `<br /><div class="infobox">`;
				buf += `<strong>${request}</strong>`;
				buf += ` <button class="button" name="send" value="/friends accept ${request}">${this.tr('Accept')}</button> |`;
				buf += ` <button class="button" name="send" value="/friends reject ${request}">${this.tr('Deny')}</button>`;
				buf += `</div>`;
			}
			break;
		case 'help':
			this.title = `[Friends] Help`;
			buf += headerButtons('help', user);
			buf += `<hr /><h3>Help</h3>`;
			buf += `<strong>/friend OR /friends OR /friendslist:</strong><br /><ul><li>`;
			buf += [
				`<code>/friend list</code> - View current friends.`,
				`<code>/friend add [username]</code> - Send a friend request to [username], if you don't have them added.`,
				`<code>/friend remove [username]</code> OR <code>/unfriend [username]</code>  - Unfriend the user.`,
				`<code>/friend accept [username]</code> - Accepts the friend request from [username], if it exists.`,
				`<code>/friend reject [username]</code> - Rejects the friend request from [username], if it exists.`,
				`<code>/friend toggle [off/on]</code> - Enable or disable receiving of friend requests.`,
				`<code>/friend requesttransfer [new name]</code> - Sends a request to [new name] to transfer your friends to them.` +
					` Both users must be online at the same time.`,
				`<code>/friend approvetransfer [old name]</code> - Accepts the friend transfer request from [old name], should it exist.` +
					` Both users must be online at the same time.`,
				`<code>/friend denytransfer</code> - Denies any active friend transfer request, if it exists.`,
				`<code>/friend hidenotifications</code> OR <code>hidenotifs</code> - Opts out of receiving friend notifications.`,
				`<code>/friend viewnotifications</code> OR <code>viewnotifs</code> - Opts into view friend notifications.`,
			].join('</li><li>');
			buf += `</li></ul>`;
			break;
		case 'settings':
			this.title = `[Friends] Settings`;
			buf += headerButtons('settings', user);
			buf += `<hr /><h3>Friends Settings:</h3>`;
			const settings = user.settings;
			buf += `<strong>Notify me when my friends come online:</strong><br />`;
			buf += `<button class="button${settings.allowFriendNotifications ? `` : ` disabled`}" name="send" `;
			buf += `value="/friends hidenotifs">Disable</button> `;
			buf += `<button class="button${settings.allowFriendNotifications ? ` disabled` : ``}" name="send" `;
			buf += `value="/friends viewnotifs">Enable</button> <br /><br />`;
			buf += `<strong>Receive friend requests:</strong><br />`;
			buf += `<button class="button${settings.blockFriendRequests ? ` disabled` : ''}" name="send" `;
			buf += `value="/friends toggle off">Disable</button> `;
			buf += `<button class="button${settings.blockFriendRequests ? `` : ` disabled`}" name="send" `;
			buf += `value="/friends toggle on">Enable</button> <br /><br />`;
			break;
		default:
			this.title = `[Friends] All Friends`;
			buf += headerButtons('all', user);
			buf += `<hr />`;
			buf += await Friends.visualizeList(user);
		}
		buf += `</div>`;
		return toLink(buf);
	},
};

export const loginfilter: LoginFilter = async user => {
	if (!Config.usesqlitefriends || !Users.globalAuth.atLeast(user, Config.usesqlitefriends)) {
		return;
	}
	// notify users of pending requests
	await Friends.notifyPending(user);

	// (quietly) notify their friends (that have opted in) that they are online
	await Friends.notifyConnection(user);
	// write login time
	await Friends.writeLogin(user);
};

const statements: {[k: string]: Statement} = {};
const transactions: {[k: string]: Transaction} = {};

export const PM = new QueryProcessManager<DatabaseRequest, DatabaseResult>(module, query => {
	const {type, statement, data} = query;
	let result: any = '';
	const cached = statements[statement];
	try {
		switch (type) {
		case 'all':
			result = cached.all(data);
			break;
		case 'get':
			result = cached.get(data);
			break;
		case 'run':
			result = cached.run(data);
			break;
		case 'transaction':
			const transaction = transactions[statement];
			if (!transaction) return {error: `Transaction ${statement} not found.`};
			result = transaction([data]);
			break;
		}
	} catch (e) {
		if (!e.name.endsWith('ErrorMessage')) {
			Monitor.crashlog(e, 'A friends database process', query);
			return {error: `Sorry! The database crashed. We've been notified and will fix this.`};
		}
		return {error: e.message};
	}
	if (!result) result = {};
	if (result.result) result = result.result;
	return {result} || {error: 'Unknown error in database query.'};
});


const ACTIONS = {
	add: (
		`REPLACE INTO friends (user1, user2) VALUES($user1, $user2) ON CONFLICT (user1, user2) ` +
		`DO UPDATE SET user1 = $user1, user2 = $user2`
	),
	get: (
		`SELECT * ` +
		`FROM friends_simplified LEFT JOIN friend_settings ON friend_settings.name = friends_simplified.userid ` +
		`WHERE userid = ? LIMIT ?`
	),
	// may look duplicated, but you pass in [userid1, userid2, userid2, userid1]
	delete: `DELETE FROM friends WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)`,
	getSent: `SELECT receiver, sender FROM friend_requests WHERE sender = ?`,
	getReceived: `SELECT receiver, sender FROM friend_requests WHERE receiver = ?`,
	insertRequest: `INSERT INTO friend_requests(sender, receiver, sent_at) VALUES(?, ?, ?)`,
	deleteRequest: `DELETE FROM friend_requests WHERE sender = ? AND receiver = ?`,
	findFriendship: `SELECT * FROM friends WHERE (user1 = $user1 AND user2 = $user2) OR (user2 = $user1 AND user1 = $user2)`,
	findRequest: (
		`SELECT count(*) FROM friend_requests WHERE ` +
		`(sender = $user1 AND receiver = $user2) OR (sender = $user2 AND receiver = $user1)`
	),
	countRequests: `SELECT count(*) FROM friend_requests WHERE (sender = ? OR receiver = ?)`,
	login: `UPDATE friend_settings SET last_login = ? WHERE name = ?`,
	checkLastLogin: `SELECT last_login FROM friend_settings WHERE name= ?`,
	deleteLogin: `UPDATE friend_settings SET last_login = null WHERE name = ?`,
	expire: (
		`DELETE FROM friend_requests WHERE EXISTS` +
		`(SELECT sent_at FROM friend_requests WHERE should_expire(sent_at) = 1)`
	),
	hideLogin: (
		`INSERT INTO friend_settings (name, send_login_data, last_login) VALUES (?, 1, ?) ` +
		`ON CONFLICT (name) DO UPDATE SET send_login_data = 1`
	),
	showLogin: `DELETE FROM friend_settings WHERE name = ? AND send_login_data = 1`,
	countFriends: `SELECT count(*) FROM friends WHERE (user1 = ? OR user2 = ?)`,
};

const TRANSACTIONS: {[k: string]: (input: any[]) => DatabaseResult} = {
	send: requests => {
		for (const request of requests) {
			const [senderID, receiverID] = request;
			const hasSentRequest = statements.findRequest.get({user1: senderID, user2: receiverID})['count(*)'];
			const friends = statements.countFriends.get(senderID)['count(*)'];
			const totalRequests = statements.countRequests.get(senderID, senderID)['count(*)'];
			if (friends >= MAX_FRIENDS) {
				throw new Chat.ErrorMessage(`You are at the maximum number of friends.`);
			}
			const existingFriendship = statements.findFriendship.all({user1: senderID, user2: receiverID});
			if (existingFriendship.length) {
				throw new Chat.ErrorMessage(`You are already friends with '${receiverID}'.`);
			}
			if (hasSentRequest) {
				throw new Chat.ErrorMessage(`You have already sent a friend request to '${receiverID}'.`);
			}
			if (totalRequests >= MAX_REQUESTS) {
				throw new Chat.ErrorMessage(
					`You already have ${MAX_REQUESTS} outgoing friend requests. Use "/friends view sent" to see your outgoing requests.`
				);
			}
			if (friends.includes(receiverID)) {
				throw new Chat.ErrorMessage(`You have already friended '${receiverID}'.`);
			}
			statements.insertRequest.run(senderID, receiverID, Date.now());
		}
		return {result: []};
	},
	add: requests => {
		for (const request of requests) {
			const [senderID, receiverID] = request;
			statements.add.run({user1: senderID, user2: receiverID});
		}
		return {result: []};
	},
	accept: requests => {
		for (const request of requests) {
			const [, receiverID] = request;
			const results = TRANSACTIONS.removeRequest([request]);
			if (!results) throw new Chat.ErrorMessage(`You have no request pending from ${receiverID}.`);
			TRANSACTIONS.add([request]);
		}
		return {result: []};
	},
	removeRequest: requests => {
		const result = [];
		for (const request of requests) {
			const [to, from] = request;
			const {changes} = statements.deleteRequest.run(to, from);
			if (changes) result.push(changes);
		}
		return {result};
	},
};

// if friends.database exists, Config.usesqlite is on.
if (!PM.isParentProcess && Friends.database) {
	for (const k in ACTIONS) {
		try {
			statements[k] = Friends.database.prepare(ACTIONS[k as keyof typeof ACTIONS]);
		} catch (e) {
			throw new Error(`Friends DB statement crashed: ${ACTIONS[k as keyof typeof ACTIONS]} (${e.message})`);
		}
	}
	for (const k in TRANSACTIONS) {
		transactions[k] = Friends.database.transaction(TRANSACTIONS[k]);
	}

	global.Monitor = {
		crashlog(error: Error, source = 'A friends database process', details: AnyObject | null = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			// @ts-ignore please be silent
			process.send(`THROW\n@!!@${repr}\n${error.stack}`);
		},
	};
	global.Config = (require as any)('../config-loader').Config;
	process.on('uncaughtException', err => {
		if (Config.crashguard) {
			Monitor.crashlog(err, 'A friends child process');
		}
	});
	// eslint-disable-next-line no-eval
	Repl.start('friends', cmd => eval(cmd));
} else if (Config.usesqlite) {
	PM.spawn(MAX_PROCESSES);
}
