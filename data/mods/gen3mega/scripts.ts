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
			return true;
		},
	},
};
