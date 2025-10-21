'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("OHKO moves", () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should faint the target`, () => {
		battle = common.createBattle({ forceRandomChance: true }, [[
			{ species: 'Rhydon', moves: ['horndrill'] },
		], [
			{ species: 'Breloom', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.fainted(battle.p2.active[0]);
	});

	it(`should faint the target's substitute`, () => {
		battle = common.createBattle({ forceRandomChance: true }, [[
			{ species: 'Rhydon', moves: ['horndrill'] },
		], [
			{ species: 'Breloom', moves: ['substitute'] },
		]]);
		for (let i = 0; i < 4; i++) {
			battle.makeChoices();
		}
		const breloom = battle.p2.active[0];
		assert.equal(breloom.hp, 1);
		assert.false(breloom.volatiles['substitute']);
	});

	describe('[Gen 3]', () => {
		it(`should deal damage equal to the target's HP`, () => {
			battle = common.gen(3).createBattle({ forceRandomChance: true }, [[
				{ species: 'Rhydon', moves: ['horndrill'] },
			], [
				{ species: 'Breloom', moves: ['substitute'] },
			]]);
			for (let i = 0; i < 4; i++) {
				battle.makeChoices();
			}
			const breloom = battle.p2.active[0];
			assert.equal(breloom.hp, 1);
			assert.equal(breloom.volatiles['substitute'].hp, Math.floor(breloom.maxhp / 4) - 1);
		});
	});

	describe('[Gen 2]', () => {
		it(`should faint the target's substitute`, () => {
			battle = common.gen(2).createBattle({ forceRandomChance: true }, [[
				{ species: 'Rhydon', moves: ['horndrill'] },
			], [
				{ species: 'Vaporeon', moves: ['substitute'] },
			]]);
			battle.makeChoices();
			const vaporeon = battle.p2.active[0];
			assert.false(vaporeon.volatiles['substitute']);
			assert.equal(vaporeon.hp, vaporeon.maxhp - Math.floor(vaporeon.maxhp / 4));
		});

		it.skip(`should produce a super-effective message`, () => {
			battle = common.gen(2).createBattle({ forceRandomChance: true }, [[
				{ species: 'Rhydon', moves: ['fissure'] },
			], [
				{ species: 'Koffing', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			assert.fainted(battle.p2.active[0]);
			assert(battle.log.some(line => line.includes('-supereffective')));
		});
	});

	describe('[Gen 1]', () => {
		it(`should faint the target's substitute`, () => {
			battle = common.gen(1).createBattle({ forceRandomChance: true }, [[
				{ species: 'Tauros', moves: ['horndrill', 'sleeptalk'] },
			], [
				{ species: 'Vaporeon', moves: ['substitute', 'sleeptalk'] },
			]]);
			battle.makeChoices('move sleeptalk', 'move substitute');
			battle.makeChoices('move horndrill', 'move sleeptalk');
			const vaporeon = battle.p2.active[0];
			assert.false(vaporeon.volatiles['substitute']);
			assert.equal(vaporeon.hp, vaporeon.maxhp - Math.floor(vaporeon.maxhp / 4));
		});

		it.skip(`should produce a super-effective message`, () => {
			battle = common.gen(1).createBattle({ forceRandomChance: true }, [[
				{ species: 'Rhydon', moves: ['fissure'] },
			], [
				{ species: 'Koffing', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			assert.fainted(battle.p2.active[0]);
			assert(battle.log.some(line => line.includes('-supereffective')));
		});

		it(`should fail if the target has a higher speed`, () => {
			battle = common.gen(1).createBattle({ forceRandomChance: true }, [[
				{ species: 'Rhydon', moves: ['horndrill'] },
			], [
				{ species: 'Vaporeon', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			assert.false.fainted(battle.p2.active[0]);
		});
	});
});
