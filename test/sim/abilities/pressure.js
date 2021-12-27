'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Pressure`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should deduct 1 extra PP from opposing Pokemon moves targeting the user`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Giratina', ability: 'pressure', moves: ['sleeptalk']},
			{species: 'Togepi', moves: ['peck']},
		], [
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Ho-Oh', moves: ['peck']},
		]]);
		battle.makeChoices('move sleeptalk, move peck -1', 'move sleeptalk, move peck 1');
		const togepi = battle.p1.active[1];
		const hooh = battle.p2.active[1];
		const move = Dex.moves.get('peck');
		assert.equal(togepi.getMoveData(move).pp, togepi.getMoveData(move).maxpp - 1);
		assert.equal(hooh.getMoveData(move).pp, hooh.getMoveData(move).maxpp - 2);
	});

	it(`should deduct 1 extra PP if moves are redirected to the user`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Giratina', ability: 'pressure', moves: ['followme']},
			{species: 'Togepi', moves: ['peck']},
		], [
			{species: 'Clefable', moves: ['followme']},
			{species: 'Ho-Oh', ability: 'pressure', moves: ['peck']},
		]]);
		battle.makeChoices('move followme, move peck 2', 'move followme, move peck 2');
		const togepi = battle.p1.active[1];
		const hooh = battle.p2.active[1];
		const move = Dex.moves.get('peck');
		assert.equal(togepi.getMoveData(move).pp, togepi.getMoveData(move).maxpp - 1);
		assert.equal(hooh.getMoveData(move).pp, hooh.getMoveData(move).maxpp - 2);
	});

	it(`should deduct PP even if the move fails or misses`, function () {
		battle = common.createBattle([[
			{species: 'Dusknoir', ability: 'pressure', moves: ['mistyterrain', 'shadowforce']},
		], [
			{species: 'Smeargle', ability: 'desolateland', moves: ['doubleedge', 'spore', 'moonblast', 'surf']},
		]]);

		const smeargle = battle.p2.active[0];
		battle.makeChoices();
		let move = smeargle.getMoveData(Dex.moves.get('doubleedge'));
		assert.equal(move.pp, move.maxpp - 2, `Double-Edge should lose 1 additional PP from Pressure`);

		battle.makeChoices('move shadowforce', 'move spore');
		move = smeargle.getMoveData(Dex.moves.get('spore'));
		assert.equal(move.pp, move.maxpp - 2, `Spore should lose 1 additional PP from Pressure`);

		battle.makeChoices('auto', 'move moonblast');
		move = smeargle.getMoveData(Dex.moves.get('moonblast'));
		assert.equal(move.pp, move.maxpp - 2, `Moonblast should lose 1 additional PP from Pressure`);

		battle.makeChoices('auto', 'move surf');
		move = smeargle.getMoveData(Dex.moves.get('surf'));
		assert.equal(move.pp, move.maxpp - 2, `Surf should lose 1 additional PP from Pressure`);
	});

	it(`should deduct PP for each Pressure Pokemon targeted`, function () {
		battle = common.gen(5).createBattle({gameType: 'triples'}, [[
			{species: 'Giratina', ability: 'pressure', moves: ['rest']},
			{species: 'Palkia', ability: 'pressure', moves: ['rest']},
			{species: 'Dialga', ability: 'pressure', moves: ['rest']},
		], [
			{species: 'Kyurem', ability: 'pressure', moves: ['hail']},
			{species: 'Zekrom', ability: 'teravolt', moves: ['spikes']},
			{species: 'Reshiram', ability: 'turboblaze', moves: ['rockslide']},
		]]);
		battle.makeChoices();
		let move = battle.p2.active[0].getMoveData(Dex.moves.get('hail'));
		assert.equal(move.pp, move.maxpp - 4, `Hail should lose 3 additional PP from Pressure`);
		move = battle.p2.active[1].getMoveData(Dex.moves.get('spikes'));
		assert.equal(move.pp, move.maxpp - 4, `Spikes should lose 3 additional PP from Pressure`);
		move = battle.p2.active[2].getMoveData(Dex.moves.get('rockslide'));
		assert.equal(move.pp, move.maxpp - 3, `Rock Slide should lose 2 additional PP from Pressure`);
	});

	it(`should deduct PP for each opposing Pressure Pokemon when Snatch or Imprison are used`, function () {
		battle = common.gen(5).createBattle({gameType: 'triples'}, [[
			{species: 'Giratina', ability: 'pressure', moves: ['rest']},
			{species: 'Palkia', ability: 'pressure', moves: ['rest']},
			{species: 'Dialga', ability: 'pressure', moves: ['rest']},
		], [
			{species: 'Kyurem', ability: 'pressure', moves: ['snatch']},
			{species: 'Zekrom', ability: 'teravolt', moves: ['imprison']},
			{species: 'Reshiram', ability: 'turboblaze', moves: ['rest']},
		]]);

		battle.makeChoices();
		let move = battle.p2.active[0].getMoveData(Dex.moves.get('snatch'));
		assert.equal(move.pp, move.maxpp - 4, `Snatch should lose 3 additional PP from Pressure`);
		move = battle.p2.active[1].getMoveData(Dex.moves.get('imprison'));
		assert.equal(move.pp, move.maxpp - 4, `Imprison should lose 3 additional PP from Pressure`);
	});

	it(`should deduct additional PP from Max Moves`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['darkpulse']},
		], [
			{species: 'absol', ability: 'pressure', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move darkpulse dynamax', 'auto');
		const move = battle.p1.active[0].getMoveData(Dex.moves.get('darkpulse'));
		assert.equal(move.pp, move.maxpp - 2);
	});

	it(`should deduct additional PP from Z-Moves`, function () {
		battle = common.gen(7).createBattle([[
			{species: 'wynaut', item: 'darkiniumz', moves: ['darkpulse']},
		], [
			{species: 'absol', ability: 'pressure', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move darkpulse zmove', 'auto');
		const move = battle.p1.active[0].getMoveData(Dex.moves.get('darkpulse'));
		assert.equal(move.pp, move.maxpp - 2);
	});

	it(`should deduct additional PP from submoves that target Pressure`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['assist']},
			{species: 'yveltal', moves: ['darkpulse']},
		], [
			{species: 'absol', ability: 'pressure', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		const move = battle.p1.active[0].getMoveData(Dex.moves.get('assist'));
		assert.equal(move.pp, move.maxpp - 2);
	});

	it(`should not deduct additional PP from Sticky Web (only entry hazard to do so)`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['stickyweb', 'stealthrock']},
		], [
			{species: 'absol', ability: 'pressure', moves: ['sleeptalk']},
		]]);
		const wynaut = battle.p1.active[0];
		battle.makeChoices('move stickyweb', 'auto');
		let move = wynaut.getMoveData(Dex.moves.get('stickyweb'));
		assert.equal(move.pp, move.maxpp - 1);

		battle.makeChoices('move stealthrock', 'auto');
		move = wynaut.getMoveData(Dex.moves.get('stealthrock'));
		assert.equal(move.pp, move.maxpp - 2);
	});
	it(`should not deduct additional PP from moves reflected by Magic Coat`, function () {
		battle = common.createBattle([[
			{species: 'reuniclus', moves: ['magiccoat', 'confuseray']},
		], [
			{species: 'dusclops', ability: 'pressure', moves: ['confuseray']},
		]]);
		battle.makeChoices();
		// Reuniclus
		let move = battle.p1.active[0].getMoveData(Dex.moves.get('magiccoat'));
		assert.equal(move.pp, move.maxpp - 1);
		move = battle.p1.active[0].getMoveData(Dex.moves.get('confuseray'));
		assert.equal(move.pp, move.maxpp);
		// Dusclops
		move = battle.p2.active[0].getMoveData(Dex.moves.get('confuseray'));
		assert.equal(move.pp, move.maxpp - 1);
	});
});

