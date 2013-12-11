require('es6-shim');

var TournamentGenerators = {
	roundrobin: require('./generator-round-robin.js').RoundRobin,
	elimination: require('./generator-elimination.js').Elimination
};

var tournaments = {};

function usersToNames(users) {
	return users.map(function (user) { return user.name; });
}

function createTournamentGenerator(generator, args, output) {
	var Generator = TournamentGenerators[toId(generator)];
	if (!Generator) {
		output.sendReply(generator + " is not a valid type.");
		output.sendReply("Valid types: " + Object.keys(TournamentGenerators).join(", "));
		return;
	}
	args.unshift(null);
	return new (Generator.bind.apply(Generator, args));
}
function createTournament(room, format, generator, args, output) {
	if (room.type !== 'chat') {
		output.sendReply("Tournaments can only be created in chat rooms.");
		return;
	}
	if (tournaments[room.id]) {
		output.sendReply("A tournament is already running in the room.");
		return;
	}
	if (Tools.getFormat(format).effectType !== 'Format') {
		output.sendReply(format + " is not a valid format.");
		output.sendReply("Valid formats: " + Object.keys(Tools.data.Formats).filter(function (f) { return Tools.data.Formats[f].effectType === 'Format'; }).join(", "));
		return;
	}
	if (!TournamentGenerators[toId(generator)]) {
		output.sendReply(generator + " is not a valid type.");
		output.sendReply("Valid types: " + Object.keys(TournamentGenerators).join(", "));
		return;
	}
	return tournaments[room.id] = new Tournament(room, format, createTournamentGenerator(generator, args, output));
}
function deleteTournament(name, output) {
	var id = toId(name);
	var tournament = tournaments[id];
	if (!tournament)
		output.sendReply(name + " doesn't exist.");
	tournament.forceEnd(output);
	delete tournaments[id];
}
function getTournament(name, output) {
	var id = toId(name);
	if (tournaments[id])
		return tournaments[id];
}

