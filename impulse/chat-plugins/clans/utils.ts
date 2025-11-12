// Clans Utility Functions
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
	const m = clan.members[userId];
	if (!m) return false;
	const r = clan.ranks[m.rank];
	if (!r) return false;
	return !!r.permissions[permission];
}

export function to(date: Date, options: { date?: boolean, time?: boolean } = {}): string {
	if (!(date instanceof Date) || isNaN(date.getTime())) return '';
	const { date: d = false, time: t = false } = options;
	if (!d && !t) return date.toISOString();
	let r = '';
	if (d) {
		const y = date.getFullYear();
		const mo = String(date.getMonth() + 1).padStart(2, '0');
		const da = String(date.getDate()).padStart(2, '0');
		r += `${y}-${mo}-${da}`;
	}
	if (t) {
		if (d) r += ' ';
		const h = String(date.getHours()).padStart(2, '0');
		const mi = String(date.getMinutes()).padStart(2, '0');
		const s = String(date.getSeconds()).padStart(2, '0');
		r += `${h}:${mi}:${s}`;
	}
	return r;
}

export function toDurationString(ms: number): string {
	const s = Math.floor(ms / 1000);
	const m = Math.floor(s / 60);
	const h = Math.floor(m / 60);
	const d = Math.floor(h / 24);
	const mo = Math.floor(d / 30);
	const y = Math.floor(d / 365);
	if (y > 0) {
		const rm = Math.floor((d % 365) / 30);
		return rm > 0 ? `${y}y ${rm}mo` : `${y}y`;
	}
	if (mo > 0) {
		const rd = d % 30;
		return rd > 0 ? `${mo}mo ${rd}d` : `${mo}mo`;
	}
	if (d > 0) {
		const rh = h % 24;
		return rh > 0 ? `${d}d ${rh}h` : `${d}d`;
	}
	if (h > 0) {
		const rm = m % 60;
		return rm > 0 ? `${h}h ${rm}m` : `${h}h`;
	}
	if (m > 0) {
		const rs = s % 60;
		return rs > 0 ? `${m}m ${rs}s` : `${m}m`;
	}
	return `${s}s`;
}

