export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	slp: {
		name: 'slp',
		effectType: 'Status',
		onStart(defender, attacker, sourceEffect) {
			if (sourceEffect?.effectType === 'Move') {
				this.add('-status', defender, 'slp', `[from] move: ${sourceEffect.name}`);
			} else {
				this.add('-status', defender, 'slp');
			}
			// 1-4 turns
			this.effectState.time = this.random(2, 6);
			// Turns spent using Sleep Talk/Snore immediately before switching out while asleep
			this.effectState.skippedTime = 0;

			if (defender.removeVolatile('nightmare')) {
				this.add('-end', defender, 'Nightmare', '[silent]');
			}
		},
		onSwitchOut(defender) {
			this.effectState.time += this.effectState.skippedTime;
			this.effectState.skippedTime = 0;
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, defender, move) {
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
				this.effectState.skippedTime++;
				return;
			}
			this.effectState.skippedTime = 0;
			return false;
		},
	},
	frz: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			// don't count Hidden Power or Weather Ball as Fire-type
			if (this.dex.moves.get(move.id).type === 'Fire' && move.category !== 'Status') {
				defender.cureStatus();
			}
		},
	},
	sandstorm: {
		inherit: true,
		onModifySpD: undefined, // no inherit
	},
};
