'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Burn', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should inflict 1/16 of max HP at the end of the turn, rounded down', function () {
		battle = common.createBattle([
			[{species: 'Machamp', ability: 'noguard', moves: ['bulkup']}],
			[{species: 'Sableye', ability: 'prankster', moves: ['willowisp']}],
		]);
		const target = battle.p1.active[0];
		assert.hurtsBy(target, Math.floor(target.maxhp / 16), () => battle.makeChoices('move bulkup', 'move willowisp'));
	});

	it(`should halve damage from most Physical attacks`, function () {
		battle = common.createBattle([[
			{species: 'Machamp', ability: 'noguard', moves: ['boneclub']},
		], [
			{species: 'Sableye', ability: 'prankster', moves: ['willowisp']},
		]]);
		battle.makeChoices();
		const sableye = battle.p2.active[0];
		const damage = sableye.maxhp - sableye.hp;
		assert.bounded(damage, [37, 44]);
	});

	it('should reduce atk to 50% of its original value in Stadium', function () {
		// I know WoW doesn't exist in Stadium, but the engine supports future gen moves
		// and this is easier than digging for a seed that makes Flamethrower burn
		battle = common.createBattle({formatid: 'gen1stadiumou@@@!teampreview'}, [
			[{species: 'Vaporeon', moves: ['growl']}],
			[{species: 'Jolteon', moves: ['willowisp']}],
		]);
		const attack = battle.p1.active[0].getStat('atk');
		battle.makeChoices('move growl', 'move willowisp');
		assert.equal(battle.p1.active[0].getStat('atk'), Math.floor(attack * 0.5));
	});

	it('should not halve damage from moves with set damage', function () {
		battle = common.createBattle([
			[{species: 'Machamp', ability: 'noguard', moves: ['seismictoss']}],
			[{species: 'Talonflame', ability: 'galewings', moves: ['willowisp']}],
		]);
		assert.hurtsBy(battle.p2.active[0], 100, () => battle.makeChoices('move seismictoss', 'move willowisp'));
	});
});

