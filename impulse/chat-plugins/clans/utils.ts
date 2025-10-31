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
 *   'challenger': Shows buttons for clan1.
 *   'target': Shows buttons for clan2.
 *   'public': Shows no buttons (for lobby).
 *   'ended': Shows a final message.
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

	let html = `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">`;

	html += `<h2 style="text-align: center; margin-top: 0;">POKEMON CLAN WAR</h2>`;

	html += `<div style="display: flex; justify-content: space-around; align-items: center; margin: 20px 0; font-size: 18px; font-weight: bold;">`;
	html += `<span style="color: #FFD700;">${clan1.name} (${clan1Elo} ELO)</span>`;
	html += `<span style="font-size: 24px;"> VS </span>`;
	html += `<span style="color: #FFD700;">${clan2.name} (${clan2Elo} ELO)</span>`;
	html += `</div>`;

	html += `<p style="text-align: center; font-size: 16px;"><strong>Format:</strong> Best of ${war.bestOf} (First to ${winsNeeded} wins)</p>`;

	if (perspective === 'ended') {
		html += `<p style="text-align: center; font-size: 16px;"><strong>Status:</strong> <span style="color: #FF6B6B;">ENDED</span></p>`;
		html += `<div style="background: rgba(255, 255, 255, 0.2); padding: 15px; border-radius: 5px; margin: 15px 0; text-align: center;">`;
		html += `<p style="margin: 0;">${Utils.escapeHTML(options.endMessage || 'This challenge is no longer valid.')}</p>`;
		html += `</div>`;
	} else {
		if (war.status === 'pending') {
			html += `<p style="text-align: center; font-size: 16px;"><strong>Status:</strong> <span style="color: #FFA500;">PENDING</span></p>`;
		} else if (war.status === 'active') {
			if (war.paused) {
				html += `<p style="text-align: center; font-size: 16px;"><strong>Status:</strong> <span style="color: #FFA500;">PAUSED</span></p>`;
			} else {
				html += `<p style="text-align: center; font-size: 16px;"><strong>Status:</strong> <span style="color: #00FF00;">ACTIVE</span></p>`;
			}

			html += `<p style="text-align: center; font-size: 20px; font-weight: bold;"><strong>Score:</strong> ${war.scores[clan1._id] || 0} - ${war.scores[clan2._id] || 0}</p>`;

			if (options.lastBattle) {
				html += `<div style="background: rgba(255, 255, 255, 0.2); padding: 10px; border-radius: 5px; margin: 10px 0; text-align: center;">`;
				html += `<p style="margin: 0; font-size: 14px;"><strong>Last Battle:</strong> ${Utils.escapeHTML(options.lastBattle.winnerName)} defeated ${Utils.escapeHTML(options.lastBattle.loserName)} (${Utils.escapeHTML(options.lastBattle.winningClanName)} +1)</p>`;
				html += `</div>`;
			}
		} else if (war.status === 'completed') {
			html += `<p style="text-align: center; font-size: 16px;"><strong>Status:</strong> <span style="color: #FF6B6B;">COMPLETED</span></p>`;
			html += `<p style="text-align: center; font-size: 20px; font-weight: bold;"><strong>Final Score:</strong> ${war.scores[clan1._id] || 0} - ${war.scores[clan2._id] || 0}</p>`;
		}

		html += `<div style="background: rgba(255, 255, 255, 0.2); padding: 15px; border-radius: 5px; margin: 15px 0; text-align: center;">`;

		if (perspective === 'public') {
			if (war.status === 'pending') {
				html += `<p style="margin: 0;">Waiting for ${clan2.name} to respond...</p>`;
			} else if (war.status === 'active') {
				if (war.paused) {
					html += `<p style="margin: 0;">The war is currently paused.</p>`;
				} else {
					html += `<p style="margin: 0;">The war is on! Good luck, trainers!</p>`;
				}
			} else if (war.status === 'completed') {
				html += `<p style="margin: 0;">${Utils.escapeHTML(options.endMessage || 'This war has concluded.')}</p>`;
			}
		} else if (war.status === 'pending') {
			if (perspective === 'challenger') {
				html += `<p style="margin: 0 0 10px 0;">Waiting for ${clan2.name} to respond...</p>`;
				html += `<button name="send" value="/clan war withdraw ${war._id}" style="background: #FF6B6B; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">Withdraw Challenge</button>`;
			} else if (perspective === 'target') {
				html += `<p style="margin: 0 0 10px 0;">${clan1.name} has challenged you!</p>`;
				html += `<button name="send" value="/clan war accept ${war._id}" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px; margin-right: 10px;">Accept</button> `;
				html += `<button name="send" value="/clan war deny ${war._id}" style="background: #FF6B6B; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">Deny</button>`;
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
				if (theyProposedResume && !iProposedResume) {
					html += `<p style="margin: 0 0 10px 0;">${opponentName} has proposed to resume!</p>`;
					html += `<button name="send" value="/clan war resume ${war._id}" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">Accept Resume</button>`;
				} else if (iProposedResume && !theyProposedResume) {
					html += `<p style="margin: 0;">Resume proposed. Waiting for ${opponentName} to accept...</p>`;
				} else {
					html += `<p style="margin: 0 0 10px 0;">The war is paused.</p>`;
					html += `<button name="send" value="/clan war resume ${war._id}" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">Resume War</button>`;
				}
			} else {
				if (theyProposedPause && !iProposedPause) {
					html += `<p style="margin: 0 0 10px 0;">${opponentName} has proposed a pause!</p>`;
					html += `<button name="send" value="/clan war pause ${war._id}" style="background: #FFA500; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">Accept Pause</button>`;
				} else if (iProposedPause && !theyProposedPause) {
					html += `<p style="margin: 0;">Pause proposed. Waiting for ${opponentName} to accept...</p>`;
				} else if (theyProposedTie && !iProposedTie) {
					html += `<p style="margin: 0 0 10px 0;">${opponentName} has proposed a tie!</p>`;
					html += `<button name="send" value="/clan war tie ${war._id}" style="background: #9E9E9E; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">Accept Tie</button>`;
				} else if (iProposedTie && !theyProposedTie) {
					html += `<p style="margin: 0;">Tie proposed. Waiting for ${opponentName} to accept...</p>`;
				} else {
					html += `<p style="margin: 0 0 10px 0;">The war is on! Good luck, trainers!</p>`;
					html += `<button name="send" value="/clan war pause ${war._id}" style="background: #FFA500; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px; margin-right: 10px;">Pause War</button> `;
					html += `<button name="send" value="/clan war tie ${war._id}" style="background: #9E9E9E; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">Propose Tie</button>`;
				}
			}
		} else if (war.status === 'completed') {
			html += `<p style="margin: 0;">${Utils.escapeHTML(options.endMessage || 'This war has concluded.')}</p>`;
		}

		html += `</div>`;
	}

	html += `</div>`;
	return html;
}
