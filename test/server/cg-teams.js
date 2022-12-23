'use strict';

const assert = require('assert').strict;
const TeamGenerator = require('../../dist/data/cg-teams').default;

describe('[Gen 9] Computer-Generated Teams', () => {
	it('should give all species 4 or fewer moves', () => {
		const generator = new TeamGenerator();
		const pool = generator.dex.species
			.all()
			.filter(s => s.exists && !(s.isNonstandard || s.isNonstandard === 'Unobtainable') && !s.nfe);
		for (const species of pool) {
			const set = generator.makeSet(species, {hazardSetters: {}});
			assert(set.moves.length <= 4, `Species ${species.name} has more than 4 moves (set=${JSON.stringify(set)})`);
			assert(new Set(set.moves).size === set.moves.length, `Species ${species.name} has duplicate moves (set=${JSON.stringify(set)})`);
		}
	});

	// Skipped since it includes randomness; useful for debugging though
	it.skip('should have an accurate weighted picker', () => {
		const generator = new TeamGenerator();
		const numTrials = 100000;
		let error = 0;
		let trials = 0;

		for (const choices of [
			[{choice: 'a', weight: 1}, {choice: 'b', weight: 2}],
			[{choice: 'a', weight: 1}, {choice: 'b', weight: 1}],
			[{choice: 'a', weight: 30}, {choice: 'b', weight: 2000}, {choice: 'c', weight: 7}],
			// a big test case with lots of different weight values
			[
				{choice: 'a', weight: 1345}, {choice: 'b', weight: 2013}, {choice: 'c', weight: 3411}, {choice: 'd', weight: 940},
				{choice: 'e', weight: 505}, {choice: 'f', weight: 10148}, {choice: 'g', weight: 7342}, {choice: 'h', weight: 8403},
				{choice: 'i', weight: 9859}, {choice: 'j', weight: 1042}, {choice: 'k', weight: 1132}, {choice: 'l', weight: 1200},
			],
		]) {
			const results = {};
			for (let i = 0; i < numTrials; i++) {
				const res = generator.weightedRandomPick(choices.map(x => x.choice), c => choices.find(x => x.choice === c)?.weight || 0);
				// console.log(`"${res}"`);
				if (!results[res]) results[res] = 0;
				results[res]++;
			}

			let totalWeight = 0;
			for (const choice of choices) {
				totalWeight += choice.weight;
			}

			for (const [choice, count] of Object.entries(results)) {
				const c = choices.find(x => x.choice === choice);
				const expected = (c.weight / totalWeight) * numTrials;
				error += Math.abs(count - expected) / expected;
				trials++;
			}
		}

		const percentError = (error / trials) * 100;
		assert(percentError < 3, `Weighted picker error is too high: ${percentError.toFixed(1)}%`);
	});
});
