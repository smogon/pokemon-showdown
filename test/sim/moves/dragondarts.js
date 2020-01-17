'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Dragon Darts', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should hit both foes in doubles if they would take damage', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [{species: "Dragapult", ability: "Clear Body", moves: ["dragondarts"]}, {species: "Ludicolo", ability: "Dancer", moves: ["sleeptalk"]}]});
		battle.setPlayer('p2', {team: [{species: "Arcanine", ability: "Flash Fire", moves: ["sleeptalk"]}, {species: "Appletun", ability: "Ripen", moves: ["sleeptalk"]}]});
		battle.makeChoices('move dragondarts 1, move sleeptalk', 'move sleeptalk, move sleeptalk');

		assert.strictEqual(battle.p2.pokemon[0].hp !== battle.p2.pokemon[0].maxhp, true);
		assert.strictEqual(battle.p2.pokemon[1].hp !== battle.p2.pokemon[1].maxhp, true);
	});

	it('should hit one target twice if the other is immunue', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [{species: "Dragapult", ability: "Clear Body", moves: ["dragondarts"]}, {species: "Ludicolo", ability: "Dancer", moves: ["sleeptalk"]}]});
		battle.setPlayer('p2', {team: [{species: "Arcanine", ability: "Flash Fire", moves: ["sleeptalk"]}, {species: "Clefairy", ability: "Ripen", moves: ["sleeptalk"]}]});
		battle.makeChoices('move dragondarts 2, move sleeptalk', 'move sleeptalk, move sleeptalk');

		assert.strictEqual(battle.p2.pokemon[0].hp !== battle.p2.pokemon[0].maxhp, true);
		assert.strictEqual(battle.p2.pokemon[1].hp !== battle.p2.pokemon[1].maxhp, false);
	});

	it('should hit one target twice if the other is using a protect like move', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [{species: "Dragapult", ability: "Clear Body", moves: ["dragondarts"]}, {species: "Ludicolo", ability: "Dancer", moves: ["sleeptalk"]}]});
		battle.setPlayer('p2', {team: [{species: "Arcanine", ability: "Flash Fire", moves: ["sleeptalk"]}, {species: "Porygon2", ability: "Ripen", moves: ["protect"]}]});
		battle.makeChoices('move dragondarts 2, move sleeptalk', 'move sleeptalk, move protect');

		assert.strictEqual(battle.p2.pokemon[0].hp !== battle.p2.pokemon[0].maxhp, true);
		assert.strictEqual(battle.p2.pokemon[1].hp !== battle.p2.pokemon[1].maxhp, false);
	});

	it('should hit one target twice if the other is semi-invulnrable', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [{species: "Dragapult", item: "Lagging Tail", ability: "Clear Body", moves: ["dragondarts"]}, {species: "Ludicolo", ability: "Dancer", moves: ["sleeptalk"]}]});
		battle.setPlayer('p2', {team: [{species: "Arcanine", ability: "Flash Fire", moves: ["sleeptalk"]}, {species: "Golurk", ability: "Ripen", moves: ["phantomforce"]}]});
		battle.makeChoices('move dragondarts 2, move sleeptalk', 'move sleeptalk, move phantomforce 1');

		assert.strictEqual(battle.p2.pokemon[0].hp !== battle.p2.pokemon[0].maxhp, true);
		assert.strictEqual(battle.p2.pokemon[1].hp !== battle.p2.pokemon[1].maxhp, false);
	});

	it('should hit one target twice if the other is fainted', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [{species: "Dragapult", ability: "Clear Body", moves: ["dragondarts"]}, {species: "Ludicolo", ability: "Dancer", moves: ["sleeptalk"]}]});
		battle.setPlayer('p2', {team: [{species: "Arcanine", ability: "Flash Fire", moves: ["sleeptalk"]}, {species: "Snom", ability: "Ripen", moves: ["sleeptalk"]}]});

		battle.p2.pokemon[1].faint();
		battle.makeChoices('move dragondarts 2, move sleeptalk', 'move sleeptalk, move sleeptalk');

		assert.strictEqual(battle.p2.pokemon[0].hp !== battle.p2.pokemon[0].maxhp, true);
		assert.strictEqual(battle.p2.pokemon[1].hp !== 0, false);
	});

	it('when redirected should hit the target it was redirected to twice', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [{species: "Dragapult", ability: "Clear Body", moves: ["dragondarts"]}, {species: "Ludicolo", ability: "Dancer", moves: ["sleeptalk"]}]});
		battle.setPlayer('p2', {team: [{species: "Arcanine", ability: "Flash Fire", moves: ["sleeptalk"]}, {species: "Cacturne", ability: "Ripen", moves: ["followme"]}]});
		battle.makeChoices('move dragondarts 1, move sleeptalk', 'move sleeptalk, move followme');

		assert.strictEqual(battle.p2.pokemon[0].hp !== battle.p2.pokemon[0].maxhp, false);
		assert.strictEqual(battle.p2.pokemon[1].hp !== battle.p2.pokemon[1].maxhp, true);
	});

	it('should fail if both targets are fainted', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [{species: "Dragapult", ability: "Clear Body", moves: ["dragondarts"]}, {species: "Ludicolo", ability: "Dancer", moves: ["celebrate"]}]});
		battle.setPlayer('p2', {team: [{species: "Arcanine", ability: "Flash Fire", moves: ["celebrate"]}, {species: "Arcanine", ability: "Flash Fire", moves: ["celebrate"]}, {species: "Arcanine", ability: "Flash Fire", moves: ["celebrate"]}]});

		battle.p2.pokemon[0].faint();
		battle.p2.pokemon[1].faint();
		battle.makeChoices('move dragondarts 1, move celebrate', 'move celebrate, move celebrate');

		assert.strictEqual(battle.log.includes(`|-fail|p1a: Dragapult`), true);
	});

	it('should hit the target twice in singles', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Dragapult", ability: "Clear Body", moves: ["dragondarts"]}]});
		battle.setPlayer('p2', {team: [{species: "Arcanine", ability: "Flash Fire", moves: ["sleeptalk"]}]});
		battle.makeChoices('move dragondarts', 'move sleeptalk');

		assert.strictEqual(battle.p2.pokemon[0].hp !== battle.p2.pokemon[0].maxhp, true);
	});
});
