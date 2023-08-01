export const Rulesets: {[k: string]: ModdedFormatData} = {
	batonpassmod: {
		effectType: 'Rule',
			name: 'Baton Pass Mod',
			desc: "Positive stat boosts are reset upon using Baton Pass.",
			onBegin() {
				this.add('rule', 'Baton Pass Mod: Positive stat boosts are reset upon using Baton Pass');
			},
			onHit(source, target, move) {
				if (source.positiveBoosts() && move.id === 'batonpass') {
					this.add('-clearpositiveboost', source);
					this.hint("Baton Pass Mod activated: Stat Boosts cannot be passed");
				}
			},
	},
	hoenngaidenmod: {
		effectType: 'Rule',
		name: 'Hoenn Gaiden Mod',
		desc: 'At the start of a battle, gives each player a link to the Hoenn Gaiden thread so they can use it to get information about new additions to the metagame.',
		onBegin() {
			this.add(`raw|<img src="https://cdn.discordapp.com/attachments/510822010922860545/864665757446045716/Hoenn_Gaiden_Banner.png" height="213" width="381">`);
			this.add('-message', `Welcome to Hoenn Gaiden!`);
			this.add('-message', `This is a [Gen 3] OU-based format where we add later generation Pokemon, items, moves, and abilities, as well as change up existing ones!`);
			this.add('-message', `You can find our thread and metagame resources here:`);
			this.add('-message', `https://www.smogon.com/forums/threads/hoenn-gaiden-pet-mod-of-the-season-slate-8-concept-voting.3681339/`);
		},
	},
	hgstandard: {
		effectType: 'ValidatorRule',
		name: 'HG Standard',
		desc: "The standard ruleset for all Hoenn Gaiden tiers.",
		ruleset: [
			'Obtainable', 'Sleep Clause Mod', 'Switch Priority Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod',
			'Hoenn Gaiden Mod', 'Deoxys Camouflage Clause', 'Baton Pass Mod',
		],
		banlist: [
			'Armaldo ++ Rapid Spin ++ Knock Off',
			'Kabutops ++ Rapid Spin ++ Knock Off',
			'Skarmory ++ Whirlwind ++ Drill Peck',
		],
	},
	datamod: {
		effectType: 'Rule',
		name: 'Data Mod',
		desc: 'When a new Pokémon switches in for the first time, information about its types, stats and Abilities is displayed to both players.',
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				const species = this.dex.species.get(pokemon.species.name);
				const baseSpecies = Dex.species.get(pokemon.species.name);
				let modded = false;
				for (const type of [0, 1]) {
					if (species.types[type] !== baseSpecies.types[type]) {
						modded = true;
					}
				}
				if (species.baseStats.hp !== baseSpecies.baseStats.hp) modded = true;
				if (species.baseStats.atk !== baseSpecies.baseStats.atk) modded = true;
				if (species.baseStats.def !== baseSpecies.baseStats.def) modded = true;
				if (species.baseStats.spa !== baseSpecies.baseStats.spa) modded = true;
				if (species.baseStats.spd !== baseSpecies.baseStats.spd) modded = true;
				if (species.baseStats.spe !== baseSpecies.baseStats.spe) modded = true;
				if (species.abilities[0] !== baseSpecies.abilities[0]) modded = true;
				if (species.abilities[1] !== baseSpecies.abilities[1]) modded = true;
				if (species.abilities['H'] !== baseSpecies.abilities['H']) modded = true;
				if (species.abilities['S'] !== baseSpecies.abilities['S']) modded = true;
				if (modded) {
					pokemon.isModded = true;
				}
			}
		},
		onSwitchIn(pokemon) {
			let species = this.dex.species.get(pokemon.species.name);
			const switchedIn = pokemon.switchedIn;
			if (pokemon.illusion) {
				species = this.dex.species.get(pokemon.illusion.species.name);
				if (!pokemon.illusion.isModded) return;
				this.add('-start', pokemon, 'typechange', pokemon.illusion.getTypes(true).join('/'), '[silent]');
				if (pokemon.illusion.switchedIn) return;
				pokemon.illusion.switchedIn = true;
			} else {
				if (!pokemon.isModded) return;
				this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
				if (pokemon.switchedIn) return;
				pokemon.switchedIn = true;
			}
			let abilities = species.abilities[0];
			if (species.abilities[1]) {
				abilities += ` / ${species.abilities[1]}`;
			}
			if (species.abilities['H']) {
				abilities += ` / ${species.abilities['H']}`;
			}
			if (species.abilities['S']) {
				abilities += ` / ${species.abilities['S']}`;
			}
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
				if (target.isModded) {
					this.add('-start', target, 'typechange', target.getTypes(true).join('/'), '[silent]');
					if (!target.switchedIn) {
						target.switchedIn = true;
						const species = this.dex.species.get(target.species.name);
						let abilities = species.abilities[0];
						if (species.abilities[1]) {
							abilities += ` / ${species.abilities[1]}`;
						}
						if (species.abilities['H']) {
							abilities += ` / ${species.abilities['H']}`;
						}
						if (species.abilities['S']) {
							abilities += ` / ${species.abilities['S']}`;
						}
						const baseStats = species.baseStats;
						const type = species.types[0];
						if (species.types[1]) {
							const type2 = species.types[1];
							this.add(`raw|<ul class="utilichart"><li class="result"><span class="col pokemonnamecol" style="white-space: nowrap">` + species.name + `</span> <span class="col typecol"><img src="https://${Config.routes.client}/sprites/types/${type}.png" alt="${type}" height="14" width="32"><img src="https://${Config.routes.client}/sprites/types/${type2}.png" alt="${type2}" height="14" width="32"></span> <span style="float: left ; min-height: 26px"><span class="col abilitycol">` + abilities + `</span><span class="col abilitycol"></span></span></li><li style="clear: both"></li></ul>`);
						} else {
							this.add(`raw|<ul class="utilichart"><li class="result"><span class="col pokemonnamecol" style="white-space: nowrap">` + species.name + `</span> <span class="col typecol"><img src="https://${Config.routes.client}/sprites/types/${type}.png" alt="${type}" height="14" width="32"></span> <span style="float: left ; min-height: 26px"><span class="col abilitycol">` + abilities + `</span><span class="col abilitycol"></span></span></li><li style="clear: both"></li></ul>`);
						}
						this.add(`raw|<ul class="utilichart"><li class="result"><span style="float: left ; min-height: 26px"><span class="col statcol"><em>HP</em><br>` + baseStats.hp + `</span> <span class="col statcol"><em>Atk</em><br>` + baseStats.atk + `</span> <span class="col statcol"><em>Def</em><br>` + baseStats.def + `</span> <span class="col statcol"><em>SpA</em><br>` + baseStats.spa + `</span> <span class="col statcol"><em>SpD</em><br>` + baseStats.spd + `</span> <span class="col statcol"><em>Spe</em><br>` + baseStats.spe + `</span> </span></li><li style="clear: both"></li></ul>`);
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
