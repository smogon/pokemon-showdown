'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Heal Block', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should prevent Pokemon from gaining HP from residual recovery items', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Hippowdon', ability: 'sandstream', moves: ['healblock'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Spiritomb', ability: 'pressure', item: 'leftovers', moves: ['calmmind'] }] });
		battle.makeChoices('move healblock', 'move calmmind');
		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should prevent Pokemon from consuming HP recovery items', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Sableye', ability: 'prankster', moves: ['healblock'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Pansage', ability: 'gluttony', item: 'berryjuice', moves: ['bellydrum'] }] });
		battle.makeChoices('move healblock', 'move bellydrum');
		assert.equal(battle.p2.active[0].item, 'berryjuice');
		assert.equal(battle.p2.active[0].hp, Math.ceil(battle.p2.active[0].maxhp / 2));
	});

	it('should disable the use of healing moves', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Spiritomb', ability: 'pressure', moves: ['healblock'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Cresselia', ability: 'levitate', moves: ['recover'] }] });
		battle.makeChoices('move healblock', 'move recover');
		assert.cantMove(() => battle.makeChoices('move healblock', 'move recover'), 'Cresselia', 'Recover');
	});

	it('should prevent Pokemon from using draining moves', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Sableye', ability: 'prankster', moves: ['healblock'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Venusaur', ability: 'overgrow', moves: ['gigadrain'] }] });
		battle.makeChoices('move healblock', 'move gigadrain');
		assert.equal(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should prevent abilities from recovering HP', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Sableye', ability: 'prankster', moves: ['healblock', 'surf'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Quagsire', ability: 'waterabsorb', moves: ['bellydrum', 'calmmind'] }] });
		battle.makeChoices('move healblock', 'move bellydrum');
		const hp = battle.p2.active[0].hp;
		battle.makeChoices('move surf', 'move calmmind');
		assert.equal(battle.p2.active[0].hp, hp);
	});

	it('should prevent Leech Seed from healing HP', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Starmie', ability: 'noguard', moves: ['healblock'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Venusaur', ability: 'overgrow', moves: ['substitute', 'leechseed'] }] });
		battle.makeChoices('move healblock', 'move substitute');
		const hp = battle.p2.active[0].hp;
		battle.makeChoices('move healblock', 'move leechseed');
		assert.equal(battle.p2.active[0].hp, hp);
		assert.notEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should not prevent the target from using Z-Powered healing status moves or healing from Z Power', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Beheeyem', ability: 'telepathy', item: 'normaliumz', moves: ['psychic', 'healblock', 'recover'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Elgyem', ability: 'telepathy', item: 'psychiumz', moves: ['psychic', 'healblock', 'teleport'] }] });
		battle.makeChoices('move psychic', 'move psychic');
		battle.makeChoices('move healblock', 'move healblock');
		battle.makeChoices('move recover zmove', 'move teleport zmove');
		assert.fullHP(battle.p1.active[0]);
		assert.fullHP(battle.p2.active[0]);
	});
});

describe('Heal Block [Gen 5]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should prevent Pokemon from gaining HP from residual recovery items', () => {
		battle = common.gen(5).createBattle([
			[{ species: 'Hippowdon', ability: 'sandstream', moves: ['healblock'] }],
			[{ species: 'Spiritomb', ability: 'pressure', item: 'leftovers', moves: ['calmmind'] }],
		]);
		battle.makeChoices('move healblock', 'move calmmind');
		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should prevent Pokemon from consuming HP recovery items', () => {
		battle = common.gen(5).createBattle([
			[{ species: 'Sableye', ability: 'prankster', moves: ['healblock'] }],
			[{ species: 'Pansage', ability: 'gluttony', item: 'sitrusberry', moves: ['bellydrum'] }],
		]);
		battle.makeChoices('move healblock', 'move bellydrum');
		assert.equal(battle.p2.active[0].item, 'sitrusberry');
		assert.equal(battle.p2.active[0].hp, Math.ceil(battle.p2.active[0].maxhp / 2));
	});

	it('should disable the use of healing moves', () => {
		battle = common.gen(5).createBattle([
			[{ species: 'Spiritomb', ability: 'pressure', moves: ['healblock'] }],
			[{ species: 'Cresselia', ability: 'levitate', moves: ['recover'] }],
		]);
		battle.makeChoices('move healblock', 'move recover');
		assert.cantMove(() => battle.makeChoices('move healblock', 'move recover'), 'Cresselia', 'Recover');
	});

	it('should prevent abilities from recovering HP', () => {
		battle = common.gen(5).createBattle([
			[{ species: 'Sableye', ability: 'prankster', moves: ['healblock', 'surf'] }],
			[{ species: 'Quagsire', ability: 'waterabsorb', moves: ['bellydrum', 'calmmind'] }],
		]);
		battle.makeChoices('move healblock', 'move bellydrum');
		const hp = battle.p2.active[0].hp;
		battle.makeChoices('move surf', 'move calmmind');
		assert.equal(battle.p2.active[0].hp, hp);
	});

	it('should prevent draining moves from healing HP', () => {
		battle = common.gen(5).createBattle([
			[{ species: 'Sableye', ability: 'prankster', moves: ['healblock'] }],
			[{ species: 'Venusaur', ability: 'overgrow', moves: ['substitute', 'gigadrain'] }],
		]);
		battle.makeChoices('move healblock', 'move substitute');
		const hp = battle.p2.active[0].hp;
		battle.makeChoices('move healblock', 'move gigadrain');
		assert.equal(battle.p2.active[0].hp, hp);
		assert.notEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should prevent Leech Seed from healing HP', () => {
		battle = common.gen(5).createBattle([
			[{ species: 'Starmie', ability: 'noguard', moves: ['healblock'] }],
			[{ species: 'Venusaur', ability: 'overgrow', moves: ['substitute', 'leechseed'] }],
		]);
		const hp = battle.p2.active[0].hp;
		battle.makeChoices('move healblock', 'move leechseed');
		assert.equal(battle.p2.active[0].hp, hp);
		assert.notEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});
});

