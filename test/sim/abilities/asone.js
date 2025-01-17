'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`As One`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should work if the user is Transformed`, function () {
		battle = common.createBattle([[
			{species: 'ditto', ability: 'imposter', moves: ['transform']},
		], [
			{species: 'calyrexshadow', ability: 'asonespectrier', item: 'cheriberry', moves: ['glare', 'sleeptalk', 'astralbarrage']},
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);

		const ditto = battle.p1.active[0];
		const calyrex = battle.p2.active[0];
		battle.makeChoices('move glare', 'move sleeptalk');
		assert.equal(calyrex.status, 'par', `Calyrex should not have eaten its Berry, being affected by Ditto-Calyrex's Unnerve`);

		battle.makeChoices('move astralbarrage', 'move sleeptalk');
		assert.statStage(ditto, 'spa', 1);
	});
});
