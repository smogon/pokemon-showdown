/**
 * Test battle for EXP, Leveling, and Move Learning System
 *
 * This test creates a battle where a low-level Pokemon defeats
 * another Pokemon, gains experience, levels up, and learns new moves.
 */

import { Battle } from '../battle';

async function testExpLeveling() {
	console.log('=== Testing EXP, Leveling, and Move Learning System ===\n');

	// Create battle with a level 5 Charmander (with only 2 moves) vs level 3 Pidgey
	const battle = new Battle({
		formatid: 'gen9customgame' as ID,
		p1: {
			name: 'Player 1',
			team: [{
				name: 'Charmander',
				species: 'Charmander',
				level: 5,
				moves: ['scratch', 'growl'], // Charmander learns Ember at level 7
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

	// Battle auto-starts in constructor
	console.log('Battle started!\n');

	const charmander = battle.sides[0].pokemon[0];
	const pidgey = battle.sides[1].pokemon[0];

	console.log(`Initial State:`);
	console.log(`  ${charmander.name}: Level ${charmander.level}, EXP: ${charmander.experience}`);
	console.log(`  HP: ${charmander.hp}/${charmander.maxhp}`);
	console.log(`  Moves: ${charmander.moveSlots.map(m => m.move).join(', ')}`);
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
	console.log(`  Moves: ${charmander.moveSlots.map(m => m.move).join(', ')} (${charmander.moveSlots.length}/4 slots)`);
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
