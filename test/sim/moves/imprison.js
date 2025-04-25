'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Imprison', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should prevent foes from using moves that the user knows`, () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [
			{ species: 'Abra', ability: 'prankster', moves: ['imprison', 'calmmind', 'batonpass'] },
			{ species: 'Kadabra', ability: 'prankster', moves: ['imprison', 'calmmind'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: 'Abra', ability: 'synchronize', moves: ['calmmind', 'gravity'] },
			{ species: 'Kadabra', ability: 'prankster', moves: ['imprison', 'calmmind'] },
		] });

		battle.makeChoices('move imprison', 'move calmmind');
		assert.statStage(battle.p2.active[0], 'spa', 0);
		assert.statStage(battle.p2.active[0], 'spd', 0);
		assert.cantMove(() => battle.choose('p2', 'move calmmind'), 'Abra', 'Calm Mind', true);

		// Imprison doesn't end when the foe switches
		battle.makeChoices('auto', 'switch 2');
		assert.cantMove(() => battle.choose('p2', 'move calmmind'));

		// Imprison should cause Struggle if all moves match
		battle.makeChoices('auto', 'move struggle');

		// Imprison is not passed by Baton Pass
		battle.makeChoices('move batonpass', 'move struggle');
		assert.statStage(battle.p2.active[0], 'spa', 0);
		battle.makeChoices('switch 2', '');
		assert.statStage(battle.p2.active[0], 'spa', 0);
		battle.makeChoices('move calmmind', 'move calmmind');
		assert.statStage(battle.p2.active[0], 'spa', 1);

		// Imprison ends after user switches
		battle.makeChoices('switch 2', 'move calmmind');
		assert.statStage(battle.p2.active[0], 'spa', 2);
		battle.makeChoices('move calmmind', 'move calmmind');
		assert.statStage(battle.p2.active[0], 'spa', 3);
	});

	it(`should not prevent foes from using Z-Powered Status moves`, () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Sableye', ability: 'prankster', moves: ['imprison', 'sunnyday'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Charmander', ability: 'blaze', item: 'firiumz', moves: ['sunnyday'] }] });

		battle.makeChoices('move imprison', 'move sunnyday zmove');
		assert.statStage(battle.p2.active[0], 'spe', 1);
		assert(battle.field.isWeather('sunnyday'));
	});

	it(`should not prevent the user from using moves that a foe knows`, () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [
			{ species: 'Abra', ability: 'prankster', moves: ['imprison', 'calmmind', 'batonpass'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: 'Abra', ability: 'synchronize', moves: ['calmmind', 'gravity'] },
		] });
		const imprisonUser = battle.p1.active[0];

		battle.makeChoices('move imprison', 'auto');
		battle.makeChoices('move calmmind', 'auto');
		assert.statStage(imprisonUser, 'spa', 1);
		assert.statStage(imprisonUser, 'spd', 1);
	});
});
