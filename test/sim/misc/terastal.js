'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Terastallization", function () {
	afterEach(function () {
		battle.destroy();
	});

	// Don't know why this is failing
	it('should change the user\'s type to its Tera type after terastallizing', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Ampharos', ability: 'static', moves: ['voltswitch', 'dragonpulse'], teraType: 'Dragon'},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Ampharos', ability: 'static', moves: ['voltswitch'], teraType: 'Dragon'},
		]});
		battle.makeChoices('move dragonpulse terastallize', 'auto');
		assert.equal(battle.p1.active[0].getTypes().join('/'), 'Dragon');
	});

	// TODO test if actual mechanic
	// Don't know why this is failing
	it('should persist the user\'s changed type after switching', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Ampharos', ability: 'static', moves: ['voltswitch', 'dragonpulse'], teraType: 'Dragon'},
			{species: 'Flaaffy', ability: 'static', moves: ['voltswitch', 'dragonpulse'], teraType: 'Electric'},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Ampharos', ability: 'static', moves: ['voltswitch'], teraType: 'Dragon'},
		]});
		battle.makeChoices('move dragonpulse terastallize', 'move voltswitch');
		assert.equal(battle.p1.active[0].getTypes().join('/'), 'Dragon');
		battle.makeChoices('switch 2', 'move voltswitch');
		assert.equal(battle.p1.pokemon[1].getTypes().join('/'), 'Dragon');
	});

	it.skip('should give STAB correctly to the user\'s old types', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Ampharos', ability: 'static', moves: ['shockwave', 'swift'], teraType: 'Electric'},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Ampharos', ability: 'static', moves: ['shockwave', 'swift'], teraType: 'Normal'},
		]});
		battle.makeChoices('move shockwave terastallize', 'move shockwave terastallize');
		const teraDamage = battle.p2.active[0].maxhp - battle.p2.active[0].maxhp;
		assert.bounded(teraDamage, [54, 64],
			"Terastralizing into the same type did not boost STAB; actual damage: " + teraDamage);
		const nonTeraDamage = battle.p1.active[0].maxhp - battle.p1.active[0].maxhp;
		assert.bounded(nonTeraDamage, [40, 48],
			"Terastralizing did not keep old type's STAB; actual damage: " + teraDamage);
	});
});
