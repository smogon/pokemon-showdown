'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Life Orb', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should hurt the user by 1/10 of their max HP after a successful attack', () => {
		battle = common.createBattle([[
			{ species: 'Scizor', ability: 'technician', item: 'lifeorb', moves: ['uturn'] },
		], [
			{ species: 'Primarina', ability: 'torrent', moves: ['sleeptalk'] },
		]]);
		assert.hurtsBy(battle.p1.active[0], Math.floor(battle.p1.active[0].maxhp / 10), () => battle.makeChoices('move uturn', 'move sleeptalk'));
	});
});
