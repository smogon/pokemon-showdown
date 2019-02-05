'use strict';

/**@type {{[k: string]: ModdedAbilityData}} */
exports.BattleAbilities = {
	trace: {
		inherit: true,
		onUpdate: function (pokemon) {
			if (!pokemon.isStarted) return;
			let isAbility = this.effect.effectType === "Ability";
			/**@type {string[]} */
			let possibleInnates = [];
			/**@type {Pokemon[]} */
			let possibleTargets = [];
			for (let target of pokemon.side.foe.active) {
				if (target && !target.fainted && target.innates) {
					possibleInnates = possibleInnates.concat(target.innates);
					possibleTargets = possibleTargets.concat(target.innates.map(innate => target));
				}
			}
			while (possibleInnates.length) {
				let rand = 0;
				if (possibleInnates.length > 1) rand = this.random(possibleInnates.length);
				let ability = possibleTargets[rand].ability;
				let innate = possibleInnates[rand];
				let bannedAbilities = ['battlebond', 'comatose', 'disguise', 'flowergift', 'forecast', 'illusion', 'imposter', 'multitype', 'powerconstruct', 'powerofalchemy', 'receiver', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'trace', 'zenmode'];
				if (bannedAbilities.includes(isAbility ? ability : innate)) {
					possibleInnates.splice(rand, 1);
					possibleTargets.splice(rand, 1);
					continue;
				}
				this.add('-ability', pokemon, isAbility ? ability : innate, '[from] ability: Trace', '[of] ' + possibleTargets[rand]);
				if (isAbility) {
					pokemon.setAbility(ability);
				} else {
					pokemon.removeVolatile("abilitytrace");
					pokemon.addVolatile("ability" + innate, pokemon);
				}
				return;
			}
		},
	},
};
