'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Counter', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should deal damage equal to twice the damage taken from the last Physical attack', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Sawk', ability: 'sturdy', moves: ['seismictoss']}]});
		battle.setPlayer('p2', {team: [{species: 'Throh', ability: 'guts', moves: ['counter']}]});
		assert.hurtsBy(battle.p1.active[0], 200, () => battle.makeChoices());
	});

	it('should deal damage based on the last hit from the last Physical attack', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Sawk', ability: 'sturdy', moves: ['doublekick']}]});
		battle.setPlayer('p2', {team: [{species: 'Throh', ability: 'guts', moves: ['counter']}]});
		let lastDamage = 0;
		battle.onEvent('Damage', battle.format, function (damage, attacker, defender, move) {
			if (move.id === 'doublekick') {
				lastDamage = damage;
			}
		});

		battle.makeChoices();
		assert.equal(battle.p1.active[0].maxhp - battle.p1.active[0].hp, 2 * lastDamage);
	});

	it('should fail if user is not damaged by Physical attacks this turn', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Sawk', ability: 'sturdy', moves: ['aurasphere']}]});
		battle.setPlayer('p2', {team: [{species: 'Throh', ability: 'guts', moves: ['counter']}]});
		assert.false.hurts(battle.p1.active[0], () => battle.makeChoices());
	});

	it('should target the opposing Pokemon that hit the user with a Physical attack most recently that turn', function () {
		battle = common.gen(5).createBattle({gameType: 'triples'});
		battle.setPlayer('p1', {team: [
			{species: 'Bastiodon', ability: 'sturdy', moves: ['counter']},
			{species: 'Toucannon', ability: 'keeneye', moves: ['beakblast']},
			{species: 'Kingdra', ability: 'sniper', moves: ['dragonpulse']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Crobat', ability: 'innerfocus', moves: ['acrobatics']},
			{species: 'Avalugg', ability: 'sturdy', moves: ['avalanche']},
			{species: 'Castform', ability: 'forecast', moves: ['weatherball']},
		]});
		battle.makeChoices('move counter, move beakblast -1, move dragonpulse -1', 'move acrobatics 1, move avalanche 1, move weatherball 1');
		assert.fullHP(battle.p1.active[1]);
		assert.fullHP(battle.p2.active[0]);
		assert.false.fullHP(battle.p2.active[1]);
	});

	it('should respect Follow Me', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Bastiodon', ability: 'sturdy', moves: ['counter']},
			{species: 'Magikarp', ability: 'rattled', moves: ['splash']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Crobat', ability: 'innerfocus', moves: ['acrobatics']},
			{species: 'Clefable', ability: 'unaware', moves: ['followme']},
		]});
		battle.makeChoices('move counter, move splash', 'move acrobatics 1, move followme');
		assert.false.fullHP(battle.p2.active[1]);
		assert.fullHP(battle.p2.active[0]);
	});

	it(`[Gen 1] Counter Desync Clause`, function () {
		// seed chosen so Water Gun succeeds and Pound full paras
		battle = common.gen(1).createBattle({seed: [1, 2, 3, 3]}, [[
			{species: 'Mew', moves: ['pound', 'watergun', 'counter', 'thunderwave']},
		], [
			{species: 'Persian', moves: ['pound', 'watergun', 'counter', 'thunderwave']},
		]]);
		battle.makeChoices('move watergun', 'move thunderwave');
		battle.makeChoices('move pound', 'move counter');
		assert(battle.log.some(line => line.includes('Desync Clause Mod activated')));

		// seed chosen so Pound succeeds and Water Gun full paras
		battle = common.gen(1).createBattle({seed: [1, 2, 3, 3]}, [[
			{species: 'Mew', moves: ['pound', 'watergun', 'counter', 'thunderwave']},
		], [
			{species: 'Persian', moves: ['pound', 'watergun', 'counter', 'thunderwave']},
		]]);
		battle.makeChoices('move pound', 'move thunderwave');
		battle.makeChoices('move watergun', 'move counter');
		assert(battle.log.some(line => line.includes('Desync Clause Mod activated')));

		battle = common.gen(1).createBattle([[
			{species: 'Mew', moves: ['pound', 'watergun', 'counter', 'splash']},
		], [
			{species: 'Persian', moves: ['pound', 'watergun', 'counter', 'splash']},
		]]);
		battle.makeChoices('move watergun', 'move splash');
		battle.makeChoices('move pound', 'move counter');
		assert(!battle.log.some(line => line.includes('Desync Clause Mod activated')));
		assert.false.fullHP(battle.p1.active[0]);

		battle = common.gen(1).createBattle([[
			{species: 'Mew', moves: ['pound', 'watergun', 'counter', 'splash']},
		], [
			{species: 'Persian', moves: ['pound', 'watergun', 'counter', 'splash']},
		]]);
		battle.makeChoices('move pound', 'move splash');
		battle.makeChoices('move watergun', 'move counter');
		assert(!battle.log.some(line => line.includes('Desync Clause Mod activated')));
		assert.fullHP(battle.p1.active[0]);
	});

	it(`[Gen 1] should counter attacks made against substitutes`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'Chansey', moves: ['substitute', 'counter']},
		], [
			{species: 'Snorlax', moves: ['bodyslam']},
			{species: 'Chansey', moves: ['softboiled']},
		]]);
		battle.makeChoices('move substitute', 'move bodyslam');
		battle.makeChoices('move counter', 'switch 2');
		assert.fainted(battle.p2.active[0]);

		battle = common.gen(1).createBattle([[
			{species: 'Chansey', moves: ['substitute', 'counter']},
		], [
			{species: 'Snorlax', moves: ['bodyslam', 'splash']},
		]]);
		battle.makeChoices('move substitute', 'move splash');
		battle.makeChoices('move counter', 'move bodyslam');
		assert.fainted(battle.p2.active[0]);
	});

	it(`[Gen 1] simultaneous counters should both fail`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'Golem', moves: ['bodyslam']},
			{species: 'Chansey', moves: ['counter']},
		], [
			{species: 'Tauros', moves: ['bodyslam']},
			{species: 'Chansey', moves: ['counter']},
		]]);
		battle.makeChoices();
		battle.makeChoices('switch 2', 'switch 2');
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0]);
		assert.fullHP(battle.p2.active[0]);
	});

	it(`[Gen 1 Stadium] should counter Normal/Fighting moves only`, function () {
		// should counter Normal/Fighting moves
		battle = common.mod('gen1stadium').createBattle([[
			{species: 'Mew', moves: ['pound', 'watergun', 'counter', 'thunderwave']},
		], [
			{species: 'Persian', moves: ['pound', 'watergun', 'counter', 'thunderwave']},
		]]);
		battle.makeChoices('move watergun', 'move counter');
		assert.fullHP(battle.p1.active[0]);
		battle.makeChoices('move pound', 'move counter');
		assert.false.fullHP(battle.p1.active[0]);
	});

	it(`[Gen 1 Stadium] should counter attacks made against substitutes`, function () {
		battle = common.mod('gen1stadium').createBattle([[
			{species: 'Chansey', moves: ['substitute', 'counter']},
		], [
			{species: 'Snorlax', moves: ['bodyslam', 'splash']},
		]]);
		battle.makeChoices('move substitute', 'move splash');
		battle.makeChoices('move counter', 'move bodyslam');
		assert.false.fullHP(battle.p2.active[0]);
	});

	it(`should not have its target changed by Stalwart`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Duraludon", ability: 'stalwart', moves: ['counter']},
			{species: "Diglett", moves: ['sleeptalk']},
		], [
			{species: "Wynaut", moves: ['sleeptalk']},
			{species: "Noivern", moves: ['dragonclaw']},
		]]);

		const wynaut = battle.p2.active[0];
		battle.makeChoices('auto', 'move sleeptalk, move dragonclaw 1');
		assert.equal(wynaut.maxhp, wynaut.hp);
	});
});

