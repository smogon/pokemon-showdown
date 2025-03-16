/**
 * Status worked very differently in Gen 1.
 * - Sleep lasted longer, had no reset on switch and took a whole turn to wake up.
 * - Frozen only thaws when hit by fire or Haze.
 *
 * Stat boosts (-speed, -atk) also worked differently, so they are
 * separated as volatile statuses that are applied on switch in, removed
 * under certain conditions and re-applied under other conditions.
 */

export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	brn: {
		name: 'brn',
		effectType: 'Status',
		onStart(target) {
			this.add('-status', target, 'brn');
		},
		onAfterMoveSelfPriority: 2,
		onAfterMoveSelf(pokemon) {
			const toxicCounter = pokemon.volatiles['residualdmg'] ? pokemon.volatiles['residualdmg'].counter : 1;
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1) * toxicCounter, pokemon);
			if (pokemon.volatiles['residualdmg']) {
				this.hint("In Gen 1, Toxic's counter is retained after Rest and applies to PSN/BRN.", true);
			}
		},
		onAfterSwitchInSelf(pokemon) {
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1));
		},
	},
	par: {
		name: 'par',
		effectType: 'Status',
		onStart(target) {
			this.add('-status', target, 'par');
		},
		onBeforeMovePriority: 2,
		onBeforeMove(pokemon) {
			if (this.randomChance(63, 256)) {
				this.add('cant', pokemon, 'par');
				pokemon.removeVolatile('bide');
				if (pokemon.removeVolatile('twoturnmove')) {
					if (pokemon.volatiles['invulnerability']) {
						this.hint(`In Gen 1, when a Dig/Fly user is fully paralyzed while semi-invulnerable, ` +
							`it will remain semi-invulnerable until it switches out or fully executes Dig/Fly`, true);
					}
				}
				pokemon.removeVolatile('partialtrappinglock');
				pokemon.removeVolatile('lockedmove');
				return false;
			}
		},
	},
	slp: {
		name: 'slp',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Move') {
				this.add('-status', target, 'slp', `[from] move: ${sourceEffect.name}`);
			} else {
				this.add('-status', target, 'slp');
			}
			// 1-7 turns
			this.effectState.startTime = this.random(1, 8);
			this.effectState.time = this.effectState.startTime;

			if (target.removeVolatile('nightmare')) {
				this.add('-end', target, 'Nightmare', '[silent]');
			}
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
			pokemon.statusState.time--;
			if (pokemon.statusState.time > 0) {
				this.add('cant', pokemon, 'slp');
			}
			pokemon.lastMove = null;
			return false;
		},
		onAfterMoveSelfPriority: 3,
		onAfterMoveSelf(pokemon) {
			if (pokemon.statusState.time <= 0) pokemon.cureStatus();
		},
	},
	frz: {
		name: 'frz',
		effectType: 'Status',
		onStart(target) {
			this.add('-status', target, 'frz');
		},
		onBeforeMovePriority: 12,
		onBeforeMove(pokemon, target, move) {
			this.add('cant', pokemon, 'frz');
			pokemon.lastMove = null;
			return false;
		},
		onAfterMoveSecondary(target, source, move) {
			if (move.secondary && move.secondary.status === 'brn') {
				target.cureStatus();
			}
		},
	},
	psn: {
		name: 'psn',
		effectType: 'Status',
		onStart(target) {
			this.add('-status', target, 'psn');
		},
		onAfterMoveSelfPriority: 2,
		onAfterMoveSelf(pokemon) {
			const toxicCounter = pokemon.volatiles['residualdmg'] ? pokemon.volatiles['residualdmg'].counter : 1;
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1) * toxicCounter, pokemon);
			if (pokemon.volatiles['residualdmg']) {
				this.hint("In Gen 1, Toxic's counter is retained after Rest and applies to PSN/BRN.", true);
			}
		},
		onAfterSwitchInSelf(pokemon) {
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1));
		},
	},
	tox: {
		inherit: true,
		onAfterMoveSelfPriority: 2,
	},
	confusion: {
		name: 'confusion',
		// this is a volatile status
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.id === 'lockedmove') {
				this.add('-start', target, 'confusion', '[silent]');
			} else {
				this.add('-start', target, 'confusion');
			}
			this.effectState.time = this.random(2, 6);
		},
		onEnd(target) {
			this.add('-end', target, 'confusion');
		},
		onBeforeMovePriority: 3,
		onBeforeMove(pokemon, target) {
			pokemon.volatiles['confusion'].time--;
			if (!pokemon.volatiles['confusion'].time) {
				pokemon.removeVolatile('confusion');
				return;
			}
			this.add('-activate', pokemon, 'confusion');
			if (!this.randomChance(128, 256)) {
				const damage = Math.floor(Math.floor((
					(Math.floor(2 * pokemon.level / 5) + 2) * pokemon.getStat('atk') * 40
				) / pokemon.getStat('def', false)) / 50) + 2;
				this.directDamage(damage, pokemon, target);
				pokemon.removeVolatile('bide');
				pokemon.removeVolatile('twoturnmove');
				pokemon.removeVolatile('invulnerability');
				pokemon.removeVolatile('partialtrappinglock');
				pokemon.removeVolatile('lockedmove');
				return false;
			}
		},
	},
	flinch: {
		name: 'flinch',
		duration: 1,
		onStart(target) {
			target.removeVolatile('mustrecharge');
		},
		onBeforeMovePriority: 8,
		onBeforeMove(pokemon) {
			if (!this.runEvent('Flinch', pokemon)) {
				return;
			}
			this.add('cant', pokemon, 'flinch');
			return false;
		},
	},
	trapped: {
		name: 'trapped',
		noCopy: true,
		onTrapPokemon(pokemon) {
			if (!this.effectState.source?.isActive) {
				delete pokemon.volatiles['trapped'];
				return;
			}
			pokemon.trapped = true;
		},
	},
	partiallytrapped: {
		name: 'partiallytrapped',
		// this is the duration of Wrap if it doesn't continue.
		// (i.e. if the attacker switches out.)
		// the full duration is tracked in partialtrappinglock
		duration: 2,
		// defender still takes PSN damage, etc
		// TODO: research exact mechanics
		onBeforeMovePriority: 0,
		onBeforeMove() {
			return false;
		},
		onRestart() {
			this.effectState.duration = 2;
		},
		onLockMove() {
			// exact move doesn't matter, no move is ever actually used
			return 'struggle';
		},
		onDisableMove(target) {
			target.maybeLocked = true;
		},
	},
	fakepartiallytrapped: {
		name: 'fakepartiallytrapped',
		// Wrap ended this turn, but you don't know that
		// until you try to use an attack
		duration: 2,
		onDisableMove(target) {
			target.maybeLocked = true;
		},
	},
	partialtrappinglock: {
		name: 'partialtrappinglock',
		durationCallback() {
			return this.sample([2, 2, 2, 3, 3, 3, 4, 5]);
		},
		onStart(target, source, effect) {
			const foe = target.foes()[0];
			if (!foe) return false;

			this.effectState.move = effect.id;
			this.effectState.totalDuration = this.effectState.duration!;
			this.effectState.damage = target.lastDamage;
			this.effectState.trapTarget = foe;
			foe.addVolatile('partiallytrapped', target, effect);
			this.add('cant', foe, 'partiallytrapped');
		},
		onOverrideAction(pokemon, target, move) {
			return this.effectState.move;
		},
		// attacker still takes PSN damage, etc
		onBeforeMovePriority: 0,
		onBeforeMove(pokemon, target, move) {
			const foe = pokemon.foes()[0];
			if (!foe || foe !== this.effectState.trapTarget) {
				pokemon.removeVolatile('partialtrappinglock');
				return;
			}

			this.add('move', pokemon, this.effectState.move, foe, `[from] ${this.effectState.move}`);
			this.damage(this.effectState.damage, foe, pokemon, move);
			if (this.effectState.duration === 1) {
				if (this.effectState.totalDuration !== 5) {
					pokemon.addVolatile('fakepartiallytrapped');
					foe.addVolatile('fakepartiallytrapped');
				}
			} else {
				foe.addVolatile('partiallytrapped', pokemon, move);
			}
			return false;
		},
		onLockMove() {
			return this.effectState.move;
		},
		onDisableMove(pokemon) {
			pokemon.maybeLocked = true;
		},
	},
	mustrecharge: {
		inherit: true,
		duration: 0,
		onBeforeMovePriority: 7,
		onStart() {},
	},
	lockedmove: {
		// Thrash and Petal Dance.
		name: 'lockedmove',
		onStart(target, source, effect) {
			this.effectState.move = effect.id;
			this.effectState.time = this.random(2, 4);
			this.effectState.accuracy = 255;
		},
		onLockMove() {
			return this.effectState.move;
		},
		onBeforeTurn(pokemon) {
			const move = this.dex.moves.get(this.effectState.move);
			if (move.id) {
				this.debug('Forcing into ' + move.id);
				this.queue.changeAction(pokemon, { choice: 'move', moveid: move.id });
			}
		},
	},
	twoturnmove: {
		// Skull Bash, Solar Beam, ...
		name: 'twoturnmove',
		onStart(attacker, defender, effect) {
			// ("attacker" is the Pokemon using the two turn move and the Pokemon this condition is being applied to)
			this.effectState.move = effect.id;
			this.effectState.sourceEffect = effect.sourceEffect;
			this.attrLastMove('[still]');
		},
		onLockMove() {
			return this.effectState.move;
		},
	},
	invulnerability: {
		// Dig/Fly
		name: 'invulnerability',
		onInvulnerability(target, source, move) {
			if (target === source) return true;
			if (move.id === 'swift' || move.id === 'transform') return true;
			this.add('-message', 'The foe ' + target.name + ' can\'t be hit while invulnerable!');
			return false;
		},
	},
};
