#!/usr/bin/env node
'use strict';

/**
 * Recreates a real Pokemon Showdown battle's state at the *start* of turn N
 * by directly applying its battle log (as an EventLog) to a freshly built
 * Battle -- bypassing the choice/RNG simulation engine entirely for turns
 * 1..N-1 -- and then plays turn N onward using real random legal choices
 * (so from that point on, genuine dice are rolled and the game can diverge
 * from what actually happened).
 *
 * Usage:
 *   node battle-recreate/recreate.js <format> <logFile> <turnN> <paste1> <paste2> [options]
 *
 * Options:
 *   --seed=a,b,c,d   PRNG seed for the post-turn-N simulation (default: random)
 *   --max-turns=N    Safety cap on turns played past N (default: 50)
 *   --quiet          Suppress per-turn console output
 */

const fs = require('fs');
const path = require('path');

const { BattleStream } = require(path.join(__dirname, '..', 'dist', 'sim', 'battle-stream'));
const { Teams } = require(path.join(__dirname, '..', 'dist', 'sim', 'teams'));
const { Dex } = require(path.join(__dirname, '..', 'dist', 'sim', 'dex'));
const { PRNG } = require(path.join(__dirname, '..', 'dist', 'sim', 'prng'));

const { parseLog, entriesBeforeTurn, usedSpeciesBySide } = require('./event-log');
const { LogApplier } = require('./apply');
const { pickChoice } = require('./random-choice');
const { snapshotState } = require('./state-snapshot');

function parseArgs(argv) {
	const positional = [];
	const options = { seed: null, maxTurns: 50, quiet: false };
	for (const arg of argv) {
		if (arg.startsWith('--seed=')) {
			options.seed = arg.slice('--seed='.length).split(',').map(Number);
		} else if (arg.startsWith('--max-turns=')) {
			options.maxTurns = parseInt(arg.slice('--max-turns='.length), 10);
		} else if (arg === '--quiet') {
			options.quiet = true;
		} else {
			positional.push(arg);
		}
	}
	if (positional.length !== 5) {
		throw new Error(
			'Usage: recreate.js <format> <logFile> <turnN> <paste1> <paste2> ' +
			'[--seed=a,b,c,d] [--max-turns=N] [--quiet]'
		);
	}
	const [formatArg, logFile, turnNStr, paste1File, paste2File] = positional;
	return { formatArg, logFile, turnN: parseInt(turnNStr, 10), paste1File, paste2File, ...options };
}

function loadTeam(pasteFile) {
	const text = fs.readFileSync(pasteFile, 'utf8');
	const team = Teams.import(text);
	if (!team) throw new Error(`Could not parse team from ${pasteFile}`);
	return team;
}

/**
 * Builds a fresh Battle for `format`/`team1`/`team2` and drives it directly
 * to the start of turn N by applying `eventLog`'s entries before turn N.
 * Returns { stream, battle, applier }.
 */
