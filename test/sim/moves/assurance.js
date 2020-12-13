'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Assurance', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should double its base power if the target already took damage this turn', function () {
		battle = common.createBattle([
			[{species: 'Morpeko', ability: 'hungerswitch', moves: ['assurance']}],
			[{species: 'Regieleki', ability: 'transistor', moves: ['wildcharge']}],
		]);
		battle.makeChoices();
		const regi = battle.p2.active[0];
		const recoilRange = [113, 133].map(d => Math.floor(d / 4));
		const assuRange = [214, 253];
		assert.bounded(regi.hp, [regi.maxhp - recoilRange[1] - assuRange[1], regi.maxhp - recoilRange[0] - assuRange[0]]);
	});
});
