import { createBattle } from './bt_utils'; // Import from bt_utils
// @ts-ignore
import { Teams } from '../../../sim/teams'; // Assuming Teams is available

// --- 1. DATA STRUCTURES ---

interface PlayerProgress {
	location: string;
	team: any[]; // Array of PokemonSet objects
	inventory: { [itemId: string]: number };
	badges: string[];
	money: number;
	eventFlags: { [flag: string]: boolean };
	battleId: string | null;
	lastHealLocation: string;
}

const LOCATIONS = {
	'player_home': {
		name: 'Your House',
		description: 'A cozy, familiar home.',
		exits: {
			'out': 'pallet_town',
		},
		npcs: ['mom'],
	},
	'pallet_town': {
		name: 'Pallet Town',
		description: 'A quiet little town. Your house and Professor Oak\'s lab are here.',
		exits: {
			'north': 'route_1',
		},
		npcs: [],
		buildings: {
			'lab': 'oaks_lab',
			'home': 'player_home',
		},
	},
	'oaks_lab': {
		name: 'Professor Oak\'s Lab',
		description: 'Filled with strange machines and bookshelves. Professor Oak is here.',
		exits: {
			'out': 'pallet_town',
		},
		npcs: ['prof_oak'],
	},
	'route_1': {
		name: 'Route 1',
		description: 'A grassy path connecting Pallet Town and Viridian City.',
		exits: {
			'south': 'pallet_town',
			'north': 'viridian_city', // Not implemented yet
		},
		wildEncounters: [
			{ species: 'Pidgey', minLevel: 2, maxLevel: 4, rate: 0.5 },
			{ species: 'Rattata', minLevel: 2, maxLevel: 4, rate: 0.5 },
		],
	},
	'viridian_city': {
		name: 'Viridian City',
		description: 'You\'ve arrived in Viridian City. You see a Pokémon Center and a Mart.',
		exits: {
			'south': 'route_1',
		},
		npcs: [],
		buildings: {
			'pokecenter': 'viridian_pokecenter',
		}
	},
	'viridian_pokecenter': {
		name: 'Pokémon Center',
		description: 'Nurse Joy is at the counter. "Welcome! Would you like to heal your Pokémon?"',
		exits: {
			'out': 'viridian_city',
		},
		npcs: ['nurse_joy'],
	}
};

const NPCS = {
	'mom': {
		dialogue: [
			"You're finally starting your Pokémon journey! Be brave... and try not to get into too much trouble!",
			"Don't forget to change your underwear!"
		],
	},
	'prof_oak': {
		dialogue: [
			"Ah, [player]! I've been waiting for you.",
			"It's time you got your first Pokémon. Choose one!",
		],
		// Special handler for giving starter
		onTalk: (user, room, progress) => {
			if (progress.eventFlags['got_starter']) {
				// @ts-ignore
				this.sendReply("Oak: How is your new Pokémon? Get out there and explore!");
				return;
			}
			
			// Present starter choice
			const starterHtml = '<div style="border: 1px solid #ccc; padding: 10px; font-family: Arial, sans-serif;">' +
				'<b>Professor Oak:</b> Choose your starter!' +
				'<br><button name="send" value="/adventure select_starter Charmander" style="background: #F44336; color: white; padding: 8px 16px; margin: 5px; border: none; border-radius: 4px; cursor: pointer;">Charmander</button>' +
				'<button name="send" value="/adventure select_starter Bulbasaur" style="background: #4CAF50; color: white; padding: 8px 16px; margin: 5px; border: none; border-radius: 4px; cursor: pointer;">Bulbasaur</button>' +
				'<button name="send" value="/adventure select_starter Squirtle" style="background: #2196F3; color: white; padding: 8px 16px; margin: 5px; border: none; border-radius: 4px; cursor: pointer;">Squirtle</button>' +
				'</div>';

			if (room) {
				room.add('|uhtml|adventure-' + user.id + '|' + starterHtml).update();
			} else {
				// @ts-ignore
				this.sendReply('|uhtml|adventure-' + user.id + '|' + starterHtml);
			}
		}
	},
	'nurse_joy': {
		dialogue: ["Your Pokémon are fully healed! We hope to see you again!"],
		onTalk: (user, room, progress) => {
			progress.team.forEach(pokemon => {
				pokemon.hp = pokemon.maxhp;
				pokemon.status = '';
			});
			progress.lastHealLocation = progress.location;
			userProgress.set(user.id, progress);
			// @ts-ignore
			this.sendReply(NPCS['nurse_joy'].dialogue[0]);
			updateAdventureHTML(user, room); // Update UI to show full HP
		}
	}
};

