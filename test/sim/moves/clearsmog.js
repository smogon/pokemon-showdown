'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Clear Smog', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should remove all stat boosts from the target', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Amoonguss", ability: 'regenerator', moves: ['clearsmog']}]});
		battle.setPlayer('p2', {team: [{species: "Sableye", ability: 'prankster', moves: ['calmmind']}]});

		battle.makeChoices('move clearsmog', 'move calmmind');

		assert.equal(battle.p2.pokemon[0].boosts['spa'], 0);
		assert.equal(battle.p2.pokemon[0].boosts['spd'], 0);
	});

	it('should not remove stat boosts from a target behind a substitute', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Amoonguss", ability: 'regenerator', moves: ['clearsmog', 'toxic']}]});
		battle.setPlayer('p2', {team: [{species: "Sableye", ability: 'prankster', moves: ['substitute', 'calmmind']}]});

		battle.makeChoices('move toxic', 'move substitute');
		battle.makeChoices('move clearsmog', 'move calmmind');

		assert.equal(battle.p2.pokemon[0].boosts['spa'], 1);
		assert.equal(battle.p2.pokemon[0].boosts['spd'], 1);
	});

	it('should not remove stat boosts if the target is immune to its attack type', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Amoonguss", ability: 'regenerator', item: 'laggingtail', moves: ['clearsmog']}]});
		battle.setPlayer('p2', {team: [{species: "Steelix", ability: 'prankster', moves: ['irondefense']}]});

		battle.makeChoices('move clearsmog', 'move irondefense');

		assert.equal(battle.p2.pokemon[0].boosts['def'], 2);
	});

	it('should not remove stat boosts from the user', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Amoonguss", ability: 'regenerator', moves: ['clearsmog']}]});
		battle.setPlayer('p2', {team: [{species: "Arcanine", ability: 'intimidate', moves: ['morningsun']}]});

		battle.makeChoices('move clearsmog', 'move morningsun');

		assert.equal(battle.p1.pokemon[0].boosts['atk'], -1);
	});

	it('should trigger before Anger Point activates during critical hits', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Amoonguss", ability: 'regenerator', item: 'scopelens', moves: ['focusenergy', 'clearsmog']}]});
		battle.setPlayer('p2', {team: [{species: "Primeape", ability: 'angerpoint', moves: ['bulkup']}]});

		battle.makeChoices('move focusenergy', 'move bulkup');
		assert.equal(battle.p2.pokemon[0].boosts['atk'], 1);
		assert.equal(battle.p2.pokemon[0].boosts['def'], 1);

		battle.makeChoices('move clearsmog', 'move bulkup');
		assert.equal(battle.p2.pokemon[0].boosts['atk'], 6);
		assert.equal(battle.p2.pokemon[0].boosts['def'], 0);
	});
});
