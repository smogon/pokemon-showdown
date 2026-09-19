/**
 * Tests for analysis team and set edits (tools/analysis-team-edits.ts; docs/analysis/plan.md Phase 3).
 * Fork-owned: the analysis tool isn't part of upstream.
 */
'use strict';

const assert = require('assert').strict;
const { createAnalysisBattle, getAnalysisSnapshot, replayAnalysisRecords } = require('../../../dist/tools/analysis-state');

const TEAM = 'Magikarp||||splash|||||||]Feebas||||splash|||||||]Pikachu||||thunderbolt|||||||';
const SEED = 'sodium,00000000000000000000000000000001';

function battleFor(records, format = 'gen9customgame') {
	const output = [];
	const battle = createAnalysisBattle({ format, team1: TEAM, team2: TEAM, seed: SEED }, output);
	const result = replayAnalysisRecords(battle, records);
	battle.sendUpdates();
	return { battle, output: output.join('\n'), ...result };
}

const TEAM_PREVIEW = { seed: SEED, inputLog: ['>p1 team 1', '>p2 team 1'] };

/** The roster as the client would send it back: every entry keeps the slot it came from. */
function rosterOf(battle, sideId) {
	const side = battle.sides[sideId === 'p1' ? 0 : 1];
	return {
		sets: side.pokemon.map(pokemon => ({ ...pokemon.set })),
		from: side.pokemon.map(pokemon => side.team.indexOf(pokemon.set)),
	};
}

function sideSnapshot(battle, sideId) {
	return getAnalysisSnapshot(battle).sides[sideId === 'p1' ? 0 : 1];
}

