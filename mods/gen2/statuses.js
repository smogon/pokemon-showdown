exports.BattleStatuses = {
	brn: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'brn');
		},
		onAfterMoveSelf: function (pokemon) {
			this.damage(pokemon.maxhp / 8);
		},
		onBasePower: function (basePower, attacker, defender, move) {
			if (move && move.category === 'Physical' && attacker && attacker.ability !== 'guts') {
				return basePower / 2;
			}
		},
		onSwitchIn: function (pokemon){
			pokemon.addVolatile('brnattackdrop');
			if (pokemon.side.foe.active[0] && pokemon.speed <= pokemon.side.foe.active[0].speed) {
				this.damage(pokemon.maxhp / 8);
			}
		}
	},
	par: {
		inherit: true,
		onBeforeMovePriority: 2,
		onBeforeMove: function (pokemon) {
			if (this.random(4) === 0) {
				this.add('cant', pokemon.id, 'par');
				return false;
			}
		}
	},
	slp: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target.id, 'slp');
			// 1-5 turns
			this.effectData.time = this.random(2, 6);
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function (pokemon, target, move) {
			pokemon.statusData.time--;
			if (pokemon.statusData.time <= 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon.id, 'slp');
			if (move.sleepUsable) {
				return;
			}
			return false;
		}
	},
	psn: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'psn');
		},
		onAfterMoveSelf: function (pokemon) {
			this.damage(pokemon.maxhp / 8);
		},
		onSwitchIn: function (pokemon) {
			if (pokemon.side.foe.active[0] && pokemon.speed <= pokemon.side.foe.active[0].speed) {
				this.damage(pokemon.maxhp / 8);
			}
		}
	},
	tox: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'tox');
			this.effectData.stage = 0;
		},
		onAfterMoveSelf: function (pokemon) {
			if (this.effectData.stage < 15) {
				this.effectData.stage++;
			}
			this.damage(this.clampIntRange(pokemon.maxhp / 16, 1) * this.effectData.stage);
		},
		onSwitchIn: function (pokemon) {
			this.effectData.stage = 0;
			pokemon.setStatus('psn');
			if (pokemon.side.foe.active[0] && pokemon.speed <= pokemon.side.foe.active[0].speed) {
				this.damage(pokemon.maxhp / 8);
			}
		}
	},
	partiallytrapped: {
		inherit: true,
		durationCallback: function (target, source) {
			return this.random(3, 6);
		}
	},
	stall: {
		duration: 2,
		counterMax: 255,
		onStart: function () {
			this.effectData.counter = 255;
		},
		onStallMove: function () {
			// Gen 2 starts counting at x=255, x/256 and then halves x on every turn
			var counter = this.effectData.counter || 255;
			this.debug("Success chance: " + Math.round(counter / 256) + "% (" + counter + "/256)");
			return (this.random(counter) === 0);
		},
		onRestart: function () {
			if (this.effectData.counter > this.effect.counterMax) {
				this.effectData.counter /= 2;
				if (this.effectData.counter < 0) this.effectData.counter = 0;
			}
			this.effectData.duration = 255;
		}
	}
};
