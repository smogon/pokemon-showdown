'use strict';
/**
 * Spaceworld '97 sprite map generator.
 *
 * Emits the decomp-folder -> Showdown-species-id pairing consumed by the client's
 * build-tools/sw97-sprites.js. Every demo species is listed — not just the 36 cut
 * designs — so real species that were redesigned after 1997 (Umbreon = "Blacky",
 * Espeon = "Eifie", ...) get their beta sprite extracted under their modern id.
 *
 * The id resolution mirrors tools/sw97-gen.js: a beta name that lands on a real GSC
 * species (dex num 1-251) keeps that species' id; a beta-only design becomes a new
 * cut id (toID of its internal name, matching the num>=5000 species the mod defines).
 *
 * Usage:
 *     node tools/sw97-sprite-map.js /path/to/pokegold-spaceworld \
 *         ../pokemon-showdown-client/build-tools/sw97-sprite-map.json
 *
 * Requires the compiled sim (`node build` first). Self-contained otherwise.
 */
const fs = require('fs');
const path = require('path');
const { Dex } = require('../dist/sim');

const DEC = process.argv[2];
const OUT = process.argv[3];
if (!DEC || !OUT) {
	console.error('Usage: node tools/sw97-sprite-map.js <decompRoot> <outJsonPath>');
	process.exit(1);
}

const g2 = Dex.mod('gen2');
const R = f => fs.readFileSync(path.join(DEC, f), 'utf8').split(/\r?\n/);
const toID = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// Keep these in sync with tools/sw97-gen.js.
const INTERNAL_ALIAS = { JARANJA: 'JARANRA' };
const ALIAS = { MOKOKO: 'flaaffy', PAON: 'phanpy', HAGANEIL: 'steelix' };

// Species order: MON_ constants, then any orphan base_stats files.
const order = [];
const seen = new Set();
for (const raw of R('constants/pokemon_constants.asm')) {
	const m = raw.match(/^\tconst MON_(\w+)\s*;\s*[0-9a-f]+\s*(.*)$/);
	if (!m || m[1] === 'NONE') continue;
	const internal = INTERNAL_ALIAS[m[1]] || m[1];
	order.push({ internal, comment: (m[2] || '').trim() });
	seen.add(internal);
}
for (const f of fs.readdirSync(path.join(DEC, 'data/pokemon/base_stats')).sort()) {
	const mm = f.match(/^(\w+)\.asm$/);
	if (!mm) continue;
	const internal = mm[1].toUpperCase();
	if (seen.has(internal)) continue;
	order.push({ internal, comment: '' });
	seen.add(internal);
}

function hasData(internal) {
	const file = 'data/pokemon/base_stats/' + internal.toLowerCase() + '.asm';
	if (!fs.existsSync(path.join(DEC, file))) return false;
	const lines = R(file).map(l => { const i = l.indexOf(';'); return (i >= 0 ? l.slice(0, i) : l).trim(); });
	let hasStats = false, hasTypes = false;
	for (const l of lines) {
		if (/^db\s+\d+,\s*\d+,\s*\d+,\s*\d+,\s*\d+,\s*\d+$/.test(l)) hasStats = true;
		if (/^db\s+TYPE_\w+,\s*TYPE_\w+$/.test(l)) hasTypes = true;
	}
	return hasStats && hasTypes;
}

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

function gfxFolder(internal) {
	for (const cand of [internal.toLowerCase(), toID(internal)]) {
		if (fs.existsSync(path.join(DEC, 'gfx/pokemon', cand, 'front.png'))) return cand;
	}
	return null;
}

const map = [];
for (const { internal, comment } of order) {
	if (!hasData(internal)) continue;
	const folder = gfxFolder(internal);
	if (!folder) continue; // e.g. ANNON (Unown) — special multi-letter sprite storage, no front.png
	const r = resolve(internal, comment);
	map.push({ folder, id: r.id, isNew: r.isNew });
}

fs.writeFileSync(OUT, JSON.stringify(map, null, 0) + '\n');
console.log(`Wrote ${map.length} entries (${map.filter(m => m.isNew).length} cut, ${map.filter(m => !m.isNew).length} real) to ${OUT}`);
