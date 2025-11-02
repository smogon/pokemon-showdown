// Test file for battle helper functions
import type { BattleState, ActivePokemonSlot, RPGPokemon } from './types';
import {
	getCustomEffectiveness,
	getStatMultiplier,
	getCriticalHitChance,
	getMove,
	getActiveSlots,
	getSlotFromIndex,
	getBallBonus,
	performCatchAttempt,
} from './battle-helpers';

// Mock globals
(global as any).Dex = {
	species: {
		get: (id: string) => ({
			name: 'Pikachu',
			baseStats: { hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90 },
			types: ['Electric'],
		}),
	},
	moves: {
		get: (id: string) => ({
			id,
			name: id,
			type: 'Normal',
			basePower: 40,
			category: 'Physical',
			pp: 35,
		}),
	},
};
(global as any).toID = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

// Helper to create a mock Pokemon
function createMockPokemon(overrides: Partial<RPGPokemon> = {}): RPGPokemon {
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
		...overrides,
	};
}

// Helper to create a mock active slot
function createMockSlot(pokemon: RPGPokemon): ActivePokemonSlot {
	return {
		pokemon,
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
	};
}

// Helper to create a mock battle
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
		opponentName: 'Wild Pokemon',
		opponentParty: [],
		opponentMoney: 0,
		playerSlots: [null, null],
		opponentSlots: [null, null],
		pendingActions: {},
		playerFutureMoves: [],
		opponentFutureMoves: [],
	};
}

/**
 * Test type effectiveness calculation
 */
function testTypeEffectiveness() {
	console.log('Testing type effectiveness...');
	
	const pokemon = createMockPokemon();
	const battle = createMockBattle();
	
	// Fire vs Grass = 2x
	const fireVsGrass = getCustomEffectiveness('Fire', ['Grass'], pokemon, battle);
	if (fireVsGrass !== 2) {
		throw new Error(`Fire vs Grass should be 2x, got ${fireVsGrass}`);
	}
	
	// Water vs Fire = 2x
	const waterVsFire = getCustomEffectiveness('Water', ['Fire'], pokemon, battle);
	if (waterVsFire !== 2) {
		throw new Error(`Water vs Fire should be 2x, got ${waterVsFire}`);
	}
	
	// Normal vs Ghost = 0x
	const normalVsGhost = getCustomEffectiveness('Normal', ['Ghost'], pokemon, battle);
	if (normalVsGhost !== 0) {
		throw new Error(`Normal vs Ghost should be 0x, got ${normalVsGhost}`);
	}
	
	// Fire vs Water = 0.5x
	const fireVsWater = getCustomEffectiveness('Fire', ['Water'], pokemon, battle);
	if (fireVsWater !== 0.5) {
		throw new Error(`Fire vs Water should be 0.5x, got ${fireVsWater}`);
	}
	
	console.log('✓ Type effectiveness test passed');
}

/**
 * Test stat multiplier calculation
 */
function testStatMultiplier() {
	console.log('Testing stat multiplier...');
	
	// Stage 0 = 1x
	if (getStatMultiplier(0) !== 1) {
		throw new Error('Stage 0 should be 1x');
	}
	
	// Stage +1 = 1.5x
	if (getStatMultiplier(1) !== 1.5) {
		throw new Error('Stage +1 should be 1.5x');
	}
	
	// Stage +2 = 2x
	if (getStatMultiplier(2) !== 2) {
		throw new Error('Stage +2 should be 2x');
	}
	
	// Stage -1 = 0.67x (approximately)
	const negOne = getStatMultiplier(-1);
	if (Math.abs(negOne - 0.6667) > 0.01) {
		throw new Error(`Stage -1 should be ~0.67x, got ${negOne}`);
	}
	
	console.log('✓ Stat multiplier test passed');
}

/**
 * Test active slots filtering
 */
