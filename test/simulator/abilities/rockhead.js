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
		battle.join('p1', 'Guest 1', 1, [{species: 'Aerodactyl', ability: 'rockhead', moves: ['doubleedge']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Registeel', ability: 'clearbody', moves: ['rest']}]);
		assert.false.hurts(battle.p1.active[0], () => battle.commitDecisions());
	});

	it('should not block recoil if the ability is disabled/removed mid-attack', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Aerodactyl', ability: 'rockhead', moves: ['doubleedge']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Registeel', ability: 'mummy', moves: ['rest']}]);
		assert.hurts(battle.p1.active[0], () => battle.commitDecisions());
	});

	it('should not block recoil from Struggle', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Aerodactyl', ability: 'rockhead', moves: ['roost']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Sableye', ability: 'prankster', moves: ['taunt']}]);
		battle.commitDecisions();
		assert.hurts(battle.p1.active[0], () => battle.commitDecisions());
	});

	it('should not block crash damage', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Rampardos', ability: 'rockhead', moves: ['jumpkick']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Sableye', ability: 'prankster', moves: ['taunt']}]);
		assert.hurts(battle.p1.active[0], () => battle.commitDecisions());
	});
});
