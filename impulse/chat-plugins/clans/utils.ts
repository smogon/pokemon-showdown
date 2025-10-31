/*
* Pokemon Showdown
* Clans Utility Functions
*/
import { ClanLogs } from './database';
import type { Clan, ClanPermissions, ClanLogType, ClanWar } from './interface';
import { Utils } from '../../../lib';

/**
 * Logs clan-related activity to the ClanLogs collection.
 * @param clanId The ID of the clan.
 * @param actor The ID of the user who performed the action.
 * @param action The type of action performed.
 * @param options Additional log data.
 * @param options.target The ID of the user or entity targeted by the action.
 * @param options.oldValue The old value of a modified field.
 * @param options.newValue The new value of a modified field.
 * @param options.note A free-form note about the activity.
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
 * @param clan The Clan object.
 * @param userId The ID of the user to check.
 * @param permission The specific permission key to check for.
 * @returns True if the user has the permission, false otherwise.
 */
export function hasClanPermission(clan: Clan, userId: ID, permission: keyof ClanPermissions): boolean {
	if (clan.owner === userId) return true;

	const memberData = clan.members[userId];
	if (!memberData) return false;

	const rank = clan.ranks[memberData.rank];
	if (!rank) return false;

	return !!rank.permissions[permission];
}

/**
 * Formats a Date object into a readable string based on options.
 * @param date The Date object to format.
 * @param options Formatting options.
 * @param options.date If true, includes the date part (YYYY-MM-DD).
 * @param options.time If true, includes the time part (HH:MM:SS).
 * @returns The formatted date string, or an empty string if the date is invalid.
 */
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

/**
 * Converts a number of milliseconds into a human-readable duration string (e.g., '1y 2mo', '5h 3m').
 * Displays up to two largest non-zero units.
 * @param ms The duration in milliseconds.
 * @returns The formatted duration string.
 */
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
 * Standard ELO K-factor used for ELO change calculation.
 */
export const K_FACTOR = 32;

/**
 * Calculates the expected score for player A against player B.
 * @param eloA Clan A's ELO.
 * @param eloB Clan B's ELO.
 * @returns The probability of player A winning (0 to 1).
 */
export function getExpectedScore(eloA: number, eloB: number): number {
	return 1 / (1 + 10 ** ((eloB - eloA) / 400));
}

/**
 * Calculates the new ELO ratings for a winner and a loser.
 * The ELO change is clamped to a minimum of 1.
 * @param winnerElo Winner's current ELO.
 * @param loserElo Loser's current ELO.
 * @returns An array containing [newWinnerElo, newLoserElo, eloChange].
 */
export function calculateElo(winnerElo: number, loserElo: number): [number, number, number] {
	const expectedWinner = getExpectedScore(winnerElo, loserElo);

	const eloChange = Math.max(1, Math.round(K_FACTOR * (1 - expectedWinner)));

	const newWinnerElo = winnerElo + eloChange;
	const newLoserElo = loserElo - eloChange;

	return [newWinnerElo, newLoserElo, eloChange];
}

/**
 * Generates the HTML for a clan war UHTML card.
 * @param war The ClanWar object.
 * @param clan1 Clan object for war.clans[0] (Challenger). This is a ClanDoc, so it has ._id
 * @param clan2 Clan object for war.clans[1] (Target). This is a ClanDoc, so it has ._id
 * @param perspective Used to determine which buttons to show.
 * 'challenger': Shows buttons for clan1.
 * 'target': Shows buttons for clan2.
 * 'public': Shows no buttons (for lobby).
 * 'ended': Shows a final message.
 * @param options Optional data for end messages or last battle.
 */
