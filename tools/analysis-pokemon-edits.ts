/**
 * Pokémon state edits at an analysis node (docs/analysis/plan.md, Phase 2b-1 and 2b-2): which Pokémon is
 * active, HP, PP, status, boosts, Terastallization, Mega Evolution and volatiles.
 *
 * Like the field edits (analysis-edits.ts), these write sim state directly and emit `[silent]` protocol
 * lines for what changed, plus `-message|analysiscounter` lines for the toxic and sleep counters, which the
 * protocol can't set. Terastallizing, Mega Evolving and volatiles are the exception: they go through the
 * sim's own `battle.actions` / `addVolatile`, because they change forme, types, ability and HP, and
 * re-implementing that here would drift from the sim. Tera and Mega can't be undone through the form (the
 * protocol has no way to say "un-Terastallize"); volatiles can. Conditions that announce themselves keep
 * their own lines; the quiet ones get a `[silent]` stand-in, see `logging`.
 */
import type { Battle } from '../sim/battle';
import type { Pokemon } from '../sim/pokemon';
import type { Side } from '../sim/side';
import { toID } from '../sim/dex';
import type {
	AnalysisEditLine, AnalysisEditSummary, AnalysisEdits, AnalysisPokemonStateEdit, AnalysisSideEditsID,
} from './analysis-state';

const STATUSES = ['', 'brn', 'par', 'slp', 'frz', 'psn', 'tox'];
const STATUS_NAMES: { [id: string]: string } = {
	brn: 'Burn', par: 'Paralysis', slp: 'Sleep', frz: 'Freeze', psn: 'Poison', tox: 'Toxic',
};
const BOOST_NAMES: { [stat: string]: string } = {
	atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe', accuracy: 'Accuracy', evasion: 'Evasion',
};
const DEFAULT_SLEEP_TURNS = 3;
const MAX_STATUS_TURNS = 99;
/** confusion rolls `random(2, 6)`; a manually added one always gets the longest roll */
const MAX_CONFUSION_TURNS = 5;
/** partial trapping rolls `random(5, 7)`, or a flat 8 when the trapper holds a Grip Claw */
const MAX_TRAP_TURNS = 6;
const GRIP_CLAW_TRAP_TURNS = 8;

/**
 * The volatiles the analysis panel can set (docs/analysis/plan.md, Phase 2b-2), and what each needs beyond
 * its id. This table is also the whitelist: an edit naming anything else is dropped.
 *
 * - `source`: the volatile hangs off an opposing Pokémon, so the edit names a foe slot.
 * - `sourceMove`: the condition reads `effectState.sourceEffect`, so it must be attributed to a move.
 * - `gen`: only settable in that generation.
 */
const VOLATILES: { [id: string]: { name: string, source?: boolean, sourceMove?: string, gen?: number } } = {
	aquaring: { name: 'Aqua Ring' },
	charge: { name: 'Charge' },
	confusion: { name: 'Confusion' },
	curse: { name: 'Curse' },
	destinybond: { name: 'Destiny Bond' },
	dragoncheer: { name: 'Dragon Cheer' },
	dynamax: { name: 'Dynamax', gen: 8 },
	embargo: { name: 'Embargo' },
	flashfire: { name: 'Flash Fire' },
	focusenergy: { name: 'Focus Energy' },
	foresight: { name: 'Foresight' },
	gastroacid: { name: 'Gastro Acid' },
	healblock: { name: 'Heal Block' },
	laserfocus: { name: 'Laser Focus' },
	leechseed: { name: 'Leech Seed', source: true },
	magnetrise: { name: 'Magnet Rise' },
	minimize: { name: 'Minimize' },
	miracleeye: { name: 'Miracle Eye' },
	nightmare: { name: 'Nightmare' },
	octolock: { name: 'Octolock' },
	// Wrap is the neutral choice; the move's name shows in the log line and in the residual damage message
	partiallytrapped: { name: 'Partially Trapped', source: true, sourceMove: 'wrap' },
	powershift: { name: 'Power Shift' },
	powertrick: { name: 'Power Trick' },
	saltcure: { name: 'Salt Cure' },
	smackdown: { name: 'Smack Down' },
	substitute: { name: 'Substitute' },
	syrupbomb: { name: 'Syrup Bomb' },
	yawn: { name: 'Yawn' },
};

