'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Magician', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should steal the opponents item`, () => {
		battle = common.createBattle([[
			{ species: 'klefki', ability: 'magician', moves: ['flashcannon'] },
		], [
			{ species: 'wynaut', item: 'tr69', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].item, 'tr69');
	});

	it(`should steal the opponents item if the target faints`, () => {
		battle = common.createBattle([[
			{ species: 'klefki', ability: 'magician', moves: ['flashcannon'] },
		], [
			{ species: 'wynaut', level: 1, item: 'tr69', moves: ['sleeptalk'] },
			{ species: 'wynaut', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move flashcannon', 'move sleeptalk');
		assert.equal(battle.p1.active[0].item, 'tr69');
	});

	it(`should not steal the opponents item if the user faints`, () => {
		battle = common.createBattle([[
			{ species: 'klefki', level: 1, ability: 'magician', moves: ['tackle'] },
			{ species: 'wynaut', moves: ['sleeptalk'] },
		], [
			{ species: 'wynaut', item: 'rockyhelmet', moves: ['falseswipe'] },
		]]);
		battle.makeChoices('move tackle', 'move falseswipe');
		assert.false.holdsItem(battle.p1.active[0]);
		assert.holdsItem(battle.p2.active[0]);
	});

	it(`should steal the opponents item if the user uses U-turn`, () => {
		battle = common.createBattle([[
			{ species: 'klefki', ability: 'magician', moves: ['uturn'] },
			{ species: 'wynaut', moves: ['sleeptalk'] },
		], [
			{ species: 'wynaut', item: 'tr69', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].item, 'tr69');
	});

	it(`should steal the opponents item if the user uses Dragon Tail`, () => {
		battle = common.createBattle([[
			{ species: 'klefki', ability: 'magician', moves: ['dragontail'] },
		], [
			{ species: 'wynaut', item: 'tr69', moves: ['sleeptalk'] },
			{ species: 'wynaut', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].item, 'tr69');
	});

	it(`should not steal Weakness Policy on super-effective hits`, () => {
		battle = common.createBattle([[
			{ species: 'klefki', ability: 'magician', moves: ['flashcannon'] },
		], [
			{ species: 'hatterene', item: 'weaknesspolicy', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.false.holdsItem(battle.p1.active[0], 'Klefki should not have stolen Weakness Policy.');
	});

	it(`should not steal an item on the turn Throat Spray activates`, () => {
		battle = common.createBattle([[
			{ species: 'klefki', ability: 'magician', item: 'throatspray', moves: ['psychicnoise'] },
		], [
			{ species: 'hatterene', item: 'tr69', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.false.holdsItem(battle.p1.active[0], 'Klefki should not have stolen an item.');
	});

	it(`should steal the item from the faster opponent hit`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: "Hoopa", ability: 'magician', moves: ['expandingforce'] },
			{ species: "Tapu Lele", ability: 'psychicsurge', moves: ['sleeptalk'] },
		], [
			{ species: "Shuckle", item: 'tr68', moves: ['sleeptalk'] },
			{ species: "Zapdos", item: 'tr69', moves: ['sleeptalk'] }],
		]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].item, 'tr69');
		assert.equal(battle.p2.active[0].item, 'tr68');
		assert.equal(battle.p2.active[1].item, '');
	});
});
