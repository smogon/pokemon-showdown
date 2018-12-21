'use strict';

/**@type {{[k: string]: ModdedEffectData}} */
let BattleStatuses = {
	// Modified type setup for silvally
	silvally: {
		inherit: true,
		onType: function (types, pokemon) {
			if (pokemon.transformed) return types;
			/** @type {string | undefined} */
			let type = 'Normal';
			if (pokemon.ability === 'rkssystem') {
				type = pokemon.getItem().onMemory;
				if (!type) {
					type = 'Normal';
				}
			}
			return [type];
		},
	},
};

exports.BattleStatuses = BattleStatuses;
