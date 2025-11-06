/*
* Pokemon Showdown
* RPG Helper Systems
*
* Additional systems for Pokedex, Badges, Location tracking, etc.
*/

import type { PlayerData, RPGPokemon } from './interface';
import { toID } from '../../../sim/dex';
import { BADGE_DATABASE, LOCATION_DATABASE, type Badge, type Location } from './data';
import { addItemToInventory } from './items';

// --- POKEDEX SYSTEM ---

export function initializePokedex(player: PlayerData): void {
	if (!player.pokedex) {
		player.pokedex = {
			seen: new Set<string>(),
			caught: new Set<string>(),
		};
	}
}

export function registerPokemonSeen(player: PlayerData, speciesId: string): void {
	initializePokedex(player);
	player.pokedex!.seen.add(toID(speciesId));
}

export function registerPokemonCaught(player: PlayerData, speciesId: string): void {
	initializePokedex(player);
	const id = toID(speciesId);
	player.pokedex!.seen.add(id);
	player.pokedex!.caught.add(id);
}

export function getPokedexStats(player: PlayerData): { seen: number, caught: number } {
	initializePokedex(player);
	return {
		seen: player.pokedex!.seen.size,
		caught: player.pokedex!.caught.size,
	};
}

export function hasSeenPokemon(player: PlayerData, speciesId: string): boolean {
	initializePokedex(player);
	return player.pokedex!.seen.has(toID(speciesId));
}

export function hasCaughtPokemon(player: PlayerData, speciesId: string): boolean {
	initializePokedex(player);
	return player.pokedex!.caught.has(toID(speciesId));
}

// --- BADGE SYSTEM ---

export function initializeBadgeList(player: PlayerData): void {
	if (!player.badgeList) {
		player.badgeList = [];
	}
}

export function awardBadge(player: PlayerData, badgeId: string): { success: boolean, message: string } {
	initializeBadgeList(player);
	
	const badge = BADGE_DATABASE[badgeId];
	if (!badge) {
		return { success: false, message: 'Invalid badge' };
	}

	if (player.badgeList!.includes(badgeId)) {
		return { success: false, message: 'You already have this badge!' };
	}

	player.badgeList!.push(badgeId);
	player.badges = player.badgeList!.length;

	return {
		success: true,
		message: `You received the ${badge.icon} ${badge.name}!`,
	};
}

export function hasBadge(player: PlayerData, badgeId: string): boolean {
	initializeBadgeList(player);
	return player.badgeList!.includes(badgeId);
}

export function getBadgeCount(player: PlayerData): number {
	initializeBadgeList(player);
	return player.badgeList!.length;
}

export function getBadgeList(player: PlayerData): Badge[] {
	initializeBadgeList(player);
	return player.badgeList!.map(id => BADGE_DATABASE[id]).filter(Boolean);
}

// --- LOCATION/TRAVEL SYSTEM ---

export function initializeVisitedLocations(player: PlayerData): void {
	if (!player.visitedLocations) {
		player.visitedLocations = new Set<string>();
		// Mark starting location as visited
		player.visitedLocations.add(toID(player.location));
	}
}

export function visitLocation(player: PlayerData, locationId: string): { success: boolean, message: string } {
	initializeVisitedLocations(player);
	
	const location = LOCATION_DATABASE[locationId];
	if (!location) {
		return { success: false, message: 'Invalid location' };
	}

	// Check if location is connected to current location
	const currentLocationId = toID(player.location);
	const currentLocation = Object.values(LOCATION_DATABASE).find(loc => toID(loc.name) === currentLocationId);
	
	if (currentLocation && !currentLocation.connectedTo.includes(locationId)) {
		return { success: false, message: 'You cannot reach that location from here!' };
	}

	// Check badge requirement
	if (location.requiresBadge && !hasBadge(player, location.requiresBadge)) {
		const badge = BADGE_DATABASE[location.requiresBadge];
		return {
			success: false,
			message: `You need the ${badge.name} to access ${location.name}!`,
		};
	}

	// Check item requirement
	if (location.requiresItem && !player.inventory.has(location.requiresItem)) {
		return {
			success: false,
			message: `You need a special item to access ${location.name}!`,
		};
	}

	// Travel to location
	player.location = location.name;
	player.visitedLocations!.add(locationId);

	return {
		success: true,
		message: `You arrived at ${location.name}. ${location.description}`,
	};
}

