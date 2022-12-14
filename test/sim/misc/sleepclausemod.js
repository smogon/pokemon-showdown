'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Sleep Clause Mod', () => {
	afterEach(() => battle.destroy());

	it('should prevent players from putting more than one of foe\'s Pokemon to sleep', () => {
		battle = common.createBattle({sleepClause: true});
		battle.setPlayer('p1', {team: [{species: "Paras", moves: ['spore']}]});
		battle.setPlayer('p2', {team: [{species: "Magikarp", moves: ['splash']}, {species: "Feebas", moves: ['splash']}]});
		battle.makeChoices('move spore', 'switch 2');
		assert.equal(battle.p2.active[0].status, 'slp');
		battle.makeChoices('move spore', 'switch 2');
		assert.equal(battle.p2.active[0].status, '');
	});

	it('should not prevent Rest', () => {
		battle = common.createBattle({sleepClause: true});
		battle.setPlayer('p1', {team: [{species: "Paras", moves: ['spore', 'tackle']}]});
		battle.setPlayer('p2', {team: [{species: "Feebas", moves: ['rest']}, {species: "Magikarp", moves: ['splash']}]});
		battle.makeChoices('move spore', 'switch 2');
		assert.equal(battle.p2.active[0].status, 'slp');
		battle.makeChoices('move tackle', 'switch 2');
		assert.equal(battle.p2.active[0].status, '');
		battle.makeChoices('move tackle', 'move rest');
		assert.equal(battle.p2.active[0].status, 'slp');
	});
});
