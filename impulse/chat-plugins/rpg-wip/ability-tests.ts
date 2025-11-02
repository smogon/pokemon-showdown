/**
 * Ability Test Suite
 * Tests to verify all abilities work correctly with moves
 */

import RPGAbilities from './abilities';
import { Dex } from '../../../sim/dex';

// Test helper functions
function createTestPokemon(species: string, ability: string, level: number = 50) {
	const speciesData = Dex.species.get(species);
	return {
		species: speciesData.name,
		level,
		hp: 100,
		maxHp: 100,
		atk: 100,
		def: 100,
		spa: 100,
		spd: 100,
		spe: 100,
		ability,
		item: undefined,
		status: null,
	};
}

function createTestMove(moveId: string) {
	const move = Dex.moves.get(moveId);
	return {
		id: move.id,
		name: move.name,
		type: move.type,
		category: move.category as 'Physical' | 'Special' | 'Status',
		basePower: move.basePower,
		flags: move.flags || {},
		secondary: move.secondary,
	};
}

function createTestContext(attacker: any, defender: any, move: any, battle: any = {}) {
	return {
		attacker,
		defender,
		attackerSlot: { pokemon: attacker, statStages: {}, status: null },
		defenderSlot: { pokemon: defender, statStages: {}, status: null },
		move,
		battle: {
			weather: undefined,
			terrain: undefined,
			magicRoomTurns: 0,
			wonderRoomTurns: 0,
			gravityTurns: 0,
			...battle,
		},
		messageLog: [],
	};
}

// Test results tracker
const testResults = {
	passed: 0,
	failed: 0,
	tests: [] as { name: string; status: 'PASS' | 'FAIL'; message?: string }[],
};

function test(name: string, testFn: () => void) {
	try {
		testFn();
		testResults.passed++;
		testResults.tests.push({ name, status: 'PASS' });
		console.log(`✓ ${name}`);
	} catch (error) {
		testResults.failed++;
		testResults.tests.push({ 
			name, 
			status: 'FAIL', 
			message: error instanceof Error ? error.message : String(error) 
		});
		console.log(`✗ ${name}: ${error}`);
	}
}

function assert(condition: boolean, message: string) {
	if (!condition) {
		throw new Error(message);
	}
}

function assertEquals(actual: any, expected: any, message?: string) {
	if (actual !== expected) {
		throw new Error(message || `Expected ${expected}, got ${actual}`);
	}
}

// ===== IMMUNITY ABILITY TESTS =====

test('Soundproof blocks sound moves', () => {
	const attacker = createTestPokemon('pikachu', 'static');
	const defender = createTestPokemon('voltorb', 'soundproof');
	const move = createTestMove('hypervoice');
	move.flags.sound = true;
	
	const ctx = createTestContext(attacker, defender, move);
	const result = RPGAbilities.checkImmunity(ctx);
	
	assert(result !== null, 'Should return immunity result');
	assert(result.immune === true, 'Should be immune to sound moves');
});

test('Overcoat blocks powder moves', () => {
	const attacker = createTestPokemon('bulbasaur', 'overgrow');
	const defender = createTestPokemon('vullaby', 'overcoat');
	const move = createTestMove('spore');
	move.flags.powder = true;
	
	const ctx = createTestContext(attacker, defender, move);
	const result = RPGAbilities.checkImmunity(ctx);
	
	assert(result !== null && result.immune === true, 'Should be immune to powder moves');
});

test('Levitate blocks Ground moves', () => {
	const attacker = createTestPokemon('diglett', 'arenatrap');
	const defender = createTestPokemon('gengar', 'levitate');
	const move = createTestMove('earthquake');
	
	const ctx = createTestContext(attacker, defender, move);
	const result = RPGAbilities.checkImmunity(ctx);
	
	assert(result !== null && result.immune === true, 'Should be immune to Ground moves');
});

test('Water Absorb blocks Water moves and heals', () => {
	const attacker = createTestPokemon('squirtle', 'torrent');
	const defender = createTestPokemon('vaporeon', 'waterabsorb');
	defender.hp = 50; // Damaged
	const move = createTestMove('surf');
	
	const ctx = createTestContext(attacker, defender, move);
	const initialHp = defender.hp;
	const result = RPGAbilities.checkImmunity(ctx);
	
	assert(result !== null && result.immune === true, 'Should be immune to Water moves');
	assert(defender.hp > initialHp, 'Should heal HP');
});

