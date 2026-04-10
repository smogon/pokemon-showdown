'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Adaptability', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should boost STAB moves to 2x instead of 1.5x`, () => {
		battle = common.createBattle([[
			{ species: 'Porygon-Z', ability: 'adaptability', moves: ['triattack'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.forceRandomChance = false;
		battle.onEvent('Accuracy', battle.format, () => true);
		battle.makeChoices('move triattack', 'move sleeptalk');
		assert.equal(battle.p2.active[0].maxhp - battle.p2.active[0].hp, 138);
	});

	it(`should not affect non-STAB moves`, () => {
		battle = common.createBattle([[
			{ species: 'Porygon-Z', ability: 'adaptability', moves: ['icebeam'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.forceRandomChance = false;
		battle.onEvent('Accuracy', battle.format, () => true);
		battle.makeChoices('move icebeam', 'move sleeptalk');
		// Ice Beam is not STAB for Porygon-Z; Adaptability should not change the damage
		assert.equal(battle.p2.active[0].maxhp - battle.p2.active[0].hp, 77);
	});

	it(`should apply to both types of a dual-type Pokemon`, () => {
		battle = common.createBattle([[
			{ species: 'Empoleon', ability: 'adaptability', moves: ['surf'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.forceRandomChance = false;
		battle.onEvent('Accuracy', battle.format, () => true);
		battle.makeChoices('move surf', 'move sleeptalk');
		// Empoleon is Water/Steel; Surf gets Adaptability 2x STAB on both types
		assert.equal(battle.p2.active[0].maxhp - battle.p2.active[0].hp, 130);
	});
});
