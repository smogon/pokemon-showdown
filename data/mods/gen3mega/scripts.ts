export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen3',
	gen: 3,
	actions: {
		inherit: true,
		canMegaEvo(pokemon) {
			const species = pokemon.baseSpecies;
			const altForme = species.otherFormes && this.dex.species.get(species.otherFormes[0]);
			const item = pokemon.getItem();

			if (altForme?.isMega && altForme?.requiredMove &&
				pokemon.baseMoves.includes(toID(altForme.requiredMove)) && !item.zMove) {
				return altForme.name;
			}
			if (!item.megaStone) return null;
			const megaEvolution = item.megaStone[species.baseSpecies] || item.megaStone[species.name];
			return megaEvolution && megaEvolution !== species.name ? megaEvolution : null;
		},
		runMegaEvo(pokemon) {
			const speciesid = pokemon.canMegaEvo;
			if (!speciesid) return false;

			pokemon.formeChange(speciesid, pokemon.getItem(), true);

			// Native-gen fidelity: Mega Evolution is a Gen 6 mechanic, and from Gen 5 on, gaining
			// an ability mid-battle fires its switch-in effect (Drought, Intimidate, etc.). Mainline
			// relies on formeChange -> setAbility for this, but that Start is gated behind `gen > 3`
			// (sim/pokemon.ts), which is off in this gen: 3 mod, so we fire it explicitly at the Mega
			// site. Trace/Skill Swap deliberately keep their inert Gen 3 acquisition behavior (they do
			// not pass through here), preserving the cartridge-accurate Gen 3 quirk.
			this.battle.singleEvent('Start', pokemon.getAbility(), pokemon.abilityState, pokemon);

			for (const ally of pokemon.side.pokemon) {
				ally.canMegaEvo = false;
			}

			this.battle.runEvent('AfterMega', pokemon);

			// Post-Mega Speed applies on the turn of Mega Evolution (Gen 7+ behavior).
			// The base engine only recalculates the mega-evolver's move order for
			// `gen === 7` (sim/battle.ts) — and pairs it with a `deferPriority` skip in
			// sim/battle-queue.ts — neither of which fires in this gen: 3 mod, so a fast
			// Mega (e.g. a base-form-slow Pokemon that outspeeds once Mega'd) would
			// otherwise still move at its pre-Mega Speed this turn. Replicate the Gen 7
			// fix locally: pull this Pokemon's pending move action and re-insert it so
			// its speed is recomputed from the new (Mega) stats. `insertChoice` calls
			// `pokemon.updateSpeed()` and re-resolves the action in sorted position
			// (with proper speed-tie randomization), without re-sorting the rest of the
			// mid-turn queue. The megaEvo action itself is already off the queue here
			// (go() shifts before runAction), so the splice only touches the move.
			for (const [i, queuedAction] of this.battle.queue.list.entries()) {
				if (queuedAction.pokemon === pokemon && queuedAction.choice === 'move') {
					this.battle.queue.list.splice(i, 1);
					queuedAction.mega = 'done';
					this.battle.queue.insertChoice(queuedAction, true);
					break;
				}
			}
			return true;
		},
	},
};
