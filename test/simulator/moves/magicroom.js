'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Magic Room', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should negate residual healing events', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Lopunny", ability: 'limber', item: 'leftovers', moves: ['bellydrum']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Giratina", ability: 'pressure', moves: ['magicroom']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, Math.ceil(battle.p1.active[0].maxhp / 2));
	});

	it('should prevent items from being consumed', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Lopunny", ability: 'limber', item: 'chopleberry', moves: ['magicroom']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Golem", ability: 'noguard', moves: ['lowkick']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'chopleberry');
	});

	it('should ignore the effects of items that disable moves', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Lopunny", ability: 'limber', item: 'assaultvest', moves: ['protect']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Golem", ability: 'noguard', moves: ['magicroom']}]);
		battle.commitDecisions();
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].lastMove, 'protect');
	});

	it('should cause Fling to fail', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Lopunny", ability: 'limber', item: 'seaincense', moves: ['fling']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Sableye", ability: 'prankster', moves: ['magicroom']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'seaincense');
	});

	it('should not prevent Pokemon from Mega Evolving', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Lopunny", ability: 'limber', item: 'lopunnite', moves: ['bulkup']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Golem", ability: 'noguard', moves: ['magicroom', 'rest']}]);
		battle.commitDecisions();
		battle.choose('p1', 'move 1 mega');
		battle.choose('p2', 'move 2');
		assert.strictEqual(battle.p1.active[0].template.speciesid, 'lopunnymega');
	});

	it('should not prevent Primal Reversion', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Zapdos", ability: 'pressure', moves: ['voltswitch']},
			{species: "Groudon", ability: 'drought', item: 'redorb', moves: ['protect']},
		]);
		battle.join('p2', 'Guest 2', 1, [{species: "Meowstic", ability: 'prankster', moves: ['magicroom']}]);
		battle.commitDecisions();
		battle.choose('p1', 'switch 2');
		assert.strictEqual(battle.p1.active[0].template.speciesid, 'groudonprimal');
	});
});
