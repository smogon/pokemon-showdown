'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Taunt', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should prevent the target from using Status moves and disable them', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Sableye', ability: 'prankster', moves: ['taunt'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Chansey', ability: 'naturalcure', moves: ['calmmind'] }] });
		battle.makeChoices('move taunt', 'move calmmind');
		assert.equal(battle.p2.active[0].boosts['spa'], 0);
		assert.equal(battle.p2.active[0].boosts['spd'], 0);
		battle.makeChoices('move taunt', 'move struggle');
	});

	it('should not prevent the target from using Z-Powered Status moves', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Sableye', ability: 'prankster', moves: ['taunt'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Charmander', ability: 'blaze', item: 'firiumz', moves: ['sunnyday'] }] });
		battle.makeChoices('move taunt', 'move sunnyday zmove');
		assert.statStage(battle.p2.active[0], 'spe', 1);
		assert(battle.field.isWeather('sunnyday'));
	});

	it('[Hackmons] should prevent the target from using Z-Powered Status moves if not boosted by a Z-crystal', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Sableye', ability: 'prankster', moves: ['taunt'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Eevee', ability: 'runaway', moves: ['extremeevoboost'] }] });
		battle.makeChoices();
		assert.statStage(battle.p2.active[0], 'spe', 0);
	});
});
