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
		battle.setPlayer('p1', { team: [{ species: "Gardevoir", ability: 'synchronize', item: 'choicespecs', moves: ['synchronoise'] }] });
		battle.setPlayer('p2', { team: [{ species: "Snubbull", level: 2, ability: 'runaway', item: 'focussash', moves: ['focusenergy'] }] });
		battle.makeChoices('move synchronoise', 'move focusenergy');
		assert.equal(battle.p2.active[0].item, '');
	});

	it('should not damage Pokemon that do not share a type with the user', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Gardevoir", ability: 'synchronize', item: 'choicespecs', moves: ['synchronoise'] }] });
		battle.setPlayer('p2', { team: [{ species: "Caterpie", level: 2, ability: 'runaway', item: 'focussash', moves: ['stringshot'] }] });
		battle.makeChoices('move synchronoise', 'move stringshot');
		assert.equal(battle.p2.active[0].item, 'focussash');
	});
});
