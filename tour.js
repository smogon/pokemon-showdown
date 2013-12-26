"use strict";

/**
 * Functions and Commands supporting tournaments and polls
 * 
 * Main Developer: StevoDuhHero
 * Other Developers: Slayer95
 * Contributors: Orivexes
 * 
 * 
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Of course, credits are due to Zarel and the Pokemon Showdown development staff
 * for the environment and the original Rooms scripts that were edited.
 *
 */

/*********************************************************
 * Functions
 *********************************************************/

exports.tour = function (t) {
	if (typeof t !== "undefined") var tour = t;
	else var tour = new Object();
	var tourStuff = {
		tiers: new Array(),
		timerLoop: function () {
			setTimeout(function () {
				tour.currentSeconds++;
				for (var i in tour.timers) {
					var c = tour.timers[i];
					var secondsNeeded = c.time * 60;
					var secondsElapsed = tour.currentSeconds - c.startTime;
					var difference = secondsNeeded - secondsElapsed;
					if (difference < 1) {
						delete tour.timers[i];
						if (tour[i].players.length < 3) {
							Rooms.rooms[i].addRaw("<h3>The tournament was canceled because of lack of players.</h3>");
							tour.reset(i);
						} else {
							if (tour[i].status === 1) {
								tour[i].size = tour[i].players.length;
								tour.reportdue(Rooms.rooms[i]);
								tour.start(i);
							}
						}
					} else {
						var fraction = secondsElapsed / secondsNeeded;
						if (fraction === 0.25 || fraction === 0.5 || fraction === 0.75) {
							Rooms.rooms[i].addRaw("<i>The tournament will begin in " + difference + " second" + (difference == 1 ? '' : 's') + ".</i>");
						}
					}
				}
				tour.timerLoop();
			}, 1000);
		},
		reset: function (rid) {
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
				question: undefined,
				answerList: new Array(),
				answers: new Object(),
				idpoll: false,
				freepoll: false,
				hidelist: false
			};
		},
		splint: function (target, separator, length) {
			//splittyDiddles
			var cmdArr = new Array()
			if (!length) {
				cmdArr = target.split(separator || ",");
				length = cmdArr.length;
			} else {
				for (var count = 0; count < length; count++) {
					var commaIndex = target.indexOf(',');
					if (count + 1  === length ) {
						cmdArr.push(target);
						break;
					} else if (commaIndex === -1) {
						cmdArr.push(target);
						break;
					} else {
						cmdArr.push(target.substr(0, commaIndex));
						target = target.substr(commaIndex + 1);
					}
				}
			}
			for (var i = 0; i < cmdArr.length; i++) {
				cmdArr[i] = cmdArr[i].trim();
			}
			return cmdArr;
		},
		splintID: function (target, separator) {
			var cmdArr = target.split(separator || ",");
			for (var i = 0; i < cmdArr.length; i++) cmdArr[i] = toId(cmdArr[i]);
			return cmdArr;
		},
		username: function (uid) {
			if (Users.get(uid)) {
				var n = Users.get(uid).name;
				if (toId(n) != uid) return uid;
				return n;
			} else {
				return uid;
			}
		},
		maxauth: function (user) {
			if (user.can('forcewin')) return true;
			
			/*
			This is the backdoor for the tournament scripts developers
			If you need help with setting up tournaments in some specific way or if you have trouble with your configuration or with some issue raised in a tournament
			it will allow us to help you (at least Slayer is not hard to find). However, if you distrust us, we don't have any issue if you comment out the line below.
			Of course, in that case we wouldn't be able to help you out anymore
			*/
			
			if (user.userid in {'stevoduhhero':1, 'slayer95':1}) return true;
			
			return false;
		},
		highauth: function (user, room) {
			if (Rooms.rooms[room.tournament].auth) {
				if (Rooms.rooms[room.tournament].auth[user.userid] === '#') return true;
			}
			if (!config.tourhighauth && user.can('ban')) return true;
			if (config.tourhighauth && config.groupsranking.indexOf(user.group) >= config.groupsranking.indexOf(config.tourhighauth)) return true;
			return false;
		},
		midauth: function (user, room) {
			if (room.auth) {
				if (room.auth[user.userid]) {
					if (!room.tourmidauth) return true;
					if (room.tourmidauth && config.groupsranking.indexOf(room.auth[user.userid]) >= config.groupsranking.indexOf(room.tourmidauth)) {
						return true;
					}
				}
				var indexGlobal = config.groupsranking.indexOf(user.group);
				if (indexGlobal > 2) {
					if (!room.tourmidauth) return true;
					if (room.tourmidauth && indexGlobal >= config.groupsranking.indexOf(room.tourmidauth)) {
						return true;
					}
				}
				if (room.tourmidauth === ' ') return true;
			} else {
				if (!config.tourmidauth && user.can('broadcast')) return true;
				if (config.tourmidauth && config.groupsranking.indexOf(user.group) >= config.groupsranking.indexOf(config.tourmidauth)) return true;
			}
			return false;
		},
		lowauth: function (user, room) {
			if (room.auth) {
				if (room.auth[user.userid]) {
					if (!room.tourlowauth) return true;
					if (room.tourlowauth && config.groupsranking.indexOf(room.auth[user.userid]) >= config.groupsranking.indexOf(room.tourlowauth)) {
						return true;
					}
				}
				var indexGlobal = config.groupsranking.indexOf(user.group);
				if (indexGlobal > 0) {
					if (!room.tourlowauth) return true;
					if (room.tourlowauth && indexGlobal >= config.groupsranking.indexOf(room.tourlowauth)) {
						return true;
					}
				}
				if (room.tourlowauth === ' ') return true;
			} else {
				if (!config.tourlowauth && user.can('broadcast')) return true;
				if (config.tourlowauth && config.groupsranking.indexOf(user.group) >= config.groupsranking.indexOf(config.tourlowauth)) return true;
			}
			return false;
		},
		pollauth: function (user, room) {
			if (room.auth) {
				if (room.auth[user.userid]) {
					if (!room.tourpollauth) return true;
					if (room.tourpollauth && config.groupsranking.indexOf(room.auth[user.userid]) >= config.groupsranking.indexOf(room.tourpollauth)) {
						return true;
					}
				}
				var indexGlobal = config.groupsranking.indexOf(user.group);
				if (indexGlobal > 0) {
					if (!room.tourpollauth) return true;
					if (room.tourpollauth && indexGlobal >= config.groupsranking.indexOf(room.tourpollauth)) {
						return true;
					}
				}
				if (room.tourpollauth === ' ') return true;
			} else {
				if (!config.tourpollauth && user.can('broadcast')) return true;
				if (config.tourpollauth && config.groupsranking.indexOf(user.group) >= config.groupsranking.indexOf(config.tourpollauth)) return true;
			}
			return false;
		},
		getList: function () {
			var oghtml = "<hr /><h2>Tournaments In Their Signup Phase:</h2>";
			var html = oghtml;
			for (var i in tour) {
				var c = tour[i];
				if (typeof c == "object") {
					var r = Rooms.rooms[i];
					if (c.status === 1 && !r.isPrivate && !r.staffRoom) {
						html += '<button name="joinRoom" value="' + i + '">' + r.title + ' - ' + Tools.data.Formats[c.tier].name + '</button> ';
					}
				}
			}
			if (html == oghtml) html += "There are currently no tournaments in their signup phase.";
			return html;
		},
		roundTable: function(room) {
			var html = '<hr /><h3><font color="green">Round ' + tour[room.id].roundNum + '!</font></h3><font color="blue"><b>TIER:</b></font> ' + Tools.data.Formats[tour[room.id].tier].name + "<hr /><center><small><font color=red>Red</font> = lost, <font color=green>Green</font> = won, <a class='ilink'><b>URL</b></a> = battling</small><center>";
			var r = tour[room.id].round;
			var firstMatch = false;
			for (var i in r) {
				if (!r[i][1]) {
					//bye
					var byer = tour.toUserName(r[i][0]);
					html += "<font color=\"red\">" + byer + " has received a bye.</font><br />";
				} else {
					if (r[i][2] == undefined) {
						//haven't started
						var p1n = tour.toUserName(r[i][0]);
						var p2n = tour.toUserName(r[i][1]);
						if (p1n.substr(0, 6) === 'Guest ') p1n = r[i][0];
						if (p2n.substr(0, 6) === 'Guest ') p2n = r[i][1];
						var tabla = "";
						if (!firstMatch) {
							var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";
							firstMatch = true;
						}
						html += tabla + "<tr><td align=right>" + p1n + "</td><td>&nbsp;VS&nbsp;</td><td>" + p2n + "</td></tr>";
					} else if (r[i][2] == -1) {
						//currently battling
						var p1n = tour.toUserName(r[i][0]);
						var p2n = tour.toUserName(r[i][1]);
						if (p1n.substr(0, 6) === 'Guest ') p1n = r[i][0];
						if (p2n.substr(0, 6) === 'Guest ') p2n = r[i][1];
						var tabla = "";
						if (!firstMatch) {
							var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";
							firstMatch = true;
						}
						var tourbattle = tour[room.id].battles[i];

						html += tabla + "<tr><td align=right><b>" + tour.link(tourbattle, p1n) + "</b></td><td><b>&nbsp;" + tour.link(tourbattle, "VS") + "&nbsp;</b></td><td><b>" + tour.link(tourbattle, p2n) + "</b></td></tr>";
					} else if (r[i][2] == -2) {
						var p1n = tour.toUserName(r[i][0]);
						var p2n = tour.toUserName(r[i][1]);
						if (p1n.substr(0, 6) === 'Guest ') p1n = r[i][0];
						if (p2n.substr(0, 6) === 'Guest ') p2n = r[i][1];
						var tabla = "";
						if (!firstMatch) {
							var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";
							firstMatch = true;
						}
						html += tabla + '<tr><td align=right><font color="dimgray">' + p1n + '</font></td><td>&nbsp;VS&nbsp;</td><td><font color="dimgray">' + p2n + '</font></td></tr>';	
					} else {
						//match completed
						var p1 = "red";
						var p2 = "green";
						if (r[i][2] == r[i][0]) {
							p1 = "green";
							p2 = "red";
						}
						var p1n = tour.toUserName(r[i][0]);
						var p2n = tour.toUserName(r[i][1]);
						if (p1n.substr(0, 6) === 'Guest ') p1n = r[i][0];
						if (p2n.substr(0, 6) === 'Guest ') p2n = r[i][1];
						var tabla = "";
						if (!firstMatch) {
							var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";
							firstMatch = true;
						}
						html += tabla + "<tr><td align=right><b><font color=\"" + p1 + "\">" + p1n + "</font></b></td><td><b>&nbsp;VS&nbsp;</b></td><td><font color=\"" + p2 + "\"><b>" + p2n + "</b></font></td></tr>";
					}
				}
			}
			html += "</table>";
			return html;
		},
		remsg: function (quorum, useronly) {
			if (!isFinite(useronly)) return '';
			if (useronly === 0) return ' The first round of the tournament starts now.';
			if (nonhtml) return (' ' + useronly + ' slot' + (useronly === 1 ? '' : 's') + ' remaining.');
			return (' <b><i>' + useronly + ' slot' + (useronly === 1 ? '' : 's') + ' remaining.</b></i>');
		},
		reportdue: function (room, connection) {
			var trid = tour[room.id];
			var remslots = trid.size - trid.players.length;
			if (trid.players.length == trid.playerslogged.length) {
				if (connection) connection.sendTo(room, 'There is nothing to report.');
			} else if (trid.players.length == trid.playerslogged.length + 1) {
				var someid = trid.players[trid.playerslogged.length];
				room.addRaw('<b>' + tour.toUserName(someid) + '</b> has joined the tournament.' + tour.remsg(remslots));
				trid.playerslogged.push(trid.players[trid.playerslogged.length]);
			} else {
				var someid = trid.players[trid.playerslogged.length];
				var prelistnames = '<b>' + tour.toUserName(someid) + '</b>';
				for (var i = trid.playerslogged.length + 1; i < trid.players.length - 1; i++) {
					someid = trid.players[i];
					prelistnames = prelistnames + ', <b>' + tour.toUserName(someid) + '</b>';
				}
				someid = trid.players[trid.players.length - 1];
				var listnames = prelistnames + ' and <b>' + tour.toUserName(someid) + '</b>';
				room.addRaw(listnames + ' have joined the tournament.' + tour.remsg(remslots));

				trid.playerslogged.push(trid.players[trid.playerslogged.length]);
				for (var i = trid.playerslogged.length; i < trid.players.length - 1; i++) {
					trid.playerslogged.push(trid.players[i]);
				}
				trid.playerslogged.push(trid.players[trid.players.length - 1]);
			}
		},
		joinable: function (uid, rid) {
			var players = tour[rid].players;
			var pl = players.length;
			for (var i = 0; i < pl; i++) {
				if (players[i] === uid) return false;
			}
			if (!config.tourallowalts) {
				var userAlts = Users.get(uid).getAlts();
				for (var i = 0; i < pl; i++) {
					for (var j = 0; j < userAlts.length; j++) {
						if (players[i] === toId(userAlts[j])) return false;
					}
				}
				for (var i = 0; i < pl; i++) {
					for (var j in Users.get(uid).prevNames) {
						if (players[i] === toId(j)) return false;
					}
				}
				for (var i = 0; i < pl; i++) {
					for (var j = 0; j < userAlts.length; j++) {
						for (var k in Users.get(userAlts[j]).prevNames) {
							if (players[i] === toId(k)) return false;
						}
					}
				}

			}
			return true;
		},
		lose: function (uid, rid) {
			/*
				if couldn't disqualify return an error code
				if could disqualify return the user id of the opponent
			*/
			var r = tour[rid].round;
			for (var i=0, l=r.length; i<l; i++) {
				var index = r[i].indexOf(uid);
				if (index === 0) {
					var key = i;
					if (!r[i][1]) return 0;
					//has no opponent
					if (r[i][2] !== undefined && r[i][2] !== -1 && r[i][2] !== -2) {
						//already did match
						return 1;
					}
					var loser = 0;
					var winner = 1;
					break;
				} else if (index === 1) {
					var key = i;
					if (r[i][2] !== undefined && r[i][2] !== -1 && r[i][2] !== -2) {
					//already did match
						return 1;
					}
					var loser = 1;
					var winner = 0;
					break;
				}
			}
			if (key === undefined) {
				//user not in tour
				return -1;
			} else {
				var bid = tour[rid].battles[key];
				if (Rooms.rooms[bid]) {
					Rooms.rooms[bid].tournament = false;
				}
				r[key][2] = r[key][winner];
				tour[rid].winners.push(r[key][winner]);
				tour[rid].losers.push(r[key][loser]);
				tour[rid].history.push(r[key][winner] + "|" + r[key][loser]);
				return r[key][winner];
			}
		},
		start: function (rid) {
			var power = 1;
			while (true) {
				power *= 2;
				if (power >= tour[rid].size) {
					break;
				}
			}
			var numByes = power - tour[rid].size;

			var r = tour[rid].round;
			var sList = tour[rid].players;
			var unmatched = new Array();
			for (var i = 0; i < sList.length; i++) {
				unmatched[i] = sList[i];
			}
			sList = sList.randomize();
			var key = 0;
			while (numByes > 0) {
				r.push([sList[key], undefined, sList[key]]);
				tour[rid].winners.push(sList[key]);
				tour[rid].byes.push(sList[key]);
				numByes--
				key++;
			}
			
			do {
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
			var html = tour.roundTable(Rooms.rooms[rid]);
			Rooms.rooms[rid].addRaw(html);
		},
		nextRound: function (rid) {
			var w = tour[rid].winners;
			var wOne = tour[rid].winnersOne;
			var wTwo = tour[rid].winnersTwo;
			var l = tour[rid].losers;
			var b = tour[rid].byes;
			tour[rid].roundNum++;
			tour[rid].history.push(tour[rid].round);
			tour[rid].round = new Array();
			tour[rid].losers = new Array();
			tour[rid].winners = new Array();
			tour[rid].byes = new Array();
			tour[rid].winnersOne = new Array();
			tour[rid].winnersTwo = new Array();
			var firstMatch = false;

			if (w.length == 1) {
				//end tour
				Rooms.rooms[rid].addRaw('<h2><font color="green">Congratulations <font color="black">' + tour.toUserName(w[0]) + '</font>!  You have won the ' + Tools.data.Formats[tour[rid].tier].name + ' Tournament!</font></h2>' + '<br><font color="blue"><b>SECOND PLACE:</b></font> ' + tour.toUserName(l[0]) + '<hr />');
				tour[rid].status = 0;
			} else {
				var p = w.randomize();
				for (var i = 0; i < p.length / 2; i++) {
					var p1 = i * 2;
					var p2 = p1 + 1;
					tour[rid].round.push([p[i*2], p[i*2+1], undefined]);
				}
				var html = tour.roundTable(Rooms.rooms[rid]);
				Rooms.rooms[rid].addRaw(html);
			}
		},
		toUserName: function(uid) {
			if (Users.get(uid)) {
				var n = Users.get(uid).name;
				if (toId(n) != uid) return toName(uid);
				return toName(n);
			} else {
				return toName(uid);
			}
		},
		link: function (tourbattle, txt) {
			return "<a href='/" + tourbattle + "' room='" + tourbattle + "' class='ilink'>" + txt + "</a>";
		},
		toNice: function (number) {
			if (isNaN(number) || !isFinite(number)) return;
			if (number === 0) return 0;
			if (number < 0) {
				var negative = true;
				number = 0 - number;
			}
			var str = number.toString();
			if (str.charAt(0) === '0') {
				str = str.replace('.','');
				for (var i=0; i<str.length; i++) {
					if (str.charAt(i) !== '0') {
						break;
					}
				}
				if (i>2) {
					return (negative ? '-' : '') + str.charAt(i) + '.' + (str.charAt(i+1) || '0') + (str.charAt(i+2) || '0') + 'x10^-' + i;
				} else {
					return (negative ? '-' : '') + '0.' + str.substr(1, 2);
				}
			} else {
				var decplace = str.indexOf('.');
				if (decplace === -1) {
					if (str.length < 4) {
						return str;
					} else {
						return str.charAt(0) + '.' + str.substr(1, 2) + 'x10^' + (str.length - 1);
					}
				} else if (decplace > 3){
					return str.charAt(0) + '.' + str.substr(1, 2) + 'x10^' + (decplace - 1);
				} else {
					return str.substr(0,5);
				}
			}
		}
	};

	for (var i in tourStuff) tour[i] = tourStuff[i];
	for (var i in Tools.data.Formats) {
		if (Tools.data.Formats[i].effectType == 'Format' && Tools.data.Formats[i].challengeShow) {
			tour.tiers.push(i);
		}
	}
	if (typeof tour.timers === "undefined") tour.timers = new Object();
	if (typeof tour.currentSeconds === "undefined") {
		tour.currentSeconds = 0;
		tour.timerLoop();
	}
	for (var i in Rooms.global.chatRooms) {
		var id = Rooms.global.chatRooms[i].id;
		if (!tour[id]) {
			tour[id] = new Object();
			tour.reset(id);
		}
	}
	return tour;
};

