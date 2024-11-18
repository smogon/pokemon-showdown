'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Download', () => {
	afterEach(() => battle.destroy());

	it('should boost based on which defensive stat is higher', () => {
		battle = common.createBattle([[
			{species: 'porygon', moves: ['sleeptalk'], ability: 'download'},
			{species: 'furret', moves: ['sleeptalk']},
		], [
			{species: 'stonjourner', moves: ['sleeptalk']},
			{species: 'chansey', moves: ['sleeptalk']},
		]]);
		assert.statStage(battle.p1.active[0], 'spa', 1);
		battle.makeChoices('switch 2', 'switch 2');
		battle.makeChoices('switch 2', 'auto');
		assert.statStage(battle.p1.active[0], 'atk', 1);
	});

	it('should boost Special Attack if both stats are tied', () => {
		battle = common.createBattle([[
			{species: 'porygon', moves: ['sleeptalk'], ability: 'download'},
		], [
			{species: 'mew', moves: ['sleeptalk']},
		]]);
		assert.statStage(battle.p1.active[0], 'spa', 1);
		assert.statStage(battle.p1.active[0], 'atk', 0);
	});

	it('should boost based on the total of both foes in a Double Battle', () => {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'porygon', moves: ['sleeptalk'], ability: 'download'},
			{species: 'blissey', moves: ['sleeptalk']},
		], [
			{species: 'blissey', level: 1, moves: ['sleeptalk']},
			{species: 'stonjourner', moves: ['sleeptalk']},
		]]);
		assert.statStage(battle.p1.active[0], 'spa', 1);
		assert.statStage(battle.p1.active[0], 'atk', 0);
	});

	it('should trigger even if the foe is behind a Substitute', () => {
		battle = common.createBattle([[
			{species: 'furret', moves: ['sleeptalk']},
			{species: 'porygon', ability: 'download', moves: ['sleeptalk']},
		], [
			{species: 'blissey', moves: ['substitute']},
		]]);
		battle.makeChoices();
		battle.makeChoices('switch 2', 'auto');
		assert.statStage(battle.p1.active[0], 'atk', 1);
	});

	describe('Gen 4', () => {
		it('should not trigger if the foe is behind a Substitute', () => {
			battle = common.gen(4).createBattle([[
				{species: 'furret', moves: ['sleeptalk']},
				{species: 'porygon', ability: 'download', moves: ['sleeptalk']},
			], [
				{species: 'ampharos', moves: ['substitute']},
			]]);
			battle.makeChoices();
			battle.makeChoices('switch 2', 'auto');
			assert.statStage(battle.p1.active[0], 'atk', 0);
			assert.statStage(battle.p1.active[0], 'spa', 0);
		});

		it('in Double Battles, should only account for foes not behind a Substitute', () => {
			battle = common.gen(4).createBattle({gameType: 'doubles'}, [[
				{species: 'furret', moves: ['sleeptalk']},
				{species: 'ampharos', moves: ['sleeptalk']},
				{species: 'porygon', ability: 'download', moves: ['sleeptalk']},
			], [
				{species: 'blissey', moves: ['substitute']},
				{species: 'furret', moves: ['sleeptalk', 'substitute']},
			]]);
			battle.makeChoices();
			battle.makeChoices('move 1, switch 3', 'auto');
			assert.statStage(battle.p1.active[1], 'atk', 0);
			assert.statStage(battle.p1.active[1], 'spa', 1);
			battle.makeChoices('move 1, switch 3', 'move 1, move 2');
			battle.makeChoices('move 1, switch 3', 'auto');
			assert.statStage(battle.p1.active[1], 'atk', 0);
			assert.statStage(battle.p1.active[1], 'spa', 0);
		});
	});
});
