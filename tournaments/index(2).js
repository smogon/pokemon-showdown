require('es6-shim');

const BRACKET_MINIMUM_UPDATE_INTERVAL = 2 * 1000;
const AUTO_DISQUALIFY_WARNING_TIMEOUT = 30 * 1000;

var TournamentGenerators = {
    roundrobin: require('./generator-round-robin.js').RoundRobin,
    elimination: require('./generator-elimination.js').Elimination
};

var Tournament;

exports.tournaments = {};

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
    return new (Generator.bind.apply(Generator, args))();
}
function createTournament(room, format, generator, isRated, args, output) {
    if (room.type !== 'chat') {
        output.sendReply("Tournaments can only be created in chat rooms.");
        return;
    }
    if (exports.tournaments[room.id]) {
        output.sendReply("A tournament is already running in the room.");
        return;
    }
    if (Rooms.global.lockdown) {
        output.sendReply("The server is restarting soon, so a tournament cannot be created.");
        return;
    }
    format = Tools.getFormat(format);
    if (format.effectType !== 'Format') {
        output.sendReply(format.id + " is not a valid format.");
        output.sendReply("Valid formats: " + Object.keys(Tools.data.Formats).filter(function (f) { return Tools.data.Formats[f].effectType === 'Format'; }).join(", "));
        return;
    }
    if (!TournamentGenerators[toId(generator)]) {
        output.sendReply(generator + " is not a valid type.");
        output.sendReply("Valid types: " + Object.keys(TournamentGenerators).join(", "));
        return;
    }
    return (exports.tournaments[room.id] = new Tournament(room, format, createTournamentGenerator(generator, args, output), isRated));
}
function deleteTournament(name, output) {
    var id = toId(name);
    var tournament = exports.tournaments[id];
    if (!tournament) {
        output.sendReply(name + " doesn't exist.");
        return false;
    }
    tournament.forceEnd(output);
    delete exports.tournaments[id];
    return true;
}
function getTournament(name, output) {
    var id = toId(name);
    if (exports.tournaments[id]) {
        return exports.tournaments[id];
    }
}

