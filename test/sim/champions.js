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

describe('Curse', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should redirect to a foe when targeting an ally`, () => {
		battle = createChampionsBattle({ gameType: 'doubles' }, [[
			{ species: 'Gengar', moves: ['curse'] },
			{ species: 'Magikarp', moves: ['splash'] },
		], [
			{ species: 'Caterpie', moves: ['sleeptalk'] },
			{ species: 'Caterpie', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move curse -2, move splash', 'move sleeptalk, move sleeptalk');
		assert.equal(battle.p1.active[0].hp, battle.p1.active[0].maxhp - Math.floor(battle.p1.active[0].maxhp / 2));
		assert.equal(
			battle.p2.active[0].hp + battle.p2.active[1].hp,
			battle.p2.active[0].maxhp + battle.p2.active[1].maxhp - Math.floor(battle.p2.active[0].maxhp / 4)
		);
	});

	it(`should redirect to a foe when targeting an ally`, () => {
		battle = createChampionsBattle({ gameType: 'doubles' }, [[
			{ species: 'Gengar', moves: ['curse'] },
			{ species: 'Magikarp', moves: ['splash'] },
		], [
			{ species: 'Dragapult', moves: ['curse'] },
			{ species: 'Dragapult', moves: ['curse'] },
		]]);
		battle.makeChoices('move curse -2, move splash', 'move curse 2, move curse 2');
		assert.equal(battle.p1.active[0].hp, battle.p1.active[0].maxhp - Math.floor(battle.p1.active[0].maxhp / 2));
		assert.equal(
			battle.p2.active[0].hp + battle.p2.active[1].hp,
			battle.p2.active[0].maxhp + battle.p2.active[1].maxhp -
			Math.floor(battle.p2.active[0].maxhp / 2) - Math.floor(battle.p2.active[0].maxhp / 4)
		);
	});

	it(`should curse a target if a non-Ghost user has Protean`, () => {
		battle = createChampionsBattle([[
			{ species: 'Greninja', ability: 'protean', moves: ['curse'] },
		], [
			{ species: 'Caterpie', moves: ['sleeptalk'] },
		]]);
		const greninja = battle.p1.active[0];
		const caterpie = battle.p2.active[0];
		const curseResidual = Math.floor(caterpie.maxhp / 4);
		battle.makeChoices();
		assert.equal(greninja.hp, greninja.maxhp - Math.floor(greninja.maxhp / 2));
		assert.equal(caterpie.hp, caterpie.maxhp - curseResidual);

		battle.makeChoices();
		assert.equal(greninja.hp, greninja.maxhp - Math.floor(greninja.maxhp / 2));
		assert.equal(caterpie.hp, caterpie.maxhp - curseResidual * 2);
	});

	it(`should be affected by Pressure if targeting an ally`, () => {
		battle = createChampionsBattle({ gameType: 'doubles' }, [[
			{ species: 'Gengar', moves: ['curse'] },
			{ species: 'Magikarp', moves: ['splash'] },
		], [
			{ species: 'Caterpie', ability: 'pressure', moves: ['sleeptalk'] },
			{ species: 'Caterpie', ability: 'pressure', moves: ['sleeptalk'] },
		]]);
		const greninja = battle.p1.active[0];
		const caterpie = battle.p2.active[0];
		const curseResidual = Math.floor(caterpie.maxhp / 4);

		battle.makeChoices('move curse -2, move splash', 'move sleeptalk, move sleeptalk');
		assert.equal(greninja.hp, greninja.maxhp - Math.floor(greninja.maxhp / 2));
		assert.equal(caterpie.hp, caterpie.maxhp - curseResidual);
		assert.equal(greninja.moveSlots[0].pp, greninja.moveSlots[0].maxpp - 2);

		battle.makeChoices();
		assert.equal(greninja.moveSlots[0].pp, greninja.moveSlots[0].maxpp - 4);
	});

	it(`should not be affected by Pressure if a non-Ghost user has Protean`, () => {
		battle = createChampionsBattle([[
			{ species: 'Greninja', ability: 'protean', moves: ['curse'] },
		], [
			{ species: 'Caterpie', ability: 'pressure', moves: ['sleeptalk'] },
		]]);
		const greninja = battle.p1.active[0];
		const caterpie = battle.p2.active[0];
		const curseResidual = Math.floor(caterpie.maxhp / 4);

		battle.makeChoices();
		assert.equal(greninja.hp, greninja.maxhp - Math.floor(greninja.maxhp / 2));
		assert.equal(caterpie.hp, caterpie.maxhp - curseResidual);
		assert.equal(greninja.moveSlots[0].pp, greninja.moveSlots[0].maxpp - 1);

		battle.makeChoices();
		assert.equal(greninja.moveSlots[0].pp, greninja.moveSlots[0].maxpp - 3);
	});

	it(`should not hit a target mid-fly`, () => {
		battle = createChampionsBattle([[
			{ species: 'Gengar', moves: ['curse'] },
		], [
			{ species: 'Aerodactyl', moves: ['fly'] },
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0]);
		assert.fullHP(battle.p2.active[0]);
	});

	it(`should be able to hit a target mid-fly if a non-Ghost user has Protean`, () => {
		battle = createChampionsBattle([[
			{ species: 'Greninja', ability: 'protean', moves: ['curse'] },
		], [
			{ species: 'Aerodactyl', moves: ['fly'] },
		]]);
		const greninja = battle.p1.active[0];
		const aerodactyl = battle.p2.active[0];
		const curseResidual = Math.floor(aerodactyl.maxhp / 4);
		battle.makeChoices();
		assert.equal(greninja.hp, greninja.maxhp - Math.floor(greninja.maxhp / 2));
		assert.equal(aerodactyl.hp, aerodactyl.maxhp - curseResidual);
	});

	it(`should be able to hit a target mid-fly if the user became a Ghost due to Trick-or-Treat`, () => {
		battle = createChampionsBattle({ gameType: 'doubles' }, [[
			{ species: 'Kecleon', ability: 'protean', moves: ['curse'] },
			{ species: 'Magikarp', moves: ['splash'] },
		], [
			{ species: 'Aerodactyl', moves: ['fly'] },
			{ species: 'Gourgeist', moves: ['trickortreat'] },
		]]);
		const kecleon = battle.p1.active[0];
		const aerodactyl = battle.p2.active[0];
		const curseResidual = Math.floor(aerodactyl.maxhp / 4);
		battle.makeChoices();
		assert.equal(kecleon.hp, kecleon.maxhp - Math.floor(kecleon.maxhp / 2));
		assert.equal(aerodactyl.hp, aerodactyl.maxhp - curseResidual);
	});

	it(`shouldn't fail if the target is already afflicted with Curse, but only became a Ghost-type mid-turn`, () => {
		battle = createChampionsBattle([[
			{ species: 'Greninja', moves: ['curse', 'sleeptalk'] },
		], [
			{ species: 'Aerodactyl', moves: ['trickortreat', 'soak'] },
		]]);
		const greninja = battle.p1.active[0];
		const aerodactyl = battle.p2.active[0];
		const curseResidual = Math.floor(aerodactyl.maxhp / 4);
		battle.makeChoices();
		assert.equal(greninja.hp, greninja.maxhp - Math.floor(greninja.maxhp / 2));
		assert.equal(aerodactyl.hp, aerodactyl.maxhp - curseResidual);

		battle.makeChoices('move sleeptalk', 'move soak');
		assert.equal(greninja.hp, greninja.maxhp - Math.floor(greninja.maxhp / 2));
		assert.equal(aerodactyl.hp, aerodactyl.maxhp - curseResidual * 2);

		battle.makeChoices();
		assert.equal(greninja.hp, greninja.maxhp - Math.floor(greninja.maxhp / 2) * 2);
		assert.equal(aerodactyl.hp, aerodactyl.maxhp - curseResidual * 3);
	});

	it(`[forced by Encore] shouldn't fail if the target is already afflicted with Curse and the user has Protean`, () => {
		battle = createChampionsBattle({ gameType: 'doubles' }, [[
			{ species: 'Gengar', moves: ['curse', 'shadowball'] },
			{ species: 'Gengar', moves: ['curse', 'sleeptalk'] },
		], [
			{ species: 'Pelipper', moves: ['soak', 'tailwind', 'encore'] },
			{ species: 'Pelipper', ability: 'protean', moves: ['soak', 'sleeptalk', 'skillswap'] },
		]]);
		battle.makeChoices('move curse 1, move curse 2', 'move soak 1, move soak 2');
		battle.makeChoices('move curse, move curse', 'move tailwind, move sleeptalk');
		battle.makeChoices('move shadowball 1, move curse', 'move encore 1, move skillswap 1');
		console.log(battle.getDebugLog());

		const gengar1 = battle.p1.active[0];
		assert.equal(gengar1.hp, gengar1.maxhp - Math.floor(gengar1.maxhp / 2) * 2);
		assert.equal(gengar1.boosts.atk, 1);

		const gengar2 = battle.p1.active[1];
		assert.equal(gengar2.hp, gengar2.maxhp - Math.floor(gengar2.maxhp / 2));
		assert.equal(gengar2.boosts.atk, 2);
	});

	it(`[forced by Encore] should fail if the target is already afflicted with Curse even if becomes a Ghost-type with Trick-or-Treat`, () => {
		battle = createChampionsBattle({ gameType: 'doubles' }, [[
			{ species: 'Gengar', moves: ['curse', 'shadowball'] },
			{ species: 'Gengar', moves: ['curse', 'sleeptalk'] },
		], [
			{ species: 'Pelipper', moves: ['soak', 'tailwind', 'encore'] },
			{ species: 'Pelipper', moves: ['soak', 'sleeptalk', 'trickortreat'] },
		]]);
		battle.makeChoices('move curse 1, move curse 2', 'move soak 1, move soak 2');
		battle.makeChoices('move curse, move curse', 'move tailwind, move sleeptalk');
		battle.makeChoices('move shadowball 1, move curse', 'move encore 1, move trickortreat 1');
		console.log(battle.getDebugLog());

		const gengar1 = battle.p1.active[0];
		assert.equal(gengar1.hp, gengar1.maxhp - Math.floor(gengar1.maxhp / 2));
		assert.equal(gengar1.boosts.atk, 1);

		const gengar2 = battle.p1.active[1];
		assert.equal(gengar2.hp, gengar2.maxhp - Math.floor(gengar2.maxhp / 2));
		assert.equal(gengar2.boosts.atk, 2);
	});

	it(`should boost its stats if the user stops being a Ghost-type mid-turn`, () => {
		battle = createChampionsBattle([[
			{ species: 'Gengar', moves: ['curse'] },
		], [
			{ species: 'Aerodactyl', moves: ['soak'] },
		]]);
		const gengar = battle.p1.active[0];
		const aerodactyl = battle.p2.active[0];
		battle.makeChoices();
		assert.fullHP(gengar);
		assert.equal(gengar.boosts.atk, 1);
		assert.fullHP(aerodactyl);
	});

	it(`should boost its stats if the target is already afflicted with Curse and the user stops being a Ghost-type mid-turn`, () => {
		battle = createChampionsBattle([[
			{ species: 'Gengar', moves: ['curse'] },
		], [
			{ species: 'Aerodactyl', moves: ['sleeptalk', 'soak'] },
		]]);
		const gengar = battle.p1.active[0];
		const aerodactyl = battle.p2.active[0];
		const curseResidual = Math.floor(aerodactyl.maxhp / 4);
		battle.makeChoices();
		assert.equal(gengar.hp, gengar.maxhp - Math.floor(gengar.maxhp / 2));
		assert.equal(aerodactyl.hp, aerodactyl.maxhp - curseResidual);

		battle.makeChoices('move curse', 'move soak');
		assert.equal(gengar.hp, gengar.maxhp - Math.floor(gengar.maxhp / 2));
		assert.equal(aerodactyl.hp, aerodactyl.maxhp - curseResidual * 2);
		assert.equal(gengar.boosts.atk, 1);
	});

	it(`should boost not be affected by Pressure if the user stops being a Ghost-type mid-turn`, () => {
		battle = createChampionsBattle([[
			{ species: 'Gengar', moves: ['curse'] },
		], [
			{ species: 'Aerodactyl', ability: 'pressure', moves: ['soak'] },
		]]);
		const gengar = battle.p1.active[0];
		const aerodactyl = battle.p2.active[0];
		battle.makeChoices();
		assert.fullHP(gengar);
		assert.equal(gengar.boosts.atk, 1);
		assert.fullHP(aerodactyl);
		assert.equal(gengar.moveSlots[0].pp, gengar.moveSlots[0].maxpp - 1);
	});

	it(`should curse a target if the user stops being a Ghost-type mid-turn, but has Protean`, () => {
		battle = createChampionsBattle([[
			{ species: 'Gengar', ability: 'protean', moves: ['curse'] },
		], [
			{ species: 'Aerodactyl', moves: ['soak'] },
		]]);
		const gengar = battle.p1.active[0];
		const aerodactyl = battle.p2.active[0];
		const curseResidual = Math.floor(aerodactyl.maxhp / 4);
		battle.makeChoices();
		assert.equal(gengar.hp, gengar.maxhp - Math.floor(gengar.maxhp / 2));
		assert.equal(aerodactyl.hp, aerodactyl.maxhp - curseResidual);

		battle.makeChoices();
		assert.equal(gengar.hp, gengar.maxhp - Math.floor(gengar.maxhp / 2));
		assert.equal(aerodactyl.hp, aerodactyl.maxhp - curseResidual * 2);
	});
});
