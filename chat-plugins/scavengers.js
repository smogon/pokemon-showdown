/**
 * Scavengers Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This is a game plugin to host scavenger games specifically in the Scavengers room,
 * where the players will race answer several hints.
 *
 * @license MIT license
 */

'use strict';

const fs = require('fs');

const DEFAULT_POINTS = [20, 15, 10, 5, 1];
const DEFAULT_BLITZ_POINTS = 10;

const path = require('path');
const DATA_FILE = path.resolve(__dirname, '../config/chat-plugins/scavdata.json');

class Ladder {
	constructor(file) {
		this.file = file;
		this.data = {};

		this.load();
	}

	load() {
		fs.readFile(this.file, 'utf8', (err, content) => {
			if (err && err.code === 'ENOENT') return false; // file doesn't exist (yet)
			if (err) return console.log(`ERROR: Unable to load scavenger leaderboard: ${err}`);

			this.data = JSON.parse(content);
		});
	}

	addPoints(name, points, noUpdate) {
		let userid = toId(name);

		if (!userid || userid === 'constructor' || !points) return this;

		if (!this.data[userid]) this.data[userid] = {name: name, points: 0};
		this.data[userid].points += points;
		if (!noUpdate) this.data[userid].name = name; // always keep the last used name

		return this; // allow chaining
	}

	reset() {
		this.data = {};
		return this; // allow chaining
	}

	write() {
		fs.writeFile(this.file, JSON.stringify(this.data), err => {
			if (err) console.log(`ERROR: Failed to write scavengers ladder - ${err}`);
		});
	}

	visualize(userid) {
		// return a promise for async sorting - make this less exploitable
		return new Promise((resolve, reject) => {
			let lowestScore = Infinity;
			let lastPlacement = 1;

			let ladder = Object.keys(this.data)
				.sort((a, b) => this.data[b].points - this.data[a].points)
				.map((u, i) => {
					u = this.data[u];
					if (u.points !== lowestScore) {
						lowestScore = u.points;
						lastPlacement = i + 1;
					}
					return {
						name: u.name,
						points: u.points,
						rank: lastPlacement,
					};
				}); // identify ties
			if (userid) {
				let rank = ladder.find(entry => toId(entry.name) === userid);
				resolve(rank);
			} else {
				resolve(ladder);
			}
		});
	}
}

let Leaderboard = new Ladder(DATA_FILE);

function formatQueue(queue, viewer) {
	let buf = queue.map((item, index) => `<tr${(viewer.userid !== item.hostId && viewer.userid !== item.staffHostId ? ` style="background-color: lightgray"` : "")}><td><button name="send" value="/scav dequeue ${index}" style="color: red; background-color: transparent; border: none; padding: 1px;">[x]</button>${Chat.escapeHTML(item.hostName)}${item.hostId !== item.staffHostId ? ` / ${item.staffHostId}` : ''}</td><td>${(item.hostId === viewer.userid || viewer.userid === item.staffHostId ? item.questions.map((q, i) => i % 2 ? `<span style="color: green"><em>[${Chat.escapeHTML(q)}]</em></span><br />` : Chat.escapeHTML(q)).join(" ") : `[${item.questions.length / 2} hidden questions]`)}</td></tr>`).join("");
	return `<div class="ladder"><table style="width: 100%"><tr><th>By</th><th>Questions</th></tr>${buf}</table></div>`;
}

function formatOrder(place) {
	// anything between 10 and 20 should always end with -th
	let remainder = place % 100;
	if (remainder >= 10 && remainder <= 20) return place + "th";

	// follow standard rules with -st, -nd, -rd, and -th
	remainder = place % 10;
	if (remainder === 1) return place + "st";
	if (remainder === 2) return place + "nd";
	if (remainder === 3) return place + "rd";
	return place + "th";
}

class ScavengerHunt extends Rooms.RoomGame {
	constructor(room, staffHost, host, official, ...questions) {
		super(room);

		this.allowRenames = true;
		this.isOfficial = official;
		this.playerCap = Infinity;


		this.hostId = host.userid;
		this.hostName = host.name;
		this.staffHostId = staffHost.userid;
		this.staffHostName = staffHost.name;

		this.gameid = "scavengers";
		this.title = "Scavengers";

		this.state = "signups";
		this.joinedIps = [];

		this.startTime = Date.now();
		this.questions = [];
		this.completed = [];

		this.onLoad(questions);
	}

