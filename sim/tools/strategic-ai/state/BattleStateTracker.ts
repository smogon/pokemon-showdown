/**
 * Strategic-AI battle state tracker.
 *
 * Showdown only sends each player's perspective via `|request|` JSON.
 * That JSON is excellent for our own team but contains very little for
 * the opponent: just species/types/HP%/ability(base)/item, and no
 * revealed move history, no per-turn weather/terrain info, no choice
 * locking, no hazards, etc. Everything else lives in the protocol log
 * stream which the base `BattlePlayer` discards.
 *
 * This tracker consumes both inputs:
 *
 * 1. `applyRequest()` ingests our most recent `|request|` JSON to keep
 *    `myActive`, `foeActive`, `myTeam`, `opponentTeam` in sync with
 *    Showdown's source of truth for visible fields.
 * 2. `applyEvent()` consumes parsed {@link BattleEvent}s from
 *    {@link LogParser} to record everything else: weather, terrain,
 *    screens, hazards, opponent revealed moves, item/ability reveals,
 *    consecutive-same-move detection (Choice lock inference), turn
 *    count, faint count.
 *
 * The tracker is intentionally side-symmetric: both `p1` and `p2` are
 * tracked, and `mySide`/`foeSide` are configured at construction so
 * downstream consumers can ask either by absolute side or by
 * "ours/theirs".
 *
 * @license MIT
 */
import { Dex, toID } from "../../../dex";
import type {
	PokemonSwitchRequestData,
	PokemonMoveRequestData,
	MoveRequest,
	SwitchRequest,
	TeamPreviewRequest,
	SideRequestData,
} from "../../../side";
import { isSideId, type BattleEvent, type PokemonRef, type SideId } from "./LogParser";

/** Identity of a tracked Pokemon. We use UUID when available
 * (PokeBedrock extension) and fall back to nickname. */
export type MonId = string;

/** Persistent per-Pokemon record on either side. */
export interface TrackedPokemon {
	/** Stable identifier across switches. */
	id: MonId;
	/** Display nickname/ident from the most recent message. */
	name: string;
	/** Species (raw `details` first segment). */
	species: string;
	/** Showdown level (defaults to 100). */
	level: number;
	/** Current condition string (HP/MaxHP [status] or `0 fnt`). */
	condition: string;
	/** Last-known HP fraction in [0,1]. */
	hpFraction: number;
	/** Last-known status condition (`brn`, `par`, `slp`, etc., or `""`). */
	status: string;
	/** Stat-stage boosts (-6..+6) keyed by `atk`/`def`/`spa`/`spd`/`spe`/`accuracy`/`evasion`. */
	boosts: Record<string, number>;
	/** Visible/announced types. May be replaced by Tera. */
	types: string[];
	/** Tera type, if revealed by `-terastallize` or `request.canTerastallize`. */
	teraType?: string;
	/** True after we've seen `-terastallize` for this mon. */
	terastallized: boolean;
	/** Currently-active ability id (may differ from base after Trace/Skill Swap). */
	ability?: string;
	/** Ability declared at switch-in / from request data. */
	baseAbility?: string;
	/** Item id, when revealed; `""` after `-enditem` consumed it. */
	item?: string;
	/** Set of move ids the opponent has been observed using. */
	revealedMoves: Set<string>;
	/** Last move used (id), if any. */
	lastMove?: string;
	/**
	 * True iff the mon's most recent move attempt did not connect:
	 * `|miss|`, `|-immune|`, `|-fail|`, or `|cant|` followed by no
	 * successful `|move|` since. Cleared the next time the mon
	 * successfully uses a move. Powers Stomping Tantrum's 2× BP and
	 * any future "failed-move follow-up" heuristics.
	 */
	lastMoveFailed: boolean;
	/** Consecutive-same-move counter. >=2 + holds an item that locks to first move => Choice. */
	sameMoveStreak: number;
	/** True if Choice-lock inference has triggered for this mon. */
	choiceLocked: boolean;
	/** Stat block from `request.side.pokemon` (best-effort). */
	stats?: { [stat: string]: number };
	/** Active volatile effects (Substitute, Taunt, Encore, etc.) keyed by effect id. */
	volatiles: Set<string>;
	/** True when the mon has been fainted at least once. */
	fainted: boolean;
	/** True if the mon is currently on the field. */
	active: boolean;
	/** Active position (0/1/2) when on field, else -1. */
	position: number;
}

