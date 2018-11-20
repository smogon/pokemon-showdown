'use strict';

/**@type {ModdedBattleScriptsData} */
let BattleScripts = {
	init: function () {
		this.modData('Abilities', 'noability').isNonstandard = false;
		for (let i in this.data.Pokedex) {
			this.modData('Pokedex', i).abilities = {0: 'No Ability'};
		}
		for (let i in this.data.FormatsData) {
			let dataTemplate = this.modData('FormatsData', i);
			if (this.data.FormatsData[i].requiredItem && this.getItem(this.data.FormatsData[i].requiredItem).megaStone) {
				dataTemplate.requiredItem = '';
			}
		}
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
			modStats[statName] = Math.floor((Math.floor(2 * stat + set.ivs[statName]) * set.level / 100 + 5));
		}
		if ('hp' in baseStats) {
			let stat = baseStats['hp'];
			modStats['hp'] = Math.floor(Math.floor(2 * stat + set.ivs['hp'] + 100) * set.level / 100 + 10);
		}
		return this.natureModify(modStats, set);
	},

	runMegaEvo(pokemon) {
		const templateid = pokemon.canMegaEvo || pokemon.canUltraBurst;
		if (!templateid) return false;
		const side = pokemon.side;

		// Pokémon affected by Sky Drop cannot mega evolve. Enforce it here for now.
		for (const foeActive of side.foe.active) {
			if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		if (templateid.split(',').length === 2) {
			for (const moveSlot of pokemon.moveSlots) {
				let template = this.getTemplate(templateid.split(',')[1]);
				let hasMoveOfType = 0;
				if (template.types.includes(moveSlot.type)) hasMoveOfType++;
				let otherTemplate = this.getTemplate(templateid.split(',')[0]);
				let hasMoveOfOtherType = 0;
				if (otherTemplate.types.includes(moveSlot.type)) hasMoveOfOtherType++;
				if (hasMoveOfType > hasMoveOfOtherType) {
					pokemon.formeChange(templateid.split(',')[1], pokemon.getItem(), true);
				} else {
					pokemon.formeChange(templateid.split(',')[0], pokemon.getItem(), true);
				}
			}
		} else {
			pokemon.formeChange(templateid, pokemon.getItem(), true);
		}

		// Limit one mega evolution
		let wasMega = pokemon.canMegaEvo;
		for (const ally of side.pokemon) {
			if (wasMega) {
				ally.canMegaEvo = null;
			} else {
				ally.canUltraBurst = null;
			}
		}

		this.runEvent('AfterMega', pokemon);
		return true;
	},

	/**
	 * @param {StatsTable} stats
	 * @param {PokemonSet} set
	 * @return {StatsTable}
	 */
	natureModify(stats, set) {
		let nature = this.getNature(set.nature);
		// @ts-ignore
		if (nature.plus) stats[nature.plus] = Math.floor(stats[nature.plus] * 1.1);
		// @ts-ignore
		if (nature.minus) stats[nature.minus] = Math.floor(stats[nature.minus] * 0.9);
		let friendshipValue = Math.floor((this.clampIntRange(set.happiness || 255, 0, 255) / 255 / 10 + 1) * 100);
		for (const stat in stats) {
			if (stat !== 'hp') {
				// @ts-ignore
				stats[stat] = Math.floor(stats[stat] * friendshipValue / 100);
			}
			// @ts-ignore
			stats[stat] += this.getAwakeningValues(set, stat);
		}
		return stats;
	},

	pokemon: {
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
