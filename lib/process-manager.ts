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
import * as cluster from 'cluster';
import * as path from 'path';
import * as Streams from './streams';

type ChildProcess = child_process.ChildProcess;
type Worker = cluster.Worker;

const ROOT_DIR = path.resolve(__dirname, '..');

export const processManagers: ProcessManager[] = [];
export const disabled = false;

class SubprocessStream extends Streams.ObjectReadWriteStream<string> {
	process: ChildProcess;
	taskId: number;
	constructor(process: ChildProcess, taskId: number) {
		super();
		this.process = process;
		this.taskId = taskId;
		this.process.send(`${taskId}\nNEW`);
	}
	_write(message: string) {
		if (!this.process.connected) {
			this.pushError(new Error(`Process disconnected (possibly crashed?)`));
			this.push(null);
			return;
		}
		this.process.send(`${this.taskId}\nWRITE\n${message}`);
		// responses are handled in ProcessWrapper
	}
	_destroy() {
		if (!this.process.connected) return;
		this.process.send(`${this.taskId}\nDESTROY`);
	}
}

class RawSubprocessStream extends Streams.ObjectReadWriteStream<string> {
	process: ChildProcess & {process: undefined} | Worker;
	constructor(process: ChildProcess | Worker) {
		super();
		this.process = process as any;
	}
	_write(message: string) {
		const isConnected = (this.process.process ? this.process.process : this.process).connected;
		if (!isConnected) {
			// no error because the crash handler should already have shown an error, and
			// sometimes harmless messages are sent during cleanup
			return;
		}
		this.process.send(message);
		// responses are handled in ProcessWrapper
	}
}

interface ProcessWrapper {
	load: number;
	process: ChildProcess | Worker;
	release: () => Promise<void>;
	getProcess: () => ChildProcess;
}

/** Wraps the process object in the PARENT process. */
export class QueryProcessWrapper implements ProcessWrapper {
	process: ChildProcess;
	taskId: number;
	pendingTasks: Map<number, (resp: string) => void>;
	pendingRelease: Promise<void> | null;
	resolveRelease: (() => void) | null;
	debug?: string;

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

			if (message.slice(0, nlLoc) === 'DEBUG') {
				this.debug = message.slice(nlLoc + 1);
				return;
			}

			const taskId = parseInt(message.slice(0, nlLoc));
			const resolve = this.pendingTasks.get(taskId);
			if (!resolve) throw new Error(`Invalid taskId ${message.slice(0, nlLoc)}`);
			this.pendingTasks.delete(taskId);
			resolve(JSON.parse(message.slice(nlLoc + 1)));