function clamp(value: unknown, low: number, high: number, fallback: number) {
	const number = Math.trunc(Number(value));
	return Number.isFinite(number) ? Math.min(high, Math.max(low, number)) : fallback;
}

export class AnalysisPokemonEditor {
	battle: Battle;
	applied: Pick<AnalysisEdits, 'active' | 'pokemon'> = {};
	summary: AnalysisEditSummary = { field: [], p1: [], p2: [] };
	lines: AnalysisEditLine[] = [];
	droppedEdits: string[] = [];

	constructor(battle: Battle) {
		this.battle = battle;
	}

	side(sideId: AnalysisSideEditsID) {
		return this.battle.sides[sideId === 'p1' ? 0 : 1] as Side | undefined;
	}

	/**
	 * Edits name a Pokémon by its slot in the original team, which never changes. Its index in
	 * `side.pokemon` does: the sim moves the Pokémon that switches in to the front.
	 */
	find(sideId: AnalysisSideEditsID, teamSlot: number) {
		const side = this.side(sideId);
		if (!side) return null;
		for (const pokemon of side.pokemon) {
			if (side.team.indexOf(pokemon.set) === teamSlot) return pokemon;
		}
		return null;
	}

	note(sideId: AnalysisSideEditsID, pokemon: Pokemon, change: string) {
		this.summary[sideId].push(`${pokemon.name}: ${change}`);
	}

	drop(sideId: AnalysisSideEditsID, teamSlot: number, reason: string) {
		this.droppedEdits.push(`${sideId} #${teamSlot + 1}: ${reason}`);
	}

	teamSlot(pokemon: Pokemon) {
		return pokemon.side.team.indexOf(pokemon.set);
	}

	/**
	 * Puts `index` into active slot `slot`, the way `BattleActions.switchIn` does but without running any
	 * switch-in events: the two Pokémon swap places in `side.pokemon` and the outgoing one loses its
	 * volatiles and boosts.
	 */
	setActive(sideId: AnalysisSideEditsID, slot: number, teamSlot: number, revivedHP = 0) {
		const side = this.side(sideId);
		const incoming = this.find(sideId, teamSlot);
		if (!side || !incoming || slot >= side.active.length) {
			this.drop(sideId, teamSlot, `can't be sent to slot ${slot + 1}`);
			return;
		}
		if (side.active[slot] === incoming) return;
		if (incoming.fainted) {
			// unless the same save also revives it: swaps run first, so the HP edit hasn't been applied yet
			if (!revivedHP) {
				this.drop(sideId, teamSlot, `${incoming.name} has fainted`);
				return;
			}
			this.revive(incoming);
			incoming.hp = Math.min(revivedHP, incoming.maxhp);
		}
		if (incoming.isActive) {
			this.swapActive(sideId, slot, incoming, teamSlot);
			return;
		}
		const outgoing = side.active[slot];
		const outgoingIndex = side.pokemon.indexOf(incoming);
		if (outgoing) {
			outgoing.clearVolatile();
			outgoing.isActive = false;
			outgoing.isStarted = false;
			outgoing.position = outgoingIndex;
			side.pokemon[outgoingIndex] = outgoing;
		}
		side.pokemon[slot] = incoming;
		side.active[slot] = incoming;
		incoming.isActive = true;
		incoming.isStarted = true;
		incoming.position = slot;
		incoming.activeTurns = 0;
		incoming.activeMoveActions = 0;
		incoming.newlySwitched = true;
		this.lines.push(['switch', incoming, incoming.getFullDetails]);
		((this.applied.active ||= {})[sideId] ||= [])[slot] = teamSlot;
		this.note(sideId, incoming, `Active (Slot ${slot + 1})`);
	}

