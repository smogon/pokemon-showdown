'use strict';

exports.BattleScripts = {
	pokemon: {
		formeChange: function (template, dontRecalculateStats) {
			template = this.battle.getTemplate(template);
			if (!template.abilities) return false;

			this.template = template;
			this.types = template.types;
			this.addedType = this.baseHpType;
			this.knownType = true;

			if (!dontRecalculateStats) {
				let stats = this.battle.spreadModify(this.template.baseStats, this.set);
				for (let statName in this.stats) {
					this.stats[statName] = stats[statName];
					this.baseStats[statName] = stats[statName];
				}
				this.speed = this.stats.spe;
			}
			return true;
		},
		transformInto: function (pokemon, user, effect) {
			let template = pokemon.template;
			if (pokemon.fainted || pokemon.illusion || pokemon.volatiles['substitute']) return false;
			if (!template.abilities || (pokemon && pokemon.transformed) || (user && user.transformed)) return false;
			if (!this.formeChange(template, true)) return false;

			this.transformed = true;
			this.types = pokemon.types;
			if (pokemon.addedType !== pokemon.hpType) {
				this.addedType = pokemon.addedType;
			} else if (this.types.indexOf(this.hpType) < 0) {
				this.addedType = this.hpType;
			} else {
				this.addedType = '';
			}
			for (let statName in this.stats) {
				this.stats[statName] = pokemon.stats[statName];
			}
			this.moveset = [];
			this.moves = [];
			this.set.ivs = this.set.ivs;
			this.hpType = this.hpType;
			this.hpPower = this.hpPower;
			for (let i = 0; i < pokemon.moveset.length; i++) {
				let moveData = pokemon.moveset[i];
				let moveName = moveData.move;
				if (moveData.id === 'hiddenpower') {
					moveName = 'Hidden Power ' + this.hpType;
				}
				this.moveset.push({
					move: moveName,
					id: moveData.id,
					pp: moveData.maxpp === 1 ? 1 : 5,
					maxpp: moveData.maxpp === 1 ? 1 : 5,
					target: moveData.target,
					disabled: false,
					used: false,
					virtual: true,
				});
				this.moves.push(toId(moveName));
			}
			for (let j in pokemon.boosts) {
				this.boosts[j] = pokemon.boosts[j];
			}
			if (effect) {
				this.battle.add('-transform', this, pokemon, '[from] ' + effect.fullname);
			} else {
				this.battle.add('-transform', this, pokemon);
			}
			this.setAbility(pokemon.ability, this, {id: 'transform'});
			return true;
		},
	},
};
