/**
* Scavenger hunts plugin. Only works in a room with the id 'scavengers'.
* This game shows a hint. Once a player submits the correct answer, they move on to the next hint.
* You finish upon correctly answering the third hint.
* In an official hunt, the first three to finish within 60 seconds achieve blitz.
*/

'use strict';
const fs = require('fs');
let scavengers = {
	status: 'off',
	blitz: null,
	numblitzes: 0,
	hints: null,
	answers: null,
	participants: {},
	finished: [],
	resultHTML: null,
	updatinglb: false,
};

let scavengersRoom = Rooms.get('scavengers');
if (scavengersRoom) {
	if (scavengersRoom.plugin) {
		scavengers = scavengersRoom.plugin;
	} else {
		scavengersRoom.plugin = scavengers;
	}
}

let scavengersLB = {};
let dataFile = './config/chat-plugins/scavdata.json';
fs.readFile(dataFile, 'utf8', function (err, content) {
	if (err) {
		scavengersLB = {};
		return;
	}
	try {
		scavengersLB = JSON.parse(content);
	} catch (e) {
		scavengersLB = {};
	}
});
function addPoints(username, points) {
	let id = toId(username);
	if (!id) return;
	if (id in scavengersLB) {
		scavengersLB[id].points += points;
	} else {
		scavengersLB[id] = {
			points: points,
			name: Chat.escapeHTML(username),
		};
	}
}
function scavWriteData() {
	fs.writeFile(dataFile, JSON.stringify(scavengersLB));
}

