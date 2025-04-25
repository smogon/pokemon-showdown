'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Brick Break', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should break Reflect', () => {
		battle = common.createBattle([[
			{ species: "mew", moves: ['brickbreak', 'splash'] },
		], [
			{ species: "ninjask", moves: ['reflect', 'splash'] },
		]]);

		battle.makeChoices('move splash', 'move reflect');
		assert(battle.p2.sideConditions['reflect']);

		battle.makeChoices('move brickbreak', 'move splash');
		assert.false(battle.p2.sideConditions['reflect']);
	});

	it('should not break Reflect when used against a Ghost-type', () => {
		battle = common.createBattle([[
			{ species: "mew", moves: ['brickbreak', 'splash'] },
		], [
			{ species: "gengar", moves: ['reflect', 'splash'] },
		]]);

		battle.makeChoices('move splash', 'move reflect');
		assert(battle.p2.sideConditions['reflect']);

		battle.makeChoices('move brickbreak', 'move splash');
		assert(battle.p2.sideConditions['reflect']);
	});

	it.skip('should break Reflect when used against a Ghost-type in Gen 4 or earlier', () => {
		battle = common.gen(4).createBattle([[
			{ species: "mew", moves: ['brickbreak', 'splash'] },
		], [
			{ species: "gengar", moves: ['reflect', 'splash'] },
		]]);

		battle.makeChoices('move splash', 'move reflect');
		assert(battle.p2.sideConditions['reflect']);

		battle.makeChoices('move brickbreak', 'move splash');
		assert.false(battle.p2.sideConditions['reflect']);
	});

	it('should break Reflect against a Ghost type whose type immunity is being ignored', () => {
		battle = common.createBattle([[
			{ species: "mew", moves: ['brickbreak', 'splash'] },
		], [
			{ species: "gengar", item: "ringtarget", moves: ['reflect', 'splash'] },
		]]);

		battle.makeChoices('move splash', 'move reflect');
		assert(battle.p2.sideConditions['reflect']);

		battle.makeChoices('move brickbreak', 'move splash');
		assert.false(battle.p2.sideConditions['reflect']);
	});

	it('should break Reflect against a Ghost type whose type immunity is being ignored', () => {
		battle = common.createBattle([[
			{ species: "mew", ability: "scrappy", moves: ['brickbreak', 'splash'] },
		], [
			{ species: "gengar", moves: ['reflect', 'splash'] },
		]]);

		battle.makeChoices('move splash', 'move reflect');
		assert(battle.p2.sideConditions['reflect']);

		battle.makeChoices('move brickbreak', 'move splash');
		assert.false(battle.p2.sideConditions['reflect']);
	});

	it('should break Reflect against a Ghost type if it has been electrified', () => {
		battle = common.createBattle([[
			{ species: "mew", moves: ['brickbreak', 'splash'] },
		], [
			{ species: "gengar", moves: ['reflect', 'electrify'] },
		]]);

		battle.makeChoices('move splash', 'move reflect');
		assert(battle.p2.sideConditions['reflect']);

		battle.makeChoices('move brickbreak', 'move electrify');
		assert.false(battle.p2.sideConditions['reflect']);
	});

	it(`should break the foe's Reflect when used against an ally in Gen 3`, () => {
		battle = common.gen(3).createBattle({ gameType: 'doubles' }, [[
			{ species: "mew", moves: ['brickbreak', 'splash'] },
			{ species: "mew", moves: ['splash'] },
		], [
			{ species: "gengar", moves: ['reflect', 'splash'] },
			{ species: "gengar", moves: ['splash'] },
		]]);

		battle.makeChoices('move splash, move splash', 'move reflect, move splash');
		assert(battle.p2.sideConditions['reflect']);

		battle.makeChoices('move brickbreak -2, move splash', 'move splash, move splash');
		assert.false(battle.p2.sideConditions['reflect']);
	});
});
