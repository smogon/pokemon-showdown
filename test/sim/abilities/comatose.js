'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Comatose', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should make the user immune to status conditions', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Komala", ability: 'comatose', moves: ['shadowclaw']}]});
		battle.setPlayer('p2', {team: [{species: "Smeargle", ability: 'noguard', moves: ['spore', 'glare', 'willowisp', 'toxic']}]});
		const comatoseMon = battle.p1.active[0];
		for (let i = 1; i <= 4; i++) {
			assert.constant(() => comatoseMon.status, () => battle.makeChoices('move shadowclaw', 'move ' + i));
		}
	});

	it('should not have its status immunity bypassed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Komala", ability: 'comatose', moves: ['shadowclaw']}]});
		battle.setPlayer('p2', {team: [{species: "Smeargle", ability: 'moldbreaker', moves: ['spore', 'glare', 'willowisp', 'toxic']}]});
		const comatoseMon = battle.p1.active[0];
		for (let i = 1; i <= 4; i++) {
			assert.constant(() => comatoseMon.status, () => battle.makeChoices('move shadowclaw', 'move ' + i));
		}
	});

	it('should cause Rest to fail', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Komala", ability: 'comatose', moves: ['rest']}]});
		battle.setPlayer('p2', {team: [{species: "Smeargle", ability: 'technician', moves: ['aquajet']}]});
		const comatoseMon = battle.p1.active[0];
		assert.hurts(comatoseMon, () => battle.makeChoices('move rest', 'move aquajet'));
		assert.constant(() => comatoseMon.status, () => battle.makeChoices('move rest', 'move aquajet'));
	});

	it('should allow the use of Snore and Sleep Talk as if the user were asleep', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Komala", ability: 'comatose', moves: ['snore', 'sleeptalk', 'brickbreak']}]});
		battle.setPlayer('p2', {team: [{species: "Smeargle", ability: 'technician', moves: ['endure']}]});
		const defender = battle.p2.active[0];
		for (let i = 1; i <= 2; i++) {
			assert.hurts(defender, () => battle.makeChoices('move ' + i, 'move endure'));
		}
	});

	it('should cause the user to be damaged by Dream Eater as if it were asleep', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Komala", ability: 'comatose', moves: ['shadowclaw']}]});
		battle.setPlayer('p2', {team: [{species: "Smeargle", ability: 'technician', moves: ['dreameater']}]});
		assert.hurts(battle.p1.active[0], () => battle.makeChoices('move shadowclaw', 'move dreameater'));
	});

	it('should cause Wake-Up Slap and Hex to have doubled base power when used against the user', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Komala", ability: 'comatose', item: 'ringtarget', moves: ['endure']}]});
		battle.setPlayer('p2', {team: [{species: "Smeargle", ability: 'technician', moves: ['hex', 'wakeupslap']}]});

		let bp = 0;
		battle.onEvent('BasePower', battle.getFormat(), function (basePower, pokemon, target, move) {
			bp = basePower;
		});

		battle.makeChoices('move endure', 'move hex');
		assert.strictEqual(bp, battle.getMove('hex').basePower * 2);

		battle.makeChoices('move endure', 'move wakeupslap');
		assert.strictEqual(bp, battle.getMove('wakeupslap').basePower * 2);
	});
});