/** Side-wide conditions tracked per-side. */
export interface SideState {
	/** Stealth Rock present. */
	stealthRock: boolean;
	/** Spikes layers, 0..3. */
	spikes: number;
	/** Toxic Spikes layers, 0..2. */
	toxicSpikes: number;
	/** Sticky Web present. */
	stickyWeb: boolean;
	/** Reflect turns remaining (5 default, 8 with Light Clay). */
	reflectTurns: number;
	/** Light Screen turns remaining. */
	lightScreenTurns: number;
	/** Aurora Veil turns remaining. */
	auroraVeilTurns: number;
	/** Tailwind turns remaining. */
	tailwindTurns: number;
	/** Safeguard turns remaining. */
	safeguardTurns: number;
	/** Mist turns remaining. */
	mistTurns: number;
	/** Total fainted Pokemon on this side. */
	fainted: number;
}

/** Newly-created `SideState`. */
function makeEmptySide(): SideState {
	return {
		stealthRock: false,
		spikes: 0,
		toxicSpikes: 0,
		stickyWeb: false,
		reflectTurns: 0,
		lightScreenTurns: 0,
		auroraVeilTurns: 0,
		tailwindTurns: 0,
		safeguardTurns: 0,
		mistTurns: 0,
		fainted: 0,
	};
}

/** Field conditions (apply to both sides). */
export interface FieldState {
	/** Active weather (`raindance`, `sunnyday`, `sandstorm`, `snowscape`, `snow`, `hail`, `desolateland`, `primordialsea`, `deltastream`) or `""`. */
	weather: string;
	/** Turns remaining for the weather (0 if unknown / permanent). */
	weatherTurns: number;
	/** Active terrain (`electricterrain`, `grassyterrain`, `mistyterrain`, `psychicterrain`) or `""`. */
	terrain: string;
	terrainTurns: number;
	/** Trick Room active. */
	trickRoom: boolean;
	trickRoomTurns: number;
	/** Magic Room active. */
	magicRoom: boolean;
	/** Wonder Room active. */
	wonderRoom: boolean;
	/** Gravity active. */
	gravity: boolean;
	gravityTurns: number;
}

function makeEmptyField(): FieldState {
	return {
		weather: "",
		weatherTurns: 0,
		terrain: "",
		terrainTurns: 0,
		trickRoom: false,
		trickRoomTurns: 0,
		magicRoom: false,
		wonderRoom: false,
		gravity: false,
		gravityTurns: 0,
	};
}

/**
 * Construction options for {@link BattleStateTracker}.
 */
export interface BattleStateTrackerOptions {
	/** Which side this tracker plays as. Required. */
	mySide: SideId;
	/** Which gen to use for Dex lookups (defaults to current). */
	gen?: number;
}

/**
 * The single source of truth for everything the strategic AI knows
 * about the current battle, beyond the bare `request` JSON.
 *
 * Designed to be cheap to update incrementally (one event at a time)
 * and cheap to query (every field is plain data).
 */
export class BattleStateTracker {
	readonly mySide: SideId;
	readonly foeSide: SideId;
	gen: number;
	turn: number;
	gametype: string;
	/** Per-Pokemon records keyed by stable id. */
	readonly pokemon: Map<MonId, TrackedPokemon>;
	/** Mapping from `${side}|${name}` to id, for resolving log refs. */
	private readonly identIndex: Map<string, MonId>;
	/** Active Pokemon ids per side per slot (slot index = position). */
	readonly active: Record<SideId, MonId[]>;
	readonly sides: Record<SideId, SideState>;
	readonly field: FieldState;
	/** Last `MoveRequest` or `SwitchRequest` JSON we received from showdown. */
	lastRequest:
		| MoveRequest |
		SwitchRequest |
		TeamPreviewRequest |
		null;
	/** True after we've seen `|start|` (battle has begun). */
	started: boolean;
	/** True once a `|win|` or `|tie|` event has been observed. */
	ended: boolean;
	/** Winning side when known (real logs only carry the player *name*; we
	 * record it best-effort via {@link winnerName}). */
	winner: SideId | null;
	/** Raw `|win|<name>` payload, when available. */
	winnerName: string | null;
	/**
	 * Most recent attacker — used to attribute miss / immune / fail /
	 * cant events back to the user whose move just resolved. Cleared
	 * on turn change.
	 */
	private _lastMover: TrackedPokemon | null;

