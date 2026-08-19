#!/usr/bin/env node
'use strict';

/**
 * End-to-end validation of the battle-recreation pipeline:
 *
 *  1. Plays a full, real random-doubles battle (via BattleStream + random
 *     legal choices), capturing:
 *       - its full protocol log (the same shape as a downloaded PS replay)
 *       - a ground-truth state snapshot at the moment each turn's request
 *         was first issued (i.e. "state at the start of turn N", captured
 *         live, not reconstructed)
 *  2. Picks a turn N in the middle of that game.
 *  3. Feeds the captured log + the two teams (exported to pokepaste text,
 *     as an external user would provide them) through recreateAtTurn(),
 *     which applies the log directly to a fresh Battle bypassing the
 *     simulation engine for turns 1..N-1.
 *  4. Asserts the reconstructed snapshot at turn N equals the live
 *     ground-truth snapshot at turn N (state-correctness check).
 *  5. Plays two independent continuations from turn N with different
 *     random seeds and asserts they diverge from each other AND from the
 *     original continuation (divergence check).
 */

const path = require('path');
const assert = require('assert');

const { BattleStream } = require(path.join(__dirname, '..', 'dist', 'sim', 'battle-stream'));
const { extractChannelMessages } = require(path.join(__dirname, '..', 'dist', 'sim', 'battle'));
const { Teams } = require(path.join(__dirname, '..', 'dist', 'sim', 'teams'));
const { Dex } = require(path.join(__dirname, '..', 'dist', 'sim', 'dex'));
const { PRNG } = require(path.join(__dirname, '..', 'dist', 'sim', 'prng'));

const { parseLog } = require('./event-log');
const { recreateAtTurn, playRandomly } = require('./recreate');
const { snapshotState } = require('./state-snapshot');
const { pickChoice } = require('./random-choice');

const FORMAT = 'gen9championsvgc2026regma'; // stand-in for "Champions M-B" until that regulation exists in this fork

function playGroundTruthGame(seed) {
	const format = Dex.formats.get(FORMAT);
	const team1 = Teams.generate('gen9randomdoublesbattle');
	const team2 = Teams.generate('gen9randomdoublesbattle');

	const stream = new BattleStream({ keepAlive: false });
	stream.write(`>start ${JSON.stringify({ formatid: format.id, seed })}`);
	stream.write(`>player p1 ${JSON.stringify({ name: 'Ground Truth P1', team: Teams.pack(team1) })}`);
	stream.write(`>player p2 ${JSON.stringify({ name: 'Ground Truth P2', team: Teams.pack(team2) })}`);
	const battle = stream.battle;

	// Team preview: just lock in the default (first N) order for both sides.
	if (battle.requestState === 'teampreview') {
		battle.choose('p1', 'default');
		battle.choose('p2', 'default');
	}

	const prng = new PRNG();
	const snapshotsByTurn = {};
	let lastSeenTurn = -1;

	while (!battle.ended) {
		if (battle.turn !== lastSeenTurn && (battle.sides[0].activeRequest || battle.sides[1].activeRequest)) {
			lastSeenTurn = battle.turn;
			snapshotsByTurn[battle.turn] = snapshotState(battle);
		}
		const p1req = battle.sides[0].activeRequest;
		const p2req = battle.sides[1].activeRequest;
		if (!p1req && !p2req) break;
		const c1 = pickChoice(p1req, prng);
		const c2 = pickChoice(p2req, prng);
		if (c1) battle.choose('p1', c1);
		if (c2) battle.choose('p2', c2);
		if (battle.turn > 60) break; // safety cap
	}

	// Real downloaded replays are the *spectator* view: HP is shown scaled
	// (percentage-of-max), not exact, for both sides -- exactly like
	// `extractChannelMessages(..., [-1])` (channel -1 == spectator), the
	// same helper sim/battle.ts itself uses to build the "omniscient"
	// stream's counterpart. Using the raw omniscient `battle.log` here
	// would leak `|split|` secret/exact-HP lines a real replay never has.
	const spectatorLog = extractChannelMessages(battle.log.join('\n'), [-1])[-1].join('\n');

	return {
		log: spectatorLog,
		team1, team2,
		snapshotsByTurn,
		finalTurn: battle.turn,
	};
}

function normalizeForCompare(snapshot) {
	// Reconstructed snapshots won't have meaningful nicknames if the
	// pokepaste omits them (Teams.export includes nicknames when set, which
	// is the common case, but strip them from comparison to avoid false
	// negatives from that alone). Also round HP to the nearest percentage
	// point of max HP: a real replay log only ever shows spectators HP as
	// a percentage (see sim/SIM-PROTOCOL.md's `-damage`/`switch` HP field),
	// so reconstruction from a real log can only ever be accurate to within
	// that rounding -- not bit-exact -- and ground truth (read live, with
	// exact HP) needs the same rounding applied before comparing.
	const clone = JSON.parse(JSON.stringify(snapshot));
	for (const side of clone.sides) {
		for (const p of [...side.active, ...side.team]) {
			if (!p) continue;
			delete p.nickname;
			if (!p.fainted) p.hp = Math.max(1, Math.round((p.hp / p.maxhp) * 100));
			else p.hp = 0;
		}
	}
	return clone;
}

