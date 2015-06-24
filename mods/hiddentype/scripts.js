exports.BattleScripts = {
	pokemon: {
		formeChange: function (template, dontRecalculateStats) {
			template = this.battle.getTemplate(template);

			if (!template.abilities) return false;
			this.illusion = null;
			this.template = template;
			this.types = template.types;
			this.typesData = [];
			for (var i = 0, l = this.types.length; i < l; i++) {
				this.typesData.push({
					type: this.types[i],
					suppressed: false,
					isAdded: false
				});
			}
			if (this.types.indexOf(this.baseHpType) < 0) {
				this.typesData.push({
					type: this.baseHpType,
					suppressed: false,
					isAdded: true,
					isCustom: true
				});
			}

			if (!dontRecalculateStats) {
				for (var statName in this.stats) {
					var stat = this.template.baseStats[statName];
					stat = Math.floor(Math.floor(2 * stat + this.set.ivs[statName] + Math.floor(this.set.evs[statName] / 4)) * this.level / 100 + 5);

					// nature
					var nature = this.battle.getNature(this.set.nature);
					if (statName === nature.plus) stat *= 1.1;
					if (statName === nature.minus) stat *= 0.9;
					this.baseStats[statName] = this.stats[statName] = Math.floor(stat);
				}
				this.speed = this.stats.spe;
			}
			return true;
		},
		transformInto: function (pokemon, user) {
			var template = pokemon.template;
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
			var typeMap = {};
			this.typesData = [];
			for (var i = 0, l = pokemon.typesData.length; i < l; i++) {
				var typeData = pokemon.typesData[i];
				if (typeMap[typeData.type]) continue;
				typeMap[typeData.type] = true;

				if (typeData.isCustom) {
					this.typesData.push({
						type: this.baseHpType,
						suppressed: false,
						isAdded: typeData.isAdded,
						isCustom: true
					});
				} else {
					this.typesData.push({
						type: typeData.type,
						suppressed: false,
						isAdded: typeData.isAdded
					});
				}
			}
			for (var statName in this.stats) {
				this.stats[statName] = pokemon.stats[statName];
			}
			this.moveset = [];
			this.moves = [];
			this.set.ivs = (this.battle.gen >= 5 ? this.set.ivs : pokemon.set.ivs);
			this.hpType = (this.battle.gen >= 5 ? this.hpType : pokemon.hpType);
			this.hpPower = (this.battle.gen >= 5 ? this.hpPower : pokemon.hpPower);
			for (var i = 0; i < pokemon.moveset.length; i++) {
				var move = this.battle.getMove(this.set.moves[i]);
				var moveData = pokemon.moveset[i];
				var moveName = moveData.move;
				if (moveData.id === 'hiddenpower') {
					moveName = 'Hidden Power ' + this.hpType;
				}
				this.moveset.push({
					move: moveName,
					id: moveData.id,
					pp: move.noPPBoosts ? moveData.maxpp : 5,
					maxpp: this.battle.gen >= 5 ? (move.noPPBoosts ? moveData.maxpp : 5) : (this.battle.gen <= 2 ? move.pp : moveData.maxpp),
					target: moveData.target,
					disabled: false
				});
				this.moves.push(toId(moveName));
			}
			for (var j in pokemon.boosts) {
				this.boosts[j] = pokemon.boosts[j];
			}
			this.battle.add('-transform', this, pokemon);
			this.setAbility(pokemon.ability);
			this.update();
			return true;
		}
	}
};
