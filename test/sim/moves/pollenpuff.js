'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Pollen Puff', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should heal allies through Substitute, but not damage opponents through Substitute`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Wynaut", level: 1, moves: ['pollenpuff']},
			{species: "Garchomp", ability: 'compoundeyes', moves: ['superfang']},
		], [
			{species: "Wobbuffet", moves: ['pollenpuff']},
			{species: "Lucario", moves: ['substitute']},
		]]);

		battle.makeChoices('move pollenpuff 2, move superfang 2', 'move pollenpuff -2, move substitute');
		const lucario = battle.p2.active[1];

		// -1/2 from Super Fang, -1/4 from Sub, +1/2 from Pollen Puff, damaged Sub.
		assert.equal(lucario.hp, lucario.maxhp - Math.floor(lucario.maxhp / 4));
	});

	it(`should not heal a Pokemon if they have natural type immunity to Pollen Puff`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Wynaut", ability: 'normalize', moves: ['pollenpuff']},
			{species: "Froslass", moves: ['bellydrum']},
		], [
			{species: "Wobbuffet", moves: ['sleeptalk']},
			{species: "Lucario", moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move pollenpuff -2, move bellydrum', 'auto');
		assert.false.fullHP(battle.p1.active[1]);
	});

	describe(`interaction of Heal Block and Pollen Puff`, function () {
		it(`should prevent the user from targeting an ally with Pollen Puff while the user is affected by Heal Block`, function () {
			battle = common.createBattle({gameType: 'doubles'}, [[
				{species: 'bunnelby', moves: ['sleeptalk', 'pollenpuff']},
				{species: 'roggenrola', ability: 'magicbounce', moves: ['sleeptalk']},
			], [
				{species: 'scolipede', moves: ['healblock']},
				{species: 'lucario', moves: ['sleeptalk']},
			]]);

			battle.makeChoices();
			assert.cantMove(() => battle.choose('p1', 'move pollenpuff -2, move sleeptalk'));
			assert.false.cantMove(() => battle.choose('p1', 'move pollenpuff 1, move sleeptalk'));
		});

		it(`should not prevent the user from targeting an ally with Z-Pollen Puff while the user is affected by Heal Block`, function () {
			battle = common.createBattle({gameType: 'doubles'}, [[
				{species: 'bunnelby', item: 'buginiumz', moves: ['sleeptalk', 'pollenpuff']},
				{species: 'roggenrola', ability: 'magicbounce', moves: ['sleeptalk']},
			], [
				{species: 'scolipede', moves: ['healblock']},
				{species: 'lucario', moves: ['sleeptalk']},
			]]);

			battle.makeChoices();
			assert.false.cantMove(() => battle.choose('p1', 'move pollenpuff zmove -2, move sleeptalk'));
		});

		it(`should not prevent the user from targeting an ally with Pollen Puff while the target is affected by Heal Block at move selection, but it should fail at move execution`, function () {
			battle = common.createBattle({gameType: 'doubles'}, [[
				{species: 'wynaut', ability: 'magicbounce', moves: ['sleeptalk', 'pollenpuff']},
				{species: 'roggenrola', moves: ['sleeptalk']},
			], [
				{species: 'wobbuffet', moves: ['healblock']},
				{species: 'lucario', moves: ['falseswipe']},
			]]);

			battle.makeChoices();
			battle.makeChoices('move pollenpuff -2, move sleeptalk', 'move healblock, move falseswipe 2');
			assert.false.fullHP(battle.p1.active[1], `Roggenrola should not have healed from Pollen Puff`);
		});

		it(`should prevent the user from successfully using Pollen Puff into an ally if the user becomes affected by Heal Block mid-turn`, function () {
			battle = common.createBattle({gameType: 'doubles'}, [[
				{species: 'wynaut', moves: ['pollenpuff']},
				{species: 'roggenrola', ability: 'magicbounce', moves: ['sleeptalk']},
			], [
				{species: 'wobbuffet', moves: ['healblock']},
				{species: 'lucario', moves: ['falseswipe']},
			]]);

			battle.makeChoices('move pollenpuff -2, move sleeptalk', 'move healblock, move falseswipe 2');
			assert.false.fullHP(battle.p1.active[1], `Roggenrola should not have healed from Pollen Puff`);
		});

		it(`should not prevent the user from using Z-Pollen Puff into an ally`, function () {
			battle = common.createBattle({gameType: 'doubles'}, [[
				{species: 'wynaut', item: 'buginiumz', moves: ['pollenpuff']},
				{species: 'roggenrola', moves: ['sleeptalk']},
			], [
				{species: 'wobbuffet', moves: ['healblock']},
				{species: 'lucario', moves: ['sleeptalk']},
			]]);

			battle.makeChoices('move pollenpuff zmove -2, move sleeptalk', 'auto');
			assert.false.fullHP(battle.p1.active[1], `Roggenrola should have taken damage from Z-Pollen Puff`);
		});
	});
});