	constructor(options: BattleStateTrackerOptions) {
		this.mySide = options.mySide;
		this.foeSide = (options.mySide === "p1" ? "p2" : "p1");
		this.gen = options.gen ?? Dex.gen;
		this.turn = 0;
		this.gametype = "singles";
		this.pokemon = new Map();
		this.identIndex = new Map();
		this.active = { p1: [], p2: [], p3: [], p4: [] };
		this.sides = {
			p1: makeEmptySide(),
			p2: makeEmptySide(),
			p3: makeEmptySide(),
			p4: makeEmptySide(),
		};
		this.field = makeEmptyField();
		this.lastRequest = null;
		this.started = false;
		this.ended = false;
		this.winner = null;
		this.winnerName = null;
		this._lastMover = null;
	}

	// -------------------------------------------------------------------
	// Identity helpers
	// -------------------------------------------------------------------

	/**
	 * Resolve (or create) the {@link TrackedPokemon} corresponding to a
	 * protocol `POKEMON` reference. We prefer the request-supplied UUID
	 * when available, falling back to `${side}|${name}`. Subsequent
	 * lookups for the same name on the same side return the same record.
	 */
	private resolveByRef(ref: PokemonRef, hint?: { uuid?: string }): TrackedPokemon {
		const key = `${ref.side}|${ref.name}`;
		if (hint?.uuid) {
			const existing = this.pokemon.get(hint.uuid);
			if (existing) {
				existing.name = ref.name;
				this.identIndex.set(key, existing.id);
				return existing;
			}
		}
		const fromIndex = this.identIndex.get(key);
		if (fromIndex) {
			const m = this.pokemon.get(fromIndex);
			if (m) return m;
		}
		// Brand-new mon. Build a stub; subsequent request data fills it in.
		const id = hint?.uuid ?? `${ref.side}:${ref.name}`;
		const fresh: TrackedPokemon = {
			id,
			name: ref.name,
			species: ref.name,
			level: 100,
			condition: "100/100",
			hpFraction: 1,
			status: "",
			boosts: {},
			types: [],
			terastallized: false,
			revealedMoves: new Set(),
			lastMoveFailed: false,
			sameMoveStreak: 0,
			choiceLocked: false,
			volatiles: new Set(),
			fainted: false,
			active: false,
			position: -1,
		};
		this.pokemon.set(id, fresh);
		this.identIndex.set(key, id);
		return fresh;
	}

	/** Look up the active Pokemon at `(side, position)` or `null`. */
	getActive(side: SideId, position: number): TrackedPokemon | null {
		const id = this.active[side][position];
		return id ? this.pokemon.get(id) ?? null : null;
	}

	/** Convenience getter for our own active Pokemon at slot 0. */
	get myActive(): TrackedPokemon | null {
		return this.getActive(this.mySide, 0);
	}

	/** Convenience getter for the foe's active Pokemon at slot 0. */
	get foeActive(): TrackedPokemon | null {
		return this.getActive(this.foeSide, 0);
	}

	/** All mons on a given side, ordered by team slot. */
	getTeam(side: SideId): TrackedPokemon[] {
		const out: TrackedPokemon[] = [];
		for (const mon of this.pokemon.values()) {
			// Only include mons that look like they belong to this side.
			// We track that implicitly via `identIndex` keyed by side, but
			// the canonical answer comes from the most recent request.
			if (mon.id.startsWith(`${side}:`) || this.identIndex.get(`${side}|${mon.name}`) === mon.id) {
				out.push(mon);
			}
		}
		return out;
	}

	// -------------------------------------------------------------------
	// Request ingestion
	// -------------------------------------------------------------------

	/**
	 * Refresh tracker state from a new Showdown request. Idempotent.
	 */
	applyRequest(request: MoveRequest | SwitchRequest | TeamPreviewRequest): void {
		this.lastRequest = request;
		const side = (request as MoveRequest).side as SideRequestData | undefined;
		if (!side) return;
		this.applySideData(this.mySide, side.pokemon);
		if (side.foePokemon) {
			this.applySideData(this.foeSide, side.foePokemon);
		}
		// Rebuild active arrays from the request's authoritative `active` flag.
		this.active[this.mySide] = this.collectActive(this.mySide);
		this.active[this.foeSide] = this.collectActive(this.foeSide);
	}

