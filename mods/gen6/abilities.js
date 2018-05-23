'use strict';

/**@type {{[k: string]: ModdedAbilityData}} */
let BattleAbilities = {
	"aerilate": {
		inherit: true,
		desc: "This Pokemon's Normal-type moves become Flying-type moves and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Flying type and have 1.3x power.",
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.aerilateBoosted) return this.chainModify([0x14CD, 0x1000]);
		},
	},
	"aftermath": {
		inherit: true,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact'] && !target.hp) {
				this.damage(source.maxhp / 4, source, target, null, true);
			}
		},
	},
	"damp": {
		inherit: true,
		desc: "While this Pokemon is active, Explosion, Self-Destruct, and the Ability Aftermath are prevented from having an effect.",
		shortDesc: "Prevents Explosion/Self-Destruct/Aftermath while this Pokemon is active.",
	},
	"galewings": {
		inherit: true,
		shortDesc: "This Pokemon's Flying-type moves have their priority increased by 1.",
		onModifyPriority: function (priority, pokemon, target, move) {
			if (move && move.type === 'Flying') return priority + 1;
		},
		rating: 4.5,
	},
	"infiltrator": {
		inherit: true,
		desc: "This Pokemon's moves ignore substitutes and the opposing side's Reflect, Light Screen, Safeguard, and Mist.",
		shortDesc: "Moves ignore substitutes and the foe's Reflect, Light Screen, Safeguard, and Mist.",
	},
	"ironbarbs": {
		inherit: true,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				this.damage(source.maxhp / 8, source, target, null, true);
			}
		},
	},
	"liquidooze": {
		inherit: true,
		onSourceTryHeal: function (damage, target, source, effect) {
			this.debug("Heal is occurring: " + target + " <- " + source + " :: " + effect.id);
			let canOoze = {drain: 1, leechseed: 1};
			if (canOoze[effect.id]) {
				this.damage(damage, null, null, null, true);
				return 0;
			}
		},
	},
	"multitype": {
		inherit: true,
		shortDesc: "If this Pokemon is an Arceus, its type changes to match its held Plate.",
	},
	"mummy": {
		inherit: true,
		desc: "Pokemon making contact with this Pokemon have their Ability changed to Mummy. Does not affect the Abilities Multitype or Stance Change.",
	},
	"normalize": {
		inherit: true,
		desc: "This Pokemon's moves are changed to be Normal type. This effect comes before other effects that change a move's type.",
		shortDesc: "This Pokemon's moves are changed to be Normal type.",
		onModifyMovePriority: 1,
		onModifyMove: function (move) {
			if (move.id !== 'struggle' && this.getMove(move.id).type !== 'Normal') {
				move.type = 'Normal';
			}
		},
		rating: -1,
	},
	"parentalbond": {
		inherit: true,
		desc: "This Pokemon's damaging moves become multi-hit moves that hit twice. The second hit has its damage halved. Does not affect multi-hit moves or moves that have multiple targets.",
		shortDesc: "This Pokemon's damaging moves hit twice. The second hit has its damage halved.",
		onBasePower: function (basePower, pokemon, target, move) {
			// @ts-ignore
			if (move.hasParentalBond && ++move.hit > 1) return this.chainModify(0.5);
		},
	},
	"pixilate": {
		inherit: true,
		desc: "This Pokemon's Normal-type moves become Fairy-type moves and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Fairy type and have 1.3x power.",
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.pixilateBoosted) return this.chainModify([0x14CD, 0x1000]);
		},
	},
	"prankster": {
		inherit: true,
		shortDesc: "This Pokemon's non-damaging moves have their priority increased by 1.",
		rating: 4.5,
	},
	"refrigerate": {
		inherit: true,
		desc: "This Pokemon's Normal-type moves become Ice-type moves and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Ice type and have 1.3x power.",
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.refrigerateBoosted) return this.chainModify([0x14CD, 0x1000]);
		},
	},
	"roughskin": {
		inherit: true,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				this.damage(source.maxhp / 8, source, target, null, true);
			}
		},
	},
	"stancechange": {
		inherit: true,
		onBeforeMovePriority: 11,
	},
	"weakarmor": {
		inherit: true,
		desc: "If a physical attack hits this Pokemon, its Defense is lowered by 1 stage and its Speed is raised by 1 stage.",
		shortDesc: "If a physical attack hits this Pokemon, Defense is lowered by 1, Speed is raised by 1.",
		onAfterDamage: function (damage, target, source, move) {
			if (move.category === 'Physical') {
				this.boost({def: -1, spe: 1}, target, target);
			}
		},
		rating: 0.5,
	},
};

exports.BattleAbilities = BattleAbilities;