	/**
	 * The wanted Pokémon is already out, in a different slot, so the two of them trade places rather than the
	 * edit being refused.
	 *
	 * `edits.active` is an absolute arrangement of the side's slots, applied left to right against the
	 * position as it stood. Without this, any arrangement that merely *moves* an active Pokémon is
	 * unsatisfiable: "put the slot-2 Pokémon into slot 1" was dropped, and because `droppedEdits` isn't
	 * displayed, it looked like the click did nothing at all. Filling each slot in turn and swapping when the
	 * Pokémon is already out is selection sort, so every arrangement is now reachable.
	 */
	swapActive(sideId: AnalysisSideEditsID, slot: number, incoming: Pokemon, teamSlot: number) {
		const side = incoming.side;
		const from = side.active.indexOf(incoming);
		const outgoing = side.active[slot];
		if (from < 0 || !outgoing) {
			this.drop(sideId, teamSlot, `${incoming.name} can't be moved to slot ${slot + 1}`);
			return;
		}
		/*
		 * The ident has to be captured *before* the move. `Pokemon.toString()` builds it from `position`, and
		 * these lines are only serialized once every edit has been applied, so passing the object would name
		 * the slot it ends up in — which the renderer resolves to whoever is still sitting there, making the
		 * swap a no-op on its side while the sim went ahead.
		 */
		const ident = incoming.toString();
		// the sim keeps every active Pokémon at its own index in `side.pokemon`, so both arrays move together
		side.active[slot] = incoming;
		side.active[from] = outgoing;
		side.pokemon[slot] = incoming;
		side.pokemon[from] = outgoing;
		incoming.position = slot;
		outgoing.position = from;
		// `|swap|POKEMON|SLOT` is the Ally Switch line; the renderer's `swapTo` does exactly this
		this.lines.push(['swap', ident, `${slot}`, '[silent]']);
		((this.applied.active ||= {})[sideId] ||= [])[slot] = teamSlot;
		this.note(sideId, incoming, `Active (Slot ${slot + 1})`);
	}

	applyStatus(sideId: AnalysisSideEditsID, pokemon: Pokemon, edit: AnalysisPokemonStateEdit) {
		const wanted = edit.status === undefined ? pokemon.status : toID(edit.status);
		if (!STATUSES.includes(wanted)) {
			this.drop(sideId, this.teamSlot(pokemon), `unknown status ${edit.status}`);
			return {};
		}
		if (pokemon.fainted && wanted) {
			this.drop(sideId, this.teamSlot(pokemon), `${pokemon.name} has fainted`);
			return {};
		}
		const stage = wanted === 'tox' ? clamp(edit.toxicStage ?? pokemon.statusState.stage, 0, MAX_STATUS_TURNS, 0) : 0;
		const time = wanted === 'slp' ?
			clamp(edit.sleepTurns ?? pokemon.statusState.time, 1, MAX_STATUS_TURNS, DEFAULT_SLEEP_TURNS) : 0;
		const changed = wanted !== pokemon.status ||
			(wanted === 'tox' && stage !== pokemon.statusState.stage) ||
			(wanted === 'slp' && time !== pokemon.statusState.time);
		if (!changed) return { status: pokemon.status };
		if (pokemon.status && pokemon.status !== wanted) {
			this.lines.push(['-curestatus', pokemon, pokemon.status, '[silent]']);
		}
		if (!wanted) {
			pokemon.status = '' as Pokemon['status'];
			pokemon.statusState = this.battle.initEffectState({ id: '' });
			this.note(sideId, pokemon, 'Status (None)');
			return { status: '' };
		}
		const isNew = pokemon.status !== wanted;
		pokemon.status = wanted as Pokemon['status'];
		pokemon.statusState = this.battle.initEffectState({
			id: wanted, target: pokemon, ...(wanted === 'tox' ? { stage } : {}),
			...(wanted === 'slp' ? { startTime: time, time } : {}),
		});
		if (isNew) this.lines.push(['-status', pokemon, wanted, '[silent]']);
		// the protocol has no way to set these counters, so analysis-battle.ts reads them off these lines
		if (wanted === 'tox') this.lines.push(['-message', 'analysiscounter', pokemon, 'toxic', `${stage}`, '[silent]']);
		if (wanted === 'slp') this.lines.push(['-message', 'analysiscounter', pokemon, 'sleep', `${time}`, '[silent]']);
		const detail = wanted === 'tox' ? `Toxic, stage ${stage}` : wanted === 'slp' ? `Sleep, ${time} turns` :
			STATUS_NAMES[wanted];
		this.note(sideId, pokemon, `Status (${detail})`);
		return {
			status: wanted,
			toxicStage: wanted === 'tox' ? stage : undefined,
			sleepTurns: wanted === 'slp' ? time : undefined,
		};
	}

