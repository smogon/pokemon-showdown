// Test file to verify battle-system functions work identically to original
import type { BattleState, ActivePokemonSlot, RPGPokemon } from './types';
import {
	calculateDamage,
	isGrounded,
	canUseItem,
	createActivePokemonSlot,
	isDoublesBattle,
} from './battle-system';

// Mock globals
(global as any).Dex = {
	species: {
		get: (id: string) => {
			// Return different species for testing
			if (id.toLowerCase().includes('pikachu')) {
				return {
					name: 'Pikachu',
					baseStats: { hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90 },
					types: ['Electric'],
					weightkg: 6,
					heightm: 0.4,
				};
			} else if (id.toLowerCase().includes('charizard')) {
				return {
					name: 'Charizard',
					baseStats: { hp: 78, atk: 84, def: 78, spa: 109, spd: 85, spe: 100 },
					types: ['Fire', 'Flying'],
					weightkg: 90.5,
					heightm: 1.7,
				};
			} else if (id.toLowerCase().includes('pidgey')) {
				return {
					name: 'Pidgey',
					baseStats: { hp: 40, atk: 45, def: 40, spa: 35, spd: 35, spe: 56 },
					types: ['Normal', 'Flying'],
					weightkg: 1.8,
					heightm: 0.3,
				};
			}
			return {
				name: 'Bulbasaur',
				baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
				types: ['Grass', 'Poison'],
				weightkg: 6.9,
				heightm: 0.7,
			};
		},
	},
	moves: {
		get: (id: string) => {
			// Return different moves for testing
			if (id === 'thunderbolt') {
				return {
					id: 'thunderbolt',
					name: 'Thunderbolt',
					type: 'Electric',
					basePower: 90,
					category: 'Special',
					pp: 15,
					flags: {},
				};
			} else if (id === 'tackle') {
				return {
					id: 'tackle',
					name: 'Tackle',
					type: 'Normal',
					basePower: 40,
					category: 'Physical',
					pp: 35,
					flags: {},
				};
			} else if (id === 'flamethrower') {
				return {
					id: 'flamethrower',
					name: 'Flamethrower',
					type: 'Fire',
					basePower: 90,
					category: 'Special',
					pp: 15,
					flags: {},
				};
			} else if (id === 'dragonrage') {
				return {
					id: 'dragonrage',
					name: 'Dragon Rage',
					type: 'Dragon',
					basePower: 0, // Fixed damage
					category: 'Special',
					pp: 10,
					flags: {},
				};
			}
			return {
				id,
				name: id,
				type: 'Normal',
				basePower: 40,
				category: 'Physical',
				pp: 35,
				flags: {},
			};
		},
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
function createMockBattle(overrides: Partial<BattleState> = {}): BattleState {
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
		...overrides,
	};
}

/**
 * Test calculateDamage function
 */
function testCalculateDamage() {
	console.log('Testing calculateDamage...');
	
	// Test 1: Basic damage calculation
	const attacker = createMockPokemon({ species: 'Pikachu', spa: 70, level: 50 });
	const defender = createMockPokemon({ species: 'Bulbasaur', spd: 65, level: 50 });
	const attackerSlot = createMockSlot(attacker);
	const defenderSlot = createMockSlot(defender);
	const battle = createMockBattle();
	
	const result1 = calculateDamage(attackerSlot, defenderSlot, 'thunderbolt', battle, 1.0);
	
	if (result1.damage <= 0) {
		throw new Error('Damage should be > 0 for Thunderbolt');
	}
	// Electric is not very effective vs Grass (resisted)
	if (result1.effectiveness !== 0.5) {
		throw new Error(`Expected effectiveness 0.5 (Electric vs Grass/Poison), got ${result1.effectiveness}`);
	}
	console.log(`✓ Basic damage: ${result1.damage} (effectiveness: ${result1.effectiveness}x)`);
	
	// Test 2: Super effective damage
	const waterDefender = createMockPokemon({ species: 'Charizard', spd: 85, level: 50 });
	const waterDefenderSlot = createMockSlot(waterDefender);
	
	const result2 = calculateDamage(attackerSlot, waterDefenderSlot, 'thunderbolt', battle, 1.0);
	
	if (result2.effectiveness !== 2) {
		throw new Error(`Expected effectiveness 2 (Electric vs Fire/Flying), got ${result2.effectiveness}`);
	}
	if (!result2.message.includes('super effective')) {
		throw new Error('Message should indicate super effectiveness');
	}
	console.log(`✓ Super effective: ${result2.damage} damage (2x effectiveness)`);
	
	// Test 3: Fixed damage move (Dragon Rage)
	const result3 = calculateDamage(attackerSlot, defenderSlot, 'dragonrage', battle, 1.0);
	
	if (result3.damage !== 40) {
		throw new Error(`Dragon Rage should always deal 40 damage, got ${result3.damage}`);
	}
	console.log(`✓ Fixed damage: Dragon Rage deals ${result3.damage} damage`);
	
	// Test 4: Spread move damage reduction
	const result4 = calculateDamage(attackerSlot, defenderSlot, 'thunderbolt', battle, 0.75);
	
	if (result4.damage >= result1.damage) {
		throw new Error('Spread move should deal less damage than single target');
	}
	console.log(`✓ Spread multiplier: ${result4.damage} (75% of ${result1.damage})`);
	
	console.log('✓ calculateDamage test passed');
}

/**
 * Test isGrounded function
 */
function testIsGrounded() {
	console.log('Testing isGrounded...');
	
	const battle = createMockBattle();
	
	// Test 1: Normal Pokemon is grounded
	const normalPokemon = createMockPokemon({ species: 'Pikachu' });
	if (!isGrounded(normalPokemon, battle)) {
		throw new Error('Pikachu should be grounded');
	}
	
	// Test 2: Flying Pokemon is not grounded
	const flyingPokemon = createMockPokemon({ species: 'Pidgey' });
	if (isGrounded(flyingPokemon, battle)) {
		throw new Error('Pidgey (Flying-type) should not be grounded');
	}
	
	// Test 3: Gravity grounds all Pokemon
	const gravityBattle = createMockBattle({ gravityTurns: 3 });
	if (!isGrounded(flyingPokemon, gravityBattle)) {
		throw new Error('Gravity should ground Flying-types');
	}
	
	console.log('✓ isGrounded test passed');
}

/**
 * Test canUseItem function
 */
function testCanUseItem() {
	console.log('Testing canUseItem...');
	
	const pokemon = createMockPokemon({ item: 'leftovers' });
	const slot = createMockSlot(pokemon);
	const battle = createMockBattle();
	
	// Test 1: Normal conditions allow item use
	if (!canUseItem(slot, battle)) {
		throw new Error('Should be able to use item normally');
	}
	
	// Test 2: Magic Room prevents item use
	const magicRoomBattle = createMockBattle({ magicRoomTurns: 5 });
	if (canUseItem(slot, magicRoomBattle)) {
		throw new Error('Magic Room should prevent item use');
	}
	
	// Test 3: Embargo prevents item use
	const embargoSlot = { ...slot, embargoTurns: 3 };
	if (canUseItem(embargoSlot, battle)) {
		throw new Error('Embargo should prevent item use');
	}
	
	console.log('✓ canUseItem test passed');
}

/**
 * Test createActivePokemonSlot function
 */
function testCreateActivePokemonSlot() {
	console.log('Testing createActivePokemonSlot...');
	
	const pokemon = createMockPokemon({ status: 'psn' });
	const slot = createActivePokemonSlot(pokemon);
	
	if (slot.pokemon !== pokemon) {
		throw new Error('Slot should reference the Pokemon');
	}
	if (slot.status !== 'psn') {
		throw new Error('Slot should inherit Pokemon status');
	}
	if (slot.statStages.atk !== 0) {
		throw new Error('Stat stages should be initialized to 0');
	}
	if (slot.isConfused) {
		throw new Error('Volatile status should be initialized to false');
	}
	
	console.log('✓ createActivePokemonSlot test passed');
}

/**
 * Test isDoublesBattle function
 */
function testIsDoublesBattle() {
	console.log('Testing isDoublesBattle...');
	
	const singleBattle = createMockBattle({ battleType: 'wild' });
	const doubleBattle = createMockBattle({ battleType: 'wild_double' });
	const trainerDouble = createMockBattle({ battleType: 'trainer_double' });
	
	if (isDoublesBattle(singleBattle)) {
		throw new Error('Single battle should not be doubles');
	}
	if (!isDoublesBattle(doubleBattle)) {
		throw new Error('Wild double should be doubles');
	}
	if (!isDoublesBattle(trainerDouble)) {
		throw new Error('Trainer double should be doubles');
	}
	
	console.log('✓ isDoublesBattle test passed');
}

/**
 * Test damage calculation consistency
 * Run the same calculation multiple times to ensure deterministic results
 */
function testDamageConsistency() {
	console.log('Testing damage consistency...');
	
	const attacker = createMockPokemon({ species: 'Pikachu', spa: 70, level: 50 });
	const defender = createMockPokemon({ species: 'Bulbasaur', spd: 65, level: 50 });
	const attackerSlot = createMockSlot(attacker);
	const defenderSlot = createMockSlot(defender);
	const battle = createMockBattle();
	
	// Run calculation 10 times
	const results: number[] = [];
	for (let i = 0; i < 10; i++) {
		const result = calculateDamage(attackerSlot, defenderSlot, 'thunderbolt', battle, 1.0);
		results.push(result.damage);
	}
	
	// Check that damage varies (due to random roll)
	const uniqueValues = new Set(results);
	if (uniqueValues.size === 1) {
		throw new Error('Damage should have some variance due to random roll');
	}
	
	// Check that all values are within expected range (85-100% of base damage)
	const minDamage = Math.min(...results);
	const maxDamage = Math.max(...results);
	const ratio = minDamage / maxDamage;
	
	// Pokemon damage has 85-100% variance, so minimum ratio is 0.85
	// Allow for some floating point error
	if (ratio < 0.82) {
		throw new Error(`Damage variance too high: ${minDamage}-${maxDamage} (ratio: ${ratio})`);
	}
	
	console.log(`✓ Damage consistency: ${minDamage}-${maxDamage} damage (${uniqueValues.size} unique values)`);
}

/**
 * Run all tests
 */
function runTests() {
	console.log('=== Testing Battle System Functions ===\n');
	
	try {
		testCalculateDamage();
		testIsGrounded();
		testCanUseItem();
		testCreateActivePokemonSlot();
		testIsDoublesBattle();
		testDamageConsistency();
		
		console.log('\n=== All Tests Passed ✓ ===');
		console.log('Battle system functions work correctly!');
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
