'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Magic Bounce', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should bounce Growl', () => {
		// Sanity check: if this test fails, the remaining tests for Magic Bounce may not make sense.
		// Tests for specific moves belong to the respective moves' test suites.
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Bulbasaur", ability: 'overgrow', moves: ['growl'] }] });
		battle.setPlayer('p2', { team: [{ species: "Espeon", ability: 'magicbounce', moves: ['futuresight'] }] });
		battle.makeChoices('move growl', 'move futuresight');
		assert.statStage(battle.p1.active[0], 'atk', -1);
		assert.statStage(battle.p2.active[0], 'atk', 0);
	});

	it('should bounce once when target and source share the ability', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Xatu", ability: 'magicbounce', moves: ['roost'] }] });
		battle.setPlayer('p2', { team: [{ species: "Espeon", ability: 'magicbounce', moves: ['growl'] }] });
		assert.doesNotThrow(() => battle.makeChoices('move roost', 'move growl'));
		assert.statStage(battle.p1.active[0], 'atk', 0);
		assert.statStage(battle.p2.active[0], 'atk', -1);
	});

	it('should not cause a choice-lock', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [
			{ species: "Spoink", ability: 'thickfat', moves: ['bounce'] },
			{ species: "Xatu", item: 'choicescarf', ability: 'magicbounce', moves: ['roost', 'growl'] },
		] });
		battle.setPlayer('p2', { team: [{ species: "Espeon", ability: 'magicbounce', moves: ['growl', 'recover'] }] });
		battle.makeChoices('switch 2', 'move growl');
		battle.makeChoices('move roost', 'move recover');
		assert.notEqual(battle.p1.active[0].lastMove.id, 'growl');
	});

	it('should be suppressed by Mold Breaker', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Bulbasaur", ability: 'moldbreaker', moves: ['growl'] }] });
		battle.setPlayer('p2', { team: [{ species: "Espeon", ability: 'magicbounce', moves: ['futuresight'] }] });
		battle.makeChoices('move growl', 'move futuresight');
		assert.statStage(battle.p1.active[0], 'atk', 0);
		assert.statStage(battle.p2.active[0], 'atk', -1);
	});

	it('should not bounce moves while semi-invulnerable', () => {
		battle = common.createBattle({ gameType: 'doubles' });
		battle.setPlayer('p1', { team: [
			{ species: "Bulbasaur", ability: 'overgrow', moves: ['growl'] },
			{ species: "Geodude", ability: 'rockhead', moves: ['stealthrock'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: "Xatu", ability: 'magicbounce', moves: ['fly'] },
			{ species: "Charmander", ability: 'blaze', moves: ['sleeptalk'] },
		] });
		battle.makeChoices('auto', 'auto');
		assert.statStage(battle.p1.active[0], 'atk', 0);
		assert.statStage(battle.p2.active[0], 'atk', 0);
		assert.false(battle.p1.sideConditions['stealthrock']);
		assert(battle.p2.sideConditions['stealthrock']);
	});

	it(`should only activate for the fastest Pokemon in a Free-for-all battle`, () => {
		battle = common.createBattle({ gameType: 'freeforall' }, [[
			{ species: 'Deoxys-Speed', moves: ['stealthrock'] },
		], [
			{ species: 'Espeon', ability: 'magicbounce', moves: ['sleeptalk'] },
		], [
			{ species: 'Hatterene', ability: 'magicbounce', moves: ['sleeptalk'] },
		], [
			{ species: 'Hattrem', ability: 'magicbounce', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.deepEqual(battle.sides.map(side => !!side.sideConditions.stealthrock), [true, false, true, true]);
	});

	it(`should activate from fastest to slowest based on unmodified speed`, () => {
		battle = common.createBattle({ gameType: 'freeforall' }, [[
			{ species: 'Deoxys-Speed', moves: ['stealthrock', 'trickroom'] },
		], [
			{ species: 'Espeon', ability: 'magicbounce', moves: ['sleeptalk'] },
		], [
			{ species: 'Hatterene', ability: 'magicbounce', moves: ['sleeptalk'] },
		], [
			{ species: 'Hattrem', ability: 'magicbounce', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move trickroom', 'auto', 'auto', 'auto');
		battle.makeChoices();
		assert.deepEqual(battle.sides.map(side => !!side.sideConditions.stealthrock), [true, false, true, true]);
	});

	it(`[Gen 5] should bounce moves that target the foe's side while semi-invulnerable`, () => {
		battle = common.gen(5).createBattle({ gameType: 'doubles' });
		battle.setPlayer('p1', { team: [
			{ species: "Bulbasaur", ability: 'overgrow', moves: ['growl'] },
			{ species: "Geodude", ability: 'rockhead', moves: ['stealthrock'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: "Xatu", ability: 'magicbounce', moves: ['fly'] },
			{ species: "Charmander", ability: 'blaze', moves: ['sleeptalk'] },
		] });
		battle.makeChoices('auto', 'auto');
		assert.statStage(battle.p1.active[0], 'atk', 0);
		assert.statStage(battle.p2.active[0], 'atk', 0);
		assert(battle.p1.sideConditions['stealthrock']);
		assert.false(battle.p2.sideConditions['stealthrock']);
	});
});