var Tournament = (function () {
	function Tournament(room, format, generator) {
		this.room = room;
		this.format = toId(format);
		this.generator = generator;

		this.isBracketInvalidated = true;
		this.bracketCache = null;

		this.isTournamentStarted = false;
		this.availableMatches = null;
		this.inProgressMatches = null;

		this.isAvailableMatchesInvalidated = true;
		this.availableMatchesCache = null;

		this.pendingChallenges = null;

		room.send('|tournament|create|' + format + '|' + generator.name);
		this.update();
	}

	Tournament.prototype.setGenerator = function (generator, output) {
		if (this.isTournamentStarted) {
			output.sendReply('|tournament|error|BracketFrozen');
			return;
		}

		var isErrored = false;
		this.generator.getUsers().forEach(function (user) {
			var error = generator.addUser(user);
			if (typeof error === 'string') {
				output.sendReply('|tournament|error|' + error);
				isErrored = true;
			}
		});

		if (isErrored)
			return;

		this.generator = generator;
		this.isBracketInvalidated = true;
		this.update();
	};

	Tournament.prototype.forceEnd = function () {
		this.room.send('|tournament|forceend');
	};

	Tournament.prototype.update = function (targetUser) {
		if (targetUser && (this.isBracketInvalidated || (this.isTournamentStarted && this.isAvailableMatchesInvalidated)))
			targetUser = null;

		this.room.send('|tournament|update|' + JSON.stringify({
			isStarted: this.isTournamentStarted,
			format: this.format,
			generator: this.generator.name,
			bracketData: this.getBracketData(),

			// Defaults of the below packets (which gets overwritten client side)
			isJoined: false,
			challenges: [],
			challengeBys: [],
			challenging: null,
			challenged: null
		}), targetUser);

		this.generator.getUsers().forEach(function (user) {
			if (!targetUser || user === targetUser)
				user.sendTo(this.room, '|tournament|update|{"isJoined":true}');
		}, this);

		if (this.isTournamentStarted) {
			var availableMatches = this.getAvailableMatches();
			availableMatches.challenges.forEach(function (opponents, user) {
				if (opponents.length > 0 && (!targetUser || user === targetUser))
					user.sendTo(this.room, '|tournament|update|' + JSON.stringify({challenges: usersToNames(opponents)}));
			}, this);
			availableMatches.challengeBys.forEach(function (opponents, user) {
				if (opponents.length > 0 && (!targetUser || user === targetUser))
					user.sendTo(this.room, '|tournament|update|' + JSON.stringify({challengeBys: usersToNames(opponents)}));
			}, this);

			this.pendingChallenges.forEach(function (challenge, user) {
				if (!challenge || (targetUser && challenge.to !== targetUser && challenge.from !== targetUser))
					return;

				if (challenge.to)
					user.sendTo(this.room, '|tournament|update|' + JSON.stringify({challenging: challenge.to.name}));
				else if (challenge.from)
					user.sendTo(this.room, '|tournament|update|' + JSON.stringify({challenged: challenge.from.name}));
			}, this);
		}

		this.room.send('|tournament|updateEnd', targetUser);
	};

	Tournament.prototype.addUser = function (user, output) {
		var error = this.generator.addUser(user);
		if (typeof error === 'string') {
			output.sendReply('|tournament|error|' + error);
			return;
		}

		this.room.send('|tournament|join|' + user.name);
		this.isBracketInvalidated = true;
		this.update();
	};
	Tournament.prototype.removeUser = function (user, output) {
		var error = this.generator.removeUser(user);
		if (typeof error === 'string') {
			output.sendReply('|tournament|error|' + error);
			return;
		}

		this.room.send('|tournament|leave|' + user.name);
		this.isBracketInvalidated = true;
		this.update();
	};
	Tournament.prototype.replaceUser = function (user, replacementUser, output) {
		var error = this.generator.replaceUser(user, replacementUser);
		if (typeof error === 'string') {
			output.sendReply('|tournament|error|' + error);
			return;
		}

		this.room.send('|tournament|replace|' + user.name + '|' + replacementUser.name);
		this.isBracketInvalidated = true;
		this.update();
	};

	Tournament.prototype.getBracketData = function () {
		if (this.isBracketInvalidated) {
			var data = this.generator.getBracketData();
			if (data.type === 'tree' && data.rootNode) {
				var queue = [data.rootNode];
				while (queue.length > 0) {
					var node = queue.shift();

					if (node.state === 'available') {
						var inProgressMatch = this.inProgressMatches.get(node.children[0].team);
						if (inProgressMatch && node.children[1].team === inProgressMatch.to) {
							node.state = 'inprogress';
							node.room = inProgressMatch.room.id;
						}
					}

					if (node.team)
						node.team = node.team.name;

					node.children.forEach(function (child) {
						queue.push(child);
					});
				}
			} else if (data.type === 'table') {
				if (this.isTournamentStarted)
					data.tableContents.forEach(function (row, r) {
						var inProgressMatch = this.inProgressMatches.get(data.tableHeaders.rows[r]);
						if (inProgressMatch)
							row.forEach(function (cell, c) {
								if (cell && data.tableHeaders.cols[c] === inProgressMatch.to) {
									cell.state = 'inprogress';
									cell.room = inProgressMatch.room.id;
								}
							});
					}, this);
				data.tableHeaders.cols = usersToNames(data.tableHeaders.cols);
				data.tableHeaders.rows = usersToNames(data.tableHeaders.rows);
			}

			this.bracketCache = data;
			this.isBracketInvalidated = false;
		}

		return this.bracketCache;
	};

	Tournament.prototype.startTournament = function () {
		this.generator.freezeBracket();

		this.availableMatches = new Map();
		this.inProgressMatches = new Map();
		this.pendingChallenges = new Map();
		var users = this.generator.getUsers();
		users.forEach(function (user) {
			var availableMatches = new Map();
			users.forEach(function (user) {
				availableMatches.set(user, false);
			});
			this.availableMatches.set(user, availableMatches);
			this.inProgressMatches.set(user, null);
			this.pendingChallenges.set(user, null);
		}, this);

		this.isTournamentStarted = true;
		this.isBracketInvalidated = true;
		this.room.send('|tournament|start');
		this.update();
	};
	Tournament.prototype.getAvailableMatches = function () {
		if (this.isAvailableMatchesInvalidated) {
			var matches = this.generator.getAvailableMatches();
			if (typeof matches === 'string') {
				this.room.add("Unexpected error from getAvailableMatches(): " + error + ". Please report this to an admin.");
				return;
			}

			var users = this.generator.getUsers();
			var challenges = new Map();
			var challengeBys = new Map();

			users.forEach(function (user) {
				challenges.set(user, []);
				challengeBys.set(user, []);

				var availableMatches = this.availableMatches.get(user);
				users.forEach(function (user) {
					availableMatches.set(user, false);
				});
			}, this);

			matches.forEach(function (match) {
				challenges.get(match[0]).push(match[1]);
				challengeBys.get(match[1]).push(match[0]);

				this.availableMatches.get(match[0]).set(match[1], true);
			}, this);

			this.availableMatchesCache = {
				challenges: challenges,
				challengeBys: challengeBys
			};
			this.isAvailableMatchesInvalidated = false;
		}

		return this.availableMatchesCache;
	};

	Tournament.prototype.disqualifyUser = function (user, output) {
		var isTournamentEnded = this.generator.disqualifyUser(user);
		if (typeof isTournamentEnded === 'string') {
			output.sendReply('|tournament|error|' + isTournamentEnded);
			return;
		}

		this.generator.setUserBusy(user, false);

		var challenge = this.pendingChallenges.get(user);
		if (challenge) {
			this.pendingChallenges.set(user, null);
			if (challenge.to) {
				this.generator.setUserBusy(challenge.to, false);
				this.pendingChallenges.set(challenge.to, null);
			} else if (challenge.from) {
				this.generator.setUserBusy(challenge.from, false);
				this.pendingChallenges.set(challenge.from, null);
			}
		}

		var matchFrom = this.inProgressMatches.get(user);
		if (matchFrom) {
			this.generator.setUserBusy(matchFrom.to, false);
			this.inProgressMatches.set(user, null);
			matchFrom.room.win = matchFrom.room._win;
			matchFrom.room.forfeit(user);
		}

		var matchTo = null;
		this.inProgressMatches.forEach(function (match, userFrom) {
			if (match && match.to === user)
				matchTo = userFrom;
		});
		if (matchTo) {
			this.generator.setUserBusy(matchTo, false);
			var matchRoom = this.inProgressMatches.get(matchTo).room;
			matchRoom.win = matchRoom._win;
			matchRoom.forfeit(user);
			this.inProgressMatches.set(matchTo, null);
		}

		this.room.send('|tournament|disqualify|' + user.name);
		this.isBracketInvalidated = true;
		this.isAvailableMatchesInvalidated = true;

		if (isTournamentEnded)
			this.onTournamentEnd();
		else
		this.update();
	};

	Tournament.prototype.challenge = function (from, to, output) {
		if (!this.availableMatches.get(from).get(to)) {
			output.sendReply('|tournament|error|InvalidMatch')
			return;
		}

		if (!from.prepBattle(this.format, 'challenge', from))
			return;

		if (this.generator.getUserBusy(from) || this.generator.getUserBusy(to)) {
			this.room.add("Tournament backend breaks specifications. Please report this to an admin.");
			return;
		}

		this.generator.setUserBusy(from, true);
		this.generator.setUserBusy(to, true);
		this.pendingChallenges.set(from, {to: to, team: from.team});
		this.pendingChallenges.set(to, {from: from, team: from.team});

		this.isBracketInvalidated = true;
		this.isAvailableMatchesInvalidated = true;
		this.update();
	};
	Tournament.prototype.cancelChallenge = function (user) {
		var challenge = this.pendingChallenges.get(user);
		if (!challenge || challenge.from)
			return;

		this.generator.setUserBusy(user, false);
		this.generator.setUserBusy(challenge.to, false);
		this.pendingChallenges.set(user, null);
		this.pendingChallenges.set(challenge.to, null);

		this.isBracketInvalidated = true;
		this.isAvailableMatchesInvalidated = true;
		this.update();
	};
	Tournament.prototype.acceptChallenge = function (user) {
		var challenge = this.pendingChallenges.get(user);
		if (!challenge || !challenge.from)
			return;

		if (!user.prepBattle(this.format, 'challenge', user))
			return;

		this.pendingChallenges.set(challenge.from, null);
		this.pendingChallenges.set(user, null);

		var room = Rooms.global.startBattle(challenge.from, user, this.format, true, challenge.team, user.team);
		this.inProgressMatches.set(challenge.from, {to: user, room: room});
		this.room.send('|tournament|battlestart|' + challenge.from.name + '|' + user.name + '|' + room.id);

		this.isBracketInvalidated = true;
		this.isAvailableMatchesInvalidated = true;
		this.update();

		var self = this;
		room._win = room.win;
		room.win = function (winner) {
			self.onBattleWin(this, Users.get(winner));
			this._win(winner);
		};
	};
	Tournament.prototype.onBattleWin = function (room, winner) {
		var from = Users.get(room.p1);
		var to = Users.get(room.p2);

		var result = 'draw';
		if (from === winner)
			result = 'win';
		else if (to === winner)
			result = 'loss';

		if (result === 'draw' && !this.generator.isDrawingSupported) {
			this.room.send('|tournament|battleend|' + from.name + '|' + to.name + '|' + result + '|' + room.battle.score.join(',') + '|fail');

			this.generator.setUserBusy(from, false);
			this.generator.setUserBusy(to, false);
			this.inProgressMatches.set(from, null);

			this.isBracketInvalidated = true;
			this.isAvailableMatchesInvalidated = true;

			this.update();
			return;
		}

		var isTournamentEnded = this.generator.setMatchResult([from, to], result, room.battle.score);
		if (typeof isTournamentEnded === 'string') {
			// Should never happen
			this.room.add("Unexpected " + isTournamentEnded + " from setMatchResult() in onBattleWin(" + room.id + ", " + winner.userid + "). Please report this to an admin.");
			return;
		}

		this.room.send('|tournament|battleend|' + from.name + '|' + to.name + '|' + result + '|' + room.battle.score.join(','));

		this.generator.setUserBusy(from, false);
		this.generator.setUserBusy(to, false);
		this.inProgressMatches.set(from, null);

		this.isBracketInvalidated = true;
		this.isAvailableMatchesInvalidated = true;

		if (isTournamentEnded)
			this.onTournamentEnd();
		else
			this.update();
	};
	Tournament.prototype.onTournamentEnd = function () {
		this.room.add('|tournament|end|' + JSON.stringify({results: this.generator.getResults().map(usersToNames), bracketData: this.getBracketData()}));
		delete tournaments[toId(this.room.id)];
	};

	return Tournament;
})();

