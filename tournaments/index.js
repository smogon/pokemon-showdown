'use strict';

const BRACKET_MINIMUM_UPDATE_INTERVAL = 2 * 1000;
const AUTO_DISQUALIFY_WARNING_TIMEOUT = 30 * 1000;
const AUTO_START_MINIMUM_TIMEOUT = 30 * 1000;
const MAX_REASON_LENGTH = 300;

let TournamentGenerators = Object.create(null);
let generatorFiles = {
	'roundrobin': 'generator-round-robin',
	'elimination': 'generator-elimination',
};
for (let type in generatorFiles) {
	TournamentGenerators[type] = require('./' + generatorFiles[type]);
}

exports.tournaments = {};

function usersToNames(users) {
	return users.map(user => user.name);
}

class Tournament {
	constructor(room, format, generator, playerCap, isRated) {
		format = toId(format);

		this.id = room.id;
		this.room = room;
		this.title = Tools.getFormat(format).name + ' tournament';
		this.allowRenames = false;
		this.players = Object.create(null);
		this.playerCount = 0;
		this.playerCap = parseInt(playerCap) || Config.tournamentDefaultPlayerCap || 0;

		this.format = format;
		this.banlist = [];
		this.generator = generator;
		this.isRated = isRated;
		this.scouting = true;
		this.modjoin = false;
		this.forceTimer = false;
		this.autostartcap = false;
		if (Config.tournamentDefaultPlayerCap && this.playerCap > Config.tournamentDefaultPlayerCap) {
			Monitor.log('[TourMonitor] Room ' + room.id + ' starting a tour over default cap (' + this.playerCap + ')');
		}

		this.isBracketInvalidated = true;
		this.lastBracketUpdate = 0;
		this.bracketUpdateTimer = null;
		this.bracketCache = null;

		this.isTournamentStarted = false;
		this.availableMatches = null;
		this.inProgressMatches = null;

		this.isAvailableMatchesInvalidated = true;
		this.availableMatchesCache = null;

		this.pendingChallenges = null;
		this.autoDisqualifyTimeout = Infinity;
		this.autoDisqualifyTimer = null;
		this.autoStartTimeout = Infinity;
		this.autoStartTimer = null;

		this.isEnded = false;

		room.add('|tournament|create|' + this.format + '|' + generator.name + '|' + this.playerCap);
		room.send('|tournament|update|' + JSON.stringify({
			format: this.format,
			generator: generator.name,
			playerCap: this.playerCap,
			isStarted: false,
			isJoined: false,
		}));
		this.update();
	}

	setGenerator(generator, output) {
		if (this.isTournamentStarted) {
			output.sendReply('|tournament|error|BracketFrozen');
			return;
		}

		let isErrored = false;
		this.generator.getUsers().forEach(user => {
			let error = generator.addUser(user);
			if (typeof error === 'string') {
				output.sendReply('|tournament|error|' + error);
				isErrored = true;
			}
		});

		if (isErrored) return;

		this.generator = generator;
		this.room.send('|tournament|update|' + JSON.stringify({generator: generator.name}));
		this.isBracketInvalidated = true;
		this.update();
		return true;
	}

	setBanlist(params, output) {
		let format = Tools.getFormat(this.format);
		if (format.team) {
			output.errorReply(format.name + " does not support supplementary banlists.");
			return false;
		}
		let banlist = [];
		for (let i = 0; i < params.length; i++) {
			let param = params[i].trim();
			let unban = false;
			if (param.charAt(0) === '!') {
				unban = true;
				param = param.substr(1);
			}
			let search = Tools.dataSearch(param);
			if (!search || search.length < 1) continue;
			search = search[0];
			if (search.searchType === 'nature') continue;
			let ban = search.name;
			let oppositeBan;
			if (unban) {
				if (format.unbanlist && format.unbanlist.includes(ban)) continue;
				oppositeBan = ban;
				ban = '!' + ban;
			} else {
				oppositeBan = '!' + ban;
			}
			let index = banlist.indexOf(oppositeBan);
			if (index > -1) {
				banlist.splice(index, 1);
			} else {
				if (!format.banlist || !format.banlist.includes(ban)) banlist.push(ban);
			}
		}
		if (banlist.length < 1) {
			output.errorReply("The specified banlist is invalid or already included in " + format.name + ".");
			return false;
		}
		this.banlist = banlist;
		return true;
	}

	forceEnd() {
		if (this.isTournamentStarted) {
			if (this.autoDisqualifyTimer) clearTimeout(this.autoDisqualifyTimer);
			this.inProgressMatches.forEach(match => {
				if (match) {
					delete match.room.tour;
					match.room.addRaw("<div class=\"broadcast-red\"><b>The tournament was forcefully ended.</b><br />You can finish playing, but this battle is no longer considered a tournament battle.</div>");
				}
			});
		} else if (this.autoStartTimer) {
			clearTimeout(this.autoStartTimer);
		}
		for (let i in this.players) {
			this.players[i].destroy();
		}
		this.room.add('|tournament|forceend');
		this.isEnded = true;
	}

	updateFor(targetUser, connection) {
		if (!connection) connection = targetUser;
		if (this.isEnded) return;
		if ((!this.bracketUpdateTimer && this.isBracketInvalidated) || (this.isTournamentStarted && this.isAvailableMatchesInvalidated)) {
			this.room.add(
				"Error: update() called with a target user when data invalidated: " +
				(!this.bracketUpdateTimer && this.isBracketInvalidated) + ", " +
				(this.isTournamentStarted && this.isAvailableMatchesInvalidated) +
				"; Please report this to an admin."
			);
			return;
		}
		let isJoined = targetUser.userid in this.players;
		connection.sendTo(this.room, '|tournament|update|' + JSON.stringify({
			format: this.format,
			generator: this.generator.name,
			isStarted: this.isTournamentStarted,
			isJoined: isJoined,
			bracketData: this.bracketCache,
		}));
		if (this.isTournamentStarted && isJoined) {
			connection.sendTo(this.room, '|tournament|update|' + JSON.stringify({
				challenges: usersToNames(this.availableMatchesCache.challenges.get(this.players[targetUser.userid])),
				challengeBys: usersToNames(this.availableMatchesCache.challengeBys.get(this.players[targetUser.userid])),
			}));

			let pendingChallenge = this.pendingChallenges.get(this.players[targetUser.userid]);
			if (pendingChallenge) {
				if (pendingChallenge.to) {
					connection.sendTo(this.room, '|tournament|update|' + JSON.stringify({challenging: pendingChallenge.to.name}));
				} else if (pendingChallenge.from) {
					connection.sendTo(this.room, '|tournament|update|' + JSON.stringify({challenged: pendingChallenge.from.name}));
				}
			}
		}
		connection.sendTo(this.room, '|tournament|updateEnd');
	}

