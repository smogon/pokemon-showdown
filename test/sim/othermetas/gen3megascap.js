'use strict';

const assert = require('./../../assert');
const common = require('./../../common');
const Dex = require('./../../../dist/sim').Dex;
const { TeamValidator } = require('./../../../dist/sim/team-validator');

const v8Megas = {
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

describe('[Gen 3] Megas CAP', () => {
	it('keeps its custom data isolated from [Gen 3] Megas', () => {
		const capDex = Dex.mod('gen3megascap');
		const megaDex = Dex.mod('gen3mega');

		assert.equal(capDex.species.get('magcargomega').name, 'Magcargo-Mega');
		assert.equal(capDex.species.get('magcargomega').tier, 'OU');
		assert.equal(capDex.items.get('magcargoite').megaStone.Magcargo, 'Magcargo-Mega');
		assert.equal(capDex.species.get('zangoose').tier, 'OU');
		assert.equal(megaDex.species.get('magcargomega').isNonstandard, 'Future',
			'Mega Magcargo must remain unavailable in [Gen 3] Megas');
		assert.equal(megaDex.items.get('magcargoite').isNonstandard, 'Future',
			'Magcargoite must remain unavailable in [Gen 3] Megas');
		assert.equal(megaDex.species.get('zangoose').tier, 'UU');
	});

	it('loads Archie\'s expanded CAP Mega roster, stones, and abilities', () => {
		const dex = Dex.mod('gen3megascap');
		const megas = {
			parasectmega: ['Parasectite', 'Perish Body'],
			hitmonchanmega: ['Hitmonchanite', 'Iron Fist'],
			dittomega: ['Dittite', 'Imposter'],
			noctowlmega: ['Noctite', 'Shady'],
			mantinemega: ['Mantite', 'Dragonize'],
			mightyenamegax: ['Mightyenite X', 'Tough Claws'],
			mightyenamegay: ['Mightyenite Y', 'Intimidate'],
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
			{ hp: 90, atk: 10, def: 90, spa: 110, spd: 90, spe: 110 });
		assert.deepEqual(dex.species.get('beautiflymega').types, ['Grass', 'Flying']);
		assert.deepEqual(Dex.mod('gen3mega').species.get('beautiflymega').types, ['Bug', 'Psychic'],
			'the global future placeholder must retain its original typing');
		assert.equal(Dex.mod('gen3mega').species.get('parasectmega').isNonstandard, 'Future');
	});

	it('marks every v8 CAP-added Mega OU and links it to its base species and stone', () => {
		const dex = Dex.mod('gen3megascap');
		for (const [id, [baseName, itemName]] of Object.entries(v8Megas)) {
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

	it('allows every v8 CAP-added Mega in the format', () => {
		const dex = Dex.mod('gen3megascap');
		for (const [id, [baseName, itemName]] of Object.entries(v8Megas)) {
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
