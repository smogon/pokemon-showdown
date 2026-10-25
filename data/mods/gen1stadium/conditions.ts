export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	brn: {
		name: 'brn',
		effectType: 'Status',
		onStart(defender) {
			this.add('-status', defender, 'brn');
		},
		onAfterMoveSelfPriority: 2,
		onAfterMoveSelf(pokemon) {
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1));
		},
		onAfterSwitchInSelf(pokemon) {
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1));
		},
	},
	par: {
		name: 'par',
		effectType: 'Status',
		onStart(defender) {
			this.add('-status', defender, 'par');
		},
		onBeforeMovePriority: 2,
		onBeforeMove(pokemon) {
			if (this.randomChance(63, 256)) {
				this.add('cant', pokemon, 'par');
				pokemon.removeVolatile('bide');
				pokemon.removeVolatile('lockedmove');
				pokemon.removeVolatile('twoturnmove');
				pokemon.removeVolatile('invulnerability');
				pokemon.removeVolatile('partialtrappinglock');
				return false;
			}
		},
	},
	slp: {
		name: 'slp',
		effectType: 'Status',
		onStart(defender, attacker, sourceEffect) {
			if (sourceEffect?.effectType === 'Move') {
				this.add('-status', defender, 'slp', `[from] move: ${sourceEffect.name}`);
			} else {
				this.add('-status', defender, 'slp');
			}
			// 1-3 turns
			this.effectState.startTime = this.random(1, 4);
			this.effectState.time = this.effectState.startTime;

			if (defender.removeVolatile('nightmare')) {
				this.add('-end', defender, 'Nightmare', '[silent]');
			}
		},
		onBeforeMovePriority: 2,
		onBeforeMove(pokemon, defender, move) {
			pokemon.statusState.time--;
			this.add('cant', pokemon, 'slp');
			pokemon.lastMove = null;
			return false;
		},
		onAfterMoveSelf(pokemon) {
			if (pokemon.statusState.time <= 0) pokemon.cureStatus();
		},
	},
	frz: {
		name: 'frz',
		effectType: 'Status',
		onStart(defender) {
			this.add('-status', defender, 'frz');
		},
		onBeforeMovePriority: 2,
		onBeforeMove(pokemon, defender, move) {
			this.add('cant', pokemon, 'frz');
			pokemon.lastMove = null;
			return false;
		},
		onHit(defender, attacker, move) {
			if (move.type === 'Fire' && move.category !== 'Status') {
				defender.cureStatus();
			}
		},
	},
	psn: {
		name: 'psn',
		effectType: 'Status',
		onStart(defender) {
			this.add('-status', defender, 'psn');
		},
		onAfterMoveSelfPriority: 2,
		onAfterMoveSelf(pokemon) {
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1));
		},
		onAfterSwitchInSelf(pokemon) {
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1));
		},
	},
	confusion: {
		inherit: true,
		onStart(defender) {
			this.add('-start', defender, 'confusion');
			this.effectState.time = this.random(2, 6);
		},
	},
	flinch: {
		inherit: true,
		onStart: undefined, // no inherit
	},
	partiallytrapped: {
		name: 'partiallytrapped',
		duration: 2,
		onBeforeMovePriority: 1,
		onStart(defender, attacker, effect) {
			this.add('-activate', defender, `move: ${effect}`, `[of] ${attacker}`);
		},
		onBeforeMove(pokemon) {
			if (this.effectState.attacker && (!this.effectState.attacker.isActive || this.effectState.attacker.hp <= 0)) {
				pokemon.removeVolatile('partiallytrapped');
				return;
			}
			this.add('cant', pokemon, 'partiallytrapped');
			return false;
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, this.effectState.sourceEffect, '[partiallytrapped]');
		},
	},
};
