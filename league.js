
/*----------------------------------------
 -----------Medals and leagues------------
 ----------------------------------------*/

const leagueDataFile = DATA_DIR + 'leaguedata.json';
const medalDataFile = DATA_DIR + 'medaldata.json';

function defaultData() {
	return {
		data: {},
		users: {}
	};
}

var fs = require('fs');

if (!fs.existsSync(leagueDataFile))
	fs.writeFileSync(leagueDataFile, '{}');
	
if (!fs.existsSync(medalDataFile))
	fs.writeFileSync(medalDataFile, JSON.stringify(defaultData()));

var league = JSON.parse(fs.readFileSync(leagueDataFile).toString());
var medal = JSON.parse(fs.readFileSync(medalDataFile).toString());

function writeLeagueData() {
	fs.writeFileSync(leagueDataFile, JSON.stringify(league));
}

function writeMedalData() {
	fs.writeFileSync(medalDataFile, JSON.stringify(medal));
}

//functions

exports.getAllMedals = function () {
	var list = '';
	for (var i in medal.data) {
		list += i + " | ";
	}
	return list;
};

exports.getMedalData = function (medalId) {
	medalId = toId(medalId);
	if (!medal.data[medalId]) return false;
	return {
		name: medal.data[medalId].name,
		image: medal.data[medalId].image,
		width: medal.data[medalId].width,
		height: medal.data[medalId].height
	};
};

exports.findMedal = function (leader, leagueid) {
	leader = toId(leader);
	if (leagueid) {
		if (!league[leagueid]) return false;
		for (var j in league[leagueid].leaders) {
			if (toId(league[leagueid].leaders[j].user) === leader) return j;
		}
		return false;
	}
	for (var i in league) {
		for (var j in league[i].leaders) {
			if (toId(league[i].leaders[j].user) === leader) return j;
		}
	}
	return false;
};

exports.newMedal = function (medalId, name, image, w, h) {
	medalId = toId(medalId);
	if (medal.data[medalId]) return false;
	medal.data[medalId] = {
		name: name,
		image: image,
		width: parseInt(w),
		height: parseInt(h)
	};
	writeMedalData();
	return true;
};

exports.deleteMedal = function (medalId) {
	medalId = toId(medalId);
	if (!medal.data[medalId]) return false;
	delete medal.data[medalId];
	writeMedalData();
	return true;
};

exports.editMedal = function (medalId, param, data) {
	medalId = toId(medalId);
	if (!medal.data[medalId]) return false;
	switch (toId(param)) {
		case 'n':
			medal.data[medalId].name = data;
			break;
		case 'i':
			medal.data[medalId].image = data;
			break;
		case 'w':
			data = parseInt(data);
			if (!data) return false;
			medal.data[medalId].width = data;
			break;
		case 'h':
			data = parseInt(data);
			if (!data) return false;
			medal.data[medalId].height = data;
			break;
	}
	writeMedalData();
	return true;
};

exports.haveMedal = function (medalId, userId) {
	userId = toId(userId);
	medalId = toId(medalId);
	if (!medal.users[userId] || !medal.users[userId][medalId]) return false;
	return true;
};

exports.giveMedal = function (medalId, userId) {
	userId = toId(userId);
	medalId = toId(medalId);
	if (!medal.users[userId]) medal.users[userId] = {};
	if (!medal.data[medalId] || medal.users[userId][medalId]) return false;
	medal.users[userId][medalId] = 1;
	writeMedalData();
	return true;
};

exports.removeMedal = function (medalId, userId) {
	userId = toId(userId);
	medalId = toId(medalId);
	if (!medal.users[userId]) return false;
	if (!medal.users[userId][medalId]) return false;
	delete medal.users[userId][medalId];
	writeMedalData();
	return true;
};

