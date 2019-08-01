'use strict';

/**@type {{[k: string]: ModdedEffectData}} */
exports.BattleStatuses = {
	slp: {
		inherit: true,
		// @ts-ignore
		onBeforeMove(pokemon, target, move) {
			// @ts-ignore
			if (this.effectData.timerDecreased !== this.turn) {
				// @ts-ignore
				this.effectData.timerDecreased = this.turn;
				if (pokemon.hasAbility('earlybird')) {
					pokemon.statusData.time--;
				}
				pokemon.statusData.time--;
				if (pokemon.statusData.time <= 0) {
					pokemon.cureStatus();
					return;
				}
				// @ts-ignore
				this.add('cant', pokemon, 'slp');
			}
			if (move.sleepUsable) {
				return;
			}
			return false;
		},
	},
	frz: {
		inherit: true,
		// @ts-ignore
		onBeforeMove(pokemon, target, move) {
			if (move.flags['defrost']) return;
			// @ts-ignore
			if (this.effectData.durationRolled !== this.turn && this.randomChance(1, 5)) {
				pokemon.cureStatus();
				return;
			}
			// @ts-ignore
			if (this.effectData.durationRolled !== this.turn) {
				// Display the `frozen` message only once per turn.
				// @ts-ignore
				this.effectData.durationRolled = this.turn;
				// @ts-ignore
				this.add('cant', pokemon, 'frz');
			}
			return false;
		},
	},
	confusion: {
		inherit: true,
		// @ts-ignore
		onBeforeMove(pokemon) {
			// @ts-ignore
			if (this.effectData.timerDecreased !== this.turn) {
				// @ts-ignore
				this.effectData.timerDecreased = this.turn;
				pokemon.volatiles.confusion.time--;
				if (!pokemon.volatiles.confusion.time) {
					pokemon.removeVolatile('confusion');
					return;
				}
			}
			// @ts-ignore
			this.add('-activate', pokemon, 'confusion');
			// @ts-ignore
			if (!this.randomChance(1, 3)) {
				return;
			}
			// @ts-ignore
			this.activeTarget = pokemon;
			// @ts-ignore
			let damage = this.getDamage(pokemon, pokemon, 40);
			if (typeof damage !== 'number') throw new Error("Confusion damage not dealt");
			// @ts-ignore
			this.damage(damage, pokemon, pokemon, /**@type {ActiveMove} */({
				id: 'confused',
				effectType: 'Move',
				type: '???',
			}));
			return false;
		},
	},

	/**
	 * Gems
	 * Make sure that they only boost a single move
	 *
	 */

	gem: {
		inherit: true,
		// @ts-ignore
		onBeforeMove(pokemon) {
			if (pokemon.moveThisTurn) pokemon.removeVolatile('gem');
		},
	},
};
