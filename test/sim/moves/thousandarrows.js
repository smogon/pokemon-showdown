'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Thousand Arrows', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should hit Flying-type Pokemon and remove their Ground immunity`, function () {
		battle = common.createBattle([[
			{species: 'Zygarde', level: 1, moves: ['thousandarrows', 'earthquake']},
		], [
			{species: 'Tropius', moves: ['synthesis']},
		]]);
		const tropius = battle.p2.active[0];
		battle.makeChoices();
		assert.false.fullHP(tropius);
		battle.makeChoices('move earthquake', 'auto');
		assert.false.fullHP(tropius);
	});

	it(`should ignore type effectiveness on the first hit against Flying-type Pokemon`, function () {
		battle = common.createBattle([[
			{species: 'Zygarde', level: 1, moves: ['thousandarrows']},
		], [
			{species: 'Ho-Oh', item: 'weaknesspolicy', moves: ['recover']},
		]]);
		const hooh = battle.p2.active[0];
		battle.makeChoices();
		assert.statStage(hooh, 'atk', 0);
		assert.statStage(hooh, 'spa', 0);
		battle.makeChoices(); // Now Ho-Oh is grounded
		assert.statStage(hooh, 'atk', 2);
		assert.statStage(hooh, 'spa', 2);
	});

	it(`should not ignore type effectiveness on the first hit against Flying-type Pokemon with Ring Target`, function () {
		battle = common.createBattle([[
			{species: 'Zygarde', level: 1, moves: ['thousandarrows']},
		], [
			{species: 'Ho-Oh', ability: 'wonderguard', item: 'ringtarget', moves: ['recover']},
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
	});

	it(`should not ground or deal neutral damage to Flying-type Pokemon holding an Iron Ball`, function () {
		battle = common.createBattle([[
			{species: 'Zygarde', level: 1, moves: ['thousandarrows', 'earthquake']},
		], [
			{species: 'Ho-Oh', item: 'ironball', moves: ['recover', 'trick']},
		]]);

		const hooh = battle.p2.active[0];
		battle.makeChoices();
		assert.false(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		const hp = hooh.hp;
		assert.false.fullHP(hooh);

		battle.makeChoices('move earthquake', 'move trick');
		assert.equal(hp, hooh.hp);
	});

	it(`should not ground or deal neutral damage to Flying-type Pokemon affected by Gravity`, function () {
		battle = common.createBattle([[
			{species: 'Zygarde', level: 1, moves: ['thousandarrows', 'sleeptalk']},
		], [
			{species: 'Ho-Oh', moves: ['recover', 'gravity']},
		]]);

		battle.makeChoices('move sleeptalk', 'move gravity');
		// During Gravity, Thousand Arrows can be super effective, but once it ends has to be neutral for one hit
		while (battle.field.getPseudoWeather('gravity')) {
			battle.makeChoices();
			assert(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		}
		battle.makeChoices(); // first Thousand Arrows post-Gravity grounds Ho-Oh
		assert.false(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		battle.makeChoices(); // second Thousand Arrows post-Gravity is super-effective on Ho-Oh
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
	});

	it(`should hit Pokemon with Levitate and remove their Ground immunity`, function () {
		battle = common.createBattle([[
			{species: 'Zygarde', level: 1, moves: ['thousandarrows', 'earthquake']},
		], [
			{species: 'Cresselia', moves: ['recover']},
		]]);
		const cress = battle.p2.active[0];
		battle.makeChoices();
		assert.false.fullHP(cress);
		battle.makeChoices('move earthquake', 'auto');
		assert.false.fullHP(cress);
	});

	it(`should hit non-Flying-type Pokemon with Levitate with standard type effectiveness`, function () {
		battle = common.createBattle([[
			{species: 'Zygarde', level: 1, moves: ['thousandarrows']},
		], [
			{species: 'Eelektross', ability: 'levitate', item: 'weaknesspolicy', moves: ['sleeptalk']},
		]]);
		const eelektross = battle.p2.active[0];
		battle.makeChoices();
		assert.statStage(eelektross, 'atk', 2);
		assert.statStage(eelektross, 'spa', 2);
	});

	it(`should hit Pokemon with Air Balloon`, function () {
		battle = common.createBattle([[
			{species: 'Zygarde', level: 1, moves: ['thousandarrows']},
		], [
			{species: 'Donphan', item: 'airballoon', moves: ['sleeptalk']},
		]]);
		const donphan = battle.p2.active[0];
		battle.makeChoices();
		assert.false.fullHP(donphan);
		assert.false.holdsItem(donphan);
	});

	it(`should hit Electric-type Wonder Guard Pokemon holding an Air Balloon`, function () {
		battle = common.createBattle([[
			{species: 'Zygarde', level: 1, moves: ['thousandarrows']},
		], [
			{species: 'Regieleki', ability: 'wonderguard', item: 'airballoon', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
	});

	it(`should not hit Ground-type Pokemon when affected by Electrify`, function () {
		battle = common.createBattle([[
			{species: 'Zygarde', level: 1, moves: ['thousandarrows']},
		], [
			{species: 'Stunfisk', moves: ['electrify']},
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p2.active[0]);
	});

	it(`should not hit Ghost-type Pokemon when affected by Normalize`, function () {
		battle = common.createBattle([[
			{species: 'Zygarde', level: 1, ability: 'normalize', moves: ['thousandarrows']},
		], [
			{species: 'Dusknoir', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p2.active[0]);
	});
});
