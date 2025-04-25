'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Lightning Rod', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should grant immunity to Electric-type moves and boost Special Attack by 1 stage', () => {
		battle = common.gen(6).createBattle([[
			{ species: 'Manectric', ability: 'lightningrod', moves: ['sleeptalk'] },
		], [
			{ species: 'Jolteon', ability: 'static', moves: ['thunderbolt'] },
		]]);
		battle.makeChoices('move sleeptalk', 'move thunderbolt');
		assert.fullHP(battle.p1.active[0]);
		assert.statStage(battle.p1.active[0], 'spa', 1);
	});

	it('should not boost Special Attack if the user is already immune to Electric-type moves in gen 6-', () => {
		battle = common.gen(6).createBattle([[
			{ species: 'Rhydon', ability: 'lightningrod', moves: ['sleeptalk'] },
		], [
			{ species: 'Jolteon', ability: 'static', moves: ['thunderbolt'] },
		]]);
		battle.makeChoices('move sleeptalk', 'move thunderbolt');
		assert.statStage(battle.p1.active[0], 'spa', 0);
	});

	it('should boost Special Attack if the user is already immune to Electric-type moves in gen 7+', () => {
		battle = common.createBattle([[
			{ species: 'Rhydon', ability: 'lightningrod', moves: ['sleeptalk'] },
		], [
			{ species: 'Jolteon', ability: 'static', moves: ['thunderbolt'] },
		]]);
		battle.makeChoices('move sleeptalk', 'move thunderbolt');
		assert.fullHP(battle.p1.active[0]);
		assert.statStage(battle.p1.active[0], 'spa', 1);
	});

	it('should redirect single-target Electric-type attacks to the user if it is a valid target', function () {
		this.timeout(3000);
		battle = common.gen(5).createBattle({ gameType: 'triples' }, [[
			{ species: 'Manectric', ability: 'lightningrod', moves: ['sleeptalk'] },
			{ species: 'Electrode', ability: 'static', moves: ['thunderbolt'] },
			{ species: 'Electrode', ability: 'static', moves: ['thunderbolt'] },
		], [
			{ species: 'Electrode', ability: 'static', moves: ['thunderbolt'] },
			{ species: 'Electrode', ability: 'static', moves: ['thunderbolt'] },
			{ species: 'Electrode', ability: 'static', moves: ['thunderbolt'] },
		]]);
		battle.makeChoices('move sleeptalk, move thunderbolt 1, move thunderbolt 1', 'move thunderbolt 3, move thunderbolt 3, move thunderbolt 2');
		assert.statStage(battle.p1.active[0], 'spa', 3);
		assert.false.fullHP(battle.p1.active[2]);
		assert.false.fullHP(battle.p2.active[0]);
	});

	it('should redirect to the fastest Pokemon with the ability', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Manectric', ability: 'lightningrod', moves: ['sleeptalk'] },
			{ species: 'Manectric', ability: 'lightningrod', moves: ['sleeptalk'] },
		], [
			{ species: 'Electrode', ability: 'static', moves: ['thunderbolt'] },
			{ species: 'Electrode', ability: 'static', moves: ['thunderbolt'] },
		]]);
		const [fastTric, slowTric] = battle.p1.active;
		fastTric.boostBy({ spe: 6 });
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move thunderbolt 1, move thunderbolt 2');
		assert.statStage(fastTric, 'spa', 2);
		assert.statStage(slowTric, 'spa', 0);
	});

	it('should redirect to the Pokemon having the ability longest', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Meloetta', ability: 'serenegrace', moves: ['roleplay'] },
			{ species: 'Pikachu', ability: 'lightningrod', moves: ['sleeptalk'] },
		], [
			{ species: 'Pichu', ability: 'static', moves: ['thunderbolt'] },
			{ species: 'Pichu', ability: 'static', moves: ['thunderbolt'] },
		]]);
		let [rodCopied, rodStarts] = battle.p1.active;
		battle.makeChoices('move roleplay -2, move sleeptalk', 'move thunderbolt 1, move thunderbolt 2');
		assert.statStage(rodCopied, 'spa', 0);
		assert.statStage(rodStarts, 'spa', 2);

		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Togedemaru', moves: ['zingzap'] },
			{ species: 'Ditto', ability: 'imposter', moves: ['transform'] },
		], [
			{ species: 'Manectric', ability: 'lightningrod', moves: ['sleeptalk'] },
			{ species: 'Dratini', moves: ['thunderbolt'] },
		]]);
		rodCopied = battle.p1.active[1]; // Ditto
		rodStarts = battle.p2.active[0]; // Manectric
		battle.makeChoices('move zingzap 2, move sleeptalk', 'move sleeptalk, move thunderbolt 1');
		assert.statStage(rodCopied, 'spa', 0);
		assert.statStage(rodStarts, 'spa', 2);
	});

	it('should not redirect if another Pokemon has used Follow Me', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Manectric', ability: 'lightningrod', moves: ['sleeptalk'] },
			{ species: 'Manectric', ability: 'static', moves: ['followme'] },
		], [
			{ species: 'Electrode', ability: 'static', moves: ['thunderbolt'] },
			{ species: 'Electrode', ability: 'static', moves: ['thunderbolt'] },
		]]);
		const [rodPokemon, defender] = battle.p1.active;
		battle.makeChoices('move sleeptalk, move followme', 'move thunderbolt 2, move thunderbolt 1');
		assert.statStage(rodPokemon, 'spa', 0);
		assert.false.fullHP(defender);
	});

	it('should have its Electric-type immunity and its ability to redirect moves suppressed by Mold Breaker', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Manectric', ability: 'lightningrod', moves: ['endure'] },
			{ species: 'Manaphy', ability: 'hydration', moves: ['tailglow'] },
		], [
			{ species: 'Haxorus', ability: 'moldbreaker', moves: ['thunderpunch'] },
			{ species: 'Zekrom', ability: 'teravolt', moves: ['shockwave'] },
		]]);
		const [rodPokemon, ally] = battle.p1.active;
		battle.makeChoices('move endure, move tailglow', 'move thunderpunch 1, move shockwave 2');
		assert.false.fullHP(rodPokemon);
		assert.false.fullHP(ally);
	});
});
