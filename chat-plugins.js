/**
 * Chat plug-ins
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are chat plugins - small programs to enhace the chat rooms on Pokemon Showdown.
 * Plugins are objects inside the plugins object. The objects are expected to have data values and a commands object inside.
 * The data object saves the data relevant to the plugin, like scores.
 * The commands object is used to import the commands onto the chat commands.
 * It's very important that you don't add plug-in commands with the same name as existing commands.
 *
 * @license MIT license
 */

var plugins = exports.plugins = {
	/**
	 * Scavenger hunts plugin.
	 * This game is meant to show a first hint. Players will find the name of a room with that hint.
	 * When you find a room, it gives you a hint for the next room.
	 * You finish upon reaching the third room.
	 * This plugin requires the server to have a room with the id 'scavengers'.
	 */
	scavenger: {
		status: 'off',
		firstHint: '',
		roomOne: '',
		secondHint: '',
		roomTwo: '',
		thirdHint: '',
		roomThree: '',
		participants: {},
		finished: [],
		commands: {
			scavengerstarthunt: function (target, room, user) {
				if (!this.can('scavengers', room)) return false;
				if (room.id !== 'scavengers') return this.sendReply('You can only start scavenger hunts on Scavengers room.');
				if (plugins.scavenger.status === 'on') return this.sendReply('There is already an active scavenger hunt.');
				var targets = target.split(',');
				if (!targets[0] || !targets[1] || !targets[2] || !targets[3] || !targets[4] || !targets[5])
					return this.sendReply('You need to add three rooms and three hints in a [room, hint,] format.');
				plugins.scavenger.status = 'on';
				plugins.scavenger.roomOne = toId(targets[0]);
				plugins.scavenger.firstHint = targets[1].trim();
				plugins.scavenger.roomTwo = toId(targets[2]);
				plugins.scavenger.secondHint = targets[3].trim();
				plugins.scavenger.roomThree = toId(targets[4]);
				plugins.scavenger.thirdHint = targets[5].trim();
				if (Rooms.rooms.scavengers) Rooms.rooms.scavengers.add(
					'|raw|<div class="broadcast-blue"><strong>A new Scavenger Hunt has been started!'
					+ ' The first hint is: ' + plugins.scavenger.firstHint + '</strong></div>'
				);
				return this.sendReply('Scavenger hunt started.');
			},
			scavengerendhunt: function (target, room, user) {
				if (!this.can('scavengers', room)) return false;
				if (room.id !== 'scavengers') return this.sendReply('You can only end scavenger hunts on Scavengers room.');
				if (plugins.scavenger.status !== 'on') return this.sendReply('There is no active scavenger hunt.');
				var result = '';
				var winner = plugins.scavenger.finished[0];
				var second = plugins.scavenger.finished[1];
				var third = plugins.scavenger.finished[2];
				var consolation = plugins.scavenger.finished.slice(3);
				result += '<strong>Winner of Scavenger Hunt: ' + ((winner)? sanitize(winner) : 'no one') + '.';
				result += '</strong> Second place: ' + ((second)? sanitize(second) : 'no one') + '.';
				result += ' Third place: ' + ((third)? sanitize(third) : 'no one') + '.';
				result += ' Consolation prize to: ' + ((consolation.length > 0)? sanitize(consolation.join(', ')) : 'no one') + '.';
				result += '<br />Solution: ' + plugins.scavenger.roomOne + ', '
				+ plugins.scavenger.roomTwo + ', ' + plugins.scavenger.roomThree + '.';
				if (Rooms.rooms.scavengers) Rooms.rooms.scavengers.add('|raw|<div class="broadcast-blue"><strong>' + result + '</strong></div>');
				this.parse('/scavengerresethunt');
				return this.sendReply('Scavenger hunt finished.');
			},
			scavengerresethunt: function (target, room, user) {
				if (!this.can('scavengers', room)) return false;
				if (room.id !== 'scavengers') return this.sendReply('You can only reset scavenger hunts on Scavengers room.');
				plugins.scavenger.status = 'off';
				plugins.scavenger.roomOne = '';
				plugins.scavenger.roomTwo = '';
				plugins.scavenger.roomThree = '';
				plugins.scavenger.firstHint = '';
				plugins.scavenger.secondHint = '';
				plugins.scavenger.thirdHint = '';
				plugins.scavenger.participants = {};
				plugins.scavenger.finished = [];
				return this.sendReply('Scavenger hunt reset.');
			},
			scavenger: 'scavengers',
			scavengers: function (target, room, user) {
				return this.parse('/join scavengers');
			},
			scavengerhint: function (target, room, user) {
				if (plugins.scavenger.status !== 'on') return this.sendReply('There is no active scavenger hunt right now.');
				if (!plugins.scavenger.participants[user.userid]) return this.sendReply('You are not participating in the current scavenger hunt.');
				if (plugins.scavenger.participants[user.userid].room >= 3) return this.sendReply('You have already finished!');
				return this.sendReply(
					'Your current hint: '
					+ plugins.scavenger[{0:'firstHint', 1:'secondHint', 2:'thirdHint'}[plugins.scavenger.participants[user.userid].room]]
					+ '. Type /scavenge [solution] to find out if you are right.'
				);
			},
			scavenge: function (target, room, user) {
				if (plugins.scavenger.status !== 'on') return this.sendReply('There is no active scavenger hunt right now.');
				if (!plugins.scavenger.participants[user.userid]) return this.sendReply('You are not participating in the current scavenger hunt.');
				if (plugins.scavenger.participants[user.userid].room >= 3) return this.sendReply('You have already finished!');
				target = toId(target);
				var room = plugins.scavenger.participants[user.userid].room;
				if (plugins.scavenger[{0:'roomOne', 1:'roomTwo', 2:'roomThree'}[room]] === target) {
					plugins.scavenger.participants[user.userid].room++;
					room++;
					if (room < 3) {
						var currentHint = {1:'secondHint', 2:'thirdHint'};
						return this.sendReply(
							'Well done! You have advanced to the next room! The next hint is: '
							+ plugins.scavenger[currentHint[room]]
						);
					} else {
						// User finished, let's check the result
						plugins.scavenger.finished.push(user.name);
						var winningPositions = {1:'winner', 2:'second', 3:'third'};
						var position = plugins.scavenger.finished.length;
						var result = 'The user ' + sanitize(user.name) + ' has finished the hunt! (S)he is the '
						+ ((winningPositions[position])? winningPositions[position] : position + 'th') + '!';
						if (Rooms.rooms.scavengers) Rooms.rooms.scavengers.add(
							'|raw|<div class="broadcast-blue"><strong>' + result + '</strong></div>'
						);
					}
				} else {
					return this.sendReply('Fat luck - that is not the next room!');
				}
			},
			joinhunt: function (target, room, user) {
				if (plugins.scavenger.status !== 'on') return this.sendReply('There is no active scavenger hunt right now.');
				if (plugins.scavenger.participants[user.userid]) return this.sendReply('You are already participating in the current scavenger hunt.');
				plugins.scavenger.participants[user.userid] = {id: user.userid, room: 0};
				return this.sendReply('You joined the scavenger hunt! Type /scavenge name to try to find the room and /scavengerhint to read your current hint.');
			},
			scavengerstatus: function (target, room, user) {
				if (plugins.scavenger.status !== 'on') return this.sendReply('There is no active scavenger hunt right now.');
				if (!plugins.scavenger.participants[user.userid]) return this.sendReply('You are not participating in the current scavenger hunt.');
				var currentHint = {0:'firstHint', 1:'secondHint', 2:'thirdHint'};
				var room = plugins.scavenger.participants[user.userid].room;
				return this.sendReply(
					'Your current hunt status: You are in the room #' + room + ((room < 3)? '. Your current hint is '
					+ plugins.scavenger[currentHint[room]] : '. You have finished') + '.'
				);
			},
			scavengerhelp: function (target, room, user) {
				if (room.id !== 'scavengers') return;
				if (!this.canBroadcast()) return;
				this.sendReplyBox(
					'<strong>Player commands:</strong><br />' +
					'- /scavengers: Join the scavengers room<br />' +
					'- /joinhunt: Join the current hunt<br />' +
					'- /scavengerhint: Get your current hint<br />' +
					'- /scavengerstatus: Get your current game status<br />' +
					'- /scavenge <em>name</em>: Test the [name] to find a room<br />' +
					'<br />' +
					'<strong>Admin commands:</strong><br />' +
					'- /scavengerstarthunt <em>room one, hint, room two, hint, room three, hint</em>: Start a new hunt<br />' +
					'- /scavengerendhunt: Finish current hunt and announce winners<br />' +
					'- /scavengerresethunt: Reset the current hunt to mint status'
				);
			}
		}
	},

	/**
	* Mafia Plugin
	* Only works in a room named "Mafia"
	*/
	mafia: {
		status: 'off',
		stage: 'day',
		totals: {},
		roles: ["Villager", "Doctor", "Mafia Goon", "Villager", "Mafia Goon", "Cop", "Villager", "Werewolf", "Pretty Lady", "Villager", "Mafia Goon", "Mayor", "Villager", "Mafia Pretty Lady", "1-Shot Vigilante", "1-Shot Bulletproof Townie", "Mafia Seer", "Villager", "Werewolf", "Bomb", "Miller", "Mafia Goon", "Jailkeeper", "Traitor", "Villager", "1-Shot Vigilante", "Mafia Godfather", "Villager", "Bodyguard", "1-Shot Lynchproof Townie"],
		participants: {},
		nightactors: ["Doctor", "Cop", "Werewolf", "Pretty Lady", "Mafia Pretty Lady", "1-Shot Vigilante", "Mafia Seer", "Jailkeeper", "Bodyguard"],
		nightactions: {Mafia: {}},
		inspectionresults: {},
		votes: {},
		commands: {
			startmafia: function(target, room, user) {
				if (!this.can('mafia', room)) return false;
				if (room.id !== 'mafia') return this.sendReply('You can only start mafia games in the Mafia room.');
				if (plugins.mafia.status !== 'off') return this.sendReply('There is already an active mafia game.');
				plugins.mafia.status = 'signups';
				if (Rooms.rooms.mafia) Rooms.rooms.mafia.add(
					'|raw|<div class="broadcast-blue"><strong>A new mafia game has been started!'
					+ ' Type /joinmafia to sign up</strong></div>'
				);
			},

			endsignups: function(target, room, user) {
				if (!this.can('mafia', room)) return false;
				if (plugins.mafia.status !== 'signups') return this.sendReply('Signups are not currently active');
				if (Object.keys(plugins.mafia.participants).length < 3) return this.sendReply('There are not enough participants so signups cannot end. (minimum 3 players)')
				plugins.mafia.status = 'on';

				/**
				* to assign roles randomly we create an array of unique, incrementing and
				* shuffled integers of length equal to the number of participants, and assign roles
				* based on what the value of the array is for that participants index compared to that of
				* the "roles" array.
				*/
				var keys = Object.keys(plugins.mafia.participants);
				var len = keys.length;
				var rlen = plugins.mafia.roles.length;
				var randomizer = [];

				for (var i = 0; i < len; i++) {
					randomizer[i] = i;
				}

				// Fisher-Yates shuffle
				for (var i = len - 1; i > 0; i--) {
        			var j = Math.floor(Math.random() * (i + 1));
        			var temp = randomizer[i];
        			randomizer[i] = randomizer[j];
        			randomizer[j] = temp;
    			}

    			for (var i = 0; i < len; i++) {
    				var role = plugins.mafia.roles[randomizer[i%rlen]];
    				var player = keys[i];
    				plugins.mafia.participants[player] = role;

    				if (role in plugins.mafia.totals) {
    					plugins.mafia.totals[role]++;
    				} else {
    					plugins.mafia.totals[role] = 1;
    				}
    			}

				if (Rooms.rooms.mafia) Rooms.rooms.mafia.add(
					'|raw|<div class="broadcast-blue"><strong>Signups for the mafia game have now ended!'
					+ ' It is ' + plugins.mafia.stage + ' and there are: ' + JSON.stringify(plugins.mafia.totals) + '. type "/myrole" to see your role</strong></div>'
				);
			},

			myrole: function(target, room, user) {
				if (plugins.mafia.status !== 'on') return this.sendReply('A mafia game hasn\'t started yet');
				if (!plugins.mafia.participants[user.userid]) return this.sendReply('You are not participating in the current mafia game.');

				var role = plugins.mafia.participants[user.userid];
				var mafia = [];

				for (var key in plugins.mafia.participants) {
					if (plugins.mafia.participants[key].indexOf('Mafia') !== -1) {
						mafia.push(key);
					}
				}

				if (role.indexOf('Mafia') !== -1) {
					return this.sendReply('(You are a Mafia with: ' + mafia + ')');
				}

				return this.sendReply('(You are a: ' + plugins.mafia.participants[user.userid] + ')');
			},

			joinmafia: function(target, room, user) {
				if (plugins.mafia.status !== 'signups') return this.sendReply('Signups are not happening right now');
				if (room.id !== 'mafia') return this.sendReply('You can only join mafia games in the Mafia room.');
				if (plugins.mafia.participants[user.userid]) return this.sendReply('You are already participating in the current mafia game.');
				plugins.mafia.participants[user.userid] = '';
				if (Rooms.rooms.mafia) Rooms.rooms.mafia.add(user + ' has joined! Total players: ' + Object.keys(plugins.mafia.participants).length);
				return this.sendReply('(You joined the mafia game!)');
			},

			lynch: function(target, room, user) {
				if (plugins.mafia.status !== 'on') return this.sendReply('A mafia game hasn\'t started yet');
				if (!plugins.mafia.participants[user.userid]) return this.sendReply('You are not participating in the current mafia game.');
				if (plugins.mafia.stage !== 'day') return this.sendReply('You can only lynch during the day');

				target = this.splitTarget(target);
				var targetUser = this.targetUser;

				if (!targetUser) {
					targetUser = 'no lynch';
				} else if (!plugins.mafia.participants[targetUser]) return this.sendReply(target + ' is not participating in this mafia game or has died');

				plugins.mafia.votes[user.userid] = targetUser;

				if (targetUser === 'no lynch') {
					if (Rooms.rooms.mafia) Rooms.rooms.mafia.add(user + ' has voted to lynch: no lynch');
				} else {
					if (Rooms.rooms.mafia) Rooms.rooms.mafia.add(user + ' has voted to lynch: ' + this.targetUsername);
				}

				var keys = Object.keys(plugins.mafia.votes);
				var totals = {};

				for (var key in plugins.mafia.votes) {
					if (plugins.mafia.votes[key] in totals) {
						totals[plugins.mafia.votes[key]]++;
					} else {
						totals[plugins.mafia.votes[key]] = 1;
					}
					// mayors vote counts as 2
					if (plugins.mafia.participants[key.userid] === 'Mayor') {
						totals[plugins.mafia.votes[key]]++;
					}
				}

				if (totals[targetUser] >= (Math.floor(Object.keys(plugins.mafia.participants).length / 2) +1)) {
					plugins.mafia.stage = 'night';
					if (targetUser === 'no lynch') {
						if (Rooms.rooms.mafia) Rooms.rooms.mafia.add('|raw|<div class="broadcast-blue"><strong>No one was lynched!</strong></div>');
					} else if (target === '1-Shot Lynchproof Townie') {
						if (Rooms.rooms.mafia) Rooms.rooms.mafia.add('|raw|<div class="broadcast-blue"><strong>No one was lynched!</strong></div>');
						plugins.mafia.participants[target] = 'Villager';
					} else {
						if (Rooms.rooms.mafia) Rooms.rooms.mafia.add('|raw|<div class="broadcast-blue"><strong>' + this.targetUsername + ' was lynched and was a ' + plugins.mafia.participants[targetUser] + '!');
						delete plugins.mafia.participants[targetUser];

						var winner = [];

						for (var key in plugins.mafia.participants) {
							role = plugins.mafia.participants[key];

							if (role === 'Werewolf') {
								if (winner.indexOf('Werewolf') === -1) winner.push('Werewolf');
							} else if (role.indexOf('Mafia') !== -1 || role === 'Traitor') {
								if (winner.indexOf('Mafia') === -1) winner.push('Mafia');
							} else {
								if (winner.indexOf('Town') === -1) winner.push('Town');
							}

							if (winner.length > 1) break; // if more than 1 faction remains there is no winner
						}

						if (winner.length === 1) {
							if (Rooms.rooms.mafia) Rooms.rooms.mafia.add('|raw|<div class="broadcast-blue"><strong>' + winner[0] + ' Have won!</strong></div>');
							// reset everything to starting values

							plugins.mafia.status = 'off';
							plugins.mafia.stage = 'day';
							plugins.mafia.totals = {};
							plugins.mafia.participants = {};
							plugins.mafia.inspectionresults = {};
							plugins.mafia.votes = {};
							return;
						}
					}
					if (Rooms.rooms.mafia) Rooms.rooms.mafia.add('|raw|<div class="broadcast-blue"><strong>It is now ' + plugins.mafia.stage + '. If you have a nightaction you can use it using "/nightaction target"</strong></div>');
					room.modchat = '+';
					plugins.mafia.votes = {};

					for (var key in plugins.mafia.participants) {
						var role = plugins.mafia.participants[key];

						if (plugins.mafia.nightactors.indexOf(role) !== -1) {

							if (!(role in plugins.mafia.nightactions)) {
								plugins.mafia.nightactions[role] = {};
							}

    						plugins.mafia.nightactions[role][key] = '';
    					}
					}
					return;
				}

				if (keys.length === Object.keys(plugins.mafia.participants).length) {
					plugins.mafia.stage = 'night';
					if (Rooms.rooms.mafia) Rooms.rooms.mafia.add('|raw|<div class="broadcast-blue"><strong>No one was lynched! </strong></div>');
					plugins.mafia.votes = {};

					for (var key in plugins.mafia.participants) {
						var role = plugins.mafia.participants[key];

						if (plugins.mafia.nightactors.indexOf(role) !== -1) {

							if (!(role in plugins.mafia.nightactions)) {
								plugins.mafia.nightactions[role] = {};
							}

    						plugins.mafia.nightactions[role][key] = '';
    					}
					}
					if (Rooms.rooms.mafia) Rooms.rooms.mafia.add('|raw|<div class="broadcast-blue"><strong>It is now ' + plugins.mafia.stage + '</strong></div>');
					room.modchat = '+';
				}
			},

			nightaction: function(target, room, user) {
				if (plugins.mafia.status !== 'on') return this.sendReply('A mafia game hasn\'t started yet');
				if (plugins.mafia.stage !== 'night') return this.sendReply('It is not currently night');

				target = this.splitTarget(target);
				var targetUser = this.targetUser;

				if (!targetUser) {
					targetUser = 'no one';
				} else if (!plugins.mafia.participants[targetUser]) return this.sendReply(this.targetUsername + ' is not participating in this mafia game or has died');


				var role = plugins.mafia.participants[user.userid];

				if (role === 'Mafia Pretty Lady' || role === 'Mafia Seer') {
					if (target.indexOf('kill') !== -1) {
						plugins.mafia.nightactions[role] = 'no one';
						role = 'Mafia';
					}
				}

				if (plugins.mafia.nightactors.indexOf(role) === -1 && role.indexOf("Mafia") === -1) return this.sendReply('You do not have a night action');

				if (role.indexOf("Mafia") !== -1 && (role !== 'Mafia Pretty Lady' || role !== 'Mafia Seer') && targetUser !== 'no one') {
					if (plugins.mafia.participants[targetUser].indexOf("Mafia") === -1) {
						plugins.mafia.nightactions['Mafia'][user.userid] = targetUser;
					} else {
						return this.sendReply(targetUser + ' is mafia and so cannot be targeted');
					}
				} else {
					plugins.mafia.nightactions[role][user.userid] = targetUser;
				}

				this.sendReply('You have used your nightaction on: ' + this.targetUsername);

				// check if everyone has done their night action yet
				for (var roles in plugins.mafia.nightactions) {
					for (var player in plugins.mafia.nightactions[roles]) {
						if (plugins.mafia.nightactions[roles][player] === '') return;
					}
				}

				if (Object.keys(plugins.mafia.nightactions.Mafia).length === 0) return;

				// some helper functions

				function getTargets(player) {
					var targets = {};

					role = plugins.mafia.participants[player];
					if (role.indexOf('Mafia') !== -1 && role !== 'Mafia Pretty Lady' && role !== 'Mafia Seer') {
						role = 'Mafia';
					}

					targets['targetUser'] = plugins.mafia.nightactions[role][player];
					if (targets['targetUser'] === 'no one') return targets;
					targets['targetRole'] = plugins.mafia.participants[targets['targetUser']];

					if (targets['targetRole'].indexOf('Mafia') !== -1 && targets['targetRole'] !== 'Mafia Pretty Lady' && targets['targetRole'] !== 'Mafia Seer') {
						targets['targetRole'] = 'Mafia';
					}

					return targets;
				}

				function whores(key, targetRole, targetUser) {
					if (targetRole === 'Werewolf') {
						plugins.mafia.nightactions.targetRole[targetUser] = key;
					} else {
						if (plugins.mafia.nightactions.targetRole[targetUser]) {
							plugins.mafia.nightactions.targetRole[targetUser] = 'no one';
						}
					}
				}

				// loop through every role to determine how they interact with a night action
				// that is not killing

				var safe = {};

				for (var key in plugins.mafia.nightactions['Jailkeeper']) {
					var targets = getTargets(key);
					if (targets['targetUser'] === 'no one') continue;

					if (plugins.mafia.nightactions[targets['targetRole']][targets['targetUser']]) {
						plugins.mafia.nightactions[targets['targetRole']][targets['targetUser']] = 'no one';
					}
					safe[key] = targets['targetUser'];
				}

				for (var key in plugins.mafia.nightactions['Pretty Lady']) {
					var targets = getTargets(key);
					if (targets['targetUser'] === 'no one') continue;

					whores(key, targets['targetRole'], targets['targetUser']);
				}

				for (var key in plugins.mafia.nightactions['Mafia Pretty Lady']) {
					var targets = getTargets(key);
					if (targets['targetUser'] === 'no one') continue;

					whores(key, targets['targetRole'], targets['targetUser']);
				}

				for (var key in plugins.mafia.nightactions['Doctor']) {
					var targets = getTargets(key);
					if (targets['targetUser'] === 'no one') continue;

					safe[key] = targets['targetUser'];
				}

				for (var key in plugins.mafia.nightactions['Bodyguard']) {
					var targets = getTargets(key);
					if (targets['targetUser'] === 'no one') continue;

					safe[key] = targets['targetUser'];
				}

				for (var key in plugins.mafia.nightactions['Cop']) {
					var targets = getTargets(key);
					if (targets['targetUser'] === 'no one') continue;

					var result;

					if (targets['targetRole'] === 'Werewolf') {
						result = 'Werewolf';
					} else if (targets['targetRole'].indexOf("Mafia") !== -1 || targets['targetRole'] === 'Traitor' || targets['targetRole'] === 'Miller' && targets['targetRole'] !== 'Mafia Godfather') {
						result = 'Mafia';
					} else {
						result = 'Town';
					}

					plugins.mafia.inspectionresults.key[targets['targetUser']] = result;
				}

				for (var key in plugins.mafia.nightactions['Mafia Seer']) {
					var targets = getTargets(key);
					if (targets['targetUser'] === 'no one') continue;

					if (targetRole === 'Werewolf') {
						plugins.mafia.inspectionresults.key[targets['targetUser']] = 'Werewolf';
					} else {
						plugins.mafia.inspectionresults.key[targets['targetUser']] = 'Human';
					}
				}

				// Now sort out who kills who. Werewolves have priority, then Vigilantes and finally Mafia

				var deaths = {};

				function kill(targetUser, killer) {
					if (deaths.targetUser) return;

					for (var key in safe) {
						if (safe[key] === targetUser) {
							if (plugins.mafia.participants[key] === 'Bodyguard') {
								deaths[key] = 'Bodyguard';
								delete safe[key]; // Bodyguards only save from 1 death
								delete plugins.mafia.participants[key];
							}
							return;
						}
					}
					if (plugins.mafia.participants[targetUser] === '1-Shot Bulletproof Townie') {
						plugins.mafia.participants[targetUser] = 'Villager';
						return;
					}
					if (plugins.mafia.participants[targetUser] === 'Bomb') {
						deaths[killer] = plugins.mafia.participants[killer];
						delete plugins.mafia.participants[killer];
					}
					deaths[targetUser] = plugins.mafia.participants[targetUser];
					delete plugins.mafia.participants[targetUser];
					plugins.mafia.nightactions[targetUser] = 'no one'; // incase wereworlf kills mafia killer
				}

				for (var key in plugins.mafia.nightactions['Werewolf']) {
					var targets = getTargets(key);
					if (targets['targetUser'] === 'no one') continue;

					kill(targets['targetUser'], key);
				}

				for (var key in plugins.mafia.nightactions['1-Shot Vigilante']) {
					var targets = getTargets(key);
					if (targets['targetUser'] === 'no one') continue;

					kill(targets['targetUser'], key);
					plugins.mafia.participants[key] = 'Villager';
				}

				for (var key in plugins.mafia.nightactions['Mafia']) {
					var targets = getTargets(key);
					if (targets['targetUser'] === 'no one') continue;

					kill(targets['targetUser'], key);
					break; // only first mafia can get a kill
				}

				var message = '';

				for (var key in deaths) {
					message += key + ' the ' + deaths[key] + ', ';
				}

				if (message === '') {
					if (Rooms.rooms.mafia) Rooms.rooms.mafia.add('|raw|<div class="broadcast-blue"><strong>No one was killed!</strong></div>');
				} else {
					if (Rooms.rooms.mafia) Rooms.rooms.mafia.add('|raw|<div class="broadcast-blue"><strong>The deaths tonight are: ' + message + '</strong></div>');
				}

				// check if any side has won

				var winner = [];

				for (var key in plugins.mafia.participants) {
					role = plugins.mafia.participants[key];

					if (role === 'Werewolf') {
						if (winner.indexOf('Werewolf') === -1) winner.push('Werewolf');
					} else if (role.indexOf('Mafia') !== -1 || role === 'Traitor') {
						if (winner.indexOf('Mafia') === -1) winner.push('Mafia');
					} else {
						if (winner.indexOf('Town') === -1) winner.push('Town');
					}

					if (winner.length > 1) break; // if more than 1 faction remains there is no winner
				}

				if (winner.length === 1) {
					if (Rooms.rooms.mafia) Rooms.rooms.mafia.add('|raw|<div class="broadcast-blue"><strong>' + winner[0] + ' Have won!</strong></div>');
					// reset everything to starting values

					plugins.mafia.status = 'off';
					plugins.mafia.totals = {};
					plugins.mafia.participants = {};
					plugins.mafia.inspectionresults = {};
					plugins.mafia.votes = {};

				} else {
					if (Rooms.rooms.mafia) Rooms.rooms.mafia.add('|raw|<div class="broadcast-blue"><strong>It is now day! The remaining players are: ' + Object.keys(plugins.mafia.participants) + '</strong></div>');
				}

				plugins.mafia.nightactions = {Mafia: {}};
				plugins.mafia.stage = 'day';
				room.modchat = '';
			},

			modkill: function(target, room, user) {
				if (!this.can('mafia', room)) return false;
				if (room.id !== 'mafia') return this.sendReply('You can only modkill in the Mafia room.');
				if (plugins.mafia.status !== 'on') return this.sendReply('There is no active mafia game.');
				target = this.splitTarget(target);
				var targetUser = this.targetUser;
				if (!plugins.mafia.participants[targetUser]) return this.sendReply(this.targetUsername + ' is not participating in this mafia game or has died');
				var role = plugins.mafia.participants[targetUser];

				if (role.indexOf('Mafia') !== -1 && role !== 'Mafia Pretty Lady' && role !== 'Mafia Seer') {
					role = 'Mafia';
				}

				delete plugins.mafia.participants[targetUser];

				if (plugins.mafia.nightactions.role) {
					delete plugins.mafia.nightactions.role[targetUser];
				}

				if (Rooms.rooms.mafia) Rooms.rooms.mafia.add('|raw|<div class="broadcast-blue"><strong>' + this.targetUsername + ' the ' + role + ' was killed by a mod!</strong></div>');

				var winner = [];

				for (var key in plugins.mafia.participants) {
					role = plugins.mafia.participants[key];

					if (role === 'Werewolf') {
						if (winner.indexOf('Werewolf') === -1) winner.push('Werewolf');
					} else if (role.indexOf('Mafia') !== -1 || role === 'Traitor') {
						if (winner.indexOf('Mafia') === -1) winner.push('Mafia');
					} else {
						if (winner.indexOf('Town') === -1) winner.push('Town');
					}

					if (winner.length > 1) break; // if more than 1 faction remains there is no winner
				}

				if (winner.length === 1) {
					if (Rooms.rooms.mafia) Rooms.rooms.mafia.add('|raw|<div class="broadcast-blue"><strong>' + winner[0] + ' Have won!</strong></div>');
					// reset everything to starting values

					plugins.mafia.status = 'off';
					plugins.mafia.stage = 'day';
					plugins.mafia.totals = {};
					plugins.mafia.participants = {};
					plugins.mafia.inspectionresults = {};
					plugins.mafia.votes = {};
				}
			},

			inspections: function(target, room, user) {
				if (room.id !== 'mafia') return this.sendReply('You can only see mafia votes in the Mafia room.');
				if (plugins.mafia.status !== 'on') return this.sendReply('A mafia game hasn\'t started yet');
				if (plugins.mafia.participants[user.userid] !== 'Cop' && plugins.mafia.participants[user.userid] !== 'Mafia Seer') return this.sendReply('You are not a cop or mafia seer');

				return this.sendReply('The results of your inspections are: ' + JSON.stringify(plugins.mafia.inspectionresults[user.userid]));
			},

			votes: function(target, room, user) {
				if (room.id !== 'mafia') return this.sendReply('You can only see mafia votes in the Mafia room.');
				if (plugins.mafia.status !== 'on') return this.sendReply('A mafia game hasn\'t started yet');
				if (plugins.mafia.stage !== 'day') return this.sendReply('You can only have votes during the day');
				if (!this.canBroadcast()) return;

				var totals = {};

				for (var key in plugins.mafia.votes) {
					if (plugins.mafia.votes[key] in totals) {
						totals[plugins.mafia.votes[key]]++;
					} else {
						totals[plugins.mafia.votes[key]] = 1;
					}
				}

				return this.sendReply('Current votes are: ' + JSON.stringify(totals));
			},

			players: function(target, room, user) {
				if (room.id !== 'mafia') return this.sendReply('You can only use this command in the Mafia room.');
				if (plugins.mafia.status !== 'on') return this.sendReply('A mafia game hasn\'t started yet');
				if (!this.canBroadcast()) return;
				return this.sendReply('Current players are: ' + Object.keys(plugins.mafia.participants));
			},

			roles: function(target, room, user) {
				if (room.id !== 'mafia') return this.sendReply('You can only use this command in the Mafia room.');
				if (plugins.mafia.status !== 'on') return this.sendReply('A mafia game hasn\'t started yet');
				if (!this.canBroadcast()) return;
				return this.sendReply('Current roles are: ' + JSON.stringify(plugins.mafia.totals));
			},

			mafiahelp: function(target, room, user) {
				if (room.id !== 'mafia') return this.sendReply('You can only use this command in the Mafia room.');
				if (!this.canBroadcast()) return;
				this.sendReplyBox(
					'<strong>Player commands:</strong><br />' +
					'- /joinmafia: Join the current mafia game (only available during signups)<br />' +
					'- /lynch <em>name</em>: Vote to lynch the target. If a target is not given then it is no lynch. Only available during the day<br />' +
					'- /votes: See current lynch votes<br />' +
					'- /players: See the current living players<br />' +
					'- /roles: See what roles are still alive<br />' +
					'- /nightaction <em>name</em>: Use your nightaction on the target. Only available to roles with nightactions and only during the night<br />' +
					'<br />' +
					'<strong>Admin commands:</strong><br />' +
					'- /startmafia: Start signups for a mafia game<br />' +
					'- /endsignups: End signups with current players and start a mafia game. Minimum 3 players<br />' +
					'- /modkill <em>name</em>: Kill a target<br />'
				);
			}

		}
	}
};
