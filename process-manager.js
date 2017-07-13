/**
 * Process Manager
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file abstract out multiprocess logic involved in several tasks.
 *
 * @license MIT license
 */

'use strict';

const EventEmitter = require('events');

/**
 * @type {Map<any, string>}
 */
const processManagers = new Map();

/**
 * @param {any} str
 * @return {string}
 */
function serialize(str) {
	if (typeof str === 'string') return str;
	return JSON.stringify(str);
}

class ProcessWrapper extends EventEmitter {
	/**
	 * @param {any} PM
	 */
	constructor(PM) {
		super();

		/** @type {any} */
		this.PM = PM;
		/** @type {boolean} */
		this.active = true;
		/** @type {Map<number, any>} */
		this.pendingTasks = new Map();
		/** @type {any} */
		this.process = require('child_process').fork(PM.execFile, [], {cwd: __dirname});

		// Allow events to bubble-up to the wrapper
		this.process.on('message', /** @param {string} message */ message => this.emit('message', message));
		this.on('message', PM.onMessageUpstream);
	}

	/**
	 * @param {string} data
	 */
	send(data) {
		return this.process.send(data);
	}

	release() {
		if (this.load || this.active) return;
		this.PM = null;
		this.removeAllListeners('message');
		this.process.disconnect();
	}

	/**
	 * @return {number}
	 */
	get load() {
		return this.pendingTasks.size;
	}
}

/**
 * @typedef {Object} PMOptions
 * The path to the file to spawn the child process(es) from.
 * @property {string} [execFile]
 * The maximum number of child processes to spawn.
 * @property {number} [maxProcesses]
 * Whether or not the process manager handles a chat commands module.
 * @property {boolean} [isChatBased]
 */

class ProcessManager {
	/**
	 * @param {PMOptions} options
	 */
	constructor(options) {
		if (!('execFile' in options) || !('maxProcesses' in options) || !('isChatBased' in options)) {
			throw new Error(
				"An options object given to the ProcessManager constructor is missing required properties! " +
				`The execFile given is: ${options.execFile || ''}`
			);
		}

		/** @type {ProcessWrapper[]} */
		this.processes = [];
		/** @type {number} */
		this.taskId = 0;
		/** @type {string} */
		this.execFile = '' + options.execFile;
		/** @type {number} */
		this.maxProcesses = (typeof options.maxProcesses === 'number') ? options.maxProcesses : 1;
		/** @type {boolean} */
		this.isChatBased = !!options.isChatBased;

		processManagers.set(this, options.execFile);
	}

	spawn() {
		for (let i = this.processes.length; i < this.maxProcesses; i++) {
			this.processes.push(new ProcessWrapper(this));
		}
	}

	unspawn() {
		for (let process of this.processes.splice(0)) {
			process.active = false;
			process.release();
		}
	}

	respawn() {
		this.unspawn();
		this.spawn();
	}

	/**
	 * @return {ProcessWrapper}
	 */
	acquire() {
		let process = this.processes[0];
		for (let i = 1; i < this.processes.length; i++) {
			if (this.processes[i].load < process.load) {
				process = this.processes[i];
			}
		}
		return process;
	}

	/**
	 * @param {ProcessWrapper} process
	 */
	release(process) {
		process.release();
	}

	/**
	 * @param {...any} args
	 * @return {Promise<any>}
	 */
	send(...args) {
		if (!this.processes.length) {
			return Promise.resolve(this.receive(...args));
		}

		return new Promise((resolve, reject) => {
			let process = this.acquire();
			process.pendingTasks.set(this.taskId, resolve);
			try {
				let serializedArgs = args.map(serialize).join('|');
				process.send(`${this.taskId++}|${serializedArgs}`);
			} catch (e) {}
		});
	}

	/**
	 * @param {...any} args
	 * @return {any}
	 */
	sendSync(...args) {
		// synchronously!
		return this.receive(...args);
	}

	/**
	 * @param {string} message
	 */
	onMessageUpstream(message) {
		// Expected to resolve the pending task completed.
	}

	/**
	 * @param {string} message
	 */
	onMessageDownstream(message) {
		// Expected to call `receive()` at some point,
		// and send the result to the parent process.
	}

	/**
	 * @param {...any} args
	 * @return {any}
	 */
	receive(...args) {
		// This is where the child process actually does stuff
		// To be overriden by specific implementations.
	}

	/**
	 * @return {Map<ProcessManager, string>}
	 */
	static get cache() {
		return processManagers;
	}

	/**
	 * @return {{new(PM: ProcessManager): ProcessWrapper}}
	 */
	static get ProcessWrapper() {
		return ProcessWrapper;
	}
}

module.exports = ProcessManager;
