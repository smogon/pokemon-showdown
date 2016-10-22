/**
* Scavenger hunts plugin. Only works in a room with the id 'scavengers'.
* This game shows a hint. Once a player submits the correct answer, they move on to the next hint.
* You finish upon correctly answering the third hint.
* In an official hunt, the first three to finish within 60 seconds achieve blitz.
*/

'use strict';

let scavengers = {
	status: 'off',
	blitz: null,
	hints: null,
	answers: null,
	participants: {},
	finished: [],
	result: null,
};

let scavengersRoom = Rooms.get('scavengers');
if (scavengersRoom) {
	if (scavengersRoom.plugin) {
		scavengers = scavengersRoom.plugin;
	} else {
		scavengersRoom.plugin = scavengers;
	}
}

exports.commands = {
	scavenger: 'scavengers',
	scavengers: function (target, room, user) {
		return this.parse('/join scavengers');
	},
	startofficialhunt: 'starthunt',
	starthunt: function (target, room, user, connection, cmd) {
		if (room.id !== 'scavengers') return this.errorReply('This command can only be used in the Scavengers room.');
		if (!this.can('mute', null, room)) return false;
		if (scavengers.status === 'on') return this.errorReply('There is already an active scavenger hunt.');
		let targets = target.split(target.includes('|') ? '|' : ',');
		if (!targets[0] || !targets[1] || !targets[2] || !targets[3] || !targets[4] || !targets[5] || targets[6]) {
			return this.errorReply('You must specify three hints and three answers.');
		}
		if (cmd === 'startofficialhunt') {
			scavengers.blitz = setTimeout(() => {
				scavengers.blitz = null;
			}, 60000);
		}
		scavengers.status = 'on';
		scavengers.hints = [targets[0].trim(), targets[2].trim(), targets[4].trim()];
		scavengers.answers = [toId(targets[1]), toId(targets[3]), toId(targets[5])];
		scavengers.startTime = Date.now();
		let result = (cmd === 'startofficialhunt' ? 'An official' : 'A new') + ' Scavenger Hunt has been started by <em> ' + Chat.escapeHTML(user.name) + '</em>! The first hint is: ' + Chat.escapeHTML(scavengers.hints[0]);
		Rooms('scavengers').addRaw('<div class="broadcast-blue"><strong>' + result + '</strong></div>');
	},
	joinhunt: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply('This command can only be used in the Scavengers room.');
		if (scavengers.status !== 'on') return this.errorReply('There is no active scavenger hunt.');
		if (user.userid in scavengers.participants) return this.errorReply('You are already participating in the current scavenger hunt.');
		scavengers.participants[user.userid] = {room: 0};
		this.sendReply('You joined the scavenger hunt! Use the command /scavenge to answer. The first hint is: ' + scavengers.hints[0]);
	},
	scavenge: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply('This command can only be used in the Scavengers room.');
		if (scavengers.status !== 'on') return this.errorReply('There is no active scavenger hunt.');
		if (!scavengers.participants[user.userid]) return this.errorReply('You are not participating in the current scavenger hunt. Use the command /joinhunt to participate.');
		if (scavengers.participants[user.userid].room >= 3) return this.sendReply('You have already finished!');
		target = toId(target);
		let roomnum = scavengers.participants[user.userid].room;
		if (scavengers.answers[roomnum] === target) {
			scavengers.participants[user.userid].room++;
			roomnum++;
			if (roomnum < 3) {
				this.sendReply('Well done! Your ' + (roomnum === 1 ? 'second' : 'final') + ' hint is: ' + scavengers.hints[roomnum]);
			} else {
				scavengers.finished.push(user.name);
				let position = scavengers.finished.length;
				let result = '<em>' + Chat.escapeHTML(user.name) + '</em> has finished the hunt ';
				result += (position === 1) ? 'and is the winner!' : (position === 2) ? 'in 2nd place!' : (position === 3) ? 'in 3rd place!' : 'in ' + position + 'th place!';
				result += (position < 4 && scavengers.blitz ? ' [BLITZ]' : '');
				result += ' (' + Chat.toDurationString(Date.now() - scavengers.startTime, {hhmmss: true}) + ')';
				Rooms('scavengers').addRaw('<div class="broadcast-blue"><strong>' + result + '</strong></div>');
			}
		} else {
			this.sendReply('That is not the answer - try again!');
		}
	},
	scavengerhint: 'scavengerstatus',
	scavengerstatus: function (target, room, user, connection, cmd) {
		if (room.id !== 'scavengers') return this.errorReply('This command can only be used in the Scavengers room.');
		if (scavengers.status !== 'on') return this.errorReply('There is no active scavenger hunt.');
		if (!scavengers.participants[user.userid]) {
			if (!this.can('mute', null, room) || cmd !== 'scavengerstatus') return this.errorReply('You are not participating in the current scavenger hunt. Use the command /joinhunt to participate.');
			let uptime = (Date.now() - scavengers.startTime) / 1000;
			let uptimeText;
			if (uptime > 24 * 60 * 60) {
				let uptimeDays = Math.floor(uptime / (24 * 60 * 60));
				uptimeText = uptimeDays + " " + (uptimeDays === 1 ? "day" : "days");
				let uptimeHours = Math.floor(uptime / (60 * 60)) - uptimeDays * 24;
				if (uptimeHours) uptimeText += ", " + uptimeHours + " " + (uptimeHours === 1 ? "hour" : "hours");
			} else {
				uptimeText = Chat.toDurationString(uptime * 1000);
			}
			this.sendReply('The current scavenger hunt has been up for: ' + uptimeText);
			if (scavengers.finished.length) {
				this.sendReply('The following users have completed it: ' + scavengers.finished.join(', '));
			} else {
				this.sendReply('No user has completed it.');
			}
			return;
		}
		if (scavengers.participants[user.userid].room >= 3) return this.sendReply('You have finished the current scavenger hunt.');
		let roomnum = scavengers.participants[user.userid].room;
		this.sendReply('You are on hint number ' + (roomnum + 1) + ': ' + scavengers.hints[roomnum]);
	},
	endhunt: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply('This command can only be used in the Scavengers room.');
		if (!this.can('mute', null, room)) return false;
		if (scavengers.status !== 'on') return this.errorReply('There is no active scavenger hunt.');
		let winner = scavengers.finished[0];
		let second = scavengers.finished[1];
		let third = scavengers.finished[2];
		let consolation = scavengers.finished.slice(3).join(', ');
		let msg = 'The Scavenger Hunt was ended by <em>' + Chat.escapeHTML(user.name) + '</em>. ';
		if (winner) {
			msg += '<br />Winner: <em>' + Chat.escapeHTML(winner) + '</em>.';
			if (second) msg += ' Second place: <em>' + Chat.escapeHTML(second) + '</em>.';
			if (third) msg += ' Third place: <em>' + Chat.escapeHTML(third) + '</em>.';
			if (consolation) msg += ' Consolation prize to: ' + Chat.escapeHTML(consolation) + '.';
		} else {
			msg += 'No user has completed the hunt.';
		}
		msg += '<br />Solution: ' + Chat.escapeHTML(scavengers.answers.join(', ')) + '.';
		scavengers.result = msg;
		this.parse('/resethunt');
	},
	resethunt: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply('This command can only be used in the Scavengers room.');
		if (!this.can('mute', null, room)) return false;
		if (scavengers.status !== 'on') return this.errorReply('There is no active scavenger hunt.');
		scavengers.status = 'off';
		if (scavengers.blitz) clearTimeout(scavengers.blitz);
		scavengers.blitz = null;
		scavengers.hints = null;
		scavengers.answers = null;
		scavengers.participants = {};
		scavengers.finished = [];
		if (scavengers.result) {
			Rooms('scavengers').addRaw('<div class="broadcast-blue"><strong>' + scavengers.result + '</strong></div>');
		} else {
			Rooms('scavengers').addRaw('<div class="broadcast-blue"><strong>The Scavenger Hunt was reset by <em>' + Chat.escapeHTML(user.name) + '</em>.</strong></div>');
		}
		scavengers.result = null;
	},
	scavengershelp: 'scavengerhelp',
	scavengerhelp: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply('This command can only be used in the Scavengers room.');
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			'<strong>Player commands:</strong><br />' +
			'- /scavengers - Join the scavengers room<br />' +
			'- /joinhunt - Join the current scavenger hunt<br />' +
			'- /scavenge <em>guess</em> - Attempt to answer the hint<br />' +
			'- /scavengerstatus - Get your current game status<br />' +
			'<br />' +
			'<strong>Staff commands:</strong><br />' +
			'- /starthunt <em>hint, answer, hint, answer, hint, answer</em> - Start a new scavenger hunt (Requires: % @ * # & ~)<br />' +
			'- /startofficialhunt <em>hint, answer, hint, answer, hint, answer</em> - Start an official hunt with 60 seconds blitz period (Requires: % @ * # & ~)<br />' +
			'- /endhunt - Finish the current hunt and announce the winners (Requires: % @ * # & ~)<br />' +
			'- /resethunt - Reset the scavenger hunt to mint status (Requires: % @ * # & ~)'
		);
	},
};
