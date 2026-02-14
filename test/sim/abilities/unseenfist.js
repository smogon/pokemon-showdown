'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Unseen Fist', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should allow contact moves to bypass Protect', () => {
		battle = common.createBattle([[
			{ species: 'Urshifu', ability: 'unseenfist', moves: ['tackle'] },
		], [
			{ species: 'Wynaut', moves: ['protect'] },
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
	});

	it('should not allow non-contact moves to bypass Protect', () => {
		battle = common.createBattle([[
			{ species: 'Urshifu', ability: 'unseenfist', moves: ['swift'] },
		], [
			{ species: 'Wynaut', moves: ['protect'] },
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p2.active[0]);
	});

	it('should allow Sky Drop to bypass Protect', () => {
		battle = common.createBattle([[
			{ species: 'Urshifu', ability: 'unseenfist', moves: ['skydrop'] },
		], [
			{ species: 'Wynaut', moves: ['protect'] },
		]]);
		battle.makeChoices('move skydrop', 'move protect');
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
	});

	it('should allow two-turn contact moves to bypass Protect even when contact flag is removed on turn 1', () => {
		battle = common.createBattle([[
			{ species: 'Urshifu', ability: 'unseenfist', moves: ['skydrop'] },
		], [
			{ species: 'Wynaut', moves: ['protect'] },
		]]);
		const wynaut = battle.p2.active[0];
		battle.makeChoices('move skydrop', 'move protect');
		assert.fullHP(wynaut);
		battle.makeChoices();
		assert.false.fullHP(wynaut);
	});
});
