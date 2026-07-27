'use strict';

const assert = require('./../../assert');
const common = require('./../../common');
const { Battle, Dex } = require('./../../../dist/sim');
const { Format } = require('./../../../dist/sim/dex-formats');
const { TeamValidator } = require('./../../../dist/sim/team-validator');

const capAddedMegas = {
	parasectmega: ['Parasect', 'Parasectite'],
	venomothmega: ['Venomoth', 'Venomite'],
	quagsiremega: ['Quagsire', 'Quagsite'],
	magcargomega: ['Magcargo', 'Magcargoite'],
	corsolamega: ['Corsola', 'Corsolite'],
	beautiflymega: ['Beautifly', 'Beautiflite'],
	masquerainmega: ['Masquerain', 'Masquerite'],
	shedinjamega: ['Shedinja', 'Shedinjite'],
	volbeatmega: ['Volbeat', 'Volbeatite'],
	illumisemega: ['Illumise', 'Illumite'],
	grumpigmega: ['Grumpig', 'Grumpigite'],
	flygonmega: ['Flygon', 'Flygonite'],
	solrockmega: ['Solrock', 'Sole Rock'],
	kecleonmegax: ['Kecleon', 'Kecleite X'],
	kecleonmegay: ['Kecleon', 'Kecleite Y'],
	luvdiscmega: ['Luvdisc', 'Luvdite'],
};

const authoritativeMegaData = {
	parasectmega: [[90, 135, 100, 50, 100, 30], ['Bug', 'Ghost'], 'Regenerator'],
	venomothmega: [[85, 110, 80, 70, 80, 120], ['Bug', 'Poison'], 'Merciless'],
	hitmonchanmega: [[50, 105, 79, 110, 110, 101], ['Fighting'], 'Iron Fist'],
	dittomega: [[90, 50, 50, 50, 50, 50], ['Normal'], 'Imposter'],
	noctowlmega: [[80, 125, 61, 91, 96, 99], ['Ghost', 'Flying'], 'Shady'],
	quagsiremega: [[110, 95, 110, 90, 90, 35], ['Water', 'Ground'], 'Unaware'],
	magcargomega: [[80, 100, 125, 100, 125, 30], ['Fire', 'Rock'], 'Earth Eater'],
	corsolamega: [[90, 70, 115, 120, 115, 30], ['Water', 'Psychic'], 'Natural Cure'],
	mantinemega: [[90, 65, 100, 120, 110, 100], ['Water', 'Dragon'], 'Dragonize'],
	mightyenamegax: [[61, 110, 60, 119, 60, 110], ['Dark'], 'Serene Grace'],
	mightyenamegay: [[100, 100, 100, 35, 110, 95], ['Dark', 'Poison'], 'Fur Coat'],
	beautiflymega: [[90, 10, 90, 130, 90, 116], ['Grass', 'Flying'], 'Mega Sol'],
	masquerainmega: [[91, 80, 84, 90, 110, 95], ['Bug', 'Water'], 'Water Bubble'],
	shedinjamega: [[4, 110, 45, 51, 30, 96], ['Bug', 'Ghost'], 'Wonder Guard'],
	volbeatmega: [[85, 65, 75, 90, 90, 125], ['Bug', 'Electric'], 'Polar Switch'],
	illumisemega: [[70, 70, 90, 125, 90, 85], ['Bug', 'Electric'], 'Prankster'],
	grumpigmega: [[100, 60, 80, 125, 125, 80], ['Psychic'], 'Opportunist'],
	flygonmega: [[80, 100, 120, 100, 80, 110], ['Ground', 'Dragon'], 'Sandy'],
	solrockmega: [[90, 115, 110, 90, 85, 90], ['Rock', 'Psychic'], 'High Noon'],
	kecleonmegax: [[60, 120, 60, 110, 120, 105], ['Normal'], 'Color Change'],
	kecleonmegay: [[100, 100, 120, 100, 100, 40], ['Normal'], 'Protean'],
	walreinmega: [[125, 80, 100, 100, 115, 80], ['Water', 'Ice'], 'Snow Warning'],
	luvdiscmega: [[45, 70, 25, 160, 25, 125], ['Water'], 'Soul-Heart'],
};

