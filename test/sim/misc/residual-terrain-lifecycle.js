'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Residual terrain lifecycle', () => {
	afterEach(() => battle.destroy());

	function createBattle(options) {
		battle = common.createBattle(options, [[
			{ species: 'bulbasaur', moves: ['sleeptalk'] },
		], [{ species: 'wynaut', moves: ['sleeptalk'] }]]);
		for (const pokemon of battle.getAllActive()) pokemon.hp -= 50;
		return battle.p1.active[0];
	}

	for (const [order, duration, lastTurn] of [[26, 4, 5], [28, 5, 6]]) {
		it(`should not catch up healing for terrain started at order ${order}, ending on turn ${lastTurn}`, () => {
			const source = createBattle();
			const targets = battle.getAllActive();
			const hp = targets.map(pokemon => pokemon.hp);
			battle.onEvent('Residual', battle.format, { order }, target => {
				if (battle.turn === 1 && target === source) battle.field.setTerrain('grassyterrain', source);
			});
			const start = battle.log.length;
			battle.makeChoices();
			assert.deepEqual(targets.map(pokemon => pokemon.hp), hp);
			assert.equal(battle.field.terrain, 'grassyterrain');
			assert.equal(battle.field.terrainState.duration, duration);
			const log = battle.log.slice(start);
			assert(log.some(line => line.startsWith('|-fieldstart|move: Grassy Terrain')));
			assert.false(log.some(line => line.startsWith('|-heal|')));
			for (let turn = 2; turn < lastTurn; turn++) {
				battle.makeChoices();
				assert.equal(battle.field.terrainState.duration, lastTurn - turn);
				assert.equal(battle.field.terrain, 'grassyterrain');
			}
			battle.makeChoices();
			assert.equal(battle.field.terrain, '');
			assert.equal(battle.turn, lastTurn + 1);
			assert.equal(battle.log.filter(line => line === '|-fieldend|move: Grassy Terrain').length, 1);
		});
	}

	it('should expire a terrain started during residuals after eight turns with Terrain Extender', () => {
		const source = createBattle();
		source.setItem('terrainextender');
		const hp = source.hp;
		battle.onEvent('Residual', battle.format, { order: 3 }, target => {
			if (battle.turn === 1 && target === source) battle.field.setTerrain('grassyterrain', source);
		});
		battle.makeChoices();
		assert.equal(source.hp, hp + Math.floor(source.baseMaxhp / 16));
		assert.equal(battle.field.terrainState.duration, 7);
		for (let turn = 2; turn <= 7; turn++) {
			battle.makeChoices();
			assert.equal(battle.field.terrainState.duration, 8 - turn);
			assert.equal(battle.field.terrain, 'grassyterrain');
		}
		battle.makeChoices();
		assert.equal(battle.field.terrain, '');
		assert.equal(battle.turn, 9);
	});

	it('should still check grounding, semi-invulnerability and full HP when a new terrain heals', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'tornadus', moves: ['fly'] },
			{ species: 'pikachu', moves: ['sleeptalk'] },
		], [
			{ species: 'dugtrio', moves: ['dig'] },
			{ species: 'snorlax', moves: ['sleeptalk'] },
		]]);
		const [flying, grounded] = battle.p1.active;
		const [digging, full] = battle.p2.active;
		for (const pokemon of [flying, grounded, digging]) pokemon.hp -= 50;
		const hp = [flying.hp, grounded.hp, digging.hp];
		battle.onEvent('Residual', battle.format, { order: 3 }, target => {
			if (target === grounded) battle.field.setTerrain('grassyterrain', grounded);
		});
		const start = battle.log.length;
		battle.makeChoices('move fly 1, move sleeptalk', 'move dig 1, move sleeptalk');
		assert(flying.isSemiInvulnerable());
		assert(digging.isSemiInvulnerable());
		assert.equal(flying.hp, hp[0]);
		assert.equal(grounded.hp, hp[1] + Math.floor(grounded.baseMaxhp / 16));
		assert.equal(digging.hp, hp[2]);
		assert.equal(full.hp, full.maxhp);
		assert.equal(battle.field.terrainState.duration, 4);
		const heals = battle.log.slice(start).filter(line => line.startsWith('|-heal|'));
		assert(heals.length > 0);
		assert(heals.every(line => line.startsWith('|-heal|p1b: Pikachu|') && line.endsWith('[from] Grassy Terrain')));
	});

	it('should invalidate all pending handlers after removing terrain without replacing it', () => {
		const source = createBattle();
		battle.field.setTerrain('grassyterrain', source);
		const old = battle.field.terrainState;
		const hp = battle.getAllActive().map(pokemon => pokemon.hp);
		battle.onEvent('Residual', battle.format, { order: 3 }, target => {
			if (target === source) battle.field.clearTerrain();
		});
		const start = battle.log.length;
		battle.makeChoices();
		assert.equal(battle.field.terrain, '');
		assert.equal(old.id, '');
		assert.equal(old.duration, undefined);
		assert.deepEqual(battle.getAllActive().map(pokemon => pokemon.hp), hp);
		const log = battle.log.slice(start);
		assert.equal(log.filter(line => line === '|-fieldend|move: Grassy Terrain').length, 1);
		assert.false(log.some(line => line.startsWith('|-heal|')));
	});

	it('should resolve Grassy to Electric to Grassy as a new instance with only one countdown', () => {
		const source = createBattle();
		battle.field.setTerrain('grassyterrain', source);
		const old = battle.field.terrainState;
		const hp = source.hp;
		battle.onEvent('Residual', battle.format, { order: 3 }, target => {
			if (target !== source) return;
			battle.field.setTerrain('electricterrain', source);
			battle.field.setTerrain('grassyterrain', source);
		});
		const start = battle.log.length;
		battle.makeChoices();
		assert.notEqual(battle.field.terrainState, old);
		assert.equal(old.duration, 5, 'The old instance must not count down after replacement');
		assert.equal(battle.field.terrainState.duration, 4);
		assert.equal(source.hp, hp + Math.floor(source.baseMaxhp / 16));
		const log = battle.log.slice(start);
		const electric = log.findIndex(line => line.startsWith('|-fieldstart|move: Electric Terrain'));
		const grassy = log.findIndex(line => line.startsWith('|-fieldstart|move: Grassy Terrain'));
		const heal = log.findIndex(line => line.startsWith('|-heal|'));
		assert(electric >= 0 && electric < grassy && grassy < heal);
	});

	it('should preserve the original queue if a recursive FieldStart is rolled back', () => {
		const source = createBattle();
		battle.field.setTerrain('grassyterrain', source);
		const old = battle.field.terrainState;
		const hp = source.hp;
		const singleEvent = battle.singleEvent;
		battle.singleEvent = function (eventid, effect, ...args) {
			if (eventid === 'FieldStart' && effect.id === 'psychicterrain') {
				this.field.setTerrain('electricterrain', source);
				return false;
			}
			return singleEvent.call(this, eventid, effect, ...args);
		};
		battle.onEvent('Residual', battle.format, { order: 3 }, target => {
			if (target === source) assert.equal(battle.field.setTerrain('psychicterrain', source), false);
		});
		battle.makeChoices();
		assert.equal(battle.field.terrain, 'grassyterrain');
		assert.equal(battle.field.terrainState, old);
		assert.equal(old.duration, 4);
		assert.equal(source.hp, hp + Math.floor(source.baseMaxhp / 16));
	});

	it('should schedule the final instance after recursive TerrainChange callbacks', () => {
		const source = createBattle();
		const hp = source.hp;
		let changed = false;
		let originalState;
		battle.onEvent('TerrainChange', battle.format, target => {
			if (changed || target !== source || battle.field.terrain !== 'grassyterrain') return;
			changed = true;
			originalState = battle.field.terrainState;
			battle.field.setTerrain('electricterrain', source);
			battle.field.setTerrain('grassyterrain', source);
		});
		battle.onEvent('Residual', battle.format, { order: 3 }, target => {
			if (target === source) battle.field.setTerrain('grassyterrain', source);
		});
		battle.makeChoices();
		assert(changed);
		assert.notEqual(battle.field.terrainState, originalState);
		assert.equal(originalState.duration, 5);
		assert.equal(battle.field.terrainState.duration, 4);
		assert.equal(source.hp, hp + Math.floor(source.baseMaxhp / 16));
	});

	it('should finish terrain work even when it is created by the last initially queued handler', () => {
		const source = createBattle();
		const hp = source.hp;
		const opponentHP = battle.p2.active[0].hp;
		battle.onEvent('Residual', battle.format, { order: 3 }, target => {
			if (target === source) battle.field.setTerrain('grassyterrain', source);
		});
		battle.fieldEvent('Residual', [source]);
		assert.equal(source.hp, hp + Math.floor(source.baseMaxhp / 16));
		assert.equal(battle.p2.active[0].hp, opponentHP, 'The explicit target filter must still apply');
		assert.equal(battle.field.terrainState.duration, 4);
		assert.equal(battle.residualEvent, undefined);
	});

	it('should restore the outer scheduler after a nested Residual call', () => {
		const source = createBattle();
		const hp = source.hp;
		let nested = false;
		battle.onEvent('Residual', battle.format, { order: 3 }, target => {
			if (target !== source) return;
			if (nested) {
				battle.field.setTerrain('grassyterrain', source);
				return;
			}
			nested = true;
			const outer = battle.residualEvent;
			battle.fieldEvent('Residual', [source]);
			assert.equal(battle.residualEvent, outer);
			battle.field.setTerrain('mistyterrain', source);
		});
		battle.fieldEvent('Residual', [source]);
		assert.equal(source.hp, hp + Math.floor(source.baseMaxhp / 16), 'Only the inner call has Grassy healing');
		assert.equal(battle.field.terrain, 'mistyterrain');
		assert.equal(battle.field.terrainState.duration, 4, 'The outer call counts down its new instance once');
		assert.equal(battle.residualEvent, undefined);
	});

	it('should clear the scheduler on an exception and leave SwitchIn terrain timing unchanged', () => {
		const source = createBattle();
		const hp = source.hp;
		const failure = new Error('Residual lifecycle test');
		battle.onEvent('Residual', battle.format, { order: 3 }, () => { throw failure; });
		assert.throws(() => battle.fieldEvent('Residual', [source]), error => error === failure);
		assert.equal(battle.residualEvent, undefined);
		battle.onEvent('SwitchIn', battle.format, target => {
			if (target === source) battle.field.setTerrain('grassyterrain', source);
		});
		battle.fieldEvent('SwitchIn', [source]);
		assert.equal(battle.field.terrainState.duration, 5);
		assert.equal(source.hp, hp);
		assert.equal(battle.residualEvent, undefined);
	});

	it('should skip newly queued healing and countdown if fainting ends the battle', () => {
		const source = createBattle();
		const hp = source.hp;
		battle.onEvent('Residual', battle.format, { order: 3 }, target => {
			if (target !== source) return;
			battle.field.setTerrain('grassyterrain', source);
			battle.p2.active[0].faint();
		});
		const start = battle.log.length;
		battle.makeChoices();
		assert(battle.ended);
		assert.equal(source.hp, hp);
		assert.equal(battle.field.terrain, 'grassyterrain');
		assert.equal(battle.field.terrainState.duration, 5);
		assert.equal(battle.residualEvent, undefined);
		const log = battle.log.slice(start);
		const terrain = log.findIndex(line => line.startsWith('|-fieldstart|'));
		const faint = log.findIndex(line => line.startsWith('|faint|'));
		const win = log.findIndex(line => line.startsWith('|win|'));
		assert(terrain >= 0 && terrain < faint && faint < win);
		assert.false(log.some(line => line.startsWith('|-heal|')));
	});

	it('should keep weather and pseudo-weather countdowns independent of terrain reconciliation', () => {
		const source = createBattle();
		const hp = source.hp;
		battle.field.setWeather('raindance', source);
		battle.field.addPseudoWeather('trickroom', source);
		battle.onEvent('Residual', battle.format, { order: 3 }, target => {
			if (battle.turn === 1 && target === source) battle.field.setTerrain('grassyterrain', source);
		});
		for (let turn = 1; turn <= 4; turn++) {
			battle.makeChoices();
			assert.equal(battle.field.weatherState.duration, 5 - turn);
			assert.equal(battle.field.pseudoWeather.trickroom.duration, 5 - turn);
			assert.equal(battle.field.terrainState.duration, 5 - turn);
			if (turn === 1) assert.equal(source.hp, hp + Math.floor(source.baseMaxhp / 16));
		}
		battle.makeChoices();
		assert.equal(battle.field.weather, '');
		assert.equal(battle.field.terrain, '');
		assert.false(battle.field.getPseudoWeather('trickroom'));
	});

	for (const [gen, terrain] of [[6, 'grassyterrain'], [7, 'psychicterrain'], [8, 'electricterrain'], [9, 'mistyterrain']]) {
		it(`should schedule ${terrain} with its existing duration rules in Gen ${gen}`, () => {
			battle = common.gen(gen).createBattle([[
				{ species: 'bulbasaur', moves: ['sleeptalk'] },
			], [{ species: 'wynaut', moves: ['sleeptalk'] }]]);
			const source = battle.p1.active[0];
			source.hp -= 50;
			const hp = source.hp;
			battle.onEvent('Residual', battle.format, { order: 3 }, target => {
				if (battle.turn === 1 && target === source) battle.field.setTerrain(terrain, source);
			});
			battle.makeChoices();
			assert.equal(source.hp, hp + (terrain === 'grassyterrain' ? Math.floor(source.baseMaxhp / 16) : 0));
			assert.equal(battle.field.terrain, terrain);
			assert.equal(battle.field.terrainState.duration, 4);
			for (let turn = 2; turn <= 4; turn++) {
				battle.makeChoices();
				assert.equal(battle.field.terrain, terrain);
				assert.equal(battle.field.terrainState.duration, 5 - turn);
			}
			battle.makeChoices();
			assert.equal(battle.field.terrain, '');
			assert.equal(battle.turn, 6);
		});
	}

	it('should exclude an active scheduler from serialized battle state', () => {
		const source = createBattle();
		battle.field.setTerrain('grassyterrain', source);
		const singleEvent = battle.singleEvent;
		let checked = false;
		battle.singleEvent = function (eventid, effect, ...args) {
			if (eventid === 'Residual' && effect.id === 'grassyterrain') {
				checked = true;
				assert.false(Object.hasOwn(this.toJSON(), 'residualEvent'));
			}
			return singleEvent.call(this, eventid, effect, ...args);
		};
		battle.makeChoices();
		assert(checked);
		const restored = battle.constructor.fromJSON(battle.toJSON());
		try {
			assert.equal(restored.field.terrain, 'grassyterrain');
			assert.equal(restored.field.terrainState.duration, 4);
			assert.equal(restored.p1.active[0].hp, source.hp);
			assert.equal(restored.residualEvent, undefined);
		} finally {
			restored.destroy();
		}
	});
});
