'use strict';

const assert = require('../../assert');
const Dex = require('../../../dist/sim/dex').Dex;

describe("Custom Rules", () => {
	it('should support legality tags', () => {
		let team = [
			{ species: 'kitsunoh', ability: 'frisk', moves: ['shadowstrike'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7anythinggoes');
		assert.legalTeam(team, 'gen7anythinggoes@@@+cap');

		team = [
			{ species: 'pikachu', ability: 'airlock', moves: ['thunderbolt'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7anythinggoes');
		assert.legalTeam(team, 'gen7ou@@@!obtainableabilities');

		team = [
			{ species: 'pikachu', ability: 'airlock', moves: ['dragondance'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7ou@@@!obtainableabilities');
	});

	it('should allow Pokemon to be banned', () => {
		let team = [
			{ species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7anythinggoes@@@-Pikachu');

		team = [
			{ species: 'greninjaash', ability: 'battlebond', moves: ['surf'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7anythinggoes@@@-Greninja-Bond');

		team = [
			{ species: 'greninjabond', ability: 'battlebond', moves: ['surf'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7anythinggoes@@@!Obtainable Formes,-Greninja-Ash');
	});

	it('should allow Pokemon to be unbanned', () => {
		const team = [
			{ species: 'blaziken', ability: 'blaze', moves: ['skyuppercut'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7ou@@@+Blaziken');
	});

	it('should allow Pokemon to be whitelisted', () => {
		let team = [
			{ species: 'giratina', ability: 'pressure', moves: ['protect'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7ubers@@@-allpokemon,+giratinaaltered');

		team = [
			{ species: 'giratinaorigin', ability: 'levitate', moves: ['protect'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7ubers@@@-allpokemon,+giratinaaltered');

		// -allpokemon should override +past
		team = [
			{ species: 'tyrantrum', ability: 'strongjaw', moves: ['protect'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen8nationaldex@@@-allpokemon');

		// +pikachu should not override -past
		team = [
			{ species: 'pikachu-belle', ability: 'lightningrod', moves: ['thunderbolt'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7ou@@@-allpokemon,+pikachu');
	});

	it('should allow Pokemon to be force-whitelisted', () => {
		// -allpokemon should override +cloyster before it, but not after it
		let team = [
			{ species: 'cloyster', ability: 'skilllink', moves: ['iciclespear'], evs: { hp: 1 } },
		];

		assert.legalTeam(team, 'gen5monotype');
		assert.false.legalTeam(team, 'gen5monotype@@@-allpokemon');
		assert.throws(() => Dex.formats.validate('gen5monotype@@@+cloyster,-allpokemon'));
		assert.legalTeam(team, 'gen5monotype@@@-allpokemon,+cloyster');

		team = [
			{ species: 'pikachu', ability: 'lightningrod', moves: ['thunderbolt'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen9ou@@@-allpokemon,+pikachu');
		assert.throws(() => Dex.formats.validate('gen9ou@@@+pikachu,-allpokemon'));

		team = [
			{ species: 'zygarde-10', ability: 'aurabreak', moves: ['bodyslam'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen9nationaldex@@@-allpokemon,+zygarde10');
	});

	it('should warn when rules do nothing', () => {
		assert.throws(() => Dex.formats.validate('gen9anythinggoes@@@obtainable'));
		Dex.formats.validate('gen9anythinggoes@@@!obtainable');

		assert.throws(() => Dex.formats.validate('gen9customgame@@@!obtainable'));
		Dex.formats.validate('gen9customgame@@@obtainable');

		assert.throws(() => Dex.formats.validate('gen9customgame@@@+cloyster,-allpokemon'));
		Dex.formats.validate('gen9customgame@@@-allpokemon,+cloyster');
	});

	it('should support banning/unbanning tag combinations', () => {
		let team = [
			{ species: 'Crucibelle-Mega', ability: 'Regenerator', moves: ['protect'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen8customgame@@@-nonexistent,+mega',
			"Nonexistent should override all tags that aren't existence-related");

		team = [
			{ species: 'Crucibelle-Mega', ability: 'Regenerator', moves: ['protect'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen8customgame@@@+mega,-nonexistent',
			"Nonexistent should override all tags that aren't existence-related");

		team = [
			{ species: 'Crucibelle-Mega', ability: 'Regenerator', moves: ['protect'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen8customgame@@@-nonexistent,+crucibellemega',
			"Nonexistent should override all tags that aren't existence-related");

		team = [
			{ species: 'Moltres-Galar', ability: 'Berserk', moves: ['protect'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen8customgame@@@-sublegendary');
	});

	it('should support restrictions', () => {
		let team = [
			{ species: 'Yveltal', ability: 'No Ability', moves: ['protect'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7customgame@@@limitonerestricted,*restrictedlegendary');

		team = [
			{ species: 'Yveltal', ability: 'No Ability', moves: ['protect'], evs: { hp: 1 } },
			{ species: 'Xerneas', ability: 'No Ability', moves: ['protect'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7customgame@@@limitonerestricted,*restrictedlegendary');
	});

	it('should allow moves to be banned', () => {
		const team = [
			{ species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7anythinggoes@@@-Agility');
	});

	it('should allow moves to be unbanned', () => {
		const team = [
			{ species: 'absol', ability: 'pressure', moves: ['batonpass'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7ou@@@+Baton Pass');
	});

	it('should allow items to be banned', () => {
		let team = [
			{ species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], item: 'lightball', evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7anythinggoes@@@-Light Ball');

		team = [
			{ species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], item: 'lightball', evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7anythinggoes@@@-noitem');

		team = [
			{ species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7anythinggoes@@@-noitem');

		team = [
			{ species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7anythinggoes@@@-allitems');
	});

	it('should allow items to be unbanned', () => {
		const team = [
			{ species: 'eevee', ability: 'runaway', moves: ['tackle'], item: 'eeviumz', evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7lc@@@+Eevium Z');
	});

	it('should allow abilities to be banned', () => {
		const team = [
			{ species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7anythinggoes@@@-Static');
	});

	it('should allow abilities to be unbanned', () => {
		const team = [
			{ species: 'wobbuffet', ability: 'shadowtag', moves: ['counter'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7ou@@@+Shadow Tag');
	});

	it('should allow complex bans to be added', () => {
		let team = [
			{ species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7anythinggoes@@@-Pikachu + Agility');

		team = [
			{ species: 'smeargle', ability: 'owntempo', moves: ['gravity'], evs: { hp: 1 } },
			{ species: 'pikachu', ability: 'static', moves: ['thunderbolt'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7doublesou@@@-Gravity ++ Thunderbolt');
	});

	it('should allow complex bans to be altered', () => {
		let team = [
			{ species: 'smeargle', ability: 'owntempo', moves: ['gravity'], evs: { hp: 1 } },
			{ species: 'abomasnow', ability: 'snowwarning', moves: ['grasswhistle'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7doublesou@@@-Gravity ++ Grass Whistle > 2');

		team = [
			{ species: 'smeargle', ability: 'owntempo', moves: ['gravity'], evs: { hp: 1 } },
			{ species: 'abomasnow', ability: 'snowwarning', moves: ['grasswhistle'], evs: { hp: 1 } },
			{ species: 'cacturne', ability: 'sandveil', moves: ['grasswhistle'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7doublesou@@@-Gravity ++ Grass Whistle > 2');
	});

	it('should allow complex bans to be removed', () => {
		const team = [
			{ species: 'smeargle', ability: 'owntempo', moves: ['gravity'], evs: { hp: 1 } },
			{ species: 'abomasnow', ability: 'snowwarning', moves: ['grasswhistle'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7doublesou@@@+Gravity ++ Grass Whistle');
	});

	it('should allow rule bundles to be removed', () => {
		const team = [
			{ species: 'azumarill', ability: 'hugepower', moves: ['waterfall'], evs: { hp: 1 } },
			{ species: 'azumarill', ability: 'hugepower', moves: ['waterfall'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7ou@@@!Standard');
	});

	it('should allow rule bundles to be overridden', () => {
		const team = [
			{ species: 'charizard-mega-y', ability: 'drought', item: 'charizarditey', moves: ['wingattack'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7customgame@@@Standard');
	});
});
