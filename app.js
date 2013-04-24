const LOGIN_SERVER_TIMEOUT = 15000;
const LOGIN_SERVER_BATCH_TIME = 1000;

function runNpm(command) {
	console.log('Running `npm ' + command + '`...');
	var child_process = require('child_process');
	var npm = child_process.spawn('npm', [command]);
	npm.stdout.on('data', function(data) {
		process.stdout.write(data);
	});
	npm.stderr.on('data', function(data) {
		process.stderr.write(data);
	});
	npm.on('close', function(code) {
		if (!code) {
			child_process.fork('app.js').disconnect();
		}
	});
}

try {
	require('sugar');
} catch (e) {
	return runNpm('install');
}
if (!Object.select) {
	return runNpm('update');
}

fs = require('fs');
if (!fs.existsSync) {
	var path = require('path');
	fs.existsSync = function(loc) { return path.existsSync(loc) };
}

//request = require('request');
var http = require("http");
var url = require('url');

LoginServer = (function() {
	function LoginServer(uri) {
		console.log('Creating LoginServer object for ' + uri + '...');
		this.uri = uri;
		this.requestQueue = [];
		LoginServer.loginServers[this.uri] = this;
	}

	// "static" mapping of URIs to LoginServer objects
	LoginServer.loginServers = {};

	// "static" flag
	LoginServer.disabled = false;

	LoginServer.prototype.requestTimer = null;
	LoginServer.prototype.requestTimeoutTimer = null;
	LoginServer.prototype.requestLog = '';
	LoginServer.prototype.lastRequest = 0;
	LoginServer.prototype.openRequests = 0;

	var getLoginServer = function(action) {
		var uri;
		if (config.loginservers) {
			uri = config.loginservers[action] || config.loginservers[null];
		} else {
			uri = config.loginserver;
		}
		if (!uri) {
			console.log('ERROR: No login server specified for action: ' + action);
			return;
		}
		return LoginServer.loginServers[uri] || new LoginServer(uri);
	};
	LoginServer.instantRequest = function(action, data, callback) {
		return getLoginServer(action).instantRequest(action, data, callback);
	};
	LoginServer.request = function(action, data, callback) {
		return getLoginServer(action).request(action, data, callback);
	};

	var parseJSON = function(json) {
		if (json[0] === ']') json = json.substr(1);
		return JSON.parse(json);
	};

	LoginServer.prototype.instantRequest = function(action, data, callback) {
		if (typeof data === 'function') {
			callback = data;
			data = null;
		}
		if (this.openRequests > 5) {
			callback(null, null, 'overflow');
			return;
		}
		this.openRequests++;
		var dataString = '';
		if (data) {
			for (var i in data) {
				dataString += '&'+i+'='+encodeURIComponent(''+data[i]);
			}
		}
		var req = http.get(url.parse(this.uri+'action.php?act='+action+'&serverid='+config.serverid+'&servertoken='+config.servertoken+'&nocache='+new Date().getTime()+dataString), function(res) {
			var buffer = '';
			res.setEncoding('utf8');

			res.on('data', function(chunk) {
				buffer += chunk;
			});

			res.on('end', function() {
				var data = null;
				try {
					var data = parseJSON(buffer);
				} catch (e) {}
				callback(data, res.statusCode);
				this.openRequests--;
			});
		});

		req.on('error', function(error) {
			callback(null, null, error);
			this.openRequests--;
		});

		req.end();
	};
	LoginServer.prototype.request = function(action, data, callback) {
		if (typeof data === 'function') {
			callback = data;
			data = null;
		}
		if (LoginServer.disabled) {
			callback(null, null, 'disabled');
			return;
		}
		if (!data) data = {};
		data.act = action;
		data.callback = callback;
		this.requestQueue.push(data);
		this.requestTimerPoke();
	};
	LoginServer.prototype.requestTimerPoke = function() {
		// "poke" the request timer, i.e. make sure it knows it should make
		// a request soon

		// if we already have it going or the request queue is empty no need to do anything
		if (this.openRequests || this.requestTimer || !this.requestQueue.length) return;

		this.requestTimer = setTimeout(this.makeRequests.bind(this), LOGIN_SERVER_BATCH_TIME);
	};
	LoginServer.prototype.makeRequests = function() {
		this.requestTimer = null;
		var self = this;
		var requests = this.requestQueue;
		this.requestQueue = [];

		if (!requests.length) return;

		var requestCallbacks = [];
		for (var i=0,len=requests.length; i<len; i++) {
			var request = requests[i];
			requestCallbacks[i] = request.callback;
			delete request.callback;
		}

		this.requestStart(requests.length);
		var postData = 'serverid='+config.serverid+'&servertoken='+config.servertoken+'&nocache='+new Date().getTime()+'&json='+encodeURIComponent(JSON.stringify(requests))+'\n';
		var requestOptions = url.parse(this.uri+'action.php');
		requestOptions.method = 'post';
		requestOptions.headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length
		};

		var req = null;
		var reqError = function(error) {
			if (self.requestTimeoutTimer) {
				clearTimeout(self.requestTimeoutTimer);
				self.requestTimeoutTimer = null;
			}
			req.abort();
			for (var i=0,len=requestCallbacks.length; i<len; i++) {
				requestCallbacks[i](null, null, error);
			}
			self.requestEnd();
		};

		self.requestTimeoutTimer = setTimeout(function() {
			reqError('timeout');
		}, LOGIN_SERVER_TIMEOUT);

		req = http.request(requestOptions, function(res) {
			if (self.requestTimeoutTimer) {
				clearTimeout(self.requestTimeoutTimer);
				self.requestTimeoutTimer = null;
			}
			var buffer = '';
			res.setEncoding('utf8');

			res.on('data', function(chunk) {
				buffer += chunk;
			});

			var endReq = function() {
				if (self.requestTimeoutTimer) {
					clearTimeout(self.requestTimeoutTimer);
					self.requestTimeoutTimer = null;
				}
				//console.log('RESPONSE: '+buffer);
				var data = null;
				try {
					var data = parseJSON(buffer);
				} catch (e) {}
				for (var i=0,len=requestCallbacks.length; i<len; i++) {
					if (data) {
						requestCallbacks[i](data[i], res.statusCode);
					} else {
						requestCallbacks[i](null, res.statusCode, 'corruption');
					}
				}
				self.requestEnd();
			}.once();
			res.on('end', endReq);
			res.on('close', endReq);

			self.requestTimeoutTimer = setTimeout(function(){
				if (res.connection) res.connection.destroy();
				endReq();
			}, LOGIN_SERVER_TIMEOUT);
		});

		req.on('error', reqError);

		req.write(postData);
		req.end();
	};
	LoginServer.prototype.requestStart = function(size) {
		this.lastRequest = Date.now();
		this.requestLog += ' | '+size+' requests: ';
		this.openRequests++;
	};
	LoginServer.prototype.requestEnd = function() {
		this.openRequests = 0;
		this.requestLog += ''+(Date.now() - this.lastRequest).duration();
		this.requestLog = this.requestLog.substr(-1000);
		this.requestTimerPoke();
	};
	LoginServer.prototype.getLog = function() {
		return this.requestLog + (this.lastRequest?' ('+(Date.now() - this.lastRequest).duration()+' since last request)':'');
	};

	return LoginServer;
})();

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

