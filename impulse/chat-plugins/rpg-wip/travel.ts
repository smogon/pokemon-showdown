/*
* Pokemon Showdown
* RPG Travel System
*
* Manages location visits, travel between areas, and location requirements.
*/

import type { PlayerData } from './interface';
import { toID } from '../../../sim/dex';
import { LOCATION_DATABASE, BADGE_DATABASE, type Location } from './data';
import { hasBadge } from './badges';

// --- LOCATION INITIALIZATION ---

export function initializeVisitedLocations(player: PlayerData): void {
	if (!player.visitedLocations) {
		player.visitedLocations = new Set<string>();
		// Mark starting location as visited
		player.visitedLocations.add(toID(player.location));
	}
}

// --- TRAVEL MANAGEMENT ---

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

// --- LOCATION QUERIES ---

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
