'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('[Gen 1] Haze', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should remove stat changes', function () {
		battle = common.gen(1).createBattle([
			[{species: "Mew", moves: ['agility', 'haze']}],
			[{species: "Mewtwo", moves: ['swordsdance', 'splash']}],
		]);

		battle.makeChoices('move agility', 'move swordsdance');
		assert.equal(battle.p1.active[0].boosts.spe, 2);
		assert.equal(battle.p2.active[0].boosts.atk, 2);

		battle.makeChoices('move haze', 'move splash');
		assert.equal(battle.p1.active[0].boosts.spe, 0);
		assert.equal(battle.p2.active[0].boosts.atk, 0);
	});

	it(`should remove opponent's status`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'Mew', moves: ['thunderwave', 'haze']},
		], [
			{species: 'Mewtwo', moves: ['splash']},
		]]);

		battle.makeChoices('move thunderwave', 'move splash');
		assert.equal(battle.p2.active[0].status, 'par');

		battle.makeChoices('move haze', 'move splash');
		assert.equal(battle.p2.active[0].status, '');
	});

	it(`should not remove the user's status`, function () {
		battle = common.gen(1).createBattle({forceRandomChance: false}, [[
			{species: 'Mew', moves: ['recover']},
		], [
			{species: 'Mewtwo', moves: ['haze']},
		]]);

		const mewtwo = battle.p2.active[0];
		mewtwo.setStatus('par');

		battle.makeChoices();
		assert.equal(battle.p2.active[0].status, 'par');
	});

	it('should remove focus energy', function () {
		battle = common.gen(1).createBattle([
			[{species: "Mew", moves: ['splash']}],
			[{species: "Mewtwo", moves: ['focusenergy', 'haze']}],
		]);

		battle.makeChoices('move splash', 'move focusenergy');
		assert(battle.p2.active[0].volatiles['focusenergy']);

		battle.makeChoices('move splash', 'move haze');
		assert.equal(typeof battle.p2.active[0].volatiles['focusenergy'], 'undefined');
	});

	it('should remove reflect and light screen', function () {
		battle = common.gen(1).createBattle([
			[{species: "Mew", moves: ['reflect', 'lightscreen', 'haze']}],
			[{species: "Mewtwo", moves: ['splash']}],
		]);

		battle.makeChoices('move reflect', 'move splash');
		assert(battle.p1.active[0].volatiles['reflect']);

		battle.makeChoices('move lightscreen', 'move splash');
		assert(battle.p1.active[0].volatiles['lightscreen']);

		battle.makeChoices('move haze', 'move splash');
		assert.equal(typeof battle.p1.active[0].volatiles['reflect'], 'undefined');
		assert.equal(typeof battle.p1.active[0].volatiles['lightscreen'], 'undefined');
	});

	it(`should remove Leech Seed and confusion`, function () {
		battle = common.gen(1).createBattle({forceRandomChance: true}, [[
			{species: 'Mew', moves: ['leechseed', 'confuse ray', 'haze']},
		], [
			{species: 'Muk', moves: ['splash']},
		]]);
		const mukVolatiles = battle.p2.active[0].volatiles;

		battle.makeChoices('move leechseed', 'auto');
		assert('leechseed' in mukVolatiles);
		battle.makeChoices('move confuse ray', 'auto');
		assert('confusion' in mukVolatiles);

		battle.makeChoices('move haze', 'auto');
		assert.false('leechseed' in mukVolatiles);
		assert.false('confusion' in mukVolatiles);
	});

	it(`should remove Disable`, function () {
		battle = common.gen(1).createBattle({forceRandomChance: true}, [[
			{species: 'Mew', moves: ['disable', 'haze', 'splash']},
		], [
			{species: 'Muk', moves: ['splash', 'tackle']},
		]]);

		const p2volatiles = battle.p2.active[0].volatiles;

		battle.makeChoices('move disable', 'move tackle');
		assert('disable' in p2volatiles);

		battle.makeChoices('move haze', 'auto');
		assert.false('disable' in p2volatiles);
	});

	it(`should still make previously disabled Pokemon (on the same turn) with 1 move use Struggle`, function () {
		battle = common.gen(1).createBattle({forceRandomChance: true}, [[
			{species: 'Mew', moves: ['disable', 'haze']},
		], [
			{species: 'Muk', moves: ['tackle']},
		]]);
		const p2volatiles = battle.p2.active[0].volatiles;
		battle.makeChoices('move disable', 'auto');
		assert('disable' in p2volatiles);

		battle.makeChoices('move haze', 'auto');
		assert.equal(battle.lastMove.name, 'Struggle');
	});

	it(`should convert toxic poisoning to regular poisoning for the user and effectively reset the toxic counter`, function () {
		battle = common.gen(1).createBattle({forceRandomChance: true}, [[
			{species: 'Mew', moves: ['toxic']},
		], [
			{species: 'Abra', moves: ['haze']},
		]]);
		const abra = battle.p2.active[0];
		battle.makeChoices();
		assert.equal(abra.status, 'psn');
		battle.makeChoices();
		assert.equal(abra.maxhp - abra.hp, Math.floor(abra.maxhp / 16) * 2);
	});

	it('should not remove substitute from either side', function () {
		battle = common.gen(1).createBattle([
			[{species: "Mew", moves: ['substitute', 'haze']}],
			[{species: "Muk", moves: ['substitute', 'splash']}],
		]);

		battle.makeChoices('move substitute', 'move substitute');
		battle.makeChoices('move haze', 'move splash');
		assert('substitute' in battle.p1.active[0].volatiles);
		assert('substitute' in battle.p2.active[0].volatiles);
	});

	it.skip('should not allow a previously sleeping opponent to move on the same turn', function () {
		battle = common.gen(1).createBattle([
			[{species: "Mew", moves: ['spore', 'haze', 'tackle']}],
			[{species: "Muk", moves: ['splash']}],
		]);
		battle.makeChoices('move spore', 'auto');
		battle.makeChoices('move haze', 'auto');
		assert.equal(battle.lastMove.name, 'Haze');
		battle.makeChoices('move tackle', 'auto');
		// Muk should be able to move the next turn
		assert.equal(battle.lastMove.name, 'Splash');
	});

	it.skip('should not allow a previously frozen opponent to move on the same turn', function () {
		battle = common.gen(1).createBattle([
			[{species: "Mew", moves: ['haze', 'icebeam']}],
			[{species: "Muk", moves: ['splash']}],
		]);
		battle.p2.active[0].trySetStatus('frz', battle.p2.active[0]);
		battle.makeChoices('move icebeam', 'auto');
		assert.equal(battle.p2.active[0].status, 'frz');
		battle.makeChoices('move haze', 'auto');
		assert.equal(battle.lastMove.name, 'Haze');
	});
});
