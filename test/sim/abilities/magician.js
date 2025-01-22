'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Magician', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should steal the opponents item`, function () {
		battle = common.createBattle([[
			{species: 'klefki', ability: 'magician', moves: ['flashcannon']},
		], [
			{species: 'wynaut', item: 'tr69', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].item, 'tr69');
	});

	it(`should not steal Weakness Policy on super-effective hits`, function () {
		battle = common.createBattle([[
			{species: 'klefki', ability: 'magician', moves: ['flashcannon']},
		], [
			{species: 'hatterene', item: 'weaknesspolicy', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.false.holdsItem(battle.p1.active[0], 'Klefki should not have stolen Weakness Policy.');
	});

	it(`should not steal an item on the turn Throat Spray activates`, function () {
		battle = common.createBattle([[
			{species: 'klefki', ability: 'magician', item: 'throatspray', moves: ['psychicnoise']},
		], [
			{species: 'hatterene', item: 'tr69', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.false.holdsItem(battle.p1.active[0], 'Klefki should not have stolen an item.');
	});
});
