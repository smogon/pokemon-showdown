'use strict';

/**@type {ModdedBattleScriptsData} */
let BattleScripts = {
	init() {
		for (let i in this.data.Items) {
			if (!this.data.Items[i].megaStone) continue;
			this.modData('Items', i).onTakeItem = false;
			let id = toID(this.data.Items[i].megaStone);
			this.modData('FormatsData', id).isNonstandard = null;
		}
	},
	canMegaEvo(pokemon) {
		if (pokemon.species.isMega) return null;

		const item = pokemon.getItem();
		if (item.megaStone) {
			if (item.megaStone === pokemon.forme) return null;
			return item.megaStone;
		} else {
			return null;
		}
	},
	runMegaEvo(pokemon) {
		if (pokemon.species.isMega) return false;

		/**@type {Species} */
		// @ts-ignore
		const species = this.getMixedSpecies(pokemon.m.originalSpecies, pokemon.canMegaEvo);
		const side = pokemon.side;

		// Pokémon affected by Sky Drop cannot Mega Evolve. Enforce it here for now.
		for (const foeActive of side.foe.active) {
			if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		// Do we have a proper sprite for it?
		// @ts-ignore assert non-null pokemon.canMegaEvo
		if (this.dex.getSpecies(pokemon.canMegaEvo).baseSpecies === pokemon.m.originalSpecies) {
			pokemon.formeChange(species, pokemon.getItem(), true);
		} else {
			let oSpecies = this.dex.getSpecies(pokemon.m.originalSpecies);
			// @ts-ignore
			let oMegaSpecies = this.dex.getSpecies(species.originalMega);
			pokemon.formeChange(species, pokemon.getItem(), true);
			this.add('-start', pokemon, oMegaSpecies.requiredItem, '[silent]');
			if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
				this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
			}
		}

		pokemon.canMegaEvo = null;
		return true;
	},
	getMixedSpecies(originalForme, megaForme) {
		let originalSpecies = this.dex.getSpecies(originalForme);
		let megaSpecies = this.dex.getSpecies(megaForme);
		if (originalSpecies.baseSpecies === megaSpecies.baseSpecies) return megaSpecies;
		// @ts-ignore
		let deltas = this.getMegaDeltas(megaSpecies);
		// @ts-ignore
		let species = this.doGetMixedSpecies(originalSpecies, deltas);
		return species;
	},
	getMegaDeltas(megaSpecies) {
		let baseSpecies = this.dex.getSpecies(megaSpecies.baseSpecies);
		/**@type {{ability: string, baseStats: {[k: string]: number}, weighthg: number, originalMega: string, requiredItem: string | undefined, type?: string, isMega?: boolean}} */
		let deltas = {
			ability: megaSpecies.abilities['0'],
			baseStats: {},
			weighthg: megaSpecies.weighthg - baseSpecies.weighthg,
			originalMega: megaSpecies.name,
			requiredItem: megaSpecies.requiredItem,
		};
		for (let statId in megaSpecies.baseStats) {
			// @ts-ignore
			deltas.baseStats[statId] = megaSpecies.baseStats[statId] - baseSpecies.baseStats[statId];
		}
		if (megaSpecies.types.length > baseSpecies.types.length) {
			deltas.type = megaSpecies.types[1];
		} else if (megaSpecies.types.length < baseSpecies.types.length) {
			deltas.type = 'mono';
		} else if (megaSpecies.types[1] !== baseSpecies.types[1]) {
			deltas.type = megaSpecies.types[1];
		}
		if (megaSpecies.isMega) deltas.isMega = true;
		return deltas;
	},
	doGetMixedSpecies(speciesOrForme, deltas) {
		if (!deltas) throw new TypeError("Must specify deltas!");
		let species = this.dex.deepClone(this.dex.getSpecies(speciesOrForme));
		species.abilities = {0: deltas.ability};
		if (species.types[0] === deltas.type) {
			species.types = [deltas.type];
		} else if (deltas.type === 'mono') {
			species.types = [species.types[0]];
		} else if (deltas.type) {
			species.types = [species.types[0], deltas.type];
		}
		let baseStats = species.baseStats;
		for (let statName in baseStats) {
			baseStats[statName] = this.dex.clampIntRange(baseStats[statName] + deltas.baseStats[statName], 1, 255);
		}
		species.weighthg = Math.max(1, species.weighthg + deltas.weighthg);
		species.originalMega = deltas.originalMega;
		species.requiredItem = deltas.requiredItem;
		if (deltas.isMega) species.isMega = true;
		return species;
	},
};

exports.BattleScripts = BattleScripts;
