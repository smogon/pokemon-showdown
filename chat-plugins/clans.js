var elo = require('elo-rank')();

function ratingToName(rating) {
	if (rating > 1500)
		return "Gold";
	else if (rating > 1200)
		return "Silver";
	else
		return "Bronze";
}

var getClan, War;
var ClanRoom = exports.ClanRoom = (function () {
	function ClanRoom(name, data) {
		data = data || {};
		data.isClanRoom = true;
		if (!data.ratingData) {
			data.ratingData = {
				wins: 0,
				losses: 0,
				draws: 0,
				rating: 1000
			};
		}

		Rooms.ChatRoom.call(this, toId(name), name, data);

		this.availableMembers = {};
		this.challengesFrom = {};
		this.challengeTo = null;
	}
	ClanRoom.prototype = Object.create(Rooms.ChatRoom.prototype);

	ClanRoom.prototype.getRating = function () {
		return {
			wins: this.ratingData.wins,
			losses: this.ratingData.losses,
			draws: this.ratingData.draws,
			rating: this.ratingData.rating,
			ratingName: ratingToName(this.ratingData.rating)
		};
	};

	ClanRoom.prototype.setMemberAvailable = function (user) {
		if (!this.auth || !this.auth[toId(user)]) return false;
		var expiryTime = this.availableMembers[toId(user)] = Date.now() + (5).minutes();
		return expiryTime;
	};
	ClanRoom.prototype.getAvailableMembers = function () {
		this.pruneAvailableMembers();
		return Object.keys(this.availableMembers);
	};
	ClanRoom.prototype.pruneAvailableMembers = function () {
		for (var m in this.availableMembers) {
			var user = Users.getExact(m);
			if (this.availableMembers[m] < Date.now() || !this.auth[m] || !user || !user.connected) {
				delete this.availableMembers[m];
			}
		}
	};
	ClanRoom.prototype.isEnoughAvailableMembers = function () {
		this.pruneAvailableMembers();
		if (Object.size(this.availableMembers) < 1) {
			this.add("You do not have enough available members for a war. At least 4 is required.");
			return false;
		}
		return true;
	};

	ClanRoom.prototype.updateChallenges = function () {
		if (this.challengeTo) {
			var otherClan = getClan(this.challengeTo.to);
			if (otherClan) {
				this.add("You are challenging " + otherClan.title);
			} else {
				this.challengeTo = null;
			}
		}

		var challengesFrom = [];
		for (var c in this.challengesFrom) {
			challengesFrom.push(this.challengesFrom[c].from);
		}
		if (challengesFrom.length > 0) this.add("You are being challenged by: " + challengesFrom.join(", "));

		this.update();
	};
	ClanRoom.prototype.makeChallenge = function (otherClan, format) {
		if (otherClan === this) return;
		if (this.currentWar) return;
		if (!this.isEnoughAvailableMembers()) return;
		if (this.challengeTo) {
			this.updateChallenges();
			return;
		}

		var challenge = {
			from: this.id,
			to: otherClan.id,
			format: format || ''
		};
		this.challengeTo = challenge;
		otherClan.challengesFrom[this.id] = challenge;

		this.updateChallenges();
		otherClan.updateChallenges();
	};
	ClanRoom.prototype.cancelChallengeTo = function () {
		if (!this.challengeTo) return;

		var otherClan = getClan(this.challengeTo.to);
		this.challengeTo = null;
		delete otherClan.challengesFrom[this.id];

		this.add("You have cancelled your challenge.");
		otherClan.add("||" + this.title + " has cancelled their challenge.");

		this.updateChallenges();
		otherClan.updateChallenges();
	};
	ClanRoom.prototype.rejectChallengeFrom = function (otherClan) {
		if (!this.challengesFrom[otherClan.id]) return;

		delete this.challengesFrom[otherClan.id];
		otherClan.challengeTo = null;

		this.add("You have rejected " + otherClan.title + "'s challenge.");
		otherClan.add("||" + this.title + " has rejected your challenge.");

		this.updateChallenges();
		otherClan.updateChallenges();
	};
	ClanRoom.prototype.acceptChallengeFrom = function (otherClan) {
		if (!this.challengesFrom[otherClan.id]) return;
		if (this.currentWar) return;
		if (otherClan.currentWar) return;

		if (!this.isEnoughAvailableMembers()) return;
		if (!otherClan.isEnoughAvailableMembers()) {
			this.add("The other clan currently do not have enough available members for a war.");
			return;
		}

		var challenge = otherClan.challengeTo;
		delete this.challengesFrom[otherClan.id];
		otherClan.challengeTo = null;

		this.updateChallenges();
		otherClan.updateChallenges();

		var allies = this.getAvailableMembers();
		var opponents = otherClan.getAvailableMembers();
		var matchupsCount = Math.min(allies.length, opponents.length);

		var war = new War(otherClan, this, opponents.slice(0, matchupsCount), allies.slice(0, matchupsCount), challenge.format, otherClan, otherClan.onWarEnd.bind(otherClan));
		this.currentWar = war;
		otherClan.currentWar = war;
	};

	ClanRoom.prototype.onWarEnd = function (clanA, clanB, score) {
		var expectedScore = elo.getExpected(clanA.ratingData.rating, clanB.ratingData.rating);
		var oldRatingA = clanA.ratingData.rating;
		var oldRatingB = clanB.ratingData.rating;
		clanA.ratingData.rating = elo.updateRating(expectedScore, score, clanA.ratingData.rating);
		clanB.ratingData.rating = elo.updateRating(1 - expectedScore, 1 - score, clanB.ratingData.rating);
		if (clanA.ratingData.rating < 1000) clanA.ratingData.rating = 1000;
		if (clanB.ratingData.rating < 1000) clanB.ratingData.rating = 1000;

		if (score === 1) {
			++clanA.ratingData.wins;
			++clanB.ratingData.losses;
		} else if (score === 0) {
			++clanA.ratingData.losses;
			++clanB.ratingData.wins;
		} else {
			++clanA.ratingData.draws;
			++clanB.ratingData.draws;
		}

		Rooms.global.writeChatRoomData();

		this.add("||" + clanA.title + " has " + (["lost", "won"][score] || "drawn") + " the clan war against " + clanB.title + ".");
		this.add("|raw|<strong>" + Tools.escapeHTML(clanA.title) + ":</strong> " + oldRatingA + " &rarr; " + clanA.ratingData.rating + " (" + ratingToName(clanA.ratingData.rating) + ")");
		this.add("|raw|<strong>" + Tools.escapeHTML(clanB.title) + ":</strong> " + oldRatingB + " &rarr; " + clanB.ratingData.rating + " (" + ratingToName(clanB.ratingData.rating) + ")");
		this.update();

		clanA.endCurrentWar();
	};
	ClanRoom.prototype.endCurrentWar = function () {
		if (!this.currentWar) return;

		var otherClan = this.currentWar.clanA === this ? this.currentWar.clanB : this.currentWar.clanA;
		delete otherClan.currentWar;
		delete this.currentWar;
	};

	ClanRoom.prototype.destroy = function () {
		this.cancelChallengeTo();
		for (var c in this.challengesFrom) this.rejectChallengeFrom(c);
		this.endCurrentWar();

		Rooms.ChatRoom.prototype.destroy.call(this);
	};

	return ClanRoom;
})();

