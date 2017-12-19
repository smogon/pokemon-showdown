'use strict';

const FS = require('./../lib/fs');
const TICKET_FILE = 'config/tickets.json';
const TICKET_CACHE_TIME = 24 * 60 * 60 * 1000; // 24 hours
const TICKET_BAN_DURATION = 48 * 60 * 60 * 1000; // 48 hours

let tickets = {};

try {
	tickets = JSON.parse(FS(TICKET_FILE).readSync());
	for (let t in tickets) {
		if (tickets[t].created + TICKET_CACHE_TIME <= Date.now() && !tickets[t].open) delete tickets[t];
		if (tickets[t] && tickets[t].banned && tickets[t].expires <= Date.now()) delete tickets[t];
		if (tickets[t] && tickets[t].open && process.uptime() <= 60) tickets[t].open = false; // Close open tickets if the server has been running for less than a minute
	}
} catch (e) {
	if (e.code !== 'ENOENT') throw e;
}

function writeTickets() {
	FS(TICKET_FILE).writeUpdate(() => (
		JSON.stringify(tickets)
	));
}

class HelpTicket extends Rooms.RoomGame {
	constructor(room, ticket) {
		super(room);
		this.ticket = ticket;
		this.claimQueue = [];
	}

	onJoin(user, connection) {
		if (!user.isStaff || !this.ticket.open) return false;
		if (user.userid === this.ticket.userid) return false;
		if (this.ticket.escalated && !user.can('declare')) return false;
		if (!this.ticket.claimed) {
			this.ticket.claimed = user.name;
			tickets[this.ticket.userid] = this.ticket;
			writeTickets();
			this.modnote(user, `${user.name} claimed this ticket.`);
			notifyStaff(this.ticket.escalated);
		} else {
			this.claimQueue.push(user.name);
		}
	}

	onLeave(user, connection) {
		if (!user.isStaff || !this.ticket.open) return false;
		if (toId(this.ticket.claimed) === user.userid) {
			if (this.claimQueue.length) {
				this.ticket.claimed = this.claimQueue.shift();
				this.modnote(user, `This ticket is now claimed by ${this.claimed}.`);
			} else {
				this.ticket.claimed = null;
				this.modnote(user, `This ticket is no longer claimed.`);
				notifyStaff(this.ticket.escalated);
			}
			tickets[this.ticket.userid] = this.ticket;
			writeTickets();
		} else {
			let index = this.claimQueue.map(toId).indexOf(user.userid);
			if (index > -1) this.claimQueue.splice(index, 1);
		}
	}

	escalate(sendUp, staff) {
		this.ticket.claimed = null;
		this.claimQueue = [];
		if (sendUp) {
			this.ticket.escalated = true;
			tickets[this.ticket.userid] = this.ticket;
			this.modnote(staff, `${staff.name} escalated this ticket to upper staff.`);
			notifyStaff(true);
		} else {
			this.modnote(staff, `${staff.name} escalated this ticket.`);
		}
		this.ticket.escalator = staff;
		this.ticket.created = Date.now(); // Bump the ticket so it shows as the newest
		writeTickets();
		notifyStaff();
	}

	modnote(user, text) {
		this.room.addByUser(user, text);
		this.room.modlog(text);
	}

	close(staff) {
		this.room.isHelp = 'closed';
		this.ticket.open = false;
		tickets[this.ticket.userid] = this.ticket;
		writeTickets();
		this.modnote(staff, `${staff.name} closed this ticket.`);
		notifyStaff(this.ticket.escalated);
		if (this.room.expireTimer) clearTimeout(this.room.expireTimer);
		this.room.expireTimer = setTimeout(() => this.room.expire(), 40 * 60 * 1000);
	}

	deleteTicket(staff) {
		this.close(staff);
		this.modnote(staff, `${staff.name} deleted this ticket.`);
		notifyStaff(this.ticket.escalated);
		delete tickets[this.ticket.userid];
		writeTickets();
		this.room.destroy();
	}
}

