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
		assert(battle.log.includes('|-start|p1a: Nidoking|confusion|[silent]'));
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
		assert(battle.log.includes('|-start|p1a: Nidoking|confusion|[silent]'));
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

	it("Thrash locks the user in, even if it targets and breaks a Substitute", function () {
		battle = common.gen(1).createBattle();
		battle.setPlayer('p1', {team: [{species: "Nidoking", moves: ['thrash']}]});
		battle.setPlayer('p2', {team: [{species: "Alakazam", moves: ['substitute']}]});
		const nidoking = battle.p1.active[0];
		const alakazam = battle.p2.active[0];
		battle.makeChoices();
		assert(nidoking.volatiles['lockedmove']);
		assert(alakazam.subFainted);
	});

	it("Thrash is paused when asleep or frozen", function () {
		battle = common.gen(1).createBattle();
		battle.setPlayer('p1', {team: [{species: "Nidoking", moves: ['thrash']}]});
		battle.setPlayer('p2', {team: [{species: "Parasect", moves: ['spore']}]});
		const nidoking = battle.p1.active[0];
		for (let i = 0; i < 10; i++) {
			battle.makeChoices();
			assert.equal(nidoking.volatiles['lockedmove'].time, 2);
		}
	});

	it("Thrash is paused when disabled", function () {
		battle = common.gen(1).createBattle({seed: [1, 1, 1, 1]});
		battle.setPlayer('p1', {team: [{species: "Nidoking", moves: ['thrash']}]});
		battle.setPlayer('p2', {team: [{species: "Golem", moves: ['disable']}]});
		const nidoking = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(nidoking.volatiles['lockedmove'].time, 3);
		assert(nidoking.volatiles['disable'].time > 1);
		battle.makeChoices();
		assert.equal(nidoking.volatiles['lockedmove'].time, 3);
	});

	it("Thrash accuracy bug", function () {
		battle = common.gen(1).createBattle({seed: [1, 1, 1, 1]});
		battle.setPlayer('p1', {team: [{species: "Nidoking", moves: ['thrash']}]});
		battle.setPlayer('p2', {team: [{species: "Aerodactyl", moves: ['doubleteam']}]});
		const nidoking = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(nidoking.volatiles['lockedmove'].accuracy, 168);
		battle.makeChoices();
		assert.equal(nidoking.volatiles['lockedmove'].accuracy, 84);
		assert(battle.log.some(line => line.includes('-miss|p1a: Nidoking')));
	});
});
