'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Gigaton Hammer', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should not be able to be selected if it was the last move used`, () => {
		battle = common.createBattle([[
			{ species: 'Tinkaton', moves: ['helpinghand', 'gigatonhammer'] },
		], [
			{ species: 'Brute Bonnet', moves: ['spore'] },
		]]);
		battle.makeChoices('move gigatonhammer', 'auto');
		assert.cantMove(() => battle.p1.chooseMove('gigatonhammer'), 'Tinkaton', 'Gigaton Hammer', true);
		battle.makeChoices();
		// Tinkaton wasn't able to use a different move last turn so Gigaton Hammer should still be disabled
		assert.cantMove(() => battle.p1.chooseMove('gigatonhammer'), 'Tinkaton', 'Gigaton Hammer', true);
	});

	it(`should be able to be used twice in one turn`, () => {
		battle = common.createBattle([[
			{ species: 'Tinkaton', moves: ['gigatonhammer'] },
		], [
			{ species: 'Oranguru', ability: 'shellarmor', moves: ['instruct'] },
		]]);
		const oranguru = battle.p2.active[0];
		battle.makeChoices();
		assert.fainted(oranguru);
	});

	it(`should be able to be used twice in a row if Encore'd by a faster Pokemon and had other selectable moves`, () => {
		battle = common.createBattle([[
			{ species: 'Tinkaton', moves: ['gigatonhammer', 'sleeptalk'] },
		], [
			{ species: 'Hawlucha', ability: 'shellarmor', moves: ['sleeptalk', 'encore'] },
		]]);
		const hawlucha = battle.p2.active[0];
		battle.makeChoices('move gigatonhammer', 'move sleeptalk');
		battle.makeChoices('move sleeptalk', 'move encore');
		assert.fainted(hawlucha);
	});

	it(`should struggle if Encore'd by a faster Pokemon and had no other selectable moves`, () => {
		battle = common.createBattle([[
			{ species: 'Tinkaton', moves: ['gigatonhammer'] },
		], [
			{ species: 'Hawlucha', ability: 'shellarmor', moves: ['sleeptalk', 'encore'] },
		]]);
		const hawlucha = battle.p2.active[0];
		battle.makeChoices('move gigatonhammer', 'move sleeptalk');
		battle.makeChoices('auto', 'move encore');
		assert.false.fainted(hawlucha);
	});

	it(`should struggle if Encore'd by a slower Pokemon`, () => {
		battle = common.createBattle([[
			{ species: 'Tinkaton', moves: ['gigatonhammer', 'sleeptalk'] },
		], [
			{ species: 'Oranguru', ability: 'shellarmor', moves: ['encore', 'sleeptalk'] },
		]]);
		const oranguru = battle.p2.active[0];
		battle.makeChoices('move gigatonhammer', 'move encore');
		battle.makeChoices('auto', 'move sleeptalk');
		assert.false.fainted(oranguru);
	});
});
