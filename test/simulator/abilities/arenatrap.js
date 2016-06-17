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
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Dugtrio", ability: 'arenatrap', moves: ['snore', 'telekinesis', 'gravity']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: "Tornadus", ability: 'defiant', moves: ['tailwind']},
			{species: "Heatran", ability: 'flashfire', item: 'airballoon', moves: ['roar']},
			{species: "Claydol", ability: 'levitate', moves: ['rest']},
			{species: "Dusknoir", ability: 'frisk', moves: ['rest']},
			{species: "Magnezone", ability: 'magnetpull', moves: ['magnetrise']},
			{species: "Vaporeon", ability: 'waterabsorb', moves: ['roar']},
		]);
		p2.chooseSwitch(2).foe.chooseMove(1);
		assert.species(p2.active[0], 'Heatran');
		p2.chooseSwitch(3).foe.chooseMove(1);
		assert.species(p2.active[0], 'Claydol');
		p2.chooseSwitch(4).foe.chooseMove(1);
		assert.species(p2.active[0], 'Dusknoir');
		p2.chooseSwitch(5).foe.chooseMove(1);
		assert.species(p2.active[0], 'Magnezone');

		assert.false(p2.chooseSwitch(6)); // Magnezone is trapped
		battle.commitDecisions();
		assert.species(p2.active[0], 'Magnezone');

		assert.strictEqual(p2.active[0].name, "Magnezone");
		p2.chooseMove(1); // Magnet Rise
		battle.commitDecisions();

		p2.chooseSwitch(6).foe.chooseMove(1);
		assert.species(p2.active[0], 'Vaporeon');

		assert.false(p2.chooseSwitch(2)); // Vaporeon is trapped
		battle.commitDecisions();
		assert.species(p2.active[0], 'Vaporeon');

		p1.chooseMove(2); // Telekinesis
		battle.commitDecisions();

		p2.chooseSwitch(2).foe.chooseMove(1);
		assert.species(p2.active[0], 'Tornadus');

		p1.chooseMove(3); // Gravity
		battle.commitDecisions();

		assert.false(p2.chooseSwitch(4)); // Tornadus is trapped
		battle.commitDecisions();
		assert.species(p2.active[0], 'Tornadus');
	});
});
