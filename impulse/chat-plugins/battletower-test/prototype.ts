import { createBattle } from './bt_utils'; // Import from bt_utils

const STORY = {
	'start': {
		text: 'You wake up in Pallet Town, ready to start your Pokémon journey! Professor Oak offers you a choice of three starter Pokémon: Charmander, Bulbasaur, or Squirtle. Which do you choose?',
		choices: {
			'Charmander': 'charmander_path',
			'Bulbasaur': 'bulbasaur_path',
			'Squirtle': 'squirtle_path',
		},
	},
	'charmander_path': {
		text: 'You chose Charmander! It’s a fiery little Pokémon. You head out to Route 1 and encounter a wild Pidgey. Do you try to catch it or battle it for experience?',
		choices: {
			'Catch': 'catch_pidgey',
			'Battle': 'battle_pidgey',
		},
	},
	'bulbasaur_path': {
		text: 'You chose Bulbasaur! Its Grass-type moves are strong. On Route 1, you spot a wild Rattata. Do you try to catch it or battle it for experience?',
		choices: {
			'Catch': 'catch_rattata',
			'Battle': 'battle_rattata',
		},
	},
	'squirtle_path': {
		text: 'You chose Squirtle! This Water-type Pokémon is ready for adventure. On Route 1, you see a wild Caterpie. Do you try to catch it or battle it for experience?',
		choices: {
			'Catch': 'catch_caterpie',
			'Battle': 'battle_caterpie',
		},
	},
	'catch_pidgey': {
		text: 'You throw a Poké Ball and catch the Pidgey! It joins your team. You see a path to Viridian Forest ahead. Continue?',
		choices: {
			'Continue': 'viridian_forest',
		},
	},
	'battle_pidgey': {
		text: 'Charmander defeats the Pidgey, gaining experience! You feel stronger. You see a path to Viridian Forest ahead. Continue?',
		choices: {
			'Continue': 'viridian_forest',
		},
	},
	'catch_rattata': {
		text: 'You catch the Rattata with a Poké Ball! It’s now on your team. You see a path to Viridian Forest ahead. Continue?',
		choices: {
			'Continue': 'viridian_forest',
		},
	},
	'battle_rattata': {
		text: 'Bulbasaur defeats the Rattata, gaining experience! Your team grows stronger. You see a path to Viridian Forest ahead. Continue?',
		choices: {
			'Continue': 'viridian_forest',
		},
	},
	'catch_caterpie': {
		text: 'You catch the Caterpie! It joins your team. You see a path to Viridian Forest ahead. Continue?',
		choices: {
			'Continue': 'viridian_forest',
		},
	},
	'battle_caterpie': {
		text: 'Squirtle defeats the Caterpie, gaining experience! You’re ready for more. You see a path to Viridian Forest ahead. Continue?',
		choices: {
			'Continue': 'viridian_forest',
		},
	},
	'viridian_forest': {
		text: 'You enter Viridian Forest. It’s dark and full of Bug-type Pokémon. A wild Beedrill appears! Do you fight it or run away?',
		choices: {
			'Fight': 'fight_beedrill',
			'Run': 'run_away',
		},
	},
	'fight_beedrill': {
		text: 'You battle the Beedrill and win! Your Pokémon are stronger now. You exit Viridian Forest and arrive in Pewter City. What do you do next: Explore the city or head straight to the gym?',
		choices: {
			'Explore': 'explore_pewter',
			'Gym': 'challenge_gym',
		},
	},
	'run_away': {
		text: 'You safely escape the Beedrill and exit Viridian Forest. You arrive in Pewter City. What do you do next: Explore the city or head straight to the gym?',
		choices: {
			'Explore': 'explore_pewter',
			'Gym': 'challenge_gym',
		},
	},
	'explore_pewter': {
		text: 'You explore Pewter City and visit the museum. You learn about ancient Pokémon fossils. Feeling inspired, you decide it’s time for the gym. Head to the gym?',
		choices: {
			'Yes': 'challenge_gym',
		},
	},
	'challenge_gym': {
		text: 'You enter the Pewter City Gym, led by Brock, the Rock-type specialist. He challenges you to a battle. Prepare to face him in a real Pokémon Showdown battle! Ready?',
		choices: {
			'Start': 'start_gym_battle',
		},
	},
	'start_gym_battle': {
		text: 'The battle against Brock is about to begin! Please wait for the battle to conclude.',
		choices: {}, // No choices; progression depends on battle outcome
	},
	'gym_victory': {
		text: 'You defeated Brock’s Pokémon! He awards you the Boulder Badge. Congratulations! Your adventure continues... Want to restart?',
		choices: {
			'Restart': 'start',
		},
	},
	'gym_defeat': {
		text: 'You lost to Brock’s Pokémon. Train harder and try again! Return to the gym?',
		choices: {
			'Try Again': 'challenge_gym',
			'Restart': 'start',
		},
	},
};

