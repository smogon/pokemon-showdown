/*
* Pokemon Showdown
* RPG Trainers Data
*
* This file contains trainer definitions and their location mappings.
*/

import type { TrainerSpec } from './interface';

export const TRAINER_DATABASE: Record<string, TrainerSpec> = {
	// Rival Battles
	'rival1': {
		name: 'Rival',
		money: 500,
		party: [
			{ species: 'eevee', level: 5, item: 'oranberry' },
		],
		dialogue: {
			start: "Wait up! Let's see whose Pokémon is stronger!",
			win: "What? I... I lost?!",
			lose: "Heh! I'm stronger than you!",
		},
	},
	'rival2': {
		name: 'Rival',
		money: 1500,
		party: [
			{ species: 'pidgeotto', level: 16 },
			{ species: 'flareon', level: 18, item: 'oranberry' },
		],
		dialogue: {
			start: "I've been training hard! My Eevee evolved!",
			win: "No way! I trained so much...",
			lose: "See? I'm getting stronger!",
		},
	},
	'rival3': {
		name: 'Rival',
		money: 2500,
		party: [
			{ species: 'pidgeot', level: 28 },
			{ species: 'gyarados', level: 30, moves: ['waterfall', 'bite', 'icefang', 'dragondance'] },
			{ species: 'flareon', level: 30, item: 'sitrusberry' },
		],
		dialogue: {
			start: "You're still here? Let's see if you can keep up!",
			win: "Ugh... You're tough!",
			lose: "I'm on my way to becoming Champion!",
		},
	},

	// Gym Leaders
	'gymbrock': {
		name: 'Gym Leader Brock',
		money: 1680,
		party: [
			{ species: 'geodude', level: 12, moves: ['tackle', 'defensecurl', 'rockthrow', 'rollout'] },
			{ species: 'onix', level: 14, moves: ['tackle', 'rockthrow', 'bind', 'rockpolish'], item: 'sitrusberry' },
		],
		dialogue: {
			start: "I'm Brock! I'm Pewter's Gym Leader! I believe in rock-solid defense and determination!",
			win: "I took you for granted. As proof of your victory, here's the Boulder Badge!",
			lose: "The best offense is a good defense! That's my way!",
		},
	},
	'gymmisty': {
		name: 'Gym Leader Misty',
		money: 2520,
		party: [
			{ species: 'staryu', level: 19, moves: ['watergun', 'rapidspin', 'recover', 'bubblebeam'] },
			{ species: 'starmie', level: 21, moves: ['watergun', 'confuseray', 'psychic', 'bubblebeam'], item: 'mysticwater' },
		],
		dialogue: {
			start: "Hi! I'm Misty, the Cerulean Gym Leader! I'm a Water-type specialist!",
			win: "Wow! You're too much! Here, take the Cascade Badge!",
			lose: "Was it too easy for you? Hahaha!",
		},
	},
	'gymltsurge': {
		name: 'Gym Leader Lt. Surge',
		money: 3360,
		party: [
			{ species: 'voltorb', level: 25, moves: ['spark', 'sonicboom', 'selfdestruct', 'lightscreen'] },
			{ species: 'pikachu', level: 25, moves: ['thunderbolt', 'quickattack', 'thunderwave', 'slam'] },
			{ species: 'raichu', level: 28, moves: ['thunderbolt', 'quickattack', 'thunderwave', 'bodyslam'], item: 'lumberry' },
		],
		dialogue: {
			start: "Hey kid! You want to battle me? I'm Lt. Surge, the Lightning American!",
			win: "Whoa! You're electrifying! Take the Thunder Badge!",
			lose: "Hahaha! That was electrifying!",
		},
	},
	'gymerika': {
		name: 'Gym Leader Erika',
		money: 4200,
		party: [
			{ species: 'victreebel', level: 32, moves: ['razorleaf', 'acid', 'poisonpowder', 'wrap'] },
			{ species: 'tangela', level: 32, moves: ['vinewhip', 'bind', 'poisonpowder', 'growth'] },
			{ species: 'vileplume', level: 34, moves: ['gigadrain', 'acid', 'stunspore', 'moonlight'], item: 'bigroot' },
		],
		dialogue: {
			start: "Hello... I am Erika. I am the Celadon Gym Leader. Nature and Grass Pokémon are my specialty.",
			win: "Oh! I concede defeat... You are remarkably strong. Here is the Rainbow Badge.",
			lose: "You may go now.",
		},
	},
	'gymkoga': {
		name: 'Gym Leader Koga',
		money: 5040,
		party: [
			{ species: 'koffing', level: 38, moves: ['sludge', 'smokescreen', 'selfdestruct', 'toxic'] },
			{ species: 'muk', level: 39, moves: ['sludgebomb', 'minimize', 'toxic', 'acidarmor'], item: 'blacksludge' },
			{ species: 'weezing', level: 40, moves: ['sludgebomb', 'smokescreen', 'toxic', 'explosion'] },
			{ species: 'venomoth', level: 42, moves: ['psychic', 'sludgebomb', 'toxic', 'quiverdance'], item: 'focussash' },
		],
		dialogue: {
			start: "Fwahahaha! A challenger! I am Koga, master of Poison-type Pokémon!",
			win: "Humph! You have proven your worth! Take the Soul Badge!",
			lose: "Confusion, poison... Ninjutsu is all about strategy!",
		},
	},
	'gymblaine': {
		name: 'Gym Leader Blaine',
		money: 5880,
		party: [
			{ species: 'growlithe', level: 44, moves: ['flamethrower', 'bite', 'takedown', 'roar'] },
			{ species: 'rapidash', level: 45, moves: ['fireblast', 'bounce', 'megahorn', 'quickattack'] },
			{ species: 'arcanine', level: 47, moves: ['flareblitz', 'extremespeed', 'crunch', 'wildcharge'], item: 'charcoal' },
		],
		dialogue: {
			start: "Hah! I am Blaine! I am the Leader of Cinnabar Gym! My fiery Pokémon will incinerate all challengers!",
			win: "I have burned out! You have earned the Volcano Badge!",
			lose: "Haha! Intense heat makes intense battles!",
		},
	},
	'gymsabrina': {
		name: 'Gym Leader Sabrina',
		money: 5040,
		party: [
			{ species: 'kadabra', level: 40, moves: ['psychic', 'psybeam', 'reflect', 'recover'] },
			{ species: 'mrmine', level: 40, moves: ['psychic', 'reflect', 'lightscreen', 'batonpass'], item: 'lightclay' },
			{ species: 'alakazam', level: 43, moves: ['psychic', 'shadowball', 'calmmind', 'recover'], item: 'twistedspoon' },
		],
		dialogue: {
			start: "I had a vision of your arrival. I am Sabrina, Saffron's Gym Leader!",
			win: "I... I can't... believe it... Take the Marsh Badge.",
			lose: "Everyone has psychic power! People just don't realize it!",
		},
	},
	'gymgiovanni': {
		name: 'Gym Leader Giovanni',
		money: 6720,
		party: [
			{ species: 'rhyhorn', level: 47, moves: ['earthquake', 'rockslide', 'megahorn', 'drillrun'] },
			{ species: 'nidoking', level: 48, moves: ['earthquake', 'megahorn', 'icebeam', 'thunderbolt'], item: 'lifeorb' },
			{ species: 'nidoqueen', level: 48, moves: ['earthquake', 'sludgebomb', 'icebeam', 'crunch'] },
			{ species: 'rhydon', level: 50, moves: ['earthquake', 'stoneedge', 'megahorn', 'swordsdance'], item: 'focussash' },
		],
		dialogue: {
			start: "So, you wish to challenge me? I am Giovanni, the Viridian Gym Leader and master of Ground-type Pokémon!",
			win: "Ha! That was truly impressive. Take the Earth Badge. You've earned it.",
			lose: "This is the power of earth itself!",
		},
	},

	// Regular Trainers - Route 1
	'youngsterjoey': {
		name: 'Youngster Joey',
		money: 240,
		party: [
			{ species: 'rattata', level: 6 },
		],
		dialogue: {
			start: "My Rattata is in the top percentage of Rattata!",
			win: "My Rattata needs more training...",
			lose: "See? Top percentage!",
		},
	},
	'lassalice': {
		name: 'Lass Alice',
		money: 280,
		party: [
			{ species: 'pidgey', level: 7 },
			{ species: 'caterpie', level: 7 },
		],
		dialogue: {
			start: "Want to battle? I just started my journey!",
			win: "I'll train harder next time!",
			lose: "Yay! I won!",
		},
	},

	// Elite Four
	'elitelorelei': {
		name: 'Elite Four Lorelei',
		money: 10000,
		party: [
			{ species: 'dewgong', level: 54, moves: ['icebeam', 'surf', 'signalbeam', 'rest'], item: 'chestoberry' },
			{ species: 'cloyster', level: 54, moves: ['iciclecrash', 'hydropump', 'shellsmash', 'rockblast'], item: 'focussash' },
			{ species: 'slowbro', level: 54, moves: ['icebeam', 'psychic', 'surf', 'slackoff'], item: 'leftovers' },
			{ species: 'jynx', level: 56, moves: ['blizzard', 'psychic', 'lovelykiss', 'nastyplot'], item: 'lifeorb' },
			{ species: 'lapras', level: 58, moves: ['icebeam', 'hydropump', 'thunderbolt', 'iceshard'], item: 'sitrusberry' },
		],
		dialogue: {
			start: "Welcome. I am Lorelei of the Elite Four. No one can best me when it comes to icy Pokémon!",
			win: "How dare you! You're strong... You'll make it far.",
			lose: "That's the way a true master does it!",
		},
	},
	'elitebruno': {
		name: 'Elite Four Bruno',
		money: 10000,
		party: [
			{ species: 'onix', level: 55, moves: ['earthquake', 'stoneedge', 'stealthrock', 'explosion'], item: 'custapberry' },
			{ species: 'hitmonchan', level: 55, moves: ['drainpunch', 'icepunch', 'thunderpunch', 'machpunch'], item: 'expertbelt' },
			{ species: 'hitmonlee', level: 55, moves: ['highjumpkick', 'stoneedge', 'blazekick', 'suckerpunch'], item: 'lifeorb' },
			{ species: 'machamp', level: 57, moves: ['dynamicpunch', 'stoneedge', 'payback', 'bulletpunch'], item: 'focussash' },
			{ species: 'poliwrath', level: 58, moves: ['waterfall', 'icepunch', 'earthquake', 'circlethrow'], item: 'leftovers' },
		],
		dialogue: {
			start: "I am Bruno of the Elite Four! Through rigorous training, my Fighting Pokémon have become true champions!",
			win: "My training wasn't enough... You have great strength!",
			lose: "Discipline and training are the keys to victory!",
		},
	},
	'eliteagatha': {
		name: 'Elite Four Agatha',
		money: 10000,
		party: [
			{ species: 'gengar', level: 56, moves: ['shadowball', 'sludgebomb', 'focusblast', 'taunt'], item: 'blacksludge' },
			{ species: 'golbat', level: 56, moves: ['bravebird', 'crosspoison', 'uturn', 'roost'], item: 'lifeorb' },
			{ species: 'haunter', level: 55, moves: ['shadowball', 'sludgebomb', 'willowisp', 'substitute'], item: 'focussash' },
			{ species: 'arbok', level: 57, moves: ['gunkshot', 'earthquake', 'suckerpunch', 'coil'], item: 'blacksludge' },
			{ species: 'gengar', level: 60, moves: ['shadowball', 'sludgebomb', 'thunderbolt', 'destinybond'], item: 'lifeorb' },
		],
		dialogue: {
			start: "Kekeke! I am Agatha of the Elite Four! I'll show you how frightening Poison and Ghost-type Pokémon can be!",
			win: "Oh my! You're something special...",
			lose: "Ghosts and Poison are the perfect combination!",
		},
	},
	'elitelance': {
		name: 'Elite Four Lance',
		money: 10000,
		party: [
			{ species: 'gyarados', level: 58, moves: ['waterfall', 'icefang', 'earthquake', 'dragondance'], item: 'lumberry' },
			{ species: 'dragonair', level: 56, moves: ['dragonpulse', 'icebeam', 'thunderbolt', 'agility'], item: 'leftovers' },
			{ species: 'dragonair', level: 56, moves: ['outrage', 'aquatail', 'extremespeed', 'dragondance'], item: 'lumberry' },
			{ species: 'aerodactyl', level: 58, moves: ['stoneedge', 'earthquake', 'firefang', 'wingattack'], item: 'focussash' },
			{ species: 'dragonite', level: 62, moves: ['outrage', 'earthquake', 'extremespeed', 'fireblast'], item: 'choiceband' },
		],
		dialogue: {
			start: "I am Lance, the Dragon Master! I've been waiting for a trainer strong enough to face me!",
			win: "I still can't believe it... You are truly a Dragon Master now!",
			lose: "The might of dragons is unmatched!",
		},
	},

	// Champion
	'championblue': {
		name: 'Champion Blue',
		money: 15000,
		party: [
			{ species: 'pidgeot', level: 61, moves: ['hurricane', 'heatwave', 'uturn', 'roost'], item: 'sharpbeak' },
			{ species: 'alakazam', level: 61, moves: ['psychic', 'shadowball', 'focusblast', 'calmmind'], item: 'lifeorb' },
			{ species: 'rhydon', level: 61, moves: ['earthquake', 'stoneedge', 'megahorn', 'swordsdance'], item: 'softsand' },
			{ species: 'exeggutor', level: 63, moves: ['gigadrain', 'psychic', 'sleeppowder', 'explosion'], item: 'leftovers' },
			{ species: 'gyarados', level: 63, moves: ['waterfall', 'earthquake', 'icefang', 'dragondance'], item: 'lumberry' },
			{ species: 'blastoise', level: 65, moves: ['hydropump', 'icebeam', 'earthquake', 'rapidspin'], item: 'sitrusberry' },
		],
		dialogue: {
			start: "I've been waiting for you! I'm Blue, the Pokémon League Champion! Your rival from the very beginning!",
			win: "What!? I lost!? No way! You are the new Champion!",
			lose: "I'm the Champion for a reason!",
		},
	},

	// Route Trainers - More variety
	'bugcatcherrick': {
		name: 'Bug Catcher Rick',
		money: 120,
		party: [
			{ species: 'weedle', level: 6 },
			{ species: 'caterpie', level: 6 },
		],
		dialogue: {
			start: "I love Bug Pokémon! Want to see my collection?",
			win: "My bugs need more training...",
			lose: "Bug types are the best!",
		},
	},
	'picnickerliz': {
		name: 'Picnicker Liz',
		money: 320,
		party: [
			{ species: 'nidoranf', level: 14 },
			{ species: 'nidoranm', level: 14 },
		],
		dialogue: {
			start: "Nice day for a picnic and a battle!",
			win: "You're really strong!",
			lose: "Nothing beats a victory picnic!",
		},
	},
	'hikerdan': {
		name: 'Hiker Dan',
		money: 640,
		party: [
			{ species: 'geodude', level: 15 },
			{ species: 'machop', level: 16 },
			{ species: 'onix', level: 17 },
		],
		dialogue: {
			start: "I've been training in these mountains for years!",
			win: "You've got the strength of a mountain!",
			lose: "Rock solid victory!",
		},
	},
	'cooltrainerjake': {
		name: 'Cool Trainer Jake',
		money: 1600,
		party: [
			{ species: 'nidoking', level: 38, moves: ['earthquake', 'megahorn', 'icebeam', 'thunderbolt'] },
			{ species: 'arcanine', level: 39, moves: ['flareblitz', 'extremespeed', 'wildcharge', 'crunch'] },
			{ species: 'starmie', level: 40, moves: ['hydropump', 'psychic', 'thunderbolt', 'rapidspin'] },
		],
		dialogue: {
			start: "I'm a Cool Trainer! Are you cool enough to beat me?",
			win: "You're cooler than I thought!",
			lose: "Cool Trainers never lose!",
		},
	},
	'acetrainersarah': {
		name: 'Ace Trainer Sarah',
		money: 2800,
		party: [
			{ species: 'kangaskhan', level: 46, moves: ['return', 'earthquake', 'suckerpunch', 'fakeout'], item: 'silkscarf' },
			{ species: 'vaporeon', level: 46, moves: ['surf', 'icebeam', 'shadowball', 'acidarmor'], item: 'leftovers' },
			{ species: 'alakazam', level: 47, moves: ['psychic', 'shadowball', 'focusblast', 'calmmind'], item: 'twistedspoon' },
		],
		dialogue: {
			start: "Ace Trainers only use the best strategies! Prepare yourself!",
			win: "You've truly mastered Pokémon battling!",
			lose: "That's the mark of an Ace Trainer!",
		},
	},
	'blackbeltkoji': {
		name: 'Black Belt Koji',
		money: 1200,
		party: [
			{ species: 'machoke', level: 32 },
			{ species: 'primeape', level: 32 },
			{ species: 'hitmonlee', level: 34 },
		],
		dialogue: {
			start: "My fighting spirit burns bright! Face my martial arts!",
			win: "Your spirit was stronger...",
			lose: "The path of martial arts is superior!",
		},
	},
	'scientistted': {
		name: 'Scientist Ted',
		money: 2400,
		party: [
			{ species: 'magneton', level: 43, moves: ['thunderbolt', 'flashcannon', 'triattack', 'lightscreen'] },
			{ species: 'electrode', level: 43, moves: ['thunderbolt', 'signalbeam', 'taunt', 'explosion'] },
			{ species: 'porygon', level: 45, moves: ['triattack', 'thunderbolt', 'icebeam', 'recover'] },
		],
		dialogue: {
			start: "Science will prevail! Let me demonstrate!",
			win: "My hypothesis was incorrect...",
			lose: "Science always wins!",
		},
	},

	// Additional Route Trainers
	'camperricky': {
		name: 'Camper Ricky',
		money: 480,
		party: [
			{ species: 'nidorino', level: 20 },
			{ species: 'raticate', level: 20 },
		],
		dialogue: {
			start: "I've been camping out here for days!",
			win: "Guess I need more training...",
			lose: "Camping makes you strong!",
		},
	},
	'picnickerdiana': {
		name: 'Picnicker Diana',
		money: 440,
		party: [
			{ species: 'bulbasaur', level: 18 },
			{ species: 'oddish', level: 18 },
			{ species: 'bellsprout', level: 18 },
		],
		dialogue: {
			start: "I love Grass-type Pokémon!",
			win: "Oh no! My flowers...",
			lose: "Grass types are the best!",
		},
	},
	'swimmerjack': {
		name: 'Swimmer Jack',
		money: 560,
		party: [
			{ species: 'goldeen', level: 24 },
			{ species: 'tentacool', level: 24 },
			{ species: 'staryu', level: 26 },
		],
		dialogue: {
			start: "I train with my Water Pokémon every day!",
			win: "You made a big splash!",
			lose: "Water is the source of life!",
		},
	},
	'fisherned': {
		name: 'Fisherman Ned',
		money: 720,
		party: [
			{ species: 'magikarp', level: 15 },
			{ species: 'magikarp', level: 15 },
			{ species: 'gyarados', level: 30 },
		],
		dialogue: {
			start: "I finally evolved one of my Magikarp!",
			win: "My pride and joy...",
			lose: "See? Magikarp can be strong!",
		},
	},
	'birdkeeperrobert': {
		name: 'Bird Keeper Robert',
		money: 880,
		party: [
			{ species: 'pidgeotto', level: 28 },
			{ species: 'fearow', level: 28 },
			{ species: 'dodrio', level: 30 },
		],
		dialogue: {
			start: "My Flying-type Pokémon soar above all others!",
			win: "Grounded...",
			lose: "The sky is mine!",
		},
	},
	'twinsamymay': {
		name: 'Twins Amy & May',
		money: 640,
		party: [
			{ species: 'clefairy', level: 22 },
			{ species: 'jigglypuff', level: 22 },
		],
		dialogue: {
			start: "We battle together as one!",
			win: "We'll train harder!",
			lose: "Teamwork makes the dream work!",
		},
	},
	'gentlemanthomas': {
		name: 'Gentleman Thomas',
		money: 1800,
		party: [
			{ species: 'growlithe', level: 35 },
			{ species: 'ponyta', level: 35 },
		],
		dialogue: {
			start: "A gentleman never backs down from a challenge!",
			win: "A most splendid battle, good sir!",
			lose: "Quite right, quite right!",
		},
	},
	'beautygrace': {
		name: 'Beauty Grace',
		money: 1600,
		party: [
			{ species: 'clefairy', level: 36 },
			{ species: 'wigglytuff', level: 36 },
			{ species: 'persian', level: 38 },
		],
		dialogue: {
			start: "My beautiful Pokémon will dazzle you!",
			win: "Your Pokémon are lovely too...",
			lose: "Beauty and power combined!",
		},
	},
	'psychicjohan': {
		name: 'Psychic Johan',
		money: 1440,
		party: [
			{ species: 'abra', level: 31 },
			{ species: 'kadabra', level: 31 },
			{ species: 'drowzee', level: 33 },
		],
		dialogue: {
			start: "I foresaw this battle... but not the outcome!",
			win: "My visions were clouded...",
			lose: "The future is clear to me!",
		},
	},
	'channelerpaula': {
		name: 'Channeler Paula',
		money: 1200,
		party: [
			{ species: 'gastly', level: 32 },
			{ species: 'haunter', level: 32 },
			{ species: 'gastly', level: 32 },
		],
		dialogue: {
			start: "The spirits guide my path...",
			win: "The spirits have spoken...",
			lose: "Beware the ghostly curse!",
		},
	},
	'rockervincent': {
		name: 'Rocker Vincent',
		money: 960,
		party: [
			{ species: 'voltorb', level: 29 },
			{ species: 'electrode', level: 29 },
		],
		dialogue: {
			start: "Let's rock and roll!",
			win: "That was electrifying!",
			lose: "Feel the power of rock!",
		},
	},
	'jugglershawn': {
		name: 'Juggler Shawn',
		money: 1360,
		party: [
			{ species: 'voltorb', level: 31 },
			{ species: 'voltorb', level: 31 },
			{ species: 'electrode', level: 33 },
			{ species: 'mr.mime', level: 33 },
		],
		dialogue: {
			start: "Watch carefully! Don't blink!",
			win: "I dropped the ball...",
			lose: "The hand is quicker than the eye!",
		},
	},
	'engineerbernie': {
		name: 'Engineer Bernie',
		money: 1920,
		party: [
			{ species: 'magnemite', level: 42 },
			{ species: 'magnemite', level: 42 },
			{ species: 'magneton', level: 44 },
		],
		dialogue: {
			start: "My Electric Pokémon are well-engineered!",
			win: "System overload!",
			lose: "Perfect engineering!",
		},
	},
	'burglarsimon': {
		name: 'Burglar Simon',
		money: 2160,
		party: [
			{ species: 'growlithe', level: 44 },
			{ species: 'vulpix', level: 44 },
			{ species: 'ninetales', level: 46 },
		],
		dialogue: {
			start: "I'll steal this victory!",
			win: "Caught red-handed!",
			lose: "Clean getaway!",
		},
	},
	'firebreatherray': {
		name: 'Firebreather Ray',
		money: 1280,
		party: [
			{ species: 'magmar', level: 36 },
			{ species: 'flareon', level: 36 },
		],
		dialogue: {
			start: "Feel the heat of my flames!",
			win: "Extinguished...",
			lose: "I'm on fire!",
		},
	},
	'pokemaniacmark': {
		name: 'Pokémaniac Mark',
		money: 2000,
		party: [
			{ species: 'rhyhorn', level: 38 },
			{ species: 'rhydon', level: 38 },
			{ species: 'nidoking', level: 40 },
		],
		dialogue: {
			start: "I'm obsessed with powerful Pokémon!",
			win: "I need to catch more!",
			lose: "My collection is unbeatable!",
		},
	},
	'supernerdglenn': {
		name: 'Super Nerd Glenn',
		money: 1080,
		party: [
			{ species: 'grimer', level: 28 },
			{ species: 'muk', level: 28 },
			{ species: 'koffing', level: 30 },
		],
		dialogue: {
			start: "My studies have prepared me for this!",
			win: "Back to the books...",
			lose: "Knowledge is power!",
		},
	},
	'gamblerrich': {
		name: 'Gambler Rich',
		money: 2800,
		party: [
			{ species: 'farfetchd', level: 46 },
			{ species: 'mr.mime', level: 46 },
		],
		dialogue: {
			start: "Let's make this interesting!",
			win: "I bet on the wrong Pokémon...",
			lose: "The house always wins!",
		},
	},
	'sailorduncan': {
		name: 'Sailor Duncan',
		money: 920,
		party: [
			{ species: 'machop', level: 27 },
			{ species: 'machoke', level: 27 },
			{ species: 'poliwrath', level: 29 },
		],
		dialogue: {
			start: "Ahoy! Ready for a sea battle?",
			win: "Anchors aweigh...",
			lose: "Smooth sailing!",
		},
	},
	'aromaladynikki': {
		name: 'Aroma Lady Nikki',
		money: 1440,
		party: [
			{ species: 'roselia', level: 36 },
			{ species: 'bellossom', level: 36 },
		],
		dialogue: {
			start: "My Pokémon smell wonderful!",
			win: "The sweet scent of defeat...",
			lose: "A bouquet of victory!",
		},
	},
	'ruinmaniacdusty': {
		name: 'Ruin Maniac Dusty',
		money: 1920,
		party: [
			{ species: 'geodude', level: 44 },
			{ species: 'graveler', level: 44 },
			{ species: 'sandslash', level: 46 },
		],
		dialogue: {
			start: "I explore ancient ruins and train!",
			win: "Another ruin to explore...",
			lose: "History repeats itself!",
		},
	},
	'dragontamernicolas': {
		name: 'Dragon Tamer Nicolas',
		money: 2160,
		party: [
			{ species: 'dratini', level: 42 },
			{ species: 'dragonair', level: 42 },
			{ species: 'seadra', level: 44 },
		],
		dialogue: {
			start: "Dragons are the ultimate Pokémon!",
			win: "Even dragons can fall...",
			lose: "Feel the dragon's fury!",
		},
	},
	'cooltrainermary': {
		name: 'Cool Trainer Mary',
		money: 2400,
		party: [
			{ species: 'persian', level: 48 },
			{ species: 'dewgong', level: 48 },
			{ species: 'ninetales', level: 48 },
		],
		dialogue: {
			start: "Only the coolest trainers make it this far!",
			win: "You're cooler than I thought!",
			lose: "Stay cool!",
		},
	},
	'cooltrainersamuel': {
		name: 'Cool Trainer Samuel',
		money: 2400,
		party: [
			{ species: 'sandslash', level: 47 },
			{ species: 'cloyster', level: 47 },
			{ species: 'electrode', level: 49 },
		],
		dialogue: {
			start: "I'm one of the best trainers around!",
			win: "You're even better!",
			lose: "That's how Cool Trainers do it!",
		},
	},
	'youngsterben': {
		name: 'Youngster Ben',
		money: 280,
		party: [
			{ species: 'ekans', level: 11 },
			{ species: 'sandshrew', level: 11 },
		],
		dialogue: {
			start: "I'm gonna be the best trainer!",
			win: "I have a lot to learn...",
			lose: "I'm getting stronger!",
		},
	},
	'lassrobin': {
		name: 'Lass Robin',
		money: 320,
		party: [
			{ species: 'jigglypuff', level: 14 },
			{ species: 'meowth', level: 14 },
		],
		dialogue: {
			start: "My cute Pokémon are tough!",
			win: "They're still cute though!",
			lose: "Cute and strong!",
		},
	},
	'hikerclark': {
		name: 'Hiker Clark',
		money: 800,
		party: [
			{ species: 'geodude', level: 22 },
			{ species: 'geodude', level: 22 },
			{ species: 'graveler', level: 24 },
		],
		dialogue: {
			start: "I hike these mountains every day!",
			win: "Time for a break...",
			lose: "Nothing beats mountain training!",
		},
	},
	'picnickerkelsey': {
		name: 'Picnicker Kelsey',
		money: 520,
		party: [
			{ species: 'nidoranf', level: 21 },
			{ species: 'pidgeotto', level: 21 },
		],
		dialogue: {
			start: "Let's have a fun picnic battle!",
			win: "That was still fun!",
			lose: "Perfect picnic!",
		},
	},
};

