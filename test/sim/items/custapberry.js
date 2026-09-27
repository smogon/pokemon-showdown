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
		assert.equal(battle.p2.active[0].item, '');
		battle.makeChoices('move tackle', 'move growl');
		assert.equal(battle.p1.active[0].boosts.atk, -1);
		assert.fainted(battle.p2.active[0]);
	});

	describe('[Gen 4]', () => {
		for (const trickRoom of [false, true]) {
			it(`should let the faster of two activated holders move first${trickRoom ? ' under Trick Room' : ''}`, () => {
				battle = common.gen(4).createBattle([[
					{ species: 'Deoxys-Attack', ability: 'hugepower', item: 'custapberry', moves: ['falseswipe', 'tackle', 'trickroom'] },
				], [
					{ species: 'Deoxys-Attack', ability: 'hugepower', item: 'custapberry', moves: ['falseswipe', 'growl', 'splash'], evs: { spe: 252 } },
				]]);
				const slower = battle.p1.active[0];
				const faster = battle.p2.active[0];
				if (trickRoom) battle.makeChoices('move trickroom', 'move splash');
				battle.makeChoices();
				battle.makeChoices('move tackle', 'move growl');
				assert.statStage(slower, 'atk', -1);
				assert.fainted(faster);
				assert.equal(slower.item, '');
				assert.equal(faster.item, '');
			});
		}

		it('should not activate if the opponent switches out', () => {
			battle = common.gen(4).createBattle([[
				{ species: 'gyarados', moves: ['falseswipe'] },
				{ species: 'darkrai', moves: ['tackle'] },
			], [
				{ species: 'wynaut', level: 1, item: 'custapberry', moves: ['sleeptalk', 'growl'] },
			]]);
			battle.makeChoices();
			battle.makeChoices('switch 2', 'move growl');
			assert.equal(battle.p2.active[0].item, 'custapberry');
			battle.makeChoices('move tackle', 'move growl');
			assert.equal(battle.p2.active[0].item, '');
			assert.equal(battle.p1.active[0].boosts.atk, -2);
			assert.fainted(battle.p2.active[0]);
		});
	});
});