exports.getMedalRaw = function (userId) {
	userId = toId(userId);
	if (!medal.users[userId]) return '<center><b>Sin medallas por el momento.</b></center>';
	var generic = '', leagueMedals = '';
	var registeredMedals = {};
	var aux, aux2;
	for (var i in league) {
		aux = ''; aux2 = '';
		for (var n in league[i].leaders) {
			if (medal.users[userId][n] && league[i].leaders[n].rank === "g") {
				aux += '<img src="' + encodeURI(medal.data[n].image) + '" title="' + Tools.escapeHTML(medal.data[n].name) + '" width="' + Tools.escapeHTML(medal.data[n].width) + '" height="' + Tools.escapeHTML(medal.data[n].height) + '" />&nbsp;';
				registeredMedals[n] = 1;
			} else if (medal.users[userId][n] && league[i].leaders[n].rank === "e") {
				aux2 += '<img src="' + encodeURI(medal.data[n].image) + '" title="' + Tools.escapeHTML(medal.data[n].name) + '" width="' + Tools.escapeHTML(medal.data[n].width) + '" height="' + Tools.escapeHTML(medal.data[n].height) + '" />&nbsp;';
				registeredMedals[n] = 1;
			}
		}
		if (aux !== '' && aux2 === '') {
			leagueMedals += "<h3>" + Tools.escapeHTML(league[i].name) + "</h3>" + aux + "<br />";
		} else if (aux === '' && aux2 !== '') {
			leagueMedals += "<h3>" + Tools.escapeHTML(league[i].name) + "</h3>" + aux2 + "<br />";
		} else if (aux !== '' && aux2 !== '') {
			leagueMedals += "<h3>" + Tools.escapeHTML(league[i].name) + "</h3>" + aux2 + "<br /><br />" + aux + "<br />";
		}
	}
	for (var j in medal.users[userId]) {
		if (!registeredMedals[j]) {
			generic += '<img src="' + encodeURI(medal.data[j].image) + '" title="' + Tools.escapeHTML(medal.data[j].name) + '" width="' + Tools.escapeHTML(medal.data[j].width) + '" height="' + Tools.escapeHTML(medal.data[j].height) + '" />&nbsp;';
		}
	}
	if (generic !== '') generic += "<br />";
	return "<center>" + generic + leagueMedals + "</center>";
};

exports.getMedalQuery = function (userId) {
	userId = toId(userId);
	if (!medal.users[userId]) return '<center><b>Sin medallas por el momento.</b></center>';
	var generic = '', leagueMedals = '';
	var registeredMedals = {};
	var aux, aux2;
	for (var i in league) {
		aux = ''; aux2 = '';
		for (var n in league[i].leaders) {
			if (medal.users[userId][n] && league[i].leaders[n].rank === "g") {
				aux += '<img src="' + encodeURI(medal.data[n].image) + '" title="' + Tools.escapeHTML(medal.data[n].name) + '" width="' + Tools.escapeHTML(medal.data[n].width) + '" height="' + Tools.escapeHTML(medal.data[n].height) + '" />&nbsp;';
				registeredMedals[n] = 1;
			} else if (medal.users[userId][n] && league[i].leaders[n].rank === "e") {
				aux2 += '<img src="' + encodeURI(medal.data[n].image) + '" title="' + Tools.escapeHTML(medal.data[n].name) + '" width="' + Tools.escapeHTML(medal.data[n].width) + '" height="' + Tools.escapeHTML(medal.data[n].height) + '" />&nbsp;';
				registeredMedals[n] = 1;
			}
		}
		if (aux !== '' && aux2 === '') {
			leagueMedals += "<h3>" + Tools.escapeHTML(league[i].name) + "</h3>" + aux + "<br />";
		} else if (aux === '' && aux2 !== '') {
			leagueMedals += "<h3>" + Tools.escapeHTML(league[i].name) + "</h3>" + aux2 + "<br />";
		} else if (aux !== '' && aux2 !== '') {
			leagueMedals += "<h3>" + Tools.escapeHTML(league[i].name) + "</h3>" + aux2 + "<br /><br />" + aux + "<br />";
		}
	}
	for (var j in medal.users[userId]) {
		if (!registeredMedals[j]) {
			generic += '<img src="' + encodeURI(medal.data[j].image) + '" title="' + Tools.escapeHTML(medal.data[j].name) + '" width="' + Tools.escapeHTML(medal.data[j].width) + '" height="' + Tools.escapeHTML(medal.data[j].height) + '" />&nbsp;';
		}
	}
	if (generic !== '') generic += "<br />";
	return "<center>" + generic + leagueMedals + "</center>";
};

exports.getAllLeagues = function () {
	var list = '';
	for (var i in league) {
		list += i + " | ";
	}
	return list;
};

exports.getLeagueData = function (leagueId) {
	leagueId = toId(leagueId);
	if (!league[leagueId]) return false;
	return {
		name: league[leagueId].name,
		room: league[leagueId].room,
		leaders: league[leagueId].leaders
	};
};

