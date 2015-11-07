/**
 * Login server abstraction layer
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file handles communicating with the login server.
 *
 * @license MIT license
 */

'use strict';

const LOGIN_SERVER_TIMEOUT = 15000;
const LOGIN_SERVER_BATCH_TIME = 1000;

const http = require("http");
const url = require('url');

/* global LoginServer: true */
let LoginServer = module.exports = (function () {
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

	let getLoginServer = function (action) {
		let uri;
		if (Config.loginservers) {
			uri = Config.loginservers[action] || Config.loginservers[null];
		} else {
			uri = Config.loginserver;
		}
		if (!uri) {
			console.error("ERROR: No login server specified for action: " + action);
			return;
		}
		return LoginServer.loginServers[uri] || new LoginServer(uri);
	};
	LoginServer.instantRequest = function (action, data, callback) {
		return getLoginServer(action).instantRequest(action, data, callback);
	};
	LoginServer.request = function (action, data, callback) {
		return getLoginServer(action).request(action, data, callback);
	};
	let TimeoutError = LoginServer.TimeoutError = function (message) {
		Error.captureStackTrace(this, TimeoutError);
		this.name = "TimeoutError";
		this.message = message || "";
	};
	TimeoutError.prototype = Object.create(Error.prototype);
	TimeoutError.prototype.constructor = TimeoutError;
	TimeoutError.prototype.toString = function () {
		if (!this.message) return this.name;
		return this.name + ": " + this.message;
	};

	let parseJSON = function (json) {
		if (json[0] === ']') json = json.substr(1);
		let data = {error: null};
		try {
			data.json = JSON.parse(json);
		} catch (err) {
			data.error = err;
		}
		return data;
	};

	LoginServer.prototype.instantRequest = function (action, data, callback) {
		if (typeof data === 'function') {
			callback = data;
			data = null;
		}
		if (this.openRequests > 5) {
			setImmediate(callback, null, null, new RangeError("Request overflow"));
			return;
		}
		this.openRequests++;
		let dataString = '';
		if (data) {
			for (let i in data) {
				dataString += '&' + i + '=' + encodeURIComponent('' + data[i]);
			}
		}
		let req = http.get(url.parse(this.uri + 'action.php?act=' + action + '&serverid=' + Config.serverid + '&servertoken=' + encodeURIComponent(Config.servertoken) + '&nocache=' + new Date().getTime() + dataString), function (res) {
			let buffer = '';
			res.setEncoding('utf8');

			res.on('data', function (chunk) {
				buffer += chunk;
			});

			res.on('end', function () {
				let data = parseJSON(buffer).json;
				setImmediate(callback, data, res.statusCode);
				this.openRequests--;
			});
		});

		req.on('error', function (error) {
			setImmediate(callback, null, null, error);
			this.openRequests--;
		});

		req.end();
	};
	LoginServer.prototype.request = function (action, data, callback) {
		if (typeof data === 'function') {
			callback = data;
			data = null;
		}
		if (typeof callback === 'undefined') callback = function () {};
		if (LoginServer.disabled) {
			setImmediate(callback, null, null, new Error("Ladder disabled"));
			return;
		}
		if (!data) data = {};
		data.act = action;
		data.callback = callback;
		this.requestQueue.push(data);
		this.requestTimerPoke();
	};
	LoginServer.prototype.requestTimerPoke = function () {
		// "poke" the request timer, i.e. make sure it knows it should make
		// a request soon

		// if we already have it going or the request queue is empty no need to do anything
		if (this.openRequests || this.requestTimer || !this.requestQueue.length) return;

		this.requestTimer = setTimeout(this.makeRequests.bind(this), LOGIN_SERVER_BATCH_TIME);
	};
	LoginServer.prototype.makeRequests = function () {
		this.requestTimer = null;
		let self = this;
		let requests = this.requestQueue;
		this.requestQueue = [];

		if (!requests.length) return;

		let requestCallbacks = [];
		for (let i = 0, len = requests.length; i < len; i++) {
			let request = requests[i];
			requestCallbacks[i] = request.callback;
			delete request.callback;
		}

		this.requestStart(requests.length);
		let postData = 'serverid=' + Config.serverid + '&servertoken=' + encodeURIComponent(Config.servertoken) + '&nocache=' + new Date().getTime() + '&json=' + encodeURIComponent(JSON.stringify(requests)) + '\n';
		let requestOptions = url.parse(this.uri + 'action.php');
		requestOptions.method = 'post';
		requestOptions.headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length
		};

		let req = null;
		let onReqError = function onReqError(error) {
			if (self.requestTimeoutTimer) {
				clearTimeout(self.requestTimeoutTimer);
				self.requestTimeoutTimer = null;
			}
			req.abort();
			for (let i = 0, len = requestCallbacks.length; i < len; i++) {
				setImmediate(requestCallbacks[i], null, null, error);
			}
			self.requestEnd();
		}.once();

		req = http.request(requestOptions, function onResponse(res) {
			if (self.requestTimeoutTimer) {
				clearTimeout(self.requestTimeoutTimer);
				self.requestTimeoutTimer = null;
			}
			let buffer = '';
			res.setEncoding('utf8');

			res.on('data', function onData(chunk) {
				buffer += chunk;
			});

			let endReq = function endRequest() {
				if (self.requestTimeoutTimer) {
					clearTimeout(self.requestTimeoutTimer);
					self.requestTimeoutTimer = null;
				}
				//console.log('RESPONSE: ' + buffer);
				let data = parseJSON(buffer).json;
				for (let i = 0, len = requestCallbacks.length; i < len; i++) {
					if (data) {
						setImmediate(requestCallbacks[i], data[i], res.statusCode);
					} else {
						setImmediate(requestCallbacks[i], null, res.statusCode, new Error("Corruption"));
					}
				}
				self.requestEnd();
			}.once();
			res.on('end', endReq);
			res.on('close', endReq);

			self.requestTimeoutTimer = setTimeout(function onDataTimeout() {
				if (res.connection) res.connection.destroy();
				endReq();
			}, LOGIN_SERVER_TIMEOUT);
		});

		req.on('error', onReqError);

		req.setTimeout(LOGIN_SERVER_TIMEOUT, function onResponseTimeout() {
			onReqError(new TimeoutError("Response not received"));
		});

		req.write(postData);
		req.end();
	};
	LoginServer.prototype.requestStart = function (size) {
		this.lastRequest = Date.now();
		this.requestLog += ' | ' + size + ' requests: ';
		this.openRequests++;
	};
	LoginServer.prototype.requestEnd = function () {
		this.openRequests = 0;
		this.requestLog += '' + (Date.now() - this.lastRequest).duration();
		this.requestLog = this.requestLog.substr(-1000);
		this.requestTimerPoke();
	};
	LoginServer.prototype.getLog = function () {
		return this.requestLog + (this.lastRequest ? ' (' + (Date.now() - this.lastRequest).duration() + ' since last request)' : '');
	};

	return LoginServer;
})();

require('fs').watchFile('./config/custom.css', function (curr, prev) {
	LoginServer.request('invalidatecss', {}, function () {});
});
LoginServer.request('invalidatecss', {}, function () {});
