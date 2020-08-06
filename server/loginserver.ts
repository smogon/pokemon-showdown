/**
 * Login server abstraction layer
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file handles communicating with the login server.
 *
 * @license MIT
 */

const LOGIN_SERVER_TIMEOUT = 30000;
const LOGIN_SERVER_BATCH_TIME = 1000;

import {Net} from '../lib/net';

import {FS} from '../lib/fs';

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

type LoginServerResponse = [AnyObject, null] | [null, Error];

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

	async instantRequest(action: string, data: AnyObject | null = null): Promise<LoginServerResponse> {
		if (this.openRequests > 5) {
			return Promise.resolve(
				[null, new RangeError("Request overflow")]
			);
		}
		this.openRequests++;

		try {
			const request = Net(this.uri);
			const buffer = await request.get({
				query: {
					...data,
					act: action,
					serverid: Config.serverid,
					servertoken: Config.servertoken,
					nocache: new Date().getTime(),
				},
			});
			const json = parseJSON(buffer);
			this.openRequests--;
			if (json.error) {
				return [null, new Error(json.error!)];
			}
			this.openRequests--;
			return [json.json!, null];
		} catch (error) {
			this.openRequests--;
			return [null, error];
		}
	}

	request(action: string, data: AnyObject | null = null): Promise<LoginServerResponse> {
		if (this.disabled) {
			return Promise.resolve(
				[null, new Error(`Login server connection disabled.`)]
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

		this.requestTimer = setTimeout(() => void this.makeRequests(), LOGIN_SERVER_BATCH_TIME);
	}
	async makeRequests() {
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

		try {
			const request = Net(`${this.uri}action.php`);
			let buffer = await request.post({
				body: {
					serverid: Config.serverid,
					servertoken: Config.servertoken,
					nocache: new Date().getTime(),
					json: JSON.stringify(dataList),
				},
				timeout: LOGIN_SERVER_TIMEOUT,
			});
			// console.log('RESPONSE: ' + buffer);
			const data = parseJSON(buffer).json;
			if (buffer.startsWith(`[{"actionsuccess":true,`)) {
				buffer = 'stream interrupt';
			}
			if (!data) {
				if (buffer.includes('<')) buffer = 'invalid response';
				throw new Error(buffer);
			}
			for (const [i, resolve] of resolvers.entries()) {
				resolve([data[i], null]);
			}

			this.requestEnd();
		} catch (error) {
			for (const resolve of resolvers) {
				resolve([null, error]);
			}
			this.requestEnd(error);
		}
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
	void LoginServer.request('invalidatecss');
});
if (!Config.nofswriting) {
	void LoginServer.request('invalidatecss');
}
