'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Lucky Chant', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should stop moves targeting the user's side from inflicting critical hits`, function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Jynx', ability: 'angerpoint', moves: ['luckychant']}]});
		battle.setPlayer('p2', {team: [{species: 'Crabominable', ability: 'noguard', moves: ['frostbreath']}]});
		battle.makeChoices('move luckychant', 'move frostbreath');
		assert.strictEqual(battle.p1.active[0].boosts.atk, 0);
	});

	it(`should not stop moves targeting the foe's side from inflicting critical hits`, function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Jynx', ability: 'noguard', moves: ['luckychant', 'frostbreath']}]});
		battle.setPlayer('p2', {team: [{species: 'Crabominable', ability: 'angerpoint', moves: ['sleeptalk']}]});
		battle.makeChoices('move luckychant', 'move sleeptalk');
		battle.makeChoices('move frostbreath', 'move sleeptalk');
		assert.strictEqual(battle.p2.active[0].boosts.atk, 6);
	});
});
