'use strict';

const assert = require('../assert');
const common = require('../common');
const DraftFactory = require('../../dist/data/draft-factory').default;

let battle;

describe.only('Draft Factory', () => {
	afterEach(() => battle.destroy());

	it('should only allow the designated Tera Captains to Terastallize', () => {
		battle = common.createBattle({formatid: 'gen9draftfactory'});
		// Manually create a team generator instance and rig it with data
		battle.teamGenerator = new DraftFactory(battle.format, null);
		battle.teamGenerator.swapTeams = false;
		battle.teamGenerator.matchup = [
			[
				{
					species: 'Furret',
					ability: 'keeneye',
					moves: ['sleeptalk'],
					teraCaptain: true,
					teraType: 'Normal',
				},
				{
					species: 'Ampharos',
					ability: 'static',
					moves: ['sleeptalk'],
				},
			],
			[
				{
					species: 'Nincada',
					ability: 'compoundeyes',
					moves: ['sleeptalk'],
				},
				{
					species: 'Marshtomp',
					ability: 'torrent',
					moves: ['sleeptalk'],
					teraCaptain: true,
					teraType: 'Fighting',
				},
			],
		];
		battle.setPlayer('p1', {});
		battle.setPlayer('p2', {});
		battle.makeChoices(); // team preview
		assert.throws(() => { battle.choose('p2', 'move 1 terastallize'); }, `${battle.p2.pokemon[0].name} should not be able to tera`);
		battle.makeChoices('move 1 terastallize', 'switch 2');
		battle.makeChoices('auto', 'move 1 terastallize');
	});
});
