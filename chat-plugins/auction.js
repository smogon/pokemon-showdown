const hplDataFile = DATA_DIR + 'hpl.json';
const hplRoom = 'subasta';

const NOMINATION_TIMEOUT = 20000; //en milisegundos
const TIMEOUT_WARN = 5000; //en milisegundos
const MIN_PRIZE = 3; //precio al nominar

/* 
	Script pensado para usarse en la subasta de la hpl. Por: Ecuacion
	
	-> Para Instalarse debe colocarse este archivo en la carpeta Chat-plugins de un servidor de PS, no es necesario nada más.
	
	Comandos:
		/addteam [nombre] - agrega un equipo, solo para administradores
		/deleteteam [nombre] - elimina un equipo, solo para administradores
		/setteammoney [equipo], [dinero] - establece los ks que tiene un equipo. Se restan autoáticamente al comprar un jugador, pero debe usarse para establecer los valores iniciales.
		/setteamauth [equipo], [capitan], [cocapitan] - Establece los usuarios con derecho a nominar en un equipo.
		/setmaxplayers [num] - establece el maximo número de jugadores por equipo
		/addplayer [jugador] - agrega un usuario a la lista de elegibles
		/deletelayer [jugador] - elimina un jugador elegible
		/forceaddplayer [equipo], [jugador] - fuerza la entrada de un jugador en un equipo, por derechos de retención
		/forcedeleteplayer [equipo], [jugador] - por si alguien se equivoca, quita un jugador de un equipo y lo pone en la lista de elegibles.
		/nominationrights [equipo] - Por defecto, los derechos de nominación pasan al siguiente equipo. Esto se puede usar para confusiones o para establecer manualmente quien nomina primero.
		/organizador [usuario/off] - Establece un organizador para decidir manualmente el orden.
		
		/hplteam [nombre] - muestra el estado de un equipo.
		/hplplayers - muestra la lista de jugadores elegibles.
		
		/nominar [jugador] - Nomina un jugador si tienes derecho a hacerlo, cuesta 3k
		/pujar - puja por un jugador +0.5K
		/pujar [dinero] - puja por un jugador un número de Ks superior. NOTA: Dinero es los Ks que aumentas, no los que quieres pujar
		
		-Tras un tiempo establecido en la constante NOMINATION_TIMEOUT desde la última puja, el jugador se adjudica a un team y se le restan los Ks correspondientes.
		-No se puede usar /pujar si ya tenías la mayor puja.
*/

var fs = require('fs');

var hpl_default = {
	maxplayers: 20,
	teams: {},
	players: {},
	minplayers: 10
};

if (!fs.existsSync(hplDataFile))
	fs.writeFileSync(hplDataFile, JSON.stringify(hpl_default));

var hpl = JSON.parse(fs.readFileSync(hplDataFile).toString());

var hpl_status = {
	status: 0,
	timeout: 0,
	can_nominate: {},
	team_can_nominate: '',
	nominated: '',
	team: '',
	money: 0,
	organizer: 0
};

/* Functions */

function writeHplData() {
	fs.writeFileSync(hplDataFile, JSON.stringify(hpl));
}

function addHplTeam(team) {
	var teamid = toId(team);
	if (hpl.teams[teamid]) return false;
	hpl.teams[teamid] = {
		id: teamid,
		name: team,
		capi: '',
		cocapi: '',
		players: {},
		numplayers: 0,
		money: 0
	};
	return true;
}

function deleteHplTeam(team) {
	team = toId(team);
	if (!hpl.teams[team]) return false;
	delete hpl.teams[team];
	return true;
}

function findTeamFromPlayer(player) {
	player = toId(player);
	for (var i in hpl.teams) {
		if (hpl.teams[i].players[player]) return i;
	}
	return false;
}

function init_nominate(room, player, team, money) {
	hpl_status.status = 1;
	hpl_status.nominated = player;
	hpl_status.team = team;
	hpl_status.money = money;
	hpl_status.timeout = NOMINATION_TIMEOUT;
	room.addRaw("<div class=\"broadcast-blue\"><b>" + hpl.teams[team].name + " ha nominado al jugador " + player + " por " + money + "K!</b><br />Para pujar por él se debe usar /pujar</div>");
	room.update();
	var loop = function () {
		setTimeout(function () {
			hpl_status.timeout -= TIMEOUT_WARN;
			if (hpl_status.timeout <= 0) {
				aplicate_status(room);
				return;
			}
			room.addRaw("<font color = \"red\"><small>Quedan " + (hpl_status.timeout / 1000) + " segundos para pujar.</small></font>");
			room.update();
			loop();
		}, TIMEOUT_WARN);
	};
	loop();
}

