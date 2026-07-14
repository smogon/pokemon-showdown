'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Shared Power request data', () => {
	afterEach(() => battle.destroy());

	it('should include sharedAbilities in request data', () => {
		battle = common.createBattle({ formatid: 'gen9randombattlesharedpowerb12p6' }, [[
			{ species: 'Arcanine', ability: 'intimidate', moves: ['sleeptalk'] },
			{ species: 'Medicham', ability: 'purepower', moves: ['sleeptalk'] },
			{ species: 'Inteleon', ability: 'torrent', moves: ['sleeptalk'] },
			{ species: 'Delphox', ability: 'blaze', moves: ['sleeptalk'] },
			{ species: 'Oranguru', ability: 'innerfocus', moves: ['sleeptalk'] },
			{ species: 'Ariados', ability: 'insomnia', moves: ['sleeptalk'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
			{ species: 'Mew', ability: 'synchronize', moves: ['sleeptalk'] },
			{ species: 'Pikachu', ability: 'static', moves: ['sleeptalk'] },
			{ species: 'Eevee', ability: 'runaway', moves: ['sleeptalk'] },
			{ species: 'Ditto', ability: 'limber', moves: ['transform'] },
			{ species: 'Snorlax', ability: 'immunity', moves: ['sleeptalk'] },
		]]);

		// Team preview: no shared abilities yet
		const previewRequest = battle.p1.activeRequest;
		assert(previewRequest.teamPreview);
		assert.deepEqual(previewRequest.side.pokemon[0].sharedAbilities, []);

		battle.makeChoices('team 123456', 'team 123456');
		battle.makeChoices('switch 2', 'move sleeptalk');

		// After switching in Medicham, it should share Arcanine's Intimidate
		const switchedIn = battle.p1.activeRequest.side.pokemon[0];
		assert.equal(switchedIn.baseAbility, 'purepower');
		assert.deepEqual(switchedIn.sharedAbilities, ['intimidate']);
	});
});
