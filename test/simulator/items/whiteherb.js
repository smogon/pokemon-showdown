'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('White Herb', function () {
	afterEach(function () {
		battle.destroy();
	});
	it('should use white herb after memento during active turn', function () {
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
	it('should use white herb after growl during active turn', function () {
		battle = common.createBattle({gameType: 'doubles'});

		battle.join('p1', 'Guest 1', 1, [
			{species: "chansey", ability: 'shellarmor', item: 'ironball', moves: ['growl']},
			{species: "clefable", ability: 'levitate', item: 'ironball', moves: ['growl']},
			{species: "aerodactyl", ability: 'shellarmor', item: 'ironball', moves: ['stealthrock']},
			{species: "rotom", ability: 'levitate', item: 'ironball', moves: ['rest']}]);
		battle.join('p2', 'Guest 2', 2, [
			{species: "aegislash", ability: 'stancechange', item: 'whiteherb', moves: ['autotomize']},
			{species: "pelipper", ability: 'sandveil', item: 'lifeorb', moves: ['protect']}]);

		battle.makeChoices('move growl 0, move growl 0', 'move autotomize, move protect');

		const holder = battle.p2.active[0];
		assert.false.holdsItem(holder);
		assert.statStage(holder, 'atk', -1);
	});
	it('should use white herb after partingshot during active turn', function () {
		battle = common.createBattle({gameType: 'doubles'});

		battle.join('p1', 'Guest 1', 1, [
			{species: "chansey", ability: 'shellarmor', item: 'ironball', moves: ['partingshot']},
			{species: "clefable", ability: 'levitate', item: 'ironball', moves: ['partingshot']},
			{species: "aerodactyl", ability: 'shellarmor', item: 'ironball', moves: ['stealthrock']},
			{species: "rotom", ability: 'levitate', item: 'ironball', moves: ['rest']}]);
		battle.join('p2', 'Guest 2', 2, [
			{species: "aegislash", ability: 'stancechange', item: 'whiteherb', moves: ['autotomize']},
			{species: "pelipper", ability: 'sandveil', item: 'lifeorb', moves: ['protect']}]);

		battle.makeChoices('move partingshot 0, move partingshot 0', 'move autotomize, move protect');
		battle.makeChoices('switch aerodactyl, switch rotom', 'move autotomize, move protect');

		const holder = battle.p2.active[0];
		assert.false.holdsItem(holder);
		assert.statStage(holder, 'atk', -1);
	});
	it('should use white herb after both Intimidate', function () {
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
	it('should use white herb after one Intimidate', function () {
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
	it('should use white herb after two Intimidate switch in', function () {
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
		assert.statStage(holder, 'atk', -1);
	});
	it('should use white herb after all pokemon switch in after faint', function () {
		battle = common.createBattle({gameType: 'doubles'});

		battle.join('p1', 'Guest 1', 1, [
			{species: "oddish", ability: 'stancechange', item: 'ironball', moves: ['storedpower']},
			{species: "oddish", ability: 'stancechange', item: 'ironball', moves: ['storedpower']},
			{species: "Arcanine", ability: 'intimidate', moves: ['bodyslam']},
			{species: "Incineroar", ability: 'intimidate', moves: ['agility']}]);
		battle.join('p2', 'Guest 2', 2, [
			{species: "Rotom", ability: 'levitate', item: 'whiteherb', moves: ['searingshot']},
			{species: "Rotom", ability: 'levitate', item: 'whiteherb', moves: ['searingshot']},
			{species: "Thundurus", ability: 'prankster', item: 'whiteherb', moves: ['electricterrain']},
			{species: 'Klefki', ability: 'prankster', moves: ['confuseray']}]);

		battle.makeChoices('move storedpower, move storedpower', 'move searingshot, move searingshot');

		battle.makeChoices('switch Arcanine, switch Incineroar', 'switch Thundurus, switch Klefki');
		battle.makeChoices('move stringshot, move stringshot', 'move overheat, move overheat');

		const holder = battle.p2.active[0];

		assert.false.holdsItem(holder);
		assert.statStage(holder, 'atk', 0);
	});
	it('should use white herb after one Intimidate switch in', function () {
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

	it('should use white herb after one Intimidate switch in [singles]', function () {
		battle = common.createBattle();

		battle.join('p1', 'Guest 1', 1, [
			{species: "Rotom", ability: 'levitate', item: 'ironball', moves: ['rest']},
			{species: "Arcanine", ability: 'intimidate', moves: ['bodyslam']},
			{species: "Incineroar", ability: 'intimidate', moves: ['agility']}]);
		battle.join('p2', 'Guest 2', 2, [
			{species: "aegislash", ability: 'stancechange', item: 'whiteherb', moves: ['autotomize']},
			{species: "pelipper", ability: 'sandveil', item: 'lifeorb', moves: ['airslash']},
			{species: "Thundurus", ability: 'prankster', item: 'ironball', moves: ['electricterrain']},
			{species: 'Klefki', ability: 'prankster', moves: ['confuseray']}]);

		battle.makeChoices('move rest', 'move autotomize');

		battle.makeChoices('switch Arcanine', 'move autotomize');

		const holder = battle.p2.active[0];

		assert.false.holdsItem(holder);
		assert.statStage(holder, 'atk', 0);
	});
	it('should use white herb after one Intimidate [singles]', function () {
		battle = common.createBattle();

		battle.join('p1', 'Guest 1', 1, [
			{species: "Arcanine", ability: 'intimidate', moves: ['bodyslam']},
			{species: "Incineroar", ability: 'intimidate', moves: ['agility']}]);
		battle.join('p2', 'Guest 2', 2, [
			{species: "aegislash", ability: 'stancechange', item: 'whiteherb', moves: ['autotomize']},
			{species: "pelipper", ability: 'sandveil', item: 'lifeorb', moves: ['airslash']},
			{species: 'Klefki', ability: 'prankster', moves: ['confuseray']}]);

		battle.makeChoices('move rest', 'move autotomize');

		battle.makeChoices('switch Arcanine', 'move autotomize');

		const holder = battle.p2.active[0];

		assert.false.holdsItem(holder);
		assert.statStage(holder, 'atk', 0);
	});
	it('should use white herb after pokemon switch in after faint [singles]', function () {
		battle = common.createBattle();

		battle.join('p1', 'Guest 1', 1, [
			{species: "oddish", ability: 'stancechange', item: 'ironball', moves: ['storedpower']},
			{species: "oddish", ability: 'stancechange', item: 'ironball', moves: ['storedpower']},
			{species: "Arcanine", ability: 'intimidate', moves: ['bodyslam']},
			{species: "Incineroar", ability: 'intimidate', moves: ['agility']}]);
		battle.join('p2', 'Guest 2', 2, [
			{species: "Rotom", ability: 'levitate', item: 'whiteherb', moves: ['searingshot']},
			{species: "Rotom", ability: 'levitate', item: 'whiteherb', moves: ['searingshot']},
			{species: "Thundurus", ability: 'prankster', item: 'whiteherb', moves: ['electricterrain']},
			{species: 'Klefki', ability: 'prankster', moves: ['confuseray']}]);

		battle.makeChoices('move storedpower', 'move searingshot');

		battle.makeChoices('switch Arcanine', 'switch searingshot');

		const holder = battle.p2.active[0];

		assert.false.holdsItem(holder);
		assert.statStage(holder, 'atk', 0);
	});
});
