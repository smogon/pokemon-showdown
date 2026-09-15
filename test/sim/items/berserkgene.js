'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Berserk Gene', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should set the confusion counter to 256`, () => {
		battle = common.gen(2).createBattle([[
			{ species: 'Abra', item: 'berserkgene', moves: ['sleeptalk'] },
		], [
			{ species: 'Charmander', moves: ['sleeptalk'] },
		]]);
		for (let i = 0; i < 256; i++) {
			assert(battle.p1.active[0].volatiles['confusion']);
			battle.makeChoices();
			battle.p1.active[0].hp = battle.p1.active[0].maxhp; // you get a car
			battle.p1.active[0].moveSlots[0].pp += 1; // you get a car
			battle.p2.active[0].moveSlots[0].pp += 1; // you get a car
		}
		assert.false(battle.p1.active[0].volatiles['confusion']);
	});

	it(`should inherit the confusion counter of the last confused Pokemon`, () => {
		battle = common.gen(2).createBattle([[
			{ species: 'Abra', moves: ['sleeptalk'] },
			{ species: 'Abra', item: 'berserkgene', moves: ['sleeptalk'] },
		], [
			{ species: 'Charmander', moves: ['sleeptalk', 'confuseray'] },
		]]);
		battle.makeChoices('move sleeptalk', 'move confuseray');
		const counfusionCounter = battle.p1.active[0].volatiles['confusion'].time;
		battle.makeChoices('switch 2', 'move sleeptalk');
		for (let i = 0; i < counfusionCounter; i++) {
			assert(battle.p1.active[0].volatiles['confusion']);
			battle.makeChoices();
			battle.p1.active[0].hp = battle.p1.active[0].maxhp;
		}
		assert.false(battle.p1.active[0].volatiles['confusion']);
	});
});
