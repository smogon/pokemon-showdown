'use strict';

/**@type {{[k: string]: ModdedAbilityData}} */
let BattleAbilities = {
	/*
	// Example
	"abilityid": {
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
		id: "abilityid",
		name: "Ability Name",
		// The bulk of an ability is not easily shown in an example since it varies
		// For more examples, see https://github.com/Zarel/Pokemon-Showdown/blob/master/data/abilities.js
	},
	*/
	// Please keep abilites organized alphabetically based on staff member name!
	// cc
	lurking: {
		desc: "This Pokemon's moves have their accuracy multiplied by 1.3.",
		shortDesc: "This Pokemon's moves have their accuracy multiplied by 1.3.",
		id: "lurking",
		name: "Lurking",
		onModifyMove: function (move) {
			if (typeof move.accuracy === 'number') {
				move.accuracy *= 1.3;
			}
		},
	},
	// E4 Flint
	starkmountain: {
		desc: "The user summong sunny when they switch in. If the weather is sunny, the user is immune to water type attacks.",
		shortDesc: "Summons sunny weather, Immune to Water type attacks in sunny weather.",
		id: "starkmountain",
		name: "Stark Mountain",
		onStart: function (target, source) {
			this.setWeather('sunnyday', source);
		},
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Water' && this.isWeather(['sunnyday', 'desolateland'])) {
				this.add('-immune', target, '[msg]', '[from] ability: Stark Mountain');
				return null;
			}
		},
	},
	// KingSwordYT
	kungfupanda: {
		desc: "This Pokemon's punch-based attacks have their power multiplied by 1.2, and this Pokemon's Speed is raised by 1 stage after it is damaged by a move",
		shortDesc: "This Pokemon's punch-based attacks have 1.2x power. +1 Spe when hit.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Kung Fu Panda boost');
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && effect.id !== 'confused') {
				this.boost({spe: 1});
			}
		},
	},
	// Megazard
	standuptall: {
		desc: "This Pokemon's Defense or Special Defense is raised 1 stage at the end of each full turn on the field.",
		shortDesc: "This Pokemon's Def or Spd is raised 1 stage at the end of each full turn on the field.",
		id: "standuptall",
		name: "Stand Up Tall",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.activeTurns) {
				if (this.randomChance(1, 2)) {
					this.boost({def: 1});
				} else {
					this.boost({spd: 1});
				}
			}
		},
	},
	// MicktheSpud
	fakecrash: {
		desc: "If this Pokemon is a Lycanroc-Midnight, the first hit it takes in battle deals 0 neutral damage. Its disguise is then broken and it changes to Lycanroc-Dusk. Confusion damage also breaks the disguise.",
		shortDesc: "If this Pokemon is a Lycanroc-Midnight, the first hit it takes in battle deals 0 damage.",
		onDamagePriority: 1,
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && target.template.speciesid === 'lycanrocmidnight' && !target.transformed) {
				this.add('-activate', target, 'ability: Fake Crash');
				this.effectData.busted = true;
				return 0;
			}
		},
		onEffectiveness: function (typeMod, target, type, move) {
			if (!this.activeTarget) return;
			let pokemon = this.activeTarget;
			if (pokemon.template.speciesid !== 'lycanrocmidnight' || pokemon.transformed || (pokemon.volatiles['substitute'] && !(move.flags['authentic'] || move.infiltrates))) return;
			if (!pokemon.runImmunity(move.type)) return;
			return 0;
		},
		onUpdate: function (pokemon) {
			if (pokemon.template.speciesid === 'lycanrocmidnight' && this.effectData.busted) {
				let templateid = 'Lycanroc-Dusk';
				pokemon.formeChange(templateid, this.effect, true);
				this.add('-message', `${pokemon.name || pokemon.species}'s true identity was revealed!`);
			}
		},
		id: "fakecrash",
		name: "Fake Crash",
	},
	// Shiba
	galewings10: {
		id: "galewings10",
		name: "Gale Wings 1.0",
		desc: "This Pokemon's Flying-type moves have their priority increased by 1.",
		shortDesc: "This Pokemon's Flying-type moves have their priority increased by 1.",
		onModifyPriority: function (priority, pokemon, target, move) {
			if (move && move.type === 'Flying') return priority + 1;
		},
	},
	// Teremiare
	notprankster: {
		shortDesc: "This Pokemon's Status moves have priority raised by 1.",
		onModifyPriority: function (priority, pokemon, target, move) {
			if (move && move.category === 'Status') {
				return priority + 1;
			}
		},
		id: "notprankster",
		name: "Not Prankster",
	},
	// The Immortal
	beastboost2: {
		desc: "This Pokemon's highest 2 stats are raised by 1 if it attacks and KOes another Pokemon.",
		shortDesc: "This Pokemon's highest 2 stats are raised by 1 if it attacks and KOes another Pokemon.",
		id: "beastboost2",
		name: "Beast Boost 2",
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				let statOrder = Object.keys(source.stats)
				    .sort((stat1, stat2) => source.stats[stat2] - source.stats[stat1]);
				this.boost({[statOrder[0]]: 1, [statOrder[1]]: 1}, source);
			}
		},
	},
	// torkool
	deflectiveshell: {
		desc: "Non-contact moves do 33% less damage to this pokemon.",
		shortDesc: "Non-contact moves do 33% less damage to this pokemon.",
		id: "deflectiveshell",
		name: "Deflective Shell",
		onSourceModifyDamage: function (damage, source, target, move) {
			let mod = 1;
			if (!move.flags['contact']) mod = (mod / 3) * 2; // 2/3
			return this.chainModify(mod);
		},
	},
	// Trickster
	interdimensional: {
		desc: "On Switch-in, this Pokemon summons Gravity.",
		shortDesc: "On Switch-in, this Pokemon Summons Gravity.",
		id: "interdimensional",
		name: "Interdimensional",
		onStart: function (target, source) {
			this.addPseudoWeather('gravity', source);
		},
	},
	// Yuki
	snowstorm: {
		desc: "Hail crashes down for unlimited turns.",
		shortDesc: "Hail crashes down for unlimited turns.",
		id: "snowstorm",
		name: "Snow Storm",
		onStart: function () {
			let snowStorm = this.getEffect('hail');
			snowStorm.duration = -1;
			this.setWeather(snowStorm);
		},
	},
};

exports.BattleAbilities = BattleAbilities;