	// alert new users that are joining the room about the current hunt.
	onConnect(user, connection) {
		// send the fact that a hunt is currently going on.
		connection.sendTo(this.room, `|raw|<div class="broadcast-blue"><strong>${(this.isOfficial ? "An official" : "A")} Scavenger Hunt by <em>${Chat.escapeHTML(this.hostName)}</em> has been started${(this.hostId === this.staffHostId ? '' : ` by <em>${Chat.escapeHTML(this.staffHostName)}</em>`)}.<br />The first hint is: ${Chat.escapeHTML(this.questions[0].hint)}</strong></div>`);
	}

	joinGame(user) {
		if (user.userid === this.hostId || user.userid === this.staffHostId) return user.sendTo(this.room, "You cannot join your own hunt!");
		if (Object.keys(user.ips).some(ip => this.joinedIps.includes(ip))) return user.sendTo(this.room, "You already have one alt in the hunt.");
		if (this.addPlayer(user)) {
			// limit to 1 IP in every game.
			for (let ip in user.ips) {
				this.joinedIps.push(ip);
			}

			user.sendTo("You joined the scavenger hunt! Use the command /scavenge to answer.");
			this.onSendQuestion(user);
			return true;
		}
		user.sendTo(this.room, "You have already joined the hunt.");
		return false;
	}

	// overwrite the default makePlayer so it makes a ScavengerHuntPlayer instead.
	makePlayer(user) {
		return new ScavengerHuntPlayer(user, this);
	}

	onLoad(q) {
		for (let i = 0; i < q.length; i += 2) {
			let hint = q[i];
			let answer = q[i + 1];

			this.questions.push({hint: hint, answer: answer});
		}

		if (this.isOfficial) {
			this.setTimer(60);
		}

		this.announce(`A new ${(this.isOfficial ? 'official' : '')} Scavenger Hunt by <em>${Chat.escapeHTML(this.hostName)}</em> has been started${(this.hostId === this.staffHostId ? '' : ` by <em>${Chat.escapeHTML(this.staffHostName)}</em>`)}.<br />The first hint is: ${Chat.escapeHTML(this.questions[0].hint)}`);
	}

	onEditQuestion(number, question_answer, ...value) {
		if (!['hint', 'answer'].includes(question_answer)) return false;

		value = question_answer === 'answer' ? toId(value.join(", ")) : value.join(", ");
		number = parseInt(number);

		if (!number || number < 1 || number > this.questions.length || !value) return false;

		number--; // indexOf starts at 0

		this.questions[number][question_answer] = value;
		this.announce(`The ${question_answer} for question ${number + 1} has been edited.`);
		if (question_answer === 'hint') {
			for (let p in this.players) {
				this.players[p].onNotifyChange(number);
			}
		}
		return true;
	}

	setTimer(minutes) {
		minutes = parseInt(minutes);

		if (this.timer) {
			clearTimeout(this.timer);
			delete this.timer;
		}

		if (minutes && minutes >= 1) {
			this.timer = setTimeout(() => this.onEnd(), minutes * 60000);
		}

		return minutes || "off";
	}

	onSubmit(user, value) {
		if (!(user.userid in this.players)) return false;
		value = toId(value);

		let player = this.players[user.userid];
		if (player.completed) return false;

		if (player.verifyAnswer(value)) {
			player.sendRoom("Congratulations! You have gotten the correct answer.");
			player.currentQuestion++;
			if (player.currentQuestion === this.questions.length) {
				this.onComplete(player);
			} else {
				this.onSendQuestion(user);
			}
		} else {
			player.sendRoom("That is not the answer - try again!");
		}
	}

	onSendQuestion(user) {
		if (!(user.userid in this.players) || user.userid === this.hostId) return false;

		let player = this.players[user.userid];
		if (player.completed) return false;

		let current = player.getCurrentQuestion();

		player.sendRoom(`You are on ${(current.number === this.questions.length ? "final " : "")}hint #${current.number}: ${current.question.hint}`);
		return true;
	}

