'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Me First`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should be selectable even if the user is Taunted or holds Assault Vest`, function () {
		battle = common.gen(7).createBattle([[
			{species: 'corphish', moves: ['sleeptalk']},
			{species: 'aerodactyl', item: 'assaultvest', moves: ['mefirst']},
		], [
			{species: 'wynaut', moves: ['taunt', 'watergun']},
		]]);
		battle.makeChoices('switch 2', 'move taunt');
		battle.makeChoices('move mefirst', 'move watergun');
		assert.false.fullHP(battle.p2.active[0]);
	});

	it(`should not copy recharge turns from moves like Hyper Beam`, function () {
		battle = common.gen(7).createBattle([[
			{species: 'aerodactyl', moves: ['sleeptalk', 'mefirst']},
		], [
			{species: 'wynaut', ability: 'noguard', moves: ['hyperbeam']},
		]]);
		battle.makeChoices();
		battle.makeChoices('move mefirst', 'auto');
		const log = battle.getDebugLog();
		const rechargeIndex = log.indexOf('|move|p1a: Aerodactyl|recharge|');
		assert.equal(rechargeIndex, -1, 'Aerodactyl should fail to copy a recharge turn, not recharge itself.');
	});
});
