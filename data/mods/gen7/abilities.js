'use strict';

/**@type {{[k: string]: ModdedAbilityData}} */
let BattleAbilities = {
	"chlorophyll": {
		inherit: true,
		desc: "If Sunny Day is active, this Pokemon's Speed is doubled.",
	},
	"disguise": {
		inherit: true,
		desc: "If this Pokemon is a Mimikyu, the first hit it takes in battle deals 0 neutral damage. Its disguise is then broken and it changes to Busted Form. Confusion damage also breaks the disguise.",
		shortDesc: "(Mimikyu only) First hit deals 0 damage, breaks disguise.",
		onUpdate(pokemon) {
			if (['mimikyu', 'mimikyutotem'].includes(pokemon.template.speciesid) && this.effectData.busted) {
				let templateid = pokemon.template.speciesid === 'mimikyutotem' ? 'Mimikyu-Busted-Totem' : 'Mimikyu-Busted';
				pokemon.formeChange(templateid, this.effect, true);
			}
		},
	},
	"dryskin": {
		inherit: true,
		desc: "This Pokemon is immune to Water-type moves and restores 1/4 of its maximum HP, rounded down, when hit by a Water-type move. The power of Fire-type moves is multiplied by 1.25 when used on this Pokemon. At the end of each turn, this Pokemon restores 1/8 of its maximum HP, rounded down, if the weather is Rain Dance, and loses 1/8 of its maximum HP, rounded down, if the weather is Sunny Day.",
	},
	"flowergift": {
		inherit: true,
		desc: "If this Pokemon is a Cherrim and Sunny Day is active, it changes to Sunshine Form and the Attack and Special Defense of it and its allies are multiplied by 1.5.",
	},
	"forecast": {
		inherit: true,
		desc: "If this Pokemon is a Castform, its type changes to the current weather condition's type, except Sandstorm.",
	},
	"hydration": {
		inherit: true,
		desc: "This Pokemon has its major status condition cured at the end of each turn if Rain Dance is active.",
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
	"leafguard": {
		inherit: true,
		desc: "If Sunny Day is active, this Pokemon cannot gain a major status condition and Rest will fail for it.",
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
	"raindish": {
		inherit: true,
		desc: "If Rain Dance is active, this Pokemon restores 1/16 of its maximum HP, rounded down, at the end of each turn.",
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
	"solarpower": {
		inherit: true,
		desc: "If Sunny Day is active, this Pokemon's Special Attack is multiplied by 1.5 and it loses 1/8 of its maximum HP, rounded down, at the end of each turn.",
	},
	"swiftswim": {
		inherit: true,
		desc: "If Rain Dance is active, this Pokemon's Speed is doubled.",
	},
};

exports.BattleAbilities = BattleAbilities;