exports.findLeagueFromName = function (leagueName) {
	var leagueNameId = toId(leagueName);
	for (var i in league) {
		if (toId(league[i].name) === leagueNameId) return i;
	}
	return false;
};

exports.findLeagueFromRoom = function (room) {
	var roomid = toId(room);
	for (var i in league) {
		if (toId(league[i].room) === roomid) return i;
	}
	return false;
};

exports.findLeagueFromLeader = function (leader) {
	leader = toId(leader);
	for (var i in league) {
		for (var j in league[i].leaders) {
			if (toId(league[i].leaders[j].user) === leader) return i;
		}
	}
	return false;
};

exports.findLeague = function (data, room) {
	var leagueId = toId(data);
	if (league[leagueId]) return leagueId;
	leagueId = exports.findLeagueFromName(data);
	if (leagueId) return leagueId;
	leagueId = exports.findLeagueFromRoom(room);
	if (leagueId) return leagueId;
	return false;
};

exports.newLeague = function (leagueId, name, room) {
	leagueId = toId(leagueId);
	if (league[leagueId]) return false;
	league[leagueId] = {
		name: name,
		room: room,
		leaders: {}
	};
	writeLeagueData();
	return true;
};

exports.deleteLeague = function (leagueId) {
	leagueId = toId(leagueId);
	if (!league[leagueId]) return false;
	delete league[leagueId];
	writeLeagueData();
	return true;
};

exports.editLeague = function (leagueId, param, data) {
	leagueId = toId(leagueId);
	if (!league[leagueId]) return false;
	switch (toId(param)) {
		case 'n':
			league[leagueId].name = data;
			break;
		case 'r':
			league[leagueId].room = data;
			break;
	}
	writeLeagueData();
	return true;
};

exports.addLeader = function (leagueId, user, rank, medalId) {
	leagueId = toId(leagueId);
	medalId = toId(medalId)
	if (!league[leagueId] || league[leagueId].leaders[medalId] || !medal.data[medalId]) return false;
	league[leagueId].leaders[medalId] = {
		user: user,
		rank: rank
	};
	writeLeagueData();
	return true;
};

exports.removeLeader = function (leagueId, medalId) {
	leagueId = toId(leagueId);
	medalId = toId(medalId)
	if (!league[leagueId] || !league[leagueId].leaders[medalId]) return false;
	delete league[leagueId].leaders[medalId];
	writeLeagueData();
	return true;
};

exports.getLeagueTable = function (leagueId) {
	if (!league[leagueId]) return 'La liga especificada no está registrada en el servidor';
	var html = '', medalHTML = '';
	var e = false, g = false;
	html += '<center><h2>' + league[leagueId].name + '</h2></center>';
	html += '<b>Sala:</b> <button name="send" value ="/join ' + league[leagueId].room + '">' + league[leagueId].room + '</button><br /><br />';
	html += '<b>Elite:</b> ';
	for (var i in league[leagueId].leaders) {
		if (league[leagueId].leaders[i].rank === "e") {
			e = true;
			html += Clans.getUserDiv(league[leagueId].leaders[i].user) + '&nbsp;&nbsp;'
			if (medal.data[i]) medalHTML += '<img src="' + encodeURI(medal.data[i].image) + '" title="' + Tools.escapeHTML(medal.data[i].name) + '" width="' + Tools.escapeHTML(medal.data[i].width) + '" height="' + Tools.escapeHTML(medal.data[i].height) + '" />&nbsp;';
		}
	}
	if (!e) html += '<i>(vacio)</i>';
	html += '<br /><b>Lideres:</b> ';
	for (var i in league[leagueId].leaders) {
		if (league[leagueId].leaders[i].rank === "g") {
			g = true;
			html += Clans.getUserDiv(league[leagueId].leaders[i].user) + '&nbsp;&nbsp;'
			if (medal.data[i]) medalHTML += '<img src="' + encodeURI(medal.data[i].image) + '" title="' + Tools.escapeHTML(medal.data[i].name) + '" width="' + Tools.escapeHTML(medal.data[i].width) + '" height="' + Tools.escapeHTML(medal.data[i].height) + '" />&nbsp;';
		}
	}
	if (!g) html += '<i>(vacio)</i>';
	html += '<br /><hr />' + medalHTML + '<br />';
	return html;
};