function notifyStaff(upper) {
	const room = Rooms(upper ? 'upperstaff' : 'staff');
	if (!room) return;
	let buf = ``;
	let keys = Object.keys(tickets).sort((a, b) => {
		a = tickets[a];
		b = tickets[b];
		if (a.open !== b.open) {
			return (a.open ? -1 : 1);
		} else if (a.open && b.open) {
			return a.created - b.created;
		}
		return 0;
	});
	let count = 0;
	let hasUnclaimed = false;
	for (const key of keys) {
		let ticket = tickets[key];
		if (count >= 3) break;
		if (!ticket.open || ticket.banned) continue;
		if (!upper !== !ticket.escalated) continue;
		const escalator = ticket.escalator ? Chat.html` (escalated by ${ticket.escalator}).` : ``;
		const creator = ticket.claimed ? Chat.html`${ticket.creator}` : Chat.html`<strong>${ticket.creator}</strong>`;
		const notifying = ticket.claimed ? `` : ` notifying`;
		if (!ticket.claimed) hasUnclaimed = true;
		buf += `<button class="button${notifying}" name="send" value="/join help-${ticket.userid}">Help ${creator}: ${ticket.type}${escalator}</button> `;
		count++;
	}
	buf = `|${hasUnclaimed ? 'uhtml' : 'uhtmlchange'}|latest-tickets|<div style="padding:3px">${buf}${count === 0 ? `There are no more open tickets.` : ``}</div>`;
	room.send(buf);
}

function checkIp(ip) {
	for (let t in tickets) {
		if (tickets[t].ip === ip && tickets[t].open && !Punishments.sharedIps.has(ip)) {
			return tickets[t];
		}
	}
	return false;
}

function checkTicketBanned(user) {
	let ticket = tickets[user.userid];
	if (ticket && ticket.banned) {
		if (ticket.expires > Date.now()) {
			return `You are banned from creating tickets${toId(ticket.banned) !== user.userid ? `, because you have the same IP as ${ticket.banned}.` : `.`}${ticket.reason ? ` Reason: ${ticket.reason}` : ``}`;
		} else {
			delete tickets[ticket.userid];
			writeTickets();
			return false;
		}
	} else {
		let bannedTicket = null;
		for (let t in tickets) {
			if (tickets[t].ip === user.latestIp && tickets[t].banned && (!Punishments.sharedIps.has(user.latestIp) || Punishments.sharedIps.has(user.latestIp) && !user.autoconfirmed)) {
				bannedTicket = tickets[t];
				break;
			}
		}
		if (!bannedTicket) return false;
		if (bannedTicket.expires > Date.now()) {
			ticket = Object.assign({}, bannedTicket);
			ticket.name = user.name;
			ticket.userid = user.userid;
			ticket.by = bannedTicket.by + ' (IP)';
			tickets[user.userid] = ticket;
			writeTickets();
			return `You are banned from creating tickets${toId(ticket.banned) !== user.userid ? `, because you have the same IP as ${ticket.banned}.` : `.`}${ticket.reason ? ` Reason: ${ticket.reason}` : ``}`;
		} else {
			delete tickets[bannedTicket.userid];
			writeTickets();
			return false;
		}
	}
}

// Prevent a desynchronization issue when hotpatching
for (const room of Rooms.rooms.values()) {
	if (!room.isHelp) continue;
	const queue = room.game.claimQueue;
	const ticket = room.game.ticket;
	room.game.destroy();
	room.game = new HelpTicket(room, tickets[ticket.userid]);
	room.game.claimQueue = queue;
}

