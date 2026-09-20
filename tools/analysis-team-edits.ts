/**
 * Team and set edits at an analysis node (docs/analysis/plan.md, Phase 3): the teambuilder layer.
 *
 * This is the first layer `applyAnalysisEdits` runs, because everything below it names Pokémon by team
 * slot. It works two different ways on purpose:
 *
 * - **A set that stays on the team is mutated in place.** `teamSlot` is `side.team.indexOf(pokemon.set)`,
 *   an object-identity lookup, so keeping the same `set` object keeps the slot and leaves every reference
 *   to that Pokémon (volatile sources, `attackedBy`, side conditions) pointing at the right object. The
 *   sim does the same thing in `data/rulesets.ts` (Chimera 1v1), including the `maxhp = 0` trick that
 *   makes `setSpecies` re-derive HP.
 * - **Composition changes replace objects.** Adding, removing and reordering can't be done in place.
 *   They're only allowed at a clean move request, where the sim's queues are empty, and only for benched
 *   Pokémon.
 *
 * `side.team` is treated as an append-only identity registry: a removed Pokémon leaves its set behind as a
 * tombstone so the slots after it don't renumber, and a new one appends. Nothing in `sim/` reads
 * `side.team` for gameplay (only serialization, `Teams.pack` and crash dumps), and the analysis tool
 * doesn't serialize, so `side.team.length >= side.pokemon.length` is safe here.
 *
 * Because the protocol has no "remove a Pokémon" line, any composition change re-syncs the renderer:
 * `clearpoke`, then the rosters, actives and their visible state again (see `resyncLines`).
 */
import type { Battle } from '../sim/battle';
import type { Pokemon } from '../sim/pokemon';
import type { Side } from '../sim/side';
import { toID } from '../sim/dex';
import type {
	AnalysisEditLine, AnalysisEditSummary, AnalysisEdits, AnalysisSideEditsID, AnalysisTeamEdit,
} from './analysis-state';

const STAT_IDS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const;
const BOOST_IDS = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion'] as const;

/**
 * A set built here must never leave a field for the `Pokemon` constructor to guess: it picks a random
 * gender with `battle.sample` when the set has none (sim/pokemon.ts), which would consume RNG and break
 * the determinism every saved line depends on (plan.md D5).
 */
function normalizeSet(battle: Battle, raw: Partial<PokemonSet>, fallback?: PokemonSet): PokemonSet {
	const species = battle.dex.species.get(raw.species || raw.name || fallback?.species || '');
	const evs = {} as StatsTable;
	const ivs = {} as StatsTable;
	for (const stat of STAT_IDS) {
		evs[stat] = Math.max(0, Math.min(255, Math.trunc(Number(raw.evs?.[stat] ?? 0)) || 0));
		const iv = raw.ivs?.[stat];
		ivs[stat] = Math.max(0, Math.min(31, Math.trunc(Number(iv ?? 31))));
		if (!Number.isFinite(Number(iv ?? 31))) ivs[stat] = 31;
	}
	const moves = (raw.moves || []).map(move => battle.dex.moves.get(move).name).filter(Boolean);
	// the sim throws on a set with no moves, so keep the old ones rather than refuse the whole edit
	if (!moves.length) moves.push(...(fallback?.moves || ['Splash']));
	return {
		name: (raw.name || species.baseSpecies || '').substr(0, 20),
		species: species.name,
		item: battle.dex.items.get(raw.item || '').name,
		ability: battle.dex.abilities.get(raw.ability || '').name || species.abilities?.['0'] || '',
		moves,
		nature: battle.dex.natures.get(raw.nature || 'Serious').name || 'Serious',
		// never leave this empty: an empty gender makes the Pokemon constructor roll one
		gender: ['M', 'F', 'N'].includes(raw.gender!) ? raw.gender! : (species.gender || 'M'),
		evs,
		ivs,
		level: Math.max(1, Math.min(9999, Math.trunc(Number(raw.level ?? fallback?.level ?? 100)) || 100)),
		shiny: !!raw.shiny,
		happiness: typeof raw.happiness === 'number' ? Math.max(0, Math.min(255, Math.trunc(raw.happiness))) : 255,
		pokeball: raw.pokeball || 'pokeball',
		hpType: raw.hpType || undefined,
		dynamaxLevel: typeof raw.dynamaxLevel === 'number' ? Math.max(0, Math.min(10, Math.trunc(raw.dynamaxLevel))) : 10,
		gigantamax: !!raw.gigantamax,
		teraType: raw.teraType || species.requiredTeraType || species.types[0],
	};
}

