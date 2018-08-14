'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Clear Body', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should negate stat drops from opposing effects', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Tentacruel', ability: 'clearbody', moves: ['recover']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Arbok', ability: 'intimidate', moves: ['acidspray', 'leer', 'scaryface', 'charm', 'confide']}]);

		const stats = ['spd', 'def', 'spe', 'atk', 'spa'];
		stats.forEach((stat, index) => {
			battle.makeChoices('move recover', 'move ' + (index + 1));
			assert.statStage(battle.p1.active[0], stat, 0);
		});
		stats.forEach(stat => assert.statStage(battle.p1.active[0], stat, 0));
	});

	it('should not negate stat drops from the user\'s moves', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Tentacruel', ability: 'clearbody', moves: ['superpower']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Arbok', ability: 'unnerve', moves: ['coil']}]);
		battle.makeChoices('move Superpower', 'move Coil');
		assert.statStage(battle.p1.active[0], 'atk', -1);
		assert.statStage(battle.p1.active[0], 'def', -1);
	});

	it('should not negate stat boosts from opposing moves', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Tentacruel', ability: 'clearbody', moves: ['shadowsneak']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Arbok', ability: 'unnerve', moves: ['swagger']}]);
		battle.makeChoices('move Shadowsneak', 'move Swagger');
		assert.statStage(battle.p1.active[0], 'atk', 2);
	});

	it('should not negate absolute stat changes', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Tentacruel', ability: 'clearbody', moves: ['coil']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Arbok', ability: 'unnerve', moves: ['topsyturvy']}]);
		battle.makeChoices('move Coil', 'move Topsyturvy');
		assert.statStage(battle.p1.active[0], 'atk', -1);
		assert.statStage(battle.p1.active[0], 'def', -1);
		assert.statStage(battle.p1.active[0], 'accuracy', -1);
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Tentacruel', ability: 'clearbody', moves: ['recover']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'moldbreaker', moves: ['growl']}]);
		battle.makeChoices('move Recover', 'move Growl');
		assert.statStage(battle.p1.active[0], 'atk', -1);
	});

	it('should be suppressed by Mold Breaker if it is forced out by a move', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Metagross', ability: 'clearbody', moves: ['sleeptalk']},
			{species: 'Metagross', ability: 'clearbody', moves: ['sleeptalk']},
		]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'moldbreaker', moves: ['roar', 'stickyweb']}]);
		battle.makeChoices('move Sleeptalk', 'move Stickyweb');
		battle.makeChoices('move Sleeptalk', 'move Roar');
		battle.makeChoices('switch Metagross', '');
		assert.statStage(battle.p1.active[0], 'spe', -1);
	});
});
