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
	},

	/**
	* The Studio: Artist of the Day Plugin
	* This is a daily activity where users get to nominate an artist to be Artist of the day, and it's randomly selected
	* Only works in a room with the id "The Studio"
	*/
	studio: {
		commands: {
			startaotd: function () {
				return this.parse('/toggleaotd on');
			},

			endaotd: function () {
				return this.parse('/toggleaotd off');
			},

			taotd: 'toggleaotd',
			toggleaotd: function (target, room, user) {
				if (room.id !== 'thestudio') return this.sendReply("This command can only be used in The Studio.");
				if (!this.canTalk()) return;
				if (!this.can('mute', null, room)) return;
				if (!target) {
					return this.sendReply("/toggleaotd [on / off] - If on, this will start AOTD, if off, this will no longer allow people to use /naotd.");
				}
				if (target === 'on') {
					if (room.aotdOn == true) return this.sendReply("The Artist of the Day has already started.");
					room.addRaw(
						'<div class="broadcast-blue"><center>' +
							'<h3>Artist of the Day has started!</h3>' +
							"<p>(Started by " + Tools.escapeHTML(user.name) + ")</p>" +
							"<p>Use <strong>/naotd</strong> [artist] to nominate an artist!</p>" +
						'</center></div>'
					);
					room.aotdOn = true;
					this.logModCommand("Artist of the Day was started by " + Tools.escapeHTML(user.name) + ".");
				}
				if (target === 'off') {
					if (!room.aotdOn) return this.sendReply("The Artist of the Day has already ended.");
					room.addRaw("<b>Nominations are over!</b> (Turned off by " + Tools.escapeHTML(user.name) + ")");
					room.aotdOn = false;
				}
			},

			aotdfaq: 'aotdhelp',
			aotdhelp: function (target, room) {
				if (!this.canBroadcast()) return;
				if (room.id !== 'thestudio') return this.sendReply("This command can only be used in The Studio.");
				this.sendReplyBox(
					"<h3>Artist of the Day:</h3>" +
					"<p>This is a room activity for The Studio where users nominate artists for the title of 'Artist of the Day'.</p>" +
					'<p>' +
						"Command List:" +
						'<ul>' +
							"<li>/naotd (artist) - This will nominate your artist of the day; only do this once, please.</li>" +
							"<li>/aotd - This allows you to see who the current Artist of the Day is.</li>" +
							"<li>/aotd (artist) - Sets an artist of the day. (requires %, @, #)</li>" +
							"<li>/startaotd - Will start AOTD (requires %, @, #)</li>" +
							"<li>/endaotd - Will turn off the use of /naotd, ending AOTD (requires %, @, #)</li>" +
						'</ul>' +
					'</p>' +
					"<p>More information on <a href=\"http://thepsstudioroom.weebly.com/artist-of-the-day.html\">Artist of the Day</a> and <a href=\"http://thepsstudioroom.weebly.com/commands.html\">these commands</a>.</p>"
				);
			},

			nominateartistoftheday: 'naotd',
			naotd: function (target, room, user) {
				if (room.id !== 'thestudio') return this.sendReply("This command can only be used in The Studio.");
				if (!room.aotdOn) return this.sendReply("The Artist of the Day has already been chosen.");
				if (!target) return this.sendReply("/naotd [artist] - Nominates an artist for Artist of the Day.");
				if (target.length > 25) return this.sendReply("This Artist's name is too long; it cannot exceed 25 characters.");
				if (!this.canTalk()) return;
				room.addRaw(Tools.escapeHTML(user.name) + "'s nomination for Artist of the Day is: <strong><em>" + Tools.escapeHTML(target) + "</em></strong>");
			},

			artistoftheday: 'aotd',
			aotd: function (target, room, user) {
				if (room.id !== 'thestudio') return this.sendReply("This command can only be used in The Studio.");
				if (!target) {
					if (!this.canBroadcast()) return;
					this.sendReplyBox("The current Artist of the Day is: <b>" + Tools.escapeHTML(room.aotd) + "</b>");
					return;
				}
				if (!this.canTalk()) return;
				if (target.length > 25) return this.sendReply("This Artist\'s name is too long; it cannot exceed 25 characters.");
				if (!this.can('mute', null, room)) return;
				room.aotd = target;
				room.addRaw(
					'<div class="broadcast-green">' +
						"<h3>The Artist of the Day is now <font color=\"black\">" + Tools.escapeHTML(target) + "</font></h3>" +
						"<p>(Set by " + Tools.escapeHTML(user.name) + ".)</p>" +
						"<p>This Artist will be posted on our <a href=\"http://thepsstudioroom.weebly.com/artist-of-the-day.html\">Artist of the Day page</a>.</p>" +
					'</div>'
				);
				room.aotdOn = false;
				this.logModCommand("The Artist of the Day was changed to " + Tools.escapeHTML(target) + " by " + Tools.escapeHTML(user.name) + ".");
			}
		}
	},

	/**
	* The Happy Place: Quote of the Day Plugin
	* This is a command that allows a room owner to set an inspirational "quote" of the day.
	* Others may braodcast this at any time to remind the room of such.
	* Only works in a room with the id "The Happy Place"
	* Credits: panpawn, TalkTakesTime, Morfent, and sirDonovan
	*/
	happy: {
		quote: "",
		commands: {
			quoteoftheday: 'qotd',
			qotd: function (target, room, user) {
				if (room.id !== 'thehappyplace') return this.sendReply("This command can only be used in The Happy Place.");
				if (!this.canBroadcast()) return;
				if (!target) {
					if (!plugins.happy.quote) return this.sendReplyBox("The Quote of the Day has not been set.");
					return this.sendReplyBox("The current <strong>'Inspirational Quote of the Day'</strong> is:<br />" + plugins.happy.quote);
				}
				if (!this.can('declare', null, room)) return false;
				if (target === 'off' || target === 'disable' || target === 'reset') {
					if (!plugins.happy.quote) return this.sendReply("The Quote of the Day has already been reset.");
					plugins.happy.quote = "";
					this.sendReply("The Quote of the Day was reset by " + Tools.escapeHTML(user.name) + ".");
					this.logModCommand(user.name + " has reset the Quote of the Day.");
					return;
				}
				plugins.happy.quote = Tools.escapeHTML(target);
				room.addRaw(
					'<div class="broadcast-green">' +
						"<p><strong>The 'Inspirational Quote of the Day' has been updated by " + Tools.escapeHTML(user.name) + ".</strong></p>" +
						"<p>Quote: " + plugins.happy.quote + '</p>' +
					'</div>'
				);
				this.logModCommand(Tools.escapeHTML(user.name) + " has updated the quote of the day to: " + plugins.happy.quote);
			}
		}
	}
};
