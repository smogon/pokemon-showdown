'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Two Turn Moves [Gen 1]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`charges the first turn, does damage and uses PP the second turn`, () => {
		battle = common.gen(1).createBattle([[
			{ species: "Venusaur", moves: ['solarbeam'] },
		], [
			{ species: "Parasect", moves: ['swordsdance'] },
		]]);
		const venusaur = battle.p1.active[0];
		const parasect = battle.p2.active[0];
		assert.equal(venusaur.moveSlots[0].pp, 16);
		battle.makeChoices();
		assert(venusaur.volatiles['twoturnmove']);
		assert.equal(venusaur.moveSlots[0].pp, 16);
		assert.fullHP(parasect);
		battle.makeChoices();
		assert.equal(venusaur.moveSlots[0].pp, 15);
		assert.false(venusaur.volatiles['twoturnmove']);
		assert.false.fullHP(parasect);
	});

	it(`move is paused when asleep or frozen`, () => {
		battle = common.gen(1).createBattle([[
			{ species: "Aerodactyl", moves: ['skyattack'] },
		], [
			{ species: "Parasect", moves: ['spore'] },
		]]);
		const aerodactyl = battle.p1.active[0];
		for (let i = 0; i < 10; i++) {
			battle.makeChoices();
			assert(aerodactyl.volatiles['twoturnmove']);
			assert.equal(aerodactyl.moveSlots[0].pp, 8);
		}
	});

	it(`two-turn move ends if it fails due to Disable, does not use PP`, () => {
		battle = common.gen(1).createBattle({ forceRandomChance: true }, [[
			{ species: 'Aerodactyl', moves: ['skyattack'] },
		], [
			{ species: 'Drowzee', moves: ['disable'] },
		]]);

		const aerodactyl = battle.p1.active[0];
		battle.makeChoices();
		assert(aerodactyl.volatiles['disable'].time > 1);
		assert(aerodactyl.volatiles['twoturnmove']);
		battle.makeChoices();
		assert(battle.log.some(line => line.includes('|cant|p1a: Aerodactyl|Disable|Sky Attack')));
		assert.equal(aerodactyl.moveSlots[0].pp, 8);
		assert(!aerodactyl.volatiles['twoturnmove']);
	});

	it(`if called by Metronome or Mirror Move, the calling move uses PP in the attacking turn`, () => {
		battle = common.gen(1).createBattle({ seed: [0, 1, 0, 1] }, [[
			{ species: 'blastoise', moves: ['metronome', 'skullbash'] },
		], [
			{ species: 'golem', moves: ['defensecurl'] },
		]]);
		const blastoise = battle.p1.active[0];
		battle.makeChoices();
		assert(battle.log.some(line => line.includes('|move|p1a: Blastoise|Skull Bash||[from] Metronome|[still]')));
		assert.equal(blastoise.moveSlots[0].pp, 16);
		battle.makeChoices();
		assert.equal(blastoise.moveSlots[0].pp, 15);
		// Skull Bash still has all its PP, even though Metronome called Skull Bash
		assert.equal(blastoise.moveSlots[1].pp, 24);
	});

	it(`Dig/Fly dodges all attacks except for Swift, Transform, and Bide`, () => {
		battle = common.gen(1).createBattle([[
			{ species: "Aerodactyl", moves: ['fly'] },
		], [
			{ species: "Pidgeot", moves: ['gust'] },
		]]);
		battle.makeChoices();
		assert(battle.log.some(line => line.includes("Aerodactyl can't be hit")));
		assert.fullHP(battle.p1.active[0]);
		battle.makeChoices();
		assert.false.fullHP(battle.p1.active[0]);
	});

	it(`Dig/Fly invulnerability glitch`, () => {
		battle = common.gen(1).createBattle({ seed: [0, 0, 0, 1] }, [[
			{ species: "Electrode", moves: ['thunderwave', 'swift', 'thunderbolt'] },
		], [
			{ species: "Pidgeot", moves: ['fly', 'gust'] },
		]]);
		const pidgeot = battle.p2.active[0];
		battle.makeChoices();
		assert(pidgeot.volatiles['twoturnmove']);
		assert(pidgeot.volatiles['invulnerability']);
		battle.makeChoices();
		assert(!pidgeot.volatiles['twoturnmove']);
		assert(pidgeot.volatiles['invulnerability']);
		// Pidgeot dodges almost all moves
		battle.makeChoices('move thunderbolt', 'move gust');
		assert.fullHP(pidgeot);
		assert(pidgeot.volatiles['invulnerability']);
		// Pidgeot can still be hit by Swift
		battle.makeChoices('move swift', 'move gust');
		assert.false.fullHP(pidgeot);
		assert(pidgeot.volatiles['invulnerability']);
	});

	it(`should be soft-locked if it was woken up by Haze during the charging turn`, () => {
		battle = common.gen(1).createBattle([[
			{ species: "Golem", moves: ['solarbeam', 'splash'] },
			{ species: "Magikarp", moves: ['splash'] },
		], [
			{ species: "Mewtwo", moves: ['splash', 'spore', 'haze', 'swordsdance'] },
		]]);
		battle.makeChoices();
		battle.makeChoices('move solarbeam', 'move spore');
		battle.makeChoices('move solarbeam', 'move haze');
		// Golem is locked into Solar Beam, but the move will never execute
		for (let i = 0; i < 3; i++) {
			assert.throws(() => battle.choose('p1', 'switch 2'));
			assert(battle.p1.active[0].volatiles['twoturnmove']);
			const request = battle.p1.activeRequest;
			assert.equal(request.active[0].moves.length, 1);
			assert.equal(request.active[0].moves[0].id, 'solarbeam');
			battle.makeChoices('move solarbeam', 'move swordsdance');
		}
		assert.fullHP(battle.p2.active[0]);
		assert.equal(battle.p2.active[0].boosts.atk, 6);
	});

	it(`should be delayed by trapping moves`, () => {
		battle = common.gen(1).createBattle({ seed: [0, 0, 0, 1] }, [[
			{ species: 'Aerodactyl', moves: ['solarbeam'] },
		], [
			{ species: 'Gyarados', moves: ['wrap', 'splash'] },
		]]);
		const aerodactyl = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(aerodactyl.volatiles['partiallytrapped'].duration, 1);
		battle.makeChoices();
		assert(!aerodactyl.volatiles['partiallytrapped']);
		battle.makeChoices('move solarbeam', 'move splash');
		assert.false.fullHP(battle.p2.active[0]);
	});
});
