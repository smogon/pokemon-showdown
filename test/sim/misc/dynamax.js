'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Dynamax", function () {
	afterEach(function () {
		battle.destroy();
	});

	it('Max Move effects should not be suppressed by Sheer Force', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Braviary', ability: 'sheerforce', moves: ['heatwave', 'facade', 'superpower']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Shedinja', ability: 'sturdy', item: 'ringtarget', moves: ['splash']},
		]});
		battle.makeChoices('move heatwave dynamax', 'auto');
		assert.equal(battle.field.weather, 'sunnyday');
		battle.makeChoices('move facade', 'auto');
		assert.statStage(battle.p2.active[0], 'spe', -1);
		battle.makeChoices('move superpower', 'auto');
		assert.statStage(battle.p1.active[0], 'atk', 1);
	});
});
