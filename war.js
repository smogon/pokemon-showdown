/*********************************************************
 * Functions
 *********************************************************/
 
var wars = {};
exports.wars = wars;
var tourTiers = {};
tourTiers['multitier'] = "Multi-Tier";
for (var i in Tools.data.Formats) {
	if (Tools.data.Formats[i].effectType == 'Format' && Tools.data.Formats[i].challengeShow) {
		tourTiers[toId(i)] = Tools.data.Formats[i].name;
	}
}
exports.tourTiers = tourTiers;

exports.getTours = function () {
	if (!wars)
		return 'No hay ninguna guerra en curso.';
	var tourList = '';
	for (var w in wars) {
		if (wars[w].tourRound === 0) {
			tourList += '<a class="ilink" href="/' + w + '"> Guerra de formato ' + wars[w].format + ' entre  ' + wars[w].teamA + ' y ' + wars[w].teamB + ' en la sala ' + w + '</a> <br />';
		} else {
			tourList += '<a class="ilink" href="/' + w + '"> Guerra de formato ' + wars[w].format + ' entre  ' + wars[w].teamA + ' y ' + wars[w].teamB + ' en la sala ' + w + ' (Iniciada)</a> <br />';
		}
	}
	if (!tourList || tourList === '')
		return 'No hay ninguna guerra en curso.';
	return tourList;
};

exports.findTourFromMatchup = function (p1, p2, format, battleLink) {
	p1 = toId(p1);
	p2 = toId(p2);
	for (var i in wars) {
		if (wars[i].tourRound === 0) continue;
		if (toId(wars[i].format) !== toId(format) && toId(wars[i].format) !== 'multitier') continue;
		for (var j in wars[i].matchups) {
			if (wars[i].matchups[j].result === 1 && battleLink !== wars[i].matchups[j].battleLink) continue;
			if (wars[i].matchups[j].result > 1) continue;
			if (toId(wars[i].matchups[j].from) === p1 && toId(wars[i].matchups[j].to) === p2) return {tourId: i, matchupId: j};
			if (toId(wars[i].matchups[j].from) === p2 && toId(wars[i].matchups[j].to) === p1) return {tourId: i, matchupId: j};
		}
	}
	return false;
};

exports.findMatchup = function (room, user) {
	var roomId = toId(room);
	var userId = toId(user);
	if (!wars[roomId]) return false;
	for (var i in wars[roomId].matchups) {
		if (userId === toId(wars[roomId].matchups[i].from) || userId === toId(wars[roomId].matchups[i].to)) {
			return i;
		}
	}
	return false;
};

exports.findClan = function (clan) {
	var clanId = toId(clan);
	if (!wars) return false;
	for (var i in wars) {
		if (toId(wars[i].teamA) === clanId || toId(wars[i].teamB) === clanId) return i;
	}
	return false;
};

exports.getTourData = function (room) {
	var roomId = toId(room);
	if (!wars[roomId]) return false;
	var data = {
		teamA: wars[roomId].teamA,
		teamB: wars[roomId].teamB,
		authA: wars[roomId].authA,
		authB: wars[roomId].authB,
		matchups: wars[roomId].matchups,
		byes: wars[roomId].byes,
		teamWithByes: wars[roomId].teamWithByes,
		teamAMembers: wars[roomId].teamAMembers,
		teamBMembers: wars[roomId].teamBMembers,
		format: wars[roomId].format,
		size: wars[roomId].size,
		type: wars[roomId].type,
		tourRound: wars[roomId].tourRound,
	};
	return data;
};

exports.getFreePlaces = function (room) {
	var roomId = toId(room);
	if (!wars[roomId])
		return 0;
	var membersA = wars[roomId].size;
	var membersB = wars[roomId].size;
	var registeredA = Object.keys(wars[roomId].teamAMembers);
	var registeredB = Object.keys(wars[roomId].teamBMembers);
	if (registeredA) {
		membersA = wars[roomId].size - registeredA.length;
	}
	if (registeredB) {
		membersB = wars[roomId].size - registeredB.length;
	}
	return membersA + membersB;
};

exports.getAvailableMembers = function (avaliableMembers) {
	if (!avaliableMembers) return false;
	return Object.keys(avaliableMembers);
};

