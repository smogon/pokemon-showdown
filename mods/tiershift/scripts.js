'use strict';

exports.BattleScripts = {
	pokemon: {
		formeChange: function (template, dontRecalculateStats) {
			template = this.battle.getTemplate(template);

			if (!template.abilities) return false;
			this.illusion = null;
			this.template = template;

			this.types = template.types;
			this.addedType = '';

			if (!dontRecalculateStats) {
				let boosts = {
					'UU': 5,
					'BL2': 5,
					'RU': 10,
					'BL3': 10,
					'NU': 15,
					'BL4': 15,
					'PU': 20,
					'NFE': 20,
					'LC Uber': 20,
					'LC': 20,
				};
				let tier = template.tier;
				if (this.set.item) {
					let item = this.battle.getItem(this.set.item);
					if (item.megaEvolves === template.species) tier = this.battle.getTemplate(item.megaStone).tier;
				}
				if (tier.charAt(0) === '(') tier = tier.slice(1, -1);
				let boost = (tier in boosts) ? boosts[tier] : 0;
				if (this.set.ability in {'Drizzle': 1, 'Drought': 1}) {
					boost = 0;
				} else if (this.set.moves.indexOf('chatter') >= 0) {
					boost = 15;
				}

				let hp = this.battle.clampIntRange(this.template.baseStats['hp'] + boost, 1, 255);
				hp = Math.floor(Math.floor(2 * hp + this.set.ivs['hp'] + Math.floor(this.set.evs['hp'] / 4) + 100) * this.level / 100 + 10);
				if (this.maxhp > 1 && this.maxhp < hp) this.hp = this.maxhp = hp;

				for (let statName in this.stats) {
					let stat = this.template.baseStats[statName];
					stat = this.battle.clampIntRange(stat + boost, 1, 255);
					stat = Math.floor(Math.floor(2 * stat + this.set.ivs[statName] + Math.floor(this.set.evs[statName] / 4)) * this.level / 100 + 5);

					let nature = this.battle.getNature(this.set.nature);
					if (statName === nature.plus) stat *= 1.1;
					if (statName === nature.minus) stat *= 0.9;
					this.baseStats[statName] = this.stats[statName] = Math.floor(stat);
				}
				this.speed = this.stats.spe;
			}
			return true;
		},
	},
};
