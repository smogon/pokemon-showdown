'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Z Moves', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should use the base move's type if it is a damaging move`, function () {
		battle = common.createBattle([[
			{species: 'Kecleon', item: 'normaliumz', moves: ['hiddenpower']},
		], [
			{species: 'Gengar', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move hiddenpower zmove', 'auto');
		assert.fullHP(battle.p2.active[0]);
	});

	it(`should not use the base move's priority if it is a damaging move`, function () {
		battle = common.createBattle([[
			{species: 'Kecleon', item: 'ghostiumz', moves: ['shadowsneak']},
		], [
			{species: 'Starmie', moves: ['reflecttype']},
		]]);
		battle.makeChoices('move shadowsneak zmove', 'auto');
		assert.fullHP(battle.p2.active[0]);
	});

	it(`should be possible to activate them when the base move is disabled`, function () {
		battle = common.createBattle([[
			{species: 'Chansey', item: 'normaliumz', ability: 'naturalcure', moves: ['doubleteam', 'fireblast']},
		], [
			{species: 'Mightyena', ability: 'intimidate', moves: ['taunt']},
		]]);
		const chansey = battle.p1.active[0];
		assert.statStage(chansey, 'atk', -1);
		battle.makeChoices();

		assert(battle.actions.canZMove(chansey), `Chansey should be able to use its Z Move`);
		battle.makeChoices('move doubleteam zmove', 'auto'); // Z-Effect: Restores negative stat stages to 0
		assert.statStage(chansey, 'atk', 0);
	});

	it(`should be impossible to activate them when all the base moves are disabled`, function () {
		battle = common.createBattle([[
			{species: 'Chansey', item: 'normaliumz', ability: 'naturalcure', moves: ['doubleteam', 'minimize']},
		], [
			{species: 'Mightyena', ability: 'intimidate', moves: ['taunt']},
		]]);

		const chansey = battle.p1.active[0];
		assert.statStage(chansey, 'atk', -1);
		battle.makeChoices();

		assert.false(battle.actions.canZMove(chansey), `Chansey should not be able to use its Z Move`);
		battle.makeChoices();
		assert.statStage(chansey, 'atk', -1);
		assert.cantMove(() => battle.makeChoices('move doubleteam zmove', ''));
	});
});
