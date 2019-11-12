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

import * as child_process from 'child_process';
import * as path from 'path';
import * as Streams from './streams';

const ROOT_DIR = path.resolve(__dirname, '..');

export const processManagers: ProcessManager[] = [];
export const disabled = false;

class SubprocessStream extends Streams.ObjectReadWriteStream<string> {
	constructor(public process: ChildProcess, public taskId: number) {
		super();
		this.process = process;
		this.taskId = taskId;
		this.process.send(`${taskId}\nNEW`);
	}
	_write(message: string) {
		if (!this.process.connected) return;
		this.process.send(`${this.taskId}\nWRITE\n${message}`);
		// responses are handled in ProcessWrapper
	}
	_destroy() {
		if (!this.process.connected) return;
		this.process.send(`${this.taskId}\nDESTROY`);
	}
}

interface ProcessWrapper {
	load: number;
	release: () => Promise<void>;
}

/** Wraps the process object in the PARENT process. */
export class QueryProcessWrapper {
	process: ChildProcess;
	taskId: number;
	pendingTasks: Map<number, (resp: string) => void>;
	pendingRelease: Promise<void> | null;
	resolveRelease: (() => void) | null;

	constructor(file: string) {
		this.process = child_process.fork(file, [], {cwd: ROOT_DIR});
		this.taskId = 0;
		this.pendingTasks = new Map();
		this.pendingRelease = null;
		this.resolveRelease = null;

		this.process.on('message', (message: string) => {
			const nlLoc = message.indexOf('\n');
			if (nlLoc <= 0) throw new Error(`Invalid response ${message}`);
			if (message.slice(0, nlLoc) === 'THROW') {
				const error = new Error();
				error.stack = message.slice(nlLoc + 1);
				throw error;
			}

			const taskId = parseInt(message.slice(0, nlLoc), 10);
			const resolve = this.pendingTasks.get(taskId);
			if (!resolve) throw new Error(`Invalid taskId ${message.slice(0, nlLoc)}`);
			this.pendingTasks.delete(taskId);
			resolve(JSON.parse(message.slice(nlLoc + 1)));

			if (this.resolveRelease && !this.load) this.destroy();
		});
		this.process.on('disconnect', () => {
			this.destroy();
		});
	}

	get load() {
		return this.pendingTasks.size;
	}

	query(input: any): Promise<any> {
		this.taskId++;
		const taskId = this.taskId;
		this.process.send(`${taskId}\n${JSON.stringify(input)}`);
		return new Promise(resolve => {
			this.pendingTasks.set(taskId, resolve);
		});
	}

