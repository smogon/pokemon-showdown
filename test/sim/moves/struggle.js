'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Struggle', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should do recoil damage even if it does no damage to the target`, () => {
		battle = common.createBattle([[
			{ species: 'Salamence', moves: ['sleeptalk'] },
		], [
			{ species: 'Shedinja', ability: 'sturdy', moves: ['taunt'] },
		]]);

		battle.makeChoices();
		battle.makeChoices();
		const salamence = battle.p1.active[0];
		const shedinja = battle.p2.active[0];
		assert.false.equal(salamence.hp, salamence.maxhp);
		assert.equal(shedinja.hp, 1);
	});

	it(`should KO Shedinja`, () => {
		battle = common.createBattle([[
			{ species: 'Shedinja', moves: ['sleeptalk'] },
		], [
			{ species: 'Salamence', moves: ['taunt'] },
		]]);

		battle.makeChoices();
		battle.makeChoices();
		assert.equal(battle.winner, 'Player 2');
	});
});
