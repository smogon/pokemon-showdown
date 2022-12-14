'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Spikes', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should apply one layer per use in a double battle`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Bronzong', moves: ['sleeptalk']},
			{species: 'Cufant', moves: ['sleeptalk']},
		], [
			{species: 'Qwilfish', moves: ['sleeptalk']},
			{species: 'Glalie', moves: ['spikes']},
		]]);

		battle.makeChoices();
		assert.equal(battle.sides[0].sideConditions.spikes.layers, 1);
	});

	it(`should be bounced without any layers being set by the original user`, function () {
		battle = common.createBattle({gameType: 'freeforall'}, [[
			{species: 'Hatterene', ability: 'Magic Bounce', moves: ['sleeptalk']},
		], [
			{species: 'Cufant', moves: ['sleeptalk']},
		], [
			{species: 'Qwilfish', moves: ['sleeptalk']},
		], [
			{species: 'Glalie', moves: ['spikes']},
		]]);

		battle.makeChoices();
		assert.deepEqual(battle.sides.map(
			side => side.sideConditions.spikes && side.sideConditions.spikes.layers
		), [undefined, 1, 1, 1], `one layer of spikes should be applied to every side but Hatterene's`);
	});
});
