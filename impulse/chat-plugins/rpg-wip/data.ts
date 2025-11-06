/*
* Pokemon Showdown
* RPG Data
*
* This file contains all static game data, such as encounter zones,
* type charts, trainer definitions, and starter Pokemon lists.
*/

import type { Stats, TrainerSpec } from './interface';

export const STARTER_POKEMON = {
	fire: ['charmander'],
	water: ['squirtle'],
	grass: ['bulbasaur'],
};

// Pokemon Fire Red Accurate Encounter Zones
export const ENCOUNTER_ZONES: Record<string, { name: string, pokemon: string[], levelRange: [number, number], battleType?: 'single' | 'double' }> = {
	// Pallet Town - No wild encounters
	
	// Route 1 (Pallet Town to Viridian City)
	'route1_grass': {
		name: 'Route 1 - Tall Grass',
		pokemon: ['pidgey', 'rattata'],
		levelRange: [2, 5],
		battleType: 'single',
	},
	
	// Viridian City - No wild encounters in city
	
	// Route 2 (Viridian City to Viridian Forest)
	'route2_south_grass': {
		name: 'Route 2 South - Tall Grass',
		pokemon: ['pidgey', 'rattata', 'caterpie', 'weedle'],
		levelRange: [3, 5],
		battleType: 'single',
	},
	
	// Viridian Forest
	'viridianforest_grass': {
		name: 'Viridian Forest - Grass',
		pokemon: ['caterpie', 'metapod', 'weedle', 'kakuna', 'pikachu'],
		levelRange: [3, 6],
		battleType: 'single',
	},
	
	// Route 2 (Viridian Forest to Pewter City)
	'route2_north_grass': {
		name: 'Route 2 North - Tall Grass',
		pokemon: ['pidgey', 'rattata', 'caterpie', 'weedle'],
		levelRange: [3, 5],
		battleType: 'single',
	},
	
	// Pewter City - No wild encounters
	
	// Route 3 (Pewter City to Mt. Moon)
	'route3_grass': {
		name: 'Route 3 - Tall Grass',
		pokemon: ['pidgey', 'spearow', 'rattata', 'jigglypuff', 'nidoranf', 'nidoranm'],
		levelRange: [5, 10],
		battleType: 'single',
	},
	
	// Mt. Moon - 1F
	'mtmoon_1f': {
		name: 'Mt. Moon 1F',
		pokemon: ['zubat', 'geodude', 'clefairy', 'paras'],
		levelRange: [7, 10],
		battleType: 'single',
	},
	
	// Mt. Moon - B1F
	'mtmoon_b1f': {
		name: 'Mt. Moon B1F',
		pokemon: ['zubat', 'geodude', 'clefairy', 'paras'],
		levelRange: [8, 11],
		battleType: 'single',
	},
	
	// Mt. Moon - B2F
	'mtmoon_b2f': {
		name: 'Mt. Moon B2F',
		pokemon: ['zubat', 'geodude', 'clefairy', 'paras'],
		levelRange: [9, 12],
		battleType: 'single',
	},
};

export const BERRY_FLAVORS: Record<string, { flavor: string, stat: keyof Stats }> = {
	'figyberry': { flavor: 'Spicy', stat: 'atk' },
	'wikiberry': { flavor: 'Dry', stat: 'spa' },
	'magoberry': { flavor: 'Sweet', stat: 'spe' },
	'aguavberry': { flavor: 'Bitter', stat: 'spd' },
	'iapapaberry': { flavor: 'Sour', stat: 'def' },
};

export const NATURE_FLAVOR_PREFERENCES: Record<keyof Stats, string> = {
	atk: 'Spicy', def: 'Sour', spa: 'Dry', spd: 'Bitter', spe: 'Sweet', maxHp: '',
};

