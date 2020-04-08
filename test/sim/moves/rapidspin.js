'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Rapid Spin', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should remove entry hazards', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Omastar", moves: ['stealthrock', 'spikes', 'toxicspikes', 'substitute']}]});
		battle.setPlayer('p2', {team: [{species: "Armaldo", moves: ['sleeptalk', 'rapidspin']}]});
		battle.makeChoices('move stealthrock', 'move sleeptalk');
		battle.makeChoices('move spikes', 'move sleeptalk');
		battle.makeChoices('move toxicspikes', 'move rapidspin');
		assert(!battle.p2.sideConditions['stealthrock']);
		assert(!battle.p2.sideConditions['spikes']);
		assert(!battle.p2.sideConditions['toxicspikes']);
	});

	it('should remove entry hazards past a Sub', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Omastar", moves: ['stealthrock', 'spikes', 'toxicspikes', 'substitute']}]});
		battle.setPlayer('p2', {team: [{species: "Armaldo", moves: ['sleeptalk', 'rapidspin']}]});
		battle.makeChoices('move stealthrock', 'move sleeptalk');
		battle.makeChoices('move spikes', 'move sleeptalk');
		battle.makeChoices('move toxicspikes', 'move sleeptalk');
		battle.makeChoices('move substitute', 'move rapidspin');
		assert(!battle.p2.sideConditions['stealthrock']);
		assert(!battle.p2.sideConditions['spikes']);
		assert(!battle.p2.sideConditions['toxicspikes']);
	});

	it('should not remove hazards if the user faints', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Mew", item: 'rockyhelmet', moves: ['stealthrock', 'sleeptalk']}]});
		battle.setPlayer('p2', {team: [{species: "Shedinja", moves: ['sleeptalk', 'rapidspin']}]});
		battle.makeChoices('move stealthrock', 'move sleeptalk');
		battle.makeChoices('move sleeptalk', 'move rapidspin');
		assert(battle.p2.sideConditions['stealthrock']);
	});
});
