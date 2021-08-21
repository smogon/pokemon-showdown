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
		assert.equal(foePokemon.hp, foePokemon.maxhp);
		assert.atMost(eePokemon.hp, eePokemon.maxhp / 2);
		assert.equal(battle.requestState, 'switch');
	});

	it(`should request switch-out at the end of a multi-hit move`, function () {
		battle = common.createBattle([
			[{species: "Cinccino", ability: 'skilllink', moves: ['bulletseed']}],
			[{species: "Golisopod", ability: 'emergencyexit', moves: ['sleeptalk']}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
		]);
		battle.makeChoices('move bulletseed', 'move sleeptalk');
		battle.makeChoices('move bulletseed', 'move sleeptalk');
		assert.equal(battle.requestState, 'switch');
	});

	it(`should request switch-out if brought below half HP by residual damage`, function () {
		battle = common.createBattle([[
			{species: "Mew", moves: ['toxic']},
		], [
			{species: "Mew", ability: 'emergencyexit', moves: ['splash']},
			{species: "Shaymin", moves: ['splash']},
		]]);
		battle.p2.active[0].hp = Math.floor(battle.p2.active[0].maxhp / 2 + 2);
		battle.makeChoices();
		assert.equal(battle.requestState, 'switch');
	});

	it(`should request switch-out if brought below half HP by Photon Geyser`, function () {
		battle = common.createBattle([[
			{species: "Mew", moves: ['photongeyser']},
		], [
			{species: "Charmeleon", ability: 'emergencyexit', moves: ['splash']},
			{species: "Shaymin", moves: ['splash']},
		]]);
		battle.makeChoices();
		assert.equal(battle.requestState, 'switch');
	});

	it(`should not request switch-out if attacked and healed by berry`, function () {
		battle = common.createBattle([[
			{species: "Golisopod", ability: 'emergencyexit', moves: ['sleeptalk'], item: 'sitrusberry', ivs: EMPTY_IVS},
			{species: "Clefable", ability: 'unaware', moves: ['metronome']},
		], [
			{species: "Raticate", ability: 'guts', moves: ['superfang']},
		]]);
		battle.makeChoices();
		assert.equal(battle.requestState, 'move');
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

	it(`should request switch-out before end-of-turn fainted Pokemon`, function () {
		battle = common.createBattle([[
			{species: "Golisopod", item: 'blacksludge', ability: 'emergencyexit', moves: ['payback']},
			{species: "Wynaut", moves: ['sleeptalk']},
		], [
			{species: "Swoobat", ability: 'noguard', moves: ['superfang']},
			{species: "Stufful", moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert(battle.p1.activeRequest.forceSwitch);
		assert.fainted(battle.p2.active[0]);
		assert(!battle.p2.activeRequest.forceSwitch);
	});

	it(`should request switch-out after taking hazard damage`, function () {
		battle = common.createBattle([
			[{species: "Golisopod", ability: 'emergencyexit', moves: ['uturn', 'sleeptalk']}, {species: "Magikarp", ability: 'swiftswim', moves: ['splash']}],
			[{species: "Arceus-Flying", ability: 'ironbarbs', moves: ['stealthrock', 'spikes', 'dragonascent']}],
		]);
		battle.makeChoices('move uturn', 'move stealthrock');
		battle.makeChoices('switch 2', '');
		battle.makeChoices('move splash', 'move spikes');
		battle.makeChoices('move splash', 'move spikes');
		battle.makeChoices('move splash', 'move spikes');
		battle.makeChoices('switch 2', 'move dragonascent');
		assert(battle.p1.active[0].hp);
		assert.equal(battle.requestState, 'switch');
	});

	it('should request switch-out after taking Life Orb recoil', function () {
		battle = common.createBattle([[
			{species: "Golisopod", item: "lifeorb", ability: 'emergencyexit', moves: ['peck']},
			{species: "Wynaut", moves: ['sleeptalk']},
		], [
			{species: "stufful", ability: 'compoundeyes', moves: ['superfang']},
		]]);
		battle.makeChoices();
		assert.equal(battle.requestState, 'switch');
	});

	it.skip('should request switch-out after taking recoil and dragging in an opponent', function () {
		battle = common.createBattle([[
			{species: "Golisopod", ability: 'emergencyexit', moves: ['dragontail']},
			{species: "Wynaut", moves: ['sleeptalk']},
		], [
			{species: "Sharpedo", item: 'rockyhelmet', ability: 'noguard', moves: ['superfang']},
			{species: "Stufful", moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		const log = battle.getDebugLog();
		const dragIndex = log.lastIndexOf('|drag|p2a: Stufful|Stufful, M|281/281');
		const abilityIndex = log.lastIndexOf('|-activate|p1a: Golisopod|ability: Emergency Exit');
		assert(dragIndex < abilityIndex, 'Stufful should be dragged in before Emergency Exit activates');
		assert.equal(battle.requestState, 'switch');
	});

	it(`should not request switch-out after taking entry hazard damage and getting healed by berry`, function () {
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
		assert.equal(battle.requestState, 'move');
	});

	it(`should not request switch-out after taking poison damage and getting healed by berry`, function () {
		battle = common.createBattle([
			[{species: "Golisopod", ability: 'emergencyexit', moves: ['substitute', 'sleeptalk'], item: 'sitrusberry'}, {species: "Magikarp", moves: ['splash']}],
			[{species: "Gengar", moves: ['toxic', 'nightshade', 'protect']}],
		]);
		battle.makeChoices('move substitute', 'move toxic');
		battle.makeChoices('move sleeptalk', 'move nightshade');
		battle.makeChoices('move sleeptalk', 'move protect');
		assert.equal(battle.requestState, 'move');
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
		assert.equal(battle.requestState, 'move');
	});

	it(`should prevent Volt Switch after switches`, function () {
		battle = common.createBattle([
			[{species: "Golisopod", ability: 'emergencyexit', moves: ['sleeptalk'], ivs: EMPTY_IVS}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
			[{species: "Zekrom", ability: 'pressure', moves: ['voltswitch']}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
		]);
		const eePokemon = battle.p1.active[0];
		battle.makeChoices('move sleeptalk', 'move voltswitch');
		assert.atMost(eePokemon.hp, eePokemon.maxhp / 2);

		assert.false.holdsItem(eePokemon);
		assert.equal(battle.requestState, 'switch');

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
		assert.equal(battle.requestState, 'switch');

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
		assert.equal(battle.requestState, 'switch');

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
		assert.equal(battle.requestState, 'move');
	});

	it('should not request switchout if its HP is already below 50%', function () {
		battle = common.createBattle([[
			{species: "Golisopod", evs: {hp: 4}, ability: 'emergencyexit', moves: ['sleeptalk', 'tackle']},
			{species: "Wynaut", moves: ['sleeptalk']},
		], [
			{species: "stufful", ability: 'compoundeyes', moves: ['superfang', 'sleeptalk']},
		]]);
		battle.makeChoices();
		battle.makeChoices('switch 2');

		// Switch Goliosopod back in
		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices('move tackle', 'move sleeptalk');
		assert.equal(battle.requestState, 'move');
	});

	it('should request switchout if its HP was restored to above 50% and brought down again', function () {
		battle = common.createBattle([[
			{species: "Golisopod", evs: {hp: 4}, ability: 'emergencyexit', moves: ['sleeptalk']},
			{species: "Wynaut", moves: ['sleeptalk']},
		], [
			{species: "stufful", ability: 'compoundeyes', moves: ['superfang', 'healpulse']},
		]]);
		battle.makeChoices();
		battle.makeChoices('switch 2');

		// Switch Goliosopod back in and heal it before switching it back out again
		battle.makeChoices('switch 2', 'move healpulse');
		battle.makeChoices('auto', 'move superfang');
		assert.equal(battle.requestState, 'switch');
	});

	it('should not request switchout if its HP is already below 50% and an effect heals it', function () {
		battle = common.createBattle([[
			{species: "Golisopod", level: 65, item: 'figyberry', ability: 'emergencyexit', moves: ['sleeptalk']},
			{species: "Wynaut", moves: ['sleeptalk']},
		], [
			{species: "ursaring", ability: 'sheerforce', moves: ['falseswipe', 'crunch']},
		]]);
		battle.makeChoices('auto', 'move crunch');
		battle.makeChoices();
		assert.equal(battle.requestState, 'move');
	});

	it('should request switchout if its HP drops to below 50% while dynamaxed', function () {
		battle = common.createBattle([
			[{species: "Golisopod", ability: 'emergencyexit', moves: ['closecombat'], ivs: EMPTY_IVS, level: 30}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
			[{species: "Gengar", ability: 'cursedbody', moves: ['nightshade']}],
		]);
		const eePokemon = battle.p1.active[0];
		battle.makeChoices('move maxknuckle dynamax', 'move nightshade');
		assert.atMost(eePokemon.hp, eePokemon.maxhp / 2);
		assert.equal(battle.requestState, 'switch');
	});

	it('should not request switchout if its HP is below 50% when its dynamax ends', function () {
		battle = common.createBattle([
			[{species: "Golisopod", ability: 'emergencyexit', moves: ['drillrun'], ivs: EMPTY_IVS}, {species: "Clefable", ability: 'Unaware', moves: ['metronome']}],
			[{species: "Landorus", ability: 'sheerforce', moves: ['sludgewave']}],
		]);
		const eePokemon = battle.p1.active[0];
		battle.makeChoices('move maxquake dynamax', 'move sludgewave');
		battle.makeChoices();
		battle.makeChoices();
		assert.false.fainted(eePokemon);
		assert.atMost(eePokemon.hp, eePokemon.maxhp / 2);
		assert.equal(battle.requestState, 'move');
	});

	it.skip(`should request switchout between hazards`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['sleeptalk', 'uturn']},
			{species: 'volcarona', ability: 'emergencyexit', evs: {hp: 4}, moves: ['sleeptalk']},
		], [
			{species: 'landorus', moves: ['stealthrock', 'spikes']},
		]]);
		battle.makeChoices();
		battle.makeChoices('move uturn', 'move spikes');
		battle.makeChoices('switch 2');
		const volcarona = battle.p1.active[0];
		assert.equal(volcarona.hp, Math.floor(volcarona.maxhp / 2), 'Emergency Exit should trigger before Spikes damage.');
		assert.equal(battle.requestState, 'switch');
	});

	it.skip(`should request switchout between residual damage`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Coalossal', level: 1, item: 'Eject Button', moves: ['rockthrow', 'sleeptalk'], gigantamax: true},
			{species: 'Wynaut', level: 1, moves: ['sleeptalk', 'grasspledge']},
			{species: 'Wynaut', level: 1, moves: ['sleeptalk', 'firepledge']},
		], [
			{species: 'Blissey', moves: ['sleeptalk']},
			{species: 'Amoonguss', ability: 'noguard', moves: ['sleeptalk', 'superfang']},
			{species: 'Golisopod', ability: 'emergencyexit', moves: ['sleeptalk']},
		]]);

		// Set up Volcalith and Sea of Fire
		battle.makeChoices('move rockthrow 1 dynamax, move grasspledge -1', 'auto');
		battle.makeChoices('switch 3');
		battle.makeChoices('move firepledge 1, move grasspledge 1', 'auto');

		// Halve Golisopod's HP
		battle.makeChoices('move sleeptalk, move sleeptalk', 'switch 3, move superfang -1');

		const golisopod = battle.p2.active[0];
		let maxHP = golisopod.maxhp;
		let expectedHP = maxHP - Math.floor(maxHP / 2) - Math.floor(maxHP / 6);
		assert.equal(golisopod.hp, expectedHP, `Golisopod should have only taken Volcalith damage`);

		const amoonguss = battle.p2.active[1];
		maxHP = amoonguss.maxhp;
		expectedHP = maxHP - (3 * Math.floor(maxHP / 6)) - (2 * Math.floor(maxHP / 8)); // 3 turns of Volcalith, 2 turns of Sea of Fire
		assert.equal(amoonguss.hp, expectedHP, `Amoonguss should have taken damage before Golisopod can be replaced.`);

		assert.equal(battle.requestState, 'switch');
	});

	it(`should request a switchout after taking regular recoil damage`, function () {
		battle = common.createBattle([[
			{species: 'Golisopod', ability: 'Emergency Exit', moves: ['flareblitz']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Chansey', moves: ['sleeptalk']},
		]]);
		const eePokemon = battle.p1.active[0];
		battle.makeChoices();
		assert.atMost(eePokemon.hp, eePokemon.maxhp / 2);
		assert.equal(battle.requestState, 'switch');
	});

	it(`should request a switchout after taking struggle recoil damage`, function () {
		battle = common.createBattle([[
			{species: 'Golisopod', item: 'Assault Vest', ability: 'Emergency Exit', moves: ['protect']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		battle.makeChoices();
		assert.equal(battle.requestState, 'switch');
	});
});
