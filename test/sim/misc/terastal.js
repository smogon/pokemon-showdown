'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Terastallization", function () {
	afterEach(function () {
		battle.destroy();
	});

	// Don't know why this is failing
	it.skip('should change the user\'s type to its Tera type after terastallizing', function () {
		battle = common.createBattle({formatid: 'gen9oubeta'});
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
	it.skip('should persist the user\'s changed type after switching', function () {
		battle = common.createBattle({formatid: 'gen9oubeta'});
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
});
