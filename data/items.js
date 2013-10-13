exports.BattleItems = [
	{
		name: "Absorb Bulb",
		spritenum: 2,
		fling: {
			basePower: 30
		},
		onAfterDamage: function(damage, target, source, move) {
			if (move.type === 'Water' && target.useItem()) {
				this.boost({spa: 1});
			}
		},
		num: 545,
		gen: 5,
		desc: "Raises Sp. Atk by 1 if hit by a Water-type attack. Single use."
	}, {
		name: "Adamant Orb",
		spritenum: 4,
		fling: {
			basePower: 60
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move && user.baseTemplate.species === 'Dialga' && (move.type === 'Steel' || move.type === 'Dragon')) {
				return this.chainModify(1.2);
			}
		},
		num: 135,
		gen: 4,
		desc: "If holder is a Dialga, its Steel- and Dragon-type attacks have 1.2x power."
	}, {
		name: "Aguav Berry",
		spritenum: 5,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Dragon"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/2) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			this.heal(pokemon.maxhp/8);
			if (pokemon.getNature().minus === 'spd') {
				pokemon.addVolatile('confusion');
			}
		},
		num: 162,
		gen: 3,
		desc: "Restores 1/8 max HP when at 1/2 max HP or less. May confuse. Single use."
	}, {
		name: "Air Balloon",
		spritenum: 6,
		fling: {
			basePower: 10
		},
		onStart: function(target) {
			this.add('-item', target, 'Air Balloon');
		},
		onImmunity: function(type) {
			if (type === 'Ground') return false;
		},
		onAfterDamage: function(damage, target, source, effect) {
			this.debug('effect: '+effect.id);
			if (effect.effectType === 'Move') {
				this.add('-enditem', target, 'Air Balloon');
				target.setItem('');
			}
		},
		onAfterSubDamage: function(damage, target, source, effect) {
			this.debug('effect: '+effect.id);
			if (effect.effectType === 'Move') {
				this.add('-enditem', target, 'Air Balloon');
				target.setItem('');
			}
		},
		num: 541,
		gen: 5,
		desc: "Holder is immune to Ground-type attacks. Pops when holder is hit."
	}, {
		name: "Apicot Berry",
		spritenum: 10,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Ground"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/4|| (pokemon.hp <= pokemon.maxhp/2 && pokemon.ability === 'gluttony')) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			this.boost({spd:1});
		},
		num: 205,
		gen: 3,
		desc: "Raises Sp. Def by 1 when at 1/4 max HP or less. Single use."
	}, {
		name: "Armor Fossil",
		spritenum: 12,
		fling: {
			basePower: 100
		},
		num: 104,
		gen: 4,
		desc: "Can be revived into Shieldon."
	}, {
		name: "Aspear Berry",
		spritenum: 13,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Ice"
		},
		onUpdate: function(pokemon) {
			if (pokemon.status === 'frz') {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			if (pokemon.status === 'frz') {
				pokemon.cureStatus();
			}
		},
		num: 153,
		gen: 3,
		desc: "Holder is cured if it is frozen. Single use."
	}, {
		name: "Babiri Berry",
		spritenum: 17,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Steel"
		},
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.type === 'Steel' && this.getEffectiveness(move.type, target) > 0 && !target.volatiles['substitute']) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return this.chainModify(0.5);
				}
			}
		},
		onEat: function() { },
		num: 199,
		gen: 4,
		desc: "Halves damage taken from a super effective Steel-type attack. Single use."
	}, {
		name: "Belue Berry",
		spritenum: 21,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Electric"
		},
		num: 183,
		gen: 3,
		desc: "No competitive use."
	}, {
		name: "Berry Juice",
		spritenum: 22,
		fling: {
			basePower: 30
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/2) {
				if (pokemon.useItem()) {
					this.heal(20);
				}
			}
		},
		num: 43,
		gen: 2,
		desc: "Restores 20HP when at 1/2 max HP or less. Single use."
	}, {
		name: "Big Root",
		spritenum: 29,
		fling: {
			basePower: 10
		},
		onTryHealPriority: 1,
		onTryHeal: function(damage, target, source, effect) {
			var heals = {drain: 1, leechseed: 1, ingrain: 1, aquaring: 1};
			if (heals[effect.id]) {
				return Math.ceil((damage * 1.3) - 0.5); // Big Root rounds half down
			}
		},
		num: 296,
		gen: 4,
		desc: "Holder gains 1.3x HP from draining moves, Aqua Ring, Ingrain, and Leech Seed."
	}, {
		name: "Binding Band",
		spritenum: 31,
		fling: {
			basePower: 30
		},
		// implemented in statuses
		num: 544,
		gen: 5,
		desc: "Holder's partial-trapping moves deal 1/8 max HP per turn instead of 1/16."
	}, {
		name: "Black Belt",
		spritenum: 32,
		fling: {
			basePower: 30
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Fighting') {
				return this.chainModify(1.2);
			}
		},
		num: 241,
		gen: 2,
		desc: "Holder's Fighting-type attacks have 1.2x power."
	}, {
		name: "Black Sludge",
		spritenum: 34,
		fling: {
			basePower: 30
		},
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual: function(pokemon) {
			if (pokemon.hasType('Poison')) {
				this.heal(pokemon.maxhp/16);
			} else {
				this.damage(pokemon.maxhp/8);
			}
		},
		num: 281,
		gen: 4,
		desc: "Each turn, if holder is a Poison-type, restores 1/16 max HP; loses 1/8 if not."
	}, {
		name: "BlackGlasses",
		spritenum: 35,
		fling: {
			basePower: 30
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Dark') {
				return this.chainModify(1.2);
			}
		},
		num: 240,
		gen: 2,
		desc: "Holder's Dark-type attacks have 1.2x power."
	}, {
		name: "Blazikenite",
		spritenum: 0,
		//todo
		num: -6,
		gen: 6,
		desc: "Mega-evolves Blaziken."
	}, {
		name: "Bluk Berry",
		spritenum: 44,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Fire"
		},
		num: 165,
		gen: 3,
		desc: "No competitive use."
	}, {
		name: "BrightPowder",
		spritenum: 51,
		fling: {
			basePower: 10
		},
		onAccuracy: function(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('brightpowder - decreasing accuracy');
			return accuracy * 0.9;
		},
		num: 213,
		gen: 2,
		desc: "The accuracy of attacks against the holder is 0.9x."
	}, {
		name: "Bug Gem",
		spritenum: 53,
		isGem: true,
		onSourceTryPrimaryHit: function(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Bug') {
				if (source.useItem()) {
					this.add('-enditem', source, 'Bug Gem', '[from] gem', '[move] '+move.name);
					source.addVolatile('gem');
				}
			}
		},
		num: 558,
		gen: 5,
		desc: "Holder's first successful Bug-type attack will have 1.5x power. Single use."
	}, {
		name: "Burn Drive",
		spritenum: 54,
		fling: {
			basePower: 70
		},
		onDrive: 'Fire',
		num: 118,
		gen: 5,
		desc: "Holder's Techno Blast is Fire-type."
	}, {
		name: "Cell Battery",
		spritenum: 60,
		fling: {
			basePower: 30
		},
		onAfterDamage: function(damage, target, source, move) {
			if (move.type === 'Electric' && target.useItem()) {
				this.boost({atk: 1});
			}
		},
		num: 546,
		gen: 5,
		desc: "Raises Attack by 1 if hit by an Electric-type attack. Single use."
	}, {
		name: "Charcoal",
		spritenum: 61,
		fling: {
			basePower: 30
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Fire') {
				return this.chainModify(1.2);
			}
		},
		num: 249,
		gen: 2,
		desc: "Holder's Fire-type attacks have 1.2x power."
	}, {
		name: "Charizardite X",
		spritenum: 0,
		//todo
		num: -6,
		gen: 6,
		desc: "Mega-evolves Charizard into Mega Charizard X."
	}, {
		name: "Charizardite Y",
		spritenum: 0,
		//todo
		num: -6,
		gen: 6,
		desc: "Mega-evolves Charizard into Mega Charizard Y."
	}, {
		name: "Charti Berry",
		spritenum: 62,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Rock"
		},
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.type === 'Rock' && this.getEffectiveness(move.type, target) > 0 && !target.volatiles['substitute']) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return this.chainModify(0.5);
				}
			}
		},
		onEat: function() { },
		num: 195,
		gen: 4,
		desc: "Halves damage taken from a super effective Rock-type attack. Single use."
	}, {
		name: "Cheri Berry",
		spritenum: 63,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Fire"
		},
		onUpdate: function(pokemon) {
			if (pokemon.status === 'par') {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			if (pokemon.status === 'par') {
				pokemon.cureStatus();
			}
		},
		num: 149,
		gen: 3,
		desc: "Holder cures itself if it is paralyzed. Single use."
	}, {
		name: "Cherish Ball",
		spritenum: 64,
		num: 16,
		gen: 4,
		desc: "A rare Poke Ball that has been crafted to commemorate an occasion."
	}, {
		name: "Chesto Berry",
		spritenum: 65,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Water"
		},
		onUpdate: function(pokemon) {
			if (pokemon.status === 'slp') {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			if (pokemon.status === 'slp') {
				pokemon.cureStatus();
			}
		},
		num: 150,
		gen: 3,
		desc: "Holder wakes up if it is asleep. Single use."
	}, {
		name: "Chilan Berry",
		spritenum: 66,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Normal"
		},
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.type === 'Normal' && !target.volatiles['substitute']) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return this.chainModify(0.5);
				}
			}
		},
		onEat: function() { },
		num: 200,
		gen: 4,
		desc: "Halves damage taken from a Normal-type attack. Single use."
	}, {
		name: "Chill Drive",
		spritenum: 67,
		fling: {
			basePower: 70
		},
		onDrive: 'Ice',
		num: 119,
		gen: 5,
		desc: "Holder's Techno Blast is Ice-type."
	}, {
		name: "Choice Band",
		spritenum: 68,
		fling: {
			basePower: 10
		},
		onStart: function(pokemon) {
			if (pokemon.volatiles['choicelock']) {
				this.debug('removing choicelock: '+pokemon.volatiles.choicelock);
			}
			pokemon.removeVolatile('choicelock');
		},
		onModifyMove: function(move, pokemon) {
			pokemon.addVolatile('choicelock');
		},
		onModifyAtkPriority: 1,
		onModifyAtk: function(atk) {
			return this.chainModify(1.5);
		},
		isChoice: true,
		num: 220,
		gen: 3,
		desc: "Holder's Attack is 1.5x, but it can only use the first move it selects."
	}, {
		name: "Choice Scarf",
		spritenum: 69,
		fling: {
			basePower: 10
		},
		onStart: function(pokemon) {
			if (pokemon.volatiles['choicelock']) {
				this.debug('removing choicelock: '+pokemon.volatiles.choicelock);
			}
			pokemon.removeVolatile('choicelock');
		},
		onModifyMove: function(move, pokemon) {
			pokemon.addVolatile('choicelock');
		},
		onModifySpe: function(speMod) {
			return this.chain(speMod, 1.5);
		},
		isChoice: true,
		num: 287,
		gen: 4,
		desc: "Holder's Speed is 1.5x, but it can only use the first move it selects."
	}, {
		name: "Choice Specs",
		spritenum: 70,
		fling: {
			basePower: 10
		},
		onStart: function(pokemon) {
			if (pokemon.volatiles['choicelock']) {
				this.debug('removing choicelock: '+pokemon.volatiles.choicelock);
			}
			pokemon.removeVolatile('choicelock');
		},
		onModifyMove: function(move, pokemon) {
			pokemon.addVolatile('choicelock');
		},
		onModifySpAPriority: 1,
		onModifySpA: function(spa) {
			return this.chainModify(1.5);
		},
		isChoice: true,
		num: 297,
		gen: 4,
		desc: "Holder's Sp. Atk is 1.5x, but it can only use the first move it selects."
	}, {
		name: "Chople Berry",
		spritenum: 71,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Fighting"
		},
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.type === 'Fighting' && this.getEffectiveness(move.type, target) > 0 && !target.volatiles['substitute']) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return this.chainModify(0.5);
				}
			}
		},
		onEat: function() { },
		num: 189,
		gen: 4,
		desc: "Halves damage taken from a super effective Fighting-type attack. Single use."
	}, {
		name: "Claw Fossil",
		spritenum: 72,
		fling: {
			basePower: 100
		},
		num: 100,
		gen: 3,
		desc: "Can be revived into Anorith."
	}, {
		name: "Coba Berry",
		spritenum: 76,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Flying"
		},
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.type === 'Flying' && this.getEffectiveness(move.type, target) > 0 && !target.volatiles['substitute']) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return this.chainModify(0.5);
				}
			}
		},
		onEat: function() { },
		num: 192,
		gen: 4,
		desc: "Halves damage taken from a super effective Flying-type attack. Single use."
	}, {
		name: "Colbur Berry",
		spritenum: 78,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Dark"
		},
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.type === 'Dark' && this.getEffectiveness(move.type, target) > 0 && !target.volatiles['substitute']) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return this.chainModify(0.5);
				}
			}
		},
		onEat: function() { },
		num: 198,
		gen: 4,
		desc: "Halves damage taken from a super effective Dark-type attack. Single use."
	}, {
		name: "Cornn Berry",
		spritenum: 81,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Bug"
		},
		num: 175,
		gen: 3,
		desc: "No competitive use."
	}, {
		name: "Cover Fossil",
		spritenum: 85,
		fling: {
			basePower: 100
		},
		num: 572,
		gen: 5,
		desc: "Can be revived into Tirtouga."
	}, {
		name: "Custap Berry",
		spritenum: 86,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Ghost"
		},
		onModifyPriority: function(priority, pokemon) {
			if (pokemon.hp <= pokemon.maxhp/4 || (pokemon.hp <= pokemon.maxhp/2 && pokemon.ability === 'gluttony')) {
				if (pokemon.eatItem()) {
					this.add('-activate', pokemon, 'Custap Berry');
					pokemon.removeVolatile('custapberry');
					return priority + 0.1;
				}
			}
		},
		num: 210,
		gen: 4,
		desc: "Holder moves first in its priority bracket when at 1/4 max HP or less. Single use."
	}, {
		name: "Damp Rock",
		spritenum: 88,
		fling: {
			basePower: 60
		},
		num: 285,
		gen: 4,
		desc: "Holder's use of Rain Dance lasts 8 turns instead of 5."
	}, {
		name: "Dark Gem",
		spritenum: 89,
		isGem: true,
		onSourceTryPrimaryHit: function(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Dark') {
				if (source.useItem()) {
					this.add('-enditem', source, 'Dark Gem', '[from] gem', '[move] '+move.name);
					source.addVolatile('gem');
				}
			}
		},
		num: 562,
		gen: 5,
		desc: "Holder's first successful Dark-type attack will have 1.5x power. Single use."
	}, {
		name: "DeepSeaScale",
		spritenum: 93,
		fling: {
			basePower: 30
		},
		onModifySpDPriority: 2,
		onModifySpD: function(spd, pokemon) {
			if (pokemon.baseTemplate.species === 'Clamperl') {
				return this.chainModify(2);
			}
		},
		num: 227,
		gen: 3,
		desc: "If holder is a Clamperl, its Sp. Def is doubled."
	}, {
		name: "DeepSeaTooth",
		spritenum: 94,
		fling: {
			basePower: 90
		},
		onModifySpAPriority: 1,
		onModifySpA: function(spa, pokemon) {
			if (pokemon.baseTemplate.species === 'Clamperl') {
				return this.chainModify(2);
			}
		},
		num: 226,
		gen: 3,
		desc: "If holder is a Clamperl, its Sp. Atk is doubled."
	}, {
		name: "Destiny Knot",
		spritenum: 95,
		fling: {
			basePower: 10
		},
		onAttractPriority: -100,
		onAttract: function(target, source) {
			this.debug('attract intercepted: '+target+' from '+source);
			if (!source || source === target) return;
			if (!source.volatiles.attract) source.addVolatile('attract', target);
		},
		num: 280,
		gen: 4,
		desc: "If holder becomes infatuated, the other Pokemon also becomes infatuated."
	}, {
		name: "Dive Ball",
		spritenum: 101,
		num: 7,
		gen: 3,
		desc: "A Poke Ball that works especially well on Pokemon that live underwater."
	}, {
		name: "Dome Fossil",
		spritenum: 102,
		fling: {
			basePower: 100
		},
		num: 102,
		gen: 3,
		desc: "Can be revived into Kabuto."
	}, {
		name: "Douse Drive",
		spritenum: 103,
		fling: {
			basePower: 70
		},
		onDrive: 'Water',
		num: 116,
		gen: 5,
		desc: "Holder's Techno Blast is Water-type."
	}, {
		name: "Draco Plate",
		spritenum: 105,
		fling: {
			basePower: 90
		},
		onPlate: 'Dragon',
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Dragon') {
				return this.chainModify(1.2);
			}
		},
		num: 311,
		gen: 4,
		desc: "Holder's Dragon-type attacks have 1.2x power. Judgment is Dragon-type."
	}, {
		name: "Dragon Fang",
		spritenum: 106,
		fling: {
			basePower: 70
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Dragon') {
				return this.chainModify(1.2);
			}
		},
		num: 250,
		gen: 2,
		desc: "Holder's Dragon-type attacks have 1.2x power."
	}, {
		name: "Dragon Gem",
		spritenum: 107,
		isGem: true,
		onSourceTryPrimaryHit: function(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Dragon') {
				if (source.useItem()) {
					this.add('-enditem', source, 'Dragon Gem', '[from] gem', '[move] '+move.name);
					source.addVolatile('gem');
				}
			}
		},
		num: 561,
		gen: 5,
		desc: "Holder's first successful Dragon-type attack will have 1.5x power. Single use."
	}, {
		name: "Dread Plate",
		spritenum: 110,
		fling: {
			basePower: 90
		},
		onPlate: 'Dark',
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Dark') {
				return this.chainModify(1.2);
			}
		},
		num: 312,
		gen: 4,
		desc: "Holder's Dark-type attacks have 1.2x power. Judgment is Dark-type."
	}, {
		name: "Dream Ball",
		spritenum: 111,
		num: 576,
		gen: 5,
		desc: "A special Poke Ball that appears out of nowhere in a bag at the Entree Forest."
	}, {
		name: "Durin Berry",
		spritenum: 114,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Water"
		},
		num: 182,
		gen: 3,
		desc: "No competitive use."
	}, {
		name: "Dusk Ball",
		spritenum: 115,
		num: 13,
		gen: 4,
		desc: "A Poke Ball that makes it easier to catch wild Pokemon at night or in caves."
	}, {
		name: "Earth Plate",
		spritenum: 117,
		fling: {
			basePower: 90
		},
		onPlate: 'Ground',
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Ground') {
				return this.chainModify(1.2);
			}
		},
		num: 305,
		gen: 4,
		desc: "Holder's Ground-type attacks have 1.2x power. Judgment is Ground-type."
	}, {
		name: "Eject Button",
		spritenum: 118,
		fling: {
			basePower: 30
		},
		onHit: function(target, source, move) {
			if (source && source !== target && target.hp && move && move.selfSwitch) {
				move.selfSwitch = false;
			}
		},
		onAfterMoveSecondary: function(target, source, move) {
			if (source && source !== target && target.hp && move && move.category !== 'Status') {
				if (target.useItem()) {
					target.switchFlag = true;
				}
			}
		},
		num: 547,
		gen: 5,
		desc: "If holder is hit, it immediately switches out with a chosen ally. Single use."
	}, {
		name: "Electirizer",
		spritenum: 119,
		fling: {
			basePower: 80
		},
		num: 322,
		gen: 4,
		desc: "Evolves Electabuzz into Electivire when traded."
	}, {
		name: "Electric Gem",
		spritenum: 120,
		isGem: true,
		onSourceTryPrimaryHit: function(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Electric') {
				if (source.useItem()) {
					this.add('-enditem', source, 'Electric Gem', '[from] gem', '[move] '+move.name);
					source.addVolatile('gem');
				}
			}
		},
		num: 550,
		gen: 5,
		desc: "Holder's first successful Electric-type attack will have 1.5x power. Single use."
	}, {
		name: "EnergyPowder",
		spritenum: 123,
		fling: {
			basePower: 30
		},
		num: 34,
		gen: 2,
		desc: "Restores 50HP to one Pokemon but lowers Happiness."
	}, {
		name: "Enigma Berry",
		spritenum: 124,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Bug"
		},
		onSourceBasePower: function(basePower, user, target, move) {
			if (move && this.getEffectiveness(move.type, target) > 0) {
				target.addVolatile('enigmaberry');
			}
		},
		effect: {
			duration: 1,
			onUpdate: function(target) {
				if (target.eatItem()) {
					target.removeVolatile('enigmaberry');
				}
			}
		},
		onEat: function(pokemon) {
			this.heal(pokemon.maxhp/4);
		},
		num: 208,
		gen: 3,
		desc: "Restores 1/4 max HP when holder is hit by a super effective move. Single use."
	}, {
		name: "Eviolite",
		spritenum: 130,
		fling: {
			basePower: 40
		},
		onModifyDefPriority: 2,
		onModifyDef: function(def, pokemon) {
			if (pokemon.baseTemplate.nfe) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 2,
		onModifySpD: function(spd, pokemon) {
			if (pokemon.baseTemplate.nfe) {
				return this.chainModify(1.5);
			}
		},
		num: 538,
		gen: 5,
		desc: "If holder's species can evolve, its Defense and Sp. Def are 1.5x."
	}, {
		name: "Expert Belt",
		spritenum: 132,
		fling: {
			basePower: 10
		},
		onModifyDamage: function(damage, source, target, move) {
			if (move && this.getEffectiveness(move.type, target) > 0) {
				return this.chainModify(1.2);
			}
		},
		num: 268,
		gen: 4,
		desc: "Holder's super effective attacks against other Pokemon do 1.2x damage."
	}, {
		name: "Fast Ball",
		spritenum: 137,
		num: 492,
		gen: 2,
		desc: "A Poke Ball that makes it easier to catch Pokemon which are quick to run away."
	}, {
		name: "Fighting Gem",
		spritenum: 139,
		isGem: true,
		onSourceTryPrimaryHit: function(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Fighting') {
				if (source.useItem()) {
					this.add('-enditem', source, 'Fighting Gem', '[from] gem', '[move] '+move.name);
					source.addVolatile('gem');
				}
			}
		},
		num: 553,
		gen: 5,
		desc: "Holder's first successful Fighting-type attack will have 1.5x power. Single use."
	}, {
		name: "Figy Berry",
		spritenum: 140,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Bug"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/2) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			this.heal(pokemon.maxhp/8);
			if (pokemon.getNature().minus === 'atk') {
				pokemon.addVolatile('confusion');
			}
		},
		num: 159,
		gen: 3,
		desc: "Restores 1/8 max HP when at 1/2 max HP or less. May confuse. Single use."
	}, {
		name: "Fire Gem",
		spritenum: 141,
		isGem: true,
		onSourceTryPrimaryHit: function(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Fire') {
				if (source.useItem()) {
					this.add('-enditem', source, 'Fire Gem', '[from] gem', '[move] '+move.name);
					source.addVolatile('gem');
				}
			}
		},
		num: 548,
		gen: 5,
		desc: "Holder's first successful Fire-type attack will have 1.5x power. Single use."
	}, {
		name: "Fist Plate",
		spritenum: 143,
		fling: {
			basePower: 90
		},
		onPlate: 'Fighting',
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Fighting') {
				return this.chainModify(1.2);
			}
		},
		num: 303,
		gen: 4,
		desc: "Holder's Fighting-type attacks have 1.2x power. Judgment is Fighting-type."
	}, {
		name: "Flame Orb",
		spritenum: 145,
		fling: {
			basePower: 30,
			status: 'brn'
		},
		onResidualOrder: 26,
		onResidualSubOrder: 2,
		onResidual: function(pokemon) {
			if (!pokemon.status && !pokemon.hasType('Fire') && pokemon.ability !== 'waterveil') {
				this.add('-activate', pokemon, 'item: Flame Orb');
				pokemon.trySetStatus('brn');
			}
		},
		num: 273,
		gen: 4,
		desc: "At the end of every turn, this item attempts to burn the holder."
	}, {
		name: "Flame Plate",
		spritenum: 146,
		fling: {
			basePower: 90
		},
		onPlate: 'Fire',
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Fire') {
				return this.chainModify(1.2);
			}
		},
		num: 298,
		gen: 4,
		desc: "Holder's Fire-type attacks have 1.2x power. Judgment is Fire-type."
	}, {
		name: "Float Stone",
		spritenum: 147,
		fling: {
			basePower: 30
		},
		onModifyPokemon: function(pokemon) {
			pokemon.weightkg /= 2;
		},
		num: 539,
		gen: 5,
		desc: "Holder's weight is halved."
	}, {
		name: "Flying Gem",
		spritenum: 149,
		isGem: true,
		onSourceTryPrimaryHit: function(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Flying') {
				if (source.useItem()) {
					this.add('-enditem', source, 'Flying Gem', '[from] gem', '[move] '+move.name);
					source.addVolatile('gem');
				}
			}
		},
		num: 556,
		gen: 5,
		desc: "Holder's first successful Flying-type attack will have 1.5x power. Single use."
	}, {
		name: "Focus Band",
		spritenum: 150,
		fling: {
			basePower: 10
		},
		onDamage: function(damage, target, source, effect) {
			if (this.random(10) === 0 && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add("-message",target.name+" held on using its Focus Band! (placeholder)");
				return target.hp - 1;
			}
		},
		num: 230,
		gen: 2,
		desc: "Holder has a 10% chance to survive an attack that would KO it with 1HP."
	}, {
		name: "Focus Sash",
		spritenum: 151,
		fling: {
			basePower: 10
		},
		onDamage: function(damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				if (target.useItem()) {
					return target.hp - 1;
				}
			}
		},
		num: 275,
		gen: 4,
		desc: "If holder's HP is full, will survive an attack that would KO it with 1HP. Single use."
	}, {
		name: "Full Incense",
		spritenum: 155,
		fling: {
			basePower: 10
		},
		onModifyPriority: function(priority, pokemon) {
			if (pokemon.ability !== 'stall') {
				return priority - 0.1;
			}
		},
		num: 316,
		gen: 4,
		desc: "Holder moves last in its priority bracket."
	}, {
		name: "Ganlon Berry",
		spritenum: 158,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Ice"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/4 || (pokemon.hp <= pokemon.maxhp/2 && pokemon.ability === 'gluttony')) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			this.boost({def:1});
		},
		num: 202,
		gen: 3,
		desc: "Raises Defense by 1 when at 1/4 max HP or less. Single use."
	}, {
		name: "Ghost Gem",
		spritenum: 161,
		isGem: true,
		onSourceTryPrimaryHit: function(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Ghost') {
				if (source.useItem()) {
					this.add('-enditem', source, 'Ghost Gem', '[from] gem', '[move] '+move.name);
					source.addVolatile('gem');
				}
			}
		},
		num: 560,
		gen: 5,
		desc: "Holder's first successful Ghost-type attack will have 1.5x power. Single use."
	}, {
		name: "Grass Gem",
		spritenum: 172,
		isGem: true,
		onSourceTryPrimaryHit: function(target, source, move) {
			if (move.type === 'Grass') {
				if (source.useItem()) {
					this.add('-enditem', source, 'Grass Gem', '[from] gem', '[move] '+move.name);
					source.addVolatile('gem');
				}
			}
		},
		num: 551,
		gen: 5,
		desc: "Holder's first successful Grass-type attack will have 1.5x power. Single use."
	}, {
		name: "Great Ball",
		spritenum: 174,
		num: 3,
		gen: 1,
		desc: "A high-performance Ball that provides a higher catch rate than a Poke Ball."
	}, {
		name: "Grepa Berry",
		spritenum: 178,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Flying"
		},
		num: 173,
		gen: 3,
		desc: "No competitive use."
	}, {
		name: "Grip Claw",
		spritenum: 179,
		fling: {
			basePower: 90
		},
		// implemented in statuses
		num: 286,
		gen: 4,
		desc: "Holder's partial-trapping moves always last 7 turns."
	}, {
		name: "Griseous Orb",
		spritenum: 180,
		fling: {
			basePower: 60
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (user.baseTemplate.num === 487 && (move.type === 'Ghost' || move.type === 'Dragon')) {
				return this.chainModify(1.2);
			}
		},
		onTakeItem: function(item, pokemon, source) {
			if ((source && source.baseTemplate.num === 487) || pokemon.baseTemplate.num === 487) {
				return false;
			}
		},
		num: 112,
		gen: 4,
		desc: "If holder is a Giratina, its Ghost- and Dragon-type attacks have 1.2x power."
	}, {
		name: "Ground Gem",
		spritenum: 182,
		isGem: true,
		onSourceTryPrimaryHit: function(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Ground') {
				if (source.useItem()) {
					this.add('-enditem', source, 'Ground Gem', '[from] gem', '[move] '+move.name);
					source.addVolatile('gem');
				}
			}
		},
		num: 555,
		gen: 5,
		desc: "Holder's first successful Ground-type attack will have 1.5x power. Single use."
	}, {
		name: "Haban Berry",
		spritenum: 185,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Dragon"
		},
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.type === 'Dragon' && this.getEffectiveness(move.type, target) > 0 && !target.volatiles['substitute']) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return this.chainModify(0.5);
				}
			}
		},
		onEat: function() { },
		num: 197,
		gen: 4,
		desc: "Halves damage taken from a super effective Dragon-type attack. Single use."
	}, {
		name: "Hard Stone",
		spritenum: 187,
		fling: {
			basePower: 100
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Rock') {
				return this.chainModify(1.2);
			}
		},
		num: 238,
		gen: 2,
		desc: "Holder's Rock-type attacks have 1.2x power."
	}, {
		name: "Heal Ball",
		spritenum: 188,
		num: 14,
		gen: 4,
		desc: "A remedial Poke Ball that restores the caught Pokemon's HP and status problem."
	}, {
		name: "Heat Rock",
		spritenum: 193,
		fling: {
			basePower: 60
		},
		num: 284,
		gen: 4,
		desc: "Holder's use of Sunny Day lasts 8 turns instead of 5."
	}, {
		name: "Heavy Ball",
		spritenum: 194,
		num: 495,
		gen: 2,
		desc: "A Poke Ball for catching very heavy Pokemon."
	}, {
		name: "Helix Fossil",
		spritenum: 195,
		fling: {
			basePower: 100
		},
		num: 101,
		gen: 3,
		desc: "Can be revived into Omanyte."
	}, {
		name: "Hondew Berry",
		spritenum: 213,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Ground"
		},
		num: 172,
		gen: 3,
		desc: "No competitive use."
	}, {
		name: "Iapapa Berry",
		spritenum: 217,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Dark"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/2) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			this.heal(pokemon.maxhp/8);
			if (pokemon.getNature().minus === 'def') {
				pokemon.addVolatile('confusion');
			}
		},
		num: 163,
		gen: 3,
		desc: "Restores 1/8 max HP when at 1/2 max HP or less. May confuse. Single use."
	}, {
		name: "Ice Gem",
		spritenum: 218,
		isGem: true,
		onSourceTryPrimaryHit: function(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Ice') {
				if (source.useItem()) {
					this.add('-enditem', source, 'Ice Gem', '[from] gem', '[move] '+move.name);
					source.addVolatile('gem');
				}
			}
		},
		num: 552,
		gen: 5,
		desc: "Holder's first successful Ice-type attack will have 1.5x power. Single use."
	}, {
		name: "Icicle Plate",
		spritenum: 220,
		fling: {
			basePower: 90
		},
		onPlate: 'Ice',
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ice') {
				return this.chainModify(1.2);
			}
		},
		num: 302,
		gen: 4,
		desc: "Holder's Ice-type attacks have 1.2x power. Judgment is Ice-type."
	}, {
		name: "Icy Rock",
		spritenum: 221,
		fling: {
			basePower: 40
		},
		num: 282,
		gen: 4,
		desc: "Holder's use of Hail lasts 8 turns instead of 5."
	}, {
		name: "Insect Plate",
		spritenum: 223,
		fling: {
			basePower: 90
		},
		onPlate: 'Bug',
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Bug') {
				return this.chainModify(1.2);
			}
		},
		num: 308,
		gen: 4,
		desc: "Holder's Bug-type attacks have 1.2x power. Judgment is Bug-type."
	}, {
		name: "Iron Ball",
		spritenum: 224,
		fling: {
			basePower: 130
		},
		onModifyPokemon: function(pokemon) {
			pokemon.negateImmunity['Ground'] = true;
		},
		onModifySpe: function(speMod) {
			return this.chain(speMod, .5);
		},
		num: 278,
		gen: 4,
		desc: "Holder's Speed is halved and it becomes grounded."
	}, {
		name: "Iron Plate",
		spritenum: 225,
		fling: {
			basePower: 90
		},
		onPlate: 'Steel',
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Steel') {
				return this.chainModify(1.2);
			}
		},
		num: 313,
		gen: 4,
		desc: "Holder's Steel-type attacks have 1.2x power. Judgment is Steel-type."
	}, {
		name: "Jaboca Berry",
		spritenum: 230,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Dragon"
		},
		onAfterMoveSecondary: function(target, source, move) {
			if (source && source !== target && move && move.category === 'Physical') {
				if (target.eatItem()) {
					this.damage(source.maxhp/8, source, target);
				}
			}
		},
		onEat: function() { },
		num: 211,
		gen: 4,
		desc: "If holder is hit by a physical move, attacker loses 1/8 of its max HP. Single use."
	}, {
		name: "Kasib Berry",
		spritenum: 233,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Ghost"
		},
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.type === 'Ghost' && this.getEffectiveness(move.type, target) > 0 && !target.volatiles['substitute']) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return this.chainModify(0.5);
				}
			}
		},
		onEat: function() { },
		num: 196,
		gen: 4,
		desc: "Halves damage taken from a super effective Ghost-type attack. Single use."
	}, {
		name: "Kebia Berry",
		spritenum: 234,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Poison"
		},
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.type === 'Poison' && this.getEffectiveness(move.type, target) > 0 && !target.volatiles['substitute']) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return this.chainModify(0.5);
				}
			}
		},
		onEat: function() { },
		num: 190,
		gen: 4,
		desc: "Halves damage taken from a super effective Poison-type attack. Single use."
	}, {
		name: "Kelpsy Berry",
		spritenum: 235,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Fighting"
		},
		num: 170,
		gen: 3,
		desc: "No competitive use."
	}, {
		name: "King's Rock",
		spritenum: 236,
		fling: {
			basePower: 30,
			volatileStatus: 'flinch'
		},
		onModifyMove: function(move) {
			if (move.category !== "Status") {
				if (!move.secondaries) move.secondaries = [];
				for (var i=0; i<move.secondaries.length; i++) {
					if (move.secondaries[i].volatileStatus === 'flinch') return;
				}
				move.secondaries.push({
					chance: 10,
					volatileStatus: 'flinch'
				});
			}
		},
		num: 221,
		gen: 2,
		desc: "Holder's attacks without a chance to flinch gain a 10% chance to flinch."
	}, {
		name: "Lagging Tail",
		spritenum: 237,
		fling: {
			basePower: 10
		},
		onModifyPriority: function(priority, pokemon) {
			if (pokemon.ability !== 'stall') {
				return priority - 0.1;
			}
		},
		num: 279,
		gen: 4,
		desc: "Holder moves last in its priority bracket."
	}, {
		name: "Lansat Berry",
		spritenum: 238,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Flying"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/4 || (pokemon.hp <= pokemon.maxhp/2 && pokemon.ability === 'gluttony')) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			pokemon.addVolatile('focusenergy');
		},
		num: 206,
		gen: 3,
		desc: "Holder gains the Focus Energy effect when at 1/4 max HP or less. Single use."
	}, {
		name: "Lax Incense",
		spritenum: 240,
		fling: {
			basePower: 10
		},
		onAccuracy: function(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('lax incense - decreasing accuracy');
			return accuracy * 0.9;
		},
		num: 255,
		gen: 3,
		desc: "The accuracy of attacks against the holder is 0.9x."
	}, {
		name: "Leftovers",
		spritenum: 242,
		fling: {
			basePower: 10
		},
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual: function(pokemon) {
			this.heal(pokemon.maxhp/16);
		},
		num: 234,
		gen: 2,
		desc: "At the end of every turn, holder restores 1/16 of its max HP."
	}, {
		name: "Leppa Berry",
		spritenum: 244,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Fighting"
		},
		onUpdate: function(pokemon) {
			var move = pokemon.getMoveData(pokemon.lastMove);
			if (move && move.pp === 0) {
				pokemon.addVolatile('leppaberry');
				pokemon.volatiles['leppaberry'].move = move;
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			var move;
			if (pokemon.volatiles['leppaberry']) {
				move = pokemon.volatiles['leppaberry'].move;
				pokemon.removeVolatile('leppaberry');
			} else {
				var pp = 99;
				for (var i in pokemon.moveset) {
					if (pokemon.moveset[i].pp < pp) {
						move = pokemon.moveset[i];
						pp = move.pp;
					}
				}
			}
			move.pp += 10;
			if (move.pp > move.maxpp) move.pp = move.maxpp;
			this.add("-message",pokemon.name+" restored "+move.move+"'s PP using its Leppa Berry! (placeholder)");
		},
		num: 154,
		gen: 3,
		desc: "Restores 10PP to the first of the holder's moves to reach 0PP. Single use."
	}, {
		name: "Level Ball",
		spritenum: 246,
		num: 493,
		gen: 2,
		desc: "A Poke Ball for catching Pokemon that are a lower level than your own."
	}, {
		name: "Liechi Berry",
		spritenum: 248,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Grass"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/4 || (pokemon.hp <= pokemon.maxhp/2 && pokemon.ability === 'gluttony')) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			this.boost({atk:1});
		},
		num: 201,
		gen: 3,
		desc: "Raises Attack by 1 when at 1/4 max HP or less. Single use."
	}, {
		name: "Life Orb",
		spritenum: 249,
		fling: {
			basePower: 30
		},
		onModifyDamage: function(damage, source, target, move) {
			if (source) {
				source.addVolatile('lifeorb');
				return this.chainModify(1.3);
			}
		},
		effect: {
			duration: 1,
			onAfterMoveSecondarySelf: function(source, target, move) {
				if (move && move.effectType === 'Move' && source && source.volatiles['lifeorb']) {
					this.damage(source.maxhp/10, source, source, this.getItem('lifeorb'));
					source.removeVolatile('lifeorb');
				}
			}
		},
		num: 270,
		gen: 4,
		desc: "Holder's damaging moves do 1.3x damage; loses 1/10 max HP after the attack."
	}, {
		name: "Light Ball",
		spritenum: 251,
		fling: {
			basePower: 30,
			status: 'par'
		},
		onModifyAtkPriority: 1,
		onModifyAtk: function(atk, pokemon) {
			if (pokemon.baseTemplate.species === 'Pikachu') {
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 1,
		onModifySpA: function(spa, pokemon) {
			if (pokemon.baseTemplate.species === 'Pikachu') {
				return this.chainModify(2);
			}
		},
		num: 236,
		gen: 2,
		desc: "If holder is a Pikachu, its Attack and Sp. Atk are doubled."
	}, {
		name: "Light Clay",
		spritenum: 252,
		fling: {
			basePower: 30
		},
		// implemented in the corresponding thing
		num: 269,
		gen: 4,
		desc: "Holder's use of Light Screen or Reflect lasts 8 turns instead of 5."
	}, {
		name: "Love Ball",
		spritenum: 258,
		num: 496,
		gen: 2,
		desc: "Poke Ball for catching Pokemon that are the opposite gender of your Pokemon."
	}, {
		name: "Lucky Punch",
		spritenum: 261,
		fling: {
			basePower: 40
		},
		onModifyMove: function(move, user) {
			if (user.baseTemplate.species === 'Chansey') {
				move.critRatio += 2;
			}
		},
		num: 256,
		gen: 2,
		desc: "If holder is a Chansey, its critical hit ratio is boosted by 2."
	}, {
		name: "Lum Berry",
		spritenum: 262,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Flying"
		},
		onUpdate: function(pokemon) {
			if (pokemon.status || pokemon.volatiles['confusion']) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			pokemon.cureStatus();
			pokemon.removeVolatile('confusion');
		},
		num: 157,
		gen: 3,
		desc: "Holder cures itself if it is confused or has a major status problem. Single use."
	}, {
		name: "Lure Ball",
		spritenum: 264,
		num: 494,
		gen: 2,
		desc: "A Poke Ball for catching Pokemon hooked by a Rod when fishing."
	}, {
		name: "Lustrous Orb",
		spritenum: 265,
		fling: {
			basePower: 60
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move && user.baseTemplate.species === 'Palkia' && (move.type === 'Water' || move.type === 'Dragon')) {
				return this.chainModify(1.2);
			}
		},
		num: 136,
		gen: 4,
		desc: "If holder is a Palkia, its Water- and Dragon-type attacks have 1.2x power."
	}, {
		name: "Luxury Ball",
		spritenum: 266,
		num: 11,
		gen: 3,
		desc: "A comfortable Poke Ball that makes a caught wild Pokemon quickly grow friendly."
	}, {
		name: "Macho Brace",
		spritenum: 269,
		fling: {
			basePower: 60
		},
		onModifySpe: function(speMod) {
			return this.chain(speMod, 0.5);
		},
		num: 215,
		gen: 3,
		desc: "Holder's Speed is halved."
	}, {
		name: "Magnet",
		spritenum: 273,
		fling: {
			basePower: 30
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Electric') {
				return this.chainModify(1.2);
			}
		},
		num: 242,
		gen: 2,
		desc: "Holder's Electric-type attacks have 1.2x power."
	}, {
		name: "Mago Berry",
		spritenum: 274,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Ghost"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/2) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			this.heal(pokemon.maxhp/8);
			if (pokemon.getNature().minus === 'spe') {
				pokemon.addVolatile('confusion');
			}
		},
		num: 161,
		gen: 3,
		desc: "Restores 1/8 max HP when at 1/2 max HP or less. May confuse. Single use."
	}, {
		name: "Magost Berry",
		spritenum: 275,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Rock"
		},
		num: 176,
		gen: 3,
		desc: "No competitive use."
	}, {
		name: "Mail",
		spritenum: 403,
		onTakeItem: false,
		gen: 2,
		desc: "This item cannot be given to or taken from a Pokemon, except by Knock Off."
	}, {
		name: "Master Ball",
		spritenum: 276,
		num: 1,
		gen: 1,
		desc: "The best Ball with the ultimate performance. It will catch any wild Pokemon."
	}, {
		name: "Meadow Plate",
		spritenum: 282,
		fling: {
			basePower: 90
		},
		onPlate: 'Grass',
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Grass') {
				return this.chainModify(1.2);
			}
		},
		num: 301,
		gen: 4,
		desc: "Holder's Grass-type attacks have 1.2x power. Judgment is Grass-type."
	}, {
		name: "Mental Herb",
		spritenum: 285,
		fling: {
			basePower: 10,
			effect: function(pokemon) {
				var conditions = ['attract','taunt','encore','torment','disable'];
				for (var i=0; i<conditions.length; i++) {
					if (pokemon.volatiles[conditions[i]]) {
						for (var j=0; j<conditions.length; j++) {
							pokemon.removeVolatile(conditions[j]);
						}
						return;
					}
				}
			}
		},
		onUpdate: function(pokemon) {
			var conditions = ['attract','taunt','encore','torment','disable'];
			for (var i=0; i<conditions.length; i++) {
				if (pokemon.volatiles[conditions[i]]) {
					if (!pokemon.useItem()) return;
					for (var j=0; j<conditions.length; j++) {
						pokemon.removeVolatile(conditions[j]);
					}
					return;
				}
			}
		},
		num: 219,
		gen: 3,
		desc: "Cures holder if affected by Attract, Disable, Encore, Taunt, Torment. Single use."
	}, {
		name: "Metal Coat",
		spritenum: 286,
		fling: {
			basePower: 30
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Steel') {
				return this.chainModify(1.2);
			}
		},
		num: 233,
		gen: 2,
		desc: "Holder's Steel-type attacks have 1.2x power."
	}, {
		name: "Metal Powder",
		fling: {
			basePower: 10
		},
		spritenum: 287,
		onModifyDefPriority: 2,
		onModifyDef: function(def, pokemon) {
			if (pokemon.template.species === 'Ditto') {
				return this.chainModify(2);
			}
		},
		num: 257,
		gen: 2,
		desc: "If holder is a Ditto that hasn't Transformed, its Defense is doubled."
	}, {
		name: "Metronome",
		spritenum: 289,
		fling: {
			basePower: 30
		},
		onStart: function(pokemon) {
			pokemon.addVolatile('metronome');
		},
		effect: {
			onStart: function(pokemon) {
				this.effectData.numConsecutive = 0;
				this.effectData.lastMove = '';
			},
			onBeforeMove: function(pokemon, target, move) {
				if (pokemon.item !== 'metronome') {
					pokemon.removeVolatile('metronome');
					return;
				}
				if (this.effectData.lastMove === move.id) this.effectData.numConsecutive++;
				else this.effectData.numConsecutive = 0;
				this.effectData.lastMove = move.id;
			},
			onModifyDamage: function(damage, source, target, move) {
				var numConsecutive = this.effectData.numConsecutive > 5 ? 5 : this.effectData.numConsecutive;
				var dmgMod = [1, 1.2, 1.4, 1.6, 1.8, 2];
				return this.chainModify(dmgMod[numConsecutive]);
			}
		},
		num: 277,
		gen: 4,
		desc: "Damage of moves used on consecutive turns is increased. Max 2x after 5 turns."
	}, {
		name: "Mewtwonite X",
		spritenum: 0,
		//todo
		num: -6,
		gen: 6,
		desc: "Mega-evolves Mewtwo into Mega Mewtwo X."
	}, {
		name: "Mewtwonite Y",
		spritenum: 0,
		//todo
		num: -6,
		gen: 6,
		desc: "Mega-evolves Mewtwo into Mega Mewtwo Y."
	}, {
		name: "Micle Berry",
		spritenum: 290,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Rock"
		},
		onResidual: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/4 || (pokemon.hp <= pokemon.maxhp/2 && pokemon.ability === 'gluttony')) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			pokemon.addVolatile('micleberry');
		},
		effect: {
			duration: 2,
			onModifyMove: function(move, pokemon) {
				this.add('-enditem', pokemon, 'Micle Berry');
				pokemon.removeVolatile('micleberry');
				if (typeof move.accuracy === 'number') {
					move.accuracy *= 1.2;
				}
			}
		},
		num: 209,
		gen: 4,
		desc: "Holder's next move has 1.2x accuracy when at 1/4 max HP or less. Single use."
	}, {
		name: "Mind Plate",
		spritenum: 291,
		fling: {
			basePower: 90
		},
		onPlate: 'Psychic',
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Psychic') {
				return this.chainModify(1.2);
			}
		},
		num: 307,
		gen: 4,
		desc: "Holder's Psychic-type attacks have 1.2x power. Judgment is Psychic-type."
	}, {
		name: "Miracle Seed",
		fling: {
			basePower: 30
		},
		spritenum: 292,
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Grass') {
				return this.chainModify(1.2);
			}
		},
		num: 239,
		gen: 2,
		desc: "Holder's Grass-type attacks have 1.2x power."
	}, {
		name: "Moon Ball",
		spritenum: 294,
		num: 498,
		gen: 2,
		desc: "A Poke Ball for catching Pokemon that evolve using the Moon Stone."
	}, {
		name: "Muscle Band",
		spritenum: 297,
		fling: {
			basePower: 10
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.category === 'Physical') {
				return this.chainModify(1.1);
			}
		},
		num: 266,
		gen: 4,
		desc: "Holder's physical attacks have 1.1x power."
	}, {
		name: "Mystic Water",
		spritenum: 300,
		fling: {
			basePower: 30
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Water') {
				return this.chainModify(1.2);
			}
		},
		num: 243,
		gen: 2,
		desc: "Holder's Water-type attacks have 1.2x power."
	}, {
		name: "Nanab Berry",
		spritenum: 302,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Water"
		},
		num: 166,
		gen: 3,
		desc: "No competitive use."
	}, {
		name: "Nest Ball",
		spritenum: 303,
		num: 8,
		gen: 3,
		desc: "A Poke Ball that works especially well on weaker Pokemon in the wild."
	}, {
		name: "Net Ball",
		spritenum: 304,
		num: 6,
		gen: 3,
		desc: "A Poke Ball that works especially well on Water- and Bug-type Pokemon."
	}, {
		name: "NeverMeltIce",
		spritenum: 305,
		fling: {
			basePower: 30
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ice') {
				return this.chainModify(1.2);
			}
		},
		num: 246,
		gen: 2,
		desc: "Holder's Ice-type attacks have 1.2x power."
	}, {
		name: "Nomel Berry",
		spritenum: 306,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Dragon"
		},
		num: 178,
		gen: 3,
		desc: "No competitive use."
	}, {
		name: "Normal Gem",
		spritenum: 307,
		isGem: true,
		onSourceTryPrimaryHit: function(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Normal') {
				if (source.useItem()) {
					this.add('-enditem', source, 'Normal Gem', '[from] gem', '[move] '+move.name);
					source.addVolatile('gem');
				}
			}
		},
		num: 564,
		gen: 5,
		desc: "Holder's first successful Normal-type attack will have 1.5x power. Single use."
	}, {
		name: "Occa Berry",
		spritenum: 311,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Fire"
		},
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.type === 'Fire' && this.getEffectiveness(move.type, target) > 0 && !target.volatiles['substitute']) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return this.chainModify(0.5);
				}
			}
		},
		onEat: function() { },
		num: 184,
		gen: 4,
		desc: "Halves damage taken from a super effective Fire-type attack. Single use."
	}, {
		name: "Odd Incense",
		spritenum: 312,
		fling: {
			basePower: 10
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Psychic') {
				return this.chainModify(1.2);
			}
		},
		num: 314,
		gen: 4,
		desc: "Holder's Psychic-type attacks have 1.2x power."
	}, {
		name: "Old Amber",
		spritenum: 314,
		fling: {
			basePower: 100
		},
		num: 103,
		gen: 3,
		desc: "Can be revived into Aerodactyl."
	}, {
		name: "Oran Berry",
		spritenum: 319,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Poison"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/2) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			this.heal(10);
		},
		num: 155,
		gen: 3,
		desc: "Restores 10HP when at 1/2 max HP or less. Single use."
	}, {
		name: "Pamtre Berry",
		spritenum: 323,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Steel"
		},
		num: 180,
		gen: 3,
		desc: "No competitive use."
	}, {
		name: "Park Ball",
		spritenum: 325,
		num: 500,
		gen: 2,
		desc: "A special Poke Ball for the Pal Park."
	}, {
		name: "Passho Berry",
		spritenum: 329,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Water"
		},
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.type === 'Water' && this.getEffectiveness(move.type, target) > 0 && !target.volatiles['substitute']) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return this.chainModify(0.5);
				}
			}
		},
		onEat: function() { },
		num: 185,
		gen: 4,
		desc: "Halves damage taken from a super effective Water-type attack. Single use."
	}, {
		name: "Payapa Berry",
		spritenum: 330,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Psychic"
		},
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.type === 'Psychic' && this.getEffectiveness(move.type, target) > 0 && !target.volatiles['substitute']) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return this.chainModify(0.5);
				}
			}
		},
		onEat: function() { },
		num: 193,
		gen: 4,
		desc: "Halves damage taken from a super effective Psychic-type attack. Single use."
	}, {
		name: "Pecha Berry",
		spritenum: 333,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Electric"
		},
		onUpdate: function(pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				pokemon.cureStatus();
			}
		},
		num: 151,
		gen: 3,
		desc: "Holder is cured if it is poisoned. Single use."
	}, {
		name: "Persim Berry",
		spritenum: 334,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Ground"
		},
		onUpdate: function(pokemon) {
			if (pokemon.volatiles['confusion']) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			pokemon.removeVolatile('confusion');
		},
		num: 156,
		gen: 3,
		desc: "Holder is cured if it is confused. Single use."
	}, {
		name: "Petaya Berry",
		spritenum: 335,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Poison"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/4 || (pokemon.hp <= pokemon.maxhp/2 && pokemon.ability === 'gluttony')) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			this.boost({spa:1});
		},
		num: 204,
		gen: 3,
		desc: "Raises Sp. Atk by 1 when at 1/4 max HP or less. Single use."
	}, {
		name: "Pinap Berry",
		spritenum: 337,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Grass"
		},
		num: 168,
		gen: 3,
		desc: "No competitive use."
	}, {
		name: "Pixie Plate",
		spritenum: -6,
		fling: {
			basePower: 90
		},
		onPlate: 'Fairy',
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Fairy') {
				return this.chainModify(1.2);
			}
		},
		num: 311,
		gen: 6,
		desc: "Holder's Fairy-type attacks have 1.2x power. Judgment is Fairy-type."
	}, {
		name: "Plume Fossil",
		spritenum: 339,
		fling: {
			basePower: 100
		},
		num: 573,
		gen: 5,
		desc: "Can be revived into Archen."
	}, {
		name: "Poison Barb",
		spritenum: 343,
		fling: {
			basePower: 70,
			status: 'psn'
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Poison') {
				return this.chainModify(1.2);
			}
		},
		num: 245,
		gen: 2,
		desc: "Holder's Poison-type attacks have 1.2x power."
	}, {
		name: "Poison Gem",
		spritenum: 344,
		isGem: true,
		onSourceTryPrimaryHit: function(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Poison') {
				if (source.useItem()) {
					this.add('-enditem', source, 'Poison Gem', '[from] gem', '[move] '+move.name);
					source.addVolatile('gem');
				}
			}
		},
		num: 554,
		gen: 5,
		desc: "Holder's first successful Poison-type attack will have 1.5x power. Single use."
	}, {
		name: "Poke Ball",
		spritenum: 345,
		num: 4,
		gen: 1,
		desc: "A device for catching wild Pokemon. It is designed as a capsule system."
	}, {
		name: "Pomeg Berry",
		spritenum: 351,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Ice"
		},
		num: 169,
		gen: 3,
		desc: "No competitive use."
	}, {
		onChargeMove: function(pokemon, target, move) {
			if (pokemon.useItem()) {
				this.debug('power herb - remove charge turn for '+move.id);
				return false; // skip charge turn
			}
		},
		name: "Power Herb",
		spritenum: 358,
		fling: {
			basePower: 10
		},
		num: 271,
		gen: 4,
		desc: "Holder's two-turn moves complete in one turn (except Sky Drop). Single use."
	}, {
		name: "Premier Ball",
		spritenum: 363,
		num: 12,
		gen: 3,
		desc: "A rare Poke Ball that has been crafted to commemorate an event."
	}, {
		name: "Psychic Gem",
		spritenum: 369,
		isGem: true,
		onSourceTryPrimaryHit: function(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Psychic') {
				if (source.useItem()) {
					this.add('-enditem', source, 'Psychic Gem', '[from] gem', '[move] '+move.name);
					source.addVolatile('gem');
				}
			}
		},
		num: 557,
		gen: 5,
		desc: "Holder's first successful Psychic-type attack will have 1.5x power. Single use."
	}, {
		name: "Qualot Berry",
		spritenum: 371,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Poison"
		},
		num: 171,
		gen: 3,
		desc: "No competitive use."
	}, {
		name: "Quick Ball",
		spritenum: 372,
		num: 15,
		gen: 4,
		desc: "A Poke Ball that provides a better catch rate at the start of a wild encounter."
	}, {
		onModifyPriority: function(priority, pokemon) {
			if (this.random(5) === 0) {
				this.add('-activate', pokemon, 'item: Quick Claw');
				return priority + 0.1;
			}
		},
		name: "Quick Claw",
		spritenum: 373,
		fling: {
			basePower: 80
		},
		num: 217,
		gen: 2,
		desc: "Each turn, holder has a 20% chance to move first in its priority bracket."
	}, {
		name: "Quick Powder",
		spritenum: 374,
		fling: {
			basePower: 10
		},
		onModifySpe: function(speMod, pokemon) {
			if (pokemon.template.species === 'Ditto') {
				return this.chain(speMod, 2);
			}
		},
		num: 274,
		gen: 4,
		desc: "If holder is a Ditto that hasn't Transformed, its Speed is doubled."
	}, {
		name: "Rabuta Berry",
		spritenum: 375,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Ghost"
		},
		num: 177,
		gen: 3,
		desc: "No competitive use."
	}, {
		name: "Rare Bone",
		spritenum: 379,
		fling: {
			basePower: 100
		},
		num: 106,
		gen: 4,
		desc: "No competitive use."
	}, {
		name: "Rawst Berry",
		spritenum: 381,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Grass"
		},
		onUpdate: function(pokemon) {
			if (pokemon.status === 'brn') {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			if (pokemon.status === 'brn') {
				pokemon.cureStatus();
			}
		},
		num: 152,
		gen: 3,
		desc: "Holder is cured if it is burned. Single use."
	}, {
		name: "Razor Claw",
		spritenum: 382,
		fling: {
			basePower: 80
		},
		onModifyMove: function(move) {
			move.critRatio++;
		},
		num: 326,
		gen: 4,
		desc: "Holder's critical hit ratio is boosted by 1."
	}, {
		name: "Razor Fang",
		spritenum: 383,
		fling: {
			basePower: 30,
			volatileStatus: 'flinch'
		},
		onModifyMove: function(move) {
			if (move.category !== "Status") {
				if (!move.secondaries) move.secondaries = [];
				for (var i=0; i<move.secondaries.length; i++) {
					if (move.secondaries[i].volatileStatus === 'flinch') return;
				}
				move.secondaries.push({
					chance: 10,
					volatileStatus: 'flinch'
				});
			}
		},
		num: 327,
		gen: 4,
		desc: "Holder's attacks without a chance to flinch gain a 10% chance to flinch."
	}, {
		name: "Razz Berry",
		spritenum: 384,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Steel"
		},
		num: 164,
		gen: 3,
		desc: "No competitive use."
	}, {
		name: "Red Card",
		spritenum: 387,
		fling: {
			basePower: 10
		},
		onAfterMoveSecondary: function(target, source, move) {
			if (source && source !== target && source.hp && target.hp && move && move.category !== 'Status') {
				if (!source.isActive) return;
				if (target.useItem(null, source)) { // This order is correct - the item is used up even against a pokemon with Ingrain or that otherwise can't be forced out
					if (this.runEvent('DragOut', source, target, move)) {
						this.dragIn(source.side, source.position);
					}
				}
			}
		},
		num: 542,
		gen: 5,
		desc: "If holder is hit, it forces the attacker to switch to a random ally. Single use."
	}, {
		name: "Repeat Ball",
		spritenum: 401,
		num: 9,
		gen: 3,
		desc: "A Poke Ball that works well on Pokemon species that were previously caught."
	}, {
		name: "Rindo Berry",
		spritenum: 409,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Grass"
		},
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.type === 'Grass' && this.getEffectiveness(move.type, target) > 0 && !target.volatiles['substitute']) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return this.chainModify(0.5);
				}
			}
		},
		onEat: function() { },
		num: 187,
		gen: 4,
		desc: "Halves damage taken from a super effective Grass-type attack. Single use."
	}, {
		name: "Ring Target",
		spritenum: 410,
		fling: {
			basePower: 10
		},
		onModifyPokemon: function(pokemon) {
			pokemon.negateImmunity['Type'] = true;
		},
		num: 543,
		gen: 5,
		desc: "Holder's type immunities granted by its own typing are negated."
	}, {
		name: "Rock Gem",
		spritenum: 415,
		isGem: true,
		onSourceTryPrimaryHit: function(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Rock') {
				if (source.useItem()) {
					this.add('-enditem', source, 'Rock Gem', '[from] gem', '[move] '+move.name);
					source.addVolatile('gem');
				}
			}
		},
		num: 559,
		gen: 5,
		desc: "Holder's first successful Rock-type attack will have 1.5x power. Single use."
	}, {
		name: "Rock Incense",
		spritenum: 416,
		fling: {
			basePower: 10
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Rock') {
				return this.chainModify(1.2);
			}
		},
		num: 315,
		gen: 4,
		desc: "Holder's Rock-type attacks have 1.2x power."
	}, {
		name: "Rocky Helmet",
		spritenum: 417,
		fling: {
			basePower: 60
		},
		onAfterDamageOrder: 2,
		onAfterDamage: function(damage, target, source, move) {
			if (source && source !== target && move && move.isContact) {
				this.damage(source.maxhp/6, source, target);
			}
		},
		num: 540,
		gen: 5,
		desc: "If holder is hit by a contact move, the attacker loses 1/6 of its max HP."
	}, {
		name: "Root Fossil",
		spritenum: 418,
		fling: {
			basePower: 100
		},
		num: 99,
		gen: 3,
		desc: "Can be revived into Lileep."
	}, {
		name: "Rose Incense",
		spritenum: 419,
		fling: {
			basePower: 10
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Grass') {
				return this.chainModify(1.2);
			}
		},
		num: 318,
		gen: 4,
		desc: "Holder's Grass-type attacks have 1.2x power."
	}, {
		name: "Rowap Berry",
		spritenum: 420,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Dark"
		},
		onAfterMoveSecondary: function(target, source, move) {
			if (source && source !== target && move && move.category === 'Special') {
				if (target.eatItem()) {
					this.damage(source.maxhp/8, source, target);
				}
			}
		},
		onEat: function() { },
		num: 212,
		gen: 4,
		desc: "If holder is hit by a special move, attacker loses 1/8 of its max HP. Single use."
	}, {
		name: "Safari Ball",
		spritenum: 425,
		num: 5,
		gen: 1,
		desc: "A special Poke Ball that is used only in the Safari Zone and Great Marsh."
	}, {
		name: "Salac Berry",
		spritenum: 426,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Fighting"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/4 || (pokemon.hp <= pokemon.maxhp/2 && pokemon.ability === 'gluttony')) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			this.boost({spe:1});
		},
		num: 203,
		gen: 3,
		desc: "Raises Speed by 1 when at 1/4 max HP or less. Single use."
	}, {
		name: "Scope Lens",
		spritenum: 429,
		fling: {
			basePower: 30
		},
		onModifyMove: function(move) {
			move.critRatio++;
		},
		num: 232,
		gen: 2,
		desc: "Holder's critical hit ratio is boosted by 1."
	}, {
		name: "Sea Incense",
		spritenum: 430,
		fling: {
			basePower: 10
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Water') {
				return this.chainModify(1.2);
			}
		},
		num: 254,
		gen: 3,
		desc: "Holder's Water-type attacks have 1.2x power."
	}, {
		name: "Sharp Beak",
		spritenum: 436,
		fling: {
			basePower: 50
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Flying') {
				return this.chainModify(1.2);
			}
		},
		num: 244,
		gen: 2,
		desc: "Holder's Flying-type attacks have 1.2x power."
	}, {
		name: "Shed Shell",
		spritenum: 437,
		fling: {
			basePower: 10
		},
		onModifyPokemonPriority: -10,
		onModifyPokemon: function(pokemon) {
			pokemon.trapped = pokemon.maybeTrapped = false;
		},
		num: 295,
		gen: 4,
		desc: "Holder may switch out even when trapped by another Pokemon."
	}, {
		name: "Shell Bell",
		spritenum: 438,
		fling: {
			basePower: 30
		},
		onAfterMoveSelf: function(source, target) {
			if (source.lastDamage > 0) {
				this.heal(source.lastDamage/8, source);
			}
		},
		num: 253,
		gen: 3,
		desc: "After an attack, holder gains 1/8 of the damage in HP dealt to other Pokemon."
	}, {
		name: "Shock Drive",
		spritenum: 442,
		fling: {
			basePower: 70
		},
		onDrive: 'Electric',
		num: 117,
		gen: 5,
		desc: "Holder's Techno Blast is Electric-type."
	}, {
		name: "Shuca Berry",
		spritenum: 443,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Ground"
		},
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.type === 'Ground' && this.getEffectiveness(move.type, target) > 0 && !target.volatiles['substitute']) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return this.chainModify(0.5);
				}
			}
		},
		onEat: function() { },
		num: 191,
		gen: 4,
		desc: "Halves damage taken from a super effective Ground-type attack. Single use."
	}, {
		name: "Silk Scarf",
		spritenum: 444,
		fling: {
			basePower: 10
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Normal') {
				return this.chainModify(1.2);
			}
		},
		num: 251,
		gen: 3,
		desc: "Holder's Normal-type attacks have 1.2x power."
	}, {
		name: "SilverPowder",
		spritenum: 447,
		fling: {
			basePower: 10
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Bug') {
				return this.chainModify(1.2);
			}
		},
		num: 222,
		gen: 2,
		desc: "Holder's Bug-type attacks have 1.2x power."
	}, {
		name: "Sitrus Berry",
		spritenum: 448,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Psychic"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/2) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			this.heal(pokemon.maxhp/4);
		},
		num: 158,
		gen: 3,
		desc: "Restores 1/4 max HP when at 1/2 max HP or less. Single use."
	}, {
		name: "Skull Fossil",
		spritenum: 449,
		fling: {
			basePower: 100
		},
		num: 105,
		gen: 4,
		desc: "Can be revived into Cranidos."
	}, {
		name: "Sky Plate",
		spritenum: 450,
		fling: {
			basePower: 90
		},
		onPlate: 'Flying',
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Flying') {
				return this.chainModify(1.2);
			}
		},
		num: 306,
		gen: 4,
		desc: "Holder's Flying-type attacks have 1.2x power. Judgment is Flying-type."
	}, {
		name: "Smooth Rock",
		spritenum: 453,
		fling: {
			basePower: 10
		},
		num: 283,
		gen: 4,
		desc: "Holder's use of Sandstorm lasts 8 turns instead of 5."
	}, {
		name: "Soft Sand",
		spritenum: 456,
		fling: {
			basePower: 10
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ground') {
				return this.chainModify(1.2);
			}
		},
		num: 237,
		gen: 2,
		desc: "Holder's Ground-type attacks have 1.2x power."
	}, {
		name: "Soul Dew",
		spritenum: 459,
		fling: {
			basePower: 30
		},
		onModifySpAPriority: 1,
		onModifySpA: function(spa, pokemon) {
			if (pokemon.baseTemplate.species === 'Latios' || pokemon.baseTemplate.species === 'Latias') {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 2,
		onModifySpD: function(spd, pokemon) {
			if (pokemon.baseTemplate.species === 'Latios' || pokemon.baseTemplate.species === 'Latias') {
				return this.chainModify(1.5);
			}
		},
		num: 225,
		gen: 3,
		desc: "If holder is a Latias or a Latios, its Sp. Atk and Sp. Def are 1.5x."
	}, {
		name: "Spell Tag",
		spritenum: 461,
		fling: {
			basePower: 30
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ghost') {
				return this.chainModify(1.2);
			}
		},
		num: 247,
		gen: 2,
		desc: "Holder's Ghost-type attacks have 1.2x power."
	}, {
		name: "Spelon Berry",
		spritenum: 462,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Dark"
		},
		num: 179,
		gen: 3,
		desc: "No competitive use."
	}, {
		name: "Splash Plate",
		spritenum: 463,
		fling: {
			basePower: 90
		},
		onPlate: 'Water',
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Water') {
				return this.chainModify(1.2);
			}
		},
		num: 299,
		gen: 4,
		desc: "Holder's Water-type attacks have 1.2x power. Judgment is Water-type."
	}, {
		name: "Spooky Plate",
		spritenum: 464,
		fling: {
			basePower: 90
		},
		onPlate: 'Ghost',
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ghost') {
				return this.chainModify(1.2);
			}
		},
		num: 310,
		gen: 4,
		desc: "Holder's Ghost-type attacks have 1.2x power. Judgment is Ghost-type."
	}, {
		name: "Sport Ball",
		spritenum: 465,
		num: 499,
		gen: 4,
		desc: "A special Poke Ball for the Bug-Catching Contest."
	}, {
		name: "Starf Berry",
		spritenum: 472,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Psychic"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/4 || (pokemon.hp <= pokemon.maxhp/2 && pokemon.ability === 'gluttony')) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			var stats = [];
			for (var i in pokemon.boosts) {
				if (i !== 'accuracy' && i !== 'evasion' && pokemon.boosts[i] < 6) {
					stats.push(i);
				}
			}
			if (stats.length) {
				var i = stats[this.random(stats.length)];
				var boost = {};
				boost[i] = 2;
				this.boost(boost);
			}
		},
		num: 207,
		gen: 3,
		desc: "Raises a random stat by 2 when at 1/4 max HP or less (not acc/eva). Single use."
	}, {
		name: "Steel Gem",
		spritenum: 473,
		isGem: true,
		onSourceTryPrimaryHit: function(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Steel') {
				if (source.useItem()) {
					this.add('-enditem', source, 'Steel Gem', '[from] gem', '[move] '+move.name);
					source.addVolatile('gem');
				}
			}
		},
		num: 563,
		gen: 5,
		desc: "Holder's first successful Steel-type attack will have 1.5x power. Single use."
	}, {
		name: "Stick",
		fling: {
			basePower: 60
		},
		spritenum: 475,
		onModifyMove: function(move, user) {
			if (user.baseTemplate.species === 'Farfetch\'d') {
				move.critRatio += 2;
			}
		},
		num: 259,
		gen: 2,
		desc: "If holder is a Farfetch'd, its critical hit ratio is boosted by 2."
	}, {
		name: "Sticky Barb",
		spritenum: 476,
		fling: {
			basePower: 80
		},
		onResidualOrder: 26,
		onResidualSubOrder: 2,
		onResidual: function(pokemon) {
			this.damage(pokemon.maxhp/8);
		},
		onHit: function(target, source, move) {
			if (source && source !== target && !source.item && move && move.isContact) {
				var barb = target.takeItem();
				source.setItem(barb);
				// no message for Sticky Barb changing hands
			}
		},
		num: 288,
		gen: 4,
		desc: "Each turn, holder loses 1/8 max HP. An attacker making contact can receive it."
	}, {
		name: "Stone Plate",
		spritenum: 477,
		fling: {
			basePower: 90
		},
		onPlate: 'Rock',
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Rock') {
				return this.chainModify(1.2);
			}
		},
		num: 309,
		gen: 4,
		desc: "Holder's Rock-type attacks have 1.2x power. Judgment is Rock-type."
	}, {
		name: "Tamato Berry",
		spritenum: 486,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Psychic"
		},
		num: 174,
		gen: 3,
		desc: "No competitive use."
	}, {
		name: "Tanga Berry",
		spritenum: 487,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Bug"
		},
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.type === 'Bug' && this.getEffectiveness(move.type, target) > 0 && !target.volatiles['substitute']) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return this.chainModify(0.5);
				}
			}
		},
		onEat: function() { },
		num: 194,
		gen: 4,
		desc: "Halves damage taken from a super effective Bug-type attack. Single use."
	}, {
		name: "Thick Club",
		spritenum: 491,
		fling: {
			basePower: 90
		},
		onModifyAtkPriority: 1,
		onModifyAtk: function(atk, pokemon) {
			if (pokemon.baseTemplate.species === 'Cubone' || pokemon.baseTemplate.species === 'Marowak') {
				return this.chainModify(2);
			}
		},
		num: 258,
		gen: 2,
		desc: "If holder is a Cubone or a Marowak, its Attack is doubled."
	}, {
		name: "Timer Ball",
		spritenum: 494,
		num: 10,
		gen: 3,
		desc: "A Poke Ball that becomes better the more turns there are in a battle."
	}, {
		name: "Toxic Orb",
		spritenum: 515,
		fling: {
			basePower: 30,
			status: 'tox'
		},
		onResidualOrder: 26,
		onResidualSubOrder: 2,
		onResidual: function(pokemon) {
			if (!pokemon.status && !pokemon.hasType('Poison') && !pokemon.hasType('Steel') && pokemon.ability !== 'immunity') {
				this.add('-activate', pokemon, 'item: Toxic Orb');
				pokemon.trySetStatus('tox');
			}
		},
		num: 272,
		gen: 4,
		desc: "At the end of every turn, this item attempts to badly poison the holder."
	}, {
		name: "Toxic Plate",
		spritenum: 516,
		fling: {
			basePower: 90
		},
		onPlate: 'Poison',
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Poison') {
				return this.chainModify(1.2);
			}
		},
		num: 304,
		gen: 4,
		desc: "Holder's Poison-type attacks have 1.2x power. Judgment is Poison-type."
	}, {
		name: "TwistedSpoon",
		spritenum: 520,
		fling: {
			basePower: 30
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Psychic') {
				return this.chainModify(1.2);
			}
		},
		num: 248,
		gen: 2,
		desc: "Holder's Psychic-type attacks have 1.2x power."
	}, {
		name: "Ultra Ball",
		spritenum: 521,
		num: 2,
		gen: 1,
		desc: "An ultra-performance Ball that provides a higher catch rate than a Great Ball."
	}, {
		name: "Wacan Berry",
		spritenum: 526,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Electric"
		},
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.type === 'Electric' && this.getEffectiveness(move.type, target) > 0 && !target.volatiles['substitute']) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return this.chainModify(0.5);
				}
			}
		},
		onEat: function() { },
		num: 186,
		gen: 4,
		desc: "Halves damage taken from a super effective Electric-type attack. Single use."
	}, {
		name: "Water Gem",
		spritenum: 528,
		isGem: true,
		onSourceTryPrimaryHit: function(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Water') {
				if (source.useItem()) {
					this.add('-enditem', source, 'Water Gem', '[from] gem', '[move] '+move.name);
					source.addVolatile('gem');
				}
			}
		},
		num: 549,
		gen: 5,
		desc: "Holder's first successful Water-type attack will have 1.5x power. Single use."
	}, {
		name: "Watmel Berry",
		spritenum: 530,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Fire"
		},
		num: 181,
		gen: 3,
		desc: "No competitive use."
	}, {
		name: "Wave Incense",
		spritenum: 531,
		fling: {
			basePower: 10
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Water') {
				return this.chainModify(1.2);
			}
		},
		num: 317,
		gen: 4,
		desc: "Holder's Water-type attacks have 1.2x power."
	}, {
		name: "Wepear Berry",
		spritenum: 533,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Electric"
		},
		num: 167,
		gen: 3,
		desc: "No competitive use."
	}, {
		name: "White Herb",
		spritenum: 535,
		fling: {
			basePower: 10,
			effect: function(pokemon) {
				var activate = false;
				var boosts = {};
				for (var i in pokemon.boosts) {
					if (pokemon.boosts[i] < 0) {
						activate = true;
						boosts[i] = 0;
					}
				}
				if (activate) {
					pokemon.setBoost(boosts);
				}
			}
		},
		onUpdate: function(pokemon) {
			var activate = false;
			var boosts = {};
			for (var i in pokemon.boosts) {
				if (pokemon.boosts[i] < 0) {
					activate = true;
					boosts[i] = 0;
				}
			}
			if (activate && pokemon.useItem()) {
				pokemon.setBoost(boosts);
				this.add('-restoreboost', pokemon, '[silent]');
			}
		},
		num: 214,
		gen: 3,
		desc: "Restores all lowered stat stages to 0 when one is less than 0. Single use."
	}, {
		name: "Wide Lens",
		spritenum: 537,
		fling: {
			basePower: 10
		},
		onModifyMove: function(move) {
			if (typeof move.accuracy === 'number') {
				move.accuracy *= 1.1;
			}
		},
		num: 265,
		gen: 4,
		desc: "The accuracy of attacks by the holder is 1.1x."
	}, {
		name: "Wiki Berry",
		spritenum: 538,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Rock"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/2) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			this.heal(pokemon.maxhp/8);
			if (pokemon.getNature().minus === 'spa') {
				pokemon.addVolatile('confusion');
			}
		},
		num: 160,
		gen: 3,
		desc: "Restores 1/8 max HP when at 1/2 max HP or less. May confuse. Single use."
	}, {
		name: "Wise Glasses",
		spritenum: 539,
		fling: {
			basePower: 10
		},
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.category === 'Special') {
				return this.chainModify(1.1);
			}
		},
		num: 267,
		gen: 4,
		desc: "Holder's special attacks have 1.1x power."
	}, {
		name: "Yache Berry",
		spritenum: 567,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Ice"
		},
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.type === 'Ice' && this.getEffectiveness(move.type, target) > 0 && !target.volatiles['substitute']) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return this.chainModify(0.5);
				}
			}
		},
		onEat: function() { },
		num: 188,
		gen: 4,
		desc: "Halves damage taken from a super effective Ice-type attack. Single use."
	}, {
		name: "Zap Plate",
		spritenum: 572,
		fling: {
			basePower: 90
		},
		onPlate: 'Electric',
		onBasePowerPriority: 6,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Electric') {
				return this.chainModify(1.2);
			}
		},
		num: 300,
		gen: 4,
		desc: "Holder's Electric-type attacks have 1.2x power. Judgment is Electric-type."
	}, {
		name: "Zoom Lens",
		spritenum: 574,
		fling: {
			basePower: 10
		},
		onModifyMove: function(move, user, target) {
			if (typeof move.accuracy === 'number' && !this.willMove(target)) {
				this.debug('Zoom Lens boosting accuracy');
				move.accuracy *= 1.2;
			}
		},
		num: 276,
		gen: 4,
		desc: "The accuracy of attacks by the holder is 1.2x if it moves after the target."
	}
];
