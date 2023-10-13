// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts
/*
If you want to add custom formats, create a file in this folder named: "custom-formats.ts"

Paste the following code into the file and add your desired formats and their sections between the brackets:
--------------------------------------------------------------------------------
// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts

export const Formats: FormatList = [
];
--------------------------------------------------------------------------------

If you specify a section that already exists, your format will be added to the bottom of that section.
New sections will be added to the bottom of the specified column.
The column value will be ignored for repeat sections.
*/

export const Formats: FormatList = [

	// S/V Singles
	///////////////////////////////////////////////////////////////////

	{
		section: "Elite Redux Singles",
	},
	// {
	// 	name: "[Gen 8] Elite Redux Random Battle WIP",
	// 	desc: `Randomized teams of Pok&eacute;mon with sets that are generated to be competitively viable.`,
	// 	mod: 'gen8eliteredux',
	// 	team: 'random',
	// 	ruleset: ['PotD', 'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod'],
	// 	//ER Scripts
	// 	onValidateSet(set) {
	// 		const species = this.dex.species.get(set.species);
	// 		const innateList = Object.keys(species.abilities)
	// 			.filter(key => key.includes('I'))
	// 			.map(key => species.abilities[key as 'I1' | 'I2' | 'I3'])
	// 		for (const innateName of innateList) {
	// 			//Checks if set ability is an innate, which is not allowed
	// 			if (set.ability == innateName){ 
	// 				return [`${set.name} already has ${innateName} as Innate. Please select from Abilities`];
	// 			} 

	// 			//Checks if innate is banned
	// 			const banReason = this.ruleTable.check('ability:' + this.toID(innateName));
	// 			if (banReason) {
	// 				return [`${set.name}'s ability ${innateName} is ${banReason}.`];
	// 			}
	// 		}
	// 	},
	// 	onBegin() {
	// 		for (const pokemon of this.getAllPokemon()) {
	// 			// if (pokemon.ability === this.toID(pokemon.species.abilities['S'])) {
	// 			// 	continue;  
	// 			// }
	// 			pokemon.m.innates = Object.keys(pokemon.species.abilities)
	// 				.filter(key => key.includes('I'))
	// 				.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
	// 				.filter(ability => ability !== pokemon.ability);
	// 		}
	// 	},
	// 	onBeforeSwitchIn(pokemon) {
	// 		// Abilities that must be applied before both sides trigger onSwitchIn to correctly
	// 		// handle switch-in ability-to-ability interactions, e.g. Intimidate counters
	// 		//TODO: Update needBeforeSwitchInIDs for new abilities
	// 		const neededBeforeSwitchInIDs = [
	// 			'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
	// 			'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
	// 		];
	// 		if (pokemon.m.innates) {
	// 			for (const innate of pokemon.m.innates) {
	// 				if (!neededBeforeSwitchInIDs.includes(innate)) continue;
	// 				if (pokemon.hasAbility(innate)) continue;
	// 				pokemon.addVolatile("ability:" + innate, pokemon);
	// 			}
	// 		}
	// 	},
	// 	onSwitchInPriority: 2,
	// 	onSwitchIn(pokemon) {
	// 		if (pokemon.m.innates) {
	// 			for (const innate of pokemon.m.innates) {
	// 				if (pokemon.hasAbility(innate)) continue;
	// 				pokemon.addVolatile("ability:" + innate, pokemon);
	// 			}
	// 		}
	// 	},
	// 	onSwitchOut(pokemon) {
	// 		for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
	// 			pokemon.removeVolatile(innate);
	// 		}
	// 	},
	// 	onFaint(pokemon) {
	// 		for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
	// 			const innateEffect = this.dex.conditions.get(innate) as Effect;
	// 			this.singleEvent('End', innateEffect, null, pokemon);
	// 		}
	// 	},
	// 	onAfterMega(pokemon) {
	// 		//clear original pokemon innates
	// 		for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
	// 			pokemon.removeVolatile(innate);
	// 		}
	// 		//initialize mega innates
	// 		pokemon.m.innates = Object.keys(pokemon.species.abilities)
	// 		.filter(key => key.includes('I'))
	// 		.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
	// 		.filter(ability => ability !== pokemon.ability);

	// 		//before switch in innate load
	// 		const neededBeforeSwitchInIDs = [
	// 			'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
	// 			'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
	// 		];
	// 		if (pokemon.m.innates) {
	// 			for (const innate of pokemon.m.innates) {
	// 				if (!neededBeforeSwitchInIDs.includes(innate)) continue;
	// 				if (pokemon.hasAbility(innate)) continue;
	// 				pokemon.addVolatile("ability:" + innate, pokemon);
	// 			}
	// 		}
	// 		//after switch in innate load
	// 		if (pokemon.m.innates) {
	// 			for (const innate of pokemon.m.innates) {
	// 				if (pokemon.hasAbility(innate)) continue;
	// 				pokemon.addVolatile("ability:" + innate, pokemon);
	// 			}
	// 		}

	// 	},
	// },
	{
		name: "[Gen 8] Elite Redux OU",
		desc: `Testing for ER Innates`,
		mod: 'gen8eliteredux',
		ruleset: ['Standard'],
		banlist: 
		['Uber', 'AG', 'King\'s Rock', 'Baton Pass', 'Shadow Tag', 'Arena Trap', 'Aeroblast', 'Alakazite', 'Blastoisinite', 'Moody', 'Power Construct'],



		//ER Scripts
		onValidateSet(set) {
			const species = this.dex.species.get(set.species);
			const innateList = Object.keys(species.abilities)
				.filter(key => key.includes('I'))
				.map(key => species.abilities[key as 'I1' | 'I2' | 'I3'])
			for (const innateName of innateList) {
				//Checks if set ability is an innate, which is not allowed
				if (set.ability == innateName){ 
					return [`${set.name} already has ${innateName} as Innate. Please select from Abilities`];
				} 

				//Checks if innate is banned
				const banReason = this.ruleTable.check('ability:' + this.toID(innateName));
				if (banReason) {
					return [`${set.name}'s ability ${innateName} is ${banReason}.`];
				}
			}
		},
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				// if (pokemon.ability === this.toID(pokemon.species.abilities['S'])) {
				// 	continue;  
				// }
				pokemon.m.innates = Object.keys(pokemon.species.abilities)
					.filter(key => key.includes('I'))
					.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
					.filter(ability => ability !== pokemon.ability);
			}
		},
		onBeforeSwitchIn(pokemon) {
			// Abilities that must be applied before both sides trigger onSwitchIn to correctly
			// handle switch-in ability-to-ability interactions, e.g. Intimidate counters
			//TODO: Update needBeforeSwitchInIDs for new abilities
			const neededBeforeSwitchInIDs = [
				'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
				'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
			];
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (!neededBeforeSwitchInIDs.includes(innate)) continue;
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}
		},
		onSwitchOut(pokemon) {
			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				pokemon.removeVolatile(innate);
			}
		},
		onFaint(pokemon) {
			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				const innateEffect = this.dex.conditions.get(innate) as Effect;
				this.singleEvent('End', innateEffect, null, pokemon);
			}
		},
		onAfterMega(pokemon) {
			//clear original pokemon innates
			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				pokemon.removeVolatile(innate);
			}
			//initialize mega innates
			pokemon.m.innates = Object.keys(pokemon.species.abilities)
			.filter(key => key.includes('I'))
			.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
			.filter(ability => ability !== pokemon.ability);

			//before switch in innate load
			const neededBeforeSwitchInIDs = [
				'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
				'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
			];
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (!neededBeforeSwitchInIDs.includes(innate)) continue;
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}
			//after switch in innate load
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}

		},
		
	},
	{
		name: "[Gen 8] Elite Redux UU",
		desc: `UU For Elite Redux`,
		mod: 'gen8eliteredux',
		ruleset: ['[Gen 8] Elite Redux OU'],
		banlist: 
		['OU', 'UUBL'],
		//ER Scripts
		onValidateSet(set) {
			const species = this.dex.species.get(set.species);
			const innateList = Object.keys(species.abilities)
				.filter(key => key.includes('I'))
				.map(key => species.abilities[key as 'I1' | 'I2' | 'I3'])
			for (const innateName of innateList) {
				//Checks if set ability is an innate, which is not allowed
				if (set.ability == innateName){ 
					return [`${set.name} already has ${innateName} as Innate. Please select from Abilities`];
				} 

				//Checks if innate is banned
				const banReason = this.ruleTable.check('ability:' + this.toID(innateName));
				if (banReason) {
					return [`${set.name}'s ability ${innateName} is ${banReason}.`];
				}
			}
		},
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				// if (pokemon.ability === this.toID(pokemon.species.abilities['S'])) {
				// 	continue;  
				// }
				pokemon.m.innates = Object.keys(pokemon.species.abilities)
					.filter(key => key.includes('I'))
					.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
					.filter(ability => ability !== pokemon.ability);
			}
		},
		onBeforeSwitchIn(pokemon) {
			// Abilities that must be applied before both sides trigger onSwitchIn to correctly
			// handle switch-in ability-to-ability interactions, e.g. Intimidate counters
			//TODO: Update needBeforeSwitchInIDs for new abilities
			const neededBeforeSwitchInIDs = [
				'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
				'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
			];
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (!neededBeforeSwitchInIDs.includes(innate)) continue;
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}
		},
		onSwitchOut(pokemon) {
			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				pokemon.removeVolatile(innate);
			}
		},
		onFaint(pokemon) {
			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				const innateEffect = this.dex.conditions.get(innate) as Effect;
				this.singleEvent('End', innateEffect, null, pokemon);
			}
		},
		onAfterMega(pokemon) {
			//clear original pokemon innates
			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				pokemon.removeVolatile(innate);
			}
			//initialize mega innates
			pokemon.m.innates = Object.keys(pokemon.species.abilities)
			.filter(key => key.includes('I'))
			.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
			.filter(ability => ability !== pokemon.ability);

			//before switch in innate load
			const neededBeforeSwitchInIDs = [
				'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
				'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
			];
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (!neededBeforeSwitchInIDs.includes(innate)) continue;
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}
			//after switch in innate load
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}

		},
		
	},

	{
		name: "[Gen 8] Elite Redux Ubers",
		desc: `Testing for ER Innates`,
		mod: 'gen8eliteredux',
		ruleset: ['Standard'],
		banlist: ['AG', 'King\'s Rock', 'Baton Pass'],



		//ER Scripts
		onValidateSet(set) {
			const species = this.dex.species.get(set.species);
			const innateList = Object.keys(species.abilities)
				.filter(key => key.includes('I'))
				.map(key => species.abilities[key as 'I1' | 'I2' | 'I3'])
			for (const innateName of innateList) {
				//Checks if set ability is an innate, which is not allowed
				if (set.ability == innateName){ 
					return [`${set.name} already has ${innateName} as Innate. Please select from Abilities`];
				} 

				//Checks if innate is banned
				const banReason = this.ruleTable.check('ability:' + this.toID(innateName));
				if (banReason) {
					return [`${set.name}'s ability ${innateName} is ${banReason}.`];
				}
			}
		},
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				// if (pokemon.ability === this.toID(pokemon.species.abilities['S'])) {
				// 	continue;  
				// }
				pokemon.m.innates = Object.keys(pokemon.species.abilities)
					.filter(key => key.includes('I'))
					.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
					.filter(ability => ability !== pokemon.ability);
			}
		},
		onBeforeSwitchIn(pokemon) {
			// Abilities that must be applied before both sides trigger onSwitchIn to correctly
			// handle switch-in ability-to-ability interactions, e.g. Intimidate counters
			//TODO: Update needBeforeSwitchInIDs for new abilities
			const neededBeforeSwitchInIDs = [
				'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
				'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
			];
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (!neededBeforeSwitchInIDs.includes(innate)) continue;
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}
		},
		onSwitchOut(pokemon) {
			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				pokemon.removeVolatile(innate);
			}
		},
		onFaint(pokemon) {
			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				const innateEffect = this.dex.conditions.get(innate) as Effect;
				this.singleEvent('End', innateEffect, null, pokemon);
			}
		},
		onAfterMega(pokemon) {
			//clear original pokemon innates
			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				pokemon.removeVolatile(innate);
			}
			//initialize mega innates
			pokemon.m.innates = Object.keys(pokemon.species.abilities)
			.filter(key => key.includes('I'))
			.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
			.filter(ability => ability !== pokemon.ability);

			//before switch in innate load
			const neededBeforeSwitchInIDs = [
				'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
				'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
			];
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (!neededBeforeSwitchInIDs.includes(innate)) continue;
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}
			//after switch in innate load
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}

		},
		
	},
	// {
	// 	name: "[Gen 9] Random Battle",
	// 	desc: `Randomized teams of Pok&eacute;mon with sets that are generated to be competitively viable.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3712619/">Random Battle Suggestions</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	team: 'random',
	// 	ruleset: ['PotD', 'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod'],
	// },
	// {
	// 	name: "[Gen 9] Unrated Random Battle",

	// 	mod: 'gen9',
	// 	team: 'random',
	// 	challengeShow: false,
	// 	rated: false,
	// 	ruleset: ['Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod'],
	// },
	// {
	// 	name: "[Gen 9] Free-For-All Random Battle",

	// 	mod: 'gen9',
	// 	team: 'random',
	// 	gameType: 'freeforall',
	// 	tournamentShow: false,
	// 	rated: false,
	// 	ruleset: ['Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod'],
	// },
	// {
	// 	name: "[Gen 9] Random Battle (Blitz)",

	// 	mod: 'gen9',
	// 	team: 'random',
	// 	ruleset: ['[Gen 9] Random Battle', 'Blitz'],
	// },
	// {
	// 	name: "[Gen 9] Multi Random Battle",

	// 	mod: 'gen9',
	// 	team: 'random',
	// 	gameType: 'multi',
	// 	searchShow: false,
	// 	tournamentShow: false,
	// 	rated: false,
	// 	ruleset: [
	// 		'Max Team Size = 3',
	// 		'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod',
	// 	],
	// },
	// {
	// 	name: "[Gen 9] OU",
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3710915/">SV OU Metagame Discussion</a>`,
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3712513/">SV OU Sample Teams</a>`,
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3712493/">SV OU Viability Rankings</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	ruleset: ['Standard'],
	// 	banlist: ['Uber', 'AG', 'Arena Trap', 'Moody', 'Sand Veil', 'Shadow Tag', 'Snow Cloak', 'King\'s Rock', 'Baton Pass', 'Last Respects', 'Shed Tail'],
	// },
	// {
	// 	name: "[Gen 8] Elite Redux LC",
	// 	desc: `Testing for ER Innates`,
	// 	mod: 'gen8eliteredux',
	// 	ruleset: ['Standard', 'Little Cup'],
	// 	banlist: ['Uber', 'AG', 'King\'s Rock', 'Baton Pass'],



	// 	//ER Scripts
	// 	onValidateSet(set) {
	// 		const species = this.dex.species.get(set.species);
	// 		const innateList = Object.keys(species.abilities)
	// 			.filter(key => key.includes('I'))
	// 			.map(key => species.abilities[key as 'I1' | 'I2' | 'I3'])
	// 		for (const innateName of innateList) {
	// 			//Checks if set ability is an innate, which is not allowed
	// 			if (set.ability == innateName){ 
	// 				return [`${set.name} already has ${innateName} as Innate. Please select from Abilities`];
	// 			} 

	// 			//Checks if innate is banned
	// 			const banReason = this.ruleTable.check('ability:' + this.toID(innateName));
	// 			if (banReason) {
	// 				return [`${set.name}'s ability ${innateName} is ${banReason}.`];
	// 			}
	// 		}
	// 	},
	// 	onBegin() {
	// 		for (const pokemon of this.getAllPokemon()) {
	// 			// if (pokemon.ability === this.toID(pokemon.species.abilities['S'])) {
	// 			// 	continue;  
	// 			// }
	// 			pokemon.m.innates = Object.keys(pokemon.species.abilities)
	// 				.filter(key => key.includes('I'))
	// 				.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
	// 				.filter(ability => ability !== pokemon.ability);
	// 		}
	// 	},
	// 	onBeforeSwitchIn(pokemon) {
	// 		// Abilities that must be applied before both sides trigger onSwitchIn to correctly
	// 		// handle switch-in ability-to-ability interactions, e.g. Intimidate counters
	// 		//TODO: Update needBeforeSwitchInIDs for new abilities
	// 		const neededBeforeSwitchInIDs = [
	// 			'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
	// 			'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
	// 		];
	// 		if (pokemon.m.innates) {
	// 			for (const innate of pokemon.m.innates) {
	// 				if (!neededBeforeSwitchInIDs.includes(innate)) continue;
	// 				if (pokemon.hasAbility(innate)) continue;
	// 				pokemon.addVolatile("ability:" + innate, pokemon);
	// 			}
	// 		}
	// 	},
	// 	onSwitchInPriority: 2,
	// 	onSwitchIn(pokemon) {
	// 		if (pokemon.m.innates) {
	// 			for (const innate of pokemon.m.innates) {
	// 				if (pokemon.hasAbility(innate)) continue;
	// 				pokemon.addVolatile("ability:" + innate, pokemon);
	// 			}
	// 		}
	// 	},
	// 	onSwitchOut(pokemon) {
	// 		for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
	// 			pokemon.removeVolatile(innate);
	// 		}
	// 	},
	// 	onFaint(pokemon) {
	// 		for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
	// 			const innateEffect = this.dex.conditions.get(innate) as Effect;
	// 			this.singleEvent('End', innateEffect, null, pokemon);
	// 		}
	// 	},
	// 	onAfterMega(pokemon) {
	// 		//clear original pokemon innates
	// 		for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
	// 			pokemon.removeVolatile(innate);
	// 		}
	// 		//initialize mega innates
	// 		pokemon.m.innates = Object.keys(pokemon.species.abilities)
	// 		.filter(key => key.includes('I'))
	// 		.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
	// 		.filter(ability => ability !== pokemon.ability);

	// 		//before switch in innate load
	// 		const neededBeforeSwitchInIDs = [
	// 			'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
	// 			'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
	// 		];
	// 		if (pokemon.m.innates) {
	// 			for (const innate of pokemon.m.innates) {
	// 				if (!neededBeforeSwitchInIDs.includes(innate)) continue;
	// 				if (pokemon.hasAbility(innate)) continue;
	// 				pokemon.addVolatile("ability:" + innate, pokemon);
	// 			}
	// 		}
	// 		//after switch in innate load
	// 		if (pokemon.m.innates) {
	// 			for (const innate of pokemon.m.innates) {
	// 				if (pokemon.hasAbility(innate)) continue;
	// 				pokemon.addVolatile("ability:" + innate, pokemon);
	// 			}
	// 		}

	// 	},
		
	// },
	{
		name: "[Gen 8] Elite Redux Monotype",
		desc: `Testing for ER Innates`,
		mod: 'gen8eliteredux',
		rated: false, 
		ruleset: ['Standard', 'Same Type Clause'],
		banlist: ['Uber', 'AG', 'King\'s Rock', 'Baton Pass', 'Moody'],



		//ER Scripts
		onValidateSet(set) {
			const species = this.dex.species.get(set.species);
			const innateList = Object.keys(species.abilities)
				.filter(key => key.includes('I'))
				.map(key => species.abilities[key as 'I1' | 'I2' | 'I3'])
			for (const innateName of innateList) {
				//Checks if set ability is an innate, which is not allowed
				if (set.ability == innateName){ 
					return [`${set.name} already has ${innateName} as Innate. Please select from Abilities`];
				} 

				//Checks if innate is banned
				const banReason = this.ruleTable.check('ability:' + this.toID(innateName));
				if (banReason) {
					return [`${set.name}'s ability ${innateName} is ${banReason}.`];
				}
			}
		},
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				// if (pokemon.ability === this.toID(pokemon.species.abilities['S'])) {
				// 	continue;  
				// }
				pokemon.m.innates = Object.keys(pokemon.species.abilities)
					.filter(key => key.includes('I'))
					.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
					.filter(ability => ability !== pokemon.ability);
			}
		},
		onBeforeSwitchIn(pokemon) {
			// Abilities that must be applied before both sides trigger onSwitchIn to correctly
			// handle switch-in ability-to-ability interactions, e.g. Intimidate counters
			//TODO: Update needBeforeSwitchInIDs for new abilities
			const neededBeforeSwitchInIDs = [
				'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
				'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
			];
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (!neededBeforeSwitchInIDs.includes(innate)) continue;
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}
		},
		onSwitchOut(pokemon) {
			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				pokemon.removeVolatile(innate);
			}
		},
		onFaint(pokemon) {
			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				const innateEffect = this.dex.conditions.get(innate) as Effect;
				this.singleEvent('End', innateEffect, null, pokemon);
			}
		},
		onAfterMega(pokemon) {
			//clear original pokemon innates
			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				pokemon.removeVolatile(innate);
			}
			//initialize mega innates
			pokemon.m.innates = Object.keys(pokemon.species.abilities)
			.filter(key => key.includes('I'))
			.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
			.filter(ability => ability !== pokemon.ability);

			//before switch in innate load
			const neededBeforeSwitchInIDs = [
				'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
				'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
			];
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (!neededBeforeSwitchInIDs.includes(innate)) continue;
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}
			//after switch in innate load
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}

		},
		
	},
	// {
	// 	name: "[Gen 9] UU",
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3713709/">UU Metagame Discussion</a>`,
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3716435/">UU Viability Rankings</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	ruleset: ['[Gen 9] OU'],
	// 	banlist: ['OU', 'UUBL'],
	// },
	// {
	// 	name: "[Gen 9] RU",
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3713711/">RU Metagame Discussion</a>`,
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3717138/">RU Viability Rankings</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	ruleset: ['[Gen 9] UU'],
	// 	banlist: ['UU', 'RUBL', 'Light Clay'],
	// },
	// {
	// 	name: "[Gen 9] NU",
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3715408/">NU Metagame Discussion</a>`,
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3715712/">NU Viability Rankings</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	ruleset: ['[Gen 9] RU'],
	// 	banlist: ['RU', 'NUBL'],
	// },
	// {
	// 	name: "[Gen 9] PU",

	// 	mod: 'gen9',
	// 	ruleset: ['[Gen 9] NU'],
	// 	banlist: ['NU', 'PUBL'],
	// },
	// {
	// 	name: "[Gen 9] LC",
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3710868/">Little Cup Metagame Discussion</a>`,
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3712989/">Little Cup Sample Teams</a>`,
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3712664/">Little Cup Viability Rankings</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	ruleset: ['Little Cup', 'Standard'],
	// 	banlist: [
	// 		'Basculin-White-Striped', 'Diglett-Base', 'Dunsparce', 'Flittle', 'Gastly', 'Girafarig', 'Growlithe-Hisui', 'Meditite', 'Misdreavus',
	// 		'Murkrow', 'Qwilfish-Hisui', 'Rufflet', 'Scyther', 'Sneasel', 'Sneasel-Hisui', 'Stantler', 'Moody', 'Baton Pass', 'Sticky Web',
	// 		'Tinkatink + Knock Off',
	// 	],
	// },
	// {
	// 	name: "[Gen 9] Monotype",
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3710724/">Monotype Metagame Discussion</a>`,
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3715794/">Monotype Sample Teams</a>`,
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3714063/">Monotype Viability Rankings</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	ruleset: ['Standard', 'Evasion Abilities Clause', 'Same Type Clause', 'Terastal Clause'],
	// 	banlist: [
	// 		'Annihilape', 'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Dialga', 'Dialga-Origin', 'Eternatus',
	// 		'Giratina', 'Giratina-Origin', 'Groudon', 'Iron Bundle', 'Koraidon', 'Kyogre', 'Magearna', 'Mewtwo', 'Miraidon',
	// 		'Palafin', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Urshifu-Base', 'Zacian', 'Zacian-Crowned', 'Zamazenta-Crowned',
	// 		'Moody', 'Shadow Tag', 'Booster Energy', 'Damp Rock', 'Focus Band', 'King\'s Rock', 'Quick Claw', 'Acupressure',
	// 		'Baton Pass', 'Last Respects',
	// 	],
	// },
	// {
	// 	name: "[Gen 9] 1v1",
	// 	desc: `Bring three Pok&eacute;mon to Team Preview and choose one to battle.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3710864/">1v1 Metagame Discussion</a>`,
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3712375/">1v1 Viability Rankings</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	ruleset: [
	// 		'Picked Team Size = 1', 'Max Team Size = 3',
	// 		'Standard', 'Terastal Clause', 'Sleep Moves Clause', 'Accuracy Moves Clause', '!Sleep Clause Mod',
	// 	],
	// 	banlist: [
	// 		'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Cinderace', 'Dialga', 'Dialga-Origin', 'Dragonite', 'Eternatus', 'Flutter Mane',
	// 		'Gholdengo', 'Giratina', 'Giratina-Origin', 'Groudon', 'Hoopa-Unbound', 'Koraidon', 'Kyogre', 'Magearna', 'Meloetta', 'Mew', 'Mewtwo',
	// 		'Mimikyu', 'Miraidon', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Scream Tail', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned',
	// 		'Moody', 'Focus Band', 'Focus Sash', 'King\'s Rock', 'Quick Claw', 'Acupressure', 'Perish Song',
	// 	],
	// },
	// {
	// 	name: "[Gen 9] Anything Goes",
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3710911/">AG Metagame Discussion</a>`,
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3714177/">AG Viability Rankings</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	ruleset: ['Min Source Gen = 9', 'Obtainable', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Endless Battle Clause'],
	// },
	// {
	// 	name: "[Gen 9] ZU",
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3719022/">ZU Metagame Discussion</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	ruleset: ['[Gen 9] PU'],
	// 	banlist: ['PU', 'Basculin-White-Striped', 'Beartic', 'Electrode', 'Fraxure', 'Frogadier', 'Girafarig', 'Grumpig', 'Leafeon', 'Qwilfish-Hisui', 'Sneasel-Hisui', 'Vigoroth'],
	// },
	// {
	// 	name: "[Gen 9] LC UU",
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3711750/">LC UU Metagame Discussion</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	searchShow: false,
	// 	ruleset: ['[Gen 9] LC'],
	// 	banlist: [
	// 		'Bramblin', 'Crabrawler', 'Diglett-Alola', 'Drifloon', 'Foongus', 'Glimmet', 'Gothita', 'Grimer-Alola', 'Grookey', 'Larvesta',
	// 		'Magnemite', 'Mareanie', 'Mudbray', 'Nymble', 'Pawniard', 'Quaxly', 'Shellder', 'Shroodle', 'Slowpoke-Base', 'Stunky', 'Surskit',
	// 		'Tinkatink', 'Toedscool', 'Voltorb', 'Voltorb-Hisui', 'Wattrel', 'Wingull', 'Zorua-Hisui',
	// 	],
	// },
	// {
	// 	name: "[Gen 9] CAP",

	// 	mod: 'gen9',
	// 	ruleset: ['[Gen 9] OU', '+CAP'],
	// 	banlist: ['Crucibellite'],
	// },
	// {
	// 	name: "[Gen 9] Free-For-All",
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3711724/">Free-For-All</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	gameType: 'freeforall',
	// 	rated: false,
	// 	tournamentShow: false,
	// 	ruleset: ['Standard', '!Evasion Items Clause'],
	// 	banlist: [
	// 		'Annihilape', 'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Dialga', 'Dialga-Origin', 'Eternatus', 'Flutter Mane', 'Giratina', 'Giratina-Origin',
	// 		'Groudon', 'Hoopa-Unbound', 'Iron Bundle', 'Koraidon', 'Kyogre', 'Landorus-Base', 'Magearna', 'Mewtwo', 'Miraidon', 'Palafin', 'Palkia', 'Palkia-Origin',
	// 		'Rayquaza', 'Spectrier', 'Ursaluna', 'Urshifu-Base', 'Zacian', 'Zacian-Crowned', 'Moody', 'Shadow Tag', 'Toxic Debris', 'Acupressure', 'Aromatic Mist',
	// 		'Baton Pass', 'Court Change', 'Final Gambit', 'Flatter', 'Follow Me', 'Heal Pulse', 'Last Respects', 'Poison Fang', 'Rage Powder', 'Spicy Extract', 'Swagger',
	// 		'Toxic', 'Toxic Spikes',
	// 	],
	// },
	// {
	// 	name: "[Gen 9] Battle Stadium Singles Regulation C",

	// 	mod: 'gen9',
	// 	searchShow: false,
	// 	ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Paldea Pokedex', 'Min Source Gen = 9', 'VGC Timer'],
	// },
	// {
	// 	name: "[Gen 9] Battle Stadium Singles Regulation D",

	// 	mod: 'gen9',
	// 	ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer'],
	// 	banlist: ['Walking Wake', 'Iron Leaves'],
	// },
	// {
	// 	name: "[Gen 9] Freedom Cup",
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3722982/">Freedom Cup Tournament Thread</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	ruleset: ['Flat Rules', '!Picked Team Size', '!! Adjust Level = 50', 'Min Source Gen = 9'],
	// 	banlist: ['Walking Wake', 'Iron Leaves'],
	// },
	// {
	// 	name: "[Gen 9] Custom Game",

	// 	mod: 'gen9',
	// 	searchShow: false,
	// 	debug: true,
	// 	battle: {trunc: Math.trunc},
	// 	// no restrictions, for serious (other than team preview)
	// 	ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	// },

	// S/V Doubles
	///////////////////////////////////////////////////////////////////

	{
		section: "Elite Redux Doubles",
	},
	{
		name: "[Gen 8] Elite Redux Doubles OU",

		mod: 'gen8eliteredux',
		gameType: 'doubles',
		ruleset: ['Standard Doubles'],
		banlist: ['DUber', 'Shadow Tag', 'Arena Trap'],

			//ER Scripts
			onValidateSet(set) {
				const species = this.dex.species.get(set.species);
				const innateList = Object.keys(species.abilities)
					.filter(key => key.includes('I'))
					.map(key => species.abilities[key as 'I1' | 'I2' | 'I3'])
				for (const innateName of innateList) {
					//Checks if set ability is an innate, which is not allowed
					if (set.ability == innateName){ 
						return [`${set.name} already has ${innateName} as Innate. Please select from Abilities`];
					} 
	
					//Checks if innate is banned
					const banReason = this.ruleTable.check('ability:' + this.toID(innateName));
					if (banReason) {
						return [`${set.name}'s ability ${innateName} is ${banReason}.`];
					}
				}
			},
			onBegin() {
				for (const pokemon of this.getAllPokemon()) {
					// if (pokemon.ability === this.toID(pokemon.species.abilities['S'])) {
					// 	continue;  
					// }
					pokemon.m.innates = Object.keys(pokemon.species.abilities)
						.filter(key => key.includes('I'))
						.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
						.filter(ability => ability !== pokemon.ability);
				}
			},
			onBeforeSwitchIn(pokemon) {
				// Abilities that must be applied before both sides trigger onSwitchIn to correctly
				// handle switch-in ability-to-ability interactions, e.g. Intimidate counters
				//TODO: Update needBeforeSwitchInIDs for new abilities
				const neededBeforeSwitchInIDs = [
					'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
					'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
				];
				if (pokemon.m.innates) {
					for (const innate of pokemon.m.innates) {
						if (!neededBeforeSwitchInIDs.includes(innate)) continue;
						if (pokemon.hasAbility(innate)) continue;
						pokemon.addVolatile("ability:" + innate, pokemon);
					}
				}
			},
			onSwitchInPriority: 2,
			onSwitchIn(pokemon) {
				if (pokemon.m.innates) {
					for (const innate of pokemon.m.innates) {
						if (pokemon.hasAbility(innate)) continue;
						pokemon.addVolatile("ability:" + innate, pokemon);
					}
				}
			},
			onSwitchOut(pokemon) {
				for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
					pokemon.removeVolatile(innate);
				}
			},
			onFaint(pokemon) {
				for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
					const innateEffect = this.dex.conditions.get(innate) as Effect;
					this.singleEvent('End', innateEffect, null, pokemon);
				}
			},
			onAfterMega(pokemon) {
				//clear original pokemon innates
				for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
					pokemon.removeVolatile(innate);
				}
				//initialize mega innates
				pokemon.m.innates = Object.keys(pokemon.species.abilities)
				.filter(key => key.includes('I'))
				.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
				.filter(ability => ability !== pokemon.ability);
	
				//before switch in innate load
				const neededBeforeSwitchInIDs = [
					'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
					'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
				];
				if (pokemon.m.innates) {
					for (const innate of pokemon.m.innates) {
						if (!neededBeforeSwitchInIDs.includes(innate)) continue;
						if (pokemon.hasAbility(innate)) continue;
						pokemon.addVolatile("ability:" + innate, pokemon);
					}
				}
				//after switch in innate load
				if (pokemon.m.innates) {
					for (const innate of pokemon.m.innates) {
						if (pokemon.hasAbility(innate)) continue;
						pokemon.addVolatile("ability:" + innate, pokemon);
					}
				}
	
			},
	},
	{
		name: "[Gen 8] Elite Redux Doubles Ubers",

		mod: 'gen8eliteredux',
		gameType: 'doubles',
		ruleset: ['Standard Doubles', '!Gravity Sleep Clause'],

		//ER Scripts
		onValidateSet(set) {
			const species = this.dex.species.get(set.species);
			const innateList = Object.keys(species.abilities)
				.filter(key => key.includes('I'))
				.map(key => species.abilities[key as 'I1' | 'I2' | 'I3'])
			for (const innateName of innateList) {
				//Checks if set ability is an innate, which is not allowed
				if (set.ability == innateName){ 
					return [`${set.name} already has ${innateName} as Innate. Please select from Abilities`];
				} 

				//Checks if innate is banned
				const banReason = this.ruleTable.check('ability:' + this.toID(innateName));
				if (banReason) {
					return [`${set.name}'s ability ${innateName} is ${banReason}.`];
				}
			}
		},
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				// if (pokemon.ability === this.toID(pokemon.species.abilities['S'])) {
				// 	continue;  
				// }
				pokemon.m.innates = Object.keys(pokemon.species.abilities)
					.filter(key => key.includes('I'))
					.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
					.filter(ability => ability !== pokemon.ability);
			}
		},
		onBeforeSwitchIn(pokemon) {
			// Abilities that must be applied before both sides trigger onSwitchIn to correctly
			// handle switch-in ability-to-ability interactions, e.g. Intimidate counters
			//TODO: Update needBeforeSwitchInIDs for new abilities
			const neededBeforeSwitchInIDs = [
				'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
				'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
			];
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (!neededBeforeSwitchInIDs.includes(innate)) continue;
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}
		},
		onSwitchOut(pokemon) {
			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				pokemon.removeVolatile(innate);
			}
		},
		onFaint(pokemon) {
			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				const innateEffect = this.dex.conditions.get(innate) as Effect;
				this.singleEvent('End', innateEffect, null, pokemon);
			}
		},
		onAfterMega(pokemon) {
			//clear original pokemon innates
			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				pokemon.removeVolatile(innate);
			}
			//initialize mega innates
			pokemon.m.innates = Object.keys(pokemon.species.abilities)
			.filter(key => key.includes('I'))
			.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
			.filter(ability => ability !== pokemon.ability);

			//before switch in innate load
			const neededBeforeSwitchInIDs = [
				'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
				'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
			];
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (!neededBeforeSwitchInIDs.includes(innate)) continue;
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}
			//after switch in innate load
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (pokemon.hasAbility(innate)) continue;
					pokemon.addVolatile("ability:" + innate, pokemon);
				}
			}

		},
	},
	// {
	// 	name: "[Gen 8] Elite Redux Doubles LC",

	// 	mod: 'gen8eliteredux',
	// 	gameType: 'doubles',
	// 	ruleset: ['Standard Doubles', 'Little Cup', 'Sleep Clause Mod'],
	// 	// banlist: ['Dunsparce', 'Murkrow', 'Qwilfish-Hisui', 'Scyther', 'Sneasel', 'Sneasel-Hisui'],

	// 		//ER Scripts
	// 		onValidateSet(set) {
	// 			const species = this.dex.species.get(set.species);
	// 			const innateList = Object.keys(species.abilities)
	// 				.filter(key => key.includes('I'))
	// 				.map(key => species.abilities[key as 'I1' | 'I2' | 'I3'])
	// 			for (const innateName of innateList) {
	// 				//Checks if set ability is an innate, which is not allowed
	// 				if (set.ability == innateName){ 
	// 					return [`${set.name} already has ${innateName} as Innate. Please select from Abilities`];
	// 				} 
	
	// 				//Checks if innate is banned
	// 				const banReason = this.ruleTable.check('ability:' + this.toID(innateName));
	// 				if (banReason) {
	// 					return [`${set.name}'s ability ${innateName} is ${banReason}.`];
	// 				}
	// 			}
	// 		},
	// 		onBegin() {
	// 			for (const pokemon of this.getAllPokemon()) {
	// 				// if (pokemon.ability === this.toID(pokemon.species.abilities['S'])) {
	// 				// 	continue;  
	// 				// }
	// 				pokemon.m.innates = Object.keys(pokemon.species.abilities)
	// 					.filter(key => key.includes('I'))
	// 					.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
	// 					.filter(ability => ability !== pokemon.ability);
	// 			}
	// 		},
	// 		onBeforeSwitchIn(pokemon) {
	// 			// Abilities that must be applied before both sides trigger onSwitchIn to correctly
	// 			// handle switch-in ability-to-ability interactions, e.g. Intimidate counters
	// 			//TODO: Update needBeforeSwitchInIDs for new abilities
	// 			const neededBeforeSwitchInIDs = [
	// 				'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
	// 				'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
	// 			];
	// 			if (pokemon.m.innates) {
	// 				for (const innate of pokemon.m.innates) {
	// 					if (!neededBeforeSwitchInIDs.includes(innate)) continue;
	// 					if (pokemon.hasAbility(innate)) continue;
	// 					pokemon.addVolatile("ability:" + innate, pokemon);
	// 				}
	// 			}
	// 		},
	// 		onSwitchInPriority: 2,
	// 		onSwitchIn(pokemon) {
	// 			if (pokemon.m.innates) {
	// 				for (const innate of pokemon.m.innates) {
	// 					if (pokemon.hasAbility(innate)) continue;
	// 					pokemon.addVolatile("ability:" + innate, pokemon);
	// 				}
	// 			}
	// 		},
	// 		onSwitchOut(pokemon) {
	// 			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
	// 				pokemon.removeVolatile(innate);
	// 			}
	// 		},
	// 		onFaint(pokemon) {
	// 			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
	// 				const innateEffect = this.dex.conditions.get(innate) as Effect;
	// 				this.singleEvent('End', innateEffect, null, pokemon);
	// 			}
	// 		},
	// 		onAfterMega(pokemon) {
	// 			//clear original pokemon innates
	// 			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
	// 				pokemon.removeVolatile(innate);
	// 			}
	// 			//initialize mega innates
	// 			pokemon.m.innates = Object.keys(pokemon.species.abilities)
	// 			.filter(key => key.includes('I'))
	// 			.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
	// 			.filter(ability => ability !== pokemon.ability);
	
	// 			//before switch in innate load
	// 			const neededBeforeSwitchInIDs = [
	// 				'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
	// 				'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
	// 			];
	// 			if (pokemon.m.innates) {
	// 				for (const innate of pokemon.m.innates) {
	// 					if (!neededBeforeSwitchInIDs.includes(innate)) continue;
	// 					if (pokemon.hasAbility(innate)) continue;
	// 					pokemon.addVolatile("ability:" + innate, pokemon);
	// 				}
	// 			}
	// 			//after switch in innate load
	// 			if (pokemon.m.innates) {
	// 				for (const innate of pokemon.m.innates) {
	// 					if (pokemon.hasAbility(innate)) continue;
	// 					pokemon.addVolatile("ability:" + innate, pokemon);
	// 				}
	// 			}
	
	// 		},
	// },
	{
		name: "[Gen 8] Elite Redux 2v2 Doubles",
		desc: `Double battle where you bring four Pok&eacute;mon to Team Preview and choose only two.`,
		mod: 'gen8eliteredux',
		gameType: 'doubles',
		ruleset: [
			'Picked Team Size = 2', 'Max Team Size = 4',
			'Standard Doubles', 'Accuracy Moves Clause', 'Sleep Clause Mod', 'Evasion Items Clause',
		],

			//ER Scripts
			onValidateSet(set) {
				const species = this.dex.species.get(set.species);
				const innateList = Object.keys(species.abilities)
					.filter(key => key.includes('I'))
					.map(key => species.abilities[key as 'I1' | 'I2' | 'I3'])
				for (const innateName of innateList) {
					//Checks if set ability is an innate, which is not allowed
					if (set.ability == innateName){ 
						return [`${set.name} already has ${innateName} as Innate. Please select from Abilities`];
					} 
	
					//Checks if innate is banned
					const banReason = this.ruleTable.check('ability:' + this.toID(innateName));
					if (banReason) {
						return [`${set.name}'s ability ${innateName} is ${banReason}.`];
					}
				}
			},
			onBegin() {
				for (const pokemon of this.getAllPokemon()) {
					// if (pokemon.ability === this.toID(pokemon.species.abilities['S'])) {
					// 	continue;  
					// }
					pokemon.m.innates = Object.keys(pokemon.species.abilities)
						.filter(key => key.includes('I'))
						.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
						.filter(ability => ability !== pokemon.ability);
				}
			},
			onBeforeSwitchIn(pokemon) {
				// Abilities that must be applied before both sides trigger onSwitchIn to correctly
				// handle switch-in ability-to-ability interactions, e.g. Intimidate counters
				//TODO: Update needBeforeSwitchInIDs for new abilities
				const neededBeforeSwitchInIDs = [
					'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
					'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
				];
				if (pokemon.m.innates) {
					for (const innate of pokemon.m.innates) {
						if (!neededBeforeSwitchInIDs.includes(innate)) continue;
						if (pokemon.hasAbility(innate)) continue;
						pokemon.addVolatile("ability:" + innate, pokemon);
					}
				}
			},
			onSwitchInPriority: 2,
			onSwitchIn(pokemon) {
				if (pokemon.m.innates) {
					for (const innate of pokemon.m.innates) {
						if (pokemon.hasAbility(innate)) continue;
						pokemon.addVolatile("ability:" + innate, pokemon);
					}
				}
			},
			onSwitchOut(pokemon) {
				for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
					pokemon.removeVolatile(innate);
				}
			},
			onFaint(pokemon) {
				for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
					const innateEffect = this.dex.conditions.get(innate) as Effect;
					this.singleEvent('End', innateEffect, null, pokemon);
				}
			},
			onAfterMega(pokemon) {
				//clear original pokemon innates
				for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
					pokemon.removeVolatile(innate);
				}
				//initialize mega innates
				pokemon.m.innates = Object.keys(pokemon.species.abilities)
				.filter(key => key.includes('I'))
				.map(key => this.toID(pokemon.species.abilities[key as "I1" | "I2" | "I3"]))
				.filter(ability => ability !== pokemon.ability);
	
				//before switch in innate load
				const neededBeforeSwitchInIDs = [
					'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
					'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
				];
				if (pokemon.m.innates) {
					for (const innate of pokemon.m.innates) {
						if (!neededBeforeSwitchInIDs.includes(innate)) continue;
						if (pokemon.hasAbility(innate)) continue;
						pokemon.addVolatile("ability:" + innate, pokemon);
					}
				}
				//after switch in innate load
				if (pokemon.m.innates) {
					for (const innate of pokemon.m.innates) {
						if (pokemon.hasAbility(innate)) continue;
						pokemon.addVolatile("ability:" + innate, pokemon);
					}
				}
	
			},
		// banlist: [
		// 	'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Dialga', 'Dialga-Origin', 'Eternatus', 'Giratina', 'Giratina-Origin', 'Groudon', 'Iron Hands',
		// 	'Koraidon', 'Kyogre', 'Magearna', 'Mewtwo', 'Miraidon', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Tornadus', 'Urshifu', 'Urshifu-Rapid-Strike',
		// 	'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Commander', 'Moody', 'Focus Sash', 'King\'s Rock', 'Ally Switch', 'Final Gambit',
		// 	'Perish Song', 'Swagger',
		// ],
	},
	// Draft League
	///////////////////////////////////////////////////////////////////

	// {
	// 	section: "Draft",
	// 	column: 1,
	// },
	// {
	// 	name: "[Gen 9] Paldea Dex Draft",

	// 	mod: 'gen9',
	// 	searchShow: false,
	// 	ruleset: ['Draft', 'Min Source Gen = 9'],
	// },
	// {
	// 	name: "[Gen 9] Tera Preview Paldea Dex Draft",

	// 	mod: 'gen9',
	// 	searchShow: false,
	// 	ruleset: ['[Gen 9] Paldea Dex Draft', 'Tera Type Preview'],
	// },
	// {
	// 	name: "[Gen 9] 6v6 Doubles Draft",

	// 	mod: 'gen9',
	// 	gameType: 'doubles',
	// 	searchShow: false,
	// 	ruleset: ['Draft', '!Sleep Clause Mod', '!Evasion Clause', 'Min Source Gen = 9'],
	// },
	// {
	// 	name: "[Gen 9] 4v4 Doubles Draft",

	// 	mod: 'gen9',
	// 	gameType: 'doubles',
	// 	searchShow: false,
	// 	ruleset: ['Draft', 'Item Clause', '!Sleep Clause Mod', '!OHKO Clause', '!Evasion Clause', 'Adjust Level = 50', 'Picked Team Size = 4', 'Min Source Gen = 9'],
	// },
	// {
	// 	name: "[Gen 9] NatDex Draft",

	// 	mod: 'gen9',
	// 	searchShow: false,
	// 	ruleset: ['Draft', '+Unobtainable', '+Past'],
	// },
	// {
	// 	name: "[Gen 9] Tera Preview NatDex Draft",

	// 	mod: 'gen9',
	// 	searchShow: false,
	// 	ruleset: ['[Gen 9] NatDex Draft', 'Tera Type Preview'],
	// },
	// {
	// 	name: "[Gen 9] NatDex 6v6 Doubles Draft",

	// 	mod: 'gen9',
	// 	gameType: 'doubles',
	// 	searchShow: false,
	// 	ruleset: ['[Gen 9] 6v6 Doubles Draft', '+Unobtainable', '+Past', '!! Min Source Gen = 3'],
	// },
	// {
	// 	name: "[Gen 9] NatDex 4v4 Doubles Draft",

	// 	mod: 'gen9',
	// 	gameType: 'doubles',
	// 	searchShow: false,
	// 	ruleset: ['[Gen 9] 4v4 Doubles Draft', '+Unobtainable', '+Past', '!! Min Source Gen = 3'],
	// },
	// {
	// 	name: "[Gen 9] NatDex LC Draft",

	// 	mod: 'gen9',
	// 	searchShow: false,
	// 	ruleset: ['[Gen 9] NatDex Draft', 'Double Item Clause', 'Little Cup'],
	// 	banlist: ['Dragon Rage', 'Sonic Boom'],
	// },
	// {
	// 	name: "[Gen 8] Galar Dex Draft",

	// 	mod: 'gen8',
	// 	searchShow: false,
	// 	ruleset: ['Draft', 'Dynamax Clause'],
	// },
	// {
	// 	name: "[Gen 8] NatDex Draft",

	// 	mod: 'gen8',
	// 	searchShow: false,
	// 	ruleset: ['Draft', 'Dynamax Clause', '+Past'],
	// },
	// {
	// 	name: "[Gen 8] NatDex 4v4 Doubles Draft",

	// 	mod: 'gen8',
	// 	gameType: 'doubles',
	// 	searchShow: false,
	// 	ruleset: ['Draft', 'Item Clause', '!Sleep Clause Mod', '!OHKO Clause', '!Evasion Moves Clause', 'Adjust Level = 50', 'Picked Team Size = 4', '+Past'],
	// },
	// {
	// 	name: "[Gen 7] Draft",

	// 	mod: 'gen7',
	// 	searchShow: false,
	// 	ruleset: ['Draft', '+LGPE'],
	// },
	// {
	// 	name: "[Gen 6] Draft",

	// 	mod: 'gen6',
	// 	searchShow: false,
	// 	ruleset: ['Draft', 'Moody Clause', 'Swagger Clause'],
	// 	banlist: ['Soul Dew'],
	// },

	// OM of the Month
	///////////////////////////////////////////////////////////////////

	// {
	// 	section: "OM of the Month",
	// 	column: 2,
	// },
	// {
	// 	name: "[Gen 9] Force of the Fallen",
	// 	desc: `Pok&eacute;mon pass the move in their last moveslot to their allies when they are KOed.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3722355/">Force of the Fallen</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	ruleset: ['Standard OMs', 'Sleep Moves Clause', 'Terastal Clause', 'Min Source Gen = 9'],
	// 	banlist: [
	// 		'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Dialga', 'Dialga-Origin', 'Enamorus-Base', 'Espathra', 'Eternatus', 'Falinks',
	// 		'Flutter Mane', 'Giratina', 'Giratina-Origin', 'Groudon', 'Iron Bundle', 'Komala', 'Koraidon', 'Kyogre', 'Landorus-Base', 'Lilligant-Hisui',
	// 		'Magearna', 'Mewtwo', 'Miraidon', 'Palafin', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Regieleki', 'Spectrier', 'Sneasler', 'Zacian',
	// 		'Zacian-Crowned', 'Zamazenta-Crowned', 'Arena Trap', 'Moody', 'Shadow Tag', 'Booster Energy', 'King\'s Rock', 'Baton Pass',
	// 		'Last Respects', 'Rage Fist', 'Shed Tail',
	// 	],
	// 	restricted: ['Belly Drum', 'Extreme Speed', 'Quiver Dance', 'Population Bomb', 'Revival Blessing', 'Shell Smash'],
	// 	onValidateSet(set, format, setHas, teamHas) {
	// 		const lastMoveslot = this.dex.moves.get(set.moves[set.moves.length - 1]);
	// 		if (this.ruleTable.isRestricted(`move:${lastMoveslot.id}`)) {
	// 			return [`${set.species}'s move ${lastMoveslot.name} cannot be placed in the last moveslot.`];
	// 		}
	// 	},
	// 	onBegin() {
	// 		for (const pokemon of this.getAllPokemon()) {
	// 			pokemon.m.trueLastMoveSlot = pokemon.baseMoveSlots[pokemon.baseMoveSlots.length - 1];
	// 		}
	// 	},
	// 	onFaint(target) {
	// 		const allies = target.side.pokemon.filter(ally => ally && target !== ally);
	// 		for (const ally of allies) {
	// 			ally.moveSlots = (ally as any).baseMoveSlots = [...ally.baseMoveSlots, target.m.trueLastMoveSlot];
	// 		}
	// 	},
	// },
	// {
	// 	name: "[Gen 9] Inheritance",
	// 	desc: `Pok&eacute;mon may use the ability and moves of another, as long as they forfeit their own learnset.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3712296/">Inheritance</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	// searchShow: false,
	// 	ruleset: ['Standard OMs', 'Ability Clause = 1', 'Sleep Moves Clause', 'Terastal Clause', 'Min Source Gen = 9'],
	// 	banlist: [
	// 		'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Dialga', 'Dialga-Origin', 'Dondozo', 'Espathra', 'Eternatus', 'Flittle', 'Flutter Mane', 'Giratina',
	// 		'Giratina-Origin', 'Groudon', 'Hoopa-Unbound', 'Koraidon', 'Kyogre', 'Mewtwo', 'Miraidon', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Regieleki',
	// 		'Slaking', 'Spectrier', 'Torkoal', 'Ursaluna', 'Urshifu-Base', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Arena Trap',
	// 		'Huge Power', 'Imposter', 'Moody', 'Pure Power', 'Shadow Tag', 'King\'s Rock', 'Baton Pass', 'Fillet Away', 'Last Respects', 'Rage Fist',
	// 		'Shed Tail', 'Shell Smash',
	// 	],
	// 	getEvoFamily(speciesid) {
	// 		let species = Dex.species.get(speciesid);
	// 		while (species.prevo) {
	// 			species = Dex.species.get(species.prevo);
	// 		}
	// 		return species.id;
	// 	},
	// 	validateSet(set, teamHas) {
	// 		const unreleased = (pokemon: Species) => pokemon.tier === "Unreleased" && pokemon.isNonstandard === "Unobtainable";
	// 		if (!teamHas.abilityMap) {
	// 			teamHas.abilityMap = Object.create(null);
	// 			for (const pokemon of Dex.species.all()) {
	// 				if (pokemon.isNonstandard || (unreleased(pokemon) && !this.ruleTable.has('+unobtainable'))) continue;
	// 				if (pokemon.requiredAbility || pokemon.requiredItem || pokemon.requiredMove) continue;
	// 				if (this.ruleTable.isBannedSpecies(pokemon)) continue;

	// 				for (const key of Object.values(pokemon.abilities)) {
	// 					const abilityId = this.dex.toID(key);
	// 					if (abilityId in teamHas.abilityMap) {
	// 						teamHas.abilityMap[abilityId][pokemon.evos ? 'push' : 'unshift'](pokemon.id);
	// 					} else {
	// 						teamHas.abilityMap[abilityId] = [pokemon.id];
	// 					}
	// 				}
	// 			}
	// 		}

	// 		const problem = this.validateForme(set);
	// 		if (problem.length) return problem;

	// 		const species = this.dex.species.get(set.species);
	// 		if (!species.exists || species.num < 1) return [`The Pok\u00e9mon "${set.species}" does not exist.`];
	// 		if (species.isNonstandard || (unreleased(species) && !this.ruleTable.has('+unobtainable'))) {
	// 			return [`${species.name} is not obtainable in Generation ${this.dex.gen}.`];
	// 		}

	// 		const name = set.name;
	// 		if (this.ruleTable.isBannedSpecies(species)) {
	// 			return this.validateSet(set, teamHas);
	// 		}

	// 		const ability = this.dex.abilities.get(set.ability);
	// 		if (!ability.exists || ability.isNonstandard) return [`${name} needs to have a valid ability.`];
	// 		const pokemonWithAbility = teamHas.abilityMap[ability.id];
	// 		if (!pokemonWithAbility) return [`${ability.name} is not available on a legal Pok\u00e9mon.`];

	// 		(this.format as any).debug = true;

	// 		if (!teamHas.abilitySources) teamHas.abilitySources = Object.create(null);
	// 		const validSources: string[] = teamHas.abilitySources[this.dex.toID(set.species)] = []; // Evolution families

	// 		let canonicalSource = ''; // Specific for the basic implementation of Donor Clause (see onValidateTeam).

	// 		for (const donor of pokemonWithAbility) {
	// 			const donorSpecies = this.dex.species.get(donor);
	// 			let format = this.format;
	// 			if (!format.getEvoFamily) format = this.dex.formats.get('gen9inheritance');
	// 			const evoFamily = format.getEvoFamily!(donorSpecies.id);
	// 			if (validSources.includes(evoFamily)) continue;

	// 			set.species = donorSpecies.name;
	// 			set.name = donorSpecies.baseSpecies;
	// 			const problems = this.validateSet(set, teamHas) || [];
	// 			if (!problems.length) {
	// 				validSources.push(evoFamily);
	// 				canonicalSource = donorSpecies.name;
	// 			}
	// 			// Specific for the basic implementation of Donor Clause (see onValidateTeam).
	// 			if (validSources.length > 1) break;
	// 		}
	// 		(this.format as any).debug = false;

	// 		set.name = name;
	// 		set.species = species.name;
	// 		if (!validSources.length) {
	// 			if (pokemonWithAbility.length > 1) return [`${name}'s set is illegal.`];
	// 			return [`${name} has an illegal set with an ability from ${this.dex.species.get(pokemonWithAbility[0]).name}.`];
	// 		}

	// 		// Protocol: Include the data of the donor species in the `ability` data slot.
	// 		// Afterwards, we are going to reset the name to what the user intended.
	// 		set.ability = `${set.ability}0${canonicalSource}`;
	// 		return null;
	// 	},
	// 	onValidateTeam(team, f, teamHas) {
	// 		if (this.ruleTable.has('abilityclause')) {
	// 			const abilityTable = new Map<string, number>();
	// 			const base: {[k: string]: string} = {
	// 				airlock: 'cloudnine',
	// 				armortail: 'queenlymajesty',
	// 				battlearmor: 'shellarmor',
	// 				clearbody: 'whitesmoke',
	// 				dazzling: 'queenlymajesty',
	// 				emergencyexit: 'wimpout',
	// 				filter: 'solidrock',
	// 				gooey: 'tanglinghair',
	// 				insomnia: 'vitalspirit',
	// 				ironbarbs: 'roughskin',
	// 				libero: 'protean',
	// 				minus: 'plus',
	// 				moxie: 'chillingneigh',
	// 				powerofalchemy: 'receiver',
	// 				propellertail: 'stalwart',
	// 				teravolt: 'moldbreaker',
	// 				turboblaze: 'moldbreaker',
	// 			};
	// 			const num = parseInt(this.ruleTable.valueRules.get('abilityclause')!);
	// 			for (const set of team) {
	// 				let ability = this.toID(set.ability.split('0')[0]);
	// 				if (!ability) continue;
	// 				if (ability in base) ability = base[ability] as ID;
	// 				if ((abilityTable.get(ability) || 0) >= num) {
	// 					return [
	// 						`You are limited to ${num} of each ability by ${num} Ability Clause.`,
	// 						`(You have more than ${num} ${this.dex.abilities.get(ability).name} variants)`,
	// 					];
	// 				}
	// 				abilityTable.set(ability, (abilityTable.get(ability) || 0) + 1);
	// 			}
	// 		}

	// 		// Donor Clause
	// 		const evoFamilyLists = [];
	// 		for (const set of team) {
	// 			const abilitySources = teamHas.abilitySources?.[this.dex.toID(set.species)];
	// 			if (!abilitySources) continue;
	// 			let format = this.format;
	// 			if (!format.getEvoFamily) format = this.dex.formats.get('gen9inheritance');
	// 			evoFamilyLists.push(abilitySources.map(format.getEvoFamily!));
	// 		}

	// 		// Checking actual full incompatibility would require expensive algebra.
	// 		// Instead, we only check the trivial case of multiple Pokémon only legal for exactly one family. FIXME?
	// 		const requiredFamilies = Object.create(null);
	// 		for (const evoFamilies of evoFamilyLists) {
	// 			if (evoFamilies.length !== 1) continue;
	// 			const [familyId] = evoFamilies;
	// 			if (!(familyId in requiredFamilies)) {
	// 				requiredFamilies[familyId] = 1;
	// 			} else {
	// 				requiredFamilies[familyId]++;
	// 			}
	// 			if (requiredFamilies[familyId] > 1) {
	// 				return [
	// 					`You are limited to up to one inheritance from each evolution family by the Donor Clause.`,
	// 					`(You inherit more than once from ${this.dex.species.get(familyId).name}).`,
	// 				];
	// 			}
	// 		}
	// 	},
	// 	onBegin() {
	// 		for (const pokemon of this.getAllPokemon()) {
	// 			if (pokemon.baseAbility.includes('0')) {
	// 				const donor = pokemon.baseAbility.split('0')[1];
	// 				pokemon.m.donor = this.toID(donor);
	// 				pokemon.baseAbility = this.toID(pokemon.baseAbility.split('0')[0]);
	// 				pokemon.ability = pokemon.baseAbility;
	// 			}
	// 		}
	// 	},
	// 	onSwitchIn(pokemon) {
	// 		if (!pokemon.m.donor) return;
	// 		const donorTemplate = this.dex.species.get(pokemon.m.donor);
	// 		if (!donorTemplate.exists) return;
	// 		// Place volatiles on the Pokémon to show the donor details.
	// 		this.add('-start', pokemon, donorTemplate.name, '[silent]');
	// 	},
	// },

	// // Other Metagames
	// ///////////////////////////////////////////////////////////////////

	// {
	// 	section: "Other Metagames",
	// 	column: 2,
	// },
	// {
	// 	name: "[Gen 9] Almost Any Ability",
	// 	desc: `Pok&eacute;mon have access to almost any ability.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3710568/">Almost Any Ability</a>`,
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3710571/">AAA Resources</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	ruleset: ['Standard OMs', '!Obtainable Abilities', 'Ability Clause = 1', 'Sleep Moves Clause', 'Terastal Clause', 'Min Source Gen = 9'],
	// 	banlist: [
	// 		'Annihilape', 'Arceus', 'Baxcalibur', 'Calyrex-Ice', 'Calyrex-Shadow', 'Dialga', 'Dialga-Origin', 'Dragapult', 'Dragonite', 'Enamorus-Base',
	// 		'Eternatus', 'Flutter Mane', 'Gengar', 'Giratina', 'Giratina-Origin', 'Gholdengo', 'Great Tusk', 'Groudon', 'Hariyama', 'Hoopa-Unbound',
	// 		'Iron Bundle', 'Iron Hands', 'Iron Valiant', 'Koraidon', 'Kyogre', 'Magearna', 'Mewtwo', 'Miraidon', 'Noivern', 'Palkia', 'Palkia-Origin',
	// 		'Rayquaza', 'Slaking', 'Sneasler', 'Spectrier', 'Ursaluna', 'Urshifu', 'Urshifu-Rapid-Strike', 'Walking Wake', 'Zacian', 'Zacian-Crowned',
	// 		'Zamazenta-Base', 'Zoroark-Hisui', 'Arena Trap', 'Comatose', 'Contrary', 'Fur Coat', 'Good as Gold', 'Gorilla Tactics', 'Huge Power',
	// 		'Ice Scales', 'Illusion', 'Imposter', 'Innards Out', 'Magic Bounce', 'Magnet Pull', 'Moody', 'Neutralizing Gas', 'Orichalcum Pulse',
	// 		'Parental Bond', 'Poison Heal', 'Pure Power', 'Shadow Tag', 'Simple', 'Speed Boost', 'Stakeout', 'Unburden', 'Water Bubble', 'Wonder Guard',
	// 		'King\'s Rock', 'Baton Pass', 'Last Respects', 'Revival Blessing', 'Shed Tail',
	// 	],
	// },
	// {
	// 	name: "[Gen 9] Balanced Hackmons",
	// 	desc: `Anything directly hackable onto a set (EVs, IVs, forme, ability, item, and move) and is usable in local battles is allowed.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3710859/">Balanced Hackmons</a>`,
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3712766/">BH Resources</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	ruleset: ['-Nonexistent', 'OHKO Clause', 'Evasion Clause', 'Species Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Moves Clause', 'Endless Battle Clause'],
	// 	banlist: [
	// 		'Calyrex-Shadow', 'Miraidon', 'Slaking', 'Zacian-Crowned', 'Arena Trap', 'Comatose', 'Contrary', 'Gorilla Tactics', 'Huge Power', 'Illusion',
	// 		'Innards Out', 'Magnet Pull', 'Moody', 'Neutralizing Gas', 'Orichalcum Pulse', 'Parental Bond', 'Poison Heal', 'Pure Power', 'Shadow Tag',
	// 		'Stakeout', 'Water Bubble', 'Wonder Guard', 'Baton Pass', 'Belly Drum', 'Ceaseless Edge', 'Last Respects', 'Quiver Dance', 'Rage Fist',
	// 		'Revival Blessing', 'Shed Tail', 'Shell Smash',
	// 	],
	// },
	// {
	// 	name: "[Gen 9] Mix and Mega",
	// 	desc: `Mega evolve any Pok&eacute;mon with any mega stone, or transform them with Primal orbs, Origin orbs, and Rusted items with no limit. Mega and Primal boosts based on form changes from gen 7.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3710921/">Mix and Mega</a>`,
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3716385/">Mix and Mega Resources</a>`,
	// 	],

	// 	mod: 'mixandmega',
	// 	ruleset: ['Standard OMs', 'Evasion Items Clause', 'Evasion Abilities Clause', 'Sleep Moves Clause', 'Terastal Clause', 'Min Source Gen = 9'],
	// 	banlist: [
	// 		'Calyrex-Shadow', 'Eternatus', 'Koraidon', 'Kyogre', 'Miraidon', 'Beedrillite', 'Blazikenite', 'Gengarite',
	// 		'Kangaskhanite', 'Mawilite', 'Medichamite', 'Moody', 'Rusted Sword', 'Shadow Tag', 'Baton Pass', 'Shed Tail',
	// 	],
	// 	restricted: [
	// 		'Arceus', 'Basculegion-Base', 'Calyrex-Ice', 'Dialga', 'Dragapult', 'Flutter Mane', 'Gengar', 'Gholdengo', 'Giratina', 'Groudon', 'Iron Bundle',
	// 		'Kilowattrel', 'Mewtwo', 'Palkia', 'Rayquaza', 'Slaking', 'Sneasler', 'Urshifu', 'Urshifu-Rapid-Strike', 'Zacian', 'Zapdos-Base',
	// 	],
	// 	onValidateTeam(team) {
	// 		const itemTable = new Set<ID>();
	// 		for (const set of team) {
	// 			const item = this.dex.items.get(set.item);
	// 			if (!item.megaStone && !item.onPrimal &&
	// 				!item.forcedForme?.endsWith('Origin') && !item.name.startsWith('Rusted')) continue;
	// 			const natdex = this.ruleTable.has('standardnatdex');
	// 			if (natdex && item.id !== 'ultranecroziumz') continue;
	// 			const species = this.dex.species.get(set.species);
	// 			if (species.isNonstandard && !this.ruleTable.has(`+pokemontag:${this.toID(species.isNonstandard)}`)) {
	// 				return [`${species.baseSpecies} does not exist in gen 9.`];
	// 			}
	// 			if ((item.itemUser?.includes(species.name) && !item.megaStone && !item.onPrimal) ||
	// 				(natdex && species.name.startsWith('Necrozma-') && item.id === 'ultranecroziumz')) {
	// 				continue;
	// 			}
	// 			if (this.ruleTable.isRestrictedSpecies(species) || this.toID(set.ability) === 'powerconstruct') {
	// 				return [`${species.name} is not allowed to hold ${item.name}.`];
	// 			}
	// 			if (itemTable.has(item.id)) {
	// 				return [
	// 					`You are limited to one of each mega stone/orb/rusted item/sinnoh item.`,
	// 					`(You have more than one ${item.name})`,
	// 				];
	// 			}
	// 			itemTable.add(item.id);
	// 		}
	// 	},
	// 	onBegin() {
	// 		for (const pokemon of this.getAllPokemon()) {
	// 			pokemon.m.originalSpecies = pokemon.baseSpecies.name;
	// 		}
	// 	},
	// 	onSwitchIn(pokemon) {
	// 		// @ts-ignore
	// 		const originalFormeSecies = this.dex.species.get(pokemon.species.originalSpecies);
	// 		if (originalFormeSecies.exists && pokemon.m.originalSpecies !== originalFormeSecies.baseSpecies) {
	// 			// Place volatiles on the Pokémon to show its mega-evolved condition and details
	// 			this.add('-start', pokemon, originalFormeSecies.requiredItem || originalFormeSecies.requiredMove, '[silent]');
	// 			const oSpecies = this.dex.species.get(pokemon.m.originalSpecies);
	// 			if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
	// 				this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
	// 			}
	// 		}
	// 	},
	// 	onSwitchOut(pokemon) {
	// 		// @ts-ignore
	// 		const oMegaSpecies = this.dex.species.get(pokemon.species.originalSpecies);
	// 		if (oMegaSpecies.exists && pokemon.m.originalSpecies !== oMegaSpecies.baseSpecies) {
	// 			this.add('-end', pokemon, oMegaSpecies.requiredItem || oMegaSpecies.requiredMove, '[silent]');
	// 		}
	// 	},
	// },
	// {
	// 	name: "[Gen 9] Godly Gift",
	// 	desc: `Each Pok&eacute;mon receives one base stat from a God (AG/Uber Pok&eacute;mon) depending on its position in the team. If there is no Uber Pok&eacute;mon, it uses the Pok&eacute;mon in the first slot.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3710734/">Godly Gift</a>`,
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3718065/">Godly Gift Resources</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	ruleset: ['Standard OMs', 'Sleep Moves Clause', 'Terastal Clause', 'Godly Gift Mod', 'Min Source Gen = 9'],
	// 	banlist: [
	// 		'Blissey', 'Calyrex-Shadow', 'Chansey', 'Dragapult', 'Hoopa-Unbound', 'Iron Hands', 'Kingambit', 'Miraidon', 'Toxapex', 'Ursaluna',
	// 		'Zamazenta-Base', 'Arena Trap', 'Huge Power', 'Moody', 'Pure Power', 'Shadow Tag', 'Swift Swim', 'Booster Energy', 'Bright Powder',
	// 		'Focus Band', 'King\'s Rock', 'Quick Claw', 'Baton Pass', 'Last Respects', 'Shed Tail',
	// 	],
	// },
	// {
	// 	name: "[Gen 9] STABmons",
	// 	desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3710577/">STABmons</a>`,
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3714664/">STABmons Resources</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	ruleset: ['Standard OMs', 'STABmons Move Legality', 'Sleep Moves Clause', 'Min Source Gen = 9'],
	// 	banlist: [
	// 		'Arceus', 'Azumarill', 'Basculegion', 'Basculegion-F', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Cloyster', 'Dialga',
	// 		'Dialga-Origin', 'Dragapult', 'Dragonite', 'Enamorus-Base', 'Eternatus', 'Flutter Mane', 'Garchomp', 'Giratina', 'Giratina-Origin',
	// 		'Groudon', 'Iron Bundle', 'Komala', 'Koraidon', 'Kyogre', 'Landorus-Base', 'Magearna', 'Mewtwo', 'Miraidon', 'Palkia', 'Palkia-Origin',
	// 		'Rayquaza', 'Regieleki', 'Spectrier', 'Ursaluna', 'Urshifu-Base', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned',
	// 		'Zoroark-Hisui', 'Arena Trap', 'Moody', 'Shadow Tag', 'King\'s Rock', 'Baton Pass', 'Shed Tail',
	// 	],
	// 	restricted: [
	// 		'Acupressure', 'Astral Barrage', 'Belly Drum', 'Dire Claw', 'Extreme Speed', 'Fillet Away', 'Gigaton Hammer', 'Last Respects',
	// 		'No Retreat', 'Revival Blessing', 'Shell Smash', 'Shift Gear', 'V-create', 'Victory Dance', 'Wicked Blow',
	// 	],
	// },
	// {
	// 	name: "[Gen 9] NFE",
	// 	desc: `Only Pok&eacute;mon that can evolve are allowed.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3710638/">NFE</a>`,
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3712567/">NFE Resources</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	ruleset: ['Standard OMs', 'Not Fully Evolved', 'Sleep Moves Clause', 'Terastal Clause', 'Min Source Gen = 9'],
	// 	banlist: [
	// 		'Basculin-White-Striped', 'Bisharp', 'Chansey', 'Haunter', 'Magnemite', 'Magneton', 'Misdreavus', 'Naclstack',
	// 		'Primeape', 'Scyther', 'Sneasel-Hisui', 'Ursaring', 'Arena Trap', 'Shadow Tag', 'Baton Pass',
	// 	],
	// },

	// // Challengeable OMs
	// ///////////////////////////////////////////////////////////////////

	// {
	// 	section: "Challengeable OMs",
	// 	column: 2,
	// },
	// {
	// 	name: "[Gen 9] Camomons",
	// 	desc: `Pok&eacute;mon have their types set to match their first two moves.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3711340/">Camomons</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	searchShow: false,
	// 	ruleset: ['Standard OMs', 'Sleep Clause Mod', 'Evasion Items Clause', 'Evasion Abilities Clause', 'Terastal Clause', 'Camomons Mod', 'Min Source Gen = 9'],
	// 	banlist: [
	// 		'Arceus', 'Baxcalibur', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Dialga', 'Dialga-Origin', 'Dragonite', 'Drednaw', 'Enamorus-Base',
	// 		'Espathra', 'Eternatus', 'Flutter Mane', 'Giratina', 'Giratina-Origin', 'Groudon', 'Iron Bundle', 'Koraidon', 'Kyogre', 'Landorus-Base', 'Mewtwo',
	// 		'Miraidon', 'Palafin', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Roaring Moon', 'Sneasler', 'Spectrier', 'Tornadus-Therian', 'Volcarona', 'Zacian',
	// 		'Zacian-Crowned', 'Zamazenta-Crowned', 'Arena Trap', 'Moody', 'Shadow Tag', 'Booster Energy', 'King\'s Rock', 'Baton Pass', 'Last Respects', 'Shed Tail',
	// 	],
	// },
	// {
	// 	name: "[Gen 9] Convergence",
	// 	desc: `Allows all Pok&eacute;mon that have identical types to share moves and abilities.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3714048/">Convergence</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	searchShow: false,
	// 	ruleset: ['Standard OMs', 'Sleep Clause Mod', 'Convergence Legality', '!Obtainable Abilities', 'Min Source Gen = 9'],
	// 	banlist: [
	// 		'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Dialga', 'Dialga-Origin', 'Dondozo', 'Eternatus', 'Flutter Mane', 'Giratina', 'Giratina-Origin',
	// 		'Groudon', 'Inteleon', 'Iron Bundle', 'Iron Hands', 'Koraidon', 'Kyogre', 'Landorus-Base', 'Magearna', 'Mewtwo', 'Miraidon', 'Palafin', 'Palkia',
	// 		'Palkia-Origin', 'Rayquaza', 'Regieleki', 'Slaking', 'Spectrier', 'Urshifu-Base', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned',
	// 		'Arena Trap', 'Comatose', 'Imposter', 'Moody', 'Pure Power', 'Shadow Tag', 'Speed Boost', 'Damp Rock', 'King\'s Rock', 'Baton Pass', 'Extreme Speed',
	// 		'Last Respects', 'Quiver Dance', 'Rage Fist', 'Shed Tail', 'Shell Smash', 'Spore', 'Transform',
	// 	],
	// },
	// {
	// 	name: "[Gen 9] Cross Evolution",
	// 	desc: `Give a Pok&eacute;mon a Pok&eacute;mon name of the next evolution stage as a nickname to inherit stat changes, typing, abilities, and moves from the next stage Pok&eacute;mon.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3710953/">Cross Evolution</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	searchShow: false,
	// 	ruleset: ['Standard OMs', 'Ability Clause = 2', 'Sleep Moves Clause', 'Min Source Gen = 9'],
	// 	banlist: [
	// 		'Basculin-White-Striped', 'Girafarig', 'Miraidon', 'Scyther', 'Sneasel', 'Sneasel-Hisui', 'Ursaring', 'Arena Trap', 'Huge Power', 'Ice Scales',
	// 		'Pure Power', 'Shadow Tag', 'Speed Boost', 'Moody', 'King\'s Rock', 'Baton Pass', 'Revival Blessing',
	// 	],
	// 	restricted: ['Gallade', 'Gholdengo'],
	// 	onValidateTeam(team) {
	// 		const names = new Set<ID>();
	// 		for (const set of team) {
	// 			const name = set.name;
	// 			if (names.has(this.dex.toID(name))) {
	// 				return [
	// 					`Your Pok\u00e9mon must have different nicknames.`,
	// 					`(You have more than one Pok\u00e9mon named '${name}')`,
	// 				];
	// 			}
	// 			names.add(this.dex.toID(name));
	// 		}
	// 		if (!names.size) {
	// 			return [
	// 				`${this.format.name} works using nicknames; your team has 0 nicknamed Pok\u00e9mon.`,
	// 				`(If this was intentional, add a nickname to one Pok\u00e9mon that isn't the name of a Pok\u00e9mon species.)`,
	// 			];
	// 		}
	// 	},
	// 	checkCanLearn(move, species, lsetData, set) {
	// 		// @ts-ignore
	// 		if (!set.sp?.exists || !set.crossSpecies?.exists) {
	// 			return this.checkCanLearn(move, species, lsetData, set);
	// 		}
	// 		// @ts-ignore
	// 		const problem = this.checkCanLearn(move, set.sp);
	// 		if (!problem) return null;
	// 		// @ts-ignore
	// 		if (this.checkCanLearn(move, set.crossSpecies)) return problem;
	// 		return null;
	// 	},
	// 	validateSet(set, teamHas) {
	// 		const crossSpecies = this.dex.species.get(set.name);
	// 		let problems = this.dex.formats.get('Obtainable Misc').onChangeSet?.call(this, set, this.format) || null;
	// 		if (Array.isArray(problems) && problems.length) return problems;
	// 		const crossNonstandard = (!this.ruleTable.has('standardnatdex') && crossSpecies.isNonstandard === 'Past') ||
	// 			crossSpecies.isNonstandard === 'Future';
	// 		const crossIsCap = !this.ruleTable.has('+pokemontag:cap') && crossSpecies.isNonstandard === 'CAP';
	// 		if (!crossSpecies.exists || crossNonstandard || crossIsCap) return this.validateSet(set, teamHas);
	// 		const species = this.dex.species.get(set.species);
	// 		const check = this.checkSpecies(set, species, species, {});
	// 		if (check) return [check];
	// 		const nonstandard = !this.ruleTable.has('standardnatdex') && species.isNonstandard === 'Past';
	// 		const isCap = !this.ruleTable.has('+pokemontag:cap') && species.isNonstandard === 'CAP';
	// 		if (!species.exists || nonstandard || isCap || species === crossSpecies) return this.validateSet(set, teamHas);
	// 		if (!species.nfe) return [`${species.name} cannot cross evolve because it doesn't evolve.`];
	// 		const crossIsUnreleased = (crossSpecies.tier === "Unreleased" && crossSpecies.isNonstandard === "Unobtainable" &&
	// 			!this.ruleTable.has('+unobtainable'));
	// 		if (crossSpecies.battleOnly || crossIsUnreleased || !crossSpecies.prevo) {
	// 			return [`${species.name} cannot cross evolve into ${crossSpecies.name} because it isn't an evolution.`];
	// 		}
	// 		if (this.ruleTable.isRestrictedSpecies(crossSpecies)) {
	// 			return [`${species.name} cannot cross evolve into ${crossSpecies.name} because it is banned.`];
	// 		}
	// 		const crossPrevoSpecies = this.dex.species.get(crossSpecies.prevo);
	// 		if (!crossPrevoSpecies.prevo !== !species.prevo) {
	// 			return [
	// 				`${species.name} cannot cross evolve into ${crossSpecies.name} because they are not consecutive evolution stages.`,
	// 			];
	// 		}
	// 		const item = this.dex.items.get(set.item);
	// 		if (item.itemUser?.length) {
	// 			if (!item.itemUser.includes(crossSpecies.name) || crossSpecies.name !== species.name) {
	// 				return [`${species.name} cannot use ${item.name} because it is cross evolved into ${crossSpecies.name}.`];
	// 			}
	// 		}
	// 		const ability = this.dex.abilities.get(set.ability);
	// 		if (!this.ruleTable.isRestricted(`ability:${ability.id}`) || Object.values(species.abilities).includes(ability.name)) {
	// 			set.species = crossSpecies.name;
	// 		}

	// 		// @ts-ignore
	// 		set.sp = species;
	// 		// @ts-ignore
	// 		set.crossSpecies = crossSpecies;
	// 		problems = this.validateSet(set, teamHas);
	// 		set.name = crossSpecies.name;
	// 		set.species = species.name;
	// 		return problems;
	// 	},
	// 	onModifySpecies(species, target, source, effect) {
	// 		if (!target) return; // chat
	// 		if (effect && ['imposter', 'transform'].includes(effect.id)) return;
	// 		if (target.set.name === target.set.species) return;
	// 		const crossSpecies = this.dex.species.get(target.set.name);
	// 		if (!crossSpecies.exists) return;
	// 		if (species.battleOnly || !species.nfe) return;
	// 		const crossIsUnreleased = (crossSpecies.tier === "Unreleased" && crossSpecies.isNonstandard === "Unobtainable" &&
	// 			!this.ruleTable.has('+unobtainable'));
	// 		if (crossSpecies.battleOnly || crossIsUnreleased || !crossSpecies.prevo) return;
	// 		const crossPrevoSpecies = this.dex.species.get(crossSpecies.prevo);
	// 		if (!crossPrevoSpecies.prevo !== !species.prevo) return;

	// 		const mixedSpecies = this.dex.deepClone(species);
	// 		mixedSpecies.weightkg =
	// 			Math.max(0.1, +(species.weightkg + crossSpecies.weightkg - crossPrevoSpecies.weightkg)).toFixed(1);
	// 		mixedSpecies.nfe = false;
	// 		mixedSpecies.evos = [];
	// 		mixedSpecies.eggGroups = crossSpecies.eggGroups;
	// 		mixedSpecies.abilities = crossSpecies.abilities;
	// 		mixedSpecies.bst = 0;
	// 		let i: StatID;
	// 		for (i in species.baseStats) {
	// 			const statChange = crossSpecies.baseStats[i] - crossPrevoSpecies.baseStats[i];
	// 			mixedSpecies.baseStats[i] = this.clampIntRange(species.baseStats[i] + statChange, 1, 255);
	// 			mixedSpecies.bst += mixedSpecies.baseStats[i];
	// 		}
	// 		if (crossSpecies.types[0] !== crossPrevoSpecies.types[0]) mixedSpecies.types[0] = crossSpecies.types[0];
	// 		if (crossSpecies.types[1] !== crossPrevoSpecies.types[1]) {
	// 			mixedSpecies.types[1] = crossSpecies.types[1] || crossSpecies.types[0];
	// 		}
	// 		if (mixedSpecies.types[0] === mixedSpecies.types[1]) mixedSpecies.types = [mixedSpecies.types[0]];

	// 		return mixedSpecies;
	// 	},
	// 	onBegin() {
	// 		for (const pokemon of this.getAllPokemon()) {
	// 			pokemon.baseSpecies = pokemon.species;
	// 		}
	// 	},
	// },
	// {
	// 	name: "[Gen 9] Fortemons",
	// 	desc: `Put an attacking move in the item slot to have all of a Pok&eacute;mon's attacks inherit its properties.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3713983/">Fortemons</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	searchShow: false,
	// 	ruleset: ['Standard OMs', 'Sleep Clause Mod', 'Min Source Gen = 9'],
	// 	banlist: [
	// 		'Annihilape', 'Arceus', 'Azumarill', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Cloyster', 'Dialga', 'Dialga-Origin', 'Dragonite',
	// 		'Espathra', 'Eternatus', 'Flutter Mane', 'Giratina', 'Giratina-Origin', 'Great Tusk', 'Groudon', 'Iron Bundle', 'Koraidon', 'Kyogre', 'Magearna',
	// 		'Mewtwo', 'Miraidon', 'Palafin', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Regieleki', 'Spectrier', 'Sneasler', 'Urshifu-Base', 'Zacian', 'Zacian-Crowned',
	// 		'Zamazenta-Base', 'Arena Trap', 'Moody', 'Serene Grace', 'Shadow Tag', 'Damp Rock', 'Heat Rock', 'Baton Pass', 'Beat Up', 'Last Respects',
	// 	],
	// 	restricted: ['Dynamic Punch', 'Flail', 'Fury Cutter', 'Grass Knot', 'Heavy Slam', 'Inferno', 'Low Kick', 'Nuzzle', 'Power Trip', 'Reversal', 'Spit Up', 'Stored Power', 'Zap Cannon'],
	// 	onValidateTeam(team) {
	// 		const itemTable = new Set<string>();
	// 		for (const set of team) {
	// 			const forte = this.toID(set.item);
	// 			if (!forte) continue;
	// 			const move = this.dex.moves.get(forte);
	// 			if (move.exists && move.id !== 'metronome') {
	// 				if (itemTable.has(forte)) {
	// 					return [
	// 						`You are limited to one of each move in the item slot per team.`,
	// 						`(You have more than one ${move.name}.)`,
	// 					];
	// 				}
	// 				itemTable.add(forte);
	// 			}
	// 		}
	// 	},
	// 	validateSet(set, teamHas) {
	// 		const item = set.item;
	// 		const species = this.dex.species.get(set.species);
	// 		const move = this.dex.moves.get(item);
	// 		if (!move.exists || move.id === 'metronome' || move.category === 'Status') {
	// 			return this.validateSet(set, teamHas);
	// 		}
	// 		set.item = '';
	// 		const problems = this.validateSet(set, teamHas) || [];
	// 		set.item = item;
	// 		if (this.checkCanLearn(move, species, this.allSources(species), set)) {
	// 			problems.push(`${species.name} can't learn ${move.name}.`);
	// 		}
	// 		if (set.moves.map(this.toID).includes(move.id)) {
	// 			problems.push(`Moves in the item slot can't be in the moveslots as well.`);
	// 		}
	// 		if (this.ruleTable.has(`-move:${move.id}`)) {
	// 			problems.push(`The move ${move.name} is fully banned.`);
	// 		}
	// 		const accuracyLoweringMove =
	// 			move.secondaries?.some(secondary => secondary.boosts?.accuracy && secondary.boosts?.accuracy < 0);
	// 		const flinchMove = move.secondaries?.some(secondary => secondary.volatileStatus === 'flinch');
	// 		const freezeMove = move.secondaries?.some(secondary => secondary.status === 'frz') || move.id === 'triattack';
	// 		if (this.ruleTable.isRestricted(`move:${move.id}`) ||
	// 			((accuracyLoweringMove || move.ohko || move.multihit || move.id === 'beatup' || move.flags['charge'] ||
	// 				move.priority > 0 || move.damageCallback || flinchMove || freezeMove || move.selfSwitch) &&
	// 			!this.ruleTable.has(`+move:${move.id}`))) {
	// 			problems.push(`The move ${move.name} can't be used as an item.`);
	// 		}
	// 		return problems.length ? problems : null;
	// 	},
	// 	onBegin() {
	// 		for (const pokemon of this.getAllPokemon()) {
	// 			const move = this.dex.getActiveMove(pokemon.set.item);
	// 			if (move.exists && move.category !== 'Status') {
	// 				pokemon.m.forte = move;
	// 				pokemon.item = 'mail' as ID;
	// 			}
	// 		}
	// 	},
	// 	onModifyMovePriority: 1,
	// 	onModifyMove(move, pokemon, target) {
	// 		const forte: ActiveMove = pokemon.m.forte;
	// 		if (move.category !== 'Status' && forte) {
	// 			move.flags = {...move.flags, ...forte.flags};
	// 			if (forte.self) {
	// 				if (forte.self.onHit && move.self?.onHit) {
	// 					for (const i in forte.self) {
	// 						if (i.startsWith('onHit')) continue;
	// 						(move.self as any)[i] = (forte.self as any)[i];
	// 					}
	// 				} else {
	// 					move.self = {...(move.self || {}), ...forte.self};
	// 				}
	// 			}
	// 			if (forte.selfBoost?.boosts) {
	// 				if (!move.selfBoost?.boosts) move.selfBoost = {boosts: {}};
	// 				let boostid: BoostID;
	// 				for (boostid in forte.selfBoost.boosts) {
	// 					if (!move.selfBoost.boosts![boostid]) move.selfBoost.boosts![boostid] = 0;
	// 					move.selfBoost.boosts![boostid]! += forte.selfBoost.boosts[boostid]!;
	// 				}
	// 			}
	// 			if (forte.secondaries) {
	// 				move.secondaries = [...(move.secondaries || []), ...forte.secondaries];
	// 			}
	// 			move.critRatio = (move.critRatio || 1) + (forte.critRatio || 1) - 1;
	// 			const VALID_PROPERTIES = [
	// 				'alwaysHit', 'basePowerCallback', 'breaksProtect', 'drain', 'forceSTAB', 'forceSwitch', 'hasCrashDamage', 'hasSheerForce',
	// 				'ignoreAbility', 'ignoreAccuracy', 'ignoreDefensive', 'ignoreEvasion', 'ignoreImmunity', 'mindBlownRecoil', 'noDamageVariance',
	// 				'ohko', 'overrideDefensivePokemon', 'overrideDefensiveStat', 'overrideOffensivePokemon', 'overrideOffensiveStat', 'pseudoWeather',
	// 				'recoil', 'selfdestruct', 'selfSwitch', 'sleepUsable', 'smartTarget', 'stealsBoosts', 'thawsTarget', 'volatileStatus', 'willCrit',
	// 			] as const;
	// 			for (const property of VALID_PROPERTIES) {
	// 				if (forte[property]) {
	// 					move[property] = forte[property] as any;
	// 				}
	// 			}
	// 			// Added here because onEffectiveness doesn't have an easy way to reference the source
	// 			if (forte.onEffectiveness) {
	// 				move.onEffectiveness = function (typeMod, t, type, m) {
	// 					return forte.onEffectiveness!.call(this, typeMod, t, type, m);
	// 				};
	// 			}
	// 			forte.onModifyMove?.call(this, move, pokemon, target);
	// 		}
	// 	},
	// 	onModifyPriority(priority, source, target, move) {
	// 		const forte = source?.m.forte;
	// 		if (move.category !== 'Status' && forte) {
	// 			if (source.hasAbility('Triage') && forte.flags['heal']) {
	// 				return priority + (move.flags['heal'] ? 0 : 3);
	// 			}
	// 			return priority + forte.priority;
	// 		}
	// 	},
	// 	onModifyTypePriority: 1,
	// 	onModifyType(move, pokemon, target) {
	// 		const forte = pokemon.m.forte;
	// 		if (move.category !== 'Status' && forte) {
	// 			this.singleEvent('ModifyType', forte, null, pokemon, target, move, move);
	// 		}
	// 	},
	// 	onHitPriority: 1,
	// 	onHit(target, source, move) {
	// 		const forte = source.m.forte;
	// 		if (move?.category !== 'Status' && forte) {
	// 			this.singleEvent('Hit', forte, {}, target, source, move);
	// 			if (forte.self) this.singleEvent('Hit', forte.self, {}, source, source, move);
	// 			this.singleEvent('AfterHit', forte, {}, target, source, move);
	// 		}
	// 	},
	// 	onAfterSubDamage(damage, target, source, move) {
	// 		const forte = source.m.forte;
	// 		if (move?.category !== 'Status' && forte) {
	// 			this.singleEvent('AfterSubDamage', forte, null, target, source, move);
	// 		}
	// 	},
	// 	onModifySecondaries(secondaries, target, source, move) {
	// 		if (secondaries.some(s => !!s.self)) move.selfDropped = false;
	// 	},
	// 	onAfterMoveSecondaryPriority: 1,
	// 	onAfterMoveSecondarySelf(source, target, move) {
	// 		const forte = source.m.forte;
	// 		if (move?.category !== 'Status' && forte) {
	// 			this.singleEvent('AfterMoveSecondarySelf', forte, null, source, target, move);
	// 		}
	// 	},
	// 	onBasePowerPriority: 1,
	// 	onBasePower(basePower, source, target, move) {
	// 		const forte = source.m.forte;
	// 		if (move.category !== 'Status' && forte?.onBasePower) {
	// 			forte.onBasePower.call(this, basePower, source, target, move);
	// 		}
	// 	},
	// 	pokemon: {
	// 		getItem() {
	// 			const move = this.battle.dex.moves.get(this.m.forte);
	// 			if (!move.exists) return Object.getPrototypeOf(this).getItem.call(this);
	// 			return {
	// 				...this.battle.dex.items.get('mail'),
	// 				name: move.name, id: move.id, ignoreKlutz: true, onTakeItem: false,
	// 			};
	// 		},
	// 	},
	// },
	// {
	// 	name: "[Gen 9] Full Potential",
	// 	desc: `Pok&eacute;mon's moves hit off of their highest stat.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3711127/">Full Potential</a>`,
	// 	],

	// 	mod: 'fullpotential',
	// 	searchShow: false,
	// 	ruleset: ['Standard OMs', 'Evasion Abilities Clause', 'Evasion Items Clause', 'Sleep Moves Clause', 'Terastal Clause', 'Min Source Gen = 9'],
	// 	banlist: [
	// 		'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Cyclizar', 'Dialga', 'Dialga-Origin', 'Dragapult', 'Espathra', 'Eternatus', 'Flutter Mane',
	// 		'Giratina', 'Giratina-Origin', 'Groudon', 'Iron Bundle', 'Koraidon', 'Kyogre', 'Mewtwo', 'Miraidon', 'Palkia', 'Palkia-Origin', 'Rayquaza',
	// 		'Regieleki', 'Scream Tail', 'Spectrier', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Arena Trap', 'Chlorophyll', 'Drought',
	// 		'Moody', 'Sand Rush', 'Shadow Tag', 'Slush Rush', 'Swift Swim', 'Unburden', 'Booster Energy', 'Choice Scarf', 'Heat Rock', 'King\'s Rock',
	// 		'Baton Pass', 'Tailwind',
	// 	],
	// },
	// {
	// 	name: "[Gen 9] Partners in Crime",
	// 	desc: `Doubles-based metagame where both active ally Pok&eacute;mon share abilities and moves.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3710997/">Partners in Crime</a>`,
	// 	],

	// 	mod: 'partnersincrime',
	// 	gameType: 'doubles',
	// 	searchShow: false,
	// 	ruleset: ['Standard Doubles'],
	// 	banlist: [
	// 		'Annihilape', 'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Dialga', 'Eternatus', 'Flutter Mane', 'Giratina', 'Groudon', 'Koraidon',
	// 		'Kyogre', 'Magearna', 'Mewtwo', 'Miraidon', 'Palkia', 'Rayquaza', 'Urshifu-Base', 'Zacian', 'Zamazenta', 'Dancer', 'Huge Power', 'Moody',
	// 		'Pure Power', 'Shadow Tag', 'Ally Switch', 'Revival Blessing', 'Swagger',
	// 	],
	// 	onBegin() {
	// 		for (const pokemon of this.getAllPokemon()) {
	// 			pokemon.m.trackPP = new Map<string, number>();
	// 		}
	// 	},
	// 	onBeforeSwitchIn(pokemon) {
	// 		pokemon.m.curMoves = this.dex.deepClone(pokemon.moves);
	// 		let ngas = false;
	// 		for (const poke of this.getAllActive()) {
	// 			if (this.toID(poke.ability) === ('neutralizinggas' as ID)) {
	// 				ngas = true;
	// 				break;
	// 			}
	// 		}
	// 		const BAD_ABILITIES = ['trace', 'imposter', 'neutralizinggas', 'illusion', 'wanderingspirit'];
	// 		const ally = pokemon.side.active.find(mon => mon && mon !== pokemon && !mon.fainted);
	// 		if (ally && ally.ability !== pokemon.ability) {
	// 			if (!pokemon.m.innate && !BAD_ABILITIES.includes(this.toID(ally.ability))) {
	// 				pokemon.m.innate = 'ability:' + ally.ability;
	// 				if (!ngas || ally.getAbility().isPermanent || pokemon.hasItem('Ability Shield')) {
	// 					pokemon.volatiles[pokemon.m.innate] = {id: pokemon.m.innate, target: pokemon};
	// 					pokemon.m.startVolatile = true;
	// 				}
	// 			}
	// 			if (!ally.m.innate && !BAD_ABILITIES.includes(this.toID(pokemon.ability))) {
	// 				ally.m.innate = 'ability:' + pokemon.ability;
	// 				if (!ngas || pokemon.getAbility().isPermanent || ally.hasItem('Ability Shield')) {
	// 					ally.volatiles[ally.m.innate] = {id: ally.m.innate, target: ally};
	// 					ally.m.startVolatile = true;
	// 				}
	// 			}
	// 		}
	// 	},
	// 	// Starting innate abilities in scripts#actions
	// 	onSwitchOut(pokemon) {
	// 		if (pokemon.m.innate) {
	// 			pokemon.removeVolatile(pokemon.m.innate);
	// 			delete pokemon.m.innate;
	// 		}
	// 		const ally = pokemon.side.active.find(mon => mon && mon !== pokemon && !mon.fainted);
	// 		if (ally && ally.m.innate) {
	// 			ally.removeVolatile(ally.m.innate);
	// 			delete ally.m.innate;
	// 		}
	// 	},
	// 	onFaint(pokemon) {
	// 		if (pokemon.m.innate) {
	// 			pokemon.removeVolatile(pokemon.m.innate);
	// 			delete pokemon.m.innate;
	// 		}
	// 		const ally = pokemon.side.active.find(mon => mon && mon !== pokemon && !mon.fainted);
	// 		if (ally && ally.m.innate) {
	// 			ally.removeVolatile(ally.m.innate);
	// 			delete ally.m.innate;
	// 		}
	// 	},
	// },
	// {
	// 	name: "[Gen 9] Pokebilities",
	// 	desc: `Pok&eacute;mon have all of their released abilities simultaneously.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3712725/">Pok&eacute;bilities</a>`,
	// 	],
	// 	mod: 'pokebilities',
	// 	searchShow: false,
	// 	ruleset: ['Standard OMs', 'Sleep Clause Mod', 'Min Source Gen = 9'],
	// 	banlist: [
	// 		'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Dialga', 'Dialga-Origin', 'Espathra', 'Eternatus', 'Flutter Mane', 'Giratina',
	// 		'Giratina-Origin', 'Groudon', 'Iron Bundle', 'Koraidon', 'Kyogre', 'Landorus-Base', 'Miraidon', 'Mewtwo', 'Palafin', 'Palkia',
	// 		'Palkia-Origin', 'Rayquaza', 'Regieleki', 'Spectrier', 'Zacian', 'Zacian-Crowned', 'Arena Trap', 'Moody', 'Shadow Tag', 'King\'s Rock',
	// 		'Baton Pass', 'Shed Tail', 'Last Respects',
	// 	],
	// 	onValidateSet(set) {
	// 		const species = this.dex.species.get(set.species);
	// 		const unSeenAbilities = Object.keys(species.abilities)
	// 			.filter(key => key !== 'S' && (key !== 'H' || !species.unreleasedHidden))
	// 			.map(key => species.abilities[key as "0" | "1" | "H" | "S"])
	// 			.filter(ability => ability !== set.ability);
	// 		if (unSeenAbilities.length && this.toID(set.ability) !== this.toID(species.abilities['S'])) {
	// 			for (const abilityName of unSeenAbilities) {
	// 				const banReason = this.ruleTable.check('ability:' + this.toID(abilityName));
	// 				if (banReason) {
	// 					return [`${set.name}'s ability ${abilityName} is ${banReason}.`];
	// 				}
	// 			}
	// 		}
	// 	},
	// 	onBegin() {
	// 		for (const pokemon of this.getAllPokemon()) {
	// 			if (pokemon.ability === this.toID(pokemon.species.abilities['S'])) {
	// 				continue;
	// 			}
	// 			pokemon.m.innates = Object.keys(pokemon.species.abilities)
	// 				.filter(key => key !== 'S' && (key !== 'H' || !pokemon.species.unreleasedHidden))
	// 				.map(key => this.toID(pokemon.species.abilities[key as "0" | "1" | "H" | "S"]))
	// 				.filter(ability => ability !== pokemon.ability);
	// 		}
	// 	},
	// 	onBeforeSwitchIn(pokemon) {
	// 		// Abilities that must be applied before both sides trigger onSwitchIn to correctly
	// 		// handle switch-in ability-to-ability interactions, e.g. Intimidate counters
	// 		const neededBeforeSwitchInIDs = [
	// 			'clearbody', 'competitive', 'contrary', 'defiant', 'fullmetalbody', 'hypercutter', 'innerfocus',
	// 			'mirrorarmor', 'oblivious', 'owntempo', 'rattled', 'scrappy', 'simple', 'whitesmoke',
	// 		];
	// 		if (pokemon.m.innates) {
	// 			for (const innate of pokemon.m.innates) {
	// 				if (!neededBeforeSwitchInIDs.includes(innate)) continue;
	// 				if (pokemon.hasAbility(innate)) continue;
	// 				pokemon.addVolatile("ability:" + innate, pokemon);
	// 			}
	// 		}
	// 	},
	// 	onSwitchInPriority: 2,
	// 	onSwitchIn(pokemon) {
	// 		if (pokemon.m.innates) {
	// 			for (const innate of pokemon.m.innates) {
	// 				if (pokemon.hasAbility(innate)) continue;
	// 				pokemon.addVolatile("ability:" + innate, pokemon);
	// 			}
	// 		}
	// 	},
	// 	onSwitchOut(pokemon) {
	// 		for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
	// 			pokemon.removeVolatile(innate);
	// 		}
	// 	},
	// 	onFaint(pokemon) {
	// 		for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
	// 			const innateEffect = this.dex.conditions.get(innate) as Effect;
	// 			this.singleEvent('End', innateEffect, null, pokemon);
	// 		}
	// 	},
	// 	onAfterMega(pokemon) {
	// 		for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
	// 			pokemon.removeVolatile(innate);
	// 		}
	// 		pokemon.m.innates = undefined;
	// 	},
	// },
	// {
	// 	name: "[Gen 9] Pure Hackmons",
	// 	desc: `Anything directly hackable onto a set (EVs, IVs, forme, ability, item, and move) and is usable in local battles is allowed.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3712086/">Pure Hackmons</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	searchShow: false,
	// 	ruleset: ['-Nonexistent', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Endless Battle Clause'],
	// },
	// {
	// 	name: "[Gen 9] Revelationmons",
	// 	desc: `The moves in the first slot(s) of a Pok&eacute;mon's set have their types changed to match the Pok&eacute;mon's type(s).`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3711644/">Revelationmons</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	searchShow: false,
	// 	ruleset: ['Standard OMs', 'Sleep Moves Clause', 'Revelationmons Mod', 'Min Source Gen = 9'],
	// 	banlist: [
	// 		'Arceus', 'Barraskewda', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Dialga', 'Dialga-Origin', 'Dragonite', 'Espathra', 'Eternatus',
	// 		'Flutter Mane', 'Giratina', 'Giratina-Origin', 'Groudon', 'Iron Bundle', 'Koraidon', 'Kyogre', 'Landorus-Base', 'Mewtwo', 'Miraidon',
	// 		'Noivern', 'Palafin', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Spectrier', 'Urshifu-Base', 'Zacian', 'Zacian-Crowned', 'Zamazenta-Crowned',
	// 		'Arena Trap', 'Moody', 'Shadow Tag', 'King\'s Rock', 'Baton Pass', 'Last Respects',
	// 	],
	// 	restricted: ['U-turn', 'Volt Switch'],
	// },
	// {
	// 	name: "[Gen 9] Shared Power",
	// 	desc: `Once a Pok&eacute;mon switches in, its ability is shared with the rest of the team.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3711011/">Shared Power</a>`,
	// 	],

	// 	mod: 'sharedpower',
	// 	searchShow: false,
	// 	ruleset: ['Standard OMs', 'Evasion Abilities Clause', 'Evasion Items Clause', 'Sleep Moves Clause', 'Terastal Clause', 'Min Source Gen = 9'],
	// 	banlist: [
	// 		'Arceus', 'Calyrex-Shadow', 'Chien-Pao', 'Dragonite', 'Gholdengo', 'Koraidon', 'Komala', 'Miraidon', 'Raichu-Alola', 'Rayquaza', 'Zacian',
	// 		'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Arena Trap', 'Armor Tail', 'Chlorophyll', 'Contrary', 'Dazzling', 'Fur Coat', 'Guts',
	// 		'Huge Power', 'Illusion', 'Imposter', 'Magic Bounce', 'Magnet Pull', 'Mold Breaker', 'Moody', 'Poison Heal', 'Prankster', 'Psychic Surge',
	// 		'Pure Power', 'Purifying Salt', 'Queenly Majesty', 'Quick Draw', 'Quick Feet', 'Regenerator', 'Sand Rush', 'Shadow Tag', 'Simple', 'Slush Rush',
	// 		'Speed Boost', 'Stakeout', 'Stench', 'Sturdy', 'Swift Swim', 'Tinted Lens', 'Unaware', 'Unburden', 'Starf Berry', 'King\'s Rock', 'Baton Pass',
	// 	],
	// 	getSharedPower(pokemon) {
	// 		const sharedPower = new Set<string>();
	// 		for (const ally of pokemon.side.pokemon) {
	// 			if (ally.previouslySwitchedIn > 0) {
	// 				if (pokemon.battle.dex.currentMod !== 'sharedpower' && ['trace', 'mirrorarmor'].includes(ally.baseAbility)) {
	// 					sharedPower.add('noability');
	// 					continue;
	// 				}
	// 				sharedPower.add(ally.baseAbility);
	// 			}
	// 		}
	// 		sharedPower.delete(pokemon.baseAbility);
	// 		return sharedPower;
	// 	},
	// 	onBeforeSwitchIn(pokemon) {
	// 		let format = this.format;
	// 		if (!format.getSharedPower) format = this.dex.formats.get('gen9sharedpower');
	// 		for (const ability of format.getSharedPower!(pokemon)) {
	// 			const effect = 'ability:' + ability;
	// 			pokemon.volatiles[effect] = {id: this.toID(effect), target: pokemon};
	// 			if (!pokemon.m.abils) pokemon.m.abils = [];
	// 			if (!pokemon.m.abils.includes(effect)) pokemon.m.abils.push(effect);
	// 		}
	// 	},
	// 	onSwitchInPriority: 2,
	// 	onSwitchIn(pokemon) {
	// 		let format = this.format;
	// 		if (!format.getSharedPower) format = this.dex.formats.get('gen9sharedpower');
	// 		for (const ability of format.getSharedPower!(pokemon)) {
	// 			if (ability === 'noability') {
	// 				this.hint(`Mirror Armor and Trace break in Shared Power formats that don't use Shared Power as a base, so they get removed from non-base users.`);
	// 			}
	// 			const effect = 'ability:' + ability;
	// 			delete pokemon.volatiles[effect];
	// 			pokemon.addVolatile(effect);
	// 		}
	// 	},
	// },
	// {
	// 	name: "[Gen 9] Tera Donation",
	// 	desc: `The first Pok&eacute;mon sent out immediately terastallizes. The other Pok&eacute;mon in the party inherit that Tera Type as an additional type.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3715801/">Tera Donation</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	searchShow: false,
	// 	ruleset: ['Standard OMs', 'Sleep Moves CLause', 'Tera Type Preview', 'Min Source Gen = 9'],
	// 	banlist: [
	// 		'Annihilape', 'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Cyclizar', 'Dialga', 'Dialga-Origin', 'Espathra', 'Eternatus',
	// 		'Giratina', 'Giratina-Origin', 'Groudon', 'Flutter Mane', 'Hoopa-Unbound', 'Iron Bundle', 'Koraidon', 'Kyogre', 'Landorus-Base', 'Mewtwo',
	// 		'Miraidon', 'Palafin', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Urshifu-Base', 'Zacian', 'Zacian-Crowned', 'Zamazenta-Crowned', 'Arena Trap',
	// 		'Moody', 'Shadow Tag', 'Booster Energy', 'Heat Rock', 'King\'s Rock', 'Baton Pass', 'Last Respects',
	// 	],
	// 	onSwitchIn(pokemon) {
	// 		if (this.turn === 0) {
	// 			this.actions.terastallize(pokemon);
	// 			const teraType = pokemon.teraType;
	// 			for (const poke of pokemon.side.pokemon) {
	// 				poke.m.thirdType = teraType;
	// 			}
	// 		}
	// 		if (!pokemon.terastallized) {
	// 			this.add('-start', pokemon, 'typechange', (pokemon.illusion || pokemon).getTypes(true).join('/'), '[silent]');
	// 		}
	// 	},
	// 	onModifyMove(move, pokemon, target) {
	// 		if (move.id === 'terablast') {
	// 			const teraType = pokemon.m.thirdType;
	// 			if (teraType && pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) {
	// 				move.category = 'Physical';
	// 			}
	// 		}
	// 	},
	// 	onModifyType(move, pokemon, target) {
	// 		if (move.id === 'terablast') {
	// 			const teraType = pokemon.m.thirdType;
	// 			if (teraType) {
	// 				move.type = teraType;
	// 			}
	// 		}
	// 	},
	// 	pokemon: {
	// 		getTypes(excludeAdded, preterastallized) {
	// 			if (!preterastallized && this.terastallized) return [this.terastallized];
	// 			const types = this.battle.runEvent('Type', this, null, null, this.types);
	// 			if (!excludeAdded && this.addedType) return types.concat(this.addedType);
	// 			const addTeraType = this.m.thirdType;
	// 			if (types.length) {
	// 				if (addTeraType) return Array.from(new Set([...types, addTeraType]));
	// 				return types;
	// 			}
	// 			return [this.battle.gen >= 5 ? 'Normal' : '???'];
	// 		},
	// 	},
	// },
	// {
	// 	name: "[Gen 9] The Card Game",
	// 	desc: `The type chart is simplified based off of the Pok&eacute;mon Trading Card Game.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3716838/">The Card Game</a>`,
	// 	],

	// 	mod: 'thecardgame',
	// 	searchShow: false,
	// 	ruleset: ['Standard OMs', 'Sleep Moves Clause', 'Evasion Abilities Clause', 'Evasion Items Clause', 'Terastal Clause', 'Min Source Gen = 9'],
	// 	banlist: [
	// 		'Annihilape', 'Arceus', 'Baxcalibur', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Dialga', 'Dialga-Origin', 'Dragapult', 'Dragonite',
	// 		'Eternatus', 'Giratina', 'Giratina-Origin', 'Groudon', 'Haxorus', 'Hydreigon', 'Iron Valiant', 'Koraidon', 'Kyogre', 'Landorus-Base', 'Mewtwo',
	// 		'Miraidon', 'Noivern', 'Palafin', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Regidrago', 'Regieleki', 'Roaring Moon', 'Salamence', 'Urshifu-Base',
	// 		'Walking Wake', 'Zacian', 'Zacian-Crowned', 'Arena Trap', 'Moody', 'Shadow Tag', 'Baton Pass', 'Last Respects', 'Shed Tail',
	// 	],
	// 	onBegin() {
	// 		for (const pokemon of this.getAllPokemon()) {
	// 			pokemon.hpType = pokemon.hpType.replace(/(Ghost|Fairy)/g, 'Psychic')
	// 				.replace(/Bug/g, 'Grass')
	// 				.replace(/Ice/g, 'Water')
	// 				.replace(/(Rock|Ground)/g, 'Fighting')
	// 				.replace(/Flying/g, 'Normal')
	// 				.replace(/Poison/g, 'Dark');
	// 			pokemon.teraType = pokemon.teraType.replace(/(Ghost|Fairy)/g, 'Psychic')
	// 				.replace(/Bug/g, 'Grass')
	// 				.replace(/Ice/g, 'Water')
	// 				.replace(/(Rock|Ground)/g, 'Fighting')
	// 				.replace(/Flying/g, 'Normal')
	// 				.replace(/Poison/g, 'Dark');
	// 		}
	// 	},
	// 	onSwitchIn(pokemon) {
	// 		this.add('-start', pokemon, 'typechange', (pokemon.illusion || pokemon).getTypes(true).join('/'), '[silent]');
	// 		pokemon.apparentType = pokemon.getTypes(true).join('/');
	// 	},
	// 	onAfterMega(pokemon) {
	// 		this.add('-start', pokemon, 'typechange', (pokemon.illusion || pokemon).getTypes(true).join('/'), '[silent]');
	// 		pokemon.apparentType = pokemon.getTypes(true).join('/');
	// 	},
	// },
	// {
	// 	name: "[Gen 9] The Loser's Game",
	// 	desc: `The first player to lose all of their Pok&eacute;mon wins.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3714223/">The Loser's Game</a>`,
	// 	],

	// 	mod: 'gen9',
	// 	searchShow: false,
	// 	ruleset: ['Standard OMs', 'Sleep Clause Mod', '!OHKO Clause', 'Picked Team Size = 6', 'Adjust Level = 100', 'Min Source Gen = 9'],
	// 	banlist: ['Infiltrator', 'Choice Scarf', 'Explosion', 'Final Gambit', 'Healing Wish', 'Lunar Dance', 'Magic Room', 'Memento', 'Misty Explosion', 'Self-Destruct'],
	// 	onValidateTeam(team) {
	// 		const familyTable = new Set<ID>();
	// 		for (const set of team) {
	// 			let species = this.dex.species.get(set.species);
	// 			while (species.prevo) {
	// 				species = this.dex.species.get(species.prevo);
	// 			}
	// 			if (familyTable.has(species.id)) {
	// 				return [
	// 					`You are limited to one Pok&eacute;mon from each family by the Family Clause.`,
	// 					`(You have more than one evolution of ${species.name}.)`,
	// 				];
	// 			}
	// 			familyTable.add(species.id);
	// 		}
	// 	},
	// 	battle: {
	// 		tiebreak() {
	// 			if (this.ended) return false;

	// 			this.inputLog.push(`>tiebreak`);
	// 			this.add('message', "Time's up! Going to tiebreaker...");
	// 			const notFainted = this.sides.map(side => (
	// 				side.pokemon.filter(pokemon => !pokemon.fainted).length
	// 			));
	// 			this.add('-message', this.sides.map((side, i) => (
	// 				`${side.name}: ${notFainted[i]} Pokemon left`
	// 			)).join('; '));
	// 			const maxNotFainted = Math.max(...notFainted);
	// 			let tiedSides = this.sides.filter((side, i) => notFainted[i] === maxNotFainted);
	// 			if (tiedSides.length <= 1) {
	// 				return this.win(tiedSides[1]);
	// 			}

	// 			const hpPercentage = tiedSides.map(side => (
	// 				side.pokemon.map(pokemon => pokemon.hp / pokemon.maxhp).reduce((a, b) => a + b) * 100 / 6
	// 			));
	// 			this.add('-message', tiedSides.map((side, i) => (
	// 				`${side.name}: ${Math.round(hpPercentage[i])}% total HP left`
	// 			)).join('; '));
	// 			const maxPercentage = Math.max(...hpPercentage);
	// 			tiedSides = tiedSides.filter((side, i) => hpPercentage[i] === maxPercentage);
	// 			if (tiedSides.length <= 1) {
	// 				return this.win(tiedSides[1]);
	// 			}

	// 			const hpTotal = tiedSides.map(side => (
	// 				side.pokemon.map(pokemon => pokemon.hp).reduce((a, b) => a + b)
	// 			));
	// 			this.add('-message', tiedSides.map((side, i) => (
	// 				`${side.name}: ${Math.round(hpTotal[i])} total HP left`
	// 			)).join('; '));
	// 			const maxTotal = Math.max(...hpTotal);
	// 			tiedSides = tiedSides.filter((side, i) => hpTotal[i] === maxTotal);
	// 			if (tiedSides.length <= 1) {
	// 				return this.win(tiedSides[1]);
	// 			}
	// 			return this.tie();
	// 		},
	// 		checkWin(faintData) {
	// 			const team1PokemonLeft = this.sides[0].pokemonLeft;
	// 			const team2PokemonLeft = this.sides[1].pokemonLeft;
	// 			if (!team1PokemonLeft && !team2PokemonLeft) {
	// 				this.win(faintData?.target.side || null);
	// 				return true;
	// 			}
	// 			for (const side of this.sides) {
	// 				if (!side.pokemonLeft) {
	// 					this.win(side);
	// 					return true;
	// 				}
	// 			}
	// 		},
	// 	},
	// },
	// {
	// 	name: "[Gen 9] Trademarked",
	// 	desc: `Sacrifice your Pok&eacute;mon's ability for a status move that activates on switch-in.`,
	// 	threads: [
	// 		`&bullet; <a href="https://www.smogon.com/forums/threads/3714688/">Trademarked</a>`,
	// 	],

	// 	mod: 'trademarked',
	// 	searchShow: false,
	// 	ruleset: ['Standard OMs', 'Sleep Moves Clause', 'Min Source Gen = 9'],
	// 	banlist: [
	// 		'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Dialga', 'Dialga-Origin', 'Eternatus', 'Flutter Mane', 'Giratina', 'Giratina-Origin', 'Groudon',
	// 		'Koraidon', 'Kyogre', 'Landorus-Base', 'Magearna', 'Mewtwo', 'Miraidon', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Slaking', 'Spectrier',
	// 		'Urshifu-Base', 'Zacian', 'Zacian-Crowned', 'Arena Trap', 'Magnet Pull', 'Moody', 'Shadow Tag', 'Baton Pass', 'Last Respects', 'Revival Blessing',
	// 	],
	// 	restricted: [
	// 		'Baneful Bunker', 'Block', 'Chilly Reception', 'Copycat', 'Detect', 'Destiny Bond', 'Encore', 'Fairy Lock', 'Ingrain', 'Instruct',
	// 		'Mean Look', 'move:Metronome', 'Nasty Plot', 'Parting Shot', 'Protect', 'Roar', 'Silk Trap', 'Spiky Shield', 'Sleep Talk', 'Shed Tail',
	// 		'Shell Smash', 'Substitute', 'Swords Dance', 'Teleport', 'Thunder Wave', 'Trick Room', 'Will-O-Wisp', 'Whirlwind',
	// 	],
	// 	onValidateTeam(team, format, teamHas) {
	// 		const problems = [];
	// 		for (const trademark in teamHas.trademarks) {
	// 			if (teamHas.trademarks[trademark] > 1) {
	// 				problems.push(`You are limited to 1 of each Trademark.`, `(You have ${teamHas.trademarks[trademark]} Pok\u00e9mon with ${trademark} as a Trademark.)`);
	// 			}
	// 		}
	// 		return problems;
	// 	},
	// 	validateSet(set, teamHas) {
	// 		const dex = this.dex;
	// 		const ability = dex.moves.get(set.ability);
	// 		if (!ability.exists) { // Not even a real move
	// 			return this.validateSet(set, teamHas);
	// 		}
	// 		// Absolute trademark bans
	// 		if (ability.category !== 'Status') {
	// 			return [`${ability.name} is not a status move and cannot be used as a trademark.`];
	// 		}
	// 		// Contingent trademark bans
	// 		if (this.ruleTable.isRestricted(`move:${ability.id}`)) {
	// 			return [`${ability.name} is restricted from being used as a trademark.`];
	// 		}
	// 		if (set.moves.map(this.toID).includes(ability.id)) {
	// 			return [`${set.name} may not use ${ability.name} as both a trademark and one of its moves simultaneously.`];
	// 		}
	// 		const customRules = this.format.customRules || [];
	// 		if (!customRules.includes('!obtainableabilities')) customRules.push('!obtainableabilities');
	// 		if (!customRules.includes('+noability')) customRules.push('+noability');

	// 		const TeamValidator: typeof import('../sim/team-validator').TeamValidator =
	// 			require('../sim/team-validator').TeamValidator;

	// 		const validator = new TeamValidator(dex.formats.get(`${this.format.id}@@@${customRules.join(',')}`));
	// 		const moves = set.moves;
	// 		set.moves = [ability.id];
	// 		set.ability = 'No Ability';
	// 		let problems = validator.validateSet(set, {}) || [];
	// 		if (problems.length) return problems;
	// 		set.moves = moves;
	// 		set.ability = 'No Ability';
	// 		problems = problems.concat(validator.validateSet(set, teamHas) || []);
	// 		set.ability = ability.id;
	// 		if (!teamHas.trademarks) teamHas.trademarks = {};
	// 		teamHas.trademarks[ability.name] = (teamHas.trademarks[ability.name] || 0) + 1;
	// 		return problems.length ? problems : null;
	// 	},
	// },
];
