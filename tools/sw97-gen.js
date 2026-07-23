'use strict';
/**
 * Generator for the [Gen 2] Spaceworld '97 mod (data/mods/gen2sw97).
 *
 * Reads the pret/pokegold-spaceworld disassembly and emits pokedex.ts,
 * learnsets.ts and formats-data.ts, keeping the beta data pure (placeholder
 * stats, disabled evolutions and beta typings included). moves.ts is
 * hand-maintained (the 14 beta-only moves need scripted effects) and is NOT
 * overwritten by this tool.
 *
 * Usage:  node tools/sw97-gen.js /path/to/pokegold-spaceworld
 * Requires a built dist/ (run `node build` first).
 *
 * Correctness note: asm comments (everything from the first ';') are stripped
 * BEFORE matching, so commented-out (disabled) beta evolutions/moves are
 * ignored — replicating the ROM's actual active state.
 */
const fs = require('fs');
const path = require('path');

const DEC = process.argv[2];
if (!DEC || !fs.existsSync(DEC)) {
	console.error('Usage: node tools/sw97-gen.js /path/to/pokegold-spaceworld');
	process.exit(1);
}
const OUT = path.join(__dirname, '..', 'data', 'mods', 'gen2sw97');
const { Dex } = require('../dist/sim');
const g2 = Dex.mod('gen2');

const R = f => fs.readFileSync(path.join(DEC, f), 'utf8').split(/\r?\n/);
const strip = l => { const i = l.indexOf(';'); return (i >= 0 ? l.slice(0, i) : l).trim(); };
const toID = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const psMoveId = mv => toID(mv.replace(/^MOVE_/, ''));

const TYPE = {
	TYPE_NORMAL: 'Normal', TYPE_FIGHTING: 'Fighting', TYPE_FLYING: 'Flying', TYPE_POISON: 'Poison',
	TYPE_GROUND: 'Ground', TYPE_ROCK: 'Rock', TYPE_BIRD: 'Flying', TYPE_BUG: 'Bug', TYPE_GHOST: 'Ghost',
	TYPE_METAL: 'Steel', TYPE_FIRE: 'Fire', TYPE_WATER: 'Water', TYPE_GRASS: 'Grass',
	TYPE_ELECTRIC: 'Electric', TYPE_PSYCHIC: 'Psychic', TYPE_ICE: 'Ice', TYPE_DRAGON: 'Dragon', TYPE_DARK: 'Dark',
};

// 1) internal order + comment
const order = [];
for (const raw of R('constants/pokemon_constants.asm')) {
	const m = raw.match(/^\tconst MON_(\w+)\s*;\s*[0-9a-f]+\s*(.*)$/);
	if (m && m[1] !== 'NONE') order.push({ internal: m[1], comment: (m[2] || '').trim() });
}

// 2) base stats
function parseBase(internal) {
	const file = 'data/pokemon/base_stats/' + internal.toLowerCase() + '.asm';
	if (!fs.existsSync(path.join(DEC, file))) return null;
	const rawLines = R(file);
	const lines = rawLines.map(strip);
	const out = { tmhm: [] };
	for (const l of lines) {
		let m;
		if ((m = l.match(/^db\s+(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)$/)) && !out.stats) {
			const s = m.slice(1, 7).map(Number); // hp atk def SPEED SPATK SPDEF
			out.stats = { hp: s[0], atk: s[1], def: s[2], spa: s[4], spd: s[5], spe: s[3] };
		}
		if ((m = l.match(/^db\s+(TYPE_\w+),\s*(TYPE_\w+)$/))) {
			const t = [TYPE[m[1]], TYPE[m[2]]];
			out.types = t[0] === t[1] ? [t[0]] : t;
		}
		if ((m = l.match(/^db\s+(GENDER_\w+)$/))) out.gender = m[1];
		if ((m = l.match(/^tmhm\s+(.+)$/))) out.tmhm = m[1].split(',').map(x => +x.trim()).filter(x => !isNaN(x));
	}
	return out;
}

// 3) evos_attacks (comment-stripped)
const ea = R('data/pokemon/evos_attacks.asm').map(strip);
const evoMoves = {};
{
	let cur = null, phase = null;
	for (const l of ea) {
		let m = l.match(/^(\w+)EvosAttacks:$/);
		if (m) { cur = m[1].toUpperCase(); evoMoves[cur] = { evos: [], moves: [] }; phase = 'evo'; continue; }
		if (!cur) continue;
		if (/^db 0$/.test(l)) { if (phase === 'evo') phase = 'move'; else cur = null; continue; }
		if ((m = l.match(/^db (EVOLVE_\w+), (.+)$/)) && phase === 'evo') evoMoves[cur].evos.push({ kind: m[1], args: m[2].split(',').map(s => s.trim()) });
		if ((m = l.match(/^db (\d+), (MOVE_\w+)$/)) && phase === 'move') evoMoves[cur].moves.push({ level: +m[1], move: m[2] });
	}
}

// 4) TM/HM order
const tmList = [];
for (const raw of R('data/moves/tmhm_moves.asm')) { const m = strip(raw).match(/^db (MOVE_\w+)$/); if (m) tmList.push(m[1]); }

// assemble mons
const mons = {};
for (const { internal, comment } of order) {
	const base = parseBase(internal);
	if (!base) continue;
	mons[internal] = { internal, comment, ...base, ...(evoMoves[internal] || { evos: [], moves: [] }) };
}

