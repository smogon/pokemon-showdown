'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Partners in Crime', function () {
	afterEach(() => battle.destroy());

	it('should activate shared abilities at the same time as other abilities', function () {
		battle = common.createBattle({formatid: 'gen9partnersincrime'}, [[
			{species: 'Incineroar', ability: 'intimidate', item: 'whiteherb', moves: ['sleeptalk']},
			{species: 'Pincurchin', ability: 'electricsurge', moves: ['sleeptalk']},
		], [
			{species: 'Rampardos', ability: 'sheerforce', moves: ['sleeptalk']},
			{species: 'Iron Valiant', ability: 'quarkdrive', moves: ['sleeptalk']},
			{species: 'Litten', ability: 'intimidate', moves: ['sleeptalk']},
		]]);
		// team preview
		battle.makeChoices();
		const rampardos = battle.p2.active[0];
		assert.statStage(rampardos, 'atk', -2);
		assert.equal(rampardos.volatiles.quarkdrive.bestStat, 'atk',
			`Rampardos should be Intimidated exactly once before Quark Drive activates`);
		const ironvaliant = battle.p2.active[1];
		assert.statStage(ironvaliant, 'atk', -2);
		assert.equal(ironvaliant.volatiles.quarkdrive.bestStat, 'spa',
			`Iron Valiant should be Intimidated exactly once before Quark Drive activates`);
		assert.equal(battle.field.terrainState.source.name, 'Incineroar', `Incineroar should set Electric Terrain`);

		battle.makeChoices('auto', 'move sleeptalk, switch 3');
		const incineroar = battle.p1.active[0];
		assert.false.holdsItem(incineroar);
		assert.statStage(incineroar, 'atk', 0, `Incineroar's White Herb should have activated after both Litten and Rampardos's Intimidates`);
	});

	it('should activate shared abilities for each ally when only the original holder switches in', function () {
		battle = common.createBattle({formatid: 'gen9partnersincrime'}, [[
			{species: 'Pyukumuku', ability: 'innardsout', moves: ['sleeptalk']},
			{species: 'Pincurchin', ability: 'electricsurge', moves: ['sleeptalk']},
			{species: 'Incineroar', ability: 'intimidate', moves: ['sleeptalk']},
		], [
			{species: 'Corviknight', ability: 'mirrorarmor', moves: ['sleeptalk']},
			{species: 'Iron Valiant', ability: 'quarkdrive', moves: ['sleeptalk']},
		]]);
		// team preview
		battle.makeChoices();
		// swap Pyukumuku for Incineroar
		battle.makeChoices('switch 3, move sleeptalk', 'auto');
		const pincurchin = battle.p1.active[1];
		assert.statStage(pincurchin, 'atk', -2, 'Pincurchin should have had its innate Intimidate activate, triggering Mirror Armor');
	});

	it('should not activate ally\'s innates if the partner faints on switch-in', function () {
		battle = common.createBattle({formatid: 'gen9partnersincrime'}, [[
			{species: 'Shedinja', ability: 'download', moves: ['sleeptalk']},
			{species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk']},
			{species: 'Chansey', ability: 'healer', moves: ['sleeptalk']},
		], [
			{species: 'Stonjourner', ability: 'powerspot', moves: ['stealthrock']},
			{species: 'Iron Hands', ability: 'quarkdrive', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		const cresselia = battle.p1.active[1];
		assert.statStage(cresselia, 'spa', 1);
		battle.makeChoices('switch 3, move sleeptalk', 'auto');
		battle.makeChoices('switch 3, move sleeptalk', 'auto');
		assert.statStage(cresselia, 'spa', 1, 'Cresselia should not have gained another Download boost after Shedinja fainted');
	});
});
