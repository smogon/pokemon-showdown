'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Dragon Darts', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should hit twice in singles`, function () {
		battle = common.createBattle([[
			{species: "Ninjask", moves: ['dragondarts']},
		], [
			{species: "Mew", ability: 'stamina', moves: ['splash']},
		]]);
		battle.makeChoices();
		assert.statStage(battle.p2.active[0], 'def', 2);
	});

	it(`should hit each foe once in doubles`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Ninjask", moves: ['dragondarts']},
			{species: "Mew", ability: 'stamina', moves: ['splash']},
		], [
			{species: "Mew", ability: 'stamina', moves: ['splash']},
			{species: "Mew", ability: 'stamina', moves: ['splash']},
		]]);
		battle.makeChoices();
		assert.statStage(battle.p1.active[1], 'def', 0);
		assert.statStage(battle.p2.active[0], 'def', 1);
		assert.statStage(battle.p2.active[1], 'def', 1);
	});

	it(`should hit the other foe twice if it misses against one`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Ninjask", item: 'blunderpolicy', moves: ['dragondarts']},
			{species: "Wynaut", ability: 'stamina', moves: ['splash']},
		], [
			{species: "Mew", ability: 'stamina', moves: ['splash']},
			{species: "Shaymin", ability: 'stamina', moves: ['splash']},
		]]);

		const ninjask = battle.p1.active[0];
		const wynaut = battle.p1.active[1];
		const mew = battle.p2.active[0];
		const shaymin = battle.p2.active[1];

		// Modding accuracy so Dragon Darts always misses Mew
		battle.onEvent('Accuracy', battle.format, function (accuracy, target, source, move) {
			return target.species.id !== 'mew';
		});

		battle.makeChoices();
		assert.false(battle.log.includes('|-miss|p1a: Ninjask|p2a: Mew'));
		assert.statStage(ninjask, 'spe', 2);
		assert.statStage(wynaut, 'def', 0);
		assert.statStage(mew, 'def', 0);
		assert.statStage(shaymin, 'def', 2);
	});

	it(`should hit itself and ally if it targets itself after Ally Switch`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Ninjask", ability: 'stamina', moves: ['dragondarts']},
			{species: "Mew", ability: 'stamina', moves: ['allyswitch']},
		], [
			{species: "Mew", ability: 'stamina', moves: ['splash']},
			{species: "Shaymin", ability: 'stamina', moves: ['splash']},
		]]);
		battle.makeChoices('move dragondarts -2, move allyswitch', 'move splash, move splash');
		assert.statStage(battle.p1.active[0], 'def', 1);
		assert.statStage(battle.p1.active[1], 'def', 1);
		assert.statStage(battle.p2.active[0], 'def', 0);
		assert.statStage(battle.p2.active[1], 'def', 0);
	});

	it(`should hit both targets even if one faints`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Ninjask", moves: ['dragondarts']},
			{species: "Mew", moves: ['splash']},
		], [
			{species: "Shedinja", moves: ['splash']},
			{species: "Shedinja", moves: ['splash']},
		]]);
		battle.makeChoices();
		battle.getDebugLog();
		assert.equal(battle.p2.active[0].hp, 0);
		assert.equal(battle.p2.active[1].hp, 0);
	});

	it(`should hit the ally twice in doubles`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Ninjask", moves: ['dragondarts']},
			{species: "Mew", ability: 'stamina', moves: ['splash']},
		], [
			{species: "Mew", ability: 'stamina', moves: ['splash']},
			{species: "Mew", ability: 'stamina', moves: ['splash']},
		]]);
		battle.makeChoices('move dragondarts -2, move splash', 'move splash, move splash');
		assert.statStage(battle.p1.active[1], 'def', 2);
		assert.statStage(battle.p2.active[0], 'def', 0);
		assert.statStage(battle.p2.active[1], 'def', 0);
	});

	it(`should smart-target the foe that's not Protecting in Doubles`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Ninjask", moves: ['dragondarts']},
			{species: "Mew", ability: 'stamina', moves: ['splash']},
		], [
			{species: "Mew", ability: 'stamina', moves: ['protect']},
			{species: "Mew", ability: 'stamina', moves: ['splash']},
		]]);
		battle.makeChoices();
		assert.statStage(battle.p1.active[1], 'def', 0);
		assert.statStage(battle.p2.active[0], 'def', 0);
		assert.statStage(battle.p2.active[1], 'def', 2);
	});

	it(`should be able to be redirected`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Ninjask", moves: ['dragondarts']},
			{species: "Mew", ability: 'stamina', moves: ['splash']},
		], [
			{species: "Mew", ability: 'stamina', moves: ['ragepowder']},
			{species: "Mew", ability: 'stamina', moves: ['splash']},
		]]);
		battle.makeChoices();
		assert.statStage(battle.p1.active[1], 'def', 0);
		assert.statStage(battle.p2.active[0], 'def', 2);
		assert.statStage(battle.p2.active[1], 'def', 0);
	});

	it('should hit one target twice if the other is protected by an ability', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: "Dragapult", ability: "Clear Body", moves: ["dragondarts"]},
			{species: "Grimmsnarl", ability: "Prankster", moves: ["electrify"]},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Arcanine", ability: "Stamina", moves: ["sleeptalk"]},
			{species: "Emolga", ability: "Motor Drive", moves: ["sleeptalk"]},
		]});
		battle.makeChoices('move dragondarts 2, move electrify -1', 'move sleeptalk, move sleeptalk');

		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		assert.equal(battle.p2.active[1].hp, battle.p2.active[1].maxhp);
		assert.statStage(battle.p2.active[0], 'def', 2);
		// Dragon Darts activates the absorption effect despite hitting Arcanine twice
		assert.statStage(battle.p2.active[1], 'spe', 1);
	});

	it('should hit one target twice if the other is immunue', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: "Dragapult", ability: "Clear Body", moves: ["dragondarts"]},
			{species: "Ludicolo", ability: "Dancer", moves: ["sleeptalk"]},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Arcanine", ability: "Stamina", moves: ["sleeptalk"]},
			{species: "Clefairy", ability: "Ripen", moves: ["sleeptalk"]},
		]});
		battle.makeChoices('move dragondarts 2, move sleeptalk', 'move sleeptalk, move sleeptalk');

		assert.statStage(battle.p2.active[0], 'def', 2);
		assert.equal(battle.p2.active[1].hp, battle.p2.active[1].maxhp);
	});

	it('should hit one target twice if the other is semi-invulnerable', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: "Dragapult", item: "Lagging Tail", ability: "Clear Body", moves: ["dragondarts"]},
			{species: "Ludicolo", ability: "Dancer", moves: ["sleeptalk"]},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Arcanine", ability: "Stamina", moves: ["sleeptalk"]},
			{species: "Golurk", ability: "Ripen", moves: ["phantomforce"]},
		]});
		battle.makeChoices('move dragondarts 2, move sleeptalk', 'move sleeptalk, move phantomforce 1');

		assert.statStage(battle.p2.active[0], 'def', 2);
		assert.equal(battle.p2.active[1].hp, battle.p2.active[1].maxhp);
	});

	it('should hit one target twice if the other is fainted', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: "Dragapult", ability: "Clear Body", moves: ["dragondarts"]},
			{species: "Ludicolo", ability: "Dancer", moves: ["sleeptalk"]},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Arcanine", ability: "Stamina", moves: ["sleeptalk"]},
			{species: "Snom", ability: "Ripen", moves: ["sleeptalk"]},
		]});

		battle.p2.active[1].faint();
		battle.makeChoices('move dragondarts 2, move sleeptalk', 'move sleeptalk, move sleeptalk');

		assert.statStage(battle.p2.active[0], 'def', 2);
		assert.equal(battle.p2.active[1].hp, 0);
	});

	it('should hit one target twice if the other is Dark type and Dragon Darts is Prankster boosted', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: "Dragapult", ability: "Clear Body", moves: ["sleeptalk", "dragondarts"]},
			{species: "Liepard", ability: "Prankster", moves: ["assist"]},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Arcanine", ability: "Stamina", moves: ["sleeptalk"]},
			{species: "Spiritomb", ability: "Infiltrator", moves: ["sleeptalk"]},
		]});

		battle.makeChoices();

		assert.statStage(battle.p2.active[0], 'def', 2);
		assert.equal(battle.p2.active[1].hp, battle.p2.active[1].maxhp);
	});

	it('should fail if both targets are fainted', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: "Dragapult", ability: "Clear Body", moves: ["dragondarts"]},
			{species: "Ludicolo", ability: "Dancer", moves: ["celebrate"]},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Arcanine", ability: "Flash Fire", moves: ["celebrate"]},
			{species: "Arcanine", ability: "Flash Fire", moves: ["celebrate"]},
			{species: "Arcanine", ability: "Flash Fire", moves: ["celebrate"]},
		]});

		battle.p2.active[0].faint();
		battle.p2.active[1].faint();
		battle.makeChoices('move dragondarts 1, move celebrate', 'move celebrate, move celebrate');

		assert(battle.log.includes(`|-fail|p1a: Dragapult`));
	});
});
