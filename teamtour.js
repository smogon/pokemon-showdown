/*********************************************************
 * Functions
 *********************************************************/
 
var teamTours = {};
exports.teamTours = teamTours;
var tourTiers = {};
tourTiers['multitier'] = "Multi-Tier";
for (var i in Tools.data.Formats) {
	if (Tools.data.Formats[i].effectType == 'Format' && Tools.data.Formats[i].challengeShow) {
		tourTiers[toId(i)] = Tools.data.Formats[i].name;
	}
}
exports.tourTiers = tourTiers;

exports.getTours = function () {
	if (!teamTours)
		return 'No hay ningún torneo de eqipos en curso.';
	var tourList = '';
	for (var w in teamTours) {
		if (teamTours[w].tourRound === 0) {
			tourList += '<a class="ilink" href="/' + w + '"> Torneo de Equipos en formato ' + teamTours[w].format + ' entre  ' + teamTours[w].teamA + ' y ' + teamTours[w].teamB + ' en la sala ' + w + '</a> <br />';
		} else {
			tourList += '<a class="ilink" href="/' + w + '"> Torneo de Equipos en formato ' + teamTours[w].format + ' entre  ' + teamTours[w].teamA + ' y ' + teamTours[w].teamB + ' en la sala ' + w + ' (Iniciado)</a> <br />';
		}
	}
	if (!tourList || tourList === '')
		return 'No hay ningún torneo de equipos en curso.';
	return tourList;
};

exports.findTourFromMatchup = function (p1, p2, format, battleLink) {
	p1 = toId(p1);
	p2 = toId(p2);
	for (var i in teamTours) {
		if (teamTours[i].tourRound === 0) continue;
		if (toId(teamTours[i].format) !== toId(format) && toId(teamTours[i].format) !== 'multitier') continue;
		for (var j in teamTours[i].matchups) {
			if (teamTours[i].matchups[j].result === 1 && battleLink !== teamTours[i].matchups[j].battleLink) continue;
			if (teamTours[i].matchups[j].result > 1) continue;
			if (toId(teamTours[i].matchups[j].from) === p1 && toId(teamTours[i].matchups[j].to) === p2) return {tourId: i, matchupId: j};
			if (toId(teamTours[i].matchups[j].from) === p2 && toId(teamTours[i].matchups[j].to) === p1) return {tourId: i, matchupId: j};
		}
	}
	return false;
};

exports.findMatchup = function (room, user) {
	var roomId = toId(room);
	var userId = toId(user);
	if (!teamTours[roomId]) return false;
	for (var i in teamTours[roomId].matchups) {
		if (userId === toId(teamTours[roomId].matchups[i].from) || userId === toId(teamTours[roomId].matchups[i].to)) {
			return i;
		}
	}
	return false;
};

exports.getTourData = function (room) {
	var roomId = toId(room);
	if (!teamTours[roomId]) return false;
	var data = {
		teamA: teamTours[roomId].teamA,
		teamB: teamTours[roomId].teamB,
		authA: teamTours[roomId].authA,
		authB: teamTours[roomId].authB,
		matchups: teamTours[roomId].matchups,
		byes: teamTours[roomId].byes,
		teamWithByes: teamTours[roomId].teamWithByes,
		teamAMembers: teamTours[roomId].teamAMembers,
		teamBMembers: teamTours[roomId].teamBMembers,
		format: teamTours[roomId].format,
		size: teamTours[roomId].size,
		type: teamTours[roomId].type,
		tourRound: teamTours[roomId].tourRound,
	};
	return data;
};

exports.getFreePlaces = function (room) {
	var roomId = toId(room);
	if (!teamTours[roomId])
		return 0;
	var membersA = teamTours[roomId].size;
	var membersB = teamTours[roomId].size;
	var registeredA = Object.keys(teamTours[roomId].teamAMembers);
	var registeredB = Object.keys(teamTours[roomId].teamBMembers);
	if (registeredA) {
		membersA = teamTours[roomId].size - registeredA.length;
	}
	if (registeredB) {
		membersB = teamTours[roomId].size - registeredB.length;
	}
	return membersA + membersB;
};

exports.getAvailableMembers = function (avaliableMembers) {
	if (!avaliableMembers) return false;
	return Object.keys(avaliableMembers);
};

exports.newTeamTour = function (room, type, format, size, teamA, teamB, authA, authB) {
	var roomId = toId(room);
	teamTours[roomId] = {
		teamA: teamA,
		teamB: teamB,
		authA: authA,
		authB: authB,
		matchups: {},
		byes: {},
		teamWithByes: false,
		teamAMembers: {},
		teamBMembers: {},
		format: format,
		size: parseInt(size),
		type: toId(type),
		tourRound: 0,
	};
	return true;
};

exports.joinable = function(room, user) {
	var roomId = toId(room);
	var userId = toId(user);
	var playersA = teamTours[roomId].teamAMembers;
	var playersB = teamTours[roomId].teamBMembers;
	if (teamTours[roomId].teamAMembers[userId] || teamTours[roomId].teamBMembers[userId]) return false;
	if (!Config.tourAllowAlts){
		for (var i in playersA) {
			for (var j in Users.get(userId).prevNames) {
				if (toId(i) == toId(j)) return false;
			}
		}
		for (var i in playersB) {
			for (var j in Users.get(userId).prevNames) {
				if (toId(i) == toId(j)) return false;
			}
		}
	}
	return true;
};