Tournament = (function () {
    function Tournament(room, format, generator, isRated) {
        this.room = room;
        this.format = toId(format);
        this.generator = generator;
        this.isRated = isRated;

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

        this.isEnded = false;

        room.add('|tournament|create|' + this.format + '|' + generator.name);
        room.send('|tournament|update|' + JSON.stringify({
            format: this.format,
            generator: generator.name,
            isStarted: false,
            isJoined: false
        }));
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

        if (isErrored) return;

        this.generator = generator;
        this.room.send('|tournament|update|' + JSON.stringify({generator: generator.name}));
        this.isBracketInvalidated = true;
        this.update();
    };

    Tournament.prototype.forceEnd = function () {
        if (this.isTournamentStarted) {
            this.inProgressMatches.forEach(function (match) {
                if (match) delete match.room.win;
            });
        }
        this.isEnded = true;
        this.room.add('|tournament|forceend');
        this.isEnded = true;
    };

    Tournament.prototype.updateFor = function (targetUser, connection) {
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
        var isJoined = this.generator.getUsers().indexOf(targetUser) >= 0;
        connection.sendTo(this.room, '|tournament|update|' + JSON.stringify({
            format: this.format,
            generator: this.generator.name,
            isStarted: this.isTournamentStarted,
            isJoined: isJoined,
            bracketData: this.bracketCache
        }));
        if (this.isTournamentStarted && isJoined) {
            connection.sendTo(this.room, '|tournament|update|' + JSON.stringify({
                challenges: usersToNames(this.availableMatchesCache.challenges.get(targetUser)),
                challengeBys: usersToNames(this.availableMatchesCache.challengeBys.get(targetUser))
            }));

            var pendingChallenge = this.pendingChallenges.get(targetUser);
            if (pendingChallenge && pendingChallenge.to) {
                connection.sendTo(this.room, '|tournament|update|' + JSON.stringify({challenging: pendingChallenge.to.name}));
            } else if (pendingChallenge && pendingChallenge.from) {
                connection.sendTo(this.room, '|tournament|update|' + JSON.stringify({challenged: pendingChallenge.from.name}));
            }
        }
        connection.sendTo(this.room, '|tournament|updateEnd');
    };

    Tournament.prototype.update = function (targetUser) {
        if (targetUser) throw new Error("Please use updateFor() to update the tournament for a specific user.");
        if (this.isEnded) return;
        if (this.isBracketInvalidated) {
            if (Date.now() < this.lastBracketUpdate + BRACKET_MINIMUM_UPDATE_INTERVAL) {
                if (this.bracketUpdateTimer) clearTimeout(this.bracketUpdateTimer);
                this.bracketUpdateTimer = setTimeout(function () {
                    this.bracketUpdateTimer = null;
                    this.update();
                }.bind(this), BRACKET_MINIMUM_UPDATE_INTERVAL);
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

            this.availableMatchesCache.challenges.forEach(function (opponents, user) {
                user.sendTo(this.room, '|tournament|update|' + JSON.stringify({challenges: usersToNames(opponents)}));
            }, this);
            this.availableMatchesCache.challengeBys.forEach(function (opponents, user) {
                user.sendTo(this.room, '|tournament|update|' + JSON.stringify({challengeBys: usersToNames(opponents)}));
            }, this);
        }
        this.room.send('|tournament|updateEnd');
    };

    Tournament.prototype.purgeGhostUsers = function () {
        // "Ghost" users sometimes end up in the tournament because they've merged with another user.
        // This function is to remove those ghost users from the tournament.
        this.generator.getUsers().forEach(function (user) {
            var realUser = Users.getExact(user.userid);
            if (!realUser || realUser !== user) {
                // The two following functions are called without their second argument,
                // but the second argument will not be used in this situation
                if (this.isTournamentStarted) {
                    if (!this.disqualifiedUsers.get(user)) {
                        this.disqualifyUser(user);
                    }
                } else {
                    this.removeUser(user);
                }
            }
        }, this);
    };

    Tournament.prototype.addUser = function (user, isAllowAlts, output) {
        if (!user.named) {
            output.sendReply('|tournament|error|UserNotNamed');
            return;
        }

        if (!isAllowAlts) {
            var users = this.generator.getUsers();
            for (var i = 0; i < users.length; i++) {
                if (users[i].latestIp === user.latestIp) {
                    output.sendReply('|tournament|error|AltUserAlreadyAdded');
                    return;
                }
            }
        }

        var error = this.generator.addUser(user);
        if (typeof error === 'string') {
            output.sendReply('|tournament|error|' + error);
            return;
        }

        this.room.add('|tournament|join|' + user.name);
        user.sendTo(this.room, '|tournament|update|{"isJoined":true}');
        this.isBracketInvalidated = true;
        this.update();
    };
    Tournament.prototype.removeUser = function (user, output) {
        var error = this.generator.removeUser(user);
        if (typeof error === 'string') {
            output.sendReply('|tournament|error|' + error);
            return;
        }

        this.room.add('|tournament|leave|' + user.name);
        user.sendTo(this.room, '|tournament|update|{"isJoined":false}');
        this.isBracketInvalidated = true;
        this.update();
    };
    Tournament.prototype.replaceUser = function (user, replacementUser, output) {
        var error = this.generator.replaceUser(user, replacementUser);
        if (typeof error === 'string') {
            output.sendReply('|tournament|error|' + error);
            return;
        }

        this.room.add('|tournament|replace|' + user.name + '|' + replacementUser.name);
        user.sendTo(this.room, '|tournament|update|{"isJoined":false}');
        replacementUser.sendTo(this.room, '|tournament|update|{"isJoined":true}');
        this.isBracketInvalidated = true;
        this.update();
    };

    Tournament.prototype.getBracketData = function () {
        var data = this.generator.getBracketData();
        if (data.type === 'tree' && data.rootNode) {
            var queue = [data.rootNode];
            while (queue.length > 0) {
                var node = queue.shift();

                if (node.state === 'available') {
                    var pendingChallenge = this.pendingChallenges.get(node.children[0].team);
                    if (pendingChallenge && node.children[1].team === pendingChallenge.to) {
                        node.state = 'challenging';
                    }

                    var inProgressMatch = this.inProgressMatches.get(node.children[0].team);
                    if (inProgressMatch && node.children[1].team === inProgressMatch.to) {
                        node.state = 'inprogress';
                        node.room = inProgressMatch.room.id;
                    }
                }

                if (node.team) node.team = node.team.name;

                node.children.forEach(function (child) {
                    queue.push(child);
                });
            }
        } else if (data.type === 'table') {
            if (this.isTournamentStarted) {
                data.tableContents.forEach(function (row, r) {
                    var pendingChallenge = this.pendingChallenges.get(data.tableHeaders.rows[r]);
                    var inProgressMatch = this.inProgressMatches.get(data.tableHeaders.rows[r]);
                    if (pendingChallenge || inProgressMatch) {
                        row.forEach(function (cell, c) {
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
                }, this);
            }
            data.tableHeaders.cols = usersToNames(data.tableHeaders.cols);
            data.tableHeaders.rows = usersToNames(data.tableHeaders.rows);
        }
        return data;
    };

    Tournament.prototype.startTournament = function (output) {
        if (this.isTournamentStarted) {
            output.sendReply('|tournament|error|AlreadyStarted');
            return false;
        }

        this.purgeGhostUsers();
        if (this.generator.getUsers().length < 2) {
            output.sendReply('|tournament|error|NotEnoughUsers');
            return false;
        }

        this.generator.freezeBracket();

        this.availableMatches = new Map();
        this.inProgressMatches = new Map();
        this.pendingChallenges = new Map();
        this.disqualifiedUsers = new Map();
        this.isAutoDisqualifyWarned = new Map();
        this.lastActionTimes = new Map();
        var users = this.generator.getUsers();
        users.forEach(function (user) {
            var availableMatches = new Map();
            users.forEach(function (user) {
                availableMatches.set(user, false);
            });
            this.availableMatches.set(user, availableMatches);
            this.inProgressMatches.set(user, null);
            this.pendingChallenges.set(user, null);
            this.disqualifiedUsers.set(user, false);
            this.isAutoDisqualifyWarned.set(user, false);
            this.lastActionTimes.set(user, Date.now());
        }, this);

        this.isTournamentStarted = true;
        this.autoDisqualifyTimeout = Infinity;
        this.isBracketInvalidated = true;
        this.room.add('|tournament|start');
        this.room.send('|tournament|update|{"isStarted":true}');
        this.update();
        return true;
    };
    Tournament.prototype.getAvailableMatches = function () {
        var matches = this.generator.getAvailableMatches();
        if (typeof matches === 'string') {
            this.room.add("Unexpected error from getAvailableMatches(): " + matches + ". Please report this to an admin.");
            return;
        }

        var users = this.generator.getUsers();
        var challenges = new Map();
        var challengeBys = new Map();
        var oldAvailableMatchCounts = new Map();

        users.forEach(function (user) {
            challenges.set(user, []);
            challengeBys.set(user, []);

            var availableMatches = this.availableMatches.get(user);
            var oldAvailableMatchCount = 0;
            availableMatches.forEach(function (isAvailable, user) {
                oldAvailableMatchCount += isAvailable;
                availableMatches.set(user, false);
            });
            oldAvailableMatchCounts.set(user, oldAvailableMatchCount);
        }, this);

        matches.forEach(function (match) {
            challenges.get(match[0]).push(match[1]);
            challengeBys.get(match[1]).push(match[0]);

            this.availableMatches.get(match[0]).set(match[1], true);
        }, this);

        this.availableMatches.forEach(function (availableMatches, user) {
            if (oldAvailableMatchCounts.get(user) !== 0) return;

            var availableMatchCount = 0;
            availableMatches.forEach(function (isAvailable, user) {
                availableMatchCount += isAvailable;
            });
            if (availableMatchCount > 0) this.lastActionTimes.set(user, Date.now());
        }, this);

        return {
            challenges: challenges,
            challengeBys: challengeBys
        };
    };

    Tournament.prototype.disqualifyUser = function (user, output) {
        var error = this.generator.disqualifyUser(user);
        if (error) {
            output.sendReply('|tournament|error|' + error);
            return false;
        }
        if (this.disqualifiedUsers.get(user)) {
            output.sendReply('|tournament|error|AlreadyDisqualified');
            return false;
        }

        this.disqualifiedUsers.set(user, true);
        this.generator.setUserBusy(user, false);

        var challenge = this.pendingChallenges.get(user);
        if (challenge) {
            this.pendingChallenges.set(user, null);
            if (challenge.to) {
                this.generator.setUserBusy(challenge.to, false);
                this.pendingChallenges.set(challenge.to, null);
                challenge.to.sendTo(this.room, '|tournament|update|{"challenged":null}');
            } else if (challenge.from) {
                this.generator.setUserBusy(challenge.from, false);
                this.pendingChallenges.set(challenge.from, null);
                challenge.from.sendTo(this.room, '|tournament|update|{"challenging":null}');
            }
        }

        var matchFrom = this.inProgressMatches.get(user);
        if (matchFrom) {
            this.generator.setUserBusy(matchFrom.to, false);
            this.inProgressMatches.set(user, null);
            delete matchFrom.room.win;
            matchFrom.room.forfeit(user);
        }

        var matchTo = null;
        this.inProgressMatches.forEach(function (match, userFrom) {
            if (match && match.to === user) matchTo = userFrom;
        });
        if (matchTo) {
            this.generator.setUserBusy(matchTo, false);
            var matchRoom = this.inProgressMatches.get(matchTo).room;
            delete matchRoom.win;
            matchRoom.forfeit(user);
            this.inProgressMatches.set(matchTo, null);
        }

        this.room.add('|tournament|disqualify|' + user.name);
        user.sendTo(this.room, '|tournament|update|{"isJoined":false}');
        this.isBracketInvalidated = true;
        this.isAvailableMatchesInvalidated = true;

        if (this.generator.isTournamentEnded()) {
            this.onTournamentEnd();
        } else {
            this.update();
        }

        return true;
    };

    Tournament.prototype.setAutoDisqualifyTimeout = function (timeout, output) {
        if (!this.isTournamentStarted) {
            output.sendReply('|tournament|error|NotStarted');
            return false;
        }
        if (timeout < AUTO_DISQUALIFY_WARNING_TIMEOUT || isNaN(timeout)) {
            output.sendReply('|tournament|error|InvalidAutoDisqualifyTimeout');
            return false;
        }

        this.autoDisqualifyTimeout = parseFloat(timeout);
        if (this.autoDisqualifyTimeout === Infinity) {
            this.room.add('|tournament|autodq|off');
        } else {
            this.room.add('|tournament|autodq|on|' + this.autoDisqualifyTimeout);
        }

        this.runAutoDisqualify();
        return true;
    };
    Tournament.prototype.runAutoDisqualify = function (output) {
        if (!this.isTournamentStarted) {
            output.sendReply('|tournament|error|NotStarted');
            return false;
        }
        this.lastActionTimes.forEach(function (time, user) {
            var availableMatches = 0;
            this.availableMatches.get(user).forEach(function (isAvailable) {
                availableMatches += isAvailable;
            });
            var pendingChallenge = this.pendingChallenges.get(user);

            if (availableMatches === 0 && !pendingChallenge) return;
            if (pendingChallenge && pendingChallenge.to) return;

            if (Date.now() > time + this.autoDisqualifyTimeout && this.isAutoDisqualifyWarned.get(user)) {
                this.disqualifyUser(user);
            } else if (Date.now() > time + this.autoDisqualifyTimeout - AUTO_DISQUALIFY_WARNING_TIMEOUT && !this.isAutoDisqualifyWarned.get(user)) {
                var remainingTime = this.autoDisqualifyTimeout - Date.now() + time;
                if (remainingTime <= 0) {
                    remainingTime = AUTO_DISQUALIFY_WARNING_TIMEOUT;
                    this.lastActionTimes.set(user, Date.now() - this.autoDisqualifyTimeout + AUTO_DISQUALIFY_WARNING_TIMEOUT);
                }

                this.isAutoDisqualifyWarned.set(user, true);
                user.sendTo(this.room, '|tournament|autodq|target|' + remainingTime);
            } else {
                this.isAutoDisqualifyWarned.set(user, false);
            }
        }, this);
    };

    Tournament.prototype.challenge = function (from, to, output) {
        if (!this.isTournamentStarted) {
            output.sendReply('|tournament|error|NotStarted');
            return;
        }

        if (!this.availableMatches.get(from) || !this.availableMatches.get(from).get(to)) {
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
        this.purgeGhostUsers();
        this.update();

        from.prepBattle(this.format, 'challenge', from, this.finishChallenge.bind(this, from, to, output));
    };
    Tournament.prototype.finishChallenge = function (from, to, output, result) {
        if (!result) {
            this.generator.setUserBusy(from, false);
            this.generator.setUserBusy(to, false);

            this.isAvailableMatchesInvalidated = true;
            this.update();
            return;
        }

        this.lastActionTimes.set(from, Date.now());
        this.lastActionTimes.set(to, Date.now());
        this.pendingChallenges.set(from, {to: to, team: from.team});
        this.pendingChallenges.set(to, {from: from, team: from.team});
        from.sendTo(this.room, '|tournament|update|' + JSON.stringify({challenging: to.name}));
        to.sendTo(this.room, '|tournament|update|' + JSON.stringify({challenged: from.name}));

        this.isBracketInvalidated = true;
        this.update();
    };
    Tournament.prototype.cancelChallenge = function (user, output) {
        if (!this.isTournamentStarted) {
            output.sendReply('|tournament|error|NotStarted');
            return;
        }

        var challenge = this.pendingChallenges.get(user);
        if (!challenge || challenge.from) return;

        this.generator.setUserBusy(user, false);
        this.generator.setUserBusy(challenge.to, false);
        this.pendingChallenges.set(user, null);
        this.pendingChallenges.set(challenge.to, null);
        user.sendTo(this.room, '|tournament|update|{"challenging":null}');
        challenge.to.sendTo(this.room, '|tournament|update|{"challenged":null}');

        this.isBracketInvalidated = true;
        this.isAvailableMatchesInvalidated = true;
        this.update();
    };
    Tournament.prototype.acceptChallenge = function (user, output) {
        if (!this.isTournamentStarted) {
            output.sendReply('|tournament|error|NotStarted');
            return;
        }

        var challenge = this.pendingChallenges.get(user);
        if (!challenge || !challenge.from) return;

        user.prepBattle(this.format, 'challenge', user, this.finishAcceptChallenge.bind(this, user, challenge));
    };
    Tournament.prototype.finishAcceptChallenge = function (user, challenge, result) {
        if (!result) return;

        // Prevent double accepts and users that have been disqualified while between these two functions
        if (!this.pendingChallenges.get(challenge.from)) return;
        if (!this.pendingChallenges.get(user)) return;

        var room = Rooms.global.startBattle(challenge.from, user, this.format, this.isRated, challenge.team, user.team);
        if (!room) return;

        this.pendingChallenges.set(challenge.from, null);
        this.pendingChallenges.set(user, null);
        challenge.from.sendTo(this.room, '|tournament|update|{"challenging":null}');
        user.sendTo(this.room, '|tournament|update|{"challenged":null}');

        this.inProgressMatches.set(challenge.from, {to: user, room: room});
        this.room.add('|tournament|battlestart|' + challenge.from.name + '|' + user.name + '|' + room.id);

        this.isBracketInvalidated = true;
        this.runAutoDisqualify();
        this.update();

        var self = this;
        room.win = function (winner) {
            self.onBattleWin(this, Users.get(winner));
            return Object.getPrototypeOf(this).win.call(this, winner);
        };
    };
    Tournament.prototype.onBattleWin = function (room, winner) {
        var from = Users.get(room.p1),
            to = Users.get(room.p2),
            fromElo = Number(Core.stdin('elo', toId(from))),
            toElo = Number(Core.stdin('elo', toId(to))), arr;

        var result = 'draw';
        if (from === winner) {
            result = 'win';
            if (this.room.isOfficial && this.generator.users.size >= Core.tournaments.tourSize) {
                arr = Core.calculateElo(fromElo, toElo);
                Core.stdout('elo', toId(from), arr[0], function () {
                    Core.stdout('elo', toId(to), arr[1]);
                });
            }
        } else if (to === winner) {
            result = 'loss';
            if (this.room.isOfficial && this.generator.users.size >= Core.tournaments.tourSize) {
                arr = Core.calculateElo(toElo, fromElo);
                Core.stdout('elo', toId(to), arr[0], function () {
                    Core.stdout('elo', toId(from), arr[1]);
                });
            }
        }

        if (result === 'draw' && !this.generator.isDrawingSupported) {
            this.room.add('|tournament|battleend|' + from.name + '|' + to.name + '|' + result + '|' + room.battle.score.join(',') + '|fail');

            this.generator.setUserBusy(from, false);
            this.generator.setUserBusy(to, false);
            this.inProgressMatches.set(from, null);

            this.isBracketInvalidated = true;
            this.isAvailableMatchesInvalidated = true;

            this.runAutoDisqualify();
            this.update();
            return;
        }

        var error = this.generator.setMatchResult([from, to], result, room.battle.score);
        if (error) {
            // Should never happen
            this.room.add("Unexpected " + error + " from setMatchResult([" + from.userid + ", " + to.userid + "], " + result + ", " + room.battle.score + ") in onBattleWin(" + room.id + ", " + winner.userid + "). Please report this to an admin.");
            return;
        }

        this.room.add('|tournament|battleend|' + from.name + '|' + to.name + '|' + result + '|' + room.battle.score.join(','));

        this.generator.setUserBusy(from, false);
        this.generator.setUserBusy(to, false);
        this.inProgressMatches.set(from, null);

        this.isBracketInvalidated = true;
        this.isAvailableMatchesInvalidated = true;

        if (this.generator.isTournamentEnded()) {
            this.onTournamentEnd();
        } else {
            this.runAutoDisqualify();
            this.update();
        }
    };
    Tournament.prototype.onTournamentEnd = function () {
        this.room.add('|tournament|end|' + JSON.stringify({
            results: this.generator.getResults().map(usersToNames),
            format: this.format,
            generator: this.generator.name,
            bracketData: this.getBracketData()
        }));

        var data = {
            results: this.generator.getResults().map(usersToNames),
            bracketData: this.getBracketData()
        }, runnerUp = false, winner;
        data = data['results'].toString();

        if (data.indexOf(',') >= 0) {
            data = data.split(',');
            winner = data[0];
            if (data[1]) runnerUp = data[1];
        } else {
            winner = data;
        }

        var tourSize = this.generator.users.size;
        if (this.room.isOfficial && tourSize >= Core.tournaments.tourSize) {
            var firstMoney = Math.round(tourSize / Core.tournaments.amountEarn),
            secondMoney = Math.round(firstMoney / 2),
            firstBuck = 'buck',
            secondBuck = 'buck';
            if (firstMoney > 1) firstBuck = 'bucks';
            if (secondMoney > 1) secondBuck = 'bucks';

            // annouces the winner/runnerUp
            this.room.add('|raw|<strong><font color=' + Core.profile.color + '>' + Tools.escapeHTML(winner) + '</font> has also won <font color=' + Core.profile.color + '>' + firstMoney + '</font> ' + firstBuck + ' for winning the tournament!</strong>');
            if (runnerUp) this.room.add('|raw|<strong><font color=' + Core.profile.color + '>' + Tools.escapeHTML(runnerUp) + '</font> has also won <font color=' + Core.profile.color + '>' + secondMoney + '</font> ' + secondBuck + ' for winning the tournament!</strong>');

            var wid = toId(winner), // winner's userid
                rid = toId(runnerUp); // runnerUp's userid

            // file i/o
            var winnerMoney = Number(Core.stdin('money', wid));
            var tourWin = Number(Core.stdin('tourWins', wid));
            Core.stdout('money', wid, (winnerMoney + firstMoney), function () {
                var winnerElo = Number(Core.stdin('elo', wid));
                if (winnerElo === 0) winnerElo = 1000;
                if (runnerUp) {
                    var runnerUpMoney = Number(Core.stdin('money', rid)),
                        runnerUpElo = Number(Core.stdin('elo', rid));
                    if (runnerUpElo === 0) runnerUpElo = 1000;
                    Core.stdout('money', rid, (runnerUpMoney + secondMoney), function () {
                        Core.stdout('tourWins', wid, (tourWin + 1), function () {
                            Core.stdout('elo', wid, (winnerElo + Core.tournaments.winningElo), function () {
                                Core.stdout('elo', rid, (runnerUpElo + Core.tournaments.runnerUpElo));
                            });
                        });
                    });
                } else {
                    Core.stdout('tourWins', wid, (tourWin + 1), function () {
                        Core.stdout('elo', wid, (winnerElo + Core.tournaments.winningElo));
                    });
                }
            });
        }
        this.isEnded = true;
        delete exports.tournaments[toId(this.room.id)];
    };

    return Tournament;
})();

var commands = {
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
                tournament.disqualifyUser(user, this);
            } else {
                tournament.removeUser(user, this);
            }
        },
        getusers: function (tournament) {
            if (!this.canBroadcast()) return;
            var users = usersToNames(tournament.generator.getUsers().sort());
            this.sendReplyBox("<strong>" + users.length + " users are in this tournament:</strong><br />" + users.join(", "));
        },
        getupdate: function (tournament, user) {
            this.sendReply("Your tournament bracket has been updated.");
            tournament.update(user);
        },
        challenge: function (tournament, user, params, cmd) {
            if (params.length < 1) {
                return this.sendReply("Usage: " + cmd + " <user>");
            }
            var targetUser = Users.get(params[0]);
            if (!targetUser) {
                return this.sendReply("User " + params[0] + " not found.");
            }
            tournament.challenge(user, targetUser, this);
        },
        cancelchallenge: function (tournament, user) {
            tournament.cancelChallenge(user, this);
        },
        acceptchallenge: function (tournament, user) {
            tournament.acceptChallenge(user, this);
        }
    },
    creation: {
        settype: function (tournament, user, params, cmd) {
            if (params.length < 1) {
                return this.sendReply("Usage: " + cmd + " <type> [, <comma-separated arguments>]");
            }
            var generator = createTournamentGenerator(params.shift(), params, this);
            if (generator) tournament.setGenerator(generator, this);
        },
        begin: 'start',
        start: function (tournament, user) {
            if (tournament.startTournament(this)) {
                this.sendModCommand("(" + user.name + " started the tournament.)");
            }
        }
    },
    moderation: {
        dq: 'disqualify',
        disqualify: function (tournament, user, params, cmd) {
            if (params.length < 1) {
                return this.sendReply("Usage: " + cmd + " <user>");
            }
            var targetUser = Users.get(params[0]);
            if (!targetUser) {
                return this.sendReply("User " + params[0] + " not found.");
            }
            if (tournament.disqualifyUser(targetUser, this)) {
                this.privateModCommand("(" + targetUser.name + " was disqualified from the tournament by " + user.name + ")");
            }
        },
        autodq: 'setautodq',
        setautodq: function (tournament, user, params, cmd) {
            if (params.length < 1) {
                return this.sendReply("Usage: " + cmd + " <minutes|off>");
            }
            var timeout = params[0].toLowerCase() === 'off' ? Infinity : params[0];
            if (tournament.setAutoDisqualifyTimeout(timeout * 60 * 1000, this)) {
                this.privateModCommand("(The tournament auto disqualify timeout was set to " + params[0] + " by " + user.name + ")");
            }
        },
        runautodq: function (tournament) {
            tournament.runAutoDisqualify(this);
        },
        end: 'delete',
        stop: 'delete',
        delete: function (tournament, user) {
            if (deleteTournament(tournament.room.title, this)) {
                this.privateModCommand("(" + user.name + " forcibly ended a tournament.)");
            }
        }
    }
};

var commands = {
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
                tournament.disqualifyUser(user, this);
            } else {
                tournament.removeUser(user, this);
            }
        },
        getusers: function (tournament) {
            if (!this.canBroadcast()) return;
            var users = usersToNames(tournament.generator.getUsers().sort());
            this.sendReplyBox("<strong>" + users.length + " users are in this tournament:</strong><br />" + users.join(", "));
        },
        getupdate: function (tournament, user) {
            tournament.updateFor(user);
            this.sendReply("Your tournament bracket has been updated.");
        },
        challenge: function (tournament, user, params, cmd) {
            if (params.length < 1) {
                return this.sendReply("Usage: " + cmd + " <user>");
            }
            var targetUser = Users.get(params[0]);
            if (!targetUser) {
                return this.sendReply("User " + params[0] + " not found.");
            }
            tournament.challenge(user, targetUser, this);
        },
        cancelchallenge: function (tournament, user) {
            tournament.cancelChallenge(user, this);
        },
        acceptchallenge: function (tournament, user) {
            tournament.acceptChallenge(user, this);
        }
    },
    creation: {
        settype: function (tournament, user, params, cmd) {
            if (params.length < 1) {
                return this.sendReply("Usage: " + cmd + " <type> [, <comma-separated arguments>]");
            }
            var generator = createTournamentGenerator(params.shift(), params, this);
            if (generator) tournament.setGenerator(generator, this);
        },
        begin: 'start',
        start: function (tournament, user) {
            if (tournament.startTournament(this)) {
                this.sendModCommand("(" + user.name + " started the tournament.)");
            }
        }
    },
    moderation: {
        dq: 'disqualify',
        disqualify: function (tournament, user, params, cmd) {
            if (params.length < 1) {
                return this.sendReply("Usage: " + cmd + " <user>");
            }
            var targetUser = Users.get(params[0]);
            if (!targetUser) {
                return this.sendReply("User " + params[0] + " not found.");
            }
            if (tournament.disqualifyUser(targetUser, this)) {
                this.privateModCommand("(" + targetUser.name + " was disqualified from the tournament by " + user.name + ")");
            }
        },
        autodq: 'setautodq',
        setautodq: function (tournament, user, params, cmd) {
            if (params.length < 1) {
                return this.sendReply("Usage: " + cmd + " <minutes|off>");
            }
            var timeout = params[0].toLowerCase() === 'off' ? Infinity : params[0];
            if (tournament.setAutoDisqualifyTimeout(timeout * 60 * 1000, this)) {
                this.privateModCommand("(The tournament auto disqualify timeout was set to " + params[0] + " by " + user.name + ")");
            }
        },
        runautodq: function (tournament) {
            tournament.runAutoDisqualify(this);
        },
        end: 'delete',
        stop: 'delete',
        delete: function (tournament, user) {
            if (deleteTournament(tournament.room.title, this)) {
                this.privateModCommand("(" + user.name + " forcibly ended a tournament.)");
            }
        }
    }
};

