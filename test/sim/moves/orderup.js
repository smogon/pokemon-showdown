'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Order Up', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should boost Dondozo's stat even if Sheer Force-boosted`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'wynaut', moves: ['sleeptalk'] },
			{ species: 'mew', ability: 'shellarmor', moves: ['sleeptalk'] },
		], [
			{ species: 'tatsugiristretchy', ability: 'commander', moves: ['sleeptalk'] },
			{ species: 'dondozo', ability: 'sheerforce', moves: ['orderup'] },
		]]);
		battle.makeChoices('auto', 'move orderup 2');
		const mew = battle.p1.active[1];
		const damage = mew.maxhp - mew.hp;
		assert.bounded(damage, [149, 176], `Order Up's base power should be increased by Sheer Force`);
		assert.statStage(battle.p2.active[1], 'spe', 3);
	});

	it("should reannounce Salt Cure after eating a teammate in ChatBats", () => {
		battle = common.createBattle({ formatid: 'gen9chatbats' }, [[
			{ species: "Dondozo", ability: "Unaware", item: "Leftovers", moves: ["Order Up", "Splash"] },
			{ species: "Magikarp", ability: "Swift Swim", moves: ["Splash"] },
		], [
			{ species: "Slowbro", ability: "Shell Armor", moves: ["Salt Cure", "Splash"] },
		]]);
		const dondozo = battle.p1.active[0];
		battle.makeChoices('move splash', 'move saltcure');
		battle.makeChoices('move orderup', 'move splash');
		const logStart = battle.log.length;
		battle.makeChoices('switch 2', '');
		assert(dondozo.volatiles.saltcure);
		assert(battle.log.slice(logStart).includes(`|-start|p1a: Dondozo|Salt Cure`));
	});

	for (const item of ["Choice Band", "Choice Scarf", "Choice Specs"]) {
		it(`should preserve the ${item} lock after eating a teammate in ChatBats`, () => {
			battle = common.createBattle({ formatid: 'gen9chatbats' }, [[
				{ species: "Dondozo", ability: "Unaware", item, moves: ["Order Up", "Splash"] },
				{ species: "Magikarp", ability: "Swift Swim", moves: ["Splash"] },
			], [
				{ species: "Slowbro", ability: "Shell Armor", moves: ["Splash"] },
			]]);
			const dondozo = battle.p1.active[0];
			const meal = battle.p1.pokemon[1];
			battle.makeChoices('move orderup', 'move splash');
			const choiceLock = dondozo.volatiles.choicelock;
			assert(choiceLock);
			assert.equal(choiceLock.move, 'orderup');

			battle.makeChoices('switch 2', '');
			assert.equal(battle.p1.active[0], dondozo);
			assert.fainted(meal);
			assert.statStage(dondozo, 'spe', 3);
			assert(dondozo.volatiles.ordered);
			assert.false(battle.p1.getSideCondition('orderup'));
			assert.equal(dondozo.volatiles.choicelock, choiceLock);
			assert.equal(dondozo.volatiles.choicelock.move, 'orderup');
			assert.cantMove(() => battle.choose('p1', 'move splash'), "Dondozo", "Splash", true);
		});
	}
});