export const TYPE_RESIST_BERRIES: Record<string, string> = {
	'babiriberry': 'Steel', 'chartiberry': 'Rock', 'chilanberry': 'Normal', 'chopleberry': 'Fighting',
	'cobaberry': 'Flying', 'colburberry': 'Dark', 'habanberry': 'Dragon', 'kasibberry': 'Ghost',
	'kebiaberry': 'Poison', 'occaberry': 'Fire', 'passhoberry': 'Water', 'payapaberry': 'Psychic',
	'rindoberry': 'Grass', 'roseliberry': 'Fairy', 'shucaberry': 'Ground', 'tangaberry': 'Bug',
	'wacanberry': 'Electric', 'yacheberry': 'Ice',
};

export const TYPE_CHART: { [type: string]: { superEffective: string[], notVeryEffective: string[], noEffect: string[] } } = {
	Normal: { superEffective: [], notVeryEffective: ['Rock', 'Steel'], noEffect: ['Ghost'] },
	Fire: { superEffective: ['Grass', 'Ice', 'Bug', 'Steel'], notVeryEffective: ['Fire', 'Water', 'Rock', 'Dragon'], noEffect: [] },
	Water: { superEffective: ['Fire', 'Ground', 'Rock'], notVeryEffective: ['Water', 'Grass', 'Dragon'], noEffect: [] },
	Grass: { superEffective: ['Water', 'Ground', 'Rock'], notVeryEffective: ['Fire', 'Grass', 'Poison', 'Flying', 'Bug', 'Dragon', 'Steel'], noEffect: [] },
	Electric: { superEffective: ['Water', 'Flying'], notVeryEffective: ['Grass', 'Electric', 'Dragon'], noEffect: ['Ground'] },
	Ice: { superEffective: ['Grass', 'Ground', 'Flying', 'Dragon'], notVeryEffective: ['Fire', 'Water', 'Ice', 'Steel'], noEffect: [] },
	Fighting: { superEffective: ['Normal', 'Ice', 'Rock', 'Dark', 'Steel'], notVeryEffective: ['Poison', 'Flying', 'Psychic', 'Bug', 'Fairy'], noEffect: ['Ghost'] },
	Poison: { superEffective: ['Grass', 'Fairy'], notVeryEffective: ['Poison', 'Ground', 'Rock', 'Ghost'], noEffect: ['Steel'] },
	Ground: { superEffective: ['Fire', 'Electric', 'Poison', 'Rock', 'Steel'], notVeryEffective: ['Grass', 'Bug'], noEffect: ['Flying'] },
	Flying: { superEffective: ['Grass', 'Fighting', 'Bug'], notVeryEffective: ['Electric', 'Rock', 'Steel'], noEffect: [] },
	Psychic: { superEffective: ['Fighting', 'Poison'], notVeryEffective: ['Psychic', 'Steel'], noEffect: ['Dark'] },
	Bug: { superEffective: ['Grass', 'Psychic', 'Dark'], notVeryEffective: ['Fire', 'Fighting', 'Poison', 'Flying', 'Ghost', 'Steel', 'Fairy'], noEffect: [] },
	Rock: { superEffective: ['Fire', 'Ice', 'Flying', 'Bug'], notVeryEffective: ['Fighting', 'Ground', 'Steel'], noEffect: [] },
	Ghost: { superEffective: ['Psychic', 'Ghost'], notVeryEffective: ['Dark'], noEffect: ['Normal'] },
	Dragon: { superEffective: ['Dragon'], notVeryEffective: ['Steel'], noEffect: ['Fairy'] },
	Dark: { superEffective: ['Psychic', 'Ghost'], notVeryEffective: ['Fighting', 'Dark', 'Fairy'], noEffect: [] },
	Steel: { superEffective: ['Ice', 'Rock', 'Fairy'], notVeryEffective: ['Fire', 'Water', 'Electric', 'Steel'], noEffect: [] },
	Fairy: { superEffective: ['Fighting', 'Dragon', 'Dark'], notVeryEffective: ['Fire', 'Poison', 'Steel'], noEffect: [] },
};

