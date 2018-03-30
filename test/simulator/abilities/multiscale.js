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
		battle.join('p1', 'Guest 1', 1, [{species: "Dragonite", ability: 'multiscale', moves: ['splash']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Gyarados", ability: 'moxie', moves: ['incinerate']}]);
		let damage, curhp;
		let pokemon = battle.p1.active[0];
		battle.makeChoices('move splash', 'move incinerate');
		damage = pokemon.maxhp - pokemon.hp;
		curhp = pokemon.hp;
		battle.resetRNG();
		battle.makeChoices('move splash', 'move incinerate');
		assert.strictEqual(damage, battle.modify(curhp - pokemon.hp, 0.5));
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Dragonite", ability: 'multiscale', moves: ['splash']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Gyarados", ability: 'moldbreaker', moves: ['incinerate']}]);
		let damage, curhp;
		let pokemon = battle.p1.active[0];
		battle.makeChoices('move splash', 'move incinerate');
		damage = pokemon.maxhp - pokemon.hp;
		curhp = pokemon.hp;
		battle.resetRNG();
		battle.makeChoices('move splash', 'move incinerate');
		assert.strictEqual(curhp - pokemon.hp, damage);
	});
});
