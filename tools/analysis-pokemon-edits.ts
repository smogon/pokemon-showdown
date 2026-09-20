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
import {
	ANALYSIS_RAW_LINE, type AnalysisEditLine, type AnalysisEditSummary, type AnalysisEdits,
	type AnalysisPokemonStateEdit, type AnalysisSideEditsID,
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
/** history counters are plain tallies; this is only a sanity bound, well past any real battle */
const MAX_HISTORY_COUNT = 999;
/** the sim's `stall` counter tops out at `counterMax` 729, which is 3^6 */
const MAX_STALL_COUNT = 6;

/**
 * The volatiles the analysis panel can set (docs/analysis/plan.md, Phase 2b-2), and what each needs beyond
 * its id. This table is also the whitelist: an edit naming anything else is dropped.
 *
 * - `source`: the volatile hangs off an opposing Pokémon, so the edit names a foe slot.
 * - `sourceMove`: the condition reads `effectState.sourceEffect`, so it must be attributed to a move.
 * - `gen`: only settable in that generation.
 * - `boosterUnless`: the ability takes its own volatile back unless this field condition is up, so without
 *   it the edit has to be attributed to a Booster Energy (see `needsBooster`).
 */
const VOLATILES: {
	[id: string]: {
		name: string, source?: boolean, sourceMove?: string, gen?: number, move?: boolean,
		boosterUnless?: { kind: 'weather' | 'terrain', id: string },
	},
} = {
	aquaring: { name: 'Aqua Ring' },
	charge: { name: 'Charge' },
	confusion: { name: 'Confusion' },
	curse: { name: 'Curse' },
	destinybond: { name: 'Destiny Bond' },
	// Which move is locked is in the replay log (`|-start|POKEMON|Disable|Shadow Sneak|...`), even though
	// the client `Battle` throws that argument away, so a replay import can restore it exactly.
	disable: { name: 'Disable', move: true },
	dragoncheer: { name: 'Dragon Cheer' },
	dynamax: { name: 'Dynamax', gen: 8 },
	embargo: { name: 'Embargo' },
	/*
	 * Deliberately no `move`, unlike Disable. Encore's `onStart` locks whatever `lastMove` is, and that is
	 * already the right answer for a replay: while a Pokémon is encored it can only repeat the encored move,
	 * so its last move *is* the locked one. The log carries no argument to override it with either
	 * (`|-start|POKEMON|Encore`, no third field), so a replacement line would invent a format the sim never
	 * emits. The history layer runs before the volatiles, which is what makes `lastMove` available at all —
	 * without it `onStart` refuses outright, exactly as Disable's does.
	 */
	encore: { name: 'Encore' },
	flashfire: { name: 'Flash Fire' },
	focusenergy: { name: 'Focus Energy' },
	foresight: { name: 'Foresight' },
	gastroacid: { name: 'Gastro Acid' },
	healblock: { name: 'Heal Block' },
	// No argument needed: the sim never stores which moves are sealed, it checks the imprisoner's own
	// moveset every time a foe tries to move. So restoring the volatile restores the whole effect.
	imprison: { name: 'Imprison' },
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
	// The sim works out which stat is boosted itself (`getBestStat`), so neither of these needs an argument;
	// the `-start` line it emits carries the stat, which is how the renderer labels it "Protosynthesis: Atk".
	protosynthesis: { name: 'Protosynthesis', boosterUnless: { kind: 'weather', id: 'sunnyday' } },
	quarkdrive: { name: 'Quark Drive', boosterUnless: { kind: 'terrain', id: 'electricterrain' } },
	saltcure: { name: 'Salt Cure' },
	smackdown: { name: 'Smack Down' },
	substitute: { name: 'Substitute' },
	syrupbomb: { name: 'Syrup Bomb' },
	// The log says a Pokémon was taunted but never for how long, so the sim's own duration stands in. Kept
	// out of the list at first for that reason; an import dropping it outright was worse (user report,
	// 2026-09-19), since "taunted, turns unknown" beats "not taunted".
	taunt: { name: 'Taunt' },
	yawn: { name: 'Yawn' },
};

export function clamp(value: unknown, low: number, high: number, fallback: number) {
	const number = Math.trunc(Number(value));
	return Number.isFinite(number) ? Math.min(high, Math.max(low, number)) : fallback;
}

export class AnalysisPokemonEditor {
	battle: Battle;
	applied: Pick<AnalysisEdits, 'active' | 'pokemon'> = {};
	summary: AnalysisEditSummary = { field: [], p1: [], p2: [] };
	lines: AnalysisEditLine[] = [];
	droppedEdits: string[] = [];
	/** this save's field edit, which the field layer applies after this one — see `needsBooster` */
	pendingField: AnalysisEdits['field'] = undefined;

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
		/*
		 * The details are frozen **now**, not left to `getFullDetails` to resolve at flush time. It is a
		 * function, and `battle.add` calls it when the line is finally serialized — by which point a Mega
		 * Evolution in the same save has already happened, so the switch announced a Pokémon the renderer
		 * had never seen ("Glalie-Mega" against a team-preview entry for "Glalie"). It filed that as a
		 * *seventh* team member and left the real one stranded (user report, 2026-09-19).
		 *
		 * Frozen, the sequence is the one a real battle produces: switch in as Glalie, then `detailschange`
		 * into Mega Glalie, which the renderer applies to the Pokémon already on the field.
		 */
		const details = incoming.getFullDetails();
		this.lines.push(['switch', incoming, () => details]);
		((this.applied.active ||= {})[sideId] ||= [])[slot] = teamSlot;
		this.note(sideId, incoming, `Active (Slot ${slot + 1})`);
	}

	/**
	 * Empties an active slot — `null` in `edits.active`, which a replay produces when a Pokémon fainted and
	 * its side had nothing left to send out (user report, 2026-09-19). It used to be skipped outright, so the
	 * slot kept its occupant: an imported turn 9 still had the fainted Basculegion on the field, and because
	 * it counted as active the HP edit then clamped it to 1 rather than fainting it.
	 *
	 * The occupant is **fainted**, not quietly benched, because that is the only way a slot empties in a real
	 * battle — and `|faint|` is the only line that tells the renderer a slot is now empty. This mirrors what
	 * `faintMessages` leaves behind: `isActive` and `isStarted` off, while `side.active[slot]` still points at
	 * the fainted Pokémon, which is how the sim represents "fainted, awaiting a replacement".
	 */
	clearActive(sideId: AnalysisSideEditsID, slot: number) {
		const side = this.side(sideId);
		const outgoing = side?.active[slot];
		if (!side || !outgoing?.isActive) return;
		if (!outgoing.fainted) this.faint(outgoing);
		outgoing.isActive = false;
		outgoing.isStarted = false;
		((this.applied.active ||= {})[sideId] ||= [])[slot] = null;
		this.note(sideId, outgoing, `Off the field`);
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
	applyHP(sideId: AnalysisSideEditsID, pokemon: Pokemon, hp: number, mayFaintActive = false) {
		const lowest = pokemon.isActive && !mayFaintActive ? 1 : 0;
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
	 * HP as a percentage of max HP, which is what a replay import stores: a replay only ever shows
	 * percentages, and the real max HP depends on EVs and IVs it never reveals. Resolving here rather than
	 * in the parser keeps the value right however the user later edits the team — the team layer has
	 * already run by this point, so max HP has settled.
	 */
	applyHpPercent(sideId: AnalysisSideEditsID, pokemon: Pokemon, percent: number) {
		const wanted = Math.round(clamp(percent, 0, 100, 100) * pokemon.maxhp / 100);
		/*
		 * **A replay may faint an Pokémon that is still on the field**, unlike the Pokémon panel, which
		 * clamps an active one to 1 so the form can't KO whatever is out. The clamp is there to stop a
		 * *user* doing it by hand; a replay is reporting something that already happened, and a battle
		 * ends with exactly that — a fainted Pokémon on the field and no replacement to send out
		 * (user report, 2026-09-19). `hpPercent` is the replay's own channel, so the two don't collide.
		 *
		 * Anything alive stays alive: rounding a sliver of HP down to 0 would faint it silently, and a
		 * replay shows a Focus Sash survivor as `1/100`.
		 */
		return this.applyHP(sideId, pokemon, percent > 0 ? Math.max(1, wanted) : wanted, true);
	}

	/**
	 * The Pokémon's **current** item, as opposed to its set's — a replay needs "held a Sitrus Berry, ate it
	 * on turn 3". Written directly rather than through `setItem`, as the team layer does, so no events fire.
	 */
	applyItem(sideId: AnalysisSideEditsID, pokemon: Pokemon, item: string) {
		const wanted = this.battle.dex.items.get(item);
		if (item && !wanted.exists) {
			this.drop(sideId, this.teamSlot(pokemon), `${item} isn't an item`);
			return undefined;
		}
		const id = item ? wanted.id : '';
		if (pokemon.item === id) return undefined;
		pokemon.item = id;
		pokemon.itemState = this.battle.initEffectState({ id, target: pokemon });
		if (id) {
			this.lines.push(['-item', pokemon, wanted.name, '[silent]']);
		} else {
			this.lines.push(['-enditem', pokemon, this.battle.dex.items.get(id).name || 'Item', '[silent]']);
		}
		this.note(sideId, pokemon, `Item (${wanted.name || 'None'})`);
		return id;
	}

	/**
	 * The Pokémon's **current** ability, which Trace, Skill Swap and Mega Evolution change without changing
	 * the set. `baseAbility` deliberately stays put — editing the set's ability is the team layer's job.
	 */
	applyAbility(sideId: AnalysisSideEditsID, pokemon: Pokemon, ability: string) {
		const wanted = this.battle.dex.abilities.get(ability);
		if (ability && !wanted.exists) {
			this.drop(sideId, this.teamSlot(pokemon), `${ability} isn't an ability`);
			return undefined;
		}
		const id = ability ? wanted.id : '';
		if (pokemon.ability === id) return undefined;
		pokemon.ability = id;
		pokemon.abilityState = this.battle.initEffectState({ id, target: pokemon });
		this.lines.push(['-ability', pokemon, wanted.name || 'None', '[silent]']);
		this.note(sideId, pokemon, `Ability (${wanted.name || 'None'})`);
		return id;
	}

	/**
	 * The history a rebuilt battle has no way to know. A reconstructed position is a fresh battle at turn 1,
	 * so without these every Pokémon looks like it just switched in — Fake Out succeeds from one that has
	 * been out all game. All direct writes; none of it is in the protocol, and none of it is rendered.
	 */
	applyHistory(sideId: AnalysisSideEditsID, pokemon: Pokemon, edit: AnalysisPokemonStateEdit) {
		const applied: AnalysisPokemonStateEdit = {};
		if (edit.activeTurns !== undefined) {
			const wanted = clamp(edit.activeTurns, 0, MAX_HISTORY_COUNT, pokemon.activeTurns);
			if (wanted !== pokemon.activeTurns) {
				pokemon.activeTurns = wanted;
				this.note(sideId, pokemon, `Turns Out (${wanted})`);
			}
			applied.activeTurns = wanted;
		}
		if (edit.activeMoveActions !== undefined) {
			const wanted = clamp(edit.activeMoveActions, 0, MAX_HISTORY_COUNT, pokemon.activeMoveActions);
			if (wanted !== pokemon.activeMoveActions) {
				pokemon.activeMoveActions = wanted;
				this.note(sideId, pokemon, `Moves Used (${wanted})`);
			}
			applied.activeMoveActions = wanted;
		}
		if (edit.timesAttacked !== undefined) {
			const wanted = clamp(edit.timesAttacked, 0, MAX_HISTORY_COUNT, pokemon.timesAttacked);
			if (wanted !== pokemon.timesAttacked) {
				pokemon.timesAttacked = wanted;
				// The renderer counts only the hits it watched land, and a reconstructed position watched
				// none — so Rage Fist's tooltip would read 50 BP while the sim used the real number.
				this.lines.push([
					'-message', 'analysiscounter', pokemon, 'timesattacked', `${wanted}`, '[silent]',
				]);
				this.note(sideId, pokemon, `Times Attacked (${wanted})`);
			}
			applied.timesAttacked = wanted;
		}
		if (edit.lastMove !== undefined) {
			const move = edit.lastMove ? this.battle.dex.moves.get(edit.lastMove) : null;
			if (move && !move.exists) {
				this.drop(sideId, this.teamSlot(pokemon), `${edit.lastMove} isn't a move`);
			} else if (toID(pokemon.lastMove?.id) !== toID(move?.id)) {
				pokemon.lastMove = move ? this.battle.dex.getActiveMove(move.id) : null;
				this.note(sideId, pokemon, `Last Move (${move ? move.name : 'None'})`);
				applied.lastMove = move ? move.id : '';
			}
		}
		return applied;
	}

	/**
	 * The Protect chain. The parser counts consecutive successful Protect-likes; the sim stores `3, 9, 27…`
	 * and rolls `1/counter`, so the conversion lives here rather than in the parser — one authority on what
	 * the sim's state looks like, as with the volatile defaults.
	 */
	applyStall(sideId: AnalysisSideEditsID, pokemon: Pokemon, count: number) {
		const wanted = clamp(count, 0, MAX_STALL_COUNT, 0);
		if (!wanted) {
			if (!pokemon.volatiles['stall']) return {};
			pokemon.removeVolatile('stall');
			this.note(sideId, pokemon, `Protect Chain (0)`);
			return { stallCount: 0 };
		}
		if (!pokemon.volatiles['stall']) pokemon.addVolatile('stall');
		const state = pokemon.volatiles['stall'];
		if (!state) return {};
		state.counter = 3 ** wanted;
		// `stall` expires at the end of the turn after the one it was set on, as the sim's own onRestart does.
		state.duration = 2;
		this.note(sideId, pokemon, `Protect Chain (${wanted})`);
		return { stallCount: wanted };
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
	 * Tells the renderer a Pokémon fainted or came back.
	 *
	 * **On the field, that is a real `|faint|`**, which is what makes the sprite go and the slot read as
	 * empty. Only an active Pokémon can have one: `battle.ts` looks the ident up and throws on `poke.side`
	 * for a Pokémon the renderer has never seen, because team-preview entries have no ident until they
	 * switch in.
	 *
	 * **Benched, the protocol can express neither** faint nor revive, so it rides on the `analysis*` escape
	 * hatch (`analysis-battle.ts`) and names the Pokémon by **team slot** — the order the renderer keeps its
	 * own `side.pokemon` in — rather than by an ident that may not resolve. That greys out its team icon.
	 */
	markFainted(pokemon: Pokemon, fainted: boolean) {
		const side = pokemon.side.id;
		// The ident is captured now, not passed as the object: lines are serialized once every edit has been
		// applied, and by then this Pokémon is off the field, so `toString()` would drop the slot letter and
		// leave the renderer no way to tell which slot to empty (the same trap as `swapActive`).
		if (fainted && pokemon.isActive) this.lines.push(['faint', pokemon.toString()]);
		this.lines.push(['-message', 'analysisfaint', side, `${this.teamSlot(pokemon)}`, fainted ? '1' : '0', '[silent]']);
	}

	/**
	 * PP is named by move id, so an edit for a move the Pokémon no longer has just doesn't apply — no
	 * cross-layer invalidation needed, and a move change and its new PP can be saved together.
	 */
	applyPP(
		sideId: AnalysisSideEditsID, pokemon: Pokemon,
		pp: { [moveid: string]: number }, ppUsed?: { [moveid: string]: number }
	) {
		const applied: { [moveid: string]: number } = {};
		// `ppUsed` first, so an explicit `pp` for the same move overrides it.
		const wantedByMove: { [moveid: string]: number | 'used' } = {};
		for (const moveid of Object.keys(ppUsed || {})) wantedByMove[moveid] = 'used';
		for (const [moveid, value] of Object.entries(pp)) wantedByMove[moveid] = value;
		for (const [moveid, entry] of Object.entries(wantedByMove)) {
			if (entry === null || entry === undefined) continue;
			const moveSlot = pokemon.moveSlots.find(item => item.id === toID(moveid));
			if (!moveSlot) {
				this.drop(sideId, this.teamSlot(pokemon), `${moveid} is no longer one of ${pokemon.name}'s moves`);
				continue;
			}
			// Only the sim knows a move's real max PP, which is the whole point of taking uses instead.
			const wanted = entry === 'used' ? moveSlot.maxpp - (ppUsed![moveid] || 0) : entry;
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
			const sourceEffect = info.sourceMove ? this.battle.dex.getActiveMove(info.sourceMove) :
				this.needsBooster(info) ? this.battle.dex.items.get('boosterenergy') : null;
			/*
			 * Disable's own `onStart` line names `lastMove`, which is the disabled move only when Cursed Body
			 * fired on the turn being rebuilt. A replay knows the real one — Ceruledge reconstructed at turn 5
			 * announced "Bitter Blade" (its last move) while the sim correctly disabled Shadow Sneak — so the
			 * line is replaced rather than corrected after the fact. `setVolatileCounters` fixes the state.
			 */
			const namedMove = info.move && params?.move ?
				this.battle.dex.moves.get(String(params.move)) : null;
			const added = this.logging(
				() => pokemon.addVolatile(id, source, sourceEffect),
				['-start', pokemon, info.name, '[silent]'],
				namedMove?.exists ? ['-start', pokemon, info.name, namedMove.name] : null
			);
			if (!added) {
				this.drop(sideId, this.teamSlot(pokemon), `${pokemon.name} can't have ${info.name}`);
				continue;
			}
			this.setVolatileCounters(id, pokemon, source, params);
			applied[id] = params;
			this.note(sideId, pokemon, source && info.source ?
				`${info.name} (from ${source.name})` : `${info.name} (On)`);
		}
		return Object.keys(applied).length ? applied : undefined;
	}

	/**
	 * Runs a sim change and makes sure exactly one line describes it, **in the edit channel**.
	 *
	 * Not every condition announces itself: Aqua Ring has no `onEnd` line, and Minimize has neither an
	 * `onStart` nor an `onEnd` one. Without `fallback` the renderer would never learn those volatiles came or
	 * went, and the battle window would drift out of step with the battle.
	 *
	 * A condition that *does* announce itself has its own line moved into `this.lines` rather than left where
	 * the sim put it. Edit lines are added only after every layer has run (`applyAnalysisEdits`), so a line
	 * the sim wrote during the call landed **before** the active layer's `switch` — and a switch resets that
	 * Pokémon's volatiles in the renderer, so an imported Disable was applied and then immediately wiped,
	 * showing nothing on the sprite (user report, 2026-09-19). One ordered channel fixes it for every
	 * self-announcing condition at once. Destiny Bond still reads as `-singlemove`, Gastro Acid as
	 * `-endability`; they just arrive in the right place.
	 *
	 * `replacement` overrides what the sim said, for a condition whose own line is built from state the
	 * reconstruction is about to correct (see Disable below).
	 */
	/**
	 * Runs a sim change and moves whatever it logged into the edit channel, keeping its own order.
	 *
	 * Same reason as `logging`, without a stand-in for the silent case: these changes always announce
	 * themselves, and inventing a line for one that didn't would be guesswork.
	 *
	 * Mega Evolution is why this exists. `runMegaEvo` writes `|detailschange|p2b: …|Glalie-Mega` straight
	 * into the log, so it reached the renderer **before** the active layer's deferred `switch`/`swap` lines
	 * — while slot p2b still held the Pokémon that was about to be swapped out. The renderer applied the
	 * forme change to the wrong Pokémon, which then took the right one's place in the roster: an imported
	 * turn showed Mega Glalie twice and no Dragonite at all (user report, 2026-09-19).
	 */
	capture<T>(change: () => T) {
		const before = this.battle.log.length;
		const result = change();
		for (const line of this.battle.log.splice(before)) this.lines.push([ANALYSIS_RAW_LINE, line]);
		return result;
	}

	logging<T>(change: () => T, fallback: AnalysisEditLine, replacement?: AnalysisEditLine | null) {
		const before = this.battle.log.length;
		const result = change();
		// whatever the sim wrote for this change, taken back out of the log so it can be re-added in order
		const emitted = this.battle.log.splice(before);
		if (!emitted.length) {
			this.lines.push(replacement || fallback);
		} else if (replacement) {
			this.lines.push(replacement);
		} else {
			for (const line of emitted) this.lines.push([ANALYSIS_RAW_LINE, line]);
		}
		return result;
	}

	/**
	 * Whether a Protosynthesis or Quark Drive edit has to be attributed to a Booster Energy.
	 *
	 * The **ability** takes its own volatile back the moment the field stops enabling it, unless it came
	 * from a Booster Energy (`onWeatherChange` / `onTerrainChange` in `data/abilities.ts`). So outside sun
	 * or Electric Terrain a chip the user just added would disappear at the next weather change — and
	 * outside that field condition a Booster Energy is the only way the Pokémon could have the boost at
	 * all, so this is what did happen rather than a convenient fiction. In sun or terrain it is left alone,
	 * because there the boost stands on its own and claiming an item would be the lie.
	 *
	 * Both field kinds are checked because either name only ever matches one of them.
	 */
	needsBooster(info: { boosterUnless?: { kind: 'weather' | 'terrain', id: string } }) {
		const want = info.boosterUnless;
		if (!want) return false;
		/*
		 * Against the field the node **will** have, not the one the battle has right now: the field layer
		 * runs last (`applyAnalysisEdits`), so a save that sets sun and Protosynthesis together would
		 * otherwise decide this before the sun exists and claim a Booster Energy the Pokémon doesn't need.
		 * A field edit that doesn't mention this condition leaves whatever is already up.
		 */
		const pending = this.pendingField?.[want.kind];
		if (pending !== undefined) return toID(pending?.id) !== want.id;
		return want.kind === 'weather' ?
			!this.battle.field.isWeather(want.id) : !this.battle.field.isTerrain(want.id);
	}

	/**
	 * Counters `onStart` leaves for the move that normally causes the volatile. Everything else the sim
	 * already fills in, including Substitute's HP (a quarter of max) and Dragon Cheer's frozen Dragon flag.
	 */
	setVolatileCounters(
		id: string, pokemon: Pokemon, source: Pokemon | null,
		params?: { [param: string]: number | string | boolean } | null
	) {
		const state = pokemon.volatiles[id];
		switch (id) {
		case 'disable': {
			// `onStart` locks whatever `lastMove` was, which is right when Cursed Body fired and wrong
			// otherwise. A replay knows the real one, so an explicit `move` wins.
			const move = params?.move ? this.battle.dex.moves.get(String(params.move)) : null;
			if (move?.exists) state.move = move.id;
			break;
		}
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
				this.capture(() => this.battle.actions.terastallize(pokemon));
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
					this.capture(() => this.battle.actions.runMegaEvo(pokemon));
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
		// `hp` wins over `hpPercent` if both are given; an import only ever sends the percentage.
		const wantedHp = edit.hp !== undefined ? edit.hp : undefined;
		const wantedPercent = wantedHp === undefined ? edit.hpPercent : undefined;
		const faints = !pokemon.isActive &&
			((wantedHp !== undefined && wantedHp <= 0) || (wantedPercent !== undefined && wantedPercent <= 0));
		if (faints) {
			if (edit.status) this.drop(sideId, teamSlot, `${pokemon.name} has fainted`);
		} else {
			Object.assign(applied, this.applyStatus(sideId, pokemon, edit));
		}
		if (wantedHp !== undefined) applied.hp = this.applyHP(sideId, pokemon, wantedHp);
		if (wantedPercent !== undefined) applied.hp = this.applyHpPercent(sideId, pokemon, wantedPercent);
		if (edit.item !== undefined) applied.item = this.applyItem(sideId, pokemon, edit.item);
		if (edit.ability !== undefined) applied.ability = this.applyAbility(sideId, pokemon, edit.ability);
		if (edit.pp || edit.ppUsed) applied.pp = this.applyPP(sideId, pokemon, edit.pp || {}, edit.ppUsed);
		if (edit.types) applied.types = this.applyTypes(sideId, pokemon, edit.types);
		if (edit.boosts) applied.boosts = this.applyBoosts(sideId, pokemon, edit.boosts);
		/*
		 * History before the volatiles, because Disable's `onStart` refuses outright when the Pokémon has
		 * no `lastMove` — restoring the counters afterwards would leave the volatile never added at all.
		 * The Protect chain is the exception and runs last, since it *adds* a volatile of its own.
		 */
		Object.assign(applied, this.applyHistory(sideId, pokemon, edit));
		if (edit.volatiles) applied.volatiles = this.applyVolatiles(sideId, pokemon, edit.volatiles);
		Object.assign(applied, this.applyTransformation(sideId, pokemon, edit));
		if (edit.stallCount !== undefined) {
			Object.assign(applied, this.applyStall(sideId, pokemon, edit.stallCount));
		}
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
		this.pendingField = edits.field;
		for (const sideId of ['p1', 'p2'] as const) {
			const active = edits.active?.[sideId] || [];
			for (let slot = 0; slot < active.length; slot++) {
				const teamSlot = active[slot];
				if (teamSlot === undefined) continue;
				if (teamSlot === null) {
					this.clearActive(sideId, slot);
					continue;
				}
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
