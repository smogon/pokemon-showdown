/**
* Scavenger hunts plugin. Only works in a room with the id 'scavengers'.
* This game shows a hint. Once a player submits the correct answer, they move on to the next hint.
* You finish upon correctly answering the third hint.
* In an official hunt, the first three to finish within 60 seconds achieve blitz.
*/

var scavengers = {
	status: 'off',
	blitz: null,
	hints: null,
	answers: null,
	participants: {},
	finished: [],
	result: null
};

var scavengersRoom = Rooms.get('scavengers');
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
		var targets = target.split(target.includes('|') ? '|' : ',');
		if (!targets[0] || !targets[1] || !targets[2] || !targets[3] || !targets[4] || !targets[5] || targets[6]) {
			return this.errorReply('You must specify three hints and three answers.');
		}
		if (cmd === 'startofficialhunt') {
			if (!this.can('ban', null, room)) return false;
			scavengers.blitz = setTimeout(function () {
				scavengers.blitz = null;
			}, 60000);
		}
		scavengers.status = 'on';
		scavengers.hints = [targets[0].trim(), targets[2].trim(), targets[4].trim()];
		scavengers.answers = [toId(targets[1]), toId(targets[3]), toId(targets[5])];
		var result = (cmd === 'startofficialhunt' ? 'An official' : 'A new') + ' Scavenger Hunt has been started by <em> ' + Tools.escapeHTML(user.name) + '</em>! The first hint is: ' + Tools.escapeHTML(scavengers.hints[0]);
		Rooms.rooms.scavengers.addRaw('<div class="broadcast-blue"><strong>' + result + '</strong></div>');
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
		var roomnum = scavengers.participants[user.userid].room;
		if (scavengers.answers[roomnum] === target) {
			scavengers.participants[user.userid].room++;
			roomnum++;
			if (roomnum < 3) {
				this.sendReply('Well done! Your ' + (roomnum === 1 ? 'second' : 'final') + ' hint is: ' + scavengers.hints[roomnum]);
			} else {
				scavengers.finished.push(user.name);
				var position = scavengers.finished.length;
				var result = '<em>' + Tools.escapeHTML(user.name) + '</em> has finished the hunt ';
				result += (position === 1) ? 'and is the winner!' : (position === 2) ? 'in 2nd place!' : (position === 3) ? 'in 3rd place!' : 'in ' + position + 'th place!';
				result += (position < 4 && scavengers.blitz ? ' [BLITZ]' : '');
				Rooms.rooms.scavengers.addRaw('<div class="broadcast-blue"><strong>' + result + '</strong></div>');
			}
		} else {
			this.sendReply('That is not the answer - try again!');
		}
	},
	scavengerhint: 'scavengerstatus',
	scavengerstatus: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply('This command can only be used in the Scavengers room.');
		if (scavengers.status !== 'on') return this.errorReply('There is no active scavenger hunt.');
		if (!scavengers.participants[user.userid]) return this.errorReply('You are not participating in the current scavenger hunt. Use the command /joinhunt to participate.');
		if (scavengers.participants[user.userid].room >= 3) return this.sendReply('You have finished the current scavenger hunt.');
		var roomnum = scavengers.participants[user.userid].room;
		this.sendReply('You are on hint number ' + (roomnum + 1) + ': ' + scavengers.hints[roomnum]);
	},
	endhunt: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply('This command can only be used in the Scavengers room.');
		if (!this.can('mute', null, room)) return false;
		if (scavengers.status !== 'on') return this.errorReply('There is no active scavenger hunt.');
		var winner = scavengers.finished[0];
		var second = scavengers.finished[1];
		var third = scavengers.finished[2];
		var consolation = scavengers.finished.slice(3).join(', ');
		var msg = 'The Scavenger Hunt was ended by <em>' + Tools.escapeHTML(user.name) + '</em>. ';
		if (winner) {
			msg += '<br />Winner: <em>' + Tools.escapeHTML(winner) + '</em>.';
			if (second) msg += ' Second place: <em>' + Tools.escapeHTML(second) + '</em>.';
			if (third) msg += ' Third place: <em>' + Tools.escapeHTML(third) + '</em>.';
			if (consolation) msg += ' Consolation prize to: ' + Tools.escapeHTML(consolation) + '.';
		} else {
			msg += 'No user has completed the hunt.';
		}
		msg += '<br />Solution: ' + Tools.escapeHTML(scavengers.answers.join(', ')) + '.';
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
			Rooms.rooms.scavengers.addRaw('<div class="broadcast-blue"><strong>' + scavengers.result + '</strong></div>');
		} else {
			Rooms.rooms.scavengers.addRaw('<div class="broadcast-blue"><strong>The Scavenger Hunt was reset by <em>' + Tools.escapeHTML(user.name) + '</em>.</strong></div>');
		}
		scavengers.result = null;
	},
	scavengershelp: 'scavengerhelp',
	scavengerhelp: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply('This command can only be used in the Scavengers room.');
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
