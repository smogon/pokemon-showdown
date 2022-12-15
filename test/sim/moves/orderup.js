'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Order Up', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should boost Dondozo's stat even if Sheer Force-boosted`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', moves: ['sleeptalk']},
			{species: 'mew', ability: 'shellarmor', moves: ['sleeptalk']},
		], [
			{species: 'tatsugiristretchy', ability: 'commander', moves: ['sleeptalk']},
			{species: 'dondozo', ability: 'sheerforce', moves: ['orderup']},
		]]);
		battle.makeChoices('auto', 'move orderup 2');
		const mew = battle.p1.active[1];
		const damage = mew.maxhp - mew.hp;
		assert.bounded(damage, [149, 176], `Order Up's base power should be increased by Sheer Force`);
		assert.statStage(battle.p2.active[1], 'spe', 3);
	});

	it(`should boost Dondozo's stat even if the move fails into Protect or a type immunity`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'sylveon', moves: ['sleeptalk']},
			{species: 'mew', moves: ['sleeptalk', 'protect']},
		], [
			{species: 'tatsugiridroopy', ability: 'commander', moves: ['sleeptalk']},
			{species: 'dondozo', moves: ['orderup']},
		]]);
		battle.makeChoices('auto', 'move orderup 1');
		battle.makeChoices('move sleeptalk, move protect', 'move orderup 2');

		assert.statStage(battle.p2.active[1], 'def', 4);
	});

	it(`should boost Dondozo's stat even if the move fails into Tatsugiri's semi-invulnerability or an empty partner slot`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', moves: ['sleeptalk']},
			{species: 'mew', moves: ['sleeptalk']},
		], [
			{species: 'tatsugiri', ability: 'commander', item: 'toxicorb', moves: ['endure']},
			{species: 'annihilape', moves: ['finalgambit']},
			{species: 'dondozo', moves: ['orderup']},
		]]);
		// setup to easily KO Tatsugiri
		battle.makeChoices('auto', 'move endure, move finalgambit -1');
		battle.makeChoices('', 'switch dondozo');

		battle.makeChoices('auto', 'move orderup -1'); // into Tatsugiri semi-invuln
		battle.makeChoices('auto', 'move orderup -1'); // into empty partner slot

		assert.statStage(battle.p2.active[1], 'atk', 4);
	});

	it(`should not boost Dondozo's stat if it fails early, e.g. from sleep or flinching`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', moves: ['sleeptalk']},
			{species: 'mew', ability: 'prankster', moves: ['spore', 'fakeout']},
		], [
			{species: 'tatsugiri', ability: 'commander', moves: ['sleeptalk']},
			{species: 'dondozo', moves: ['orderup']},
		]]);
		battle.makeChoices('move sleeptalk, move fakeout 2', 'auto');
		battle.makeChoices('move sleeptalk, move spore 2', 'auto');

		assert.statStage(battle.p2.active[1], 'atk', 2);
	});

	it(`should not boost Dondozo's stat if it fails due to priority-blocking Abilities`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', ability: 'dazzling', moves: ['sleeptalk']},
			{species: 'mew', ability: 'prankster', moves: ['spore']},
		], [
			{species: 'tatsugiri', ability: 'commander', moves: ['sleeptalk']},
			{species: 'dondozo', ability: 'prankster', moves: ['sleeptalk', 'orderup']},
		]]);
		battle.makeChoices('move sleeptalk, move spore 2', 'move sleeptalk');

		assert(battle.log.some(line => line.includes('ability: Dazzling|Order Up|[of] p2b: Dondozo')));
		assert.statStage(battle.p2.active[1], 'atk', 2);
	});
});
