
const LOTTERY_FILE = 'config/chat-plugins/lottery.json';

import {FS} from '../../lib/fs';

const lotteriesContents = FS(LOTTERY_FILE).readIfExistsSync();
const lotteries: {
	[roomid: string]: {
		maxWinners: number,
		name: string,
		markup: string,
		participants: {[ip: string]: string},
		winners: string[],
		running: boolean,
	},
} = lotteriesContents ? Object.assign(Object.create(null), JSON.parse(lotteriesContents)) : Object.create(null);

function createLottery(roomid: string, maxWinners: number, name: string, markup: string) {
	if (!lotteries[roomid]) {
		lotteries[roomid] = {maxWinners, name, markup, participants: Object.create(null), winners: [], running: true};
		writeLotteries();
	}
}
function writeLotteries() {
	for (const roomid of Object.keys(lotteries)) {
		if (!Rooms.get(roomid)) {
			delete lotteries[roomid];
		}
	}
	FS(LOTTERY_FILE).writeUpdate(() => JSON.stringify(lotteries));
}
function destroyLottery(roomid: string) {
	delete lotteries[roomid];
	writeLotteries();
}
function endLottery(roomid: string, winners: string[]) {
	const lottery = lotteries[roomid];
	if (!lottery) return;
	lottery.winners = winners;
	lottery.running = false;
	Object.freeze(lottery);
	writeLotteries();
}
function addUserToLottery(roomid: string, user: User) {
	const lottery = lotteries[roomid];
	if (!lottery) return;
	const participants = lottery.participants;
	const userSignedup = participants[user.latestIp] || Object.values(participants).map(toID).includes(user.userid);
	if (!userSignedup) {
		participants[user.latestIp] = user.name;
		writeLotteries();
		return true;
	}
	return false;
}
function removeUserFromLottery(roomid: string, user: User) {
	const lottery = lotteries[roomid];
	if (!lottery) return;
	const participants = lottery.participants;
	for (const [ip, participant] of Object.entries(participants)) {
		if (toID(participant) === user.userid || ip === user.latestIp) {
			delete participants[ip];
			writeLotteries();
			return true;
		}
	}
	return false;
}
function getWinnersInLottery(roomid: string) {
	const lottery = lotteries[roomid];
	if (!lottery) return;
	const winners = [];
	const participants = Object.values(lottery.participants);
	for (let i = 0; i < lottery.maxWinners; i++) {
		const randomIdx = participants.length * Math.random() << 0;
		const winner = participants[randomIdx];
		winners.push(winner);
		participants.splice(randomIdx, 1);
	}
	return winners;
}