test('Volt Absorb blocks Electric moves and heals', () => {
	const attacker = createTestPokemon('pikachu', 'static');
	const defender = createTestPokemon('lanturn', 'voltabsorb');
	defender.hp = 50;
	const move = createTestMove('thunderbolt');
	
	const ctx = createTestContext(attacker, defender, move);
	const initialHp = defender.hp;
	const result = RPGAbilities.checkImmunity(ctx);
	
	assert(result !== null && result.immune === true, 'Should be immune to Electric moves');
	assert(defender.hp > initialHp, 'Should heal HP');
});

// ===== POWER MODIFIER ABILITY TESTS =====

test('Iron Fist boosts punch moves by 20%', () => {
	const attacker = createTestPokemon('hitmonchan', 'ironfist');
	const defender = createTestPokemon('machop', 'guts');
	const move = createTestMove('firepunch');
	move.flags.punch = true;
	
	const ctx = createTestContext(attacker, defender, move);
	const basePower = 75;
	const result = RPGAbilities.applyPowerModifier(ctx, basePower);
	
	assertEquals(result, 90, 'Should boost punch moves by 20%');
});

test('Strong Jaw boosts bite moves by 50%', () => {
	const attacker = createTestPokemon('dracovish', 'strongjaw');
	const defender = createTestPokemon('magikarp', 'swiftswim');
	const move = createTestMove('crunch');
	move.flags.bite = true;
	
	const ctx = createTestContext(attacker, defender, move);
	const basePower = 80;
	const result = RPGAbilities.applyPowerModifier(ctx, basePower);
	
	assertEquals(result, 120, 'Should boost bite moves by 50%');
});

test('Mega Launcher boosts pulse moves by 50%', () => {
	const attacker = createTestPokemon('blastoise', 'megalauncher');
	const defender = createTestPokemon('pikachu', 'static');
	const move = createTestMove('aurasphere');
	move.flags.pulse = true;
	
	const ctx = createTestContext(attacker, defender, move);
	const basePower = 80;
	const result = RPGAbilities.applyPowerModifier(ctx, basePower);
	
	assertEquals(result, 120, 'Should boost pulse moves by 50%');
});

test('Technician boosts low BP moves by 50%', () => {
	const attacker = createTestPokemon('scizor', 'technician');
	const defender = createTestPokemon('pikachu', 'static');
	const move = createTestMove('quickattack');
	
	const ctx = createTestContext(attacker, defender, move);
	const basePower = 40;
	const result = RPGAbilities.applyPowerModifier(ctx, basePower);
	
	assertEquals(result, 60, 'Should boost moves with BP ≤60 by 50%');
});

test('Technician does not boost high BP moves', () => {
	const attacker = createTestPokemon('scizor', 'technician');
	const defender = createTestPokemon('pikachu', 'static');
	const move = createTestMove('tackle');
	
	const ctx = createTestContext(attacker, defender, move);
	const basePower = 100;
	const result = RPGAbilities.applyPowerModifier(ctx, basePower);
	
	assertEquals(result, 100, 'Should not boost moves with BP >60');
});

test('Blaze boosts Fire moves at low HP', () => {
	const attacker = createTestPokemon('charizard', 'blaze');
	attacker.hp = 30; // Less than 1/3
	const defender = createTestPokemon('pikachu', 'static');
	const move = createTestMove('flamethrower');
	
	const ctx = createTestContext(attacker, defender, move);
	const basePower = 90;
	const result = RPGAbilities.applyPowerModifier(ctx, basePower);
	
	assertEquals(result, 135, 'Should boost Fire moves by 50% at ≤1/3 HP');
});

test('Torrent boosts Water moves at low HP', () => {
	const attacker = createTestPokemon('blastoise', 'torrent');
	attacker.hp = 30;
	const defender = createTestPokemon('pikachu', 'static');
	const move = createTestMove('surf');
	
	const ctx = createTestContext(attacker, defender, move);
	const basePower = 90;
	const result = RPGAbilities.applyPowerModifier(ctx, basePower);
	
	assertEquals(result, 135, 'Should boost Water moves by 50% at ≤1/3 HP');
});

// ===== TYPE MODIFIER ABILITY TESTS =====

