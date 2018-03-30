'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Haze - RBY', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should remove stat changes', function () {
		battle = common.gen(1).createBattle([
			[{species: "Mew", moves: ['agility', 'haze']}],
			[{species: "Mewtwo", moves: ['swordsdance', 'splash']}],
		]);

		battle.makeChoices('move agility', 'move swordsdance');
		assert.strictEqual(battle.p1.active[0].boosts.spe, 2);
		assert.strictEqual(battle.p2.active[0].boosts.atk, 2);

		battle.makeChoices('move haze', 'move splash');
		assert.strictEqual(battle.p1.active[0].boosts.spe, 0);
		assert.strictEqual(battle.p2.active[0].boosts.atk, 0);
	});

	it('should remove opponent\'s status', function () {
		battle = common.gen(1).createBattle([
			[{species: "Mew", moves: ['thunderwave', 'haze']}],
			[{species: "Mewtwo", moves: ['splash']}],
		]);

		battle.makeChoices('move thunderwave', 'move splash');
		assert.strictEqual(battle.p2.active[0].status, 'par');

		battle.makeChoices('move haze', 'move splash');
		assert.notStrictEqual(battle.p2.active[0].status, 'par');
	});

	it('should not remove user\'s status', function () {
		battle = common.gen(1).createBattle([
			[{species: "Mew", moves: ['thunderwave']}],
			[{species: "Mewtwo", moves: ['haze']}],
		]);

		battle.makeChoices('move thunderwave', 'move haze');
		assert.strictEqual(battle.p2.active[0].status, 'par');

		battle.makeChoices('move thunderwave', 'move haze');
		assert.strictEqual(battle.p2.active[0].status, 'par');
	});

	it('should remove focus energy', function () {
		battle = common.gen(1).createBattle([
			[{species: "Mew", moves: ['splash']}],
			[{species: "Mewtwo", moves: ['focusenergy', 'haze']}],
		]);

		battle.makeChoices('move splash', 'move focusenergy');
		assert.ok(battle.p2.active[0].volatiles['focusenergy']);

		battle.makeChoices('move splash', 'move haze');
		assert.strictEqual(typeof battle.p2.active[0].volatiles['focusenergy'], 'undefined');
	});

	it('should remove reflect and light screen', function () {
		battle = common.gen(1).createBattle([
			[{species: "Mew", moves: ['reflect', 'lightscreen', 'haze']}],
			[{species: "Mewtwo", moves: ['splash']}],
		]);

		battle.makeChoices('move reflect', 'move splash');
		assert.ok(battle.p1.active[0].volatiles['reflect']);

		battle.makeChoices('move lightscreen', 'move splash');
		assert.ok(battle.p1.active[0].volatiles['lightscreen']);

		battle.makeChoices('move haze', 'move splash');
		assert.strictEqual(typeof battle.p1.active[0].volatiles['reflect'], 'undefined');
		assert.strictEqual(typeof battle.p1.active[0].volatiles['lightscreen'], 'undefined');
	});
});
