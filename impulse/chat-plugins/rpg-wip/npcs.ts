/*
* Pokemon Showdown
* RPG NPCs Data
*
* This file contains NPC definitions and their dialogues/actions.
*/

import type { NPCData } from './interface';

export const NPC_DATABASE: Record<string, NPCData> = {
	'professor': {
		id: 'professor',
		name: 'Professor Oak',
		location: 'startertown_lab',
		dialogue: "Welcome! I research Pokémon as a profession. Let me give you some advice: defeat all 8 gym leaders to challenge the Elite Four!",
	},
	'nursejoystartertown': {
		id: 'nursejoystartertown',
		name: 'Nurse Joy',
		location: 'startertown_pokecenter',
		dialogue: "Welcome to the Pokémon Center! We can heal your Pokémon to perfect health. Use /rpg heal anytime!",
	},
	'nursejoypewter': {
		id: 'nursejoypewter',
		name: 'Nurse Joy',
		location: 'pewtercity_pokecenter',
		dialogue: "Welcome to the Pokémon Center! Your Pokémon look tired. Would you like me to heal them?",
	},
	'nursejoycerulean': {
		id: 'nursejoycerulean',
		name: 'Nurse Joy',
		location: 'ceruleancity_pokecenter',
		dialogue: "Welcome to the Pokémon Center! Remember to heal your Pokémon often. You can use /rpg heal anytime!",
	},
	'nursejoyvermilion': {
		id: 'nursejoyvermilion',
		name: 'Nurse Joy',
		location: 'vermilioncity_pokecenter',
		dialogue: "Welcome to the Pokémon Center! Trainers who challenge Lt. Surge need to be prepared!",
	},
	'nursejoyceladon': {
		id: 'nursejoyceladon',
		name: 'Nurse Joy',
		location: 'celadoncity_pokecenter',
		dialogue: "Welcome to the Pokémon Center! Celadon City is such a lovely place, isn't it?",
	},
	'nursejoyfuchsia': {
		id: 'nursejoyfuchsia',
		name: 'Nurse Joy',
		location: 'fuchsiacity_pokecenter',
		dialogue: "Welcome to the Pokémon Center! Be careful of Poison-type moves in this city!",
	},
	'nursejoycinnabar': {
		id: 'nursejoycinnabar',
		name: 'Nurse Joy',
		location: 'cinnabarisland_pokecenter',
		dialogue: "Welcome to the Pokémon Center! The volcano here can be quite intense, just like Blaine's battles!",
	},
	'nursejoyviridian': {
		id: 'nursejoyviridian',
		name: 'Nurse Joy',
		location: 'viridiancity_pokecenter',
		dialogue: "Welcome to the Pokémon Center! Giovanni's Gym is very challenging. Make sure you're prepared!",
	},
	'nursejoyleague': {
		id: 'nursejoyleague',
		name: 'Nurse Joy',
		location: 'pokemonleague_pokecenter',
		dialogue: "Welcome to the Pokémon Center! This is your last chance to prepare before facing the Elite Four. Good luck!",
	},
	'aideroute1': {
		id: 'aideroute1',
		name: 'Professor\'s Aide',
		location: 'route1',
		dialogue: "Wild Pokémon live in tall grass! If you want to catch them, weaken them first, then throw a Poké Ball!",
		action: {
			type: 'giveitem',
			itemId: 'potion',
			quantity: 5,
			onceOnly: true,
		},
	},
	'oldmanpewter': {
		id: 'oldmanpewter',
		name: 'Old Man',
		location: 'pewtercity_museum',
		dialogue: "Brock, the Pewter Gym Leader, uses Rock-type Pokémon. Water and Grass moves work well against them!",
	},
	'nursecerulean': {
		id: 'nursecerulean',
		name: 'City Guide',
		location: 'ceruleancity',
		dialogue: "Welcome to Cerulean City! Make sure to visit the Pokémon Center and challenge Misty at the Gym!",
	},
	'hikerroute2': {
		id: 'hikerroute2',
		name: 'Friendly Hiker',
		location: 'route2',
		dialogue: "This route has tougher Pokémon! Make sure your team is at least level 10 before continuing. Good luck!",
		action: {
			type: 'exchangeitems',
			itemId: 'greatball',
			quantity: 3,
			requiredItem: 'pokeball',
			requiredQuantity: 10,
			onceOnly: true,
		},
	},
	'girlvermilion': {
		id: 'girlvermilion',
		name: 'Little Girl',
		location: 'vermilioncity_house1',
		dialogue: "Lt. Surge is really tough! His Electric Pokémon can paralyze yours. Ground types work great against them!",
	},
	'shopkeeperceladon': {
		id: 'shopkeeperceladon',
		name: 'Shop Keeper',
		location: 'celadoncity_department',
		dialogue: "Welcome to Celadon City! We have the biggest department store in the region. Check out /rpg shop for great deals!",
	},
	'trainerfuchsia': {
		id: 'trainerfuchsia',
		name: 'Expert Trainer',
		location: 'fuchsiacity_house1',
		dialogue: "Koga specializes in Poison types. They can badly poison your Pokémon! Psychic and Ground moves work well here.",
		action: {
			type: 'givepokemon',
			pokemon: {
				species: 'eevee',
				level: 25,
			},
			onceOnly: true,
		},
	},
	'scientistcinnabar': {
		id: 'scientistcinnabar',
		name: 'Lab Scientist',
		location: 'cinnabarisland_lab',
		dialogue: "Blaine's Fire types are no joke! Water, Rock, and Ground moves are super effective. Prepare well!",
	},
	'guardviridian': {
		id: 'guardviridian',
		name: 'City Guard',
		location: 'viridiancity_house1',
		dialogue: "Giovanni, the Viridian Gym Leader, is incredibly strong! His Ground types are tough. Use Water, Grass, or Ice types!",
	},
	'veteranvictoryroad': {
		id: 'veteranvictoryroad',
		name: 'Veteran Hiker',
		location: 'victoryroad',
		dialogue: "Only trainers with all 8 badges can enter here. The Pokémon are level 48+. Make sure you're prepared!",
		flags: ['all_badges'],
	},
	'championguide': {
		id: 'championguide',
		name: 'Elite Four Guide',
		location: 'pokemonleague',
		dialogue: "You've made it to the Pokémon League! The Elite Four specialize in Ice, Fighting, Ghost/Poison, and Dragon types. The Champion uses a balanced team. Good luck!",
		flags: ['all_badges'],
	},
	'congratulations': {
		id: 'congratulations',
		name: 'Champion\'s Aide',
		location: 'pokemonleague',
		dialogue: "Congratulations, Champion! You've completed your journey. You can explore, catch more Pokémon, or challenge trainers again!",
		flags: ['champion'],
	},
	'itemcollector': {
		id: 'itemcollector',
		name: 'Item Collector',
		location: 'startertown_house1',
		dialogue: "I collect rare berries! If you bring me 5 Oran Berries, I'll give you a Sitrus Berry!",
		action: {
			type: 'exchangeitems',
			itemId: 'sitrusberry',
			quantity: 1,
			requiredItem: 'oranberry',
			requiredQuantity: 5,
		},
	},
	'mysteryman': {
		id: 'mysteryman',
		name: 'Mysterious Man',
		location: 'celadoncity_gamecorner',
		dialogue: "I need rare candies for my research! Bring me 3 Rare Candies and I'll give you something special.",
		action: {
			type: 'takeitem',
			itemId: 'rarecandy',
			quantity: 3,
			onceOnly: true,
		},
	},

	// Special NPCs - Move services
	'movedeleter': {
		id: 'movedeleter',
		name: 'Move Deleter',
		location: 'fuchsiacity_house1',
		dialogue: "I can help your Pokémon forget moves. This is useful for removing HMs or unwanted moves.",
		npcType: 'movedeleter',
	},
	'namerater': {
		id: 'namerater',
		name: 'Name Rater',
		location: 'vermilioncity_house1',
		dialogue: "I'm the Name Rater! I can help you change your Pokémon's nickname.",
		npcType: 'namerater',
	},
	'movetutorsurf': {
		id: 'movetutorsurf',
		name: 'Move Tutor',
		location: 'ceruleancity',
		dialogue: "I can teach Surf to your Water-type Pokémon for ₽10,000!",
		npcType: 'movetutor',
		action: {
			type: 'movetutor',
			moveId: 'surf',
			cost: 10000,
		},
	},
	'movetutorthunderbolt': {
		id: 'movetutorthunderbolt',
		name: 'Move Tutor',
		location: 'vermilioncity_house1',
		dialogue: "I can teach Thunderbolt to your Electric-type Pokémon for ₽15,000!",
		npcType: 'movetutor',
		action: {
			type: 'movetutor',
			moveId: 'thunderbolt',
			cost: 15000,
		},
	},

	// Trade NPCs
	'tradermachop': {
		id: 'tradermachop',
		name: 'Trade Enthusiast',
		location: 'pewtercity',
		dialogue: "I'm looking for a Geodude! I'll trade you my Machop for it!",
		action: {
			type: 'tradepokemon',
			wantedSpecies: 'geodude',
			offeredPokemon: {
				species: 'machop',
				level: 15,
			},
			onceOnly: true,
		},
	},
	'traderhaunter': {
		id: 'traderhaunter',
		name: 'Spooky Trader',
		location: 'celadoncity',
		dialogue: "I have a Haunter I'd love to trade! Do you have a Kadabra?",
		action: {
			type: 'tradepokemon',
			wantedSpecies: 'kadabra',
			offeredPokemon: {
				species: 'haunter',
				level: 25,
			},
			onceOnly: true,
		},
	},
};
