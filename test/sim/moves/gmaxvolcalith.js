'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('G-Max Volcalith', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should not damage Rock-types`, function () {
		battle = common.gen(8).createBattle({gameType: 'doubles'}, [[
			{species: 'Coalossal', moves: ['rockthrow'], gigantamax: true},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Blastoise', moves: ['sleeptalk']},
			{species: 'Boldore', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move rockthrow 1 dynamax, move sleeptalk', 'move sleeptalk, move sleeptalk');
		assert.fullHP(battle.p2.active[1]);
	});

	it(`should deal damage for four turns, including the fourth turn`, function () {
		battle = common.gen(8).createBattle({gameType: 'doubles'}, [[
			{species: 'Coalossal', moves: ['sleeptalk', 'rockthrow'], gigantamax: true},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Blastoise', moves: ['sleeptalk']},
			{species: 'Boldore', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move rockthrow 2 dynamax, move sleeptalk', 'move sleeptalk, move sleeptalk');
		for (let i = 0; i < 3; i++) { battle.makeChoices(); }

		const blastoise = battle.p2.active[0];
		assert.equal(blastoise.hp, blastoise.maxhp - (Math.floor(blastoise.maxhp / 6) * 4));
	});

	it.skip(`should deal damage alongside Sea of Fire or G-Max Wildfire in the order those field effects were set`, function () {
		battle = common.gen(8).createBattle({gameType: 'doubles'}, [[
			{species: 'Coalossal', item: 'Eject Button', moves: ['rockthrow', 'sleeptalk'], gigantamax: true},
			{species: 'Wynaut', moves: ['sleeptalk', 'grasspledge']},
			{species: 'Wynaut', moves: ['sleeptalk', 'firepledge']},
		], [
			{species: 'Blissey', moves: ['sleeptalk']},
			{species: 'Chansey', moves: ['sleeptalk']},
		]]);

		// Set up Volcalith first, then Sea of Fire
		battle.makeChoices('move rockthrow 1 dynamax, move grasspledge -1', 'auto');
		battle.makeChoices('switch 3');
		battle.makeChoices('move firepledge 1, move grasspledge 1', 'auto');

		const log = battle.getDebugLog();
		const pledgeDamageIndex = log.lastIndexOf('|[from] Fire Pledge');
		const volcalithDamageIndex = log.lastIndexOf('|[from] G-Max Volcalith');
		assert(volcalithDamageIndex < pledgeDamageIndex, 'G-Max Volcalith should damage before Sea of Fire, because Volcalith was set up first.');
	});

	it(`should damage Pokemon in order of Speed`, function () {
		battle = common.gen(8).createBattle({gameType: 'doubles'}, [[
			{species: 'Coalossal', moves: ['sleeptalk', 'rockthrow'], gigantamax: true},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Coalossal', moves: ['sleeptalk', 'rockthrow'], gigantamax: true},
			{species: 'Mewtwo', moves: ['sleeptalk', 'trickroom']},
		]]);

		battle.makeChoices('move rockthrow 1 dynamax, move sleeptalk', 'move rockthrow 1 dynamax, move sleeptalk');
		battle.makeChoices('auto', 'move sleeptalk, move trickroom');

		const log = battle.getDebugLog();
		const mewtwoDamagedIndex = log.indexOf('|-damage|p1b: Wynaut');
		const wynautDamagedIndex = log.indexOf('|-damage|p2b: Mewtwo');
		assert(wynautDamagedIndex < mewtwoDamagedIndex, 'Mewtwo should be damaged before Wynaut in normal circumstances.');

		const mewtwoDamagedTRIndex = log.lastIndexOf('|-damage|p1b: Wynaut');
		const wynautDamagedTRIndex = log.lastIndexOf('|-damage|p2b: Mewtwo');
		assert(mewtwoDamagedTRIndex < wynautDamagedTRIndex, 'Wynaut should be damaged before Mewtwo in Trick Room.');
	});

	it(`should deal damage before Black Sludge recovery/damage`, function () {
		battle = common.gen(8).createBattle({gameType: 'doubles'}, [[
			{species: 'Coalossal', moves: ['sleeptalk', 'rockthrow'], gigantamax: true},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Toxicroak', item: 'blacksludge', moves: ['sleeptalk']},
			{species: 'Boldore', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move rockthrow 2 dynamax, move sleeptalk', 'move sleeptalk, move sleeptalk');
		const toxicroak = battle.p2.active[0];
		assert.equal(toxicroak.hp, toxicroak.maxhp - Math.floor(toxicroak.maxhp / 6) + Math.floor(toxicroak.maxhp / 16));
	});

	it(`should deal damage before Grassy Terrain recovery`, function () {
		battle = common.gen(8).createBattle({gameType: 'doubles'}, [[
			{species: 'Coalossal', moves: ['sleeptalk', 'rockthrow'], gigantamax: true},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Rillaboom', ability: 'grassysurge', moves: ['sleeptalk']},
			{species: 'Boldore', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move rockthrow 2 dynamax, move sleeptalk', 'move sleeptalk, move sleeptalk');
		const rillaboom = battle.p2.active[0];
		assert.equal(rillaboom.hp, rillaboom.maxhp - Math.floor(rillaboom.maxhp / 6) + Math.floor(rillaboom.maxhp / 16));
	});
});
