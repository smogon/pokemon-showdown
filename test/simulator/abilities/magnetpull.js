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
		battle.setPlayer('p1', {team: [{species: "Magnezone", ability: 'magnetpull', moves: ['soak', 'charge']}]});
		battle.setPlayer('p2', {team: [
			{species: "Heatran", ability: 'flashfire', moves: ['curse']},
			{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
		]});

		assert.trapped(() => battle.makeChoices('', 'switch 2'), true);
		battle.makeChoices('auto', 'auto');
		assert.species(battle.p2.active[0], 'Heatran');
		battle.makeChoices('auto', 'switch 2');
		assert.species(battle.p2.active[0], 'Starmie');
		battle.makeChoices('move charge', 'move reflecttype'); // Reflect Type makes Starmie part Steel
		assert.trapped(() => battle.makeChoices('', 'switch 2'), true);
		battle.makeChoices('auto', 'auto');
		assert.species(battle.p2.active[0], 'Starmie');
	});

	it('should not prevent Steel-type Pokemon from switching out using moves', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Magnezone", ability: 'magnetpull', moves: ['toxic']}]});
		battle.setPlayer('p2', {team: [
			{species: "Heatran", ability: 'flashfire', moves: ['batonpass']},
			{species: "Tentacruel", ability: 'clearbody', moves: ['rapidspin']},
		]});
		battle.makeChoices('move toxic', 'move batonpass');
		battle.makeChoices('', 'switch 2');
		assert.species(battle.p2.active[0], 'Tentacruel');
	});

	it('should not prevent Pokemon immune to trapping from switching out', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Magnezone", ability: 'magnetpull', moves: ['substitute']}]});
		battle.setPlayer('p2', {team: [
			{species: "Aegislash", ability: 'stancechange', moves: ['swordsdance']},
			{species: "Arcanine", ability: 'flashfire', moves: ['roar']},
		]});
		battle.makeChoices('move substitute', 'switch 2');
		assert.species(battle.p2.active[0], 'Arcanine');
	});
});
