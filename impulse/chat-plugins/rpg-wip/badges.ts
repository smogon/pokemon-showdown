/*
* Pokemon Showdown
* RPG Badge Data
*
* This file contains all badge-related data and logic for the story mode.
* Centralizing badge information makes it easier to maintain, add, or remove badges.
*
* Badge Configuration:
*   - gymLeaderId: Unique identifier for the gym leader (used in trainer ID)
*   - badgeName: Official badge name
*   - order: Badge order (1-8 for Kanto gym badges)
*   - description: Brief description of the badge
*
* This data is used across multiple systems:
*   - Battle system: Awarding badges after gym leader defeats
*   - Location system: Route access requirements
*   - Shop system: Item unlock requirements
*   - Story events: Badge-based story triggers
*/

export interface BadgeInfo {
	gymLeaderId: string;
	badgeName: string;
	order: number;
	description?: string;
}

/**
 * Complete list of gym badges in order
 */
export const KANTO_BADGES: BadgeInfo[] = [
	{
		gymLeaderId: 'brock',
		badgeName: 'Boulder Badge',
		order: 1,
		description: 'Pewter City Gym - Rock type specialist',
	},
	{
		gymLeaderId: 'misty',
		badgeName: 'Cascade Badge',
		order: 2,
		description: 'Cerulean City Gym - Water type specialist',
	},
	{
		gymLeaderId: 'ltsurge',
		badgeName: 'Thunder Badge',
		order: 3,
		description: 'Vermilion City Gym - Electric type specialist',
	},
	{
		gymLeaderId: 'erika',
		badgeName: 'Rainbow Badge',
		order: 4,
		description: 'Celadon City Gym - Grass type specialist',
	},
	{
		gymLeaderId: 'koga',
		badgeName: 'Soul Badge',
		order: 5,
		description: 'Fuchsia City Gym - Poison type specialist',
	},
	{
		gymLeaderId: 'sabrina',
		badgeName: 'Marsh Badge',
		order: 6,
		description: 'Saffron City Gym - Psychic type specialist',
	},
	{
		gymLeaderId: 'blaine',
		badgeName: 'Volcano Badge',
		order: 7,
		description: 'Cinnabar Island Gym - Fire type specialist',
	},
	{
		gymLeaderId: 'giovanni',
		badgeName: 'Earth Badge',
		order: 8,
		description: 'Viridian City Gym - Ground type specialist',
	},
];

/**
 * Total number of badges available
 */
export const TOTAL_BADGES = KANTO_BADGES.length;

/**
 * Get badge name for a gym leader
 * @param gymLeaderId The gym leader's ID (e.g., 'brock', 'misty')
 * @returns The badge name or undefined if not found
 */
export function getBadgeForGymLeader(gymLeaderId: string): string | undefined {
	const badge = KANTO_BADGES.find(b => b.gymLeaderId === gymLeaderId);
	return badge?.badgeName;
}

/**
 * Get gym leader ID for a badge name
 * @param badgeName The badge name (e.g., 'Boulder Badge')
 * @returns The gym leader ID or undefined if not found
 */
export function getGymLeaderForBadge(badgeName: string): string | undefined {
	const badge = KANTO_BADGES.find(b => b.badgeName === badgeName);
	return badge?.gymLeaderId;
}

/**
 * Get badge order/number
 * @param badgeName The badge name (e.g., 'Boulder Badge')
 * @returns The badge order (1-8) or undefined if not found
 */
export function getBadgeOrder(badgeName: string): number | undefined {
	const badge = KANTO_BADGES.find(b => b.badgeName === badgeName);
	return badge?.order;
}

/**
 * Get all badge names in order
 * @returns Array of badge names
 */
export function getAllBadgeNames(): string[] {
	return KANTO_BADGES.map(b => b.badgeName);
}

/**
 * Check if a badge name is valid
 * @param badgeName The badge name to check
 * @returns True if the badge exists
 */
export function isValidBadge(badgeName: string): boolean {
	return KANTO_BADGES.some(b => b.badgeName === badgeName);
}

/**
 * Get first badge name (for story events)
 */
export const FIRST_BADGE_NAME = KANTO_BADGES[0].badgeName;

/**
 * Get last badge name (for story events)
 */
export const LAST_BADGE_NAME = KANTO_BADGES[KANTO_BADGES.length - 1].badgeName;
