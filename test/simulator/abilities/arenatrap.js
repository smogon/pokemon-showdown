'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Arena Trap', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent grounded Pokemon that are not immune to trapping from switching out normally', function () {
		this.timeout(0);
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Dugtrio", ability: 'arenatrap', moves: ['snore', 'telekinesis', 'gravity']}]});
		battle.setPlayer('p2', {team: [
			{species: "Tornadus", ability: 'defiant', moves: ['tailwind']},
			{species: "Heatran", ability: 'flashfire', item: 'airballoon', moves: ['roar']},
			{species: "Claydol", ability: 'levitate', moves: ['rest']},
			{species: "Dusknoir", ability: 'frisk', moves: ['rest']},
			{species: "Magnezone", ability: 'magnetpull', moves: ['magnetrise']},
			{species: "Vaporeon", ability: 'waterabsorb', moves: ['roar']},
		]});
		const p2active = battle.p2.active;
		battle.makeChoices('move snore', 'switch 2');
		assert.species(p2active[0], 'Heatran');
		battle.makeChoices('move snore', 'switch 3');
		assert.species(p2active[0], 'Claydol');
		battle.makeChoices('move snore', 'switch 4');
		assert.species(p2active[0], 'Dusknoir');
		battle.makeChoices('move snore', 'switch 5');
		assert.species(p2active[0], 'Magnezone');
		assert.trapped(() => battle.makeChoices('', 'switch 6'), true);

		assert.species(p2active[0], 'Magnezone'); // Magnezone is trapped

		assert.strictEqual(p2active[0].name, "Magnezone");
		battle.makeChoices('default', 'move magnetrise');

		battle.makeChoices('move snore', 'switch 6');
		assert.species(p2active[0], 'Vaporeon');

		assert.trapped(() => battle.makeChoices('default', 'switch 2'), true); // Vaporeon is trapped
		assert.species(p2active[0], 'Vaporeon');

		battle.makeChoices('move telekinesis', 'default'); // Telekinesis

		battle.makeChoices('move snore', 'switch 2');
		assert.species(p2active[0], 'Tornadus');

		battle.makeChoices('move gravity', 'default'); // Gravity

		assert.trapped(() => battle.makeChoices('', 'switch 4'), true); // Tornadus is trapped
		assert.species(p2active[0], 'Tornadus');
	});
});
