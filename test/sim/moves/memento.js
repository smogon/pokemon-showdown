'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Memento`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should cause the user to faint even if the target has Clear Body`, function () {
		battle = common.createBattle([[
			{species: 'whimsicott', moves: ['memento']},
			{species: 'landorus', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', ability: 'clearbody', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.equal(battle.requestState, 'switch');
	});

	it(`should not cause the user to faint if used into Substitute`, function () {
		battle = common.createBattle([[
			{species: 'whimsicott', moves: ['memento']},
			{species: 'landorus', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', ability: 'prankster', moves: ['substitute']},
		]]);
		battle.makeChoices();
		assert.equal(battle.requestState, 'move');
	});

	it(`should set the Z-Memento healing flag even if the Memento itself was not successful`, function () {
		battle = common.createBattle([[
			{species: 'landorus', moves: ['sleeptalk']},
			{species: 'whimsicott', item: 'darkiniumz', moves: ['memento']},
		], [
			{species: 'wynaut', ability: 'noguard', moves: ['circlethrow', 'substitute']},
		]]);
		battle.makeChoices('auto', 'move substitute');
		battle.makeChoices();
		battle.makeChoices('move memento zmove', 'auto');
		const landorus = battle.p1.active[0];
		assert.fullHP(landorus);
	});
});