exports.pages = {
	help: {
		request(query, user, connection) {
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			let buf = `|title|Request Help\n|pagehtml|<div class="pad"><h2>Request help from global staff</h2>`;

			let banMsg = checkTicketBanned(user);
			if (banMsg) return connection.popup(banMsg);
			let ticket = tickets[user.userid];
			let ipTicket = checkIp(user.latestIp);
			if ((ticket && ticket.open) || ipTicket) {
				if (!ticket && ipTicket) ticket = ipTicket;
				let helpRoom = Rooms(`help-${ticket.userid}`);
				if (!helpRoom) {
					// Should never happen
					tickets[ticket.userid].open = false;
					writeTickets();
				} else {
					if (!helpRoom.auth[user.userid]) helpRoom.auth[user.userid] = '+';
					connection.popup(`You already have a Help ticket.`);
					user.joinRoom(`help-${ticket.userid}`);
					return `|deinit`;
				}
			}

			buf += `<p><b>Whats going on?</b></p>`;
			if (user.can('lock')) {
				buf += `<span class="message-error">Global staff cannot make tickets. This form is only for reference.</span>`;
			} else {
				buf += `<span class="message-error">Abuse of tickets can result in a punishment.</span>`;
			}
			buf += `<br /><details style="margin: 3px"><summary>I want to report someone</summary>`;
			buf += `<br /><b>What do you want to report someone for?</b><br /><details style="margin: 3px"><summary>Someone is harassing me</summary>If someone is harassing you, click the appropriate button below and a global staff member will take a look. Consider using <code>/ignore [username]</code> if it's minor instead.<br /><br />If you are reporting harassment in a battle, please save a replay of the battle.<br /><button class="button" name="send" value="/helpticket submit PM Harassment">Report harassment in a private message (PM)</button> <button class="button" name="send" value="/helpticket submit Battle Harassment">Report harassment in a battle</button> <button class="button" name="send" value="/helpticket submit Chatroom Harassment">Report harassment in a chatroom</button></details>`;
			buf += `<details style="margin: 3px"><summary>Someone is being inappropriate</summary>If a user has posted inappropriate content, has an inappropriate name, or has inappropriate Pok&eacute;mon nicknames, click the appropriate button below and a global staff member will take a look.<br /><br /><button class="button" name="send" value="/helpticket submit Inappropriate Content">Report inappropriate content</button> <button class="button" name="send" value="/helpticket submit Inappropriate Nickname">Report an inappropriate username</button> <button class="button" name="send" value="/helpticket submit Inappropriate Pokemon Nicknames">Report inappropriate Pok&eacute;mon nicknames</button></details>`;
			buf += `<details style="margin: 3px"><summary>Someone is timerstalling</summary>If someone is timerstalling in your battle, and the battle has <b>not</b> ended, click the button below and a global staff member will take a look.<br /><br /><button class="button" name="send" value="/helpticket submit Timerstalling">Report timerstalling</button></details>`;
			buf += `<details style="margin: 3px"><summary>I want to report a staff member</summary>If you have a complaint against a room staff member, please PM a Room Owner (marked with a #) in the room.<br /><br />If you have a complaint against a global staff member or Room Owner, please click the appropriate button below. Alternatively, make a post in <a href="http://www.smogon.com/forums/threads/names-passwords-rooms-and-servers-contacting-upper-staff.3538721/#post-6300151">Admin Requests</a>.<br /><br /><button class="button" name="send" value="/helpticket submit Room Owner Complaint">Report a Room Owner</button> <button class="button" name="send" value="/helpticket submit Global Staff Complaint">Report a Global Staff Member</button></details>`;
			buf += `</details><br /><details style="margin: 3px"><summary>I want to appeal a punishment</summary><br /><b>What would you like to appeal?</b><br />`;
			if (user.locked) {
				if (user.locked === user.userid) {
					if (user.permalocked) {
						buf += `<details style="margin: 3px"><summary>I want to appeal my permalock</summary>Please make a post in the <a href="http://www.smogon.com/forums/threads/discipline-appeal-rules.3583479/">Discipline Appeal Forums</a> to appeal a permalock.</details>`;
					} else {
						buf += `<details style="margin: 3px"><summary>I want to appeal my lock</summary>If you want to appeal your lock, click the button below and a global staff member will be with you shortly. Alternatively, make a post in <a href="http://www.smogon.com/forums/threads/discipline-appeal-rules.3583479/">Discipline Appeals</a>.<br /><br /><button class="button" name="send" value="/helpticket submit Appeal">Appeal your lock</button></details>`;
					}
				} else {
					buf += `<details style="margin: 3px"><summary>I'm locked because I have the same IP as someone I don't recognize</summary>If you are locked under a name you don't recognize, click the button below to call a global staff member so we can check.<br /><br /><button class="button" name="send" value="/helpticket submit IP-Appeal">Appeal IP lock</button></details>`;
				}
			} else if (user.semilocked) {
				buf += `<details style="margin: 3px"><summary>I can't talk in chat because of my ISP</summary>Click the button below, and a global staff member will check. <button class="button" name="send" value="/helpticket submit ISP-Appeal">Appeal ISP lock</button></details>`;
			}
			buf += `<details style="margin: 3px"><summary>I want to appeal a mute/roomban/blacklist</summary>Please PM the staff member who punished you. If you dont know who punished you, ask another room staff member; they will redirect you to the correct user. If you are banned or blacklisted from the room, use <code>/roomauth [name of room]</code> to get a list of room staff members. Bold names are online.</details>`;
			buf += `</details><br /><details style="margin: 3px"><summary>Something else</summary><b>Maybe one of these options will be helpful?</b><br />`;
			buf += `<details style="margin: 3px"><summary>I lost my password</summary>If you lost your password, click the button below to get in touch with an upper staff member so we can help you recover it. We will need to clarify a few pieces of information before resetting the account. Alternatively, make a post in <a href="http://www.smogon.com/forums/threads/names-passwords-rooms-and-servers-contacting-upper-staff.3538721/#post-6300151">admin requests</a>.<br /><br /><button class="button" name="send" value="/helpticket submit Lost Password">Request a password reset</button></details>`;
			if (ticket) buf += `<details style="margin: 3px"><summary>I feel my last ticket shouldn't have been closed</summary>If you feel that staff did not properly help you with your last issue, click the button below to get in touch with an upper staff member.<br /><br /><button class="button" name="send" value="/helpticket submit Report Last Ticket">Report last ticket</button></details>`;
			buf += `<details style="margin: 3px"><summary>Other</summary>If your issue is not handled above, click the button below to ask for a global. Please be ready to explain the situation.<br /><br /><button class="button" name="send" value="/helpticket submit Other">Call a global staff member</button></details>`;
			buf += `</details></div>`;
			return buf;
		},
		tickets(query, user, connection) {
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			let buf = `|title|Ticket List\n`;
			if (!user.can('lock')) {
				return buf + `|pagehtml|Access denied`;
			}
			buf += `|pagehtml|<div class="pad ladder"><button class="button" name="send" value="/helpticket list" style="float:left"><i class="fa fa-refresh"></i> Refresh</button><br /><br />`;
			buf += `<table style="margin-left: auto; margin-right: auto"><tbody><tr><th colspan="5"><h2 style="margin: 5px auto">Help tickets</h1></th></tr>`;
			buf += `<tr><th>Status</th><th>Creator</th><th>Ticket Type</th><th>Claimed by</th><th>Action</th></tr>`;
			let keys = Object.keys(tickets).sort((a, b) => {
				a = tickets[a];
				b = tickets[b];
				if ((a.banned && !b.banned) || (!a.banned && b.banned)) {
					return (a.banned ? 1 : -1);
				}
				if (a.open !== b.open) {
					return (a.open ? -1 : 1);
				} else {
					if (a.open) return a.created - b.created;
					return b.created - a.created;
				}
			});
			let hasBanHeader = false;
			for (const key of keys) {
				const ticket = tickets[key];
				if (ticket.banned) {
					if (ticket.expires <= Date.now()) continue;
					if (!hasBanHeader) {
						buf += `<tr><th>Status</th><th>Username</th><th>Banned by</th><th>Expires</th><th>Logs</th></tr>`;
						hasBanHeader = true;
					}
					buf += `<tr><td><span style="color:gray"><i class="fa fa-ban"></i> Banned</td>`;
					buf += Chat.html`<td>${ticket.name}</td>`;
					buf += Chat.html`<td>${ticket.by}</td>`;
					buf += `<td>${Chat.toDurationString(ticket.expires - Date.now(), {precision: 1})}</td>`;
				} else {
					if (ticket.escalated && !user.can('declare')) continue;
					buf += `<tr><td>${!ticket.open ? `<span style="color:gray"><i class="fa fa-check-circle-o"></i> Closed</span>` : ticket.claimed ? `<span style="color:green"><i class="fa fa-circle-o"></i> Claimed</span>` : `<span style="color:orange"><i class="fa fa-circle-o"></i> <strong>Unclaimed</strong></span>`}</td>`;
					buf += `<td>${ticket.creator}</td>`;
					buf += `<td>${ticket.type}</td>`;
					buf += `<td>${ticket.claimed ? ticket.claimed : `-`}</td>`;
				}
				buf += `<td>`;
				const roomid = 'help-' + ticket.userid;
				const logUrl = Config.modloglink ? Config.modloglink(new Date(ticket.created || (ticket.expires - TICKET_BAN_DURATION)), roomid) : '';
				if (Rooms(roomid)) {
					buf += `<a href="/${roomid}"><button class="button">${!ticket.claimed && ticket.open ? 'Claim' : 'View'}</button></a> `;
				}
				if (logUrl) {
					buf += `<a href="${logUrl}"><button class="button">Log</button></a>`;
				}
				buf += '</td></tr>';
			}
			buf += `</tbody></table></div>`;
			return buf;
		},
	},
};

