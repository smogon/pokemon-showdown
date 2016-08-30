// Mafia chat plugin.
// By bumbadadabum, with input from Zarel and art by crobat.

'use strict';

let MafiaData = require('./mafia-data');

const deadImage = '<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-dead.png" />';
const meetingMsg = {town: 'The town has lynched a suspect!', mafia: 'The mafia strikes again!'};

const defaultSettings = {anonVotes: false, allowWills: false, autoModchat: false};

class MafiaPlayer extends Rooms.RoomGamePlayer {
	constructor(user, game) {
		super(user, game);

		this.voting = false;
		this.targeting = false;
	}

	event(event) {
		if (this.class[event].target) {
			if (this.class[event].oneshot) {
				if (!this.used) this.used = {};
				if (this.used[event]) return;
				this.using = event;
			}
			this.targeting = true;
			this.toExecute = this.class[event].callback;
			if (this.class[event].target.count === 'single') {
				this.singleTarget(this.class[event].target.side);
			}
			this.targetWindow(this.class.image, this.class[event].flavorText);
		} else {
			this.toExecute = this.class[event].function;
		}

		this.game.executionOrder.push(this);
	}

	kill(flavorText) {
		if (this.invincible) return;

		let message = flavorText + '<br/>' + Tools.escapeHTML(this.name + ', the ' + this.class.name) + ' lies dead on the ground.';

		if (this.allowWills && this.will) {
			message += '<br/>' + Tools.escapeHTML(this.name) + '\'s will: ' + Tools.escapeHTML(this.will);
		}

		this.game.announcementWindow(deadImage, message);
		this.game.playerCount--;
		this.game.dead.push(this.name);
		delete this.game.players[this.userid];
		this.destroy();
	}

	eliminate() {
		if (this.game.gamestate === 'pregame') {
			this.game.announcementWindow('', Tools.escapeHTML(this.name) + ' was kicked from the game.');
		} else {
			this.game.announcementWindow(deadImage, Tools.escapeHTML(this.name + ', the ' + this.class.name) + ' was eliminated from the game.');
		}
		this.game.playerCount--;
		this.game.dead.push(this.name);
		delete this.game.players[this.userid];
		this.destroy();
	}

	playerWindow(image, content) {
		this.sendRoom('|html|' + this.game.mafiaWindow(image, content));
	}

	getRole() {
		this.sendRoom('|html|' + this.game.mafiaWindow(this.class.image, Tools.escapeHTML(this.class.flavorText)));
	}

	targetWindow(image, content) {
		let output = content;
		output += '<br/><p>Who do you wish to target?</p>';
		for (let i in this.validTargets) {
			output += '<button value="/choose target ' + this.validTargets[i].userid + '" name="send">' + Tools.escapeHTML(this.validTargets[i].name) + '</button>';
		}
		output += '<button value="/choose target none" name="send">Nobody</button>';

		this.sendRoom('|uhtml|mafia' + this.game.room.gameNumber + 'target' + this.game.gamestate + this.game.day + '|' + this.game.mafiaWindow(image, output));
	}

	updateTarget(image) {
		let header = '|uhtmlchange|mafia' + this.game.room.gameNumber + 'target' + this.game.gamestate + this.game.day + '|';

		if (this.target) {
			this.sendRoom(header + this.game.mafiaWindow(image, 'Targeting ' + Tools.escapeHTML(this.target.name) + '!'));
		} else {
			this.sendRoom(header + this.game.mafiaWindow(image, 'You chose to not target anybody.'));
		}
	}

	voteWindow(image, content) {
		let output = content;
		output += '<br/><p>Who do you wish to vote for?</p>';
		for (let i in this.validVotes) {
			output += '<button value="/choose vote ' + this.validVotes[i].userid + '" name="send">' + Tools.escapeHTML(this.validVotes[i].name) + '</button>';
		}
		output += '<button value="/choose vote none" name="send">Abstain</button>';

		this.sendRoom('|uhtml|mafia' + this.game.room.gameNumber + 'vote' + this.game.gamestate + this.game.day + '|' + this.game.mafiaWindow(image, output));
	}

