'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Spite', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should fail on Z-moves`, function () {
		battle = common.gen(7).createBattle([[
			{species: 'Gengar', item: 'ghostiumz', moves: ['shadowball']},
		], [
			{species: 'Snorlax', moves: ['spite']},
		]]);

		battle.makeChoices('move shadowball zmove', 'move spite');
		const gengar = battle.p1.active[0];
		assert.equal(gengar.getMoveData(Dex.moves.get('shadowball')).pp, 23);
	});

	// Eerie Spell and G-Max Depletion should also behave this way
	it(`should succeed on Max Moves, and announce the base move that PP was deducted from`, function () {
		battle = common.gen(8).createBattle([[
			{species: 'Gengar', moves: ['shadowball']},
		], [
			{species: 'Snorlax', moves: ['spite']},
		]]);

		battle.makeChoices('move shadowball dynamax', 'move spite');
		const gengar = battle.p1.active[0];
		assert.equal(gengar.getMoveData(Dex.moves.get('shadowball')).pp, 19);

		const log = battle.getDebugLog();
		const shadowBallIndex = log.indexOf('Shadow Ball');
		assert.notEqual(shadowBallIndex, -1, 'Shadow Ball should have been revealed when Spite deducted PP.');
	});
});