	/**
	 * Ingest one side's worth of `PokemonSwitchRequestData[]` into the
	 * tracker. Existing tracked records are updated; new entries are
	 * created as needed.
	 */
	private applySideData(side: SideId, mons: PokemonSwitchRequestData[]): void {
		for (const data of mons) {
			if (!data) continue;
			// Build a synthetic ref out of the ident.
			const colonIdx = data.ident.indexOf(":");
			const name = colonIdx >= 0 ? data.ident.slice(colonIdx + 1).trim() : data.ident;
			const ref: PokemonRef = { side, position: data.active ? this.parsePosition(data.ident) : -1, name };
			const tracked = this.resolveByRef(ref, { uuid: data.uuid });
			tracked.name = name;
			tracked.species = (data.details || "").split(",")[0].trim() || tracked.species;
			const levelMatch = /L(\d+)/.exec(data.details || "");
			if (levelMatch) tracked.level = parseInt(levelMatch[1]) || 100;
			tracked.condition = data.condition;
			tracked.hpFraction = parseHpFraction(data.condition);
			tracked.status = data.status ?? extractStatus(data.condition);
			tracked.types = data.types ?? tracked.types;
			tracked.boosts = { ...(data.boosts || tracked.boosts) };
			tracked.baseAbility = data.baseAbility || tracked.baseAbility;
			tracked.ability = data.ability || tracked.ability || tracked.baseAbility;
			// Authoritative item update: an explicit empty string from
			// the request means the item has been consumed/knocked off,
			// so we must not fall back to the prior value.
			if (data.item !== undefined) tracked.item = data.item;
			tracked.stats = data.stats ?? tracked.stats;
			tracked.teraType = data.teraType ?? tracked.teraType;
			if (data.terastallized) {
				tracked.terastallized = true;
				tracked.types = [data.terastallized];
			}
			tracked.fainted = data.condition.endsWith(" fnt");
			tracked.active = !!data.active;
			tracked.position = tracked.active ? this.parsePosition(data.ident) : -1;
			// Seed revealed moves for our side from request, but don't
			// stomp opponent reveals coming from the log.
			if (side === this.mySide) {
				for (const moveId of data.moves || []) {
					if (moveId) tracked.revealedMoves.add(toID(moveId));
				}
			}
		}
	}

	private parsePosition(ident: string): number {
		const m = /^p[1-4]([a-c]):/.exec(ident);
		if (!m) return -1;
		return m[1].charCodeAt(0) - "a".charCodeAt(0);
	}

	private collectActive(side: SideId): MonId[] {
		const arr: MonId[] = [];
		for (const mon of this.pokemon.values()) {
			if (mon.active && mon.position >= 0 && this.identIndex.get(`${side}|${mon.name}`) === mon.id) {
				arr[mon.position] = mon.id;
			}
		}
		return arr;
	}

	// -------------------------------------------------------------------
	// Event ingestion
	// -------------------------------------------------------------------

