'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('[Gen 1] Stat Drop Overflow', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`SafeTwo`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'Mewtwo', moves: ['amnesia', 'psychic'], ivs: {'spa': 28, 'spd': 28}},
		], [
			{species: 'Slowbro', moves: ['amnesia', 'surf'], evs: {'spa': 255, 'spd': 255}},
		]]);

		const mewtwo = battle.p1.active[0];
		assert.equal(mewtwo.storedStats['spa'], 341);
		battle.makeChoices();
		battle.makeChoices();
		assert.equal(mewtwo.modifiedStats['spa'], 999);
		battle.makeChoices();
		mewtwo.boostBy({spa: -1, spd: -1}); // Drop Special to +5
		assert.equal(mewtwo.modifiedStats['spa'], 1023);
		// Mewtwo's Special has not overflowed
		battle.makeChoices('move psychic', 'move surf');
		assert.false.fainted(mewtwo);
	});

	it(`Not SafeTwo`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'Mewtwo', moves: ['amnesia', 'luckychant'], evs: {'spa': 255, 'spd': 255}},
		], [
			{species: 'Slowbro', moves: ['amnesia', 'surf'], evs: {'spa': 255, 'spd': 255}},
		]]);

		const mewtwo = battle.p1.active[0];
		assert.equal(mewtwo.storedStats['spa'], 406);
		battle.makeChoices();
		battle.makeChoices();
		assert.equal(mewtwo.modifiedStats['spa'], 999);
		battle.makeChoices();
		mewtwo.boostBy({spa: -1, spd: -1}); // Drop Special to +5
		assert.equal(mewtwo.modifiedStats['spa'], 1218);
		// Mewtwo's Special has overflowed
		battle.makeChoices('move luckychant', 'move surf');
		assert.fainted(mewtwo);
	});
});