function recreateAtTurn(formatArg, eventLog, turnN, team1, team2, { quiet } = {}) {
	const format = Dex.formats.get(formatArg);
	if (!format.exists) {
		throw new Error(
			`Format "${formatArg}" does not exist in this fork. ` +
			`(If you meant a not-yet-added regulation like Champions M-B, ` +
			`add it to config/formats.ts first, or pass an existing format id ` +
			`for testing, e.g. gen9championsvgc2026regma.)`
		);
	}

	const stream = new BattleStream({ keepAlive: false });
	stream.write(`>start ${JSON.stringify({ formatid: format.id })}`);
	stream.write(`>player p1 ${JSON.stringify({ name: 'Player 1', team: Teams.pack(team1) })}`);
	stream.write(`>player p2 ${JSON.stringify({ name: 'Player 2', team: Teams.pack(team2) })}`);

	const battle = stream.battle;
	if (!battle) throw new Error('Battle failed to initialize after >start/>player');

	// We're taking over state management entirely for turns 1..N-1: drop
	// whatever pending request start() generated (typically teampreview)
	// rather than answering it through the normal choice pipeline.
	battle.clearRequest();

	// battle.start() (auto-triggered once both >player calls land) queues a
	// `{choice:'start'}` action and pauses at the teampreview request
	// *before* actually running it. Left in place, that stale action fires
	// the first time the real engine resumes processing the queue -- i.e.
	// partway through the post-turn-N random-play phase -- and its handler
	// unconditionally does `side.pokemonLeft = side.pokemon.length` (see
	// runAction's 'start' case in sim/battle.ts), silently erasing any
	// pokemonLeft decrements from Pokemon that had already fainted during
	// the turns 1..N-1 replay. Drop it; we've already done the equivalent
	// bookkeeping ourselves (roster pruning above, pokemonLeft-- on faint
	// in LogApplier#directFaint).
	battle.queue.clear();

	// In "bring N, pick M" formats (VGC/BSS team preview), Side#chooseTeam's
	// autoChoose path (i.e. picking "default") truncates `side.pokemon` to
	// the first `pickedTeamSize` entries of the *original* team order (see
	// sim/side.ts chooseTeam: `positions = [...this.pokemon.keys()]` then
	// `.splice(pickedTeamSize)`) -- it does not pick based on who ends up
	// getting used. We replicate that: Pokemon confirmed by the log (they
	// were actually switched in at some point) are always kept, and any
	// remaining slots are backfilled from the original pokepaste order --
	// mirroring chooseTeam's own "too small, fill in the rest" fallback.
	// This assumes the provided pokepaste lists Pokemon in the same order
	// the real team was originally submitted in.
	const usedSpecies = usedSpeciesBySide(eventLog);
	for (const side of battle.sides) {
		const pickedTeamSize = Math.min(side.pokemon.length, battle.ruleTable.pickedTeamSize || Infinity);
		if (pickedTeamSize >= side.pokemon.length) continue;
		const keep = usedSpecies[side.id] || new Set();
		const matches = p => keep.has(p.species.name) || keep.has(p.species.baseSpecies);
		const selected = new Set(side.pokemon.filter(matches));
		for (const p of side.pokemon) {
			if (selected.size >= pickedTeamSize) break;
			selected.add(p);
		}
		// Filter (not rebuild) so the *original* relative order is preserved,
		// matching what chooseTeam's index-based truncation produces.
		side.pokemon = side.pokemon.filter(p => selected.has(p));
		side.pokemonLeft = side.pokemon.length;
		// Side#addPokemon sets `pokemon.position` to its array index at
		// construction time, and switchIn-style bookkeeping (see
		// LogApplier#directSwitchIn) trusts that field to still match the
		// Pokemon's current index in `side.pokemon` when swapping active
		// slots. Filtering the array left every remaining Pokemon's
		// `.position` stale (pointing at its *original* 6-team index) --
		// resync it to the new index or later switches silently corrupt
		// unrelated roster slots.
		side.pokemon.forEach((p, i) => { p.position = i; });
	}

	const applier = new LogApplier(battle, {
		onUnhandled: quiet ? () => {} : (entry) => console.warn(`[recreate] unhandled: ${entry.raw}`),
	});
	const entries = entriesBeforeTurn(eventLog, turnN);
	applier.applyAll(entries);
	applier.finalizeChoiceLock();

	// Turn N hasn't been marked yet by the log replay (that entry belongs to
	// eventLog.turns[turnN - 1], which we deliberately didn't apply) -- set
	// it explicitly so the request we're about to generate is correctly
	// labeled, matching what a natural playthrough would show.
	battle.turn = turnN;
	battle.requestState = '';
	battle.makeRequest('move');

	return { stream, battle, applier };
}

/** Plays the battle forward from its current pending request using random legal choices. */
function playRandomly(battle, { seed, maxTurns, quiet }) {
	const prng = new PRNG(seed || undefined);
	const startTurn = battle.turn;
	let turnsPlayed = 0;
	const actionsLog = [];

	while (!battle.ended && turnsPlayed <= maxTurns) {
		const p1req = battle.sides[0].activeRequest;
		const p2req = battle.sides[1].activeRequest;
		if (!p1req && !p2req) break;

		const c1 = pickChoice(p1req, prng);
		const c2 = pickChoice(p2req, prng);
		if (!quiet) console.log(`[turn ${battle.turn}] p1: ${c1 || '(wait)'} | p2: ${c2 || '(wait)'}`);
		actionsLog.push({ turn: battle.turn, p1: c1, p2: c2 });

		if (c1) battle.choose('p1', c1);
		if (c2) battle.choose('p2', c2);

		if (battle.turn > startTurn) turnsPlayed = battle.turn - startTurn;
		else if (battle.ended) break;
		else if (!battle.sides[0].activeRequest && !battle.sides[1].activeRequest) break;
	}
	return actionsLog;
}

function main() {
	const args = parseArgs(process.argv.slice(2));
	const eventLog = parseLog(fs.readFileSync(args.logFile, 'utf8'));
	const team1 = loadTeam(args.paste1File);
	const team2 = loadTeam(args.paste2File);

	const { battle } = recreateAtTurn(args.formatArg, eventLog, args.turnN, team1, team2, args);

	if (!args.quiet) {
		console.log(`Recreated battle state at start of turn ${args.turnN}.`);
		console.log(JSON.stringify(snapshotState(battle), null, 2));
	}

	const actions = playRandomly(battle, args);

	if (!args.quiet) {
		console.log(battle.ended ? `Battle ended. Winner: ${battle.winner || '(tie)'}` : 'Reached max-turns cap.');
	}

	return { battle, actions };
}

if (require.main === module) {
	main();
}

module.exports = { parseArgs, loadTeam, recreateAtTurn, playRandomly, main };
