/**
 * AI-vs-AI self-play winrate harness.
 *
 * Pits two `PlayerAI` configurations against each other over many
 * battles and reports winrates, so strategic-ai changes can be
 * validated empirically ("does difficulty 4 actually beat difficulty 2
 * more than 50% of the time?") instead of by eyeball.
 *
 * Sides are swapped every game to cancel any p1/p2 bias, and each game
 * gets a fresh deterministic seed derived from the run seed so results
 * are reproducible (independent of how many worker threads ran them).
 *
 * Games are distributed across a `worker_threads` pool (default: all
 * cores minus one) since each battle is independent, synchronous CPU
 * work — a single-threaded series leaves the rest of the machine idle.
 *
 * Usage (after `node build`):
 *
 *     node dist/sim/tools/selfplay.js --a 5 --b 3 --games 100
 *     node dist/sim/tools/selfplay.js --a 4 --b 4 --format gen9randombattle
 *     node dist/sim/tools/selfplay.js --a 3 --b 1 --games 50 --seed 1234 --jobs 4
 *
 * @license MIT
 */

import * as os from "os";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";

import { type ObjectReadWriteStream } from "../../lib/streams";
import * as BattleStreams from "../battle-stream";
import { PRNG, type PRNGSeed } from "../prng";
import type { ChoiceRequest } from "../side";
import { PlayerAI, type PlayerAIOptions } from "./player-ai";

/** One contender's configuration. */
export interface ContenderConfig {
	/** Label used in reporting (defaults to `d<difficulty>`). */
	name?: string;
	/** Difficulty 0..5 passed through to {@link PlayerAI}. */
	difficulty: number;
	/** Optional search budget override (ms) for OnePly/MCTS tiers. */
	searchBudgetMs?: number;
}

/** Options for {@link runSelfPlay}. */
export interface SelfPlayOptions {
	a: ContenderConfig;
	b: ContenderConfig;
	/** Number of games to play. Defaults to 50. */
	games?: number;
	/** Format id. Defaults to `gen9randombattle`. */
	format?: string;
	/** Run seed for reproducibility. */
	seed?: PRNGSeed | null;
	/** Hard cap on turns before the game is scored a tie. Defaults to 500. */
	maxTurns?: number;
	/**
	 * Wall-clock cap per game in ms. A stalled game (e.g. a rejected
	 * choice nobody retries) is force-tied after this long, and scored
	 * as an errored tie if even the force-tie doesn't land. Without it
	 * a single deadlocked battle drains the event loop and node exits
	 * mid-series with code 0 and no summary. Defaults to 60000.
	 */
	gameTimeoutMs?: number;
	/**
	 * Worker threads to spread games across. Defaults to all cores
	 * minus one. `1` runs everything inline on the main thread.
	 */
	jobs?: number;
	/** Log each game's result line to stdout. */
	verbose?: boolean;
}

/** Aggregated results returned by {@link runSelfPlay}. */
export interface SelfPlayResult {
	games: number;
	winsA: number;
	winsB: number;
	ties: number;
	/** Wins for A as a fraction of decisive games. */
	winrateA: number;
	avgTurns: number;
	errors: number;
}

/**
 * `PlayerAI` subclass that retries after a rejected choice instead of
 * stalling the stream. The production host (PokeBedrock) replays via
 * its interpreter's error handling; standalone streams have nobody to
 * do that, so without this a single `[Invalid choice]` deadlocks the
 * game.
 */
class SelfPlayAI extends PlayerAI {
	private lastSeenRequest: ChoiceRequest | null = null;
	private retriesForRequest = 0;
	private static readonly MAX_RETRIES = 5;

	override receiveRequest(request: ChoiceRequest): string {
		this.lastSeenRequest = request;
		this.retriesForRequest = 0;
		return super.receiveRequest(request);
	}

	override receiveError(error: Error): void {
		super.receiveError(error);
		// `[Unavailable choice]` is followed by an updated request from
		// the sim, so only self-retry the truly terminal rejections.
		if (error.message.startsWith("[Unavailable choice]")) return;
		const request = this.lastSeenRequest;
		if (!request || this.retriesForRequest >= SelfPlayAI.MAX_RETRIES) return;
		this.retriesForRequest++;
		const choice = super.receiveRequest(request);
		if (choice) this.choose(choice);
	}
}

/** Per-game outcome. */
interface GameResult {
	/** `"a"`, `"b"`, or `null` for a tie/aborted game. */
	winner: "a" | "b" | null;
	turns: number;
	errored: boolean;
	/** First stream error message, when `errored` is set. */
	errorMessage?: string;
}

