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
		const pokemon = battle.p1.active[0];
		const damage = pokemon.maxhp - pokemon.hp;
		battle.makeChoices('move softboiled', 'move bellydrum');
		battle.resetRNG();
		battle.makeChoices('move softboiled', 'move vitalthrow');
		assert.equal(pokemon.maxhp - pokemon.hp, damage);
	});

	it('should not ignore attack stage changes when Pokemon with it attack', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Clefable', ability: 'unaware', moves: ['moonblast', 'nastyplot']}]});
		battle.setPlayer('p2', {team: [{species: 'Registeel', ability: 'prankster', moves: ['splash']}]});
		battle.makeChoices('move moonblast', 'move splash');
		const pokemon = battle.p2.active[0];
		const damage = pokemon.maxhp - pokemon.hp;
		battle.makeChoices('move nastyplot', 'move splash');
		pokemon.hp = pokemon.maxhp;
		battle.resetRNG();
		battle.makeChoices('move moonblast', 'move splash');
		assert.notEqual(pokemon.maxhp - pokemon.hp, damage);
	});

	it('should ignore defense stage changes when Pokemon with it attack', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Clefable', ability: 'unaware', moves: ['moonblast']}]});
		battle.setPlayer('p2', {team: [{species: 'Hariyama', ability: 'thickfat', item: 'laggingtail', moves: ['amnesia']}]});
		battle.resetRNG();
		battle.makeChoices('move moonblast', 'move amnesia');
		const pokemon = battle.p2.active[0];
		const damage = pokemon.maxhp - pokemon.hp;
		pokemon.hp = pokemon.maxhp;
		battle.resetRNG();
		battle.makeChoices('move moonblast', 'move amnesia');
		assert.equal(pokemon.maxhp - pokemon.hp, damage);
	});

	it('should not ignore defense stage changes when Pokemon with it are attacked', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Clefable', ability: 'unaware', moves: ['irondefense']}]});
		battle.setPlayer('p2', {team: [{species: 'Registeel', ability: 'clearbody', moves: ['shadowsneak']}]});
		battle.makeChoices('move irondefense', 'move shadowsneak');
		const pokemon = battle.p1.active[0];
		const damage = pokemon.maxhp - pokemon.hp;
		pokemon.hp = pokemon.maxhp;
		battle.resetRNG();
		battle.makeChoices('move irondefense', 'move shadowsneak');
		assert.notEqual(pokemon.maxhp - pokemon.hp, damage);
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Clefable', ability: 'unaware', moves: ['splash']}]});
		battle.setPlayer('p2', {team: [{species: 'Haxorus', ability: 'moldbreaker', moves: ['shadowsneak']}]});
		battle.makeChoices('move splash', 'move shadowsneak');
		const pokemon = battle.p1.active[0];
		const damage = pokemon.maxhp - pokemon.hp;
		battle.boost({atk: 2}, battle.p2.active[0]);
		pokemon.hp = pokemon.maxhp;
		battle.resetRNG();
		battle.makeChoices('move splash', 'move shadowsneak');
		assert.notEqual(pokemon.maxhp - pokemon.hp, damage);
	});
	it('should only apply to targets with Unaware in battles with multiple Pokemon', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'manaphy', moves: ['tailglow', 'surf']},
			{species: 'slowbro', ability: 'unaware', moves: ['sleeptalk']},
		], [
			{species: 'clobbopus', ability: 'sturdy', moves: ['sleeptalk']},
			{species: 'clobbopus', ability: 'sturdy', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move tailglow, auto', 'auto');
		battle.makeChoices('move surf, auto', 'auto');
		assert.equal(battle.p2.active[0].hp, 1);
		assert.equal(battle.p2.active[1].hp, 1);
	});
});
