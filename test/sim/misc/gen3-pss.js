'use strict';

const assert = require('../../assert');
const common = require('../../common');
const Dex = require('../../../dist/sim/dex').Dex;

// [Gen 3] PSS is Gen 3 OU with the Gen 4 physical/special split: move categories
// come from the move data (like Gen 4+), NOT re-derived from the move's type the way
// the base [Gen 3] mod does. The mod's hand-written `useMoveInner` originally omitted
// the `ModifyType` event, so `onModifyType` handlers never ran — Hidden Power kept its
// data type (Normal) instead of taking its hpType, and Weather Ball never changed type
// in weather. These tests pin both the fix and the split it must not break.
describe('[Gen 3] PSS', () => {
	const gen3pss = Dex.mod('gen3pss');

	// Capture the move's category + type at the moment damage is calculated.
	function firstHit(battle, moveid) {
		const calls = [];
		const orig = battle.actions.getDamage.bind(battle.actions);
		battle.actions.getDamage = function (source, target, move, ...rest) {
			if (move && move.id) calls.push({ id: move.id, category: move.category, type: move.type });
			return orig(source, target, move, ...rest);
		};
		return () => calls.find(c => c.id === moveid);
	}

	let battle;
	afterEach(() => {
		if (battle) battle.destroy();
	});

	it('classifies Hidden Power as Special in the move data (always special)', () => {
		assert.equal(gen3pss.moves.get('hiddenpower').category, 'Special',
			'Hidden Power should be Special under the Gen 4 physical/special split');
	});

	it('applies Hidden Power\'s hpType at battle time (HP Fighting hits Rock/Dark super effectively)', () => {
		battle = common.createBattle({ formatid: 'gen3pss' }, [[
			{ species: 'Tyranitar', ability: 'sandstream', moves: ['curse'], evs: { hp: 252, def: 252 } },
		], [
			// IVs computed for Hidden Power Fighting under the Gen 3 formula.
			{
				species: 'Gengar', ability: 'levitate', moves: ['hiddenpowerfighting'],
				evs: { spa: 252, spe: 252 }, ivs: { hp: 31, atk: 31, def: 30, spa: 30, spd: 30, spe: 30 },
			},
		]]);
		const getHit = firstHit(battle, 'hiddenpower');
		battle.makeChoices('move curse', 'move hiddenpowerfighting');
		const hit = getHit();
		assert(hit, 'Hidden Power should have dealt damage');
		assert.equal(hit.type, 'Fighting', 'Hidden Power should resolve to its hpType (Fighting), not Normal');
		assert.equal(hit.category, 'Special', 'Hidden Power must stay Special');
		assert(battle.log.some(line => line.startsWith('|-supereffective|')),
			'HP Fighting should be super effective vs Tyranitar (Rock/Dark)');
		assert(!battle.log.some(line => line.startsWith('|-resisted|')),
			'HP Fighting must not be resisted (regression: it was resolving as Normal)');
	});

	it('keeps Hidden Power Special even for a Gen 3 "physical" type (no type-based recompute)', () => {
		battle = common.createBattle({ formatid: 'gen3pss' }, [[
			{ species: 'Skarmory', ability: 'keeneye', moves: ['spikes'], evs: { hp: 252, def: 252 } },
		], [
			// IVs for Hidden Power Rock (a physical type in Gen 3, but Special here).
			{
				species: 'Gengar', ability: 'levitate', moves: ['hiddenpowerrock'],
				evs: { spa: 252, spe: 252 }, ivs: { hp: 31, atk: 31, def: 30, spa: 30, spd: 31, spe: 30 },
			},
		]]);
		const getHit = firstHit(battle, 'hiddenpower');
		battle.makeChoices('move spikes', 'move hiddenpowerrock');
		const hit = getHit();
		assert(hit, 'Hidden Power should have dealt damage');
		assert.equal(hit.type, 'Rock', 'Hidden Power should resolve to Rock');
		assert.equal(hit.category, 'Special',
			'Rock is physical in base Gen 3, but PSS uses the Gen 4 split — it must stay Special');
	});

	it('applies Weather Ball\'s type change too (sun -> Fire, the other onModifyType move)', () => {
		battle = common.createBattle({ formatid: 'gen3pss' }, [[
			{ species: 'Skarmory', ability: 'keeneye', moves: ['spikes'], evs: { hp: 252, def: 252 } },
		], [
			{ species: 'Groudon', ability: 'drought', moves: ['weatherball'], evs: { spa: 252, spe: 252 }, nature: 'Modest' },
		]]);
		const getHit = firstHit(battle, 'weatherball');
		battle.makeChoices('move spikes', 'move weatherball');
		const hit = getHit();
		assert(hit, 'Weather Ball should have dealt damage');
		assert.equal(hit.type, 'Fire', 'Weather Ball should become Fire in sun');
		assert(battle.log.some(line => line.startsWith('|-supereffective|')),
			'Fire Weather Ball should be super effective vs Skarmory (Steel/Flying)');
	});
});