describe('Paralysis', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should reduce speed to 50% of its original value`, function () {
		battle = common.createBattle([[
			{species: 'Vaporeon', moves: ['sleeptalk']},
		], [
			{species: 'Jolteon', moves: ['glare']},
		]]);

		const vaporeon = battle.p1.active[0];
		const speed = vaporeon.getStat('spe');
		battle.makeChoices('move sleeptalk', 'move glare');
		assert.equal(vaporeon.getStat('spe'), battle.modify(speed, 0.5));
	});

	it(`should apply its Speed reduction after all other Speed modifiers`, function () {
		battle = common.createBattle([[
			{species: 'goldeen', item: 'choicescarf', evs: {spe: 252}, moves: ['sleeptalk']}, // 225 Speed
		], [
			{species: 'wynaut', moves: ['glare']},
		]]);

		battle.makeChoices();
		assert.equal(battle.p1.active[0].getStat('spe'), 168); // would be 169 if both Choice Scarf and paralysis were chained
	});

	it('should reduce speed to 25% of its original value in Gen 6', function () {
		battle = common.gen(6).createBattle();
		battle.setPlayer('p1', {team: [{species: 'Vaporeon', ability: 'waterabsorb', moves: ['aquaring']}]});
		battle.setPlayer('p2', {team: [{species: 'Jolteon', ability: 'voltabsorb', moves: ['thunderwave']}]});
		const speed = battle.p1.active[0].getStat('spe');
		battle.makeChoices('move aquaring', 'move thunderwave');
		assert.equal(battle.p1.active[0].getStat('spe'), battle.modify(speed, 0.25));
	});

	it('should reduce speed to 25% of its original value in Gen 2', function () {
		battle = common.gen(2).createBattle();
		battle.setPlayer('p1', {team: [{species: 'Vaporeon', ability: 'waterabsorb', moves: ['aquaring']}]});
		battle.setPlayer('p2', {team: [{species: 'Jolteon', ability: 'voltabsorb', moves: ['thunderwave']}]});
		const speed = battle.p1.active[0].getStat('spe');
		battle.makeChoices('move aquaring', 'move thunderwave');
		assert.equal(battle.p1.active[0].getStat('spe'), battle.modify(speed, 0.25));
	});

	it('should reduce speed to 25% of its original value in Stadium', function () {
		battle = common.createBattle({formatid: 'gen1stadiumou@@@!teampreview'}, [
			[{species: 'Vaporeon', moves: ['growl']}],
			[{species: 'Jolteon', moves: ['thunderwave']}],
		]);
		const speed = battle.p1.active[0].getStat('spe');
		battle.makeChoices('move growl', 'move thunderwave');
		assert.equal(battle.p1.active[0].getStat('spe'), Math.floor(speed * 0.25));
	});

	it('should reapply its speed drop when an opponent uses a stat-altering move in Gen 1', function () {
		battle = common.gen(1).createBattle([
			[{species: 'Electrode', moves: ['rest']}],
			[{species: 'Slowpoke', moves: ['amnesia', 'thunderwave']}],
		]);
		battle.makeChoices('move rest', 'move thunderwave');
		const speed = battle.p1.active[0].getStat('spe');
		battle.makeChoices('move rest', 'move amnesia');
		assert.equal(battle.p1.active[0].getStat('spe'), battle.modify(speed, 0.25));
	});

	it('should not reapply its speed drop when an opponent uses a failed stat-altering move in Gen 1', function () {
		battle = common.gen(1).createBattle([
			[{species: 'Electrode', moves: ['rest']}],
			[{species: 'Slowpoke', moves: ['amnesia', 'thunderwave']}],
		]);
		battle.makeChoices('move rest', 'move amnesia');
		battle.makeChoices('move rest', 'move amnesia');
		battle.makeChoices('move rest', 'move amnesia');
		battle.makeChoices('move rest', 'move thunderwave');
		const speed = battle.p1.active[0].getStat('spe');
		battle.makeChoices('move rest', 'move amnesia');
		assert.equal(battle.p1.active[0].getStat('spe'), speed);
	});
});

describe('Toxic Poison', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should inflict 1/16 of max HP rounded down, times the number of active turns with the status, at the end of the turn', function () {
		battle = common.createBattle([
			[{species: 'Chansey', ability: 'naturalcure', moves: ['softboiled']}],
			[{species: 'Gengar', ability: 'levitate', moves: ['toxic']}],
		]);
		const target = battle.p1.active[0];
		for (let i = 1; i <= 8; i++) {
			battle.makeChoices('move softboiled', 'move toxic');
			assert.equal(target.maxhp - target.hp, Math.floor(target.maxhp / 16) * i);
		}
	});

	it('should reset the damage counter when the Pokemon switches out', function () {
		battle = common.createBattle([
			[{species: 'Chansey', ability: 'serenegrace', moves: ['counter']}, {species: 'Snorlax', ability: 'immunity', moves: ['curse']}],
			[{species: 'Crobat', ability: 'infiltrator', moves: ['toxic', 'whirlwind']}],
		]);
		for (let i = 0; i < 4; i++) {
			battle.makeChoices('move counter', 'move toxic');
		}
		const pokemon = battle.p1.active[0];
		pokemon.hp = pokemon.maxhp;
		battle.makeChoices('switch 2', 'move whirlwind');
		assert.equal(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 16));
	});
});

describe('Freeze', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should cause an afflicted Shaymin-Sky to revert to its base forme', function () {
		battle = common.createBattle([
			[{species: 'Chansey', ability: 'serenegrace', moves: ['icebeam']}],
			[{species: 'Shaymin-Sky', ability: 'sturdy', moves: ['sleeptalk']}],
		]);
		// I didn't feel like manually testing seed after seed. Sue me.
		battle.onEvent('ModifyMove', battle.format, function (move) {
			if (move.secondaries) {
				this.debug('Freeze test: Guaranteeing secondary');
				for (const secondary of move.secondaries) {
					secondary.chance = 100;
				}
			}
		});
		battle.makeChoices('move icebeam', 'move sleeptalk');
		assert.equal(battle.p2.active[0].status, 'frz');
		assert.equal(battle.p2.active[0].species.name, 'Shaymin');
	});

	it('should not cause an afflicted Pokemon transformed into Shaymin-Sky to change to Shaymin', function () {
		battle = common.createBattle([
			[{species: 'Ditto', ability: 'imposter', moves: ['transform']}],
			[{species: 'Shaymin-Sky', ability: 'sturdy', moves: ['icebeam', 'sleeptalk']}],
		]);
		battle.onEvent('ModifyMove', battle.format, function (move) {
			if (move.secondaries) {
				this.debug('Freeze test: Guaranteeing secondary');
				for (const secondary of move.secondaries) {
					secondary.chance = 100;
				}
			}
		});
		battle.makeChoices('move sleeptalk', 'move icebeam');
		assert.equal(battle.p1.active[0].status, 'frz');
		assert.equal(battle.p1.active[0].species.name, 'Shaymin-Sky');
	});

	it(`should not be possible to burn a frozen target when using a move that thaws that target`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'serenegrace', item: 'widelens', moves: ['sleeptalk', 'sacredfire']},
		], [
			{species: 'shuckle', moves: ['meteorassault']},
		]]);
		battle.makeChoices(); // Use Meteor Assault to force recharge next turn and skip potential thaw
		const frozenMon = battle.p2.active[0];
		frozenMon.setStatus('frz');
		battle.makeChoices('move sacredfire', 'auto');
		assert.equal(frozenMon.status, '');
	});
});

describe('Burn [Gen 6]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should inflict 1/8 of max HP at the end of the turn, rounded down', function () {
		battle = common.gen(6).createBattle([
			[{species: 'Machamp', ability: 'noguard', moves: ['bulkup']}],
			[{species: 'Sableye', ability: 'prankster', moves: ['willowisp']}],
		]);
		const target = battle.p1.active[0];
		assert.hurtsBy(target, Math.floor(target.maxhp / 8), () => battle.makeChoices('move bulkup', 'move willowisp'));
	});
});

describe('Toxic Poison [Gen 1]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should affect Leech Seed damage counter`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'Venusaur', moves: ['toxic', 'leechseed']},
		], [
			{species: 'Chansey', moves: ['splash']},
		]]);

		// Modding accuracy so the status moves always hit
		battle.onEvent('Accuracy', battle.format, true);

		battle.makeChoices('move toxic', 'move splash');
		const chansey = battle.p2.active[0];
		assert.equal(chansey.maxhp - chansey.hp, Math.floor(chansey.maxhp / 16));
		battle.makeChoices('move leechseed', 'move splash');
		// (1/16) + (2/16) + (3/16) = (6/16)
		assert.equal(chansey.maxhp - chansey.hp, Math.floor(chansey.maxhp / 16) * 6);
	});
});


