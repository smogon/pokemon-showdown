/**
 * Tests for analysis field state edits (tools/analysis-edits.ts; docs/analysis/plan.md Phase 2a).
 * Fork-owned: the analysis tool isn't part of upstream.
 */
'use strict';

const assert = require('assert').strict;
const { createAnalysisBattle, getAnalysisSnapshot, replayAnalysisRecords } = require('../../../dist/tools/analysis-state');
const { getFieldEffectOptions } = require('../../../dist/tools/analysis-edits');

const TEAM = 'Magikarp||||splash|||||||]Feebas||||splash|||||||';
/** doubles needs a bench as well as two actives */
const TRIO = `${TEAM}]Gyarados||||splash|||||||`;
const SEED = 'sodium,00000000000000000000000000000001';

function battleFor(records, format = 'gen9customgame', team = TEAM) {
	const output = [];
	const battle = createAnalysisBattle({ format, team1: team, team2: team, seed: SEED }, output);
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
				'p1:0': { hp: 20, status: 'tox', toxicStage: 3, boosts: { atk: 2, spe: -1 }, pp: { splash: 5 } },
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

	it('Terastallizes through the sim', () => {
		const edits = { pokemon: { 'p1:0': { terastallized: true } } };
		const { battle, output } = battleFor([TEAM_PREVIEW, { edits }]);
		assert.equal(battle.sides[0].active[0].terastallized, 'Water');
		assert.match(output, /\|-terastallize\|p1a: Magikarp\|Water/);
	});

	it("unchecking Terastallization on the node that set it simply doesn't apply it", () => {
		// edits are absolute and the battle is rebuilt from scratch, so this needs no undo
		const { battle, output, droppedEdits, appliedEdits } = battleFor([
			TEAM_PREVIEW, { edits: { pokemon: { 'p1:0': { terastallized: false } } } },
		]);
		assert.deepEqual(droppedEdits, []);
		assert(!battle.sides[0].active[0].terastallized, 'it should not be Terastallized');
		assert(!/-terastallize/.test(output), 'no Terastallization line should be emitted');
		assert.equal(appliedEdits[appliedEdits.length - 1].edits.pokemon, undefined, 'the no-op should disappear');
	});

	it('Terastallizes a benched Pokémon, and it stays Terastallized when sent out', () => {
		// nothing in the sim or the renderer needs the Pokémon to be on the field
		const tera = {
			edits: { pokemon: { 'p1:1': { terastallized: true } } },
			seed: SEED, inputLog: ['>p1 move 1', '>p2 move 1'],
		};
		const { battle, output, droppedEdits } = battleFor([TEAM_PREVIEW, tera]);
		assert.deepEqual(droppedEdits, []);
		const feebas = battle.sides[0].pokemon.find(entry => entry.species.name === 'Feebas');
		assert(!feebas.isActive, 'Feebas should be benched');
		assert.equal(feebas.terastallized, 'Water');
		// a benched Pokémon is addressed `p1: Name`, which the client's getPokemon resolves
		assert.match(output, /\|-terastallize\|p1: Feebas\|Water/);

		// terastallized is a Pokemon field, so switching in keeps it
		const { battle: after } = battleFor([
			TEAM_PREVIEW, tera, { edits: { active: { p1: [1] } } },
		]);
		assert.equal(after.sides[0].active[0].species.name, 'Feebas');
		assert.equal(after.sides[0].active[0].terastallized, 'Water');
	});

	it('takes back a Terastallization from an earlier node', () => {
		const tera = {
			edits: { pokemon: { 'p1:0': { terastallized: true } } },
			seed: SEED, inputLog: ['>p1 move 1', '>p2 move 1'],
		};
		const teraOnly = battleFor([TEAM_PREVIEW, tera]).battle.sides[0].active[0];
		assert.equal(teraOnly.terastallized, 'Water');
		assert.deepEqual(teraOnly.getTypes(), ['Water'], 'Terastallizing overrides the typing');

		const { battle, output, droppedEdits } = battleFor([
			TEAM_PREVIEW, tera, { edits: { pokemon: { 'p1:0': { terastallized: false } } } },
		]);
		assert.deepEqual(droppedEdits, []);
		const pokemon = battle.sides[0].active[0];
		assert(!pokemon.terastallized, 'it should no longer be Terastallized');
		// types are derived from the flag, so clearing it restores the species typing
		assert.deepEqual(pokemon.getTypes(), ['Water'], 'Magikarp is Water anyway');
		assert(!/tera:/.test(pokemon.details), `details should lose the tera suffix: ${pokemon.details}`);
		// terastallize() nulls this for the whole side; taking it back restores it
		assert.equal(pokemon.canTerastallize, 'Water');
		assert.equal(battle.sides[0].pokemon[1].canTerastallize, 'Water');
		// the protocol can't express this, so the renderer reads it off a marker line
		assert(output.includes('analysistera'), 'a marker line should be emitted for the renderer');
	});

	it('lets several Pokémon on a side Terastallize, because the tool is a sandbox', () => {
		const { battle, droppedEdits } = battleFor([
			TEAM_PREVIEW,
			{ edits: { pokemon: { 'p1:0': { terastallized: true } } }, seed: SEED, inputLog: ['>p1 move 1', '>p2 move 1'] },
			{ edits: { active: { p1: [1] }, pokemon: { 'p1:1': { terastallized: true } } } },
		]);
		assert.deepEqual(droppedEdits, []);
		const side = battle.sides[0];
		assert.equal(side.pokemon.filter(entry => entry.terastallized).length, 2, 'both should be Terastallized');
	});

	it('leaves the sim\'s own one-per-side rule alone: only the edit layer is permissive', () => {
		// choosing Terastallization the normal way still goes through Side#chooseMove
		const { battle } = battleFor([TEAM_PREVIEW]);
		assert(battle.choose('p1', 'move 1 terastallize'), 'the first Terastallization should be accepted');
		battle.choose('p2', 'move 1');
		assert.equal(battle.sides[0].active[0].terastallized, 'Water');
		assert.equal(battle.sides[0].pokemon[1].canTerastallize, null, 'the side has used its Terastallization');
		// a later turn can't Terastallize again through the action menu
		battle.choose('p1', 'move 1');
		battle.choose('p2', 'move 1');
		assert(!battle.choose('p1', 'move 1 terastallize'), 'the sim should refuse a second Terastallization');

		// and an edit-driven Terastallization closes the normal path too, because it runs the sim's action
		const edited = battleFor([TEAM_PREVIEW, { edits: { pokemon: { 'p1:0': { terastallized: true } } } }]).battle;
		assert.equal(edited.sides[0].pokemon[1].canTerastallize, null);
		assert(!edited.choose('p1', 'move 1 terastallize'), 'the action menu should still refuse after an edit');
	});

	it('adds volatiles through the sim, so each one emits its own line', () => {
		const edits = { pokemon: { 'p1:0': { volatiles: { substitute: {}, aquaring: {}, destinybond: {} } } } };
		const { battle, output, appliedEdits } = battleFor([TEAM_PREVIEW, { edits }]);
		const p1 = battle.sides[0].active[0];
		assert.ok(p1.volatiles['substitute'], 'the substitute should be on the Pokémon');
		// the sim's own onStart fills this in: a quarter of max HP, not something this layer computes
		assert.equal(p1.volatiles['substitute'].hp, Math.floor(p1.maxhp / 4));
		assert.match(output, /\|-start\|p1a: Magikarp\|Substitute/);
		assert.match(output, /\|-start\|p1a: Magikarp\|Aqua Ring/);
		// Destiny Bond is a -singlemove, which is exactly why these go through addVolatile
		assert.match(output, /\|-singlemove\|p1a: Magikarp\|Destiny Bond/);
		assert.deepEqual(appliedEdits[1].summary.p1, [
			'Magikarp: Substitute (On)', 'Magikarp: Aqua Ring (On)', 'Magikarp: Destiny Bond (On)',
		]);
		// adding a Substitute costs no HP: the quarter-HP payment is on the move, not the condition
		assert.equal(p1.hp, p1.maxhp);
	});

	it('gives manually added volatiles their longest counters', () => {
		const edits = { pokemon: { 'p1:0': { volatiles: { confusion: {}, yawn: {}, partiallytrapped: {} } } } };
		const { battle } = battleFor([TEAM_PREVIEW, { edits }]);
		const p1 = battle.sides[0].active[0];
		// without an explicit time, `time--` would make it NaN and the confusion would never wear off
		assert.equal(p1.volatiles['confusion'].time, 5);
		assert.equal(p1.volatiles['partiallytrapped'].duration, 6);
		// decided default: asleep at the end of this turn rather than the next one
		assert.equal(p1.volatiles['yawn'].duration, 1);
	});

	it('sources partial trapping from a real foe, with a move behind it', () => {
		const edits = { pokemon: { 'p1:0': { volatiles: { partiallytrapped: { source: 0 } } } } };
		const { battle, output } = battleFor([TEAM_PREVIEW, { edits }]);
		const state = battle.sides[0].active[0].volatiles['partiallytrapped'];
		assert.equal(state.source, battle.sides[1].active[0]);
		// the condition reads `sourceEffect.id` every residual, so a missing move would throw
		assert.equal(state.sourceEffect.id, 'wrap');
		assert.match(output, /\|-activate\|p1a: Magikarp\|move: Wrap\|\[of\] p2a: Magikarp/);
	});

	it('seeds from the foe and survives a turn running', () => {
		const edits = { pokemon: { 'p1:0': { volatiles: { leechseed: {} } } } };
		const { battle, output } = battleFor([TEAM_PREVIEW, { edits }, turnRecord()]);
		const p1 = battle.sides[0].active[0];
		assert.ok(p1.volatiles['leechseed'], 'the seed should still be there after the turn');
		assert.equal(p1.volatiles['leechseed'].sourceSlot, 'p2a');
		// the residual drained into the seeder rather than doing nothing
		assert.ok(p1.hp < p1.maxhp, 'Leech Seed should have drained HP on the turn it ran');
		assert.match(output, /\|-damage\|p1a: Magikarp\|[^|]+\|\[from\] Leech Seed/);
	});

	it('picks the named foe slot as the source in doubles', () => {
		const preview = { seed: SEED, inputLog: ['>p1 team 1, 2', '>p2 team 1, 2'] };
		const edits = { pokemon: { 'p1:0': { volatiles: { leechseed: { source: 1 } } } } };
		const { battle } = battleFor([preview, { edits }], 'gen9doublescustomgame');
		const p1 = battle.sides[0].active[0];
		// slot 1 is the second foe, `p2b`, not the one directly opposite
		assert.equal(p1.volatiles['leechseed'].sourceSlot, 'p2b');
		assert.equal(p1.volatiles['leechseed'].source, battle.sides[1].active[1]);
	});

	it('removes a volatile an earlier node set', () => {
		const set = { pokemon: { 'p1:0': { volatiles: { aquaring: {} } } } };
		const clear = { pokemon: { 'p1:0': { volatiles: { aquaring: null } } } };
		const { battle, output, appliedEdits } = battleFor([TEAM_PREVIEW, { edits: set }, { edits: clear }]);
		assert.ok(!battle.sides[0].active[0].volatiles['aquaring']);
		// Aqua Ring has no onEnd line of its own, so the edit layer supplies one for the renderer
		assert.match(output, /\|-end\|p1a: Magikarp\|Aqua Ring\|\[silent\]/);
		assert.deepEqual(appliedEdits[2].summary.p1, ['Magikarp: Aqua Ring (Off)']);
	});

	it("doesn't toggle a volatile off by re-applying the same edit", () => {
		// Power Trick's onRestart removes it, so a second save of the same state must not re-add it
		const edits = { pokemon: { 'p1:0': { volatiles: { powertrick: {} } } } };
		const { battle } = battleFor([TEAM_PREVIEW, { edits }, { edits }]);
		const p1 = battle.sides[0].active[0];
		assert.ok(p1.volatiles['powertrick'], 'Power Trick should still be on after a repeated edit');
		assert.equal(p1.storedStats.atk, p1.baseStoredStats.def);
	});

	it('drops volatiles the sim refuses and ones the format has no place for', () => {
		const edits = {
			pokemon: { 'p1:0': { volatiles: { nightmare: {}, dynamax: {}, bogusvolatile: {} } } },
		};
		const { battle, droppedEdits, appliedEdits } = battleFor([TEAM_PREVIEW, { edits }]);
		const p1 = battle.sides[0].active[0];
		// Nightmare's onStart refuses a Pokémon that isn't asleep; Dynamax is gen 8 only
		assert.ok(!p1.volatiles['nightmare']);
		assert.ok(!p1.volatiles['dynamax']);
		assert.equal(droppedEdits.length, 3);
		assert.ok(!appliedEdits[1].edits.pokemon, 'nothing should be recorded as applied');
	});

	it('lets Nightmare through once the same save puts the Pokémon to sleep', () => {
		const edits = { pokemon: { 'p1:0': { status: 'slp', volatiles: { nightmare: {} } } } };
		const { battle, output, droppedEdits } = battleFor([TEAM_PREVIEW, { edits }]);
		assert.equal(droppedEdits.length, 0);
		assert.ok(battle.sides[0].active[0].volatiles['nightmare']);
		assert.match(output, /\|-start\|p1a: Magikarp\|Nightmare/);
	});

	it('faints a benched Pokémon set to 0 HP, and refuses to KO an active one', () => {
		const edits = { pokemon: { 'p1:1': { hp: 0 }, 'p1:0': { hp: 0 } } };
		const { battle, output, appliedEdits } = battleFor([TEAM_PREVIEW, { edits }]);
		const side = battle.sides[0];
		const [active, benched] = [side.active[0], side.pokemon[1]];
		assert.equal(benched.name, 'Feebas');
		assert.ok(benched.fainted, 'the benched Pokémon should have fainted');
		assert.equal(benched.hp, 0);
		assert.equal(side.pokemonLeft, 1, 'the side should have one Pokémon left');
		// `|faint|` assumes an active Pokémon, so a benched one is marked by team slot instead
		assert.match(output, /\|-message\|analysisfaint\|p1\|1\|1\|\[silent\]/);
		// the active one is clamped to 1 instead: the form can't KO whoever is on the field
		assert.equal(active.hp, 1);
		assert.ok(!active.fainted);
		assert.deepEqual(appliedEdits[1].summary.p1, ['Feebas: Fainted', 'Magikarp: HP (1/181, 0.6%)']);
	});

	it('leaves a Pokémon fainted in the same save with no status', () => {
		// HP runs before status, so the status guard sees the faint this edit is producing
		const edits = { pokemon: { 'p1:1': { hp: 0, status: 'brn' } } };
		const { battle, droppedEdits } = battleFor([TEAM_PREVIEW, { edits }]);
		const benched = battle.sides[0].pokemon[1];
		assert.ok(benched.fainted);
		assert.equal(benched.status, '', 'a fainted Pokémon must not keep a status');
		assert.equal(droppedEdits.length, 1);
		assert.match(droppedEdits[0], /has fainted/);
	});

	it('revives a Pokémon an earlier node fainted', () => {
		const kill = { pokemon: { 'p1:1': { hp: 0 } } };
		const back = { pokemon: { 'p1:1': { hp: 40 } } };
		const { battle, output } = battleFor([TEAM_PREVIEW, { edits: kill }, { edits: back }]);
		const side = battle.sides[0];
		const revived = side.pokemon.find(pokemon => pokemon.name === 'Feebas');
		assert.ok(!revived.fainted, 'setting HP above 0 should revive it');
		assert.equal(revived.hp, 40);
		assert.equal(side.pokemonLeft, 2);
		// the protocol has no revive line at all, so the renderer is told through the analysis escape hatch
		assert.match(output, /\|-message\|analysisfaint\|p1\|1\|0\|\[silent\]/);
	});

	it('sends out a Pokémon the same save revives', () => {
		const kill = { pokemon: { 'p1:1': { hp: 0 } } };
		// swaps run before state edits, so this would otherwise be refused as "has fainted"
		const back = { pokemon: { 'p1:1': { hp: 50 } }, active: { p1: [1] } };
		const { battle, droppedEdits } = battleFor([TEAM_PREVIEW, { edits: kill }, { edits: back }]);
		const side = battle.sides[0];
		assert.equal(droppedEdits.length, 0);
		assert.equal(side.active[0].name, 'Feebas');
		assert.equal(side.active[0].hp, 50);
		assert.ok(!side.active[0].fainted);
	});

	it('sets a benched Pokémon to 1 HP rather than 0 when the same save sends it out', () => {
		const edits = { pokemon: { 'p1:1': { hp: 0 } }, active: { p1: [1] } };
		const { battle, droppedEdits, appliedEdits } = battleFor([TEAM_PREVIEW, { edits }]);
		const side = battle.sides[0];
		assert.equal(side.active[0].name, 'Feebas');
		assert.equal(side.active[0].hp, 1, 'it should come out at 1 HP, not fainted');
		assert.ok(!side.active[0].fainted);
		assert.equal(side.pokemonLeft, 2);
		assert.equal(droppedEdits.length, 0);
		assert.deepEqual(appliedEdits[1].summary.p1, ['Feebas: Active (Slot 1)', 'Feebas: HP (1/181, 0.6%)']);
	});

	it('moves an already-active Pokémon between slots instead of refusing', () => {
		// doubles: Magikarp in slot 1, Feebas in slot 2, Gyarados benched. Send Gyarados to slot 2, then
		// Feebas (now displaced) to slot 1 — the merged edit is the arrangement [Feebas, Gyarados].
		const preview = { seed: SEED, inputLog: ['>p1 team 1, 2, 3', '>p2 team 1, 2, 3'] };
		const edits = { active: { p1: [1, 2] } };
		const { battle, output, droppedEdits } = battleFor([preview, { edits }], 'gen9doublescustomgame', TRIO);
		const side = battle.sides[0];
		assert.deepEqual(side.active.map(pokemon => pokemon.name), ['Feebas', 'Gyarados']);
		// the sim keeps each active Pokémon at its own index in side.pokemon
		assert.deepEqual(side.pokemon.slice(0, 2).map(pokemon => pokemon.name), ['Feebas', 'Gyarados']);
		assert.equal(side.active[0].position, 0);
		assert.equal(side.active[1].position, 1);
		assert.equal(droppedEdits.length, 0, `nothing should be dropped: ${JSON.stringify(droppedEdits)}`);
		/*
		 * `|swap|` is the Ally Switch line, which is how the renderer is told an active Pokémon changed slots.
		 * It must name the slot Feebas is moving *from* (`p1b`), not the one it lands in: the renderer looks
		 * the ident up positionally, so naming the destination resolves to whoever is still there and the
		 * swap silently does nothing on its side.
		 */
		assert.match(output, /\|swap\|p1b: Feebas\|0\|\[silent\]/);
	});

	it('reaches an arrangement that only reorders the Pokémon already out', () => {
		const preview = { seed: SEED, inputLog: ['>p1 team 1, 2, 3', '>p2 team 1, 2, 3'] };
		// swap the two actives with each other and touch nothing else
		const edits = { active: { p1: [1, 0] } };
		const { battle, droppedEdits } = battleFor([preview, { edits }], 'gen9doublescustomgame', TRIO);
		assert.deepEqual(battle.sides[0].active.map(pokemon => pokemon.name), ['Feebas', 'Magikarp']);
		assert.equal(droppedEdits.length, 0);
	});

	it('keeps a slot edit that names the Pokémon already there as a no-op', () => {
		const preview = { seed: SEED, inputLog: ['>p1 team 1, 2, 3', '>p2 team 1, 2, 3'] };
		const edits = { active: { p1: [0, 2] } };
		const { battle, appliedEdits } = battleFor([preview, { edits }], 'gen9doublescustomgame', TRIO);
		assert.deepEqual(battle.sides[0].active.map(pokemon => pokemon.name), ['Magikarp', 'Gyarados']);
		// slot 1 didn't change, so only slot 2 is reported as applied
		assert.deepEqual(appliedEdits[1].summary.p1, ['Gyarados: Active (Slot 2)']);
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
