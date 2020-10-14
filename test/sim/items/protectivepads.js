'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Protective Pads', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent ability-changing abilities triggered by contact from acting', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Cofagrigus", ability: 'mummy', moves: ['calmmind']}]});
		battle.setPlayer('p2', {team: [{species: "Hariyama", ability: 'thickfat', item: 'protectivepads', moves: ['bulletpunch']}]});
		const attacker = battle.p2.active[0];
		battle.makeChoices();
		assert.equal(attacker.ability, 'thickfat');
		const mummyActivationMessages = battle.log.filter(logStr => logStr.startsWith('|-activate|') && logStr.includes('Mummy'));
		assert.equal(mummyActivationMessages.length, 1, "Mummy should activate only once");
		assert(mummyActivationMessages[0].includes('Cofagrigus'), "Source of Mummy activation should be included");
		assert.false(mummyActivationMessages[0].includes('Thick Fat'), "Attacker's ability should not be revealed");
	});

	it('should prevent damaging abilities triggered by contact from acting', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Purrloin", ability: 'prankster', item: 'protectivepads', moves: ['scratch']}]});
		battle.setPlayer('p2', {team: [{species: "Ferrothorn", ability: 'ironbarbs', moves: ['rest']}]});
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0], "Attacker should not be hurt");
	});

	it('should prevent stat stage-changing abilities triggered by contact from acting', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Purrloin", ability: 'prankster', item: 'protectivepads', moves: ['scratch']}]});
		battle.setPlayer('p2', {team: [{species: "Goodra", ability: 'gooey', moves: ['rest']}]});
		battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'spe', 0, "Speed should not be lowered");
	});

	it('should not stop Pickpocket', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Weavile", ability: 'pickpocket', moves: ['swordsdance']}]});
		battle.setPlayer('p2', {team: [{species: "Liepard", ability: 'prankster', item: 'protectivepads', moves: ['scratch']}]});
		battle.makeChoices();
		assert.false(battle.p2.active[0].item, "Attacker should lose their item");
		assert.equal(battle.p1.active[0].item, 'protectivepads', "Target should receive stolen item");
	});

	it('should prevent item effects triggered by contact from acting', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Purrloin", ability: 'prankster', item: 'protectivepads', moves: ['scratch']}]});
		battle.setPlayer('p2', {team: [{species: "Cacnea", ability: 'waterabsorb', item: 'rockyhelmet', moves: ['synthesis']}]});
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0], "Attacker should not be hurt");
	});

	it('should not activate on the opponent\'s moves', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Hariyama", ability: 'guts', item: 'protectivepads', moves: ['rest']}]});
		battle.setPlayer('p2', {team: [{species: "Galvantula", ability: 'swarm', moves: ['lunge']}]});
		battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'atk', -1, "Attack should be lowered");
	});
});
