'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Acupressure', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should be able to target an ally in doubles`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Wynaut', moves: ['acupressure']},
			{species: 'Smoochum', moves: ['sleeptalk']},
		], [
			{species: 'Clamperl', moves: ['sleeptalk']},
			{species: 'Whismur', moves: ['sleeptalk']},
		]]);

		assert.false.cantMove(() => battle.choose('p1', 'move acupressure -2, move sleeptalk'));
	});

	it(`should be unable to target any opponent in free-for-alls`, function () {
		battle = common.createBattle({gameType: 'freeforall'}, [[
			{species: 'Wynaut', moves: ['acupressure']},
		], [
			{species: 'Cufant', moves: ['sleeptalk']},
		], [
			{species: 'Qwilfish', moves: ['sleeptalk']},
		], [
			{species: 'Marowak', moves: ['sleeptalk']},
		]]);

		assert.cantMove(() => battle.choose('p1', 'move acupressure 1'));
		assert.cantMove(() => battle.choose('p1', 'move acupressure 2'));
		assert.cantMove(() => battle.choose('p1', 'move acupressure -2'));
	});
});
