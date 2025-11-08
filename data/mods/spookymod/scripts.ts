export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	// the below is all commented out due to an ability that requires checkFainted, but it seems like we can't edit checkFainted
	/* checkFainted() {
		for (const side of this.sides) {
			for (const pokemon of side.active) {
				if (pokemon.fainted) {
					pokemon.status = 'fnt' as ID;
					pokemon.switchFlag = true;
				} else if (pokemon.effectState.zombie) {
					pokemon.status = '';
					pokemon.switchFlag = true;
				}
			}
		}
	},
	faintMessages(lastFirst = false, forceCheck = false, checkWin = true) {
		if (this.ended) return;
		const length = this.faintQueue.length;
		if (!length) {
			if (forceCheck && this.checkWin()) return true;
			return false;
		}
		if (lastFirst) {
			this.faintQueue.unshift(this.faintQueue[this.faintQueue.length - 1]);
			this.faintQueue.pop();
		}
		let faintQueueLeft, faintData;
		while (this.faintQueue.length) {
			faintQueueLeft = this.faintQueue.length;
			faintData = this.faintQueue.shift()!;
			const pokemon: Pokemon = faintData.target;
			if (!pokemon.fainted && this.runEvent('BeforeFaint', pokemon, faintData.source, faintData.effect)) {
				this.add('faint', pokemon);
				if (
					!(pokemon.species.name === 'Trevenant' && pokemon.ability === 'revive' && !this.effectState.zombie &&
						!pokemon.transformed && this.canSwitch(pokemon.side))
				) {
					pokemon.side.pokemonLeft--;
				}
				this.runEvent('Faint', pokemon, faintData.source, faintData.effect);
				this.singleEvent('End', pokemon.getAbility(), pokemon.abilityState, pokemon);
				this.singleEvent('End', pokemon.getItem(), pokemon.itemState, pokemon);
				if (pokemon.formeRegression && !pokemon.transformed) {
					// before clearing volatiles
					pokemon.baseSpecies = this.dex.species.get(pokemon.set.species || pokemon.set.name);
					pokemon.baseAbility = toID(pokemon.set.ability);
				}
				pokemon.clearVolatile(false);
				if (!this.effectState.zombie) {
					pokemon.fainted = true;
				} else {
					pokemon.faintQueued = false;
				}
				pokemon.illusion = null;
				pokemon.isActive = false;
				pokemon.isStarted = false;
				delete pokemon.terastallized;
				if (pokemon.formeRegression) {
					// after clearing volatiles
					pokemon.details = pokemon.getUpdatedDetails();
					this.add('detailschange', pokemon, pokemon.details, '[silent]');
					pokemon.updateMaxHp();
					pokemon.formeRegression = false;
				}
				pokemon.side.faintedThisTurn = pokemon;
				if (this.faintQueue.length >= faintQueueLeft) checkWin = true;
			}
		}
		if (this.gen <= 1) {
			// in gen 1, fainting skips the rest of the turn
			// residuals don't exist in gen 1
			this.queue.clear();
			// Fainting clears accumulated Bide damage
			for (const pokemon of this.getAllActive()) {
				if (pokemon.volatiles['bide']?.damage) {
					pokemon.volatiles['bide'].damage = 0;
					this.hint("Desync Clause Mod activated!");
					this.hint("In Gen 1, Bide's accumulated damage is reset to 0 when a Pokemon faints.");
				}
			}
		} else if (this.gen <= 3 && this.gameType === 'singles') {
			// in gen 3 or earlier, fainting in singles skips to residuals
			for (const pokemon of this.getAllActive()) {
				if (this.gen <= 2) {
					// in gen 2, fainting skips moves only
					this.queue.cancelMove(pokemon);
				} else {
					// in gen 3, fainting skips all moves and switches
					this.queue.cancelAction(pokemon);
				}
			}
		}
		if (checkWin && this.checkWin(faintData)) return true;
		if (faintData && length) {
			this.runEvent('AfterFaint', faintData.target, faintData.source, faintData.effect, length);
		}
		return false;
	},
	*/
};
