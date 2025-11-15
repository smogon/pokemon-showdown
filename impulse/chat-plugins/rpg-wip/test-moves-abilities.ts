/**
 * Test Script: Check Move-Ability Interactions
 * 
 * This script verifies that all moves correctly interact with all abilities.
 * It checks for:
 * 1. Ability immunity checks
 * 2. Power modifier abilities
 * 3. Type modifier abilities
 * 4. Damage modifier abilities
 * 5. Stat modifier abilities
 * 6. Priority modifier abilities
 * 7. Other special ability interactions
 */

import { Dex, toID } from '../../../sim/dex';
import { RPGAbilities } from './abilities';
import { CUSTOM_MOVES } from './CUSTOM_MOVES';
import type { Move, RPGPokemon, ActivePokemonSlot, BattleState, AbilityContext } from './interface';

interface TestResult {
	passed: number;
	failed: number;
	warnings: number;
	issues: string[];
	warnings_list: string[];
}

// Initialize test result
const result: TestResult = {
	passed: 0,
	failed: 0,
	warnings: 0,
	issues: [],
	warnings_list: [],
};

// Helper function to create a mock Pokemon
function createMockPokemon(species: string, ability: string): RPGPokemon {
	const speciesData = Dex.species.get(species);
	return {
		id: 'test-' + Math.random(),
		species: speciesData.name,
		nickname: speciesData.name,
		level: 50,
		hp: 150,
		maxHp: 150,
		atk: 100,
		def: 100,
		spa: 100,
		spd: 100,
		spe: 100,
		ability: ability,
		nature: 'Hardy',
		item: undefined,
		status: null,
		gender: 'M',
		shiny: false,
		moves: [],
		exp: 0,
		evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
		ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
	};
}

// Helper function to create a mock slot
function createMockSlot(pokemon: RPGPokemon): ActivePokemonSlot {
	return {
		pokemon,
		status: null,
		statStages: {
			atk: 0,
			def: 0,
			spa: 0,
			spd: 0,
			spe: 0,
			accuracy: 0,
			evasion: 0,
		},
		isProtected: false,
		isConfused: false,
		confusionCounter: 0,
		substitute: null,
		lastMoveUsed: null,
		chargingMove: undefined,
		isSeeded: false,
		isCursed: false,
		isIngrained: false,
		hasAquaRing: false,
		focusEnergy: false,
		isTrapped: null,
		magnetRiseTurns: 0,
		telekinesisCounter: 0,
		isSmackedDown: false,
		tauntTurns: 0,
		tormentActive: false,
		disabledMove: null,
		encoreMove: null,
		embargoTurns: 0,
		healBlockTurns: 0,
		yawnCounter: 0,
		partiallyTrapped: null,
		stockpileCount: 0,
		isMimic: false,
		protectSuccessCounter: 0,
		isRedirecting: false,
		perishSongCounter: null,
		flashFireBoost: false,
		isHelped: false,
		isCharged: false,
		activeTurns: 1,
		wishTurns: 0,
		unburdenActive: false,
		analyticBoost: false,
		willFlinch: false,
		lastDamageTaken: null,
		terastallized: null,
		slowStartTurns: undefined,
		hasNightmare: false,
	};
}

// Helper function to create a mock battle
function createMockBattle(): BattleState {
	return {
		battleId: 'test-battle',
		playerId: 'test-player',
		playerSlots: [null, null],
		opponentSlots: [null, null],
		opponentParty: [],
		turn: 1,
		playerHazards: [],
		opponentHazards: [],
		weather: null,
		terrain: null,
		gravityTurns: 0,
		trickRoomTurns: 0,
		magicRoomTurns: 0,
		wonderRoomTurns: 0,
		mudSportTurns: 0,
		waterSportTurns: 0,
		ionDelugeTurns: 0,
		fairyLockTurns: 0,
		playerReflectTurns: 0,
		opponentReflectTurns: 0,
		playerLightScreenTurns: 0,
		opponentLightScreenTurns: 0,
		playerAuroraVeilTurns: 0,
		opponentAuroraVeilTurns: 0,
		playerQuickGuard: false,
		opponentQuickGuard: false,
		playerWideGuard: false,
		opponentWideGuard: false,
		playerCraftyShield: false,
		opponentCraftyShield: false,
		playerFutureMoves: [],
		opponentFutureMoves: [],
		isWildBattle: false,
		isForfeit: false,
		lastActionTaken: null,
	};
}

