/*
* Pokemon Showdown
* Rogelike Gym Challenge Plugin
*/

import { Dex } from '../../../sim/dex';
// import { Teams } from '../../../sim/teams'; // No longer needed

interface GymLeader {
  botUserId: string;
  name: string;
  type: string;
  badge: string;
  team: any[];
}

interface RunState {
  userId: string;
  currentGym: number;
  lives: number;
  teamData: any[];
  rewards: string[];
  badges: string[];
  startTime: number;
  inventory: {
    tms: string[];
    items: string[];
  };
}

interface RewardOption {
  id: string;
  name: string;
  description: string;
  apply: (state: RunState) => string[] | void;
}

// --- NEW: Pokemon Pools ---
const STARTER_POOL: string[] = [
  'Bulbasaur', 'Charmander', 'Squirtle', 'Pikachu', 'Eevee', 'Machop', 'Abra', 'Geodude', 'Gastly', 'Ponyta',
];

const POKEMON_REWARD_POOL: string[] = [
  'Sandshrew', 'Vulpix', 'Growlithe', 'Poliwag', 'Bellsprout', 'Magnemite', 'Grimer', 'Shellder', 'Drowzee',
  'Koffing', 'Rhyhorn', 'Horsea', 'Scyther', 'Pinsir', 'Magikarp', 'Lapras', 'Dratini', 'Snorlax',
  'Chikorita', 'Cyndaquil', 'Totodile', 'Sentret', 'Hoothoot', 'Mareep', 'Wooper', 'Snubbull', 'Heracross',
  'Teddiursa', 'Swinub', 'Houndour', 'Phanpy', 'Larvitar',
];
// --- End Pokemon Pools ---

// --- NEW: Pending Starter Choice Map ---
const pendingStarters: Map<string, any[]> = new Map();

const activeRuns: Map<string, RunState> = new Map();
const pendingRewards: Map<string, RewardOption[]> = new Map();

// --- NEW: Define a single User ID for the Gym Challenge Bot ---
const GYM_CHALLENGE_BOT_ID = 'gymchallengebot';