exports.commands = {
	requesthelp: 'helpticket',
	helprequest: 'helpticket',
	report: 'helpticket',
	ht: 'helpticket',
	helpticket: {
		'!create': true,
		'': 'create',
		create: function (target, room, user, connection) {
			if (!this.runBroadcast()) return;
			if (this.broadcasting) {
				return this.sendReplyBox('<button name="joinRoom" value="view-help-request" class="button"><strong>Request help</strong></button>');
			}
			if (user.can('lock')) return this.parse('/join view-help-request'); // Globals automatically get the form for reference.
			if (!user.named) return this.errorReply(`You need to choose a username before doing this.`);
			return this.parse('/join view-help-request');
		},
		createhelp: ['/helpticket create - Creates a new ticket requesting help from global staff.'],

		'!submit': true,
		submit: function (target, room, user, connection) {
			if (user.can('lock') && !user.can('bypassall')) return this.popupReply(`Global staff can't make tickets. They can only use the form for reference.`);
			if (!user.named) return this.popupReply(`You need to choose a username before doing this.`);
			let banMsg = checkTicketBanned(user);
			if (banMsg) return this.popupReply(banMsg);
			let ticket = tickets[user.userid];
			let ipTicket = checkIp(user.latestIp);
			if ((ticket && ticket.open) || ipTicket) {
				if (!ticket && ipTicket) ticket = ipTicket;
				let helpRoom = Rooms(`help-${ticket.userid}`);
				if (!helpRoom) {
					// Should never happen
					tickets[ticket.userid].open = false;
					writeTickets();
				} else {
					if (!helpRoom.auth[user.userid]) helpRoom.auth[user.userid] = '+';
					this.parse(`/join help-${ticket.userid}`);
					return this.popupReply(`You already have an open ticket; please wait for global staff to respond.`);
				}
			}
			if (Monitor.countTickets(user.latestIp)) return this.popupReply(`Due to high load, you are limited to creating ${Punishments.sharedIps.has(user.latestIp) ? `50` : `5`} tickets every hour.`);
			if (!['PM Harassment', 'Battle Harassment', 'Chatroom Harassment', 'Inappropriate Content', 'Inappropriate Nickname', 'Inappropriate Pokemon Nicknames', 'Timerstalling', 'Global Staff Complaint', 'Appeal', 'IP-Appeal', 'ISP-Appeal', 'Lost Password', 'Report Last Ticket', 'Room Owner Complaint', 'Other'].includes(target)) return this.parse('/helpticket');
			let upper = false;
			if (['Lost Password', 'Room Owner Complaint', 'Global Staff Complaint', 'Report Last Ticket'].includes(target)) upper = true;
			if (target === 'Report Last Ticket') {
				if (!ticket) return this.popupReply(`You can't report a ticket that dosen't exist.`);
				target = `Report Last Ticket - ${ticket.type}`;
			}
			ticket = {
				creator: user.name,
				userid: user.userid,
				open: true,
				type: target,
				created: Date.now(),
				claimed: null,
				escalated: upper,
				ip: user.latestIp,
			};
			let contexts = {
				'Battle Harassment': 'Please save a replay of the battle and put it in chat so global staff can check.',
				'Inappropriate Pokemon Nicknames': 'Please save a replay of the battle and put it in chat so global staff can check.',
				'Timerstalling': 'Please place the link to the battle in chat so global staff can check.',
			};
			let helpRoom = Rooms(`help-${user.userid}`);
			if (!helpRoom) {
				helpRoom = Rooms.createChatRoom(`help-${user.userid}`, `[H] ${user.name}`, {
					isPersonal: true,
					isHelp: 'open',
					isPrivate: 'hidden',
					modjoin: (upper ? '&' : '%'),
					auth: {[user.userid]: '+'},
					introMessage: `<h2 style="margin-top:0">Help Ticket - ${user.name}</h2><p><b>Issue</b>: ${ticket.type}<br />${upper ? `An Upper` : `A Global`} Staff member will be with you shortly.</p>${contexts[target] ? `<p>${contexts[target]}</p>` : ``}`,
					staffMessage: `${upper ? `<p><h3>Do not post sensitive information in this room.</h3>Drivers and moderators can access this room's logs via the log viewer; please PM the user instead.</p>` : ``}<p><button class="button" name="send" value="/helpticket close ${user.userid}">Close Ticket</button> <button class="button" name="send" value="/helpticket escalate ${user.userid}">Escalate</button> ${upper ? `` : `<button class="button" name="send" value="/helpticket escalate ${user.userid}, upperstaff">Escalate to Upper Staff</button>`}</p><p>To ban this user from creating tickets for two days, please use <code>/helpticket ban ${user.userid}</code></p>`,
				});
				helpRoom.game = new HelpTicket(helpRoom, ticket);
			} else {
				helpRoom.isHelp = 'open';
				if (helpRoom.expireTimer) clearTimeout(helpRoom.expireTimer);
				if (upper && helpRoom.modjoin === '%') {
					// Kick drivers and moderators out
					helpRoom.modjoin = '&';
					for (let u in helpRoom.users) {
						let targetUser = helpRoom.users[u];
						if (targetUser.isStaff && ['%', '@'].includes(targetUser.group)) targetUser.leaveRoom(helpRoom);
					}
				} else if (!upper && helpRoom.modjoin === '&') {
					helpRoom.modjoin = '%';
				}
				helpRoom.introMessage = `<h2 style="margin-top:0">Help Ticket - ${user.name}</h2><p><b>Issue</b>: ${ticket.type}<br />${upper ? `An Upper` : `A Global`} staff member will be with you shortly.</p>`;
				helpRoom.staffMessage = `<p><button class="button" name="send" value="/helpticket close ${user.userid}">Close Ticket</button> <button class="button" name="send" value="/helpticket escalate ${user.userid}">Escalate</button> ${upper ? `` : `<button class="button" name="send" value="/helpticket escalate ${user.userid}, upperstaff">Escalate to Upper Staff</button>`}</p><p>To ban this user from creating tickets for two days, please use <code>/helpticket ban ${user.userid}</code></p>`;
				if (helpRoom.game) helpRoom.game.destroy();
				helpRoom.game = new HelpTicket(helpRoom, ticket);
			}
			helpRoom.game.modnote(user, `${user.name} opened a new ticket. Issue: ${ticket.type}`);
			this.parse(`/join help-${user.userid}`);
			tickets[user.userid] = ticket;
			writeTickets();
			notifyStaff(upper);
			connection.send(`>view-help-request\n|deinit`);
		},

		escalate: function (target, room, user, connection) {
			if (!this.can('lock')) return;
			target = toId(this.splitTarget(target, true));
			if (!this.targetUsername) return this.parse(`/help helpticket escalate`);
			let ticket = tickets[toId(this.targetUsername)];
			if (!ticket || !ticket.open) return this.errorReply(`${this.targetUsername} does not have an open ticket.`);
			if (ticket.escalated && !user.can('declare')) return this.errorReply(`/helpticket escalate - Access denied for escalating upper staff tickets.`);
			if (target === 'upperstaff' && ticket.escalated) return this.errorReply(`${ticket.creator}'s ticket is already escalated.`);
			let helpRoom = Rooms('help-' + ticket.userid);
			if (!helpRoom) return this.errorReply(`${ticket.creator}'s help room is expired and cannot be escalated.`);
			helpRoom.game.escalate((toId(target) === 'upperstaff'), user);
			return this.sendReply(`${ticket.creator}'s ticket was escalated.`);
		},
		escalatehelp: ['/helpticket escalate [user], (upperstaff) - Escalate a ticket. If upperstaff is included, escalate the ticket to upper staff. Requires: % @ * & ~'],

		'!list': true,
		list: function (target, room, user, connection) {
			if (!this.can('lock')) return;
			this.parse('/join view-help-tickets');
		},
		listhelp: ['/helpticket list - Lists all tickets. Requires: % @ * & ~'],

		'!close': true,
		close: function (target, room, user) {
			if (!this.can('lock')) return;
			if (!target) return this.parse(`/help helpticket close`);
			let ticket = tickets[toId(target)];
			if (!ticket || !ticket.open) return this.errorReply(`${target} does not have an open ticket.`);
			if (ticket.escalated && !user.can('declare')) return this.errorReply(`/helpticket close - Access denied for closing upper staff tickets.`);
			if (Rooms('help-' + ticket.userid)) {
				Rooms('help-' + ticket.userid).game.close(user);
			} else {
				ticket.open = false;
				notifyStaff(ticket.escalated);
				writeTickets();
			}
			ticket.claimed = user.name;
			this.sendReply(`You closed ${ticket.creator}'s ticket.`);
		},
		closehelp: ['/helpticket close [user] - Closes an open ticket. Requires: % @ * & ~'],

		ban: function (target, room, user) {
			if (!target) return this.parse('/help helpticket ban');
			target = this.splitTarget(target, true);
			let targetUser = this.targetUser;
			if (!this.can('lock', targetUser)) return;

			let ticket = tickets[toId(this.targetUsername)];
			if (!targetUser && !Punishments.search(toId(this.targetUsername))[0].length && !ticket) return this.errorReply(`User '${this.targetUsername}' not found.`);
			if (target.length > 300) {
				return this.errorReply(`The reason is too long. It cannot exceed 300 characters.`);
			}

			let name, userid;

			if (targetUser) {
				name = targetUser.getLastName();
				userid = targetUser.getLastId();
				if (ticket && ticket.banned && ticket.expires > Date.now()) return this.privateModCommand(`(${name} would be ticket banned by ${user.name} but was already ticket banned.)`);
				if (targetUser.trusted) Monitor.log(`[CrisisMonitor] Trusted user ${targetUser.name}${(targetUser.trusted !== targetUser.userid ? ` (${targetUser.trusted})` : ``)} was ticket banned by ${user.name}, and should probably be demoted.`);
			} else {
				name = this.targetUsername;
				userid = toId(this.targetUsername);
				if (ticket && ticket.banned && ticket.expires > Date.now()) return this.privateModCommand(`(${name} would be ticket banned by ${user.name} but was already ticket banned.)`);
			}

			if (targetUser) {
				targetUser.popup(`|modal|${user.name} has banned you from creating help tickets.${(target ? `\n\nReason: ${target}` : ``)}\n\nYour ban will expire in a few days.`);
			}

			this.addModCommand(`${name} was ticket banned by ${user.name}.${target ? ` (${target})` : ``}`, (targetUser ? `(${targetUser.latestIp})` : ''));

			let affected = [];
			let punishment = {
				banned: name,
				by: user.name,
				created: Date.now(),
				expires: Date.now() + TICKET_BAN_DURATION,
				reason: target,
				ip: (targetUser ? targetUser.latestIp : ticket.ip),
			};

			if (targetUser) {
				affected.push(targetUser);
				affected.concat(targetUser.getAltUsers(false, true));
			} else {
				let foundKeys = Punishments.search(userid)[0].map(key => key.split(':')[0]);
				let userids = new Set([userid]);
				let ips = new Set();
				for (let key of foundKeys) {
					if (key.includes('.')) {
						ips.add(key);
					} else {
						userids.add(key);
					}
				}
				affected = Users.findUsers(Array.from(userids), Array.from(ips), {includeTrusted: true, forPunishment: true});
				affected.unshift(userid);
			}

			let acAccount = (targetUser && targetUser.autoconfirmed !== userid && targetUser.autoconfirmed);
			if (affected.length > 1) {
				this.privateModCommand(`(${name}'s ${acAccount ? ` ac account: ${acAccount}, ` : ""}ticket banned alts: ${affected.slice(1).map(user => user.getLastName()).join(", ")})`);
			} else if (acAccount) {
				this.privateModCommand(`(${name}'s ac account: ${acAccount})`);
			}

			for (let i in affected) {
				let targetTicket = tickets[(typeof affected[i] !== 'string' ? affected[i].getLastId() : toId(affected[i]))];
				targetTicket = punishment;
				targetTicket.userid = (typeof affected[i] !== 'string' ? affected[i].getLastId() : toId(affected[i]));
				targetTicket.name = (typeof affected[i] !== 'string' ? affected[i].getLastName() : `[${toId(affected[i])}]`);
				if (Rooms(`help-${ticket.userid}`)) Rooms(`help-${ticket.userid}`).destroy();
				tickets[(typeof affected[i] !== 'string' ? affected[i].getLastId() : toId(affected[i]))] = targetTicket;
			}
			writeTickets();
			notifyStaff();
			notifyStaff(true);

			this.globalModlog(`TICKETBAN`, targetUser || userid, ` by ${user.name}${target}`);
			return true;
		},
		banhelp: ['/helpticket ban [user], (reason) - Bans a user from creating tickets for 2 days. Requires: % @ * & ~'],

		unban: function (target, room, user) {
			if (!target) return this.parse('/help helpticket unban');

			if (!this.can('lock')) return;
			let targetUser = Users.get(target, true);
			let ticket = tickets[toId(target)];
			if (!ticket || !ticket.banned) return this.errorReply(`${targetUser ? targetUser.name : target} is not ticket banned.`);
			if (ticket.expires <= Date.now()) {
				delete tickets[ticket.userid];
				writeTickets();
				return this.errorReply(`${targetUser ? targetUser.name : target}'s ticket ban is already expired.`);
			}

			let affected = [];
			for (let t in tickets) {
				if (tickets[t].banned === ticket.banned && tickets[t].userid !== ticket.userid) {
					affected.push(tickets[t].name);
					delete tickets[t];
				}
			}
			affected.unshift(ticket.name);
			delete tickets[ticket.userid];
			writeTickets();

			this.addModCommand(`${affected.join(', ')} ${Chat.plural(affected.length, "were", "was")} ticket unbanned by ${user.name}.`);
			this.globalModlog("UNTICKETBAN", target, `by ${user.name}`);
			if (targetUser) targetUser.popup(`${user.name} has ticket unbanned you.`);
		},
		unbanhelp: ['/helpticket unban [user] - Ticket unbans a user. Requires: % @ * & ~'],

		delete: function (target, room, user) {
			// This is a utility only to be used if something goes wrong
			if (!this.can('declare')) return;
			if (!target) return this.parse(`/help helpticket delete`);
			let ticket = tickets[toId(target)];
			if (!ticket || ticket.banned) return this.errorReply(`${target} does not have a ticket.`);
			if (Rooms(`help-${ticket.userid}`)) {
				Rooms(`help-${ticket.userid}`).game.deleteTicket(user);
			} else {
				notifyStaff(ticket.escalated);
				delete tickets[ticket.userid];
				writeTickets();
			}
			this.sendReply(`You deleted ${target}'s ticket.`);
		},
		deletehelp: ['/helpticket delete [user] - Deletes a users ticket. Requires: & ~'],

	},
	tickethelp: [
		'/helpticket create - Creates a new ticket, requesting help from global staff.',
		'/helpticket list - Lists all tickets. Requires: % @ * & ~',
		'/helpticket escalate [user], (upperstaff) - Escalates a ticket. If upperstaff is included, the ticket is escalated to upper staff. Requires: % @ * & ~',
		'/helpticket close [user] - Closes an open ticket. Requires: % @ * & ~',
		'/helpticket ban [user], (reason) - Bans a user from creating tickets for 2 days. Requires: % @ * & ~',
		'/helpticket unban [user] - Ticket unbans a user. Requires: % @ * & ~',
		'/helpticket delete [user] - Deletes a user\'s ticket. Requires: & ~'],
};
