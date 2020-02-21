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
		assert.equal(battle.requestState, 'switch');
	});

	it("should switch out the holder when its stats are lowered", function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Machop', ability: 'noguard', moves: ['leer']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Magikarp', item: 'ejectpack', moves: ['splash']},
			{species: 'Mew', moves: ['splash']},
		]});
		battle.makeChoices();
		assert.equal(battle.p2.requestState, 'switch');
	});
});
