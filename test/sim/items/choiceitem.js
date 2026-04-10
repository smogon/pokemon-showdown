'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Choice Items", () => {
	afterEach(() => {
		battle.destroy();
	});

	it("should restore the same Choice lock after dynamax ends", () => {
		battle = common.gen(8).createBattle([[
			{ species: 'gyarados', moves: ['sleeptalk', 'splash'], item: 'choicescarf' },
		], [
			{ species: 'wynaut', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move 1', 'auto');
		battle.makeChoices('move 1 dynamax', 'auto');
		battle.makeChoices();
		battle.makeChoices('move 2', 'auto');
		assert.throws(() => battle.choose('p1', 'move 2'),
			"Gyarados shouldn't be allowed to select a different move");
	});

	it("Choice Band should boost Attack by 1.5x", () => {
		battle = common.createBattle([[
			{ species: 'Igglybuff', ability: 'competitive', item: 'choiceband', moves: ['pound'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.forceRandomChance = false;
		battle.onEvent('Accuracy', battle.format, () => true);
		battle.makeChoices('move pound', 'move sleeptalk');
		const bandDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		battle.destroy();

		battle = common.createBattle([[
			{ species: 'Igglybuff', ability: 'competitive', moves: ['pound'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.forceRandomChance = false;
		battle.onEvent('Accuracy', battle.format, () => true);
		battle.makeChoices('move pound', 'move sleeptalk');
		const noBandDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;

		assert.bounded(bandDamage / noBandDamage, [1.45, 1.55]);
	});

	it("Choice Specs should boost Special Attack by 1.5x", () => {
		battle = common.createBattle([[
			{ species: 'Cleffa', ability: 'magicguard', item: 'choicespecs', moves: ['psychic'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.forceRandomChance = false;
		battle.onEvent('Accuracy', battle.format, () => true);
		battle.makeChoices('move psychic', 'move sleeptalk');
		const specsDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		battle.destroy();

		battle = common.createBattle([[
			{ species: 'Cleffa', ability: 'magicguard', moves: ['psychic'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.forceRandomChance = false;
		battle.onEvent('Accuracy', battle.format, () => true);
		battle.makeChoices('move psychic', 'move sleeptalk');
		const noSpecsDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;

		assert.bounded(specsDamage / noSpecsDamage, [1.45, 1.55]);
	});

	it("Choice Scarf should boost Speed enough to outspeed faster unboosted opponents", () => {
		battle = common.createBattle([[
			{ species: 'Electrode', ability: 'soundproof', item: 'choicescarf', moves: ['thunderbolt'] },
		], [
			{ species: 'Deoxys-Speed', ability: 'pressure', moves: ['recover'] },
		]]);
		battle.makeChoices('move thunderbolt', 'move recover');
		const elIdx = battle.log.findIndex(line => line.includes('|move|p1a: Electrode|Thunderbolt'));
		const dxIdx = battle.log.findIndex(line => line.includes('|move|p2a: Deoxys|Recover'));
		assert(elIdx !== -1 && dxIdx !== -1);
		assert(elIdx < dxIdx);
	});

	it("should lock the user to the first move used", () => {
		battle = common.createBattle([[
			{ species: 'Igglybuff', ability: 'competitive', item: 'choiceband', moves: ['pound', 'splash'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move pound', 'move sleeptalk');
		assert.cantMove(
			() => battle.choose('p1', 'move splash'),
			'Igglybuff', 'splash', true
		);
	});

	it("should not boost damage while Dynamaxed", () => {
		battle = common.gen(8).createBattle([[
			{ species: 'Igglybuff', ability: 'competitive', item: 'choiceband', moves: ['pound'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.forceRandomChance = false;
		battle.onEvent('Accuracy', battle.format, () => true);
		battle.makeChoices('move pound dynamax', 'move sleeptalk');
		const bandDynamaxDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		battle.destroy();

		battle = common.gen(8).createBattle([[
			{ species: 'Igglybuff', ability: 'competitive', moves: ['pound'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.forceRandomChance = false;
		battle.onEvent('Accuracy', battle.format, () => true);
		battle.makeChoices('move pound dynamax', 'move sleeptalk');
		const noBandDynamaxDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;

		assert.equal(bandDynamaxDamage, noBandDynamaxDamage);
	});
});
