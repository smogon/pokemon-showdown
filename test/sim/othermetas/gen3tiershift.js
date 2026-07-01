'use strict';

const assert = require('./../../assert');
const common = require('./../../common');
const Dex = require('./../../../dist/sim').Dex;

let battle;

// One representative species per Gen 3 tier, paired with the boost [Gen 3] Tier
// Shift should apply to every stat except HP. OU/Uber stay unboosted; UUBL — and
// "(OU)" by technicality, which the mod treats as UUBL — get +5; then the base
// ladder UU +10 / RU +15 / NU +20 / PU +30 / ZU +35 / SU-LC-NFE +40. Mirrors
// data/mods/gen3/rulesets.ts `tiershiftmod`.
const CASES = [
	{ species: 'Mewtwo', tier: 'Uber', boost: 0 },
	{ species: 'Milotic', tier: 'OU', boost: 0 },
	{ species: 'Regice', tier: '(OU)', boost: 5 },
	{ species: 'Venusaur', tier: 'UUBL', boost: 5 },
	{ species: 'Blastoise', tier: 'UU', boost: 10 },
	{ species: 'Jumpluff', tier: 'RUBL', boost: 10 },
	{ species: 'Raichu', tier: 'RU', boost: 15 },
	{ species: 'Glalie', tier: 'NUBL', boost: 15 },
	{ species: 'Pidgeot', tier: 'NU', boost: 20 },
	{ species: 'Machoke', tier: 'PUBL', boost: 20 },
	{ species: 'Charmeleon', tier: 'PU', boost: 30 },
	{ species: 'Yanma', tier: 'ZUBL', boost: 30 },
	{ species: 'Ivysaur', tier: 'ZU', boost: 35 },
	{ species: 'Clefairy', tier: 'NFE', boost: 40 },
	{ species: 'Bulbasaur', tier: 'LC', boost: 40 },
];

describe('[Gen 3] Tier Shift', () => {
	afterEach(() => {
		if (battle) battle.destroy();
		battle = null;
	});

	for (const { species, tier, boost } of CASES) {
		it(`should boost ${tier} ${species} by +${boost} on every stat except HP`, () => {
			battle = common.createBattle({ formatid: 'gen3tiershift' }, [
				[{ species, moves: ['tackle'] }, { species: 'Snorlax', moves: ['tackle'] }],
				[{ species: 'Snorlax', moves: ['tackle'] }, { species: 'Zapdos', moves: ['tackle'] }],
			]);
			const base = Dex.mod('gen3').species.get(species).baseStats;
			const active = battle.p1.active[0];
			assert.equal(active.species.tier, tier, `${species} should be ranked ${tier} in gen3`);
			assert.equal(active.species.baseStats.hp, base.hp, `${species} HP must never be boosted`);
			for (const stat of ['atk', 'def', 'spa', 'spd', 'spe']) {
				assert.equal(active.species.baseStats[stat], Math.min(255, base[stat] + boost),
					`${species} ${stat} should be ${base[stat]} + ${boost}`);
			}
		});
	}

	it('should treat "(OU)" by technicality as UUBL (+5), distinct from real OU (+0)', () => {
		battle = common.createBattle({ formatid: 'gen3tiershift' }, [
			[{ species: 'Regice', moves: ['tackle'] }, { species: 'Snorlax', moves: ['tackle'] }],
			[{ species: 'Milotic', moves: ['tackle'] }, { species: 'Snorlax', moves: ['tackle'] }],
		]);
		const regiceSpa = Dex.mod('gen3').species.get('Regice').baseStats.spa;
		const miloticSpa = Dex.mod('gen3').species.get('Milotic').baseStats.spa;
		assert.equal(battle.p1.active[0].species.baseStats.spa, regiceSpa + 5, 'Regice "(OU)" should get +5');
		assert.equal(battle.p2.active[0].species.baseStats.spa, miloticSpa, 'Milotic real OU should get +0');
	});

	// SU is a fork-only tier (gen3subzu mod); these mons rank ZU in the standard
	// gen3 tier list this format reads, but should get the SU +40, not ZU +35.
	for (const species of ['Sunflora', 'Parasect', 'Ditto']) {
		it(`should boost SU ${species} by +40 (not its gen3 ZU +35)`, () => {
			assert.equal(Dex.mod('gen3subzu').species.get(species).tier, 'SU', `${species} should be SU in gen3subzu`);
			assert.equal(Dex.mod('gen3').species.get(species).tier, 'ZU', `${species} ranks ZU in standard gen3`);
			battle = common.createBattle({ formatid: 'gen3tiershift' }, [
				[{ species, moves: ['tackle'] }, { species: 'Snorlax', moves: ['tackle'] }],
				[{ species: 'Snorlax', moves: ['tackle'] }, { species: 'Zapdos', moves: ['tackle'] }],
			]);
			const base = Dex.mod('gen3').species.get(species).baseStats;
			const active = battle.p1.active[0];
			assert.equal(active.species.baseStats.hp, base.hp, `${species} HP must never be boosted`);
			for (const stat of ['atk', 'def', 'spa', 'spd', 'spe']) {
				assert.equal(active.species.baseStats[stat], Math.min(255, base[stat] + 40),
					`${species} ${stat} should be boosted by +40 (SU), not +35 (ZU)`);
			}
		});
	}
});
