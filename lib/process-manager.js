/**
 * Process Manager
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file abstract out multiprocess logic involved in several tasks.
 *
 * Child processes can be queried.
 *
 * @license MIT
 */

'use strict';

const path = require('path');
const child_process = require('child_process');
const Streams = require('./streams');
const ROOT_DIR = path.resolve(__dirname, '..');

class SubprocessStream extends Streams.ObjectReadWriteStream {
	/**
	 * @param {ChildProcess} process
	 * @param {number} taskId
	 */
	constructor(process, taskId) {
		super();
		this.process = process;
		this.taskId = taskId;
		this.process.send(`${taskId}\nNEW`);
	}
	_write(/** @type {string} */ message) {
		this.process.send(`${this.taskId}\nWRITE\n${message}`);
		// responses are handled in ProcessWrapper
	}
	_destroy() {
		this.process.send(`${this.taskId}\nDESTROY`);
	}
}

/**
 * @typedef {Object} ProcessWrapper
 * @property {number} load
 * @property {() => Promise<void>} release
 */

/**
 * Wraps the process object in the PARENT process
 */
class QueryProcessWrapper {
	constructor(/** @type {string} */ file) {
		this.process = child_process.fork(file, [], {cwd: ROOT_DIR});
		this.taskId = 0;
		/** @type {Map<number, (resp: string) => void>} */
		this.pendingTasks = new Map();
		/** @type {Promise<void>?} */
		this.pendingRelease = null;
		/** @type {(() => void)?} */
		this.resolveRelease = null;

		this.process.on('message', /** @param {string} message */ message => {
			const nlLoc = message.indexOf('\n');
			if (nlLoc <= 0) throw new Error(`Invalid response ${message}`);
			const taskId = parseInt(message.slice(0, nlLoc));
			const resolve = this.pendingTasks.get(taskId);
			if (!resolve) throw new Error(`Invalid taskId ${message.slice(0, nlLoc)}`);
			this.pendingTasks.delete(taskId);
			resolve(JSON.parse(message.slice(nlLoc + 1)));

			if (this.resolveRelease && !this.load) this.destroy();
		});
	}

	get load() {
		return this.pendingTasks.size;
	}

	/**
	 * @param {any} input
	 * @return {Promise<any>}
	 */
	query(input) {
		this.taskId++;
		const taskId = this.taskId;
		this.process.send(`${taskId}\n${JSON.stringify(input)}`);
		return new Promise(resolve => {
			this.pendingTasks.set(taskId, resolve);
		});
	}

	/**
	 * @return {Promise<void>}
	 */
	release() {
		if (this.pendingRelease) return this.pendingRelease;
		if (!this.load) {
			this.destroy();
		} else {
			this.pendingRelease = new Promise(resolve => {
				this.resolveRelease = resolve;
			});
		}
		return /** @type {Promise<void>} */ (this.pendingRelease);
	}

	destroy() {
		if (this.pendingRelease && !this.resolveRelease) {
			// already destroyed
			return;
		}
		this.process.disconnect();
		for (const resolver of this.pendingTasks.values()) {
			// maybe we should track reject functions too...
			resolver('');
		}
		this.pendingTasks.clear();
		if (this.resolveRelease) {
			this.resolveRelease();
			this.resolveRelease = null;
		} else if (!this.pendingRelease) {
			this.pendingRelease = Promise.resolve();
		}
	}
}

/**
 * Wraps the process object in the PARENT process
 */
