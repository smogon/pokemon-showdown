'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Tera Stellar", () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should increase the damage of non-STAB moves by 1.2x on the first use of that move type`, () => {
		battle = common.gen(9).createBattle([[
			{ species: 'Wynaut', ability: 'noguard', moves: ['surf', 'hydropump', 'extrasensory', 'hyperspacehole'], teraType: 'Stellar' },
		], [
			{ species: 'Happiny', ability: 'shellarmor', moves: ['softboiled'] },
		]]);

		const happiny = battle.p2.active[0];

		battle.makeChoices('move surf terastallize', 'auto');
		let damage = happiny.maxhp - happiny.hp;
		assert.bounded(damage, [40, 47], `Surf should have ~1.2x damage on its first use`);

		battle.makeChoices('move surf', 'auto');
		damage = happiny.maxhp - happiny.hp;
		assert.bounded(damage, [33, 39], `Surf should have regular damage on its second use`);

		battle.makeChoices('move hydropump', 'auto');
		damage = happiny.maxhp - happiny.hp;
		assert.bounded(damage, [39, 47], `Hydro Pump should have regular damage, because Water-type was already used`);

		battle.makeChoices('move extrasensory', 'auto');
		damage = happiny.maxhp - happiny.hp;
		assert.bounded(damage, [58, 70], `Extrasensory should have 2x damage on its first use`);

		battle.makeChoices('move extrasensory', 'auto');
		damage = happiny.maxhp - happiny.hp;
		assert.bounded(damage, [43, 52], `Extrasensory should have 1.5x damage on its second use`);

		battle.makeChoices('move hyperspacehole', 'auto');
		damage = happiny.maxhp - happiny.hp;
		assert.bounded(damage, [43, 52], `Hyperspace Hole should have 1.5x damage on its first use, because Psychic-type was already used`);
	});

	it(`should not have the once-per-type restriction when used by Terapagos`, () => {
		battle = common.gen(9).createBattle([[
			{ species: 'Terapagos', ability: 'terashift', moves: ['surf', 'hypervoice'], item: 'laggingtail', teraType: 'Stellar' },
		], [
			{ species: 'Chansey', ability: 'shellarmor', moves: ['softboiled'] },
		]]);

		const chansey = battle.p2.active[0];

		battle.makeChoices('move surf terastallize', 'auto');
		let damage = chansey.maxhp - chansey.hp;
		assert.bounded(damage, [94, 110], `Surf should have ~1.2x damage on its first use`);

		battle.makeChoices('move surf', 'auto');
		damage = chansey.maxhp - chansey.hp;
		assert.bounded(damage, [94, 110], `Surf should have ~1.2x damage on its second use`);

		battle.makeChoices('move hypervoice', 'auto');
		damage = chansey.maxhp - chansey.hp;
		assert.bounded(damage, [156, 184], `Hyper Voice should have 2x damage on its first use`);

		battle.makeChoices('move hypervoice', 'auto');
		damage = chansey.maxhp - chansey.hp;
		assert.bounded(damage, [156, 184], `Hyper Voice should have 2x damage on its second use`);
	});

	it(`should not modify the Pokemon's base type for defensive purposes`, () => {
		battle = common.gen(9).createBattle([[
			{ species: 'Krookodile', moves: ['sleeptalk'], teraType: 'Stellar' },
		], [
			{ species: 'Tornadus', ability: 'prankster', moves: ['psychic', 'thunderwave', 'leer'] },
		]]);

		const krookodile = battle.p1.active[0];

		battle.makeChoices('move sleeptalk terastallize', 'move psychic');
		assert.fullHP(krookodile);

		battle.makeChoices('auto', 'move thunderwave');
		assert.equal(krookodile.status, '');

		battle.makeChoices('auto', 'move thunderwave');

		battle.makeChoices('auto', 'move leer');
		assert.statStage(krookodile, 'def', 0);
	});

	it(`should only be super-effective against opposing Terastallized targets`, () => {
		battle = common.gen(9).createBattle([[
			{ species: 'Krookodile', moves: ['terablast'], teraType: 'Stellar' },
		], [
			{ species: 'Steelix', item: 'weaknesspolicy', moves: ['sleeptalk'], teraType: 'Stellar' },
		]]);

		const steelix = battle.p2.active[0];
		battle.makeChoices('move terablast terastallize', 'move sleeptalk terastallize');
		assert.statStage(steelix, 'atk', 2);
	});

	it(`should not work with Adapatability`, () => {
		battle = common.gen(9).createBattle([[
			{ species: 'Wynaut', ability: 'adaptability', moves: ['hyperspacehole', 'terablast'], teraType: 'Stellar' },
		], [
			{ species: 'Happiny', ability: 'shellarmor', moves: ['softboiled'] },
		]]);

		const happiny = battle.p2.active[0];

		battle.makeChoices('move hyperspacehole terastallize', 'auto');
		let damage = happiny.maxhp - happiny.hp;
		assert.bounded(damage, [58, 70], `Hyperspace Hole should only have 2x damage on its first use`);

		battle.makeChoices('move hyperspacehole', 'auto');
		damage = happiny.maxhp - happiny.hp;
		assert.bounded(damage, [43, 52], `Hyperspace Hole should only have 1.5x damage on its second use`);

		battle.makeChoices('move terablast', 'auto');
		damage = happiny.maxhp - happiny.hp;
		assert.bounded(damage, [43, 52], `Tera Blast should only have ~1.2x damage on its first use`);

		battle.makeChoices('move terablast', 'auto');
		damage = happiny.maxhp - happiny.hp;
		assert.bounded(damage, [24, 29], `Tera Blast should not have any boosted damage on its second use`);
	});

	it(`should increase the damage of all hits of a multi-hit move`, () => {
		battle = common.gen(9).createBattle([[
			{ species: 'Wynaut', moves: ['surgingstrikes', 'flipturn'], teraType: 'Stellar' },
		], [
			{ species: 'Blissey', moves: ['softboiled'] },
		]]);

		const blissey = battle.p2.active[0];

		battle.makeChoices('move surgingstrikes terastallize', 'auto');
		let damage = blissey.maxhp - blissey.hp;
		assert.bounded(damage, [144, 174], `Surging Strikes should have ~1.2x damage on its first use for all 3 hits`);

		battle.makeChoices('move flipturn', 'auto');
		damage = blissey.maxhp - blissey.hp;
		assert.bounded(damage, [63, 75], `Flip Turn should have regular damage on its first use, because Water-type was already used`);
	});

	it(`should boost the base power of weaker moves on the first use of that move type to 60 BP`, () => {
		battle = common.gen(9).createBattle([[
			{ species: 'Comfey', moves: ['drainingkiss', 'absorb'], teraType: 'Stellar' },
		], [
			{ species: 'Chansey', ability: 'shellarmor', moves: ['sleeptalk'] },
		]]);

		const chansey = battle.p2.active[0];

		let hp = chansey.hp;
		battle.makeChoices('move drainingkiss terastallize', 'auto');
		assert.bounded(hp - chansey.hp, [70, 84], `Draining Kiss should be a 60 BP with 2x damage on its first use`);

		hp = chansey.hp;
		battle.makeChoices('move drainingkiss', 'auto');
		assert.bounded(hp - chansey.hp, [45, 54], `Draining Kiss should be a 50 BP with 1.5x damage on its second use`);

		hp = chansey.hp;
		battle.makeChoices('move absorb', 'auto');
		assert.bounded(hp - chansey.hp, [42, 50], `Absorb should be a 60 BP with ~1.2x damage on its first use`);

		hp = chansey.hp;
		battle.makeChoices('move absorb', 'auto');
		assert.bounded(hp - chansey.hp, [12, 15], `Absorb should be a 20 BP with regular damage on its second use`);
	});
});