/** Compares the parts of a set the sim actually reads, so a no-op save reports no change. */
function setsDiffer(a: PokemonSet, b: PokemonSet) {
	if (toID(a.species) !== toID(b.species) || a.name !== b.name) return true;
	if (toID(a.item) !== toID(b.item) || toID(a.ability) !== toID(b.ability)) return true;
	if (toID(a.nature) !== toID(b.nature) || a.level !== b.level || a.gender !== b.gender) return true;
	if (toID(a.teraType || '') !== toID(b.teraType || '')) return true;
	if (!!a.shiny !== !!b.shiny || (a.happiness ?? 255) !== (b.happiness ?? 255)) return true;
	if (a.moves.length !== b.moves.length) return true;
	for (let i = 0; i < a.moves.length; i++) {
		if (toID(a.moves[i]) !== toID(b.moves[i])) return true;
	}
	for (const stat of STAT_IDS) {
		if ((a.evs[stat] || 0) !== (b.evs[stat] || 0)) return true;
		if ((a.ivs[stat] ?? 31) !== (b.ivs[stat] ?? 31)) return true;
	}
	return false;
}

export class AnalysisTeamEditor {
	battle: Battle;
	applied: Pick<AnalysisEdits, 'teams' | 'active'> = {};
	summary: AnalysisEditSummary = { field: [], p1: [], p2: [] };
	lines: AnalysisEditLine[] = [];
	droppedEdits: string[] = [];
	/** team slots whose Pokémon this layer replaced or removed, so later layers can re-validate */
	invalidatedSlots = new Set<string>();
	/** a composition change needs the renderer's roster rebuilt, not just a line per Pokémon */
	private resyncSides = new Set<AnalysisSideEditsID>();

	constructor(battle: Battle) {
		this.battle = battle;
	}

	side(sideId: AnalysisSideEditsID) {
		return this.battle.sides[sideId === 'p1' ? 0 : 1] as Side | undefined;
	}

	teamSlot(pokemon: Pokemon) {
		return pokemon.side.team.indexOf(pokemon.set);
	}

	note(sideId: AnalysisSideEditsID, name: string, change: string) {
		this.summary[sideId].push(`${name}: ${change}`);
	}

	drop(sideId: AnalysisSideEditsID, label: string, reason: string) {
		this.droppedEdits.push(`${sideId} ${label}: ${reason}`);
	}

