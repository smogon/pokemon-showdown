'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Magic Room', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should negate residual healing events`, function () {
		battle = common.createBattle([[
			{species: 'Lopunny', item: 'leftovers', moves: ['bellydrum']},
		], [
			{species: 'Golem', moves: ['magicroom']},
		]]);
		const lopunny = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(lopunny.hp, Math.ceil(lopunny.maxhp / 2));
	});

	it(`should prevent items from being consumed`, function () {
		battle = common.createBattle([[
			{species: 'Lopunny', item: 'chopleberry', moves: ['magicroom']},
		], [
			{species: 'Golem', moves: ['lowkick']},
		]]);
		battle.makeChoices();
		assert.holdsItem(battle.p1.active[0]);
	});

	it(`should ignore the effects of items that disable moves`, function () {
		battle = common.createBattle([[
			{species: 'Lopunny', item: 'assaultvest', moves: ['protect']},
		], [
			{species: 'Golem', moves: ['magicroom']},
		]]);
		const lopunny = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(lopunny.lastMove.id, 'struggle');
		battle.makeChoices();
		assert.equal(lopunny.lastMove.id, 'protect');
	});

	it(`should cause Fling to fail`, function () {
		battle = common.createBattle([[
			{species: 'Lopunny', item: 'seaincense', moves: ['fling']},
		], [
			{species: 'Deoxys-Speed', moves: ['magicroom']},
		]]);
		battle.makeChoices();
		assert.holdsItem(battle.p1.active[0]);
	});

	it(`should not prevent Mega Evolution`, function () {
		battle = common.createBattle([[
			{species: 'Lopunny', item: 'lopunnite', moves: ['sleeptalk']},
		], [
			{species: 'Deoxys-Speed', moves: ['magicroom']},
		]]);
		battle.makeChoices('move sleeptalk mega', 'move magicroom');
		assert.species(battle.p1.active[0], 'Lopunny-Mega');
	});

	it(`should not prevent Primal Reversion`, function () {
		battle = common.createBattle([[
			{species: 'Zapdos', moves: ['uturn']},
			{species: 'Groudon', ability: 'drought', item: 'redorb', moves: ['protect']},
		], [
			{species: 'Accelgor', moves: ['magicroom']},
		]]);
		battle.makeChoices();
		battle.makeChoices('switch 2');
		assert.species(battle.p1.active[0], 'Groudon-Primal');
	});
});
