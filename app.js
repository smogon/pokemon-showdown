require('nodetime').profile({
    accountKey: '42437e1e248457af9645471075b01b12c01d8493', 
    appName: 'Pokemon Showdown'
});
require('sugar');

fs = require('fs');
if (!fs.existsSync) {
	var path = require('path');
	fs.existsSync = function(loc) { return path.existsSync(loc) };
}

//request = require('request');
var http = require("http");
var url = require('url');

request = function(options, callback) {
	if (request.openRequests > 4) {
		callback('overflow');
		return;
	}
	request.openRequests++;
	var req = http.get(url.parse(options.uri), function(res) {
		var buffer = '';
		res.setEncoding('utf8');

		res.on('data', function(chunk) {
			buffer += chunk;
		});

		res.on('end', function() {
			callback(null, res.statusCode, buffer);
			request.openRequests--;
		});
	});

	req.on('error', function(error) {
		callback(error);
		request.openRequests--;
	});

	req.end();
}
request.openRequests = 0;

// Synchronously copy config-example.js over to config.js if it doesn't exist
if (!fs.existsSync('./config/config.js')) {
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
if (process.argv[3]) {
	config.setuid = process.argv[3];
}

if (config.protocol !== 'io') config.protocol = 'ws';

var app;
var server;
if (config.protocol === 'ws') {
	app = require('http').createServer();
	server = require('sockjs').createServer({sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js", log: function(severity, message) {
		if (severity === 'error') console.log('ERROR: '+message);
	}});
} else {
	server = require('socket.io').listen(config.port).set('log level', 1);
	server.set('transports', ['websocket', 'htmlfile', 'xhr-polling']); // temporary hack until https://github.com/LearnBoost/socket.io/issues/609 is fixed
}

/**
 * Converts anything to an ID. An ID must have only lowercase alphanumeric
 * characters.
 * If a string is passed, it will be converted to lowercase and
 * non-alphanumeric characters will be stripped.
 * If an object with an ID is passed, its ID will be returned.
 * Otherwise, an empty string will be returned.
 */
toId = function(text) {
	if (typeof text === 'number') text = ''+text;
	if (text && text.id) text = text.id;
	else if (text && text.userid) text = text.userid;
	text = string(text);
	if (typeof text !== 'string') return ''; //???
	return text.toLowerCase().replace(/[^a-z0-9]+/g, '');
};
toUserid = toId;

/**
 * Escapes a string for HTML
 * If strEscape is true, escapes it for JavaScript, too
 */
sanitize = function(str, strEscape) {
	str = (''+(str||''));
	str = str.escapeHTML();
	if (strEscape) str = str.replace(/'/g, '\\\'');
	return str;
};

/**
 * Safely ensures the passed variable is a string
 * Simply doing ''+str can crash if str.toString crashes or isn't a function
 * If we're expecting a string and being given anything that isn't a string
 * or a number, it's safe to assume it's an error, and return ''
 */
string = function(str) {
	if (typeof str === 'string' || typeof str === 'number') return ''+str;
	return '';
}

/**
 * Converts any variable to an integer (numbers get floored, non-numbers
 * become 0). Then clamps it between min and (optionally) max.
 */
clampIntRange = function(num, min, max) {
	if (typeof num !== 'number') num = 0;
	num = Math.floor(num);
	if (num < min) num = min;
	if (typeof max !== 'undefined' && num > max) num = max;
	return num;
};

Data = {};
Tools = require('./tools.js');

Users = require('./users.js');

Rooms = require('./rooms.js');

Verifier = require('./verifier.js');

parseCommand = require('./chat-commands.js').parseCommand;

Simulator = require('./simulator.js');

lockdown = false;

mutedIps = {};
bannedIps = {};
nameLockedIps = {};

function resolveUser(you, socket) {
	if (!you) {
		emit(socket, 'connectionError', 'There has been a connection error. Please refresh the page.');
		return false;
	}
	return you.user;
}

emit = function(socket, type, data) {
	if (config.protocol === 'io') {
		socket.emit(type, data);
	} else {
		if (typeof data === 'object') data.type = type;
		else data = {type: type, message: data};
		socket.write(JSON.stringify(data));
	}
};

function randomString(length) {
	var strArr = [];
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i=0;i<length;i++) {
		strArr[i] = chars[Math.floor(Math.random()*chars.length)];
	}
	return strArr.join('');
}

if (config.crashguard) {
	// graceful crash - allow current battles to finish before restarting
	process.on('uncaughtException', function (err) {
		console.log("\n"+err.stack+"\n");
		fs.createWriteStream('logs/errors.txt', {'flags': 'a'}).on("open", function(fd) {
			this.write("\n"+err.stack+"\n");
			this.end();
		}).on("error", function (err) {
			console.log("\n"+err.stack+"\n");
		});
		var stack = (""+err.stack).split("\n").slice(0,2).join("<br />");
		Rooms.lobby.addRaw('<div style="background-color:#BB6655;color:white;padding:2px 4px"><b>THE SERVER HAS CRASHED:</b> '+stack+'<br />Please restart the server.</div>');
		Rooms.lobby.addRaw('<div style="background-color:#BB6655;color:white;padding:2px 4px">You will not be able to talk in the lobby or start new battles until the server restarts.</div>');
		config.modchat = 'crash';
		lockdown = true;
	});
}

