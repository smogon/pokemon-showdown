/**
 * Fakemon abilities - every cyan ("normal ability") and blue ("Mega ability")
 * entry from the dex PDF, implemented as real battle-engine hooks.
 *
 * Mega abilities are ordinary ability entries; what makes them Mega-only is
 * that they appear on no base forme - only on the `-Mega` species, which a
 * Pokemon can only reach by Mega Evolving with its stone (see scripts.ts).
 *
 * Helper conventions used throughout:
 *   FOOD_ITEM_FLAG   the custom game's "food items" (see items.ts)
 *   isFieldActive()  true when any terrain / room / custom field is up
 */

import { FOOD_ITEMS } from './items';
import { FakemonIndex } from './generated/index';

/** True when any terrain, room or custom field effect is on the battlefield. */
function fieldIsActive(battle: Battle) {
	if (battle.field.terrain) return true;
	return ['trickroom', 'magicroom', 'wonderroom', 'hauntedroom', 'glitchedroom',
		'gravity', 'fakemonants', 'fakemonelectrifiedground', 'fakemonempfield',
		'fakemonprioritylock', 'fakemonabilitylock', 'fakemonweatherlock',
	].some(id => battle.field.getPseudoWeather(id));
}

/** The type associated with the active terrain, if any. */
function terrainType(battle: Battle): string | null {
	switch (battle.field.terrain) {
	case 'electricterrain': return 'Electric';
	case 'grassyterrain': return 'Grass';
	case 'mistyterrain': return 'Fairy';
	case 'psychicterrain': return 'Psychic';
	default: return null;
	}
}

/** The Pokemon's highest stat, ignoring HP. */
function highestStat(pokemon: Pokemon): StatIDExceptHP {
	let best: StatIDExceptHP = 'atk';
	let stat: StatIDExceptHP;
	for (stat in pokemon.storedStats) {
		if (pokemon.storedStats[stat] > pokemon.storedStats[best]) best = stat;
	}
	return best;
}

/** Moves whose damage is calculated from body weight. */
const WEIGHT_MOVES = new Set<string>(FakemonIndex.weightMoves);

function isFoodItem(item: Item) {
	return FOOD_ITEMS.includes(item.id as never) || !!item.isBerry;
}

