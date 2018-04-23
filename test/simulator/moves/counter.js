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
		battle.join('p1', 'Guest 1', 1, [{species: 'Sawk', ability: 'sturdy', moves: ['tackle', 'doublekick']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Throh', ability: 'guts', moves: ['counter']}]);
		battle.commitDecisions();
		let hp = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		assert.strictEqual(battle.p1.active[0].maxhp - battle.p1.active[0].hp, 2 * hp);
	});

	it('should deal damage based on the last hit from the last Physical attack', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Sawk', ability: 'sturdy', moves: ['doublekick']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Throh', ability: 'guts', moves: ['counter']}]);
		let lastDamage = 0;
		battle.onEvent('Damage', battle.getFormat(), function (damage, attacker, defender, move) {
			if (move.id === 'doublekick') {
				lastDamage = damage;
			}
		});

		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].maxhp - battle.p1.active[0].hp, 2 * lastDamage);
	});

	it('should target the opposing Pokemon that hit the user with a Physical attack most recently that turn', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Bastiodon', ability: 'sturdy', moves: ['counter']},
			{species: 'Toucannon', ability: 'keeneye', moves: ['beakblast']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Crobat', ability: 'pressure', moves: ['acrobatics']},
			{species: 'Avalugg', ability: 'sturdy', moves: ['avalanche']},
		]);
		battle.makeChoices('move counter, move beakblast -1', 'move acrobatics 1, move avalanche 1');
		assert.fullHP(battle.p1.active[1]);
		assert.fullHP(battle.p2.active[0]);
		assert.false.fullHP(battle.p2.active[1]);
	});

	it('should bypass Follow Me', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Bastiodon', ability: 'furcoat', moves: ['counter']},
			{species: 'Magikarp', ability: 'rattled', moves: ['splash']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Crobat', ability: 'pressure', moves: ['acrobatics']},
			{species: 'Clefable', ability: 'unaware', moves: ['followme']},
		]);
		battle.makeChoices('move counter, move splash', 'move acrobatics 1, move followme');
		assert.fullHP(battle.p2.active[1]);
		assert.false.fullHP(battle.p2.active[0]);
	});
});
