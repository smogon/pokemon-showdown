'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Sleep Clause Mod', () => {
	afterEach(() => battle.destroy());

	it('should prevent players from putting more than one of foe\'s Pokemon to sleep', () => {
		battle = common.createBattle({sleepClause: true});
		battle.join('p1', 'Guest 1', 1, [{species: "Paras", moves: ['spore']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Magikarp", moves: ['splash']}, {species: "Feebas", moves: ['splash']}]);
		battle.makeChoices('move spore', 'switch 2');
		assert.strictEqual(battle.p2.active[0].status, 'slp');
		battle.makeChoices('move spore', 'switch 2');
		assert.strictEqual(battle.p2.active[0].status, '');
	});

	it('should not prevent Rest', () => {
		battle = common.createBattle({sleepClause: true});
		battle.join('p1', 'Guest 1', 1, [{species: "Paras", moves: ['spore', 'tackle']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Feebas", moves: ['rest']}, {species: "Magikarp", moves: ['splash']}]);
		battle.makeChoices('move spore', 'switch 2');
		assert.strictEqual(battle.p2.active[0].status, 'slp');
		battle.makeChoices('move tackle', 'switch 2');
		assert.strictEqual(battle.p2.active[0].status, '');
		battle.makeChoices('move tackle', 'move rest');
		assert.strictEqual(battle.p2.active[0].status, 'slp');
	});
});
