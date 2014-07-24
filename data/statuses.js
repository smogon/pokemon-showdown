exports.BattleStatuses = {
	brn: {
		effectType: 'Status',
		onStart: function (target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.id === 'flameorb') {
				this.add('-status', target, 'brn', '[from] item: Flame Orb');
				return;
			}
			this.add('-status', target, 'brn');
		},
		onBasePower: function (basePower, attacker, defender, move) {
			if (move && move.category === 'Physical' && attacker && attacker.ability !== 'guts' && move.id !== 'facade') {
				return this.chainModify(0.5); // This should really take place directly in the damage function but it's here for now
			}
		},
		onResidualOrder: 9,
		onResidual: function (pokemon) {
			this.damage(pokemon.maxhp / 8);
		}
	},
	par: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'par');
		},
		onModifySpe: function (speMod, pokemon) {
			if (pokemon.ability !== 'quickfeet') {
				return this.chain(speMod, 0.25);
			}
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function (pokemon) {
			if (this.random(4) === 0) {
				this.add('cant', pokemon, 'par');
				return false;
			}
		}
	},
	slp: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'slp');
			// 1-3 turns
			this.effectData.startTime = this.random(2, 5);
			this.effectData.time = this.effectData.startTime;
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function (pokemon, target, move) {
			if (pokemon.getAbility().isHalfSleep) {
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
		}
	},
	frz: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'frz');
			if (target.species === 'Shaymin-Sky' && target.baseTemplate.species === target.species) {
				var template = this.getTemplate('Shaymin');
				target.formeChange(template);
				target.baseTemplate = template;
				target.setAbility(template.abilities['0']);
				target.baseAbility = target.ability;
				target.details = template.species + (target.level === 100 ? '' : ', L' + target.level) + (target.gender === '' ? '' : ', ' + target.gender) + (target.set.shiny ? ', shiny' : '');
				this.add('detailschange', target, target.details);
				this.add('message', target.species + " has reverted to Land Forme! (placeholder)");
			}
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function (pokemon, target, move) {
			if (move.thawsUser || this.random(5) === 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'frz');
			return false;
		},
		onHit: function (target, source, move) {
			if (move.thawsTarget || move.type === 'Fire' && move.category !== 'Status') {
				target.cureStatus();
			}
		}
	},
	psn: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'psn');
		},
		onResidualOrder: 9,
		onResidual: function (pokemon) {
			this.damage(pokemon.maxhp / 8);
		}
	},
	tox: {
		effectType: 'Status',
		onStart: function (target, source, sourceEffect) {
			this.effectData.stage = 0;
			if (sourceEffect && sourceEffect.id === 'toxicorb') {
				this.add('-status', target, 'tox', '[from] item: Toxic Orb');
				return;
			}
			this.add('-status', target, 'tox');
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
		}
	},
	confusion: {
		// this is a volatile status
		onStart: function (target, source, sourceEffect) {
			var result = this.runEvent('TryConfusion', target, source, sourceEffect);
			if (!result) return result;
			this.add('-start', target, 'confusion');
			this.effectData.time = this.random(2, 6);
		},
		onEnd: function (target) {
			this.add('-end', target, 'confusion');
		},
		onBeforeMove: function (pokemon) {
			pokemon.volatiles.confusion.time--;
			if (!pokemon.volatiles.confusion.time) {
				pokemon.removeVolatile('confusion');
				return;
			}
			this.add('-activate', pokemon, 'confusion');
			if (this.random(2) === 0) {
				return;
			}
			this.directDamage(this.getDamage(pokemon, pokemon, 40));
			return false;
		}
	},
	flinch: {
		duration: 1,
		onBeforeMovePriority: 1,
		onBeforeMove: function (pokemon) {
			if (!this.runEvent('Flinch', pokemon)) {
				return;
			}
			this.add('cant', pokemon, 'flinch');
			return false;
		}
	},
	trapped: {
		noCopy: true,
		onModifyPokemon: function (pokemon) {
			pokemon.tryTrap();
		},
		onStart: function (target) {
			this.add('-activate', target, 'trapped');
		}
	},
	trapper: {
		noCopy: true
	},
	partiallytrapped: {
		duration: 5,
		durationCallback: function (target, source) {
			if (source.item === 'gripclaw') return 8;
			return this.random(5, 7);
		},
		onStart: function (pokemon, source) {
			this.add('-activate', pokemon, 'move: ' +this.effectData.sourceEffect, '[of] ' + source);
		},
		onResidualOrder: 11,
		onResidual: function (pokemon) {
			if (this.effectData.source && (!this.effectData.source.isActive || this.effectData.source.hp <= 0)) {
				pokemon.removeVolatile('partiallytrapped');
				return;
			}
			if (this.effectData.source.item === 'bindingband') {
				this.damage(pokemon.maxhp / 6);
			} else {
				this.damage(pokemon.maxhp / 8);
			}
		},
		onEnd: function (pokemon) {
			this.add('-end', pokemon, this.effectData.sourceEffect, '[partiallytrapped]');
		},
		onModifyPokemon: function (pokemon) {
			pokemon.tryTrap();
		}
	},
	lockedmove: {
		// Outrage, Thrash, Petal Dance...
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
			this.add('-end', target, 'rampage');
			target.addVolatile('confusion');
		},
		onLockMove: function (pokemon) {
			return this.effectData.move;
		}
	},
	twoturnmove: {
		// Skull Bash, SolarBeam, Sky Drop...
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
		}
	},
	choicelock: {
		onStart: function (pokemon) {
			if (!this.activeMove.id || this.activeMove.sourceEffect && this.activeMove.sourceEffect !== this.activeMove.id) return false;
			this.effectData.move = this.activeMove.id;
		},
		onModifyPokemon: function (pokemon) {
			if (!pokemon.getItem().isChoice || !pokemon.hasMove(this.effectData.move)) {
				pokemon.removeVolatile('choicelock');
				return;
			}
			if (pokemon.ignore['Item']) {
				return;
			}
			var moves = pokemon.moveset;
			for (var i = 0; i < moves.length; i++) {
				if (moves[i].id !== this.effectData.move) {
					moves[i].disabled = true;
				}
			}
		}
	},
	mustrecharge: {
		duration: 2,
		onBeforeMove: function (pokemon) {
			this.add('cant', pokemon, 'recharge');
			pokemon.removeVolatile('mustrecharge');
			return false;
		},
		onLockMove: 'recharge'
	},
	futuremove: {
		// this is a side condition
		onStart: function (side) {
			this.effectData.positions = [];
			for (var i = 0; i < side.active.length; i++) {
				this.effectData.positions[i] = null;
			}
		},
		onResidualOrder: 3,
		onResidual: function (side) {
			var finished = true;
			for (var i = 0; i < side.active.length; i++) {
				var posData = this.effectData.positions[i];
				if (!posData) continue;

				posData.duration--;

				if (posData.duration > 0) {
					finished = false;
					continue;
				}

				// time's up; time to hit! :D
				var target = side.foe.active[posData.targetPosition];
				var move = this.getMove(posData.move);
				if (target.fainted) {
					this.add('-hint', '' + move.name + ' did not hit because the target is fainted.');
					this.effectData.positions[i] = null;
					continue;
				}

				this.add('-message', '' + move.name + ' hit! (placeholder)');
				target.removeVolatile('Protect');
				target.removeVolatile('Endure');

				if (typeof posData.moveData.affectedByImmunities === 'undefined') {
					posData.moveData.affectedByImmunities = true;
				}

				this.moveHit(target, posData.source, move, posData.moveData);

				this.effectData.positions[i] = null;
			}
			if (finished) {
				side.removeSideCondition('futuremove');
			}
		}
	},
	stall: {
		// Protect, Detect, Endure counter
		duration: 2,
		counterMax: 256,
		onStart: function () {
			this.effectData.counter = 3;
		},
		onStallMove: function () {
			// this.effectData.counter should never be undefined here.
			// However, just in case, use 1 if it is undefined.
			var counter = this.effectData.counter || 1;
			this.debug("Success chance: " + Math.round(100 / counter) + "%");
			return (this.random(counter) === 0);
		},
		onRestart: function () {
			if (this.effectData.counter < this.effect.counterMax) {
				this.effectData.counter *= 3;
			}
			this.effectData.duration = 2;
		}
	},
	gem: {
		duration: 1,
		affectsFainted: true,
		onBasePower: function (basePower, user, target, move) {
			this.debug('Gem Boost');
			return this.chainModify([0x14CD, 0x1000]);
		}
	},
	aura: {
		duration: 1,
		onBasePowerPriority: 8,
		onBasePower: function (basePower, user, target, move) {
			var modifier = 4 / 3;
			this.debug('Aura Boost');
			if (user.volatiles['aurabreak']) {
				modifier = 0.75;
				this.debug('Aura Boost reverted by Aura Break');
			}
			return this.chainModify(modifier);
		}
	},

		// weather

	// weather is implemented here since it's so important to the game

	raindance: {
		effectType: 'Weather',
		duration: 5,
		durationCallback: function (source, effect) {
			if (source && source.item === 'damprock') {
				return 8;
			}
			return 5;
		},
		onBasePower: function (basePower, attacker, defender, move) {
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
			if (effect && effect.effectType === 'Ability' && this.gen <= 5) {
				this.effectData.duration = 0;
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
		}
	},
	sunnyday: {
		effectType: 'Weather',
		duration: 5,
		durationCallback: function (source, effect) {
			if (source && source.item === 'heatrock') {
				return 8;
			}
			return 5;
		},
		onBasePower: function (basePower, attacker, defender, move) {
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
			if (effect && effect.effectType === 'Ability' && this.gen <= 5) {
				this.effectData.duration = 0;
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
		}
	},
	sandstorm: {
		effectType: 'Weather',
		duration: 5,
		durationCallback: function (source, effect) {
			if (source && source.item === 'smoothrock') {
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
			if (effect && effect.effectType === 'Ability' && this.gen <= 5) {
				this.effectData.duration = 0;
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
		}
	},
	hail: {
		effectType: 'Weather',
		duration: 5,
		durationCallback: function (source, effect) {
			if (source && source.item === 'icyrock') {
				return 8;
			}
			return 5;
		},
		onStart: function (battle, source, effect) {
			if (effect && effect.effectType === 'Ability' && this.gen <= 5) {
				this.effectData.duration = 0;
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
		}
	},

	arceus: {
		// Arceus's actual typing is implemented here
		// Arceus's true typing for all its formes is Normal, and it's only
		// Multitype that changes its type, but its formes are specified to
		// be their corresponding type in the Pokedex, so that needs to be
		// overridden. This is mainly relevant for Hackmons and Balanced
		// Hackmons.
		onSwitchInPriority: 101,
		onSwitchIn: function (pokemon) {
			var type = 'Normal';
			if (pokemon.ability === 'multitype') {
				type = this.runEvent('Plate', pokemon);
				if (!type || type === true) {
					type = 'Normal';
				}
			}
			pokemon.setType(type, true);
		}
	}
};
