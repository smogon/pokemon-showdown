// Note: These are the rules that formats use
// The list of formats is stored in config/formats.js
export const Rulesets: {[k: string]: FormatData} = {
	// Allows various formes of the same pokemon to show up properly on the same team in team preview
	teampreview: {
		effectType: 'Rule',
		name: 'Team Preview',
		desc: "Allows each player to see the Pok&eacute;mon on their opponent's team before they choose their lead Pok&eacute;mon",
		onBegin() {
			this.add('clearpoke');
			for (const pokemon of this.getAllPokemon()) {
				const details = pokemon.details.replace(', shiny', '')
					.replace(/(Pumpkaboo)(-[a-zA-Z?-]+)?/g, '$1-*');
				this.add('poke', pokemon.side.id, details, '');
			}
		},
		onTeamPreview() {
			this.makeRequest('teampreview');
		},
	},
	// Shows the stats, abilities, and typing of pokemon when they switch in, because the client won't show that properly
	datamod: {
		effectType: 'Rule',
		name: 'Data Mod',
		desc: 'When a new Pokémon switches in for the first time, information about its types, stats and Abilities is displayed to both players.',
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				const species = this.dex.species.get(pokemon.species.name);
				const baseSpecies = this.dex.mod('gen8').species.get(pokemon.species.name);
				let modded = false;
				for (const type of [0, 1]) {
					if (species.types[type] !== baseSpecies.types[type]) {
						modded = true;
						break;
					}
				}
				if (Object.values(species.baseStats).join('/') !== Object.values(baseSpecies.baseStats).join('/')) {
					modded = true;
				}
				for (const i of ['0', '1', 'H', 'S'] as ('0' | '1' | 'H' | 'S')[]) {
					if (species.abilities[i] !== baseSpecies.abilities[i]) {
						modded = true;
						break;
					}
				}
				if (modded) {
					pokemon.m.isModded = true;
				}
			}
		},
		onSwitchIn(pokemon) {
			let species = pokemon.species;
			if (pokemon.illusion) {
				species = pokemon.illusion.species;
				if (!pokemon.illusion.m.isModded) return;
				this.add('-start', pokemon, 'typechange', pokemon.illusion.getTypes(true).join('/'), '[silent]');
				if (pokemon.illusion.m.switchedIn) return;
				pokemon.illusion.m.switchedIn = true;
			} else {
				if (!pokemon.m.isModded) return;
				this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
				if (pokemon.m.switchedIn) return;
				pokemon.m.switchedIn = true;
			}
			const abilities = Object.values(species.abilities).join(' / ');
			const baseStats = species.baseStats;
			const type = species.types[0];
			if (species.types[1]) {
				const type2 = species.types[1];
				this.add(`raw|<ul class="utilichart"><li class="result"><span class="col pokemonnamecol" style="white-space: nowrap">` + species.name + `</span> <span class="col typecol"><img src="https://${Config.routes.client}/sprites/types/${type}.png" alt="${type}" height="14" width="32"><img src="https://${Config.routes.client}/sprites/types/${type2}.png" alt="${type2}" height="14" width="32"></span> <span style="float: left ; min-height: 26px"><span class="col abilitycol">` + abilities + `</span><span class="col abilitycol"></span></span></li><li style="clear: both"></li></ul>`);
			} else {
				this.add(`raw|<ul class="utilichart"><li class="result"><span class="col pokemonnamecol" style="white-space: nowrap">` + species.name + `</span> <span class="col typecol"><img src="https://${Config.routes.client}/sprites/types/${type}.png" alt="${type}" height="14" width="32"></span> <span style="float: left ; min-height: 26px"><span class="col abilitycol">` + abilities + `</span><span class="col abilitycol"></span></span></li><li style="clear: both"></li></ul>`);
			}
			this.add(`raw|<ul class="utilichart"><li class="result"><span style="float: left ; min-height: 26px"><span class="col statcol"><em>HP</em><br>` + baseStats.hp + `</span> <span class="col statcol"><em>Atk</em><br>` + baseStats.atk + `</span> <span class="col statcol"><em>Def</em><br>` + baseStats.def + `</span> <span class="col statcol"><em>SpA</em><br>` + baseStats.spa + `</span> <span class="col statcol"><em>SpD</em><br>` + baseStats.spd + `</span> <span class="col statcol"><em>Spe</em><br>` + baseStats.spe + `</span> </span></li><li style="clear: both"></li></ul>`);
		},
		onDamagingHit(damage, target, source, move) {
			if (target.hasAbility('illusion')) { // making sure the correct information is given when an Illusion breaks
				if (target.m.isModded) {
					this.add('-start', target, 'typechange', target.getTypes(true).join('/'), '[silent]');
					if (!target.m.switchedIn) {
						target.m.switchedIn = true;
						const species = target.species;
						const abilities = Object.values(species.abilities).join(' / ');
						const baseStats = species.baseStats;
						const type = species.types[0];
						const type2 = species.types[1];
						this.add(
							`raw|<ul class="utilichart"><li class="result"><span class="col pokemonnamecol" style="white-space: nowrap">${species.name}</span> ` +
							`<span class="col typecol"><psicon type="${type}" />${type2 ? `<psicon type="${type2}" />` : ''}</span> ` +
							`<span style="float: left ; min-height: 26px"><span class="col abilitycol">${abilities}</span><span class="col abilitycol"></span>` +
							`</span></li><li style="clear: both"></li></ul>`
						);
						this.add(
							`raw|<ul class="utilichart"><li class="result"><span style="float: left ; min-height: 26px"><span class="col statcol"><em>HP</em><br>` +
							`${baseStats.hp}</span> <span class="col statcol"><em>Atk</em><br>${baseStats.atk}</span> <span class="col statcol"><em>Def</em><br>` +
							`${baseStats.def}</span> <span class="col statcol"><em>SpA</em><br>${baseStats.spa}</span> <span class="col statcol"><em>SpD</em><br>` +
							`${baseStats.spd}</span> <span class="col statcol"><em>Spe</em><br>${baseStats.spe}</span> </span></li><li style="clear: both"></li></ul>`
						);
					}
				} else {
					const types = target.baseSpecies.types;
					if (target.getTypes().join() === types.join()) {
						this.add('-end', target, 'typechange', '[silent]');
					}
				}
			}
		},
	},
};
