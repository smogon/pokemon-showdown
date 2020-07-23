export const Statuses: {[k: string]: ModdedPureEffectData} = {
	slp: {
		inherit: true,
		onBeforeMove(pokemon, target, move) {
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
			if (move.sleepUsable) return;
			return false;
		},
	},
	frz: {
		inherit: true,
		onBeforeMove(pokemon, target, move) {
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
		onBeforeMove(pokemon) {
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
			const damage = this.getDamage(pokemon, pokemon, 40);
			if (typeof damage !== 'number') throw new Error("Confusion damage not dealt");
			this.damage(damage, pokemon, pokemon, {
				id: 'confused' as ID,
				effectType: 'Move',
				type: '???',
			} as unknown as ActiveMove);
			return false;
		},
	},
	gem: {
		inherit: true,
		onBeforeMove(pokemon) {
			if (pokemon.moveThisTurn) pokemon.removeVolatile('gem');
		},
	},
};