	update(targetUser) {
		if (targetUser) throw new Error("Please use updateFor() to update the tournament for a specific user.");
		if (this.isEnded) return;
		if (this.isBracketInvalidated) {
			if (Date.now() < this.lastBracketUpdate + BRACKET_MINIMUM_UPDATE_INTERVAL) {
				if (this.bracketUpdateTimer) clearTimeout(this.bracketUpdateTimer);
				this.bracketUpdateTimer = setTimeout(() => {
					this.bracketUpdateTimer = null;
					this.update();
				}, BRACKET_MINIMUM_UPDATE_INTERVAL);
			} else {
				this.lastBracketUpdate = Date.now();

				this.bracketCache = this.getBracketData();
				this.isBracketInvalidated = false;
				this.room.send('|tournament|update|' + JSON.stringify({bracketData: this.bracketCache}));
			}
		}

		if (this.isTournamentStarted && this.isAvailableMatchesInvalidated) {
			this.availableMatchesCache = this.getAvailableMatches();
			this.isAvailableMatchesInvalidated = false;

			this.availableMatchesCache.challenges.forEach((opponents, player) => {
				player.sendRoom('|tournament|update|' + JSON.stringify({challenges: usersToNames(opponents)}));
			});
			this.availableMatchesCache.challengeBys.forEach((opponents, player) => {
				player.sendRoom('|tournament|update|' + JSON.stringify({challengeBys: usersToNames(opponents)}));
			});
		}
		this.room.send('|tournament|updateEnd');
	}

	removeBannedUser(user) {
		if (!(user.userid in this.players)) return;
		if (this.isTournamentStarted) {
			if (!this.disqualifiedUsers.get(this.players[user.userid])) {
				this.disqualifyUser(user.userid, user, null);
			}
		} else {
			this.removeUser(user);
		}
		this.room.update();
	}

	addUser(user, isAllowAlts, output) {
		if (!user.named) {
			output.sendReply('|tournament|error|UserNotNamed');
			return;
		}

		if (user.userid in this.players) {
			output.sendReply('|tournament|error|UserAlreadyAdded');
			return;
		}

		if (this.playerCap && this.playerCount >= this.playerCap) {
			output.sendReply('|tournament|error|Full');
			return;
		}

		let gameCount = user.games.size;
		if (gameCount > 4) {
			output.errorReply("Due to high load, you are limited to 4 games at the same time.");
			return;
		}

		if (!isAllowAlts) {
			let users = this.generator.getUsers();
			for (let i = 0; i < users.length; i++) {
				let otherUser = Users.get(users[i].userid);
				if (otherUser && otherUser.latestIp === user.latestIp) {
					output.sendReply('|tournament|error|AltUserAlreadyAdded');
					return;
				}
			}
		}

		let player = new Rooms.RoomGamePlayer(user, this);
		let error = this.generator.addUser(player);
		if (typeof error === 'string') {
			output.sendReply('|tournament|error|' + error);
			player.destroy();
			return;
		}

		this.players[user.userid] = player;
		this.playerCount++;
		this.room.add('|tournament|join|' + user.name);
		user.sendTo(this.room, '|tournament|update|{"isJoined":true}');
		this.isBracketInvalidated = true;
		this.update();
		if (this.playerCount === this.playerCap) {
			if (this.autostartcap === true) {
				this.startTournament(output);
			} else {
				this.room.add("The tournament is now full.");
			}
		}
	}
	removeUser(user, output) {
		if (!(user.userid in this.players)) {
			output.sendReply('|tournament|error|UserNotAdded');
			return;
		}

		let error = this.generator.removeUser(this.players[user.userid]);
		if (typeof error === 'string') {
			output.sendReply('|tournament|error|' + error);
			return;
		}
		this.players[user.userid].destroy();
		delete this.players[user.userid];
		this.playerCount--;
		this.room.add('|tournament|leave|' + user.name);
		user.sendTo(this.room, '|tournament|update|{"isJoined":false}');
		this.isBracketInvalidated = true;
		this.update();
	}
	replaceUser(user, replacementUser, output) {
		if (!(user.userid in this.players)) {
			output.sendReply('|tournament|error|UserNotAdded');
			return;
		}

		if (replacementUser.userid in this.players) {
			output.sendReply('|tournament|error|UserAlreadyAdded');
			return;
		}

		let player = new Rooms.RoomGamePlayer(replacementUser, this);
		this.generator.replaceUser(this.players[user.userid], player);
		this.players[user.userid].destroy();
		delete this.players[user.userid];
		this.players[replacementUser.userid] = player;

		this.room.add('|tournament|replace|' + user.name + '|' + replacementUser.name);
		user.sendTo(this.room, '|tournament|update|{"isJoined":false}');
		replacementUser.sendTo(this.room, '|tournament|update|{"isJoined":true}');
		this.isBracketInvalidated = true;
		this.update();
	}

	getBracketData() {
		let data = this.generator.getBracketData();
		if (data.type === 'tree') {
			if (!data.rootNode) {
				data.users = usersToNames(this.generator.getUsers().sort());
				return data;
			}
			let queue = [data.rootNode];
			while (queue.length > 0) {
				let node = queue.shift();

				if (node.state === 'available') {
					let pendingChallenge = this.pendingChallenges.get(node.children[0].team);
					if (pendingChallenge && node.children[1].team === pendingChallenge.to) {
						node.state = 'challenging';
					}

					let inProgressMatch = this.inProgressMatches.get(node.children[0].team);
					if (inProgressMatch && node.children[1].team === inProgressMatch.to) {
						node.state = 'inprogress';
						node.room = inProgressMatch.room.id;
					}
				}

				if (node.team) node.team = node.team.name;

				node.children.forEach(child => {
					queue.push(child);
				});
			}
		} else if (data.type === 'table') {
			if (this.isTournamentStarted) {
				data.tableContents.forEach((row, r) => {
					let pendingChallenge = this.pendingChallenges.get(data.tableHeaders.rows[r]);
					let inProgressMatch = this.inProgressMatches.get(data.tableHeaders.rows[r]);
					if (pendingChallenge || inProgressMatch) {
						row.forEach((cell, c) => {
							if (!cell) return;

							if (pendingChallenge && data.tableHeaders.cols[c] === pendingChallenge.to) {
								cell.state = 'challenging';
							}

							if (inProgressMatch && data.tableHeaders.cols[c] === inProgressMatch.to) {
								cell.state = 'inprogress';
								cell.room = inProgressMatch.room.id;
							}
						});
					}
				});
			}
			data.tableHeaders.cols = usersToNames(data.tableHeaders.cols);
			data.tableHeaders.rows = usersToNames(data.tableHeaders.rows);
		}
		return data;
	}

