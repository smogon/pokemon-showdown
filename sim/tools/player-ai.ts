/**
 * Strategic-AI host shell.
 *
 * `PlayerAI` is the simulator's only AI surface. It's intentionally a
 * thin shell: it owns the I/O contract with the showdown
 * {@link BattlePlayer} pipeline, plumbs the protocol log into a
 * {@link BattleStateTracker}, and forwards every {@link ChoiceRequest}
 * to an {@link Engine} picked by {@link DifficultyPolicy}.
 *
 * Difficulty 1 routes to the {@link RandomEngine} (random play with
 * full doubles / mega / Z / dyna / tera handling), so callers no longer
 * need to instantiate a separate "random" AI class.
 *
 * @license MIT
 */
import { BattlePlayer } from "../battle-stream";
import { PRNG, type PRNGSeed } from "../prng";
import { toID } from "../dex";
import type { ChoiceRequest } from "../side";
import type { Engine, EngineContext } from "./strategic-ai/engines/Engine";
import {
	applyKnobs,
	type EngineName,
	pickEngine,
} from "./strategic-ai/policy/DifficultyPolicy";
import { BattleStateTracker } from "./strategic-ai/state/BattleStateTracker";
import { parseLine, type SideId } from "./strategic-ai/state/LogParser";

/**
 * Construction options for {@link PlayerAI}.
 *
 * `difficulty` is the user-visible knob; everything else is for tools,
 * tests, and dev runners.
 */
export interface PlayerAIOptions {
	/** PRNG seed (or pre-built PRNG) for reproducibility. */
	seed?: PRNG | PRNGSeed | null;
	/** Difficulty level 0..5. 0 maps to {@link RandomEngine}. */
	difficulty?: number;
	/** Force a specific engine, ignoring the difficulty mapping. */
	engine?: EngineName;
	/** Override search budget (ms) for OnePly / MCTS engines. */
	searchBudgetMs?: number;
	/**
	 * Probability the random engine picks a move over a switch when both
	 * are legal. Only consulted by `RandomEngine`. Defaults to 1.
	 */
	randomMoveProb?: number;
	/**
	 * Probability the random engine attempts Mega/Ultra/Dyna/Tera when
	 * available. Only consulted by `RandomEngine`. Defaults to 0.
	 */
	randomMegaProb?: number;
	/**
	 * Override the engine instance directly. Useful for sim-internal
	 * runners that build a custom subclass of an engine and want to
	 * pipe it through the standard `BattlePlayer` plumbing.
	 */
	engineInstance?: Engine;
}

/**
 * Map a raw `difficulty` integer (`0..5`) to the value
 * {@link DifficultyPolicy} understands (1..5). 0 -> 1 (random).
 */
function normaliseDifficulty(difficulty: number | undefined): number {
	if (difficulty === undefined || Number.isNaN(difficulty)) return 3;
	if (difficulty <= 0) return 1;
	if (difficulty > 5) return 5;
	return Math.floor(difficulty);
}

/** Public AI class consumed by `TrainerActor`, `PokemonActor`, and dev tooling. */
export class PlayerAI extends BattlePlayer {
	protected readonly prng: PRNG;
	protected readonly difficulty: number;
	protected readonly engine: Engine;
	protected readonly engineCtx: EngineContext;
	protected tracker: BattleStateTracker | null = null;
	private readonly pendingLogLines: string[] = [];

	constructor(
		playerStream: ConstructorParameters<typeof BattlePlayer>[0],
		options: PlayerAIOptions = {},
		debug = false
	) {
		super(playerStream, debug);
		this.prng = PRNG.get(options.seed ?? null);
		this.difficulty = normaliseDifficulty(options.difficulty);
		this.engine = options.engineInstance ??
			pickEngine(this.difficulty, options.engine ?? "auto");
		this.engineCtx = {
			tracker: null,
			prng: this.prng,
			difficulty: this.difficulty,
			lastMoveByMon: new Map(),
			disabledMovesByMon: new Map(),
			trappedActiveByMon: new Set(),
			lastSwitchTurnByMon: new Map(),
			lastMoveFailedByMon: new Set(),
			noiseEpsilon: 0,
			infoForgetting: 0,
			searchBudgetMs: options.searchBudgetMs,
			randomMoveProb: options.randomMoveProb,
			randomMegaProb: options.randomMegaProb,
		};
		applyKnobs(this.engineCtx, this.difficulty);
		if (options.searchBudgetMs) this.engineCtx.searchBudgetMs = options.searchBudgetMs;
	}

	/**
	 * Hook into the protocol log so we can:
	 *
	 * 1. Update the tracker before the base `BattlePlayer` discards
	 *    lines that aren't `|request|` / `|error|`.
	 * 2. Dispatch the choice we compute. The base `receiveLine` calls
	 *    `receiveRequest` but throws away its return value; for runners
	 *    that drive the AI via `BattlePlayer.start` we hand the result
	 *    to `this.choose`. Hosts that drive `receiveRequest` manually
	 *    (e.g. `TrainerActor` with delayed dispatch) never reach this
	 *    branch, so their custom flow is preserved.
	 */
	override receiveLine(line: string): void {
		if (line?.startsWith("|")) {
			if (this.tracker) {
				const event = parseLine(line);
				if (event) this.tracker.applyEvent(event);
			} else if (this.pendingLogLines.length < 1024) {
				this.pendingLogLines.push(line);
			}
		}
		if (line?.startsWith("|request|")) {
			const rest = line.slice("|request|".length);
			let request: ChoiceRequest;
			try {
				request = JSON.parse(rest);
			} catch {
				super.receiveLine(line);
				return;
			}
			const choice = this.receiveRequest(request);
			if (choice) this.choose(choice);
			return;
		}
		super.receiveLine(line);
	}

