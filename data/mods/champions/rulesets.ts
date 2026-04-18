export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	standardag: {
		inherit: true,
		ruleset: [
			'Obtainable', 'Team Preview', 'Cancel Mod', 'Endless Battle Clause',
			'Adjust Level = 50', 'Species Clause', 'Item Clause = 1', 'Min Team Size = 6',
		],
		onBegin() {
			this.reportPercentages = true;
		},
	},
	standard: {
		inherit: true,
		ruleset: [
			'Standard AG',
			'Sleep Moves Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Evasion Items Clause',
		],
	},
	standarddraft: {
		inherit: true,
		ruleset: [
			'Standard AG',
			'Nickname Clause', 'Sleep Clause Mod', 'OHKO Clause', 'Evasion Clause',
			'!Item Clause',
		],
		onBegin() {
			this.reportPercentages = true;
		},
		// timer: {starting: 60 * 60, grace: 0, addPerTurn: 10, maxPerTurn: 100, timeoutAutoChoose: true},
	},
	flatrules: {
		inherit: true,
		desc: "The in-game Flat Rules: Adjust Level 50, Species Clause, Item Clause = 1, -Mythical, -Restricted Legendary, Bring 6 Pick 3-6 depending on game type.",
		ruleset: ['Obtainable', 'Team Preview', 'Species Clause', 'Nickname Clause', 'Item Clause = 1', 'Adjust Level = 50', 'Picked Team Size = Auto', 'Min Team Size = 6', 'Cancel Mod'],
		banlist: ['Mythical', 'Restricted Legendary'],
		onBegin() {
			this.reportPercentages = true;
		},
	},
	teampreview: {
		inherit: true,
		onTeamPreview() {
			this.add('clearpoke');
			for (const pokemon of this.getAllPokemon()) {
				const details = pokemon.details.replace(/(Xerneas|Zacian|Zamazenta)(-[a-zA-Z?-]+)?/g, '$1-*');
				this.add('poke', pokemon.side.id, details, '');
			}
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
			this.makeRequest('teampreview');
		},
	},
};
