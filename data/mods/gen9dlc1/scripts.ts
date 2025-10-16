export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	inherit: 'gen9',
	// A Pokémon transformed into Ogerpon should accept the Terastallization choice, but not Terastallize
	actions: {
		inherit: true,
		canTerastallize(pokemon: Pokemon) {
			if (pokemon.side.terastallizationUsed || pokemon.getItem().megaStone || pokemon.getItem().zMove) {
				return false;
			}
			return pokemon.teraType;
		},
		terastallize(pokemon: Pokemon) {
			if (!this.canTerastallize(pokemon)) return false;

			if (pokemon.transformed && ['Ogerpon', 'Terapagos'].includes(pokemon.species.baseSpecies)) {
				this.battle.hint("A Pokémon terastallized into Ogerpon or Terapagos cannot terastallize.");
				return false;
			}
	
			if (pokemon.species.baseSpecies === 'Ogerpon' && !['Fire', 'Grass', 'Rock', 'Water'].includes(pokemon.teraType) &&
				(!pokemon.illusion || pokemon.illusion.species.baseSpecies === 'Ogerpon')) {
				this.battle.hint("If Ogerpon Terastallizes into a type other than Fire, Grass, Rock, or Water, the game softlocks.");
				return false;
			}

			if (pokemon.illusion && ['Ogerpon', 'Terapagos'].includes(pokemon.illusion.species.baseSpecies)) {
				this.battle.singleEvent('End', this.dex.abilities.get('Illusion'), pokemon.abilityState, pokemon);
			}

			const type = pokemon.teraType;
			this.battle.add('-terastallize', pokemon, type);
			pokemon.terastallized = type;
			pokemon.side.terastallizationUsed = true;
			pokemon.addedType = '';
			pokemon.knownType = true;
			pokemon.apparentType = type;
			if (pokemon.species.baseSpecies === 'Ogerpon') {
				let ogerponSpecies = toID(pokemon.species.battleOnly || pokemon.species.id);
				ogerponSpecies += ogerponSpecies === 'ogerpon' ? 'tealtera' : 'tera';
				pokemon.formeChange(ogerponSpecies, null, true);
			}
			if (pokemon.species.name === 'Terapagos-Terastal') {
				pokemon.formeChange('Terapagos-Stellar', null, true);
			}
			if (pokemon.species.baseSpecies === 'Morpeko' && !pokemon.transformed &&
				pokemon.baseSpecies.id !== pokemon.species.id
			) {
				pokemon.formeRegression = true;
				pokemon.baseSpecies = pokemon.species;
				pokemon.details = pokemon.getUpdatedDetails();
			}
			this.battle.runEvent('AfterTerastallization', pokemon);
			return true;
		},
	},
};