	onComplete(player) {
		if (player.completed) return false;

		let now = Date.now();
		let time = Chat.toDurationString(now - this.startTime, {hhmmss: true});

		let blitz = this.isOfficial && now - this.startTime <= 60000;

		player.completed = true;
		this.completed.push({name: player.name, time: time, blitz: blitz});
		let place = formatOrder(this.completed.length);

		this.announce(`<em>${Chat.escapeHTML(player.name)}</em> has finished the hunt in ${place} place! (${time}${(blitz ? " - BLITZ" : "")})`);
		player.destroy(); // remove from user.games;
	}

	onEnd(reset, endedBy) {
		if (!endedBy && this.completed.length === 0) {
			reset = true;
		}
		if (!reset) {
			// give points for winning and blitzes in official games

			let winPoints = this.room.winPoints || DEFAULT_POINTS;
			let blitzPoints = this.room.blitzPoints || DEFAULT_BLITZ_POINTS;

			if (this.isOfficial) {
				for (let i = 0; i < this.completed.length; i++) {
					if (!this.completed[i].blitz && i >= winPoints.length) break; // there won't be any more need to keep going
					let name = this.completed[i].name;
					if (winPoints[i]) Leaderboard.addPoints(name, winPoints[i]);
					if (this.completed[i].blitz) Leaderboard.addPoints(name, blitzPoints);
				}
				Leaderboard.write();
			}

			let sliceIndex = this.isOfficial ? 5 : 3;

			this.announce(
				`The scavenger hunt has ended ${(endedBy ? "by " + Chat.escapeHTML(endedBy.name) : "automatically")}.<br />` +
				`${this.completed.slice(0, sliceIndex).map((p, i) => `${formatOrder(i + 1)} place: <em>${Chat.escapeHTML(p.name)}</em>.<br />`).join("")}${this.completed.length > sliceIndex ? `Consolation Prize: ${this.completed.slice(sliceIndex).map(e => Chat.escapeHTML(e.name)).join(', ')}<br />` : ''}<br />` +
				`<details style="cursor: pointer;"><summary>Solution: </summary><br />${this.questions.map((q, i) => `${i + 1}) ${Chat.escapeHTML(q.hint)} <span style="color: lightgreen">[<em>${Chat.escapeHTML(q.answer)}</em>]</span>`).join("<br />")}</details>`
			);

			this.tryRunQueue(this.room.id);
		} else if (endedBy) {
			this.announce(`The scavenger hunt has been reset by ${endedBy.name}.`);
		} else {
			this.announce("The hunt has been reset automatically, due to the lack of finishers.");
			this.tryRunQueue(this.room.id);
		}

		this.destroy();
	}

	tryRunQueue(roomid) {
		// prepare the next queue'd game
		if (this.room.scavQueue && this.room.scavQueue.length) {
			setTimeout(() => {
				let room = Rooms(roomid);
				if (!room || room.game || !room.scavQueue.length) return;

				let next = room.scavQueue.shift();
				room.game = new ScavengerHunt(room, {userid: next.staffHostId, name: next.staffHostName}, {name: next.hostName, userid: next.hostId}, false, ...next.questions);
				room.game.setTimer(120); // auto timer of 2 hours for queue'd games.

				room.add(`|c|~|[ScavengerManager] A scavenger hunt by ${next.hostName} has been automatically started. It will automatically end in 2 hours.`).update(); // highlight the users with "hunt by"

				// update the saved queue.
				if (room.chatRoomData) {
					room.chatRoomData.scavQueue = room.scavQueue;
					Rooms.global.writeChatRoomData();
				}
			}, 1.5 * 60000); // 1.5 minute cooldown
		}
	}

	// modify destroy to get rid of any timers in the current roomgame.
	destroy() {
		delete this.room.game;
		this.room = null;

		if (this.timer) {
			clearTimeout(this.timer);
		}
		for (let i in this.players) {
			this.players[i].destroy();
		}
	}

	announce(msg) {
		this.room.add(`|raw|<div class="broadcast-blue"><strong>${msg}</strong></div>`).update();
	}

	onUpdateConnection() {}
}

class ScavengerHuntPlayer extends Rooms.RoomGamePlayer {
	constructor(user, game) {
		super(user, game);

		this.currentQuestion = 0;
		this.completed = false;
	}

	getCurrentQuestion() {
		return {
			question: this.game.questions[this.currentQuestion],
			number: this.currentQuestion + 1,
		};
	}

