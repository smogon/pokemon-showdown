/**
 * Test battle for EXP and Leveling System
 *
 * This test creates a battle where a low-level Pokemon defeats
 * another Pokemon and gains experience, potentially leveling up.
 */

import { Battle } from '../battle';

async function testExpLeveling() {
	console.log('=== Testing EXP and Leveling System ===\n');

	// Create battle with a level 5 Charmander vs level 3 Pidgey
	const battle = new Battle({
		formatid: 'gen9customgame' as ID,
		p1: {
			name: 'Player 1',
			team: [{
				name: 'Charmander',
				species: 'Charmander',
				level: 5,
				moves: ['scratch', 'growl'],
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
				level: 3,
				moves: ['tackle', 'sandattack'],
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
	console.log(`  ${charmander.name}: Level ${charmander.level}, EXP: ${charmander.experience}, HP: ${charmander.hp}/${charmander.maxhp}`);
	console.log(`  ${pidgey.name}: Level ${pidgey.level}, HP: ${pidgey.hp}/${pidgey.maxhp}\n`);

	// Attack until Pidgey faints
	let turns = 0;
	while (!battle.ended && turns < 10) {
		turns++;
		console.log(`Turn ${turns}:`);
		battle.makeChoices('move scratch', 'move tackle');

		if (pidgey.fainted) {
			console.log(`  ${pidgey.name} fainted!\n`);
			break;
		}
	}

	// Check results
	console.log(`Final State:`);
	console.log(`  ${charmander.name}: Level ${charmander.level}, EXP: ${charmander.experience}`);
	console.log(`  HP: ${charmander.hp}/${charmander.maxhp}`);
	console.log(`  Stats: ATK ${charmander.storedStats.atk}, DEF ${charmander.storedStats.def}, SPE ${charmander.storedStats.spe}`);
	console.log(`  EXP to next level: ${charmander.expToNextLevel}\n`);

	console.log('=== Battle Log ===');
	console.log(battle.log.join('\n'));

	return battle;
}

// Run test
if (require.main === module) {
	testExpLeveling().then(battle => {
		console.log('\n=== Test Complete ===');
		process.exit(0);
	}).catch(err => {
		console.error('Test failed:', err);
		process.exit(1);
	});
}

export { testExpLeveling };
