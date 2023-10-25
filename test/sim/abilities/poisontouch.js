'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Poison Touch`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should poison targets if the user damages the target with a contact move`, function () {
		battle = common.createBattle({forceRandomChance: true}, [[
			{species: 'Wynaut', ability: 'poisontouch', moves: ['falseswipe']},
		], [
			{species: 'Shuckle', moves: ['falseswipe']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].status, '', `Wynaut should not be poisoned`);
		assert.equal(battle.p2.active[0].status, 'psn', `Shuckle should be poisoned`);
	});

	it(`should not poison targets behind a Substitute or holding Covert Cloak`, function () {
		battle = common.createBattle({forceRandomChance: true}, [[
			{species: 'Wynaut', ability: 'poisontouch', moves: ['falseswipe']},
		], [
			{species: 'Shuckle', ability: 'prankster', moves: ['substitute']},
			{species: 'Regirock', item: 'covertcloak', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p2.active[0].status, '', `Shuckle should not be poisoned`);

		battle.makeChoices('auto', 'switch 2');
		assert.equal(battle.p2.active[0].status, '', `Regirock should not be poisoned`);
	});

	it(`should poison independently of and after regular secondary status effects`, function () {
		battle = common.createBattle({forceRandomChance: true}, [[
			{species: 'Wynaut', ability: 'poisontouch', moves: ['nuzzle']},
		], [
			{species: 'Shuckle', item: 'lumberry', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		const shuckle = battle.p2.active[0];
		assert.equal(shuckle.status, 'psn');
		assert.false.holdsItem(shuckle);
	});

	it(`should poison before Mummy takes over the user's Ability`, function () {
		battle = common.createBattle({forceRandomChance: true}, [[
			{species: 'Wynaut', ability: 'poisontouch', moves: ['falseswipe']},
		], [
			{species: 'Shuckle', ability: 'mummy', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].ability, 'mummy');
		assert.equal(battle.p2.active[0].status, 'psn');
	});

	it(`should not poison itself with contact moves that aren't hitting other Pokemon`, function () {
		battle = common.createBattle({forceRandomChance: true}, [[
			{species: 'Wynaut', ability: 'poisontouch', moves: ['bide']},
		], [
			{species: 'Shuckle', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		battle.makeChoices();
		battle.makeChoices();
		battle.makeChoices();
		assert.equal(battle.p1.active[0].status, '');
	});

	it(`should not have a 60% chance to poison if Pledge Rainbow is active`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', ability: 'poisontouch', moves: ['falseswipe', 'waterpledge']},
			{species: 'wobbuffet', moves: ['sleeptalk', 'firepledge']},
		], [
			{species: 'pyukumuku', moves: ['sleeptalk']},
			{species: 'feebas', moves: ['sleeptalk']},
		]]);

		battle.onEvent('ModifyMove', battle.format, -99, function (move) {
			if (move.id === 'falseswipe') {
				// If False Swipe had a psn secondary, it would have a 60% chance to activate
				assert.equal(move.secondaries, null);
			}
		});

		battle.makeChoices('move waterpledge 1, move firepledge 1', 'auto');
		battle.makeChoices('move falseswipe 1, move sleeptalk', 'auto');
	});
});