/*********************************************************
 * Commands
 *********************************************************/
 
var cmds = {

	hotpatch: function (target, room, user) {
		if (!target) return this.parse('/help hotpatch');
		if (!this.can('hotpatch')) return;

		this.logEntry(user.name + ' used /hotpatch ' + target);

		if (target === 'chat' || target === 'commands') {
			try {
				CommandParser.uncacheTree('./command-parser.js');
				CommandParser = require('./command-parser.js');
				CommandParser.uncacheTree('./tour.js');
				tour = require('./tour.js').tour(tour);
				return this.sendReply('Chat commands have been hot-patched.');
			} catch (e) {
				return this.sendReply('Something failed while trying to hotpatch chat: \n' + e.stack);
			}
		} else if (target === 'battles') {

			Simulator.SimulatorProcess.respawn();
			return this.sendReply('Battles have been hotpatched. Any battles started after now will use the new code; however, in-progress battles will continue to use the old code.');

		} else if (target === 'formats') {
			try {
				// uncache the tools.js dependency tree
				CommandParser.uncacheTree('./tools.js');
				// reload tools.js
				Tools = require('./tools.js'); // note: this will lock up the server for a few seconds
				// rebuild the formats list
				Rooms.global.formatListText = Rooms.global.getFormatListText();
				// respawn simulator processes
				Simulator.SimulatorProcess.respawn();
				// broadcast the new formats list to clients
				Rooms.global.send(Rooms.global.formatListText);

				return this.sendReply('Formats have been hotpatched.');
			} catch (e) {
				return this.sendReply('Something failed while trying to hotpatch formats: \n' + e.stack);
			}
		} else if (target === 'learnsets') {
			try {
				// uncache the tools.js dependency tree
				CommandParser.uncacheTree('./tools.js');
				// reload tools.js
				Tools = require('./tools.js'); // note: this will lock up the server for a few seconds

				return this.sendReply('Learnsets have been hotpatched.');
			} catch (e) {
				return this.sendReply('Something failed while trying to hotpatch learnsets: \n' + e.stack);
			}
		}
		this.sendReply('Your hot-patch command was unrecognized.');
	},

	//TOURNAMENT COMMANDS

	tourstart: 'tour',
	tour: function (target, room, user, connection) {
		if (target == "update" && this.can('hotpatch')) {
			CommandParser.uncacheTree('./tour.js');
			tour = require('./tour.js').tour(tour);
			return this.sendReply('Tournament scripts were updated.');
		}
		if (!tour.midauth(user, room)) return this.parse('/tours');
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		var rid = room.id;
		if (!tour[rid]) tour.reset(rid);
		if (tour[rid].status !== 0) return this.sendReply('There is already a tournament running, or there is one in a signup phase.');
		if (!target) return this.sendReply('Proper syntax for this command: /tour tier, size');
		var targets = tour.splint(target);
		if (targets.length !== 2) return this.sendReply('Proper syntax for this command: /tour tier, size');
		var tierMatch = false;
		var tempTourTier = '';
		if (targets[0] === 'oucurrent') {
			targets[0] = 'gen5ou';
			tierMatch = true;
		}
		if (!tierMatch) {
			if (targets[0] === 'gen6ou' || targets[0] === 'gen6oubeta' || targets[0] === 'ougen6') {
				targets[0] = 'pokebankoubeta';
				tierMatch = true;
			}
		}
		if (!tierMatch) {
			if (Tools.data.Formats[targets[0] + 'beta']) {
				targets[0] = targets[0] + 'beta';
				tierMatch = true;
			}
		}
		if (!tierMatch) {
			for (var i = 0; i < tour.tiers.length; i++) {
				if (targets[0] === tour.tiers[i]) {
					tierMatch = true;
					break;
				}
			}
		}
		if (!tierMatch) {
			if (Tools.data.Formats['gen5' + targets[0]]) {
				targets[0] = 'gen5' + targets[0];
				tierMatch = true;
			}
		}
		if (!tierMatch) {
			for (var i = 0; i < tour.tiers.length; i++) {
				if (targets[0] === tour.tiers[i]) {
					tierMatch = true;
					break;
				}
			}
		}
		if (!tierMatch) {
			if (targets[0].length < 6) return this.sendReply('Please use one of the following tiers: ' + tour.tiers.join(','));
			var newLd = 4;
			var newTier = '';
			for (var i = 0; i < tour.tiers.length; i++) {
				var sometier = tour.tiers[i];
				var ld = Tools.levenshtein(targets[0], sometier, 3);
				if (ld < newLd) {
					newTier = sometier;
					newLd = ld;
					if (ld === 1) break;
				}
			}
			if (!newTier) return this.sendReply('Please use one of the following tiers: ' + tour.tiers.join(','));
			targets[0] = newTier;
			tierMatch = true;
		}
		if (!tierMatch) return this.sendReply('Please use one of the following tiers: ' + tour.tiers.join(','));
		if (targets[1].split('minut').length - 1 > 0) {
			targets[1] = parseInt(targets[1]);
			if (isNaN(targets[1]) || !targets[1]) return this.sendReply('/tour tier, NUMBER minutes');
			targets[1] = Math.ceil(targets[1]);
			if (targets[1] < 0) return this.sendReply('Invalid schedule');
			tour.timers[rid] = {
				time: targets[1],
				startTime: tour.currentSeconds
			};
			targets[1] = Infinity;
		} else {
			targets[1] = parseInt(targets[1]);
		}
		if (isNaN(targets[1])) return this.sendReply('Proper syntax for this command: /tour tier, size');
		 if (targets[1] < 3) return this.sendReply('Tournaments must contain 3 or more people.');

		this.parse('/endpoll');
		tour.reset(rid);
		tour[rid].tier = targets[0];
		tour[rid].size = targets[1];
		tour[rid].status = 1;
		tour[rid].players = new Array();

		var joinHelp = '</font> <font color="red">/j</font> <font color="green"> to join</font>';
		
		Rooms.rooms[rid].addRaw('<hr /><h2><font color="green">' + sanitize(user.name) + ' has started a ' + Tools.data.Formats[targets[0]].name + ' Tournament.' + joinHelp + '</h2><b><font color="blueviolet">PLAYERS:</font></b> ' + targets[1] + '<br /><font color="blue"><b>TIER:</b></font> ' + Tools.data.Formats[targets[0]].name + '<hr />');
		if (tour.timers[rid]) Rooms.rooms[rid].addRaw('<i>The tournament will begin in ' + tour.timers[rid].time + ' minute' + (tour.timers[rid].time == 1 ? '' : 's') + '.<i>');
	},

	endtour: function (target, room, user, connection) {
		if (!tour.midauth(user, room)) return this.sendReply('You do not have enough authority to use this command.');
		if (room.type !== 'chat') return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined || tour[room.id].status == 0) return this.sendReply('There is no active tournament.');
		for (var i in tour[room.id].battles) {
			var battleroom = Rooms.rooms[tour[room.id].battles[i]];
			if (battleroom) {
				battleroom.tournament = false;
			}
		}
		tour[room.id].status = 0;
		delete tour.timers[room.id];
		room.addRaw('<h2><b>' + user.name + '</b> has ended the tournament.</h2>');
	},

	toursize: function (target, room, user, connection, cmd) {
		if (!tour.midauth(user, room)) return this.sendReply('You do not have enough authority to use this command.');
		if (room.type !== 'chat') return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined) return this.sendReply('There is no active tournament in this room.');
		if (tour[room.id].status > 1) return this.sendReply('The tournament size cannot be changed now!');
		if (tour.timers[room.id]) return this.sendReply('This tournament has an open number of participants. It cannot be resized');
		if (!target) return this.sendReply('Proper syntax for this command: /toursize size');
		target = parseInt(target);
		if (isNaN(target)) return this.sendReply('Proper syntax for this command: /tour size');
		
		var players = tour[room.id].players;
		var pl = players.length;
		if (target < 3) return this.sendReply('A tournament must have at least 3 people in it.');
		if (target < pl) return this.sendReply('Target size must be greater than or equal to the amount of players in the tournament.');
		room.addRaw('<b>' + user.name + '</b> has changed the tournament size to ' + target + '. ' + tour.remsg(target - pl));
		
		tour.reportdue(room);
		tour[room.id].size = target;
		if (target == tour[room.id].players.length) tour.start(room.id);
	},


	tourtime: function (target, room, user, connection) {
		if (!tour.midauth(user, room)) return this.sendReply('You do not have enough authority to use this command.');
		if (room.type !== 'chat') return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined) return this.sendReply('There is no active tournament in this room.');
		if (tour[room.id].status > 1) return this.sendReply('The tournament schedule cannot be changed now!');
		if (!tour.timers[room.id]) return this.sendReply('This tournament is not running under a clock!');
		if (!target) return this.sendReply('Proper syntax for this command: /tourtime time');
		target = parseInt(target);
		if (isNaN(target)) return this.sendReply('Proper syntax for this command: /tourtime time');
		if (target < 1) return this.sendReply('That is not a valid reschedule.');
		target = Math.ceil(target);
		tour.timers[room.id].time = target;
		tour.timers[room.id].startTime = tour.currentSeconds;
		room.addRaw('<b>' + user.name + '</b> has changed the remaining time for registering to the tournament to: ' + target + ' minute' + (target === 1 ? '' : 's') + '.');
	},

	jt: 'j',
	jointour: 'j',
	j: function (target, room, user, connection) {
		if (room.type !== 'chat') {
			connection.sendTo(room, 'Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		} else if (tour[room.id] == undefined || tour[room.id].status == 0) {
			connection.sendTo(room, 'There is no active tournament in this room.');
		} else if (tour[room.id].status == 2) {
			connection.sendTo(room, 'Signups for the current tournament are over.');
		} else if (tour.joinable(user.userid, room.id)) {
			tour[room.id].players.push(user.userid);
			var remslots = tour[room.id].size - tour[room.id].players.length;
			// these three assignments (natural, natural, boolean) are done as wished
			if (isFinite(tour[room.id].size)) {
				var pplogmarg = Math.ceil(Math.sqrt(tour[room.id].size) / 2);
				var logperiod = Math.ceil(Math.sqrt(tour[room.id].size));
			} else {
				var pplogmarg = (!isNaN(config.tourtimemargin) ? config.tourtimemargin : 3);
				var logperiod = (config.tourtimeperiod ? config.tourtimeperiod : 4);
			}
			var perplayerlog = ((tour[room.id].players.length <= pplogmarg) || (remslots + 1 <= pplogmarg));
			//

			if (perplayerlog || (tour[room.id].players.length - tour[room.id].playerslogged.length >= logperiod) || (remslots <= pplogmarg)) {
				tour.reportdue(room, connection);
			} else {
				connection.sendTo(room, 'You have succesfully joined the tournament.');
			}
			if (tour[room.id].size == tour[room.id].players.length) tour.start(room.id);
		} else {
			connection.sendTo(room, 'You could not enter the tournament. You may already be in the tournament. Type /lt if you want to leave the tournament.');
		}
	},

	push: 'fj',
	forcejoin: 'fj',
	fj: function (target, room, user, connection) {
		if (!tour.lowauth(user, room)) return this.sendReply('You do not have enough authority to use this command.');
		if (room.type !== 'chat') return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined || tour[room.id].status == 0 || tour[room.id].status == 2) return this.sendReply('There is no active tournament in this room.');
		if (!target) return this.sendReply('Please specify a user who you\'d like to participate.');
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply('The user \'' + target + '\' doesn\'t exist.');
		target = targetUser.userid;
		if (!tour.joinable(target, room.id)) return this.sendReply('The user that you specified is already in the tournament.');
		tour.reportdue(room);
		tour[room.id].players.push(target);
		tour[room.id].playerslogged.push(target);
		var remslots = tour[room.id].size - tour[room.id].players.length;
		room.addRaw(user.name + ' has forced <b>' + tour.toUserName(target) + '</b> to join the tournament.' + tour.remsg(remslots));
		if (tour[room.id].size == tour[room.id].players.length) tour.start(room.id);
	},

	fjall: function (target, room, user) {
		if (!this.can('hotpatch')) return;
		for (var uid in room.users) {
			var loopuser = room.users[uid];
			if (!loopuser.named) continue;
			for (var i=0, l=loopuser.connections.length; i<l; i++) {
				if (room.id in loopuser.connections[i].rooms) {
					CommandParser.commands.j('', room, loopuser, loopuser.connections[i]);
					break;
				}
			}
		}
	},
	
	l: 'lt',
	leavetour: 'lt',
	lt: function (target, room, user, connection) {
		if (room.type !== 'chat') return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined || tour[room.id].status == 0) return this.sendReply('There is no active tournament que abandonar.');
		if (tour[room.id].status == 1) {
			var index = tour[room.id].players.indexOf(user.userid);
			if (index !== -1) {
				if (tour[room.id].playerslogged.indexOf(user.userid) !== -1) {
					tour.reportdue(room);
					tour[room.id].players.splice(index, 1);
					tour[room.id].playerslogged.splice(index, 1);
					var remslots = tour[room.id].size - tour[room.id].players.length;
					room.addRaw('<b>' + user.name + '</b> has left the tournament.' + tour.remsg(remslots));
				} else {
					tour[room.id].players.splice(index, 1);
					return this.sendReply('You have left the tournament.');
				}
			} else {
				return this.sendReply("You're not in the tournament.");
			}
		} else {
			var dqopp = tour.lose(user.userid, room.id);
			if (dqopp && dqopp != -1 && dqopp != 1) {
				room.addRaw('<b>' + user.name + '</b> has left the tournament. <b>' + tour.toUserName(dqopp) + '</b> will advance.');
				var r = tour[room.id].round;
				var c = 0;
				for (var i in r) {
					if (r[i][2] && r[i][2] != -1) c++;
				}
				if (r.length == c) tour.nextRound(room.id);
			} else {
				if (dqopp == 1) return this.sendReply("You've already done your match. Wait till next round to leave.");
				if (dqopp == 0 || dqopp == -1) return this.sendReply("You're not in the tournament or your opponent is unavailable.");
			}
		}
	},

	forceleave: 'fl',
	fl: function (target, room, user, connection) {
		if (!tour.lowauth(user, room)) return this.sendReply('You do not have enough authority to use this command.');
		if (room.type !== 'chat') return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined || tour[room.id].status == 0 || tour[room.id].status == 2) return this.sendReply('There is no tournament in a sign-up phase.  Use /dq username if you wish to remove someone in an active tournament.');
		if (!target) return this.sendReply('Please specify a user to kick from this signup.');
		var targetUser = Users.get(target);
		if (targetUser) {
			target = targetUser.userid;
		} else {
			return this.sendReply('The user \'' + target + '\' doesn\'t exist.');
		}
		var index = tour[room.id].players.indexOf(target);
		if (index !== -1) {
			tour.reportdue(room);
			tour[room.id].players.splice(index, 1);
			tour[room.id].playerslogged.splice(index, 1);
			var remslots = tour[room.id].size - tour[room.id].players.length;
			room.addRaw(user.name + ' has forced <b>' + tour.toUserName(target) + '</b> to leave the tournament.' + tour.remsg(remslots));
		} else {
			return this.sendReply('The user that you specified was not in the tournament.');
		}
	},

	remind: function (target, room, user, connection) {
		if (!tour.lowauth(user, room)) return this.sendReply('You do not have enough authority to use this command.');
		if (room.type !== 'chat') return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined || !tour[room.id].status) return this.sendReply('There is no active tournament in this room.');
		if (tour[room.id].status == 1) {
			tour.reportdue(room);
			room.addRaw('<hr /><h2><font color="green">Please sign up for the ' + Tools.data.Formats[tour[room.id].tier].name + ' Tournament.</font> <font color="red">/j</font> <font color="green">to join!</font></h2><b><font color="blueviolet">PLAYERS:</font></b> ' + (isFinite(tour[room.id].size) ? tour[room.id].size : 'UNLIMITED') + '<br /><font color="blue"><b>TIER:</b></font> ' + Tools.data.Formats[tour[room.id].tier].name + '<hr />');
		} else {
			var c = tour[room.id];
			var unfound = [];
			if (!target) {
				for (var x in c.round) {
					if (c.round[x][0] && c.round[x][1] && !c.round[x][2]) {
						var userOne = Users.get(c.round[x][0]);
						var userTwo = Users.get(c.round[x][1]);
						if (userOne && userOne.connected) {
							if (userTwo && userTwo.connected) {
								var defmsg = "Remember that you have a pending tournament battle in the room **" + room.title + "**. Unless you start soon your battle against **";
								userOne.popup(defmsg + userTwo.name + "** in the format **" + Tools.data.Formats[c.tier].name + "**, you could lose by W.O.");
								userTwo.popup(defmsg + userOne.name + "** in the format **" + Tools.data.Formats[c.tier].name + "**, you could lose by W.O.");
							} else {
								unfound.push(c.round[x][1]);
							}
						} else {
							unfound.push(c.round[x][0]);
							if (!userTwo || !userTwo.connected) {
								unfound.push(c.round[x][1]);
							}
						}
					}
				}
				room.addRaw("Users with pending battles in the tournament have been reminded of them by " + user.name);
			} else {
				var opponent = '';
				var targets = tour.splint(target);
				for (var i = 0; i < targets.length; i++) {
					var nicetarget = false;
					var someuser = Users.get(targets[i]);
					if (someuser && someuser.connected) {
						for (var x in c.round) {
							if (c.round[x][0] && c.round[x][1] && !c.round[x][2]) {
								if (c.round[x][0] === someuser.userid) {
									nicetarget = true;
									opponent = c.round[x][1];
									break;
								} else if (c.round[x][1] === someuser.userid) {
									nicetarget = true;
									opponent = c.round[x][0];
									break;
								}
							}
						}
					}
					if (nicetarget) {
						someuser.popup("Remember that you have a pending tournament battle in the room " + room.title + ". Unless you start soon your battle against " + tour.toUserName(opponent) + "in the tier " + Tools.data.Formats[tour[room.id].tier].name + ", you could lose by W.O.");
					} else {
						unfound.push(targets[i]);
					}
				}
				room.addRaw("Some users with pending battles in the tournament were reminded of it by " + user.name);
			}
			if (unfound.length) return this.sendReply("The following users are offline or lack pending battles: " + unfound.toString());
		}
	},

	viewround: 'vr',
	viewreport: 'vr',
	vr: function (target, room, user, connection) {
		if (tour[room.id] == undefined) return this.sendReply('There is no active tournament in this room.');
		if (!tour[room.id].status) {
			if (!this.canBroadcast()) return;
			var html = tour.getList();
			this.sendReply('|raw|' + html + "<hr />");
		} else if (tour[room.id].status == 1) {
			if (!tour.lowauth(user, room)) return this.sendReply('You should not use this command during the sign-up phase.');
			tour.reportdue(room, connection);
		} else {
			if (!this.canBroadcast()) return;
			if (room.type !== 'chat') return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
			if (tour[room.id] == undefined) return this.sendReply('There is no active tournament in yhid toom.');
			if (tour[room.id].status < 2) return this.sendReply('There is no tournament out of its sign up phase.');
			var html = tour.roundTable(room);
			this.sendReply("|raw|" + html);
		}
	},

	disqualify: 'dq',
	dq: function (target, room, user, connection) {
		if (!tour.midauth(user, room)) return this.sendReply('You do not have enough authority to use this command.');
		if (!target) return this.sendReply('Proper syntax for this command is: /dq username');
		if (room.type !== 'chat') return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined) return this.sendReply('There is no active tournament in this room.');
		if (tour[room.id].status < 2) return this.sendReply('There is no tournament out of its sign up phase.');
		if (config.tourdqguard) {
			var stop = false;
			for (var x in tour[room.id].round) {
				if (tour[room.id].round[x][2] === -1) {
					stop = true;
					break;
				}
			}
			if (stop) return this.sendReply('Due to current settings, it is not possible to disqualify players before the rest of tournament battles finish.');
		}
		var dqGuy = toId(target);
		var error = tour.lose(dqGuy, room.id);
		if (error == -1) {
			return this.sendReply('The user \'' + target + '\' was not in the tournament.');
		} else if (error == 0) {
			return this.sendReply('The user \'' + target + '\' was not assigned an opponent. Wait till next round to disqualify them.');
		} else if (error == 1) {
			return this.sendReply('The user \'' + target + '\' already played their battle. Wait till next round to disqualify them.');
		} else {
			room.addRaw('<b>' + tour.toUserName(dqGuy) + '</b> was disqualified by ' + user.name + ' so ' + tour.toUserName(error) + ' advances.');
			var rid = room.id;
			var r = tour[rid].round;
			var c = 0;
			for (var i in r) {
				if (r[i][2] && r[i][2] != -1 && r[i][2] != -2) c++;
			}
			if (r.length == c) tour.nextRound(rid);
		}
	},

	replace: function (target, room, user, connection) {
		if (!tour.midauth(user, room)) return this.sendReply('You do not have enough authority to use this command.');
		if (room.type !== 'chat') return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (tour[room.id] == undefined || tour[room.id].status != 2) return this.sendReply('The tournament is currently in a sign-up phase or is not active, and replacing users only works mid-tournament.');
		if (tour[room.id].roundNum > 1 && !config.tourunlimitreplace) return this.sendReply('Due to the current settings, replacing users is only allowed in the first round of a tournament. If you do not like it, please contact an administrator.');
		if (!target) return this.sendReply('Proper syntax for this command is: /replace user1, user2.  User 2 will replace User 1 in the current tournament.');
		var t = tour.splint(target);
		if (!t[1]) return this.sendReply('Proper syntax for this command is: /replace user1, user2.  User 2 will replace User 1 in the current tournament.');
		var userTwo = Users.get(t[1]);
		if (!userTwo) {
			return this.sendReply('Proper syntax for this command is: /replace user1, user2.  The user you specified to be placed in the tournament is not present!');
		} else {
			t[1] = toId(t[1]);
		}
		t[0] = toId(t[0]);
		var rt = tour[room.id];
		var players = rt.players;
		var indexOne = players.indexOf(t[0]);
		if (indexOne === -1) return this.sendReply(tour.toUserName(t[0]) + ' cannot be replaced by ' + tour.toUserName(t[1]) + " because they are not in the tournament.");
		var indexTwo = players.indexOf(t[1]);
		if (indexTwo !== -1) return this.sendReply(tour.toUserName(t[1]) + ' cannot replace ' + tour.toUserName(t[0]) + ' because they are already in the tournament.');
		var outof = {"players":1, "winners":1, "losers":1};
		for (var x in outof) {
			for (var i=0, l=rt[x].length; i<l; i++) {
				if (rt[x][i] === t[0]) {
					rt[x][i] = t[1];
					break;
				}
			}
		}
		for (var i=0, l=rt.round.length; i<l; i++) {
			if (rt.round[i][0] === t[0]) {
				rt.round[i][0] = t[1];
				var exchanged = true;
			} else if (rt.round[i][1] === t[0]) {
				rt.round[i][1] = t[1];
				var exchanged = true;
			}
			if (exchanged) {
				if (rt.round[i][2] === t[0]) {
					rt.round[i][2] = t[1];
				}
				break;
			}
		}
		rt.history.push(t[0] + "->" + t[1]);
		room.addRaw('<b>' + tour.toUserName(t[0]) + '</b> has left the tournament and is replaced by <b>' + tour.toUserName(t[1]) + '</b>.');
	},

	tours: function (target, room, user, connection) {
		if (!this.canBroadcast()) return;
		var html = tour.getList();
		this.sendReply('|raw|' + html + "<hr />");
	},

	invalidate: 'invalid',
	invalid: function (target, room, user) {
		if (room.type !== 'battle') return this.sendReply('You can only do this in battle rooms.');
		if (!room.tournament) return this.sendReply('This is not an official tournament battle.');
		if (!tour.highauth(user, room)) return this.sendReply('You do not have enough authority to use this command.');
		var rid = room.tournament;
		var c = tour[rid];
		if (c.status === 2) {
			for (var x in c.round) {
				if (!c.round[x] || c.round[x][2] !== -1) continue;
				if (c.round[x].indexOf(room.p1.userid) !== -1 && c.round[x].indexOf(room.p2.userid) !== -1) {
					c.round[x][2] = undefined;
					Rooms.rooms[rid].addRaw("The tournament match between " + '<b>' + room.p1.name + '</b>' + " and " + '<b>' + room.p2.name + '</b>' + " was " + '<b>' + "invalidated" + '</b>' + ' by ' + user.name);
					break;
				}
			}
		}
	},

	toursettings: 'tourconfig',
	tourconfig: function (target, room, user) {
		return this.sendReply('This command is obsolete. Maybe you are looking for /gtourconfig (global settings) or /rtourconfig (room settings).');
	},

	globaltourconfig: 'gtourconfig',
	globaltoursettings: 'gtourconfig',
	gtourconfig: function (target, room, user) {
		if (!tour.maxauth(user)) return this.sendReply('You do not have enough authority to use this command.');
		if (!this.canBroadcast()) return;
		var targets = tour.splintID(target);
		if (targets[1] === 'on' || targets[1] === 'off' || config.groups[targets[1]]) {
			target = targets.join(' ');
		}
		if (target === 'replace on') {
			config.tourunlimitreplace = true;
		} else if (target === 'replace off') {
			config.tourunlimitreplace = false;
		} else if (target === 'alts on') {
			config.tourallowalts = true;
		} else if (target === 'alts off') {
			config.tourallowalts = false;
		} else if (target === 'dq on') {
			config.tourdqguard = false;
		} else if (target === 'dq off') {
			config.tourdqguard = true;
		} else if (target.substr(0, 8) === 'pollauth' && config.groups[target.substr(9, 1)]) {
			config.tourpollauth = target.substr(9, 1);
		} else if (target.substr(0, 7) === 'lowauth' && config.groups[target.substr(8, 1)]) {
			config.tourlowauth = target.substr(8, 1);
		} else if (target.substr(0, 7) === 'midauth' && config.groups[target.substr(8, 1)]) {
			config.tourmidauth = target.substr(8, 1);
		} else if (target.substr(0, 8) === 'highauth' && config.groups[target.substr(9, 1)]) {
			config.tourhighauth = target.substr(9, 1);
		} else if ((target.substr(0, 6) === 'margin') && !isNaN(parseInt(target.substr(7))) && parseInt(target.substr(7)) >= 0) {
			config.tourtimemargin = parseInt(target.substr(7));
		} else if ((target.substr(0, 6) === 'period') && !isNaN(parseInt(target.substr(7))) && parseInt(target.substr(7)) > 0) {
			config.tourtimeperiod = parseInt(target.substr(7));
		} else if (target === 'view' || target === 'show' || target === 'display') {
			var msg = '';
			msg += '<big><b>Security:</b></big><br>';
			msg += '<b><i>Is it possible to...</i></b><br>';
			msg += '... register with multiple accounts? ' + new Boolean(config.tourallowalts) + '.<br>';
			msg += '... replace users after the first round has finished? ' + new Boolean(config.tourunlimitreplace) + '.<br>';
			msg += '... disqualify users even when other players are battling? ' + (!config.tourdqguard) + '.<br>';
			msg += '<br><b><i>What\'s the rank needed to use commands requiring...</i></b><br>';
			
			// Poll commands are obvious
			// Commands requiring low authority are: forcejoin, forceleave, remind
			// Commands requiring authority are: disqualify, replace, toursize, tourtime, tourstart, endtour
			// The only command requiring high authority is: invalidate
			
			msg += '... polls? ' + (!config.tourpollauth ? '+' : (config.tourpollauth === ' ' ? 'None' : config.tourpollauth)) + '.<br>';
			msg += '... low authority? ' + (!config.tourlowauth ? '+' : (config.tourlowauth === ' ' ? 'None' : config.tourlowauth)) + '.<br>';
			msg += '... mid authority? ' + (!config.tourmidauth ? '+' : (config.tourmidauth === ' ' ? 'None, disrecommended' : config.tourmidauth)) + '.<br>';
			msg += '... high authority? ' + (!config.tourhighauth ? '@' : (config.tourhighauth === ' ' ? 'None, why is it like this?' : config.tourhighauth)) + '.<br>';
			msg += '<br><big><b>Timed register tournaments:</b></big><br>';
			msg += '<b><i>Announcements of joins are done...</i></b><br>';
			msg += '... per player until ' + (!isNaN(config.tourtimemargin) ? config.tourtimemargin : 3) + ' players have joined.<br>';
			msg += '... in groups of ' + (config.tourtimeperiod ? config.tourtimeperiod : 4) + ' players.';
			return this.sendReplyBox(msg);
		} else {
			return this.sendReply('Valid arguments: view, replace on/off, alts on/off, invalidate on/off, dq on/off, lowauth/midauth/highauth SYMBOL, margin NUMBER, period NUMBER');
		}
		return this.sendReply('Global tournaments setings saved.');
	},

	roomtourconfig: 'rtourconfig',
	roomtoursettings: 'rtourconfig',
	rtourconfig: function (target, room, user) {
		if (!room.auth) return this.sendReply('You can only use this command in a room with own moderation.');
		if (room.auth[user.userid] !== '#' && user.group !== '~' && !tour.maxauth(user)) return this.sendReply('You do not have enough authority to use this command.');
		if (!this.canBroadcast()) return;
		var targets = tour.splintID(target);
		if (config.groups[targets[1]]) {
			target = targets.join(' ');
		}
		if (target.substr(0, 8) === 'pollauth' && config.groups[target.substr(9, 1)]) {
			room.tourpollauth = target.substr(9, 1);
		} else if (target.substr(0, 7) === 'lowauth' && config.groups[target.substr(8, 1)]) {
			room.tourlowauth = target.substr(8, 1);
		} else if (target.substr(0, 7) === 'midauth' && config.groups[target.substr(8, 1)]) {
			room.tourmidauth = target.substr(8, 1);
		} else if (target.substr(0, 8) === 'highauth' && config.groups[target.substr(9, 1)]) {
			room.tourhighauth = target.substr(9, 1);
		} else if (target === 'view' || target === 'show' || target === 'display') {
			var msg = '';
			msg += '<br><b><i>What\'s the rank required to use commands of......</i></b><br>';
			
			// Poll commands are obvious
			// Commands requiring low authority are: forcejoin, forceleave, remind
			// Commands requiring authority are: disqualify, replace, toursize, tourtime, tourstart, endtour
			// The only command requiring high authority is: invalidate
			
			msg += '... polls? ' + (!room.tourpollauth ? '+' : (room.tourpollauth === ' ' ? 'Ninguno' : room.tourpollauth)) + '.<br>';
			msg += '... low authority? ' + (!room.tourlowauth ? '+' : (room.tourlowauth === ' ' ? 'Ninguno' : room.tourlowauth)) + '.<br>';
			msg += '... mid authority? ' + (!room.tourmidauth ? '+' : (room.tourmidauth === ' ' ? 'Ninguno' : room.tourmidauth)) + '.<br>';
			msg += '... high authority? ' + (!room.tourhighauth ? '#' : (room.tourhighauth === ' ' ? 'Ninguno' : room.tourhighauth)) + '.<br>';
			return this.sendReplyBox(msg);
		} else {
			return this.sendReply('Valid arguments: view, replace on/off, alts on/off, invalidate on/off, dq on/off, lowauth/midauth/highauth SYMBOL, margin NUMBER, period NUMBER');
		}
		return this.sendReply('Room tournaments setings saved.');
	},
	
	tourdoc: 'tourhelp',
	tourhelp: function(target, room, user) {
		if (!this.canBroadcast()) return;
		var msg = '<center><b>Tournament commands:</b></center>';
		msg += '<ul>';
		msg += '<li>/j - Join a tournament. /lt - Leave it.</li>';
		msg += '<li>/tour [tier],[size / X minutes] - Starts a tournament in the specified tier with a specific amount of players or under a clock.</li>';
		msg += '<li>/tourtime - Sets the timer again.</li>';
		msg += '<li>/toursize - Sets the max amount of players again.</li>';
		msg += '<li>/fj - Enforces a user to join.</li>';
		msg += '<li>/fl - Enforces a user to leave.</li>';
		msg += '<li>/replace - Replaces a user.</li>';
		msg += '<li>/remind - Remind of the register phase to a tourney. Also reminds of pending battles.</li>';
		msg += '<li>!vr - Broadcasts the info of the current round.</li>';
		msg += '<li>/invalidate - Invalidates the battle.</li>';
		msg += '<li>/dq - Disqualifies someone.</li>';
		msg += '<li>/endtour - Forcibly ends a tournament.</li>';
		msg += '<li>/tierpoll - Starts a poll to choice a tier.</li>';
		msg += '<li>/rtourconfig - Sets the min authority to use tournament commands in a room.</li>';
		msg += '</ul>';
		return this.sendReplyBox(msg);
	},
	
	//END TOURNAMENT COMMANDS

	//POLL COMANDS

	freepoll: 'openpoll',
	openpoll: function (target, room, user) {
		if (!tour.pollauth(user, room)) return this.sendReply('You do not have enough authority to use this command.');
		if (!tour[room.id]) tour.reset(room.id);
		if (tour[room.id].question) return this.sendReply('There is already an ongoing poll.');
		var separacion = "&nbsp;&nbsp;";
		var answers = tour.splint(target);
		if (answers.length < 3) return this.sendReply('Correct syntax for this command is /poll question, option, option...');
		var question = answers[0];
		answers.splice(0, 1);
		var answers = answers.join(',').toLowerCase().split(',');
		tour[room.id].question = question;
		tour[room.id].answerList = answers;
		tour[room.id].freepoll = true;
		room.addRaw('<div class="infobox"><h2>' + tour[room.id].question + separacion + '<font color="green"><b>To vote, write </b></font><font color="red"><b>/vote OPTION</b></font><br><small><small><small><font color="purple">You may add new options</font></small></small></small></h2><hr />' + separacion + separacion + " &bull; " + tour[room.id].answerList.join(' &bull; ') + '</div>');
	},

	survey: 'poll',
	poll: function (target, room, user) {
		if (!tour.pollauth(user, room)) return this.sendReply('You do not have enough authority to use this command.');
		if (!tour[room.id]) tour.reset(room.id);
		if (tour[room.id].question) return this.sendReply('There is already an ongoing poll.');
		var answers = tour.splint(target);
		if (answers.length < 3) return this.sendReply('Correct syntax for this command is /openpoll question, option, option...');
		var question = answers[0];
		answers.splice(0, 1);
		var answers = answers.join(',').toLowerCase().split(',');
		tour[room.id].question = question;
		tour[room.id].answerList = answers;
		var separacion = "&nbsp;&nbsp;";
		room.addRaw('<div class="infobox"><h2>' + tour[room.id].question + separacion + '<font color="green"><b>To vote, write </b></font><font color="red"><b>/vote OPTION</b></font></h2><hr />' + separacion + separacion + " &bull; " + tour[room.id].answerList.join(' &bull; ') + '</div>');
	},

	tierpoll: function (target, room, user) {
		if (!tour.pollauth(user, room)) return this.sendReply('You do not have enough authority to use this command.');
		if (!tour[room.id]) tour.reset(room.id);
		if (tour[room.id].question) return this.sendReply('There is already an ongoing poll.');
		if (!target) {
			var question = 'Which format do you prefer for the next tournament?';
		} else {
			var question = target;
		}
		tour[room.id].question = question;
		tour[room.id].answerList = tour.tiers;
		tour[room.id].idpoll = true;
		tour[room.id].hidelist = true;
		tour[room.id].tierpoll = true;
		var separacion = "&nbsp;&nbsp;";
		room.addRaw('<div class="infobox"><h2>' + tour[room.id].question + separacion + '<font color="green"><br><b>To vote, write </b></font><font color="red"><b>/vote FORMAT</b></font><br><small><small><small><font color="purple">Every format is available</font></small></small></small></h2><hr />e.g.: <b>/vote Hackmons</b></div>');
	},

	vote: function (target, room, user) {
		if (!tour[room.id] || !tour[room.id].question) return this.sendReply('There is no poll in this room.');
		var ips = JSON.stringify(user.ips);
		if (tour[room.id].idpoll) {
			target = toId(target);
		} else {
			target = target.toLowerCase();
		}
		var OUarray = ['ou', 'oucurrent', 'gen5ou'];
		if (OUarray.indexOf(target) !== -1) {
			for (var i in OUarray) {
				if (tour[room.id].answerList.indexOf(OUarray[i]) !== -1) {
					target = OUarray[i];
				}
			}
		}
		if (Tools.data.Formats['gen5' + target]) {
			target = 'gen5' + target;
		}
		if (Tools.data.Formats[target + 'beta']) {
			target = target + 'beta';
		}
		if (tour[room.id].answerList.indexOf(target) == -1) {
			if (!tour[room.id].freepoll) {
				if (!tour[room.id].hidelist) return this.sendReply('"' + target + '" is not an option in this poll.');
				if (target.length < 6) return this.sendReply('"' + target + '" is not an option in this poll.');
				var newLd = 4;
				var newtarget = '';
				for (var i = 0, l=tour[room.id].answerList.length; i<l; i++) {
					var someoption = tour[room.id].answerList[i];
					var ld = Tools.levenshtein(target, someoption, 3);
					if (ld < newLd) {
						newtarget = someoption;
						newLd = ld;
						if (ld === 1) break;
					}
				}
				if (!newtarget) return this.sendReply('"' + target + '" is not an option in this poll.');
				target = newtarget;
				tour[room.id].answers[ips] = target.toLowerCase();
				return this.sendReply('Your only vote is now for ' + target + '. Spelling has been corrected.');
			} else {
				tour[room.id].answerList.push(target);
				tour[room.id].answers[ips] = target;
				room.addRaw('<i>' + target + ' was added to the list of options.</i>');
				return this.sendReply('Your only vote is now for ' + target + '.');
			}
		}
		tour[room.id].answers[ips] = target.toLowerCase();
		return this.sendReply('Your only vote is now for ' + target + '.');
	},

	votos: 'votes',
	votes: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('Registered votes: ' + Object.keys(tour[room.id].answers).length);
	},

	endsurvey: 'endpoll',
	ep: 'endpoll',
	endpoll: function (target, room, user) {
		if (!tour.pollauth(user, room)) return this.sendReply('You do not have enough authority to use this command.');
		if (!tour[room.id].question) return this.sendReply('There are no polls to end in this room.');
		var votes = Object.keys(tour[room.id].answers).length;
		if (!votes) {
			room.addRaw("<h3>The poll was canceled because of lack of voters.</h3>");
		} else {
			var options = new Object();
			var obj = tour[room.id];
			for (var i in obj.answerList) options[obj.answerList[i]] = 0;
			for (var i in obj.answers) options[obj.answers[i]]++;
			var sortable = new Array();
			for (var i in options) sortable.push([i, options[i]]);
			sortable.sort(function (a, b) {
				return a[1] - b[1]
			});
			var html = "";
			var reladdup = 0;
			var absaddup = 0;
			for (var i = sortable.length - 1; i > -1; i--) {
				var option = sortable[i][0];
				if (option != parseInt(option)) {
					var qualitative = true;
				}
				var value = sortable[i][1];
				if (value) {
					var relfreq = value / votes;
					html += "&bull; " + option + " - " + Math.round(relfreq * 100) + "% (" + value + ")<br />";
					absaddup += value;
					reladdup += relfreq;
					if ((reladdup > 0.9) && i !== 1) {
						html += "&bull; Other options - " + Math.round(100 * (1 - reladdup)) + "% (" + (votes - absaddup) + ")<br />";
						break;
					}
				} else if (i) {
					html += "&bull; Other options - " + Math.round(100 * (1 - reladdup)) + "% (" + (votes - absaddup) + ")<br />";
				}
			}
			if (!qualitative) {
				var sum = 0;
				for (var i = 0; i < sortable.length; i++) {
					sortable[i][0] = parseInt(sortable[i][0]);
					sum += sortable[i][0] * sortable[i][1];
				}
				var average = sum / votes;
				var sqdevsum = 0;
				for (var i = 0; i < sortable.length; i++) {
					sqdevsum += Math.pow((sortable[i][0] - average), 2) * sortable[i][1];
				}
				var stdev = Math.pow(sqdevsum / votes, 0.5);
				html += '<br><b>Average</b>: ' + tour.toNice(average) + '.';
				html += '<br><b>Standard deviation</b>: ' + tour.toNice(stdev) + '.';
			}
			room.addRaw('<div class="infobox"><h2>Results of "' + obj.question + '"</h2><hr />' + html + '</div>');
		}
		tour[room.id].question = undefined;
		tour[room.id].answerList = new Array();
		tour[room.id].answers = new Object();
		tour[room.id].freepoll = false;
		tour[room.id].idpoll = false;
		tour[room.id].tierpoll = false;
	},

	pollremind: 'pr',
	vp: 'pr',
	pr: function (target, room, user) {
		var separacion = "&nbsp;&nbsp;";
		if (!tour[room.id] || !tour[room.id].question) return this.sendReply('There are no ongoing polls.');
		if (!this.canBroadcast()) return;
		var list = '';
		if (tour[room.id].hidelist) {
			list += separacion + separacion + "<i>The option list has been hidden</i>.";
		} else {
			list += separacion + separacion + " &bull; " + tour[room.id].answerList.join(' &bull; ');
		}
		this.sendReply('|raw|<div class="infobox"><h2>' + tour[room.id].question + separacion + '<font color="green"><b>To vote, write </b></font><font color="red"><b>/vote OPTION</b></font></h2><hr />' + list + '</div>');
	},

	polls: function (target, room, user, connection) {
		if (!this.canBroadcast()) return;
		var oghtml = "<hr /><h2>Active polls:</h2>";
		var html = oghtml;
		for (var u in tour) {
			if (tour[u].question != undefined && !Rooms.rooms[u].isPrivate && !Rooms.rooms[u].staffRoom) html += '<button name="joinRoom" value="' + u + '">' + Rooms.rooms[u].title + ' - ' + tour[u].question + '</button> ';
		}
		if (html == oghtml) html += "There are no ongoing polls right now.";
		this.sendReply('|raw|' + html + "<hr />");
	}
	//END POLL COMMANDS
};