// resolver: internal -> {id, isNew}
const ALIAS = { MOKOKO: 'flaaffy', PAON: 'phanpy', HAGANEIL: 'steelix' }; // evolution/typing-confirmed
function resolve(internal, comment) {
	if (ALIAS[internal]) return { id: ALIAS[internal], isNew: false };
	let cand = internal;
	if (comment && !comment.startsWith('(')) { const lead = comment.match(/^([A-Z][A-Z0-9_]*)/); if (lead) cand = lead[1]; }
	const sp = g2.species.get(toID(cand));
	if (sp.exists && sp.num >= 1 && sp.num <= 251) return { id: sp.id, isNew: false };
	return { id: toID(internal), isNew: true };
}
const RES = {};
for (const internal of Object.keys(mons)) RES[internal] = resolve(internal, mons[internal].comment);
const dexTargetInternal = dexArg => dexArg.replace(/^DEX_/, '');

function genderField(g) {
	if (g === 'GENDER_MALE') return 'genderRatio: { M: 1, F: 0 },';
	if (g === 'GENDER_FEMALE') return 'genderRatio: { M: 0, F: 1 },';
	if (g === 'GENDER_UNKNOWN') return 'gender: "N",';
	return 'genderRatio: { M: 0.5, F: 0.5 },';
}
const displayName = internal => internal.charAt(0) + internal.slice(1).toLowerCase();

// self-contained cut-chain evolutions (both endpoints new)
const evoOf = {}, prevoMap = {};
for (const internal of Object.keys(mons)) {
	const src = RES[internal];
	for (const e of mons[internal].evos) {
		if (e.kind !== 'EVOLVE_LEVEL') continue;
		const tgtInternal = dexTargetInternal(e.args[1]);
		const tgtRes = RES[tgtInternal];
		if (src.isNew && tgtRes && tgtRes.isNew) {
			(evoOf[src.id] = evoOf[src.id] || []).push({ id: tgtRes.id, name: displayName(tgtInternal) });
			prevoMap[tgtRes.id] = { prevo: src.id, prevoName: displayName(internal), evoLevel: +e.args[0] };
		}
	}
}

// ---- POKEDEX ----
let newCount = 0;
const pd = [];
for (const internal of order.map(o => o.internal)) {
	const m = mons[internal];
	if (!m || !m.stats || !m.types) continue;
	const r = RES[internal];
	const stats = `{ hp: ${m.stats.hp}, atk: ${m.stats.atk}, def: ${m.stats.def}, spa: ${m.stats.spa}, spd: ${m.stats.spd}, spe: ${m.stats.spe} }`;
	const types = '[' + m.types.map(t => `"${t}"`).join(', ') + ']';
	if (!r.isNew) {
		pd.push(`\t${r.id}: {\n\t\tinherit: true,\n\t\ttypes: ${types},\n\t\tbaseStats: ${stats},\n\t},`);
	} else {
		newCount++;
		const evos = evoOf[r.id], pv = prevoMap[r.id];
		let extra = '';
		if (evos) extra += `\n\t\tevos: [${evos.map(e => `"${e.name}"`).join(', ')}],`;
		if (pv) extra += `\n\t\tprevo: "${pv.prevoName}",\n\t\tevoLevel: ${pv.evoLevel},`;
		pd.push(`\t${r.id}: {\n\t\tnum: ${5000 + newCount},\n\t\tname: "${displayName(internal)}",\n\t\tgen: 2,\n\t\ttypes: ${types},\n\t\t${genderField(m.gender)}\n\t\tbaseStats: ${stats},\n\t\tabilities: { 0: "No Ability" },\n\t\theightm: 1,\n\t\tweightkg: 10,\n\t\tcolor: "Gray",\n\t\teggGroups: ["Undiscovered"],${extra}\n\t},`);
	}
}
fs.writeFileSync(path.join(OUT, 'pokedex.ts'),
	`// AUTO-GENERATED from pret/pokegold-spaceworld by tools/sw97-gen.js. Do not edit by hand.\nexport const Pokedex: import('../../../sim/dex-species').ModdedSpeciesDataTable = {\n${pd.join('\n')}\n};\n`);

// ---- LEARNSETS ----
const ls = [];
for (const internal of order.map(o => o.internal)) {
	const m = mons[internal];
	if (!m) continue;
	const r = RES[internal];
	const set = {};
	const add = (mid, src) => { (set[mid] = set[mid] || new Set()).add(src); };
	for (const lu of m.moves) add(psMoveId(lu.move), `2L${lu.level}`);
	for (const tn of m.tmhm) { const mv = tmList[tn - 1]; if (mv) add(psMoveId(mv), '2M'); }
	const keys = Object.keys(set).sort();
	if (!keys.length) continue;
	const body = keys.map(k => `\t\t\t${k}: [${[...set[k]].map(s => `"${s}"`).join(', ')}],`).join('\n');
	ls.push(`\t${r.id}: {\n\t\tlearnset: {\n${body}\n\t\t},\n\t},`);
}
fs.writeFileSync(path.join(OUT, 'learnsets.ts'),
	`// AUTO-GENERATED from pret/pokegold-spaceworld by tools/sw97-gen.js (level-up + TM/HM).\nexport const Learnsets: import('../../../sim/dex-species').ModdedLearnsetDataTable = {\n${ls.join('\n')}\n};\n`);

// ---- FORMATS-DATA ----
const fd = [];
for (const internal of order.map(o => o.internal)) { const r = RES[internal]; if (r && r.isNew) fd.push(`\t${r.id}: {\n\t\ttier: "OU",\n\t},`); }
fs.writeFileSync(path.join(OUT, 'formats-data.ts'),
	`// AUTO-GENERATED by tools/sw97-gen.js: make the cut/new SW97 species legal.\nexport const FormatsData: import('../../../sim/dex-species').ModdedSpeciesFormatsDataTable = {\n${fd.join('\n')}\n};\n`);

console.log(`Wrote gen2sw97: ${pd.length} species (${newCount} new), ${ls.length} learnsets, ${fd.length} formats-data.`);