export const TRAINER_DATABASE: Record<string, TrainerSpec> = {
	// ===== ROUTE 1 TRAINERS =====
	// (In Fire Red, Route 1 has no trainers - only wild Pokemon)
	
	// ===== VIRIDIAN FOREST TRAINERS =====
	'bug_catcher_rick': {
		name: 'Bug Catcher Rick',
		money: 60,
		party: [
			{ species: 'weedle', level: 6 },
		],
		dialogue: {
			start: "Hey! I found these Pokémon in the forest!",
			win: "Oh no! My Bug Pokémon!",
			lose: "Bug Pokémon are the coolest!",
		},
	},
	'bug_catcher_doug': {
		name: 'Bug Catcher Doug',
		money: 70,
		party: [
			{ species: 'weedle', level: 7 },
			{ species: 'kakuna', level: 7 },
		],
		dialogue: {
			start: "Heheh! Watch me paralyze you with my Bugs!",
			win: "Ugh! You're better than me!",
			lose: "See? Bug Pokémon rule!",
		},
	},
	'bug_catcher_anthony': {
		name: 'Bug Catcher Anthony',
		money: 60,
		party: [
			{ species: 'caterpie', level: 6 },
			{ species: 'caterpie', level: 6 },
		],
		dialogue: {
			start: "I'm looking for strong Bug Pokémon!",
			win: "You're too good for me!",
			lose: "My Bug Pokémon are great!",
		},
	},
	'lass_janice': {
		name: 'Lass Janice',
		money: 140,
		party: [
			{ species: 'pidgey', level: 9 },
			{ species: 'pidgey', level: 9 },
		],
		dialogue: {
			start: "...You're staring at me! Want to battle?",
			win: "That stare was intimidating...",
			lose: "Hee hee! I won!",
		},
	},
	
	// ===== ROUTE 3 TRAINERS =====
	'youngster_ben': {
		name: 'Youngster Ben',
		money: 100,
		party: [
			{ species: 'rattata', level: 11 },
			{ species: 'ekans', level: 11 },
		],
		dialogue: {
			start: "I'm the tallest kid in my class!",
			win: "Wow, you're good!",
			lose: "Haha! I'm the best!",
		},
	},
	'youngster_calvin': {
		name: 'Youngster Calvin',
		money: 110,
		party: [
			{ species: 'spearow', level: 14 },
		],
		dialogue: {
			start: "This is the first time I've seen you! Let's battle!",
			win: "Aww! I lost!",
			lose: "Yeah! I win!",
		},
	},
	'bug_catcher_colton': {
		name: 'Bug Catcher Colton',
		money: 100,
		party: [
			{ species: 'caterpie', level: 10 },
			{ species: 'weedle', level: 10 },
			{ species: 'caterpie', level: 10 },
		],
		dialogue: {
			start: "I came here to catch Bug Pokémon!",
			win: "My Bug Pokémon lost...",
			lose: "Hehe! I won!",
		},
	},
	'lass_sally': {
		name: 'Lass Sally',
		money: 150,
		party: [
			{ species: 'rattata', level: 10 },
			{ species: 'nidoranf', level: 10 },
		],
		dialogue: {
			start: "Eek! You surprised me! Let's battle!",
			win: "Oh! I lost!",
			lose: "Yay! I win!",
		},
	},
	'youngster_jimmy': {
		name: 'Youngster Jimmy',
		money: 120,
		party: [
			{ species: 'rattata', level: 14 },
			{ species: 'ekans', level: 14 },
		],
		dialogue: {
			start: "You have Pokémon! Let's do battle!",
			win: "No! I lost!",
			lose: "Ha! I won!",
		},
	},
	'lass_robin': {
		name: 'Lass Robin',
		money: 150,
		party: [
			{ species: 'pidgey', level: 11 },
			{ species: 'nidoranf', level: 11 },
		],
		dialogue: {
			start: "My boyfriend's really strong! But I'll beat you first!",
			win: "Oh no! I'm embarrassed!",
			lose: "Tee-hee! Did you see that, honey?",
		},
	},
	'bug_catcher_james': {
		name: 'Bug Catcher James',
		money: 110,
		party: [
			{ species: 'weedle', level: 11 },
			{ species: 'caterpie', level: 11 },
		],
		dialogue: {
			start: "I'm trying to evolve my Bugs!",
			win: "Aww! You're too good!",
			lose: "Yeah! They're getting stronger!",
		},
	},
	
	// ===== MT. MOON TRAINERS =====
	'bug_catcher_kent': {
		name: 'Bug Catcher Kent',
		money: 100,
		party: [
			{ species: 'weedle', level: 11 },
			{ species: 'kakuna', level: 11 },
		],
		dialogue: {
			start: "Wow! Zubat is everywhere here!",
			win: "I should have brought a Repel!",
			lose: "Hehe! My Bugs rule!",
		},
	},
	'lass_iris': {
		name: 'Lass Iris',
		money: 160,
		party: [
			{ species: 'clefairy', level: 14 },
		],
		dialogue: {
			start: "Eek! Don't scare me like that!",
			win: "Waaah! You meanie!",
			lose: "Oh! Sorry for being scared!",
		},
	},
	'super_nerd_jovan': {
		name: 'Super Nerd Jovan',
		money: 250,
		party: [
			{ species: 'magnemite', level: 11 },
			{ species: 'voltorb', level: 11 },
		],
		dialogue: {
			start: "I'm searching for the fossils here!",
			win: "...I didn't find any...",
			lose: "Fossils are amazing!",
		},
	},
	'bug_catcher_robby': {
		name: 'Bug Catcher Robby',
		money: 100,
		party: [
			{ species: 'caterpie', level: 10 },
			{ species: 'metapod', level: 10 },
			{ species: 'caterpie', level: 10 },
		],
		dialogue: {
			start: "I love Bug Pokémon!",
			win: "I'll catch tougher ones!",
			lose: "Bug types are the best!",
		},
	},
	'lass_miriam': {
		name: 'Lass Miriam',
		money: 160,
		party: [
			{ species: 'oddish', level: 11 },
			{ species: 'bellsprout', level: 11 },
		],
		dialogue: {
			start: "I'm looking for Moon Stones!",
			win: "Awww... No Moon Stone yet...",
			lose: "I found one! Yay!",
		},
	},
	'hiker_marcos': {
		name: 'Hiker Marcos',
		money: 300,
		party: [
			{ species: 'geodude', level: 10 },
			{ species: 'geodude', level: 10 },
			{ species: 'onix', level: 10 },
		],
		dialogue: {
			start: "Hahahaha! My Pokémon are tough!",
			win: "Grr! You're tougher!",
			lose: "Rock types never lose!",
		},
	},
	'youngster_josh': {
		name: 'Youngster Josh',
		money: 110,
		party: [
			{ species: 'rattata', level: 10 },
			{ species: 'rattata', level: 10 },
			{ species: 'zubat', level: 10 },
		],
		dialogue: {
			start: "These Pokémon are everywhere here!",
			win: "Too many trainers here!",
			lose: "I love caves!",
		},
	},
	'hiker_alan': {
		name: 'Hiker Alan',
		money: 300,
		party: [
			{ species: 'geodude', level: 10 },
			{ species: 'onix', level: 12 },
		],
		dialogue: {
			start: "Whoa! The ceilings are high here!",
			win: "Oof! I'm exhausted!",
			lose: "I'm used to rough terrain!",
		},
	},
	'team_rocket_grunt_1': {
		name: 'Team Rocket Grunt',
		money: 300,
		party: [
			{ species: 'rattata', level: 11 },
			{ species: 'zubat', level: 11 },
		],
		dialogue: {
			start: "Stop! We're taking these fossils!",
			win: "Team Rocket will get you for this!",
			lose: "Hahaha! Team Rocket rules!",
		},
	},
	'team_rocket_grunt_2': {
		name: 'Team Rocket Grunt',
		money: 300,
		party: [
			{ species: 'sandshrew', level: 11 },
			{ species: 'rattata', level: 11 },
			{ species: 'zubat', level: 11 },
		],
		dialogue: {
			start: "Hey! You're not Team Rocket!",
			win: "Ugh! I'll remember this!",
			lose: "Team Rocket never loses!",
		},
	},
	'team_rocket_grunt_3': {
		name: 'Team Rocket Grunt',
		money: 300,
		party: [
			{ species: 'rattata', level: 13 },
			{ species: 'zubat', level: 13 },
		],
		dialogue: {
			start: "These fossils belong to Team Rocket!",
			win: "Argh! The boss won't like this!",
			lose: "Hahaha! Scram, kid!",
		},
	},
	'super_nerd_miguel': {
		name: 'Super Nerd Miguel',
		money: 250,
		party: [
			{ species: 'grimer', level: 12 },
			{ species: 'voltorb', level: 12 },
			{ species: 'koffing', level: 12 },
		],
		dialogue: {
			start: "I'm studying the Moon Stone phenomenon!",
			win: "Fascinating! Your tactics were brilliant!",
			lose: "As I predicted! Science wins!",
		},
	},
	
	// ===== GYM LEADER BROCK =====
	'gym_brock': {
		name: 'Gym Leader Brock',
		money: 1386,
		party: [
			{ species: 'geodude', level: 12, moves: ['tackle', 'defensecurl', 'rockthrow'] },
			{ species: 'onix', level: 14, moves: ['tackle', 'bind', 'rockthrow', 'rage'], item: 'sitrusberry' },
		],
		dialogue: {
			start: "I'm Brock! I'm Pewter's Gym Leader! My rock-hard willpower is evident even in my Pokémon! My Pokémon are all Rock-type, so they're tough!",
			win: "I took you for granted. As proof of your victory, here's the Boulder Badge!",
			lose: "The best offense is defense! That's my motto!",
		},
	},
	
	// ===== RIVAL BATTLES =====
	'rival_1': {
		name: 'Rival',
		money: 500,
		party: [
			{ species: 'eevee', level: 5, item: 'oranberry' },
		],
		dialogue: {
			start: "Wait up! Let's see whose Pokémon is stronger!",
			win: "What? I... I lost?!",
			lose: "Heh! I'm stronger than you!",
		},
	},
};