describe('Mirror Coat', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should deal damage equal to twice the damage taken from the last Special attack', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Espeon', ability: 'synchronize', moves: ['sonicboom']}]});
		battle.setPlayer('p2', {team: [{species: 'Umbreon', ability: 'synchronize', moves: ['mirrorcoat']}]});
		assert.hurtsBy(battle.p1.active[0], 40, () => battle.makeChoices());
	});

	it('should deal damage based on the last hit from the last Special attack', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Espeon', ability: 'synchronize', moves: ['watershuriken']}]});
		battle.setPlayer('p2', {team: [{species: 'Umbreon', ability: 'synchronize', moves: ['mirrorcoat']}]});
		let lastDamage = 0;
		battle.onEvent('Damage', battle.format, function (damage, attacker, defender, move) {
			if (move.id === 'watershuriken') {
				lastDamage = damage;
			}
		});

		battle.makeChoices();
		assert.equal(battle.p1.active[0].maxhp - battle.p1.active[0].hp, 2 * lastDamage);
	});

	it('should fail if user is not damaged by Special attacks this turn', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Espeon', ability: 'synchronize', moves: ['tackle']}]});
		battle.setPlayer('p2', {team: [{species: 'Umbreon', ability: 'synchronize', moves: ['mirrorcoat']}]});
		assert.false.hurts(battle.p1.active[0], () => battle.makeChoices());
	});

	it('should target the opposing Pokemon that hit the user with a Special attack most recently that turn', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Mew', ability: 'synchronize', moves: ['mirrorcoat']},
			{species: 'Lucario', ability: 'justified', item: 'laggingtail', moves: ['aurasphere']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Crobat', ability: 'innerfocus', moves: ['venoshock']},
			{species: 'Avalugg', ability: 'sturdy', moves: ['flashcannon']},
		]});
		battle.makeChoices('move mirrorcoat, move aurasphere -1', 'move venoshock 1, move flashcannon 1');
		assert.fullHP(battle.p1.active[1]);
		assert.fullHP(battle.p2.active[0]);
		assert.false.fullHP(battle.p2.active[1]);
	});

	it('should respect Follow Me', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Mew', ability: 'synchronize', moves: ['mirrorcoat']},
			{species: 'Magikarp', ability: 'rattled', moves: ['splash']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Crobat', ability: 'innerfocus', moves: ['venoshock']},
			{species: 'Clefable', ability: 'unaware', moves: ['followme']},
		]});
		battle.makeChoices('move mirrorcoat, move splash', 'move venoshock 1, move followme');
		assert.false.fullHP(battle.p2.active[1]);
		assert.fullHP(battle.p2.active[0]);
	});

	it(`should not have its target changed by Stalwart`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Duraludon", ability: 'stalwart', moves: ['mirrorcoat']},
			{species: "Diglett", moves: ['sleeptalk']},
		], [
			{species: "Wynaut", moves: ['sleeptalk']},
			{species: "Noivern", moves: ['dragonpulse']},
		]]);

		const wynaut = battle.p2.active[0];
		battle.makeChoices('auto', 'move sleeptalk, move dragonpulse 1');
		assert.equal(wynaut.maxhp, wynaut.hp);
	});
});