describe('Heal Block [Gen 4]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should disable the use of healing moves', () => {
		battle = common.gen(4).createBattle([
			[{ species: 'Spiritomb', ability: 'pressure', moves: ['healblock'] }],
			[{ species: 'Cresselia', ability: 'levitate', moves: ['recover'] }],
		]);
		battle.makeChoices('move healblock', 'move recover');
		assert.cantMove(() => battle.makeChoices('move healblock', 'move recover'), 'Cresselia', 'Recover');
	});

	it('should block the effect of Wish', () => {
		battle = common.gen(4).createBattle([
			[{ species: 'Spiritomb', ability: 'pressure', moves: ['healblock'] }],
			[{ species: 'Deoxys', ability: 'pressure', moves: ['wish'] }],
		]);
		battle.makeChoices('move healblock', 'move wish');
		assert.cantMove(() => battle.makeChoices('move healblock', 'move wish'), 'Deoxys', 'Wish');
	});

	it('should prevent draining moves from healing HP', () => {
		battle = common.gen(4).createBattle([
			[{ species: 'Sableye', ability: 'prankster', moves: ['healblock'] }],
			[{ species: 'Venusaur', ability: 'overgrow', moves: ['substitute', 'gigadrain'] }],
		]);
		battle.makeChoices('move healblock', 'move substitute');
		const hp = battle.p2.active[0].hp;
		battle.makeChoices('move healblock', 'move gigadrain');
		assert.equal(battle.p2.active[0].hp, hp);
		assert.notEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should allow HP recovery items to activate', () => {
		battle = common.gen(4).createBattle([
			[{ species: 'Spiritomb', ability: 'pressure', moves: ['healblock', 'shadowball'] }],
			[{ species: 'Abra', level: 1, ability: 'synchronize', item: 'leftovers', moves: ['celebrate', 'endure'] }, { species: 'Abra', level: 1, ability: 'synchronize', item: 'sitrusberry', moves: ['celebrate', 'endure'] }],
		]);
		battle.makeChoices('move healblock', 'move celebrate');
		battle.makeChoices('move shadowball', 'move endure');
		assert.notEqual(battle.p2.active[0].hp, 1);
		battle.makeChoices('move healblock', 'switch 2');
		battle.makeChoices('move shadowball', 'move endure');
		assert.equal(battle.p2.active[0].item, '');
		assert.notEqual(battle.p2.active[0].hp, 1);
	});

	it('should allow abilities that recover HP to activate', () => {
		battle = common.gen(4).createBattle([
			[{ species: 'Sableye', ability: 'keeneye', moves: ['healblock', 'surf'] }],
			[{ species: 'Quagsire', ability: 'waterabsorb', moves: ['bellydrum', 'calmmind'] }],
		]);
		battle.makeChoices('move healblock', 'move bellydrum');
		const hp = battle.p2.active[0].hp;
		battle.makeChoices('move surf', 'move calmmind');
		assert.notEqual(battle.p2.active[0].hp, hp);
	});

	it('should prevent Leech Seed from healing HP', () => {
		battle = common.gen(4).createBattle([
			[{ species: 'Starmie', ability: 'noguard', moves: ['healblock'] }],
			[{ species: 'Venusaur', ability: 'overgrow', moves: ['substitute', 'leechseed'] }],
		]);
		battle.makeChoices('move healblock', 'move substitute');
		const hp = battle.p2.active[0].hp;
		battle.makeChoices('move healblock', 'move leechseed');
		assert.equal(battle.p2.active[0].hp, hp);
		assert.notEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should fail independently on each target', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'porygon2', moves: ['sleeptalk'] },
			{ species: 'marshadow', moves: ['sleeptalk'] },
			{ species: 'mew', moves: ['sleeptalk'] },
		], [
			{ species: 'zapdos', moves: ['sleeptalk'] },
			{ species: 'skitty', moves: ['healblock'] },
		]]);

		battle.makeChoices('move sleeptalk, move sleeptalk', 'move sleeptalk, move healblock');
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move sleeptalk, move healblock');
		assert.equal(battle.p2.active[1].moveLastTurnResult, false, 'should fail when fails on all targets');
		assert.equal(battle.log[battle.lastMoveLine + 1].startsWith('|-fail'), true);
		assert.equal(battle.log[battle.lastMoveLine + 2].startsWith('|-fail'), true);
		assert.notEqual(battle.log[battle.lastMoveLine + 3].startsWith('|-fail'), true);
		battle.makeChoices('move sleeptalk, switch 3', 'move sleeptalk, move healblock');
		assert.equal(battle.p2.active[1].moveLastTurnResult, true, 'should succeed if succeeds on at least one target');
	});
});
