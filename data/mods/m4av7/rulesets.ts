export const Formats: {[k: string]: FormatData} = {
	megadatamod: {
		effectType: 'Rule',
		name: 'Mega Data Mod',
		desc: 'Gives data on stats, Ability and types when a Pokémon Mega Evolves or undergoes Ultra Burst.',
		onSwitchIn(pokemon) {
			if (pokemon.illusion) {
				if (pokemon.illusion.species.forme.startsWith('Mega') || pokemon.illusion.species.forme.startsWith('Ultra')) {
					this.add('-start', pokemon, 'typechange', pokemon.illusion.getTypes(true).join('/'), '[silent]');
				}
			} else {
				if (pokemon.species.forme.startsWith('Mega') || pokemon.species.forme.startsWith('Ultra')) {
					this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
				}
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (target.hasAbility('illusion')) {
				if (target.species.forme.startsWith('Mega') || target.species.forme.startsWith('Ultra')) {
					this.add('-start', target, 'typechange', target.getTypes(true).join('/'), '[silent]');
				} else {
					this.add('-end', target, 'typechange', '[silent]');
				}
			}
		},
		onAfterMega(pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
			const species = this.dex.getSpecies(pokemon.species.name);
			const abilities = species.abilities;
			const baseStats = species.baseStats;
			const type = species.types[0];
			if (species.types[1]) {
				const type2 = species.types[1];
				this.add(`raw|<ul class="utilichart"><li class="result"><span class="col pokemonnamecol" style="white-space: nowrap">` + species.name + `</span> <span class="col typecol"><img src="https://${Config.routes.client}/sprites/types/${type}.png" alt="${type}" height="14" width="32"><img src="https://${Config.routes.client}/sprites/types/${type2}.png" alt="${type2}" height="14" width="32"></span> <span style="float: left ; min-height: 26px"><span class="col abilitycol">` + abilities[0] + `</span><span class="col abilitycol"></span></span><span style="float: left ; min-height: 26px"><span class="col statcol"><em>HP</em><br>` + baseStats.hp + `</span> <span class="col statcol"><em>Atk</em><br>` + baseStats.atk + `</span> <span class="col statcol"><em>Def</em><br>` + baseStats.def + `</span> <span class="col statcol"><em>SpA</em><br>` + baseStats.spa + `</span> <span class="col statcol"><em>SpD</em><br>` + baseStats.spd + `</span> <span class="col statcol"><em>Spe</em><br>` + baseStats.spe + `</span> </span></li><li style="clear: both"></li></ul>`);
			} else {
				this.add(`raw|<ul class="utilichart"><li class="result"><span class="col pokemonnamecol" style="white-space: nowrap">` + species.name + `</span> <span class="col typecol"><img src="https://${Config.routes.client}/sprites/types/${type}.png" alt="${type}" height="14" width="32"></span> <span style="float: left ; min-height: 26px"><span class="col abilitycol">` + abilities[0] + `</span><span class="col abilitycol"></span></span><span style="float: left ; min-height: 26px"><span class="col statcol"><em>HP</em><br>` + baseStats.hp + `</span> <span class="col statcol"><em>Atk</em><br>` + baseStats.atk + `</span> <span class="col statcol"><em>Def</em><br>` + baseStats.def + `</span> <span class="col statcol"><em>SpA</em><br>` + baseStats.spa + `</span> <span class="col statcol"><em>SpD</em><br>` + baseStats.spd + `</span> <span class="col statcol"><em>Spe</em><br>` + baseStats.spe + `</span> </span></li><li style="clear: both"></li></ul>`);
			}
		},
	},
	megahintmod: {
		effectType: 'Rule', 
		name: 'Mega Hint Mod', 
		desc: 'At the start of a battle, gives each player information about the potential Mega in their party', 
		onBegin() {
			this.add('-message', 'Your Mega Evolution this match is:'); 
			let allPokemon = this.p1.pokemon.concat(this.p2.pokemon); 
				for (let pokemon of allPokemon) {
					const item = this.dex.getItem(pokemon.item)
					if (pokemon.canMegaEvo) {
							
							let mega = this.dex.getSpecies(pokemon.canMegaEvo); 
							const baseStats = mega.baseStats; 	
							let types = new String(mega.types[0]); 
							if (mega.types[1]) {
								types = types.concat("/" + mega.types[1])
							}
							let msg = new String(" Spe"); 
							if (mega.name === "Mimikyu-Mega") {
								msg = msg.concat("; Mega Mimikyu has two forms! If its Disguise is busted, it will Mega Evolve into Mimikyu-Busted-Mega. /dt for info"); 
							}
							let txt = new String(mega.name + " (" + types +
							"); Ability: " + mega.abilities[0] + " (" + this.dex.getAbility(mega.abilities[0]).shortDesc +
							"); Stats: " + baseStats.hp +
							" HP / " + baseStats.atk +
							" Atk / " + baseStats.def +
							" Def / " + baseStats.spa +
							" SpA / " + baseStats.spd +
							" SpD / " + baseStats.spe + msg); 
							this.hint(txt, true, pokemon.side); 
						
					}
			}
			this.add('-message', 'Use the command /dt for more information!'); 
		},
	},
	
	sametypeclause: {
		effectType: 'ValidatorRule',
		name: 'Same Type Clause',
		desc: "Forces all Pok&eacute;mon on a team to share a type with each other",
		onBegin() {
			this.add('rule', 'Same Type Clause: Pokémon in a team must share a type');
		},
		onValidateTeam(team) {
			let typeTable: string[] = [];
			for (const [i, set] of team.entries()) {
				let species = this.dex.getSpecies(set.species);
				if (!species.types) return [`Invalid pokemon ${set.name || set.species}`];
				if (i === 0) {
					typeTable = species.types;
				} else {
					typeTable = typeTable.filter(type => species.types.includes(type));
				}
				//if (this.gen >= 7) {
					const item = this.dex.getItem(set.item);
					if (item.megaStone && species.baseSpecies === item.megaEvolves) {
						species = this.dex.getSpecies(item.megaStone);
						typeTable = typeTable.filter(type => species.types.includes(type));
					}
					if (item.id === "ultranecroziumz" && species.baseSpecies === "Necrozma") {
						species = this.dex.getSpecies("Necrozma-Ultra");
						typeTable = typeTable.filter(type => species.types.includes(type));
					}
					if (item.id === "mimikyunite" && species.baseSpecies === "Mimikyu") { //Mega Mimikyu is banned from Fairy Mono and this enforces that
						species = this.dex.getSpecies("Mimikyu-Busted-Mega");
						typeTable = typeTable.filter(type => species.types.includes(type));
					} 
				//}
				if (!typeTable.length) return [`Your team must share a type.`];
			}
		},
	},
};
