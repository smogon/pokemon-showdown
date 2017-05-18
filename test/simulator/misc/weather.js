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
		battle.join('p1', 'Guest 1', 1, [{species: 'Ninetales', ability: 'drought', moves: ['incinerate']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Cryogonal', ability: 'levitate', moves: ['splash']}]);
		const attacker = battle.p1.active[0];
		const defender = battle.p2.active[0];
		assert.hurtsBy(defender, 152, () => battle.commitDecisions());
		const move = Dex.getMove('incinerate');
		const basePower = battle.runEvent('BasePower', attacker, defender, move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
	});

	it('should reduce the damage (not the basePower) in unfavorable weather', function () {
		battle = common.createBattle();
		battle.randomizer = dmg => dmg; // max damage
		battle.join('p1', 'Guest 1', 1, [{species: 'Ninetales', ability: 'drizzle', moves: ['incinerate']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Cryogonal', ability: 'levitate', moves: ['splash']}]);
		const attacker = battle.p1.active[0];
		const defender = battle.p2.active[0];
		assert.hurtsBy(defender, 50, () => battle.commitDecisions());
		const move = Dex.getMove('incinerate');
		const basePower = battle.runEvent('BasePower', attacker, defender, move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
	});

	it('should make Hail/Sandstorm damage some pokemon but not others', function () {
		battle = common.createBattle();
		battle.randomizer = dmg => dmg; // max damage
		battle.join('p1', 'Guest 1', 1, [{species: 'Abomasnow', ability: 'snowwarning', moves: ['protect']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Sandslash', ability: 'sandveil', moves: ['protect']}]);
		battle.commitDecisions();
		const p1active = battle.p1.active[0];
		const p2active = battle.p2.active[0];
		assert.strictEqual(p1active.hp, p1active.maxhp);
		assert.notEqual(p2active.hp, p2active.maxhp);
	});
});