function aplicate_status(room) {
	hpl_status.status = 0;
	var team = toId(hpl_status.team);
	var player = toId(hpl_status.nominated);
	var money = hpl_status.money;
	if (!hpl.teams[team] || !hpl.players[player]) {
		room.addRaw("<div class=\"broadcast-red\"><b>El tiempo ha terminado!</b><br />Algo ha fallado! Es posible que el jugador o el equipo hayan sido alterados manualmente durante el proceso</div>");
		room.update();
		hpl_status = {
			status: 0,
			timeout: 0,
			can_nominate: {},
			team_can_nominate: '',
			nominated: '',
			team: '',
			money: 0,
			organizer: hpl_status.organizer
		};
	} else {
		delete hpl.players[player];
		hpl.teams[team].players[player] = 1;
		hpl.teams[team].numplayers++;
		hpl.teams[team].money -= money;
		room.addRaw("<div class=\"broadcast-green\"><b>El tiempo ha terminado!</b><br />El jugador " + player + " queda adjudicado al equipo " + hpl.teams[team].name + " por " + money + "K!</div>");
		var html = '<strong>' + hpl.teams[team].name + ': </strong><br />';
		html += "&nbsp;&nbsp;&nbsp;&nbsp;<b>Capitan:</b> " + hpl.teams[team].capi + "<br />";
		html += "&nbsp;&nbsp;&nbsp;&nbsp;<b>Co-Capitan:</b> " + hpl.teams[team].cocapi + "<br />";
		html += "&nbsp;&nbsp;&nbsp;&nbsp;<b>Dinero:</b> " + hpl.teams[team].money + "K<br />";
		html += "&nbsp;&nbsp;&nbsp;&nbsp;<b>Jugadores:</b> " + Object.keys(hpl.teams[team].players).join(", ") + "<br />";
		html += "&nbsp;&nbsp;&nbsp;&nbsp;<b>Numero de Jugadores:</b> " + hpl.teams[team].numplayers + "/" + hpl.maxplayers + "<br />";
		room.addRaw("<div class=\"infobox\">" + html + "</div>");
		room.update();
		writeHplData();
		nextTeam(room);
	}
}

function nextTeam(room) {
	if (hpl_status.organizer) {
		hpl_status = {
			status: 0,
			timeout: 0,
			can_nominate: {},
			team_can_nominate: '',
			nominated: '',
			team: '',
			money: 0,
			organizer: hpl_status.organizer
		};
		var orgUser = Users.get(hpl_status.organizer);
		if (!orgUser) return;
		var html = '<b>Establece quien tiene el turno para nominar:</b><br />';
		for (var i in hpl.teams) {
			html += '<button name="send" value="/nturn ' + i + '">' + hpl.teams[i].name + "</button>&nbsp;";
		}
		orgUser.sendTo(room, '|raw|<div class="infobox">' + html + '</div>');
		return;
	}
	var team = toId(hpl_status.team_can_nominate);
	var nextteam = '';
	var teamFlag = 0;
	for (var i in hpl.teams) {
		if (teamFlag) {
			nextteam = i;
			teamFlag = 0;
			break;
		}
		if (i === team) teamFlag = 1; 
	}
	if (teamFlag) nextteam = Object.keys(hpl.teams)[0];
	hpl_status.can_nominate = {};
	hpl_status.can_nominate[toId(hpl.teams[nextteam].capi)] = 1;
	hpl_status.can_nominate[toId(hpl.teams[nextteam].cocapi)] = 1;
	hpl_status.team_can_nominate = nextteam;
	room.addRaw("El equipo <b>" + hpl.teams[nextteam].name + "</b> tiene el turno para nominar a un jugador.");
	room.update();
}

/* Commands */

