'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Normalize', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should change most of the user\'s moves to Normal-type', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Delcatty", ability: 'normalize', moves: ['grassknot'] }] });
		battle.setPlayer('p2', { team: [{ species: "Latias", ability: 'colorchange', moves: ['endure'] }] });
		battle.makeChoices('move grassknot', 'move endure');
		assert(battle.p2.active[0].hasType('Normal'));
	});

	it('should not change Hidden Power to Normal-type', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Delcatty", ability: 'normalize', moves: ['hiddenpowerfighting'] }] });
		battle.setPlayer('p2', { team: [{ species: "Latias", ability: 'colorchange', moves: ['endure'] }] });
		battle.makeChoices('move hiddenpowerfighting', 'move endure');
		assert(battle.p2.active[0].hasType('Fighting'));
	});

	it('should not change Techno Blast to Normal-type if the user is holding a Drive', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Delcatty", ability: 'normalize', item: 'dousedrive', moves: ['technoblast'] }] });
		battle.setPlayer('p2', { team: [{ species: "Latias", ability: 'colorchange', moves: ['endure'] }] });
		battle.makeChoices('move technoblast', 'move endure');
		assert(battle.p2.active[0].hasType('Water'));
	});

	it('should not change Judgment to Normal-type if the user is holding a Plate', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Delcatty", ability: 'normalize', item: 'zapplate', moves: ['judgment'] }] });
		battle.setPlayer('p2', { team: [{ species: "Latias", ability: 'colorchange', moves: ['endure'] }] });
		battle.makeChoices('move judgment', 'move endure');
		assert(battle.p2.active[0].hasType('Electric'));
	});

	it('should not change Weather Ball to Normal-type if sun, rain, or hail is an active weather', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Delcatty", ability: 'normalize', item: 'laggingtail', moves: ['weatherball'] }] });
		battle.setPlayer('p2', { team: [{ species: "Latias", ability: 'colorchange', moves: ['sunnyday'] }] });
		battle.makeChoices('move weatherball', 'move sunnyday');
		assert(battle.p2.active[0].hasType('Fire'));
	});

	it('should not change Natural Gift to Normal-type if the user is holding a Berry', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Delcatty", ability: 'normalize', item: 'chopleberry', moves: ['naturalgift'] }] });
		battle.setPlayer('p2', { team: [{ species: "Latias", ability: 'colorchange', moves: ['endure'] }] });
		battle.makeChoices('move naturalgift', 'move endure');
		assert(battle.p2.active[0].hasType('Fighting'));
	});
});

describe('Normalize [Gen 4]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should change most of the user\'s moves to Normal-type', () => {
		battle = common.gen(4).createBattle([
			[{ species: "Delcatty", ability: 'normalize', moves: ['grassknot'] }],
			[{ species: "Latias", ability: 'colorchange', moves: ['endure'] }],
		]);
		battle.makeChoices('move grassknot', 'move endure');
		assert(battle.p2.active[0].hasType('Normal'));
	});

	it('should change Hidden Power to Normal-type', () => {
		battle = common.gen(4).createBattle([
			[{ species: "Delcatty", ability: 'normalize', moves: ['hiddenpowerfire'] }],
			[{ species: "Latias", ability: 'colorchange', moves: ['endure'] }],
		]);
		battle.makeChoices('move hiddenpowerfire', 'move endure');
		assert(battle.p2.active[0].hasType('Normal'));
	});

	it('should change Judgment to Normal-type even if the user is holding a Plate', () => {
		battle = common.gen(4).createBattle([
			[{ species: "Delcatty", ability: 'normalize', item: 'pixieplate', moves: ['judgment'] }],
			[{ species: "Latias", ability: 'colorchange', moves: ['endure'] }],
		]);
		battle.makeChoices('move judgment', 'move endure');
		assert(battle.p2.active[0].hasType('Normal'));
	});

	it('should change Weather Ball to Normal-type even if sun, rain, or hail is an active weather', () => {
		battle = common.gen(4).createBattle([
			[{ species: "Delcatty", ability: 'normalize', item: 'laggingtail', moves: ['weatherball'] }],
			[{ species: "Latias", ability: 'colorchange', moves: ['sunnyday'] }],
		]);
		battle.makeChoices('move weatherball', 'move sunnyday');
		assert(battle.p2.active[0].hasType('Normal'));
	});
});
