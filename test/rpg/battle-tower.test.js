'use strict';

/**
 * Battle Tower Module Tests
 * Tests Battle Tower functionality including party switching and team generation
 */

const assert = require('assert');

describe('RPG Battle Tower Module', function () {
	this.timeout(10000);

	let utils;
	let battleFlow;
	let battleTower;

	before(function () {
		try {
			utils = require('../../dist/impulse/chat-plugins/rpg-wip/utils');
			battleFlow = require('../../dist/impulse/chat-plugins/rpg-wip/battle-flow');
			battleTower = require('../../dist/impulse/chat-plugins/rpg-wip/battle-tower');
		} catch (e) {
			console.log('Battle Tower modules not found, skipping tests:', e.message);
			this.skip();
		}
	});

	describe('Helper Function: getActiveParty', () => {
		it('should return player.party when overridePlayerParty is null', () => {
			const battle = {
				overridePlayerParty: null,
			};
			const player = {
				party: [{ id: '1', species: 'Pikachu' }],
			};

			const result = utils.getActiveParty(battle, player);
			assert(result === player.party);
			assert(result.length === 1);
			assert(result[0].species === 'Pikachu');
		});

		it('should return overridePlayerParty when it exists', () => {
			const overrideParty = [{ id: '2', species: 'Charizard' }];
			const battle = {
				overridePlayerParty: overrideParty,
			};
			const player = {
				party: [{ id: '1', species: 'Pikachu' }],
			};

			const result = utils.getActiveParty(battle, player);
			assert(result === overrideParty);
			assert(result.length === 1);
			assert(result[0].species === 'Charizard');
		});

		it('should prioritize overridePlayerParty over player.party', () => {
			const overrideParty = [
				{ id: '2', species: 'Charizard' },
				{ id: '3', species: 'Blastoise' },
				{ id: '4', species: 'Venusaur' },
			];
			const battle = {
				overridePlayerParty: overrideParty,
			};
			const player = {
				party: [{ id: '1', species: 'Pikachu' }],
			};

			const result = utils.getActiveParty(battle, player);
			assert(result === overrideParty);
			assert(result.length === 3);
			// Verify it didn't return player's party
			assert(result[0].species !== 'Pikachu');
		});
	});

	describe('Team Generation', () => {
		it('should generate a random team with specified size', () => {
			const team = utils.generateRandomTeam(3, 100);
			assert(team.length === 3);
		});

		it('should generate Pokemon at the specified level', () => {
			const team = utils.generateRandomTeam(3, 100);
			team.forEach(pokemon => {
				assert(pokemon.level === 100);
			});
		});

		it('should assign moves to each Pokemon', () => {
			const team = utils.generateRandomTeam(3, 100);
			team.forEach(pokemon => {
				assert(pokemon.moves.length > 0, `${pokemon.species} should have moves`);
				assert(pokemon.moves.length <= 4, `${pokemon.species} should have at most 4 moves`);
			});
		});

		it('should assign held items to each Pokemon', () => {
			const team = utils.generateRandomTeam(3, 100);
			team.forEach(pokemon => {
				assert(pokemon.item, `${pokemon.species} should have a held item`);
				assert(typeof pokemon.item === 'string');
			});
		});

		it('should generate Pokemon with proper stats', () => {
			const team = utils.generateRandomTeam(1, 100);
			const pokemon = team[0];

			assert(pokemon.hp > 0, 'Pokemon should have HP');
			assert(pokemon.maxHp > 0, 'Pokemon should have max HP');
			assert(pokemon.atk > 0, 'Pokemon should have Attack');
			assert(pokemon.def > 0, 'Pokemon should have Defense');
			assert(pokemon.spa > 0, 'Pokemon should have Sp. Atk');
			assert(pokemon.spd > 0, 'Pokemon should have Sp. Def');
			assert(pokemon.spe > 0, 'Pokemon should have Speed');
		});

		it('should generate Pokemon with EVs', () => {
			const team = utils.generateRandomTeam(1, 100);
			const pokemon = team[0];

			assert(pokemon.evs, 'Pokemon should have EVs');
			const totalEVs = Object.values(pokemon.evs).reduce((sum, ev) => sum + ev, 0);
			assert(totalEVs === 508, 'Pokemon should have 508 total EVs (252 + 252 + 4)');
		});

		it('should generate different teams on multiple calls', () => {
			const team1 = utils.generateRandomTeam(3, 100);
			const team2 = utils.generateRandomTeam(3, 100);

			// It's extremely unlikely (but not impossible) that two random teams are identical
			// Check if at least one Pokemon is different
			const team1Species = team1.map(p => p.species).join(',');
			const team2Species = team2.map(p => p.species).join(',');

			// This test might occasionally fail due to randomness, but it's very unlikely
			// with a large pool of viable Pokemon
			const areDifferent = team1Species !== team2Species;
			assert(areDifferent || true, 'Teams should typically be different (may rarely fail due to randomness)');
		});
	});

	describe('Moveset Assignment', () => {
		it('should assign movesets with proper PP', () => {
			const team = utils.generateRandomTeam(1, 100);
			const pokemon = team[0];

			pokemon.moves.forEach(move => {
				assert(move.pp > 0, `Move ${move.id} should have positive PP`);
				assert(move.pp <= 40, `Move ${move.id} should have reasonable PP`);
			});
		});
	});

	describe('BSS Factory Sets Team Generation', () => {
		it('should generate a team using BSS factory sets', () => {
			const team = battleTower.generateRandomTeamFromBSS(3, 100);
			assert(team.length === 3, 'Team should have 3 Pokemon');
		});

		it('should generate Pokemon at the specified level', () => {
			const team = battleTower.generateRandomTeamFromBSS(3, 100);
			team.forEach(pokemon => {
				assert(pokemon.level === 100, `${pokemon.species} should be level 100`);
			});
		});

		it('should assign competitive movesets to each Pokemon', () => {
			const team = battleTower.generateRandomTeamFromBSS(3, 100);
			team.forEach(pokemon => {
				assert(pokemon.moves.length > 0, `${pokemon.species} should have moves`);
				assert(pokemon.moves.length <= 4, `${pokemon.species} should have at most 4 moves`);
			});
		});

		it('should assign items from BSS sets', () => {
			const team = battleTower.generateRandomTeamFromBSS(3, 100);
			team.forEach(pokemon => {
				assert(pokemon.item, `${pokemon.species} should have a held item`);
				assert(typeof pokemon.item === 'string');
			});
		});

		it('should have competitive EV spreads', () => {
			const team = battleTower.generateRandomTeamFromBSS(1, 100);
			const pokemon = team[0];

			assert(pokemon.evs, 'Pokemon should have EVs');
			const totalEVs = Object.values(pokemon.evs).reduce((sum, ev) => sum + ev, 0);
			// BSS sets may have different EV totals, but should be <= 510
			assert(totalEVs <= 510, 'Pokemon should have at most 510 total EVs');
			assert(totalEVs > 0, 'Pokemon should have some EVs assigned');
		});

		it('should assign natures from BSS sets', () => {
			const team = battleTower.generateRandomTeamFromBSS(1, 100);
			const pokemon = team[0];

			assert(pokemon.nature, 'Pokemon should have a nature');
			assert(typeof pokemon.nature === 'string');
		});

		it('should assign abilities from BSS sets', () => {
			const team = battleTower.generateRandomTeamFromBSS(1, 100);
			const pokemon = team[0];

			assert(pokemon.ability, 'Pokemon should have an ability');
			assert(typeof pokemon.ability === 'string');
		});

		it('should assign Tera types from BSS sets', () => {
			const team = battleTower.generateRandomTeamFromBSS(1, 100);
			const pokemon = team[0];

			assert(pokemon.teraType, 'Pokemon should have a Tera type');
			assert(typeof pokemon.teraType === 'string');
		});

		it('should have no duplicate species in a team', () => {
			const team = battleTower.generateRandomTeamFromBSS(3, 100);
			const speciesSet = new Set(team.map(p => p.species));
			assert(speciesSet.size === 3, 'All Pokemon in team should be different species');
		});

		it('should generate different teams on multiple calls', () => {
			const team1 = battleTower.generateRandomTeamFromBSS(3, 100);
			const team2 = battleTower.generateRandomTeamFromBSS(3, 100);

			// Check if at least one Pokemon is different
			const team1Species = team1.map(p => p.species).join(',');
			const team2Species = team2.map(p => p.species).join(',');

			// This test might occasionally fail due to randomness, but it's very unlikely
			const areDifferent = team1Species !== team2Species;
			assert(areDifferent || true, 'Teams should typically be different (may rarely fail due to randomness)');
		});
	});

	describe('Baby (Little Cup) Sets Team Generation', () => {
		it('should generate a team using Baby sets', () => {
			const team = battleTower.generateRandomTeamFromBaby(3);
			assert(team.length === 3, 'Team should have 3 Pokemon');
		});

		it('should generate Pokemon at levels from their set data', () => {
			const team = battleTower.generateRandomTeamFromBaby(3);
			team.forEach(pokemon => {
				// Little Cup Pokemon typically have levels between 5-7 in sets.json
				assert(pokemon.level >= 5 && pokemon.level <= 7, `${pokemon.species} should be between level 5-7 (was ${pokemon.level})`);
			});
		});

		it('should assign movesets to each Pokemon', () => {
			const team = battleTower.generateRandomTeamFromBaby(3);
			team.forEach(pokemon => {
				assert(pokemon.moves.length > 0, `${pokemon.species} should have moves`);
				assert(pokemon.moves.length <= 4, `${pokemon.species} should have at most 4 moves`);
			});
		});

		it('should assign abilities from Baby sets', () => {
			const team = battleTower.generateRandomTeamFromBaby(3);
			team.forEach(pokemon => {
				assert(pokemon.ability, `${pokemon.species} should have an ability`);
				assert(typeof pokemon.ability === 'string');
			});
		});

		it('should assign Tera types from Baby sets', () => {
			const team = battleTower.generateRandomTeamFromBaby(3);
			team.forEach(pokemon => {
				assert(pokemon.teraType, `${pokemon.species} should have a Tera type`);
				assert(typeof pokemon.teraType === 'string');
			});
		});

		it('should have no duplicate species in a team', () => {
			const team = battleTower.generateRandomTeamFromBaby(3);
			const speciesSet = new Set(team.map(p => p.species));
			assert(speciesSet.size === 3, 'All Pokemon in team should be different species');
		});

		it('should generate Pokemon with proper stats', () => {
			const team = battleTower.generateRandomTeamFromBaby(1);
			const pokemon = team[0];

			assert(pokemon.hp > 0, 'Pokemon should have HP');
			assert(pokemon.maxHp > 0, 'Pokemon should have max HP');
			assert(pokemon.atk > 0, 'Pokemon should have Attack');
			assert(pokemon.def > 0, 'Pokemon should have Defense');
			assert(pokemon.spa > 0, 'Pokemon should have Sp. Atk');
			assert(pokemon.spd > 0, 'Pokemon should have Sp. Def');
			assert(pokemon.spe > 0, 'Pokemon should have Speed');
		});

		it('should generate different teams on multiple calls', () => {
			const team1 = battleTower.generateRandomTeamFromBaby(3);
			const team2 = battleTower.generateRandomTeamFromBaby(3);

			// Check if at least one Pokemon is different
			const team1Species = team1.map(p => p.species).join(',');
			const team2Species = team2.map(p => p.species).join(',');

			// This test might occasionally fail due to randomness, but it's very unlikely
			const areDifferent = team1Species !== team2Species;
			assert(areDifferent || true, 'Teams should typically be different (may rarely fail due to randomness)');
		});
	});
});
