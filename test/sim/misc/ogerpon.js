'use strict';

const assert = require('assert').strict;
const common = require('./../../common');

let battle;

describe(`[Hackmons] Ogerpon`, function () {
	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9838633
	it(`should keep permanent abilites after Terastallizing until it switches out`, function () {
		battle = common.gen(9).createBattle([[
			{species: 'ogerpon', ability: 'multitype', moves: ['sleeptalk']},
			{species: 'shedinja', moves: ['splash']},
		], [
			{species: 'silicobra', moves: ['stealthrock']},
		]]);
		const ogerpon = battle.p1.active[0];
		battle.makeChoices('move sleeptalk terastallize', 'auto');
		assert.equal(ogerpon.ability, 'multitype', `Ogerpon's ability should not have changed to Embody Aspect`);
		battle.makeChoices('switch 2', 'auto');
		assert.equal(ogerpon.ability, 'embodyaspectteal', `Ogerpon's ability should be Embody Aspect after switching out`);
	});
});