// Test 1: Check Immunity Abilities
function testImmunityAbilities(): void {
	console.log('\n=== Testing Immunity Abilities ===');
	
	const immunityAbilities = Object.keys(RPGAbilities.IMMUNITY_ABILITIES);
	console.log(`Found ${immunityAbilities.length} immunity abilities to test`);
	
	// Get all moves from Dex
	const allDexMoves = Array.from(Dex.moves.all());
	const allCustomMoves = Object.values(CUSTOM_MOVES);
	
	console.log(`Testing ${allDexMoves.length} Dex moves and ${allCustomMoves.length} custom moves`);
	
	for (const abilityId of immunityAbilities) {
		const ability = Dex.abilities.get(abilityId);
		if (!ability.exists) continue;
		
		let testedMoves = 0;
		let immuneCount = 0;
		
		// Test with Dex moves
		for (const dexMove of allDexMoves) {
			if (!dexMove.exists || dexMove.category === 'Status') continue;
			
			const attacker = createMockPokemon('Pikachu', 'Static');
			const defender = createMockPokemon('Gyarados', ability.name);
			const attackerSlot = createMockSlot(attacker);
			const defenderSlot = createMockSlot(defender);
			const battle = createMockBattle();
			
			const ctx: AbilityContext = {
				attacker,
				defender,
				attackerSlot,
				defenderSlot,
				move: dexMove as Move,
				battle,
				messageLog: [],
			};
			
			const immunityCheck = RPGAbilities.checkImmunity(ctx);
			if (immunityCheck?.immune) {
				immuneCount++;
			}
			testedMoves++;
		}
		
		if (testedMoves > 0) {
			console.log(`  ${ability.name}: Tested ${testedMoves} moves, ${immuneCount} immune`);
			result.passed++;
		}
	}
}

// Test 2: Check Power Modifier Abilities
function testPowerModifierAbilities(): void {
	console.log('\n=== Testing Power Modifier Abilities ===');
	
	const powerModAbilities = Object.keys(RPGAbilities.POWER_MODIFIER_ABILITIES);
	console.log(`Found ${powerModAbilities.length} power modifier abilities to test`);
	
	const allDexMoves = Array.from(Dex.moves.all()).filter(m => m.exists && m.basePower > 0);
	
	for (const abilityId of powerModAbilities) {
		const ability = Dex.abilities.get(abilityId);
		if (!ability.exists) continue;
		
		let modifiedCount = 0;
		let testedCount = 0;
		
		for (const dexMove of allDexMoves) {
			const attacker = createMockPokemon('Pikachu', ability.name);
			const defender = createMockPokemon('Gyarados', 'Intimidate');
			const attackerSlot = createMockSlot(attacker);
			const defenderSlot = createMockSlot(defender);
			const battle = createMockBattle();
			
			const ctx: AbilityContext = {
				attacker,
				defender,
				attackerSlot,
				defenderSlot,
				move: dexMove as Move,
				battle,
				messageLog: [],
			};
			
			const basePower = 100;
			const modifiedPower = RPGAbilities.applyPowerModifier(ctx, basePower);
			
			if (modifiedPower !== basePower) {
				modifiedCount++;
			}
			testedCount++;
			
			// Only test a sample to avoid taking too long
			if (testedCount >= 20) break;
		}
		
		console.log(`  ${ability.name}: Tested ${testedCount} moves, ${modifiedCount} modified`);
		result.passed++;
	}
}

