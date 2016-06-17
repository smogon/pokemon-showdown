'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Immunity', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should make the user immune to poison', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Snorlax', ability: 'immunity', moves: ['curse']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Crobat', ability: 'infiltrator', moves: ['toxic']}]);
		assert.constant(() => battle.p1.active[0].status, () => battle.commitDecisions());
	});

	it('should cure poison if a Pokemon receives the ability', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Snorlax', ability: 'thickfat', moves: ['curse']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Crobat', ability: 'immunity', moves: ['toxic', 'skillswap']}]);
		const target = battle.p1.active[0];
		assert.sets(() => target.status, 'tox', () => battle.commitDecisions());
		battle.p2.chooseMove('skillswap');
		assert.sets(() => target.status, '', () => battle.commitDecisions());
	});

	it('should have its immunity to poison temporarily suppressed by Mold Breaker, but should cure the status immediately afterwards', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Snorlax', ability: 'immunity', moves: ['curse']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Crobat', ability: 'moldbreaker', moves: ['toxic']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.log.filter(line => line.match(/-status\|.*\|tox/)).length, 1);
		assert.strictEqual(battle.p1.active[0].status, '');
	});
});