	startTournament(output) {
		if (this.isTournamentStarted) {
			output.sendReply('|tournament|error|AlreadyStarted');
			return false;
		}

		let users = this.generator.getUsers();
		if (users.length < 2) {
			output.sendReply('|tournament|error|NotEnoughUsers');
			return false;
		}

		if (this.generator.generateBracket) this.generator.generateBracket();
		this.generator.freezeBracket();

		this.availableMatches = new Map();
		this.inProgressMatches = new Map();
		this.pendingChallenges = new Map();
		this.disqualifiedUsers = new Map();
		this.autoDisqualifyWarnings = new Map();
		this.lastActionTimes = new Map();
		let now = Date.now();
		users.forEach(user => {
			this.availableMatches.set(user, new Map());
			this.inProgressMatches.set(user, null);
			this.pendingChallenges.set(user, null);
			this.disqualifiedUsers.set(user, false);
			this.lastActionTimes.set(user, now);
		});

		this.isTournamentStarted = true;
		if (this.autoStartTimer) clearTimeout(this.autoStartTimer);
		if (this.autoDisqualifyTimeout !== Infinity) this.autoDisqualifyTimer = setTimeout(() => this.runAutoDisqualify(), this.autoDisqualifyTimeout);
		this.isBracketInvalidated = true;
		this.room.add('|tournament|start');
		this.room.send('|tournament|update|{"isStarted":true}');
		this.update();
		return true;
	}
	getAvailableMatches() {
		let matches = this.generator.getAvailableMatches();
		if (typeof matches === 'string') {
			this.room.add("Unexpected error from getAvailableMatches(): " + matches + ". Please report this to an admin.");
			return;
		}

		let users = this.generator.getUsers();
		let challenges = new Map();
		let challengeBys = new Map();
		let oldAvailableMatches = new Map();

		users.forEach(user => {
			challenges.set(user, []);
			challengeBys.set(user, []);

			let oldAvailableMatch = false;
			let availableMatches = this.availableMatches.get(user);
			if (availableMatches.size) {
				oldAvailableMatch = true;
				availableMatches.clear();
			}
			oldAvailableMatches.set(user, oldAvailableMatch);
		});

		matches.forEach(match => {
			challenges.get(match[0]).push(match[1]);
			challengeBys.get(match[1]).push(match[0]);

			this.availableMatches.get(match[0]).set(match[1], true);
		});

		let now = Date.now();
		this.availableMatches.forEach((availableMatches, user) => {
			if (oldAvailableMatches.get(user)) return;

			if (availableMatches.size && !this.autoDisqualifyWarnings.has(user)) this.lastActionTimes.set(user, now);
		});

		return {
			challenges: challenges,
			challengeBys: challengeBys,
		};
	}

	disqualifyUser(userid, output, reason) {
		let user = Users.get(userid);
		let sendReply;
		if (output) {
			sendReply = msg => output.sendReply(msg);
		} else if (user) {
			sendReply = msg => user.sendTo(this.id, msg);
		} else {
			sendReply = () => {};
		}
		if (!this.isTournamentStarted) {
			sendReply('|tournament|error|NotStarted');
			return false;
		}

		if (!(userid in this.players)) {
			sendReply('|tournament|error|UserNotAdded|' + userid);
			return false;
		}

		let player = this.players[userid];
		if (this.disqualifiedUsers.get(player)) {
			sendReply('|tournament|error|AlreadyDisqualified|' + userid);
			return false;
		}

		let error = this.generator.disqualifyUser(player);
		if (error) {
			sendReply('|tournament|error|' + error);
			return false;
		}

		this.disqualifiedUsers.set(player, true);
		this.generator.setUserBusy(player, false);

		let challenge = this.pendingChallenges.get(player);
		if (challenge) {
			this.pendingChallenges.set(player, null);
			if (challenge.to) {
				this.generator.setUserBusy(challenge.to, false);
				this.pendingChallenges.set(challenge.to, null);
				challenge.to.sendRoom('|tournament|update|{"challenged":null}');
			} else if (challenge.from) {
				this.generator.setUserBusy(challenge.from, false);
				this.pendingChallenges.set(challenge.from, null);
				challenge.from.sendRoom('|tournament|update|{"challenging":null}');
			}
		}

		let matchFrom = this.inProgressMatches.get(player);
		if (matchFrom) {
			this.generator.setUserBusy(matchFrom.to, false);
			this.inProgressMatches.set(player, null);
			delete matchFrom.room.tour;
			if (matchFrom.room.battle) matchFrom.room.battle.forfeit(player.userid);
		}

		let matchTo = null;
		this.inProgressMatches.forEach((match, playerFrom) => {
			if (match && match.to === player) matchTo = playerFrom;
		});
		if (matchTo) {
			this.generator.setUserBusy(matchTo, false);
			let matchRoom = this.inProgressMatches.get(matchTo).room;
			delete matchRoom.tour;
			if (matchRoom.battle) matchRoom.battle.forfeit(player.userid);
			this.inProgressMatches.set(matchTo, null);
		}

		this.room.add('|tournament|disqualify|' + player.name);
		if (user) {
			user.sendTo(this.room, '|tournament|update|{"isJoined":false}');
			if (reason !== null) user.popup("|modal|You have been disqualified from the tournament in " + this.room.title + (reason ? ":\n\n" + reason : "."));
		}
		this.isBracketInvalidated = true;
		this.isAvailableMatchesInvalidated = true;

		if (this.generator.isTournamentEnded()) {
			this.onTournamentEnd();
		} else {
			this.update();
		}

		return true;
	}

	setAutoStartTimeout(timeout, output) {
		if (this.isTournamentStarted) {
			output.sendReply('|tournament|error|AlreadyStarted');
			return false;
		}
		timeout = parseFloat(timeout);
		if (timeout < AUTO_START_MINIMUM_TIMEOUT || isNaN(timeout)) {
			output.sendReply('|tournament|error|InvalidAutoStartTimeout');
			return false;
		}

		if (this.autoStartTimer) clearTimeout(this.autoStartTimer);
		if (timeout === Infinity) {
			this.room.add('|tournament|autostart|off');
		} else {
			this.autoStartTimer = setTimeout(() => this.startTournament(output), timeout);
			this.room.add('|tournament|autostart|on|' + timeout);
		}
		this.autoStartTimeout = timeout;

		return true;
	}

