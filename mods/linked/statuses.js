'use strict';

exports.BattleStatuses = {
	slp: {
		inherit: true,
		onBeforeMove: function (pokemon, target, move) {
			if (this.effectData.timerDecreased !== this.turn) {
				this.effectData.timerDecreased = this.turn;
				if (pokemon.hasAbility('earlybird')) {
					pokemon.statusData.time--;
				}
				pokemon.statusData.time--;
				if (pokemon.statusData.time <= 0) {
					pokemon.cureStatus();
					return;
				}
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
		onBeforeMove: function (pokemon, target, move) {
			if (move.flags['defrost']) return;
			if (this.effectData.durationRolled !== this.turn && this.randomChance(1, 5)) {
				pokemon.cureStatus();
				return;
			}
			if (this.effectData.durationRolled !== this.turn) {
				// Display the `frozen` message only once per turn.
				this.effectData.durationRolled = this.turn;
				this.add('cant', pokemon, 'frz');
			}
			return false;
		},
	},
	confusion: {
		inherit: true,
		onBeforeMove: function (pokemon) {
			if (this.effectData.timerDecreased !== this.turn) {
				this.effectData.timerDecreased = this.turn;
				pokemon.volatiles.confusion.time--;
				if (!pokemon.volatiles.confusion.time) {
					pokemon.removeVolatile('confusion');
					return;
				}
			}
			this.add('-activate', pokemon, 'confusion');
			if (!this.randomChance(1, 3)) {
				return;
			}
			this.activeTarget = pokemon;
			this.damage(this.getDamage(pokemon, pokemon, 40), pokemon, pokemon, {
				id: 'confused',
				effectType: 'Move',
				type: '???',
			});
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
		onBeforeMove: function (pokemon) {
			if (pokemon.moveThisTurn) pokemon.removeVolatile('gem');
		},
	},
};
