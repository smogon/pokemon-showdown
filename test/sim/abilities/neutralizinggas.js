'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Neutralizing Gas', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should prevent switch-in abilities from activating', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Gyarados", ability: 'intimidate', moves: ['splash'] }] });
		battle.setPlayer('p2', { team: [{ species: "Weezing", ability: 'neutralizinggas', moves: ['toxicspikes'] }] });
		assert.statStage(battle.p2.active[0], 'atk', 0);
	});

	it('should ignore damage-reducing abilities', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Weezing", ability: 'neutralizinggas', item: 'expertbelt', moves: ['sludgebomb'] }] });
		battle.setPlayer('p2', { team: [{ species: "Mr. Mime", ability: 'filter', item: 'laggingtail', moves: ['substitute'] }] });
		battle.makeChoices('move sludgebomb', 'move substitute');
		assert(!battle.p1.active[0].volatiles['substitute']);
	});

	it('should negate self-healing abilities', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Weezing", ability: 'neutralizinggas', moves: ['toxic'] }] });
		battle.setPlayer('p2', { team: [{ species: "Breloom", ability: 'poisonheal', moves: ['swordsdance'] }] });
		battle.makeChoices('move toxic', 'move swordsdance');
		assert.false.fullHP(battle.p2.active[0]);
	});

	it('should negate abilities that suppress item effects', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Weezing", ability: 'neutralizinggas', moves: ['reflect'] }] });
		battle.setPlayer('p2', { team: [{ species: "Reuniclus", ability: 'magicguard', item: 'lifeorb', moves: ['shadowball'] }] });
		battle.makeChoices('move reflect', 'move shadowball');
		assert.false.fullHP(battle.p2.active[0]);
	});

	it('should negate abilities that modify boosts', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Weezing", ability: 'neutralizinggas', moves: ['spore'] }] });
		battle.setPlayer('p2', { team: [{ species: "Shuckle", ability: 'contrary', moves: ['sleeptalk', 'superpower'] }] });
		battle.makeChoices('move spore', 'move sleeptalk');
		assert.statStage(battle.p2.active[0], 'atk', -1);
	});

	it(`should negate abilities that activate on switch-out`, () => {
		battle = common.createBattle([
			[{ species: "Weezing", ability: 'neutralizinggas', moves: ['toxic'] },
				{ species: "Type: Null", ability: 'battlearmor', moves: ['facade'] }],
			[{ species: "Corsola", ability: 'naturalcure', moves: ['uturn'] },
				{ species: "Magikarp", ability: 'rattled', moves: ['splash'] }],
		]);
		battle.makeChoices('move toxic', 'move uturn');
		battle.makeChoices('', 'switch 2');
		battle.makeChoices('switch 2', 'switch 2');
		assert.equal(battle.p2.active[0].status, 'tox');
	});

	it('should negate abilities that modify move type', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Gengar", ability: 'neutralizinggas', moves: ['laserfocus'] }] });
		battle.setPlayer('p2', { team: [{ species: "Sylveon", ability: 'pixilate', moves: ['hypervoice'] }] });
		battle.makeChoices('move laserfocus', 'move hypervoice');
		assert.fullHP(battle.p1.active[0]);
	});

	it("should negate abilities that damage the attacker", () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [
			{ species: 'Weezing-Galar', ability: 'neutralizinggas', moves: ['payback'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: 'Ferrothorn', ability: 'ironbarbs', moves: ['rockpolish'] },
		] });
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0]);
	});

	it(`should negate Primal weather Abilities`, () => {
		battle = common.createBattle([[
			{ species: 'Groudon', item: 'redorb', moves: ['sleeptalk'] },
		], [
			{ species: 'Wynaut', moves: ['sleeptalk'] },
			{ species: 'Weezing', ability: 'neutralizinggas', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices('auto', 'switch 2');
		assert.false(battle.field.isWeather('desolateland'), `Desolate Land should be negated, turning off the weather`);
		battle.makeChoices('auto', 'switch 2');
		assert(battle.field.isWeather('desolateland'), `Desolate Land should be active again`);
	});

	it('should not activate Imposter if Neutralizing Gas leaves the field', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [
			{ species: "Weezing", ability: 'neutralizinggas', moves: ['snore'] },
			{ species: "Greninja", ability: 'torrent', moves: ['teleport'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: "Ditto", ability: 'imposter', moves: ['sleeptalk'] },
		] });
		assert.notEqual(battle.p1.active[0].species, battle.p2.active[0].species);
		battle.makeChoices('switch greninja', 'move sleeptalk');
		assert.notEqual(battle.p1.active[0].species, battle.p2.active[0].species);
		assert.notEqual(battle.p1.pokemon[1].species, battle.p2.active[0].species);
	});

	it(`should prevent Unburden's activation when it is active on the field`, () => {
		battle = common.createBattle([[
			{ species: "Wynaut", ability: 'unburden', item: 'sitrusberry', evs: { hp: 4 }, moves: ['bellydrum'] },
		], [
			{ species: "Pancham", ability: 'neutralizinggas', moves: ['sleeptalk'] },
			{ species: "Whismur", moves: ['sleeptalk'] },
		]]);

		const wynaut = battle.p1.active[0];
		const originalSpeed = wynaut.getStat('spe');
		battle.makeChoices();
		assert.equal(wynaut.getStat('spe'), originalSpeed);

		// The chance to trigger Unburden is gone, so it missed the timing and doesn't gain the speed post-NGas removal
		battle.makeChoices('auto', 'switch 2');
		assert.equal(wynaut.getStat('spe'), originalSpeed);
	});

	it(`should negate Unburden when Neutralizing Gas enters the field`, () => {
		battle = common.createBattle([[
			{ species: "Wynaut", ability: 'unburden', item: 'sitrusberry', evs: { hp: 4 }, moves: ['bellydrum'] },
		], [
			{ species: "Whismur", moves: ['sleeptalk'] },
			{ species: "Pancham", ability: 'neutralizinggas', moves: ['sleeptalk'] },
		]]);

		const wynaut = battle.p1.active[0];
		const originalSpeed = wynaut.getStat('spe');
		battle.makeChoices();
		assert.equal(wynaut.getStat('spe'), originalSpeed * 2);

		battle.makeChoices('auto', 'switch 2');
		assert.equal(wynaut.getStat('spe'), originalSpeed);

		battle.makeChoices('auto', 'switch 2');
		assert.equal(wynaut.getStat('spe'), originalSpeed * 2);
	});

	it(`should cause Illusion to instantly wear off when Neutralizing Gas enters the field`, () => {
		battle = common.createBattle([[
			{ species: "Zoroark", ability: 'illusion', moves: ['sleeptalk'] },
			{ species: "Eternatus", moves: ['sleeptalk'] },
		], [
			{ species: "Wynaut", moves: ['sleeptalk'] },
			{ species: "Weezing", ability: 'neutralizinggas', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices('auto', 'switch 2');
		assert(battle.log.some(line => line.includes('|-end|p1a: Zoroark|Illusion')));
	});

	it(`should cause Slow Start to instantly wear off/restart when Neutralizing Gas leaves/enters the field`, () => {
		battle = common.createBattle([[
			{ species: "Regigigas", ability: 'slowstart', moves: ['sleeptalk'] },
			{ species: "Eternatus", moves: ['sleeptalk'] },
		], [
			{ species: "Wynaut", moves: ['sleeptalk'] },
			{ species: "Weezing", ability: 'neutralizinggas', moves: ['sleeptalk'] },
		]]);

		const regigigas = battle.p1.active[0];
		const slowStartSpeed = regigigas.getStat('spe');

		// Slow Start should be negated, so it should have its original, non-Slow Start speed
		battle.makeChoices('auto', 'switch 2');
		assert.equal(regigigas.getStat('spe'), slowStartSpeed * 2);

		// Slow Start should be turned back on, so it should have its Slow Start speed again
		battle.makeChoices('auto', 'switch 2');
		assert.equal(regigigas.getStat('spe'), slowStartSpeed);
	});

	it(`should not cause Gluttony to instantly eat Berries when Neutralizing Gas leaves the field`, () => {
		battle = common.createBattle([[
			{ species: "Wynaut", ability: 'gluttony', item: 'aguavberry', evs: { hp: 4 }, moves: ['bellydrum'] },
		], [
			{ species: "Pancham", ability: 'neutralizinggas', moves: ['sleeptalk'] },
			{ species: "Whismur", level: 1, moves: ['seismictoss'] },
		]]);

		const wynaut = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(wynaut.hp, Math.floor(wynaut.maxhp / 2));

		// Gluttony doesn't activate because it missed the timing
		battle.makeChoices('auto', 'switch 2');
		assert.equal(wynaut.hp, Math.floor(wynaut.maxhp / 2));

		// Gluttony now has the opportunity to activate the Aguav Berry again on taking damage
		battle.makeChoices();
		assert.equal(wynaut.hp, Math.floor(wynaut.maxhp / 2) - 1 + Math.floor(wynaut.maxhp / 3));
	});

	it(`should not trigger twice if negated then replaced`, () => {
		battle = common.createBattle([[
			{ species: "Weezing", ability: 'neutralizinggas', moves: ['sleeptalk'] },
		], [
			{ species: "Wynaut", ability: 'intrepidsword', moves: ['gastroacid', 'simplebeam'] },
		]]);

		const wynaut = battle.p2.active[0];
		battle.makeChoices();
		assert.statStage(wynaut, 'atk', 1);

		// We already negated NGas, so it shouldn't run other abilities again
		battle.makeChoices('auto', 'move simplebeam');
		assert.statStage(wynaut, 'atk', 1);
	});

	it(`should not re-trigger Unnerve if the ability was already triggered before`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: "Bisharp", ability: 'defiant', moves: ['sleeptalk'] },
			{ species: "Eternatus", ability: 'pressure', moves: ['sleeptalk'] },
		], [
			{ species: "Rookidee", ability: 'unnerve', moves: ['sleeptalk'] },
			{ species: "Diglett", moves: ['sleeptalk'] },
			{ species: "Weezing", ability: 'neutralizinggas', moves: ['sleeptalk'] },
		]]);

		// Unnerve activates properly on lead
		battle.makeChoices('auto', 'move sleeptalk, switch 3');
		battle.makeChoices('auto', 'move sleeptalk, switch 3');

		// It will become active again after a Neutralizing Gas cycle, but without the Ability message
		battle.makeChoices('auto', 'move sleeptalk, switch 3');

		const log = battle.getDebugLog();
		const firstUnnerveIndex = log.indexOf('|-ability|p2a: Rookidee|Unnerve');
		const secondUnnerveIndex = log.lastIndexOf('|-ability|p2a: Rookidee|Unnerve');
		assert.equal(firstUnnerveIndex, secondUnnerveIndex, 'Unnerve should have only activated once.');
	});

	it(`should not announce Neutralizing Gas has worn off, if multiple are active simultenously`, () => {
		battle = common.createBattle([[
			{ species: "Weezing", ability: 'neutralizinggas', moves: ['sleeptalk'] },
		], [
			{ species: "Weezing", ability: 'neutralizinggas', moves: ['sleeptalk'] },
			{ species: "Wynaut", ability: 'intrepidsword', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices('move sleeptalk', 'switch 2');
		assert(battle.log.every(line => !line.startsWith('|-end')));
		assert.statStage(battle.p2.active[0], 'atk', 0);
	});

	it(`should not prevent Ice Face from blocking damage nor reform Ice Face when leaving the field`, () => {
		battle = common.createBattle([[
			{ species: 'Eiscue', ability: 'iceface', moves: ['sleeptalk', 'hail'] },
		], [
			{ species: 'Mewtwo', ability: 'neutralizinggas', moves: ['tackle', 'sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		]]);
		const eiscue = battle.p1.active[0];
		battle.makeChoices();
		assert.species(eiscue, 'Eiscue-Noice');
		battle.makeChoices('move hail', 'move sleeptalk');
		assert.species(eiscue, 'Eiscue');
		battle.makeChoices();
		assert.species(eiscue, 'Eiscue-Noice');
		battle.makeChoices('auto', 'switch 2');
		assert.species(eiscue, 'Eiscue-Noice');
	});

	it(`should not work if it was obtained via Transform`, () => {
		battle = common.createBattle([[
			{ species: 'Ditto', moves: ['transform'] },
		], [
			{ species: 'Weezing', ability: 'neutralizinggas', moves: ['sleeptalk'] },
			{ species: 'Zacian', ability: 'intrepidsword', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		battle.makeChoices('auto', 'switch 2');
		assert.statStage(battle.p2.active[0], 'atk', 1);
	});

	it(`should not reactivate abilities that were protected by Ability Shield`, () => {
		battle = common.createBattle([[
			{ species: 'Porygon', ability: 'download', item: 'abilityshield', moves: ['sleeptalk'] },
		], [
			{ species: 'Weezing', ability: 'neutralizinggas', moves: ['sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices('move sleeptalk', 'auto');
		battle.makeChoices('auto', 'switch 2');
		const porygon = battle.p1.active[0];
		assert.statStage(porygon, 'spa', 1);
	});

	it(`should not reactivate instances of Embody Aspect that had previously activated`, () => {
		battle = common.gen(9).createBattle({ gameType: 'freeforall' }, [[
			{ species: 'Ogerpon-Hearthflame', ability: 'moldbreaker', item: 'hearthflamemask', moves: ['bellydrum'] },
		], [
			{ species: 'Ogerpon-Wellspring', ability: 'waterabsorb', item: 'wellspringmask', moves: ['sleeptalk'] },
		], [
			{ species: 'Ogerpon-Cornerstone', ability: 'sturdy', item: 'cornerstonemask', moves: ['sleeptalk'] },
		], [
			{ species: 'Cosmog', moves: ['splash', 'teleport'] },
			{ species: 'Weezing', ability: 'neutralizinggas', moves: ['memento'] },
		]]);

		// only wellspring teras this turn
		battle.makeChoices('auto', 'move sleeptalk terastallize', 'auto', 'auto');
		// only hearthflame teras this turn; embody aspect cannot boost its attack any further
		battle.makeChoices('move bellydrum terastallize', 'auto', 'auto', 'move teleport');
		// note that cornerstone has not tera'd yet
		battle.makeChoices('', '', '', 'switch 2');
		const hearthflame = battle.p1.active[0];
		const wellspring = battle.p2.active[0];
		const cornerstone = battle.p3.active[0];
		assert.statStage(hearthflame, 'atk', 6);
		assert.statStage(wellspring, 'spd', 1);
		assert.statStage(cornerstone, 'def', 0);
		battle.makeChoices('auto', 'auto', 'move sleeptalk terastallize', 'move memento 1');
		assert.statStage(hearthflame, 'atk', 4, `Ogerpon-Hearthflame-Tera's Embody Aspect should not have been reactivated`);
		assert.statStage(wellspring, 'spd', 1, `Ogerpon-Wellspring-Tera's Embody Aspect should not have activated twice`);
		assert.statStage(cornerstone, 'def', 1, `Ogerpon-Cornerstone-Tera's Embody Aspect should have been activated by Neutalizing Gas ending`);
	});

	describe(`Ability reactivation order`, () => {
		it(`should cause entrance Abilities to reactivate in order of Speed`, () => {
			battle = common.createBattle({ gameType: 'doubles' }, [[
				{ species: "Pincurchin", ability: 'electricsurge', moves: ['sleeptalk'] },
				{ species: "Eternatus", moves: ['sleeptalk'] },
			], [
				{ species: "Rillaboom", ability: 'grassysurge', moves: ['sleeptalk'] },
				{ species: "Weezing", ability: 'neutralizinggas', moves: ['sleeptalk'] },
				{ species: "Diglett", moves: ['sleeptalk'] },
			]]);

			battle.makeChoices('auto', 'move sleeptalk, switch 3');
			assert(battle.field.isTerrain('electricterrain'));
		});

		it(`should cause non-entrance abilities to be active immediately`, () => {
			battle = common.createBattle({ gameType: 'doubles' }, [[
				{ species: "Bisharp", ability: 'defiant', moves: ['sleeptalk'] },
				{ species: "Eternatus", moves: ['sleeptalk'] },
			], [
				{ species: "Salamence", ability: 'intimidate', moves: ['sleeptalk'] },
				{ species: "Weezing", ability: 'neutralizinggas', moves: ['sleeptalk'] },
				{ species: "Diglett", moves: ['sleeptalk'] },
			]]);

			battle.makeChoices('auto', 'move sleeptalk, switch 3');
			assert.statStage(battle.p1.active[0], 'atk', 1);
		});

		it(`should not give Unnerve priority in activation`, () => {
			battle = common.createBattle({ gameType: 'doubles' }, [[
				{ species: "Bisharp", ability: 'defiant', moves: ['sleeptalk'] },
				{ species: "Eternatus", ability: 'pressure', moves: ['sleeptalk'] },
			], [
				{ species: "Rookidee", ability: 'unnerve', moves: ['sleeptalk'] },
				{ species: "Weezing", ability: 'neutralizinggas', moves: ['sleeptalk'] },
				{ species: "Diglett", moves: ['sleeptalk'] },
			]]);

			battle.makeChoices('auto', 'move sleeptalk, switch 3');

			const log = battle.getDebugLog();
			const pressureIndex = log.indexOf('|-ability|p1b: Eternatus|Pressure');
			const unnerveIndex = log.indexOf('|-ability|p2a: Rookidee|Unnerve');
			assert(unnerveIndex > 0, 'Unnerve should have an activation message');
			assert(pressureIndex < unnerveIndex, 'Faster Pressure should activate before slower Unnerve');
		});
	});
});