	release(): Promise<void> {
		if (this.pendingRelease) return this.pendingRelease;
		if (!this.load) {
			this.destroy();
		} else {
			this.pendingRelease = new Promise(resolve => {
				this.resolveRelease = resolve;
			});
		}
		return this.pendingRelease as Promise<void>;
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

/** Wraps the process object in the PARENT process. */
export class StreamProcessWrapper {
	process: ChildProcess;
	taskId: number;
	activeStreams: Map<number, SubprocessStream>;
	pendingRelease: Promise<void> | null;
	resolveRelease: (() => void) | null;

	constructor(file: string) {
		this.process = child_process.fork(file, [], {cwd: ROOT_DIR});
		this.taskId = 0;
		this.activeStreams = new Map();
		this.pendingRelease = null;
		this.resolveRelease = null;

		this.process.on('message', (message: string) => {
			let nlLoc = message.indexOf('\n');
			if (nlLoc <= 0) throw new Error(`Invalid response ${message}`);
			if (message.slice(0, nlLoc) === 'THROW') {
				const error = new Error();
				error.stack = message.slice(nlLoc + 1);
				throw error;
			}

			const taskId = parseInt(message.slice(0, nlLoc), 10);
			const stream = this.activeStreams.get(taskId);
			if (!stream) throw new Error(`Invalid taskId ${message.slice(0, nlLoc)}`);

			message = message.slice(nlLoc + 1);
			nlLoc = message.indexOf('\n');
			if (nlLoc < 0) nlLoc = message.length;
			const messageType = message.slice(0, nlLoc);
			message = message.slice(nlLoc + 1);

			if (messageType === 'END') {
				const end = stream.end();
				this.deleteStream(taskId);
				return end;
			} else if (messageType === 'PUSH') {
				stream.push(message);
			} else if (messageType === 'THROW') {
				const error = new Error();
				error.stack = message;
				stream.pushError(error);
			} else {
				throw new Error(`Unrecognized messageType ${messageType}`);
			}
		});
		this.process.on('disconnect', () => {
			this.destroy();
		});
	}

	deleteStream(taskId: number) {
		this.activeStreams.delete(taskId);
		// try to release
		if (this.resolveRelease && !this.load) this.destroy();
	}

	get load() {
		return this.activeStreams.size;
	}

	createStream(): SubprocessStream {
		this.taskId++;
		const taskId = this.taskId;
		const stream = new SubprocessStream(this.process, taskId);
		this.activeStreams.set(taskId, stream);
		return stream;
	}

	release(): Promise<void> {
		if (this.pendingRelease) return this.pendingRelease;
		if (!this.load) {
			this.destroy();
		} else {
			this.pendingRelease = new Promise(resolve => {
				this.resolveRelease = resolve;
			});
		}
		return this.pendingRelease as Promise<void>;
	}

	destroy() {
		if (this.pendingRelease && !this.resolveRelease) {
			// already destroyed
			return;
		}
		this.process.disconnect();
		const destroyed = [];
		for (const stream of this.activeStreams.values()) {
			destroyed.push(stream.destroy());
		}
		this.activeStreams.clear();
		if (this.resolveRelease) {
			this.resolveRelease();
			this.resolveRelease = null;
		} else if (!this.pendingRelease) {
			this.pendingRelease = Promise.resolve();
		}
		return Promise.all(destroyed);
	}
}

/**
 * A ProcessManager wraps a query function: A function that takes a
 * string and returns a string or Promise<string>.
 */
export class ProcessManager {
	processes: ProcessWrapper[];
	releasingProcesses: ProcessWrapper[];
	// @ts-ignore
	module: NodeJs.Module;
	filename: string;
	basename: string;
	isParentProcess: boolean;

	// @ts-ignore
	constructor(module: NodeJs.Module) {
		this.processes = [];
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
		const released = [];
		for (const process of this.processes) {
			released.push(process.release().then(() => {
				const index = this.releasingProcesses.indexOf(process);
				if (index >= 0) {
					this.releasingProcesses.splice(index, 1);
				}
			}));
		}
		this.releasingProcesses = this.releasingProcesses.concat(this.processes);
		this.processes = [];
		return Promise.all(released);
	}
	spawn(count = 1) {
		if (!this.isParentProcess) return;
		if (disabled) return;
		while (this.processes.length < count) {
			this.processes.push(this.createProcess());
		}
	}
	respawn(count: number | null = null) {
		if (count === null) count = this.processes.length;
		const unspawned = this.unspawn();
		this.spawn(count);
		return unspawned;
	}
	createProcess(): ProcessWrapper {
		throw new Error(`implemented by subclass`);
	}
	listen() {
		throw new Error(`implemented by subclass`);
	}
	destroy() {
		const index = processManagers.indexOf(this);
		if (index >= 0) processManagers.splice(index, 1);
		return this.unspawn();
	}
}

export class QueryProcessManager extends ProcessManager {
	// tslint:disable-next-line:variable-name
	_query: (input: any) => any;

	constructor(module: NodeJS.Module, query: (input: any) => any) {
		super(module);
		this._query = query;

		processManagers.push(this);
	}
	query(input: any) {
		const process = this.acquire() as QueryProcessWrapper;
		if (!process) return Promise.resolve(this._query(input));
		return process.query(input);
	}
	createProcess() {
		return new QueryProcessWrapper(this.filename);
	}
	listen() {
		if (this.isParentProcess) return;
		// child process
		process.on('message', async (message: string) => {
			const nlLoc = message.indexOf('\n');
			if (nlLoc <= 0) throw new Error(`Invalid response ${message}`);
			const taskId = message.slice(0, nlLoc);
			message = message.slice(nlLoc + 1);

			if (taskId.startsWith('EVAL')) {
				// tslint:disable-next-line: no-eval
				process.send!(`${taskId}\n` + eval(message));
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

export class StreamProcessManager extends ProcessManager {
	/* taskid: stream used only in child process */
	activeStreams: Map<string, Streams.ObjectReadWriteStream<string>>;
	// tslint:disable-next-line:variable-name
	_createStream: () => Streams.ObjectReadWriteStream<string>;

	constructor(module: NodeJS.Module, createStream: () => Streams.ObjectReadWriteStream<string>) {
		super(module);
		this.activeStreams = new Map();
		this._createStream = createStream;

		processManagers.push(this);
	}
	createStream() {
		const process = this.acquire() as StreamProcessWrapper;
		if (!process) return this._createStream();
		return process.createStream();
	}
	createProcess() {
		return new StreamProcessWrapper(this.filename);
	}
	async pipeStream(taskId: string, stream: Streams.ObjectReadStream<string>) {
		let done = false;
		while (!done) {
			try {
				let value;
				({value, done} = await stream.next());
				process.send!(`${taskId}\nPUSH\n${value}`);
			} catch (err) {
				process.send!(`${taskId}\nTHROW\n${err.stack}`);
			}
		}
		process.send!(`${taskId}\nEND`);
		this.activeStreams.delete(taskId);
	}
	listen() {
		if (this.isParentProcess) return;
		// child process
		process.on('message', async (message: string) => {
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
				// tslint:disable-next-line: no-eval
				process.send!(`${taskId}\n` + eval(message));
				return;
			}

			if (messageType === 'NEW') {
				if (stream) throw new Error(`NEW: taskId ${taskId} already exists`);
				const newStream = this._createStream();
				this.activeStreams.set(taskId, newStream);
				return this.pipeStream(taskId, newStream);
			} else if (messageType === 'DESTROY') {
				if (!stream) throw new Error(`DESTROY: Invalid taskId ${taskId}`);
				const destroyed = stream.destroy();
				this.activeStreams.delete(taskId);
				return destroyed;
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
