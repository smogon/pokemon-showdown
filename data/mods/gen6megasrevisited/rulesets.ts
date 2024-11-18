export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	megadatamod: {
		effectType: 'Rule',
		name: 'Mega Data Mod',
		desc: 'Gives data on stats, Ability and types when a Pokémon Mega Evolves or undergoes Ultra Burst.',
		onSwitchIn(pokemon) {
			if (pokemon.species.forme.startsWith('Mega') || pokemon.species.forme.startsWith('Ultra')) {
				this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
			}
		},
		onAfterMega(pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
			const species = pokemon.species;
			let buf = `<span class="col pokemonnamecol" style="white-space: nowrap">${species.name}</span> `;
			buf += `<span class="col typecol">`;
			buf += `<img src="https://${Config.routes.client}/sprites/types/${species.types[0]}.png" alt="${species.types[0]}" height="14" width="32">`;
			if (species.types[1]) {
				buf += `<img src="https://${Config.routes.client}/sprites/types/${species.types[1]}.png" alt="${species.types[1]}" height="14" width="32">`;
			}
			buf += `</span> `;
			buf += `<span style="float: left ; min-height: 26px"><span class="col abilitycol">${species.abilities[0]}</span><span class="col abilitycol"></span></span>`;
			const stats = [];
			let stat: StatID;
			for (stat in species.baseStats) {
				const statNames: {[k in StatID]: string} = {hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "SpD", spe: "Spe"};
				stats.push(`<span class="col statcol"><em>${statNames[stat]}</em><br>${species.baseStats[stat]}</span>`);
			}
			buf += `<span style="float: left ; min-height: 26px">${stats.join(' ')}</span>`;
			buf += `</span>`;
			this.add(`raw|<ul class="utilichart"><li class="result">${buf}</li><li style="clear: both"></li></ul>`);
		},
	},
};
