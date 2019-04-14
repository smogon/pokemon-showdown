'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Z Moves', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should be possible to activate them when the base move is disabled`, function () {
		battle = common.createBattle([
			[{species: "Chansey", item: 'normaliumz', ability: 'naturalcure', moves: ['doubleteam', 'fireblast']}],
			[{species: "Mightyena", ability: 'intimidate', moves: ['taunt']}],
		]);
		const chansey = battle.p1.active[0];
		assert.statStage(chansey, 'atk', -1);
		battle.makeChoices('auto', 'move taunt');

		assert(battle.canZMove(chansey), `Chansey should be able to use its Z Move`);
		battle.makeChoices('move doubleteam zmove', 'auto'); // Z-Effect: Restores negative stat stages to 0
		assert.statStage(chansey, 'atk', 0);
	});

	it(`should be impossible to activate them when all the base moves are disabled`, function () {
		battle = common.createBattle([
			[{species: "Chansey", item: 'normaliumz', ability: 'naturalcure', moves: ['doubleteam', 'minimize']}],
			[{species: "Mightyena", ability: 'intimidate', moves: ['taunt']}],
		]);
		const chansey = battle.p1.active[0];
		assert.statStage(chansey, 'atk', -1);
		battle.makeChoices('auto', 'move taunt');

		assert.false(battle.canZMove(chansey), `Chansey should not be able to use its Z Move`);
		battle.makeChoices('auto', 'auto');
		assert.statStage(chansey, 'atk', -1);
		assert.cantMove(() => battle.makeChoices('move doubleteam zmove', ''));
	});
});