	/**
	 * HP, and with it fainting (user request, 2026-09-18).
	 *
	 * A **benched** Pokémon can be set to 0, which faints it, and back above 0, which revives it. Reviving
	 * has to work, or a stray 0 would trap the node: the panel is the only way to take the edit off again.
	 *
	 * An **active** Pokémon is still clamped to at least 1, so the form can't KO whatever is on the field.
	 * That clamp is also what makes "set 0, then Set Active" land as *active at 1 HP*, with no special case:
	 * active swaps run before state edits, so by the time this runs the Pokémon is no longer benched.
	 */
	applyHP(sideId: AnalysisSideEditsID, pokemon: Pokemon, hp: number) {
		const lowest = pokemon.isActive ? 1 : 0;
		const wanted = clamp(hp, lowest, pokemon.maxhp, pokemon.hp);
		if (wanted === pokemon.hp) return undefined;
		const percent = Math.round(1000 * wanted / pokemon.maxhp) / 10;
		if (!wanted) {
			this.faint(pokemon);
			this.note(sideId, pokemon, `Fainted`);
			return wanted;
		}
		if (pokemon.fainted) this.revive(pokemon);
		pokemon.hp = wanted;
		// the status has to be repeated, or the client clears it
		const status = pokemon.status ? ` ${pokemon.status}` : '';
		this.lines.push(['-sethp', pokemon, `${wanted}/${pokemon.maxhp}${status}`, '[silent]']);
		this.note(sideId, pokemon, `HP (${wanted}/${pokemon.maxhp}, ${percent}%)`);
		return wanted;
	}

	/**
	 * What `faintMessages` does to a Pokémon, minus the events and the ability/item `End` handlers, which
	 * would fire off a benched Pokémon. `clearVolatile` is skipped on purpose: a benched Pokémon has no
	 * volatiles left anyway, and it would reset `moveSlots` from `baseMoveSlots` and wipe this node's PP edits.
	 */
	faint(pokemon: Pokemon) {
		pokemon.hp = 0;
		pokemon.fainted = true;
		pokemon.faintQueued = false;
		pokemon.status = '';
		pokemon.statusState = this.battle.initEffectState({ id: '' });
		pokemon.side.pokemonLeft = Math.max(0, pokemon.side.pokemonLeft - 1);
		pokemon.side.totalFainted++;
		this.markFainted(pokemon, true);
	}

	/** The inverse. */
	revive(pokemon: Pokemon) {
		pokemon.fainted = false;
		pokemon.faintQueued = false;
		pokemon.side.pokemonLeft++;
		pokemon.side.totalFainted = Math.max(0, pokemon.side.totalFainted - 1);
		this.markFainted(pokemon, false);
	}

	/**
	 * Tells the renderer a **benched** Pokémon fainted or came back, so its team icon greys out and clears.
	 *
	 * The protocol can express neither. `|faint|` assumes an active Pokémon: `battle.ts` looks it up by ident
	 * and throws on `poke.side` for one the renderer has never seen, because team-preview entries have no
	 * ident until they switch in. There is no revive line at all. So this rides on the `analysis*` escape
	 * hatch (`analysis-battle.ts`), and names the Pokémon by **team slot** — the order the renderer keeps its
	 * own `side.pokemon` in — rather than by an ident that may not resolve.
	 */
	markFainted(pokemon: Pokemon, fainted: boolean) {
		const side = pokemon.side.id;
		this.lines.push(['-message', 'analysisfaint', side, `${this.teamSlot(pokemon)}`, fainted ? '1' : '0', '[silent]']);
	}

