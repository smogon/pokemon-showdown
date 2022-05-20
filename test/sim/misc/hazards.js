'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Hazards', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should damage Pokemon before regular entrance Abilities`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['uturn']},
			{species: 'shedinja', ability: 'electricsurge', moves: ['sleeptalk']},
		], [
			{species: 'landorus', moves: ['stealthrock']},
		]]);
		battle.makeChoices();
		battle.makeChoices('switch 2');
		assert.false(battle.field.isTerrain('electricterrain'));
	});

	it(`should damage multiple Pokemon switching in simulatenously by Speed order`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['stealthrock', 'sleeptalk']},
			{species: 'kyogre', ability: 'drizzle', item: 'choicescarf', moves: ['sleeptalk']},
		], [
			{species: 'miltank', moves: ['stealthrock', 'finalgambit']},
			{species: 'landorus-therian', ability: 'intimidate', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		battle.makeChoices('move sleeptalk', 'move finalgambit');
		battle.makeChoices('switch 2', 'switch 2');
		const log = battle.getDebugLog();
		const rocksKyogreIndex = log.indexOf('|-damage|p1a: Kyogre|299/341|[from] Stealth Rock');
		const abilityKyogreIndex = log.indexOf('ability: Drizzle|[of] p1a: Kyogre');
		const rocksLandorusIndex = log.indexOf('|-damage|p2a: Landorus|280/319|[from] Stealth Rock');
		const abilityLandorusIndex = log.indexOf('|-ability|p2a: Landorus|Intimidate');

		assert(rocksKyogreIndex < abilityKyogreIndex, 'Stealth Rock should damage Kyogre before Drizzle activates.');
		assert(abilityKyogreIndex < rocksLandorusIndex, 'Kyogre should activate Drizzle before Landorus takes rocks damage.');
		assert(rocksLandorusIndex < abilityLandorusIndex, 'Stealth Rock should damage Landorus before Intimidate activates.');
	});

	it(`should set up hazards even if there is no target`, function () {
		battle = common.createBattle([[
			{species: 'diglett', level: 1, moves: ['sleeptalk', 'finalgambit']},
			{species: 'diglett', level: 1, moves: ['sleeptalk', 'finalgambit']},
			{species: 'diglett', level: 1, moves: ['sleeptalk', 'finalgambit']},
			{species: 'diglett', level: 1, moves: ['sleeptalk', 'finalgambit']},
		], [
			{species: 'wynaut', item: 'laggingtail', moves: ['stealthrock', 'spikes', 'stickyweb', 'defog']},
		]]);

		battle.makeChoices('move finalgambit', 'move stealthrock');
		battle.makeChoices('switch 2');
		assert.false.fullHP(battle.p1.active[0]);
		battle.makeChoices('move sleeptalk', 'move defog');
		battle.makeChoices('move finalgambit', 'move spikes');
		battle.makeChoices('switch 3');
		assert.false.fullHP(battle.p1.active[0]);
		battle.makeChoices('move sleeptalk', 'move defog');
		battle.makeChoices('move finalgambit', 'move stickyweb');
		battle.makeChoices('switch 4');
		assert.statStage(battle.p1.active[0], 'spe', -1);
	});

	it(`should apply hazards in the order they were set up`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['sleeptalk', 'uturn']},
			{species: 'whismur', moves: ['sleeptalk']},
		], [
			{species: 'landorus', moves: ['stealthrock', 'spikes', 'stickyweb', 'toxicspikes']},
		]]);
		battle.makeChoices('move sleeptalk', 'move toxicspikes');
		battle.makeChoices('move sleeptalk', 'move stickyweb');
		battle.makeChoices('move sleeptalk', 'move spikes');
		battle.makeChoices('move sleeptalk', 'move toxicspikes');
		battle.makeChoices('move uturn', 'move stealthrock');
		battle.makeChoices('switch 2');

		const log = battle.getDebugLog();
		const tSpikeIndex = log.indexOf('|-status|p1a: Whismur|tox');
		const websIndex = log.indexOf('|-activate|p1a: Whismur|move: Sticky Web');
		const spikesIndex = log.indexOf('|[from] Spikes');
		const rocksIndex = log.indexOf('[from] Stealth Rock');

		assert(tSpikeIndex < websIndex, 'Toxic Spikes should have poisoned before Sticky Web lowered speed.');
		assert(websIndex < spikesIndex, 'Sticky Web should have lowered speed before Spikes damage.');
		assert(spikesIndex < rocksIndex, 'Spikes should have damaged before Stealth Rock.');
	});

	it(`should allow Berries to trigger between hazards`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['sleeptalk', 'uturn']},
			{species: 'shedinja', item: 'lumberry', moves: ['sleeptalk']},
		], [
			{species: 'landorus', moves: ['toxicspikes', 'stealthrock']},
		]]);
		battle.makeChoices();
		battle.makeChoices('move uturn', 'move stealthrock');
		battle.makeChoices('switch 2');
		const shedinja = battle.p1.active[0];
		assert.false.holdsItem(shedinja, 'Shedinja should have lost Lum Berry before fainting to rocks.');
	});

	it(`should set up hazards to every opponents' side in a Free-for-all battle`, function () {
		battle = common.createBattle({gameType: 'freeforall'}, [[
			{species: 'Bronzong', moves: ['sleeptalk', 'stealthrock']},
		], [
			{species: 'Cufant', moves: ['sleeptalk']},
		], [
			{species: 'Qwilfish', moves: ['sleeptalk']},
		], [
			{species: 'Marowak', moves: ['stealthrock']},
		]]);

		battle.makeChoices();
		assert.deepEqual(battle.sides.map(side => !!side.sideConditions.stealthrock), [true, true, true, false]);
		battle.makeChoices('move stealthrock', 'auto', 'auto', 'auto');
		assert.deepEqual(battle.sides.map(side => !!side.sideConditions.stealthrock), [true, true, true, true]);
	});

	it(`should set up hazards even if there is no target in a Free-for-all battle`, function () {
		battle = common.createBattle({gameType: 'freeforall'}, [[
			{species: 'Bronzong', item: 'laggingtail', moves: ['sleeptalk', 'stealthrock']},
		], [
			{species: 'Wynaut', level: 1, moves: ['finalgambit']},
			{species: 'Cufant', moves: ['sleeptalk']},
		], [
			{species: 'Wynaut', level: 1, moves: ['finalgambit']},
			{species: 'Qwilfish', moves: ['sleeptalk']},
		], [
			{species: 'Wynaut', level: 1, moves: ['finalgambit']},
			{species: 'Marowak', moves: ['stealthrock']},
		]]);

		battle.makeChoices('move stealthrock', 'move finalgambit 1', 'move finalgambit 1', 'move finalgambit 1');
		assert.deepEqual(battle.sides.map(side => !!side.sideConditions.stealthrock), [false, true, true, true]);
	});
});
