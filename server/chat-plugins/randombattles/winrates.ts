/**
 * A chat plugin to store, calculate, and view winrates in random battle formats.
 * @author mia-pi-git
 */

import {FS, Utils} from '../../../lib';

interface Stats {
	elo: number;
	month: string;
	formats: Record<string, FormatData>;
}

interface MonEntry {
	timesGenerated: number;
	numWins: number;
}

interface FormatData {
	mons: Record<string, MonEntry>;
	period?: number; // how often it resets - defaults to 1mo
}

const STATS_PATH = 'logs/randbats/{{MONTH}}-winrates.json';
export const stats: Stats = getDefaultStats();

try {
	const path = STATS_PATH.replace('{{MONTH}}', getMonth());
	if (!FS('logs/randbats/').existsSync()) {
		FS('logs/randbats/').mkdirSync();
	}
	const savedStats = JSON.parse(FS(path).readSync());
	stats.elo = savedStats.elo;
	stats.month = savedStats.month;
	for (const k in stats.formats) {
		stats.formats[k] = savedStats.formats[k] || stats.formats[k];
	}
} catch {}

function getDefaultStats() {
	return {
		elo: 1500,
		month: getMonth(),
		formats: {
			// all of these requested by rands staff. they don't anticipate it being changed much
			// so i'm not spending the time to add commands to toggle this
			gen9randombattle: {mons: {}},
			gen9randomdoublesbattle: {mons: {}},
			gen8randombattle: {mons: {}},
			gen7randombattle: {mons: {}},
			gen6randombattle: {mons: {}},
			gen5randombattle: {mons: {}},
			gen4randombattle: {mons: {}},
			gen3randombattle: {mons: {}},
			gen2randombattle: {mons: {}},
			gen1randombattle: {mons: {}},
		},
	} as Stats;
}

export function saveStats(month = getMonth()) {
	// clone to avoid race conditions with the data getting deleted later (on month rollover)
	const curStats = {...stats};
	FS(STATS_PATH.replace('{{MONTH}}', month)).writeUpdate(() => JSON.stringify(curStats));
}

function getMonth() {
	return Chat.toTimestamp(new Date()).split(' ')[0].slice(0, -3);
}

// no, this cannot be baseSpecies - some formes matter, ex arceus formes
// no, there is no better way to do this.
// yes, i tried.
function getSpeciesName(set: PokemonSet, format: Format) {
	const species = set.species;
	const item = Dex.items.get(set.item);
	const moves = set.moves;
	const megaRayquazaPossible = ['gen6', 'gen7'].includes(format.mod) && !format.ruleset.includes('Mega Rayquaza Clause');
	if (species.startsWith("Pikachu-")) {
		return 'Pikachu';
	} else if (species.startsWith("Unown-")) {
	  return 'Unown';
	} else if (species === "Gastrodon-East") {
		return 'Gastrodon';
	} else if (species === "Magearna-Original") {
	  return "Magearna";
	} else if (species === "Genesect-Douse") {
		return "Genesect";
	} else if (species === "Dudunsparce-Three-Segment") {
		return 'Dudunsparce';
	} else if (species === "Maushold-Four") {
		return 'Maushold';
	} else if (species === "Greninja-Bond") {
		return 'Greninja';
	} else if (species === "Keldeo-Resolute") {
		return 'Keldeo';
	} else if (species === "Zarude-Dada") {
		return 'Zarude';
	} else if (species === 'Polteageist-Antique') {
		return 'Polteageist';
	} else if (species === 'Sinistcha-Masterpiece') {
		return 'Sinistcha';
	} else if (species === "Squawkabilly-Blue") {
		return "Squawkabilly";
	} else if (species === "Squawkabilly-White") {
		return "Squawkabilly-Yellow";
	} else if (species.startsWith("Basculin-")) {
		return "Basculin";
	} else if (species.startsWith("Sawsbuck-")) {
		return "Sawsbuck";
	} else if (species.startsWith("Vivillon-")) {
		return "Vivillon";
	} else if (species.startsWith("Florges-")) {
		return "Florges";
	} else if (species.startsWith("Furfrou-")) {
		return "Furfrou";
	} else if (species.startsWith("Minior-")) {
		return "Minior";
	} else if (species.startsWith("Toxtricity-")) {
		return 'Toxtricity';
	} else if (species.startsWith("Tatsugiri-")) {
		return 'Tatsugiri';
	} else if (species.startsWith("Alcremie-")) {
		return 'Alcremie';
	} else if (species === "Zacian" && item.name === "Rusted Sword") {
		return 'Zacian-Crowned';
	} else if (species === "Zamazenta" && item.name === "Rusted Shield") {
		return "Zamazenta-Crowned";
	} else if (species === "Kyogre" && item.name === "Blue Orb") {
		return "Kyogre-Primal";
	} else if (species === "Groudon" && item.name === "Red Orb") {
		return "Groudon-Primal";
	} else if (item.megaStone) {
		return item.megaStone;
	} else if (species === "Rayquaza" && moves.includes('Dragon Ascent') && !item.zMove && megaRayquazaPossible) {
		return "Rayquaza-Mega";
	} else {
		return species;
	}
}

