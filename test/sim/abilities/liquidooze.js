'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Liquid Ooze', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should damage the target after it uses a draining move', function () {
		battle = common.createBattle([[
			{species: 'tentacruel', ability: 'liquidooze', moves: ['sleeptalk']},
		], [
			{species: 'serperior', moves: ['gigadrain']},
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
	});

	it(`should damage the target after taking damage from Leech Seed`, function () {
		battle = common.createBattle([[
			{species: 'tentacruel', ability: 'liquidooze', moves: ['sleeptalk']},
		], [
			{species: 'serperior', ability: 'noguard', moves: ['leechseed']},
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
	});
});

describe('Liquid Ooze [Gen 4]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should damage the target after it uses a draining move', function () {
		battle = common.gen(4).createBattle([[
			{species: 'tentacruel', ability: 'liquidooze', moves: ['sleeptalk']},
		], [
			{species: 'roserade', moves: ['gigadrain']},
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
	});

	it(`should damage the target after taking damage from leech seed`, function () {
		battle = common.gen(4).createBattle([[
			{species: 'tentacruel', ability: 'liquidooze', moves: ['sleeptalk']},
		], [
			{species: 'roserade', ability: 'noguard', moves: ['leechseed']},
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
	});

	it('should not damage the target if the target used Dream Eater', function () {
		battle = common.gen(4).createBattle([[
			{species: 'tentacruel', ability: 'liquidooze', moves: ['sleeptalk']},
		], [
			{species: 'jolteon', moves: ['spore', 'dreameater']},
		]]);
		battle.makeChoices('move sleeptalk', 'move spore');
		battle.makeChoices('move sleeptalk', 'move dreameater');
		assert.fullHP(battle.p2.active[0]);
	});
});
