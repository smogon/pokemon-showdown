'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Aromatherapy', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should heal the major status conditions of the user's team`, () => {
		battle = common.createBattle([[
			{ species: 'Dunsparce', moves: ['sleeptalk'] },
			{ species: 'Chansey', moves: ['aromatherapy'] },
		], [
			{ species: 'Nidoking', moves: ['toxic', 'glare'] },
		]]);
		battle.makeChoices('auto', 'move glare');
		battle.makeChoices('switch chansey', 'auto');
		battle.makeChoices();
		assert.equal(battle.p1.pokemon[0].status, '');
		assert.equal(battle.p1.pokemon[1].status, '');
	});

	it(`should not heal the major status conditions of a Pokemon with Sap Sipper`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Azumarill', ability: 'sapsipper', moves: ['sleeptalk'] },
			{ species: 'Chansey', moves: ['sleeptalk', 'aromatherapy'] },
		], [
			{ species: 'Nidoking', moves: ['sleeptalk', 'toxic'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('auto', 'move toxic 1, move sleeptalk');
		battle.makeChoices('move sleeptalk, move aromatherapy', 'auto');
		assert.equal(battle.p1.pokemon[0].status, 'tox');
	});

	it(`should not heal the major status conditions of a Pokemon behind a Substitute`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Azumarill', moves: ['sleeptalk', 'substitute'] },
			{ species: 'Chansey', moves: ['sleeptalk', 'aromatherapy'] },
		], [
			{ species: 'Nidoking', moves: ['sleeptalk', 'toxic'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move substitute, move sleeptalk', 'move toxic 1, move sleeptalk');
		battle.makeChoices('move sleeptalk, move aromatherapy', 'move sleeptalk, move sleeptalk');
		assert.equal(battle.p1.pokemon[0].status, 'tox');
	});

	describe('[Gen 5]', () => {
		it(`should heal the major status conditions of a Pokemon with Sap Sipper`, () => {
			battle = common.gen(5).createBattle({ gameType: 'doubles' }, [[
				{ species: 'Azumarill', ability: 'sapsipper', moves: ['sleeptalk'] },
				{ species: 'Chansey', moves: ['sleeptalk', 'aromatherapy'] },
			], [
				{ species: 'Nidoking', moves: ['sleeptalk', 'toxic'] },
				{ species: 'Wynaut', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('auto', 'move toxic 1, move sleeptalk');
			battle.makeChoices('move sleeptalk, move aromatherapy', 'auto');
			assert.equal(battle.p1.pokemon[0].status, '');
		});

		it(`should heal the major status conditions of a Pokemon behind a Substitute`, () => {
			battle = common.gen(5).createBattle({ gameType: 'doubles' }, [[
				{ species: 'Azumarill', moves: ['sleeptalk', 'substitute'] },
				{ species: 'Chansey', moves: ['sleeptalk', 'aromatherapy'] },
			], [
				{ species: 'Nidoking', moves: ['sleeptalk', 'toxic'] },
				{ species: 'Wynaut', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('move substitute, move sleeptalk', 'move toxic 1, move sleeptalk');
			battle.makeChoices('move sleeptalk, move aromatherapy', 'move sleeptalk, move sleeptalk');
			assert.equal(battle.p1.pokemon[0].status, '');
		});
	});
});
