'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Cud Chew', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should re-activate a berry, eaten in the previous turn`, () => {
		battle = common.createBattle([[
			{ species: 'tauros', ability: 'cudchew', item: 'lumberry', moves: ['sleeptalk'] },
		], [
			{ species: 'kommoo', moves: ['toxic'] },
		]]);
		const tauros = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(tauros.status, '');
		battle.makeChoices();
		assert.equal(tauros.status, '');
		battle.makeChoices();
		assert.equal(tauros.status, 'tox');
	});

	it(`should re-activate a berry, flung in the previous turn`, () => {
		battle = common.createBattle([[
			{ species: 'tauros', ability: 'cudchew', moves: ['sleeptalk'] },
		], [
			{ species: 'kommoo', item: 'lumberry', moves: ['toxic', 'fling'] },
		]]);
		const tauros = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(tauros.status, 'tox');
		battle.makeChoices('auto', 'move fling');
		assert.equal(tauros.status, '');
		battle.makeChoices();
		assert.equal(tauros.status, '');
		battle.makeChoices();
		assert.equal(tauros.status, 'tox');
	});

	it(`should not be prevented by Unnerve`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'tauros', ability: 'cudchew', item: 'lumberry', moves: ['sleeptalk'] },
			{ species: 'wynaut', moves: ['sleeptalk'] },
		], [
			{ species: 'kommoo', moves: ['toxic'] },
			{ species: 'magikarp', moves: ['sleeptalk'] },
			{ species: 'mewtwo', ability: 'unnerve', moves: ['sleeptalk'] },
		]]);
		const tauros = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(tauros.status, '');
		battle.makeChoices('auto', 'move toxic 1, switch 3');
		assert.equal(tauros.status, '');
	});

	it(`should activate in the following turn if the berry was consumed during residuals`, () => {
		battle = common.createBattle([[
			{ species: 'tauros', ability: 'cudchew', item: 'sitrusberry', moves: ['bellydrum'] },
		], [
			{ species: 'mewtwo', moves: ['toxic'] },
		]]);
		const tauros = battle.p1.active[0];
		battle.makeChoices();
		battle.makeChoices();
		assert(tauros.hp > tauros.maxhp * 3 / 4, 'Tauros should have eaten its berry twice');
	});
});
