'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Terastallization", function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should change the user\'s type to its Tera type after terastallizing', function () {
		battle = common.gen(9).createBattle([[
			{species: 'Ampharos', ability: 'static', moves: ['voltswitch', 'dragonpulse'], teraType: 'Dragon'},
		], [
			{species: 'Ampharos', ability: 'static', moves: ['voltswitch'], teraType: 'Dragon'},
		]]);
		battle.makeChoices('move dragonpulse terastallize', 'auto');
		assert.equal(battle.p1.active[0].getTypes().join('/'), 'Dragon');
	});

	it('should persist the user\'s changed type after switching', function () {
		battle = common.gen(9).createBattle([[
			{species: 'Ampharos', ability: 'static', moves: ['voltswitch', 'dragonpulse'], teraType: 'Dragon'},
			{species: 'Flaaffy', ability: 'static', moves: ['voltswitch', 'dragonpulse'], teraType: 'Electric'},
		], [
			{species: 'Ampharos', ability: 'static', moves: ['voltswitch'], teraType: 'Dragon'},
		]]);
		battle.makeChoices('move dragonpulse terastallize', 'move voltswitch');
		assert.equal(battle.p1.active[0].getTypes().join('/'), 'Dragon');
		battle.makeChoices('switch 2', 'move voltswitch');
		assert.equal(battle.p1.pokemon[1].getTypes().join('/'), 'Dragon');
	});

	it('should give STAB correctly to the user\'s old types', function () {
		battle = common.gen(9).createBattle([[
			{species: 'Ampharos', ability: 'shellarmor', moves: ['shockwave', 'swift'], teraType: 'Electric'},
		], [
			{species: 'Ampharos', ability: 'shellarmor', moves: ['shockwave', 'swift'], teraType: 'Normal'},
		]]);
		battle.makeChoices('move shockwave terastallize', 'move shockwave terastallize');
		const teraDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		// 0 SpA Adaptability Ampharos Shock Wave vs. 0 HP / 0 SpD Ampharos: 108-128
		assert.bounded(teraDamage, [108, 128],
			"Terastallizing into the same type did not boost STAB; actual damage: " + teraDamage);
		const nonTeraDamage = battle.p1.active[0].maxhp - battle.p1.active[0].hp;
		// 0 SpA Ampharos Shock Wave vs. 0 HP / 0 SpD Ampharos: 40-48
		assert.bounded(nonTeraDamage, [40, 48],
			"Terastallizing did not keep old type's STAB; actual damage: " + nonTeraDamage);

		battle = common.gen(9).createBattle([[
			{species: 'Mimikyu', ability: 'disguise', item: 'laggingtail', moves: ['shadowclaw', 'waterfall', 'sleeptalk'], teraType: 'Water'},
		], [
			{species: 'Alomomola', ability: 'battlearmor', moves: ['soak'], teraType: 'Normal'},
		]]);
		// Mimikyu is made water type before terastallizing
		battle.makeChoices('move sleeptalk', 'auto');
		assert.equal(battle.p1.active[0].getTypes().join(), 'Water');
		assert.equal(battle.p1.active[0].getTypes(false, true).join('/'), 'Water');
		battle.makeChoices('move waterfall terastallize', 'auto');
		let damage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		// 0 Atk Adaptability Mimikyu Waterfall vs. 0 HP / 0 Def Alomomola: 64-76
		assert.bounded(damage, [64, 76],
			"Terastallizing into the same changed type did not boost STAB; actual damage: " + damage);

		const p2HP = battle.p2.active[0].hp;
		battle.makeChoices();
		damage = p2HP - battle.p2.active[0].hp;
		// 0 Atk (base Water) Mimikyu Shadow Claw vs. 0 HP / 0 Def Alomomola: 56-66
		assert.bounded(damage, [56, 66],
			"Terastallizing did not keep old changed type's STAB; actual damage: " + damage);
	});

	it('should give STAB correctly to the user\'s underlying types after changing forme', function () {
		battle = common.gen(9).createBattle([[
			{species: 'Mimikyu', ability: 'disguise', item: 'laggingtail', moves: ['shadowclaw', 'waterfall', 'sleeptalk'], teraType: 'Water'},
		], [
			{species: 'Alomomola', ability: 'battlearmor', moves: ['watergun', 'soak'], teraType: 'Normal'},
		]]);
		// Mimikyu is made water type before terastallizing
		battle.makeChoices('move sleeptalk', 'move soak');
		// Mimikyu's disguise is broken before it attacks
		battle.makeChoices('move waterfall terastallize', 'auto');
		assert.equal(battle.p1.active[0].getTypes().join(), 'Water');
		assert.equal(battle.p1.active[0].getTypes(false, true).join('/'), 'Ghost/Fairy');
		let damage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		// 0 Atk Water Terastal Mimikyu-Busted Waterfall vs. 0 HP / 0 Def Alomomola: 48-57
		assert.bounded(damage, [48, 57],
			"Changing underlying type via forme change while terastallized did not change STAB; actual damage: " + damage);

		const p2HP = battle.p2.active[0].hp;
		battle.makeChoices();
		damage = p2HP - battle.p2.active[0].hp;
		// 0 Atk Water Terastal Mimikyu-Busted Shadow Claw vs. 0 HP / 0 Def Alomomola: 84-99
		assert.bounded(damage, [84, 99],
			"Terastallizing did not keep old changed type's STAB; actual damage: " + damage);
	});

	describe('Buffing low BP move behavior', function () {
		it(`should boost the base power of weaker moves with the same Tera Type to 60 BP`, function () {
			battle = common.gen(9).createBattle([[
				{species: 'magnemite', moves: ['nuzzle']},
			], [
				{species: 'mew', ability: 'shellarmor', moves: ['sleeptalk']},
			]]);

			battle.makeChoices('move nuzzle terastallize', 'auto');
			const mew = battle.p2.active[0];
			const damageRange = [40, 48];
			assert.bounded(mew.maxhp - mew.hp, damageRange, `Should be a 60 BP Nuzzle`);
		});

		it(`should only boost base power 60 BP after all other base power modifiers are applied`, function () {
			battle = common.gen(9).createBattle([[
				{species: 'cufant', ability: 'technician', moves: ['bulletpunch']},
			], [
				{species: 'mew', ability: 'shellarmor', moves: ['sleeptalk']},
			]]);

			battle.makeChoices('move bulletpunch terastallize', 'auto');
			const mew = battle.p2.active[0];
			const damageRange = [72, 86];
			assert.bounded(mew.maxhp - mew.hp, damageRange, `Should be a 60 BP Bullet Punch`);
		});

		it(`should not boost the base power of moves with variable base power under 60 BP`, function () {
			battle = common.gen(9).createBattle([[
				{species: 'wiglett', ivs: {hp: 0}, moves: ['waterspout']},
			], [
				{species: 'mew', ability: 'shellarmor', moves: ['seismictoss']},
			]]);

			battle.makeChoices('move waterspout terastallize', 'auto');
			const mew = battle.p2.active[0];
			const damageRange = [22, 28];
			assert.bounded(mew.maxhp - mew.hp, damageRange, `Should be a 34 BP Water Spout`);
		});

		it(`should boost STAB moves that weren't STAB moves prior to terastallizing`, function () {
			battle = common.gen(9).createBattle([[
				{species: 'espathra', evs: {atk: 252}, moves: ['peck', 'aerialace'], teraType: 'Flying'},
			], [
				{species: 'arceus', ability: 'shellarmor', moves: ['haze']},
			]]);

			battle.makeChoices('move peck', 'auto');
			const arceus = battle.p2.active[0];
			assert.bounded(arceus.maxhp - arceus.hp, [21, 25], `Should be a 35 BP no-STAB Peck`);
			arceus.hp = arceus.maxhp;
			battle.makeChoices('move peck terastallize', 'auto');
			assert.bounded(arceus.maxhp - arceus.hp, [51, 61], `Should be a 60 BP STAB Peck`);
		});

		it(`shouldn't boost non-STAB moves with <60 Base Power`, function () {
			battle = common.gen(9).createBattle([[
				{species: 'palafinhero', moves: ['leafage'], teraType: 'Electric'},
			], [
				{species: 'arceus', ability: 'shellarmor', moves: ['haze']},
			]]);

			battle.makeChoices('move leafage', 'auto');
			const arceus = battle.p2.active[0];
			assert.bounded(arceus.maxhp - arceus.hp, [38, 45], `Should be a 40 BP no-STAB Leafage`);
			arceus.hp = arceus.maxhp;
			battle.makeChoices('move leafage terastallize', 'auto');
			assert.bounded(arceus.maxhp - arceus.hp, [38, 45], `Should be a 40 BP no-STAB Leafage`);
		});

		it(`shouldn't boost <60 Base Power priority moves forced via Encore`, function () {
			battle = common.gen(9).createBattle([[
				{species: 'hariyama', moves: ['bulletpunch', 'sleeptalk'], teraType: 'Steel'},
			], [
				{species: 'salazzle ', moves: ['encore', 'sleeptalk']},
			]]);

			battle.makeChoices('move bulletpunch terastallize', 'move sleeptalk');
			const salazzle = battle.p2.active[0];
			assert.bounded(salazzle.maxhp - salazzle.hp, [38, 45], `Should be a 40 BP STAB Bullet Punch`);
			salazzle.hp = salazzle.maxhp;
			battle.makeChoices('move sleeptalk', 'move encore');
			assert.bounded(salazzle.maxhp - salazzle.hp, [38, 45], `Should be a 40 BP STAB Bullet Punch`);
		});
	});

	it("should combine with Adaptability for an overall STAB of x2.25", () => {
		battle = common.gen(9).createBattle([[
			{species: "Dragalge", ability: 'adaptability', moves: ['venoshock'], teraType: "Poison"},
		], [
			{species: "Mareep", ability: 'static', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move venoshock terastallize', 'auto');
		const damage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		assert.bounded(damage, [191, 227], "Actual damage: " + damage);
	});

	it("should not give the Adaptability boost on the user's old types", () => {
		battle = common.gen(9).createBattle([[
			{species: "Dragalge", ability: 'adaptability', moves: ['venoshock'], teraType: "Dragon"},
		], [
			{species: "Mareep", ability: 'static', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move venoshock terastallize', 'auto');
		const damage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		assert.bounded(damage, [127, 151], "Actual damage: " + damage);
	});

	it(`should allow hacked Megas to Terastallize in Hackmons play`, function () {
		battle = common.gen(9).createBattle({formatid: 'gen9purehackmons@@@!teampreview'}, [[
			{species: 'Mewtwo-Mega-X', moves: ['sleeptalk'], teraType: 'Fairy'},
		], [
			{species: 'Necrozma-Ultra', moves: ['sleeptalk'], teraType: 'Normal'},
		]]);

		const mewtwo = battle.p1.active[0];
		const necrozma = battle.p2.active[0];
		assert(mewtwo.hasType('Fighting'), 'Mega Mewtwo X should have Fighting-type before Terastallization');
		assert(necrozma.hasType('Dragon'), 'Ultra Necrozma should have Dragon-type before Terastallization');
		battle.makeChoices('move sleeptalk terastallize', 'move sleeptalk terastallize');
		assert(mewtwo.hasType('Fairy'), 'Mega Mewtwo X should be Fairy-type after Terastallization');
		assert(necrozma.hasType('Normal'), 'Ultra Necrozma should be Normal-type after Terastallization');
	});
});