	// Targeting mechanics:

	// Targets a single player of side side.
	singleTarget(side, targetSelf) {
		this.validTargets = {};
		for (let i in this.game.players) {
			let thisSide = this.game.players[i].class.side;
			if ((side === 'any' || thisSide === side || (side === 'nomafia' && thisSide !== 'mafia')) && (targetSelf || this.game.players[i] !== this)) {
				this.validTargets[i] = this.game.players[i];
			}
		}
	}

	// Triggers after the user has selected their target.
	onReceiveTarget(target) {
		if (!this.targeting) {
			return this.sendRoom("You're not selecting a target right now.");
		}

		if (target in this.validTargets || target === 'none') {
			this.targeting = false;
			if (target === 'none') {
				if (this.using) delete this.using;
				this.toExecute = null;
			} else {
				this.target = this.game.players[target];
			}
			delete this.validTargets;

			this.updateTarget(this.class.image);

			for (let i in this.game.players) {
				if (this.game.players[i].voting || this.game.players[i].targeting) {
					return;
				}
			}
			this.game.progress();
		} else {
			this.sendRoom("Invalid target");
		}
	}

	// Triggers after the user has voted.
	onReceiveVote(target) {
		if (!this.voting) {
			return;
		}

		let numVotes = 1;

		if (this.class.numVotes) numVotes = this.class.numVotes;

		if (target in this.validVotes || target === 'none') {
			if (this.game.currentVote[target]) {
				this.game.currentVote[target].voters.push(this.name);
				this.game.currentVote[target].votes += numVotes;
			} else {
				this.game.currentVote[target] = {votes: numVotes, voters: [this.name]};
			}

			this.voting = false;
			delete this.validVotes;

			this.game.updateVotes();

			for (let i in this.game.players) {
				if (this.game.players[i].voting || this.game.players[i].targeting) {
					return;
				}
			}
			this.game.progress();
		} else {
			this.sendRoom("You can't vote for that person");
		}
	}
}

class Mafia extends Rooms.RoomGame {
	constructor(room, max, roles, settings) {
		super(room);

		if (room.gameNumber) {
			room.gameNumber++;
		} else {
			room.gameNumber = 1;
		}

		this.gameid = 'mafia';
		this.title = 'Mafia';
		this.allowRenames = true;
		this.playerCap = max;
		this.PlayerClass = MafiaPlayer;

		this.roles = roles;
		this.day = 1;
		this.gamestate = 'pregame';
		this.timer = null;
		this.dead = [];

		for (let i in settings) {
			this[i] = settings[i];
		}

		this.roleString = this.roles.reduce((prev, cur, index, array) => {
			let roleName = MafiaData.MafiaClasses[cur].pregameName || MafiaData.MafiaClasses[cur].name;
			if (index === array.length - 1) {
				return prev + roleName;
			} else {
				return prev + roleName + ', ';
			}
		}, '');

		this.room.send('|uhtml|mafia' + this.room.gameNumber + 'pregame|' + this.pregameWindow(false));
	}

	exportGame() {
		let gameObj = {classes: {}, settings: {}};

		for (let i = 0; i < this.roles.length; i++) {
			if (this.roles[i] in gameObj.classes) {
				gameObj.classes[this.roles[i]]++;
			} else {
				gameObj.classes[this.roles[i]] = 1;
			}
		}

		for (let i in defaultSettings) {
			gameObj.settings[i] = this[i];
		}

		return JSON.stringify(gameObj);
	}

	onConnect(user, connection) {
		if (user.userid in this.players) {
			connection.sendTo(this.room, '|uhtml|mafia' + this.room.gameNumber + 'pregame|' + this.pregameWindow(true));
		} else {
			connection.sendTo(this.room, '|uhtml|mafia' + this.room.gameNumber + 'pregame|' + this.pregameWindow(false));
		}
	}

