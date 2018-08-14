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
		battle.join('p1', 'Guest 1', 1, [{species: 'Abra', ability: 'prankster', moves: ['imprison', 'calmmind']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Abra', ability: 'synchronize', moves: ['calmmind', 'confusion']}]);
		battle.makeChoices('move imprison', 'move calmmind');
		assert.strictEqual(battle.p2.active[0].boosts['spa'], 0);
		assert.strictEqual(battle.p2.active[0].boosts['spd'], 0);
		battle.makeChoices('move imprison', 'move calmmind');
		assert.strictEqual(battle.p2.active[0].lastMove.id, 'confusion');
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
