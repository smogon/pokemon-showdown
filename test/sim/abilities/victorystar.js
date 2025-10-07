'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Victory Star", () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`can boost accuracy twice if both the user and ally have the ability`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Victini', ability: 'victorystar', moves: ['hypnosis'] },
			{ species: 'Wynaut', ability: 'victorystar', moves: ['poltergeist'] },
		], [
			{ species: 'Dratini', moves: ['poltergeist'] },
			{ species: 'Avalugg', moves: ['poltergeist'] },
		]]);

		battle.onEvent('ModifyAccuracy', battle.format, -1000, (accuracy, target, source, move) => {
			const finalAccuracy = battle.finalModify(accuracy);
			assert.equal(finalAccuracy, 73);
			return finalAccuracy;
		});

		battle.makeChoices();
	});

	it(`should not boost the accuracy of opponents`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Victini', ability: 'victorystar', moves: ['sleeptalk'] },
			{ species: 'Wynaut', ability: 'victorystar', moves: ['sleeptalk'] },
		], [
			{ species: 'Dratini', moves: ['hypnosis'] },
			{ species: 'Avalugg', moves: ['sleeptalk'] },
		]]);

		battle.onEvent('ModifyAccuracy', battle.format, -1000, accuracy => {
			const finalAccuracy = battle.finalModify(accuracy);
			assert.equal(finalAccuracy, 60);
			return finalAccuracy;
		});

		battle.makeChoices();
	});

	it(`should boost accuracy even when used against allies`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Victini', ability: 'victorystar', moves: ['sleeptalk'] },
			{ species: 'Wynaut', ability: 'victorystar', moves: ['irontail'] },
		], [
			{ species: 'Dratini', moves: ['sleeptalk'] },
			{ species: 'Avalugg', moves: ['sleeptalk'] },
		]]);

		battle.onEvent('ModifyAccuracy', battle.format, -1000, accuracy => {
			const finalAccuracy = battle.finalModify(accuracy);
			assert.equal(finalAccuracy, 91);
			return finalAccuracy;
		});

		battle.makeChoices('move sleeptalk, move irontail -1', 'auto');
	});
});
