'use strict';

/**@type {ModdedBattleScriptsData} */
let BattleScripts = {
	init: function () {
		this.modData('Abilities', 'noability').isNonstandard = false;
		for (let i in this.data.Pokedex) {
			let template = this.getTemplate(i);
			this.modData('Pokedex', i).abilities = {0: 'No Ability'};
			if (this.data.FormatsData[i].requiredItem && this.data.Items[toId(this.data.FormatsData[i].requiredItem)].megaStone) {
				this.modData('FormatsData', template.speciesid).requiredItem = undefined;
			}
		}
	},
	canMegaEvo(pokemon) {
		let altForme = pokemon.baseTemplate.otherFormes && this.getTemplate(pokemon.baseTemplate.otherFormes[0]);
		for (let i in this.data.Items) {
			let item = this.getItem(i);
			if (altForme && altForme.isMega && altForme.requiredMove && pokemon.baseMoves.includes(toId(altForme.requiredMove)) && !item.zMove) return altForme.species;
			if (item.megaEvolves !== pokemon.baseTemplate.baseSpecies || item.megaStone === pokemon.species) {
				return null;
			}
			return item.megaStone;
		}
	},
	runMegaEvo(pokemon) {
		const templateid = pokemon.canMegaEvo;
		if (!templateid) return false;
		const side = pokemon.side;

		// Pokémon affected by Sky Drop cannot mega evolve. Enforce it here for now.
		for (const foeActive of side.foe.active) {
			if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		for (let i in this.data.Items) {
			let item = this.getItem(i);
			if (!item.megaStone || item.megaStone !== templateid) continue;
			pokemon.formeChange(templateid, item, true);
		}

		// Limit one mega evolution
		let wasMega = pokemon.canMegaEvo;
		for (const ally of side.pokemon) {
			if (wasMega) ally.canMegaEvo = null;
		}

		this.runEvent('AfterMega', pokemon);
		return true;
	},
	/**
	 * Given a table of base stats and a pokemon set, return the actual stats.
	 * @param {StatsTable} baseStats
	 * @param {PokemonSet} set
	 * @return {StatsTable}
	 */
	spreadModify(baseStats, set) {
		/** @type {any} */
		const modStats = {atk: 10, def: 10, spa: 10, spd: 10, spe: 10};
		for (let statName in modStats) {
			// @ts-ignore
			let stat = baseStats[statName];
			// @ts-ignore
			modStats[statName] = Math.floor(Math.floor(2 * stat + set.ivs[statName] + Math.floor(set.evs[statName] / 4)) * set.level / 100 + 5);
			if (set.happiness && set.happiness >= 255) {
				modStats[statName] *= 1.1;
			}
			for (let pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				if (pokemon.id !== toId(set.species)) continue;
				// @ts-ignore
				modStats[statName] += pokemon.getAwakeningValues()[statName];
			}
		}
		if ('hp' in baseStats) {
			let stat = baseStats['hp'];
			modStats['hp'] = Math.floor(Math.floor(2 * stat + set.ivs['hp'] + Math.floor(set.evs['hp'] / 4) + 100) * set.level / 100 + 10);
			for (let pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				if (pokemon.id !== toId(set.species)) continue;
				modStats['hp'] += pokemon.getAwakeningValues()['hp'];
			}
		}
		return this.natureModify(modStats, set.nature);
	},

	pokemon: {
		ability: '',
		baseAbility: '',
		getWeight() {
			let weight = this.template.weightkg;
			weight = this.battle.runEvent('ModifyWeight', this, null, null, weight);
			if (weight < 0.1) weight = 0.1;
			let weightModifierFinal = 20 * Math.random() * 0.01;
			return weight + (weight * (this.battle.random(2) === 1 ? 1 : -1) * weightModifierFinal);
		},
	},
};

exports.BattleScripts = BattleScripts;