function testActiveSlots() {
	console.log('Testing active slots...');
	
	const pokemon1 = createMockPokemon({ id: 'p1', hp: 50 });
	const pokemon2 = createMockPokemon({ id: 'p2', hp: 0 });
	const pokemon3 = createMockPokemon({ id: 'p3', hp: 100 });
	
	const slot1 = createMockSlot(pokemon1);
	const slot2 = createMockSlot(pokemon2);
	const slot3 = createMockSlot(pokemon3);
	
	// Test with one alive, one fainted
	const slots1: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [slot1, slot2];
	const active1 = getActiveSlots(slots1);
	if (active1.length !== 1 || active1[0].pokemon.id !== 'p1') {
		throw new Error('Should return only alive Pokemon');
	}
	
	// Test with both alive
	const slots2: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [slot1, slot3];
	const active2 = getActiveSlots(slots2);
	if (active2.length !== 2) {
		throw new Error('Should return both Pokemon');
	}
	
	// Test with null slot
	const slots3: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [slot1, null];
	const active3 = getActiveSlots(slots3);
	if (active3.length !== 1) {
		throw new Error('Should ignore null slots');
	}
	
	console.log('✓ Active slots test passed');
}

/**
 * Test ball bonus calculation
 */
function testBallBonus() {
	console.log('Testing ball bonus...');
	
	const pokemon = createMockPokemon({ level: 50 });
	const slot = createMockSlot(pokemon);
	const battle = createMockBattle();
	battle.playerSlots[0] = createMockSlot(createMockPokemon({ level: 50 }));
	battle.turn = 5;
	
	// Master Ball = 255x
	const masterBall = getBallBonus('masterball', battle, slot);
	if (masterBall !== 255) {
		throw new Error(`Master Ball should be 255x, got ${masterBall}`);
	}
	
	// Great Ball = 1.5x
	const greatBall = getBallBonus('greatball', battle, slot);
	if (greatBall !== 1.5) {
		throw new Error(`Great Ball should be 1.5x, got ${greatBall}`);
	}
	
	// Ultra Ball = 2x
	const ultraBall = getBallBonus('ultraball', battle, slot);
	if (ultraBall !== 2) {
		throw new Error(`Ultra Ball should be 2x, got ${ultraBall}`);
	}
	
	// Regular Poke Ball = 1x
	const pokeball = getBallBonus('pokeball', battle, slot);
	if (pokeball !== 1) {
		throw new Error(`Poke Ball should be 1x, got ${pokeball}`);
	}
	
	console.log('✓ Ball bonus test passed');
}

/**
 * Test catch attempt
 */
function testCatchAttempt() {
	console.log('Testing catch attempt...');
	
	const pokemon = createMockPokemon({ hp: 1, level: 5 }); // Low HP, low level = easy catch
	const slot = createMockSlot(pokemon);
	const battle = createMockBattle();
	battle.playerSlots[0] = createMockSlot(createMockPokemon({ level: 50 }));
	
	// Master Ball should always succeed
	const masterBall = performCatchAttempt(battle, 'masterball', slot);
	if (!masterBall.success || masterBall.shakes !== 4) {
		throw new Error('Master Ball should always succeed with 4 shakes');
	}
	
	// Low HP Pokemon should have high catch rate
	let successCount = 0;
	for (let i = 0; i < 100; i++) {
		const result = performCatchAttempt(battle, 'ultraball', slot);
		if (result.success) successCount++;
	}
	if (successCount < 50) {
		throw new Error('Low HP Pokemon should have >50% catch rate with Ultra Ball');
	}
	
	console.log(`✓ Catch attempt test passed (${successCount}/100 successful catches)`);
}

/**
 * Run all tests
 */
function runTests() {
	console.log('=== Testing Battle Helper Functions ===\n');
	
	try {
		testTypeEffectiveness();
		testStatMultiplier();
		testActiveSlots();
		testBallBonus();
		testCatchAttempt();
		
		console.log('\n=== All Tests Passed ✓ ===');
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
