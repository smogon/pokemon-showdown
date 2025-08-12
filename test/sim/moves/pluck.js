'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Pluck', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should not steal and eat Jaboca Berry in Gen 9', () => {
		battle = common.createBattle([
			[{ species: "doduo", moves: ['pluck'] }],
			[{ species: "Forretress", item: 'jabocaberry', moves: ['sleeptalk'] }],
		]);
		battle.makeChoices('move pluck', 'move sleeptalk');
		assert.notEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});
});

describe('Pluck [Gen 4]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should steal and eat Jaboca Berry', () => {
		battle = common.gen(4).createBattle([
			[{ species: "doduo", moves: ['pluck'] }],
			[{ species: "Forretress", item: 'jabocaberry', moves: ['sleeptalk'] }],
		]);
		battle.makeChoices('move pluck', 'move sleeptalk');
		assert.equal(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});
});
