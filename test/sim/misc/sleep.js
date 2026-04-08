'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Sleep', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should prevent the afflicted Pokemon from moving`, () => {
		battle = common.createBattle({ forceRandomChance: true }, [[
			{ species: 'Chansey', ability: 'naturalcure', moves: ['softboiled'] },
		], [
			{ species: 'Darkrai', ability: 'baddreams', moves: ['darkvoid', 'snarl'] },
		]]);
		const chansey = battle.p1.active[0];
		battle.makeChoices('move softboiled', 'move darkvoid');
		assert.equal(chansey.status, 'slp');
		chansey.statusState.time = 2;
		battle.makeChoices('move softboiled', 'move snarl');
		assert(battle.log.some(line => line.includes('|cant|') && line.includes('slp')));
	});

	it(`should wear off after the sleep timer expires`, () => {
		battle = common.createBattle({ forceRandomChance: true }, [[
			{ species: 'Chansey', ability: 'naturalcure', moves: ['softboiled'] },
		], [
			{ species: 'Darkrai', ability: 'baddreams', moves: ['darkvoid', 'snarl'] },
		]]);
		const chansey = battle.p1.active[0];
		battle.makeChoices('move softboiled', 'move darkvoid');
		assert.equal(chansey.status, 'slp');
		chansey.statusState.time = 1;
		battle.makeChoices('move softboiled', 'move snarl');
		assert.equal(chansey.status, '');
	});

	it(`should be halved in duration with Early Bird`, () => {
		battle = common.createBattle([[
			{ species: 'Dodrio', ability: 'earlybird', moves: ['peck'] },
		], [
			{ species: 'Parasect', ability: 'damp', moves: ['spore'] },
		]]);
		const dodrio = battle.p1.active[0];
		battle.makeChoices('move peck', 'move spore');
		assert.equal(dodrio.status, 'slp');
		dodrio.statusState.time = 2;
		battle.makeChoices('move peck', 'auto');
		assert.equal(dodrio.status, '');
	});

	it(`should be inflicted by Spore`, () => {
		battle = common.createBattle([[
			{ species: 'Parasect', ability: 'effectspore', moves: ['spore'] },
		], [
			{ species: 'Chansey', ability: 'naturalcure', moves: ['softboiled'] },
		]]);
		battle.makeChoices('move spore', 'move softboiled');
		assert.equal(battle.p2.active[0].status, 'slp');
	});

	it(`should not affect Grass-type Pokemon from Spore`, () => {
		battle = common.createBattle([[
			{ species: 'Parasect', ability: 'effectspore', moves: ['spore'] },
		], [
			{ species: 'Roserade', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move spore', 'move sleeptalk');
		assert.equal(battle.p2.active[0].status, '');
	});

	it(`should not affect Pokemon with Insomnia`, () => {
		battle = common.createBattle([[
			{ species: 'Parasect', ability: 'damp', moves: ['spore'] },
		], [
			{ species: 'Murkrow', ability: 'insomnia', moves: ['peck'] },
		]]);
		battle.makeChoices('move spore', 'move peck');
		assert.equal(battle.p2.active[0].status, '');
	});
});

describe('Sleep [Gen 1]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should last between 1 and 7 turns`, () => {
		battle = common.gen(1).createBattle([[
			{ species: 'Chansey', moves: ['splash'] },
		], [
			{ species: 'Jynx', moves: ['lovelykiss', 'splash'] },
		]]);
		const chansey = battle.p1.active[0];
		battle.makeChoices('move splash', 'move lovelykiss');
		assert.equal(chansey.status, 'slp');
		assert(chansey.statusState.startTime >= 1 && chansey.statusState.startTime <= 7);
	});
});