// --- NOTE: These levels are now IGNORED by createGymBattle ---
// --- They just serve as a team template. ---
const GYM_LEADERS: GymLeader[] = [
  {
    botUserId: GYM_CHALLENGE_BOT_ID,
    name: 'Brock',
    type: 'Rock',
    badge: 'Boulder Badge',
    team: [
      { species: 'Geodude', item: '', level: 13, moves: ['tackle', 'defensecurl', 'rockthrow'] },
      { species: 'Onix', item: '', level: 15, moves: ['tackle', 'bind', 'rockthrow', 'rage'] },
    ]
  },
  {
    botUserId: GYM_CHALLENGE_BOT_ID,
    name: 'Misty',
    type: 'Water',
    badge: 'Cascade Badge',
    team: [
      { species: 'Staryu', item: '', level: 16, moves: ['tackle', 'watergun', 'rapidspin', 'recover'] },
      { species: 'Starmie', item: '', level: 18, moves: ['watergun', 'rapidspin', 'bubblebeam', 'swift'] },
    ]
  },
  {
    botUserId: GYM_CHALLENGE_BOT_ID,
    name: 'Lt. Surge',
    type: 'Electric',
    badge: 'Thunder Badge',
    team: [
      { species: 'Voltorb', item: '', level: 19, moves: ['tackle', 'sonicboom', 'spark', 'selfdestruct'] },
      { species: 'Pikachu', item: '', level: 18, moves: ['thundershock', 'quickattack', 'thunderwave', 'doubleteam'] },
      { species: 'Raichu', item: 'Oran Berry', level: 22, moves: ['thundershock', 'quickattack', 'thunderbolt', 'doubleteam'] },
    ]
  },
  {
    botUserId: GYM_CHALLENGE_BOT_ID,
    name: 'Erika',
    type: 'Grass',
    badge: 'Rainbow Badge',
    team: [
      { species: 'Victreebel', item: '', level: 24, moves: ['razorleaf', 'acid', 'poisonpowder', 'gigadrain'] },
      { species: 'Tangela', item: 'Sitrus Berry', level: 23, moves: ['vinewhip', 'bind', 'poisonpowder', 'gigadrain'] },
      { species: 'Vileplume', item: '', level: 27, moves: ['megadrain', 'acid', 'poisonpowder', 'petaldance'] },
    ]
  },
  {
    botUserId: GYM_CHALLENGE_BOT_ID,
    name: 'Sabrina',
    type: 'Psychic',
    badge: 'Marsh Badge',
    team: [
      { species: 'Kadabra', item: 'Twisted Spoon', level: 30, moves: ['psybeam', 'reflect', 'futuresight', 'calmmind'] },
      { species: 'Mr. Mime', item: 'Leftovers', level: 29, moves: ['barrier', 'psybeam', 'reflect', 'psychic'] },
      { species: 'Alakazam', item: 'Twisted Spoon', level: 33, moves: ['psychic', 'recover', 'futuresight', 'calmmind'] },
    ]
  },
  {
    botUserId: GYM_CHALLENGE_BOT_ID,
    name: 'Koga',
    type: 'Poison',
    badge: 'Soul Badge',
    team: [
      { species: 'Koffing', item: 'Black Sludge', level: 34, moves: ['sludgebomb', 'toxic', 'smokescreen', 'selfdestruct'] },
      { species: 'Muk', item: 'Black Sludge', level: 35, moves: ['sludgebomb', 'toxic', 'minimize', 'acidarmor'] },
      { species: 'Weezing', item: 'Black Sludge', level: 36, moves: ['sludgebomb', 'toxic', 'smokescreen', 'haze'] },
      { species: 'Crobat', item: '', level: 38, moves: ['sludgebomb', 'airslash', 'toxic', 'confuseray'] },
    ]
  },
  {
    botUserId: GYM_CHALLENGE_BOT_ID,
    name: 'Blaine',
    type: 'Fire',
    badge: 'Volcano Badge',
    team: [
      { species: 'Growlithe', item: 'Charcoal', level: 39, moves: ['flamethrower', 'extremespeed', 'takedown', 'roar'] },
      { species: 'Ponyta', item: '', level: 38, moves: ['flamethrower', 'takedown', 'bounce', 'fireblast'] },
      { species: 'Rapidash', item: 'Charcoal', level: 40, moves: ['flamethrower', 'megahorn', 'bounce', 'fireblast'] },
      { species: 'Arcanine', item: 'Charcoal', level: 43, moves: ['flamethrower', 'extremespeed', 'crunch', 'fireblast'] },
    ]
  },
  {
    botUserId: GYM_CHALLENGE_BOT_ID,
    name: 'Giovanni',
    type: 'Ground',
    badge: 'Earth Badge',
    team: [
      { species: 'Rhyhorn', item: 'Soft Sand', level: 44, moves: ['earthquake', 'stoneedge', 'megahorn', 'rockpolish'] },
      { species: 'Dugtrio', item: 'Choice Band', level: 43, moves: ['earthquake', 'stoneedge', 'suckerpunch', 'aerialace'] },
      { species: 'Nidoqueen', item: 'Life Orb', level: 45, moves: ['earthquake', 'sludgebomb', 'icebeam', 'thunderbolt'] },
      { species: 'Nidoking', item: 'Life Orb', level: 46, moves: ['earthquake', 'sludgebomb', 'icebeam', 'thunderbolt'] },
      { species: 'Rhyperior', item: 'Leftovers', level: 48, moves: ['earthquake', 'stoneedge', 'megahorn', 'stealthrock'] },
    ]
  },
];

const TM_POOL: string[] = [
  'swordsdance', 'flamethrower', 'icebeam', 'thunderbolt', 'earthquake', 'psychic',
  'shadowball', 'focusblast', 'sludgebomb', 'fireblast', 'hydropump', 'blizzard',
  'thunder', 'gigadrain', 'rockslide', 'darkpulse', 'dragonpulse', 'calmmind',
  'stealthrock', 'toxic', 'surf', 'scald', 'voltswitch', 'uturn', 'willowisp',
];

