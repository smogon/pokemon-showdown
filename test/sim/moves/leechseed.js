'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Leech Seed', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should heal and damage itself if it ends up in the same slot via Ally Switch`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'celesteela', ability: 'noguard', moves: ['sleeptalk', 'leechseed'] },
			{ species: 'comfey', moves: ['sleeptalk', 'allyswitch'] },
		], [
			{ species: 'wynaut', moves: ['sleeptalk'] },
			{ species: 'wynaut', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move leech seed -2, move sleeptalk', 'auto');
		const comfey = battle.p1.active[1];
		battle.makeChoices('move sleeptalk, move allyswitch', 'auto');
		assert.equal(comfey.hp, comfey.maxhp - Math.floor(comfey.maxhp / 8), 'Comfey should damage and heal itself from Leech Seed');
	});

	describe('[Gen 1]', () => {
		it(`should affect a target behind a Substitute`, () => {
			battle = common.gen(1).createBattle([[
				{ species: 'bulbasaur', moves: ['leechseed'] },
			], [
				{ species: 'pikachu', moves: ['substitute'] },
			]]);
			battle.makeChoices();
			const pikachu = battle.p2.active[0];
			assert(pikachu.volatiles['leechseed']);
		});
	});
});
