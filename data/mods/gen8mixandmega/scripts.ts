export const Scripts: ModdedBattleScriptsData = {
	gen: 8,
	inherit: 'gen8',
	init() {
		for (const i in this.data.Items) {
			const item = this.data.Items[i];
			if (!item.megaStone || item.isNonstandard !== 'Past') continue;
			this.modData('Items', i).onTakeItem = false;
			this.modData('Items', i).isNonstandard = null;
			if (item.megaStone) {
				for (const megaEvo of Object.values(item.megaStone)) {
					this.modData('FormatsData', this.toID(megaEvo)).isNonstandard = null;
				}
			}
		}
	},
	actions: {
		canMegaEvo(pokemon) {
			if (pokemon.species.isMega) return null;

			const item = pokemon.getItem();
			if (!item.megaStone) return null;
			return Object.values(item.megaStone)[0];
		},
		runMegaEvo(pokemon) {
			if (pokemon.species.isMega) return false;

			const species: Species = (this as any).getMixedSpecies(pokemon.m.originalSpecies, pokemon.canMegaEvo, pokemon);

			/* Do we have a proper sprite for it? Code for when megas actually exist
			if (this.dex.species.get(pokemon.canMegaEvo!).baseSpecies === pokemon.m.originalSpecies) {
				pokemon.formeChange(species, pokemon.getItem(), true);
			} else { */
			const oSpecies = this.dex.species.get(pokemon.m.originalSpecies);
			const oMegaSpecies = this.dex.species.get((species as any).originalSpecies);
			pokemon.formeChange(species, pokemon.getItem(), true);
			this.battle.add('-start', pokemon, oMegaSpecies.requiredItem, '[silent]');
			if (oSpecies.types.join('/') !== pokemon.species.types.join('/')) {
				this.battle.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
			}
			// }

			pokemon.canMegaEvo = false;
			return true;
		},
		getMixedSpecies(originalForme, formeChange, pokemon) {
			const originalSpecies = this.dex.species.get(originalForme);
			const formeChangeSpecies = this.dex.species.get(formeChange);
			const deltas = (this as any).getFormeChangeDeltas(formeChangeSpecies, pokemon);
			const species = (this as any).mutateOriginalSpecies(originalSpecies, deltas);
			return species;
		},
		getFormeChangeDeltas(formeChangeSpecies, pokemon) {
			// Should be fine as long as Necrozma-U doesn't get added or Game Freak makes me sad with some convoluted forme change
			let baseSpecies = this.dex.species.get(formeChangeSpecies.isMega ?
				formeChangeSpecies.battleOnly as string : formeChangeSpecies.baseSpecies);
			if (formeChangeSpecies.name === 'Zygarde-Mega') {
				baseSpecies = this.dex.species.get('Zygarde-Complete');
			}
			const deltas: {
				ability: string,
				baseStats: SparseStatsTable,
				weighthg: number,
				heightm: number,
				originalSpecies: string,
				requiredItem: string | undefined,
				type?: string,
				formeType?: string,
				isMega?: boolean,
			} = {
				ability: formeChangeSpecies.abilities['0'],
				baseStats: {},
				weighthg: formeChangeSpecies.weighthg - baseSpecies.weighthg,
				heightm: ((formeChangeSpecies.heightm * 10) - (baseSpecies.heightm * 10)) / 10,
				originalSpecies: formeChangeSpecies.name,
				requiredItem: formeChangeSpecies.requiredItem,
			};
			let statId: StatID;
			for (statId in formeChangeSpecies.baseStats) {
				deltas.baseStats[statId] = formeChangeSpecies.baseStats[statId] - baseSpecies.baseStats[statId];
			}
			if (formeChangeSpecies.types.length > baseSpecies.types.length) {
				deltas.type = formeChangeSpecies.types[1];
			} else if (formeChangeSpecies.types.length < baseSpecies.types.length) {
				deltas.type = 'mono';
			} else if (formeChangeSpecies.types[1] !== baseSpecies.types[1]) {
				deltas.type = formeChangeSpecies.types[1];
			}
			deltas.isMega = true;
			return deltas;
		},
		mutateOriginalSpecies(speciesOrForme, deltas) {
			if (!deltas) throw new TypeError("Must specify deltas!");
			const species = this.dex.deepClone(this.dex.species.get(speciesOrForme));
			species.abilities = { '0': deltas.ability };
			if (species.types[0] === deltas.type) {
				species.types = [deltas.type];
			} else if (deltas.type === 'mono') {
				species.types = [species.types[0]];
			} else if (deltas.type) {
				species.types = [species.types[0], deltas.type];
			}
			const baseStats = species.baseStats;
			for (const statName in baseStats) {
				baseStats[statName] = this.battle.clampIntRange(baseStats[statName] + deltas.baseStats[statName], 1, 255);
			}
			species.weighthg = Math.max(1, species.weighthg + deltas.weighthg);
			species.heightm = Math.max(0.1, ((species.heightm * 10) + (deltas.heightm * 10)) / 10);
			species.originalSpecies = deltas.originalSpecies;
			species.requiredItem = deltas.requiredItem;
			if (deltas.isMega) species.isMega = true;
			return species;
		},
	},
};