	/**
	 * PP is named by move id, so an edit for a move the Pokémon no longer has just doesn't apply — no
	 * cross-layer invalidation needed, and a move change and its new PP can be saved together.
	 */
	applyPP(sideId: AnalysisSideEditsID, pokemon: Pokemon, pp: { [moveid: string]: number }) {
		const applied: { [moveid: string]: number } = {};
		for (const [moveid, wanted] of Object.entries(pp)) {
			if (wanted === null || wanted === undefined) continue;
			const moveSlot = pokemon.moveSlots.find(entry => entry.id === toID(moveid));
			if (!moveSlot) {
				this.drop(sideId, this.teamSlot(pokemon), `${moveid} is no longer one of ${pokemon.name}'s moves`);
				continue;
			}
			const value = clamp(wanted, 0, moveSlot.maxpp, moveSlot.pp);
			applied[moveSlot.id] = value;
			if (value === moveSlot.pp) continue;
			moveSlot.pp = value;
			// PP isn't in the protocol; the client reads it from the request
			this.note(sideId, pokemon, `${moveSlot.move} PP (${value}/${moveSlot.maxpp})`);
		}
		return Object.keys(applied).length ? applied : undefined;
	}

	/**
	 * The Pokémon's current types, which moves like Soak and Reflect Type change mid-battle. `setType`
	 * with `enforce` skips the sim's own guards (Arceus, Terastallization) and fires no events, so it's
	 * safe here; the renderer picks the change up from the `typechange` line.
	 */
	applyTypes(sideId: AnalysisSideEditsID, pokemon: Pokemon, types: string[]) {
		const wanted: string[] = [];
		for (const type of types) {
			const name = this.battle.dex.types.get(type).name;
			if (name && !wanted.includes(name)) wanted.push(name);
		}
		if (!wanted.length) {
			this.drop(sideId, this.teamSlot(pokemon), `a Pokémon needs at least one type`);
			return undefined;
		}
		if (pokemon.terastallized) {
			this.drop(sideId, this.teamSlot(pokemon), `${pokemon.name} is Terastallized, so its types are fixed`);
			return undefined;
		}
		if (wanted.join('/') === pokemon.getTypes().join('/')) return undefined;
		pokemon.setType(wanted, true);
		this.lines.push(['-start', pokemon, 'typechange', wanted.join('/'), '[silent]']);
		this.note(sideId, pokemon, `Types (${wanted.join('/')})`);
		return wanted;
	}

	/**
	 * The opposing Pokémon a source-linked volatile hangs off. The edit names a foe *slot*, not a team slot,
	 * because the sim resolves the source positionally too (`getAtSlot(volatiles.leechseed.sourceSlot)`).
	 * An empty or fainted slot falls back to the first available foe, so singles never has to name one.
	 */
	volatileSource(pokemon: Pokemon, params: AnyObject) {
		const foes = pokemon.side.foe.active.filter(foe => foe && !foe.fainted);
		const wanted = pokemon.side.foe.active[Math.trunc(Number(params.source))];
		if (wanted && !wanted.fainted) return wanted;
		return foes[0] || null;
	}

