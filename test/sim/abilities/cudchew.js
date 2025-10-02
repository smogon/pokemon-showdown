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
			{ species: 'toxicroak', moves: ['toxic'] },
		]]);
		const tauros = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(tauros.status, '');
		battle.makeChoices();
		assert.equal(tauros.status, '');
		battle.makeChoices();
		assert.equal(tauros.status, 'tox');
	});

	it(`should re-activate a berry flung in the previous turn, for both the attacker and the target`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'tauros', ability: 'cudchew', item: 'lumberry', moves: ['fling', 'sleeptalk'] },
			{ species: 'foongus', moves: ['toxic', 'sleeptalk'] },
		], [
			{ species: 'farigiraf', ability: 'cudchew', moves: ['sleeptalk'] },
			{ species: 'grimer', moves: ['toxic', 'sleeptalk'] },
		]]);
		const tauros = battle.p1.active[0];
		const farigiraf = battle.p2.active[0];
		battle.makeChoices('move fling 1, move toxic 1', 'move sleeptalk, move toxic 1');
		assert.equal(tauros.status, 'tox');
		assert.equal(farigiraf.status, 'tox');
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move sleeptalk, move sleeptalk');
		assert.equal(tauros.status, '');
		assert.equal(farigiraf.status, '');
	});

	it(`should not re-activate a berry eaten by Bug Bite, for either the attacker or the target`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'tauros', ability: 'cudchew', moves: ['bugbite', 'sleeptalk'] },
			{ species: 'foongus', moves: ['toxic', 'sleeptalk'] },
		], [
			{ species: 'farigiraf', ability: 'cudchew', item: 'lumberry', moves: ['sleeptalk'] },
			{ species: 'grimer', moves: ['toxic', 'sleeptalk'] },
		]]);
		const tauros = battle.p1.active[0];
		const farigiraf = battle.p2.active[0];
		battle.makeChoices('move bugbite 1, move toxic 1', 'move sleeptalk, move toxic 1');
		assert.equal(tauros.status, 'tox');
		assert.equal(farigiraf.status, 'tox');
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move sleeptalk, move sleeptalk');
		assert.equal(tauros.status, 'tox');
		assert.equal(farigiraf.status, 'tox');
	});

	it(`should not be prevented by Unnerve`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'tauros', ability: 'cudchew', item: 'lumberry', moves: ['sleeptalk'] },
			{ species: 'wynaut', moves: ['sleeptalk'] },
		], [
			{ species: 'toxicroak', moves: ['toxic'] },
			{ species: 'magikarp', moves: ['sleeptalk'] },
			{ species: 'mewtwo', ability: 'unnerve', moves: ['sleeptalk'] },
		]]);
		const tauros = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(tauros.status, '');
		battle.makeChoices('auto', 'move toxic 1, switch 3');
		assert.equal(tauros.status, '');
	});

	it(`should still activate in the following turn if the berry was consumed during residuals`, () => {
		battle = common.createBattle([[
			{ species: 'tauros', ability: 'cudchew', item: 'sitrusberry', moves: ['bellydrum'] },
		], [
			{ species: 'toxicroak', moves: ['toxic'] },
		]]);
		const tauros = battle.p1.active[0];
		battle.makeChoices();
		battle.makeChoices();
		assert(tauros.hp > tauros.maxhp * 3 / 4, 'Tauros should have eaten its berry twice');
	});
});
