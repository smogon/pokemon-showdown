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
		battle.setPlayer('p1', {team: [{species: "Zubat", moves: ['confuseray']}]});
		battle.setPlayer('p2', {team: [{species: "Chansey", item: 'luckypunch', ability: 'superluck', moves: ['softboiled']}]});
		battle.makeChoices('move confuseray', 'move softboiled');
		assert(battle.log.some(line => line.includes('[from] confusion')));
		assert(battle.log.every(line => !line.startsWith('|-crit')));
	});
});
