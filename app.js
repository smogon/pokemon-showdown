require('sugar');

fs = require('fs');
path = require('path');

request = require('request');

// Synchronously copy config-example.js over to config.js if it doesn't exist
if (!path.existsSync('./config/config.js')) {
	console.log("config.js doesn't exist - creating one with default settings...");
	var BUF_LENGTH, buff, bytesRead, fdr, fdw, pos;
	BUF_LENGTH = 64 * 1024;
	buff = new Buffer(BUF_LENGTH);
	fdr = fs.openSync('./config/config-example.js', 'r');
	fdw = fs.openSync('./config/config.js', 'w');
	bytesRead = 1;
	pos = 0;
	while (bytesRead > 0) {
		bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
		fs.writeSync(fdw, buff, 0, bytesRead);
		pos += bytesRead;
	}
	fs.closeSync(fdr);
}

config = require('./config/config.js');

/*
var app = require('http').createServer()
  , io = require('socket.io').listen(app)
  , fs = require('fs');

function handler (req, res) {
	fs.readFile(__dirname + '/index.html',
	function (err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		}

		res.writeHead(200);
		res.end(data);
	});
}

app.listen(8000); */

if (process.argv[2] && parseInt(process.argv[2])) {
	config.port = parseInt(process.argv[2]);
}

var io = require('socket.io').listen(config.port).set('log level', 1);
console.log("Server started on port "+config.port);
console.log("Test your server at http://psim.tk/~~localhost:"+config.port);

// Sugar mixins

String.extend({
	toId: function() {
		return this.toLowerCase().replace(/[^a-z0-9]+/g, '');
	},
	toUserid: function() {
		return this.toId();
	},
	sanitize: function(strEscape) {
		var str = this.escapeHTML();
		if (strEscape) str = str.replace(/'/g, '\\\'');
		return str;
	}
});

Number.extend({
	clampIntRange: function(min, max) {
		var num = Math.floor(this);
		if (num < min) num = min;
		if (typeof max !== 'undefined' && num > max) num = max;
		return num;
	}
});

BattlePokedex = require('./data/pokedex.js').BattlePokedex;
BattleMovedex = require('./data/moves.js').BattleMovedex;
BattleStatuses = require('./data/statuses.js').BattleStatuses;
BattleTypeChart = require('./data/typechart.js').BattleTypeChart;
BattleScripts = require('./data/scripts.js').BattleScripts;
BattleItems = require('./data/items.js').BattleItems;
BattleAbilities = require('./data/abilities.js').BattleAbilities;
BattleFormats = require('./data/formats.js').BattleFormats;
BattleFormatsData = require('./data/formats-data.js').BattleFormatsData;
BattleLearnsets = require('./data/learnsets.js').BattleLearnsets;
try {
	BattleAliases = require('./data/aliases.js').BattleAliases || {};
} catch (e) {
	BattleAliases = {};
}

var sim = require('./simulator.js');

BattlePokemon = sim.BattlePokemon;
BattleSide = sim.BattleSide;
Battle = sim.Battle;

BattleTools = require('./tools.js').BattleTools;

Tools = new BattleTools();

Users = require('./users.js');
parseCommand = require('./chat-commands.js').parseCommand;

Rooms = require('./rooms.js');

lockdown = false;

mutedIps = {
};
bannedIps = {
};
nameLockedIps = {
};

function resolveUser(you, socket) {
	if (!you) {
		socket.emit('connectionError', 'There has been a connection error. Please refresh the page.');
		return false;
	}
	return you.user;
}

if (config.crashguard) {
	// graceful crash - allow current battles to finish before restarting
	process.on('uncaughtException', function (err) {
		console.log("\n"+err.stack+"\n");
		fs.createWriteStream('logs/errors.txt', {'flags': 'a'}).on("open", function(fd) {
			this.write("\n"+err.stack+"\n");
			this.end();
		});
		var stack = (""+err.stack).split("\n").slice(0,2).join("<br />");
		Rooms.lobby.addRaw('<div style="background-color:#BB6655;color:white;padding:2px 4px"><b>THE SERVER HAS CRASHED:</b> '+stack+'<br />Please restart the server.</div>');
		Rooms.lobby.addRaw('<div style="background-color:#BB6655;color:white;padding:2px 4px">You will not be able to talk in the lobby or start new battles until the server restarts.</div>');
		config.modchat = 'crash';
		lockdown = true;
	});
}

