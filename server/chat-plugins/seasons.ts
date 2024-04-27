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
export const PUBLIC_PHASE_LENGTH = 3;

interface SeasonData {
	current: {period: number, year: number, formatsGeneratedAt: number, season: number};
	badgeholders: {[period: string]: {[format: string]: {[badgeType: string]: string[]}}};
	formatSchedule: Record<string, string[]>;
}

export let data: SeasonData;

try {
	data = JSON.parse(FS('config/chat-plugins/seasons.json').readSync());
} catch {
	data = {
		// force a reroll
		current: {season: null!, year: null!, formatsGeneratedAt: null!, period: null!},
		formatSchedule: {},
		badgeholders: {},
	};
}

export function getBadges(user: User, curFormat: string) {
	let userBadges: {type: string, format: string}[] = [];
	const season = data.current.season; // don't factor in old badges
	for (const format in data.badgeholders[season]) {
		const badges = data.badgeholders[season][format];
		for (const type in badges) {
			if (badges[type].includes(user.id)) {
				// ex badge-bronze-gen9ou-250-1-2024
				userBadges.push({type, format});
			}
		}
	}
	// find which ones we should prioritize showing - badge of current tier/season, then top badges of other formats for this season
	let curFormatBadge;
	for (const [i, badge] of userBadges.entries()) {
		if (badge.format === curFormat) {
			userBadges.splice(i);
			curFormatBadge = badge;
		}
	}
	// now - sort by highest levels
	userBadges = Utils.sortBy(userBadges, x => Object.keys(BADGE_THRESHOLDS).indexOf(x.type))
		.slice(0, 2);
	if (curFormatBadge) userBadges.unshift(curFormatBadge);
	// format and return
	return userBadges;
}

export function setFormatSchedule() {
	// guard heavily against this being overwritten
	if (data.current.formatsGeneratedAt === getYear()) return;
	data.current.formatsGeneratedAt = getYear();
	const formats = generateFormatSchedule();
	for (const [i, formatList] of formats.entries()) {
		data.formatSchedule[i + 1] = FIXED_FORMATS.concat(formatList.slice());
	}
	saveData();
}

class ScheduleGenerator {
	formats: string[][];
	items = new Map<string, number>();
	constructor() {
		this.formats = new Array(SEASONS_PER_YEAR).fill(null).map(() => [] as string[]);
		for (const format of FORMAT_POOL) this.items.set(format, 0);
	}
	generate() {
		for (let i = 0; i < this.formats.length; i++) {
			this.step([i, 0]);
		}
		for (let i = 1; i < SEASONS_PER_YEAR; i++) {
			this.step([0, i]);
		}
		return this.formats;
	}
	swap(x: number, y: number) {
		const item = this.formats[x][y];
		for (let i = 0; i < SEASONS_PER_YEAR; i++) {
			if (this.formats[i].includes(item)) continue;
			for (const [j, cur] of this.formats[i].entries()) {
				if (cur === item) continue;
				if (this.formats[x].includes(cur)) continue;
				this.formats[i][j] = item;
				return cur;
			}
		}
		throw new Error("Couldn't find swap target for " + item + ": " + JSON.stringify(this.formats));
	}
	select(x: number, y: number): string {
		const items = Array.from(this.items).filter(entry => entry[1] < 2);
		const item = Utils.randomElement(items);
		if (item[1] >= 2) {
			this.items.delete(item[0]);
			return this.select(x, y);
		}
		this.items.set(item[0], item[1] + 1);
		if (item[0] && this.formats[x].includes(item[0])) {
			this.formats[x][y] = item[0];
			return this.swap(x, y);
		}
		return item[0];
	}
	step(start: [number, number]) {
		let [x, y] = start;
		while (x < this.formats.length && y < FORMATS_PER_SEASON) {
			const item = this.select(x, y);
			this.formats[x][y] = item;
			x++;
			y++;
		}
	}
}

export function generateFormatSchedule() {
	return new ScheduleGenerator().generate();
}

export async function getLadderTop(format: string) {
	try {
		const results = await Net(`https://${Config.routes.root}/ladder/?format=${toID(format)}&json`).get();
		const reply = JSON.parse(results);
		return reply.toplist;
	} catch (e) {
		Monitor.crashlog(e, "A season ladder request");
		return null;
	}
}