const NATURES = [
  'Adamant', 'Bashful', 'Bold', 'Brave', 'Calm', 'Careful', 'Docile', 'Gentle',
  'Hardy', 'Hasty', 'Impish', 'Jolly', 'Lax', 'Lonely', 'Mild', 'Modest',
  'Naive', 'Naughty', 'Quiet', 'Quirky', 'Rash', 'Relaxed', 'Sassy', 'Serious', 'Timid',
];

// --- NEW: Helper function for random EVs ---
function getRandomEVs(): { [key: string]: number } {
  const evs: { [key: string]: number } = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
  let points = 510;
  const stats: string[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

  // Max two stats
  for (let i = 0; i < 2; i++) {
    const stat = stats.splice(Math.floor(Math.random() * stats.length), 1)[0];
    const amount = 252; // Standard max
    evs[stat] = amount;
    points -= amount;
  }
  // Dump the remaining 6 points
  evs[stats[0]] = points;
  
  return evs;
}

// --- NEW: Helper function for random IVs ---
function getRandomIVs(): { [key: string]: number } {
  return {
    hp: Math.floor(Math.random() * 32),
    atk: Math.floor(Math.random() * 32),
    def: Math.floor(Math.random() * 32),
    spa: Math.floor(Math.random() * 32),
    spd: Math.floor(Math.random() * 32),
    spe: Math.floor(Math.random() * 32),
  };
}

// --- MODIFIED: Helper function to generate Pokemon ---
function generateRandomPokemon(level: number, pool: string[], item: string = ''): any {
  const speciesName = pool[Math.floor(Math.random() * pool.length)];
  const species = Dex.species.get(speciesName);

  if (!species.exists) {
    throw new Error(`[Gym Challenge] Invalid species in pool: ${speciesName}`);
  }
  
  // Get 4 random moves from level-up learnset + TMs
  // --- THIS IS THE FIX ---
  // Call getLearnset on Dex.data.Learnsets (the data object)
  const learnset = Dex.data.Learnsets[species.id];
  // --- END FIX ---

  let possibleMoves: string[] = [];
  if (learnset) {
      for (const moveid in learnset) {
          // Check if it's a level-up move learnable at or below current level, or a TM move
          const canLearn = learnset[moveid].some(source => (source.startsWith('9L') && parseInt(source.slice(2)) <= level) || source.startsWith('9M'));
          if (canLearn) {
              possibleMoves.push(moveid);
          }
      }
  }
  // Fallback if no moves found (shouldn't happen with good pool)
  if (possibleMoves.length < 4) {
      possibleMoves.push('tackle', 'growl', 'scratch', 'leer');
  }
  
  const moves = [...possibleMoves].sort(() => 0.5 - Math.random()).slice(0, 4);
  
  // Get all possible abilities (0, 1, H)
  const abilities = Object.values(species.abilities);
  const ability = abilities[Math.floor(Math.random() * abilities.length)] || 'No Ability';

  return {
    species: species.name,
    item: item,
    level: level,
    moves: moves,
    ability: ability,
    nature: NATURES[Math.floor(Math.random() * NATURES.length)],
    evs: getRandomEVs(),
    ivs: getRandomIVs(),
  };
}

function getRandomTMs(count: number = 3): string[] {
  const shuffled = [...TM_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const REWARD_POOL: RewardOption[] = [
  {
    id: 'life_orb',
    name: 'Life Orb',
    description: 'Add a Life Orb to your inventory. Give it to a Pokemon with /gymchallenge giveitem.',
    apply: (state) => {
      state.inventory.items.push('Life Orb');
    }
  },
  {
    id: 'choice_band',
    name: 'Choice Band',
    description: 'Add a Choice Band to your inventory. Give it to a Pokemon with /gymchallenge giveitem.',
    apply: (state) => {
      state.inventory.items.push('Choice Band');
    }
  },
  {
    id: 'leftovers',
    name: 'Leftovers',
    description: 'Add Leftovers to your inventory. Give it to a Pokemon with /gymchallenge giveitem.',
    apply: (state) => {
      state.inventory.items.push('Leftovers');
    }
  },
  {
    id: 'level_boost',
    name: 'Rare Candies',
    description: 'Boost all Pokemon by 2 levels (and evolve if possible)',
    apply: (state: RunState): string[] => {
      const evolutionMessages: string[] = [];
      state.teamData.forEach(mon => {
        mon.level += 2;
        let canEvolve = true;
        while (canEvolve) {
          const species = Dex.species.get(mon.species);
          canEvolve = false; // Assume no evolution unless found
          if (!species.evos || species.evos.length === 0) break;

          // Find the first valid level-up evolution
          for (const evoId of species.evos) {
            const evoSpecies = Dex.species.get(evoId);
            // Only handle level-up evolutions
            if (evoSpecies.evoType === 'levelUp' && mon.level >= evoSpecies.evoLevel) {
              const oldSpeciesName = mon.species;
              mon.species = evoSpecies.name;
              evolutionMessages.push(`Your ${oldSpeciesName} evolved into ${mon.species}!`);
              canEvolve = true; // Check again for multi-stage evos
              break; // Evolved, break inner loop and restart while
            }
          }
        }
      });
      return evolutionMessages;
    }
  },
  // --- NEW: Add Pokemon Reward ---
  {
    id: 'add_pokemon',
    name: 'New Teammate',
    description: 'A new random Pokemon (max 3) joins your team.',
    apply: (state: RunState): string[] | void => {
      if (state.teamData.length >= 3) {
        return ['Your team is already full!'];
      }
      
      let totalLevel = 0;
      for (const mon of state.teamData) {
        totalLevel += mon.level;
      }
      const playerAvgLevel = Math.round(totalLevel / state.teamData.length);
      
      const newMon = generateRandomPokemon(playerAvgLevel, POKEMON_REWARD_POOL); // No item
      state.teamData.push(newMon);
      return [`${newMon.species} joined your team at Lvl ${newMon.level}!`];
    }
  },
  {
    id: 'extra_life',
    name: 'Extra Life',
    description: 'Gain an additional life',
    apply: (state) => {
      state.lives++;
    }
  },
  {
    id: 'focus_sash',
    name: 'Focus Sash',
    description: 'Add a Focus Sash to your inventory. Give it to a Pokemon with /gymchallenge giveitem.',
    apply: (state) => {
      state.inventory.items.push('Focus Sash');
    }
  },
  {
    id: 'tm_case',
    name: 'TM Case',
    description: 'Get 3 random TMs. Check your TMs with /gymchallenge status.',
    apply: (state) => {
      const newTMs = getRandomTMs(3);
      state.inventory.tms.push(...newTMs);
    }
  },
];

function getRandomRewards(count: number = 3): RewardOption[] {
  const shuffled = [...REWARD_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function createGymBattle(user: any, gymIndex: number) {
  const gym = GYM_LEADERS[gymIndex];
  const state = activeRuns.get(user.id);
  if (!state) return null;

  // --- MODIFIED: BST-Based Dynamic Scaling Logic ---
  let totalBST = 0;
  for (const mon of state.teamData) {
    const species = Dex.species.get(mon.species);
    if (!species.exists) continue; // Should not happen
    const stats = species.baseStats;
    totalBST += stats.hp + stats.atk + stats.def + stats.spa + stats.spd + stats.spe;
  }
  // Handles team size of 1, 2, or 3
  const playerAvgBST = totalBST / state.teamData.length;

  // Base level scales with gym progression
  const baseLevel = (gymIndex * 5) + 13; // Gym 0: 13, Gym 1: 18, ..., Gym 7: 48

  // Modifier scales with player's team power (BST)
  // Baseline is 310 (avg starter BST). +1 level for every 40 BST over 310.
  const bstModifier = Math.round(Math.max(0, playerAvgBST - 310) / 40);

  const targetRegularLevel = baseLevel + bstModifier;
  const targetAceLevel = targetRegularLevel + 2; // Ace is 2 levels higher

  // Deep clone the bot's team to apply new levels
  let scaledBotTeam = JSON.parse(JSON.stringify(gym.team));
  
  // The ace is assumed to be the last pokemon in the array
  const aceIndex = scaledBotTeam.length - 1;

  for (let i = 0; i < scaledBotTeam.length; i++) {
    if (i === aceIndex) {
      scaledBotTeam[i].level = targetAceLevel;
    } else {
      scaledBotTeam[i].level = targetRegularLevel;
    }
  }

  // --- NEW: Add random Ability, Nature, EVs, IVs to bot team ---
  for (const mon of scaledBotTeam) {
    const species = Dex.species.get(mon.species);
    if (!species.exists) continue;
    
    // Get all possible abilities (0, 1, H)
    const abilities = Object.values(species.abilities);
    
    mon.ability = abilities[Math.floor(Math.random() * abilities.length)];
    mon.nature = NATURES[Math.floor(Math.random() * NATURES.length)];
    mon.evs = getRandomEVs();
    mon.ivs = getRandomIVs();
  }
  // --- End Dynamic Scaling ---

  const btUtils = require('./battletower-test/bt_utils');
  
  return btUtils.createBattle({
    user: user,
    botUserId: gym.botUserId, // This will now always be GYM_CHALLENGE_BOT_ID
    userTeam: state.teamData,
    botTeam: scaledBotTeam, // This is the specific (and scaled) team for the gym
    battleType: 'gymchallenge',
    format: 'gen9customgame',
    title: `Gym Challenge: ${gym.name}`,
    data: { userId: user.id, gymIndex: gymIndex },
    onWin: handleGymWin,
    onLose: handleGymLoss,
  });
}

function handleGymWin(battle: any, winner: string, players: string[], meta: any) {
  const userId = meta.data.userId;
  const gymIndex = meta.data.gymIndex;
  const state = activeRuns.get(userId);
  if (!state) return;

  const gym = GYM_LEADERS[gymIndex];
  state.badges.push(gym.badge);
  state.currentGym++;

  const user = Users.get(userId);
  if (!user) return;

  if (state.currentGym >= GYM_LEADERS.length) {
    const duration = Date.now() - state.startTime;
    const minutes = Math.floor(duration / 60000);
    user.sendTo(battle.roomid, `|html|<div class="broadcast-green"><strong>Congratulations!</strong> You've defeated all 8 Gym Leaders!<br/>Time: ${minutes} minutes<br/>Lives remaining: ${state.lives}</div>`);
    activeRuns.delete(userId);
    return;
  }

  const rewards = getRandomRewards(3);
  pendingRewards.set(userId, rewards);

  user.sendTo(battle.roomid, `|html|<div class="broadcast-green"><strong>Victory!</strong> You earned the ${gym.badge}!<br/>Choose your reward with <code>/gymchallenge reward [1-3]</code>:</div>`);
  rewards.forEach((reward, i) => {
    user.sendTo(battle.roomid, `|html|<div>${i + 1}. <strong>${reward.name}</strong>: ${reward.description}</div>`);
  });
}

function handleGymLoss(battle: any, winner: string, players: string[], meta: any) {
  const userId = meta.data.userId;
  const gymIndex = meta.data.gymIndex;
  const state = activeRuns.get(userId);
  if (!state) return;

  state.lives--;

  const user = Users.get(userId);
  if (!user) return;

  if (state.lives <= 0) {
    user.sendTo(battle.roomid, `|html|<div class="broadcast-red"><strong>Game Over!</strong> You've run out of lives.<br/>Gyms cleared: ${state.currentGym}/8<br/>Badges earned: ${state.badges.join(', ')}</div>`);
    activeRuns.delete(userId);
  } else {
    user.sendTo(battle.roomid, `|html|<div class="broadcast-red"><strong>Defeat!</strong> Lives remaining: ${state.lives}<br/>Use <code>/gymchallenge retry</code> to challenge ${GYM_LEADERS[gymIndex].name} again.</div>`);
  }
}

export const commands: Chat.ChatCommands = {
  gymchallenge: {
    start(target, room, user) {
      if (activeRuns.has(user.id)) {
        return this.errorReply("You already have an active gym challenge run.");
      }
      if (pendingStarters.has(user.id)) {
        return this.errorReply("You must choose your starter! Use /gymchallenge choose [1-3]");
      }
      
      if (target.trim()) {
        return this.errorReply("Usage: /gymchallenge start (do not provide a team)");
      }

      // Generate 3 starter options
      const options: any[] = [];
      const pool = [...STARTER_POOL].sort(() => 0.5 - Math.random());
      for (let i = 0; i < 3; i++) {
        // Starters are generated from their own pool, not the main one
        const starterPool: string[] = [pool[i]];
        options.push(generateRandomPokemon(13, starterPool, 'Oran Berry'));
      }

      pendingStarters.set(user.id, options);

      this.sendReply("Choose your starter Pokemon with /gymchallenge choose [1-3]:");
      options.forEach((mon, i) => {
        this.sendReplyBox(`${i + 1}. <strong>${mon.species}</strong> (Lvl ${mon.level}) @ ${mon.item} - Moves: ${mon.moves.join(', ')}`);
      });
    },

    choose(target, room, user) {
      if (activeRuns.has(user.id)) {
        return this.errorReply("You already have an active gym challenge run.");
      }
      const options = pendingStarters.get(user.id);
      if (!options) {
        return this.errorReply("You don't have a starter selection pending. Use /gymchallenge start");
      }

      const choice = parseInt(target.trim());
      if (isNaN(choice) || choice < 1 || choice > options.length) {
        return this.errorReply(`Choose a starter between 1 and ${options.length}.`);
      }

      const chosenPokemon = options[choice - 1];

      const state: RunState = {
        userId: user.id,
        currentGym: 0,
        lives: 3,
        teamData: [chosenPokemon], // Team starts with only the chosen starter
        rewards: [],
        badges: [],
        startTime: Date.now(),
        inventory: {
          tms: [],
          items: [],
        },
      };

      activeRuns.set(user.id, state);
      pendingStarters.delete(user.id);
      this.sendReply(`Gym Challenge started with ${chosenPokemon.species}! You have 3 lives. Use /gymchallenge next to challenge the first gym.`);
    },

    next(target, room, user) {
      const state = activeRuns.get(user.id);
      if (!state) {
        return this.errorReply("You don't have an active gym challenge. Use /gymchallenge start to begin.");
      }

      if (pendingRewards.has(user.id)) {
        return this.errorReply("You must choose a reward first! Use /gymchallenge reward [1-3]");
      }

      if (state.currentGym >= GYM_LEADERS.length) {
        return this.errorReply("You've already completed all gyms!");
      }

      const battle = createGymBattle(user, state.currentGym);
      if (!battle) {
        return this.errorReply("Failed to create battle. Make sure gym leader bots are available.");
      }

      const gym = GYM_LEADERS[state.currentGym];
      this.sendReply(`Challenging ${gym.name} (${gym.type}-type)! Lives: ${state.lives}`);
    },

    retry(target, room, user) {
      const state = activeRuns.get(user.id);
      if (!state) {
        return this.errorReply("You don't have an active gym challenge.");
      }

      if (state.lives <= 0) {
        return this.errorReply("You have no lives remaining. Start a new run with /gymchallenge start");
      }

      const battle = createGymBattle(user, state.currentGym);
      if (!battle) {
        return this.errorReply("Failed to create battle.");
      }

      const gym = GYM_LEADERS[state.currentGym];
      this.sendReply(`Retrying ${gym.name} (${gym.type}-type)! Lives: ${state.lives}`);
    },

    reward(target, room, user) {
      const state = activeRuns.get(user.id);
      if (!state) {
        return this.errorReply("You don't have an active gym challenge.");
      }

      const rewards = pendingRewards.get(user.id);
      if (!rewards) {
        return this.errorReply("You don't have any pending rewards.");
      }

      const choice = parseInt(target.trim());
      if (isNaN(choice) || choice < 1 || choice > rewards.length) {
        return this.errorReply(`Choose a reward between 1 and ${rewards.length}`);
      }

      const selectedReward = rewards[choice - 1];

      let newTMs: string[] = [];
      let applyResult: string[] | void;

      if (selectedReward.id === 'tm_case') {
        const currentTMs = new Set(state.inventory.tms);
        applyResult = selectedReward.apply(state); // This adds the new TMs
        newTMs = state.inventory.tms.filter(tm => !currentTMs.has(tm));
      } else {
        applyResult = selectedReward.apply(state);
      }
      
      state.rewards.push(selectedReward.name);
      pendingRewards.delete(user.id);

      if (selectedReward.id === 'tm_case' && newTMs.length > 0) {
        this.sendReply(`You received: ${selectedReward.name}!`);
        this.sendReplyBox(`You got 3 TMs: <strong>${newTMs.join(', ')}</strong><br />Use <code>/gymchallenge teach [pokemon number] | [move name] | [slot to replace]</code>`);
      } else if (selectedReward.id === 'level_boost' || selectedReward.id === 'add_pokemon') {
        this.sendReply(`You received: ${selectedReward.name}!`);
        if (applyResult && applyResult.length > 0) {
          this.sendReplyBox(applyResult.join('<br />'));
        }
      } else if (['life_orb', 'choice_band', 'leftovers', 'focus_sash'].includes(selectedReward.id)) {
        this.sendReply(`You received: ${selectedReward.name}!`);
        this.sendReplyBox(`It has been added to your inventory.<br />Use Code: <code>/gymchallenge giveitem [pokemon number] | [item name]</code>`);
      } else {
        this.sendReply(`You received: ${selectedReward.name}!`);
      }
      this.sendReply(`Use /gymchallenge next to continue.`);
    },

    teach(target, room, user) {
      const state = activeRuns.get(user.id);
      if (!state) {
        return this.errorReply("You don't have an active gym challenge.");
      }

      const parts = target.split('|').map(p => p.trim());
      if (parts.length !== 3) {
        return this.errorReply("Usage: /gymchallenge teach [pokemon number] | [move name] | [move slot to replace (1-4)]");
      }

      const monIndex = parseInt(parts[0]) - 1;
      const moveName = parts[1].toLowerCase().replace(/[^a-z0-9]/g, '');
      const moveSlot = parseInt(parts[2]) - 1;

      if (isNaN(monIndex) || monIndex < 0 || monIndex >= state.teamData.length) {
        return this.errorReply(`Invalid Pokémon number. Choose between 1 and ${state.teamData.length}.`);
      }

      if (isNaN(moveSlot) || moveSlot < 0 || moveSlot > 3) {
        return this.errorReply("Invalid move slot. Choose between 1 and 4.");
      }
      
      const pokemon = state.teamData[monIndex];
      if (pokemon.moves.length <= moveSlot) {
         return this.errorReply(`Invalid move slot. ${pokemon.species} only has ${pokemon.moves.length} moves.`);
      }

      const tmIndex = state.inventory.tms.map(tm => tm.toLowerCase().replace(/[^a-z0-9]/g, '')).indexOf(moveName);
      if (tmIndex === -1) {
        return this.errorReply(`You don't have the TM for "${parts[1]}". Check /gymchallenge status.`);
      }
      
      const species = Dex.species.get(pokemon.species);
      if (!species.exists) {
        return this.errorReply("Could not find species data.");
      }
      
      const move = Dex.moves.get(moveName);
      if (!move.exists) {
        return this.errorReply(`Move "${parts[1]}" does not exist.`);
      }

      // Check learnset
      // --- THIS IS THE FIX ---
      // Call getLearnset on Dex.data.Learnsets (the data object)
      const learnset = Dex.data.Learnsets[species.id];
      // --- END FIX ---
      
      if (!learnset || !learnset[move.id]) {
        return this.errorReply(`${species.name} cannot learn ${move.name}.`);
      }
      
      // All checks passed. Consume TM and teach move.
      const consumedTM = state.inventory.tms.splice(tmIndex, 1)[0];
      const oldMove = pokemon.moves[moveSlot];
      pokemon.moves[moveSlot] = move.id;

      this.sendReply(`Success! ${species.name} forgot ${oldMove} and learned ${move.name}!`);
      this.sendReply(`You used the TM for ${consumedTM}.`);
    },

    giveitem(target, room, user) {
      const state = activeRuns.get(user.id);
      if (!state) {
        return this.errorReply("You don't have an active gym challenge.");
      }

      const parts = target.split('|').map(p => p.trim());
      if (parts.length !== 2) {
        return this.errorReply("Usage: /gymchallenge giveitem [pokemon number] | [item name]");
      }

      const monIndex = parseInt(parts[0]) - 1;
      const itemName = parts[1];
      const itemID = itemName.toLowerCase().replace(/[^a-z0-9]/g, '');

      if (isNaN(monIndex) || monIndex < 0 || monIndex >= state.teamData.length) {
        return this.errorReply(`Invalid Pokémon number. Choose between 1 and ${state.teamData.length}.`);
      }
      
      const pokemon = state.teamData[monIndex];

      const itemIndex = state.inventory.items.map(item => item.toLowerCase().replace(/[^a-z0-9]/g, '')).indexOf(itemID);
      if (itemIndex === -1) {
        return this.errorReply(`You don't have "${itemName}" in your inventory. Check /gymchallenge status.`);
      }
      
      // Get the proper-cased item name before consuming it
      const consumedItem = state.inventory.items.splice(itemIndex, 1)[0];
      
      // Swap items: put the pokemon's old item back in the inventory
      const oldItem = pokemon.item;
      pokemon.item = consumedItem;

      if (oldItem) {
        state.inventory.items.push(oldItem);
        this.sendReply(`Success! ${pokemon.species} is now holding ${consumedItem}.`);
        this.sendReply(`${oldItem} was returned to your inventory.`);
      } else {
        this.sendReply(`Success! ${pokemon.species} is now holding ${consumedItem}.`);
      }
    },

    status(target, room, user) {
      const state = activeRuns.get(user.id);
      if (!state) {
        return this.errorReply("You don't have an active gym challenge.");
      }

      const nextGym = GYM_LEADERS[state.currentGym];
      let message = `<div class="infobox"><strong>Gym Challenge Status</strong><br/>`;
      message += `Current Gym: ${state.currentGym + 1}/8 (${nextGym ? nextGym.name : 'Complete'})<br/>`;
      message += `Lives: ${state.lives}<br/>`;
      message += `Badges: ${state.badges.join(', ') || 'None'}<br/>`;
      message += `Rewards: ${state.rewards.join(', ') || 'None'}<br/>`;
      message += `TMs: ${state.inventory.tms.join(', ') || 'None'}<br/>`;
      message += `Items: ${state.inventory.items.join(', ') || 'None'}</div>`;
      
      this.sendReplyBox(message);

      this.sendReplyBox(`<strong>Your Team:</strong><br />` + state.teamData.map((mon, i) => {
        return `${i + 1}. <strong>${mon.species}</strong> (Lvl ${mon.level}) @ ${mon.item || 'Nothing'} - Moves: ${mon.moves.join(', ')}`;
      }).join('<br />'));
    },

    abandon(target, room, user) {
      if (!activeRuns.has(user.id) && !pendingStarters.has(user.id)) {
        return this.errorReply("You don't have an active gym challenge or pending starter choice.");
      }

      activeRuns.delete(user.id);
      pendingRewards.delete(user.id);
      pendingStarters.delete(user.id); // Clear pending starter choice
      this.sendReply("Your gym challenge run has been abandoned.");
    },
  },
};
