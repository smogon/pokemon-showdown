'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Klutz', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should negate residual healing events', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Lopunny", ability: 'klutz', item: 'leftovers', moves: ['bellydrum']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Giratina", ability: 'pressure', moves: ['shadowsneak']}]);
		const klutzMon = battle.p1.active[0];
		assert.hurtsBy(klutzMon, Math.floor(klutzMon.maxhp / 2), () => battle.makeChoices('move bellydrum', 'move shadowsneak'), "Leftovers healing should not apply");
	});

	it('should prevent items from being consumed', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Lopunny", level: 1, ability: 'klutz', item: 'sitrusberry', moves: ['endure']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Deoxys", ability: 'noguard', moves: ['psychic']}]);
		const klutzMon = battle.p1.active[0];
		assert.constant(() => klutzMon.item, () => battle.makeChoices('move endure', 'move psychic'));
		assert.strictEqual(klutzMon.hp, 1);
	});

	it('should ignore the effects of items that disable moves', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Lopunny", ability: 'klutz', item: 'assaultvest', moves: ['protect']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Deoxys", ability: 'noguard', moves: ['psychic']}]);
		battle.makeChoices('move protect', 'move psychic');
		assert.strictEqual(battle.p1.active[0].lastMove.id, 'protect');
	});

	it('should not ignore item effects that prevent item removal', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Genesect", ability: 'klutz', item: 'dousedrive', moves: ['calmmind']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Deoxys", ability: 'noguard', moves: ['trick']}]);
		const klutzMon = battle.p1.active[0];
		assert.constant(() => klutzMon.item, () => battle.makeChoices('move calmmind', 'move trick'));
	});

	it('should cause Fling to fail', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Lopunny", ability: 'klutz', item: 'seaincense', moves: ['fling']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Deoxys", ability: 'noguard', moves: ['calmmind']}]);
		const klutzMon = battle.p1.active[0];
		assert.constant(() => klutzMon.item, () => battle.makeChoices('move fling', 'move calmmind'));
	});

	it('should not prevent Pokemon from Mega Evolving', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Lopunny", ability: 'klutz', item: 'lopunnite', moves: ['protect']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Deoxys", ability: 'noguard', moves: ['calmmind']}]);
		battle.makeChoices('move protect mega', 'move calmmind');
		assert.species(battle.p1.active[0], 'Lopunny-Mega');
	});
});