export const commands: ChatCommands = {
	lottery: {
		''(target, room) {
			const lottery = lotteries[room.id];
			if (!lottery) {
				return this.errorReply("This room doesn't have a lottery running.");
			}
			return this.parse(`/join view-lottery-${room.id}`);
		},
		create(target, room, user) {
			if (!this.can('declare', null, room)) return;
			if (room.battle || !room.chatRoomData) {
				return this.errorReply('This room does not support the creation of lotteries.');
			}
			const lottery = lotteries[room.id];
			if (lottery && lottery.running) {
				return this.errorReply(`There is already a lottery running in this room.`);
			}
			const [maxWinners, name, markup] = Chat.splitFirst(target, ',', 2).map(val => val.trim());
			if (!(maxWinners && name && markup.length)) {
				return this.errorReply("You're missing a command parameter - see /help lottery for this command's syntax.");
			}
			const maxWinnersNum = parseInt(maxWinners);
			if (!this.canHTML(markup)) return;
			if (isNaN(maxWinnersNum)) {
				return this.errorReply(`${maxWinners} is not a valid number.`);
			}
			if (maxWinnersNum < 1) {
				return this.errorReply('The maximum winners should be at least 1.');
			}
			if (name.length > 50) {
				return this.errorReply('Name needs to be under 50 characters.');
			}
			createLottery(room.id, maxWinnersNum, name, markup);
			this.sendReply('The lottery was successfully created.');
			// tslint:disable-next-line: max-line-length
			this.add(Chat.html`|raw|<div class="broadcast-blue"><b>${user.name} created the "<a href="/view-lottery-${room.id}">${name}</a>" lottery!</b></div>`);
			this.modlog(`LOTTERY CREATE ${name}`);
		},
		delete(target, room, user) {
			if (!this.can('declare', null, room)) return;
			const lottery = lotteries[room.id];
			if (!lottery) {
				return this.errorReply('This room does not have a lottery running.');
			}
			destroyLottery(room.id);
			this.addModAction(`${user.name} deleted the "${lottery.name}" lottery.`);
			this.modlog('LOTTERY DELETE');
			this.sendReply('The lottery was successfully deleted.');
		},
		end(target, room) {
			if (!this.can('declare', null, room)) return;
			const lottery = lotteries[room.id];
			if (!lottery) {
				return this.errorReply('This room does not have a lottery running.');
			}
			if (!lottery.running) {
				return this.errorReply(`The "${lottery.name}" lottery already ended.`);
			}
			if (lottery.maxWinners >= Object.keys(lottery.participants).length) {
				return this.errorReply('There have been not enough participants for you to be able to end this. If you wish to end it anyway use /lottery delete.');
			}
			const winners = getWinnersInLottery(room.id);
			if (!winners) return this.errorReply(`An error occured while getting the winners.`);
			// tslint:disable-next-line: max-line-length
			this.add(Chat.html`|raw|<div class="broadcast-blue"><b>${Chat.toListString(winners)} won the "<a href="/view-lottery-${room.id}">${lottery.name}</a>" lottery!</b></div>`);
			this.modlog(`LOTTERY END ${lottery.name}`);
			endLottery(room.id, winners);
		},
		'!join': true,
		join(target, room, user) {
			// This hack is used for the HTML room to be able to
			// join lotteries in other rooms from the global room
			const roomid = target || (room && room.id);
			if (!roomid) {
				return this.errorReply(`This is not a valid room.`);
			}
			const lottery = lotteries[roomid];
			if (!lottery) {
				return this.errorReply(`${roomid} does not have a lottery running.`);
			}
			if (!lottery.running) {
				return this.errorReply(`The "${lottery.name}" lottery already ended.`);
			}
			if (!user.autoconfirmed) {
				return this.popupReply('You must be autoconfirmed to join lotteries.');
			}
			if (user.locked || Punishments.getRoomPunishments(user, {publicOnly: true, checkIps: true}).length) {
				return this.popupReply('Punished users cannot join lotteries.');
			}
			const success = addUserToLottery(roomid, user);
			if (success) {
				this.popupReply('You have successfully joined the lottery.');
			} else {
				this.popupReply('You are already in the lottery.');
			}
		},
		'!leave': true,
		leave(target, room, user) {
			// This hack is used for the HTML room to be able to
			// join lotteries in other rooms from the global room
			const roomid = target || (room && room.id);
			if (!roomid) {
				return this.errorReply('This can only be used in rooms.');
			}
			const lottery = lotteries[roomid];
			if (!lottery) {
				return this.errorReply(`${roomid} does not have a lottery running.`);
			}
			if (!lottery.running) {
				return this.errorReply(`The "${lottery.name}" lottery already ended.`);
			}
			const success = removeUserFromLottery(roomid, user);
			if (success) {
				this.popupReply('You have successfully left the lottery.');
			} else {
				this.popupReply('You have not joined the lottery.');
			}
		},
		participants(target, room, user) {
			if (!this.can('declare', null, room)) return;
			const lottery = lotteries[room.id];
			if (!lottery) {
				return this.errorReply('This room does not have a lottery running.');
			}
			const canSeeIps = user.can('ban');
			const participants = Object.entries(lottery.participants).map(([ip, participant]) => {
				return `${participant}${canSeeIps ? ' (IP: ' + ip + ')' : ''}`;
			});
			const buf = `<b>List of participants (${participants.length}):</b><p>${participants.join(', ')}</p>`;
			this.sendReplyBox(buf);
		},
		help() {
			return this.parse('/help lottery');
		},
	},
	lotteryhelp: [
		`/lottery - opens the current lottery, if it exists.`,
		`/lottery create maxWinners, name, html - creates a new lottery with [name] as the header and [html] as body. Max winners is the amount of people that will win the lottery. Requires # & ~`,
		`/lottery delete - deletes the current lottery without declaring a winner. Requires # & ~`,
		`/lottery end - ends the current declaring a random participant as the winner. Requires # & ~`,
		`/lottery join - joins the current lottery, if it exists, you need to be not currently punished in any public room, not locked and be autoconfirmed.`,
		`/lottery leave - leaves the current lottery, if it exists.`,
		`/lottery participants - shows the current participants in the lottery. Requires: # & ~`,
	],
};

export const pages: PageTable = {
	lottery(query, user) {
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		this.extractRoom();
		this.title = 'Lottery';
		let buf = '<div class="pad">';
		const lottery = lotteries[this.room.id];
		if (!lottery) {
			buf += `<h2>There is no lottery running in ${this.room.title}</h2></div>`;
			return buf;
		}
		buf += `<h2 style="text-align: center">${lottery.name}</h2>${lottery.markup}<br />`;
		if (lottery.running) {
			const userSignedUp = lottery.participants[user.latestIp]
				|| Object.values(lottery.participants).map(toID).includes(user.userid);
			buf += `<button class="button" name="send" style=" display: block; margin: 0 auto" value="/lottery ${userSignedUp ? 'leave' : 'join'} ${this.room.id}">${userSignedUp ? "Leave the " : "Sign up for the"} lottery</button>`;
		} else {
			buf += '<p style="text-align: center"><b>This lottery has already ended. The winners are:</b></p>';
			buf += '<ul style="display: table; margin: 0px auto">';
			for (const winner of lottery.winners) {
				buf += `<li>${winner}</li>`;
			}
			buf += '</ul>';
		}
		return buf;
	},
};