			if (this.resolveRelease && !this.load) this.destroy();
		});
	}

	getProcess() {
		return this.process;
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
export class StreamProcessWrapper implements ProcessWrapper {
	process: ChildProcess;
	taskId = 0;
	activeStreams = new Map<number, SubprocessStream>();
	pendingRelease: Promise<void> | null = null;
	resolveRelease: (() => void) | null = null;
	debug?: string;

	setDebug(message: string) {
		this.debug = (this.debug || '').slice(-32768) + '\n=====\n' + message;
	}

	constructor(file: string) {
		this.process = child_process.fork(file, [], {cwd: ROOT_DIR});

		this.process.on('message', (message: string) => {
			let nlLoc = message.indexOf('\n');
			if (nlLoc <= 0) throw new Error(`Invalid response ${message}`);
			if (message.slice(0, nlLoc) === 'THROW') {
				const error = new Error();
				error.stack = message.slice(nlLoc + 1);
				throw error;
			}

			if (message.slice(0, nlLoc) === 'DEBUG') {
				this.setDebug(message.slice(nlLoc + 1));
				return;
			}

			const taskId = parseInt(message.slice(0, nlLoc));
			const stream = this.activeStreams.get(taskId);
			if (!stream) throw new Error(`Invalid taskId ${message.slice(0, nlLoc)}`);

			message = message.slice(nlLoc + 1);
			nlLoc = message.indexOf('\n');
			if (nlLoc < 0) nlLoc = message.length;
			const messageType = message.slice(0, nlLoc);
			message = message.slice(nlLoc + 1);

			if (messageType === 'END') {
				void stream.end();
				this.deleteStream(taskId);
				return;
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
	}

	getProcess() {
		return this.process;
	}

	deleteStream(taskId: number) {
		this.activeStreams.delete(taskId);
		// try to release
		if (this.resolveRelease && !this.load) void this.destroy();
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
			void this.destroy();
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
 * A container for a RawProcessManager stream. This is usually the
 * RawProcessWrapper, but it can also be a fake RawProcessWrapper if the PM is
 * told to spawn 0 worker processes.
 */
export class StreamWorker {
	load = 0;
	workerid = 0;
	stream: Streams.ObjectReadWriteStream<string>;
	constructor(stream: Streams.ObjectReadWriteStream<string>) {
		this.stream = stream;
	}
}

/** Wraps the process object in the PARENT process. */
export class RawProcessWrapper implements ProcessWrapper, StreamWorker {
	process: ChildProcess & {process: undefined} | Worker;
	taskId = 0;
	stream: RawSubprocessStream;
	pendingRelease: Promise<void> | null = null;
	resolveRelease: (() => void) | null = null;
	debug?: string;
	workerid = 0;

	/** Not managed by RawProcessWrapper itself */
	load = 0;

	setDebug(message: string) {
		this.debug = (this.debug || '').slice(-32768) + '\n=====\n' + message;
	}

	constructor(file: string, isCluster?: boolean) {
		if (isCluster) {
			this.process = cluster.fork();
			this.workerid = this.process.id;
		} else {
			this.process = child_process.fork(file, [], {cwd: ROOT_DIR}) as any;
		}

		this.process.on('message', (message: string) => {
			this.stream.push(message);
		});

		this.stream = new RawSubprocessStream(this.process);
	}

	getProcess() {
		return this.process.process ? this.process.process : this.process;
	}

	release(): Promise<void> {
		if (this.pendingRelease) return this.pendingRelease;
		if (!this.load) {
			void this.destroy();
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
		this.stream.destroy();
		this.process.disconnect();
		return;
	}
}

/**
 * A ProcessManager wraps a query function: A function that takes a
 * string and returns a string or Promise<string>.
 */
export abstract class ProcessManager {
	processes: ProcessWrapper[] = [];
	releasingProcesses: ProcessWrapper[] = [];
	crashedProcesses: ProcessWrapper[] = [];
	readonly module: NodeJS.Module;
	readonly filename: string;
	readonly basename: string;
	readonly isParentProcess: boolean;
	crashTime = 0;
	crashRespawnCount = 0;

	constructor(module: NodeJS.Module) {
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
	releaseCrashed(process: ProcessWrapper) {
		const index = this.processes.indexOf(process);

		// The process was shut down sanely, not crashed
		if (index < 0) return;

		this.processes.splice(index, 1);

		this.destroyProcess(process);
		void process.release().then(() => {
			const releasingIndex = this.releasingProcesses.indexOf(process);
			if (releasingIndex >= 0) {
				this.releasingProcesses.splice(releasingIndex, 1);
			}
		});

		const now = Date.now();
		if (this.crashTime && now - this.crashTime > 30 * 60 * 1000) {
			this.crashTime = 0;
			this.crashRespawnCount = 0;
		}
		if (!this.crashTime) this.crashTime = now;
		this.crashRespawnCount += 1;
		// Notify any global crash logger
		void Promise.reject(
			new Error(`Process ${this.basename} ${process.getProcess().pid} crashed and had to be restarted`)
		);
		this.releasingProcesses.push(process);
		this.crashedProcesses.push(process);

		// only respawn processes if there have been fewer than 5 crashes in 30 minutes
		if (this.crashRespawnCount <= 5) {
			this.spawn(this.processes.length + 1);
		}
	}
	unspawn() {
		const released = [];
		const processes = this.processes;
		this.processes = [];
		for (const process of processes) {
			this.destroyProcess(process);
			released.push(process.release().then(() => {
				const index = this.releasingProcesses.indexOf(process);
				if (index >= 0) {
					this.releasingProcesses.splice(index, 1);
				}
			}));
		}
		this.releasingProcesses = this.releasingProcesses.concat(processes);
		return Promise.all(released);
	}
	spawn(count = 1) {
		if (!this.isParentProcess) return;
		if (disabled) return;
		while (this.processes.length < count) {
			const process = this.createProcess();
			process.process.on('disconnect', () => this.releaseCrashed(process));
			this.processes.push(process);
		}
	}
	respawn(count: number | null = null) {
		if (count === null) count = this.processes.length;
		const unspawned = this.unspawn();
		this.spawn(count);
		return unspawned;
	}
	abstract listen(): void;
	abstract createProcess(): ProcessWrapper;
	destroyProcess(process: ProcessWrapper) {}
	destroy() {
		const index = processManagers.indexOf(this);
		if (index >= 0) processManagers.splice(index, 1);
		return this.unspawn();
	}
}

export class QueryProcessManager<T = string, U = string> extends ProcessManager {
	_query: (input: T) => U | Promise<U>;

	constructor(module: NodeJS.Module, query: (input: T) => U | Promise<U>) {
		super(module);
		this._query = query;

		processManagers.push(this);
	}
	query(input: T) {
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
		process.on('message', (message: string) => {
			const nlLoc = message.indexOf('\n');
			if (nlLoc <= 0) throw new Error(`Invalid response ${message}`);
			const taskId = message.slice(0, nlLoc);
			message = message.slice(nlLoc + 1);

			if (taskId.startsWith('EVAL')) {
				// eslint-disable-next-line no-eval
				process.send!(`${taskId}\n` + eval(message));
				return;
			}

			void Promise.resolve(this._query(JSON.parse(message))).then(
				response => process.send!(`${taskId}\n${JSON.stringify(response)}`)
			);
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
		process.on('message', (message: string) => {
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
				// eslint-disable-next-line no-eval
				process.send!(`${taskId}\n` + eval(message));
				return;
			}

			if (messageType === 'NEW') {
				if (stream) throw new Error(`NEW: taskId ${taskId} already exists`);
				const newStream = this._createStream();
				this.activeStreams.set(taskId, newStream);
				void this.pipeStream(taskId, newStream);
			} else if (messageType === 'DESTROY') {
				if (!stream) throw new Error(`DESTROY: Invalid taskId ${taskId}`);
				void stream.destroy();
				this.activeStreams.delete(taskId);
			} else if (messageType === 'WRITE') {
				if (!stream) throw new Error(`WRITE: Invalid taskId ${taskId}`);
				void stream.write(message);
			} else {
				throw new Error(`Unrecognized messageType ${messageType}`);
			}
		});
		process.on('disconnect', () => {
			process.exit();
		});
	}
}

export class RawProcessManager extends ProcessManager {
	/** full list of processes - parent process only */
	workers: StreamWorker[] = [];
	/** if spawning 0 worker processes, the worker is instead stored here in the parent process */
	masterWorker: StreamWorker | null = null;
	/** stream used only in the child process */
	activeStream: Streams.ObjectReadWriteStream<string> | null = null;
	isCluster: boolean;
	spawnSubscription: ((worker: StreamWorker) => void) | null = null;
	unspawnSubscription: ((worker: StreamWorker) => void) | null = null;
	_setupChild: () => Streams.ObjectReadWriteStream<string>;
	/** worker ID of cluster worker - cluster child process only (0 otherwise) */
	readonly workerid = cluster.worker?.id || 0;

	constructor(options: {
		module: NodeJS.Module,
		setupChild: () => Streams.ObjectReadWriteStream<string>,
		isCluster?: boolean,
	}) {
		super(options.module);
		this.isCluster = !!options.isCluster;
		this._setupChild = options.setupChild;

		if (this.isCluster && this.isParentProcess) {
			cluster.setupMaster({
				exec: this.filename,
				// @ts-ignore TODO: update type definition
				cwd: ROOT_DIR,
			});
		}

		processManagers.push(this);
	}
	subscribeSpawn(callback: (worker: StreamWorker) => void) {
		this.spawnSubscription = callback;
	}
	subscribeUnspawn(callback: (worker: StreamWorker) => void) {
		this.unspawnSubscription = callback;
	}
	spawn(count?: number) {
		super.spawn(count);
		if (!this.workers.length) {
			this.masterWorker = new StreamWorker(this._setupChild());
			this.workers.push(this.masterWorker);
			this.spawnSubscription?.(this.masterWorker);
		}
	}
	createProcess() {
		const process = new RawProcessWrapper(this.filename, this.isCluster);
		this.workers.push(process);
		this.spawnSubscription?.(process);
		return process;
	}
	destroyProcess(process: RawProcessWrapper) {
		const index = this.workers.indexOf(process);
		if (index >= 0) this.workers.splice(index, 1);

		this.unspawnSubscription?.(process);
	}
	async pipeStream(stream: Streams.ObjectReadStream<string>) {
		let done = false;
		while (!done) {
			try {
				let value;
				({value, done} = await stream.next());
				process.send!(value);
			} catch (err) {
				process.send!(`THROW\n${err.stack}`);
			}
		}
	}
	listen() {
		if (this.isParentProcess) return;

		setImmediate(() => {
			this.activeStream = this._setupChild();
			void this.pipeStream(this.activeStream);
		});

		// child process
		process.on('message', (message: string) => {
			void this.activeStream!.write(message);
		});
		process.on('disconnect', () => {
			process.exit();
		});
	}
}
