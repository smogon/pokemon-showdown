'use strict';

exports.BattleScripts = {
	pokemon: {
		formeChange: function (template, dontRecalculateStats) {
			template = this.battle.getTemplate(template);

			if (!template.abilities) return false;
			this.illusion = null;
			this.template = template;
			this.types = template.types;
			this.typesData = [];
			this.types = template.types;
			for (let i = 0, l = this.types.length; i < l; i++) {
				this.typesData.push({
					type: this.types[i],
					suppressed: false,
					isAdded: false
				});
			}
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
					'LC': 20
				};
				for (let statName in this.stats) {
					let stat = this.template.baseStats[statName];

					let tier = template.tier;
					if (tier.charAt(0) === '(') tier = tier.slice(1, -1);
					let boost = (tier in boosts) ? boosts[tier] : 0;
					if (this.set.ability in {'Drizzle': 1, 'Drought': 1, 'Shadow Tag': 1}) {
						boost = 0;
					} else if (this.set.moves.indexOf('chatter') >= 0) {
						boost = 15;
					}
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
		}
	}
};
