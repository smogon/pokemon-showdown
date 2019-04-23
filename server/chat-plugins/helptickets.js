'use strict';

/** @type {typeof import('../../lib/fs').FS} */
const FS = require(/** @type {any} */('../../.lib-dist/fs')).FS;
const TICKET_FILE = 'config/tickets.json';
const TICKET_CACHE_TIME = 24 * 60 * 60 * 1000; // 24 hours
const TICKET_BAN_DURATION = 48 * 60 * 60 * 1000; // 48 hours

/**
 * @typedef {Object} TicketState
 * @property {string} creator
 * @property {string} userid
 * @property {boolean} open
 * @property {boolean} active
 * @property {string} type
 * @property {number} created
 * @property {string?} claimed
 * @property {boolean} escalated
 * @property {string} ip
 * @property {string} [escalator]
 */
/**
 * @typedef {Object} BannedTicketState
 * @property {string} banned
 * @property {string} [creator]
 * @property {string} [userid]
 * @property {boolean} [open]
 * @property {string} [type]
 * @property {number} created
 * @property {string?} [claimed]
 * @property {boolean} [escalated]
 * @property {string} ip
 * @property {string} [escalator]
 * @property {string} [name]
 * @property {string} by
 * @property {string} reason
 * @property {number} expires
 */

/** @type {{[k: string]: TicketState}} */
let tickets = {};
/** @type {{[k: string]: BannedTicketState}} */
let ticketBans = {};

try {
	let ticketData = JSON.parse(FS(TICKET_FILE).readSync());
	for (let t in ticketData) {
		const ticket = ticketData[t];
		if (ticket.banned) {
			if (ticket.expires <= Date.now()) continue;
			ticketBans[t] = ticket;
		} else {
			if (ticket.created + TICKET_CACHE_TIME <= Date.now() && !ticket.open) {
				continue;
			}
			// Close open tickets after a restart
			// (i.e. if the server has been running for less than a minute)
			if (ticket.open && process.uptime() <= 60) ticket.open = false;
			tickets[t] = ticket;
		}
	}
} catch (e) {
	if (e.code !== 'ENOENT') throw e;
}

function writeTickets() {
	FS(TICKET_FILE).writeUpdate(() => (
		JSON.stringify(Object.assign({}, tickets, ticketBans))
	));
}

class HelpTicket extends Rooms.RoomGame {
	/**
	 * @param {ChatRoom} room
	 * @param {TicketState} ticket
	 */
	constructor(room, ticket) {
		super(room);
		this.title = "Help Ticket - " + ticket.type;
		this.gameid = "helpticket";
		this.allowRenames = true;
		this.ticket = ticket;
		/** @type {string[]} */
		this.claimQueue = [];
	}