	setAutoDisqualifyTimeout(timeout, output) {
		if (timeout < AUTO_DISQUALIFY_WARNING_TIMEOUT || isNaN(timeout)) {
			output.sendReply('|tournament|error|InvalidAutoDisqualifyTimeout');
			return false;
		}

		this.autoDisqualifyTimeout = parseFloat(timeout);
		if (this.autoDisqualifyTimeout === Infinity) {
			this.room.add('|tournament|autodq|off');
			if (this.autoDisqualifyTimer) clearTimeout(this.autoDisqualifyTimer);
			if (this.autoDisqualifyWarnings) this.autoDisqualifyWarnings.clear();
		} else {
			this.room.add('|tournament|autodq|on|' + this.autoDisqualifyTimeout);
			if (this.isTournamentStarted) this.runAutoDisqualify();
		}

		return true;
	}
	runAutoDisqualify(output) {
		if (!this.isTournamentStarted) {
			output.sendReply('|tournament|error|NotStarted');
			return false;
		}
		if (this.autoDisqualifyTimer) clearTimeout(this.autoDisqualifyTimer);
		let now = Date.now();
		this.lastActionTimes.forEach((time, player) => {
			let availableMatches = false;
			if (this.availableMatches.get(player).size) availableMatches = true;
			let pendingChallenge = this.pendingChallenges.get(player);

			if (!availableMatches && !pendingChallenge) {
				this.autoDisqualifyWarnings.delete(player);
				return;
			}
			if (pendingChallenge && pendingChallenge.to) return;

			if (now > time + this.autoDisqualifyTimeout && this.autoDisqualifyWarnings.has(player)) {
				let reason;
				if (pendingChallenge && pendingChallenge.from) {
					reason = "You failed to accept your opponent's challenge in time.";
				} else {
					reason = "You failed to challenge your opponent in time.";
				}
				this.disqualifyUser(player.userid, output, reason);
				this.room.update();
			} else if (now > time + this.autoDisqualifyTimeout - AUTO_DISQUALIFY_WARNING_TIMEOUT) {
				if (this.autoDisqualifyWarnings.has(player)) return;
				let remainingTime = this.autoDisqualifyTimeout - now + time;
				if (remainingTime <= 0) {
					remainingTime = AUTO_DISQUALIFY_WARNING_TIMEOUT;
					this.lastActionTimes.set(player, now - this.autoDisqualifyTimeout + AUTO_DISQUALIFY_WARNING_TIMEOUT);
				}

				this.autoDisqualifyWarnings.set(player, true);
				player.sendRoom('|tournament|autodq|target|' + remainingTime);
			} else {
				this.autoDisqualifyWarnings.delete(player);
			}
		});
		if (!this.isEnded) this.autoDisqualifyTimer = setTimeout(() => this.runAutoDisqualify(), this.autoDisqualifyTimeout);
	}