// Store user progress
const userProgress = new Map<string, PlayerProgress>();
const BOT_USER_ID = 'impulseearth'; // Bot user for battles

// --- 2. HTML GENERATION ---

function generateAdventureHTML(user: User, progress: PlayerProgress) {
	const location = LOCATIONS[progress.location];
	if (!location) {
		return '<div style="border: 1px solid #ccc; padding: 10px; font-family: Arial, sans-serif;">Error: Unknown location. Please /adventure reset</div>';
	}

	// Team Display
	let teamHtml = '<b>Your Team:</b> ';
	if (progress.team.length === 0) {
		teamHtml += 'No Pokémon yet';
	} else {
		teamHtml += progress.team.map(p => `${p.species} (Lvl ${p.level}) - HP: ${p.hp}/${p.maxhp}`).join(', ');
	}
	teamHtml = `<div style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; font-size: 0.9em; color: #555;">${teamHtml}</div>`;

	// Location Display
	const locationHtml = `<div><b>${location.name}</b><br>${location.description}</div>`;

	// Buttons
	let buttonsHtml = '<div style="margin-top: 10px;">';

	// Exits
	if (location.exits) {
		buttonsHtml += '<b>Exits:</b><br>';
		for (const dir in location.exits) {
			buttonsHtml += `<button name="send" value="/adventure move ${dir}" style="background: #607D8B; color: white; padding: 8px 16px; margin: 5px; border: none; border-radius: 4px; cursor: pointer;">${dir} (${LOCATIONS[location.exits[dir]].name})</button>`;
		}
	}

	// Buildings
	if (location.buildings) {
		buttonsHtml += '<br><b>Buildings:</b><br>';
		for (const building in location.buildings) {
			buttonsHtml += `<button name="send" value="/adventure enter ${building}" style="background: #795548; color: white; padding: 8px 16px; margin: 5px; border: none; border-radius: 4px; cursor: pointer;">Enter ${location.buildings[building]} (${building})</button>`;
		}
	}

	// NPCs
	if (location.npcs && location.npcs.length > 0) {
		buttonsHtml += '<br><b>People:</b><br>';
		for (const npcId of location.npcs) {
			buttonsHtml += `<button name="send" value="/adventure talk ${npcId}" style="background: #9C27B0; color: white; padding: 8px 16px; margin: 5px; border: none; border-radius: 4px; cursor: pointer;">Talk to ${npcId}</button>`;
		}
	}
	buttonsHtml += '</div>';

	return `<div style="border: 1px solid #ccc; padding: 10px; font-family: Arial, sans-serif;">
		${teamHtml}
		${locationHtml}
		${buttonsHtml}
	</div>`;
}

function updateAdventureHTML(user: User, room: Room | null) {
	const progress = userProgress.get(user.id);
	if (!progress) return;
	
	const html = generateAdventureHTML(user, progress);
	
	if (room) {
		room.add(`|uhtml|adventure-${user.id}|${html}`).update();
	} else {
		user.sendTo(null, `|uhtml|adventure-${user.id}|${html}`);
	}
}


// --- 3. BATTLE LOGIC ---

function createPokemonSet(species: string, level: number, moves: string[]): any {
	const template = Dex.species.get(species);
	const ability = Object.values(template.abilities)[0] || 'None';
	
	// Calculate stats
	const stats = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
	const evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
	const ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
	const nature = "Serious";

	for (const stat in stats) {
		// @ts-ignore
		stats[stat] = Dex.calcStat(stat, level, template.baseStats[stat], ivs[stat], evs[stat], nature);
	}

	return {
		name: species,
		species: species,
		gender: 'M',
		item: 'None',
		ability: ability,
		moves: moves,
		nature: nature,
		evs: evs,
		ivs: ivs,
		level: level,
		hp: stats.hp,
		maxhp: stats.hp,
		status: '',
	};
}

