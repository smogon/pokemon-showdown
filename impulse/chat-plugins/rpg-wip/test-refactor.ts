// Test file to verify refactored modules work correctly
// This file tests that extracted functions produce identical results

import type { RPGPokemon, Stats } from './types';
import { NATURES, NATURE_LIST, ITEMS_DATABASE, TYPE_CHART } from './constants';
import { calculateStats, calculateTotalExpForLevel, generateUniqueId } from './utils';

// Mock Dex for testing
const mockDex = {
	species: {
		get: (id: string) => ({
			exists: true,
			name: 'Pikachu',
			baseStats: { hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90 },
			types: ['Electric'],
			genderRatio: { M: 0.5, F: 0.5 },
			abilities: { '0': 'Static', 'H': 'Lightning Rod' },
			weightkg: 6,
			heightm: 0.4,
			baseFriendship: 70,
			growthRate: 'Medium Fast',
			learnset: {},
			forme: undefined,
		}),
	},
	moves: {
		get: (id: string) => ({
			exists: true,
			id,
			name: id,
			type: 'Normal',
			basePower: 40,
			category: 'Physical',
			pp: 35,
			flags: {},
		}),
	},
};

// Make Dex globally available
(global as any).Dex = mockDex;
(global as any).toID = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Test that extracted constants match original values
 */
function testConstants() {
	console.log('Testing constants...');
	
	// Test natures
	if (NATURE_LIST.length !== 25) {
		throw new Error(`Expected 25 natures, got ${NATURE_LIST.length}`);
	}
	
	if (!NATURES['Adamant'] || NATURES['Adamant']!.plus !== 'atk' || NATURES['Adamant']!.minus !== 'spa') {
		throw new Error('Adamant nature incorrect');
	}
	
	// Test items
	if (!ITEMS_DATABASE['pokeball']) {
		throw new Error('Pokeball missing from items database');
	}
	
	if (ITEMS_DATABASE['pokeball'].name !== 'Poke Ball') {
		throw new Error('Pokeball name incorrect');
	}
	
	// Test type chart
	if (!TYPE_CHART['Fire']) {
		throw new Error('Fire type missing from type chart');
	}
	
	if (!TYPE_CHART['Fire'].superEffective.includes('Grass')) {
		throw new Error('Fire should be super effective against Grass');
	}
	
	console.log('✓ Constants test passed');
}

/**
 * Test that stat calculation works correctly
 */
function testStatCalculation() {
	console.log('Testing stat calculation...');
	
	const species = mockDex.species.get('pikachu');
	const level = 50;
	const nature = 'Adamant';
	const ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
	const evs = { hp: 252, atk: 252, def: 0, spa: 0, spd: 0, spe: 0 };
	
	const stats = calculateStats(species, level, nature, ivs, evs);
	
	// Verify stats are calculated
	if (stats.maxHp <= 0) throw new Error('HP not calculated');
	if (stats.atk <= 0) throw new Error('Attack not calculated');
	if (stats.def <= 0) throw new Error('Defense not calculated');
	if (stats.spa <= 0) throw new Error('Special Attack not calculated');
	if (stats.spd <= 0) throw new Error('Special Defense not calculated');
	if (stats.spe <= 0) throw new Error('Speed not calculated');
	
	// Verify nature effect (Adamant boosts Atk, lowers SpA)
	// Base 55 Atk should be higher than base 50 SpA after nature
	if (stats.atk <= stats.spa) {
		throw new Error('Nature effect not applied correctly');
	}
	
	console.log('✓ Stat calculation test passed');
	console.log(`  Sample stats at level ${level}:`, stats);
}

/**
 * Test experience calculation
 */
function testExperienceCalculation() {
	console.log('Testing experience calculation...');
	
	const testCases = [
		{ rate: 'Medium Fast', level: 50, expected: 125000 },
		{ rate: 'Medium Fast', level: 100, expected: 1000000 },
		{ rate: 'Fast', level: 50, expected: 100000 },
		{ rate: 'Slow', level: 50, expected: 156250 },
	];
	
	for (const testCase of testCases) {
		const result = calculateTotalExpForLevel(testCase.rate, testCase.level);
		if (result !== testCase.expected) {
			throw new Error(`${testCase.rate} at level ${testCase.level}: expected ${testCase.expected}, got ${result}`);
		}
	}
	
	console.log('✓ Experience calculation test passed');
}

/**
 * Test unique ID generation
 */
function testUniqueIdGeneration() {
	console.log('Testing unique ID generation...');
	
	const ids = new Set<string>();
	const count = 1000;
	
	for (let i = 0; i < count; i++) {
		const id = generateUniqueId();
		if (ids.has(id)) {
			throw new Error('Duplicate ID generated');
		}
		ids.add(id);
		
		// Verify format (alphanumeric)
		if (!/^[a-z0-9]+$/.test(id)) {
			throw new Error('Invalid ID format: ' + id);
		}
	}
	
	console.log(`✓ Unique ID generation test passed (${count} unique IDs)`);
}

/**
 * Run all tests
 */
function runTests() {
	console.log('=== Testing Refactored Modules ===\n');
	
	try {
		testConstants();
		testStatCalculation();
		testExperienceCalculation();
		testUniqueIdGeneration();
		
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
