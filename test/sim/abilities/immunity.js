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
		battle.setPlayer('p1', {team: [{species: 'Snorlax', ability: 'immunity', moves: ['curse']}]});
		battle.setPlayer('p2', {team: [{species: 'Crobat', ability: 'infiltrator', moves: ['toxic']}]});
		assert.constant(() => battle.p1.active[0].status, () => battle.makeChoices('move curse', 'move toxic'));
	});

	it('should cure poison if a Pokemon receives the ability', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Snorlax', ability: 'thickfat', moves: ['curse']}]});
		battle.setPlayer('p2', {team: [{species: 'Crobat', ability: 'immunity', moves: ['toxic', 'skillswap']}]});
		const target = battle.p1.active[0];
		assert.sets(() => target.status, 'tox', () => battle.makeChoices('move curse', 'move toxic'));
		assert.sets(() => target.status, '', () => battle.makeChoices('move curse', 'move skillswap'));
	});

	it('should have its immunity to poison temporarily suppressed by Mold Breaker, but should cure the status immediately afterwards', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Snorlax', ability: 'immunity', moves: ['curse']}]});
		battle.setPlayer('p2', {team: [{species: 'Crobat', ability: 'moldbreaker', moves: ['toxic']}]});
		battle.makeChoices('move curse', 'move toxic');
		assert.strictEqual(battle.log.filter(line => line.match(/-status\|.*\|tox/)).length, 1);
		assert.strictEqual(battle.p1.active[0].status, '');
	});
});
