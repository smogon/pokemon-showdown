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

class ProcessManager {
	constructor(options) {
		if (!options) options = {};

		this.processes = [];
		this.taskId = 0;

		Object.assign(this, options);
		if (typeof this.maxProcesses !== 'number') {
			this.maxProcesses = 1;
		}

		processManagers.set(this, this.execFile);
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
	send() {
		if (!this.processes.length) {
			return Promise.resolve(this.receive.apply(this, arguments));
		}

		let serializedArgs = '';
		switch (arguments.length) {
		case 0:
			break;
		case 1:
			serializedArgs = serialize(arguments[0]);
			break;
		case 2:
			serializedArgs = serialize(arguments[0]) + '|' + serialize(arguments[1]);
			break;
		default:
			let lastIndex = arguments.length - 1;
			for (let i = 0; i < lastIndex; ++i) {
				serializedArgs += serialize(arguments[i]) + '|';
			}
			serializedArgs += serialize(arguments[lastIndex]);
		}

		let process = this.acquire();
		return new Promise((resolve, reject) => {
			process.pendingTasks.set(this.taskId, resolve);
			try {
				process.process.send('' + this.taskId + '|' + serializedArgs);
			} catch (e) {}
			++this.taskId;
		});
	}
	sendSync() {
		// synchronously!
		return this.receive.apply(this, arguments);
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
module.exports = ProcessManager;

function serialize(str) {
	if (typeof str === 'string') return str;
	return JSON.stringify(str);
}
