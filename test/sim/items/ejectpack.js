'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Eject Pack', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should cause a switch-out after Moody activation', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Glalie', ability: 'moody', item: 'ejectpack', moves: ['protect']},
			{species: 'Mew', ability: 'noability', moves: ['protect']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Mew', ability: 'noability', moves: ['protect']},
		]});
		battle.makeChoices();
		assert.strictEqual(battle.requestState, 'switch');
	});
});
