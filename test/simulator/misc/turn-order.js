'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Mega Evolution', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should cause mega ability to affect the order of the turn in which it happens', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Banette', ability: 'frisk', item: 'banettite', moves: ['psychup']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Deoxys-Speed', ability: 'pressure', moves: ['calmmind']}]);
		const pranksterMega = battle.p1.active[0];
		battle.p1.chooseMove('psychup', null, true);
		battle.commitDecisions();
		assert.statStage(pranksterMega, 'spa', 0);
	});

	it('should cause base ability to not affect the order of the turn in which it happens', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Sableye', ability: 'prankster', item: 'sablenite', moves: ['psychup']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Deoxys-Speed', ability: 'pressure', moves: ['calmmind']}]);
		const noPranksterMega = battle.p1.active[0];
		battle.p1.chooseMove('psychup', null, true);
		battle.commitDecisions();
		assert.statStage(noPranksterMega, 'spa', 1);
	});

	it('should cause mega forme speed to decide turn order', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Beedrill', ability: 'swarm', item: 'beedrillite', moves: ['xscissor']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Hoopa-Unbound', ability: 'magician', moves: ['psyshock']}]);
		const fastBase = battle.p2.active[0];
		battle.p1.chooseMove('xscissor', null, true);
		battle.commitDecisions();
		assert.fainted(fastBase);
	});
});

describe('Mega Evolution [Gen 6]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not cause mega ability to affect the order of the turn in which it happens', function () {
		battle = common.gen(6).createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Banette', ability: 'frisk', item: 'banettite', moves: ['psychup']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Deoxys-Speed', ability: 'pressure', moves: ['calmmind']}]);
		const pranksterMega = battle.p1.active[0];
		battle.p1.chooseMove('psychup', null, true);
		battle.commitDecisions();
		assert.statStage(pranksterMega, 'spa', 1);
	});

	it('should cause base ability to affect the order of the turn in which it happens', function () {
		battle = common.gen(6).createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Sableye', ability: 'prankster', item: 'sablenite', moves: ['psychup']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Deoxys-Speed', ability: 'pressure', moves: ['calmmind']}]);
		const noPranksterMega = battle.p1.active[0];
		battle.p1.chooseMove('psychup', null, true);
		battle.commitDecisions();
		assert.statStage(noPranksterMega, 'spa', 0);
	});

	it('should cause base forme speed to decide turn order', function () {
		battle = common.gen(6).createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Beedrill', ability: 'swarm', item: 'beedrillite', moves: ['xscissor']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Hoopa-Unbound', ability: 'magician', moves: ['psyshock']}]);
		const fastMega = battle.p1.active[0];
		battle.p1.chooseMove('xscissor', null, true);
		battle.commitDecisions();
		assert.fainted(fastMega);
	});
});
