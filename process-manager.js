/**
 * Process Manager
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file abstract out multiprocess logic involved in several tasks.
 *
 * @license MIT license
 */

'use strict';

const child_process = require('child_process');
const EventEmitter = require('events');

/** @type {Map<any, string>} */
const processManagers = new Map();

/**
 * @param {any} str
 * @return {string}
 */
function serialize(str) {
	if (typeof str === 'string') return str;
	return JSON.stringify(str);
}

/**
 * @class ProcessWrapper
 * @extends NodeJS.EventEmitter
 * @property {boolean} active
 * @property {Map<number, any>} pendingTasks
 * @property {any} process
 */
class ProcessWrapper extends EventEmitter {
	/** @param {string} execFile */
	constructor(execFile) {
		super();

		this.active = true;
		this.pendingTasks = new Map();
		this.process = child_process.fork(execFile, [], {
			cwd: __dirname,
			env: {PS_MANAGED_PROCESS: 1},
		});

		// Allow events to bubble up to the wrapper.
		this.process.on('message', message => this.emit('message', message));
		this.process.once('disconnect', () => this.emit('disconnect'));
	}

	/**
	 * @param {string} data
	 * @return {boolean}
	 */
	send(data) {
		if (!this.active || !this.connected) return false;
		return this.process.send(data);
	}

	/** @return {boolean} */
	release() {
		if (this.active || this.load || !this.connected) return false;
		this.process.disconnect();
		return true;
	}

	/** @return {boolean} */
	get connected() {
		return this.process.connected;
	}

	/** @return {number} */
	get load() {
		return this.pendingTasks.size;
	}
}

/**
 * @typedef {Object} PMOptions
 * The path to the module that child process(es) should be forked from.
 * @property {string} [execFile]
 * The maximum number of child processes to spawn.
 * @property {number} [maxProcesses]
 * Whether or not this manages a chat-commands module.
 * @property {boolean} [isChatBased]
 */

/**
 * @class ProcessManager
 * @property {Set<ProcessWrapper>} processes
 * @property {number} taskid
 * @property {string} execFile
 * @property {number} maxProcesses
 * @property {boolean} isChatBased
 */
class ProcessManager {
	/** @param {PMOptions} options */
	constructor(options) {
		if (!('execFile' in options) || !('maxProcesses' in options) || !('isChatBased' in options)) {
			throw new Error(
				"An options object given to the ProcessManager constructor is missing required properties! " +
				`The filename given is: ${options.execFile}`
			);
		}

		this.processes = new Set();
		this.taskid = 0;
		this.execFile = '' + options.execFile;
		this.maxProcesses = +options.maxProcesses || 1;
		this.isChatBased = !!options.isChatBased;

		new.target.cache.set(this, this.execFile);

		// @ts-ignore
		let isParentProcess = !(+process.env.PS_MANAGED_PROCESS);
		if (isParentProcess) {
			process.nextTick(() => this.spawn());
			// @ts-ignore
		} else if (process.mainModule.filename === this.execFile) {
			process.nextTick(() => this.onFork());
		}
	}

	/**
	 * Defines any missing global variables, sets up crash logging, etc.
	 * Child processes call this after being spawned.
	 */
	onFork() {}

	spawn() {
		for (let i = this.processes.size; i < this.maxProcesses; i++) {
			let PW = new ProcessWrapper(this.execFile);
			PW.on('message', this.onMessageUpstream);
			this.processes.add(PW);
		}
	}

	unspawn() {
		if (!this.processes.size) return;

		for (let PW of this.processes) {
			PW.active = false;
			PW.removeAllListeners('message');
			PW.release();
		}

		this.processes.clear();
	}

	respawn() {
		this.unspawn();
		this.spawn();
	}

	/** @return {?ProcessWrapper} */
	acquire() {
		if (!this.processes.size) return null;

		let ret = null;
		for (let PW of this.processes) {
			if (!ret || PW.load < ret.load) {
				ret = PW;
				if (!PW.load) break;
			}
		}

		return ret;
	}

	/**
	 * @param {...any} args
	 * @return {Promise<any>}
	 */
	send(...args) {
		return new Promise((resolve, reject) => {
			let PW = this.acquire();
			if (PW) {
				let taskid = this.taskid++;
				let serializedArgs = args.map(serialize).join('|');
				PW.pendingTasks.set(taskid, resolve);
				PW.send(`${taskid}|${serializedArgs}`);
			} else {
				resolve(this.receive(...args));
			}
		});
	}

	/**
	 * @param {...any} args
	 * @return {any}
	 */
	sendSync(...args) {
		return this.receive(...args);
	}

	/**
	 * Resolves a pending task with its result. This uses ProcessWrapper's
	 * context.
	 *
	 * @param {string} message
	 */
	onMessageUpstream(message) {}

	/**
	 * Parses a message sent by the parent process, passes it to
	 * ProcessManager#receive, and sends back the result.
	 *
	 * @param {string} message
	 */
	onMessageDownstream(message) {}

	/**
	 * Handles processing data sent by the parent process, returning the result.
	 *
	 * @param {...any} args
	 * @return {any}
	 */
	receive(...args) {}

	/** @return {Map<ProcessManager, string>} */
	static get cache() {
		return processManagers;
	}

	/** @return {{new(execFile: string): ProcessWrapper}} */
	static get ProcessWrapper() {
		return ProcessWrapper;
	}
}

module.exports = ProcessManager;
