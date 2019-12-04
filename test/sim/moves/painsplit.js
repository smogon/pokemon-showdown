'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Pain Split', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should reduce the HP of the target to the average of the user and target', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Shedinja', ability: 'wonderguard', moves: ['painsplit']}]});
		battle.setPlayer('p2', {team: [{species: 'Arceus', ability: 'multitype', moves: ['judgment']}]});
		battle.makeChoices('move painsplit', 'move judgment');
		assert.strictEqual(battle.p2.active[0].hp, (battle.p2.active[0].maxhp + 1) / 2);
	});
});
