'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

const ates = {Refrigerate: 'Ice', Pixilate: 'Fairy', Aerilate: 'Flying', Galvanize: 'Electric'};

for (const ate in ates) {
	describe(ate, function () {
		afterEach(function () {
			battle.destroy();
		});

		it(`should make most Normal type moves become ${ates[ate]} type`, function () {
			battle = common.createBattle([[
				{species: 'Genesect', ability: ate, moves: ['hypervoice']},
			], [
				{species: 'Gengar', moves: ['sleeptalk']},
			]]);
			battle.makeChoices();
			assert.false.fullHP(battle.p2.active[0]);
		});

		it('should boost the power of Normal type attacks by 20% when changing their type', function () {
			battle = common.createBattle([[
				{species: 'Genesect', ability: ate, moves: ['hypervoice']},
			], [
				{species: 'Blissey', ability: 'shellarmor', moves: ['sleeptalk']},
			]]);
			battle.makeChoices();
			assert.bounded(battle.p2.active[0].hp, [651 - 83, 651 - 70]);
		});
	});
}