test('Pixilate converts Normal moves to Fairy', () => {
	const attacker = createTestPokemon('sylveon', 'pixilate');
	const defender = createTestPokemon('pikachu', 'static');
	const move = createTestMove('hypervoice');
	
	const ctx = createTestContext(attacker, defender, move);
	const result = RPGAbilities.applyTypeModifier(ctx, 'Normal');
	
	assertEquals(result, 'Fairy', 'Should convert Normal to Fairy');
});

test('Aerilate converts Normal moves to Flying', () => {
	const attacker = createTestPokemon('salamence', 'aerilate');
	const defender = createTestPokemon('pikachu', 'static');
	const move = createTestMove('return');
	
	const ctx = createTestContext(attacker, defender, move);
	const result = RPGAbilities.applyTypeModifier(ctx, 'Normal');
	
	assertEquals(result, 'Flying', 'Should convert Normal to Flying');
});

test('Refrigerate converts Normal moves to Ice', () => {
	const attacker = createTestPokemon('aurorus', 'refrigerate');
	const defender = createTestPokemon('pikachu', 'static');
	const move = createTestMove('return');
	
	const ctx = createTestContext(attacker, defender, move);
	const result = RPGAbilities.applyTypeModifier(ctx, 'Normal');
	
	assertEquals(result, 'Ice', 'Should convert Normal to Ice');
});

// ===== STAB MODIFIER TESTS =====

test('Normal STAB is 1.5x', () => {
	const pokemon = createTestPokemon('pikachu', 'static');
	const result = RPGAbilities.getSTABMultiplier(pokemon, 'Electric');
	
	assertEquals(result, 1.5, 'Normal STAB should be 1.5x');
});

test('Adaptability STAB is 2.0x', () => {
	const pokemon = createTestPokemon('eevee', 'adaptability');
	const result = RPGAbilities.getSTABMultiplier(pokemon, 'Normal');
	
	assertEquals(result, 2.0, 'Adaptability STAB should be 2.0x');
});

test('Non-STAB is 1.0x', () => {
	const pokemon = createTestPokemon('pikachu', 'static');
	const result = RPGAbilities.getSTABMultiplier(pokemon, 'Water');
	
	assertEquals(result, 1.0, 'Non-STAB should be 1.0x');
});

// ===== ITEM INTERACTION TESTS =====

test('Sticky Hold prevents item removal', () => {
	const pokemon = createTestPokemon('grimer', 'stickyhold');
	pokemon.item = 'leftovers';
	
	const result = RPGAbilities.checkItemRemovalPrevention(pokemon);
	
	assert(result === true, 'Should prevent item removal');
});

test('Other abilities do not prevent item removal', () => {
	const pokemon = createTestPokemon('pikachu', 'static');
	pokemon.item = 'leftovers';
	
	const result = RPGAbilities.checkItemRemovalPrevention(pokemon);
	
	assert(result === false, 'Should not prevent item removal');
});

// ===== STATUS PREVENTION TESTS =====

test('Immunity prevents poison', () => {
	const pokemon = createTestPokemon('snorlax', 'immunity');
	
	const result = RPGAbilities.preventsStatus(pokemon, 'psn');
	
	assert(result === true, 'Should prevent poison');
});

test('Water Veil prevents burn', () => {
	const pokemon = createTestPokemon('goldeen', 'waterveil');
	
	const result = RPGAbilities.preventsStatus(pokemon, 'brn');
	
	assert(result === true, 'Should prevent burn');
});

test('Limber prevents paralysis', () => {
	const pokemon = createTestPokemon('hitmonlee', 'limber');
	
	const result = RPGAbilities.preventsStatus(pokemon, 'par');
	
	assert(result === true, 'Should prevent paralysis');
});

test('Insomnia prevents sleep', () => {
	const pokemon = createTestPokemon('hoothoot', 'insomnia');
	
	const result = RPGAbilities.preventsStatus(pokemon, 'slp');
	
	assert(result === true, 'Should prevent sleep');
});

// ===== GROUNDED CHECK TESTS =====

test('Flying types are not grounded', () => {
	const pokemon = createTestPokemon('pidgey', 'keeneye');
	const battle = { gravityTurns: 0, magicRoomTurns: 0 };
	
	const result = RPGAbilities.isGrounded(pokemon, battle);
	
	assert(result === false, 'Flying types should not be grounded');
});

test('Levitate makes Pokemon not grounded', () => {
	const pokemon = createTestPokemon('gengar', 'levitate');
	const battle = { gravityTurns: 0, magicRoomTurns: 0 };
	
	const result = RPGAbilities.isGrounded(pokemon, battle);
	
	assert(result === false, 'Levitate should prevent grounding');
});

