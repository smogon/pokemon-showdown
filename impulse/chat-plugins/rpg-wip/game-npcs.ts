import type { NPCData, TrainerSpec } from './interface';

/**
 * Game NPCs & Story Configuration
 *
 * This file contains all NPC and story-related data including:
 * - NPCs and their dialogues
 * - Trainers and their parties
 * - Trainer locations (where trainers can be found)
 * - Gym badges and leaders
 * - Story events and triggers
 *
 * Edit this file to create new stories and adventures.
 */

// ============================================================================
// NPCS
// ============================================================================

export const NPC_DATABASE: Record<string, NPCData> = {
	professoroak: {
		id: 'professoroak',
		name: 'Professor Oak',
		location: 'pallettown',
		dialogue: "Welcome! The world of Pokemon awaits! Choose your starter wisely!",
		action: {
			type: 'choosestarter',
			starterLevel: 5,
			onceOnly: true,
		},
	},
	bill: {
		id: 'bill',
		name: 'Bill',
		location: 'route25',
		dialogue: "Thanks for helping me! Take this S.S. Ticket as a reward!",
		action: {
			type: 'giveitem',
			itemId: 'ssticket',
			onceOnly: true,
		},
	},
	professorelm: {
		id: 'professorelm',
		name: 'Professor Elm',
		location: 'newbarktown',
		dialogue: "Welcome to Johto! Your journey continues here!",
		action: {
			type: 'dialogue',
		},
	},
};

// ============================================================================
// TRAINERS
// ============================================================================

