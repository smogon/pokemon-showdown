/**
 * Login server abstraction layer
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file handles communicating with the login server.
 *
 * @license MIT license
 */

const LOGIN_SERVER_TIMEOUT = 15000;
const LOGIN_SERVER_BATCH_TIME = 1000;

module.exports = (function() {
	var http = require("http");
	var url = require('url');

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
					data = parseJSON(buffer);
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
					data = parseJSON(buffer);
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
