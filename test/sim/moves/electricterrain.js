'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Electric Terrain', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should change the current terrain to Electric Terrain for five turns', () => {
		battle = common.createBattle([[
			{ species: "Florges", ability: 'symbiosis', moves: ['mist', 'electricterrain'] },
		], [
			{ species: "Florges", ability: 'symbiosis', moves: ['mist'] },
		]]);
		battle.makeChoices('move electricterrain', 'move mist');
		assert(battle.field.isTerrain('electricterrain'));
		battle.makeChoices('move electricterrain', 'move mist');
		assert(battle.field.isTerrain('electricterrain'));
		battle.makeChoices('move electricterrain', 'move mist');
		assert(battle.field.isTerrain('electricterrain'));
		battle.makeChoices('move electricterrain', 'move mist');
		assert(battle.field.isTerrain('electricterrain'));
		battle.makeChoices('move electricterrain', 'move mist');
		assert(battle.field.isTerrain(''));
	});

	it('should increase the base power of Electric-type attacks used by grounded Pokemon', () => {
		battle = common.gen(7).createBattle([[
			{ species: "Jolteon", ability: 'voltabsorb', moves: ['electricterrain'] },
		], [
			{ species: "Thundurus", ability: 'defiant', moves: ['thunderwave'] },
		]]);
		battle.makeChoices('move electricterrain', 'move thunderwave');
		let basePower;
		const move = Dex.moves.get('thunderbolt');
		basePower = battle.runEvent('BasePower', battle.p1.active[0], battle.p2.active[0], move, move.basePower, true);
		assert.equal(basePower, battle.modify(move.basePower, 1.5));
		basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.equal(basePower, move.basePower);
	});

	it('should prevent moves from putting grounded Pokemon to sleep', () => {
		battle = common.createBattle([[
			{ species: "Jolteon", ability: 'voltabsorb', moves: ['electricterrain', 'spore'] },
		], [
			{ species: "Abra", ability: 'magicguard', moves: ['telekinesis', 'spore'] },
		]]);
		battle.makeChoices('move electricterrain', 'move telekinesis');
		battle.makeChoices('move spore', 'move spore');
		assert.equal(battle.p1.active[0].status, 'slp');
		assert.equal(battle.p2.active[0].status, '');
	});

	it('should not remove active non-volatile statuses from grounded Pokemon', () => {
		battle = common.createBattle([[
			{ species: "Jolteon", ability: 'voltabsorb', moves: ['sleeptalk', 'electricterrain'] },
		], [
			{ species: "Whimsicott", ability: 'prankster', moves: ['spore'] },
		]]);
		battle.makeChoices('move sleeptalk', 'move spore');
		assert.equal(battle.p1.active[0].status, 'slp');
	});

	it('should prevent Yawn from putting grounded Pokemon to sleep, and cause Yawn to fail', () => {
		battle = common.createBattle([[
			{ species: "Jolteon", ability: 'voltabsorb', moves: ['electricterrain', 'yawn'] },
		], [
			{ species: "Sableye", ability: 'prankster', moves: ['yawn'] },
		]]);
		battle.makeChoices('move electricterrain', 'move yawn');
		battle.makeChoices('move yawn', 'move yawn');
		assert.equal(battle.p1.active[0].status, '');
		assert(!battle.p2.active[0].volatiles['yawn']);
	});

	it('should cause Rest to fail on grounded Pokemon', () => {
		battle = common.createBattle([[
			{ species: "Jolteon", ability: 'shellarmor', moves: ['electricterrain', 'rest'] },
		], [
			{ species: "Pidgeot", ability: 'keeneye', moves: ['doubleedge', 'rest'] },
		]]);
		battle.makeChoices('move electricterrain', 'move doubleedge');
		battle.makeChoices('move rest', 'move rest');
		assert.notEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not affect Pokemon in a semi-invulnerable state', () => {
		battle = common.createBattle([[
			{ species: "Smeargle", ability: 'owntempo', moves: ['yawn', 'skydrop'] },
		], [
			{ species: "Sableye", ability: 'prankster', moves: ['yawn', 'electricterrain'] },
		]]);
		battle.makeChoices('move yawn', 'move yawn');
		battle.makeChoices('move skydrop', 'move electricterrain');
		assert.equal(battle.p1.active[0].status, 'slp');
		assert.equal(battle.p2.active[0].status, 'slp');
	});

	it('should cause Nature Power to become Thunderbolt', () => {
		battle = common.createBattle([[
			{ species: "Jolteon", ability: 'voltabsorb', moves: ['electricterrain'] },
		], [
			{ species: "Shuckle", ability: 'sturdy', moves: ['naturepower'] },
		]]);
		battle.makeChoices('move electricterrain', 'move naturepower');
		const resultMove = toID(battle.log[battle.lastMoveLine].split('|')[3]);
		assert.equal(resultMove, 'thunderbolt');
	});

	it.skip(`should block Sleep before the move would have missed`, () => {
		battle = common.createBattle([[
			{ species: 'tapukoko', moves: ['electricterrain'] },
		], [
			{ species: 'venusaur', moves: ['sleeppowder'] },
		]]);
		// Modding accuracy so Sleep Powder always misses
		battle.onEvent('Accuracy', battle.format, false);
		battle.makeChoices();
		assert(battle.log.some(line => line.includes('|-activate|p1a: Tapu Koko|move: Electric Terrain')));
	});
});