export function hasVisitedLocation(player: PlayerData, locationId: string): boolean {
	initializeVisitedLocations(player);
	return player.visitedLocations!.has(locationId);
}

export function getConnectedLocations(player: PlayerData): Location[] {
	const currentLocationId = toID(player.location);
	const currentLocation = Object.values(LOCATION_DATABASE).find(loc => toID(loc.name) === currentLocationId);
	
	if (!currentLocation) {
		return [];
	}

	return currentLocation.connectedTo
		.map(id => LOCATION_DATABASE[id])
		.filter(Boolean);
}

export function canAccessLocation(player: PlayerData, locationId: string): { canAccess: boolean, reason?: string } {
	const location = LOCATION_DATABASE[locationId];
	if (!location) {
		return { canAccess: false, reason: 'Invalid location' };
	}

	// Check badge requirement
	if (location.requiresBadge && !hasBadge(player, location.requiresBadge)) {
		const badge = BADGE_DATABASE[location.requiresBadge];
		return {
			canAccess: false,
			reason: `Requires ${badge.name}`,
		};
	}

	// Check item requirement
	if (location.requiresItem && !player.inventory.has(location.requiresItem)) {
		return {
			canAccess: false,
			reason: `Requires ${location.requiresItem}`,
		};
	}

	return { canAccess: true };
}

// --- ACHIEVEMENT SYSTEM ---

export interface Achievement {
	id: string;
	name: string;
	description: string;
	icon: string;
	requirement: (player: PlayerData) => boolean;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
	'first_catch': {
		id: 'first_catch',
		name: 'First Catch',
		description: 'Catch your first Pokemon',
		icon: '⚡',
		requirement: (player: PlayerData) => {
			initializePokedex(player);
			return player.pokedex!.caught.size >= 1;
		},
	},
	'ten_catches': {
		id: 'ten_catches',
		name: 'Catching On',
		description: 'Catch 10 different Pokemon',
		icon: '🌟',
		requirement: (player: PlayerData) => {
			initializePokedex(player);
			return player.pokedex!.caught.size >= 10;
		},
	},
	'first_badge': {
		id: 'first_badge',
		name: 'Badge Beginner',
		description: 'Earn your first Gym Badge',
		icon: '🥇',
		requirement: (player: PlayerData) => getBadgeCount(player) >= 1,
	},
	'four_badges': {
		id: 'four_badges',
		name: 'Halfway There',
		description: 'Earn 4 Gym Badges',
		icon: '🏆',
		requirement: (player: PlayerData) => getBadgeCount(player) >= 4,
	},
	'all_badges': {
		id: 'all_badges',
		name: 'Champion in Training',
		description: 'Earn all 8 Gym Badges',
		icon: '👑',
		requirement: (player: PlayerData) => getBadgeCount(player) >= 8,
	},
	'rich_trainer': {
		id: 'rich_trainer',
		name: 'Money Bags',
		description: 'Have 100,000 Pokedollars',
		icon: '💰',
		requirement: (player: PlayerData) => player.money >= 100000,
	},
	'shiny_hunter': {
		id: 'shiny_hunter',
		name: 'Shiny Hunter',
		description: 'Catch a Shiny Pokemon',
		icon: '✨',
		requirement: (player: PlayerData) => {
			return player.party.some(p => p.shiny) || 
				   Array.from(player.pc.values()).some(p => p.shiny);
		},
	},
	'explorer': {
		id: 'explorer',
		name: 'Explorer',
		description: 'Visit 5 different locations',
		icon: '🗺️',
		requirement: (player: PlayerData) => {
			initializeVisitedLocations(player);
			return player.visitedLocations!.size >= 5;
		},
	},
};

export function checkAchievements(player: PlayerData): string[] {
	if (!player.achievements) {
		player.achievements = new Set<string>();
	}

	const newAchievements: string[] = [];

	for (const [id, achievement] of Object.entries(ACHIEVEMENTS)) {
		if (!player.achievements.has(id) && achievement.requirement(player)) {
			player.achievements.add(id);
			newAchievements.push(`${achievement.icon} Achievement Unlocked: ${achievement.name}!`);
		}
	}

	return newAchievements;
}

export function getAchievements(player: PlayerData): Achievement[] {
	if (!player.achievements) {
		player.achievements = new Set<string>();
	}

	return Array.from(player.achievements)
		.map(id => ACHIEVEMENTS[id])
		.filter(Boolean);
}
