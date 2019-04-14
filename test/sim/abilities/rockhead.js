'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Rock Head', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should block recoil from most moves', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Aerodactyl', ability: 'rockhead', moves: ['doubleedge']}]});
		battle.setPlayer('p2', {team: [{species: 'Registeel', ability: 'clearbody', moves: ['rest']}]});
		assert.false.hurts(battle.p1.active[0], () => battle.makeChoices('move doubleedge', 'move rest'));
	});

	it('should not block recoil if the ability is disabled/removed mid-attack', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Aerodactyl', ability: 'rockhead', moves: ['doubleedge']}]});
		battle.setPlayer('p2', {team: [{species: 'Registeel', ability: 'mummy', moves: ['rest']}]});
		assert.hurts(battle.p1.active[0], () => battle.makeChoices('move doubleedge', 'move rest'));
	});

	it('should not block recoil from Struggle', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Aerodactyl', ability: 'rockhead', moves: ['roost']}]});
		battle.setPlayer('p2', {team: [{species: 'Sableye', ability: 'prankster', moves: ['taunt']}]});
		battle.makeChoices('move roost', 'move taunt');
		assert.hurts(battle.p1.active[0], () => battle.makeChoices('move 1', 'move taunt'));
	});

	it('should not block crash damage', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Rampardos', ability: 'rockhead', moves: ['jumpkick']}]});
		battle.setPlayer('p2', {team: [{species: 'Sableye', ability: 'prankster', moves: ['taunt']}]});
		assert.hurts(battle.p1.active[0], () => battle.makeChoices('move jumpkick', 'move taunt'));
	});

	it('should not block indirect damage', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Rampardos', ability: 'rockhead', moves: ['splash']}]});
		battle.setPlayer('p2', {team: [{species: 'Abomasnow', ability: 'snowwarning', moves: ['splash']}]});
		assert.hurts(battle.p1.active[0], () => battle.makeChoices());
	});
});