var War = exports.War = (function () {
	function War(clanA, clanB, battlersA, battlersB, format, room, onEnd) {
		this.clanA = clanA;
		this.clanB = clanB;
		this.battlersA = battlersA.map(toId).randomize();
		this.battlersB = battlersB.map(toId).randomize();
		this.format = format;
		this.room = room;
		this.onEnd = onEnd;

		this.matchups = {};
		for (var b = 0; b < this.battlersA.length; ++b) {
			var matchup = {from: this.battlersA[b], to: this.battlersB[b]};
			this.matchups[this.battlersA[b]] = matchup;
			this.matchups[this.battlersB[b]] = matchup;

			Users.getExact(this.battlersA[b]).joinRoom(this.room);
			Users.getExact(this.battlersB[b]).joinRoom(this.room);
		}
		this.remainingMatches = this.battlersA.length;

		this.score = 0; // Positive: clanA winning; Negative: clanB winning

		this.room.add('|raw|' +
			"<strong>A clan war between  " + Tools.escapeHTML(this.clanA.title) + " and " + Tools.escapeHTML(this.clanB.title) + " has started!</strong><br />" +
			this.getMatchups().map(function (matchup) {
				return '<strong>' + Tools.escapeHTML(matchup.from) + "</strong> vs <strong>" + Tools.escapeHTML(matchup.to);
			}).join('<br />')
		);
		this.room.update();
	}

	War.prototype.getMatchups = function () {
		var matchups = [];
		for (var m in this.matchups) {
			if (this.matchups[m].from === m) {
				matchups.push(this.matchups[m]);
			}
		}
		return matchups;
	};

	War.prototype.onBattleWin = function (userA, userB, score, format) {
		if (format !== this.format) return;

		var userAId = toId(userA);
		var userBId = toId(userB);

		var matchup = this.matchups[userAId];
		if (!matchup || (userBId !== matchup.from && userBId !== matchup.to) || matchup.isEnded) return;

		matchup.isEnded = true;
		--this.remainingMatches;

		if (userAId === matchup.to) {
			var tmp = userA;
			userA = userB;
			userB = tmp;
			score = 1 - score;
		}
		this.score += (score - 0.5) * 2;

		this.room.add("|raw|<strong>(" + Tools.escapeHTML(this.clanA.title) + " vs " + Tools.escapeHTML(this.clanB.title) + ") " + Tools.escapeHTML(userA.name) + " has " + (["lost", "won"][score] || "drawn") + " the clan war battle against " + Tools.escapeHTML(userB.name) + ".</strong>");
		this.room.update();

		if (this.remainingMatches === 0) {
			var overallScore = (this.score && this.score / Math.abs(this.score)) / 2 + 0.5;
			this.onEnd(this.clanA, this.clanB, overallScore);
		}
	};

	War.prototype.isEnded = function () {
		return this.remainingMatches === 0;
	};

	return War;
})();

