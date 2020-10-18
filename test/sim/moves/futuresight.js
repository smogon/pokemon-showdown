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
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.makeChoices('auto', 'auto');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.makeChoices('auto', 'move Protect');
		assert.equal(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it(`should fail when already active for the target's position`, function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Sneasel", ability: 'innerfocus', moves: ['odorsleuth']}]});
		battle.setPlayer('p2', {team: [{species: "Girafarig", ability: 'innerfocus', moves: ['futuresight']}]});
		battle.makeChoices('auto', 'move futuresight');
		battle.makeChoices('auto', 'move futuresight');
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|-fail|'));
	});

	it('[Gen 2] should damage in two turns, ignoring Protect', function () {
		battle = common.gen(2).createBattle();
		battle.setPlayer('p1', {team: [{species: "Sneasel", moves: ['odorsleuth', 'futuresight', 'protect', 'sweetscent']}]});
		battle.setPlayer('p2', {team: [{species: "Girafarig", moves: ['odorsleuth', 'futuresight', 'protect', 'sweetscent']}]});
		battle.makeChoices('move Sweet Scent', 'move Sweet Scent'); // counteract imperfect accuracy
		battle.makeChoices('move Future Sight', 'move Future Sight');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.makeChoices('auto', 'auto');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.makeChoices('auto', 'move Protect');
		assert.notEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it.skip(`should not double Stomping Tantrum for exiting normally`, function () {
		battle = common.createBattle([[
			{species: "Wynaut", moves: ['futuresight', 'stompingtantrum']},
		], [
			{species: "Scizor", ability: 'shellarmor', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		battle.makeChoices('move stompingtantrum', 'move sleeptalk');
		const scizor = battle.p2.active[0];
		const damage = scizor.maxhp - scizor.hp;
		assert.bounded(damage, [19, 23]); // If it were doubled, would be 38-45
	});

	it.skip(`should not trigger Eject Button`, function () {
		battle = common.createBattle([[
			{species: "Wynaut", moves: ['futuresight']},
		], [
			{species: "Scizor", item: 'ejectbutton', moves: ['sleeptalk']},
			{species: "Roggenrola", moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		battle.makeChoices();
		battle.makeChoices();
		assert.equal(battle.requestState, 'move');
	});

	it.skip(`should be able to set Future Sight against an empty target slot`, function () {
		battle = common.createBattle([[
			{species: "Wynaut", moves: ['futuresight']},
		], [
			{species: "Shedinja", moves: ['finalgambit']},
			{species: "Roggenrola", moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		battle.makeChoices();
		battle.makeChoices();
		const roggenrola = battle.p2.active[0];
		assert.false.fullHP(roggenrola);
	});

	it.skip(`its damaging hit should not count as copyable for Copycat`, function () {
		battle = common.createBattle([[
			{species: "Wynaut", moves: ['sleeptalk', 'futuresight']},
		], [
			{species: "Liepard", moves: ['sleeptalk', 'copycat']},
		]]);

		battle.makeChoices('move futuresight', 'auto');
		battle.makeChoices();
		battle.makeChoices();
		battle.makeChoices('auto', 'move copycat'); // Should fail due to last move being Sleep Talk
		battle.makeChoices();
		battle.makeChoices();
		const wynaut = battle.p1.active[0];
		assert.fullHP(wynaut);
	});
});