function diffPaths(a, b, prefix = '') {
	const out = [];
	if (typeof a !== typeof b) {
		out.push(`${prefix}: type ${typeof a} vs ${typeof b} (${JSON.stringify(a)} vs ${JSON.stringify(b)})`);
		return out;
	}
	if (Array.isArray(a) || Array.isArray(b)) {
		const len = Math.max(a?.length || 0, b?.length || 0);
		for (let i = 0; i < len; i++) out.push(...diffPaths(a?.[i], b?.[i], `${prefix}[${i}]`));
		return out;
	}
	if (a && b && typeof a === 'object') {
		const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
		for (const k of keys) out.push(...diffPaths(a[k], b[k], `${prefix}.${k}`));
		return out;
	}
	if (a !== b) out.push(`${prefix}: ${JSON.stringify(a)} !== ${JSON.stringify(b)}`);
	return out;
}

function run() {
	console.log(`Playing a ground-truth ${FORMAT} game to generate a real log...`);
	const gt = playGroundTruthGame([1, 2, 3, 4]);
	console.log(`Ground-truth game finished at turn ${gt.finalTurn}. Captured snapshots for turns: ${Object.keys(gt.snapshotsByTurn).join(', ')}`);

	const availableTurns = Object.keys(gt.snapshotsByTurn).map(Number).filter(n => n >= 2);
	if (!availableTurns.length) throw new Error('Ground-truth game ended too quickly to test mid-game recreation.');
	const turnN = availableTurns[Math.floor(availableTurns.length / 2)];
	console.log(`\n=== Testing recreation at turn ${turnN} ===`);

	const eventLog = parseLog(gt.log);
	const paste1 = Teams.export(gt.team1);
	const paste2 = Teams.export(gt.team2);

	if (process.env.DUMP_DIR) {
		const fs = require('fs');
		fs.mkdirSync(process.env.DUMP_DIR, { recursive: true });
		fs.writeFileSync(`${process.env.DUMP_DIR}/log.txt`, gt.log);
		fs.writeFileSync(`${process.env.DUMP_DIR}/paste1.txt`, paste1);
		fs.writeFileSync(`${process.env.DUMP_DIR}/paste2.txt`, paste2);
		fs.writeFileSync(`${process.env.DUMP_DIR}/turnN.txt`, String(turnN));
	}

	// --- Test 1: state-correctness at turn N ---
	const { battle: recreated } = recreateAtTurn(FORMAT, eventLog, turnN, Teams.import(paste1), Teams.import(paste2), { quiet: true });
	const recreatedSnapshot = normalizeForCompare(snapshotState(recreated));
	const groundTruthSnapshot = normalizeForCompare(gt.snapshotsByTurn[turnN]);

	try {
		assert.deepStrictEqual(recreatedSnapshot, groundTruthSnapshot);
		console.log(`PASS: reconstructed state at turn ${turnN} exactly matches ground truth.`);
	} catch (e) {
		console.error('FAIL: reconstructed state does not match ground truth.');
		console.error(diffPaths(recreatedSnapshot, groundTruthSnapshot).join('\n'));
		throw e;
	}

	// --- Test 2: divergence after turn N ---
	const { battle: branchA } = recreateAtTurn(FORMAT, eventLog, turnN, Teams.import(paste1), Teams.import(paste2), { quiet: true });
	const { battle: branchB } = recreateAtTurn(FORMAT, eventLog, turnN, Teams.import(paste1), Teams.import(paste2), { quiet: true });

	const actionsA = playRandomly(branchA, { seed: [11, 22, 33, 44], maxTurns: 10, quiet: true });
	const actionsB = playRandomly(branchB, { seed: [55, 66, 77, 88], maxTurns: 10, quiet: true });

	const snapA = normalizeForCompare(snapshotState(branchA));
	const snapB = normalizeForCompare(snapshotState(branchB));

	const actionsDiffer = JSON.stringify(actionsA) !== JSON.stringify(actionsB);
	const statesDiffer = JSON.stringify(snapA) !== JSON.stringify(snapB);

	if (actionsDiffer || statesDiffer) {
		console.log(`PASS: two random continuations from turn ${turnN} diverged ` +
			`(actions differ: ${actionsDiffer}, final state differs: ${statesDiffer}).`);
	} else {
		throw new Error(
			'FAIL: two independently-seeded continuations produced identical ' +
			'actions and final state -- divergence check failed (this can ' +
			'rarely happen by chance on very short/forced lines; rerun).'
		);
	}

	console.log('\nAll checks passed.');
}

run();
