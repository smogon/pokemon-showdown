'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Rocky Helmet', function () {
	afterEach(function () {
		battle.destroy();
	});

	it("should hurt attackers by 1/6 their max HP when this Pokemon is hit by a contact move", function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Haxorus", moves: ['outrage']}]});
		battle.setPlayer('p2', {team: [{species: "Drampa", item: 'rockyhelmet', moves: ['sleeptalk']}]});
		battle.makeChoices('move outrage', 'move sleeptalk');
		const attacker = battle.p1.active[0];
		assert.equal(attacker.hp, attacker.maxhp - Math.floor(attacker.maxhp / 6));
	});
});