	/**
	 * Lazily build the tracker. The first request tells us which side
	 * is "us"; until then we buffer log lines and replay them once the
	 * tracker exists.
	 */
	protected ensureTracker(request: ChoiceRequest): BattleStateTracker | null {
		const sideId = (request as { side?: { id?: SideId } }).side?.id;
		if (!sideId) return this.tracker;
		if (!this.tracker) {
			this.tracker = new BattleStateTracker({ mySide: sideId });
			for (const line of this.pendingLogLines) {
				const event = parseLine(line);
				if (event) this.tracker.applyEvent(event);
			}
			this.pendingLogLines.length = 0;
			this.engineCtx.tracker = this.tracker;
		}
		if (!request.wait) this.tracker.applyRequest(request);
		return this.tracker;
	}

	/**
	 * Catch `[Can't move] X's Y is disabled` errors and pin the disabled
	 * move id to the specific Pokemon so it doesn't leak across switches.
	 *
	 * Also handles two other rejection categories that would otherwise
	 * cycle the engine into picking the same illegal action repeatedly:
	 *
	 * - `[Unavailable choice] Can't switch: The active Pokémon is trapped`
	 *   — the simulator hadn't surfaced trapping on the prior request
	 *   (ability/item-based traps only show on the *next* request after a
	 *   failed switch). We mark the active mon as trapped on
	 *   `trappedActiveByMon` so the next decision skips switch candidates.
	 *
	 * - `[Invalid choice] Can't move: <X> doesn't have a move matching <id>`
	 *   — a phantom move id slipped past the request's `moves[]` (forme
	 *   change, Sleep Talk, Metronome leftover, etc.). Treat the move as
	 *   disabled for that mon and clear `lastMoveByMon` so we don't retry it.
	 */
	override receiveError(error: Error): void {
		const m1 = /^\[([^\]]+)\] ([^:]+): (.+)$/s.exec(error.message);
		if (!m1) return;
		const suffix = m1[1];
		const message = m1[3];

		const sideId = this.tracker?.mySide ?? "p1";
		const recordDisabledMove = (monName: string, moveId: string) => {
			const fallbackKey = `${sideId}|${monName}`;
			const trackedId = this.resolveMonIdFromTracker(sideId, monName);
			const keys = trackedId && trackedId !== fallbackKey ?
				[trackedId, fallbackKey] :
				[fallbackKey];
			for (const key of keys) {
				let set = this.engineCtx.disabledMovesByMon.get(key);
				if (!set) {
					set = new Set();
					this.engineCtx.disabledMovesByMon.set(key, set);
				}
				set.add(moveId);
				if (this.engineCtx.lastMoveByMon.get(key) === moveId) {
					this.engineCtx.lastMoveByMon.delete(key);
				}
			}
		};

		if (suffix === "Can't move") {
			// `<mon>'s <move> is disabled` (Imprison, Disable, Taunt, etc.).
			const m2 = /^(.+?)'s (.+) is disabled$/.exec(message);
			if (m2) {
				recordDisabledMove(m2[1].trim(), toID(m2[2]));
				return;
			}
			// `Your <mon> doesn't have a move matching <id>` (forme/clone
			// out-of-sync). Same treatment as disabled.
			const m3 = /^Your (.+?) doesn't have a move matching (.+)$/.exec(message);
			if (m3) {
				recordDisabledMove(m3[1].trim(), toID(m3[2]));
				return;
			}
			return;
		}

		if (suffix === "Can't switch") {
			// `The active Pokémon is trapped` — record the trap on every
			// active mon we have for our side so the engine treats the
			// next move request as if `active.trapped` were already set.
			if (!/active Pok.+mon is trapped/i.test(message)) return;
			const t = this.tracker;
			if (!t) return;
			for (const monId of t.active[sideId] ?? []) {
				if (!monId) continue;
				this.engineCtx.trappedActiveByMon.add(monId);
			}
			return;
		}
	}

	/**
	 * Best-effort lookup of the tracker's monId for a given side+nickname.
	 * Returns `null` if we don't have a tracker yet (e.g. the error
	 * arrived before any `|request|` did).
	 */
	private resolveMonIdFromTracker(sideId: SideId, name: string): string | null {
		const t = this.tracker;
		if (!t) return null;
		const req = t.lastRequest;
		const side = (req as { side?: { pokemon?: { ident: string, uuid?: string }[] } } | null)?.side;
		if (!side?.pokemon) return null;
		for (const p of side.pokemon) {
			const colon = p.ident.indexOf(":");
			const pName = colon >= 0 ? p.ident.slice(colon + 1).trim() : p.ident;
			if (pName === name) {
				return p.uuid || `${sideId}|${name}`;
			}
		}
		return null;
	}

	/** Convert a `ChoiceRequest` into a showdown command string. */
	override receiveRequest(request: ChoiceRequest): string {
		if (request.wait) return "";
		this.ensureTracker(request);
		// If the simulator now exposes `active.trapped: true` on the
		// request itself, our error-fed override is redundant. If it does
		// NOT but we previously recorded a trap, keep the override (the
		// trap is still active until the foe ability/item changes). The
		// override is cleared whenever the trapped mon switches out (its
		// id is no longer in `tracker.active[mySide]`).
		const t = this.tracker;
		if (t && this.engineCtx.trappedActiveByMon.size > 0) {
			const stillActive = new Set<string>();
			for (const monId of t.active[t.mySide] ?? []) {
				if (monId) stillActive.add(monId);
			}
			for (const trappedId of this.engineCtx.trappedActiveByMon) {
				if (!stillActive.has(trappedId)) {
					this.engineCtx.trappedActiveByMon.delete(trappedId);
				}
			}
		}
		return this.engine.choose(request, this.engineCtx);
	}
}
