'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Bide [Gen 1]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it("Two turn Bide", function () {
		battle = common.gen(1).createBattle();
		battle.setPlayer('p1', {team: [{species: "Aerodactyl", moves: ['bide']}]});
		battle.setPlayer('p2', {team: [{species: "Gyarados", moves: ['dragonrage']}]});
		const aerodactyl = battle.p1.active[0];
		const gyarados = battle.p2.active[0];
		battle.makeChoices();
		assert.equal(aerodactyl.volatiles['bide'].time, 2);
		battle.makeChoices();
		battle.makeChoices();
		assert(!aerodactyl.volatiles['bide']);
		assert.equal(gyarados.maxhp - gyarados.hp, 160);
	});

	it("Three turn Bide", function () {
		battle = common.gen(1).createBattle({seed: [1, 1, 1, 1]});
		battle.setPlayer('p1', {team: [{species: "Aerodactyl", moves: ['bide']}]});
		battle.setPlayer('p2', {team: [{species: "Gyarados", moves: ['dragonrage']}]});
		const aerodactyl = battle.p1.active[0];
		const gyarados = battle.p2.active[0];
		battle.makeChoices();
		assert.equal(aerodactyl.volatiles['bide'].time, 3);
		battle.makeChoices();
		battle.makeChoices();
		battle.makeChoices();
		assert(!aerodactyl.volatiles['bide']);
		assert.equal(gyarados.maxhp - gyarados.hp, 240);
	});

	it("Bide damage can hit a Substitute", function () {
		battle = common.gen(1).createBattle();
		battle.setPlayer('p1', {team: [{species: "Aerodactyl", moves: ['bide', 'whirlwind']}]});
		battle.setPlayer('p2', {team: [{species: "Gyarados", moves: ['dragonrage', 'substitute']}]});
		const aerodactyl = battle.p1.active[0];
		const gyarados = battle.p2.active[0];
		battle.makeChoices('move whirlwind', 'move substitute');
		battle.makeChoices();
		assert.equal(aerodactyl.volatiles['bide'].time, 2);
		battle.makeChoices();
		battle.makeChoices();
		assert(!aerodactyl.volatiles['bide']);
		assert(!gyarados.volatiles['substitute']);
	});
});