exports.commands = {
	
/* Info */

	auctionhelp: function (target, room, user) {
		if (room.id !== hplRoom) return this.sendReply("Este comando solo puede ser usado en la sala Subasta");
		if (!this.canBroadcast()) return false;
		this.sendReplyBox(
			'<strong>Comandos informativos:</strong><br />' +
			'	/jugadores - Muestra la lista de jugadores elegibles.<br />' +
			'	/equipo [equipo] - Muestra info de un equipo.<br />' +
			'	/equipos - Muestra la lista de equipos.<br />' +
			'<strong>Comandos básicos:</strong><br />' +
			'	/nominar [jugador] - Nomina a un jugador.<br />' +
			'	/pujar - puja por un jugador +0.5K<br />' +
			'	/pujar [dinero] - puja por un jugador un número de Ks superior.<br />' +
			'<strong>Comandos administrativos:</strong><br />' +
			'	/addteam [nombre] - agrega un equipo<br />' +
			'	/deleteteam [nombre] - elimina un equipo<br />' +
			'	/setteammoney [equipo], [dinero] - establece los ks que tiene un equipo.<br />' +
			'	/setteamauth [equipo], [capitan], [cocapitan] - Establece los usuarios con derecho a nominar en un equipo.<br />' +
			'	/setmaxplayers [num] - establece el maximo número de jugadores por equipo.<br />' +
			'	/setminplayers [num] - establece el mínimo número de jugadores por equipo.<br />' +
			'	/addplayer [jugador] - agrega un usuario a la lista de elegibles.<br />' +
			'	/deletelayer [jugador] - elimina un jugador elegible<br />' +
			'	/forceaddplayer [equipo], [jugador] - fuerza la entrada de un jugador en un equipo, por derechos de retención.<br />' +
			'	/forcedeleteplayer [equipo], [jugador] - por si alguien se equivoca, quita un jugador de un equipo y lo pone en la lista de elegibles.<br />' +
			'	/nominationrights [equipo] - Por defecto, los derechos de nominación pasan al siguiente equipo. Esto se puede usar para confusiones o para establecer manualmente quien nomina primero.<br />'
		);
	},
	
	estadosubasta: 'auctionstatus',
	auctionstatus: function (target, room, user) {
		if (room.id !== hplRoom) return this.sendReply("Este comando solo puede ser usado en la sala Subasta");
		if (!this.canBroadcast()) return false;
		var html = '<center><h2>Lista de equipos</h2></center>';
		for (var team in hpl.teams) {
			html += '<hr /><strong>' + hpl.teams[team].name + ': </strong><br />';
			html += "&nbsp;&nbsp;&nbsp;&nbsp;<b>Capitan:</b> " + hpl.teams[team].capi + "<br />";
			html += "&nbsp;&nbsp;&nbsp;&nbsp;<b>Co-Capitan:</b> " + hpl.teams[team].cocapi + "<br />";
			html += "&nbsp;&nbsp;&nbsp;&nbsp;<b>Dinero:</b> " + hpl.teams[team].money + "K<br />";
			html += "&nbsp;&nbsp;&nbsp;&nbsp;<b>Jugadores:</b> " + Object.keys(hpl.teams[team].players).join(", ") + "<br />";
			html += "&nbsp;&nbsp;&nbsp;&nbsp;<b>Numero de Jugadores:</b> " + hpl.teams[team].numplayers + "/" + hpl.maxplayers + "<br />";
		}
		this.sendReplyBox(html);
	},
	
	equipos: function (target, room, user) {
		if (room.id !== hplRoom) return this.sendReply("Este comando solo puede ser usado en la sala Subasta");
		if (!this.canBroadcast()) return false;
		var html = '<strong>Lista de equipos: </strong><br />';
		for (var i in hpl.teams) {
			html += "	->" + hpl.teams[i].name + "<br />";
		}
		this.sendReplyBox(html);
	},
	
	equipo: function (target, room, user) {
		if (room.id !== hplRoom) return this.sendReply("Este comando solo puede ser usado en la sala Subasta");
		if (!this.canBroadcast()) return false;
		var team = toId(target);
		if (!hpl.teams[team]) return this.sendReply("El equipo" + team + " no existe");
		var html = '<strong>' + hpl.teams[team].name + ': </strong><br />';
		html += "&nbsp;&nbsp;&nbsp;&nbsp;<b>Capitan:</b> " + hpl.teams[team].capi + "<br />";
		html += "&nbsp;&nbsp;&nbsp;&nbsp;<b>Co-Capitan:</b> " + hpl.teams[team].cocapi + "<br />";
		html += "&nbsp;&nbsp;&nbsp;&nbsp;<b>Dinero:</b> " + hpl.teams[team].money + "K<br />";
		html += "&nbsp;&nbsp;&nbsp;&nbsp;<b>Jugadores:</b> " + Object.keys(hpl.teams[team].players).join(", ") + "<br />";
		html += "&nbsp;&nbsp;&nbsp;&nbsp;<b>Numero de Jugadores:</b> " + hpl.teams[team].numplayers + "/" + hpl.maxplayers + "<br />";
		this.sendReplyBox(html);
	},
	
	jugadores: function (target, room, user) {
		if (room.id !== hplRoom) return this.sendReply("Este comando solo puede ser usado en la sala Subasta");
		if (!this.canBroadcast()) return false;
		var html = '<strong>Lista de jugadores elegibles: </strong>' + Object.keys(hpl.players).join(", ");
		this.sendReplyBox(html);
	},

/* Basic */

	nominate: 'nominar',
	nominar: function (target, room, user) {
		if (room.id !== hplRoom) return this.sendReply("Este comando solo puede ser usado en la sala Subasta");
		if (hpl_status.status !== 0) return this.sendReply("No se puede nominar mientras se está pujando");
		var player = toId(target);
		if (!hpl.players[player]) return this.sendReply("El jugador " + player + " no está en la lista de jugadores elegibles");
		//check
		var team = 0;
		for (var i in hpl.teams) {
			if (user.userid === toId(hpl.teams[i].capi) || user.userid === toId(hpl.teams[i].cocapi)) {
				team = i;
				break;
			}
		}
		if (!team) return this.sendReply("No tienes autoridad en ningún equipo");
		if (toId(hpl_status.team_can_nominate) !== team) {
			if (!hpl.teams[toId(hpl_status.team_can_nominate)]) return this.sendReply(hpl.teams[team].name + " no tiene el turno para nominar. Lo tiene " + toId(hpl_status.team_can_nominate));
			return this.sendReply(hpl.teams[team].name + " no tiene el turno para nominar.  Lo tiene " + hpl.teams[toId(hpl_status.team_can_nominate)].name);
		}
		if (hpl.teams[team].money < MIN_PRIZE) return this.sendReply(hpl.teams[team].name + " no tiene suficiente dinero para nominar.");
		if (hpl.teams[team].numplayers >= hpl.maxplayers) return this.sendReply("El equipo está completo");
		this.privateModCommand("(" + user.name + " ha nominado al jugador " + player + ")");
		init_nominate(room, player, team, MIN_PRIZE);
	},
	
	p: 'pujar',
	bid: 'pujar',
	pujar: function (target, room, user) {
		if (room.id !== hplRoom) return this.sendReply("Este comando solo puede ser usado en la sala Subasta");
		if (hpl_status.status !== 1) return this.sendReply("No hay ningún usuario nominado");
		var money;
		if (!target || !target.length) money = 0.5;
		else money = parseFloat(target) - hpl_status.money;
		if (!money || money < 0) return this.sendReply("La cantidad especificada es inferior a la puja actual");
		//check
		var team = 0;
		for (var i in hpl.teams) {
			if (user.userid === toId(hpl.teams[i].capi) || user.userid === toId(hpl.teams[i].cocapi)) {
				team = i;
				break;
			}
		}
		if (!team) return this.sendReply("No tienes autoridad en ningún equipo");
		if (toId(hpl_status.team) === team) return this.sendReply("No tiene sentido aumentar la puja si ya tienes la puja más alta");
		var totalMoney = hpl_status.money + money;
		if (hpl.teams[team].money < totalMoney + (hpl.minplayers - hpl.teams[team].numplayers - 1) * MIN_PRIZE) return this.sendReply(hpl.teams[team].name + " no tiene suficiente dinero para subir la puja. Aun debes completar tu equipo.");
		if (hpl.teams[team].money < totalMoney) return this.sendReply(hpl.teams[team].name + " no tiene suficiente dinero para subir la puja.");
		if (hpl.teams[team].numplayers >= hpl.maxplayers) return this.sendReply("El equipo está completo");
		//do
		hpl_status.timeout = NOMINATION_TIMEOUT;
		hpl_status.team = team;
		hpl_status.money = totalMoney;
		room.addRaw(user.name + ": <b>" + hpl.teams[team].name + "</b> sube <b>" + money + "K</b>. Puja actual: <b>" + totalMoney + "K</b> por el jugador <b>" + hpl_status.nominated + "</b>.");
		room.update();
	},

/* Administration */

	addteam: function (target, room, user) {
		if (room.id !== hplRoom) return this.sendReply("Este comando solo puede ser usado en la sala Subasta");
		if (!this.can('hlp')) return false;
		if (!target || target.length < 3) return this.sendReply("El nombre es demasiado corto");
		if (addHplTeam(target)) {
			this.addModCommand(user.name + " ha registrado el equipo " + target);
			writeHplData();
		} else {
			this.sendReply("El equipo " + toId(target) + " ya está registrado");
		}
	},
	
	deleteteam: function (target, room, user) {
		if (room.id !== hplRoom) return this.sendReply("Este comando solo puede ser usado en la sala Subasta");
		if (!this.can('hlp')) return false;
		if (deleteHplTeam(target)) {
			this.addModCommand(user.name + " ha eliminado el equipo " + target);
			writeHplData();
		} else {
			this.sendReply("El equipo " + toId(target) + " no existe");
		}
	},
	
	stm: 'setteammoney',
	setteammoney: function (target, room, user) {
		if (room.id !== hplRoom) return this.sendReply("Este comando solo puede ser usado en la sala Subasta");
		if (!this.can('hlp')) return false;
		var args = target.split(",");
		if (args.length < 2) return this.sendReply("Usage: /setteammoney [equipo], [dinero]");
		var team = toId(args[0]);
		var money = parseFloat(args[1]);
		if (!hpl.teams[team]) return this.sendReply("El equipo " + team + " no existe");
		if (!money || money < 0) return this.sendReply("La cantidad especificada no es válida");
		hpl.teams[team].money = money;
		this.addModCommand(user.name + " ha establecido la cantidad inicial de dinero del equipo " + hpl.teams[team].name + ": " + money + "K");
		writeHplData();
	},
	
	setmaxplayers: function (target, room, user) {
		if (room.id !== hplRoom) return this.sendReply("Este comando solo puede ser usado en la sala Subasta");
		if (!this.can('hlp')) return false;
		var maxplayers = parseInt(target);
		if (!maxplayers) return this.sendReply("La cantidad especificada no es válida");
		hpl.maxplayers = maxplayers;
		this.addModCommand(user.name + " ha establecido el número máximo de jugadores por equipo: " + hpl.maxplayers);
		writeHplData();
	},
	
	setminplayers: function (target, room, user) {
		if (room.id !== hplRoom) return this.sendReply("Este comando solo puede ser usado en la sala Subasta");
		if (!this.can('hlp')) return false;
		var minplayers = parseInt(target);
		if (!minplayers) return this.sendReply("La cantidad especificada no es válida");
		hpl.minplayers = minplayers;
		this.addModCommand(user.name + " ha establecido el número mínimo de jugadores por equipo: " + hpl.minplayers);
		writeHplData();
	},
	
	setteamauth: function (target, room, user) {
		if (room.id !== hplRoom) return this.sendReply("Este comando solo puede ser usado en la sala Subasta");
		if (!this.can('hlp')) return false;
		var args = target.split(",");
		if (args.length < 3) return this.sendReply("Usage: /setteamauth [equipo], [capitan], [cocapitan]");
		var team = toId(args[0]);
		var capi = args[1];
		var cocapi = args[2];
		if (!hpl.teams[team]) return this.sendReply("El equipo " + team + " no existe");
		hpl.teams[team].capi = capi;
		hpl.teams[team].cocapi = cocapi;
		this.addModCommand(user.name + " ha establecido la autoridad del equipo " + hpl.teams[team].name + ": " + capi + " (Capitán) y " + cocapi + " (Co-Capitán)");
		writeHplData();
	},
	
	addplayer: function (target, room, user) {
		if (room.id !== hplRoom) return this.sendReply("Este comando solo puede ser usado en la sala Subasta");
		if (!this.can('hlp')) return false;
		if (!target || target.length < 2) return this.sendReply("El nombre es demasiado corto");
		var team = findTeamFromPlayer(target);
		if (team) return this.sendReply("El jugador se encontraba dentro del equipo " + hpl.teams[team].name);
		if (hpl.players[toId(target)]) return this.sendReply("El jugador ya estaba en la lista de elegibles");
		hpl.players[toId(target)] = 1;
		this.addModCommand(user.name + " ha agregado un jugador: " + target);
	},
	
	deleteplayer: function (target, room, user) {
		if (room.id !== hplRoom) return this.sendReply("Este comando solo puede ser usado en la sala Subasta");
		if (!this.can('hlp')) return false;
		if (!hpl.players[toId(target)]) return this.sendReply("El jugador no estaba en la lista de elegibles");
		delete hpl.players[toId(target)];
		this.addModCommand(user.name + " ha eliminado un jugador: " + target);
		writeHplData();
	},
	
	fap: 'forceaddplayer',
	forceaddplayer: function (target, room, user) {
		if (room.id !== hplRoom) return this.sendReply("Este comando solo puede ser usado en la sala Subasta");
		if (!this.can('hlp')) return false;
		var args = target.split(",");
		if (args.length < 2) return this.sendReply("Usage: /forceaddplayer [equipo], [jugador]");
		var team = toId(args[0]);
		var player = toId(args[1]);
		if (!hpl.teams[team]) return this.sendReply("El equipo " + team + " no existe");
		if (!hpl.players[player]) return this.sendReply("El jugador no estaba en la lista de elegibles");
		if (hpl.teams[team].numplayers >= hpl.maxplayers) return this.sendReply("El equipo está completo");
		delete hpl.players[player];
		hpl.teams[team].players[player] = 1;
		hpl.teams[team].numplayers++;
		this.addModCommand(user.name + " ha forzado al jugador " + player + " a unirse al equipo " + hpl.teams[team].name);
		writeHplData();
	},
	
	fdp: 'forcedeleteplayer',
	forcedeleteplayer: function (target, room, user) {
		if (room.id !== hplRoom) return this.sendReply("Este comando solo puede ser usado en la sala Subasta");
		if (!this.can('hlp')) return false;
		var args = target.split(",");
		if (args.length < 2) return this.sendReply("Usage: /forcedeleteplayer [equipo], [jugador]");
		var team = toId(args[0]);
		var player = toId(args[1]);
		if (!hpl.teams[team]) return this.sendReply("El equipo " + team + " no existe");
		if (!hpl.teams[team].players[player]) return this.sendReply("El jugador no estaba en el equipo especificado");
		hpl.players[player] = 1;
		delete hpl.teams[team].players[player];
		hpl.teams[team].numplayers--;
		this.addModCommand(user.name + " ha forzado al jugador " + player + " a abandonar el equipo " + hpl.teams[team].name);
		writeHplData();
	},
	
	nturn: 'nominationrights',
	nominationturn: 'nominationrights',
	nominationrights: function (target, room, user) {
		if (room.id !== hplRoom) return this.sendReply("Este comando solo puede ser usado en la sala Subasta");
		if (!this.can('hlp')) return false;
		var team = toId(target);
		if (!hpl.teams[team]) return this.sendReply("El equipo " + team + " no existe");
		hpl_status.can_nominate = {};
		hpl_status.can_nominate[toId(hpl.teams[team].capi)] = 1;
		hpl_status.can_nominate[toId(hpl.teams[team].cocapi)] = 1;
		hpl_status.team_can_nominate = team;
		this.addModCommand(user.name + ": " + hpl.teams[team].name + " tiene el turno para nominar un jugador.");
	},
	
	setorganizer: 'organizador',
	organizador: function (target, room, user) {
		if (room.id !== hplRoom) return this.sendReply("Este comando solo puede ser usado en la sala Subasta");
		if (!this.can('hlp')) return false;
		if (toId(target) === "off") {
			hpl_status.organizer = 0;
			return this.addModCommand(user.name + " ha establecido el orden rotatorio en la subasta");
		}
		hpl_status.organizer = toId(target);
		this.addModCommand(user.name + " ha establecido a " + target + " como organizador de la subasta. Por lo que el orden será decidido manualmente.");
	}
};
