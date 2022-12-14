'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Fury Cutter', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should double in power with each successful hit', function () {
		battle = common.createBattle([[
			{species: 'kangaskhan', moves: ['luckychant']},
		], [
			{species: 'wynaut', ability: "compoundeyes", moves: ['furycutter']},
		]]);

		battle.makeChoices();
		const kang = battle.p1.active[0];
		let damage = kang.maxhp - kang.hp;
		assert.bounded(damage, [13, 16]); // 40 BP
		let hpBeforeHit = kang.hp;
		battle.makeChoices();
		damage = hpBeforeHit - kang.hp;
		assert.bounded(damage, [25, 30]); // 80 BP
		hpBeforeHit = kang.hp;
		battle.makeChoices();
		damage = hpBeforeHit - kang.hp;
		assert.bounded(damage, [49, 58]); // 160 BP
	});

	it('should double in power with each successful hit (Gen 3)', function () {
		battle = common.gen(3).createBattle([[
			{species: 'kangaskhan', moves: ['luckychant']},
		], [
			{species: 'wynaut', ability: "compoundeyes", moves: ['furycutter']},
		]]);

		battle.makeChoices();
		const kang = battle.p1.active[0];
		let damage = kang.maxhp - kang.hp;
		assert.bounded(damage, [4, 5]); // 10 BP
		let hpBeforeHit = kang.hp;
		battle.makeChoices();
		damage = hpBeforeHit - kang.hp;
		assert.bounded(damage, [7, 9]); // 20 BP
		hpBeforeHit = kang.hp;
		battle.makeChoices();
		damage = hpBeforeHit - kang.hp;
		assert.bounded(damage, [13, 16]); // 40 BP
	});
});
