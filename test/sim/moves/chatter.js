'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Chatter', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should pierce through substitutes', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Deoxys-Attack", ability: 'victorystar', item: 'laggingtail', moves: ['splash', 'chatter'] }] });
		battle.setPlayer('p2', { team: [{ species: "Caterpie", level: 2, ability: 'naturalcure', item: 'focussash', moves: ['substitute', 'rest'] }] });
		battle.makeChoices('move splash', 'move substitute');
		battle.makeChoices('move chatter', 'move rest');
		assert.equal(battle.p2.active[0].item, '');
	});
});

describe('Chatter [Gen 5]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should not pierce through substitutes', () => {
		battle = common.gen(5).createBattle([
			[{ species: "Deoxys-Attack", ability: 'victorystar', item: 'laggingtail', moves: ['splash', 'chatter'] }],
			[{ species: "Caterpie", level: 2, ability: 'naturalcure', item: 'focussash', moves: ['substitute', 'rest'] }],
		]);
		battle.makeChoices('move splash', 'move substitute');
		battle.makeChoices('move chatter', 'move rest');
		assert.equal(battle.p2.active[0].item, 'focussash');
	});

	it('should be boosted by Sheer Force', () => {
		battle = common.gen(5).createBattle([
			[{ species: "Rayquaza", ability: 'sheerforce', moves: ['chatter'] }],
			[{ species: "Carnivine", ability: 'battlearmor', moves: ['sleeptalk'] }],
		]);
		battle.makeChoices();
		assert.fainted(battle.p2.active[0]);
	});
});
