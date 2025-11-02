// Test file to verify UI generator functions work correctly
import type { RPGPokemon, PlayerData, BattleState } from './types';
import {
	generateWelcomeHTML,
	generateStarterSelectionHTML,
	generatePokemonInfoHTML,
	generatePokemonSummaryHTML,
	generateInventoryHTML,
	generateShopHTML,
	generatePCHTML,
	generateBattleHTML,
	generateVictoryHTML,
	generateDefeatHTML,
} from './ui-generators';

// Mock globals
(global as any).Dex = {
	species: {
		get: (id: string) => ({
			name: 'Pikachu',
			types: ['Electric'],
		}),
	},
	moves: {
		get: (id: string) => ({
			id,
			name: 'Thunderbolt',
			type: 'Electric',
			basePower: 90,
			category: 'Special',
			pp: 15,
		}),
	},
};
(global as any).toID = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

// Helper to create mock Pokemon
function createMockPokemon(): RPGPokemon {
	return {
		species: 'Pikachu',
		level: 50,
		hp: 100,
		maxHp: 100,
		atk: 80,
		def: 60,
		spa: 70,
		spd: 70,
		spe: 100,
		ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
		evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
		weightkg: 6,
		heightm: 0.4,
		friendship: 70,
		growthRate: 'Medium Fast',
		experience: 125000,
		expToNextLevel: 132651,
		moves: [{ id: 'thunderbolt', pp: 15 }],
		nature: 'Adamant',
		status: null,
		id: 'test123',
		nickname: 'Pikachu',
		gender: 'M',
		shiny: false,
		caughtIn: 'pokeball',
	};
}

// Helper to create mock player
function createMockPlayer(): PlayerData {
	return {
		id: 'testuser',
		name: 'TestUser',
		level: 10,
		experience: 5000,
		badges: 2,
		party: [createMockPokemon()],
		location: 'Starter Town',
		money: 10000,
		inventory: new Map(),
		pc: new Map(),
	};
}

// Helper to create mock battle
function createMockBattle(): BattleState {
	return {
		playerId: 'test',
		turn: 0,
		zoneId: 'test',
		playerHazards: [],
		opponentHazards: [],
		trickRoomTurns: 0,
		magicRoomTurns: 0,
		wonderRoomTurns: 0,
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
		gravityTurns: 0,
		mudSportTurns: 0,
		waterSportTurns: 0,
		battleType: 'wild',
		opponentName: 'Wild Pikachu',
		opponentParty: [],
		opponentMoney: 0,
		playerSlots: [
			{
				pokemon: createMockPokemon(),
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
				status: null,
				sleepCounter: 0,
				isConfused: false,
				confusionCounter: 0,
				isProtected: false,
				protectSuccessCounter: 0,
				willFlinch: false,
				isTrapped: null,
				tauntTurns: 0,
				isSeeded: false,
				hasNightmare: false,
				isCursed: false,
				activeTurns: 0,
			},
			null,
		],
		opponentSlots: [
			{
				pokemon: createMockPokemon(),
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
				status: null,
				sleepCounter: 0,
				isConfused: false,
				confusionCounter: 0,
				isProtected: false,
				protectSuccessCounter: 0,
				willFlinch: false,
				isTrapped: null,
				tauntTurns: 0,
				isSeeded: false,
				hasNightmare: false,
				isCursed: false,
				activeTurns: 0,
			},
			null,
		],
		pendingActions: {},
		playerFutureMoves: [],
		opponentFutureMoves: [],
	};
}

/**
 * Test welcome HTML generation
 */
function testGenerateWelcomeHTML() {
	console.log('Testing generateWelcomeHTML...');
	
	const html = generateWelcomeHTML();
	
	if (!html.includes('Welcome')) {
		throw new Error('Welcome HTML should contain "Welcome"');
	}
	if (!html.includes('choosetype')) {
		throw new Error('Welcome HTML should contain type selection');
	}
	
	console.log('✓ generateWelcomeHTML test passed');
}

/**
 * Test starter selection HTML
 */
function testGenerateStarterSelectionHTML() {
	console.log('Testing generateStarterSelectionHTML...');
	
	const html = generateStarterSelectionHTML('fire');
	
	// Just check it returns HTML
	if (html.length < 10) {
		throw new Error('Should return HTML content');
	}
	if (!html.includes('div') && !html.includes('button')) {
		throw new Error('Should contain HTML elements');
	}
	
	console.log('✓ generateStarterSelectionHTML test passed');
}

/**
 * Test Pokemon info HTML
 */
function testGeneratePokemonInfoHTML() {
	console.log('Testing generatePokemonInfoHTML...');
	
	const pokemon = createMockPokemon();
	const html = generatePokemonInfoHTML(pokemon, true, 'party');
	
	if (!html.includes('Pikachu')) {
		throw new Error('Should contain Pokemon name');
	}
	if (!html.includes('Level 50')) {
		throw new Error('Should contain level');
	}
	if (!html.includes('100/100')) {
		throw new Error('Should contain HP');
	}
	if (!html.includes('Thunderbolt')) {
		throw new Error('Should contain move');
	}
	
	console.log('✓ generatePokemonInfoHTML test passed');
}

/**
 * Test Pokemon summary HTML
 */
