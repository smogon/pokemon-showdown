'use strict';

exports.BattleAbilities = {
	"data": {
		id: "data",
		name: "Data",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, move) {
			if (attacker.ability) {
				if (attacker.ability === 'vaccine') {
					this.debug('Data boost');
					return this.chainModify(1.2);
				} else
				if (attacker.ability === 'virus') {
					this.debug('Data weaken');
					return this.chainModify(0.8);
				}
			}
		},
	},
	"vaccine": {
		id: "vaccine",
		name: "Vaccine",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, move) {
			if (attacker.ability) {
				if (attacker.ability === 'virus') {
					this.debug('Vaccine boost');
					return this.chainModify(1.2);
				} else
				if (attacker.ability === 'data') {
					this.debug('Vaccine weaken');
					return this.chainModify(0.8);
				}
			}
		},
	},
	"virus": {
		id: "virus",
		name: "Virus",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, move) {
			if (attacker.ability) {
				if (attacker.ability === 'data') {
					this.debug('Virus boost');
					return this.chainModify(1.2);
				} else
				if (attacker.ability === 'vaccine') {
					this.debug('Virus weaken');
					return this.chainModify(0.8);
				}
			}
		},
	},
};