exports.newTeamTour = function (room, type, format, size, teamA, teamB, authA, authB) {
	var roomId = toId(room);
	wars[roomId] = {
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
	var playersA = wars[roomId].teamAMembers;
	var playersB = wars[roomId].teamBMembers;
	if (wars[roomId].teamAMembers[userId] || wars[roomId].teamBMembers[userId]) return false;
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
	if (!wars[roomId]) return 'No había ninguna guerra en esta sala.';
	if (wars[roomId].tourRound !== 0) return 'La guerra ya ha empezado. No te puedes unir.';
	if (wars[roomId].type === 'lineups') return 'Los equipos deben ser registrados por los capitanes de los clanes en esta guerra.';
	if (!exports.joinable(room, user)) return 'Ya estabas inscrito en este torneo. Para jugar por otro equipo primero debes salir.';
	var registeredA = Object.keys(wars[roomId].teamAMembers);
	var registeredB = Object.keys(wars[roomId].teamBMembers);
	if (toId(team) === toId(wars[roomId].teamA) && registeredA.length < wars[roomId].size) {
		wars[roomId].teamAMembers[userId] = 1;
		return false;
	}
	if (toId(team) === toId(wars[roomId].teamB) && registeredB.length < wars[roomId].size) {
		wars[roomId].teamBMembers[userId] = 1;
		return false;
	}
	return 'No quedan plazas para el equipo especificado.';
};

exports.regParticipants = function (room, user, source) {
	var roomId = toId(room);
	var userId = toId(user);
	var params = source.split(',');
	if (!wars[roomId]) return 'No había ninguna guerra en esta sala.';
	if (wars[roomId].tourRound !== 0) return 'La guerra ya ha empezado. No se pueden registrar alieaciones.';
	if (wars[roomId].type !== 'lineups') return 'Esta guerra no es por alineaciones.';
	var lineup = {};
	var oldLineup = {};
	if (params.length < (wars[roomId].size + 1)) return 'Debes especificar la alineación completa.';
	var targetUser;
	var targetClan;
	if (toId(user) === toId(wars[roomId].authA)) {
		oldLineup = wars[roomId].teamBMembers;
		targetClan = toId(wars[roomId].teamA);
	}
	if (toId(user) === toId(wars[roomId].authB)) {
		oldLineup = wars[roomId].teamAMembers;
		targetClan = toId(wars[roomId].teamB);
	}
	for (var n = 0; n < wars[roomId].size; ++n) {
		targetUser = Users.get(params[n + 1]);
		if (!targetUser || !targetUser.connected) return toId(params[n + 1]) + ' no existe o no está disponible. Todos los usuarios de la alineacón deben estarlo.';
		if (oldLineup[toId(targetUser.name)] || lineup[toId(targetUser.name)]) return toId(params[n + 1]) + ' ya estaba en otro equipo o lo has escrito 2 veces.';
		if (!Clans.findClanFromMember(targetUser.name) || toId(Clans.findClanFromMember(targetUser.name)) !== targetClan) return toId(params[n + 1]) + ' no pertenece al clan.';
		lineup[toId(targetUser.name)] = 1;
	}
	if (userId === toId(wars[roomId].authA)) wars[roomId].teamAMembers = lineup;
	if (userId === toId(wars[roomId].authB)) wars[roomId].teamBMembers = lineup;
	return false;
};

exports.sizeTeamTour = function (room, size) {
	var roomId = toId(room);
	size = parseInt(size);
	if (size < 3) return 'El tamaño de la guerra no es válido.';
	if (!wars[roomId]) return 'No había ninguna guerra en esta sala.';
	if (wars[roomId].tourRound !== 0) return 'La guerra ya ha empezado. No se le puede cambiar el tamaño.';
	var registeredA = Object.keys(wars[roomId].teamAMembers);
	var registeredB = Object.keys(wars[roomId].teamBMembers);
	if (registeredA.length <= size && registeredB.length <= size) {
		wars[roomId].size = size;
		return false;
	}
	return 'Se han registrado demasiados usuarios como para cambiar el tamaño de la guerra.';
};

exports.setAuth = function (room, authA, authB) {
	var roomId = toId(room);
	if (!wars[roomId]) return 'No había ninguna guerra en esta sala.';
	if (wars[roomId].type !== 'lineups') return 'Esta guerra no es por alineaciones.';
	wars[roomId].authA = authA;
	wars[roomId].authB = authB;  
	return false;
};

exports.leaveTeamTour = function (room, user) {
	var roomId = toId(room);
	var userId = toId(user);
	if (!wars[roomId]) return 'No había ninguna guerra en esta sala.';
	if (!wars[roomId].teamAMembers[userId] && !wars[roomId].teamBMembers[userId]) return 'No estabas inscrito en la guerra.';
	if (wars[roomId].tourRound !== 0) {
		if (!exports.dqTeamTour(room, user, 'cmd')) return 'Ya habías sido descalificado o pasado a la siguiente ronda';
		Rooms.rooms[roomId].addRaw('<b>' + user + '</b> se ha autodescalificado de la guerra.');
		if (exports.isRoundEnded(roomId)) {
			exports.autoEnd(roomId);
		}
		return 'Has salido de la guerra.';
	} else {
		if (wars[roomId].type === 'lineups') return 'Los equipos deben ser registrados por los capitanes de los clanes en esta guerra.';
		if (wars[roomId].teamAMembers[userId]) delete wars[roomId].teamAMembers[userId];
		if (wars[roomId].teamBMembers[userId]) delete wars[roomId].teamBMembers[userId];
	}
	return false;
};

exports.startTeamTour = function (room) {
	var roomId = toId(room);
	if (!wars[roomId]) return false;
	if (wars[roomId].type === 'lineups') {
		var teamAMembers = exports.getAvailableMembers(wars[roomId].teamAMembers);
		var teamBMembers = exports.getAvailableMembers(wars[roomId].teamBMembers);
	} else {
		var teamAMembers = exports.getAvailableMembers(wars[roomId].teamAMembers).randomize();
		var teamBMembers = exports.getAvailableMembers(wars[roomId].teamBMembers).randomize();
	}
	var memberCount = Math.min(teamAMembers.length, teamBMembers.length);
	var matchups = {};
	for (var m = 0; m < memberCount; ++m) {
		matchups[toId(teamAMembers[m])] = {from: teamAMembers[m], to: teamBMembers[m], battleLink: '', result: 0};
	}
	wars[roomId].matchups = matchups;
	wars[roomId].tourRound = 1;
	return true;
};

exports.newRound = function (room) {
	var roomId = toId(room);
	if (!wars[roomId]) return false;
	var avaliableMembersA = [];
	var avaliableMembersB = [];
	for (var m in wars[roomId].matchups) {
		if (wars[roomId].matchups[m].result === 2) {
			avaliableMembersA.push(toId(wars[roomId].matchups[m].from));
		} else if (wars[roomId].matchups[m].result === 3) {
			avaliableMembersB.push(toId(wars[roomId].matchups[m].to));
		}
	}
	for (var s in wars[roomId].byes) {
		if (toId(wars[roomId].teamWithByes) === toId(wars[roomId].teamA)) {
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
		wars[roomId].teamWithByes = wars[roomId].teamA;
	} else if (avaliableMembersA.length < avaliableMembersB.length) {
		wars[roomId].teamWithByes = wars[roomId].teamB;
	} else {
		wars[roomId].teamWithByes = false;
	}
	for (var m = memberCount; m < totalMemberCount; ++m) {
		if (avaliableMembersA.length > avaliableMembersB.length) byes[toId(avaliableMembersA[m])] = 1;
		if (avaliableMembersA.length < avaliableMembersB.length) byes[toId(avaliableMembersB[m])] = 1;
	}
	wars[roomId].matchups = matchups;
	wars[roomId].byes = byes;
	++wars[roomId].tourRound;
	Rooms.rooms[roomId].addRaw(exports.viewTourStatus(roomId));
	
};

exports.autoEnd = function (room) {
	var roomId = toId(room);
	if (!wars[roomId]) return false;
	var scoreA = 0;
	var scoreB = 0;
	var nMatchups = 0;
	var nByes = 0;
	for (var b in wars[roomId].matchups) {
		++nMatchups;
		if (wars[roomId].matchups[b].result === 2) {
			++scoreA;
		} else if (wars[roomId].matchups[b].result === 3) {
			++scoreB;
		}
	}
	if (wars[roomId].type === 'total') {
		for (var f in wars[roomId].byes) {
			++nByes;
		}
		if (scoreA === 0 || scoreB === 0) {
			if (scoreA === 0) {
				if (toId(wars[roomId].teamWithByes) === toId(wars[roomId].teamA)) {
					exports.newRound(roomId);
					return;
				} 
				scoreB = wars[roomId].size;
				scoreA = wars[roomId].size - nMatchups - nByes;
			} else if (scoreB === 0) {
				if (toId(wars[roomId].teamWithByes) === toId(wars[roomId].teamB)) {
					exports.newRound(roomId);
					return;
				}
				scoreA = wars[roomId].size;
				scoreB = wars[roomId].size - nMatchups - nByes;
			}
		} else {
			exports.newRound(roomId);
			return;
		}
	}
	if (scoreA === scoreB && wars[roomId].type === 'lineups') {
		var matchups = {};
		matchups[toId(wars[roomId].authA)] = {from: wars[roomId].authA, to: wars[roomId].authB, battleLink: '', result: 0};
		wars[roomId].matchups = matchups;
		wars[roomId].teamAMembers = {};
		wars[roomId].teamAMembers[toId(wars[roomId].authA)] = 1;
		wars[roomId].teamBMembers = {};
		wars[roomId].teamBMembers[toId(wars[roomId].authB)] = 1;
		++wars[roomId].tourRound;
		Rooms.rooms[roomId].addRaw(exports.viewTourStatus(roomId));
		return;
	}
	//raw of end
	var htmlEndTour = '';
	if (scoreA > scoreB) {
		htmlEndTour = '<br><hr /><h2><font color="green"><center>&iexcl;Felicidades <font color="black">' + wars[roomId].teamA + '</font>!</center></font></h2><h2><font color="green"><center>&iexcl;Has ganado la guerra en formato ' + wars[roomId].format + ' contra <font color="black">' + wars[roomId].teamB + "</font>!</center></font></h2><hr />";
	} else if (scoreA < scoreB) {
		htmlEndTour = '<br><hr /><h2><font color="green"><center>&iexcl;Felicidades <font color="black">' + wars[roomId].teamB + '</font>!</center></font></h2><h2><font color="green"><center>&iexcl;Has ganado la guerra en formato ' + wars[roomId].format + ' contra <font color="black">' + wars[roomId].teamA + "</font>!</center></font></h2><hr />";
	} else if (scoreA === scoreB) {
		htmlEndTour = '<br><hr /><h2><font color="green"><center>&iexcl;La guerra de formato ' + wars[roomId].format + ' entre <font color="black">' + wars[roomId].teamA + '</font> y <font color="black">' + wars[roomId].teamB + '</font> ha terminado en Empate!</center></font></h2><hr />';
	}
	Rooms.rooms[roomId].addRaw(exports.viewTourStatus(roomId)+ htmlEndTour);
	var addpoints = Clans.setWarResult(wars[roomId].teamA, wars[roomId].teamB, scoreA, scoreB);
	Clans.logWarData(wars[roomId].teamA, wars[roomId].teamB, scoreA, scoreB, wars[roomId].type, wars[roomId].format, addpoints['A'], wars[roomId].tourRound);
	Clans.logWarData(wars[roomId].teamB, wars[roomId].teamA, scoreB, scoreA, wars[roomId].type, wars[roomId].format, addpoints['B'], wars[roomId].tourRound);
	exports.endTeamTour(roomId);
};

exports.isRoundEnded = function (room) {
	var roomId = toId(room);
	if (!wars[roomId]) return false;

	for (var m in wars[roomId].matchups)
		if (wars[roomId].matchups[m].result < 2)
			return false;
	return true;
};

exports.setActiveMatchup = function (room, matchup, battlelink) {
	var roomId = toId(room);
	var matchupId = toId(matchup);
	if (!wars[roomId] || !wars[roomId].matchups[matchupId]) return false;
	wars[roomId].matchups[matchupId].result = 1;
	wars[roomId].matchups[matchupId].battleLink = battlelink;
	return true;
};

exports.dqTeamTour = function (room, user, forced) {
	var roomId = toId(room);
	var userId = toId(user);
	if (!wars[roomId]) return false;
	for (var i in wars[roomId].matchups) {
		if (userId === toId(wars[roomId].matchups[i].from) || userId === toId(wars[roomId].matchups[i].to)) {
			if (wars[roomId].matchups[i].result < 2) {
				if (userId === toId(wars[roomId].matchups[i].from)) wars[roomId].matchups[i].result = 3; 
				if (userId === toId(wars[roomId].matchups[i].to)) wars[roomId].matchups[i].result = 2;
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
	if (!wars[roomId] || !wars[roomId].matchups[matchupId]) return false;
	wars[roomId].matchups[matchupId].result = 0;
	wars[roomId].matchups[matchupId].battleLink = '';
	return true;
};

exports.replaceParticipant = function (room, p1, p2) {
	var roomId = toId(room);
	if (!wars[roomId]) return 'No había ninguna guerra en esta sala.';
	if (!wars[roomId].tourRound === 0) return 'La guerra no habia empezado';
	var matchupId = exports.findMatchup(room, p1);
	if (!matchupId) return 'El usuario no participaba en nungún combate de esta guerra.';
	if (wars[roomId].matchups[matchupId].result > 0) return 'No se puede reemplazar si el combate ya ha empezado.';
	if (wars[roomId].teamAMembers[p1]) {
		delete wars[roomId].teamAMembers[p1];
		wars[roomId].teamAMembers[p2] = 1;
	}
	if (wars[roomId].teamBMembers[p1]) {
		delete wars[roomId].teamBMembers[p1];
		wars[roomId].teamBMembers[p2] = 1;
	}
	if (toId(wars[roomId].matchups[matchupId].from) === toId(p1)) wars[roomId].matchups[matchupId].from = p2;
	else if (toId(wars[roomId].matchups[matchupId].to) === toId(p1)) wars[roomId].matchups[matchupId].to = p2;
	return false;
};

exports.endTeamTour = function (room) {
	var roomId = toId(room);
	if (!wars[roomId]) return false;
	delete wars[roomId];
	return true;
};

exports.viewTourStatus = function (room) {
	var roomId = toId(room);
	if (!wars[roomId]) return 'No había ninguna guerra en esta sala.';
	var rawStatus = '';
	if (wars[roomId].tourRound === 0) {
		switch (wars[roomId].type) {
			case 'standard':
				rawStatus = '<hr /><h2><font color="green"> Inscribanse a la guerra en formato ' + wars[roomId].format + ' entre ' + wars[roomId].teamA + " y " + wars[roomId].teamB +  '.</font></h2><b>Para unirse a la war: <button name="send" value="/war join">/war join</button></b><br /><b><font color="blueviolet">Jugadores por clan:</font></b> ' + wars[roomId].size + '<br /><font color="blue"><b>FORMATO:</b></font> ' + wars[roomId].format + '<hr /><br /><font color="red"><b>Recuerda que debes mantener tu nombre durante toda la duración de la guerra.</b></font>';
				break;
			case 'total':
				rawStatus = '<hr /><h2><font color="green"> Inscribanse a la guerra total en formato ' + wars[roomId].format + ' entre ' + wars[roomId].teamA + " y " + wars[roomId].teamB +  '.</font></h2><b>Para unirse a la war: <button name="send" value="/war join">/war join</button></b><br /><b><font color="blueviolet">Jugadores por clan:</font></b> ' + wars[roomId].size + '<br /><font color="blue"><b>FORMATO:</b></font> ' + wars[roomId].format + '<hr /><br /><font color="red"><b>Recuerda que debes mantener tu nombre durante toda la duración de la guerra.</b></font>';
				break;
			case 'lineups':
				rawStatus = '<hr /><h2><font color="green"> Guerra en formato ' + wars[roomId].format + ' entre ' + wars[roomId].teamA + " y " + wars[roomId].teamB +  '.</font></h2><b><font color="orange">Capitanes de equipo: </font>' + wars[roomId].authA + ' y ' + wars[roomId].authB + '</font></b> <br /><b><font color="blueviolet">Jugadores por equipo:</font></b> ' + wars[roomId].size + '<br /><font color="blue"><b>FORMATO:</b></font> ' + wars[roomId].format + '<hr /><br /><b><font color="red">Recuerda que debes mantener tu nombre durante toda la duración de la guerra.</font> <br />Los capitales deben usar /war reg, [miembro1], [miembro2]... para registrar las alineaciones.</b>';
		}
		return rawStatus;
	} else {
		//round
		var htmlSource = '<hr /><h3><center><font color=green><big>Guerra entre ' + wars[roomId].teamA + " y " + wars[roomId].teamB + '</big></font></center></h3><center><b>FORMATO:</b> ' + wars[roomId].format + "</center><hr /><center><small><font color=red>Red</font> = descalificado, <font color=green>Green</font> = paso a la siguiente ronda, <a class='ilink'><b>URL</b></a> = combatiendo</small></center><br />";
		if (wars[roomId].type === 'total') htmlSource = '<hr /><h3><center><font color=green><big>Guerra entre ' + wars[roomId].teamA + " y " + wars[roomId].teamB + ' (Total)</big></font></center></h3><center><b>FORMATO:</b> ' + wars[roomId].format + "</center><hr /><center><small><font color=red>Red</font> = descalificado, <font color=green>Green</font> = paso a la siguiente ronda, <a class='ilink'><b>URL</b></a> = combatiendo</small></center><br />";
		for (var t in wars[roomId].byes) {
			var userFreeBye = Users.getExact(t);
			if (!userFreeBye) {userFreeBye = t;} else {userFreeBye = userFreeBye.name;}
			htmlSource += '<center><small><font color=green>' + userFreeBye + ' ha pasado a la siguiente ronda.</font></small></center>';
		}
		var matchupsTable = '<br /><table  align="center" border="0" cellpadding="0" cellspacing="0"><tr><td align="right"><img width="100" height="100" src="' + encodeURI(Clans.getProfile(wars[roomId].teamA).logo) + '" />&nbsp;&nbsp;&nbsp;&nbsp;</td><td align="center"><table  align="center" border="0" cellpadding="0" cellspacing="0">';
		for (var i in wars[roomId].matchups) {
			var userk = Users.getExact(wars[roomId].matchups[i].from);
			if (!userk) {userk = wars[roomId].matchups[i].from;} else {userk = userk.name;}
			var userf = Users.getExact(wars[roomId].matchups[i].to);
			if (!userf) {userf = wars[roomId].matchups[i].to;} else {userf = userf.name;}
			switch (wars[roomId].matchups[i].result) {
				case 0:
					matchupsTable += '<tr><td  align="right"><big>' + userk + '</big></td><td>&nbsp;vs&nbsp;</td><td><big align="left">' + userf + "</big></td></tr>";
					break;
				case 1:
					matchupsTable += '<tr><td  align="right"><a href="/' + wars[roomId].matchups[i].battleLink +'" room ="' + wars[roomId].matchups[i].battleLink + '" class="ilink"><b><big>' + userk + '</big></b></a></td><td>&nbsp;<a href="/' +  wars[roomId].matchups[i].battleLink + '" room ="' + wars[roomId].matchups[i].battleLink + '" class="ilink">vs</a>&nbsp;</td><td><a href="/' + wars[roomId].matchups[i].battleLink + '" room ="' + wars[roomId].matchups[i].battleLink + '" class="ilink"><b><big align="left">' + userf + "</big></b></a></td></tr>";
					break;
				case 2:
					matchupsTable += '<tr><td  align="right"><font color="green"><b><big>' + userk + '</big></b></font></td><td>&nbsp;vs&nbsp;</td><td><font color="red"><b><big align="left">' + userf + "</big></b></font></td></tr>";
					break;
				case 3:
					matchupsTable += '<tr><td  align="right"><font color="red"><b><big>' + userk + '</big></b></font></td><td>&nbsp;vs&nbsp;</td><td><font color="green"><b><big align="left">' + userf + "</big></b></font></td></tr>";
					break;
			}
		}
		matchupsTable += '</table></td><td>&nbsp;&nbsp;&nbsp;&nbsp;<img width="100" height="100" src="' + encodeURI(Clans.getProfile(wars[roomId].teamB).logo) + '" /></td></tr></table><hr />';
		htmlSource += matchupsTable;
		return htmlSource;
	}
	
};

/*********************************************************
 * Commands
 *********************************************************/
var cmds = {
	
	guerra: 'war',
	war: function(target, room, user, connection) {
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
				this.sendReplyBox(War.getTours());
				break;
			case 'help':
				if (!this.canBroadcast()) return false;
				this.sendReplyBox(
					'<font size = 2>Guerras entre clanes</font><br />' +
					'Se trata de un sistema automatizado de guerras (enfrentamientos) entre 2 clanes dentro de un sistema de puntuación o ranking. Las wars solo pueden ser iniciadas en las salas destinadas a ello. Los Voiced pueden crearlas y terminarlas y el staff puede manejar el resto de comandos administrativos. Asi mismo, los oficiales y líderes de los clanes pueden descalificar y reemplazar a sus miembros.<br />' +
					'Los comandos están compactados en /war y son los siguientes:<br />' +
					'<ul><li>/war new, [standard/total], [tier/multitier], [tamaño], [clanA], [clanB] - Crea una guerra.</li>' +
					'<li>/war new, [lineups], [tier/multitier], [tamaño], [clanA], [clanB], [capitanA], [capitanB] - Crea una guerra con alinaciones fijas.</li>' +
					'<li>/war end - finaliza una guerra en curso.</li>' +
					'<li>/war join - Comando para unirse.</li>' +
					'<li>/war leave - Comando para salir.</li>' +
					'<li>/war - Muestra el estado de la guerra.</li>' +
					'<li>/war dq, [usuario] - Comando para descalificar.</li>' +
					'<li>/war replace, [usuario1], [usuario2] - Comando para reemplazar.</li>' +
					'<li>/war invalidate, [participante] - Comando para invalidar una batalla o un resultado.</li>' +
					'<li>/war size, [Jugadores por team] - Cambia el tamaño de la guerra.</li>' +
					'<li>/war auth, [Capitan1], [Capitan2] - Establece los capitanes de los clanes.</li>' +
					'<li>/war reg, [P1], [P2]... - Comando para registrar alineaciones, solo usable por los capitanes.</li>' +
					'<li>/war start - Inicia una guerra una vez registradas las alineaciones.</li>' +
					'<li>/war search - Muestra las guerras en curso del servidor.</li>' +
					'</ul>');
				break;
			case 'nuevo':
			case 'new':
			case 'create':
				if (params.length < 6) return this.sendReply("Usage: /war new, [standard/total/lineups], [tier/multitier], [tamaño], [clanA], [clanB]");
				if (!this.can('joinbattle', room)) return false;
				if (!room.isOfficial) return this.sendReply("Este comando solo puede ser usado en salas Oficiales.");
				if (War.getTourData(roomId)) return this.sendReply("Ya había una guerra en esta sala.");
				if (tour[roomId] && tour[roomId].status != 0) return this.sendReply('Ya hay un torneo en  esta sala.');
				if (teamTour.getTourData(roomId)) return this.sendReply("Ya había un torneo de equipos en esta sala.");
				var size = parseInt(params[3]);
				if (size < 3) return this.sendReply("Mínimo deben ser 3 jugadores por clan.");
				var format = War.tourTiers[toId(params[2])];
				if (!format) return this.sendReply("Formato no válido.");
				if (!Clans.getProfile(params[4]) || !Clans.getProfile(params[5])) return this.sendReply("Alguno de los clanes no existía.");
				if (War.findClan(params[4]) || War.findClan(params[5])) return this.sendReply("Alguno de los clanes ya estaba en guerra.");
				params[4] = Clans.getClanName(params[4]);
				params[5] = Clans.getClanName(params[5]);
				switch (toId(params[1])) {
					case 'standard':
						War.newTeamTour(room.id, 'standard', format, size, Tools.escapeHTML(params[4]), Tools.escapeHTML(params[5]));
						this.logModCommand(user.name + " ha iniciado una guerra standard entre los clanes " + toId(params[4]) + " y " + toId(params[5]) + " en formato " + format + ".");
						Rooms.rooms[room.id].addRaw('<hr /><h2><font color="green">' + user.name + ' ha iniciado una guerra standard en formato ' + format + ' entre ' + Tools.escapeHTML(params[4]) + " y " + Tools.escapeHTML(params[5]) +  '.</font></h2><b>Para unirse a la war: <button name="send" value="/war join">/war join</button></b><br /><b><font color="blueviolet">Jugadores por equipo:</font></b> ' + size + '<br /><font color="blue"><b>FORMATO:</b></font> ' + format + '<hr /><br /><font color="red"><b>Recuerda que debes mantener tu nombre durante toda la duración de la guerra.</b></font>');
						break;
					case 'total':
						War.newTeamTour(room.id, 'total', format, size, Tools.escapeHTML(params[4]), Tools.escapeHTML(params[5]));
						this.logModCommand(user.name + " ha iniciado una guerra total entre los clanes " + toId(params[4]) + " y " + toId(params[5]) + " en formato " + format + ".");
						Rooms.rooms[room.id].addRaw('<hr /><h2><font color="green">' + user.name + ' ha iniciado una guerra total en formato ' + format + ' entre ' + Tools.escapeHTML(params[4]) + " y " + Tools.escapeHTML(params[5]) +  '.</font></h2><b>Para unirse a la war: <button name="send" value="/war join">/war join</button></b><br /><b><font color="blueviolet">Jugadores por equipo:</font></b> ' + size + '<br /><font color="blue"><b>FORMATO:</b></font> ' + format + '<hr /><br /><font color="red"><b>Recuerda que debes mantener tu nombre durante toda la duración de la guerra.</b></font>');
						break;
					case 'lineups':
						if (params.length < 8) return this.sendReply("Usage: /war new, lineups, [tier/multitier], [tamano], [clanA], [clanB], [capitanA], [capitanB]");
						var targetClan;
						var userCapA = Users.getExact(params[6]);
						if (!userCapA) return this.sendReply("El usuario " + Tools.escapeHTML(params[6]) + " no está disponible.");
						targetClan = Clans.findClanFromMember(userCapA.name);
						if (toId(targetClan) !== toId(params[4])) return this.sendReply("El usuario " + Tools.escapeHTML(params[6]) + " no pertenece al clan del que se le asigna capitan.");
						var userCapB = Users.getExact(params[7]);
						if (!userCapB) return this.sendReply("El usuario " + Tools.escapeHTML(params[7]) + " no está disponible.");
						targetClan = Clans.findClanFromMember(userCapB.name);
						if (toId(targetClan) !== toId(params[5])) return this.sendReply("El usuario " + Tools.escapeHTML(params[7]) + " no pertenece al clan del que se le asigna capitan.");
						War.newTeamTour(room.id, 'lineups', format, size, Tools.escapeHTML(params[4]), Tools.escapeHTML(params[5]), userCapA.name, userCapB.name);
						this.logModCommand(user.name + " ha iniciado una guerra con alineaciones entre los clanes " + toId(params[4]) + " y " + toId(params[5]) + " en formato " + format + ".");
						Rooms.rooms[room.id].addRaw('<hr /><h2><font color="green">' + user.name + ' ha iniciado una guerra por Alineaciones en formato ' + format + ' entre ' + Tools.escapeHTML(params[4]) + " y " + Tools.escapeHTML(params[5]) +  '.</font></h2><b><font color="orange">Capitanes de equipo: </font>' + userCapA.name + ' y ' + userCapB.name + '</font></b> <br /><b><font color="blueviolet">Jugadores por equipo:</font></b> ' + size + '<br /><font color="blue"><b>FORMATO:</b></font> ' + format + '<hr /><br /><b><font color="red">Recuerda que debes mantener tu nombre durante toda la duración del torneo.</font> <br />Los capitales deben usar /war reg, [miembro1], [miembro2]... para registrar las alineaciones.</b>');
						break;
					default:
						return this.sendReply("El tipo de war debe ser uno de estos: [standard/total/lineups]");
				}
				break;
			case 'end':
			case 'fin':
			case 'delete':
				if (!this.can('joinbattle', room)) return false;
				var tourData = War.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ninguna guerra en esta sala.");
				this.logModCommand(user.name + " ha cancelado la guerra entre " + toId(tourData.teamA) + " y " + toId(tourData.teamB) + ".");
				Rooms.rooms[room.id].addRaw('<hr /><center><h2><font color="green">' + user.name + ' ha cancelado la guerra entre ' + tourData.teamA + " y " + tourData.teamB + '.</h2></font></center><hr />');
				War.endTeamTour(roomId);
				break;
			case 'j':
			case 'unirse':
			case 'join':
				var err = War.joinTeamTour(roomId, user.name, Clans.findClanFromMember(user.name));
				if (err) return this.sendReply(err);
				var tourData = War.getTourData(roomId);
				var freePlaces =  War.getFreePlaces(roomId); 
				if (freePlaces > 0) {
					Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> se ha unido a la guerra. Quedan ' + freePlaces + ' plazas.');
				} else {
					Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> se ha unido a la guerra. Comienza la guerra!');
					War.startTeamTour(roomId);
					Rooms.rooms[room.id].addRaw(War.viewTourStatus(roomId));
				}
				break;
			case 'l':
			case 'salir':
			case 'leave':
				var err = War.leaveTeamTour(roomId, user.name);
				if (err) return this.sendReply(err);
				var freePlaces =  War.getFreePlaces(roomId);
				Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> ha salido de la guerra. Quedan ' + freePlaces + ' plazas.');
				break;
			case 'auth':
				if (!this.can('tournamentsmoderation', room)) return false;
				if (params.length < 3) return this.sendReply("Usage: /war auth, [Capitan1], [Capitan2]");
				var targetClan;
				var tourData = War.getTourData(roomId);
				var userCapA = Users.getExact(params[1]);
				if (!userCapA) return this.sendReply("El usuario " + Tools.escapeHTML(params[1]) + " no está disponible.");
				targetClan = Clans.findClanFromMember(userCapA.name);
				if (toId(targetClan) !== toId(tourData.teamA)) return this.sendReply("El usuario " + Tools.escapeHTML(params[1]) + " no pertenece al clan del que se le asigna capitan.");
				var userCapB = Users.getExact(params[2]);
				if (!userCapB) return this.sendReply("El usuario " + Tools.escapeHTML(params[2]) + " no está disponible.");
				targetClan = Clans.findClanFromMember(userCapB.name);
				if (toId(targetClan) !== toId(tourData.teamB)) return this.sendReply("El usuario " + Tools.escapeHTML(params[2]) + " no pertenece al clan del que se le asigna capitan.");
				var err = War.setAuth(roomId, params[1], params[2]);
				if (err) return this.sendReply(err);
				this.privateModCommand('(' + user.name + ' ha cambiado los Capitanes de la guerra actual)');
				break;
			case 'lineup':
			case 'alineacion':
			case 'registrar':
			case 'reg':
				var tourData = War.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ninguna guerra en esta sala");
				if (toId(user.name) !== toId(tourData.authA) && toId(user.name) !== toId(tourData.authB)) return this.sendReply("Debes ser Capitan de uno de los dos clanes para hacer esto.");
				var err = War.regParticipants(roomId, user.name, target);
				if (err) return this.sendReply(err);
				if (toId(user.name) === toId(tourData.authA)) Rooms.rooms[room.id].addRaw(user.name + ' ha registrado la alinación para ' + tourData.teamA + '.');
				if (toId(user.name) === toId(tourData.authB)) Rooms.rooms[room.id].addRaw(user.name + ' ha registrado la alinación para ' + tourData.teamB + '.');
				break;
			case 'empezar':
			case 'begin':
			case 'start':
				if (!this.can('joinbattle', room)) return false;
				var tourData = War.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ninguna guerra en esta sala.");
				if (tourData.tourRound !== 0) return this.sendReply("La guerra ya había empezado.");

				var freePlaces =  War.getFreePlaces(roomId);
				if (freePlaces > 0) return this.sendReply("Aún quedan plazas libres.");
				War.startTeamTour(roomId);
				Rooms.rooms[room.id].addRaw(War.viewTourStatus(roomId));
				break;
			case 'size':
				if (!this.can('tournamentsmoderation', room)) return false;
				if (params.length < 2) return this.sendReply("Usage: /war size, [size]");
				var err = War.sizeTeamTour(roomId, params[1]);
				if (err) return this.sendReply(err);
				var freePlaces =  War.getFreePlaces(roomId);
				if (freePlaces > 0) {
					Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> ha cambiado el tama&ntilde;o de la guerra a ' + parseInt(params[1]) + '. Quedan ' + freePlaces + ' plazas.');
				} else {
					Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> ha cambiado el tama&ntilde;o de la guerra a ' + parseInt(params[1]) + '. Comienza la guerra!');
					War.startTeamTour(roomId);
					Rooms.rooms[room.id].addRaw(War.viewTourStatus(roomId));
				}
				break;
			case 'disqualify':
			case 'dq':
				if (params.length < 2) return this.sendReply("Usage: /war dq, [user]");
				var clanUser = Clans.findClanFromMember(params[1]);
				var canReplace = false;
				if (clanUser && (Clans.authMember(clanUser, user.name) === 1 || Clans.authMember(clanUser, user.name) === 2 || Clans.authMember(clanUser, user.name) === 3)) canReplace = true;
				if (!canReplace && !this.can('tournamentsmoderation', room)) return false;
				var tourData = War.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ninguna guerra en esta sala");
				if (!War.dqTeamTour(roomId, params[1], 'cmd')) return this.sendReply("No se pudo descalificar al usuario.");
				var userk = Users.getExact(params[1]);
				if (userk) userk = userk.name; else userk = toId(params[1]);
				this.addModCommand(userk + ' fue descalificado de la guerra por ' + user.name + '.');
				if (War.isRoundEnded(roomId)) {
					War.autoEnd(roomId);
				}
				break;
			case 'replace':
				if (params.length < 3) return this.sendReply("Usage: /war replace, [userA], [userB]");
				var clanUser = Clans.findClanFromMember(params[1]);
				var canReplace = false;
				if (clanUser && (Clans.authMember(clanUser, user.name) === 1 || Clans.authMember(clanUser, user.name) === 2 || Clans.authMember(clanUser, user.name) === 3)) canReplace = true;
				if (!canReplace && !this.can('tournamentsmoderation', room)) return false;
				var clanReplace = Clans.findClanFromMember(params[2]);
				if (toId(clanUser) !== toId(clanReplace)) return this.sendReply("Al reemplazar en una guerra, ambos usuarios deben pertener al mismo clan");
				var usera = Users.getExact(params[1]);
				if (usera) usera = usera.name; else usera = toId(params[1]);
				var userb = Users.getExact(params[2]);
				if (userb) {
					userb = userb.name;
				} else {
					return this.sendReply("El usuario por el que reemplazas debe estár conectado.");
				}
				var err = War.replaceParticipant(roomId, params[1], params[2]);
				if (err) return this.sendReply(err);
				this.addModCommand(user.name + ': ' + usera + ' es reemplazado por ' + userb + ' en la guerra.');
				break;
			case 'invalidate':
				if (!this.can('tournamentsmoderation', room)) return false;
				if (params.length < 2) return this.sendReply("Usage: /war invalidate, [user]");
				var tourData = War.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ninguna guerra en esta sala.");
				var matchupId = War.findMatchup(roomId, params[1]);
				if (!War.invalidate(roomId, matchupId)) return this.sendReply("No se pudo invalidar el resultado. Puede que aún no se haya establecido ningún resultado.");
				this.addModCommand('La batalla entre ' + tourData.matchups[matchupId].from + ' y ' + tourData.matchups[matchupId].to + ' fue invalidada por ' + user.name + '.');
				break;
			case 'hotpatch':
				if (!this.can('hotpatch')) return false;
				CommandParser.uncacheTree('./war.js');
				War = require('./war.js');
				return this.sendReply('Wars hotpatched.');
			case 'ronda':
			case 'round':
				if (!this.canBroadcast()) return false;
				return this.sendReply('|raw|' + War.viewTourStatus(roomId));
			default:
				this.sendReply('No se reconoce el comando. Quizás te pueda ayuadar /war help.');
		}
	},
};

for (var i in cmds) CommandParser.commands[i] = cmds[i];

/*********************************************************
 * Events
 *********************************************************/
 
if (!Rooms.global.___startBattle) Rooms.global.___startBattle = Rooms.global.startBattle;
Rooms.global.startBattle = function(p1, p2, format, rated, p1team, p2team) {
	var newRoom = this.___startBattle(p1, p2, format, rated, p1team, p2team);
	if (!newRoom) return;
	var formaturlid = format.toLowerCase().replace(/[^a-z0-9]+/g, '');
	//tour
	var matchup = War.findTourFromMatchup(p1.name, p2.name, format, newRoom.id);
	if (matchup) {
		newRoom.war = 1;
		War.setActiveMatchup(matchup.tourId, matchup.matchupId, newRoom.id);
		Rooms.rooms[matchup.tourId].addRaw("<a href=\"/" + newRoom.id + "\" class=\"ilink\"><b>La batalla entre " + p1.name + " y " + p2.name + " ha comenzado.</b></a>");
		Rooms.rooms[matchup.tourId].update();
	}
	//end tour

	return newRoom;
};

if (!Rooms.BattleRoom.prototype.___win) Rooms.BattleRoom.prototype.___win = Rooms.BattleRoom.prototype.win;
Rooms.BattleRoom.prototype.win = function(winner) {
	//tour
	if (this.war) {
		var matchup = War.findTourFromMatchup(this.p1.name, this.p2.name, this.format, this.id);
		if (matchup) {
			var losser = false;
			if (toId(this.p1.name) === toId(winner)) losser = this.p2.name;
			if (toId(this.p2.name) === toId(winner)) losser = this.p1.name;
			
			if (!losser) {
				//tie
				Rooms.rooms[matchup.tourId].addRaw('La batalla entre <b>' + this.p1.name + '</b> y ' + this.p2.name + '</b> ha terminado en empate. Inicien otra batalla.');
				War.invalidate(matchup.tourId, matchup.matchupId);
			} else {
				Rooms.rooms[matchup.tourId].addRaw('<b>' + winner + '</b> ha ganado su batalla contra ' + losser + '.</b>');
				War.dqTeamTour(matchup.tourId, losser);
				Rooms.rooms[matchup.tourId].update();
			}
		}
	}
	//end tour
	this.___win(winner);
};
