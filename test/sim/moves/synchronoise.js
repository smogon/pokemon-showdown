'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Synchronoise', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should damage Pokemon that share a type with the user', () => {
		battle = common.createBattle([[
			{ species: "Gardevoir", moves: ['synchronoise'] },
		], [
			{ species: "Granbull", moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
	});

	it('should not damage Pokemon that do not share a type with the user', () => {
		battle = common.createBattle([[
			{ species: "Gardevoir", moves: ['synchronoise'] },
		], [
			{ species: "Caterpie", moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p2.active[0]);
	});

	it('should not damage Pokemon that share the ??? type with the user', () => {
		battle = common.createBattle([[
			{ species: "Arcanine", moves: ['burnup', 'synchronoise'] },
		], [
			{ species: "Arcanine", moves: ['burnup', 'synchronoise'] },
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0]);
		assert.fullHP(battle.p2.active[0]);
	});
});