// event functions
var events = {
	join: function(data, socket, you) {
		if (!data || typeof data.room !== 'string' || typeof data.name !== 'string') return;
		if (!you) {
			you = Users.connectUser(data.name, socket, data.token, data.room);
			return you;
		} else {
			var youUser = resolveUser(you, socket);
			if (!youUser) return;
			youUser.joinRoom(data.room, socket);
		}
	},
	rename: function(data, socket, you) {
		if (!data) return;
		data.name = ''+data.name;
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		youUser.rename(data.name, data.token, data.auth);
	},
	chat: function(message, socket, you) {
		if (!message || typeof message.room !== 'string' || typeof message.message !== 'string') return;
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		var room = Rooms.get(message.room);
		youUser.chat(message.message, room, socket);
	},
	leave: function(data, socket, you) {
		if (!data || typeof data.room !== 'string') return;
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		youUser.leaveRoom(Rooms.get(data.room), socket);
	},
	leaveBattle: function(data, socket, you) {
		if (!data || typeof data.room !== 'string') return;
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		var room = Rooms.get(data.room);
		if (room.leaveBattle) room.leaveBattle(youUser);
	},
	joinBattle: function(data, socket, you) {
		if (!data || typeof data.room !== 'string') return;
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		var room = Rooms.get(data.room);
		if (room.joinBattle) room.joinBattle(youUser);
	},
	command: function(data, socket, you) {
		if (!data || typeof data.room !== 'string') return;
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		parseCommand(youUser, 'command', data, Rooms.get(data.room), socket);
	},
	challenge: function(data, socket, you) {
		if (!data) return;
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		//console.log('CHALLENGE: '+youUser.name+' => '+data.userid+' ('+data.act+')');
		switch (data.act) {
		case 'make':
			if (typeof data.format !== 'string') data.format = 'debugmode';
			if (typeof data.userid !== 'string') return;
			var problems = Tools.validateTeam(youUser.team, data.format);
			if (problems) {
				emit(socket, 'message', "Your team was rejected for the following reasons:\n\n- "+problems.join("\n- "));
				return;
			}
			if (!Users.get(data.userid) || !Users.get(data.userid).connected) {
				emit(socket, 'message', "The user '"+data.userid+"' was not found.");
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
				emit(socket, 'message', "Your team was rejected for the following reasons:\n\n- "+problems.join("\n- "));
				return;
			}
			youUser.acceptChallengeFrom(data.userid);
			break;
		case 'reject':
			if (typeof data.userid !== 'string') return;
			youUser.rejectChallengeFrom(data.userid);
			break;
		}
	},
	decision: function(data, socket, you) {
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
	},
	saveTeam: function(data, socket, you) {
		if (!data) return;
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		youUser.team = data.team;
		youUser.emit('update', {team: 'saved', room: 'teambuilder'});
	}
};


if (config.protocol === 'io') { // Socket.IO
	server.sockets.on('connection', function (socket) {
		var you = null;

		socket.remoteAddress = (socket.handshake.headers["x-forwarded-for"]||"").split(",").shift() || socket.handshake.address.address; // for compatibility with SockJS semantics

		if (bannedIps[socket.remoteAddress]) {
			console.log('CONNECT BLOCKED - IP BANNED: '+socket.remoteAddress);
			return;
		}

		console.log('CONNECT: '+socket.remoteAddress+' ['+socket.id+']');
		var generator = function(type) {
			return function(data) {
				console.log(you);
				events[type](data, socket, you);
			};
		};
		for (var e in events) {
			socket.on(e, (function(type) {
				return function(data) {
					you = events[type](data, socket, you) || you;
				};
			})(e));
		}
		socket.on('disconnect', function() {
			youUser = resolveUser(you, socket);
			if (!youUser) return;
			youUser.disconnect(socket);
		});
	});
} else { // SockJS
	server.on('connection', function (socket) {
		var you = null;
		if (!socket) { // WTF
			return;
		}
		socket.id = randomString(16); // this sucks

		socket.remoteAddress = (socket.headers["x-forwarded-for"]||"").split(",").shift() || socket.remoteAddress; // for proxies

		if (bannedIps[socket.remoteAddress]) {
			console.log('CONNECT BLOCKED - IP BANNED: '+socket.remoteAddress);
			return;
		}
		console.log('CONNECT: '+socket.remoteAddress+' ['+socket.id+']');
		socket.on('data', function(message) {
			var data = JSON.parse(message);
			if (!data) return;
			if (events[data.type]) you = events[data.type](data, socket, you) || you;
		});
		socket.on('close', function() {
			youUser = resolveUser(you, socket);
			if (!youUser) return;
			youUser.disconnect(socket);
		});
	});
	server.installHandlers(app, {});
	app.listen(config.port);
}

console.log("Server started on port "+config.port);

try {
	if (config.setuid) {
		process.setuid(config.setuid);
		console.log("setuid succeeded, we are now running as "+config.setuid);
	}
}
catch (err) {
	console.log("ERROR: setuid failed: [%s] Call: [%s]", err.message, err.syscall);
	process.exit(1);
}

console.log("Test your server at http://psim.tk/~~localhost:"+config.port);