function checkRollover() {
	if (stats.month !== getMonth()) {
		saveStats(stats.month);
		Object.assign(stats, getDefaultStats());
		saveStats();
	}
}

const getZScore = (data: MonEntry) => (
	2 * Math.sqrt(data.timesGenerated) * (data.numWins / data.timesGenerated - 0.5)
);


export const handlers: Chat.Handlers = {
	onBattleEnd(battle, winner, players) {
		void collectStats(battle, winner, players);
	},
};

async function collectStats(battle: RoomBattle, winner: ID, players: ID[]) {
	const formatData = stats.formats[battle.format];
	let eloFloor = stats.elo;
	const format = Dex.formats.get(battle.format);
	if (format.mod === 'gen2') {
		// ladder is inactive, so use a lower threshold
		eloFloor = 1150;
	} else if (format.mod !== `gen${Dex.gen}`) {
		eloFloor = 1300;
	} else if (format.gameType === 'doubles') {
		// may need to be raised again if doubles ladder takes off
		eloFloor = 1300;
	}
	if (!formatData || battle.rated < eloFloor || !winner) return;
	checkRollover();
	for (const p of battle.players) {
		const team = await battle.getPlayerTeam(p);
		if (!team) return; // ???
		const mons = team.map(f => getSpeciesName(f, format));
		for (const mon of mons) {
			if (!formatData.mons[mon]) formatData.mons[mon] = {timesGenerated: 0, numWins: 0};
			formatData.mons[mon].timesGenerated++;
			if (toID(winner) === toID(p.name)) {
				formatData.mons[mon].numWins++;
			}
		}
	}
	saveStats();
}

export const commands: Chat.ChatCommands = {
	rwr: 'randswinrates',
	randswinrates(target, room, user) {
		target = toID(target);
		if (/^(gen|)[0-9]+$/.test(target)) {
			if (target.startsWith('gen')) target = target.slice(3);
			target = `gen${target}randombattle`;
		}
		return this.parse(`/j view-winrates-${target ? Dex.formats.get(target).id : `gen${Dex.gen}randombattle`}`);
	},
	randswinrateshelp: [
		'/randswinrates OR /rwr [format] - Get a list of the win rates for all Pokemon in the given Random Battles format.',
	],

	async removewinrates(target, room, user) {
		this.checkCan('rangeban');
		if (!/^[0-9]{4}-[0-9]{2}$/.test(target) || target === getMonth()) {
			return this.errorReply(`Invalid month: ${target}`);
		}
		const path = STATS_PATH.replace('{{MON}}', target);
		if (!(await FS(path).exists())) {
			return this.errorReply(`No stats for the month ${target}.`);
		}
		await FS(path).unlinkIfExists();
		this.globalModlog('REMOVEWINRATES', null, target);
		this.privateGlobalModAction(`${user.name} removed Random Battle winrates for the month of ${target}`);
	},
};