// Trainer locations - maps trainers to locations where they can be challenged
export const TRAINER_LOCATIONS: Record<string, string[]> = {
	'route1': ['youngsterjoey', 'lassalice', 'bugcatcherrick', 'youngsterben', 'lassrobin', 'camperricky'],
	'route2': ['picnickerliz', 'hikerdan', 'hikerclark', 'picnickerkelsey', 'picnickerdiana'],
	'route3': ['blackbeltkoji', 'swimmerjack', 'fisherned', 'birdkeeperrobert', 'twinsamymay'],
	'route4': ['cooltrainerjake', 'gentlemanthomas', 'beautygrace', 'psychicjohan'],
	'route5': ['acetrainersarah', 'channelerpaula', 'rockervincent', 'jugglershawn'],
	'route6': ['scientistted', 'engineerbernie', 'burglarsimon', 'firebreatherray'],
	'route7': ['pokemaniacmark', 'supernerdglenn', 'gamblerrich', 'sailorduncan'],
	'victoryroad': ['aromaladynikki', 'ruinmaniacdusty', 'dragontamernicolas', 'cooltrainermary', 'cooltrainersamuel'],
	'pokemonleague': ['elitelorelei', 'elitebruno', 'eliteagatha', 'elitelance', 'championblue'],
};

// Story events - triggered at specific points in the game
