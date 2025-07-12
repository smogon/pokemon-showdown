'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Klutz', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should negate residual healing events', () => {
		battle = common.createBattle([[
			{ species: "Lopunny", ability: 'klutz', item: 'leftovers', moves: ['bellydrum'] },
		], [
			{ species: "Giratina", ability: 'pressure', moves: ['shadowsneak'] },
		]]);
		const klutzMon = battle.p1.active[0];
		assert.hurtsBy(klutzMon, Math.floor(klutzMon.maxhp / 2), () => battle.makeChoices('move bellydrum', 'move shadowsneak'), "Leftovers healing should not apply");
	});

	it('should prevent items from being consumed', () => {
		battle = common.createBattle([[
			{ species: "Lopunny", level: 1, ability: 'klutz', item: 'sitrusberry', moves: ['endure'] },
		], [
			{ species: "Deoxys", ability: 'noguard', moves: ['psychic'] },
		]]);
		const klutzMon = battle.p1.active[0];
		assert.constant(() => klutzMon.item, () => battle.makeChoices('move endure', 'move psychic'));
		assert.equal(klutzMon.hp, 1);
	});

	it('should ignore the effects of items that disable moves', () => {
		battle = common.createBattle([[
			{ species: "Lopunny", ability: 'klutz', item: 'assaultvest', moves: ['protect'] },
		], [
			{ species: "Deoxys", ability: 'noguard', moves: ['psychic'] },
		]]);
		battle.makeChoices('move protect', 'move psychic');
		assert.equal(battle.p1.active[0].lastMove.id, 'protect');
	});

	it('should not ignore item effects that prevent item removal', () => {
		battle = common.createBattle([[
			{ species: "Genesect", ability: 'klutz', item: 'dousedrive', moves: ['calmmind'] },
		], [
			{ species: "Deoxys", ability: 'noguard', moves: ['trick'] },
		]]);
		const klutzMon = battle.p1.active[0];
		assert.constant(() => klutzMon.item, () => battle.makeChoices('move calmmind', 'move trick'));
	});

	it('should cause Fling to fail', () => {
		battle = common.createBattle([[
			{ species: "Lopunny", ability: 'klutz', item: 'seaincense', moves: ['fling'] },
		], [
			{ species: "Deoxys", ability: 'noguard', moves: ['calmmind'] },
		]]);
		const klutzMon = battle.p1.active[0];
		assert.constant(() => klutzMon.item, () => battle.makeChoices('move fling', 'move calmmind'));
	});

	it('should cause Fling to fail even if the item ignores Klutz', () => {
		battle = common.createBattle([[
			{ species: "Lopunny", ability: 'klutz', item: 'abilityshield', moves: ['fling'] },
		], [
			{ species: "Deoxys", ability: 'noguard', moves: ['calmmind'] },
		]]);
		const klutzMon = battle.p1.active[0];
		assert.constant(() => klutzMon.item, () => battle.makeChoices('move fling', 'move calmmind'));
	});

	it('should consume berries received by Fling', () => {
		battle = common.createBattle([[
			{ species: "Lopunny", ability: 'klutz', moves: ['sleeptalk'] },
		], [
			{ species: "Wynaut", item: 'sitrusberry', moves: ['fling'] },
		]]);
		battle.makeChoices();
		assert.false(battle.p2.active[0].item);
		assert.fullHP(battle.p1.active[0]);
	});

	it('should let effects of items received by Fling activate', () => {
		battle = common.createBattle([[
			{ species: "Lopunny", ability: 'klutz', moves: ['sleeptalk'] },
		], [
			{ species: "Wynaut", item: 'toxicorb', moves: ['fling'] },
		]]);
		battle.makeChoices();
		assert.false(battle.p2.active[0].item);
		assert.equal(battle.p1.active[0].status, 'tox');
	});

	it('should activate berries after consuming them with Bug Bite', () => {
		battle = common.createBattle([[
			{ species: "Lopunny", level: 1, ability: 'klutz', moves: ['endure', 'bugbite'] },
		], [
			{ species: "Deoxys", ability: 'noguard', item: 'sitrusberry', moves: ['psychic', 'sleeptalk'] },
		]]);
		battle.makeChoices();
		battle.makeChoices('move bugbite', 'move sleeptalk');
		assert.false(battle.p2.active[0].item);
		assert(battle.p1.active[0].hp > 1);
	});

	it('should not prevent Pokemon from Mega Evolving', () => {
		battle = common.createBattle([[
			{ species: "Lopunny", ability: 'klutz', item: 'lopunnite', moves: ['protect'] },
		], [
			{ species: "Deoxys", ability: 'noguard', moves: ['calmmind'] },
		]]);
		battle.makeChoices('move protect mega', 'move calmmind');
		assert.species(battle.p1.active[0], 'Lopunny-Mega');
	});

	describe('[Gen 4]', () => {
		it('should not cause Fling to fail', () => {
			battle = common.gen(4).createBattle([[
				{ species: "Lopunny", ability: 'klutz', item: 'seaincense', moves: ['fling'] },
			], [
				{ species: "Deoxys", ability: 'noguard', moves: ['calmmind'] },
			]]);
			const klutzMon = battle.p1.active[0];
			battle.makeChoices('move fling', 'move calmmind');
			assert.false(klutzMon.item);
		});

		it('should not consume berries received by Fling', () => {
			battle = common.gen(4).createBattle([[
				{ species: "Lopunny", ability: 'klutz', moves: ['sleeptalk'] },
			], [
				{ species: "Wynaut", item: 'sitrusberry', moves: ['fling'] },
			]]);
			battle.makeChoices();
			assert.false(battle.p2.active[0].item);
			assert.false.fullHP(battle.p1.active[0]);
		});

		it('should still let effects of items received by Fling activate', () => {
			battle = common.gen(4).createBattle([[
				{ species: "Lopunny", ability: 'klutz', moves: ['sleeptalk'] },
			], [
				{ species: "Wynaut", item: 'toxicorb', moves: ['fling'] },
			]]);
			battle.makeChoices();
			assert.false(battle.p2.active[0].item);
			assert.equal(battle.p1.active[0].status, 'tox');
		});

		it('should prevent berries from activating after consuming them with Bug Bite', () => {
			battle = common.gen(4).createBattle([[
				{ species: "Lopunny", level: 1, ability: 'klutz', moves: ['endure', 'bugbite'] },
			], [
				{ species: "Deoxys", ability: 'noguard', item: 'sitrusberry', moves: ['psychic', 'sleeptalk'] },
			]]);
			battle.makeChoices();
			battle.makeChoices('move bugbite', 'move sleeptalk');
			assert.false(battle.p2.active[0].item);
			assert.equal(battle.p1.active[0].hp, 1);
		});
	});
});
