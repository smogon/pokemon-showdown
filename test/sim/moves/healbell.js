'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Heal Bell', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should heal the major status conditions of the user's team`, () => {
		battle = common.createBattle([[
			{ species: 'Dunsparce', moves: ['sleeptalk'] },
			{ species: 'Chansey', moves: ['healbell'] },
		], [
			{ species: 'Nidoking', moves: ['toxic', 'glare'] },
		]]);

		battle.makeChoices('auto', 'move glare');
		battle.makeChoices('switch chansey', 'auto');
		battle.makeChoices();
		assert.equal(battle.p1.pokemon[0].status, '');
		assert.equal(battle.p1.pokemon[1].status, '');
	});

	it(`should not heal the major status conditions of a Pokemon with Soundproof`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Kommo-o', ability: 'soundproof', moves: ['sleeptalk'] },
			{ species: 'Chansey', moves: ['sleeptalk', 'healbell'] },
		], [
			{ species: 'Nidoking', moves: ['sleeptalk', 'toxic'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('auto', 'move toxic 1, move sleeptalk');
		battle.makeChoices('move sleeptalk, move healbell', 'auto');
		assert.equal(battle.p1.pokemon[0].status, 'tox');
	});

	it(`with Mold Breaker should heal the major status conditions of a Pokemon with Soundproof`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Kommo-o', ability: 'soundproof', moves: ['sleeptalk'] },
			{ species: 'Excadrill', ability: 'moldbreaker', moves: ['healbell'] },
		], [
			{ species: 'Nidoking', moves: ['sleeptalk', 'toxic'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('auto', 'move toxic 1, move sleeptalk');
		battle.makeChoices('move sleeptalk, move healbell', 'auto');
		assert.equal(battle.p1.pokemon[0].status, '');
	});

	it(`in a Multi Battle, should heal the major status conditions of the ally's team`, () => {
		battle = common.createBattle({ gameType: 'multi' }, [[
			{ species: 'Machamp', ability: 'noguard', moves: ['poisongas'] },
		], [
			{ species: 'Cubone', moves: ['sleeptalk'] },
			{ species: 'Diggersby', moves: ['sleeptalk'] },
		], [
			{ species: 'Marowak', moves: ['sleeptalk'] },
		], [
			{ species: 'Wynaut', moves: ['sleeptalk', 'healbell'] },
		]]);

		battle.makeChoices();
		battle.makeChoices('auto', 'switch diggersby', 'auto', 'move healbell');
		assert.equal(battle.p2.pokemon[0].status, '', `Cubone should not be poisoned.`);
		assert.equal(battle.p2.pokemon[1].status, '', `Diggersby should not be poisoned.`);
		assert.equal(battle.p4.pokemon[0].status, '', `Wynaut should not be poisoned.`);

		// Heal Bell should work from both p2 and p4
		battle = common.createBattle({ gameType: 'multi' }, [[
			{ species: 'Machamp', ability: 'noguard', moves: ['poisongas'] },
		], [
			{ species: 'Wynaut', moves: ['sleeptalk', 'healbell'] },
		], [
			{ species: 'Marowak', moves: ['sleeptalk'] },
		], [
			{ species: 'Cubone', moves: ['sleeptalk'] },
			{ species: 'Diggersby', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		battle.makeChoices('auto', 'move healbell', 'auto', 'switch diggersby');
		assert.equal(battle.p4.pokemon[0].status, '', `Cubone should not be poisoned.`);
		assert.equal(battle.p4.pokemon[1].status, '', `Diggersby should not be poisoned.`);
		assert.equal(battle.p2.pokemon[0].status, '', `Wynaut should not be poisoned.`);
	});

	it(`in a Free-For-All, should heal the major status conditions of the user's team, and not any opposing teams`, () => {
		battle = common.createBattle({ gameType: 'freeforall' }, [[
			{ species: 'Machamp', ability: 'noguard', moves: ['poisongas'] },
		], [
			{ species: 'Marowak', moves: ['sleeptalk'] },
		], [
			{ species: 'Cubone', moves: ['sleeptalk'] },
		], [
			{ species: 'Wynaut', moves: ['healbell'] },
		]]);

		battle.makeChoices();
		assert.equal(battle.p2.active[0].status, 'psn');
		assert.equal(battle.p3.active[0].status, 'psn');
		assert.equal(battle.p4.active[0].status, '');
	});
});
