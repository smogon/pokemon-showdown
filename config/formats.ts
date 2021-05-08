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

import {Utils} from '../lib';

export const Formats: FormatList = [

	

// Smogon Formats
	///////////////////////////////////////////////////////////////////
	{
		section: "Smogon Tiers"
	},
	{
		name: "[Gen 1] OU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3572352/">RBY OU Viability Ranking</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3650478/#post-8133786">RBY Sample Teams</a>`,
			`&bullet; <a href="https://pastebin.com/raw/gLahC72J">RoA Sample Teams</a>`,
		],

		mod: 'gen1',
		ruleset: ['Standard'],
	},
	{
		name: "[Gen 1] Tradebacks OU",
		desc: `RBY OU with movepool additions from the Time Capsule.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/articles/rby-tradebacks-ou">Tradeback Information</a>`,
			`&bullet; <a href="https://rby2k20.com/read.php?article=Guides/TradebacksIntro">Introduction to RBY 1U</a>`,
			`&bullet; <a href="https://www.smogon.com/rb/articles/tradebacks">Old Article</a>`,
			`&bullet; <a href="https://rby2k20.com/teams.php?tag=rby1u">Sample Teams</a>`,
		],

		mod: 'gen1',
		searchShow: false,
		ruleset: ['Obtainable', 'Allow Tradeback', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Cancel Mod', 'Desync Clause Mod'],
		banlist: ['Uber'],
	},
	{
		name: "[Gen 1] Ubers",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/posts/8286283/">RBY Ubers</a>`,
			`&bullet; <a href="https://pastebin.com/raw/WwmEsYKE">RoA Sample Teams</a>`,
		],

		mod: 'gen1',
		ruleset: ['Standard'],
	},
	{
		name: "[Gen 1] UU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3573896/">RBY UU General Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3647713/">RBY UU Viability Ranking</a>`,
			`&bullet; <a href="https://pastebin.com/raw/L35vWcgi">RoA Sample Teams</a>`,
		],

		mod: 'gen1',
		ruleset: ['[Gen 1] OU'],
		banlist: ['OU', 'UUBL'],
	},
	{
		name: "[Gen 1] NU (Alpha)",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/rby-nu-pre-alph-viability-ranking.3668913/">RBY NU Alpha Viability Rankings</a>`,
			`&bullet; <a href="https://pastebin.com/raw/7YeeFAEe">RoA Sample Teams</a>`,
		],

		mod: 'gen1',
		ruleset: ['[Gen 1] OU'],
		banlist: ['OU', 'UUBL', 'NU', 'NUBL'],
	},
	{
		name: "[Gen 1] Stadium OU",

		mod: 'gen1stadium',
		ruleset: ['Standard', 'Team Preview'],
		banlist: ['Uber',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember',
		],
	},
	{
		section: "Pet Mods"
	},
	{
		name: "[Gen 1] Violet Version",
		desc: `A balance mod for Gen 1, with the aim of expanding RBY OU while still allowing standard teams to be usable. Team Preview is on.`,
		threads: [
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/an-introduction-to-violet-a-modified-rby-metagame.4839/">Introduction to Violet</a>`,
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/violet-version-viability-rankings.3756/">Viability Rankings</a>`,
			`&bullet; <a href="https://rby2k20.com/teams.php?tag=violet">Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/violet-version-gen-1-mod-playable.3532433/">Smogon Thread</a>`,
			`&bullet; <a href="https://rby2k20.com/pokedex.php?meta=violet">Strategy Dex</a>`,
		],

		mod: 'violet',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: ['Uber', 'OU', 'UUBL', 'UU', 'NUBL', 'NU', 'NFE', 'LC'],
		unbanlist: ['Aerodactyl', 'Alakazam', 'Arbok', 'Articuno', 'Beedrill', 'Blastoise', 'Butterfree', 'Chansey', 'Charizard', 'Cloyster', 'Dragonite', 'Dugtrio', 'Electabuzz', 'Electrode', 'Exeggutor', 'Flareon', 'Gengar', 'Golbat', 'Golduck', 'Golem', 'Gyarados', 'Hypno', 'Jynx', 'Kabutops', 'Machamp', 'Magmar', 'Magneton', 'Mew', 'Moltres', 'Muk', 'Nidoqueen', 'Ninetales', 'Parasect', 'Pidgeot', 'Pinsir', 'Poliwrath', 'Porygon', 'Slowbro', 'Snorlax', 'Starmie', 'Tangela', 'Tauros', 'Vileplume', 'Zapdos'],
	},
	{
      name: "[Gen 1] Rose Red / Iris Blue",
      desc: `A balance mod for Gen 1 that aims to make every fully evolved Pokemon a viable pick in OU, while still maintaining their identity. Many moves are also reworked. Team Preview is on.`,
      threads: [
      		`&bullet; <a href="https://www.smogon.com/forums/threads/gen-1-rose-red-iris-blue.3652237/">Rose Red / Iris Blue</a>`,
				`&bullet; <a href="https://rby2k20.com/pokedex.php?meta=rrib">Strategy Dex</a>`],
		mod: 'roseredirisblue',
		ruleset: ['Standard', 'Team Preview'],
	},
	{
		name: "[Gen 1] Rose Red / Iris Blue Expanded",
        	desc: `A balance mod for Gen 1 that adds select future-generation Pokemon.`,
        	threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/gen-1-rose-red-iris-blue.3652237/">Rose Red / Iris Blue</a>`,
		],
        	mod: 'roseredirisblue',
       		ruleset: ['Standard', 'Team Preview'],
		unbanlist: ['Ampharos', 'Forretress', 'Seviper', 'Zangoose', 'Gogoat', 'Breloom', 'Sceptile'],
    	},
	{
		name: "[Gen 1] The Pokedex Redone",
		desc: `An RBY-centered mod that reconstructs the Pokedex.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/gen-1-the-pok%C3%A9dex-redone-playable-on-dragon-heaven.3652979/">Pet Mod Thread</a>`,
			`&bullet; <a href="https://docs.google.com/spreadsheets/d/1m-tpPOZ1teO9XUxaq7BYiwzn8LWG_BwM02D-Javhyoc/edit?usp=sharing">Spreadsheet</a>`,
		],

		mod: 'gen1tpr',
		ruleset: ['Standard'],
		banlist: ['Uber'],
	},

	// Nintendo Cup
	///////////////////////////////////////////////////////////////////
	{
		section: "Nintendo Cup",
		column: 2,
	},
	{
		name: "[Gen 1] Nintendo Cup 1997",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3682412/">Nintendo Cup 1997 Discussion &amp; Resources</a>`,
		],

		mod: 'gen1jpn',
		searchShow: false,
		ruleset: [
			'Picked Team Size = 3', 'Min Level = 50', 'Max Level = 55', 'Max Total Level = 155',
			'Obtainable', 'Team Preview', 'Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'HP Percentage Mod', 'Cancel Mod', 'Nintendo Cup 1997 Move Legality',
		],
		banlist: ['Uber'],
	},
    	{
        	name: "[Gen 1] Nintendo Cup 98",
        	desc: `Nintendo Cup that only allowed specific in-game Pokemon, played on Stadium. All Pokemon are L30, and you can use 3 out of the 6 Pokemon you bring.`,
        	mod: 'stadium', //to-do: make a stadiumjp format. Once that's done, move this to Stadium Metagames, as it is technically a format anyway.
        	ruleset: ['Picked Team Size = 3', 'Max Level = 30', 'Obtainable', 'Team Preview', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'Exact HP Mod', 'Nickname Clause', 'Cancel Mod'],
			threads: [
				`&bullet; <a href="https://rby2k20.com/read.php?article=Guides/Stad0NC98Guide">Introduction</a>`,
				`&bullet; <a href="https://rby2k20.com/pokedex.php?meta=nc98">Strategy Dex</a>`,
			],    
	    
        	banlist: ['Uber', 'OU', 'UUBL', 'UU', 'NUBL', 'NU', 'NFE', 'LC', 'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp', 'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember'],
        	unbanlist: ['Beedrill','Fearow','Pikachu','Nidoqueen','Nidoking','Dugtrio','Primeape','Arcanine','Alakazam','Machamp','Golem','Magneton','Cloyster','Gengar','Onix','Hypno','Electrode','Exeggutor','Chansey','Kangaskhan','Starmie','Scyther','Jynx','Pinsir','Tauros','Gyarados','Lapras','Ditto','Vaporeon','Jolteon','Flareon','Aerodactyl','Snorlax'],
    	},
	{
        	name: "[Gen 1] Nintendo Cup 99",
        	desc: `The Nintendo Cup that banned Pokemon used at the Nintendo Cup Tournament at Spaceworld 1997, played on Stadium. All Pokemon are L50, and you can use 3 out of the 6 Pokemon you bring.`,
			threads: [
				`&bullet; <a href="https://rby2k20.com/read.php?article=Guides/NC99Intro">An Introduction to NC99</a>`,
				`&bullet; <a href="https://rby2k20.com/pokedex.php?meta=nc99">Strategy Dex</a>`,
				`&bullet; <a href="https://rby2k20.com/read.php?article=Guides/Stad1Crits">Critical Hits</a>`,
			],
        	mod: 'stadium', 
        	ruleset: ['Picked Team Size = 3', 'Max Level = 50', 'Obtainable', 'Team Preview', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'Exact HP Mod', 'Cancel Mod'],
        	banlist: ['Venusaur','Dugtrio','Alakazam','Golem','Magneton','Gengar','Hypno','Electrode','Exeggutor','Chansey','Kangaskhan','Starmie','Jynx','Tauros','Gyarados','Lapras','Ditto','Vaporeon','Jolteon','Snorlax','Articuno','Zapdos','Dragonite','Mewtwo','Mew','Flareon + Focus Energy + Ember','Nidoking + Fury Attack + Thrash'],
        	maxLevel: 50,
        	teamLength: {
            		validate: [3, 6],
            		battle: 3,
        	},
    	},

	// Stadium Metagames
	///////////////////////////////////////////////////////////////////
	{
		section: "Stadium Metagames",
		column: 2,
	},
	{
		name: "[Gen 1] Stadium AG",
		desc: `The Pokemon Stadium Anything Goes format, taken directly from the ruleset in-game. This means Stadium Sleep Clause and Freeze Clause are still used, as they're ran innately in-game. Tradebacks are also enabled.`,
		mod: 'stadium',
		threads: [
			`&bullet; <a href="https://www.smogon.com/articles/rby-tradebacks-ou">Tradeback Information</a>`,
			`&bullet; <a href="https://rby2k20.com/read.php?article=Guides/Stad1Crits">Critical Hits</a>`,
			],
		
		ruleset: ['Obtainable', 'Team Preview', 'Stadium Sleep Clause', 'Freeze Clause Mod', 'Nickname Clause', 'Endless Battle Clause', 'Exact HP Mod', 'Cancel Mod', 'Allow Tradeback'],
	},
	{
		name: "[Gen 1] Stadium Ubers",
		desc: `A metagame utilizing Pokemon Stadium, with all the mechanics! Sleep Clause counts Rest here to remain true to cartridge. Allows moves obtainable through the Time Capsule.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/articles/rby-tradebacks-ou">Tradeback Information</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/gen-1-and-gen-2-how-sleep-clause-works-in-the-pok%C3%A9mon-stadium-games.3661020/">Stadium Sleep Clause details (fixed)</a>`,
			`&bullet; <a href="https://rby2k20.com/read.php?article=Guides/Stad1Crits">Critical Hits</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/stadium-format-is-now-available-on-ps.3526616/">Research Thread</a>`,
		],

		mod: 'stadium',
		ruleset: ['Obtainable', 'Team Preview', 'Stadium Sleep Clause', 'Freeze Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'Exact HP Mod', 'Cancel Mod'],
		banlist: ['Uber'],
	},
	{
		name: "[Gen 1] Stadium Tradebacks OU",
		desc: `A metagame utilizing Pokemon Stadium, with all the mechanics! Sleep Clause counts Rest here to remain true to cartridge. Allows moves obtainable through the Time Capsule.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/articles/rby-tradebacks-ou">Tradeback Information</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/gen-1-and-gen-2-how-sleep-clause-works-in-the-pok%C3%A9mon-stadium-games.3661020/">Stadium Sleep Clause details (fixed)</a>`,
			`&bullet; <a href="https://rby2k20.com/read.php?article=Guides/Stad1Crits">Critical Hits</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/stadium-format-is-now-available-on-ps.3526616/">Research Thread</a>`,
		],

		mod: 'stadium',
		ruleset: ['Obtainable', 'Team Preview', 'Stadium Sleep Clause', 'Freeze Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'Exact HP Mod', 'Cancel Mod', 'Allow Tradeback'],
		banlist: ['Uber'],
	},
    	{
        	name: "[Gen 1] Poke Cup",
        	desc: `Stadium Poke Cup, a port of the Nintendo Cup 1997 format to the N64. This introduced the format to an international audience. Team preview is on, and it functions as a bring 6 pick 3 format. Pokemon going into the battle must be between levels 50 and 55, but levels must not go over 155 in total.`,
		threads: [
			`&bullet; <a href="https://rby2k20.com/pokedex.php?meta=nc97">Strategy Dex</a>`,
			`&bullet; <a href="https://rby2k20.com/read.php?article=Guides/Stad1Crits">Critical Hits</a>`,
			],    
	   
        	mod: 'stadium',
		ruleset: ['Picked Team Size = 3', 'Min Level = 50', 'Max Level = 55', 'Max Total Level = 155', 'Obtainable', 'Team Preview', 'Cup Level Limit', 'Stadium Sleep Clause', 'Freeze Clause Mod', 'Species Clause', 'Exact HP Mod', 'Nickname Clause', 'Cancel Mod'],
		banlist: ['Uber',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember',
			 'Magikarp + Dragon Rage', 'Rapidash + Pay Day', 'Fearow + Pay Day', 'Pikachu + Fly', 'Raichu + Fly'],
		},
	},
	{
        	name: "[Gen 1] Pika Cup",
        	desc: `Stadium Pika Cup, played in the Stadium World Tour in the year 2000. Any Pokemon obtainable at L20 or below can be used. It's a bring 6 pick 3 format, though Pokemon must be between L15 and L20. The total levels of participating Pokemon must not exceed L50.`,
		threads: [
			`&bullet; <a href="https://rby2k20.com/pokedex.php?meta=pika">Strategy Dex</a>`,
			`&bullet; <a href="https://rby2k20.com/read.php?article=Guides/Stad1Crits">Critical Hits</a>`,
			],
		
        	mod: 'stadium',//FIXME: Validator for moves and Pokemon is essentially removed due to level validation issues, this needs fixing on PS.
		ruleset: ['Picked Team Size = 3', 'Min Level = 15', 'Max Level = 20', 'Max Total Level = 50', 'Team Preview', 'Cup Level Limit', 'Stadium Sleep Clause', 'Freeze Clause Mod', 'Species Clause', 'Exact HP Mod', 'Nickname Clause', 'Cancel Mod'],
		banlist: ['Mew', 'Mewtwo', 
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember',
			 'Magikarp + Dragon Rage', 'Rapidash + Pay Day', 'Fearow + Pay Day', 'Pikachu + Fly', 'Raichu + Fly'],
		},
	},
	{
        	name: "[Gen 1] Petit Cup",
        	desc: `Stadium Petit Cup, played in various tournaments in the 2000s. Pokémon must be of the lowest evolutionary stage, have a height no more than 2 m (6'07") and a weight no more than 20 kg (44.1 lbs.) to compete. In addition, Pokemon must be between levels 25 and 30. It's a bring 6 pick 3 format, and participatingPokemon must not have their total levels exceed L80.`,
		threads: [
			`&bullet; <a href="https://rby2k20.com/pokedex.php?meta=petit">Strategy Dex</a>`,
			`&bullet; <a href="https://rby2k20.com/read.php?article=Guides/Stad1Crits">Critical Hits</a>`,
			],
		
        	mod: 'stadium',
		ruleset: ['Picked Team Size = 3', 'Min Level = 25', 'Max Level = 30', 'Max Total Level = 80','Obtainable', 'Team Preview', 'Cup Level Limit', 'Stadium Sleep Clause', 'Freeze Clause Mod', 'Species Clause', 'Exact HP Mod', 'Nickname Clause', 'Cancel Mod'],
		banlist: ['Mew', 'Mewtwo', 'OU', 'UUBL', 'UU', 'NUBL', 'NU', 'NFE', 'LC',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember',
			 'Magikarp + Dragon Rage', 'Rapidash + Pay Day', 'Fearow + Pay Day', 'Pikachu + Fly', 'Raichu + Fly'],
		unbanlist: ['Bulbasaur', 'Charmander', 'Squirtle', 'Caterpie', 'Weedle', 'Pidgey', 'Rattata', 'Spearow', 'Ekans', 'Pikachu', 'Sandshrew', 'Nidoran-M', 'Nidoran-F', 'Clefairy', 'Vulpix', 'Jigglypuff', 'Zubat', 'Oddish', 'Paras', 'Diglett', 'Meowth', 'Psyduck', 'Growlithe', 'Poliwag', 'Abra', 'Machop', 'Bellsprout', 'Geodude', 'Magnemite', 'Farfetchd', 'Shellder', 'Gastly', 'Krabby', 'Voltorb', 'Exeggcute', 'Cubone', 'Horsea', 'Goldeen', 'Magikarp', 'Ditto', 'Eevee', 'Omanyte', 'Kabuto', 'Dratini'],
	},
	{
		name: "[Gen 1] Prime Cup",
		desc: `Pokemon Stadium's Prime Cup format. Played in the Stadium World Tour in the year 2000. It's a bring 6 pick 3 format, with no restrictions on what can be used so long as it's legally obtainable.`,
		mod: 'stadium',
		threads: [
			`&bullet; <a href="https://rby2k20.com/read.php?article=Guides/Stad1Crits">Critical Hits</a>`,
			],
		
		ruleset: ['Picked Team Size = 3', 'Obtainable', 'Team Preview', 'Stadium Sleep Clause', 'Freeze Clause Mod', 'Species Clause', 'Nickname Clause', 'Exact HP Mod', 'Cancel Mod'],
		banlist: ['Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember',
			 'Magikarp + Dragon Rage', 'Rapidash + Pay Day', 'Fearow + Pay Day', 'Pikachu + Fly', 'Raichu + Fly'],
	},

	// Yellow Colosseum2 Metagames, in beta
	///////////////////////////////////////////////////////////////////
	{
		section: "Yellow Colosseum 2 Metagames",
		column: 2,
	},
	{
        	name: "[Gen 1] Yellow Poke Cup",
        	desc: `Yellow Poke Cup, a port of the Nintendo Cup 1997. Team preview is on, and it functions as a bring 6 pick 3 format. Pokemon going into the battle must be between levels 50 and 55, but levels must not go over 155 in total.`,
		threads: [
			`&bullet; <a href="https://rby2k20.com/pokedex.php?meta=nc97">Strategy Dex</a>`,
			],
		
       		mod: 'gen1yellow',
		ruleset: ['Picked Team Size = 3', 'Min Level = 50', 'Max Level = 55', 'Max Total Level = 155','Obtainable', 'Team Preview', 'Cup Level Limit', 'Stadium Sleep Clause', 'Species Clause', 'Nickname Clause', 'Cancel Mod'],
		banlist: ['Uber',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember',
			 'Magikarp + Dragon Rage', 'Rapidash + Pay Day', 'Fearow + Pay Day', 'Pikachu + Fly', 'Raichu + Fly'],
	},
	{
        	name: "[Gen 1] Yellow Pika Cup",
        	desc: `A variation of Pika Cup that was ported to Pokemon Yellow for the Game Boy. Any Pokemon obtainable at L20 or below can be used. It's a bring 6 pick 3 format, though Pokemon must be between L15 and L20. The total levels of participating Pokemon must not exceed L50.`,
		threads: [
		`&bullet; <a href="https://rby2k20.com/pokedex.php?meta=pika">Strategy Dex</a>`,
		],
		
        	mod: 'gen1yellow',//FIXME: Validator for moves and Pokemon is essentially removed due to level validation issues, this needs fixing on PS.
		ruleset: ['Picked Team Size = 3', 'Min Level = 15', 'Max Level = 20', 'Max Total Level = 50','Team Preview', 'Cup Level Limit', 'Stadium Sleep Clause', 'Species Clause', 'Nickname Clause', 'Cancel Mod'],
		banlist: ['Mew', 'Mewtwo', 
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember',
			 'Magikarp + Dragon Rage', 'Rapidash + Pay Day', 'Fearow + Pay Day', 'Pikachu + Fly', 'Raichu + Fly'],
	},
	{
        	name: "[Gen 1] Yellow Petit Cup",
        	desc: `A variation of Petit Cup that was ported to Pokemon Yellow for the Game Boy. Pokémon must be of the lowest evolutionary stage, have a height no more than 2 m (6'07") and a weight no more than 20 kg (44.1 lbs.) to compete. In addition, Pokemon must be between levels 25 and 30. It's a bring 6 pick 3 format, and participatingPokemon must not have their total levels exceed L80.`,
		threads: [
			`&bullet; <a href="https://rby2k20.com/pokedex.php?meta=petit">Strategy Dex</a>`,
		],
		
        	mod: 'gen1yellow',
		ruleset: ['Picked Team Size = 3', 'Min Level = 25', 'Max Level = 30', 'Max Total Level = 80','Obtainable', 'Team Preview', 'Cup Level Limit', 'Stadium Sleep Clause', 'Species Clause', 'Nickname Clause', 'Cancel Mod'],
		banlist: ['Mew', 'Mewtwo', 'OU', 'UUBL', 'UU', 'NUBL', 'NU', 'NFE', 'LC',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember',
			 'Magikarp + Dragon Rage', 'Rapidash + Pay Day', 'Fearow + Pay Day', 'Pikachu + Fly', 'Raichu + Fly'],
		unbanlist: ['Bulbasaur', 'Charmander', 'Squirtle', 'Caterpie', 'Weedle', 'Pidgey', 'Rattata', 'Spearow', 'Ekans', 'Pikachu', 'Sandshrew', 'Nidoran-M', 'Nidoran-F', 'Clefairy', 'Vulpix', 'Jigglypuff', 'Zubat', 'Oddish', 'Paras', 'Diglett', 'Meowth', 'Psyduck', 'Growlithe', 'Poliwag', 'Abra', 'Machop', 'Bellsprout', 'Geodude', 'Magnemite', 'Farfetchd', 'Shellder', 'Gastly', 'Krabby', 'Voltorb', 'Exeggcute', 'Cubone', 'Horsea', 'Goldeen', 'Magikarp', 'Ditto', 'Eevee', 'Omanyte', 'Kabuto', 'Dratini'],
	},

	// Modded Formats
	///////////////////////////////////////////////////////////////////
	//Metagames that change anything from cartridge go here. Even Smogon OMs, at least for now.
	///////////////////////////////////////////////////////////////////
	{
		section: "Modded Formats",
		column: 3,
	},
	{ 
		name: "[Gen 1] Box OU",
		desc: `Battle using up to 24 Pokemon via the Box feature in the PS Teambuilder!`,

		mod: 'gen1',
		ruleset: ['Standard', 'Max Team Size = 24'],
		banlist: ['Uber'],
	},
	{
		name: "[Gen 1] Doubles OU",
		desc: `A modified Gen 1 sim made with the intention of making Doubles possible. It uses Gen 3 Doubles Mechanics; Surf targets two opponents, you switch out immediately upon fainting, and spread move damage is halved.`,
		threads: [
			`&bullet; <a href="https://rby2k20.com/read.php?article=Guides/RBYDoublesIntro">An Introduction to RBY Doubles</a>`,
		],
		
		mod: 'gen1doubles',
		gameType: 'doubles',
		ruleset: ['Standard'],
		banlist: ['Uber', 'Wrap', 'Fire Spin', 'Clamp', 'Bind', 'Explosion', 'Self-Destruct'],
	},
	{
		name: "[Gen 1] Doubles Tradebacks OU",
		desc: `A modified Gen 1 sim made with the intention of making Doubles possible. It uses Gen 3 Doubles Mechanics; Surf targets two opponents, you switch out immediately upon fainting, and spread move damage is halved.`,
		threads: [
			`&bullet; <a href="https://rby2k20.com/read.php?article=Guides/RBYDoublesIntro">An Introduction to RBY Doubles</a>`,
		],
		
		mod: 'gen1doubles',
		gameType: 'doubles',
		ruleset: ['Standard'],
		banlist: ['Uber', 'Wrap', 'Fire Spin', 'Clamp', 'Bind', 'Explosion', 'Self-Destruct', 'Magikarp + Dragon Rage', 'Rapidash + Pay Day', 'Fearow + Pay Day', 'Pikachu + Fly', 'Raichu + Fly', 'Allow Tradeback'],
	},
	{
		name: "[Gen 1] 2v2 Doubles",
		desc: `A modified Gen 1 sim made with the intention of making Doubles possible. It uses Gen 3 Doubles Mechanics; Surf targets two opponents, you switch out immediately upon fainting, and spread move damage is halved. This utilizes a 2v2 format, where you bring 4 and pick 2.`,
		threads: [
			`&bullet; <a href="https://rby2k20.com/read.php?article=Guides/RBYDoublesIntro">An Introduction to RBY Doubles</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656321/">2v2 Doubles</a>`,
		],
		
		mod: 'gen1doubles',
		gameType: 'doubles',
		ruleset: ['Standard'],
		teamLength: {
			validate: [2, 4],
			battle: 2,
		},
		banlist: ['Uber', 'Wrap', 'Fire Spin', 'Clamp', 'Bind', 'Explosion', 'Self-Destruct'],
	},
	/*{
		name: "[Gen 3] ADV 50",
		threads: [
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/rules-discussion-thread.4222/">ADV 50 Metagame Discussion</a>`,
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/viability-rankings.4975/">ADV 50 Viability Rankings</a>`,
		],

		mod: 'gen3',
		ruleset: ['Standard'],
		banlist: ['Uber', 'OU', 'UUBL', 'UU', 'NUBL', 'NU', 'NFE', 'LC', "Mean Look"],
		unbanlist: ['Aggron', 'Altaria', 'Ampharos', 'Armaldo', 'Azumarill', 'Banette', 'Cacturne', 'Camerupt', 'Castform', 'Chimecho', 'Clefable', 'Crawdaunt', 'Crobat', 'Electrode', 'Fearow', 'Flareon', 'Forretress', 'Glalie', 'Golduck', 'Golem', 'Granbull', 'Hitmonlee', 'Huntail', 'Jumpluff', 'Kabutops', 'Kadabra', 'Lanturn', 'Manectric', 'Mantine', 'Meganium', 'Mightyena', 'Misdreavus', 'Muk', 'Nidoqueen', 'Rapidash', 'Sableye', 'Sandslash', 'Scizor', 'Scyther', 'Sharpedo', 'Shiftry', 'Slowking', 'Stantler', 'Steelix', 'Torkoal', 'Typhlosion', 'Venomoth', 'Vileplume', 'Wailord', 'Whiscash'],
	},*/
	{
		name: "[Gen 1] RBYPlus",
       		desc: `A balance mod for Gen 1 from RBY 2k10, the first of its kind, aimed to make every fully evolved Pokemon viable while drastically increasing the power level. Created by WaterWizard and the RBY 2k10 community.`,
       		threads: [
			`&bullet; <a href="https://web.archive.org/web/20150915182720/http://rby2k10.proboards.com/thread/1208/rbyplus-main">Old Info Megathread</a>`,
			`&bullet; <a href="https://web.archive.org/web/20150915020701/http://rby2k10.proboards.com/thread/1599/rbyplus-info-spreadsheet-google-drive">Pokemon Info Spreadsheet</a>`,
			`&bullet; <a href="https://web.archive.org/web/20150915021509/http://rby2k10.proboards.com/thread/535/rbyplus-moves">Move Info</a>`,
			`&bullet; <a href="https://web.archive.org/web/20140301113018/http://www.rby2k10.proboards.com/thread/1600/speed-tiers-max">Speed Tiers</a>`,
		],
        	mod: 'gen1rbyplus',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Cancel Mod'],
		unbanlist: ['Mew', 'Raichu + Surf', 'Pikachu + Surf'],
    	},
	{
		name: "[Gen 1] RBY 251",
		desc: `A Pokemon Online mod originally made by Crystal_ and ported to Pokemon Showdown by Plague von Karma. This allows Gen 2 Pokemon with changes to their movepool to be more in-tune with RBY. Gen 2 Pokemon use their Level-up moves minus RBY moves, plus customized TMs. Some even keep their signature moves!`,
		threads: [
			`&bullet; <a href="http://pokemon-online.eu/threads/18311/">Pokemon Online Thread</a>`,
			`&bullet; <a href="https://pastebin.com/1PFj9trt">Learnset Code</a>`,
			`&bullet; <a href="https://docs.google.com/spreadsheets/d/1hS_qUyl_XE6Inh1B83pbG3_pEwBuWVwODyetB-ax5Is/edit?usp=sharing">TM/HM Learnsets</a>`,
		],

		mod: 'gen1rby251',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Uber'],
		unbanlist: ['Chikorita', 'Bayleef', 'Meganium', 'Cyndaquil', 'Quilava', 'Typhlosion', 'Totodile', 'Croconaw', 'Feraligatr', 'Sentret', 'Furret', 'Hoothoot', 'Noctowl', 'Ledyba', 'Ledian', 'Spinarak', 'Ariados', 'Crobat', 'Chinchou', 'Lanturn', 'Pichu', 'Cleffa', 'Igglybuff', 'Togepi', 'Togetic', 'Natu', 'Xatu', 'Mareep', 'Flaaffy', 'Ampharos', 'Bellossom', 'Marill', 'Azumarill', 'Sudowoodo', 'Politoed', 'Hoppip', 'Skiploom', 'Jumpluff', 'Aipom', 'Sunkern', 'Sunflora', 'Yanma', 'Wooper', 'Quagsire', 'Espeon', 'Umbreon', 'Murkrow', 'Slowking', 'Misdreavus', 'Unown', 'Wobbuffet', 'Girafarig', 'Pineco', 'Forretress', 'Dunsparce', 'Gligar', 'Steelix', 'Snubbull', 'Granbull', 'Qwilfish', 'Scizor', 'Shuckle', 'Heracross', 'Sneasel', 'Teddiursa', 'Ursaring', 'Slugma', 'Magcargo', 'Swinub', 'Piloswine', 'Corsola', 'Remoraid', 'Octillery', 'Delibird', 'Mantine', 'Skarmory', 'Houndour', 'Houndoom', 'Kingdra', 'Phanpy', 'Donphan', 'Porygon2', 'Stantler', 'Smeargle', 'Tyrogue', 'Hitmontop', 'Smoochum', 'Elekid', 'Magby', 'Miltank', 'Blissey', 'Raikou', 'Entei', 'Suicune', 'Larvitar', 'Pupitar', 'Tyranitar', 'Triple Kick', 'Sacred Fire', 'Spider Web', 'Aeroblast', 'Megahorn', 'Sketch', 'Milk Drink', 'Present'],
	},
	{
		name: "[Gen 1] RBY 251 Ubers",
		desc: `A Pokemon Online mod originally made by Crystal_ and ported to Pokemon Showdown by Plague von Karma. This allows Gen 2 Pokemon with changes to their movepool to be more in-tune with RBY. Gen 2 Pokemon use their Level-up moves minus RBY moves, plus customized TMs. Some even keep their signature moves! This Uber variant allows Ho-Oh, Lugia and Celebi!`,
		threads: [
			`&bullet; <a href="http://pokemon-online.eu/threads/18311/">Pokemon Online Thread</a>`,
			`&bullet; <a href="https://pastebin.com/1PFj9trt">Learnset Code</a>`,
			`&bullet; <a href="https://docs.google.com/spreadsheets/d/1hS_qUyl_XE6Inh1B83pbG3_pEwBuWVwODyetB-ax5Is/edit?usp=sharing">TM/HM Learnsets</a>`,
		],

		mod: 'gen1rby251',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Cancel Mod'],
		unbanlist: ['Chikorita', 'Bayleef', 'Meganium', 'Cyndaquil', 'Quilava', 'Typhlosion', 'Totodile', 'Croconaw', 'Feraligatr', 'Sentret', 'Furret', 'Hoothoot', 'Noctowl', 'Ledyba', 'Ledian', 'Spinarak', 'Ariados', 'Crobat', 'Chinchou', 'Lanturn', 'Pichu', 'Cleffa', 'Igglybuff', 'Togepi', 'Togetic', 'Natu', 'Xatu', 'Mareep', 'Flaaffy', 'Ampharos', 'Bellossom', 'Marill', 'Azumarill', 'Sudowoodo', 'Politoed', 'Hoppip', 'Skiploom', 'Jumpluff', 'Aipom', 'Sunkern', 'Sunflora', 'Yanma', 'Wooper', 'Quagsire', 'Espeon', 'Umbreon', 'Murkrow', 'Slowking', 'Misdreavus', 'Unown', 'Wobbuffet', 'Girafarig', 'Pineco', 'Forretress', 'Dunsparce', 'Gligar', 'Steelix', 'Snubbull', 'Granbull', 'Qwilfish', 'Scizor', 'Shuckle', 'Heracross', 'Sneasel', 'Teddiursa', 'Ursaring', 'Slugma', 'Magcargo', 'Swinub', 'Piloswine', 'Corsola', 'Remoraid', 'Octillery', 'Delibird', 'Mantine', 'Skarmory', 'Houndour', 'Houndoom', 'Kingdra', 'Phanpy', 'Donphan', 'Porygon2', 'Stantler', 'Smeargle', 'Tyrogue', 'Hitmontop', 'Smoochum', 'Elekid', 'Magby', 'Miltank', 'Blissey', 'Raikou', 'Entei', 'Suicune', 'Larvitar', 'Pupitar', 'Tyranitar', 'Triple Kick', 'Sacred Fire', 'Spider Web', 'Aeroblast', 'Megahorn', 'Sketch', 'Milk Drink', 'Present', 'Ho-Oh', 'Lugia', 'Celebi', 'Mewtwo', 'Mew'],
	},
	{
		name: "[Gen 1] RBY 898",
        	desc: `A mod where every later-generation pokemon is available in gen 1.`,
        	threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/gen-1-rose-red-iris-blue.3652237/">Rose Red / Iris Blue</a>`,
		],
        	mod: 'retro',
       		ruleset: ['Standard', 'Team Preview', '+Past', '+Future'],
		banlist: ['Uber', 'Abomasnow-Mega', 'Absol-Mega', 'Aerodactyl-Mega', 'Aggron-Mega', 'Alakazam-Mega', 'Altaria-Mega', 'Ampharos-Mega', 'Audino-Mega', 'Banette-Mega', 'Beedrill-Mega', 'Blastoise-Mega', 'Blaziken-Mega', 'Camerupt-Mega', 'Charizard-Mega-X', 'Charizard-Mega-Y', 'Diancie-Mega', 'Gallade-Mega', 'Garchomp-Mega', 'Gardevoir-Mega', 'Gengar-Mega', 'Glalie-Mega', 'Gyarados-Mega', 'Heracross-Mega', 'Houndoom-Mega', 'Kangaskhan-Mega', 'Latias-Mega', 'Latios-Mega', 'Lopunny-Mega', 'Lucario-Mega', 'Manectric-Mega', 'Mawile-Mega', 'Medicham-Mega', 'Mewtwo-Mega-X', 'Mewtwo-Mega-Y', 'Pidgeot-Mega', 'Pinsir-Mega', 'Rayquaza-Mega', 'Sableye-Mega', 'Salamence-Mega', 'Sceptile-Mega', 'Scizor-Mega', 'Sharpedo-Mega', 'Slowbro-Mega', 'Steelix-Mega', 'Swampert-Mega', 'Tyranitar-Mega', 'Venusaur-Mega', 'Lugia', 'Ho-oh', 'Groudon', 'Groudon-Primal', 'Kyogre', 'Kyogre-Primal', 'Rayquaza', 'Dialga', 'Palkia', 'Giratina', 'Darkrai', 'Zekrom', 'Reshiram', 'Kyurem-Black', 'Kyurem-White', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Marshadow', 'Lunala', 'Naganadel', 'Necrozma-Dusk-Mane', 'Necrozma-Dawn-Wings', 'Necrozma-Ultra', 'Pheromosa', 'Shaymin-Sky', 'Solgaleo', 'Xerneas', 'Yveltal', 'Zygarde-Complete', 'Arceus', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fairy', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water', 'Calyrex-Ice', 'Calyrex-Shadow', 'Regigigas', 'Slaking', 'Regice', 'Greninja-Ash'],
    	},
	{
		name: "[Gen 1] RBY 898 Ubers",
        	desc: `A mod where every later-generation pokemon is available in gen 1.`,
        	threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/gen-1-rose-red-iris-blue.3652237/">Rose Red / Iris Blue</a>`,
		],
        	mod: 'retro',
       		ruleset: ['Team Preview', '+Past', '+Future'],
		banlist: ['Uber', 'Abomasnow-Mega', 'Absol-Mega', 'Aerodactyl-Mega', 'Aggron-Mega', 'Alakazam-Mega', 'Altaria-Mega', 'Ampharos-Mega', 'Audino-Mega', 'Banette-Mega', 'Beedrill-Mega', 'Blastoise-Mega', 'Blaziken-Mega', 'Camerupt-Mega', 'Charizard-Mega-X', 'Charizard-Mega-Y', 'Diancie-Mega', 'Gallade-Mega', 'Garchomp-Mega', 'Gardevoir-Mega', 'Gengar-Mega', 'Glalie-Mega', 'Gyarados-Mega', 'Heracross-Mega', 'Houndoom-Mega', 'Kangaskhan-Mega', 'Latias-Mega', 'Latios-Mega', 'Lopunny-Mega', 'Lucario-Mega', 'Manectric-Mega', 'Mawile-Mega', 'Medicham-Mega', 'Mewtwo-Mega-X', 'Mewtwo-Mega-Y', 'Pidgeot-Mega', 'Pinsir-Mega', 'Rayquaza-Mega', 'Sableye-Mega', 'Salamence-Mega', 'Sceptile-Mega', 'Scizor-Mega', 'Sharpedo-Mega', 'Slowbro-Mega', 'Steelix-Mega', 'Swampert-Mega', 'Tyranitar-Mega', 'Venusaur-Mega', 'Groudon-Primal', 'Kyogre-Primal', 'Kyurem-Black', 'Kyurem-White', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Necrozma-Dusk-Mane', 'Necrozma-Dawn-Wings', 'Necrozma-Ultra', 'Shaymin-Sky', 'Zygarde-Complete', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fairy', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water', 'Calyrex-Ice', 'Calyrex-Shadow', 'Greninja-Ash'],
    	},
	{
		name: "[Gen 1] Scalemons",
		desc: `All stats but HP are scaled to make a Pokemon's BST as close to 500 as possible.`,

		mod: 'gen1',
		ruleset: ['Standard', 'Scalemons Mod'],
		banlist: ['Uber', 'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember', 'Magikarp + Dragon Rage', 'Rapidash + Pay Day', 'Fearow + Pay Day', 'Pikachu + Fly', 'Raichu + Fly'],
	},
	{
		name: "[Gen 1] STABmons",
		desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656429/">STABmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3658578/">STABmons Resources</a>`,
		],

		mod: 'gen1',
		ruleset: ['Standard', 'STABmons Move Legality'],
		banlist: ['Mewtwo', 'Mew',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp', 'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember'],
		restricted: ['Spore', 'Bind', 'Clamp', 'Wrap', 'Hypnosis', 'Lovely Kiss', 'Sleep Powder', 'Sing'],
	},
	{ //FIXME: Reliablemons Mod Rule is fucked up by a TypeError.
		name: "[Gen 1] Reliablemons (Beta)",
		desc: `Each Pokemon's first 2 moves will match their type. If a Pokemon has a single type, only the first is modified.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/reliablemons.3515558/">Reliablemons</a>`,
		],
		
		mod: 'gen1',
		ruleset: ['Obtainable', 'Standard', 'Reliablemons Mod'],
		banlist: ['Uber'],
    	},
	{
		name: "[Gen 1] Camomons",
		desc: `Pok&eacute;mon change type to match their first two moves.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656413/">Camomons</a>`,
		],

		mod: 'gen1',
		ruleset: ['Obtainable', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Cancel Mod', 'Dynamax Clause', 'Sleep Clause Mod', 'Endless Battle Clause'],
		banlist: ['Mewtwo', 'Mew', 'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp', 'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember'],
		onModifySpecies(species, target, source, effect) {
			if (!target) return; // Chat command
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const types = [...new Set(target.baseMoveSlots.slice(0, 2).map(move => this.dex.getMove(move.id).type))];
			return Object.assign({}, species, {types: types});
		},
		onSwitchIn(pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
		},
		onAfterMega(pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
		},
	},
	{
		name: "[Gen 1] Inverse",
		desc: `The effectiveness of each attack is inverted, like at the Inverse House in Pokemon X and Y.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3666858/">Inverse</a>`,
		],

		mod: 'gen1',
		ruleset: ['Standard', 'Inverse Mod'],
		banlist: ['Uber', 'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp', 'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember'],
	},
	//FIXME: This doesn't work for some reason. I have a thing in rulesets.js for it, but the code breaks when used. It may be the .ts I copied it from? - Plague
	/*{
		name: "[Gen 1] Flipped",
		desc: `Every Pok&eacute;mon's stats are reversed. HP becomes Spe, Atk becomes Spc, Def stays the same.`,

		mod: 'gen1',
		ruleset: ['Standard', 'Flipped Mod'],
		banlist: ['Uber',],
	},*/
	// Hacked Formats
	///////////////////////////////////////////////////////////////////
	{
		section: "Hacked Formats",
		column: 3,
	},
	{
		name: "[Gen 1] Pure Hackmons",
		desc: `Anything that can be hacked in-game and is usable in local battles is allowed. You can pre-status your Pokemon using special items in this mod via the import/export feature; PAR, SLP, FRZ, PSN and BRN.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656851/">Pure Hackmons</a>`,
		],

		mod: 'gen1nocleric',
		debug: true,
		trunc(n) { return Math.trunc(n); },
		defaultLevel: 100,
		ruleset: ['Max Level = 255', 'HP Percentage Mod', 'Cancel Mod', 'Endless Battle Clause'],
		unbanlist: ['MissingNo.'],
	},
	{
		name: "[Gen 1] Balanced Hackmons",
		desc: `A balanced form of Pure Hackmons. Ruleset taken from MAMP and Quantum Tesseract, then tweaked. You can pre-status your Pokemon using special items in this mod via the import/export feature; PAR, SLP, FRZ, PSN and BRN.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/old-gens-other-metas-mega-thread.3597495/#post-7258505">RBY Balanced Hackmons Rulings</a>`,
		],

		mod: 'gen1nocleric',
		debug: true,
		trunc(n) { return Math.trunc(n); },
		ruleset: ['Max Level = 255', 'OHKO Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Cancel Mod', 'Freeze Clause Mod', 'Sleep Clause Mod', 'Endless Battle Clause'],
		banlist: ['Mewtwo', 'Wrap', 'Fire Spin', 'Clamp', 'Bind', 'Dig', 'Fly'],
		unbanlist: ['MissingNo.'],
	},

	// Randomized Formats
	///////////////////////////////////////////////////////////////////
	{
		section: "Randomized Formats",
		column: 5,
	},
	{
		name: "[Gen 1] Random Battle",
		desc: `Randomized teams of Pok&eacute;mon, balanced to give each player an equal shot at winning.`,

		mod: 'gen1',
		team: 'random',
		ruleset: ['Standard'],
	},
	{
		name: "[Gen 1] Random Battle (Auto Level Adjusted)",
		desc: `A variation of Gen 1 Random Battle developed by Estu that takes wins and losses to adjust the levels automatically. Use /randombattleadjusted to view the statistics.`,
		threads:  [
			`&bullet; <a href="https://www.smogon.com/forums/threads/random-battles.3526564/post-7643404">Introductory Thread</a>`,
			`&bullet; <a href="https://pastebin.com/J4Vft6wk">Overview</a>`,
		],

		mod: 'gen1',
		team: 'randomAutoLevelAdjusted',
		ruleset: ['Standard'],
	},
	{
		name: "[Gen 1] Challenge Cup",
		desc: `Randomized teams of Pok&eacute;mon, limited only by what's available in-game.`,

		mod: 'gen1',
		team: 'randomCC',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 1] Challenge Cup 1v1",

		mod: 'gen1',
		team: 'randomCC',
		teamLength: {
			battle: 1,
		},
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
	},
	//FINISHME: There is a finished JSON File for Gen 1 Battle Factory in the gen1 Mod folder, by yours truly.
	//The issue is, we lack a randomizer for it, so we can't actually use it. - Plague von Karma
	/*{
		name: "[Gen 1] Battle Factory",
		desc: `Randomized teams of Pok&eacute;mon for a generated Smogon tier with sets that are competitively viable.`,

		mod: 'gen1',
		team: 'randomFactory',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},*/
	{
		name: '[Gen 1] Metronome Battle',
		desc: `A metagame where you can only use Metronome!`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3632075/">Metronome Battle</a>`,
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/metronome.3372//">RBY Metronome Probability</a>`,
		],

		mod: 'gen1',
		ruleset: ['HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Pound', 'Karate Chop', 'Double Slap', 'Comet Punch', 'Mega Punch', 'Pay Day', 'Fire Punch', 'Ice Punch', 'Thunder Punch', 'Scratch', 'Vise Grip',
			'Guillotine', 'Razor Wind', 'Swords Dance', 'Cut', 'Gust', 'Wing Attack', 'Whirlwind', 'Fly', 'Bind', 'Slam', 'Vine Whip', 'Stomp', 'Double Kick',
			'Mega Kick', 'Jump Kick', 'Rolling Kick', 'Sand Attack', 'Headbutt', 'Horn Attack', 'Fury Attack', 'Horn Drill', 'Tackle', 'Body Slam', 'Wrap',
			'Take Down', 'Thrash', 'Double-Edge', 'Tail Whip', 'Poison Sting', 'Twineedle', 'Pin Missile', 'Leer', 'Bite', 'Growl', 'Roar', 'Sing', 'Supersonic',
			'Sonicboom', 'Disable', 'Acid', 'Ember', 'Flamethrower', 'Mist', 'Water Gun', 'Hydro Pump', 'Surf', 'Ice Beam', 'Blizzard', 'Psybeam', 'Bubblebeam',
			'Aurora Beam', 'Hyper Beam', 'Peck', 'Drill Peck', 'Submission', 'Low Kick', 'Counter', 'Seismic Toss', 'Strength', 'Absorb', 'Mega Drain',
			'Leech Seed', 'Growth', 'Razor Leaf', 'Solar Beam', 'Poisonpowder', 'Stun Spore', 'Sleep Powder', 'Petal Dance', 'String Shot', 'Dragon Rage',
			'Fire Spin', 'Thundershock', 'Thunderbolt', 'Thunder Wave', 'Thunder', 'Rock Throw', 'Earthquake', 'Fissure', 'Dig', 'Toxic', 'Confusion', 'Psychic',
			'Hypnosis', 'Meditate', 'Agility', 'Quick Attack', 'Rage', 'Teleport', 'Night Shade', 'Mimic', 'Screech', 'Double Team', 'Recover', 'Harden', 'Minimize',
			'Smokescreen', 'Confuse Ray', 'Withdraw', 'Defense Curl', 'Barrier', 'Light Screen', 'Haze', 'Reflect', 'Focus Energy', 'Bide', 'Mirror Move', 'Selfdestruct',
			'Egg Bomb', 'Lick', 'Smog', 'Sludge', 'Bone Club', 'Fire Blast', 'Waterfall', 'Clamp', 'Swift', 'Skull Bash', 'Spike Cannon', 'Constrict', 'Amnesia', 'Kinesis',
			'Softboiled', 'Hi Jump Kick', 'Glare', 'Dream Eater', 'Poison Gas', 'Barrage', 'Leech Life', 'Lovely Kiss', 'Sky Attack', 'Transform', 'Bubble', 'Dizzy Punch',
			'Spore', 'Flash', 'Psywave', 'Splash', 'Acid Armor', 'Crabhammer', 'Explosion', 'Fury Swipes', 'Bonemerang', 'Rest', 'Rock Slide', 'Hyper Fang', 'Sharpen', 'Conversion',
			'Tri Attack', 'Super Fang', 'Slash', 'Substitute'],
		onValidateSet(set) {
			if (set.moves.length !== 1 || this.dex.getMove(set.moves[0]).id !== 'metronome') {
				return [`${set.name || set.species} has illegal moves.`, `(Pok\u00e9mon can only have one Metronome in their moveset)`];
			}
		},
	},
	{
		name: "[Gen 1] Duel Arena",
		desc: `A format where you can only use one L20 Pound Rhydon, just like in the RBY Test Battle system. There's no Stat Exp here, only randomized DVs. The brain-child of zalarye. May the best Rhydon win!`,
		threads: [
			`&bullet; <a href="https://docs.google.com/spreadsheets/d/1W6YYb7urDIKMAj3E1xW_RRDhpiEnj-cDhitRXywOtP0/edit?usp=sharing">Duel Arena Spreadsheet</a>`,
		],

		mod: 'gen1rhydon',
		team: 'randomCC',
		teamLength: {
			battle: 1,
		},
		ruleset: ['HP Percentage Mod', 'Cancel Mod'],
	},

	// Miscellaneous Metagames
	///////////////////////////////////////////////////////////////////

	{
		section: "Misc. Metagames",
		column: 4,
	},
	{
		name: "[Gen 1] Japanese OU",
		desc: `Generation 1 with Japanese battle mechanics.`,

		mod: 'gen1jpn',
		searchShow: false,
		ruleset: ['Standard'],
		banlist: ['Uber'],
	},
	{
		name: "[Gen 1] AG",
		desc: `A metagame where anything is allowed, so long as it can be legally obtained! Tradebacks are also enabled! You can pre-status your Pokemon using special items in this mod via the import/export feature; PAR, SLP, FRZ, PSN and BRN.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587441/">Anything Goes Metagame Discussion</a>`,
		],

		mod: 'gen1nocleric',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod', 'Endless Battle Clause', 'Allow Tradeback'],
		banlist: ['Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember'],
	},
	{
		name: "[Gen 1] LC (Tradebacks)",
		desc: `The Gen 1 LC Format. It allows Tradebacks to preserve the L5 formula.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/old-generations-little-cup-discussion-currently-has-threatlist-for-rby-only.3450397/">RBY LC Guide</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/rby-little-cup-tradebacks.3533572/">RBY LC Guide w/Tradebacks by Jellicent</a>`,
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/rby-lc-viability-rankings.4693/">Viability Rankings</a>`,
			`&bullet; <a href="https://pastebin.com/raw/yeBRR537">RoA Sample Teams</a>`,
		],

		mod: 'gen1',
		maxLevel: 5,
		ruleset: ['Standard', 'Little Cup', 'Allow Tradeback'],
		banlist: ['Dragon Rage', 'Sonic Boom', 'Wrap', 'NFE', 'Clefairy'],
	},
	{
		name: "[Gen 1] LC L100",
		desc: `An alternative to conventional Gen 1 Little Cup that aims to create a Tradeback-free format.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/gen-1-side-formats-pika-cup-petit-cup-little-cup-level-100-and-middle-cup.3651579/page-2#post-8484942">LC L100 Resources</a>`,
		],

		mod: 'gen1',
		maxLevel: 100,
		banlist: ['Dig', 'Fly', 'Magikarp + Dragon Rage', 'Pikachu + Fly'],
		ruleset: ['Standard'],
		banlist: ['NFE', 'OU', 'UU', 'UUBL', 'Uber'],
	},
	{
		name: "[Gen 1] NFE",
		desc: `A metagame that only allows NFE and LC Pokemon.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/nfe-old-gens-hub.3656369/post-8574232">NFE Old Gens Hub</a>`,
			`&bullet; <a href="https://pastebin.com/4KpKCYtn">Sample Teams</a>`,
		],
		
		mod: 'gen1',
		ruleset: ['Standard', 'Not Fully Evolved'],
		banlist: ['Uber', 'OU', 'UU', 'UUBL'],
		unbanlist: ['Graveler', 'Haunter', 'Kadabra']
	},
	{
		name: "[Gen 1] MC",
		desc: `Middle Cup, a metagame that only allows the 16 NFEs available in RBY.`,
		threads: [
			`&bullet; <a href="https://docs.google.com/document/d/1ZJk6uxtDPgCrSO_2GcwmmAFmTUZGsPsW5Jncf6h9rDE/edit?usp=sharing">Meloyy's Middle Cup Guide</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/gen-1-side-formats-pika-cup-petit-cup-little-cup-level-100-and-middle-cup.3651579/post-8162599">Gen 1 Side Formats Thread</a>`,
		],

		mod: 'gen1',
		maxLevel: 50,
		ruleset: ['Standard'],
		banlist: ['LC', 'NFE', 'OU', 'UU', 'UUBL', 'Uber'],
		unbanlist: ['Ivysaur', 'Charmeleon', 'Wartortle', 'Metapod', 'Kakuna', 'Pidgeotto', 'Nidorina', 'Nidorino', 'Gloom', 'Poliwhirl', 'Kadabra', 'Machoke', 'Weepinbell', 'Graveler', 'Haunter', 'Dragonair'],
	},
	{
		name: "[Gen 1] 1v1",
		desc: `Bring three Pok&eacute;mon to Team Preview and choose one to battle.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/1v1-throwback.3632458/#post-7754986">RBY 1v1 Viability Rankings and Resources</a>`,
			`&bullet; <a href="https://pastebin.com/raw/jqe3Yt0H">RoA Sample Teams</a>`,
		],

		mod: 'gen1',
		teamLength: {
			validate: [1, 3],
			battle: 1,
		},
		ruleset: ['[Gen 1] OU', 'Accuracy Moves Clause', 'Sleep Moves Clause', 'Team Preview'],
		banlist: ['Explosion', 'Self-Destruct', 'Clamp', 'Bind', 'Wrap', 'Fire Spin', 'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp', 'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember'],
	},
	{
		name: "[Gen 1] Monotype",
		desc: `All the Pok&eacute;mon on a team must share a type.`,

		mod: 'gen1',
		ruleset: ['Same Type Clause', 'Standard'],
		banlist: ['Uber'],
	},
	{
		name: "[Gen 1] Mediocremons",
		desc: `A metagame where only Pokemon with no base stat above 100 are allowed.`,

		mod: 'gen1',
		ruleset: ['Standard'],
		banlist: ['Uber', 'Alakazam', 'Cloyster', 'Exeggutor', 'Gengar', 'Golem', 'Jolteon', 'Lapras', 'Rhydon', 'Slowbro',
			  'Snorlax', 'Starmie', 'Tauros', 'Zapdos', 'Aerodactyl', 'Arcanine', 'Articuno', 'Blastoise', 'Charizard',
			  'Dodrio', 'Dragonite', 'Dugtrio', 'Electabuzz', 'Electrode', 'Fearow', 'Flareon', 'Graveler', 'Gyarados',
			  'Hitmonchan', 'Hitmonlee', 'Hypno', 'Kabutops', 'Kadabra', 'Kangaskhan', 'Kingler', 'Machamp', 'Magneton',
			  'Marowak', 'Moltres', 'Mr. Mime', 'Muk', 'Ninetales', 'Omastar', 'Onix', 'Persian', 'Pinsir', 'Primeape',
			  'Raichu', 'Rapidash', 'Sandslash', 'Scyther', 'Tangela', 'Tentacruel', 'Vaporeon', 'Venusaur', 'Victreebel',
			  'Vileplume', 'Weezing', 'Wigglytuff', 'Haunter', 'Machoke', 'Abra', 'Gastly', 'Geodude', 'Jigglypuff', 'Krabby',
			  'Omanyte', 'Shellder', 'Tentacool', 'Voltorb', 'Chansey'],
	},
	// Pokemon Perfect Metagames
	///////////////////////////////////////////////////////////////////

	{
		section: "Pokemon Perfect Tiers",
		column: 5,
	},
	{
		name: "[Gen 1] PP 1U",
		desc: `Pokemon Perfect's OU equivalent. Essentially the same as OU, only Psywave remains banned.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3572352/">RBY OU Viability Ranking</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3650478/#post-8133786">RBY Sample Teams</a>`,
			`&bullet; <a href="https://pastebin.com/raw/gLahC72J">RoA Sample Teams</a>`,
		],

		mod: 'gen1',
		searchShow: false,
		ruleset: ['Standard'],
		banlist: ['Psywave', 'Uber', 'Magikarp + Dragon Rage', 'Rapidash + Pay Day', 'Fearow + Pay Day', 'Pikachu + Fly', 'Raichu + Fly'],
	},
	{
		name: "[Gen 1] PP 2U",
		desc: `Pokemon Perfect's UU equivalent. Similar to UU, but Victreebel is allowed and Golem is banned.`,
		threads: [
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/odds-of-leads-winning-in-each-matchup.4235/">Lead Matchups</a>`,
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/viability-rankings.4675/">Viability Rankings</a>`,
			`&bullet; <a href="https://pastebin.com/raw/gLahC72J">RoA Sample Teams for UU, which work here.</a>`,
		],

		mod: 'gen1',
		searchShow: false,
		ruleset: ['Standard'],
		banlist: ['Uber', 'Psywave', 'Alakazam', 'Chansey', 'Cloyster', 'Exeggutor', 'Gengar', 'Golem', 'Jolteon',
			  'Jynx', 'Lapras', 'Rhydon', 'Slowbro', 'Snorlax', 'Starmie', 'Tauros', 'Zapdos', 'Magikarp + Dragon Rage', 'Rapidash + Pay Day', 'Fearow + Pay Day', 'Pikachu + Fly', 'Raichu + Fly'],
	},
	{
		name: "[Gen 1] PP 3U",
		desc: `Pokemon Perfect's RU, essentially.`,
		threads: [
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/super-simplified-rby-3u-teambuilding.4408/">Simplified Teambuilding</a>`,
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/viability-rankings.3626/">Viability Rankings</a>`,
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/the-ultimate-guide-to-rby-3u-ft-peasounay-2k-post-gp-ready.3946/">3U Guide</a>`,
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/leads.3666/">3U Leads</a>`,
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/sample-teams-thread.3704/">Sample Teams</a>`,
		],

		mod: 'gen1',
		searchShow: false,
		ruleset: ['Standard'],
		banlist: ['Psywave', 'Uber','Alakazam', 'Chansey', 'Cloyster', 'Exeggutor', 'Gengar', 'Golem', 'Jolteon',
			  'Jynx', 'Lapras', 'Rhydon', 'Slowbro', 'Snorlax', 'Starmie', 'Tauros', 'Zapdos', 'Articuno',
			  'Dodrio', 'Dragonite', 'Gyarados', 'Haunter', 'Hypno', 'Kadabra', 'Kangaskhan', 'Moltres', 'Persian',
			  'Poliwrath', 'Raichu', 'Raticate', 'Tentacruel', 'Victreebel', 'Magikarp + Dragon Rage', 'Rapidash + Pay Day', 'Fearow + Pay Day', 'Pikachu + Fly', 'Raichu + Fly'],
	},
	{
		name: "[Gen 1] PP 4U",
		desc: `One of Pokemon Perfect's tiers, equivalent to RBY's old NU. Essentially a tier below RU, but above NU.`,
		threads: [
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/lead-thread.3817/">Leads</a>`,
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/viability-rankings.3718/">Viability Rankings</a>`,
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/sample-teams-thread.3848/">Sample Teams</a>`,
		],

		mod: 'gen1',
		searchShow: false,
		ruleset: ['Standard'],
		banlist: ['Psywave', 'Uber', 'Alakazam', 'Chansey', 'Cloyster', 'Exeggutor', 'Gengar', 'Golem', 'Jolteon',
			  'Jynx', 'Lapras', 'Rhydon', 'Slowbro', 'Snorlax', 'Starmie', 'Tauros', 'Zapdos', 'Articuno', 'Dodrio',
			  'Dragonite', 'Gyarados', 'Haunter', 'Hypno', 'Kadabra', 'Kangaskhan', 'Moltres', 'Persian', 'Poliwrath',
			  'Raichu', 'Raticate', 'Tentacruel', 'Victreebel', 'Aerodactyl', 'Charizard', 'Clefable', 'Dewgong', 'Dugtrio',
			  'Electabuzz', 'Exeggcute', 'Fearow', 'Golduck', 'Kingler', 'Mr. Mime', 'Pinsir', 'Poliwhirl', 'Sandslash', 'Vaporeon',
			  'Venusaur', 'Wigglytuff', 'Magikarp + Dragon Rage', 'Rapidash + Pay Day', 'Fearow + Pay Day', 'Pikachu + Fly', 'Raichu + Fly'],
	},
	{
		name: "[Gen 1] PP 5U",
		desc: `Pokemon Perfect's NU equivalent. Fairly different to Smogon's NU, so treat it as a completely different metagame.`,
		threads: [
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/leads-and-sleepers.4291/">Leads and Sleepers</a>`,
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/viability-rankings.3859/">Viability Rankings</a>`,
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/the-big-4.4274/">The Big 4</a>`,
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/5a-tournament-teambuilding-primer.4088/">Teambuilding Primer</a>`,
		],

		mod: 'gen1',
		searchShow: false,
		ruleset: ['Standard'],
		banlist: ['Psywave', 'Uber', 'Alakazam', 'Chansey', 'Cloyster', 'Exeggutor', 'Gengar', 'Golem', 'Jolteon',
			  'Jynx', 'Lapras', 'Rhydon', 'Slowbro', 'Snorlax', 'Starmie', 'Tauros', 'Zapdos', 'Articuno', 'Dodrio', 'Dragonite',
			  'Gyarados', 'Haunter', 'Hypno', 'Kadabra', 'Kangaskhan', 'Moltres', 'Persian', 'Poliwrath', 'Raichu', 'Raticate', 'Tentacruel',
			  'Victreebel', 'Aerodactyl', 'Charizard', 'Clefable', 'Dewgong', 'Dugtrio', 'Electabuzz', 'Exeggcute', 'Fearow',
			  'Golduck', 'Kingler', 'Mr. Mime', 'Pinsir', 'Poliwhirl', 'Sandslash', 'Vaporeon', 'Venusaur', 'Wigglytuff',
			  'Abra', 'Arcanine', 'Blastoise', 'Nidoking', 'Nidoqueen', 'Omastar', 'Porygon', 'Rapidash', 'Scyther',
			  'Slowpoke', 'Staryu', 'Tangela', 'Venomoth', 'Magikarp + Dragon Rage', 'Rapidash + Pay Day', 'Fearow + Pay Day', 'Pikachu + Fly', 'Raichu + Fly'],
	},
	{
		name: "[Gen 1] PP 6U",
		desc: `Pokemon Perfect's PU equivalent.`,
		threads: [
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/rby-6a-speed-tiers.4308/">Speed Tiers</a>`,
			`&bullet; <a href="https://www.pokemonperfect.com/forums/index.php?threads/rby-6a-viability-rankings.4327/">Viability Rankings</a>`,
		],

		mod: 'gen1',
		searchShow: false,
		ruleset: ['Standard'],
		banlist: ['Psywave', 'Uber', 'Alakazam', 'Chansey', 'Cloyster', 'Exeggutor', 'Gengar', 'Golem', 'Jolteon', 'Jynx', 'Lapras',
			  'Rhydon', 'Slowbro', 'Snorlax', 'Starmie', 'Tauros', 'Zapdos', 'Articuno', 'Dodrio', 'Dragonite', 'Gyarados',
			  'Haunter', 'Hypno', 'Kadabra', 'Kangaskhan', 'Moltres', 'Persian', 'Poliwrath', 'Raichu', 'Raticate', 'Tentacruel',
			  'Victreebel', 'Aerodactyl', 'Charizard', 'Clefable', 'Dewgong', 'Dugtrio', 'Electabuzz', 'Exeggcute', 'Fearow',
			  'Golduck', 'Kingler', 'Mr. Mime', 'Pinsir', 'Poliwhirl', 'Sandslash', 'Vaporeon', 'Venusaur', 'Wigglytuff',
			  'Abra', 'Arcanine', 'Blastoise', 'Nidoking', 'Nidoqueen', 'Omastar', 'Porygon', 'Rapidash', 'Scyther',
			  'Slowpoke', 'Staryu', 'Tangela', 'Venomoth', 'Arbok', 'Dragonair', 'Drowzee', 'Electrode', 'Gastly',
			  'Graveler', 'Lickitung', 'Magmar', 'Ninetales', 'Parasect', 'Poliwag', 'Primeape', 'Seadra', 'Seaking',
			  'Vileplume', 'Wartortle', 'Magikarp + Dragon Rage', 'Rapidash + Pay Day', 'Fearow + Pay Day', 'Pikachu + Fly', 'Raichu + Fly'],
	},
	{
		name: "[Gen 1] Custom Game",

		mod: 'gen1',
		searchShow: false,
		debug: true,
		maxLevel: 9999,
		trunc(n) { return Math.trunc(n); },
		defaultLevel: 100,
		ruleset: ['HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 1] Stadium Custom Game",

		mod: 'stadium',
		searchShow: false,
		debug: true,
		maxLevel: 9999,
		trunc(n) { return Math.trunc(n); },
		defaultLevel: 100,
		ruleset: ['HP Percentage Mod', 'Cancel Mod'],
	},
	
	

	{
		name: "[Gen 1] Custom Game",

		mod: 'gen1',
		searchShow: false,
		debug: true,
		battle: {trunc: Math.trunc},
		ruleset: ['HP Percentage Mod', 'Cancel Mod', 'Desync Clause Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
];