export const TRAINER_DATABASE: Record<string, TrainerSpec> = {
	// Kanto Gym Leaders
	brock: {
		name: 'Brock (Boulder Badge)',
		money: 1400,
		party: [
			{ species: 'geodude', level: 12, moves: ['tackle', 'defensecurl', 'rockthrow'] },
			{ species: 'onix', level: 14, moves: ['tackle', 'screech', 'bind', 'rockthrow'] },
		],
		dialogue: {
			start: "I'm Brock! I'm Pewter's Gym Leader! My rock-hard will shall overcome!",
			win: "I took you for granted. Here is the Boulder Badge!",
			lose: "Your Pokemon's powerful attacks overcame my rock-hard defense!",
		},
	},
	misty: {
		name: 'Misty (Cascade Badge)',
		money: 1800,
		party: [
			{ species: 'staryu', level: 18, moves: ['tackle', 'harden', 'watergun', 'rapidspin'] },
			{ species: 'starmie', level: 21, moves: ['tackle', 'watergun', 'rapidspin', 'recover'] },
		],
		dialogue: {
			start: "I'm Misty! Cerulean's Gym Leader! Prepare to get soaked!",
			win: "Wow! You're too much! Here's the Cascade Badge!",
			lose: "You really know your stuff! Take this!",
		},
	},
	surge: {
		name: 'Lt. Surge (Thunder Badge)',
		money: 2400,
		party: [
			{ species: 'voltorb', level: 21, moves: ['tackle', 'screech', 'sonicboom', 'spark'] },
			{ species: 'pikachu', level: 18, moves: ['quickattack', 'thunderwave', 'spark', 'slam'] },
			{ species: 'raichu', level: 24, moves: ['thundershock', 'thunderwave', 'slam', 'thunderbolt'] },
		],
		dialogue: {
			start: "Ten-hut! Lt. Surge, the Lightning American, here! You want to battle me?",
			win: "Amazing! You're strong! Take the Thunder Badge!",
			lose: "A shocking defeat! You're electrifying!",
		},
	},
	erika: {
		name: 'Erika (Rainbow Badge)',
		money: 2800,
		party: [
			{ species: 'victreebel', level: 29, moves: ['poisonpowder', 'acid', 'razorleaf', 'sleeppowder'] },
			{ species: 'tangela', level: 24, moves: ['bind', 'poisonpowder', 'vinewhip', 'growth'] },
			{ species: 'vileplume', level: 29, moves: ['poisonpowder', 'stunspore', 'acid', 'petalblizzard'] },
		],
		dialogue: {
			start: "Hello... Lovely weather, isn't it? It's so pleasant... I'm Erika, the Gym Leader.",
			win: "Oh! I concede defeat... You are remarkably strong. Take this Rainbow Badge.",
			lose: "Nature always wins... Such is the law of the world.",
		},
	},
	koga: {
		name: 'Koga (Soul Badge)',
		money: 3200,
		party: [
			{ species: 'koffing', level: 37, moves: ['tackle', 'smokescreen', 'sludge', 'selfdestruct'] },
			{ species: 'muk', level: 39, moves: ['poisongas', 'sludge', 'minimize', 'sludgebomb'] },
			{ species: 'koffing', level: 37, moves: ['tackle', 'smokescreen', 'sludge', 'selfdestruct'] },
			{ species: 'weezing', level: 43, moves: ['tackle', 'sludge', 'smokescreen', 'sludgebomb'] },
		],
		dialogue: {
			start: "Fwahahaha! A mere child like you dares to challenge me? Poison is the ultimate weapon!",
			win: "Humph! You have proven your worth. Here is the Soul Badge!",
			lose: "Poison techniques are the way of the ninja!",
		},
	},
	sabrina: {
		name: 'Sabrina (Marsh Badge)',
		money: 3600,
		party: [
			{ species: 'kadabra', level: 38, moves: ['psybeam', 'reflect', 'futuresight', 'psyshock'] },
			{ species: 'mrmine', level: 37, moves: ['confusion', 'barrier', 'psywave', 'dazzlinggleam'] },
			{ species: 'venomoth', level: 38, moves: ['psybeam', 'supersonic', 'poisonpowder', 'gust'] },
			{ species: 'alakazam', level: 43, moves: ['psybeam', 'recover', 'psychic', 'futuresight'] },
		],
		dialogue: {
			start: "I had a vision of your arrival. I have had psychic powers since I was a child.",
			win: "I'm shocked! Your power exceeds my vision. Take the Marsh Badge.",
			lose: "Your mind cannot overcome mine!",
		},
	},
	blaine: {
		name: 'Blaine (Volcano Badge)',
		money: 4000,
		party: [
			{ species: 'growlithe', level: 42, moves: ['ember', 'leer', 'takedown', 'flamethrower'] },
			{ species: 'ponyta', level: 40, moves: ['ember', 'stomp', 'firespin', 'bounce'] },
			{ species: 'rapidash', level: 42, moves: ['ember', 'stomp', 'firespin', 'flareblitz'] },
			{ species: 'arcanine', level: 47, moves: ['takedown', 'fireblast', 'extremespeed', 'crunch'] },
		],
		dialogue: {
			start: "Hah! I am Blaine! I am the Leader of Cinnabar Gym! My fiery Pokemon will incinerate all challengers!",
			win: "I have burned out! You have earned the Volcano Badge!",
			lose: "Fire always triumphs!",
		},
	},
	giovanni: {
		name: 'Giovanni (Earth Badge)',
		money: 5000,
		party: [
			{ species: 'rhyhorn', level: 45, moves: ['stomp', 'earthquake', 'rockslide', 'takedown'] },
			{ species: 'dugtrio', level: 42, moves: ['dig', 'slash', 'earthquake', 'sandstorm'] },
			{ species: 'nidoqueen', level: 44, moves: ['bodyslam', 'earthquake', 'poisonsting', 'thunderbolt'] },
			{ species: 'nidoking', level: 45, moves: ['bodyslam', 'earthquake', 'megahorn', 'icebeam'] },
			{ species: 'rhydon', level: 50, moves: ['earthquake', 'rockslide', 'megahorn', 'stoneedge'] },
		],
		dialogue: {
			start: "Welcome to my Gym! I am Giovanni, the Gym Leader! For your insolence, I will crush you!",
			win: "Ha! That was a truly intense fight. You have won! Take the Earth Badge!",
			lose: "Team Rocket's glory shall never fade!",
		},
	},

	// Johto Gym Leaders
	falkner: {
		name: 'Falkner (Zephyr Badge)',
		money: 1400,
		party: [
			{ species: 'pidgey', level: 57, moves: ['gust', 'sandattack', 'quickattack', 'wingattack'] },
			{ species: 'pidgeotto', level: 60, moves: ['gust', 'quickattack', 'wingattack', 'aerialace'] },
		],
		dialogue: {
			start: "I'm Falkner! Violet's Gym Leader! I'll show you the magnificent power of my Bird Pokemon!",
			win: "I understand... Here's the Zephyr Badge.",
			lose: "My Flying Pokemon soar above all!",
		},
	},
	bugsy: {
		name: 'Bugsy (Hive Badge)',
		money: 1600,
		party: [
			{ species: 'metapod', level: 59, moves: ['harden', 'tackle'] },
			{ species: 'kakuna', level: 59, moves: ['harden', 'poisonsting'] },
			{ species: 'scyther', level: 64, moves: ['quickattack', 'slash', 'uturn', 'aerialace'] },
		],
		dialogue: {
			start: "I'm Bugsy! Azalea's Gym Leader! Bug Pokemon are deep and profound!",
			win: "Whoa, amazing! You're an expert on Pokemon! Take the Hive Badge!",
			lose: "Bug Pokemon rule the world!",
		},
	},
	whitney: {
		name: 'Whitney (Plain Badge)',
		money: 2000,
		party: [
			{ species: 'clefairy', level: 63, moves: ['doubleslap', 'encore', 'metronome', 'bodyslam'] },
			{ species: 'miltank', level: 67, moves: ['rollout', 'bodyslam', 'attract', 'stomp'] },
		],
		dialogue: {
			start: "I'm Whitney! Everyone was into Pokemon, so I got into it too! I'm cute, strong, and I cry sometimes!",
			win: "Waaah! You're too strong! Take the Plain Badge!",
			lose: "Cuteness is power!",
		},
	},
	morty: {
		name: 'Morty (Fog Badge)',
		money: 2400,
		party: [
			{ species: 'gastly', level: 66, moves: ['curse', 'hypnosis', 'lick', 'shadowball'] },
			{ species: 'haunter', level: 66, moves: ['curse', 'hypnosis', 'shadowpunch', 'shadowball'] },
			{ species: 'gengar', level: 70, moves: ['hypnosis', 'shadowball', 'sludgebomb', 'dreameater'] },
			{ species: 'haunter', level: 66, moves: ['curse', 'hypnosis', 'shadowpunch', 'shadowball'] },
		],
		dialogue: {
			start: "I'm Morty, of Ecruteak. I see what others cannot. I have foreseen that you would come.",
			win: "I'm not good enough yet... Here, take the Fog Badge.",
			lose: "My visions are absolute!",
		},
	},
	jasmine: {
		name: 'Jasmine (Mineral Badge)',
		money: 2800,
		party: [
			{ species: 'magnemite', level: 68, moves: ['thundershock', 'supersonic', 'sonicboom', 'thunderwave'] },
			{ species: 'magnemite', level: 68, moves: ['thundershock', 'supersonic', 'sonicboom', 'thunderwave'] },
			{ species: 'steelix', level: 73, moves: ['screech', 'rockthrow', 'ironta il', 'crunch'] },
		],
		dialogue: {
			start: "Thank you for helping Amphy... I'm Jasmine, the Gym Leader. I use the Steel-type.",
			win: "You are a truly strong trainer. Please take the Mineral Badge.",
			lose: "Steel Pokemon are resilient!",
		},
	},
	chuck: {
		name: 'Chuck (Storm Badge)',
		money: 3000,
		party: [
			{ species: 'primeape', level: 69, moves: ['karatechop', 'rage', 'seismictoss', 'crosschop'] },
			{ species: 'poliwrath', level: 72, moves: ['surf', 'bodyslam', 'submission', 'dynamicpunch'] },
		],
		dialogue: {
			start: "WAHAHA! I'm Chuck! The Fighting-type Gym Leader! Let's get physical!",
			win: "Wha? Huh? I lost! Here, take the Storm Badge!",
			lose: "Fighting spirit conquers all!",
		},
	},
	pryce: {
		name: 'Pryce (Glacier Badge)',
		money: 3200,
		party: [
			{ species: 'seel', level: 70, moves: ['icebeam', 'headbutt', 'aurorabeam', 'rest'] },
			{ species: 'dewgong', level: 70, moves: ['icebeam', 'surf', 'aurorabeam', 'rest'] },
			{ species: 'piloswine', level: 74, moves: ['earthquake', 'iceshard', 'blizzard', 'amnesia'] },
		],
		dialogue: {
			start: "I am Pryce, the winter trainer. I have trained in the cold for 30 years!",
			win: "Your passion for Pokemon melted my icy heart! Take the Glacier Badge!",
			lose: "Ice is the ultimate defense!",
		},
	},
	clair: {
		name: 'Clair (Rising Badge)',
		money: 4000,
		party: [
			{ species: 'dragonair', level: 73, moves: ['surf', 'slam', 'dragonbreath', 'thunderwave'] },
			{ species: 'dragonair', level: 73, moves: ['icebeam', 'slam', 'dragonbreath', 'thunderwave'] },
			{ species: 'dragonair', level: 73, moves: ['fireblast', 'slam', 'dragonbreath', 'thunderwave'] },
			{ species: 'kingdra', level: 78, moves: ['surf', 'smokescreen', 'dragonbreath', 'hydropump'] },
		],
		dialogue: {
			start: "I am Clair. The world's best dragon trainer! You will not defeat my dragons!",
			win: "I can't believe it... You're strong. Take the Rising Badge.",
			lose: "Dragon types are supreme!",
		},
	},

	// Hoenn Gym Leaders (Badges 17-24)
	roxanne: {
		name: 'Roxanne (Stone Badge)',
		money: 4500,
		party: [
			{ species: 'geodude', level: 74, moves: ['rockthrow', 'defensecurl', 'rollout', 'earthquake'] },
			{ species: 'nosepass', level: 77, moves: ['rockslide', 'thunderbolt', 'block', 'sandstorm'] },
		],
		dialogue: { start: "I'm Roxanne, Rustboro Gym Leader. Rock types are my specialty!", win: "Your Pokemon are impressive. Take the Stone Badge.", lose: "Rock solid power!" },
	},
	brawly: {
		name: 'Brawly (Knuckle Badge)',
		money: 4700,
		party: [
			{ species: 'machop', level: 76, moves: ['karatechop', 'vitalthrow', 'seismictoss', 'crosschop'] },
			{ species: 'makuhita', level: 79, moves: ['armthrust', 'vitalthrow', 'reversal', 'closecombat'] },
		],
		dialogue: { start: "I'm Brawly! Let's see your fighting spirit!", win: "You've got serious strength!", lose: "Fighting spirit never dies!" },
	},
	wattson: {
		name: 'Wattson (Dynamo Badge)',
		money: 4900,
		party: [
			{ species: 'voltorb', level: 78, moves: ['spark', 'sonicboom', 'selfdestruct', 'explosion'] },
			{ species: 'magneton', level: 79, moves: ['thunderbolt', 'sonicboom', 'supersonic', 'screech'] },
			{ species: 'manectric', level: 82, moves: ['thunderbolt', 'quickattack', 'bite', 'thunder'] },
		],
		dialogue: { start: "Wahahahaha! I'm Wattson! Prepare to be shocked!", win: "You're electrifying! Take the Dynamo Badge!", lose: "The power of electricity!" },
	},
	flannery: {
		name: 'Flannery (Heat Badge)',
		money: 5100,
		party: [
			{ species: 'slugma', level: 80, moves: ['ember', 'rockthrow', 'harden', 'flamethrower'] },
			{ species: 'camerupt', level: 81, moves: ['earthquake', 'overheat', 'rockslide', 'eruption'] },
			{ species: 'torkoal', level: 83, moves: ['overheat', 'bodyslam', 'flamethrower', 'irondefense'] },
		],
		dialogue: { start: "I'm Flannery! My fiery passion will overwhelm you!", win: "Your intensity burns bright!", lose: "Feel the heat!" },
	},
	norman: {
		name: 'Norman (Balance Badge)',
		money: 5300,
		party: [
			{ species: 'slaking', level: 84, moves: ['yawn', 'facade', 'feintattack', 'hyperbeam'] },
			{ species: 'vigoroth', level: 82, moves: ['slash', 'furycutter', 'endure', 'reversal'] },
			{ species: 'slaking', level: 86, moves: ['hyperbeam', 'counter', 'facade', 'earthquake'] },
		],
		dialogue: { start: "I'm Norman, your father! Show me what you've learned!", win: "I'm proud of you! Take the Balance Badge!", lose: "That's my child!" },
	},
	winona: {
		name: 'Winona (Feather Badge)',
		money: 5500,
		party: [
			{ species: 'swablu', level: 83, moves: ['perish song', 'mirrorof', 'safeguard', 'aerialace'] },
			{ species: 'tropius', level: 83, moves: ['sunnyday', 'synthesis', 'solarbeam', 'aerialace'] },
			{ species: 'pelipper', level: 84, moves: ['watersport', 'stockpile', 'swallow', 'surf'] },
			{ species: 'altaria', level: 87, moves: ['earthquake', 'dragonbreath', 'dragondance', 'aerialace'] },
		],
		dialogue: { start: "I'm Winona! My bird Pokemon dance in the sky!", win: "You truly soar! Take the Feather Badge!", lose: "Grace of the skies!" },
	},
	tateandliza: {
		name: 'Tate & Liza (Mind Badge)',
		money: 5700,
		party: [
			{ species: 'lunatone', level: 86, moves: ['hypnosis', 'psychic', 'lightscreen', 'cosmicpower'] },
			{ species: 'solrock', level: 86, moves: ['sunnyday', 'solarbeam', 'psychic', 'flamethrower'] },
		],
		dialogue: { start: "We are Tate and Liza! Our minds are one!", win: "Your bond with your Pokemon rivals ours!", lose: "Unity is strength!" },
	},
	juan: {
		name: 'Juan (Rain Badge)',
		money: 6000,
		party: [
			{ species: 'luvdisc', level: 85, moves: ['watergun', 'attract', 'sweetkiss', 'waterpulse'] },
			{ species: 'whiscash', level: 86, moves: ['earthquake', 'surf', 'amnesia', 'rest'] },
			{ species: 'sealeo', level: 86, moves: ['bodyslam', 'surf', 'aurorabeam', 'hail'] },
			{ species: 'crawdaunt', level: 87, moves: ['crabhammer', 'swordsdance', 'surf', 'guillotine'] },
			{ species: 'kingdra', level: 89, moves: ['waterpulse', 'smokescreen', 'icebeam', 'hydropump'] },
		],
		dialogue: { start: "I am Juan, master of Water Pokemon! Beauty and elegance!", win: "Magnifique! Take the Rain Badge!", lose: "The beauty of water!" },
	},

	// Sinnoh Gym Leaders (Badges 25-32)
	roark: {
		name: 'Roark (Coal Badge)',
		money: 6200,
		party: [
			{ species: 'geodude', level: 86, moves: ['rockthrow', 'rollout', 'magnitude', 'rockslide'] },
			{ species: 'onix', level: 87, moves: ['screech', 'rockthrow', 'rockslide', 'ironhead'] },
			{ species: 'cranidos', level: 90, moves: ['headbutt', 'zenheadbutt', 'pursuit', 'headsmash'] },
		],
		dialogue: { start: "I'm Roark! I'll show you the power of Rock Pokemon!", win: "Your Pokemon are rock solid! Coal Badge is yours!", lose: "Mining through opposition!" },
	},
	gardenia: {
		name: 'Gardenia (Forest Badge)',
		money: 6400,
		party: [
			{ species: 'cherubi', level: 87, moves: ['magicalleaf', 'leechseed', 'grassknot', 'solarbeam'] },
			{ species: 'turtwig', level: 88, moves: ['razorleaf', 'curse', 'bite', 'absorb'] },
			{ species: 'roserade', level: 91, moves: ['grassknot', 'sludgebomb', 'gigadrain', 'weatherball'] },
		],
		dialogue: { start: "I'm Gardenia! Grass Pokemon are my life!", win: "You've blossomed beautifully! Forest Badge!", lose: "Nature's power!" },
	},
	fantina: {
		name: 'Fantina (Relic Badge)',
		money: 6600,
		party: [
			{ species: 'duskull', level: 89, moves: ['shadowsneak', 'confuseray', 'shadowball', 'willowisp'] },
			{ species: 'haunter', level: 89, moves: ['shadowclaw', 'confuseray', 'shadowball', 'sludgebomb'] },
			{ species: 'mismagius', level: 92, moves: ['psybeam', 'shadowball', 'magicalleaf', 'confuseray'] },
		],
		dialogue: { start: "I am Fantina! Ghosts are très magnifique!", win: "C'est la vie! The Relic Badge is yours!", lose: "Spectral beauty!" },
	},
	maylene: {
		name: 'Maylene (Cobble Badge)',
		money: 6800,
		party: [
			{ species: 'meditite', level: 90, moves: ['drainpunch', 'confusion', 'detect', 'highjumpkick'] },
			{ species: 'machoke', level: 90, moves: ['karatechop', 'seismictoss', 'rockslide', 'revenge'] },
			{ species: 'lucario', level: 93, moves: ['forcepulm', 'boneme rush', 'aurasphere', 'metalclaw'] },
		],
		dialogue: { start: "I'm Maylene! Fighting is my way!", win: "You've got true fighting spirit!", lose: "Combat excellence!" },
	},
	crasherwake: {
		name: 'Crasher Wake (Fen Badge)',
		money: 7000,
		party: [
			{ species: 'gyarados', level: 91, moves: ['waterfall', 'icefang', 'bite', 'aquatail'] },
			{ species: 'quagsire', level: 91, moves: ['surf', 'earthquake', 'rockslide', 'recover'] },
			{ species: 'floatzel', level: 94, moves: ['crunch', 'aquajet', 'icebeam', 'aquatail'] },
		],
		dialogue: { start: "I am the torrential Crasher Wake!", win: "CRASHER WAKE! You are strong! Fen Badge!", lose: "The crashing waves!" },
	},
	byron: {
		name: 'Byron (Mine Badge)',
		money: 7200,
		party: [
			{ species: 'magneton', level: 92, moves: ['thunderbolt', 'triattack', 'metalsound', 'flashcannon'] },
			{ species: 'steelix', level: 92, moves: ['earthquake', 'ironhead', 'crunch', 'sandstorm'] },
			{ species: 'bastiodon', level: 95, moves: ['metalburst', 'ironhead', 'stoneedge', 'flashcannon'] },
		],
		dialogue: { start: "I'm Byron! Steel is the strongest!", win: "Your Pokemon shine! Mine Badge is yours!", lose: "Steel forged in battle!" },
	},
	candice: {
		name: 'Candice (Icicle Badge)',
		money: 7400,
		party: [
			{ species: 'sneasel', level: 93, moves: ['iceshard', 'slash', 'avalanche', 'icebeam'] },
			{ species: 'piloswine', level: 93, moves: ['earthquake', 'avalanche', 'iceshard', 'stoneedge'] },
			{ species: 'abomasnow', level: 94, moves: ['grassknot', 'iceshard', 'blizzard', 'woodhammer'] },
			{ species: 'froslass', level: 96, moves: ['ominouswind', 'blizzard', 'psychic', 'shadowball'] },
		],
		dialogue: { start: "I'm Candice! Ice Pokemon freeze all!", win: "You melted my defenses! Icicle Badge!", lose: "Frozen perfection!" },
	},
	volkner: {
		name: 'Volkner (Beacon Badge)',
		money: 7600,
		party: [
			{ species: 'raichu', level: 94, moves: ['thunderbolt', 'quickattack', 'irontail', 'voltswitch'] },
			{ species: 'luxray', level: 95, moves: ['crunch', 'thunderfang', 'icefang', 'wildcharge'] },
			{ species: 'electivire', level: 96, moves: ['thunderpunch', 'crosschop', 'earthquake', 'gigaimpact'] },
			{ species: 'jolteon', level: 97, moves: ['thunderbolt', 'shadowball', 'signalbeam', 'thunder'] },
		],
		dialogue: { start: "I'm Volkner! Finally, a worthy challenge!", win: "You electrified me! Beacon Badge is yours!", lose: "Ultimate electricity!" },
	},

	// Unova Gym Leaders (Badges 33-40)
	striatonbrothers: {
		name: 'Striaton Brothers (Trio Badge)',
		money: 7800,
		party: [
			{ species: 'pansage', level: 94, moves: ['vinewhip', 'bite', 'seedbomb', 'solarbeam'] },
			{ species: 'pansear', level: 94, moves: ['incinerate', 'bite', 'flamethrower', 'fireblast'] },
			{ species: 'panpour', level: 94, moves: ['watergun', 'bite', 'scald', 'hydropump'] },
		],
		dialogue: { start: "We are Cilan, Chili, and Cress! Three brothers, one goal!", win: "A tri-fecta of talent! Trio Badge!", lose: "Three types, one victory!" },
	},
	lenora: {
		name: 'Lenora (Basic Badge)',
		money: 8000,
		party: [
			{ species: 'watchog', level: 95, moves: ['crunch', 'hypnosis', 'superfang', 'retaliate'] },
			{ species: 'lil lipup', level: 96, moves: ['takedown', 'workup', 'crunch', 'gigaimpact'] },
		],
		dialogue: { start: "I'm Lenora! History and Pokemon are my passions!", win: "You've made history! Basic Badge!", lose: "Knowledge is power!" },
	},
	burgh: {
		name: 'Burgh (Insect Badge)',
		money: 8200,
		party: [
			{ species: 'whirlipede', level: 96, moves: ['poisontail', 'screech', 'steamroller', 'venoshock'] },
			{ species: 'dwebble', level: 96, moves: ['smackdown', 'rockslide', 'bugbite', 'shellsmash'] },
			{ species: 'leavanny', level: 99, moves: ['stringshot', 'bugbuzz', 'leafblade', 'swordsdance'] },
		],
		dialogue: { start: "I'm Burgh, the artistic Bug Pokemon master!", win: "Your battle art is beautiful! Insect Badge!", lose: "Artistic excellence!" },
	},
	elesa: {
		name: 'Elesa (Bolt Badge)',
		money: 8400,
		party: [
			{ species: 'emolga', level: 97, moves: ['voltswitch', 'aerialace', 'electroball', 'acrobatics'] },
			{ species: 'zebstrika', level: 98, moves: ['flamech arge', 'pursuit', 'wildcharge', 'overheat'] },
		],
		dialogue: { start: "I'm Elesa! My Pokemon shine like stars!", win: "You're dazzling! Bolt Badge is yours!", lose: "Electrifying beauty!" },
	},
	clay: {
		name: 'Clay (Quake Badge)',
		money: 8600,
		party: [
			{ species: 'krokorok', level: 98, moves: ['crunch', 'dig', 'earthquake', 'stoneedge'] },
			{ species: 'palpitoad', level: 98, moves: ['mudshot', 'aquaring', 'surf', 'earthpower'] },
			{ species: 'excadrill', level: 100, moves: ['rockslide', 'earthquake', 'slash', 'horndrill'] },
		],
		dialogue: { start: "I'm Clay! I dig for victory!", win: "You struck gold! Quake Badge!", lose: "Earth-shaking power!" },
	},
	skyla: {
		name: 'Skyla (Jet Badge)',
		money: 8800,
		party: [
			{ species: 'swoobat', level: 99, moves: ['acrobatics', 'psychic', 'airslash', 'attract'] },
			{ species: 'unfezant', level: 99, moves: ['quickattack', 'skyattack', 'detect', 'aerialace'] },
			{ species: 'swanna', level: 100, moves: ['bubblebeam', 'airslash', 'bravebird', 'hurricane'] },
		],
		dialogue: { start: "I'm Skyla! The sky is my playground!", win: "You soared to victory! Jet Badge!", lose: "Wings of freedom!" },
	},
	brycen: {
		name: 'Brycen (Freeze Badge)',
		money: 9000,
		party: [
			{ species: 'vanillish', level: 99, moves: ['iciclespear', 'mirrorshot', 'blizzard', 'flashcannon'] },
			{ species: 'cryogonal', level: 99, moves: ['rapidspin', 'icebeam', 'recover', 'solarbeam'] },
			{ species: 'beartic', level: 100, moves: ['brine', 'iciclecrash', 'swagger', 'superpower'] },
		],
		dialogue: { start: "I'm Brycen! Former actor, now Ice master!", win: "A performance worthy of applause! Freeze Badge!", lose: "Cold as ice!" },
	},
	drayden: {
		name: 'Drayden (Legend Badge)',
		money: 9200,
		party: [
			{ species: 'druddigon', level: 100, moves: ['dragonrage', 'slash', 'revenge', 'dragontail'] },
			{ species: 'flygon', level: 100, moves: ['earthquake', 'dragonclaw', 'crunch', 'gigaimpact'] },
			{ species: 'haxorus', level: 100, moves: ['dragonpulse', 'assurance', 'slash', 'dragondance'] },
		],
		dialogue: { start: "I'm Drayden! Mayor and Dragon Master!", win: "You are legendary! Legend Badge is yours!", lose: "Dragon supremacy!" },
	},

	// Regular Trainers
	youngsterjoey: {
		name: 'Youngster Joey',
		money: 200,
		party: [
			{ species: 'rattata', level: 5, moves: ['tackle', 'tailwhip'] },
		],
		dialogue: {
			start: "My Rattata is in the top percentage of Rattata!",
			win: "I'll never give up!",
			lose: "You're tough!",
		},
	},
};

