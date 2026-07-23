'use strict';
/**
 * Generator for the [Gen 2] Spaceworld '97 mod (data/mods/gen2sw97).
 *
 * Reads the pret/pokegold-spaceworld disassembly and emits pokedex.ts,
 * learnsets.ts, formats-data.ts and typechart.ts, keeping the beta data faithful
 * (placeholder art stats, beta typings, beta evolution chains, the 1997 move
 * table and the unfinished type chart all included). moves.ts is hand-maintained
 * (the beta-only moves need scripted effects) and is NOT overwritten, except for
 * the stat-only standard-move overrides spliced between its AUTO-GENERATED
 * markers (data files may not import a shared module, so the demo's tweaks to
 * standard Gen 2 moves are injected inline).
 *
 * Roster is restricted to the demo's own species: the 38 Gen 1/2 Pokemon that
 * are absent from the 1997 build are tagged isNonstandard "Past" so Standard's
 * Obtainable rule bans them. Time Capsule tradeforwards are honoured — every
 * Gen 1 species keeps the moves it could learn in Gen 1 (1L/1M/1T sources).
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

// Gen 2 assigns the physical/special split by TYPE, not per-move.
const GEN2_PHYSICAL = new Set(['Normal', 'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel']);
const gen2Category = type => (GEN2_PHYSICAL.has(type) ? 'Physical' : 'Special');

// Demo evolution-item constant -> PS item display name.
const EVOITEM = {
	ITEM_METAL_COAT: 'Metal Coat', ITEM_KINGS_ROCK: "King's Rock", ITEM_DRAGON_SCALE: 'Dragon Scale',
	ITEM_UP_GRADE: 'Up-Grade', ITEM_WATER_STONE: 'Water Stone', ITEM_FIRE_STONE: 'Fire Stone',
	ITEM_THUNDERSTONE: 'Thunder Stone', ITEM_LEAF_STONE: 'Leaf Stone', ITEM_MOON_STONE: 'Moon Stone',
	ITEM_SUN_STONE: 'Sun Stone', ITEM_POISON_STONE: 'Poison Stone', ITEM_HEART_STONE: 'Heart Stone',
};

// The constant is misspelled MON_JARANJA but names.asm, the base_stats file and
// Tangela's DEX_JARANRA evolution ref all spell it JARANRA (proto-Tangrowth) —
// normalise so parseBase finds jaranra.asm and the evolution resolves.
const INTERNAL_ALIAS = { JARANJA: 'JARANRA' };

// 1) internal order + comment
const order = [];
const seenInternal = new Set();
for (const raw of R('constants/pokemon_constants.asm')) {
	const m = raw.match(/^\tconst MON_(\w+)\s*;\s*[0-9a-f]+\s*(.*)$/);
	if (!m || m[1] === 'NONE') continue;
	const internal = INTERNAL_ALIAS[m[1]] || m[1];
	order.push({ internal, comment: (m[2] || '').trim() });
	seenInternal.add(internal);
}
// Append cut designs that have base_stats data but no MON_ constant (e.g. LEAFY,
// the cut grass eeveelution) so they still get a dex entry.
const baseDir = path.join(DEC, 'data/pokemon/base_stats');
for (const f of fs.readdirSync(baseDir).sort()) {
	const mm = f.match(/^(\w+)\.asm$/);
	if (!mm) continue;
	const internal = mm[1].toUpperCase();
	if (seenInternal.has(internal)) continue;
	order.push({ internal, comment: '' });
	seenInternal.add(internal);
	console.log('Enumerated orphan base_stats species (no MON_ constant):', internal);
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

// 3) evos_attacks (comment-stripped). Evolutions then a level/move list follow
// each label; a `db 0` separates the two sections then terminates the entry.
const ea = R('data/pokemon/evos_attacks.asm').map(strip);
const evoMoves = {};
{
	let cur = null;
	let phase = null;
	for (const l of ea) {
		let m = l.match(/^(\w+)EvosAttacks:$/);
		if (m) {
			cur = INTERNAL_ALIAS[m[1].toUpperCase()] || m[1].toUpperCase();
			evoMoves[cur] = { evos: [], moves: [] };
			phase = 'evo';
			continue;
		}
		if (!cur) continue;
		if (/^db 0$/.test(l)) {
			if (phase === 'evo') phase = 'move';
			else cur = null;
			continue;
		}
		if (phase === 'evo' && (m = l.match(/^db\s+(EVOLVE_\w+),\s*(.+)$/))) {
			const args = m[2].split(',').map(s => s.trim());
			evoMoves[cur].evos.push({ kind: m[1], args, target: args[args.length - 1] });
			continue;
		}
		// Levels are alignment-padded: single-digit levels use two spaces
		// (`db  1, MOVE_TACKLE`), so match on \s+ or the level 1-9 moves are lost.
		if ((m = l.match(/^db\s+(\d+),\s*(MOVE_\w+)$/))) {
			// A move line ends the evolution section even when the `db 0` separator
			// is absent (e.g. Eevee, whose evolutions run straight into its moves).
			if (phase === 'evo') phase = 'move';
			if (phase === 'move') evoMoves[cur].moves.push({ level: +m[1], move: m[2] });
		}
	}
}

// 4) TM/HM order
const tmList = [];
for (const raw of R('data/moves/tmhm_moves.asm')) {
	const m = strip(raw).match(/^db (MOVE_\w+)$/);
	if (m) tmList.push(m[1]);
}

// 5) the 1997 move table (type / accuracy / power / pp per move constant)
const betaMoves = {};
for (const raw of R('data/moves/moves.asm')) {
	const l = strip(raw);
	const m = l.match(/^move (MOVE_\w+),\s*(EFFECT_\w+),\s*(\d+),\s*(TYPE_\w+),\s*(\d+) percent,\s*(\d+),\s*(\d+)$/);
	if (!m || !TYPE[m[4]]) continue;
	betaMoves[m[1]] = { effect: m[2], power: +m[3], type: TYPE[m[4]], accuracy: +m[5], pp: +m[6] };
}

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
	if (comment && !comment.startsWith('(')) {
		const lead = comment.match(/^([A-Z][A-Z0-9_]*)/);
		if (lead) cand = lead[1];
	}
	const sp = g2.species.get(toID(cand));
	if (sp.exists && sp.num >= 1 && sp.num <= 251) return { id: sp.id, isNew: false };
	return { id: toID(internal), isNew: true };
}
const RES = {};
for (const internal of Object.keys(mons)) RES[internal] = resolve(internal, mons[internal].comment);

function genderField(g) {
	if (g === 'GENDER_MALE') return 'genderRatio: { M: 1, F: 0 },';
	if (g === 'GENDER_FEMALE') return 'genderRatio: { M: 0, F: 1 },';
	if (g === 'GENDER_UNKNOWN') return 'gender: "N",';
	return 'genderRatio: { M: 0.5, F: 0.5 },';
}
const displayName = internal => internal.charAt(0) + internal.slice(1).toLowerCase();
const dexTargetInternal = t => {
	const stripped = t.replace(/^DEX_/, '');
	return INTERNAL_ALIAS[stripped] || stripped;
};
const nameOfRes = (internal, res) => (res.isNew ? displayName(internal) : g2.species.get(res.id).name);
function evoChildFields(e) {
	if (e.kind === 'EVOLVE_LEVEL') return { evoLevel: +e.args[0] };
	if (e.kind === 'EVOLVE_STONE') return { evoType: 'useItem', evoItem: EVOITEM[e.args[1]] || null };
	if (e.kind === 'EVOLVE_ITEM') return { evoType: 'trade', evoItem: EVOITEM[e.args[1]] || null };
	if (e.kind === 'EVOLVE_TRADE') return { evoType: 'trade' };
	return {};
}

// Wire every demo evolution edge that touches at least one new species. Edges
// between two standard species keep their inherited Gen 2 chains. A source that
// needs an override re-lists ALL its demo targets (so co-targets like Victreebel
// or the standard eeveelutions survive); prevo/evoType/evoItem/evoLevel are set
// on new targets and on standard targets fed by a new (baby) prevo.
const evoOf = {};
const prevoMap = {};
for (const internal of Object.keys(mons)) {
	const src = RES[internal];
	const edges = mons[internal].evos;
	if (!edges.length) continue;
	const resolved = [];
	for (const e of edges) {
		const ti = dexTargetInternal(e.target);
		const tr = RES[ti];
		if (!tr) { console.log('WARN unresolved evo target:', internal, '->', ti); continue; }
		resolved.push({ e, ti, tr });
	}
	const hasNewEndpoint = src.isNew || resolved.some(r => r.tr.isNew);
	if (!hasNewEndpoint) continue;
	evoOf[src.id] = resolved.map(r => nameOfRes(r.ti, r.tr));
	for (const r of resolved) {
		if (!r.tr.isNew && !src.isNew) continue;
		prevoMap[r.tr.id] = { prevoName: nameOfRes(internal, src), ...evoChildFields(r.e) };
	}
}

// ---- POKEDEX ----
let newCount = 0;
const pd = [];
const demoIds = new Set();
for (const internal of order.map(o => o.internal)) {
	const m = mons[internal];
	if (!m || !m.stats || !m.types) continue;
	const r = RES[internal];
	if (!r.isNew) demoIds.add(r.id);
	const stats = `{ hp: ${m.stats.hp}, atk: ${m.stats.atk}, def: ${m.stats.def}, spa: ${m.stats.spa}, spd: ${m.stats.spd}, spe: ${m.stats.spe} }`;
	const types = '[' + m.types.map(t => `"${t}"`).join(', ') + ']';
	let extra = '';
	if (evoOf[r.id]) extra += `\n\t\tevos: [${evoOf[r.id].map(n => `"${n}"`).join(', ')}],`;
	const pv = prevoMap[r.id];
	if (pv) {
		extra += `\n\t\tprevo: "${pv.prevoName}",`;
		if (pv.evoType) extra += `\n\t\tevoType: "${pv.evoType}",`;
		if (pv.evoItem) extra += `\n\t\tevoItem: "${pv.evoItem}",`;
		if (pv.evoLevel) extra += `\n\t\tevoLevel: ${pv.evoLevel},`;
	}
	if (!r.isNew) {
		pd.push(`\t${r.id}: {\n\t\tinherit: true,\n\t\ttypes: ${types},\n\t\tbaseStats: ${stats},${extra}\n\t},`);
	} else {
		newCount++;
		pd.push(`\t${r.id}: {\n\t\tnum: ${5000 + newCount},\n\t\tname: "${displayName(internal)}",\n\t\tgen: 2,\n\t\ttypes: ${types},\n\t\t${genderField(m.gender)}\n\t\tbaseStats: ${stats},\n\t\tabilities: { 0: "No Ability" },\n\t\theightm: 1,\n\t\tweightkg: 10,\n\t\tcolor: "Gray",\n\t\teggGroups: ["Undiscovered"],${extra}\n\t},`);
	}
}
// G4: restrict the roster to the demo's own species — tag every standard Gen 1/2
// Pokemon absent from the 1997 build isNonstandard "Past" so Standard's
// Obtainable rule bans it (num>=5000 demo species stay legal).
let bannedCount = 0;
const bans = [];
for (const sp of g2.species.all()) {
	if (sp.num < 1 || sp.num > 251 || sp.isNonstandard || demoIds.has(sp.id)) continue;
	bans.push(`\t${sp.id}: {\n\t\tinherit: true,\n\t\tisNonstandard: "Past",\n\t},`);
	bannedCount++;
}
fs.writeFileSync(path.join(OUT, 'pokedex.ts'),
	`// AUTO-GENERATED from pret/pokegold-spaceworld by tools/sw97-gen.js. Do not edit by hand.\nexport const Pokedex: import('../../../sim/dex-species').ModdedSpeciesDataTable = {\n${pd.concat(bans).join('\n')}\n};\n`);

// ---- LEARNSETS ----
// Demo level-up + TM/HM sources, plus Gen 1 tradeforwards: any Gen 1 species
// keeps every move it could learn in Gen 1 (1L/1M/1T, Time Capsule legal).
const ls = [];
for (const internal of order.map(o => o.internal)) {
	const m = mons[internal];
	if (!m) continue;
	const r = RES[internal];
	const set = {};
	const add = (mid, src) => { (set[mid] = set[mid] || new Set()).add(src); };
	for (const lu of m.moves) add(psMoveId(lu.move), `2L${lu.level}`);
	for (const tn of m.tmhm) {
		const mv = tmList[tn - 1];
		if (mv) add(psMoveId(mv), '2M');
	}
	if (!r.isNew) {
		const sp = g2.species.get(r.id);
		if (sp.num >= 1 && sp.num <= 151) {
			const canon = g2.species.getLearnsetData(sp.id);
			const learnset = canon && canon.learnset;
			if (learnset) {
				for (const mid of Object.keys(learnset)) {
					for (const src of learnset[mid]) {
						if (/^1[LMT]/.test(src)) add(mid, src);
					}
				}
			}
		}
	}
	const keys = Object.keys(set).sort();
	if (!keys.length) continue;
	const body = keys.map(k => `\t\t\t${k}: [${[...set[k]].sort().map(s => `"${s}"`).join(', ')}],`).join('\n');
	ls.push(`\t${r.id}: {\n\t\tlearnset: {\n${body}\n\t\t},\n\t},`);
}
fs.writeFileSync(path.join(OUT, 'learnsets.ts'),
	`// AUTO-GENERATED from pret/pokegold-spaceworld by tools/sw97-gen.js (level-up + TM/HM + Gen 1 tradeforwards).\nexport const Learnsets: import('../../../sim/dex-species').ModdedLearnsetDataTable = {\n${ls.join('\n')}\n};\n`);

// ---- FORMATS-DATA ----
const fd = [];
for (const internal of order.map(o => o.internal)) {
	const r = RES[internal];
	if (r && r.isNew) fd.push(`\t${r.id}: {\n\t\ttier: "OU",\n\t},`);
}
fs.writeFileSync(path.join(OUT, 'formats-data.ts'),
	`// AUTO-GENERATED by tools/sw97-gen.js: make the cut/new SW97 species legal.\nexport const FormatsData: import('../../../sim/dex-species').ModdedSpeciesFormatsDataTable = {\n${fd.join('\n')}\n};\n`);

// ---- MOVES (standard overrides) ----
// The 1997 move table differs from final GSC in type, category, base power,
// accuracy and PP. Emit a stat-only `inherit` merge for every standard Gen 2
// move the demo lists differently. Beta-only moves (scripted effects) and the
// two future-named beta moves (Water Sport, Bounce) are hand-ported in moves.ts.
const stdRows = [];
for (const K of Object.keys(betaMoves)) {
	const id = psMoveId(K);
	const b = betaMoves[K];
	const m2 = g2.moves.get(id);
	if (!m2.exists) continue;
	if (m2.gen > 2) {
		console.log('beta move resolves to a gen>2 move (hand-port in moves.ts):', K, '->', id, 'gen', m2.gen);
		continue;
	}
	const fields = [];
	let typeChanged = false;
	if (b.type && b.type !== m2.type) {
		fields.push(`type: "${b.type}"`);
		typeChanged = true;
	}
	if (m2.category !== 'Status') {
		const newCat = gen2Category(typeChanged ? b.type : m2.type);
		if (newCat !== m2.category) fields.push(`category: "${newCat}"`);
	}
	// base power only for plain damaging moves — OHKO/fixed-damage/callback/
	// multi-hit moves compute damage specially and must keep their gen-2 scripts.
	const plain = m2.basePower > 0 && !m2.ohko && !m2.damage &&
		!m2.damageCallback && !m2.basePowerCallback && !m2.multihit;
	if (plain && b.power !== m2.basePower) fields.push(`basePower: ${b.power}`);
	const psAcc = m2.accuracy === true ? 100 : m2.accuracy;
	if (b.accuracy !== psAcc) fields.push(`accuracy: ${b.accuracy}`);
	if (b.pp !== m2.pp) fields.push(`pp: ${b.pp}`);
	if (fields.length) stdRows.push(`\t${id}: {\n\t\tinherit: true,\n\t\t${fields.join(',\n\t\t')},\n\t},`);
}
// Splice the overrides into moves.ts between the AUTO-GENERATED markers. Data
// files may not `require` a sibling module (test/sim/data.js forbids it), so the
// generated block lives inside the hand-maintained moves.ts rather than a shared
// import. The hand-written beta moves outside the markers are preserved.
const MOVES_TS = path.join(OUT, 'moves.ts');
const START_RE = /^\t\/\/ === AUTO-GENERATED standard-move overrides/;
const END_RE = /^\t\/\/ === END AUTO-GENERATED standard-move overrides/;
const movesLines = fs.readFileSync(MOVES_TS, 'utf8').split('\n');
const si = movesLines.findIndex(l => START_RE.test(l));
const ei = movesLines.findIndex(l => END_RE.test(l));
if (si === -1 || ei === -1 || ei < si) throw new Error('moves.ts: AUTO-GENERATED markers not found');
const splicedMoves = [...movesLines.slice(0, si + 1), ...stdRows, ...movesLines.slice(ei)];
fs.writeFileSync(MOVES_TS, splicedMoves.join('\n'));

// ---- TYPE CHART ----
// PS computes effectiveness from the DEFENDER's damageTaken table, so the beta
// matchups become damageTaken overrides. Codes: 1 super-effective, 2 resisted,
// 3 immune, 0 neutral. Only deltas vs the inherited Gen 2 chart are emitted.
const VAL = { SUPER_EFFECTIVE: 1, NOT_VERY_EFFECTIVE: 2, NO_EFFECT: 3 };
const betaTC = {}; // defender -> { attacker: code }
for (const raw of R('data/types/type_matchups.asm')) {
	const l = strip(raw);
	const m = l.match(/^db (TYPE_\w+),\s*(TYPE_\w+),\s*(\w+)$/);
	if (!m || !TYPE[m[1]] || !TYPE[m[2]]) continue;
	const atk = TYPE[m[1]];
	const def = TYPE[m[2]];
	(betaTC[def] = betaTC[def] || {})[atk] = VAL[m[3]];
}
const allTypes = [...new Set(Object.values(TYPE))]; // 17 real types (TYPE_BIRD folds into Flying)
const betaCode = (def, atk) => (betaTC[def] && betaTC[def][atk] !== undefined ? betaTC[def][atk] : 0); // absent = neutral
const tc = [];
for (const def of allTypes) {
	const gscDT = g2.types.get(def).damageTaken;
	// The beta type_matchups.asm is the COMPLETE chart, so an unlisted pair is
	// neutral (not the GSC value). Does the full beta column differ from GSC?
	const changed = allTypes.some(atk => betaCode(def, atk) !== (gscDT[atk] !== undefined ? gscDT[atk] : 0));
	if (!changed) continue;
	// PS REPLACES damageTaken wholesale and defaults unlisted attackers to
	// neutral, so emitting just the non-neutral beta entries is the full table.
	const rows = allTypes.filter(atk => betaCode(def, atk) !== 0).map(atk => `\t\t\t${atk}: ${betaCode(def, atk)},`);
	tc.push(`\t${def.toLowerCase()}: {\n\t\tinherit: true,\n\t\tdamageTaken: {\n${rows.join('\n')}\n\t\t},\n\t},`);
}
fs.writeFileSync(path.join(OUT, 'typechart.ts'),
	`// AUTO-GENERATED from pret/pokegold-spaceworld (data/types/type_matchups.asm) by tools/sw97-gen.js.\n` +
	`// The 1997 beta type chart differs from final GSC (Steel and Dark are unfinished).\n` +
	`// damageTaken codes: 1 = super-effective, 2 = resisted, 3 = immune, 0 = neutral.\n` +
	`// Only types whose column changed are listed; PS replaces damageTaken wholesale,\n` +
	`// so each entry below is that type's COMPLETE beta table (unlisted = neutral).\n` +
	`export const TypeChart: import('../../../sim/dex-data').ModdedTypeDataTable = {\n${tc.join('\n')}\n};\n`);

console.log(`Wrote gen2sw97: ${pd.length} species (${newCount} new), ${bannedCount} banned (isNonstandard Past), ${ls.length} learnsets, ${fd.length} formats-data, ${stdRows.length} move overrides, ${tc.length} type overrides.`);
