'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Teatime', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should force all Pokemon to eat their Berries immediately', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', item: 'sitrusberry', moves: ['sleeptalk']},
			{species: 'wynaut', item: 'aguavberry', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', item: 'lumberry', moves: ['sleeptalk']},
			{species: 'wynaut', item: 'sitrusberry', moves: ['teatime']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.pokemon[0].item, '');
		assert.equal(battle.p1.pokemon[1].item, '');
		assert.equal(battle.p2.pokemon[0].item, '');
		assert.equal(battle.p2.pokemon[1].item, '');
	});

	it('should force Pokemon to eat Berries while affected by Unnerve', function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'sitrusberry', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', ability: 'unnerve', moves: ['teatime']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.pokemon[0].item, '');
	});

	it('should force Pokemon to eat Berries while Magic Room is active', function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'sitrusberry', evs: {spe: 252}, moves: ['magicroom']},
		], [
			{species: 'wynaut', moves: ['teatime']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.pokemon[0].item, '');
	});

	it('should force Pokemon with Klutz to eat Berries', function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'sitrusberry', ability: 'klutz', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', moves: ['teatime']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.pokemon[0].item, '');
	});

	it('should force Pokemon with Substitute to eat Berries', function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'sitrusberry', evs: {spe: 252}, moves: ['substitute']},
		], [
			{species: 'wynaut', moves: ['teatime']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.pokemon[0].item, '');
	});

	it('should not cause Pokemon in the semi-invulernable state to eat their Berries', function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'sitrusberry', evs: {spe: 252}, moves: ['fly']},
		], [
			{species: 'wynaut', moves: ['teatime']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.pokemon[0].item, 'sitrusberry');
	});

	it('should not cause Recycle to fail to restore the Berry', function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'sitrusberry', moves: ['recycle']},
		], [
			{species: 'wynaut', evs: {spe: 252}, moves: ['teatime']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.pokemon[0].item, 'sitrusberry');
	});
});
