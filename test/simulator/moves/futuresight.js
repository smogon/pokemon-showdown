'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Future Sight', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should damage in two turns, ignoring Protect, affected by Dark immunities', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Sneasel", ability: 'innerfocus', moves: ['odorsleuth', 'futuresight', 'protect']}]});
		battle.setPlayer('p2', {team: [{species: "Girafarig", ability: 'innerfocus', moves: ['odorsleuth', 'futuresight', 'protect']}]});
		battle.makeChoices('move Future Sight', 'move Future Sight');
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.makeChoices('auto', 'auto');
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.makeChoices('auto', 'move Protect');
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it(`should fail when already active for the target's position`, function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Sneasel", ability: 'innerfocus', moves: ['odorsleuth']}]});
		battle.setPlayer('p2', {team: [{species: "Girafarig", ability: 'innerfocus', moves: ['futuresight']}]});
		battle.makeChoices('auto', 'move futuresight');
		battle.makeChoices('auto', 'move futuresight');
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-fail|'));
	});

	it('[Gen 2] should damage in two turns, ignoring Protect', function () {
		battle = common.gen(2).createBattle();
		battle.setPlayer('p1', {team: [{species: "Sneasel", moves: ['odorsleuth', 'futuresight', 'protect', 'sweetscent']}]});
		battle.setPlayer('p2', {team: [{species: "Girafarig", moves: ['odorsleuth', 'futuresight', 'protect', 'sweetscent']}]});
		battle.makeChoices('move Sweet Scent', 'move Sweet Scent'); // counteract imperfect accuracy
		battle.makeChoices('move Future Sight', 'move Future Sight');
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.makeChoices('auto', 'auto');
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.makeChoices('auto', 'move Protect');
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});
});
