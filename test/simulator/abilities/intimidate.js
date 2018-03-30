'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Intimidate', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should decrease Atk by 1 level', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'owntempo', moves: ['sketch']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Gyarados", ability: 'intimidate', moves: ['splash']}]);
		assert.statStage(battle.p1.active[0], 'atk', -1);
	});

	it('should be blocked by Substitute', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Escavalier", item: 'leftovers', ability: 'shellarmor', moves: ['substitute']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Greninja", item: 'laggingtail', ability: 'protean', moves: ['uturn']},
			{species: "Gyarados", item: 'leftovers', ability: 'intimidate', moves: ['splash']},
		]);
		battle.makeChoices('move substitute', 'move uturn');
		battle.makeChoices('move substitute', 'switch gyarados');
		assert.statStage(battle.p1.active[0], 'atk', 0);
	});

	it('should affect adjacent foes only', function () {
		battle = common.createBattle({gameType: 'triples'});
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: "Bulbasaur", item: 'leftovers', ability: 'overgrow', moves: ['vinewhip']},
			{species: "Charmander", item: 'leftovers', ability: 'blaze', moves: ['ember']},
			{species: "Squirtle", item: 'leftovers', ability: 'torrent', moves: ['bubble']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Greninja", ability: 'protean', moves: ['uturn']},
			{species: "Mew", ability: 'synchronize', moves: ['softboiled']},
			{species: "Gyarados", ability: 'intimidate', moves: ['splash']},
		]);

		assert.statStage(p1.active[0], 'atk', -1);
		assert.statStage(p1.active[1], 'atk', -1);
		assert.statStage(p1.active[2], 'atk', 0);
	});

	it('should wait until all simultaneous switch ins at the beginning of a battle have completed before activating', function () {
		battle = common.createBattle({preview: true});
		let p1 = battle.join('p1', 'Guest 1', 1, [{species: "Arcanine", ability: 'intimidate', moves: ['morningsun']}]);
		let p2 = battle.join('p2', 'Guest 2', 1, [{species: "Gyarados", ability: 'intimidate', moves: ['dragondance']}]);
		let intimidateCount = 0;
		battle.onEvent('Boost', battle.getFormat(), function (boost, target, source) {
			assert.species(source, intimidateCount === 0 ? 'Arcanine' : 'Gyarados');
			intimidateCount++;
		});
		battle.makeChoices('teampreview', 'teampreview'); // Finish Team Preview, switch both Pokemon in
		assert.strictEqual(intimidateCount, 2);
		assert.statStage(p1.active[0], 'atk', -1);
		assert.statStage(p2.active[0], 'atk', -1);

		// Do it again with the Pokemon in reverse order
		battle.destroy();
		battle = common.createBattle({preview: true});
		p1 = battle.join('p1', 'Guest 1', 1, [{species: "Gyarados", ability: 'intimidate', moves: ['dragondance']}]);
		p2 = battle.join('p2', 'Guest 2', 1, [{species: "Arcanine", ability: 'intimidate', moves: ['morningsun']}]);
		intimidateCount = 0;
		battle.onEvent('Boost', battle.getFormat(), function (boost, target, source) {
			assert.species(source, intimidateCount === 0 ? 'Arcanine' : 'Gyarados');
			intimidateCount++;
		});
		battle.makeChoices('teampreview', 'teampreview'); // Finish Team Preview, switch both Pokemon in
		assert.strictEqual(intimidateCount, 2);
		assert.statStage(p1.active[0], 'atk', -1);
		assert.statStage(p2.active[0], 'atk', -1);
	});

	it('should wait until all simultaneous switch ins after double-KOs have completed before activating', function () {
		battle = common.createBattle({preview: true});
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: "Blissey", ability: 'naturalcure', moves: ['healingwish']},
			{species: "Arcanine", ability: 'intimidate', moves: ['healingwish']},
			{species: "Gyarados", ability: 'intimidate', moves: ['healingwish']},
		]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: "Blissey", ability: 'naturalcure', moves: ['healingwish']},
			{species: "Gyarados", ability: 'intimidate', moves: ['healingwish']},
			{species: "Arcanine", ability: 'intimidate', moves: ['healingwish']},
		]);
		let intimidateCount = 0;
		battle.onEvent('Boost', battle.getFormat(), function (boost, target, source) {
			assert.species(source, intimidateCount % 2 === 0 ? 'Arcanine' : 'Gyarados');
			intimidateCount++;
		});
		battle.makeChoices('teampreview', 'teampreview'); // Team Preview

		battle.makeChoices('move healingwish', 'move healingwish');

		battle.makeChoices('switch arcanine', 'switch gyarados');
		// Both Pokemon switched in at the same time
		assert.strictEqual(intimidateCount, 2);
		assert.statStage(p1.active[0], 'atk', -1);
		assert.statStage(p2.active[0], 'atk', -1);
		// Do it again with the Pokemon in reverse order
		battle.makeChoices('move healingwish', 'move healingwish');
		battle.makeChoices('switch gyarados', 'switch arcanine');
		assert.strictEqual(intimidateCount, 4);
		assert.statStage(p1.active[0], 'atk', -1);
		assert.statStage(p2.active[0], 'atk', -1);
	});
});
