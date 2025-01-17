'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Unaware', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should ignore attack stage changes when Pokemon with it are attacked`, function () {
		battle = common.createBattle([[
			{species: 'Clefable', ability: 'unaware', moves: ['softboiled']},
		], [
			{species: 'Wynaut', moves: ['bellydrum', 'wickedblow']},
		]]);

		battle.makeChoices('auto', 'move bellydrum');
		battle.makeChoices('auto', 'move wickedblow');
		const clef = battle.p1.active[0];
		const damage = clef.maxhp - clef.hp;
		assert.bounded(damage, [19, 22]);
	});

	it(`should not ignore attack stage changes when Pokemon with it attack`, function () {
		battle = common.createBattle([[
			{species: 'Clefable', ability: 'unaware', moves: ['moonblast', 'nastyplot']},
		], [
			{species: 'Registeel', ability: 'shellarmor', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move nastyplot', 'auto');
		battle.makeChoices('move moonblast', 'auto');
		const regi = battle.p2.active[0];
		const damage = regi.maxhp - regi.hp;
		assert.bounded(damage, [69, 81]);
	});

	it(`should ignore defense stage changes when Pokemon with it attack`, function () {
		battle = common.createBattle([[
			{species: 'Clefable', ability: 'unaware', item: 'laggingtail', moves: ['moonblast']},
		], [
			{species: 'Registeel', ability: 'shellarmor', moves: ['amnesia']},
		]]);

		battle.makeChoices();
		const regi = battle.p2.active[0];
		const damage = regi.maxhp - regi.hp;
		assert.bounded(damage, [34, 41]);
	});

	it(`should not ignore defense stage changes when Pokemon with it are attacked`, function () {
		battle = common.createBattle([[
			{species: 'Clefable', ability: 'unaware', moves: ['luckychant', 'irondefense']},
		], [
			{species: 'Registeel', moves: ['sleeptalk', 'payday']},
		]]);

		battle.makeChoices();
		battle.makeChoices('move irondefense', 'move payday');
		const clef = battle.p1.active[0];
		const damage = clef.maxhp - clef.hp;
		assert.bounded(damage, [16, 19]);
	});

	it(`should be suppressed by Mold Breaker`, function () {
		battle = common.createBattle([[
			{species: 'Clefable', ability: 'unaware', moves: ['softboiled']},
		], [
			{species: 'Wynaut', ability: 'moldbreaker', moves: ['bellydrum', 'wickedblow']},
		]]);

		battle.makeChoices('auto', 'move bellydrum');
		battle.makeChoices('auto', 'move wickedblow');
		const clef = battle.p1.active[0];
		const damage = clef.maxhp - clef.hp;
		assert.bounded(damage, [73, 86]);
	});

	it(`should only apply to targets with Unaware in battles with multiple Pokemon`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'manaphy', moves: ['tailglow', 'surf']},
			{species: 'slowbro', ability: 'unaware', moves: ['sleeptalk']},
		], [
			{species: 'clobbopus', ability: 'sturdy', moves: ['sleeptalk']},
			{species: 'clobbopus', ability: 'sturdy', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move tailglow, auto', 'auto');
		battle.makeChoices('move surf, auto', 'auto');
		assert.equal(battle.p2.active[0].hp, 1);
		assert.equal(battle.p2.active[1].hp, 1);
	});

	it(`should ignore attack stage changes when Pokemon with it are attacked with Foul Play`, function () {
		battle = common.createBattle([[
			{species: 'Clefable', ability: 'unaware', moves: ['bellydrum']},
		], [
			{species: 'Wynaut', ability: 'superluck', moves: ['focusenergy', 'foulplay']},
		]]);

		battle.makeChoices();
		battle.makeChoices('auto', 'move foulplay');

		const clef = battle.p1.active[0];
		const damage = clef.maxhp - Math.floor(clef.maxhp / 2) - clef.hp;
		assert.bounded(damage, [50, 59]);
	});
});
