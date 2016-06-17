'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Electric Terrain', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should change the current terrain to Electric Terrain for five turns', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Florges", ability: 'symbiosis', moves: ['mist', 'electricterrain']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Florges", ability: 'symbiosis', moves: ['mist']}]);
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		assert.ok(battle.isTerrain('electricterrain'));
		battle.commitDecisions();
		assert.ok(battle.isTerrain('electricterrain'));
		battle.commitDecisions();
		assert.ok(battle.isTerrain('electricterrain'));
		battle.commitDecisions();
		assert.ok(battle.isTerrain('electricterrain'));
		battle.commitDecisions();
		assert.ok(battle.isTerrain(''));
	});

	it('should increase the base power of Electric-type attacks used by grounded Pokemon', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Jolteon", ability: 'voltabsorb', moves: ['electricterrain']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Thundurus", ability: 'defiant', moves: ['thunderwave']}]);
		battle.commitDecisions();
		let basePower;
		let move = Tools.getMove('thunderbolt');
		basePower = battle.runEvent('BasePower', battle.p1.active[0], battle.p2.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, battle.modify(move.basePower, 1.5));
		basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
	});

	it('should prevent moves from putting grounded Pokemon to sleep', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Jolteon", ability: 'voltabsorb', moves: ['electricterrain', 'spore']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Abra", ability: 'magicguard', moves: ['telekinesis', 'spore']}]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		assert.strictEqual(battle.p1.active[0].status, 'slp');
		assert.strictEqual(battle.p2.active[0].status, '');
	});

	it('should not remove active non-volatile statuses from grounded Pokemon', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Jolteon", ability: 'voltabsorb', moves: ['sleeptalk', 'electricterrain']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Whimsicott", ability: 'prankster', moves: ['spore']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].status, 'slp');
	});

	it('should prevent Yawn from putting grounded Pokemon to sleep, and cause Yawn to fail', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Jolteon", ability: 'voltabsorb', moves: ['electricterrain', 'yawn']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Sableye", ability: 'prankster', moves: ['yawn']}]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].status, '');
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-fail|'));
	});

	it('should cause Rest to fail on grounded Pokemon', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Jolteon", ability: 'shellarmor', moves: ['electricterrain', 'rest']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Pidgeot", ability: 'keeneye', moves: ['doubleedge', 'rest']}]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not affect Pokemon in a semi-invulnerable state', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'owntempo', moves: ['yawn', 'skydrop']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Sableye", ability: 'prankster', moves: ['yawn', 'electricterrain']}]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		assert.strictEqual(battle.p1.active[0].status, 'slp');
		assert.strictEqual(battle.p2.active[0].status, 'slp');
	});

	it('should cause Nature Power to become Thunderbolt', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Jolteon", ability: 'voltabsorb', moves: ['electricterrain']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Shuckle", ability: 'sturdy', moves: ['naturepower']}]);
		battle.commitDecisions();
		let resultMove = toId(battle.log[battle.lastMoveLine].split('|')[3]);
		assert.strictEqual(resultMove, 'thunderbolt');
	});
});
