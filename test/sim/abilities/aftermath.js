'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Aftermath', function () {
	afterEach(function () {
		battle.destroy();
	});

	it("should hurt attackers by 1/4 their max HP when this Pokemon is KOed by a contact move", function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Galvantula', moves: ['lunge']}]});
		battle.setPlayer('p2', {team: [{species: 'Shiftry', ability: 'aftermath', moves: ['sleeptalk']}]});
		battle.makeChoices('move lunge', 'move sleeptalk');
		const attacker = battle.p1.active[0];
		assert.equal(attacker.hp, attacker.maxhp - Math.floor(attacker.maxhp / 4));
	});
});
