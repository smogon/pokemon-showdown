'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Confusion', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should not be affected by modifiers like Huge Power or Life Orb`, () => {
		battle = common.createBattle({ forceRandomChance: true }, [[
			{ species: 'Deoxys-Attack', ability: 'hugepower', item: 'lifeorb', moves: ['sleeptalk'] },
		], [
			{ species: 'Sableye', ability: 'prankster', moves: ['confuseray'] },
		]]);
		battle.makeChoices();
		const deoxys = battle.p1.active[0];
		const damage = deoxys.maxhp - deoxys.hp;
		assert.bounded(damage, [150, 177]);
	});

	describe('[Gen 1]', () => {
		it(`can confuse a Pokemon behind a Substitute with a secondary effect`, () => {
			battle = common.gen(1).createBattle([[
				{ species: 'Mew', ability: 'noguard', moves: ['substitute', 'splash'] },
			], [
				{ species: 'Abra', ability: 'noguard', moves: ['confuseray', 'confusion'] },
			]]);
			const mew = battle.p1.active[0];
			battle.makeChoices();
			assert.false(mew.volatiles['confusion']);
			battle.forceRandomChance = true;
			battle.makeChoices('move splash', 'move confusion');
			assert(mew.volatiles['confusion']);
		});
	});
});
