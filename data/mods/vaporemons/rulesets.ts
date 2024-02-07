export const Rulesets: {[k: string]: ModdedFormatData} = {
	teampreview: {
		effectType: 'Rule',
		name: 'Team Preview',
		desc: "Allows each player to see the Pok&eacute;mon on their opponent's team before they choose their lead Pok&eacute;mon",
		onBegin() {
			if (this.ruleTable.has(`teratypepreview`)) {
				this.add('rule', 'Tera Type Preview: Tera Types are shown at Team Preview');
			}
		},
		onTeamPreview() {
			this.add('clearpoke');
			for (const pokemon of this.getAllPokemon()) {
				const details = pokemon.details.replace(', shiny', '')
					.replace(/(Greninja|Gourgeist|Pumpkaboo|Xerneas|Silvally|Urshifu|Dudunsparce|Revavroom)(-[a-zA-Z?-]+)?/g, '$1-*')
					.replace(/(Zacian|Zamazenta)(?!-Crowned)/g, '$1-*'); // Hacked-in Crowned formes will be revealed
				this.add('poke', pokemon.side.id, details, '');
			}
			this.makeRequest('teampreview');
			if (this.ruleTable.has(`teratypepreview`)) {
				for (const side of this.sides) {
					let buf = ``;
					for (const pokemon of side.pokemon) {
						buf += buf ? ` / ` : `raw|${side.name}'s Tera Types:<br />`;
						buf += `<psicon pokemon="${pokemon.species.id}" /><psicon type="${pokemon.teraType}" />`;
					}
					this.add(`${buf}`);
				}
			}
		},
	},
	vaporemonsmod: {
		effectType: 'Rule',
		name: 'VaporeMons Mod',
		desc: 'At the start of a battle, gives each player a link to the VaporeMons thread so they can use it to get information about new additions to the metagame.',
		onBegin() {
			this.add('-message', `Welcome to VaporeMons!`);
			this.add('-message', `This is a [Gen 9] OU-based format where a bunch of new moves, items, abilities, and non-stat adjustments to Pokemon were added to the game!`);
			this.add('-message', `You can find our thread and metagame resources here:`);
			this.add('-message', `https://www.smogon.com/forums/threads/vaporemons-slate-1-discussion-phase.3722917/`);
		},
	},
};
