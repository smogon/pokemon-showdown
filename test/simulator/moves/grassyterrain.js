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
		battle.join('p1', 'Guest 1', 1, [{species: "Florges", ability: 'symbiosis', moves: ['mist', 'grassyterrain']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Florges", ability: 'symbiosis', moves: ['mist']}]);
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		assert.ok(battle.isTerrain('grassyterrain'));
		battle.commitDecisions();
		assert.ok(battle.isTerrain('grassyterrain'));
		battle.commitDecisions();
		assert.ok(battle.isTerrain('grassyterrain'));
		battle.commitDecisions();
		assert.ok(battle.isTerrain('grassyterrain'));
		battle.commitDecisions();
		assert.ok(battle.isTerrain(''));
	});

	it('should halve the base power of Earthquake, Bulldoze, Magnitude', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Shaymin", ability: 'naturalcure', moves: ['grassyterrain']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Shaymin-Sky", ability: 'serenegrace', moves: ['leechseed']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], Tools.getMove('earthquake'), 100, true), 50);
		assert.strictEqual(battle.runEvent('BasePower', battle.p1.active[0], battle.p2.active[0], Tools.getMove('earthquake'), 100, true), 50);
		assert.strictEqual(battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], Tools.getMove('bulldoze'), 60, true), 30);
		assert.strictEqual(battle.runEvent('BasePower', battle.p1.active[0], battle.p2.active[0], Tools.getMove('bulldoze'), 60, true), 30);
	});

	it('should increase the base power of Grass-type attacks used by grounded Pokemon', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Shaymin", ability: 'naturalcure', moves: ['grassyterrain']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Shaymin-Sky", ability: 'serenegrace', moves: ['leechseed']}]);
		battle.commitDecisions();
		let basePower;
		let move = Tools.getMove('gigadrain');
		basePower = battle.runEvent('BasePower', battle.p1.active[0], battle.p2.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, battle.modify(move.basePower, 1.5));
		basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
	});

	it('should heal grounded Pokemon by 1/16 of their max HP', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Shaymin", ability: 'naturalcure', moves: ['grassyterrain', 'dragonrage']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Magneton", ability: 'magnetpull', moves: ['magnetrise', 'dragonrage']}]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp - 40 + Math.floor(battle.p1.active[0].maxhp / 16));
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp - 40);
	});

	it('should not affect Pokemon in a semi-invulnerable state', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'owntempo', moves: ['dragonrage', 'skydrop']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Sableye", ability: 'prankster', moves: ['dragonrage', 'grassyterrain']}]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp - 40);
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp - 40);
	});

	it('should cause Nature Power to become Energy Ball', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Whimsicott", ability: 'prankster', moves: ['grassyterrain']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Shuckle", ability: 'sturdy', moves: ['naturepower']}]);
		battle.commitDecisions();
		let resultMove = toId(battle.log[battle.lastMoveLine].split('|')[3]);
		assert.strictEqual(resultMove, 'energyball');
	});
});