describe('Analysis team edits', () => {
	it('mutates a surviving set in place, keeping its team slot and object identity', () => {
		const base = battleFor([TEAM_PREVIEW]).battle;
		const roster = rosterOf(base, 'p1');
		// Magikarp is active (slot 0); edit the benched Feebas
		const feebas = roster.sets.findIndex(set => set.species === 'Feebas');
		roster.sets[feebas] = { ...roster.sets[feebas], item: 'Leftovers', ability: 'Swift Swim' };

		const { battle, droppedEdits } = battleFor([
			TEAM_PREVIEW,
			{ edits: { teams: { p1: roster } }, seed: SEED },
		]);
		assert.deepEqual(droppedEdits, []);
		const side = battle.sides[0];
		const pokemon = side.pokemon.find(entry => entry.species.name === 'Feebas');
		assert.equal(pokemon.item, 'leftovers');
		assert.equal(pokemon.ability, 'swiftswim');
		// the set object is still the one in side.team, so the slot is unchanged
		assert.equal(side.team.indexOf(pokemon.set), roster.from[feebas]);
		assert.equal(side.team.length, 3);
	});

	it("renames an un-nicknamed Pokémon along with its species, and resyncs so the ident lands", () => {
		// `normalizeSet` fills an empty nickname in with the species name, so refusing to move the name
		// left a Pokémon whose species had changed still called by the old one (Set Up Position, Phase 4)
		const roster = rosterOf(battleFor([TEAM_PREVIEW]).battle, 'p1');
		const karp = roster.sets.findIndex(set => set.species === 'Magikarp');
		roster.sets[karp] = { ...roster.sets[karp], species: 'Gyarados', name: 'Gyarados' };

		const { battle, output, droppedEdits, appliedEdits } = battleFor([
			TEAM_PREVIEW,
			{ edits: { teams: { p1: roster } }, seed: SEED },
		]);
		assert.deepEqual(droppedEdits, []);
		const pokemon = battle.sides[0].pokemon[karp];
		assert.equal(pokemon.species.name, 'Gyarados');
		assert.equal(pokemon.name, 'Gyarados');
		assert.equal(pokemon.fullname, 'p1: Gyarados');
		// the protocol can't rename, so the renderer has to be rebuilt to learn the new ident
		assert.ok(output.includes('|clearpoke'), 'a rename should resync the rosters');
		assert.ok(output.includes('|switch|p1a: Gyarados|'),
			output.split('\n').filter(line => line.includes('switch')).join('\n'));
		// a name that only followed the species isn't reported as a nickname change
		const summary = appliedEdits[1].summary.p1.join(' ');
		assert.ok(summary.includes('Species (Gyarados)'), summary);
		assert.ok(!summary.includes('Nickname'), summary);
	});

	it('keeps a real nickname when only the species changes', () => {
		const roster = rosterOf(battleFor([TEAM_PREVIEW]).battle, 'p1');
		const karp = roster.sets.findIndex(set => set.species === 'Magikarp');
		roster.sets[karp] = { ...roster.sets[karp], species: 'Gyarados', name: 'Splashy' };

		const { battle, droppedEdits } = battleFor([
			TEAM_PREVIEW,
			{ edits: { teams: { p1: roster } }, seed: SEED },
		]);
		assert.deepEqual(droppedEdits, []);
		const pokemon = battle.sides[0].pokemon[karp];
		assert.equal(pokemon.species.name, 'Gyarados');
		assert.equal(pokemon.name, 'Splashy');
		assert.equal(pokemon.fullname, 'p1: Splashy');
	});

	it('keeps the HP percent when a set edit changes max HP', () => {
		const roster = rosterOf(battleFor([TEAM_PREVIEW]).battle, 'p1');
		const karp = roster.sets.findIndex(set => set.species === 'Magikarp');
		roster.sets[karp] = { ...roster.sets[karp], evs: { hp: 252, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 } };

		// hurt the active Magikarp on an earlier node, then raise its max HP on a later one
		const hurt = { edits: { pokemon: { 'p1:0': { hp: 10 } } }, seed: SEED, inputLog: ['>p1 move 1', '>p2 move 1'] };
		const before = battleFor([TEAM_PREVIEW, hurt]).battle.sides[0].pokemon[0];
		const percent = before.hp / before.maxhp;
		assert.equal(before.hp, 10);

		const { battle: after, droppedEdits } = battleFor([
			TEAM_PREVIEW, hurt, { edits: { teams: { p1: roster } }, seed: SEED },
		]);
		assert.deepEqual(droppedEdits, []);
		const pokemon = after.sides[0].pokemon[0];
		assert(pokemon.maxhp > before.maxhp, `max HP should have gone up: ${pokemon.maxhp} vs ${before.maxhp}`);
		assert.equal(pokemon.hp, Math.max(1, Math.round(percent * pokemon.maxhp)));
	});

	it('lets an HP edit on the same node override the percent the team edit carried over', () => {
		const roster = rosterOf(battleFor([TEAM_PREVIEW]).battle, 'p1');
		const karp = roster.sets.findIndex(set => set.species === 'Magikarp');
		roster.sets[karp] = { ...roster.sets[karp], evs: { hp: 252, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 } };

		// layers run teams -> pokemon, so the explicit HP wins
		const { battle } = battleFor([
			TEAM_PREVIEW,
			{ edits: { teams: { p1: roster }, pokemon: { 'p1:0': { hp: 10 } } }, seed: SEED },
		]);
		assert.equal(battle.sides[0].pokemon[0].hp, 10);
	});

	it('adds a Pokémon with its own new team slot and resyncs the renderer', () => {
		const roster = rosterOf(battleFor([TEAM_PREVIEW]).battle, 'p1');
		roster.sets.push({
			name: 'Gyarados', species: 'Gyarados', item: '', ability: 'Intimidate', moves: ['Waterfall'],
			nature: 'Serious', gender: 'M', evs: {}, ivs: {}, level: 100,
		});
		roster.from.push(null);

		const { battle, output, droppedEdits } = battleFor([
			TEAM_PREVIEW,
			{ edits: { teams: { p1: roster } }, seed: SEED },
		]);
		assert.deepEqual(droppedEdits, []);
		const side = battle.sides[0];
		assert.equal(side.pokemon.length, 4);
		assert.equal(side.pokemonLeft, 4);
		const added = side.pokemon.find(entry => entry.species.name === 'Gyarados');
		// appended to the identity registry, so it gets a slot after the originals
		assert.equal(side.team.indexOf(added.set), 3);
		assert(output.includes('|clearpoke'), 'a composition change resyncs the renderer');
		assert(output.includes('|teamsize|p1|4'));
		assert(output.includes('Gyarados'));
	});

	it('removes a benched Pokémon without renumbering the slots after it', () => {
		const base = battleFor([TEAM_PREVIEW]).battle;
		const roster = rosterOf(base, 'p1');
		const feebas = roster.sets.findIndex(set => set.species === 'Feebas');
		const pikachuSlot = roster.from[roster.sets.findIndex(set => set.species === 'Pikachu')];
		roster.sets.splice(feebas, 1);
		roster.from.splice(feebas, 1);

		const { battle, droppedEdits } = battleFor([
			TEAM_PREVIEW,
			{ edits: { teams: { p1: roster } }, seed: SEED },
		]);
		assert.deepEqual(droppedEdits, []);
		const side = battle.sides[0];
		assert.equal(side.pokemon.length, 2);
		assert.equal(side.pokemonLeft, 2);
		assert(!side.pokemon.some(entry => entry.species.name === 'Feebas'));
		// the tombstone keeps Pikachu's slot stable, which is what edits on later nodes are keyed by
		const pikachu = side.pokemon.find(entry => entry.species.name === 'Pikachu');
		assert.equal(side.team.indexOf(pikachu.set), pikachuSlot);
		assert.equal(side.team.length, 3);
	});

	it('sends out a replacement when the removed Pokémon is on the field', () => {
		const base = battleFor([TEAM_PREVIEW]).battle;
		const roster = rosterOf(base, 'p1');
		const activeName = base.sides[0].active[0].species.name;
		const index = roster.sets.findIndex(set => set.species === activeName);
		roster.sets.splice(index, 1);
		roster.from.splice(index, 1);

		const { battle, droppedEdits, appliedEdits } = battleFor([
			TEAM_PREVIEW,
			{ edits: { teams: { p1: roster } }, seed: SEED },
		]);
		assert.deepEqual(droppedEdits, []);
		const side = battle.sides[0];
		assert.equal(side.pokemon.length, 2);
		assert(!side.pokemon.some(entry => entry.species.name === activeName), 'the active Pokémon should be gone');
		// the slot is filled, and the sim's active/pokemon invariant still holds
		assert(side.active[0] && side.active[0].isActive, 'the slot should have a replacement');
		assert.equal(side.active[0], side.pokemon[0]);
		assert.equal(side.pokemonLeft, 2);
		// recorded as an active edit, which is what clears the action drafted for that slot
		const applied = appliedEdits[appliedEdits.length - 1];
		assert.equal(applied.edits.active.p1[0], side.team.indexOf(side.active[0].set));
	});

	it('refuses to empty a side', () => {
		const { battle, droppedEdits } = battleFor([
			TEAM_PREVIEW,
			{ edits: { teams: { p1: { sets: [], from: [] } } }, seed: SEED },
		]);
		assert(droppedEdits.some(entry => entry.includes('at least one Pokémon')), droppedEdits.join('; '));
		assert.equal(battle.sides[0].pokemon.length, 3, 'the roster should be left alone');
	});

	it('keys PP by move, so a move change and its new PP save together', () => {
		const base = battleFor([TEAM_PREVIEW]).battle;
		const roster = rosterOf(base, 'p1');
		const pikachu = roster.sets.findIndex(set => set.species === 'Pikachu');
		const pikachuSlot = roster.from[pikachu];
		roster.sets[pikachu] = { ...roster.sets[pikachu], moves: ['Thunderbolt', 'Thunder Wave'] };

		// swap Thunderbolt for Iron Tail and set the new move's PP in the same save
		const swapped = JSON.parse(JSON.stringify(roster));
		swapped.sets[pikachu] = { ...swapped.sets[pikachu], moves: ['Iron Tail', 'Thunder Wave'] };
		const { battle, droppedEdits, appliedEdits } = battleFor([
			TEAM_PREVIEW,
			{
				edits: {
					teams: { p1: swapped },
					pokemon: { [`p1:${pikachuSlot}`]: { pp: { irontail: 4, thunderwave: 7 } } },
				},
				seed: SEED,
			},
		]);
		assert.deepEqual(droppedEdits, []);
		const pokemon = battle.sides[0].pokemon.find(entry => entry.species.name === 'Pikachu');
		assert.equal(pokemon.moveSlots[0].id, 'irontail');
		assert.equal(pokemon.moveSlots[0].pp, 4, "the new move's PP applies in the same save");
		assert.equal(pokemon.moveSlots[1].pp, 7);
		const applied = appliedEdits[appliedEdits.length - 1];
		assert.deepEqual(applied.edits.pokemon[`p1:${pikachuSlot}`].pp, { irontail: 4, thunderwave: 7 });
	});

	it('drops a PP edit for a move the Pokémon no longer has', () => {
		const base = battleFor([TEAM_PREVIEW]).battle;
		const roster = rosterOf(base, 'p1');
		const pikachu = roster.sets.findIndex(set => set.species === 'Pikachu');
		const pikachuSlot = roster.from[pikachu];
		roster.sets[pikachu] = { ...roster.sets[pikachu], moves: ['Iron Tail'] };

		const { droppedEdits, appliedEdits } = battleFor([
			TEAM_PREVIEW,
			{
				edits: {
					teams: { p1: roster },
					// thunderbolt is gone, so its PP edit is simply irrelevant
					pokemon: { [`p1:${pikachuSlot}`]: { pp: { thunderbolt: 3, irontail: 2 } } },
				},
				seed: SEED,
			},
		]);
		assert(droppedEdits.some(entry => /thunderbolt is no longer/.test(entry)), droppedEdits.join('; '));
		const applied = appliedEdits[appliedEdits.length - 1];
		assert.deepEqual(applied.edits.pokemon[`p1:${pikachuSlot}`].pp, { irontail: 2 });
	});

	it('drops state edits for a Pokémon a team edit removed', () => {
		const base = battleFor([TEAM_PREVIEW]).battle;
		const roster = rosterOf(base, 'p1');
		const feebas = roster.sets.findIndex(set => set.species === 'Feebas');
		const feebasSlot = roster.from[feebas];
		roster.sets.splice(feebas, 1);
		roster.from.splice(feebas, 1);

		const { droppedEdits } = battleFor([
			TEAM_PREVIEW,
			{
				edits: {
					teams: { p1: roster },
					pokemon: { [`p1:${feebasSlot}`]: { hp: 5 } },
				},
				seed: SEED,
			},
		]);
		assert(droppedEdits.some(entry => entry.includes('a team edit removed this Pokémon')), droppedEdits.join('; '));
	});

	it('does not consume RNG, so a node replays identically', () => {
		const roster = rosterOf(battleFor([TEAM_PREVIEW]).battle, 'p1');
		// a set with no gender would make the Pokemon constructor roll one
		roster.sets.push({
			name: 'Eevee', species: 'Eevee', item: '', ability: 'Run Away', moves: ['Tackle'],
			nature: 'Serious', gender: '', evs: {}, ivs: {}, level: 100,
		});
		roster.from.push(null);
		const records = [
			TEAM_PREVIEW,
			{ edits: { teams: { p1: roster } }, seed: SEED, inputLog: ['>p1 move 1', '>p2 move 1'] },
		];

		const first = battleFor(records);
		const second = battleFor(records);
		assert.equal(first.output, second.output);
		assert.deepEqual(
			JSON.parse(JSON.stringify(getAnalysisSnapshot(first.battle))),
			JSON.parse(JSON.stringify(getAnalysisSnapshot(second.battle)))
		);
		// the edit itself must leave the RNG untouched
		const withoutEdits = battleFor([TEAM_PREVIEW, { seed: SEED, inputLog: ['>p1 move 1', '>p2 move 1'] }]);
		assert.deepEqual(first.battle.prng.seed, withoutEdits.battle.prng.seed);
	});

	it('reports the applied team so a no-op save changes nothing', () => {
		const base = battleFor([TEAM_PREVIEW]).battle;
		const roster = rosterOf(base, 'p1');
		const { appliedEdits, droppedEdits } = battleFor([
			TEAM_PREVIEW,
			{ edits: { teams: { p1: roster } }, seed: SEED },
		]);
		assert.deepEqual(droppedEdits, []);
		// an entry that changed nothing reports no edits, which is what lets the client drop the save
		assert.deepEqual(appliedEdits[appliedEdits.length - 1].edits, {});
	});

	it('keeps the snapshot consistent after a composition change', () => {
		const roster = rosterOf(battleFor([TEAM_PREVIEW]).battle, 'p1');
		roster.sets.push({
			name: 'Gyarados', species: 'Gyarados', item: '', ability: 'Intimidate', moves: ['Waterfall'],
			nature: 'Serious', gender: 'M', evs: {}, ivs: {}, level: 100,
		});
		roster.from.push(null);
		const { battle } = battleFor([
			TEAM_PREVIEW,
			{ edits: { teams: { p1: roster } }, seed: SEED },
		]);
		const side = sideSnapshot(battle, 'p1');
		assert.equal(side.pokemon.length, 4);
		// every Pokémon still resolves to a real, distinct team slot
		const slots = side.pokemon.map(entry => entry.teamSlot);
		assert(!slots.includes(-1), `unresolved team slot: ${slots}`);
		assert.equal(new Set(slots).size, slots.length);
		// active slot still points at the right entry
		assert.equal(side.active[0], 0);
		assert(side.pokemon[0].isActive);
	});
});
