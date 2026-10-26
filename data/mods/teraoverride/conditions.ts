export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	frz: {
		inherit: true,
		onBeforeMove(pokemon, defender, move) {
			if (move.flags['defrost'] && !(move.id === 'burnup' && !pokemon.hasType(pokemon.teraType))) return;
			if (this.randomChance(1, 5)) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'frz');
			return false;
		},
		onDamagingHit(damage, defender, attacker, move) {
			if (move.type === defender.teraType && move.category !== 'Status' && move.id !== 'polarflare') {
				defender.cureStatus();
			}
		},
	},
	futuremove: {
		inherit: true,
		onEnd(defender) {
			const data = this.effectState;
			// time's up; time to hit! :D
			const move = this.dex.moves.get(data.move);
			if (defender.fainted || defender === data.attacker) {
				this.hint(`${move.name} did not hit because the defender is ${(defender.fainted ? 'fainted' : 'the user')}.`);
				return;
			}

			this.add('-end', defender, 'move: ' + move.name);
			defender.removeVolatile('Protect');
			defender.removeVolatile('Endure');

			if (data.attacker.hasAbility('infiltrator') && this.gen >= 6) {
				data.moveData.infiltrates = true;
			}
			if (data.attacker.hasAbility('normalize') && this.gen >= 6) {
				data.moveData.type = data.attacker.teraType || 'Normal';
			}
			const hitMove = new this.dex.Move(data.moveData) as ActiveMove;

			this.actions.trySpreadMoveHit([defender], data.attacker, hitMove, true);
			if (data.attacker.isActive && data.attacker.hasItem('lifeorb') && this.gen >= 5) {
				this.singleEvent('AfterMoveSecondarySelf', data.attacker.getItem(), data.attacker.itemState, data.attacker, defender, data.attacker.getItem());
			}
			this.activeMove = null;

			this.checkWin();
		},
	},
	raindance: {
		inherit: true,
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === this.effectState.attacker.teraType) {
				this.debug('rain water boost');
				return this.chainModify(0.75);
			}
		},
	},
	sunnyday: {
		inherit: true,
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (move.id === 'hydrosteam' && !attacker.hasItem('utilityumbrella')) {
				this.debug('Sunny Day Hydro Steam boost');
				return this.chainModify(1.5);
			}
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === this.effectState.attacker.teraType) {
				this.debug('Sunny Day fire boost');
				return this.chainModify(0.75);
			}
		},
	},
	sandstorm: {
		inherit: true,
		onModifySpD(spd, pokemon) {
			if (pokemon.hasType(this.effectState.attacker.teraType) && this.field.isWeather('sandstorm')) {
				return this.modify(spd, 1.5);
			}
		},
	},
	snowscape: {
		inherit: true,
		onModifyDef(def, pokemon) {
			if (pokemon.hasType(this.effectState.attacker.teraType) && this.field.isWeather('snowscape')) {
				return this.modify(def, 1.5);
			}
		},
	},
};
