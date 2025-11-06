/*
* Pokemon Showdown
* RPG Data
*
* This file contains all static game data, such as encounter zones,
* type charts, trainer definitions, and starter Pokemon lists.
*/

import type { Stats, TrainerSpec } from './interface';

export const STARTER_POKEMON = {
	fire: ['pikachu', 'harmander', 'cyndaquil', 'torchic', 'chimchar', 'tepig'],
	water: ['eevee', 'squirtle', 'totodile', 'mudkip', 'piplup', 'oshawott'],
	grass: ['bulbasaur', 'chikorita', 'treecko', 'turtwig', 'snivy'],
};

export const ENCOUNTER_ZONES: Record<string, { name: string, pokemon: string[], levelRange: [number, number], battleType?: 'single' | 'double' }> = {
	'startertown_grass': {
		name: 'Tall Grass',
		pokemon: ['pidgey', 'rattata', 'caterpie', 'weedle'],
		levelRange: [5, 7],
		battleType: 'single',
	},
	'startertown_pond': {
		name: 'Pond',
		pokemon: ['magikarp', 'feebas'],
		levelRange: [9, 20],
		battleType: 'single',
	},
	'startertown_doubles_grass': {
		name: 'Shaking Grass',
		pokemon: ['pidgey', 'rattata', 'nidoranf', 'nidoranm'],
		levelRange: [6, 8],
		battleType: 'double',
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
	'gym_brock': {
		name: 'Gym Leader Brock',
		money: 1000,
		party: [
			{ species: 'geodude', level: 12, moves: ['tackle', 'rockthrow'] },
			{ species: 'onix', level: 14, moves: ['tackle', 'rockthrow', 'bind', 'harden'], item: 'sitrusberry' },
		],
		dialogue: {
			start: "I'm Brock! I'm the Gym Leader of Pewter City! My rock-hard will is evident in my Pokémon!",
			win: "I... I lost? As proof of your victory, here is the Boulder Badge!",
			lose: "My Pokémon are as solid as rock!",
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
	'starter_town': {
		id: 'starter_town',
		name: 'Starter Town',
		description: 'A peaceful town where your journey begins',
		region: 'Kanto',
		connectedTo: ['route_1'],
	},
	'route_1': {
		id: 'route_1',
		name: 'Route 1',
		description: 'A route connecting Starter Town to Pewter City',
		region: 'Kanto',
		connectedTo: ['starter_town', 'pewter_city'],
	},
	'pewter_city': {
		id: 'pewter_city',
		name: 'Pewter City',
		description: 'A city with a Rock-type Gym',
		region: 'Kanto',
		connectedTo: ['route_1', 'route_2'],
	},
	'route_2': {
		id: 'route_2',
		name: 'Route 2',
		description: 'A forested route',
		region: 'Kanto',
		connectedTo: ['pewter_city', 'cerulean_city'],
	},
	'cerulean_city': {
		id: 'cerulean_city',
		name: 'Cerulean City',
		description: 'A city with a Water-type Gym',
		region: 'Kanto',
		connectedTo: ['route_2', 'route_3'],
		requiresBadge: 'boulder',
	},
	'route_3': {
		id: 'route_3',
		name: 'Route 3',
		description: 'A mountainous route',
		region: 'Kanto',
		connectedTo: ['cerulean_city'],
		requiresBadge: 'cascade',
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
