/**
 * Test battle for Evolution System
 *
 * This test creates a battle where a Pokemon levels up
 * and evolves (Charmander → Charmeleon at level 16).
 */

import { Battle } from '../battle';

async function testEvolution() {
	console.log('=== Testing Evolution System ===\n');

	// Create battle with a level 15 Charmander (close to evolution) vs level 10 Pidgey
	const battle = new Battle({
		formatid: 'gen9customgame' as ID,
		p1: {
			name: 'Player 1',
			team: [{
				name: 'Charmander',
				species: 'Charmander',
				level: 15,
				moves: ['scratch', 'ember', 'smokescreen'],
				ability: 'Blaze',
				evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
				ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
				nature: 'Adamant',
				gender: 'M',
				item: '',
			}],
		},
		p2: {
			name: 'Wild Pokemon',
			team: [{
				name: 'Pidgey',
				species: 'Pidgey',
				level: 10,
				moves: ['tackle', 'sandattack', 'gust'],
				ability: 'Keen Eye',
				evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
				ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
				nature: 'Hardy',
				gender: 'F',
				item: '',
			}],
		},
	});

	// Start battle
	console.log('Starting battle...\n');
	battle.start();

	const charmander = battle.sides[0].pokemon[0];
	const pidgey = battle.sides[1].pokemon[0];

	console.log(`Initial State:`);
	console.log(`  ${charmander.name}: ${charmander.species.name}, Level ${charmander.level}`);
	console.log(`  HP: ${charmander.hp}/${charmander.maxhp}`);
	console.log(`  Stats: ATK ${charmander.storedStats.atk}, SPA ${charmander.storedStats.spa}`);
	console.log(`  Moves: ${charmander.moveSlots.map(m => m.move).join(', ')}`);
	console.log(`  EXP: ${charmander.experience}, EXP to next: ${charmander.expToNextLevel}`);
	console.log(`\n  ${pidgey.name}: Level ${pidgey.level}, HP: ${pidgey.hp}/${pidgey.maxhp}\n`);

	console.log(`Charmander evolves at level 16!\n`);

	// Attack until Pidgey faints
	let turns = 0;
	while (!battle.ended && turns < 10) {
		turns++;
		console.log(`Turn ${turns}:`);
		battle.makeChoices('move ember', 'move tackle');

		if (pidgey.fainted) {
			console.log(`  ${pidgey.name} fainted!\n`);
			break;
		}
	}

	// Check results
	console.log(`Final State:`);
	console.log(`  Pokemon: ${charmander.species.name} (${charmander.name})`);
	console.log(`  Level: ${charmander.level}`);
	console.log(`  HP: ${charmander.hp}/${charmander.maxhp}`);
	console.log(`  Stats: ATK ${charmander.storedStats.atk}, SPA ${charmander.storedStats.spa}, SPE ${charmander.storedStats.spe}`);
	console.log(`  Moves: ${charmander.moveSlots.map(m => m.move).join(', ')}`);
	console.log(`  EXP: ${charmander.experience}, EXP to next: ${charmander.expToNextLevel}`);

	if (charmander.species.name === 'Charmeleon') {
		console.log(`\n✅ SUCCESS: Charmander evolved into Charmeleon!`);
	} else {
		console.log(`\n❌ Evolution did not occur. Still ${charmander.species.name}`);
	}

	console.log('\n=== Battle Log ===');
	console.log(battle.log.join('\n'));

	return battle;
}

// Run test
if (require.main === module) {
	testEvolution().then(battle => {
		console.log('\n=== Test Complete ===');
		process.exit(0);
	}).catch(err => {
		console.error('Test failed:', err);
		process.exit(1);
	});
}

export { testEvolution };
