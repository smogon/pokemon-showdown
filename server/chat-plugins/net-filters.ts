/**
 * Neural net chatfilters.
 * These are in a separate file so that they don't crash the other filters.
 * (issues with globals, etc)
 * by Mia.
 * @author mia-pi-git
 */

import {QueryProcessManager} from '../../lib/process-manager';
import {FS} from '../../lib/fs';
import {Utils} from '../../lib/utils';
import {Config} from '../config-loader';
import {Repl} from '../../lib/repl';

const PATH = "config/chat-plugins/net.json";
const NUM_PROCESSES = Config.netfilterprocesses || 1;
const PM_TIMEOUT = 2 * 60 * 60 * 1000; // training can be _really_ slow
const WHITELIST = ["mia"];

interface NetQuery {
	data: string | TrainingLine[];
	type: "run" | "train" | "save" | "load";
	options?: AnyObject;
}

interface TrainingLine {
	input: string;
	// "|flag" (bad) "|ok" (good)
	output: string;
}

function modelExists() {
	try {
		require.resolve('brain.js');
	} catch (e) {
		return false;
	}
	return true;
}

export class NeuralNetChecker {
	model: import('brain.js').recurrent.LSTM | null;
	constructor(path?: string) {
		try {
			this.model = new (require('brain.js').recurrent.LSTM)();
		} catch (e) {
			this.model = null;
		}
		if (path) this.load(path);
	}
	async train(data: TrainingLine[], iterations?: number) {
		// 100 has good perf but is still effective
		if (!iterations) iterations = 100;
		const now = Date.now();
		if (FS(PATH).existsSync()) await FS(PATH).copyFile(PATH + '.backup');
		if (!this.model) throw new Error(`Attempting to train with no model installed`);
		this.model.train(data, {iterations});
		this.save();
		return Date.now() - now; // time data is helpful for training
	}
	save(path = PATH) {
		if (!this.model) return {};
		const state = this.model.toJSON();
		FS(path).writeUpdate(() => JSON.stringify(state));
		return state;
	}
	load(path: string) {
		if (!FS(path).existsSync()) return;
		const data = JSON.parse(FS(path).readSync());
		this.model?.fromJSON(data);
	}
	run(data: string) {
		let result = '';
		if (!this.model) return result;
		try {
			result = this.model.run(data);
		} catch (e) {}
		// usually means someone didn't train it, carry on
		// acceptable to drop since training is very slow
		return result;
	}
	static async train(data: TrainingLine[]) {
		// do the training in its own process
		const result = await PM.queryTemporaryProcess({type: 'train', data});
		// load it into the main process that we're querying
		for (const sub of PM.processes) {
			await sub.query({type: 'load', data: PATH});
		}
		return result;
	}
}

function checkAllowed(context: CommandContext) {
	if (!modelExists()) throw new Chat.ErrorMessage(`Net filters are disabled - install brain.js to use them.`);
	const user = context.user;
	if (WHITELIST.includes(user.id)) return true;
	return context.canUseConsole();
}

export let net: NeuralNetChecker | null = null;
export let disabled = false;

export const hits: {[roomid: string]: {[userid: string]: number}} = (() => {
	const cache = Object.create(null);
	if (global.Chat) {
		if (Chat.plugins['net-filters']?.hits) {
			Object.assign(cache, Chat.plugins['net-filters'].hits);
		}
	}
	return cache;
})();

export const chatfilter: ChatFilter = function (message, user, room, connection) {
	if (disabled || !modelExists()) return;
	// not awaited as so to not hold up the filters (additionally we can wait on this)
	void (async () => {
		if (!room || room.persist || room.roomid.startsWith('help-')) return;
		const result = await PM.query({type: "run", data: message});
		if (result?.endsWith("|flag")) {
			if (!hits[room.roomid]) hits[room.roomid] = {};
			if (!hits[room.roomid][user.id]) hits[room.roomid][user.id] = 0;
			hits[room.roomid][user.id]++;
			const minCount = Config.netfilterlimit || 20;
			if (hits[room.roomid][user.id] >= minCount) {
				Rooms.get('upperstaff')?.add(
					`|c|&|/log [ERPMonitor] Suspicious messages detected in <<${room.roomid}>>`
				).update();
				hits[room.roomid][user.id] = 0; // so they can't spam messages
				if ('uploadReplay' in (room as GameRoom)) {
					void (room as GameRoom).uploadReplay(user, connection, "silent");
				}
			}
		}
	})();
	return undefined;
};

