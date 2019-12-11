'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Intimidate', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should decrease Atk by 1 level', function () {
		battle = common.gen(7).createBattle();
		battle.setPlayer('p1', {team: [{species: "Smeargle", ability: 'owntempo', moves: ['sketch']}]});
		battle.setPlayer('p2', {team: [{species: "Gyarados", ability: 'intimidate', moves: ['splash']}]});
		assert.statStage(battle.p1.active[0], 'atk', -1);
	});

	it('should be blocked by Substitute', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: "Escavalier", item: 'leftovers', ability: 'shellarmor', moves: ['substitute']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Greninja", item: 'laggingtail', ability: 'protean', moves: ['uturn']},
			{species: "Gyarados", item: 'leftovers', ability: 'intimidate', moves: ['splash']},
		]});
		battle.makeChoices('move substitute', 'move uturn');
		battle.makeChoices('', 'switch gyarados');
		assert.statStage(battle.p1.active[0], 'atk', 0);
	});

	it('should not activate if U-turn breaks the Substitute in Gen 4', function () {
		battle = common.gen(4).createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: "Gengar", level: 1, item: 'leftovers', ability: 'levitate', moves: ['substitute']},
			{species: "Suicune", level: 1, item: 'leftovers', ability: 'pressure', moves: ['substitute']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Gliscor", item: 'laggingtail', ability: 'sandveil', moves: ['uturn']},
			{species: "Scizor", item: 'laggingtail', ability: 'technician', moves: ['batonpass']},
			{species: "Gyarados", item: 'leftovers', ability: 'intimidate', moves: ['splash']},
			{species: "Salamence", item: 'leftovers', ability: 'intimidate', moves: ['splash']},
		]});
		battle.makeChoices('move substitute, move substitute', 'move uturn 1, move batonpass');
		battle.makeChoices('', 'switch 3, pass');

		const activate = '|-ability|p2a: Gyarados|Intimidate|boost';
		assert.strictEqual(battle.log.filter(m => m === activate).length, 0);
		assert.statStage(battle.p1.active[0], 'atk', 0);
		assert.statStage(battle.p1.active[1], 'atk', 0);

		battle.makeChoices('', 'pass, switch 4');
		assert.statStage(battle.p1.active[0], 'atk', -1);
		assert.statStage(battle.p1.active[1], 'atk', 0);
	});

	it('should affect adjacent foes only', function () {
		battle = common.gen(5).createBattle({gameType: 'triples'});
		battle.setPlayer('p1', {team: [
			{species: "Bulbasaur", item: 'leftovers', ability: 'overgrow', moves: ['vinewhip']},
			{species: "Charmander", item: 'leftovers', ability: 'blaze', moves: ['ember']},
			{species: "Squirtle", item: 'leftovers', ability: 'torrent', moves: ['bubble']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Greninja", ability: 'protean', moves: ['uturn']},
			{species: "Mew", ability: 'synchronize', moves: ['softboiled']},
			{species: "Gyarados", ability: 'intimidate', moves: ['splash']},
		]});

		const [frontPokemon, centerPokemon, farPokemon] = battle.p1.active;

		assert.statStage(frontPokemon, 'atk', -1);
		assert.statStage(centerPokemon, 'atk', -1);
		assert.statStage(farPokemon, 'atk', 0);
	});

	it('should wait until all simultaneous switch ins at the beginning of a battle have completed before activating', function () {
		battle = common.createBattle({preview: true});
		battle.setPlayer('p1', {team: [{species: "Arcanine", ability: 'intimidate', moves: ['morningsun']}]});
		battle.setPlayer('p2', {team: [{species: "Gyarados", ability: 'intimidate', moves: ['dragondance']}]});
		let intimidateCount = 0;
		battle.onEvent('Boost', battle.format, function (boost, target, source) {
			assert.species(source, intimidateCount === 0 ? 'Arcanine' : 'Gyarados');
			intimidateCount++;
		});
		battle.makeChoices('default', 'default'); // Finish Team Preview, switch both Pokemon in
		assert.strictEqual(intimidateCount, 2);
		assert.statStage(battle.p1.active[0], 'atk', -1);
		assert.statStage(battle.p2.active[0], 'atk', -1);

		// Do it again with the Pokemon in reverse order
		battle.destroy();
		battle = common.createBattle({preview: true});
		battle.setPlayer('p1', {team: [{species: "Gyarados", ability: 'intimidate', moves: ['dragondance']}]});
		battle.setPlayer('p2', {team: [{species: "Arcanine", ability: 'intimidate', moves: ['morningsun']}]});
		intimidateCount = 0;
		battle.onEvent('Boost', battle.format, function (boost, target, source) {
			assert.species(source, intimidateCount === 0 ? 'Arcanine' : 'Gyarados');
			intimidateCount++;
		});
		battle.makeChoices('default', 'default'); // Finish Team Preview, switch both Pokemon in
		assert.strictEqual(intimidateCount, 2);
		assert.statStage(battle.p1.active[0], 'atk', -1);
		assert.statStage(battle.p2.active[0], 'atk', -1);
	});

	it('should wait until all simultaneous switch ins after double-KOs have completed before activating', function () {
		battle = common.createBattle({preview: true});
		battle.setPlayer('p1', {team: [
			{species: "Blissey", ability: 'naturalcure', moves: ['healingwish']},
			{species: "Arcanine", ability: 'intimidate', moves: ['healingwish']},
			{species: "Gyarados", ability: 'intimidate', moves: ['healingwish']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Blissey", ability: 'naturalcure', moves: ['healingwish']},
			{species: "Gyarados", ability: 'intimidate', moves: ['healingwish']},
			{species: "Arcanine", ability: 'intimidate', moves: ['healingwish']},
		]});
		const [p1active, p2active] = [battle.p1.active, battle.p2.active];
		let intimidateCount = 0;
		battle.onEvent('Boost', battle.format, function (boost, target, source) {
			assert.species(source, intimidateCount % 2 === 0 ? 'Arcanine' : 'Gyarados');
			intimidateCount++;
		});
		battle.makeChoices('default', 'default'); // Team Preview

		battle.makeChoices('move healingwish', 'move healingwish');

		battle.makeChoices('switch arcanine', 'switch gyarados');
		// Both Pokemon switched in at the same time
		assert.strictEqual(intimidateCount, 2);
		assert.statStage(p1active[0], 'atk', -1);
		assert.statStage(p2active[0], 'atk', -1);
		// Do it again with the Pokemon in reverse order
		battle.makeChoices('move healingwish', 'move healingwish');
		battle.makeChoices('switch gyarados', 'switch arcanine');
		assert.strictEqual(intimidateCount, 4);
		assert.statStage(p1active[0], 'atk', -1);
		assert.statStage(p2active[0], 'atk', -1);
	});
});
