'use strict';

const assert = require('./../assert');
const common = require('./../common');

let battle;

describe('Battle State Persistence', () => {
	afterEach(() => {
		if (battle) battle.destroy();
		// Clear persistence state after each test
		const { globalPersistenceManager } = require('./../../.sim-dist/battle-persistence');
		globalPersistenceManager.clearAll();
	});

	it('should capture and restore Pokemon HP', () => {
		const { BattlePersistenceManager } = require('./../../.sim-dist/battle-persistence');
		const manager = new BattlePersistenceManager();

		battle = common.createBattle([
			[{ species: 'Bulbasaur', level: 50, moves: ['tackle'] }],
			[{ species: 'Charmander', level: 50, moves: ['tackle'] }],
		]);

		const pokemon = battle.p1.pokemon[0];
		const originalHP = pokemon.hp;

		// Damage the Pokemon
		pokemon.hp = Math.floor(originalHP / 2);

		// Capture state
		const state = manager.capturePokemonState(pokemon);
		assert.equal(state.hp, Math.floor(originalHP / 2));
		assert.equal(state.maxhp, originalHP);
		assert.equal(state.identifier, pokemon.name);

		// Reset HP
		pokemon.hp = originalHP;

		// Restore state
		manager.restorePokemonState(pokemon, state);
		assert.equal(pokemon.hp, Math.floor(originalHP / 2));
	});

	it('should capture and restore Pokemon status conditions', () => {
		const { BattlePersistenceManager } = require('./../../.sim-dist/battle-persistence');
		const manager = new BattlePersistenceManager();

		battle = common.createBattle([
			[{ species: 'Bulbasaur', level: 50, moves: ['tackle'] }],
			[{ species: 'Charmander', level: 50, moves: ['tackle'] }],
		]);

		const pokemon = battle.p1.pokemon[0];

		// Apply status condition
		pokemon.setStatus('par');
		assert.equal(pokemon.status, 'par');

		// Capture state
		const state = manager.capturePokemonState(pokemon);
		assert.equal(state.status, 'par');

		// Clear status
		pokemon.status = '';

		// Restore state
		manager.restorePokemonState(pokemon, state);
		assert.equal(pokemon.status, 'par');
	});

	it('should capture and restore move PP', () => {
		const { BattlePersistenceManager } = require('./../../.sim-dist/battle-persistence');
		const manager = new BattlePersistenceManager();

		battle = common.createBattle([
			[{ species: 'Bulbasaur', level: 50, moves: ['tackle', 'vinewhip'] }],
			[{ species: 'Charmander', level: 50, moves: ['tackle'] }],
		]);

		const pokemon = battle.p1.pokemon[0];
		const originalPP = pokemon.moveSlots[0].pp;

		// Use PP
		pokemon.moveSlots[0].pp = Math.floor(originalPP / 2);
		pokemon.moveSlots[1].pp = 0;

		// Capture state
		const state = manager.capturePokemonState(pokemon);
		assert.equal(state.movepp[0], Math.floor(originalPP / 2));
		assert.equal(state.movepp[1], 0);

		// Reset PP
		pokemon.moveSlots[0].pp = originalPP;
		pokemon.moveSlots[1].pp = pokemon.moveSlots[1].maxpp;

		// Restore state
		manager.restorePokemonState(pokemon, state);
		assert.equal(pokemon.moveSlots[0].pp, Math.floor(originalPP / 2));
		assert.equal(pokemon.moveSlots[1].pp, 0);
	});

	it('should save and load battle state for a side', () => {
		const { BattlePersistenceManager } = require('./../../.sim-dist/battle-persistence');
		const manager = new BattlePersistenceManager();

		battle = common.createBattle({ formatid: 'gen9ou' }, [
			[
				{ species: 'Bulbasaur', level: 50, moves: ['tackle'] },
				{ species: 'Squirtle', level: 50, moves: ['tackle'] },
			],
			[{ species: 'Charmander', level: 50, moves: ['tackle'] }],
		]);

		const side = battle.p1;
		const pokemon1 = side.pokemon[0];
		const pokemon2 = side.pokemon[1];

		// Modify Pokemon states
		pokemon1.hp = Math.floor(pokemon1.maxhp / 2);
		pokemon1.setStatus('brn');
		pokemon2.moveSlots[0].pp = 5;

		// Save state
		manager.saveBattleState(battle, side);

		// Load state
		const state = manager.loadBattleState('gen9ou', side.id, side.name);
		assert(state);
		assert.equal(state.formatid, 'gen9ou');
		assert.equal(state.playerid, side.id);
		assert.equal(state.pokemon.length, 2);
		assert.equal(state.pokemon[0].hp, Math.floor(pokemon1.maxhp / 2));
		assert.equal(state.pokemon[0].status, 'brn');
		assert.equal(state.pokemon[1].movepp[0], 5);
	});

	it('should not restore state if Pokemon names do not match', () => {
		const { BattlePersistenceManager } = require('./../../.sim-dist/battle-persistence');
		const manager = new BattlePersistenceManager();

		battle = common.createBattle([
			[{ species: 'Bulbasaur', level: 50, moves: ['tackle'] }],
			[{ species: 'Charmander', level: 50, moves: ['tackle'] }],
		]);

		const pokemon = battle.p1.pokemon[0];
		const originalHP = pokemon.hp;

		// Create state with wrong identifier
		const state = {
			identifier: 'WrongName',
			hp: Math.floor(originalHP / 2),
			maxhp: originalHP,
			status: '',
			movepp: [10],
			movemaxpp: [35],
			moveids: ['tackle'],
		};

		// Attempt to restore state
		const result = manager.restorePokemonState(pokemon, state);
		assert.equal(result, false);
		assert.equal(pokemon.hp, originalHP); // HP should not change
	});

	it('should handle multiple players with different states', () => {
		const { BattlePersistenceManager } = require('./../../.sim-dist/battle-persistence');
		const manager = new BattlePersistenceManager();

		battle = common.createBattle({ formatid: 'gen9ou' }, [
			[{ species: 'Bulbasaur', level: 50, moves: ['tackle'] }],
			[{ species: 'Charmander', level: 50, moves: ['tackle'] }],
		]);

		const p1 = battle.p1;
		const p2 = battle.p2;

		// Modify different states
		p1.pokemon[0].hp = Math.floor(p1.pokemon[0].maxhp / 2);
		p2.pokemon[0].hp = Math.floor(p2.pokemon[0].maxhp / 3);

		// Save both states
		manager.saveBattleState(battle, p1);
		manager.saveBattleState(battle, p2);

		// Load and verify different states
		const state1 = manager.loadBattleState('gen9ou', p1.id, p1.name);
		const state2 = manager.loadBattleState('gen9ou', p2.id, p2.name);

		assert(state1);
		assert(state2);
		assert.equal(state1.pokemon[0].hp, Math.floor(p1.pokemon[0].maxhp / 2));
		assert.equal(state2.pokemon[0].hp, Math.floor(p2.pokemon[0].maxhp / 3));
	});

	it('should clear battle state', () => {
		const { BattlePersistenceManager } = require('./../../.sim-dist/battle-persistence');
		const manager = new BattlePersistenceManager();

		battle = common.createBattle({ formatid: 'gen9ou' }, [
			[{ species: 'Bulbasaur', level: 50, moves: ['tackle'] }],
			[{ species: 'Charmander', level: 50, moves: ['tackle'] }],
		]);

		const side = battle.p1;

		// Save state
		manager.saveBattleState(battle, side);

		// Verify state exists
		let state = manager.loadBattleState('gen9ou', side.id, side.name);
		assert(state);

		// Clear state
		manager.clearBattleState('gen9ou', side.id, side.name);

		// Verify state is cleared
		state = manager.loadBattleState('gen9ou', side.id, side.name);
		assert.equal(state, null);
	});

	it('should clear all states', () => {
		const { BattlePersistenceManager } = require('./../../.sim-dist/battle-persistence');
		const manager = new BattlePersistenceManager();

		battle = common.createBattle({ formatid: 'gen9ou' }, [
			[{ species: 'Bulbasaur', level: 50, moves: ['tackle'] }],
			[{ species: 'Charmander', level: 50, moves: ['tackle'] }],
		]);

		// Save states for both players
		manager.saveBattleState(battle, battle.p1);
		manager.saveBattleState(battle, battle.p2);

		// Verify states exist
		assert(manager.loadBattleState('gen9ou', battle.p1.id, battle.p1.name));
		assert(manager.loadBattleState('gen9ou', battle.p2.id, battle.p2.name));

		// Clear all
		manager.clearAll();

		// Verify all states are cleared
		assert.equal(manager.loadBattleState('gen9ou', battle.p1.id, battle.p1.name), null);
		assert.equal(manager.loadBattleState('gen9ou', battle.p2.id, battle.p2.name), null);
	});

	it('should ensure HP does not exceed maxhp when restoring', () => {
		const { BattlePersistenceManager } = require('./../../.sim-dist/battle-persistence');
		const manager = new BattlePersistenceManager();

		battle = common.createBattle([
			[{ species: 'Bulbasaur', level: 50, moves: ['tackle'] }],
			[{ species: 'Charmander', level: 50, moves: ['tackle'] }],
		]);

		const pokemon = battle.p1.pokemon[0];

		// Create state with HP higher than current maxhp
		const state = {
			identifier: pokemon.name,
			hp: 9999,
			maxhp: 9999,
			status: '',
			movepp: [35],
			movemaxpp: [35],
			moveids: ['tackle'],
		};

		// Restore state
		manager.restorePokemonState(pokemon, state);

		// HP should be capped at current maxhp
		assert.equal(pokemon.hp, pokemon.maxhp);
		assert(pokemon.hp <= pokemon.maxhp);
	});

	it('should ensure PP does not exceed maxpp when restoring', () => {
		const { BattlePersistenceManager } = require('./../../.sim-dist/battle-persistence');
		const manager = new BattlePersistenceManager();

		battle = common.createBattle([
			[{ species: 'Bulbasaur', level: 50, moves: ['tackle'] }],
			[{ species: 'Charmander', level: 50, moves: ['tackle'] }],
		]);

		const pokemon = battle.p1.pokemon[0];
		const maxpp = pokemon.moveSlots[0].maxpp;

		// Create state with PP higher than current maxpp
		const state = {
			identifier: pokemon.name,
			hp: pokemon.hp,
			maxhp: pokemon.maxhp,
			status: '',
			movepp: [999],
			movemaxpp: [999],
			moveids: ['tackle'],
		};

		// Restore state
		manager.restorePokemonState(pokemon, state);

		// PP should be capped at current maxpp
		assert.equal(pokemon.moveSlots[0].pp, maxpp);
		assert(pokemon.moveSlots[0].pp <= maxpp);
	});
});

