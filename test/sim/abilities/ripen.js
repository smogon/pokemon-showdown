'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Ripen", function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should double healing from Berries', function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'ripen', item: 'sitrusberry', ivs: {hp: 30}, moves: ['sleeptalk']},
		], [
			{species: 'wynaut', ability: 'compoundeyes', moves: ['superfang']},
		]]);
		battle.makeChoices();
		const ripenWynaut = battle.p1.active[0];
		assert(ripenWynaut.hp, Math.floor(ripenWynaut.maxhp / 2) + (Math.floor(ripenWynaut.maxhp / 4) * 2));
	});

	it('should double stat boosts from Berries', function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'ripen', item: 'liechiberry', evs: {hp: 4}, moves: ['sleeptalk']},
		], [
			{species: 'wynaut', ability: 'compoundeyes', moves: ['superfang']},
		]]);
		battle.makeChoices();
		battle.makeChoices();
		const ripenWynaut = battle.p1.active[0];
		assert.statStage(ripenWynaut, 'atk', 2);
	});

	it('should double damage done from Jaboca / Rowap Berries', function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'ripen', item: 'jabocaberry', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', moves: ['tackle']},
		]]);
		battle.makeChoices();
		const nonRipenWynaut = battle.p2.active[0];
		// Should be 249; if it was just 1/8, would be 290
		assert(nonRipenWynaut.hp, nonRipenWynaut.maxhp - (Math.floor(nonRipenWynaut.maxhp / 8) * 2));
	});

	it('should allow resist Berries to quarter the damage done', function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'ripen', item: 'colburberry', evs: {spe: 4}, moves: ['luckychant']},
		], [
			{species: 'wynaut', moves: ['darkpulse']},
		]]);
		battle.makeChoices();
		const ripenWynaut = battle.p1.active[0];
		const damage = ripenWynaut.maxhp - ripenWynaut.hp;
		assert.bounded(damage, [18, 21]); // If it was only halved, range would be 36-43
	});

	it('should allow resist Berries to quarter the damage done even on a critical hit', function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'ripen', item: 'colburberry', evs: {spe: 4}, moves: ['sleeptalk']},
		], [
			{species: 'wynaut', moves: ['laserfocus', 'darkpulse']},
		]]);
		battle.makeChoices();
		battle.makeChoices('auto', 'move dark pulse');
		const ripenWynaut = battle.p1.active[0];
		const damage = ripenWynaut.maxhp - ripenWynaut.hp;
		assert.bounded(damage, [27, 32]); // If it was only halved, range would be 54-64
	});

	it('should double the effects of Berries eaten by Fling', function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'ripen', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', item: "liechiberry", moves: ['fling']},
		]]);
		battle.makeChoices();
		const ripenWynaut = battle.p1.active[0];
		assert.statStage(ripenWynaut, 'atk', 2);
	});

	it('should double the effects of Berries eaten by Bug Bite', function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'ripen', moves: ['bugbite']},
		], [
			{species: 'wynaut', item: "liechiberry", moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		const ripenWynaut = battle.p1.active[0];
		assert.statStage(ripenWynaut, 'atk', 2);
	});
});
