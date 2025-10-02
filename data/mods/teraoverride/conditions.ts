export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	frz: {
		inherit: true,
		onBeforeMove(pokemon, target, move) {
			if (move.flags['defrost'] && !(move.id === 'burnup' && !pokemon.hasType(pokemon.teraType))) return;
			if (this.randomChance(1, 5)) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'frz');
			return false;
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === target.teraType && move.category !== 'Status' && move.id !== 'polarflare') {
				target.cureStatus();
			}
		},
	},
	futuremove: {
		inherit: true,
		onEnd(target) {
			const data = this.effectState;
			// time's up; time to hit! :D
			const move = this.dex.moves.get(data.move);
			if (target.fainted || target === data.source) {
				this.hint(`${move.name} did not hit because the target is ${(target.fainted ? 'fainted' : 'the user')}.`);
				return;
			}

			this.add('-end', target, 'move: ' + move.name);
			target.removeVolatile('Protect');
			target.removeVolatile('Endure');

			if (data.source.hasAbility('infiltrator') && this.gen >= 6) {
				data.moveData.infiltrates = true;
			}
			if (data.source.hasAbility('normalize') && this.gen >= 6) {
				data.moveData.type = data.source.teraType || 'Normal';
			}
			const hitMove = new this.dex.Move(data.moveData) as ActiveMove;

			this.actions.trySpreadMoveHit([target], data.source, hitMove, true);
			if (data.source.isActive && data.source.hasItem('lifeorb') && this.gen >= 5) {
				this.singleEvent('AfterMoveSecondarySelf', data.source.getItem(), data.source.itemState, data.source, target, data.source.getItem());
			}
			this.activeMove = null;

			this.checkWin();
		},
	},
	raindance: {
		inherit: true,
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === this.effectState.source.teraType) {
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
			if (move.type === this.effectState.source.teraType) {
				this.debug('Sunny Day fire boost');
				return this.chainModify(0.75);
			}
		},
	},
	sandstorm: {
		inherit: true,
		onModifySpD(spd, pokemon) {
			if (pokemon.hasType(this.effectState.source.teraType) && this.field.isWeather('sandstorm')) {
				return this.modify(spd, 1.5);
			}
		},
	},
	snowscape: {
		inherit: true,
		onModifyDef(def, pokemon) {
			if (pokemon.hasType(this.effectState.source.teraType) && this.field.isWeather('snowscape')) {
				return this.modify(def, 1.5);
			}
		},
	},
};
