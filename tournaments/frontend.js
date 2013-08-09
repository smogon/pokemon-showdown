require("es6-shim");

var TournamentGenerators = {
	RoundRobin = require('./generator-round-robin.js').RoundRobin;
};

var tournaments = {};

function usersToNames(users) {
	return users.map(function (user) { return user.name; });
}

function createTournament(name, format, generator, output) {
	var id = toId(name);
	if (tournaments[id]) {
		output.sendReply("A tournament with the same name already exists.");
		return;
	}
	if (Tools.getFormat(format).effectType !== 'Format') {
		output.sendReply(format + " is not a valid format.");
		output.sendReply("Valid formats: " + Object.keys(Tools.data.Formats).filter(function (f) { return Tools.data.Formats[f].effectType === 'Format'; }).join(", "));
		return;
	}
	if (!TournamentGenerators[generator]) {
		output.sendReply(generator + " is not a valid generator.");
		output.sendReply("Valid generators: " + Object.keys(TournamentGenerators).join(", "));
		return;
	}
	return tournaments[id] = new Tournament(name, format, new TournamentGenerators[generator](), output);
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
	if (tournaments[toId(name)])
		return tournaments;
}

var Tournament = (function () {
	function Tournament(name, format, generator, output) {
		this.name = toName(name);
		this.format = format;
		this.generator = generator;

		this.isBracketInvalidated = true;
		this.bracketCache = null;

		this.isTournamentStarted = false;
		this.availableMatches = null;
		this.inProgressMatches = null;

		this.isAvailableMatchesInvalidated = true;
		this.availableMatchesCache = null;

		this.pendingChallenges = null;

		output.add('|tournament|' + this.name + '|create');
		this.update(output);
	}

	Tournament.prototype.setGenerator(generator, output) {
		if (this.isTournamentStarted) {
			output.sendReply('|tournament|' + this.name + '|error|BracketFrozen');
			return;
		}

		var isErrored = false;
		this.generator.getUsers.forEach(function (user) {
			var error = generator.addUser(user);
			if (typeof error === 'string') {
				output.sendReply('|tournament|' + this.name + '|error|' + error);
				isErrored = true;
			}
		});

		if (isErrored)
			return;

		this.generator = generator;
		this.isBracketInvalidated = true;
		this.update(output);
	};

	Tournament.prototype.forceEnd(output) {
		output.add('|tournament' + this.name + '|forceend');
	};

	Tournament.prototype.update = function (output) {
		output.send('|tournament|' + this.name + '|update');
		output.send('|tournament|' + this.name + '|info|' + JSON.stringify({
			isStarted: this.isTournamentStarted,
			format: this.format,
			generator: this.generator.name
		}));

		this.getBracketData(output);

		if (this.isTournamentStarted) {
			this.getAvailableMatches(output);
			this.pendingChallenges.forEach(function (challenge, user) {
				if (challenge.to)
					user.send('|tournament|' + this.name + '|challenging|' + challenge.to.name);
				else if (challenge.from)
					user.send('|tournament|' + this.name + '|challenged|' + challenge.from.name);
			});
		}
	};

	Tournament.prototype.addUser = function (user, output) {
		var error = this.generator.addUser(user);
		if (typeof error === 'string') {
			output.sendReply('|tournament|' + this.name + '|error|' + error);
			return;
		}

		output.send('|tournament|' + this.name + '|join|' + user.name);
		this.isBracketInvalidated = true;
		this.update(output);
	};
	Tournament.prototype.removeUser = function (user, output) {
		var error = this.generator.removeUser(user);
		if (typeof error === 'string') {
			output.sendReply('|tournament|' + this.name + '|error|' + error);
			return;
		}

		output.send('|tournament|' + this.name + '|leave|' + user.name);
		this.isBracketInvalidated = true;
		this.update(output);
	};
	Tournament.prototype.replaceUser = function (user, replacementUser, output) {
		var error = this.generator.replaceUser(user, replacementUser);
		if (typeof error === 'string') {
			output.sendReply('|tournament|' + this.name + '|error|' + error);
			return;
		}

		output.send('|tournament|' + this.name + '|replace|' + user.name + '|' + replacementUser.name);
		this.isBracketInvalidated = true;
		this.update(output);
	};

	Tournament.prototype.getBracketData = function (output) {
		// TODO: Add in-progress view
		if (this.isBracketInvalidated) {
			var data = this.generator.getBracketData();
			if (data.type === 'tree') {
				// TODO
			} else if (data.type === 'table') {
				data.tableHeaders.cols = usersToNames(data.tableHeaders.cols);
				data.tableHeaders.rows = usersToNames(data.tableHeaders.rows);
				data.tableContents.forEach(function (row) {
					row.forEach(function (cell) {
						if (cell)
							cell.teams = usersToNames(cell.teams);
					});
				});
				data.scores.forEach(function (score) {
					score.team = score.team.name;
				});
			}

			this.bracketCache = JSON.stringify(data);
			this.isBracketInvalidated = false;
		}

		output.send('|tournament|' + this.name + '|bracketdata|' + this.bracketCache);.
	};

	Tournament.prototype.startTournament = function (output) {
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
		output.add('|tournament|' + this.name + '|start');
		this.update(output);
	};
	Tournament.prototype.getAvailableMatches = function (output) {
		if (this.isAvailableMatchesInvalidated) {
			var matches = this.generator.getAvailableMatches();
			if (typeof matches === 'string') {
				output.sendReply('|tournament|' + this.name + '|error|' + error);
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
			});

			this.availableMatchesCache = {
				challenges: challenges,
				challengeBys: challengeBys
			};
			this.isAvailableMatchesInvalidated = false;
		}

		this.availableMatchesCache.challenges.forEach(function (opponents, user) {
			if (opponents.length > 0)
				user.send('|tournament|' + this.name + '|challenges|' + usersToNames(opponents).join(','));
		});
		this.availableMatchesCache.challengeBys.forEach(function (opponents, user) {
			if (opponents.length > 0)
				user.send('|tournament|' + this.name + '|challengeBys|' + usersToNames(opponents).join(','));
		});
	};

	Tournament.prototype.disqualifyUser = function (user, output) {
		var error = this.generator.disqualifyUser(user);
		if (typeof error === 'string') {
			output.sendReply('|tournament|' + this.name + '|error|' + error);
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
			matchFrom.room.forfeit(user);
		}

		var matchTo = null;
		this.inProgressMatches.forEach(function (match, userFrom) {
			if (match && match.to === user)
				matchTo = userFrom;
		});
		if (matchTo) {
			this.generator.setUserBusy(matchTo, false);
			this.inProgressMatches.get(matchTo).room.forfeit(user);
			this.inProgressMatches.set(matchTo, null);
		}

		this.isBracketInvalidated = true;
		this.isAvailableMatchesInvalidated = true;
		this.update(output);
	};

	Tournament.prototype.challenge = function (from, to, output) {
		if (!this.availableMatches.get(from).get(to)) {
			output.sendReply('|tournament|' + this.name + '|error|InvalidMatch')
			return;
		}
		if (this.generator.getUserBusy(from) || this.generator.getUserBusy(to)) {
			output.add("Tournament backend breaks specifications. Please report this to an admin.");
			return;
		}

		this.generator.setUserBusy(from, true);
		this.generator.setUserBusy(to, true);
		this.pendingChallenges.set(from, {to: to});
		this.pendingChallenges.set(to, {from: from});

		this.isBracketInvalidated = true;
		this.isAvailableMatchesInvalidated = true;
		this.update(output);
	};
	Tournament.prototype.cancelChallenge = function (user, output) {
		var challenge = this.pendingChallenges.get(user);
		if (!challenge || challenge.from)
			return;

		this.generator.setUserBusy(user, false);
		this.generator.setUserBusy(challenge.to, false);
		this.pendingChallenges.set(user, null);
		this.pendingChallenges.set(challenge.to, null);

		this.isBracketInvalidated = true;
		this.isAvailableMatchesInvalidated = true;
		this.update(output);
	};
	Tournament.prototype.acceptChallenge = function (user, output) {
		var challenge = this.pendingChallenges.get(user);
		if (!challenge || !challenge.from)
			return;

		this.pendingChallenges.set(challenge.from, null);
		this.pendingChallenges.set(user, null);

		var room = Rooms.global.startBattle(challenge.from, user, this.format, true, challenge.from.team, user.team);
		this.inProgressMatches.set(challenge.from, {to: user, room: room});
		output.send('|tournament|' + this.name + '|battlestart|' + challenge.from.name + '|' + user.name + '|' + room.id);

		this.isBracketInvalidated = true;
		this.isAvailableMatchesInvalidated = true;
		this.update(output);

		var self = this;
		room._win = room.win;
		room.win = function (winner) {
			self.onBattleWin(this, Users.get(winner), output);
			this._win(winner);
		};
	};
	Tournament.prototype.onBattleWin = function (room, winner, output) {
		var from = Users.get(room.p1);
		var to = Users.get(room.p2);

		var result = 'draw';
		if (from === winner)
			result = 'win';
		else if (to === winner)
			result = 'loss';
		var isTournamentEnded = this.generator.setMatchResult([from, to], result, room.battle.score);
		if (typeof isTournamentEnded === 'string') {
			// Should never happen
			output.add("Unexpected " + isTournamentEnded + " from setMatchResult() in onBattleWin(" + room.id + ", " + winner.id + ", ...). Please report this to an admin.");
			return;
		}

		output.send('|tournament|' + this.name + '|battleend|' + challenge.from.name + '|' + user.name + '|' + result + '|' + room.battle.score.join(','));

		this.generator.setUserBusy(from, false);
		this.generator.setUserBusy(to, false);
		this.inProgressMatches.set(from, null);

		this.isBracketInvalidated = true;
		this.isAvailableMatchesInvalidated = true;
		this.update(output);

		if (isTournamentEnded)
			this.onTournamentEnd(output);
	};
	Tournament.prototype.onTournamentEnd = function (output) {
		var results = this.generator.getResults();
		output.add('|tournament|' + this.name + '|end|' + usersToNames(results[0]).join(',') + (results[1] ? usersToNames(results[1]).join(',') : ''));
	};

	return Tournament;
})();

exports.Tournament = Tournament;
exports.TournamentGenerators = TournamentGenerators;

exports.createTournament = createTournament;
exports.destroyTournament = destroyTournament;
exports.getTournament = getTournament;
exports.tournaments = tournaments;
