export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	slp: {
		name: 'slp',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Move') {
				this.add('-status', target, 'slp', `[from] move: ${sourceEffect.name}`);
			} else {
				this.add('-status', target, 'slp');
			}
			// 1-4 turns
			this.effectState.time = this.random(2, 6);
			// Sleep Talk and Snore don't update the persistent sleep timer
			this.effectState.persistentTime = this.effectState.time;

			if (target.removeVolatile('nightmare')) {
				this.add('-end', target, 'Nightmare', '[silent]');
			}
		},
		onSwitchOut() {
			this.effectState.time = this.effectState.persistentTime;
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
			this.effectState.persistentTime = this.effectState.time;
			return false;
		},
	},
	frz: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			// don't count Hidden Power or Weather Ball as Fire-type
			if (this.dex.moves.get(move.id).type === 'Fire' && move.category !== 'Status') {
				target.cureStatus();
			}
		},
	},
	sandstorm: {
		inherit: true,
		onModifySpD: undefined, // no inherit
	},
};
