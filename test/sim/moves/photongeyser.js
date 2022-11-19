'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Photon Geyser`, function () {
	afterEach(() => battle.destroy());

	it(`should become physical when Attack stat is higher than Special Attack stat`, function () {
		battle = common.createBattle([[
			{species: 'Necrozma-Dusk-Mane', moves: ['photongeyser']},
		], [
			{species: 'Mew', item: 'keeberry', moves: ['counter']},
		]]);

		battle.makeChoices();
		assert.statStage(battle.p2.active[0], 'def', 1, `physical Photon Geyser should trigger Kee Berry`);
		assert.false.fullHP(battle.p1.active[0], `physical Photon Geyser should be susceptible to Counter`);
	});

	it(`should determine which attack stat is higher after factoring in stat stages, but no other kind of modifier`, function () {
		battle = common.createBattle([[
			{species: 'Latias', ability: 'hugepower', item: 'choiceband', moves: ['photongeyser']},
		], [
			{species: 'Scizor-Mega', item: 'keeberry', moves: ['strugglebug', 'sleeptalk']},
		]]);

		const scizor = battle.p2.active[0];
		battle.makeChoices(); //should be special this turn (196 vs. 256)
		assert.statStage(scizor, 'def', 0, `incorrectly swayed by Choice Band and/or Huge Power`);
		battle.makeChoices(); //should be special this turn (196 vs. 256)
		assert.statStage(scizor, 'def', 1, `the stat drop should have turned Photon Geyser into a special move`);
	});

	it(`should always be a special Max Move, never physical`, function () {
		battle = common.gen(8).createBattle([[
			{species: 'conkeldurr', moves: ['photongeyser']},
		], [
			{species: 'cresselia', item: 'marangaberry', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move photongeyser dynamax', 'auto');
		assert.statStage(battle.p2.active[0], 'spd', 1, `Photon Geyser behaved as a physical Max move, when it shouldn't`);
	});

	it(`should always be a special Z-move, never physical`, function () {
		battle = common.gen(7).createBattle([[
			{species: 'conkeldurr', item: 'psychiumz', moves: ['photongeyser']},
		], [
			{species: 'cresselia', item: 'marangaberry', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move photongeyser zmove', 'auto');
		assert.statStage(battle.p2.active[0], 'spd', 1, `Photon Geyser behaved as a physical Z-move, when it shouldn't`);
	});

	it(`should ignore abilities the same way as Mold Breaker`, function () {
		battle = common.createBattle([[
			{species: 'Necrozma', moves: ['photongeyser']},
		], [
			{species: 'Zeraora', ability: 'voltabsorb', moves: ['electrify']},
		]]);

		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0], `Electrified Photon Geyser should damage through Volt Absorb`);
	});

	it(`should not ignore abilities when called as a submove of another move`, function () {
		battle = common.createBattle([[
			{species: 'Liepard', ability: 'prankster', moves: ['assist', 'copycat', 'sleeptalk', 'photongeyser']},
			{species: 'Necrozma', moves: ['photongeyser']},
		], [
			{species: 'Bruxish', ability: 'dazzling', moves: ['photongeyser', 'spore']},
		]]);

		const bruxish = battle.p2.active[0];
		battle.makeChoices('move assist', 'move photongeyser');
		assert.fullHP(bruxish, `incorrectly ignores abilities through Assist`);
		bruxish.hp = bruxish.maxhp;
		battle.makeChoices('move copycat', 'move spore');
		assert.fullHP(bruxish, `incorrectly ignores abilities through Copycat`);
		bruxish.hp = bruxish.maxhp;
		battle.makeChoices('move sleeptalk', 'move photongeyser');
		assert.fullHP(bruxish, `incorrectly ignores abilities through Sleep Talk`);
	});

	it(`should ignore abilities when called as a submove by a Pokemon that also has Mold Breaker`, function () {
		battle = common.createBattle([[
			{species: 'Shuckle', ability: 'moldbreaker', moves: ['sleeptalk', 'photongeyser']},
		], [
			{species: 'Shedinja', ability: 'disguise', moves: ['spore']},
		]]);

		battle.makeChoices();
		assert.fainted(battle.p2.active[0]);
	});
});
