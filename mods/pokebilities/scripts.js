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
			return this.ability === ability || !!this.volatiles["other" + ability];
		},
		transformInto: function (pokemon, user, effect) {
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
			this.addedType = pokemon.addedType;
			this.knownType = this.side === pokemon.side && pokemon.knownType;

			for (let statName in this.stats) {
				this.stats[statName] = pokemon.stats[statName];
			}
			this.moveset = [];
			this.moves = [];
			this.set.ivs = (this.battle.gen >= 5 ? this.set.ivs : pokemon.set.ivs);
			this.hpType = (this.battle.gen >= 5 ? this.hpType : pokemon.hpType);
			this.hpPower = (this.battle.gen >= 5 ? this.hpPower : pokemon.hpPower);
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
					maxpp: this.battle.gen >= 5 ? (moveData.maxpp === 1 ? 1 : 5) : moveData.maxpp,
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
			this.innates.forEach(innate => this.removeVolatile("other" + innate, this));
			pokemon.innates.forEach(innate => this.addVolatile("other" + innate, this));
			return true;
		},
	},
};