describe('[Gen 3] Megas CAP', () => {
	it('keeps its custom data isolated from [Gen 3] Megas', () => {
		const capDex = Dex.mod('gen3megascap');
		const megaDex = Dex.mod('gen3mega');

		assert.equal(capDex.species.get('magcargomega').name, 'Magcargo-Mega');
		assert.equal(capDex.species.get('magcargomega').tier, 'OU');
		assert.equal(capDex.items.get('magcargoite').megaStone.Magcargo, 'Magcargo-Mega');
		assert.equal(capDex.species.get('zangoose').tier, 'OU');
		assert.equal(megaDex.species.get('magcargomega').exists, false,
			'Mega Magcargo must remain unavailable in [Gen 3] Megas');
		assert.equal(megaDex.items.get('magcargoite').exists, false,
			'Magcargoite must remain unavailable in [Gen 3] Megas');
		assert.equal(megaDex.species.get('zangoose').tier, 'UU');
	});

	it('loads Archie\'s expanded CAP Mega roster, stones, and abilities', () => {
		const dex = Dex.mod('gen3megascap');
		const megas = {
			parasectmega: ['Parasectite', 'Regenerator'],
			hitmonchanmega: ['Hitmonchanite', 'Iron Fist'],
			dittomega: ['Dittite', 'Imposter'],
			noctowlmega: ['Noctite', 'Shady'],
			mantinemega: ['Mantite', 'Dragonize'],
			mightyenamegax: ['Mightyenite X', 'Serene Grace'],
			mightyenamegay: ['Mightyenite Y', 'Fur Coat'],
			beautiflymega: ['Beautiflite', 'Mega Sol'],
			walreinmega: ['Walrite', 'Snow Warning'],
			luvdiscmega: ['Luvdite', 'Soul-Heart'],
		};

		for (const [id, [itemName, abilityName]] of Object.entries(megas)) {
			const species = dex.species.get(id);
			const item = dex.items.get(itemName);
			assert.equal(species.exists, true, `${id} should exist`);
			assert.equal(species.requiredItem, itemName);
			assert.equal(species.abilities[0], abilityName);
			assert.equal(species.tier, 'OU');
			assert.equal(item.exists, true, `${itemName} should exist`);
			assert.equal(item.gen, 3);
			assert.equal(item.isNonstandard, null);
		}

		assert.equal(dex.abilities.get('megasol').isNonstandard, null);
		assert.equal(dex.abilities.get('shady').isNonstandard, null);
		assert.deepEqual(dex.species.get('hitmonchan').abilities, { 0: 'Keen Eye', 1: 'Iron Fist' });
		assert.deepEqual(dex.species.get('beautiflymega').baseStats,
			{ hp: 90, atk: 10, def: 90, spa: 130, spd: 90, spe: 116 });
		assert.deepEqual(dex.species.get('beautiflymega').types, ['Grass', 'Flying']);
		assert.equal(Dex.mod('gen3mega').species.get('beautiflymega').exists, false,
			'Beautifly-Mega must not leak into [Gen 3] Megas via base data');
		assert.equal(Dex.mod('gen3mega').species.get('parasectmega').exists, false,
			'Parasect-Mega must not leak into [Gen 3] Megas via base data');
	});

	it('matches the authoritative ADV Megas CAP stats, typings, and abilities', () => {
		const dex = Dex.mod('gen3megascap');
		const actualMegaData = {};
		for (const id of Object.keys(authoritativeMegaData)) {
			const species = dex.species.get(id);
			const ability = dex.abilities.get(species.abilities[0]);
			assert.equal(ability.exists, true, `${species.abilities[0]} should exist`);
			assert.equal(ability.isNonstandard, null, `${species.abilities[0]} should be legal in Gen 3`);
			actualMegaData[id] = [
				['hp', 'atk', 'def', 'spa', 'spd', 'spe'].map(stat => species.baseStats[stat]),
				species.types,
				species.abilities[0],
			];
		}
		assert.deepEqual(actualMegaData, authoritativeMegaData);
		assert.equal(dex.abilities.get('sandy').name, 'Sandy');
		assert.equal(dex.species.get('sandy').name, 'Sandy Shocks',
			'the Sandy Shocks species alias should remain available outside ability lookups');
	});

	it('marks every CAP-added Mega OU and links it to its base species and stone', () => {
		const dex = Dex.mod('gen3megascap');
		for (const [id, [baseName, itemName]] of Object.entries(capAddedMegas)) {
			const species = dex.species.get(id);
			const base = dex.species.get(baseName);
			const item = dex.items.get(itemName);
			assert.equal(species.exists, true, `${id} should exist`);
			assert.equal(species.gen, 3, `${id} should be a Gen 3 species`);
			assert.equal(species.isNonstandard, null, `${id} should be standard in the CAP mod`);
			assert.equal(species.tier, 'OU', `${id} should be OU`);
			assert(base.otherFormes.includes(species.name), `${baseName} should link to ${species.name}`);
			assert.deepEqual(species.requiredItems, [itemName]);
			assert.equal(item.exists, true, `${itemName} should exist`);
			assert.equal(item.gen, 3, `${itemName} should be a Gen 3 item`);
			assert.equal(item.isNonstandard, null, `${itemName} should be standard in the CAP mod`);
			assert.equal(item.megaStone[baseName], species.name);
		}
		assert(dex.species.get('corsola').otherFormes.includes('Corsola-Galar'),
			'adding Mega Corsola must preserve Corsola-Galar');
	});

	it('allows every CAP-added Mega in the format', () => {
		const dex = Dex.mod('gen3megascap');
		for (const [id, [baseName, itemName]] of Object.entries(capAddedMegas)) {
			const base = dex.species.get(baseName);
			const errors = TeamValidator.get('gen3megascap').validateTeam([
				{ species: baseName, item: itemName, ability: base.abilities[0], moves: ['hiddenpower'], evs: { hp: 1 } },
			]);
			assert(!errors, `${id} should be legal, got: ${JSON.stringify(errors)}`);
		}
	});

	it('applies the updated tiering and banlist', () => {
		const dex = Dex.mod('gen3megascap');
		const format = Dex.formats.get('gen3megascap');

		assert.equal(dex.species.get('dugtrio').tier, 'OU');
		assert.equal(dex.species.get('alakazam').tier, 'UUBL');
		assert.equal(dex.species.get('starmie').tier, 'OU');
		for (const ban of [
			'Soundproof + Baton Pass', 'Sand Veil + Sand Stream', 'Quick Claw',
			'Confuse Ray', 'Dynamic Punch', 'Focus Band', 'Mud Slap',
		]) {
			assert(format.banlist.includes(ban), `${ban} should be banned`);
		}
	});

	it('allows the new CAP Mega Stones in the format', () => {
		const cases = [
			['Parasect', 'Parasectite', 'Effect Spore', 'spore'],
			['Hitmonchan', 'Hitmonchanite', 'Keen Eye', 'machpunch'],
			['Ditto', 'Dittite', 'Limber', 'transform'],
			['Noctowl', 'Noctite', 'Insomnia', 'hypnosis'],
			['Mantine', 'Mantite', 'Swift Swim', 'surf'],
			['Mightyena', 'Mightyenite X', 'Intimidate', 'crunch'],
			['Beautifly', 'Beautiflite', 'Swarm', 'gust'],
			['Walrein', 'Walrite', 'Thick Fat', 'icebeam'],
			['Luvdisc', 'Luvdite', 'Swift Swim', 'surf'],
		];
		for (const [species, item, ability, move] of cases) {
			const errors = TeamValidator.get('gen3megascap').validateTeam([
				{ species, item, ability, moves: [move], evs: { hp: 1 } },
			]);
			assert(!errors, `expected ${item} to be legal, got: ${JSON.stringify(errors)}`);
		}
	});

	it('runs the new CAP Mega abilities in Gen 3 battles', () => {
		const hailBattle = common.createBattle({ formatid: 'gen3megascap' }, [
			[{ species: 'Walrein', item: 'Walrite', ability: 'Thick Fat', moves: ['surf'] }],
			[{ species: 'Snorlax', ability: 'Thick Fat', moves: ['tackle'] }],
		]);
		hailBattle.makeChoices('move surf mega', 'move tackle');
		assert.equal(hailBattle.p1.active[0].species.name, 'Walrein-Mega');
		assert.equal(hailBattle.field.weather, 'hail');

		const shadyBattle = common.createBattle({ formatid: 'gen3megascap' }, [
			[{ species: 'Noctowl', item: 'Noctite', ability: 'Insomnia', moves: ['shadowball'] }],
			[{ species: 'Snorlax', ability: 'Thick Fat', moves: ['splash'] }],
		]);
		shadyBattle.makeChoices('move shadowball mega', 'move splash');
		assert(shadyBattle.p2.active[0].hp < shadyBattle.p2.active[0].maxhp,
			'Shady should let Ghost moves hit Normal-types');

		const shineBattle = common.createBattle({ formatid: 'gen3megascap' }, [
			[{ species: 'Beautifly', item: 'Beautiflite', ability: 'Swarm', moves: ['protect'] }],
			[{ species: 'Snorlax', ability: 'Thick Fat', moves: ['protect'] }],
		]);
		shineBattle.makeChoices('move protect mega', 'move protect');
		assert.equal(shineBattle.p1.active[0].ability, 'megasol');
		assert.deepEqual(shineBattle.p1.active[0].getTypes(), ['Grass', 'Flying']);
	});

	it('lets Sandy hit Flying-types while preserving Levitate for non-Flying targets', () => {
		const flyingBattle = common.createBattle({ formatid: 'gen3megascap' }, [
			[{ species: 'Flygon', item: 'Flygonite', ability: 'Levitate', moves: ['earthquake'] }],
			[{ species: 'Skarmory', ability: 'Keen Eye', moves: ['splash'] }],
		]);
		flyingBattle.makeChoices('move earthquake mega', 'move splash');
		assert.equal(flyingBattle.p1.active[0].ability, 'sandy');
		assert(flyingBattle.p2.active[0].hp < flyingBattle.p2.active[0].maxhp,
			'Sandy should let Ground moves hit Flying-types');

		const levitateBattle = common.createBattle({ formatid: 'gen3megascap' }, [
			[{ species: 'Flygon', item: 'Flygonite', ability: 'Levitate', moves: ['earthquake'] }],
			[{ species: 'Weezing', ability: 'Levitate', moves: ['splash'] }],
		]);
		levitateBattle.makeChoices('move earthquake mega', 'move splash');
		assert.equal(levitateBattle.p2.active[0].hp, levitateBattle.p2.active[0].maxhp,
			'Sandy should not bypass Levitate on a non-Flying target');

		const flyingLevitateBattle = common.createBattle({ formatid: 'gen3megascap' }, [
			[{ species: 'Flygon-Mega', ability: 'Sandy', moves: ['earthquake'] }],
			[{ species: 'Charizard', ability: 'Levitate', moves: ['splash'] }],
		]);
		flyingLevitateBattle.makeChoices('move earthquake', 'move splash');
		assert(flyingLevitateBattle.p2.active[0].hp < flyingLevitateBattle.p2.active[0].maxhp,
			'Sandy should hit any Flying-type Pokemon, including one that also has Levitate');
	});

	it('applies Sandy separately to each target of a spread Ground move', () => {
		const format = new Format({ ...Dex.formats.get('gen3megascap'), gameType: 'doubles' });
		const p1Team = [
			{ species: 'Flygon', item: 'Flygonite', ability: 'Levitate', moves: ['earthquake'] },
			{ species: 'Charizard', ability: 'Blaze', moves: ['splash'] },
		];
		const p2Team = [
			{ species: 'Skarmory', ability: 'Keen Eye', moves: ['splash'] },
			{ species: 'Weezing', ability: 'Levitate', moves: ['splash'] },
		];
		const battle = new Battle({
			format, debug: true, strictChoices: true,
			p1: { team: p1Team }, p2: { team: p2Team },
		});
		battle.makeChoices('move earthquake mega, move splash', 'move splash, move splash');
		assert(battle.p2.active[0].hp < battle.p2.active[0].maxhp,
			'Sandy should let a spread Ground move hit its Flying-type target');
		assert.equal(battle.p2.active[1].hp, battle.p2.active[1].maxhp,
			'Sandy should preserve Levitate for a non-Flying target of the same spread move');
	});

	it('keeps Mega Shedinja at its declared fixed maximum HP', () => {
		const battle = common.createBattle({ formatid: 'gen3megascap' }, [
			[{ species: 'Shedinja', item: 'Shedinjite', ability: 'Wonder Guard', moves: ['splash'] }],
			[{ species: 'Snorlax', ability: 'Thick Fat', moves: ['splash'] }],
		]);
		battle.makeChoices('move splash mega', 'move splash');
		const shedinja = battle.p1.active[0];
		assert.equal(shedinja.species.name, 'Shedinja-Mega');
		assert.equal(shedinja.maxhp, 4);
		assert.equal(shedinja.hp, 4);
	});

	it('keeps Shady limited to bypassing the Normal immunity to Ghost', () => {
		const battle = common.createBattle({ formatid: 'gen3megascap' }, [
			[{ species: 'Noctowl-Mega', ability: 'Shady', moves: ['splash'] }],
			[{ species: 'Salamence', ability: 'Intimidate', moves: ['splash'] }],
		]);
		assert.equal(battle.p1.active[0].boosts.atk, -1,
			'Shady should not provide an undocumented Intimidate immunity');
	});

	it('gives the CAP Snow Warning hail recovery and hail immunity on top of summoning hail', () => {
		// gen3megascap buff (authorized for this mod only): the Snow Warning holder
		// heals 1/16 max HP per hail turn and takes no hail chip, in addition to
		// summoning indefinite Gen 3 hail on switch-in.
		const battle = common.createBattle({ formatid: 'gen3megascap' }, [
			[{ species: 'Walrein-Mega', ability: 'Snow Warning', moves: ['splash'] }],
			[{ species: 'Snorlax', ability: 'Thick Fat', moves: ['splash'] }],
		]);
		const walrein = battle.p1.active[0];
		walrein.sethp(walrein.maxhp - 64);
		const hpBeforeTurn = walrein.hp;
		battle.makeChoices('move splash', 'move splash');
		assert.equal(battle.field.weather, 'hail');
		assert.equal(battle.field.weatherState.duration, 0, 'ability-summoned Gen 3 hail should be indefinite');
		// A net HP gain proves both effects at once: the +1/16 heal landed and no
		// -1/16 hail chip was taken (otherwise the two would cancel to no change).
		assert(walrein.hp > hpBeforeTurn,
			'CAP Snow Warning should heal its holder under hail and grant hail immunity');
		assert(walrein.hp <= walrein.maxhp, 'Snow Warning recovery should not overheal past max HP');
		for (let turn = 0; turn < 5; turn++) {
			battle.makeChoices('move splash', 'move splash');
		}
		assert.equal(battle.field.weather, 'hail', 'Snow Warning hail should remain after five turns');

		// The hail immunity is tied to the ability, so any holder benefits (not just Ice-types).
		const nonIceBattle = common.createBattle({ formatid: 'gen3megascap' }, [
			[{ species: 'Snorlax', ability: 'Snow Warning', moves: ['splash'] }],
			[{ species: 'Walrein', ability: 'Thick Fat', moves: ['splash'] }],
		]);
		const nonIceUser = nonIceBattle.p1.active[0];
		nonIceUser.sethp(nonIceUser.maxhp - 64);
		const nonIceHP = nonIceUser.hp;
		nonIceBattle.makeChoices('move splash', 'move splash');
		assert(nonIceUser.hp > nonIceHP, 'CAP Snow Warning should heal any holder and shield it from hail chip');
	});

	it('keeps High Noon sun indefinite and grants Ground immunity', () => {
		const battle = common.createBattle({ formatid: 'gen3megascap' }, [
			[{ species: 'Solrock', item: 'Sole Rock', ability: 'Levitate', moves: ['splash'] }],
			[{ species: 'Snorlax', ability: 'Thick Fat', moves: ['earthquake'] }],
		]);
		battle.makeChoices('move splash mega', 'move earthquake');
		const solrock = battle.p1.active[0];
		assert.equal(solrock.ability, 'highnoon');
		assert.equal(solrock.hp, solrock.maxhp, 'High Noon should make its user immune to Ground');
		assert.equal(battle.field.weather, 'sunnyday');
		assert.equal(battle.field.weatherState.duration, 0, 'High Noon sun should be indefinite');
		for (let turn = 0; turn < 5; turn++) {
			battle.makeChoices('move splash', 'move earthquake');
		}
		assert.equal(battle.field.weather, 'sunnyday', 'High Noon sun should remain after five turns');
	});

	it('activates Mega Ditto\'s Imposter immediately after Mega Evolution', () => {
		const battle = common.createBattle({ formatid: 'gen3megascap' }, [
			[{ species: 'Ditto', item: 'Dittite', ability: 'Limber', moves: ['transform'] }],
			[{ species: 'Celebi', ability: 'Natural Cure', moves: ['recover'] }],
		]);
		battle.makeChoices('move transform mega', 'move recover');
		const imposterTransform = battle.log.findIndex(line =>
			line.startsWith('|-transform|p1a: Ditto|p2a: Celebi|[from] ability: Imposter'));
		const dittoAction = battle.log.findIndex(line =>
			line.startsWith('|move|p1a: Ditto|') || line.startsWith('|cant|p1a: Ditto|'));
		assert(imposterTransform >= 0 && imposterTransform < dittoAction,
			'Mega Ditto should transform through Imposter before taking its move');
	});

	it('allows Magcargo to Mega Evolve in the CAP format', () => {
		const errors = TeamValidator.get('gen3megascap').validateTeam([
			{
				species: 'Magcargo', item: 'Magcargoite', ability: 'Magma Armor',
				moves: ['flamethrower', 'earthquake', 'rockslide', 'protect'], evs: { hp: 1 },
			},
		]);
		assert(!errors, `expected Mega Magcargo to be legal, got: ${JSON.stringify(errors)}`);
	});

	it('Mega Evolves Magcargo into its CAP forme', () => {
		const battle = common.createBattle({ formatid: 'gen3megascap' }, [
			[{ species: 'Magcargo', item: 'Magcargoite', ability: 'Magma Armor', moves: ['flamethrower'] }],
			[{ species: 'Snorlax', ability: 'Thick Fat', moves: ['tackle'] }],
		]);
		battle.makeChoices('move flamethrower mega', 'move tackle');
		assert.equal(battle.p1.active[0].species.name, 'Magcargo-Mega');
		assert.equal(battle.p1.active[0].ability, 'eartheater');
	});
});