test('Gravity grounds all Pokemon', () => {
	const pokemon = createTestPokemon('pidgey', 'keeneye');
	const battle = { gravityTurns: 5, magicRoomTurns: 0 };
	
	const result = RPGAbilities.isGrounded(pokemon, battle);
	
	assert(result === true, 'Gravity should ground all Pokemon');
});

test('Normal Pokemon are grounded', () => {
	const pokemon = createTestPokemon('pikachu', 'static');
	const battle = { gravityTurns: 0, magicRoomTurns: 0 };
	
	const result = RPGAbilities.isGrounded(pokemon, battle);
	
	assert(result === true, 'Normal Pokemon should be grounded');
});

// ===== SERENE GRACE TESTS =====

test('Serene Grace doubles secondary effect chance', () => {
	const attacker = createTestPokemon('togekiss', 'serenegrace');
	const defender = createTestPokemon('pikachu', 'static');
	const move = createTestMove('airslash');
	
	const ctx = createTestContext(attacker, defender, move);
	const chance = 30;
	const result = RPGAbilities.applySereneGrace(ctx, chance);
	
	assertEquals(result, 60, 'Should double secondary effect chance');
});

test('Serene Grace caps at 100%', () => {
	const attacker = createTestPokemon('togekiss', 'serenegrace');
	const defender = createTestPokemon('pikachu', 'static');
	const move = createTestMove('ironhead');
	
	const ctx = createTestContext(attacker, defender, move);
	const chance = 80;
	const result = RPGAbilities.applySereneGrace(ctx, chance);
	
	assertEquals(result, 100, 'Should cap at 100%');
});

// ===== SPEED MODIFIER TESTS =====

test('Swift Swim doubles speed in rain', () => {
	const pokemon = createTestPokemon('golduck', 'swiftswim');
	const battle = { weather: { type: 'rain', turns: 5 } };
	
	const result = RPGAbilities.applySpeedModifier(pokemon, battle, 100);
	
	assertEquals(result, 200, 'Should double speed in rain');
});

test('Chlorophyll doubles speed in sun', () => {
	const pokemon = createTestPokemon('venusaur', 'chlorophyll');
	const battle = { weather: { type: 'sun', turns: 5 } };
	
	const result = RPGAbilities.applySpeedModifier(pokemon, battle, 100);
	
	assertEquals(result, 200, 'Should double speed in sun');
});

test('Sand Rush doubles speed in sandstorm', () => {
	const pokemon = createTestPokemon('excadrill', 'sandrush');
	const battle = { weather: { type: 'sand', turns: 5 } };
	
	const result = RPGAbilities.applySpeedModifier(pokemon, battle, 100);
	
	assertEquals(result, 200, 'Should double speed in sandstorm');
});

// ===== DAMAGE MODIFIER TESTS =====

test('Multiscale halves damage at full HP', () => {
	const attacker = createTestPokemon('pikachu', 'static');
	const defender = createTestPokemon('dragonite', 'multiscale');
	defender.hp = 100;
	defender.maxHp = 100;
	const move = createTestMove('thunderbolt');
	
	const ctx = createTestContext(attacker, defender, move);
	const damage = 100;
	const result = RPGAbilities.applyDamageModifier(ctx, damage);
	
	assertEquals(result, 50, 'Should halve damage at full HP');
});

test('Fur Coat halves physical damage', () => {
	const attacker = createTestPokemon('machamp', 'guts');
	const defender = createTestPokemon('furfrou', 'furcoat');
	const move = createTestMove('closecombat');
	
	const ctx = createTestContext(attacker, defender, move);
	const damage = 100;
	const result = RPGAbilities.applyDamageModifier(ctx, damage);
	
	assertEquals(result, 50, 'Should halve physical damage');
});

// Run all tests
console.log('\n=== RUNNING ABILITY TESTS ===\n');

// Print summary
console.log('\n=== TEST SUMMARY ===');
console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
console.log(`Passed: ${testResults.passed}`);
console.log(`Failed: ${testResults.failed}`);

if (testResults.failed > 0) {
	console.log('\n=== FAILED TESTS ===');
	testResults.tests.filter(t => t.status === 'FAIL').forEach(t => {
		console.log(`✗ ${t.name}`);
		if (t.message) console.log(`  ${t.message}`);
	});
}

export { testResults };
