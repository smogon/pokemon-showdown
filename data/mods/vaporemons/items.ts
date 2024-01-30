export const Items: {[itemid: string]: ModdedItemData} = {
	bigroot: {
		name: "Big Root",
		spritenum: 29,
		fling: {
			basePower: 10,
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['heal'] || move.id === 'bitterblade') {
				this.debug('Big Root boost');
				return this.chainModify([5324, 4096]);
			}
		},
		onTryHealPriority: 1,
		onTryHeal(damage, target, source, effect) {
			const heals = ['leechseed', 'ingrain', 'aquaring', 'strengthsap', 'healingstones', 'rekindleheal'];
			if (heals.includes(effect.id)) {
				return this.chainModify([5324, 4096]);
			}
		},
		num: 296,
		desc: "Damaging draining moves deal 30% more damage, status draining moves heal 30% more.",
		gen: 4,
	},
	terashard: {
		name: "Tera Shard",
		spritenum: 658,
		onTakeItem: false,
		onStart(pokemon) {
			const type = pokemon.teraType;
			this.add('-item', pokemon, 'Tera Shard');
			this.add('-anim', pokemon, "Cosmic Power", pokemon);
			if (type && type !== '???') {
				if (!pokemon.setType(type)) return;
				this.add('-start', pokemon, 'typechange', type, '[from] item: Tera Shard');
			}
			this.add('-message', `${pokemon.name}'s Tera Shard changed its type!`);
		},
		onBasePowerPriority: 30,
		onBasePower(basePower, attacker, defender, move) {
			if (move.id === 'terablast') {
				return this.chainModify(1.25);
			}
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'soak' || move.id === 'magicpowder') {
				this.add('-immune', pokemon, '[from] item: Tera Shard');
				return null;
			}
		},
		num: -1000,
		gen: 9,
		desc: "Holder becomes its Tera Type on switch-in.",
	},
	seginstarshard: {
		name: "Segin Star Shard",
		spritenum: 646,
		fling: {
			basePower: 20,
			status: 'slp',
		},
		onTakeItem(item, pokemon, source) {
			if (source?.baseSpecies.num === 966 || pokemon.baseSpecies.num === 966) {
				return false;
			}
			return true;
		},
		onSwitchIn(pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Revavroom') {
				this.add('-item', pokemon, 'Segin Star Shard');
				this.add('-anim', pokemon, "Cosmic Power", pokemon);
				this.add('-message', `${pokemon.name}'s Segin Star Shard changed its type!`);
			}
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.num === 966 && ['Dark', 'Steel', 'Poison'].includes(move.type)) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'soak' || move.id === 'magicpowder') {
				this.add('-immune', pokemon, '[from] item: Segin Star Shard');
				return null;
			}
		},
		forcedForme: "Revavroom-Segin",
		itemUser: ["Revavroom"],
		num: -1001,
		gen: 9,
		desc: "Revavroom: Becomes Dark-type, Ability: Intimidate, 1.2x Dark/Poison/Steel power.",
	},
	schedarstarshard: {
		name: "Schedar Star Shard",
		spritenum: 632,
		fling: {
			basePower: 20,
			status: 'brn',
		},
		onTakeItem(item, pokemon, source) {
			if (source?.baseSpecies.num === 966 || pokemon.baseSpecies.num === 966) {
				return false;
			}
			return true;
		},
		onSwitchIn(pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Revavroom') {
				this.add('-item', pokemon, 'Schedar Star Shard');
				this.add('-anim', pokemon, "Cosmic Power", pokemon);
				this.add('-message', `${pokemon.name}'s Schedar Star Shard changed its type!`);
			}
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.num === 966 && ['Fire', 'Steel', 'Poison'].includes(move.type)) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'soak' || move.id === 'magicpowder') {
				this.add('-immune', pokemon, '[from] item: Schedar Star Shard');
				return null;
			}
		},
		forcedForme: "Revavroom-Schedar",
		itemUser: ["Revavroom"],
		num: -1002,
		gen: 9,
		desc: "Revavroom: Becomes Fire-type, Ability: Speed Boost, 1.2x Fire/Poison/Steel power.",
	},
	navistarshard: {
		name: "Navi Star Shard",
		spritenum: 638,
		fling: {
			basePower: 20,
			status: 'psn',
		},
		onTakeItem(item, pokemon, source) {
			if (source?.baseSpecies.num === 966 || pokemon.baseSpecies.num === 966) {
				return false;
			}
			return true;
		},
		onSwitchIn(pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Revavroom') {
				this.add('-item', pokemon, 'Navi Star Shard');
				this.add('-anim', pokemon, "Cosmic Power", pokemon);
				this.add('-message', `${pokemon.name}'s Navi Star Shard changed its type!`);
			}
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.num === 966 && ['Steel', 'Poison'].includes(move.type)) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'soak' || move.id === 'magicpowder') {
				this.add('-immune', pokemon, '[from] item: Navi Star Shard');
				return null;
			}
		},
		forcedForme: "Revavroom-Navi",
		itemUser: ["Revavroom"],
		num: -1003,
		gen: 9,
		desc: "Revavroom: Becomes Poison-type, Ability: Toxic Debris, 1.2x Poison/Steel power.",
	},
	ruchbahstarshard: {
		name: "Ruchbah Star Shard",
		spritenum: 648,
		fling: {
			basePower: 20,
			volatileStatus: 'confusion',
		},
		onTakeItem(item, pokemon, source) {
			if (source?.baseSpecies.num === 966 || pokemon.baseSpecies.num === 966) {
				return false;
			}
			return true;
		},
		onSwitchIn(pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Revavroom') {
				this.add('-item', pokemon, 'Ruchbah Star Shard');
				this.add('-anim', pokemon, "Cosmic Power", pokemon);
				this.add('-message', `${pokemon.name}'s Ruchbah Star Shard changed its type!`);
			}
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.num === 966 && ['Fairy', 'Steel', 'Poison'].includes(move.type)) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'soak' || move.id === 'magicpowder') {
				this.add('-immune', pokemon, '[from] item: Ruchbah Star Shard');
				return null;
			}
		},
		forcedForme: "Revavroom-Ruchbah",
		itemUser: ["Revavroom"],
		num: -1004,
		gen: 9,
		desc: "Revavroom: Becomes Fairy-type, Ability: Misty Surge, 1.2x Fairy/Poison/Steel power.",
	},
	caphstarshard: {
		name: "Caph Star Shard",
		spritenum: 637,
		fling: {
			basePower: 20,
			status: 'par',
		},
		onTakeItem(item, pokemon, source) {
			if (source?.baseSpecies.num === 966 || pokemon.baseSpecies.num === 966) {
				return false;
			}
			return true;
		},
		onSwitchIn(pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Revavroom') {
				this.add('-item', pokemon, 'Caph Star Shard');
				this.add('-anim', pokemon, "Cosmic Power", pokemon);
				this.add('-message', `${pokemon.name}'s Caph Star Shard changed its type!`);
			}
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.num === 966 && ['Fighting', 'Steel', 'Poison'].includes(move.type)) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'soak' || move.id === 'magicpowder') {
				this.add('-immune', pokemon, '[from] item: Caph Star Shard');
				return null;
			}
		},
		forcedForme: "Revavroom-Caph",
		itemUser: ["Revavroom"],
		num: -1005,
		gen: 9,
		desc: "Revavroom: Becomes Fighting-type, Ability: Stamina, 1.2x Fighting/Poison/Steel power.",
	},
	tuffytuff: {
		name: "Tuffy-Tuff",
		spritenum: 692,
		fling: {
			basePower: 10,
		},
		onTakeItem(item, source) {
			if (['Igglybuff', 'Jigglypuff', 'Wigglytuff'].includes((source.baseSpecies.baseSpecies))) return false;
			return true;
		},
		onModifyDefPriority: 1,
		onModifyDef(def, pokemon) {
			if (['Igglybuff', 'Jigglypuff', 'Wigglytuff'].includes((pokemon.baseSpecies.baseSpecies))) {
				return this.chainModify(2);
			}
		},
		onModifySpDPriority: 1,
		onModifySpD(spd, pokemon) {
			if (['Igglybuff', 'Jigglypuff', 'Wigglytuff'].includes((pokemon.baseSpecies.baseSpecies))) {
				return this.chainModify(2);
			}
		},
		desc: "Igglybuff line: 2x Defense & Special Defense.",
		itemUser: ["Igglybuff", "Jigglypuff", "Wigglytuff"],
		num: -1006,
		gen: 9,
	},
	blunderpolicy: {
		name: "Blunder Policy",
		spritenum: 716,
		fling: {
			basePower: 80,
		},
		onUpdate(pokemon) {
			if (pokemon.moveThisTurnResult === false) {
				this.boost({spe: 2, accuracy: 2});
				pokemon.useItem();
			}
		},
		// Item activation located in scripts.js
		num: 1121,
		gen: 8,
		desc: "+2 Speed & Accuracy if the holder's move fails. Single use.",
	},
	punchingglove: {
		name: "Punching Glove",
		spritenum: 0, // TODO
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Punching Glove boost');
				return this.chainModify([5324, 4096]);
			}
		},
		onModifyMovePriority: 1,
		onModifyMove(move) {
			if (move.flags['punch']) delete move.flags['contact'];
		},
		desc: "Holder's punch-based attacks have 1.3x power and do not make contact.",
		num: 1884,
		gen: 9,
	},
	razorclaw: {
		name: "Razor Claw",
		spritenum: 382,
		fling: {
			basePower: 80,
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['slicing']) {
				this.debug('Razor Claw boost');
				return this.chainModify([5324, 4096]);
			}
		},
		onModifyMovePriority: 1,
		onModifyMove(move) {
			if (move.flags['slicing']) delete move.flags['contact'];
		},
		desc: "Holder's slicing-based attacks have 1.3x power and do not make contact.",
		num: 326,
		gen: 4,
	},
	razorfang: {
		name: "Razor Fang",
		spritenum: 383,
		fling: {
			basePower: 30,
			volatileStatus: 'flinch',
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['bite']) {
				this.debug('Razor Fang boost');
				return this.chainModify([5324, 4096]);
			}
		},
		onModifyMovePriority: 1,
		onModifyMove(move) {
			if (move.flags['bite']) delete move.flags['contact'];
		},
		desc: "Holder's biting-based attacks have 1.3x power and do not make contact.",
		num: 327,
		gen: 4,
		isNonstandard: null,
	},
	baseballbat: {
		name: "Baseball Bat",
		spritenum: 465,
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['contact']) {
				this.debug('Baseball Bat boost');
				return this.chainModify([5120, 4096]);
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.flags['bullet']) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.useItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		desc: "Holder's contact moves have 1.25x power. If hit by bullet/bomb move, it deals 50% damage and the item breaks.",
		num: -1007,
		gen: 9,
	},
	walkietalkie: {
		name: "Walkie-Talkie",
		spritenum: 713,
		fling: {
			basePower: 20,
		},
		onBeforeMovePriority: 0.5,
		onBeforeMove(attacker, defender, move) {
			if (!this.canSwitch(attacker.side) || attacker.forceSwitchFlag || attacker.switchFlag || !move.flags['sound']) return;
			this.effectState.move = this.dex.moves.get(move.id);
			attacker.deductPP(move.id, 1);
			this.add('-activate', attacker, 'item: Walkie-Talkie');
			this.add('-message', `${attacker.name} is calling in one of its allies!`);
			attacker.switchFlag = true;
			return null;
		},
		desc: "(Mostly non-functional placeholder) Before using a sound move, holder switches. Switch-in uses move if it's holding a Walkei-Talkie.",
		num: -1008,
		gen: 8,
	},
	airfreshener: {
		name: "Air Freshener",
		spritenum: 713,
		fling: {
			basePower: 30,
		},
		onSwitchOut(pokemon) {
			pokemon.cureStatus();
		},
		// other effect coded into the moves themselves
		desc: "Holder's wind-based attacks heal the party's status. Holder has its status condition cured when it switches out.",
		num: -1009,
		gen: 9,
	},
	dancingshoes: {
		name: "Dancing Shoes",
		spritenum: 715,
		onSwitchIn(pokemon) {
			if (pokemon.isActive && pokemon.baseSpecies.name === 'Meloetta') {
				pokemon.formeChange('Meloetta-Pirouette');
				if (pokemon.hasAbility('trace')) {
					pokemon.setAbility('noguard', pokemon, true);
					this.add('-activate', pokemon, 'ability: No Guard');
				}
			}
		},
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.flags['sound']) {
				if (!this.boost({atk: 1})) {
					this.add('-immune', target, '[from] item: Dancing Shoes');
				}
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (target === this.effectState.target || target.side !== source.side) return;
			if (move.flags['sound']) {
				this.boost({atk: 1}, this.effectState.target);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Meloetta') return false;
			return true;
		},
		itemUser: ["Meloetta"],
		num: -1010,
		gen: 9,
		desc: "If held by Meloetta: Pirouette Forme on entry, hazard immunity, Sound immunity, +1 Attack when hit by Sound.",
	},
	charizarditeshardx: {
		name: "Charizardite Shard X",
		spritenum: 585,
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Charizard') return false;
			return true;
		},
		onSwitchIn(pokemon) {
			const targetType = pokemon.getTypes(true, true)[1];
			if (pokemon.baseSpecies.baseSpecies === 'Charizard') {
				this.add('-item', pokemon, 'Charizardite Shard X');
				this.add('-anim', pokemon, "Cosmic Power", pokemon);
				pokemon.setType(pokemon.getTypes(true).map(type => type === targetType ? "Dragon" : type));
				this.add('-message', `${pokemon.name}'s Charizardite Shard X changed its type!`);
				pokemon.setAbility('toughclaws', pokemon, true);
				this.add('-activate', pokemon, 'ability: Tough Claws');
				this.boost({atk: 1});
			}
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && user.baseSpecies.num === 6 && ['Dragon', 'Fire'].includes(move.type)) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'soak' || move.id === 'magicpowder') {
				this.add('-immune', pokemon, '[from] item: Charizardite Shard X');
				return null;
			}
		},
		itemUser: ["Charizard"],
		num: -1011,
		gen: 9,
		desc: "Charizard: Becomes Fire/Dragon-type, Ability: Tough Claws, +1 Atk, 1.2x Dragon/Fire power.",
	},
	charizarditeshardy: {
		name: "Charizardite Shard Y",
		spritenum: 586,
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Charizard') return false;
			return true;
		},
		onSwitchIn(pokemon) {
			const type = pokemon.hpType;
			if (pokemon.baseSpecies.baseSpecies === 'Charizard') {
				this.add('-item', pokemon, 'Charizardite Shard Y');
				this.add('-anim', pokemon, "Cosmic Power", pokemon);
				if (type && type !== '???') {
					if (!pokemon.setType('Fire')) return;
					this.add('-start', pokemon, 'typechange', 'Fire', '[from] item: Charizardite Shard Y');
				}
				this.add('-message', `${pokemon.name}'s Charizardite Shard Y changed its type!`);
				pokemon.setAbility('drought', pokemon, true);
				this.boost({spa: 1});
			}
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && user.baseSpecies.num === 6 && ['Flying', 'Fire'].includes(move.type)) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'soak' || move.id === 'magicpowder') {
				this.add('-immune', pokemon, '[from] item: Charizardite Shard Y');
				return null;
			}
		},
		itemUser: ["Charizard"],
		num: -1012,
		gen: 9,
		desc: "Charizard: Becomes pure Fire-type, Ability: Drought, +1 SpA, 1.2x Fire/Flying power.",
	},
	oddkeystone: {
		name: "Odd Keystone",
		spritenum: 390,
		onResidualOrder: 5,
		onResidualSubOrder: 5,
		onResidual(pokemon) {
			if (pokemon.baseSpecies.name === 'Spiritomb') {
				this.heal(pokemon.baseMaxhp / 8);
			}
		},
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fairy' && defender.baseSpecies.baseSpecies === 'Spiritomb') {
				this.debug('Odd Keystone weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fairy' && defender.baseSpecies.baseSpecies === 'Spiritomb') {
				this.debug('Odd Keystone weaken');
				return this.chainModify(0.5);
			}
		},
		onUpdate(pokemon) {
			if (pokemon.volatiles['healblock'] && pokemon.baseSpecies.baseSpecies === 'Spiritomb') {
				this.add('-activate', pokemon, 'item: Odd Keystone');
				pokemon.removeVolatile('healblock');
				this.add('-end', pokemon, 'move: Heal Block', '[from] item: Odd Keystone');
			}
		},
		onHit(target, source, move) {
			if (move?.volatileStatus === 'healblock' && target.baseSpecies.baseSpecies === 'Spiritomb') {
				this.add('-immune', target, 'healblock', '[from] item: Odd Keystone');
			}
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'healblock' && pokemon.baseSpecies.baseSpecies === 'Spiritomb') {
				this.add('-immune', pokemon, '[from] item: Odd Keystone');
				return null;
			}
		},
		onAllyTryAddVolatile(status, target, source, effect) {
			if (['healblock'].includes(status.id)) {
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'item: Odd Keystone', '[of] ' + effectHolder);
				return null;
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Spiritomb') return false;
			return true;
		},
		itemUser: ["Spiritomb"],
		num: -1029,
		gen: 8,
		desc: "If held by Spiritomb: Heal 12.5% per turn, 50% damage from Fairy attacks, immune to Heal Block.",
	},
	mithrilarmor: {
		name: "Mithril Armor",
		spritenum: 744,
		fling: {
			basePower: 80,
		},
		onModifyDefPriority: 2,
		onModifyDef(def, pokemon) {
			return this.chainModify(1.2);
		},
		onCriticalHit: false,
		num: -1030,
		gen: 8,
		desc: "Holder is immune to critical hits and has 1.2x Defense.",
	},
	tiedyeband: {
		name: "Tie-Dye Band",
		spritenum: 297,
		fling: {
			basePower: 30,
		},
		onBasePower(basePower, pokemon, target, move) {
			if (!pokemon.hasType(move.type)) {
				return this.chainModify(1.3);
			} else if (pokemon.hasType(move.type)) {
				return this.chainModify(0.67);
			}
		},
		num: -1031,
		gen: 8,
		desc: "Holder's non-STAB moves deal 30% more damage, but its STAB moves deal 0.67x damage.",
	},
	herosbubble: {
		name: "Hero's Bubble",
		spritenum: 390,
		fling: {
			basePower: 30,
		},
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water' &&
				attacker.baseSpecies.baseSpecies === 'Palafin' &&
				attacker.species.forme !== 'Hero') {
				return this.chainModify(2);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water' &&
				attacker.baseSpecies.baseSpecies === 'Palafin' &&
				attacker.species.forme !== 'Hero') {
				return this.chainModify(2);
			}
		},
		onSourceModifyAtkPriority: 5,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if ((move.type === 'Dark' || move.type === 'Fighting') &&
				defender.baseSpecies.baseSpecies === 'Palafin' &&
				defender.species.forme === 'Hero') {
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if ((move.type === 'Dark' || move.type === 'Fighting') &&
				defender.baseSpecies.baseSpecies === 'Palafin' &&
				defender.species.forme === 'Hero') {
				return this.chainModify(0.5);
			}
		},
		itemUser: ["Palafin"],
		num: -1032,
		gen: 8,
		desc: "If Palafin-Zero: 2x Water power. If Palafin-Hero: takes 50% damage from Dark and Fighting.",
	},
	sandclock: {
		name: "Sand Clock",
		spritenum: 453,
		fling: {
			basePower: 30,
		},
		onModifySpDPriority: 1,
		onModifySpD(spd, pokemon) {
			if (pokemon.hasType('Rock')) {
				return this.chainModify(1.5);
			}
		},
		num: -1033,
		gen: 8,
		desc: "If the holder is a Rock-type, its SpD is boosted 1.5x.",
	},
	snowglobe: {
		name: "Snow Globe",
		spritenum: 221,
		fling: {
			basePower: 30,
		},
		onModifyDefPriority: 1,
		onModifyDef(def, pokemon) {
			if (pokemon.hasType('Ice')) {
				return this.chainModify(1.5);
			}
		},
		num: -1034,
		gen: 8,
		desc: "If the holder is an Ice-type, its Def is boosted 1.5x.",
	},
	handmirror: {
		name: "Hand Mirror",
		spritenum: 747,
		fling: {
			basePower: 30,
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.hasType(source.getTypes())) {
				return this.chainModify(0.66);
			}
		},
		num: -1035,
		gen: 8,
		desc: "Holder takes 2/3 damage from foes that share a type.",
	},
	powerherb: {
		onChargeMove(pokemon, target, move) {
			if (pokemon.useItem()) {
				this.debug('power herb - remove charge turn for ' + move.id);
				this.attrLastMove('[still]');
				this.addMove('-anim', pokemon, move.name, target);
				return false; // skip charge turn
			}
		},
		onUpdate(pokemon) {
			if (pokemon.volatiles['mustrecharge']) {
				pokemon.removeVolatile('mustrecharge');
				pokemon.useItem();
			}
		},
		name: "Power Herb",
		spritenum: 358,
		fling: {
			basePower: 10,
		},
		num: 271,
		gen: 4,
		desc: "Holder's two-turn moves and recharge complete in one turn (except Sky Drop). Single use.",
	},
	leatherbelt: {
		name: "Leather Belt",
		spritenum: 132,
		fling: {
			basePower: 10,
		},
		onModifyDamage(damage, source, target, move) {
			if (move && target.getMoveHitData(move).typeMod === 0) {
				return this.chainModify([4915, 4096]);
			}
		},
		gen: 8,
		desc: "Holder's neutral damaging moves deal 1.2x damage.",
	},
	keeberry: {
		name: "Kee Berry",
		spritenum: 593,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Fairy",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.category === 'Physical') {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (target.eatItem()) {
					this.debug('kee activation');
					this.add('-enditem', target, this.effect, '[weaken]');
					if (!target.getMoveHitData(move).crit) {
						return this.chainModify(0.67);
					}
				}
			}
		},
		onEat(pokemon) {
			this.boost({def: 1});
		},
		num: 687,
		gen: 6,
		desc: "Raises holder's Defense by 1 stage before it is hit by a physical attack. Single use.",
	},
	marangaberry: {
		name: "Maranga Berry",
		spritenum: 597,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Dark",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.category === 'Special') {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (target.eatItem()) {
					this.debug('maranga activation');
					this.add('-enditem', target, this.effect, '[weaken]');
					if (!target.getMoveHitData(move).crit) {
						return this.chainModify(0.67);
					}
				}
			}
		},
		onEat(pokemon) {
			this.boost({spd: 1});
		},
		num: 688,
		gen: 6,
		desc: "Raises holder's Sp. Defense by 1 stage before it is hit by a special attack. Single use.",
	},
	bindingband: {
		name: "Binding Band",
		spritenum: 31,
		fling: {
			basePower: 60,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (target.volatiles['trapped'] || target.volatiles['partiallytrapped'] || target.volatiles['sandspit']) {
				return this.chainModify(1.5);
			}
		},
		onSourceModifyAccuracyPriority: -2,
		onSourceModifyAccuracy(accuracy, target) {
			if (typeof accuracy === 'number' &&
				(target.volatiles['trapped'] ||
				target.volatiles['partiallytrapped'] ||
				target.volatiles['sandspit'])) {
				this.debug('Binding Band boosting accuracy');
				return this.chainModify(1.5);
			}
		},
		// other effects removed in statuses
		desc: "Against trapped targets: 1.5x move power and accuracy.",
		num: 544,
		gen: 5,
	},
	slingshot: {
		name: "Slingshot",
		spritenum: 387,
		fling: {
			basePower: 60,
		},
		onAfterMoveSecondary(target, source, move) {
			if (source && source !== target && source.hp && target.hp && move &&
				['uturn', 'voltswitch', 'flipturn', 'round', 'rollout', 'partingshot'].includes(move.id)) {
				if (!source.isActive || !this.canSwitch(source.side) || source.forceSwitchFlag || target.forceSwitchFlag) {
					return;
				}
				if (this.runEvent('DragOut', source, target, move)) {
					this.damage(source.baseMaxhp / 8, source, target);
					source.forceSwitchFlag = true;
				}
			}
		},
		desc: "If hit by pivoting move: attacker takes 1/8 of their max HP in damage and is forced out.",
		gen: 9,
		num: -1100,
	},
	mantisclaw: {
		name: "Mantis Claw",
		spritenum: 382,
		fling: {
			basePower: 10,
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Kleavor') {
				return this.chainModify(1.5);
			}
		},
		onModifyDefPriority: 1,
		onModifyDef(def, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Scizor') {
				return this.chainModify(1.3);
			}
		},
		onModifySpDPriority: 1,
		onModifySpD(spd, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Scizor') {
				return this.chainModify(1.3);
			}
		},
		onModifySpePriority: 1,
		onModifySpe(spe, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Scyther') {
				return this.chainModify(1.5);
			}
		},
		desc: "Scyther line: Immune to hazard damage, 1.5x Spe (Scyther), 1.3x Defenses (Scizor), 1.5x Attack (Kleavor).",
		itemUser: ["Scyther", "Scizor", "Kleavor"],
		gen: 9,
	},
	clearamulet: {
		name: "Clear Amulet",
		spritenum: 747,
		fling: {
			basePower: 30,
		},
		onTryBoost(boost, target, source, effect) {
			// Don't bounce self stat changes, or boosts that have already bounced
			if (!source || target === source || !boost || effect.name === 'Mirror Armor' || effect.name === 'Clear Amulet') return;
			let b: BoostID;
			for (b in boost) {
				if (boost[b]! < 0) {
					if (target.boosts[b] === -6) continue;
					const negativeBoost: SparseBoostsTable = {};
					negativeBoost[b] = boost[b];
					delete boost[b];
					if (source.hp) {
						this.add('-item', target, 'Clear Amulet');
						this.boost(negativeBoost, source, target, null, true);
					}
				}
			}
		},
		num: 1882,
		desc: "If this Pokemon's stat stages would be lowered, the attacker's are lowered instead.",
		gen: 9,
	},
	quickclaw: {
		name: "Quick Claw",
		spritenum: 373,
		fling: {
			basePower: 20,
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move?.priority > 0.1) {
				this.debug('Quick Claw boost');
				return this.chainModify([5324, 4096]);
			}
		},
		onModifyMovePriority: 1,
		onModifyMove(move) {
			if (move?.priority > 0.1) delete move.flags['contact'];
		},
		desc: "Holder's priority attacks have 1.3x power and do not make contact.",
		num: 217,
		gen: 2,
	},
	protectivepads: {
		name: "Protective Pads",
		spritenum: 663,
		fling: {
			basePower: 30,
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.recoil || move.hasCrashDamage) {
				this.debug('Protective Pads boost');
				return this.chainModify([5324, 4096]);
			}
		},
		// protective effect handled in Battle#checkMoveMakesContact
		num: 880,
		gen: 7,
		desc: "This Pokemon's recoil moves deal 1.3x damage and all of its moves don't make contact.",
	},
	desertrose: {
		name: "Desert Rose",
		spritenum: 603,
		onTakeItem(item, source) {
			if (source.baseSpecies.num === 671) return false;
			return true;
		},
		onSwitchIn(pokemon) {
			this.add('-message', `${pokemon.name}'s flower blooms in the sandstorm!`);
			pokemon.setAbility('sandveil', pokemon, true);
			this.add('-activate', pokemon, 'ability: Sand Veil');
		},
		onResidualOrder: 5,
		onResidualSubOrder: 5,
		onResidual(pokemon) {
			if (pokemon.baseSpecies.num === 671 && this.field.isWeather('sandstorm')) {
				this.heal(pokemon.baseMaxhp / 8);
			}
		},
		onModifySpDPriority: 1,
		onModifySpD(spd, pokemon) {
			if (pokemon.baseSpecies.num === 671 && this.field.isWeather('sandstorm')) {
				return this.chainModify(1.5);
			}
		},
		onUpdate(pokemon) {
			if (pokemon.volatiles['healblock'] && pokemon.baseSpecies.num === 671) {
				this.add('-activate', pokemon, 'item: Desert Rose');
				pokemon.removeVolatile('healblock');
				this.add('-end', pokemon, 'move: Heal Block', '[from] item: Desert Rose');
			}
		},
		onHit(target, source, move) {
			if (move?.volatileStatus === 'healblock' && target.baseSpecies.num === 671) {
				this.add('-immune', target, 'healblock', '[from] item: Desert Rose');
			}
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'healblock' && target.baseSpecies.num === 671) {
				this.add('-immune', pokemon, '[from] item: Desert Rose');
				return null;
			}
		},
		onAllyTryAddVolatile(status, target, source, effect) {
			if (['healblock'].includes(status.id)) {
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'item: Desert Rose', '[of] ' + effectHolder);
				return null;
			}
		},
		itemUser: ["Florges"],
		gen: 9,
		desc: "Florges: Ability becomes Sand Veil, immune to Heal Block, 12.5% recovery and 1.5x SpD in Sand.",
	},
	diancitestonefragment: {
		name: "Diancite Stone Fragment",
		spritenum: 624,
		onTakeItem: false,
		onSwitchIn(pokemon) {
			if (pokemon.baseSpecies.name === 'Diancie') {
				this.add('-item', pokemon, 'Diancite Stone Fragment');
				pokemon.setAbility('magicbounce', pokemon, true);
				this.add('-activate', pokemon, 'ability: Magic Bounce');
				this.boost({atk: 1, spa: 1, spe: 1});
			}
		},
		itemUser: ["Diancie"],
		gen: 9,
		desc: "Diancie: Ability becomes Magic Bounce, +1 Atk/SpA/Spe.",
	},

	// unchanged items
	boosterenergy: {
		name: "Booster Energy",
		spritenum: 0, // TODO
		onUpdate(pokemon) {
			if (pokemon.transformed) return;
			if (this.queue.peek(true)?.choice === 'runSwitch') return;
			if (pokemon.hasAbility('protosynthesis') && !pokemon.volatiles['protosynthesis'] &&
				 !this.field.isWeather('sunnyday') && pokemon.useItem()) {
				pokemon.addVolatile('protosynthesis');
			}
			if (pokemon.hasAbility('protosmosis') && !pokemon.volatiles['protosmosis'] &&
				 !this.field.isWeather('raindance') && pokemon.useItem()) {
				pokemon.addVolatile('protosmosis');
			}
			if (pokemon.hasAbility('protocrysalis') && !pokemon.volatiles['protocrysalis'] &&
				 !this.field.isWeather('sandstorm') && pokemon.useItem()) {
				pokemon.addVolatile('protocrysalis');
			}
			if (pokemon.hasAbility('protostasis') && !pokemon.volatiles['protostasis'] &&
				 !this.field.isWeather('snow') && pokemon.useItem()) {
				pokemon.addVolatile('protostasis');
			}
			if (pokemon.hasAbility('quarkdrive') && !pokemon.volatiles['quarkdrive'] &&
				 !this.field.isTerrain('electricterrain') && pokemon.useItem()) {
				pokemon.addVolatile('quarkdrive');
			}
			if (pokemon.hasAbility('photondrive') && !pokemon.volatiles['photondrive'] &&
				 !this.field.isTerrain('grassyterrain') && pokemon.useItem()) {
				pokemon.addVolatile('photondrive');
			}
			if (pokemon.hasAbility('neurondrive') && !pokemon.volatiles['neurondrive'] &&
				 !this.field.isTerrain('psychicterrain') && pokemon.useItem()) {
				pokemon.addVolatile('neurondrive');
			}
			if (pokemon.hasAbility('runedrive') && !pokemon.volatiles['runedrive'] &&
				 !this.field.isTerrain('mistyterrain') && pokemon.useItem()) {
				pokemon.addVolatile('runedrive');
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.tags.includes("Paradox")) return false;
			return true;
		},
		num: 1880,
		desc: "Activates the Paradox Abilities. Single use.",
		gen: 9,
	},
	electricseed: {
		name: "Electric Seed",
		spritenum: 664,
		fling: {
			basePower: 10,
		},
		onStart(pokemon) {
			if (!pokemon.ignoringItem() && this.field.isTerrain('electricterrain')) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('cloudnine')) {
						this.debug('Cloud Nine prevents Seed use');
						return;
					}
				}
				pokemon.useItem();
			}
		},
		onTerrainChange() {
			const pokemon = this.effectState.target;
			if (this.field.isTerrain('electricterrain')) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('cloudnine')) {
						this.debug('Cloud Nine prevents Seed use');
						return;
					}
				}
				pokemon.useItem();
			}
		},
		boosts: {
			def: 1,
		},
		num: 881,
		gen: 7,
		desc: "If the terrain is Electric Terrain, raises holder's Defense by 1 stage. Single use.",
	},
	psychicseed: {
		name: "Psychic Seed",
		spritenum: 665,
		fling: {
			basePower: 10,
		},
		onStart(pokemon) {
			if (!pokemon.ignoringItem() && this.field.isTerrain('psychicterrain')) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('cloudnine')) {
						this.debug('Cloud Nine prevents Seed use');
						return;
					}
				}
				pokemon.useItem();
			}
		},
		onTerrainChange() {
			const pokemon = this.effectState.target;
			if (this.field.isTerrain('psychicterrain')) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('cloudnine')) {
						this.debug('Cloud Nine prevents Seed use');
						return;
					}
				}
				pokemon.useItem();
			}
		},
		boosts: {
			spd: 1,
		},
		num: 882,
		gen: 7,
		desc: "If the terrain is Psychic Terrain, raises holder's Sp. Def by 1 stage. Single use.",
	},
	mistyseed: {
		name: "Misty Seed",
		spritenum: 666,
		fling: {
			basePower: 10,
		},
		onStart(pokemon) {
			if (!pokemon.ignoringItem() && this.field.isTerrain('mistyterrain')) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('cloudnine')) {
						this.debug('Cloud Nine prevents Seed use');
						return;
					}
				}
				pokemon.useItem();
			}
		},
		onTerrainChange() {
			const pokemon = this.effectState.target;
			if (this.field.isTerrain('mistyterrain')) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('cloudnine')) {
						this.debug('Cloud Nine prevents Seed use');
						return;
					}
				}
				pokemon.useItem();
			}
		},
		boosts: {
			spd: 1,
		},
		num: 883,
		gen: 7,
		desc: "If the terrain is Misty Terrain, raises holder's Sp. Def by 1 stage. Single use.",
	},
	grassyseed: {
		name: "Grassy Seed",
		spritenum: 667,
		fling: {
			basePower: 10,
		},
		onStart(pokemon) {
			if (!pokemon.ignoringItem() && this.field.isTerrain('grassyterrain')) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('cloudnine')) {
						this.debug('Cloud Nine prevents Seed use');
						return;
					}
				}
				pokemon.useItem();
			}
		},
		onTerrainChange() {
			const pokemon = this.effectState.target;
			if (this.field.isTerrain('grassyterrain')) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('cloudnine')) {
						this.debug('Cloud Nine prevents Seed use');
						return;
					}
				}
				pokemon.useItem();
			}
		},
		boosts: {
			def: 1,
		},
		num: 884,
		gen: 7,
		desc: "If the terrain is Grassy Terrain, raises holder's Defense by 1 stage. Single use.",
	},
};
