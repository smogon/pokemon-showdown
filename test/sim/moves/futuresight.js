'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Future Sight', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should damage in two turns, ignoring Protect, affected by Dark immunities`, function () {
		battle = common.createBattle([[
			{species: 'Sneasel', moves: ['sleeptalk', 'futuresight']},
		], [
			{species: 'Girafarig', moves: ['sleeptalk', 'futuresight', 'protect']},
		]]);

		const sneasel = battle.p1.active[0];
		const girafarig = battle.p2.active[0];
		battle.makeChoices('move futuresight', 'move futuresight');
		assert.fullHP(girafarig);
		battle.makeChoices();
		assert.fullHP(girafarig);
		battle.makeChoices('auto', 'move protect');
		assert.fullHP(sneasel);
		assert.false.fullHP(girafarig);
	});

	it(`should fail when already active for the target's position`, function () {
		battle = common.createBattle([[
			{species: 'Sneasel', moves: ['sleeptalk']},
		], [
			{species: 'Girafarig', moves: ['futuresight']},
		]]);

		battle.makeChoices();
		battle.makeChoices();
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|-fail|'));
	});

	it(`[Gen 2] should damage in two turns, ignoring Protect`, function () {
		battle = common.gen(2).createBattle([[
			{species: 'Sneasel', moves: ['sleeptalk', 'futuresight', 'sweetscent']},
		], [
			{species: 'Girafarig', moves: ['sleeptalk', 'futuresight', 'protect', 'sweetscent']},
		]]);

		const sneasel = battle.p1.active[0];
		const girafarig = battle.p2.active[0];
		battle.makeChoices('move sweetscent', 'move sweetscent'); // counteract imperfect accuracy
		battle.makeChoices('move futuresight', 'move futuresight');
		assert.fullHP(girafarig);
		battle.makeChoices('auto', 'auto');
		assert.fullHP(girafarig);
		battle.makeChoices('auto', 'move Protect');
		assert.false.fullHP(sneasel);
		assert.false.fullHP(girafarig);
	});

	it(`should not double Stomping Tantrum for exiting normally`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', moves: ['futuresight', 'stompingtantrum']},
		], [
			{species: 'Scizor', ability: 'shellarmor', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		battle.makeChoices('move stompingtantrum', 'move sleeptalk');
		const scizor = battle.p2.active[0];
		const damage = scizor.maxhp - scizor.hp;
		assert.bounded(damage, [19, 23]); // If it were doubled, would be 38-45
	});

	it(`should not trigger Eject Button`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', moves: ['futuresight']},
		], [
			{species: 'Scizor', item: 'ejectbutton', moves: ['sleeptalk']},
			{species: 'Roggenrola', moves: ['sleeptalk']},
		]]);

		for (let i = 0; i < 3; i++) battle.makeChoices();
		assert.equal(battle.requestState, 'move');
	});

	it(`should be able to set Future Sight against an empty target slot`, function () {
		battle = common.createBattle([[
			{species: 'Shedinja', moves: ['finalgambit']},
			{species: 'Roggenrola', moves: ['sleeptalk']},
		], [
			{species: 'Wynaut', moves: ['sleeptalk', 'futuresight']},
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
			{species: 'Wynaut', moves: ['sleeptalk', 'futuresight']},
		], [
			{species: 'Liepard', moves: ['sleeptalk', 'copycat']},
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

	it(`should only cause the user to take Life Orb recoil on its damaging turn`, function () {
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

	it(`[Gen 4] should not be affected by Life Orb`, function () {
		battle = common.gen(4).createBattle([[
			{species: 'wynaut', item: 'lifeorb', moves: ['futuresight']},
		], [
			{species: 'mew', ability: 'noguard', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		const wynaut = battle.p1.active[0];
		const mew = battle.p2.active[0];
		battle.makeChoices();
		battle.makeChoices();
		assert.fullHP(wynaut, `Wynaut should not have taken any damage`);
		const damage = mew.maxhp - mew.hp;
		assert.bounded(damage, [21, 25]); // [27-32] if Life Orb was applied
	});

	it(`should not be affected by Life Orb if not the original user`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'lifeorb', moves: ['futuresight']},
			{species: 'liepard', item: 'lifeorb', moves: ['sleeptalk']},
		], [
			{species: 'mew', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		const liepard = battle.p1.pokemon[1];
		const mew = battle.p2.active[0];
		battle.makeChoices();
		battle.makeChoices('switch 2', 'move sleeptalk');
		assert.fullHP(liepard, `liepard should not have taken any damage`);
		const damage = mew.maxhp - mew.hp;
		assert.bounded(damage, [22, 27]); // 30, 35 if Life Orb was applied
	});

	it(`should not cause the user to change typing on either its starting or damaging turn`, function () {
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

	it(`should be boosted by Terrain only if Terrain is active on the damaging turn`, function () {
		battle = common.createBattle([[
			{species: 'Blissey', ability: 'shellarmor', moves: ['softboiled']},
		], [
			{species: 'Wynaut', ability: 'psychicsurge', moves: ['sleeptalk', 'futuresight']},
		]]);

		battle.makeChoices('auto', 'move futuresight');
		battle.makeChoices();
		battle.makeChoices();
		const blissey = battle.p1.active[0];
		let damage = blissey.maxhp - blissey.hp;
		assert.bounded(damage, [46, 55]);

		battle.makeChoices('auto', 'move futuresight');
		battle.makeChoices();
		battle.makeChoices();
		damage = blissey.maxhp - blissey.hp;
		assert.bounded(damage, [36, 43]);
	});

	it(`should be boosted by Terrain even if the user is not on the field, as long as the user is not Flying-type`, function () {
		battle = common.createBattle([[
			{species: 'Blissey', ability: 'shellarmor', moves: ['softboiled']},
		], [
			{species: 'cresselia', ability: 'levitate', moves: ['sleeptalk', 'futuresight']},
			{species: 'deino', ability: 'psychicsurge', moves: ['sleeptalk']},
			{species: 'xatu', moves: ['sleeptalk', 'futuresight']},
		]]);

		// Cresselia will be Terrain-boosted because its Ability is not checked while not active
		battle.makeChoices('auto', 'move futuresight');
		battle.makeChoices();
		battle.makeChoices('auto', 'switch deino');
		const blissey = battle.p1.active[0];
		let damage = blissey.maxhp - blissey.hp;
		assert.bounded(damage, [102, 121]);

		// Xatu won't be Terrain-boosted because its Flying-type is checked while not active
		battle.makeChoices('auto', 'switch xatu');
		battle.makeChoices('auto', 'move futuresight');
		battle.makeChoices();
		battle.makeChoices('auto', 'switch deino');
		damage = blissey.maxhp - blissey.hp;
		assert.bounded(damage, [96, 114]);
	});

	it(`should not ignore the target's screens, even when the user is not active on the field`, function () {
		battle = common.createBattle([[
			{species: 'Blissey', ability: 'shellarmor', item: 'lightclay', moves: ['softboiled', 'lightscreen']},
		], [
			{species: 'Wynaut', moves: ['sleeptalk', 'futuresight']},
			{species: 'deino', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move lightscreen', 'move futuresight');
		battle.makeChoices();
		battle.makeChoices();
		const blissey = battle.p1.active[0];
		let damage = blissey.maxhp - blissey.hp;
		assert.bounded(damage, [18, 21]);

		battle.makeChoices('auto', 'move futuresight');
		battle.makeChoices();
		battle.makeChoices('auto', 'switch 2');
		damage = blissey.maxhp - blissey.hp;
		assert.bounded(damage, [18, 21]);
	});

	it(`should not consider the user's item or Ability when the user is not active`, function () {
		battle = common.createBattle([[
			{species: 'Blissey', ability: 'shellarmor', moves: ['softboiled']},
		], [
			{species: 'Wynaut', ability: 'adaptability', item: 'choicespecs', moves: ['futuresight']},
			{species: 'Deino', ability: 'powerspot', moves: ['sleeptalk']},
		]]);

		for (let i = 0; i < 3; i++) battle.makeChoices();
		const blissey = battle.p1.active[0];
		let damage = blissey.maxhp - blissey.hp;
		assert.bounded(damage, [70, 84]); // boosted by Adaptability and Choice Specs

		battle.makeChoices();
		battle.makeChoices();
		battle.makeChoices('auto', 'switch 2');
		damage = blissey.maxhp - blissey.hp;
		assert.bounded(damage, [46, 55]); // only boosted by Power Spot
	});

	it(`should not ignore the target's Unaware`, function () {
		battle = common.createBattle([[
			{species: 'Manaphy', ability: 'simple', moves: ['tailglow', 'futuresight']},
		], [
			{species: 'Ho-Oh', ability: 'unaware', moves: ['luckychant']},
		]]);

		battle.makeChoices();
		battle.makeChoices('move futuresight', 'auto');
		battle.makeChoices();
		battle.makeChoices();
		const hooh = battle.p2.active[0];
		const damage = hooh.maxhp - hooh.hp;
		assert.bounded(damage, [60, 71]); // Damage would be 236-278 if Unaware was being ignored
	});

	it(`should use the user's most recent Special Attack stat if the user is on the field`, function () {
		battle = common.createBattle([[
			{species: 'Aegislash', ability: 'stancechange', moves: ['futuresight', 'kingsshield']},
		], [
			{species: 'Ho-Oh', ability: 'shellarmor', moves: ['recover']},
		]]);

		for (let i = 0; i < 3; i++) battle.makeChoices();
		const hooh = battle.p2.active[0];
		let damage = hooh.maxhp - hooh.hp;
		assert.bounded(damage, [79, 94]); // Blade Forme damage

		battle.makeChoices();
		battle.makeChoices('move kingsshield', 'auto');
		battle.makeChoices('move kingsshield', 'auto');
		damage = hooh.maxhp - hooh.hp;
		assert.bounded(damage, [34, 41]); // Shield Forme damage
	});

	it.skip(`should use the user's most recent Special Attack stat, even if the user is not on the field`, function () {
		battle = common.createBattle([[
			{species: 'Aegislash', ability: 'stancechange', moves: ['futuresight', 'kingsshield']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Ho-Oh', ability: 'shellarmor', moves: ['recover', 'flareblitz']},
		]]);

		battle.makeChoices();
		battle.makeChoices('switch wynaut', 'auto');
		battle.makeChoices();
		const hooh = battle.p2.active[0];
		let damage = hooh.maxhp - hooh.hp;
		assert.bounded(damage, [79, 94], `Future Sight should deal Blade Forme damage, even though Aegislash switched out in Blade Forme`);

		battle.makeChoices('switch aegislash', 'auto');
		battle.makeChoices();
		battle.makeChoices('auto', 'move flareblitz');
		battle.makeChoices(); // switch in Wynaut
		battle.makeChoices();
		damage = hooh.maxhp - hooh.hp;
		assert.bounded(damage, [79, 94], `Future Sight should deal Blade Forme damage, even though Aegislash was KOed in Blade Forme.`);
	});

	it(`should only use Sp. Atk stat boosts/drops if the user is on the field`, function () {
		battle = common.createBattle([[
			{species: 'Flapple', moves: ['futuresight', 'nastyplot', 'sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Ho-Oh', ability: 'shellarmor', moves: ['recover']},
		]]);

		battle.makeChoices();
		battle.makeChoices('move nastyplot', 'auto');
		battle.makeChoices();
		const hooh = battle.p2.active[0];
		let damage = hooh.maxhp - hooh.hp;
		assert.bounded(damage, [113, 134], `Future Sight should deal damage with +2 Sp. Atk`);

		battle.makeChoices();
		battle.makeChoices('switch wynaut', 'auto');
		battle.makeChoices();
		damage = hooh.maxhp - hooh.hp;
		assert.bounded(damage, [57, 68], `Future Sight should deal damage with +0 Sp. Atk`);
	});
});