export const K_FACTOR = 32;
export function getExpectedScore(eloA: number, eloB: number): number {
	return 1 / (1 + 10 ** ((eloB - eloA) / 400));
}
export function calculateElo(winnerElo: number, loserElo: number): [number, number, number] {
	const exp = getExpectedScore(winnerElo, loserElo);
	const chg = Math.max(1, Math.round(K_FACTOR * (1 - exp)));
	const nw = winnerElo + chg;
	const nl = loserElo - chg;
	return [nw, nl, chg];
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
	const e1 = Math.floor(clan1.stats.elo || 1000);
	const e2 = Math.floor(clan2.stats.elo || 1000);
	const wn = Math.ceil(war.bestOf / 2);
	let h = `<div class="infobox" style="border:2px solid #6688AA;box-shadow:2px 2px 5px rgba(0,0,0,0.1);padding:10px;">`;
	h += `<center><strong style="font-size:1.3em;">POKÉMON CLAN WAR</strong><hr style="margin:5px 0;">`;
	h += `<div style="margin:10px 0;font-size:1.1em;">`;
	h += `<strong style="font-size:1.1em;">${clan1.name}</strong> <span style="font-size:1.1em;color:#555;">( ${e1} ELO )</span>`;
	h += ` <strong style="font-size:1.1em;color:#AAA;margin:0 10px;">VS</strong> `;
	h += `<strong style="font-size:1.1em;">${clan2.name}</strong> <span style="font-size:1.1em;color:#555;">( ${e2} ELO )</span>`;
	h += `</div>`;
	h += `<div style="margin-top:10px;"><strong>Format:</strong> Best of ${war.bestOf} (First to ${wn} wins)</div>`;
	if (perspective === 'ended') {
		h += `<strong>Status:</strong> <span style="color:#999;font-weight:bold;">ENDED</span>`;
		h += `<div style="margin-top:15px;border-top:1px dashed #CCC;padding-top:10px;">`;
		h += `<strong style="font-size:1.0em;">${Utils.escapeHTML(options.endMessage || 'This challenge is no longer valid.')}</strong>`;
		h += `</div>`;
	} else {
		if (war.status === 'pending') {
			h += `<strong>Status:</strong> <span style="color:#E8A337;font-weight:bold;">PENDING</span>`;
		} else if (war.status === 'active') {
			if (war.paused) {
				h += `<strong>Status:</strong> <span style="color:#E8A337;font-weight:bold;">PAUSED</span><br />`;
			} else {
				h += `<strong>Status:</strong> <span style="color:#4CAF50;font-weight:bold;">ACTIVE</span><br />`;
			}
			h += `<strong style="font-size:1.0em;">Score:</strong> <span style="font-size:1.2em;font-weight:bold;">${war.scores[clan1._id] || 0} - ${war.scores[clan2._id] || 0}</span>`;
			if (options.lastBattle) {
				h += `<div style="font-size:0.9em;color:#555;margin-top:5px;border-top:1px solid #EEE;padding-top:5px;">`;
				h += `Last Battle: <strong>${Utils.escapeHTML(options.lastBattle.winnerName)}</strong> defeated <strong>${Utils.escapeHTML(options.lastBattle.loserName)}</strong> (<strong>${Utils.escapeHTML(options.lastBattle.winningClanName)}</strong> +1)`;
				h += `</div>`;
			}
		} else if (war.status === 'completed') {
			h += `<strong>Status:</strong> <span style="color:#999;font-weight:bold;">COMPLETED</span><br />`;
			h += `<strong style="font-size:1.0em;">Final Score:</strong> <span style="font-size:1.0em;font-weight:bold;">${war.scores[clan1._id] || 0} - ${war.scores[clan2._id] || 0}</span>`;
		}
		h += `<div style="margin-top:15px;border-top:1px dashed #CCC;padding-top:10px;">`;
		if (perspective === 'public') {
			if (war.status === 'pending') {
				h += `<em>Waiting for ${clan2.name} to respond...</em>`;
			} else if (war.status === 'active') {
				if (war.paused) {
					h += `<strong>The war is currently paused.</strong>`;
				} else {
					h += `<strong>The war is on!</strong>`;
				}
			} else if (war.status === 'completed') {
				h += `<strong style="font-size:1.0em;">${Utils.escapeHTML(options.endMessage || 'This war has concluded.')}</strong>`;
			}
		} else if (war.status === 'pending') {
			if (perspective === 'challenger') {
				h += `<em>Waiting for ${clan2.name} to respond...</em><br />`;
				h += `<button class="button" name="send" value="/clan war cancel ${clan2._id}">Withdraw Challenge</button>`;
			} else if (perspective === 'target') {
				h += `<strong>${clan1.name} has challenged you!</strong><br />`;
				h += `<button class="button" name="send" value="/clan war accept ${clan1._id}" style="background-color:#4CAF50;color:white;">Accept</button> `;
				h += `<button class="button" name="send" value="/clan war deny ${clan1._id}" style="background-color:#f44336;color:white;">Deny</button>`;
			}
		} else if (war.status === 'active') {
			const mid = perspective === 'challenger' ? clan1._id : clan2._id;
			const oid = perspective === 'challenger' ? clan2._id : clan1._id;
			const onm = perspective === 'challenger' ? clan2.name : clan1.name;
			const iPP = war.pauseConfirmations?.includes(mid);
			const tPP = war.pauseConfirmations?.includes(oid);
			const iPR = war.resumeConfirmations?.includes(mid);
			const tPR = war.resumeConfirmations?.includes(oid);
			const iPT = war.tieConfirmations?.includes(mid);
			const tPT = war.tieConfirmations?.includes(oid);
			if (war.paused) {
				if (tPR && !iPR) {
					h += `<strong>${onm} has proposed to resume!</strong><br />`;
					h += `<button class="button" name="send" value="/clan war resume ${oid}" style="background-color:#4CAF50;color:white;">Accept Resume</button>`;
				} else if (iPR && !tPR) {
					h += `<em>Resume proposed. Waiting for ${onm} to accept...</em><br />`;
				} else {
					h += `<strong>The war is paused.</strong><br />`;
					h += `<button class="button" name="send" value="/clan war resume ${oid}" style="background-color:#4CAF50;color:white;">Resume War</button>`;
				}
			} else {
				if (tPP && !iPP) {
					h += `<strong>${onm} has proposed a pause!</strong><br />`;
					h += `<button class="button" name="send" value="/clan war pause ${oid}">Accept Pause</button>`;
				} else if (iPP && !tPP) {
					h += `<em>Pause proposed. Waiting for ${onm} to accept...</em><br />`;
				} else if (tPT && !iPT) {
					h += `<strong>${onm} has proposed a tie!</strong><br />`;
					h += `<button class="button" name="send" value="/clan war tie ${oid}" style="background-color:#E8A337;color:white;">Accept Tie</button>`;
				} else if (iPT && !tPT) {
					h += `<em>Tie proposed. Waiting for ${onm} to accept...</em><br />`;
				} else {
					h += `<strong>The war is on!</strong><br />`;
					h += `<button class="button" name="send" value="/clan war pause ${oid}">Pause War</button> `;
					h += `<button class="button" name="send" value="/clan war tie ${oid}">Propose Tie</button>`;
				}
			}
		} else if (war.status === 'completed') {
			h += `<strong style="font-size:1.0em;">${Utils.escapeHTML(options.endMessage || 'This war has concluded.')}</strong>`;
		}
		h += `</div>`;
	}
	h += `</center></div>`;
	return h;
}