export const Abilities: {[k: string]: ModdedAbilityData} = {
	schooling: {
		onStart(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 4 || pokemon.hasItem('graduationscale')) {
				if (pokemon.species.id === 'wishiwashi') {
					pokemon.formeChange('Wishiwashi-School');
				}
			} else {
				if (pokemon.species.id === 'wishiwashischool') {
					pokemon.formeChange('Wishiwashi');
				}
			}
		},
		onResidualOrder: 27,
		onResidual(pokemon) {
			if (
				pokemon.baseSpecies.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 ||
				pokemon.transformed || !pokemon.hp
			) return;
			if (pokemon.hp > pokemon.maxhp / 4 || pokemon.hasItem('graduationscale')) {
				if (pokemon.species.id === 'wishiwashi') {
					pokemon.formeChange('Wishiwashi-School');
				}
			} else {
				if (pokemon.species.id === 'wishiwashischool') {
					pokemon.formeChange('Wishiwashi');
				}
			}
		},
		inherit: true,
	},
	lightpower: {
		onModifySpAPriority: 5,
		onModifySpA(spa) {
			return this.chainModify(2);
		},
		name: "Light Power",
		shortDesc: "This Pokemon's Special Attack is doubled.",
		rating: 5,
	},
	raindish: {
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (this.field.isWeather(['raindance', 'primordialsea'])) return;
			this.heal(pokemon.maxhp / 16);
		},
		onWeather(target, source, effect) {
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.heal(target.baseMaxhp / 8);
			}
		},
		name: "Rain Dish",
		shortDesc: "Heals 6.25% of user's max HP at the end of each turn. Heals 12.5% in Rain.",
		num: 44,
		rating: 3,
	},
	icebody: {
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (this.field.isWeather('hail')) return;
			this.heal(pokemon.maxhp / 16);
		},
		onWeather(target, source, effect) {
			if (effect.id === 'hail') {
				this.heal(target.baseMaxhp / 8);
			}
		},
		name: "Ice Body",
		shortDesc: "Heals 6.25% of user's max HP at the end of each turn. Heals 12.5% in Hail.",
		num: 115,
		rating: 3,
	},
	sweetveil: {
		name: "Sweet Veil",
		shortDesc: "This Pokemon and its allies can't fall asleep. This Pokemon heals 1/8 of its max HP if it's holding Honey.",
		onAllySetStatus(status, target, source, effect) {
			if (status.id === 'slp') {
				this.debug('Sweet Veil interrupts sleep');
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Sweet Veil', '[of] ' + effectHolder);
				return null;
			}
		},
		onAllyTryAddVolatile(status, target) {
			if (status.id === 'yawn') {
				this.debug('Sweet Veil blocking yawn');
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Sweet Veil', '[of] ' + effectHolder);
				return null;
			}
		},
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (pokemon.hasItem('honey')) {
				this.heal(pokemon.baseMaxhp / 8);
			}
		},
		rating: 2,
		num: 175,
	},
	libero: {
		shortDesc: "Non-STAB moves have 1.2x power.",
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (!pokemon.hasType(move.type)) {
				return this.chainModify(1.2);
			}
		},
		name: "Libero",
		rating: 4.5,
		num: 236,
	},
	moody: {
		shortDesc: "This Pokemon's lowest stat goes up by 1 every turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (pokemon.activeTurns) {
				let statName = 'atk';
				let worstStat = 3000; // The highest possible stat number (with boosts) is 2,676
				let s: StatIDExceptHP;
				for (s in pokemon.storedStats) {
					if (pokemon.storedStats[s] >= worstStat) continue;
					statName = s;
					worstStat = pokemon.storedStats[s];
				}
				this.boost({[statName]: 1}, pokemon, pokemon);
			}
		},
		name: "Moody",
		rating: 3,
		num: 141,
	},
	stickyhold: {
		onTakeItem(item, pokemon, source) {
			if (this.suppressingAbility(pokemon) || !pokemon.hp || pokemon.item === 'stickybarb') return;
			if (!this.activeMove) throw new Error("Battle.activeMove is null");
			if ((source && source !== pokemon) || this.activeMove.id === 'knockoff') {
				this.add('-activate', pokemon, 'ability: Sticky Hold');
				return false;
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.name === 'Knock Off') {
				this.debug('Sticky Hold weaken');
				return this.chainModify(0.67);
			}
		},
		onTryHit(pokemon, target, move) {
			if (move.name === 'Poltergeist') {
				this.add('-immune', pokemon, '[from] ability: Sticky Hold');
				return null;
			}
		},
		name: "Sticky Hold",
		rating: 2,
		num: 60,
	},
	watercompaction: {
		shortDesc: "This Pokemon's Defense goes up 2 stages when hit by a Water-type move; Water immunity.",
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.boost({def: 2})) {
					this.add('-immune', target, '[from] ability: Water Compaction');
				}
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (target === this.effectState.target || target.side !== source.side) return;
			if (move.type === 'Water') {
				this.boost({def: 2}, this.effectState.target);
			}
		},
		name: "Water Compaction",
		rating: 3,
		num: 195,
	},
	ironfist: {
		shortDesc: "This Pokemon's punch attacks have 1.25x power and don't make contact. Sucker Punch is not boosted.",
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Iron Fist boost');
				return this.chainModify([0x1400, 0x1000]);
			}
		},
		onModifyMove(move) {
			if (move.flags['punch']) {
				delete move.flags['contact'];
			}
		},
		name: "Iron Fist",
		rating: 3,
		num: 89,
	},
	overclock: {
		shortDesc: "This Pokemon's moves that lower its stats have 1.3x power.",
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			const statLoweringMoves = [
				'Draco Meteor', 'Fleur Cannon', 'Leaf Storm', 'Overheat', 'Psycho Boost', 'Superpower',
				'Lightning Lance', 'Clanging Scales', 'Close Combat', 'Dragon Ascent', 'Hyperspace Fury',
				'Scale Shot', 'V-create', 'Hammer Arm', 'Ice Hammer',
			];
			if (statLoweringMoves.includes(move.name)) {
				return this.chainModify(1.3);
			}
		},
		name: "Overclock",
		rating: 4,
	},
	pricklycoat: {
		shortDesc: "This Pokemon sets a layer of Spikes when hit by a contact move, or Toxic Spikes if it's a Poison-type or hit by a Poison-type move.",
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				this.add('-ability', target, 'Prickly Coat');
				if (move.type === 'Poison' || target.hasType('Poison')) {
					target.side.foe.addSideCondition('toxicspikes');
				} else {
					target.side.foe.addSideCondition('spikes');
				}
			}
		},
		name: "Prickly Coat",
		rating: 3,
	},
	sandveil: {
		desc: "If Sandstorm is active, this Pokemon's SpD is multiplied by 1.5. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm is active, this Pokemon's SpD is boosted 1.5x; immunity to Sandstorm.",
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		onModifySpD(spd, pokemon) {
			if (this.field.isWeather('sandstorm')) {
				return this.chainModify(1.5);
			}
		},
		name: "Sand Veil",
		rating: 3,
		num: 146,
	},
	snowcloak: {
		desc: "If Hail is active, this Pokemon's Ice, Water, and Fairy-type moves deal 1.3x damage. This Pokemon takes no damage from Hail.",
		shortDesc: "This Pokemon's Ice/Water/Fairy attacks deal 1.3x damage in Hail; immunity to Hail.",
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.field.isWeather('hail')) {
				if (move.type === 'Ice' || move.type === 'Water' || move.type === 'Fairy') {
					this.debug('Snow Cloak boost');
					return this.chainModify([0x14CD, 0x1000]);
				}
			}
		},
		name: "Snow Cloak",
		rating: 3,
		num: 81,
	},
	powerofalchemy: {
		shortDesc: "All of this Pokemon's abilities are active at once.",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Power of Alchemy');
		},
		isPermanent: true,
		name: "Power of Alchemy",
		rating: 0,
		num: 223,
	},
	powerofalchemymukalola: {
		shortDesc: "All of this Pokemon's abilities are active at once.",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Power of Alchemy');
		},
		onModifyMove(move) {
			if (!move || !move.flags['contact'] || move.target === 'self') return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 30,
				status: 'psn',
				ability: this.dex.abilities.get('poisontouch'),
			});
		},
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.add('-activate', source, 'ability: Scavenge');
				this.heal(source.baseMaxhp / 3, source, source, effect);
			}
		},
		isPermanent: true,
		name: "Power of Alchemy (Muk-Alola)",
		rating: 5,
	},
	merciless: {
		shortDesc: "This Pokemon's attacks are critical hits if the target is statused.",
		onModifyCritRatio(critRatio, source, target) {
			if (target?.status) return 5;
		},
		name: "Merciless",
		rating: 1.5,
		num: 196,
	},
	pastelveil: {
		shortDesc: "This Pokemon and its allies cannot be poisoned. Poison-type moves have 0.5x power against this Pokemon and its allies. On switch-in, cures poisoned allies.",
		onStart(pokemon) {
			for (const ally of pokemon.allies()) {
				if (['psn', 'tox'].includes(ally.status)) {
					this.add('-activate', pokemon, 'ability: Pastel Veil');
					ally.cureStatus();
				}
			}
		},
		onUpdate(pokemon) {
			if (['psn', 'tox'].includes(pokemon.status)) {
				this.add('-activate', pokemon, 'ability: Pastel Veil');
				pokemon.cureStatus();
			}
		},
		onAllySwitchIn(pokemon) {
			if (['psn', 'tox'].includes(pokemon.status)) {
				this.add('-activate', this.effectState.target, 'ability: Pastel Veil');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (!['psn', 'tox'].includes(status.id)) return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Pastel Veil');
			}
			return false;
		},
		onAllySetStatus(status, target, source, effect) {
			if (!['psn', 'tox'].includes(status.id)) return;
			if ((effect as Move)?.status) {
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Pastel Veil', '[of] ' + effectHolder);
			}
			return false;
		},
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Poison') {
				this.debug('Pastel Veil weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Poison') {
				this.debug('Pastel Veil weaken');
				return this.chainModify(0.5);
			}
		},
		name: "Pastel Veil",
		rating: 2,
		num: 257,
	},
	gravitation: {
		shortDesc: "On switch-in, this Pokemon summons Gravity.",
		onStart(source) {
			this.add('-ability', source, 'Gravitation');
			this.field.addPseudoWeather('gravity', source, source.getAbility());
		},
		name: "Gravitation",
		rating: 4,
	},
	buzzoff: {
		shortDesc: "This Pokemon switches out after using a Bug-type move.",
		onModifyMove(move, pokemon) {
			if (move.type === 'Bug') {
				move.selfSwitch = true;
				this.add('-ability', pokemon, 'Buzz Off');
			}
		},
		name: "Buzz Off",
		rating: 4.5,
	},
	magmaarmor: {
		onUpdate(pokemon) {
			if (pokemon.status === 'frz') {
				this.add('-activate', pokemon, 'ability: Magma Armor');
				pokemon.cureStatus();
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
			if (type === 'frz') return false;
		},
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Water') {
				this.debug('Magma Armor weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Water') {
				this.debug('Magma Armor weaken');
				return this.chainModify(0.5);
			}
		},
		name: "Magma Armor",
		rating: 2,
		num: 40,
		shortDesc: "Water/Ice-type moves against this Pokemon deal damage with a halved attacking stat. Hail & Freeze immunity.",
	},
	leafguard: {
		onSetStatus(status, target, source, effect) {
			if (['sunnyday', 'desolateland'].includes(target.effectiveWeather())) {
				if ((effect as Move)?.status) {
					this.add('-immune', target, '[from] ability: Leaf Guard');
				}
				return false;
			}
		},
		onTryAddVolatile(status, target) {
			if ((status.id === 'yawn' || status.id === 'flinch') &&
				['sunnyday', 'desolateland'].includes(target.effectiveWeather())) {
				this.add('-immune', target, '[from] ability: Leaf Guard');
				return null;
			}
		},
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Flying' || move.type === 'Bug') {
				this.debug('Leaf Guard weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Flying' || move.type === 'Bug') {
				this.debug('Leaf Guard weaken');
				return this.chainModify(0.5);
			}
		},
		name: "Leaf Guard",
		rating: 0.5,
		num: 102,
		shortDesc: "Flying/Bug-type moves against this Pokemon deal damage with a halved attacking stat. Can't be statused or flinched by others in Sun.",
	},

	soullink: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact'] && !source.hasType('Ghost') && source.addType('Ghost')) {
				this.add('-start', source, 'typeadd', 'Ghost', '[from] ability: Soul Link');
			}
		},
		name: "Soul Link",
		shortDesc: "Pokémon that make contact with this Pokémon have the Ghost-type added to their existing typings until they switch out (Trick-or-Treat effect).",
		rating: 2.5,
	},
	wanderingspirit: {
		shortDesc: "On switch-in, swaps ability with the opponent.",
		onSwitchIn(pokemon) {
			this.effectState.switchingIn = true;
		},
		onStart(pokemon) {
			if (pokemon.foes().some(
				foeActive => foeActive && foeActive.isAdjacent(pokemon) && foeActive.ability === 'noability'
			) || ![
				'spiritomb', 'spectrier', 'yamaskgalar', 'runerigus', 'cofagrigus', 'cacturne', 'hoopa', 'marowak', 'rotom',
			].includes(pokemon.species.id)) {
				this.effectState.gaveUp = true;
			}
		},
		onUpdate(pokemon) {
			if (!pokemon.isStarted || this.effectState.gaveUp) return;
			if (!this.effectState.switchingIn) return;
			const possibleTargets = pokemon.foes().filter(foeActive => foeActive && foeActive.isAdjacent(pokemon));
			while (possibleTargets.length) {
				let rand = 0;
				if (possibleTargets.length > 1) rand = this.random(possibleTargets.length);
				const target = possibleTargets[rand];
				const ability = target.getAbility();
				const additionalBannedAbilities = [
					// Zen Mode included here for compatability with Gen 5-6
					'noability', 'flowergift', 'forecast', 'hungerswitch', 'illusion', 'wanderingspirit',
					'imposter', 'neutralizinggas', 'powerofalchemy', 'receiver', 'trace', 'zenmode', 'concussion', 'gorillatactics', 'counterfeit',
				];
				if (target.getAbility().isPermanent || additionalBannedAbilities.includes(target.ability)) {
					possibleTargets.splice(rand, 1);
					continue;
				}
				target.setAbility('wanderingspirit', pokemon);
				pokemon.setAbility(ability);
				this.add('-activate', pokemon, 'ability: Wandering Spirit', ability.name, 'Wandering Spirit', '[of] ' + target);
				return;
			}
		},
		name: "Wandering Spirit",
		rating: 4,
		num: 254,
	},
	honeygather: {
		name: "Honey Gather",
		shortDesc: "At the end of each turn, if this Pokemon has no item, it gets Honey. Knock Off doesn't get boosted against Pokemon with this ability.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (pokemon.hp && !pokemon.item) {
				pokemon.setItem('honey');
				this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Honey Gather');
			}
			if (pokemon.hasItem('honey')) {
				this.heal(pokemon.baseMaxhp / 8);
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.name === 'Knock Off') {
				this.debug('Honey Gather weaken');
				return this.chainModify(0.67);
			}
		},
		rating: 3,
		num: 118,
	},
	hydration: {
		shortDesc: "This Pokemon has its status cured at the end of each turn if Rain Dance is active or it gets hit by a Water move; Water immunity. Heals 12.5% HP if hit by a Water move.",
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) {
			if (pokemon.status && ['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				this.debug('hydration');
				this.add('-activate', pokemon, 'ability: Hydration');
				this.add('-message', `Hydration activated!`);
				pokemon.cureStatus();
			}
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.baseMaxhp / 8) || !target.cureStatus()) {
					this.add('-immune', target, '[from] ability: Hydration');
				}
				return null;
			}
		},
		name: "Hydration",
		rating: 1.5,
		num: 93,
	},
	parentalbond: {
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.selfdestruct || move.multihit) return;
			const noParentalBond = [
				'endeavor', 'seismictoss', 'psywave', 'nightshade', 'sonicboom', 'dragonrage',
				'superfang', 'naturesmadness', 'bide', 'counter', 'mirrorcoat', 'metalburst',
			];
			if (noParentalBond.includes(move.id)) return;
			if (!move.spreadHit && !move.isZ && !move.isMax) {
				move.multihit = 2;
				move.multihitType = 'parentalbond';
			}
		},
		onBasePowerPriority: 7,
		onBasePower(basePower, pokemon, target, move) {
			if (move.multihitType === 'parentalbond' && move.hit > 1) return this.chainModify(0.25);
		},
		onSourceModifySecondaries(secondaries, target, source, move) {
			if (move.multihitType === 'parentalbond' && move.id === 'secretpower' && move.hit < 2) {
				// hack to prevent accidentally suppressing King's Rock/Razor Fang
				return secondaries.filter(effect => effect.volatileStatus === 'flinch');
			}
		},
		name: "Parental Bond",
		rating: 4.5,
		num: 184,
	},
	scavenge: {
		shortDesc: "This Pokemon's heals 33% of its HP when another Pokemon faints.",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.add('-activate', source, 'ability: Scavenge');
				this.heal(source.baseMaxhp / 3, source, source, effect);
			}
		},
		name: "Scavenge",
		rating: 3.5,
	},
	unimpressed: {
		shortDesc: "Moves used against this Pokemon don't receive STAB.",
		onSourceModifyDamage(damage, source, target, move) {
			if (source.hasType(move.type)) {
				this.debug('Unimpressed weaken');
				return this.chainModify(source.hasAbility('adaptability') ? 0.5 : 0.67);
			}
		},
		name: "Unimpressed",
		rating: 3.5,
	},
	counterfeit: {
		shortDesc: "On switch-in, identifies and copies the effect of the opponent's held item.",
		onStart(pokemon) {
			if (pokemon.foes().some(
				foeActive => foeActive && foeActive.isAdjacent(pokemon) && !foeActive.item
			)) {
				this.effectState.gaveUp = true;
			}
		},
		onUpdate(pokemon) {
			if (!pokemon.isStarted || this.effectState.gaveUp) return;
			const possibleTargets = pokemon.foes().filter(foeActive => foeActive && foeActive.isAdjacent(pokemon));
			while (possibleTargets.length) {
				let rand = 0;
				if (possibleTargets.length > 1) rand = this.random(possibleTargets.length);
				const target = possibleTargets[rand];
				const item = target.getItem();
				const additionalBannedItems = [
					// Zen Mode included here for compatability with Gen 5-6
					'noability', 'flowergift', 'forecast', 'hungerswitch', 'illusion', 'imposter',
					'neutralizinggas', 'powerofalchemy', 'receiver', 'trace', 'zenmode',
				];
				if (!this.singleEvent('TakeItem', item, target.itemState, target, pokemon, this.effect, item) ||
					additionalBannedItems.includes(target.item)) {
					possibleTargets.splice(rand, 1);
					continue;
				}
				this.add('-ability', pokemon, item, '[from] ability: Counterfeit', '[of] ' + target);
				pokemon.setAbility(item as unknown as Ability);
				return;
			}
		},
		name: "Counterfeit",
		rating: 3.5,
	},
	optimistic: {
		onBoost(boost, target, source, effect) {
			if (source && target !== source) return;
			let showMsg = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries && effect.id !== 'octolock') {
				this.add("-fail", target, "unboost", "[from] ability: Optimistic", "[of] " + target);
			}
		},
		shortDesc: "This Pokemon can't lower its own stats.",
		name: "Optimistic",
		rating: 5,
	},
	rivalry: {
		onBasePowerPriority: 24,
		onBasePower(basePower, pokemon, target) {
			if (target.hasType(pokemon.getTypes())) {
				return this.chainModify(1.33);
			}
		},
		name: "Rivalry",
		rating: 0,
		num: 79,
		shortDesc: "This Pokemon's moves deal 1.33x damage to targets that share a type with it.",
	},
	vaporcontrol: {
		onUpdate(pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather()) && !pokemon.side.getSideCondition('mist')) {
				this.actions.useMove("Mist", pokemon);
			}
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if ((this.field.isWeather('sunnyday') || this.field.isWeather('desolateland')) &&
				move.type === 'Water') {
				this.debug('Vapor Control boost');
				return this.chainModify(1.5);
			}
		},
		shortDesc: "If Sun is active, 1.5x power Water moves and sets Mist; Ignores Sun Water drop.",
		name: "Vapor Control",
		rating: 3,
	},
	// Edited by proxy
	oblivious: {
		onUpdate(pokemon) {
			if (pokemon.volatiles['attract']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Oblivious');
			}
			if (pokemon.volatiles['taunt']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.removeVolatile('taunt');
				// Taunt's volatile already sends the -end message when removed
			}
			if (pokemon.volatiles['trashtalk']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.removeVolatile('trashtalk');
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'attract' || type === 'trashtalk') return false;
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'attract' || move.id === 'captivate' || move.id === 'taunt') {
				this.add('-immune', pokemon, '[from] ability: Oblivious');
				return null;
			}
		},
		onBoost(boost, target, source, effect) {
			if (effect.id === 'intimidate') {
				delete boost.atk;
				this.add('-immune', target, '[from] ability: Oblivious');
			}
		},
		name: "Oblivious",
		rating: 1.5,
		num: 12,
	},
	aromaveil: {
		onAllyTryAddVolatile(status, target, source, effect) {
			if (['attract', 'disable', 'encore', 'healblock', 'taunt', 'torment', 'trashtalk'].includes(status.id)) {
				if (effect.effectType === 'Move') {
					const effectHolder = this.effectState.target;
					this.add('-block', target, 'ability: Aroma Veil', '[of] ' + effectHolder);
				}
				return null;
			}
		},
		name: "Aroma Veil",
		rating: 2,
		num: 165,
	},
	trace: {
		onStart(pokemon) {
			if (pokemon.foes().some(
				foeActive => foeActive && foeActive.isAdjacent(pokemon) && foeActive.ability === 'noability'
			)) {
				this.effectState.gaveUp = true;
			}
		},
		onUpdate(pokemon) {
			if (!pokemon.isStarted || this.effectState.gaveUp) return;
			const possibleTargets = pokemon.foes().filter(foeActive => foeActive && foeActive.isAdjacent(pokemon));
			while (possibleTargets.length) {
				let rand = 0;
				if (possibleTargets.length > 1) rand = this.random(possibleTargets.length);
				const target = possibleTargets[rand];
				const ability = target.getAbility();
				const additionalBannedAbilities = [
					// Zen Mode included here for compatability with Gen 5-6
					'noability', 'flowergift', 'forecast', 'hungerswitch', 'illusion', 'imposter', 'neutralizinggas',
					'powerofalchemy', 'receiver', 'trace', 'zenmode', 'wanderingspirit',
				];
				if (target.getAbility().isPermanent || additionalBannedAbilities.includes(target.ability)) {
					possibleTargets.splice(rand, 1);
					continue;
				}
				this.add('-ability', pokemon, ability, '[from] ability: Trace', '[of] ' + target);
				pokemon.setAbility(ability);
				return;
			}
		},
		name: "Trace",
		rating: 2.5,
		num: 36,
	},
	concussion: {
		name: "Concussion",
		shortDesc: "While this Pokemon is active, the opponents' held items have no effect.",
		onStart(source) {
			let activated = false;
			for (const pokemon of source.foes()) {
				if (!activated) {
					this.add('-ability', source, 'Concussion');
				}
				activated = true;
				if (!pokemon.volatiles['embargo'] && !pokemon.hasItem('morningblossom')) {
					pokemon.addVolatile('embargo');
				}
			}
		},
		onAnySwitchIn(pokemon) {
			const source = this.effectState.target;
			if (pokemon === source) return;
			for (const target of source.foes()) {
				if (!target.volatiles['embargo'] && !target.hasItem('morningblossom')) {
					target.addVolatile('embargo');
				}
			}
		},
		onEnd(pokemon) {
			for (const target of pokemon.foes()) {
				target.removeVolatile('embargo');
			}
		},
		rating: 4,
	},
	gorillatactics: {
		name: "Gorilla Tactics",
		shortDesc: "While this Pokemon is active, the opponents' held items have no effect.",
		onStart(source) {
			let activated = false;
			for (const pokemon of source.foes()) {
				if (!activated) {
					this.add('-ability', source, 'Gorilla Tactics');
				}
				activated = true;
				if (!pokemon.volatiles['embargo'] && !pokemon.hasItem('morningblossom')) {
					pokemon.addVolatile('embargo');
				}
			}
		},
		onAnySwitchIn(pokemon) {
			const source = this.effectState.target;
			if (pokemon === source) return;
			for (const target of source.foes()) {
				if (!target.volatiles['embargo'] && !target.hasItem('morningblossom')) {
					target.addVolatile('embargo');
				}
			}
		},
		onEnd(pokemon) {
			for (const target of pokemon.foes()) {
				target.removeVolatile('embargo');
			}
		},
		rating: 4,
		num: 255,
	},
	toxicboost: {
		shortDesc: "1.5x Attack and Defense while poisoned; Immune to poison status damage.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if ((attacker.status === 'psn' || attacker.status === 'tox') && move.category === 'Physical') {
				return this.chainModify(1.5);
			}
		},
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				return this.chainModify(1.5);
			}
		},
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox') {
				return false;
			}
		},
		name: "Toxic Boost",
		rating: 2.5,
		num: 137,
	},
	flareboost: {
		shortDesc: "1.5x SpA and SpD while burned; Immune to burn damage.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.status === 'brn' && move.category === 'Special') {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			if (pokemon.status === 'brn') {
				return this.chainModify(1.5);
			}
		},
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'brn') {
				return false;
			}
		},
		name: "Flare Boost",
		rating: 2.5,
		num: 138,
	},
	// The other Power of Alchemies
	powerofalchemyweezing: {
		shortDesc: "All of this Pokemon's abilities are active at once.",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Neutralizing Gas');
			pokemon.abilityState.ending = false;
			for (const target of this.getAllActive()) {
				if (target.illusion) {
					this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, pokemon, 'neutralizinggas');
				}
				if (target.volatiles['slowstart']) {
					delete target.volatiles['slowstart'];
					this.add('-end', target, 'Slow Start', '[silent]');
				}
			}
		},
		onEnd(source) {
			// FIXME this happens before the pokemon switches out, should be the opposite order.
			// Not an easy fix since we cant use a supported event. Would need some kind of special event that
			// gathers events to run after the switch and then runs them when the ability is no longer accessible.
			// (If your tackling this, do note extreme weathers have the same issue)

			// Mark this pokemon's ability as ending so Pokemon#ignoringAbility skips it
			source.abilityState.ending = true;
			for (const pokemon of this.getAllActive()) {
				if (pokemon !== source) {
					// Will be suppressed by Pokemon#ignoringAbility if needed
					this.singleEvent('Start', pokemon.getAbility(), pokemon.abilityState, pokemon);
				}
			}
		},
		isPermanent: true,
		name: "Power of Alchemy (Weezing)",
		rating: 5,
	},
	powerofalchemyalcremie: {
		shortDesc: "All of this Pokemon's abilities are active at once.",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Power of Alchemy');
		},
		onTakeItem(item, pokemon, source) {
			if (this.suppressingAbility(pokemon) || !pokemon.hp || pokemon.item === 'stickybarb') return;
			if (!this.activeMove) throw new Error("Battle.activeMove is null");
			if ((source && source !== pokemon) || this.activeMove.id === 'knockoff') {
				this.add('-activate', pokemon, 'ability: Sticky Hold');
				return false;
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.name === 'Knock Off') {
				this.debug('Sticky Hold weaken');
				return this.chainModify(0.67);
			}
		},
		onTryHit(pokemon, target, move) {
			if (move.name === 'Poltergeist') {
				this.add('-immune', pokemon, '[from] ability: Sticky Hold');
				return null;
			}
		},
		onAllySetStatus(status, target, source, effect) {
			if (status.id === 'slp') {
				this.debug('Sweet Veil interrupts sleep');
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Sweet Veil', '[of] ' + effectHolder);
				return null;
			}
		},
		onAllyTryAddVolatile(status, target) {
			if (status.id === 'yawn') {
				this.debug('Sweet Veil blocking yawn');
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Sweet Veil', '[of] ' + effectHolder);
				return null;
			}
		},
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (pokemon.hasItem('honey')) {
				this.heal(pokemon.baseMaxhp / 8);
			}
		},
		isPermanent: true,
		name: "Power of Alchemy (Alcremie)",
		rating: 5,
	},
	powerofalchemymismagius: {
		shortDesc: "All of this Pokemon's abilities are active at once.",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Power of Alchemy');
		},
		isPermanent: true,
		name: "Power of Alchemy (Mismagius)",
		rating: 5,
	},
	powerofalchemyslowkinggalar: {
		shortDesc: "All of this Pokemon's abilities are active at once.",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Power of Alchemy');
		},
		onStart(pokemon) {
			for (const ally of pokemon.allies()) {
				ally.clearBoosts();
				this.add('-clearboost', ally, '[from] ability: Curious Medicine', '[of] ' + pokemon);
			}
		},
		onSwitchOut(pokemon) {
			pokemon.heal(pokemon.baseMaxhp / 3);
		},
		isPermanent: true,
		name: "Power of Alchemy (Slowking-Galar)",
		rating: 5,
	},
	powerofalchemyditto: {
		shortDesc: "All of this Pokemon's abilities are active at once.",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Power of Alchemy');
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'par') {
				this.add('-activate', pokemon, 'ability: Limber');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'par') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Limber');
			}
			return false;
		},
		onSwitchIn(pokemon) {
			this.effectState.switchingIn = true;
		},
		onStart(pokemon) {
			// Imposter does not activate when Skill Swapped or when Neutralizing Gas leaves the field
			if (!this.effectState.switchingIn) return;
			const target = pokemon.foes()[pokemon.foes().length - 1 - pokemon.position];
			if (target) {
				pokemon.transformInto(target, this.dex.abilities.get('powerofalchemyditto'));
			}
			this.effectState.switchingIn = false;
		},
		isPermanent: true,
		name: "Power of Alchemy (Ditto)",
		rating: 5,
	},
	powerofalchemyvanillite: {
		shortDesc: "All of this Pokemon's abilities are active at once.",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Power of Alchemy');
		},
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
		onModifyDef(def, pokemon) {
			if (this.field.isWeather('hail')) {
				return this.chainModify(1.25);
			}
		},
		onModifySpD(spd, pokemon) {
			if (this.field.isWeather('hail')) {
				return this.chainModify(1.25);
			}
		},
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (this.field.isWeather('hail')) return;
			this.heal(pokemon.maxhp / 16);
		},
		onWeather(target, source, effect) {
			if (effect.id === 'hail') {
				this.heal(target.baseMaxhp / 8);
			}
		},
		isPermanent: true,
		name: "Power of Alchemy (Vanillite)",
		rating: 5,
	},
	powerofalchemyvanilluxe: {
		shortDesc: "All of this Pokemon's abilities are active at once.",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Power of Alchemy');
		},
		onStart(source) {
			this.field.setWeather('hail');
		},
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (this.field.isWeather('hail')) return;
			this.heal(pokemon.maxhp / 16);
		},
		onWeather(target, source, effect) {
			if (effect.id === 'hail') {
				this.heal(target.baseMaxhp / 8);
			}
		},
		isPermanent: true,
		name: "Power of Alchemy (Vanilluxe)",
		rating: 5,
	},
	powerofalchemytypenull: {
		shortDesc: "All of this Pokemon's abilities are active at once.",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Power of Alchemy');
		},
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Pressure');
		},
		onDeductPP(target, source) {
			if (target.side === source.side) return;
			return 1;
		},
		onCriticalHit: false,
		isPermanent: true,
		name: "Power of Alchemy (Type: Null)",
		rating: 5,
	},
	powerofalchemysilvally: {
		shortDesc: "All of this Pokemon's abilities are active at once.",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Power of Alchemy');
		},
		onStart(pokemon) {
			let totaldef = 0;
			let totalspd = 0;
			for (const target of pokemon.foes()) {
				if (!target || target.fainted) continue;
				totaldef += target.getStat('def', false, true);
				totalspd += target.getStat('spd', false, true);
			}
			if (totaldef && totaldef >= totalspd) {
				this.boost({spa: 1});
			} else if (totalspd) {
				this.boost({atk: 1});
			}
		},
		isPermanent: true,
		name: "Power of Alchemy (Silvally)",
		rating: 5,
	},
	powerofalchemyvaporeon: {
		shortDesc: "All of this Pokemon's abilities are active at once.",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Power of Alchemy');
		},
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) {
			if (pokemon.status && ['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				this.debug('hydration');
				this.add('-activate', pokemon, 'ability: Hydration');
				this.add('-message', `Hydration activated!`);
				pokemon.cureStatus();
			}
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.baseMaxhp / 2.667) || !target.cureStatus()) {
					this.add('-immune', target, '[from] ability: Power of Alchemy (Vaporeon)');
				}
				return null;
			}
		},
		isPermanent: true,
		name: "Power of Alchemy (Vaporeon)",
		rating: 5,
	},
	powerofalchemyjolteon: {
		shortDesc: "All of this Pokemon's abilities are active at once.",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Power of Alchemy');
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Volt Absorb');
				}
				return null;
			}
		},
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				this.add('-ability', target, 'Prickly Coat');
				if (move.type === 'Poison' || target.hasType('Poison')) {
					target.side.foe.addSideCondition('toxicspikes');
				} else {
					target.side.foe.addSideCondition('spikes');
				}
			}
		},
		isPermanent: true,
		name: "Power of Alchemy (Jolteon)",
		rating: 5,
	},
	powerofalchemyflareon: {
		shortDesc: "All of this Pokemon's abilities are active at once.",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Power of Alchemy');
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				move.accuracy = true;
				if (!target.addVolatile('flashfire')) {
					this.add('-immune', target, '[from] ability: Flash Fire');
				}
				return null;
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			let mod = 1;
			if (move.type === 'Fire') mod *= 2;
			if (move.flags['contact']) mod /= 2;
			return this.chainModify(mod);
		},
		isPermanent: true,
		name: "Power of Alchemy (Flareon)",
		rating: 5,
	},
	powerofalchemyespeon: {
		shortDesc: "All of this Pokemon's abilities are active at once.",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Power of Alchemy');
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, pokemon) {
			let boosted = true;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (this.queue.willMove(target)) {
					boosted = false;
					break;
				}
			}
			if (boosted) {
				this.debug('Analytic boost');
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target === source || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, target, source);
			return null;
		},
		onAllyTryHitSide(target, source, move) {
			if (target.side === source.side || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, this.effectState.target, source);
			return null;
		},
		condition: {
			duration: 1,
		},
		isPermanent: true,
		name: "Power of Alchemy (Espeon)",
		rating: 5,
	},
	powerofalchemyumbreon: {
		shortDesc: "All of this Pokemon's abilities are active at once.",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Power of Alchemy');
		},
		onModifyCritRatio(critRatio, source, target) {
			if (target?.status) return 5;
		},
		isPermanent: true,
		name: "Power of Alchemy (Umbreon)",
		rating: 5,
	},
	powerofalchemyleafeon: {
		shortDesc: "All of this Pokemon's abilities are active at once.",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Power of Alchemy');
		},
		onSetStatus(status, target, source, effect) {
			if (['sunnyday', 'desolateland'].includes(target.effectiveWeather())) {
				if ((effect as Move)?.status) {
					this.add('-immune', target, '[from] ability: Leaf Guard');
				}
				return false;
			}
		},
		onTryAddVolatile(status, target) {
			if ((status.id === 'yawn' || status.id === 'flinch') &&
				['sunnyday', 'desolateland'].includes(target.effectiveWeather())) {
				this.add('-immune', target, '[from] ability: Leaf Guard');
				return null;
			}
		},
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Flying' || move.type === 'Bug') {
				this.debug('Leaf Guard weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Flying' || move.type === 'Bug') {
				this.debug('Leaf Guard weaken');
				return this.chainModify(0.5);
			}
		},
		onModifySpe(spe, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
		isPermanent: true,
		name: "Power of Alchemy (Leafeon)",
		rating: 5,
	},
	powerofalchemyglaceon: {
		shortDesc: "All of this Pokemon's abilities are active at once.",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Power of Alchemy');
		},
		onStart(source) {
			this.field.setWeather('hail');
		},
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.field.isWeather('hail')) {
				if (move.type === 'Ice' || move.type === 'Water' || move.type === 'Fairy') {
					this.debug('Snow Cloak boost');
					return this.chainModify([0x14CD, 0x1000]);
				}
			}
		},
		isPermanent: true,
		name: "Power of Alchemy (Glaceon)",
		rating: 5,
	},
	powerofalchemysylveon: {
		shortDesc: "All of this Pokemon's abilities are active at once.",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Power of Alchemy');
		},
		onCheckShow(pokemon) {
			// This is complicated
			// For the most part, in-game, it's obvious whether or not Natural Cure activated,
			// since you can see how many of your opponent's pokemon are statused.
			// The only ambiguous situation happens in Doubles/Triples, where multiple pokemon
			// that could have Natural Cure switch out, but only some of them get cured.
			if (pokemon.side.active.length === 1) return;
			if (pokemon.showCure === true || pokemon.showCure === false) return;

			const cureList = [];
			let noCureCount = 0;
			for (const curPoke of pokemon.side.active) {
				// pokemon not statused
				if (!curPoke || !curPoke.status) {
					// this.add('-message', "" + curPoke + " skipped: not statused or doesn't exist");
					continue;
				}
				if (curPoke.showCure) {
					// this.add('-message', "" + curPoke + " skipped: Natural Cure already known");
					continue;
				}
				const species = curPoke.species;
				// pokemon can't get Natural Cure
				if (!Object.values(species.abilities).includes('Natural Cure')) {
					// this.add('-message', "" + curPoke + " skipped: no Natural Cure");
					continue;
				}
				// pokemon's ability is known to be Natural Cure
				if (!species.abilities['1'] && !species.abilities['H']) {
					// this.add('-message', "" + curPoke + " skipped: only one ability");
					continue;
				}
				// pokemon isn't switching this turn
				if (curPoke !== pokemon && !this.queue.willSwitch(curPoke)) {
					// this.add('-message', "" + curPoke + " skipped: not switching");
					continue;
				}

				if (curPoke.hasAbility('naturalcure')) {
					// this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (and is)");
					cureList.push(curPoke);
				} else {
					// this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (but isn't)");
					noCureCount++;
				}
			}

			if (!cureList.length || !noCureCount) {
				// It's possible to know what pokemon were cured
				for (const pkmn of cureList) {
					pkmn.showCure = true;
				}
			} else {
				// It's not possible to know what pokemon were cured

				// Unlike a -hint, this is real information that battlers need, so we use a -message
				this.add('-message', "(" + cureList.length + " of " + pokemon.side.name + "'s pokemon " + (cureList.length === 1 ? "was" : "were") + " cured by Natural Cure.)");

				for (const pkmn of cureList) {
					pkmn.showCure = false;
				}
			}
		},
		onSwitchOut(pokemon) {
			if (!pokemon.status) return;

			// if pokemon.showCure is undefined, it was skipped because its ability
			// is known
			if (pokemon.showCure === undefined) pokemon.showCure = true;

			if (pokemon.showCure) this.add('-curestatus', pokemon, pokemon.status, '[from] ability: Natural Cure');
			pokemon.setStatus('');

			// only reset .showCure if it's false
			// (once you know a Pokemon has Natural Cure, its cures are always known)
			if (!pokemon.showCure) pokemon.showCure = undefined;
		},
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Fairy';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([0x1333, 0x1000]);
		},
		isPermanent: true,
		name: "Power of Alchemy (Sylveon)",
		rating: 5,
	},
	// Counterfeit Stuff, never ask me for anything ever again
	lifeorb: {
		onModifyDamage(damage, source, target, move) {
			return this.chainModify(1.3);
		},
		onAfterMoveSecondarySelf(source, target, move) {
			if (source && source !== target && move && move.category !== 'Status') {
				this.add('-ability', source, 'Life Orb');
				this.damage(source.baseMaxhp / 10, source, source);
			}
		},
		name: "Life Orb",
	},
	assaultvest: {
		onModifySpDPriority: 1,
		onModifySpD(spd) {
			return this.chainModify(1.5);
		},
		onDisableMove(pokemon) {
			for (const moveSlot of pokemon.moveSlots) {
				if (this.dex.moves.get(moveSlot.move).category === 'Status') {
					pokemon.disableMove(moveSlot.id);
				}
			}
		},
		name: "Assault Vest",
	},
	choiceband: {
		onStart(pokemon) {
			pokemon.abilityState.choiceLock = "";
		},
		onBeforeMove(pokemon, target, move) {
			if (move.isZOrMaxPowered || move.id === 'struggle') return;
			if (pokemon.abilityState.choiceLock && pokemon.abilityState.choiceLock !== move.id) {
				// Fails unless ability is being ignored (these events will not run), no PP lost.
				this.addMove('move', pokemon, move.name);
				this.attrLastMove('[still]');
				this.debug("Disabled by Choice Band");
				this.add('-fail', pokemon);
				return false;
			}
		},
		onModifyMove(move, pokemon) {
			if (pokemon.abilityState.choiceLock || move.isZOrMaxPowered || move.id === 'struggle') return;
			pokemon.abilityState.choiceLock = move.id;
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.volatiles['dynamax']) return;
			// PLACEHOLDER
			this.debug('Choice Band Atk Boost');
			return this.chainModify(1.5);
		},
		onDisableMove(pokemon) {
			if (!pokemon.abilityState.choiceLock) return;
			if (pokemon.volatiles['dynamax']) return;
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.id !== pokemon.abilityState.choiceLock) {
					pokemon.disableMove(moveSlot.id, false, this.effectState.sourceEffect);
				}
			}
		},
		onEnd(pokemon) {
			pokemon.abilityState.choiceLock = "";
		},
		name: "Choice Band",
	},
	choicespecs: {
		name: "Choice Specs",
		shortDesc: "This Pokemon's Sp. Atk is 1.5x, but it can only select the first move it executes.",
		onStart(pokemon) {
			pokemon.abilityState.choiceLock = "";
		},
		onBeforeMove(pokemon, target, move) {
			if (move.isZOrMaxPowered || move.id === 'struggle') return;
			if (pokemon.abilityState.choiceLock && pokemon.abilityState.choiceLock !== move.id) {
				// Fails unless ability is being ignored (these events will not run), no PP lost.
				this.addMove('move', pokemon, move.name);
				this.attrLastMove('[still]');
				this.debug("Disabled by Choice Specs");
				this.add('-fail', pokemon);
				return false;
			}
		},
		onModifyMove(move, pokemon) {
			if (pokemon.abilityState.choiceLock || move.isZOrMaxPowered || move.id === 'struggle') return;
			pokemon.abilityState.choiceLock = move.id;
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, pokemon, move) {
			if (pokemon.volatiles['dynamax']) return;
			// PLACEHOLDER
			this.debug('Choice Specs Sp. Atk Boost');
			return this.chainModify(1.5);
		},
		onDisableMove(pokemon) {
			if (!pokemon.abilityState.choiceLock) return;
			if (pokemon.volatiles['dynamax']) return;
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.id !== pokemon.abilityState.choiceLock) {
					pokemon.disableMove(moveSlot.id, false, this.effectState.sourceEffect);
				}
			}
		},
		onEnd(pokemon) {
			pokemon.abilityState.choiceLock = "";
		},
	},
	choicescarf: {
		onStart(pokemon) {
			pokemon.abilityState.choiceLock = "";
		},
		onBeforeMove(pokemon, target, move) {
			if (move.isZOrMaxPowered || move.id === 'struggle') return;
			if (pokemon.abilityState.choiceLock && pokemon.abilityState.choiceLock !== move.id) {
				// Fails unless ability is being ignored (these events will not run), no PP lost.
				this.addMove('move', pokemon, move.name);
				this.attrLastMove('[still]');
				this.debug("Disabled by Choice Scarf");
				this.add('-fail', pokemon);
				return false;
			}
		},
		onModifyMove(move, pokemon) {
			if (pokemon.abilityState.choiceLock || move.isZOrMaxPowered || move.id === 'struggle') return;
			pokemon.abilityState.choiceLock = move.id;
		},
		onModifySpe(spe, pokemon) {
			if (pokemon.volatiles['dynamax']) return;
			// PLACEHOLDER
			this.debug('Choice Scarf Spe Boost');
			return this.chainModify(1.5);
		},
		onDisableMove(pokemon) {
			if (!pokemon.abilityState.choiceLock) return;
			if (pokemon.volatiles['dynamax']) return;
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.id !== pokemon.abilityState.choiceLock) {
					pokemon.disableMove(moveSlot.id, false, this.effectState.sourceEffect);
				}
			}
		},
		onEnd(pokemon) {
			pokemon.abilityState.choiceLock = "";
		},
		name: "Choice Scarf",
	},
	eviolite: {
		onModifyDefPriority: 2,
		onModifyDef(def, pokemon) {
			if (pokemon.baseSpecies.nfe) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 2,
		onModifySpD(spd, pokemon) {
			if (pokemon.baseSpecies.nfe) {
				return this.chainModify(1.5);
			}
		},
		name: "Eviolite",
	},
	eviolith: {
		onModifyAtkPriority: 2,
		onModifyAtk(atk, pokemon) {
			if (pokemon.baseSpecies.nfe) {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 2,
		onModifySpA(spa, pokemon) {
			if (pokemon.baseSpecies.nfe) {
				return this.chainModify(1.5);
			}
		},
		name: "Eviolith",
	},
	momentumarmor: {
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			const def = pokemon.getStat('def', false, true);
			const newAtk = atk + (def / 4);
			return newAtk;
		},
		name: "Momentum Armor",
	},
	shellbell: {
		onAfterMoveSecondarySelfPriority: -1,
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (move.category !== 'Status') {
				this.heal(pokemon.baseMaxhp / 8);
			}
		},
		name: "Shell Bell",
	},
	cursedbelt: {
		onAfterMoveSecondarySelf(target, source, move) {
			if (move.category === 'Status') {
				target.addVolatile('disable');
			}
		},
		onModifyDamage(damage, source, target, move) {
			if (source.volatiles['disable']) {
				return this.chainModify(1.2);
			}
		},
		name: "Cursed Belt",
	},
	focussash: {
		onStart(pokemon) {
			pokemon.addVolatile('focussash');
		},
		condition: {
			onDamagePriority: -100,
			onDamage(damage, target, source, effect) {
				if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
					this.add('-ability', target, 'Focus Sash');
					target.removeVolatile('focussash');
					return target.hp - 1;
				}
			},
		},
		name: "Focus Sash",
	},
	leftovers: {
		onResidualOrder: 5,
		onResidualSubOrder: 5,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 16);
		},
		name: "Leftovers",
	},
	rockyhelmet: {
		onDamagingHitOrder: 2,
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				this.damage(source.baseMaxhp / 6, source, target);
			}
		},
		name: "Rocky Helmet",
	},
	blacksludge: {
		onResidualOrder: 5,
		onResidualSubOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hasType('Poison')) {
				this.heal(pokemon.baseMaxhp / 16);
			} else {
				this.damage(pokemon.baseMaxhp / 8);
			}
		},
		name: "Black Sludge",
	},
	reapercloth: {
		onResidualOrder: 5,
		onResidualSubOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hasType('Ghost')) {
				this.heal(pokemon.baseMaxhp / 16);
			}
		},
		onDisableMove(pokemon) {
			if (!pokemon.hasType('Ghost') && pokemon.lastMove && pokemon.lastMove.id !== 'struggle') {
				pokemon.disableMove(pokemon.lastMove.id);
			}
		},
		name: "Reaper Cloth",
	},
	flameorb: {
		onResidualOrder: 26,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			pokemon.trySetStatus('brn', pokemon);
		},
		name: "Flame Orb",
	},
	toxicorb: {
		onResidualOrder: 26,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			pokemon.trySetStatus('tox', pokemon);
		},
		name: "Toxic Orb",
	},
	widelens: {
		onSourceModifyAccuracyPriority: 4,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy === 'number') {
				return accuracy * 1.2;
			}
		},
		name: "Wide Lens",
	},
	zoomlens: {
		onSourceModifyAccuracyPriority: 4,
		onSourceModifyAccuracy(accuracy, target) {
			if (typeof accuracy === 'number' && (!this.queue.willMove(target) || target.newlySwitched)) {
				this.debug('Zoom Lens boosting accuracy');
				return accuracy * 1.5;
			}
		},
		name: "Zoom Lens",
	},
	protector: {
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Protector neutralize');
				return this.chainModify(0.75);
			}
		},
		name: "Protector",
	},
	quickclaw: {
		onFractionalPriorityPriority: -2,
		onFractionalPriority(priority, pokemon) {
			if (priority <= 0 && this.randomChance(1, 5)) {
				this.add('-activate', pokemon, 'ability: Quick Claw');
				return 0.1;
			}
		},
		name: "Quick Claw",
	},
	shedshell: {
		onTrapPokemonPriority: -10,
		onTrapPokemon(pokemon) {
			pokemon.trapped = pokemon.maybeTrapped = false;
		},
		name: "Shed Shell",
	},
	scopelens: {
		onModifyCritRatio(critRatio) {
			return critRatio + 1;
		},
		name: "Scope Lens",
	},
	razorclaw: {
		onModifyCritRatio(critRatio) {
			return critRatio + 1;
		},
		name: "Razor Claw",
	},
	whippeddream: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Fairy') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Whipped Dream",
	},
	pixieplate: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Fairy') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Pixie Plate",
	},
	blackbelt: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Fighting') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Black Belt",
	},
	blackglasses: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Dark') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Black Glasses",
	},
	charcoal: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Fire') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Charcoal",
	},
	dragonfang: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Dragon') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Dragon Fang",
	},
	hardstone: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Rock') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Hard Stone",
	},
	magnet: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Electric') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Magnet",
	},
	metalcoat: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Steel') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Metal Coat",
	},
	miracleseed: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Grass') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Miracle Seed",
	},
	mysticwater: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Water') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Mystic Water",
	},
	nevermeltice: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Ice') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Never-Melt Ice",
	},
	poisonbarb: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Poison') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Poison Barb",
	},
	sharpbeak: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Flying') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Sharp Beak",
	},
	silkscarf: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Normal') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Silk Scarf",
	},
	softsand: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Ground') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Soft Sand",
	},
	spelltag: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Ghost') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Spell Tag",
	},
	twistedspoon: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Psychic') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Twisted Spoon",
	},
	silverpowder: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Bug') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Silver Powder",
	},
	protectivepads: {
		onModifyMove(move) {
			delete move.flags['contact'];
		},
		name: "Protective Pads",
	},
	safetygoggles: {
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'hail' || type === 'powder') return false;
		},
		onTryHit(pokemon, source, move) {
			if (move.flags['powder'] && pokemon !== source && this.dex.getImmunity('powder', pokemon)) {
				this.add('-activate', pokemon, 'ability: Safety Goggles', move.name);
				return null;
			}
		},
		name: "Safety Goggles",
	},
	bigroot: {
		onTryHealPriority: 1,
		onTryHeal(damage, target, source, effect) {
			const heals = ['drain', 'leechseed', 'ingrain', 'aquaring', 'strengthsap'];
			if (heals.includes(effect.id)) {
				return this.chainModify([0x14CC, 0x1000]);
			}
		},
		name: "Big Root",
	},
	utilityumbrella: {
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'hail') return false;
		},
		onWeather(target, source, effect) {
			if (this.field.isWeather(['sunnyday', 'desolateland', 'hail', 'raindance', 'primordialsea', 'sandstorm'])) {
				this.heal(target.baseMaxhp / 12);
			}
		},
		name: "Utility Umbrella",
	},
	soulblade: {
		onModifyDamage(damage, source, target, move) {
			return this.chainModify([0x1199, 0x1000]);
		},
		name: "Soul Blade",
	},
	fistplate: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Fighting') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Fist Plate",
	},
	dreadplate: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Dark') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Dread Plate",
	},
	flameplate: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Fire') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Flame Plate",
	},
	dracoplate: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Dragon') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Draco Plate",
	},
	stoneplate: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Rock') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Stone Plate",
	},
	rockincense: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Rock') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Rock Incense",
	},
	zapplate: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Electric') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Zap Plate",
	},
	ironplate: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Steel') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Iron Plate",
	},
	meadowplate: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Grass') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Meadow Plate",
	},
	roseincense: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Grass') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Rose Incense",
	},
	splashplate: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Water') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Splash Plate",
	},
	seaincense: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Water') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Sea Incense",
	},
	waveincense: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Water') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Wave Incense",
	},
	icicleplate: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Ice') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Icicle Plate",
	},
	toxicplate: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Poison') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Toxic Plate",
	},
	skyplate: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Flying') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Sky Plate",
	},
	earthplate: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Ground') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Earth Plate",
	},
	spookyplate: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Ghost') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Spooky Plate",
	},
	mindplate: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Psychic') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Mind Plate",
	},
	oddincense: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Psychic') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Odd Incense",
	},
	insectplate: {
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Bug') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		name: "Insect Plate",
	},
	fullincense: {
		onFractionalPriority: -0.1,
		name: "Full Incense",
	},
	laggingtail: {
		onFractionalPriority: -0.1,
		name: "Lagging Tail",
	},
	muscleband: {
		onBasePowerPriority: 16,
		onBasePower(basePower, user, target, move) {
			if (move.category === 'Physical') {
				return this.chainModify([0x1199, 0x1000]);
			}
		},
		name: "Muscle Band",
	},
	wiseglasses: {
		onBasePowerPriority: 16,
		onBasePower(basePower, user, target, move) {
			if (move.category === 'Special') {
				return this.chainModify([0x1199, 0x1000]);
			}
		},
		name: "Wise Glasses",
	},
	focusband: {
		onDamage(damage, target, source, effect) {
			if (this.randomChance(1, 10) && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add("-activate", target, "ability: Focus Band");
				return target.hp - 1;
			}
		},
		name: "Focus Band",
	},
	metronome: {
		onStart(pokemon) {
			pokemon.addVolatile('metronome');
		},
		condition: {
			onStart(pokemon) {
				this.effectState.lastMove = '';
				this.effectState.numConsecutive = 0;
			},
			onTryMovePriority: -2,
			onTryMove(pokemon, target, move) {
				if (!pokemon.hasItem('metronome')) {
					pokemon.removeVolatile('metronome');
					return;
				}
				if (this.effectState.lastMove === move.id && pokemon.moveLastTurnResult) {
					this.effectState.numConsecutive++;
				} else if (pokemon.volatiles['twoturnmove'] && this.effectState.lastMove !== move.id) {
					this.effectState.numConsecutive = 1;
				} else {
					this.effectState.numConsecutive = 0;
				}
				this.effectState.lastMove = move.id;
			},
			onModifyDamage(damage, source, target, move) {
				const dmgMod = [0x1000, 0x1333, 0x1666, 0x1999, 0x1CCC, 0x2000];
				const numConsecutive = this.effectState.numConsecutive > 5 ? 5 : this.effectState.numConsecutive;
				return this.chainModify([dmgMod[numConsecutive], 0x1000]);
			},
		},
		name: "Metronome",
	},
};
