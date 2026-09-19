'use strict';

const assert = require('./../assert');
const common = require('./../common');

let battle;

const createChampionsBattle = (options, teams) => {
	if (Array.isArray(options)) {
		teams = options;
		options = {};
	}
	if (!options) options = {};
	const formatid = options.gameType === 'doubles' ? 'gen9championsdoublescustomgame@@@!teampreview' : 'gen9championscustomgame@@@!teampreview';
	return common.createBattle({ formatid, ...options }, teams);
};

describe('Mega Sol', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should apply Sunny Day damage boosts', () => {
		battle = createChampionsBattle([[
			{ species: "Meganium", item: 'meganiumite', moves: ['weatherball'] },
		], [
			{ species: "Pelipper", ability: 'drizzle', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices('move weatherball mega', 'move sleeptalk');
		const pelipper = battle.p2.active[0];
		assert.bounded(pelipper.maxhp - pelipper.hp, [98, 116]);
	});

	it('should bypass weather defensive boosts', () => {
		battle = createChampionsBattle([[
			{ species: "Meganium", item: 'meganiumite', moves: ['weatherball'] },
		], [
			{ species: "Tyranitar", item: 'tyranitarite', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices('move weatherball mega', 'move sleeptalk mega');
		const tyranitar = battle.p2.active[0];
		assert.bounded(tyranitar.maxhp - tyranitar.hp, [63, 75]);
	});

	it('should force Electro Shot to charge under rain', () => {
		battle = createChampionsBattle([[
			{ species: "Meganium", item: 'meganiumite', moves: ['electroshot'] },
		], [
			{ species: "Pelipper", ability: 'drizzle', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices('move electroshot mega', 'move sleeptalk');
		const pelipper = battle.p2.active[0];
		assert.false.fainted(pelipper);
		battle.makeChoices('move electroshot', 'move sleeptalk');
		assert.fainted(pelipper);
	});
});

describe('Prankster', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should cause Status moves forced by Encore to fail against Dark Pokémon', () => {
		battle = createChampionsBattle([[
			{ species: "Liepard", ability: 'prankster', moves: ['encore'] },
		], [
			{ species: "Riolu", ability: 'prankster', moves: ['confide', 'return'] },
		]]);
		battle.makeChoices('move encore', 'move confide');
		battle.makeChoices('move encore', 'move return');
		assert.statStage(battle.p1.active[0], 'spa', 0);
	});

	it('should not cause damaging moves forced by Encore to fail against Dark Pokémon even if the attacker intended to use a Status move', () => {
		battle = createChampionsBattle({ gameType: 'doubles' }, [[
			{ species: "Liepard", ability: 'prankster', moves: ['encore', 'nastyplot'] },
			{ species: "Tapu Fini", ability: 'mistysurge', moves: ['calmmind'] },
		], [
			{ species: "Meowstic", ability: 'prankster', moves: ['frustration', 'leer'] },
			{ species: "Lopunny", ability: 'limber', moves: ['agility'] },
		]]);

		battle.makeChoices('move encore 1, move calmmind', 'move frustration 2, move agility');
		battle.makeChoices('move encore 1, move calmmind', 'move leer, move agility');
		assert(battle.p2.active[0].volatiles['encore'], `Meowstic should be encored`);
		assert.false.fullHP(battle.p1.active[0]);
	});
});

describe('Encore', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should restore the priority of the originally selected move`, () => {
		battle = createChampionsBattle({ gameType: 'doubles' }, [[
			{ species: 'regieleki', moves: ['sleeptalk', 'substitute'] },
			{ species: 'pichu', moves: ['sleeptalk'] },
		], [
			{ species: 'whimsicott', ability: 'prankster', moves: ['sleeptalk', 'encore'] },
			{ species: 'terrakion', moves: ['quickattack', 'headlongrush'] },
		]]);

		const eleki = battle.p1.active[0];
		battle.makeChoices('auto', 'move sleeptalk, move headlongrush 2');
		battle.makeChoices('move substitute', 'move encore -2, move quickattack 1');

		assert.false.fainted(eleki);
	});

	it(`should restore the priority of the originally selected move once and get blocked when appropriate`, () => {
		battle = createChampionsBattle({ gameType: 'doubles' }, [[
			{ species: 'regieleki', moves: ['psychicterrain'] },
			{ species: 'pichu', moves: ['sleeptalk'] },
		], [
			{ species: 'whimsicott', ability: 'prankster', moves: ['sleeptalk', 'encore'] },
			{ species: 'terrakion', moves: ['quickattack', 'headlongrush'] },
		]]);

		const eleki = battle.p1.active[0];
		battle.makeChoices('auto', 'move sleeptalk, move quickattack 2');
		battle.makeChoices('auto', 'move encore -2, move headlongrush 1');
		assert.fullHP(eleki);
	});
});

describe('No Retreat', () => {
	afterEach(() => {
		battle.destroy();
	});

	it.skip(`should not allow usage multiple times in a row even if it has the trapped volatile`, () => {
		battle = createChampionsBattle([[
			{ species: "Wynaut", moves: ['noretreat'] },
		], [
			{ species: "Caterpie", moves: ['block'] },
		]]);

		const wynaut = battle.p1.active[0];
		battle.makeChoices();
		assert.statStage(wynaut, 'atk', 1);
		battle.makeChoices();
		assert.statStage(wynaut, 'atk', 1);
	});
});
