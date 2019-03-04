'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('White Herb 5678765567', function () {
	afterEach(function () {
		battle.destroy();
	});
	it('should use white herb during active turn', function () {
		battle = common.createBattle({gameType: 'doubles'});

		battle.join('p1', 'Guest 1', 1, [
			{species: "chansey", ability: 'shellarmor', item: 'ironball', moves: ['memento']},
			{species: "clefable", ability: 'levitate', item: 'ironball', moves: ['memento']},
			{species: "aerodactyl", ability: 'shellarmor', item: 'ironball', moves: ['stealthrock']},
			{species: "rotom", ability: 'levitate', item: 'ironball', moves: ['rest']}]);
		battle.join('p2', 'Guest 2', 2, [
			{species: "aegislash", ability: 'stancechange', item: 'whiteherb', moves: ['autotomize']},
			{species: "pelipper", ability: 'sandveil', item: 'lifeorb', moves: ['protect']}]);

		battle.makeChoices('move memento 0, move memento 0', 'move autotomize, move protect');
		battle.makeChoices('switch aerodactyl, switch rotom', 'move autotomize, move protect');

		const holder = battle.p2.active[0];

		assert.false.holdsItem(holder);
		assert.statStage(holder, 'atk', -2);
	});
	it('should use white herb after both intimidate', function () {
		let battle;
		battle = common.createBattle({gameType: 'doubles'});

		battle.join('p1', 'Guest 1', 1, [{species: "Arcanine", ability: 'intimidate', moves: ['bodyslam']},
			{species: "Incineroar", ability: 'intimidate', moves: ['agility']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "aegislash", ability: 'stancechange', item: 'whiteherb', moves: ['gyroball']},
			{species: "pelipper", ability: 'sandveil', item: 'lifeorb', moves: ['airslash']}]);


		battle.makeChoices('move bodyslam, move agility', 'move gyroball, move airslash');

		const holder = battle.p2.active[0];

		assert.false.holdsItem(holder);
		assert.statStage(holder, 'atk', 0);
	});
	it('should use white herb after one intimidate', function () {
		let battle;
		battle = common.createBattle({gameType: 'doubles'});

		battle.join('p1', 'Guest 1', 1, [{species: "Arcanine", ability: 'flashfire', moves: ['bodyslam']},
			{species: "Incineroar", ability: 'intimidate', moves: ['agility']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "aegislash", ability: 'stancechange', item: 'whiteherb', moves: ['gyroball']},
			{species: "pelipper", ability: 'sandveil', item: 'lifeorb', moves: ['airslash']}]);


		battle.makeChoices('move bodyslam, move agility', 'move gyroball, move airslash');

		const holder = battle.p2.active[0];

		assert.false.holdsItem(holder);
		assert.statStage(holder, 'atk', 0);
	});
	it('should use white herb after two intimidate switch in', function () {
		let battle;
		battle = common.createBattle({gameType: 'doubles'});

		battle.join('p1', 'Guest 1', 1, [
			{species: "Aerodactyl", ability: 'shellarmor', item: 'ironball', moves: ['stealthrock']},
			{species: "Rotom", ability: 'levitate', item: 'ironball', moves: ['rest']},
			{species: "Arcanine", ability: 'intimidate', moves: ['bodyslam']},
			{species: "Incineroar", ability: 'intimidate', moves: ['agility']}]);
		battle.join('p2', 'Guest 2', 2, [
			{species: "aegislash", ability: 'stancechange', item: 'whiteherb', moves: ['autotomize']},
			{species: "pelipper", ability: 'sandveil', item: 'lifeorb', moves: ['airslash']},
			{species: "Thundurus", ability: 'prankster', item: 'ironball', moves: ['electricterrain']},
			{species: 'Klefki', ability: 'prankster', moves: ['confuseray']}]);

		battle.makeChoices('move stealthrock, move rest', 'move gyroball, move airslash');

		battle.makeChoices('switch Arcanine, switch Incineroar', 'move gyroball, move airslash');

		const holder = battle.p2.active[0];

		assert.false.holdsItem(holder);
		assert.statStage(holder, 'atk', 0);
	});
	it('should use white herb after one intimidate switch in', function () {
		let battle;
		battle = common.createBattle({gameType: 'doubles'});

		battle.join('p1', 'Guest 1', 1, [
			{species: "Aerodactyl", ability: 'shellarmor', item: 'ironball', moves: ['stealthrock']},
			{species: "Rotom", ability: 'levitate', item: 'ironball', moves: ['rest']},
			{species: "Arcanine", ability: 'intimidate', moves: ['bodyslam']},
			{species: "Incineroar", ability: 'intimidate', moves: ['agility']}]);
		battle.join('p2', 'Guest 2', 2, [
			{species: "aegislash", ability: 'stancechange', item: 'whiteherb', moves: ['autotomize']},
			{species: "pelipper", ability: 'sandveil', item: 'lifeorb', moves: ['airslash']},
			{species: "Thundurus", ability: 'prankster', item: 'ironball', moves: ['electricterrain']},
			{species: 'Klefki', ability: 'prankster', moves: ['confuseray']}]);

		battle.makeChoices('move stealthrock, move rest', 'move gyroball, move airslash');

		battle.makeChoices('switch Arcanine, move rest', 'move gyroball, move airslash');

		const holder = battle.p2.active[0];

		assert.false.holdsItem(holder);
		assert.statStage(holder, 'atk', 0);
	});
});
