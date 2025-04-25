'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Intimidate', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should decrease Atk by 1 level', () => {
		battle = common.gen(7).createBattle([[
			{ species: "Smeargle", ability: 'owntempo', moves: ['sketch'] },
		], [
			{ species: "Gyarados", ability: 'intimidate', moves: ['splash'] },
		]]);
		assert.statStage(battle.p1.active[0], 'atk', -1);
	});

	it('should be blocked by Substitute', () => {
		battle = common.createBattle([[
			{ species: "Escavalier", item: 'leftovers', ability: 'shellarmor', moves: ['substitute'] },
		], [
			{ species: "Greninja", item: 'laggingtail', ability: 'protean', moves: ['uturn'] },
			{ species: "Gyarados", item: 'leftovers', ability: 'intimidate', moves: ['splash'] },
		]]);
		battle.makeChoices('move substitute', 'move uturn');
		battle.makeChoices('', 'switch gyarados');
		assert.statStage(battle.p1.active[0], 'atk', 0);
	});

	it('should not activate if U-turn breaks the Substitute in Gen 4', () => {
		battle = common.gen(4).createBattle({ gameType: 'doubles' }, [[
			{ species: "Gengar", level: 1, item: 'leftovers', ability: 'levitate', moves: ['substitute'] },
			{ species: "Suicune", level: 1, item: 'leftovers', ability: 'pressure', moves: ['substitute'] },
		], [
			{ species: "Gliscor", item: 'laggingtail', ability: 'sandveil', moves: ['uturn'] },
			{ species: "Scizor", item: 'laggingtail', ability: 'technician', moves: ['batonpass'] },
			{ species: "Gyarados", item: 'leftovers', ability: 'intimidate', moves: ['splash'] },
			{ species: "Salamence", item: 'leftovers', ability: 'intimidate', moves: ['splash'] },
		]]);
		battle.makeChoices('move substitute, move substitute', 'move uturn 1, move batonpass');
		battle.makeChoices('', 'switch 3, pass');

		const activate = '|-ability|p2a: Gyarados|Intimidate|boost';
		assert.equal(battle.log.filter(m => m === activate).length, 0);
		assert.statStage(battle.p1.active[0], 'atk', 0);
		assert.statStage(battle.p1.active[1], 'atk', 0);

		battle.makeChoices('', 'pass, switch 4');
		assert.statStage(battle.p1.active[0], 'atk', -1);
		assert.statStage(battle.p1.active[1], 'atk', 0);
	});

	it('should affect adjacent foes only', () => {
		battle = common.gen(5).createBattle({ gameType: 'triples' }, [[
			{ species: "Bulbasaur", item: 'leftovers', ability: 'overgrow', moves: ['vinewhip'] },
			{ species: "Charmander", item: 'leftovers', ability: 'blaze', moves: ['ember'] },
			{ species: "Squirtle", item: 'leftovers', ability: 'torrent', moves: ['bubble'] },
		], [
			{ species: "Greninja", ability: 'protean', moves: ['uturn'] },
			{ species: "Mew", ability: 'synchronize', moves: ['softboiled'] },
			{ species: "Gyarados", ability: 'intimidate', moves: ['splash'] },
		]]);

		const [frontPokemon, centerPokemon, farPokemon] = battle.p1.active;

		assert.statStage(frontPokemon, 'atk', -1);
		assert.statStage(centerPokemon, 'atk', -1);
		assert.statStage(farPokemon, 'atk', 0);
	});

	it('should wait until all simultaneous switch ins at the beginning of a battle have completed before activating', () => {
		battle = common.createBattle({ preview: true }, [[
			{ species: "Arcanine", ability: 'intimidate', moves: ['morningsun'] },
		], [
			{ species: "Gyarados", ability: 'intimidate', moves: ['dragondance'] },
		]]);
		let intimidateCount = 0;
		battle.onEvent('TryBoost', battle.format, (boost, target, source) => {
			assert.species(source, intimidateCount === 0 ? 'Arcanine' : 'Gyarados');
			intimidateCount++;
		});
		battle.makeChoices('default', 'default'); // Finish Team Preview, switch both Pokemon in
		assert.equal(intimidateCount, 2);
		assert.statStage(battle.p1.active[0], 'atk', -1);
		assert.statStage(battle.p2.active[0], 'atk', -1);

		// Do it again with the Pokemon in reverse order
		battle.destroy();
		battle = common.createBattle({ preview: true }, [[
			{ species: "Gyarados", ability: 'intimidate', moves: ['dragondance'] },
		], [
			{ species: "Arcanine", ability: 'intimidate', moves: ['morningsun'] },
		]]);
		intimidateCount = 0;
		battle.onEvent('TryBoost', battle.format, (boost, target, source) => {
			assert.species(source, intimidateCount === 0 ? 'Arcanine' : 'Gyarados');
			intimidateCount++;
		});
		battle.makeChoices('default', 'default'); // Finish Team Preview, switch both Pokemon in
		assert.equal(intimidateCount, 2);
		assert.statStage(battle.p1.active[0], 'atk', -1);
		assert.statStage(battle.p2.active[0], 'atk', -1);
	});

	it('should wait until all simultaneous switch ins after double-KOs have completed before activating', () => {
		battle = common.createBattle({ preview: true }, [[
			{ species: "Blissey", ability: 'naturalcure', moves: ['healingwish'] },
			{ species: "Arcanine", ability: 'intimidate', moves: ['healingwish'] },
			{ species: "Gyarados", ability: 'intimidate', moves: ['healingwish'] },
		], [
			{ species: "Blissey", ability: 'naturalcure', moves: ['healingwish'] },
			{ species: "Gyarados", ability: 'intimidate', moves: ['healingwish'] },
			{ species: "Arcanine", ability: 'intimidate', moves: ['healingwish'] },
		]]);
		const [p1active, p2active] = [battle.p1.active, battle.p2.active];
		let intimidateCount = 0;
		battle.onEvent('TryBoost', battle.format, (boost, target, source) => {
			assert.species(source, intimidateCount % 2 === 0 ? 'Arcanine' : 'Gyarados');
			intimidateCount++;
		});
		battle.makeChoices('default', 'default'); // Team Preview

		battle.makeChoices('move healingwish', 'move healingwish');

		battle.makeChoices('switch arcanine', 'switch gyarados');
		// Both Pokemon switched in at the same time
		assert.equal(intimidateCount, 2);
		assert.statStage(p1active[0], 'atk', -1);
		assert.statStage(p2active[0], 'atk', -1);
		// Do it again with the Pokemon in reverse order
		battle.makeChoices('move healingwish', 'move healingwish');
		battle.makeChoices('switch gyarados', 'switch arcanine');
		assert.equal(intimidateCount, 4);
		assert.statStage(p1active[0], 'atk', -1);
		assert.statStage(p2active[0], 'atk', -1);
	});
});
