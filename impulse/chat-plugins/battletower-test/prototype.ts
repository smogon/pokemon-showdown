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
		npcs: ['profoak'], // <-- CHANGED
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
		npcs: ['nursejoy'], // <-- CHANGED
	}
};

const NPCS = {
	'mom': {
		name: 'Mom', // <-- ADDED
		dialogue: [
			`You're finally starting your Pokémon journey! Be brave... and try not to get into too much trouble!`,
			`Don't forget to change your underwear!`
		],
		onTalk: function (user, room, progress) {
			let dialogue;
			if (progress.eventFlags['awaiting_oak']) {
				dialogue = `Professor Oak was just here looking for you! You should head over to his lab!`;
			} else if (progress.eventFlags['got_starter']) {
				dialogue = `How's your new Pokémon? Take good care of it!`;
			} else {
				dialogue = NPCS['mom'].dialogue[0];
			}
			this.sendReply(`Mom: ${dialogue}`);
		}
	},
	'profoak': { // <-- CHANGED
		name: 'Professor Oak', // <-- ADDED
		dialogue: [
			`Ah, [player]! I've been waiting for you.`,
			`It's time you got your first Pokémon. Choose one!`,
		],
		onTalk: function (user, room, progress) {
			if (progress.eventFlags['got_starter']) {
				this.sendReply(`Oak: How is your new Pokémon? Get out there and explore!`);
				return;
			}
			
			const starterHtml = `<div style="border: 1px solid #ccc; padding: 10px; font-family: Arial, sans-serif;">` +
				`<b>Professor Oak:</b> Choose your starter!` +
				`<br><button name="send" value="/adventure select_starter Charmander" style="background: #F44336; color: white; padding: 8px 16px; margin: 5px; border: none; border-radius: 4px; cursor: pointer;">Charmander</button>` +
				`<button name="send" value="/adventure select_starter Bulbasaur" style="background: #4CAF50; color: white; padding: 8px 16px; margin: 5px; border: none; border-radius: 4px; cursor: pointer;">Bulbasaur</button>` +
				`<button name="send" value="/adventure select_starter Squirtle" style="background: #2196F3; color: white; padding: 8px 16px; margin: 5px; border: none; border-radius: 4px; cursor: pointer;">Squirtle</button>` +
				`</div>`;

			const targetRoomId = room ? room.id : null;
			user.sendTo(targetRoomId, `|uhtml|adventure-` + user.id + `|` + starterHtml);
		}
	},
	'nursejoy': { // <-- CHANGED
		name: 'Nurse Joy', // <-- ADDED
		dialogue: [`Your Pokémon are fully healed! We hope to see you again!`],
		onTalk: function (user, room, progress) {
			progress.team.forEach(pokemon => {
				pokemon.hp = pokemon.maxhp;
				pokemon.status = '';
			});
			progress.lastHealLocation = progress.location;
			userProgress.set(user.id, progress);
			this.sendReply(NPCS['nursejoy'].dialogue[0]);
			updateAdventureHTML(user, room);
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
		return `<div style="border: 1px solid #ccc; padding: 10px; font-family: Arial, sans-serif;">` +
			`Error: Unknown location. Please /adventure reset` +
			`</div>`;
	}

	// Team Display
	let teamHtml = `<b>Your Team:</b> `;
	if (progress.team.length === 0) {
		teamHtml += `No Pokémon yet`;
	} else {
		teamHtml += progress.team.map(p => `${p.species} (Lvl ${p.level}) - HP: ${p.hp}/${p.maxhp}`).join(', ');
	}
	teamHtml = `<div style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; font-size: 0.9em; color: #555;">` + teamHtml + `</div>`;

	// Location Display
	const locationHtml = `<div><b>${location.name}</b><br>` + `${location.description}</div>`;

	// Buttons
	let buttonsHtml = `<div style="margin-top: 10px;">`;

	// Exits
	if (location.exits) {
		buttonsHtml += `<b>Exits:</b><br>`;
		for (const dir in location.exits) {
			buttonsHtml += `<button name="send" value="/adventure move ${dir}" style="background: #607D8B; color: white; padding: 8px 16px; margin: 5px; border: none; border-radius: 4px; cursor: pointer;">` +
				`${dir} (${LOCATIONS[location.exits[dir]].name})` +
				`</button>`;
		}
	}

	// Buildings
	if (location.buildings) {
		buttonsHtml += `<br><b>Buildings:</b><br>`;
		for (const building in location.buildings) {
			buttonsHtml += `<button name="send" value="/adventure enter ${building}" style="background: #795548; color: white; padding: 8px 16px; margin: 5px; border: none; border-radius: 4px; cursor: pointer;">` +
				`Enter ${location.buildings[building]} (${building})` +
				`</button>`;
		}
	}

	// NPCs
	if (location.npcs && location.npcs.length > 0) {
		buttonsHtml += `<br><b>People:</b><br>`;
		for (const npcId of location.npcs) {
			const npcName = NPCS[npcId]?.name || npcId; // <-- USE PRETTY NAME
			buttonsHtml += `<button name="send" value="/adventure talk ${npcId}" style="background: #9C27B0; color: white; padding: 8px 16px; margin: 5px; border: none; border-radius: 4px; cursor: pointer;">` +
				`Talk to ${npcName}` + // <-- CHANGED
				`</button>`;
		}
	}
	buttonsHtml += `</div>`;

	return `<div style="border: 1px solid #ccc; padding: 10px; font-family: Arial, sans-serif;">` +
		`${teamHtml}` +
		`${locationHtml}` +
		`${buttonsHtml}` +
		`</div>`;
}

function updateAdventureHTML(user: User, room: Room | null) {
	const progress = userProgress.get(user.id);
	if (!progress) return;
	
	const html = generateAdventureHTML(user, progress);
	
	// ALWAYS send privately
	const targetRoomId = room ? room.id : null;
	user.sendTo(targetRoomId, `|uhtml|adventure-${user.id}|${html}`);
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
	
	// Prevent battle if no Pokemon are conscious
	if (progress.team.every(p => p.hp <= 0)) {
		// @ts-ignore
		this.sendReply(`You have no healthy Pokémon! You should go to a Pokémon Center.`);
		return false;
	}
	// Filter out fainted Pokemon from the battle team
	const playerTeam = progress.team.filter(p => p.hp > 0).map(p => {
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
		this.errorReply(`The battle failed to start due to a server error.`);
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
	
	// Map battle participants back to the main team
	battle.sides[0].pokemon.forEach(battleMon => {
		const teamMon = progress.team.find(p => p.species === battleMon.species && p.level === battleMon.level); // Simple check
		if (teamMon) {
			// Update HP/Status from battle
			teamMon.hp = battleMon.hp;
			teamMon.status = battleMon.status;
			
			// If it participated and won, level it up
			if (teamMon.hp > 0) {
				const newLevel = Math.min(100, teamMon.level + 1);
				if (newLevel > teamMon.level) {
					teamMon.level = newLevel;
					
					// Recalculate stats
					const template = Dex.species.get(teamMon.species);
					const nature = teamMon.nature;
					for (const stat in teamMon.evs) {
						// @ts-ignore
						const newStat = Dex.calcStat(stat, teamMon.level, template.baseStats[stat], teamMon.ivs[stat], teamMon.evs[stat], nature);
						if (stat === 'hp') {
							teamMon.maxhp = newStat;
							// Give back some HP on level up, respecting max
							teamMon.hp = Math.min(teamMon.maxhp, teamMon.hp + Math.floor(newStat / 4));
						}
					}
					
					// Check for new moves
					const species = Dex.species.get(teamMon.species);
					const newMoves = Object.keys(species.learnset)
						.filter(move => species.learnset[move].some(m => m.startsWith(String(newLevel)[0]) && m.endsWith('L' + newLevel)))
					
					for (const move of newMoves) {
						if (!teamMon.moves.includes(move)) {
							if (teamMon.moves.length < 4) {
								teamMon.moves.push(move);
							} else {
								teamMon.moves[0] = move; // Simple replacement
							}
						}
					}
				}
			}
		}
	});

	userProgress.set(userId, progress);
	updateAdventureHTML(user, originRoom);
	user.sendTo(originRoom, `You won the battle!`);
}

function handleWildLoss(battle: any, winner: string, players: string[], meta: any) {
	const userId = meta.data.userId;
	const originRoom = meta.data.originRoomId ? Rooms.get(meta.data.originRoomId) : null;
	const user = Users.get(userId);
	if (!user) return;

	const progress = userProgress.get(userId);
	if (!progress) return;

	progress.battleId = null;

	// Update team with fainted status from battle
	battle.sides[0].pokemon.forEach(battleMon => {
		const teamMon = progress.team.find(p => p.species === battleMon.species && p.level === battleMon.level);
		if (teamMon) {
			teamMon.hp = battleMon.hp;
			teamMon.status = battleMon.status;
		}
	});
	
	// Black out - move to last heal spot
	progress.location = progress.lastHealLocation;
	userProgress.set(userId, progress);

	user.sendTo(originRoom, `You were defeated and blacked out... You woke up at the Pokémon Center.`);
	updateAdventureHTML(user, originRoom);
}

// --- 4. CHAT COMMANDS ---

export const commands: ChatCommands = {
	adventure: {
		// /adventure start
		start(target, room, user) {
			if (userProgress.has(user.id)) {
				this.errorReply(`You’re already on an adventure! Use /adventure look or /adventure reset.`);
				updateAdventureHTML(user, room);
				return;
			}
			const newProgress: PlayerProgress = {
				location: 'player_home',
				team: [],
				inventory: { 'pokeball': 5, 'potion': 3 },
				badges: [],
				money: 3000,
				eventFlags: { 'got_starter': false, 'awaiting_oak': true },
				battleId: null,
				lastHealLocation: 'player_home',
			};
			userProgress.set(user.id, newProgress);
			this.sendReply(`You have started your Pokémon RPG adventure!`);
			updateAdventureHTML(user, room);
		},

		// /adventure move <direction>
		move(target, room, user) {
			const progress = userProgress.get(user.id);
			if (!progress) return this.errorReply(`You haven’t started an adventure yet! Use /adventure start.`);
			if (progress.battleId) return this.errorReply(`You are in a battle! Finish the battle first.`);
			
			const direction = toID(target);
			const currentLocation = LOCATIONS[progress.location];
			if (!currentLocation || !currentLocation.exits[direction]) {
				return this.errorReply(`You can't go that way.`);
			}

			if (progress.location === 'player_home' && direction === 'out' && progress.eventFlags['awaiting_oak']) {
				progress.location = 'oaks_lab';
				progress.eventFlags['awaiting_oak'] = false;
				userProgress.set(user.id, progress);
				
				this.sendReply(`As you step outside, Professor Oak finds you!`);
				this.sendReply(`"Ah, ${user.name}! There you are! Come to my lab, I have something for you."`);
				this.sendReply(`You follow him to his lab.`);
				
				updateAdventureHTML(user, room);
				return;
			}

			const newLocationId = currentLocation.exits[direction];
			
			if (newLocationId === 'route_1' && !progress.eventFlags['got_starter']) {
				this.errorReply(`It's dangerous to go into the tall grass without a Pokémon!`);
				this.sendReply(`You should go talk to Professor Oak first.`);
				return;
			}

			progress.location = newLocationId;
			userProgress.set(user.id, progress);
			
			const newLocation = LOCATIONS[newLocationId];

			if (newLocation.wildEncounters && progress.team.length > 0) {
				const encounterRoll = Math.random();
				if (encounterRoll < 0.3) { 
					if (startWildBattle.call(this, user, room, progress)) {
						return;
					}
				}
			}

			updateAdventureHTML(user, room);
		},

		// /adventure enter <building>
		enter(target, room, user) {
			const progress = userProgress.get(user.id);
			if (!progress) return this.errorReply(`You haven’t started an adventure yet! Use /adventure start.`);
			if (progress.battleId) return this.errorReply(`You are in a battle! Finish the battle first.`);

			const building = toID(target);
			const currentLocation = LOCATIONS[progress.location];
			if (!currentLocation || !currentLocation.buildings || !currentLocation.buildings[building]) {
				return this.errorReply(`You can't enter that.`);
			}

			progress.location = currentLocation.buildings[building];
			userProgress.set(user.id, progress);
			updateAdventureHTML(user, room);
		},

		// /adventure talk <npc>
		talk(target, room, user) {
			const progress = userProgress.get(user.id);
			if (!progress) return this.errorReply(`You haven’t started an adventure yet! Use /adventure start.`);
			if (progress.battleId) return this.errorReply(`You are in a battle! Finish the battle first.`);

			const npcId = toID(target); // This is now 'profoak'
			const currentLocation = LOCATIONS[progress.location];
			
			// The check will now be: ['profoak'].includes('profoak') which is TRUE
			if (!currentLocation || !currentLocation.npcs || !currentLocation.npcs.includes(npcId)) {
				return this.errorReply(`That person isn't here.`);
			}

			const npc = NPCS[npcId]; // This will correctly get NPCS['profoak']
			if (npc.onTalk) {
				npc.onTalk.call(this, user, room, progress);
			} else {
				this.sendReply(`${npc.dialogue[0]}`);
			}
		},

		// /adventure select_starter <pokemon>
		select_starter(target, room, user) {
			const progress = userProgress.get(user.id);
			if (!progress) return this.errorReply(`You haven’t started an adventure yet! Use /adventure start.`);
			if (progress.eventFlags['got_starter']) return this.errorReply(`You already have your starter!`);
			if (progress.location !== 'oaks_lab') return this.errorReply(`You must be in Oak's Lab to choose a starter.`);

			const starterSpecies = toID(target);
			let starterSet;

			if (starterSpecies === 'charmander') {
				starterSet = createPokemonSet('Charmander', 5, ['Scratch', 'Growl', 'Ember']);
			} else if (starterSpecies === 'bulbasaur') {
				starterSet = createPokemonSet('Bulbasaur', 5, ['Tackle', 'Growl', 'Vine Whip']);
			} else if (starterSpecies === 'squirtle') {
				starterSet = createPokemonSet('Squirtle', 5, ['Tackle', 'Tail Whip', 'Water Gun']);
			} else {
				return this.errorReply(`That is not a valid starter choice.`);
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
			if (!progress) return this.errorReply(`You haven’t started an adventure yet! Use /adventure start.`);
			
			updateAdventureHTML(user, room);
		},

// /adventure team (replaces inventory)
		team(target, room, user) {
			if (!userProgress.has(user.id)) {
				return this.errorReply(`You haven’t started an adventure yet!`);
			}
			const progress = userProgress.get(user.id);
			if (progress.team.length === 0) {
				return this.sendReply(`You haven’t caught any Pokémon yet!`);
			}

			let reply = `Your Pokémon:\n`;
			progress.team.forEach(p => {
				reply += ` - ${p.species} (Lvl ${p.level}) | HP: ${p.hp}/${p.maxhp} | Moves: ${p.moves.join(', ')}\n`;
			});
			this.sendReply(reply);
		},
		
		// /adventure reset
		reset(target, room, user) {
			if (!userProgress.has(user.id)) {
				return this.errorReply(`You haven’t started an adventure yet!`);
			}
			const progress = userProgress.get(user.id);
			if (progress.battleId) {
				const battle = Rooms.get(progress.battleId);
				if (battle) battle.destroy();
			}
			const resetHtml = `<div style="border: 1px solid #ccc; padding: 10px;">Your adventure has been reset. Use /adventure start to begin again.</div>`;
			
			// Send privately
			const targetRoomId = room ? room.id : null;
			user.sendTo(targetRoomId, `|uhtmlchange|adventure-` + user.id + `|` + resetHtml);
			
			userProgress.delete(user.id);
		},
		
		// /adventure help
		help: function (target, room, user) {
			this.sendReply(
				`Pokémon RPG Commands:\n` +
				`/adventure start - Begin your Pokémon adventure.\n` +
				`/adventure look - See your current location, team, and options.\n` +
				`/adventure move [direction] - Move to a new location (e.g., /adventure move north).\n` +
				`/adventure enter [building] - Enter a building (e.g., /adventure enter lab).\n` +
				`/adventure talk [npc] - Talk to a person (e.g., /adventure talk prof_oak).\n` +
				`/adventure team - Check your current Pokémon team.\n` +
				`/adventure reset - Reset your adventure to start over.`
			);
		},
	},
};
