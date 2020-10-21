'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Dynamax", function () {
	afterEach(function () {
		battle.destroy();
	});

	it('Max Move effects should not be suppressed by Sheer Force', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Braviary', ability: 'sheerforce', moves: ['heatwave', 'facade', 'superpower']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Shedinja', ability: 'sturdy', item: 'ringtarget', moves: ['splash']},
		]});
		battle.makeChoices('move heatwave dynamax', 'auto');
		assert.equal(battle.field.weather, 'sunnyday');
		battle.makeChoices('move facade', 'auto');
		assert.statStage(battle.p2.active[0], 'spe', -1);
		battle.makeChoices('move superpower', 'auto');
		assert.statStage(battle.p1.active[0], 'atk', 1);
	});

	it('Max Move versions of disabled moves should not be disabled, except by Assault Vest', function () {
		battle = common.createBattle([[
			{species: 'Mew', item: 'assaultvest', moves: ['watergun', 'protect']},
		], [
			{species: 'Mew', item: 'choiceband', moves: ['watergun', 'protect']},
		]]);
		battle.makeChoices('move 1 dynamax', 'move 1 dynamax');
		assert.throws(() => {
			battle.makeChoices('move 2', 'move 1');
		});
		battle.makeChoices('move 1', 'move 2');
	});

	it('Max Move weather activates even if foe faints', function () {
		battle = common.createBattle([[
			{species: 'Shedinja', moves: ['splash']},
		], [
			{species: 'Mew', moves: ['watergun']},
		]]);
		battle.makeChoices('move 1', 'move 1 dynamax');
		assert.equal(battle.field.weather, 'raindance');
	});

	it('Max Move weather activates before Sand Spit', function () {
		battle = common.createBattle([[
			{species: 'Shedinja', ability: 'sandspit', moves: ['splash']},
		], [
			{species: 'Mew', moves: ['watergun']},
		]]);
		battle.makeChoices('move 1', 'move 1 dynamax');
		assert.equal(battle.field.weather, 'sandstorm');
	});

	it('makes Liquid Voice stop working', function () {
		battle = common.createBattle([[
			{species: 'Primarina', ability: 'liquidvoice', moves: ['hypervoice']},
		], [
			{species: 'Rhyhorn', ability: 'wonderguard', moves: ['splash']},
		]]);
		battle.makeChoices('move 1 dynamax', 'move 1');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('G-Max Steelsurge hazard should deal 2x damage to Eiscue', function () {
		battle = common.createBattle([[
			{species: "Copperajah", moves: ['ironhead'], gigantamax: true},
		], [
			{species: "Pyukumuku", moves: ['uturn']},
			{species: "Eiscue", ability: 'iceface', moves: ['splash']},
		]]);
		battle.makeChoices('move ironhead dynamax', 'move uturn');
		battle.makeChoices('', 'switch eiscue');

		const pokemon = battle.p2.active[0];
		const expectedPercent = Math.pow(0.5, 2);
		const expectedDamage = Math.floor(pokemon.maxhp * expectedPercent);
		assert.equal(pokemon.maxhp - pokemon.hp, expectedDamage, `${pokemon.name} should take ${expectedPercent * 100}%`);
	});

	it.skip('should revert before the start of the 4th turn, not as an end-of-turn effect on the 3rd turn', function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['sleeptalk', 'psychic']},
		], [
			{species: 'weedle', level: 1, moves: ['sleeptalk']},
			{species: 'weedle', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move sleep talk dynamax');
		const dynamaxedHP = battle.p1.active[0].hp;
		battle.makeChoices();
		battle.makeChoices('move psychic');
		assert.equal(battle.requestState, 'switch');
		assert.equal(battle.p1.active[0].hp, dynamaxedHP);
	});

	it('should be impossible to Dynamax when all the base moves are disabled', function () {
		battle = common.createBattle([[
			{species: "Feebas", moves: ['splash']},
		], [
			{species: "Wynaut", moves: ['taunt', 'splash']},
		]]);
		battle.makeChoices();
		assert.cantMove(() => battle.choose('p1', 'move splash dynamax'));

		battle = common.createBattle([[
			{species: "Feebas", moves: ['splash']},
		], [
			{species: "Wynaut", moves: ['imprison', 'splash']},
		]]);
		battle.makeChoices();
		battle.makeChoices('move 1', 'auto');
		assert.cantMove(() => battle.choose('p1', 'move splash dynamax'));
	});

	it.skip(`should not allow the user to select max moves with 0 base PP remaining`, function () {
		battle = common.createBattle([[
			{species: 'pichu', ability: 'prankster', level: 1, moves: ['grudge']},
			{species: 'wynaut', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', moves: ['earthquake', 'sleeptalk']},
		]]);

		battle.makeChoices('auto', 'move earthquake dynamax');
		battle.makeChoices();
		assert.cantMove(() => battle.p2.chooseMove(1), 'wynaut', 'earthquake', true);
	});
});