	/**
	 * Volatiles are added through the sim's own `addVolatile` rather than written directly, so their `onStart`
	 * emits the right protocol line for each one (`-singlemove` for Destiny Bond, `-endability` for Gastro
	 * Acid, Dynamax's forme and HP changes) and their side effects match a real battle. Tera and Mega already
	 * work this way. Only the counters `onStart` can't know about are patched in afterwards.
	 */
	applyVolatiles(
		sideId: AnalysisSideEditsID, pokemon: Pokemon, volatiles: NonNullable<AnalysisPokemonStateEdit['volatiles']>
	) {
		if (!pokemon.isActive) {
			this.drop(sideId, this.teamSlot(pokemon), `${pokemon.name} isn't active, so it has no volatiles`);
			return undefined;
		}
		const applied: NonNullable<AnalysisPokemonStateEdit['volatiles']> = {};
		for (const [rawId, params] of Object.entries(volatiles)) {
			const id = toID(rawId);
			const info = VOLATILES[id];
			if (!info || (info.gen && this.battle.gen !== info.gen)) {
				this.drop(sideId, this.teamSlot(pokemon), `${rawId} can't be set in this format`);
				continue;
			}
			const present = !!pokemon.volatiles[id];
			if (!params) {
				if (!present) continue;
				this.logging(() => pokemon.removeVolatile(id), ['-end', pokemon, info.name, '[silent]']);
				applied[id] = null;
				this.note(sideId, pokemon, `${info.name} (Off)`);
				continue;
			}
			const source = info.source ? this.volatileSource(pokemon, params) : null;
			// re-adding is never a no-op: Power Trick and Power Shift toggle themselves off from `onRestart`
			if (present) {
				if (!info.source || pokemon.volatiles[id].sourceSlot === source?.getSlot()) {
					applied[id] = params;
					continue;
				}
				pokemon.removeVolatile(id);
			}
			// partial trapping reads `effectState.sourceEffect.id` every residual, so it must have a move
			const sourceEffect = info.sourceMove ? this.battle.dex.getActiveMove(info.sourceMove) : null;
			const added = this.logging(
				() => pokemon.addVolatile(id, source, sourceEffect), ['-start', pokemon, info.name, '[silent]']
			);
			if (!added) {
				this.drop(sideId, this.teamSlot(pokemon), `${pokemon.name} can't have ${info.name}`);
				continue;
			}
			this.setVolatileCounters(id, pokemon, source);
			applied[id] = params;
			this.note(sideId, pokemon, source && info.source ?
				`${info.name} (from ${source.name})` : `${info.name} (On)`);
		}
		return Object.keys(applied).length ? applied : undefined;
	}

	/**
	 * Runs a sim change and, if it logged nothing, emits `fallback` instead.
	 *
	 * Not every condition announces itself: Aqua Ring has no `onEnd` line, and Minimize has neither an
	 * `onStart` nor an `onEnd` one. Without this the renderer would never learn those volatiles came or went,
	 * and the battle window would drift out of step with the battle. A condition that does emit its own line
	 * keeps it, so Destiny Bond still reads as `-singlemove` and Gastro Acid as `-endability`.
	 */
	logging<T>(change: () => T, fallback: AnalysisEditLine) {
		const before = this.battle.log.length;
		const result = change();
		if (this.battle.log.length === before) this.lines.push(fallback);
		return result;
	}

	/**
	 * Counters `onStart` leaves for the move that normally causes the volatile. Everything else the sim
	 * already fills in, including Substitute's HP (a quarter of max) and Dragon Cheer's frozen Dragon flag.
	 */
	setVolatileCounters(id: string, pokemon: Pokemon, source: Pokemon | null) {
		const state = pokemon.volatiles[id];
		switch (id) {
		case 'confusion':
			// without this, `time--` on the first move makes it NaN and the confusion never wears off
			state.time = MAX_CONFUSION_TURNS;
			break;
		case 'partiallytrapped':
			state.duration = source?.hasItem('gripclaw') ? GRIP_CLAW_TRAP_TURNS : MAX_TRAP_TURNS;
			break;
		case 'yawn':
			// decided default: the Pokémon falls asleep at the end of this turn, not the next one
			state.duration = 1;
			break;
		}
	}

	applyBoosts(sideId: AnalysisSideEditsID, pokemon: Pokemon, boosts: AnalysisPokemonStateEdit['boosts']) {
		if (!pokemon.isActive) {
			this.drop(sideId, this.teamSlot(pokemon), `${pokemon.name} isn't active, so it has no boosts`);
			return undefined;
		}
		const applied: BoostsTable = {} as BoostsTable;
		let changed = false;
		for (const [stat, value] of Object.entries(boosts || {})) {
			if (!BOOST_NAMES[stat]) continue;
			const boost = clamp(value, -6, 6, 0);
			applied[stat as BoostID] = boost;
			if (pokemon.boosts[stat as BoostID] === boost) continue;
			pokemon.boosts[stat as BoostID] = boost;
			changed = true;
			this.lines.push(['-setboost', pokemon, stat, `${boost}`, '[silent]']);
			this.note(sideId, pokemon, `${BOOST_NAMES[stat]} (${boost > 0 ? '+' : ''}${boost})`);
		}
		return changed || Object.keys(applied).length ? applied : undefined;
	}

