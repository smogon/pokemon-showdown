'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Chloroblast', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should deal recoil damage to the user equal to half its max HP, rounded up', function () {
		battle = common.createBattle([[
			{species: "Electrode-Hisui", item: 'widelens', moves: ['chloroblast']},
		], [
			{species: "Blissey", moves: ['sleeptalk']},
		]]);
		assert.hurtsBy(battle.p1.active[0], Math.round(battle.p1.active[0].maxhp / 2), () => battle.makeChoices());
	});

	it('should not deal recoil damage to the user if it misses or is blocked by Protect', function () {
		battle = common.createBattle([[
			{species: "Electrode-Hisui", item: 'widelens', moves: ['chloroblast', 'protect']},
		], [
			{species: "Talonflame", ability: 'galewings', moves: ['fly', 'protect']},
		]]);
		battle.makeChoices('move chloroblast', 'move fly');
		battle.makeChoices('move protect', 'auto');
		battle.makeChoices('move chloroblast', 'move protect');
		assert.fullHP(battle.p1.active[0]);
	});

	it('should have its recoil damage negated by Rock Head', function () {
		battle = common.createBattle([[
			{species: "Electrode-Hisui", ability: 'rockhead', item: 'widelens', moves: ['chloroblast']},
		], [
			{species: "Blissey", moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0]);
	});

	it('should not have its base power boosted by Reckless', function () {
		battle = common.createBattle([[
			{species: "Electrode-Hisui", ability: 'reckless', item: 'widelens', moves: ['chloroblast']},
		], [
			{species: "Blissey", ability: 'shellarmor', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		const damage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		assert.bounded(damage, [103, 123]);
	});
});