describe('Persistent Battles Ruleset', () => {
	afterEach(() => {
		if (battle) battle.destroy();
		// Clear persistence state after each test
		const { globalPersistenceManager } = require('./../../.sim-dist/battle-persistence');
		globalPersistenceManager.clearAll();
	});

	it('should restore state at the start of a battle with Persistent Battles rule', () => {
		const { globalPersistenceManager } = require('./../../.sim-dist/battle-persistence');

		// First battle
		battle = common.createBattle({ formatid: 'gen9persistentbattle' }, [
			[{ species: 'Bulbasaur', level: 50, moves: ['tackle'] }],
			[{ species: 'Charmander', level: 50, moves: ['tackle'] }],
		]);

		// Manually add the ruleset behavior
		battle.format.ruleset = ['Persistent Battles'];

		const pokemon = battle.p1.pokemon[0];
		pokemon.hp = Math.floor(pokemon.maxhp / 2);

		// Save state
		globalPersistenceManager.saveBattleState(battle, battle.p1);
		battle.destroy();

		// Second battle with same player
		battle = common.createBattle({ formatid: 'gen9persistentbattle' }, [
			[{ species: 'Bulbasaur', level: 50, moves: ['tackle'] }],
			[{ species: 'Charmander', level: 50, moves: ['tackle'] }],
		]);

		// Load state
		const state = globalPersistenceManager.loadBattleState('gen9persistentbattle', battle.p1.id, battle.p1.name);
		if (state) {
			globalPersistenceManager.restoreBattleState(battle.p1, state);
		}

		// HP should be restored
		assert(battle.p1.pokemon[0].hp < battle.p1.pokemon[0].maxhp);
	});

	it('should handle consecutive battles with changing Pokemon states', () => {
		const { globalPersistenceManager } = require('./../../.sim-dist/battle-persistence');

		// Battle 1
		battle = common.createBattle({ formatid: 'gen9gauntlet' }, [
			[
				{ species: 'Bulbasaur', level: 50, moves: ['tackle', 'vinewhip'] },
				{ species: 'Squirtle', level: 50, moves: ['tackle', 'watergun'] },
			],
			[{ species: 'Charmander', level: 50, moves: ['tackle'] }],
		]);

		const p1 = battle.p1;
		const bulbasaur = p1.pokemon[0];
		const squirtle = p1.pokemon[1];

		// Battle 1 damage
		bulbasaur.hp = Math.floor(bulbasaur.maxhp * 0.6);
		bulbasaur.moveSlots[0].pp -= 5;
		squirtle.hp = Math.floor(squirtle.maxhp * 0.9);

		globalPersistenceManager.saveBattleState(battle, p1);
		battle.destroy();

		// Battle 2
		battle = common.createBattle({ formatid: 'gen9gauntlet' }, [
			[
				{ species: 'Bulbasaur', level: 50, moves: ['tackle', 'vinewhip'] },
				{ species: 'Squirtle', level: 50, moves: ['tackle', 'watergun'] },
			],
			[{ species: 'Charmander', level: 50, moves: ['tackle'] }],
		]);

		// Restore from Battle 1
		let state = globalPersistenceManager.loadBattleState('gen9gauntlet', battle.p1.id, battle.p1.name);
		if (state) {
			globalPersistenceManager.restoreBattleState(battle.p1, state);
		}

		const bulbasaur2 = battle.p1.pokemon[0];
		const squirtle2 = battle.p1.pokemon[1];

		// Verify Battle 1 state restored
		assert.equal(bulbasaur2.hp, Math.floor(bulbasaur.maxhp * 0.6));
		assert.equal(squirtle2.hp, Math.floor(squirtle.maxhp * 0.9));

		// Battle 2 additional damage
		bulbasaur2.hp = Math.floor(bulbasaur2.maxhp * 0.3);
		bulbasaur2.setStatus('brn');
		squirtle2.hp = Math.floor(squirtle2.maxhp * 0.5);

		globalPersistenceManager.saveBattleState(battle, battle.p1);
		battle.destroy();

		// Battle 3
		battle = common.createBattle({ formatid: 'gen9gauntlet' }, [
			[
				{ species: 'Bulbasaur', level: 50, moves: ['tackle', 'vinewhip'] },
				{ species: 'Squirtle', level: 50, moves: ['tackle', 'watergun'] },
			],
			[{ species: 'Charmander', level: 50, moves: ['tackle'] }],
		]);

		// Restore from Battle 2
		state = globalPersistenceManager.loadBattleState('gen9gauntlet', battle.p1.id, battle.p1.name);
		if (state) {
			globalPersistenceManager.restoreBattleState(battle.p1, state);
		}

		const bulbasaur3 = battle.p1.pokemon[0];
		const squirtle3 = battle.p1.pokemon[1];

		// Verify Battle 2 state restored
		assert.equal(bulbasaur3.hp, Math.floor(bulbasaur.maxhp * 0.3));
		assert.equal(bulbasaur3.status, 'brn');
		assert.equal(squirtle3.hp, Math.floor(squirtle.maxhp * 0.5));
	});
});
