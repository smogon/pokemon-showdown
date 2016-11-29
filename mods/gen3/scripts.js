'use strict';

exports.BattleScripts = {
	inherit: 'gen4',
	gen: 3,
	init: function () {
		for (let i in this.data.Pokedex) {
			delete this.data.Pokedex[i].abilities['H'];
		}
		let specialTypes = {Fire:1, Water:1, Grass:1, Ice:1, Electric:1, Dark:1, Psychic:1, Dragon:1};
		let newCategory = '';
		for (let i in this.data.Movedex) {
			if (!this.data.Movedex[i]) console.log(i);
			if (this.data.Movedex[i].category === 'Status') continue;
			newCategory = specialTypes[this.data.Movedex[i].type] ? 'Special' : 'Physical';
			if (newCategory !== this.data.Movedex[i].category) {
				this.modData('Movedex', i).category = newCategory;
			}
		}
	},

	calcRecoilDamage: function (damageDealt, move) {
		return this.clampIntRange(Math.floor(damageDealt * move.recoil[0] / move.recoil[1]), 1);
	},
};
