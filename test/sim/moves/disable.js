'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Disable', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should prevent the use of the target's last move`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', moves: ['disable']},
		], [
			{species: 'Spearow', moves: ['growl']},
		]]);

		battle.makeChoices();
		assert.cantMove(() => battle.makeChoices('auto', 'move growl'), 'Spearow', 'growl');
	});

	it(`should interupt consecutively executed moves like Outrage`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', moves: ['disable']},
		], [
			{species: 'Spearow', moves: ['outrage', 'sleeptalk']},
		]]);

		battle.makeChoices();
		assert.cantMove(() => battle.makeChoices('auto', 'move sleeptalk'), 'Spearow', 'sleeptalk');
		battle.makeChoices();
		assert.cantMove(() => battle.makeChoices('auto', 'move outrage'));
	});
});
