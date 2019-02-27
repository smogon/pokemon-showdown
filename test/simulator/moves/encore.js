'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Encore', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should make Focus Punch always work while active', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[
				{species: "Smeargle", level: 50, ability: 'owntempo', moves: ['splash', 'focuspunch']},
				{species: "Magikarp", ability: 'swiftswim', moves: ['splash']},
			],
			[
				{species: "Smeargle", ability: 'owntempo', item: 'laggingtail', moves: ['encore', 'splash']},
				{species: "Zigzagoon", level: 1, ability: 'pickup', moves: ['extremespeed']},
			],
		]);

		// If the Focus Punch user is not interrupted the attack is expected to be successful.
		battle.makeChoices('move focuspunch 1, move splash', 'move splash, move extremespeed 2');
		const hp = battle.p2.active[0].hp;
		assert.notStrictEqual(hp, battle.p2.active[0].maxhp);

		// If a user's previous move was Focus Punch and it is Encored into Focus Punch while attempting to
		// execute the move, the regular "you can't be hit" effect for Focus Punch will be enforced.
		battle.makeChoices('move focuspunch 1, move splash', 'move encore, move extremespeed 1');
		assert.strictEqual(hp, battle.p2.active[0].hp);

		// The Pokemon Encored into Focus Punch is not subject to the negative effects of Focus Punch; that is,
		// if it is hit at any time before or after the Encore, it still uses Focus Punch like normal. It doesn't matter
		// in the case of Focus Punch if the user was hit before or after the Encore; Focus Punch will still always work.
		battle.makeChoices('move focuspunch 1, move splash', 'move splash, move extremespeed 1');
		assert.notStrictEqual(hp, battle.p2.active[0].hp);
	});

	it('should make Shell Trap always fail while active', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[
				{species: "Smeargle", ability: 'owntempo', moves: ['shelltrap']},
				{species: "Magikarp", ability: 'swiftswim', moves: ['splash']},
			],
			[
				{species: "Smeargle", ability: 'owntempo', moves: ['encore', 'splash']},
				{species: "Zigzagoon", ability: 'pickup', moves: ['extremespeed']},
			],
		]);

		// If the Shell Trap user is hit the attack is expected to be successful.
		battle.makeChoices('move shelltrap, move splash', 'move splash, move extremespeed 1');
		let hp = battle.p2.active[0].hp;
		assert.notStrictEqual(hp, battle.p2.active[0].maxhp);

		// If a user's previous move was Shell Trap and it is Encored into Shell Trap while attempting to
		// execute the move, the regular "you must be hit" effect for Shell Trap will be enforced
		battle.makeChoices('move shelltrap, move splash', 'move encore 1, move extremespeed 1');
		assert.notStrictEqual(hp, battle.p2.active[0].hp);
		hp = battle.p2.active[0].hp;

		// Shell Trap which has been encored will never be successful - even if it is hit with contact moves, it will never
		// attack, and will always say "<Pokemon>'s shell trap didn't work. It doesn't matter in the case of Shell Trap if
		// the user was hit before or after the Encore; Shell Trap will still always fail.
		battle.makeChoices('move shelltrap, move splash', 'move splash, move extremespeed 1');
		assert.strictEqual(hp, battle.p2.active[0].hp);
	});
});
