exports.BattleItems = {
	"AbsorbBulb": {
		id: "AbsorbBulb",
		name: "Absorb Bulb",
		spritenum: 2,
		fling: {
			basePower: 30
		},
		onAfterDamage: function(damage, target, source, move) {
			if (move.type === 'Water' && target.useItem())
			{
				this.boost({spa: 1});
			}
		},
		desc: "Boosts Special Attack of holder if hit by a Water-type attack. One-time use."
	},
	"AdamantOrb": {
		id: "AdamantOrb",
		name: "Adamant Orb",
		spritenum: 4,
		fling: {
			basePower: 60
		},
		onBasePower: function(basePower, user, target, move) {
			if (move && user.template.species === 'Dialga' && (move.type === 'Steel' || move.type === 'Dragon'))
			{
				return basePower * 1.2;
			}
		},
		desc: "Hold item which raises power of Dialga's STAB moves 20%."
	},
	"AguavBerry": {
		id: "AguavBerry",
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
			pokemon.heal(pokemon.maxhp/8);
			if (pokemon.getNature().minus === 'spd') {
				pokemon.addVolatile('confusion');
			}
		},
		desc: "Restores 1\/8 max HP when at 50% HP or less. May confuse. One-time use."
	},
	"AirBalloon": {
		id: "AirBalloon",
		name: "Air Balloon",
		spritenum: 6,
		desc: "Makes the holder immune to Ground-type attacks. Disappears when holder is hit.",
		fling: {
			basePower: 10
		},
		onStart: function(target) {
			this.add('r-volatile '+target.id+' balloon');
		},
		onImmunity: function(type) {
			if (type === 'Ground') return false;
		},
		onAfterDamage: function(damage, target, source, effect) {
			this.debug('effect: '+effect.id);
			if (effect.effectType === 'Move')
			{
				this.add('r-volatile '+target.id+' balloon end');
				target.setItem('');
			}
		},
		onAfterSubDamage: function(damage, target, source, effect) {
			this.debug('effect: '+effect.id);
			if (effect.effectType === 'Move')
			{
				this.add('r-volatile '+target.id+' balloon end');
				target.setItem('');
			}
		}
	},
	"ApicotBerry": {
		id: "ApicotBerry",
		name: "Apicot Berry",
		spritenum: 10,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Ground"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/4|| (pokemon.hp <= pokemon.maxhp/2 && pokemon.ability === 'Gluttony')) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			this.boost({spd:1});
		},
		desc: "Raises Special Defense by one stage when at 25% HP or less. Unobtainable in BW. One-time use."
	},
	"ArmorFossil": {
		id: "ArmorFossil",
		name: "Armor Fossil",
		spritenum: 12,
		fling: {
			basePower: 100
		},
		desc: "Can be revived into Shieldon."
	},
	"AspearBerry": {
		id: "AspearBerry",
		name: "Aspear Berry",
		spritenum: 13,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Ice"
		},
		onUpdate: function(pokemon) {
			if (pokemon.status === 'frz')
			{
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			if (pokemon.status === 'frz')
			{
				pokemon.cureStatus();
			}
		},
		desc: "Cures freeze. One-time use."
	},
	"BabiriBerry": {
		id: "BabiriBerry",
		name: "Babiri Berry",
		spritenum: 17,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Steel"
		},
		onSourceBasePower: function(basePower, user, target, move) {
			if (move.type === 'Steel' && this.getEffectiveness(move.type, target) > 0) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return basePower * 0.5;
				}
			}
		},
		onEat: function() { },
		desc: "Reduces damage from a super effective Steel-type attack by 50%. Consumed after use."
	},
	"BelueBerry": {
		id: "BelueBerry",
		name: "Belue Berry",
		spritenum: 21,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Electric"
		},
		desc: "No use. Unobtainable in BW."
	},
	"BerryJuice": {
		id: "BerryJuice",
		name: "Berry Juice",
		spritenum: 22,
		fling: {
			basePower: 30
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/2) {
				if (pokemon.useItem()) {
					pokemon.heal(20);
				}
			}
		},
		desc: "Restores 20 HP when at 50% HP or less. One-time use."
	},
	"BigRoot": {
		id: "BigRoot",
		name: "Big Root",
		spritenum: 29,
		fling: {
			basePower: 10
		},
		desc: "Increases HP gained from draining moves by 30%."
	},
	"BindingBand": {
		id: "BindingBand",
		name: "Binding Band",
		spritenum: 31,
		fling: {
			basePower: 30
		},
		desc: "Increases power of multi-turn trapping moves."
	},
	"BlackBelt": {
		id: "BlackBelt",
		name: "Black Belt",
		spritenum: 32,
		fling: {
			basePower: 30
		},
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Fighting')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Fighting-type moves 20%."
	},
	"BlackSludge": {
		id: "BlackSludge",
		name: "Black Sludge",
		spritenum: 34,
		fling: {
			basePower: 30
		},
		onResidualPriority: 50-5.2,
		onResidual: function(pokemon) {
			if (pokemon.hasType('Poison'))
			{
				this.heal(pokemon.maxhp/16);
			}
			else
			{
				this.damage(pokemon.maxhp/8);
			}
		},
		desc: "Recovers 1\/16 HP each turn for Poison types. Damages all other types."
	},
	"BlackGlasses": {
		id: "BlackGlasses",
		name: "BlackGlasses",
		spritenum: 35,
		fling: {
			basePower: 30
		},
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Dark')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Dark-type moves 20%."
	},
	"BlukBerry": {
		id: "BlukBerry",
		name: "Bluk Berry",
		spritenum: 44,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Fire"
		},
		desc: "No use. Unobtainable in BW."
	},
	"BrightPowder": {
		id: "BrightPowder",
		name: "BrightPowder",
		spritenum: 51,
		fling: {
			basePower: 10
		},
		onSourceModifyMove: function(move) {
			if (typeof move.accuracy !== 'number') return;
			this.debug('brightpowder - decreasing accuracy');
			move.accuracy *= 0.9;
		},
		desc: "Raises evasion 10%."
	},
	"BugGem": {
		id: "BugGem",
		name: "Bug Gem",
		spritenum: 53,
		isGem: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Bug')
			{
				if (user.useItem())
				{
					this.debug('gem activate: +50% boost');
					return basePower * 1.5;
				}
			}
		},
		desc: "Raises the power of a Bug-type move by 50%. One-time use."
	},
	"BurnDrive": {
		id: "BurnDrive",
		name: "Burn Drive",
		spritenum: 54,
		fling: {
			basePower: 70
		},
		onDrive: 'Fire',
		desc: "Changes the type of Techno Blast to Fire."
	},
	"CellBattery": {
		id: "CellBattery",
		name: "Cell Battery",
		spritenum: 60,
		fling: {
			basePower: 30
		},
		onAfterDamage: function(damage, target, source, move) {
			if (move.type === 'Electric' && target.useItem())
			{
				this.boost({atk: 1});
			}
		},
		desc: "Boosts Attack of holder if hit by an Electric-type attack. One-time use."
	},
	"Charcoal": {
		id: "Charcoal",
		name: "Charcoal",
		spritenum: 61,
		fling: {
			basePower: 30
		},
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Fire')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Fire-type moves 20%."
	},
	"ChartiBerry": {
		id: "ChartiBerry",
		name: "Charti Berry",
		spritenum: 62,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Rock"
		},
		onSourceBasePower: function(basePower, user, target, move) {
			if (move.type === 'Rock' && this.getEffectiveness(move.type, target) > 0) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return basePower * 0.5;
				}
			}
		},
		onEat: function() { },
		desc: "Reduces damage from a super effective Rock-type attack by 50%. Consumed after use."
	},
	"CheriBerry": {
		id: "CheriBerry",
		name: "Cheri Berry",
		spritenum: 63,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Fire"
		},
		onUpdate: function(pokemon) {
			if (pokemon.status === 'par')
			{
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			if (pokemon.status === 'par')
			{
				pokemon.cureStatus();
			}
		},
		desc: "Cures paralysis. One-time use."
	},
	"ChestoBerry": {
		id: "ChestoBerry",
		name: "Chesto Berry",
		spritenum: 65,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Water"
		},
		onUpdate: function(pokemon) {
			if (pokemon.status === 'slp')
			{
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			if (pokemon.status === 'slp')
			{
				pokemon.cureStatus();
			}
		},
		desc: "Cures sleep. One-time use."
	},
	"ChilanBerry": {
		id: "ChilanBerry",
		name: "Chilan Berry",
		spritenum: 66,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Normal"
		},
		onSourceBasePower: function(basePower, user, target, move) {
			if (move.type === 'Normal') {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return basePower * 0.5;
				}
			}
		},
		onEat: function() { },
		desc: "Reduces damage from a Normal-type attack by 50%. Consumed after use."
	},
	"ChillDrive": {
		id: "ChillDrive",
		name: "Chill Drive",
		spritenum: 67,
		fling: {
			basePower: 70
		},
		onDrive: 'Ice',
		desc: "Changes the type of Techno Blast to Ice."
	},
	"ChoiceBand": {
		id: "ChoiceBand",
		name: "Choice Band",
		spritenum: 68,
		fling: {
			basePower: 10
		},
		onStart: function(pokemon) {
			if (pokemon.volatiles['choicelock'])
			{
				this.debug('removing choicelock: '+pokemon.volatiles.choicelock);
			}
			pokemon.removeVolatile('choicelock');
		},
		onModifyMove: function(move, pokemon) {
			pokemon.addVolatile('choicelock');
		},
		onModifyStats: function(stats) {
			stats.atk *= 1.5;
		},
		isChoice: true,
		desc: "Hold item which raises Attack 50%, but locks holder into one move."
	},
	"ChoiceScarf": {
		id: "ChoiceScarf",
		name: "Choice Scarf",
		spritenum: 69,
		fling: {
			basePower: 10
		},
		onStart: function(pokemon) {
			if (pokemon.volatiles['choicelock'])
			{
				this.debug('removing choicelock: '+pokemon.volatiles.choicelock);
			}
			pokemon.removeVolatile('choicelock');
		},
		onModifyMove: function(move, pokemon) {
			pokemon.addVolatile('choicelock');
		},
		onModifyStats: function(stats) {
			stats.spe *= 1.5;
		},
		isChoice: true,
		desc: "Hold item which raises Speed 50%, but locks holder into one move."
	},
	"ChoiceSpecs": {
		id: "ChoiceSpecs",
		name: "Choice Specs",
		spritenum: 70,
		fling: {
			basePower: 10
		},
		onStart: function(pokemon) {
			if (pokemon.volatiles['choicelock'])
			{
				this.debug('removing choicelock: '+pokemon.volatiles.choicelock);
			}
			pokemon.removeVolatile('choicelock');
		},
		onModifyMove: function(move, pokemon) {
			pokemon.addVolatile('choicelock');
		},
		onModifyStats: function(stats) {
			stats.spa *= 1.5;
		},
		isChoice: true,
		desc: "Hold item which raises Special Attack 50%, but locks holder into one move."
	},
	"ChopleBerry": {
		id: "ChopleBerry",
		name: "Chople Berry",
		spritenum: 71,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Fighting"
		},
		onSourceBasePower: function(basePower, user, target, move) {
			if (move.type === 'Fighting' && this.getEffectiveness(move.type, target) > 0) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return basePower * 0.5;
				}
			}
		},
		onEat: function() { },
		desc: "Reduces damage from a super effective Fighting-type attack by 50%. Consumed after use."
	},
	"ClawFossil": {
		id: "ClawFossil",
		name: "Claw Fossil",
		spritenum: 72,
		fling: {
			basePower: 100
		},
		desc: "Can be revived into Anorith."
	},
	"CobaBerry": {
		id: "CobaBerry",
		name: "Coba Berry",
		spritenum: 76,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Flying"
		},
		onSourceBasePower: function(basePower, user, target, move) {
			if (move.type === 'Flying' && this.getEffectiveness(move.type, target) > 0) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return basePower * 0.5;
				}
			}
		},
		onEat: function() { },
		desc: "Reduces damage from a super effective Flying-type attack by 50%. Consumed after use."
	},
	"ColburBerry": {
		id: "ColburBerry",
		name: "Colbur Berry",
		spritenum: 78,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Dark"
		},
		onSourceBasePower: function(basePower, user, target, move) {
			if (move.type === 'Dark' && this.getEffectiveness(move.type, target) > 0) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return basePower * 0.5;
				}
			}
		},
		onEat: function() { },
		desc: "Reduces damage from a super effective Dark-type attack by 50%. Consumed after use."
	},
	"CornnBerry": {
		id: "CornnBerry",
		name: "Cornn Berry",
		spritenum: 81,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Bug"
		},
		desc: "No use. Unobtainable in BW."
	},
	"CoverFossil": {
		id: "CoverFossil",
		name: "Cover Fossil",
		spritenum: 85,
		fling: {
			basePower: 100
		},
		desc: "Can be revived into Tirtouga."
	},
	"CustapBerry": {
		id: "CustapBerry",
		name: "Custap Berry",
		spritenum: 86,
		/* onBeforeTurn: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/4 || (pokemon.hp <= pokemon.maxhp/2 && pokemon.ability === 'Gluttony'))
			{
				var decision = this.willMove(pokemon);
				if (!decision) return;
				this.addQueue({
					choice: 'event',
					event: 'Custap',
					priority: decision.priority + .1,
					pokemon: decision.pokemon,
					move: decision.move,
					target: decision.target
				});
			}
		},
		onCustap: function(pokemon) {
			var decision = this.willMove(pokemon);
			this.debug('custap decision: '+decision);
			if (decision)
			{
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			var decision = this.willMove(pokemon);
			this.debug('custap eaten: '+decision);
			if (decision)
			{
				this.cancelDecision(pokemon);
				this.add('r-custap '+pokemon.id);
				this.runDecision(decision);
			}
		}, */
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Ghost"
		},
		onResidual: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/4 || (pokemon.hp <= pokemon.maxhp/2 && pokemon.ability === 'Gluttony'))
			{
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			pokemon.addVolatile('CustapBerry');
		},
		effect: {
			duration: 2,
			onModifyPriority: function(priority, pokemon) {
				this.add('r-custap '+pokemon.id);
				pokemon.removeVolatile('CustapBerry');
				return priority + 0.1;
			}
		},
		desc: "Activates at 25% HP. Next move used goes first. Unobtainable in BW. One-time use."
	},
	"DampRock": {
		id: "DampRock",
		name: "Damp Rock",
		spritenum: 88,
		fling: {
			basePower: 60
		},
		desc: "Rain Dance lasts 8 turns."
	},
	"DarkGem": {
		id: "DarkGem",
		name: "Dark Gem",
		spritenum: 89,
		isGem: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Dark')
			{
				if (user.useItem())
				{
					this.debug('gem activate: +50% boost');
					return basePower * 1.5;
				}
			}
		},
		desc: "Raises the power of a Dark-type move by 50%. One-time use."
	},
	"DeepSeaScale": {
		id: "DeepSeaScale",
		name: "DeepSeaScale",
		spritenum: 93,
		fling: {
			basePower: 30
		},
		onModifyStats: function(stats, pokemon) {
			if (pokemon.template.species === 'Clamperl')
			{
				stats.spd *= 2;
			}
		},
		desc: "Doubles Clamperl's Special Defence. Evolves Clamperl into Gorebyss."
	},
	"DeepSeaTooth": {
		id: "DeepSeaTooth",
		name: "DeepSeaTooth",
		spritenum: 94,
		fling: {
			basePower: 90
		},
		onModifyStats: function(stats, pokemon) {
			if (pokemon.template.species === 'Clamperl')
			{
				stats.spa *= 2;
			}
		},
		desc: "Doubles Clamperl's Special Attack. Evolves Clamperl into Huntail."
	},
	"DestinyKnot": {
		id: "DestinyKnot",
		name: "Destiny Knot",
		spritenum: 95,
		fling: {
			basePower: 10
		},
		desc: "If the holder becomes infatuated, so does the enemy."
	},
	"DomeFossil": {
		id: "DomeFossil",
		name: "Dome Fossil",
		spritenum: 102,
		fling: {
			basePower: 100
		},
		desc: "Can be revived into Kabuto."
	},
	"DouseDrive": {
		id: "DouseDrive",
		name: "Douse Drive",
		spritenum: 103,
		fling: {
			basePower: 70
		},
		onDrive: 'Water',
		desc: "Changes the type of Techno Blast to Water."
	},
	"DracoPlate": {
		id: "DracoPlate",
		name: "Draco Plate",
		spritenum: 105,
		fling: {
			basePower: 90
		},
		onPlate: 'Dragon',
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Dragon')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Dragon-type moves 20%. Pokemon with Multitype become Dragon-type."
	},
	"DragonFang": {
		id: "DragonFang",
		name: "Dragon Fang",
		spritenum: 106,
		fling: {
			basePower: 70
		},
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Dragon')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Dragon-type moves 20%."
	},
	"DragonGem": {
		id: "DragonGem",
		name: "Dragon Gem",
		spritenum: 107,
		isGem: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Dragon')
			{
				if (user.useItem())
				{
					this.debug('gem activate: +50% boost');
					return basePower * 1.5;
				}
			}
		},
		desc: "Raises the power of a Dragon-type move by 50%. One-time use."
	},
	"DreadPlate": {
		id: "DreadPlate",
		name: "Dread Plate",
		spritenum: 110,
		fling: {
			basePower: 90
		},
		onPlate: 'Dark',
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Dark')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of the holder's Dark-type moves 20%. Pokemon with Multitype become Dark-type."
	},
	"DurinBerry": {
		id: "DurinBerry",
		name: "Durin Berry",
		spritenum: 114,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Water"
		},
		desc: "No use. Unobtainable in BW."
	},
	"EarthPlate": {
		id: "EarthPlate",
		name: "Earth Plate",
		spritenum: 117,
		fling: {
			basePower: 90
		},
		onPlate: 'Ground',
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Ground')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Ground-type moves 20%. Pokemon with Multitype become Ground-type."
	},
	"EjectButton": {
		id: "EjectButton",
		name: "Eject Button",
		spritenum: 118,
		fling: {
			basePower: 30
		},
		onAfterMoveSecondary: function(target, source, move) {
			if (source && source !== target && move && move.category !== 'Status')
			{
				if (target.useItem())
				{
					this.add("message "+target.name+" is switched out with the Eject Button! (placeholder)");
					target.switchFlag = true;
				}
			}
		},
		desc: "When the holder is hit, it immediately switches out. One-time use."
	},
	"Electirizer": {
		id: "Electirizer",
		name: "Electirizer",
		spritenum: 119,
		fling: {
			basePower: 80
		},
		desc: "Evolves Electabuzz into Electivire."
	},
	"ElectricGem": {
		id: "ElectricGem",
		name: "Electric Gem",
		spritenum: 120,
		isGem: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Electric')
			{
				if (user.useItem())
				{
					this.debug('gem activate: +50% boost');
					return basePower * 1.5;
				}
			}
		},
		desc: "Raises the power of a Electric-type move by 50%. One-time use."
	},
	"EnergyPowder": {
		id: "EnergyPowder",
		name: "EnergyPowder",
		spritenum: 123,
		fling: {
			basePower: 30
		},
		desc: "Restores 50 HP to one Pokemon but tastes bitter."
	},
	"EnigmaBerry": {
		id: "EnigmaBerry",
		name: "Enigma Berry",
		spritenum: 124,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Bug"
		},
		onSourceBasePower: function(basePower, user, target, move) {
			if (move && this.getEffectiveness(move.type, target) >= 2)
			{
				target.addVolatile('EnigmaBerry');
			}
		},
		effect: {
			duration: 1,
			onUpdate: function(target) {
				if (target.eatItem())
				{
					target.removeVolatile('EnigmaBerry');
				}
			}
		},
		onEat: function(pokemon) {
			pokemon.heal(pokemon.maxhp/4);
		},
		desc: "Heals 25% HP after being hit by a super effective attack. One-time use."
	},
	"Eviolite": {
		id: "Eviolite",
		name: "Eviolite",
		spritenum: 130,
		fling: {
			basePower: 40
		},
		onModifyStats: function(stats, pokemon) {
			if (pokemon.template.nfe)
			{
				stats.def *= 1.5;
				stats.spd *= 1.5;
			}
		},
		desc: "Boosts Defense and Special Defense of holder by 50% if it is an NFE Pokemon."
	},
	"ExpertBelt": {
		id: "ExpertBelt",
		name: "Expert Belt",
		spritenum: 132,
		fling: {
			basePower: 10
		},
		onBasePower: function(basePower, user, target, move) {
			if (move && this.getEffectiveness(move.type, target) > 0)
			{
				return basePower * 1.2;
			}
		},
		desc: "Super effective attacks are 20% stronger."
	},
	"FightingGem": {
		id: "FightingGem",
		name: "Fighting Gem",
		spritenum: 139,
		isGem: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Fighting')
			{
				if (user.useItem())
				{
					this.debug('gem activate: +50% boost');
					return basePower * 1.5;
				}
			}
		},
		desc: "Raises the power of a Fighting-type move by 50%. One-time use."
	},
	"FigyBerry": {
		id: "FigyBerry",
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
			pokemon.heal(pokemon.maxhp/8);
			if (pokemon.getNature().minus === 'atk') {
				pokemon.addVolatile('confusion');
			}
		},
		desc: "Restores 1\/8 max HP when at 50% HP or less. May confuse. One-time use."
	},
	"FireGem": {
		id: "FireGem",
		name: "Fire Gem",
		spritenum: 141,
		isGem: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Fire')
			{
				if (user.useItem())
				{
					this.debug('gem activate: +50% boost');
					return basePower * 1.5;
				}
			}
		},
		desc: "Raises the power of a Fire-type move by 50%. One-time use."
	},
	"FistPlate": {
		id: "FistPlate",
		name: "Fist Plate",
		spritenum: 143,
		fling: {
			basePower: 90
		},
		onPlate: 'Fighting',
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Fighting')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Fighting-type moves 20%. Pokemon with Multitype become Fighting-type."
	},
	"FlameOrb": {
		id: "FlameOrb",
		name: "Flame Orb",
		spritenum: 145,
		fling: {
			basePower: 30,
			status: 'brn'
		},
		onResidualPriority: -26.2,
		onResidual: function(pokemon) {
			if (!pokemon.status)
			{
				this.add('residual '+pokemon.id+' item-activate FlameOrb');
				pokemon.trySetStatus('brn');
			}
		},
		desc: "Burns the holder."
	},
	"FlamePlate": {
		id: "FlamePlate",
		name: "Flame Plate",
		spritenum: 146,
		fling: {
			basePower: 90
		},
		onPlate: 'Fire',
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Fire')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Fire-type moves 20%. Pokemon with Multitype become Fire-type."
	},
	"FloatStone": {
		id: "FloatStone",
		name: "Float Stone",
		spritenum: 147,
		fling: {
			basePower: 30
		},
		onModifyPokemon: function(pokemon) {
			pokemon.weightkg /= 2;
		},
		desc: "The weight of the holder is halved."
	},
	"FlyingGem": {
		id: "FlyingGem",
		name: "Flying Gem",
		spritenum: 149,
		isGem: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Flying')
			{
				if (user.useItem())
				{
					this.debug('gem activate: +50% boost');
					return basePower * 1.5;
				}
			}
		},
		desc: "Raises the power of a Flying-type move by 50%. One-time use."
	},
	"FocusBand": {
		id: "FocusBand",
		name: "Focus Band",
		spritenum: 150,
		fling: {
			basePower: 10
		},
		onDamage: function(damage, target, source, effect) {
			if (Math.random()*10 < 1 && damage >= target.hp && effect && effect.effectType === 'Move')
			{
				this.add("message "+target.name+" held on using its Focus Band! (placeholder)");
				return target.hp - 1;
			}
		},
		desc: "Gives a 10% chance of surviving a hit with at least 1 HP."
	},
	"FocusSash": {
		id: "FocusSash",
		name: "Focus Sash",
		spritenum: 151,
		fling: {
			basePower: 10
		},
		onDamage: function(damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move')
			{
				if (target.useItem())
				{
					return target.hp - 1;
				}
			}
		},
		desc: "The holder always survives one attack at full HP. One-time use."
	},
	"FullIncense": {
		id: "FullIncense",
		name: "Full Incense",
		spritenum: 155,
		fling: {
			basePower: 10
		},
		desc: "Makes the holder move last. Allows breeding of Munchlax."
	},
	"GanlonBerry": {
		id: "GanlonBerry",
		name: "Ganlon Berry",
		spritenum: 158,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Ice"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/4 || (pokemon.hp <= pokemon.maxhp/2 && pokemon.ability === 'Gluttony')) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			this.boost({def:1});
		},
		desc: "Raises Defense by one stage when at 25% HP or less. Unobtainable in BW. One-time use."
	},
	"GhostGem": {
		id: "GhostGem",
		name: "Ghost Gem",
		spritenum: 161,
		isGem: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ghost')
			{
				if (user.useItem())
				{
					this.debug('gem activate: +50% boost');
					return basePower * 1.5;
				}
			}
		},
		desc: "Raises the power of a Ghost-type move by 50%. One-time use."
	},
	"GrassGem": {
		id: "GrassGem",
		name: "Grass Gem",
		spritenum: 172,
		isGem: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Grass')
			{
				if (user.useItem())
				{
					this.debug('gem activate: +50% boost');
					return basePower * 1.5;
				}
			}
		},
		desc: "Raises the power of a Grass-type move by 50%. One-time use."
	},
	"GrepaBerry": {
		id: "GrepaBerry",
		name: "Grepa Berry",
		spritenum: 178,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Flying"
		},
		desc: "Increases happiness, but lowers Special Defense EVs by 10."
	},
	"GripClaw": {
		id: "GripClaw",
		name: "Grip Claw",
		spritenum: 179,
		fling: {
			basePower: 90
		},
		desc: "Partial trapping moves last 5 turns."
	},
	"GriseousOrb": {
		id: "GriseousOrb",
		name: "Griseous Orb",
		spritenum: 180,
		fling: {
			basePower: 60
		},
		onBasePower: function(basePower, user, target, move) {
			if (user.template.species === 'Giratina' && (move.type === 'Ghost' || move.type === 'Dragon'))
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises the Base Power of Giratina's STAB moves 20% and transforms Giratina into Giratina-O when held. Cannot be removed or given to Giratina in battle."
	},
	"GroundGem": {
		id: "GroundGem",
		name: "Ground Gem",
		spritenum: 182,
		isGem: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ground')
			{
				if (user.useItem())
				{
					this.debug('gem activate: +50% boost');
					return basePower * 1.5;
				}
			}
		},
		desc: "Raises the power of a Ground-type move by 50%. One-time use."
	},
	"HabanBerry": {
		id: "HabanBerry",
		name: "Haban Berry",
		spritenum: 185,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Dragon"
		},
		onSourceBasePower: function(basePower, user, target, move) {
			if (move.type === 'Dragon' && this.getEffectiveness(move.type, target) > 0) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return basePower * 0.5;
				}
			}
		},
		onEat: function() { },
		desc: "Reduces damage from a super effective Dragon-type attack by 50%. Consumed after use."
	},
	"HardStone": {
		id: "HardStone",
		name: "Hard Stone",
		spritenum: 187,
		fling: {
			basePower: 100
		},
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Rock')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Rock-type moves 20%."
	},
	"HeatRock": {
		id: "HeatRock",
		name: "Heat Rock",
		spritenum: 193,
		fling: {
			basePower: 60
		},
		desc: "Sunny Day lasts 8 turns."
	},
	"HelixFossil": {
		id: "HelixFossil",
		name: "Helix Fossil",
		spritenum: 195,
		fling: {
			basePower: 100
		},
		desc: "Can be revived into Omanyte."
	},
	"HondewBerry": {
		id: "HondewBerry",
		name: "Hondew Berry",
		spritenum: 213,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Ground"
		},
		desc: "Increases happiness, but lowers Special Attack EVs by 10."
	},
	"IapapaBerry": {
		id: "IapapaBerry",
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
			pokemon.heal(pokemon.maxhp/8);
			if (pokemon.getNature().minus === 'def') {
				pokemon.addVolatile('confusion');
			}
		},
		desc: "Restores 1\/8 max HP when at 50% HP or less. May confuse. One-time use."
	},
	"IceGem": {
		id: "IceGem",
		name: "Ice Gem",
		spritenum: 218,
		isGem: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ice')
			{
				if (user.useItem())
				{
					this.debug('gem activate: +50% boost');
					return basePower * 1.5;
				}
			}
		},
		desc: "Raises the power of a Ice-type move by 50%. One-time use."
	},
	"IciclePlate": {
		id: "IciclePlate",
		name: "Icicle Plate",
		spritenum: 220,
		fling: {
			basePower: 90
		},
		onPlate: 'Ice',
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ice')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Ice-type moves 20%. Pokemon with Multitype become Ice-type."
	},
	"IcyRock": {
		id: "IcyRock",
		name: "Icy Rock",
		spritenum: 221,
		fling: {
			basePower: 40
		},
		desc: "Hail lasts 8 turns."
	},
	"InsectPlate": {
		id: "InsectPlate",
		name: "Insect Plate",
		spritenum: 223,
		fling: {
			basePower: 90
		},
		onPlate: 'Bug',
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Bug')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Bug-type moves 20%. Pokemon with Multitype become Bug-type."
	},
	"IronBall": {
		id: "IronBall",
		name: "Iron Ball",
		spritenum: 224,
		fling: {
			basePower: 130
		},
		onModifyPokemon: function(pokemon) {
			pokemon.negateImmunity['Ground'] = true;
		},
		onModifyStats: function(stats, pokemon) {
			stats.spe /= 2;
		},
		desc: "Reduces Speed 50% and removes holder's Ground-type immunity."
	},
	"IronPlate": {
		id: "IronPlate",
		name: "Iron Plate",
		spritenum: 225,
		fling: {
			basePower: 90
		},
		onPlate: 'Steel',
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Steel')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Steel-type moves 20%. Pokemon with Multitype become Steel-type."
	},
	"JabocaBerry": {
		id: "JabocaBerry",
		name: "Jaboca Berry",
		spritenum: 230,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Dragon"
		},
		onAfterMoveSecondary: function(target, source, move) {
			if (source && source !== target && move && move.category === 'Physical')
			{
				if (target.eatItem())
				{
					this.damage(source.maxhp/8, source, target);
				}
			}
		},
		onEat: function() { },
		desc: "If hit by a physical attack, the attacker takes 12.5% damage. Unobtainable in BW. One-time use."
	},
	"KasibBerry": {
		id: "KasibBerry",
		name: "Kasib Berry",
		spritenum: 233,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Ghost"
		},
		onSourceBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ghost' && this.getEffectiveness(move.type, target) > 0) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return basePower * 0.5;
				}
			}
		},
		onEat: function() { },
		desc: "Reduces damage from a super effective Ghost-type attack by 50%. Consumed after use."
	},
	"KebiaBerry": {
		id: "KebiaBerry",
		name: "Kebia Berry",
		spritenum: 234,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Poison"
		},
		onSourceBasePower: function(basePower, user, target, move) {
			if (move.type === 'Poison' && this.getEffectiveness(move.type, target) > 0) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return basePower * 0.5;
				}
			}
		},
		onEat: function() { },
		desc: "Reduces damage from a super effective Poison-type attack by 50%. Consumed after use."
	},
	"KelpsyBerry": {
		id: "KelpsyBerry",
		name: "Kelpsy Berry",
		spritenum: 235,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Fighting"
		},
		desc: "Increases happiness, but lowers Attack EVs by 10."
	},
	"King'sRock": {
		id: "King'sRock",
		name: "King's Rock",
		spritenum: 236,
		fling: {
			basePower: 30,
			volatileStatus: 'flinch'
		},
		desc: "Certain moves have a 10% flinch rate."
	},
	"LaggingTail": {
		id: "LaggingTail",
		name: "Lagging Tail",
		spritenum: 237,
		fling: {
			basePower: 10
		},
		desc: "The holder will go last within its move's priority bracket, regardless of Speed."
	},
	"LansatBerry": {
		id: "LansatBerry",
		name: "Lansat Berry",
		spritenum: 238,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Flying"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/4 || (pokemon.hp <= pokemon.maxhp/2 && pokemon.ability === 'Gluttony')) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			pokemon.addVolatile('FocusEnergy');
		},
		desc: "Raises critical hit rate by two stages when at 25% HP or less. One-time use."
	},
	"LaxIncense": {
		id: "LaxIncense",
		name: "Lax Incense",
		spritenum: 240,
		fling: {
			basePower: 10
		},
		onSourceModifyMove: function(move) {
			if (typeof move.accuracy !== 'number') return;
			this.debug('Lax Incense - decreasing accuracy');
			move.accuracy *= 0.95;
		},
		desc: "Hold item which raises evasion 5%. Allows breeding of Wynaut."
	},
	"Leftovers": {
		id: "Leftovers",
		name: "Leftovers",
		spritenum: 242,
		fling: {
			basePower: 10
		},
		onResidualPriority: 50-5.2,
		onResidual: function(pokemon) {
			this.heal(pokemon.maxhp/16);
		},
		desc: "Heals 1\/16 HP each turn."
	},
	"LeppaBerry": {
		id: "LeppaBerry",
		name: "Leppa Berry",
		spritenum: 244,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Fighting"
		},
		onUpdate: function(pokemon) {
			var move = pokemon.getMoveData(pokemon.lastMove);
			if (move && move.pp === 0)
			{
				pokemon.addVolatile('LeppaBerry');
				pokemon.volatiles['LeppaBerry'].move = move;
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			var move;
			if (pokemon.volatiles['LeppaBerry'])
			{
				move = pokemon.volatiles['LeppaBerry'].move;
				pokemon.removeVolatile('LeppaBerry');
			}
			else
			{
				var pp = 99;
				for (var i in pokemon.moveset)
				{
					if (pokemon.moveset[i].pp < pp) {
						move = pokemon.moveset[i];
						pp = move.pp;
					}
				}
			}
			move.pp += 10;
			if (move.pp > move.maxpp) move.pp = move.maxpp;
			this.add("message "+pokemon.name+" restored "+move.move+"'s PP using its Leppa Berry! (placeholder)");
		},
		desc: "Restores 10 PP to a move that has run out of PP. One-time use."
	},
	"LiechiBerry": {
		id: "LiechiBerry",
		name: "Liechi Berry",
		spritenum: 248,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Grass"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/4 || (pokemon.hp <= pokemon.maxhp/2 && pokemon.ability === 'Gluttony')) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			this.boost({atk:1});
		},
		desc: "Raises Attack by one stage when at 25% HP or less. Unobtainable in BW. One-time use."
	},
	"LifeOrb": {
		id: "LifeOrb",
		name: "Life Orb",
		spritenum: 249,
		fling: {
			basePower: 30
		},
		onBasePower: function(basePower, user) {
			this.debug('LO boost');
			user.addVolatile('LifeOrb');
			return basePower * 1.3;
		},
		effect: {
			duration: 1,
			onAfterMoveSecondarySelf: function(source, target, move) {
				if (move && move.effectType === 'Move' && source && source.volatiles['LifeOrb'])
				{
					this.damage(source.maxhp/10, source, source, this.getItem('LifeOrb'));
					source.removeVolatile('LifeOrb');
				}
			}
		},
		desc: "\"Boosts power by 30%, user takes 10% recoil each turn it attacks.\""
	},
	"LightBall": {
		id: "LightBall",
		name: "Light Ball",
		spritenum: 251,
		fling: {
			basePower: 30,
			status: 'par'
		},
		onModifyStats: function(stats, pokemon) {
			if (pokemon.template.species === 'Pikachu')
			{
				stats.atk *= 2;
				stats.spa *= 2;
			}
		},
		desc: "Doubles Pikachu's Attack and Special Attack."
	},
	"LightClay": {
		id: "LightClay",
		name: "Light Clay",
		spritenum: 252,
		fling: {
			basePower: 30
		},
		// implemented in the corresponding thing
		desc: "If the holder uses either Light Screen or Reflect, the two moves will stay on the field for eight turns instead of five."
	},
	"LuckyPunch": {
		id: "LuckyPunch",
		name: "Lucky Punch",
		spritenum: 261,
		fling: {
			basePower: 40
		},
		onModifyMove: function(move, user) {
			if (user.template.species === 'Chansey') {
				move.critRatio += 2;
			}
		},
		desc: "Raises Chansey's critical hit ratio two stages."
	},
	"LumBerry": {
		id: "LumBerry",
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
		desc: "Cures status. Consumed after use."
	},
	"LustrousOrb": {
		id: "LustrousOrb",
		name: "Lustrous Orb",
		spritenum: 265,
		fling: {
			basePower: 60
		},
		onBasePower: function(basePower, user, target, move) {
			if (move && user.template.species === 'Palkia' && (move.type === 'Water' || move.type === 'Dragon'))
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Palkia's STAB moves 20%."
	},
	"MachoBrace": {
		id: "MachoBrace",
		name: "Macho Brace",
		spritenum: 269,
		fling: {
			basePower: 60
		},
		onModifyStats: function(stats, pokemon) {
			stats.spe /= 2;
		},
		desc: "Reduces Speed 50%. Doubles EVs gained."
	},
	"Magnet": {
		id: "Magnet",
		name: "Magnet",
		spritenum: 273,
		fling: {
			basePower: 30
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Electric')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Electric-type moves 20%."
	},
	"MagoBerry": {
		id: "MagoBerry",
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
			pokemon.heal(pokemon.maxhp/8);
			if (pokemon.getNature().minus === 'spe') {
				pokemon.addVolatile('confusion');
			}
		},
		desc: "Restores 1\/8 max HP when at 50% HP or less. May confuse. One-time use."
	},
	"MagostBerry": {
		id: "MagostBerry",
		name: "Magost Berry",
		spritenum: 275,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Rock"
		},
		desc: "No use. Unobtainable in BW."
	},
	"MeadowPlate": {
		id: "MeadowPlate",
		name: "Meadow Plate",
		spritenum: 282,
		fling: {
			basePower: 90
		},
		onPlate: 'Grass',
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Grass')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Grass-type moves 20%. Pokemon with Multitype become Grass-type."
	},
	"MentalHerb": {
		id: "MentalHerb",
		name: "Mental Herb",
		spritenum: 285,
		fling: {
			basePower: 10,
			effect: function(pokemon) {
				var conditions = ['Attract','Taunt','Encore','Torment','Disable'];
				for (var i=0; i<conditions.length; i++)
				{
					if (pokemon.volatiles[conditions[i]])
					{
						for (var j=0; j<conditions.length; j++)
						{
							pokemon.removeVolatile(conditions[j]);
						}
						return;
					}
				}
			}
		},
		onUpdate: function(pokemon) {
			var conditions = ['Attract','Taunt','Encore','Torment','Disable'];
			for (var i=0; i<conditions.length; i++)
			{
				if (pokemon.volatiles[conditions[i]])
				{
					if (!pokemon.useItem()) return;
					for (var j=0; j<conditions.length; j++)
					{
						pokemon.removeVolatile(conditions[j]);
					}
					return;
				}
			}
		},
		desc: "Cures certain conditions. One-time use."
	},
	"MetalCoat": {
		id: "MetalCoat",
		name: "Metal Coat",
		spritenum: 286,
		fling: {
			basePower: 30
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Steel')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Steel-type moves 20%. Evolves Onix and Scyther."
	},
	"MetalPowder": {
		id: "MetalPowder",
		name: "Metal Powder",
		fling: {
			basePower: 10
		},
		spritenum: 287,
		onModifyStats: function(stats, pokemon) {
			if (pokemon.template.species === 'Ditto')
			{
				stats.def *= 1.5;
				stats.spd *= 1.5;
			}
		},
		desc: "Raises Ditto's Defense and Special Defense by 50%."
	},
	"Metronome": {
		id: "Metronome",
		name: "Metronome",
		spritenum: 289,
		fling: {
			basePower: 30
		},
		desc: "Boost the power of attacks used consecutively."
	},
	"MicleBerry": {
		id: "MicleBerry",
		name: "Micle Berry",
		spritenum: 290,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Rock"
		},
		desc: "Activates at 25% HP. Next move used will always hit. Unobtainable in BW. One-time use."
	},
	"MindPlate": {
		id: "MindPlate",
		name: "Mind Plate",
		spritenum: 291,
		fling: {
			basePower: 90
		},
		onPlate: 'Psychic',
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Psychic')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Psychic-type moves 20%. Pokemon with Multitype become Psychic-type."
	},
	"MiracleSeed": {
		id: "MiracleSeed",
		name: "Miracle Seed",
		fling: {
			basePower: 30
		},
		spritenum: 292,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Grass')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Grass-type moves 20%."
	},
	"MuscleBand": {
		id: "MuscleBand",
		name: "Muscle Band",
		spritenum: 297,
		fling: {
			basePower: 10
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.category === 'Physical')
			{
				return basePower * 1.1;
			}
		},
		desc: "Raises power of physical moves 10%."
	},
	"MysticWater": {
		id: "MysticWater",
		name: "Mystic Water",
		spritenum: 300,
		fling: {
			basePower: 30
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Water')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Water-type moves 20%."
	},
	"NanabBerry": {
		id: "NanabBerry",
		name: "Nanab Berry",
		spritenum: 302,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Water"
		},
		desc: "No use. Unobtainable in BW."
	},
	"NeverMeltIce": {
		id: "NeverMeltIce",
		name: "NeverMeltIce",
		spritenum: 305,
		fling: {
			basePower: 30
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ice')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Ice-type moves 20%."
	},
	"NomelBerry": {
		id: "NomelBerry",
		name: "Nomel Berry",
		spritenum: 306,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Dragon"
		},
		desc: "No use. Unobtainable in BW."
	},
	"NormalGem": {
		id: "NormalGem",
		name: "Normal Gem",
		spritenum: 307,
		isGem: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Normal')
			{
				if (user.useItem())
				{
					this.debug('gem activate: +50% boost');
					return basePower * 1.5;
				}
			}
		},
		desc: "Raises the power of a Normal-type move by 50%. One-time use."
	},
	"OccaBerry": {
		id: "OccaBerry",
		name: "Occa Berry",
		spritenum: 311,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Fire"
		},
		onSourceBasePower: function(basePower, user, target, move) {
			if (move.type === 'Fire' && this.getEffectiveness(move.type, target) > 0) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return basePower * 0.5;
				}
			}
		},
		onEat: function() { },
		desc: "Reduces damage from a super effective Fire-type attack by 50%. Consumed after use."
	},
	"OddIncense": {
		id: "OddIncense",
		name: "Odd Incense",
		spritenum: 312,
		fling: {
			basePower: 10
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Psychic')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Psychic-type moves 20%. Allows breeding of Mime Jr."
	},
	"OldAmber": {
		id: "OldAmber",
		name: "Old Amber",
		spritenum: 314,
		fling: {
			basePower: 100
		},
		desc: "Can be revived into Aerodactyl."
	},
	"OranBerry": {
		id: "OranBerry",
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
			pokemon.heal(10);
		},
		desc: "Restores 10 HP when at 50% HP or less. One-time use."
	},
	"PamtreBerry": {
		id: "PamtreBerry",
		name: "Pamtre Berry",
		spritenum: 323,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Steel"
		},
		desc: "No use. Unobtainable in BW."
	},
	"PasshoBerry": {
		id: "PasshoBerry",
		name: "Passho Berry",
		spritenum: 329,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Water"
		},
		onSourceBasePower: function(basePower, user, target, move) {
			if (move.type === 'Water' && this.getEffectiveness(move.type, target) > 0) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return basePower * 0.5;
				}
			}
		},
		onEat: function() { },
		desc: "Reduces damage from a super effective Water-type attack by 50%. Consumed after use."
	},
	"PayapaBerry": {
		id: "PayapaBerry",
		name: "Payapa Berry",
		spritenum: 330,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Psychic"
		},
		onSourceBasePower: function(basePower, user, target, move) {
			if (move.type === 'Psychic' && this.getEffectiveness(move.type, target) > 0) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return basePower * 0.5;
				}
			}
		},
		onEat: function() { },
		desc: "Reduces damage from a super effective Psychic-type attack by 50%. Consumed after use."
	},
	"PechaBerry": {
		id: "PechaBerry",
		name: "Pecha Berry",
		spritenum: 333,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Electric"
		},
		onUpdate: function(pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox')
			{
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox')
			{
				pokemon.cureStatus();
			}
		},
		desc: "Cures poison. One-time use."
	},
	"PersimBerry": {
		id: "PersimBerry",
		name: "Persim Berry",
		spritenum: 334,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Ground"
		},
		onUpdate: function(pokemon) {
			if (pokemon.volatiles['confusion'])
			{
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			pokemon.removeVolatile('confusion');
		},
		desc: "Cures confusion. One-time use."
	},
	"PetayaBerry": {
		id: "PetayaBerry",
		name: "Petaya Berry",
		spritenum: 335,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Poison"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/4 || (pokemon.hp <= pokemon.maxhp/2 && pokemon.ability === 'Gluttony')) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			this.boost({spa:1});
		},
		desc: "Raises Special Attack by one stage when at 25% HP or less. Unobtainable in BW. One-time use."
	},
	"PinapBerry": {
		id: "PinapBerry",
		name: "Pinap Berry",
		spritenum: 337,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Grass"
		},
		desc: "No use. Unobtainable in BW."
	},
	"PlumeFossil": {
		id: "PlumeFossil",
		name: "Plume Fossil",
		spritenum: 339,
		fling: {
			basePower: 100
		},
		desc: "Can be revived into Archen."
	},
	"PoisonBarb": {
		id: "PoisonBarb",
		name: "Poison Barb",
		spritenum: 343,
		fling: {
			basePower: 70,
			status: 'psn'
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Poison')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Poison-type moves 20%."
	},
	"PoisonGem": {
		id: "PoisonGem",
		name: "Poison Gem",
		spritenum: 344,
		isGem: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Poison')
			{
				if (user.useItem())
				{
					this.debug('gem activate: +50% boost');
					return basePower * 1.5;
				}
			}
		},
		desc: "Raises the power of a Poison-type move by 50%. One-time use."
	},
	"PomegBerry": {
		id: "PomegBerry",
		name: "Pomeg Berry",
		spritenum: 351,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Ice"
		},
		desc: "Increases happiness, but lowers HP EVs by 10."
	},
	"PowerHerb": {
		id: "PowerHerb",
		onBeforeMovePriority: -10,
		onBeforeMove: function(pokemon, target, move) {
			if (move.isTwoTurnMove && pokemon.useItem())
			{
				this.debug('power herb - remove charge turn for '+move.id);
				this.add('prepare-move '+pokemon.id+' '+move.id);
				pokemon.addVolatile(move.id);
			}
		},
		name: "Power Herb",
		spritenum: 358,
		fling: {
			basePower: 10
		},
		desc: "Moves with a charge turn activate instantly."
	},
	"PsychicGem": {
		id: "PsychicGem",
		name: "Psychic Gem",
		spritenum: 369,
		isGem: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Psychic')
			{
				if (user.useItem())
				{
					this.debug('gem activate: +50% boost');
					return basePower * 1.5;
				}
			}
		},
		desc: "Raises the power of a Psychic-type move by 50%. One-time use."
	},
	"QualotBerry": {
		id: "QualotBerry",
		name: "Qualot Berry",
		spritenum: 371,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Poison"
		},
		desc: "Increases happiness, but lowers Defense EVs by 10."
	},
	"QuickClaw": {
		id: "QuickClaw",
		name: "Quick Claw",
		spritenum: 373,
		fling: {
			basePower: 80
		},
		desc: "Gives the user a 20% chance to go first."
	},
	"QuickPowder": {
		id: "QuickPowder",
		name: "Quick Powder",
		spritenum: 374,
		fling: {
			basePower: 10
		},
		onModifyStats: function(stats, pokemon) {
			if (pokemon.template.species === 'Ditto')
			{
				stats.spe *= 2;
			}
		},
		desc: "Doubles Ditto's Speed."
	},
	"RabutaBerry": {
		id: "RabutaBerry",
		name: "Rabuta Berry",
		spritenum: 375,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Ghost"
		},
		desc: "No use. Unobtainable in BW."
	},
	"RareBone": {
		id: "RareBone",
		name: "Rare Bone",
		spritenum: 379,
		fling: {
			basePower: 100
		},
		desc: "Can be Flung for 100 BP."
	},
	"RawstBerry": {
		id: "RawstBerry",
		name: "Rawst Berry",
		spritenum: 381,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Grass"
		},
		onUpdate: function(pokemon) {
			if (pokemon.status === 'brn')
			{
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			if (pokemon.status === 'brn')
			{
				pokemon.cureStatus();
			}
		},
		desc: "Cures burn. One-time use."
	},
	"RazorClaw": {
		id: "RazorClaw",
		name: "Razor Claw",
		spritenum: 382,
		fling: {
			basePower: 80
		},
		onModifyMove: function(move) {
			move.critRatio++;
		},
		desc: "Raises critical hit rate one stage. Evolves Sneasel into Weavile."
	},
	"RazorFang": {
		id: "RazorFang",
		name: "Razor Fang",
		spritenum: 383,
		fling: {
			basePower: 30,
			volatileStatus: 'flinch'
		},
		desc: "Certain moves have a 10% flinch rate. Evolves Gligar into Gliscor."
	},
	"RazzBerry": {
		id: "RazzBerry",
		name: "Razz Berry",
		spritenum: 384,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Steel"
		},
		desc: "No use. Unobtainable in BW."
	},
	"RedCard": {
		id: "RedCard",
		name: "Red Card",
		spritenum: 387,
		fling: {
			basePower: 10
		},
		onAfterMoveSecondary: function(target, source, move) {
			if (source && source !== target && move && move.category !== 'Status')
			{
				if (target.useItem()) // This order is correct - the item is used up even against a pokemon with Ingrain or that otherwise can't be forced out
				{
					if (this.runEvent('DragOut', source, target, move))
					{
						this.add("message "+target.name+" held up its Red Card against "+source.name+"! (placeholder)");
						this.dragIn(source.side);
					}
				}
			}
		},
		desc: "The opponent is forced out immediately if it attacks the holder. One-time use."
	},
	"RindoBerry": {
		id: "RindoBerry",
		name: "Rindo Berry",
		spritenum: 409,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Grass"
		},
		onSourceBasePower: function(basePower, user, target, move) {
			if (move.type === 'Grass' && this.getEffectiveness(move.type, target) > 0) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return basePower * 0.5;
				}
			}
		},
		onEat: function() { },
		desc: "Reduces damage from a super effective Grass-type attack by 50%."
	},
	"RockGem": {
		id: "RockGem",
		name: "Rock Gem",
		spritenum: 415,
		isGem: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Rock')
			{
				if (user.useItem())
				{
					this.debug('gem activate: +50% boost');
					return basePower * 1.5;
				}
			}
		},
		desc: "Raises the power of a Rock-type move by 50%. One-time use."
	},
	"RockIncense": {
		id: "RockIncense",
		name: "Rock Incense",
		spritenum: 416,
		fling: {
			basePower: 10
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Rock')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Rock-type moves 20%. Allows breeding of Bonsly."
	},
	"RockyHelmet": {
		id: "RockyHelmet",
		name: "Rocky Helmet",
		spritenum: 417,
		fling: {
			basePower: 60
		},
		onAfterDamage: function(damage, target, source, move) {
			if (source && source !== target && move && move.isContact)
			{
				this.damage(source.maxhp/6, source, target);
			}
		},
		desc: "Deals 1\/6 damage when the opponent makes contact."
	},
	"RootFossil": {
		id: "RootFossil",
		name: "Root Fossil",
		spritenum: 418,
		fling: {
			basePower: 100
		},
		desc: "Can be revived into Lileep."
	},
	"RoseIncense": {
		id: "RoseIncense",
		name: "Rose Incense",
		spritenum: 419,
		fling: {
			basePower: 10
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Grass')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Grass-type moves 20%. Allows breeding of Budew."
	},
	"RowapBerry": {
		id: "RowapBerry",
		name: "Rowap Berry",
		spritenum: 420,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Dark"
		},
		onAfterMoveSecondary: function(target, source, move) {
			if (source && source !== target && move && move.category === 'Special')
			{
				if (target.eatItem())
				{
					this.damage(source.maxhp/8, source, target);
				}
			}
		},
		onEat: function() { },
		desc: "If hit by a special attack, the attacker takes 12.5% damage. Unobtainable in BW. One-time use."
	},
	"SalacBerry": {
		id: "SalacBerry",
		name: "Salac Berry",
		spritenum: 426,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Fighting"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/4 || (pokemon.hp <= pokemon.maxhp/2 && pokemon.ability === 'Gluttony')) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			this.boost({spe:1});
		},
		desc: "Raises Speed by one stage when at 25% HP or less. Unobtainable in BW. One-time use."
	},
	"ScopeLens": {
		id: "ScopeLens",
		name: "Scope Lens",
		spritenum: 429,
		fling: {
			basePower: 30
		},
		onModifyMove: function(move) {
			move.critRatio++;
		},
		desc: "Raises critical hit rate one stage."
	},
	"SeaIncense": {
		id: "SeaIncense",
		name: "Sea Incense",
		spritenum: 430,
		fling: {
			basePower: 10
		},
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Water')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Water-type moves 20%. Allows breeding of Azurill."
	},
	"SharpBeak": {
		id: "SharpBeak",
		name: "Sharp Beak",
		spritenum: 436,
		fling: {
			basePower: 50
		},
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Flying')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Flying-type moves 20%."
	},
	"ShedShell": {
		id: "ShedShell",
		name: "Shed Shell",
		spritenum: 437,
		fling: {
			basePower: 10
		},
		onModifyPokemonPriority: -10,
		onModifyPokemon: function(pokemon) {
			pokemon.trapped = false;
		},
		desc: "Allows holder to switch out even when trapped."
	},
	"ShellBell": {
		id: "ShellBell",
		name: "Shell Bell",
		spritenum: 438,
		fling: {
			basePower: 30
		},
		onAfterMoveSelf: function(source, target) {
			this.heal(source.lastDamage/8, source);
		},
		desc: "Heals holder 1\/8 of damage dealt."
	},
	"ShockDrive": {
		id: "ShockDrive",
		name: "Shock Drive",
		spritenum: 442,
		fling: {
			basePower: 70
		},
		onDrive: 'Electric',
		desc: "Changes the type of Techno Blast to Electric."
	},
	"ShucaBerry": {
		id: "ShucaBerry",
		name: "Shuca Berry",
		spritenum: 443,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Ground"
		},
		onSourceBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ground' && this.getEffectiveness(move.type, target) > 0) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return basePower * 0.5;
				}
			}
		},
		onEat: function() { },
		desc: "Reduces damage from a super effective Ground-type attack by 50%. Consumed after use."
	},
	"SilkScarf": {
		id: "SilkScarf",
		name: "Silk Scarf",
		spritenum: 444,
		fling: {
			basePower: 10
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Normal')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Normal-type moves 20%."
	},
	"SilverPowder": {
		id: "SilverPowder",
		name: "SilverPowder",
		spritenum: 447,
		fling: {
			basePower: 10
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Bug')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Bug-type moves 20%."
	},
	"SitrusBerry": {
		id: "SitrusBerry",
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
		desc: "Restores 25% max HP when at 50% HP or less. One-time use."
	},
	"SkullFossil": {
		id: "SkullFossil",
		name: "Skull Fossil",
		spritenum: 449,
		fling: {
			basePower: 100
		},
		desc: "Can be revived into Cranidos."
	},
	"SkyPlate": {
		id: "SkyPlate",
		name: "Sky Plate",
		spritenum: 450,
		fling: {
			basePower: 90
		},
		onPlate: 'Flying',
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Flying')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Flying-type moves 20%. Pokemon with Multitype become Flying-type."
	},
	"SmoothRock": {
		id: "SmoothRock",
		name: "Smooth Rock",
		spritenum: 453,
		fling: {
			basePower: 10
		},
		desc: "Makes sandstorm last 8 turns."
	},
	"SoftSand": {
		id: "SoftSand",
		name: "Soft Sand",
		spritenum: 456,
		fling: {
			basePower: 10
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ground')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Ground-type moves 20%."
	},
	"SoulDew": {
		id: "SoulDew",
		name: "Soul Dew",
		spritenum: 459,
		fling: {
			basePower: 30
		},
		onModifyStats: function(stats, pokemon) {
			if (pokemon.template.species === 'Latios' || pokemon.template.species === 'Latias')
			{
				stats.spa *= 1.5;
				stats.spd *= 1.5;
			}
		},
		desc: "Raises Special Attack and Special Defense by 50% if the holder is Latias or Latios. Unobtainable in BW."
	},
	"SpellTag": {
		id: "SpellTag",
		name: "Spell Tag",
		spritenum: 461,
		fling: {
			basePower: 30
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ghost')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Ghost-type moves 20%."
	},
	"SpelonBerry": {
		id: "SpelonBerry",
		name: "Spelon Berry",
		spritenum: 462,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Dark"
		},
		desc: "No use. Unobtainable in BW."
	},
	"SplashPlate": {
		id: "SplashPlate",
		name: "Splash Plate",
		spritenum: 463,
		fling: {
			basePower: 90
		},
		onPlate: 'Water',
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Water')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Water-type moves 20%. Pokemon with Multitype become Water-type."
	},
	"SpookyPlate": {
		id: "SpookyPlate",
		name: "Spooky Plate",
		spritenum: 464,
		fling: {
			basePower: 90
		},
		onPlate: 'Ghost',
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ghost')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Ghost-type moves 20%. Pokemon with Multitype become Ghost-type."
	},
	"StarfBerry": {
		id: "StarfBerry",
		name: "Starf Berry",
		spritenum: 472,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Psychic"
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/4 || (pokemon.hp <= pokemon.maxhp/2 && pokemon.ability === 'Gluttony')) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			var stats = [];
			for (var i in pokemon.boosts)
			{
				if (pokemon.boosts[i] < 6)
				{
					stats.push(i);
				}
			}
			if (stats.length)
			{
				var i = stats[parseInt(Math.random()*stats.length)];
				var boost = {};
				boost[i] = 2;
				this.boost(boost);
			}
		},
		desc: "Raises a random stat by two stages when at 25% HP or less. One-time use."
	},
	"SteelGem": {
		id: "SteelGem",
		name: "Steel Gem",
		spritenum: 473,
		isGem: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Steel')
			{
				if (user.useItem())
				{
					this.debug('gem activate: +50% boost');
					return basePower * 1.5;
				}
			}
		},
		desc: "Raises the power of a Steel-type move by 50%. One-time use."
	},
	"Stick": {
		id: "Stick",
		name: "Stick",
		fling: {
			basePower: 60
		},
		spritenum: 475,
		onModifyMove: function(move, user) {
			if (user.template.species === 'Farfetch\'d') {
			move.critRatio += 2;
			}
		},
		desc: "Raises Farfetch'd's critical hit rate two stages."
	},
	"StickyBarb": {
		id: "StickyBarb",
		name: "Sticky Barb",
		spritenum: 476,
		fling: {
			basePower: 80
		},
		onResidualPriority: -26.2,
		onResidual: function(pokemon) {
			this.damage(pokemon.maxhp/8);
		},
		onHit: function(target, source, move) {
			if (source && source !== target && !source.item && move && move.isContact)
			{
				var barb = target.takeItem();
				source.setItem(barb);
				// no message for Sticky Barb changing hands
			}
		},
		desc: "Causes damage to holder and attaches to attacker upon contact."
	},
	"StonePlate": {
		id: "StonePlate",
		name: "Stone Plate",
		spritenum: 477,
		fling: {
			basePower: 90
		},
		onPlate: 'Rock',
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Rock')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises base power of Rock-type moves 20%. Pokemon with Multitype become Rock-type."
	},
	"TamatoBerry": {
		id: "TamatoBerry",
		name: "Tamato Berry",
		spritenum: 486,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Psychic"
		},
		desc: "Increases happiness, but lowers Speed EVs by 10."
	},
	"TangaBerry": {
		id: "TangaBerry",
		name: "Tanga Berry",
		spritenum: 487,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Bug"
		},
		onSourceBasePower: function(basePower, user, target, move) {
			if (move.type === 'Bug' && this.getEffectiveness(move.type, target) > 0) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return basePower * 0.5;
				}
			}
		},
		onEat: function() { },
		desc: "Reduces damage from a super effective Bug-type attack by 50%. Consumed after use."
	},
	"ThickClub": {
		id: "ThickClub",
		name: "Thick Club",
		spritenum: 491,
		fling: {
			basePower: 90
		},
		onModifyStats: function(stats, pokemon) {
			if (pokemon.template.species === 'Cubone' || pokemon.template.species === 'Marowak')
			{
				stats.atk *= 2;
			}
		},
		desc: "Doubles Cubone's and Marowak's Attack."
	},
	"ToxicOrb": {
		id: "ToxicOrb",
		name: "Toxic Orb",
		spritenum: 515,
		fling: {
			basePower: 30,
			status: 'tox'
		},
		onResidualPriority: -26.2,
		onResidual: function(pokemon) {
			if (!pokemon.status && !pokemon.hasType('Steel'))
			{
				this.add('residual '+pokemon.id+' item-activate ToxicOrb');
				pokemon.trySetStatus('tox');
			}
		},
		desc: "Poisons the holder."
	},
	"ToxicPlate": {
		id: "ToxicPlate",
		name: "Toxic Plate",
		spritenum: 516,
		fling: {
			basePower: 90
		},
		onPlate: 'Poison',
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Poison')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Poison-type moves 20%. Pokemon with Multitype become Poison-type."
	},
	"TwistedSpoon": {
		id: "TwistedSpoon",
		name: "TwistedSpoon",
		spritenum: 520,
		fling: {
			basePower: 30
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Psychic')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Psychic-type moves 20%."
	},
	"WacanBerry": {
		id: "WacanBerry",
		name: "Wacan Berry",
		spritenum: 526,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Electric"
		},
		onSourceBasePower: function(basePower, user, target, move) {
			if (move.type === 'Electric' && this.getEffectiveness(move.type, target) > 0) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return basePower * 0.5;
				}
			}
		},
		onEat: function() { },
		desc: "Reduces damage from a super effective Electric-type attack by 50%. Consumed after use."
	},
	"WaterGem": {
		id: "WaterGem",
		name: "Water Gem",
		spritenum: 528,
		isGem: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Water')
			{
				if (user.useItem())
				{
					this.debug('gem activate: +50% boost');
					return basePower * 1.5;
				}
			}
		},
		desc: "Raises the power of a Water-type move by 50%. One-time use."
	},
	"WatmelBerry": {
		id: "WatmelBerry",
		name: "Watmel Berry",
		spritenum: 530,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Fire"
		},
		desc: "No use. Unobtainable in BW."
	},
	"WaveIncense": {
		id: "WaveIncense",
		name: "Wave Incense",
		spritenum: 531,
		fling: {
			basePower: 10
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Water')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Water-type moves 20%. Allows breeding of Mantyke."
	},
	"WepearBerry": {
		id: "WepearBerry",
		name: "Wepear Berry",
		spritenum: 533,
		isBerry: true,
		naturalGift: {
			basePower: 70,
			type: "Electric"
		},
		desc: "No use. Unobtainable in BW."
	},
	"WhiteHerb": {
		id: "WhiteHerb",
		name: "White Herb",
		spritenum: 535,
		fling: {
			basePower: 10,
			effect: function(pokemon) {
				var activate = false;
				var boosts = {};
				for (var i in pokemon.baseBoosts)
				{
					if (pokemon.baseBoosts[i] < 0)
					{
						activate = true;
						boosts[i] = 0;
					}
				}
				if (activate)
				{
					pokemon.setBoost(boosts);
					this.add('residual '+pokemon.id+' item-restore WhiteHerb');
				}
			}
		},
		onUpdate: function(pokemon) {
			var activate = false;
			var boosts = {};
			for (var i in pokemon.baseBoosts)
			{
				if (pokemon.baseBoosts[i] < 0)
				{
					activate = true;
					boosts[i] = 0;
				}
			}
			if (activate && pokemon.useItem())
			{
				pokemon.setBoost(boosts);
				this.add('residual '+pokemon.id+' item-restore WhiteHerb');
			}
		},
		desc: "Removes stat decreases. Consumed after use."
	},
	"WideLens": {
		id: "WideLens",
		name: "Wide Lens",
		spritenum: 537,
		fling: {
			basePower: 10
		},
		onModifyMove: function(move) {
			if (typeof move.accuracy === 'number')
			{
				move.accuracy *= 1.1;
			}
		},
		desc: "Raises accuracy 10%."
	},
	"WikiBerry": {
		id: "WikiBerry",
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
			pokemon.heal(pokemon.maxhp/8);
			if (pokemon.getNature().minus === 'spa') {
				pokemon.addVolatile('confusion');
			}
		},
		desc: "Restores 1\/8 max HP when at 50% HP or less. May confuse. One-time use."
	},
	"WiseGlasses": {
		id: "WiseGlasses",
		name: "Wise Glasses",
		spritenum: 539,
		fling: {
			basePower: 10
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.category === 'Special')
			{
				return basePower * 1.1;
			}
		},
		desc: "Raises damage from special moves 10%."
	},
	"YacheBerry": {
		id: "YacheBerry",
		name: "Yache Berry",
		spritenum: 567,
		isBerry: true,
		naturalGift: {
			basePower: 60,
			type: "Ice"
		},
		onSourceBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ice' && this.getEffectiveness(move.type, target) > 0) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return basePower * 0.5;
				}
			}
		},
		onEat: function() { },
		desc: "Reduces damage from a super effective Ice-type attack by 50%. Consumed after use."
	},
	"ZapPlate": {
		id: "ZapPlate",
		name: "Zap Plate",
		spritenum: 572,
		fling: {
			basePower: 90
		},
		onPlate: 'Electric',
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Electric')
			{
				return basePower * 1.2;
			}
		},
		desc: "Raises power of Electric moves 20%. Pokemon with Multitype become Electric-type."
	},
	"ZoomLens": {
		id: "ZoomLens",
		name: "Zoom Lens",
		spritenum: 574,
		fling: {
			basePower: 10
		},
		onModifyMove: function(move, user, target) {
			if (typeof move.accuracy === 'number' && !this.willMove(target))
			{
				this.debug('Zoom Lens boosting accuracy');
				move.accuracy *= 1.2;
			}
		},
		desc: "Raises accuracy by 20% if the holder moves after the target."
	}
};
