'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Weather damage calculation', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should multiply the damage (not the basePower) in favorable weather', function () {
		battle = common.createBattle();
		battle.randomizer = dmg => dmg; // max damage
		battle.setPlayer('p1', {team: [{species: 'Ninetales', ability: 'drought', moves: ['incinerate']}]});
		battle.setPlayer('p2', {team: [{species: 'Cryogonal', ability: 'levitate', moves: ['splash']}]});
		const attacker = battle.p1.active[0];
		const defender = battle.p2.active[0];
		assert.hurtsBy(defender, 152, () => battle.makeChoices('move incinerate', 'move splash'));
		const move = Dex.getMove('incinerate');
		const basePower = battle.runEvent('BasePower', attacker, defender, move, move.basePower, true);
		assert.equal(basePower, move.basePower);
	});

	it('should reduce the damage (not the basePower) in unfavorable weather', function () {
		battle = common.createBattle();
		battle.randomizer = dmg => dmg; // max damage
		battle.setPlayer('p1', {team: [{species: 'Ninetales', ability: 'drizzle', moves: ['incinerate']}]});
		battle.setPlayer('p2', {team: [{species: 'Cryogonal', ability: 'levitate', moves: ['splash']}]});
		const attacker = battle.p1.active[0];
		const defender = battle.p2.active[0];
		assert.hurtsBy(defender, 50, () => battle.makeChoices('move incinerate', 'move splash'));
		const move = Dex.getMove('incinerate');
		const basePower = battle.runEvent('BasePower', attacker, defender, move, move.basePower, true);
		assert.equal(basePower, move.basePower);
	});

	it('should make Hail/Sandstorm damage some pokemon but not others', function () {
		battle = common.createBattle();
		battle.randomizer = dmg => dmg; // max damage
		battle.setPlayer('p1', {team: [{species: 'Abomasnow', ability: 'snowwarning', moves: ['protect']}]});
		battle.setPlayer('p2', {team: [{species: 'Sandslash', ability: 'sandveil', moves: ['protect']}]});
		battle.makeChoices('move protect', 'move protect');
		const p1active = battle.p1.active[0];
		const p2active = battle.p2.active[0];
		assert.equal(p1active.hp, p1active.maxhp);
		assert.notEqual(p2active.hp, p2active.maxhp);
	});
});
