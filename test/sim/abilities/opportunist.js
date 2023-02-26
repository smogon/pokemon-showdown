'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Opportunist", () => {
	afterEach(() => battle.destroy());

	it("should not cause an infinite loop with itself", () => {
		battle = common.createBattle([[
			{species: 'Espathra', ability: 'Opportunist', moves: ['calmmind']},
		], [
			{species: 'Espathra', ability: 'Opportunist', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'spa', 1);
		assert.statStage(battle.p2.active[0], 'spa', 1);
	});

	it("should copy Anger Point", () => {
		battle = common.createBattle([[
			{species: 'Espathra', ability: 'Opportunist', moves: ['stormthrow']},
		], [
			{species: 'Primeape', ability: 'Anger Point', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'atk', 6);
	});

	it("should only copy the effective boost after the +6 cap", () => {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Espathra', ability: 'Opportunist', moves: ['sleeptalk']},
			{species: 'Froslass', ability: 'Snow Cloak', moves: ['frostbreath']},
		], [
			{species: 'Primeape', ability: 'Anger Point', moves: ['sleeptalk']},
			{species: 'Gyarados', ability: 'Intimidate', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'atk', -1 + 6);
	});
});