class StreamProcessWrapper {
	constructor(/** @type {string} */ file) {
		this.process = child_process.fork(file, [], {cwd: ROOT_DIR});
		this.taskId = 0;
		/** @type {Map<number, SubprocessStream>} */
		this.activeStreams = new Map();
		/** @type {Promise<void>?} */
		this.pendingRelease = null;
		/** @type {(() => void)?} */
		this.resolveRelease = null;

		this.process.on('message', /** @param {string} message */ message => {
			let nlLoc = message.indexOf('\n');
			if (nlLoc <= 0) throw new Error(`Invalid response ${message}`);
			const taskId = parseInt(message.slice(0, nlLoc));
			const stream = this.activeStreams.get(taskId);
			if (!stream) throw new Error(`Invalid taskId ${message.slice(0, nlLoc)}`);

			message = message.slice(nlLoc + 1);
			nlLoc = message.indexOf('\n');
			if (nlLoc < 0) nlLoc = message.length;
			const messageType = message.slice(0, nlLoc);
			message = message.slice(nlLoc + 1);

			if (messageType === 'END') {
				stream.end();
				this.deleteStream(taskId);
			} else if (messageType === 'PUSH') {
				stream.push(message);
			} else {
				throw new Error(`Unrecognized messageType ${messageType}`);
			}
		});
	}

	deleteStream(/** @type {number} */ taskId) {
		this.activeStreams.delete(taskId);
		// try to release
		if (this.resolveRelease && !this.load) this.destroy();
	}

	get load() {
		return this.activeStreams.size;
	}

	/**
	 * @return {SubprocessStream}
	 */
	createStream() {
		this.taskId++;
		const taskId = this.taskId;
		const stream = new SubprocessStream(this.process, taskId);
		this.activeStreams.set(taskId, stream);
		return stream;
	}

	/**
	 * @return {Promise<void>}
	 */
	release() {
		if (this.pendingRelease) return this.pendingRelease;
		if (!this.load) {
			this.destroy();
		} else {
			this.pendingRelease = new Promise(resolve => {
				this.resolveRelease = resolve;
			});
		}
		return /** @type {Promise<void>} */ (this.pendingRelease);
	}

	destroy() {
		if (this.pendingRelease && !this.resolveRelease) {
			// already destroyed
			return;
		}
		this.process.disconnect();
		for (const stream of this.activeStreams.values()) {
			stream.destroy();
		}
		this.activeStreams.clear();
		if (this.resolveRelease) {
			this.resolveRelease();
			this.resolveRelease = null;
		} else if (!this.pendingRelease) {
			this.pendingRelease = Promise.resolve();
		}
	}
}

/**
 * A ProcessManager wraps a query function: A function that takes a
 * string and returns a string or Promise<string>.
 */
class ProcessManager {
	/**
	 * @param {module} module
	 */
	constructor(module) {
		/** @type {ProcessWrapper[]} */
		this.processes = [];
		/** @type {ProcessWrapper[]} */
		this.releasingProcesses = [];
		this.module = module;
		this.filename = module.filename;
		this.basename = path.basename(module.filename);

		this.isParentProcess = (process.mainModule !== module || !process.send);

		this.listen();
	}
	acquire() {
		if (!this.processes.length) {
			return null;
		}
		let lowestLoad = this.processes[0];
		for (const process of this.processes) {
			if (process.load < lowestLoad.load) {
				lowestLoad = process;
			}
		}
		return lowestLoad;
	}
	unspawn() {
		for (const process of this.processes) {
			process.release().then(() => {
				const index = this.releasingProcesses.indexOf(process);
				if (index >= 0) {
					this.releasingProcesses.splice(index, 1);
				}
			});
		}
		this.releasingProcesses = this.releasingProcesses.concat(this.processes);
		this.processes = [];
	}
	spawn(count = 1) {
		if (!this.isParentProcess) return;
		if (PMLib.disabled) return;
		while (this.processes.length < count) {
			this.processes.push(this.createProcess());
		}
	}
	respawn(/** @type {number?} */ count = null) {
		if (count === null) count = this.processes.length;
		this.unspawn();
		this.spawn(count);
	}
	/**
	 * @return {ProcessWrapper}
	 */
	createProcess() {
		throw new Error(`implemented by subclass`);
	}
	listen() {
		throw new Error(`implemented by subclass`);
	}
	destroy() {
		const index = PMLib.processManagers.indexOf(this);
		if (index) PMLib.processManagers.splice(index, 1);
		this.unspawn();
	}
}