	onRename(user, oldUserid) {
		if (!(oldUserid in this.players)) return;

		if (user.userid === oldUserid) {
			this.players[user.userid].name = user.name;
		} else {
			this.players[user.userid] = this.players[oldUserid];
			this.players[user.userid].userid = user.userid;
			this.players[user.userid].name = user.name;
			delete this.players[oldUserid];
		}

		this.updatePregame();
	}

	onLeave(user) {
		if (this.gamestate === 'pregame' && user.userid in this.players) {
			delete this.players[user.userid];
			this.updatePregame();
		}
	}

	forfeit(user) {
		if (!(user.userid in this.players)) return false;
		if (this.gamestate === 'pregame') return false;

		this.players[user.userid].eliminate();
		return true;
	}

	joinGame(user, text) {
		if (this.gamestate !== 'pregame') return user.sendTo(this.room, "The game has started already.");

		if (this.addPlayer(user)) {
			this.updatePregame();
			if (this.playerCount === this.playerCap) {
				this.start();
			}
		} else {
			return user.sendTo(this.room, "You're already in the game.");
		}
	}

	leaveGame(user, text) {
		if (!(user.userid in this.players)) return false;
		if (this.gamestate !== 'pregame') return user.sendTo(this.room, "The game has started already. If you wish to give up, use /forfeit.");

		this.removePlayer(user);
		this.updatePregame();
	}

	choose(user, target) {
		if (!(user.userid in this.players)) return user.sendTo(this.room, "You're not in the game.");
		if (this.gamestate === 'pregame') return user.sendTo(this.room, "The game hasn't started yet.");

		let parts = target.split(' ').map(toId);
		let cmd = parts.shift();
		let player = parts.join(' ');

		if (player in this.players || player === 'none') {
			if (cmd === 'target') {
				return this.players[user.userid].onReceiveTarget(player);
			} else if (cmd === 'vote') {
				return this.players[user.userid].onReceiveVote(player);
			}
		}

		return user.sendTo(this.room, "Incorrect command or target.");
	}

	makePlayer(user) {
		return new MafiaPlayer(user, this);
	}

	displayPregame() {
		for (let i in this.room.users) {
			let user = this.room.users[i];

			if (user.userid in this.players) {
				user.sendTo(this.room, '|uhtml|mafia' + this.room.gameNumber + 'pregame|' + this.pregameWindow(true));
			} else {
				user.sendTo(this.room, '|uhtml|mafia' + this.room.gameNumber + 'pregame|' + this.pregameWindow(false));
			}
		}
	}

	pregameWindow(joined) {
		let temp = Object.values(this.players);
		let output = '<div class="broadcast-blue"><center><h2>A game of mafia has been made!</h2><p>Participants (' + (this.playerCap - temp.length) + ' needed): </p>';
		for (let i = 0; i < temp.length; i++) {
			output += Tools.escapeHTML(temp[i].name);
			if (i < temp.length - 1) {
				output += ', ';
			}
		}

		output += '<br/><strong>Roles:</strong> ' + this.roleString + '<br/>';

		if (this.allowWills) output += 'Wills are allowed. ';
		if (this.anonVotes) output += 'Votes are anonymous. ';
		if (this.autoModchat) output += 'Modchat is automatically set to + at night. ';

		if (joined) {
			output += '<br/><button value="/leavegame" name="send">Leave</button>';
		} else {
			output += '<br/><button value="/joingame" name="send">Join</button>';
		}

		return output + '</center></div>';
	}

	updatePregame() {
		for (let i in this.room.users) {
			let user = this.room.users[i];

			if (user.userid in this.players) {
				user.sendTo(this.room, '|uhtmlchange|mafia' + this.room.gameNumber + 'pregame|' + this.pregameWindow(true));
			} else {
				user.sendTo(this.room, '|uhtmlchange|mafia' + this.room.gameNumber + 'pregame|' + this.pregameWindow(false));
			}
		}
	}

	// UI

