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
		battle.setPlayer('p1', {team: [{species: "Florges", ability: 'symbiosis', moves: ['mist', 'mistyterrain']}]});
		battle.setPlayer('p2', {team: [{species: "Florges", ability: 'symbiosis', moves: ['mist']}]});
		battle.makeChoices('move mistyterrain', 'move mist');
		assert(battle.field.isTerrain('mistyterrain'));
		battle.makeChoices('move mist', 'move mist');
		assert(battle.field.isTerrain('mistyterrain'));
		battle.makeChoices('move mist', 'move mist');
		assert(battle.field.isTerrain('mistyterrain'));
		battle.makeChoices('move mist', 'move mist');
		assert(battle.field.isTerrain('mistyterrain'));
		battle.makeChoices('move mist', 'move mist');
		assert(battle.field.isTerrain(''));
	});

	it('should halve the base power of Dragon-type attacks on grounded Pokemon', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Shaymin", ability: 'naturalcure', moves: ['mistyterrain']}]});
		battle.setPlayer('p2', {team: [{species: "Shaymin-Sky", ability: 'serenegrace', moves: ['leechseed']}]});
		battle.makeChoices('move mistyterrain', 'move leechseed');
		let basePower;
		const move = Dex.getMove('dragonpulse');
		basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.equal(basePower, battle.modify(move.basePower, 0.5));
		basePower = battle.runEvent('BasePower', battle.p1.active[0], battle.p2.active[0], move, move.basePower, true);
		assert.equal(basePower, move.basePower);
	});

	it('should prevent moves from setting non-volatile status on grounded Pokemon', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Florges", ability: 'symbiosis', moves: ['mistyterrain', 'toxic']}]});
		battle.setPlayer('p2', {team: [{species: "Machamp", ability: 'noguard', item: 'airballoon', moves: ['bulkup', 'toxic']}]});
		battle.makeChoices('move mistyterrain', 'move bulkup');
		battle.makeChoices('move toxic', 'move toxic');
		assert.equal(battle.p1.active[0].status, '');
		assert.equal(battle.p2.active[0].status, 'tox');
	});

	it('should not remove active non-volatile statuses from grounded Pokemon', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Florges", ability: 'symbiosis', moves: ['mistyterrain']}]});
		battle.setPlayer('p2', {team: [{species: "Crobat", ability: 'infiltrator', moves: ['toxic']}]});
		battle.makeChoices('move mistyterrain', 'move toxic');
		assert.equal(battle.p1.active[0].status, 'tox');
	});

	it('should prevent Yawn from putting grounded Pokemon to sleep, but not cause Yawn to fail', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Florges", ability: 'symbiosis', moves: ['mistyterrain', 'yawn']}]});
		battle.setPlayer('p2', {team: [{species: "Sableye", ability: 'prankster', moves: ['yawn']}]});
		battle.makeChoices('move mistyterrain', 'move yawn');
		battle.makeChoices('move yawn', 'move yawn');
		assert.equal(battle.p1.active[0].status, '');
		const dataLine = battle.log[battle.lastMoveLine + 1].split('|');
		assert.equal(dataLine[1], '-start');
		assert(toID(dataLine[3]).endsWith('yawn'));
	});

	it('should cause Rest to fail on grounded Pokemon', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Florges", ability: 'symbiosis', moves: ['mistyterrain', 'rest']}]});
		battle.setPlayer('p2', {team: [{species: "Pidgeot", ability: 'keeneye', moves: ['doubleedge', 'rest']}]});
		battle.makeChoices('move mistyterrain', 'move doubleedge');
		battle.makeChoices('move rest', 'move rest');
		assert.notEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not affect Pokemon in a semi-invulnerable state', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Smeargle", ability: 'owntempo', moves: ['yawn', 'skydrop']}]});
		battle.setPlayer('p2', {team: [{species: "Sableye", ability: 'prankster', moves: ['yawn', 'mistyterrain']}]});
		battle.makeChoices('move yawn', 'move yawn');
		battle.makeChoices('move skydrop', 'move mistyterrain');
		assert.equal(battle.p1.active[0].status, 'slp');
		assert.equal(battle.p2.active[0].status, 'slp');
	});

	it('should cause Nature Power to become Moonblast', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Whimsicott", ability: 'prankster', moves: ['mistyterrain']}]});
		battle.setPlayer('p2', {team: [{species: "Shuckle", ability: 'sturdy', moves: ['naturepower']}]});
		battle.makeChoices('move mistyterrain', 'move naturepower');
		const resultMove = toID(battle.log[battle.lastMoveLine].split('|')[3]);
		assert.equal(resultMove, 'moonblast');
	});
});
