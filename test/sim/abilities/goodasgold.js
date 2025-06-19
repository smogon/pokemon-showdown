'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Good as Gold', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should block Perish Song', () => {
		battle = common.createBattle([
			[{ species: "Gholdengo", ability: 'goodasgold', moves: ['sleeptalk'] }],
			[{ species: "Murkrow", moves: ['perishsong'] }],
		]);
		battle.makeChoices();
		assert.false(battle.p1.active[0].volatiles['perishsong']);
		assert(battle.p2.active[0].volatiles['perishsong']);
	});

	it('should not block Haze', () => {
		battle = common.createBattle([
			[{ species: "Gholdengo", ability: 'goodasgold', moves: ['nastyplot'] }],
			[{ species: "Vaporeon", moves: ['haze'] }],
		]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].boosts.spa, 0);
	});
});
