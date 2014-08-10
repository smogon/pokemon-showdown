/**
* Scavenger hunts plugin. Only works in a room with the id 'scavengers'.
* This game shows a hint. Once a player submits the correct answer, they move on to the next hint.
* You finish upon correctly answering the third hint.
* In an official hunt, the first three to finish within 60 seconds achieve blitz.
*/

var status = 'off';
var blitz = null;
var hints = null;
var answers = null;
var participants = {};
var finished = [];
var result = null;

exports.commands = {
	scavenger: 'scavengers',
	scavengers: function (target, room, user) {
		return this.parse('/join scavengers');
	},
	startofficialhunt: 'starthunt',
	starthunt: function (target, room, user, connection, cmd) {
		if (room.id !== 'scavengers') return this.sendReply('This command can only be used in the Scavengers room.');
		if (!this.can('mute', null, room)) return false;
		if (status === 'on') return this.sendReply('There is already an active scavenger hunt.');
		var targets = target.split(',');
		if (!targets[0] || !targets[1] || !targets[2] || !targets[3] || !targets[4] || !targets[5] || targets[6]) {
			return this.sendReply('You must specify three hints and three answers.');
		}
		status = 'on';
		if (cmd === 'startofficialhunt') {
			if (!this.can('ban', null, room)) return false;
			blitz = setTimeout(function () {
				blitz = null;
			}, 60000);
		}
		hints = [targets[0].trim(), targets[2].trim(), targets[4].trim()];
		answers = [toId(targets[1]), toId(targets[3]), toId(targets[5])];
		var result = (cmd === 'startofficialhunt' ? 'An official' : 'A new') + ' Scavenger Hunt has been started by <em> ' + Tools.escapeHTML(user.name) + '</em>! The first hint is: ' + Tools.escapeHTML(hints[0]);
		Rooms.rooms.scavengers.addRaw('<div class="broadcast-blue"><strong>' + result + '</strong></div>');
	},
	joinhunt: function (target, room, user) {
		if (room.id !== 'scavengers') return this.sendReply('This command can only be used in the Scavengers room.');
		if (status !== 'on') return this.sendReply('There is no active scavenger hunt.');
		if (user.userid in participants) return this.sendReply('You are already participating in the current scavenger hunt.');
		participants[user.userid] = {room: 0};
		this.sendReply('You joined the scavenger hunt! Use the command /scavenge to answer. The first hint is: ' + hints[0]);
	},
	scavenge: function (target, room, user) {
		if (room.id !== 'scavengers') return this.sendReply('This command can only be used in the Scavengers room.');
		if (status !== 'on') return this.sendReply('There is no active scavenger hunt.');
		if (!participants[user.userid]) return this.sendReply('You are not participating in the current scavenger hunt. Use the command /joinhunt to participate.');
		if (participants[user.userid].room >= 3) return this.sendReply('You have already finished!');
		target = toId(target);
		var roomnum = participants[user.userid].room;
		if (answers[roomnum] === target) {
			participants[user.userid].room++;
			roomnum++;
			if (roomnum < 3) {
				this.sendReply('Well done! Your ' + (roomnum === 1 ? 'second' : 'final') + ' hint is: ' + hints[roomnum]);
			} else {
				finished.push(user.name);
				var position = finished.length;
				var result = '<em>' + Tools.escapeHTML(user.name) + '</em> has finished the hunt ';
				result += (position === 1) ? 'and is the winner!' : (position === 2) ? 'in 2nd place!' : (position === 3) ? 'in 3rd place!' : 'in ' + position + 'th place!';
				result += (position < 4 && blitz ? ' [BLITZ]' : '');
				Rooms.rooms.scavengers.addRaw('<div class="broadcast-blue"><strong>' + result + '</strong></div>');
			}
		} else {
			this.sendReply('That is not the answer - try again!');
		}
	},
	scavengerhint: 'scavengerstatus',
	scavengerstatus: function (target, room, user) {
		if (room.id !== 'scavengers') return this.sendReply('This command can only be used in the Scavengers room.');
		if (status !== 'on') return this.sendReply('There is no active scavenger hunt.');
		if (!participants[user.userid]) return this.sendReply('You are not participating in the current scavenger hunt. Use the command /joinhunt to participate.');
		if (participants[user.userid].room >= 3) return this.sendReply('You have finished the current scavenger hunt.');
		var roomnum = participants[user.userid].room;
		this.sendReply('You are on hint number ' + (roomnum + 1) + ': ' + hints[roomnum]);
	},
	endhunt: function (target, room, user) {
		if (room.id !== 'scavengers') return this.sendReply('This command can only be used in the Scavengers room.');
		if (!this.can('mute', null, room)) return false;
		if (status !== 'on') return this.sendReply('There is no active scavenger hunt.');
		var winner = finished[0];
		var second = finished[1];
		var third = finished[2];
		var consolation = finished.slice(3).join(', ');
		var msg = 'The Scavenger Hunt was ended by <em>' + Tools.escapeHTML(user.name) + '</em>. ';
		if (winner) {
			msg += '<br />Winner: <em>' + Tools.escapeHTML(winner) + '</em>.';
			if (second) msg += ' Second place: <em>' + Tools.escapeHTML(second) + '</em>.';
			if (third) msg += ' Third place: <em>' + Tools.escapeHTML(third) + '</em>.';
			if (consolation) msg += ' Consolation prize to: ' + Tools.escapeHTML(consolation) + '.';
		} else {
			msg += 'No user has completed the hunt.';
		}
		msg += '<br />Solution: ' + Tools.escapeHTML(answers.join(', ')) + '.';
		result = msg;
		this.parse('/resethunt');
	},
	resethunt: function (target, room, user) {
		if (room.id !== 'scavengers') return this.sendReply('This command can only be used in the Scavengers room.');
		if (!this.can('mute', null, room)) return false;
		if (status !== 'on') return this.sendReply('There is no active scavenger hunt.');
		status = 'off';
		if (blitz) clearTimeout(blitz);
		blitz = null;
		hints = null;
		answers = null;
		participants = {};
		finished = [];
		if (result) {
			Rooms.rooms.scavengers.addRaw('<div class="broadcast-blue"><strong>' + result + '</strong></div>');
		} else {
			Rooms.rooms.scavengers.addRaw('<div class="broadcast-blue"><strong>The Scavenger Hunt was reset by <em>' + Tools.escapeHTML(user.name) + '</em>.</strong></div>');
		}
		result = null;
	},
	scavengershelp: 'scavengerhelp',
	scavengerhelp: function (target, room, user) {
		if (room.id !== 'scavengers') return this.sendReply('This command can only be used in the Scavengers room.');
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			'<strong>Player commands:</strong><br />' +
			'- /scavengers - Join the scavengers room<br />' +
			'- /joinhunt - Join the current scavenger hunt<br />' +
			'- /scavenge <em>guess</em> - Attempt to answer the hint<br />' +
			'- /scavengerstatus - Get your current game status<br />' +
			'<br />' +
			'<strong>Staff commands:</strong><br />' +
			'- /starthunt <em>hint, answer, hint, answer, hint, answer</em> - Start a new scavenger hunt (Requires: % @ # & ~)<br />' +
			'- /startofficialhunt <em>hint, answer, hint, answer, hint, answer</em> - Start an official hunt with 60 seconds blitz period (Requires: @ # & ~)<br />' +
			'- /endhunt - Finish the current hunt and announce the winners (Requires: % @ # & ~)<br />' +
			'- /resethunt - Reset the scavenger hunt to mint status (Requires: % @ # & ~)'
		);
	}
};
