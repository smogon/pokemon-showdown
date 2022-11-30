'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('[Gen 1] Stat Drop Overflow', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('SafeTwo', function () {
		battle = common.gen(1).createBattle();
		battle.setPlayer('p1', {team: [{species: "Mewtwo", moves: ['amnesia', 'psychic'], evs: {'spa': 104, 'spd': 104}, ivs: {'spa': 3, 'spd': 3}}]});
		battle.setPlayer('p2', {team: [{species: "Slowbro", moves: ['amnesia', 'psychic', 'surf'], evs: {'spa': 255, 'spd': 255}, dvs: {'spa': 15, 'spd': 15}}]});
		const mewtwo = battle.p1.active[0];
		console.log(mewtwo.storedStats['spa']);
		assert(mewtwo.storedStats['spa'] === 341);
		battle.makeChoices();
		battle.makeChoices();
		assert(mewtwo.modifiedStats['spa'] === 999);
		battle.makeChoices('move amnesia', 'move psychic');
		assert(mewtwo.modifiedStats['spa'] === 1023);
		// Mewtwo's Special has not overflowed
		battle.makeChoices('move psychic', 'move surf');
		assert.false.fainted(mewtwo);
	});

	it('Not SafeTwo', function () {
		battle = common.gen(1).createBattle();
		battle.setPlayer('p1', {team: [{species: "Mewtwo", moves: ['amnesia', 'psychic'], evs: {'spa': 255, 'spd': 255}, dvs: {'spa': 15, 'spd': 15}}]});
		battle.setPlayer('p2', {team: [{species: "Slowbro", moves: ['amnesia', 'psychic', 'surf'], evs: {'spa': 255, 'spd': 255}, dvs: {'spa': 15, 'spd': 15}}]});
		const mewtwo = battle.p1.active[0];
		assert(mewtwo.storedStats['spa'] === 406);
		battle.makeChoices();
		battle.makeChoices();
		assert(mewtwo.modifiedStats['spa'] === 999);
		battle.makeChoices('move amnesia', 'move psychic');
		assert(mewtwo.modifiedStats['spa'] === 1218);
		// Mewtwo's Special has overflowed
		battle.makeChoices('move psychic', 'move surf');
		assert.fainted(mewtwo);
	});
});
