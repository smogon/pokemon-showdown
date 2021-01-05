'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Magician', function () {
	afterEach(function () {
		battle.destroy();
	});

	it.skip(`should not steal Weakness Policy on super-effective hits`, function () {
		battle = common.createBattle([[
			{species: 'klefki', ability: 'magician', moves: ['flashcannon']},
		], [
			{species: 'hatterene', item: 'weaknesspolicy', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.false.holdsItem(battle.p1.active[0], 'Klefki should not have stolen Weakness Policy.');
	});
});
