'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Protective Pads', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should prevent ability-changing abilities triggered by contact from acting`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'sturdy', item: 'protectivepads', moves: ['bulletpunch']},
		], [
			{species: 'cofagrigus', ability: 'mummy', moves: ['sleeptalk']},
		]]);

		const wynaut = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(wynaut.ability, 'sturdy');
		const mummyActivationMessages = battle.log.filter(logStr => logStr.startsWith('|-activate|') && logStr.includes('Mummy'));
		assert.equal(mummyActivationMessages.length, 1, `Mummy should activate only once`);
		assert(mummyActivationMessages[0].includes('Cofagrigus'), `Source of Mummy activation should be included`);
		assert.false(mummyActivationMessages[0].includes('Sturdy'), `Attacker's ability should not be revealed`);
	});

	it(`should prevent damaging abilities triggered by contact from acting`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'protectivepads', moves: ['bulletpunch']},
		], [
			{species: 'ferrothorn', ability: 'ironbarbs', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0], `Attacker should not be damaged`);
		assert(battle.log.some(line => line.includes('Iron Barbs')));
		assert(battle.log.some(line => line.includes('Protective Pads')));
	});

	it(`should prevent stat stage-changing abilities triggered by contact from acting`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'protectivepads', moves: ['bulletpunch']},
		], [
			{species: 'goodra', ability: 'gooey', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'spe', 0, `Speed should not be lowered`);
		assert(battle.log.some(line => line.includes('Gooey')));
		assert(battle.log.some(line => line.includes('Protective Pads')));
	});

	it(`should not stop Pickpocket`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'protectivepads', moves: ['bulletpunch']},
		], [
			{species: 'weavile', ability: 'pickpocket', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.false.holdsItem(battle.p1.active[0], `Attacker should lose their item`);
		assert.equal(battle.p2.active[0].item, 'protectivepads', `Target should receive stolen Protective Pads`);
	});

	it(`should prevent item effects triggered by contact from acting`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'protectivepads', moves: ['bulletpunch']},
		], [
			{species: 'miltank', item: 'rockyhelmet', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0], `Attacker should not be hurt`);
		assert(battle.log.every(line => !line.includes('Rocky Helmet')));
		assert(battle.log.every(line => !line.includes('Protective Pads')));
	});

	it(`should not activate on the opponent's moves`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'protectivepads', moves: ['sleeptalk']},
		], [
			{species: 'happiny', moves: ['lunge']},
		]]);
		battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'atk', -1, `Attack should be lowered`);
	});

	it(`should not start Perish Body on either Pokemon`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'protectivepads', moves: ['bulletpunch']},
		], [
			{species: 'cursola', ability: 'perishbody', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.false(battle.p1.active[0].volatiles['perishsong'], 'Perish Body should not have activated on Wynaut due to Protective Pads.');
		assert.false(battle.p2.active[0].volatiles['perishsong'], 'Perish Body should not have activated on Cursola due to Protective Pads.');
		assert(battle.log.every(line => !line.includes('Perish Body')));
		assert(battle.log.every(line => !line.includes('Protective Pads')));
	});

	it(`should block against Protecting effects with a contact side effect`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'protectivepads', moves: ['sleeptalk', 'tackle']},
		], [
			{species: 'aggron', moves: ['sleeptalk', 'banefulbunker', 'obstruct', 'spikyshield']},
		]]);
		battle.makeChoices('move tackle', 'move banefulbunker');
		battle.makeChoices();
		battle.makeChoices('move tackle', 'move obstruct');
		battle.makeChoices();
		battle.makeChoices('move tackle', 'move spikyshield');
		battle.makeChoices();
		const wynaut = battle.p1.active[0];
		assert.equal(wynaut.status, '', `Wynaut should not have been poisoned by Baneful Bunker`);
		assert.statStage(wynaut, 'def', 0, `Wynaut's Defense should not have been lowered by Obstruct`);
		assert.fullHP(wynaut, `Wynaut should not have lost HP from Spiky Shield`);
		assert(battle.log.every(line => !line.includes('Protective Pads')));
	});

	it(`should not protect against Gulp Missile when using a contact move`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'protectivepads', moves: ['bulletpunch']},
		], [
			{species: 'cramorantgorging', ability: 'gulpmissile', item: 'rockyhelmet', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		const wynaut = battle.p1.active[0];
		assert.equal(wynaut.hp, wynaut.maxhp - Math.floor(wynaut.maxhp / 4), `Wynaut should be damaged by Gulp Missile, but not Rocky Helmet`);
		assert.equal(wynaut.status, 'par');
		assert(battle.log.every(line => !line.includes('Protective Pads')));
	});
});
