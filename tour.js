/*********************************************************
 * Functions
 *********************************************************/
exports.tour = function(t) {
  if (typeof t != "undefined") var tour = t; else var tour = new Object();
	var tourStuff = {
		tiers: new Array(),
		timerLoop: function() {
			setTimeout(function() {
				tour.currentSeconds++;
				for (var i in tour.timers) {
					var c = tour.timers[i];
					var secondsNeeded = c.time * 60;
					var secondsElapsed = tour.currentSeconds - c.startTime;
					var difference = secondsNeeded - secondsElapsed;
					var fraction = secondsElapsed / secondsNeeded;
					function sendIt(end) {
						if (end) {
							Rooms.rooms[i].addRaw("<h3>El torneo fue cancelado por falta de jugadores.</h3>");
							return;
						}
						Rooms.rooms[i].addRaw("<i>El torneo comenzara en " + difference + " segundo" + (difference == 1 ? '' : 's') + ".</i>");
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
								tour.reportdue(Rooms.rooms[i]);
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
				t = list[i];			// swap list[i] and list[j]
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
		maxauth: function(user) {
			if (user.can('forcewin')) return true;
			return false;
		},
		highauth: function(user) {
			return user.can('ban');
		},
		midauth: function(user, room) {
			return user.can("joinbattle", room);
		},
		lowauth: function(user, room) {
			return user.can("joinbattle", room);
		},
		remsg: function(apparent, useronly) {
			if (!isFinite(apparent)) return '';
			if (apparent === 0) return ' Empieza la primera ronda del torneo.';
			if (useronly) return (' Queda ' + apparent + ' plaza' + ( apparent === 1 ? '' : 's') + '.' );
			return (' Queda <b><i>' + apparent + ' plaza' + ( apparent === 1 ? '' : 's') + '.</b></i>' );
		},
		reportdue: function(room, connection) {
			var trid = tour[room.id];
			var remslots = trid.size - trid.players.length;
			if (trid.players.length == trid.playerslogged.length) {
				if (connection) connection.sendTo(room, 'Nada que reportar ahora.');
			} else if (trid.players.length == trid.playerslogged.length + 1) {
				var someid = trid.players[trid.playerslogged.length];
				room.addRaw('<b>' + tour.username(someid) + '</b> se ha unido al torneo.' + tour.remsg(remslots));
				trid.playerslogged.push(trid.players[trid.playerslogged.length]);
			} else {
				var someid = trid.players[trid.playerslogged.length];
				var prelistnames = '<b>' + tour.username(someid) + '</b>';
				for (var i = trid.playerslogged.length + 1; i < trid.players.length - 1; i++) {
					someid = trid.players[i];
					prelistnames = prelistnames + ', <b>' + tour.username(someid) + '</b>';
				}
				someid = trid.players[trid.players.length - 1];
				var listnames = prelistnames + ' y <b>' + tour.username(someid) + '</b>';
				room.addRaw(listnames + ' se han unido al torneo.' + tour.remsg(remslots));

				trid.playerslogged.push(trid.players[trid.playerslogged.length]);
				for (var i = trid.playerslogged.length; i < trid.players.length - 1; i++) { //the length is disturbed by the push above
					trid.playerslogged.push(trid.players[i]);
				}
				trid.playerslogged.push(trid.players[trid.players.length - 1]);
			}
		},
		joinable: function(uid, rid) {
			var players = tour[rid].players;
			for (var i=0; i<players.length; i++) {
				if (players[i] == uid) return false;
			}
			if (!Config.tourAllowAlts){
				for (var i=0; i<players.length; i++) {
					if (players[i] == uid) return false;
				}
				for (var i=0; i<players.length; i++) {
					for (var j in Users.get(uid).prevNames) {
						if (players[i] == toId(j)) return false;
					}
				}

			}
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
				if (numPlayers == 1) isValid = true; else numByes++;
			}
			while (isValid == false);
			var r = tour[rid].round;
			var sList = tour[rid].players;
			tour.shuffle(sList);
			var key = 0;
			do {
				if (numByes > 0) {
					r.push([sList[key], undefined, sList[key]]);
					tour[rid].winners.push(sList[key]);
					tour[rid].byes.push(sList[key]);
					numByes -= 1
					key++;
				}
			}
			while (numByes > 0);
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
			tour.startRaw(rid);
		},
		startRaw: function(i) {
			var room = Rooms.rooms[i];
			var html = '<hr /><h3><font color="green">Ronda '+ tour[room.id].roundNum +'!</font></h3><font color="blue"><b>FORMATO:</b></font> ' + Tools.data.Formats[tour[room.id].tier].name + "<hr /><center><small><font color=red>Rojo</font> = descalificado, <font color=\"green\">Green</font> = paso a la siguiente ronda, <a class='ilink'><b>URL</b></a> = combatiendo</small><center><br />";
			var round = tour[room.id].round;
			var firstMatch = false;
			for (var i in round) {
				if (!round[i][1]) {
						var p1n = tour.username(round[i][0]);
						if (p1n.substr(0, 6) === 'Guest ') p1n = round[i][0];
						html += "<font color=\"green\">" + clean(p1n) + " ha pasado a la siguiente ronda.</font><br />";
				}
				else {
					var p1n = tour.username(round[i][0]);
					var p2n = tour.username(round[i][1]);
					if (p1n.substr(0, 6) === 'Guest ') p1n = round[i][0];
					if (p2n.substr(0, 6) === 'Guest ') p2n = round[i][1];
					var tabla = ""; if (!firstMatch) {var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";firstMatch = true;}
					html += tabla + "<tr><td align=right>" + clean(p1n) + "</td><td>&nbsp;VS&nbsp;</td><td>" + clean(p2n) + "</td></tr>";
				}
			}
			room.addRaw(html + "</table><hr />");
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
				Rooms.rooms[rid].addRaw('<h2><font color="green">Felicidades <font color="black">' + tour.username(w[0]) + '</font>! has ganado el torneo de formato ' + Tools.data.Formats[tour[rid].tier].name + ' !</font></h2>' + '<br><font color="blue"><b>Segundo Lugar:</b></font> ' + tour.username(l[0]) + '<hr />');
				if (tour[rid].size >= 3 && Rooms.rooms[rid].isOfficial) {
					var moneyFirst = tour[rid].size * 10;
					var moneySecond = Math.floor(moneyFirst / 2);
					Shop.giveMoney(tour.username(w[0]), moneyFirst);
					Shop.giveMoney(tour.username(l[0]), moneySecond);
					Rooms.rooms[rid].addRaw(tour.username(w[0]) + ' ha recibido ' + moneyFirst + ' pd por ganar el torneo!');
					Rooms.rooms[rid].addRaw(tour.username(l[0]) + ' ha recibido ' + moneySecond + ' pd por quedar segundo!');
				}
				tour[rid].status = 0;
			} else {
				var html = '<hr /><h3><font color="green">Ronda '+ tour[rid].roundNum +'!</font></h3><font color="blue"><b>FORMATO:</b></font> ' + Tools.data.Formats[tour[rid].tier].name + "<hr /><center> <small><font color=red>Rojo</font> = descalificado, <font color=\"green\">Green</font> = paso a la siguiente ronda, <a class='ilink'><b>URL</b></a> = combatiendo</small>";
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
				for (var i = 0; i < p.length / 2; i++) {
					var p1 = i * 2;
					var p2 = p1 + 1;
					tour[rid].round.push([p[p1], p[p2], undefined]);
					var p1n = tour.username(p[p1]);
					var p2n = tour.username(p[p2]);
					if (p1n && p1n.substr(0, 6) === 'Guest ') p1n = p[p1];
					if (p2n && p2n.substr(0, 6) === 'Guest ') p2n = p[p2];
					var tabla = "";if (!firstMatch) {var tabla = "</center><br /><table align=center cellpadding=0 cellspacing=0>";firstMatch = true;}
					html += tabla + "<tr><td align=right>" + clean(p1n) + "</td><td>&nbsp;VS&nbsp;</td><td>" + clean(p2n) + "</td></tr>";
				}
				Rooms.rooms[rid].addRaw(html + "</table><hr />");
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
	tourhelp: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<font size = 2>Sistema de torneos  clásico</font><br />' +
						'Sistema de torneos clásico. Disponible para las salas, permitiendo a los usuarios con auth (+ % @ # & ~) crearlos y moderarlos.<br />' +
						'Los comandos son:<br />' +
						'<ul><li>/newtour [formato], [tiempo] minutes - Inicia un torneo. Requiere: + % @ & ~</li>' +
						'<li>/j - Comando para unirse a los tourneos.</li>' +
						'<li>/l - comando para abandonar un torneo.</li>' +
						'<li>/remind - recuerda a los usuarios con batallas pendientes.</li>' +
						'<li>/vr - muestra el estado del torneo.</li>' +
						'<li>/fl [usuario] - Fuerza a un usuario a salir de un torneo en fase de entrada.</li>' +
						'<li>/dq [usuario] - Descalifica a un usuario.</li>' +
						'<li>/replace [usuario1], [usuario2] - Comando para reemplazar.</li>' +
						'<li>/invalidate - Deniega la validez de una batalla.</li>' +
						'<li>/endtour - Cancela el torneo.</li>' +
						'</ul>');
	},
	
	createtour: 'newtour',
	newtour: function(target, room, user, connection) {
		if (target == "update" && this.can('hotpatch')) {
			CommandParser.uncacheTree('./tour.js');
			tour = require('./tour.js').tour(tour);
			return this.sendReply('El codigo de los torneos ha sido actualizado.');
		}
		if (!tour.midauth(user,room)) return this.parse('/tours');
		if (room.decision) return this.sendReply('Prof. Oak: No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		var rid = room.id;
		if (tour[rid] && tour[rid].status != 0) return this.sendReply('Ya hay un torneo en curso.');
		if (War.getTourData(room.id)) return this.sendReply("Ya había una guerra en esta sala.");
		if (teamTour.getTourData(room.id)) return this.sendReply("Ya había un torneo de equipos en esta sala.");
		if (!target) return this.sendReply('El comando correcto es: /newtour formato, tamano');
		var targets = tour.splint(target);
		if (targets.length != 2) return this.sendReply('El comando correcto es: /newtour formato, tamano');
		var tierMatch = false;
		var tempTourTier = '';
		for (var i = 0; i < tour.tiers.length; i++) {
			if (toId(targets[0]) == tour.tiers[i]) {
				tierMatch = true;
				tempTourTier = tour.tiers[i];
			}
		}
		if (!tierMatch) return this.sendReply('Por favor utiliza uno de los siguientes formatos: ' + tour.tiers.join(','));
		if (targets[1].split('minut').length) {
			targets[1] = parseInt(targets[1]);
			if (isNaN(targets[1]) || !targets[1]) return this.sendReply('/newtour formato, NUMERO minutes');
			targets[1] = Math.ceil(targets[1]);
			if (targets[1] < 0) return this.sendReply('Por que programar este torneo para el pasado?');
			tour.timers[rid] = {
				time: targets[1],
				startTime: tour.currentSeconds
			};
			targets[1] = Infinity;
		}
		else {
			targets[1] = parseInt(targets[1]);
		}
		if (isNaN(targets[1])) return this.sendReply('El comando correcto es: /newtour formato, tamano');
		if (targets[1] < 3) return this.sendReply('Los torneos deben tener al menos 3 participantes.');

		this.parse('/endpoll');
		tour.reset(rid);
		tour[rid].tier = tempTourTier;
		tour[rid].size = targets[1];
		tour[rid].status = 1;
		tour[rid].players = new Array();

		Rooms.rooms[rid].addRaw('<hr /><h2><font color="green">' + Tools.escapeHTML(user.name) + ' ha iniciado un torneo de formato ' + Tools.data.Formats[tempTourTier].name + '. Si deseas unirte escribe </font> <font color="red">/j</font> <font color="steelblue">.</font></h2><b><font color="blueviolet">Jugadores:</font></b> ' + targets[1] + '<br /><font color="blue"><b>FORMATO:</b></font> ' + Tools.data.Formats[tempTourTier].name + '<hr /><br /><font color="red"><b>Recuerda que debes mantener tu nombre durante todo el torneo.</b></font>');
		if (tour.timers[rid]) Rooms.rooms[rid].addRaw('<i>El torneo empezara en ' + tour.timers[rid].time + ' minuto' + (tour.timers[rid].time == 1 ? '' : 's') + '.<i>');
	},

	endtour: function(target, room, user, connection) {
		if (!tour.midauth(user,room)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		if (room.decision) return this.sendReply('No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		if (tour[room.id] == undefined || tour[room.id].status == 0) return this.sendReply('No hay un torneo activo.');
		tour[room.id].status = 0;
		delete tour.timers[room.id];
		room.addRaw('<h2><b>' + user.name + '</b> ha cerrado el torneo.</h2>');
	},

	toursize: function(target, room, user, connection) {
		if (!tour.midauth(user,room)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		if (room.decision) return this.sendReply('No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		if (tour[room.id] == undefined) return this.sendReply('No hay un torneo activo en esta sala.');
		if (tour[room.id].status > 1) return this.sendReply('Es imposible cambiar el numero de participantes.');
		if (tour.timers[room.id]) return this.sendReply('Este torneo tiene un numero abierto de participantes, no puede ser cambiado.');
		if (!target) return this.sendReply('El comando correcto es: /toursize tamano');
		target = parseInt(target);
		if (isNaN(target)) return this.sendReply('El comando correcto es: /toursize tamano');
		if (target < 3) return this.sendReply('Un torneo requiere por lo menos 3 personas.');
		if (target < tour[room.id].players.length) return this.sendReply('No puedes reducir el numero de participantes a un numero inferior de los ya registrados.');
		tour[room.id].size = target;
		tour.reportdue(room);
		room.addRaw('<b>' + user.name + '</b> ha cambiado el tamano del torneo a ' + target + '. Queda <b><i>' + (target - tour[room.id].players.length) + ' plaza' + ( ( target - tour[room.id].players.length ) == 1 ? '' : 's') + '.</b></i>');
		if (target == tour[room.id].players.length) tour.start(room.id);
	},

	tourtime: function(target, room, user, connection) {
		if (!tour.midauth(user,room)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		if (room.decision) return this.sendReply('No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		if (tour[room.id] == undefined) return this.sendReply('No hay un torneo activo en esta sala.');
		if (tour[room.id].status > 1) return this.sendReply('Es imposible cambiar el numero de participantes.');
		if (!tour.timers[room.id]) return this.sendReply('Este torneo no funciona con un reloj.');
		if (!target) return this.sendReply('El comando correcto es: /tourtime tiempo');
		target = parseInt(target);
		if (isNaN(target)) return this.sendReply('El comando correcto es: /tourtime tiempo');
		if (target < 1) return this.sendReply('Por que reprogramar un torneo para el pasado?');
		target = Math.ceil(target);
		tour.timers[room.id].time = target;
		tour.timers[room.id].startTime = tour.currentSeconds;
		room.addRaw('<b>' + user.name + '</b> ha cambiado el tiempo de registro a: ' + target + ' minuto' + (target === 1 ? '' : 's') + '.');
		if (target === 0) {
			tour.reportdue(room);
			tour.start(room.id);
		}
	},

	jt: 'j',
	jointour: 'j',
	j: function(target, room, user, connection) {
		if (room.decision) return this.sendReply('No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		if (War.getTourData(room.id)) return this.parse("/war join");
		if (teamTour.getTourData(room.id))return this.parse("/tt join, " + target);
		if (tour[room.id] == undefined || tour[room.id].status == 0) return this.sendReply('No hay torneos activos en esta sala.');
		if (tour[room.id].status == 2) return this.sendReply('Ya no te puedes registrar a este torneo.');
		if (tour.joinable(user.userid, room.id)) {
			tour[room.id].players.push(user.userid);
			var remslots = tour[room.id].size - tour[room.id].players.length;
			// these three assignments (natural, natural, boolean) are done as wished
			if (isFinite(tour[room.id].size)) {
			var pplogmarg = Math.ceil(Math.sqrt(tour[room.id].size) / 2);
			var logperiod = Math.ceil(Math.sqrt(tour[room.id].size));
			} else {
			var pplogmarg = 3;
			var logperiod = 4;
			}
			var perplayerlog = ( ( tour[room.id].players.length <= pplogmarg ) || ( remslots + 1 <= pplogmarg ) );
			//

			if (perplayerlog || (tour[room.id].players.length - tour[room.id].playerslogged.length >= logperiod) || ( remslots <= pplogmarg ) ) {
				tour.reportdue(room, connection);
			} else {
				this.sendReply('Te has unido exitosamente al torneo.');
			}
			if (tour[room.id].size == tour[room.id].players.length) tour.start(room.id);
		} else {
			return this.sendReply('No puedes entrar el torneo porque ya estas en el. Digita /l para salir.');
		}
	},

	lt: 'l',
	leavetour: 'l',
	l: function(target, room, user, connection) {
		if (room.decision) return this.sendReply('Prof. Oak: No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		if (War.getTourData(room.id)) return this.parse("/war leave");
		if (teamTour.getTourData(room.id))return this.parse("/tt leave");
		if (tour[room.id] == undefined || tour[room.id].status == 0) return this.sendReply('No hay un torneo activo que abandonar.');
		if (tour[room.id].status == 1) {
			var index = tour[room.id].players.indexOf(user.userid);
			if (index !== -1) {
				if (tour[room.id].playerslogged.indexOf(user.userid) !== -1) {
					tour.reportdue(room);
					tour[room.id].players.splice(index, 1);
					tour[room.id].playerslogged.splice(index, 1);
					var remslots = tour[room.id].size - tour[room.id].players.length;
					room.addRaw('<b>' + user.name + '</b> ha salido del torneo.' + tour.remsg(remslots));
				} else {
					tour[room.id].players.splice(index, 1);
					return this.sendReply('Has salido del torneo.');
				}
			} else {
				return this.sendReply("No estabas en el torneo.");
			}
		} else {
			var dqopp = tour.lose(user.userid, room.id);
			if (dqopp && dqopp != -1 && dqopp != 1) {
				room.addRaw('<b>' + user.name + '</b> ha salido del torneo. <b>' + tour.username(dqopp) + '</b> pasa a la siguiente ronda.');
				var r = tour[room.id].round;
				var c = 0;
				for (var i in r) {
					if (r[i][2] && r[i][2] != -1) c++;
				}
				if (r.length == c) tour.nextRound(room.id);
			} else {
				if (dqopp == 1) return this.sendReply("Debes esperar hasta la proxima ronda para salir del torneo.");
				if (dqopp == 0 || dqopp == -1) return this.sendReply("No estas en el torneo o tu oponente no esta disponible.");
			}
		}
	},

	forceleave: 'fl',
	fl: function(target, room, user, connection) {
		if (!tour.lowauth(user,room)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		if (room.decision) return this.sendReply('Prof. Oak: No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		if (tour[room.id] == undefined || tour[room.id].status == 0 || tour[room.id].status == 2) return this.sendReply('El torneo no esta en su fase de inscripcion. Utiliza /dq para sacar a alguien del torneo.');
		if (!target) return this.sendReply('Especifica el usuario que deseas sacar.');
		var targetUser = Users.get(target);
		if (targetUser) {
			target = targetUser.userid;
		} else {
			return this.sendReply('El usuario \'' + target + '\' no existe.');
		}
		var index = tour[room.id].players.indexOf(target);
		if (index !== -1) {
			tour.reportdue(room);
			tour[room.id].players.splice(index, 1);
			tour[room.id].playerslogged.splice(index, 1);
			var remslots = tour[room.id].size - tour[room.id].players.length;
			room.addRaw(user.name + ' ha expulsado del torneo a <b>' + tour.username(target) + '</b>.' + tour.remsg(remslots));
		} else {
			return this.sendReply('El usuario no esta en el torneo.');
		}
	},

	remind: function(target, room, user, connection) {
		if (!tour.lowauth(user,room)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		if (room.decision) return this.sendReply('Prof. Oak: No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		if (tour[room.id] == undefined || !tour[room.id].status) return this.sendReply('No hay un torneo activo en esta sala.');
		if (tour[room.id].status == 1) {
			tour.reportdue(room);
			room.addRaw('<hr /><h2><font color="green">Inscribanse al torneo de formato ' + Tools.data.Formats[tour[room.id].tier].name + '. Escribe </font> <font color="red">/j</font> <font color="green">para inscribirte.</font></h2><b><font color="blueviolet">Jugadores:</font></b> ' + (tour[room.id].size === 'Infinity' ? 'ILIMITADOS' : tour[room.id].size) + '<br /><font color="blue"><b>FORMATO:</b></font> ' + Tools.data.Formats[tour[room.id].tier].name + '<hr />');
		} else {
			var c = tour[room.id];
			var unfound = [];
			if (!target) {
				for (var x in c.round) {
					if (c.round[x][0] && c.round[x][1] && !c.round[x][2]) {
						var userOne = Users.get(c.round[x][0]);
						var userTwo = Users.get(c.round[x][1]);
						if (userOne && userOne.connected) {
							userOne.popup("Se te recuerda que tienes una batalla de torneo pendiente en la sala " + room.title + ". Si no inicias pronto tu batalla contra " + tour.username(c.round[x][1]) + " en el formato " + Tools.data.Formats[tour[room.id].tier].name + ", podrias ser descalificado.");
						} else {
							unfound.push(c.round[x][0]);
						}
						if (userTwo && userTwo.connected) {
							userTwo.popup("Se te recuerda que tienes una batalla de torneo pendiente en la sala " + room.title + ". Si no inicias pronto tu batalla contra " + tour.username(c.round[x][0]) + " en el formato " + Tools.data.Formats[tour[room.id].tier].name + ", podrias ser descalificado.");
						} else {
							unfound.push(c.round[x][1]);
						}
					}
				}
			} else {
				var opponent = '';
				var targets = tour.splint(target);
				for (var i=0; i<targets.length; i++) {
					var nicetarget = false;
					var someuser = Users.get(targets[i]);
					if (someuser) {
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
						someuser.popup("Se te recuerda que tienes una batalla de torneo pendiente en la sala " + room.title + ". Si no inicias pronto tu batalla contra " + tour.username(opponent) + " en el formato " + Tools.data.Formats[tour[room.id].tier].name + ", podrias ser descalificado.");
					} else {
						unfound.push(someuser.name);
					}
				}
			}
			room.addRaw("Los usuarios con batallas pendientes en el torneo han sido recordados de el por " + user.name);
			if (unfound.length) return this.sendReply("Los siguientes usuarios estaban desconectados o no tenian batallas pendientes: " + unfound.toString());
		}
	},

	viewround: 'vr',
	viewreport: 'vr',
	vr: function(target, room, user, connection) {
		if (War.getTourData(room.id)) return this.parse("/war round");
		if (teamTour.getTourData(room.id))return this.parse("/tt round");
		if (!tour[room.id].status) {
			if (!this.canBroadcast()) return;
			var oghtml = "<hr /><h2>Torneos en su fase de entrada:</h2>";
			var html = oghtml;
			for (var i in tour) {
				var c = tour[i];
				if (typeof c == "object") {
					if (c.status == 1) html += '<button name="joinRoom" value="' + i + '">' + Rooms.rooms[i].title + ' - ' + Tools.data.Formats[c.tier].name + '</button> ';
				}
			}
			if (html == oghtml) html += "No hay torneos en su fase de entrada.";
			this.sendReply('|raw|' + html + "<hr />");
		} else if (tour[room.id].status == 1) {
			if (!tour.lowauth(user,room)) return this.sendReply('No deberias usar este comando en la fase de inscripcion.');
			tour.reportdue(room, connection);
		} else {
			if (!this.canBroadcast()) return;
			if (room.decision) return this.sendReply('Prof. Oak: No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
			if (tour[room.id] == undefined) return this.sendReply('No hay un torneo activo en una sala.');
			if (tour[room.id].status < 2) return this.sendReply('No hay torneos fuera de la fase de inscripcion.');
			var html = '<hr /><h3><font color="green">Ronda '+ tour[room.id].roundNum + '!</font></h3><font color="blue"><b>FORMATO:</b></font> ' + Tools.data.Formats[tour[room.id].tier].name + "<hr /><center><small><font color=red>Rojo</font> = descalificado, <font color=\"green\">Green</font> = paso a la siguiente ronda, <a class='ilink'><b>URL</b></a> = combatiendo</small><center><br />";
			var r = tour[room.id].round;
			var firstMatch = false;
			for (var i in r) {
				if (!r[i][1]) {
					//bye
					var byer = tour.username(r[i][0]);
					html += "<font color=\"green\">" + clean(byer) + " ha pasado a la siguiente ronda.</font><br />";
				} else {
					if (r[i][2] == undefined) {
						//haven't started
						var p1n = tour.username(r[i][0]);
						var p2n = tour.username(r[i][1]);
						if (p1n.substr(0, 6) === 'Guest ') p1n = r[i][0];
						if (p2n.substr(0, 6) === 'Guest ') p2n = r[i][1];
						var tabla = "";if (!firstMatch) {var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";firstMatch = true;}
						html += tabla + "<tr><td align=right>" + clean(p1n) + "</td><td>&nbsp;VS&nbsp;</td><td>" + clean(p2n) + "</td></tr>";
					} else if (r[i][2] == -1) {
						//currently battling
						var p1n = tour.username(r[i][0]);
						var p2n = tour.username(r[i][1]);
						if (p1n.substr(0, 6) === 'Guest ') p1n = r[i][0];
						if (p2n.substr(0, 6) === 'Guest ') p2n = r[i][1];
						var tabla = "";if (!firstMatch) {var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";firstMatch = true;}
						var tourbattle = tour[room.id].battles[i];
						function link(txt) {return "<a href='/" + tourbattle + "' room='" + tourbattle + "' class='ilink'>" + txt + "</a>";}
						html += tabla + "<tr><td align=right><b>" + link(clean(p1n)) + "</b></td><td><b>&nbsp;" + link("VS") + "&nbsp;</b></td><td><b>" + link(clean(p2n)) + "</b></td></tr>";
					} else {
						//match completed
						var p1 = "red"; var p2 = "green";
						if (r[i][2] == r[i][0]) {
							p1 = "green"; p2 = "red";
						}
						var p1n = tour.username(r[i][0]);
						var p2n = tour.username(r[i][1]);
						if (p1n.substr(0, 6) === 'Guest ') p1n = r[i][0];
						if (p2n.substr(0, 6) === 'Guest ') p2n = r[i][1];
						var tabla = ""; if (!firstMatch) {var tabla = "</center><table align=center cellpadding=0 cellspacing=0>"; firstMatch = true;}
						html += tabla + "<tr><td align=right><b><font color=\"" + p1 + "\">" + clean(p1n) + "</font></b></td><td><b>&nbsp;VS&nbsp;</b></td><td><font color=\"" + p2 + "\"><b>" + clean(p2n) + "</b></font></td></tr>";
					}
				}
			}
			this.sendReply("|raw|" + html + "</table><hr />");
		}
	},

	disqualify: 'dq',
	dq: function(target, room, user, connection) {
		if (War.getTourData(room.id)) return this.parse("/war dq, " + target);
		if (teamTour.getTourData(room.id))return this.parse("/tt dq, " + target);
		if (!tour.midauth(user,room)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		if (!target) return this.sendReply('El comando correcto es: /dq usuario');
		if (room.decision) return this.sendReply('Prof. Oak: No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		if (tour[room.id] == undefined) return this.sendReply('No hay un torneo activo en esta sala.');
		if (tour[room.id].status < 2) return this.sendReply('No hay un torneo fuera de la fase de inscripcion.');
		if (Config.tourDqGuard) {
			var stop = false;
			for (var x in tour[room.id].round) {
				if (tour[room.id].round[x][2] === -1) {
					stop = true;
					break;
				}
			}
			if (stop) return this.sendReply('Debido a la configuracion actual, no es posible descalificar jugadores mientras haya batallas en curso.');
		}
		var targetUser = Users.get(target);
		if (!targetUser) {
			var dqGuy = Tools.escapeHTML(target.toLowerCase());
		} else {
			var dqGuy = toId(target);
		}
		var error = tour.lose(dqGuy, room.id);
		if (error == -1) {
			return this.sendReply('El Usuario \'' + target + '\' no estaba en el torneo.');
		} else if (error == 0) {
			return this.sendReply('El Usuario \'' + target + '\' no tenia un oponente asignado. Espera hasta la siguiente ronda antes de descalificarlo.');
		} else if (error == 1) {
			return this.sendReply('El Usuario \'' + target + '\' ya paso a la siguiente ronda. Espera hasta la siguiente antes de descalificarlo.');
		} else {
			room.addRaw('<b>' + tour.username(dqGuy) + '</b> fue descalificado por ' + user.name + ' asi que ' + tour.username(error) + ' pasa a la siguiente ronda.');
			var r = tour[room.id].round;
			var c = 0;
			for (var i in r) {
				if (r[i][2] && r[i][2] != -1) c++;
			}
			if (r.length == c) tour.nextRound(room.id);
		}
	},

	replace: function(target, room, user, connection) {
		if (War.getTourData(room.id)) return this.parse("/war replace, " + target);
		if (teamTour.getTourData(room.id))return this.parse("/tt replace, " + target);
		if (!tour.midauth(user,room)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		if (room.decision) return this.sendReply('Prof. Oak: No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		if (tour[room.id] == undefined || tour[room.id].status != 2) return this.sendReply('No hay un torneo aca o esta en su fase de inscripcion. Reemplazar participantes solo es posible en la mitad del torneo.');
		if (tour[room.id].roundNum > 1 && !Config.tourUnlimitReplace) return this.sendReply('Debido a la configuracion actual, reemplazar participantes solo esta permitido en la primera ronda de un torneo.');
		if (!target) return this.sendReply('El comando correcto es: /replace reemplazado, sustituto.');
		var t = tour.splint(target);
		if (!t[1]) return this.sendReply('El comando correcto es: /replace reemplazado, sustituto.');
		var userOne = Users.get(t[0]);
		var userTwo = Users.get(t[1]);
		if (!userTwo) {
			return this.sendReply('El comando correcto es: /replace reemplazado, sustituto. El usuario especificado como reemplazado no esta presente.');
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
		if (!init1) return this.sendReply(tour.username(t[0])  + ' no puede ser reemplazado por ' + tour.username(t[1]) + " porque no esta en el torneo.");
		if (init2) return this.sendReply(tour.username(t[1]) + ' no puede reemplazar a ' + tour.username(t[0]) + ' porque ya esta en el torneo.');
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
		room.addRaw(user.name + ': <b>' + tour.username(t[0]) +'</b> es sustituido por <b>' + tour.username(t[1]) + '</b>.');
	},

	tours: function(target, room, user, connection) {
		if (!this.canBroadcast()) return;
		var oghtml = "<hr /><h2>Torneos en su fase de entrada:</h2>";
		var html = oghtml;
		for (var i in tour) {
			var c = tour[i];
			if (typeof c == "object") {
				if (c.status == 1) html += '<button name="joinRoom" value="' + i + '">' + Rooms.rooms[i].title + ' - ' + Tools.data.Formats[c.tier].name + '</button> ';
			}
		}
		if (html == oghtml) html += "No hay torneos en su fase de entrada.";
		this.sendReply('|raw|' + html + "<hr />");
	},

	invalidate: function(target,room,user) {
		if (!room.decision) return this.sendReply('Solo puedes hacer esto en una sala de batalla.');
		if (!room.tournament) return this.sendReply('Esta no es una batalla oficial de torneo.');
		if (!tour.highauth(user)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		tourinvalidlabel:
		{
			for (var i in tour) {
				var c = tour[i];
				if (c.status == 2) {
					for (var x in c.round) {
						if (c.round[x] === undefined) continue;
						if ((room.p1.userid == c.round[x][0] && room.p2.userid == c.round[x][1]) || (room.p2.userid == c.round[x][0] && room.p1.userid == c.round[x][1])) {
							if (c.round[x][2] == -1) {
								c.round[x][2] = undefined;
								Rooms.rooms[i].addRaw("La batalla entre " + '<b>' + room.p1.name + '</b>' + " y " + '<b>' + room.p2.name + '</b>' + " ha sido " + '<b>' + "invalidada." + '</b>');
								tour[i].battlesinvtie.push(room.id);
								break tourinvalidlabel;
							}
						}
					}
				}
			}
		}
	},

	tourbats: function(target, room, user) {
		if (!tour[room.id].status) return this.sendReply('No hay un torneo activo en esta sala.');
		if (target == 'all') {
			if (tour[room.id].battlesended.length == 0) return this.sendReply('No se ha registrado batallas finalizadas en este torneo.');
			var msg = new Array();
			for (var i=0; i<tour[room.id].battlesended.length; i++) {
				msg[i] = "<a href='/" + tour[room.id].battlesended[i] + "' class='ilink'>" + tour[room.id].battlesended[i].match(/\d+$/) + "</a>";
			}
			return this.sendReplyBox(msg.toString());
		} else if (target == 'invtie') {
			if (tour[room.id].battlesinvtie.length == 0) return this.sendReply('No se ha registrado empates ni invalidaciones de batallas en este torneo.');
			var msg = new Array();
			for (var i=0; i<tour[room.id].battlesinvtie.length; i++) {
				msg[i] = "<a href='/" + tour[room.id].battlesinvtie[i] + "' class='ilink'>" + tour[room.id].battlesinvtie[i].match(/\d+$/) + "</a>";
			}
			return this.sendReplyBox(msg.toString());
		} else {
			return this.sendReply('Utilice "/tourbats all" o "/tourbats invtie"');
		}
	},

	toursettings: function(target, room, user) {
		if (!tour.maxauth(user)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		if (target === 'replace on') return Config.tourUnlimitReplace = true;
		if (target === 'replace off') return Config.tourUnlimitReplace = false;
		if (target === 'alts on') return Config.tourAllowAlts = true;
		if (target === 'alts off') return Config.tourAllowAlts = false;
		if (target === 'dq on') return Config.tourDqGuard = false;
		if (target === 'dq off') return Config.tourDqGuard = true;
		if ((target.substr(0,6) === 'margin') && !isNaN(parseInt(target.substr(7))) && parseInt(target.substr(7)) >= 0) return Config.tourTimeMargin = parseInt(target.substr(7));
		if ((target.substr(0,6) === 'period') && !isNaN(parseInt(target.substr(7))) && parseInt(target.substr(7)) > 0) return Config.tourTimePeriod = parseInt(target.substr(7));
		if (target === 'view' || target === 'show' || target === 'display') {
			var msg = '';
			msg = msg + 'Es posible reemplazar participantes luego de la primera ronda? ' + new Boolean(Config.tourUnlimitReplace) + '.<br>';
			msg = msg + 'Puede un jugador participar en un torneo con varias cuentas? ' + new Boolean(Config.tourAllowAlts) + '.<br>';
			msg = msg + 'Es posible descalificar participantes si hay batallas en curso? ' + (!Config.tourDqGuard) + '.<br>';
			msg = msg + 'En torneos con fase de registro cronometrada, el registro de jugadores se anuncia indidualmente hasta que ' + (!isNaN(Config.tourTimeMargin) ? Config.tourTimeMargin : 3) + ' se hayan unido.<br>';
			msg = msg + 'En torneos con fase de registro cronometrada, el registro de jugadores se anuncia en grupos de ' + (Config.tourTimePeriod ? Config.tourTimePeriod : 4) + ' participantes.';
			return this.sendReplyBox(msg);
		}
		return this.sendReply('Son argumentos validos para este comando: view, replace on/off, alts on/off, invalidate on/off, dq on/off, lowauth/midauth/highauth SIMBOLO, margin NUMERO, period NUMERO');
	},

		/*
	tourdoc: function() {
		if (!this.canBroadcast()) return;
		this.sendReplyBox("Click <a href='http://elloworld.dyndns.org/documentation.html'>here</a> to be taken to the documentation for the tournament commands.");
	},
		*/

	survey: 'poll',
	poll: function(target, room, user) {
		if (!tour.lowauth(user,room)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		if (tour[room.id].question) return this.sendReply('Ya hay una encuesta en curso.');
		var separacion = "&nbsp;&nbsp;";
		var answers = tour.splint(target);
		if (answers.length < 3) return this.sendReply('El comando correcto es /poll pregunta, opcion1, opcion2...');
		var question = answers[0];
		answers.splice(0, 1);
		var answers = answers.join(',').toLowerCase().split(',');
		tour[room.id].question = question;
		tour[room.id].answerList = answers;
		this.logModCommand(user.name + ' ha iniciado la encuesta "' + tour[room.id].question + '"');
		var pollOptions = '';
		for (var i = 0; i < tour[room.id].answerList.length; ++i) {
			pollOptions += '<button name="send" value="/vote ' + tour[room.id].answerList[i] + '">' + tour[room.id].answerList[i] + '</button>' + separacion;
		}
		room.addRaw('<div class="infobox"><h2>' + tour[room.id].question + separacion + '<font color="green"><small>Para votar escribe /vote OPCION</small></font></h2><hr />' + pollOptions + '</div>');
	},
	
	tierpoll: function(target, room, user) {
		this.parse('/poll Formato para el siguiente Torneo, ' + Object.keys(Tools.data.Formats).filter(function (f) {return Tools.data.Formats[f].effectType === 'Format'; }).join(", "));
	},

	vote: function(target, room, user) {
		var ips = JSON.stringify(user.ips);
		if (!tour[room.id].question) return this.sendReply('No hay encuestas en curso.');
		if (tour[room.id].answerList.indexOf(target.toLowerCase()) == -1) return this.sendReply('\'' + target + '\' no es una opcion en esta encuesta.');
		tour[room.id].answers[ips] = target.toLowerCase();
		return this.sendReply('Tu unico voto ahora es por ' + target + '.');
	},

	votes: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('Votos registrados: ' + Object.keys(tour[room.id].answers).length);
	},

	endsurvey: 'endpoll',
	ep: 'endpoll',
	endpoll: function(target, room, user) {
		if (!tour.lowauth(user,room)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		if (!tour[room.id].question) return this.sendReply('No hay encuestas en curso en esta sala.');
		var votes = Object.keys(tour[room.id].answers).length;
		this.logModCommand(user.name + ' ha cancelado la encuesta.');
		if (!votes) {
			tour[room.id].question = undefined;
			tour[room.id].answerList = new Array();
			tour[room.id].answers = new Object();
			return room.addRaw("<h3>La encuesta fue cancelada debido a que nadie ha participado hasta ahora.</h3>");
		} else {
			var options = new Object();
			var obj = tour[room.id];
			for (var i in obj.answerList) options[obj.answerList[i]] = 0;
			for (var i in obj.answers) options[obj.answers[i]]++;
			var sortable = new Array();
			for (var i in options) sortable.push([i, options[i]]);
			sortable.sort(function(a, b) {return a[1] - b[1]});
			var html = "";
			var topAnswer  = false;
			for (var i = sortable.length - 1; i > -1; i--) {
					var option = sortable[i][0];
					var value = sortable[i][1];
					if (!topAnswer) topAnswer = option;
					if (value > 0) {
						html += "&bull; " + option + " - " + Math.floor(value / votes * 100) + "% (" + value + ")<br />";
					}
			}
			room.addRaw('<div class="infobox"><h2>Resultados de "' + obj.question + '"</h2><hr />' + html + '</div>');
			tour[room.id].topOption = topAnswer;
			tour[room.id].question = undefined;
			tour[room.id].answerList = new Array();
			tour[room.id].answers = new Object();
		}
	},

	pollremind: 'pr',
	pr: function(target, room, user) {
		var separacion = "&nbsp;&nbsp;";
		if (!tour[room.id].question) return this.sendReply('No hay encuestas en curso.');
		if (!this.canBroadcast()) return;
		var pollOptions = '';
		for (var i = 0; i < tour[room.id].answerList.length; ++i) {
			pollOptions += '<button name="send" value="/vote ' + tour[room.id].answerList[i] + '">' + tour[room.id].answerList[i] + '</button>' + separacion;
		}
		this.sendReply('|raw|<div class="infobox"><h2>' + tour[room.id].question + separacion + '<font color="green"><small>Para votar escribe "/vote OPCION"</small></font></h2><hr />' + pollOptions + '</div>');
	}
};

for (var i in cmds) CommandParser.commands[i] = cmds[i];
/*********************************************************
 * Events
 *********************************************************/
if (!Rooms.global._startBattle) Rooms.global._startBattle = Rooms.global.startBattle;
Rooms.global.startBattle = function(p1, p2, format, rated, p1team, p2team) {
	var newRoom = this._startBattle(p1, p2, format, rated, p1team, p2team);
	if (!newRoom) return;
	var formaturlid = format.toLowerCase().replace(/[^a-z0-9]+/g, '');
	//tour
	if (!rated) {
		var name1 = p1.name;
		var name2 = p2.name;
		for (var i in tour) {
			var c = tour[i];
			if (c.status == 2) {
				for (var x in c.round) {
					if ((p1.userid == c.round[x][0] && p2.userid == c.round[x][1]) || (p2.userid == c.round[x][0] && p1.userid == c.round[x][1])) {
						if (!c.round[x][2] && c.round[x][2] != -1) {
							if (format == c.tier.toLowerCase()) {
								newRoom.tournament = true;
								c.battles[x] = newRoom.id;
								c.round[x][2] = -1;
								Rooms.rooms[i].addRaw("<a href=\"/" + c.battles[x] + "\" class=\"ilink\"><b>La batalla de torneo entre " + p1.name + " y " + p2.name + " ha comenzado.</b></a>");
							}
						}
					}
				}
			}
		}
	}
	//fin tour

	return newRoom;
};

if (!Rooms.BattleRoom.prototype._win) Rooms.BattleRoom.prototype._win = Rooms.BattleRoom.prototype.win;
Rooms.BattleRoom.prototype.win = function(winner) {
	//tour
	if (this.tournament) {
		var winnerid = toId(winner);

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
							if (istie) {
								c.round[x][2] = undefined;
								Rooms.rooms[i].addRaw("La batalla entre " + '<b>' + tour.username(this.p1.name) + '</b>' + " y " + '<b>' + tour.username(this.p2.name) + '</b>' + " termino en un " + '<b>' + "empate." + '</b>' + " Por favor inicien otra batalla.");
								tour[i].battlesinvtie.push(this.id);
							} else {
								tour.lose(loserid, i);
								Rooms.rooms[i].addRaw('<b>' + tour.username(winnerid) + '</b> ha ganado su batalla contra ' + tour.username(loserid) + '.</b>');
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
							tour[i].battlesended.push(this.id);
						}
					}
				}
			}
		}
	}
	//fin tour

	this._win(winner);
};