CommandParser.commands.tour = 'tournament';
CommandParser.commands.tours = 'tournament';
CommandParser.commands.tournaments = 'tournament';
CommandParser.commands.tournament = function (paramString, room, user) {
	var cmdParts = paramString.split(' ');
	var cmd = cmdParts.shift().trim().toLowerCase();
	var params = cmdParts.join(' ').split(',').map(function (param) { return param.trim(); });

	if (cmd === 'create' || cmd === 'new') {
		if (!user.can('tournaments', null, room))
			return this.sendReply(cmd + " -  Access denied.");
		if (params.length < 2)
			return this.sendReply("Usage: " + cmd + " <format>, <type> [, <comma-separated arguments>]");

		createTournament(room, params.shift(), params.shift(), params, this);
	} else if (cmd === '') {
		this.sendReply('|tournaments|info|' + JSON.stringify(Object.keys(tournaments).map(function (tournament) {
			tournament = tournaments[tournament];
			return {name: tournament.name, format: tournament.format, generator: tournament.generator.name, isStarted: tournament.isTournamentStarted};
		})));
	} else {
		var tournament = getTournament(room.title);
		if (!tournament)
			return this.sendReply("There is currently no tournament running in this room.");

		switch (cmd) {
			case 'join':
			case 'j':
				tournament.addUser(user, this);
				break;

			case 'leave':
			case 'l':
				tournament.removeUser(user, this);
				break;

			case 'getupdate':
				tournament.update(user);
				break;

			case 'challenge':
				if (params.length < 1)
					return this.sendReply("Usage: " + cmd + " <user>");
				var targetUser = Users.get(params[0]);
				if (!targetUser)
					return this.sendReply("User " + params[0] + " not found.");
				tournament.challenge(user, targetUser, this);
				break;

			case 'cancelchallenge':
				tournament.cancelChallenge(user);
				break;

			case 'acceptchallenge':
				tournament.acceptChallenge(user);
				break;

			default:
				if (!user.can('tournaments', null, room))
					return this.sendReply(cmd + " -  Access denied.");

				switch (cmd) {
					case 'settype':
						if (params.length < 1)
							return this.sendReply("Usage: " + cmd + " <type> [, <comma-separated arguments>]");
						var generator = createTournamentGenerator(params.shift(), params, this);
						if (generator)
							tournament.setGenerator(generator, this);
						break;

					case 'end':
					case 'delete':
						deleteTournament(room.title, this);
						break;

					case 'begin':
					case 'start':
						tournament.startTournament()
						break;

					case 'disqualify':
					case 'dq':
						if (params.length < 1)
							return this.sendReply("Usage: " + cmd + " <user>");
						var targetUser = Users.get(params[0]);
						if (!targetUser)
							return this.sendReply("User " + params[0] + " not found.");
						tournament.disqualifyUser(targetUser, this);
						break;

					default:
						return this.sendReply(cmd + " is not a tournament command.");
				}
		}
	}
};

exports.Tournament = Tournament;
exports.TournamentGenerators = TournamentGenerators;

exports.createTournament = createTournament;
exports.deleteTournament = deleteTournament;
exports.getTournament = getTournament;
exports.tournaments = tournaments;