class QueryProcessManager extends ProcessManager {
	/**
	 * @param {NodeModule} module
	 * @param {(input: any) => any} query
	 */
	constructor(module, query) {
		super(module);
		this._query = query;

		PMLib.processManagers.push(this);
	}
	/**
	 * @param {any} input
	 */
	query(input) {
		const process = /** @type {QueryProcessWrapper} */ (this.acquire());
		if (!process) return Promise.resolve(this._query(input));
		return process.query(input);
	}
	createProcess() {
		return new QueryProcessWrapper(this.filename);
	}
	listen() {
		if (this.isParentProcess) return;
		// child process
		process.on('message', async (/** @type {string} */ message) => {
			let nlLoc = message.indexOf('\n');
			if (nlLoc <= 0) throw new Error(`Invalid response ${message}`);
			const taskId = message.slice(0, nlLoc);
			message = message.slice(nlLoc + 1);

			if (taskId.startsWith('EVAL')) {
				// @ts-ignore guaranteed to be defined here
				process.send(`${taskId}\n` + eval(message));
				return;
			}

			const response = await this._query(JSON.parse(message));
			// @ts-ignore guaranteed to be defined here
			process.send(`${taskId}\n${JSON.stringify(response)}`);
		});
		process.on('disconnect', () => {
			process.exit();
		});
	}
}
class StreamProcessManager extends ProcessManager {
	/**
	 * @param {NodeModule} module
	 * @param {() => ObjectReadWriteStream} createStream
	 */
	constructor(module, createStream) {
		super(module);
		/** @type {Map<string, ObjectReadWriteStream>} taskid: stream used only in child process */
		this.activeStreams = new Map();
		this._createStream = createStream;

		PMLib.processManagers.push(this);
	}
	createStream() {
		const process = /** @type {StreamProcessWrapper} */ (this.acquire());
		if (!process) return this._createStream();
		return process.createStream();
	}
	createProcess() {
		return new StreamProcessWrapper(this.filename);
	}
	/**
	 * @param {string} taskId
	 * @param {ObjectReadStream} stream
	 */
	async pipeStream(taskId, stream) {
		let value, done;
		while (({value, done} = await stream.next(), !done)) {
			// @ts-ignore Guaranteed to be a child process
			process.send(`${taskId}\nPUSH\n${value}`);
		}
		// @ts-ignore Guaranteed to be a child process
		process.send(`${taskId}\nEND`);
		this.activeStreams.delete(taskId);
	}
	listen() {
		if (this.isParentProcess) return;
		// child process
		process.on('message', async (/** @type {string} */ message) => {
			let nlLoc = message.indexOf('\n');
			if (nlLoc <= 0) throw new Error(`Invalid request ${message}`);
			const taskId = message.slice(0, nlLoc);
			const stream = this.activeStreams.get(taskId);

			message = message.slice(nlLoc + 1);
			nlLoc = message.indexOf('\n');
			if (nlLoc < 0) nlLoc = message.length;
			const messageType = message.slice(0, nlLoc);
			message = message.slice(nlLoc + 1);

			if (taskId.startsWith('EVAL')) {
				// @ts-ignore guaranteed to be a child process
				process.send(`${taskId}\n` + eval(message));
				return;
			}

			if (messageType === 'NEW') {
				if (stream) throw new Error(`NEW: taskId ${taskId} already exists`);
				const newStream = this._createStream();
				this.activeStreams.set(taskId, newStream);
				this.pipeStream(taskId, newStream);
			} else if (messageType === 'DESTROY') {
				if (!stream) throw new Error(`DESTROY: Invalid taskId ${taskId}`);
				stream.destroy();
				this.activeStreams.delete(taskId);
			} else if (messageType === 'WRITE') {
				if (!stream) throw new Error(`WRITE: Invalid taskId ${taskId}`);
				stream.write(message);
			} else {
				throw new Error(`Unrecognized messageType ${messageType}`);
			}
		});
		process.on('disconnect', () => {
			process.exit();
		});
	}
}

const PMLib = {
	QueryProcessWrapper,
	StreamProcessWrapper,
	ProcessManager,
	QueryProcessManager,
	StreamProcessManager,

	/** @type {ProcessManager[]} */
	processManagers: [],
	disabled: false,
};

module.exports = PMLib;
