/**
 * Standalone test for battle persistence
 * Runs without mocha/server dependencies to verify core functionality
 */

const { Battle } = require('./dist/sim/battle');
const { Dex } = require('./dist/sim/dex');
const { BattlePersistenceManager } = require('./dist/sim/battle-persistence');

console.log('=== Testing Battle Persistence System ===\n');

// Test 1: Create a manager and capture Pokemon state
console.log('Test 1: Capture and restore Pokemon HP');
const manager = new BattlePersistenceManager();

// Create a mock Pokemon-like object for testing
const mockBattle = {
	format: { id: 'gen9ou' },
	dex: Dex,
	sides: [],
};

const mockPokemon = {
	name: 'Pikachu',
	hp: 100,
	maxhp: 200,
	status: '',
	moveSlots: [
		{ id: 'thunderbolt', pp: 10, maxpp: 15 },
		{ id: 'quickattack', pp: 20, maxpp: 30 },
	],
	setStatus: function(status) { this.status = status; },
};

// Capture state
const captured = manager.capturePokemonState(mockPokemon);
console.log('✓ Captured state:', {
	hp: captured.hp,
	maxhp: captured.maxhp,
	status: captured.status,
	movepp: captured.movepp,
});

// Modify Pokemon
mockPokemon.hp = 200;
mockPokemon.moveSlots[0].pp = 15;

// Restore state
const restored = manager.restorePokemonState(mockPokemon, captured);
console.log('✓ Restored state successfully:', restored);
console.log('✓ HP restored to:', mockPokemon.hp, '(expected: 100)');
console.log('✓ Move PP restored to:', mockPokemon.moveSlots[0].pp, '(expected: 10)');

if (mockPokemon.hp !== 100 || mockPokemon.moveSlots[0].pp !== 10) {
	console.log('✗ FAILED: State not restored correctly\n');
	process.exit(1);
}
console.log('✓ Test 1 PASSED\n');

// Test 2: Status condition persistence
console.log('Test 2: Status condition persistence');
mockPokemon.status = 'par';
const captured2 = manager.capturePokemonState(mockPokemon);
console.log('✓ Captured status:', captured2.status);

mockPokemon.status = '';
manager.restorePokemonState(mockPokemon, captured2);
console.log('✓ Restored status:', mockPokemon.status);

if (mockPokemon.status !== 'par') {
	console.log('✗ FAILED: Status not restored correctly\n');
	process.exit(1);
}
console.log('✓ Test 2 PASSED\n');

// Test 3: Save and load battle state
console.log('Test 3: Save and load battle state');
const mockSide = {
	id: 'p1',
	name: 'Player 1',
	pokemon: [mockPokemon],
};
mockBattle.sides = [mockSide];

manager.saveBattleState(mockBattle, mockSide);
console.log('✓ Saved battle state');

const loaded = manager.loadBattleState('gen9ou', 'p1', 'Player 1');
console.log('✓ Loaded battle state:', {
	formatid: loaded.formatid,
	playerid: loaded.playerid,
	pokemonCount: loaded.pokemon.length,
});

if (!loaded || loaded.pokemon.length !== 1) {
	console.log('✗ FAILED: Battle state not saved/loaded correctly\n');
	process.exit(1);
}
console.log('✓ Test 3 PASSED\n');

// Test 4: Validation - HP capping
console.log('Test 4: Validation - HP capping');
const overflowState = {
	identifier: 'Pikachu',
	hp: 9999,
	maxhp: 9999,
	status: '',
	movepp: [15, 30],
	movemaxpp: [15, 30],
	moveids: ['thunderbolt', 'quickattack'],
};

mockPokemon.hp = 200;
mockPokemon.maxhp = 200;
manager.restorePokemonState(mockPokemon, overflowState);

console.log('✓ HP capped correctly:', mockPokemon.hp, '(maxhp:', mockPokemon.maxhp, ')');

if (mockPokemon.hp > mockPokemon.maxhp) {
	console.log('✗ FAILED: HP validation failed\n');
	process.exit(1);
}
console.log('✓ Test 4 PASSED\n');

// Test 5: Validation - Name mismatch
console.log('Test 5: Validation - Name mismatch');
const wrongNameState = {
	identifier: 'Charizard',
	hp: 100,
	maxhp: 200,
	status: '',
	movepp: [15, 30],
	movemaxpp: [15, 30],
	moveids: ['thunderbolt', 'quickattack'],
};

const originalHp = mockPokemon.hp;
const result = manager.restorePokemonState(mockPokemon, wrongNameState);

console.log('✓ Restoration rejected:', !result);
console.log('✓ HP unchanged:', mockPokemon.hp === originalHp);

if (result || mockPokemon.hp !== originalHp) {
	console.log('✗ FAILED: Should reject mismatched names\n');
	process.exit(1);
}
console.log('✓ Test 5 PASSED\n');

// Test 6: Clear state
console.log('Test 6: Clear state');
manager.clearBattleState('gen9ou', 'p1', 'Player 1');
const clearedState = manager.loadBattleState('gen9ou', 'p1', 'Player 1');

console.log('✓ State cleared:', clearedState === null);

if (clearedState !== null) {
	console.log('✗ FAILED: State not cleared\n');
	process.exit(1);
}
console.log('✓ Test 6 PASSED\n');

// Test 7: Battle.persistenceManager accessible
console.log('Test 7: Battle.persistenceManager accessible');
console.log('✓ Battle.persistenceManager exists:', !!Battle.persistenceManager);
console.log('✓ Is BattlePersistenceManager:', Battle.persistenceManager instanceof BattlePersistenceManager);

if (!Battle.persistenceManager || !(Battle.persistenceManager instanceof BattlePersistenceManager)) {
	console.log('✗ FAILED: Battle.persistenceManager not properly set up\n');
	process.exit(1);
}
console.log('✓ Test 7 PASSED\n');

console.log('=== ALL TESTS PASSED ===');
console.log('\n✓ Battle Persistence System is working correctly!');
console.log('✓ HP, PP, and status conditions can persist between battles');
console.log('✓ Validation prevents HP/PP overflow');
console.log('✓ Name validation prevents incorrect restoration');
console.log('✓ State can be saved, loaded, and cleared');
console.log('✓ Integration with Battle class is successful\n');
