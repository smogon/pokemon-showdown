exports.BattleStatuses = {
	slp: {
		inherit: true,
		onBeforeMove: function (pokemon, target, move) {
			if (this.effectData.timerDecreased !== this.turn) {
				this.effectData.timerDecreased = this.turn;
				if (pokemon.getAbility().isHalfSleep) {
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
		}
	},
	frz: {
		inherit: true,
		onBeforeMove: function (pokemon, target, move) {
			if (move.flags['defrost']) return;
			if (this.effectData.durationRolled !== this.turn && this.random(5) === 0) {
				pokemon.cureStatus();
				return;
			}
			if (this.effectData.durationRolled !== this.turn) {
				// Display the `frozen` message only once per turn.
				this.effectData.durationRolled = this.turn;
				this.add('cant', pokemon, 'frz');
			}
			return false;
		}
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
			if (this.random(2) === 0) {
				return;
			}
			this.directDamage(this.getDamage(pokemon, pokemon, 40));
			return false;
		}
	},
	flinch: {
		inherit: true,
		onBeforeMove: function (pokemon) {
			if (this.effectData.movePrevented) return false;
			if (!this.runEvent('Flinch', pokemon)) {
				return;
			}
			if (!this.effectData.movePrevented) {
				// no need to display the flinch message twice
				this.effectData.movePrevented = true;
				this.add('cant', pokemon, 'flinch');
			}
			return false;
		}
	},
	mustrecharge: {
		inherit: true,
		onBeforeMove: function (pokemon) {
			if (!this.effectData.movePrevented) {
				// no need to display the recharge message twice
				this.effectData.movePrevented = true;
				this.add('cant', pokemon, 'recharge');
			}
			if (!pokemon.moveThisTurn) pokemon.removeVolatile('mustrecharge');
			return false;
		}
	},

	/**
	 * Gems and Auras
	 * Make sure that they only boost a single move
	 *
	 */

	gem: {
		inherit: true,
		onBeforeMove: function (pokemon) {
			if (pokemon.moveThisTurn) pokemon.removeVolatile('gem');
		}
	},
	aura: {
		inherit: true,
		onBeforeMove: function (pokemon) {
			if (pokemon.moveThisTurn) pokemon.removeVolatile('aura');
		}
	}
};
