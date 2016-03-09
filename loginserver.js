/**
 * Login server abstraction layer
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file handles communicating with the login server.
 *
 * @license MIT license
 */

'use strict';

const LOGIN_SERVER_TIMEOUT = 30000;
const LOGIN_SERVER_BATCH_TIME = 1000;

const http = require("http");
const url = require('url');

let TimeoutError = function (message) {
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

function parseJSON(json) {
	if (json[0] === ']') json = json.substr(1);
	let data = {error: null};
	try {
		data.json = JSON.parse(json);
	} catch (err) {
		data.error = err;
	}
	return data;
}

class LoginServerInstance {
	constructor() {
		this.uri = Config.loginserver;
		this.requestQueue = [];

		this.requestTimer = null;
		this.requestTimeoutTimer = null;
		this.requestLog = '';
		this.lastRequest = 0;
		this.openRequests = 0;
	}

	instantRequest(action, data, callback) {
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
		let req = http.get(url.parse(this.uri + 'action.php?act=' + action + '&serverid=' + Config.serverid + '&servertoken=' + encodeURIComponent(Config.servertoken) + '&nocache=' + new Date().getTime() + dataString), res => {
			let buffer = '';
			res.setEncoding('utf8');

			res.on('data', chunk => {
				buffer += chunk;
			});

			res.on('end', () => {
				let data = parseJSON(buffer).json;
				setImmediate(callback, data, res.statusCode);
				this.openRequests--;
			});
		});

		req.on('error', error => {
			setImmediate(callback, null, null, error);
			this.openRequests--;
		});

		req.end();
	}
	request(action, data, callback) {
		// ladderupdate and mmr are the most common actions
		// prepreplay is also common
		if (this[action + 'Server']) {
			return this[action + 'Server'].request(action, data, callback);
		}
		if (typeof data === 'function') {
			callback = data;
			data = null;
		}
		if (typeof callback === 'undefined') callback = () => {};
		if (this.disabled) {
			setImmediate(callback, null, null, new Error("Ladder disabled"));
			return;
		}
		if (!data) data = {};
		data.act = action;
		data.callback = callback;
		this.requestQueue.push(data);
		this.requestTimerPoke();
	}
	requestTimerPoke() {
		// "poke" the request timer, i.e. make sure it knows it should make
		// a request soon

		// if we already have it going or the request queue is empty no need to do anything
		if (this.openRequests || this.requestTimer || !this.requestQueue.length) return;

		this.requestTimer = setTimeout(() => this.makeRequests(), LOGIN_SERVER_BATCH_TIME);
	}
	makeRequests() {
		this.requestTimer = null;
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
			'Content-Length': postData.length,
		};

		let req = null;

		let hadError = false;
		let onReqError = error => {
			if (hadError) return;
			hadError = true;
			if (this.requestTimeoutTimer) {
				clearTimeout(this.requestTimeoutTimer);
				this.requestTimeoutTimer = null;
			}
			req.abort();
			for (let i = 0, len = requestCallbacks.length; i < len; i++) {
				setImmediate(requestCallbacks[i], null, null, error);
			}
			this.requestEnd(error);
		};

		req = http.request(requestOptions, res => {
			if (this.requestTimeoutTimer) {
				clearTimeout(this.requestTimeoutTimer);
				this.requestTimeoutTimer = null;
			}
			let buffer = '';
			res.setEncoding('utf8');

			res.on('data', chunk => {
				buffer += chunk;
			});

			let requestEnded = false;
			let endReq = () => {
				if (requestEnded) return;
				requestEnded = true;
				if (this.requestTimeoutTimer) {
					clearTimeout(this.requestTimeoutTimer);
					this.requestTimeoutTimer = null;
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
				this.requestEnd();
			};
			res.on('end', endReq);
			res.on('close', endReq);

			this.requestTimeoutTimer = setTimeout(() => {
				if (res.connection) res.connection.destroy();
				endReq();
			}, LOGIN_SERVER_TIMEOUT);
		});

		req.on('error', onReqError);

		req.setTimeout(LOGIN_SERVER_TIMEOUT, () => {
			onReqError(new TimeoutError("Response not received"));
		});

		req.write(postData);
		req.end();
	}
	requestStart(size) {
		this.lastRequest = Date.now();
		this.requestLog += ' | ' + size + ' rqs: ';
		this.openRequests++;
	}
	requestEnd(error) {
		this.openRequests = 0;
		if (error && error instanceof TimeoutError) {
			this.requestLog += 'TIMEOUT';
		} else {
			this.requestLog += '' + ((Date.now() - this.lastRequest) / 1000) + 's';
		}
		this.requestLog = this.requestLog.substr(-1000);
		this.requestTimerPoke();
	}
	getLog() {
		return this.requestLog + (this.lastRequest ? ' (' + Tools.toDurationString(Date.now() - this.lastRequest) + ' since last request)' : '');
	}
}

let LoginServer = module.exports = new LoginServerInstance();

LoginServer.TimeoutError = TimeoutError;

if (Config.remoteladder) LoginServer.ladderupdateServer = new LoginServerInstance();
LoginServer.prepreplayServer = new LoginServerInstance();

require('fs').watchFile('./config/custom.css', (curr, prev) => {
	LoginServer.request('invalidatecss', {}, () => {});
});
LoginServer.request('invalidatecss', {}, () => {});
