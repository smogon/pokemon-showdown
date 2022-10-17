export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen7',
	init() {
		for (const id in this.data.Items) {
			if (!this.data.Items[id].megaStone) continue;
			this.modData('Items', id).onTakeItem = false;
		}
	},
	actions: {
		canMegaEvo(pokemon) {
			if (pokemon.species.isMega || pokemon.species.isPrimal) return null;

			const item = pokemon.getItem();
			if (item.megaStone) {
				if (item.megaStone === pokemon.name) return null;
				return item.megaStone;
			} else if (pokemon.baseMoves.includes('dragonascent' as ID)) {
				return 'Rayquaza-Mega';
			} else {
				return null;
			}
		},
		runMegaEvo(pokemon) {
			if (pokemon.species.isMega || pokemon.species.isPrimal) return false;

			const isUltraBurst = !pokemon.canMegaEvo;
			// @ts-ignore
			const species: Species = this.getMixedSpecies(pokemon.m.originalSpecies, pokemon.canMegaEvo || pokemon.canUltraBurst);

			// Do we have a proper sprite for it?
			// @ts-ignore assert non-null pokemon.canMegaEvo
			if (isUltraBurst || this.dex.species.get(pokemon.canMegaEvo).baseSpecies === pokemon.m.originalSpecies) {
				pokemon.formeChange(species, pokemon.getItem(), true);
			} else {
				const oSpecies = this.dex.species.get(pokemon.m.originalSpecies);
				// @ts-ignore
				const oMegaSpecies = this.dex.species.get(species.originalMega);
				pokemon.formeChange(species, pokemon.getItem(), true);
				this.battle.add('-start', pokemon, oMegaSpecies.requiredItem || oMegaSpecies.requiredMove, '[silent]');
				if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
					this.battle.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}

			pokemon.canMegaEvo = null;
			if (isUltraBurst) pokemon.canUltraBurst = null;
			return true;
		},
		getMixedSpecies(originalSpecies, megaSpecies) {
			const oSpecies = this.dex.species.get(originalSpecies);
			const mSpecies = this.dex.species.get(megaSpecies);
			if (oSpecies.baseSpecies === mSpecies.baseSpecies) return mSpecies;
			// @ts-ignore
			const deltas = this.getMegaDeltas(mSpecies);
			// @ts-ignore
			const species = this.doGetMixedSpecies(oSpecies, deltas);
			return species;
		},
		getMegaDeltas(megaSpecies) {
			const baseSpecies = this.dex.species.get(megaSpecies.baseSpecies);
			const deltas: {
				ability: string,
				baseStats: SparseStatsTable,
				weighthg: number,
				originalMega: string,
				requiredItem: string | undefined,
				type?: string,
				isMega?: boolean,
				isPrimal?: boolean,
			} = {
				ability: megaSpecies.abilities['0'],
				baseStats: {},
				weighthg: megaSpecies.weighthg - baseSpecies.weighthg,
				originalMega: megaSpecies.name,
				requiredItem: megaSpecies.requiredItem,
			};
			let stat: StatID;
			for (stat in megaSpecies.baseStats) {
				deltas.baseStats[stat] = megaSpecies.baseStats[stat] - baseSpecies.baseStats[stat];
			}
			if (megaSpecies.types.length > baseSpecies.types.length) {
				deltas.type = megaSpecies.types[1];
			} else if (megaSpecies.types.length < baseSpecies.types.length) {
				deltas.type = baseSpecies.types[0];
			} else if (megaSpecies.types[1] !== baseSpecies.types[1]) {
				deltas.type = megaSpecies.types[1];
			}
			if (megaSpecies.isMega) deltas.isMega = true;
			if (megaSpecies.isPrimal) deltas.isPrimal = true;
			return deltas;
		},
		doGetMixedSpecies(speciesOrSpeciesName, deltas) {
			if (!deltas) throw new TypeError("Must specify deltas!");
			const species = this.dex.deepClone(this.dex.species.get(speciesOrSpeciesName));
			species.abilities = {'0': deltas.ability};
			if (species.types[0] === deltas.type) {
				species.types = [deltas.type];
			} else if (deltas.type) {
				species.types = [species.types[0], deltas.type];
			}
			const baseStats = species.baseStats;
			for (const statName in baseStats) {
				baseStats[statName] = this.battle.clampIntRange(baseStats[statName] + deltas.baseStats[statName], 1, 255);
			}
			species.weighthg = Math.max(1, species.weighthg + deltas.weighthg);
			species.originalMega = deltas.originalMega;
			species.requiredItem = deltas.requiredItem;
			if (deltas.isMega) species.isMega = true;
			if (deltas.isPrimal) species.isPrimal = true;
			return species;
		},
	},
};