// ============================================================================
// TRAINER LOCATIONS
// ============================================================================

export const TRAINER_LOCATIONS: Record<string, string[]> = {
	'grassypath': ['youngsterjoey'],
};

// ============================================================================
// BADGES
// ============================================================================

export interface BadgeInfo {
	gymLeaderId: string;
	badgeName: string;
	order: number;
	description?: string;
}

export const BADGES: BadgeInfo[] = [
	// Kanto Badges (0-7, order 1-8)
	{ gymLeaderId: 'brock', badgeName: 'Boulder Badge', order: 1, description: 'Pewter City - Rock Badge' },
	{ gymLeaderId: 'misty', badgeName: 'Cascade Badge', order: 2, description: 'Cerulean City - Water Badge' },
	{ gymLeaderId: 'surge', badgeName: 'Thunder Badge', order: 3, description: 'Vermilion City - Electric Badge' },
	{ gymLeaderId: 'erika', badgeName: 'Rainbow Badge', order: 4, description: 'Celadon City - Grass Badge' },
	{ gymLeaderId: 'koga', badgeName: 'Soul Badge', order: 5, description: 'Fuchsia City - Poison Badge' },
	{ gymLeaderId: 'sabrina', badgeName: 'Marsh Badge', order: 6, description: 'Saffron City - Psychic Badge' },
	{ gymLeaderId: 'blaine', badgeName: 'Volcano Badge', order: 7, description: 'Cinnabar Island - Fire Badge' },
	{ gymLeaderId: 'giovanni', badgeName: 'Earth Badge', order: 8, description: 'Viridian City - Ground Badge' },
	
	// Johto Badges (8-15, order 9-16)
	{ gymLeaderId: 'falkner', badgeName: 'Zephyr Badge', order: 9, description: 'Violet City - Flying Badge' },
	{ gymLeaderId: 'bugsy', badgeName: 'Hive Badge', order: 10, description: 'Azalea Town - Bug Badge' },
	{ gymLeaderId: 'whitney', badgeName: 'Plain Badge', order: 11, description: 'Goldenrod City - Normal Badge' },
	{ gymLeaderId: 'morty', badgeName: 'Fog Badge', order: 12, description: 'Ecruteak City - Ghost Badge' },
	{ gymLeaderId: 'jasmine', badgeName: 'Mineral Badge', order: 13, description: 'Olivine City - Steel Badge' },
	{ gymLeaderId: 'chuck', badgeName: 'Storm Badge', order: 14, description: 'Cianwood City - Fighting Badge' },
	{ gymLeaderId: 'pryce', badgeName: 'Glacier Badge', order: 15, description: 'Mahogany Town - Ice Badge' },
	{ gymLeaderId: 'clair', badgeName: 'Rising Badge', order: 16, description: 'Blackthorn City - Dragon Badge' },
	
	// Hoenn Badges (16-23, order 17-24)
	{ gymLeaderId: 'roxanne', badgeName: 'Stone Badge', order: 17, description: 'Rustboro City - Rock Badge' },
	{ gymLeaderId: 'brawly', badgeName: 'Knuckle Badge', order: 18, description: 'Dewford Town - Fighting Badge' },
	{ gymLeaderId: 'wattson', badgeName: 'Dynamo Badge', order: 19, description: 'Mauville City - Electric Badge' },
	{ gymLeaderId: 'flannery', badgeName: 'Heat Badge', order: 20, description: 'Lavaridge Town - Fire Badge' },
	{ gymLeaderId: 'norman', badgeName: 'Balance Badge', order: 21, description: 'Petalburg City - Normal Badge' },
	{ gymLeaderId: 'winona', badgeName: 'Feather Badge', order: 22, description: 'Fortree City - Flying Badge' },
	{ gymLeaderId: 'tateandliza', badgeName: 'Mind Badge', order: 23, description: 'Mossdeep City - Psychic Badge' },
	{ gymLeaderId: 'juan', badgeName: 'Rain Badge', order: 24, description: 'Sootopolis City - Water Badge' },
	
	// Sinnoh Badges (24-31, order 25-32)
	{ gymLeaderId: 'roark', badgeName: 'Coal Badge', order: 25, description: 'Oreburgh City - Rock Badge' },
	{ gymLeaderId: 'gardenia', badgeName: 'Forest Badge', order: 26, description: 'Eterna City - Grass Badge' },
	{ gymLeaderId: 'fantina', badgeName: 'Relic Badge', order: 27, description: 'Hearthome City - Ghost Badge' },
	{ gymLeaderId: 'maylene', badgeName: 'Cobble Badge', order: 28, description: 'Veilstone City - Fighting Badge' },
	{ gymLeaderId: 'crasherwake', badgeName: 'Fen Badge', order: 29, description: 'Pastoria City - Water Badge' },
	{ gymLeaderId: 'byron', badgeName: 'Mine Badge', order: 30, description: 'Canalave City - Steel Badge' },
	{ gymLeaderId: 'candice', badgeName: 'Icicle Badge', order: 31, description: 'Snowpoint City - Ice Badge' },
	{ gymLeaderId: 'volkner', badgeName: 'Beacon Badge', order: 32, description: 'Sunyshore City - Electric Badge' },
	
	// Unova Badges (32-39, order 33-40)
	{ gymLeaderId: 'striatonbrothers', badgeName: 'Trio Badge', order: 33, description: 'Striaton City - Multi-type Badge' },
	{ gymLeaderId: 'lenora', badgeName: 'Basic Badge', order: 34, description: 'Nacrene City - Normal Badge' },
	{ gymLeaderId: 'burgh', badgeName: 'Insect Badge', order: 35, description: 'Castelia City - Bug Badge' },
	{ gymLeaderId: 'elesa', badgeName: 'Bolt Badge', order: 36, description: 'Nimbasa City - Electric Badge' },
	{ gymLeaderId: 'clay', badgeName: 'Quake Badge', order: 37, description: 'Driftveil City - Ground Badge' },
	{ gymLeaderId: 'skyla', badgeName: 'Jet Badge', order: 38, description: 'Mistralton City - Flying Badge' },
	{ gymLeaderId: 'brycen', badgeName: 'Freeze Badge', order: 39, description: 'Icirrus City - Ice Badge' },
	{ gymLeaderId: 'drayden', badgeName: 'Legend Badge', order: 40, description: 'Opelucid City - Dragon Badge' },
	
	// Kalos Badges (40-47, order 41-48) - Simplified
	{ gymLeaderId: 'kalosleader1', badgeName: 'Bug Badge', order: 41, description: 'Kalos Badge 1' },
	{ gymLeaderId: 'kalosleader2', badgeName: 'Cliff Badge', order: 42, description: 'Kalos Badge 2' },
	{ gymLeaderId: 'kalosleader3', badgeName: 'Rumble Badge', order: 43, description: 'Kalos Badge 3' },
	{ gymLeaderId: 'kalosleader4', badgeName: 'Plant Badge', order: 44, description: 'Kalos Badge 4' },
	{ gymLeaderId: 'kalosleader5', badgeName: 'Voltage Badge', order: 45, description: 'Kalos Badge 5' },
	{ gymLeaderId: 'kalosleader6', badgeName: 'Fairy Badge', order: 46, description: 'Kalos Badge 6' },
	{ gymLeaderId: 'kalosleader7', badgeName: 'Psychic Badge', order: 47, description: 'Kalos Badge 7' },
	{ gymLeaderId: 'kalosleader8', badgeName: 'Iceberg Badge', order: 48, description: 'Kalos Badge 8' },
	
	// Alola Trials (48-55, order 49-56) - Island Challenge
	{ gymLeaderId: 'alolatrial1', badgeName: 'Normalium Z', order: 49, description: 'Melemele Island Trial' },
	{ gymLeaderId: 'alolatrial2', badgeName: 'Fightinium Z', order: 50, description: 'Akala Island Trial 1' },
	{ gymLeaderId: 'alolatrial3', badgeName: 'Firium Z', order: 51, description: 'Akala Island Trial 2' },
	{ gymLeaderId: 'alolatrial4', badgeName: 'Grassium Z', order: 52, description: 'Akala Island Trial 3' },
	{ gymLeaderId: 'alolatrial5', badgeName: 'Electrium Z', order: 53, description: 'Ula\'ula Island Trial 1' },
	{ gymLeaderId: 'alolatrial6', badgeName: 'Ghostium Z', order: 54, description: 'Ula\'ula Island Trial 2' },
	{ gymLeaderId: 'alolatrial7', badgeName: 'Darkinium Z', order: 55, description: 'Po Town' },
	{ gymLeaderId: 'alolatrial8', badgeName: 'Dragonium Z', order: 56, description: 'Poni Island Trial' },
	
	// Galar Badges (56-63, order 57-64)
	{ gymLeaderId: 'galarleader1', badgeName: 'Grass Badge', order: 57, description: 'Turffield Stadium' },
	{ gymLeaderId: 'galarleader2', badgeName: 'Water Badge', order: 58, description: 'Hulbury Stadium' },
	{ gymLeaderId: 'galarleader3', badgeName: 'Fire Badge', order: 59, description: 'Motostoke Stadium' },
	{ gymLeaderId: 'galarleader4', badgeName: 'Fighting Badge', order: 60, description: 'Stow-on-Side Stadium' },
	{ gymLeaderId: 'galarleader5', badgeName: 'Fairy Badge', order: 61, description: 'Ballonlea Stadium' },
	{ gymLeaderId: 'galarleader6', badgeName: 'Rock Badge', order: 62, description: 'Circhester Stadium' },
	{ gymLeaderId: 'galarleader7', badgeName: 'Ice Badge', order: 63, description: 'Circhester Stadium' },
	{ gymLeaderId: 'galarleader8', badgeName: 'Dragon Badge', order: 64, description: 'Hammerlocke Stadium' },
	
	// Paldea Badges (64-71, order 65-72)
	{ gymLeaderId: 'paldealeader1', badgeName: 'Bug Badge', order: 65, description: 'Cortondo Gym' },
	{ gymLeaderId: 'paldealeader2', badgeName: 'Grass Badge', order: 66, description: 'Artazon Gym' },
	{ gymLeaderId: 'paldealeader3', badgeName: 'Electric Badge', order: 67, description: 'Levincia Gym' },
	{ gymLeaderId: 'paldealeader4', badgeName: 'Water Badge', order: 68, description: 'Cascarrafa Gym' },
	{ gymLeaderId: 'paldealeader5', badgeName: 'Normal Badge', order: 69, description: 'Medali Gym' },
	{ gymLeaderId: 'paldealeader6', badgeName: 'Ghost Badge', order: 70, description: 'Montenevera Gym' },
	{ gymLeaderId: 'paldealeader7', badgeName: 'Psychic Badge', order: 71, description: 'Alfornada Gym' },
	{ gymLeaderId: 'paldealeader8', badgeName: 'Ice Badge', order: 72, description: 'Glaseado Gym' },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const TOTAL_BADGES = BADGES.length;

export function getBadgeForGymLeader(gymLeaderId: string): string | undefined {
	const badge = BADGES.find(b => b.gymLeaderId === gymLeaderId);
	return badge?.badgeName;
}

export function getGymLeaderForBadge(badgeName: string): string | undefined {
	const badge = BADGES.find(b => b.badgeName === badgeName);
	return badge?.gymLeaderId;
}

export function getBadgeOrder(badgeName: string): number | undefined {
	const badge = BADGES.find(b => b.badgeName === badgeName);
	return badge?.order;
}

export function getAllBadgeNames(): string[] {
	return BADGES.map(b => b.badgeName);
}

export function isValidBadge(badgeName: string): boolean {
	return BADGES.some(b => b.badgeName === badgeName);
}

export const FIRST_BADGE_NAME = BADGES[0]?.badgeName;
export const LAST_BADGE_NAME = BADGES[BADGES.length - 1]?.badgeName;

// ============================================================================
// STORY EVENTS
// ============================================================================

export interface StoryEvent {
	id: string;
	name: string;
	description: string;
	trigger: 'location_enter' | 'trainer_defeat' | 'badge_obtain' | 'manual';
	location?: string;
	trainerId?: string;
	badgeName?: string;
	flagsRequired?: string[];
	flagsSet?: string[];
	dialogue?: string;
}

export const STORY_EVENTS: Record<string, StoryEvent> = {
	// Add your story events here
	// Example:
	// 'first_rival_battle': {
	//   id: 'first_rival_battle',
	//   name: 'First Rival Battle',
	//   description: 'Your first battle with your rival',
	//   trigger: 'location_enter',
	//   location: 'route1',
	//   flagsRequired: ['got_starter'],
	//   flagsSet: ['rival_battle_1_complete'],
	//   dialogue: 'Your rival challenges you to a battle!',
	// },
};
