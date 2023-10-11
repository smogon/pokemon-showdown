export const Conditions: {[k: string]: ConditionData} = {
	brn: {
		name: 'brn',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.id === 'flameorb') {
				this.add('-status', target, 'brn', '[from] item: Flame Orb');
			} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'brn', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
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
				this.add('-status', target, 'par', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'par');
			}
		},
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
				this.add('-status', target, 'slp', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else if (sourceEffect && sourceEffect.effectType === 'Move') {
				this.add('-status', target, 'slp', '[from] move: ' + sourceEffect.name);
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
				this.add('-status', target, 'frz', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'frz');
			}
			if (target.species.name === 'Shaymin-Sky' && target.baseSpecies.baseSpecies === 'Shaymin') {
				target.formeChange('Shaymin', this.effect, true);
			}
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
			if (move.flags['defrost']) return;
			if (this.randomChance(1, 5)) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'frz');
			return false;
		},
		onModifyMove(move, pokemon) {
			if (move.flags['defrost']) {
				this.add('-curestatus', pokemon, 'frz', '[from] move: ' + move);
				pokemon.clearStatus();
			}
		},
		onAfterMoveSecondary(target, source, move) {
			if (move.thawsTarget) {
				target.cureStatus();
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Fire' && move.category !== 'Status') {
				target.cureStatus();
			}
		},
	},
	frb: {
		name: 'frb',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.id === 'frostorb') {
				this.add('-status', target, 'frb', '[from] item: Frost Orb');
			} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'frb', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'frb');
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
				this.add('-status', target, 'psn', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
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
				this.add('-status', target, 'tox', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
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
	confusion: {
		name: 'confusion',
		// this is a volatile status
		onStart(target, source, sourceEffect) {
			if (sourceEffect?.id === 'lockedmove') {
				this.add('-start', target, 'confusion', '[fatigue]');
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
			const activeMove = {id: this.toID('confused'), effectType: 'Move', type: '???'};
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
			this.add('-activate', pokemon, 'move: ' + this.effectState.sourceEffect, '[of] ' + source);
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
		duration: 3,
		onResidualOrder: 3,
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
			if (data.source.hasAbility('adaptability') && this.gen >= 6) {
				data.moveData.stab = 2;
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
		onSwitchInPriority: 1,
		onSwitchIn(target) {
			if (!target.fainted) {
				target.heal(target.maxhp);
				this.add('-heal', target, target.getHealth, '[from] move: ' + this.effectState.sourceEffect, '[zeffect]');
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
			this.debug("Success chance: " + Math.round(100 / counter) + "%");
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

	// weather is implemented here since it's so important to the game
	// Climate Weathergy

	sunnyday: {
		name: 'SunnyDay',
		effectType: 'ClimateWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('heatrock')) {
				return 8;
			}
			return 5;
		},
		onClimateWeatherModifyDamage(damage, attacker, defender, move) {
			if (move.id === 'hydrosteam' && !attacker.hasItem('utilityumbrella')) {
				this.debug('Sunny Day Hydro Steam boost');
				return this.chainModify(1.5);
			}
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === 'Fire') {
				this.debug('Sunny Day fire boost');
				return this.chainModify(1.5);
			}
			if (move.type === 'Water') {
				this.debug('Sunny Day water suppress');
				return this.chainModify(0.5);
			}
		},
		onFieldStart(battle, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'SunnyDay', '[from] ability: ' + effect.name, '[of] ' + source);
			} else {
				this.add('-weather', 'SunnyDay');
			}
		},
		onImmunity(type, pokemon) {
			if (pokemon.hasItem('utilityumbrella')) return;
			if (type === 'frz') return false;
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'SunnyDay', '[upkeep]');
			this.eachEvent('Weather');
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	raindance: {
		name: 'RainDance',
		effectType: 'ClimateWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('damprock')) {
				return 8;
			}
			return 5;
		},
		onClimateWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === 'Water') {
				this.debug('rain water boost');
				return this.chainModify(1.5);
			}
			if (move.type === 'Fire') {
				this.debug('rain fire suppress');
				return this.chainModify(0.5);
			}
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'RainDance', '[from] ability: ' + effect.name, '[of] ' + source);
			} else {
				this.add('-weather', 'RainDance');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'RainDance', '[upkeep]');
			this.eachEvent('Weather');
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	hail: {
		name: 'Hail',
		effectType: 'ClimateWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('icyrock')) {
				return 8;
			}
			return 5;
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'Hail', '[from] ability: ' + effect.name, '[of] ' + source);
			} else {
				this.add('-weather', 'Hail');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'Hail', '[upkeep]');
			if (this.field.isClimateWeather('hail')) this.eachEvent('Weather');
		},
		onClimateWeather(target) {
			this.damage(target.baseMaxhp / 16);
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	snow: {
		name: 'Snow',
		effectType: 'ClimateWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('icyrock')) {
				return 8;
			}
			return 5;
		},
		onModifyDefPriority: 10,
		onModifyDef(def, pokemon) {
			if (pokemon.hasType('Ice') && this.field.isClimateWeather('snow')) {
				return this.modify(def, 1.5);
			}
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'Snow', '[from] ability: ' + effect.name, '[of] ' + source);
			} else {
				this.add('-weather', 'Snow');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'Snow', '[upkeep]');
			if (this.field.isClimateWeather('snow')) this.eachEvent('Weather');
		},
		onFieldEnd() {
			this.add('-weather', 'none');
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
		onModifyDamage(damage, attacker, defender, move) {
			if (defender.hasItem('utilityumbrella')) return;
			if (move && defender.getMoveHitData(move).typeMod > 0) {
				this.debug('Blood Moon super-effective boost');
				return this.chainModify(1.5);
			}
		},
		onModifyPriority(priority, pokemon, target, move) {
			if (pokemon.hasItem('utilityumbrella')) return;
			if (this.field.climateWeatherState.boosted && move?.category === 'Status') {
				move.pranksterBoosted = true;
				this.debug('Boosted further by Strong Winds');
				return priority + 1;
			}
			if (move?.type === 'Dark' && move.category === 'Status') return priority + 1;
		},
		onFieldStart(field, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.climateWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-climateWeather', 'BloodMoon', '[from] ability: ' + effect.name, '[of] ' + source);
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
	foghorn: { // i have no clue how to do a temporary type change
		name: 'Foghorn',
		effectType: 'ClimateWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('weatherballoon')) {
				return 8;
			}
			return 5;
		},
		onModifyAccuracyPriority: -2,
		onModifyAccuracy(accuracy, target, source, move) {
			if (target.hasItem('utilityumbrella')) return;
			if (typeof accuracy === 'number' && move?.type !== 'Normal') {
				// This one piece of code took over 5 hours to do because it was reading move as move: Pokemon and not move: ActiveMove
				this.debug('Fog accuracy decrease');
				return this.chainModify(0.9);
			}
		},
		onModifyMovePriority: -5,
		onModifyMove(move, target, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) && this.field.climateWeatherState.boosted) {
				move.type = '???';
				move.basePower = move.basePower * 1.5;
			}
			if (target.hasItem('utilityumbrella')) return;
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Normal'] = true;
			}
		},
		onFieldStart(field, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.climateWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-climateWeather', 'Foghorn', '[from] ability: ' + effect.name, '[of] ' + source);
			} else {
				this.add('-climateWeather', 'Foghorn');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-climateWeather', 'Foghorn', '[upkeep]');
			this.eachEvent('ClimateWeather');
		},
		onFieldEnd() {
			this.add('-climateWeather', 'none');
		},
	},

	// Irritant Weathergy

	sandstorm: {
		name: 'Sandstorm',
		effectType: 'ClimateWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('smoothrock')) {
				return 8;
			}
			return 5;
		},
		// This should be applied directly to the stat before any of the other modifiers are chained
		// So we give it increased priority.
		onModifySpDPriority: 10,
		onModifySpD(spd, pokemon) {
			if (pokemon.hasType('Rock') && this.field.isIrritantWeather('sandstorm')) {
				return this.modify(spd, 1.5);
			}
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'Sandstorm', '[from] ability: ' + effect.name, '[of] ' + source);
			} else {
				this.add('-weather', 'Sandstorm');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'Sandstorm', '[upkeep]');
			if (this.field.isIrritantWeather('sandstorm')) this.eachEvent('Weather');
		},
		onIrritantWeather(target) {
			this.damage(target.baseMaxhp / 16);
		},
		onFieldEnd() {
			this.add('-weather', 'none');
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
			if (defender.hasItem('safetygoggles')) return;
			if (move.type === 'Electric') {
				this.debug('duststorm supress electric');
				return this.chainModify(0.5);
			}
		},
		onModifySpePriority: 10,
		onModifySpe(spe, pokemon) {
			if (pokemon.hasItem('safetygoggles')) return;
			if (pokemon.hasType('Ground') && this.field.isIrritantWeather('duststorm')) {
				this.debug('duststorm speed boost');
				return this.modify(spe, 1.5);
			}
		},
		onModifyMovePriority: -5,
		onModifyMove(move, target, pokemon) {
			if (target.hasItem('safetygoggles')) return;
			if (target.hasAbility('eartheater')) return;
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
				this.add('-irritantWeather', 'DustStorm', '[from] ability: ' + effect.name, '[of] ' + source);
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
			if (pokemon.hasItem('safetygoggles')) return;
			if (pokemon.hasType('Grass') || pokemon.hasType('Bug')) {
				return;
			} else {
				this.debug('non-grass or bug pokemon Atk reduction');
				return this.modify(atk, 0.75);
			}
		},
		onModifySpAPriority: 10,
		onModifySpA(spa, pokemon) {
			if (pokemon.hasItem('safetygoggles')) return;
			if (pokemon.hasType('Grass') || pokemon.hasType('Bug')) {
				return;
			} else {
				this.debug('non-grass or bug pokemon Spa reduction');
				return this.modify(spa, 0.75);
			}
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
				this.add('-irritantWeather', 'Pollinate', '[from] ability: ' + effect.name, '[of] ' + source);
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
		onModifyAccuracy(acc, pokemon) {
			if (pokemon.hasItem('safetygoggles')) return;
			if (pokemon.hasType('Poison') || pokemon.hasType('Bug')) {
				this.debug('pheromones accuracy boost');
				return this.modify(acc, 1.33);
			}
		},
		onModifySpePriority: 10,
		onModifySpe(spe, pokemon) {
			if (pokemon.hasItem('safetygoggles')) return;
			if (pokemon.hasType('Poison') || pokemon.hasType('Bug')) {
				this.debug('pheromones speed boost');
				return this.modify(spe, 1.5);
			}
		},
		onFieldStart(field, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.irritantWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-irritantWeather', 'SwarmSignal', '[from] ability: ' + effect.name, '[of] ' + source);
			} else {
				this.add('-irritantWeather', 'SwarmSignal');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-irritantWeather', 'SwarmSignal', '[upkeep]');
			this.eachEvent('IrritantWeather');
		},
		onIrritantWeather(target) {
			if (this.field.irritantWeatherState.boosted) {
				if (target.hasItem('safetygoggles')) return;
				if (target.hasType('Bug') || target.hasType('Poison')) return;
				target.addVolatile('confusion');
				this.debug('strong winds pheromones confuses');
			}
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
				this.add('-irritantWeather', 'SmogSpread', '[from] ability: ' + effect.name, '[of] ' + source);
			} else {
				this.add('-irritantWeather', 'SmogSpread');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-irritantWeather', 'SmogSpread', '[upkeep]');
			this.eachEvent('IrritantWeather');
		},
		onIrritantWeather(target) {
			// strong winds effect impemented in sim/pokemon.ts
			if (target.hasItem('safetygoggles')) return;
			target.setStatus('psn');
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
			if (pokemon.hasItem('safetygoggles')) return;
			if (pokemon.hasType('Fairy')) {
				this.debug('fairy type SpD boost');
				return this.modify(spd, 1.25);
			}
		},
		onModifyAccuracyPriority: -1,
		onModifyAccuracy(accuracy, pokemon, target) {
			if (pokemon.hasItem('safetygoggles')) return;
			if (typeof accuracy !== 'number') return;
			if (target.hasType('Fairy')) return;
			this.debug('Sprinkle - decreasing evasion'); // actually increases accuracy
			return this.modify(accuracy, [5461, 4096]);
		},
		onFieldStart(field, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.irritantWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
				if (source.hasAbility('druidry')) {
					this.field.setTerrain('grassyterrain', source);
				} else {
					this.field.setTerrain('mistyterrain', source);
				}
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-irritantWeather', 'Sprinkle', '[from] ability: ' + effect.name, '[of] ' + source);
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
			if (target.hasItem('safetygoggles')) return;
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
			if (pokemon.hasItem('energynullifier')) return;
			return critRatio + 1;
		},
		onTryBoost(boost, target, source, effect) {
			if (target.hasItem('energynullifier')) return;
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
				if (showMsg && !(effect as ActiveMove).secondaries && effect.id !== 'octolock') { // incomplete
					this.add("-fail", target, "unboost", "[from] weather: Aura Projection", "[of] " + target); // does this need to be changed to [from] energyWeather
				}
			}
		},
		onModifyMovePriority: -5,
		onModifyMove(move, target, pokemon) {
			if (this.field.energyWeatherState.boosted) {
				if (target.hasItem('energynullifier')) return;
				if (!move.ignoreImmunity) move.ignoreImmunity = {};
				if (move.ignoreImmunity !== true) {
					this.debug('Boosted further by Strong Winds');
					move.ignoreImmunity['Fighting'] = true;
					move.ignoreImmunity['Normal'] = true;
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
				this.add('-energyWeather', 'AuraProjection', '[from] ability: ' + effect.name, '[of] ' + source);
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
		onBeforeTurn(pokemon) {
			if (this.field.energyWeatherState.boosted) {
				if (pokemon.hasItem('energynullifier')) return;
				if (pokemon.hasType(['Ghost', 'Dark'])) return;
				const flinch = this.random(10);
				if (flinch === 0) {
					pokemon.addVolatile('flinch');
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
				this.add('-energyWeather', 'Haunt', '[from] ability: ' + effect.name, '[of] ' + source);
			} else {
				this.add('-energyWeather', 'Haunt');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-energyWeather', 'Haunt', '[upkeep]');
			if (this.field.isEnergyWeather('haunt')) this.eachEvent('Weather');
		},
		onEnergyWeather(target) {
			if (target.hasItem('energynullifier')) return;
			target.damage(target.baseMaxhp / 16); // normal, ghost and dark's damage immunity added to typechart.ts
		},
		onFieldEnd() {
			this.add('-energyWeather', 'none');
		},
	},
	cosmicrays: {
		name: 'CosmicRays',
		effectType: 'EnergyWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('energychannelizer')) {
				return 8;
			}
			return 5;
		},
		onEnergyWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.hasItem('energynullifier')) return;
			if (move.type === 'Psychic') {
				this.debug('Cosmic Rays psychic boost');
				return this.chainModify(1.5);
			}
			if (move.type === 'Dark') {
				this.debug('Cosmic Rays dark suppress');
				return this.chainModify(0.5);
			}
		},
		onFieldStart(battle, source, effect) {
			if (this.field.isClearingWeather('strongwinds')) {
				this.field.energyWeatherState.boosted = true;
				this.debug('Weather is Strong Winds boosted');
				this.field.setTerrain('psychicterrain', source);
				this.debug('strong winds psychic field sets psychic terrain');
			}
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-energyWeather', 'CosmicRays', '[from] ability: ' + effect.name, '[of] ' + source);
			} else {
				this.add('-energyWeather', 'CosmicRays');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-energyWeather', 'CosmicRays', '[upkeep]');
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
			if (defender.hasItem('energynullifier')) return;
			if (move && defender.getMoveHitData(move).typeMod > 0) {
				this.debug('Dragon Force super-effective supress');
				return this.chainModify(0.8);
			}
		},
		onEnergyWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.hasItem('energynullifier')) return;
			if (this.field.energyWeatherState.boosted) {
				if (move.type === 'Dragon') {
					this.debug('Dragon Force SW dragon boost');
					return this.chainModify(1.875); // non SW boost + SW boost
				} else {
					this.debug('Dragon Force non-dragon boost');
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
				if (source.hasItem('energynullifier')) return;
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
				this.add('-energyWeather', 'DragonForce', '[from] ability: ' + effect.name, '[of] ' + source);
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
			if (pokemon.hasItem('energynullifier')) return;
			if (pokemon.hasType('Electric')) {
				return this.modify(spe, 1.25);
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
				this.add('-energyWeather', 'Supercell', '[from] ability: ' + effect.name, '[of] ' + source);
			} else {
				this.add('-energyWeather', 'Supercell');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-energyWeather', 'Supercell', '[upkeep]');
			this.eachEvent('EnergyWeather');
		},
		onEnergyWeather(target) {
			let typeMod = 1;
			if (target.hasType('Water')) typeMod *= 2;
			this.damage(typeMod * target.baseMaxhp / 10);
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
			if (source?.hasItem('energynullifier')) {
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
				this.add('-energyWeather', 'Magnetize', '[from] ability: ' + effect.name, '[of] ' + source);
			} else {
				this.add('-energyWeather', 'Magnetize');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-energyWeather', 'Magnetize', '[upkeep]');
			this.eachEvent('EnergyWeather');
		},
		onFieldEnd() {
			this.add('-energyWeather', 'none');
		},
	},

	// clearing weathers

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
			if (pokemon.hasType('Flying') && this.field.isClearingWeather('strongwinds')) {
				return this.modify(spe, 1.25);
			}
		},
		onAnyAccuracy(accuracy, target, source, move) {
			if (move.flags['wind'] && this.field.isClearingWeather('strongwinds')) {
				return true;
			}
			return accuracy;
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-clearingWeather', 'StrongWinds', '[from] ability: ' + effect.name, '[of] ' + source);
			} else {
				this.add('-clearingWeather', 'StrongWinds');
			} // currently the below does not function
			if (['sunnyday', 'desolateland', 'primordialsea', 'raindance', 'hail', 'snow',
				'bloodmoon', 'foghorn', 'deltastream'].includes(field.effectiveClimateWeather())) {
				this.field.clearClimateWeather();
				this.debug('Cleared Climate Weathers');
			}
			if (['sandstorm', 'duststorm', 'pollinate',
				'swarmsignal', 'smogspread', 'sprinkle'].includes(this.field.effectiveIrritantWeather())) {
				this.field.clearIrritantWeather();
				this.debug('Cleared Irritant Weathers');
			}
			if (['auraprojection', 'haunt', 'comsicrays',
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

	// extra

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
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === 'Fire') {
				this.debug('Sunny Day fire boost');
				return this.chainModify(1.5);
			}
		},
		onFieldStart(field, source, effect) {
			this.add('-weather', 'DesolateLand', '[from] ability: ' + effect.name, '[of] ' + source);
		},
		onImmunity(type, pokemon) {
			if (pokemon.hasItem('utilityumbrella')) return;
			if (type === 'frz') return false;
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'DesolateLand', '[upkeep]');
			this.eachEvent('Weather');
		},
		onFieldEnd() {
			this.add('-weather', 'none');
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
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === 'Water') {
				this.debug('Rain water boost');
				return this.chainModify(1.5);
			}
		},
		onFieldStart(field, source, effect) {
			this.add('-weather', 'PrimordialSea', '[from] ability: ' + effect.name, '[of] ' + source);
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'PrimordialSea', '[upkeep]');
			this.eachEvent('Weather');
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	deltastream: {
		name: 'DeltaStream',
		effectType: 'ClimateWeather',
		duration: 0,
		onEffectivenessPriority: -1,
		onEffectiveness(typeMod, target, type, move) {
			if (move && move.effectType === 'Move' && move.category !== 'Status' && type === 'Flying' && typeMod > 0) {
				this.add('-fieldactivate', 'Delta Stream');
				return 0;
			}
		},
		onFieldStart(field, source, effect) {
			this.add('-weather', 'DeltaStream', '[from] ability: ' + effect.name, '[of] ' + source);
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'DeltaStream', '[upkeep]');
			this.eachEvent('Weather');
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},

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
			this.boost({atk: 2, spa: 2, spe: 2, def: 2, spd: 2}, pokemon);
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
		// Override No Guard
		onInvulnerabilityPriority: 2,
		onInvulnerability(target, source, move) {
			return false;
		},
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
	rolloutstorage: {
		name: 'rolloutstorage',
		duration: 2,
		onBasePower(relayVar, source, target, move) {
			let bp = Math.max(1, move.basePower);
			bp *= Math.pow(2, source.volatiles['rolloutstorage'].contactHitCount);
			if (source.volatiles['defensecurl']) {
				bp *= 2;
			}
			source.removeVolatile('rolloutstorage');
			return bp;
		},
	},
};
