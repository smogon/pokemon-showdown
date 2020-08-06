export const Conditions: {[k: string]: ModdedConditionData} = {
	slp: {
		name: 'slp',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Move') {
				this.add('-status', target, 'slp', '[from] move: ' + sourceEffect.name);
			} else {
				this.add('-status', target, 'slp');
			}
			// 1-4 turns
			this.effectData.time = this.random(2, 6);
			// Turns spent using Sleep Talk/Snore immediately before switching out while asleep
			this.effectData.skippedTime = 0;
		},
		onSwitchIn(target) {
			this.effectData.time += this.effectData.skippedTime;
			this.effectData.skippedTime = 0;
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
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
				this.effectData.skippedTime++;
				return;
			}
			this.effectData.skippedTime = 0;
			return false;
		},
	},
	frz: {
		inherit: true,
		onHit(target, source, move) {
			// don't count Hidden Power or Weather Ball as Fire-type
			if (move.thawsTarget || this.dex.getMove(move.id).type === 'Fire' && move.category !== 'Status') {
				target.cureStatus();
			}
		},
	},
	sandstorm: {
		inherit: true,
		onModifySpD() {},
	},
};