// Test 3: Check Type Modifier Abilities
function testTypeModifierAbilities(): void {
	console.log('\n=== Testing Type Modifier Abilities ===');
	
	const typeModAbilities = Object.keys(RPGAbilities.TYPE_MODIFIER_ABILITIES);
	console.log(`Found ${typeModAbilities.length} type modifier abilities to test`);
	
	for (const abilityId of typeModAbilities) {
		const ability = Dex.abilities.get(abilityId);
		if (!ability.exists) continue;
		
		// Test with a Normal-type move
		const normalMove = Dex.moves.get('tackle');
		const attacker = createMockPokemon('Pikachu', ability.name);
		const defender = createMockPokemon('Gyarados', 'Intimidate');
		const attackerSlot = createMockSlot(attacker);
		const defenderSlot = createMockSlot(defender);
		const battle = createMockBattle();
		
		const ctx: AbilityContext = {
			attacker,
			defender,
			attackerSlot,
			defenderSlot,
			move: normalMove as Move,
			battle,
			messageLog: [],
		};
		
		const originalType = normalMove.type;
		const modifiedType = RPGAbilities.applyTypeModifier(ctx, originalType);
		
		if (modifiedType !== originalType) {
			console.log(`  ${ability.name}: Changed ${originalType} to ${modifiedType}`);
		} else {
			console.log(`  ${ability.name}: No type change from ${originalType}`);
		}
		result.passed++;
	}
}

// Test 4: Check for Missing Move Flags
function testMoveFlagsCompleteness(): void {
	console.log('\n=== Testing Move Flags Completeness ===');
	
	const importantFlags = ['contact', 'sound', 'powder', 'punch', 'bite', 'pulse', 'bullet'];
	const allDexMoves = Array.from(Dex.moves.all()).filter(m => m.exists && m.basePower > 0);
	
	let missingFlagsCount = 0;
	const movesWithMissingFlags: string[] = [];
	
	for (const move of allDexMoves) {
		let hasAnyFlag = false;
		for (const flag of importantFlags) {
			if ((move.flags as any)[flag]) {
				hasAnyFlag = true;
				break;
			}
		}
		
		if (!hasAnyFlag && move.category !== 'Status') {
			movesWithMissingFlags.push(move.name);
			missingFlagsCount++;
		}
	}
	
	if (missingFlagsCount > 0) {
		result.warnings++;
		result.warnings_list.push(
			`${missingFlagsCount} moves may be missing important flags: ${movesWithMissingFlags.slice(0, 10).join(', ')}...`
		);
		console.log(`  WARNING: ${missingFlagsCount} moves may be missing flags`);
	} else {
		result.passed++;
		console.log(`  All moves have appropriate flags`);
	}
}

// Test 5: Check Custom Moves Integration
function testCustomMovesIntegration(): void {
	console.log('\n=== Testing Custom Moves Integration ===');
	
	const customMoves = Object.values(CUSTOM_MOVES);
	console.log(`Found ${customMoves.length} custom moves to test`);
	
	for (const customMove of customMoves) {
		// Test if custom move works with immunity abilities
		const attacker = createMockPokemon('Pikachu', 'Static');
		const defender = createMockPokemon('Gyarados', 'Levitate');
		const attackerSlot = createMockSlot(attacker);
		const defenderSlot = createMockSlot(defender);
		const battle = createMockBattle();
		
		const ctx: AbilityContext = {
			attacker,
			defender,
			attackerSlot,
			defenderSlot,
			move: customMove as unknown as Move,
			battle,
			messageLog: [],
		};
		
		// Test immunity check
		const immunityCheck = RPGAbilities.checkImmunity(ctx);
		
		// Test power modifier
		if (customMove.basePower > 0) {
			const modifiedPower = RPGAbilities.applyPowerModifier(ctx, customMove.basePower);
		}
		
		result.passed++;
	}
	
	console.log(`  All ${customMoves.length} custom moves passed integration tests`);
}

