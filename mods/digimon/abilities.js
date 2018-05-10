'use strict';
exports.BattleAbilities = {
	"data": {
		id: "data",
		name: "Data",
		desc: "1.2x against Vaccine; 0.8x against Virus. 30% chance to cure status conditions.",
		onModifyDamagePriority: 8,
		onModifyDamage: function (damage, source, target, move) {
			if (target.volatiles['bug'] || source.volatiles['bug']) {
				if (target.hasAbility('virus')) {
					this.debug('Data boost (Bug active)');
					return this.chainModify(1.2);
				} else if (target.hasAbility('vaccine')) {
					this.debug('Data weaken (Bug active)');
					return this.chainModify(0.8);
				}
			} else {
				if (target.hasAbility('vaccine')) {
					this.debug('Data boost');
					return this.chainModify(1.2);
				} else {
					if (target.hasAbility('virus')) {
						this.debug('Data weaken');
						return this.chainModify(0.8);
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
		desc: "1.2x against Data; 0.8x against Vaccine. 30% chance to cure status conditions.",
		onModifyDamagePriority: 8,
		onModifyDamage: function (damage, source, target, move) {
			if (target.volatiles['bug'] || source.volatiles['bug']) {
				if (target.hasAbility('vaccine')) {
					this.debug('Virus boost (Bug active)');
					return this.chainModify(1.2);
				} else if (target.hasAbility('data')) {
					this.debug('Virus weaken (Bug active)');
					return this.chainModify(0.8);
				}
			} else {
				if (target.hasAbility('data')) {
					this.debug('Virus boost');
					return this.chainModify(1.2);
				} else {
					if (target.hasAbility('vaccine')) {
						this.debug('Virus weaken');
						return this.chainModify(0.8);
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
		desc: "1.2x against Virus; 0.8x against Data. 30% chance to cure status conditions.",
		onModifyDamagePriority: 8,
		onModifyDamage: function (damage, source, target, move) {
			if (target.volatiles['bug'] || source.volatiles['bug']) {
				if (target.hasAbility('data')) {
					this.debug('Vaccine boost (Bug active)');
					return this.chainModify(1.2);
				} else if (target.hasAbility('virus')) {
					this.debug('Vaccine weaken (Bug active)');
					return this.chainModify(0.8);
				}
			} else {
				if (target.hasAbility('virus')) {
					this.debug('Vaccine boost');
					return this.chainModify(1.2);
				} else {
					if (target.hasAbility('data')) {
						this.debug('Vaccine weaken');
						return this.chainModify(0.8);
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
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its attacking stat is multiplied by 1.5 while using a Fire- or Flame-type attack.",
		shortDesc: "At 1/3 or less of its max HP, its attacking stat is x1.5 with Fire and Flame attacks.",
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
		desc: "While this Pokemon is active, the power of Dark- and Evil-type moves used by active Pokemon is multiplied by 1.33.",
		shortDesc: "While this Pokemon is active, all Dark/Evil attacks have 1.33x power.",
		onAnyBasePower: function (basePower, source, target, move) {
			if (target === source || move.category === 'Status' || (move.type !== 'Dark' && move.type !== 'Evil') || move.auraBoost) return;
			move.auraBoost = move.hasAuraBreak ? 0x0C00 : 0x1547;
			return this.chainModify([move.auraBoost, 0x1000]);
		},
	},
	"dryskin": {
		inherit: true,
		desc: "This Pokemon is immune to Water- and Aqua-type moves and restores 1/4 of its maximum HP, rounded down, when hit by such a move. The power of Fire- and Flame-type moves is multiplied by 1.25 when used on this Pokemon. At the end of each turn, this Pokemon restores 1/8 of its maximum HP, rounded down, if the weather is Rain Dance, and loses 1/8 of its maximum HP, rounded down, if the weather is Sunny Day.",
		shortDesc: "Healed 1/4 by Water/Aqua, 1/8 by Rain; hurt 1.25x by Fire/Flame, 1/8 by Sun.",
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
		desc: "While this Pokemon is active, the power of Fairy- and Holy-type moves used by active Pokemon is multiplied by 1.33.",
		shortDesc: "While this Pokemon is active, all Fairy/Holy attacks have 1.33x power.",
		onAnyBasePower: function (basePower, source, target, move) {
			if (target === source || move.category === 'Status' || (move.type !== 'Fairy' && move.type !== 'Holy') || move.auraBoost) return;
			move.auraBoost = move.hasAuraBreak ? 0x0C00 : 0x1547;
			return this.chainModify([move.auraBoost, 0x1000]);
		},
	},
	"flashfire": {
		inherit: true,
		desc: "This Pokemon is immune to Fire- and Flame-type moves. The first time it is hit by such a move, its attacking stat is multiplied by 1.5 while using a Fire-type attack as long as it remains active and has this Ability. If this Pokemon is frozen, it cannot be defrosted by Fire-type attacks.",
		shortDesc: "Fire/Flame attacks have 1.5x power if hit by a Fire/Flame move; Fire/Flame immunity.",
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
		desc: "Grass- and Nature-type Pokemon on this Pokemon's side cannot have their stat stages lowered by other Pokemon or have a major status condition inflicted on them by other Pokemon.",
		shortDesc: "Allied Grass/Nature types can't have stats lowered or status inflicted by other Pokemon.",
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
		desc: "This Pokemon receives 1/2 damage from contact moves, but double damage from Fire- and Flame-type moves.",
		shortDesc: "Takes 1/2 damage from contact moves, 2x damage from Fire and Flame moves.",
		onSourceModifyDamage: function (damage, source, target, move) {
			let mod = 1;
			if (move.type === 'Fire' || move.type === 'Flame') mod *= 2;
			if (move.flags['contact']) mod /= 2;
			return this.chainModify(mod);
		},
	},
	"galewings": {
		inherit: true,
		desc: "If this Pokemon is at full HP, its Flying- and Air-type moves have their priority increased by 1.",
		shortDesc: "At full HP, Flying- and Air-type moves have their priority increased by 1.",
		onModifyPriority: function (priority, Pokemon, target, move) {
			if (move && (move.type === 'Flying' || move.type === 'Air') && Pokemon.hp === Pokemon.maxhp) return priority + 1;
		},
	},
	"heatproof": {
		inherit: true,
		desc: "The power of Fire- and Flame-type attacks against this Pokemon is halved, and burn damage taken is halved.",
		shortDesc: "The power of Fire/Flame attacks against this Pokemon is halved; burn damage halved.",
		onBasePowerPriority: 7,
		onSourceBasePower: function (basePower, attacker, defender, move) {
			if (move.type === 'Fire' || move.type === 'Flame') {
				return this.chainModify(0.5);
			}
		},
	},
	"justified": {
		inherit: true,
		desc: "This Pokemon's Attack is raised by 1 stage after it is damaged by a Dark- or Evil-type move.",
		shortDesc: "This Pokemon's Attack is raised by 1 after it is damaged by a Dark- or Evil-type move.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && (effect.type === 'Dark' || effect.type === 'Evil')) {
				this.boost({atk: 1});
			}
		},
	},
	"lightningrod": {
		inherit: true,
		desc: "This Pokemon is immune to Electric- and Air-type moves and raises its Special Attack by 1 stage when hit by such a move. If this Pokemon is not the target of a single-target Electric- or Air-type move used by another Pokemon, this Pokemon redirects that move to itself if it is within the range of that move.",
		shortDesc: "Draws Electric and Air moves to itself to raise Sp. Atk by 1; Electric/Air immunity.",
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
		desc: "Prevents adjacent opposing Steel- and Mech-type Pokemon from choosing to switch out unless they are immune to trapping.",
		shortDesc: "Prevents adjacent Steel- and Mech-type foes from choosing to switch.",
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
		desc: "This Pokemon is immune to Electric- and Air-type moves and raises its Speed by 1 stage when hit by such a move.",
		shortDesc: "This Pokemon's Speed is raised 1 if hit by an Electric or Air move; Electric/Air immunity.",
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
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its attacking stat is multiplied by 1.5 while using a Grass- or Nature-type attack.",
		shortDesc: "At 1/3 or less of its max HP, its attacking stat is x1.5 with Grass and Nature attacks.",
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
		desc: "This Pokemon's Speed is raised by 1 stage after it is damaged by a Bug-, Dark-, Ghost-, or Evil-type attack.",
		shortDesc: "This Pokemon's Speed is raised by if hit by a Bug-, Dark-, Ghost-, or Evil-type attack.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && (effect.type === 'Dark' || effect.type === 'Bug' || effect.type === 'Ghost' || effect.type === 'Evil')) {
				this.boost({spe: 1});
			}
		},
	},
	"sandforce": {
		inherit: true,
		onBasePowerPriority: 8,
		desc: "If Sandstorm is active, this Pokemon's Ground-, Rock-, Steel-, and Mech-type attacks have their power multiplied by 1.3. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "Its Ground/Rock/Steel/Mech attacks do 1.3x in Sandstorm; Sandstorm immunity.",
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
		desc: "This Pokemon is immune to Grass- and Nature-type moves and raises its Attack by 1 stage when hit by such a move.",
		shortDesc: "Its Attack is raised by 1 if hit by a Grass or Nature move; Grass/Nature immunity.",
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
		desc: "This Pokemon can hit Ghost types with Normal-, Fighting-, and Battle-type moves.",
		shortDesc: "This Pokemon can hit Ghost types with Normal-, Fighting-, and Battle-type moves.",
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
		desc: "This Pokemon's attacking stat is multiplied by 1.5 while using a Steel- or Mech-type attack.",
		shortDesc: "This Pokemon's attacking stat is x1.5 while using a Steel- or Mech-type attack.",
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
		desc: "This Pokemon is immune to Water- and Aqua-type moves and raises its Special Attack by 1 stage when hit by such a move. If this Pokemon is not the target of a single-target Water- or Aqua-type move used by another Pokemon, this Pokemon redirects that move to itself if it is within the range of that move.",
		shortDesc: "Draws Water and Aqua moves to itself to raise Sp. Atk by 1; Water/Aqua immunity.",
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
		desc: "If a Pokemon uses a Fire-, Ice-, or Flame-type attack against this Pokemon, that Pokemon's attacking stat is halved when calculating the damage to this Pokemon.",
		shortDesc: "Fire/Ice/Flame moves against this Pokemon deal damage with a halved attacking stat.",
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
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its attacking stat is multiplied by 1.5 while using a Water- or Aqua-type attack.",
		shortDesc: "At 1/3 or less of its max HP, its attacking stat is x1.5 with Water and Aqua attacks.",
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
		desc: "This Pokemon is immune to Electric- and Air-type moves and restores 1/4 of its maximum HP, rounded down, when hit by such a move.",
		shortDesc: "Heals 1/4 of its max HP when hit by Electric/Air moves; Electric/Air immunity.",
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
		desc: "This Pokemon is immune to Water- and Aqua-type moves and restores 1/4 of its maximum HP, rounded down, when hit by such a move.",
		shortDesc: "Heals 1/4 of its max HP when hit by Water/Aqua moves; Water/Aqua immunity.",
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
		desc: "This Pokemon's attacking stat is doubled while using a Water- or Aqua-type attack. If a Pokemon uses a Fire- or Flame-type attack against this Pokemon, that Pokemon's attacking stat is halved when calculating the damage to this Pokemon. This Pokemon cannot be burned. Gaining this Ability while burned cures it.",
		shortDesc: "Water/Aqua power is 2x; it can't be burned; Fire/Flame power against it is halved.",
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
		desc: "This Pokemon's Defense is raised 2 stages after it is damaged by a Water- or Aqua-type move.",
		shortDesc: "This Pokemon's Defense is raised 2 stages after it is damaged by a Water/Aqua move.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && (effect.type === 'Water' || effect.type === 'Aqua')) {
				this.boost({def: 2});
			}
		},
	},

	//Description change only
	"deltastream": {
		inherit: true,
		desc: "On switch-in, the weather becomes strong winds that remove the weaknesses of the Flying type from Flying-type Pokemon, and the weaknesses of the Air type from Air-type Pokemon. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Desolate Land or Primordial Sea.",
	},
	"desolateland": {
		inherit: true,
		desc: "On switch-in, the weather becomes extremely harsh sunlight that prevents damaging Water- and Aqua-type moves from executing, in addition to all the effects of Sunny Day. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream or Primordial Sea.",
	},
	"primordialsea": {
		inherit: true,
		desc: "On switch-in, the weather becomes heavy rain that prevents damaging Fire- and Flame-type moves from executing, in addition to all the effects of Rain Dance. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream or Desolate Land.",
	},
};
