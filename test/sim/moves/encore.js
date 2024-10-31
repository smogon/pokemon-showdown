'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Encore', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should cause the target to be forced to repeat its move`, function () {
		battle = common.createBattle([[
			{species: 'slowbro', moves: ['tackle', 'irondefense']},
		], [
			{species: 'whimsicott', moves: ['encore', 'sleeptalk']},
		]]);

		const whims = battle.p2.active[0];
		battle.makeChoices('move irondefense', 'move sleeptalk');
		battle.makeChoices('move tackle', 'move encore');

		assert.fullHP(whims);
		assert.cantMove(() => battle.choose('p1', 'move tackle'));
	});

	it(`should cause the target to move with its Encored attack at the priority of the originally selected move once`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'regieleki', moves: ['sleeptalk', 'substitute']},
			{species: 'pichu', moves: ['sleeptalk']},
		], [
			{species: 'whimsicott', ability: 'prankster', moves: ['sleeptalk', 'encore']},
			{species: 'terrakion', moves: ['quickattack', 'headlongrush']},
		]]);

		const eleki = battle.p1.active[0];
		battle.makeChoices('auto', 'move sleeptalk, move headlongrush 2');
		battle.makeChoices('move substitute', 'move encore -2, move quickattack 1');

		assert.fainted(eleki, `Encore + Quick Attack being selected gives Headlong Rush priority.`);
	});

	it(`should cause the target to move with its Encored attack at the priority of the originally selected move once and get blocked when appropriate`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'regieleki', moves: ['psychicterrain']},
			{species: 'pichu', moves: ['sleeptalk']},
		], [
			{species: 'whimsicott', ability: 'prankster', moves: ['sleeptalk', 'encore']},
			{species: 'terrakion', moves: ['quickattack', 'headlongrush']},
		]]);

		const eleki = battle.p1.active[0];
		battle.makeChoices('auto', 'move sleeptalk, move headlongrush 2');
		battle.makeChoices('auto', 'move encore -2, move quickattack 1');
		assert.false.fainted(eleki, `Psychic Terrain should have prevented the priority Headlong Rush from doing damage.`);

		battle.makeChoices();
		assert.fainted(eleki, `Headlong Rush should no longer be moving with priority.`);
	});

	it('should not affect Focus Punch if the the user\'s decision is not changed', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[
				{species: "Smeargle", level: 50, ability: 'owntempo', moves: ['splash', 'focuspunch']},
				{species: "Abra", level: 1, ability: 'innerfocus', moves: ['knockoff', 'teleport']},
			],
			[
				{species: "Smeargle", ability: 'owntempo', item: 'laggingtail', moves: ['encore', 'splash']},
				{species: "Zigzagoon", level: 1, ability: 'pickup', moves: ['extremespeed']},
			],
		]);

		// If the Focus Punch user is not interrupted the attack is expected to be successful.
		battle.makeChoices('move focuspunch 1, move knockoff 1', 'move splash, move extremespeed 2');
		const hp = battle.p2.active[0].hp;
		assert.notEqual(hp, battle.p2.active[0].maxhp);

		// If a user's previous move was Focus Punch and it is Encored into Focus Punch while attempting to
		// execute the move, the regular "you can't be hit" effect for Focus Punch will be enforced.
		battle.makeChoices('move focuspunch 1, move teleport', 'move encore 1, move extremespeed 1');
		assert.equal(battle.p2.active[0].hp, hp);

		// During subsequent turns the normal Focus Punch behavior applies.
		battle.makeChoices('move focuspunch 1, move teleport', 'move splash, move extremespeed 1');
		assert.equal(battle.p2.active[0].hp, hp);
	});

	it(`should make Focus Punch always succeed if it changes the user's decision`, function () {
		// Hardcoded RNG seed so the random target from Encored Focus Punch will not attack Zigzagoon
		battle = common.createBattle({gameType: 'doubles', seed: [1, 2, 3, 4]}, [[
			{species: 'Smeargle', level: 50, moves: ['splash', 'focuspunch']},
			{species: 'Abra', level: 1, moves: ['knockoff', 'teleport']},
		], [
			{species: 'Smeargle', item: 'laggingtail', moves: ['encore', 'splash']},
			{species: 'Zigzagoon', level: 1, moves: ['extremespeed']},
		]]);

		battle.makeChoices('move focuspunch 1, move knockoff 1', 'move splash, move extremespeed 2');
		const p2smeargle = battle.p2.active[0];
		let hp = p2smeargle.hp;
		assert.false.fullHP(p2smeargle);

		// The Pokemon Encored into Focus Punch is not subject to the negative effects of Focus Punch; that is,
		// if it is hit at any time before or after the Encore, it still uses Focus Punch like normal. It doesn't matter
		// in the case of Focus Punch if the user was hit before or after the Encore; Focus Punch will still always work.
		battle.makeChoices('move splash, move teleport', 'move encore 1, move extremespeed 1');
		assert.notEqual(p2smeargle.hp, hp);
		hp = p2smeargle.hp;

		// During subsequent turns the normal Focus Punch behavior applies.
		battle.makeChoices('move focuspunch 1, move teleport', 'move splash, move extremespeed 1');
		assert.equal(p2smeargle.hp, hp);
	});

	it('should not affect Shell Trap if the user\'s decision is not changed', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[
				{species: "Smeargle", level: 99, ability: 'owntempo', moves: ['shelltrap', 'splash']},
				{species: "Abra", level: 1, ability: 'innerfocus', moves: ['knockoff', 'teleport']},
			],
			[
				{species: "Smeargle", ability: 'owntempo', item: 'laggingtail', moves: ['encore', 'splash']},
				{species: "Zigzagoon", ability: 'pickup', item: 'assaultvest', moves: ['quickattack']},
			],
		]);

		// If the Shell Trap user is hit the attack is expected to be successful.
		battle.makeChoices('move shelltrap, move knockoff 1', 'move splash, move quickattack 1');
		let hp = battle.p2.active[0].hp;
		assert.notEqual(hp, battle.p2.active[0].maxhp);

		// If a user's previous move was Shell Trap and it is Encored into Shell Trap while attempting to
		// execute the move, the regular "you must be hit" effect for Shell Trap will be enforced
		battle.makeChoices('move shelltrap, move teleport', 'move encore 1, move quickattack 1');
		assert.notEqual(battle.p2.active[0].hp, hp);
		hp = battle.p2.active[0].hp;

		// During subesquent turns the normal Shell Trap behavior applies.
		battle.makeChoices('move shelltrap, move teleport', 'move splash, move quickattack 1');
		assert.notEqual(battle.p2.active[0].hp, hp);
	});

	it('should make Shell Trap always fail if the user\'s decision is changed', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[
				{species: "Smeargle", level: 99, ability: 'owntempo', moves: ['splash', 'shelltrap']},
				{species: "Abra", level: 1, ability: 'innerfocus', moves: ['knockoff', 'teleport']},
			],
			[
				{species: "Smeargle", ability: 'owntempo', item: 'laggingtail', moves: ['encore', 'splash']},
				{species: "Zigzagoon", ability: 'pickup', item: 'assaultvest', moves: ['quickattack']},
			],
		]);

		// If the Shell Trap user is hit the attack is expected to be successful.
		battle.makeChoices('move shelltrap, move knockoff 1', 'move splash, move quickattack 1');
		const hp = battle.p2.active[0].hp;
		assert.notEqual(hp, battle.p2.active[0].maxhp);

		// Shell Trap which has been encored will never be successful - even if it is hit with contact moves, it will never
		// attack, and will always say "<Pokemon>'s shell trap didn't work. It doesn't matter in the case of Shell Trap if
		// the user was hit before or after the Encore; Shell Trap will still always fail.
		battle.makeChoices('move splash, move teleport', 'move encore 1, move quickattack 1');
		assert.equal(battle.p2.active[0].hp, hp);

		// During subsequent turns the normal Shell Trap behavior applies.
		battle.makeChoices('move shelltrap, move teleport', 'move splash, move quickattack 1');
		assert.notEqual(battle.p2.active[0].hp, hp);
	});

	it(`should not cause self-targeting moves to redirect to the opponent`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Wynaut", moves: ['destinybond', 'counter']},
			{species: "Octillery", moves: ['sleeptalk']},
		], [
			{species: "Raichu", moves: ['sleeptalk', 'encore']},
			{species: "Raichu", moves: ['sleeptalk', 'aerialace']},
		]]);

		battle.makeChoices();
		// This causes the Counter redirection and Encore redirection to screw up somehow
		battle.makeChoices('move counter, move sleeptalk', 'move encore 1, move aerialace 1');
		assert(battle.log.every(line => !line.includes('Raichu|Destiny Bond')));
	});
});

describe('Encore [Gen 2]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`[Gen 2] Encore succeeds when used against an opponent that last attacked before the Encore user switched in`, function () {
		battle = common.gen(2).createBattle({forceRandomChance: true}, [[
			{species: 'slowbro', moves: ['glare']},
			{species: 'fearow', moves: ['encore']},
		], [
			{species: 'chansey', moves: ['seismictoss']},
		]]);
		const chansey = battle.p2.active[0];
		battle.makeChoices();
		battle.makeChoices('switch 2', 'auto');
		// Chansey is fully paralysed
		assert.fullHP(battle.p1.active[0]);
		battle.makeChoices();
		assert.equal(chansey.volatiles['encore'].move, 'seismictoss');
	});
});
