export const Abilities: {[k: string]: ModdedAbilityData} = {
	reversemode: {
		name: "Reverse Mode",
		num: 10000,
		onTryMove(pokemon, target, move) {
			if (move.type !== 'Shadow' && this.randomChance(1, 4)) {
				this.add('cant', pokemon, 'ability: Reverse Mode', move);
				return null;
			}
		},
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 6, pokemon, pokemon);
		},
	},
	protean: {
		inherit: true,
		onSwitchIn(pokemon) {
			this.add('-end', pokemon, 'typechange', '[from] ability: Protean');
			delete this.effectState.protean;
		},
	},
	libero: {
		inherit: true,
		onSwitchIn(pokemon) {
			this.add('-end', pokemon, 'typechange', '[from] ability: Libero');
			delete this.effectState.libero;
		},
	},
};