export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	// =====================================================================
	// A
	// =====================================================================
	acidicpigment: {
		name: "Acidic Pigment",
		shortDesc: "At full HP, this Pokemon's Poison moves hit Steel and Poison super effectively.",
		onEffectiveness(typeMod, target, type, move) {
			if (move.type !== 'Poison' || !this.effectState.target) return;
			const source = this.effectState.target as Pokemon;
			if (source.hp < source.maxhp) return;
			if (type === 'Steel' || type === 'Poison') return 1;
		},
		flags: {},
		rating: 3,
		num: 1001,
	},
	aerodynamicheavyweight: {
		name: "Aerodynamic Heavyweight",
		shortDesc: "At full HP, weight-based moves gain +1 priority.",
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.basePowerCallback && pokemon.hp === pokemon.maxhp) return priority + 1;
		},
		flags: {},
		rating: 3,
		num: 1002,
	},
	aftershock: {
		name: "Aftershock",
		shortDesc: "After using a damaging Ground move, all foes lose 10% of their max HP.",
		onAfterMove(pokemon, target, move) {
			if (move.type !== 'Ground' || move.category === 'Status') return;
			pokemon.addVolatile('aftershock');
		},
		condition: {
			duration: 1,
			onResidualOrder: 26,
			onResidual(pokemon) {
				for (const foe of pokemon.foes()) {
					if (!foe.hp) continue;
					this.add('-ability', pokemon, 'Aftershock');
					this.damage(Math.floor(foe.maxhp / 10), foe, pokemon,
						this.dex.abilities.get('aftershock'));
				}
			},
		},
		flags: {},
		rating: 3.5,
		num: 1003,
	},
	alienspores: {
		name: "Alien Spores",
		shortDesc: "Ground immunity. In Psychic Terrain, physical attackers fall asleep.",
		onImmunity(type) {
			if (type === 'Ground') return false;
		},
		onDamagingHit(damage, target, source, move) {
			if (move.category !== 'Physical') return;
			if (this.field.isTerrain('psychicterrain') && source.hp) {
				source.trySetStatus('slp', target, this.dex.abilities.get('alienspores'));
			}
		},
		flags: {},
		rating: 3,
		num: 1004,
	},
	ambushspeed: {
		name: "Ambush Speed",
		shortDesc: "First turn out: next attack has +1 priority, halved damage, always flinches.",
		onModifyPriority(priority, pokemon, target, move) {
			if (pokemon.activeMoveActions === 0 && move?.category !== 'Status') return priority + 1;
		},
		onModifyMove(move, pokemon) {
			if (pokemon.activeMoveActions !== 0 || move.category === 'Status') return;
			move.secondaries = move.secondaries || [];
			move.secondaries.push({ chance: 100, volatileStatus: 'flinch' });
		},
		onModifyDamage(damage, source, target, move) {
			if (source.activeMoveActions <= 1) return this.chainModify(0.5);
		},
		flags: {},
		rating: 3,
		num: 1005,
	},
	ampedup: {
		name: "Amped Up",
		shortDesc: "Raises Sp. Atk by 1 whenever this Pokemon paralyses a target.",
		onAnySetStatus(status, target, source) {
			if (status.id !== 'par' || source !== this.effectState.target) return;
			this.boost({ spa: 1 }, source, source, this.dex.abilities.get('ampedup'));
		},
		flags: {},
		rating: 3,
		num: 1006,
	},
	antienergy: {
		name: "Antienergy",
		shortDesc: "Mega Evolved Pokemon take 50% more damage from this Pokemon.",
		onModifyDamage(damage, source, target, move) {
			if (target.species.isMega || target.volatiles['fakemonmega']) {
				return this.chainModify(1.5);
			}
		},
		flags: {},
		rating: 3,
		num: 1007,
	},
	anxious: {
		name: "Anxious",
		shortDesc: "If this Pokemon is below 25% HP, its moves gain +3 priority.",
		onModifyPriority(priority, pokemon, target, move) {
			// "would be KOed this round" is approximated by a critical HP check,
			// which is the only pre-calculable form of it in a simultaneous-turn engine.
			if (pokemon.hp * 4 <= pokemon.maxhp) return priority + 3;
		},
		flags: {},
		rating: 4,
		num: 1008,
	},
	apexinstinct: {
		name: "Apex Instinct",
		shortDesc: "Always lands a critical hit on a target at full HP.",
		onModifyCritRatio(critRatio, source, target) {
			if (target && target.hp === target.maxhp) return 5;
		},
		flags: {},
		rating: 3.5,
		num: 1009,
	},
	aquaticveil: {
		name: "Aquatic Veil",
		shortDesc: "Takes 2/3 damage while it is raining.",
		onSourceModifyDamage() {
			if (['raindance', 'primordialsea'].includes(this.field.effectiveWeather())) {
				return this.chainModify([2731, 4096]);
			}
		},
		flags: {},
		rating: 3,
		num: 1010,
	},
	armored: {
		name: "Armored",
		shortDesc: "The first hit deals at most 25% of max HP; the ability is then lost.",
		onSourceModifyDamage(damage, source, target) {
			const cap = Math.floor(target.maxhp / 4);
			if (damage > cap) return cap;
		},
		onDamagingHit(damage, target) {
			if (target.hp) {
				target.setAbility('noability', null, null, true);
				this.add('-ability', target, 'Armored', '[from] ability: Armored', '[silent]');
				this.add('-message', `${target.name}'s armor shattered!`);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1 },
		rating: 3.5,
		num: 1011,
	},
	athenasdecree: {
		name: "Athenas Decree",
		shortDesc: "Mega: Flying moves become Psychic. +2 Sp. Atk after a KO.",
		onModifyType(move, pokemon) {
			if (move.type === 'Flying') move.type = 'Psychic';
		},
		onSourceAfterFaint(length, target, source, effect) {
			if (effect?.effectType === 'Move') {
				this.boost({ spa: 2 * length }, source, source, this.dex.abilities.get('athenasdecree'));
			}
		},
		flags: {},
		rating: 4,
		num: 1012,
	},
	audiorecord: {
		name: "Audio Record",
		shortDesc: "On switch-in, gains 50% damage reduction against the foe's last used move.",
		onStart(pokemon) {
			const foe = pokemon.foes()[0];
			const recorded = foe?.lastMove?.id;
			if (recorded) {
				pokemon.m.recordedMoves = pokemon.m.recordedMoves || [];
				if (!pokemon.m.recordedMoves.includes(recorded)) pokemon.m.recordedMoves.push(recorded);
				this.add('-ability', pokemon, 'Audio Record');
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.m.recordedMoves?.includes(move.id)) return this.chainModify(0.5);
		},
		flags: {},
		rating: 2.5,
		num: 1013,
	},
	auraaye: {
		name: "Aura Aye",
		shortDesc: "Ignores accuracy and evasion changes; its moves are 10% more accurate.",
		onAnyModifyBoost(boosts, pokemon) {
			const holder = this.effectState.target as Pokemon;
			if (pokemon === holder) {
				boosts['evasion'] = 0;
			}
			if (pokemon.isAlly(holder)) return;
			boosts['accuracy'] = 0;
			boosts['evasion'] = 0;
		},
		onSourceModifyAccuracyPriority: -1,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			return this.chainModify(1.1);
		},
		flags: {},
		rating: 3.5,
		num: 1014,
	},

	// =====================================================================
	// B
	// =====================================================================
	barbedchassis: {
		name: "Barbed Chassis",
		shortDesc: "Contact moves deal damage back equal to 20% of this Pokemon's Def (or Sp. Def).",
		onDamagingHit(damage, target, source, move) {
			if (!move.flags['contact'] || !source.hp) return;
			const stat = move.category === 'Special' ? 'spd' : 'def';
			this.damage(Math.max(1, Math.floor(target.getStat(stat) / 5)), source, target,
				this.dex.abilities.get('barbedchassis'));
		},
		flags: {},
		rating: 3,
		num: 1015,
	},
	blacktar: {
		name: "Black Tar",
		shortDesc: "Immune to moves of 50 BP or less. Contact attackers lose 1 Speed.",
		onTryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.basePower && move.basePower <= 50) {
				this.add('-immune', target, '[from] ability: Black Tar');
				return null;
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				this.boost({ spe: -1 }, source, target, this.dex.abilities.get('blacktar'));
			}
		},
		flags: { breakable: 1 },
		rating: 4,
		num: 1016,
	},
	blastproof: {
		name: "Blastproof",
		shortDesc: "Mega: this Pokemon takes no recoil damage.",
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil' && this.activeMove && this.activeMove.id !== 'struggle') {
				return null;
			}
		},
		flags: {},
		rating: 3,
		num: 1017,
	},
	blazingfur: {
		name: "Blazing Fur",
		shortDesc: "Halves damage from physical Ice/Grass moves and burns the attacker.",
		onSourceModifyDamage(damage, source, target, move) {
			if (move.category === 'Physical' && ['Ice', 'Grass'].includes(move.type)) {
				return this.chainModify(0.5);
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical' && ['Ice', 'Grass'].includes(move.type) && source.hp) {
				source.trySetStatus('brn', target, this.dex.abilities.get('blazingfur'));
			}
		},
		flags: { breakable: 1 },
		rating: 3,
		num: 1018,
	},
	bleakbleach: {
		name: "Bleak Bleach",
		shortDesc: "On switch-in, lowers the Sp. Atk of all opposing Pokemon by 1.",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Bleak Bleach', 'boost');
					activated = true;
				}
				if (!target.volatiles['substitute']) this.boost({ spa: -1 }, target, pokemon);
			}
		},
		flags: {},
		rating: 3.5,
		num: 1019,
	},
	blindneedle: {
		name: "Blind Needle",
		shortDesc: "Ignores accuracy/evasion changes, but such moves deal 10% less damage.",
		onAnyModifyBoost(boosts, pokemon) {
			const holder = this.effectState.target as Pokemon;
			if (pokemon === holder) boosts['accuracy'] = 0;
			if (!pokemon.isAlly(holder)) boosts['evasion'] = 0;
		},
		onModifyDamage(damage, source, target) {
			if (source.boosts.accuracy < 0 || target.boosts.evasion > 0) {
				return this.chainModify(0.9);
			}
		},
		flags: {},
		rating: 3,
		num: 1020,
	},
	bonegrip: {
		name: "Bone Grip",
		shortDesc: "Ghost-type moves and moves with \"Bone\" in the name deal 50% more damage.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Ghost' || move.name.toLowerCase().includes('bone')) {
				return this.chainModify(1.5);
			}
		},
		flags: {},
		rating: 3.5,
		num: 1021,
	},
	boombass: {
		name: "Boom Bass",
		shortDesc: "Raises Sp. Atk by 1 when hit by a sound move.",
		onDamagingHit(damage, target, source, move) {
			if (move.flags['sound']) this.boost({ spa: 1 }, target, target);
		},
		onTryHit(target, source, move) {
			if (move.flags['sound'] && move.category === 'Status' && target !== source) {
				this.boost({ spa: 1 }, target, target);
			}
		},
		flags: {},
		rating: 2.5,
		num: 1022,
	},
	brassicaboost: {
		name: "Brassica Boost",
		shortDesc: "+1 Speed when it eats a food item or is hit by a Grass move.",
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Grass') this.boost({ spe: 1 }, target, target);
		},
		onEatItem(item, pokemon) {
			this.boost({ spe: 1 }, pokemon, pokemon);
		},
		flags: {},
		rating: 3,
		num: 1023,
	},
	brickcore: {
		name: "Brick Core",
		shortDesc: "Once per battle, an attack that would KO it instead halves its current HP.",
		onDamagePriority: -30,
		onDamage(damage, target, source, effect) {
			if (effect?.effectType !== 'Move' || damage < target.hp) return;
			if (target.m.brickCoreUsed) return;
			target.m.brickCoreUsed = true;
			this.add('-ability', target, 'Brick Core');
			return Math.max(1, Math.floor(target.hp / 2));
		},
		flags: {},
		rating: 4,
		num: 1024,
	},
	brickwall: {
		name: "Brickwall",
		shortDesc: "Using a protecting move raises its lower defensive stat by 1.",
		onPrepareHit(source, target, move) {
			if (!move.stallingMove) return;
			const def = source.getStat('def', false, true);
			const spd = source.getStat('spd', false, true);
			this.boost(def <= spd ? { def: 1 } : { spd: 1 }, source, source,
				this.dex.abilities.get('brickwall'));
		},
		flags: {},
		rating: 3,
		num: 1025,
	},
	brutaltemper: {
		name: "Brutal Temper",
		shortDesc: "Raises Attack by 1 when hit by a physical move.",
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical') this.boost({ atk: 1 }, target, target);
		},
		flags: {},
		rating: 3,
		num: 1026,
	},
	burningrage: {
		name: "Burning Rage",
		shortDesc: "Attack is 1.5x while this Pokemon has a status condition.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (pokemon.status) return this.chainModify(1.5);
		},
		flags: {},
		rating: 3,
		num: 1027,
	},

	// =====================================================================
	// C
	// =====================================================================
	cabinetlock: {
		name: "Cabinet Lock",
		shortDesc: "Other Ghost-type Pokemon cannot switch out (their own moves still work).",
		onFoeTrapPokemon(pokemon) {
			if (pokemon.hasType('Ghost') && pokemon.isAdjacent(this.effectState.target as Pokemon)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			source = source || this.effectState.target as Pokemon;
			if (pokemon.hasType('Ghost') && pokemon.isAdjacent(source)) pokemon.maybeTrapped = true;
		},
		flags: {},
		rating: 3.5,
		num: 1028,
	},
	candlesacrifice: {
		name: "Candle Sacrifice",
		shortDesc: "Mega: heals 33% of the defeated Pokemon's max HP after a KO.",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect?.effectType !== 'Move') return;
			this.heal(Math.floor(target.maxhp / 3), source, source,
				this.dex.abilities.get('candlesacrifice'));
		},
		flags: {},
		rating: 3.5,
		num: 1029,
	},
	centrifugalforce: {
		name: "Centrifugal Force",
		shortDesc: "+1 Speed after using a spinning or weight-based move.",
		onAfterMove(pokemon, target, move) {
			const spin = /roll|spin|whirl|drift|carousel|cyclone|vortex/i.test(move.name);
			if (spin || move.basePowerCallback) this.boost({ spe: 1 }, pokemon, pokemon);
		},
		flags: {},
		rating: 3,
		num: 1030,
	},
	chloroplastmind: {
		name: "Chloroplast Mind",
		shortDesc: "Mega: Psychic-type moves gain +1 priority in sunlight.",
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.type === 'Psychic' &&
				['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return priority + 1;
			}
		},
		flags: {},
		rating: 4,
		num: 1031,
	},
	chocolatecover: {
		name: "Chocolate Cover",
		shortDesc: "Immune to sandstorm damage and to powder moves.",
		onImmunity(type) {
			if (type === 'sandstorm') return false;
		},
		onTryHit(target, source, move) {
			if (move.flags['powder'] && target !== source) {
				this.add('-immune', target, '[from] ability: Chocolate Cover');
				return null;
			}
		},
		flags: { breakable: 1 },
		rating: 2,
		num: 1032,
	},
	cinderboost: {
		name: "Cinder Boost",
		shortDesc: "On a stat drop: +1 Speed and its next Fire move deals double damage.",
		onAfterEachBoost(boost, target, source, effect) {
			let lowered = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) lowered = true;
			}
			if (!lowered) return;
			this.boost({ spe: 1 }, target, target, this.dex.abilities.get('cinderboost'));
			target.addVolatile('cinderboost');
		},
		condition: {
			onBasePowerPriority: 9,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type !== 'Fire') return;
				attacker.removeVolatile('cinderboost');
				return this.chainModify(2);
			},
		},
		flags: {},
		rating: 3.5,
		num: 1033,
	},
	clayarmor: {
		name: "Clay Armor",
		shortDesc: "Moves with more than 100 base power are treated as 100 against it.",
		onSourceBasePower(basePower) {
			if (basePower > 100) return 100;
		},
		flags: { breakable: 1 },
		rating: 3.5,
		num: 1034,
	},
	cloudymist: {
		name: "Cloudy Mist",
		shortDesc: "Evasion is two stages higher while it is raining.",
		onModifyAccuracy(accuracy, target, source, move) {
			if (typeof accuracy !== 'number') return;
			if (['raindance', 'primordialsea'].includes(this.field.effectiveWeather())) {
				return this.chainModify([2867, 4096]);
			}
		},
		flags: { breakable: 1 },
		rating: 3,
		num: 1035,
	},
	combustionengine: {
		name: "Combustion Engine",
		shortDesc: "Mega: sets Gasveil. With Gasveil up, Speed doubles and STAB ignores resists.",
		onStart(pokemon) {
			for (const side of pokemon.side.foeSidesWithConditions()) {
				side.addSideCondition('gasveil', pokemon);
			}
		},
		onAfterMega(pokemon) {
			for (const side of pokemon.side.foeSidesWithConditions()) {
				side.addSideCondition('gasveil', pokemon);
			}
		},
		onModifySpe(spe, pokemon) {
			if (pokemon.side.foe.getSideCondition('gasveil')) return this.chainModify(2);
		},
		onModifyMove(move, pokemon) {
			if (pokemon.hasType(move.type) && pokemon.side.foe.getSideCondition('gasveil')) {
				move.ignoreImmunity = move.ignoreImmunity || {};
				(move as any).fakemonIgnoreResist = true;
			}
		},
		onModifyDamage(damage, source, target, move) {
			if ((move as any).fakemonIgnoreResist && target.getMoveHitData(move).typeMod < 0) {
				return this.chainModify(2 ** -target.getMoveHitData(move).typeMod);
			}
		},
		flags: {},
		rating: 4.5,
		num: 1036,
	},
	conductortongue: {
		name: "Conductor Tongue",
		shortDesc: "Its Electric moves hit Pokemon that would normally be immune to them.",
		onModifyMove(move) {
			if (move.type === 'Electric') {
				move.ignoreImmunity = move.ignoreImmunity || {};
				if (typeof move.ignoreImmunity !== 'boolean') move.ignoreImmunity['Electric'] = true;
				move.ignoreAbility = true;
			}
		},
		flags: {},
		rating: 3,
		num: 1037,
	},
	conestorage: {
		name: "Cone Storage",
		shortDesc: "Bullet moves deal 30% more damage.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['bullet']) return this.chainModify(1.3);
		},
		flags: {},
		rating: 3,
		num: 1038,
	},
	cooking: {
		name: "Cooking",
		shortDesc: "After a contact move: +1 Atk/Sp. Atk/Speed, -1 Def/Sp. Def.",
		onAfterMove(pokemon, target, move) {
			if (!move.flags['contact'] || move.category === 'Status') return;
			this.boost({ atk: 1, spa: 1, spe: 1, def: -1, spd: -1 }, pokemon, pokemon,
				this.dex.abilities.get('cooking'));
		},
		flags: {},
		rating: 3,
		num: 1039,
	},
	coralcurse: {
		name: "Coral Curse",
		shortDesc: "Contact attackers and this Pokemon both lose 1/4 max HP each turn.",
		onDamagingHit(damage, target, source, move) {
			if (!move.flags['contact'] || !source.hp) return;
			source.addVolatile('coralcurse');
			target.addVolatile('coralcurse');
		},
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'ability: Coral Curse');
			},
			onResidualOrder: 10,
			onResidual(pokemon) {
				this.damage(pokemon.baseMaxhp / 4, pokemon, null,
					this.dex.abilities.get('coralcurse'));
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'ability: Coral Curse');
			},
		},
		flags: {},
		rating: 3,
		num: 1040,
	},
	corrosivecouture: {
		name: "Corrosive Couture",
		shortDesc: "Mega: immune to Fairy/Grass/Bug moves and badly poisons their user.",
		onTryHit(target, source, move) {
			if (target === source || !['Fairy', 'Grass', 'Bug'].includes(move.type)) return;
			this.add('-immune', target, '[from] ability: Corrosive Couture');
			if (source.hp) source.trySetStatus('tox', target, this.dex.abilities.get('corrosivecouture'));
			return null;
		},
		flags: { breakable: 1 },
		rating: 4.5,
		num: 1041,
	},
	corrosivegrip: {
		name: "Corrosive Grip",
		shortDesc: "Contact moves have a 30% chance to destroy the target's held item.",
		onAfterMoveSecondarySelf(source, target, move) {
			if (!move.flags['contact'] || !target?.hp || !target.item) return;
			if (!this.randomChance(3, 10)) return;
			const item = target.takeItem(source);
			if (item) {
				this.add('-enditem', target, item.name, '[from] ability: Corrosive Grip',
					`[of] ${source}`);
			}
		},
		flags: {},
		rating: 3,
		num: 1042,
	},
	counterkick: {
		name: "Counter-Kick",
		shortDesc: "When hit by a priority move, strikes back with a Fighting-type copy.",
		onDamagingHit(damage, target, source, move) {
			if (move.priority <= 0 || !source.hp || move.category === 'Status') return;
			const counter = this.dex.getActiveMove(move.id);
			counter.type = 'Fighting';
			(counter as any).counterKick = true;
			this.add('-ability', target, 'Counter-Kick');
			this.actions.useMove(counter, target, { target: source });
		},
		onEffectiveness(typeMod, target, type, move) {
			if ((move as any).counterKick && type === 'Flying') return 1;
		},
		flags: {},
		rating: 3.5,
		num: 1043,
	},
	counterweight: {
		name: "Counterweight",
		shortDesc: "Cannot be made to flinch and cannot be forced to switch out.",
		onFlinch() {
			return false;
		},
		onDragOut() {
			return null;
		},
		onTryHit(target, source, move) {
			if (move.forceSwitch && target !== source) {
				this.add('-immune', target, '[from] ability: Counterweight');
				return null;
			}
		},
		flags: { breakable: 1 },
		rating: 3,
		num: 1044,
	},
	crispycharge: {
		name: "Crispy Charge",
		shortDesc: "Doubles the effect of this Pokemon's and its ally's food items.",
		onAllyTryHeal(damage, target, source, effect) {
			if (effect && isFoodItem(this.dex.items.get(effect.id))) return this.chainModify(2);
		},
		onAllyTryBoost(boost, target, source, effect) {
			if (!effect || !isFoodItem(this.dex.items.get(effect.id))) return;
			let stat: BoostID;
			for (stat in boost) {
				const value = boost[stat];
				if (value && value > 0) boost[stat] = value * 2;
			}
		},
		flags: {},
		rating: 3,
		num: 1045,
	},
	crumbarmor: {
		name: "Crumb Armor",
		shortDesc: "When hit by a physical move: +1 Evasion, -1 Defense.",
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical') {
				this.boost({ evasion: 1, def: -1 }, target, target,
					this.dex.abilities.get('crumbarmor'));
			}
		},
		flags: {},
		rating: 2.5,
		num: 1046,
	},
	crustedobsidian: {
		name: "Crusted Obsidian",
		shortDesc: "When hit by a Water or Ice move: +2 Defense, -1 Speed.",
		onDamagingHit(damage, target, source, move) {
			if (['Water', 'Ice'].includes(move.type)) {
				this.boost({ def: 2, spe: -1 }, target, target,
					this.dex.abilities.get('crustedobsidian'));
			}
		},
		flags: {},
		rating: 3,
		num: 1047,
	},
	curingform: {
		name: "Curing Form",
		shortDesc: "At the end of each turn: +1 Defense, -1 Speed.",
		onResidualOrder: 28,
		onResidual(pokemon) {
			this.boost({ def: 1, spe: -1 }, pokemon, pokemon, this.dex.abilities.get('curingform'));
		},
		flags: {},
		rating: 2.5,
		num: 1048,
	},
	cutteredinterior: {
		name: "Cuttered Interior",
		shortDesc: "A Pokemon that tries to take or change its item loses its own instead.",
		onTakeItem(item, pokemon, source) {
			if (!source || source === pokemon) return;
			const stolen = source.takeItem();
			if (stolen) {
				this.add('-enditem', source, stolen.name, '[from] ability: Cuttered Interior',
					`[of] ${pokemon}`);
			}
			return false;
		},
		flags: { breakable: 1 },
		rating: 3,
		num: 1049,
	},
	// =====================================================================
	// D - F
	// =====================================================================
	deadreef: {
		name: "Dead Reef",
		shortDesc: "Immune to Water moves; raises Speed by 1 when hit by one instead.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.boost({ spe: 1 }, target, target)) {
					this.add('-immune', target, '[from] ability: Dead Reef');
				}
				return null;
			}
		},
		flags: { breakable: 1 },
		rating: 3.5,
		num: 1050,
	},
	deeprootreflex: {
		name: "Deep Root Reflex",
		shortDesc: "Ground-type moves deal 50% more damage.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Ground') return this.chainModify(1.5);
		},
		flags: {},
		rating: 3.5,
		num: 1051,
	},
	desertgrappler: {
		name: "Desert Grappler",
		shortDesc: "Mega: sets sunlight on entry/Mega Evolution and doubles Speed in sun.",
		onStart(pokemon) {
			this.field.setWeather('sunnyday', pokemon);
		},
		onAfterMega(pokemon) {
			this.field.setWeather('sunnyday', pokemon);
		},
		onModifySpe(spe, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
		flags: {},
		rating: 4,
		num: 1052,
	},
	differentdimension: {
		name: "Different Dimension",
		shortDesc: "This Pokemon's highest stat other than HP is always doubled.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (highestStat(pokemon) === 'atk') return this.chainModify(2);
		},
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (highestStat(pokemon) === 'def') return this.chainModify(2);
		},
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (highestStat(pokemon) === 'spa') return this.chainModify(2);
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			if (highestStat(pokemon) === 'spd') return this.chainModify(2);
		},
		onModifySpe(spe, pokemon) {
			if (highestStat(pokemon) === 'spe') return this.chainModify(2);
		},
		flags: {},
		rating: 5,
		num: 1053,
	},
	dimensionalforce: {
		name: "Dimensional Force",
		shortDesc: "This Pokemon's moves never miss.",
		onModifyMove(move) {
			move.accuracy = true;
		},
		flags: {},
		rating: 4,
		num: 1054,
	},
	dodge: {
		name: "Dodge",
		shortDesc: "Raises Speed by 2 when an attack misses it.",
		onAccuracyPriority: -1,
		onAccuracy(accuracy, target, source, move) {
			this.effectState.dodgeTarget = target;
			return accuracy;
		},
		onFoeMoveAborted() {},
		onFoeAfterMove(source, target, move) {
			const holder = this.effectState.target as Pokemon;
			if (!holder.hp || move.category === 'Status') return;
			if (source.moveThisTurnResult === false && target === holder) {
				this.boost({ spe: 2 }, holder, holder, this.dex.abilities.get('dodge'));
			}
		},
		flags: {},
		rating: 2.5,
		num: 1055,
	},
	drillingrock: {
		name: "Drilling Rock",
		shortDesc: "Ignores effects triggered by making contact, such as Rough Skin.",
		onModifyMove(move) {
			// Clearing the flag on this copy of the move is what stops the target's
			// contact-triggered abilities and items from seeing it.
			delete move.flags['contact'];
		},
		flags: {},
		rating: 3,
		num: 1056,
	},
	dryskinmask: {
		name: "Dry Skin mask",
		shortDesc: "This Pokemon's Attack cannot be lowered by other Pokemon.",
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost.atk && boost.atk < 0) {
				delete boost.atk;
				if (!(effect as ActiveMove).secondaries) {
					this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Dry Skin mask');
				}
			}
		},
		flags: { breakable: 1 },
		rating: 2.5,
		num: 1057,
	},
	echodrain: {
		name: "Echo Drain",
		shortDesc: "Heals 50% of the damage dealt by its sound moves.",
		onAfterMoveSecondarySelf(source, target, move) {
			if (!move.flags['sound'] || !target) return;
			const damage = move.totalDamage;
			if (typeof damage === 'number' && damage > 0) {
				this.heal(Math.floor(damage / 2), source, source,
					this.dex.abilities.get('echodrain'));
			}
		},
		flags: {},
		rating: 3.5,
		num: 1058,
	},
	echolocation: {
		name: "Echo-Location",
		shortDesc: "Ignores the target's evasion and hits through Substitute.",
		onAnyModifyBoost(boosts, pokemon) {
			const holder = this.effectState.target as Pokemon;
			if (pokemon.isAlly(holder)) return;
			boosts['evasion'] = 0;
		},
		onModifyMove(move) {
			move.flags = { ...move.flags, bypasssub: 1 };
			move.infiltrates = true;
		},
		flags: {},
		rating: 3.5,
		num: 1059,
	},
	eeriesilence: {
		name: "Eerie Silence",
		shortDesc: "While active, all sound moves fail and nothing on the field can flinch.",
		onAnyTryMove(source, target, move) {
			if (move.flags['sound']) {
				this.add('-activate', this.effectState.target, 'ability: Eerie Silence');
				return false;
			}
		},
		onAnyTryAddVolatile(status, target) {
			if (status.id === 'flinch') return null;
		},
		flags: {},
		rating: 3.5,
		num: 1060,
	},
	eggshell: {
		name: "Eggshell",
		shortDesc: "This Pokemon is unaffected by entry hazards.",
		onDamage(damage, target, source, effect) {
			if (effect && ['stealthrock', 'spikes', 'gmaxsteelsurge',
				'fakemonbleedhazard'].includes(effect.id)) {
				return false;
			}
		},
		onSetStatus(status, target, source, effect) {
			if (effect && ['toxicspikes', 'livewire'].includes((effect).id)) return false;
		},
		onTryBoost(boost, target, source, effect) {
			if (effect && effect.id === 'stickyweb') return null;
		},
		flags: { breakable: 1 },
		rating: 3,
		num: 1061,
	},
	electriccarousel: {
		name: "Electric Carousel",
		shortDesc: "Raises Speed by 1 after using an Electric-type move.",
		onAfterMove(pokemon, target, move) {
			if (move.type === 'Electric') this.boost({ spe: 1 }, pokemon, pokemon);
		},
		flags: {},
		rating: 3,
		num: 1062,
	},
	electricteeth: {
		name: "Electric Teeth",
		shortDesc: "This Pokemon's biting moves have a 20% chance to flinch.",
		onModifyMove(move) {
			if (!move.flags['bite'] || move.category === 'Status') return;
			move.secondaries = move.secondaries || [];
			move.secondaries.push({ chance: 20, volatileStatus: 'flinch' });
		},
		flags: {},
		rating: 3,
		num: 1063,
	},
	epicenterfury: {
		name: "Epicenter Fury",
		shortDesc: "Mega: cannot flinch; a prevented flinch makes its next move double and flinch.",
		onFlinch(pokemon) {
			pokemon.addVolatile('epicenterfury');
			return false;
		},
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'ability: Epicenter Fury');
			},
			onBasePowerPriority: 9,
			onBasePower() {
				return this.chainModify(2);
			},
			onModifyMove(move, pokemon) {
				if (move.category === 'Status') return;
				move.secondaries = move.secondaries || [];
				move.secondaries.push({ chance: 100, volatileStatus: 'flinch' });
				pokemon.removeVolatile('epicenterfury');
			},
		},
		flags: {},
		rating: 4,
		num: 1064,
	},
	everfrost: {
		name: "Everfrost",
		shortDesc: "Sets Hail whenever an opponent changes the weather.",
		onAnySetWeather(target, source, weather) {
			const holder = this.effectState.target as Pokemon;
			if (!holder.hp || weather.id === 'hail') return;
			if (source?.isAlly(holder)) return;
			this.add('-ability', holder, 'Everfrost');
			// Queued so it replaces the weather the opponent just set.
			this.field.setWeather('hail', holder);
			return false;
		},
		flags: {},
		rating: 3,
		num: 1065,
	},
	evergreen: {
		name: "Evergreen",
		shortDesc: "This Pokemon cannot be burned or frozen.",
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn' && status.id !== 'frz') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Evergreen');
			}
			return false;
		},
		flags: { breakable: 1 },
		rating: 2.5,
		num: 1066,
	},
	evergreencud: {
		name: "Evergreen Cud",
		shortDesc: "Re-eats a consumed food item one turn later (twice in sun or rain).",
		onEatItem(item, pokemon) {
			pokemon.addVolatile('evergreencud');
			pokemon.volatiles['evergreencud'].item = item.id;
			const weather = pokemon.effectiveWeather();
			pokemon.volatiles['evergreencud'].repeats =
				['sunnyday', 'desolateland', 'raindance', 'primordialsea'].includes(weather) ? 2 : 1;
		},
		condition: {
			onResidualOrder: 28,
			onResidual(pokemon) {
				const item = this.dex.items.get(this.effectState.item as string);
				if (!item.exists || !pokemon.hp) {
					pokemon.removeVolatile('evergreencud');
					return;
				}
				this.add('-activate', pokemon, 'ability: Evergreen Cud', item.name);
				if (item.onEat) this.singleEvent('Eat', item, null, pokemon, null, null);
				this.runEvent('EatItem', pokemon, null, null, item);
				this.effectState.repeats--;
				if (this.effectState.repeats <= 0) pokemon.removeVolatile('evergreencud');
			},
		},
		flags: {},
		rating: 3,
		num: 1067,
	},
	executioner: {
		name: "Executioner",
		shortDesc: "Deals 50% more damage to targets below half HP.",
		onModifyDamage(damage, source, target) {
			if (target.hp * 2 <= target.maxhp) return this.chainModify(1.5);
		},
		flags: {},
		rating: 3.5,
		num: 1068,
	},
	fireproof: {
		name: "Fireproof",
		shortDesc: "This Pokemon takes no damage from Fire-type moves.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				this.add('-immune', target, '[from] ability: Fireproof');
				return null;
			}
		},
		flags: { breakable: 1 },
		rating: 3.5,
		num: 1069,
	},
	firestarter: {
		name: "Fire Starter",
		shortDesc: "This Pokemon's Fire-type moves deal 30% more damage.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Fire') return this.chainModify(1.3);
		},
		flags: {},
		rating: 3.5,
		num: 1070,
	},
	focus: {
		name: "Focus",
		shortDesc: "Attacks redirected to this Pokemon deal double damage.",
		onFoeRedirectTargetPriority: -1,
		onFoeRedirectTarget() {},
		onSourceModifyDamage(damage, source, target, move) {
			if ((move as any).fakemonRedirected) return this.chainModify(2);
		},
		onAnyModifyMove(move, source, target) {
			const holder = this.effectState.target as Pokemon;
			if (target === holder && source.getMoveTargets(move, target)
				.targets.includes(holder) && move.smartTarget === false) {
				(move as any).fakemonRedirected = true;
			}
		},
		flags: {},
		rating: 2.5,
		num: 1071,
	},
	fossilizedwings: {
		name: "Fossilized Wings",
		shortDesc: "Immune to recoil from Flying moves; its Speed cannot be lowered by foes.",
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil' && this.activeMove?.type === 'Flying') return null;
		},
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost.spe && boost.spe < 0) {
				delete boost.spe;
				if (!(effect as ActiveMove).secondaries) {
					this.add('-fail', target, 'unboost', 'Speed', '[from] ability: Fossilized Wings');
				}
			}
		},
		flags: { breakable: 1 },
		rating: 3,
		num: 1072,
	},
	foundation: {
		name: "Foundation",
		shortDesc: "Recoil moves used against this Pokemon deal half damage.",
		onSourceModifyDamage(damage, source, target, move) {
			if (move.recoil || move.hasCrashDamage) return this.chainModify(0.5);
		},
		flags: { breakable: 1 },
		rating: 2.5,
		num: 1073,
	},
	freshair: {
		name: "Fresh Air",
		shortDesc: "Heals 1/16 of its max HP each turn when there is no weather.",
		onResidualOrder: 5,
		onResidual(pokemon) {
			if (!this.field.effectiveWeather()) this.heal(pokemon.baseMaxhp / 16);
		},
		flags: {},
		rating: 2.5,
		num: 1074,
	},
	frostbitescale: {
		name: "Frostbite Scale",
		shortDesc: "Immune to hail damage. Physical attackers have a 30% chance to be frozen.",
		onImmunity(type) {
			if (type === 'hail') return false;
		},
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical' && source.hp && this.randomChance(3, 10)) {
				source.trySetStatus('frz', target, this.dex.abilities.get('frostbitescale'));
			}
		},
		flags: {},
		rating: 3,
		num: 1075,
	},
	frozenarmor: {
		name: "Frozen Armor",
		shortDesc: "Immune to Ice moves; raises Def and Sp. Def by 1 when hit by one instead.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Ice') {
				if (!this.boost({ def: 1, spd: 1 }, target, target)) {
					this.add('-immune', target, '[from] ability: Frozen Armor');
				}
				return null;
			}
		},
		flags: { breakable: 1 },
		rating: 3.5,
		num: 1076,
	},
	// =====================================================================
	// G - M
	// =====================================================================
	gingerbread: {
		name: "Gingerbread",
		shortDesc: "When hit by a Fire move, raises its higher attacking stat and Speed by 1.",
		onDamagingHit(damage, target, source, move) {
			if (move.type !== 'Fire') return;
			const stat = target.getStat('atk', false, true) >= target.getStat('spa', false, true) ?
				'atk' : 'spa';
			this.boost({ [stat]: 1, spe: 1 }, target, target,
				this.dex.abilities.get('gingerbread'));
		},
		flags: {},
		rating: 3,
		num: 1077,
	},
	grassstarter: {
		name: "Grass-Starter",
		shortDesc: "This Pokemon's Grass-type moves deal 30% more damage.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Grass') return this.chainModify(1.3);
		},
		flags: {},
		rating: 3.5,
		num: 1078,
	},
	groundanchor: {
		name: "Ground Anchor",
		shortDesc: "This Pokemon cannot be forced to switch out.",
		onDragOut() {
			return null;
		},
		onTryHit(target, source, move) {
			if (move.forceSwitch && target !== source) {
				this.add('-immune', target, '[from] ability: Ground Anchor');
				return null;
			}
		},
		flags: { breakable: 1 },
		rating: 2.5,
		num: 1079,
	},
	headshield: {
		name: "Headshield",
		shortDesc: "Positive Defense and Sp. Def boosts on this Pokemon count 1.3x.",
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (pokemon.boosts.def > 0) return this.chainModify(1.3);
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			if (pokemon.boosts.spd > 0) return this.chainModify(1.3);
		},
		flags: {},
		rating: 3,
		num: 1080,
	},
	heliumvoice: {
		name: "Helium Voice",
		shortDesc: "Sound moves become Flying-type and deal 20% more damage.",
		onModifyTypePriority: -1,
		onModifyType(move) {
			if (move.flags['sound']) move.type = 'Flying';
		},
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['sound']) return this.chainModify(1.2);
		},
		flags: {},
		rating: 3.5,
		num: 1081,
	},
	holidaycheer: {
		name: "Holiday Cheer",
		shortDesc: "Mega: sets Snow for 5 turns; all of this Pokemon's moves are 100% accurate.",
		onStart(pokemon) {
			this.field.setWeather('snowscape', pokemon);
		},
		onAfterMega(pokemon) {
			this.field.setWeather('snowscape', pokemon);
		},
		onModifyMove(move) {
			move.accuracy = true;
		},
		flags: {},
		rating: 4,
		num: 1082,
	},
	hover: {
		name: "Hover",
		shortDesc: "In Electric Terrain: immune to Ground moves and Speed is 1.5x.",
		onImmunity(type, pokemon) {
			if (type === 'Ground' && this.field.isTerrain('electricterrain')) return false;
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Ground' &&
				this.field.isTerrain('electricterrain')) {
				this.add('-immune', target, '[from] ability: Hover');
				return null;
			}
		},
		onModifySpe(spe) {
			if (this.field.isTerrain('electricterrain')) return this.chainModify(1.5);
		},
		flags: { breakable: 1 },
		rating: 3.5,
		num: 1083,
	},
	huntinginstinct: {
		name: "Hunting Instinct",
		shortDesc: "Contact moves are used as if this Pokemon's Speed were 50% higher.",
		onModifySpe(spe, pokemon) {
			const action = this.queue.willMove(pokemon);
			const move = action && this.dex.moves.get(
				(action as any).move?.id || (action as any).moveid);
			if (move?.flags['contact']) return this.chainModify(1.5);
		},
		flags: {},
		rating: 3,
		num: 1084,
	},
	hydromechanics: {
		name: "Hydro Mechanics",
		shortDesc: "Physical Water-type moves deal 50% more damage.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Water' && move.category === 'Physical') return this.chainModify(1.5);
		},
		flags: {},
		rating: 3.5,
		num: 1085,
	},
	icespikemist: {
		name: "Ice Spike Mist",
		shortDesc: "Mega: in rain, this Pokemon's attacks have a 50% chance to freeze.",
		onModifyMove(move, pokemon) {
			if (move.category === 'Status') return;
			if (!['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) return;
			move.secondaries = move.secondaries || [];
			move.secondaries.push({ chance: 50, status: 'frz' });
		},
		flags: {},
		rating: 4,
		num: 1086,
	},
	inductioncharge: {
		name: "Induction Charge",
		shortDesc: "Hit by an Electric move: its next Electric move deals double damage.",
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Electric') target.addVolatile('inductioncharge');
		},
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'ability: Induction Charge');
			},
			onBasePowerPriority: 9,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type !== 'Electric') return;
				attacker.removeVolatile('inductioncharge');
				return this.chainModify(2);
			},
		},
		flags: {},
		rating: 3,
		num: 1087,
	},
	inflaming: {
		name: "Inflaming",
		shortDesc: "Super effective Fire-type moves deal 33% more damage.",
		onModifyDamage(damage, source, target, move) {
			if (move.type === 'Fire' && target.getMoveHitData(move).typeMod > 0) {
				return this.chainModify(1.33);
			}
		},
		flags: {},
		rating: 3,
		num: 1088,
	},
	invertedflight: {
		name: "Inverted Flight",
		shortDesc: "Accuracy, Evasion and Speed drops become boosts instead.",
		onTryBoost(boost, target, source, effect) {
			for (const stat of ['accuracy', 'evasion', 'spe'] as BoostID[]) {
				if (boost[stat] && boost[stat] < 0) boost[stat] = -boost[stat] as any;
			}
		},
		flags: { breakable: 1 },
		rating: 3.5,
		num: 1089,
	},
	invertedgrowth: {
		name: "Inverted Growth",
		shortDesc: "Below half HP, swaps Attack with Defense and Sp. Atk with Sp. Def.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (pokemon.hp * 2 <= pokemon.maxhp) return pokemon.storedStats.def;
		},
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (pokemon.hp * 2 <= pokemon.maxhp) return pokemon.storedStats.atk;
		},
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (pokemon.hp * 2 <= pokemon.maxhp) return pokemon.storedStats.spd;
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			if (pokemon.hp * 2 <= pokemon.maxhp) return pokemon.storedStats.spa;
		},
		flags: {},
		rating: 3,
		num: 1090,
	},
	ironcollar: {
		name: "Iron Collar",
		shortDesc: "Critical hits deal no damage to it; contact moves deal 2/3 damage.",
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).crit) return 0;
			if (move.flags['contact']) return this.chainModify([2731, 4096]);
		},
		onCriticalHit() {
			return false;
		},
		flags: { breakable: 1 },
		rating: 4,
		num: 1091,
	},
	isotonic: {
		name: "Isotonic",
		shortDesc: "Healing on this Pokemon is 1.5x; healing it gives others is 1.33x.",
		onTryHeal(damage, target, source, effect) {
			if (target === this.effectState.target) return this.chainModify(1.5);
		},
		onAnyTryHeal(damage, target, source, effect) {
			if (source === this.effectState.target && target !== source) {
				return this.chainModify(1.33);
			}
		},
		flags: {},
		rating: 3,
		num: 1092,
	},
	itemfinder: {
		name: "Itemfinder",
		shortDesc: "If it has no item, 33% chance each turn to find a random food item.",
		onResidualOrder: 28,
		onResidual(pokemon) {
			if (pokemon.item || !pokemon.hp) return;
			if (!this.randomChance(1, 3)) return;
			const found = this.sample(FOOD_ITEMS as unknown as string[]);
			pokemon.setItem(found);
			this.add('-item', pokemon, this.dex.items.get(found).name,
				'[from] ability: Itemfinder');
		},
		flags: {},
		rating: 3,
		num: 1093,
	},
	kaleidoscopicveil: {
		name: "Kaleidoscopic Veil",
		shortDesc: "Sets Psychic Terrain when hit by a special move.",
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Special') this.field.setTerrain('psychicterrain', target);
		},
		flags: {},
		rating: 3,
		num: 1094,
	},
	kamikaze: {
		name: "Kamikaze",
		shortDesc: "Recoil moves deal 30% more damage.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.recoil || move.hasCrashDamage) return this.chainModify(1.3);
		},
		flags: {},
		rating: 3,
		num: 1095,
	},
	lightningspike: {
		name: "Lightning Spike",
		shortDesc: "Paralyses any Pokemon that damages it.",
		onDamagingHit(damage, target, source) {
			if (source.hp) source.trySetStatus('par', target, this.dex.abilities.get('lightningspike'));
		},
		flags: {},
		rating: 3.5,
		num: 1096,
	},
	lightweight: {
		name: "Lightweight",
		shortDesc: "Weight is 1/4x and it is immune to weight-based moves.",
		onModifyWeight(weighthg) {
			return this.trunc(weighthg / 4);
		},
		onTryHit(target, source, move) {
			if (target !== source && WEIGHT_MOVES.has(move.id)) {
				this.add('-immune', target, '[from] ability: Lightweight');
				return null;
			}
		},
		flags: { breakable: 1 },
		rating: 2.5,
		num: 1097,
	},
	luchalibre: {
		name: "Lucha Libre",
		shortDesc: "On switch-in, raises its critical hit ratio (Focus Energy).",
		onStart(pokemon) {
			pokemon.addVolatile('focusenergy');
			this.add('-ability', pokemon, 'Lucha Libre');
		},
		flags: {},
		rating: 3,
		num: 1098,
	},
	madness: {
		name: "Madness",
		shortDesc: "Repeating a move deals 10% more damage for each consecutive use.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			const state = attacker.volatiles['madness'];
			if (state?.move === move.id && state.count > 0) {
				return this.chainModify(1 + 0.1 * Math.min(state.count, 10));
			}
		},
		onAfterMove(pokemon, target, move) {
			if (move.category === 'Status') return;
			const state = pokemon.volatiles['madness'];
			if (state?.move === move.id) {
				state.count++;
			} else {
				pokemon.removeVolatile('madness');
				pokemon.addVolatile('madness');
				pokemon.volatiles['madness'].move = move.id;
				pokemon.volatiles['madness'].count = 1;
			}
		},
		condition: {
			noCopy: true,
			onStart() {
				this.effectState.count = 0;
			},
		},
		flags: {},
		rating: 3.5,
		num: 1099,
	},
	magmameltdown: {
		name: "Magma Meltdown",
		shortDesc: "Rock moves become Fire-type when that would be more effective.",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon, target) {
			if (move.type !== 'Rock' || !target) return;
			const asRock = this.dex.getEffectiveness('Rock', target);
			const asFire = this.dex.getEffectiveness('Fire', target);
			const fireBlocked = !this.dex.getImmunity('Fire', target);
			if (!fireBlocked && asFire > asRock) move.type = 'Fire';
		},
		flags: {},
		rating: 3.5,
		num: 1100,
	},
	magneticmemory: {
		name: "Magnetic Memory",
		shortDesc: "Permanently takes 25% less damage from every move that has hit it.",
		onSourceModifyDamage(damage, source, target, move) {
			if (target.m.memorizedMoves?.includes(move.id)) return this.chainModify(0.75);
		},
		onDamagingHit(damage, target, source, move) {
			target.m.memorizedMoves = target.m.memorizedMoves || [];
			if (!target.m.memorizedMoves.includes(move.id)) {
				target.m.memorizedMoves.push(move.id);
				this.add('-ability', target, 'Magnetic Memory', move.name);
			}
		},
		flags: { breakable: 1 },
		rating: 4,
		num: 1101,
	},
	malwareinjection: {
		name: "Malware Injection",
		shortDesc: "Hit at full HP: permanently suppresses the attacker's ability.",
		onDamagingHit(damage, target, source, move) {
			if (target.m.wasFullHp === false || !source.hp) return;
			source.addVolatile('gastroacid');
			this.add('-ability', target, 'Malware Injection');
		},
		onBeforeMove() {},
		onFoeBeforeMove() {},
		onAnyPrepareHit(source, target, move) {
			const holder = this.effectState.target as Pokemon;
			holder.m.wasFullHp = holder.hp === holder.maxhp;
		},
		flags: {},
		rating: 4,
		num: 1102,
	},
	megaconsumer: {
		name: "Mega Consumer",
		shortDesc: "Mega Evolving boosts all of this Pokemon's stats by 50% for 3 turns.",
		onAfterMega(pokemon) {
			pokemon.addVolatile('megaconsumer');
		},
		condition: {
			duration: 3,
			onStart(pokemon) {
				this.add('-start', pokemon, 'ability: Mega Consumer');
			},
			onModifyAtkPriority: 5,
			onModifyAtk() {
				return this.chainModify(1.5);
			},
			onModifyDefPriority: 6,
			onModifyDef() {
				return this.chainModify(1.5);
			},
			onModifySpAPriority: 5,
			onModifySpA() {
				return this.chainModify(1.5);
			},
			onModifySpDPriority: 6,
			onModifySpD() {
				return this.chainModify(1.5);
			},
			onModifySpe() {
				return this.chainModify(1.5);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'ability: Mega Consumer');
			},
		},
		flags: {},
		rating: 4,
		num: 1103,
	},
	mentaloverwhelm: {
		name: "Mental Overwhelm",
		shortDesc: "Attacked by a faster Pokemon: the two swap Speed for the rest of the battle.",
		onDamagingHit(damage, target, source) {
			if (target.m.overwhelmed || source.getStat('spe') <= target.getStat('spe')) return;
			const mine = target.storedStats.spe;
			target.storedStats.spe = source.storedStats.spe;
			source.storedStats.spe = mine;
			target.m.overwhelmed = true;
			this.add('-ability', target, 'Mental Overwhelm');
			this.add('-message', `${target.name} and ${source.name} swapped Speed!`);
		},
		flags: {},
		rating: 3,
		num: 1104,
	},
	mindfocus: {
		name: "Mindfocus",
		shortDesc: "Mega: after a status move, it cannot flinch and its next hit always crits.",
		onAfterMove(pokemon, target, move) {
			if (move.category === 'Status') pokemon.addVolatile('mindfocus');
		},
		condition: {
			duration: 2,
			onStart(pokemon) {
				this.add('-start', pokemon, 'ability: Mindfocus');
			},
			onFlinch() {
				return false;
			},
			onModifyCritRatio() {
				return 5;
			},
		},
		flags: {},
		rating: 3.5,
		num: 1105,
	},
	mirrorfacade: {
		name: "Mirror Facade",
		shortDesc: "In Haunted Room, special attacks hitting it are reflected for 33% damage.",
		onDamagingHit(damage, target, source, move) {
			if (move.category !== 'Special' || !source.hp) return;
			if (!this.field.getPseudoWeather('hauntedroom')) return;
			const reflected = this.dex.getActiveMove(move.id);
			reflected.basePower = Math.max(1, Math.floor(reflected.basePower / 3));
			this.add('-ability', target, 'Mirror Facade');
			this.actions.useMove(reflected, target, { target: source });
		},
		flags: {},
		rating: 3.5,
		num: 1106,
	},
	misfortune: {
		name: "Misfortune",
		shortDesc: "The chance of every secondary effect on the field is halved.",
		onAnyModifyMove(move) {
			if (!move.secondaries) return;
			for (const secondary of move.secondaries) {
				if (secondary.chance) secondary.chance = Math.floor(secondary.chance / 2);
			}
		},
		flags: {},
		rating: 2.5,
		num: 1107,
	},
	mudbody: {
		name: "Mudbody",
		shortDesc: "Physical moves deal 25% less damage; Water moves deal none.",
		onSourceModifyDamage(damage, source, target, move) {
			if (move.category === 'Physical') return this.chainModify(0.75);
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				this.add('-immune', target, '[from] ability: Mudbody');
				return null;
			}
		},
		flags: { breakable: 1 },
		rating: 4,
		num: 1108,
	},
	mudlover: {
		name: "Mudlover",
		shortDesc: "This Pokemon's Water-type moves become Ground-type.",
		onModifyTypePriority: -1,
		onModifyType(move) {
			if (move.type === 'Water') move.type = 'Ground';
		},
		flags: {},
		rating: 3,
		num: 1109,
	},
	mudpile: {
		name: "Mudpile",
		shortDesc: "Above 50% HP: Def/Sp. Def 1.7x, Speed 0.5x. Lost permanently below 50%.",
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (!pokemon.m.mudpileBroken && pokemon.hp * 2 > pokemon.maxhp) {
				return this.chainModify(1.7);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			if (!pokemon.m.mudpileBroken && pokemon.hp * 2 > pokemon.maxhp) {
				return this.chainModify(1.7);
			}
		},
		onModifySpe(spe, pokemon) {
			if (!pokemon.m.mudpileBroken && pokemon.hp * 2 > pokemon.maxhp) {
				return this.chainModify(0.5);
			}
		},
		onUpdate(pokemon) {
			if (pokemon.hp * 2 <= pokemon.maxhp && !pokemon.m.mudpileBroken) {
				pokemon.m.mudpileBroken = true;
				this.add('-ability', pokemon, 'Mudpile', '[from] Mudpile');
			}
		},
		flags: {},
		rating: 3.5,
		num: 1110,
	},
	mudrush: {
		name: "Mud Rush",
		shortDesc: "Speed doubles in rain when this Pokemon is about to use a Ground move.",
		onModifySpe(spe, pokemon) {
			if (!['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) return;
			const action = this.queue.willMove(pokemon);
			const move = action && this.dex.moves.get(
				(action as any).move?.id || (action as any).moveid);
			if (move?.type === 'Ground') return this.chainModify(2);
		},
		flags: {},
		rating: 3,
		num: 1111,
	},
	myceliumgrowth: {
		name: "Mycelium Growth",
		shortDesc: "Immune to Water moves; raises its higher defensive stat by 1 instead.",
		onTryHit(target, source, move) {
			if (target === source || move.type !== 'Water') return;
			const stat = target.getStat('def', false, true) >= target.getStat('spd', false, true) ?
				'def' : 'spd';
			if (!this.boost({ [stat]: 1 }, target, target)) {
				this.add('-immune', target, '[from] ability: Mycelium Growth');
			}
			return null;
		},
		flags: { breakable: 1 },
		rating: 3.5,
		num: 1112,
	},
	// =====================================================================
	// N - R
	// =====================================================================
	nibble: {
		name: "Nibble",
		shortDesc: "Eats the target's food item when it lands a contact move.",
		onAfterMoveSecondarySelf(source, target, move) {
			if (!move.flags['contact'] || !target?.hp) return;
			const item = target.getItem();
			if (!isFoodItem(item)) return;
			if (target.takeItem(source)) {
				this.add('-enditem', target, item.name, '[from] ability: Nibble', `[of] ${source}`);
				if (item.onEat) this.singleEvent('Eat', item, null, source, null, null);
			}
		},
		flags: {},
		rating: 3,
		num: 1113,
	},
	overcharge: {
		name: "Overcharge",
		shortDesc: "Electric moves deal 50% more damage below 1/3 max HP.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Electric' && attacker.hp * 3 <= attacker.maxhp) {
				return this.chainModify(1.5);
			}
		},
		flags: {},
		rating: 3,
		num: 1114,
	},
	overgrownpredator: {
		name: "Overgrown Predator",
		shortDesc: "Mega: STAB moves deal 30% more damage and their damage cannot be reduced.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.hasType(move.type)) return this.chainModify(1.3);
		},
		onAnyModifyDamage(damage, source, target, move) {
			if (source !== this.effectState.target) return;
			if (!source.hasType(move.type)) return;
			// Cancel every reduction the defender applied by re-normalising.
			if (target.getMoveHitData(move).typeMod < 0) {
				return this.chainModify(2 ** -target.getMoveHitData(move).typeMod);
			}
		},
		flags: {},
		rating: 4.5,
		num: 1115,
	},
	parabolicamp: {
		name: "Parabolic Amp",
		shortDesc: "Moves that would be super effective are 30% more accurate.",
		onModifyAccuracy(accuracy, target, source, move) {
			if (typeof accuracy !== 'number' || !target) return;
			if (target.runEffectiveness(move) > 0) return this.chainModify(1.3);
		},
		flags: {},
		rating: 2.5,
		num: 1116,
	},
	pinpointneedle: {
		name: "Pinpoint Needle",
		shortDesc: "Beak- and blade-like moves deal 30% more damage.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (/beak|peck|needle|spike|blade|slash|cut|drill|lance|stab|sever/i.test(move.name)) {
				return this.chainModify(1.3);
			}
		},
		flags: {},
		rating: 3,
		num: 1117,
	},
	pixiedust: {
		name: "Pixie Dust",
		shortDesc: "Sets Misty Terrain on switch-in.",
		onStart(pokemon) {
			this.field.setTerrain('mistyterrain', pokemon);
		},
		flags: {},
		rating: 3.5,
		num: 1118,
	},
	planetring: {
		name: "Planet Ring",
		shortDesc: "At the end of each turn, deals 40 Rock damage to all foes (20 to its ally).",
		onResidualOrder: 26,
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			this.add('-ability', pokemon, 'Planet Ring');
			for (const target of pokemon.foes()) {
				if (target.hp) {
					this.damage(this.dex.getEffectiveness('Rock', target) >= 0 ? 40 : 20,
						target, pokemon, this.dex.abilities.get('planetring'));
				}
			}
			for (const ally of pokemon.alliesAndSelf()) {
				if (ally !== pokemon && ally.hp) {
					this.damage(20, ally, pokemon, this.dex.abilities.get('planetring'));
				}
			}
		},
		flags: {},
		rating: 4,
		num: 1119,
	},
	playtimejoy: {
		name: "Playtime Joy",
		shortDesc: "Mega: on entry or Mega Evolution, foes cannot use status moves for 3 turns.",
		onStart(pokemon) {
			for (const target of pokemon.foes()) target.addVolatile('taunt', pokemon);
		},
		onAfterMega(pokemon) {
			for (const target of pokemon.foes()) target.addVolatile('taunt', pokemon);
		},
		flags: {},
		rating: 4,
		num: 1120,
	},
	polarityshift: {
		name: "Polarity Shift",
		shortDesc: "For 3 turns after its first entry, its weaknesses become immunities.",
		onStart(pokemon) {
			if (pokemon.m.polarityUsed) return;
			pokemon.m.polarityUsed = true;
			pokemon.addVolatile('polarityshift');
		},
		condition: {
			duration: 3,
			onStart(pokemon) {
				this.add('-start', pokemon, 'ability: Polarity Shift');
			},
			onTryHitPriority: 2,
			onTryHit(target, source, move) {
				if (target === source || move.category === 'Status') return;
				if (target.runEffectiveness(move) > 0) {
					this.add('-immune', target, '[from] ability: Polarity Shift');
					return null;
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'ability: Polarity Shift');
			},
		},
		flags: { breakable: 1 },
		rating: 4,
		num: 1121,
	},
	poprelfex: {
		name: "Pop Relfex",
		shortDesc: "Maximises Speed when hit by a critical hit.",
		onHit(target, source, move) {
			if (target.getMoveHitData(move).crit) {
				this.boost({ spe: 6 }, target, target, this.dex.abilities.get('poprelfex'));
			}
		},
		flags: {},
		rating: 3,
		num: 1122,
	},
	powergrid: {
		name: "Power Grid",
		shortDesc: "Mega: keeps its old ability and can hit Ground types with Electric moves.",
		onStart(pokemon) {
			// The Mega keeps whatever ability it had before Mega Evolving, held in
			// `m.preMegaAbility` by the Mega Evolution code path.
			const previous = pokemon.m.preMegaAbility;
			if (previous && previous !== 'powergrid') {
				this.add('-ability', pokemon, this.dex.abilities.get(previous).name,
					'[from] ability: Power Grid');
			}
		},
		onModifyMove(move) {
			if (move.type !== 'Electric') return;
			move.ignoreImmunity = move.ignoreImmunity || {};
			if (typeof move.ignoreImmunity !== 'boolean') move.ignoreImmunity['Electric'] = true;
			(move as any).groundedGrid = true;
		},
		onEffectiveness(typeMod, target, type, move) {
			if ((move as any).groundedGrid && type === 'Ground') return 0;
		},
		flags: {},
		rating: 4,
		num: 1123,
	},
	poweroffriendship: {
		name: "Power of Friendship",
		shortDesc: "50% chance to heal its ally 1/8 max HP at the end of each turn.",
		onResidualOrder: 28,
		onResidual(pokemon) {
			for (const ally of pokemon.adjacentAllies()) {
				if (ally.hp && this.randomChance(1, 2)) {
					this.heal(ally.baseMaxhp / 8, ally, pokemon,
						this.dex.abilities.get('poweroffriendship'));
				}
			}
		},
		flags: {},
		rating: 2.5,
		num: 1124,
	},
	prehistoricterror: {
		name: "Prehistoric Terror",
		shortDesc: "Mega: while it is active, every protecting move fails.",
		onAnyTryMove(source, target, move) {
			if (move.stallingMove) {
				this.add('-activate', this.effectState.target, 'ability: Prehistoric Terror');
				return false;
			}
		},
		flags: {},
		rating: 4,
		num: 1125,
	},
	rainbowcake: {
		name: "Rainbowcake",
		shortDesc: "Mega: raises Sp. Atk by 1 before using a special attack.",
		onPrepareHit(source, target, move) {
			if (move.category === 'Special') {
				this.boost({ spa: 1 }, source, source, this.dex.abilities.get('rainbowcake'));
			}
		},
		flags: {},
		rating: 4,
		num: 1126,
	},
	reckless: {
		name: "Reckless",
		shortDesc: "Immune and resisted hits land as if they were neutral.",
		onModifyMove(move) {
			move.ignoreImmunity = true;
		},
		onEffectiveness(typeMod) {
			if (typeMod < 0) return 0;
		},
		flags: {},
		rating: 4,
		num: 1127,
	},
	reflectlayer: {
		name: "Reflect Layer",
		shortDesc: "Priority moves used against it deal 100% recoil to their user.",
		onDamagingHit(damage, target, source, move) {
			if (move.priority > 0 && source.hp) {
				this.damage(damage, source, target, this.dex.abilities.get('reflectlayer'));
			}
		},
		flags: {},
		rating: 3,
		num: 1128,
	},
	refreshaura: {
		name: "Refresh Aura",
		shortDesc: "Cures its own and its ally's status conditions on switch-in.",
		onStart(pokemon) {
			let activated = false;
			for (const ally of pokemon.alliesAndSelf()) {
				if (!ally.status) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Refresh Aura');
					activated = true;
				}
				ally.cureStatus();
			}
		},
		flags: {},
		rating: 3,
		num: 1129,
	},
	remanence: {
		name: "Remanence",
		shortDesc: "Keeps its stat changes and volatile effects when it switches out.",
		onSwitchOut(pokemon) {
			pokemon.m.remanenceBoosts = { ...pokemon.boosts };
		},
		onStart(pokemon) {
			if (pokemon.m.remanenceBoosts) {
				pokemon.setBoost(pokemon.m.remanenceBoosts);
				this.add('-ability', pokemon, 'Remanence');
			}
		},
		flags: {},
		rating: 3.5,
		num: 1130,
	},
	resonanceshell: {
		name: "Resonance Shell",
		shortDesc: "While a room is active, status conditions are blocked and reflected.",
		onSetStatus(status, target, source, effect) {
			const roomUp = ['trickroom', 'magicroom', 'wonderroom', 'hauntedroom', 'glitchedroom']
				.some(id => this.field.getPseudoWeather(id));
			if (!roomUp || !source || source === target) return;
			this.add('-immune', target, '[from] ability: Resonance Shell');
			source.trySetStatus(status, target, this.dex.abilities.get('resonanceshell'));
			return false;
		},
		flags: { breakable: 1 },
		rating: 3,
		num: 1131,
	},
	rootanchor: {
		name: "Root Anchor",
		shortDesc: "Speed is halved, but it cannot be forced to switch out.",
		onModifySpe(spe) {
			return this.chainModify(0.5);
		},
		onDragOut() {
			return null;
		},
		flags: {},
		rating: 2,
		num: 1132,
	},
	rooted: {
		name: "Rooted",
		shortDesc: "Cannot switch out, but regains 1/8 of its max HP each turn.",
		onStart(pokemon) {
			pokemon.addVolatile('fakemonrooted');
		},
		onTrapPokemon(pokemon) {
			pokemon.tryTrap();
		},
		onResidualOrder: 5,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 8);
		},
		flags: {},
		rating: 3,
		num: 1133,
	},
	ruine: {
		name: "Ruine",
		shortDesc: "When it faints, the replacement gets +1 Defense and +1 Sp. Def.",
		onFaint(pokemon) {
			pokemon.side.addSideCondition('ruine', pokemon);
		},
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'ability: Ruine');
			},
			onSwitchIn(pokemon) {
				this.boost({ def: 1, spd: 1 }, pokemon, pokemon, this.dex.abilities.get('ruine'));
				pokemon.side.removeSideCondition('ruine');
			},
		},
		flags: {},
		rating: 3,
		num: 1134,
	},
	// =====================================================================
	// S - Z
	// =====================================================================
	scavengerhunger: {
		name: "Scavenger Hunger",
		shortDesc: "Raises Speed by 1 whenever any Pokemon on the field faints.",
		onAnyFaint() {
			const holder = this.effectState.target as Pokemon;
			if (holder.hp) this.boost({ spe: 1 }, holder, holder);
		},
		flags: {},
		rating: 3,
		num: 1135,
	},
	scorchingscurry: {
		name: "Scorching Scurry",
		shortDesc: "Raises Evasion by 2 when it first drops below half HP.",
		onUpdate(pokemon) {
			if (pokemon.hp * 2 <= pokemon.maxhp && !pokemon.m.scurryUsed) {
				pokemon.m.scurryUsed = true;
				this.boost({ evasion: 2 }, pokemon, pokemon,
					this.dex.abilities.get('scorchingscurry'));
			}
		},
		flags: {},
		rating: 3,
		num: 1136,
	},
	seismicforce: {
		name: "Seismic Force",
		shortDesc: "Ground-type and punching moves deal 30% more damage.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Ground' || move.flags['punch']) return this.chainModify(1.3);
		},
		flags: {},
		rating: 3.5,
		num: 1137,
	},
	shelfshroomtexture: {
		name: "Shelf Shroom Texture",
		shortDesc: "Physical damage is reduced by 20%, but Fire moves deal 30% more.",
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Fire') return this.chainModify(1.3);
			if (move.category === 'Physical') return this.chainModify(0.8);
		},
		flags: { breakable: 1 },
		rating: 3,
		num: 1138,
	},
	skystrikeinception: {
		name: "Skystrike Inception",
		shortDesc: "Sp. Atk is 50% higher while it is raining.",
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		flags: {},
		rating: 3.5,
		num: 1139,
	},
	slicingmassacre: {
		name: "Slicing Massacre",
		shortDesc: "Uses its Attack stat in place of Sp. Atk for special moves.",
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			return pokemon.storedStats.atk;
		},
		flags: {},
		rating: 4,
		num: 1140,
	},
	slowmofly: {
		name: "Slowmofly",
		shortDesc: "Immune to Ground moves; its field, weather and screen effects last 3 turns longer.",
		onImmunity(type) {
			if (type === 'Ground') return false;
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Ground') {
				this.add('-immune', target, '[from] ability: Slowmofly');
				return null;
			}
		},
		onAfterMove(pokemon) {
			// Everything this Pokemon just put on the field lasts three turns longer.
			for (const state of Object.values(this.field.pseudoWeather)) {
				if (state.source === pokemon && !state.slowmofly) {
					state.slowmofly = true;
					if (state.duration) state.duration += 3;
				}
			}
			if (this.field.weatherState.source === pokemon && !this.field.weatherState.slowmofly) {
				this.field.weatherState.slowmofly = true;
				if (this.field.weatherState.duration) this.field.weatherState.duration += 3;
			}
			for (const side of this.sides) {
				for (const state of Object.values(side.sideConditions)) {
					if (state.source === pokemon && !state.slowmofly) {
						state.slowmofly = true;
						if (state.duration) state.duration += 3;
					}
				}
			}
		},
		flags: { breakable: 1 },
		rating: 4,
		num: 1141,
	},
	sludgepile: {
		name: "Sludgepile",
		shortDesc: "Mega Mudpile: also traps foes hit by its biting moves.",
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (!pokemon.m.mudpileBroken && pokemon.hp * 2 > pokemon.maxhp) {
				return this.chainModify(1.7);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			if (!pokemon.m.mudpileBroken && pokemon.hp * 2 > pokemon.maxhp) {
				return this.chainModify(1.7);
			}
		},
		onModifySpe(spe, pokemon) {
			if (!pokemon.m.mudpileBroken && pokemon.hp * 2 > pokemon.maxhp) {
				return this.chainModify(0.5);
			}
		},
		onUpdate(pokemon) {
			if (pokemon.hp * 2 <= pokemon.maxhp) pokemon.m.mudpileBroken = true;
		},
		onAfterMoveSecondarySelf(source, target, move) {
			if (move.flags['bite'] && target?.hp) {
				target.addVolatile('trapped', source, move, 'trapper');
			}
		},
		flags: {},
		rating: 4,
		num: 1142,
	},
	sneakysting: {
		name: "Sneaky Sting",
		shortDesc: "This Pokemon's priority moves deal double damage.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.priority > 0) return this.chainModify(2);
		},
		flags: {},
		rating: 3.5,
		num: 1143,
	},
	sniff: {
		name: "Sniff",
		shortDesc: "Reveals the abilities of opposing Pokemon on switch-in.",
		onStart(pokemon) {
			for (const target of pokemon.foes()) {
				this.add('-ability', target, target.getAbility().name, '[from] ability: Sniff',
					`[of] ${pokemon}`, '[identify]');
			}
		},
		flags: {},
		rating: 1.5,
		num: 1144,
	},
	solarcharge: {
		name: "Solarcharge",
		shortDesc: "In sunlight, sound and Electric moves deal 50% more damage.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (!['sunnyday', 'desolateland'].includes(attacker.effectiveWeather())) return;
			if (move.flags['sound'] || move.type === 'Electric') return this.chainModify(1.5);
		},
		flags: {},
		rating: 3,
		num: 1145,
	},
	sonicresonance: {
		name: "Sonic Resonance",
		shortDesc: "Sets Reflect when hit by a sound move.",
		onDamagingHit(damage, target, source, move) {
			if (move.flags['sound']) target.side.addSideCondition('reflect', target);
		},
		flags: {},
		rating: 2.5,
		num: 1146,
	},
	soulburner: {
		name: "Soul Burner",
		shortDesc: "Deals more damage the slower the target is (0.5x to 2x).",
		onModifyDamage(damage, source, target) {
			const ratio = target.getStat('spe') / Math.max(1, source.getStat('spe'));
			const modifier = Math.max(0.5, Math.min(2, 2 - ratio));
			return this.chainModify(modifier);
		},
		flags: {},
		rating: 3.5,
		num: 1147,
	},
	soulscent: {
		name: "Soul Scent",
		shortDesc: "Raises its critical hit ratio and Speed by 1 when any Pokemon faints.",
		onAnyFaint() {
			const holder = this.effectState.target as Pokemon;
			if (!holder.hp) return;
			holder.addVolatile('focusenergy');
			this.boost({ spe: 1 }, holder, holder);
		},
		flags: {},
		rating: 3,
		num: 1148,
	},
	sourpeel: {
		name: "Sour Peel",
		shortDesc: "Below half HP: +2 Attack, -1 Defense and -1 Sp. Def, once per battle.",
		onUpdate(pokemon) {
			if (pokemon.hp * 2 <= pokemon.maxhp && !pokemon.m.sourPeelUsed) {
				pokemon.m.sourPeelUsed = true;
				this.boost({ atk: 2, def: -1, spd: -1 }, pokemon, pokemon,
					this.dex.abilities.get('sourpeel'));
			}
		},
		flags: {},
		rating: 3,
		num: 1149,
	},
	sparklesparkleblingbling: {
		name: "Sparkle Sparkle Bling Bling",
		shortDesc: "Draws in every foe attack, unless it chose a status move this turn.",
		onFoeRedirectTargetPriority: 1,
		onFoeRedirectTarget(target, source, source2, move) {
			const holder = this.effectState.target as Pokemon;
			if (!holder.isActive || !this.validTarget(holder, source, move.target)) return;
			const action = this.queue.willMove(holder);
			const chosen = action && this.dex.moves.get(
				(action as any).move?.id || (action as any).moveid);
			if (chosen?.category === 'Status') return;
			return holder;
		},
		flags: {},
		rating: 3.5,
		num: 1150,
	},
	spatialcatalyst: {
		name: "Spatial Catalyst",
		shortDesc: "With a field up: 30% more damage and immunity to the field's type.",
		onModifyDamage(damage, source) {
			if (fieldIsActive(this)) return this.chainModify(1.3);
		},
		onTryHit(target, source, move) {
			const type = terrainType(this);
			if (target !== source && type && move.type === type) {
				this.add('-immune', target, '[from] ability: Spatial Catalyst');
				return null;
			}
		},
		flags: { breakable: 1 },
		rating: 4,
		num: 1151,
	},
	spincounter: {
		name: "Spin Counter",
		shortDesc: "Contact moves used against it deal 25% of the damage back to the attacker.",
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact'] && source.hp) {
				this.damage(Math.max(1, Math.floor(damage / 4)), source, target,
					this.dex.abilities.get('spincounter'));
			}
		},
		flags: {},
		rating: 3,
		num: 1152,
	},
	spinterbark: {
		name: "Spinter Bark",
		shortDesc: "Sets Stealth Rock on the foe's side when hit by a physical move.",
		onDamagingHit(damage, target, source, move) {
			if (move.category !== 'Physical') return;
			for (const side of target.side.foeSidesWithConditions()) {
				side.addSideCondition('stealthrock', target);
			}
		},
		flags: {},
		rating: 3.5,
		num: 1153,
	},
	staticflutter: {
		name: "Static Flutter",
		shortDesc: "Its Electric and Bug moves have a 30% chance to paralyse.",
		onModifyMove(move) {
			if (move.category === 'Status' || !['Electric', 'Bug'].includes(move.type)) return;
			move.secondaries = move.secondaries || [];
			move.secondaries.push({ chance: 30, status: 'par' });
		},
		flags: {},
		rating: 3,
		num: 1154,
	},
	stonecrust: {
		name: "Stonecrust",
		shortDesc: "Super effective moves deal neutral damage to this Pokemon.",
		onSourceModifyDamage(damage, source, target, move) {
			const typeMod = target.getMoveHitData(move).typeMod;
			if (typeMod > 0) return this.chainModify(1 / 2 ** typeMod);
		},
		flags: { breakable: 1 },
		rating: 4,
		num: 1155,
	},
	sugarpile: {
		name: "Sugar Pile",
		shortDesc: "Mega: contact moves used against or by this Pokemon lose their secondaries.",
		onAnyModifyMove(move) {
			if (move.flags['contact']) {
				delete move.secondaries;
				delete move.self;
			}
		},
		flags: {},
		rating: 3.5,
		num: 1156,
	},
	sugarrush: {
		name: "Sugar Rush",
		shortDesc: "Raises Speed by 2 when it consumes a food item.",
		onEatItem(item, pokemon) {
			this.boost({ spe: 2 }, pokemon, pokemon, this.dex.abilities.get('sugarrush'));
		},
		flags: {},
		rating: 3,
		num: 1157,
	},
	supersonicring: {
		name: "Supersonic Ring",
		shortDesc: "Mega: all of this Pokemon's attacks hit both opposing Pokemon.",
		onModifyMove(move) {
			if (move.category !== 'Status' && move.target === 'normal') {
				move.target = 'allAdjacentFoes';
			}
		},
		flags: {},
		rating: 4,
		num: 1158,
	},
	surgeprotection: {
		name: "Surge Protection",
		shortDesc: "Can be paralysed, but paralysis has no effect on it.",
		onModifySpe(spe, pokemon) {
			if (pokemon.status === 'par') return this.chainModify(4);
		},
		onBeforeMove() {},
		onUpdate(pokemon) {
			if (pokemon.status === 'par') pokemon.statusState.fakemonImmune = true;
		},
		onBeforeMovePriority: 10,
		flags: {},
		rating: 3,
		num: 1159,
	},
	survivalist: {
		name: "Survivalist",
		shortDesc: "Boosts its two highest stats by 1 whenever it loses its held item.",
		onAfterUseItem(item, pokemon) {
			this.effectState.boostOnItemLoss?.call?.(null);
			survivalistBoost(this, pokemon);
		},
		onTakeItem(item, pokemon) {
			survivalistBoost(this, pokemon);
		},
		flags: {},
		rating: 3,
		num: 1160,
	},
	sylvanveil: {
		name: "Sylvan Veil",
		shortDesc: "Takes 20% less damage while weather other than sandstorm is active.",
		onSourceModifyDamage() {
			const weather = this.field.effectiveWeather();
			if (weather && weather !== 'sandstorm') return this.chainModify(0.8);
		},
		flags: { breakable: 1 },
		rating: 3,
		num: 1161,
	},
	symphonicshield: {
		name: "Symphonic Shield",
		shortDesc: "This Pokemon and its ally take half damage from multi-hit moves.",
		onAnyModifyDamage(damage, source, target, move) {
			const holder = this.effectState.target as Pokemon;
			if (!target.isAlly(holder)) return;
			if (move.multihit) return this.chainModify(0.5);
		},
		flags: { breakable: 1 },
		rating: 2.5,
		num: 1162,
	},
	tacticallead: {
		name: "Tactical Lead",
		shortDesc: "On switch-in, boosts the attacking stat the foe is weaker against.",
		onStart(pokemon) {
			const foe = pokemon.foes()[0];
			if (!foe) return;
			const stat = foe.getStat('def', false, true) <= foe.getStat('spd', false, true) ?
				'atk' : 'spa';
			this.boost({ [stat]: 1 }, pokemon, pokemon, this.dex.abilities.get('tacticallead'));
		},
		flags: {},
		rating: 3.5,
		num: 1163,
	},
	telecineticcap: {
		name: "Telecinetic Cap",
		shortDesc: "Ground immunity; its STAB moves hit airborne targets super effectively.",
		onImmunity(type) {
			if (type === 'Ground') return false;
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Ground') {
				this.add('-immune', target, '[from] ability: Telecinetic Cap');
				return null;
			}
		},
		onEffectiveness(typeMod, target, type, move) {
			const source = this.effectState.target as Pokemon;
			if (!target || !source?.hasType(move.type)) return;
			if (target.hasType('Flying') || !target.isGrounded()) {
				if (type === target.types[0]) return 1;
			}
		},
		flags: { breakable: 1 },
		rating: 4,
		num: 1164,
	},
	thermalfurnace: {
		name: "Thermal Furnace",
		shortDesc: "Halves Fire damage and Stealth Rock damage, raising Sp. Atk by 1 instead.",
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Fire') return this.chainModify(0.5);
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Fire') this.boost({ spa: 1 }, target, target);
		},
		onDamage(damage, target, source, effect) {
			if (effect?.id !== 'stealthrock') return;
			this.boost({ spa: 1 }, target, target);
			target.side.removeSideCondition('stealthrock');
			this.add('-sideend', target.side, 'Stealth Rock', '[from] ability: Thermal Furnace');
			return Math.floor(damage / 2);
		},
		flags: { breakable: 1 },
		rating: 3.5,
		num: 1165,
	},
	thermallift: {
		name: "Thermal Lift",
		shortDesc: "Ground immunity; in sun, grounded attackers deal 2/3 damage to it.",
		onImmunity(type) {
			if (type === 'Ground') return false;
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Ground') {
				this.add('-immune', target, '[from] ability: Thermal Lift');
				return null;
			}
		},
		onSourceModifyDamage(damage, source, target) {
			if (!['sunnyday', 'desolateland'].includes(this.field.effectiveWeather())) return;
			if (source.isGrounded()) return this.chainModify([2731, 4096]);
		},
		flags: { breakable: 1 },
		rating: 3.5,
		num: 1166,
	},
	thundertail: {
		name: "Thundertail",
		shortDesc: "Raises Sp. Atk by 1 after using an Electric-type move.",
		onAfterMove(pokemon, target, move) {
			if (move.type === 'Electric') this.boost({ spa: 1 }, pokemon, pokemon);
		},
		flags: {},
		rating: 3,
		num: 1167,
	},
	timberfall: {
		name: "Timber Fall",
		shortDesc: "Weight-based moves get -1 priority, break through Protect and deal 20% more.",
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.basePowerCallback) return priority - 1;
		},
		onModifyMove(move) {
			if (move.basePowerCallback) move.breaksProtect = true;
		},
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.basePowerCallback) return this.chainModify(1.2);
		},
		flags: {},
		rating: 3,
		num: 1168,
	},
	toxicclarity: {
		name: "Toxic Clarity",
		shortDesc: "Allies poisoned by this Pokemon are healed by the poison instead.",
		onAnySetStatus(status, target, source) {
			const holder = this.effectState.target as Pokemon;
			if (source !== holder || !target.isAlly(holder)) return;
			if (status.id === 'psn' || status.id === 'tox') target.m.toxicClarity = true;
		},
		onAnyDamage(damage, target, source, effect) {
			if (!target.m.toxicClarity) return;
			if (effect?.id === 'psn' || effect?.id === 'tox') {
				this.heal(damage, target);
				return false;
			}
		},
		flags: {},
		rating: 2.5,
		num: 1169,
	},
	toxicenvy: {
		name: "Toxic Envy",
		shortDesc: "When a foe heals itself, this Pokemon heals the same amount.",
		onAnyTryHeal(damage, target, source) {
			const holder = this.effectState.target as Pokemon;
			if (!holder.hp || target.isAlly(holder) || damage <= 0) return;
			this.heal(damage, holder, holder, this.dex.abilities.get('toxicenvy'));
		},
		flags: {},
		rating: 2.5,
		num: 1170,
	},
	toxicmetamorphosis: {
		name: "Toxic Metamorphosis",
		shortDesc: "Badly poisons every other Pokemon on the field after it scores a KO.",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect?.effectType !== 'Move') return;
			for (const pokemon of this.getAllActive()) {
				if (pokemon === source || !pokemon.hp) continue;
				pokemon.trySetStatus('tox', source, this.dex.abilities.get('toxicmetamorphosis'));
			}
		},
		flags: {},
		rating: 4,
		num: 1171,
	},
	toxicpalette: {
		name: "Toxic Palette",
		shortDesc: "Its Normal moves lose their secondaries and gain a 30% chance to poison.",
		onModifyMove(move) {
			if (move.type !== 'Normal' || move.category === 'Status') return;
			move.secondaries = [{ chance: 30, status: 'psn' }];
		},
		flags: {},
		rating: 3,
		num: 1172,
	},
	tragicmist: {
		name: "Tragic Mist",
		shortDesc: "On entry, halves every positive stat change gained on the field for 5 turns.",
		onStart(pokemon) {
			this.field.addPseudoWeather('tragicmist', pokemon);
		},
		condition: {
			duration: 5,
			onFieldStart() {
				this.add('-fieldstart', 'ability: Tragic Mist');
			},
			onAnyTryBoost(boost) {
				let i: BoostID;
				for (i in boost) {
					if (boost[i]! > 0) boost[i] = Math.floor(boost[i]! / 2) as any;
				}
			},
			onFieldResidualOrder: 27,
			onFieldEnd() {
				this.add('-fieldend', 'ability: Tragic Mist');
			},
		},
		flags: {},
		rating: 3.5,
		num: 1173,
	},
	trunklauncher: {
		name: "Trunk Launcher",
		shortDesc: "The first bullet move used after switching in deals double damage.",
		onStart(pokemon) {
			pokemon.m.trunkReady = true;
		},
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['bullet'] && attacker.m.trunkReady) {
				attacker.m.trunkReady = false;
				return this.chainModify(2);
			}
		},
		flags: {},
		rating: 3,
		num: 1174,
	},
	vanishstrike: {
		name: "Vanish Strike",
		shortDesc: "Mega: moves of 60 BP or less gain +1 priority and ignore Protect.",
		onModifyPriority(priority, pokemon, target, move) {
			if (move && move.category !== 'Status' && move.basePower && move.basePower <= 60) {
				return priority + 1;
			}
		},
		onModifyMove(move) {
			if (move.basePower && move.basePower <= 60) move.breaksProtect = true;
		},
		flags: {},
		rating: 4,
		num: 1175,
	},
	venomousspike: {
		name: "Venomous Spike",
		shortDesc: "Badly poisons any Pokemon that damages it.",
		onDamagingHit(damage, target, source) {
			if (source.hp) source.trySetStatus('tox', target, this.dex.abilities.get('venomousspike'));
		},
		flags: {},
		rating: 3.5,
		num: 1176,
	},
	vexedawakaning: {
		name: "Vexed Awakaning",
		shortDesc: "Below half HP: +1 Atk/Sp. Atk/Speed and -1 Def/Sp. Def, once per battle.",
		onUpdate(pokemon) {
			if (pokemon.hp * 2 <= pokemon.maxhp && !pokemon.m.vexedUsed) {
				pokemon.m.vexedUsed = true;
				this.boost({ atk: 1, spa: 1, spe: 1, def: -1, spd: -1 }, pokemon, pokemon,
					this.dex.abilities.get('vexedawakaning'));
			}
		},
		flags: {},
		rating: 3,
		num: 1177,
	},
	violent: {
		name: "Violent",
		shortDesc: "Deals 0.7% more damage for every 1% of max HP it has lost.",
		onModifyDamage(damage, source) {
			const lost = 1 - source.hp / source.maxhp;
			return this.chainModify(1 + 0.7 * lost);
		},
		flags: {},
		rating: 3.5,
		num: 1178,
	},
	voodoodoodoo: {
		name: "Voodoo Doodoo",
		shortDesc: "Copies every stat boost an opposing Pokemon gains.",
		onAnyAfterBoost(boost, target, source, effect) {
			const holder = this.effectState.target as Pokemon;
			if (!holder.hp || target.isAlly(holder) || effect?.id === 'voodoodoodoo') return;
			const copy: SparseBoostsTable = {};
			let i: BoostID;
			let any = false;
			for (i in boost) {
				if (boost[i]! > 0) {
					copy[i] = boost[i];
					any = true;
				}
			}
			if (any) this.boost(copy, holder, holder, this.dex.abilities.get('voodoodoodoo'));
		},
		flags: {},
		rating: 3.5,
		num: 1179,
	},
	warmbody: {
		name: "Warm Body",
		shortDesc: "Cannot be frozen and is immune to hail damage.",
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'frz') return;
			if ((effect as Move)?.status) this.add('-immune', target, '[from] ability: Warm Body');
			return false;
		},
		onImmunity(type) {
			if (type === 'hail') return false;
		},
		flags: { breakable: 1 },
		rating: 2,
		num: 1180,
	},
	waterstarter: {
		name: "Water Starter",
		shortDesc: "This Pokemon's Water-type moves deal 30% more damage.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Water') return this.chainModify(1.3);
		},
		flags: {},
		rating: 3.5,
		num: 1181,
	},
	weepingberry: {
		name: "Weeping Berry",
		shortDesc: "Lowers the accuracy of any Pokemon that hits it by 1.",
		onDamagingHit(damage, target, source) {
			if (source.hp) this.boost({ accuracy: -1 }, source, target);
		},
		flags: {},
		rating: 3,
		num: 1182,
	},
	wetcement: {
		name: "Wet Cement",
		shortDesc: "Foes that hit it with a contact move cannot switch out for 3 turns.",
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact'] && source.hp) {
				source.addVolatile('trapped', target, move, 'trapper');
			}
		},
		flags: {},
		rating: 3,
		num: 1183,
	},
	whacamole: {
		name: "Whac-A-Mole",
		shortDesc: "+1 Attack and Accuracy when hit by a physical move; its moves are 30% less accurate.",
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical') {
				this.boost({ atk: 1, accuracy: 1 }, target, target,
					this.dex.abilities.get('whacamole'));
			}
		},
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			return this.chainModify(0.7);
		},
		flags: {},
		rating: 2.5,
		num: 1184,
	},
	wired: {
		name: "Wired",
		shortDesc: "Immune to Electric moves; heals 25% of its max HP when hit by one instead.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Wired');
				}
				return null;
			}
		},
		flags: { breakable: 1 },
		rating: 4,
		num: 1185,
	},
	wreckingball: {
		name: "Wrecking Ball",
		shortDesc: "Screens make this Pokemon's attacks stronger instead of weaker.",
		onModifyMove(move) {
			move.infiltrates = true;
		},
		onModifyDamage(damage, source, target, move) {
			const side = target.side;
			if (side.getSideCondition('reflect') || side.getSideCondition('lightscreen') ||
				side.getSideCondition('auroraveil')) {
				return this.chainModify(1.5);
			}
		},
		flags: {},
		rating: 3,
		num: 1186,
	},
};

/** Shared by Survivalist: boost the holder's two highest stats by one stage. */
function survivalistBoost(battle: Battle, pokemon: Pokemon) {
	const stats = (['atk', 'def', 'spa', 'spd', 'spe'] as StatIDExceptHP[])
		.sort((a, b) => pokemon.storedStats[b] - pokemon.storedStats[a]);
	battle.boost({ [stats[0]]: 1, [stats[1]]: 1 }, pokemon, pokemon,
		battle.dex.abilities.get('survivalist'));
}
