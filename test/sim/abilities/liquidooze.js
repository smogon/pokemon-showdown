'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Liquid Ooze', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should damage the target by the amount it would have healed after it uses a draining move', function () {
		battle = common.createBattle([[
			{species: 'tentacruel', ability: 'liquidooze', moves: ['sleeptalk']},
		], [
			{species: 'serperior', moves: ['gigadrain']},
		]]);
		battle.makeChoices();
		const damage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		assert.bounded(damage, [27, 33]);
	});

	it('should damage the target after taking damage from leech seed', function () {
		battle = common.createBattle([[
			{species: 'tentacruel', ability: 'liquidooze', moves: ['sleeptalk']},
		], [
			{species: 'serperior', moves: ['leechseed']},
		]]);
		battle.makeChoices();
		const hp = battle.p2.active[0].maxhp - Math.floor(battle.p1.active[0].maxhp / 8);
		assert.equal(hp, 254);
	});
});

describe('Liquid Ooze [Gen 4]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should damage the target by the amount it would have healed after it uses a draining move', function () {
		battle = common.gen(4).createBattle([[
			{species: 'tentacruel', ability: 'liquidooze', moves: ['sleeptalk']},
		], [
			{species: 'roserade', moves: ['gigadrain']},
		]]);
		battle.makeChoices();
		const damage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		assert.bounded(damage, [33, 40]);
	});

	it('should damage the target after taking damage from leech seed', function () {
		battle = common.gen(4).createBattle([[
			{species: 'tentacruel', ability: 'liquidooze', moves: ['sleeptalk']},
		], [
			{species: 'roserade', moves: ['leechseed']},
		]]);
		battle.makeChoices();
		const hp = battle.p2.active[0].maxhp - Math.floor(battle.p1.active[0].maxhp / 8);
		assert.equal(hp, 224);
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
