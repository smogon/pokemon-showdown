'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Two Turn Moves [Gen 1]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`charges the first turn, and does damage the second turn`, function () {
		battle = common.gen(1).createBattle();
		battle.setPlayer('p1', {team: [{species: "Venusaur", moves: ['solarbeam']}]});
		battle.setPlayer('p2', {team: [{species: "Parasect", moves: ['swordsdance']}]});
		const venusaur = battle.p1.active[0];
		const parasect = battle.p2.active[0];
		battle.makeChoices();
		assert(venusaur.volatiles['twoturnmove']);
		assert.fullHP(parasect);
		battle.makeChoices();
		assert.false(venusaur.volatiles['twoturnmove']);
		assert.false.fullHP(parasect);
	});

	it(`move is paused when asleep or frozen`, function () {
		battle = common.gen(1).createBattle();
		battle.setPlayer('p1', {team: [{species: "Aerodactyl", moves: ['skyattack']}]});
		battle.setPlayer('p2', {team: [{species: "Parasect", moves: ['spore']}]});
		const aerodactyl = battle.p1.active[0];
		for (let i = 0; i < 10; i++) {
			battle.makeChoices();
			assert(aerodactyl.volatiles['twoturnmove']);
		}
	});

	it(`Fly/Dig dodges all attacks except for Swift, Transform, and Bide`, function () {
		battle = common.gen(1).createBattle();
		battle.setPlayer('p1', {team: [{species: "Aerodactyl", moves: ['fly']}]});
		battle.setPlayer('p2', {team: [{species: "Pidgeot", moves: ['gust']}]});
		battle.makeChoices();
		assert(battle.log.some(line => line.includes("Aerodactyl can't be hit")));
		assert.fullHP(battle.p1.active[0]);
		battle.makeChoices();
		assert.false.fullHP(battle.p1.active[0]);
	});

	it(`Fly/Dig invulnerability glitch`, function () {
		battle = common.gen(1).createBattle({seed: [0, 0, 0, 1]});
		battle.setPlayer('p1', {team: [{species: "Electrode", moves: ['thunderwave', 'swift', 'thunderbolt']}]});
		battle.setPlayer('p2', {team: [{species: "Pidgeot", moves: ['fly', 'gust']}]});
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
		console.log(battle.getDebugLog());
	});
});
