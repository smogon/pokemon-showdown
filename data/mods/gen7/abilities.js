'use strict';

/**@type {{[k: string]: ModdedAbilityData}} */
let BattleAbilities = {
	"disguise": {
		inherit: true,
		desc: "If this Pokemon is a Mimikyu, the first hit it takes in battle deals 0 neutral damage. Its disguise is then broken and it changes to Busted Form. Confusion damage also breaks the disguise.",
		onUpdate(pokemon) {
			if (['mimikyu', 'mimikyutotem'].includes(pokemon.template.speciesid) && this.effectData.busted) {
				let templateid = pokemon.template.speciesid === 'mimikyutotem' ? 'Mimikyu-Busted-Totem' : 'Mimikyu-Busted';
				pokemon.formeChange(templateid, this.effect, true);
			}
		},
	},
	"innerfocus": {
		inherit: true,
		shortDesc: "This Pokemon cannot be made to flinch.",
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
		rating: 4,
	},
	"moody": {
		inherit: true,
		desc: "This Pokemon has a random stat raised by 2 stages and another stat lowered by 1 stage at the end of each turn.",
		shortDesc: "Raises a random stat by 2 and lowers another stat by 1 at the end of each turn.",
		onResidual(pokemon) {
			let stats = [];
			let boost = {};
			for (let statPlus in pokemon.boosts) {
				// @ts-ignore
				if (pokemon.boosts[statPlus] < 6) {
					stats.push(statPlus);
				}
			}
			let randomStat = stats.length ? this.sample(stats) : "";
			// @ts-ignore
			if (randomStat) boost[randomStat] = 2;

			stats = [];
			for (let statMinus in pokemon.boosts) {
				// @ts-ignore
				if (pokemon.boosts[statMinus] > -6 && statMinus !== randomStat) {
					stats.push(statMinus);
				}
			}
			randomStat = stats.length ? this.sample(stats) : "";
			// @ts-ignore
			if (randomStat) boost[randomStat] = -1;

			this.boost(boost);
		},
		rating: 5,
	},
	"oblivious": {
		inherit: true,
		desc: "This Pokemon cannot be infatuated or taunted. Gaining this Ability while affected cures it.",
		shortDesc: "This Pokemon cannot be infatuated or taunted.",
	},
	"owntempo": {
		inherit: true,
		desc: "This Pokemon cannot be confused. Gaining this Ability while confused cures it.",
		shortDesc: "This Pokemon cannot be confused.",
	},
	"rattled": {
		desc: "This Pokemon's Speed is raised by 1 stage if hit by a Bug-, Dark-, or Ghost-type attack.",
		shortDesc: "This Pokemon's Speed is raised 1 stage if hit by a Bug-, Dark-, or Ghost-type attack.",
		onAfterDamage(damage, target, source, effect) {
			if (effect && (effect.type === 'Dark' || effect.type === 'Bug' || effect.type === 'Ghost')) {
				this.boost({spe: 1});
			}
		},
		id: "rattled",
		name: "Rattled",
		rating: 1.5,
		num: 155,
	},
	"scrappy": {
		inherit: true,
		desc: "This Pokemon can hit Ghost types with Normal- and Fighting-type moves.",
		shortDesc: "This Pokemon can hit Ghost types with Normal- and Fighting-type moves.",
	},
};

exports.BattleAbilities = BattleAbilities;
