'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Endless Battle Clause (slow)', () => {
	afterEach(() => battle.destroy());

	it('should trigger on an infinite loop', () => {
		battle = common.createBattle({endlessBattleClause: true});
		battle.setPlayer('p1', {team: [{species: "Caterpie", moves: ['tackle']}]});
		battle.setPlayer('p2', {team: [{species: "Slowbro", item: 'leppaberry', moves: ['slackoff', 'healpulse', 'recycle']}]});
		const [victim, memeSlowbro] = [battle.p1.active[0], battle.p2.active[0]];
		skipTurns(battle, 100);
		for (let i = 0; i < 100; i++) {
			if (battle.ended) {
				assert.equal(battle.winner, 'Player 1');
				return;
			}
			let move;
			if (victim.hp < 150) {
				move = 'healpulse';
			} else if (memeSlowbro.item === '') {
				move = 'recycle';
			} else {
				move = 'slackoff';
			}
			battle.makeChoices('default', `move ${move}`);
		}
		assert.fail("The battle did not end despite Endless Battle Clause");
	});

	it('should not trigger by both Pokemon eating a Leppa Berry they started with', () => {
		battle = common.createBattle({endlessBattleClause: true});
		battle.setPlayer('p1', {team: [{species: "Sunkern", item: 'leppaberry', moves: ['synthesis']}]});
		battle.setPlayer('p2', {team: [{species: "Sunkern", item: 'leppaberry', moves: ['synthesis']}]});
		skipTurns(battle, 100);
		for (let i = 0; i < 10; i++) {
			battle.makeChoices('move synthesis', 'move synthesis');
		}
		assert.false(battle.ended);
	});

	it('should only cause the battle to end if either side cannot switch to a non-stale Pokemon and at least one staleness is externally inflicted', () => {
		battle = common.createBattle({endlessBattleClause: true});
		battle.setPlayer('p1', {team: [
			{species: "Blissey", level: 1, item: 'leppaberry', moves: ['recycle', 'extremespeed', 'floralhealing', 'block']},
			{species: "Magikarp", moves: ['splash']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Magikarp", moves: ['splash']},
			{species: "Sunkern", item: 'leppaberry', moves: ['synthesis']},
		]});
		skipTurns(battle, 100);
		for (let i = 0; i < 8; i++) {
			battle.makeChoices('move extremespeed', 'move splash');
		}
		// Blissey consumes a Leppa Berry that wasn't cycled = no staleness.
		assert.false(battle.ended);
		battle.makeChoices('move recycle', 'move splash');
		assert.false(battle.ended);
		for (let i = 0; i < 8; i++) {
			battle.makeChoices('move extremespeed', 'move splash');
		}
		// Blissey consumes a Leppa Berry which was cycled = internal staleness.
		assert.false(battle.ended);
		// Blissey inflicts external staleness on Magikarp.
		battle.makeChoices('move floralhealing', 'move splash');
		// Magikarp can still be switched out to Sunkern at this point, so EBC still shouldn't trigger
		assert.false(battle.ended);
		battle.makeChoices('move block', 'move splash');
		// Now that Magikarp is trapped, the termination condition should occur.
		assert(battle.ended);
		assert.equal(battle.winner, 'Player 2');
	});

	it('Fling should cause externally inflicted staleness', () => {
		battle = common.createBattle({endlessBattleClause: true});
		battle.setPlayer('p1', {team: [
			{species: "Blissey", level: 1, item: 'leppaberry', moves: ['recycle', 'extremespeed', 'fling', 'block']},
			{species: "Magikarp", moves: ['splash']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Magikarp", moves: ['splash']},
			{species: "Sunkern", item: 'leppaberry', moves: ['synthesis']},
		]});
		skipTurns(battle, 100);
		// Blissey inflicts external staleness on Magikarp.
		battle.makeChoices('move fling', 'move splash');
		assert.false(battle.ended);

		battle.makeChoices('move recycle', 'move splash');
		for (let i = 0; i < 8; i++) {
			battle.makeChoices('move extremespeed', 'move splash');
		}
		assert.false(battle.ended);

		battle.makeChoices('move block', 'move splash');
		// Now that Magikarp is trapped, the termination condition should occur.
		assert(battle.ended);
		assert.equal(battle.winner, 'Player 2');
	});

	it('Entrainment should cause externally inflicted staleness', () => {
		battle = common.createBattle({endlessBattleClause: true});
		battle.setPlayer('p1', {team: [
			{species: "Blissey", ability: 'Levitate', level: 1, item: 'leppaberry', moves: ['recycle', 'extremespeed', 'entrainment', 'block']},
			{species: "Magikarp", moves: ['splash']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Magikarp", ability: 'Illuminate', moves: ['splash']},
			{species: "Sunkern", item: 'leppaberry', moves: ['synthesis']},
		]});
		skipTurns(battle, 100);
		// Blissey inflicts external staleness on Magikarp.
		battle.makeChoices('move entrainment', 'move splash');
		assert.false(battle.ended);

		for (let i = 0; i < 8; i++) {
			battle.makeChoices('move extremespeed', 'move splash');
		}
		assert.false(battle.ended);

		battle.makeChoices('move recycle', 'move splash');
		assert.false(battle.ended);

		for (let i = 0; i < 8; i++) {
			battle.makeChoices('move extremespeed', 'move splash');
		}
		assert.false(battle.ended);

		battle.makeChoices('move block', 'move splash');
		// Now that Magikarp is trapped, the termination condition should occur.
		assert(battle.ended);
		assert.equal(battle.winner, 'Player 2');
	});


	it('Entrainment\'s externally inflicted staleness should go away on switch', () => {
		battle = common.createBattle({endlessBattleClause: true});
		battle.setPlayer('p1', {team: [
			{species: "Blissey", ability: 'Levitate', level: 1, item: 'leppaberry', moves: ['recycle', 'extremespeed', 'entrainment', 'block']},
			{species: "Magikarp", moves: ['splash']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Magikarp", ability: 'Illuminate', moves: ['splash']},
			{species: "Sunkern", item: 'leppaberry', moves: ['synthesis']},
		]});
		skipTurns(battle, 100);
		// Blissey inflicts external staleness on Magikarp.
		battle.makeChoices('move entrainment', 'move splash');
		assert.false(battle.ended);

		for (let i = 0; i < 8; i++) {
			battle.makeChoices('move extremespeed', 'move splash');
		}
		assert.false(battle.ended);

		battle.makeChoices('move recycle', 'move splash');
		assert.false(battle.ended);

		for (let i = 0; i < 8; i++) {
			battle.makeChoices('move extremespeed', 'move splash');
		}
		assert.false(battle.ended);

		battle.makeChoices('move recycle', 'switch 2');
		battle.makeChoices('move block', 'switch 2');

		assert(!battle.ended);
	});

	it('should allow for a maximum of 1000 turns', function () {
		this.timeout(0);
		battle = common.createBattle({endlessBattleClause: true});
		battle.setPlayer('p1', {team: [
			{species: "Gengar", moves: ['splash']},
			{species: "Clefable", moves: ['splash']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Blissey", moves: ['splash']},
			{species: "Vaporeon", moves: ['splash']},
		]});
		for (let i = 0; i < 998; i++) {
			battle.makeChoices('switch 2', 'switch 2');
		}
		assert(!battle.ended);
		battle.makeChoices('switch 2', 'switch 2');
		assert(battle.ended);
	});

	it('Skill Swap should remove the user\'s staleness', () => {
		battle = common.createBattle({endlessBattleClause: true}, [[
			{species: "Furret", moves: ['skillswap']},
		], [
			{species: "Ampharos", moves: ['skillswap']},
		]]);
		skipTurns(battle, 100);
		for (let i = 0; i < 8; i++) battle.makeChoices();
		assert.false(battle.ended);
	});
});

// Endless Battle Clause doesn't take effect for 100 turns, so we artificially skip turns
// to get the turn counter to be in the range which could possibly trigger the clause
function skipTurns(battle, turns) {
	for (let i = 0; i < turns; i++) battle.endTurn();
}
