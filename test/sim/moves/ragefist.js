'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Rage Fist', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should increase BP by 50 when user hit', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Primeape', ability: 'vitalspirit', moves: ['ragefist']}]});
		battle.setPlayer('p2', {team: [{species: 'Umbreon', ability: 'shellarmor', moves: ['tackle']}]});
		battle.makeChoices();
		let rageFistDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		assert.bounded(rageFistDamage, [17, 21]);
		battle.makeChoices();
		rageFistDamage = battle.p2.active[0].maxhp - rageFistDamage - battle.p2.active[0].hp;
		assert.bounded(rageFistDamage, [34, 41]);
	});

	it('should not increase BP after being hit by status moves', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Primeape', ability: 'vitalspirit', moves: ['ragefist']}]});
		battle.setPlayer('p2', {team: [{species: 'Umbreon', ability: 'shellarmor', moves: ['taunt']}]});
		battle.makeChoices();
		let rageFistDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		assert.bounded(rageFistDamage, [17, 21]);
		battle.makeChoices();
		rageFistDamage = battle.p2.active[0].maxhp - rageFistDamage - battle.p2.active[0].hp;
		assert.bounded(rageFistDamage, [17, 21]);
	});
});