exports.joinTeamTour = function (room, user, team) {
	var roomId = toId(room);
	var userId = toId(user);
	if (!teamTours[roomId]) return 'No había ningun torneo de equipos en esta sala.';
	if (teamTours[roomId].tourRound !== 0) return 'El torneo ya ha empezado. No te puedes unir.';
	if (teamTours[roomId].type === 'lineups') return 'Los equipos deben ser registrados por los capitanes de los equipos en este torneo.';
	if (!exports.joinable(room, user)) return 'Ya estabas inscrito en este torneo. Para jugar por otro equipo primero debes salir.';
	var registeredA = Object.keys(teamTours[roomId].teamAMembers);
	var registeredB = Object.keys(teamTours[roomId].teamBMembers);
	if (toId(team) === toId(teamTours[roomId].teamA) && registeredA.length < teamTours[roomId].size) {
		teamTours[roomId].teamAMembers[userId] = 1;
		return false;
	}
	if (toId(team) === toId(teamTours[roomId].teamB) && registeredB.length < teamTours[roomId].size) {
		teamTours[roomId].teamBMembers[userId] = 1;
		return false;
	}
	return 'No quedan plazas para el equipo especificado.';
};

exports.regParticipants = function (room, user, source) {
	var roomId = toId(room);
	var userId = toId(user);
	var params = source.split(',');
	if (!teamTours[roomId]) return 'No había ningun torneo de equipos en esta sala.';
	if (teamTours[roomId].tourRound !== 0) return 'El torneo ya ha empezado. No se puede registrar alieaciones.';
	if (teamTours[roomId].type !== 'lineups') return 'Este no es un torneo por alineaciones.';
	var lineup = {};
	var oldLineup = {};
	if (params.length < (teamTours[roomId].size + 1)) return 'Debes especificar la alineación completa.';
	var targetUser;
	if (toId(user) === toId(teamTours[roomId].authA)) oldLineup = teamTours[roomId].teamBMembers;
	if (toId(user) === toId(teamTours[roomId].authB)) oldLineup = teamTours[roomId].teamAMembers;
	for (var n = 0; n < teamTours[roomId].size; ++n) {
		targetUser = Users.get(params[n + 1]);
		if (!targetUser || !targetUser.connected) return toId(params[n + 1]) + ' no existe o no está disponible. Todos los usuarios de la alineacón deben estarlo.';
		if (oldLineup[toId(targetUser.name)] || lineup[toId(targetUser.name)]) return toId(params[n + 1]) + ' ya estaba en otro equipo o lo has escrito 2 veces.';
		lineup[toId(targetUser.name)] = 1;
	}
	if (userId === toId(teamTours[roomId].authA)) teamTours[roomId].teamAMembers = lineup;
	if (userId === toId(teamTours[roomId].authB)) teamTours[roomId].teamBMembers = lineup;
	return false;
};

exports.sizeTeamTour = function (room, size) {
	var roomId = toId(room);
	size = parseInt(size);
	if (size < 2) return 'El tamaño del torneo no es válido.';
	if (!teamTours[roomId]) return 'No había ningun torneo de equipos en esta sala.';
	if (teamTours[roomId].tourRound !== 0) return 'El torneo ya ha empezado. No se le puede cambiar el tamaño.';
	var registeredA = Object.keys(teamTours[roomId].teamAMembers);
	var registeredB = Object.keys(teamTours[roomId].teamBMembers);
	if (registeredA.length <= size && registeredB.length <= size) {
		teamTours[roomId].size = size;
		return false;
	}
	return 'Se han registrado demasiados usuarios como para cambiar el tamaño del torneo.';
};

exports.setAuth = function (room, authA, authB) {
	var roomId = toId(room);
	if (!teamTours[roomId]) return 'No había ningun torneo de equipos en esta sala.';
	if (teamTours[roomId].type !== 'lineups') return 'Este no es un torneo por alineaciones.';
	teamTours[roomId].authA = authA;
	teamTours[roomId].authB = authB;  
	return false;
};

exports.leaveTeamTour = function (room, user) {
	var roomId = toId(room);
	var userId = toId(user);
	if (!teamTours[roomId]) return 'No había ningun torneo de equipos en esta sala.';
	if (!teamTours[roomId].teamAMembers[userId] && !teamTours[roomId].teamBMembers[userId]) return 'No estabas inscrito en el torneo.';
	if (teamTours[roomId].tourRound !== 0) {
		if (!exports.dqTeamTour(room, user, 'cmd')) return 'Ya habías sido descalificado o pasado a la siguiente ronda';
		Rooms.rooms[roomId].addRaw('<b>' + user + '</b> se ha autodescalificado del torneo de equipos.');
		if (exports.isRoundEnded(roomId)) {
			exports.autoEnd(roomId);
		}
		return 'Has salido del torneo.';
	} else {
		if (teamTours[roomId].type === 'lineups') return 'Los equipos deben ser registrados por los capitanes de los equipos en este torneo.';
		if (teamTours[roomId].teamAMembers[userId]) delete teamTours[roomId].teamAMembers[userId];
		if (teamTours[roomId].teamBMembers[userId]) delete teamTours[roomId].teamBMembers[userId];
	}
	return false;
};