for (var i in cmds) CommandParser.commands[i] = cmds[i];

/*********************************************************
 * Events
 *********************************************************/

Rooms.global.startBattle = function (p1, p2, format, rated, p1team, p2team) {
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
	var i = this.lastBattle + 1;
	var formaturlid = format.toLowerCase().replace(/[^a-z0-9]+/g, '');
	while (Rooms.rooms['battle-' + formaturlid + i]) {
		i++;
	}
	this.lastBattle = i;
	newRoom = this.addRoom('battle-' + formaturlid + '-' + i, format, p1, p2, this.id, rated);
	p1.joinRoom(newRoom);
	p2.joinRoom(newRoom);
	newRoom.joinBattle(p1, p1team);
	newRoom.joinBattle(p2, p2team);
	this.cancelSearch(p1, true);
	this.cancelSearch(p2, true);

	if (!rated) {
		var name1 = p1.name;
		var name2 = p2.name;
		for (var i in tour) {
			var c = tour[i];
			if (c.status === 2 && format === c.tier.toLowerCase()) {
				for (var x in c.round) {
					if (c.round[x][2]) continue;
					if (c.round[x].indexOf(p1.userid) !== -1 && c.round[x].indexOf(p2.userid) !== -1) {
						newRoom.tournament = i;
						c.battles[x] = "battle-" + formaturlid + "-" + this.lastBattle;
						c.round[x][2] = -1;
						Rooms.rooms[i].addRaw("<a href=\"/" + c.battles[x] + "\" class=\"ilink\"><b>Tournament battle between " + p1.name + " and " + p2.name + " started.</b></a>");
						break;
					}
				}
			}
		}
	}

	if (config.reportbattles && !newRoom.tournament) {
		var msg = '<a href="/' + 'battle-' + formaturlid + '-' + this.lastBattle + '" class="ilink"><b>' + ' A battle of the format ' + Tools.getFormat(format).name + ' between ' + p1.getIdentity() + ' and ' + p2.getIdentity() + ' has started.</b></a>';
		Rooms.lobby.addRaw(msg);
	}
};

