export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	inherit: 'mixandmega',
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
				this.battle.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]', '[from] format: Mix and Mega');
			}
			// }

			pokemon.canMegaEvo = false;
			return true;
		},
		terastallize(pokemon) {
			if (pokemon.illusion?.species.baseSpecies === 'Ogerpon') {
				this.battle.singleEvent('End', this.dex.abilities.get('Illusion'), pokemon.abilityState, pokemon);
			}
			if (pokemon.illusion?.species.baseSpecies === 'Terapagos') {
				this.battle.singleEvent('End', this.dex.abilities.get('Illusion'), pokemon.abilityState, pokemon);
			}

			let type = pokemon.teraType;
			if (pokemon.species.baseSpecies !== 'Ogerpon' && pokemon.getItem().name.endsWith('Mask')) {
				type = this.dex.species.get(pokemon.getItem().forcedForme).requiredTeraType!;
			}
			this.battle.add('-terastallize', pokemon, type);
			pokemon.terastallized = type;
			for (const ally of pokemon.side.pokemon) {
				ally.canTerastallize = null;
			}
			pokemon.addedType = '';
			pokemon.knownType = true;
			pokemon.apparentType = type;
			if (pokemon.species.baseSpecies === 'Ogerpon') {
				const tera = pokemon.species.id === 'ogerpon' ? 'tealtera' : 'tera';
				pokemon.formeChange(pokemon.species.id + tera, pokemon.getItem(), true);
			} else {
				if (pokemon.getItem().name.endsWith('Mask')) {
					const species: Species = (this as any).getMixedSpecies(pokemon.m.originalSpecies,
						pokemon.getItem().forcedForme! + '-Tera', pokemon);
					const oSpecies = this.dex.species.get(pokemon.m.originalSpecies);
					const originalTeraSpecies = this.dex.species.get((species as any).originalSpecies);
					pokemon.formeChange(species, pokemon.getItem(), true);
					this.battle.add('-start', pokemon, originalTeraSpecies.requiredItem, '[silent]');
					if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
						this.battle.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
					}
				}
			}
			if (pokemon.species.name === 'Terapagos-Terastal' && type === 'Stellar') {
				pokemon.formeChange('Terapagos-Stellar', null, true);
			}
			this.battle.runEvent('AfterTerastallization', pokemon);
		},
		getMixedSpecies(originalForme, formeChange, pokemon) {
			const originalSpecies = this.dex.species.get(originalForme);
			const formeChangeSpecies = this.dex.species.get(formeChange);
			if (originalSpecies.baseSpecies === formeChangeSpecies.baseSpecies &&
				!formeChangeSpecies.isMega && !formeChangeSpecies.isPrimal) {
				return formeChangeSpecies;
			}
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
			let formeType: string | null = null;
			if (baseSpecies.name === 'Arceus') {
				deltas.type = formeChangeSpecies.types[0];
				formeType = 'Primary';
			} else if (baseSpecies.name === 'Silvally') {
				deltas.type = formeChangeSpecies.types[0];
				formeType = 'Tertiary';
			} else if (formeChangeSpecies.types.length > baseSpecies.types.length) {
				deltas.type = formeChangeSpecies.types[1];
			} else if (formeChangeSpecies.types.length < baseSpecies.types.length) {
				deltas.type = this.battle.ruleTable.has('mixandmegaoldaggronite') ? 'mono' : baseSpecies.types[0];
			} else if (formeChangeSpecies.types[1] !== baseSpecies.types[1]) {
				deltas.type = formeChangeSpecies.types[1];
			} else if (formeChangeSpecies.types[0] !== baseSpecies.types[0]) {
				deltas.type = formeChangeSpecies.types[0];
				formeType = 'Primary';
				deltas.isMega = true;
			}
			if (formeChangeSpecies.isMega && !formeType) formeType = 'Mega';
			if (formeChangeSpecies.isPrimal) formeType = 'Primal';
			if (formeChangeSpecies.name.endsWith('Crowned')) formeType = 'Crowned';
			if (formeType) deltas.formeType = formeType;
			if (!deltas.formeType && formeChangeSpecies.abilities['H'] &&
				pokemon && pokemon.baseSpecies.abilities['H'] === pokemon.getAbility().name) {
				deltas.ability = formeChangeSpecies.abilities['H'];
			}
			return deltas;
		},
		mutateOriginalSpecies(speciesOrForme, deltas) {
			if (!deltas) throw new TypeError("Must specify deltas!");
			const species = this.dex.deepClone(this.dex.species.get(speciesOrForme));
			species.abilities = { '0': deltas.ability };
			if (deltas.formeType === 'Primary') {
				const secondType = species.types[1];
				species.types = [deltas.type];
				if (secondType && secondType !== deltas.type) species.types.push(secondType);
			} else if (deltas.formeType === 'Tertiary') {
				species.types.push(deltas.type);
			} else if (species.types[0] === deltas.type) {
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
			if (deltas.formeType === 'Mega' || deltas.isMega) species.isMega = true;
			if (deltas.formeType === 'Primal') species.isPrimal = true;
			return species;
		},
	},
};