if (config.watchconfig) {
	fs.watchFile('./config/config.js', function(curr, prev) {
		if (curr.mtime <= prev.mtime) return;
		try {
			delete require.cache[require.resolve('./config/config.js')];
			config = require('./config/config.js');
			console.log('Reloaded config/config.js');
		} catch (e) {}
	});
}

if (process.argv[2] && parseInt(process.argv[2])) {
	config.port = parseInt(process.argv[2]);
}
if (process.argv[3]) {
	config.setuid = process.argv[3];
}

if (config.protocol !== 'io' && config.protocol !== 'eio') config.protocol = 'ws';

var app;
var server;
if (config.protocol === 'io') {
	server = require('socket.io').listen(config.port).set('log level', 1);
	server.set('transports', ['websocket', 'htmlfile', 'xhr-polling']); // temporary hack until https://github.com/LearnBoost/socket.io/issues/609 is fixed
} else if (config.protocol === 'eio') {
	app = require('http').createServer().listen(config.port);
	server = require('engine.io').attach(app);
} else {
	app = require('http').createServer();
	try {
		var nodestatic = require('node-static');
		var fileserver = new nodestatic.Server('./static');
		app.on('request', function(request, response) {
			request.resume();
			request.addListener('end', function() {
				fileserver.serve(request, response, function(e, res) {
				    if (e && (e.status === 404)) {
				        fileserver.serveFile('404.html', 404, {}, request, response);
				    }
				});
			});
		});
	} catch (e) {
		console.log('Did not start node-static - try `npm install` if you want to use it');
	}
	server = require('sockjs').createServer({
		sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js",
		log: function(severity, message) {
			if (severity === 'error') console.log('ERROR: '+message);
		},
		prefix: '/showdown'
	});
}

