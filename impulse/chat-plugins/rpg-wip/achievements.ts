/*
* Pokemon Showdown
* RPG Achievement System
*
* Manages player achievements and milestone tracking.
*/

import type { PlayerData } from './interface';
import { initializePokedex } from './pokedex';
import { getBadgeCount } from './badges';
import { initializeVisitedLocations } from './travel';

// --- ACHIEVEMENT DEFINITIONS ---

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

// --- ACHIEVEMENT MANAGEMENT ---

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
