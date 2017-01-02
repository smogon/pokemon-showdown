'use strict';

exports.BattleScripts = {
	init: function () {
		Object.values(this.data.Abilities).forEach(ability => {
			if (ability.id === 'trace') return;
			let id = 'other' + ability.id;
			this.data.Statuses[id] = Object.assign({}, ability);
			this.data.Statuses[id].id = id;
			this.data.Statuses[id].noCopy = true;
			this.data.Statuses[id].effectType = "Ability";
			this.data.Statuses[id].fullname = 'ability: ' + ability.name;
		});
	},
	pokemon: {
		hasAbility: function (ability) {
			if (this.ignoringAbility()) return false;
			if (Array.isArray(ability)) return ability.some(ability => this.hasAbility(ability));
			ability = toId(ability);
			return this.ability === ability || !!this.volatiles[ability];
		},
	},
};
