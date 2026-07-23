'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

const { Dex } = require('./../../../dist/sim');
const { TeamValidator } = require('./../../../dist/sim/team-validator');

Dex.includeFormats();

const MEGA_FORMES = [
	'venusaurmega', 'charizardmegax', 'charizardmegay', 'blastoisemega', 'beedrillmega',
	'pidgeotmega', 'raichumegax', 'raichumegay', 'clefablemega', 'alakazammega',
	'victreebelmega', 'slowbromega', 'gengarmega', 'kangaskhanmega', 'starmiemega',
	'pinsirmega', 'gyaradosmega', 'aerodactylmega', 'dragonitemega', 'mewtwomegax',
	'mewtwomegay', 'meganiummega', 'feraligatrmega', 'ampharosmega', 'steelixmega',
	'scizormega', 'heracrossmega', 'skarmorymega', 'houndoommega', 'tyranitarmega',
	'sceptilemega', 'blazikenmega', 'swampertmega', 'gardevoirmega', 'sableyemega',
	'mawilemega', 'aggronmega', 'medichammega', 'manectricmega', 'sharpedomega',
	'cameruptmega', 'altariamega', 'banettemega', 'chimechomega', 'absolmega',
	'glaliemega', 'salamencemega', 'metagrossmega', 'latiasmega', 'latiosmega',
	'kyogreprimal', 'groudonprimal', 'staraptormega', 'lopunnymega', 'garchompmega',
	'lucariomega', 'abomasnowmega', 'gallademega', 'froslassmega',
];

const MEGA_ITEMS = [
	'venusaurite', 'charizarditex', 'charizarditey', 'blastoisinite', 'beedrillite',
	'pidgeotite', 'raichunitex', 'raichunitey', 'clefablite', 'alakazite',
	'victreebelite', 'slowbronite', 'gengarite', 'kangaskhanite', 'starminite',
	'pinsirite', 'gyaradosite', 'aerodactylite', 'dragoninite', 'mewtwonitex',
	'mewtwonitey', 'meganiumite', 'feraligite', 'ampharosite', 'steelixite',
	'scizorite', 'heracronite', 'skarmorite', 'houndoominite', 'tyranitarite',
	'sceptilite', 'blazikenite', 'swampertite', 'gardevoirite', 'sablenite',
	'mawilite', 'aggronite', 'medichamite', 'manectite', 'sharpedonite',
	'cameruptite', 'altarianite', 'banettite', 'chimechite', 'absolite',
	'glalitite', 'salamencite', 'metagrossite', 'latiasite', 'latiosite',
	'blueorb', 'redorb', 'staraptite', 'lopunnite', 'garchompite', 'lucarionite',
	'abomasite', 'galladite', 'froslassite',
];

