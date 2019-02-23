'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Imprison', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent foes from using moves that the user knows', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Abra', ability: 'prankster', moves: ['imprison', 'calmmind', 'batonpass']},
			{species: 'Kadabra', ability: 'prankster', moves: ['imprison', 'calmmind']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Abra', ability: 'synchronize', moves: ['calmmind', 'gravity']},
			{species: 'Kadabra', ability: 'prankster', moves: ['imprison', 'calmmind']},
		]);
		battle.makeChoices('move imprison', 'move calmmind');
		assert.strictEqual(battle.p2.active[0].boosts['spa'], 0);
		assert.strictEqual(battle.p2.active[0].boosts['spd'], 0);
		battle.makeChoices('move imprison', 'move calmmind');
		assert.strictEqual(battle.p2.active[0].lastMove.id, 'gravity');

		// Imprison doesn't end when the foe switches
		battle.makeChoices('move calmmind', 'switch 2');
		battle.makeChoices('move calmmind', 'move calmmind');
		assert.strictEqual(battle.p2.active[0].boosts['spa'], 0);

		// Imprison is not passed by Baton Pass
		battle.makeChoices('move batonpass', 'move calmmind');
		assert.strictEqual(battle.p2.active[0].boosts['spa'], 0);
		battle.makeChoices('switch 2', 'pass');
		assert.strictEqual(battle.p2.active[0].boosts['spa'], 0);
		battle.makeChoices('move calmmind', 'move calmmind');
		assert.strictEqual(battle.p2.active[0].boosts['spa'], 1);

		// Imprison ends after user switches
		battle.makeChoices('switch 2', 'move calmmind');
		assert.strictEqual(battle.p2.active[0].boosts['spa'], 2);
		battle.makeChoices('move calmmind', 'move calmmind');
		assert.strictEqual(battle.p2.active[0].boosts['spa'], 3);
	});

	it('should not prevent foes from using Z-Powered Status moves', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Sableye', ability: 'prankster', moves: ['imprison', 'sunnyday']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Charmander', ability: 'blaze', item: 'firiumz', moves: ['sunnyday']}]);
		battle.makeChoices('move imprison', 'move sunnyday zmove');
		assert.statStage(battle.p2.active[0], 'spe', 1);
		assert.ok(battle.isWeather('sunnyday'));
	});
});