	/**
	 * Writes a set onto an existing Pokémon without firing the events `setItem`/`setAbility` would.
	 * The set object itself is mutated, never replaced: `side.team` holds the same object, and that
	 * identity is what `teamSlot` means.
	 */
	applySet(sideId: AnalysisSideEditsID, pokemon: Pokemon, next: PokemonSet) {
		const battle = this.battle;
		// both sides of the comparison are normalized, or the defaults this fills in (nature, tera type)
		// would read as changes the first time a team the user never touched is saved
		const previous = normalizeSet(battle, pokemon.set);
		if (!setsDiffer(previous, next)) return false;
		const changes: string[] = [];
		const speciesChanged = toID(previous.species) !== toID(next.species);
		/**
		 * A rename. It used to be refused outright, because the name is baked into `fullname`, the protocol
		 * ident, and the protocol can't express one. But `normalizeSet` fills an empty nickname in with the
		 * species name, so an **un-nicknamed** Pokémon's name is just its species — and refusing to move it
		 * left a Pokémon whose species had been changed still carrying the old one as a nickname, which is
		 * what replacing a Set Up Position placeholder looks like (user report, 2026-09-19).
		 *
		 * So it is allowed, and re-establishing the ident rides on the roster resync a composition change
		 * already uses. That covers a deliberate nickname too, rather than needing a "is this a real
		 * nickname" test, which `baseSpecies` would make unreliable anyway (both Rotom formes are "Rotom").
		 */
		const renamed = previous.name !== next.name;
		const hpPercent = pokemon.maxhp ? pokemon.hp / pokemon.maxhp : 1;

		Object.assign(pokemon.set, next);

		if (renamed) {
			(pokemon as any).name = next.name;
			(pokemon as any).fullname = `${pokemon.side.id}: ${next.name}`;
			this.resyncSides.add(sideId);
			// following the species isn't a nickname change worth reporting; the species line already says it
			if (toID(next.name) !== toID(battle.dex.species.get(next.species).baseSpecies)) {
				changes.push(`Nickname (${next.name})`);
			}
		}

		if (speciesChanged) {
			pokemon.baseSpecies = battle.dex.species.get(next.species);
			pokemon.speciesState = battle.initEffectState({ id: pokemon.baseSpecies.id });
			// forces setSpecies to re-derive baseMaxhp/maxhp/hp (sim/pokemon.ts), as Chimera 1v1 does
			pokemon.maxhp = 0;
			pokemon.setSpecies(pokemon.baseSpecies, null);
			changes.push(`Species (${pokemon.species.name})`);
		} else {
			// preserves the damage already taken and emits its own [silent] -heal
			pokemon.updateMaxHp();
			pokemon.setSpecies(pokemon.baseSpecies, null);
		}
		// setSpecies sets hp = maxhp when maxhp was cleared; keep the HP percent (plan.md Q8)
		pokemon.hp = Math.max(1, Math.min(pokemon.maxhp, Math.round(hpPercent * pokemon.maxhp)));

		if (toID(previous.ability) !== toID(next.ability)) {
			pokemon.baseAbility = toID(next.ability);
			pokemon.ability = pokemon.baseAbility;
			pokemon.abilityState = battle.initEffectState({ id: pokemon.ability, target: pokemon });
			changes.push(`Ability (${battle.dex.abilities.get(pokemon.ability).name || 'None'})`);
		}
		if (toID(previous.item) !== toID(next.item)) {
			pokemon.item = toID(next.item);
			pokemon.itemState = battle.initEffectState({ id: pokemon.item, target: pokemon });
			changes.push(`Item (${battle.dex.items.get(pokemon.item).name || 'None'})`);
		}
		if (previous.moves.join(',') !== next.moves.join(',')) {
			this.rebuildMoveSlots(pokemon, next);
			changes.push(`Moves (${next.moves.join(', ')})`);
		}
		if (toID(previous.nature) !== toID(next.nature)) changes.push(`Nature (${next.nature})`);
		if (previous.level !== next.level) {
			(pokemon as any).level = next.level;
			changes.push(`Level (${next.level})`);
		}
		if (toID(previous.teraType || '') !== toID(next.teraType || '')) {
			pokemon.teraType = battle.dex.types.get(next.teraType!).name;
			changes.push(`Tera Type (${pokemon.teraType})`);
		}
		const hpData = battle.dex.getHiddenPower(pokemon.set.ivs);
		pokemon.hpType = pokemon.set.hpType || hpData.type;
		pokemon.hpPower = hpData.power;
		(pokemon as any).baseHpType = pokemon.hpType;
		(pokemon as any).baseHpPower = pokemon.hpPower;

		this.refreshTransformFlags(pokemon);
		pokemon.details = pokemon.getUpdatedDetails();
		if (!changes.length) changes.push('Set');
		this.note(sideId, pokemon.name, changes.join(', '));
		// the renderer keys Pokémon on ident|details, so a species change needs the slot updated. A rename
		// already forces a full resync, and these lines carry the *new* ident, which the renderer hasn't
		// seen yet — so they would resolve against nothing. Leave them out and let the resync do it.
		if (speciesChanged && !renamed) {
			if (pokemon.isActive) {
				const details = pokemon.details + (pokemon.terastallized ? `, tera:${pokemon.terastallized}` : '');
				this.lines.push(['detailschange', pokemon, details]);
			} else {
				this.lines.push(['updatepoke', pokemon, pokemon.details]);
			}
		}
		return true;
	}