CommandParser.commands.tour = 'tournament';
CommandParser.commands.tours = 'tournament';
CommandParser.commands.tournaments = 'tournament';
CommandParser.commands.tournament = function (paramString, room, user) {
    var cmdParts = paramString.split(' ');
    var cmd = cmdParts.shift().trim().toLowerCase();
    var params = cmdParts.join(' ').split(',').map(function (param) { return param.trim(); });
    if (!params[0]) params = [];

    if (cmd === '') {
        if (!this.canBroadcast()) return;
        this.sendReply('|tournaments|info|' + JSON.stringify(Object.keys(exports.tournaments).filter(function (tournament) {
            tournament = exports.tournaments[tournament];
            return !tournament.room.isPrivate && !tournament.room.staffRoom;
        }).map(function (tournament) {
            tournament = exports.tournaments[tournament];
            return {room: tournament.room.title, format: tournament.format, generator: tournament.generator.name, isStarted: tournament.isTournamentStarted};
        })));
    } else if (cmd === 'help') {
        if (!this.canBroadcast()) return;
        return this.sendReplyBox(
            "- create/new &lt;format>, &lt;type> [, &lt;comma-separated arguments>]: Creates a new tournament in the current room.<br />" +
            "- settype &lt;type> [, &lt;comma-separated arguments>]: Modifies the type of tournament after it's been created, but before it has started.<br />" +
            "- end/stop/delete: Forcibly ends the tournament in the current room.<br />" +
            "- begin/start: Starts the tournament in the current room.<br />" +
            "- dq/disqualify &lt;user>: Disqualifies a user.<br />" +
            "- autodq/setautodq &lt;minutes|off>: Sets the automatic disqualification timeout.<br />" +
            "- runautodq: Manually run the automatic disqualifier.<br />" +
            "- getusers: Lists the users in the current tournament.<br />" +
            "- on/off: Enables/disables allowing mods to start tournaments.<br />" +
            "More detailed help can be found <a href=\"https://gist.github.com/kotarou3/7872574\">here</a>"
        );
    } else if (cmd === 'on' || cmd === 'enable') {
        if (!this.can('tournamentsmanagement', null, room)) return;
        if (room.toursEnabled) {
            return this.sendReply("Tournaments are already enabled.");
        }
        room.toursEnabled = true;
        if (room.chatRoomData) {
            room.chatRoomData.toursEnabled = true;
            Rooms.global.writeChatRoomData();
        }
        return this.sendReply("Tournaments enabled.");
    } else if (cmd === 'off' || cmd === 'disable') {
        if (!this.can('tournamentsmanagement', null, room)) return;
        if (!room.toursEnabled) {
            return this.sendReply("Tournaments are already disabled.");
        }
        delete room.toursEnabled;
        if (room.chatRoomData) {
            delete room.chatRoomData.toursEnabled;
            Rooms.global.writeChatRoomData();
        }
        return this.sendReply("Tournaments disabled.");
    } else if (cmd === 'create' || cmd === 'new') {
        if (room.toursEnabled) {
            if (!this.can('tournaments', null, room)) return;
        } else {
            if (!user.can('tournamentsmanagement', null, room)) {
                return this.sendReply("Tournaments are disabled in this room ("+room.id+").");
            }
        }
        if (params.length < 2) {
            return this.sendReply("Usage: " + cmd + " <format>, <type> [, <comma-separated arguments>]");
        }

        var tour = createTournament(room, params.shift(), params.shift(), Config.istournamentsrated, params, this);
        if (tour) this.privateModCommand("(" + user.name + " created a tournament in " + tour.format + " format.)");
    } else {
        var tournament = getTournament(room.title);
        if (!tournament) {
            return this.sendReply("There is currently no tournament running in this room.");
        }

        var commandHandler = null;
        if (commands.basic[cmd]) {
            commandHandler = typeof commands.basic[cmd] === 'string' ? commands.basic[commands.basic[cmd]] : commands.basic[cmd];
        }

        if (commands.creation[cmd]) {
            if (room.toursEnabled) {
                if (!this.can('tournaments', null, room)) return;
            } else {
                if (!user.can('tournamentsmanagement', null, room)) {
                    return this.sendReply("Tournaments are disabled in this room ("+room.id+").");
                }
            }
            commandHandler = typeof commands.creation[cmd] === 'string' ? commands.creation[commands.creation[cmd]] : commands.creation[cmd];
        }

        if (commands.moderation[cmd]) {
            if (!user.can('tournamentsmoderation', null, room)) {
                return this.sendReply(cmd + " -  Access denied.");
            }
            commandHandler = typeof commands.moderation[cmd] === 'string' ? commands.moderation[commands.moderation[cmd]] : commands.moderation[cmd];
        }

        if (!commandHandler) {
            this.sendReply(cmd + " is not a tournament command.");
        } else {
            commandHandler.call(this, tournament, user, params, cmd);
        }
    }
};

exports.Tournament = Tournament;
exports.TournamentGenerators = TournamentGenerators;

exports.createTournament = createTournament;
exports.deleteTournament = deleteTournament;
exports.get = getTournament;

exports.commands = commands;
