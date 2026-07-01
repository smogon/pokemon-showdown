'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Custap Berry', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should cause the user to move first when it activates', () => {
		battle = common.createBattle([[
			{ species: 'gyarados', moves: ['falseswipe', 'tackle'] },
		], [
			{ species: 'wynaut', level: 1, item: 'custapberry', moves: ['sleeptalk', 'growl'] },
		]]);
		battle.makeChoices();
		battle.makeChoices('move tackle', 'move growl');
		assert.equal(battle.p1.active[0].boosts.atk, -1);
		assert.fainted(battle.p2.active[0]);
	});

	it('should activate even if the opponent switches out', () => {
		battle = common.createBattle([[
			{ species: 'gyarados', moves: ['falseswipe'] },
			{ species: 'darkrai', moves: ['tackle'] },
		], [
			{ species: 'wynaut', level: 1, item: 'custapberry', moves: ['sleeptalk', 'growl'] },
		]]);
		battle.makeChoices();
		battle.makeChoices('switch 2', 'move growl');
		battle.makeChoices('move tackle', 'move growl');
		assert.equal(battle.p1.active[0].boosts.atk, -1);
		assert.fainted(battle.p2.active[0]);
	});

	describe('[Gen 4]', () => {
		it('should not activate if the opponent switches out', () => {
			battle = common.gen(4).createBattle([[
				{ species: 'gyarados', moves: ['falseswipe'] },
				{ species: 'darkrai', moves: ['tackle'] },
			], [
				{ species: 'wynaut', level: 1, item: 'custapberry', moves: ['sleeptalk', 'growl'] },
			]]);
			battle.makeChoices();
			battle.makeChoices('switch 2', 'move growl');
			battle.makeChoices('move tackle', 'move growl');
			assert.equal(battle.p1.active[0].boosts.atk, -2);
			assert.fainted(battle.p2.active[0]);
		});
	});
});
