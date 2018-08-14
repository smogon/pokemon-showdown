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
		battle.join('p1', 'Guest 1', 1, [{species: "Dugtrio", ability: 'arenatrap', moves: ['snore', 'telekinesis', 'gravity']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: "Tornadus", ability: 'defiant', moves: ['tailwind']},
			{species: "Heatran", ability: 'flashfire', item: 'airballoon', moves: ['roar']},
			{species: "Claydol", ability: 'levitate', moves: ['rest']},
			{species: "Dusknoir", ability: 'frisk', moves: ['rest']},
			{species: "Magnezone", ability: 'magnetpull', moves: ['magnetrise']},
			{species: "Vaporeon", ability: 'waterabsorb', moves: ['roar']},
		]);
		battle.makeChoices('move snore', 'switch 2');
		assert.species(p2.active[0], 'Heatran');
		battle.makeChoices('move snore', 'switch 3');
		assert.species(p2.active[0], 'Claydol');
		battle.makeChoices('move snore', 'switch 4');
		assert.species(p2.active[0], 'Dusknoir');
		battle.makeChoices('move snore', 'switch 5');
		assert.species(p2.active[0], 'Magnezone');
		battle.makeChoices('', 'switch 6');

		assert.species(p2.active[0], 'Magnezone'); // Magnezone is trapped

		assert.strictEqual(p2.active[0].name, "Magnezone");
		battle.makeChoices('', 'move magnetrise');

		battle.makeChoices('move snore', 'switch 6');
		assert.species(p2.active[0], 'Vaporeon');

		battle.makeChoices('', 'switch 2'); // Vaporeon is trapped
		assert.species(p2.active[0], 'Vaporeon');

		battle.makeChoices('move telekinesis', ''); // Telekinesis

		battle.makeChoices('move snore', 'switch 2');
		assert.species(p2.active[0], 'Tornadus');

		battle.makeChoices('move gravity', ''); // Gravity

		battle.makeChoices('', 'switch 4'); // Tornadus is trapped
		assert.species(p2.active[0], 'Tornadus');
	});
});
