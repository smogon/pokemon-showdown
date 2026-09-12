'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Immunity', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should make the user immune to poison', () => {
		battle = common.createBattle([[
			{ species: 'Snorlax', ability: 'immunity', moves: ['curse'] },
		], [
			{ species: 'Crobat', ability: 'infiltrator', moves: ['toxic'] },
		]]);
		assert.constant(() => battle.p1.active[0].status, () => battle.makeChoices('move curse', 'move toxic'));
	});

	it('should cure poison if a Pokemon receives the ability', () => {
		battle = common.createBattle([[
			{ species: 'Snorlax', ability: 'thickfat', moves: ['curse'] },
		], [
			{ species: 'Crobat', ability: 'immunity', moves: ['toxic', 'skillswap'] },
		]]);
		const target = battle.p1.active[0];
		assert.sets(() => target.status, 'tox', () => battle.makeChoices('move curse', 'move toxic'));
		assert.sets(() => target.status, '', () => battle.makeChoices('move curse', 'move skillswap'));
	});

	it('should have its immunity to poison temporarily suppressed by Mold Breaker, but should cure the status immediately afterwards', () => {
		battle = common.createBattle([[
			{ species: 'Snorlax', ability: 'immunity', moves: ['curse'] },
		], [
			{ species: 'Crobat', ability: 'moldbreaker', moves: ['toxic'] },
		]]);
		battle.makeChoices('move curse', 'move toxic');
		assert.equal(battle.log.filter(line => line.match(/-status\|.*\|tox/)).length, 1);
		assert.equal(battle.p1.active[0].status, '');
	});

	describe('[Gen 3]', () => {
		it.skip(`should be delayed until the next action if the ability was Trace'd after an insta switch`, () => {
			battle = common.gen(3).createBattle([[
				{ species: 'Wynaut', moves: ['toxic'] },
				{ species: 'Snorlax', ability: 'immunity', moves: ['sleeptalk', 'tackle'] },
			], [
				{ species: 'Gardevoir', ability: 'trace', moves: ['sleeptalk'] },
				{ species: 'Zubat', level: 1, moves: ['sleeptalk'] },
			]]);
			const gardevoir = battle.p2.active[0];
			battle.makeChoices();
			assert.equal(gardevoir.status, 'tox');
			battle.makeChoices('switch 2', 'switch 2');
			battle.makeChoices('move tackle', 'move sleeptalk');
			battle.makeChoices();
			assert.equal(gardevoir.status, 'tox');
			battle.makeChoices('move sleeptalk', 'move sleeptalk');
			assert.equal(gardevoir.status, '');
		});
	});
});