	verifyAnswer(value) {
		let answer = this.getCurrentQuestion().question.answer;
		return toId(value) === answer;
	}

	onNotifyChange(num) {
		if (num === this.currentQuestion) {
			this.sendRoom(`The hint has been changed to: ${this.game.questions[num].hint}`);
		}
	}
}

let commands = {
	/**
	 * Player commands
	 */
	"": function () {
		this.parse("/join scavengers");
	},

	guess: function (target, room, user) {
		if (!room.game || room.game.gameid !== 'scavengers') return false;
		room.game.onSubmit(user, target);
	},

	join: function (target, room, user) {
		if (!room.game || room.game.gameid !== 'scavengers') return false;
		room.game.joinGame(user);
	},

	/**
	 * Creation / Moderation commands
	 */
	createofficial: 'create',
	create: function (target, room, user, connection, cmd) {
		if (room.id !== 'scavengers') return this.errorReply("Scavenger hunts can only be created in the scavenger room.");
		if (!this.can('mute', null, room)) return false;
		if (room.game) return this.errorReply(`There is already a game in this room - ${room.game.gameName}.`);

		let [hostId, ...params] = target.split(target.includes('|') ? '|' : ',').map((p, i) => {
			if (i % 2 === 0) return toId(p);
			return p.trim();
		});

		let host = Users.getExact(hostId);
		if (!host || !host.connected || !(hostId in room.users)) return this.errorReply("The user you specified as the host is not online, or is not in the room.");

		if (params.some(p => !p)) return this.errorReply("You cannot submit an empty hint/answer.  (Only alphanumeric characters will be counted for answers.)");
		if (params.length < 6 || params.length % 2) return this.errorReply("You must have at least 3 complete hint/answer pairs.");

		let isOfficial = cmd.includes('official');

		room.game = new ScavengerHunt(room, user, host, isOfficial, ...params);
		this.privateModCommand(`(A new scavenger hunt was created by ${user.name}.)`);
	},

	status: function (target, room, user) {
		if (!room.game || room.game.gameid !== 'scavengers') return false;
		let elapsed = Date.now() - room.game.startTime;

		this.sendReplyBox(`The current scavenger hunt has been up for: ${Chat.toDurationString(elapsed, {hhmmss: true})}<br />Completed (${room.game.completed.length}): ${room.game.completed.map(u => Chat.escapeHTML(u.name)).join(', ')}`);
	},

	hint: function (target, room, user) {
		if (!room.game || room.game.gameid !== 'scavengers') return false;
		if (!room.game.onSendQuestion(user)) this.errorReply("You are not currently participating in the hunt.");
	},

	timer: function (target, room, user) {
		if (!this.can('mute', null, room)) return false;
		if (!room.game || room.game.gameid !== 'scavengers') return false;

		let result = room.game.setTimer(target);
		let message = `The scavenger timer has been ${(result === 'off' ? "turned off" : `set to ${result} minutes`)}`;

		room.add(message + '.');
		this.privateModCommand(`(${message} by ${user.name}.)`);
	},

	reset: function (target, room, user) {
		if (!this.can('mute', null, room)) return false;
		if (!room.game || room.game.gameid !== 'scavengers') return false;

		room.game.onEnd(true, user);
		this.privateModCommand(`(${user.name} has reset the scavenger hunt.)`);
	},

	end: function (target, room, user) {
		if (!this.can('mute', null, room)) return false;
		if (!room.game || room.game.gameid !== 'scavengers') return false;
		room.game.onEnd(null, user);
		this.privateModCommand(`(${user.name} has ended the scavenger hunt.)`);
	},

	viewhunt: function (target, room, user) {
		if (!room.game || room.game.gameid !== 'scavengers') return false;
		if (room.game.hostId !== user.userid && room.game.staffHostId !== user.userid) return this.errorReply("You cannot view the hints and answers if you are not the host.");

		this.sendReply(`|raw|<div class="ladder"><table style="width: 100%"><tr><th>Hint</th><th>Answer</th></tr>${room.game.questions.map(q => `<tr><td>${Chat.escapeHTML(q.hint)}</td><td>${Chat.escapeHTML(q.answer)}</td></tr>`).join("")}</table><div>`);
	},

	edithunt: function (target, room, user) {
		if (!room.game || room.game.gameid !== 'scavengers') return false;
		if ((room.game.hostId !== user.userid || !user.can("broadcast", null, room)) && room.game.staffHostId !== user.userid) return this.errorReply("You cannot edit the hints and answers if you are not the host.");

		if (!room.game.onEditQuestion(...target.split(",").map(p => p.trim()))) return this.sendReply("/scavengers edithunt [question number], [hint | answer], [value] - edits the current scavenger hunt.");
	},
	/**
	 * Hunt queuing
	 */
	queue: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply("This command can only be used in the scavenger room.");
		if (!target) return this.parse("/scavengers viewqueue");

		if (!this.can('mute', null, room)) return false;

		let [hostId, ...params] = target.split(target.includes('|') ? '|' : ',').map((p, i) => {
			if (i % 2 === 0) return toId(p);
			return p.trim();
		});

		let host = Users.getExact(hostId);

		if (!host || !host.connected || !(hostId in room.users)) return this.errorReply("The user you specified as the host is not online, or is not in the room.");

		if (params.some(p => !p)) return this.errorReply("You cannot submit an empty hint/answer.  (Only alphanumeric characters will be counted for answers.)");
		if (params.length < 6 || params.length % 2) return this.errorReply("You must have at least 3 complete hint/answer pairs.");

		if (!room.scavQueue) room.scavQueue = [];

		room.scavQueue.push({hostName: host.name, hostId: host.userid, questions: params, staffHostId: user.userid, staffHostName: user.name});
		this.privateModCommand(`(${user.name} has added a scavenger hunt to the queue.)`);

		if (room.chatRoomData) {
			room.chatRoomData.scavQueue = room.scavQueue;
			Rooms.global.writeChatRoomData();
		}
	},

	dequeue: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply("This command can only be used in the scavenger room.");
		if (!this.can('mute', null, room)) return false;
		let id = parseInt(target);

		if (!room.scavQueue || isNaN(id) || id < 0 || id >= room.scavQueue.length) return false; // this command should be using the display to manage anyways.

		let removed = room.scavQueue.splice(id, 1)[0];
		this.privateModCommand(`(${user.name} has removed a scavenger hunt by ${removed.hostName} from the queue.)`);
		this.sendReply(`|uhtmlchange|scav-queue|${formatQueue(room.scavQueue, user)}`);

		if (room.chatRoomData) {
			room.chatRoomData.scavQueue = room.scavQueue;
			Rooms.global.writeChatRoomData();
		}
	},

	viewqueue: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply("This command can only be used in the scavenger room.");
		if (!this.can('mute', null, room)) return false;

		if (!room.scavQueue || !room.scavQueue.length) return this.sendReplyBox("The scavenger hunt queue is currently empty.");

		this.sendReply(`|uhtml|scav-queue|${formatQueue(room.scavQueue, user)}`);
	},

	/**
	 * Leaderboard Commands
	 */
	addpoints: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply("This command can only be used in the scavenger room.");
		if (!this.can('mute', null, room)) return false;

		let [targetId, points] = target.split(",");
		targetId = toId(targetId);
		points = parseInt(points);

		if (!targetId || targetId === 'constructor' || targetId.length > 18) return this.errorReply("Invalid username.");
		if (!points || points < 0) return this.errorReply("Points must be an integer greater than 0.");

		Leaderboard.addPoints(targetId, points, true).write();

		this.privateModCommand(`(${targetId} was given ${points} points on the monthly scavengers ladder by ${user.name}.)`);
	},

	removepoints: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply("This command can only be used in the scavenger room.");
		if (!this.can('mute', null, room)) return false;

		let [targetId, points] = target.split(",");
		targetId = toId(targetId);
		points = parseInt(points);

		if (!targetId || targetId === 'constructor' || targetId.length > 18) return this.errorReply("Invalid username.");
		if (!points || points < 0) return this.errorReply("Points must be an integer greater than 0.");

		Leaderboard.addPoints(targetId, -points, true).write();

		this.privateModCommand(`(${user.name} has taken ${points} points from ${targetId} on the monthly scavengers ladder.)`);
	},

	resetladder: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply("This command can only be used in the scavenger room.");
		if (!this.can('declare', null, room)) return false;

		Leaderboard.reset().write();

		this.privateModCommand(`(${user.name} has reset the monthly scavengers ladder.)`);
	},

	ladder: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply("This command can only be used in the scavenger room.");
		if (!this.runBroadcast()) return false;

		let nonStaff = {count: 0, lastScore: 0};

		Leaderboard.visualize().then(ladder => {
			this.sendReply(`|raw|<div class="ladder" style="overflow-y: scroll; max-height: 300px;"><table style="width: 100%"><tr><th>Rank</th><th>Name</th><th>Points</th></tr>${ladder.map(entry => {
				let isStaff = room.auth && room.auth[toId(entry.name)];

				// handle ties and only bold the top 3 non staff - as requested
				if (!isStaff) {
					nonStaff.count++;
					if (nonStaff.count <= 3) {
						nonStaff.lastScore = entry.points;
					}
				}

				return `<tr><td>${entry.rank}</td><td>${(isStaff ? `<em>${Chat.escapeHTML(entry.name)}</em>` : (nonStaff.lastScore === entry.points ? `<strong>${Chat.escapeHTML(entry.name)}</strong>` : Chat.escapeHTML(entry.name)))}</td><td>${entry.points}</td></tr>`;
			}).join('')}</table></div>`);
			if (this.broadcasting) setImmediate(() => room.update()); // make sure the room updates for broadcasting since this is async.
		});
	},

	rank: function (target, room, user) {
		if (room.id !== 'scavengers') return this.errorReply("This command can only be used in the scavenger room.");
		if (!this.runBroadcast()) return false;

		let targetId = toId(target) || user.userid;

		Leaderboard.visualize(targetId).then(rank => {
			if (!rank) return this.sendReplyBox(`User '${targetId}' does not have any points on the scavengers leaderboard.`);

			this.sendReplyBox(`User '${Chat.escapeHTML(rank.name)}' is #${rank.rank} on the scavengers leaderboard with ${rank.points} points.`);
			if (this.broadcasting) setImmediate(() => room.update()); // make sure the room updates for broadcasting since this is async.
		});
	},

	/**
	 * Leaderboard Point Distribution Editing
	 */
	setblitz: function (target, room, user) {
		if (!this.can("mute", null, room)) return false; // perms for viewing only
		if (!target) return this.sendReply(`The points rewarded for winning official hunts is: ${(room.blitzPoints || DEFAULT_BLITZ_POINTS)}`);

		if (!this.can("declare", null, room)) return false; // perms for editing

		let blitzPoints = parseInt(target);
		if (isNaN(blitzPoints) || blitzPoints < 0) return this.errorReply("The points value awarded for blitz must be an integer greater than or equal to zero.");

		room.blitzPoints = blitzPoints;

		if (room.chatRoomData) {
			room.chatRoomData.blitzPoints = room.blitzPoints;
			Rooms.global.writeChatRoomData();
		}
		this.privateModCommand(`(${user.name} has set the points awarded for blitz to ${blitzPoints}.)`);
	},

	setpoints: function (target, room, user) {
		if (!this.can("mute", null, room)) return false; // perms for viewing only
		if (!target) return this.sendReply(`The points rewarded for winning official hunts is: ${(room.winPoints || DEFAULT_POINTS).map((p, i) => `(${(i + 1)}) ${p}`).join(', ')}`);

		if (!this.can("declare", null, room)) return false; // perms for editting

		let winPoints = target.split(",").map(p => parseInt(p));

		if (winPoints.some(p => isNaN(p) || p < 0) || !winPoints.length) return this.errorReply("The points value awarded for winning a scavenger hunt must be an integer greater than or equal to zero.");

		room.winPoints = winPoints;

		if (room.chatRoomData) {
			room.chatRoomData.winPoints = room.winPoints;
			Rooms.global.writeChatRoomData();
		}
		this.privateModCommand(`(${user.name} has set the points awarded for winning an official scavenger hunt to - ${winPoints.map((p, i) => `(${(i + 1)}) ${p}`).join(', ')})`);
	},
};