	// Simple window, used for announcements and the likes.
	mafiaWindow(image, content) {
		let output = '<div class="broadcast-blue">';
		output += '<h3>' + ((this.gamestate === 'night') ? 'Night ' : 'Day ') + this.day + '</h3>';
		output += '<table><tr><td style="text-align:center;">' + image + '</td><td style="text-align:center;width:100%;">';
		output += content;
		output += '</td></tr></table></div>';
		return output;
	}

	announcementWindow(image, content) {
		this.room.add('|html|' + this.mafiaWindow(image, content));
		this.room.update();
	}

	displayGamestate() {
		let alive = [];
		let mafia = [];

		for (let i in this.players) {
			alive.push(this.players[i].name);
			if (this.players[i].class.side === 'mafia') {
				mafia.push(this.players[i].name);
			}
		}

		let content = '<strong>Roles:</strong> ' + this.roleString + '<br/><strong>Alive:</strong> ' + Tools.escapeHTML(alive.join(', ')) + '<br/><strong>Dead:</strong> ' + Tools.escapeHTML(this.dead.join(', '));

		for (let i in this.players) {
			if (this.players[i].class.side === 'mafia') {
				this.players[i].sendRoom('|html|' + this.mafiaWindow(this.players[i].class.image, content + '<br/><strong>Mafia:</strong> ' + Tools.escapeHTML(mafia.joi0n(', '))));
			} else {
				this.players[i].sendRoom('|html|' + this.mafiaWindow(this.players[i].class.image, content));
			}
		}
	}

	updateVotes() {
		let text = '';
		for (let i in this.currentVote) {
			text += (i === 'none' ? 'Abstain' : Tools.escapeHTML(this.players[i].name)) + ': ';
			if (this.anonVotes) {
				text += this.currentVote[i].votes + ' votes.';
			} else {
				text += this.currentVote[i].voters.join(', ');
			}
			text += '<br/>';
		}

		if (!text) text = 'No votes yet.';

		for (let i in this.players) {
			let player = this.players[i];
			if (this.voters.indexOf(player) > -1 && !player.voting) {
				player.sendRoom('|uhtmlchange|mafia' + this.room.gameNumber + 'vote' + this.gamestate + this.day + '|' + this.mafiaWindow(player.class.image, text));
			}
		}
	}

	tallyVotes() {
		let max = 0;
		let toKill = null;
		for (let i in this.currentVote) {
			if (this.currentVote[i].votes > max) {
				toKill = i;
				max = this.currentVote[i].votes;
			} else if (this.currentVote[i].votes === max) {
				toKill = null;
				max = this.currentVote[i].votes;
			}
		}

		this.currentVote = null;

		if (toKill && toKill !== 'none') {
			return this.players[toKill];
		} else {
			return false;
		}
	}

	// Gamestate handling:

	start() {
		let rolesLeft = this.roles;

		for (let i in this.players) {
			let index = Math.floor(Math.random() * rolesLeft.length);
			this.players[i].class = MafiaData.MafiaClasses[rolesLeft[index]];
			rolesLeft.splice(index, 1);
			if (!this.players[i].class.atStart) {
				this.players[i].getRole();
			}
		}

		this.room.send('|uhtmlchange|mafia' + this.room.gameNumber + 'pregame|<div class="infobox">The game has started!</div>');
		this.allowRenames = false;
		this.gamestate = 'initial';
		this.progress();
	}

	end(image, content) {
		this.announcementWindow(image, content);

		clearTimeout(this.timer);
		this.timer = null;
		this.room.game = null;
		if (this.autoModchat && this.oldModchat && this.room.modchat === '+') {
			this.room.modchat = this.oldModchat;
		}
		this.destroy();
	}

	forceEnd() {
		this.room.send("The game of mafia was forcibly ended.");

		clearTimeout(this.timer);
		this.timer = null;
		this.room.game = null;
		if (this.autoModchat && this.oldModchat && this.room.modchat === '+') {
			this.room.modchat = this.oldModchat;
		}
		this.destroy();
	}

