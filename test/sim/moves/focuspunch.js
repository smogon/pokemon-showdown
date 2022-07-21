'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Focus Punch', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should cause the user to lose focus if hit by an attacking move`, function () {
		battle = common.createBattle([[
			{species: 'Chansey', moves: ['focuspunch']},
		], [
			{species: 'Venusaur', moves: ['magicalleaf']},
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p2.active[0]);
	});

	it(`should not cause the user to lose focus if hit by a status move`, function () {
		battle = common.createBattle([[
			{species: 'Chansey', moves: ['focuspunch']},
		], [
			{species: 'Venusaur', moves: ['growl']},
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
	});

	it(`should not cause the user to lose focus if hit while behind a substitute`, function () {
		battle = common.createBattle([[
			{species: 'Chansey', moves: ['substitute', 'focuspunch']},
		], [
			{species: 'Venusaur', moves: ['magicalleaf']},
		]]);
		battle.makeChoices();
		battle.makeChoices('move focuspunch', 'auto');
		assert.false.fullHP(battle.p2.active[0]);
	});

	it(`should cause the user to lose focus if hit by a move called by Nature Power`, function () {
		battle = common.createBattle([[
			{species: 'Chansey', moves: ['focuspunch']},
		], [
			{species: 'Venusaur', moves: ['naturepower']},
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p2.active[0]);
	});

	it(`should not cause the user to lose focus on later uses of Focus Punch if hit`, function () {
		battle = common.createBattle([[
			{species: 'Chansey', moves: ['focuspunch']},
		], [
			{species: 'Venusaur', moves: ['magicalleaf', 'growl']},
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p2.active[0]);
		battle.makeChoices('auto', 'move growl');
		assert.false.fullHP(battle.p2.active[0]);
	});

	it(`should cause the user to lose focus if hit by an attacking move followed by a status move in one turn`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: 'Chansey', ability: 'naturalcure', moves: ['focuspunch']}, {species: 'Blissey', ability: 'naturalcure', moves: ['softboiled']}],
			[{species: 'Venusaur', ability: 'overgrow', moves: ['magicalleaf']}, {species: 'Ivysaur', ability: 'overgrow', moves: ['toxic']}],
		]);
		battle.makeChoices('move focuspunch 1, move softboiled', 'move magicalleaf 1, move toxic 1');
		assert.equal(battle.p1.active[0].status, 'tox');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it(`should not deduct PP if the user lost focus`, function () {
		battle = common.createBattle([[
			{species: 'Chansey', moves: ['focuspunch']},
		], [
			{species: 'Venusaur', moves: ['magicalleaf', 'growl']},
		]]);
		const move = battle.p1.active[0].getMoveData(Dex.moves.get('focuspunch'));
		battle.makeChoices();
		assert.equal(move.pp, move.maxpp);
		battle.makeChoices('auto', 'move growl');
		assert.equal(move.pp, move.maxpp - 1);
	});

	it(`should deduct PP if the user lost focus before Gen 5`, function () {
		battle = common.gen(4).createBattle([[
			{species: 'Chansey', moves: ['focuspunch']},
		], [
			{species: 'Venusaur', moves: ['magicalleaf', 'growl']},
		]]);
		const move = battle.p1.active[0].getMoveData(Dex.moves.get('focuspunch'));
		battle.makeChoices();
		assert.equal(move.pp, move.maxpp - 1);
		battle.makeChoices('auto', 'move growl');
		assert.equal(move.pp, move.maxpp - 2);
	});

	it(`should display a message indicating the Pokemon is tightening focus`, function () {
		battle = common.createBattle([[
			{species: 'Chansey', moves: ['focuspunch']},
		], [
			{species: 'Venusaur', moves: ['magicalleaf']},
		]]);

		battle.makeChoices();
		const tighteningFocusMessage = battle.log.indexOf('|-singleturn|p1a: Chansey|move: Focus Punch');
		assert(tighteningFocusMessage > 0);
	});

	it(`should not tighten the Pokemon's focus when Dynamaxing or already Dynamaxed`, function () {
		battle = common.createBattle([[
			{species: 'Chansey', moves: ['focuspunch']},
		], [
			{species: 'Venusaur', moves: ['magicalleaf']},
		]]);

		battle.makeChoices('move focuspunch dynamax', 'auto');
		battle.makeChoices('move focuspunch', 'auto');
		const tighteningFocusMessage = battle.log.indexOf('|-singleturn|p1a: Chansey|move: Focus Punch');
		assert(tighteningFocusMessage < 0);
	});

	it(`should tighten focus after switches in Gen 5+`, function () {
		battle = common.createBattle([[
			{species: 'salamence', moves: ['focuspunch']},
		], [
			{species: 'mew', moves: ['sleeptalk']},
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move focuspunch', 'switch 2');
		const log = battle.getDebugLog();
		const focusPunchChargeIndex = log.indexOf('|-singleturn|');
		const switchIndex = log.indexOf('|switch|p2a: Wynaut');
		assert(focusPunchChargeIndex > switchIndex, `Focus Punch's charge message should occur after switches in Gen 5+`);
	});

	it(`should tighten focus before switches in Gens 3-4`, function () {
		battle = common.gen(4).createBattle([[
			{species: 'salamence', moves: ['focuspunch']},
		], [
			{species: 'mew', moves: ['sleeptalk']},
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move focuspunch', 'switch 2');
		const log = battle.getDebugLog();
		const focusPunchChargeIndex = log.indexOf('|-singleturn|');
		const switchIndex = log.indexOf('|switch|p2a: Wynaut');
		assert(focusPunchChargeIndex < switchIndex, `Focus Punch's charge message should occur before switches in Gens 3-4`);
	});
});
