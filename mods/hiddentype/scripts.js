'use strict';

exports.BattleScripts = {
	inherit: 'gen6',
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
		transformInto: function (pokemon, user) {
			let template = pokemon.template;
			if (pokemon.fainted || pokemon.illusion || (pokemon.volatiles['substitute'] && this.battle.gen >= 5)) {
				return false;
			}
			if (!template.abilities || (pokemon && pokemon.transformed && this.battle.gen >= 2) || (user && user.transformed && this.battle.gen >= 5)) {
				return false;
			}
			if (!this.formeChange(template, true)) {
				return false;
			}
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
			this.set.ivs = (this.battle.gen >= 5 ? this.set.ivs : pokemon.set.ivs);
			this.hpType = (this.battle.gen >= 5 ? this.hpType : pokemon.hpType);
			this.hpPower = (this.battle.gen >= 5 ? this.hpPower : pokemon.hpPower);
			for (let i = 0; i < pokemon.moveset.length; i++) {
				let move = this.battle.getMove(this.set.moves[i]);
				let moveData = pokemon.moveset[i];
				let moveName = moveData.move;
				if (moveData.id === 'hiddenpower') {
					moveName = 'Hidden Power ' + this.hpType;
				}
				this.moveset.push({
					move: moveName,
					id: moveData.id,
					pp: move.noPPBoosts ? moveData.maxpp : 5,
					maxpp: this.battle.gen >= 5 ? (move.noPPBoosts ? moveData.maxpp : 5) : (this.battle.gen <= 2 ? move.pp : moveData.maxpp),
					target: moveData.target,
					disabled: false,
				});
				this.moves.push(toId(moveName));
			}
			for (let j in pokemon.boosts) {
				this.boosts[j] = pokemon.boosts[j];
			}
			this.battle.add('-transform', this, pokemon);
			this.setAbility(pokemon.ability);
			return true;
		},
	},
};