describe('Toxic Poison [Gen 2]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should not affect Leech Seed damage counter`, function () {
		battle = common.gen(2).createBattle({forceRandomChance: true}, [[
			{species: 'Venusaur', moves: ['toxic', 'leechseed']},
		], [
			{species: 'Chansey', moves: ['splash']},
		]]);
		battle.makeChoices('move toxic', 'move splash');
		const pokemon = battle.p2.active[0];
		assert.equal(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 16));
		battle.makeChoices('move leechseed', 'move splash');
		// (1/16) + (2/16) + (1/8) = (5/16)
		assert.equal(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 16) * 5);
	});

	it(`should pass the damage counter to Pokemon with Baton Pass`, function () {
		battle = common.gen(2).createBattle([[
			{species: 'Smeargle', moves: ['toxic', 'willowisp', 'splash']},
		], [
			{species: 'Chansey', moves: ['splash']},
			{species: 'Celebi', moves: ['batonpass', 'splash']},
		]]);

		// Modding accuracy so the status moves always hit
		battle.onEvent('Accuracy', battle.format, true);

		battle.makeChoices('move willowisp', 'move splash');
		const chansey = battle.p2.active[0];
		battle.makeChoices('move toxic', 'switch 2');
		battle.makeChoices('move splash', 'move splash');
		battle.makeChoices('move splash', 'move splash');
		battle.makeChoices('move splash', 'move batonpass');
		battle.makeChoices('', 'switch 2');
		let hp = chansey.hp;
		battle.makeChoices('move splash', 'move splash');
		assert.equal(hp - chansey.hp, Math.floor(chansey.maxhp / 16) * 4, `Chansey should have taken a lot more damage from burn`);

		// Only hint about this once per battle, not every turn.
		assert.equal(battle.log.filter(m => m.startsWith('|-hint')).length, 1);

		// Damage counter should be removed on regular switch out
		battle.makeChoices('move splash', 'switch 2');
		hp = chansey.hp;
		battle.makeChoices('move splash', 'switch 2');
		assert.equal(hp - chansey.hp, Math.floor(chansey.maxhp / 8), `Chansey should have taken normal damage from burn`);
	});

	it('should revert to regular poison on switch in, even for Poison types', function () {
		battle = common.gen(2).createBattle([
			[{species: 'Smeargle', moves: ['toxic', 'splash']}],
			[
				{species: 'Qwilfish', moves: ['transform', 'splash']},
				{species: 'Gengar', moves: ['nightshade']},
			],
		]);
		battle.makeChoices('move toxic', 'move transform');
		battle.makeChoices('move splash', 'switch 2');
		battle.makeChoices('move splash', 'switch 2');
		// We could check 'psn' at this point, but the following line caused crashes
		// before #5463 was fixed so its useful to execute for regression testing purposes.
		battle.makeChoices('move splash', 'move splash');
		assert.equal(battle.p2.active[0].status, 'psn');
	});

	it('should not have its damage counter affected by Heal Bell', function () {
		battle = common.gen(2).createBattle([[
			{species: 'Smeargle', moves: ['toxic', 'willowisp', 'splash']},
		], [
			{species: 'Chansey', moves: ['splash', 'healbell']},
		]]);

		// Modding accuracy so the status moves always hit
		battle.onEvent('Accuracy', battle.format, true);

		battle.makeChoices('move toxic', 'move splash');
		const chansey = battle.p2.active[0];
		battle.makeChoices('move splash', 'move healbell');
		battle.makeChoices('move willowisp', 'move splash');
		let hp = chansey.hp;
		battle.makeChoices('move splash', 'move splash');
		assert.equal(hp - chansey.hp, Math.floor(chansey.maxhp / 16) * 3);
		hp = chansey.hp;

		battle.makeChoices('move splash', 'move healbell');
		battle.makeChoices('move toxic', 'move splash');
		// Toxic counter should be reset by a successful Toxic
		assert.equal(hp - chansey.hp, Math.floor(chansey.maxhp / 16));
	});
});