export const PM = new QueryProcessManager<NetQuery, any>(module, query => {
	if (!net) throw new Error("Neural net not intialized");
	const {data, type, options} = query;
	switch (type) {
	case 'run':
		let response = '';
		try {
			response = net.run(data as string);
		} catch (e) {} // uninitialized (usually means intializing, which can be slow) - drop it for now
		return response;
	case 'train':
		return net.train(data as TrainingLine[], options?.iterations);
	case 'save':
		return net.save();
	case 'load':
		try {
			net.load(data as string);
		} catch (e) {
			return e.message;
		}
		return 'success';
	}
}, PM_TIMEOUT);

if (!PM.isParentProcess) {
	global.Config = Config;

	global.Monitor = {
		crashlog(error: Error, source = 'A netfilter process', details: AnyObject | null = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			process.send!(`THROW\n@!!@${repr}\n${error.stack}`);
		},
	};
	process.on('uncaughtException', err => {
		if (Config.crashguard) {
			Monitor.crashlog(err, 'A net filter child process');
		}
	});
	// we only want to spawn one network, when it's the subprocess
	// otherwise, we use the PM for interfacing with the network
	net = new NeuralNetChecker(PATH);
	// eslint-disable-next-line no-eval
	Repl.start('netfilters', cmd => eval(cmd));
} else {
	PM.spawn(NUM_PROCESSES);
}

export const commands: ChatCommands = {
	netfilter: {
		limit(target, room, user) {
			checkAllowed(this);
			const int = parseInt(target);
			if (isNaN(int)) {
				return this.errorReply("Invalid number");
			}
			if (int < 20) {
				return this.errorReply("Too low.");
			}
			Config.netfilterlimit = int;
			this.privateGlobalModAction(`${user.name} temporarily set the net filter trigger limit to ${int}`);
			this.globalModlog(`NETFILTER LIMIT`, null, int.toString());
		},
		async train(target, room, user) {
			checkAllowed(this);
			const data: TrainingLine[] = [];
			const parts = target.split('\n').filter(Boolean);
			for (const line of parts) {
				const [input, output] = Utils.splitFirst(line, '|');
				if (!['ok', 'flag'].some(i => output === i)) {
					return this.errorReply(`Malformed line: ${line} - output must be 'ok' or 'flag'.`);
				}
				if (!input.trim()) {
					return this.errorReply(`Malformed line: ${line} - input must be a string`);
				}
				data.push({input, output: `|${output}`});
			}
			if (!data.length) {
				return this.errorReply(`You need to provide some sort of data`);
			}
			this.sendReply(`Initiating training...`);
			const results = await NeuralNetChecker.train(data.filter(Boolean));
			this.sendReply(`Training completed in ${Chat.toDurationString(results)}`);
			this.privateGlobalModAction(`${user.name} trained the net filters on ${Chat.count(data.length, 'lines')}`);
			this.stafflog(`${data.map(i => `(lines: '${i.input}' => '${i.output}'`).join('; ')})`);
		},
		async rollback(target, room, user) {
			checkAllowed(this);
			const backup = FS(PATH + '.backup');
			if (!backup.existsSync()) return this.errorReply(`No backup exists.`);
			await backup.copyFile(PATH);
			const result = await PM.query({type: "load", data: PATH});
			if (result && result !== 'success') {
				return this.errorReply(`Rollback failed: ${result}`);
			}
			this.privateGlobalModAction(`${user.name} rolled the net filters back to last backup`);
		},
		async test(target, room, user) {
			checkAllowed(this);
			const result = await PM.query({type: 'run', data: target});
			return this.sendReply(`Result for '${target}': ${result}`);
		},
		enable: 'disable',
		disable(target, room, user, connection, cmd) {
			checkAllowed(this);
			let logMessage;
			if (cmd === 'disable') {
				if (disabled) return this.errorReply(`Net filters are already disabled.`);
				disabled = true;
				this.globalModlog(`NETFILTER DISABLE`, null);
				logMessage = `${user.name} disabled the net filters`;
			} else {
				if (!disabled) return this.errorReply(`The net filters are already enabled`);
				disabled = false;
				this.globalModlog(`NETFILTER ENABLE`, null);
				logMessage = `${user.name} enabled the net filters`;
			}
			this.privateGlobalModAction(logMessage);
		},
	},
};

if (global.Chat) {
	process.nextTick(() => Chat.multiLinePattern.register('/netfilter train '));
}