	progress() {
		for (let i in this.players) {
			if (this.players[i].targeting || this.players[i].voting) {
				this.players[i].eliminate();
			}
		}

		if (this.executionOrder) {
			for (let i = 0; i < this.executionOrder.length; i++) {
				let player = this.executionOrder[i];
				if (player.toExecute) {
					if (player.roleBlocked) {
						player.roleBlocked = false;
						player.toExecute = null;
					} else {
						if (player.using) {
							player.used[player.using] = 1;
							delete player.using;
						}
						let output;
						if (player.target) {
							output = Tools.escapeHTML(player.toExecute(player.target));
						} else {
							output = Tools.escapeHTML(player.toExecute());
						}

						if (output) {
							player.playerWindow(player.class.image, output);
						}
						player.toExecute = null;
					}
				}
			}
		}

		this.executionOrder = null;

		if (this.meeting) {
			let toKill = this.tallyVotes();

			if (toKill) {
				toKill.kill(meetingMsg[this.meeting]);

				if (this.meeting === 'town' && toKill.class.onLynch) {
					toKill.class.onLynch();
				}
			}

			this.meeting = null;
		}

		let mafiaCount = 0;
		let townCount = 0;

		for (let i in this.players) {
			let player = this.players[i];

			if (player.invincible) {
				player.invincible = false;
			}

			if (player.class.side === 'mafia') {
				mafiaCount++;
			} else if (player.class.side === 'town') {
				townCount++;
			}
		}

		if (mafiaCount > this.playerCount - mafiaCount) {
			this.end(MafiaData.MafiaClasses.mafia.image, 'The mafia is victorious, how awful!');
			return;
		} else if (!mafiaCount && (townCount === this.playerCount)) {
			this.end(MafiaData.MafiaClasses.villager.image, 'The town has driven the mafia out succesfully!');
			return;
		} else if (this.playerCount === 1) {
			for (let i in this.players) {
				if (this.players[i].class.side === 'solo') {
					this.end(this.players[i].class.image, this.players[i].class.victoryText);
					return;
				}
			}
		}

		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}

		switch (this.gamestate) {
		case 'night':
			if (this.autoModchat && this.day) {
				if (this.room.modchat === '+') {
					this.room.modchat = this.oldModchat;
				}
				delete this.oldModchat;
			}
			// falls through
		case 'initial':
			this.gamestate = 'day';
			this.displayGamestate();
			this.setTimer(0.5);
			break;
		case 'day':
			this.gamestate = 'lynch';
			this.townMeeting();
			this.gameEvent('onDay', 2);
			break;
		case 'lynch':
			this.gamestate = 'night';
			if (this.autoModchat) {
				this.oldModchat = this.room.modchat;
				this.room.modchat = '+';
			}
			this.mafiaMeeting();
			this.gameEvent('onNight', 2);
		}
	}

	setTimer(mins) {
		this.timer = setTimeout(() => {
			for (let i in this.players) {
				this.players[i].sendRoom("10 seconds left!");
			}
			this.timer = setTimeout(() => {
				this.progress();
			}, 10000);
		}, ((mins - 0.167) * 60000));
	}

	// Meetings:

	mafiaMeeting() {
		this.meeting = 'mafia';
		this.currentVote = {};
		this.voters = [];
		let noMafia = {};

		for (let i in this.players) {
			let player = this.players[i];

			if (player.class.side !== 'mafia') {
				noMafia[i] = player;
			} else {
				this.voters.push(player);
			}
		}

		for (let i = 0; i < this.voters.length; i++) {
			this.voters[i].voting = true;
			this.voters[i].validVotes = noMafia;

			let flavorText = '';
			if (this.voters.length === 1) {
				flavorText += 'As the only live member of the mafia, you have to be careful. Not careful enough to stop killing, though.';
			} else if (this.voters.length === 2) {
				flavorText += 'You sit down with the only other member of the mafia, ' + (i === 0 ? Tools.escapeHTML(this.voters[1].name) : Tools.escapeHTML(this.voters[0].name)) + '.';
			} else {
				flavorText += 'You sit down with the other members of the mafia, ';
				for (let j = 0; i < this.voters.length; i++) {
					if (i !== j) {
						if (j === (this.voters.length - 1) || (j < i && j === (this.voters.length - 2))) {
							flavorText += ' and ';
						} else {
							flavorText += ', ';
						}
						flavorText += Tools.escapeHTML(this.voters[i].name);
					}
				}
			}

			this.voters[i].voteWindow(this.voters[i].class.image, flavorText);
		}
	}

	townMeeting() {
		this.meeting = 'town';
		this.currentVote = {};
		this.voters = [];

		for (let i in this.players) {
			let player = this.players[i];
			this.voters.push(player);

			player.voting = true;
			player.validVotes = this.players;

			player.voteWindow(player.class.image, 'Outraged over the mafia\'s activity in town, the people decide to lynch a person they suspect of being involved with the mafia.');
		}
	}

	gameEvent(event, timer) {
		this.executionOrder = [];

		for (let i in this.players) {
			let player = this.players[i];
			if (player.class[event]) {
				player.event(event);
			}
		}

		this.executionOrder.sort((a, b) =>
			b.class[event].priority - a.class[event].priority
		);

		if (this.executionOrder.length || this.currentVote) {
			this.setTimer(timer);
		} else {
			this.setTimer(0.25);
		}
	}
}

