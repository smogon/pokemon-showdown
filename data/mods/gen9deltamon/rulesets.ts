export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	megadatapreview: {
		effectType: 'Rule',
		name: 'Mega Data Preview',
		desc: 'When a Pokémon Mega Evolves, information about its types, stats and Abilities is displayed to both players.',
		onAfterMega(pokemon) {
			const species = pokemon.species;
			const gen = this.gen;

			// Recreation of Chat.getDataPokemonHTML
			let buf = '<li class="result">';
			buf += `<span class="col numcol">${species.tier}</span> `;
			buf += `<span class="col iconcol"><psicon pokemon="${species.id}"/></span> `;
			buf += `<span class="col pokemonnamecol" style="white-space:nowrap"><a href="https://dex.pokemonshowdown.com/pokemon/${species.id}" target="_blank">${species.name}</a></span> `;
			buf += '<span class="col typecol">';
			if (species.types) {
				for (const type of species.types) {
					buf += `<img src="https://play.pokemonshowdown.com/sprites/types/${type}.png" alt="${type}" height="14" width="32">`;
				}
			}
			buf += '</span> ';
			if (gen >= 3) {
				buf += '<span style="float:left;min-height:26px">';
				if (species.abilities['1'] && (gen >= 4 || this.dex.abilities.get(species.abilities['1']).gen === 3)) {
					buf += `<span class="col twoabilitycol">${species.abilities['0']}<br />${species.abilities['1']}</span>`;
				} else {
					buf += `<span class="col abilitycol">${species.abilities['0']}</span>`;
				}
				if (species.abilities['H'] && species.abilities['S']) {
					buf += `<span class="col twoabilitycol${species.unreleasedHidden ? ' unreleasedhacol' : ''}"><em>${species.abilities['H']}<br />(${species.abilities['S']})</em></span>`;
				} else if (species.abilities['H']) {
					buf += `<span class="col abilitycol${species.unreleasedHidden ? ' unreleasedhacol' : ''}"><em>${species.abilities['H']}</em></span>`;
				} else if (species.abilities['S']) {
					// special case for Zygarde
					buf += `<span class="col abilitycol"><em>(${species.abilities['S']})</em></span>`;
				} else {
					buf += '<span class="col abilitycol"></span>';
				}
				buf += '</span>';
			}
			buf += '<span style="float:left;min-height:26px">';
			buf += `<span class="col statcol"><em>HP</em><br />${species.baseStats.hp}</span> `;
			buf += `<span class="col statcol"><em>Atk</em><br />${species.baseStats.atk}</span> `;
			buf += `<span class="col statcol"><em>Def</em><br />${species.baseStats.def}</span> `;
			if (gen <= 1) {
				buf += `<span class="col statcol"><em>Spc</em><br />${species.baseStats.spa}</span> `;
			} else {
				buf += `<span class="col statcol"><em>SpA</em><br />${species.baseStats.spa}</span> `;
				buf += `<span class="col statcol"><em>SpD</em><br />${species.baseStats.spd}</span> `;
			}
			buf += `<span class="col statcol"><em>Spe</em><br />${species.baseStats.spe}</span> `;
			buf += `<span class="col bstcol"><em>BST<br />${species.bst}</em></span> `;
			buf += '</span>';
			buf += '</li>';
			buf = `<div class="message"><ul class="utilichart">${buf}<li style="clear:both"></li></ul></div>`;
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
			this.add(`raw|${buf}`);
		},
	},
};
