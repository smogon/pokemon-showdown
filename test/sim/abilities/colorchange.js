'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Color Change', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should change the user\'s type when struck by a move', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Kecleon", ability: 'colorchange', moves: ['recover']}]});
		battle.setPlayer('p2', {team: [{species: "Paras", ability: 'damp', moves: ['absorb']}]});
		const ccMon = battle.p1.active[0];
		battle.makeChoices('move Recover', 'move Absorb');
		assert(ccMon.hasType('Grass'));
	});

	it('should not change the user\'s type if it had a Substitute when hit', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Kecleon", ability: 'colorchange', moves: ['substitute']}]});
		battle.setPlayer('p2', {team: [{species: "Machamp", ability: 'purepower', item: 'laggingtail', moves: ['closecombat']}]});
		const ccMon = battle.p1.active[0];
		battle.makeChoices('move Substitute', 'move Closecombat');
		assert.false(ccMon.hasType('Fighting'));
	});
});