/** Everything a worker needs to play one game. Structured-cloneable. */
interface WorkerTask {
	index: number;
	format: string;
	aIsP1: boolean;
	a: ContenderConfig;
	b: ContenderConfig;
	/** Per-game seed; AI seeds, battle seed, and retries derive from it. */
	gameSeed: PRNGSeed;
	maxTurns: number;
	gameTimeoutMs: number;
}

/**
 * Play a single battle between the two contenders.
 *
 * @param format Format id to run.
 * @param aIsP1 Whether contender A plays as p1 this game.
 * @param a Contender A's config.
 * @param b Contender B's config.
 * @param prng Run-level PRNG used to derive per-game seeds.
 * @param maxTurns Turn cap before forcing a tie.
 * @param gameTimeoutMs Wall-clock cap before the game is force-tied.
 * @returns The winner (by contender), turn count, and error flag.
 */
async function playGame(
	format: string,
	aIsP1: boolean,
	a: ContenderConfig,
	b: ContenderConfig,
	prng: PRNG,
	maxTurns: number,
	gameTimeoutMs: number
): Promise<GameResult> {
	const battleStream = new BattleStreams.BattleStream();
	const streams = BattleStreams.getPlayerStreams(battleStream);
	// Expose the live battle on the player sub-streams the way the
	// production host does (it hands `PlayerAI` the raw battle stream),
	// so the MCTS tier's fork rollouts are exercised in self-play too.
	for (const sub of [streams.p1, streams.p2]) {
		Object.defineProperty(sub, "battle", { get: () => battleStream.battle });
	}

	const newSeed = (): PRNGSeed => [
		prng.random(2 ** 16), prng.random(2 ** 16),
		prng.random(2 ** 16), prng.random(2 ** 16),
	].join(",") as PRNGSeed;

	const makeAI = (
		stream: ObjectReadWriteStream<string>,
		config: ContenderConfig
	) => new SelfPlayAI(stream, {
		difficulty: config.difficulty,
		searchBudgetMs: config.searchBudgetMs,
		seed: newSeed(),
	} satisfies PlayerAIOptions);

	const p1 = makeAI(streams.p1, aIsP1 ? a : b);
	const p2 = makeAI(streams.p2, aIsP1 ? b : a);
	void p1.start().catch(() => {});
	void p2.start().catch(() => {});

	const p1Name = aIsP1 ? "Contender A" : "Contender B";
	const p2Name = aIsP1 ? "Contender B" : "Contender A";
	void streams.omniscient.write(
		`>start ${JSON.stringify({ formatid: format, seed: newSeed() })}\n` +
		`>player p1 ${JSON.stringify({ name: p1Name })}\n` +
		`>player p2 ${JSON.stringify({ name: p2Name })}`
	);

	let turns = 0;
	let winnerName: string | null = null;
	let tie = false;
	let errored = false;
	let errorMessage: string | undefined;

	// Stage 1: a stalled battle (rejected choice nobody retried) sits
	// idle waiting for input — force-tie it so the stream still emits a
	// result. Stage 2: if even that produces nothing, abandon the game
	// entirely. Both timers also keep the event loop alive: without
	// them a deadlocked game makes node exit 0 mid-series.
	const forceTieTimer = setTimeout(() => {
		try {
			void streams.omniscient.write(">forcetie");
		} catch {}
	}, gameTimeoutMs);
	let hangTimer: NodeJS.Timeout | undefined;
	const hung = new Promise<"hung">(resolve => {
		hangTimer = setTimeout(() => resolve("hung"), gameTimeoutMs + 5000);
	});

	const consume = async (): Promise<void> => {
		for await (const chunk of streams.omniscient) {
			for (const line of chunk.split("\n")) {
				if (line.startsWith("|turn|")) {
					turns = parseInt(line.slice("|turn|".length)) || turns;
					if (turns >= maxTurns) void streams.omniscient.write(">forcetie");
				} else if (line.startsWith("|win|")) {
					winnerName = line.slice("|win|".length).trim();
				} else if (line === "|tie") {
					tie = true;
				}
			}
			if (winnerName || tie) break;
		}
	};

	try {
		const raced = await Promise.race([consume(), hung]);
		if (raced === "hung") {
			errored = true;
			errorMessage = `game hung after ${gameTimeoutMs}ms (force-tie ignored)`;
		}
	} catch (err) {
		errored = true;
		errorMessage = (err as Error).message;
	} finally {
		clearTimeout(forceTieTimer);
		if (hangTimer) clearTimeout(hangTimer);
	}
	try {
		void streams.omniscient.writeEnd();
	} catch {}

	if (!winnerName) return { winner: null, turns, errored, errorMessage };
	const winner = winnerName === "Contender A" ? "a" : winnerName === "Contender B" ? "b" : null;
	return { winner, turns, errored, errorMessage };
}

