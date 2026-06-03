'use strict';

const assert = require('../../../assert');

const { HeuristicEngine } =
	require('../../../../dist/sim/tools/strategic-ai/engines/HeuristicEngine');
const { LightHeuristicEngine } =
	require('../../../../dist/sim/tools/strategic-ai/engines/LightHeuristicEngine');
const { OnePlySearchEngine } =
	require('../../../../dist/sim/tools/strategic-ai/engines/OnePlySearchEngine');
const { MctsEngine } =
	require('../../../../dist/sim/tools/strategic-ai/engines/MctsEngine');
const { RandomEngine } =
	require('../../../../dist/sim/tools/strategic-ai/engines/RandomEngine');
const { BattleStateTracker } =
	require('../../../../dist/sim/tools/strategic-ai/state/BattleStateTracker');
const { PRNG } = require('../../../../dist/sim');

/**
 * Build a fake `PokemonSwitchRequestData` good enough for the engines.
 * We pass uuid through so the tracker keys on it the same way the live
 * simulator does.
 */
function mkReq(name, opts = {}) {
	return {
		ident: `${opts.position ?? 'p1'}: ${name}`,
		uuid: opts.uuid ?? `uuid-${name.toLowerCase()}`,
		details: `${name}, L100, M`,
		condition: opts.fainted ? '0 fnt' : (opts.condition ?? '100/100'),
		active: !!opts.active,
		stats: opts.stats ?? { atk: 100, def: 100, spa: 100, spd: 100, spe: 100 },
		moves: opts.moves ?? [],
		baseAbility: opts.ability ?? '',
		item: opts.item ?? '',
		pokeball: 'pokeball',
		types: opts.types ?? ['Normal'],
		boosts: opts.boosts ?? {},
		status: opts.status ?? '',
	};
}

function emptyEngineCtx(tracker) {
	return {
		tracker,
		prng: PRNG.get(null),
		difficulty: 3,
		lastMoveByMon: new Map(),
		disabledMovesByMon: new Map(),
		trappedActiveByMon: new Set(),
		lastSwitchTurnByMon: new Map(),
		lastMoveFailedByMon: new Set(),
		noiseEpsilon: 0,
		infoForgetting: 0,
	};
}

describe('Strategic-AI force-switch regression', () => {
	// Reproduces the production tie-on-faint bug: when the trainer's
	// active mon is KO'd, the engine receives a forceSwitch request whose
	// `request.side.pokemon` lists every team mon (active+bench). Earlier
	// the heuristic engine's `chooseForceSwitch` filtered candidates by
	// "is this mon already in the tracker?". On the first force-switch
	// of a battle that filter dropped everyone, the engine returned
	// `"pass"`, showdown rejected with `[Invalid choice] Can't pass:
	// Your X must make a move (or switch)`, the safety valve fired
	// `>forcetie` after 5 retries, and the battle ended in a tie.
	//
	// The fix is "build candidates straight from the request, only use
	// the tracker for ranking". This test pins that contract for every
	// engine that handles forceSwitch.
	const engines = [
		['RandomEngine', () => new RandomEngine()],
		['LightHeuristicEngine', () => new LightHeuristicEngine()],
		['HeuristicEngine', () => new HeuristicEngine()],
		['OnePlySearchEngine', () => new OnePlySearchEngine()],
		['MctsEngine', () => new MctsEngine()],
	];

	const request = {
		forceSwitch: [true],
		side: {
			id: 'p1',
			name: 'Trainer',
			pokemon: [
				mkReq('Charmander', { active: true, fainted: true }),
				mkReq('Pidgeotto'),
				mkReq('Squirtle'),
			],
			foePokemon: [
				mkReq('Venusaur', { position: 'p2a', active: true, types: ['Grass', 'Poison'] }),
			],
		},
	};

	for (const [label, build] of engines) {
		it(`${label} returns a valid switch (not "pass") on a fresh forceSwitch`, () => {
			const engine = build();
			const tracker = new BattleStateTracker({ mySide: 'p1' });
			const ctx = emptyEngineCtx(tracker);
			const choice = engine.choose(request, ctx);
			assert(/^switch \d+$/.test(choice),
				`${label} should produce 'switch N', got: ${JSON.stringify(choice)}`);
			const slot = parseInt(choice.split(' ')[1], 10);
			assert(slot === 2 || slot === 3,
				`${label} switched to a slot that doesn't exist: ${choice}`);
		});

		it(`${label} returns 'pass' only when every bench Pokemon is fainted`, () => {
			const engine = build();
			const tracker = new BattleStateTracker({ mySide: 'p1' });
			const ctx = emptyEngineCtx(tracker);
			const allFaintedRequest = {
				forceSwitch: [true],
				side: {
					id: 'p1',
					name: 'Trainer',
					pokemon: [
						mkReq('Charmander', { active: true, fainted: true }),
						mkReq('Pidgeotto', { fainted: true }),
						mkReq('Squirtle', { fainted: true }),
					],
					foePokemon: [
						mkReq('Venusaur', { position: 'p2a', active: true, types: ['Grass', 'Poison'] }),
					],
				},
			};
			const choice = engine.choose(allFaintedRequest, ctx);
			assert.equal(choice, 'pass',
				`${label} should pass when no live bench mon exists; got ${JSON.stringify(choice)}`);
		});
	}
});
