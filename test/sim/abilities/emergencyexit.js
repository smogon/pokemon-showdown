'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

const EMPTY_IVS = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};

describe(`Emergency Exit`, function () {
	afterEach(() => battle.destroy());

	it(`should request switch-out if damaged below 50% HP`, function () {
		battle = common.createBattle([
			[{species: "Golisopod", ability: 'emergencyexit', moves: ['superfang'], ivs: EMPTY_IVS}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
			[{species: "Raticate", ability: 'guts', moves: ['superfang']}],
		]);
		const eePokemon = battle.p1.active[0];
		const foePokemon = battle.p2.active[0];
		battle.makeChoices('move superfang', 'move superfang');
		assert.strictEqual(foePokemon.hp, foePokemon.maxhp);
		assert.atMost(eePokemon.hp, eePokemon.maxhp / 2);
		assert.strictEqual(battle.requestState, 'switch');
	});

	it(`should not request switch-out if attacked and healed by berry`, function () {
		battle = common.createBattle([
			[{species: "Golisopod", ability: 'emergencyexit', moves: ['sleeptalk'], item: 'sitrusberry', ivs: EMPTY_IVS}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
			[{species: "Raticate", ability: 'guts', moves: ['superfang']}],
		]);
		battle.makeChoices('move sleeptalk', 'move superfang');
		assert.strictEqual(battle.requestState, 'move');
	});

	it(`should not request switch-out if fainted`, function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Vikavolt', item: 'choicespecs', moves: ['thunderbolt']},
			{species: 'Pyukumuku', moves: ['batonpass']},
			{species: 'Magikarp', moves: ['splash']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Golisopod', ability: 'emergencyexit', moves: ['sleeptalk']},
			{species: 'Mew', moves: ['sleeptalk']},
			{species: 'Ditto', moves: ['transform']},
		]});
		battle.makeChoices('move thunderbolt 1, move batonpass', 'move sleeptalk, move sleeptalk');
		assert(!battle.p2.activeRequest.forceSwitch);
	});

	it(`should not request switch-out after taking residual damage and getting healed by berry`, function () {
		battle = common.createBattle([
			[{species: "Golisopod", ability: 'emergencyexit', moves: ['uturn', 'sleeptalk'], item: 'sitrusberry'}, {species: "Magikarp", ability: 'swiftswim', moves: ['splash']}],
			[{species: "Ferrothorn", ability: 'ironbarbs', moves: ['stealthrock', 'spikes', 'protect']}],
		]);
		battle.makeChoices('move uturn', 'move stealthrock');
		battle.makeChoices('switch 2', '');
		battle.makeChoices('move splash', 'move spikes');
		battle.makeChoices('move splash', 'move spikes');
		battle.makeChoices('move splash', 'move spikes');
		battle.makeChoices('switch 2', 'move protect');
		assert.strictEqual(battle.requestState, 'move');
	});

	it(`should not request switch-out on usage of Substitute`, function () {
		battle = common.createBattle([
			[{species: "Golisopod", ability: 'emergencyexit', moves: ['substitute'], ivs: EMPTY_IVS}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
			[{species: "Deoxys-Attack", ability: 'pressure', item: 'laggingtail', moves: ['thunderbolt']}],
		]);
		const eePokemon = battle.p1.active[0];
		battle.makeChoices('move substitute', 'move thunderbolt');
		assert.false.atMost(eePokemon.hp, eePokemon.maxhp / 2);
		battle.makeChoices('move substitute', 'move thunderbolt');
		assert.atMost(eePokemon.hp, eePokemon.maxhp / 2);
		assert.strictEqual(battle.requestState, 'move');
	});

	it(`should prevent Volt Switch after-switches`, function () {
		battle = common.createBattle([
			[{species: "Golisopod", ability: 'emergencyexit', moves: ['sleeptalk'], ivs: EMPTY_IVS}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
			[{species: "Zekrom", ability: 'pressure', moves: ['voltswitch']}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
		]);
		const eePokemon = battle.p1.active[0];
		battle.makeChoices('move sleeptalk', 'move voltswitch');
		assert.atMost(eePokemon.hp, eePokemon.maxhp / 2);

		assert.false.holdsItem(eePokemon);
		assert.strictEqual(battle.requestState, 'switch');

		battle.makeChoices('default', '');
		assert.species(battle.p1.active[0], 'Clefable');
		assert.species(battle.p2.active[0], 'Zekrom');
	});

	it(`should not prevent Red Card's activation`, function () {
		battle = common.createBattle([
			[{species: "Golisopod", ability: 'emergencyexit', item: 'redcard', moves: ['sleeptalk'], ivs: EMPTY_IVS}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
			[{species: "Raticate", ability: 'guts', moves: ['superfang']}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
		]);
		const eePokemon = battle.p1.active[0];
		battle.makeChoices('move sleeptalk', 'move superfang');
		assert.atMost(eePokemon.hp, eePokemon.maxhp / 2);

		assert.false.holdsItem(eePokemon);
		assert.strictEqual(battle.requestState, 'switch');

		battle.makeChoices('auto', '');
		assert.species(battle.p1.active[0], 'Clefable');
		assert.species(battle.p2.active[0], 'Clefable');
	});

	it(`should not prevent Eject Button's activation`, function () {
		battle = common.createBattle([
			[{species: "Golisopod", ability: 'emergencyexit', item: 'ejectbutton', moves: ['sleeptalk'], ivs: EMPTY_IVS}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
			[{species: "Raticate", ability: 'guts', moves: ['superfang']}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
		]);
		const eePokemon = battle.p1.active[0];
		battle.makeChoices('auto', 'auto');
		assert.atMost(eePokemon.hp, eePokemon.maxhp / 2);

		assert.false.holdsItem(eePokemon);
		assert.strictEqual(battle.requestState, 'switch');

		battle.makeChoices('auto', '');
		assert.species(battle.p1.active[0], 'Clefable');
	});

	it(`should be suppressed by Sheer Force`, function () {
		battle = common.createBattle([
			[{species: "Golisopod", ability: 'emergencyexit', moves: ['sleeptalk'], ivs: EMPTY_IVS}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
			[{species: "Nidoking", ability: 'sheerforce', moves: ['thunder']}],
		]);
		const eePokemon = battle.p1.active[0];
		battle.makeChoices('move sleeptalk', 'move thunder');
		assert.atMost(eePokemon.hp, eePokemon.maxhp / 2);
		assert.strictEqual(battle.requestState, 'move');
	});
});
