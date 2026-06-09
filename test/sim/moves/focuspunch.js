'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Focus Punch', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should cause the user to lose focus if hit by an attacking move`, () => {
		battle = common.createBattle([[
			{ species: 'Chansey', moves: ['focuspunch'] },
		], [
			{ species: 'Venusaur', moves: ['magicalleaf'] },
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p2.active[0]);
	});

	it(`should not cause the user to lose focus if hit by a status move`, () => {
		battle = common.createBattle([[
			{ species: 'Chansey', moves: ['focuspunch'] },
		], [
			{ species: 'Venusaur', moves: ['growl'] },
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
	});

	it(`should not cause the user to lose focus if hit while behind a substitute`, () => {
		battle = common.createBattle([[
			{ species: 'Chansey', moves: ['substitute', 'focuspunch'] },
		], [
			{ species: 'Venusaur', moves: ['magicalleaf'] },
		]]);
		battle.makeChoices();
		battle.makeChoices('move focuspunch', 'auto');
		assert.false.fullHP(battle.p2.active[0]);
	});

	it(`should cause the user to lose focus if hit by a move called by Nature Power`, () => {
		battle = common.createBattle([[
			{ species: 'Chansey', moves: ['focuspunch'] },
		], [
			{ species: 'Venusaur', moves: ['naturepower'] },
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p2.active[0]);
	});

	it(`should not cause the user to lose focus on later uses of Focus Punch if hit`, () => {
		battle = common.createBattle([[
			{ species: 'Chansey', moves: ['focuspunch'] },
		], [
			{ species: 'Venusaur', moves: ['magicalleaf', 'growl'] },
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p2.active[0]);
		battle.makeChoices('auto', 'move growl');
		assert.false.fullHP(battle.p2.active[0]);
	});

	it(`should cause the user to lose focus if hit by an attacking move followed by a status move in one turn`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Chansey', ability: 'naturalcure', moves: ['focuspunch'] },
			{ species: 'Blissey', ability: 'naturalcure', moves: ['softboiled'] },
		], [
			{ species: 'Venusaur', ability: 'overgrow', moves: ['magicalleaf'] },
			{ species: 'Ivysaur', ability: 'overgrow', moves: ['toxic'] },
		]]);
		battle.makeChoices('move focuspunch 1, move softboiled', 'move magicalleaf 1, move toxic 1');
		assert.equal(battle.p1.active[0].status, 'tox');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it(`should not deduct PP if the user lost focus`, () => {
		battle = common.createBattle([[
			{ species: 'Chansey', moves: ['focuspunch'] },
		], [
			{ species: 'Venusaur', moves: ['magicalleaf', 'growl'] },
		]]);
		const move = battle.p1.active[0].getMoveData(Dex.moves.get('focuspunch'));
		battle.makeChoices();
		assert.equal(move.pp, move.maxpp);
		battle.makeChoices('auto', 'move growl');
		assert.equal(move.pp, move.maxpp - 1);
	});

	it(`should display a message indicating the Pokemon is tightening focus`, () => {
		battle = common.createBattle([[
			{ species: 'Chansey', moves: ['focuspunch'] },
		], [
			{ species: 'Venusaur', moves: ['magicalleaf'] },
		]]);

		battle.makeChoices();
		const tighteningFocusMessage = battle.log.indexOf('|-singleturn|p1a: Chansey|move: Focus Punch');
		assert(tighteningFocusMessage > 0);
	});

	it(`should not tighten the Pokemon's focus when Dynamaxing or already Dynamaxed`, () => {
		battle = common.gen(8).createBattle([[
			{ species: 'Chansey', moves: ['focuspunch'] },
		], [
			{ species: 'Venusaur', moves: ['magicalleaf'] },
		]]);

		battle.makeChoices('move focuspunch dynamax', 'auto');
		battle.makeChoices('move focuspunch', 'auto');
		const tighteningFocusMessage = battle.log.indexOf('|-singleturn|p1a: Chansey|move: Focus Punch');
		assert(tighteningFocusMessage < 0);
	});

	it(`should tighten focus after switches`, () => {
		battle = common.createBattle([[
			{ species: 'salamence', moves: ['focuspunch'] },
		], [
			{ species: 'mew', moves: ['sleeptalk'] },
			{ species: 'wynaut', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices('move focuspunch', 'switch 2');
		const log = battle.getDebugLog();
		const focusPunchChargeIndex = log.indexOf('|-singleturn|');
		const switchIndex = log.indexOf('|switch|p2a: Wynaut');
		assert(focusPunchChargeIndex > switchIndex, `Focus Punch's charge message should occur after switches`);
	});

	it('should not be affected by Encore if the user\'s decision is not changed', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: "Smeargle", level: 50, ability: 'owntempo', moves: ['splash', 'focuspunch'] },
			{ species: "Abra", level: 1, ability: 'innerfocus', moves: ['knockoff', 'teleport'] },
		], [
			{ species: "Smeargle", ability: 'owntempo', item: 'laggingtail', moves: ['encore', 'splash'] },
			{ species: "Zigzagoon", level: 1, ability: 'pickup', moves: ['extremespeed'] },
		]]);

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

	it(`should always succeed if Encored into Focus Punch`, () => {
		// Hardcoded RNG seed so the random target from Encored Focus Punch will not attack Zigzagoon
		battle = common.createBattle({ gameType: 'doubles', seed: [1, 2, 3, 4] }, [[
			{ species: 'Smeargle', level: 50, moves: ['splash', 'focuspunch'] },
			{ species: 'Abra', level: 1, moves: ['knockoff', 'teleport'] },
		], [
			{ species: 'Smeargle', item: 'laggingtail', moves: ['encore', 'splash'] },
			{ species: 'Zigzagoon', level: 1, moves: ['extremespeed'] },
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

	it.skip(`can lose focus if Encored out of Focus Punch`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Smeargle', moves: ['focuspunch', 'growl'] },
			{ species: 'Abra', moves: ['sleeptalk'] },
		], [
			{ species: 'Smeargle', moves: ['sleeptalk', 'encore'] },
			{ species: 'Zigzagoon', moves: ['sleeptalk', 'tackle'] },
		]]);
		battle.makeChoices('move growl, move sleeptalk', 'auto');
		battle.makeChoices('auto', 'move encore 1, move tackle 1');
		assert.equal(battle.p2.active[0].boosts.atk, -1);
	});

	describe('[Gen 4]', () => {
		it(`should cause the user to lose focus if hit by an attacking move`, () => {
			// same test
			battle = common.gen(4).createBattle([[
				{ species: 'Chansey', moves: ['focuspunch'] },
			], [
				{ species: 'Venusaur', moves: ['magicalleaf'] },
			]]);
			battle.makeChoices();
			assert.fullHP(battle.p2.active[0]);
		});

		it(`should deduct PP if the user lost focus`, () => {
			battle = common.gen(4).createBattle([[
				{ species: 'Chansey', moves: ['focuspunch'] },
			], [
				{ species: 'Venusaur', moves: ['magicalleaf', 'growl'] },
			]]);
			const move = battle.p1.active[0].getMoveData(Dex.moves.get('focuspunch'));
			battle.makeChoices();
			assert.equal(move.pp, move.maxpp - 1);
			battle.makeChoices('auto', 'move growl');
			assert.equal(move.pp, move.maxpp - 2);
		});

		it(`should tighten focus before switches`, () => {
			battle = common.gen(4).createBattle([[
				{ species: 'salamence', moves: ['focuspunch'] },
			], [
				{ species: 'mew', moves: ['sleeptalk'] },
				{ species: 'wynaut', moves: ['sleeptalk'] },
			]]);

			battle.makeChoices('move focuspunch', 'switch 2');
			const log = battle.getDebugLog();
			const focusPunchChargeIndex = log.indexOf('|-singleturn|');
			const switchIndex = log.indexOf('|switch|p2a: Wynaut');
			assert(focusPunchChargeIndex < switchIndex, `Focus Punch's charge message should occur before switches`);
		});

		it(`can lose focus if Encored into Focus Punch`, () => {
			battle = common.gen(4).createBattle({ gameType: 'doubles' }, [[
				{ species: 'Wynaut', moves: ['focuspunch', 'growl'] },
				{ species: 'Abra', moves: ['sleeptalk'] },
			], [
				{ species: 'Smeargle', moves: ['sleeptalk', 'encore'] },
				{ species: 'Zigzagoon', moves: ['sleeptalk', 'tackle'] },
			]]);
			battle.makeChoices('move focuspunch -2, move sleeptalk', 'auto');
			battle.makeChoices('move growl, move sleeptalk', 'move encore 1, move tackle 1');
			assert.fullHP(battle.p2.active[0]);
			assert.fullHP(battle.p2.active[1]);
			assert.equal(battle.p2.active[0].boosts.atk, 0);
		});

		it(`should not lose focus if Encored out of Focus Punch`, () => {
			battle = common.gen(4).createBattle({ gameType: 'doubles' }, [[
				{ species: 'Smeargle', moves: ['focuspunch', 'growl'] },
				{ species: 'Abra', moves: ['sleeptalk'] },
			], [
				{ species: 'Smeargle', moves: ['sleeptalk', 'encore'] },
				{ species: 'Zigzagoon', moves: ['sleeptalk', 'tackle'] },
			]]);
			battle.makeChoices('move growl, move sleeptalk', 'auto');
			battle.makeChoices('auto', 'move encore 1, move tackle 1');
			assert.equal(battle.p2.active[0].boosts.atk, -2);
		});
	});
});
