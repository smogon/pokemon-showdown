'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Symbiosis', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should share its item with its ally`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Smeargle', ability: 'symbiosis', item: 'enigmaberry', moves: ['sleeptalk'] },
			{ species: 'Latias', ability: 'levitate', item: 'weaknesspolicy', moves: ['sleeptalk'] },
		], [
			{ species: 'Smeargle', moves: ['crunch'] },
			{ species: 'Smeargle', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('auto', 'move crunch 2, auto');
		assert.false.holdsItem(battle.p1.active[0]);
		assert.equal(battle.p1.active[1].item, 'enigmaberry');
	});

	it('should not share an item required to change forme', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [
			[{ species: 'Smeargle', ability: 'symbiosis', item: 'latiasite', moves: ['snarl'] }, { species: 'Latias', ability: 'levitate', item: 'weaknesspolicy', moves: ['snarl'] }],
			[{ species: 'Smeargle', moves: ['snarl'] }, { species: 'Smeargle', moves: ['snarl'] }],
		]);
		battle.makeChoices('move snarl, move snarl', 'move snarl, move snarl');
		assert.equal(battle.p1.active[0].item, 'latiasite');
		assert.equal(battle.p1.active[1].item, '');
	});

	it('should not consume two White Herbs in one boost', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Smeargle', item: 'whiteherb', moves: ['sleeptalk'] },
			{ species: 'Oranguru', ability: 'symbiosis', item: 'whiteherb', moves: ['sleeptalk'] },
		], [
			{ species: 'Murkrow', moves: ['screech'] },
			{ species: 'Smeargle', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		battle.makeChoices();
		assert.equal(battle.p1.active[0].boosts.def, 0);
	});

	it('during switches, should trigger right after the item is consumed', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Smeargle', ability: 'symbiosis', item: 'lifeorb', moves: ['sleeptalk'] },
			{ species: 'Roaring Moon', ability: 'protosynthesis', item: 'boosterenergy', moves: ['sleeptalk'] },
		], [
			{ species: 'Raging Bolt', ability: 'protosynthesis', item: 'boosterenergy', moves: ['sleeptalk'] },
			{ species: 'Smeargle', moves: ['sleeptalk'] },
		]]);
		assert.equal(battle.p1.active[1].item, 'lifeorb');
		const log = battle.getDebugLog();
		const symbiosisIndex = log.lastIndexOf('|-activate|p1a: Smeargle|ability: Symbiosis');
		const protosynthesisIndex = log.lastIndexOf('|-activate|p1b: Roaring Moon|ability: Protosynthesis');
		assert(symbiosisIndex < protosynthesisIndex, 'Symbiosis should trigger before Protosynthesis');
	});

	it('during moves, should trigger after the action is concluded', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Smeargle', ability: 'symbiosis', item: 'lifeorb', moves: ['sleeptalk'] },
			{ species: 'Venusaur', ability: 'overgrow', item: 'powerherb', moves: ['solarbeam'] },
		], [
			{ species: 'Smeargle', moves: ['sleeptalk'] },
			{ species: 'Smeargle', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		const venusaur = battle.p1.active[1];
		assert.equal(venusaur.item, 'lifeorb');
		assert.fullHP(venusaur);
	});

	it('should not trigger on an ally losing their Eject Button', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'oranguru', ability: 'symbiosis', item: 'leftovers', moves: ['sleeptalk'] },
			{ species: 'wynaut', item: 'ejectbutton', moves: ['sleeptalk'] },
			{ species: 'corphish', moves: ['sleeptalk'] },
		], [
			{ species: 'wynaut', moves: ['tackle'] },
			{ species: 'wynaut', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('auto', 'move tackle 2, move sleeptalk');

		assert.equal(battle.p1.active[0].item, 'leftovers');
		assert.equal(battle.p1.active[1].item, '');
	});

	it(`should not trigger on an ally using their Eject Pack`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'oranguru', ability: 'symbiosis', item: 'leftovers', moves: ['sleeptalk'] },
			{ species: 'wynaut', item: 'ejectpack', moves: ['superpower'] },
			{ species: 'corphish', moves: ['sleeptalk'] },
		], [
			{ species: 'wynaut', moves: ['tackle'] },
			{ species: 'wynaut', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();

		assert.equal(battle.p1.active[0].item, 'leftovers');
		assert.equal(battle.p1.active[1].item, '');
	});

	describe('[Gen 6]', () => {
		it('during moves, should trigger right after the item is consumed', () => {
			battle = common.gen(6).createBattle({ gameType: 'doubles' }, [[
				{ species: 'Smeargle', ability: 'symbiosis', item: 'lifeorb', moves: ['sleeptalk'] },
				{ species: 'Venusaur', ability: 'overgrow', item: 'powerherb', moves: ['solarbeam'] },
			], [
				{ species: 'Smeargle', moves: ['sleeptalk'] },
				{ species: 'Smeargle', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			const venusaur = battle.p1.active[1];
			assert.equal(venusaur.item, 'lifeorb');
			assert.false.fullHP(venusaur);
		});

		it('should not consume a second Gem in the same turn', () => {
			battle = common.gen(6).createBattle({ gameType: 'doubles' }, [[
				{ species: 'Smeargle', ability: 'symbiosis', item: 'electricgem', moves: ['sleeptalk'] },
				{ species: 'Venusaur', ability: 'overgrow', item: 'electricgem', moves: ['thunderbolt'] },
			], [
				{ species: 'Smeargle', moves: ['sleeptalk'] },
				{ species: 'Smeargle', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			assert.equal(battle.p1.active[0].item, '');
			assert.equal(battle.p1.active[1].item, 'electricgem');
		});

		it('should trigger on an ally losing their Eject Button', () => {
			battle = common.gen(6).createBattle({ gameType: 'doubles' }, [[
				{ species: 'oranguru', ability: 'symbiosis', item: 'leftovers', moves: ['sleeptalk'] },
				{ species: 'wynaut', item: 'ejectbutton', moves: ['sleeptalk'] },
				{ species: 'corphish', moves: ['sleeptalk'] },
			], [
				{ species: 'wynaut', moves: ['tackle'] },
				{ species: 'wynaut', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('auto', 'move tackle 2, move sleeptalk');

			assert.equal(battle.p1.active[0].item, '');
			assert.equal(battle.p1.active[1].item, 'leftovers');
		});

		// See Marty's research for many more examples: https://www.smogon.com/forums/threads/battle-mechanics-research.3489239/post-6401506
		describe.skip('Symbiosis Eject Button Glitch', () => {
			it('should cause Leftovers to restore HP 4 times', () => {
				battle = common.gen(6).createBattle({ gameType: 'doubles' }, [[
					{ species: 'florges', ability: 'symbiosis', item: 'leftovers', moves: ['sleeptalk'] },
					{ species: 'roggenrola', level: 50, ability: 'sturdy', item: 'ejectbutton', moves: ['sleeptalk'] },
					{ species: 'corphish', moves: ['sleeptalk'] },
				], [
					{ species: 'wynaut', moves: ['sleeptalk', 'closecombat'] },
					{ species: 'wynaut', moves: ['sleeptalk'] },
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

			it('should cause Choice items to apply 2 times', () => {
				battle = common.gen(6).createBattle({ gameType: 'doubles' }, [[
					{ species: 'florges', ability: 'symbiosis', item: 'choiceband', moves: ['sleeptalk'] },
					{ species: 'roggenrola', evs: { atk: 8 }, item: 'ejectbutton', moves: ['smackdown'] },
					{ species: 'corphish', moves: ['sleeptalk'] },
				], [
					{ species: 'wynaut', moves: ['sleeptalk', 'tackle'] },
					{ species: 'torkoal', moves: ['sleeptalk'] },
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
});