	/** Builds `moveSlots` the way the Pokémon constructor does, keeping `baseMoveSlots` in step. */
	rebuildMoveSlots(pokemon: Pokemon, set: PokemonSet) {
		const battle = this.battle;
		const baseMoveSlots: Pokemon['baseMoveSlots'] = [];
		const ppUps: number[] = [];
		for (const moveid of set.moves) {
			let move = battle.dex.moves.get(moveid);
			if (!move.id) continue;
			if (move.id === 'hiddenpower' && move.type !== 'Normal') {
				if (!set.hpType) set.hpType = move.type;
				move = battle.dex.moves.get('hiddenpower');
			}
			const boosts = move.noPPBoosts || move.id === 'trumpcard' ? 0 : 3;
			const basePP = battle.calculatePP(move, boosts);
			baseMoveSlots.push({
				move: move.name, id: move.id, pp: basePP, maxpp: basePP,
				target: move.target, disabled: false, disabledSource: '', used: false,
			});
			ppUps.push(boosts);
		}
		(pokemon as any).baseMoveSlots = baseMoveSlots;
		pokemon.moveSlots = baseMoveSlots.map(slot => ({ ...slot }));
		pokemon.ppUps = ppUps;
	}

	/** These are derived from the item and species, so a set edit has to recompute them. */
	refreshTransformFlags(pokemon: Pokemon) {
		const actions = this.battle.actions;
		pokemon.canMegaEvo = actions.canMegaEvo(pokemon);
		pokemon.canMegaEvoX = actions.canMegaEvoX?.(pokemon) || undefined;
		pokemon.canMegaEvoY = actions.canMegaEvoY?.(pokemon) || undefined;
		pokemon.canUltraBurst = actions.canUltraBurst(pokemon);
		// depends on canMegaEvo, so it has to come last
		pokemon.canTerastallize = actions.canTerastallize(pokemon);
	}

	/**
	 * Drops every reference to a Pokémon that is leaving the team. These outlive a turn, so a stale one
	 * would keep a removed Pokémon alive inside effects (see the reference list in plan.md Phase 3).
	 */
	scrubReferences(removed: Set<Pokemon>) {
		const battle = this.battle;
		for (const side of battle.sides) {
			side.faintedThisTurn = removed.has(side.faintedThisTurn!) ? null : side.faintedThisTurn;
			side.faintedLastTurn = removed.has(side.faintedLastTurn!) ? null : side.faintedLastTurn;
			for (const state of Object.values(side.sideConditions)) {
				if (removed.has(state.source as Pokemon)) {
					state.source = null;
					state.sourceSlot = undefined;
				}
			}
			for (const slot of side.slotConditions || []) {
				for (const state of Object.values(slot || {})) {
					if (removed.has(state.source as Pokemon)) state.source = null;
				}
			}
		}
		if (removed.has(battle.field.weatherState.source as Pokemon)) battle.field.weatherState.source = null;
		for (const pokemon of battle.getAllPokemon()) {
			if (removed.has(pokemon.illusion!)) pokemon.illusion = null;
			pokemon.attackedBy = pokemon.attackedBy.filter(attacker => !removed.has(attacker.source));
			if (removed.has(pokemon.statusState.source as Pokemon)) pokemon.statusState.source = null;
			for (const state of Object.values(pokemon.volatiles)) {
				if (removed.has(state.source as Pokemon)) {
					state.source = null;
					state.sourceSlot = undefined;
				}
				const linked = state.linkedPokemon as Pokemon[] | undefined;
				if (linked) state.linkedPokemon = linked.filter(entry => !removed.has(entry));
			}
		}
	}