function generateWildTeam(encounters: any[]) {
	// For now, just pick the first one
	const encounter = encounters[0]; 
	const level = Math.floor(Math.random() * (encounter.maxLevel - encounter.minLevel + 1)) + encounter.minLevel;
	const species = Dex.species.get(encounter.species);
	
	// Get 4 moves it would know at this level
	const moves = Object.keys(species.learnset)
		.filter(move => species.learnset[move].some(m => m.startsWith(String(level)[0]) && m.endsWith('L' + level)))
		.slice(0, 4);
	if (moves.length === 0) moves.push('tackle');

	return [createPokemonSet(encounter.species, level, moves)];
}

function startWildBattle(user: User, room: Room | null, progress: PlayerProgress) {
	const botUser = Users.get(BOT_USER_ID);
	if (!botUser || !botUser.connected) {
		// @ts-ignore
		this.errorReply(`The battle couldn't start because ${BOT_USER_ID} is offline.`);
		return false;
	}

	const location = LOCATIONS[progress.location];
	if (!location.wildEncounters) return false;

	const playerTeam = progress.team.map(p => {
		// Ensure HP is correct for battle start
		p.curHP = p.hp;
		return p;
	});
	const wildTeam = generateWildTeam(location.wildEncounters);

	try {
		const battleRoom = createBattle({
			user: user,
			botUserId: botUser.id,
			userTeam: playerTeam,
			botTeam: wildTeam,
			battleType: 'wild_adventure',
			format: 'gen9customgame',
			title: `${user.name} vs. Wild ${wildTeam[0].species}`,
			data: { 
				userId: user.id,
				originRoomId: room ? room.id : null 
			},
			onWin: handleWildWin,
			onLose: handleWildLoss,
		});

		if (battleRoom) {
			progress.battleId = battleRoom.id;
			userProgress.set(user.id, progress);
			// @ts-ignore
			this.sendReply(`A wild ${wildTeam[0].species} appeared!`);
			return true;
		}
	} catch (e) {
		console.error('Failed to create wild battle:', e);
		// @ts-ignore
		this.errorReply('The battle failed to start due to a server error.');
	}
	return false;
}

// Post-battle callbacks
function handleWildWin(battle: any, winner: string, players: string[], meta: any) {
	const userId = meta.data.userId;
	const originRoom = meta.data.originRoomId ? Rooms.get(meta.data.originRoomId) : null;
	const user = Users.get(userId);
	if (!user) return;

	const progress = userProgress.get(userId);
	if (!progress) return;

	progress.battleId = null;

	// User's requested logic: +1 level per win
	progress.team.forEach(pokemon => {
		if (pokemon.hp > 0) { // Don't level up fainted pokemon
			const newLevel = Math.min(100, pokemon.level + 1);
			if (newLevel > pokemon.level) {
				pokemon.level = newLevel;
				
				// Re-calculate stats for new level
				const template = Dex.species.get(pokemon.species);
				const nature = pokemon.nature;
				for (const stat in pokemon.evs) {
					// @ts-ignore
					const newStat = Dex.calcStat(stat, pokemon.level, template.baseStats[stat], pokemon.ivs[stat], pokemon.evs[stat], nature);
					if (stat === 'hp') {
						pokemon.maxhp = newStat;
					}
				}
				
				// Check for new moves (simplified: add if slot available, else replace 1st)
				const species = Dex.species.get(pokemon.species);
				const newMoves = Object.keys(species.learnset)
					.filter(move => species.learnset[move].some(m => m.startsWith(String(newLevel)[0]) && m.endsWith('L' + newLevel)))
				
				for (const move of newMoves) {
					if (!pokemon.moves.includes(move)) {
						if (pokemon.moves.length < 4) {
							pokemon.moves.push(move);
						} else {
							pokemon.moves[0] = move; // Simple replacement
						}
					}
				}
			}
		}

		// Update HP from battle object
		const battlePokemon = battle.sides[0].pokemon.find(p => p.name === pokemon.name);
		if (battlePokemon) {
			pokemon.hp = battlePokemon.hp;
			pokemon.status = battlePokemon.status;
		}
	});

	userProgress.set(userId, progress);
	updateAdventureHTML(user, originRoom);
	user.sendTo(originRoom, "You won the battle!");
}

