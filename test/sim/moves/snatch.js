'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Snatch', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should steal snatchable moves from the opposing Pokemon and prevent them from using them', function () {
		battle = common.createBattle([
			[{species: 'Jolteon', ability: 'noguard', moves: ['toxic', 'healbell']}],
			[{species: 'Weavile', ability: 'pressure', moves: ['snatch', 'toxic']}],
		]);
		battle.makeChoices('move toxic', 'move toxic');
		// also checks that Snatch has priority
		battle.makeChoices('move healbell', 'move snatch');
		assert.equal(battle.p1.active[0].status, 'tox');
		assert.equal(battle.p2.active[0].status, '');
	});

	it('should not steal sound-based moves when under Throat Chop effect', function () {
		battle = common.createBattle([
			[{species: 'Jolteon', ability: 'noguard', moves: ['toxic', 'healbell', 'throatchop']}],
			[{species: 'Weavile', ability: 'pressure', moves: ['toxic', 'snatch', 'recover']}],
		]);
		battle.makeChoices('move toxic', 'move toxic');
		battle.makeChoices('move throatchop', 'move recover');
		battle.makeChoices('move healbell', 'move snatch');
		assert.equal(battle.p2.active[0].status, 'tox');
		assert.equal(battle.p1.active[0].status, 'tox');
	});
});
