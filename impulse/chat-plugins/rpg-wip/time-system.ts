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
 * Gets an emoji representation of the current time period.
 * @returns An emoji representing the time of day
 */
export function getTimeEmoji(): string {
	const timePeriod = getCurrentTimePeriod();

	switch (timePeriod) {
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
	const emoji = getTimeEmoji();
	return { period, emoji };
}