// Badge definitions
export interface Badge {
	id: string;
	name: string;
	description: string;
	givenBy: string; // Trainer ID
	icon: string;
}

export const BADGE_DATABASE: Record<string, Badge> = {
	'boulder': {
		id: 'boulder',
		name: 'Boulder Badge',
		description: 'Proof of victory over Brock',
		givenBy: 'gym_brock',
		icon: '🪨',
	},
	'cascade': {
		id: 'cascade',
		name: 'Cascade Badge',
		description: 'Proof of victory over Misty',
		givenBy: 'gym_misty',
		icon: '💧',
	},
	'thunder': {
		id: 'thunder',
		name: 'Thunder Badge',
		description: 'Proof of victory over Lt. Surge',
		givenBy: 'gym_surge',
		icon: '⚡',
	},
	'rainbow': {
		id: 'rainbow',
		name: 'Rainbow Badge',
		description: 'Proof of victory over Erika',
		givenBy: 'gym_erika',
		icon: '🌈',
	},
	'soul': {
		id: 'soul',
		name: 'Soul Badge',
		description: 'Proof of victory over Koga',
		givenBy: 'gym_koga',
		icon: '☠️',
	},
	'marsh': {
		id: 'marsh',
		name: 'Marsh Badge',
		description: 'Proof of victory over Sabrina',
		givenBy: 'gym_sabrina',
		icon: '🔮',
	},
	'volcano': {
		id: 'volcano',
		name: 'Volcano Badge',
		description: 'Proof of victory over Blaine',
		givenBy: 'gym_blaine',
		icon: '🌋',
	},
	'earth': {
		id: 'earth',
		name: 'Earth Badge',
		description: 'Proof of victory over Giovanni',
		givenBy: 'gym_giovanni',
		icon: '🌍',
	},
};

