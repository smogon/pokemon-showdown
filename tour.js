/*********************************************************
 * Functions
 *********************************************************/
exports.tour = function(t) {
  if (typeof t != "undefined") var tour = t; else var tour = new Object();
	var tourStuff = {
		tiers: new Array(),
		timerLoop: function() {
			setTimeout(function() {
				tour.currentSeconds += 1;
				for (var i in tour.timers) {
					var c = tour.timers[i];
					var secondsNeeded = c.time * 60;
					var secondsElapsed = tour.currentSeconds - c.startTime;
					var difference = secondsNeeded - secondsElapsed;
					var fraction = secondsElapsed / secondsNeeded;
					function sendIt(end) {
						if (end) {
							Rooms.rooms[i].addRaw("<h3>The tournament was canceled because of lack of players.</h3>");
							return;
						}
						Rooms.rooms[i].addRaw("<i>The tournament will begin in " + difference + " second" + (difference == 1 ? '' : 's') + ".</i>");
					}
					if (fraction == 0.25 || fraction == 0.5 || fraction == 0.75) sendIt();
					if (fraction >= 1) {
						if (tour[i].players.length < 3) {
							tour.reset(i);
							sendIt(true);
						}
						else {
							if (tour[i].status == 1) {
								tour[i].size = tour[i].players.length;
								tour.start(i);
							}
						}
						delete tour.timers[i];
					}
				}
				tour.timerLoop();
			}, 1000);
		},
		reset: function(rid) {
			tour[rid] = {
				status: 0,
				tier: undefined,
				size: 0,
				roundNum: 0,
				players: new Array(),
				winners: new Array(),
				losers: new Array(),
				round: new Array(),
				history: new Array(),
				byes: new Array(),
				playerslogged: new Array(),
				battles: new Object(),
				battlesended: new Array(),
				battlesinvtie: new Array(),
				question: undefined,
				answerList: new Array(),
				answers: new Object()
			};
		},
		shuffle: function(list) {
		  var i, j, t;
		  for (i = 1; i < list.length; i++) {
			j = Math.floor(Math.random()*(1+i));  // choose j in [0..i]
			if (j != i) {
				t = list[i];                        // swap list[i] and list[j]
				list[i] = list[j];
				list[j] = t;
			}
		  }
		  return list;
		},
		splint: function(target) {
			//splittyDiddles
			var cmdArr =  target.split(",");
			for (var i = 0; i < cmdArr.length; i++) cmdArr[i] = cmdArr[i].trim();
			return cmdArr;
		},
		username: function(uid) {
			if (Users.get(uid)) {
				var n = Users.get(uid).name;
				if (toId(n) != uid) return uid;
				return n;
			} else {
				return uid;
			}
		},
		userauth: function(user, room) {
			if (!config.tourauth && user.can('broadcast')) return true;
			if (config.tourauth && config.groupsranking.indexOf(user.group) >= config.groupsranking.indexOf(config.tourauth)) return true;
			if (room.auth && room.auth[user.userid]) return true;
			return false;
		},
		join: function(uid, rid) {
			var players = tour[rid].players;
			var init = false;
			checkaltslabel:
			{
				if (config.tourallowalts){
					for (var i=0; i<players.length; i++) {
						if (players[i] == uid) {
							init = true;
							break checkaltslabel;
						}
					}
				} else {
					for (var i=0; i<players.length; i++) {
						if (players[i] == uid) {
							init = true;
							break checkaltslabel;
						}
					}
					for (var i=0; i<players.length; i++) {
						for (var j=0; j<Users.get(uid).getAlts().length; j++) {
							if (players[i] == toId(Users.get(uid).getAlts()[j])) {
								init = true;
								break checkaltslabel;
							}
						}
					}
					for (var i=0; i<players.length; i++) {
						for (var j in Users.get(uid).prevNames) {
							if (players[i] == toId(j)) {
								init = true;
								break checkaltslabel;
							}
						}
					}
					for (var i=0; i<players.length; i++) {
						for (var j=0; j<Users.get(uid).getAlts().length; j++) {
							for (var k in Users.get(Users.get(uid).getAlts()[j]).prevNames) {
								if (players[i] == toId(k)) {
									init = true;
									break checkaltslabel;
								}
							}
						}
					}

				}
			}
			if (init) return false;
			players.push(uid);
			return true;
		},
		leave: function(uid, rid) {
			var players = tour[rid].players;
			var init = 0;
			var key;
			for (var i in players) {
				if (players[i] == uid) {
					init = 1;
					key = i;
					break;
				}
			}
			if (!init) return false;
			players.splice(key, 1);
			return true;
		},
		lose: function(uid, rid) {
			/*
				if couldn't disqualify return false
				if could disqualify return the opponents userid
			*/
			var r = tour[rid].round;
			for (var i in r) {
				if (r[i][0] == uid) {
					var key = i;
					var p = 0;
					break;
				} else if (r[i][1] == uid) {
					var key = i;
					var p = 1;
					break;
				}
			}
			if (!key) {
				//user not in tour
				return -1;
			}
			else {
				if (r[key][1] == undefined) {
					//no opponent
					return 0;
				}
				if (r[key][2] != undefined && r[key][2] != -1) {
					//already did match
					return 1;
				}
				var winner = 0;
				var loser = 1;
				if (p == 0) {
					winner = 1;
					loser = 0;
				}
				r[key][2] = r[key][winner];
				tour[rid].winners.push(r[key][winner]);
				tour[rid].losers.push(r[key][loser]);
				tour[rid].history.push(r[key][winner] + "|" + r[key][loser]);
				return r[key][winner];
			}
		},
		start: function(rid) {
			var isValid = false;
			var numByes = 0;
			if (tour[rid].size <= 4) {
					if (tour[rid].size % 2 == 0) {
						isValid = true;
					} else {
						isValid = true;
						numByes = 1;
				}
			}
			do {
				var numPlayers = ((tour[rid].size - numByes) / 2 + numByes);
				do {
					numPlayers = numPlayers / 2;
				}
				while (numPlayers > 1);
				if (numPlayers == 1) isValid = true; else numByes += 1;
			}
			while (isValid == false);
			var r = tour[rid].round;
			var sList = tour[rid].players;
			tour.shuffle(sList);
			var key = 0;
			do
				{
					if (numByes > 0) {
						r.push([sList[key], undefined, sList[key]]);
						tour[rid].winners.push(sList[key]);
						tour[rid].byes.push(sList[key]);
						numByes -= 1
						key++;
					}
				}
			while (numByes > 0);
			do
				{
					var match = new Array(); //[p1, p2, result]
					match.push(sList[key]);
					key++;
					match.push(sList[key]);
					key++;
					match.push(undefined);
					r.push(match);
				}
			while (key != sList.length);
			tour[rid].roundNum++;
			tour[rid].status = 2;
			tour.startRaw(rid);
		},
		startRaw: function(i) {
			var room = Rooms.rooms[i];
			var html = '<hr /><h3><font color="green">Round '+ tour[room.id].roundNum +'!</font></h3><font color="blue"><b>TIER:</b></font> ' + Tools.data.Formats[tour[room.id].tier].name + "<hr /><center>";
			var round = tour[room.id].round;
			var firstMatch = false;
			for (var i in round) {
				if (!round[i][1]) {
						var p1n = tour.username(round[i][0]);
						if (p1n.substr(0, 6) === 'Guest ') p1n = round[i][0];
						html += "<font color=\"red\">" + clean(p1n) + " advances to the next round automatically!</font><br />";
				}
				else {
					var p1n = tour.username(round[i][0]);
					var p2n = tour.username(round[i][1]);
					if (p1n.substr(0, 6) === 'Guest ') p1n = round[i][0];
					if (p2n.substr(0, 6) === 'Guest ') p2n = round[i][1];
					var tabla = "";if (!firstMatch) {var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";firstMatch = true;}
					html += tabla + "<tr><td align=right>" + clean(p1n) + "</td><td>&nbsp;VS&nbsp;</td><td>" + clean(p2n) + "</td></tr>";
				}
			}
			room.addRaw(html + "</table>");
		},
		nextRound: function(rid) {
			var w = tour[rid].winners;
			var l = tour[rid].losers;
			var b = tour[rid].byes;
			tour[rid].roundNum++;
			tour[rid].history.push(tour[rid].round);
			tour[rid].round = new Array();
			tour[rid].losers = new Array();
			tour[rid].winners = new Array();
			var firstMatch = false;
			if (w.length == 1) {
				//end tour
				Rooms.rooms[rid].addRaw('<h2><font color="green">Congratulations <font color="black">' + Users.users[w[0]].name + '</font>!  You have won the ' + Tools.data.Formats[tour[rid].tier].name + ' Tournament!</font></h2>' + '<br><font color="blue"><b>SECOND PLACE:</b></font> ' + Users.users[l[0]].name + '<hr />');
				tour[rid].status = 0;
			} else {
				var html = '<hr /><h3><font color="green">Round '+ tour[rid].roundNum +'!</font></h3><font color="blue"><b>TIER:</b></font> ' + Tools.data.Formats[tour[rid].tier].name + "<hr /><center>";
				var pBye = new Array();
				var pNorm = new Array();
				var p = new Array();
				for (var i in w) {
					var byer = false;
					for (var x in b) {
						if (b[x] == w[i]) {
							byer = true;
							pBye.push(w[i]);
						}
					}
					if (!byer) {
						pNorm.push(w[i]);
					}
				}
				for (var i in pBye) {
					p.push(pBye[i]);
					if (typeof pNorm[i] != "undefined") {
						p.push(pNorm[i]);
						pNorm.splice(i, 1);
					}
				}
				for (var i in pNorm) p.push(pNorm[i]);
				for (var i = 0; p.length / 2 > i; i++) {
					var p1 = i * 2;
					var p2 = p1 + 1;
					tour[rid].round.push([p[p1], p[p2], undefined]);
					var p1n = tour.username(p[p1]);
					var p2n = tour.username(p[p2]);
					if (p1n.substr(0, 6) === 'Guest ') p1n = p[p1];
					if (p2n.substr(0, 6) === 'Guest ') p2n = p[p2];
					var tabla = "";if (!firstMatch) {var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";firstMatch = true;}
					html += tabla + "<tr><td align=right>" + clean(p1n) + "</td><td>&nbsp;VS&nbsp;</td><td>" + clean(p2n) + "</td></tr>";
				}
				Rooms.rooms[rid].addRaw(html + "</table>");
			}
			tour[rid].battlesended = [];
		},
	};

	for (var i in tourStuff) tour[i] = tourStuff[i];
	for (var i in Tools.data.Formats) {
			if (Tools.data.Formats[i].effectType == 'Format' && Tools.data.Formats[i].challengeShow) {
				tour.tiers.push(i);
			}
	}
	if (typeof tour.timers == "undefined") tour.timers = new Object();
	if (typeof tour.currentSeconds == "undefined") {
		tour.currentSeconds = 0;
		tour.timerLoop();
	}
	for (var i in Rooms.rooms) {
		if (Rooms.rooms[i].type == "chat" && !tour[i]) {
			tour[i] = new Object();
			tour.reset(i);
		}
	}
	return tour;
};
function clean(string) {
	var entityMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': '&quot;',
		"'": '&#39;',
		"/": '&#x2F;'
	};
	return String(string).replace(/[&<>"'\/]/g, function (s) {
		return entityMap[s];
	});
}
/*********************************************************
 * Commands
 *********************************************************/
var cmds = {
	tour: function(target, room, user, connection) {
		if (target == "update" && this.can('hotpatch')) {
			CommandParser.uncacheTree('./tour.js');
			tour = require('./tour.js').tour(tour);
			return this.sendReply('Tournament scripts were updated.');
		}
		if (!tour.userauth(user,room)) return this.parse('/tours');
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		var rid = room.id;
		if (tour[rid].status != 0) return this.sendReply('There is already a tournament running, or there is one in a signup phase.');
		if (!target) return this.sendReply('Proper syntax for this command: /tour tier, size');
		var targets = tour.splint(target);
		if (targets.length != 2) return this.sendReply('Proper syntax for this command: /tour tier, size');
		var tierMatch = false;
		var tempTourTier = '';
		for (var i = 0; i < tour.tiers.length; i++) {
			if (toId(targets[0]) == tour.tiers[i]) {
				tierMatch = true;
				tempTourTier = tour.tiers[i];
			}
		}
		if (!tierMatch) return this.sendReply('Please use one of the following tiers: ' + tour.tiers.join(','));
		if (targets[1].split('minut').length - 1 > 0) {
			targets[1] = parseInt(targets[1]);
			if (isNaN(targets[1]) || !targets[1]) return this.sendReply('/tour tier, NUMBER minutes');
			targets[1] = Math.ceil(targets[1]);
			if (targets[1] < 0) return this.sendReply('Why would you want to schedule a tournament for the past?');
			if (targets[1] === 0) return this.sendReply('Please set a valid amount of time.');
			tour.timers[rid] = {
				time: targets[1],
				startTime: tour.currentSeconds
			};
			targets[1] = Infinity;
		}
		else {
			targets[1] = parseInt(targets[1]);
		}
		if (isNaN(targets[1])) return this.sendReply('Proper syntax for this command: /tour tier, size');
		if (targets[1] < 3) return this.sendReply('Tournaments must contain 3 or more people.');

		this.parse('/endpoll');
		tour.reset(rid);
		tour[rid].tier = tempTourTier;
		tour[rid].size = targets[1];
		tour[rid].status = 1;
		tour[rid].players = new Array();

		Rooms.rooms[rid].addRaw('<hr /><h2><font color="green">' + sanitize(user.name) + ' has started a ' + Tools.data.Formats[tempTourTier].name + ' Tournament.</font> <font color="red">/j</font> <font color="green">to join!</font></h2><b><font color="blueviolet">PLAYERS:</font></b> ' + targets[1] + '<br /><font color="blue"><b>TIER:</b></font> ' + Tools.data.Formats[tempTourTier].name + '<hr />');
		if (tour.timers[rid]) Rooms.rooms[rid].addRaw('<i>The tournament will begin in ' + tour.timers[rid].time + ' minute' + (tour.timers[rid].time == 1 ? '' : 's') + '.<i>');
	},

	endtour: function(target, room, user, connection) {
		if (!tour.userauth(user,room)) return this.sendReply('You do not have enough authority to use this command.');
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined || tour[room.id].status == 0) return this.sendReply('There is no active tournament.');
		tour[room.id].status = 0;
		delete tour.timers[room.id];
		room.addRaw('<h2><b>' + user.name + '</b> has ended the tournament.</h2>');
	},

	toursize: function(target, room, user, connection) {
		if (!tour.userauth(user,room)) return this.sendReply('You do not have enough authority to use this command.');
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined) return this.sendReply('There is no active tournament in this room.');
		if (tour[room.id].status > 1) return this.sendReply('The tournament size cannot be changed now!');
		if (tour.timers[room.id]) return this.sendReply('This tournament has an open number of participants. It cannot be resized');
		if (!target) return this.sendReply('Proper syntax for this command: /toursize size');
		target = parseInt(target);
		if (isNaN(target)) return this.sendReply('Proper syntax for this command: /tour size');
		if (target < 3) return this.sendReply('A tournament must have at least 3 people in it.');
		if (target < tour[room.id].players.length) return this.sendReply('Target size must be greater than or equal to the amount of players in the tournament.');
		tour[room.id].size = target;
		room.addRaw('<b>' + user.name + '</b> has changed the tournament size to: ' + target + '. <b><i>' + (target - tour[room.id].players.length) + ' slot' + ( ( target - tour[room.id].players.length ) == 1 ? '' : 's') + ' remaining.</b></i>');
		if (target == tour[room.id].players.length) tour.start(room.id);
	},

	tourtime: function(target, room, user, connection) {
		if (!tour.userauth(user,room)) return this.sendReply('You do not have enough authority to use this command.');
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined) return this.sendReply('There is no active tournament in this room.');
		if (tour[room.id].status > 1) return this.sendReply('The tournament size cannot be changed now!');
		if (!tour.timers[room.id]) return this.sendReply('This tournament is not running under a clock!');
		if (!target) return this.sendReply('Proper syntax for this command: /tourtime time');
		target = parseInt(target);
		if (isNaN(target)) return this.sendReply('Proper syntax for this command: /tourtime time');
		if (target === 0) return this.sendReply('You cannot set the time to 0.');
		target = Math.ceil(target);
		tour.timers[room.id].time = target;
		tour.timers[room.id].startTime = tour.currentSeconds;
		room.addRaw('<b>' + user.name + '</b> has changed the remaining time for registering to the tournament to: ' + target + ' minute' + (target === 1 ? '' : 's') + '.');
		if (target === 0) tour.start(room.id);
	},

	jt: 'j',
	jointour: 'j',
	j: function(target, room, user, connection) {
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined || tour[room.id].status == 0) return this.sendReply('There is no active tournament to join.');
		if (tour[room.id].status == 2) return this.sendReply('Signups for the current tournament are over.');
		if (tour.join(user.userid, room.id)) {

			var remslots = tour[room.id].size - tour[room.id].players.length;
			// these three assignments (natural, natural, boolean) are done as wished
			var pplogmarg = Math.ceil(Math.sqrt(tour[room.id].size) / 2);
			var logperiod = Math.ceil(Math.sqrt(tour[room.id].size));
			var perplayerlog = ( ( tour[room.id].players.length <= pplogmarg ) || ( remslots + 1 <= pplogmarg ) );
			//

			if (perplayerlog) {
				room.addRaw('<b>' + user.name + '</b> has joined the tournament. <b><i>' + remslots + ' slot' + ( remslots == 1 ? '' : 's') + ' remaining.</b></i>');
				tour[room.id].playerslogged.push(user.userid);
			} else if ( (tour[room.id].players.length - tour[room.id].playerslogged.length == logperiod) || ( remslots <= pplogmarg ) ) {
				if (tour[room.id].players.length == tour[room.id].playerslogged.length + 1) {
					room.addRaw('<b>' + user.name + '</b> has joined the tournament. <b><i>' + remslots + ' slot' + ( remslots == 1 ? '' : 's') + ' remaining.</b></i>');
					tour[room.id].playerslogged.push(user.userid);
				} else {
					var someid = tour[room.id].players[tour[room.id].playerslogged.length];
					var prelistnames = '<b>' + tour.username(someid) + '</b>';
					for (var i = tour[room.id].playerslogged.length + 1; i < tour[room.id].players.length - 1; i++) {
						someid = tour[room.id].players[i];
						prelistnames = prelistnames + ', <b>' + tour.username(someid) + '</b>';
					}
					someid = tour[room.id].players[tour[room.id].players.length - 1];
					var listnames = prelistnames + ' and <b>' + tour.username(someid) + '</b>';
					room.addRaw(listnames + ' have joined the tournament. <b><i>' + remslots + ' slot' + ( remslots == 1 ? '' : 's') + ' remaining.</b></i>');

					tour[room.id].playerslogged.push(tour[room.id].players[tour[room.id].playerslogged.length]);
					for (var i = tour[room.id].playerslogged.length; i < tour[room.id].players.length - 1; i++) { //the length is disturbed by the push above
						tour[room.id].playerslogged.push(tour[room.id].players[i]);
					}
					tour[room.id].playerslogged.push(tour[room.id].players[tour[room.id].players.length - 1]);
				}
			} else {
				this.sendReply('You have succesfully joined the tournament. ' + remslots + ' slot' + ( remslots == 1 ? '' : 's') + ' remaining.');
			}
			if (tour[room.id].size == tour[room.id].players.length) tour.start(room.id);
		} else {
			return this.sendReply('You could not enter the tournament. You may already be in the tournament. Type /l if you want to leave the tournament.');
		}
	},

	forcejoin: 'fj',
	fj: function(target, room, user, connection) {
		if (!user.can('forcejoin')) return this.sendReply('You do not have enough authority to use this command.');
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined || tour[room.id].status == 0 || tour[room.id].status == 2) return this.sendReply('There is no tournament in a sign-up phase.');
		if (!target) return this.sendReply('Please specify a user who you\'d like to participate.');
		var targetUser = Users.get(target);
		if (targetUser) {
			target = targetUser.userid;
		}
		else {
			return this.sendReply('The user \'' + target + '\' doesn\'t exist.');
		}
		if (tour.join(target, room.id)) {

			var remslots = tour[room.id].size - tour[room.id].players.length;
			if (tour[room.id].players.length == tour[room.id].playerslogged.length + 1) {
				room.addRaw(user.name + ' has forced <b>' + tour.username(target) + '</b> to join the tournament. <b><i>' + remslots + ' slot' + ( remslots == 1 ? '' : 's') + ' remaining.</b></i>');
				tour[room.id].playerslogged.push(target);
			} else if (tour[room.id].players.length == tour[room.id].playerslogged.length + 2) {
				var someid = tour[room.id].players[tour[room.id].playerslogged.length];
				room.addRaw('<b>' + tour.username(someid) + '</b> has joined the tournament. <b><i>' + (remslots + 1) + ' slot' + ( remslots === 0 ? '' : 's') + ' remaining.</b></i>');
				room.addRaw(user.name + ' has forced <b>' + tour.username(target) + '</b> to join the tournament. <b><i>' + remslots + ' slot' + ( remslots == 1 ? '' : 's') + ' remaining.</b></i>');
				tour[room.id].playerslogged.push(someid);
				tour[room.id].playerslogged.push(target);
			} else {
				var someid = tour[room.id].players[tour[room.id].playerslogged.length];
				var prelistnames = '<b>' + tour.username(someid) + '</b>';
				for (var i = tour[room.id].playerslogged.length + 1; i < tour[room.id].players.length - 2; i++) {
					someid = tour[room.id].players[i];
					prelistnames = prelistnames + ', <b>' + tour.username(someid) + '</b>';
				}
				someid = tour[room.id].players[tour[room.id].players.length - 2];
				var listnames = prelistnames + ' and <b>' + tour.username(someid) + '</b>';

				room.addRaw(listnames + ' have joined the tournament. <b><i>' + (remslots + 1) + ' slot' + ( remslots === 0 ? '' : 's') + ' remaining.</b></i>');
				room.addRaw(user.name + ' has forced <b>' + tour.username(target) + '</b> to join the tournament. <b><i>' + remslots + ' slot' + ( remslots == 1 ? '' : 's') + ' remaining.</b></i>');

				tour[room.id].playerslogged.push(tour[room.id].players[tour[room.id].playerslogged.length]);
				for (var i = tour[room.id].playerslogged.length; i < tour[room.id].players.length - 1; i++) {
					tour[room.id].playerslogged.push(tour[room.id].players[i]);
				}
				tour[room.id].playerslogged.push(tour[room.id].players[tour[room.id].players.length - 1]);
			}
			if (tour[room.id].size == tour[room.id].players.length) tour.start(room.id);
		}
		else {
			return this.sendReply('The user that you specified is already in the tournament.');
		}
	},

	lt: 'l',
	leavetour: 'l',
	l: function(target, room, user, connection) {
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined || tour[room.id].status == 0) return this.sendReply('There is no active tournament to leave.');
		var spotRemover = false;
		if (tour[room.id].status == 1) {
			if (tour.leave(user.userid, room.id)) {
				var remslots = tour[room.id].size - tour[room.id].players.length;
				if (tour[room.id].playerslogged.indexOf(user.userid) == -1) {
					return this.sendReply('You have left the tournament. ' + remslots + ' slot' + ( remslots == 1 ? '' : 's') + ' remaining.');
				} else {
					if (tour[room.id].players.length + 1 == tour[room.id].playerslogged.length) {
					} else if (tour[room.id].players.length == tour[room.id].playerslogged.length) {
						tour[room.id].playerslogged.push(user.userid);
					} else if (tour[room.id].players.length == tour[room.id].playerslogged.length + 1) {
						room.addRaw('<b>' + tour[room.id].players[tour[room.id].playerslogged.length] + '</b> has joined the tournament. <b><i>' + ( remslots - 1 ) + ' slot' + ( remslots == 2 ? '' : 's') + ' remaining.</b></i>');
						tour[room.id].playerslogged.push(user.userid);
					} else {
						var someid = tour[room.id].players[tour[room.id].playerslogged.length];
						var prelistnames = '<b>' + tour.username(someid) + '</b>';
						for (var i = tour[room.id].playerslogged.length + 1; i < tour[room.id].players.length - 1; i++) {
							someid = tour[room.id].players[i];
							prelistnames = prelistnames + ', <b>' + tour.username(someid) + '</b>';
						}
						someid = tour[room.id].players[tour[room.id].players.length - 1];
						var listnames = prelistnames + ' and <b>' + tour.username(someid) + '</b>';
						room.addRaw(listnames + ' have joined the tournament. <b><i>' + (remslots - 1) + ' slot' + ( remslots == 2 ? '' : 's') + ' remaining.</b></i>');

						tour[room.id].playerslogged.push(tour[room.id].players[tour[room.id].playerslogged.length]);
						for (var i = tour[room.id].playerslogged.length; i < tour[room.id].players.length - 1; i++) { //the length is disturbed by the push above
							tour[room.id].playerslogged.push(tour[room.id].players[i]);
						}
						tour[room.id].playerslogged.push(tour[room.id].players[tour[room.id].players.length - 1]);
					}
					tour[room.id].playerslogged.splice(tour[room.id].playerslogged.indexOf(user.userid), 1);
					room.addRaw('<b>' + user.name + '</b> has left the tournament. <b><i>' + remslots + ' slot' + ( remslots == 1 ? '' : 's') + ' remaining.</b></i>');
				}
			}
			else {
				return this.sendReply("You're not in the tournament.");
			}
		}
		else {
			var dqopp = tour.lose(user.userid, room.id);
			if (dqopp && dqopp != -1 && dqopp != 1) {
				room.addRaw('<b>' + user.userid + '</b> has left the tournament. <b>' + dqopp + '</b> will advance.');
				var r = tour[room.id].round;
				var c = 0;
				for (var i in r) {
					if (r[i][2] && r[i][2] != -1) c++;
				}
				if (r.length == c) tour.nextRound(room.id);
			}
			else {
				if (dqopp == 1) return this.sendReply("You've already done your match. Wait till next round to leave.");
				if (dqopp == 0 || dqopp == -1) return this.sendReply("You're not in the tournament or your opponent is unavailable.");
			}
		}
	},

	forceleave: 'fl',
	fl: function(target, room, user, connection) {
		if (!user.can('forcejoin')) return this.sendReply('You do not have enough authority to use this command.');
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined || tour[room.id].status == 0 || tour[room.id].status == 2) return this.sendReply('There is no tournament in a sign-up phase.  Use /dq username if you wish to remove someone in an active tournament.');
		if (!target) return this.sendReply('Please specify a user to kick from this signup.');
		var targetUser = Users.get(target);
		if (targetUser) {
			target = targetUser.userid;
		}
		else {
			return this.sendReply('The user \'' + target + '\' doesn\'t exist.');
		}
		if (tour.leave(target, room.id)) {
			var remslots = tour[room.id].size - tour[room.id].players.length;
			if (tour[room.id].playerslogged.indexOf(target) == -1) {
				room.addRaw('<b>' + tour.username(target) + '</b> joined the tournament but was forced to leave by ' + user.name + '. <b><i>' + remslots + ' slot' + ( remslots == 1 ? '' : 's') + ' remaining.</b></i>');
			}
			else {
				if (tour[room.id].players.length + 1 == tour[room.id].playerslogged.length) {
				} else if (tour[room.id].players.length == tour[room.id].playerslogged.length) {
					room.addRaw('<b>' + tour.username(target) + '</b> has joined the tournament. <b><i>' + ( remslots - 1) + ' slot' + ( remslots == 2 ? '' : 's') + ' remaining.</b></i>');
					tour[room.id].playerslogged.push(target);
				} else if (tour[room.id].players.length == tour[room.id].playerslogged.length + 1) {
					room.addRaw('<b>' + tour[room.id].players[tour[room.id].playerslogged.length] + '</b> has joined the tournament. <b><i>' + ( remslots - 1 ) + ' slot' + ( remslots == 2 ? '' : 's') + ' remaining.</b></i>');
					tour[room.id].playerslogged.push(target);
				} else {
					var someid = tour[room.id].players[tour[room.id].playerslogged.length];
					var prelistnames = '<b>' + tour.username(someid) + '</b>';
					for (var i = tour[room.id].playerslogged.length + 1; i < tour[room.id].players.length - 1; i++) {
						someid = tour[room.id].players[i];
						prelistnames = prelistnames + ', <b>' + tour.username(someid) + '</b>';
					}
					someid = tour[room.id].players[tour[room.id].players.length - 1];
					var listnames = prelistnames + ' and <b>' + tour.username(someid) + '</b>';
					room.addRaw(listnames + ' have joined the tournament. <b><i>' + (remslots - 1) + ' slot' + ( remslots == 2 ? '' : 's') + ' remaining.</b></i>');

					tour[room.id].playerslogged.push(tour[room.id].players[tour[room.id].playerslogged.length]);
					for (var i = tour[room.id].playerslogged.length; i < tour[room.id].players.length - 1; i++) { //the length is disturbed by the push above
						tour[room.id].playerslogged.push(tour[room.id].players[i]);
					}
					tour[room.id].playerslogged.push(tour[room.id].players[tour[room.id].players.length - 1]);
				}
				tour[room.id].playerslogged.splice(tour[room.id].playerslogged.indexOf(target), 1);
				room.addRaw(user.name + ' has forced <b>' + tour.username(target) + '</b> to leave the tournament. <b><i>' + remslots + ' slot' + ( remslots == 1 ? '' : 's') + ' remaining.</b></i>');
			}
		}
		else {
			return this.sendReply('The user that you specified is not in the tournament.');
		}
	},

	remind: function(target, room, user, connection) {
		if (!tour.userauth(user,room)) return this.sendReply('You do not have enough authority to use this command.');
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined) return this.sendReply('There is no active tournament in this room.');
		if (tour[room.id].status != 1) return this.sendReply('There is no tournament in its sign up phase.');
		var remslots = tour[room.id].size - tour[room.id].players.length;
		if (tour[room.id].players.length == tour[room.id].playerslogged.length) {
		} else if (tour[room.id].players.length == tour[room.id].playerslogged.length + 1) {
			var someid = tour[room.id].players[tour[room.id].playerslogged.length];
			room.addRaw('<b>' + tour.username(someid) + '</b> has joined the tournament. <b><i>' + remslots + ' slot' + ( remslots == 1 ? '' : 's') + ' remaining.</b></i>');
			tour[room.id].playerslogged.push(someid);
		} else {
			var someid = tour[room.id].players[tour[room.id].playerslogged.length];
			var prelistnames = '<b>' + tour.username(someid) + '</b>';
			for (var i = tour[room.id].playerslogged.length + 1; i < tour[room.id].players.length - 1; i++) {
				someid = tour[room.id].players[i];
				prelistnames = prelistnames + ', <b>' + tour.username(someid) + '</b>';
			}
			someid = tour[room.id].players[tour[room.id].players.length - 1];
			var listnames = prelistnames + ' and <b>' + tour.username(someid) + '</b>';
			room.addRaw(listnames + ' have joined the tournament. <b><i>' + remslots + ' slot' + ( remslots == 1 ? '' : 's') + ' remaining.</b></i>');

			tour[room.id].playerslogged.push(tour[room.id].players[tour[room.id].playerslogged.length]);
			for (var i = tour[room.id].playerslogged.length; i < tour[room.id].players.length - 1; i++) { //the length is disturbed by the push above
				tour[room.id].playerslogged.push(tour[room.id].players[i]);
			}
			tour[room.id].playerslogged.push(tour[room.id].players[tour[room.id].players.length - 1]);
		}
		room.addRaw('<hr /><h2><font color="green">Please sign up for the ' + Tools.data.Formats[tour[room.id].tier].name + ' Tournament.</font> <font color="red">/j</font> <font color="green">to join!</font></h2><b><font color="blueviolet">PLAYERS:</font></b> ' + tour[room.id].size + '<br /><font color="blue"><b>TIER:</b></font> ' + Tools.data.Formats[tour[room.id].tier].name + '<hr />');
	},

	viewround: function(target, room, user, connection) {
		if (!this.canBroadcast()) return;
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined) return this.sendReply('There is no active tournament in this room.');
		if (tour[room.id].status < 2) return this.sendReply('There is no tournament out of its signup phase.');
		var html = '<hr /><h3><font color="green">Round '+ tour[room.id].roundNum + '!</font></h3><font color="blue"><b>TIER:</b></font> ' + Tools.data.Formats[tour[room.id].tier].name + "<hr /><center><small><font color=red>Red</font> = lost, <font color=green>Green</font> = won, <a class='ilink'><b>URL</b></a> = battling</small><center>";
		var r = tour[room.id].round;
		var firstMatch = false;
		for (var i in r) {
			if (!r[i][1]) {
				//bye
				var byer = tour.username(r[i][0]);
				html += "<font color=\"red\">" + clean(byer) + " advances to the next round automatically.</font><br />";
			}
			else {
				if (r[i][2] == undefined) {
					//haven't started
					var p1n = tour.username(r[i][0]);
					var p2n = tour.username(r[i][1]);
					if (p1n.substr(0, 6) === 'Guest ') p1n = r[i][0];
					if (p2n.substr(0, 6) === 'Guest ') p2n = r[i][1];
					var tabla = "";if (!firstMatch) {var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";firstMatch = true;}
					html += tabla + "<tr><td align=right>" + clean(p1n) + "</td><td>&nbsp;VS&nbsp;</td><td>" + clean(p2n) + "</td></tr>";
				}
				else if (r[i][2] == -1) {
					//currently battling
					var p1n = tour.username(r[i][0]);
					var p2n = tour.username(r[i][1]);
					if (p1n.substr(0, 6) === 'Guest ') p1n = r[i][0];
					if (p2n.substr(0, 6) === 'Guest ') p2n = r[i][1];
					var tabla = "";if (!firstMatch) {var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";firstMatch = true;}
					var tourbattle = tour[room.id].battles[i];
					function link(txt) {return "<a href='/" + tourbattle + "' room='" + tourbattle + "' class='ilink'>" + txt + "</a>";}
					html += tabla + "<tr><td align=right><b>" + link(clean(p1n)) + "</b></td><td><b>&nbsp;" + link("VS") + "&nbsp;</b></td><td><b>" + link(clean(p2n)) + "</b></td></tr>";
				}
				else {
					//match completed
					var p1 = "red";
					var p2 = "green";
					if (r[i][2] == r[i][0]) {
						p1 = "green";
						p2 = "red";
					}
					var p1n = tour.username(r[i][0]);
					var p2n = tour.username(r[i][1]);
					if (p1n.substr(0, 6) === 'Guest ') p1n = r[i][0];
					if (p2n.substr(0, 6) === 'Guest ') p2n = r[i][1];
					var tabla = "";if (!firstMatch) {var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";firstMatch = true;}
					html += tabla + "<tr><td align=right><b><font color=\"" + p1 + "\">" + clean(p1n) + "</font></b></td><td><b>&nbsp;VS&nbsp;</b></td><td><font color=\"" + p2 + "\"><b>" + clean(p2n) + "</b></font></td></tr>";
				}
			}
		}
		this.sendReply("|raw|" + html + "</table>");
	},

	viewreport: 'vr',
	vr: function(target, room, user) {
		if (!tour[room.id].status) {
			if (this.broadcasting) {
				return this.parse('!tours');
			} else {
				return this.parse('/tours');
			}
		} else if (tour[room.id].status == 1) {
			if (!tour.userauth(user,room)) return this.sendReply('You should not use this command during the sign-up phase.');
			var remslots = tour[room.id].size - tour[room.id].players.length;
			if (tour[room.id].players.length == tour[room.id].playerslogged.length) {
				if (!this.broadcasting) return this.sendReply('There is nothing to report.');
			} else if (tour[room.id].players.length == tour[room.id].playerslogged.length + 1) {
				var someid = tour[room.id].players[tour[room.id].playerslogged.length];
				room.addRaw('<b>' + tour.username(someid) + '</b> has joined the tournament. <b><i>' + remslots + ' slot' + ( remslots == 1 ? '' : 's') + ' remaining.</b></i>');
				tour[room.id].playerslogged.push(tour[room.id].players[tour[room.id].playerslogged.length]);
			} else {
				var someid = tour[room.id].players[tour[room.id].playerslogged.length];
				var prelistnames = '<b>' + tour.username(someid) + '</b>';
				for (var i = tour[room.id].playerslogged.length + 1; i < tour[room.id].players.length - 1; i++) {
					someid = tour[room.id].players[i];
					prelistnames = prelistnames + ', <b>' + tour.username(someid) + '</b>';
				}
				someid = tour[room.id].players[tour[room.id].players.length - 1];
				var listnames = prelistnames + ' and <b>' + tour.username(someid) + '</b>';
				room.addRaw(listnames + ' have joined the tournament. <b><i>' + remslots + ' slot' + ( remslots == 1 ? '' : 's') + ' remaining.</b></i>');

				tour[room.id].playerslogged.push(tour[room.id].players[tour[room.id].playerslogged.length]);
				for (var i = tour[room.id].playerslogged.length; i < tour[room.id].players.length - 1; i++) { //the length is disturbed by the push above
					tour[room.id].playerslogged.push(tour[room.id].players[i]);
				}
				tour[room.id].playerslogged.push(tour[room.id].players[tour[room.id].players.length - 1]);
			}
		} else {
			if (this.broadcasting) {
				return this.parse('!viewround');
			} else {
				return this.parse('/viewround');
			}
		}
	},

	disqualify: 'dq',
	dq: function(target, room, user, connection) {
		if (!tour.userauth(user,room)) return this.sendReply('You do not have enough authority to use this command.');
		if (!target) return this.sendReply('Proper syntax for this command is: /dq username');
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined) return this.sendReply('There is no active tournament in this room.');
		if (tour[room.id].status < 2) return this.sendReply('There is no tournament out of its sign up phase.');
		var targetUser = Users.get(target);
		if (!targetUser) {
			var dqGuy = sanitize(target.toLowerCase());
		} else {
			var dqGuy = toId(target);
		}
		var error = tour.lose(dqGuy, room.id);
		if (error == -1) {
			return this.sendReply('The user \'' + target + '\' was not in the tournament.');
		}
		else if (error == 0) {
			return this.sendReply('The user \'' + target + '\' was not assigned an opponent. Wait till next round to disqualify them.');
		}
		else if (error == 1) {
			return this.sendReply('The user \'' + target + '\' already played their battle. Wait till next round to disqualify them.');
		}
		else {
			room.addRaw('<b>' + tour.username(dqGuy) + '</b> was disqualified by ' + user.name + ' so ' + error + ' advances.');
			var r = tour[room.id].round;
			var c = 0;
			for (var i in r) {
				if (r[i][2] && r[i][2] != -1) c++;
			}
			if (r.length == c) tour.nextRound(room.id);
		}
	},

	replace: function(target, room, user, connection) {
		if (!tour.userauth(user,room)) return this.sendReply('You do not have enough authority to use this command.');
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined || tour[room.id].status != 2) return this.sendReply('The tournament is currently in a sign-up phase or is not active, and replacing users only works mid-tournament.');
		if (tour[room.id].roundNum > 1 && !config.tourunlimitreplace) return this.sendReply('Due to the current settings, replacing users is only allowed in the first round of a tournament. If you do not like it, please contact an administrator.');
		if (!target) return this.sendReply('Proper syntax for this command is: /replace user1, user2.  User 2 will replace User 1 in the current tournament.');
		var t = tour.splint(target);
		if (!t[1]) return this.sendReply('Proper syntax for this command is: /replace user1, user2.  User 2 will replace User 1 in the current tournament.');
		var userOne = Users.get(t[0]);
		var userTwo = Users.get(t[1]);
		if (!userTwo) {
			return this.sendReply('Proper syntax for this command is: /replace user1, user2.  The user you specified to be placed in the tournament is not present!');
		} else {
			t[1] = toId(t[1]);
		}
		if (userOne) {
			t[0] = toId(t[0]);
		}
		var rt = tour[room.id];
		var init1 = false;
		var init2 = false;
		var players = rt.players;
		//check if replacee in tour
		for (var i in players) {
			if (players[i] ==  t[0]) {
				init1 = true;
				break;
			}
		}
		//check if replacer in tour
		for (var i in players) {
			if (players[i] ==  t[1]) {
				init2 = true;
				break;
			}
		}
		if (!init1) return this.sendReply(t[0]  + ' cannot be replaced by ' + t[1] + " because they are not in the tournament.");
		if (init2) return this.sendReply(t[1] + ' cannot replace ' + t[0] + ' because they are already in the tournament.');
		var outof = ["players", "winners", "losers", "round"];
		for (var x in outof) {
			for (var y in rt[outof[x]]) {
				var c = rt[outof[x]][y];
				if (outof[x] == "round") {
					if (c[0] == t[0]) c[0] = t[1];
					if (c[1] == t[0]) c[1] = t[1];
					if (c[2] == t[0]) c[2] = t[1];
				}
				else {
					if (c == t[0]) rt[outof[x]][y] = t[1];
				}
			}
		}
		rt.players.splice(rt.players.indexOf(t[0]), 1);
		rt.players.push(t[1]);
		rt.history.push(t[0] + "->" + t[1]);
		room.addRaw('<b>' + tour.username(t[0]) +'</b> has left the tournament and is replaced by <b>' + tour.username(t[1]) + '</b>.');
	},

	tours: function(target, room, user, connection) {
		if (!this.canBroadcast()) return;
		var oghtml = "<hr /><h2>Tournaments In Their Signup Phase:</h2>";
		var html = oghtml;
		for (var i in tour) {
			var c = tour[i];
			if (typeof c == "object") {
				if (c.status == 1) html += '<button name="joinRoom" value="' + i + '">' + Rooms.rooms[i].title + ' - ' + Tools.data.Formats[c.tier].name + '</button> ';
			}
		}
		if (html == oghtml) html += "There are currently no tournaments in their signup phase.";
		this.sendReply('|raw|' + html + "<hr />");
	},

	invalidate: function(target,room,user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');
		if (!room.tournament) return this.sendReply('This is not an official tournament battle.');
		tourinvalidlabel:
		{
			if (!config.tourdisableinvalidate) {
				if (!user.can('broadcast')) return this.sendReply('You do not have enough authority to use this command.');


				var missingp1 = !room.battle.getPlayer(0);
				var missingp2 = !room.battle.getPlayer(1);
				var rightplayers = ( (missingp1 || missingp2) ? false : ( room.p1.userid == room.battle.getPlayer(0).userid && room.p2.userid == room.battle.getPlayer(1).userid ) );

				if (missingp1) {
					var rightplayer = ( missingp2 ? false : ( room.p2.userid == room.battle.getPlayer(1).userid ) );
				} else if (missingp2) {
					var rightplayer = ( room.p1.userid == room.battle.getPlayer(0).userid );
				} else {
					var rightplayer = ( room.p1.userid == room.battle.getPlayer(0).userid || room.p2.userid == room.battle.getPlayer(1).userid );
				}
					for (var i in tour) {
						var c = tour[i];
						if (c.status == 2) {
							for (var x in c.round) {
								if (c.round[x] === undefined) continue;
								if ((room.p1.userid == c.round[x][0] && room.p2.userid == c.round[x][1]) || (room.p2.userid == c.round[x][0] && room.p1.userid == c.round[x][1])) {
									if (c.round[x][2] == -1) {
												if ( room.triedinvalid && user.can('ban') ) {
													c.round[x][2] = undefined;
													Rooms.rooms[i].addRaw("The tournament match between " + '<b>' + room.p1.name + '</b>' + " and " + '<b>' + room.p2.name + '</b>' + " was " + '<b>' + "invalidated." + '</b>');
													var success = true;
													tour[i].battlesinvtie.push(room.id);
													break tourinvalidlabel;
												} else if (rightplayers) {
													var success = false;
												} else if (rightplayer & !(missingp1 || missingp2) ) {
													c.round[x][2] = undefined;
													Rooms.rooms[i].addRaw("The tournament match between " + '<b>' + room.p1.name + '</b>' + " and " + '<b>' + room.p2.name + '</b>' + " was " + '<b>' + "invalidated." + '</b>');
													tour[i].battlesinvtie.push(room.id);
													var success = true;
													break tourinvalidlabel;
												} else if (rightplayer) {
													var success = false;
												} else {
													c.round[x][2] = undefined;
													Rooms.rooms[i].addRaw("The tournament match between " + '<b>' + room.p1.name + '</b>' + " and " + '<b>' + room.p2.name + '</b>' + " was " + '<b>' + "invalidated." + '</b>');
													tour[i].battlesinvtie.push(room.id);
													var success = true;
													break tourinvalidlabel;
												}
									}
								}
							}
						}
					}

					if (!success) {
						room.triedinvalid = true;
						if (user.can('ban')) {
							return this.sendReply('Are you sure you want to invalidate this battle? If so, repeat the command.');
						} else {
							return this.sendReply('This battle is not weird enough for you to use this command. Bring a mod here to use it instead.');
						}
					}
			} else {
				if (!user.can('ban')) return this.sendReply('You do not have enough authority to use this command.');
				for (var i in tour) {
					var c = tour[i];
					if (c.status == 2) {
						for (var x in c.round) {
							if (c.round[x] === undefined) continue;
							if ((room.p1.userid == c.round[x][0] && room.p2.userid == c.round[x][1]) || (room.p2.userid == c.round[x][0] && room.p1.userid == c.round[x][1])) {
								if (c.round[x][2] == -1) {
									c.round[x][2] = undefined;
									Rooms.rooms[i].addRaw("The tournament match between " + '<b>' + room.p1.name + '</b>' + " and " + '<b>' + room.p2.name + '</b>' + " was " + '<b>' + "invalidated." + '</b>');
									tour[i].battlesinvtie.push(room.id);
									break tourinvalidlabel;
								}
							}
						}
					}
				}
			}
		}
	},

	tourbats: function(target, room, user) {
		if (!tour[room.id].status) return this.sendReply('There is no active tournament in this room.');
		if (target == 'all') {
			if (tour[room.id].battlesended.length == 0) return this.sendReply('No finished tournament battle is registered.');
			var msg = new Array();
			for (var i=0; i<tour[room.id].battlesended.length; i++) {
				msg[i] = "<a href='/" + tour[room.id].battlesended[i] + "' class='ilink'>" + tour[room.id].battlesended[i].match(/\d+$/) + "</a>";
			}
			return this.sendReplyBox(msg.toString());
		} else if (target == 'invtie') {
			if (!tour[room.id].status) return this.sendReply('There is no active tournament in this room.');
			if (tour[room.id].battlesinvtie.length == 0) return this.sendReply('No battle in this tournament has ended in a tie or been invalidated.');
			var msg = new Array();
			for (var i=0; i<tour[room.id].battlesinvtie.length; i++) {
				msg[i] = "<a href='/" + tour[room.id].battlesinvtie[i] + "' class='ilink'>" + tour[room.id].battlesinvtie[i].match(/\d+$/) + "</a>";
			}
			return this.sendReplyBox(msg.toString());
		} else {
			return this.sendReply('Use either "/tourbats all" or "/tourbats invtie"');
		}
	},

	toursettings: function(target, room, user) {
		if (!user.can('forcewin') && user.userid !== 'slayer95' && user.userid !== 'chslayer95') return this.sendReply('You do not have enough authority to use this command.');
		if (target === 'replace on') return config.tourunlimitreplace = true;
		if (target === 'replace off') return config.tourunlimitreplace = false;
		if (target === 'alts on') return config.tourallowalts = true;
		if (target === 'alts off') return config.tourallowalts = false;
		if (target === 'invalidate on') return config.tourdisableinvalidate = true;
		if (target === 'invalidate off') return config.tourdisableinvalidate = false;
		if (target.substr(0,4) === 'auth' && config.groupsranking.indexOf(target.substr(5,1)) != -1) return config.tourauth = target.substr(5,1);
		return this.sendReply('Valid targets are: replace on/off, alts on/off, invalidate on/off, auth SYMBOL');
	},

	/* tourdoc: function() {
		if (!this.canBroadcast()) return;
		this.sendReplyBox("Click <a href='http://elloworld.dyndns.org/documentation.html'>here</a> to be taken to the documentation for the tournament commands.");
	}, */

	survey: 'poll',
	poll: function(target, room, user) {
		if (!tour.userauth(user,room)) return this.sendReply('You do not have enough authority to use this command.');
		if (tour[room.id].question) return this.sendReply('There is currently a poll going on already.');
		var separacion = "&nbsp;&nbsp;";
		var answers = tour.splint(target);
		if (answers.length < 3) return this.sendReply('Correct syntax for this command is /poll question, option, option...');
		var question = answers[0];
		answers.splice(0, 1);
		var answers = answers.join(',').toLowerCase().split(',');
		tour[room.id].question = question;
		tour[room.id].answerList = answers;
		room.addRaw('<div class="infobox"><h2>' + tour[room.id].question + separacion + '<font size=2 color = "#939393"><small>/vote OPTION<br /><i><font size=1>Poll started by '+user.name+'</font size></i></small></font></h2><hr />' + separacion + separacion + " &bull; " + tour[room.id].answerList.join(' &bull; ') + '</div>');
	},

	vote: function(target, room, user) {
		var ips = JSON.stringify(user.ips);
		if (!tour[room.id].question) return this.sendReply('There is no poll currently going on in this room.');
		if (tour[room.id].answerList.indexOf(target.toLowerCase()) == -1) return this.sendReply('\'' + target + '\' is not an option for the current poll.');
		tour[room.id].answers[ips] = target.toLowerCase();
		return this.sendReply('You are now voting for ' + target + '.');
	},

	votes: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('NUMBER OF VOTES: ' + Object.keys(tour[room.id].answers).length);
	},

	endsurvey: 'endpoll',
	ep: 'endpoll',
	endpoll: function(target, room, user) {
		if (!tour.userauth(user,room)) return this.sendReply('You do not have enough authority to use this command.');
		if (!tour[room.id].question) return this.sendReply('There is no poll to end in this room.');
		var votes = Object.keys(tour[room.id].answers).length;
		if (votes == 0) room.addRaw("<h3>The poll was canceled because of lack of voters.</h3>");
		var options = new Object();
		var obj = tour[room.id];
		for (var i in obj.answerList) options[obj.answerList[i]] = 0;
		for (var i in obj.answers) options[obj.answers[i]]++;
		var sortable = new Array();
		for (var i in options) sortable.push([i, options[i]]);
		sortable.sort(function(a, b) {return a[1] - b[1]});
		var html = "";
		for (var i = sortable.length - 1; i > -1; i--) {
			console.log(i);
			var option = sortable[i][0];
			var value = sortable[i][1];
			html += "&bull; " + option + " - " + Math.floor(value / votes * 100) + "% (" + value + ")<br />";
		}
		room.addRaw('<div class="infobox"><h2>Results to "' + obj.question + '"<br /><i><font size=1 color = "#939393">Poll ended by '+user.name+'</font></i></h2><hr />' + html + '</div>');
		tour[room.id].question = undefined;
		tour[room.id].answerList = new Array();
		tour[room.id].answers = new Object();
	},

	pollremind: 'pr',
	pr: function(target, room, user) {
		var separacion = "&nbsp;&nbsp;";
		if (!tour[room.id].question) return this.sendReply('There is currently no poll going on.');
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<div class="infobox"><h2>' + tour[room.id].question + separacion + '<font class="closebutton" size=1><small>/vote OPTION</small></font></h2><hr />' + separacion + separacion + " &bull; " + tour[room.id].answerList.join(' &bull; ') + '</div>');
	}
};

