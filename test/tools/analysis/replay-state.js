/**
 * Tests for the edit keys a replay import needs (tools/analysis-pokemon-edits.ts, tools/analysis-edits.ts;
 * docs/analysis/replay-import-audit.md, stage B): percentage HP, current item and ability, and the history
 * counters a rebuilt battle has no way to know.
 * Fork-owned: the analysis tool isn't part of upstream.
 */
'use strict';

const assert = require('assert').strict;
const { createAnalysisBattle, getAnalysisSnapshot, replayAnalysisRecords } = require('../../../dist/tools/analysis-state');
const { getAnalysisCalcs } = require('../../../dist/tools/analysis-calc');

const TEAM = 'Incineroar||||fakeout,scratch|||||||]Feebas||||splash|||||||';
const SEED = 'sodium,00000000000000000000000000000001';

function battleFor(records, format = 'gen9customgame', team = TEAM) {
	const output = [];
	const battle = createAnalysisBattle({ format, team1: team, team2: team, seed: SEED }, output);
	const result = replayAnalysisRecords(battle, records);
	battle.sendUpdates();
	return { battle, output: output.join('\n'), ...result };
}

const TEAM_PREVIEW = { seed: SEED, inputLog: ['>p1 team 1', '>p2 team 1'] };

function turnRecord(edits, inputLog = ['>p1 move 1', '>p2 move 2']) {
	return { edits, seed: SEED, inputLog };
}

function active(battle, sideIndex = 0) {
	return battle.sides[sideIndex].active[0];
}

