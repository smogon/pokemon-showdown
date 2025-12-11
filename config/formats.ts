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

export const Formats: import('../sim/dex-formats').FormatList = [

	// S/V Regular
	///////////////////////////////////////////////////////////////////

	{
		section: "S/V Regular",
	},
	{
		name: "[Gen 9] Random Battle",
		desc: `Randomized teams of Pok&eacute;mon with sets that are generated to be competitively viable.`,
		mod: 'gen9',
		team: 'random',
		bestOfDefault: true,
		ruleset: ['PotD', 'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod'],
	},
	{
		name: "[Gen 9] OU",
		mod: 'gen9',
		ruleset: ['Standard', 'Evasion Abilities Clause', 'Sleep Moves Clause', '!Sleep Clause Mod'],
		banlist: ['Uber', 'AG', 'Arena Trap', 'Moody', 'Shadow Tag', 'King\'s Rock', 'Razor Fang', 'Baton Pass', 'Last Respects', 'Shed Tail'],
	},
	{
		name: "[Gen 9] National Dex",
		mod: 'gen9',
		ruleset: ['Standard NatDex', 'Terastal Clause'],
		banlist: [
			'ND Uber', 'ND AG', 'Arena Trap', 'Moody', 'Power Construct', 'Shadow Tag', 'King\'s Rock',
			'Quick Claw', 'Razor Fang', 'Assist', 'Baton Pass', 'Last Respects', 'Shed Tail',
		],
	},
	{
		name: "[Gen 9] Anything Goes",
		mod: 'gen9',
		ruleset: ['Standard AG'],
	},
	{
		name: "[Gen 9] National Dex AG",
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard AG', 'NatDex Mod'],
	},
	{
		name: "[Gen 9] Custom Game",
		mod: 'gen9',
		searchShow: false,
		debug: true,
		battle: { trunc: Math.trunc },
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
	{
		name: "[Gen 9] Random Doubles Battle",
		mod: 'gen9',
		gameType: 'doubles',
		team: 'random',
		bestOfDefault: true,
		ruleset: ['PotD', 'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Illusion Level Mod', 'Sleep Clause Mod'],
	},
	{
		name: "[Gen 9] Doubles OU",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard Doubles', 'Evasion Abilities Clause'],
		banlist: ['DUber', 'Shadow Tag', 'Commander'],
	},
	{
		name: "[Gen 9] Doubles Ubers",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard Doubles', '!Gravity Sleep Clause'],
	},
	{
		name: "[Gen 9] VGC 2026 Reg F",

		mod: 'gen9',
		gameType: 'doubles',
		bestOfDefault: true,
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer', 'Open Team Sheets'],
	},
	{
		name: "[Gen 9] VGC 2026 Reg F (Bo3)",

		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer', 'Force Open Team Sheets', 'Best of = 3'],
	},
	{
		name: "[Gen 9] Doubles Custom Game",
		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		battle: { trunc: Math.trunc },
		debug: true,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},

	// A Golden Experience
	///////////////////////////////////////////////////////////////////
	{
		section: "A Golden Experience",
	},
	{
		name: "[Gen 9] A Golden Experience",
		desc: `A fun metagame where we try to make everything viable, or at least usable. We also have new Fakemons!`,
		mod: 'gen9agoldenexperience',
		ruleset: ['Standard NatDex', 'Terastal Clause', 'Z-Move Clause'],
		banlist: [
			'Uber', 'AG', 'Moody', 'Power Construct', 'King\'s Rock',
			'Baton Pass', 'Last Respects', 'Quick Claw', 'Razor Fang', 'Shed Tail',
		],
		unbanlist: ['Battle Bond', 'Greninja-Bond', 'Light of Ruin'],
	},
	{
		name: "[Gen 9] A Golden Experience UU",
		desc: `A fun metagame where we try to make everything viable, or at least usable. We also have new Fakemons!`,
		mod: 'gen9agoldenexperience',
		ruleset: ['Standard NatDex', 'Terastal Clause', 'Z-Move Clause'],
		banlist: [
			'Uber', 'AG', 'OU', 'UUBL', 'Moody', 'Power Construct', 'King\'s Rock',
			'Baton Pass', 'Last Respects', 'Quick Claw', 'Razor Fang', 'Shed Tail',
			'Drizzle', 'Drought', 'Light Clay', 
		],
		unbanlist: ['Battle Bond', 'Greninja-Bond', 'Light of Ruin'],
	},
	{
		name: "[Gen 9] A Golden Experience RU",
		desc: `A fun metagame where we try to make everything viable, or at least usable. We also have new Fakemons!`,
		mod: 'gen9agoldenexperience',
		ruleset: ['Standard NatDex', 'Terastal Clause', 'Z-Move Clause'],
		banlist: [
			'Uber', 'AG', 'OU', 'UUBL', 'UU', 'RUBL', 'Moody', 'Power Construct', 'King\'s Rock',
			'Baton Pass', 'Last Respects', 'Quick Claw', 'Razor Fang', 'Shed Tail',
			'Drizzle', 'Drought', 'Light Clay', 
		],
		unbanlist: ['Battle Bond', 'Greninja-Bond', 'Light of Ruin'],
	},
	{
		name: "[Gen 9] A Golden Experience NU",
		desc: `A fun metagame where we try to make everything viable, or at least usable. We also have new Fakemons!`,
		mod: 'gen9agoldenexperience',
		ruleset: ['Standard NatDex', 'Terastal Clause', 'Z-Move Clause'],
		banlist: [
			'Uber', 'AG', 'OU', 'UUBL', 'UU', 'RUBL', 'RU', 'NUBL', 'Moody', 'Power Construct', 'King\'s Rock',
			'Baton Pass', 'Last Respects', 'Quick Claw', 'Razor Fang', 'Shed Tail',
			'Drizzle', 'Drought', 'Light Clay', 
			'Dante\'s Inferno', 'Happy Dance', 'Sticky Web', 
		],
		unbanlist: ['Battle Bond', 'Greninja-Bond', 'Light of Ruin'],
	},
	{
		name: "[Gen 9] A Golden Experience PU",
		desc: `A fun metagame where we try to make everything viable, or at least usable. We also have new Fakemons!`,
		mod: 'gen9agoldenexperience',
		ruleset: ['Standard NatDex', 'Terastal Clause', 'Z-Move Clause'],
		banlist: [
			'Uber', 'AG', 'OU', 'UUBL', 'UU', 'RUBL', 'RU', 'NUBL', 'NU', 'PUBL', 'Moody', 'Power Construct', 'King\'s Rock',
			'Baton Pass', 'Last Respects', 'Quick Claw', 'Razor Fang', 'Shed Tail',
			'Drizzle', 'Drought', 'Light Clay', 
			'Dante\'s Inferno', 'Happy Dance', 'Sticky Web', 
		],
		unbanlist: ['Battle Bond', 'Greninja-Bond', 'Light of Ruin'],
	},
	{
		name: "[Gen 9] A Golden Experience Doubles",
		desc: `A fun metagame where we try to make everything viable, or at least usable. We also have new Fakemons!`,
		mod: 'gen9agoldenexperience',
		gameType: 'doubles',
		teambuilderFormat: 'National Dex Doubles',
		ruleset: ['Standard Doubles', 'NatDex Mod', 'Evasion Abilities Clause', 'Terastal Clause', 'Z-Move Clause'],
		banlist: [
			'DUber', 'Commander', 'Power Construct', 'Coaching', 'Dark Void', 'Swagger',
		],
		unbanlist: ['Battle Bond', 'Greninja-Bond', 'Light of Ruin'],
	},

	// AGE Other Metagames
	///////////////////////////////////////////////////////////////////

	{
		section: "AGE Other Metagames",
		column: 2,
	},
	{
		name: "[Gen 9] Almost Any Ability A Golden Experience",
		desc: `Pok&eacute;mon have access to almost any ability.`,
		mod: 'gen9agoldenexperience',
		// searchShow: false,
		ruleset: ['Standard NatDex', '!Obtainable Abilities', 'Ability Clause = 2', '!Sleep Clause Mod', 'Sleep Moves Clause', 'Terastal Clause'],
		banlist: [
			'Alakazam-Mega', 'Arceus', 'Archeops', 'Baxcalibur', 'Blacephalon', 'Blastoise-Mega', 'Blaziken-Mega', 'Calyrex-Ice', 'Calyrex-Shadow', 'Ceruledge', 'Chien-Pao', 'Darkrai', 'Deoxys-Attack',
			'Deoxys-Normal', 'Dialga', 'Dialga-Origin', 'Dracovish', 'Dragapult', 'Enamorus-Incarnate', 'Eternatus', 'Flutter Mane', 'Gengar-Mega', 'Giratina', 'Giratina-Origin', 'Gouging Fire', 'Groudon', 'Ho-Oh',
			'Hoopa-Unbound', 'Iron Boulder', 'Iron Bundle', 'Iron Valiant', 'Kangaskhan-Mega', 'Kartana', 'Keldeo', 'Kingambit', 'Koraidon', 'Kyogre', 'Kyurem', 'Kyurem-Black', 'Kyurem-White', 'Lucario-Mega', 'Lugia',
			'Lunala', 'Magearna', 'Marshadow', 'Melmetal', 'Mewtwo', 'Miraidon', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Noivern', 'Palkia', 'Palkia-Origin', 'Pheromosa', 'Raging Bolt', 'Rayquaza',
			'Regigigas', 'Reshiram', 'Salamence-Mega', 'Shaymin-Sky', 'Shedinja', 'Slaking', 'Sneasler', 'Solgaleo', 'Spectrier', 'Urshifu', 'Urshifu-Rapid-Strike', 'Weavile', 'Xerneas', 'Xurkitree', 'Yveltal', 'Zacian',
			'Zacian-Crowned', 'Zekrom', 'Zeraora', 'Zygarde-50%', 'Comatose', 'Contrary', 'Fur Coat', 'Good as Gold', 'Explosive', 'Gorilla Tactics', 'Huge Power', 'Hydrophilic', 'Ice Scales', 'Illusion', 'Imposter', 'Innards Out',
			'Intrepid Sword', 'Light Power', 'Magic Bounce', 'Magnet Pull', 'Moody', 'Neutralizing Gas', 'Orichalcum Pulse', 'Parental Bond', 'Poison Heal', 'Pure Power', 'Rickroll', 'Shadow Tag', 'Simple', 'Speed Boost', 'Stakeout', 
			'Strong Will', 'Triage', 'Unburden', 'Water Bubble', 'Wonder Guard', 'Wonder Skin', 'King\'s Rock', 'Light Clay', 'Baton Pass', 'Electrify', 'Last Respects', 'Shed Tail',
		],
		unbanlist: ['Battle Bond', 'Greninja-Bond', 'Light of Ruin'],
	},
	{
		name: "[Gen 9] Balanced Hackmons A Golden Experience",
		desc: `Anything directly hackable onto a set (EVs, IVs, forme, ability, item, and move) and is usable in local battles is allowed.`,
		mod: 'gen9agoldenexperience',
		// searchShow: false,
		ruleset: [
			'Standard AG', 'NatDex Mod', '!Obtainable',
			'Forme Clause', 'Sleep Moves Clause', 'Ability Clause = 2', 'OHKO Clause', 'Evasion Moves Clause', 'Dynamax Clause', 'CFZ Clause', 'Terastal Clause',
		],
		banlist: [
			'Cramorant-Gorging', 'Calyrex-Shadow', 'Darmanitan-Galar-Zen', 'Eternatus-Eternamax', 'Greninja-Ash', 'Groudon-Primal', 'Rayquaza-Mega', 'Shedinja', 'Terapagos-Stellar', 
			'Contrary', 'Gorilla Tactics', 'Hadron Engine', 'Huge Power', 'Hydrophilic', 'Illusion', 'Innards Out', 'Light Power', 'Magnet Pull', 'Moody', 'Neutralizing Gas', 'Orichalcum Pulse', 'Parental Bond', 'Pure Power',
			'Stakeout', 'Water Bubble', 'Wonder Guard', 'Berserk Gene', 'Belly Drum', 'Bolt Beak', 'Ceaseless Edge', 'Chatter', 'Double Iron Bash', 'Electrify', 'Imprison',
			'Last Respects', 'Octolock', 'Rage Fist', 'Revival Blessing', 'Sappy Seed', 'Shed Tail', 'Shell Smash', 'Sleep Talk',
		],
		restricted: ['Arceus'],
		onValidateTeam(team, format) {
			// baseSpecies:count
			const restrictedPokemonCount = new this.dex.Multiset<string>();
			for (const set of team) {
				const species = this.dex.species.get(set.species);
				if (!this.ruleTable.isRestrictedSpecies(species)) continue;
				restrictedPokemonCount.add(species.baseSpecies);
			}
			for (const [baseSpecies, count] of restrictedPokemonCount) {
				if (count > 1) {
					return [
						`You are limited to one ${baseSpecies} forme.`,
						`(You have ${count} ${baseSpecies} forme${count === 1 ? '' : 's'}.)`,
					];
				}
			}
		},
	},
	{
		name: "[Gen 9] Mix and Mega A Golden Experience",
		desc: `Mega evolve any Pok&eacute;mon with any mega stone, or transform them with Genesect Drives, Primal orbs, Origin orbs, Rusted items, Ogerpon Masks, Arceus Plates, and Silvally Memories with no limit. Mega and Primal boosts based on form changes from gen 7.`,
		mod: 'mixandmegaage',
		ruleset: ['Standard NatDex', 'Terastal Clause'],
		banlist: [
			'Calyrex-Shadow', 'Koraidon', 'Miraidon', 'Moody', 'Beedrillite', 'Blazikenite', 
			'Kangaskhanite', 'Malamarite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Red Orb', 'Starminite', 'Baton Pass', 'Shed Tail',
		],
		unbanlist: ['Battle Bond', 'Greninja-Bond', 'Light of Ruin'],
		restricted: [
			'Arceus', 'Basculegion-M', 'Calyrex-Ice', 'Deoxys-Normal', 'Deoxys-Attack', 'Dialga', 'Eternatus', 'Flutter Mane',
			'Gengar', 'Gholdengo', 'Giratina', 'Gouging Fire', 'Groudon', 'Ho-Oh', 'Iron Bundle', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia',
			'Lunala', 'Manaphy', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Pheromosa', 'Rayquaza', 'Regigigas', 'Reshiram',
			'Slaking', 'Solgaleo', 'Ursaluna-Bloodmoon', 'Urshifu-Single-Strike', 'Walking Wake', 'Xerneas', 'Yveltal', 'Zacian', 'Zekrom', 'Zygarde-Complete',
		],
		onValidateTeam(team) {
			const itemTable = new Set<ID>();
			for (const set of team) {
				const item = this.dex.items.get(set.item);
				if (!(item.forcedForme && !item.zMove) && !item.megaStone &&
					!item.isPrimalOrb && !item.name.startsWith('Rusted')) continue;
				const natdex = this.ruleTable.has('natdexmod');
				if (natdex && item.id !== 'ultranecroziumz') continue;
				const species = this.dex.species.get(set.species);
				if (species.isNonstandard && !this.ruleTable.has(`+pokemontag:${this.toID(species.isNonstandard)}`)) {
					return [`${species.baseSpecies} does not exist in gen 9.`];
				}
				if (((item.itemUser?.includes(species.name) || item.forcedForme === species.name) &&
					!item.megaStone && !item.isPrimalOrb) || (natdex && species.name.startsWith('Necrozma-') &&
						item.id === 'ultranecroziumz')) {
					continue;
				}
				if (this.ruleTable.isRestrictedSpecies(species) || this.toID(set.ability) === 'powerconstruct') {
					return [`${species.name} is not allowed to hold ${item.name}.`];
				}
				if (itemTable.has(item.id)) {
					return [
						`You are limited to one of each Mega Stone/Primal Orb/Rusted item/Origin item/Ogerpon Mask/Arceus Plate/Silvally Memory.`,
						`(You have more than one ${item.name})`,
					];
				}
				itemTable.add(item.id);
			}
		},
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			const originalSpecies = this.dex.species.get((pokemon.species as any).originalSpecies);
			if (originalSpecies.exists && pokemon.m.originalSpecies !== originalSpecies.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, originalSpecies.requiredItems?.[0] || originalSpecies.requiredItem || originalSpecies.requiredMove, '[silent]');
				const oSpecies = this.dex.species.get(pokemon.m.originalSpecies);
				if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1] ||
					oSpecies.types[0] !== pokemon.species.types[0]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			const originalSpecies = this.dex.species.get((pokemon.species as any).originalSpecies);
			if (originalSpecies.exists && pokemon.m.originalSpecies !== originalSpecies.baseSpecies) {
				this.add('-end', pokemon, originalSpecies.requiredItems?.[0] || originalSpecies.requiredItem || originalSpecies.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "[Gen 9] STABmons A Golden Experience",
		desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.`,
		mod: 'gen9agoldenexperience',
		// searchShow: false,
		ruleset: ['Standard NatDex', 'STABmons Move Legality', '!Sleep Clause Mod', 'Sleep Moves Clause', 'Terastal Clause'],
		banlist: [
			'Araquanid', 'Arceus', 'Azumarill', 'Baxcalibur', 'Blaziken-Mega', 'Basculegion', 'Basculegion-F', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao',
			'Cloyster', 'Darkrai', 'Darmanitan-Galar', 'Deoxys-Attack', 'Deoxys-Normal', 'Dialga', 'Dialga-Origin', 'Dracovish', 'Dragapult', 'Dragonite', 'Enamorus-Incarnate', 'Espathra',
			'Eternatus', 'Flutter Mane', 'Garchomp', 'Gengar-Mega', 'Genesect', 'Giratina', 'Giratina-Origin', 'Groudon', 'Gouging Fire', 'Ho-Oh', 'Iron Bundle', 
			'Kartana', 'Koraidon', 'Komala', 'Kyogre', 'Kyurem', 'Kyurem-Black', 'Kyurem-White', 'Landorus-Incarnate', 'Lilligant-Hisui', 'Lucario-Mega', 'Lugia', 'Lunala', 'Magearna',
			'Manaphy', 'Marshadow', 'Metagross-Mega', 'Mewtwo', 'Miraidon', 'Naganadel', 'Necrozma-Dusk-Mane', 'Necrozma-Dawn-Wings', 'Ogerpon-Hearthflame', 'Ogerpon-Wellspring', 'Palkia',
			'Palkia-Origin', 'Porygon-Z', 'Pheromosa', 'Rayquaza', 'Reshiram', 'Salamence-Mega', 'Silvally', 'Solgaleo', 'Spectrier', 'Tapu Koko', 'Tapu Lele', 'Terapagos',
			'Ursaluna-Bloodmoon', 'Urshifu-Single-Strike', 'Walking Wake', 'Xerneas', 'Xurkitree', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta-Crowned', 'Zekrom', 'Zoroark-Hisui',
			'Zygarde-50%', 'Moody', 'Power Construct', 'Damp Rock', 'King\'s Rock', 'Quick Claw', 'Razor Fang', 'Baton Pass', 'Last Respects',
			'Shed Tail', 'Wicked Blow', 
		],
		unbanlist: ['Battle Bond', 'Greninja-Bond', 'Light of Ruin'],
		restricted: [
			'Astral Barrage', 'Belly Drum', 'Bolt Beak', 'Chatter', 'Clangorous Soul', 'Dire Claw', 'Double Iron Bash', 'Dragon Energy', 'Electrify', 'Extreme Speed',
			'Fillet Away', 'Final Gambit', 'Fishious Rend', 'Geomancy', 'Gigaton Hammer', 'No Retreat', 'Revival Blessing', 'Shell Smash', 'Shift Gear', 'Thousand Arrows',
			'Trick-or-Treat', 'Triple Arrows', 'V-create', 'Victory Dance', 'Zippy Zap', 
		],
	},
	{
		name: "[Gen 9] Godly Gift A Golden Experience",
		desc: `Each Pok&eacute;mon receives one base stat from a God (Restricted Pok&eacute;mon) depending on its position in the team. If there is no restricted Pok&eacute;mon, it uses the Pok&eacute;mon in the first slot.`,
		mod: 'gen9agoldenexperience',
		ruleset: ['Standard NatDex', 'Terastal Clause', '!Sleep Clause Mod', 'Sleep Moves Clause', 'Godly Gift Mod', 'Mega Rayquaza Clause'],
		banlist: [
			'Blissey', 'Calyrex-Shadow', 'Chansey', 'Deoxys-Attack', 'Groudon-Primal', 'Koraidon', 'Miraidon', 'Shuckle', 'Xerneas',
			'Huge Power', 'Light Power', 'Moody', 'Pure Power', 'Swift Swim', 'King\'s Rock', 'Quick Claw', 'Assist',
			'Baton Pass', 'Last Respects', 'Shed Tail',
		],
		restricted: [
			'Arceus', 'Blaziken-Mega', 'Calyrex-Ice', 'Chi-Yu', 'Chien-Pao', 'Darmanitan-Galar', 'Deoxys-Normal', 'Deoxys-Defense', 'Deoxys-Speed', 'Dialga', 'Dialga-Origin', 'Dracovish',
			'Dragapult', 'Espathra', 'Eternatus', 'Flutter Mane', 'Gengar Mega', 'Giratina', 'Giratina-Origin', 'Groudon', 'Hawlucha', 'Ho-Oh', 'Iron Bundle', 'Kangaskhan-Mega', 'Kingambit',
			'Kyogre', 'Kyogre-Primal', 'Kyurem-Black', 'Kyurem-White', 'Lucario-Mega', 'Lugia', 'Lunala', 'Magearna', 'Marowak-Alola', 'Marshadow', 'Mawile-Mega', 'Medicham-Mega', 'Melmetal', 'Metagross-Mega',
			'Mewtwo', 'Mewtwo-Mega-X', 'Mewtwo-Mega-Y', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Palkia-Origin', 'Pheromosa', 'Pikachu', 'Rayquaza', 'Reshiram', 'Sableye-Mega',
			'Salamence-Mega', 'Serperior', 'Smeargle', 'Solgaleo', 'Spectrier', 'Swellow', 'Toxapex', 'Ursaluna', 'Ursaluna-Bloodmoon', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta-Crowned',
			'Zekrom', 'Power Construct',
		],
		unbanlist: ['Battle Bond', 'Greninja-Bond', 'Light of Ruin'],
	},
	{
		name: "[Gen 9] Camomons A Golden Experience",
		desc: `Pok&eacute;mon have their types set to match their first two moves.`,
		mod: 'gen9agoldenexperience',
		ruleset: ['Standard NatDex', 'Terastal Clause', 'Camomons Mod'],
		banlist: [
			'Arceus', 'Baxcalibur', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Darkrai', 'Deoxys-Normal', 'Deoxys-Attack', 'Dialga', 'Dialga-Origin', 'Dragonite', 'Drednaw',
			'Enamorus-Incarnate', 'Espathra', 'Eternatus', 'Flutter Mane', 'Giratina', 'Giratina-Origin', 'Gouging Fire', 'Groudon', 'Ho-Oh', 'Iron Bundle', 'Kommo-o', 'Koraidon', 'Kyogre',
			'Kyurem', 'Kyurem-Black', 'Kyurem-White', 'Landorus-Incarnate', 'Lugia', 'Lunala', 'Magearna', 'Manaphy', 'Mewtwo', 'Miraidon', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palafin', 'Palkia', 'Palkia-Origin', 'Pheromosa', 'Rayquaza', 'Reshiram', 'Roaring Moon', 'Shaymin-Sky', 'Sneasler', 'Solgaleo', 'Spectrier', 'Tornadus-Therian', 'Ursaluna-Bloodmoon',
			'Volcarona', 'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta-Crowned', 'Zekrom', 'Zygarde-50', 'Moody', 'Booster Energy', 'King\'s Rock', 'Light Clay', 'Razor Fang',
			'Baton Pass', 'Last Respects', 'Shed Tail',
		],
		unbanlist: ['Battle Bond', 'Greninja-Bond', 'Light of Ruin'],
	},
	{
		name: "[Gen 9] Convergence A Golden Experience",
		desc: `Allows all Pok&eacute;mon that have identical types to share moves and abilities.`,
		mod: 'gen9agoldenexperience',
		searchShow: false,
		ruleset: ['Standard NatDex', 'Convergence Legality', 'Terastal Clause', '!Obtainable Abilities'],
		banlist: [
			'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Darkrai', 'Deoxys-Normal', 'Deoxys-Attack', 'Deoxys-Speed', 'Dialga', 'Dialga-Origin',
			'Dondozo', 'Eternatus', 'Flutter Mane', 'Gardevoir-Mega', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-oh', 'Inteleon', 'Iron Bundle', 'Iron Hands', 'Koraidon', 'Kyogre',
			'Kyurem-Black', 'Kyurem-White', 'Lilligant-Hisui', 'Lugia', 'Lunala', 'Magearna', 'Manaphy', 'Mewtwo', 'Miraidon', 'Necrozma-Dawn-Wings',
			'Necrozma-Dusk-Mane', 'Ogerpon-Hearthflame', 'Palafin', 'Palkia', 'Palkia-Origin', 'Pheromosa', 'Rayquaza', 'Regigigas', 'Reshiram', 
			'Solgaleo', 'Slaking', 'Smeargle', 'Spectrier', 'Urshifu-Single-Strike', 'Urshifu-Rapid-Strike', 'Walking Wake', 'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta',
			'Zamazenta-Crowned', 'Zekrom', 'Zygarde-50', 'Comatose', 'Contrary', 'Drizzle', 'Gorilla Tactics', 'Huge Power', 'Imposter', 'Moody', 'Pure Power', 'Speed Boost', 'Unburden',
			'Heat Rock', 'King\'s Rock', 'Light Clay', 'Light Power', 'Razor Fang', 'Baton Pass', 'Boomburst', 'Extreme Speed', 'Last Respects', 'Population Bomb', 'Quiver Dance',
			'Rage Fist', 'Shed Tail', 'Shell Smash', 'Spore', 'Transform',
		],
		unbanlist: ['Battle Bond', 'Greninja-Bond', 'Light of Ruin'],
	},
	{
		name: "[Gen 9] Pokebilities A Golden Experience",
		desc: `Pok&eacute;mon have all of their released abilities simultaneously.`,
		mod: 'pokebilitiesage',
		ruleset: ['Standard NatDex', 'Sleep Moves Clause', 'Terastal Clause'],
		banlist: [
			'Arceus', 'Basculegion', 'Basculegion-F', 'Baxcalibur', 'Braviary-Hisui', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Conkeldurr', 'Darmanitan-Galar', 'Deoxys-Normal', 
			'Deoxys-Attack', 'Dialga', 'Dialga-Origin', 'Espathra', 'Eternatus', 'Excadrill', 'Flutter Mane', 'Giratina', 'Giratina-Origin', 'Gouging Fire', 'Groudon',
			'Ho-Oh', 'Iron Bundle', 'Koraidon', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala', 'Magearna', 'Miraidon', 'Mewtwo', 'Naganadel', 'Necrozma-Dusk-Mane',
			'Necrozma-Dawn-Wings', 'Ogerpon-Hearthflame', 'Palafin', 'Palkia', 'Palkia-Origin', 'Pheromosa', 'Porygon-Z', 'Rayquaza', 'Reshiram', 'Roaring Moon', 'Solgaleo', 
			'Spectrier', 'Ursaluna-Bloodmoon', 'Urshifu-Single-Strike', 'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta-Crowned',
			'Zekrom', 'Zygarde-50', 'Moody', 'Damp Rock', 'Icy Rock', 'King\'s Rock', 'Smooth Rock', 'Baton Pass', 'Shed Tail', 
			'Last Respects',
		],
		unbanlist: ['Battle Bond', 'Greninja-Bond', 'Light of Ruin'],
		onValidateSet(set) {
			const species = this.dex.species.get(set.species);
			const unSeenAbilities = Object.keys(species.abilities)
				.filter(key => key !== 'S' && (key !== 'H' || !species.unreleasedHidden))
				.map(key => species.abilities[key as "0" | "1" | "H" | "S"])
				.filter(ability => ability !== set.ability);
			if (unSeenAbilities.length && this.toID(set.ability) !== this.toID(species.abilities['S'])) {
				for (const abilityName of unSeenAbilities) {
					const banReason = this.ruleTable.check('ability:' + this.toID(abilityName));
					if (banReason) {
						return [`${set.name}'s ability ${abilityName} is ${banReason}.`];
					}
				}
			}
		},
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				if (pokemon.ability === this.toID(pokemon.species.abilities['S'])) {
					continue;
				}
				pokemon.m.innates = Object.keys(pokemon.species.abilities)
					.filter(key => key !== 'S' && (key !== 'H' || !pokemon.species.unreleasedHidden))
					.map(key => this.toID(pokemon.species.abilities[key as "0" | "1" | "H" | "S"]))
					.filter(ability => ability !== pokemon.ability);
			}
		},
		onBeforeSwitchIn(pokemon) {
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (pokemon.hasAbility(innate)) continue;
					const effect = 'ability:' + this.toID(innate);
					pokemon.volatiles[effect] = this.initEffectState({ id: effect, target: pokemon });
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
			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				pokemon.removeVolatile(innate);
			}
			pokemon.m.innates = undefined;
		},
	},
	{
		name: "[Gen 9] Trademarked A Golden Experience",
		desc: `Sacrifice your Pok&eacute;mon's ability for a status move that activates on switch-in.`,
		mod: 'trademarkedage',
		ruleset: ['Standard NatDex', 'Sleep Moves Clause', 'Terastal Clause'],
		banlist: [
			'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Decidueye-Base', 'Deoxys-Attack', 'Deoxys-Base', 'Dialga', 'Dialga-Origin', 'Eternatus', 'Flutter Mane',
			'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Hoopa-Unbound', 'Keldeo', 'Koraidon', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala', 'Magearna',
			'Mew', 'Mewtwo', 'Miraidon', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Ogerpon-Hearthflame', 'Palkia', 'Palkia-Origin', 'Raging Bolt', 'Rayquaza', 'Reshiram',
			'Slaking', 'Smeargle', 'Solgaleo', 'Spectrier', 'Urshifu-Base', 'Weavile', 'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned', 
			'Zekrom', 'Zygarde-50', 'Moody', 'Light Clay', 'Baton Pass', 'Last Respects', 'Revival Blessing', 'Shed Tail',
		],
		restricted: [
			'Agility', 'Baneful Bunker', 'Belly Drum', 'Block', 'Burning Bulwark', 'Chilly Reception', 'Confuse Ray', 'Copycat', 'Dragon Dance', 'Detect', 'Destiny Bond',
			'Endure', 'Encore', 'Fairy Lock', 'Flatter', 'Focus Energy', 'Glare', 'Heal Bell', 'Ingrain', 'Instruct', 'Mean Look', 'move:Metronome', 'Nasty Plot', 'Parting Shot',
			'Poison Gas', 'Poison Powder', 'Protect', 'Roar', 'Silk Trap', 'Spiky Shield', 'Sleep Talk', 'Shell Smash', 'Stun Spore', 'Substitute', 'Supersonic', 'Swagger',
			'Sweet Kiss', 'Switcheroo', 'Swords Dance', 'Tail Glow', 'Tailwind', 'Taunt', 'Teeter Dance', 'Teleport', 'Thunder Wave', 'Toxic', 'Toxic Thread', 'Trick',
			'Trick Room', 'Will-O-Wisp', 'Wish', 'Whirlwind',
		],
		onValidateTeam(team, format, teamHas) {
			const problems = [];
			if (!teamHas.trademarks) return;
			for (const trademark of teamHas.trademarks.keys()) {
				if (teamHas.trademarks.get(trademark) > 1) {
					problems.push(`You are limited to 1 of each Trademark.`, `(You have ${teamHas.trademarks.get(trademark)} Pok\u00e9mon with ${trademark} as a Trademark.)`);
				}
			}
			return problems;
		},
		validateSet(set, teamHas) {
			const dex = this.dex;
			const ability = dex.moves.get(set.ability);
			if (!ability.exists) { // Not even a real move
				return this.validateSet(set, teamHas);
			}
			// Absolute trademark bans
			if (ability.category !== 'Status') {
				return [`${ability.name} is not a status move and cannot be used as a trademark.`];
			}
			// Contingent trademark bans
			if (this.ruleTable.isRestricted(`move:${ability.id}`)) {
				return [`${ability.name} is restricted from being used as a trademark.`];
			}
			if (set.moves.map(this.toID).includes(ability.id)) {
				return [`${set.name} may not use ${ability.name} as both a trademark and one of its moves simultaneously.`];
			}
			const customRules = this.format.customRules || [];
			if (!customRules.includes('!obtainableabilities')) customRules.push('!obtainableabilities');
			if (!customRules.includes('+noability')) customRules.push('+noability');

			const TeamValidator: typeof import('../sim/team-validator').TeamValidator =
				require('../sim/team-validator').TeamValidator;

			const validator = new TeamValidator(dex.formats.get(`${this.format.id}@@@${customRules.join(',')}`));
			const moves = set.moves;
			set.moves = [ability.id];
			set.ability = 'No Ability';
			let problems = validator.validateSet(set, {}) || [];
			if (problems.length) return problems;
			set.moves = moves;
			set.ability = 'No Ability';
			problems = problems.concat(validator.validateSet(set, teamHas) || []);
			set.ability = ability.id;
			if (!teamHas.trademarks) teamHas.trademarks = new this.dex.Multiset<string>();
			teamHas.trademarks.add(ability.name);
			return problems.length ? problems : null;
		},
	},
	{
		name: "[Gen 9] Free-For-All A Golden Experience",
		mod: 'gen9agoldenexperience',
		gameType: 'freeforall',
		rated: false,
		tournamentShow: false,
		ruleset: ['Standard', 'Sleep Moves Clause', '!Sleep Clause Mod', '!Evasion Items Clause'],
		banlist: [
			'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Darkrai', 'Deoxys-Normal', 'Deoxys-Attack', 'Dialga', 'Dialga-Origin',
			'Dondozo', 'Eternatus', 'Flutter Mane', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Hoopa-Unbound', 'Iron Bundle', 'Koraidon', 'Kyogre', 'Kyurem-White',
			'Lugia', 'Lunala', 'Magearna', 'Mewtwo', 'Miraidon', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Ogerpon-Hearthflame', 'Palkia',
			'Palkia-Origin', 'Rayquaza', 'Reshiram', 'Solgaleo', 'Spectrier', 'Terapagos', 'Ursaluna', 'Ursaluna-Bloodmoon', 'Urshifu', 
			'Zacian', 'Zacian-Crowned', 'Zekrom', 'Moody', 'Shadow Tag', 'Toxic Chain', 'Toxic Debris', 'Aromatic Mist', 'Baton Pass', 'Coaching',
			'Court Change', 'Decorate', 'Dragon Cheer', 'Final Gambit', 'Flatter', 'Fling', 'Floral Healing', 'Follow Me', 'Heal Pulse', 'Heart Swap', 'Last Respects',
			'Malignant Chain', 'Poison Fang', 'Rage Powder', 'Skill Swap', 'Spicy Extract', 'Swagger', 'Toxic', 'Toxic Spikes',
		],
		unbanlist: ['Battle Bond', 'Greninja-Bond', 'Light of Ruin'],
	},

	// Touhoumons
	///////////////////////////////////////////////////////////////////

	{
		section: "Touhoumons",
	},
	{
		name: "[Gen 9] Touhoumons",
		desc: `2hu`,
		mod: 'gen9toho',
		ruleset: ['Standard NatDex', '!Sleep Clause Mod', 'Terastal Clause', 'Z-Move Clause', 'Data Preview'],
		banlist: ['Bug Gem', 'Dark Gem', 'Dragon Gem', 'Electric Gem', 'Fairy Gem', 'Fighting Gem', 'Fire Gem', 'Flying Gem', 'Ghost Gem', 'Grass Gem', 'Ground Gem', 'Ice Gem', 'Poison Gem', 'Psychic Gem', 'Rock Gem', 'Steel Gem', 'Water Gem'],
		unbanlist: ['Light of Ruin'],
		teambuilderFormat: 'National Dex',
		onValidateTeam(team, format) {
			/**@type {{[k: string]: true}} */
			for (const set of team) {
				let template = this.dex.species.get(set.species);
				if (template.tier !== 'Toho') {
					return [set.species + ' is not a Touhou character.'];
				}
				if (set.species == 'Cirno-Tanned' && set.ability !== 'Drought')
					 return ["Cirno-Tanned can only have Drought as its ability."]
				if ((set.species !== 'Cirno-Tanned' && set.species !== 'Cirno') && set.ability === 'Drought')
					 return ["Only Cirno-Tanned can have Drought as its ability."]
			}
		},
	},
	{
		name: "[Gen 9] Touhoumons Doubles",
		desc: `2hu`,
		mod: 'gen9toho',
		gameType: 'doubles',
		ruleset: ['Standard NatDex', '!Sleep Clause Mod', 'Terastal Clause', 'Z-Move Clause', 'Data Preview'],
		banlist: ['Bug Gem', 'Dark Gem', 'Dragon Gem', 'Electric Gem', 'Fairy Gem', 'Fighting Gem', 'Fire Gem', 'Flying Gem', 'Ghost Gem', 'Grass Gem', 'Ground Gem', 'Ice Gem', 'Poison Gem', 'Psychic Gem', 'Rock Gem', 'Steel Gem', 'Water Gem'],
		unbanlist: ['Light of Ruin'],
		teambuilderFormat: 'National Dex',
		onValidateTeam(team, format) {
			/**@type {{[k: string]: true}} */
			for (const set of team) {
				let template = this.dex.species.get(set.species);
				if (template.tier !== 'DToho') {
					return [set.species + ' is not a Touhou character.'];
				}
				if (set.species == 'Cirno-Tanned' && set.ability !== 'Drought')
					 return ["Cirno-Tanned can only have Drought as its ability."]
				if ((set.species !== 'Cirno-Tanned' && set.species !== 'Cirno') && set.ability === 'Drought')
					 return ["Only Cirno-Tanned can have Drought as its ability."]
			}
		},
	},
];
