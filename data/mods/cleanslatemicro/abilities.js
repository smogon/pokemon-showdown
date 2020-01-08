'use strict';

/**@type {{[k: string]: ModdedAbilityData}} */
let BattleAbilities = {
	"flowergift": {
		inherit: true,
		onStart() {},
		onUpdate() {},
		onAllyModifyAtkPriority: 3,
		onAllyModifyAtk(atk, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 4,
		onAllyModifySpD(spd, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
	},
};

exports.BattleAbilities = BattleAbilities;
