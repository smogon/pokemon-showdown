'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Ripen", () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should double healing from Berries', () => {
		battle = common.createBattle([[
			{ species: 'wynaut', ability: 'ripen', item: 'sitrusberry', ivs: { hp: 30 }, moves: ['sleeptalk'] },
		], [
			{ species: 'wynaut', ability: 'compoundeyes', moves: ['superfang'] },
		]]);
		battle.makeChoices();
		const ripenWynaut = battle.p1.active[0];
		assert.equal(ripenWynaut.hp, Math.floor(ripenWynaut.maxhp / 2) + (Math.floor(ripenWynaut.maxhp / 4) * 2));
	});

	it('should double stat boosts from Berries', () => {
		battle = common.createBattle([[
			{ species: 'wynaut', ability: 'ripen', item: 'liechiberry', evs: { hp: 4 }, moves: ['sleeptalk'] },
		], [
			{ species: 'wynaut', ability: 'compoundeyes', moves: ['superfang'] },
		]]);
		battle.makeChoices();
		battle.makeChoices();
		const ripenWynaut = battle.p1.active[0];
		assert.statStage(ripenWynaut, 'atk', 2);
	});

	it(`should double damage done from Jaboca / Rowap Berries`, () => {
		battle = common.createBattle([[
			{ species: 'wynaut', ability: 'ripen', item: 'jabocaberry', moves: ['sleeptalk'] },
		], [
			{ species: 'falinks', moves: ['tackle'] },
		]]);
		battle.makeChoices();
		const falinks = battle.p2.active[0];
		assert.equal(falinks.hp, falinks.maxhp - Math.floor(falinks.maxhp / 4), `Falinks should have lost 1/4 of its HP`);
	});

	it('should allow resist Berries to quarter the damage done', () => {
		battle = common.createBattle([[
			{ species: 'wynaut', ability: 'ripen', item: 'colburberry', evs: { spe: 4 }, moves: ['luckychant'] },
		], [
			{ species: 'wynaut', moves: ['darkpulse'] },
		]]);
		battle.makeChoices();
		const ripenWynaut = battle.p1.active[0];
		const damage = ripenWynaut.maxhp - ripenWynaut.hp;
		assert.bounded(damage, [18, 21]); // If it was only halved, range would be 36-43
	});

	it('should allow resist Berries to quarter the damage done even on a critical hit', () => {
		battle = common.createBattle([[
			{ species: 'wynaut', ability: 'ripen', item: 'colburberry', evs: { spe: 4 }, moves: ['sleeptalk'] },
		], [
			{ species: 'wynaut', moves: ['laserfocus', 'darkpulse'] },
		]]);
		battle.makeChoices();
		battle.makeChoices('auto', 'move dark pulse');
		const ripenWynaut = battle.p1.active[0];
		const damage = ripenWynaut.maxhp - ripenWynaut.hp;
		assert.bounded(damage, [27, 32]); // If it was only halved, range would be 54-64
	});

	it('should double the effects of Berries eaten by Fling', () => {
		battle = common.createBattle([[
			{ species: 'wynaut', ability: 'ripen', moves: ['sleeptalk'] },
		], [
			{ species: 'wynaut', item: "liechiberry", moves: ['fling'] },
		]]);
		battle.makeChoices();
		const ripenWynaut = battle.p1.active[0];
		assert.statStage(ripenWynaut, 'atk', 2);
	});

	it('should double the effects of Berries eaten by Bug Bite', () => {
		battle = common.createBattle([[
			{ species: 'wynaut', ability: 'ripen', moves: ['bugbite'] },
		], [
			{ species: 'wynaut', item: "liechiberry", moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		const ripenWynaut = battle.p1.active[0];
		assert.statStage(ripenWynaut, 'atk', 2);
	});
});