// Make `server` available using the console.
Server = server;

/**
 * Converts anything to an ID. An ID must have only lowercase alphanumeric
 * characters.
 * If a string is passed, it will be converted to lowercase and
 * non-alphanumeric characters will be stripped.
 * If an object with an ID is passed, its ID will be returned.
 * Otherwise, an empty string will be returned.
 */
toId = function(text) {
	if (text && text.id) text = text.id;
	else if (text && text.userid) text = text.userid;

	return string(text).toLowerCase().replace(/[^a-z0-9]+/g, '');
};
toUserid = toId;

/**
 * Validates a username or Pokemon nickname
 */
var bannedNameStartChars = {'~':1, '&':1, '@':1, '%':1, '+':1, '-':1, '!':1, '?':1, '#':1};
toName = function(name) {
	name = string(name).trim();
	name = name.replace(/(\||\n|\[|\]|\,)/g, '');
	while (bannedNameStartChars[name.substr(0,1)]) {
		name = name.substr(1);
	}
	if (name.length > 18) name = name.substr(0,18);
	return name;
};

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

Data = {};

Users = require('./users.js');

Rooms = require('./rooms.js');

delete process.send; // in case we're a child process
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
	} else if (config.protocol === 'eio') {
		if (typeof data === 'object') data.type = type;
		else data = {type: type, message: data};
		socket.send(JSON.stringify(data));
	} else {
		if (typeof data === 'object') data.type = type;
		else data = {type: type, message: data};
		socket.write(JSON.stringify(data));
	}
};

sendData = function(socket, data) {
	if (config.protocol === 'io') {
		socket.emit('data', data);
	} else if (config.protocol === 'eio') {
		socket.send(data);
	} else {
		socket.write(data);
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
		Rooms.lobby.addRaw('<div class="message-server-crash"><b>THE SERVER HAS CRASHED:</b> '+stack+'<br />Please restart the server.</div>');
		Rooms.lobby.addRaw('<div class="message-server-crash">You will not be able to talk in the lobby or start new battles until the server restarts.</div>');
		config.modchat = 'crash';
		lockdown = true;
	});
}

// event functions
var events = {
	join: function(data, socket, you) {
		if (!data || typeof data.room !== 'string') return;
		if (!you) {
			you = Users.connectUser(socket, data.room);
			return you;
		} else {
			var youUser = resolveUser(you, socket);
			if (!youUser) return;
			youUser.joinRoom(data.room, socket);
		}
	},
	chat: function(message, socket, you) {
		if (!message || typeof message.room !== 'string' || typeof message.message !== 'string') return;
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		var room = Rooms.get(message.room, 'lobby');
		message.message.split('\n').forEach(function(text){
			youUser.chat(text, room, socket);
		});
	},
	leave: function(data, socket, you) {
		if (!data || typeof data.room !== 'string') return;
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		youUser.leaveRoom(Rooms.get(data.room, 'lobby'), socket);
	}
};


