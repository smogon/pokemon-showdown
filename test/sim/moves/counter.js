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
		assert.strictEqual(battle.p1.active[0].maxhp - battle.p1.active[0].hp, 2 * lastDamage);
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
		assert.strictEqual(battle.p1.active[0].maxhp - battle.p1.active[0].hp, 2 * lastDamage);
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
});