exports.commands = {
	mafia: {
		create: 'new',
		new: function (target, room, user) {
			if (!this.can('game', null, room)) return false;
			if (!room.mafiaEnabled) return this.errorReply("Mafia is disabled for this room.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (room.game) return this.errorReply("There is already a game of " + room.game.title + " in progress in this room.");

			// Check if input is a JSON object. If it is, use the parser for json input.
			let targetObj;
			try {
				targetObj = JSON.parse(target);
			} catch (e) {}

			if (targetObj) {
				if (!(targetObj.classes && Object.keys(targetObj.classes).length)) return this.errorReply("Invalid input.");

				let roleList = [];

				for (let i in targetObj.classes) {
					if (!MafiaData.MafiaClasses[i]) {
						return this.errorReply(Tools.escapeHTML(i) + " is not a valid mafia class.");
					}

					let amt = parseInt(Tools.getString(targetObj.classes[i]));
					if (isNaN(amt) || amt < 0 || amt > 25) return this.errorReply("Invalid amount for class " + Tools.escapeHTML(i));

					for (let j = 0; j < amt; j++) {
						roleList.push(i);
					}
				}

				let settings = {};

				if (targetObj.settings) {
					for (let i in defaultSettings) {
						if (i in targetObj.settings) {
							settings[i] = !!targetObj.settings[i];
						} else {
							settings[i] = defaultSettings[i];
						}
					}
				} else {
					settings = defaultSettings;
				}

				room.game = new Mafia(room, roleList.length, roleList, settings);
			} else {
				let params = target.split(',').map(param => param.toLowerCase().trim());

				if (params[0] === 'dethy') params = ['goon', 'cop', 'insanecop', 'paranoidcop', 'naivecop'];

				if (!params) return this.errorReply("No roles entered.");

				for (let i = 0; i < params.length; i++) {
					if (!MafiaData.MafiaClasses[params[i]]) {
						return this.errorReply(Tools.escapeHTML(params[i]) + " is not a valid mafia class.");
					}
				}

				room.game = new Mafia(room, params.length, params, defaultSettings);
			}

			return this.privateModCommand("(A game of mafia was started by " + user.name + ".)");
		},

		display: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'mafia') return this.errorReply("There is no game of mafia running in this room.");
			if (room.game.gamestate !== 'pregame') return this.errorReply("The game has started already.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");

			room.game.displayPregame();
		},

		will: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'mafia') return this.errorReply("There is no game of mafia running in this room.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");

			if (target.toLowerCase() === 'on' || target.toLowerCase() === 'enable') {
				if (!this.can('game', null, room)) return false;
				if (room.game.gamestate !== 'pregame') return this.errorReply("The game has started already.");

				if (room.game.allowWills) {
					this.errorReply("Wills are already enabled.");
				} else {
					room.game.allowWills = true;
					room.game.updatePregame();
				}
			} else if (target.toLowerCase() === 'off' || target.toLowerCase() === 'disable') {
				if (!this.can('game', null, room)) return false;
				if (room.game.gamestate !== 'pregame') return this.errorReply("The game has started already.");

				if (!room.game.allowWills) {
					this.errorReply("Wills are already disabled.");
				} else {
					room.game.allowWills = false;
					room.game.updatePregame();
				}
			} else if (room.game.allowWills) {
				if (!(user.userid in room.game.players)) return this.errorReply("You're not in the game.");
				if (room.game.gamestate !== 'pregame') return this.errorReply("You can't do that before the game has started.");
				if (target.length > 200) return this.errorReply("Will too long.");

				let will = room.game.players[user.userid].will;

				if (!target.length) {
					if (will) {
						return this.sendReply("Your will is: " + Tools.escapeHTML(will));
					} else {
						return this.sendReply("You don't have a will set.");
					}
				}

				room.game.players[user.userid].will = target;
				this.sendReply("Will set to: " + Tools.escapeHTML(target));
			} else {
				this.errorReply("Wills are not allowed in this game.");
			}
		},

		anonvotes: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'mafia') return this.errorReply("There is no game of mafia running in this room.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (!this.can('game', null, room)) return false;
			if (room.game.gamestate !== 'pregame') return this.errorReply("The game has started already.");

			if (target === 'on' || target === 'enable') {
				if (room.game.anonVotes) {
					this.errorReply("Anonymous votes are already enabled.");
				} else {
					room.game.anonVotes = true;
					room.game.updatePregame();
				}
			} else if (target === 'off' || target === 'disable') {
				if (!room.game.anonVotes) {
					this.errorReply("Anonymous votes are already disabled.");
				} else {
					room.game.anonVotes = false;
					room.game.updatePregame();
				}
			}
		},

		automodchat: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'mafia') return this.errorReply("There is no game of mafia running in this room.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (!this.can('game', null, room)) return false;
			if (room.game.gamestate !== 'pregame') return this.errorReply("The game has started already.");

			if (target === 'on' || target === 'enable') {
				if (room.game.autoModchat) {
					this.errorReply("Automatic modchat is already enabled.");
				} else {
					room.game.autoModchat = true;
					room.game.updatePregame();
				}
			} else if (target === 'off' || target === 'disable') {
				if (!room.game.autoModchat) {
					this.errorReply("Automatic modchat is already disabled.");
				} else {
					room.game.autoModchat = false;
					room.game.updatePregame();
				}
			}
		},

		export: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'mafia') return this.errorReply("There is no game of mafia running in this room.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (!this.can('game', null, room)) return false;

			return this.sendReply("/mafia new " + room.game.exportGame());
		},

		end: function (target, room, user) {
			if (!this.can('game', null, room)) return false;
			if (!room.game || room.game.gameid !== 'mafia') return this.errorReply("There is no game of mafia running in this room.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");

			room.game.forceEnd();
			return this.privateModCommand("(The game of mafia was forcibly ended by " + user.name + ".)");
		},

		disable: function (target, room, user) {
			if (!this.can('mafiamanagement', null, room)) return;
			if (!room.mafiaEnabled) {
				return this.errorReply("Mafia is already disabled.");
			}
			delete room.mafiaEnabled;
			if (room.chatRoomData) {
				delete room.chatRoomData.mafiaEnabled;
				Rooms.global.writeChatRoomData();
			}
			return this.sendReply("Mafia has been disabled for this room.");
		},

		enable: function (target, room, user) {
			if (!this.can('mafiamanagement', null, room)) return;
			if (room.mafiaEnabled) {
				return this.errorReply("Mafia is already enabled.");
			}
			room.mafiaEnabled = true;
			if (room.chatRoomData) {
				room.chatRoomData.mafiaEnabled = true;
				Rooms.global.writeChatRoomData();
			}
			return this.sendReply("Mafia has been enabled for this room.");
		},
	},
};
