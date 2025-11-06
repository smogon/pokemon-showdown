/*
* Pokemon Showdown
* RPG Badge System
*
* Manages gym badge collection and progression tracking.
*/

import type { PlayerData } from './interface';
import { BADGE_DATABASE, type Badge } from './data';

// --- BADGE INITIALIZATION ---

export function initializeBadgeList(player: PlayerData): void {
	if (!player.badgeList) {
		player.badgeList = [];
	}
}

// --- BADGE AWARDING ---

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

// --- BADGE QUERIES ---

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
