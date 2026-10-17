'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Residual terrain scheduling', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should count down a same-id replacement set after healing but before FieldResidual', () => {
		battle = common.createBattle([[{ species: 'bulbasaur', moves: ['sleeptalk'] }], [{ species: 'wynaut', moves: ['sleeptalk'] }]]);
		const source = battle.p1.active[0];
		battle.field.setTerrain('electricterrain', source);
		const oldState = battle.field.terrainState;
		let replaced = false;
		battle.onEvent('Residual', battle.format, { order: 26 }, function (target) {
			if (target !== source || replaced) return;
			replaced = true;
			this.field.clearTerrain();
			this.field.setTerrain('electricterrain', target);
		});

		battle.makeChoices();

		assert(replaced);
		assert.equal(oldState.id, '', `Clearing terrain should invalidate the previous EffectState.`);
		assert.notEqual(battle.field.terrainState, oldState, `Re-adding the same terrain should create a new EffectState.`);
		assert(battle.field.isTerrain('electricterrain'));
		assert.equal(battle.field.terrainState.duration, 4, `The replacement should count down in the later FieldResidual phase.`);
	});

	it('should leave a terrain set after FieldResidual at its full duration', () => {
		battle = common.createBattle([[{ species: 'bulbasaur', moves: ['sleeptalk'] }], [{ species: 'wynaut', moves: ['sleeptalk'] }]]);
		const source = battle.p1.active[0];
		let set = false;
		battle.onEvent('Residual', battle.format, { order: 28 }, function (target) {
			if (target !== source || set) return;
			set = true;
			this.field.setTerrain('electricterrain', target);
		});

		battle.makeChoices();

		assert(set);
		assert(battle.field.isTerrain('electricterrain'));
		assert.equal(battle.field.terrainState.duration, 5, `A terrain set after FieldResidual must not lose a turn immediately.`);
	});

	it('should discard a removed terrain handler before its same-turn healing callback', () => {
		battle = common.createBattle([[{ species: 'bulbasaur', moves: ['sleeptalk'] }], [{ species: 'wynaut', moves: ['sleeptalk'] }]]);
		const faster = battle.p1.active[0];
		faster.hp -= 40;
		const hp = faster.hp;
		let cleared = false;
		battle.field.setTerrain('grassyterrain', faster);
		const terrainState = battle.field.terrainState;
		battle.onEvent('Residual', battle.format, { order: 4 }, function () {
			if (cleared) return;
			cleared = true;
			this.field.clearTerrain();
		});

		battle.makeChoices();

		assert(cleared);
		assert.equal(terrainState.id, '', `Clearing terrain should invalidate its EffectState.`);
		assert.equal(faster.hp, hp, `The cleared terrain's queued healing handler must not run.`);
		assert.equal(battle.field.terrain, '');
	});

	it('should compare speed before subOrder when inserting same-block terrain handlers', () => {
		battle = common.createBattle([[{ species: 'bulbasaur', moves: ['sleeptalk'] }], [{ species: 'wynaut', moves: ['sleeptalk'] }]]);
		const faster = battle.p1.active[0];
		const slower = battle.p2.active[0];
		faster.hp -= 40;
		slower.hp -= 40;
		const fasterHP = faster.hp;
		const slowerHP = slower.hp;
		let set = false;
		battle.onEvent('Residual', battle.format, { order: 5, subOrder: 1 }, function (target) {
			if (target !== faster || set) return;
			set = true;
			// Format callbacks use the Battle as their holder (speed 0). Put one target on either side of that cursor.
			faster.speed = 1;
			slower.speed = -1;
			this.field.setTerrain('grassyterrain', faster);
		});

		battle.makeChoices();

		assert(set);
		assert.equal(faster.hp, fasterHP, `The faster handler sorts before the current format callback and has passed.`);
		assert.equal(slower.hp, slowerHP + Math.floor(slower.maxhp / 16),
			`The slower handler sorts after the callback by speed, even though its subOrder is later.`);
		assert.equal(battle.field.terrainState.duration, 4, `FieldResidual is a separate later phase.`);
	});

	it('should compare subOrder before inserting same-speed handlers at the current order', () => {
		battle = common.createBattle([[{ species: 'bulbasaur', moves: ['sleeptalk'] }], [{ species: 'wynaut', moves: ['sleeptalk'] }]]);
		const targets = battle.getAllActive();
		for (const pokemon of targets) {
			pokemon.speed = 0;
			pokemon.hp -= 40;
		}
		const hp = targets.map(pokemon => pokemon.hp);
		let set = false;
		battle.onEvent('Residual', battle.format, { order: 5, subOrder: 3 }, function (target) {
			if (target !== targets[0] || set) return;
			set = true;
			for (const pokemon of targets) pokemon.speed = 0;
			this.field.setTerrain('grassyterrain', target);
		});

		battle.makeChoices();

		assert(set);
		assert.deepEqual(targets.map(pokemon => pokemon.hp), hp,
			`Terrain healing has subOrder 2, so it sorts before this speed-tied subOrder-3 callback.`);
		assert.equal(battle.field.terrainState.duration, 4, `FieldResidual is a separate later phase.`);
	});

	it('should compare priority before inserting same-order terrain handlers', () => {
		battle = common.createBattle([[{ species: 'bulbasaur', moves: ['sleeptalk'] }], [{ species: 'wynaut', moves: ['sleeptalk'] }]]);
		const targets = battle.getAllActive();
		for (const pokemon of targets) {
			pokemon.speed = 0;
			pokemon.hp -= 40;
		}
		const hp = targets.map(pokemon => pokemon.hp);
		let set = false;
		battle.onEvent('Residual', battle.format, { order: 5, priority: -1, subOrder: 1 }, function (target) {
			if (target !== targets[0] || set) return;
			set = true;
			for (const pokemon of targets) pokemon.speed = 0;
			this.field.setTerrain('grassyterrain', target);
		});

		battle.makeChoices();

		assert(set);
		assert.deepEqual(targets.map(pokemon => pokemon.hp), hp,
			`Terrain priority 0 sorts before this same-order, speed-tied priority -1 callback.`);
		assert.equal(battle.field.terrainState.duration, 4, `The later FieldResidual phase should still count down.`);
	});
});
