'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

describe('Tera Shell', function () {
	afterEach(() => battle.destroy());

	it(`should take not very effective damage when it is at full health`, function () {
		battle = common.createBattle([
			[{species: 'Terapagos-Terastal', ability: 'terashell', moves: ['sleeptalk']}],
			[{species: 'Wynaut', moves: ['wickedblow']}],
		]);

		battle.makeChoices();
		const terapagos = battle.p1.active[0];
		const damage = terapagos.maxhp - terapagos.hp;
		assert.bounded(damage, [14, 16], `Tera Shell should yield not very effective damage roll, actual damage taken is ${damage}`);

		battle.makeChoices();
		assert.bounded(terapagos.maxhp - terapagos.hp - damage, [28, 33], `Tera Shell should not reduce damage, because Terapagos-Terastal was not at full HP`);
	});

	// confirmed here: https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9893603
	it(`should not take precedence over immunities`, function () {
		battle = common.createBattle([
			[{species: 'Terapagos-Terastal', ability: 'terashell', moves: ['sleeptalk']}],
			[{species: 'Wynaut', moves: ['shadowball']}],
		]);

		battle.makeChoices();
		const terapagos = battle.p1.active[0];
		assert.fullHP(terapagos);
	});

	// confirmed here: https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-10398768
	it(`should not activate if Terapagos already resists the move`, function () {
		battle = common.createBattle([[
			{species: 'Terapagos', ability: 'terashift', moves: ['sleeptalk']},
		], [
			{species: 'Urshifu-Rapid-Strike', moves: ['surgingstrikes', 'soak', 'forestscurse']},
		]]);
		const terapagos = battle.p1.active[0];
		battle.makeChoices('auto', 'move soak');
		battle.makeChoices();
		assert.bounded(terapagos.maxhp - terapagos.hp, [72, 87]);

		terapagos.hp = terapagos.maxhp;
		battle.makeChoices('auto', 'move forestscurse');
		battle.makeChoices();
		assert.bounded(terapagos.maxhp - terapagos.hp, [36, 42]);

		assert(!battle.getDebugLog().includes('Tera Shell'), `Tera Shell should not have activated`);
	});

	// kinda confirmed here: https://youtu.be/-nerhfXrmCM?si=hLzfrfzVDdfNFMbv&t=314
	// confirmed here: https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9893781
	it('All hits of multi-hit move should be not very effective', function () {
		battle = common.createBattle([
			[{species: 'Terapagos-Terastal', ability: 'terashell', moves: ['sleeptalk']}],
			[{species: 'Wynaut', moves: ['surgingstrikes']}],
		]);

		battle.makeChoices();
		const terapagos = battle.p1.active[0];
		const damage = terapagos.maxhp - terapagos.hp;
		assert.bounded(damage, [15, 18], `Tera Shell should yield not very effective damage for both all hits of multi-hit move, actual damage taken is ${damage}`);
	});

	// confirmed here: https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9893651
	it(`should be suppressed by Gastro Acid`, function () {
		battle = common.createBattle([
			[{species: 'Terapagos-Terastal', ability: 'terashell', moves: ['sleeptalk']}],
			[{species: 'Wynaut', moves: ['gastroacid', 'wickedblow']}],
		]);

		battle.makeChoices('move sleeptalk', 'move gastroacid');
		battle.makeChoices('move sleeptalk', 'move wickedblow');
		const terapagos = battle.p1.active[0];
		const damage = terapagos.maxhp - terapagos.hp;
		assert.bounded(damage, [28, 33], `Tera Shell should not reduce damage, because Tera Shell should be suppressed`);
	});

	it(`should not work if the user's species is not currently Terapagos-Terastal`, function () {
		battle = common.createBattle([[
			{species: 'Terapagos', ability: 'terashift', moves: ['transform']},
		], [
			{species: 'Umbreon', ability: 'terashell', moves: ['flowertrick']},
		]]);

		battle.makeChoices();
		const terapagos = battle.p1.active[0];
		let damage = terapagos.maxhp - terapagos.hp;
		assert.bounded(damage, [51, 60], `Tera Shell should not have activated because current species is not Terapagos`);


		battle = common.createBattle([[
			{species: 'Espeon', moves: ['transform']},
		], [
			{species: 'Terapagos', ability: 'terashift', moves: ['flowertrick']},
		]]);

		battle.makeChoices();
		const espeon = battle.p1.active[0];
		damage = espeon.maxhp - espeon.hp;
		assert.bounded(damage, [33, 39], `Tera Shell should have activated because current species is Terapagos`);
	});

	it(`should not weaken the damage from Struggle`, function () {
		battle = common.createBattle([[
			{species: 'Terapagos', ability: 'terashift', moves: ['luckychant']},
		], [
			{species: 'Slowking', item: 'assaultvest', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();

		const terapagos = battle.p1.active[0];
		const damage = terapagos.maxhp - terapagos.hp;
		assert.bounded(damage, [27, 32], `Tera Shell should not have reduced the damage Struggle dealt`);
	});

	it(`should not continue to weaken attacks after taking damage from a Future attack`, function () {
		battle = common.createBattle([[
			{species: 'Terapagos', ability: 'terashift', moves: ['sleeptalk']},
			{species: 'Espeon', moves: ['sleeptalk']},
		], [
			{species: 'Slowking', moves: ['sleeptalk', 'wickedblow', 'futuresight']},
		]]);

		battle.makeChoices('auto', 'move futuresight');
		battle.makeChoices();
		battle.makeChoices();

		const terapagos = battle.p1.active[0];
		let damage = terapagos.maxhp - terapagos.hp;
		assert.bounded(damage, [59, 70], `Tera Shell should have reduced the damage Future Sight dealt`);

		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices('switch 2', 'move wickedblow');
		damage = terapagos.maxhp - terapagos.hp - damage;
		assert.bounded(damage, [59, 70], `Tera Shell should not have reduced the damage Wicked Blow dealt`);
	});

	it.skip(`should activate, but not weaken, moves with fixed damage`, function () {
		battle = common.createBattle([[
			{species: 'Terapagos', ability: 'terashift', evs: {hp: 252}, moves: ['recover', 'seismictoss']},
			{species: 'Magikarp', moves: ['sleeptalk']},
		], [
			{species: 'Slowpoke', ability: 'noguard', moves: ['seismictoss', 'superfang', 'counter']},
			{species: 'Shuckle', moves: ['finalgambit']},
			{species: 'Wynaut', ability: 'noguard', moves: ['sheercold']},
		]]);

		const terapagos = battle.p1.active[0];

		battle.makeChoices('auto', 'move seismictoss');
		let damage = terapagos.maxhp - terapagos.hp;
		assert.equal(damage, 100, `Tera Shell should not have reduced the damage Seismic Toss dealt`);
		assert(battle.log[battle.lastMoveLine + 1].endsWith('Tera Shell'), `Tera Shell should have activated on Seismic Toss`);

		battle.makeChoices('auto', 'move superfang');
		damage = terapagos.maxhp - terapagos.hp;
		assert.equal(damage, Math.floor(terapagos.maxhp / 2), `Tera Shell should not have reduced the damage Super Fang dealt`);
		assert(battle.log[battle.lastMoveLine + 1].endsWith('Tera Shell'), `Tera Shell should have activated on Super Fang`);

		battle.makeChoices('auto', 'move counter');
		battle.makeChoices('move seismictoss', 'move counter');
		damage = terapagos.maxhp - terapagos.hp;
		assert.equal(damage, 200, `Tera Shell should not have reduced the damage Counter dealt`);
		assert(battle.log[battle.lastMoveLine + 1].endsWith('Tera Shell'), `Tera Shell should have activated on Counter`);

		battle.makeChoices('auto', 'switch 2');
		const shuckle = battle.p2.active[0];
		battle.makeChoices('auto', 'move finalgambit');
		damage = terapagos.maxhp - terapagos.hp;
		assert.equal(damage, shuckle.maxhp, `Tera Shell should not have reduced the damage Final Gambit dealt`);
		assert(battle.log[battle.lastMoveLine + 1].endsWith('Tera Shell'), `Tera Shell should have activated on Final Gambit`);

		battle.choose('p2', 'switch 3');
		battle.makeChoices('auto', 'move sheercold');
		assert.fainted(terapagos);
		assert(battle.log[battle.lastMoveLine + 1].endsWith('Tera Shell'), `Tera Shell should have activated on Sheer Cold`);
	});
});
