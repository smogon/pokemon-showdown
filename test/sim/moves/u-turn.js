'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('U-Turn', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should switch the user out after a successful hit against a Substitute', function () {
		battle = common.createBattle([[
			{species: 'Beedrill', ability: 'swarm', moves: ['uturn']},
			{species: 'Kakuna', ability: 'shedskin', moves: ['harden']},
		], [
			{species: 'Alakazam', ability: 'magicguard', moves: ['substitute']},
		]]);

		battle.makeChoices('move uturn', 'move substitute');
		assert.strictEqual(battle.requestState, 'switch');
	});
});
