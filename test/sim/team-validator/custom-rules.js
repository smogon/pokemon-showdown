'use strict';

const assert = require('assert').strict;
const TeamValidator = require('../../../sim/team-validator').TeamValidator;

describe("Custom Rules", function () {
	it('should support legality tags', function () {
		let team = [
			{species: 'kitsunoh', ability: 'frisk', moves: ['shadowstrike'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);
		illegal = TeamValidator.get('gen7anythinggoes@@@+cap').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'pikachu', ability: 'airlock', moves: ['thunderbolt'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);
		illegal = TeamValidator.get('gen7ou@@@!obtainableabilities').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'pikachu', ability: 'airlock', moves: ['dragondance'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7ou@@@!obtainableabilities').validateTeam(team);
		assert(illegal);
	});

	it('should allow Pokemon to be banned', function () {
		let team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes@@@-Pikachu').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'greninja', ability: 'battlebond', moves: ['surf'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes@@@-Greninja-Ash').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'greninja', ability: 'battlebond', moves: ['surf'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes@@@!Obtainable Formes,-Greninja-Ash').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should allow Pokemon to be unbanned', function () {
		const team = [
			{species: 'blaziken', ability: 'blaze', moves: ['skyuppercut'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7ou@@@+Blaziken').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should allow Pokemon to be whitelisted', function () {
		let team = [
			{species: 'giratina', ability: 'pressure', moves: ['protect'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7ubers@@@-allpokemon,+giratinaaltered').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'giratinaorigin', ability: 'levitate', moves: ['protect'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7ubers@@@-allpokemon,+giratinaaltered').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'tyrantrum', ability: 'strongjaw', moves: ['protect'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8nationaldex@@@-allpokemon').validateTeam(team);
		assert(illegal);
	});

	it('should support banning/unbanning tag combinations', function () {
		let team = [
			{species: 'Crucibelle-Mega', ability: 'Regenerator', moves: ['protect'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen8customgame@@@-nonexistent,+mega').validateTeam(team);
		assert(illegal, "Nonexistent should override all tags that aren't existence-related");

		team = [
			{species: 'Crucibelle-Mega', ability: 'Regenerator', moves: ['protect'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8customgame@@@+mega,-nonexistent').validateTeam(team);
		assert(illegal, "Nonexistent should override all tags that aren't existence-related");

		team = [
			{species: 'Crucibelle-Mega', ability: 'Regenerator', moves: ['protect'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8customgame@@@-nonexistent,+crucibellemega').validateTeam(team);
		assert.equal(illegal, null, "Nonexistent should override all tags that aren't existence-related");

		team = [
			{species: 'Moltres-Galar', ability: 'Berserk', moves: ['protect'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8customgame@@@-sublegendary').validateTeam(team);
		assert(illegal);
	});

	it('should support restrictions', function () {
		let team = [
			{species: 'Yveltal', ability: 'No Ability', moves: ['protect'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7customgame@@@limitonerestricted,*restrictedlegendary').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'Yveltal', ability: 'No Ability', moves: ['protect'], evs: {hp: 1}},
			{species: 'Xerneas', ability: 'No Ability', moves: ['protect'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7customgame@@@limitonerestricted,*restrictedlegendary').validateTeam(team);
		assert(illegal);
	});

	it('should allow moves to be banned', function () {
		const team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7anythinggoes@@@-Agility').validateTeam(team);
		assert(illegal);
	});

	it('should allow moves to be unbanned', function () {
		const team = [
			{species: 'absol', ability: 'pressure', moves: ['batonpass'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7ou@@@+Baton Pass').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should allow items to be banned', function () {
		let team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], item: 'lightball', evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes@@@-Light Ball').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], item: 'lightball', evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes@@@-noitem').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes@@@-noitem').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes@@@-allitems').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should allow items to be unbanned', function () {
		const team = [
			{species: 'eevee', ability: 'runaway', moves: ['tackle'], item: 'eeviumz', evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7lc@@@+Eevium Z').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should allow abilities to be banned', function () {
		const team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7anythinggoes@@@-Static').validateTeam(team);
		assert(illegal);
	});

	it('should allow abilities to be unbanned', function () {
		const team = [
			{species: 'wobbuffet', ability: 'shadowtag', moves: ['counter'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7ou@@@+Shadow Tag').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should allow complex bans to be added', function () {
		let team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes@@@-Pikachu + Agility').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'smeargle', ability: 'owntempo', moves: ['gravity'], evs: {hp: 1}},
			{species: 'pikachu', ability: 'static', moves: ['thunderbolt'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7doublesou@@@-Gravity ++ Thunderbolt').validateTeam(team);
		assert(illegal);
	});

	it('should allow complex bans to be altered', function () {
		let team = [
			{species: 'smeargle', ability: 'owntempo', moves: ['gravity'], evs: {hp: 1}},
			{species: 'abomasnow', ability: 'snowwarning', moves: ['grasswhistle'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7doublesou@@@-Gravity ++ Grass Whistle > 2').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'smeargle', ability: 'owntempo', moves: ['gravity'], evs: {hp: 1}},
			{species: 'abomasnow', ability: 'snowwarning', moves: ['grasswhistle'], evs: {hp: 1}},
			{species: 'cacturne', ability: 'sandveil', moves: ['grasswhistle'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7doublesou@@@-Gravity ++ Grass Whistle > 2').validateTeam(team);
		assert(illegal);
	});

	it('should allow complex bans to be removed', function () {
		const team = [
			{species: 'smeargle', ability: 'owntempo', moves: ['gravity'], evs: {hp: 1}},
			{species: 'abomasnow', ability: 'snowwarning', moves: ['grasswhistle'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7doublesou@@@+Gravity ++ Grass Whistle').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should allow rule bundles to be removed', function () {
		const team = [
			{species: 'azumarill', ability: 'hugepower', moves: ['waterfall'], evs: {hp: 1}},
			{species: 'azumarill', ability: 'hugepower', moves: ['waterfall'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7ou@@@!Standard').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should allow rule bundles to be overridden', function () {
		const team = [
			{species: 'charizard-mega-y', ability: 'drought', item: 'charizarditey', moves: ['wingattack'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7customgame@@@Standard').validateTeam(team);
		assert.equal(illegal, null);
	});
});
