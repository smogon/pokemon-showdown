/**
 * Pokémon state edits at an analysis node (docs/analysis/plan.md, Phase 2b-1): which Pokémon is active,
 * HP, PP, status, boosts, Terastallization and Mega Evolution. Volatiles come in 2b-2.
 *
 * Like the field edits (analysis-edits.ts), these write sim state directly and emit `[silent]` protocol
 * lines for what changed, plus `-message|analysiscounter` lines for the toxic and sleep counters, which the
 * protocol can't set. Terastallizing and Mega Evolving are the exception: they go through the sim's own
 * `battle.actions`, because they change forme, types and ability, and re-implementing that here would drift
 * from the sim. Neither can be undone through the form (the protocol has no way to say "un-Terastallize").
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
	setActive(sideId: AnalysisSideEditsID, slot: number, teamSlot: number) {
		const side = this.side(sideId);
		const incoming = this.find(sideId, teamSlot);
		if (!side || !incoming || slot >= side.active.length) {
			this.drop(sideId, teamSlot, `can't be sent to slot ${slot + 1}`);
			return;
		}
		if (side.active[slot] === incoming) return;
		if (incoming.fainted) {
			this.drop(sideId, teamSlot, `${incoming.name} has fainted`);
			return;
		}
		if (incoming.isActive) {
			this.drop(sideId, teamSlot, `${incoming.name} is already in another slot`);
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

	applyHP(sideId: AnalysisSideEditsID, pokemon: Pokemon, hp: number) {
		if (pokemon.fainted) {
			this.drop(sideId, this.teamSlot(pokemon), `${pokemon.name} has fainted`);
			return undefined;
		}
		const wanted = clamp(hp, 1, pokemon.maxhp, pokemon.hp);
		if (wanted === pokemon.hp) return undefined;
		pokemon.hp = wanted;
		// the status has to be repeated, or the client clears it
		const status = pokemon.status ? ` ${pokemon.status}` : '';
		this.lines.push(['-sethp', pokemon, `${wanted}/${pokemon.maxhp}${status}`, '[silent]']);
		const percent = Math.round(1000 * wanted / pokemon.maxhp) / 10;
		this.note(sideId, pokemon, `HP (${wanted}/${pokemon.maxhp}, ${percent}%)`);
		return wanted;
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
			} else if (pokemon.isActive && pokemon.teraType) {
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
		Object.assign(applied, this.applyStatus(sideId, pokemon, edit));
		if (edit.hp !== undefined) applied.hp = this.applyHP(sideId, pokemon, edit.hp);
		if (edit.pp) applied.pp = this.applyPP(sideId, pokemon, edit.pp);
		if (edit.types) applied.types = this.applyTypes(sideId, pokemon, edit.types);
		if (edit.boosts) applied.boosts = this.applyBoosts(sideId, pokemon, edit.boosts);
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
				this.setActive(sideId, slot, teamSlot);
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