// Bot team pools in JSON format (PokemonSet[])
const BOT_TEAM_POOLS = {
	'brock': [
		{
			name: '',
			species: 'Geodude',
			gender: 'M',
			item: 'Hard Stone',
			ability: 'Sturdy',
			moves: ['Rock Throw', 'Tackle', 'Defense Curl', 'Growl'],
			nature: 'Adamant',
			evs: {hp: 4, atk: 252, def: 0, spa: 0, spd: 0, spe: 252},
			ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
			level: 10
		},
		{
			name: '',
			species: 'Onix',
			gender: 'M',
			item: 'Hard Stone',
			ability: 'Rock Head',
			moves: ['Rock Throw', 'Tackle', 'Bind', 'Growl'],
			nature: 'Adamant',
			evs: {hp: 4, atk: 252, def: 0, spa: 0, spd: 0, spe: 252},
			ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
			level: 14
		},
		{
			name: '',
			species: 'Rhyhorn',
			gender: 'M',
			item: 'Hard Stone',
			ability: 'Rock Head',
			moves: ['Horn Attack', 'Tackle', 'Growl', 'Leer'],
			nature: 'Adamant',
			evs: {hp: 4, atk: 252, def: 0, spa: 0, spd: 0, spe: 252},
			ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
			level: 12
		},
		{
			name: '',
			species: 'Graveler',
			gender: 'M',
			item: 'Hard Stone',
			ability: 'Sturdy',
			moves: ['Rock Throw', 'Tackle', 'Defense Curl', 'Growl'],
			nature: 'Adamant',
			evs: {hp: 4, atk: 252, def: 0, spa: 0, spd: 0, spe: 252},
			ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
			level: 13
		},
	],
};

// Generate bot team from pool (returns unpacked team)
function generateBotTeam(gymLeader, count = 2) {
	const pool = BOT_TEAM_POOLS[gymLeader];
	if (!pool || pool.length < count) {
		const defaultTeam = [{
			name: '',
			species: 'Geodude',
			gender: 'M',
			item: 'Hard Stone',
			ability: 'Sturdy',
			moves: ['Rock Throw', 'Tackle', 'Defense Curl', 'Growl'],
			nature: 'Adamant',
			evs: {hp: 4, atk: 252, def: 0, spa: 0, spd: 0, spe: 252},
			ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
			level: 10
		}];
		console.log('Default bot team used:', defaultTeam);
		return defaultTeam;
	}
	const shuffled = pool.sort(() => Math.random() - 0.5);
	const team = shuffled.slice(0, count);
	console.log('Bot team:', team);
	// Validate team if Dex.validateTeam is available
	if (typeof Dex.validateTeam === 'function') {
		const validation = Dex.validateTeam(team, 'gen9customgame');
		if (validation) {
			console.log('Bot team validation errors:', validation);
		} else {
			console.log('Bot team validated successfully');
		}
	}
	return team; // Return unpacked team
}

