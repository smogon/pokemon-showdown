'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Parting Shot`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should not switch the user out if the target's stats are not changed`, function () {
		battle = common.createBattle([[
			{species: 'Silvally', ability: 'prankster', moves: ['partingshot', 'splash']},
			{species: 'Type: Null', ability: 'battlearmor', moves: ['return']},
		], [
			{species: 'Registeel', ability: 'clearbody', moves: ['splash']},
			{species: 'Solgaleo', ability: 'fullmetalbody', moves: ['splash']},
			{species: 'Torkoal', ability: 'whitesmoke', moves: ['splash']},
			{species: 'Shaymin', ability: 'flowerveil', moves: ['splash']},
			{species: 'Kingler', ability: 'hypercutter', moves: ['splash']},
			{species: 'Spinda', ability: 'contrary', moves: ['splash', 'partingshot']},
		]]);
		battle.makeChoices('move partingshot', 'move splash');
		assert.equal(battle.requestState, 'move');
		battle.makeChoices('move partingshot', 'switch 2'); // Solgaleo
		assert.equal(battle.requestState, 'move');
		battle.makeChoices('move partingshot', 'switch 3'); // Torkoal
		assert.equal(battle.requestState, 'move');
		battle.makeChoices('move partingshot', 'switch 4'); // Shaymin
		assert.equal(battle.requestState, 'move');
		battle.makeChoices('move splash', 'switch 5'); // Kingler
		battle.p2.active[0].boostBy({spa: -6}); // hack Kingler's Sp. Atk to -6; Hyper Cutter & -6 Sp. Atk
		battle.makeChoices('move partingshot', 'move splash');
		assert.equal(battle.requestState, 'move');
		battle.makeChoices('move splash', 'switch 6'); // Spinda
		battle.p2.active[0].boostBy({atk: 6, spa: 6}); // hack Contrary Spinda to +6 Atk / +6 Sp. Atk
		battle.makeChoices('move partingshot', 'move splash');
		assert.equal(battle.requestState, 'move');
		battle.p1.active[0].boostBy({atk: -6, spa: -6});
		battle.makeChoices('move splash', 'move partingshot'); // Spinda's Parting Shot against Silvally this time
		assert.equal(battle.requestState, 'move');
	});

	it(`should set the Z-Parting Shot healing flag even if the Parting Shot itself was not successful`, function () {
		battle = common.createBattle([[
			{species: 'landorus', ability: 'noguard', moves: ['sleeptalk']},
			{species: 'persian-alola', ability: 'noguard', item: 'darkiniumz', moves: ['partingshot']},
		], [
			{species: 'wynaut', ability: 'clearbody', moves: ['circlethrow']},
		]]);
		battle.makeChoices();
		battle.makeChoices('move partingshot zmove', 'auto');
		const landorus = battle.p1.active[0];
		assert.fullHP(landorus);
	});
});
