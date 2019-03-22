'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Unaware', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should ignore attack stage changes when Pokemon with it are attacked', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Clefable', ability: 'unaware', moves: ['softboiled']}]});
		battle.setPlayer('p2', {team: [{species: 'Hariyama', ability: 'thickfat', moves: ['vitalthrow', 'bellydrum']}]});
		battle.resetRNG();
		battle.makeChoices('move softboiled', 'move vitalthrow');
		let pokemon = battle.p1.active[0];
		let damage = pokemon.maxhp - pokemon.hp;
		battle.makeChoices('move softboiled', 'move bellydrum');
		battle.resetRNG();
		battle.makeChoices('move softboiled', 'move vitalthrow');
		assert.strictEqual(pokemon.maxhp - pokemon.hp, damage);
	});

	it('should not ignore attack stage changes when Pokemon with it attack', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Clefable', ability: 'unaware', moves: ['moonblast', 'nastyplot']}]});
		battle.setPlayer('p2', {team: [{species: 'Registeel', ability: 'prankster', moves: ['splash']}]});
		battle.makeChoices('move moonblast', 'move splash');
		let pokemon = battle.p2.active[0];
		let damage = pokemon.maxhp - pokemon.hp;
		battle.makeChoices('move nastyplot', 'move splash');
		pokemon.hp = pokemon.maxhp;
		battle.resetRNG();
		battle.makeChoices('move moonblast', 'move splash');
		assert.notStrictEqual(pokemon.maxhp - pokemon.hp, damage);
	});

	it('should ignore defense stage changes when Pokemon with it attack', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Clefable', ability: 'unaware', moves: ['moonblast']}]});
		battle.setPlayer('p2', {team: [{species: 'Hariyama', ability: 'thickfat', item: 'laggingtail', moves: ['amnesia']}]});
		battle.resetRNG();
		battle.makeChoices('move moonblast', 'move amnesia');
		let pokemon = battle.p2.active[0];
		let damage = pokemon.maxhp - pokemon.hp;
		pokemon.hp = pokemon.maxhp;
		battle.resetRNG();
		battle.makeChoices('move moonblast', 'move amnesia');
		assert.strictEqual(pokemon.maxhp - pokemon.hp, damage);
	});

	it('should not ignore defense stage changes when Pokemon with it are attacked', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Clefable', ability: 'unaware', moves: ['irondefense']}]});
		battle.setPlayer('p2', {team: [{species: 'Registeel', ability: 'clearbody', moves: ['shadowsneak']}]});
		battle.makeChoices('move irondefense', 'move shadowsneak');
		let pokemon = battle.p1.active[0];
		let damage = pokemon.maxhp - pokemon.hp;
		pokemon.hp = pokemon.maxhp;
		battle.resetRNG();
		battle.makeChoices('move irondefense', 'move shadowsneak');
		assert.notStrictEqual(pokemon.maxhp - pokemon.hp, damage);
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Clefable', ability: 'unaware', moves: ['splash']}]});
		battle.setPlayer('p2', {team: [{species: 'Haxorus', ability: 'moldbreaker', moves: ['shadowsneak']}]});
		battle.makeChoices('move splash', 'move shadowsneak');
		let pokemon = battle.p1.active[0];
		let damage = pokemon.maxhp - pokemon.hp;
		battle.boost({atk: 2}, battle.p2.active[0]);
		pokemon.hp = pokemon.maxhp;
		battle.resetRNG();
		battle.makeChoices('move splash', 'move shadowsneak');
		assert.notStrictEqual(pokemon.maxhp - pokemon.hp, damage);
	});
});
