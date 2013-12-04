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
	 * Scanvenger hunts plugin.
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
			scavengerstarthunt: function(target, room, user) {
				if (!this.can('hotpatch')) return false;
				if (plugins.scavenger.status === 'on') return this.sendReply('There is already an active scavenger hunt.');
				var targets = target.split(',');
				targets[0] = toId(targets[0]);
				targets[1] = toId(targets[1]);
				targets[2] = toId(targets[2]);
				targets[3] = toId(targets[3]);
				targets[4] = toId(targets[4]);
				targets[5] = toId(targets[5]);
				if (!targets[0] || !targets[1] || !targets[2] || !targets[3] || !targets[4] || !targets[5])
					return this.sendReply('You need to add three rooms and three hints in a [room, hint,] format.');
				plugins.scavenger.status = 'on';
				plugins.scavenger.roomOne = targets[0];
				plugins.scavenger.firstHint = targets[1];
				plugins.scavenger.roomTwo = targets[2];
				plugins.scavenger.secondHint = targets[3];
				plugins.scavenger.roomThree = targets[4];
				plugins.scavenger.thirdHint = targets[5];
				return this.sendReply('Scavenger hunt started.');
			},
			scavengerendhunt: function(target, room, user) {
				if (!this.can('hotpatch')) return false;
				if (plugins.scavenger.status !== 'on') return this.sendReply('There is no active scavenger hunt.');
				var result = '';
				var winner = plugins.scavenger.finished[0];
				var second = plugins.scavenger.finished[1];
				var third = plugins.scavenger.finished[2];
				var consolation = plugins.scavenger.finished.slice(2);
				result += '<strong>Winner of Scavenger Hunt: ' + ((winner)? winner : 'no one') + '.';
				result += '</strong> Second place: ' + ((second)? second : 'no one') + '.';
				result += ' Third place: ' + ((third)? third : 'no one') + '.';
				result += ' Consolation prize to: ' + ((consolation.length > 0)? consolation.join(', ') : 'no one') + '.';
				result += '<br />Solution: ' + plugins.scavenger.roomOne + ', ' 
				+ plugins.scavenger.roomTwo + ', ' + plugins.scavenger.roomThree + '.';
				if (Rooms.rooms.scavengers) Rooms.rooms.scavengers.add('|raw|<div class="broadcast-blue">' + result + '</div>');
				this.parse('/scavengerresethunt');
				return this.sendReply('Scavenger hunt finished.');
			},
			scavengerresethunt: function(target, room, user) {
				if (!this.can('hotpatch')) return false;
				plugins.scavenger.status = 'off';
				plugins.scavenger.roomOne = '';
				plugins.scavenger.roomTwo = '';
				plugins.scavenger.roomThree = '';
				plugins.scavenger.firstHint = '';
				plugins.scavenger.secondHint = '';
				plugins.scavenger.thirdHint = '';
				plugins.scavenger.participants = {};
				plugins.scavenger.finished = {winner: '', second: '', third: '', consolation: []};
				return this.sendReply('Scavenger hunt reset.');
			},
			scavenger: 'scavengers',
			scavengers: function(target, room, user) {
				return this.parse('/join scavengers');
			},
			scavengerhint: function(target, room, user) {
				if (plugins.scavenger.status !== 'on') return this.sendReply('There is no active scavenger hunt right now.');
				if (!plugins.scavenger.participants[user.id]) return this.sendReply('You are not participating in the current scavenger hunt.');
				if (plugins.scavenger.participants[user.id].room >= 3) return this.sendReply('You have already finished!');
				return this.sendReply(
					'Your current hint: ' 
					+ plugins.scavenger[{0:'firstHint', 1:'secondHint', 2:'thirdHint'}[plugins.scavenger.participants[user.id].room]]
					+ '. Type /scavenge [solution] to find out if you are right.'
				);
			},
			scavenge: function(target, room, user) {
				if (plugins.scavenger.status !== 'on') return this.sendReply('There is no active scavenger hunt right now.');
				if (!plugins.scavenger.participants[user.id]) return this.sendReply('You are not participating in the current scavenger hunt.');
				if (plugins.scavenger.participants[user.id].room >= 3) return this.sendReply('You have already finished!');
				target = toId(target);
				if (plugins.scavenger[{0:'roomOne', 1:'roomTwo', 2:'roomThree'}[plugins.scavenger.participants[user.id].room]] === target) {
					plugins.scavenger.participants[user.id].room++;
					if (plugins.scavenger.participants[user.id].room < 3) {
						return this.sendReply('Well done! You have advanced to the next room! Type /scavengerhint to see the next hint!');
					} else {
						// User finished, let's check the result
						plugins.scavenger.finished.push(user.name);
						var winningPositions = {1:'winner', 2:'second', 3:'third'};
						var position = plugins.scavenger.finished.length;
						var result = 'The user ' + user.name + ' has finished the hunt! He is the '
						+ ((winningPositions[position])? winningPositions[position] : position + 'th') + '!';
						if (Rooms.rooms.scavengers) Rooms.rooms.scavengers.add('|raw|<div class="broadcast-blue">' + result + '</div>');
					}
				} else {
					return this.sendReply('Fat luck - that is not the next room.');
				}
			},
			joinhunt: function(target, room, user) {
				if (plugins.scavenger.status !== 'on') return this.sendReply('There is no active scavenger hunt right now.');
				if (plugins.scavenger.participants[user.id]) return this.sendReply('You are already participating in the current scavenger hunt.');
				plugins.scavenger.participants[user.id] = {id: user.id, room: 0};
				return this.sendReply('You joined the scavenger hunt. Type /scavenge name to try to find the room and /scavengerhint to read your current hint.');
			}
		}
	}
};