// Location/Region system
export interface Location {
	id: string;
	name: string;
	description: string;
	region: string;
	connectedTo: string[]; // Location IDs
	requiresBadge?: string; // Badge ID needed to access
	requiresItem?: string; // Key item needed to access
}

export const LOCATION_DATABASE: Record<string, Location> = {
	// Pallet Town - Starting location
	'pallet_town': {
		id: 'pallet_town',
		name: 'Pallet Town',
		description: 'A quiet town nestled between gentle hills and the sea. Your adventure begins here!',
		region: 'Kanto',
		connectedTo: ['route_1'],
	},
	
	// Route 1 - Pallet Town to Viridian City
	'route_1': {
		id: 'route_1',
		name: 'Route 1',
		description: 'The road from Pallet Town to Viridian City. Wild Pokémon live in the tall grass!',
		region: 'Kanto',
		connectedTo: ['pallet_town', 'viridian_city'],
	},
	
	// Viridian City
	'viridian_city': {
		id: 'viridian_city',
		name: 'Viridian City',
		description: 'A town bordered by verdant nature. The Gym here is very strong!',
		region: 'Kanto',
		connectedTo: ['route_1', 'route_2'],
	},
	
	// Route 2 - Viridian City to Viridian Forest
	'route_2': {
		id: 'route_2',
		name: 'Route 2',
		description: 'A path that connects Viridian City to the northern towns.',
		region: 'Kanto',
		connectedTo: ['viridian_city', 'viridian_forest', 'pewter_city'],
	},
	
	// Viridian Forest
	'viridian_forest': {
		id: 'viridian_forest',
		name: 'Viridian Forest',
		description: 'A deep forest teeming with Bug-type Pokémon. Many trainers are here to catch them!',
		region: 'Kanto',
		connectedTo: ['route_2'],
	},
	
	// Pewter City - Brock's Gym
	'pewter_city': {
		id: 'pewter_city',
		name: 'Pewter City',
		description: 'A quiet city nestled between the rugged mountains and rocks. Home to Brock, the Rock-type Gym Leader!',
		region: 'Kanto',
		connectedTo: ['route_2', 'route_3'],
	},
	
	// Route 3 - Pewter City to Mt. Moon
	'route_3': {
		id: 'route_3',
		name: 'Route 3',
		description: 'A winding path to Mt. Moon. Many trainers gather here to battle!',
		region: 'Kanto',
		connectedTo: ['pewter_city', 'mt_moon'],
	},
	
	// Mt. Moon
	'mt_moon': {
		id: 'mt_moon',
		name: 'Mt. Moon',
		description: 'A dark cave with a maze of tunnels. Rare Moon Stones can be found here!',
		region: 'Kanto',
		connectedTo: ['route_3', 'route_4'],
	},
	
	// Route 4 - Mt. Moon to Cerulean City
	'route_4': {
		id: 'route_4',
		name: 'Route 4',
		description: 'A path leading from Mt. Moon to Cerulean City.',
		region: 'Kanto',
		connectedTo: ['mt_moon', 'cerulean_city'],
		requiresBadge: 'boulder',
	},
	
	// Cerulean City (for future expansion)
	'cerulean_city': {
		id: 'cerulean_city',
		name: 'Cerulean City',
		description: 'A seaside city with flowing water. Home to Misty, the Water-type Gym Leader!',
		region: 'Kanto',
		connectedTo: ['route_4', 'route_5', 'route_24'],
		requiresBadge: 'boulder',
	},
};

// Key Items (story-critical items)
export const KEY_ITEMS: Record<string, { id: string, name: string, description: string }> = {
	'bicycle': {
		id: 'bicycle',
		name: 'Bicycle',
		description: 'A folding bicycle that allows you to travel faster',
	},
	'oldrod': {
		id: 'oldrod',
		name: 'Old Rod',
		description: 'An old fishing rod that can catch water Pokemon',
	},
	'goodrod': {
		id: 'goodrod',
		name: 'Good Rod',
		description: 'A decent fishing rod',
	},
	'superrod': {
		id: 'superrod',
		name: 'Super Rod',
		description: 'The best fishing rod',
	},
	'itemfinder': {
		id: 'itemfinder',
		name: 'Itemfinder',
		description: 'A device that signals the presence of hidden items',
	},
	'pokeflute': {
		id: 'pokeflute',
		name: 'Poké Flute',
		description: 'A flute that awakens sleeping Pokemon',
	},
};