	/**
	 * @param {User} user
	 * @param {Connection} connection
	 */
	onJoin(user, connection) {
		if (!this.ticket.open) return false;
		if (!user.isStaff || user.userid === this.ticket.userid) {
			this.addPlayer(user);
			return false;
		}
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

	/**
	 * @param {User} user
	 */
	onLeave(user) {
		if (user.userid in this.players) {
			this.removePlayer(user);
			return;
		}
		if (!this.ticket.open) return;
		if (toId(this.ticket.claimed) === user.userid) {
			if (this.claimQueue.length) {
				this.ticket.claimed = this.claimQueue.shift() || null;
				this.modnote(user, `This ticket is now claimed by ${this.ticket.claimed}.`);
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

	/**
	 * @param {User} user
	 */
	addPlayer(user) {
		if (user.userid in this.players) return false;
		let player = this.makePlayer(user);
		if (!player) return false;
		this.players[user.userid] = player;
		this.playerCount++;
		return true;
	}

	/**
	 * @param {string} message
	 * @param {User} user
	 */
	onLogMessage(message, user) {
		if (this.ticket.active) return;
		const blockedMessages = [
			'hi', 'hello', 'hullo', 'hey', 'yo',
			'hesrude', 'shesrude', 'hesinappropriate', 'shesinappropriate', 'heswore', 'sheswore',
		];
		if (!user.isStaff && blockedMessages.includes(toId(message))) {
			this.room.add(`|c|~Staff|Hello! The global staff team would be happy to help you, but you need to explain what's going on first.`);
			this.room.add(`|c|~Staff|Please post the information I requested above so a global staff member can come to help.`);
			this.room.update();
			return false;
		}
		if ((!user.isStaff || this.ticket.userid === user.userid) && !this.ticket.active) {
			this.ticket.active = true;
			notifyStaff(this.ticket.escalated);
		}
	}

	/**
	 * @param {User} user
	 */
	forfeit(user) {
		if (!(user.userid in this.players)) return;
		this.removePlayer(user);
		if (!this.ticket.open) return;
		this.modnote(user, `${user.name} is no longer interested in this ticket.`);
		if (this.playerCount - 1 > 0) return; // There are still users in the ticket room, dont close the ticket
		this.close(user);
		return true;
	}

	/**
	 * @param {boolean} sendUp
	 * @param {User} staff
	 */
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
		this.ticket.escalator = staff.name;
		this.ticket.created = Date.now(); // Bump the ticket so it shows as the newest
		writeTickets();
		notifyStaff();
	}

	/**
	 * @param {User} user
	 * @param {string} text
	 */
	modnote(user, text) {
		this.room.addByUser(user, text);
		this.room.modlog(`(${this.room.id}) ${text}`);
	}

	/**
	 * @return {string}
	 */
	getPreview() {
		if (!this.ticket.active) return `title="The ticket creator has not spoken yet."`;
		let hoverText = [];
		for (let i = this.room.log.log.length - 1; i >= 0; i--) {
			let entry = this.room.log.log[i].split('|');
			entry.shift(); // Remove empty string
			if (!['c', 'c:'].includes(entry[0])) continue;
			if (entry[0] === 'c:') entry.shift(); // c: includes a timestamp and needs an extra shift
			entry.shift();
			let user = entry.shift();
			let message = entry.join('|');
			message = message.startsWith('/log ') ? message.slice(5) : `${user}: ${message}`;
			hoverText.push(Chat.html`${message}`);
			if (hoverText.length >= 3) break;
		}
		if (!hoverText.length) return `title="The ticket creator has not spoken yet."`;
		return `title="${hoverText.reverse().join(`&#10;`)}"`;
	}

	/**
	 * @param {User} staff
	 */
	close(staff) {
		this.room.isHelp = 'closed';
		this.ticket.open = false;
		tickets[this.ticket.userid] = this.ticket;
		writeTickets();
		this.modnote(staff, `${staff.name} closed this ticket.`);
		notifyStaff(this.ticket.escalated);
		this.room.pokeExpireTimer();
		for (const ticketGameUser of Object.values(this.players)) {
			this.removePlayer(ticketGameUser);
			const user = Users(ticketGameUser.userid);
			if (user) user.updateSearch();
		}
	}

	/**
	 * @param {User} staff
	 */
	deleteTicket(staff) {
		this.close(staff);
		this.modnote(staff, `${staff.name} deleted this ticket.`);
		delete tickets[this.ticket.userid];
		writeTickets();
		notifyStaff(this.ticket.escalated);
		this.room.destroy();
	}
}

const NOTIFY_ALL_TIMEOUT = 5 * 60 * 1000;
const NOTIFY_ASSIST_TIMEOUT = 60 * 1000;
/** @type {{[k: string]: NodeJS.Timer?}} */
let unclaimedTicketTimer = {upperstaff: null, staff: null};
/** @type {{[k: string]: number}} */
let timerEnds = {upperstaff: 0, staff: 0};
/**
 * @param {boolean} upper
 * @param {boolean} hasUnclaimed
 * @param {boolean} hasAssistRequest
 */
function pokeUnclaimedTicketTimer(upper, hasUnclaimed, hasAssistRequest) {
	const room = Rooms(upper ? 'upperstaff' : 'staff');
	if (!room) return;
	if (hasUnclaimed && !unclaimedTicketTimer[room.id]) {
		unclaimedTicketTimer[room.id] = setTimeout(() => notifyUnclaimedTicket(upper, hasAssistRequest), hasAssistRequest ? NOTIFY_ASSIST_TIMEOUT : NOTIFY_ALL_TIMEOUT);
		timerEnds[room.id] = Date.now() + (hasAssistRequest ? NOTIFY_ASSIST_TIMEOUT : NOTIFY_ALL_TIMEOUT);
	} else if (hasAssistRequest && (timerEnds[room.id] - NOTIFY_ASSIST_TIMEOUT) > NOTIFY_ASSIST_TIMEOUT && unclaimedTicketTimer[room.id]) {
		// Shorten timer
		// @ts-ignore TS dosen't see the above null check
		clearTimeout(unclaimedTicketTimer[room.id]);
		unclaimedTicketTimer[room.id] = setTimeout(() => notifyUnclaimedTicket(upper, hasAssistRequest), NOTIFY_ASSIST_TIMEOUT);
		timerEnds[room.id] = Date.now() + NOTIFY_ASSIST_TIMEOUT;
	} else if (!hasUnclaimed && unclaimedTicketTimer[room.id]) {
		// @ts-ignore
		clearTimeout(unclaimedTicketTimer[room.id]);
		unclaimedTicketTimer[room.id] = null;
		timerEnds[room.id] = 0;
	}
}
/**
 * @param {boolean} upper
 * @param {boolean} hasAssistRequest
 */
function notifyUnclaimedTicket(upper, hasAssistRequest) {
	const room = Rooms(upper ? 'upperstaff' : 'staff');
	if (!room) return;
	// @ts-ignore
	clearTimeout(unclaimedTicketTimer[room.id]);
	unclaimedTicketTimer[room.id] = null;
	timerEnds[room.id] = 0;
	for (let i in room.users) {
		let user = room.users[i];
		if (user.can('mute', null, room) && !user.ignoreTickets) user.sendTo(room, `|tempnotify|helptickets|Unclaimed help tickets!|${hasAssistRequest ? 'Public Room Staff need help' : 'There are unclaimed Help tickets'}`);
	}
}

/**
 * @param {boolean} upper
 */
function notifyStaff(upper = false) {
	const room = Rooms(upper ? 'upperstaff' : 'staff');
	if (!room) return;
	let buf = ``;
	let keys = Object.keys(tickets).sort((aKey, bKey) => {
		const a = tickets[aKey];
		const b = tickets[bKey];
		if (a.open !== b.open) {
			return (a.open ? -1 : 1);
		} else if (a.open && b.open) {
			if (a.active !== b.active) {
				return (a.active ? -1 : 1);
			}
			if (!!a.claimed !== !!b.claimed) {
				return (a.claimed ? 1 : -1);
			}
			return a.created - b.created;
		}
		return 0;
	});
	let count = 0;
	let hiddenTicketUnclaimedCount = 0;
	let hiddenTicketCount = 0;
	let hasUnclaimed = false;
	let fourthTicketIndex = 0;
	let hasAssistRequest = false;
	for (const key of keys) {
		let ticket = tickets[key];
		if (!ticket.open) continue;
		if (!ticket.active) continue;
		if (!upper !== !ticket.escalated) continue;
		if (count >= 3) {
			hiddenTicketCount++;
			if (!ticket.claimed) hiddenTicketUnclaimedCount++;
			if (hiddenTicketCount === 1) {
				fourthTicketIndex = buf.length;
			} else {
				continue;
			}
		}
		const escalator = ticket.escalator ? Chat.html` (escalated by ${ticket.escalator}).` : ``;
		const creator = ticket.claimed ? Chat.html`${ticket.creator}` : Chat.html`<strong>${ticket.creator}</strong>`;
		const notifying = ticket.claimed ? `` : ` notifying`;
		const ticketRoom = Rooms(`help-${ticket.userid}`);
		const ticketGame = /** @type {HelpTicket} */ (ticketRoom.game);
		if (!ticket.claimed) {
			hasUnclaimed = true;
			if (ticket.type === 'Public Room Assistance Request') hasAssistRequest = true;
		}
		buf += `<a class="button${notifying}" href="/help-${ticket.userid}" ${ticketGame.getPreview()}>Help ${creator}: ${ticket.type}${escalator}</a> `;
		count++;
	}
	if (hiddenTicketCount > 1) {
		const notifying = hiddenTicketUnclaimedCount > 0 ? ` notifying` : ``;
		if (hiddenTicketUnclaimedCount > 0) hasUnclaimed = true;
		buf = buf.slice(0, fourthTicketIndex) + `<a class="button${notifying}" href="/view-help-tickets">and ${hiddenTicketCount} more Help ticket${Chat.plural(hiddenTicketCount)} (${hiddenTicketUnclaimedCount} unclaimed)</a>`;
	}
	buf = `|${hasUnclaimed ? 'uhtml' : 'uhtmlchange'}|latest-tickets|<div class="infobox" style="padding: 6px 4px">${buf}${count === 0 ? `There were open Help tickets, but they've all been closed now.` : ``}</div>`;
	room.send(buf);

	if (hasUnclaimed) {
		buf = `|tempnotify|helptickets|Unclaimed help tickets!|${hasAssistRequest ? 'Public Room Staff need help' : 'There are unclaimed Help tickets'}`;
	} else {
		buf = `|tempnotifyoff|helptickets`;
	}
	if (room.userCount) Sockets.roomBroadcast(room.id, `>view-help-tickets\n${buf}`);
	if (hasUnclaimed) {
		// only notify for people highlighting
		buf = `${buf}|${hasAssistRequest ? 'Public Room Staff need help' : 'There are unclaimed Help tickets'}`;
	}
	for (let i in room.users) {
		let user = room.users[i];
		if (user.can('mute', null, room)) user.sendTo(room, buf);
	}
	pokeUnclaimedTicketTimer(upper, hasUnclaimed, hasAssistRequest);
}

/**
 * @param {string} ip
 */
function checkIp(ip) {
	for (let t in tickets) {
		if (tickets[t].ip === ip && tickets[t].open && !Punishments.sharedIps.has(ip)) {
			return tickets[t];
		}
	}
	return false;
}

/**
 * @param {User} user
 */
function checkTicketBanned(user) {
	let ticket = ticketBans[user.userid];
	if (ticket) {
		if (ticket.expires > Date.now()) {
			return `You are banned from creating tickets${toId(ticket.banned) !== user.userid ? `, because you have the same IP as ${ticket.banned}.` : `.`}${ticket.reason ? ` Reason: ${ticket.reason}` : ``}`;
		} else {
			delete tickets[ticket.userid];
			writeTickets();
			return false;
		}
	} else {
		/** @type {BannedTicketState?} */
		let bannedTicket = null;
		const checkIp = !(Punishments.sharedIps.has(user.latestIp) && user.autoconfirmed);
		if (checkIp) {
			for (let t in ticketBans) {
				if (ticketBans[t].ip === user.latestIp) {
					bannedTicket = ticketBans[t];
					break;
				}
			}
		}
		if (!bannedTicket) return false;
		if (bannedTicket.expires > Date.now()) {
			ticket = Object.assign({}, bannedTicket);
			ticket.name = user.name;
			ticket.userid = user.userid;
			ticket.by = bannedTicket.by + ' (IP)';
			ticketBans[user.userid] = ticket;
			writeTickets();
			return `You are banned from creating tickets${toId(ticket.banned) !== user.userid ? `, because you have the same IP as ${ticket.banned}.` : `.`}${ticket.reason ? ` Reason: ${ticket.reason}` : ``}`;
		} else {
			delete ticketBans[bannedTicket.userid];
			writeTickets();
			return false;
		}
	}
}

// Prevent a desynchronization issue when hotpatching
for (const room of Rooms.rooms.values()) {
	if (!room.isHelp || !room.game) continue;
	let game = /** @type {HelpTicket} */ (room.game);
	const queue = game.claimQueue;
	const ticket = game.ticket;
	room.game.destroy();
	room.game = null;
	if (!ticket) continue;
	game = new HelpTicket(/** @type {ChatRoom} */ (room), tickets[ticket.userid]);
	game.claimQueue = queue;
	room.game = game;
}

/** @type {PageTable} */
const pages = {
	help: {
		request(query, user, connection) {
			if (!user.named) {
				let buf = `>view-help-request${query.length ? '-' + query.join('-') : ''}\n` +
					`|init|html\n` +
					`|title|Request Help\n` +
					`|pagehtml|<div class="pad"><h2>Request help from global staff</h2><p>Please <button name="login" class="button">Log In</button> to request help.</p></div>`;
				connection.send(buf);
				return Rooms.RETRY_AFTER_LOGIN;
			}
			this.title = 'Request Help';
			let buf = `<div class="pad"><h2>Request help from global staff</h2>`;

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
					return this.close();
				}
			}

			const isStaff = user.can('lock');
			if (!query.length) query = [''];
			/** @type {{[k: string]: string}} */
			const pages = {
				report: `I want to report someone`,
				harassment: `Someone is harassing me`,
				inap: `Someone is using an offensive username or pokemon nickname`,
				staff: `I want to report a staff member`,

				appeal: `I want to appeal a punishment`,
				permalock: `I want to appeal my permalock`,
				lock: `I want to appeal my lock`,
				ip: `I'm locked because I have the same IP as someone I don't recognize`,
				semilock: `I can't talk in chat because of my ISP`,
				hostfilter: `I'm locked because of #hostfilter`,
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
				confirminappokemon: `Report inappropriate Pok&eacute;mon nicknames`,
				confirmreportroomowner: `Report a Room Owner`,
				confirmreportglobal: `Report a Global Staff member`,
				confirmappeal: `Appeal your lock`,
				confirmipappeal: `Appeal IP lock`,
				confirmappealsemi: `Appeal ISP lock`,
				confirmroomhelp: `Call a Global Staff member to help`,
				confirmother: `Call a Global Staff member`,
			};
			/** @type {{[k: string]: string}} */
			const ticketTitles = {
				pmharassment: `PM Harassment`,
				battleharassment: `Battle Harassment`,
				inapname: `Inappropriate Username`,
				inappokemon: `Inappropriate Pokemon Nicknames`,
				reportroomowner: `Room Owner Complaint`,
				reportglobal: `Global Staff Complaint`,
				appeal: `Appeal`,
				ipappeal: `IP-Appeal`,
				appealsemi: `ISP-Appeal`,
				roomhelp: `Public Room Assistance Request`,
				other: `Other`,
			};
			for (const [i, page] of query.entries()) {
				const isLast = (i === query.length - 1);
				if (page && page in pages && !page.startsWith('confirm')) {
					let prevPageLink = query.slice(0, i).join('-');
					if (prevPageLink) prevPageLink = `-${prevPageLink}`;
					buf += `<p><a href="/view-help-request${prevPageLink}" target="replace"><button class="button">Back</button></a> <button class="button disabled" disabled>${pages[page]}</button></p>`;
				}
				switch (page) {
				case '':
					buf += `<p><b>What's going on?</b></p>`;
					if (isStaff) {
						buf += `<p class="message-error">Global staff cannot make Help requests. This form is only for reference.</p>`;
					} else {
						buf += `<p class="message-error">Abuse of Help requests can result in a punishment.</p>`;
					}
					if (!isLast) break;
					buf += `<p><Button>report</Button></p>`;
					buf += `<p><Button>appeal</Button></p>`;
					buf += `<p><Button>misc</Button></p>`;
					break;
				case 'report':
					buf += `<p><b>What do you want to report someone for?</b></p>`;
					if (!isLast) break;
					buf += `<p><Button>harassment</Button></p>`;
					buf += `<p><Button>inap</Button></p>`;
					buf += `<p><Button>other</Button></p>`;
					break;
				case 'harassment':
					buf += `<p>If someone is harassing you in pms or a battle, click the appropriate button below and a global staff member will take a look. If you are being harassed in a chatroom, please ask a room staff member to handle it. Consider using <code>/ignore [username]</code> if it's minor instead.</p>`;
					buf += `<p>If you are reporting harassment in a battle, please save a replay of the battle.</p>`;
					if (!isLast) break;
					buf += `<p><Button>confirmpmharassment</Button> <Button>confirmbattleharassment</Button></p>`;
					break;
				case 'inap':
					buf += `<p>If a user has an inappropriate name, or has inappropriate Pok&eacute;mon nicknames, click the appropriate button below and a global staff member will take a look.</p>`;
					if (!isLast) break;
					buf += `<p><Button>confirminapname</Button> <Button>confirminappokemon</Button></p>`;
					break;
				case 'staff':
					buf += `<p>If you have a complaint against a room staff member, please PM a Room Owner (marked with a #) in the room.</p>`;
					buf += `<p>If you have a complaint against a global staff member or Room Owner, please click the appropriate button below. Alternatively, make a post in <a href="https://www.smogon.com/forums/threads/names-passwords-rooms-and-servers-contacting-upper-staff.3538721/#post-6300151">Admin Requests</a>.</p>`;
					if (!isLast) break;
					buf += `<p><Button>confirmreportroomowner</Button> <Button>confirmreportglobal</Button></p>`;
					break;
				case 'appeal':
					buf += `<p><b>What would you like to appeal?</b></p>`;
					if (!isLast) break;
					if (user.locked || isStaff) {
						if (user.locked === user.userid || isStaff) {
							if (user.permalocked || isStaff) {
								buf += `<p><Button>permalock</Button></p>`;
							}
							if (!user.permalocked || isStaff) {
								buf += `<p><Button>lock</Button></p>`;
							}
						}
						if (user.locked === '#hostfilter' || isStaff) {
							buf += `<p><Button>hostfilter</Button></p>`;
						}
						if ((user.locked !== user.userid && user.locked !== '#hostfilter') || isStaff) {
							buf += `<p><Button>ip</Button></p>`;
						}
					}
					if (user.semilocked || isStaff) {
						buf += `<p><Button>semilock</Button></p>`;
					}
					buf += `<p><Button>appealother</Button></p>`;
					buf += `<p><Button>other</Button></p>`;
					break;
				case 'permalock':
					buf += `<p>Please make a post in the <a href="https://www.smogon.com/forums/threads/discipline-appeal-rules.3583479/">Discipline Appeal Forums</a> to appeal a permalock.</p>`;
					break;
				case 'lock':
					buf += `<p>If you want to appeal your lock, click the button below and a global staff member will be with you shortly.</p>`;
					if (!isLast) break;
					buf += `<p><Button>confirmappeal</Button></p>`;
					break;
				case 'ip':
					buf += `<p>If you are locked under a name you don't recognize, click the button below to call a global staff member so we can check.</p>`;
					if (!isLast) break;
					buf += `<p><Button>confirmipappeal</Button></p>`;
					break;
				case 'hostfilter':
					buf += `<p>If you are locked under #hostfilter, it means you are connected to Pok&eacute;mon Showdown with a Proxy or VPN. We automatically lock these to prevent evasion of punishments. To get unlocked, you need to disable your Proxy or VPN, and use the /logout command.</p>`;
					break;
				case 'semilock':
					buf += `<p>Do you have an Autoconfirmed account? An account is autoconfirmed when they have won at least one rated battle and have been registered for one week or longer.</p>`;
					if (!isLast) break;
					buf += `<p><Button>hasautoconfirmed</Button> <Button>lacksautoconfirmed</Button></p>`;
					break;
				case 'hasautoconfirmed':
					buf += `<p>Login to your autoconfirmed account by using the /nick command, and the semilock will automatically be removed. Afterwords, you can use the /nick command to switch back to your current username without being semilocked again.</p>`;
					buf += `<p>If the semilock does not go away, you can try asking a global staff member for help. Click the button below to call a global staff member.</p>`;
					if (!isLast) break;
					buf += `<p><Button>confirmappealsemi</Button></p>`;
					break;
				case 'lacksautoconfirmed':
					buf += `<p>If you don't have an autoconfirmed account, you will need to contact a global staff member to appeal your semilock. Click the button below to call a global staff member.</p>`;
					if (!isLast) break;
					buf += `<p><Button>confirmappealsemi</Button></p>`;
					break;
				case 'appealother':
					buf += `<p>Please PM the staff member who punished you. If you don't know who punished you, ask another room staff member; they will redirect you to the correct user. If you are banned or blacklisted from the room, use <code>/roomauth [name of room]</code> to get a list of room staff members. Bold names are online.</p>`;
					break;
				case 'misc':
					buf += `<p><b>Maybe one of these options will be helpful?</b></p>`;
					if (!isLast) break;
					buf += `<p><Button>password</Button></p>`;
					if (user.trusted || isStaff) buf += `<p><Button>roomhelp</Button></p>`;
					buf += `<p><Button>other</Button></p>`;
					break;
				case 'password':
					buf += `<p>If you lost your password, click the button below to make a post in Admin Requests. We will need to clarify a few pieces of information before resetting the account. Please note that password resets are low priority and may take a while; we recommend using a new account while waiting.</p>`;
					buf += `<p><a class="button" href="https://www.smogon.com/forums/password-reset-form/">Request a password reset</a></p>`;
					break;
				case 'roomhelp':
					buf += `<p>If you are a room driver or up in a public room, and you need help watching the chat, one or more global staff members would be happy to assist you! Click the button below to call a Global Staff member.</p>`;
					buf += `<p><Button>confirmroomhelp</Button></p>`;
					break;
				case 'other':
					buf += `<p>If your issue is not handled above, click the button below to ask for a global. Please be ready to explain the situation.</p>`;
					if (!isLast) break;
					buf += `<p><Button>confirmother</Button></p>`;
					break;
				default:
					if (!page.startsWith('confirm')) break;
					buf += `<p><b>Are you sure you want to submit a${ticketTitles[page.slice(7)].charAt(0) === 'A' ? 'n' : ''} ${ticketTitles[page.slice(7)]} report?</b></p>`;
					buf += `<p><button class="button notifying" name="send" value="/helpticket submit ${ticketTitles[page.slice(7)]}">Yes, Contact global staff</button> <a href="/view-help-request-${query.slice(0, i).join('-')}" target="replace"><button class="button">No, cancel</button></a></p>`;
					break;
				}
			}
			buf += '</div>';
			const curPageLink = query.length ? '-' + query.join('-') : '';
			buf = buf.replace(/<Button>([a-z]+)<\/Button>/g, (match, id) =>
				`<a class="button" href="/view-help-request${curPageLink}-${id}" target="replace">${pages[id]}</a>`
			);
			return buf;
		},
		tickets(query, user, connection) {
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			this.title = 'Ticket List';
			if (!this.can('lock')) return;
			let buf = `<div class="pad ladder"><button class="button" name="send" value="/helpticket list" style="float:left"><i class="fa fa-refresh"></i> Refresh</button><br /><br />`;
			buf += `<table style="margin-left: auto; margin-right: auto"><tbody><tr><th colspan="5"><h2 style="margin: 5px auto">Help tickets</h1></th></tr>`;
			buf += `<tr><th>Status</th><th>Creator</th><th>Ticket Type</th><th>Claimed by</th><th>Action</th></tr>`;

			let keys = Object.keys(tickets).sort((aKey, bKey) => {
				const a = tickets[aKey];
				const b = tickets[bKey];
				if (a.open !== b.open) {
					return (a.open ? -1 : 1);
				}
				if (a.open) {
					if (a.active !== b.active) {
						return (a.active ? -1 : 1);
					}
					return a.created - b.created;
				}
				return b.created - a.created;
			});
			let count = 0;
			for (const key of keys) {
				if (count >= 100 && query[0] !== 'all') {
					buf += `<tr><td colspan="5">And ${keys.length - count} more tickets. <a class="button" href="/view-help-tickets-all" target="replace">View all tickets</a></td></tr>`;
					break;
				}
				const ticket = tickets[key];
				if (ticket.escalated && !user.can('declare')) continue;
				let icon = `<span style="color:gray"><i class="fa fa-check-circle-o"></i> Closed</span>`;
				if (ticket.open) {
					if (!ticket.active) {
						icon = `<span style="color:gray"><i class="fa fa-circle-o"></i> Inactive</span>`;
					} else if (ticket.claimed) {
						icon = `<span style="color:green"><i class="fa fa-circle-o"></i> Claimed</span>`;
					} else {
						icon = `<span style="color:orange"><i class="fa fa-circle-o"></i> <strong>Unclaimed</strong></span>`;
					}
				}
				buf += `<tr><td>${icon}</td>`;
				buf += `<td>${ticket.creator}</td>`;
				buf += `<td>${ticket.type}</td>`;
				buf += `<td>${ticket.claimed ? ticket.claimed : `-`}</td>`;
				buf += `<td>`;
				const roomid = 'help-' + ticket.userid;
				let logUrl = '';
				if (Config.modloglink) {
					logUrl = Config.modloglink(new Date(ticket.created), roomid);
				}
				let room = Rooms(roomid);
				if (room) {
					const ticketGame = /** @type {HelpTicket} */ (room.game);
					buf += `<a href="/${roomid}"><button class="button" ${ticketGame.getPreview()}>${!ticket.claimed && ticket.open ? 'Claim' : 'View'}</button></a> `;
				}
				if (logUrl) {
					buf += `<a href="${logUrl}"><button class="button">Log</button></a>`;
				}
				buf += '</td></tr>';
				count++;
			}

			let banKeys = Object.keys(ticketBans).sort((aKey, bKey) => {
				const a = ticketBans[aKey];
				const b = ticketBans[bKey];
				return b.created - a.created;
			});
			let hasBanHeader = false;
			count = 0;
			for (const key of banKeys) {
				const ticket = ticketBans[key];
				if (ticket.expires <= Date.now()) continue;
				if (!hasBanHeader) {
					buf += `<tr><th>Status</th><th>Username</th><th>Banned by</th><th>Expires</th><th>Logs</th></tr>`;
					hasBanHeader = true;
				}
				if (count >= 100 && query[0] !== 'all') {
					buf += `<tr><td colspan="5">And ${banKeys.length - count} more ticket bans. <a class="button" href="/view-help-tickets-all" target="replace">View all tickets</a></td></tr>`;
					break;
				}
				buf += `<tr><td><span style="color:gray"><i class="fa fa-ban"></i> Banned</td>`;
				buf += Chat.html`<td>${ticket.name}</td>`;
				buf += Chat.html`<td>${ticket.by}</td>`;
				buf += `<td>${Chat.toDurationString(ticket.expires - Date.now(), {precision: 1})}</td>`;
				buf += `<td>`;
				const roomid = 'help-' + ticket.userid;
				let logUrl = '';
				if (Config.modloglink) {
					const modlogDate = new Date(ticket.created || (ticket.banned ? ticket.expires - TICKET_BAN_DURATION : 0));
					logUrl = Config.modloglink(modlogDate, roomid);
				}
				if (logUrl) {
					buf += `<a href="${logUrl}"><button class="button">Log</button></a>`;
				}
				buf += '</td></tr>';
				count++;
			}

			buf += `</tbody></table></div>`;
			return buf;
		},
	},
};
exports.pages = pages;

/** @type {ChatCommands} */
let commands = {
	'!report': true,
	report(target, room, user) {
		if (!this.runBroadcast()) return;
		if (this.broadcasting) {
			if (room && room.battle) return this.errorReply(`This command cannot be broadcast in battles.`);
			return this.sendReplyBox('<button name="joinRoom" value="view-help-request--report" class="button"><strong>Report someone</strong></button>');
		}

		return this.parse('/join view-help-request--report');
	},

	'!appeal': true,
	appeal(target, room, user) {
		if (!this.runBroadcast()) return;
		if (this.broadcasting) {
			if (room && room.battle) return this.errorReply(`This command cannot be broadcast in battles.`);
			return this.sendReplyBox('<button name="joinRoom" value="view-help-request--appeal" class="button"><strong>Appeal a punishment</strong></button>');
		}

		return this.parse('/join view-help-request--appeal');
	},

	requesthelp: 'helpticket',
	helprequest: 'helpticket',
	ht: 'helpticket',
	helpticket: {
		'!create': true,
		'': 'create',
		create(target, room, user) {
			if (!this.runBroadcast()) return;
			if (this.broadcasting) {
				return this.sendReplyBox('<button name="joinRoom" value="view-help-request" class="button"><strong>Request help</strong></button>');
			}
			if (user.can('lock')) return this.parse('/join view-help-request'); // Globals automatically get the form for reference.
			if (!user.named) return this.errorReply(`You need to choose a username before doing this.`);
			return this.parse('/join view-help-request');
		},
		createhelp: [`/helpticket create - Creates a new ticket requesting help from global staff.`],

		'!submit': true,
		submit(target, room, user, connection) {
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
			if (!['PM Harassment', 'Battle Harassment', 'Inappropriate Username', 'Inappropriate Pokemon Nicknames', 'Room Owner Complaint', 'Global Staff Complaint', 'Appeal', 'IP-Appeal', 'ISP-Appeal', 'Public Room Assistance Request', 'Other'].includes(target)) return this.parse('/helpticket');
			let upper = false;
			if (['Room Owner Complaint', 'Global Staff Complaint'].includes(target)) upper = true;
			ticket = {
				creator: user.name,
				userid: user.userid,
				open: true,
				active: false,
				type: target,
				created: Date.now(),
				claimed: null,
				escalated: upper,
				ip: user.latestIp,
			};
			/** @type {{[k: string]: string}} */
			const contexts = {
				'PM Harassment': `Hi! Who was harassing you in private messages?`,
				'Battle Harassment': `Hi! Who was harassing you, and in which battle did it happen? Please post a link to the battle or a replay of the battle.`,
				'Inappropriate Username': `Hi! Tell us the username that is inappropriate.`,
				'Inappropriate Pokemon Nicknames': `Hi! Which user has pokemon with inappropriate nicknames, and in which battle? Please post a link to the battle or a replay of the battle.`,
				'Room Owner Complaint': `Hi! Which Room Owner are you reporting, and why are you reporting them?`,
				'Global Staff Complaint': `Hi! Which Global Staff member are you reporting, and why are you reporting them?`,
				'Appeal': `Hi! Can you please explain why you feel your punishment is undeserved?`,
				'Public Room Assistance Request': `Hi! Which room(s) do you need us to help you watch?`,
				'Other': `Hi! What seems to be the problem? Tell us about any people involved, and if this happened in a specific place on the site.`,
			};
			/** @type {{[k: string]: string}} */
			const staffContexts = {
				'IP-Appeal': `<p><strong>${user.name}'s IP Addresses</strong>: ${Object.keys(user.ips).map(ip => `<a href="https://whatismyipaddress.com/ip/${ip}" target="_blank">${ip}</a>`).join(', ')}</p>`,
			};
			const introMessage = Chat.html`<h2 style="margin-top:0">Help Ticket - ${user.name}</h2><p><b>Issue</b>: ${ticket.type}<br />${upper ? `An Upper` : `A Global`} Staff member will be with you shortly.</p>`;
			const staffMessage = `${upper ? `<p><h3>Do not post sensitive information in this room.</h3>Drivers and moderators can access this room's logs via the log viewer; please PM the user instead.</p>` : ``}<p><button class="button" name="send" value="/helpticket close ${user.userid}">Close Ticket</button> <details><summary class="button">More Options</summary><button class="button" name="send" value="/helpticket escalate ${user.userid}">Escalate</button> ${upper ? `` : `<button class="button" name="send" value="/helpticket escalate ${user.userid}, upperstaff">Escalate to Upper Staff</button>`} <button class="button" name="send" value="/helpticket ban ${user.userid}"><small>Ticketban</small></button></details></p>`;
			const staffHint = staffContexts[target] || '';
			let helpRoom = /** @type {ChatRoom?} */ (Rooms(`help-${user.userid}`));
			if (!helpRoom) {
				helpRoom = Rooms.createChatRoom(`help-${user.userid}`, `[H] ${user.name}`, {
					isPersonal: true,
					isHelp: 'open',
					isPrivate: 'hidden',
					modjoin: (upper ? '&' : '%'),
					auth: {[user.userid]: '+'},
					introMessage: introMessage,
					staffMessage: staffMessage + staffHint,
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
				helpRoom.introMessage = introMessage;
				helpRoom.staffMessage = staffMessage + staffHint;
				if (helpRoom.game) helpRoom.game.destroy();
				helpRoom.game = new HelpTicket(helpRoom, ticket);
			}
			const ticketGame = /** @type {HelpTicket} */ (helpRoom.game);
			ticketGame.modnote(user, `${user.name} opened a new ticket. Issue: ${ticket.type}`);
			this.parse(`/join help-${user.userid}`);
			if (!(user.userid in ticketGame.players)) {
				// User was already in the room, manually add them to the "game" so they get a popup if they try to leave
				ticketGame.addPlayer(user);
			}
			if (contexts[ticket.type]) {
				helpRoom.add(`|c|~Staff|${contexts[ticket.type]}`);
				helpRoom.update();
			} else {
				ticket.active = true;
			}
			tickets[user.userid] = ticket;
			writeTickets();
			notifyStaff(upper);
			connection.send(`>view-help-request\n|deinit`);
		},

		escalate(target, room, user, connection) {
			if (!this.can('lock')) return;
			target = toId(this.splitTarget(target, true));
			if (!this.targetUsername) return this.parse(`/help helpticket escalate`);
			let ticket = tickets[toId(this.targetUsername)];
			if (!ticket || !ticket.open) return this.errorReply(`${this.targetUsername} does not have an open ticket.`);
			if (ticket.escalated && !user.can('declare')) return this.errorReply(`/helpticket escalate - Access denied for escalating upper staff tickets.`);
			if (target === 'upperstaff' && ticket.escalated) return this.errorReply(`${ticket.creator}'s ticket is already escalated.`);
			let helpRoom = Rooms('help-' + ticket.userid);
			if (!helpRoom) return this.errorReply(`${ticket.creator}'s help room is expired and cannot be escalated.`);
			const ticketGame = /** @type {HelpTicket} */ (helpRoom.game);
			ticketGame.escalate((toId(target) === 'upperstaff'), user);
			return this.sendReply(`${ticket.creator}'s ticket was escalated.`);
		},
		escalatehelp: [`/helpticket escalate [user], (upperstaff) - Escalate a ticket. If upperstaff is included, escalate the ticket to upper staff. Requires: % @ & ~`],

		'!list': true,
		list(target, room, user) {
			if (!this.can('lock')) return;
			this.parse('/join view-help-tickets');
		},
		listhelp: [`/helpticket list - Lists all tickets. Requires: % @ & ~`],

		'!close': true,
		close(target, room, user) {
			if (!target) return this.parse(`/help helpticket close`);
			let ticket = tickets[toId(target)];
			if (!ticket || !ticket.open || (ticket.userid !== user.userid && !user.can('lock'))) return this.errorReply(`${target} does not have an open ticket.`);
			if (ticket.escalated && ticket.userid !== user.userid && !user.can('declare')) return this.errorReply(`/helpticket close - Access denied for closing upper staff tickets.`);
			const helpRoom = /** @type {ChatRoom?} */ (Rooms(`help-${ticket.userid}`));
			if (helpRoom) {
				const ticketGame = /** @type {HelpTicket} */ (helpRoom.game);
				ticketGame.close(user);
			} else {
				ticket.open = false;
				notifyStaff(ticket.escalated);
				writeTickets();
			}
			ticket.claimed = user.name;
			this.sendReply(`You closed ${ticket.creator}'s ticket.`);
		},
		closehelp: [`/helpticket close [user] - Closes an open ticket. Requires: % @ & ~`],

		ban(target, room, user) {
			if (!target) return this.parse('/help helpticket ban');
			target = this.splitTarget(target, true);
			let targetUser = this.targetUser;
			if (!this.can('lock', targetUser)) return;

			let ticket = tickets[toId(this.targetUsername)];
			let ticketBan = ticketBans[toId(this.targetUsername)];
			if (!targetUser && !Punishments.search(toId(this.targetUsername)).length && !ticket && !ticketBan) {
				return this.errorReply(`User '${this.targetUsername}' not found.`);
			}
			if (target.length > 300) {
				return this.errorReply(`The reason is too long. It cannot exceed 300 characters.`);
			}

			let name, userid;

			if (targetUser) {
				name = targetUser.getLastName();
				userid = targetUser.getLastId();
				if (ticketBan && ticketBan.expires > Date.now()) return this.privateModAction(`(${name} would be ticket banned by ${user.name} but was already ticket banned.)`);
				if (targetUser.trusted) Monitor.log(`[CrisisMonitor] Trusted user ${targetUser.name}${(targetUser.trusted !== targetUser.userid ? ` (${targetUser.trusted})` : ``)} was ticket banned by ${user.name}, and should probably be demoted.`);
			} else {
				name = this.targetUsername;
				userid = toId(this.targetUsername);
				if (ticketBan && ticketBan.expires > Date.now()) return this.privateModAction(`(${name} would be ticket banned by ${user.name} but was already ticket banned.)`);
			}

			if (targetUser) {
				targetUser.popup(`|modal|${user.name} has banned you from creating help tickets.${(target ? `\n\nReason: ${target}` : ``)}\n\nYour ban will expire in a few days.`);
			}

			this.addModAction(`${name} was ticket banned by ${user.name}.${target ? ` (${target})` : ``}`);

			let affected = /** @type {any[]} */ ([]);
			let punishment = /** @type {BannedTicketState} */ ({
				banned: name,
				name: name,
				userid: toId(name),
				by: user.name,
				created: Date.now(),
				expires: Date.now() + TICKET_BAN_DURATION,
				reason: target,
				ip: (targetUser ? targetUser.latestIp : ticket ? ticket.ip : ticketBan.ip),
			});

			if (targetUser) {
				affected.push(targetUser);
				affected.concat(targetUser.getAltUsers(false, true));
			} else {
				let foundKeys = Punishments.search(userid).map(([key]) => key);
				let userids = new Set([userid]);
				let ips = new Set();
				for (let key of foundKeys) {
					if (key.includes('.')) {
						ips.add(key);
					} else {
						userids.add(key);
					}
				}
				affected = Users.findUsers([...userids], [...ips], {includeTrusted: true, forPunishment: true});
				affected.unshift(userid);
			}

			let acAccount = (targetUser && targetUser.autoconfirmed !== userid && targetUser.autoconfirmed);
			let displayMessage = '';
			if (affected.length > 1) {
				displayMessage = `(${name}'s ${acAccount ? ` ac account: ${acAccount}, ` : ""}ticket banned alts: ${affected.slice(1).map(user => user.getLastName()).join(", ")})`;
				this.privateModAction(displayMessage);
			} else if (acAccount) {
				displayMessage = `(${name}'s ac account: ${acAccount})`;
				this.privateModAction(displayMessage);
			}

			for (let user of affected) {
				let userid = (typeof user !== 'string' ? user.getLastId() : toId(user));
				let targetTicket = tickets[userid];
				if (targetTicket && targetTicket.open) targetTicket.open = false;
				if (Rooms(`help-${userid}`)) Rooms(`help-${userid}`).destroy();
				ticketBans[userid] = punishment;
			}
			writeTickets();
			notifyStaff();
			notifyStaff(true);

			this.globalModlog(`TICKETBAN`, targetUser || userid, ` by ${user.name}${target}`);
			return true;
		},
		banhelp: [`/helpticket ban [user], (reason) - Bans a user from creating tickets for 2 days. Requires: % @ & ~`],

		unban(target, room, user) {
			if (!target) return this.parse('/help helpticket unban');

			if (!this.can('lock')) return;
			let targetUser = Users.get(target, true);
			let ticket = ticketBans[toId(target)];
			if (!ticket || !ticket.banned) return this.errorReply(`${targetUser ? targetUser.name : target} is not ticket banned.`);
			if (ticket.expires <= Date.now()) {
				delete tickets[ticket.userid];
				writeTickets();
				return this.errorReply(`${targetUser ? targetUser.name : target}'s ticket ban is already expired.`);
			}

			let affected = [];
			for (let t in ticketBans) {
				if (toId(ticketBans[t].banned) === toId(ticket.banned) && ticketBans[t].userid !== ticket.userid) {
					affected.push(ticketBans[t].name);
					delete ticketBans[t];
				}
			}
			affected.unshift(ticket.name);
			delete ticketBans[ticket.userid];
			writeTickets();

			this.addModAction(`${affected.join(', ')} ${Chat.plural(affected.length, "were", "was")} ticket unbanned by ${user.name}.`);
			this.globalModlog("UNTICKETBAN", target, `by ${user.userid}`);
			if (targetUser) targetUser.popup(`${user.name} has ticket unbanned you.`);
		},
		unbanhelp: [`/helpticket unban [user] - Ticket unbans a user. Requires: % @ & ~`],

		ignore(target, room, user) {
			if (!this.can('lock')) return;
			if (user.ignoreTickets) return this.errorReply(`You are already ignoring help ticket notifications. Use /helpticket unignore to receive notifications again.`);
			user.ignoreTickets = true;
			user.update('ignoreTickets');
			this.sendReply(`You are now ignoring help ticket notifications.`);
		},
		ignorehelp: [`/helpticket ignore - Ignore notifications for unclaimed help tickets. Requires: % @ & ~`],

		unignore(target, room, user) {
			if (!this.can('lock')) return;
			if (!user.ignoreTickets) return this.errorReply(`You are not ignoring help ticket notifications. Use /helpticket ignore to stop receiving notifications.`);
			user.ignoreTickets = false;
			user.update('ignoreTickets');
			this.sendReply(`You will now receive help ticket notifications.`);
		},
		unignorehelp: [`/helpticket unignore - Stop ignoring notifications for help tickets. Requires: % @ & ~`],

		delete(target, room, user) {
			// This is a utility only to be used if something goes wrong
			if (!this.can('declare')) return;
			if (!target) return this.parse(`/help helpticket delete`);
			let ticket = tickets[toId(target)];
			if (!ticket) return this.errorReply(`${target} does not have a ticket.`);
			let targetRoom = /** @type {ChatRoom} */ (Rooms(`help-${ticket.userid}`));
			if (targetRoom) {
				// @ts-ignore
				targetRoom.game.deleteTicket(user);
			} else {
				delete tickets[ticket.userid];
				writeTickets();
				notifyStaff(ticket.escalated);
			}
			this.sendReply(`You deleted ${target}'s ticket.`);
		},
		deletehelp: [`/helpticket delete [user] - Deletes a users ticket. Requires: & ~`],

	},
	helptickethelp: [
		`/helpticket create - Creates a new ticket, requesting help from global staff.`,
		`/helpticket list - Lists all tickets. Requires: % @ & ~`,
		`/helpticket escalate [user], (upperstaff) - Escalates a ticket. If upperstaff is included, the ticket is escalated to upper staff. Requires: % @ & ~`,
		`/helpticket close [user] - Closes an open ticket. Requires: % @ & ~`,
		`/helpticket ban [user], (reason) - Bans a user from creating tickets for 2 days. Requires: % @ & ~`,
		`/helpticket unban [user] - Ticket unbans a user. Requires: % @ & ~`,
		`/helpticket ignore - Ignore notifications for unclaimed help tickets. Requires: % @ & ~`,
		`/helpticket unignore - Stop ignoring notifications for help tickets. Requires: % @ & ~`,
		`/helpticket delete [user] - Deletes a user's ticket. Requires: & ~`,
	],
};
exports.commands = commands;