describe('[Gen 4] Megas', () => {
	const dex = Dex.mod('gen4mega');

	it('registers only the OU format', () => {
		const sectionFormats = Dex.formats.all()
			.filter(format => format.section === 'Gen 4 Megas')
			.map(format => format.id);
		assert.deepEqual(sectionFormats, ['gen4megas']);

		const format = Dex.formats.get('gen4megas', true);
		assert.equal(format.mod, 'gen4mega');
		assert.equal(format.gameType, 'singles');
		const ruleTable = Dex.formats.getRuleTable(format);
		assert(ruleTable.has('gen4ou'));
		assert(ruleTable.has('megarayquazaclause'));
		assert(ruleTable.has('modernmegaspeedmod'));
	});

	it('backports the selected 59-form roster and its items', () => {
		assert.equal(new Set(MEGA_FORMES).size, 59);
		const expectedFormes = new Set(MEGA_FORMES);
		const expectedItems = new Set(MEGA_ITEMS);
		for (const id of MEGA_FORMES) {
			const species = dex.species.get(id);
			assert(species.exists, `${id} should exist`);
			assert.equal(species.gen, 4, `${species.name} should resolve as Gen 4`);
			assert.equal(species.isNonstandard, null, `${species.name} should be standard`);
			assert.notEqual(species.tier, 'Illegal', `${species.name} should have a usable tier`);
			const baseSpecies = dex.species.get(species.baseSpecies);
			assert(baseSpecies.gen <= 4, `${species.name} has a post-Gen-4 base species`);
			assert(baseSpecies.otherFormes.includes(species.name), `${baseSpecies.name} does not link to ${species.name}`);
			for (const type of species.types) {
				assert.equal(dex.types.get(type).isNonstandard, null, `${species.name} has illegal type ${type}`);
			}
			for (const abilityName of Object.values(species.abilities)) {
				const ability = dex.abilities.get(abilityName);
				assert(ability.exists, `${species.name} has missing ability ${abilityName}`);
				assert.equal(ability.isNonstandard, null, `${species.name} has illegal ability ${abilityName}`);
			}

			const requiredItems = species.requiredItems || [];
			assert.equal(requiredItems.length, 1, `${species.name} should require exactly one item`);
			const requiredItem = dex.items.get(requiredItems[0]);
			if (species.isPrimal) {
				assert(requiredItem.isPrimalOrb, `${species.name} should require a Primal Orb`);
			} else {
				assert.equal(
					requiredItem.megaStone?.[species.baseSpecies],
					species.name,
					`${requiredItem.name} should map ${species.baseSpecies} back to ${species.name}`
				);
			}
		}
		for (const id of MEGA_ITEMS) {
			const item = dex.items.get(id);
			assert(item.exists, `${id} should exist`);
			assert.equal(item.gen, 4, `${item.name} should resolve as Gen 4`);
			assert.equal(item.isNonstandard, null, `${item.name} should be standard`);
		}
		const legalFormes = dex.species.all().filter(species => (
			(species.isMega || species.isPrimal) && species.isNonstandard === null && species.tier !== 'Illegal'
		));
		assert.deepEqual(new Set(legalFormes.map(species => species.id)), expectedFormes);
		const legalItems = dex.items.all().filter(item => (
			(item.megaStone || item.isPrimalOrb) && item.isNonstandard === null && item.gen <= 4
		));
		assert.deepEqual(new Set(legalItems.map(item => item.id)), expectedItems);
	});

	it('does not broadly legalize Future or Legends: Z-A-only formes', () => {
		for (const id of ['rayquazamega', 'absolmegaz', 'garchompmegaz', 'heatranmega']) {
			const species = dex.species.get(id);
			assert(species.gen > 4, `${species.name} should retain its source generation`);
			assert.equal(species.tier, 'Illegal', `${species.name} should stay illegal`);
		}
		for (const id of ['absolitez', 'garchompitez', 'heatranite']) {
			assert(dex.items.get(id).gen > 4, `${id} should not be backported`);
		}
	});

	it('adapts Fairy and terrain-dependent formes without adding either subsystem', () => {
		assert.deepEqual(dex.species.get('clefablemega').types, ['Normal', 'Flying']);
		assert.deepEqual(dex.species.get('gardevoirmega').types, ['Psychic']);
		assert.deepEqual(dex.species.get('mawilemega').types, ['Steel']);
		assert.deepEqual(dex.species.get('altariamega').types, ['Dragon', 'Flying']);
		assert.equal(dex.species.get('gardevoirmega').abilities[0], 'Trace');
		assert.equal(dex.species.get('altariamega').abilities[0], 'Natural Cure');
		assert.equal(dex.species.get('raichumegax').abilities[0], 'Static');
	});

	it('does not contaminate any vanilla Gen 4 base-form ability table', () => {
		const gen4 = Dex.mod('gen4');
		for (const species of gen4.species.all()) {
			if (species.gen > 4 || species.isMega || species.isPrimal) continue;
			assert.deepEqual(
				dex.species.get(species.id).abilities,
				species.abilities,
				`${species.name}'s abilities changed in gen4mega`
			);
		}
	});

	it('keeps Gen 4 legality while allowing the selected Mega stones', () => {
		assert.legalTeam([
			{
				species: 'Staraptor', ability: 'Intimidate', item: 'Staraptite',
				moves: ['closecombat', 'bravebird', 'return', 'uturn'], evs: { hp: 4 },
			},
			{
				species: 'Gallade', ability: 'Steadfast', item: 'Galladite',
				moves: ['closecombat', 'psychocut', 'nightslash', 'swordsdance'], evs: { hp: 4 },
			},
			{
				species: 'Lopunny', ability: 'Cute Charm', item: 'Lopunnite',
				moves: ['return', 'jumpkick', 'fakeout', 'icepunch'], evs: { hp: 4 },
			},
		], 'gen4megas');

		const futureMove = TeamValidator.get('gen4megas').validateTeam([{
			species: 'Lucario', ability: 'Inner Focus', item: 'Lucarionite',
			moves: ['poweruppunch', 'closecombat'], evs: { hp: 4 },
		}]);
		assert(futureMove && futureMove.some(problem => /Power-Up Punch/.test(problem)));

		assert.legalTeam([{
			species: 'Gyarados-Mega', ability: 'Intimidate', item: 'Gyaradosite',
			moves: ['dragondance', 'waterfall', 'earthquake', 'icefang'], evs: { hp: 4 },
		}], 'gen4megas');
	});

	it('keeps the inherited OU safety boundary', () => {
		const garchomp = {
			species: 'Garchomp', ability: 'Sand Veil', item: 'Garchompite',
			moves: ['earthquake', 'outrage', 'swordsdance', 'firefang'], evs: { hp: 4 },
		};
		const ouProblems = TeamValidator.get('gen4megas').validateTeam([garchomp]);
		assert(ouProblems && ouProblems.some(problem => /Uber/.test(problem)));

		const lucario = {
			species: 'Lucario', ability: 'Inner Focus', item: 'Lucarionite',
			moves: ['closecombat', 'extremespeed', 'crunch', 'swordsdance'], evs: { hp: 4 },
		};
		const lucarioProblems = TeamValidator.get('gen4megas').validateTeam([lucario]);
		assert(lucarioProblems && lucarioProblems.some(problem => /Uber/.test(problem)));

		const salamence = {
			species: 'Salamence', ability: 'Intimidate', item: 'Salamencite',
			moves: ['dragondance', 'outrage', 'earthquake', 'roost'], evs: { hp: 4 },
		};
		const salamenceProblems = TeamValidator.get('gen4megas').validateTeam([salamence]);
		assert(salamenceProblems && salamenceProblems.some(problem => /Salamence/.test(problem)));

		const froslassProblems = TeamValidator.get('gen4megas').validateTeam([{
			species: 'Froslass', ability: 'Snow Cloak', item: 'Froslassite',
			moves: ['icebeam', 'shadowball', 'spikes', 'destinybond'], evs: { hp: 4 },
		}]);
		assert(froslassProblems && froslassProblems.some(problem => /Froslass|Uber|Snow Cloak/.test(problem)));
	});

	it('enforces the Mega-specific OU combination safeguards', () => {
		const kangaskhan = {
			species: 'Kangaskhan', ability: 'Early Bird', item: 'Kangaskhanite',
			moves: ['seismictoss', 'return', 'earthquake', 'suckerpunch'], evs: { hp: 4 },
		};
		const parentalBond = TeamValidator.get('gen4megas').validateTeam([kangaskhan]);
		assert(parentalBond && parentalBond.some(problem => /Parental Bond.*Seismic Toss/.test(problem)));

		const raichu = {
			species: 'Raichu', ability: 'Static', item: 'Raichunite Y',
			moves: ['dynamicpunch', 'thunderbolt', 'focusblast', 'encore'], evs: { hp: 4 },
		};
		const noGuard = TeamValidator.get('gen4megas').validateTeam([raichu]);
		assert(noGuard && noGuard.some(problem => /No Guard.*Dynamic Punch/.test(problem)));
	});

	it('fires the acquired ability exactly once on Mega Evolution', () => {
		const battle = common.createBattle({ formatid: 'gen4megas' }, [
			[{ species: 'Manectric', ability: 'Static', item: 'Manectite', moves: ['thunderbolt'] }],
			[{ species: 'Snorlax', ability: 'Thick Fat', moves: ['tackle'] }],
		]);
		battle.makeChoices('move thunderbolt mega', 'move tackle');
		assert.species(battle.p1.active[0], 'Manectric-Mega');
		assert.equal(battle.p2.active[0].boosts.atk, -1, 'Intimidate should start once, not zero or twice');
		battle.destroy();
	});

	it('uses the Mega forme Speed on the turn it evolves', () => {
		const battle = common.createBattle({ formatid: 'gen4megas' }, [
			[{ species: 'Beedrill', ability: 'Swarm', item: 'Beedrillite', moves: ['xscissor'] }],
			[{ species: 'Starmie', ability: 'Natural Cure', moves: ['surf'] }],
		]);
		battle.makeChoices('move xscissor mega', 'move surf');
		const firstMove = battle.log.find(line => line.startsWith('|move|'));
		assert(firstMove.includes('p1a: Beedrill'), `Mega Beedrill should move first, got: ${firstMove}`);
		battle.destroy();
	});

	it('also applies a Mega forme Speed decrease on the evolution turn', () => {
		const battle = common.createBattle({ formatid: 'gen4megas' }, [
			[{ species: 'Garchomp', ability: 'Sand Veil', item: 'Garchompite', moves: ['dragonclaw'] }],
			[{ species: 'Flygon', ability: 'Levitate', moves: ['dragonclaw'] }],
		]);
		assert(battle.p1.active[0].getStat('spe') > battle.p2.active[0].getStat('spe'));
		battle.makeChoices('move dragonclaw mega', 'move dragonclaw');
		const firstMove = battle.log.find(line => line.startsWith('|move|'));
		assert(firstMove.includes('p2a: Flygon'), `Flygon should pass Mega Garchomp, got: ${firstMove}`);
		battle.destroy();
	});

	it('recalculates an acquired priority ability on the Mega turn', () => {
		const battle = common.createBattle({ formatid: 'gen4megas' }, [
			[{ species: 'Banette', ability: 'Insomnia', item: 'Banettite', moves: ['willowisp'] }],
			[{ species: 'Aerodactyl', ability: 'Pressure', moves: ['taunt'] }],
		]);
		battle.makeChoices('move willowisp mega', 'move taunt');
		const firstMove = battle.log.find(line => line.startsWith('|move|'));
		assert(firstMove.includes('p1a: Banette'), `Prankster Mega Banette should move first, got: ${firstMove}`);
		assert.equal(battle.p2.active[0].status, 'brn');
		battle.destroy();
	});

	it('allows only one Mega Evolution per side', () => {
		const battle = common.createBattle({ formatid: 'gen4megas' }, [
			[
				{ species: 'Beedrill', ability: 'Swarm', item: 'Beedrillite', moves: ['protect'] },
				{ species: 'Manectric', ability: 'Static', item: 'Manectite', moves: ['protect'] },
			],
			[{ species: 'Snorlax', ability: 'Thick Fat', moves: ['tackle'] }],
		]);
		battle.makeChoices('move protect mega', 'move tackle');
		battle.makeChoices('switch 2', 'move tackle');
		assert.equal(battle.p1.active[0].canMegaEvo, false);
		battle.destroy();
	});

	it('Mega Evolves a Pursuit user before intercepting a switch', () => {
		const battle = common.createBattle({ formatid: 'gen4megas' }, [
			[{ species: 'Beedrill', ability: 'Swarm', item: 'Beedrillite', moves: ['pursuit'] }],
			[
				{ species: 'Alakazam', ability: 'Synchronize', moves: ['psychic'] },
				{ species: 'Clefable', ability: 'Magic Guard', moves: ['calmmind'] },
			],
		]);
		const alakazam = battle.p2.active[0];
		battle.makeChoices('move pursuit mega', 'switch 2');
		assert.species(battle.p1.active[0], 'Beedrill-Mega');
		assert(alakazam.hp < alakazam.maxhp, 'Pursuit should hit Alakazam before it switches');
		assert.species(battle.p2.active[0], 'Clefable');
		battle.destroy();
	});

	it('protects a correctly held Mega Stone from Trick and Knock Off', () => {
		for (const move of ['trick', 'knockoff']) {
			const battle = common.createBattle({ formatid: 'gen4megas' }, [
				[{ species: 'Mew', ability: 'Synchronize', item: 'Leftovers', moves: [move] }],
				[{ species: 'Scizor', ability: 'Technician', item: 'Scizorite', moves: ['swordsdance'] }],
			]);
			battle.makeChoices(`move ${move}`, 'move swordsdance');
			assert.equal(battle.p2.active[0].item, 'scizorite');
			battle.destroy();
		}
	});

	it('preserves Chimecho\'s absolute HP deficit when its Mega forme gains base HP', () => {
		const battle = common.createBattle({ formatid: 'gen4megas' }, [
			[{ species: 'Chimecho', ability: 'Levitate', item: 'Chimechite', moves: ['protect'] }],
			[{ species: 'Magikarp', ability: 'Swift Swim', moves: ['splash'] }],
		]);
		const chimecho = battle.p1.active[0];
		const oldMaxhp = chimecho.maxhp;
		const hpDeficit = 47;
		chimecho.hp -= hpDeficit;
		battle.makeChoices('move protect mega', 'move splash');
		assert.species(chimecho, 'Chimecho-Mega');
		assert(chimecho.maxhp > oldMaxhp, 'Mega Chimecho should gain maximum HP');
		assert.equal(chimecho.maxhp - chimecho.hp, hpDeficit);
		battle.destroy();
	});

	it('applies Primal Reversion and its weather on switch-in', () => {
		const battle = common.createBattle({ formatid: 'gen4megas' }, [
			[{ species: 'Groudon', ability: 'Drought', item: 'Red Orb', moves: ['earthquake'] }],
			[{ species: 'Snorlax', ability: 'Thick Fat', moves: ['tackle'] }],
		]);
		assert.species(battle.p1.active[0], 'Groudon-Primal');
		assert.equal(battle.p1.active[0].ability, 'desolateland');
		assert.equal(battle.field.weather, 'desolateland');
		battle.destroy();
	});

	it('keeps Primal Reversion independent from the side\'s selected Mega Evolution', () => {
		const battle = common.createBattle({ formatid: 'gen4megas' }, [
			[
				{ species: 'Groudon', ability: 'Drought', item: 'Red Orb', moves: ['protect'] },
				{ species: 'Beedrill', ability: 'Swarm', item: 'Beedrillite', moves: ['xscissor'] },
			],
			[{ species: 'Snorlax', ability: 'Thick Fat', moves: ['tackle'] }],
		]);
		const groudon = battle.p1.active[0];
		assert.species(groudon, 'Groudon-Primal');
		battle.makeChoices('switch 2', 'move tackle');
		assert(battle.p1.active[0].canMegaEvo);
		battle.makeChoices('move xscissor mega', 'move tackle');
		assert.species(groudon, 'Groudon-Primal');
		assert.species(battle.p1.active[0], 'Beedrill-Mega');
		battle.destroy();
	});

	it('keeps Mega Rayquaza illegal and disables its runtime evolution path', () => {
		const problems = TeamValidator.get('gen4megas').validateTeam([{
			species: 'Rayquaza-Mega', ability: 'Delta Stream', moves: ['dragonascent'], evs: { hp: 4 },
		}]);
		assert(problems && problems.some(problem => /Rayquaza-Mega/.test(problem)));

		const battle = common.createBattle({ formatid: 'gen4megas' }, [
			[{ species: 'Rayquaza', ability: 'Air Lock', moves: ['dragonascent'] }],
			[{ species: 'Snorlax', ability: 'Thick Fat', moves: ['tackle'] }],
		]);
		assert.equal(battle.p1.active[0].canMegaEvo, null);
		battle.destroy();
	});

	it('applies Parental Bond\'s modern 25% second strike in the Gen 4 damage pipeline', () => {
		const battle = common.createBattle({ formatid: 'gen4megas' }, [
			[{ species: 'Kangaskhan', ability: 'Early Bird', item: 'Kangaskhanite', moves: ['tackle'] }],
			[{ species: 'Blissey', ability: 'Natural Cure', moves: ['softboiled'] }],
		]);
		const blissey = battle.p2.active[0];
		const initialHp = blissey.hp;
		battle.makeChoices('move tackle mega', 'move softboiled');
		const remainingHp = battle.log
			.filter(line => line.startsWith('|-damage|p2a: Blissey|'))
			.map(line => line.split('|')[3].split('/').map(Number))
			.filter(([, maxhp]) => maxhp === blissey.maxhp)
			.map(([hp]) => hp);
		assert.equal(remainingHp.length, 2, `expected two exact damage entries, got ${remainingHp}`);
		const firstHit = initialHp - remainingHp[0];
		const secondHit = remainingHp[0] - remainingHp[1];
		assert(
			secondHit >= Math.floor(firstHit * 0.2) && secondHit <= Math.ceil(firstHit * 0.3),
			`expected a quarter-strength second hit, got ${firstHit} then ${secondHit}`
		);
		battle.destroy();
	});

	it('retypes -ate moves without undoing the Gen 4 physical/special split', () => {
		const cases = [
			['Glalie', 'Inner Focus', 'Glalitite', 'Ice'],
			['Feraligatr', 'Torrent', 'Feraligite', 'Dragon'],
		];
		for (const [species, ability, item, type] of cases) {
			const battle = common.createBattle({ formatid: 'gen4megas' }, [
				[{ species, ability, item, moves: ['doubleedge'] }],
				[{ species: 'Snorlax', ability: 'Thick Fat', moves: ['tackle'] }],
			]);
			battle.makeChoices('move doubleedge mega', 'move tackle');
			const move = battle.p1.active[0].lastMoveUsed;
			assert.equal(move.type, type);
			assert.equal(move.category, 'Physical', `Gen 4 keeps Double-Edge physical after ${ability}`);
			battle.destroy();
		}
	});

	it('pins the modern -ate and Parental Bond damage modifiers', () => {
		function capture(handler, effect, move) {
			let modifier = null;
			handler.call({
				effect,
				chainModify(value) {
					modifier = value;
					return value;
				},
			}, 100, {}, {}, move);
			return modifier;
		}

		for (const id of ['aerilate', 'refrigerate', 'dragonize']) {
			const ability = dex.abilities.get(id);
			assert.deepEqual(
				capture(ability.onBasePower, ability, { typeChangerBoosted: ability }),
				[4915, 4096]
			);
		}
		const parentalBond = dex.abilities.get('parentalbond');
		assert.deepEqual(
			capture(parentalBond.onModifyDamage, parentalBond, { multihitType: 'parentalbond', hit: 2 }),
			[1024, 4096]
		);
	});
});