	/**
	 * Apply a parsed protocol event to the tracker. Safe to call with
	 * any {@link BattleEvent}; unhandled kinds are ignored.
	 */
	applyEvent(event: BattleEvent): void {
		switch (event.kind) {
			case "turn":
				this.turn = event.turn;
				this.tickTimedConditions();
				this._lastMover = null;
				return;
			case "gametype":
				this.gametype = event.gametype;
				return;
			case "gen":
				this.gen = event.gen;
				return;
			case "battlestart":
				this.started = true;
				return;
			case "win":
				this.ended = true;
				this.winner = event.side ?? null;
				this.winnerName = event.name ?? null;
				return;
			case "tie":
				this.ended = true;
				this.winner = null;
				this.winnerName = null;
				return;
			case "move": {
				const mon = this.resolveByRef(event.user);
				const moveId = toID(event.move);
				if (moveId) {
					if (mon.lastMove === moveId) {
						mon.sameMoveStreak += 1;
					} else {
						mon.sameMoveStreak = 1;
					}
					mon.lastMove = moveId;
					mon.revealedMoves.add(moveId);
					// A new move attempt clears the previous failure flag.
					// We re-set it later if a `miss` / `immune` / `fail`
					// follow-up event arrives for this same move.
					mon.lastMoveFailed = false;
					// Choice-lock inference: a foe locked into a single move
					// for two consecutive turns while holding a Choice item
					// (or one we haven't ruled out) must be Choice-locked.
					if (event.user.side === this.foeSide && mon.sameMoveStreak >= 2) {
						mon.choiceLocked = true;
					}
				}
				this._lastMover = mon;
				return;
			}
			case "miss": {
				// `event.source` is the attacker. When it's missing
				// (older protocol), fall back to the most recent mover.
				const mon = event.source ?
					this.resolveByRef(event.source) :
					this._lastMover;
				if (mon) mon.lastMoveFailed = true;
				return;
			}
			case "immune": {
				// `event.pokemon` is the immune *target*; the failing
				// attacker is the most recent mover.
				if (this._lastMover) this._lastMover.lastMoveFailed = true;
				return;
			}
			case "fail": {
				// `event.pokemon` is the failing attacker (or status
				// target whose move/status fizzled — close enough).
				const mon = this.resolveByRef(event.pokemon);
				mon.lastMoveFailed = true;
				return;
			}
			case "switch":
			case "drag": {
				const mon = this.resolveByRef(event.pokemon);
				// Switching out resets boosts, volatiles, and Choice lock.
				const previous = this.getActive(event.pokemon.side, event.pokemon.position);
				if (previous && previous.id !== mon.id) {
					previous.active = false;
					previous.position = -1;
					previous.boosts = {};
					previous.volatiles.clear();
					previous.choiceLocked = false;
					previous.sameMoveStreak = 0;
				}
				mon.active = true;
				mon.position = event.pokemon.position;
				mon.species = (event.details || "").split(",")[0].trim() || mon.species;
				const levelMatch = /L(\d+)/.exec(event.details || "");
				if (levelMatch) mon.level = parseInt(levelMatch[1]) || mon.level;
				mon.condition = `${event.hp || mon.condition}${event.status ? ` ${event.status}` : ""}`;
				mon.hpFraction = parseHpFraction(mon.condition);
				mon.status = event.status || "";
				mon.boosts = {};
				mon.volatiles.clear();
				mon.choiceLocked = false;
				mon.sameMoveStreak = 0;
				if (
					isSideId(event.pokemon.side) &&
					isValidActivePosition(event.pokemon.position)
				) {
					this.active[event.pokemon.side][event.pokemon.position] = mon.id;
				}
				return;
			}
			case "faint": {
				const mon = this.resolveByRef(event.pokemon);
				mon.fainted = true;
				mon.active = false;
				mon.hpFraction = 0;
				mon.condition = "0 fnt";
				if (!isSideId(event.pokemon.side)) return;
				this.sides[event.pokemon.side].fainted += 1;
				const slotIdx = event.pokemon.position;
				if (isValidActivePosition(slotIdx) && this.active[event.pokemon.side][slotIdx] === mon.id) {
					this.active[event.pokemon.side][slotIdx] = "";
				}
				return;
			}
			case "damage":
			case "heal":
			case "sethp": {
				const mon = this.resolveByRef(event.pokemon);
				const hp = event.hp;
				const status = (event as { status?: string }).status ?? "";
				if (hp.endsWith("fnt") || hp === "0") {
					mon.hpFraction = 0;
				} else {
					mon.hpFraction = parseHpFraction(`${hp}${status ? ` ${status}` : ""}`);
				}
				mon.condition = `${hp}${status ? ` ${status}` : ""}`;
				if (status) mon.status = status;
				return;
			}
			case "status": {
				const mon = this.resolveByRef(event.pokemon);
				mon.status = event.status;
				return;
			}
			case "curestatus": {
				const mon = this.resolveByRef(event.pokemon);
				mon.status = "";
				return;
			}
			case "boost":
			case "unboost":
			case "setboost": {
				const mon = this.resolveByRef(event.pokemon);
				const cur = mon.boosts[event.stat] || 0;
				if (event.kind === "boost") {
					mon.boosts[event.stat] = clampStage(cur + event.amount);
				} else if (event.kind === "unboost") {
					mon.boosts[event.stat] = clampStage(cur - event.amount);
				} else {
					mon.boosts[event.stat] = clampStage(event.amount);
				}
				return;
			}
			case "clearboost": {
				const mon = this.resolveByRef(event.pokemon);
				mon.boosts = {};
				return;
			}
			case "clearallboost":
				for (const mon of this.pokemon.values()) mon.boosts = {};
				return;
			case "clearpositiveboost": {
				const mon = this.resolveByRef(event.target);
				for (const k of Object.keys(mon.boosts)) {
					if ((mon.boosts[k] || 0) > 0) mon.boosts[k] = 0;
				}
				return;
			}
			case "clearnegativeboost": {
				const mon = this.resolveByRef(event.pokemon);
				for (const k of Object.keys(mon.boosts)) {
					if ((mon.boosts[k] || 0) < 0) mon.boosts[k] = 0;
				}
				return;
			}
			case "invertboost": {
				const mon = this.resolveByRef(event.pokemon);
				for (const k of Object.keys(mon.boosts)) {
					mon.boosts[k] = -(mon.boosts[k] || 0);
				}
				return;
			}
			case "weather":
				if (event.weather === "none" || event.upkeep) {
					if (event.weather === "none") {
						this.field.weather = "";
						this.field.weatherTurns = 0;
					}
				} else {
					this.field.weather = toID(event.weather);
					// Weather lasts 5 turns by default; 8 with the matching rock.
					this.field.weatherTurns = 5;
				}
				return;
			case "fieldstart": {
				const id = toID(event.condition);
				if (id === "trickroom") {
					this.field.trickRoom = true;
					this.field.trickRoomTurns = 5;
				} else if (id === "magicroom") {
					this.field.magicRoom = true;
				} else if (id === "wonderroom") {
					this.field.wonderRoom = true;
				} else if (id === "gravity") {
					this.field.gravity = true;
					this.field.gravityTurns = 5;
				} else if (id === "electricterrain" || id === "grassyterrain" || id === "mistyterrain" || id === "psychicterrain") {
					this.field.terrain = id;
					this.field.terrainTurns = 5;
				}
				return;
			}
			case "fieldend": {
				const id = toID(event.condition);
				if (id === "trickroom") {
					this.field.trickRoom = false;
					this.field.trickRoomTurns = 0;
				} else if (id === "magicroom") {
					this.field.magicRoom = false;
				} else if (id === "wonderroom") {
					this.field.wonderRoom = false;
				} else if (id === "gravity") {
					this.field.gravity = false;
					this.field.gravityTurns = 0;
				} else if (id === this.field.terrain) {
					this.field.terrain = "";
					this.field.terrainTurns = 0;
				}
				return;
			}
			case "sidestart": {
				if (!isSideId(event.side)) return;
				const ss = this.sides[event.side];
				const id = toID(event.condition);
				switch (id) {
					case "stealthrock": ss.stealthRock = true; break;
					case "spikes": ss.spikes = Math.min(3, ss.spikes + 1); break;
					case "toxicspikes": ss.toxicSpikes = Math.min(2, ss.toxicSpikes + 1); break;
					case "stickyweb": ss.stickyWeb = true; break;
					case "reflect": ss.reflectTurns = 5; break;
					case "lightscreen": ss.lightScreenTurns = 5; break;
					case "auroraveil": ss.auroraVeilTurns = 5; break;
					case "tailwind": ss.tailwindTurns = 4; break;
					case "safeguard": ss.safeguardTurns = 5; break;
					case "mist": ss.mistTurns = 5; break;
				}
				return;
			}
			case "sideend": {
				if (!isSideId(event.side)) return;
				const ss = this.sides[event.side];
				const id = toID(event.condition);
				switch (id) {
					case "stealthrock": ss.stealthRock = false; break;
					case "spikes": ss.spikes = 0; break;
					case "toxicspikes": ss.toxicSpikes = 0; break;
					case "stickyweb": ss.stickyWeb = false; break;
					case "reflect": ss.reflectTurns = 0; break;
					case "lightscreen": ss.lightScreenTurns = 0; break;
					case "auroraveil": ss.auroraVeilTurns = 0; break;
					case "tailwind": ss.tailwindTurns = 0; break;
					case "safeguard": ss.safeguardTurns = 0; break;
					case "mist": ss.mistTurns = 0; break;
				}
				return;
			}
			case "swapsideconditions": {
				const tmp = this.sides[this.mySide];
				this.sides[this.mySide] = this.sides[this.foeSide];
				this.sides[this.foeSide] = tmp;
				return;
			}
			case "ability": {
				const mon = this.resolveByRef(event.pokemon);
				mon.ability = toID(event.ability);
				// Only seed `baseAbility` from a fresh, non-derived reveal.
				// Trace / Imposter / Skill Swap / Role Play / etc. show up
				// with an `event.from` describing the source effect; those
				// expose the *acquired* ability, not the species' own.
				if (!mon.baseAbility && !event.from) {
					mon.baseAbility = mon.ability;
				}
				return;
			}
			case "endability": {
				const mon = this.resolveByRef(event.pokemon);
				mon.ability = "";
				return;
			}
			case "item": {
				const mon = this.resolveByRef(event.pokemon);
				mon.item = toID(event.item);
				return;
			}
			case "enditem": {
				const mon = this.resolveByRef(event.pokemon);
				mon.item = "";
				return;
			}
			case "transform": {
				const mon = this.resolveByRef(event.pokemon);
				mon.species = event.species;
				return;
			}
			case "mega": {
				const mon = this.resolveByRef(event.pokemon);
				mon.volatiles.add("mega");
				return;
			}
			case "primal": {
				const mon = this.resolveByRef(event.pokemon);
				mon.volatiles.add("primal");
				return;
			}
			case "burst": {
				const mon = this.resolveByRef(event.pokemon);
				mon.species = event.species;
				mon.volatiles.add("ultraburst");
				return;
			}
			case "zpower": {
				const mon = this.resolveByRef(event.pokemon);
				mon.volatiles.add("zpower");
				return;
			}
			case "terastallize": {
				const mon = this.resolveByRef(event.pokemon);
				mon.terastallized = true;
				mon.teraType = event.type;
				mon.types = [event.type];
				return;
			}
			case "volatilestart": {
				const mon = this.resolveByRef(event.pokemon);
				mon.volatiles.add(toID(event.effect));
				return;
			}
			case "volatileend": {
				const mon = this.resolveByRef(event.pokemon);
				mon.volatiles.delete(toID(event.effect));
				return;
			}
			case "cant": {
				const mon = this.resolveByRef(event.pokemon);
				mon.sameMoveStreak = 0;
				if (event.move) {
					mon.revealedMoves.add(toID(event.move));
				}
				mon.lastMoveFailed = true;
				return;
			}
			default:
				// We deliberately ignore fail/miss/crit/immune/supereffective/
				// resisted etc. for now. They're useful but the current heuristic
				// engine doesn't act on them. Future extensions can hook here.
				return;
		}
	}

