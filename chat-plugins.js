/**
 * Chat plug-ins
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are chat plugins - small programs to enhance the chat rooms on Pokemon Showdown.
 * Plugins are objects inside the plugins object. The objects are expected to have data values and a commands object inside.
 * The data object saves the data relevant to the plugin, like scores.
 * The commands object is used to import the commands onto the chat commands.
 * It's very important not to add plug-in commands with the same name as existing commands.
 *
 * @license MIT license
 */

var plugins = exports.plugins = {
	/**
	 * Scavenger hunts plugin. Only works in a room with the id 'scavengers'.
	 * This game shows a hint. Once a player submits the correct answer, they move on to the next hint.
	 * You finish upon correctly answering the third hint.
	 * In an official hunt, the first three to finish within 60 seconds achieve blitz.
	 */
	scavengers: {
		status: 'off',
		blitz: null,
		hintOne: '',
		answerOne: '',
		hintTwo: '',
		answerTwo: '',
		hintThree: '',
		answerThree: '',
		participants: {},
		finished: [],
		result: null,
		commands: {
			scavenger: 'scavengers',
			scavengers: function (target, room, user) {
				return this.parse('/join scavengers');
			},
			startofficialhunt: 'starthunt',
			starthunt: function (target, room, user, connection, cmd) {
				if (room.id !== 'scavengers') return;
				if (!this.can('mute', null, room)) return false;
				if (plugins.scavengers.status === 'on') return this.sendReply('There is already an active scavenger hunt.');
				var targets = target.split(',');
				if (!targets[0] || !targets[1] || !targets[2] || !targets[3] || !targets[4] || !targets[5] || targets[6]) {
					return this.sendReply('You must specify three hints and three answers.');
				}
				plugins.scavengers.status = 'on';
				if (cmd === 'startofficialhunt') {
					if (!this.can('ban', null, room)) return false;
					plugins.scavengers.blitz = setTimeout(function () {
						plugins.scavengers.blitz = null;
					}, 60000);
				}
				plugins.scavengers.hintOne = targets[0].trim();
				plugins.scavengers.answerOne = toId(targets[1]);
				plugins.scavengers.hintTwo = targets[2].trim();
				plugins.scavengers.answerTwo = toId(targets[3]);
				plugins.scavengers.hintThree = targets[4].trim();
				plugins.scavengers.answerThree = toId(targets[5]);
				var result = (cmd === 'startofficialhunt' ? 'An official' : 'A new') + ' Scavenger Hunt has been started by <em> ' + Tools.escapeHTML(user.name) + '</em>! The first hint is: ' + Tools.escapeHTML(plugins.scavengers.hintOne);
				Rooms.rooms.scavengers.addRaw('<div class="broadcast-blue"><strong>' + result + '</strong></div>');
			},
			joinhunt: function (target, room, user) {
				if (room.id !== 'scavengers') return;
				if (plugins.scavengers.status !== 'on') return this.sendReply('There is no active scavenger hunt.');
				if (user.userid in plugins.scavengers.participants) return this.sendReply('You are already participating in the current scavenger hunt.');
				plugins.scavengers.participants[user.userid] = {room: 0};
				this.sendReply('You joined the scavenger hunt! Use the command /scavenge to answer. The first hint is: ' + plugins.scavengers.hintOne);
			},
			scavenge: function (target, room, user) {
				if (room.id !== 'scavengers') return;
				if (plugins.scavengers.status !== 'on') return this.sendReply('There is no active scavenger hunt.');
				if (!plugins.scavengers.participants[user.userid]) return this.sendReply('You are not participating in the current scavenger hunt. Use the command /joinhunt to participate.');
				if (plugins.scavengers.participants[user.userid].room >= 3) return this.sendReply('You have already finished!');
				target = toId(target);
				var room = plugins.scavengers.participants[user.userid].room;
				if (plugins.scavengers[{0:'answerOne', 1:'answerTwo', 2:'answerThree'}[room]] === target) {
					plugins.scavengers.participants[user.userid].room++;
					room++;
					if (room < 3) {
						var hints = {1:'hintTwo', 2:'hintThree'};
						this.sendReply('Well done! Your ' + (room === 1 ? 'second' : 'final') + ' hint is: ' + plugins.scavengers[hints[room]]);
					} else {
						plugins.scavengers.finished.push(user.name);
						var position = plugins.scavengers.finished.length;
						var result = '<em>' + Tools.escapeHTML(user.name) + '</em> has finished the hunt ';
						result += (position === 1) ? 'and is the winner!' : (position === 2) ? 'in 2nd place!' : (position === 3) ? 'in 3rd place!' : 'in ' + position + 'th place!';
						result += (position < 4 && plugins.scavengers.blitz ? ' [BLITZ]' : '');
						Rooms.rooms.scavengers.addRaw('<div class="broadcast-blue"><strong>' + result + '</strong></div>');
					}
				} else {
					this.sendReply('That is not the answer - try again!');
				}
			},
			scavengerhint: 'scavengerstatus',
			scavengerstatus: function (target, room, user) {
				if (room.id !== 'scavengers') return;
				if (plugins.scavengers.status !== 'on') return this.sendReply('There is no active scavenger hunt.');
				if (!plugins.scavengers.participants[user.userid]) return this.sendReply('You are not participating in the current scavenger hunt. Use the command /joinhunt to participate.');
				if (plugins.scavengers.participants[user.userid].room >= 3) return this.sendReply('You have finished the current scavenger hunt.');
				var hints = {0:'hintOne', 1:'hintTwo', 2:'hintThree'};
				var room = plugins.scavengers.participants[user.userid].room;
				this.sendReply('You are on hint number ' + (room + 1) + ': ' + plugins.scavengers[hints[room]]);
			},
			endhunt: function (target, room, user) {
				if (room.id !== 'scavengers') return;
				if (!this.can('mute', null, room)) return false;
				if (plugins.scavengers.status !== 'on') return this.sendReply('There is no active scavenger hunt.');
				var winner = plugins.scavengers.finished[0];
				var second = plugins.scavengers.finished[1];
				var third = plugins.scavengers.finished[2];
				var consolation = plugins.scavengers.finished.slice(3).join(', ');
				var result = 'The Scavenger Hunt was ended by <em>' + Tools.escapeHTML(user.name) + '</em>. ';
				if (winner) {
					result += '<br />Winner: <em>' + Tools.escapeHTML(winner) + '</em>.';
					if (second) result += ' Second place: <em>' + Tools.escapeHTML(second) + '</em>.';
					if (third) result += ' Third place: <em>' + Tools.escapeHTML(third) + '</em>.';
					if (consolation) result += ' Consolation prize to: ' + Tools.escapeHTML(consolation) + '.';
				} else {
					result += 'No user has completed the hunt.';
				}
				result += '<br />Solution: ' + Tools.escapeHTML(plugins.scavengers.answerOne) + ', ' + Tools.escapeHTML(plugins.scavengers.answerTwo) + ', ' + Tools.escapeHTML(plugins.scavengers.answerThree) + '.';
				plugins.scavengers.result = result;
				this.parse('/resethunt');
			},
			resethunt: function (target, room, user) {
				if (room.id !== 'scavengers') return;
				if (!this.can('mute', null, room)) return false;
				if (plugins.scavengers.status !== 'on') return this.sendReply('There is no active scavenger hunt.');
				plugins.scavengers.status = 'off';
				if (plugins.scavengers.blitz) clearTimeout(plugins.scavengers.blitz);
				plugins.scavengers.blitz = null;
				plugins.scavengers.hintOne = '';
				plugins.scavengers.answerOne = '';
				plugins.scavengers.hintTwo = '';
				plugins.scavengers.answerTwo = '';
				plugins.scavengers.hintThree = '';
				plugins.scavengers.answerThree = '';
				plugins.scavengers.participants = {};
				plugins.scavengers.finished = [];
				if (plugins.scavengers.result) {
					Rooms.rooms.scavengers.addRaw('<div class="broadcast-blue"><strong>' + plugins.scavengers.result + '</strong></div>');
				} else {
					Rooms.rooms.scavengers.addRaw('<div class="broadcast-blue"><strong>The Scavenger Hunt was reset by <em>' + Tools.escapeHTML(user.name) + '</em>.</strong></div>');
				}
				plugins.scavengers.result = null;
			},
			scavengershelp: 'scavengerhelp',
			scavengerhelp: function (target, room, user) {
				if (room.id !== 'scavengers') return;
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
		}
	}
};
