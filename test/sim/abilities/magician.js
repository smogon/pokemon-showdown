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

	it(`should not steal from a Sticky Hold target`, () => {
		battle = common.createBattle([[
			{ species: 'klefki', ability: 'magician', moves: ['tackle'] },
		], [
			{ species: 'skarmory', ability: 'stickyhold', item: 'leftovers', moves: ['tackle'] },
		]]);
		battle.makeChoices();
		assert.false.holdsItem(battle.p1.active[0]);
		assert.holdsItem(battle.p2.active[0]);
	});

	it(`should steal if a Sticky Hold target faints`, () => {
		battle = common.createBattle([[
			{ species: 'klefki', ability: 'magician', moves: ['tackle'] },
		], [
			{ species: 'skarmory', level: 1, ability: 'stickyhold', item: 'leftovers', moves: ['tackle'] },
			{ species: 'wynaut', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.fainted(battle.p2.active[0]);
		assert.holdsItem(battle.p1.active[0]);
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

	it(`should steal the item from the faster target hit, prioritizing foes`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: "Hoopa", ability: 'magician', moves: ['surf'] },
			{ species: "Regieleki", item: 'tr67', moves: ['sleeptalk'] },
		], [
			{ species: "Shuckle", item: 'tr68', moves: ['sleeptalk'] },
			{ species: "Zapdos", item: 'tr69', moves: ['sleeptalk'] }],
		]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].item, 'tr69');
		assert.equal(battle.p1.active[1].item, 'tr67');
		assert.equal(battle.p2.active[0].item, 'tr68');
		assert.equal(battle.p2.active[1].item, '');
	});

	it(`should not be activated by a future move`, () => {
		battle = common.createBattle([[
			{ species: 'klefki', ability: 'magician', moves: ['sleeptalk', 'doomdesire'] },
		], [
			{ species: 'wynaut', item: 'tr69', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move doomdesire', 'move sleeptalk');
		battle.makeChoices();
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
		assert.false.holdsItem(battle.p1.active[0]);
		assert.holdsItem(battle.p2.active[0]);
	});

	it(`should activate if the user consumed its Power Herb`, () => {
		battle = common.createBattle([[
			{ species: 'klefki', ability: 'magician', item: 'powerherb', moves: ['meteorbeam'] },
		], [
			{ species: 'wynaut', item: 'tr69', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].item, 'tr69');
		assert.false.holdsItem(battle.p2.active[0]);
	});

	it(`should not activate prior to Focus Sash activating`, () => {
		battle = common.createBattle([[
			{ species: 'klefki', ability: 'magician', moves: ['tackle'] },
		], [
			{ species: 'wynaut', level: 1, item: 'focussash', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.equal(battle.p2.active[0].hp, 1);
		assert.false.holdsItem(battle.p1.active[0]);
		assert.false.holdsItem(battle.p2.active[0]);
	});

	it(`should not activate prior to status healing from Lum Berry`, () => {
		battle = common.createBattle([[
			{ species: 'Delphox', ability: 'magician', moves: ['inferno'] },
		], [
			{ species: 'Regieleki', ability: 'noguard', item: 'lumberry', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
		assert.false(battle.p2.active[0].status);
		assert.false.holdsItem(battle.p1.active[0]);
		assert.false.holdsItem(battle.p2.active[0]);
	});

	it(`should activate prior to healing from Sitrus Berry`, () => {
		battle = common.createBattle([[
			{ species: 'Urshifu', ability: 'magician', moves: ['wickedblow'] },
		], [
			{ species: 'Terapagos', ability: 'berserk', item: 'sitrusberry', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		const terapagos = battle.p2.active[0];
		assert.holdsItem(battle.p1.active[0]);
		assert.false.holdsItem(terapagos);
		assert.equal(terapagos.boosts.spa, 1);
		assert(terapagos.hp < terapagos.maxhp / 2);
	});

	it(`should not activate prior to healing from Sitrus Berry after a multi-hit move`, () => {
		battle = common.createBattle([[
			{ species: 'Urshifu-Rapid-Strike', ability: 'magician', moves: ['surgingstrikes'] },
		], [
			{ species: 'Terapagos', ability: 'berserk', item: 'sitrusberry', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		const terapagos = battle.p2.active[0];
		assert.false.holdsItem(battle.p1.active[0]);
		assert.false.holdsItem(terapagos);
		assert.equal(terapagos.boosts.spa, 0);
		assert(terapagos.hp > terapagos.maxhp / 2);
	});

	it.skip(`should not steal an item through Substitute`, () => {
		battle = common.createBattle([[
			{ species: 'Urshifu', ability: 'magician', moves: ['wickedblow'] },
		], [
			{ species: 'Scolipede', item: 'tr69', moves: ['substitute'] },
		]]);
		battle.makeChoices();
		const scolipede = battle.p2.active[0];
		assert.false(scolipede.volatiles['substitute']);
		assert.equal(scolipede.hp, scolipede.maxhp - Math.floor(scolipede.maxhp / 4));
		assert.false.holdsItem(battle.p1.active[0]);
		assert.holdsItem(battle.p2.active[0]);
	});
});
