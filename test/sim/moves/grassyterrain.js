'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Grassy Terrain', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should change the current terrain to Grassy Terrain for five turns`, function () {
		battle = common.createBattle([[
			{species: 'Florges', moves: ['grassyterrain', 'sleeptalk']},
		], [
			{species: 'Wynaut', moves: ['sleeptalk']},
		]]);
		for (let i = 0; i < 4; i++) {
			battle.makeChoices();
			assert(battle.field.isTerrain('grassyterrain'));
		}
		battle.makeChoices('move sleeptalk', 'move sleeptalk');
		assert(battle.field.isTerrain(''));
	});

	it(`should halve the base power of Earthquake, Bulldoze, and Magnitude against grounded targets`, function () {
		battle = common.createBattle([[
			{species: 'Shaymin', moves: ['grassyterrain']},
		], [
			{species: 'Aerodactyl', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		const shaymin = battle.p1.active[0];
		const aerodactyl = battle.p2.active[0];
		assert.equal(battle.runEvent('BasePower', aerodactyl, shaymin, Dex.moves.get('earthquake'), 100, true), 50);
		assert.equal(battle.runEvent('BasePower', shaymin, aerodactyl, Dex.moves.get('earthquake'), 100, true), 100);
		assert.equal(battle.runEvent('BasePower', aerodactyl, shaymin, Dex.moves.get('bulldoze'), 60, true), 30);
		assert.equal(battle.runEvent('BasePower', shaymin, aerodactyl, Dex.moves.get('bulldoze'), 60, true), 60);
	});

	it(`should increase the base power of Grass-type attacks used by grounded Pokemon`, function () {
		battle = common.gen(7).createBattle([[
			{species: 'Shaymin', moves: ['grassyterrain']},
		], [
			{species: 'Aerodactyl', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		let basePower;
		const move = Dex.moves.get('gigadrain');
		const shaymin = battle.p1.active[0];
		const aerodactyl = battle.p2.active[0];
		basePower = battle.runEvent('BasePower', shaymin, aerodactyl, move, move.basePower, true);
		assert.equal(basePower, battle.modify(move.basePower, 1.5));
		basePower = battle.runEvent('BasePower', aerodactyl, shaymin, move, move.basePower, true);
		assert.equal(basePower, move.basePower);
	});

	it(`should heal grounded Pokemon by 1/16 of their max HP`, function () {
		battle = common.createBattle([[
			{species: 'Shaymin', moves: ['grassyterrain', 'seismictoss']},
		], [
			{species: 'Wynaut', moves: ['magnetrise', 'seismictoss']},
		]]);
		battle.makeChoices('move grassyterrain', 'move magnetrise');
		battle.makeChoices('move seismictoss', 'move seismictoss');
		const shaymin = battle.p1.active[0];
		const wynaut = battle.p2.active[0];
		assert.equal(shaymin.hp, shaymin.maxhp - 100 + Math.floor(shaymin.maxhp / 16));
		assert.equal(wynaut.hp, wynaut.maxhp - 100);
	});

	it(`should not affect Pokemon in a semi-invulnerable state`, function () {
		battle = common.createBattle([[
			{species: 'Shaymin', moves: ['grassyterrain', 'seismictoss']},
		], [
			{species: 'Wynaut', moves: ['skydrop', 'seismictoss']},
		]]);
		battle.makeChoices('move seismictoss', 'move seismictoss');
		battle.makeChoices('move grassyterrain', 'move skydrop');
		const shaymin = battle.p1.active[0];
		const wynaut = battle.p2.active[0];
		assert.equal(shaymin.hp, shaymin.maxhp - 100);
		assert.equal(wynaut.hp, wynaut.maxhp - 100);
	});

	it(`should cause Nature Power to become Energy Ball`, function () {
		battle = common.createBattle([[
			{species: 'Shaymin', moves: ['grassyterrain']},
		], [
			{species: 'Wynaut', moves: ['naturepower']},
		]]);
		battle.makeChoices();
		const resultMove = toID(battle.log[battle.lastMoveLine].split('|')[3]);
		assert.equal(resultMove, 'energyball');
	});

	it(`should heal by Speed order in the same block as Leftovers`, function () {
		battle = common.createBattle([[
			{species: 'rillaboom', ability: 'grassysurge', item: 'leftovers', moves: ['seismictoss']},
		], [
			{species: 'alakazam', item: 'focussash', moves: ['seismictoss']},
		]]);

		battle.makeChoices();
		const log = battle.getDebugLog();
		const zamGrassyIndex = log.indexOf('|-heal|p2a: Alakazam|166/251|[from] Grassy Terrain');
		const rillaGrassyIndex = log.indexOf('|-heal|p1a: Rillaboom|262/341|[from] Grassy Terrain');
		const rillaLeftoversIndex = log.indexOf('|-heal|p1a: Rillaboom|283/341|[from] item: Leftovers');
		assert(zamGrassyIndex < rillaGrassyIndex, 'Alakazam should heal from Grassy Terrain before Rillaboom');
		assert(rillaGrassyIndex < rillaLeftoversIndex, 'Rillaboom should heal from Grassy Terrain before Leftovers');
	});

	it(`should only decrement turn count when being set before it would decrement in the end-of-turn effects`, function () {
		battle = common.createBattle([[
			{species: 'grookey', ability: 'grassysurge', moves: ['sleeptalk']},
		], [
			{species: 'shedinja', ability: 'neutralizinggas', item: 'stickybarb', moves: ['sleeptalk']},
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);

		battle.makeChoices(); // KO Neutralizing Gas
		battle.makeChoices(); // Switch

		// Kill turns with Wynaut and Grookey until turn 5
		for (let i = 0; i < 4; i++) {
			battle.makeChoices();
		}

		assert(battle.field.isTerrain('grassyterrain'), `Grassy Terrain should still be active turn 5, ending turn 6.`);
	});

	it.skip(`should not skip healing Pokemon if it was set during the block it would heal Pokemon`, function () {
		battle = common.createBattle([[
			{species: 'coalossal', ability: 'grassysurge', moves: ['sleeptalk', 'rockthrow']},
		], [
			{species: 'shedinja', ability: 'neutralizinggas', item: 'focussash', moves: ['dragonrage']},
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move rockthrow dynamax', 'auto');
		const coalossal = battle.p1.active[0];
		assert.equal(coalossal.hp, coalossal.maxhp - 40 + Math.floor(coalossal.maxhp / 2 / 16), `Coalossal should have recovered HP from Grassy Terrain.`);
		battle.makeChoices();
		// Kill turns with Wynaut and Coalossal
		for (let i = 0; i < 4; i++) {
			battle.makeChoices();
		}
		assert.false(battle.field.isTerrain('grassyterrain'), `Grassy Terrain should have ended turn 5.`);
	});
});
