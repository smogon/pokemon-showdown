'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Partners in Crime', () => {
	afterEach(() => battle.destroy());

	it('should activate shared abilities at the same time as other abilities', () => {
		battle = common.createBattle({ formatid: 'gen9partnersincrime' }, [[
			{ species: 'Incineroar', ability: 'intimidate', item: 'whiteherb', moves: ['sleeptalk'] },
			{ species: 'Pincurchin', ability: 'electricsurge', moves: ['sleeptalk'] },
		], [
			{ species: 'Rampardos', ability: 'sheerforce', moves: ['sleeptalk'] },
			{ species: 'Iron Valiant', ability: 'quarkdrive', moves: ['sleeptalk'] },
			{ species: 'Litten', ability: 'intimidate', moves: ['sleeptalk'] },
		]]);
		// team preview
		battle.makeChoices();
		const rampardos = battle.p2.active[0];
		assert.statStage(rampardos, 'atk', -2);
		assert.equal(rampardos.volatiles.quarkdrive.bestStat, 'atk',
			`Rampardos should be Intimidated exactly once before Quark Drive activates`);
		const ironvaliant = battle.p2.active[1];
		assert.statStage(ironvaliant, 'atk', -2);
		assert.equal(ironvaliant.volatiles.quarkdrive.bestStat, 'spa',
			`Iron Valiant should be Intimidated exactly once before Quark Drive activates`);
		assert.equal(battle.field.terrainState.source.name, 'Incineroar', `Incineroar should set Electric Terrain`);

		battle.makeChoices('auto', 'move sleeptalk, switch 3');
		const incineroar = battle.p1.active[0];
		assert.false.holdsItem(incineroar);
		assert.statStage(incineroar, 'atk', 0, `Incineroar's White Herb should have activated after both Litten and Rampardos's Intimidates`);
	});

	it('should activate shared abilities for each ally when only the original holder switches in', () => {
		battle = common.createBattle({ formatid: 'gen9partnersincrime' }, [[
			{ species: 'Pyukumuku', ability: 'innardsout', moves: ['sleeptalk'] },
			{ species: 'Pincurchin', ability: 'electricsurge', moves: ['sleeptalk'] },
			{ species: 'Incineroar', ability: 'intimidate', moves: ['sleeptalk'] },
		], [
			{ species: 'Corviknight', ability: 'mirrorarmor', moves: ['sleeptalk'] },
			{ species: 'Iron Valiant', ability: 'quarkdrive', moves: ['sleeptalk'] },
		]]);
		// team preview
		battle.makeChoices();
		// swap Pyukumuku for Incineroar
		battle.makeChoices('switch 3, move sleeptalk', 'auto');
		const pincurchin = battle.p1.active[1];
		assert.statStage(pincurchin, 'atk', -2, 'Pincurchin should have had its innate Intimidate activate, triggering Mirror Armor');
	});

	it('should not activate ally\'s innates if the partner faints on switch-in', () => {
		battle = common.createBattle({ formatid: 'gen9partnersincrime' }, [[
			{ species: 'Shedinja', ability: 'download', moves: ['sleeptalk'] },
			{ species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk'] },
			{ species: 'Chansey', ability: 'healer', moves: ['sleeptalk'] },
		], [
			{ species: 'Stonjourner', ability: 'powerspot', moves: ['stealthrock'] },
			{ species: 'Iron Hands', ability: 'quarkdrive', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		const cresselia = battle.p1.active[1];
		assert.statStage(cresselia, 'spa', 1);
		battle.makeChoices('switch 3, move sleeptalk', 'auto');
		battle.makeChoices('switch 3, move sleeptalk', 'auto');
		assert.statStage(cresselia, 'spa', 1, 'Cresselia should not have gained another Download boost after Shedinja fainted');
	});

	it('should heal and count down a terrain started during residuals', () => {
		battle = common.createBattle({ formatid: 'gen9partnersincrime' }, [[
			{ species: 'Mew', ability: 'pressure', moves: ['sleeptalk'] },
			{ species: 'Wynaut', ability: 'telepathy', moves: ['sleeptalk'] },
		], [
			{ species: 'Slowpoke', ability: 'telepathy', moves: ['sleeptalk'] },
			{ species: 'Snorlax', ability: 'pressure', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices(); // Team Preview
		const pokemon = battle.getAllActive();
		for (const mon of pokemon) mon.hp -= 50;
		const source = pokemon[0];
		battle.onEvent('Residual', battle.format, { order: 3 }, target => {
			if (battle.turn === 1 && target === source) battle.field.setTerrain('grassyterrain', source);
		});
		const start = battle.log.length;
		battle.makeChoices();
		assert.equal(battle.field.terrain, 'grassyterrain');
		assert.equal(battle.field.terrainState.duration, 4);
		for (const mon of pokemon) assert.equal(mon.hp, mon.maxhp - 50 + Math.floor(mon.baseMaxhp / 16));
		const log = battle.log.slice(start);
		const terrainStart = log.findIndex(line => line.startsWith('|-fieldstart|move: Grassy Terrain'));
		const heals = log.filter(line => line.startsWith('|-heal|') && line.endsWith('[from] Grassy Terrain'));
		assert.equal(heals.length, 8); // Exact and public HP lines for each of four Pokemon
		assert(log.findIndex(line => line.startsWith('|-heal|')) > terrainStart);
		for (let turn = 2; turn <= 4; turn++) {
			battle.makeChoices();
			assert.equal(battle.field.terrainState.duration, 5 - turn);
		}
		assert.equal(battle.field.terrain, 'grassyterrain');
		battle.makeChoices(); // End of turn 5
		assert.equal(battle.field.terrain, '');
	});
});