// Generate player team based on inventory (returns unpacked team)
function generatePlayerTeam(progress) {
	const team = [];
	const defaultMoves = ['Tackle', 'Growl', 'Leer'];
	if (progress.starter) {
		const starterLevel = progress.node === 'start_gym_battle' ? 12 : 10;
		const moves = {
			'Charmander': ['Ember', 'Scratch', 'Growl', 'Leer'],
			'Bulbasaur': ['Vine Whip', 'Tackle', 'Growl', 'Leech Seed'],
			'Squirtle': ['Water Gun', 'Tackle', 'Withdraw', 'Bubble'],
		};
		const abilities = {
			'Charmander': 'Blaze',
			'Bulbasaur': 'Overgrow',
			'Squirtle': 'Torrent',
		};
		team.push({
			name: '',
			species: progress.starter,
			gender: 'M',
			item: 'None',
			ability: abilities[progress.starter],
			moves: moves[progress.starter],
			nature: 'Modest',
			evs: {hp: 4, atk: 0, def: 0, spa: 252, spd: 0, spe: 252},
			ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
			level: starterLevel
		});
	}
	progress.inventory.forEach(pokemon => {
		const moves = {
			'Pidgey': ['Gust', 'Tackle', 'Quick Attack', 'Sand Attack'],
			'Rattata': ['Tackle', 'Quick Attack', 'Hyper Fang', 'Focus Energy'],
			'Caterpie': ['Tackle', 'String Shot', 'Bug Bite'],
		};
		const abilities = {
			'Pidgey': 'Keen Eye',
			'Rattata': 'Run Away',
			'Caterpie': 'Shield Dust',
		};
		team.push({
			name: '',
			species: pokemon,
			gender: 'M',
			item: 'None',
			ability: abilities[pokemon] || 'None',
			moves: moves[pokemon] || defaultMoves,
			nature: 'Modest',
			evs: {hp: 4, atk: 0, def: 0, spa: 252, spd: 0, spe: 252},
			ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
			level: 10
		});
	});
	if (team.length === 0) {
		team.push({
			name: '',
			species: 'Pidgey',
			gender: 'M',
			item: 'None',
			ability: 'Keen Eye',
			moves: ['Gust', 'Tackle', 'Quick Attack', 'Sand Attack'],
			nature: 'Modest',
			evs: {hp: 4, atk: 0, def: 0, spa: 252, spd: 0, spe: 252},
			ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
			level: 10
		});
	}
	console.log('Player team:', team);
	// Validate team if Dex.validateTeam is available
	if (typeof Dex.validateTeam === 'function') {
		const validation = Dex.validateTeam(team, 'gen9customgame');
		if (validation) {
			console.log('Player team validation errors:', validation);
		} else {
			console.log('Player team validated successfully');
		}
	}
	return team; // Return unpacked team
}

// Generate HTML with buttons for choices (use name="send" value="/adventure choose ...")
function generateChoiceHtml(node, userId, pokemonList: string[]) {
	const choices = Object.keys(node.choices).map(choice => 
		'<button name="send" value="/adventure choose ' + choice + '" style="background: #4CAF50; color: white; padding: 8px 16px; margin: 5px; border: none; border-radius: 4px; cursor: pointer;">' + choice + '</button>'
	).join('');

	// New Team Display
	const teamString = pokemonList.length > 0 ? pokemonList.join(', ') : 'No Pokémon yet';
	const teamHtml = '<div style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; font-size: 0.9em; color: #555;">' +
		'<b>Your Team:</b> ' + teamString +
		'</div>';

	return '<div style="border: 1px solid #ccc; padding: 10px; font-family: Arial, sans-serif;">' +
		teamHtml + // Add the team HTML at the top
		'<div>' + node.text + '</div>' + // Story text
		'<div style="margin-top: 10px;">' + // Choices section
		(choices ? '<b>Choices:</b><br>' + choices : 'No choices available.') +
		(choices ? '<br><small>(Or use /adventure choose [option])</small>' : '') +
		'</div>' +
		'</div>';
}

// Store user progress
const userProgress = new Map();

// --- Battle Callbacks ---

function handleGymVictory(battle: any, winner: string, players: string[], meta: any) {
	const userId = meta.data.userId;
	const originRoom = meta.data.originRoomId ? Rooms.get(meta.data.originRoomId) : null;
	const user = Users.get(userId);

	const progress = userProgress.get(userId);
	if (!progress) return;

	progress.node = 'gym_victory';
	progress.battleId = null; // Clear battle ID
	const newNode = STORY[progress.node];
	const pokemonList = progress.starter ? [progress.starter, ...progress.inventory] : progress.inventory;
	const html = generateChoiceHtml(newNode, userId, pokemonList);

	if (originRoom) {
		originRoom.add('|uhtml|adventure-' + userId + '|' + html).update();
	} else if (user) {
		user.sendTo(null, '|uhtml|adventure-' + userId + '|' + html);
	}
	
	userProgress.set(userId, progress);
	// if (battle) battle.destroy(); // Removed this line
}

