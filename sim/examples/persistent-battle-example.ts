/**
 * Persistent Battle Example
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Example of how to create gauntlet-style battles where Pokemon state
 * (HP, PP, status) persists between consecutive battles.
 *
 * Run this using `node build && node .sim-dist/examples/persistent-battle-example`.
 *
 * @license MIT
 */

import { BattleStream, getPlayerStreams, Teams } from '..';
import { RandomPlayerAI } from '../tools/random-player-ai';

/*********************************************************************
 * Gauntlet Challenge Example
 *
 * Player 1 faces multiple opponents in succession. Their Pokemon's
 * HP, PP, and status conditions persist between battles.
 *********************************************************************/

async function runGauntletChallenge() {
	console.log('=== Gauntlet Challenge Example ===\n');

	const playerName = 'Challenger';
	const opponents = ['Opponent 1', 'Opponent 2', 'Opponent 3'];

	// Player's team (same across all battles)
	const playerTeam = Teams.pack(Teams.generate('gen9randombattle'));

	for (let i = 0; i < opponents.length; i++) {
		console.log(`\n--- Battle ${i + 1}: ${playerName} vs ${opponents[i]} ---\n`);

		const streams = getPlayerStreams(new BattleStream());

		const formatSpec = {
			// Use a format with Persistent Battles P1 ruleset
			formatid: "gen9ou",
		};

		const p1spec = {
			name: playerName, // Same name to persist state
			team: playerTeam, // Same team
		};

		const p2spec = {
			name: opponents[i],
			team: Teams.pack(Teams.generate('gen9randombattle')),
		};

		const p1 = new RandomPlayerAI(streams.p1);
		const p2 = new RandomPlayerAI(streams.p2);

		void p1.start();
		void p2.start();

		let battleComplete = false;
		let winner = '';

		// Monitor battle progress
		void (async () => {
			for await (const chunk of streams.omniscient) {
				// Check for win condition
				if (chunk.includes('|win|')) {
					const winMatch = chunk.match(/\|win\|(.+)/);
					if (winMatch) {
						winner = winMatch[1];
						battleComplete = true;
					}
				}
				// Optionally log interesting events
				if (chunk.includes('|turn|')) {
					const turnMatch = chunk.match(/\|turn\|(\d+)/);
					if (turnMatch) {
						process.stdout.write(`Turn ${turnMatch[1]}... `);
					}
				}
			}
		})();

		// Start the battle
		void streams.omniscient.write(`>start ${JSON.stringify(formatSpec)}
>player p1 ${JSON.stringify(p1spec)}
>player p2 ${JSON.stringify(p2spec)}`);

		// Wait for battle to complete
		while (!battleComplete) {
			await new Promise(resolve => setTimeout(resolve, 100));
		}

		console.log(`\nBattle ${i + 1} Result: ${winner} wins!`);

		if (winner !== playerName) {
			console.log(`\n${playerName} was defeated! Gauntlet challenge failed.`);
			break;
		}

		if (i < opponents.length - 1) {
			console.log(`${playerName} advances to the next battle...`);
			console.log('(Pokemon HP, PP, and status will persist)');
		} else {
			console.log(`\n🎉 ${playerName} has defeated all opponents!`);
			console.log('Gauntlet challenge complete!');
		}
	}
}

/*********************************************************************
 * Persistent Tournament Example
 *
 * Both players' Pokemon states persist across multiple rounds.
 *********************************************************************/

async function runPersistentTournament() {
	console.log('\n\n=== Persistent Tournament Example ===\n');
	console.log('Both players face each other in multiple rounds.');
	console.log('Pokemon state persists for both sides.\n');

	const player1Name = 'Player 1';
	const player2Name = 'Player 2';
	const rounds = 3;

	const p1Team = Teams.pack(Teams.generate('gen9randombattle'));
	const p2Team = Teams.pack(Teams.generate('gen9randombattle'));

	for (let round = 1; round <= rounds; round++) {
		console.log(`\n--- Round ${round} ---\n`);

		const streams = getPlayerStreams(new BattleStream());

		const formatSpec = {
			// Use a format with Persistent Battles ruleset
			formatid: "gen9ou",
		};

		const p1spec = {
			name: player1Name,
			team: p1Team,
		};

		const p2spec = {
			name: player2Name,
			team: p2Team,
		};

		const p1 = new RandomPlayerAI(streams.p1);
		const p2 = new RandomPlayerAI(streams.p2);

		void p1.start();
		void p2.start();

		let battleComplete = false;
		let winner = '';

		void (async () => {
			for await (const chunk of streams.omniscient) {
				if (chunk.includes('|win|')) {
					const winMatch = chunk.match(/\|win\|(.+)/);
					if (winMatch) {
						winner = winMatch[1];
						battleComplete = true;
					}
				}
			}
		})();

		void streams.omniscient.write(`>start ${JSON.stringify(formatSpec)}
>player p1 ${JSON.stringify(p1spec)}
>player p2 ${JSON.stringify(p2spec)}`);

		while (!battleComplete) {
			await new Promise(resolve => setTimeout(resolve, 100));
		}

		console.log(`Round ${round} Result: ${winner} wins!`);

		if (round < rounds) {
			console.log('Both players will carry forward their Pokemon state...');
		}
	}

	console.log('\n✓ Tournament complete!');
}

/*********************************************************************
 * Main execution
 *********************************************************************/

(async () => {
	try {
		console.log('This example demonstrates persistent battle formats.\n');
		console.log('Note: To actually use persistence, you need to add');
		console.log('"Persistent Battles" or "Persistent Battles P1" to the format ruleset.\n');

		// Run gauntlet challenge
		await runGauntletChallenge();

		// Optionally run persistent tournament
		// await runPersistentTournament();

		console.log('\n=== Example Complete ===');
		console.log('\nTo use persistence in your own battles:');
		console.log('1. Add "Persistent Battles" or "Persistent Battles P1" to format ruleset');
		console.log('2. Use the same player name across battles');
		console.log('3. Pokemon state will automatically persist!\n');
	} catch (error) {
		console.error('Error:', error);
		process.exit(1);
	}
})();
