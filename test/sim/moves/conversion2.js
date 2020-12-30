'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Conversion2', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should change users type to resist', function () {
		battle = common.createBattle([
			[{species: 'porygon2', moves: ['sleeptalk', 'conversion2', 'spore']}],
			[{species: 'raticate', moves: ['tackle']},
			 {species: 'zapdos', moves: ['thundershock', 'sleeptalk']}],
		]);

		battle.makeChoices('move conversion2', 'move tackle');
		assert(['Rock', 'Ghost', 'Steel'].includes(battle.p1.active[0].getTypes()[0]));
		battle.makeChoices('move spore', 'switch 2');
		battle.makeChoices('move conversion2', 'move sleeptalk');
		assert(['Electric', 'Grass', 'Ground', 'Dragon'].includes(battle.p1.active[0].getTypes()[0]), 'should change type based on submove');
	});

	it('should respect the determined type of the last move', function () {
		battle = common.createBattle([
			[{species: 'porygon2', moves: ['electrify', 'conversion2']}],
			[{species: 'shuckle', moves: ['tackle']}],
		]);

		battle.makeChoices('move electrify', 'move tackle');
		battle.makeChoices('move conversion2', 'move tackle');
		assert(['Electric', 'Grass', 'Ground', 'Dragon'].includes(battle.p1.active[0].getTypes()[0]), 'Tackle should be considered Electric');
	});
});
