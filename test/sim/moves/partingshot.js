'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Parting Shot`, function () {
	afterEach(() => battle.destroy());

	it(`should not switch the user out if the target's stats are not changed`, function () {
		battle = common.createBattle([
			[{species: "Silvally", ability: 'prankster', moves: ['partingshot', 'splash']},
				{species: "Type: Null", ability: 'battlearmor', moves: ['return']}],
			[{species: "Registeel", ability: 'clearbody', moves: ['splash']},
				{species: "Solgaleo", ability: 'fullmetalbody', moves: ['splash']},
				{species: "Torkoal", ability: 'whitesmoke', moves: ['splash']},
				{species: "Shaymin", ability: 'flowerveil', moves: ['splash']},
				{species: "Kingler", ability: 'hypercutter', moves: ['splash']},
				{species: "Spinda", ability: 'contrary', moves: ['splash', 'partingshot']}],
		]);
		const p1 = battle.p1;
		const p2 = battle.p2;
		battle.makeChoices('move partingshot', 'move splash');
		assert.equal(battle.requestState, 'move');
		battle.makeChoices('move partingshot', 'switch 2'); // Solgaleo
		assert.equal(battle.requestState, 'move');
		battle.makeChoices('move partingshot', 'switch 3'); // Torkoal
		assert.equal(battle.requestState, 'move');
		battle.makeChoices('move partingshot', 'switch 4'); // Shaymin
		assert.equal(battle.requestState, 'move');
		battle.makeChoices('move splash', 'switch 5'); // Kingler
		p2.active[0].boostBy({spa: -6});
		battle.makeChoices('move partingshot', 'move splash');
		assert.equal(battle.requestState, 'move');
		battle.makeChoices('move splash', 'switch 6'); // Spinda
		p2.active[0].boostBy({atk: 6, spa: 6});
		battle.makeChoices('move partingshot', 'move splash');
		assert.equal(battle.requestState, 'move');
		p1.active[0].boostBy({atk: -6, spa: -6});
		battle.makeChoices('move splash', 'move partingshot'); // Parting Shot against Silvally this time
		assert.equal(battle.requestState, 'move');
	});
});
