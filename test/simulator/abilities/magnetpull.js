'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Magnet Pull', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent Steel-type Pokemon from switching out normally', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Magnezone", ability: 'magnetpull', moves: ['soak', 'charge']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: "Heatran", ability: 'flashfire', moves: ['curse']},
			{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
		]);
		assert.false(p2.chooseSwitch(2));
		battle.commitDecisions();
		assert.species(battle.p2.active[0], 'Heatran');
		p2.chooseSwitch(2).foe.chooseDefault();
		assert.species(battle.p2.active[0], 'Starmie');
		p1.chooseMove(2).foe.chooseMove('reflecttype'); // Reflect Type makes Starmie part Steel
		assert.false(p2.chooseSwitch(2));
		battle.commitDecisions();
		assert.species(battle.p2.active[0], 'Starmie');
	});

	it('should not prevent Steel-type Pokemon from switching out using moves', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Magnezone", ability: 'magnetpull', moves: ['toxic']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Heatran", ability: 'flashfire', moves: ['batonpass']},
			{species: "Tentacruel", ability: 'clearbody', moves: ['rapidspin']},
		]);
		battle.p2.chooseMove('batonpass').foe.chooseDefault();
		battle.p2.chooseSwitch(2);
		assert.species(battle.p2.active[0], 'Tentacruel');
	});

	it('should not prevent Pokemon immune to trapping from switching out', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Magnezone", ability: 'magnetpull', moves: ['substitute']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Aegislash", ability: 'stancechange', moves: ['swordsdance']},
			{species: "Arcanine", ability: 'flashfire', moves: ['roar']},
		]);
		battle.p2.chooseSwitch(2).foe.chooseDefault();
		assert.species(battle.p2.active[0], 'Arcanine');
	});
});