	/** Decrement turn-counted side conditions (called from `|turn|`). */
	private tickTimedConditions(): void {
		for (const sideId of [this.mySide, this.foeSide] as SideId[]) {
			const ss = this.sides[sideId];
			ss.reflectTurns = Math.max(0, ss.reflectTurns - 1);
			ss.lightScreenTurns = Math.max(0, ss.lightScreenTurns - 1);
			ss.auroraVeilTurns = Math.max(0, ss.auroraVeilTurns - 1);
			ss.tailwindTurns = Math.max(0, ss.tailwindTurns - 1);
			ss.safeguardTurns = Math.max(0, ss.safeguardTurns - 1);
			ss.mistTurns = Math.max(0, ss.mistTurns - 1);
		}
		this.field.weatherTurns = Math.max(0, this.field.weatherTurns - 1);
		this.field.terrainTurns = Math.max(0, this.field.terrainTurns - 1);
		this.field.trickRoomTurns = Math.max(0, this.field.trickRoomTurns - 1);
		this.field.gravityTurns = Math.max(0, this.field.gravityTurns - 1);
		if (this.field.weatherTurns === 0) this.field.weather = "";
		if (this.field.terrainTurns === 0) this.field.terrain = "";
		if (this.field.trickRoomTurns === 0) this.field.trickRoom = false;
		if (this.field.gravityTurns === 0) this.field.gravity = false;
	}

