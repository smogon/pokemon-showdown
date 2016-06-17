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

		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].boosts.spe, 2);
		assert.strictEqual(battle.p2.active[0].boosts.atk, 2);

		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		assert.strictEqual(battle.p1.active[0].boosts.spe, 0);
		assert.strictEqual(battle.p2.active[0].boosts.atk, 0);
	});

	it('should remove opponent\'s status', function () {
		battle = common.gen(1).createBattle([
			[{species: "Mew", moves: ['thunderwave', 'haze']}],
			[{species: "Mewtwo", moves: ['splash']}],
		]);

		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, 'par');

		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].status, 'par');
	});

	it('should not remove user\'s status', function () {
		battle = common.gen(1).createBattle([
			[{species: "Mew", moves: ['thunderwave']}],
			[{species: "Mewtwo", moves: ['haze']}],
		]);

		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, 'par');

		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, 'par');
	});

	it('should remove focus energy', function () {
		battle = common.gen(1).createBattle([
			[{species: "Mew", moves: ['splash']}],
			[{species: "Mewtwo", moves: ['focusenergy', 'haze']}],
		]);

		battle.commitDecisions();
		assert.ok(battle.p2.active[0].volatiles['focusenergy']);

		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(typeof battle.p2.active[0].volatiles['focusenergy'], 'undefined');
	});

	it('should remove reflect and light screen', function () {
		battle = common.gen(1).createBattle([
			[{species: "Mew", moves: ['reflect', 'lightscreen', 'haze']}],
			[{species: "Mewtwo", moves: ['splash']}],
		]);

		battle.commitDecisions();
		assert.ok(battle.p1.active[0].volatiles['reflect']);

		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		assert.ok(battle.p1.active[0].volatiles['lightscreen']);

		battle.choose('p1', 'move 3');
		battle.commitDecisions();
		assert.strictEqual(typeof battle.p1.active[0].volatiles['reflect'], 'undefined');
		assert.strictEqual(typeof battle.p1.active[0].volatiles['lightscreen'], 'undefined');
	});
});