exports.startTeamTour = function (room) {
	var roomId = toId(room);
	if (!teamTours[roomId]) return false;
	if (teamTours[roomId].type === 'lineups') {
		var teamAMembers = exports.getAvailableMembers(teamTours[roomId].teamAMembers);
		var teamBMembers = exports.getAvailableMembers(teamTours[roomId].teamBMembers);
	} else {
		var teamAMembers = exports.getAvailableMembers(teamTours[roomId].teamAMembers).randomize();
		var teamBMembers = exports.getAvailableMembers(teamTours[roomId].teamBMembers).randomize();
	}
	var memberCount = Math.min(teamAMembers.length, teamBMembers.length);
	var matchups = {};
	for (var m = 0; m < memberCount; ++m) {
		matchups[toId(teamAMembers[m])] = {from: teamAMembers[m], to: teamBMembers[m], battleLink: '', result: 0};
	}
	teamTours[roomId].matchups = matchups;
	teamTours[roomId].tourRound = 1;
	return true;
};

exports.newRound = function (room) {
	var roomId = toId(room);
	if (!teamTours[roomId]) return false;
	var avaliableMembersA = [];
	var avaliableMembersB = [];
	for (var m in teamTours[roomId].matchups) {
		if (teamTours[roomId].matchups[m].result === 2) {
			avaliableMembersA.push(toId(teamTours[roomId].matchups[m].from));
		} else if (teamTours[roomId].matchups[m].result === 3) {
			avaliableMembersB.push(toId(teamTours[roomId].matchups[m].to));
		}
	}
	for (var s in teamTours[roomId].byes) {
		if (toId(teamTours[roomId].teamWithByes) === toId(teamTours[roomId].teamA)) {
			avaliableMembersA.push(toId(s));
		} else {
			avaliableMembersB.push(toId(s));
		}
	}
	if (avaliableMembersA) avaliableMembersA = avaliableMembersA.randomize();
	if (avaliableMembersB) avaliableMembersB = avaliableMembersB.randomize();
	var memberCount = Math.min(avaliableMembersA.length, avaliableMembersB.length);
	var totalMemberCount = Math.max(avaliableMembersA.length, avaliableMembersB.length);
	var matchups = {};
	for (var m = 0; m < memberCount; ++m) {
		matchups[toId(avaliableMembersA[m])] = {from: avaliableMembersA[m], to: avaliableMembersB[m], battleLink: '', result: 0};
	}
	var byes = {};
	if (avaliableMembersA.length > avaliableMembersB.length) {
		teamTours[roomId].teamWithByes = teamTours[roomId].teamA;
	} else if (avaliableMembersA.length < avaliableMembersB.length) {
		teamTours[roomId].teamWithByes = teamTours[roomId].teamB;
	} else {
		teamTours[roomId].teamWithByes = false;
	}
	for (var m = memberCount; m < totalMemberCount; ++m) {
		if (avaliableMembersA.length > avaliableMembersB.length) byes[toId(avaliableMembersA[m])] = 1;
		if (avaliableMembersA.length < avaliableMembersB.length) byes[toId(avaliableMembersB[m])] = 1;
	}
	teamTours[roomId].matchups = matchups;
	teamTours[roomId].byes = byes;
	++teamTours[roomId].tourRound;
	Rooms.rooms[roomId].addRaw(exports.viewTourStatus(roomId));
	
};

exports.autoEnd = function (room) {
	var roomId = toId(room);
	if (!teamTours[roomId]) return false;
	var scoreA = 0;
	var scoreB = 0;
	var nMatchups = 0;
	var nByes = 0;
	for (var b in teamTours[roomId].matchups) {
		++nMatchups;
		if (teamTours[roomId].matchups[b].result === 2) {
			++scoreA;
		} else if (teamTours[roomId].matchups[b].result === 3) {
			++scoreB;
		}
	}
	if (teamTours[roomId].type === 'total') {
		for (var f in teamTours[roomId].byes) {
			++nByes;
		}
		if (scoreA === 0 || scoreB === 0) {
			if (scoreA === 0) {
				if (toId(teamTours[roomId].teamWithByes) === toId(teamTours[roomId].teamA)) {
					exports.newRound(roomId);
					return;
				} 
				scoreB = teamTours[roomId].size;
				scoreA = teamTours[roomId].size - nMatchups - nByes;
			} else if (scoreB === 0) {
				if (toId(teamTours[roomId].teamWithByes) === toId(teamTours[roomId].teamB)) {
					exports.newRound(roomId);
					return;
				}
				scoreA = teamTours[roomId].size;
				scoreB = teamTours[roomId].size - nMatchups - nByes;
			}
		} else {
			exports.newRound(roomId);
			return;
		}
	}
	//raw of end
	var htmlEndTour = '';
	if (scoreA > scoreB) {
		htmlEndTour = '<br><hr /><h2><font color="green"><center>&iexcl;Felicidades <font color="black">' + teamTours[roomId].teamA + '</font>!</center></font></h2><h2><font color="green"><center>&iexcl;Has ganado el Torneo de Equipos en formato ' + teamTours[roomId].format + ' contra <font color="black">' + teamTours[roomId].teamB + "</font>!</center></font></h2><hr />";
	} else if (scoreA < scoreB) {
		htmlEndTour = '<br><hr /><h2><font color="green"><center>&iexcl;Felicidades <font color="black">' + teamTours[roomId].teamB + '</font>!</center></font></h2><h2><font color="green"><center>&iexcl;Has ganado el Torneo de Equipos en formato ' + teamTours[roomId].format + ' contra <font color="black">' + teamTours[roomId].teamA + "</font>!</center></font></h2><hr />";
	} else if (scoreA === scoreB) {
		htmlEndTour = '<br><hr /><h2><font color="green"><center>&iexcl;El Torneo de Equipos de formato ' + teamTours[roomId].format + ' entre <font color="black">' + teamTours[roomId].teamA + '</font> y <font color="black">' + teamTours[roomId].teamB + '</font> ha terminado en Empate!</center></font></h2><hr />';
	}
	Rooms.rooms[roomId].addRaw(exports.viewTourStatus(roomId)+ htmlEndTour);
	exports.endTeamTour(roomId);
};

