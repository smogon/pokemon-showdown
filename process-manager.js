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

const processManagers = new Map();

function serialize(str) {
	if (typeof str === 'string') return str;
	return JSON.stringify(str);
}

class ProcessWrapper extends EventEmitter {
	constructor(PM) {
		super();

		this.PM = PM;
		this.active = true;
		this.pendingTasks = new Map();
		this.process = require('child_process').fork(PM.execFile, {cwd: __dirname});

		// Allow events to bubble-up to the wrapper
		this.process.on('message', message => this.emit('message', message));

		this.on('message', PM.onMessageUpstream);
	}

	send(data) {
		return this.process.send(data);
	}

	release() {
		if (this.load || this.active) return;
		this.process.disconnect();
	}

	get load() {
		return this.pendingTasks.size;
	}
}

// execFile - the path to the file to spawn the child process(es) from
// maxProcesses - the maximum number of child processes to spawn
// isChatBased - the process manager handles some chat functionality
class ProcessManager {
	constructor(options) {
		if (!('execFile' in options)) {
			Monitor.debug(
				"No execFile property was missing form the options object to be " +
				"given to the ProcessManager constructor!"
			);
		} else if (!('maxProcesses' in options) || !('isChatBased' in options)) {
			Monitor.debug(
				"An options object given to the ProcessManager constructor is " +
				"missing required properties! The filename given is: " + (options.execFile || '""') + "."
			);
		}

		this.processes = [];
		this.taskId = 0;
		this.execFile = options.execFile;
		this.maxProcesses = (typeof options.maxProcesses === 'number') ? options.maxProcesses : 1;
		this.isChatBased = !!options.isChatBased;

		processManagers.set(this, options.execFile);
	}

	spawn() {
		for (let i = this.processes.length; i < this.maxProcesses; ++i) {
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

	acquire() {
		let process = this.processes[0];
		for (let i = 1; i < this.processes.length; ++i) {
			if (this.processes[i].load < process.load) {
				process = this.processes[i];
			}
		}
		return process;
	}

	release(process) {
		process.release();
	}

	send(...args) {
		if (!this.processes.length) {
			return Promise.resolve(this.receive.apply(this, args));
		}

		let serializedArgs = args.map(serialize).join('|');
		return new Promise((resolve, reject) => {
			let process = this.acquire();
			process.pendingTasks.set(this.taskId, resolve);
			try {
				process.process.send(`${this.taskId}|${serializedArgs}`);
			} catch (e) {}
			++this.taskId;
		});
	}

	sendSync(...args) {
		// synchronously!
		return this.receive.apply(this, args);
	}

	onMessageUpstream() {
		// Expected to resolve the pending task completed.
	}

	onMessageDownstream() {
		// Expected to call `receive()` at some point,
		// and send the result to the parent process.
	}

	receive() {
		// This is where the child process actually does stuff
		// To be overriden by specific implementations.
		return '';
	}
}

ProcessManager.cache = processManagers;
ProcessManager.ProcessWrapper = ProcessWrapper;
module.exports = ProcessManager;
