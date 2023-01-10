/**
 * Status worked very differently in Gen 1.
 * - Sleep lasted longer, had no reset on switch and took a whole turn to wake up.
 * - Frozen only thaws when hit by fire or Haze.
 *
 * Stat boosts (-speed, -atk) also worked differently, so they are
 * separated as volatile statuses that are applied on switch in, removed
 * under certain conditions and re-applied under other conditions.
 */

export const Conditions: {[id: string]: ModdedConditionData} = {
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
				this.add('-status', target, 'slp', '[from] move: ' + sourceEffect.name);
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
			return;
		},
	},
	flinch: {
		name: 'flinch',
		duration: 1,
		onStart(target) {
			target.removeVolatile('mustrecharge');
		},
		onBeforeMovePriority: 4,
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
		duration: 2,
		onBeforeMovePriority: 4,
		onBeforeMove(pokemon) {
			this.add('cant', pokemon, 'partiallytrapped');
			return false;
		},
	},
	partialtrappinglock: {
		name: 'partialtrappinglock',
		durationCallback() {
			const duration = this.sample([2, 2, 2, 3, 3, 3, 4, 5]);
			return duration;
		},
		onResidual(target) {
			if (target.lastMove && target.lastMove.id === 'struggle' || target.status === 'slp') {
				delete target.volatiles['partialtrappinglock'];
			}
		},
		onStart(target, source, effect) {
			this.effectState.move = effect.id;
		},
		onDisableMove(pokemon) {
			if (!pokemon.hasMove(this.effectState.move)) {
				return;
			}
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.id !== this.effectState.move) {
					pokemon.disableMove(moveSlot.id);
				}
			}
		},
	},
	mustrecharge: {
		inherit: true,
		duration: 0,
		onStart() {},
	},
	lockedmove: {
		// Outrage, Thrash, Petal Dance...
		inherit: true,
		durationCallback() {
			return this.random(3, 5);
		},
		onEnd(target) {
			// Confusion begins even if already confused
			delete target.volatiles['confusion'];
			target.addVolatile('confusion');
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
