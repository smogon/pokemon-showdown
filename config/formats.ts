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

	// Pkmn Yesterday/Tomorrow Singles
	///////////////////////////////////////////////////////////////////

	{
		section: "Pkmn Yesterday/Tomorrow Singles",
	},
	{
		name: "[Gen 8] OU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3672210/">OU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3672556/">OU Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3674058/">OU Viability Rankings</a>`,
		],

		mod: 'gen8',
		ruleset: ['Standard'],
		banlist: ['AG', 'Arena Trap', 'Power Construct', 'Shadow Tag'],
	},
	{
		name: "[Gen 8] OU (Blitz)",

		mod: 'gen8',
		ruleset: ['[Gen 8] OU', 'Blitz'],
	},
	{
		name: "[Gen 8] Anything Goes",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3672172/">AG Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3675040/">AG Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3672899/">AG Viability Rankings</a>`,
		],

		mod: 'gen8',
		ruleset: ['Obtainable', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 8] UU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3681331/">UU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3679621/">UU Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3674793/">UU Viability Rankings</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] OU'],
		banlist: ['OU', 'UUBL', 'Light Clay'],
	},
	{
		name: "[Gen 8] RU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3687060/">RU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3661013/">RU Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3676023/">RU Viability Rankings</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] UU'],
		banlist: ['UU', 'RUBL'],
	},
	{
		name: "[Gen 8] NU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3687023/">NU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3673598/">NU Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3676265/">NU Viability Rankings</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] RU'],
		banlist: ['RU', 'NUBL', 'Drizzle', 'Drought', 'Snow Warning'],
	},
	{
		name: "[Gen 8] PU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3686048/">PU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3676106/">PU Viability Rankings</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] NU'],
		banlist: ['NU', 'PUBL'],
	},
	{
		name: "[Gen 8] LC",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656348/">LC Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3661419/">LC Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657374/">LC Viability Rankings</a>`,
		],

		mod: 'gen8',
		ruleset: ['Little Cup', 'Standard', 'Dynamax Clause'],
		banlist: [
			'Corsola-Galar', 'Cutiefly', 'Drifloon', 'Gastly', 'Gothita', 'Rufflet', 'Scyther', 'Sneasel', 'Swirlix', 'Tangela', 'Vullaby', 'Vulpix-Alola', 'Woobat',
			'Chlorophyll', 'Moody', 'Baton Pass',
		],
	},
	{
		name: "[Gen 8] ZU",
		desc: `The unofficial usage-based tier below PU.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3687415/">ZU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3680071/">ZU Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3678037/">ZU Viability Rankings</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] PU'],
		banlist: ['PU', 'Centiskorch', 'Drampa', 'Exeggutor-Alola', 'Gallade', 'Haunter', 'Magmortar', 'Magneton', 'Omastar', 'Turtonator', 'Vikavolt', 'Silvally-Dragon', 'Silvally-Ground', 'Sneasel', 'Damp Rock', 'Grassy Seed'],
	},
	{
		name: "[Gen 8] Custom Game",

		mod: 'gen8',
		searchShow: false,
		debug: true,
		battle: {trunc: Math.trunc},
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},

	// Pkmn Yesterday/Tomorrow Doubles
	///////////////////////////////////////////////////////////////////

	{
		section: "Pkmn Yesterday/Tomorrow Doubles",
	},
	{
		name: "[Gen 8] Doubles OU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3689189/">Doubles OU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3658826/">Doubles OU Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3673519/">Doubles OU Viability Rankings</a>`,
		],

		mod: 'gen8',
		gameType: 'doubles',
		ruleset: ['Standard Doubles', 'Dynamax Clause', 'Swagger Clause'],
		banlist: ['DUber', 'Power Construct', 'Shadow Tag'],
	},
	{
		name: "[Gen 8] Doubles Ubers",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3661142/">Doubles Ubers</a>`,
		],

		mod: 'gen8',
		gameType: 'doubles',
		ruleset: ['Standard Doubles', '!Gravity Sleep Clause'],
		banlist: [],
	},
	{
		name: "[Gen 8] Doubles UU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3658504/">Doubles UU</a>`,
		],

		mod: 'gen8',
		gameType: 'doubles',
		ruleset: ['[Gen 8] Doubles OU'],
		banlist: ['DOU', 'DBL'],
	},
	{
		name: "[Gen 8] Doubles Custom Game",

		mod: 'gen8',
		gameType: 'doubles',
		searchShow: false,
		battle: {trunc: Math.trunc},
		debug: true,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},

	// Other Metagames
	///////////////////////////////////////////////////////////////////

	{
		section: "Other Metagames",
		column: 2,
	},
	{
		name: "[Gen 8] Balanced Hackmons",
		desc: `Anything that can be hacked in-game and is usable in local battles is allowed.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656408/">Balanced Hackmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3659817/">BH Resources</a>`,
		],

		mod: 'gen8',
		ruleset: ['-Nonexistent', 'OHKO Clause', 'Evasion Moves Clause', 'Forme Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Dynamax Clause', 'Sleep Clause Mod', 'Endless Battle Clause'],
		banlist: [
			'Calyrex-Shadow', 'Cramorant-Gorging', 'Darmanitan-Galar-Zen', 'Eternatus-Eternamax', 'Shedinja', 'Zacian-Crowned',
			'Arena Trap', 'Contrary', 'Gorilla Tactics', 'Huge Power', 'Illusion', 'Innards Out', 'Intrepid Sword', 'Libero',
			'Magnet Pull', 'Moody', 'Neutralizing Gas', 'Parental Bond', 'Protean', 'Pure Power', 'Shadow Tag', 'Stakeout',
			'Water Bubble', 'Wonder Guard', 'Comatose + Sleep Talk', 'Bolt Beak', 'Double Iron Bash', 'Octolock', 'Shell Smash',
			'Rusted Sword',
		],
		onChangeSet(set) {
			const item = this.dex.toID(set.item);
			if (set.species === 'Zacian' && item === 'rustedsword') {
				set.species = 'Zacian-Crowned';
				set.ability = 'Intrepid Sword';
				const ironHead = set.moves.indexOf('ironhead');
				if (ironHead >= 0) {
					set.moves[ironHead] = 'behemothblade';
				}
			}
			if (set.species === 'Zamazenta' && item === 'rustedshield') {
				set.species = 'Zamazenta-Crowned';
				set.ability = 'Dauntless Shield';
				const ironHead = set.moves.indexOf('ironhead');
				if (ironHead >= 0) {
					set.moves[ironHead] = 'behemothbash';
				}
			}
		},
	},
	{
		name: "[Gen 8] Free-For-All",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3681641/">Free-For-All</a>`,
		],

		mod: 'gen8',
		gameType: 'freeforall',
		rated: false,
		tournamentShow: false,
		ruleset: ['Standard Doubles', 'Sleep Clause Mod', 'Dynamax Clause', '!Gravity Sleep Clause'],
		banlist: [
			'Calyrex-Ice', 'Calyrex-Shadow', 'Dialga', 'Eternatus', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White',
			'Lugia', 'Lunala', 'Magearna', 'Marshadow', 'Mewtwo', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Rayquaza', 'Reshiram',
			'Solgaleo', 'Urshifu-Base', 'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 'Zygarde-Complete',
			'Moody', 'Power Construct', 'Acupressure', 'Aromatic Mist', 'Baton Pass', 'Coaching', 'Court Change', 'Decorate', 'Flatter', 'Floral Healing',
			'Follow Me', 'Heal Pulse', 'Rage Powder', 'Swagger',
		],
		onValidateTeam(team) {
			const itemTable = new Set<ID>();
			for (const set of team) {
				const item = this.dex.items.get(set.item);
				if (!item?.megaStone) continue;
				const species = this.dex.species.get(set.species);
				if (species.isNonstandard) return [`${species.baseSpecies} does not exist in gen 8.`];
				if (this.ruleTable.isRestrictedSpecies(species) || this.toID(set.ability) === 'powerconstruct') {
					return [`${species.name} is not allowed to hold ${item.name}.`];
				}
				if (itemTable.has(item.id)) {
					return [`You are limited to one of each mega stone.`, `(You have more than one ${item.name})`];
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
			// @ts-ignore
			const oMegaSpecies = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaSpecies.exists && pokemon.m.originalSpecies !== oMegaSpecies.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaSpecies.requiredItem || oMegaSpecies.requiredMove, '[silent]');
				const oSpecies = this.dex.species.get(pokemon.m.originalSpecies);
				if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			// @ts-ignore
			const oMegaSpecies = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaSpecies.exists && pokemon.m.originalSpecies !== oMegaSpecies.baseSpecies) {
				this.add('-end', pokemon, oMegaSpecies.requiredItem || oMegaSpecies.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "[Gen 8] Pure Hackmons",
		desc: `Anything that can be hacked in-game and is usable in local battles is allowed.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656851/">Pure Hackmons</a>`,
		],

		mod: 'gen8',
		searchShow: false,
		ruleset: ['-Nonexistent', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Endless Battle Clause'],
	},
	{
		name: "[Gen 8] Shared Power",
		desc: `Once a Pok&eacute;mon switches in, its ability is shared with the rest of the team.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3660877/">Shared Power</a>`,
		],

		mod: 'sharedpower',
		searchShow: false,
		ruleset: ['Standard', 'Dynamax Clause'],
		banlist: [
			'Calyrex-Ice', 'Calyrex-Shadow', 'Darmanitan-Galar', 'Dialga', 'Dracovish', 'Eternatus', 'Genesect', 'Giratina',
			'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala', 'Magearna',
			'Marshadow', 'Melmetal', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia',
			'Pheromosa', 'Rayquaza', 'Reshiram', 'Shedinja', 'Solgaleo', 'Urshifu-Base', 'Urshifu-Rapid-Strike',
			'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom',
			'Arena Trap', 'Contrary', 'Drizzle ++ Swift Swim', 'Drought ++ Chlorophyll', 'Electric Surge ++ Surge Surfer',
			'Fur Coat', 'Guts', 'Harvest', 'Huge Power', 'Imposter', 'Innards Out', 'Libero', 'Magic Bounce', 'Magic Guard',
			'Magnet Pull', 'Mold Breaker', 'Moody', 'Neutralizing Gas', 'Power Construct', 'Queenly Majesty', 'Quick Draw',
			'Regenerator', 'Sand Rush', 'Sand Veil', 'Shadow Tag', 'Simple', 'Snow Cloak', 'Snow Warning ++ Slush Rush', 'Speed Boost',
			'Stakeout', 'Steelworker ++ Steely Spirit', 'Tinted Lens', 'Triage', 'Unaware', 'Unburden', 'Water Bubble',
			'Baton Pass',
		],
		getSharedPower(pokemon) {
			const sharedPower = new Set<string>();
			for (const ally of pokemon.side.pokemon) {
				if (ally.previouslySwitchedIn > 0) {
					if (pokemon.battle.dex.currentMod !== 'sharedpower' && ['trace', 'mirrorarmor'].includes(ally.baseAbility)) {
						sharedPower.add('noability');
						continue;
					}
					sharedPower.add(ally.baseAbility);
				}
			}
			sharedPower.delete(pokemon.baseAbility);
			return sharedPower;
		},
		onBeforeSwitchIn(pokemon) {
			let format = this.format;
			if (!format.getSharedPower) format = this.dex.formats.get('gen8sharedpower');
			for (const ability of format.getSharedPower!(pokemon)) {
				const effect = 'ability:' + ability;
				pokemon.volatiles[effect] = {id: this.toID(effect), target: pokemon};
				if (!pokemon.m.abils) pokemon.m.abils = [];
				if (!pokemon.m.abils.includes(effect)) pokemon.m.abils.push(effect);
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			let format = this.format;
			if (!format.getSharedPower) format = this.dex.formats.get('gen8sharedpower');
			for (const ability of format.getSharedPower!(pokemon)) {
				if (ability === 'noability') {
					this.hint(`Mirror Armor and Trace break in Shared Power formats that don't use Shared Power as a base, so they get removed from non-base users.`);
				}
				const effect = 'ability:' + ability;
				delete pokemon.volatiles[effect];
				pokemon.addVolatile(effect);
			}
		},
	},
];