	challenge(user, targetUserid, output) {
		if (!this.isTournamentStarted) {
			output.sendReply('|tournament|error|NotStarted');
			return;
		}

		if (!(user.userid in this.players)) {
			output.sendReply('|tournament|error|UserNotAdded');
			return;
		}

		if (!(targetUserid in this.players)) {
			output.sendReply('|tournament|error|InvalidMatch');
			return;
		}

		let from = this.players[user.userid];
		let to = this.players[targetUserid];
		let availableMatches = this.availableMatches.get(from);
		if (!availableMatches || !availableMatches.get(to)) {
			output.sendReply('|tournament|error|InvalidMatch');
			return;
		}

		if (this.generator.getUserBusy(from) || this.generator.getUserBusy(to)) {
			this.room.add("Tournament backend breaks specifications. Please report this to an admin.");
			return;
		}

		this.generator.setUserBusy(from, true);
		this.generator.setUserBusy(to, true);

		this.isAvailableMatchesInvalidated = true;
		this.update();

		user.prepBattle(this.format, 'tournament', user, this.banlist).then(result => this.finishChallenge(user, to, output, result));
	}
	finishChallenge(user, to, output, result) {
		let from = this.players[user.userid];
		if (!result) {
			this.generator.setUserBusy(from, false);
			this.generator.setUserBusy(to, false);

			this.isAvailableMatchesInvalidated = true;
			this.update();
			return;
		}

		this.lastActionTimes.set(to, Date.now());
		this.pendingChallenges.set(from, {to: to, team: user.team});
		this.pendingChallenges.set(to, {from: from, team: user.team});
		from.sendRoom('|tournament|update|' + JSON.stringify({challenging: to.name}));
		to.sendRoom('|tournament|update|' + JSON.stringify({challenged: from.name}));

		this.isBracketInvalidated = true;
		this.update();
	}
	cancelChallenge(user, output) {
		if (!this.isTournamentStarted) {
			output.sendReply('|tournament|error|NotStarted');
			return;
		}

		if (!(user.userid in this.players)) {
			output.sendReply('|tournament|error|UserNotAdded');
			return;
		}

		let player = this.players[user.userid];
		let challenge = this.pendingChallenges.get(player);
		if (!challenge || challenge.from) return;

		this.generator.setUserBusy(player, false);
		this.generator.setUserBusy(challenge.to, false);
		this.pendingChallenges.set(player, null);
		this.pendingChallenges.set(challenge.to, null);
		user.sendTo(this.room, '|tournament|update|{"challenging":null}');
		challenge.to.sendRoom('|tournament|update|{"challenged":null}');

		this.isBracketInvalidated = true;
		this.isAvailableMatchesInvalidated = true;
		this.update();
	}
	acceptChallenge(user, output) {
		if (!this.isTournamentStarted) {
			output.sendReply('|tournament|error|NotStarted');
			return;
		}

		if (!(user.userid in this.players)) {
			output.sendReply('|tournament|error|UserNotAdded');
			return;
		}

		let player = this.players[user.userid];
		let challenge = this.pendingChallenges.get(player);
		if (!challenge || !challenge.from) return;

		user.prepBattle(this.format, 'tournament', user, this.banlist).then(result => this.finishAcceptChallenge(user, challenge, result));
	}
	finishAcceptChallenge(user, challenge, result) {
		if (!result) return;

		// Prevent battles between offline users from starting
		let from = Users.get(challenge.from.userid);
		if (!from || !from.connected || !user.connected) return;

		// Prevent double accepts and users that have been disqualified while between these two functions
		if (!this.pendingChallenges.get(challenge.from)) return;
		let player = this.players[user.userid];
		if (!this.pendingChallenges.get(player)) return;

		let room = Rooms.global.startBattle(from, user, this.format, challenge.team, user.team, {rated: this.isRated, tour: this});
		if (!room) return;

		this.pendingChallenges.set(challenge.from, null);
		this.pendingChallenges.set(player, null);
		from.sendTo(this.room, '|tournament|update|{"challenging":null}');
		user.sendTo(this.room, '|tournament|update|{"challenged":null}');

		this.inProgressMatches.set(challenge.from, {to: player, room: room});
		this.room.add('|tournament|battlestart|' + from.name + '|' + user.name + '|' + room.id).update();

		this.isBracketInvalidated = true;
		if (this.autoDisqualifyTimeout !== Infinity) this.runAutoDisqualify(this.room);
		if (this.forceTimer) room.requestKickInactive(false);
		this.update();
	}
	forfeit(user) {
		this.disqualifyUser(user.userid, null, "You left the tournament");
	}
	onConnect(user, connection) {
		this.updateFor(user, connection);
	}
	onUpdateConnection(user, connection) {
		this.updateFor(user, connection);
	}
	onRename(user, oldUserid) {
		if (oldUserid in this.players) {
			if (user.userid === oldUserid) {
				this.players[user.userid].name = user.name;
			} else {
				this.players[user.userid] = this.players[oldUserid];
				this.players[user.userid].userid = user.userid;
				this.players[user.userid].name = user.name;
				delete this.players[oldUserid];
			}
		}

		this.updateFor(user);
	}
	onBattleJoin(room, user) {
		if (this.scouting || this.isEnded || user.latestIp === room.p1.latestIp || user.latestIp === room.p2.latestIp) return;
		let users = this.generator.getUsers(true);
		for (let i = 0; i < users.length; i++) {
			let otherUser = Users.get(users[i].userid);
			if (otherUser && otherUser.latestIp === user.latestIp) {
				return "Scouting is banned: tournament players can't watch other tournament battles.";
			}
		}
	}
	onBattleWin(room, winnerid) {
		let from = this.players[room.p1.userid];
		let to = this.players[room.p2.userid];
		let winner = this.players[winnerid];
		let score = room.battle.score || [0, 0];

		let result = 'draw';
		if (from === winner) {
			result = 'win';
		} else if (to === winner) {
			result = 'loss';
		}

		if (result === 'draw' && !this.generator.isDrawingSupported) {
			this.room.add('|tournament|battleend|' + from.name + '|' + to.name + '|' + result + '|' + score.join(',') + '|fail|' + room.id);

			this.generator.setUserBusy(from, false);
			this.generator.setUserBusy(to, false);
			this.inProgressMatches.set(from, null);

			this.isBracketInvalidated = true;
			this.isAvailableMatchesInvalidated = true;

			if (this.autoDisqualifyTimeout !== Infinity) this.runAutoDisqualify();
			this.update();
			return this.room.update();
		}

		let error = this.generator.setMatchResult([from, to], result, score);
		if (error) {
			// Should never happen
			return this.room.add("Unexpected " + error + " from setMatchResult([" + room.p1.userid + ", " + room.p2.userid + "], " + result + ", " + score + ") in onBattleWin(" + room.id + ", " + winnerid + "). Please report this to an admin.").update();
		}

		this.room.add('|tournament|battleend|' + from.name + '|' + to.name + '|' + result + '|' + score.join(',') + '|success|' + room.id);

		this.generator.setUserBusy(from, false);
		this.generator.setUserBusy(to, false);
		this.inProgressMatches.set(from, null);

		this.isBracketInvalidated = true;
		this.isAvailableMatchesInvalidated = true;

		if (this.generator.isTournamentEnded()) {
			this.onTournamentEnd();
		} else {
			if (this.autoDisqualifyTimeout !== Infinity) this.runAutoDisqualify();
			this.update();
		}
		this.room.update();
	}
	onTournamentEnd() {
		this.room.add('|tournament|end|' + JSON.stringify({
			results: this.generator.getResults().map(usersToNames),
			format: this.format,
			generator: this.generator.name,
			bracketData: this.getBracketData(),
		}));
		this.isEnded = true;
		if (this.autoDisqualifyTimer) clearTimeout(this.autoDisqualifyTimer);
		delete exports.tournaments[this.room.id];
		delete this.room.game;
		for (let i in this.players) {
			this.players[i].destroy();
		}
	}
}

function createTournamentGenerator(generator, args, output) {
	let Generator = TournamentGenerators[toId(generator)];
	if (!Generator) {
		output.errorReply(generator + " is not a valid type.");
		output.errorReply("Valid types: " + Object.keys(TournamentGenerators).join(", "));
		return;
	}
	args.unshift(null);
	return new (Generator.bind.apply(Generator, args))();
}
function createTournament(room, format, generator, playerCap, isRated, args, output) {
	if (room.type !== 'chat') {
		output.errorReply("Tournaments can only be created in chat rooms.");
		return;
	}
	if (room.game) {
		output.errorReply("You cannot have a tournament until the current room activity is over: " + room.game.title);
		return;
	}
	if (Rooms.global.lockdown) {
		output.errorReply("The server is restarting soon, so a tournament cannot be created.");
		return;
	}
	format = Tools.getFormat(format);
	if (format.effectType !== 'Format' || !format.tournamentShow) {
		output.errorReply(format.id + " is not a valid tournament format.");
		output.errorReply("Valid formats: " + Object.values(Tools.data.Formats).filter(f => f.effectType === 'Format' && f.tournamentShow).map(format => format.name).join(", "));
		return;
	}
	if (!TournamentGenerators[toId(generator)]) {
		output.errorReply(generator + " is not a valid type.");
		output.errorReply("Valid types: " + Object.keys(TournamentGenerators).join(", "));
		return;
	}
	if (playerCap && playerCap < 2) {
		output.errorReply("You cannot have a player cap that is less than 2.");
		return;
	}
	room.game = exports.tournaments[room.id] = new Tournament(room, format, createTournamentGenerator(generator, args, output), playerCap, isRated);
	return room.game;
}
function deleteTournament(id, output) {
	let tournament = exports.tournaments[id];
	if (!tournament) {
		output.errorReply(id + " doesn't exist.");
		return false;
	}
	tournament.forceEnd(output);
	delete exports.tournaments[id];
	let room = Rooms(id);
	if (room) delete room.game;
	return true;
}
function getTournament(id, output) {
	if (exports.tournaments[id]) {
		return exports.tournaments[id];
	}
}

