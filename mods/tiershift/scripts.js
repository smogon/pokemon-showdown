'use strict';

const BOOST_TABLE = {
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

exports.BattleScripts = {
	inherit: 'gen6',
	pokemon: {
		formeChange: function (template, dontRecalculateStats) {
			template = this.battle.getTemplate(template);

			if (!template.abilities) return false;
			this.template = template;

			this.types = template.types;
			this.addedType = '';
			this.knownType = true;

			if (!dontRecalculateStats) {
				let tier = template.tier;
				if (this.set.item) {
					let item = this.battle.getItem(this.set.item);
					if (item.megaEvolves === template.species) tier = this.battle.getTemplate(item.megaStone).tier;
				}
				if (tier.charAt(0) === '(') tier = tier.slice(1, -1);
				let boost = (tier in BOOST_TABLE) ? BOOST_TABLE[tier] : 0;
				if (this.set.ability in {'Drizzle': 1, 'Drought': 1}) {
					boost = 0;
				} else if (this.set.moves.includes('chatter')) {
					boost = 15;
				}

				let baseStats = {};
				for (let statName in this.template.baseStats) {
					baseStats[statName] = this.battle.clampIntRange(this.template.baseStats[statName] + boost, 1, 255);
				}
				let stats = this.battle.spreadModify(baseStats, this.set);
				if (this.maxhp > 1 && stats.hp >= this.maxhp) {
					this.hp = this.maxhp = stats.hp;
				}

				for (let statName in this.stats) {
					this.stats[statName] = stats[statName];
					this.baseStats[statName] = stats[statName];
				}
				this.speed = this.stats.spe;
			}
			return true;
		},
	},
};
