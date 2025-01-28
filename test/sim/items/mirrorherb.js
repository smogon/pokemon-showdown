'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Mirror Herb", () => {
	afterEach(() => battle.destroy());

	it("should copy Anger Point", () => {
		battle = common.createBattle([[
			{species: 'Snorlax', item: 'Mirror Herb', moves: ['stormthrow']},
		], [
			{species: 'Primeape', ability: 'Anger Point', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'atk', 6);
	});

	it("should only copy the effective boost after the +6 cap", () => {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Snorlax', item: 'Mirror Herb', moves: ['sleeptalk']},
			{species: 'Froslass', ability: 'Snow Cloak', moves: ['frostbreath']},
		], [
			{species: 'Primeape', ability: 'Anger Point', moves: ['sleeptalk']},
			{species: 'Gyarados', ability: 'Intimidate', moves: ['sleeptalk']},
		]]);
		assert.statStage(battle.p1.active[0], 'atk', -1);
		battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'atk', -1 + 6);
	});

	it("should copy all 'simultaneous' boosts from multiple opponents", () => {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Electrode', ability: 'No Guard', item: 'Mirror Herb', moves: ['recycle']},
			{species: 'Gyarados', ability: 'Intimidate', item: 'Wide Lens', moves: ['sleeptalk', 'air cutter']},
		], [
			{species: 'Primeape', ability: 'Defiant', item: 'Weakness Policy', moves: ['sleeptalk', 'haze']},
			{species: 'Annihilape', ability: 'Defiant', item: 'Weakness Policy', moves: ['sleeptalk', 'howl']},
		]]);
		const electrode = battle.p1.active[0];
		assert.statStage(electrode, 'atk', 4, `Mirror Herb should have copied both Defiant boosts but only boosted atk by ${electrode.boosts.atk}`);
		battle.makeChoices('auto', 'move haze, move howl');
		assert.statStage(electrode, 'atk', 2, `Mirror Herb should have copied both Howl boosts but only boosted atk by ${electrode.boosts.atk}`);
		battle.makeChoices('move recycle, move air cutter', 'auto');
		assert.statStage(electrode, 'spa', 4, `Mirror Herb should have copied all Weakness Policy boosts but only boosted spa by ${electrode.boosts.spa}`);
	});

	it("should wait for most entrance abilities before copying all their (opposing) boosts", () => {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Electrode', item: 'Mirror Herb', moves: ['recycle']},
			{species: 'Gyarados', ability: 'Intimidate', moves: ['sleeptalk']},
		], [
			{species: 'Zacian', ability: 'Intrepid Sword', moves: ['sleeptalk']},
			{species: 'Annihilape', ability: 'Defiant', moves: ['sleeptalk']},
		]]);
		assert.statStage(battle.p1.active[0], 'atk', 3);
	});
});
