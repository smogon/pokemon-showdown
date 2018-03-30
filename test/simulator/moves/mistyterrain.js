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
		battle.makeChoices('move mistyterrain', 'move mist');
		assert.ok(battle.isTerrain('mistyterrain'));
		battle.makeChoices('move mist', 'move mist');
		assert.ok(battle.isTerrain('mistyterrain'));
		battle.makeChoices('move mist', 'move mist');
		assert.ok(battle.isTerrain('mistyterrain'));
		battle.makeChoices('move mist', 'move mist');
		assert.ok(battle.isTerrain('mistyterrain'));
		battle.makeChoices('move mist', 'move mist');
		assert.ok(battle.isTerrain(''));
	});

	it('should halve the base power of Dragon-type attacks on grounded Pokemon', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Shaymin", ability: 'naturalcure', moves: ['mistyterrain']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Shaymin-Sky", ability: 'serenegrace', moves: ['leechseed']}]);
		battle.makeChoices('move mistyterrain', 'move leechseed');
		let basePower;
		let move = Dex.getMove('dragonpulse');
		basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, battle.modify(move.basePower, 0.5));
		basePower = battle.runEvent('BasePower', battle.p1.active[0], battle.p2.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
	});

	it('should prevent moves from setting non-volatile status on grounded Pokemon', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Florges", ability: 'symbiosis', moves: ['mistyterrain', 'toxic']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Machamp", ability: 'noguard', item: 'airballoon', moves: ['bulkup', 'toxic']}]);
		battle.makeChoices('move mistyterrain', 'move bulkup');
		battle.makeChoices('move toxic', 'move toxic');
		assert.strictEqual(battle.p1.active[0].status, '');
		assert.strictEqual(battle.p2.active[0].status, 'tox');
	});

	it('should not remove active non-volatile statuses from grounded Pokemon', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Florges", ability: 'symbiosis', moves: ['mistyterrain']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Crobat", ability: 'infiltrator', moves: ['toxic']}]);
		battle.makeChoices('move mistyterrain', 'move toxic');
		assert.strictEqual(battle.p1.active[0].status, 'tox');
	});

	it('should prevent Yawn from putting grounded Pokemon to sleep, but not cause Yawn to fail', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Florges", ability: 'symbiosis', moves: ['mistyterrain', 'yawn']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Sableye", ability: 'prankster', moves: ['yawn']}]);
		battle.makeChoices('move mistyterrain', 'move yawn');
		battle.makeChoices('move yawn', 'move yawn');
		assert.strictEqual(battle.p1.active[0].status, '');
		let dataLine = battle.log[battle.lastMoveLine + 1].split('|');
		assert.strictEqual(dataLine[1], '-start');
		assert.ok(toId(dataLine[3]).endsWith('yawn'));
	});

	it('should cause Rest to fail on grounded Pokemon', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Florges", ability: 'symbiosis', moves: ['mistyterrain', 'rest']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Pidgeot", ability: 'keeneye', moves: ['doubleedge', 'rest']}]);
		battle.makeChoices('move mistyterrain', 'move doubleedge');
		battle.makeChoices('move rest', 'move rest');
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not affect Pokemon in a semi-invulnerable state', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'owntempo', moves: ['yawn', 'skydrop']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Sableye", ability: 'prankster', moves: ['yawn', 'mistyterrain']}]);
		battle.makeChoices('move yawn', 'move yawn');
		battle.makeChoices('move skydrop', 'move mistyterrain');
		assert.strictEqual(battle.p1.active[0].status, 'slp');
		assert.strictEqual(battle.p2.active[0].status, 'slp');
	});

	it('should cause Nature Power to become Moonblast', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Whimsicott", ability: 'prankster', moves: ['mistyterrain']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Shuckle", ability: 'sturdy', moves: ['naturepower']}]);
		battle.makeChoices('move mistyterrain', 'move naturepower');
		let resultMove = toId(battle.log[battle.lastMoveLine].split('|')[3]);
		assert.strictEqual(resultMove, 'moonblast');
	});
});