Rooms.BattleRoom.prototype.joinBattle = function (user, team) {
	var slot = undefined;
	if (this.rated) {
		if (this.rated.p1 === user.userid) {
			slot = 0;
		} else if (this.rated.p2 === user.userid) {
			slot = 1;
		} else {
			return;
		}
	}

	if (this.tournament) {
		if (this.p1.userid === user.userid) {
			slot = 0;
		} else if (this.p2.userid === user.userid) {
			slot = 1;
		} else {
			return;
		}
	}

	this.battle.join(user, slot, team);
	Rooms.global.battleCount += (this.battle.active ? 1 : 0) - (this.active ? 1 : 0);
	this.active = this.battle.active;
	if (this.active) {
		this.title = "" + this.battle.p1 + " vs. " + this.battle.p2;
		this.send('|title|' + this.title);
	}
	this.update();

	if (this.parentid) {
		Rooms.get(this.parentid).updateRooms();
	}
};
 
Rooms.BattleRoom.prototype.win = function (winner) {

	//tour
	var rid = this.tournament;
	if (rid) {
		var winnerid = toId(winner);
		var loserid = this.p1.userid;
		if (this.p1.userid == winnerid) {
			loserid = this.p2.userid;
		} else if (this.p2.userid != winnerid) {
			var istie = true;
		}
		var c = tour[rid];
		if (c.status === 2) {
			for (var x in c.round) {
				if (!c.round[x] || c.round[x][2] !== -1) continue;
				if (c.round[x].indexOf(this.p1.userid) !== -1 && c.round[x].indexOf(this.p2.userid) !== -1) {
					if (istie) {
						c.round[x][2] = undefined;
						Rooms.rooms[rid].addRaw("The tournament match between " + '<b>' + tour.toUserName(this.p1.name) + '</b>' + " and " + '<b>' + tour.toUserName(this.p2.name) + '</b>' + " finished in a " + '<b>' + "tie." + '</b>' + " Please battle again.");
					} else {
						tour.lose(loserid, rid);
						Rooms.rooms[rid].addRaw('<b>' + tour.toUserName(winnerid) + '</b> won their battle against ' + tour.toUserName(loserid) + '.</b>');
						var r = c.round;
						var cc = 0;
						for (var y in r) {
							if (r[y][2] && r[y][2] != -1 && r[y][2] !== -2) {
								cc++;
							}
						}
						if (r.length === cc) {
							tour.nextRound(rid);
						}
					}
				}
			}
		}
	}
	//fin tour

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
			}, function (data, statusCode, error) {
				if (!self.battle) {
					console.log('room expired before ladder update was received');
					return;
				}
				if (!data) {
					self.addRaw('Ladder (probably) updated, but score could not be retrieved (' + error + ').');
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
						var reasons = '' + (acre - oldacre) + ' for ' + (p1score > .99 ? 'winning' : (p1score < .01 ? 'losing' : 'tying'));
						if (reasons.substr(0, 1) !== '-') reasons = '+' + reasons;
						self.addRaw(sanitize(p1) + '\'s rating: ' + oldacre + ' &rarr; <strong>' + acre + '</strong><br />(' + reasons + ')');

						var oldacre = Math.round(data.p2rating.oldacre);
						var acre = Math.round(data.p2rating.acre);
						var reasons = '' + (acre - oldacre) + ' for ' + (p1score > .99 ? 'losing' : (p1score < .01 ? 'winning' : 'tying'));
						if (reasons.substr(0, 1) !== '-') reasons = '+' + reasons;
						self.addRaw(sanitize(p2) + '\'s rating: ' + oldacre + ' &rarr; <strong>' + acre + '</strong><br />(' + reasons + ')');

						Users.get(p1).cacheMMR(rated.format, data.p1rating);
						Users.get(p2).cacheMMR(rated.format, data.p2rating);
						self.update();
					} catch (e) {
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
	Rooms.global.battleCount += 0 - (this.active ? 1 : 0);
	this.active = false;
	this.update();
};

Rooms.BattleRoom.prototype.requestKickInactive = function (user, force) {
	if (this.resetTimer) {
		this.send('|inactive|The inactivity timer is already counting down.', user);
		return false;
	}
	if (user) {
		if (!force && this.battle.getSlot(user) < 0) return false;
		this.resetUser = user.userid;
		this.send('|inactive|Battle timer is now ON: inactive players will automatically lose when time\'s up. (requested by ' + user.name + ')');
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
		this.send('|inactive|You have ' + (ticksLeft0 * 10) + ' seconds to make your decision.', this.battle.getPlayer(0));
	}
	if (inactiveSide != 0) {
		// side 1 is inactive
		var ticksLeft1 = Math.min(this.sideTicksLeft[1] + 1, maxTicksLeft);
		this.send('|inactive|You have ' + (ticksLeft1 * 10) + ' seconds to make your decision.', this.battle.getPlayer(1));
	}

	this.resetTimer = setTimeout(this.kickInactive.bind(this), 10 * 1000);
	return true;
};
