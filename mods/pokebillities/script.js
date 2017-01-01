'use strict';

exports.BattleScripts = {
	init: function() {
		Object.values(this.data.Abilities).forEach(ability => {
			this.statusability = ["aerilate", "aurabreak", "flashfire", "parentalbond", "pixilate", "refrigerate", "sheerforce", "slowstart", "truant", "unburden", "zenmode"];
			if (statusability.includes(ability.id)) {
				this.data.Statuses["other" + ability.id] = ability;
				this.data.Statuses["other" + ability.id].effectType = "Ability";
				this.data.Statuses["other" + ability.id]["name"] = "Other " + ability["name"];
				this.data.Statuses["other" + ability.id].noCopy = true;
				this.data.Statuses["other" + ability.id]["id"] = "other" + ability.id;
			} else {
				this.data.Statuses[ability.id] = ability;
				this.data.Statuses[ability.id].effectType = "Ability";
				this.data.Statuses[ability.id].noCopy = true;
			}
			this.data.Statuses.trace = {
				desc: "On switch-in, this Pokemon copies a random adjacent opposing Pokemon's Ability. If there is no Ability that can be copied at that time, this Ability will activate as soon as an Ability can be copied. Abilities that cannot be copied are Flower Gift, Forecast, Illusion, Imposter, Multitype, Stance Change, Trace, and Zen Mode.",
				shortDesc: "On switch-in, or when it can, this Pokemon copies a random adjacent foe's Ability.",
				onUpdate: function(pokemon) {
					let possibleTargets = [];
					for (let i = 0; i < pokemon.side.foe.active.length; i++) {
						if (pokemon.side.foe.active[i] && !pokemon.side.foe.active[i].fainted) possibleTargets.push(pokemon.side.foe.active[i]);
					}
					while (possibleTargets.length) {
						let rand = 0;
						if (possibleTargets.length > 1) rand = this.random(possibleTargets.length);
						let target = possibleTargets[rand],
						let abe = target.innates[this.random(target.innates.length)];
						let bannedAbilities = {
							flowergift: 1,
							forecast: 1,
							illusion: 1,
							imposter: 1,
							multitype: 1,
							stancechange: 1,
							trace: 1,
							otherzenmode: 1
						};
						if (!bannedAbilities[abe]) {
							this.add('-ability', pokemon, abe, '[from] ability: Trace', '[of] ' + target);
							pokemon.removeVolatile("trace", pokemon);
							pokemon.addVolatile(abe, pokemon);
						}
						return;
					}
				},
				id: "trace",
				name: "Trace",
				rating: 3,
				num: 36,
				effectType: "Ability",
				noCopy: true,
			};
		});
	},
	pokemon: {
		hasAbility: function(ability) {
			if (this.ignoringAbility()) return false;
			if (this.volatiles[ability] || this.volatiles["other" + ability]) return true;
			let ownAbility = this.ability;
			if (!Array.isArray(ability)) {
				return ownAbility === toId(ability);
			}
			return ability.map(toId).includes(ownAbility);
		}
	},
};
