"use strict";

const assert = require("./../../assert");
const common = require("./../../common");

let battle;

describe("Swallow", function () {
	afterEach(function () {
		battle.destroy();
	});

	it("should heal 1/4 health (rounded down) after 1 stockpile", function () {
		battle = common.createBattle([
			[
				{
					species: "Seviper",
					ability: "shedskin",
					moves: ["stockpile", "swallow"],
				},
			],
			[{species: "Zangoose", ability: "immunity", moves: ["sleeptalk", "falseswipe"]}],
		]);

		battle.makeChoices("move stockpile", "move falseswipe");
		const hpBeforeHeal = battle.p1.active[0].hp;
		battle.makeChoices("move swallow", "move sleeptalk");

		assert.equal(battle.p1.active[0].hp, hpBeforeHeal + Math.floor(battle.p1.active[0].maxhp / 4));
	});

	it("should not heal after 0 stockpiles", function () {
		battle = common.createBattle([
			[
				{
					// Seviper at lvl 100 has Max HP of 287 (for testing rounding down)
					species: "Seviper",
					ability: "shedskin",
					moves: ["stockpile", "swallow", "sleeptalk"],
				},
			],
			[
				{
					species: "Zangoose",
					ability: "immunity",
					moves: ["sleeptalk", "falseswipe"],
				},
			],
		]);

		battle.makeChoices("move sleeptalk", "move falseswipe");
		const hpBeforeHeal = battle.p1.active[0].hp;
		battle.makeChoices("move swallow", "move sleeptalk");

		assert.equal(
			battle.p1.active[0].hp,
			hpBeforeHeal
		);
	});
});
