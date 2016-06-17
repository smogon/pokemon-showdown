'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Misty Terrain', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should change the current terrain to Misty Terrain for five turns', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Florges", ability: 'symbiosis', moves: ['mist', 'mistyterrain']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Florges", ability: 'symbiosis', moves: ['mist']}]);
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		assert.ok(battle.isTerrain('mistyterrain'));
		battle.commitDecisions();
		assert.ok(battle.isTerrain('mistyterrain'));
		battle.commitDecisions();
		assert.ok(battle.isTerrain('mistyterrain'));
		battle.commitDecisions();
		assert.ok(battle.isTerrain('mistyterrain'));
		battle.commitDecisions();
		assert.ok(battle.isTerrain(''));
	});

	it('should halve the base power of Dragon-type attacks on grounded Pokemon', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Shaymin", ability: 'naturalcure', moves: ['mistyterrain']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Shaymin-Sky", ability: 'serenegrace', moves: ['leechseed']}]);
		battle.commitDecisions();
		let basePower;
		let move = Tools.getMove('dragonpulse');
		basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, battle.modify(move.basePower, 0.5));
		basePower = battle.runEvent('BasePower', battle.p1.active[0], battle.p2.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
	});

	it('should prevent moves from setting non-volatile status on grounded Pokemon', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Florges", ability: 'symbiosis', moves: ['mistyterrain', 'toxic']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Machamp", ability: 'noguard', item: 'airballoon', moves: ['bulkup', 'toxic']}]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		assert.strictEqual(battle.p1.active[0].status, '');
		assert.strictEqual(battle.p2.active[0].status, 'tox');
	});

	it('should not remove active non-volatile statuses from grounded Pokemon', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Florges", ability: 'symbiosis', moves: ['mistyterrain']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Crobat", ability: 'infiltrator', moves: ['toxic']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].status, 'tox');
	});

	it('should prevent Yawn from putting grounded Pokemon to sleep, but not cause Yawn to fail', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Florges", ability: 'symbiosis', moves: ['mistyterrain', 'yawn']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Sableye", ability: 'prankster', moves: ['yawn']}]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].status, '');
		let dataLine = battle.log[battle.lastMoveLine + 1].split('|');
		assert.strictEqual(dataLine[1], '-start');
		assert.ok(toId(dataLine[3]).endsWith('yawn'));
	});

	it('should cause Rest to fail on grounded Pokemon', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Florges", ability: 'symbiosis', moves: ['mistyterrain', 'rest']}]);
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
		battle.join('p2', 'Guest 2', 1, [{species: "Sableye", ability: 'prankster', moves: ['yawn', 'mistyterrain']}]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		assert.strictEqual(battle.p1.active[0].status, 'slp');
		assert.strictEqual(battle.p2.active[0].status, 'slp');
	});

	it('should cause Nature Power to become Moonblast', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Whimsicott", ability: 'prankster', moves: ['mistyterrain']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Shuckle", ability: 'sturdy', moves: ['naturepower']}]);
		battle.commitDecisions();
		let resultMove = toId(battle.log[battle.lastMoveLine].split('|')[3]);
		assert.strictEqual(resultMove, 'moonblast');
	});
});
