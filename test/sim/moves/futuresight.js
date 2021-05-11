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

	it(`should not double Stomping Tantrum for exiting normally`, function () {
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

	it(`should not trigger Eject Button`, function () {
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

	it(`should be able to set Future Sight against an empty target slot`, function () {
		battle = common.createBattle([[
			{species: "Shedinja", moves: ['finalgambit']},
			{species: "Roggenrola", moves: ['sleeptalk']},
		], [
			{species: "Wynaut", moves: ['sleeptalk', 'futuresight']},
		]]);

		battle.makeChoices('auto', 'move future sight');
		battle.makeChoices('switch 2');
		battle.makeChoices();
		battle.makeChoices();
		const roggenrola = battle.p1.active[0];
		assert.false.fullHP(roggenrola);
	});

	it(`its damaging hit should not count as copyable for Copycat`, function () {
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

	it.skip(`should only cause the user to take Life Orb recoil on its damaging turn`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'lifeorb', moves: ['futuresight']},
		], [
			{species: 'mew', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		const wynaut = battle.p1.active[0];
		const mew = battle.p2.active[0];
		assert.fullHP(wynaut, `Wynaut should not take Life Orb recoil on Future Sight's starting turn`);
		battle.makeChoices();
		battle.makeChoices();
		assert.equal(wynaut.hp, wynaut.maxhp - Math.floor(wynaut.maxhp / 10), `Wynaut should take Life Orb recoil on Future Sight's damaging turn`);
		const damage = mew.maxhp - mew.hp;
		assert.bounded(damage, [30, 35]); // 22-27 if Life Orb was not applied
	});

	it.skip(`should not cause the user to change typing on either its starting or damaging turn`, function () {
		battle = common.createBattle([[
			{species: 'roggenrola', ability: 'protean', moves: ['futuresight', 'sleeptalk']},
		], [
			{species: 'mew', moves: ['sleeptalk']},
		]]);

		const roggenrola = battle.p1.active[0];
		battle.makeChoices();
		assert.false(roggenrola.hasType('Psychic'), `Protean Roggenrola should not change type on Future Sight's starting turn`);
		battle.makeChoices();
		battle.makeChoices();
		assert.false(roggenrola.hasType('Psychic'), `Protean Roggenrola should not change type on Future Sight's damaging turn`);
	});
});