exports.isRoundEnded = function (room) {
	var roomId = toId(room);
	if (!teamTours[roomId]) return false;

	for (var m in teamTours[roomId].matchups)
		if (teamTours[roomId].matchups[m].result < 2)
			return false;
	return true;
};

exports.setActiveMatchup = function (room, matchup, battlelink) {
	var roomId = toId(room);
	var matchupId = toId(matchup);
	if (!teamTours[roomId] || !teamTours[roomId].matchups[matchupId]) return false;
	teamTours[roomId].matchups[matchupId].result = 1;
	teamTours[roomId].matchups[matchupId].battleLink = battlelink;
	return true;
};

exports.dqTeamTour = function (room, user, forced) {
	var roomId = toId(room);
	var userId = toId(user);
	if (!teamTours[roomId]) return false;
	for (var i in teamTours[roomId].matchups) {
		if (userId === toId(teamTours[roomId].matchups[i].from) || userId === toId(teamTours[roomId].matchups[i].to)) {
			if (teamTours[roomId].matchups[i].result < 2) {
				if (userId === toId(teamTours[roomId].matchups[i].from)) teamTours[roomId].matchups[i].result = 3; 
				if (userId === toId(teamTours[roomId].matchups[i].to)) teamTours[roomId].matchups[i].result = 2;
				if (forced !== 'cmd' && exports.isRoundEnded(roomId)) {
					exports.autoEnd(roomId);
				}
				return true;
			}
		}
	}
	return false;
};

exports.invalidate = function (room, matchup) {
	var roomId = toId(room);
	var matchupId = toId(matchup);
	if (!teamTours[roomId] || !teamTours[roomId].matchups[matchupId]) return false;
	teamTours[roomId].matchups[matchupId].result = 0;
	teamTours[roomId].matchups[matchupId].battleLink = '';
	return true;
};

exports.replaceParticipant = function (room, p1, p2) {
	var roomId = toId(room);
	if (!teamTours[roomId]) return 'No había ningún torneo de equipos en la sala.';
	if (!teamTours[roomId].tourRound === 0) return 'El torneo no habia empezado';
	var matchupId = exports.findMatchup(room, p1);
	if (!matchupId) return 'El usuario no participaba en nungún combate del torneo.';
	if (teamTours[roomId].matchups[matchupId].result > 0) return 'No se puede reemplazar si el combate ya ha empezado.';
	if (teamTours[roomId].teamAMembers[p1]) {
		delete teamTours[roomId].teamAMembers[p1];
		teamTours[roomId].teamAMembers[p2] = 1;
	}
	if (teamTours[roomId].teamBMembers[p1]) {
		delete teamTours[roomId].teamBMembers[p1];
		teamTours[roomId].teamBMembers[p2] = 1;
	}
	if (toId(teamTours[roomId].matchups[matchupId].from) === toId(p1)) teamTours[roomId].matchups[matchupId].from = p2;
	if (toId(teamTours[roomId].matchups[matchupId].to) === toId(p1)) teamTours[roomId].matchups[matchupId].to = p2;
	return false;
};

exports.endTeamTour = function (room) {
	var roomId = toId(room);
	if (!teamTours[roomId]) return false;
	delete teamTours[roomId];
	return true;
};