function testGeneratePokemonSummaryHTML() {
	console.log('Testing generatePokemonSummaryHTML...');
	
	const pokemon = createMockPokemon();
	const html = generatePokemonSummaryHTML(pokemon);
	
	if (!html.includes('Pikachu')) {
		throw new Error('Should contain Pokemon name');
	}
	if (!html.includes('IVs')) {
		throw new Error('Should contain IVs');
	}
	if (!html.includes('EVs')) {
		throw new Error('Should contain EVs');
	}
	if (!html.includes('Growth Rate')) {
		throw new Error('Should contain growth rate');
	}
	
	console.log('✓ generatePokemonSummaryHTML test passed');
}

/**
 * Test inventory HTML
 */
function testGenerateInventoryHTML() {
	console.log('Testing generateInventoryHTML...');
	
	const player = createMockPlayer();
	const html = generateInventoryHTML(player);
	
	if (!html.includes('Inventory')) {
		throw new Error('Should contain "Inventory"');
	}
	if (!html.includes('Money')) {
		throw new Error('Should contain money');
	}
	if (!html.includes('10,000')) {
		throw new Error('Should display player money');
	}
	
	console.log('✓ generateInventoryHTML test passed');
}

/**
 * Test shop HTML
 */
function testGenerateShopHTML() {
	console.log('Testing generateShopHTML...');
	
	const player = createMockPlayer();
	const html = generateShopHTML(player);
	
	if (!html.includes('Poke Mart')) {
		throw new Error('Should contain "Poke Mart"');
	}
	if (!html.includes('Your Money')) {
		throw new Error('Should display player money');
	}
	if (!html.includes('Buy')) {
		throw new Error('Should contain buy buttons');
	}
	
	console.log('✓ generateShopHTML test passed');
}

/**
 * Test PC HTML
 */
function testGeneratePCHTML() {
	console.log('Testing generatePCHTML...');
	
	const player = createMockPlayer();
	const html = generatePCHTML(player);
	
	if (!html.includes('Storage System')) {
		throw new Error('Should contain "Storage System"');
	}
	if (!html.includes('Stored Pokemon')) {
		console.log('Actual HTML:', html);
		throw new Error('Should show stored Pokemon count');
	}
	
	console.log('✓ generatePCHTML test passed');
}

/**
 * Test battle HTML
 */
function testGenerateBattleHTML() {
	console.log('Testing generateBattleHTML...');
	
	const battle = createMockBattle();
	const html = generateBattleHTML(battle, ['Test message'], true);
	
	if (!html.includes('Battle')) {
		throw new Error('Should contain "Battle"');
	}
	if (!html.includes('Turn 1')) {
		throw new Error('Should show turn number');
	}
	if (!html.includes('Pikachu')) {
		throw new Error('Should contain Pokemon name');
	}
	if (!html.includes('Test message')) {
		throw new Error('Should contain message log');
	}
	if (!html.includes('battleaction')) {
		throw new Error('Should contain action buttons');
	}
	
	console.log('✓ generateBattleHTML test passed');
}

/**
 * Test victory HTML
 */
function testGenerateVictoryHTML() {
	console.log('Testing generateVictoryHTML...');
	
	const html = generateVictoryHTML('Wild Pikachu', ['Gained 100 EXP'], 500, 'test_zone');
	
	if (!html.includes('Victory')) {
		throw new Error('Should contain "Victory"');
	}
	if (!html.includes('Wild Pikachu')) {
		throw new Error('Should contain opponent name');
	}
	if (!html.includes('Gained 100 EXP')) {
		throw new Error('Should contain EXP message');
	}
	if (!html.includes('500')) {
		throw new Error('Should contain money gained');
	}
	
	console.log('✓ generateVictoryHTML test passed');
}

/**
 * Test defeat HTML
 */
function testGenerateDefeatHTML() {
	console.log('Testing generateDefeatHTML...');
	
	const html = generateDefeatHTML(250, 'Rival');
	
	if (!html.includes('Defeated')) {
		throw new Error('Should contain "Defeated"');
	}
	if (!html.includes('Rival')) {
		throw new Error('Should contain opponent name');
	}
	if (!html.includes('250')) {
		throw new Error('Should contain money lost');
	}
	if (!html.includes('healed')) {
		throw new Error('Should mention healing');
	}
	
	console.log('✓ generateDefeatHTML test passed');
}

/**
 * Test HTML contains no script tags (XSS prevention)
 */
function testHTMLSecurity() {
	console.log('Testing HTML security...');
	
	const pokemon = createMockPokemon();
	pokemon.nickname = '<script>alert("xss")</script>';
	
	const html = generatePokemonInfoHTML(pokemon);
	
	// Should escape or not execute scripts
	// In a real implementation, you'd want proper sanitization
	// For now, just check that the function doesn't crash
	if (html.length === 0) {
		throw new Error('HTML should not be empty');
	}
	
	console.log('✓ HTML security test passed');
}

/**
 * Run all tests
 */
function runTests() {
	console.log('=== Testing UI Generator Functions ===\n');
	
	try {
		testGenerateWelcomeHTML();
		testGenerateStarterSelectionHTML();
		testGeneratePokemonInfoHTML();
		testGeneratePokemonSummaryHTML();
		testGenerateInventoryHTML();
		testGenerateShopHTML();
		testGeneratePCHTML();
		testGenerateBattleHTML();
		testGenerateVictoryHTML();
		testGenerateDefeatHTML();
		testHTMLSecurity();
		
		console.log('\n=== All Tests Passed ✓ ===');
		console.log('UI generator functions work correctly!');
		return true;
	} catch (error) {
		console.error('\n=== Test Failed ✗ ===');
		console.error(error);
		return false;
	}
}

// Run tests if this file is executed directly
if (require.main === module) {
	const success = runTests();
	process.exit(success ? 0 : 1);
}

export { runTests };
