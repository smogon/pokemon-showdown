'use strict';

const assert = require('./../assert');
const common = require('./../common');

/**
 * These tests document Pokémon Champions mechanics.
 * Since patches may change them, do not treat these expectations as authoritative
 * without verifying them against the latest version of the game.
 */

let battle;

const createChampionsBattle = (options, teams) => {
	if (Array.isArray(options)) {
		teams = options;
		options = {};
	}
	if (!options) options = {};
	const rules = ['!teampreview'];
	const format = options.gameType === 'doubles' ? 'gen9championsdoublescustomgame' : 'gen9championscustomgame';
	const formatid = `${format}@@@${rules.join(',')}`;
	teams = teams.map(team => team.map(set => ({ ...set, level: 50 })));
	return common.createBattle({ formatid, ...options }, teams);
};

describe('Champions abilities', () => {
	afterEach(() => {
		battle.destroy();
	});

	describe('Berserk', () => {
		it(`should not be suppressed by Sheer Force`, () => {
			battle = createChampionsBattle([[
				{ species: 'Drampa', ability: 'berserk', moves: ['sleeptalk'] },
			], [
				{ species: 'Landorus', ability: 'sheerforce', moves: ['earthpower'] },
			]]);

			const drampa = battle.p1.active[0];
			battle.makeChoices();
			assert.false.fainted(drampa);
			assert.atMost(drampa.hp, drampa.maxhp / 2);
			assert.statStage(drampa, 'spa', 1);
		});
	});

	describe('Emergency Exit', () => {
		it(`should not prevent Eject Button's activation`, () => {
			battle = createChampionsBattle([[
				{
					species: 'Golisopod', ability: 'emergencyexit', item: 'ejectbutton',
					moves: ['sleeptalk'], ivs: { hp: 0 },
				},
				{ species: 'Clefable', moves: ['sleeptalk'] },
			], [
				{ species: 'Raticate', ability: 'guts', moves: ['superfang'] },
				{ species: 'Clefable', moves: ['sleeptalk'] },
			]]);
			const eePokemon = battle.p1.active[0];

			battle.makeChoices();
			assert.atMost(eePokemon.hp, eePokemon.maxhp / 2);
			assert.false.holdsItem(eePokemon);
			assert.equal(battle.requestState, 'switch');

			battle.makeChoices('switch 2', '');
			assert.species(battle.p1.active[0], 'Clefable');
		});

		it(`should not be suppressed by Sheer Force`, () => {
			battle = createChampionsBattle([[
				{ species: 'Golisopod', ability: 'emergencyexit', moves: ['sleeptalk'] },
				{ species: 'Clefable', moves: ['sleeptalk'] },
			], [
				{ species: 'Nidoking', ability: 'sheerforce', moves: ['thunderbolt'] },
			]]);

			battle.makeChoices();
			assert.atMost(battle.p1.active[0].hp, battle.p1.active[0].maxhp / 2);
			assert.equal(battle.requestState, 'switch');
		});

		it(`should activate alongside Volt Switch`, () => {
			battle = createChampionsBattle([[
				{ species: 'Golisopod', ability: 'emergencyexit', moves: ['sleeptalk'] },
				{ species: 'Clefable', moves: ['sleeptalk'] },
			], [
				{ species: 'Jolteon', moves: ['voltswitch'] },
				{ species: 'Clefable', moves: ['sleeptalk'] },
			]]);

			battle.makeChoices();
			assert.equal(battle.requestState, 'switch');
			battle.makeChoices('switch 2', 'switch 2');
			assert.species(battle.p1.active[0], 'Clefable');
			assert.species(battle.p2.active[0], 'Clefable');
		});

		it(`should allow multiple holders to activate from the same move`, () => {
			battle = createChampionsBattle({ gameType: 'doubles' }, [[
				{ species: 'Golisopod', ability: 'emergencyexit', moves: ['sleeptalk'] },
				{ species: 'Mew', ability: 'emergencyexit', moves: ['sleeptalk'] },
				{ species: 'Wynaut', moves: ['sleeptalk'] },
				{ species: 'Wobbuffet', moves: ['sleeptalk'] },
			], [
				{ species: 'Caterpie', moves: ['swift'] },
				{ species: 'Clefable', moves: ['sleeptalk'] },
			]]);
			for (const pokemon of battle.p1.active) {
				pokemon.hp = Math.floor(pokemon.maxhp / 2) + 1;
			}

			battle.makeChoices();
			battle.makeChoices('switch 3, switch 4', '');
			assert.species(battle.p1.active[0], 'Wynaut');
			assert.species(battle.p1.active[1], 'Wobbuffet');
		});
	});

	describe('Mega Sol', () => {
		it('should apply Sunny Day damage boosts', () => {
			battle = createChampionsBattle([[
				{ species: "Meganium", item: 'meganiumite', moves: ['weatherball'] },
			], [
				{ species: "Pelipper", ability: 'drizzle', moves: ['sleeptalk'] },
			]]);

			battle.makeChoices('move weatherball mega', 'move sleeptalk');
			const pelipper = battle.p2.active[0];
			assert.bounded(pelipper.maxhp - pelipper.hp, [51, 60]);
		});

		it('should bypass weather defensive boosts', () => {
			battle = createChampionsBattle([[
				{ species: "Meganium", item: 'meganiumite', moves: ['weatherball'] },
			], [
				{ species: "Tyranitar", item: 'tyranitarite', moves: ['sleeptalk'] },
			]]);

			battle.makeChoices('move weatherball mega', 'move sleeptalk mega');
			const tyranitar = battle.p2.active[0];
			assert.bounded(tyranitar.maxhp - tyranitar.hp, [38, 45]);
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

	describe('Parental Bond', () => {
		it(`should not announce a hit count if the target faints to the first hit`, () => {
			battle = createChampionsBattle([[
				{ species: 'Kangaskhan', ability: 'parentalbond', moves: ['bite'] },
			], [
				{ species: 'Shedinja', moves: ['splash'] },
			]]);

			battle.makeChoices();
			assert.fainted(battle.p2.active[0]);
			assert.false(battle.log.some(line => line.startsWith('|-hitcount|')));
		});
	});

	describe('Pickpocket', () => {
		it(`should not be suppressed by Sheer Force`, () => {
			battle = createChampionsBattle([[
				{ species: 'Weavile', ability: 'pickpocket', moves: ['agility'] },
			], [
				{ species: 'Sylveon', ability: 'sheerforce', item: 'choicescarf', moves: ['bodyslam'] },
			]]);

			battle.makeChoices();
			assert.holdsItem(battle.p1.active[0], 'choicescarf');
			assert.false.holdsItem(battle.p2.active[0]);
		});
	});

	describe('Prankster', () => {
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

	describe('Spicy Spray', () => {
		it(`should not activate against the source of a future move after it switches out`, () => {
			battle = createChampionsBattle([[
				{ species: 'Wynaut', moves: ['futuresight'] },
				{ species: 'Wobbuffet', moves: ['sleeptalk'] },
			], [
				{ species: 'Eelektross', ability: 'spicyspray', moves: ['sleeptalk'] },
			]]);

			battle.makeChoices();
			battle.makeChoices('switch 2', 'auto');
			battle.makeChoices();
			assert.false.fullHP(battle.p2.active[0]);
			assert.equal(battle.p1.active[0].status, '');
		});
	});

	describe('Unseen Fist', () => {
		it(`should make contact moves deal one quarter damage through Protect`, () => {
			battle = createChampionsBattle([[
				{ species: 'Golurk', ability: 'unseenfist', item: 'golurkite', moves: ['shadowpunch'] },
			], [
				{ species: 'Clefable', moves: ['protect'] },
			]]);
			const clefable = battle.p2.active[0];

			battle.makeChoices('move shadowpunch mega', 'move protect');
			assert.bounded(clefable.maxhp - clefable.hp, [16, 19]);
		});
	});
});

describe('Champions items', () => {
	afterEach(() => {
		battle.destroy();
	});

	describe('Eject Button', () => {
		it(`should not be suppressed by Sheer Force`, () => {
			battle = createChampionsBattle([[
				{ species: 'Mew', item: 'ejectbutton', moves: ['sleeptalk'] },
				{ species: 'Clefable', moves: ['sleeptalk'] },
			], [
				{ species: 'Wynaut', ability: 'sheerforce', moves: ['confusion'] },
			]]);

			battle.makeChoices();
			assert.false.holdsItem(battle.p1.active[0]);
			assert.equal(battle.requestState, 'switch');
			battle.makeChoices('switch 2', '');
			assert.species(battle.p1.active[0], 'Clefable');
		});

		it(`should allow the attacker to pivot with U-turn after activating`, () => {
			battle = createChampionsBattle({ gameType: 'doubles' }, [[
				{ species: 'Ambipom', moves: ['uturn'] },
				{ species: 'Clefable', moves: ['sleeptalk'] },
				{ species: 'Magikarp', moves: ['splash'] },
			], [
				{ species: 'Clefable', item: 'ejectbutton', moves: ['followme'] },
				{ species: 'Aggron', moves: ['sleeptalk'] },
				{ species: 'Magikarp', moves: ['splash'] },
			]]);

			battle.makeChoices('move uturn 2, move sleeptalk', 'move followme, move sleeptalk');
			assert.equal(battle.requestState, 'switch');
			battle.makeChoices('switch 3', 'switch 3');
			assert.species(battle.p1.active[0], 'Magikarp');
			assert.species(battle.p2.active[0], 'Magikarp');
		});

		it(`should only activate one Eject Button when multiple holders are hit`, () => {
			battle = createChampionsBattle({ gameType: 'doubles' }, [[
				{ species: 'Hydreigon', moves: ['breakingswipe'] },
				{ species: 'Horsea', moves: ['sleeptalk'] },
			], [
				{ species: 'Snorlax', item: 'ejectbutton', moves: ['sleeptalk'] },
				{ species: 'Mew', item: 'ejectbutton', moves: ['sleeptalk'] },
				{ species: 'Wynaut', moves: ['sleeptalk'] },
				{ species: 'Wobbuffet', moves: ['sleeptalk'] },
			]]);

			battle.makeChoices();
			assert.throws(() => battle.choose('p2', 'switch 3, switch 4'));
			assert.holdsItem(battle.p2.active[0], 'ejectbutton');
			assert.false.holdsItem(battle.p2.active[1], 'ejectbutton');
			battle.makeChoices('', 'switch 3');
			assert.species(battle.p2.active[0], 'Snorlax');
			assert.species(battle.p2.active[1], 'Wynaut');
		});
	});
});

describe('Champions moves', () => {
	afterEach(() => {
		battle.destroy();
	});

	describe('Ceaseless Edge', () => {
		it(`should set Spikes when the user faints from Rocky Helmet`, () => {
			battle = createChampionsBattle([[
				{ species: 'Samurott-Hisui', ability: 'noguard', item: 'focussash', moves: ['ceaselessedge'] },
				{ species: 'Wynaut', moves: ['sleeptalk'] },
			], [
				{ species: 'Regieleki', item: 'rockyhelmet', moves: ['sheercold'] },
			]]);

			battle.makeChoices();
			assert.fainted(battle.p1.active[0]);
			assert(battle.p2.sideConditions['spikes']);
		});
	});

	describe('Curse', () => {
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

		it(`should redirect to a foe when targeting an ally already affected by Curse`, () => {
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

		it(`should be affected by opposing Pressure if targeting an ally`, () => {
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

		it(`should not hit a semi-invulnerable target`, () => {
			battle = createChampionsBattle([[
				{ species: 'Gengar', moves: ['curse'] },
			], [
				{ species: 'Aerodactyl', moves: ['fly'] },
			]]);
			battle.makeChoices();
			assert.fullHP(battle.p1.active[0]);
			assert.fullHP(battle.p2.active[0]);
		});

		it(`should be able to hit a semi-invulnerable target if a non-Ghost user has Protean`, () => {
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

		it(`should be able to hit a semi-invulnerable target if the user became a Ghost due to Trick-or-Treat`, () => {
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

		it(`should target a random opponent if the target is a semi-invulnerable ally`, () => {
			battle = createChampionsBattle({ gameType: 'doubles' }, [[
				{ species: 'Deoxys', moves: ['fly'] },
				{ species: 'Gengar', moves: ['curse'] },
			], [
				{ species: 'Caterpie', moves: ['sleeptalk'] },
				{ species: 'Metapod', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('move fly 1, move curse -1', 'auto');
			assert.fullHP(battle.p1.active[0]);
			assert(battle.p2.active[0].maxhp !== battle.p2.active[0].hp || battle.p2.active[1].maxhp !== battle.p2.active[1].hp);
		});

		it(`should boost its stats if a Ghost user has Protean and was hit by Electrify`, () => {
			battle = createChampionsBattle([[
				{ species: 'Gengar', ability: 'protean', moves: ['curse'] },
			], [
				{ species: 'Aerodactyl', moves: ['electrify'] },
			]]);
			const gengar = battle.p1.active[0];
			const aerodactyl = battle.p2.active[0];
			battle.makeChoices();
			assert.fullHP(gengar);
			assert.equal(gengar.boosts.atk, 1);
			assert.fullHP(aerodactyl);
		});

		it(`should not be affected by Pressure if a Ghost user has Protean and was hit by Electrify`, () => {
			battle = createChampionsBattle([[
				{ species: 'Gengar', ability: 'protean', moves: ['curse'] },
			], [
				{ species: 'Aerodactyl', moves: ['electrify'] },
			]]);
			const gengar = battle.p1.active[0];
			const aerodactyl = battle.p2.active[0];
			battle.makeChoices();
			assert.fullHP(gengar);
			assert.equal(gengar.boosts.atk, 1);
			assert.fullHP(aerodactyl);
			assert.equal(aerodactyl.moveSlots[0].pp, aerodactyl.moveSlots[0].maxpp - 1);
		});

		it(`should target a random opponent if the target is an ally that uses Ally Switch`, () => {
			battle = createChampionsBattle({ gameType: 'doubles' }, [[
				{ species: 'Wynaut', moves: ['allyswitch'] },
				{ species: 'Gengar', moves: ['curse'] },
			], [
				{ species: 'Caterpie', moves: ['sleeptalk'] },
				{ species: 'Metapod', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('move allyswitch, move curse -1', 'auto');
			assert.fullHP(battle.p1.active[1]);
			assert(battle.p2.active[0].maxhp !== battle.p2.active[0].hp || battle.p2.active[1].maxhp !== battle.p2.active[1].hp);
		});

		it(`should not be able to hit an opposing semi-invulnerable target if targeted an ally`, () => {
			battle = createChampionsBattle({ gameType: 'doubles' }, [[
				{ species: 'Gengar', moves: ['curse'] },
				{ species: 'Gourgeist', moves: ['sleeptalk'] },
			], [
				{ species: 'Aerodactyl', moves: ['fly'] },
				{ species: 'Aerodactyl', moves: ['fly'] },
			]]);
			battle.makeChoices();
			assert.fullHP(battle.p2.active[0]);
			assert.fullHP(battle.p2.active[1]);
		});

		it(`should not be able to hit an opposing semi-invulnerable target if targeted an ally that uses Ally Switch`, () => {
			battle = createChampionsBattle({ gameType: 'doubles' }, [[
				{ species: 'Gengar', moves: ['curse'] },
				{ species: 'Gourgeist', moves: ['allyswitch'] },
			], [
				{ species: 'Aerodactyl', moves: ['fly'] },
				{ species: 'Aerodactyl', moves: ['fly'] },
			]]);

			battle.makeChoices('move curse -2, move allyswitch', 'auto');
			assert.fullHP(battle.p2.active[0]);
			assert.fullHP(battle.p2.active[1]);
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

		it(`should not be affected by Pressure if the user stops being a Ghost-type mid-turn`, () => {
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

	describe('Encore', () => {
		it(`should restore the priority of the originally selected move`, () => {
			battle = createChampionsBattle({ gameType: 'doubles' }, [[
				{ species: 'regieleki', moves: ['sleeptalk', 'substitute'] },
				{ species: 'pichu', moves: ['sleeptalk'] },
			], [
				{ species: 'whimsicott', ability: 'prankster', moves: ['sleeptalk', 'encore'] },
				{ species: 'terrakion', moves: ['quickattack', 'headlongrush'] },
			]]);

			battle.makeChoices('auto', 'move sleeptalk, move headlongrush 2');
			battle.makeChoices('move substitute', 'move encore -2, move quickattack 1');
			assert.false.fainted(battle.p1.active[0]);
		});

		it(`should restore the priority of the originally selected move once and get blocked when appropriate`, () => {
			battle = createChampionsBattle({ gameType: 'doubles' }, [[
				{ species: 'regieleki', moves: ['psychicterrain'] },
				{ species: 'pichu', moves: ['sleeptalk'] },
			], [
				{ species: 'whimsicott', ability: 'prankster', moves: ['sleeptalk', 'encore'] },
				{ species: 'terrakion', moves: ['quickattack', 'headlongrush'] },
			]]);

			battle.makeChoices('auto', 'move sleeptalk, move quickattack 2');
			battle.makeChoices('auto', 'move encore -2, move headlongrush 1');
			assert.fullHP(battle.p1.active[0]);
		});
	});

	describe('Gigaton Hammer', () => {
		it(`should be forced by Encore through Disable on the turn after it was used`, () => {
			battle = createChampionsBattle({ gameType: 'doubles' }, [[
				{ species: 'Tinkaton', moves: ['gigatonhammer', 'tackle'] },
				{ species: 'Wynaut', moves: ['sleeptalk'] },
			], [
				{ species: 'Aggron', ability: 'prankster', moves: ['disable', 'sleeptalk'] },
				{ species: 'Steelix', ability: 'prankster', moves: ['encore', 'sleeptalk'] },
			]]);
			const gigatonHammer = battle.p1.active[0].getMoveData('gigatonhammer');

			battle.makeChoices('move gigatonhammer 1, move sleeptalk', 'move sleeptalk, move sleeptalk');
			battle.makeChoices('move tackle 1, move sleeptalk', 'move disable 1, move encore 1');
			assert.equal(gigatonHammer.pp, gigatonHammer.maxpp - 2);
		});
	});

	describe('Ice Spinner', () => {
		it(`should remove Terrain when the user faints from Rocky Helmet`, () => {
			battle = createChampionsBattle([[
				{ species: 'Shedinja', moves: ['icespinner'] },
				{ species: 'Wynaut', moves: ['sleeptalk'] },
			], [
				{ species: 'Registeel', item: 'rockyhelmet', ability: 'psychicsurge', moves: ['sleeptalk'] },
			]]);

			battle.makeChoices();
			assert.fainted(battle.p1.active[0]);
			assert.false(battle.field.isTerrain('psychicterrain'));
		});
	});

	describe('Knock Off', () => {
		it(`should remove the target's item when the user faints mid-move`, () => {
			battle = createChampionsBattle([[
				{ species: 'Shedinja', moves: ['knockoff'] },
				{ species: 'Wynaut', moves: ['sleeptalk'] },
			], [
				{ species: 'Ferrothorn', ability: 'ironbarbs', item: 'rockyhelmet', moves: ['sleeptalk'] },
			]]);

			battle.makeChoices();
			assert.fainted(battle.p1.active[0]);
			assert.false.holdsItem(battle.p2.active[0]);
		});
	});

	describe('No Retreat', () => {
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

	describe('Rage Fist', () => {
		it(`should reset its hit counter when the user switches out`, () => {
			battle = createChampionsBattle([[
				{ species: 'Primeape', moves: ['ragefist'] },
				{ species: 'Wynaut', moves: ['sleeptalk'] },
			], [
				{ species: 'Umbreon', moves: ['tackle', 'sleeptalk'] },
			]]);
			const primeape = battle.p1.active[0];

			battle.makeChoices();
			assert.equal(primeape.timesAttacked, 1);
			battle.makeChoices('switch 2', 'move sleeptalk');
			battle.makeChoices('switch 2', 'move sleeptalk');
			assert.equal(primeape.timesAttacked, 0);
		});
	});

	describe('Rapid Spin', () => {
		it(`should remove hazards when the user faints from Rocky Helmet`, () => {
			battle = createChampionsBattle([[
				{ species: 'Mew', item: 'rockyhelmet', moves: ['stealthrock'] },
			], [
				{ species: 'Shedinja', moves: ['rapidspin'] },
				{ species: 'Wynaut', moves: ['sleeptalk'] },
			]]);

			battle.makeChoices();
			assert.fainted(battle.p2.active[0]);
			assert.false(battle.p2.sideConditions['stealthrock']);
		});
	});

	describe('Stone Axe', () => {
		it(`should set Stealth Rock when the user faints from Rocky Helmet`, () => {
			battle = createChampionsBattle([[
				{ species: 'Kleavor', ability: 'noguard', item: 'focussash', moves: ['stoneaxe'] },
				{ species: 'Wynaut', moves: ['sleeptalk'] },
			], [
				{ species: 'Regieleki', item: 'rockyhelmet', moves: ['sheercold'] },
			]]);

			battle.makeChoices();
			assert.fainted(battle.p1.active[0]);
			assert(battle.p2.sideConditions['stealthrock']);
		});
	});
});
