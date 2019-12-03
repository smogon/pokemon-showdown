'use strict';

/**@type {{[k: string]: ModdedPureEffectData}} */
let BattleStatuses = {
	slp: {
		inherit: true,
		onSwitchIn(target) {
			this.effectData.time = this.effectData.startTime;
		},
	},
	partiallytrapped: {
		inherit: true,
		onResidual(pokemon) {
			if (this.effectData.source && (!this.effectData.source.isActive || this.effectData.source.hp <= 0 || !this.effectData.source.activeTurns)) {
				delete pokemon.volatiles['partiallytrapped'];
				return;
			}
			if (this.effectData.source.hasItem('bindingband')) {
				this.damage(pokemon.baseMaxhp / 8);
			} else {
				this.damage(pokemon.baseMaxhp / 16);
			}
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
			let counter = this.effectData.counter || 1;
			if (counter >= 256) {
				// 2^32 - special-cased because Battle.random(n) can't handle n > 2^16 - 1
				return (this.random() * 4294967296 < 1);
			}
			this.debug("Success chance: " + Math.round(100 / counter) + "%");
			return this.randomChance(1, counter);
		},
		onRestart() {
			// @ts-ignore
			if (this.effectData.counter < this.effect.counterMax) {
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

exports.BattleStatuses = BattleStatuses;
