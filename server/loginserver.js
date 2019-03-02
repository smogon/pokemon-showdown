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

/** @type {typeof import('../lib/fs').FS} */
const FS = require(/** @type {any} */('../.lib-dist/fs')).FS;
/** @type {typeof import('../lib/streams')} */
const Streams = require(/** @type {any} */('../.lib-dist/streams'));

/**
 * A custom error type used when requests to the login server take too long.
 */
class TimeoutError extends Error {}
TimeoutError.prototype.name = TimeoutError.name;

function parseJSON(/** @type {string} */ json) {
	if (json.startsWith(']')) json = json.substr(1);
	/**@type {{error: Error | null, json?: any}} */
	let data = {error: null};
	try {
		data.json = JSON.parse(json);
	} catch (err) {
		data.error = err;
	}
	return data;
}

/** @typedef {[AnyObject?, number, Error?]} LoginServerResponse */

class LoginServerInstance {
	constructor() {
		this.uri = Config.loginserver;
		/**
		 * @type {[AnyObject, (val: LoginServerResponse) => void][]}
		 */
		this.requestQueue = [];

		this.requestTimer = null;
		/** @type {string} */
		this.requestLog = '';
		this.lastRequest = 0;
		this.openRequests = 0;
		this.disabled = false;
	}

	/**
	 * @param {string} action
	 * @param {AnyObject?} data
	 * @return {Promise<LoginServerResponse>}
	 */
	instantRequest(action, data = null) {
		if (this.openRequests > 5) {
			return Promise.resolve(/** @type {LoginServerResponse} */ (
				[null, 0, new RangeError("Request overflow")]
			));
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
				Streams.readAll(res).then(buffer => {
					let data = parseJSON(buffer).json || null;
					resolve([data, res.statusCode || 0, null]);
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
	 * @return {Promise<LoginServerResponse>}
	 */
	request(action, data = null) {
		if (this.disabled) {
			return Promise.resolve(/** @type {LoginServerResponse} */ (
				[null, 0, new Error(`Login server connection disabled.`)]
			));
		}

		// ladderupdate and mmr are the most common actions
		// prepreplay is also common
		// @ts-ignore
		if (this[action + 'Server']) {
			// @ts-ignore
			return this[action + 'Server'].request(action, data);
		}

		let actionData = data || {};
		actionData.act = action;
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

		/** @type {((val: LoginServerResponse) => void)[]} */
		let resolvers = [];
		let dataList = [];
		for (const [data, resolve] of requests) {
			resolvers.push(resolve);
			dataList.push(data);
		}

		this.requestStart(requests.length);
		let postData = 'serverid=' + Config.serverid +
			'&servertoken=' + encodeURIComponent(Config.servertoken) +
			'&nocache=' + new Date().getTime() +
			'&json=' + encodeURIComponent(JSON.stringify(dataList)) + '\n';
		/** @type {any} */
		let requestOptions = url.parse(this.uri + 'action.php');
		requestOptions.method = 'post';
		requestOptions.headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length,
		};

		/** @type {any} */
		let response = null;
		// @ts-ignore
		let req = http.request(requestOptions, res => {
			response = res;
			Streams.readAll(res).then(buffer => {
				//console.log('RESPONSE: ' + buffer);
				let data = parseJSON(buffer).json;
				if (buffer.startsWith(`[{"actionsuccess":true,`)) {
					buffer = 'stream interrupt';
				}
				for (const [i, resolve] of resolvers.entries()) {
					if (data) {
						resolve([data[i], res.statusCode || 0, null]);
					} else {
						if (buffer.includes('<')) buffer = 'invalid response';
						resolve([null, res.statusCode || 0, new Error(buffer)]);
					}
				}
				this.requestEnd();
			});
		});

		req.on('close', () => {
			if (response) return;
			const error = new TimeoutError("Response not received");
			for (const resolve of resolvers) {
				resolve([null, 0, error]);
			}
			this.requestEnd(error);
		});

		req.on('error', (/** @type {Error} */ error) => {
			// ignore; will be handled by the 'close' handler
		});

		req.setTimeout(LOGIN_SERVER_TIMEOUT, () => {
			req.abort();
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
if (!Config.nofswriting) {
	LoginServer.request('invalidatecss');
}

module.exports = LoginServer;