export async function updateBadgeholders() {
	rollSeason();
	const period = `${data.current.season}`;
	if (!data.badgeholders[period]) {
		data.badgeholders[period] = {};
	}
	for (const formatName of data.formatSchedule[findPeriod()]) {
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

function findPeriod() {
	return Math.floor(new Date().getMonth() / (SEASONS_PER_YEAR - 1)) + 1;
}

/** Are we in the last three days of the month (the public phase, where badged battles are public and the room is active?) */
function checkPublicPhase() {
	const daysInCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
	// last 3 days of the month
	return new Date().getDate() >= (daysInCurrentMonth - PUBLIC_PHASE_LENGTH);
}

export function saveData() {
	FS('config/chat-plugins/seasons.json').writeUpdate(() => JSON.stringify(data));
}

export function rollSeason() {
	const year = getYear();
	if (data.current.year !== year) {
		data.current.year = year;
		setFormatSchedule();
	}
	if (findPeriod() !== data.current.period) {
		data.current.season++;
		data.badgeholders[data.current.season] = {};
		for (const k of data.formatSchedule[findPeriod()]) {
			data.badgeholders[data.current.season][`gen${Dex.gen}${k}`] = {};
		}
		data.current.period = findPeriod();
		saveData();
	}
}

export let updateTimeout: NodeJS.Timer | true | null = null;

export function rollTimer() {
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

	const discussionRoom = Rooms.search('seasondiscussion');
	if (discussionRoom) {
		if (checkPublicPhase() && discussionRoom.settings.isPrivate) {
			discussionRoom.setPrivate(false);
			discussionRoom.settings.modchat = 'autoconfirmed';
			discussionRoom.add(
				`|html|<div class="broadcast-blue"><strong>The public phase of the month has now started!</strong>` +
				`<br /> Badged battles are now forced public, and this room is open for use.</div>`
			).update();
		} else if (!checkPublicPhase() && !discussionRoom.settings.isPrivate) {
			discussionRoom.setPrivate(true);
			discussionRoom.settings.modchat = '#';
			discussionRoom.add(
				`|html|<div class="broadcast-blue">The public phase of the month has ended.</div>`
			).update();
		}
	}
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
			const match = findPeriod() === Number(period);
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
		const season = toID(query.shift()) || `${data.current.season}`;
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
				buf += `<h3>Season ${s}</h3><hr />`;
				for (const f in data.badgeholders[season]) {
					buf += `<a class="button" name="send" target="replace" href="/view-seasonladder-${f}-${s}">${Dex.formats.get(f).name}</a>`;
				}
				buf += `<br />`;
			}
			return buf;
		}
		this.title += ` ${format} [Season ${season}]`;
		const uppercase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
		let formatName = Dex.formats.get(format).name;
		// futureproofing for gen10/etc
		const room = Rooms.search(format.split(/\d+/)[1] + "");
		if (room) {
			formatName = `<a href="/${room.roomid}">${formatName}</a>`;
		}
		buf += `<h2>Season results for ${formatName} [${season}]</h2>`;
		buf += `<small><a target="replace" href="/view-seasonladder">View past seasons</a></small>`;
		let i = 0;
		for (const badgeType in data.badgeholders[season][format]) {
			buf += `<div class="ladder pad"><table>`;
			let formatType = format.split(/gen\d+/)[1];
			if (!['ou', 'randombattle'].includes(formatType)) formatType = 'rotating';
			buf += `<tr><h2><img src="https://${Config.routes.client}/sprites/misc/${formatType}_${badgeType}.png" /> ${uppercase(badgeType)}</h2></tr>`;
			for (const userid of data.badgeholders[season][format][badgeType]) {
				i++;
				buf += `<tr><td>${i}</td><td><a href="https://${Config.routes.root}/users/${userid}">${userid}</a></td></tr>`;
			}
			buf += `</table></div>`;
		}
		return buf;
	},
};

export const handlers: Chat.Handlers = {
	onBattleStart(user, room) {
		if (!room.battle) return; // should never happen, just sating TS
		// now first verify they have a badge
		const badges = getBadges(user, room.battle.format);
		if (!badges.length) return;
		const slot = room.battle.playerTable[user.id]?.slot;
		if (!slot) return; // not in battle fsr? wack
		for (const badge of badges) {
			room.add(`|badge|${slot}|${badge.type}|${badge.format}|${BADGE_THRESHOLDS[badge.type]}-${data.current.season}`);
		}

		if (
			checkPublicPhase() && !room.battle.forcedSettings.privacy &&
			badges.filter(x => x.format === room.battle!.format).length && room.battle.rated
		) {
			room.battle.forcedSettings.privacy = 'medal';
			room.add(
				`|html|<div class="broadcast-red"><strong>This battle is required to be public due to one or more player having a season medal.</strong><br />` +
				`During the public phase, you can discuss the state of the ladder <a href="/seasondiscussion">in a special chatroom.</a></div>`
			);
			room.setPrivate(false);
		}

		room.add(
			`|uhtml|medal-msg|<div class="broadcast-blue">Curious what those medals under the avatar are? PS now has Ladder Seasons!` +
			` For more information, check out the <a href="https://www.smogon.com/forums/threads/3740067/">thread on Smogon.</a></div>`
		);
		room.update();
	},
};
