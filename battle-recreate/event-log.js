'use strict';

/**
 * EventLog: a structured, round-trippable representation of a Pokemon Showdown
 * battle log (the `|move|`, `|switch|`, `|-damage|`, `|turn|N`, ... protocol
 * stream documented in sim/SIM-PROTOCOL.md).
 *
 * Shape:
 *   {
 *     header: Entry[],   // everything before the first `|turn|1` marker
 *     turns: Entry[][],  // turns[i] = entries for turn (i + 1), INCLUDING
 *                         // that turn's own `|turn|N` marker as its first
 *                         // entry, up to (not including) the next marker.
 *   }
 *
 * Entry = { cmd: string, args: string[], raw: string }
 *
 * "State at the start of turn N" == header ++ turns[0 .. N-2] fully applied,
 * i.e. everything up to but not including turns[N-1] (which begins with the
 * `|turn|N` line itself).
 */

function parseEntry(line) {
	if (!line.startsWith('|')) return null; // skip comments/blank lines/non-protocol text
	const parts = line.split('|');
	// parts[0] is '' because the line starts with '|'
	const cmd = parts[1];
	const args = parts.slice(2);
	return { cmd, args, raw: line };
}

/**
 * Parses a raw log into an EventLog. Accepts either:
 *  - plain protocol text (one `|...` line per line), the format used by
 *    replay.pokemonshowdown.com's downloadable logs, or
 *  - a JSON replay object (e.g. the JSON served by the replay API) with a
 *    string `log` field containing that same protocol text.
 */
function parseLog(text) {
	let raw = text.trim();
	if (raw.startsWith('{')) {
		const obj = JSON.parse(raw);
		if (typeof obj.log !== 'string') {
			throw new Error('JSON input has no string `log` field');
		}
		raw = obj.log;
	}

	const header = [];
	const turns = [];
	let current = header;
	for (const line of raw.split('\n')) {
		const entry = parseEntry(line);
		if (!entry) continue;
		if (entry.cmd === 'turn') {
			turns.push([]);
			current = turns[turns.length - 1];
		}
		current.push(entry);
	}
	return { header, turns };
}

/** Reconstructs the original protocol text from an EventLog (round-trip). */
function serializeLog(eventLog) {
	const lines = [];
	for (const entry of eventLog.header) lines.push(entry.raw);
	for (const turn of eventLog.turns) {
		for (const entry of turn) lines.push(entry.raw);
	}
	return lines.join('\n');
}

/** Entries for "everything strictly before the start of turn N" (1-indexed). */
function entriesBeforeTurn(eventLog, turnN) {
	const out = [...eventLog.header];
	// turns[0] is turn 1, ..., turns[turnN - 2] is turn (turnN - 1)
	for (let i = 0; i < turnN - 1 && i < eventLog.turns.length; i++) {
		out.push(...eventLog.turns[i]);
	}
	return out;
}

/**
 * Scans the whole EventLog for switch/drag entries and returns, per side,
 * the set of species that ever appeared on the field.
 */
function usedSpeciesBySide(eventLog) {
	const used = { p1: new Set(), p2: new Set(), p3: new Set(), p4: new Set() };
	const allEntries = [...eventLog.header, ...eventLog.turns.flat()];
	for (const entry of allEntries) {
		if (entry.cmd !== 'switch' && entry.cmd !== 'drag') continue;
		const [ident, details] = entry.args;
		const sideId = ident.slice(0, 2);
		const species = details.split(',')[0].trim();
		if (used[sideId]) used[sideId].add(species);
	}
	return used;
}

module.exports = { parseEntry, parseLog, serializeLog, entriesBeforeTurn, usedSpeciesBySide };