export const pages: Chat.PageTable = {
	async winrates(query, user) {
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		query = query.join('-').split('--');
		const format = toID(query.shift());
		if (!format) return this.errorReply(`Specify a format to view winrates for.`);
		if (!stats.formats[format]) {
			return this.errorReply(`That format does not have winrates tracked.`);
		}
		checkRollover();
		const sorter = toID(query.shift() || 'zscore');
		if (!['zscore', 'raw'].includes(sorter)) {
			return this.errorReply(`Invalid sorting method. Must be either 'zscore' or 'raw'.`);
		}
		const month = query.shift() || getMonth();
		if (!/^[0-9]{4}-[0-9]{2}$/.test(month)) {
			return this.errorReply(`Invalid month: ${month}`);
		}
		const isOldMonth = month !== getMonth();
		if (isOldMonth && !(await FS(STATS_PATH.replace('{{MONTH}}', month)).exists())) {
			return this.errorReply(`There are no winrates for that month.`);
		}
		const formatTitle = Dex.formats.get(format).name;
		let buf = `<div class="pad"><h2>Winrates for ${formatTitle} (${month})</h2>`;
		const prevMonth = new Date(new Date(`${month}-15`).getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 7);
		let hasButton = false;
		if (await FS(STATS_PATH.replace('{{MONTH}}', prevMonth)).exists()) {
			buf += `<a class="button" href="/view-winrates-${format}--${sorter}--${prevMonth}">Previous month</a>`;
			hasButton = true;
		}
		const nextMonth = new Date(new Date(`${month}-15`).getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 7);
		if (await FS(STATS_PATH.replace('{{MONTH}}', nextMonth)).exists()) {
			if (hasButton) buf += ` | `;
			buf += `<a class="button" href="/view-winrates-${format}--${sorter}--${nextMonth}">Next month</a>`;
			hasButton = true;
		}
		buf += hasButton ? ` | ` : '';
		const otherSort = sorter === 'zscore' ? 'Raw' : 'Z-Score';
		buf += `<a class="button" target="replace" href="/view-winrates-${format}--${toID(otherSort)}--${month}">`;
		buf += `Sort by ${otherSort} descending</a>`;
		buf += `<hr />`;
		const statData: Stats = month === stats.month ?
			stats : JSON.parse(await FS(STATS_PATH.replace('{{MONTH}}', month)).read());
		const formatData = statData.formats[format];
		if (!formatData) {
			buf += `<div class="message-error">No stats for that format found on that month.</div>`;
			return buf;
		}
		this.title = `[Winrates] [${format}] ${month}`;
		let sortFn: (val: [string, MonEntry]) => Utils.Comparable;

		if (sorter === 'zscore') {
			sortFn = ([_, data]) => [-getZScore(data), -data.timesGenerated];
		} else {
			sortFn = ([_, data]) => [
				-(data.numWins / data.timesGenerated), -data.numWins, -data.timesGenerated,
			];
		}
		const mons = Utils.sortBy(Object.entries(formatData.mons), sortFn);
		buf += `<div class="ladder pad"><table><tr><th>Pokemon</th><th>Win %</th><th>Z-Score</th>`;
		buf += `<th>Raw wins</th><th>Times generated</th></tr>`;
		for (const [mon, data] of mons) {
			buf += `<tr><td>${Dex.species.get(mon).name}</td>`;
			const {timesGenerated, numWins} = data;
			buf += `<td>${((numWins / timesGenerated) * 100).toFixed(2)}%</td>`;
			buf += `<td>${getZScore(data).toFixed(3)}</td>`;
			buf += `<td>${numWins}</td><td>${timesGenerated}</td>`;
			buf += `</tr>`;
		}
		buf += `</table></div></div>`;
		return buf;
	},
};