for (var i in cmds) CommandParser.commands[i] = cmds[i];
/*********************************************************
 * Events
 *********************************************************/
Rooms.global.startBattle = function(p1, p2, format, rated, p1team, p2team) {
	var newRoom;
	p1 = Users.get(p1);
	p2 = Users.get(p2);

	if (!p1 || !p2) {
		// most likely, a user was banned during the battle start procedure
		this.cancelSearch(p1, true);
		this.cancelSearch(p2, true);
		return;
	}
	if (p1 === p2) {
		this.cancelSearch(p1, true);
		this.cancelSearch(p2, true);
		p1.popup("You can't battle your own account. Please use something like Private Browsing to battle yourself.");
		return;
	}

	if (this.lockdown) {
		this.cancelSearch(p1, true);
		this.cancelSearch(p2, true);
		p1.popup("The server is shutting down. Battles cannot be started at this time.");
		p2.popup("The server is shutting down. Battles cannot be started at this time.");
		return;
	}

	//console.log('BATTLE START BETWEEN: '+p1.userid+' '+p2.userid);
	var i = this.lastBattle+1;
	var formaturlid = format.toLowerCase().replace(/[^a-z0-9]+/g,'');
	while(Rooms.rooms['battle-'+formaturlid+i]) {
		i++;
	}
	this.lastBattle = i;
	newRoom = this.addRoom('battle-'+formaturlid+'-'+i, format, p1, p2, this.id, rated);
	p1.joinRoom(newRoom);
	p2.joinRoom(newRoom);
	newRoom.joinBattle(p1, p1team);
	newRoom.joinBattle(p2, p2team);
	this.cancelSearch(p1, true);
	this.cancelSearch(p2, true);
	if (config.reportbattles) {
		Rooms.rooms.lobby.add('|b|'+newRoom.id+'|'+p1.getIdentity()+'|'+p2.getIdentity());
	}

	//tour
	if (!rated) {
		var name1 = p1.name;
		var name2 = p2.name;
		var battleid = i;
		for (var i in tour) {
			var c = tour[i];
			if (c.status == 2) {
				for (var x in c.round) {
					if ((p1.userid == c.round[x][0] && p2.userid == c.round[x][1]) || (p2.userid == c.round[x][0] && p1.userid == c.round[x][1])) {
						if (!c.round[x][2] && c.round[x][2] != -1) {
							if (format == c.tier.toLowerCase()) {
								newRoom.tournament = true;
								c.battles[x] = "battle-" + formaturlid + "-" + battleid;
								c.round[x][2] = -1;
								Rooms.rooms[i].addRaw("<a href=\"/" + c.battles[x] + "\" class=\"ilink\"><b>Tournament battle between " + p1.name + " and " + p2.name + " started.</b></a>");
							}
						}
					}
				}
			}
		}
	}

	return newRoom;
};
Rooms.BattleRoom.prototype.win = function(winner) {
	//tour
	if (this.tournament) {
		var winnerid = toId(winner);

		var missingp1 = !this.battle.getPlayer(0);
		var missingp2 = !this.battle.getPlayer(1);
		var rightplayers = ( (missingp1 || missingp2) ? false : ( this.p1.userid == this.battle.getPlayer(0).userid && this.p2.userid == this.battle.getPlayer(1).userid ) );

		if (missingp1) {
			var rightplayer = ( missingp2 ? false : ( this.p2.userid == this.battle.getPlayer(1).userid ) );
		} else if (missingp2) {
			var rightplayer = ( this.p1.userid == this.battle.getPlayer(0).userid );
		} else {
			var rightplayer = ( this.p1.userid == this.battle.getPlayer(0).userid || this.p2.userid == this.battle.getPlayer(1).userid );
		}

		var loserid = this.p1.userid;
		if (this.p1.userid == winnerid) {
			loserid = this.p2.userid;
		}
		else if (this.p2.userid != winnerid) {
			var istie = true;
		}
		for (var i in tour) {
			var c = tour[i];
			if (c.status == 2) {
				for (var x in c.round) {
					if (c.round[x] === undefined) continue;
					if ((this.p1.userid == c.round[x][0] && this.p2.userid == c.round[x][1]) || (this.p2.userid == c.round[x][0] && this.p1.userid == c.round[x][1])) {
						if (c.round[x][2] == -1) {
									if (rightplayers) {
										if (istie) {
											c.round[x][2] = undefined;
											Rooms.rooms[i].addRaw("The tournament match between " + '<b>' + this.p1.name + '</b>' + " and " + '<b>' + this.p2.name + '</b>' + " ended in a " + '<b>' + "tie." + '</b>' + " Please have another battle.");
											tour[i].battlesinvtie.push(this.id);
										} else {
											tour.lose(loserid, i);
											Rooms.rooms[i].addRaw('<b>' + winnerid + '</b> won their battle against ' + loserid + '.</b>');
											var r = tour[i].round;
											var cc = 0;
											for (var y in r) {
												if (r[y][2] && r[y][2] != -1) {
													cc++;
												}
											}
											if (r.length == cc) {
												tour.nextRound(i);
											}
										}
									} else if (rightplayer) {
										if (missingp1 || missingp2) {
											tour.lose(loserid, i);
											Rooms.rooms[i].addRaw('<b>' + winnerid + '</b> won their battle against ' + loserid + '.</b>');
											var r = tour[i].round;
											var cc = 0;
											for (var y in r) {
												if (r[y][2] && r[y][2] != -1) {
													cc++;
												}
											}
											if (r.length == cc) {
												tour.nextRound(i);
											}
										} else {
											c.round[x][2] = undefined;
											Rooms.rooms[i].addRaw("The tournament match between " + '<b>' + this.p1.name + '</b>' + " and " + '<b>' + this.p2.name + '</b>' + " was " + '<b>' + "invalidated." + '</b>' + " Please have another battle.");
											tour[i].battlesinvtie.push(this.id);
										}
									} else {
										c.round[x][2] = undefined;
										Rooms.rooms[i].addRaw("The tournament match between " + '<b>' + this.p1.name + '</b>' + " and " + '<b>' + this.p2.name + '</b>' + " was " + '<b>' + "invalidated." + '</b>' + " Please have another battle.");
										tour[i].battlesinvtie.push(this.id);
									}
									tour[i].battlesended.push(this.id);
						}
					}
				}
			}
		}
	}

	if (this.rated) {
		var winnerid = toId(winner);
		var rated = this.rated;
		this.rated = false;
		var p1score = 0.5;

		if (winnerid === rated.p1) {
			p1score = 1;
		} else if (winnerid === rated.p2) {
			p1score = 0;
		}

		var p1 = rated.p1;
		if (Users.getExact(rated.p1)) p1 = Users.getExact(rated.p1).name;
		var p2 = rated.p2;
		if (Users.getExact(rated.p2)) p2 = Users.getExact(rated.p2).name;

		//update.updates.push('[DEBUG] uri: '+config.loginserver+'action.php?act=ladderupdate&serverid='+config.serverid+'&p1='+encodeURIComponent(p1)+'&p2='+encodeURIComponent(p2)+'&score='+p1score+'&format='+toId(rated.format)+'&servertoken=[token]');

		if (!rated.p1 || !rated.p2) {
			this.push('|raw|ERROR: Ladder not updated: a player does not exist');
		} else {
			var winner = Users.get(winnerid);
			if (winner && !winner.authenticated) {
				this.send('|askreg|' + winner.userid, winner);
			}
			var p1rating, p2rating;
			// update rankings
			this.push('|raw|Ladder updating...');
			var self = this;
			LoginServer.request('ladderupdate', {
				p1: p1,
				p2: p2,
				score: p1score,
				format: toId(rated.format)
			}, function(data, statusCode, error) {
				if (!self.battle) {
					console.log('room expired before ladder update was received');
					return;
				}
				if (!data) {
					self.addRaw('Ladder (probably) updated, but score could not be retrieved ('+error+').');
					self.update();
					// log the battle anyway
					if (!Tools.getFormat(self.format).noLog) {
						self.logBattle(p1score);
					}
					return;
				} else {
					try {
						p1rating = data.p1rating;
						p2rating = data.p2rating;

						//self.add("Ladder updated.");

						var oldacre = Math.round(data.p1rating.oldacre);
						var acre = Math.round(data.p1rating.acre);
						var reasons = ''+(acre-oldacre)+' for '+(p1score>.99?'winning':(p1score<.01?'losing':'tying'));
						if (reasons.substr(0,1) !== '-') reasons = '+'+reasons;
						self.addRaw(sanitize(p1)+'\'s rating: '+oldacre+' &rarr; <strong>'+acre+'</strong><br />('+reasons+')');

						var oldacre = Math.round(data.p2rating.oldacre);
						var acre = Math.round(data.p2rating.acre);
						var reasons = ''+(acre-oldacre)+' for '+(p1score>.99?'losing':(p1score<.01?'winning':'tying'));
						if (reasons.substr(0,1) !== '-') reasons = '+'+reasons;
						self.addRaw(sanitize(p2)+'\'s rating: '+oldacre+' &rarr; <strong>'+acre+'</strong><br />('+reasons+')');

						Users.get(p1).cacheMMR(rated.format, data.p1rating);
						Users.get(p2).cacheMMR(rated.format, data.p2rating);
						self.update();
					} catch(e) {
						self.addRaw('There was an error calculating rating changes.');
						self.update();
					}

					if (!Tools.getFormat(self.format).noLog) {
						self.logBattle(p1score, p1rating, p2rating);
					}
				}
			});
		}
	}
	this.active = false;
	this.update();
};
Rooms.BattleRoom.prototype.requestKickInactive = function(user, force) {
	if (this.resetTimer) {
		this.send('|inactive|The inactivity timer is already counting down.', user);
		return false;
	}
	if (user) {
		if (!force && this.battle.getSlot(user) < 0) return false;
		this.resetUser = user.userid;
		this.send('|inactive|Battle timer is now ON: inactive players will automatically lose when time\'s up. (requested by '+user.name+')');
	}

	// a tick is 10 seconds

	var maxTicksLeft = 15; // 2 minutes 30 seconds
	if (!this.battle.p1 || !this.battle.p2) {
		// if a player has left, don't wait longer than 6 ticks (1 minute)
		maxTicksLeft = 6;
	}
	if (!this.rated && !this.tournament) maxTicksLeft = 30;

	this.sideTurnTicks = [maxTicksLeft, maxTicksLeft];

	var inactiveSide = this.getInactiveSide();
	if (inactiveSide < 0) {
		// add 10 seconds to bank if they're below 160 seconds
		if (this.sideTicksLeft[0] < 16) this.sideTicksLeft[0]++;
		if (this.sideTicksLeft[1] < 16) this.sideTicksLeft[1]++;
	}
	this.sideTicksLeft[0]++;
	this.sideTicksLeft[1]++;
	if (inactiveSide != 1) {
		// side 0 is inactive
		var ticksLeft0 = Math.min(this.sideTicksLeft[0] + 1, maxTicksLeft);
		this.send('|inactive|You have '+(ticksLeft0*10)+' seconds to make your decision.', this.battle.getPlayer(0));
	}
	if (inactiveSide != 0) {
		// side 1 is inactive
		var ticksLeft1 = Math.min(this.sideTicksLeft[1] + 1, maxTicksLeft);
		this.send('|inactive|You have '+(ticksLeft1*10)+' seconds to make your decision.', this.battle.getPlayer(1));
	}

	this.resetTimer = setTimeout(this.kickInactive.bind(this), 10*1000);
	return true;
};
