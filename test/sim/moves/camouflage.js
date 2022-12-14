'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Camouflage', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should change the user to Normal-type (except in Generation V, to Ground-type)', function () {
		battle = common.gen(7).createBattle([[
			{species: 'wynaut', moves: ['camouflage']},
		], [
			{species: 'ralts', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		assert.equal(battle.p1.active[0].types[0], 'Normal');

		battle = common.gen(4).createBattle([[
			{species: 'wynaut', moves: ['camouflage']},
		], [
			{species: 'ralts', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		assert.equal(battle.p1.active[0].types[0], 'Normal');

		battle = common.gen(5).createBattle([[
			{species: 'wynaut', moves: ['camouflage']},
		], [
			{species: 'ralts', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		assert.equal(battle.p1.active[0].types[0], 'Ground');
	});

	it('should fail on Multitype in Gen 4 and Arceus itself in Gen 5+', function () {
		// Gen 4
		battle = common.gen(4).createBattle([[
			{species: 'arceus', ability: 'flashfire', moves: ['ember', 'conversion', 'camouflage']},
			{species: 'goldeen', ability: 'multitype', moves: ['camouflage']},
		], [
			{species: 'feebas', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move conversion', 'auto');
		battle.makeChoices('move camouflage', 'auto');
		assert.equal(battle.p1.active[0].types[0], 'Normal');

		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices();
		assert.equal(battle.p1.active[0].types[0], 'Water'); // If test fails, would be Normal-type

		// Gen 5
		battle = common.gen(5).createBattle([[
			{species: 'arceus', ability: 'flashfire', moves: ['camouflage']},
			{species: 'goldeen', ability: 'multitype', moves: ['camouflage']},
		], [
			{species: 'ralts', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		assert.equal(battle.p1.active[0].types[0], 'Normal'); // If test fails, would be Ground-type

		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices();
		assert.equal(battle.p1.active[0].types[0], 'Ground');
	});

	it('should fail in Gen 3-4 if the user already has what Camouflage would change to as either of its types', function () {
		// Gen 4
		battle = common.gen(4).createBattle([[
			{species: 'pidgey', moves: ['camouflage']},
		], [
			{species: 'ralts', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		assert.equal(battle.p1.active[0].types.length, 2); // If test fails, would be 1 type only

		// Gen 5
		battle = common.gen(5).createBattle([[
			{species: 'gligar', moves: ['camouflage']},
		], [
			{species: 'ralts', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		assert.equal(battle.p1.active[0].types.length, 1); // If test fails, would be 2 types
	});
});