/**
 * Play one game with retries for games that die before turn 1 (e.g.
 * the random team generator rolled a custom species with incomplete
 * dex data) — those measure nothing about the AIs, so re-roll them
 * with the next seed derived from the same game PRNG.
 *
 * @param task The game's task description (configs, seed, caps).
 * @returns The final game result after up to 3 re-rolls.
 */
async function playGameWithRetries(task: WorkerTask): Promise<GameResult> {
	const prng = PRNG.get(task.gameSeed);
	let result = await playGame(
		task.format, task.aIsP1, task.a, task.b, prng, task.maxTurns, task.gameTimeoutMs
	);
	for (let attempt = 0; result.errored && result.turns === 0 && attempt < 3; attempt++) {
		result = await playGame(
			task.format, task.aIsP1, task.a, task.b, prng, task.maxTurns, task.gameTimeoutMs
		);
	}
	return result;
}

/**
 * Run a set of game tasks across a `worker_threads` pool. Each worker
 * plays one game at a time; a crashed worker scores its in-flight game
 * as an errored tie and is respawned.
 *
 * @param tasks The games to play.
 * @param jobs Pool size (number of concurrent worker threads).
 * @param onResult Called once per task as results arrive (any order).
 */
async function runWithWorkerPool(
	tasks: WorkerTask[],
	jobs: number,
	onResult: (index: number, result: GameResult) => void
): Promise<void> {
	let next = 0;
	const spawn = () => new Worker(__filename, { workerData: { selfPlayWorker: true } });
	const runOne = (worker: Worker, task: WorkerTask) => new Promise<GameResult>((resolve, reject) => {
		const onMessage = (msg: { index: number, result: GameResult }) => {
			cleanup();
			resolve(msg.result);
		};
		const onError = (err: Error) => {
			cleanup();
			reject(err);
		};
		const cleanup = () => {
			worker.off("message", onMessage);
			worker.off("error", onError);
		};
		worker.on("message", onMessage);
		worker.on("error", onError);
		worker.postMessage(task);
	});

	const lane = async () => {
		let worker = spawn();
		while (next < tasks.length) {
			const task = tasks[next++];
			try {
				onResult(task.index, await runOne(worker, task));
			} catch (err) {
				onResult(task.index, {
					winner: null,
					turns: 0,
					errored: true,
					errorMessage: `worker crashed: ${(err as Error).message}`,
				});
				void worker.terminate();
				worker = spawn();
			}
		}
		await worker.terminate();
	};

	await Promise.all(Array.from({ length: Math.min(jobs, tasks.length) }, lane));
}

/**
 * Run the full self-play series and aggregate results.
 *
 * @param options Contenders, game count, format, seed, and verbosity.
 * @returns Aggregate winrates and stats for the series.
 */
export async function runSelfPlay(options: SelfPlayOptions): Promise<SelfPlayResult> {
	const games = options.games ?? 50;
	const format = options.format ?? "gen9randombattle";
	const maxTurns = options.maxTurns ?? 500;
	const gameTimeoutMs = options.gameTimeoutMs ?? 60_000;
	const jobs = Math.max(1, options.jobs ?? defaultJobs());
	const prng = PRNG.get(options.seed ?? null);

	// Pre-derive every game's seed from the run PRNG so results are
	// reproducible regardless of pool size or completion order.
	const tasks: WorkerTask[] = [];
	for (let i = 0; i < games; i++) {
		tasks.push({
			index: i,
			format,
			aIsP1: i % 2 === 0,
			a: options.a,
			b: options.b,
			gameSeed: [
				prng.random(2 ** 16), prng.random(2 ** 16),
				prng.random(2 ** 16), prng.random(2 ** 16),
			].join(",") as PRNGSeed,
			maxTurns,
			gameTimeoutMs,
		});
	}

	let winsA = 0;
	let winsB = 0;
	let ties = 0;
	let errors = 0;
	let totalTurns = 0;
	let completed = 0;

	const record = (index: number, result: GameResult) => {
		completed++;
		totalTurns += result.turns;
		if (result.errored) errors++;
		if (result.winner === "a") winsA++;
		else if (result.winner === "b") winsB++;
		else ties++;
		if (options.verbose) {
			const tag = result.winner === "a" ? nameOf(options.a, "A") :
				result.winner === "b" ? nameOf(options.b, "B") : "tie";
			console.log(`[${completed}/${games}] game ${index + 1}: ${tag} in ${result.turns} turns` +
				`${result.errored ? ` (errored: ${result.errorMessage})` : ""}`);
		}
	};

	if (jobs === 1) {
		for (const task of tasks) record(task.index, await playGameWithRetries(task));
	} else {
		await runWithWorkerPool(tasks, jobs, record);
	}

	const decisive = winsA + winsB;
	return {
		games,
		winsA,
		winsB,
		ties,
		winrateA: decisive > 0 ? winsA / decisive : 0.5,
		avgTurns: games > 0 ? totalTurns / games : 0,
		errors,
	};
}

