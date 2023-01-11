'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Thrash [Gen 1]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it("Three turn Thrash", function () {
		battle = common.gen(1).createBattle();
		battle.setPlayer('p1', {team: [{species: "Nidoking", moves: ['thrash']}]});
		battle.setPlayer('p2', {team: [{species: "Golem", moves: ['splash']}]});
		const nidoking = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(nidoking.volatiles['lockedmove'].time, 2);
		battle.makeChoices();
		battle.makeChoices();
		assert(!nidoking.volatiles['lockedmove']);
		assert(nidoking.volatiles['confusion']);
	});

	it("Four turn Thrash", function () {
		battle = common.gen(1).createBattle({seed: [1, 1, 1, 1]});
		battle.setPlayer('p1', {team: [{species: "Nidoking", moves: ['thrash']}]});
		battle.setPlayer('p2', {team: [{species: "Golem", moves: ['splash']}]});
		const nidoking = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(nidoking.volatiles['lockedmove'].time, 3);
		battle.makeChoices();
		battle.makeChoices();
		battle.makeChoices();
		assert(!nidoking.volatiles['lockedmove']);
		assert(nidoking.volatiles['confusion']);
	});

	it("Thrash locks the user in, even if it targets a semi-invulnerable foe", function () {
		battle = common.gen(1).createBattle();
		battle.setPlayer('p1', {team: [{species: "Nidoking", moves: ['thrash']}]});
		battle.setPlayer('p2', {team: [{species: "Aerodactyl", moves: ['fly']}]});
		const nidoking = battle.p1.active[0];
		battle.makeChoices();
		assert(nidoking.volatiles['lockedmove']);
	});

	it("Thrash locks the user in, even if it targets a Ghost type", function () {
		battle = common.gen(1).createBattle();
		battle.setPlayer('p1', {team: [{species: "Nidoking", moves: ['thrash']}]});
		battle.setPlayer('p2', {team: [{species: "Gengar", moves: ['splash']}]});
		const nidoking = battle.p1.active[0];
		battle.makeChoices();
		assert(nidoking.volatiles['lockedmove']);
	});
});