exports.viewTourStatus = function (room) {
	var roomId = toId(room);
	if (!teamTours[roomId]) return 'No hay ningún torneo de equipos en esta sala.';
	var rawStatus = '';
	if (teamTours[roomId].tourRound === 0) {
		switch (teamTours[roomId].type) {
			case 'standard':
				rawStatus = '<hr /><h2><font color="green"> Inscribanse al Torneo de Equipos Standard en formato ' + teamTours[roomId].format + ' entre ' + teamTours[roomId].teamA + " y " + teamTours[roomId].teamB +  '.</font></h2> <button name="send" value="/tt join, ' + teamTours[roomId].teamA + '">Jugar con ' + teamTours[roomId].teamA + '</button>&nbsp;<button name="send" value="/tt join, ' + teamTours[roomId].teamB + '">Jugar con ' + teamTours[roomId].teamB + '</button><br /><b><font color="blueviolet">Jugadores por equipo:</font></b> ' + teamTours[roomId].size + '<br /><font color="blue"><b>FORMATO:</b></font> ' + teamTours[roomId].format + '<hr /><br /><font color="red"><b>Recuerda que debes mantener tu nombre durante toda la duración del torneo.</b></font>';
				break;
			case 'total':
				rawStatus = '<hr /><h2><font color="green"> Inscribanse al Torneo de Equipos Total en formato ' + teamTours[roomId].format + ' entre ' + teamTours[roomId].teamA + " y " + teamTours[roomId].teamB +  '.</font></h2> <button name="send" value="/tt join, ' + teamTours[roomId].teamA + '">Jugar con ' + teamTours[roomId].teamA + '</button>&nbsp;<button name="send" value="/tt join, ' + teamTours[roomId].teamB + '">Jugar con ' + teamTours[roomId].teamB + '</button><br /><b><font color="blueviolet">Jugadores por equipo:</font></b> ' + teamTours[roomId].size + '<br /><font color="blue"><b>FORMATO:</b></font> ' + teamTours[roomId].format + '<hr /><br /><font color="red"><b>Recuerda que debes mantener tu nombre durante toda la duración del torneo.</b></font>';
				break;
			case 'lineups':
				rawStatus = '<hr /><h2><font color="green">Torneo de Equipos con Alineaciones en formato ' + teamTours[roomId].format + ' entre ' + teamTours[roomId].teamA + " y " + teamTours[roomId].teamB +  '.</font></h2><b><font color="orange">Capitanes de equipo: </font>' + teamTours[roomId].authA + ' y ' + teamTours[roomId].authB + '</font></b> <br /><b><font color="blueviolet">Jugadores por equipo:</font></b> ' + teamTours[roomId].size + '<br /><font color="blue"><b>FORMATO:</b></font> ' + teamTours[roomId].format + '<hr /><br /><font color="red"><b>Recuerda que debes mantener tu nombre durante toda la duración del torneo. <br />Los capitales deben usar /tt reg, [miembro1], [miembro2]... para registrar las alineaciones.</b></font>';
		}
		return rawStatus;
	} else {
		//round
		var htmlSource = '<hr /><h3><center><font color=green><big>Torneo entre ' + teamTours[roomId].teamA + " y " + teamTours[roomId].teamB + '</big></font></center></h3><center><b>FORMATO:</b> ' + teamTours[roomId].format + "</center><hr /><center><small><font color=red>Red</font> = descalificado, <font color=green>Green</font> = paso a la siguiente ronda, <a class='ilink'><b>URL</b></a> = combatiendo</small></center><br />";
		if (teamTours[roomId].type === 'total') htmlSource = '<hr /><h3><center><font color=green><big>Torneo entre ' + teamTours[roomId].teamA + " y " + teamTours[roomId].teamB + ' (Total)</big></font></center></h3><center><b>FORMATO:</b> ' + teamTours[roomId].format + "</center><hr /><center><small><font color=red>Red</font> = descalificado, <font color=green>Green</font> = paso a la siguiente ronda, <a class='ilink'><b>URL</b></a> = combatiendo</small></center><br />";
		for (var t in teamTours[roomId].byes) {
			var userFreeBye = Users.getExact(t);
			if (!userFreeBye) {userFreeBye = t;} else {userFreeBye = userFreeBye.name;}
			htmlSource += '<center><small><font color=green>' + userFreeBye + ' ha pasado a la siguiente ronda.</font></small></center><br />';
		}
		var matchupsTable = '<table  align="center" border="0" cellpadding="0" cellspacing="0">';
		for (var i in teamTours[roomId].matchups) {
			var userk = Users.getExact(teamTours[roomId].matchups[i].from);
			if (!userk) {userk = teamTours[roomId].matchups[i].from;} else {userk = userk.name;}
			var userf = Users.getExact(teamTours[roomId].matchups[i].to);
			if (!userf) {userf = teamTours[roomId].matchups[i].to;} else {userf = userf.name;}
			switch (teamTours[roomId].matchups[i].result) {
				case 0:
					matchupsTable += '<tr><td  align="right"><big>' + userk + '</big></td><td>&nbsp;vs&nbsp;</td><td><big align="left">' + userf + "</big></td></tr>";
					break;
				case 1:
					matchupsTable += '<tr><td  align="right"><a href="/' + teamTours[roomId].matchups[i].battleLink +'" room ="' + teamTours[roomId].matchups[i].battleLink + '" class="ilink"><b><big>' + userk + '</big></b></a></td><td>&nbsp;<a href="/' +  teamTours[roomId].matchups[i].battleLink + '" room ="' + teamTours[roomId].matchups[i].battleLink + '" class="ilink">vs</a>&nbsp;</td><td><a href="/' + teamTours[roomId].matchups[i].battleLink + '" room ="' + teamTours[roomId].matchups[i].battleLink + '" class="ilink"><b><big align="left">' + userf + "</big></b></a></td></tr>";
					break;
				case 2:
					matchupsTable += '<tr><td  align="right"><font color="green"><b><big>' + userk + '</big></b></font></td><td>&nbsp;vs&nbsp;</td><td><font color="red"><b><big align="left">' + userf + "</big></b></font></td></tr>";
					break;
				case 3:
					matchupsTable += '<tr><td  align="right"><font color="red"><b><big>' + userk + '</big></b></font></td><td>&nbsp;vs&nbsp;</td><td><font color="green"><b><big align="left">' + userf + "</big></b></font></td></tr>";
					break;
			}
		}
		matchupsTable += '</table><hr />';
		htmlSource += matchupsTable;
		return htmlSource;
	}
	
};

/*********************************************************
 * Commands
 *********************************************************/
