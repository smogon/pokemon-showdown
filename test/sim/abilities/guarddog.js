'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

const GUARD_DOG_MON = {species: "Mabosstiff", ability: 'guarddog', moves: ['sleeptalk']};

describe("Guard Dog", () => {
	afterEach(() => battle.destroy());

	it("should nullify Intimidate and instead boost the Pokemon's Attack by 1", () => {
		battle = common.createBattle([[
			GUARD_DOG_MON,
		], [
			{species: 'sandile', ability: 'intimidate', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'atk', 1);
	});

	it("should prevent phazing", () => {
		battle = common.createBattle([[
			GUARD_DOG_MON,
			{species: 'azumarill', ability: 'thickfat', moves: ['rollout']},
		], [
			{species: 'shinx', ability: 'rivalry', moves: ['roar']},
		]]);
		battle.makeChoices();
		assert.species(battle.p1.active[0], GUARD_DOG_MON.species);
	});

	it("should be bypassed by Mold Breaker", () => {
		battle = common.createBattle([[
			GUARD_DOG_MON,
			{species: 'azumarill', ability: 'thickfat', moves: ['rollout']},
		], [
			{species: 'shinx', ability: 'moldbreaker', moves: ['roar']},
		]]);
		battle.makeChoices();
		assert.species(battle.p1.active[0], "Azumarill");
	});
});
