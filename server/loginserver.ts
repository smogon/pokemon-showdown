/**
 * Login server abstraction layer
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file handles communicating with the login server.
 *
 * @license MIT
 */

'use strict';

const LOGIN_SERVER_TIMEOUT = 30000;
const LOGIN_SERVER_BATCH_TIME = 1000;

// tslint:disable-next-line no-var-requires
const http = Config.loginserver.startsWith('http:') ? require('http') : require('https');
import * as url from 'url';

import {FS} from '../lib/fs';
import * as Streams from '../lib/streams';

/**
 * A custom error type used when requests to the login server take too long.
 */
class TimeoutError extends Error {}
TimeoutError.prototype.name = TimeoutError.name;

function parseJSON(json: string) {
	if (json.startsWith(']')) json = json.substr(1);
	const data = {error: null, json: null};
	try {
		data.json = JSON.parse(json);
	} catch (err) {
		data.error = err;
	}
	return data;
}

type LoginServerResponse = [AnyObject | null, number, Error | null];

interface IncomingMessage extends NodeJS.ReadableStream {
	statusCode: number;
}

class LoginServerInstance {
	readonly uri: string;
	requestQueue: [AnyObject, (val: LoginServerResponse) => void][];
	requestTimer: NodeJS.Timer | null;
	requestLog: string;
	lastRequest: number;
	openRequests: number;
	disabled: false;

	constructor() {
		this.uri = Config.loginserver;
		this.requestQueue = [];
		this.requestTimer = null;
		this.requestLog = '';
		this.lastRequest = 0;
		this.openRequests = 0;
		this.disabled = false;
	}

	instantRequest(action: string, data: AnyObject | null = null): Promise<LoginServerResponse> {
		if (this.openRequests > 5) {
			return Promise.resolve(
				[null, 0, new RangeError("Request overflow")]
			);
		}
		this.openRequests++;
		let dataString = '';
		if (data) {
			for (const i in data) {
				dataString += '&' + i + '=' + encodeURIComponent('' + data[i]);
			}
		}

		const actionUrl = url.parse(this.uri + 'action.php' +
			'?act=' + action + '&serverid=' + Config.serverid +
			'&servertoken=' + encodeURIComponent(Config.servertoken) +
			'&nocache=' + new Date().getTime() + dataString);

		return new Promise((resolve, reject) => {

			const req = http.get(actionUrl, (res: IncomingMessage) => {
				// tslint:disable-next-line no-floating-promises
				Streams.readAll(res).then((buffer: string) => {
					const result = parseJSON(buffer).json || null;
					resolve([result, res.statusCode || 0, null]);
					this.openRequests--;
				});
			});

			req.on('error', (error: Error) => {
				resolve([null, 0, error]);
				this.openRequests--;
			});

			req.end();
		});
	}

	request(action: string, data: AnyObject | null = null): Promise<LoginServerResponse> {
		if (this.disabled) {
			return Promise.resolve(
				[null, 0, new Error(`Login server connection disabled.`)]
			);
		}

		// ladderupdate and mmr are the most common actions
		// prepreplay is also common
		// @ts-ignore
		if (this[action + 'Server']) {
			// @ts-ignore
			return this[action + 'Server'].request(action, data);
		}

		const actionData = data || {};
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
		const requests = this.requestQueue;
		this.requestQueue = [];

		if (!requests.length) return;

		const resolvers: ((val: LoginServerResponse) => void)[] = [];
		const dataList = [];
		for (const [data, resolve] of requests) {
			resolvers.push(resolve);
			dataList.push(data);
		}

		this.requestStart(requests.length);
		const postData = 'serverid=' + Config.serverid +
			'&servertoken=' + encodeURIComponent(Config.servertoken) +
			'&nocache=' + new Date().getTime() +
			'&json=' + encodeURIComponent(JSON.stringify(dataList)) + '\n';

		const requestOptions: AnyObject = url.parse(`${this.uri}action.php`);
		requestOptions.method = 'post';
		requestOptions.headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length,
		};

		let response: AnyObject | null =  null;

		const req = http.request(requestOptions, (res: IncomingMessage) => {
			response = res;
			// tslint:disable-next-line no-floating-promises
			Streams.readAll(res).then((buffer: string) => {
				// console.log('RESPONSE: ' + buffer);
				const data = parseJSON(buffer).json;
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

		req.on('error', (error: Error) => {
			// ignore; will be handled by the 'close' handler
		});

		req.setTimeout(LOGIN_SERVER_TIMEOUT, () => {
			req.abort();
		});

		req.write(postData);
		req.end();
	}
	requestStart(size: number) {
		this.lastRequest = Date.now();
		this.requestLog += ' | ' + size + ' rqs: ';
		this.openRequests++;
	}
	requestEnd(error?: Error) {
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
		if (!this.lastRequest) return this.requestLog;
		return `${this.requestLog} (${Chat.toDurationString(Date.now() - this.lastRequest)} since last request)`;
	}
}

export const LoginServer = Object.assign(new LoginServerInstance(), {
	TimeoutError,

	ladderupdateServer: new LoginServerInstance(),
	prepreplayServer: new LoginServerInstance(),
});

FS('./config/custom.css').onModify(() => {
	// tslint:disable-next-line no-floating-promises
	LoginServer.request('invalidatecss');
});
if (!Config.nofswriting) {
	// tslint:disable-next-line no-floating-promises
	LoginServer.request('invalidatecss');
}
