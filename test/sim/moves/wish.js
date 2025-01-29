'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Wish', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should heal the Pokemon in the user's slot by 1/2 of the user's max HP 1 turn after use`, function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: "Chansey", moves: ['wish']},
			{species: "Chansey", moves: ['wish']},
			{species: "Donphan", ability: 'sturdy', moves: ['sleeptalk']},
			{species: "Guzzlord", item: 'focussash', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Kyurem", moves: ['icebeam']},
			{species: "Diancie", moves: ['moonblast']},
		]});
		battle.makeChoices('move wish, move wish', 'move icebeam 1, move moonblast 2');
		battle.makeChoices('switch 3, switch 4', 'move icebeam 1, move moonblast 2');
		assert.fullHP(battle.p1.active[0]);
		assert.equal(battle.p1.active[1].hp, 321);
	});

	it('should progress its duration whether or not the Pokemon in its slot is fainted', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: "Pichu", ability: 'prankster', moves: ['wish']},
			{species: "Parasect", ability: 'effectspore', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Zygarde", ability: 'aurabreak', moves: ['thousandarrows']},
		]});
		battle.makeChoices('move wish', 'move thousandarrows');
		battle.makeChoices('switch 2');
		battle.makeChoices('auto', 'move thousandarrows');
		assert.fullHP(battle.p1.active[0]);
	});

	it(`should never resolve when used on a turn that is a multiple of 256n - 1`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', moves: ['sleeptalk', 'wish', 'doubleedge']},
		], [
			{species: 'Stakataka', moves: ['sleeptalk']},
		]]);

		battle.turn = 255; // Showdown turn is +1 from what the games are; this would ordinarily be 254
		battle.makeChoices('move doubleedge', 'auto');
		battle.makeChoices('move wish', 'auto');
		for (let i = 0; i < 5; i++) battle.makeChoices();
		battle.makeChoices('move wish', 'auto');
		battle.makeChoices();

		const wynaut = battle.p1.active[0];
		assert.false.fullHP(wynaut, `Wish should have never resolved.`);
	});

	it(`should do nothing if no Pokemon is present to heal from Wish`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', moves: ['sleeptalk', 'wish']},
			{species: 'Shedinja', moves: ['sleeptalk']},
		], [
			{species: 'Happiny', ability: 'noguard', moves: ['sleeptalk', 'stoneaxe']},
		]]);

		battle.makeChoices('move wish', 'move stoneaxe');
		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices('switch 2');
		const wynaut = battle.p1.active[0];
		assert.false.fullHP(wynaut, `Wish should not have healed Wynaut even after it was KOed.`);
		battle.makeChoices();
		assert.false.fullHP(wynaut, `Wish should not have healed Wynaut later either.`);
	});
});