	/** Terastallization and Mega Evolution run through the sim, and can't be undone here. */
	/**
	 * Takes back a Terastallization from an earlier node or a played turn. The sim needs little unwinding:
	 * `getTypes` derives from the `terastallized` flag and `terastallize` never overwrites `types`, so
	 * clearing the flag restores the typing. What it does do is null `canTerastallize` for the whole side,
	 * which `battle.actions.canTerastallize` recomputes, and append `, tera:TYPE` to `details`.
	 *
	 * The protocol can't express this — no line clears `terastallized` on a living Pokémon — so it rides on
	 * an `analysistera` message that only `analysis-battle.ts` reads.
	 *
	 * Terastallizing permanently changes forme for Ogerpon, Terapagos and Morpeko, and that is **not**
	 * reversed here: the Pokémon keeps the Tera forme while no longer counting as Terastallized. Accepted
	 * as sandbox behaviour (user decision, 2026-09-18) rather than special-cased.
	 */
	unTerastallize(sideId: AnalysisSideEditsID, pokemon: Pokemon) {
		const previous = pokemon.terastallized;
		pokemon.terastallized = '';
		pokemon.apparentType = pokemon.getTypes().join('/');
		pokemon.details = pokemon.getUpdatedDetails();
		for (const ally of pokemon.side.pokemon) {
			ally.canTerastallize = this.battle.actions.canTerastallize(ally);
		}
		this.lines.push(['-message', 'analysistera', pokemon, '', '[silent]']);
		this.note(sideId, pokemon, `Un-Terastallized (was ${previous})`);
	}

	applyTransformation(sideId: AnalysisSideEditsID, pokemon: Pokemon, edit: AnalysisPokemonStateEdit) {
		const applied: { terastallized?: boolean, megaEvolved?: boolean } = {};
		if (pokemon.fainted && (edit.terastallized || edit.megaEvolved)) {
			this.drop(sideId, this.teamSlot(pokemon), `${pokemon.name} has fainted`);
			return applied;
		}
		/*
		 * Unchecking Terastallization works whenever this node's own edit is what applied it: edits are
		 * absolute and the battle is rebuilt from scratch, so "un-Terastallize" just means not doing it.
		 * A Terastallization from an earlier node or a played turn is a different matter — no protocol line
		 * takes it back on a living Pokémon — so that is refused and reported.
		 *
		 * The sim's one-per-side rule is deliberately not enforced: this is a sandbox (user decision,
		 * 2026-09-18), so several Pokémon on a team may be Terastallized at once.
		 */
		if (edit.terastallized !== undefined) {
			if (!edit.terastallized) {
				if (pokemon.terastallized) {
					this.unTerastallize(sideId, pokemon);
					applied.terastallized = false;
				}
			} else if (pokemon.terastallized) {
				// already Terastallized by an earlier node or a played turn: this edit changes nothing
			} else if (pokemon.teraType) {
				// benched Pokémon may Terastallize too: nothing in the sim or the renderer needs it to be on
				// the field, and `terastallized` is a Pokemon field, so it survives switching in
				this.battle.actions.terastallize(pokemon);
				if (pokemon.terastallized) {
					applied.terastallized = true;
					this.note(sideId, pokemon, `Terastallized (${pokemon.terastallized})`);
				} else {
					// the sim refuses some combinations outright, e.g. Ogerpon into the wrong type
					this.drop(sideId, this.teamSlot(pokemon), `${pokemon.name} can't Terastallize into ${pokemon.teraType}`);
				}
			} else {
				this.drop(sideId, this.teamSlot(pokemon), `${pokemon.name} can't Terastallize`);
			}
		}
		if (edit.megaEvolved !== undefined) {
			if (pokemon.species.isMega) {
				applied.megaEvolved = true;
				if (!edit.megaEvolved) this.drop(sideId, this.teamSlot(pokemon), `${pokemon.name} can't revert its Mega Evolution`);
			} else if (edit.megaEvolved) {
				if (pokemon.canMegaEvo && pokemon.isActive) {
					this.battle.actions.runMegaEvo(pokemon);
					applied.megaEvolved = true;
					this.note(sideId, pokemon, `Mega Evolved (${pokemon.species.name})`);
				} else {
					this.drop(sideId, this.teamSlot(pokemon), `${pokemon.name} can't Mega Evolve`);
				}
			}
		}
		return applied;
	}

