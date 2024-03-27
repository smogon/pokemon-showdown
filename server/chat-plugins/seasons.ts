/**
 * @author mia-pi-git
 */

import {FS, Net, Utils} from '../../lib';

export const SEASONS_PER_YEAR = 4;
export const FORMATS_PER_SEASON = 4;
export const BADGE_THRESHOLDS: Record<string, number> = {
	gold: 3,
	silver: 30,
	bronze: 100,
};
export const FIXED_FORMATS = ['randombattle', 'ou'];
export const FORMAT_POOL = ['ubers', 'uu', 'ru', 'nu', 'pu', 'lc', 'doublesou', 'monotype'];

interface SeasonData {
	current: {season: number, year: number, formatsGeneratedAt: number};
	badgeholders: {[period: string]: {[format: string]: {[badgeType: string]: string[]}}};
	formatSchedule: Record<string, string[]>;
}

export let data: SeasonData;

try {
	data = JSON.parse(FS('config/chat-plugins/seasons.json').readSync());
} catch {
	data = {
		// force a reroll
		current: {season: null!, year: null!, formatsGeneratedAt: null!},
		formatSchedule: {},
		badgeholders: {},
	};
}

export function getBadges(user: User, curFormat: string) {
	let userBadges: {type: string, format: string, season: string}[] = [];
	for (const season in data.badgeholders) {
		for (const format in data.badgeholders[season]) {
			const badges = data.badgeholders[season][format];
			for (const type in badges) {
				if (badges[type].includes(user.id)) {
					// ex badge-bronze-gen9ou-250-1-2024
					userBadges.push({type, format, season});
				}
			}
		}
	}
	// find which ones we should prioritize showing - badge of current tier/season, then top badges of other formats for this season
	let curFormatBadge;
	// first, prioritize current tier/season
	const curSeason = `${getYear()}-${findSeason()}`;
	for (const [i, badge] of userBadges.entries()) {
		if (badge.format === curFormat && badge.season === curSeason) {
			userBadges.splice(i);
			curFormatBadge = badge;
		}
	}
	// now - sort by highest levels
	userBadges = Utils.sortBy(userBadges, x => Object.keys(BADGE_THRESHOLDS).indexOf(x.type))
		.filter(x => x.season === curSeason)
		.slice(0, 2);
	if (curFormatBadge) userBadges.unshift(curFormatBadge);
	// format and return
	return userBadges;
}

export function generateFormatSchedule() {
	// guard heavily against this being overwritten
	if (data.current.formatsGeneratedAt === getYear()) return;
	data.current.formatsGeneratedAt = getYear();
	const counter: Record<string, number> = {};
	for (let period = 1; period < (SEASONS_PER_YEAR + 1); period++) {
		FIXED_FORMATS.slice();
		data.formatSchedule[period] = [];
		const formatPool = FORMAT_POOL.filter(x => !counter[x] || counter[x] < 2);
		for (let i = 0; i < FORMATS_PER_SEASON; i++) {
			const format = Utils.randomElement(formatPool);
			const idx = formatPool.indexOf(format);
			formatPool.splice(idx, 1);
			if (!counter[format]) counter[format] = 0;
			counter[format]++;
			data.formatSchedule[period].push(format);
		}
	}
	saveData();
}

export async function getLadderTop(format: string) {
	try {
		const results = await Net(`https://${Config.routes.root}/ladder/?format=${toID(format)}&json`).get();
		const reply = JSON.parse(results);
		return reply.toplist;
	} catch (e) {
		Monitor.crashlog(e, "a season ladder request");
		return null;
	}
}

export async function updateBadgeholders() {
	rollSeason();
	const season = findSeason();
	const period = `${getYear()}-${season}`;
	if (!data.badgeholders[period]) {
		data.badgeholders[period] = {};
	}
	for (const formatName of data.formatSchedule[season]) {
		const formatid = `gen${Dex.gen}${formatName}`;
		const response = await getLadderTop(formatid);
		if (!response) continue; // ??
		const newHolders: Record<string, string[]> = {};
		for (const [i, row] of response.entries()) {
			let badgeType = null;
			for (const type in BADGE_THRESHOLDS) {
				if ((i + 1) <= BADGE_THRESHOLDS[type]) {
					badgeType = type;
					break;
				}
			}
			if (!badgeType) break;
			if (!newHolders[badgeType]) newHolders[badgeType] = [];
			newHolders[badgeType].push(row.userid);
		}
		data.badgeholders[period][formatid] = newHolders;
	}
	saveData();
}

function getYear() {
	return new Date().getFullYear();
}

