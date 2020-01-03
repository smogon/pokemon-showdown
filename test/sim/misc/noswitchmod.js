'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('No Switch Mod', () => {
	afterEach(() => battle.destroy());

	it('should prevent players from switching manually', () => {
		battle = common.createBattle({noSwitchMod: true});
		battle.setPlayer('p1', {team: [{species: "Paras", moves: ['spore']}]});
		battle.setPlayer('p2', {team: [{species: "Magikarp", moves: ['splash']}, {species: "Feebas", moves: ['splash']}]});
		battle.makeChoices('move spore', 'switch 2');
		assert.strictEqual(battle.p2.active[0].species, 'Magikarp');
	});

	it('should not prevent U-turn switch', () => {
		battle = common.createBattle({noSwitchMod: true});
		battle.setPlayer('p1', {team: [{species: "Paras", moves: ['spore', 'uturn']}, {species: "Magikarp", moves: ['splash']}]});
		battle.setPlayer('p2', {team: [{species: "Feebas", moves: ['rest']}, {species: "Magikarp", moves: ['splash']}]});
		battle.makeChoices('move uturn', 'move rest');
		assert.strictEqual(battle.p2.active[0].switchFlag, false);
		assert.strictEqual(battle.requestState, 'switch');
		battle.makeChoices('switch 2', '');
		assert.strictEqual(battle.p2.active[0].species, 'Magikarp');
	});
});
