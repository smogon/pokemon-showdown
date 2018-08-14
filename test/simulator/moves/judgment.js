'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Judgment`, function () {
	afterEach(() => battle.destroy());

	it(`should adapt its type to a held Plate`, function () {
		battle = common.createBattle([
			[{species: "Arceus", ability: 'Honey Gather', item: 'spookyplate', moves: ['judgment']}],
			[{species: "Spiritomb", ability: 'stancechange', moves: ['calmmind']}],
		]);
		assert.hurts(battle.p2.active[0], () => battle.makeChoices('move judgment', 'move calmmind'));
	});

	it(`should not adapt its type to a held Z Crystal`, function () {
		battle = common.createBattle([
			[{species: "Arceus", ability: 'Honey Gather', item: 'ghostiumz', moves: ['judgment']}],
			[{species: "Spiritomb", ability: 'stancechange', moves: ['calmmind']}],
		]);
		battle.makeChoices('move judgment', 'move calmmind');
		assert.fullHP(battle.p2.active[0]);
	});
});
