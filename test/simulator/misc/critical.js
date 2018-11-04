'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Critical hits', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not happen on self-hits', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Zubat", moves: ['confuseray']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Chansey", item: 'luckypunch', ability: 'superluck', moves: ['softboiled']}]);
		battle.makeChoices('move confuseray', 'move softboiled');
		assert(battle.log.some(line => line.includes('[from] confusion')));
		assert(battle.log.every(line => !line.startsWith('|-crit')));
	});
});
