'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`King's Shield`, function () {
	afterEach(() => battle.destroy());

	it(`should lower the Atk of a contactor in 2 levels`, function () {
		battle = common.createBattle([
			[{species: "Gallade", ability: 'justified', moves: ['zenheadbutt']}],
			[{species: "Aegislash", ability: 'stancechange', moves: ['kingsshield']}],
		]);
		battle.commitDecisions();
		assert.statStage(battle.p1.active[0], 'atk', -2);
	});

	it(`should lower the Atk of a contact-move attacker in 2 levels even if immune`, function () {
		battle = common.createBattle([
			[{species: "Gallade", ability: 'justified', moves: ['drainpunch']}],
			[{species: "Aegislash", ability: 'stancechange', moves: ['kingsshield']}],
		]);
		battle.commitDecisions();
		assert.statStage(battle.p1.active[0], 'atk', -2);
	});
});

describe(`King's Shield [Gen 6]`, function () {
	afterEach(() => battle.destroy());

	it(`should not lower the Atk of a contact-move attacker if immune`, function () {
		battle = common.gen(6).createBattle([
			[{species: "Gallade", ability: 'justified', moves: ['drainpunch']}],
			[{species: "Aegislash", ability: 'stancechange', moves: ['kingsshield']}],
		]);
		battle.commitDecisions();
		assert.statStage(battle.p1.active[0], 'atk', 0);
	});
});
