'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Hyper Beam`, () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should always force a recharge turn`, () => {
		battle = common.createBattle([[
			{ species: 'snorlax', ability: 'noguard', moves: ['hyperbeam', 'tackle'] },
		], [
			{ species: 'alakazam', moves: ['substitute'] },
		]]);
		battle.makeChoices();
		assert.cantMove(() => battle.choose('p1', 'move tackle'));
	});
});

describe(`Hyper Beam [Gen 1]`, () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should not force a recharge turn after KOing a Pokemon`, () => {
		battle = common.gen(1).createBattle([[
			{ species: 'snorlax', moves: ['hyperbeam', 'tackle'] },
		], [
			{ species: 'abra', moves: ['swordsdance'] },
			{ species: 'exeggutor', moves: ['swordsdance'] },
		]]);
		battle.makeChoices();
		battle.choose('p2', 'switch exeggutor');
		assert.false.cantMove(() => battle.choose('p1', 'move tackle'));
	});

	it(`should not force a recharge turn after breaking a Substitute`, () => {
		battle = common.gen(1).createBattle([[
			{ species: 'snorlax', moves: ['hyperbeam', 'tackle'] },
		], [
			{ species: 'alakazam', moves: ['substitute'] },
		]]);
		battle.makeChoices();
		assert.false.cantMove(() => battle.choose('p1', 'move tackle'));
	});

	it(`should force a recharge turn after damaging, but not breaking a Substitute`, () => {
		battle = common.gen(1).createBattle({ forceRandomChance: true }, [[
			{ species: 'slowpoke', moves: ['hyperbeam', 'tackle'] },
		], [
			{ species: 'rhydon', moves: ['substitute'] },
		]]);
		battle.makeChoices();
		assert.cantMove(() => battle.choose('p1', 'move tackle'));
	});

	it(`Partial trapping moves negate recharge turns (recharging Pokemon is slower))`, () => {
		battle = common.gen(1).createBattle({ forceRandomChance: true }, [[
			{ species: 'cloyster', moves: ['surf', 'clamp'] },
		], [
			{ species: 'snorlax', moves: ['hyperbeam'] },
		]]);
		// All moves hit
		battle.makeChoices();
		assert(battle.p2.active[0].volatiles['mustrecharge']);
		battle.makeChoices('move clamp', 'auto');
		assert.false(battle.p2.active[0].volatiles['mustrecharge']);
		assert(battle.p2.active[0].volatiles['partiallytrapped']);
	});

	it(`Partial trapping moves negate recharge turns (recharging Pokemon is faster)`, () => {
		battle = common.gen(1).createBattle({ forceRandomChance: true }, [[
			{ species: 'cloyster', moves: ['clamp'] },
		], [
			{ species: 'aerodactyl', moves: ['hyperbeam'] },
		]]);
		// All moves hit
		battle.makeChoices();
		assert.false.fullHP(battle.p1.active[0]);
		assert.false(battle.p2.active[0].volatiles['mustrecharge']);
		assert(battle.p2.active[0].volatiles['partiallytrapped']);
	});

	it(`Hyper Beam Wrap underflow glitch`, () => {
		battle = common.gen(1).createBattle({ seed: [0, 0, 0, 4] }, [[
			{ species: 'dragonite', moves: ['agility', 'wrap'] },
		], [
			{ species: 'alakazam', moves: ['hyperbeam'] },
		]]);
		battle.p2.active[0].moveSlots[0].pp = 1;
		// All moves hit in the first turn
		battle.makeChoices();
		assert(battle.p2.active[0].volatiles['mustrecharge']);
		// Wrap misses, the forced Hyper Beam hits, Wrap PP underflows to 63
		battle.makeChoices('move wrap', 'auto');
		assert.false(battle.p2.active[0].volatiles['partiallytrapped']);
		assert(battle.p2.active[0].volatiles['mustrecharge']);
		assert(battle.log.includes("|-hint|In Gen 1, if a Pokémon is forced to use a move with 0 PP, the move will underflow to have 63 PP."));
		assert.equal(battle.p2.active[0].moveSlots[0].pp, 63);
	});

	it(`Hyper Beam automatic selection glitch`, () => {
		battle = common.gen(1).createBattle({ seed: [0, 0, 1, 0] }, [[
			{ species: 'cloyster', moves: ['surf', 'clamp'] },
		], [
			{ species: 'snorlax', moves: ['hyperbeam'] },
		]]);
		// All moves hit in the first turn
		battle.makeChoices();
		assert(battle.p2.active[0].volatiles['mustrecharge']);
		// Clamp misses, the forced Hyper Beam hits
		battle.makeChoices('move clamp', 'auto');
		assert.false(battle.p2.active[0].volatiles['partiallytrapped']);
		assert(battle.p2.active[0].volatiles['mustrecharge']);
	});

	it(`should be soft-locked if it was frozen during the recharge turn`, () => {
		battle = common.gen(1).createBattle({ forceRandomChance: true }, [[
			{ species: 'cloyster', moves: ['icebeam', 'splash'] },
		], [
			{ species: 'alakazam', moves: ['hyperbeam'] },
			{ species: 'magikarp', moves: ['splash'] },
		]]);
		battle.makeChoices();
		const hp = battle.p1.active[0].hp;
		for (let i = 0; i < 5; i++) {
			assert.throws(() => battle.choose('p2', 'switch 2'));
			assert(battle.p2.active[0].volatiles['mustrecharge']);
			const request = battle.p2.activeRequest;
			assert.equal(request.active[0].moves.length, 1);
			assert.equal(request.active[0].moves[0].id, 'recharge');
			battle.makeChoices('move splash', 'move recharge');
		}
		assert.equal(battle.p1.active[0].hp, hp);
	});

	it(`should be freed from soft-locked if thawed by a fire move during the recharge turn`, () => {
		battle = common.gen(1).createBattle({ forceRandomChance: true }, [[
			{ species: 'cloyster', moves: ['icebeam', 'splash', 'firepunch'] },
		], [
			{ species: 'alakazam', moves: ['hyperbeam'] },
			{ species: 'magikarp', moves: ['splash'] },
		]]);
		battle.makeChoices();
		const hp = battle.p1.active[0].hp;
		for (let i = 0; i < 5; i++) {
			assert.throws(() => battle.choose('p2', 'switch 2'));
			assert(battle.p2.active[0].volatiles['mustrecharge']);
			const request = battle.p2.activeRequest;
			assert.equal(request.active[0].moves.length, 1);
			assert.equal(request.active[0].moves[0].id, 'recharge');
			battle.makeChoices('move splash', 'move recharge');
		}
		assert.equal(battle.p1.active[0].hp, hp);

		battle.makeChoices('move firepunch', 'move recharge');
		assert.equal(battle.p2.active[0].status, '');
		battle.makeChoices('move splash', 'move recharge');
		assert(!battle.p2.active[0].volatiles['mustrecharge']);
		battle.makeChoices('move splash', 'move hyperbeam');
		assert(battle.p1.active[0].hp < hp);
	});

	it(`should not be freed from soft-locked if unfrozen by Haze during the recharge turn`, () => {
		battle = common.gen(1).createBattle({ forceRandomChance: true }, [[
			{ species: 'cloyster', moves: ['icebeam', 'splash', 'haze'] },
		], [
			{ species: 'alakazam', moves: ['hyperbeam'] },
			{ species: 'magikarp', moves: ['splash'] },
		]]);
		battle.makeChoices();
		const hp = battle.p1.active[0].hp;
		for (let i = 0; i < 5; i++) {
			assert.throws(() => battle.choose('p2', 'switch 2'));
			assert(battle.p2.active[0].volatiles['mustrecharge']);
			const request = battle.p2.activeRequest;
			assert.equal(request.active[0].moves.length, 1);
			assert.equal(request.active[0].moves[0].id, 'recharge');
			battle.makeChoices('move splash', 'move recharge');
		}
		assert.equal(battle.p1.active[0].hp, hp);

		battle.makeChoices('move haze', 'move recharge');
		assert.equal(battle.p2.active[0].status, '');

		for (let i = 0; i < 5; i++) {
			assert.throws(() => battle.choose('p2', 'switch 2'));
			assert(battle.p2.active[0].volatiles['mustrecharge']);
			const request = battle.p2.activeRequest;
			assert.equal(request.active[0].moves.length, 1);
			assert.equal(request.active[0].moves[0].id, 'recharge');
			battle.makeChoices('move splash', 'move recharge');
		}
		assert.equal(battle.p2.active[0].status, '');
		assert.equal(battle.p1.active[0].hp, hp);
	});
});
