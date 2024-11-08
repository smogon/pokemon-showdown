export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	deltastream: {
		inherit: true,
		onEffectiveness(typeMod, target, type, move) {
			if (move && move.effectType === 'Move' && move.category !== 'Status' && type === 'Normal' && typeMod > 0) {
				this.add('-fieldactivate', 'Delta Stream');
				return 0;
			}
		},
	},
	arceus: {
		inherit: true,
		onType(types, pokemon) {
			if (pokemon.transformed || pokemon.ability !== 'multitype' && this.gen >= 8) return types;
			let type: string | undefined = 'Normal';
			if (pokemon.ability === 'multitype') {
				type = pokemon.getItem().onPlate;
				if (!type) {
					type = 'Normal';
				}
			}
			type = type.replace(/(Ghost|Fairy)/g, 'Psychic')
				.replace(/Bug/g, 'Grass')
				.replace(/Ice/g, 'Water')
				.replace(/(Rock|Ground)/g, 'Fighting')
				.replace(/Flying/g, 'Normal')
				.replace(/Poison/g, 'Dark');
			return [type];
		},
	},
	silvally: {
		inherit: true,
		onType(types, pokemon) {
			if (pokemon.transformed || pokemon.ability !== 'rkssystem' && this.gen >= 8) return types;
			let type: string | undefined = 'Normal';
			if (pokemon.ability === 'rkssystem') {
				type = pokemon.getItem().onMemory;
				if (!type) {
					type = 'Normal';
				}
			}
			type = type.replace(/(Ghost|Fairy)/g, 'Psychic')
				.replace(/Bug/g, 'Grass')
				.replace(/Ice/g, 'Water')
				.replace(/(Rock|Ground)/g, 'Fighting')
				.replace(/Flying/g, 'Normal')
				.replace(/Poison/g, 'Dark');
			return [type];
		},
	},
};