export function generateWarCard(
	war: ClanWar,
	clan1: Clan & { _id: ID },
	clan2: Clan & { _id: ID },
	perspective: 'challenger' | 'target' | 'ended' | 'public',
	options: {
		endMessage?: string,
		lastBattle?: { winnerName: string, loserName: string, winningClanName: string },
	} = {}
): string {
	const clan1Elo = Math.floor(clan1.stats.elo || 1000);
	const clan2Elo = Math.floor(clan2.stats.elo || 1000);
	const winsNeeded = Math.ceil(war.bestOf / 2);

	let html = `<div class="infobox" style="border: 2px solid #6688AA; box-shadow: 2px 2px 5px rgba(0,0,0,0.1); padding: 10px;">`;
	html += `<center><strong style="font-size: 1.3em;">POKÉMON WAR</strong><hr style="margin: 5px 0;">`;

	// Clans and ELO (Horizontal and centered)
	html += `<div style="margin: 10px 0; font-size: 1.1em;">`;
	html += `<strong style="font-size: 1.1em;">${clan1.name}</strong> <span style="font-size: 1.1em; color: #555;">( ${clan1Elo} ELO )</span>`;
	html += ` <strong style="font-size: 1.1em; color: #AAA; margin: 0 10px;">VS</strong> `;
	html += `<strong style="font-size: 1.1em;">${clan2.name}</strong> <span style="font-size: 1.1em; color: #555;">( ${clan2Elo} ELO )</span>`;
	html += `</div>`;

	// Format
	html += `<div style="margin-top: 10px;"><strong>Format:</strong> Best of ${war.bestOf} (First to ${winsNeeded} wins)</div>`;

	// If the perspective is 'ended', show a final conclusive state.
	if (perspective === 'ended') {
		html += `<strong>Status:</strong> <span style="color: #999; font-weight: bold;">ENDED</span>`;
		html += `<div style="margin-top: 15px; border-top: 1px dashed #CCC; padding-top: 10px;">`;
		html += `<strong style="font-size: 1.0em;">${Utils.escapeHTML(options.endMessage || 'This challenge is no longer valid.')}</strong>`;
		html += `</div>`;
	} else {
		// Otherwise, follow the normal logic for pending/active states.
		// Status and Score
		if (war.status === 'pending') {
			html += `<strong>Status:</strong> <span style="color: #E8A337; font-weight: bold;">PENDING</span>`;
		} else if (war.status === 'active') {
			if (war.paused) {
				html += `<strong>Status:</strong> <span style"color: #E8A337; font-weight: bold;">PAUSED</span><br />`;
			} else {
				html += `<strong>Status:</strong> <span style="color: #4CAF50; font-weight: bold;">ACTIVE</span><br />`;
			}
			html += `<strong style="font-size: 1.0em;">Score:</strong> <span style="font-size: 1.2em; font-weight: bold;">${war.scores[clan1._id] || 0} - ${war.scores[clan2._id] || 0}</span>`;
		
			// *** NEW: Add Last Battle Info ***
			if (options.lastBattle) {
				html += `<div style="font-size: 0.9em; color: #555; margin-top: 5px; border-top: 1px solid #EEE; padding-top: 5px;">`;
				html += `Last Battle: <strong>${Utils.escapeHTML(options.lastBattle.winnerName)}</strong> defeated <strong>${Utils.escapeHTML(options.lastBattle.loserName)}</strong> (<strong>${Utils.escapeHTML(options.lastBattle.winningClanName)}</strong> +1)`;
				html += `</div>`;
			}
		} else if (war.status === 'completed') {
			html += `<strong>Status:</strong> <span style="color: #999; font-weight: bold;">COMPLETED</span><br />`;
			html += `<strong style="font-size: 1.0em;">Final Score:</strong> <span style="font-size: 1.0em; font-weight: bold;">${war.scores[clan1._id] || 0} - ${war.scores[clan2._id] || 0}</span>`;
		}

		// Buttons/Actions
		html += `<div style="margin-top: 15px; border-top: 1px dashed #CCC; padding-top: 10px;">`;
		
		if (perspective === 'public') {
			// Public view has no buttons, just context
			if (war.status === 'pending') {
				html += `<em>Waiting for ${clan2.name} to respond...</em>`;
			} else if (war.status === 'active') {
				if (war.paused) {
					html += `<strong>The war is currently paused.</strong>`;
				} else {
					html += `<strong>The war is on! Good luck, trainers!</strong>`;
				}
			} else if (war.status === 'completed') {
				html += `<strong style="font-size: 1.0em;">${Utils.escapeHTML(options.endMessage || 'This war has concluded.')}</strong>`;
			}
		} else if (war.status === 'pending') {
			if (perspective === 'challenger') {
				html += `<em>Waiting for ${clan2.name} to respond...</em><br />`;
				html += `<button class"button" name="send" value="/clan war cancel ${clan2._id}">Withdraw Challenge</button>`;
			} else if (perspective === 'target') {
				html += `<strong>${clan1.name} has challenged you!</strong><br />`;
				html += `<button class="button" name="send" value="/clan war accept ${clan1._id}" style="background-color: #4CAF50; color: white;">Accept</button> `;
				html += `<button class="button" name="send" value="/clan war deny ${clan1._id}" style="background-color: #f44336; color: white;">Deny</button>`;
			}
		} else if (war.status === 'active') {
			const myId = perspective === 'challenger' ? clan1._id : clan2._id;
			const opponentId = perspective === 'challenger' ? clan2._id : clan1._id;
			const opponentName = perspective === 'challenger' ? clan2.name : clan1.name;

			const iProposedPause = war.pauseConfirmations?.includes(myId);
			const theyProposedPause = war.pauseConfirmations?.includes(opponentId);
			
			const iProposedResume = war.resumeConfirmations?.includes(myId);
			const theyProposedResume = war.resumeConfirmations?.includes(opponentId);

			const iProposedTie = war.tieConfirmations?.includes(myId);
			const theyProposedTie = war.tieConfirmations?.includes(opponentId);
			
			if (war.paused) {
				// War is Paused
				if (theyProposedResume && !iProposedResume) {
					html += `<strong>${opponentName} has proposed to resume!</strong><br />`;
					html += `<button class="button" name="send" value="/clan war resume ${opponentId}" style="background-color: #4CAF50; color: white;">Accept Resume</button>`;
				} else if (iProposedResume && !theyProposedResume) {
					html += `<em>Resume proposed. Waiting for ${opponentName} to accept...</em><br />`;
				} else {
					// Default Paused state
					html += `<strong>The war is paused.</strong><br />`;
					html += `<button class="button" name="send" value="/clan war resume ${opponentId}" style="background-color: #4CAF50; color: white;">Resume War</button>`;
				}
			} else {
				// War is Active
				if (theyProposedPause && !iProposedPause) {
					html += `<strong>${opponentName} has proposed a pause!</strong><br />`;
					html += `<button class="button" name="send" value="/clan war pause ${opponentId}">Accept Pause</button>`;
				} else if (iProposedPause && !theyProposedPause) {
					html += `<em>Pause proposed. Waiting for ${opponentName} to accept...</em><br />`;
				} else if (theyProposedTie && !iProposedTie) {
					html += `<strong>${opponentName} has proposed a tie!</strong><br />`;
					html += `<button class="button" name="send" value="/clan war tie ${opponentId}" style="background-color: #E8A337; color: white;">Accept Tie</button>`;
				} else if (iProposedTie && !theyProposedTie) {
					html += `<em>Tie proposed. Waiting for ${opponentName} to accept...</em><br />`;
				} else {
					// Default Active state
					html += `<strong>The war is on! Good luck, trainers!</strong><br />`;
					html += `<button class="button" name="send" value="/clan war pause ${opponentId}">Pause War</button> `;
					html += `<button class="button" name="send" value="/clan war tie ${opponentId}">Propose Tie</button>`;
				}
			}
		} else if (war.status === 'completed') {
			html += `<strong style="font-size: 1.0em;">${Utils.escapeHTML(options.endMessage || 'This war has concluded.')}</strong>`;
		}
		html += `</div>`;
	}
	
	html += `</center></div>`;
	return html;
}
