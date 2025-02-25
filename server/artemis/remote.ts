/**
 * Code for using Google's Perspective API for filters.
 * @author mia-pi-git
 */
import { ProcessManager, Net, Repl } from '../../lib';
import { Config } from '../config-loader';
import { toID } from '../../sim/dex-data';

// 20m. this is mostly here so we can use Monitor.slow()
const PM_TIMEOUT = 20 * 60 * 1000;
export const ATTRIBUTES = {
	"SEVERE_TOXICITY": {},
	"TOXICITY": {},
	"IDENTITY_ATTACK": {},
	"INSULT": {},
	"PROFANITY": {},
	"THREAT": {},
	"SEXUALLY_EXPLICIT": {},
	"FLIRTATION": {},
};

export interface PerspectiveRequest {
	languages: string[];
	requestedAttributes: AnyObject;
	comment: { text: string };
}

function time() {
	return Math.floor(Math.floor(Date.now() / 1000) / 60);
}

export class Limiter {
	readonly max: number;
	lastTick = time();
	count = 0;
	constructor(max: number) {
		this.max = max;
	}
	shouldRequest() {
		const now = time();
		if (this.lastTick !== now) {
			this.count = 0;
			this.lastTick = now;
		}
		this.count++;
		return this.count < this.max;
	}
}

function isCommon(message: string) {
	message = message.toLowerCase().replace(/\?!\., ;:/g, '');
	return ['gg', 'wp', 'ggwp', 'gl', 'hf', 'glhf', 'hello'].includes(message);
}

let throttleTime: number | null = null;
export const limiter = new Limiter(800);
export const PM = new ProcessManager.QueryProcessManager<string, Record<string, number> | null>(module, async text => {
	if (isCommon(text) || !limiter.shouldRequest()) return null;
	if (throttleTime && ((Date.now() - throttleTime) < 10000)) {
		return null;
	}
	if (throttleTime) throttleTime = null;

	const requestData: PerspectiveRequest = {
		// todo - support 'es', 'it', 'pt', 'fr' - use user.language? room.settings.language...?
		languages: ['en'],
		requestedAttributes: ATTRIBUTES,
		comment: { text },
	};
	try {
		const raw = await Net(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze`).post({
			query: {
				key: Config.perspectiveKey,
			},
			body: JSON.stringify(requestData),
			headers: {
				'Content-Type': "application/json",
			},
			timeout: 10 * 1000, // 10s
		});
		if (!raw) return null;
		const data = JSON.parse(raw);
		if (data.error) throw new Error(data.message);
		const result: { [k: string]: number } = {};
		for (const k in data.attributeScores) {
			const score = data.attributeScores[k];
			result[k] = score.summaryScore.value;
		}
		return result;
	} catch (e: any) {
		// eslint-disable-next-line require-atomic-updates
		throttleTime = Date.now();
		if (e.message.startsWith('Request timeout') || e.statusCode === 429) {
			// request timeout: just ignore this. error on their end not ours.
			// 429: too many requests, we already freeze for 10s above so. not much more we can do
			return null;
		}
		Monitor.crashlog(e, 'A Perspective API request', { request: JSON.stringify(requestData) });
		return null;
	}
}, PM_TIMEOUT);

// main module check necessary since this gets required in other non-parent processes sometimes
// when that happens we do not want to take over or set up or anything
if (require.main === module) {
	// This is a child process!
	global.Config = Config;
	global.Monitor = {
		crashlog(error: Error, source = 'A remote Artemis child process', details: AnyObject | null = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			process.send!(`THROW\n@!!@${repr}\n${error.stack}`);
		},
		slow(text: string) {
			process.send!(`CALLBACK\nSLOW\n${text}`);
		},
	} as any;
	global.toID = toID;
	process.on('uncaughtException', err => {
		if (Config.crashguard) {
			Monitor.crashlog(err, 'A remote Artemis child process');
		}
	});
	// eslint-disable-next-line no-eval
	Repl.start(`abusemonitor-remote-${process.pid}`, cmd => eval(cmd));
} else if (!process.send) {
	PM.spawn(Config.remoteartemisprocesses || 1);
}

export class RemoteClassifier {
	static readonly PM = PM;
	static readonly ATTRIBUTES = ATTRIBUTES;
	classify(text: string) {
		if (!Config.perspectiveKey) return Promise.resolve(null);
		return PM.query(text);
	}
	async suggestScore(text: string, data: Record<string, number>) {
		if (!Config.perspectiveKey) return Promise.resolve(null);
		const body: AnyObject = {
			comment: { text },
			attributeScores: {},
		};
		for (const k in data) {
			body.attributeScores[k] = { summaryScore: { value: data[k] } };
		}
		try {
			const raw = await Net(`https://commentanalyzer.googleapis.com/v1alpha1/comments:suggestscore`).post({
				query: {
					key: Config.perspectiveKey,
				},
				body: JSON.stringify(body),
				headers: {
					'Content-Type': "application/json",
				},
				timeout: 10 * 1000, // 10s
			});
			return JSON.parse(raw);
		} catch (e: any) {
			return { error: e.message };
		}
	}
	destroy() {
		return PM.destroy();
	}
	respawn() {
		return PM.respawn();
	}
	spawn(number: number) {
		PM.spawn(number);
	}
	getActiveProcesses() {
		return PM.processes.length;
	}
}
