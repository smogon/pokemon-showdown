'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Jaboca Berry', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should activate after a physical move`, function () {
		battle = common.createBattle([[
			{species: "Charizard", evs: {hp: 252}, moves: ['scratch', 'ember']},
		], [
			{species: "Cramorant", item: 'jabocaberry', moves: ['sleeptalk']},
		]]);

		const charizard = battle.p1.active[0];
		battle.makeChoices('move ember', 'default');
		assert.fullHP(charizard);
		assert.hurtsBy(charizard, charizard.maxhp / 8, () => battle.makeChoices());
	});

	it(`should activate even if the holder has 0 HP`, function () {
		battle = common.createBattle([[
			{species: "Morpeko", evs: {hp: 252}, moves: ['aurawheel']},
		], [
			{species: "Cramorant", item: 'jabocaberry', moves: ['sleeptalk']},
		]]);

		const morpeko = battle.p1.active[0];
		assert.hurtsBy(morpeko, morpeko.maxhp / 8, () => battle.makeChoices());
	});
});
