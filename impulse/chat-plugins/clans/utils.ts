/*
* Pokemon Showdown
* Clans Utility Functions 
* @author PrinceSky-Git
*/
import { ClanLogs } from './database';
import type { Clan, ClanPermissions, ClanLogType, ClanWar } from './interface';
import { Utils } from '../../../lib';

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

export const K_FACTOR = 32;

export function getExpectedScore(eloA: number, eloB: number): number {
	return 1 / (1 + 10 ** ((eloB - eloA) / 400));
}

export function calculateElo(winnerElo: number, loserElo: number): [number, number, number] {
	const expectedWinner = getExpectedScore(winnerElo, loserElo);

	const eloChange = Math.max(1, Math.round(K_FACTOR * (1 - expectedWinner)));

	const newWinnerElo = winnerElo + eloChange;
	const newLoserElo = loserElo - eloChange;

	return [newWinnerElo, newLoserElo, eloChange];
}

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
	html += `<center><strong style="font-size: 1.3em;">POKÉMON CLAN WAR</strong><hr style="margin: 5px 0;">`;

	html += `<div style="margin: 10px 0; font-size: 1.1em;">`;
	html += `<strong style="font-size: 1.1em;">${clan1.name}</strong> <span style="font-size: 1.1em; color: #555;">( ${clan1Elo} ELO )</span>`;
	html += ` <strong style="font-size: 1.1em; color: #AAA; margin: 0 10px;">VS</strong> `;
	html += `<strong style="font-size: 1.1em;">${clan2.name}</strong> <span style="font-size: 1.1em; color: #555;">( ${clan2Elo} ELO )</span>`;
	html += `</div>`;

	html += `<div style="margin-top: 10px;"><strong>Format:</strong> Best of ${war.bestOf} (First to ${winsNeeded} wins)</div>`;

	if (perspective === 'ended') {
		html += `<strong>Status:</strong> <span style="color: #999; font-weight: bold;">ENDED</span>`;
		html += `<div style="margin-top: 15px; border-top: 1px dashed #CCC; padding-top: 10px;">`;
		html += `<strong style="font-size: 1.0em;">${Utils.escapeHTML(options.endMessage || 'This challenge is no longer valid.')}</strong>`;
		html += `</div>`;
	} else {
		if (war.status === 'pending') {
			html += `<strong>Status:</strong> <span style="color: #E8A337; font-weight: bold;">PENDING</span>`;
		} else if (war.status === 'active') {
			if (war.paused) {
				html += `<strong>Status:</strong> <span style"color: #E8A337; font-weight: bold;">PAUSED</span><br />`;
			} else {
				html += `<strong>Status:</strong> <span style="color: #4CAF50; font-weight: bold;">ACTIVE</span><br />`;
			}
			html += `<strong style="font-size: 1.0em;">Score:</strong> <span style="font-size: 1.2em; font-weight: bold;">${war.scores[clan1._id] || 0} - ${war.scores[clan2._id] || 0}</span>`;

			if (options.lastBattle) {
				html += `<div style="font-size: 0.9em; color: #555; margin-top: 5px; border-top: 1px solid #EEE; padding-top: 5px;">`;
				html += `Last Battle: <strong>${Utils.escapeHTML(options.lastBattle.winnerName)}</strong> defeated <strong>${Utils.escapeHTML(options.lastBattle.loserName)}</strong> (<strong>${Utils.escapeHTML(options.lastBattle.winningClanName)}</strong> +1)`;
				html += `</div>`;
			}
		} else if (war.status === 'completed') {
			html += `<strong>Status:</strong> <span style="color: #999; font-weight: bold;">COMPLETED</span><br />`;
			html += `<strong style="font-size: 1.0em;">Final Score:</strong> <span style="font-size: 1.0em; font-weight: bold;">${war.scores[clan1._id] || 0} - ${war.scores[clan2._id] || 0}</span>`;
		}

		html += `<div style="margin-top: 15px; border-top: 1px dashed #CCC; padding-top: 10px;">`;

		if (perspective === 'public') {
			if (war.status === 'pending') {
				html += `<em>Waiting for ${clan2.name} to respond...</em>`;
			} else if (war.status === 'active') {
				if (war.paused) {
					html += `<strong>The war is currently paused.</strong>`;
				} else {
					html += `<strong>The war is on!</strong>`;
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
				if (theyProposedResume && !iProposedResume) {
					html += `<strong>${opponentName} has proposed to resume!</strong><br />`;
					html += `<button class="button" name="send" value="/clan war resume ${opponentId}" style="background-color: #4CAF50; color: white;">Accept Resume</button>`;
				} else if (iProposedResume && !theyProposedResume) {
					html += `<em>Resume proposed. Waiting for ${opponentName} to accept...</em><br />`;
				} else {
					html += `<strong>The war is paused.</strong><br />`;
					html += `<button class="button" name="send" value="/clan war resume ${opponentId}" style="background-color: #4CAF50; color: white;">Resume War</button>`;
				}
			} else {
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
					html += `<strong>The war is on!</strong><br />`;
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
