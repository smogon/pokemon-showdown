'use strict';

const common = require('./../../common');

let battle;

const TOTAL_TEAMS = 300;

function isValidSet(set) {
	if (!Tools.getTemplate(set.species || set.name).exists) return false;
	if (!Tools.getItem(set.item).exists) return false;
	if (!Tools.getAbility(set.ability).exists) return false;
	return true;
}

describe(`Random Team generator`, function () {
	afterEach(() => battle.destroy());

	it(`should successfully create valid teams`, function () {
		this.timeout(0);
		battle = common.createBattle([[{species: "Mew", ability: 'pressure', moves: ['struggle']}], [{species: "Mew", ability: 'pressure', moves: ['struggle']}]]);
		battle.seed = battle.generateSeed();

		let teamCount = TOTAL_TEAMS;
		while (teamCount--) {
			let seed = battle.seed.slice();
			let team = null;
			try {
				team = battle.randomTeam(battle.p1);
				if (team.some(set => !isValidSet(set))) throw new Error(`Invalid set`);
			} catch (err) {
				throw new Error(`Failed to create a valid random team from seed ${seed}`);
			}
		}
	});
});

describe(`Challenge Cup Team generator`, function () {
	afterEach(() => battle.destroy());

	it(`should successfully create valid teams`, function () {
		this.timeout(0);
		battle = common.createBattle([[{species: "Mew", ability: 'pressure', moves: ['struggle']}], [{species: "Mew", ability: 'pressure', moves: ['struggle']}]]);
		battle.seed = battle.generateSeed();

		let teamCount = TOTAL_TEAMS;
		while (teamCount--) {
			let seed = battle.seed.slice();
			let team = null;
			try {
				team = battle.randomCCTeam(battle.p1);
				if (team.some(set => !isValidSet(set))) throw new Error(`Invalid set`);
			} catch (err) {
				err.message += ` (seed ${seed})`;
				throw err;
			}
		}
	});
});

describe(`Hackmons Cup Team generator`, function () {
	afterEach(() => battle.destroy());

	it(`should successfully create valid teams`, function () {
		this.timeout(0);
		battle = common.createBattle([[{species: "Mew", ability: 'pressure', moves: ['struggle']}], [{species: "Mew", ability: 'pressure', moves: ['struggle']}]]);
		battle.seed = battle.generateSeed();

		let teamCount = TOTAL_TEAMS;
		while (teamCount--) {
			let seed = battle.seed.slice();
			let team = null;
			try {
				team = battle.randomHCTeam(battle.p1);
				if (team.some(set => !isValidSet(set))) throw new Error(`Invalid set`);
			} catch (err) {
				err.message += ` (seed ${seed})`;
				throw err;
			}
		}
	});
});
