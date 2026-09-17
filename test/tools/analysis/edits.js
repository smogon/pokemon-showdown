/**
 * Tests for analysis field state edits (tools/analysis-edits.ts; docs/analysis/plan.md Phase 2a).
 * Fork-owned: the analysis tool isn't part of upstream.
 */
'use strict';

const assert = require('assert').strict;
const { createAnalysisBattle, getAnalysisSnapshot, replayAnalysisRecords } = require('../../../dist/tools/analysis-state');
const { getFieldEffectOptions } = require('../../../dist/tools/analysis-edits');

const TEAM = 'Magikarp||||splash|||||||]Feebas||||splash|||||||';
const SEED = 'sodium,00000000000000000000000000000001';

function battleFor(records, format = 'gen9customgame') {
	const output = [];
	const battle = createAnalysisBattle({ format, team1: TEAM, team2: TEAM, seed: SEED }, output);
	const result = replayAnalysisRecords(battle, records);
	battle.sendUpdates();
	return { battle, output: output.join('\n'), ...result };
}

const TEAM_PREVIEW = { seed: SEED, inputLog: ['>p1 team 1', '>p2 team 1'] };

function turnRecord(edits) {
	return { edits, seed: SEED, inputLog: ['>p1 move 1', '>p2 move 1'] };
}