var cmds = {
	cwar: 'teamtour',
	customwar: 'teamtour',
	tt: 'teamtour',
	teamtour: function(target, room, user, connection) {
		var roomId = room.id;
		var params;
		if (!target) {
			params = ['round'];
		} else {
			params = target.split(',');
		}
		switch (toId(params[0])) {
			case 'buscar':
			case 'search':
				if (!this.canBroadcast()) return false;
				this.sendReplyBox(teamTour.getTours());
				break;
			case 'help':
				if (!this.canBroadcast()) return false;
				this.sendReplyBox(
					'<font size = 2>Torneos de Equipos</font><br />' +
					'Se trata de un sistema de Torneos en el que un equipo se enfrenta contra otro, al estilo de las guerras de clanes. Este sistema está disponible para todas las salas y es moderable por los rangos %, @, #, & y ~.<br />' +
					'Los comandos están compactados en /teamtour o /tt y son los siguientes:<br />' +
					'<ul><li>/teamtour new, [standard/total/lineups], [tier/multitier], [tamaño], [equipoA], [equipoB] - Crea un torneo de equipos.</li>' +
					'<li>/teamtour end - finaliza un torneo de equipos.</li>' +
					'<li>/teamtour join, [equipo] - Comando para unirse al torneo de equipos.</li>' +
					'<li>/teamtour leave - Comando para salir del torneo.</li>' +
					'<li>/teamtour o /tt - Muestra el estado del torneo de equipos.</li>' +
					'<li>/teamtour dq, [usuario] - Comando para descalificar.</li>' +
					'<li>/teamtour replace, [usuario1], [usuario2] - Comando para reemplazar.</li>' +
					'<li>/teamtour invalidate, [participante] - Comando para invalidar una batalla o un resultado.</li>' +
					'<li>/teamtour size, [Jugadores por team] - Cambia el tamaño del torneo.</li>' +
					'<li>/teamtour auth, [Capitan1], [Capitan2] - Establece los capitanes de los equipos en un torneo por alineaciones.</li>' +
					'<li>/teamtour reg, [P1], [P2]... - Comando para registrar alineaciones, solo usable por los capitanes.</li>' +
					'<li>/teamtour start - Inicia un torneo una vez registradas las alineaciones.</li>' +
					'<li>/teamtour search - Muestra los torneos de Equipos abiertos en el servidor.</li>' +
					'</ul>');
				break;
			case 'nuevo':
			case 'new':
			case 'create':
				if (params.length < 6) return this.sendReply("Usage: /teamtour new, [standard/total/lineups], [tier/multitier], [tamaño], [equipoA], [equipoB]");
				if (!this.can('tournaments', room)) return false;
				if (teamTour.getTourData(roomId)) return this.sendReply("Ya había un torneo de equipos en esta sala.");
				if (War.getTourData(roomId)) return this.sendReply("Ya había una guerra en esta sala.");
				if (tour[roomId] && tour[roomId].status != 0) return this.sendReply('Ya hay un torneo en curso.');
				var size = parseInt(params[3]);
				if (size < 2) return this.sendReply("Mínimo deben ser 3 jugadores por equipo.");
				var format = teamTour.tourTiers[toId(params[2])];
				if (!format) return this.sendReply("Formato no válido.");
				switch (toId(params[1])) {
					case 'standard':
						teamTour.newTeamTour(room.id, 'standard', format, size, Tools.escapeHTML(params[4]), Tools.escapeHTML(params[5]));
						this.logModCommand(user.name + " ha iniciado torneo standard entre los equipos " + toId(params[4]) + " y " + toId(params[5]) + " en formato " + format + ".");
						Rooms.rooms[room.id].addRaw('<hr /><h2><font color="green">' + user.name + ' ha iniciado un Torneo de Equipos Standard en formato ' + format + ' entre ' + Tools.escapeHTML(params[4]) + " y " + Tools.escapeHTML(params[5]) +  '.</font></h2> <button name="send" value="/tt join, ' + Tools.escapeHTML(params[4]) + '">Jugar con ' + Tools.escapeHTML(params[4]) + '</button>&nbsp;<button name="send" value="/tt join, ' + Tools.escapeHTML(params[5]) + '">Jugar con ' + Tools.escapeHTML(params[5]) + '</button><br /><b><font color="blueviolet">Jugadores por equipo:</font></b> ' + size + '<br /><font color="blue"><b>FORMATO:</b></font> ' + format + '<hr /><br /><font color="red"><b>Recuerda que debes mantener tu nombre durante toda la duración del torneo.</b></font>');
						break;
					case 'total':
						teamTour.newTeamTour(room.id, 'total', format, size, Tools.escapeHTML(params[4]), Tools.escapeHTML(params[5]));
						this.logModCommand(user.name + " ha iniciado torneo total entre los equipos " + toId(params[4]) + " y " + toId(params[5]) + " en formato " + format + ".");
						Rooms.rooms[room.id].addRaw('<hr /><h2><font color="green">' + user.name + ' ha iniciado un Torneo de Equipos Total en formato ' + format + ' entre ' + Tools.escapeHTML(params[4]) + " y " + Tools.escapeHTML(params[5]) +  '.</font></h2> <button name="send" value="/tt join, ' + Tools.escapeHTML(params[4]) + '">Jugar con ' + Tools.escapeHTML(params[4]) + '</button>&nbsp;<button name="send" value="/tt join, ' + Tools.escapeHTML(params[5]) + '">Jugar con ' + Tools.escapeHTML(params[5]) + '</button><br /><b><font color="blueviolet">Jugadores por equipo:</font></b> ' + size + '<br /><font color="blue"><b>FORMATO:</b></font> ' + format + '<hr /><br /><font color="red"><b>Recuerda que debes mantener tu nombre durante toda la duración del torneo.</b></font>');
						break;
					case 'lineups':
						if (params.length < 8) return this.sendReply("Usage: /teamtour new, lineups, [tier/multitier], [tamano], [equipoA], [equipoB], [capitan1], [capitan2]");
						var userCapA = Users.getExact(params[6]);
						if (!userCapA) return this.sendReply("El usuario " + Tools.escapeHTML(params[6]) + " no está disponible.");
						var userCapB = Users.getExact(params[7]);
						if (!userCapB) return this.sendReply("El usuario " + Tools.escapeHTML(params[7]) + " no está disponible.");
						teamTour.newTeamTour(room.id, 'lineups', format, size, Tools.escapeHTML(params[4]), Tools.escapeHTML(params[5]), userCapA.name, userCapB.name);
						this.logModCommand(user.name + " ha iniciado torneo con alineaciones entre los equipos " + toId(params[4]) + " y " + toId(params[5]) + " en formato " + format + ".");
						Rooms.rooms[room.id].addRaw('<hr /><h2><font color="green">' + user.name + ' ha iniciado un Torneo de Equipos con Alineaciones en formato ' + format + ' entre ' + Tools.escapeHTML(params[4]) + " y " + Tools.escapeHTML(params[5]) +  '.</font></h2><b><font color="orange">Capitanes de equipo: </font>' + userCapA.name + ' y ' + userCapB.name + '</font></b> <br /><b><font color="blueviolet">Jugadores por equipo:</font></b> ' + size + '<br /><font color="blue"><b>FORMATO:</b></font> ' + format + '<hr /><br /><font color="red"><b>Recuerda que debes mantener tu nombre durante toda la duración del torneo. <br />Los capitales deben usar /tt reg, [miembro1], [miembro2]... para registrar las alineaciones.</b></font>');
						break;
					default:
						return this.sendReply("El tipo de tour debe ser uno de estos: [standard/total/lineups]");
				}
				break;
			case 'end':
			case 'fin':
			case 'delete':
				if (!this.can('tournaments', room)) return false;
				var tourData = teamTour.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ningún torneo de equipos en esta sala");
				this.logModCommand(user.name + " ha cancelado el torneo de equipos entre " + toId(tourData.teamA) + " y " + toId(tourData.teamB) + ".");
				Rooms.rooms[room.id].addRaw('<hr /><center><h2><font color="green">' + user.name + ' ha cancelado el torneo entre ' + tourData.teamA + " y " + tourData.teamB + '.</h2></font></center><hr />');
				teamTour.endTeamTour(roomId);
				break;
			case 'j':
			case 'unirse':
			case 'join':
				if (params.length < 2) return this.sendReply("Usage: /teamtour join, [team]");
				var err = teamTour.joinTeamTour(roomId, user.name, params[1]);
				if (err) return this.sendReply(err);
				var tourData = teamTour.getTourData(roomId);
				var teamJoining = tourData.teamA.trim();
				if (toId(params[1]) === toId(tourData.teamB)) teamJoining = tourData.teamB.trim();
				var freePlaces =  teamTour.getFreePlaces(roomId); 
				if (freePlaces > 0) {
					Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> se ha unido al torneo por equipos (' + teamJoining + '). Quedan ' + freePlaces + ' plazas.');
				} else {
					Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> se ha unido al torneo por equipos (' + teamJoining + '). Comienza el Torneo!');
					teamTour.startTeamTour(roomId);
					Rooms.rooms[room.id].addRaw(teamTour.viewTourStatus(roomId));
				}
				break;
			case 'l':
			case 'salir':
			case 'leave':
				var err = teamTour.leaveTeamTour(roomId, user.name);
				if (err) return this.sendReply(err);
				var freePlaces =  teamTour.getFreePlaces(roomId);
				Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> ha salido del torneo por equipos. Quedan ' + freePlaces + ' plazas.');
				break;
			case 'auth':
				if (!this.can('tournamentsmoderation', room)) return false;
				if (params.length < 3) return this.sendReply("Usage: /teamtour auth, [Capitan1], [Capitan2]");
				var userCapA = Users.getExact(params[1]);
				if (!userCapA) return this.sendReply("El usuario " + Tools.escapeHTML(params[6]) + " no está disponible.");
				var userCapB = Users.getExact(params[2]);
				if (!userCapB) return this.sendReply("El usuario " + Tools.escapeHTML(params[7]) + " no está disponible.");
				var err = teamTour.setAuth(roomId, params[1], params[2]);
				if (err) return this.sendReply(err);
				this.privateModCommand('(' + user.name + ' ha cambiado los Capitanes del torneo de Equipos.)');
				break;
			case 'lineup':
			case 'alineacion':
			case 'registrar':
			case 'reg':
				var tourData = teamTour.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ningún torneo de equipos en esta sala");
				if (toId(user.name) !== toId(tourData.authA) && toId(user.name) !== toId(tourData.authB)) return this.sendReply("Debes ser Capitan de uno de los dos equipos para hacer esto.");
				var err = teamTour.regParticipants(roomId, user.name, target);
				if (err) return this.sendReply(err);
				if (toId(user.name) === toId(tourData.authA)) Rooms.rooms[room.id].addRaw(user.name + ' ha registrado la alinación para ' + tourData.teamA + '.');
				if (toId(user.name) === toId(tourData.authB)) Rooms.rooms[room.id].addRaw(user.name + ' ha registrado la alinación para ' + tourData.teamB + '.');
				break;
			case 'empezar':
			case 'begin':
			case 'start':
				if (!this.can('tournaments', room)) return false;
				var tourData = teamTour.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ningún torneo de equipos en esta sala.");
				if (tourData.tourRound !== 0) return this.sendReply("El torneo ya había empezado.");

				var freePlaces =  teamTour.getFreePlaces(roomId);
				if (freePlaces > 0) return this.sendReply("Aún quedan plazas libres.");
				teamTour.startTeamTour(roomId);
				Rooms.rooms[room.id].addRaw(teamTour.viewTourStatus(roomId));
				break;
			case 'size':
				if (!this.can('tournamentsmoderation', room)) return false;
				if (params.length < 2) return this.sendReply("Usage: /teamtour size, [size]");
				var err = teamTour.sizeTeamTour(roomId, params[1]);
				if (err) return this.sendReply(err);
				var freePlaces =  teamTour.getFreePlaces(roomId);
				if (freePlaces > 0) {
					Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> ha cambiado el tama&ntilde;o del torneo a ' + parseInt(params[1]) + '. Quedan ' + freePlaces + ' plazas.');
				} else {
					Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> ha cambiado el tama&ntilde;o del torneo a ' + parseInt(params[1]) + '. Comienza el Torneo!');
					teamTour.startTeamTour(roomId);
					Rooms.rooms[room.id].addRaw(teamTour.viewTourStatus(roomId));
				}
				break;
			case 'disqualify':
			case 'dq':
				if (!this.can('tournamentsmoderation', room)) return false;
				if (params.length < 2) return this.sendReply("Usage: /teamtour dq, [user]");
				var tourData = teamTour.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ningún torneo de equipos en esta sala");
				if (!teamTour.dqTeamTour(roomId, params[1], 'cmd')) return this.sendReply("No se pudo descalificar al usuario.");
				var userk = Users.getExact(params[1]);
				if (userk) userk = userk.name; else userk = toId(params[1]);
				this.addModCommand(userk + ' fue descalificado del torneo de equipos por ' + user.name + '.');
				if (teamTour.isRoundEnded(roomId)) {
					teamTour.autoEnd(roomId);
				}
				break;
			case 'replace':
				if (!this.can('tournamentsmoderation', room)) return false;
				if (params.length < 3) return this.sendReply("Usage: /teamtour replace, [userA], [userB]");
				var usera = Users.getExact(params[1]);
				if (usera) usera = usera.name; else usera = toId(params[1]);
				var userb = Users.getExact(params[2]);
				if (userb) {
					userb = userb.name;
				} else {
					return this.sendReply("El usuario por el que reemplazas debe estár conectado.");
				}
				var err = teamTour.replaceParticipant(roomId, params[1], params[2]);
				if (err) return this.sendReply(err);
				this.addModCommand(user.name + ': ' + usera + ' es reemplazado por ' + userb + ' en el Torneo de equipos.');
				break;
			case 'invalidate':
				if (!this.can('tournamentsmoderation', room)) return false;
				if (params.length < 2) return this.sendReply("Usage: /teamtour invalidate, [user]");
				var tourData = teamTour.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ningún torneo de equipos en esta sala");
				var matchupId = teamTour.findMatchup(roomId, params[1]);
				if (!teamTour.invalidate(roomId, matchupId)) return this.sendReply("No se pudo invalidar el resultado. Puede que aún no se haya establecido ningún resultado.");
				this.addModCommand('La batalla entre ' + tourData.matchups[matchupId].from + ' y ' + tourData.matchups[matchupId].to + ' fue invalidada por ' + user.name + '.');
				break;
			case 'hotpatch':
				if (!this.can('hotpatch')) return false;
				CommandParser.uncacheTree('./teamtour.js');
				teamTour = require('./teamtour.js');
				return this.sendReply('Team tours hotpatched.');
			case 'ronda':
			case 'round':
				if (!this.canBroadcast()) return false;
				return this.sendReply('|raw|' + teamTour.viewTourStatus(roomId));
			default:
				this.sendReply('No se reconoce el comando. Quizás te pueda ayuadar /teamtour help.');
		}
	},
};

