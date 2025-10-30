import { ClanLogs } from './database';
import type { Clan, ClanPermissions, ClanLogType } from './interface';

/**
 * Logs clan-related activity to the ClanLogs collection.
 */
export async function logClanActivity(
	clanId: ID,
	actor: ID,
	action: ClanLogType,
	options: {
		target?: ID,
		oldValue?: string | number | boolean,
		newValue?: string | number | boolean,
		note?: string,
	} = {}
): Promise<void> {
	await ClanLogs.insertOne({
		clanId,
		timestamp: Date.now(),
		actor,
		action,
		target: options.target,
		oldValue: options.oldValue,
		newValue: options.newValue,
		note: options.note,
	});
}

/**
 * Determines if a user has a specific permission in a clan.
 */
export function hasClanPermission(clan: Clan, userId: ID, permission: keyof ClanPermissions): boolean {
	if (clan.owner === userId) return true;

	const memberData = clan.members[userId];
	if (!memberData) return false;

	const rank = clan.ranks[memberData.rank];
	if (!rank) return false;

	return !!rank.permissions[permission];
}

export function to(date: Date, options: { date?: boolean, time?: boolean } = {}): string {
	if (!(date instanceof Date) || isNaN(date.getTime())) {
		return '';
	}

	const { date: showDate = false, time: showTime = false } = options;

	if (!showDate && !showTime) {
		return date.toISOString();
	}

	let result = '';

	if (showDate) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		result += `${year}-${month}-${day}`;
	}

	if (showTime) {
		if (showDate) result += ' ';
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		result += `${hours}:${minutes}:${seconds}`;
	}

	return result;
}

export function toDurationString(ms: number): string {
	const seconds = Math.floor(ms / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const months = Math.floor(days / 30);
	const years = Math.floor(days / 365);

	if (years > 0) {
		const remainingMonths = Math.floor((days % 365) / 30);
		return remainingMonths > 0 ? `${years}y ${remainingMonths}mo` : `${years}y`;
	}
	if (months > 0) {
		const remainingDays = days % 30;
		return remainingDays > 0 ? `${months}mo ${remainingDays}d` : `${months}mo`;
	}
	if (days > 0) {
		const remainingHours = hours % 24;
		return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
	}
	if (hours > 0) {
		const remainingMinutes = minutes % 60;
		return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
	}
	if (minutes > 0) {
		const remainingSeconds = seconds % 60;
		return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
	}
	return `${seconds}s`;
}

/**
 * ELO Rating System Utilities
 * Shared ELO calculation logic for clan warfare and battle tracking
 */

export const K_FACTOR = 32; // Standard ELO K-factor

/**
 * Calculates the expected score for player A against player B.
 * @param eloA Clan A's ELO
 * @param eloB Clan B's ELO
 * @returns The probability of player A winning (0 to 1)
 */
export function getExpectedScore(eloA: number, eloB: number): number {
	return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

/**
 * Calculates the new ELO ratings for a winner and a loser.
 * @param winnerElo Winner's current ELO
 * @param loserElo Loser's current ELO
 * @returns [newWinnerElo, newLoserElo, eloChange]
 */
export function calculateElo(winnerElo: number, loserElo: number): [number, number, number] {
	const expectedWinner = getExpectedScore(winnerElo, loserElo);

	// Calculate ELO change
	// We use Math.max(1, ...) to ensure a minimum of 1 ELO is always gained/lost
	const eloChange = Math.max(1, Math.round(K_FACTOR * (1 - expectedWinner)));

	const newWinnerElo = winnerElo + eloChange;
	const newLoserElo = loserElo - eloChange;

	return [newWinnerElo, newLoserElo, eloChange];
}
