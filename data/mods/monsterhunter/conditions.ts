export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	frz: {
		onStart(target, source, sourceEffect) {
			this.add('-message', `${target.name} was Frostbitten! Special Attack halved! (Stat Change not visible)`);
			if (sourceEffect && sourceEffect.id === 'frostorb') {
				this.add('-status', target, 'frz', '[from] item: Frost Orb');
			} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'frz', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-status', target, 'frz');
			}
		},
		onResidualOrder: 10,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 16);
		},
		onModifySpA(spa, pokemon) {
			return this.chainModify(0.5);
		},
	},
	slp: {
		name: 'slp',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			this.add('-message', `${target.name} is Drowsy! Damage taken is 1.2x; can't use same attack twice! Multi-Hits strike once!`);
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'slp', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else if (sourceEffect && sourceEffect.effectType === 'Move') {
				this.add('-status', target, 'slp', '[from] move: ' + sourceEffect.name);
			} else {
				this.add('-status', target, 'slp');
			}
			if (target.removeVolatile('nightmare')) {
				this.add('-end', target, 'Nightmare', '[silent]');
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			return this.chainModify(1.2);
		},
		onModifyMove(move, pokemon) {
			if (move.multihit) delete move.multihit;
		},
		onDisableMove(pokemon) {
			if (pokemon.lastMove && pokemon.lastMove.id !== 'struggle') {
				pokemon.disableMove(pokemon.lastMove.id);
			}
		},
	},
	par: {
		inherit: true,
		onStart(target, source, sourceEffect) {
			this.add('-message', `${target.name} is Paralyzed! Speed halved; will be fully paralyzed every 3 turns!`);
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'par', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-status', target, 'par');
			}
		},
		onResidual(pokemon) {
			if (this.effectState.static === undefined) this.effectState.static = 0;
			this.effectState.static++;
			if (this.effectState.static >= 3) {
				this.add('-message', `${pokemon.name} has too much static!`);
			} else {
				this.add('-message', `${pokemon.name} is building static!`);
			}
		},
		onSwitchOut(pokemon) {
			this.effectState.static = 0;
		},
		onSwitchIn(pokemon) {
			this.effectState.static = 0;
		},
		onBeforeMove(pokemon) {
			if (this.effectState.static >= 3) {
				this.add('cant', pokemon, 'par');
				this.effectState.static = 0;
				return false;
			}
		},
	},
	warmed: {
		name: 'Warmed',
		onStart(pokemon) {
			this.add('-start', pokemon, 'Warmed');
		},
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			return this.chainModify([5461, 4096]);
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			return this.chainModify([5461, 4096]);
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Warmed');
		},
	},
	cooled: {
		name: 'Cooled',
		onStart(pokemon) {
			this.add('-start', pokemon, 'Cooled');
		},
		onModifyDefPriority: 5,
		onModifyDef(def, pokemon) {
			return this.chainModify([5325, 4096]);
		},
		onModifySpDPriority: 5,
		onModifySpD(spd, pokemon) {
			return this.chainModify([5325, 4096]);
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Cooled');
		},
	},
	blastblight: {
		name: 'Blastblight',
		onStart(pokemon) {
			this.add('-start', pokemon, 'Blasted');
			this.add('-message', `${pokemon.name} has Blastblight! Next hit will incur chip damage!`);
		},
		onDamagingHit(damage, target, source, move) {
			this.damage(target.baseMaxhp / 6, target, source);
			target.removeVolatile('blastblight');
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Blasted');
		},
	},
	bubbleblight: {
		name: 'Bubbleblight',
		duration: 4,
		onStart(pokemon) {
			this.add('-start', pokemon, 'Bubbled');
			this.add('-message', `${pokemon.name} has Bubbleblight! +1 Speed, -1 Accuracy!`);
			this.boost({ spe: 1, accuracy: -1 }, pokemon);
		},
		onEnd(pokemon) {
			this.boost({ spe: -1, accuracy: 1 }, pokemon);
			this.add('-end', pokemon, 'Bubbled');
		},
	},
	defensedown: {
		name: 'Defense Down',
		duration: 4,
		onStart(pokemon) {
			this.add('-start', pokemon, 'Defense Down');
			this.add('-message', `${pokemon.name} is afflicted with Defense Down! Defenses reduced by half for 3 turns!`);
		},
		onModifyDef(def, pokemon) {
			return this.chainModify(0.5);
		},
		onModifySpD(spd, pokemon) {
			return this.chainModify(0.5);
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Defense Down');
		},
	},
	stench: {
		name: 'Stench',
		duration: 4,
		onStart(pokemon) {
			this.add('-start', pokemon, 'Stench');
			this.add('-message', `${pokemon.name} is afflicted with Stench! Held item disabled!`);
			this.singleEvent('End', pokemon.getItem(), pokemon.itemState, pokemon);
			// Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
		},
		onDisableMove(pokemon) {
			for (const moveSlot of pokemon.moveSlots) {
				const move = this.dex.moves.get(moveSlot.id);
				if (move.category === 'Status' && move.id !== 'mefirst') {
					pokemon.disableMove(moveSlot.id);
				}
			}
		},
		onBeforeMovePriority: 5,
		onBeforeMove(attacker, defender, move) {
			if (!move.isZ && !move.isMax && move.category === 'Status' && move.id !== 'mefirst') {
				this.add('cant', attacker, 'move: Taunt', move);
				return false;
			}
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Stench');
		},
	},
	fatigue: {
		name: 'Fatigue',
		duration: 5,
		onStart(pokemon, source) {
			this.add('-start', pokemon, 'Fatigue');
			this.add('-message', `${pokemon.name} is Fatigued! Moves use more PP!`);
		},
		onDeductPP(pokemon) {
			return 1;
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Fatigue');
		},
	},
	bleeding: {
		name: 'Bleeding',
		onStart(pokemon) {
			this.add('-start', pokemon, 'Bleeding');
			this.add('-message', `${pokemon.name} is afflicted with Bleeding! Will take damage when attacking!`);
		},
		onAfterMoveSecondarySelf(source, target, move) {
			if (source && source !== target && move && move.category !== 'Status' && !source.forceSwitchFlag) {
				this.damage(source.baseMaxhp / 10, source, source);
			}
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Bleeding');
		},
	},
	snowman: {
		name: 'Snowman',
		onStart(pokemon) {
			this.add('-start', pokemon, 'Snowman');
			this.add('-message', `${pokemon.name} is a Snowman! Unable to move.`);
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
			if (move.flags['defrost']) return;
			if (this.randomChance(1, 5)) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'snowman');
			return false;
		},
		onModifyMove(move, pokemon) {
			if (move.flags['defrost']) {
				this.add('-curestatus', pokemon, 'snowman', `[from] move: ${move}`);
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
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Snowman');
		},
	},
	rusted: {
		name: 'Rusted',
		duration: 4,
		onStart(pokemon) {
			if (pokemon.hasType('Steel')) {
				this.add('-start', pokemon, 'Rusted');
				this.add('-message', `${pokemon.name}'s steel defenses have rusted away!`);
			} else {
				pokemon.removeVolatile('rusted');
			}
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			if (target.hasType('Steel') && target.volatiles['rusted']) {
				if (typeMod < 0) {
					return 0;
				}
				if (typeMod === 0 && this.dex.getImmunity(type, target)) {
					return 1;
				}
			}
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Rusted');
			this.add('-message', `${pokemon.name}'s steel defenses are restored!`);
		},
	},
	dragonblight: {
		name: 'Dragonblight',
		effectType: 'Status',
		onStart(pokemon) {
			if (pokemon.hasType('Fairy')) {
				this.add('-immune', pokemon, '[from] status: Dragonblight');
				return false;
			}
			this.add('-start', pokemon, 'Dragonblight');
			this.add('-message', `${pokemon.name} is afflicted with Dragonblight! STAB disabled!`);
		},
		onResidualOrder: 10,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 16);
		},
		onModifySTAB(stab, source, target, move) {
			return 1;
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Dragonblight');
			this.add('-message', `${pokemon.name} overcame Dragonblight!`);
		},
	},
	/* Weather */
	dustdevil: {
		name: 'Dust Devil',
		effectType: 'Weather',
		duration: 0,
		// This should be applied directly to the stat before any of the other modifiers are chained
		// So we give it increased priority.
		onModifySpDPriority: 10,
		onModifySpD(spd, pokemon) {
			if (pokemon.hasType('Rock') && this.field.isWeather('dustdevil')) {
				return this.modify(spd, 1.5);
			}
		},
		onModifyMove(move, attacker) {
			if (move.type === 'Rock') {
				move.accuracy = true;
			}
		},
		onFieldStart(field, source, effect) {
			this.add('-weather', 'Dust Devil', '[from] ability: ' + effect.name, `[of] ${source}`);
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'Dust Devil', '[upkeep]');
			this.eachEvent('Weather');
		},
		onWeather(target) {
			if (this.field.weatherState.source !== target) this.damage(target.baseMaxhp / 16);
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	absolutezero: {
		name: 'Absolute Zero',
		effectType: 'Weather',
		duration: 0,
		onModifyDefPriority: 10,
		onModifyDef(def, pokemon) {
			if (pokemon.hasType('Ice') && this.field.isWeather('absolutezero')) {
				return this.modify(def, 1.5);
			}
		},
		onModifySpe(spe, pokemon) {
			if (this.field.weatherState.source !== pokemon) return this.chainModify(0.75);
		},
		onFieldStart(field, source, effect) {
			this.add('-weather', 'Absolute Zero', '[from] ability: ' + effect.name, `[of] ${source}`);
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'Absolute Zero', '[upkeep]');
			this.eachEvent('Weather');
		},
		onWeather(target) {
			if (this.field.weatherState.source !== target) this.damage(target.baseMaxhp / 16);
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	snow: {
		inherit: true,
		onImmunity(type) {
			if (type === 'brn') return false;
		},
	},
};