describe('Pressure [Gen 4]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should deduct 1 extra PP from any moves targeting the user`, function () {
		battle = common.gen(4).createBattle({gameType: 'doubles'}, [[
			{species: 'Giratina', ability: 'pressure', moves: ['sleeptalk']},
			{species: 'Togepi', moves: ['peck']},
		], [
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Ho-Oh', moves: ['peck']},
		]]);
		battle.makeChoices('move sleeptalk, move peck -1', 'move sleeptalk, move peck 1');
		const togepi = battle.p1.active[1];
		const hooh = battle.p2.active[1];
		const move = Dex.moves.get('peck');
		assert.equal(togepi.getMoveData(move).pp, togepi.getMoveData(move).maxpp - 2);
		assert.equal(hooh.getMoveData(move).pp, hooh.getMoveData(move).maxpp - 2);
	});

	it(`should deduct 1 extra PP if moves are redirected to the user`, function () {
		battle = common.gen(4).createBattle({gameType: 'doubles'}, [[
			{species: 'Giratina', ability: 'pressure', moves: ['followme']},
			{species: 'Togepi', moves: ['peck']},
		], [
			{species: 'Clefable', moves: ['followme']},
			{species: 'Ho-Oh', ability: 'pressure', moves: ['peck']},
		]]);
		battle.makeChoices('move followme, move peck 2', 'move followme, move peck 2');
		const togepi = battle.p1.active[1];
		const hooh = battle.p2.active[1];
		const move = Dex.moves.get('peck');
		assert.equal(togepi.getMoveData(move).pp, togepi.getMoveData(move).maxpp - 1);
		assert.equal(hooh.getMoveData(move).pp, hooh.getMoveData(move).maxpp - 2);
	});

	it(`should deduct PP even if the move fails or misses`, function () {
		battle = common.gen(4).createBattle([[
			{species: 'Dusknoir', ability: 'pressure', moves: ['shadowforce']},
		], [
			{species: 'Smeargle', moves: ['doubleedge', 'dragonpulse']},
		]]);
		const smeargle = battle.p2.active[0];
		battle.makeChoices();
		let move = smeargle.getMoveData(Dex.moves.get('doubleedge'));
		assert.equal(move.pp, move.maxpp - 2, `Double-Edge should lose 1 additional PP from Pressure`);

		battle.makeChoices('auto', 'move dragonpulse');
		move = smeargle.getMoveData(Dex.moves.get('dragonpulse'));
		assert.equal(move.pp, move.maxpp - 2, `Dragon Pulse should lose 1 additional PP from Pressure`);
	});

	it(`should deduct PP for each Pressure Pokemon targeted`, function () {
		battle = common.gen(4).createBattle({gameType: 'doubles'}, [[
			{species: 'Palkia', ability: 'pressure', moves: ['rest']},
			{species: 'Dialga', ability: 'pressure', moves: ['rest']},
		], [
			{species: 'Lugia', ability: 'pressure', moves: ['hail']},
			{species: 'Ho-Oh', ability: 'pressure', moves: ['earthquake']},
		]]);
		battle.makeChoices();
		let move = battle.p2.active[0].getMoveData(Dex.moves.get('hail'));
		assert.equal(move.pp, move.maxpp - 4, `Hail should lose 3 additional PP from Pressure`);
		move = battle.p2.active[1].getMoveData(Dex.moves.get('earthquake'));
		assert.equal(move.pp, move.maxpp - 4, `Earthquake should lose 3 additional PP from Pressure`);
	});

	it(`should not deduct PP from self-targeting moves`, function () {
		battle = common.gen(4).createBattle([[
			{species: 'Palkia', ability: 'pressure', moves: ['calmmind']},
		], [
			{species: 'Dialga', ability: 'pressure', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		const move = battle.p1.active[0].getMoveData(Dex.moves.get('calmmind'));
		assert.equal(move.pp, move.maxpp - 1);
	});
});
