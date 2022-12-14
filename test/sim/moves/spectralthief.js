'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Spectral Thief`, function () {
	afterEach(() => battle.destroy());

	it(`should steal the target's boosts before hitting`, function () {
		battle = common.createBattle([
			[{species: "Smeargle", ability: 'technician', moves: ['calmmind', 'spectralthief']}],
			[{species: "Litten", ability: 'intimidate', item: 'focussash', moves: ['swordsdance', 'roar']}],
		]);
		const [thief, victim] = battle.sides.map(s => s.active[0]);

		battle.makeChoices('move spectralthief', 'move swordsdance');
		const minusOneDmg = victim.maxhp - victim.hp;

		battle.makeChoices('move calmmind', 'move swordsdance');
		battle.makeChoices('move calmmind', 'move swordsdance');

		assert.statStage(thief, 'atk', -1);
		assert.statStage(victim, 'atk', 6);

		battle.makeChoices('move spectralthief', 'move roar');
		assert.statStage(thief, 'atk', 5);
		assert.statStage(victim, 'atk', 0);

		assert.atLeast(victim.maxhp - victim.hp, 3 * minusOneDmg);
	});

	it(`should double the boosts if the user has Simple`, function () {
		battle = common.createBattle([
			[{species: "Smeargle", ability: 'simple', moves: ['calmmind', 'spectralthief']}],
			[{species: "Mew", ability: 'pressure', moves: ['swordsdance', 'roar']}],
		]);
		const [thief, victim] = battle.sides.map(s => s.active[0]);

		battle.makeChoices('move calmmind', 'move swordsdance');
		assert.statStage(thief, 'atk', 0);
		assert.statStage(victim, 'atk', 2);

		battle.makeChoices('move spectralthief', 'move roar');
		assert.statStage(thief, 'atk', 4);
		assert.statStage(victim, 'atk', 0);
	});

	it(`should only steal boosts once if the user has Parental Bond`, function () {
		battle = common.createBattle([
			[{species: "Smeargle", ability: 'parentalbond', moves: ['calmmind', 'spectralthief']}],
			[{species: "Mew", ability: 'pressure', item: 'weaknesspolicy', moves: ['swordsdance', 'roar']}],
		]);
		const [thief, victim] = battle.sides.map(s => s.active[0]);

		battle.makeChoices('move calmmind', 'move swordsdance');
		assert.statStage(thief, 'atk', 0);
		assert.statStage(victim, 'atk', 2);

		battle.makeChoices('move spectralthief', 'move roar');
		assert.false.holdsItem(victim); // Weakness Policy activated!
		assert.statStage(thief, 'atk', 2);
		assert.statStage(victim, 'atk', 2);
	});

	it(`should not steal boosts if the target is immune to the hit`, function () {
		battle = common.createBattle([
			[{species: "Smeargle", ability: 'owntempo', item: 'laggingtail', moves: ['spectralthief']}],
			[{species: "Zangoose", ability: 'immunity', moves: ['swordsdance']}],
		]);
		const [thief, victim] = battle.sides.map(s => s.active[0]);

		battle.makeChoices('move spectralthief', 'move swordsdance');
		assert.statStage(thief, 'atk', 0);
		assert.statStage(victim, 'atk', 2);
	});

	it(`should zero target's boosts if the target has Contrary`, function () {
		battle = common.createBattle([
			[{species: "Smeargle", ability: 'owntempo', item: 'focussash', moves: ['spectralthief']}],
			[{species: "Serperior", ability: 'contrary', moves: ['leafstorm']}],
		]);
		const victim = battle.p2.active[0];
		battle.makeChoices('move spectralthief', 'move leafstorm');
		assert.statStage(victim, 'spa', 0);
		assert.false.fainted(victim);
	});

	it(`should zero target's boosts if the target has Clear Body`, function () {
		battle = common.createBattle([
			[{species: "Smeargle", ability: 'owntempo', moves: ['spectralthief']}],
			[{species: "Tentacruel", ability: 'clearbody', moves: ['swordsdance']}],
		]);
		const victim = battle.p2.active[0];
		battle.makeChoices('move spectralthief', 'move swordsdance');
		assert.statStage(victim, 'atk', 0);
		assert.false.fainted(victim);
	});

	it(`should zero target's boosts if the target has Simple`, function () {
		battle = common.createBattle([
			[{species: "Smeargle", ability: 'owntempo', moves: ['spectralthief']}],
			[{species: "Swoobat", ability: 'simple', moves: ['amnesia']}],
		]);
		const victim = battle.p2.active[0];
		battle.makeChoices('move spectralthief', 'move amnesia');
		assert.statStage(victim, 'spd', 0);
		assert.false.fainted(victim);
	});
});
