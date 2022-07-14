'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Agility + Swords Dance', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('[Gen 1] Agility should negate the paralysis speed drop.', function () {
		// If a Pokemon uses a move that boosts a stat affected by a major status effect, the drop from the major status effect is ignored.
		// This should probably have a seed that prevents any full paralysis but I have absolutely no clue how that works send help
		battle = common.mod('gen1').createBattle([[
			{species: 'Tauros', moves: ['thunderwave'], evs: {spe: 252}, ivs: {spe: 31}},
		], [
			{species: 'Zapdos', moves: ['agility', 'pound'], evs: {spe: 252}, ivs: {spe: 31}},
		]]);
		const initialZapdosSpeed = battle.p1.active[0].speed;
		battle.makeChoices('move thunderwave', 'move agility');
		assert(battle.p1.active[0].speed > initialZapdosSpeed, 'Zapdos should be faster.');
	});

	it('[Gen 1] Swords Dance should negate the burn attack drop.', function () {
		// Needs a seed where the burn happens.
		battle = common.mod('gen1').createBattle([[
			{species: 'Kingler', moves: ['swordsdance', 'hyperbeam'], evs: {atk: 252}, ivs: {atk: 31}},
		], [
			{species: 'Alakazam', moves: ['fireblast', 'splash'], evs: {hp: 252, def: 252}, ivs: {def: 31}},
		]]);
		battle.makeChoices('move swordsdance', 'move fireblast');
		battle.makeChoices('move hyperbeam', 'move splash');
		const vic = battle.p2.active[0];
		assert.equal(vic.hp, 0, 'zam should die');
	});

	it('[Gen 1 Stadium Zero] Agility should negate the paralysis speed drop.', function () {
		// Stadium Zero maintains the original stat modification bugs from RBY.
		// This should probably have a seed that prevents any full paralysis but I have absolutely no clue how that works send help
		battle = common.mod('gen1stadium0').createBattle([[
			{species: 'Tauros', moves: ['thunderwave'], evs: {spe: 252}, ivs: {spe: 31}},
		], [
			{species: 'Zapdos', moves: ['agility', 'pound'], evs: {spe: 252}, ivs: {spe: 31}},
		]]);
		const initialZapdosSpeed = battle.p1.active[0].speed;
		battle.makeChoices('move thunderwave', 'move agility');
		assert(battle.p1.active[0].speed > initialZapdosSpeed, 'Zapdos should be faster.');
	});
});