let commands = {
	basic: {
		j: 'join',
		in: 'join',
		join: function (tournament, user) {
			tournament.addUser(user, false, this);
		},
		l: 'leave',
		out: 'leave',
		leave: function (tournament, user) {
			if (tournament.isTournamentStarted) {
				if (tournament.generator.getUsers(true).some(player => player.userid === user.userid)) {
					tournament.disqualifyUser(user.userid, this);
				} else {
					this.errorReply("You have already been eliminated from this tournament.");
				}
			} else {
				tournament.removeUser(user, this);
			}
		},
		getusers: function (tournament) {
			if (!this.runBroadcast()) return;
			let users = usersToNames(tournament.generator.getUsers(true).sort());
			this.sendReplyBox("<strong>" + users.length + " users remain in this tournament:</strong><br />" + Chat.escapeHTML(users.join(", ")));
		},
		getupdate: function (tournament, user) {
			tournament.updateFor(user);
			this.sendReply("Your tournament bracket has been updated.");
		},
		challenge: function (tournament, user, params, cmd) {
			if (params.length < 1) {
				return this.sendReply("Usage: " + cmd + " <user>");
			}
			tournament.challenge(user, toId(params[0]), this);
		},
		cancelchallenge: function (tournament, user) {
			tournament.cancelChallenge(user, this);
		},
		acceptchallenge: function (tournament, user) {
			tournament.acceptChallenge(user, this);
		},
		viewbanlist: function (tournament) {
			if (!this.runBroadcast()) return;
			if (tournament.banlist.length < 1) {
				return this.errorReply("The tournament's banlist is empty.");
			}
			this.sendReplyBox("<b>This tournament's banlist:</b><br />" + Chat.escapeHTML(tournament.banlist.join(', ')));
		},
	},
	creation: {
		settype: function (tournament, user, params, cmd) {
			if (params.length < 1) {
				return this.sendReply("Usage: " + cmd + " <type> [, <comma-separated arguments>]");
			}
			let playerCap = parseInt(params.splice(1, 1));
			let generator = createTournamentGenerator(params.shift(), params, this);
			if (generator && tournament.setGenerator(generator, this)) {
				if (playerCap && playerCap >= 2) {
					tournament.playerCap = playerCap;
					if (Config.tournamentDefaultPlayerCap && tournament.playerCap > Config.tournamentDefaultPlayerCap) {
						Monitor.log('[TourMonitor] Room ' + tournament.room.id + ' starting a tour over default cap (' + tournament.playerCap + ')');
					}
				} else if (tournament.playerCap && !playerCap) {
					tournament.playerCap = 0;
				}
				const capNote = (tournament.playerCap ? " with a player cap of " + tournament.playerCap : "");
				this.privateModCommand("(" + user.name + " set tournament type to " + generator.name + capNote + ".)");
				this.sendReply("Tournament set to " + generator.name + capNote + ".");
			}
		},
		end: 'delete',
		stop: 'delete',
		delete: function (tournament, user) {
			if (deleteTournament(tournament.room.id, this)) {
				this.privateModCommand("(" + user.name + " forcibly ended a tournament.)");
			}
		},
		banlist: function (tournament, user, params, cmd) {
			if (params.length < 1) {
				return this.sendReply("Usage: " + cmd + " <comma-separated arguments>");
			}
			if (tournament.isTournamentStarted) {
				return this.errorReply("The banlist cannot be changed once the tournament has started.");
			}
			if (tournament.setBanlist(params, this)) {
				const banlist = tournament.banlist.join(', ');
				this.room.addRaw("<b>The tournament's banlist is now:</b> " + Chat.escapeHTML(banlist) + ".");
				this.privateModCommand("(" + user.name + " set the tournament's banlist to " + banlist + ".)");
			}
		},
		clearbanlist: function (tournament, user) {
			if (tournament.isTournamentStarted) {
				return this.errorReply("The banlist cannot be changed once the tournament has started.");
			}
			if (tournament.banlist.length < 1) {
				return this.errorReply("The tournament's banlist is already empty.");
			}
			tournament.banlist = [];
			this.room.addRaw("<b>The tournament's banlist was cleared.</b>");
			this.privateModCommand("(" + user.name + " cleared the tournament's banlist.)");
		},
	},
	moderation: {
		begin: 'start',
		start: function (tournament, user) {
			if (tournament.startTournament(this)) {
				this.room.sendModCommand("(" + user.name + " started the tournament.)");
			}
		},
		dq: 'disqualify',
		disqualify: function (tournament, user, params, cmd) {
			if (params.length < 1) {
				return this.sendReply("Usage: " + cmd + " <user>");
			}
			let targetUser = Users.get(params[0]) || params[0];
			let targetUserid = toId(targetUser);
			let reason = '';
			if (params[1]) {
				reason = params[1].trim();
				if (reason.length > MAX_REASON_LENGTH) return this.errorReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
			}
			if (tournament.disqualifyUser(targetUserid, this, reason)) {
				this.privateModCommand("(" + (targetUser.name || targetUserid) + " was disqualified from the tournament by " + user.name + (reason ? " (" + reason + ")" : "") + ")");
			}
		},
		autostart: 'setautostart',
		setautostart: function (tournament, user, params, cmd) {
			if (params.length < 1) {
				return this.sendReply("Usage: " + cmd + " <on|minutes|off>");
			}
			let option = params[0].toLowerCase();
			if (option === 'on' || option === 'true' || option === 'start') {
				if (tournament.isTournamentStarted) {
					return this.errorReply("The tournament has already started.");
				} else if (!tournament.playerCap) {
					return this.errorReply("The tournament does not have a player cap set.");
				} else {
					if (tournament.autostartcap) return this.errorReply("The tournament is already set to autostart when the player cap is reached.");
					tournament.autostartcap = true;
					this.room.add("The tournament will start once " + tournament.playerCap + " players have joined.");
					this.privateModCommand("(The tournament was set to autostart when the player cap is reached by " + user.name + ")");
				}
			} else {
				if (option === '0' || option === 'infinity' || option === 'off' || option === 'false' || option === 'stop' || option === 'remove') {
					if (!tournament.autostartcap && tournament.autoStartTimeout === Infinity) return this.errorReply("The automatic tournament start timer is already off.");
					params[0] = 'off';
					tournament.autostartcap = false;
				}
				let timeout = params[0].toLowerCase() === 'off' ? Infinity : params[0];
				if (tournament.setAutoStartTimeout(timeout * 60 * 1000, this)) {
					this.privateModCommand("(The tournament auto start timer was set to " + params[0] + " by " + user.name + ")");
				}
			}
		},
		autodq: 'setautodq',
		setautodq: function (tournament, user, params, cmd) {
			if (params.length < 1) {
				if (tournament.autoDisqualifyTimeout !== Infinity) {
					return this.sendReply("Usage: " + cmd + " <minutes|off>; The current automatic disqualify timer is set to " + (tournament.autoDisqualifyTimeout / 1000 / 60) + " minute(s)");
				} else {
					return this.sendReply("Usage: " + cmd + " <minutes|off>");
				}
			}
			if (params[0].toLowerCase() === 'infinity' || params[0] === '0') params[0] = 'off';
			let timeout = params[0].toLowerCase() === 'off' ? Infinity : params[0] * 60 * 1000;
			if (timeout === tournament.autoDisqualifyTimeout) return this.errorReply("The automatic tournament disqualify timer is already set to " + params[0] + " minute(s).");
			if (tournament.setAutoDisqualifyTimeout(timeout, this)) {
				this.privateModCommand("(The tournament auto disqualify timer was set to " + params[0] + " by " + user.name + ")");
			}
		},
		runautodq: function (tournament, user) {
			if (tournament.autoDisqualifyTimeout === Infinity) return this.errorReply("The automatic tournament disqualify timer is not set.");
			tournament.runAutoDisqualify(this);
			this.logEntry(user.name + " used /tour runautodq");
		},
		scout: 'setscouting',
		scouting: 'setscouting',
		setscout: 'setscouting',
		setscouting: function (tournament, user, params, cmd) {
			if (params.length < 1) {
				if (tournament.scouting) {
					return this.sendReply("This tournament allows spectating other battles while in a tournament.");
				} else {
					return this.sendReply("This tournament disallows spectating other battles while in a tournament.");
				}
			}

			let option = params[0].toLowerCase();
			if (option === 'on' || option === 'true' || option === 'allow' || option === 'allowed') {
				if (tournament.scouting) return this.errorReply("Scouting for this tournament is already set to allowed.");
				tournament.scouting = true;
				tournament.modjoin = false;
				this.room.add('|tournament|scouting|allow');
				this.privateModCommand("(The tournament was set to allow scouting by " + user.name + ")");
			} else if (option === 'off' || option === 'false' || option === 'disallow' || option === 'disallowed') {
				if (!tournament.scouting) return this.errorReply("Scouting for this tournament is already disabled.");
				tournament.scouting = false;
				tournament.modjoin = true;
				this.room.add('|tournament|scouting|disallow');
				this.privateModCommand("(The tournament was set to disallow scouting by " + user.name + ")");
			} else {
				return this.sendReply("Usage: " + cmd + " <allow|disallow>");
			}
		},
		modjoin: 'setmodjoin',
		setmodjoin: function (tournament, user, params, cmd) {
			if (params.length < 1) {
				if (tournament.modjoin) {
					return this.sendReply("This tournament allows players to modjoin their battles.");
				} else {
					return this.sendReply("This tournament does not allow players to modjoin their battles.");
				}
			}

			let option = params[0].toLowerCase();
			if (option === 'on' || option === 'true' || option === 'allow' || option === 'allowed') {
				if (tournament.modjoin) return this.errorReply("Modjoining is already allowed for this tournament.");
				tournament.modjoin = true;
				this.room.add('Modjoining is now allowed (Players can modjoin their tournament battles).');
				this.privateModCommand("(The tournament was set to allow modjoin by " + user.name + ")");
			} else if (option === 'off' || option === 'false' || option === 'disallow' || option === 'disallowed') {
				if (!tournament.modjoin) return this.errorReply("Modjoining is already not allowed for this tournament.");
				tournament.modjoin = false;
				this.room.add('Modjoining is now banned (Players cannot modjoin their tournament battles).');
				this.privateModCommand("(The tournament was set to disallow modjoin by " + user.name + ")");
			} else {
				return this.sendReply("Usage: " + cmd + " <allow|disallow>");
			}
		},
		forcetimer: function (tournament, user, params, cmd) {
			let option = params.length ? params[0].toLowerCase() : 'on';
			if (option === 'on' || option === 'true') {
				tournament.forceTimer = true;
				this.room.add('Forcetimer is now on for the tournament.');
				this.privateModCommand("(The timer was turned on for the tournament by " + user.name + ")");
			} else if (option === 'off' || option === 'false' || option === 'stop') {
				tournament.forceTimer = false;
				this.room.add('Forcetimer is now off for the tournament.');
				this.privateModCommand("(The timer was turned off for the tournament by " + user.name + ")");
			} else {
				return this.sendReply("Usage: " + cmd + " <on|off>");
			}
		},
	},
};

