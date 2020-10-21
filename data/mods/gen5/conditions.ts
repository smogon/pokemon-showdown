export const Conditions: {[k: string]: ModdedConditionData} = {
	slp: {
		inherit: true,
		onSwitchIn(target) {
			this.effectData.time = this.effectData.startTime;
		},
	},
	partiallytrapped: {
		inherit: true,
		onStart(pokemon, source) {
			this.add('-activate', pokemon, 'move: ' + this.effectData.sourceEffect, '[of] ' + source);
			this.effectData.boundDivisor = source.hasItem('bindingband') ? 8 : 16;
		},
		onResidual(pokemon) {
			const trapper = this.effectData.source;
			if (trapper && (!trapper.isActive || trapper.hp <= 0 || !trapper.activeTurns)) {
				delete pokemon.volatiles['partiallytrapped'];
				return;
			}
			this.damage(pokemon.baseMaxhp / this.effectData.boundDivisor);
		},
	},
	stall: {
		// Protect, Detect, Endure counter
		duration: 2,
		counterMax: 256,
		onStart() {
			this.effectData.counter = 2;
		},
		onStallMove() {
			// this.effectData.counter should never be undefined here.
			// However, just in case, use 1 if it is undefined.
			const counter = this.effectData.counter || 1;
			if (counter >= 256) {
				// 2^32 - special-cased because Battle.random(n) can't handle n > 2^16 - 1
				return (this.random() * 4294967296 < 1);
			}
			this.debug("Success chance: " + Math.round(100 / counter) + "%");
			return this.randomChance(1, counter);
		},
		onRestart() {
			if (this.effectData.counter < (this.effect as Condition).counterMax!) {
				this.effectData.counter *= 2;
			}
			this.effectData.duration = 2;
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
