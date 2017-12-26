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

const http = Config.loginserver.startsWith('http:') ? require("http") : require("https");
const url = require('url');

const FS = require('./lib/fs');

/**
 * A custom error type used when requests to the login server take too long.
 */
class TimeoutError extends Error {}
TimeoutError.prototype.name = TimeoutError.name;

function parseJSON(/** @type {string} */ json) {
	if (json.startsWith(']')) json = json.substr(1);
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
		/**
		 * @type {[AnyObject, (val: [AnyObject?, number, Error?]) => void][]}
		 */
		this.requestQueue = [];

		this.requestTimer = null;
		this.requestTimeoutTimer = null;
		/** @type {string} */
		this.requestLog = '';
		this.lastRequest = 0;
		this.openRequests = 0;
		this.disabled = false;
	}

	/**
	 * @param {string} action
	 * @param {AnyObject?} data
	 * @return {Promise<[AnyObject?, number, Error?]>}
	 */
	instantRequest(action, data = null) {
		if (this.openRequests > 5) {
			// @ts-ignore TypeScript bug: tuple
			return Promise.resolve([null, 0, new RangeError("Request overflow")]);
		}
		this.openRequests++;
		let dataString = '';
		if (data) {
			for (let i in data) {
				dataString += '&' + i + '=' + encodeURIComponent('' + data[i]);
			}
		}
		const urlObject = url.parse(this.uri + 'action.php?act=' + action + '&serverid=' + Config.serverid + '&servertoken=' + encodeURIComponent(Config.servertoken) + '&nocache=' + new Date().getTime() + dataString);
		return new Promise((resolve, reject) => {
			// @ts-ignore TypeScript bug: http.get signature
			let req = http.get(urlObject, res => {
				let buffer = '';
				res.setEncoding('utf8');

				res.on('data', (/** @type {string} */ chunk) => {
					buffer += chunk;
				});

				res.on('end', () => {
					let data = parseJSON(buffer).json || null;
					resolve([data, res.statusCode, null]);
					this.openRequests--;
				});
			});

			req.on('error', (/** @type {Error} */ error) => {
				resolve([null, 0, error]);
				this.openRequests--;
			});

			req.end();
		});
	}
	/**
	 * @param {string} action
	 * @param {AnyObject?} data
	 * @return {Promise<[AnyObject?, number, Error?]>}
	 */
	request(action, data = null) {
		if (this.disabled) {
			// @ts-ignore TypeScript bug: tuple
			return Promise.resolve([null, 0, new Error(`Login server connection disabled.`)]);
		}

		// ladderupdate and mmr are the most common actions
		// prepreplay is also common
		// @ts-ignore
		if (this[action + 'Server']) {
			// @ts-ignore
			return this[action + 'Server'].request(action, data);
		}

		let actionData = data || {};
		actionData.action = action;
		return new Promise(resolve => {
			this.requestQueue.push([actionData, resolve]);
			this.requestTimerPoke();
		});
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

		/** @type {((val: [AnyObject?, number, Error?]) => void)[]} */
		let resolvers = [];
		let dataList = [];
		for (const [data, resolve] of requests) {
			resolvers.push(resolve);
			dataList.push(data);
		}

		this.requestStart(requests.length);
		let postData = 'serverid=' + Config.serverid + '&servertoken=' + encodeURIComponent(Config.servertoken) + '&nocache=' + new Date().getTime() + '&json=' + encodeURIComponent(JSON.stringify(requests)) + '\n';
		let requestOptions = url.parse(this.uri + 'action.php');
		// @ts-ignore
		requestOptions.method = 'post';
		// @ts-ignore
		requestOptions.headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length,
		};

		let req = /** @type {any} */ (null);

		let hadError = false;
		let onReqError = (/** @type {Error} */ error) => {
			if (hadError) return;
			hadError = true;
			if (this.requestTimeoutTimer) {
				clearTimeout(this.requestTimeoutTimer);
				this.requestTimeoutTimer = null;
			}
			req.abort();
			for (const resolve of resolvers) {
				resolve([null, 0, error]);
			}
			this.requestEnd(error);
		};

		// @ts-ignore TypeScript bug: http.get signature
		req = http.request(requestOptions, res => {
			if (this.requestTimeoutTimer) {
				clearTimeout(this.requestTimeoutTimer);
				this.requestTimeoutTimer = null;
			}
			let buffer = '';
			res.setEncoding('utf8');

			res.on('data', (/** @type {string} */ chunk) => {
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
				for (const [i, resolve] of resolvers.entries()) {
					if (data) {
						resolve([data[i], res.statusCode, null]);
					} else {
						resolve([null, res.statusCode, new Error("Corruption")]);
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
	requestStart(/** @type {number} */ size) {
		this.lastRequest = Date.now();
		this.requestLog += ' | ' + size + ' rqs: ';
		this.openRequests++;
	}
	requestEnd(/** @type {Error?} */ error) {
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
		return this.requestLog + (this.lastRequest ? ' (' + Chat.toDurationString(Date.now() - this.lastRequest) + ' since last request)' : '');
	}
}

let LoginServer = Object.assign(new LoginServerInstance(), {
	TimeoutError,

	ladderupdateServer: new LoginServerInstance(),
	prepreplayServer: new LoginServerInstance(),
});

FS('./config/custom.css').onModify(() => {
	LoginServer.request('invalidatecss');
});
LoginServer.request('invalidatecss');

module.exports = LoginServer;