Chat.loadCommands();
Chat.commands.tour = 'tournament';
Chat.commands.tours = 'tournament';
Chat.commands.tournaments = 'tournament';
Chat.commands.tournament = function (paramString, room, user) {
	let cmdParts = paramString.split(' ');
	let cmd = cmdParts.shift().trim().toLowerCase();
	let params = cmdParts.join(' ').split(',').map(param => param.trim());
	if (!params[0]) params = [];

	if (cmd === '') {
		if (!this.runBroadcast()) return;
		this.sendReply('|tournaments|info|' + JSON.stringify(Object.keys(exports.tournaments).filter(tournament => {
			tournament = exports.tournaments[tournament];
			return !tournament.room.isPrivate && !tournament.room.isPersonal && !tournament.room.staffRoom;
		}).map(tournament => {
			tournament = exports.tournaments[tournament];
			return {room: tournament.room.id, title: tournament.room.title, format: tournament.format, generator: tournament.generator.name, isStarted: tournament.isTournamentStarted};
		})));
	} else if (cmd === 'help') {
		return this.parse('/help tournament');
	} else if (cmd === 'on' || cmd === 'enable') {
		if (!this.can('tournamentsmanagement', null, room)) return;
		let rank = params[0];
		if (rank && rank === '@') {
			if (room.toursEnabled === true) return this.errorReply("Tournaments are already enabled for @ and above in this room.");
			room.toursEnabled = true;
			if (room.chatRoomData) {
				room.chatRoomData.toursEnabled = true;
				Rooms.global.writeChatRoomData();
			}
			return this.sendReply("Tournaments are now enabled for @ and up.");
		} else if (rank && rank === '%') {
			if (room.toursEnabled === rank) return this.errorReply("Tournaments are already enabled for % and above in this room.");
			room.toursEnabled = rank;
			if (room.chatRoomData) {
				room.chatRoomData.toursEnabled = rank;
				Rooms.global.writeChatRoomData();
			}
			return this.sendReply("Tournaments are now enabled for % and up.");
		} else {
			return this.errorReply("Tournament enable setting not recognized.  Valid options include [%|@].");
		}
	} else if (cmd === 'off' || cmd === 'disable') {
		if (!this.can('tournamentsmanagement', null, room)) return;
		if (!room.toursEnabled) {
			return this.errorReply("Tournaments are already disabled.");
		}
		delete room.toursEnabled;
		if (room.chatRoomData) {
			delete room.chatRoomData.toursEnabled;
			Rooms.global.writeChatRoomData();
		}
		return this.sendReply("Tournaments are now disabled.");
	} else if (cmd === 'announce' || cmd === 'announcements') {
		if (!this.can('tournamentsmanagement', null, room)) return;
		if (!Config.tourannouncements.includes(room.id)) {
			return this.errorReply("Tournaments in this room cannot be announced.");
		}
		if (params.length < 1) {
			if (room.tourAnnouncements) {
				return this.sendReply("Tournament announcements are enabled.");
			} else {
				return this.sendReply("Tournament announcements are disabled.");
			}
		}

		let option = params[0].toLowerCase();
		if (option === 'on' || option === 'enable') {
			if (room.tourAnnouncements) return this.errorReply("Tournament announcements are already enabled.");
			room.tourAnnouncements = true;
			this.privateModCommand("(Tournament announcements were enabled by " + user.name + ")");
		} else if (option === 'off' || option === 'disable') {
			if (!room.tourAnnouncements) return this.errorReply("Tournament announcements are already disabled.");
			room.tourAnnouncements = false;
			this.privateModCommand("(Tournament announcements were disabled by " + user.name + ")");
		} else {
			return this.sendReply("Usage: " + cmd + " <on|off>");
		}

		if (room.chatRoomData) {
			room.chatRoomData.tourAnnouncements = room.tourAnnouncements;
			Rooms.global.writeChatRoomData();
		}
	} else if (cmd === 'create' || cmd === 'new') {
		if (room.toursEnabled === true) {
			if (!this.can('tournaments', null, room)) return;
		} else if (room.toursEnabled === '%') {
			if (!this.can('tournamentsmoderation', null, room)) return;
		} else {
			if (!user.can('tournamentsmanagement', null, room)) {
				return this.errorReply("Tournaments are disabled in this room (" + room.id + ").");
			}
		}
		if (params.length < 2) {
			return this.sendReply("Usage: " + cmd + " <format>, <type> [, <comma-separated arguments>]");
		}

		let tour = createTournament(room, params.shift(), params.shift(), params.shift(), Config.istournamentsrated, params, this);
		if (tour) {
			this.privateModCommand("(" + user.name + " created a tournament in " + tour.format + " format.)");
			if (room.tourAnnouncements) {
				let tourRoom = Rooms.search(Config.tourroom || 'tournaments');
				if (tourRoom && tourRoom !== room) tourRoom.addRaw('<div class="infobox"><a href="/' + room.id + '" class="ilink"><strong>' + Chat.escapeHTML(Tools.getFormat(tour.format).name) + '</strong> tournament created in <strong>' + Chat.escapeHTML(room.title) + '</strong>.</a></div>').update();
			}
		}
	} else {
		let tournament = getTournament(room.id);
		if (!tournament) {
			return this.sendReply("There is currently no tournament running in this room.");
		}

		let commandHandler = null;
		if (commands.basic[cmd]) {
			commandHandler = typeof commands.basic[cmd] === 'string' ? commands.basic[commands.basic[cmd]] : commands.basic[cmd];
		}

		if (commands.creation[cmd]) {
			if (room.toursEnabled === true) {
				if (!this.can('tournaments', null, room)) return;
			} else if (room.toursEnabled === '%') {
				if (!this.can('tournamentsmoderation', null, room)) return;
			} else {
				if (!user.can('tournamentsmanagement', null, room)) {
					return this.errorReply("Tournaments are disabled in this room (" + room.id + ").");
				}
			}
			commandHandler = typeof commands.creation[cmd] === 'string' ? commands.creation[commands.creation[cmd]] : commands.creation[cmd];
		}

		if (commands.moderation[cmd]) {
			if (!user.can('tournamentsmoderation', null, room)) {
				return this.errorReply(cmd + " -  Access denied.");
			}
			commandHandler = typeof commands.moderation[cmd] === 'string' ? commands.moderation[commands.moderation[cmd]] : commands.moderation[cmd];
		}

		if (!commandHandler) {
			this.errorReply(cmd + " is not a tournament command.");
		} else {
			commandHandler.call(this, tournament, user, params, cmd);
		}
	}
};
Chat.commands.tournamenthelp = function (target, room, user) {
	if (!this.runBroadcast()) return;
	return this.sendReplyBox(
		"- create/new &lt;format>, &lt;type> [, &lt;comma-separated arguments>]: Creates a new tournament in the current room.<br />" +
		"- settype &lt;type> [, &lt;comma-separated arguments>]: Modifies the type of tournament after it's been created, but before it has started.<br />" +
		"- banlist &lt;comma-separated arguments>: Sets the supplementary banlist for the tournament before it has started.<br />" +
		"- viewbanlist: Shows the supplementary banlist for the tournament.<br />" +
		"- clearbanlist: Clears the supplementary banlist for the tournament before it has started.<br />" +
		"- end/stop/delete: Forcibly ends the tournament in the current room.<br />" +
		"- begin/start: Starts the tournament in the current room.<br />" +
		"- autostart/setautostart &lt;on|minutes|off>: Sets the automatic start timeout.<br />" +
		"- dq/disqualify &lt;user>: Disqualifies a user.<br />" +
		"- autodq/setautodq &lt;minutes|off>: Sets the automatic disqualification timeout.<br />" +
		"- runautodq: Manually run the automatic disqualifier.<br />" +
		"- scouting &lt;allow|disallow>: Specifies whether joining tournament matches while in a tournament is allowed.<br />" +
		"- modjoin &lt;allow|disallow>: Specifies whether players can modjoin their battles.<br />" +
		"- forcetimer &lt;on|off>: Turn on the timer for tournament battles.<br />" +
		"- getusers: Lists the users in the current tournament.<br />" +
		"- on/enable &lt;%|@>: Enables allowing drivers or mods to start tournaments in the current room.<br />" +
		"- off/disable: Disables allowing drivers and mods to start tournaments in the current room.<br />" +
		"- announce/announcements &lt;on|off>: Enables/disables tournament announcements for the current room.<br />" +
		"More detailed help can be found <a href=\"https://www.smogon.com/forums/threads/3570628/#post-6777489\">here</a>"
	);
};

exports.Tournament = Tournament;
exports.TournamentGenerators = TournamentGenerators;

exports.createTournament = createTournament;
exports.deleteTournament = deleteTournament;
exports.get = getTournament;

exports.commands = commands;