for (var i in cmds) CommandParser.commands[i] = cmds[i];

/*********************************************************
 * Events
 *********************************************************/
 
if (!Rooms.global.__startBattle) Rooms.global.__startBattle = Rooms.global.startBattle;
Rooms.global.startBattle = function(p1, p2, format, rated, p1team, p2team) {
	var newRoom = this.__startBattle(p1, p2, format, rated, p1team, p2team);
	if (!newRoom) return;
	var formaturlid = format.toLowerCase().replace(/[^a-z0-9]+/g, '');
	//tour
	var matchup = teamTour.findTourFromMatchup(p1.name, p2.name, format, newRoom.id);
	if (matchup) {
			newRoom.teamTour = 1;
			teamTour.setActiveMatchup(matchup.tourId, matchup.matchupId, newRoom.id);
			Rooms.rooms[matchup.tourId].addRaw("<a href=\"/" + newRoom.id + "\" class=\"ilink\"><b>La batalla de torneo entre " + p1.name + " y " + p2.name + " ha comenzado.</b></a>");
			Rooms.rooms[matchup.tourId].update();
	}
	//end tour

	return newRoom;
};

if (!Rooms.BattleRoom.prototype.__win) Rooms.BattleRoom.prototype.__win = Rooms.BattleRoom.prototype.win;
Rooms.BattleRoom.prototype.win = function(winner) {
	//tour
	if (this.teamTour) {
		var matchup = teamTour.findTourFromMatchup(this.p1.name, this.p2.name, this.format, this.id);
		if (matchup) {
			var losser = false;
			if (toId(this.p1.name) === toId(winner)) losser = this.p2.name;
			if (toId(this.p2.name) === toId(winner)) losser = this.p1.name;
			
			if (!losser) {
				//tie
				Rooms.rooms[matchup.tourId].addRaw('La batalla entre <b>' + this.p1.name + '</b> y ' + this.p2.name + '</b> ha terminado en empate. Inicien otra batalla.');
				teamTour.invalidate(matchup.tourId, matchup.matchupId);
			} else {
				Rooms.rooms[matchup.tourId].addRaw('<b>' + winner + '</b> ha ganado su batalla contra ' + losser + '.</b>');
				teamTour.dqTeamTour(matchup.tourId, losser);
			}
			Rooms.rooms[matchup.tourId].update();
		}
	}
	//end tour
	this.__win(winner);
};