if (config.protocol === 'io') { // Socket.IO
	server.sockets.on('connection', function (socket) {
		var you = null;

		socket.remoteAddress = socket.handshake.address.address; // for compatibility with SockJS semantics
		if (config.proxyip && (config.proxyip === true || config.proxyip.indexOf(socket.remoteAddress) >= 0)) socket.remoteAddress = (socket.headers["x-forwarded-for"]||"").split(",").shift() || socket.remoteAddress; // for proxies

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
			var youUser = resolveUser(you, socket);
			if (!youUser) return;
			youUser.disconnect(socket);
		});
	});
} else if (config.protocol === 'eio') { // engine.io
	server.on('connection', function (socket) {
		var you = null;
		if (!socket) { // WTF
			return;
		}
		//socket.id = randomString(16); // this sucks

		socket.remoteAddress = socket.id;

		if (bannedIps[socket.remoteAddress]) {
			console.log('CONNECT BLOCKED - IP BANNED: '+socket.remoteAddress);
			return;
		}
		console.log('CONNECT: '+socket.remoteAddress+' ['+socket.id+']');
		socket.on('message', function(message) {
			var data = null;
			if (message.substr(0,1) === '{') {
				try {
					data = JSON.parse(message);
				} catch (e) {}
			} else {
				var pipeIndex = message.indexOf('|');
				if (pipeIndex > 0) data = {
					type: 'chat',
					room: message.substr(0, pipeIndex),
					message: message.substr(pipeIndex+1)
				};
			}
			if (!data) return;
			if (events[data.type]) you = events[data.type](data, socket, you) || you;
		});
		socket.on('close', function() {
			var youUser = resolveUser(you, socket);
			if (!youUser) return;
			youUser.disconnect(socket);
		});
	});
} else { // SockJS and engine.io
	server.on('connection', function (socket) {
		var you = null;
		if (!socket) { // WTF
			return;
		}
		socket.id = randomString(16); // this sucks

		if (config.proxyip && (config.proxyip === true || config.proxyip.indexOf(socket.remoteAddress) >= 0)) socket.remoteAddress = (socket.headers["x-forwarded-for"]||"").split(",").shift() || socket.remoteAddress; // for proxies

		if (bannedIps[socket.remoteAddress]) {
			console.log('CONNECT BLOCKED - IP BANNED: '+socket.remoteAddress);
			return;
		}
		console.log('CONNECT: '+socket.remoteAddress+' ['+socket.id+']');
		var interval;
		if (config.herokuhack) {
			// see https://github.com/sockjs/sockjs-node/issues/57#issuecomment-5242187
			interval = setInterval(function() {
				try {
					socket._session.recv.didClose();
				} catch (e) {}
			}, 15000);
		}
		socket.on('data', function(message) {
			var data = null;
			if (message.substr(0,1) === '{') {
				try {
					data = JSON.parse(message);
				} catch (e) {}
			} else {
				var pipeIndex = message.indexOf('|');
				if (pipeIndex >= 0) data = {
					type: 'chat',
					room: message.substr(0, pipeIndex),
					message: message.substr(pipeIndex+1)
				};
			}
			if (!data) return;
			if (events[data.type]) you = events[data.type](data, socket, you) || you;
		});
		socket.on('close', function() {
			if (interval) {
				clearInterval(interval);
			}
			var youUser = resolveUser(you, socket);
			if (!youUser) return;
			youUser.disconnect(socket);
		});
	});
	if (config.protocol === 'ws') {
		server.installHandlers(app, {});
		app.listen(config.port);
	}
}

console.log('Server started on port ' + config.port);

console.log('Test your server at http://localhost' +
	((config.port !== 8000) ? ('-' + config.port) : '') +
	'.psim.us');

// This slow operation is done *after* we start listening for connections
// to the server. Anybody who connects while this require() is running will
// have to wait a couple seconds before they are able to join the server, but
// at least they probably won't receive a connection error message.
Tools = require('./tools.js');

// After loading tools, generate and cache the format list.
rooms.lobby.formatListText = rooms.lobby.getFormatListText();