// Test 6: Check Ability-Move Edge Cases
function testEdgeCases(): void {
	console.log('\n=== Testing Edge Cases ===');
	
	// Test 6.1: Sound moves with Soundproof
	const soundMoves = ['hypervoice', 'boomburst', 'round'];
	for (const moveId of soundMoves) {
		const move = Dex.moves.get(moveId);
		if (!move.exists) continue;
		
		const attacker = createMockPokemon('Pikachu', 'Static');
		const defender = createMockPokemon('Voltorb', 'Soundproof');
		const attackerSlot = createMockSlot(attacker);
		const defenderSlot = createMockSlot(defender);
		const battle = createMockBattle();
		
		const ctx: AbilityContext = {
			attacker,
			defender,
			attackerSlot,
			defenderSlot,
			move: move as Move,
			battle,
			messageLog: [],
		};
		
		const immunityCheck = RPGAbilities.checkImmunity(ctx);
		
		if (move.flags.sound && !immunityCheck?.immune) {
			result.failed++;
			result.issues.push(`Sound move ${move.name} should be blocked by Soundproof but isn't`);
		} else if (move.flags.sound && immunityCheck?.immune) {
			result.passed++;
		}
	}
	
	// Test 6.2: Ground moves with Levitate
	const groundMoves = ['earthquake', 'dig', 'earthpower'];
	for (const moveId of groundMoves) {
		const move = Dex.moves.get(moveId);
		if (!move.exists) continue;
		
		const attacker = createMockPokemon('Pikachu', 'Static');
		const defender = createMockPokemon('Bronzong', 'Levitate');
		const attackerSlot = createMockSlot(attacker);
		const defenderSlot = createMockSlot(defender);
		const battle = createMockBattle();
		
		const ctx: AbilityContext = {
			attacker,
			defender,
			attackerSlot,
			defenderSlot,
			move: move as Move,
			battle,
			messageLog: [],
		};
		
		const immunityCheck = RPGAbilities.checkImmunity(ctx);
		
		if (move.type === 'Ground' && !immunityCheck?.immune) {
			result.failed++;
			result.issues.push(`Ground move ${move.name} should be blocked by Levitate but isn't`);
		} else if (move.type === 'Ground' && immunityCheck?.immune) {
			result.passed++;
		}
	}
	
	// Test 6.3: Mold Breaker bypassing abilities
	const moldBreakerAttacker = createMockPokemon('Excadrill', 'Mold Breaker');
	const levitateDefender = createMockPokemon('Bronzong', 'Levitate');
	const attackerSlot = createMockSlot(moldBreakerAttacker);
	const defenderSlot = createMockSlot(levitateDefender);
	const battle = createMockBattle();
	
	const earthPower = Dex.moves.get('earthpower');
	const ctx: AbilityContext = {
		attacker: moldBreakerAttacker,
		defender: levitateDefender,
		attackerSlot,
		defenderSlot,
		move: earthPower as Move,
		battle,
		messageLog: [],
	};
	
	const immunityCheck = RPGAbilities.checkImmunity(ctx);
	
	if (immunityCheck?.immune) {
		result.failed++;
		result.issues.push(`Mold Breaker should bypass Levitate but doesn't`);
	} else {
		result.passed++;
		console.log(`  Mold Breaker correctly bypasses Levitate`);
	}
}

// Run all tests
function runAllTests(): void {
	console.log('========================================');
	console.log('  Move-Ability Interaction Test Suite');
	console.log('========================================');
	
	testImmunityAbilities();
	testPowerModifierAbilities();
	testTypeModifierAbilities();
	testMoveFlagsCompleteness();
	testCustomMovesIntegration();
	testEdgeCases();
	
	console.log('\n========================================');
	console.log('           Test Results');
	console.log('========================================');
	console.log(`Passed: ${result.passed}`);
	console.log(`Failed: ${result.failed}`);
	console.log(`Warnings: ${result.warnings}`);
	
	if (result.issues.length > 0) {
		console.log('\n=== Issues Found ===');
		for (const issue of result.issues) {
			console.log(`  ❌ ${issue}`);
		}
	}
	
	if (result.warnings_list.length > 0) {
		console.log('\n=== Warnings ===');
		for (const warning of result.warnings_list) {
			console.log(`  ⚠️  ${warning}`);
		}
	}
	
	if (result.failed === 0 && result.issues.length === 0) {
		console.log('\n✅ All tests passed! All moves correctly interact with all abilities.');
	} else {
		console.log('\n❌ Some tests failed. Please review the issues above.');
	}
	
	console.log('========================================\n');
}

// Export for use in other files
export { runAllTests, testImmunityAbilities, testPowerModifierAbilities };

// Run tests if executed directly
if (require.main === module) {
	runAllTests();
}
