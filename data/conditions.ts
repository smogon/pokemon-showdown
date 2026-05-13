export const Conditions: import('../sim/dex-conditions').ConditionDataTable = {
	brn: {
		name: 'brn',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.id === 'flameorb') {
				this.add('-status', target, 'brn', '[from] item: Flame Orb');
			} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'brn', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-status', target, 'brn');
			}
		},
		// Damage reduction is handled directly in the sim/battle.js damage function
		onResidualOrder: 10,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 16);
		},
	},
	par: {
		name: 'par',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'par', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-status', target, 'par');
			}
		},
		onModifySpePriority: -101,
		onModifySpe(spe, pokemon) {
			// Paralysis occurs after all other Speed modifiers, so evaluate all modifiers up to this point first
			spe = this.finalModify(spe);
			if (!pokemon.hasAbility('quickfeet')) {
				spe = Math.floor(spe * 50 / 100);
			}
			return spe;
		},
		onBeforeMovePriority: 1,
		onBeforeMove(pokemon) {
			if (this.randomChance(1, 4)) {
				this.add('cant', pokemon, 'par');
				return false;
			}
		},
	},
	slp: {
		name: 'slp',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'slp', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else if (sourceEffect && sourceEffect.effectType === 'Move') {
				this.add('-status', target, 'slp', `[from] move: ${sourceEffect.name}`);
			} else {
				this.add('-status', target, 'slp');
			}
			// 1-3 turns
			this.effectState.startTime = this.random(2, 5);
			this.effectState.time = this.effectState.startTime;

			if (target.removeVolatile('nightmare')) {
				this.add('-end', target, 'Nightmare', '[silent]');
			}
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
			if (pokemon.hasAbility('earlybird')) {
				pokemon.statusState.time--;
			}
			pokemon.statusState.time--;
			if (pokemon.statusState.time <= 0) {
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
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'frz', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-status', target, 'frz');
			}
			if (target.species.name === 'Shaymin-Sky' && target.baseSpecies.baseSpecies === 'Shaymin') {
				target.formeChange('Shaymin', this.effect, true);
			}
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
			if (move.flags['defrost'] && !(move.id === 'burnup' && !pokemon.hasType('Fire'))) return;
			if (this.randomChance(1, 5)) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'frz');
			return false;
		},
		onModifyMove(move, pokemon) {
			if (move.flags['defrost']) {
				this.add('-curestatus', pokemon, 'frz', `[from] move: ${move}`);
				pokemon.clearStatus();
			}
		},
		onAfterMoveSecondary(target, source, move) {
			if (move.thawsTarget) {
				target.cureStatus();
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Fire' && move.category !== 'Status' && move.id !== 'polarflare') {
				target.cureStatus();
			}
		},
	},
	fst: {
		name: 'fst',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.id === 'frostorb') {
				this.add('-status', target, 'fst', '[from] item: Frost Orb');
			} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'fst', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-status', target, 'fst');
			}
		},
		// Damage reduction is handled directly in the sim/battle.js damage function
		onResidualOrder: 10,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 16);
		},
	},
	psn: {
		name: 'psn',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'psn', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-status', target, 'psn');
			}
		},
		onResidualOrder: 9,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 8);
		},
	},
	tox: {
		name: 'tox',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			this.effectState.stage = 0;
			if (sourceEffect && sourceEffect.id === 'toxicorb') {
				this.add('-status', target, 'tox', '[from] item: Toxic Orb');
			} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'tox', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-status', target, 'tox');
			}
		},
		onSwitchIn() {
			this.effectState.stage = 0;
		},
		onResidualOrder: 9,
		onResidual(pokemon) {
			if (this.effectState.stage < 15) {
				this.effectState.stage++;
			}
			this.damage(this.clampIntRange(pokemon.baseMaxhp / 16, 1) * this.effectState.stage);
		},
	},
	blt: {
		name: 'blt',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			this.effectState.stage = 0;
			this.add('-status', target, 'blt');
		},
		onSwitchIn() {
			this.effectState.stage = 0;
		},
		onResidualOrder: 9,
		onResidual(pokemon) {
			if (this.effectState.stage < 7) {
				this.effectState.stage++;
			}
			this.damage(this.clampIntRange(pokemon.baseMaxhp / 8, 1) * this.effectState.stage);
		},
		onDamage(damage, target, source, effect) {
			if ((effect && effect.id === 'blt') && (damage >= target.hp)) return target.hp - 1;
		},
	},
	confusion: {
		name: 'confusion',
		// this is a volatile status
		onStart(target, source, sourceEffect) {
			if (sourceEffect?.id === 'lockedmove') {
				this.add('-start', target, 'confusion', '[fatigue]');
			} else if (sourceEffect?.effectType === 'Ability') {
				this.add('-start', target, 'confusion', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-start', target, 'confusion');
			}
			const min = sourceEffect?.id === 'axekick' ? 3 : 2;
			this.effectState.time = this.random(min, 6);
		},
		onEnd(target) {
			this.add('-end', target, 'confusion');
		},
		onBeforeMovePriority: 3,
		onBeforeMove(pokemon) {
			pokemon.volatiles['confusion'].time--;
			if (!pokemon.volatiles['confusion'].time) {
				pokemon.removeVolatile('confusion');
				return;
			}
			this.add('-activate', pokemon, 'confusion');
			if (!this.randomChance(33, 100)) {
				return;
			}
			this.activeTarget = pokemon;
			const damage = this.actions.getConfusionDamage(pokemon, 40);
			if (typeof damage !== 'number') throw new Error("Confusion damage not dealt");
			const activeMove = { id: this.toID('confused'), effectType: 'Move', type: '???' };
			this.damage(damage, pokemon, pokemon, activeMove as ActiveMove);
			return false;
		},
	},
	flinch: {
		name: 'flinch',
		duration: 1,
		onBeforeMovePriority: 8,
		onBeforeMove(pokemon) {
			this.add('cant', pokemon, 'flinch');
			this.runEvent('Flinch', pokemon);
			return false;
		},
	},
	trapped: {
		name: 'trapped',
		noCopy: true,
		onTrapPokemon(pokemon) {
			pokemon.tryTrap();
		},
		onStart(target) {
			this.add('-activate', target, 'trapped');
		},
	},
	trapper: {
		name: 'trapper',
		noCopy: true,
	},
	partiallytrapped: {
		name: 'partiallytrapped',
		duration: 5,
		durationCallback(target, source) {
			if (source?.hasItem('gripclaw')) return 8;
			return this.random(5, 7);
		},
		onStart(pokemon, source) {
			this.add('-activate', pokemon, 'move: ' + this.effectState.sourceEffect, `[of] ${source}`);
			this.effectState.boundDivisor = source.hasItem('bindingband') ? 6 : 8;
		},
		onResidualOrder: 13,
		onResidual(pokemon) {
			const source = this.effectState.source;
			// G-Max Centiferno and G-Max Sandblast continue even after the user leaves the field
			const gmaxEffect = ['gmaxcentiferno', 'gmaxsandblast'].includes(this.effectState.sourceEffect.id);
			if (source && (!source.isActive || source.hp <= 0 || !source.activeTurns) && !gmaxEffect) {
				delete pokemon.volatiles['partiallytrapped'];
				this.add('-end', pokemon, this.effectState.sourceEffect, '[partiallytrapped]', '[silent]');
				return;
			}
			this.damage(pokemon.baseMaxhp / this.effectState.boundDivisor);
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, this.effectState.sourceEffect, '[partiallytrapped]');
		},
		onTrapPokemon(pokemon) {
			const gmaxEffect = ['gmaxcentiferno', 'gmaxsandblast'].includes(this.effectState.sourceEffect.id);
			if (this.effectState.source?.isActive || gmaxEffect) pokemon.tryTrap();
		},
	},
	lockedmove: {
		// Outrage, Thrash, Petal Dance...
		name: 'lockedmove',
		duration: 2,
		onResidual(target) {
			if (target.status === 'slp') {
				// don't lock, and bypass confusion for calming
				delete target.volatiles['lockedmove'];
			}
			this.effectState.trueDuration--;
		},
		onStart(target, source, effect) {
			this.effectState.trueDuration = this.random(2, 4);
			this.effectState.move = effect.id;
		},
		onRestart() {
			if (this.effectState.trueDuration >= 2) {
				this.effectState.duration = 2;
			}
		},
		onAfterMove(pokemon) {
			if (this.effectState.duration === 1) {
				pokemon.removeVolatile('lockedmove');
			}
		},
		onEnd(target) {
			if (this.effectState.trueDuration > 1) return;
			target.addVolatile('confusion');
		},
		onLockMove(pokemon) {
			if (pokemon.volatiles['dynamax']) return;
			return this.effectState.move;
		},
	},
	twoturnmove: {
		// Skull Bash, SolarBeam, Sky Drop...
		name: 'twoturnmove',
		duration: 2,
		onStart(attacker, defender, effect) {
			// ("attacker" is the Pokemon using the two turn move and the Pokemon this condition is being applied to)
			this.effectState.move = effect.id;
			attacker.addVolatile(effect.id);
			// lastMoveTargetLoc is the location of the originally targeted slot before any redirection
			// note that this is not updated for moves called by other moves
			// i.e. if Dig is called by Metronome, lastMoveTargetLoc will still be the user's location
			let moveTargetLoc: number = attacker.lastMoveTargetLoc!;
			if (effect.sourceEffect && this.dex.moves.get(effect.id).target !== 'self') {
				// this move was called by another move such as Metronome
				// and needs a random target to be determined this turn
				// it will already have one by now if there is any valid target
				// but if there isn't one we need to choose a random slot now
				if (defender.fainted) {
					defender = this.sample(attacker.foes(true));
				}
				moveTargetLoc = attacker.getLocOf(defender);
			}
			attacker.volatiles[effect.id].targetLoc = moveTargetLoc;
			this.attrLastMove('[still]');
			// Run side-effects normally associated with hitting (e.g., Protean, Libero)
			this.runEvent('PrepareHit', attacker, defender, effect);
		},
		onEnd(target) {
			target.removeVolatile(this.effectState.move);
		},
		onLockMove() {
			return this.effectState.move;
		},
		onMoveAborted(pokemon) {
			pokemon.removeVolatile('twoturnmove');
		},
	},
	choicelock: {
		name: 'choicelock',
		noCopy: true,
		onStart(pokemon) {
			if (!this.activeMove) throw new Error("Battle.activeMove is null");
			if (!this.activeMove.id || this.activeMove.hasBounced || this.activeMove.sourceEffect === 'snatch') return false;
			this.effectState.move = this.activeMove.id;
		},
		onBeforeMove(pokemon, target, move) {
			if (!pokemon.getItem().isChoice) {
				pokemon.removeVolatile('choicelock');
				return;
			}
			if (
				!pokemon.ignoringItem() && !pokemon.volatiles['dynamax'] &&
				move.id !== this.effectState.move && move.id !== 'struggle'
			) {
				// Fails unless the Choice item is being ignored, and no PP is lost
				this.addMove('move', pokemon, move.name);
				this.attrLastMove('[still]');
				this.debug("Disabled by Choice item lock");
				this.add('-fail', pokemon);
				return false;
			}
		},
		onDisableMove(pokemon) {
			if (!pokemon.getItem().isChoice || !pokemon.hasMove(this.effectState.move)) {
				pokemon.removeVolatile('choicelock');
				return;
			}
			if (pokemon.ignoringItem() || pokemon.volatiles['dynamax']) {
				return;
			}
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.id !== this.effectState.move) {
					pokemon.disableMove(moveSlot.id, false, this.effectState.sourceEffect);
				}
			}
		},
	},
	mustrecharge: {
		name: 'mustrecharge',
		duration: 2,
		onBeforeMovePriority: 11,
		onBeforeMove(pokemon) {
			this.add('cant', pokemon, 'recharge');
			pokemon.removeVolatile('mustrecharge');
			pokemon.removeVolatile('truant');
			return null;
		},
		onStart(pokemon) {
			this.add('-mustrecharge', pokemon);
		},
		onLockMove: 'recharge',
	},
	futuremove: {
		// this is a slot condition
		name: 'futuremove',
		onStart(target) {
			this.effectState.targetSlot = target.getSlot();
			this.effectState.endingTurn = (this.turn - 1) + 2;
			if (this.effectState.endingTurn >= 254) {
				this.hint(`In Gen 8+, Future attacks will never resolve when used on the 255th turn or later.`);
			}
		},
		onResidualOrder: 3,
		onResidual(target: Pokemon) {
			if (this.getOverflowedTurnCount() < this.effectState.endingTurn) return;
			target.side.removeSlotCondition(this.getAtSlot(this.effectState.targetSlot), 'futuremove');
		},
		onEnd(target) {
			const data = this.effectState;
			// time's up; time to hit! :D
			const move = this.dex.moves.get(data.move);
			if (target.fainted || target === data.source) {
				this.hint(`${move.name} did not hit because the target is ${(target.fainted ? 'fainted' : 'the user')}.`);
				return;
			}

			this.add('-end', target, 'move: ' + move.name);
			target.removeVolatile('Protect');
			target.removeVolatile('Endure');

			if (data.source.hasAbility('infiltrator') && this.gen >= 6) {
				data.moveData.infiltrates = true;
			}
			if (data.source.hasAbility('normalize') && this.gen >= 6) {
				data.moveData.type = 'Normal';
			}
			const hitMove = new this.dex.Move(data.moveData) as ActiveMove;

			this.actions.trySpreadMoveHit([target], data.source, hitMove, true);
			if (data.source.isActive && data.source.hasItem('lifeorb') && this.gen >= 5) {
				this.singleEvent('AfterMoveSecondarySelf', data.source.getItem(), data.source.itemState, data.source, target, data.source.getItem());
			}
			this.activeMove = null;

			this.checkWin();
		},
	},
	healreplacement: {
		// this is a slot condition
		name: 'healreplacement',
		onStart(target, source, sourceEffect) {
			this.effectState.sourceEffect = sourceEffect;
			this.add('-activate', source, 'healreplacement');
		},
		onSwitchIn(target) {
			if (!target.fainted) {
				target.heal(target.maxhp);
				this.add('-heal', target, target.getHealth, '[from] move: ' + this.effectState.sourceEffect.name, '[zeffect]');
				target.side.removeSlotCondition(target, 'healreplacement');
			}
		},
	},
	stall: {
		// Protect, Detect, Endure counter
		name: 'stall',
		duration: 2,
		counterMax: 729,
		onStart() {
			this.effectState.counter = 3;
		},
		onStallMove(pokemon) {
			// this.effectState.counter should never be undefined here.
			// However, just in case, use 1 if it is undefined.
			const counter = this.effectState.counter || 1;
			this.debug(`Success chance: ${Math.round(100 / counter)}%`);
			const success = this.randomChance(1, counter);
			if (!success) delete pokemon.volatiles['stall'];
			return success;
		},
		onRestart() {
			if (this.effectState.counter < (this.effect as Condition).counterMax!) {
				this.effectState.counter *= 3;
			}
			this.effectState.duration = 2;
		},
	},
	gem: {
		name: 'gem',
		duration: 1,
		affectsFainted: true,
		onBasePowerPriority: 14,
		onBasePower(basePower, user, target, move) {
			this.debug('Gem Boost');
			return this.chainModify([5325, 4096]);
		},
	},
	caffeinecrash: {
		name: 'caffeinecrash',
		noCopy: true,
		duration: 3,
		onStart(target, source, sourceEffect) {
			this.add('-start', target, 'caffeinecrash', '[from] item: ' + sourceEffect.name);
		},
		onModifyPriority(priority, pokemon, target, move) {
			return priority - 0.1;
		},
		onFractionalPriorityPriority: -2,
		onFractionalPriority(priority, pokemon, target, move) {
			return -0.1;
		},
		onEnd(target) {
			this.add('-end', target, 'caffeinecrash');
		},
	},

	// weather is implemented here since it's so important to the game

	// Climate Weathergy

	sunnyday: {
		name: 'SunnyDay',
		effectType: 'ClimateWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('weatherballoon')) {
				return 8;
			}
			return 5;
		},
		onClimateWeatherModifyDamage(damage, attacker, defender, move) {
			if (move.id === 'hydrosteam' && attacker.effectiveClimateWeather() === 'sunnyday') {
				this.debug('Sunny Day Hydro Steam boost');
				return this.chainModify(1.5);
			}
			if (defender.effectiveClimateWeather() !== 'sunnyday') return;
			if (move.type === 'Fire') {
				if (defender.hasAbility('droughtproof')) return;
				this.debug('Sunny Day fire boost');
				if (this.field.climateWeatherState.boosted) {
					this.debug('Boosted further by Strong Winds');
					return this.chainModify(1.6);
				} else {
					return this.chainModify(1.5);
				}
			}
			if (move.type === 'Water') {
				if (attacker.hasAbility('droughtproof')) return;
				this.debug('Sunny Day water suppress');
				if (this.field.climateWeatherState.boosted) {
					this.debug('Suppressed further by Strong Winds');
					return this.chainModify(0.4);
				} else {
					return this.chainModify(0.5);
				}
			}
		},
		onFieldStart(battle, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.climateWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-climateWeather', 'SunnyDay', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-climateWeather', 'SunnyDay');
			}
		},
		onImmunity(type, pokemon) {
			if (pokemon.effectiveClimateWeather() !== 'sunnyday') return;
			if (type === 'frz') return false;
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-climateWeather', 'SunnyDay', '[upkeep]');
			this.eachEvent('ClimateWeather');
		},
		onFieldEnd() {
			this.add('-climateWeather', 'none');
		},
	},
	raindance: {
		name: 'RainDance',
		effectType: 'ClimateWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('weatherballoon')) {
				return 8;
			}
			return 5;
		},
		onClimateWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.effectiveClimateWeather() !== 'raindance') return;
			if (move.type === 'Water') {
				if (defender.hasAbility(['droughtproof', 'hydrophobic'])) return;
				this.debug('rain water boost');
				if (this.field.climateWeatherState.boosted) {
					this.debug('Boosted further by Strong Winds');
					return this.chainModify(1.6);
				} else {
					return this.chainModify(1.5);
				}
			}
			if (move.type === 'Fire') {
				if (attacker.hasAbility(['droughtproof', 'hydrophobic'])) return;
				this.debug('rain fire suppress');
				if (this.field.climateWeatherState.boosted) {
					this.debug('Supressed further by Strong Winds');
					return this.chainModify(0.4);
				} else {
					return this.chainModify(0.5);
				}
			}
		},
		onModifyDamage(damage, attacker, defender, move) {
			let petrichorActive = false;
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasAbility('petrichor') && pokemon.effectiveClimateWeather() === this.field.climateWeather) {
					petrichorActive = true;
				}
			}
			if (!petrichorActive) return;
			if (defender.effectiveClimateWeather() !== 'raindance') return;
			if (move?.type === 'Fairy') {
				this.debug('Blood Moon Fairy suppress');
				return this.chainModify(0.5);
			}
		},
		onModifyPriority(priority, pokemon, target, move) {
			let petrichorActive = false;
			for (const allActive of this.getAllActive()) {
				if (allActive.hasAbility('petrichor') && allActive.effectiveClimateWeather() === this.field.climateWeather) {
					petrichorActive = true;
				}
			}
			if (!petrichorActive) return;
			if (pokemon.effectiveClimateWeather() !== 'raindance') return;
			if (pokemon.hasType('Dark') && move?.category === 'Status') return priority + 1;
		},
		onModifyMove(move, pokemon) {
			let petrichorActive = false;
			for (const allActive of this.getAllActive()) {
				if (allActive.hasAbility('petrichor') && allActive.effectiveClimateWeather() === this.field.climateWeather) {
					petrichorActive = true;
				}
			}
			if (!petrichorActive) return;
			if (pokemon.effectiveClimateWeather() !== 'raindance') return;
			if (!this.field.climateWeatherState.boosted) return;
			if (pokemon.hasType('Dark') && move.basePower && move.basePower <= 60) {
				this.debug('Strong Winds-boosted Blood Moon crit');
				move.willCrit = true;
			}
		},
		onTryHit(target, source, move) {
			let petrichorActive = false;
			for (const allActive of this.getAllActive()) {
				if (allActive.hasAbility('petrichor') && allActive.effectiveClimateWeather() === this.field.climateWeather) {
					petrichorActive = true;
				}
			}
			if (!petrichorActive) return;
			if (target.effectiveClimateWeather() !== 'raindance') return;
			if (this.field.climateWeatherState.boosted &&
				target.hasType('Dark') && move.category === 'Status' && target !== source) {
				this.add('-immune', target);
				this.hint("Dark types are immune to Status moves in Strong Winds-boosted Blood Moon.");
				return null;
			}
		},
		onFieldStart(field, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.climateWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-climateWeather', 'RainDance', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-climateWeather', 'RainDance');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-climateWeather', 'RainDance', '[upkeep]');
			this.eachEvent('ClimateWeather');
		},
		onFieldEnd() {
			this.add('-climateWeather', 'none');
		},
	},
	hail: {
		name: 'Hail',
		effectType: 'ClimateWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('weatherballoon')) {
				return 8;
			}
			return 5;
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-climateWeather', 'Hail', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-climateWeather', 'Hail');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-climateWeather', 'Hail', '[upkeep]');
			if (this.field.isClimateWeather('hail')) this.eachEvent('ClimateWeather');
		},
		onClimateWeather(target) {
			this.damage(target.baseMaxhp / 16);
		},
		onFieldEnd() {
			this.add('-climateWeather', 'none');
		},
	},
	snowscape: {
		name: 'Snowscape',
		effectType: 'ClimateWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('weatherballoon')) {
				return 8;
			}
			return 5;
		},
		onModifyDefPriority: 10,
		onModifyDef(def, pokemon) {
			if (pokemon.effectiveClimateWeather() !== 'snowscape') return;
			if (pokemon.hasType('Ice') && pokemon.effectiveClimateWeather() === 'snowscape') {
				return this.modify(def, 1.5);
			}
		},
		onModifySpDPriority: 10,
		onModifySpD(spd, pokemon) {
			if (pokemon.effectiveClimateWeather() !== 'snowscape') return;
			if (pokemon.hasType('Ice') &&
				pokemon.effectiveClimateWeather() === 'snowscape' && this.field.climateWeatherState.boosted) {
				this.debug('Boosted further by Strong Winds');
				return this.modify(spd, 1.5);
			}
		},
		onFieldStart(field, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.climateWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-climateWeather', 'Snowscape', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-climateWeather', 'Snowscape');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-climateWeather', 'Snowscape', '[upkeep]');
			if (this.field.isClimateWeather('snowscape')) this.eachEvent('ClimateWeather');
		},
		onClimateWeather(target) {
			if (target.effectiveClimateWeather() !== 'snowscape') return;
			if (this.field.climateWeatherState.boosted && !target.hasType('Ice')) {
				this.damage(target.baseMaxhp / 16);
			}
		},
		onFieldEnd() {
			this.add('-climateWeather', 'none');
		},
	},
	bloodmoon: {
		name: 'bloodmoon',
		effectType: 'ClimateWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('weatherballoon')) {
				return 8;
			}
			return 5;
		},
		onClimateWeatherModifyDamage(damage, attacker, defender, move) {
			let petrichorActive = false;
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasAbility('petrichor') && pokemon.effectiveClimateWeather() === this.field.climateWeather) {
					petrichorActive = true;
				}
			}
			if (!petrichorActive) return;
			if (defender.effectiveClimateWeather() !== 'bloodmoon') return;
			if (move.type === 'Water') {
				if (defender.hasAbility(['droughtproof', 'hydrophobic'])) return;
				this.debug('rain water boost');
				if (this.field.climateWeatherState.boosted) {
					this.debug('Boosted further by Strong Winds');
					return this.chainModify(1.6);
				} else {
					return this.chainModify(1.5);
				}
			}
			if (move.type === 'Fire') {
				if (attacker.hasAbility(['droughtproof', 'hydrophobic'])) return;
				this.debug('rain fire suppress');
				if (this.field.climateWeatherState.boosted) {
					this.debug('Supressed further by Strong Winds');
					return this.chainModify(0.4);
				} else {
					return this.chainModify(0.5);
				}
			}
		},
		onModifyDamage(damage, attacker, defender, move) {
			if (defender.effectiveClimateWeather() !== 'bloodmoon') return;
			if (move?.type === 'Fairy') {
				this.debug('Blood Moon Fairy suppress');
				return this.chainModify(0.5);
			}
		},
		onModifyPriority(priority, pokemon, target, move) {
			if (pokemon.effectiveClimateWeather() !== 'bloodmoon') return;
			if (pokemon.hasType('Dark') && move?.category === 'Status') {
				return priority + 1;
			}
		},
		onModifyMove(move, pokemon) {
			if (pokemon.effectiveClimateWeather() !== 'bloodmoon') return;
			if (!this.field.climateWeatherState.boosted) return;
			if (pokemon.hasType('Dark') && move.basePower && move.basePower <= 60) {
				this.debug('Strong Winds-boosted Blood Moon guaranteed crit');
				move.willCrit = true;
			}
		},
		onTryHit(target, source, move) {
			if (target.effectiveClimateWeather() !== 'bloodmoon') return;
			if (this.field.climateWeatherState.boosted &&
				target.hasType('Dark') && move?.category === 'Status' && target !== source) {
				this.add('-immune', target);
				this.hint("Dark types are immune to Status moves in Strong Winds-boosted Blood Moon.");
				return null;
			}
		},
		onFieldStart(field, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.climateWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-climateWeather', 'BloodMoon', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-climateWeather', 'BloodMoon');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-climateWeather', 'BloodMoon', '[upkeep]');
			this.eachEvent('ClimateWeather');
		},
		onFieldEnd() {
			this.add('-climateWeather', 'none');
		},
	},
	foghorn: { // tested, works as intended
		name: 'Foghorn',
		effectType: 'ClimateWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('weatherballoon')) {
				return 8;
			}
			return 5;
		},
		onModifyAccuracyPriority: -1,
		onModifyAccuracy(accuracy, target, source, move) {
			if (target.effectiveClimateWeather() !== 'foghorn' ||
				source.hasAbility(['droughtproof', 'warpmist', 'protean'])) return;
			if (typeof accuracy === 'number' && move?.type !== 'Normal' && move?.type !== '???') {
				// This one piece of code took over 5 hours to do because it was reading move as move: Pokemon and not move: ActiveMove
				this.debug('Fog accuracy decrease');
				return this.chainModify(0.9);
			}
		},
		onModifyMovePriority: -5,
		onModifyMove(move, target, pokemon) {
			if (target.effectiveClimateWeather() !== 'foghorn') return;
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) && this.field.climateWeatherState.boosted) {
				this.debug('SW fog type change and BP boost');
				move.type = '???';
				move.basePower *= 1.5;
			}
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Normal'] = true;
			}
		},
		onSwitchIn(pokemon) {
			if (pokemon.hasType('Normal') && this.field.climateWeatherState.boosted) {
				pokemon.setType('???');
				pokemon.fogType = true;
				// this.hint("Normal types turn Typeless in Strong Winds-boosted Fog.");
			}
		},
		onSwitchOut(pokemon) {
			if (pokemon.hasType('???') && pokemon.fogType) {
				pokemon.setType(pokemon.baseTypes);
			}
		},
		onModifyType(move, pokemon, target) {
			if (pokemon.hasType('Normal') && this.field.climateWeatherState.boosted) {
				pokemon.setType('???');
				pokemon.fogType = true;
				// this.hint("Normal types turn Typeless in Strong Winds-boosted Fog.");
			}
		},
		onFieldStart(field, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.climateWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-climateWeather', 'Foghorn', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-climateWeather', 'Foghorn');
			}
			if (this.field.climateWeatherState.boosted) {
				for (const pokemon of this.getAllActive()) {
					if (pokemon.hasType('Normal')) {
						pokemon.setType('???');
						pokemon.fogType = true;
						this.hint("Normal types turn Typeless in Strong Winds-boosted Fog.");
					}
				}
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-climateWeather', 'Foghorn', '[upkeep]');
			this.eachEvent('ClimateWeather');
		},
		onFieldEnd() {
			for (const pokemon of this.getAllActive()) {
				// This check is for the
				if (pokemon.fogType) {
					if (pokemon.hasType('???')) pokemon.setType(pokemon.baseTypes);
					pokemon.fogType = false;
				}
			}
			this.add('-climateWeather', 'none');
		},
	},

	// Irritant Weathergy

	sandstorm: {
		name: 'Sandstorm',
		effectType: 'IrritantWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('volatilespray')) {
				return 8;
			}
			return 5;
		},
		// This should be applied directly to the stat before any of the other modifiers are chained
		// So we give it increased priority.
		onModifySpDPriority: 10,
		onModifySpD(spd, pokemon) {
			if (pokemon.effectiveIrritantWeather() !== 'sandstorm') return;
			if (pokemon.hasType('Rock') && pokemon.effectiveIrritantWeather() === 'sandstorm') {
				return this.modify(spd, 1.5);
			}
			if ((pokemon.hasType('Steel') || pokemon.hasType('Ground')) &&
				pokemon.effectiveIrritantWeather() === 'sandstorm' && this.field.irritantWeatherState.boosted) {
				this.debug('Boosted further by Strong Winds');
				return this.modify(spd, 1.5);
			}
		},
		onModifyDefPriority: 10,
		onModifyDef(def, pokemon) {
			if (pokemon.effectiveIrritantWeather() !== 'sandstorm') return;
			if (pokemon.hasType('Rock') &&
				pokemon.effectiveIrritantWeather() === 'sandstorm' && this.field.irritantWeatherState.boosted) {
				this.debug('Boosted further by Strong Winds');
				return this.modify(def, 1.5);
			}
		},
		onFieldStart(field, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.irritantWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-irritantWeather', 'Sandstorm', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-irritantWeather', 'Sandstorm');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-irritantWeather', 'Sandstorm', '[upkeep]');
			if (this.field.isIrritantWeather('sandstorm')) this.eachEvent('IrritantWeather');
		},
		onIrritantWeather(target) {
			if (target.effectiveIrritantWeather() !== 'sandstorm' || target.hasAbility('bubblehelm')) return;
			this.damage(target.baseMaxhp / 16);
		},
		onFieldEnd() {
			this.add('-irritantWeather', 'none');
		},
	},
	duststorm: {
		name: 'DustStorm',
		effectType: 'IrritantWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('volatilespray')) {
				return 8;
			}
			return 5;
		},
		onIrritantWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.effectiveIrritantWeather() !== 'duststorm' ||
				attacker.hasAbility(['overcoat', 'earthforce', 'bubblehelm', 'dustgather'])) return;
			if (move.type === 'Water' || move.type === 'Grass') {
				this.debug('Dust Storm Water/Grass supress');
				return this.chainModify(0.5);
			}
		},
		onModifySpePriority: 10,
		onModifySpe(spe, pokemon) {
			if (pokemon.effectiveIrritantWeather() !== 'duststorm') return;
			if (pokemon.hasType('Ground') && pokemon.effectiveIrritantWeather() === 'duststorm') {
				return this.modify(spe, 1.25);
			}
		},
		onModifyMovePriority: -5,
		onModifyMove(move, target, pokemon) {
			if (target.effectiveIrritantWeather() !== 'duststorm' || target.hasAbility(['eartheater', 'bubblehelm'])) return;
			if (this.field.irritantWeatherState.boosted) {
				if (!move.ignoreImmunity) move.ignoreImmunity = {};
				if (move.ignoreImmunity !== true) {
					this.debug('Boosted further by Strong Winds');
					move.ignoreImmunity['Ground'] = true;
				}
			}
		},
		onFieldStart(field, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.irritantWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-irritantWeather', 'DustStorm', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-irritantWeather', 'DustStorm');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-irritantWeather', 'DustStorm', '[upkeep]');
			this.eachEvent('IrritantWeather');
		},
		onFieldEnd() {
			this.add('-irritantWeather', 'none');
		},
	},
	pollinate: {
		name: 'Pollinate',
		effectType: 'IrritantWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('volatilespray')) {
				return 8;
			}
			return 5;
		},
		onModifyAtkPriority: 10,
		onModifyAtk(atk, pokemon) {
			if (pokemon.effectiveIrritantWeather() !== 'pollinate' || pokemon.hasAbility(['bubblehelm', 'bloomspring'])) return;
			if (pokemon.hasType('Grass') || pokemon.hasType('Bug')) {
				return;
			} else {
				return this.modify(atk, 0.75);
			}
		},
		onModifySpAPriority: 10,
		onModifySpA(spa, pokemon) {
			if (pokemon.effectiveIrritantWeather() !== 'pollinate' || pokemon.hasAbility(['bubblehelm', 'bloomspring'])) return;
			if (pokemon.hasType('Grass') || pokemon.hasType('Bug')) {
				return;
			} else {
				return this.modify(spa, 0.75);
			}
		},
		onAccuracy(accuracy, target, source, move) {
			if (target.effectiveIrritantWeather() !== 'pollinate') return;
			if (move.flags['powder'] && source.effectiveIrritantWeather() === 'pollinate') {
				return true;
			}
			return accuracy;
		},
		onFieldStart(field, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.irritantWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
				this.field.setTerrain('grassyterrain', source);
				this.debug('strong winds pollen sets grassy terrain');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-irritantWeather', 'Pollinate', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-irritantWeather', 'Pollinate');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-irritantWeather', 'Pollinate', '[upkeep]');
			this.eachEvent('IrritantWeather');
		},
		onFieldEnd() {
			this.add('-irritantWeather', 'none');
		},
	},
	swarmsignal: {
		name: 'SwarmSignal',
		effectType: 'IrritantWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('volatilespray')) {
				return 8;
			}
			return 5;
		},
		onModifyAccuracyPriority: 10,
		onModifyAccuracy(accuracy, target, source) {
			if (target.effectiveIrritantWeather() !== 'swarmsignal') return;
			if (typeof accuracy === 'number' && (source.hasType('Bug') || source.hasType('Poison'))) {
				this.debug('pheromones accuracy boost');
				return this.modify(accuracy, 4 / 3);
			}
		},
		onModifySpePriority: 10,
		onModifySpe(spe, pokemon) {
			if (pokemon.effectiveIrritantWeather() !== 'swarmsignal') return;
			if (pokemon.hasType('Bug') || pokemon.hasType('Poison')) {
				return this.modify(spe, 1.5);
			}
		},
		onModifyDamage(damage, source, target, move) {
			if (source.effectiveIrritantWeather() !== 'swarmsignal') return;
			if (this.field.irritantWeatherState.boosted && source.hasType('Bug')) {
				if (target.getMoveHitData(move).typeMod < 0) {
					this.debug('Swarm Signal Tinted Lens boost');
					return this.chainModify(2);
				}
			}
		},
		onFieldStart(field, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.irritantWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-irritantWeather', 'SwarmSignal', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-irritantWeather', 'SwarmSignal');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-irritantWeather', 'SwarmSignal', '[upkeep]');
			this.eachEvent('IrritantWeather');
		},
		onFieldEnd() {
			this.add('-irritantWeather', 'none');
		},
	},
	smogspread: {
		name: 'SmogSpread',
		effectType: 'IrritantWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('volatilespray')) {
				return 8;
			}
			return 5;
		},
		onFieldStart(field, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.irritantWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-irritantWeather', 'SmogSpread', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-irritantWeather', 'SmogSpread');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-irritantWeather', 'SmogSpread', '[upkeep]');
			if (this.field.isIrritantWeather('smogspread')) this.eachEvent('IrritantWeather');
		},
		onBeforeResidual(target) {
			if (target.effectiveIrritantWeather() !== 'smogspread' || target.hasAbility(['bubblehelm', 'carboncapture'])) return;
			if (this.field.irritantWeatherState.duration && this.field.irritantWeatherState.duration <= 1) return;
			if (target.status === 'psn' && this.field.irritantWeatherState.boosted) {
				target.clearStatus();
				target.trySetStatus('tox', null);
			} else {
				if (target.getStatus() !== null && !target.hasType('Steel') && !target.hasType('Poison') &&
					!['psn', 'tox', 'blt'].includes(target.status) && this.field.irritantWeatherState.boosted) {
					target.clearStatus();
				}
				target.trySetStatus('psn');
			}
		},
		onFieldEnd() {
			this.add('-irritantWeather', 'none');
		},
	},
	sprinkle: {
		name: 'Sprinkle',
		effectType: 'IrritantWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('volatilespray')) {
				return 8;
			}
			return 5;
		},
		onModifySpDPriority: 10,
		onModifySpD(spd, pokemon) {
			if (pokemon.effectiveIrritantWeather() !== 'sprinkle') return;
			if (pokemon.hasType('Fairy')) {
				return this.modify(spd, 1.25);
			}
		},
		onFieldStart(field, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.irritantWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
				this.field.setTerrain('mistyterrain', source);
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-irritantWeather', 'Sprinkle', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-irritantWeather', 'Sprinkle');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-irritantWeather', 'Sprinkle', '[upkeep]');
			this.eachEvent('IrritantWeather');
		},
		onIrritantWeather(target) {
			if (target.effectiveIrritantWeather() !== 'sprinkle') return;
			this.heal(target.baseMaxhp / 16);
		},
		onFieldEnd() {
			this.add('-irritantWeather', 'none');
		},
	},

	// Energy Weathergy

	auraprojection: {
		name: 'AuraProjection',
		effectType: 'EnergyWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('energychannelizer')) {
				return 8;
			}
			return 5;
		},
		onModifyCritRatioPriority: 10,
		onModifyCritRatio(critRatio, pokemon) {
			if (!pokemon.hasType('Fighting') || pokemon.effectiveEnergyWeather() !== 'auraprojection') return;
			return critRatio + 1;
		},
		onAccuracy(accuracy, target, source, move) {
			if (target.effectiveEnergyWeather() !== 'auraprojection') return;
			if (source !== target && move.type === 'Fighting') {
				this.chainModify(1.2);
			}
			return accuracy;
		},
		onTryBoost(boost, target, source, effect) {
			if (this.field.energyWeatherState.boosted) {
				if (target.effectiveEnergyWeather() !== 'auraprojection') return;
				if (target.hasType('Fighting')) {
					if (source && target === source) return;
					let showMsg = false;
					let i: BoostID;
					for (i in boost) {
						if (boost[i]! < 0) {
							delete boost[i];
							showMsg = true;
						}
					}
					if (showMsg && !(effect as ActiveMove).secondaries && effect.id !== 'octolock') {
						this.add("-fail", target, "unboost", "[from] energyWeather: Battle Aura", `[of] ${target}`);
					}
				}
			}
		},
		onFieldStart(field, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.energyWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-energyWeather', 'AuraProjection', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-energyWeather', 'AuraProjection');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-energyWeather', 'AuraProjection', '[upkeep]');
			this.eachEvent('EnergyWeather');
		},
		onFieldEnd() {
			this.add('-energyWeather', 'none');
		},
	},
	haunt: {
		name: 'Haunt',
		effectType: 'EnergyWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('energychannelizer')) {
				return 8;
			}
			return 5;
		},
		onModifyMovePriority: -5,
		onModifyMove(move, target, pokemon) {
			if (target?.item === 'energynullifier' || move.type !== 'Ghost') return;
			if (this.field.energyWeatherState.boosted) {
				if (!move.ignoreImmunity) move.ignoreImmunity = {};
				if (move.ignoreImmunity !== true) {
					this.debug('Boosted further by Strong Winds');
					move.ignoreImmunity['Ghost'] = true;
				}
			}
		},
		onEffectiveness(typeMod, target, type, move) {
			if (this.field.energyWeatherState.boosted) {
				if (target?.item === 'energynullifier' || move.type !== 'Ghost') return;
				if (type === 'Normal') return 1;
			}
		},
		onFieldStart(field, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.energyWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-energyWeather', 'Haunt', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-energyWeather', 'Haunt');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-energyWeather', 'Haunt', '[upkeep]');
			if (this.field.isEnergyWeather('haunt')) this.eachEvent('EnergyWeather');
		},
		onEnergyWeather(target) {
			if (target.effectiveEnergyWeather() !== 'haunt') return;
			this.damage(target.baseMaxhp / 16); // ghost, normal and dark's damage immunity added to typechart.ts
		},
		onFieldEnd() {
			this.add('-energyWeather', 'none');
		},
	},
	daydream: {
		name: 'Daydream',
		effectType: 'EnergyWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('energychannelizer')) {
				return 8;
			}
			return 5;
		},
		onEnergyWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.effectiveEnergyWeather() !== 'daydream') return;
			if (move.type === 'Psychic') {
				this.debug('Daydream Psychic boost');
				return this.chainModify(1.5);
			}
			if (move.type === 'Dark') {
				this.debug('Daydream Dark suppress');
				return this.chainModify(0.5);
			}
		},
		onFieldStart(battle, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.energyWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
				this.field.setTerrain('psychicterrain', source);
				this.debug('strong winds dreamscape sets psychic terrain');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-energyWeather', 'Daydream', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-energyWeather', 'Daydream');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-energyWeather', 'Daydream', '[upkeep]');
			this.eachEvent('EnergyWeather');
		},
		onFieldEnd() {
			this.add('-energyWeather', 'none');
		},
	},
	dragonforce: {
		name: 'DragonForce',
		effectType: 'EnergyWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('energychannelizer')) {
				return 8;
			}
			return 5;
		},
		onModifyDamage(damage, attacker, defender, move) {
			if (defender.effectiveEnergyWeather() !== 'dragonforce') return;
			if (move && defender.getMoveHitData(move).typeMod > 0) {
				this.debug('Dragon Force super-effective supress');
				return this.chainModify(0.8);
			}
		},
		onEnergyWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.effectiveEnergyWeather() !== 'dragonforce') return;
			if (this.field.energyWeatherState.boosted) {
				if (move.type === 'Dragon') {
					this.debug('Dragon Force SW dragon boost');
					return this.chainModify(1.5);
				}
			} else {
				if (move.type === 'Dragon') {
					this.debug('Dragon Force dragon boost');
					return this.chainModify(1.25);
				}
			}
		},
		onAfterMoveSecondarySelf(source, target, move) {
			if (this.field.energyWeatherState.boosted) {
				if (source.effectiveEnergyWeather() !== 'dragonforce') return;
				if (source && source !== target && move && move.category !== 'Status' && !source.forceSwitchFlag &&
					!source.hasType('Dragon')) {
					this.damage(source.baseMaxhp / 10);
				}
			}
		},
		onFieldStart(battle, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.energyWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-energyWeather', 'DragonForce', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-energyWeather', 'DragonForce');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-energyWeather', 'DragonForce', '[upkeep]');
			this.eachEvent('EnergyWeather');
		},
		onFieldEnd() {
			this.add('-energyWeather', 'none');
		},
	},
	supercell: {
		name: 'Supercell',
		effectType: 'EnergyWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('energychannelizer')) {
				return 8;
			}
			return 5;
		},
		onModifySpePriority: 10,
		onModifySpe(spe, pokemon) {
			if (pokemon.effectiveEnergyWeather() !== 'supercell') return;
			if (pokemon.hasType('Electric')) {
				return this.modify(spe, 1.5);
			}
		},
		onFieldStart(battle, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.energyWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
				this.field.setTerrain('electricterrain', source);
				this.debug('strong winds thunderstorm sets electric terrain');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-energyWeather', 'Supercell', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-energyWeather', 'Supercell');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-energyWeather', 'Supercell', '[upkeep]');

			// Lightning Strike is run here so it only triggers once per turn
			// If run in onEnergyWeather() it runs once for each active pokemon
			const validTargets = [];
			let lightningRodPresent = false;
			let forkedPresent = false;
			// Handle Forked taking targetting priority over Lightning Rod
			for (const target of this.getAllActive()) {
				if (target.effectiveEnergyWeather() === 'supercell') {
					if (target.hasAbility('lightningrod') || target.hasAbility('powerplumage')) {
						lightningRodPresent = true;
					}
				}
			}
			// Form list of valid lightning strike targets
			for (const target of this.getAllActive()) {
				if (target.effectiveEnergyWeather() === 'supercell') {
					if (lightningRodPresent) {
						if (target.hasAbility('lightningrod') || target.hasAbility('powerplumage')) {
							validTargets.push(target);
						}
					} else {
						forkedPresent = false;
						for (const ally of target.alliesAndSelf()) {
							if (ally.hasAbility('forked') && ally.effectiveEnergyWeather() === 'supercell') forkedPresent = true;
						}
						if (!forkedPresent) validTargets.push(target);
					}
				}
			}
			if (validTargets.length > 0) {
				let lightningStrikes = 1;
				forkedPresent = false;
				for (const target of this.getAllActive()) {
					if (target.hasAbility('forked') && target.effectiveEnergyWeather() === 'supercell') forkedPresent = true;
				}
				if (forkedPresent) lightningStrikes = 2;
				for (let i = 0; i < lightningStrikes; i++) {
					let target = validTargets[0];
					if (validTargets.length > 1) {
						target = validTargets.splice(this.random(validTargets.length), 1)[0];
					}
					let typeMod = 1;
					// weak to electric
					if (target.hasType('Water')) typeMod *= 2;
					if (target.hasType('Flying')) typeMod *= 2;
					// resist electric
					if (target.hasType('Grass')) typeMod *= 0.5;
					if (target.hasType('Dragon')) typeMod *= 0.5;
					// immune to lightning
					if (target.hasType('Electric')) typeMod *= 0;
					if (target.hasType('Ground')) typeMod *= 0;
					if (target.hasAbility('lightningrod') || target.hasAbility('motordrive') || target.hasAbility('voltabsorb')) {
						typeMod = 0;
					}
					this.debug('lightning strike damage is based on the Pokemon\'s weakness/resistance to Electric');
					this.damage(typeMod * target.baseMaxhp / 10, target);
					// electric types gain charge and take no damage
					if (target.hasType('Electric')) {
						target.addVolatile('charge');
						this.hint("Electric types gain the Charge effect when struck by lightning.");
					} else if (target.hasType('Ground')) { // ground types lose speed
						this.boost({ spe: -1 }, target);
						this.hint("Ground types receive -1 Speed when struck by lightning.");
					}
					if (target.hasAbility('lightningrod')) {
						if (!this.boost({ spa: 1 }, target)) {
							this.add('-immune', target, '[from] ability: Lightning Rod');
						}
						this.hint("Pokemon with Lightning Rod draw in any lightning strike.");
					}
					if (target.hasAbility('motordrive')) {
						if (!this.boost({ spe: 1 }, target)) {
							this.add('-immune', target, '[from] ability: Motor Drive');
						}
						this.hint("Pokemon with Motor Drive receive +1 Speed when struck by lightning.");
					}
					if (target.hasAbility('voltabsorb')) {
						if (!target.heal(target.baseMaxhp / 4, target)) {
							this.add('-immune', target, '[from] ability: Volt Absorb');
						}
						this.hint("Pokemon with Volt Absorb heal from lightning strikes.");
					}
				}
			}

			this.eachEvent('EnergyWeather');
		},
		onFieldEnd() {
			this.add('-energyWeather', 'none');
		},
	},
	magnetize: {
		name: 'Magnetize',
		effectType: 'EnergyWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('energychannelizer')) {
				return 8;
			}
			return 5;
		},
		onFieldStart(battle, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.energyWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-energyWeather', 'Magnetize', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-energyWeather', 'Magnetize');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-energyWeather', 'Magnetize', '[upkeep]');
			if (this.field.energyWeatherState.boosted) {
				for (const pokemon of this.getAllActive()) {
					if (pokemon.effectiveEnergyWeather() === 'magnetize' && pokemon.hasType('Steel')) {
						pokemon.addVolatile('magnetizeboost');
					} else {
						pokemon.removeVolatile('magnetizeboost');
					}
				}
			} else {
				for (const pokemon of this.getAllActive()) {
					pokemon.removeVolatile('magnetizeboost');
				}
			}
			this.eachEvent('EnergyWeather');
		},
		onFieldEnd() {
			for (const pokemon of this.getAllActive()) {
				pokemon.removeVolatile('magnetizeboost');
			}
			this.add('-energyWeather', 'none');
		},
	},
	magnetizeboost: {
		noCopy: true,
		onStart(pokemon) {
			this.effectState.layers = 1;
			this.add('-start', pokemon, 'magnetizeboost1', '[silent]');
		},
		onRestart(pokemon) {
			if (this.effectState.layers >= 8) return;
			this.add('-end', pokemon, `magnetizeboost${this.effectState.layers}`, '[silent]');
			this.effectState.layers++;
			this.add('-start', pokemon, `magnetizeboost${this.effectState.layers}`, '[silent]');
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, `magnetizeboost${this.effectState.layers}`, '[silent]');
		},
		onModifyAtkPriority: 10,
		onModifyAtk(atk, pokemon) {
			if (pokemon.effectiveEnergyWeather() !== 'magnetize' || !pokemon.hasType('Steel')) return;
			return this.modify(atk, 1 + 0.2 * this.effectState.layers);
		},
		onModifySpAPriority: 10,
		onModifySpA(spa, pokemon) {
			if (pokemon.effectiveEnergyWeather() !== 'magnetize' || !pokemon.hasType('Steel')) return;
			return this.modify(spa, 1 + 0.2 * this.effectState.layers);
		},
	},

	// Clearing Weathergy

	strongwinds: {
		name: 'Strong Winds',
		effectType: 'ClearingWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('portableturbine')) {
				return 8;
			}
			return 5;
		},
		onModifySpePriority: 10,
		onModifySpe(spe, pokemon) {
			if (!pokemon.isGrounded() && this.field.isClearingWeather('strongwinds')) {
				return this.modify(spe, 1.25);
			}
		},
		onAccuracy(accuracy, target, source, move) {
			if (move.flags['wind'] && this.field.isClearingWeather('strongwinds')) {
				return true;
			}
			return accuracy;
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-clearingWeather', 'StrongWinds', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-clearingWeather', 'StrongWinds');
			}
			if (['sunnyday', 'raindance', 'hail', 'snowscape',
				'bloodmoon', 'foghorn'].includes(this.field.effectiveClimateWeather())) {
				this.field.clearClimateWeather();
				this.debug('Cleared Climate Weathers');
			}
			if (['sandstorm', 'duststorm', 'pollinate',
				'swarmsignal', 'smogspread', 'sprinkle'].includes(this.field.effectiveIrritantWeather())) {
				this.field.clearIrritantWeather();
				this.debug('Cleared Irritant Weathers');
			}
			if (['auraprojection', 'haunt', 'daydream',
				'dragonforce', 'supercell', 'magnetize'].includes(this.field.effectiveEnergyWeather())) {
				this.field.clearEnergyWeather();
				this.debug('Cleared Energy Weathers');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-clearingWeather', 'StrongWinds', '[upkeep]');
			this.eachEvent('ClearingWeather');
		},
		onFieldEnd() {
			this.add('-clearingWeather', 'none');
		},
	},

	// Cataclysm weathers

	/* cataclysmiclight: { // TODO: client side implementation
		name: 'Cataclysmic Light',
		effectType: 'CataclysmWeather',
		duration: 0,
		onCataclysmWeatherModifyDamage(damage, attacker, defender, move) {
			let damageModifier = 1;
			if (attacker.baseSpecies.tags.includes('Ultra Beast')) {
				damageModifier *= 1.25;
				this.debug('Cataclysmic Light damage buff');
			}
			if (defender.baseSpecies.tags.includes('Ultra Beast')) {
				damageModifier *= 0.75;
				this.debug("Cataclysmic Light damage debuff");
			}
			return this.chainModify(damageModifier);
		},
		onFieldStart(field, source, effect) {
			this.add('-cataclysmWeather', 'CataclysmicLight', '[from] ability: ' + effect.name, `[of] ${source}`);
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-cataclysmWeather', 'Cataclysmic', '[upkeep]');
			this.eachEvent('CataclysmWeather');
		},
		onFieldEnd() {
			this.add('-cataclysmWeather', 'none');
		},
	}, */

	// Extra weathers

	desolateland: {
		name: 'DesolateLand',
		effectType: 'ClimateWeather',
		duration: 0,
		onTryMovePriority: 1,
		onTryMove(attacker, defender, move) {
			if (move.type === 'Water' && move.category !== 'Status') {
				this.debug('Desolate Land water suppress');
				this.add('-fail', attacker, move, '[from] Desolate Land');
				this.attrLastMove('[still]');
				return null;
			}
		},
		onClimateWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.effectiveClimateWeather() !== 'desolateland') return;
			if (move.type === 'Fire') {
				this.debug('Desolate Land fire boost');
				return this.chainModify(1.5);
			}
		},
		onFieldStart(field, source, effect) {
			this.add('-climateWeather', 'DesolateLand', '[from] ability: ' + effect.name, `[of] ${source}`);
		},
		onImmunity(type, pokemon) {
			if (pokemon.effectiveClimateWeather() !== 'desolateland') return;
			if (type === 'frz') return false;
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-climateWeather', 'DesolateLand', '[upkeep]');
			this.eachEvent('ClimateWeather');
		},
		onFieldEnd() {
			this.add('-climateWeather', 'none');
		},
	},
	primordialsea: {
		name: 'PrimordialSea',
		effectType: 'ClimateWeather',
		duration: 0,
		onTryMovePriority: 1,
		onTryMove(attacker, defender, move) {
			if (move.type === 'Fire' && move.category !== 'Status') {
				this.debug('Primordial Sea fire suppress');
				this.add('-fail', attacker, move, '[from] Primordial Sea');
				this.attrLastMove('[still]');
				return null;
			}
		},
		onClimateWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.effectiveClimateWeather() !== 'primordialsea') return;
			if (move.type === 'Water') {
				this.debug('Rain water boost');
				return this.chainModify(1.5);
			}
		},
		onFieldStart(field, source, effect) {
			this.add('-climateWeather', 'PrimordialSea', '[from] ability: ' + effect.name, `[of] ${source}`);
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-climateWeather', 'PrimordialSea', '[upkeep]');
			this.eachEvent('ClimateWeather');
		},
		onFieldEnd() {
			this.add('-climateWeather', 'none');
		},
	},
	deltastream: {
		name: 'DeltaStream',
		effectType: 'ClearingWeather',
		duration: 0,
		onEffectivenessPriority: -1,
		onEffectiveness(typeMod, target, type, move) {
			if (move && move.effectType === 'Move' && move.category !== 'Status' && type === 'Flying' && typeMod > 0) {
				this.add('-fieldactivate', 'Delta Stream');
				return 0;
			}
		},
		onFieldStart(field, source, effect) {
			this.add('-clearingWeather', 'DeltaStream', '[from] ability: ' + effect.name, `[of] ${source}`);
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-clearingWeather', 'DeltaStream', '[upkeep]');
			this.eachEvent('ClearingWeather');
		},
		onFieldEnd() {
			this.add('-clearingWeather', 'none');
		},
	},

	// other

	dynamax: {
		name: 'Dynamax',
		noCopy: true,
		onStart(pokemon) {
			this.effectState.turns = 0;
			pokemon.removeVolatile('minimize');
			pokemon.removeVolatile('substitute');
			if (pokemon.volatiles['torment']) {
				delete pokemon.volatiles['torment'];
				this.add('-end', pokemon, 'Torment', '[silent]');
			}
			if (['cramorantgulping', 'cramorantgorging'].includes(pokemon.species.id) && !pokemon.transformed) {
				pokemon.formeChange('cramorant');
			}
			this.add('-start', pokemon, 'Dynamax', pokemon.gigantamax ? 'Gmax' : '');
			if (pokemon.baseSpecies.name === 'Shedinja') return;

			// Changes based on dynamax level, 2 is max (at LVL 10)
			const ratio = 1.5 + (pokemon.dynamaxLevel * 0.05);

			pokemon.maxhp = Math.floor(pokemon.maxhp * ratio);
			pokemon.hp = Math.floor(pokemon.hp * ratio);
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
		},
		onTryAddVolatile(status, pokemon) {
			if (status.id === 'flinch') return null;
		},
		onBeforeSwitchOutPriority: -1,
		onBeforeSwitchOut(pokemon) {
			pokemon.removeVolatile('dynamax');
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.id === 'behemothbash' || move.id === 'behemothblade' || move.id === 'dynamaxcannon') {
				return this.chainModify(2);
			}
		},
		onDragOutPriority: 2,
		onDragOut(pokemon) {
			this.add('-block', pokemon, 'Dynamax');
			return null;
		},
		onResidualPriority: -100,
		onResidual() {
			this.effectState.turns++;
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Dynamax');
			if (pokemon.baseSpecies.name === 'Shedinja') return;
			pokemon.hp = pokemon.getUndynamaxedHP();
			pokemon.maxhp = pokemon.baseMaxhp;
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
		},
	},

	// Commander needs two conditions so they are implemented here
	// Dondozo
	commanded: {
		name: "Commanded",
		noCopy: true,
		onStart(pokemon) {
			this.boost({ atk: 2, spa: 2, spe: 2, def: 2, spd: 2 }, pokemon);
		},
		onDragOutPriority: 2,
		onDragOut() {
			return false;
		},
		// Prevents Shed Shell allowing a swap
		onTrapPokemonPriority: -11,
		onTrapPokemon(pokemon) {
			pokemon.trapped = true;
		},
	},
	// Tatsugiri
	commanding: {
		name: "Commanding",
		noCopy: true,
		onDragOutPriority: 2,
		onDragOut() {
			return false;
		},
		// Prevents Shed Shell allowing a swap
		onTrapPokemonPriority: -11,
		onTrapPokemon(pokemon) {
			pokemon.trapped = true;
		},
		// Dodging moves is handled in BattleActions#hitStepInvulnerabilityEvent
		// This is here for moves that manually call this event like Perish Song
		onInvulnerability: false,
		onBeforeTurn(pokemon) {
			this.queue.cancelAction(pokemon);
		},
	},

	// Arceus and Silvally's actual typing is implemented here.
	// Their true typing for all their formes is Normal, and it's only
	// Multitype and RKS System, respectively, that changes their type,
	// but their formes are specified to be their corresponding type
	// in the Pokedex, so that needs to be overridden.
	// This is mainly relevant for Hackmons Cup and Balanced Hackmons.
	arceus: {
		name: 'Arceus',
		onTypePriority: 1,
		onType(types, pokemon) {
			if (pokemon.transformed || pokemon.ability !== 'multitype' && this.gen >= 8) return types;
			let type: string | undefined = 'Normal';
			if (pokemon.ability === 'multitype') {
				type = pokemon.getItem().onPlate;
				if (!type) {
					type = 'Normal';
				}
			}
			return [type];
		},
	},
	silvally: {
		name: 'Silvally',
		onTypePriority: 1,
		onType(types, pokemon) {
			if (pokemon.transformed || pokemon.ability !== 'rkssystem' && this.gen >= 8) return types;
			let type: string | undefined = 'Normal';
			if (pokemon.ability === 'rkssystem') {
				type = pokemon.getItem().onMemory;
				if (!type) {
					type = 'Normal';
				}
			}
			return [type];
		},
	},
	zacian: {
		name: 'Zacian',
		onBattleStart(pokemon) {
			if (pokemon.item !== 'rustedsword') return;
			const rawSpecies = this.dex.species.get('Zacian-Crowned');
			const species = pokemon.setSpecies(rawSpecies);
			if (!species) return;
			pokemon.baseSpecies = rawSpecies;
			pokemon.details = pokemon.getUpdatedDetails();
			pokemon.setAbility(species.abilities['0'], null, null, true);
			pokemon.baseAbility = pokemon.ability;

			const ironHeadIndex = pokemon.baseMoves.indexOf('ironhead');
			if (ironHeadIndex >= 0) {
				const move = this.dex.moves.get('behemothblade');
				const pp = this.calculatePP(move, pokemon.ppUps[ironHeadIndex]);
				pokemon.baseMoveSlots[ironHeadIndex] = {
					move: move.name,
					id: move.id,
					pp,
					maxpp: pp,
					target: move.target,
					disabled: false,
					disabledSource: '',
					used: false,
				};
				pokemon.moveSlots = pokemon.baseMoveSlots.slice();
			}
		},
	},
	zamazenta: {
		name: 'Zamazenta',
		onBattleStart(pokemon) {
			if (pokemon.item !== 'rustedshield') return;
			const rawSpecies = this.dex.species.get('Zamazenta-Crowned');
			const species = pokemon.setSpecies(rawSpecies);
			if (!species) return;
			pokemon.baseSpecies = rawSpecies;
			pokemon.details = pokemon.getUpdatedDetails();
			pokemon.setAbility(species.abilities['0'], null, null, true);
			pokemon.baseAbility = pokemon.ability;

			const ironHeadIndex = pokemon.baseMoves.indexOf('ironhead');
			if (ironHeadIndex >= 0) {
				const move = this.dex.moves.get('behemothbash');
				const pp = this.calculatePP(move, pokemon.ppUps[ironHeadIndex]);
				pokemon.baseMoveSlots[ironHeadIndex] = {
					move: move.name,
					id: move.id,
					pp,
					maxpp: pp,
					target: move.target,
					disabled: false,
					disabledSource: '',
					used: false,
				};
				pokemon.moveSlots = pokemon.baseMoveSlots.slice();
			}
		},
	},
	castform: {
		name: 'Castform',
		onBattleStart(pokemon) {
			if (pokemon.item !== 'whirligig') return;
			const rawSpecies = this.dex.species.get('Castform-Whirly');
			const species = pokemon.setSpecies(rawSpecies);
			if (!species) return;
			pokemon.baseSpecies = rawSpecies;
			pokemon.details = pokemon.getUpdatedDetails();
			pokemon.setAbility(species.abilities['0'], null, null, true);
			pokemon.baseAbility = pokemon.ability;
		},
	},

	rolloutstorage: {
		name: 'rolloutstorage',
		duration: 2,
		onBasePower(relayVar, source, target, move) {
			let bp = Math.max(1, move.basePower);
			bp *= 2 ** source.volatiles['rolloutstorage'].contactHitCount;
			if (source.volatiles['defensecurl']) {
				bp *= 2;
			}
			source.removeVolatile('rolloutstorage');
			return bp;
		},
	},
};
