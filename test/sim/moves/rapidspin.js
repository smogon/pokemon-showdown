'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Rapid Spin', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should remove entry hazards`, function () {
		battle = common.createBattle([[
			{species: 'Omastar', moves: ['stealthrock', 'spikes', 'toxicspikes', 'stickyweb']},
		], [
			{species: 'Armaldo', moves: ['sleeptalk', 'rapidspin']},
		]]);
		for (let i = 1; i < 5; i++) {
			battle.makeChoices('move ' + i, 'auto');
		}
		battle.makeChoices('move toxicspikes', 'move rapidspin');
		const side = battle.p2.sideConditions;
		assert(!side['stealthrock'] && !side['spikes'] && !side['toxicspikes'] && !side['stickyweb']);
	});

	it(`should remove entry hazards past a Substitute`, function () {
		battle = common.createBattle([[
			{species: 'Cobalion', moves: ['stealthrock', 'substitute']},
		], [
			{species: 'Armaldo', moves: ['sleeptalk', 'rapidspin']},
		]]);
		battle.makeChoices();
		battle.makeChoices('move substitute', 'move rapidspin');
		assert(!battle.p2.sideConditions['stealthrock']);
	});

	it(`should not remove hazards if the user faints`, function () {
		battle = common.createBattle([[
			{species: 'Mew', item: 'rockyhelmet', moves: ['stealthrock']},
		], [
			{species: 'Shedinja', moves: ['rapidspin']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert(battle.p2.sideConditions['stealthrock']);
	});
});
