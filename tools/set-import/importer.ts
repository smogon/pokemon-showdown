import * as http from 'http';
import * as https from 'https';
import * as url from 'url';
import * as util from 'util';

// tslint:disable: no-implicit-dependencies
// @ts-ignore - index.js installs these for us
import JSON5 = require('json5');
import * as smogon from 'smogon';

import * as Streams from '../../lib/streams';
import {Dex} from '../../sim/dex';
import {TeamValidator} from '../../sim/team-validator';
Dex.includeModData();
const toID = Dex.getId;

type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends (infer I)[]
	? (DeepPartial<I>)[]
	: DeepPartial<T[P]>;
};

interface PokemonSets {
	[speciesid: string]: {
		[name: string]: DeepPartial<PokemonSet>;
	};
}

interface IncomingMessage extends NodeJS.ReadableStream {
	statusCode: number;
	headers: {location?: string};
}

// eg. 'gen1.json'
interface GenerationData {
	[formatid: string]: FormatData;
}

// eg. 'gen7balancedhackmons.json'
interface FormatData {
	[source: string]: PokemonSets;
}

type Generation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// The tiers we support, ie. ones that we have data sources for.
export const TIERS = new Set([
	'ubers', 'ou', 'uu', 'ru', 'nu', 'pu', 'zu', 'lc', 'cap',
	'doublesou', 'battlespotsingles', 'battlespotdoubles', 'battlestadiumsingles',
	'vgc2016', 'vgc2017', 'vgc2018', 'vgc2019ultraseries', '1v1',
	'anythinggoes', 'balancedhackmons', 'letsgoou', 'monotype',
]);
const FORMATS = new Map<ID, {gen: Generation, format: Format}>();
const VALIDATORS = new Map<ID, TeamValidator>();
for (let gen = 1; gen <= 8; gen++) {
	for (const tier of TIERS) {
		const format = Dex.getFormat(`gen${gen}${tier}`);
		if (format.exists) {
			FORMATS.set(format.id, {gen: gen as Generation, format});
			VALIDATORS.set(format.id, new TeamValidator(format));
		}
	}
}

const THIRD_PARTY_SOURCES: {[source: string]: {url: string, files: {[formatid: string]: string}}} = {
	'damagecalc.trainertower.com': {
		url: 'https://raw.githubusercontent.com/jake-white/VGC-Damage-Calculator/gh-pages/script_res/',
		files: {
			gen6vgc2016: 'setdex_nuggetBridge.js',
			gen7vgc2017: 'setdex_tt2017.js',
			gen7vgc2018: 'setdex_tt2018.js',
			gen7vgc2019ultraseries: 'setdex_tt2019.js',
		},
	},
	'cantsay.github.io': {
		url: 'https://raw.githubusercontent.com/cantsay/cantsay.github.io/master/_scripts/',
		files: {
			gen7lgpeou: 'setdex_LG_sets.js',
			gen7bssfactory: 'setdex_factory_sets.js',
			gen5battlespotsingles: 'setdex_gen5_sets.js',
			gen6battlespotsingles: 'setdex_gen6_sets.js',
			gen7battlespotsingles: 'setdex_gen7_sets.js',
		},
	},
};

export async function importAll() {
	const index = await request(smogon.Statistics.URL);

	const imports = [];
	for (let gen = 1; gen <= 8; gen++) {
		imports.push(importGen(gen as Generation, index));
	}

	return Promise.all(imports);
}