function handleGymDefeat(battle: any, winner: string, players: string[], meta: any) {
	const userId = meta.data.userId;
	const originRoom = meta.data.originRoomId ? Rooms.get(meta.data.originRoomId) : null;
	const user = Users.get(userId);

	const progress = userProgress.get(userId);
	if (!progress) return;

	progress.node = 'gym_defeat';
	progress.battleId = null; // Clear battle ID
	const newNode = STORY[progress.node];
	const pokemonList = progress.starter ? [progress.starter, ...progress.inventory] : progress.inventory;
	const html = generateChoiceHtml(newNode, userId, pokemonList);

	if (originRoom) {
		originRoom.add('|uhtml|adventure-' + userId + '|' + html).update();
	} else if (user) {
		user.sendTo(null, '|uhtml|adventure-' + userId + '|' + html);
	}
	
	userProgress.set(userId, progress);
	// if (battle) battle.destroy(); // Removed this line
}

// ----------------------

export const commands: ChatCommands = {
	adventure: {
		start(target, room, user) {
			if (userProgress.has(user.id)) {
				return this.errorReply('You’re already on an adventure! Use /adventure choose to continue or /adventure reset to start over.');
			}
			userProgress.set(user.id, { node: 'start', inventory: [], starter: null, battleId: null });
			const node = STORY['start'];
			const html = generateChoiceHtml(node, user.id, []); // Pass empty team
			if (room) {
				room.add('|uhtml|adventure-' + user.id + '|' + html).update();
			} else {
				this.sendReply('|uhtml|adventure-' + user.id + '|' + html);
			}
			this.sendReply('Click a button or use /adventure choose [option] to continue.');
		},
		choose(target, room, user) {
			if (!userProgress.has(user.id)) {
				return this.errorReply('You haven’t started an adventure yet! Use /adventure start.');
			}
			const progress = userProgress.get(user.id);
			
			const node = STORY[progress.node];
			if (!node.choices[target]) {
				return this.errorReply('Invalid choice. Available choices: ' + Object.keys(node.choices).join(', '));
			}
			if (progress.node === 'start') {
				progress.starter = target;
			}
			progress.node = node.choices[target];
			const newNode = STORY[progress.node];
			if (progress.node.includes('catch_')) {
				const pokemon = progress.node.split('_')[1];
				progress.inventory.push(pokemon.charAt(0).toUpperCase() + pokemon.slice(1));
			}

			// Get team list *after* potential updates
			const pokemonList = progress.starter ? [progress.starter, ...progress.inventory] : progress.inventory;

			if (progress.node === 'start_gym_battle') {
				const botUser = Users.get('impulseearth');
				if (!botUser || !botUser.connected) {
					progress.node = 'gym_defeat';
					const errorHtml = '<div style="border: 1px solid #ccc; padding: 10px;">' +
						'The gym battle couldn’t start because musaddiktemkar is offline. ' + generateChoiceHtml(STORY['gym_defeat'], user.id, pokemonList) + '</div>';
					if (room) {
						room.add('|uhtml|adventure-' + user.id + '|' + errorHtml).update();
					} else {
						this.sendReply('|uhtml|adventure-' + user.id + '|' + errorHtml);
					}
					userProgress.set(user.id, progress);
					return;
				}
				const formatOptions = ['gen9customgame', 'gen8customgame', 'gen7customgame'];
				let formatId = 'gen9customgame';
				for (const format of formatOptions) {
					if (Dex.formats.get(format).exists) {
						formatId = format;
						break;
					}
				}
				console.log('Selected format:', formatId);
				const playerTeam = generatePlayerTeam(progress); // Unpacked
				const botTeam = generateBotTeam('brock'); // Unpacked
				let battleRoom;
				try {
					battleRoom = createBattle({
						user: user,
						botUserId: botUser.id,
						userTeam: playerTeam,
						botTeam: botTeam,
						battleType: 'adventure_gym',
						format: formatId,
						title: `${user.name} vs. Gym Leader Brock`,
						data: { 
							userId: user.id,
							originRoomId: room ? room.id : null 
						},
						onWin: handleGymVictory,
						onLose: handleGymDefeat,
					});
				} catch (e) {
					console.error('Failed to create battle:', e);
					progress.node = 'gym_defeat';
					const errorHtml = '<div style="border: 1px solid #ccc; padding: 10px;">' +
						'The gym battle failed to start due to a server error: ' + e.message + '. ' + generateChoiceHtml(STORY['gym_defeat'], user.id, pokemonList) + '</div>';
					if (room) {
						room.add('|uhtml|adventure-' + user.id + '|' + errorHtml).update();
					} else {
						this.sendReply('|uhtml|adventure-' + user.id + '|' + errorHtml);
					}
					userProgress.set(user.id, progress);
					return;
				}
				if (!battleRoom) {
					console.error('BattleRoom is undefined after createBattle');
					progress.node = 'gym_defeat';
					const errorHtml = '<div style="border: 1px solid #ccc; padding: 10px;">' +
						'The gym battle could not be created. Please try again. ' + generateChoiceHtml(STORY['gym_defeat'], user.id, pokemonList) + '</div>';
					if (room) {
						room.add('|uhtml|adventure-' - user.id + '|' + errorHtml).update();
					} else {
						this.sendReply('|uhtml|adventure-' + user.id + '|' + errorHtml);
					}
					userProgress.set(user.id, progress);
					return;
				}
				
				progress.battleId = battleRoom.id;
				userProgress.set(user.id, progress);
				
				// Debug logging
				console.log('BattleRoom:', battleRoom ? battleRoom.id : null, 'Format:', formatId, 'Players:', [user.id, botUser.id]);
				
				const battleHtml = '<div style="border: 1px solid #ccc; padding: 10px;">' +
					// Team will be shown by generateChoiceHtml
					generateChoiceHtml(newNode, user.id, pokemonList) + 
					'<br>Battle started! Check your battle tab to fight Brock.</div>';
				
				if (room) {
					// Need to fudge the HTML a bit since generateChoiceHtml wraps it
					room.add('|uhtml|adventure-' + user.id + '|' + 
						generateChoiceHtml(newNode, user.id, pokemonList).replace('</div>', 
						'<br>Battle started! Check your battle tab to fight Brock.</div>')
					).update();
				} else {
					this.sendReply('|uhtml|adventure-' + user.id + '|' + 
						generateChoiceHtml(newNode, user.id, pokemonList).replace('</div>',
						'<br>Battle started! Check your battle tab to fight Brock.</div>')
					);
				}
			} else {
				const html = generateChoiceHtml(newNode, user.id, pokemonList); // Pass team
				if (room) {
					room.add('|uhtml|adventure-' + user.id + '|' + html).update();
				} else {
					this.sendReply('|uhtml|adventure-' + user.id + '|' + html);
				}
			}
			
			// REMOVED the chat spam block
		},
		reset(target, room, user) {
			if (!userProgress.has(user.id)) {
				return this.errorReply('You haven’t started an adventure yet!');
			}
			const progress = userProgress.get(user.id);
			if (progress.battleId) {
				const battle = Rooms.get(progress.battleId);
				if (battle) battle.destroy();
				// activeBattles map is in bt_utils, its handler will clean itself up.
			}
			const resetHtml = '<div style="border: 1px solid #ccc; padding: 10px;">Your adventure has been reset. Use /adventure start to begin again.</div>';
			if (room) {
				room.add('|uhtmlchange|adventure-' + user.id + '|' + resetHtml).update();
			} else {
				this.sendReply('|uhtml|adventure-' + user.id + '|' + resetHtml);
			}
			userProgress.delete(user.id);
		},
		inventory(target, room, user) {
			if (!userProgress.has(user.id)) {
				return this.errorReply('You haven’t started an adventure yet!');
			}
			const progress = userProgress.get(user.id);
			const pokemonList = progress.starter ? [progress.starter, ...progress.inventory] : progress.inventory;
			if (pokemonList.length === 0) {
				return this.sendReply('You haven’t caught any Pokémon yet!');
			}
			this.sendReply('Your Pokémon: ' + pokemonList.join(', '));
		},
		help: function (target, room, user) {
			this.sendReply(
				'Pokémon Adventure Commands:\n' +
				'/adventure start - Begin your Pokémon adventure.\n' +
				'/adventure choose [option] - Make a choice to continue the story (or click a button).\n' +
				'/adventure inventory - Check your caught Pokémon.\n' +
				'/adventure reset - Reset your adventure to start over.\n' +
				'/adventure help - Show this help message.'
			);
		},
	},
};
