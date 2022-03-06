/**
 * Typescript wrapper around the Python Artemis model.
 * By Mia.
 * @author mia-pi-git
 */

import * as child_process from 'child_process';
import {ProcessManager, Streams, Utils, Repl} from '../../lib';
import {Config} from '../config-loader';
import {toID} from '../../sim/dex-data';

class ArtemisStream extends Streams.ObjectReadWriteStream<string> {
	tasks = new Set<string>();
	private process: child_process.ChildProcessWithoutNullStreams;
	constructor() {
		super();
		this.process = child_process.spawn('python3', [
			'-u', __dirname + '/model.py', Config.debugartemisprocesses ? "debug" : "",
		].filter(Boolean));
		this.listen();
	}
	listen() {
		this.process.stdout.setEncoding('utf8');
		this.process.stderr.setEncoding('utf8');
		this.process.stdout.on('data', (data) => {
			// so many bugs were created by \nready\n
			data = data.trim();
			const [taskId, dataStr] = data.split("|");
			if (this.tasks.has(taskId)) {
				this.tasks.delete(taskId);
				return this.push(`${taskId}\n${dataStr}`);
			}
			if (taskId === 'error') { // there was a major crash and the script is no longer running
				const info = JSON.parse(dataStr);
				Monitor.crashlog(new Error(info.error), "An Artemis script", info);
				try {
					this.pushEnd(); // push end first so the stream always closes
					this.process.disconnect();
				} catch {}
			}
		});
		this.process.stderr.on('data', data => {
			if (/Downloading: ([0-9]+)%/i.test(data)) {
				// this prints to stderr fsr and it should not be throwing
				return;
			}
			Monitor.crashlog(new Error(data), "An Artemis process");
		});
		this.process.on('error', err => {
			Monitor.crashlog(err, "An Artemis process");
			this.pushEnd();
		});
		this.process.on('close', () => {
			this.pushEnd();
		});
	}
	_write(chunk: string) {
		const [taskId, message] = Utils.splitFirst(chunk, '\n');
		this.tasks.add(taskId);
		this.process.stdin.write(`${taskId}|${message}\n`);
	}
	destroy() {
		try {
			this.process.kill();
		} catch {}
		this.pushEnd();
	}
}

export const PM = new ProcessManager.StreamProcessManager(module, () => new ArtemisStream(), message => {
	if (message.startsWith('SLOW\n')) {
		Monitor.slow(message.slice(5));
	}
});

export class LocalClassifier {
	static readonly PM = PM;
	static readonly ATTRIBUTES: Record<string, unknown> = {
		sexual_explicit: {},
		severe_toxicity: {},
		toxicity: {},
		obscene: {},
		identity_attack: {},
		insult: {},
		threat: {},
	};
	static classifiers: LocalClassifier[] = [];
	static destroy() {
		for (const classifier of this.classifiers) void classifier.destroy();
		return this.PM.destroy();
	}
	/** If stream exists, model is usable */
	stream?: Streams.ObjectReadWriteStream<string>;
	enabled = false;
	requests = new Map<number, (data: any) => void>();
	lastTask = 0;
	readyPromise: Promise<boolean> | null = null;
	constructor() {
		LocalClassifier.classifiers.push(this);
		void this.setupProcesses();
	}
	async setupProcesses() {
		this.readyPromise = new Promise(resolve => {
			child_process.exec('python3 -c "import detoxify"', (err, out, stderr) => {
				if (err || stderr) {
					resolve(false);
				} else {
					resolve(true);
				}
			});
		});
		const res = await this.readyPromise;
		this.enabled = res;
		this.readyPromise = null;
		if (res) {
			this.stream = PM.createStream();
			void this.listen();
		}
	}
	async listen() {
		if (!this.stream) return null;
		for await (const chunk of this.stream) {
			const [rawTaskId, data] = Utils.splitFirst(chunk, '\n');
			const task = parseInt(rawTaskId);
			const resolver = this.requests.get(task);
			if (resolver) {
				resolver(JSON.parse(data));
				this.requests.delete(task);
			}
		}
	}
	destroy() {
		LocalClassifier.classifiers.splice(LocalClassifier.classifiers.indexOf(this), 1);
		return this.stream?.destroy();
	}
	async classify(text: string) {
		if (this.readyPromise) await this.readyPromise;
		if (!this.stream) return null;
		const taskId = this.lastTask++;
		const data = await new Promise<any>(resolve => {
			this.requests.set(taskId, resolve);
			void this.stream?.write(`${taskId}\n${text}`);
		});
		for (const k in data) {
			// floats have to be made into strings because python's json.dumps
			// doesn't like float32s
			data[k] = parseFloat(data[k]);
		}
		return data as Record<string, number>;
	}
}

// main module check necessary since this gets required in other non-parent processes sometimes
// when that happens we do not want to take over or set up or anything
if (require.main === module) {
	// This is a child process!
	global.Config = Config;
	global.Monitor = {
		crashlog(error: Error, source = 'A local Artemis child process', details: AnyObject | null = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			process.send!(`THROW\n@!!@${repr}\n${error.stack}`);
		},
		slow(text: string) {
			process.send!(`CALLBACK\nSLOW\n${text}`);
		},
	};
	global.toID = toID;
	process.on('uncaughtException', err => {
		if (Config.crashguard) {
			Monitor.crashlog(err, 'A local Artemis child process');
		}
	});
	// eslint-disable-next-line no-eval
	Repl.start(`abusemonitor-local-${process.pid}`, cmd => eval(cmd));
} else if (!process.send) {
	PM.spawn(Config.localartemisprocesses || 1);
}
