'use strict';

/**
 * Battle UI Tags Test
 * Tests that weather, terrain, and field effect tags are properly generated
 */

const assert = require('assert').strict;

describe('RPG Battle UI Tags', function () {
	this.timeout(10000);

	let html, core;

	before(function () {
		try {
			html = require('../../dist/impulse/chat-plugins/rpg-wip/html');
			core = require('../../dist/impulse/chat-plugins/rpg-wip/core');
		} catch (e) {
			console.log('Required modules not found, skipping battle UI tag tests:', e.message);
			this.skip();
		}
	});

	describe('Battle Conditions Tags', () => {
		let player, battle;

		beforeEach(() => {
			// Create a test player with a Pokemon
			player = core.getPlayerData('uitagstestuser');
			player.party = [core.createPokemon('pikachu', 10)];
			player.location = 'startertown';
		});

		it('should generate weather tags for sunny weather', () => {
			// Create a simple battle state with weather
			battle = {
				playerId: player.id,
				turn: 1,
				playerSlots: [{
					pokemon: player.party[0],
					statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
					status: null,
					sleepCounter: 0,
					isConfused: false,
					confusionCounter: 0,
					isProtected: false,
					protectSuccessCounter: 0,
					willFlinch: false,
					isLoafing: false,
					isTrapped: null,
					tauntTurns: 0,
					isSeeded: false,
					hasNightmare: false,
					isCursed: false,
					activeTurns: 0,
				}],
				opponentSlots: [{
					pokemon: core.createPokemon('rattata', 5),
					statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
					status: null,
					sleepCounter: 0,
					isConfused: false,
					confusionCounter: 0,
					isProtected: false,
					protectSuccessCounter: 0,
					willFlinch: false,
					isLoafing: false,
					isTrapped: null,
					tauntTurns: 0,
					isSeeded: false,
					hasNightmare: false,
					isCursed: false,
					activeTurns: 0,
				}],
				playerHazards: [],
				opponentHazards: [],
				weather: { type: 'sun', turns: 5 },
				trickRoomTurns: 0,
				magicRoomTurns: 0,
				wonderRoomTurns: 0,
				gravityTurns: 0,
				mudSportTurns: 0,
				waterSportTurns: 0,
				fairyLockTurns: 0,
				ionDelugeTurns: 0,
				playerQuickGuard: false,
				opponentQuickGuard: false,
				playerWideGuard: false,
				opponentWideGuard: false,
				playerCraftyShield: false,
				opponentCraftyShield: false,
				playerReflectTurns: 0,
				opponentReflectTurns: 0,
				playerLightScreenTurns: 0,
				opponentLightScreenTurns: 0,
				playerAuroraVeilTurns: 0,
				opponentAuroraVeilTurns: 0,
				playerTerastallizeUsed: false,
				opponentTerastallizeUsed: false,
				battleType: 'wild',
				opponentName: 'Wild',
				opponentParty: [],
				opponentMoney: 0,
				battleLog: [],
				pendingActions: {},
			};

			const battleHTML = html.generateBattleHTML(battle);

			// Check that the HTML contains weather tag integrated with Pokemon status
			assert(battleHTML.includes('Sunny'), 'Battle HTML should contain "Sunny" weather tag');
			assert(!battleHTML.includes('Battle Conditions'), 'Battle HTML should NOT have separate Battle Conditions section');
		});

		it('should generate terrain tags for Electric Terrain', () => {
			// Create battle with terrain
			battle = {
				playerId: player.id,
				turn: 1,
				playerSlots: [{
					pokemon: player.party[0],
					statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
					status: null,
					sleepCounter: 0,
					isConfused: false,
					confusionCounter: 0,
					isProtected: false,
					protectSuccessCounter: 0,
					willFlinch: false,
					isLoafing: false,
					isTrapped: null,
					tauntTurns: 0,
					isSeeded: false,
					hasNightmare: false,
					isCursed: false,
					activeTurns: 0,
				}],
				opponentSlots: [{
					pokemon: core.createPokemon('rattata', 5),
					statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
					status: null,
					sleepCounter: 0,
					isConfused: false,
					confusionCounter: 0,
					isProtected: false,
					protectSuccessCounter: 0,
					willFlinch: false,
					isLoafing: false,
					isTrapped: null,
					tauntTurns: 0,
					isSeeded: false,
					hasNightmare: false,
					isCursed: false,
					activeTurns: 0,
				}],
				playerHazards: [],
				opponentHazards: [],
				terrain: { type: 'electric', turns: 5 },
				trickRoomTurns: 0,
				magicRoomTurns: 0,
				wonderRoomTurns: 0,
				gravityTurns: 0,
				mudSportTurns: 0,
				waterSportTurns: 0,
				fairyLockTurns: 0,
				ionDelugeTurns: 0,
				playerQuickGuard: false,
				opponentQuickGuard: false,
				playerWideGuard: false,
				opponentWideGuard: false,
				playerCraftyShield: false,
				opponentCraftyShield: false,
				playerReflectTurns: 0,
				opponentReflectTurns: 0,
				playerLightScreenTurns: 0,
				opponentLightScreenTurns: 0,
				playerAuroraVeilTurns: 0,
				opponentAuroraVeilTurns: 0,
				playerTerastallizeUsed: false,
				opponentTerastallizeUsed: false,
				battleType: 'wild',
				opponentName: 'Wild',
				opponentParty: [],
				opponentMoney: 0,
				battleLog: [],
				pendingActions: {},
			};

			const battleHTML = html.generateBattleHTML(battle);

			// Check that the HTML contains terrain tag
			assert(battleHTML.includes('Electric Terrain'), 'Battle HTML should contain "Electric Terrain" tag');
		});

		it('should generate field effect tags for Trick Room', () => {
			// Create battle with field effect
			battle = {
				playerId: player.id,
				turn: 1,
				playerSlots: [{
					pokemon: player.party[0],
					statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
					status: null,
					sleepCounter: 0,
					isConfused: false,
					confusionCounter: 0,
					isProtected: false,
					protectSuccessCounter: 0,
					willFlinch: false,
					isLoafing: false,
					isTrapped: null,
					tauntTurns: 0,
					isSeeded: false,
					hasNightmare: false,
					isCursed: false,
					activeTurns: 0,
				}],
				opponentSlots: [{
					pokemon: core.createPokemon('rattata', 5),
					statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
					status: null,
					sleepCounter: 0,
					isConfused: false,
					confusionCounter: 0,
					isProtected: false,
					protectSuccessCounter: 0,
					willFlinch: false,
					isLoafing: false,
					isTrapped: null,
					tauntTurns: 0,
					isSeeded: false,
					hasNightmare: false,
					isCursed: false,
					activeTurns: 0,
				}],
				playerHazards: [],
				opponentHazards: [],
				trickRoomTurns: 4,
				magicRoomTurns: 0,
				wonderRoomTurns: 0,
				gravityTurns: 0,
				mudSportTurns: 0,
				waterSportTurns: 0,
				fairyLockTurns: 0,
				ionDelugeTurns: 0,
				playerQuickGuard: false,
				opponentQuickGuard: false,
				playerWideGuard: false,
				opponentWideGuard: false,
				playerCraftyShield: false,
				opponentCraftyShield: false,
				playerReflectTurns: 0,
				opponentReflectTurns: 0,
				playerLightScreenTurns: 0,
				opponentLightScreenTurns: 0,
				playerAuroraVeilTurns: 0,
				opponentAuroraVeilTurns: 0,
				playerTerastallizeUsed: false,
				opponentTerastallizeUsed: false,
				battleType: 'wild',
				opponentName: 'Wild',
				opponentParty: [],
				opponentMoney: 0,
				battleLog: [],
				pendingActions: {},
			};

			const battleHTML = html.generateBattleHTML(battle);

			// Check that the HTML contains field effect tag
			assert(battleHTML.includes('Trick Room'), 'Battle HTML should contain "Trick Room" tag');
		});

		it('should show side effects like Reflect and hazards', () => {
			// Create battle with side effects
			battle = {
				playerId: player.id,
				turn: 1,
				playerSlots: [{
					pokemon: player.party[0],
					statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
					status: null,
					sleepCounter: 0,
					isConfused: false,
					confusionCounter: 0,
					isProtected: false,
					protectSuccessCounter: 0,
					willFlinch: false,
					isLoafing: false,
					isTrapped: null,
					tauntTurns: 0,
					isSeeded: false,
					hasNightmare: false,
					isCursed: false,
					activeTurns: 0,
				}],
				opponentSlots: [{
					pokemon: core.createPokemon('rattata', 5),
					statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
					status: null,
					sleepCounter: 0,
					isConfused: false,
					confusionCounter: 0,
					isProtected: false,
					protectSuccessCounter: 0,
					willFlinch: false,
					isLoafing: false,
					isTrapped: null,
					tauntTurns: 0,
					isSeeded: false,
					hasNightmare: false,
					isCursed: false,
					activeTurns: 0,
				}],
				playerHazards: ['stealthrock'],
				opponentHazards: [],
				trickRoomTurns: 0,
				magicRoomTurns: 0,
				wonderRoomTurns: 0,
				gravityTurns: 0,
				mudSportTurns: 0,
				waterSportTurns: 0,
				fairyLockTurns: 0,
				ionDelugeTurns: 0,
				playerQuickGuard: false,
				opponentQuickGuard: false,
				playerWideGuard: false,
				opponentWideGuard: false,
				playerCraftyShield: false,
				opponentCraftyShield: false,
				playerReflectTurns: 5,
				opponentReflectTurns: 0,
				playerLightScreenTurns: 0,
				opponentLightScreenTurns: 0,
				playerAuroraVeilTurns: 0,
				opponentAuroraVeilTurns: 0,
				playerTerastallizeUsed: false,
				opponentTerastallizeUsed: false,
				battleType: 'wild',
				opponentName: 'Wild',
				opponentParty: [],
				opponentMoney: 0,
				battleLog: [],
				pendingActions: {},
			};

			const battleHTML = html.generateBattleHTML(battle);

			// Check that the HTML contains side effect tags
			assert(battleHTML.includes('Reflect'), 'Battle HTML should contain "Reflect" tag');
			assert(battleHTML.includes('SR'), 'Battle HTML should contain "SR" (Stealth Rock) tag');
		});
	});
});