var patchRooms = exports.patchRooms = function () {
	for (var r = 0; r < Rooms.global.chatRooms.length; ++r) {
		var room = Rooms.global.chatRooms[r];
		if (room.isClanRoom && !room.availableMembers) {
			var newRoom = new ClanRoom(room.title, room.chatRoomData);
			Rooms.global.chatRooms[r] = newRoom;
			Rooms.rooms[room.id] = newRoom;
		}
	}
};
patchRooms();

var getClans = exports.getClans = function () {
	var results = [];
	for (var r in Rooms.rooms)
		if (Rooms.rooms[r] instanceof ClanRoom)
			results.push(Rooms.rooms[r]);
	return results;
};
var getClan = exports.get = function (name) {
	var room = Rooms.get(toId(name));
	return room && room.isClanRoom ? room : null;
};
var getClansFromMember = exports.getFromMember = function (user) {
	var results = [];
	var userId = toId(user);
	for (var r in Rooms.rooms)
		if (Rooms.rooms[r] instanceof ClanRoom && Rooms.rooms[r].auth && Rooms.rooms[r].auth[userId])
			results.push(Rooms.rooms[r]);
	return results;
};

var createClan = exports.createClan = function (name) {
	if (Rooms.get(toId(name))) return false;
	if (!Rooms.global.addChatRoom(name)) return false;

	var room = Rooms.get(toId(name));
	room.isClanRoom = room.chatRoomData.isClanRoom = true;
	Rooms.global.writeChatRoomData();
	patchRooms();
	return room;
};
var deleteClan = exports.deleteClan = function (name) {
	var room = getClan(name);
	if (!room) return false;
	return Rooms.global.removeChatRoom(toId(name));
};