async function importGen(gen: Generation, index: string) {
	const data: GenerationData = {};

	const smogonSetsByFormat: {[formatid: string]: PokemonSets} = {};
	const thirdPartySetsByFormat: {[source: string]: {[formatid: string]: PokemonSets}} = {};

	const numByFormat: {[formatid: string]: number} = {};
	const imports = [];
	const dex = Dex.forFormat(`gen${gen}ou`);
	for (const id in dex.data.Pokedex) {
		if (!eligible(dex, id as ID)) continue;
		imports.push(importSmogonSets(dex.getTemplate(id).name, gen, smogonSetsByFormat, numByFormat));
	}
	for (const source in THIRD_PARTY_SOURCES) {
		thirdPartySetsByFormat[source] =
			await importThirdPartySets(gen, source, THIRD_PARTY_SOURCES[source]);
	}
	await Promise.all(imports);

	for (const {format, gen: g} of FORMATS.values()) {
		if (g !== gen) continue;

		if (smogonSetsByFormat[format.id] && Object.keys(smogonSetsByFormat[format.id]).length) {
			data[format.id] = {};
			data[format.id]['smogon.com/dex'] = smogonSetsByFormat[format.id];
			report(format, numByFormat[format.id], 'smogon.com/dex');
		}

		for (const source in thirdPartySetsByFormat) {
			if (thirdPartySetsByFormat[source][format.id] && Object.keys(thirdPartySetsByFormat[source][format.id]).length) {
				data[format.id] = data[format.id] || {};
				data[format.id][source] = thirdPartySetsByFormat[source][format.id];
			}
		}

		const u = getStatisticsURL(index, format);
		try {
			const statistics = smogon.Statistics.parse(await request(u));
			const sets = await importUsageBasedSets(gen, format, statistics);
			if (Object.keys(sets).length) {
				data[format.id] = data[format.id] || {};
				data[format.id]['smogon.com/stats'] = sets;
			}
			data[format.id] = data[format.id] || {};
		} catch (err) {
			error(`${u} = ${err}`);
		}
	}

	return data;
}

function eligible(dex: ModdedDex, id: ID) {
	const gen = toGen(dex, id);
	if (!gen || gen > dex.gen) return false;

	const template = dex.getTemplate(id);
	if (['Mega', 'Primal', 'Ultra'].some(f => template.forme.startsWith(f))) return true;

	// Species with formes distinct enough to merit inclusion
	const unique = ['darmanitan', 'meloetta', 'greninja', 'zygarde'];
	// Too similar to their base forme/species to matter
	const similar = ['pichu', 'pikachu', 'genesect', 'basculin', 'magearna', 'keldeo',  'vivillon'];

	if (template.battleOnly && !unique.some(f => id.startsWith(f))) return false;

	// Most of these don't have analyses
	const capNFE = template.isNonstandard === 'CAP' && template.nfe;

	return !id.endsWith('totem') && !capNFE && !similar.some(f => id.startsWith(f) && id !== f);
}

// TODO: Fix dex data such that CAP mons have a correct gen set
function toGen(dex: ModdedDex, name: string): Generation | undefined {
	const pokemon = dex.getTemplate(name);
	if (pokemon.isNonstandard === 'LGPE') return 7;
	if (!pokemon.exists || (pokemon.isNonstandard && pokemon.isNonstandard !== 'CAP')) return undefined;

	const n = pokemon.num;
	if (n > 810) return 8;
	if (n > 721 || (n <= -23 && n >= -28) || (n <= -120 && n >= -126)) return 7;
	if (n > 649 || (n <= -8 && n >= -22) || (n <= -106 && n >= -110)) return 6;
	if (n > 493 || (n <= -12 && n >= -17) || (n <= -111 && n >= -115)) return 5;
	if (n > 386 || (n <= -1 && n >= -11) || (n <= -101 && n >= -104) || (n <= -116 && n >= -119)) return 4;
	if (n > 251) return 3;
	if (n > 151) return 2;
	if (n > 0) return 1;
}

async function importSmogonSets(
	pokemon: string,
	gen: Generation,
	setsByFormat: {[format: string]: PokemonSets},
	numByFormat: {[format: string]: number}
) {
	const analysesByFormat = await getAnalysesByFormat(pokemon, gen);
	if (!analysesByFormat) return;

	for (const [format, analyses] of analysesByFormat.entries()) {
		const dex = Dex.forFormat(format);
		let setsForPokemon = setsByFormat[format.id];
		if (!setsForPokemon) {
			setsForPokemon = {};
			setsByFormat[format.id] = setsForPokemon;
		}

		for (const analysis of analyses) {
			for (const moveset of analysis.movesets) {
				const set = movesetToPokemonSet(dex, format, pokemon, moveset);
				const name = cleanName(moveset.name);
				// Smogon redirects megas back to a base species, but because Necrozma-Ultra has two bases,
				// Smogon chose to redirect to Necroza-Dawn-Wings. Furthermore, the same set name has been used
				// for both base species, so we also need to add a disambiguating suffix  to avoid overwrites.
				if (pokemon === 'Necrozma-Ultra') {
					addSmogonSet(dex, format, pokemon, `${name} - Dawn-Wings`, set, setsForPokemon, numByFormat);
				} else if (pokemon === 'Necrozma-Dusk-Mane') {
					addSmogonSet(dex, format, 'Necrozma-Ultra', `${name} - Dusk-Mane`, set, setsForPokemon, numByFormat);
					addSmogonSet(dex, format, pokemon, name, set, setsForPokemon, numByFormat);
				} else {
					addSmogonSet(dex, format, pokemon, name, set, setsForPokemon, numByFormat);
				}
			}
		}
	}
}

