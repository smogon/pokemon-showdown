/**
 * Day/Night Time System
 *
 * This module provides real-world time-based day/night cycle functionality.
 * Time periods are determined based on the current hour:
 * - Morning: 6:00 AM - 11:59 AM
 * - Afternoon: 12:00 PM - 4:59 PM
 * - Evening: 5:00 PM - 7:59 PM
 * - Night: 8:00 PM - 5:59 AM
 */

import type { EncounterZone, TrainerSpec, TimeAvailability, NPCData } from './interface';

export type TimePeriod = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

/**
 * Gets the current time period based on the real-world time.
 * @returns The current time period (Morning/Afternoon/Evening/Night)
 */
export function getCurrentTimePeriod(): TimePeriod {
	const hour = new Date().getHours();

	if (hour >= 6 && hour < 12) {
		return 'Morning';
	} else if (hour >= 12 && hour < 17) {
		return 'Afternoon';
	} else if (hour >= 17 && hour < 20) {
		return 'Evening';
	} else {
		return 'Night';
	}
}

/**
 * Formats a location name with the current time period.
 * @param locationName The name of the location
 * @returns The location name with time period, e.g., "New Bark Town (Morning)"
 */
export function formatLocationWithTime(locationName: string): string {
	const timePeriod = getCurrentTimePeriod();
	return `${locationName} (${timePeriod})`;
}

/**
 * Gets an emoji representation for a given time period.
 * @param timePeriod The time period to get an emoji for. If not provided, uses current time.
 * @returns An emoji representing the time of day
 */
export function getTimeEmoji(timePeriod?: TimePeriod): string {
	const period = timePeriod ?? getCurrentTimePeriod();

	switch (period) {
	case 'Morning':
		return '🌅';
	case 'Afternoon':
		return '☀️';
	case 'Evening':
		return '🌆';
	case 'Night':
		return '🌙';
	}
}

/**
 * Gets both the time period text and emoji.
 * @returns An object with the time period and its emoji
 */
export function getTimeInfo(): { period: TimePeriod, emoji: string } {
	const period = getCurrentTimePeriod();
	const emoji = getTimeEmoji(period);
	return { period, emoji };
}

/**
 * Gets the available Pokemon for an encounter zone based on the current time of day.
 * If the zone has time-specific Pokemon defined for the current period, those are used.
 * Otherwise, falls back to the default pokemon list.
 *
 * @param zone The encounter zone to get Pokemon from
 * @returns Array of Pokemon species IDs available at the current time
 */
export function getZonePokemonByTime(zone: EncounterZone): string[] {
	const period = getCurrentTimePeriod();

	// If no time-based Pokemon are defined, use the default list
	if (!zone.pokemonByTime) {
		return zone.pokemon;
	}

	// Map the time period to the correct key
	const timeKey = period.toLowerCase() as 'morning' | 'afternoon' | 'evening' | 'night';
	const timePokemon = zone.pokemonByTime[timeKey];

	// If time-specific Pokemon are defined for this period, use them
	// Otherwise, fall back to the default list
	if (timePokemon && timePokemon.length > 0) {
		return timePokemon;
	}

	return zone.pokemon;
}

/**
 * Checks if a trainer is available at the current time of day.
 * If the trainer has no time restrictions (no availableByTime), they are always available.
 * If availableByTime is defined, the trainer is only available during the specified times.
 *
 * @param trainer The trainer spec to check
 * @returns True if the trainer is available at the current time
 */
export function isTrainerAvailableByTime(trainer: TrainerSpec): boolean {
	// If no time restrictions defined, trainer is always available (fallback)
	if (!trainer.availableByTime) {
		return true;
	}

	const period = getCurrentTimePeriod();
	const timeKey = period.toLowerCase() as 'morning' | 'afternoon' | 'evening' | 'night';

	// Check if the trainer is available at the current time period
	const isAvailable = trainer.availableByTime[timeKey];

	// If the specific time period is explicitly set to true, trainer is available
	// If not defined or false, trainer is not available
	return isAvailable === true;
}

/**
 * Checks if a trainer is available based on TimeAvailability settings.
 * This is a generic version that can be used for any entity with TimeAvailability.
 *
 * @param availability The time availability settings
 * @returns True if available at the current time
 */
export function isAvailableByTime(availability?: TimeAvailability): boolean {
	// If no time restrictions defined, always available (fallback)
	if (!availability) {
		return true;
	}

	const period = getCurrentTimePeriod();
	const timeKey = period.toLowerCase() as 'morning' | 'afternoon' | 'evening' | 'night';

	return availability[timeKey] === true;
}

/**
 * Checks if an NPC is available at the current time of day.
 * If the NPC has no time restrictions (no availableByTime), they are always available.
 * If availableByTime is defined, the NPC is only available during the specified times.
 *
 * @param npc The NPC data to check
 * @returns True if the NPC is available at the current time
 */
export function isNPCAvailableByTime(npc: NPCData): boolean {
	return isAvailableByTime(npc.availableByTime);
}
