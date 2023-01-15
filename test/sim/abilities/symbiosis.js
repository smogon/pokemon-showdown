'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Symbiosis', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should share its item with its ally`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Smeargle', ability: 'symbiosis', item: 'enigmaberry', moves: ['sleeptalk']},
			{species: 'Latias', ability: 'levitate', item: 'weaknesspolicy', moves: ['sleeptalk']},
		], [
			{species: 'Smeargle', moves: ['crunch']},
			{species: 'Smeargle', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('auto', 'move crunch 2, auto');
		assert.false.holdsItem(battle.p1.active[0]);
		assert.equal(battle.p1.active[1].item, 'enigmaberry');
	});

	it('should not share an item required to change forme', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: 'Smeargle', ability: 'symbiosis', item: 'latiasite', moves: ['snarl']}, {species: 'Latias', ability: 'levitate', item: 'weaknesspolicy', moves: ['snarl']}],
			[{species: 'Smeargle', moves: ['snarl']}, {species: 'Smeargle', moves: ['snarl']}],
		]);
		battle.makeChoices('move snarl, move snarl', 'move snarl, move snarl');
		assert.equal(battle.p1.active[0].item, 'latiasite');
		assert.equal(battle.p1.active[1].item, '');
	});

	it('should not trigger on an ally losing their Eject Button in Generation 7 or later', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'oranguru', ability: 'symbiosis', item: 'leftovers', moves: ['sleeptalk']},
			{species: 'wynaut', item: 'ejectbutton', moves: ['sleeptalk']},
			{species: 'corphish', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', moves: ['tackle']},
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('auto', 'move tackle 2, move sleeptalk');

		assert.equal(battle.p1.active[0].item, 'leftovers');
		assert.equal(battle.p1.active[1].item, '');
	});

	it('should trigger on an ally losing their Eject Button in Generation 6', function () {
		battle = common.gen(6).createBattle({gameType: 'doubles'}, [[
			{species: 'oranguru', ability: 'symbiosis', item: 'leftovers', moves: ['sleeptalk']},
			{species: 'wynaut', item: 'ejectbutton', moves: ['sleeptalk']},
			{species: 'corphish', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', moves: ['tackle']},
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('auto', 'move tackle 2, move sleeptalk');

		assert.equal(battle.p1.active[0].item, '');
		assert.equal(battle.p1.active[1].item, 'leftovers');
	});

	// See Marty's research for many more examples: https://www.smogon.com/forums/threads/battle-mechanics-research.3489239/post-6401506
	describe.skip('Symbiosis Eject Button Glitch (Gen 6 only)', function () {
		it('should cause Leftovers to restore HP 4 times', function () {
			battle = common.gen(6).createBattle({gameType: 'doubles'}, [[
				{species: 'florges', ability: 'symbiosis', item: 'leftovers', moves: ['sleeptalk']},
				{species: 'roggenrola', level: 50, ability: 'sturdy', item: 'ejectbutton', moves: ['sleeptalk']},
				{species: 'corphish', moves: ['sleeptalk']},
			], [
				{species: 'wynaut', moves: ['sleeptalk', 'closecombat']},
				{species: 'wynaut', moves: ['sleeptalk']},
			]]);

			battle.makeChoices('auto', 'move closecombat 2, move sleeptalk');
			assert.equal(battle.p1.active[0].item, '');
			assert.equal(battle.p1.active[1].item, 'leftovers');
			battle.makeChoices('switch 3');
			battle.makeChoices('move sleeptalk, switch 3', 'auto');

			// Close Combat brought Roggenrola down to Sturdy = 1 HP
			const roggenrola = battle.p1.active[1];
			const targetHP = 1 + (Math.floor(roggenrola.maxhp / 16) * 4);
			assert.equal(targetHP, roggenrola.hp);
		});

		it('should cause Choice items to apply 2 times', function () {
			battle = common.gen(6).createBattle({gameType: 'doubles'}, [[
				{species: 'florges', ability: 'symbiosis', item: 'choiceband', moves: ['sleeptalk']},
				{species: 'roggenrola', evs: {atk: 8}, item: 'ejectbutton', moves: ['smackdown']},
				{species: 'corphish', moves: ['sleeptalk']},
			], [
				{species: 'wynaut', moves: ['sleeptalk', 'tackle']},
				{species: 'torkoal', moves: ['sleeptalk']},
			]]);

			battle.makeChoices('auto', 'move tackle 2, move sleeptalk');
			battle.makeChoices('switch 3');
			battle.makeChoices('move sleeptalk, switch 3', 'auto');
			battle.makeChoices('move sleeptalk, move smackdown 1', 'auto');

			// Choice Band applied twice, effectively making Roggenrola's Attack 423
			const wynaut = battle.p2.active[0];
			const damage = wynaut.maxhp - wynaut.hp;
			assert.bounded(damage, [172, 204]);
		});
	});
});
