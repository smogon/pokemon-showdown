'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Photon Geyser`, function () {
	afterEach(() => battle.destroy());

	it('should become physical when Attack stat is higher than Special Attack stat', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Necrozma-Dusk-Mane", ability: 'prismarmor', moves: ['photongeyser']}]});
		battle.setPlayer('p2', {team: [{species: "Mew", ability: 'synchronize', item: 'keeberry', moves: ['counter']}]});
		battle.makeChoices('move photongeyser', 'move counter');
		assert.statStage(battle.p2.active[0], 'def', 1, "Physical Photon Geyser should trigger Kee Berry");
		assert.false.fullHP(battle.p1.active[0], "Physical Photon Geyser should be susceptible to Counter");
	});

	it('should determine which attack stat is higher after factoring in stat stages, but no other kind of modifier', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Latias", ability: 'hugepower', item: 'choiceband', moves: ['photongeyser']}]});
		battle.setPlayer('p2', {team: [{species: "Scizor-Mega", ability: 'technician', item: 'keeberry', moves: ['strugglebug', 'sleeptalk']}]});
		battle.makeChoices('move photongeyser', 'move strugglebug'); //should be special this turn (196 vs. 256)
		assert.statStage(battle.p2.active[0], 'def', 0, "incorrectly swayed by Choice Band and/or Huge Power");
		battle.makeChoices('move photongeyser', 'move sleeptalk'); //should be physical this turn (196 vs. 170)
		assert.statStage(battle.p2.active[0], 'def', 1, "not correctly swayed by a stat drop");
	});

	it('should ignore abilities the same way as Mold Breaker', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Necrozma", ability: 'prismarmor', moves: ['photongeyser']}]});
		battle.setPlayer('p2', {team: [{species: "Mimikyu", ability: 'disguise', moves: ['splash']}]});
		battle.makeChoices('move photongeyser', 'move splash');
		assert.false.fullHP(battle.p2.active[0]);
	});

	it(`should not ignore abilities when called as a submove of another move`, function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Liepard', ability: 'prankster', moves: ['assist', 'copycat', 'sleeptalk', 'photongeyser']},
			{species: 'Necrozma', ability: 'prismarmor', moves: ['photongeyser']},
		]});
		battle.setPlayer('p2', {team: [{species: 'Bruxish', ability: 'dazzling', moves: ['photongeyser', 'spore']}]});
		const pokemon = battle.p2.active[0];
		battle.makeChoices('move assist', 'move photongeyser');
		assert.fullHP(pokemon, "incorrectly ignores abilities through Assist");
		pokemon.hp = pokemon.maxhp;
		battle.makeChoices('move copycat', 'move spore');
		assert.fullHP(pokemon, "incorrectly ignores abilities through Copycat");
		pokemon.hp = pokemon.maxhp;
		battle.makeChoices('move sleeptalk', 'move photongeyser');
		assert.fullHP(pokemon, "incorrectly ignores abilities through Sleep Talk");
	});

	it(`should ignore abilities when called as a submove by a Pokemon that also has Mold Breaker`, function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Pangoro', ability: 'moldbreaker', moves: ['sleeptalk', 'photongeyser']}]});
		battle.setPlayer('p2', {team: [{species: 'Mimikyu', ability: 'disguise', moves: ['spore']}]});
		battle.makeChoices('move sleeptalk', 'move spore');
		assert.false.fullHP(battle.p2.active[0]);
	});
});
