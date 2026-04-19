'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Synchronoise', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should damage Pokemon that share a type with the user', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Gardevoir", moves: ['synchronoise'] }] });
		battle.setPlayer('p2', { team: [{ species: "Granbull", moves: ['sleeptalk'] }] });
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
	});

	it('should not damage Pokemon that do not share a type with the user', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Gardevoir", moves: ['synchronoise'] }] });
		battle.setPlayer('p2', { team: [{ species: "Caterpie", moves: ['sleeptalk'] }] });
		battle.makeChoices();
		assert.fullHP(battle.p2.active[0]);
	});
});