/**
 * Default worker-pool size: all cores minus one, so the machine stays
 * responsive while a series runs.
 *
 * @returns The default number of worker threads.
 */
function defaultJobs(): number {
	const cores: number = (os as { availableParallelism?: () => number }).availableParallelism?.() ??
		os.cpus().length;
	return Math.max(1, cores - 1);
}

/**
 * Display name for a contender.
 *
 * @param config The contender config.
 * @param fallbackTag `"A"` or `"B"`, used when no name is set.
 * @returns The label used in CLI output.
 */
function nameOf(config: ContenderConfig, fallbackTag: string): string {
	return config.name ?? `${fallbackTag}(d${config.difficulty})`;
}

/**
 * Parse `--flag value` style CLI arguments.
 *
 * @param argv Raw argv slice (no node/script entries).
 * @returns Flag-to-value map; bare flags map to `"true"`.
 */
function parseArgs(argv: string[]): Record<string, string> {
	const args: Record<string, string> = {};
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (!arg.startsWith("--")) continue;
		const key = arg.slice(2);
		const next = argv[i + 1];
		if (next && !next.startsWith("--")) {
			args[key] = next;
			i++;
		} else {
			args[key] = "true";
		}
	}
	return args;
}

// Worker-thread entry: play games sent from the main thread's pool.
if (!isMainThread && (workerData as { selfPlayWorker?: boolean } | null)?.selfPlayWorker) {
	parentPort!.on("message", (task: WorkerTask) => {
		playGameWithRetries(task)
			.then(result => parentPort!.postMessage({ index: task.index, result }))
			.catch((err: Error) => parentPort!.postMessage({
				index: task.index,
				result: {
					winner: null,
					turns: 0,
					errored: true,
					errorMessage: err.message,
				} satisfies GameResult,
			}));
	});
}

if (require.main === module && isMainThread) {
	const args = parseArgs(process.argv.slice(2));
	if (args.help) {
		console.log(
			`Usage: node dist/sim/tools/selfplay.js [options]\n` +
			`  --a <0..5>        Contender A difficulty (default 3)\n` +
			`  --b <0..5>        Contender B difficulty (default 1)\n` +
			`  --games <n>       Games to play (default 50)\n` +
			`  --format <id>     Format id (default gen9randombattle)\n` +
			`  --seed <n,n,n,n>  Run seed for reproducibility\n` +
			`  --budget-a <ms>   Search budget override for A\n` +
			`  --budget-b <ms>   Search budget override for B\n` +
			`  --max-turns <n>   Turn cap per game (default 500)\n` +
			`  --game-timeout <ms>  Wall-clock cap per game before force-tie (default 60000)\n` +
			`  --jobs <n>        Worker threads (default: cores - 1; 1 = inline)\n` +
			`  --quiet           Suppress per-game lines`
		);
		process.exit(0);
	}
	const options: SelfPlayOptions = {
		a: {
			difficulty: parseInt(args.a ?? "3"),
			searchBudgetMs: args["budget-a"] ? parseInt(args["budget-a"]) : undefined,
		},
		b: {
			difficulty: parseInt(args.b ?? "1"),
			searchBudgetMs: args["budget-b"] ? parseInt(args["budget-b"]) : undefined,
		},
		games: args.games ? parseInt(args.games) : undefined,
		format: args.format,
		seed: (args.seed as PRNGSeed | undefined) ?? null,
		maxTurns: args["max-turns"] ? parseInt(args["max-turns"]) : undefined,
		gameTimeoutMs: args["game-timeout"] ? parseInt(args["game-timeout"]) : undefined,
		jobs: args.jobs ? parseInt(args.jobs) : undefined,
		verbose: !args.quiet,
	};
	void runSelfPlay(options).then(result => {
		const aLabel = nameOf(options.a, "A");
		const bLabel = nameOf(options.b, "B");
		console.log(`\n=== Self-play: ${aLabel} vs ${bLabel} (${options.format ?? "gen9randombattle"}) ===`);
		console.log(`games:    ${result.games}`);
		console.log(`${aLabel} wins: ${result.winsA}`);
		console.log(`${bLabel} wins: ${result.winsB}`);
		console.log(`ties:     ${result.ties}${result.errors ? `  (errors: ${result.errors})` : ""}`);
		console.log(`winrate ${aLabel}: ${(result.winrateA * 100).toFixed(1)}% of decisive games`);
		console.log(`avg turns: ${result.avgTurns.toFixed(1)}`);
		process.exit(0);
	});
}