function getLadder() {
	return Object.keys(scavengersLB).map(id => [scavengersLB[id].points, scavengersLB[id].name]).sort((a, b) => b[0] - a[0]);
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
		scavengers.updatinglb = (cmd === 'startofficialhunt');
		scavengers.numblitzes = 0;
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
				this.sendReply(`Well done! Your ${(roomnum === 1 ? 'second' : 'final')} hint is: ${scavengers.hints[roomnum]}`);
			} else {
				scavengers.finished.push(user.name);
				let position = scavengers.finished.length;
				let result = '<em>' + Chat.escapeHTML(user.name) + '</em> has finished the hunt ';
				result += (position === 1) ? 'and is the winner!' : (position === 2) ? 'in 2nd place!' : (position === 3) ? 'in 3rd place!' : 'in ' + position + 'th place!';
				result += (position < 4 && scavengers.blitz ? ' [BLITZ]' : '');
				if (position < 4 && scavengers.blitz) scavengers.numblitzes++;
				result += ' (' + Chat.toDurationString(Date.now() - scavengers.startTime, {hhmmss: true}) + ')';
				Rooms('scavengers').addRaw('<div class="broadcast-blue"><strong>' + result + '</strong></div>');
			}
		} else {
			this.sendReply('That is not the answer - try again!');
		}
	},
	scavhint: 'scavengerstatus',
	scavstatus: 'scavengerstatus',
	scavengerhint: 'scavengerstatus',
	scavengerstatus: function (target, room, user, connection, cmd) {
		if (room.id !== 'scavengers') return this.errorReply("This command can only be used in the Scavengers room.");
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
		this.sendReply(`You are on hint number ${(roomnum + 1)}: ${scavengers.hints[roomnum]}`);
	},
	endhunt: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply("This command can only be used in the Scavengers room.");
		if (!this.can('mute', null, room)) return false;
		if (scavengers.status !== 'on') return this.errorReply('There is no active scavenger hunt.');
		let winner = scavengers.finished[0];
		let second = scavengers.finished[1];
		let third = scavengers.finished[2];
		if (scavengers.updatinglb) {
			let fourth = scavengers.finished[3];
			let fifth = scavengers.finished[4];
			if (winner) addPoints(winner, 20);
			if (second) addPoints(second, 15);
			if (third) addPoints(third, 10);
			if (fourth) addPoints(fourth, 5);
			if (fifth) addPoints(fifth, 1);
			if (scavengers.numblitzes > 0) addPoints(winner, 10);
			if (scavengers.numblitzes > 1) addPoints(second, 10);
			if (scavengers.numblitzes > 2) addPoints(third, 10);
			scavWriteData();
		}
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
		scavengers.resultHTML = msg;
		this.parse('/resethunt');
	},
	resethunt: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply("This command can only be used in the Scavengers room.");
		if (!this.can('mute', null, room)) return false;
		if (scavengers.status !== 'on') return this.errorReply('There is no active scavenger hunt.');
		scavengers.status = 'off';
		if (scavengers.blitz) clearTimeout(scavengers.blitz);
		scavengers.blitz = null;
		scavengers.hints = null;
		scavengers.answers = null;
		scavengers.participants = {};
		scavengers.finished = [];
		scavengers.updatinglb = false;
		scavengers.numblitzes = 0;
		if (scavengers.resultHTML) {
			Rooms('scavengers').addRaw('<div class="broadcast-blue"><strong>' + scavengers.resultHTML + '</strong></div>');
		} else {
			Rooms('scavengers').addRaw('<div class="broadcast-blue"><strong>The Scavenger Hunt was reset by <em>' + Chat.escapeHTML(user.name) + '</em>.</strong></div>');
		}
		scavengers.resultHTML = null;
	},
	scavtop: 'scavengerstop',
	scavengerstop: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply("This command can only be used in the Scavengers room.");
		let ladder = getLadder();
		if (ladder.length === 0) return this.sendReply("The official leaderboard is empty.");
		let num = parseInt(target);
		if (!num || num < 0) num = 15;
		if (num > ladder.length) num = ladder.length;
		let buffer = "|raw|<div class=\"ladder\"><table>" +
			"<tr><th>Rank</th><th>User</th><th>Score</th></tr>";
		for (let i = Math.max(0, num - 15); i < num; i++) {
			buffer += "<tr><td>" + (i + 1) + "</td><td>" + (Rooms('scavengers').auth[toId(ladder[i][1])] ? ladder[i][1] : "<strong>" + ladder[i][1] + "</strong>") + "</td><td>" + ladder[i][0] + "</td></tr>";
		}
		buffer += "</table></div>";
		return this.sendReply(buffer);
	},
	scavaddpoints: 'scavengersaddpoints',
	scavengersaddpoints: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply("This command can only be used in the Scavengers room.");
		if (!this.can('mute', null, room)) return false;
		let split = target.split(",");
		if (split.length !== 2) return this.errorReply("You must specify a username and the number of points.");
		let numPoints = parseInt(split[1]);
		if (!numPoints || numPoints < 1) return this.errorReply("Invalid number of points.");
		addPoints(split[0], numPoints);
		scavWriteData();
		return this.sendReply(`${numPoints} points awarded to ${scavengersLB[toId(split[0])].name}.`);
	},
	scavengersremovepoints: 'scavrmpoints',
	scavengersrmpoints: 'scavrmpoints',
	scavremovepoints: 'scavrmpoints',
	scavrmpoints: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply("This command can only be used in the Scavengers room.");
		if (!this.can('mute', null, room)) return;
		let split = target.split(",");
		if (split.length !== 2) return this.errorReply("You must specify a username and the number of points.");
		let numPoints = parseInt(split[1]);
		if (!numPoints || numPoints < 1) return this.errorReply("Invalid number of points.");
		let id = toId(split[0]);
		if (!(id in scavengersLB)) return this.errorReply("That user does not have any points.");
		if (scavengersLB[id].points < numPoints) return this.errorReply("That user does not have enough points to remove.");
		scavengersLB[id].points -= numPoints;
		scavWriteData();
		return this.sendReply(`${numPoints} points removed from ${scavengersLB[toId(split[0])].name}.`);
	},

	scavresetlb: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply("This command can only be used in the Scavengers room.");
		if (!this.can('declare', null, room)) return false;
		scavengersLB = {};
		scavWriteData();
		return this.sendReply("The leaderboard has been reset.");
	},

	scavengersrank: 'scavrank',
	scavrank: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply("This command can only be used in the Scavengers room.");
		let name = target;
		if (!name) name = user.name;
		let id = toId(name);
		if (!(id in scavengersLB)) return this.sendReplyBox(`User '${name}' does not have any points on the scavengers leaderboard.`);
		let ladder = getLadder();
		let i;
		for (i = 0; i < ladder.length; i++) {
			if (id === toId(ladder[i][1])) break;
		}
		if (i === ladder.length) { // shouldn't ever happen
			return;
		}
		return this.sendReplyBox(`User '${ladder[i][1]}' is #${i + 1} on the official leaderboard with ${ladder[i][0]} points.`);
	},

	scavengershelp: 'scavengerhelp',
	scavengerhelp: function (target, room, user) {
		if (room && room.id !== 'scavengers') return this.errorReply("This command can only be used in the Scavengers room.");
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			'<strong>Player commands:</strong><br />' +
			'- /scavengers - Join the scavengers room<br />' +
			'- /joinhunt - Join the current scavenger hunt<br />' +
			'- /scavenge _______ - Attempt to answer the hint<br />' +
			'- /scavengerstatus - Get your current game status<br />' +
			'- /scavtop - See the official leaderboard <br />' +
			'- /scavrank [user] - View the rank of the specified user on the official leaderboard. If no name is given, view your own.<br />' +
			'<br />' +
			'<strong>Staff commands:</strong><br />' +
			'- /starthunt <em>hint | answer | hint | answer | hint | answer</em> - Start a new scavenger hunt (Requires: % @ * # & ~)<br />' +
			'- /startofficialhunt <em>hint | answer | hint | answer | hint | answer</em> - Start an official hunt with 60 seconds blitz period (Requires: % @ * # & ~)<br />' +
			'- /endhunt - Finish the current hunt and announce the winners (Requires: % @ * # & ~)<br />' +
			'- /resethunt - Reset the scavenger hunt to mint status (Requires: % @ * # & ~)<br />' +
			'- /scavrmpoints [user],[num] - Remove [num] points from [user] on the official leaderboard (Requires: % @ * # & ~)<br />' +
			'- /scavaddpoints [user],[num] - Add [num] points to [user] on the official leaderboard (Requires: % @ * # & ~)<br />' +
			'- /scavresetlb - Reset the official leaderboard (Require: # & ~)'
		);
	},
};
