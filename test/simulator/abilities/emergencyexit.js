'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

const EMPTY_IVS = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};

describe(`Emergency Exit`, function () {
	afterEach(() => battle.destroy());

	it(`should request switch-out if damaged below 50% HP`, function () {
		battle = common.createBattle([
			[{species: "Golisopod", ability: 'emergencyexit', moves: ['sleeptalk'], ivs: EMPTY_IVS}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
			[{species: "Raticate", ability: 'guts', moves: ['superfang']}],
		]);
		const eePokemon = battle.p1.active[0];
		battle.commitDecisions();
		assert.atMost(eePokemon.hp, eePokemon.maxhp / 2);
		assert.strictEqual(battle.currentRequest, 'switch');
	});

	it(`should not request switch-out on usage of Substitute`, function () {
		battle = common.createBattle([
			[{species: "Golisopod", ability: 'emergencyexit', moves: ['substitute'], ivs: EMPTY_IVS}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
			[{species: "Deoxys-Attack", ability: 'pressure', item: 'laggingtail', moves: ['thunderbolt']}],
		]);
		const eePokemon = battle.p1.active[0];
		battle.commitDecisions();
		assert.false.atMost(eePokemon.hp, eePokemon.maxhp / 2);
		battle.commitDecisions();
		assert.atMost(eePokemon.hp, eePokemon.maxhp / 2);
		assert.strictEqual(battle.currentRequest, 'move');
	});

	it(`should prevent Volt Switch after-switches`, function () {
		battle = common.createBattle([
			[{species: "Golisopod", ability: 'emergencyexit', moves: ['sleeptalk'], ivs: EMPTY_IVS}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
			[{species: "Zekrom", ability: 'pressure', moves: ['voltswitch']}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
		]);
		const eePokemon = battle.p1.active[0];
		battle.commitDecisions();
		assert.atMost(eePokemon.hp, eePokemon.maxhp / 2);

		assert.false.holdsItem(eePokemon);
		assert.strictEqual(battle.currentRequest, 'switch');

		battle.commitDecisions();
		assert.species(battle.p1.active[0], 'Clefable');
		assert.species(battle.p2.active[0], 'Zekrom');
	});

	it(`should not prevent Red Card's activation`, function () {
		battle = common.createBattle([
			[{species: "Golisopod", ability: 'emergencyexit', item: 'redcard', moves: ['sleeptalk'], ivs: EMPTY_IVS}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
			[{species: "Raticate", ability: 'guts', moves: ['superfang']}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
		]);
		const eePokemon = battle.p1.active[0];
		battle.commitDecisions();
		assert.atMost(eePokemon.hp, eePokemon.maxhp / 2);

		assert.false.holdsItem(eePokemon);
		assert.strictEqual(battle.currentRequest, 'switch');

		battle.commitDecisions();
		assert.species(battle.p1.active[0], 'Clefable');
		assert.species(battle.p2.active[0], 'Clefable');
	});

	it(`should not prevent Eject Button's activation`, function () {
		battle = common.createBattle([
			[{species: "Golisopod", ability: 'emergencyexit', item: 'ejectbutton', moves: ['sleeptalk'], ivs: EMPTY_IVS}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
			[{species: "Raticate", ability: 'guts', moves: ['superfang']}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
		]);
		const eePokemon = battle.p1.active[0];
		battle.commitDecisions();
		assert.atMost(eePokemon.hp, eePokemon.maxhp / 2);

		assert.false.holdsItem(eePokemon);
		assert.strictEqual(battle.currentRequest, 'switch');

		battle.commitDecisions();
		assert.species(battle.p1.active[0], 'Clefable');
	});

	it(`should be suppressed by Sheer Force`, function () {
		battle = common.createBattle([
			[{species: "Golisopod", ability: 'emergencyexit', moves: ['sleeptalk'], ivs: EMPTY_IVS}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
			[{species: "Nidoking", ability: 'sheerforce', moves: ['thunder']}],
		]);
		const eePokemon = battle.p1.active[0];
		battle.commitDecisions();
		assert.atMost(eePokemon.hp, eePokemon.maxhp / 2);
		assert.strictEqual(battle.currentRequest, 'move');
	});
});
