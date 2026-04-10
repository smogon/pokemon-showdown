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

	it(`should be prevented by Own Tempo`, () => {
		battle = common.createBattle([[
			{ species: 'Lickilicky', ability: 'owntempo', moves: ['sleeptalk'] },
		], [
			{ species: 'Sableye', ability: 'prankster', moves: ['confuseray'] },
		]]);
		battle.makeChoices('move sleeptalk', 'move confuseray');
		assert(!battle.p1.active[0].volatiles['confusion']);
	});

	it(`should cause the Pokemon to hit itself in confusion`, () => {
		battle = common.createBattle({ forceRandomChance: true }, [[
			{ species: 'Snorlax', ability: 'immunity', moves: ['sleeptalk'] },
		], [
			{ species: 'Sableye', ability: 'prankster', moves: ['confuseray', 'sleeptalk'] },
		]]);
		battle.makeChoices('move sleeptalk', 'move confuseray');
		const snorlax = battle.p1.active[0];
		assert(snorlax.volatiles['confusion']);
		snorlax.volatiles['confusion'].time = 3;
		assert.hurts(snorlax, () => battle.makeChoices('move sleeptalk', 'move sleeptalk'));
	});

	it(`should count down and clear after expiry`, () => {
		battle = common.createBattle([[
			{ species: 'Snorlax', ability: 'immunity', moves: ['sleeptalk'] },
		], [
			{ species: 'Sableye', ability: 'prankster', moves: ['confuseray', 'sleeptalk'] },
		]]);
		const snorlax = battle.p1.active[0];
		battle.makeChoices('move sleeptalk', 'move confuseray');
		assert(snorlax.volatiles['confusion']);
		snorlax.volatiles['confusion'].time = 3;
		battle.makeChoices('move sleeptalk', 'move sleeptalk');
		assert(snorlax.volatiles['confusion']);
		battle.makeChoices('move sleeptalk', 'move sleeptalk');
		assert(snorlax.volatiles['confusion']);
		battle.makeChoices('move sleeptalk', 'move sleeptalk');
		assert(!snorlax.volatiles['confusion']);
	});
});
