'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Lash Out', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should double in base power if the user's stats were lowered this turn`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', moves: ['lashout']},
		], [
			{species: 'Blissey', moves: ['faketears']},
		]]);
		battle.makeChoices();
		const blissey = battle.p2.active[0];
		const damage = blissey.maxhp - blissey.hp;
		assert.bounded(damage, [158, 186]); // If it wasn't doubled, range would be 79-94
	});

	it(`should double in base power if the user's stats were lowered this turn by an ally`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Wynaut', moves: ['lashout']},
			{species: 'Blissey', moves: ['faketears']},
		], [
			{species: 'Tyrogue', moves: ['sleeptalk']},
			{species: 'Tyrogue', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move lashout -2, move faketears -1', 'auto');
		const blissey = battle.p1.active[1];
		const damage = blissey.maxhp - blissey.hp;
		assert.bounded(damage, [158, 186]); // If it wasn't doubled, range would be 79-94
	});

	it(`should double in base power if the user's stats were lowered at the start of the match`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', ability: 'shellarmor', moves: ['lashout']},
		], [
			{species: 'Blissey', ability: 'intimidate', moves: ['skillswap']},
		]]);
		battle.makeChoices();
		const blissey = battle.p2.active[0];
		const damage = blissey.maxhp - blissey.hp;
		assert.bounded(damage, [104, 123]); // If it wasn't doubled, range would be 52-62
	});

	it(`should not double in base power if the user's stats were lowered at a switch after a KO`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', ability: 'shellarmor', moves: ['lashout']},
		], [
			{species: 'Shedinja', moves: ['sleeptalk']},
			{species: 'Blissey', ability: 'intimidate', moves: ['skillswap']},
		]]);
		battle.makeChoices();
		battle.makeChoices();
		battle.makeChoices();
		const blissey = battle.p2.active[0];
		const damage = blissey.maxhp - blissey.hp;
		assert.bounded(damage, [52, 62]); // If it was doubled, range would be 104-123
	});

	it(`should double in base power even if stat resets are reset by Haze`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Wynaut', moves: ['lashout']},
			{species: 'Blissey', moves: ['faketears']},
		], [
			{species: 'Tyrogue', moves: ['haze']},
			{species: 'Tyrogue', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move lashout -2, move faketears -1', 'auto');
		const blissey = battle.p1.active[1];
		const damage = blissey.maxhp - blissey.hp;
		assert.bounded(damage, [158, 186]); // If it wasn't doubled, range would be 79-94
	});
});
