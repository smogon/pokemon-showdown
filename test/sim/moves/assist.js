'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`[Gen 4] Assist`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should never call moves that would fail under Gravity`, function () {
		battle = common.gen(4).createBattle([[
			{species: 'furret', moves: ['assist']},
			{species: 'smeargle', moves: ['bounce', 'fly', 'highjumpkick', 'splash']},
			{species: 'smeargle', moves: ['bounce', 'fly', 'highjumpkick', 'splash']},
			{species: 'smeargle', moves: ['bounce', 'fly', 'highjumpkick', 'splash']},
			{species: 'smeargle', moves: ['doubleteam', 'fly', 'highjumpkick', 'splash']},
			{species: 'smeargle', moves: ['bounce', 'fly', 'highjumpkick', 'splash']},
		], [
			{species: 'deoxys', moves: ['gravity']},
		]]);
		for (let i = 0; i < 5; i++) battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'evasion', 5);
	});

	it(`should never call moves that would fail under Heal Block`, function () {
		battle = common.gen(4).createBattle([[
			{species: 'furret', moves: ['assist']},
			{species: 'smeargle', moves: ['recover', 'rest', 'roost', 'wish']},
			{species: 'smeargle', moves: ['recover', 'rest', 'doubleteam', 'wish']},
			{species: 'smeargle', moves: ['recover', 'rest', 'roost', 'wish']},
			{species: 'smeargle', moves: ['recover', 'rest', 'roost', 'wish']},
			{species: 'smeargle', moves: ['recover', 'rest', 'roost', 'wish']},
		], [
			{species: 'latios', moves: ['healblock']},
		]]);
		for (let i = 0; i < 5; i++) battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'evasion', 5);
	});
});