	/**
	 * Applies one side's roster. `from` names the team slot each entry came from, so sets keep their
	 * identity through a reorder; an entry without one is new.
	 */
	applySide(sideId: AnalysisSideEditsID, edit: AnalysisTeamEdit) {
		const side = this.side(sideId);
		if (!side) return;
		const sets = edit.sets || [];
		if (!sets.length) {
			this.drop(sideId, 'team', `a side needs at least one Pokémon`);
			return;
		}
		const from = edit.from || [];
		const bySlot = new Map<number, Pokemon>();
		for (const pokemon of side.pokemon) bySlot.set(this.teamSlot(pokemon), pokemon);

		const kept: Pokemon[] = [];
		const appliedSets: PokemonSet[] = [];
		const appliedFrom: (number | null)[] = [];
		let composition = false;

		for (let i = 0; i < sets.length; i++) {
			const sourceSlot = from[i] ?? null;
			const existing = sourceSlot === null ? undefined : bySlot.get(sourceSlot);
			const normalized = normalizeSet(this.battle, sets[i], existing?.set);
			if (existing) {
				bySlot.delete(sourceSlot!);
				this.applySet(sideId, existing, normalized);
				kept.push(existing);
				appliedSets.push({ ...existing.set });
				appliedFrom.push(this.teamSlot(existing));
			} else {
				const added = this.addPokemon(sideId, side, normalized);
				if (!added) continue;
				kept.push(added);
				appliedSets.push({ ...added.set });
				appliedFrom.push(this.teamSlot(added));
				composition = true;
			}
		}

		// whatever is left in bySlot was dropped from the team
		const removed = new Set<Pokemon>();
		for (const pokemon of bySlot.values()) {
			// a slot can't be left empty, so removing an active Pokémon sends the next one out in its place
			if (pokemon.isActive) {
				const slot = side.active.indexOf(pokemon);
				const replacement = kept.find(entry => !entry.isActive && !entry.fainted);
				if (!replacement) {
					this.drop(sideId, pokemon.name, `is on the field and the team has no one left to send out`);
					kept.push(pokemon);
					appliedSets.push({ ...pokemon.set });
					appliedFrom.push(this.teamSlot(pokemon));
					continue;
				}
				this.sendOut(sideId, side, slot, pokemon, replacement);
			}
			removed.add(pokemon);
			this.invalidatedSlots.add(`${sideId}:${this.teamSlot(pokemon)}`);
			this.note(sideId, pokemon.name, 'Removed from the team');
			composition = true;
		}

		if (this.reorder(side, kept)) composition = true;
		if (removed.size) this.scrubReferences(removed);
		side.pokemonLeft = side.pokemon.filter(pokemon => !pokemon.fainted).length;

		if (composition) this.resyncSides.add(sideId);
		if (composition || this.summary[sideId].length) {
			(this.applied.teams ||= {})[sideId] = { sets: appliedSets, from: appliedFrom };
		}
	}

	/**
	 * Puts `incoming` into active slot `slot` in place of a Pokémon leaving the team, the way
	 * `BattleActions.switchIn` does but without running any switch-in events (the same approach as the
	 * "Send out" edit in analysis-pokemon-edits.ts). The resync emits the `switch` line, so none is needed
	 * here. The replacement is also recorded as an `active` edit, which is what tells the client to clear
	 * the action drafted for that slot.
	 */
	sendOut(sideId: AnalysisSideEditsID, side: Side, slot: number, outgoing: Pokemon, incoming: Pokemon) {
		outgoing.clearVolatile();
		outgoing.isActive = false;
		outgoing.isStarted = false;
		side.active[slot] = incoming;
		incoming.isActive = true;
		incoming.isStarted = true;
		incoming.activeTurns = 0;
		incoming.activeMoveActions = 0;
		incoming.newlySwitched = true;
		((this.applied.active ||= {})[sideId] ||= [])[slot] = this.teamSlot(incoming);
		this.note(sideId, incoming.name, `Sent out for ${outgoing.name} (Slot ${slot + 1})`);
	}

