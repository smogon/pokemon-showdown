'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Endless Battle Clause', () => {
	afterEach(() => battle.destroy());

	it('should trigger on an infinite loop', () => {
		battle = common.createBattle({endlessBattleClause: true});
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Caterpie", moves: ['tackle']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [{species: "Slowbro", item: 'leppaberry', moves: ['slackoff', 'healpulse', 'recycle']}]);
		for (let i = 0; i < 100; i++) {
			if (battle.ended) return;
			let move;
			if (p1.active[0].hp < 150) {
				move = 'healpulse';
			} else if (p2.active[0].item === '') {
				move = 'recycle';
			} else {
				move = 'slackoff';
			}
			battle.makeChoices('move tackle', `move ${move}`);
		}
		assert.fail("The battle did not end despite Endless Battle Clause");
	});

	it('should prevent forced switch loops', () => {
		battle = common.gen(5).createBattle({endlessBattleClause: true});
		battle.join('p1', 'Guest 1', 1, [
			{species: "Riolu", ability: 'harvest', item: 'leppaberry', moves: ['assist']},
			{species: 'Skarmory', moves: ['whirlwind']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Caterpie", moves: ['tackle']},
			{species: "Weedle", moves: ['tackle']},
		]);
		for (let i = 0; i < 41; i++) {
			if (battle.ended) return;
			battle.makeChoices('move assist', 'move tackle');
		}
		assert.fail("The battle did not end despite Endless Battle Clause");
	});

	it('should prevent picking up Leppa Berry with Pickup', () => {
		battle = common.createBattle({endlessBattleClause: true});
		battle.join('p1', 'Guest 1', 1, [{species: 'Meloetta', ability: 'pickup', item: 'leppaberry', moves: ['entrainment', 'synthesis', 'softboiled']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Sunkern', ability: 'chlorophyll', moves: ['softboiled']}]);
		battle.makeChoices('move entrainment', 'move softboiled');
		for (let i = 0; i < 8; i++) {
			battle.makeChoices('move synthesis', 'move softboiled');
		}
		for (let i = 0; i < 20; i++) {
			if (battle.ended) return;
			battle.makeChoices('move softboiled', 'move softboiled');
		}
		assert.fail("The battle did not end despite Endless Battle Clause");
	});

	it('should prevent Ghost vs Ghost endless battles in Gen1', () => {
		battle = common.gen(1).createBattle({endlessBattleClause: true});
		battle.join('p1', 'Guest 1', 1, [{species: 'Gastly', moves: ['megakick']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Gastly', moves: ['megakick']}]);
		for (let i = 0; i < 15; i++) {
			if (battle.ended) return;
			battle.makeChoices('move megakick', 'move megakick');
		}
		assert.fail("The battle did not end despite Endless Battle Clause");
	});

	it('should not trigger by both Pokemon eating a Leppa Berry they started with', () => {
		battle = common.createBattle({endlessBattleClause: true});
		battle.join('p1', 'Guest 1', 1, [{species: "Sunkern", item: 'leppaberry', moves: ['synthesis']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Sunkern", item: 'leppaberry', moves: ['synthesis']}]);
		for (let i = 0; i < 10; i++) {
			battle.makeChoices('move synthesis', 'move synthesis');
		}
		assert.false(battle.ended);
	});

	it('should prevent Recycle-only battles', () => {
		battle = common.createBattle({endlessBattleClause: true});
		battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", item: 'leppaberry', moves: ['recycle']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Smeargle", item: 'leppaberry', moves: ['recycle']}]);
		for (let i = 0; i < 20; i++) {
			if (battle.ended) return;
			battle.makeChoices('move recycle', 'recycle');
		}
		assert.fail("The battle did not end despite Endless Battle Clause");
	});

	it('should consider Leppa Berry Fling to be instant staleness', () => {
		battle = common.createBattle({endlessBattleClause: true});
		battle.join('p1', 'Guest 1', 1, [{species: "Riolu", item: 'leppaberry', moves: ['entrainment', 'fling']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Magikarp", moves: ['splash']}]);
		battle.makeChoices('move fling', 'move splash');
		assert(battle.log.some(line => line.includes("Magikarp is in an endless loop: it used a Leppa Berry it didn't start with.")));
	});
});
