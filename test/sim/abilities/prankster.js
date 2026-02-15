'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Prankster', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should increase the priority of Status moves', () => {
		battle = common.createBattle([
			[{ species: "Murkrow", ability: 'prankster', moves: ['taunt'] }],
			[{ species: "Deoxys-Speed", ability: 'pressure', moves: ['calmmind'] }],
		]);
		battle.makeChoices('move taunt', 'move calmmind');
		assert.statStage(battle.p2.active[0], 'spa', 0);
	});

	it('should cause Status moves to fail against Dark Pokémon', () => {
		battle = common.createBattle([
			[{ species: "Sableye", ability: 'prankster', moves: ['willowisp'] }],
			[{ species: "Sableye", ability: 'keeneye', moves: ['willowisp'] }],
		]);
		assert.constant(() => battle.p2.active[0].status, () => battle.makeChoices('move willowisp', 'move willowisp'));
	});

	it('should cause bounced Status moves to fail against Dark Pokémon', () => {
		battle = common.createBattle([
			[{ species: "Klefki", ability: 'prankster', moves: ['magiccoat'] }],
			[{ species: "Spiritomb", ability: 'pressure', moves: ['willowisp'] }],
		]);
		assert.constant(() => battle.p2.active[0].status, () => battle.makeChoices('move magiccoat', 'move willowisp'));
	});

	it('should not cause bounced Status moves to fail against Dark Pokémon if it is removed', () => {
		battle = common.createBattle({ gameType: 'doubles' });
		battle.setPlayer('p1', { team: [
			{ species: "Alakazam", ability: 'synchronize', moves: ['skillswap'] },
			{ species: "Sableye", ability: 'prankster', moves: ['magiccoat'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: "Pyukumuku", ability: 'unaware', moves: ['curse'] },
			{ species: "Houndoom", ability: 'flashfire', moves: ['confide'] },
		] });
		const darkPokemon = battle.p2.active[1];
		battle.makeChoices('move skillswap -2, move magiccoat', 'move curse, move confide 2');
		assert.statStage(darkPokemon, 'spa', -1);
	});

	it('should not cause Status moves forced by Encore to fail against Dark Pokémon', () => {
		battle = common.createBattle([
			[{ species: "Liepard", ability: 'prankster', moves: ['encore'] }],
			[{ species: "Riolu", ability: 'prankster', moves: ['confide', 'return'] }],
		]);
		battle.makeChoices('move encore', 'move confide');
		battle.makeChoices('move encore', 'move return');
		assert.statStage(battle.p1.active[0], 'spa', -1);
	});

	it('should cause moves forced by Encore to fail against Dark Pokémon if the attacker intended to use a Status move', () => {
		// https://www.smogon.com/forums/threads/3469932/page-396#post-7736003
		battle = common.createBattle({ gameType: 'doubles' }, [
			[{ species: "Liepard", ability: 'prankster', moves: ['encore', 'nastyplot'] }, { species: "Tapu Fini", ability: 'mistysurge', moves: ['calmmind'] }],
			[{ species: "Meowstic", ability: 'prankster', moves: ['frustration', 'leer'] }, { species: "Lopunny", ability: 'limber', moves: ['agility'] }],
		]);

		battle.makeChoices('move encore 1, move calmmind', 'move frustration 2, move agility');
		battle.makeChoices('move encore 1, move calmmind', 'move leer, move agility');
		assert(battle.p2.active[0].volatiles['encore'], `Meowstic should be encored`);
		assert.fullHP(battle.p1.active[0]);
	});

	it('should not leak the ability via hint if the target is immune to the Status move', () => {
		/**
		 * The simulator used to have hints for Prankster immunity. These were discontinued because
		 * they leaked information when combined with Illusion and other types of immunities.
		 * These tests exist to ensure that accidental hints are not added that might leak information.
		 * If you change these tests, make sure they do not leak any information.
		 */
		battle = common.createBattle([[
			{ species: "Sableye", ability: 'prankster', moves: ['willowisp'] },
		], [
			{ species: "Houndoom", moves: ['willowisp'] },
		]]);
		battle.makeChoices('move willowisp', 'move willowisp');
		assert.false(battle.log.some(line => line.includes('hint')), `Prankster should not be leaked via hint (Fire immunity)`);

		battle = common.createBattle([[
			{ species: "Sableye", ability: 'prankster', moves: ['willowisp'] },
		], [
			{ species: "Spiritomb", ability: 'illusion', moves: ['sleeptalk'] },
			{ species: "Gholdengo", ability: 'goodasgold', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move willowisp', 'move sleeptalk');
		assert.false(battle.log.some(line => line.includes('hint')), `Prankster should not leak that the opponent doesn't have Good as Gold`);

		battle = common.createBattle([[
			{ species: "Sableye", ability: 'prankster', moves: ['willowisp'] },
		], [
			{ species: "Typhlosion", ability: 'illusion', moves: ['sleeptalk'] },
			{ species: "Yveltal", moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move willowisp', 'move sleeptalk');
		assert.false(battle.log.some(line => line.includes('hint')), `Prankster should not leak that the opponent is not a Dark-type`);
	});
});

describe('Prankster [Gen 6]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should not cause Status moves to fail against Dark Pokémon`, () => {
		battle = common.gen(6).createBattle([[
			{ species: 'Sableye', ability: 'prankster', moves: ['willowisp'] },
		], [
			{ species: 'Sableye', ability: 'noguard', moves: ['willowisp'] },
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].status, 'brn');
		assert.equal(battle.p2.active[0].status, 'brn');
	});
});