function findSeason() {
	return Math.floor(new Date().getMonth() / (SEASONS_PER_YEAR - 1)) + 1;
}

export function saveData() {
	FS('config/chat-plugins/seasons.json').writeUpdate(() => JSON.stringify(data));
}

export function rollSeason() {
	const year = getYear();
	if (data.current.year !== year) {
		data.current.year = year;
		generateFormatSchedule();
	}
	if (findSeason() !== data.current.season) {
		data.current.season = findSeason();
		saveData();
	}
}

export let updateTimeout: NodeJS.Timer | true | null = null;

function rollTimer() {
	if (updateTimeout === true) return;
	if (updateTimeout) {
		clearTimeout(updateTimeout);
	}
	updateTimeout = true;
	void updateBadgeholders();
	const time = Date.now();
	const next = new Date();
	next.setHours(next.getHours() + 1);
	next.setMinutes(0, 0, 0);
	updateTimeout = setTimeout(() => rollTimer(), next.getTime() - time);
}

export function destroy() {
	if (updateTimeout && typeof updateTimeout !== 'boolean') {
		clearTimeout(updateTimeout);
	}
}

rollTimer();

export const commands: Chat.ChatCommands = {
	seasonschedule: 'seasons',
	seasons() {
		return this.parse(`/join view-seasonschedule`);
	},
};

export const pages: Chat.PageTable = {
	seasonschedule() {
		this.checkCan('globalban');
		let buf = `<div class="pad"><h2>Season schedule for ${getYear()}</h2><br />`;
		buf += `<div class="ladder pad"><table><tr><th>Season #</th><th>Formats</th></tr>`;
		for (const period in data.formatSchedule) {
			const match = findSeason() === Number(period);
			const formatString = data.formatSchedule[period]
				.sort()
				.map(x => Dex.formats.get(x).name.replace(`[Gen ${Dex.gen}]`, ''))
				.join(', ');
			buf += `<tr><td>${match ? `<strong>${period}</strong>` : period}</td>`;
			buf += `<td>${match ? `<strong>${formatString}</strong>` : formatString}</td></tr>`;
		}
		buf += `</tr></table></div>`;
		return buf;
	},
	seasonladder(query, user) {
		const format = toID(query.shift());
		const season = query.join('-') || `${getYear()}-${findSeason()}`;
		if (!data.badgeholders[season]) {
			return this.errorReply(`Season ${season} not found.`);
		}
		this.title = `[Seasons]`;
		let buf = '<div class="pad">';
		if (!Object.keys(data.badgeholders[season]).includes(format)) {
			// fall back to the master list so that people can still access this easily from the ladder page of other formats
			this.title += ` All`;
			buf += `<h2>Season Records</h2>`;
			const seasonsDesc = Utils.sortBy(
				Object.keys(data.badgeholders),
				s => s.split('-').map(x => -Number(x))
			);
			for (const s of seasonsDesc) {
				buf += `<h3>${s}</h3><hr />`;
				for (const f in data.badgeholders[season]) {
					buf += `<a class="button" name="send" target="replace" href="/view-seasonladder-${f}-${s}">${Dex.formats.get(format).name}</a>`;
				}
				buf += `<br />`;
			}
			return buf;
		}
		this.title += ` ${format} [${season}]`;
		const uppercase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
		let formatName = Dex.formats.get(format).name;
		// futureproofing for gen10/etc
		const room = Rooms.search(format.split(/\d+/)[1] + "");
		if (room) {
			formatName = `<a href="/${room.roomid}">${formatName}</a>`;
		}
		buf += `<h2>Season results for ${formatName} [${season}]</h2>`;
		let i = 0;
		for (const badgeType in data.badgeholders[season][format]) {
			buf += `<div class="ladder pad"><table>`;
			buf += `<tr><h2><img src="${Config.routes.client}/sprites/misc/${badgeType}.png" /> ${uppercase(badgeType)}</h2></tr>`;
			for (const userid of data.badgeholders[season][format][badgeType]) {
				i++;
				buf += `<tr><td>${i}</td><td><a href="${Config.routes.root}/users/${userid}">${userid}</a></td></tr>`;
			}
			buf += `</table></div>`;
		}
		return buf;
	},
};

export const handlers: Chat.Handlers = {
	onBattleJoin(slot, user, battle) {
		const badges = getBadges(user, battle.format);
		for (const badge of badges) {
			battle.room.add(`|badge|${slot}|${badge.type}|${badge.format}|${BADGE_THRESHOLDS[badge.type]}-${badge.season}`);
		}
		battle.room.update();
	},
};
