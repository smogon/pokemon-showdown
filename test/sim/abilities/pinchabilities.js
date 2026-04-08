'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Blaze', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should boost Fire-type moves by 1.5x at or below 1/3 HP`, () => {
		battle = common.createBattle([[
			{ species: 'Charizard', ability: 'blaze', moves: ['flamethrower'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		const charizard = battle.p1.active[0];
		const blissey = battle.p2.active[0];
		battle.randomizer = dmg => dmg;

		battle.makeChoices('move flamethrower', 'move sleeptalk');
		const normalDamage = blissey.maxhp - blissey.hp;
		blissey.hp = blissey.maxhp;

		charizard.hp = Math.floor(charizard.maxhp / 3);
		battle.makeChoices('move flamethrower', 'move sleeptalk');
		const blazeDamage = blissey.maxhp - blissey.hp;

		assert.bounded(blazeDamage / normalDamage, [1.45, 1.55]);
	});

	it(`should not boost Fire-type moves above 1/3 HP`, () => {
		battle = common.createBattle([[
			{ species: 'Charizard', ability: 'blaze', moves: ['flamethrower'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		const charizard = battle.p1.active[0];
		const blissey = battle.p2.active[0];
		battle.randomizer = dmg => dmg;

		charizard.hp = Math.floor(charizard.maxhp / 3) + 1;
		battle.makeChoices('move flamethrower', 'move sleeptalk');
		const noBoostDamage = blissey.maxhp - blissey.hp;
		blissey.hp = blissey.maxhp;

		charizard.hp = Math.floor(charizard.maxhp / 3);
		battle.makeChoices('move flamethrower', 'move sleeptalk');
		const blazeDamage = blissey.maxhp - blissey.hp;

		assert.bounded(blazeDamage / noBoostDamage, [1.45, 1.55]);
	});

	it(`should not boost non-Fire moves at low HP`, () => {
		battle = common.createBattle([[
			{ species: 'Charizard', ability: 'blaze', moves: ['airslash'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		const charizard = battle.p1.active[0];
		const blissey = battle.p2.active[0];
		battle.randomizer = dmg => dmg;

		battle.makeChoices('move airslash', 'move sleeptalk');
		const fullHPDamage = blissey.maxhp - blissey.hp;
		blissey.hp = blissey.maxhp;

		charizard.hp = Math.floor(charizard.maxhp / 3);
		battle.makeChoices('move airslash', 'move sleeptalk');
		const lowHPDamage = blissey.maxhp - blissey.hp;

		assert.equal(fullHPDamage, lowHPDamage);
	});
});

describe('Torrent', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should boost Water-type moves by 1.5x at or below 1/3 HP`, () => {
		battle = common.createBattle([[
			{ species: 'Blastoise', ability: 'torrent', moves: ['surf'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		const blastoise = battle.p1.active[0];
		const blissey = battle.p2.active[0];
		battle.randomizer = dmg => dmg;

		battle.makeChoices('move surf', 'move sleeptalk');
		const normalDamage = blissey.maxhp - blissey.hp;
		blissey.hp = blissey.maxhp;

		blastoise.hp = Math.floor(blastoise.maxhp / 3);
		battle.makeChoices('move surf', 'move sleeptalk');
		const torrentDamage = blissey.maxhp - blissey.hp;

		assert.bounded(torrentDamage / normalDamage, [1.45, 1.55]);
	});
});

describe('Overgrow', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should boost Grass-type moves by 1.5x at or below 1/3 HP`, () => {
		battle = common.createBattle([[
			{ species: 'Venusaur', ability: 'overgrow', moves: ['razorleaf'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		const venusaur = battle.p1.active[0];
		const blissey = battle.p2.active[0];
		battle.randomizer = dmg => dmg;

		battle.makeChoices('move razorleaf', 'move sleeptalk');
		const normalDamage = blissey.maxhp - blissey.hp;
		blissey.hp = blissey.maxhp;

		venusaur.hp = Math.floor(venusaur.maxhp / 3);
		battle.makeChoices('move razorleaf', 'move sleeptalk');
		const overgrowDamage = blissey.maxhp - blissey.hp;

		assert.bounded(overgrowDamage / normalDamage, [1.45, 1.55]);
	});
});

describe('Swarm', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should boost Bug-type moves by 1.5x at or below 1/3 HP`, () => {
		battle = common.createBattle([[
			{ species: 'Yanmega', ability: 'swarm', moves: ['bugbuzz'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		const yanmega = battle.p1.active[0];
		const blissey = battle.p2.active[0];
		battle.randomizer = dmg => dmg;

		battle.makeChoices('move bugbuzz', 'move sleeptalk');
		const normalDamage = blissey.maxhp - blissey.hp;
		blissey.hp = blissey.maxhp;

		yanmega.hp = Math.floor(yanmega.maxhp / 3);
		battle.makeChoices('move bugbuzz', 'move sleeptalk');
		const swarmDamage = blissey.maxhp - blissey.hp;

		assert.bounded(swarmDamage / normalDamage, [1.45, 1.55]);
	});
});
