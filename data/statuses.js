'use strict';

/**@type {{[k: string]: EffectData}} */
let BattleStatuses = {
	brn: {
		name: 'brn',
		id: 'brn',
		num: 0,
		effectType: 'Status',
		onStart: function (target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.id === 'flameorb') {
				this.add('-status', target, 'brn', '[from] item: Flame Orb');
			} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'brn', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'brn');
			}
		},
		// Damage reduction is handled directly in the sim/battle.js damage function
		onResidualOrder: 9,
		onResidual: function (pokemon) {
			this.damage(pokemon.maxhp / 16);
		},
	},
	par: {
		name: 'par',
		id: 'par',
		num: 0,
		effectType: 'Status',
		onStart: function (target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'par', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'par');
			}
		},
		onModifySpe: function (spe, pokemon) {
			if (!pokemon.hasAbility('quickfeet')) {
				return this.chainModify(0.5);
			}
		},
		onBeforeMovePriority: 1,
		onBeforeMove: function (pokemon) {
			if (this.randomChance(1, 4)) {
				this.add('cant', pokemon, 'par');
				return false;
			}
		},
	},
	slp: {
		name: 'slp',
		id: 'slp',
		num: 0,
		effectType: 'Status',
		onStart: function (target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'slp', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'slp');
			}
			// 1-3 turns
			this.effectData.startTime = this.random(2, 5);
			this.effectData.time = this.effectData.startTime;
		},
		onBeforeMovePriority: 10,
		onBeforeMove: function (pokemon, target, move) {
			if (pokemon.hasAbility('earlybird')) {
				pokemon.statusData.time--;
			}
			pokemon.statusData.time--;
			if (pokemon.statusData.time <= 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'slp');
			if (move.sleepUsable) {
				return;
			}
			return false;
		},
	},
	frz: {
		name: 'frz',
		id: 'frz',
		num: 0,
		effectType: 'Status',
		onStart: function (target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'frz', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'frz');
			}
			if (target.template.species === 'Shaymin-Sky' && target.baseTemplate.baseSpecies === 'Shaymin') {
				target.formeChange('Shaymin', this.effect, true);
			}
		},
		onBeforeMovePriority: 10,
		onBeforeMove: function (pokemon, target, move) {
			if (move.flags['defrost']) return;
			if (this.randomChance(1, 5)) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'frz');
			return false;
		},
		onModifyMove: function (move, pokemon) {
			if (move.flags['defrost']) {
				this.add('-curestatus', pokemon, 'frz', '[from] move: ' + move);
				pokemon.setStatus('');
			}
		},
		onHit: function (target, source, move) {
			if (move.thawsTarget || move.type === 'Fire' && move.category !== 'Status') {
				target.cureStatus();
			}
		},
	},
	psn: {
		name: 'psn',
		id: 'psn',
		num: 0,
		effectType: 'Status',
		onStart: function (target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'psn', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'psn');
			}
		},
		onResidualOrder: 9,
		onResidual: function (pokemon) {
			this.damage(pokemon.maxhp / 8);
		},
	},
	tox: {
		name: 'tox',
		id: 'tox',
		num: 0,
		effectType: 'Status',
		onStart: function (target, source, sourceEffect) {
			this.effectData.stage = 0;
			if (sourceEffect && sourceEffect.id === 'toxicorb') {
				this.add('-status', target, 'tox', '[from] item: Toxic Orb');
			} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'tox', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'tox');
			}
		},
		onSwitchIn: function () {
			this.effectData.stage = 0;
		},
		onResidualOrder: 9,
		onResidual: function (pokemon) {
			if (this.effectData.stage < 15) {
				this.effectData.stage++;
			}
			this.damage(this.clampIntRange(pokemon.maxhp / 16, 1) * this.effectData.stage);
		},
	},
	confusion: {
		name: 'confusion',
		id: 'confusion',
		num: 0,
		// this is a volatile status
		onStart: function (target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.id === 'lockedmove') {
				this.add('-start', target, 'confusion', '[fatigue]');
			} else {
				this.add('-start', target, 'confusion');
			}
			this.effectData.time = this.random(2, 6);
		},
		onEnd: function (target) {
			this.add('-end', target, 'confusion');
		},
		onBeforeMovePriority: 3,
		onBeforeMove: function (pokemon) {
			pokemon.volatiles.confusion.time--;
			if (!pokemon.volatiles.confusion.time) {
				pokemon.removeVolatile('confusion');
				return;
			}
			this.add('-activate', pokemon, 'confusion');
			if (!this.randomChance(1, 3)) {
				return;
			}
			this.activeTarget = pokemon;
			this.damage(this.getDamage(pokemon, pokemon, 40), pokemon, pokemon, {
				id: 'confused',
				effectType: 'Move',
				// @ts-ignore
				type: '???',
			});
			return false;
		},
	},
	flinch: {
		name: 'flinch',
		id: 'flinch',
		num: 0,
		duration: 1,
		onBeforeMovePriority: 8,
		onBeforeMove: function (pokemon) {
			if (!this.runEvent('Flinch', pokemon)) {
				return;
			}
			this.add('cant', pokemon, 'flinch');
			return false;
		},
	},
	trapped: {
		name: 'trapped',
		id: 'trapped',
		num: 0,
		noCopy: true,
		onTrapPokemon: function (pokemon) {
			pokemon.tryTrap();
		},
		onStart: function (target) {
			this.add('-activate', target, 'trapped');
		},
	},
	trapper: {
		name: 'trapper',
		id: 'trapper',
		num: 0,
		noCopy: true,
	},
	partiallytrapped: {
		name: 'partiallytrapped',
		id: 'partiallytrapped',
		num: 0,
		duration: 5,
		durationCallback: function (target, source) {
			if (source.hasItem('gripclaw')) return 8;
			return this.random(5, 7);
		},
		onStart: function (pokemon, source) {
			this.add('-activate', pokemon, 'move: ' + this.effectData.sourceEffect, '[of] ' + source);
		},
		onResidualOrder: 11,
		onResidual: function (pokemon) {
			if (this.effectData.source && (!this.effectData.source.isActive || this.effectData.source.hp <= 0 || !this.effectData.source.activeTurns)) {
				delete pokemon.volatiles['partiallytrapped'];
				return;
			}
			if (this.effectData.source.hasItem('bindingband')) {
				this.damage(pokemon.maxhp / 6);
			} else {
				this.damage(pokemon.maxhp / 8);
			}
		},
		onEnd: function (pokemon) {
			this.add('-end', pokemon, this.effectData.sourceEffect, '[partiallytrapped]');
		},
		onTrapPokemon: function (pokemon) {
			if (this.effectData.source && this.effectData.source.isActive) pokemon.tryTrap();
		},
	},
	lockedmove: {
		// Outrage, Thrash, Petal Dance...
		name: 'lockedmove',
		id: 'lockedmove',
		num: 0,
		duration: 2,
		onResidual: function (target) {
			if (target.status === 'slp') {
				// don't lock, and bypass confusion for calming
				delete target.volatiles['lockedmove'];
			}
			this.effectData.trueDuration--;
		},
		onStart: function (target, source, effect) {
			this.effectData.trueDuration = this.random(2, 4);
			this.effectData.move = effect.id;
		},
		onRestart: function () {
			if (this.effectData.trueDuration >= 2) {
				this.effectData.duration = 2;
			}
		},
		onEnd: function (target) {
			if (this.effectData.trueDuration > 1) return;
			target.addVolatile('confusion');
		},
		onLockMove: function (pokemon) {
			return this.effectData.move;
		},
	},
	twoturnmove: {
		// Skull Bash, SolarBeam, Sky Drop...
		name: 'twoturnmove',
		id: 'twoturnmove',
		num: 0,
		duration: 2,
		onStart: function (target, source, effect) {
			this.effectData.move = effect.id;
			// source and target are reversed since the event target is the
			// pokemon using the two-turn move
			this.effectData.targetLoc = this.getTargetLoc(source, target);
			target.addVolatile(effect.id, source);
		},
		onEnd: function (target) {
			target.removeVolatile(this.effectData.move);
		},
		onLockMove: function () {
			return this.effectData.move;
		},
		onLockMoveTarget: function () {
			return this.effectData.targetLoc;
		},
		onMoveAborted: function (pokemon) {
			pokemon.removeVolatile('twoturnmove');
		},
	},
	choicelock: {
		name: 'choicelock',
		id: 'choicelock',
		num: 0,
		noCopy: true,
		onStart: function (pokemon) {
			if (!this.activeMove) throw new Error("Battle.activeMove is null");
			if (!this.activeMove.id || this.activeMove.hasBounced) return false;
			this.effectData.move = this.activeMove.id;
		},
		onBeforeMove: function (pokemon, target, move) {
			if (!pokemon.getItem().isChoice) {
				pokemon.removeVolatile('choicelock');
				return;
			}
			if (!pokemon.ignoringItem() && move.id !== this.effectData.move && move.id !== 'struggle') {
				// Fails unless the Choice item is being ignored, and no PP is lost
				this.addMove('move', pokemon, move.name);
				this.attrLastMove('[still]');
				this.add('-fail', pokemon);
				return false;
			}
		},
		onDisableMove: function (pokemon) {
			if (!pokemon.getItem().isChoice || !pokemon.hasMove(this.effectData.move)) {
				pokemon.removeVolatile('choicelock');
				return;
			}
			if (pokemon.ignoringItem()) {
				return;
			}
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.id !== this.effectData.move) {
					pokemon.disableMove(moveSlot.id, false, this.effectData.sourceEffect);
				}
			}
		},
	},
	mustrecharge: {
		name: 'mustrecharge',
		id: 'mustrecharge',
		num: 0,
		duration: 2,
		onBeforeMovePriority: 11,
		onBeforeMove: function (pokemon) {
			this.add('cant', pokemon, 'recharge');
			pokemon.removeVolatile('mustrecharge');
			pokemon.removeVolatile('truant');
			return null;
		},
		onLockMove: function (pokemon) {
			this.add('-mustrecharge', pokemon);
			return 'recharge';
		},
	},
	futuremove: {
		// this is a side condition
		name: 'futuremove',
		id: 'futuremove',
		num: 0,
		onStart: function (side) {
			this.effectData.positions = [];
			// @ts-ignore
			for (let i = 0; i < side.active.length; i++) {
				this.effectData.positions[i] = null;
			}
		},
		onResidualOrder: 3,
		onResidual: function (side) {
			let finished = true;
			// @ts-ignore
			for (const [i, target] of side.active.entries()) {
				let posData = this.effectData.positions[i];
				if (!posData) continue;

				posData.duration--;

				if (posData.duration > 0) {
					finished = false;
					continue;
				}

				// time's up; time to hit! :D
				const move = this.getMove(posData.move);
				if (target.fainted) {
					this.add('-hint', '' + move.name + ' did not hit because the target is fainted.');
					this.effectData.positions[i] = null;
					continue;
				}

				this.add('-end', target, 'move: ' + move.name);
				target.removeVolatile('Protect');
				target.removeVolatile('Endure');

				if (posData.source.hasAbility('infiltrator') && this.gen >= 6) {
					posData.moveData.infiltrates = true;
				}
				const hitMove = new this.Data.Move(posData.moveData);

				this.tryMoveHit(target, posData.source, hitMove);

				this.effectData.positions[i] = null;
			}
			if (finished) {
				// @ts-ignore
				side.removeSideCondition('futuremove');
			}
		},
	},
	healreplacement: {
		// this is a side condition
		name: 'healreplacement',
		id: 'healreplacement',
		num: 0,
		onStart: function (side, source, sourceEffect) {
			this.effectData.position = source.position;
			this.effectData.sourceEffect = sourceEffect;
			this.add('-activate', source, 'healreplacement');
		},
		onSwitchInPriority: 1,
		onSwitchIn: function (target) {
			if (!target.fainted && target.position === this.effectData.position) {
				target.heal(target.maxhp);
				this.add('-heal', target, target.getHealth, '[from] move: ' + this.effectData.sourceEffect, '[zeffect]');
				target.side.removeSideCondition('healreplacement');
			}
		},
	},
	stall: {
		// Protect, Detect, Endure counter
		name: 'stall',
		id: 'stall',
		num: 0,
		duration: 2,
		counterMax: 729,
		onStart: function () {
			this.effectData.counter = 3;
		},
		onStallMove: function (pokemon) {
			// this.effectData.counter should never be undefined here.
			// However, just in case, use 1 if it is undefined.
			let counter = this.effectData.counter || 1;
			this.debug("Success chance: " + Math.round(100 / counter) + "%");
			let success = this.randomChance(1, counter);
			if (!success) delete pokemon.volatiles['stall'];
			return success;
		},
		onRestart: function () {
			// @ts-ignore
			if (this.effectData.counter < this.effect.counterMax) {
				this.effectData.counter *= 3;
			}
			this.effectData.duration = 2;
		},
	},
	gem: {
		name: 'gem',
		id: 'gem',
		num: 0,
		duration: 1,
		affectsFainted: true,
		onBasePower: function (basePower, user, target, move) {
			this.debug('Gem Boost');
			return this.chainModify([0x14CD, 0x1000]);
		},
	},

	// weather is implemented here since it's so important to the game

	raindance: {
		name: 'RainDance',
		id: 'raindance',
		num: 0,
		effectType: 'Weather',
		duration: 5,
		durationCallback: function (source, effect) {
			if (source && source.hasItem('damprock')) {
				return 8;
			}
			return 5;
		},
		onWeatherModifyDamage: function (damage, attacker, defender, move) {
			if (move.type === 'Water') {
				this.debug('rain water boost');
				return this.chainModify(1.5);
			}
			if (move.type === 'Fire') {
				this.debug('rain fire suppress');
				return this.chainModify(0.5);
			}
		},
		onStart: function (battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				if (this.gen <= 5) this.effectData.duration = 0;
				this.add('-weather', 'RainDance', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'RainDance');
			}
		},
		onResidualOrder: 1,
		onResidual: function () {
			this.add('-weather', 'RainDance', '[upkeep]');
			this.eachEvent('Weather');
		},
		onEnd: function () {
			this.add('-weather', 'none');
		},
	},
	primordialsea: {
		name: 'PrimordialSea',
		id: 'primordialsea',
		num: 0,
		effectType: 'Weather',
		duration: 0,
		onTryMove: function (target, source, effect) {
			if (effect.type === 'Fire' && effect.category !== 'Status') {
				this.debug('Primordial Sea fire suppress');
				this.add('-fail', source, effect, '[from] Primordial Sea');
				return null;
			}
		},
		onWeatherModifyDamage: function (damage, attacker, defender, move) {
			if (move.type === 'Water') {
				this.debug('Rain water boost');
				return this.chainModify(1.5);
			}
		},
		onStart: function (battle, source, effect) {
			this.add('-weather', 'PrimordialSea', '[from] ability: ' + effect, '[of] ' + source);
		},
		onResidualOrder: 1,
		onResidual: function () {
			this.add('-weather', 'PrimordialSea', '[upkeep]');
			this.eachEvent('Weather');
		},
		onEnd: function () {
			this.add('-weather', 'none');
		},
	},
	sunnyday: {
		name: 'SunnyDay',
		id: 'sunnyday',
		num: 0,
		effectType: 'Weather',
		duration: 5,
		durationCallback: function (source, effect) {
			if (source && source.hasItem('heatrock')) {
				return 8;
			}
			return 5;
		},
		onWeatherModifyDamage: function (damage, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Sunny Day fire boost');
				return this.chainModify(1.5);
			}
			if (move.type === 'Water') {
				this.debug('Sunny Day water suppress');
				return this.chainModify(0.5);
			}
		},
		onStart: function (battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				if (this.gen <= 5) this.effectData.duration = 0;
				this.add('-weather', 'SunnyDay', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'SunnyDay');
			}
		},
		onImmunity: function (type) {
			if (type === 'frz') return false;
		},
		onResidualOrder: 1,
		onResidual: function () {
			this.add('-weather', 'SunnyDay', '[upkeep]');
			this.eachEvent('Weather');
		},
		onEnd: function () {
			this.add('-weather', 'none');
		},
	},
	desolateland: {
		name: 'DesolateLand',
		id: 'desolateland',
		num: 0,
		effectType: 'Weather',
		duration: 0,
		onTryMove: function (target, source, effect) {
			if (effect.type === 'Water' && effect.category !== 'Status') {
				this.debug('Desolate Land water suppress');
				this.add('-fail', source, effect, '[from] Desolate Land');
				return null;
			}
		},
		onWeatherModifyDamage: function (damage, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Sunny Day fire boost');
				return this.chainModify(1.5);
			}
		},
		onStart: function (battle, source, effect) {
			this.add('-weather', 'DesolateLand', '[from] ability: ' + effect, '[of] ' + source);
		},
		onImmunity: function (type) {
			if (type === 'frz') return false;
		},
		onResidualOrder: 1,
		onResidual: function () {
			this.add('-weather', 'DesolateLand', '[upkeep]');
			this.eachEvent('Weather');
		},
		onEnd: function () {
			this.add('-weather', 'none');
		},
	},
	sandstorm: {
		name: 'Sandstorm',
		id: 'sandstorm',
		num: 0,
		effectType: 'Weather',
		duration: 5,
		durationCallback: function (source, effect) {
			if (source && source.hasItem('smoothrock')) {
				return 8;
			}
			return 5;
		},
		// This should be applied directly to the stat before any of the other modifiers are chained
		// So we give it increased priority.
		onModifySpDPriority: 10,
		onModifySpD: function (spd, pokemon) {
			if (pokemon.hasType('Rock') && this.isWeather('sandstorm')) {
				return this.modify(spd, 1.5);
			}
		},
		onStart: function (battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				if (this.gen <= 5) this.effectData.duration = 0;
				this.add('-weather', 'Sandstorm', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'Sandstorm');
			}
		},
		onResidualOrder: 1,
		onResidual: function () {
			this.add('-weather', 'Sandstorm', '[upkeep]');
			if (this.isWeather('sandstorm')) this.eachEvent('Weather');
		},
		onWeather: function (target) {
			this.damage(target.maxhp / 16);
		},
		onEnd: function () {
			this.add('-weather', 'none');
		},
	},
	hail: {
		name: 'Hail',
		id: 'hail',
		num: 0,
		effectType: 'Weather',
		duration: 5,
		durationCallback: function (source, effect) {
			if (source && source.hasItem('icyrock')) {
				return 8;
			}
			return 5;
		},
		onStart: function (battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				if (this.gen <= 5) this.effectData.duration = 0;
				this.add('-weather', 'Hail', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'Hail');
			}
		},
		onResidualOrder: 1,
		onResidual: function () {
			this.add('-weather', 'Hail', '[upkeep]');
			if (this.isWeather('hail')) this.eachEvent('Weather');
		},
		onWeather: function (target) {
			this.damage(target.maxhp / 16);
		},
		onEnd: function () {
			this.add('-weather', 'none');
		},
	},
	deltastream: {
		name: 'DeltaStream',
		id: 'deltastream',
		num: 0,
		effectType: 'Weather',
		duration: 0,
		onEffectiveness: function (typeMod, target, type, move) {
			if (move && move.effectType === 'Move' && type === 'Flying' && typeMod > 0) {
				this.add('-activate', '', 'deltastream');
				return 0;
			}
		},
		onStart: function (battle, source, effect) {
			this.add('-weather', 'DeltaStream', '[from] ability: ' + effect, '[of] ' + source);
		},
		onResidualOrder: 1,
		onResidual: function () {
			this.add('-weather', 'DeltaStream', '[upkeep]');
			this.eachEvent('Weather');
		},
		onEnd: function () {
			this.add('-weather', 'none');
		},
	},

	// Arceus and Silvally's actual typing is implemented here.
	// Their true typing for all their formes is Normal, and it's only
	// Multitype and RKS System, respectively, that changes their type,
	// but their formes are specified to be their corresponding type
	// in the Pokedex, so that needs to be overridden.
	// This is mainly relevant for Hackmons and Balanced Hackmons.
	arceus: {
		name: 'Arceus',
		id: 'arceus',
		num: 493,
		onTypePriority: 1,
		onType: function (types, pokemon) {
			let type = 'Normal';
			if (pokemon.ability === 'multitype') {
				// @ts-ignore
				type = pokemon.getItem().onPlate;
				// @ts-ignore
				if (!type || type === true) {
					type = 'Normal';
				}
			}
			return [type];
		},
	},
	silvally: {
		name: 'Silvally',
		id: 'silvally',
		num: 773,
		onTypePriority: 1,
		onType: function (types, pokemon) {
			let type = 'Normal';
			if (pokemon.ability === 'rkssystem') {
				// @ts-ignore
				type = pokemon.getItem().onMemory;
				// @ts-ignore
				if (!type || type === true) {
					type = 'Normal';
				}
			}
			return [type];
		},
	},
};

exports.BattleStatuses = BattleStatuses;