	// -------------------------------------------------------------------
	// Convenience queries
	// -------------------------------------------------------------------

	/**
	 * True iff the active mon at `(side, position)` is grounded (can be
	 * hit by Earthquake, Spikes, etc.). Considers Levitate, Flying type,
	 * Air Balloon, Magnet Rise, Roost, and Gravity.
	 */
	isGrounded(side: SideId, position: number): boolean {
		const mon = this.getActive(side, position);
		if (!mon) return true;
		return this.isMonGrounded(mon);
	}

	/**
	 * Groundedness check keyed directly off a {@link TrackedPokemon}
	 * snapshot (rather than an active slot). Useful for evaluators that
	 * already hold the mon record and need to know whether terrain
	 * effects (Electric/Misty Terrain status blocks, terrain BP boosts)
	 * apply to it.
	 *
	 * @param mon The tracked Pokemon to test.
	 * @returns true if the mon is grounded.
	 */
	isPokemonGrounded(mon: TrackedPokemon): boolean {
		return this.isMonGrounded(mon);
	}

	/**
	 * Mon-keyed groundedness check, shared between {@link isGrounded}
	 * (the active-slot accessor) and {@link hazardDamageFraction} (the
	 * switch-in projection). Considers Gravity, Iron Ball, Smack Down,
	 * Ingrain, Magnet Rise, Telekinesis, Air Balloon, Levitate, and
	 * Flying type.
	 */
	private isMonGrounded(mon: TrackedPokemon): boolean {
		if (this.field.gravity) return true;
		if (mon.volatiles.has("smackdown") || mon.volatiles.has("ingrain")) return true;
		if (mon.volatiles.has("magnetrise") || mon.volatiles.has("telekinesis")) return false;
		if (mon.item === "ironball") return true;
		if (mon.item === "airballoon") return false;
		if (mon.ability === "levitate") return false;
		if (mon.types.includes("Flying")) return false;
		return true;
	}

