'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Embargo', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should negate residual healing events', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Lopunny", ability: 'limber', item: 'leftovers', moves: ['bellydrum'] }] });
		battle.setPlayer('p2', { team: [{ species: "Giratina", ability: 'pressure', moves: ['embargo'] }] });
		battle.makeChoices('move bellydrum', 'move embargo');
		assert.equal(battle.p1.active[0].hp, Math.ceil(battle.p1.active[0].maxhp / 2));
	});

	it('should prevent items from being consumed', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Lopunny", ability: 'limber', item: 'chopleberry', moves: ['bulkup'] }] });
		battle.setPlayer('p2', { team: [{ species: "Golem", ability: 'noguard', moves: ['embargo', 'lowkick'] }] });
		battle.makeChoices('move bulkup', 'move embargo');
		battle.makeChoices('move bulkup', 'move lowkick');
		assert.equal(battle.p1.active[0].item, 'chopleberry');
	});

	it('should ignore the effects of items that disable moves', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Lopunny", ability: 'limber', item: 'assaultvest', moves: ['protect'] }] });
		battle.setPlayer('p2', { team: [{ species: "Golem", ability: 'noguard', moves: ['embargo'] }] });
		battle.makeChoices('default', 'move embargo');
		assert.equal(battle.p1.active[0].lastMove.id, 'struggle');
		battle.makeChoices('default', 'move embargo');
		assert.equal(battle.p1.active[0].lastMove.id, 'protect');
	});

	it('should cause Fling to fail', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Lopunny", ability: 'limber', item: 'seaincense', moves: ['fling'] }] });
		battle.setPlayer('p2', { team: [{ species: "Sableye", ability: 'prankster', moves: ['embargo'] }] });
		battle.makeChoices('move fling', 'move embargo');
		assert.equal(battle.p1.active[0].item, 'seaincense');
	});

	it('should let effects of items received by Fling activate', () => {
		battle = common.createBattle([[
			{ species: "Lopunny", ability: 'klutz', moves: ['sleeptalk'] },
		], [
			{ species: "Wynaut", item: 'toxicorb', moves: ['embargo', 'fling'] },
		]]);
		battle.makeChoices();
		battle.makeChoices('move sleeptalk', 'move fling');
		assert.false(battle.p2.active[0].item);
		assert.equal(battle.p1.active[0].status, 'tox');
	});

	it('should not prevent Pokemon from Mega Evolving', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Lopunny", ability: 'limber', item: 'lopunnite', moves: ['bulkup'] }] });
		battle.setPlayer('p2', { team: [{ species: "Golem", ability: 'noguard', moves: ['embargo', 'rest'] }] });
		battle.makeChoices('move bulkup', 'move embargo');
		battle.makeChoices('move bulkup mega', 'move rest');
		assert.equal(battle.p1.active[0].species.id, 'lopunnymega');
	});

	describe(`[Gen 4]`, () => {
		it('should still cause Fling to fail', () => {
			battle = common.gen(4).createBattle();
			battle.setPlayer('p1', { team: [{ species: "Lopunny", ability: 'limber', item: 'seaincense', moves: ['fling'] }] });
			battle.setPlayer('p2', { team: [{ species: "Sableye", ability: 'prankster', moves: ['embargo'] }] });
			battle.makeChoices('move fling', 'move embargo');
			assert.equal(battle.p1.active[0].item, 'seaincense');
		});

		it('should not let effects of items received by Fling activate', () => {
			battle = common.gen(4).createBattle([[
				{ species: "Lopunny", ability: 'klutz', moves: ['sleeptalk'] },
			], [
				{ species: "Wynaut", item: 'toxicorb', moves: ['embargo', 'fling'] },
			]]);
			battle.makeChoices();
			battle.makeChoices('move sleeptalk', 'move fling');
			assert.false(battle.p2.active[0].item);
			assert.false(battle.p1.active[0].status);
		});
	});
});
