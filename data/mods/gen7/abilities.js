'use strict';

/**@type {{[k: string]: ModdedAbilityData}} */
let BattleAbilities = {
	"disguise": {
		inherit: true,
		desc: "If this Pokemon is a Mimikyu, the first hit it takes in battle deals 0 neutral damage. Its disguise is then broken, it changes to Busted Form, and it loses 1/10 of its max HP. Confusion damage also breaks the disguise.",
		onUpdate(pokemon) {
			if (['mimikyu', 'mimikyutotem'].includes(pokemon.template.speciesid) && this.effectData.busted) {
				let templateid = pokemon.template.speciesid === 'mimikyutotem' ? 'Mimikyu-Busted-Totem' : 'Mimikyu-Busted';
				pokemon.formeChange(templateid, this.effect, true);
			}
		},
	},
	"innerfocus": {
		inherit: true,
		rating: 1,
	},
	"intimidate": {
		inherit: true,
		desc: "On switch-in, this Pokemon lowers the Attack of adjacent opposing Pokemon by 1 stage. Pokemon behind a substitute are immune.",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.side.foe.active) {
				if (!target || !this.isAdjacent(target, pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Intimidate', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({atk: -1}, target, pokemon, null, true);
				}
			}
		},
	},
};

exports.BattleAbilities = BattleAbilities;