function addSmogonSet(
	dex: ModdedDex,
	format: Format,
	pokemon: string,
	name: string,
	set: DeepPartial<PokemonSet>,
	setsForPokemon: PokemonSets,
	numByFormat: {[format: string]: number}
) {
	if (validSet('smogon.com/dex', dex, format, pokemon, name, set)) {
		setsForPokemon[pokemon] = setsForPokemon[pokemon] || {};
		setsForPokemon[pokemon][name] = set;
		numByFormat[format.id] = (numByFormat[format.id] || 0) + 1;
	}
}

function cleanName(name: string) {
	return name.replace(/"/g, `'`);
}

function movesetToPokemonSet(dex: ModdedDex, format: Format, pokemon: string, set: smogon.Moveset) {
	const level = getLevel(format, set.level);
	return {
		level: level === 100 ? undefined : level,
		moves: set.moveslots.map(ms => ms[0]),
		ability: fixedAbility(dex, pokemon, set.abilities[0]),
		item: set.items[0] === 'No Item' ? undefined : set.items[0],
		nature: set.natures[0],
		ivs: toStatsTable(set.ivconfigs[0], 31),
		evs: toStatsTable(set.evconfigs[0]),
	};
}

function toStatsTable(stats?: StatsTable, elide = 0) {
	if (!stats) return undefined;

	const s: Partial<StatsTable> = {};
	let stat: keyof StatsTable;
	for (stat in stats) {
		const val = stats[stat];
		if (val !== elide) s[stat] = val;
	}
	return s;
}

function fixedAbility(dex: ModdedDex, pokemon: string, ability?: string) {
	if (dex.gen <= 2) return undefined;
	const template = dex.getTemplate(pokemon);
	if (ability && !['Mega', 'Primal', 'Ultra'].some(f => template.forme.startsWith(f))) return ability;
	return template.abilities[0];
}

function validSet(
	source: string, dex: ModdedDex, format: Format, pokemon: string, name: string, set: DeepPartial<PokemonSet>
) {
	if (skip(dex, format, pokemon, set)) return false;

	const pset = toPokemonSet(dex, format, pokemon, set);
	let invalid = VALIDATORS.get(format.id)!.validateSet(pset, {});
	if (!invalid) return true;
	// Correct invalidations where set is required to be shiny due to an event
	if (invalid.length === 1 && invalid[0].includes('must be shiny')) {
		set.shiny = true;
		pset.shiny = true;
		invalid = VALIDATORS.get(format.id)!.validateSet(pset, {});
		if (!invalid) return true;
	}
	// Allow Gen 4 Arceus sets because they're occasionally useful for tournaments
	if (format.id === 'gen4ubers' && invalid.includes(`${pokemon} is banned.`)) return true;
	const title = `${format.name}: ${pokemon} (${name})'`;
	const details = `${JSON.stringify(set)} = ${invalid.join(', ')}`;
	// console.error(`${color(source, 94)} Invalid set ${color(title, 91)}: ${color(details, 90)}`);
	console.error(color(`${source} Invalid set ${title}: ${details}`, 90));

	return false;
}

function skip(dex: ModdedDex, format: Format, pokemon: string, set: DeepPartial<PokemonSet>) {
	const {gen} = FORMATS.get(format.id)!;
	const hasMove = (m: string) => set.moves && set.moves.includes(m);
	const bh = format.id.includes('balancedhackmons');

	if (pokemon === 'Groudon-Primal' && set.item !== 'Red Orb') return true;
	if (pokemon === 'Kyogre-Primal' && set.item !== 'Blue Orb' && !(bh && gen === 7)) return true;
	if (bh) return false; // Everying else is legal or will get stripped by the team validator anyway

	if (dex.getTemplate(pokemon).forme.startsWith('Mega')) {
		if (pokemon === 'Rayquaza-Mega') {
			return format.id.includes('ubers') || !hasMove('Dragon Ascent');
		} else {
			return dex.getItem(set.item).megaStone !== pokemon;
		}
	}
	if (pokemon === 'Necrozma-Ultra' && set.item !== 'Ultranecrozium Z') return true;
	if (pokemon === 'Greninja-Ash' && set.ability !== 'Battle Bond') return true;
	if (pokemon === 'Zygarde-Complete' && set.ability !== 'Power Construct') return true;
	if (pokemon === 'Darmanitan-Zen' && set.ability !== 'Zen Mode') return true;
	if (pokemon === 'Meloetta-Pirouette' && !hasMove('Relic Song')) return true;

	return false;
}

function toPokemonSet(dex: ModdedDex, format: Format, pokemon: string, set: DeepPartial<PokemonSet>): PokemonSet {
	// To simplify things, during validation we mutate the input set to correct for HP mismatches
	const hp = set.moves && set.moves.find(m => m.startsWith('Hidden Power'));
	let fill = dex.gen === 2 ? 30 : 31;
	if (hp) {
		const type = hp.slice(13);
		if (type && dex.getHiddenPower(fillStats(set.ivs, fill)).type !== type) {
			if (!set.ivs || (dex.gen >= 7 && (!set.level || set.level === 100))) {
				set.hpType = type;
				fill = 31;
			} else if (dex.gen === 2) {
				const dvs = Object.assign({}, dex.getType(type).HPdvs);
				let stat: StatName;
				for (stat in dvs) {
					dvs[stat]! *= 2;
				}
				set.ivs = Object.assign({}, dvs, set.ivs);
				set.ivs.hp = expectedHP(set.ivs);
			} else {
				set.ivs = Object.assign({}, dex.getType(type).HPivs, set.ivs);
			}
		}
	}

	const copy = Object.assign({species: pokemon}, set) as PokemonSet;
	copy.ivs = fillStats(set.ivs, fill);
	// The validator expects us to have at least 1 EV set to prove it is intentional
	if (!set.evs && dex.gen >= 3 && format.id !== 'gen7letsgoou') set.evs = {spe: 1};
	copy.evs = fillStats(set.evs, dex.gen <= 2 ? 252 : 0);
	// The validator wants an ability even when Gen < 3
	copy.ability = copy.ability || 'None';

	// The validator is picky about megas having already evolved or battle only formes
	const template = dex.getTemplate(pokemon);
	const mega = ['Mega', 'Primal', 'Ultra'].some(f => template.forme.startsWith(f));
	if (template.battleOnly || (mega && !format.id.includes('balancedhackmons'))) {
		copy.species = template.baseSpecies;
		copy.ability = dex.getTemplate(template.baseSpecies).abilities[0];
	}
	return copy;
}

function expectedHP(ivs: Partial<StatsTable>) {
	ivs = fillStats(ivs, 31);
	const atkDV = Math.floor(ivs.atk! / 2);
	const defDV = Math.floor(ivs.def! / 2);
	const speDV = Math.floor(ivs.spe! / 2);
	const spcDV = Math.floor(ivs.spa! / 2);
	return 2 * ((atkDV % 2) * 8 + (defDV % 2) * 4 + (speDV % 2) * 2 + (spcDV % 2));
}

function fillStats(stats?: Partial<StatsTable>, fill = 0) {
	return TeamValidator.fillStats(stats || null, fill);
}

const SMOGON = {
	uber: 'ubers',
	doubles: 'doublesou',
	lgpeou: 'letsgoou',
	ag: 'anythinggoes',
	bh: 'balancedhackmons',
	vgc16: 'vgc2016',
	vgc17: 'vgc2017',
	vgc18: 'vgc2018',
	vgc19: 'vgc2019ultraseries',
} as unknown as {[id: string]: ID};

const getAnalysis = retrying(async (u: string) => {
	try {
		return smogon.Analyses.process(await request(u));
	} catch (err) {
		// Don't try HTTP errors that we've already retried
		if (err.message.startsWith('HTTP')) {
			return Promise.reject(err);
		} else {
			return Promise.reject(new RetryableError(err.message));
		}
	}
}, 3, 50);

async function getAnalysesByFormat(pokemon: string, gen: Generation) {
	const u = smogon.Analyses.url(pokemon === 'Meowstic' ? 'Meowstic-M' : pokemon, gen);
	try {
		const analysesByTier = await getAnalysis(u);
		if (!analysesByTier) {
			error(`Unable to process analysis for ${pokemon} in generation ${gen}`);
			return undefined;
		}

		const analysesByFormat = new Map<Format, smogon.Analysis[]>();
		for (const [tier, analyses] of analysesByTier.entries()) {
			const t = toID(tier);
			const f = FORMATS.get(`gen${gen}${SMOGON[t] || t}` as ID);
			if (f) analysesByFormat.set(f.format, analyses);
		}

		return analysesByFormat;
	} catch (err) {
		error(`Unable to process analysis for ${pokemon} in generation ${gen}`);
		return undefined;
	}
}

function getLevel(format: Format, level = 0) {
	if (format.forcedLevel) return format.forcedLevel;
	const maxLevel = format.maxLevel || 100;
	const maxForcedLevel = format.maxForcedLevel || maxLevel;
	if (!level) level = format.defaultLevel || maxLevel;
	return level > maxForcedLevel ? maxForcedLevel : level;
}

// Fallback information for past formats that are most likely not present in current
// usage statistics. Should be updated based on rotational old gen ladders, see the
// `stats` tool in this directory for updating this. The total number of battles is
// also included to help us reason about the quality of the stats data when determining
// a usage threshold
const STATISTICS: {[formatid: string]: [string, number]} = {
	gen1ubers: ['2019-06', 1162],
	gen1uu: ['2017-12', 710],
	gen2nu: ['2018-11', 444],
	gen2ubers: ['2019-07', 389],
	gen2uu: ['2016-08', 1120],
	gen31v1: ['2018-05', 434],
	gen3nu: ['2016-09', 1227],
	gen3ubers: ['2018-08', 960],
	gen3uu: ['2016-11', 562],
	gen4anythinggoes: ['2017-03', 442],
	gen4doublesou: ['2017-10', 61],
	gen4lc: ['2017-08', 45],
	gen4nu: ['2016-10', 515],
	gen4ubers: ['2018-09', 866],
	gen4uu: ['2019-03', 554],
	gen51v1: ['2019-05', 905],
	gen5doublesou: ['2016-12', 166],
	gen5lc: ['2018-05',  37],
	gen5monotype: ['2018-10', 525],
	gen5nu: ['2017-05', 43],
	gen5ru: ['2018-01', 49],
	gen5ubers: ['2016-03', 1666],
	gen5uu: ['2018-04', 232],
	gen61v1: ['2018-09', 1053],
	gen6anythinggoes: ['2017-11', 4274],
	gen6battlespotdoubles: ['2017-07', 40],
	gen6battlespotsingles: ['2017-10', 78],
	gen6cap: ['2018-01', 0],
	gen6doublesou: ['2017-08', 829],
	gen6lc: ['2017-07', 33],
	gen6monotype: ['2018-01', 1],
	gen6nu: ['2017-07', 86],
	gen6pu: ['2017-07', 187],
	gen6ru: ['2017-08', 38],
	gen6ubers: ['2018-11', 2300],
	gen6uu: ['2017-09', 563],
	gen6vgc2016: ['2017-09', 742],
	gen7vgc2017: ['2017-11', 180008],
	gen7vgc2018: ['2018-08', 367649],
};

export function getStatisticsURL(index: string, format: Format) {
	return (STATISTICS[format.id] && !index.includes(format.id)) ?
		`${smogon.Statistics.URL}${STATISTICS[format.id][0]}/chaos/${format.id}-1500.json` :
		smogon.Statistics.url(smogon.Statistics.latest(index), format.id);
}

// TODO: Use bigram matrix, bucketed spreads and generative validation logic for more realistic sets
function importUsageBasedSets(gen: Generation, format: Format, statistics: smogon.UsageStatistics) {
	const sets: PokemonSets = {};
	const dex = Dex.forFormat(format);
	const threshold = getUsageThreshold(format);
	let num = 0;
	for (const pokemon in statistics.data) {
		const stats = statistics.data[pokemon];
		if (eligible(dex, toID(pokemon)) && stats.usage >= threshold) {
			const set: DeepPartial<PokemonSet> = {
				moves: (top(stats.Moves, 4) as string[]).map(m => dex.getMove(m).name).filter(m => m),
			};
			if (gen >= 2 && format.id !== 'gen7letsgoou') {
				const id = top(stats.Items) as string;
				set.item = dex.getItem(id).name;
				if (set.item === 'nothing') set.item = undefined;
			}
			if (gen >= 3) {
				const id = top(stats.Abilities) as string;
				set.ability = fixedAbility(dex, pokemon, dex.getAbility(id).name);
				const { nature, evs } = fromSpread(top(stats.Spreads) as string);
				set.nature = nature;
				if (format.id !== 'gen7letsgoou') {
					if (!evs || !Object.keys(evs).length) continue;
					set.evs = evs;
				}
			}
			const name = 'Showdown Usage';
			if (validSet('smogon.com/stats', dex, format, pokemon, name, set)) {
				sets[pokemon] = {};
				sets[pokemon][name] = set;
				num++;
			}
		}
	}
	report(format, num, 'smogon.com/stats');
	return sets;
}

function getUsageThreshold(format: Format) {
	const unpopular = STATISTICS[format.id];
	// For old metagames with extremely low total battle counts we adjust the thresholds
	if (unpopular) {
		if (unpopular[1] < 100) return Infinity;
		if (unpopular[1] < 400) return 0.05;
	}
	// These formats are deemed to have playerbases of lower quality than normal
	return format.id.match(/uber|anythinggoes|doublesou/) ? 0.03 : 0.01;
}

const STATS: StatName[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

function fromSpread(spread: string) {
	const [nature, revs] = spread.split(':');
	const evs: Partial<StatsTable> = {};
	for (const [i, rev] of revs.split('/').entries()) {
		const ev = Number(rev);
		if (ev) evs[STATS[i]] = ev;
	}
	return { nature, evs };
}

function top(weighted: {[key: string]: number}, n = 1): string | string[] | undefined {
	if (n === 0) return undefined;
	// Optimize the more common case with an linear algorithm instead of log-linear
	if (n === 1) {
		let max;
		for (const key in weighted) {
			if (!max || weighted[max] < weighted[key]) max = key;
		}
		return max;
	}
	return Object.entries(weighted)
		.sort((a, b) => b[1] - a[1])
		.slice(0, n)
		.map(x => x[0]);
}

async function importThirdPartySets(
	gen: Generation, source: string, data: {url: string, files: {[formatid: string]: string}}
) {
	const setsByFormat: {[formatid: string]: PokemonSets} = {};
	for (const formatid in data.files) {
		const f = FORMATS.get(formatid as ID);
		if (!f || f.gen !== gen) continue;
		const {format} = f;
		const dex = Dex.forFormat(format);

		const file = data.files[formatid];
		const raw = await request(`${data.url}${file}`);
		const match = raw.match(/var.*?=.*?({.*})/s);
		if (!match) {
			error(`Could not find sets for ${source} in ${file}`);
			continue;
		}
		// NOTE: These are not really PokemonSets until they've been fixed below
		const json = JSON5.parse(match[1]) as PokemonSets;
		let sets = setsByFormat[format.id];
		if (!sets) {
			sets = {};
			setsByFormat[format.id] = sets;
		}
		let num = 0;
		for (const mon in json) {
			const pokemon = dex.getTemplate(mon).name;
			if (!eligible(dex, toID(pokemon))) continue;

			for (const name in json[mon]) {
				const set = fixThirdParty(dex, pokemon, json[mon][name]);
				if (validSet(source, dex, format, pokemon, name, set)) {
					sets[pokemon] = sets[pokemon] || {};
					sets[pokemon][cleanName(name)] = set;
					num++;
				}
			}
		}
		report(format, num, source);
	}
	return setsByFormat;
}

function fixThirdParty(dex: ModdedDex, pokemon: string, set: DeepPartial<PokemonSet>) {
	set.ability = fixedAbility(dex, pokemon, set.ability);
	if (set.ivs) {
		const ivs: Partial<StatsTable> = {};
		let iv: StatName;
		for (iv in set.ivs) {
			ivs[fromShort(iv) || iv] = Number(set.ivs[iv]);
		}
		set.ivs = ivs;
	}
	if (set.evs) {
		const evs: Partial<StatsTable> = {};
		let ev: StatName;
		for (ev in set.evs) {
			evs[fromShort(ev) || ev] = Number(set.evs[ev]);
		}
		set.evs = evs;
	}
	return set;
}

function fromShort(s: string): StatName | undefined {
	switch (s) {
		case 'hp':
			return 'hp';
		case 'at':
			return 'atk';
		case 'df':
			return 'def';
		case 'sa':
			return 'spa';
		case 'sd':
			return 'spd';
		case 'sp':
			return 'spe';
	}
}

class RetryableError extends Error {
	constructor(message?: string) {
		super(message);
		// restore prototype chain
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

// We throttle to 20 QPS by only issuing one request every 50ms at most. This
// is importantly different than using the more obvious 20 and 1000ms here,
// as it results in more spaced out requests which won't cause as many gettaddrinfo
// ENOTFOUND (nodejs/node-v0.x-archive#5488). Similarly, the evenly spaced
// requests makes us signficantly less likely to encounter ECONNRESET errors
// on macOS (though these are still pretty frequent, Linux is recommended for running
// this tool). Retry up to 5 times with a 20ms backoff increment.
const request = retrying(throttling(fetch, 1, 50), 5, 20);

export function fetch(u: string) {
	const client = u.startsWith('http:') ? http : https;
	return new Promise<string>((resolve, reject) => {
		// @ts-ignore Typescript bug - thinks the second argument should be RequestOptions, not a callback
		const req = client.get(u, (res: IncomingMessage) => {
			if (res.statusCode !== 200) {
				if (res.statusCode >= 500 && res.statusCode < 600) {
					return reject(new RetryableError(`HTTP ${res.statusCode}`));
				} else if (res.statusCode >= 300 && res.statusCode <= 400 && res.headers.location) {
					resolve(fetch(url.resolve(u, res.headers.location)));
				} else {
					return reject(new Error(`HTTP ${res.statusCode}`));
				}
			}
			Streams.readAll(res).then(resolve, reject);
		});
		req.on('error', reject);
		req.end();
	});
}

function retrying<I, O>(fn: (args: I) => Promise<O>, retries: number, wait: number): (args: I) => Promise<O> {
	const retry = async (args: I, attempt = 0): Promise<O> => {
		try {
			return await fn(args);
		} catch (err) {
			if (err instanceof RetryableError) {
				attempt++;
				if (attempt > retries) return Promise.reject(err);
				const timeout = Math.round(attempt * wait * (1 + Math.random() / 2));
				warn(`Retrying ${args} in ${timeout}ms (${attempt}):`, err);
				return new Promise(resolve => {
					setTimeout(() => {
						resolve(retry(args, attempt++));
					}, timeout);
				});
			} else {
				return Promise.reject(err);
			}
		}
	};
	return retry;
}

function throttling<I, O>(fn: (args: I) => Promise<O>, limit: number, interval: number): (args: I) => Promise<O> {
	const queue = new Map();
	let currentTick = 0;
	let activeCount = 0;

	const throttled = (args: I) => {
		let timeout: NodeJS.Timeout;
		return new Promise<O>((resolve, reject) => {
			const execute = async () => {
				resolve(fn(args));
				queue.delete(timeout);
			};

			const now = Date.now();

			if (now - currentTick > interval) {
				activeCount = 1;
				currentTick = now;
			} else if (activeCount < limit) {
				activeCount++;
			} else {
				currentTick += interval;
				activeCount = 1;
			}

			timeout = setTimeout(execute, currentTick - now);
			queue.set(timeout, reject);
		});
	};

	return throttled;
}

function color(s: any, code: number) {
	return util.format(`\x1b[${code}m%s\x1b[0m`, s);
}

function report(format: Format, num: number, source: string) {
	console.info(`${format.name}: ${color(num, 33)} ${color(`(${source})`, 90)}`);
}

function warn(s: string, err: Error) {
	console.warn(`${color(s, 33)} ${color(err.message, 90)}`);
}

function error(s: string) {
	console.error(color(s, 91));
}