io.sockets.on('connection', function (socket) {
	var you = null;
	console.log('INIT SOCKET: '+socket.id);

	if (socket.handshake && socket.handshake.address && socket.handshake.address.address) {
		if (bannedIps[socket.handshake.address.address]) {
			console.log('IP BANNED: '+socket.handshake.address.address);
			return;
		}
	}

	socket.on('join', function(data) {
		if (!data || typeof data.room !== 'string' || typeof data.name !== 'string') return;
		if (!you) {
			you = Users.connectUser(data.name, socket, data.token, data.room);
			console.log('JOIN: '+data.name+' => '+you.name+' ['+data.token+']');
		} else {
			var youUser = resolveUser(you, socket);
			if (!youUser) return;
			youUser.joinRoom(data.room, socket);
		}
	});
	socket.on('rename', function(data) {
		if (!data) return;
		data.name = ''+data.name;
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		youUser.rename(data.name, data.token, data.auth);
	});
	socket.on('chat', function(message) {
		if (!message || typeof message.room !== 'string' || typeof message.message !== 'string') return;
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		var room = Rooms.get(message.room);
		youUser.chat(message.message, room, socket);
	});
	socket.on('leave', function(data) {
		if (!data || typeof data.room !== 'string') return;
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		youUser.leaveRoom(Rooms.get(data.room), socket);
	});
	socket.on('leaveBattle', function(data) {
		if (!data || typeof data.room !== 'string') return;
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		var room = Rooms.get(data.room);
		if (room.leaveBattle) room.leaveBattle(youUser);
	});
	socket.on('joinBattle', function(data) {
		if (!data || typeof data.room !== 'string') return;
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		var room = Rooms.get(data.room);
		if (room.joinBattle) room.joinBattle(youUser);
	});

	socket.on('command', function(data) {
		if (!data || typeof data.room !== 'string') return;
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		parseCommand(youUser, 'command', data, Rooms.get(data.room), socket);
	});
	socket.on('disconnect', function() {
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		youUser.disconnect(socket);
	});
	socket.on('challenge', function(data) {
		if (!data) return;
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		console.log('CHALLENGE: '+youUser.name+' => '+data.userid+' ('+data.act+')');
		switch (data.act) {
		case 'make':
			if (typeof data.format !== 'string') data.format = 'debugmode';
			if (typeof data.userid !== 'string') return;
			var problems = Tools.validateTeam(youUser.team, data.format);
			if (problems) {
				socket.emit('message', "Your team was rejected for the following reasons:\n\n- "+problems.join("\n- "));
				return;
			}
			if (!Users.get(data.userid) || !Users.get(data.userid).connected) {
				socket.emit('message', "The user '"+data.userid+"' was not found.");
			}
			youUser.makeChallenge(data.userid, data.format);
			break;
		case 'cancel':
			youUser.cancelChallengeTo(data.userid);
			break;
		case 'accept':
			if (typeof data.userid !== 'string') return;
			var format = 'debugmode';
			if (youUser.challengesFrom[data.userid]) format = youUser.challengesFrom[data.userid].format;
			var problems = Tools.validateTeam(youUser.team, format);
			if (problems) {
				socket.emit('message', "Your team was rejected for the following reasons:\n\n- "+problems.join("\n- "));
				return;
			}
			youUser.acceptChallengeFrom(data.userid);
			break;
		case 'reject':
			if (typeof data.userid !== 'string') return;
			youUser.rejectChallengeFrom(data.userid);
			break;
		}
	});
	socket.on('decision', function(data) {
		if (!data) return;
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		var room = Rooms.get(data.room);
		switch (data.choice) {
		case 'move':
		case 'switch':
		case 'undo':
		case 'team':
			if (room.decision) room.decision(youUser,data.choice,data.move);
			break;
		case 'search':
			if (data.search) {
				if (typeof data.format !== 'string') return;
				if (room.searchBattle) room.searchBattle(youUser, data.format);
			} else {
				if (room.cancelSearch) room.cancelSearch(youUser);
			}
			break;
		}
	});
	socket.on('saveTeam', function(data) {
		if (!data) return;
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		youUser.team = data.team;
		youUser.emit('update', {team: 'saved', room: 'teambuilder'});
	});
});