function handleWildLoss(battle: any, winner: string, players: string[], meta: any) {
	const userId = meta.data.userId;
	const originRoom = meta.data.originRoomId ? Rooms.get(meta.data.originRoomId) : null;
	const user = Users.get(userId);
	if (!user) return;

	const progress = userProgress.get(userId);
	if (!progress) return;

	progress.battleId = null;

	// Update team with fainted status
	progress.team.forEach(pokemon => {
		pokemon.hp = 0;
		pokemon.status = 'fnt';
	});
	
	// Black out - move to last heal spot
	progress.location = progress.lastHealLocation;
	userProgress.set(userId, progress);

	user.sendTo(originRoom, "You were defeated and blacked out... You woke up at the Pokémon Center.");
	updateAdventureHTML(user, originRoom);
}

// --- 4. CHAT COMMANDS ---

export const commands: ChatCommands = {
	adventure: {
		// /adventure start
		start(target, room, user) {
			if (userProgress.has(user.id)) {
				this.errorReply('You’re already on an adventure! Use /adventure look or /adventure reset.');
				updateAdventureHTML(user, room);
				return;
			}
			const newProgress: PlayerProgress = {
				location: 'player_home',
				team: [],
				inventory: { 'pokeball': 5, 'potion': 3 },
				badges: [],
				money: 3000,
				eventFlags: { 'got_starter': false },
				battleId: null,
				lastHealLocation: 'player_home',
			};
			userProgress.set(user.id, newProgress);
			this.sendReply('You have started your Pokémon RPG adventure!');
			updateAdventureHTML(user, room);
		},

		// /adventure move <direction>
		move(target, room, user) {
			const progress = userProgress.get(user.id);
			if (!progress) return this.errorReply('You haven’t started an adventure yet! Use /adventure start.');
			if (progress.battleId) return this.errorReply('You are in a battle! Finish the battle first.');
			
			const direction = toID(target);
			const currentLocation = LOCATIONS[progress.location];
			if (!currentLocation || !currentLocation.exits[direction]) {
				return this.errorReply("You can't go that way.");
			}

			const newLocationId = currentLocation.exits[direction];
			progress.location = newLocationId;
			userProgress.set(user.id, progress);
			
			const newLocation = LOCATIONS[newLocationId];

			// Check for wild encounters
			if (newLocation.wildEncounters && progress.team.length > 0) {
				const encounterRoll = Math.random();
				const encounterRate = newLocation.wildEncounters.reduce((sum, e) => sum + e.rate, 0) / newLocation.wildEncounters.length;
				if (encounterRoll < encounterRate) {
					// Pass `this` context to the function
					startWildBattle.call(this, user, room, progress);
					return; // Stop here, battle started
				}
			}

			updateAdventureHTML(user, room);
		},

		// /adventure enter <building>
		enter(target, room, user) {
			const progress = userProgress.get(user.id);
			if (!progress) return this.errorReply('You haven’t started an adventure yet! Use /adventure start.');
			if (progress.battleId) return this.errorReply('You are in a battle! Finish the battle first.');

			const building = toID(target);
			const currentLocation = LOCATIONS[progress.location];
			if (!currentLocation || !currentLocation.buildings || !currentLocation.buildings[building]) {
				return this.errorReply("You can't enter that.");
			}

			progress.location = currentLocation.buildings[building];
			userProgress.set(user.id, progress);
			updateAdventureHTML(user, room);
		},

		// /adventure talk <npc>
		talk(target, room, user) {
			const progress = userProgress.get(user.id);
			if (!progress) return this.errorReply('You haven’t started an adventure yet! Use /adventure start.');
			if (progress.battleId) return this.errorReply('You are in a battle! Finish the battle first.');

			const npcId = toID(target);
			const currentLocation = LOCATIONS[progress.location];
			if (!currentLocation || !currentLocation.npcs || !currentLocation.npcs.includes(npcId)) {
				return this.errorReply("That person isn't here.");
			}

			const npc = NPCS[npcId];
			if (npc.onTalk) {
				// Pass `this` context
				npc.onTalk.call(this, user, room, progress);
			} else {
				this.sendReply(npc.dialogue[0]);
			}
		},

		// /adventure select_starter <pokemon>
		select_starter(target, room, user) {
			const progress = userProgress.get(user.id);
			if (!progress) return this.errorReply('You haven’t started an adventure yet! Use /adventure start.');
			if (progress.eventFlags['got_starter']) return this.errorReply("You already have your starter!");
			if (progress.location !== 'oaks_lab') return this.errorReply("You must be in Oak's Lab to choose a starter.");

			const starterSpecies = toID(target);
			let starterSet;

			if (starterSpecies === 'charmander') {
				starterSet = createPokemonSet('Charmander', 5, ['Scratch', 'Growl', 'Ember']);
			} else if (starterSpecies === 'bulbasaur') {
				starterSet = createPokemonSet('Bulbasaur', 5, ['Tackle', 'Growl', 'Vine Whip']);
			} else if (starterSpecies === 'squirtle') {
				starterSet = createPokemonSet('Squirtle', 5, ['Tackle', 'Tail Whip', 'Water Gun']);
			} else {
				return this.errorReply("That is not a valid starter choice.");
			}

			progress.team.push(starterSet);
			progress.eventFlags['got_starter'] = true;
			userProgress.set(user.id, progress);

			this.sendReply(`You received ${starterSet.species}!`);
			updateAdventureHTML(user, room);
		},

		// /adventure look
		look(target, room, user) {
			const progress = userProgress.get(user.id);
			if (!progress) return this.errorReply('You haven’t started an adventure yet! Use /adventure start.');
			
			updateAdventureHTML(user, room);
		},

		// /adventure team (replaces inventory)
		team(target, room, user) {
			if (!userProgress.has(user.id)) {
				return this.errorReply('You haven’t started an adventure yet!');
			}
			const progress = userProgress.get(user.id);
			if (progress.team.length === 0) {
				return this.sendReply('You haven’t caught any Pokémon yet!');
			}

			let reply = 'Your Pokémon:\n';
			progress.team.forEach(p => {
				reply += `- ${p.species} (Lvl ${p.level}) | HP: ${p.hp}/${p.maxhp} | Moves: ${p.moves.join(', ')}\n`;
			});
			this.sendReply(reply);
		},
		
		// /adventure reset
		reset(target, room, user) {
			if (!userProgress.has(user.id)) {
				return this.errorReply('You haven’t started an adventure yet!');
			}
			const progress = userProgress.get(user.id);
			if (progress.battleId) {
				const battle = Rooms.get(progress.battleId);
				if (battle) battle.destroy();
			}
			const resetHtml = '<div style="border: 1px solid #ccc; padding: 10px;">Your adventure has been reset. Use /adventure start to begin again.</div>';
			if (room) {
				room.add('|uhtmlchange|adventure-' + user.id + '|' + resetHtml).update();
			} else {
				this.sendReply('|uhtml|adventure-' + user.id + '|' + resetHtml);
			}
			userProgress.delete(user.id);
		},
		
		// /adventure help
		help: function (target, room, user) {
			this.sendReply(
				'Pokémon RPG Commands:\n' +
				'/adventure start - Begin your Pokémon adventure.\n' +
				'/adventure look - See your current location, team, and options.\n' +
				'/adventure move [direction] - Move to a new location (e.g., /adventure move north).\n' +
				'/adventure enter [building] - Enter a building (e.g., /adventure enter lab).\n' +
				'/adventure talk [npc] - Talk to a person (e.g., /adventure talk prof_oak).\n' +
				'/adventure team - Check your current Pokémon team.\n' +
				'/adventure reset - Reset your adventure to start over.'
			);
		},
	},
};