	/**
	 * Compute hazard damage in HP fraction units when `mon` switches in
	 * to its current position. Assumes the mon is on `side`. Returns 0
	 * for Heavy-Duty Boots / Magic Guard / Levitate-on-spikes-only cases.
	 */
	hazardDamageFraction(mon: TrackedPokemon, side: SideId): number {
		if (mon.item === "heavydutyboots") return 0;
		if (mon.ability === "magicguard") return 0;
		const ss = this.sides[side];
		let damage = 0;
		if (ss.stealthRock) {
			// Use type chart: SR is Rock-type; effectiveness multiplier from Dex.
			const eff = effectivenessLog(["Rock"], mon.types);
			damage += 0.125 * 2 ** eff;
		}
		if (this.isMonGrounded(mon)) {
			if (ss.spikes === 1) damage += 1 / 8;
			else if (ss.spikes === 2) damage += 1 / 6;
			else if (ss.spikes >= 3) damage += 1 / 4;
		}
		return damage;
	}

	/** True if at least one non-fainted, non-active Pokemon is on the bench. */
	hasBench(side: SideId): boolean {
		const team = this.getTeam(side);
		return team.some(m => !m.fainted && !m.active);
	}

	/** All non-fainted, non-active mons. */
	getBench(side: SideId): TrackedPokemon[] {
		return this.getTeam(side).filter(m => !m.fainted && !m.active);
	}

	/**
	 * Slot-number (1-indexed) of a tracked Pokemon, matching the order
	 * the most recent request listed it in. Used to build `switch N`
	 * commands. Returns -1 if not found in the latest request.
	 */
	slotOf(mon: TrackedPokemon): number {
		const req = this.lastRequest;
		const side = (req)?.side;
		if (!side) return -1;
		for (let i = 0; i < side.pokemon.length; i++) {
			const p = side.pokemon[i];
			if (!p) continue;
			// Match by uuid first (PokeBedrock), then by name.
			if ((p.uuid && p.uuid === mon.id) || identMatches(p.ident, mon.name)) {
				return i + 1;
			}
		}
		return -1;
	}

	/** True if {@link MoveRequest.active} indicates the mon is trapped. */
	isTrapped(activeReq: PokemonMoveRequestData | undefined): boolean {
		if (!activeReq) return false;
		return !!activeReq.trapped;
	}
}

// -----------------------------------------------------------------------
// Helpers (file-private)
// -----------------------------------------------------------------------

function identMatches(ident: string, name: string): boolean {
	const colon = ident.indexOf(":");
	if (colon < 0) return false;
	return ident.slice(colon + 1).trim() === name;
}

/**
 * True if `position` is a real active-slot index (0..2). Active slots
 * in the Showdown protocol are encoded as `a`, `b`, `c` after the side
 * id, mapped to 0/1/2 by {@link parsePokemonRef}. Anything else (notably
 * `-1` for benched references) must not be used to index into the
 * per-side active arrays.
 */
function isValidActivePosition(position: number): boolean {
	return Number.isInteger(position) && position >= 0 && position <= 2;
}

function clampStage(stage: number): number {
	if (stage > 6) return 6;
	if (stage < -6) return -6;
	return stage;
}

function parseHpFraction(condition: string): number {
	if (!condition) return 0;
	const head = condition.split(" ")[0];
	if (head === "0" || head.endsWith("fnt")) return 0;
	const slash = head.indexOf("/");
	if (slash < 0) {
		const v = parseInt(head);
		return Number.isFinite(v) ? v / 100 : 0;
	}
	const cur = parseInt(head.slice(0, slash));
	const max = parseInt(head.slice(slash + 1));
	if (!Number.isFinite(cur) || !Number.isFinite(max) || max <= 0) return 0;
	return Math.max(0, Math.min(1, cur / max));
}

function extractStatus(condition: string): string {
	const parts = condition.split(" ");
	if (parts.length < 2) return "";
	return parts[1].trim();
}

/**
 * Sum of `Dex.getEffectiveness` log2 exponents for `attackingType` vs
 * `defenderTypes`. Use `Math.pow(2, result)` to convert to a multiplier.
 *
 * Note that `Dex.getEffectiveness` returns 0/1/-1 (i.e. log2 of the
 * actual multiplier). The return value of this helper is also in log2.
 */
function effectivenessLog(attackingTypes: string[], defenderTypes: string[]): number {
	let total = 0;
	for (const a of attackingTypes) {
		for (const d of defenderTypes) {
			total += Dex.getEffectiveness(a, d);
		}
	}
	return total;
}
