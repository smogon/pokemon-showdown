'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Thick Fat', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should halve damage from Fire- or Ice-type attacks', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Hariyama", ability: 'thickfat', moves: ['splash']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Nidoking", ability: 'sheerforce', moves: ['incinerate', 'icebeam']}]);
		const target = battle.p1.active[0];
		battle.p2.chooseMove('incinerate').foe.chooseDefault();
		assert.bounded(target.maxhp - target.hp, [29, 35]);
		battle.heal(target.maxhp, target, target, battle.getFormat());
		battle.p2.chooseMove('icebeam').foe.chooseDefault();
		assert.bounded(target.maxhp - target.hp, [56, 66]);
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Hariyama", ability: 'thickfat', moves: ['splash']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Nidoking", ability: 'moldbreaker', moves: ['incinerate', 'icebeam']}]);
		const target = battle.p1.active[0];
		battle.p2.chooseMove('incinerate').foe.chooseDefault();
		assert.bounded(target.maxhp - target.hp, [57, 68]);
		battle.heal(target.maxhp, target, target, battle.getFormat());
		battle.p2.chooseMove('icebeam').foe.chooseDefault();
		assert.bounded(target.maxhp - target.hp, [85, 101]);
	});
});
