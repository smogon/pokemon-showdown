exports.BattleStatuses = {
	par: {
		inherit: true,
		onBeforeMove: function (pokemon) {
			if (!pokemon.hasAbility('magicguard') && this.random(4) === 0) {
				this.add('cant', pokemon, 'par');
				return false;
			}
		}
	},
	slp: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'slp');
			// 1-4 turns
			this.effectData.time = this.random(2, 6);
		},
		onBeforeMovePriority: 10,
		onBeforeMove: function (pokemon, target, move) {
			if (pokemon.hasAbility('earlybird')) {
				pokemon.statusData.time--;
			}
			pokemon.statusData.time--;
			if (pokemon.statusData.time <= 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'slp');
			if (move.sleepUsable) {
				return;
			}
			return false;
		}
	},
	frz: {
		inherit: true,
		onBeforeMove: function (pokemon, target, move) {
			if (this.random(5) === 0) {
				pokemon.cureStatus();
				return;
			}
			if (move.flags['defrost']) return;
			this.add('cant', pokemon, 'frz');
			return false;
		}
	},
	trapped: {
		inherit: true,
		noCopy: false
	},
	trapper: {
		inherit: true,
		noCopy: false
	},
	partiallytrapped: {
		inherit: true,
		durationCallback: function (target, source) {
			if (source.hasItem('gripclaw')) return 6;
			return this.random(3, 7);
		}
	},
	stall: {
		// In gen 4, the chance of protect succeeding does not fall below 1/8.
		// See http://upokecenter.dreamhosters.com/dex/?lang=en&move=182
		inherit: true,
		counterMax: 8
	}
};
