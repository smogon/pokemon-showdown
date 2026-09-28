'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Custap Berry', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should cause the user to move first when it activates', () => {
		battle = common.createBattle([[
			{ species: 'gyarados', moves: ['falseswipe', 'tackle'] },
		], [
			{ species: 'wynaut', level: 1, item: 'custapberry', moves: ['sleeptalk', 'growl'] },
		]]);
		battle.makeChoices();
		battle.makeChoices('move tackle', 'move growl');
		assert.equal(battle.p1.active[0].boosts.atk, -1);
		assert.fainted(battle.p2.active[0]);
	});

	it('should activate even if the opponent switches out', () => {
		battle = common.createBattle([[
			{ species: 'gyarados', moves: ['falseswipe'] },
			{ species: 'darkrai', moves: ['tackle'] },
		], [
			{ species: 'wynaut', level: 1, item: 'custapberry', moves: ['sleeptalk', 'growl'] },
		]]);
		battle.makeChoices();
		battle.makeChoices('switch 2', 'move growl');
		assert.equal(battle.p2.active[0].item, '');
		battle.makeChoices('move tackle', 'move growl');
		assert.equal(battle.p1.active[0].boosts.atk, -1);
		assert.fainted(battle.p2.active[0]);
	});

	describe('[Gen 4]', () => {
		it('should not activate if the opponent switches out', () => {
			battle = common.gen(4).createBattle([[
				{ species: 'gyarados', moves: ['falseswipe'] },
				{ species: 'darkrai', moves: ['tackle'] },
			], [
				{ species: 'wynaut', level: 1, item: 'custapberry', moves: ['sleeptalk', 'growl'] },
			]]);
			battle.makeChoices();
			battle.makeChoices('switch 2', 'move growl');
			assert.equal(battle.p2.active[0].item, 'custapberry');
			battle.makeChoices('move tackle', 'move growl');
			assert.equal(battle.p2.active[0].item, '');
			assert.equal(battle.p1.active[0].boosts.atk, -2);
			assert.fainted(battle.p2.active[0]);
		});

		for (const trickRoom of [false, true]) {
			it(`should let the faster of two activated holders move first${trickRoom ? ' under Trick Room' : ''}`, () => {
				battle = common.gen(4).createBattle([[
					{ species: 'Deoxys-Attack', ability: 'hugepower', item: 'custapberry', moves: ['falseswipe', 'tackle', 'trickroom'] },
				], [
					{ species: 'Deoxys-Attack', ability: 'hugepower', item: 'custapberry', moves: ['falseswipe', 'growl', 'splash'], evs: { spe: 252 } },
				]]);
				const slower = battle.p1.active[0];
				const faster = battle.p2.active[0];
				if (trickRoom) battle.makeChoices('move trickroom', 'move splash');
				battle.makeChoices();
				battle.makeChoices('move tackle', 'move growl');
				assert.statStage(slower, 'atk', -1);
				assert.fainted(faster);
				assert.equal(slower.item, '');
				assert.equal(faster.item, '');
			});
		}

		it('should block Embargo if it is going to activate', () => {
			battle = common.gen(4).createBattle([[
				{ species: 'Deoxys-Attack', ability: 'hugepower', item: 'custapberry', moves: ['falseswipe', 'tackle'] },
			], [
				{ species: 'Deoxys-Attack', ability: 'hugepower', item: 'custapberry', moves: ['falseswipe', 'embargo'], evs: { spe: 252 } },
			]]);
			const slower = battle.p1.active[0];
			const faster = battle.p2.active[0];
			battle.makeChoices();
			assert.equal(slower.hp, 1);
			assert.equal(faster.hp, 1);

			battle.makeChoices('move tackle', 'move embargo');
			assert.false(slower.volatiles['embargo']);
			assert.equal(slower.item, '');
			assert.equal(faster.item, '');
		});

		it('should not be consumed when Pursuit activates', () => {
			battle = common.gen(4).createBattle({ gameType: 'doubles' }, [[
				{ species: 'Wynaut', level: 1, item: 'custapberry', moves: ['splash', 'pursuit'] },
				{ species: 'Mew', moves: ['splash', 'calmmind'] },
			], [
				{ species: 'Gyarados', moves: ['falseswipe', 'splash'] },
				{ species: 'Snorlax', moves: ['splash', 'calmmind'] },
				{ species: 'Blissey', moves: ['splash'] },
			]]);
			const pursuitUser = battle.p1.active[0];
			const gyarados = battle.p2.active[0];
			battle.makeChoices('move splash, move splash', 'move falseswipe 1, move splash');
			assert.equal(pursuitUser.hp, 1);
			assert.equal(pursuitUser.item, 'custapberry');

			// Other Pokemon still have moves queued, so Custap qualifies for activation
			battle.makeChoices('move pursuit 1, move calmmind', 'switch 3, move calmmind');
			assert.false.fullHP(gyarados);
			assert.species(battle.p2.active[0], 'Blissey');
			assert.fullHP(battle.p2.active[0]);
			assert.equal(pursuitUser.item, 'custapberry');

			battle.makeChoices('move pursuit 1, move splash', 'move splash, move splash');
			assert.false.fullHP(battle.p2.active[0]);
			assert.equal(pursuitUser.item, '');
		});

		it('should consume a flagged berry without priority after gaining Klutz following an activated Pursuit', () => {
			battle = common.gen(4).createBattle({ gameType: 'doubles' }, [[
				{ species: 'Snorlax', level: 1, item: 'custapberry', moves: ['splash', 'pursuit', 'tackle'] },
				{ species: 'Mew', ability: 'klutz', moves: ['falseswipe', 'skillswap', 'splash'] },
			], [
				{ species: 'Deoxys-Attack', level: 2, moves: ['splash', 'growl'] },
				{ species: 'Gyarados', moves: ['falseswipe', 'splash'] },
				{ species: 'Blissey', moves: ['splash'] },
			]]);
			const holder = battle.p1.active[0];
			const faster = battle.p2.active[0];
			const gyarados = battle.p2.active[1];
			battle.makeChoices('move splash, move falseswipe 1', 'move splash, move falseswipe 1');
			assert.equal(holder.hp, 1);
			assert.equal(faster.hp, 1);

			// Pursuit leaves the flag active, then the holder's ally passes it Klutz
			battle.makeChoices('move pursuit 2, move skillswap -1', 'move splash, switch 3');
			assert.false.fullHP(gyarados);
			assert.equal(holder.ability, 'klutz');
			assert.equal(holder.item, 'custapberry');
			assert.equal(holder.custapBerryFlag, true);

			// Growl must happen before Tackle KOs its user: the berry no longer grants priority.
			battle.makeChoices('move tackle 1, move splash', 'move growl, move splash');
			assert.statStage(holder, 'atk', -1);
			assert.fainted(faster);
			assert.equal(holder.item, '');
			assert.equal(holder.custapBerryFlag, false);
		});

		it('should be blocked by Klutz if the holder has it from the start of the turn', () => {
			battle = common.gen(4).createBattle([[
				{ species: 'Deoxys-Attack', ability: 'hugepower', item: 'custapberry', moves: ['falseswipe', 'tackle'] },
			], [
				{ species: 'Deoxys-Attack', ability: 'klutz', item: 'custapberry', moves: ['falseswipe', 'skillswap'], evs: { spe: 252 } },
			]]);
			const slower = battle.p1.active[0];
			const faster = battle.p2.active[0];
			battle.makeChoices('move falseswipe', 'move skillswap');
			assert.equal(slower.ability, 'klutz');
			slower.hp = 1;
			faster.hp = 1;

			battle.makeChoices('move tackle', 'move falseswipe');
			assert.equal(slower.item, 'custapberry');
			assert.equal(faster.item, '');
		});
	});
});
