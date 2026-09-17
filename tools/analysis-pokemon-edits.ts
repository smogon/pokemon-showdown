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

	applyPP(sideId: AnalysisSideEditsID, pokemon: Pokemon, pp: (number | null)[]) {
		const applied: (number | null)[] = [];
		for (let slot = 0; slot < pp.length; slot++) {
			const wanted = pp[slot];
			const moveSlot = pokemon.moveSlots[slot];
			if (wanted === null || wanted === undefined) continue;
			if (!moveSlot) {
				this.drop(sideId, this.teamSlot(pokemon), `move slot ${slot + 1} doesn't exist`);
				continue;
			}
			const value = clamp(wanted, 0, moveSlot.maxpp, moveSlot.pp);
			applied[slot] = value;
			if (value === moveSlot.pp) continue;
			moveSlot.pp = value;
			// PP isn't in the protocol; the client reads it from the request
			this.note(sideId, pokemon, `${moveSlot.move} PP (${value}/${moveSlot.maxpp})`);
		}
		return applied.length ? applied : undefined;
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
	applyTransformation(sideId: AnalysisSideEditsID, pokemon: Pokemon, edit: AnalysisPokemonStateEdit) {
		const applied: { terastallized?: boolean, megaEvolved?: boolean } = {};
		if (edit.terastallized !== undefined) {
			if (pokemon.terastallized) {
				applied.terastallized = true;
				if (!edit.terastallized) this.drop(sideId, this.teamSlot(pokemon), `${pokemon.name} can't un-Terastallize`);
			} else if (edit.terastallized) {
				if (pokemon.canTerastallize && pokemon.isActive) {
					this.battle.actions.terastallize(pokemon);
					applied.terastallized = true;
					this.note(sideId, pokemon, `Terastallized (${pokemon.terastallized})`);
				} else {
					this.drop(sideId, this.teamSlot(pokemon), `${pokemon.name} can't Terastallize`);
				}
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
	apply(edits: AnalysisEdits) {
		for (const sideId of ['p1', 'p2'] as const) {
			const active = edits.active?.[sideId] || [];
			for (let slot = 0; slot < active.length; slot++) {
				const teamSlot = active[slot];
				if (teamSlot !== null && teamSlot !== undefined) this.setActive(sideId, slot, teamSlot);
			}
		}
		for (const [key, edit] of Object.entries(edits.pokemon || {})) {
			const [sideId, teamSlot] = key.split(':');
			if (sideId !== 'p1' && sideId !== 'p2') continue;
			this.applyPokemon(sideId, Number(teamSlot), edit);
		}
	}

	get changed() {
		return this.summary.p1.length > 0 || this.summary.p2.length > 0;
	}
}