describe('Analysis replay-import state edits', () => {
	describe('percentage HP', () => {
		it('resolves against the Pokémon\'s max HP', () => {
			const { battle } = battleFor([TEAM_PREVIEW, { edits: { pokemon: { 'p1:0': { hpPercent: 50 } } } }]);
			const pokemon = active(battle);
			assert.equal(pokemon.hp, Math.round(pokemon.maxhp * 0.5));
		});

		it('stays proportional when a team edit changes max HP', () => {
			// The point of storing a percentage: the user finishes the inferred team during onboarding, and
			// the node's HP has to still mean the same fraction afterwards.
			const plain = battleFor([TEAM_PREVIEW, { edits: { pokemon: { 'p1:0': { hpPercent: 50 } } } }]);
			const evs = { hp: 252, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
			const sets = getAnalysisSnapshot(plain.battle).sides[0].pokemon.map(entry => ({ ...entry.set }));
			sets[0] = { ...sets[0], evs };
			const bulky = battleFor([TEAM_PREVIEW, {
				edits: {
					teams: { p1: { sets, from: sets.map((set, index) => index) } },
					pokemon: { 'p1:0': { hpPercent: 50 } },
				},
			}]);
			const before = active(plain.battle);
			const after = active(bulky.battle);
			assert(after.maxhp > before.maxhp, 'the EV spread should have raised max HP');
			assert.equal(after.hp, Math.round(after.maxhp * 0.5));
		});

		it('keeps a Pokémon on a sliver of HP alive', () => {
			// A replay shows a Focus Sash survivor as `1/100`, which must not round down to a faint.
			const { battle } = battleFor([TEAM_PREVIEW, { edits: { pokemon: { 'p1:0': { hpPercent: 1 } } } }]);
			const pokemon = active(battle);
			assert.equal(pokemon.hp, Math.max(1, Math.round(pokemon.maxhp * 0.01)));
			assert.equal(pokemon.fainted, false);
		});

		it('lets an absolute hp edit win when both are given', () => {
			const { battle } = battleFor([TEAM_PREVIEW, {
				edits: { pokemon: { 'p1:0': { hp: 17, hpPercent: 50 } } },
			}]);
			assert.equal(active(battle).hp, 17);
		});
	});

	describe('current item and ability', () => {
		it('sets and clears the current item without touching the set', () => {
			const held = battleFor([TEAM_PREVIEW, { edits: { pokemon: { 'p1:0': { item: 'Sitrus Berry' } } } }]);
			assert.equal(active(held.battle).item, 'sitrusberry');

			// A Pokémon that ate its berry still has it on its team: the set is the team layer's business.
			const eaten = battleFor([TEAM_PREVIEW, { edits: { pokemon: { 'p1:0': { item: '' } } } }]);
			assert.equal(active(eaten.battle).item, '');
			assert.equal(active(eaten.battle).set.item, '');
		});

		it('sets the current ability but leaves baseAbility alone', () => {
			// This is Trace / Skill Swap / Mega Evolution territory, not a set change.
			const { battle } = battleFor([TEAM_PREVIEW, { edits: { pokemon: { 'p1:0': { ability: 'Drizzle' } } } }]);
			const pokemon = active(battle);
			assert.equal(pokemon.ability, 'drizzle');
			assert.notEqual(pokemon.baseAbility, 'drizzle');
		});

		it('drops an item or ability that does not exist', () => {
			const { droppedEdits, battle } = battleFor([TEAM_PREVIEW, {
				edits: { pokemon: { 'p1:0': { item: 'Not An Item', ability: 'Not An Ability' } } },
			}]);
			assert.equal(droppedEdits.length, 2);
			assert.equal(active(battle).item, '');
		});
	});

	describe('PP spent', () => {
		it('subtracts the uses from the move\'s real max PP', () => {
			const { battle } = battleFor([TEAM_PREVIEW, { edits: { pokemon: { 'p1:0': { ppUsed: { fakeout: 3 } } } } }]);
			const move = active(battle).moveSlots.find(slot => slot.id === 'fakeout');
			assert.equal(move.pp, move.maxpp - 3);
		});

		/*
		 * The whole reason uses cross the wire instead of remaining PP. Champions replaces the PP formula
		 * outright — `(pp / 5 + 1) * 4` rather than `pp * 8 / 5` — so a client that subtracts for itself is
		 * wrong everywhere, and *silently*: the clamp below rounds an overestimate back up to full PP, which
		 * is exactly how an imported replay came out with every move untouched (user report).
		 */
		it('uses the format\'s own max PP, not the standard formula', () => {
			const format = 'gen9championsvgc2026regmb';
			const team = 'Venusaur||||protect,tackle|||||||]Charizard||||tackle|||||||';
			const { battle } = battleFor(
				[{ seed: SEED, inputLog: ['>p1 team 1, 2', '>p2 team 1, 2'] },
					{ edits: { pokemon: { 'p1:0': { ppUsed: { protect: 2 } } } } }],
				format, team
			);
			const move = active(battle).moveSlots.find(slot => slot.id === 'protect');
			// Champions: Protect's base 5 PP becomes 8, where the standard formula would have said 16.
			assert.equal(move.maxpp, 8);
			assert.equal(move.pp, 6);
		});

		it('never goes below zero, and an explicit pp wins', () => {
			const { battle } = battleFor([TEAM_PREVIEW, {
				edits: { pokemon: { 'p1:0': { ppUsed: { fakeout: 999, scratch: 1 }, pp: { fakeout: 5 } } } },
			}]);
			const moves = active(battle).moveSlots;
			assert.equal(moves.find(slot => slot.id === 'fakeout').pp, 5);
			const scratch = moves.find(slot => slot.id === 'scratch');
			assert.equal(scratch.pp, scratch.maxpp - 1);
		});

		it('drops uses for a move the Pokémon no longer has', () => {
			const { droppedEdits } = battleFor([TEAM_PREVIEW, {
				edits: { pokemon: { 'p1:0': { ppUsed: { surf: 1 } } } },
			}]);
			assert.equal(droppedEdits.length, 1);
		});
	});

	describe('history counters', () => {
		it('writes the counters through to the sim', () => {
			const { battle } = battleFor([TEAM_PREVIEW, {
				edits: {
					pokemon: {
						'p1:0': { activeTurns: 4, activeMoveActions: 3, timesAttacked: 7, lastMove: 'scratch' },
					},
				},
			}]);
			const pokemon = active(battle);
			assert.equal(pokemon.activeTurns, 4);
			assert.equal(pokemon.activeMoveActions, 3);
			assert.equal(pokemon.timesAttacked, 7);
			assert.equal(pokemon.lastMove.id, 'scratch');
		});

		it('makes Fake Out fail for a Pokémon that has been out all game', () => {
			// The headline case. Without `activeMoveActions` a reconstructed position is a fresh battle at
			// turn 1, so Fake Out flinches from a Pokémon that has been on the field since turn 1.
			const fakeOut = ['>p1 move 1', '>p2 move 2'];
			const restored = battleFor([TEAM_PREVIEW, turnRecord({
				pokemon: { 'p1:0': { activeMoveActions: 3 } },
			}, fakeOut)]);
			assert(restored.battle.log.join('\n').includes('Fake Out only works on your first turn out'));

			// ...and still works when the Pokémon really did just switch in.
			const fresh = battleFor([TEAM_PREVIEW, turnRecord(undefined, fakeOut)]);
			assert(!fresh.battle.log.join('\n').includes('Fake Out only works on your first turn out'));
		});

		it('survives an active swap in the same save', () => {
			// Swaps run first and zero the counters the way `switchIn` does, so the history layer has to
			// run after them or it would be overwritten.
			const { battle } = battleFor([TEAM_PREVIEW, {
				edits: { active: { p1: [1] }, pokemon: { 'p1:1': { activeTurns: 5 } } },
			}]);
			assert.equal(active(battle).name, 'Feebas');
			assert.equal(active(battle).activeTurns, 5);
		});

		it('converts the Protect chain to the sim\'s 3^N counter', () => {
			const { battle } = battleFor([TEAM_PREVIEW, { edits: { pokemon: { 'p1:0': { stallCount: 2 } } } }]);
			assert.equal(active(battle).volatiles['stall'].counter, 9);

			const cleared = battleFor([TEAM_PREVIEW, { edits: { pokemon: { 'p1:0': { stallCount: 0 } } } }]);
			assert(!cleared.battle.sides[0].active[0].volatiles['stall']);
		});
	});

	describe('volatiles with a payload', () => {
		it('locks the move a replay says Disable locked', () => {
			// The client `Battle` drops `-start`'s move argument, but the replay log states it outright
			// (`|-start|POKEMON|Disable|Shadow Sneak|[from] ability: Cursed Body`), so it is recoverable.
			const { battle, droppedEdits } = battleFor([TEAM_PREVIEW, {
				edits: {
					pokemon: {
						'p1:0': { lastMove: 'scratch', volatiles: { disable: { move: 'scratch' } } },
					},
				},
			}]);
			assert.deepEqual(droppedEdits, []);
			assert.equal(active(battle).volatiles['disable'].move, 'scratch');
		});

		it('needs lastMove, so history applies before the volatiles', () => {
			// Disable's own `onStart` refuses outright when the Pokémon has never moved.
			const { droppedEdits } = battleFor([TEAM_PREVIEW, {
				edits: { pokemon: { 'p1:0': { volatiles: { disable: { move: 'scratch' } } } } },
			}]);
			assert.equal(droppedEdits.length, 1);
			assert(droppedEdits[0].includes("can't have Disable"));
		});
	});

	describe('damage calcs', () => {
		// `@smogon/calc` has no Last Respects or Rage Fist base power at all — it reads a flat 50 from its
		// tables — so the calc asks the sim's own `basePowerCallback` instead (user report, 2026-09-19).
		const CALC_TEAM = 'Annihilape||||ragefist,lastrespects|||||||]Feebas||||splash|||||||';
		const CALC_PREVIEW = { seed: SEED, inputLog: ['>p1 team 1, 2', '>p2 team 1, 2'] };

		function damageFor(edits) {
			const output = [];
			const battle = createAnalysisBattle(
				{ format: 'gen9customgame', team1: CALC_TEAM, team2: CALC_TEAM, seed: SEED }, output
			);
			replayAnalysisRecords(battle, [CALC_PREVIEW, { edits }]);
			const byMove = {};
			for (const result of getAnalysisCalcs(battle, [])) {
				// both sides get results; only p1's Annihilape carries the edit
				if (result.attacker.side !== 'p1' || !result.targets[0]) continue;
				byMove[result.moveName] = result.targets[0].damage[0];
			}
			return byMove;
		}

		it('scales Rage Fist with timesAttacked', () => {
			const base = damageFor(undefined)['Rage Fist'];
			const hit = damageFor({ pokemon: { 'p1:0': { timesAttacked: 5 } } })['Rage Fist'];
			assert(hit > base * 3, `expected Rage Fist to scale, got ${base} then ${hit}`);
		});

		it('scales Last Respects with the side\'s fainted count', () => {
			const base = damageFor(undefined)['Last Respects'];
			const after = damageFor({ sides: { p1: { totalFainted: 3 } } })['Last Respects'];
			assert(after > base * 2, `expected Last Respects to scale, got ${base} then ${after}`);
		});

		it('leaves a fixed-power move alone', () => {
			// The override must only apply where the sim actually has a callback.
			const base = damageFor(undefined);
			const after = damageFor({ pokemon: { 'p1:0': { timesAttacked: 5 } } });
			assert.equal(after['Last Respects'], base['Last Respects']);
		});
	});

	describe('per-side state', () => {
		it('sets totalFainted, which Last Respects and Supreme Overlord read', () => {
			const { battle, appliedEdits } = battleFor([TEAM_PREVIEW, {
				edits: { sides: { p1: { totalFainted: 3 } } },
			}]);
			assert.equal(battle.sides[0].totalFainted, 3);
			assert.equal(appliedEdits[1].edits.sides.p1.totalFainted, 3);
		});

		it('runs after the Pokémon layer, which moves the count itself', () => {
			// Fainting a benched Pokémon bumps `totalFainted`, so the absolute value has to win.
			const { battle } = battleFor([TEAM_PREVIEW, {
				edits: { pokemon: { 'p1:1': { hp: 0 } }, sides: { p1: { totalFainted: 6 } } },
			}]);
			assert.equal(battle.sides[0].pokemon.find(entry => entry.name === 'Feebas').fainted, true);
			assert.equal(battle.sides[0].totalFainted, 6);
		});
	});

	/*
	 * A replay empties an active slot when a Pokémon fainted and its side had nothing left to send out
	 * (user report, 2026-09-19). `null` used to be skipped, so the slot kept its occupant — and because that
	 * occupant still counted as active, the HP edit then clamped it to 1 instead of fainting it.
	 */
	describe('an empty active slot', () => {
		const DOUBLES = 'Incineroar||||fakeout,scratch|||||||]Feebas||||splash|||||||]Pikachu||||thunderbolt|||||||';
		const DOUBLES_PREVIEW = { seed: SEED, inputLog: ['>p1 team 1, 2, 3', '>p2 team 1, 2, 3'] };
		function doublesBattle(edits) {
			return battleFor([DOUBLES_PREVIEW, { edits }], 'gen9doublescustomgame', DOUBLES);
		}
		const feebasOf = battle => battle.sides[0].pokemon.find(entry => entry.name === 'Feebas');

		it('faints the occupant and takes it off the field', () => {
			// Fainting is the only way a slot empties in a real battle, so clearing one says so outright
			// rather than leaving a healthy Pokémon in limbo.
			const { battle } = doublesBattle({ active: { p1: [0, null] } });
			assert.equal(feebasOf(battle).fainted, true);
			assert.equal(feebasOf(battle).isActive, false);
			assert.equal(battle.sides[0].active[1].name, 'Feebas', 'the sim keeps the slot pointing at it');
		});

		it('tells the renderer with a faint line that carries the slot', () => {
			// `|faint|` is the only line that empties a slot, and the ident has to name the slot: lines are
			// serialized after every edit, by which point the Pokémon is no longer active.
			const { output } = doublesBattle({ active: { p1: [0, null] } });
			assert.match(output, /\|faint\|p1b: Feebas/);
		});

		it('leaves a slot alone when the arrangement does not mention it', () => {
			// `undefined` still means "leave as is"; only an explicit null empties a slot.
			const { battle } = doublesBattle({ active: { p1: [0] } });
			assert.equal(feebasOf(battle).fainted, false);
			assert.equal(feebasOf(battle).isActive, true);
		});
	});

	describe('fainting what is on the field', () => {
		it('lets a replay faint an active Pokémon', () => {
			// A battle ends with exactly that: a fainted Pokémon still out, with no replacement to send.
			const { battle } = battleFor([TEAM_PREVIEW, { edits: { pokemon: { 'p1:0': { hpPercent: 0 } } } }]);
			assert.equal(active(battle).fainted, true);
		});

		it('still clamps an absolute hp edit, which is the panel', () => {
			// The Pokémon panel must not be able to KO whatever is on the field; `hpPercent` is the replay's
			// own channel, so the two don't collide.
			const { battle } = battleFor([TEAM_PREVIEW, { edits: { pokemon: { 'p1:0': { hp: 0 } } } }]);
			assert.equal(active(battle).hp, 1);
			assert.equal(active(battle).fainted, false);
		});
	});

	describe('the order edit lines come out in', () => {
		it('puts a volatile after the switch that sent its Pokémon out', () => {
			/*
			 * Edit lines are added once every layer has run, but a sim call made *by* an edit logs straight
			 * into the battle — so a self-announcing volatile landed before the active layer's `switch`, and
			 * a switch resets that Pokémon's volatiles in the renderer. An imported Disable was applied and
			 * then wiped, showing nothing on the sprite (user report, 2026-09-19).
			 */
			const { output } = battleFor([TEAM_PREVIEW, {
				edits: { active: { p1: [1] }, pokemon: { 'p1:1': { volatiles: { taunt: {} } } } },
			}]);
			const switchAt = output.indexOf('|switch|p1a: Feebas');
			const startAt = output.search(/\|-start\|p1a: Feebas\|[^|\n]*Taunt/);
			assert(switchAt >= 0, `expected a switch line, got:\n${output}`);
			assert(startAt > switchAt, `the volatile should follow the switch, got:\n${output}`);
		});

		it('sets Taunt, which a replay shows without a duration', () => {
			// Dropping it outright was worse than restoring it with the sim's own duration.
			const { battle, droppedEdits } = battleFor([TEAM_PREVIEW, {
				edits: { pokemon: { 'p1:0': { volatiles: { taunt: {} } } } },
			}]);
			assert.deepEqual(droppedEdits, []);
			assert(active(battle).volatiles.taunt, 'expected the taunt volatile');
		});

		it('sets Imprison, whose sealed moves the sim derives rather than stores', () => {
			const { battle, droppedEdits } = battleFor([TEAM_PREVIEW, {
				edits: { pokemon: { 'p1:0': { volatiles: { imprison: {} } } } },
			}]);
			assert.deepEqual(droppedEdits, []);
			assert(active(battle).volatiles.imprison, 'expected the imprison volatile');
		});

		it('sets Protosynthesis, letting the sim pick the boosted stat', () => {
			// `getBestStat` is already the right answer for this Pokémon's stats, so the panel offers no
			// stat to choose; the `-start` line carries it, which is what labels the sprite.
			const { battle, droppedEdits, output } = battleFor([TEAM_PREVIEW, {
				edits: { pokemon: { 'p1:0': { volatiles: { protosynthesis: {} } } } },
			}]);
			assert.deepEqual(droppedEdits, []);
			assert(active(battle).volatiles.protosynthesis, 'expected the protosynthesis volatile');
			assert.match(output, /\|-start\|p1a: Incineroar\|protosynthesis(atk|def|spa|spd|spe)/);
		});

		it('attributes it to a Booster Energy when the field would take it back', () => {
			/*
			 * The ability removes its own volatile the moment the field stops enabling it, unless it came
			 * from a Booster Energy — so without this the chip would vanish at the next weather change, and
			 * outside sun a Booster Energy is the only way to have the boost anyway.
			 */
			const { battle } = battleFor([TEAM_PREVIEW, {
				edits: { pokemon: { 'p1:0': { volatiles: { protosynthesis: {} } } } },
			}]);
			assert.equal(active(battle).volatiles.protosynthesis.fromBooster, true);
		});

		it('leaves it standing on its own in the weather that enables it', () => {
			// In sun the boost needs no item, so claiming one would be the lie.
			const { battle } = battleFor([TEAM_PREVIEW, {
				edits: {
					field: { weather: { id: 'sunnyday' } },
					pokemon: { 'p1:0': { volatiles: { protosynthesis: {} } } },
				},
			}]);
			assert(active(battle).volatiles.protosynthesis, 'expected the volatile');
			assert(!active(battle).volatiles.protosynthesis.fromBooster, 'should not claim a Booster Energy');
		});

		it('sets Quark Drive, which reads terrain rather than weather', () => {
			const { battle, droppedEdits } = battleFor([TEAM_PREVIEW, {
				edits: {
					field: { terrain: { id: 'electricterrain' } },
					pokemon: { 'p1:0': { volatiles: { quarkdrive: {} } } },
				},
			}]);
			assert.deepEqual(droppedEdits, []);
			assert(active(battle).volatiles.quarkdrive, 'expected the quarkdrive volatile');
			assert(!active(battle).volatiles.quarkdrive.fromBooster, 'Electric Terrain needs no Booster Energy');
		});

		it('locks Encore onto the move the replay says was being repeated', () => {
			// Encore has no argument in the log; `onStart` reads `lastMove`, which is the encored move for as
			// long as the Encore lasts, because the Pokémon can only repeat it.
			const { battle, droppedEdits } = battleFor([TEAM_PREVIEW, {
				edits: { pokemon: { 'p1:0': { lastMove: 'scratch', volatiles: { encore: {} } } } },
			}]);
			assert.deepEqual(droppedEdits, []);
			assert.equal(active(battle).volatiles.encore?.move, 'scratch');
		});

		it('refuses Encore when the replay gives no last move, rather than inventing one', () => {
			// `onStart` returns false without a `lastMove`, which is the honest outcome: the edit is reported
			// as dropped instead of silently encoring whatever happens to be in slot 1.
			const { battle, droppedEdits } = battleFor([TEAM_PREVIEW, {
				edits: { pokemon: { 'p1:0': { volatiles: { encore: {} } } } },
			}]);
			assert.equal(active(battle).volatiles.encore, undefined);
			assert(droppedEdits.some(entry => /Encore/.test(entry)), `expected a dropped edit, got ${JSON.stringify(droppedEdits)}`);
		});

		/*
		 * A Mega Evolution in the same save as an active swap (user report, 2026-09-19). Both bugs were in
		 * the lines alone — the sim state was right throughout, so only the rendered battle was wrong:
		 * a Pokémon vanished from the team icons and the wrong sprite stood on the field.
		 */
		describe('a Mega Evolution alongside an active swap', () => {
			const MEGA_TEAM = 'Dragonite||||dragonclaw|||||||]Snorlax||||bodyslam|||||||]' +
				'Gengar||gengarite||shadowball|||||||';
			const MEGA_PREVIEW = { seed: SEED, inputLog: ['>p1 team 1, 2, 3', '>p2 team 1, 2, 3'] };
			/*
			 * Gengar starts on the **bench**, so sending it out is a real `switch` rather than a swap of two
			 * Pokémon already on the field — and it is the Pokémon that Mega Evolves, which is what makes
			 * the switch line's details race the forme change.
			 */
			const megaBattle = () => battleFor([MEGA_PREVIEW, {
				edits: { active: { p1: [2, 1] }, pokemon: { 'p1:2': { megaEvolved: true } } },
			}], 'gen9doublescustomgame', MEGA_TEAM);

			it('switches the Pokémon in before changing its forme', () => {
				// `runMegaEvo` logs straight into the battle, while the switch is deferred until every layer
				// has run, so the forme change reached the renderer while the slot still held someone else.
				const { output } = megaBattle();
				const switchAt = output.indexOf('|switch|p1a: Gengar');
				const megaAt = output.indexOf('|detailschange|');
				assert(switchAt >= 0, `expected a switch line, got:\n${output}`);
				assert(megaAt > switchAt, `the forme change should follow the switch, got:\n${output}`);
			});

			it('announces the switch as the unevolved forme, so the renderer matches it', () => {
				// `getFullDetails` is a function resolved when the line is serialized, which is after the
				// Mega — so the switch named a Pokémon the renderer had never seen and it filed a new one.
				const { output } = megaBattle();
				assert.match(output, /\|switch\|p1a: Gengar\|Gengar\b/);
				assert(!/\|switch\|p1a: Gengar\|Gengar-Mega/.test(output),
					`the switch should not already be Mega, got:\n${output}`);
				assert.match(output, /\|detailschange\|p1a: Gengar\|Gengar-Mega/);
			});
		});

		it('announces the move a replay says Disable locked, not the last move used', () => {
			// Disable's own `onStart` line names `lastMove`, which is the disabled move only when Cursed Body
			// fired on the turn being rebuilt.
			const { battle, output } = battleFor([TEAM_PREVIEW, {
				edits: {
					pokemon: { 'p1:0': { lastMove: 'scratch', volatiles: { disable: { move: 'fakeout' } } } },
				},
			}]);
			assert.equal(active(battle).volatiles.disable.move, 'fakeout');
			assert.match(output, /\|-start\|p1a: Incineroar\|Disable\|Fake Out/);
			assert(!/\|Disable\|Scratch/.test(output), `should not name the last move, got:\n${output}`);
		});
	});
});