describe('Analysis state edits', () => {
	it('offers only the field effects that exist in the format', () => {
		const { battle } = battleFor([]);
		const ids = getFieldEffectOptions(battle).map(option => option.id);
		for (const id of ['snowscape', 'electricterrain', 'trickroom', 'reflect', 'spikes', 'firepledge']) {
			assert(ids.includes(id), id);
		}
		for (const id of ['hail', 'mudsport', 'luckychant', 'gmaxsteelsurge', 'desolateland']) {
			assert(!ids.includes(id), id);
		}
		const gen8Ids = getFieldEffectOptions(battleFor([], 'gen8customgame').battle).map(option => option.id);
		assert(gen8Ids.includes('hail') && gen8Ids.includes('gmaxsteelsurge') && !gen8Ids.includes('snowscape'));
	});

	it('writes field state directly and emits only what changed', () => {
		const edits = {
			field: {
				weather: { id: 'raindance', duration: 3 },
				terrain: null,
				pseudoWeather: { trickroom: { duration: 2 } },
				sides: { p1: { reflect: {}, spikes: { layers: 2 } }, p2: { stealthrock: {}, lightscreen: null } },
			},
		};
		const { battle, output, appliedEdits } = battleFor([{ edits }]);
		const { field, sides } = getAnalysisSnapshot(battle);
		assert.equal(field.weather.id, 'raindance');
		assert.equal(field.weather.duration, 3);
		assert.deepEqual(field.pseudoWeather.map(effect => [effect.id, effect.duration]), [['trickroom', 2]]);
		assert.equal(sides[0].sideConditions.find(effect => effect.id === 'reflect').duration, 5);
		assert.equal(sides[0].sideConditions.find(effect => effect.id === 'spikes').data.layers, 2);
		assert(sides[1].sideConditions.some(effect => effect.id === 'stealthrock'));

		assert.match(output, /\|-weather\|RainDance\|\[silent\]/);
		assert.match(output, /\|-fieldstart\|move: Trick Room\|\[silent\]/);
		assert.equal(output.match(/\|-sidestart\|p1: Analysis 1\|move: Spikes\|\[silent\]/g).length, 2);
		// after the state lines, so the exact turns remaining replace the client's estimates
		assert(output.includes('|-sidestart|p2: Analysis 2|move: Stealth Rock|[silent]\n' +
			'|-message|Analysis edits: Rain (3 Turns), Trick Room (2 Turns); Team 1: Reflect (5 Turns), Spikes (2 Layers); ' +
			'Team 2: Stealth Rock (On)|[analysisdurations] weather:3,trickroom:2,p1:reflect:5'));
		// no terrain or Light Screen existed, so clearing them changed nothing
		assert.doesNotMatch(output, /-fieldend|-sideend/);
		assert.equal(appliedEdits[0].edits.field.terrain, undefined);
		assert.equal(appliedEdits[0].edits.field.sides.p2.lightscreen, undefined);
		assert.deepEqual(appliedEdits[0].summary, {
			field: ['Rain (3 Turns)', 'Trick Room (2 Turns)'],
			p1: ['Reflect (5 Turns)', 'Spikes (2 Layers)'],
			p2: ['Stealth Rock (On)'],
		});
	});

	it("doesn't consume RNG, so replays are deterministic", () => {
		const plain = createAnalysisBattle({ format: 'gen9customgame', team1: TEAM, team2: TEAM, seed: SEED });
		const edited = battleFor([{ edits: { field: { weather: { id: 'sunnyday' } } } }]).battle;
		assert.deepEqual(edited.prng.getSeed(), plain.prng.getSeed());

		const records = [TEAM_PREVIEW, turnRecord({ field: { terrain: { id: 'grassyterrain', duration: 4 } } }), turnRecord()];
		const first = battleFor(records);
		const second = battleFor(records);
		assert.equal(first.output.replace(/\|t:\|\d+/g, ''), second.output.replace(/\|t:\|\d+/g, ''));
		assert.deepEqual(getAnalysisSnapshot(first.battle), getAnalysisSnapshot(second.battle));
	});

	it('counts turns remaining including the current turn', () => {
		const edits = { field: { sides: { p2: { reflect: { duration: 2 } } } } };
		const reflect = battle => battle.sides[1].sideConditions['reflect'];
		// set at the start of turn 1 with 2 turns: still up at the start of turn 2, gone by turn 3
		const turn2 = battleFor([TEAM_PREVIEW, turnRecord(edits)]).battle;
		assert.equal(turn2.turn, 2);
		assert.equal(reflect(turn2).duration, 1);
		assert.equal(reflect(battleFor([TEAM_PREVIEW, turnRecord(edits), turnRecord()]).battle), undefined);
	});

	it('changes layers and removes effects set by earlier nodes', () => {
		const set = { field: { sides: { p1: { spikes: { layers: 3 } } }, weather: { id: 'raindance' } } };
		const change = { field: { sides: { p1: { spikes: { layers: 1 } } }, weather: null } };
		const { battle, output, appliedEdits } = battleFor([TEAM_PREVIEW, turnRecord(set), { edits: change }]);
		assert.equal(battle.sides[0].sideConditions['spikes'].layers, 1);
		assert.equal(battle.field.weather, '');
		// everything after the first node's edits message: the turn, then the second node's edit lines
		const changeLines = output.slice(output.indexOf('|-message|Analysis edits') + 1);
		assert.equal(changeLines.match(/\|-sideend\|p1: Analysis 1\|move: Spikes/g).length, 1);
		assert.equal(changeLines.match(/\|-sidestart\|p1: Analysis 1\|move: Spikes/g).length, 1);
		assert.match(changeLines, /\|-weather\|none\|\[silent\]/);
		assert.deepEqual(appliedEdits[2].summary, { field: ['Weather (Off)'], p1: ['Spikes (1 Layer)'], p2: [] });
	});

	it('writes Pokémon state and emits the matching lines', () => {
		const edits = {
			pokemon: {
				'p1:0': { hp: 20, status: 'tox', toxicStage: 3, boosts: { atk: 2, spe: -1 }, pp: [5] },
				'p2:0': { status: 'slp', sleepTurns: 2 },
			},
		};
		const { battle, output, appliedEdits } = battleFor([TEAM_PREVIEW, { edits }]);
		const [p1, p2] = battle.sides.map(side => side.active[0]);
		assert.equal(p1.hp, 20);
		assert.equal(p1.status, 'tox');
		assert.equal(p1.statusState.stage, 3);
		assert.equal(p1.boosts.atk, 2);
		assert.equal(p1.moveSlots[0].pp, 5);
		assert.equal(p2.statusState.time, 2);
		assert.match(output, /\|-status\|p1a: Magikarp\|tox\|\[silent\]/);
		assert.match(output, /\|-sethp\|p1a: Magikarp\|20\/\d+ tox\|\[silent\]/);
		assert.match(output, /\|-setboost\|p1a: Magikarp\|atk\|2\|\[silent\]/);
		// the protocol can't set status counters, so they get their own silent lines
		assert.match(output, /\|-message\|analysiscounter\|p1a: Magikarp\|toxic\|3\|\[silent\]/);
		assert.match(output, /\|-message\|analysiscounter\|p2a: Magikarp\|sleep\|2\|\[silent\]/);
		assert.deepEqual(appliedEdits[1].summary.p2, ['Magikarp: Status (Sleep, 2 turns)']);
		assert.deepEqual(appliedEdits[1].summary.p1, [
			'Magikarp: Status (Toxic, stage 3)', 'Magikarp: HP (20/181, 11%)', 'Magikarp: Splash PP (5/64)',
			'Magikarp: Atk (+2)', 'Magikarp: Spe (-1)',
		]);
		// requests are rebuilt from live state, so the client sees the edited PP
		assert.equal(battle.getRequests('move')[0].active[0].moves[0].pp, 5);
	});

	it('names Pokémon by team slot, so a swap in the same edit changes nothing', () => {
		// team slots never move: 0 is Magikarp and 1 is Feebas, whichever is active
		const edits = { pokemon: { 'p1:0': { hp: 30 } }, active: { p1: [1] } };
		const { battle, appliedEdits } = battleFor([TEAM_PREVIEW, { edits }]);
		const side = battle.sides[0];
		assert.equal(side.active[0].name, 'Feebas');
		assert.equal(side.pokemon[1].name, 'Magikarp');
		assert.equal(side.pokemon[1].hp, 30, 'the HP edit should have hit Magikarp, in team slot 0');
		assert.deepEqual(appliedEdits[1].summary.p1, ['Feebas: Active (Slot 1)', 'Magikarp: HP (30/181, 16.6%)']);

		// and a Pokémon sent out in the same save can be given boosts, since the swap runs first
		const together = { pokemon: { 'p1:1': { boosts: { atk: 2 } } }, active: { p1: [1] } };
		const { battle: combined, droppedEdits } = battleFor([TEAM_PREVIEW, { edits: together }]);
		assert.equal(droppedEdits.length, 0);
		assert.equal(combined.sides[0].active[0].boosts.atk, 2);
	});

	it('sends another Pokémon out, clearing the old one\'s boosts', () => {
		const setup = { pokemon: { 'p1:0': { boosts: { atk: 2 } } } };
		const edits = { active: { p1: [1] } }; // send out team slot 1 (Feebas)
		const { battle, output, appliedEdits } = battleFor([TEAM_PREVIEW, { edits: setup }, { edits }]);
		const side = battle.sides[0];
		assert.equal(side.active[0].name, 'Feebas');
		assert.equal(side.pokemon[0].name, 'Feebas');
		assert.equal(side.pokemon[1].name, 'Magikarp');
		assert.equal(side.pokemon[1].boosts.atk, 0, 'the Pokémon that left should lose its boosts');
		assert.match(output, /\|switch\|p1a: Feebas\|Feebas, M\|\d+\/\d+/);
		assert.deepEqual(appliedEdits[2].summary.p1, ['Feebas: Active (Slot 1)']);
		assert.deepEqual(appliedEdits[2].edits.active, { p1: [1] });
		// the snapshot reports both the moved position and the stable team slot
		const snapshot = getAnalysisSnapshot(battle).sides[0].pokemon;
		assert.deepEqual(snapshot.map(pokemon => [pokemon.name, pokemon.index, pokemon.teamSlot]), [
			['Feebas', 0, 1], ['Magikarp', 1, 0],
		]);
	});

	it('Terastallizes through the sim, and reports edits it cannot undo', () => {
		const edits = { pokemon: { 'p1:0': { terastallized: true } } };
		const { battle, output } = battleFor([TEAM_PREVIEW, { edits }]);
		assert.equal(battle.sides[0].active[0].terastallized, 'Water');
		assert.equal(battle.sides[0].pokemon[1].canTerastallize, null, 'one Terastallization per side');
		assert.match(output, /\|-terastallize\|p1a: Magikarp\|Water/);

		const undo = { pokemon: { 'p1:0': { terastallized: false } } };
		const { droppedEdits } = battleFor([TEAM_PREVIEW, { edits }, { edits: undo }]);
		assert.equal(droppedEdits.length, 1);
		assert.match(droppedEdits[0], /un-Terastallize/);
	});

	it('drops Pokémon edits that no longer make sense', () => {
		const edits = {
			pokemon: {
				'p1:1': { boosts: { atk: 2 } },
				'p1:5': { hp: 10 },
			}, // slot 1 is benched, slot 5 doesn't exist
		};
		const { droppedEdits, appliedEdits } = battleFor([TEAM_PREVIEW, { edits }]);
		assert.equal(droppedEdits.length, 2);
		assert.match(droppedEdits[0], /isn't active/);
		assert.match(droppedEdits[1], /no Pokémon in this team slot/);
		assert.equal(appliedEdits[1].edits.pokemon, undefined);
	});

	it('leaves primal weather alone and reports the edit as dropped', () => {
		const { battle, droppedEdits } = battleFor([]);
		battle.field.weather = 'desolateland';
		const result = replayAnalysisRecords(battle, [{ edits: { field: { weather: { id: 'raindance' } } } }]);
		assert.equal(battle.field.weather, 'desolateland');
		assert.equal(droppedEdits.length, 0);
		assert.equal(result.droppedEdits.length, 1);
		assert.deepEqual(result.appliedEdits[0].summary, { field: [], p1: [], p2: [] });
	});
});
