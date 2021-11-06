'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Wonder Room', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should swap the raw Defense and Special Defense stats, but not stat stage changes or other defense modifiers`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', moves: ['brickbreak']},
		], [
			{species: 'Blissey', ability: 'shellarmor', moves: ['wonderroom', 'defensecurl', 'roost']},
			{species: 'Chansey', ability: 'shellarmor', item: 'assaultvest', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		const blissey = battle.p2.active[0];
		let damage = blissey.maxhp - blissey.hp;
		assert.bounded(damage, [30, 36], `Wonder Room should cause Blissey to use its Special Defense for Brick Break's damage calculation`);

		battle.makeChoices('auto', 'move defensecurl');
		battle.makeChoices('auto', 'move roost');
		damage = blissey.maxhp - blissey.hp;
		assert.bounded(damage, [22, 26], `Wonder Room should still use Defense Curl's +1 Def boost for Brick Break's damage calculation`);

		battle.makeChoices('auto', 'switch chansey');
		const chansey = battle.p2.active[0];
		damage = chansey.maxhp - chansey.hp;
		assert.bounded(damage, [38, 46], `Wonder Room should not use Assault Vest for Brick Break's damage calculation`);
	});

	it(`should cause Body Press to use Sp. Def stat stage changes`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', moves: ['amnesia', 'bodypress']},
		], [
			{species: 'Blissey', ability: 'shellarmor', moves: ['wonderroom', 'sleeptalk']},
		]]);

		battle.makeChoices();
		battle.makeChoices('move bodypress', 'move sleeptalk');
		const blissey = battle.p2.active[0];
		const damage = blissey.maxhp - blissey.hp;
		assert.bounded(damage, [100, 118]);
	});

	it(`should be ignored by Download when determining raw stats, but not stat stage changes`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', moves: ['wonderroom']},
			{species: 'Porygon', ability: 'download', moves: ['sleeptalk']},
		], [
			{species: 'Venusaur', moves: ['sleeptalk', 'amnesia']},
		]]);

		battle.makeChoices();
		battle.makeChoices('switch porygon', 'auto');
		const porygon = battle.p1.active[0];
		assert.statStage(porygon, 'atk', 1); // Download is ignoring Wonder Room, so it's comparing raw Def vs. Sp. Def
		battle.makeChoices('switch wynaut', 'move amnesia');
		battle.makeChoices('switch porygon', 'auto');
		assert.statStage(porygon, 'spa', 1); // Wonder Room is applying the +2 Sp. Def to Venusaur's Def
	});
});
