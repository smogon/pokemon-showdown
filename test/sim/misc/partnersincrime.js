'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Partners in Crime', function () {
	afterEach(() => battle.destroy());

	it('should activate shared abilities at the same time as other abilities', function () {
		battle = common.createBattle({formatid: 'gen9partnersincrime'}, [[
			{species: 'Incineroar', ability: 'intimidate', moves: ['sleeptalk']},
			{species: 'Pincurchin', ability: 'electricsurge', moves: ['sleeptalk']},
		], [
			{species: 'Baxcalibur', ability: 'icebody', moves: ['sleeptalk']},
			{species: 'Iron Valiant', ability: 'quarkdrive', moves: ['sleeptalk']},
		]]);
		// team preview
		battle.makeChoices();
		const baxcalibur = battle.p2.active[0];
		assert.statStage(baxcalibur, 'atk', -2);
		assert.equal(baxcalibur.volatiles.quarkdrive.bestStat, 'def',
			`Baxcalibur should be Intimidated before Quark Drive activates`);
		assert.equal(battle.field.terrainState.source.name, 'Incineroar', `Incineroar should set Electric Terrain`);
	});
});
