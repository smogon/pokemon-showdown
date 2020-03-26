'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Wandering Spirit', function () {
	afterEach(() => battle.destroy());

	it('should exchange abilities with an attacker that makes contact', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Decidueye', ability: 'overgrow', moves: ['shadowsneak']}]});
		battle.setPlayer('p2', {team: [{species: 'Runerigus', ability: 'wanderingspirit', moves: ['sleeptalk']}]});
		battle.makeChoices('move shadowsneak', 'move sleeptalk');
		assert(battle.p1.active[0].hasAbility('wanderingspirit'));
		assert(battle.p2.active[0].hasAbility('overgrow'));
	});

	it('should not activate while Dynamaxed', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Decidueye', ability: 'overgrow', moves: ['shadowsneak']}]});
		battle.setPlayer('p2', {team: [{species: 'Runerigus', ability: 'wanderingspirit', moves: ['bodypress']}]});
		battle.makeChoices('move shadowsneak', 'move 1 dynamax');
		assert(battle.p1.active[0].hasAbility('overgrow'));
		assert(battle.p2.active[0].hasAbility('wanderingspirit'));
	});

	it('should not swap with Wonder Guard', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Shedinja', ability: 'wonderguard', moves: ['shadowsneak']}]});
		battle.setPlayer('p2', {team: [{species: 'Runerigus', ability: 'wanderingspirit', moves: ['sleeptalk']}]});
		battle.makeChoices('move shadowsneak', 'move sleeptalk');
		assert(battle.p1.active[0].hasAbility('wonderguard'));
		assert(battle.p2.active[0].hasAbility('wanderingspirit'));
	});
});