var oldWin = Rooms.BattleRoom.prototype.win;
Rooms.BattleRoom.prototype.win = function (winner) {
	var winnerId = toId(winner);
	var score = 0.5;
	if (winnerId === toId(this.p1)) {
		score = 1;
	} else if (winnerId === toId(this.p2)) {
		score = 0;
	}

	var clans = getClansFromMember(this.p1);
	for (var c = 0; c < clans.length; ++c) {
		if (clans[c].currentWar) {
			clans[c].currentWar.onBattleWin(this.p1, this.p2, score, this.format);
		}
	}

	return oldWin.call(this, winner);
};

exports.commands = {
	clanshelp: function () {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"/clans [name] - Gets information about all clans, or about the specified clan<br />" +
			"/waravailable - Sets yourself as available for clan wars for 5 minutes<br />" +
			"/createclan &lt;name> - Creates a clan<br />" +
			"/deleteclan &lt;name> - Deletes a clan<br />" +
			"/challengeclan &lt;clan> - Challenge another clan<br />" +
			"/cancelclanchallenge - Cancel your challenge<br />" +
			"/acceptclanwar &lt;clan> - Accept &lt;clan>'s challenge<br />" +
			"/rejectclanwar &lt;clan> - Reject &lt;clan>'s challenge<br />" +
			"/endclanwar - Ends the current war forcibly<br />" +
			"/clanwarmatchups - Shows the war battles that haven't yet been started<br />"
		);
	},

	clans: function (target, room, user, connection, cmd) {
		if (!this.canBroadcast()) return;
		target = target || cmd;

		var clans = [getClan(target)];
		if (!clans[0]) clans = getClansFromMember(target);
		if (!clans[0] && target.length > 0) {
			clans = [];
			var allClans = getClans();
			var targetId = toId(target);
			for (var c = 0; c < allClans.length; ++c) {
				if (allClans[c].id.slice(0, targetId.length) === targetId) {
					clans.push(allClans[c]);
				}
			}
		}
		if (!clans[0] && target.length > 0) return this.sendReply("No clan or clan member found under '" + target + "'.");

		if (!clans[0]) {
			this.sendReplyBox(
				"<strong>Clans:</strong><br />" +
				getClans().map(function (clan) {
					var result = clan.getRating();
					result.name = clan.title;
					result.id = clan.id;
					return result;
				}).sort(function (a, b) {
					return b.rating - a.rating;
				}).map(function (clan) {
					return '<a class="ilink" href="/' + clan.id + '"><strong>' + Tools.escapeHTML(clan.name) + ':</strong></a> ' + clan.rating + " (" + clan.ratingName + ") " + clan.wins + "/" + clan.losses + "/" + clan.draws;
				}).join('<br />')
			);
			return;
		}

		clans = clans.sort(function (a, b) {
			return a.id.localeCompare(b.id);
		});
		for (var c = 0; c < clans.length; ++c) {
			var clan = clans[c];
			var rating = clan.getRating();
			this.sendReplyBox(
				'<h1>' + Tools.escapeHTML(clan.title) + '</h1>' +
				(clan.introMessage || '') +
				'<hr />' +
				"<strong>Rating:</strong> " + rating.rating + " (" + rating.ratingName + ")<br />" +
				"<strong>Wins/Losses/Draws:</strong> " + rating.wins + "/" + rating.losses + "/" + rating.draws + '<br />' +
				"<strong>Members:</strong> " + Tools.escapeHTML(Object.keys(clan.auth || {}).sort().join(", ")) + '<br />' +
				"<button name=\"joinRoom\" value=\"" + clan.id + "\">Join</button>"
			);
		}
	},

	createclan: function (target) {
		if (!this.can('makeroom')) return;
		if (target.length < 2) {
			this.sendReply("The clan's name is too short.");
		} else if (!createClan(target)) {
			this.sendReply("Could not create the clan. Does a room by it's name already exist?");
		} else {
			this.sendReply("Clan: " + target + " successfully created.");
		}
	},

	deleteclan: function (target) {
		if (!this.can('makeroom')) return;
		if (!deleteClan(target)) {
			this.sendReply("Could not delete the clan. Did you spell it correctly?");
		} else {
			this.sendReply("Clan: " + target + " successfully deleted.");
		}
	},

	waravailable: function (target, room, user) {
		if (!room.isClanRoom) return this.sendReply("This is not a clan room.");
		var expiryTime = room.setMemberAvailable(user);
		if (!expiryTime) return this.sendReply("You are not a member of this clan.");
		this.sendReply("You have been marked available for this clan's wars for " + (expiryTime - Date.now()).duration() + ".");
	},

	challengeclan: function (target, room) {
		if (!room.isClanRoom) return this.sendReply("This is not a clan room.");
		if (!this.can('clans', room)) return;
		if (room.currentWar) return this.sendReply("You are already at war.");

		var otherClan = getClan(target);
		if (!otherClan) return this.sendReply("The clan does not exist.");
		if (otherClan === room) return this.sendReply("You cannot challenge your own clan.");

		room.makeChallenge(otherClan, 'ou');
	},

	cancelclanchallenge: function (target, room) {
		if (!room.isClanRoom) return this.sendReply("This is not a clan room.");
		if (!this.can('clans', room)) return;
		if (!room.challengeTo) return this.sendReply("This clan isn't currently challenging anyone.");

		room.cancelChallengeTo();
	},

	acceptclanwar: function (target, room) {
		if (!room.isClanRoom) return this.sendReply("This is not a clan room.");
		if (!this.can('clans', room)) return;
		if (room.currentWar) return this.sendReply("You are already at war.");

		var otherClan = getClan(target);
		if (!otherClan) return this.sendReply("The clan does not exist");
		if (!room.challengesFrom[otherClan.id]) return this.sendReply("||" + otherClan.title + " is not challenging you right now.");

		room.acceptChallengeFrom(otherClan);
	},

	rejectclanwar: function (target, room) {
		if (!room.isClanRoom) return this.sendReply("This is not a clan room.");
		if (!this.can('clans', room)) return;

		var otherClan = getClan(target);
		if (!otherClan) return this.sendReply("The clan does not exist");

		room.rejectChallengeFrom(otherClan);
	},

	endclanwar: function (target, room) {
		if (!room.isClanRoom) return this.sendReply("This is not a clan room.");
		if (!this.can('clans', room)) return;
		if (!room.currentWar) return this.sendReply("This clan currently isn't at war.");
		if (room.currentWar.room !== room) return this.sendReply("This room is not hosting a war.");

		room.endCurrentWar();
		room.add("The clan war was forcibly ended.");
	},

	clanwarmatchups: function (target, room) {
		if (!this.canBroadcast()) return;
		if (!room.isClanRoom) return this.sendReply("This is not a clan room.");
		if (!room.currentWar) return this.sendReply("This clan currently isn't at war.");

		this.sendReplyBox(
			"<strong>Clan war matchups between " + Tools.escapeHTML(room.currentWar.clanA.title) + " and " + Tools.escapeHTML(room.currentWar.clanB.title) + ':</strong><br />' +
			room.currentWar.getMatchups().map(function (matchup) {
				return matchup.isEnded ? "" : '<strong>' + Tools.escapeHTML(matchup.from) + "</strong> vs <strong>" + Tools.escapeHTML(matchup.to);
			}).join('<br />')
		);
	}
};