exports.commands = {
	// general
	scav: 'scavengers',
	scavengers: commands,

	// old game aliases
	scavenge: commands.guess,
	startofficialhunt: 'starthunt',
	starthunt: commands.create,
	joinhunt: commands.join,
	resethunt: commands.reset,
	endhunt: commands.end,
	edithunt: commands.edithunt,
	viewhunt: commands.viewhunt,
	scavengerstatus: commands.status,
	scavengerhint: commands.hint,

	// point aliases
	scavaddpoints: 'scavengeraddpoints',
	scavengersaddpoints: commands.addpoints,

	scavrmpoints: 'scavengersremovepoints',
	scavengersrmpoints: 'scavengersremovepoints',
	scavremovepoints: 'scavengersremovepoints',
	scavengersremovepoints: commands.addpoints,

	scavresetlb: 'scavengersresetlb',
	scavengersresetlb: commands.resetladder,

	scavrank: commands.rank,
	scavladder: 'scavtop',
	scavtop: commands.ladder,
	scavengerhelp: 'scavengershelp',
	scavengershelp: function (target, room, user) {
		if (!room || room.id !== 'scavengers') return this.errorReply("This command can only be used in the scavenger room.");
		if (!this.runBroadcast()) return false;

		let userCommands = [
			"<strong>Player commands:</strong>",
			"- /scavengers - joins the scavengers room.",
			"- /joinhunt - joins the current scavenger hunt.",
			"- /scavenge <em>[guess]</em> - submits your answer to the current hint.",
			"- /scavengerstatus - checks your status in the current game.",
			"- /scavengerhint - views your latest hint in the current game.",
			"- /scavladder - views the monthly scavenger leaderboard.",
			"- /scavrank <em>[user]</em> - views the rank of the user on the monthly scavenger leaderboard.  Defaults to the user if no name is provided.",
		].join("<br />");
		let staffCommands = [
			"<strong>Staff commands:</strong>",
			"- /starthunt <em>[host] | [hint] | [answer] | [hint] | [answer] | [hint] | [answer] | ...</em> - creates a new scavenger hunt. (Requires: % @ * # & ~)",
			"- /startofficialhunt <em>[host] | [hint] | [answer] | [hint] | [answer] | [hint] | [answer] | ...</em> - creates a new official scavenger hunt with a 60 second blitz period.  Blitz and wins from official hunts will count towards the leaderboard. (Requires: % @ * # & ~)",
			"- /edithunt <em>[question number], [hint | answer], [value]</em> - edits the current scavenger hunt. Only the host(s) can edit the hunt.",
			"- /resethunt - resets the current scavenger hunt without revealing the hints and answers. (Requires: % @ * # & ~)",
			"- /endhunt - ends the current scavenger hunt and announces the winners and the answers. (Requires: % @ * # & ~)",
			"- /viewhunt - views the current scavenger hunt.  Only the user who started the hunt can use this command. Only the host(s) can view the hunt.",
			"- /scav timer <em>[minutes | off]</em> - sets a timer to automatically end the current hunt. (Requires: % @ * # & ~)",
			"- /scav addpoints <em>[user], [amount]</em> - gives the user the amount of scavenger points towards the monthly ladder. (Requires: % @ * # & ~)",
			"- /scav removepoints <em>[user], [amount]</em> - takes the amount of scavenger points from the user towards the monthly ladder. (Requires: % @ * # & ~)",
			"- /scav resetladder - resets the monthly scavenger leaderboard. (Requires: # & ~)",
			"- /scav setpoints [1st place], [2nd place], [3rd place], [4th place], [5th place], ... - sets the point values for the wins. Use `/scav setpoints` to view what the current point values are. (Requires: & # ~)",
			"- /scav setblitz [value] ... - sets the blitz award to `value`. Use `/scav setblitz` to view what the current blitz value is. (Requires: & # ~)",
			"- /scav queue <em>[host] | [hint] | [answer] | [hint] | [answer] | [hint] | [answer] | ...</em> - queues a scavenger hunt to be started after the current hunt is finished. (Requires: % @ * # & ~)",
			"- /scav viewqueue - shows the list of queued scavenger hunts to be automatically started, as well as the option to remove hunts from the queue. (Requires: % @ * # & ~)",
		].join("<br />");

		target = toId(target);
		let display = target === 'all' ? `${userCommands}<br /><br />${staffCommands}` : target === 'staff' ? staffCommands : userCommands;

		this.sendReplyBox(display);
	},
};
