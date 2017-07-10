'use strict';

const common = require('./../../common');

let battle;

const TOTAL_TEAMS = 100;
const ALL_GENS = [1, 2, 3, 4, 5, 6, 7];

function isValidSet(gen, set) {
	const dex = Dex.mod(`gen${gen}`);
	const template = dex.getTemplate(set.species || set.name);
	if (!template.exists || template.gen > gen) return false;
	if (set.item) {
		const item = dex.getItem(set.item);
		if (!item.exists || item.gen > gen) {
			return false;
		}
	}
	if (set.ability && set.ability !== 'None') {
		const ability = dex.getAbility(set.ability);
		if (!ability.exists || ability.gen > gen) {
			return false;
		}
	} else if (gen >= 3) {
		return false;
	}
	return true;
}

describe(`Random Team generator`, function () {
	afterEach(() => battle.destroy());

	for (const gen of ALL_GENS) {
		it(`should successfully create valid Gen ${gen} teams`, function () {
			this.timeout(0);
			battle = common.gen(gen).createBattle();

			let teamCount = TOTAL_TEAMS;
			while (teamCount--) {
				let seed = battle.prng.seed.slice();
				let team = null;
				try {
					team = battle.randomTeam(battle.p1);
					let invalidSet = team.find(set => !isValidSet(gen, set));
					if (invalidSet) throw new Error(`Invalid set: ${JSON.stringify(invalidSet)}`);
				} catch (err) {
					err.message += ` (seed ${seed})`;
					throw err;
				}
			}
		});
	}
});

describe(`Challenge Cup Team generator`, function () {
	afterEach(() => battle.destroy());

	for (const gen of ALL_GENS) {
		it(`should successfully create valid Gen ${gen} teams`, function () {
			this.timeout(0);
			battle = common.gen(gen).createBattle();

			let teamCount = TOTAL_TEAMS;
			while (teamCount--) {
				let seed = battle.prng.seed.slice();
				let team = null;
				try {
					team = battle.randomCCTeam(battle.p1);
					let invalidSet = team.find(set => !isValidSet(gen, set));
					if (invalidSet) throw new Error(`Invalid set: ${JSON.stringify(invalidSet)}`);
				} catch (err) {
					err.message += ` (seed ${seed})`;
					throw err;
				}
			}
		});
	}
});

describe(`Hackmons Cup Team generator`, function () {
	afterEach(() => battle.destroy());

	for (const gen of ALL_GENS) {
		it(`should successfully create valid Gen ${gen} teams`, function () {
			this.timeout(0);
			battle = common.gen(gen).createBattle();

			let teamCount = TOTAL_TEAMS;
			while (teamCount--) {
				let seed = battle.prng.seed.slice();
				let team = null;
				try {
					team = battle.randomHCTeam(battle.p1);
					let invalidSet = team.find(set => !isValidSet(gen, set));
					if (invalidSet) throw new Error(`Invalid set: ${JSON.stringify(invalidSet)}`);
				} catch (err) {
					err.message += ` (seed ${seed})`;
					throw err;
				}
			}
		});
	}
});
