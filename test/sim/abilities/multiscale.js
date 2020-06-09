'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Multiscale', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should halve damage when it is at full health', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Dragonite", ability: 'multiscale', moves: ['splash']}]});
		battle.setPlayer('p2', {team: [{species: "Gyarados", ability: 'moxie', moves: ['incinerate']}]});
		const pokemon = battle.p1.active[0];
		battle.makeChoices('move splash', 'move incinerate');
		const damage = pokemon.maxhp - pokemon.hp;
		const curhp = pokemon.hp;
		battle.resetRNG();
		battle.makeChoices('move splash', 'move incinerate');
		assert.equal(damage, battle.modify(curhp - pokemon.hp, 0.5));
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Dragonite", ability: 'multiscale', moves: ['splash']}]});
		battle.setPlayer('p2', {team: [{species: "Gyarados", ability: 'moldbreaker', moves: ['incinerate']}]});
		const pokemon = battle.p1.active[0];
		battle.makeChoices('move splash', 'move incinerate');
		const damage = pokemon.maxhp - pokemon.hp;
		const curhp = pokemon.hp;
		battle.resetRNG();
		battle.makeChoices('move splash', 'move incinerate');
		assert.equal(curhp - pokemon.hp, damage);
	});
});
