'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Adrenaline Orb', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should activate even if an Ability stopped Intimidate`, () => {
		battle = common.createBattle([[
			{ species: "Mamoswine", ability: 'oblivious', item: 'adrenalineorb', moves: ['sleeptalk'] },
		], [
			{ species: "Incineroar", ability: 'intimidate', moves: ['sleeptalk'] },
		]]);

		assert.statStage(battle.p1.active[0], 'spe', 1);
	});

	it(`should activate even if Mist stopped Intimidate`, () => {
		battle = common.createBattle([[
			{ species: "Wynaut", item: 'adrenalineorb', moves: ['mist'] },
		], [
			{ species: "Shedinja", moves: ['finalgambit'] },
			{ species: "Incineroar", ability: 'intimidate', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'spe', 1);
	});

	it(`should not activate if Substitute stopped Intimidate`, () => {
		battle = common.createBattle([[
			{ species: "Wynaut", item: 'adrenalineorb', moves: ['substitute'] },
		], [
			{ species: "Shedinja", moves: ['finalgambit'] },
			{ species: "Incineroar", ability: 'intimidate', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'spe', 0);
	});

	it(`should not activate if the holder is at -6 Attack`, () => {
		battle = common.createBattle([[
			{ species: "Dugtrio", item: 'adrenalineorb', moves: ['bellydrum'] },
		], [
			{ species: "Shedinja", item: 'stickybarb', moves: ['topsyturvy'] },
			{ species: "Incineroar", ability: 'intimidate', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'spe', 0);
		assert.holdsItem(battle.p1.active[0]);
	});

	it(`should activate if the holder is at -5 Attack`, () => {
		battle = common.createBattle([[
			{ species: "Dugtrio", item: 'adrenalineorb', moves: ['bellydrum', 'curse', 'splash'] },
		], [
			{ species: "Shedinja", moves: ['splash', 'topsyturvy'] },
			{ species: "Incineroar", ability: 'intimidate', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices(); // dugtrio +6 atk
		battle.makeChoices('move splash', 'move topsyturvy'); // dugtrio -6 atk
		battle.makeChoices('move curse', 'move splash'); // dugtrio -5 atk and -1 speed
		assert.statStage(battle.p1.active[0], 'spe', -1);
		battle.makeChoices('move splash', 'switch 2'); // now dugtrio is at -6 and should use orb to be back at 0 speed
		assert.statStage(battle.p1.active[0], 'spe', 0);
		assert.false.holdsItem(battle.p1.active[0]);
	});

	it(`should not activate if the holder is at +6 Speed`, () => {
		battle = common.createBattle([[
			{ species: "Dugtrio", item: 'adrenalineorb', ability: 'steamengine', moves: ['sleeptalk'] },
		], [
			{ species: "Shedinja", item: 'stickybarb', moves: ['ember'] },
			{ species: "Incineroar", ability: 'intimidate', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		battle.makeChoices();
		assert.holdsItem(battle.p1.active[0]);
	});

	it(`should not activate if the Contrary holder is at +6 Attack`, () => {
		battle = common.createBattle([[
			{ species: "Dugtrio", item: 'adrenalineorb', ability: 'contrary', moves: ['bellydrum'] },
		], [
			{ species: "Shedinja", item: 'stickybarb', moves: ['topsyturvy'] },
			{ species: "Incineroar", ability: 'intimidate', moves: ['sleeptalk'] },
		]]);

		// Set Contrary Belly Drum (-6) and Topsy-Turvy to +6
		battle.makeChoices();
		battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'spe', 0);
		assert.holdsItem(battle.p1.active[0]);
	});

	it(`should not activate if the Contrary holder is at -6 Speed`, () => {
		battle = common.createBattle([[
			{ species: "Dugtrio", item: 'adrenalineorb', moves: ['sleeptalk'] },
		], [
			{ species: "Shedinja", item: 'stickybarb', moves: ['ember'] },
			{ species: "Shedinja", item: 'stickybarb', moves: ['topsyturvy'] },
			{ species: "Incineroar", ability: 'intimidate', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		battle.makeChoices();
		battle.makeChoices();
		assert.holdsItem(battle.p1.active[0]);
	});
});