	applyPokemon(sideId: AnalysisSideEditsID, teamSlot: number, edit: AnalysisPokemonStateEdit) {
		const pokemon = this.find(sideId, teamSlot);
		if (!pokemon) {
			this.drop(sideId, teamSlot, `no Pokémon in this team slot`);
			return;
		}
		const applied: AnalysisPokemonStateEdit = {};
		/*
		 * Status still runs before HP, so the `-sethp` line can repeat the status the same save just set.
		 * But an edit that faints this Pokémon has to veto it up front: nothing is fainted yet at this point,
		 * so `applyStatus`'s own guard wouldn't fire, and the Pokémon would end up fainted *and* statused.
		 */
		const faints = edit.hp !== undefined && edit.hp <= 0 && !pokemon.isActive;
		if (faints) {
			if (edit.status) this.drop(sideId, teamSlot, `${pokemon.name} has fainted`);
		} else {
			Object.assign(applied, this.applyStatus(sideId, pokemon, edit));
		}
		if (edit.hp !== undefined) applied.hp = this.applyHP(sideId, pokemon, edit.hp);
		if (edit.pp) applied.pp = this.applyPP(sideId, pokemon, edit.pp);
		if (edit.types) applied.types = this.applyTypes(sideId, pokemon, edit.types);
		if (edit.boosts) applied.boosts = this.applyBoosts(sideId, pokemon, edit.boosts);
		if (edit.volatiles) applied.volatiles = this.applyVolatiles(sideId, pokemon, edit.volatiles);
		Object.assign(applied, this.applyTransformation(sideId, pokemon, edit));
		for (const [key, value] of Object.entries(applied)) {
			if (value === undefined) delete (applied as AnyObject)[key];
		}
		if (Object.keys(applied).length) ((this.applied.pokemon ||= {})[`${sideId}:${teamSlot}`] = applied);
	}

	/**
	 * Active swaps run first, so state edits see the Pokémon as they will be (a Pokémon sent out here can be
	 * given boosts in the same save). Order is safe either way, because edits name Pokémon by team slot.
	 */
	apply(edits: AnalysisEdits, invalidatedSlots = new Set<string>()) {
		for (const sideId of ['p1', 'p2'] as const) {
			const active = edits.active?.[sideId] || [];
			for (let slot = 0; slot < active.length; slot++) {
				const teamSlot = active[slot];
				if (teamSlot === null || teamSlot === undefined) continue;
				if (invalidatedSlots.has(`${sideId}:${teamSlot}`)) {
					this.drop(sideId, teamSlot, `a team edit removed this Pokémon`);
					continue;
				}
				this.setActive(sideId, slot, teamSlot, edits.pokemon?.[`${sideId}:${teamSlot}`]?.hp || 0);
			}
		}
		for (const [key, edit] of Object.entries(edits.pokemon || {})) {
			const [sideId, teamSlot] = key.split(':');
			if (sideId !== 'p1' && sideId !== 'p2') continue;
			if (invalidatedSlots.has(key)) {
				this.drop(sideId, Number(teamSlot), `a team edit removed this Pokémon`);
				continue;
			}
			this.applyPokemon(sideId, Number(teamSlot), edit);
		}
	}

	get changed() {
		return this.summary.p1.length > 0 || this.summary.p2.length > 0;
	}
}