	/** Adds a Pokémon mid-battle, the way a mod that grows a team does, but without switching it in. */
	addPokemon(sideId: AnalysisSideEditsID, side: Side, set: PokemonSet) {
		if (this.battle.requestState !== 'move') {
			this.drop(sideId, set.name, `can only be added at a move decision point`);
			return null;
		}
		if (side.pokemon.length >= 24) {
			this.drop(sideId, set.name, `the team is full`);
			return null;
		}
		// addPokemon takes the set by reference and the constructor writes back into it, so clone first
		const pokemon = side.addPokemon({ ...set, evs: { ...set.evs }, ivs: { ...set.ivs } });
		if (!pokemon) {
			this.drop(sideId, set.name, `couldn't be added`);
			return null;
		}
		// side.team is the identity registry: appending gives the new Pokémon its own permanent slot
		side.team.push(pokemon.set);
		this.note(sideId, pokemon.name, 'Added to the team');
		return pokemon;
	}

	/**
	 * Rebuilds `side.pokemon` as the actives in slot order followed by the bench in the user's order.
	 * The sim requires `side.active[i] === side.pokemon[i]`, so an active Pokémon can't be moved off the
	 * front; the teambuilder's order applies to the bench.
	 */
	reorder(side: Side, roster: Pokemon[]) {
		const actives = side.active.filter(Boolean);
		const bench = roster.filter(pokemon => !actives.includes(pokemon));
		const ordered = [...actives, ...bench];
		const changed = ordered.length !== side.pokemon.length ||
			ordered.some((pokemon, index) => side.pokemon[index] !== pokemon);
		side.pokemon = ordered;
		for (let i = 0; i < ordered.length; i++) ordered[i].position = i;
		return changed;
	}

	/**
	 * Rebuilds the renderer's rosters. The protocol can't remove or reorder a Pokémon, so a composition
	 * change re-sends everything: `clearpoke` wipes both sides' lists (but not side conditions or the
	 * field), then the rosters, the actives, and the per-Pokémon state `clearpoke` discarded.
	 */
	resyncLines(): AnalysisEditLine[] {
		const battle = this.battle;
		const lines: AnalysisEditLine[] = [['clearpoke']];
		for (const side of battle.sides) {
			lines.push(['teamsize', side.id, `${side.pokemon.length}`]);
		}
		for (const side of battle.sides) {
			for (const pokemon of side.pokemon) lines.push(['poke', side.id, pokemon.details, '']);
		}
		for (const side of battle.sides) {
			for (const pokemon of side.active) {
				if (pokemon) lines.push(['switch', pokemon, pokemon.getFullDetails, pokemon.getHealth]);
			}
		}
		// `switch` carries HP and status; everything else the renderer knew has to be replayed
		for (const pokemon of battle.getAllPokemon()) {
			if (!pokemon.isActive) continue;
			for (const stat of BOOST_IDS) {
				const boost = pokemon.boosts[stat];
				if (boost) lines.push(['-setboost', pokemon, stat, `${boost}`, '[silent]']);
			}
			for (const state of Object.values(pokemon.volatiles)) {
				const condition = battle.dex.conditions.get(state.id);
				if (condition.exists && condition.name) lines.push(['-start', pokemon, condition.name, '[silent]']);
			}
			if (pokemon.terastallized) lines.push(['-terastallize', pokemon, pokemon.terastallized]);
		}
		return lines;
	}

	apply(edits: AnalysisEdits) {
		for (const sideId of ['p1', 'p2'] as const) {
			const edit = edits.teams?.[sideId];
			if (edit) this.applySide(sideId, edit);
		}
		if (this.resyncSides.size) this.lines.push(...this.resyncLines());
	}

	get changed() {
		return this.summary.p1.length > 0 || this.summary.p2.length > 0;
	}
}
