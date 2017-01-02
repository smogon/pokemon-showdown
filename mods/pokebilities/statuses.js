'use strict';

exports.BattleStatuses = {
	othertrace: {
		desc: "On switch-in, this Pokemon copies a random adjacent opposing Pokemon's Ability. If there is no Ability that can be copied at that time, this Ability will activate as soon as an Ability can be copied. Abilities that cannot be copied are Flower Gift, Forecast, Illusion, Imposter, Multitype, Stance Change, Trace, and Zen Mode.",
		shortDesc: "On switch-in, or when it can, this Pokemon copies a random adjacent foe's Ability.",
		onUpdate: function (pokemon) {
			let possibleInnates = [];
			let possibleTargets = [];
			for (let i = 0; i < pokemon.side.foe.active.length; i++) {
				let target = pokemon.side.foe.active[i];
				if (target && !target.fainted) {
					possibleInnates = possibleInnates.concat(target.innates);
					possibleTargets = possibleTargets.concat(target.innates.map(innate => target));
				}
			}
			while (possibleInnates.length) {
				let rand = 0;
				if (possibleInnates.length > 1) rand = this.random(possibleInnates.length);
				let innate = possibleInnates[rand];
				let bannedAbilities = {comatose:1, flowergift:1, forecast:1, illusion:1, imposter:1, multitype:1, schooling:1, stancechange:1, trace:1, zenmode:1};
				if (bannedAbilities[innate]) {
					possibleInnates.splice(rand, 1);
					possibleTargets.splice(rand, 1);
					continue;
				}
				this.add('-ability', pokemon, innate, '[from] ability: Trace', '[of] ' + possibleTargets[rand]);
				pokemon.removeVolatile("othertrace", pokemon);
				pokemon.addVolatile("other" + innate, pokemon);
				return;
			}
		},
		id: "othertrace",
		name: "Trace",
		rating: 3,
		num: 36,
		noCopy: true,
		effectType: "Ability",
		fullName: "ability: Trace",
	},
};
