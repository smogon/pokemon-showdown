export const Moves: {[k: string]: ModdedMoveData} = {
	// Belly Drum no longer boosts attack by 2 stages if under 50% health.
	bellydrum: {
		inherit: true,
		onHit(target) {
			if (target.boosts.atk >= 6 || target.hp <= target.maxhp / 2) {
				return false;
			}
			this.directDamage(target.maxhp / 2);
			const originalStage = target.boosts.atk;
			let currentStage = originalStage;
			let boosts = 0;
			let loopStage = 0;
			while (currentStage < 6) {
				loopStage = currentStage;
				currentStage++;
				if (currentStage < 6) currentStage++;
				target.boosts.atk = loopStage;
				if (target.getStat('atk', false, true) < 999) {
					target.boosts.atk = currentStage;
					continue;
				}
				target.boosts.atk = currentStage - 1;
				break;
			}
			boosts = target.boosts.atk - originalStage;
			target.boosts.atk = originalStage;
			this.boost({atk: boosts});
		},
	},
	destinybond: {
		inherit: true,
		condition: {
			onStart(pokemon) {
				if (pokemon.alliesAndSelf().filter(mon => !mon.status).length === 1) {
					this.add('-fail', pokemon);
					this.hint("In Pokemon Stadium 2, Destiny Bond fails if it is being used by your last Pokemon.");
				} else {
					this.add('-singlemove', pokemon, 'Destiny Bond');
				}
			},
			onFaint(target, source, effect) {
				if (!source || !effect || target.isAlly(source)) return;
				if (effect.effectType === 'Move' && !effect.isFutureMove) {
					this.add('-activate', target, 'move: Destiny Bond');
					source.faint();
				}
			},
			onBeforeMovePriority: -1,
			onBeforeMove(pokemon, target, move) {
				if (move.id === 'destinybond') return;
				this.debug('removing Destiny Bond before attack');
				pokemon.removeVolatile('destinybond');
			},
			onMoveAborted(pokemon, target, move) {
				pokemon.removeVolatile('destinybond');
			},
		},
	},
	/**
	 * In Stadium 2, moves which affect the stat stages of a Pokemon, such as moves which boost ones own stats,
	 * lower the targets stats, or Haze, causes the afflicted stat to be re-calculated without factoring in
	 * status aliments, thus if a Pokemon is burned or paralyzed and either active Pokemon uses Haze, then their
	 * attack and speed are re-calculated while ignoring their status ailments, so their attack would go from 50% to normal
	 */
	haze: {
		inherit: true,
		onHitField() {
			this.add('-clearallboost');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();
				for (const id of Object.keys(pokemon.volatiles)) {
					pokemon.removeVolatile(id);
					this.add('-end', pokemon, id);
				}
			}
		},
	},
	perishsong: {
		inherit: true,
		onHitField(target, source, move) {
			let result = false;
			let message = false;
			if (source.alliesAndSelf().filter(ally => !ally.status).length === 1) {
				this.add('-fail', source);
				this.hint("In Pokemon Stadium 2, Perish Song fails if it is being used by your last Pokemon.");
			} else {
				for (const pokemon of this.getAllActive()) {
					if (this.runEvent('Invulnerability', pokemon, source, move) === false) {
						this.add('-miss', source, pokemon);
						result = true;
					} else if (this.runEvent('TryHit', pokemon, source, move) === null) {
						result = true;
					} else if (!pokemon.volatiles['perishsong']) {
						pokemon.addVolatile('perishsong');
						this.add('-start', pokemon, 'perish3', '[silent]');
						result = true;
						message = true;
					}
				}
				if (!result) return false;
				if (message) this.add('-fieldactivate', 'move: Perish Song');
			}
		},
	},
};
