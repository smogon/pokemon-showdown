'use strict';
exports.BattleAbilities = {
	"data": {
		id: "data",
		name: "Data",
		desc: "Attacks are stronger against Vaccine and weaker against Virus, Has a 30% chance to cure status conditions at the end of each turn",
		onModifyDamagePriority: 8,
		onModifyDamage: function (damage, source, target, move) {
			if (target.volatiles['bug'] || source.volatiles['bug']) {
				if (target.hasAbility('virus')) {
					this.debug('Data boost (Bug active)');
					return this.chainModify(1.5);
				} else if (target.hasAbility('vaccine')) {
					this.debug('Data weaken (Bug active)');
					return this.chainModify(0.5);
				}
			} else {
				if (target.hasAbility('vaccine')) {
					this.debug('Data boost');
					return this.chainModify(1.5);
				} else {
					if (target.hasAbility('virus')) {
						this.debug('Data weaken');
						return this.chainModify(0.5);
					}
				}
			}
		},
		onResidualOrder: 999,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.hp && pokemon.status && this.random(3) === 0) {
				this.debug('shed skin');
				this.add('-activate', pokemon, 'ability: Data');
				pokemon.cureStatus();
			}
		},
	},
	"virus": {
		id: "virus",
		name: "Virus",
		desc: "Attacks are stronger against Virus and weaker against Data, Has a 30% chance to cure status conditions at the end of each turn.",
		onModifyDamagePriority: 8,
		onModifyDamage: function (damage, source, target, move) {
			if (target.volatiles['bug'] || source.volatiles['bug']) {
				if (target.hasAbility('vaccine')) {
					this.debug('Virus boost (Bug active)');
					return this.chainModify(1.5);
				} else if (target.hasAbility('data')) {
					this.debug('Virus weaken (Bug active)');
					return this.chainModify(0.5);
				}
			} else {
				if (target.hasAbility('data')) {
					this.debug('Virus boost');
					return this.chainModify(1.5);
				} else {
					if (target.hasAbility('vaccine')) {
						this.debug('Virus weaken');
						return this.chainModify(0.5);
					}
				}
			}
		},
		onResidualOrder: 999,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.hp && pokemon.status && this.random(3) === 0) {
				this.debug('shed skin');
				this.add('-activate', pokemon, 'ability: Virus');
				pokemon.cureStatus();
			}
		},
	},
	"vaccine": {
		id: "vaccine",
		name: "Vaccine",
		desc: "Attacks are stronger against Data and weaker against Vaccine, Has a 30% chance to cure status conditions at the end of each turn.",
		onModifyDamagePriority: 8,
		onModifyDamage: function (damage, source, target, move) {
			if (target.volatiles['bug'] || source.volatiles['bug']) {
				if (target.hasAbility('data')) {
					this.debug('Vaccine boost (Bug active)');
					return this.chainModify(1.5);
				} else if (target.hasAbility('virus')) {
					this.debug('Vaccine weaken (Bug active)');
					return this.chainModify(0.5);
				}
			} else {
				if (target.hasAbility('virus')) {
					this.debug('Vaccine boost');
					return this.chainModify(1.5);
				} else {
					if (target.hasAbility('data')) {
						this.debug('Vaccine weaken');
						return this.chainModify(0.5);
					}
				}
			}
		},
		onResidualOrder: 999,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.hp && pokemon.status && this.random(3) === 0) {
				this.debug('shed skin');
				this.add('-activate', pokemon, 'ability: Vaccine');
				pokemon.cureStatus();
			}
		},
	},
	"blaze": {
		inherit: true,
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if ((move.type === 'Fire' || move.type === 'Flame') && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if ((move.type === 'Fire' || move.type === 'Flame') && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			}
		},
	},
	"darkaura": {
		inherit: true,
		onAnyBasePower: function (basePower, source, target, move) {
			if (target === source || move.category === 'Status' || (move.type !== 'Dark' && move.type !== 'Evil') || move.auraBoost) return;
			move.auraBoost = move.hasAuraBreak ? 0x0C00 : 0x1547;
			return this.chainModify([move.auraBoost, 0x1000]);
		},
	},
	"dryskin": {
		inherit: true,
		onTryHit: function (target, source, move) {
			if (target !== source && (move.type === 'Water' || move.type === 'Aqua')) {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Dry Skin');
				}
				return null;
			}
		},
		onBasePowerPriority: 7,
		onFoeBasePower: function (basePower, attacker, defender, move) {
			if (this.effectData.target !== defender) return;
			if (move.type === 'Fire' || move.type === 'Flame') {
				return this.chainModify(1.25);
			}
		},
	},
	"fairyaura": {
		inherit: true,
		onAnyBasePower: function (basePower, source, target, move) {
			if (target === source || move.category === 'Status' || (move.type !== 'Fairy' && move.type !== 'Holy') || move.auraBoost) return;
			move.auraBoost = move.hasAuraBreak ? 0x0C00 : 0x1547;
			return this.chainModify([move.auraBoost, 0x1000]);
		},
	},
	"flashfire": {
		inherit: true,
		onTryHit: function (target, source, move) {
			if (target !== source && (move.type === 'Fire' || move.type === 'Flame')) {
				move.accuracy = true;
				if (!target.addVolatile('flashfire')) {
					this.add('-immune', target, '[msg]', '[from] ability: Flash Fire');
				}
				return null;
			}
		},
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function (target) {
				this.add('-start', target, 'ability: Flash Fire');
			},
			onModifyAtkPriority: 5,
			onModifyAtk: function (atk, attacker, defender, move) {
				if (move.type === 'Fire' || move.type === 'Flame') {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA: function (atk, attacker, defender, move) {
				if (move.type === 'Fire' || move.type === 'Flame') {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onEnd: function (target) {
				this.add('-end', target, 'ability: Flash Fire', '[silent]');
			},
		},
	},
	"flowerveil": {
		inherit: true,
		onAllyBoost: function (boost, target, source, effect) {
			if ((source && target === source) || (!target.hasType('Grass') && !target.hasType('Nature'))) return;
			let showMsg = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add('-fail', this.effectData.target, 'unboost', '[from] ability: Flower Veil', '[of] ' + target);
		},
		onAllySetStatus: function (status, target, source, effect) {
			if (target.hasType('Grass') || target.hasType('Nature')) {
				if (!effect || !effect.status) return false;
				this.add('-activate', this.effectData.target, 'ability: Flower Veil', '[of] ' + target);
				return null;
			}
		},
	},
	"fluffy": {
		inherit: true,
		onSourceModifyDamage: function (damage, source, target, move) {
			let mod = 1;
			if (move.type === 'Fire' || move.type === 'Flame') mod *= 2;
			if (move.flags['contact']) mod /= 2;
			return this.chainModify(mod);
		},
	},
	"galewings": {
		inherit: true,
		onModifyPriority: function (priority, Pokemon, target, move) {
			if (move && (move.type === 'Flying' || move.type === 'Air') && Pokemon.hp === Pokemon.maxhp) return priority + 1;
		},
	},
	"heatproof": {
		inherit: true,
		onBasePowerPriority: 7,
		onSourceBasePower: function (basePower, attacker, defender, move) {
			if (move.type === 'Fire' || move.type === 'Flame') {
				return this.chainModify(0.5);
			}
		},
	},
	"justified": {
		inherit: true,
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && (effect.type === 'Dark' || effect.type === 'Evil')) {
				this.boost({atk: 1});
			}
		},
	},
	"lightningrod": {
		inherit: true,
		onTryHit: function (target, source, move) {
			if (target !== source && (move.type === 'Electric' || move.type === 'Air')) {
				if (!this.boost({spa: 1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Lightning Rod');
				}
				return null;
			}
		},
		onAnyRedirectTarget: function (target, source, source2, move) {
			if ((move.type !== 'Electric' && move.type !== 'Air') || ['firepledge', 'grasspledge', 'waterpledge'].includes(move.id)) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Lightning Rod');
				}
				return this.effectData.target;
			}
		},
	},
	"magnetpull": {
		inherit: true,
		onFoeTrapPokemon: function (Pokemon) {
			if ((Pokemon.hasType('Steel') || Pokemon.hasType('Mech')) && this.isAdjacent(Pokemon, this.effectData.target)) {
				Pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon: function (Pokemon, source) {
			if (!source) source = this.effectData.target;
			if ((!Pokemon.knownType || Pokemon.hasType('Steel') || Pokemon.hasType('Mech')) && this.isAdjacent(Pokemon, source)) {
				Pokemon.maybeTrapped = true;
			}
		},
	},
	"motordrive": {
		inherit: true,
		onTryHit: function (target, source, move) {
			if (target !== source && (move.type === 'Electric' || move.type === 'Air')) {
				if (!this.boost({spe: 1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Motor Drive');
				}
				return null;
			}
		},
	},
	"overgrow": {
		inherit: true,
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if ((move.type === 'Grass' || move.type === 'Nature') && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if ((move.type === 'Grass' || move.type === 'Nature') && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			}
		},
	},
	"rattled": {
		inherit: true,
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && (effect.type === 'Dark' || effect.type === 'Bug' || effect.type === 'Ghost' || effect.type === 'Evil')) {
				this.boost({spe: 1});
			}
		},
	},
	"sandforce": {
		inherit: true,
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (this.isWeather('sandstorm')) {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel' || move.type === 'Mech') {
					this.debug('Sand Force boost');
					return this.chainModify([0x14CD, 0x1000]);
				}
			}
		},
	},
	"sapsipper": {
		inherit: true,
		onTryHitPriority: 1,
		onTryHit: function (target, source, move) {
			if (target !== source && (move.type === 'Grass' || move.type === 'Nature')) {
				if (!this.boost({atk: 1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Sap Sipper');
				}
				return null;
			}
		},
		onAllyTryHitSide: function (target, source, move) {
			if (target === this.effectData.target || target.side !== source.side) return;
			if (move.type === 'Grass' || move.type === 'Nature') {
				this.boost({atk: 1}, this.effectData.target);
			}
		},
	},
	"scrappy": {
		inherit: true,
		onModifyMovePriority: -5,
		onModifyMove: function (move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Fighting'] = true;
				move.ignoreImmunity['Normal'] = true;
				move.ignoreImmunity['Battle'] = true;
			}
		},
	},
	"steelworker": {
		inherit: true,
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Steel' || move.type === 'Mech') {
				this.debug('Steelworker boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Steel' || move.type === 'Mech') {
				this.debug('Steelworker boost');
				return this.chainModify(1.5);
			}
		},
	},
	"stormdrain": {
		inherit: true,
		onTryHit: function (target, source, move) {
			if (target !== source && (move.type === 'Water' || move.type === 'Aqua')) {
				if (!this.boost({spa: 1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Storm Drain');
				}
				return null;
			}
		},
		onAnyRedirectTarget: function (target, source, source2, move) {
			if ((move.type !== 'Water' && move.type !== 'Aqua') || ['firepledge', 'grasspledge', 'waterpledge'].includes(move.id)) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Storm Drain');
				}
				return this.effectData.target;
			}
		},
	},
	"thickfat": {
		inherit: true,
		onModifyAtkPriority: 6,
		onSourceModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire' || move.type === 'Flame') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire' || move.type === 'Flame') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
	},
	"torrent": {
		inherit: true,
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if ((move.type === 'Water' || move.type === 'Aqua') && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if ((move.type === 'Water' || move.type === 'Aqua') && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			}
		},
	},
	"voltabsorb": {
		inherit: true,
		onTryHit: function (target, source, move) {
			if (target !== source && (move.type === 'Electric' || move.type === 'Air')) {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Volt Absorb');
				}
				return null;
			}
		},
	},
	"waterabsorb": {
		inherit: true,
		onTryHit: function (target, source, move) {
			if (target !== source && (move.type === 'Water' || move.type === 'Aqua')) {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Water Absorb');
				}
				return null;
			}
		},
	},
	"waterbubble": {
		inherit: true,
		onModifyAtkPriority: 5,
		onSourceModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Fire' || move.type === 'Flame') {
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Fire' || move.type === 'Flame') {
				return this.chainModify(0.5);
			}
		},
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Water' || move.type === 'Aqua') {
				return this.chainModify(2);
			}
		},
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Water' || move.type === 'Aqua') {
				return this.chainModify(2);
			}
		},
	},
	"watercompaction": {
		inherit: true,
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && (effect.type === 'Water' || effect.type === 'Aqua')) {
				this.boost({def: 2});
			}
		},
	},
};
