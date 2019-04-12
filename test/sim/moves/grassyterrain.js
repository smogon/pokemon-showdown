'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Grassy Terrain', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should change the current terrain to Grassy Terrain for five turns', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Florges", ability: 'symbiosis', moves: ['mist', 'grassyterrain']}]});
		battle.setPlayer('p2', {team: [{species: "Florges", ability: 'symbiosis', moves: ['mist']}]});
		battle.makeChoices('move grassyterrain', 'move mist');
		assert.ok(battle.field.isTerrain('grassyterrain'));
		battle.makeChoices('move mist', 'move mist');
		assert.ok(battle.field.isTerrain('grassyterrain'));
		battle.makeChoices('move mist', 'move mist');
		assert.ok(battle.field.isTerrain('grassyterrain'));
		battle.makeChoices('move mist', 'move mist');
		assert.ok(battle.field.isTerrain('grassyterrain'));
		battle.makeChoices('move mist', 'move mist');
		assert.ok(battle.field.isTerrain(''));
	});

	it('should halve the base power of Earthquake, Bulldoze, Magnitude', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Shaymin", ability: 'naturalcure', moves: ['grassyterrain']}]});
		battle.setPlayer('p2', {team: [{species: "Shaymin-Sky", ability: 'serenegrace', moves: ['leechseed']}]});
		battle.makeChoices('move grassyterrain', 'move leechseed');
		assert.strictEqual(battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], Dex.getMove('earthquake'), 100, true), 50);
		assert.strictEqual(battle.runEvent('BasePower', battle.p1.active[0], battle.p2.active[0], Dex.getMove('earthquake'), 100, true), 50);
		assert.strictEqual(battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], Dex.getMove('bulldoze'), 60, true), 30);
		assert.strictEqual(battle.runEvent('BasePower', battle.p1.active[0], battle.p2.active[0], Dex.getMove('bulldoze'), 60, true), 30);
	});

	it('should increase the base power of Grass-type attacks used by grounded Pokemon', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Shaymin", ability: 'naturalcure', moves: ['grassyterrain']}]});
		battle.setPlayer('p2', {team: [{species: "Shaymin-Sky", ability: 'serenegrace', moves: ['leechseed']}]});
		battle.makeChoices('move grassyterrain', 'move leechseed');
		let basePower;
		let move = Dex.getMove('gigadrain');
		basePower = battle.runEvent('BasePower', battle.p1.active[0], battle.p2.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, battle.modify(move.basePower, 1.5));
		basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
	});

	it('should heal grounded Pokemon by 1/16 of their max HP', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Shaymin", ability: 'naturalcure', moves: ['grassyterrain', 'dragonrage']}]});
		battle.setPlayer('p2', {team: [{species: "Magneton", ability: 'magnetpull', moves: ['magnetrise', 'dragonrage']}]});
		battle.makeChoices('move grassyterrain', 'move magnetrise');
		battle.makeChoices('move dragonrage', 'move dragonrage');
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp - 40 + Math.floor(battle.p1.active[0].maxhp / 16));
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp - 40);
	});

	it('should not affect Pokemon in a semi-invulnerable state', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Smeargle", ability: 'owntempo', moves: ['dragonrage', 'skydrop']}]});
		battle.setPlayer('p2', {team: [{species: "Sableye", ability: 'prankster', moves: ['dragonrage', 'grassyterrain']}]});
		battle.makeChoices('move dragonrage', 'move dragonrage');
		battle.makeChoices('move skydrop', 'move grassyterrain');
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp - 40);
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp - 40);
	});

	it('should cause Nature Power to become Energy Ball', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Whimsicott", ability: 'prankster', moves: ['grassyterrain']}]});
		battle.setPlayer('p2', {team: [{species: "Shuckle", ability: 'sturdy', moves: ['naturepower']}]});
		battle.makeChoices('move grassyterrain', 'move naturepower');
		let resultMove = toId(battle.log[battle.lastMoveLine].split('|')[3]);
		assert.strictEqual(resultMove, 'energyball');
	});
});
