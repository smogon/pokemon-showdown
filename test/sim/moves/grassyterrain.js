'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Grassy Terrain', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should change the current terrain to Grassy Terrain for five turns`, () => {
		battle = common.createBattle([[
			{ species: 'Florges', moves: ['grassyterrain', 'sleeptalk'] },
		], [
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		]]);
		for (let i = 0; i < 4; i++) {
			battle.makeChoices();
			assert(battle.field.isTerrain('grassyterrain'));
		}
		battle.makeChoices('move sleeptalk', 'move sleeptalk');
		assert(battle.field.isTerrain(''));
	});

	it(`should halve the base power of Earthquake, Bulldoze, and Magnitude against grounded targets`, () => {
		battle = common.createBattle([[
			{ species: 'Shaymin', moves: ['grassyterrain'] },
		], [
			{ species: 'Aerodactyl', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		const shaymin = battle.p1.active[0];
		const aerodactyl = battle.p2.active[0];
		assert.equal(battle.runEvent('BasePower', aerodactyl, shaymin, Dex.moves.get('earthquake'), 100, true), 50);
		assert.equal(battle.runEvent('BasePower', shaymin, aerodactyl, Dex.moves.get('earthquake'), 100, true), 100);
		assert.equal(battle.runEvent('BasePower', aerodactyl, shaymin, Dex.moves.get('bulldoze'), 60, true), 30);
		assert.equal(battle.runEvent('BasePower', shaymin, aerodactyl, Dex.moves.get('bulldoze'), 60, true), 60);
	});

	it(`should increase the base power of Grass-type attacks used by grounded Pokemon`, () => {
		battle = common.gen(7).createBattle([[
			{ species: 'Shaymin', moves: ['grassyterrain'] },
		], [
			{ species: 'Aerodactyl', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		let basePower;
		const move = Dex.moves.get('gigadrain');
		const shaymin = battle.p1.active[0];
		const aerodactyl = battle.p2.active[0];
		basePower = battle.runEvent('BasePower', shaymin, aerodactyl, move, move.basePower, true);
		assert.equal(basePower, battle.modify(move.basePower, 1.5));
		basePower = battle.runEvent('BasePower', aerodactyl, shaymin, move, move.basePower, true);
		assert.equal(basePower, move.basePower);
	});

	it(`should heal grounded Pokemon by 1/16 of their max HP`, () => {
		battle = common.createBattle([[
			{ species: 'Shaymin', moves: ['grassyterrain', 'seismictoss'] },
		], [
			{ species: 'Wynaut', moves: ['magnetrise', 'seismictoss'] },
		]]);
		battle.makeChoices('move grassyterrain', 'move magnetrise');
		battle.makeChoices('move seismictoss', 'move seismictoss');
		const shaymin = battle.p1.active[0];
		const wynaut = battle.p2.active[0];
		assert.equal(shaymin.hp, shaymin.maxhp - 100 + Math.floor(shaymin.maxhp / 16));
		assert.equal(wynaut.hp, wynaut.maxhp - 100);
	});

	it(`should not affect Pokemon in a semi-invulnerable state`, () => {
		battle = common.createBattle([[
			{ species: 'Shaymin', moves: ['grassyterrain', 'seismictoss'] },
		], [
			{ species: 'Wynaut', moves: ['skydrop', 'seismictoss'] },
		]]);
		battle.makeChoices('move seismictoss', 'move seismictoss');
		battle.makeChoices('move grassyterrain', 'move skydrop');
		const shaymin = battle.p1.active[0];
		const wynaut = battle.p2.active[0];
		assert.equal(shaymin.hp, shaymin.maxhp - 100);
		assert.equal(wynaut.hp, wynaut.maxhp - 100);
	});

	it(`should cause Nature Power to become Energy Ball`, () => {
		battle = common.createBattle([[
			{ species: 'Shaymin', moves: ['grassyterrain'] },
		], [
			{ species: 'Wynaut', moves: ['naturepower'] },
		]]);
		battle.makeChoices();
		const resultMove = toID(battle.log[battle.lastMoveLine].split('|')[3]);
		assert.equal(resultMove, 'energyball');
	});

	it(`should heal by Speed order in the same block as Leftovers`, () => {
		battle = common.createBattle([[
			{ species: 'rillaboom', ability: 'grassysurge', item: 'leftovers', moves: ['seismictoss'] },
		], [
			{ species: 'alakazam', item: 'focussash', moves: ['seismictoss'] },
		]]);

		battle.makeChoices();
		const log = battle.getDebugLog();
		const zamGrassyIndex = log.indexOf('|-heal|p2a: Alakazam|166/251|[from] Grassy Terrain');
		const rillaGrassyIndex = log.indexOf('|-heal|p1a: Rillaboom|262/341|[from] Grassy Terrain');
		const rillaLeftoversIndex = log.indexOf('|-heal|p1a: Rillaboom|283/341|[from] item: Leftovers');
		assert(zamGrassyIndex < rillaGrassyIndex, 'Alakazam should heal from Grassy Terrain before Rillaboom');
		assert(rillaGrassyIndex < rillaLeftoversIndex, 'Rillaboom should heal from Grassy Terrain before Leftovers');
	});

	it(`should only decrement turn count when being set before it would decrement in the end-of-turn effects`, () => {
		battle = common.createBattle([[
			{ species: 'grookey', ability: 'grassysurge', moves: ['sleeptalk'] },
		], [
			{ species: 'shedinja', ability: 'neutralizinggas', item: 'stickybarb', moves: ['sleeptalk'] },
			{ species: 'wynaut', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices(); // KO Neutralizing Gas
		battle.makeChoices(); // Switch

		// Kill turns with Wynaut and Grookey until turn 5
		for (let i = 0; i < 4; i++) {
			battle.makeChoices();
		}

		assert(battle.field.isTerrain('grassyterrain'), `Grassy Terrain should still be active turn 5, ending turn 6.`);
	});

	it(`should not heal Pokemon after being replaced by another terrain earlier in the same end-of-turn step`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'shedinja', ability: 'psychicsurge', moves: ['sleeptalk'] },
			{ species: 'passimian', ability: 'receiver', moves: ['sleeptalk'] },
		], [
			{ species: 'hippowdon', ability: 'sandstream', moves: ['sleeptalk'] },
			{ species: 'garchomp', moves: ['grassyterrain'] },
		]]);

		// Sandstorm KOs Shedinja, then Receiver copies Psychic Surge, which replaces Grassy Terrain
		battle.makeChoices();
		const passimian = battle.p1.active[1];
		assert(battle.field.isTerrain('psychicterrain'));
		assert.equal(passimian.hp, passimian.maxhp - Math.floor(passimian.maxhp / 16), `Passimian should not have been healed by Grassy Terrain.`);
	});

	it(`should not skip healing Pokemon if it was set during the block it would heal Pokemon`, () => {
		battle = common.gen(8).createBattle([[
			{ species: 'coalossal', ability: 'grassysurge', moves: ['sleeptalk', 'rockthrow'] },
		], [
			{ species: 'shedinja', ability: 'neutralizinggas', item: 'focussash', moves: ['dragonrage'] },
			{ species: 'wynaut', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices('move rockthrow dynamax', 'auto');
		const coalossal = battle.p1.active[0];
		assert.equal(coalossal.hp, coalossal.maxhp - 40 + Math.floor(coalossal.maxhp / 2 / 16), `Coalossal should have recovered HP from Grassy Terrain.`);
		assert.equal(battle.field.terrainState.duration, 4, `Grassy Terrain should count down on the turn it was set.`);
		battle.makeChoices(); // Replace the fainted Shedinja without advancing the turn
		for (let duration = 3; duration > 0; duration--) {
			battle.makeChoices();
			assert(battle.field.isTerrain('grassyterrain'), `Grassy Terrain should last through turn ${5 - duration}.`);
			assert.equal(battle.field.terrainState.duration, duration);
		}
		battle.makeChoices();
		assert.false(battle.field.isTerrain('grassyterrain'), `Grassy Terrain should end at the end of turn 5.`);
	});

	it(`should heal from Grassy Terrain set by Receiver during the same Residual event`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'shedinja', ability: 'grassysurge', moves: ['sleeptalk'] },
			{ species: 'passimian', ability: 'receiver', item: 'safetygoggles', moves: ['sleeptalk'] },
		], [
			{ species: 'hippowdon', ability: 'sandstream', moves: ['sleeptalk'] },
			{ species: 'garchomp', moves: ['sleeptalk', 'electricterrain'] },
		]]);
		const shedinja = battle.p1.active[0];
		const passimian = battle.p1.active[1];
		const survivors = [passimian, ...battle.p2.active];
		for (const pokemon of survivors) pokemon.hp -= 50;
		const hpBeforeResidual = passimian.hp;

		// Electric Terrain replaces the initial Grassy Terrain before Sandstorm KOs Shedinja.
		// Receiver then copies Grassy Surge and sets a new terrain during Residual.
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move sleeptalk, move electricterrain');

		assert.equal(shedinja.hp, 0, `Sandstorm should KO Shedinja during Residual.`);
		assert.equal(passimian.ability, 'grassysurge');
		assert(battle.field.isTerrain('grassyterrain'));
		assert.equal(passimian.hp, hpBeforeResidual + Math.floor(passimian.maxhp / 16));
		for (const pokemon of survivors) assert.equal(pokemon.hp, pokemon.maxhp - 50 + Math.floor(pokemon.baseMaxhp / 16));
		assert.equal(battle.field.terrainState.duration, 4, `The terrain should count down after it is set during Residual.`);
		const log = battle.getDebugLog();
		const sandstormIndex = log.indexOf('|-damage|p1a: Shedinja|');
		const terrainStartIndex = log.lastIndexOf('|-fieldstart|move: Grassy Terrain|[from] ability: Grassy Surge');
		const healIndex = log.lastIndexOf('|-heal|p1b: Passimian|');
		assert(sandstormIndex >= 0 && terrainStartIndex >= 0 && healIndex >= 0);
		assert(sandstormIndex < terrainStartIndex, `Sandstorm should KO Shedinja before Receiver starts Grassy Terrain.`);
		assert(terrainStartIndex < healIndex, `The new Grassy Terrain should heal after Receiver starts it.`);
		for (let turn = 2; turn <= 4; turn++) {
			battle.makeChoices();
			assert.equal(battle.field.terrain, 'grassyterrain');
			assert.equal(battle.field.terrainState.duration, 5 - turn);
		}
		battle.makeChoices(); // End of turn 5
		assert.equal(battle.field.terrain, '');
	});
});
