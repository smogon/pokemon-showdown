
'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Flower Veil', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should block status conditions and stat drops on Grass-type Pokemon and its allies`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Breloom', moves: ['sleeptalk']},
			{species: 'Venusaur', ability: 'flowerveil', moves: ['sleeptalk']},
		], [
			{species: 'Persian', moves: ['sandattack']},
			{species: 'Raticate', moves: ['glare']},
		]]);

		battle.makeChoices('auto', 'move sandattack 1, move glare 1');
		battle.makeChoices('auto', 'move sandattack 2, move glare 2');

		const breloom = battle.p1.active[0];
		const venusaur = battle.p1.active[1];

		assert.equal(breloom.status, '');
		assert.equal(venusaur.status, '');
		assert.statStage(breloom, 'accuracy', 0);
		assert.statStage(venusaur, 'accuracy', 0);
	});

	it(`should not stop an ally from falling asleep when Yawn was already affecting it`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Breloom', moves: ['sleeptalk']},
			{species: 'Heatran', moves: ['sleeptalk']},
			{species: 'Florges', ability: 'flowerveil', moves: ['sleeptalk']},
		], [
			{species: 'Persian', moves: ['sleeptalk', 'yawn']},
			{species: 'Raticate', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move sleeptalk, move sleeptalk', 'move yawn 1, move sleeptalk');
		battle.makeChoices('move sleeptalk, switch 3', 'move sleeptalk, move sleeptalk');
		const breloom = battle.p1.active[0];
		assert.equal(breloom.status, 'slp');
	});
});
