'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

const WIND_RIDER_MON = {species: 'brambleghast', ability: 'windrider', moves: ['sleeptalk']};

describe("Wind Rider", () => {
	afterEach(() => battle.destroy());

	it("should nullify Wind attacks and boost the target's Attack by 1", () => {
		battle = common.createBattle([[
			{species: 'azumarill', item: 'widelens', ability: 'thickfat', moves: ['icywind']},
		], [
			WIND_RIDER_MON,
		]]);
		battle.makeChoices();
		const brambleghast = battle.p2.active[0];
		assert.fullHP(brambleghast);
		assert.statStage(brambleghast, 'spe', 0);
		assert.statStage(brambleghast, 'atk', 1);
	});

	it("should be bypassed by Mold Breaker", () => {
		battle = common.createBattle([[
			{species: 'veluza', item: 'widelens', ability: 'moldbreaker', moves: ['icywind']},
		], [
			WIND_RIDER_MON,
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
		assert.statStage(battle.p2.active[0], 'atk', 0);
	});

	it("should not interact with Sandstorm", () => {
		battle = common.createBattle([[
			{species: 'flittle', ability: 'frisk', moves: ['sandstorm']},
		], [
			WIND_RIDER_MON,
		]]);
		battle.makeChoices();
		assert.equal(battle.field.weather, 'sandstorm');
		assert.statStage(battle.p2.active[0], 'atk', 0);
	});

	it("should activate when Tailwind is used on the Pokemon's side", () => {
		battle = common.createBattle({gameType: "doubles"}, [[
			{species: 'magikarp', ability: 'swiftswim', moves: ['splash']},
			{species: 'magikarp', ability: 'swiftswim', moves: ['splash']},
		], [
			WIND_RIDER_MON,
			{species: 'pelipper', ability: 'keeneye', moves: ['tailwind']},
		]]);
		battle.makeChoices();
		assert.statStage(battle.p2.active[0], 'atk', 1);
	});

	it("should activate on switch-in if Tailwind is active on the Pokemon's side", () => {
		battle = common.createBattle([[
			{species: 'magikarp', ability: 'swiftswim', moves: ['splash']},
		], [
			{species: 'pelipper', ability: 'keeneye', moves: ['tailwind']},
			WIND_RIDER_MON,
		]]);
		battle.makeChoices();
		battle.makeChoices('auto', 'switch 2');
		assert.statStage(battle.p2.active[0], 'atk', 1);
	});
});
