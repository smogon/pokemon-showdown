export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	slp: {
		inherit: true,
		onSwitchIn(target) {
			this.effectState.time = this.effectState.startTime;
		},
	},
	partiallytrapped: {
		inherit: true,
		onStart(pokemon, source) {
			this.add('-activate', pokemon, 'move: ' + this.effectState.sourceEffect, `[of] ${source}`);
			this.effectState.boundDivisor = source.hasItem('bindingband') ? 8 : 16;
		},
	},
	stall: {
		// Protect, Detect, Endure counter
		duration: 2,
		counterMax: 256,
		onStart() {
			this.effectState.counter = 2;
		},
		onStallMove() {
			// this.effectState.counter should never be undefined here.
			// However, just in case, use 1 if it is undefined.
			const counter = this.effectState.counter || 1;
			if (counter >= 256) {
				return this.randomChance(1, 2 ** 32);
			}
			this.debug(`Success chance: ${Math.round(100 / counter)}%`);
			return this.randomChance(1, counter);
		},
		onRestart() {
			if (this.effectState.counter < (this.effect as Condition).counterMax!) {
				this.effectState.counter *= 2;
			}
			this.effectState.duration = 2;
		},
	},
	gem: {
		duration: 1,
		affectsFainted: true,
		onBasePower(basePower, user, target, move) {
			this.debug('Gem Boost');
			return this.chainModify(1.5);
		},
	},
};
