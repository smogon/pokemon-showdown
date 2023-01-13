'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let ctx;

describe('Berserk', function () {
	afterEach(function () {
		ctx.battle.destroy();
	});

	it(`should activate prior to healing from Sitrus Berry`, function () {
		const {battle, drampa} = ctx = common.getTestContext([[
			{species: 'drampa', item: 'sitrusberry', ability: 'berserk', evs: {hp: 4}, moves: ['sleeptalk']},
		], [
			{species: 'wynaut', ability: 'compoundeyes', moves: ['superfang']},
		]]);

		battle.makeChoices();
		assert.statStage(drampa, 'spa', 1);
		assert.equal(drampa.hp, Math.floor(drampa.maxhp / 2) + Math.floor(drampa.maxhp / 4));
	});

	it(`should not activate prior to healing from Sitrus Berry after a multi-hit move`, function () {
		const {battle, drampa} = ctx = common.getTestContext([[
			{species: 'drampa', item: 'sitrusberry', ability: 'berserk', evs: {hp: 4}, moves: ['sleeptalk']},
		], [
			{species: 'wynaut', ability: 'parentalbond', moves: ['seismictoss']},
		]]);

		battle.makeChoices();
		assert.statStage(drampa, 'spa', 0);
		assert.equal(drampa.hp, drampa.maxhp - 200 + Math.floor(drampa.maxhp / 4));
	});

	it(`should not activate below 50% HP if it was damaged by Dragon Darts`, function () {
		const {battle, drampa} = ctx = common.getTestContext({gameType: 'doubles'}, [[
			{species: 'drampa', ability: 'berserk', evs: {hp: 4}, moves: ['sleeptalk']},
			{species: 'togedemaru', ability: 'compoundeyes', moves: ['superfang']},
		], [
			{species: 'wynaut', moves: ['dragondarts']},
			{species: 'shuckle', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move sleeptalk, move superfang -1', 'auto');
		assert.statStage(drampa, 'spa', 1);
	});
});
