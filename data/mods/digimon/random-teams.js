'use strict';

/** @typedef {{[name: string]: DigimonSet}} DigimonSets */
/**
 * @typedef {Object} DigimonSet
 * @property {string=} name
 * @property {string} species
 * @property {string | string[]} ability
 * @property {(string | string[])[]} moves
 * @property {string=} baseSignatureMove
 * @property {string=} signatureMove
 */

const RandomTeams = require('../../random-teams');

class RandomDigimonTeams extends RandomTeams {
	randomDigimonTeam() {
		/** @type {PokemonSet[]} */
		let team = [];

		/** @type {DigimonSets} */
		let sets = {
			//Fresh//
			"Botamon": {
				species: "Botamon",
				ability: "Data",
				moves: ['acidbubble'],
			},
			"Dodomon": {
				species: "Dodomon",
				ability: "Data",
				moves: ['acidbubble'],
			},
			"Kuramon": {
				species: "Kuramon",
				ability: "Virus",
				moves: ['acidbubble'],
			},
			"Poyomon": {
				species: "Poyomon",
				ability: "Data",
				moves: ['acidbubble'],
			},
			"Punimon": {
				species: "Punimon",
				ability: "Data",
				moves: ['acidbubble'],
			},
			"Yuramon": {
				species: "Yuramon",
				ability: "Data",
				moves: ['acidbubble'],
			},
			//In-Traning//
			"Bukamon": {
				species: "Bukamon",
				ability: "Data",
				moves: ['acidbubble'],
			},
			"Dorimon": {
				species: "Dorimon",
				ability: "Data",
				moves: ['acidbubble'],
			},
			"Koromon": {
				species: "Koromon",
				ability: "Data",
				moves: ['acidbubble'],
			},
			"Motimon": {
				species: "Motimon",
				ability: "Data",
				moves: ['acidbubble'],
			},
			"Nyaromon": {
				species: "Nyaromon",
				ability: "Vaccine",
				moves: ['acidbubble'],
			},
			"Tanemon": {
				species: "Tanemon",
				ability: "Data",
				moves: ['acidbubble'],
			},
			"Tokomon": {
				species: "Tokomon",
				ability: "Data",
				moves: ['acidbubble'],
			},
			"Tsumemon": {
				species: "Tsumemon",
				ability: "Virus",
				moves: ['acidbubble'],
			},
			"Tsunomon": {
				species: "Tsunomon",
				ability: "Data",
				moves: ['acidbubble'],
			},
			//Rookies//
			"Agumon": {
				species: "Agumon",
				ability: "Vaccine",
				moves: ['burningheart', 'heatbreath', 'firetower', 'infinityburn', 'musclecharge', 'sonicjab', 'windcutter'],
				baseSignatureMove: "pepperbreath",
				signatureMove: "Pepper Breath",
			},
			"Aruraumon": {
				species: "Aruraumon",
				ability: "Virus",
				moves: ['charmperfume', 'rootbind', 'venomdisaster', 'waterblitz', 'superstinkyjet', 'shadowfall', 'blackout'],
				baseSignatureMove: "nemesisivy",
				signatureMove: "Nemesis Ivy",
			},
			"Betamon": {
				species: "Betamon",
				ability: "Virus",
				moves: ['staticelectricity', 'electriccloud', 'megalospark', 'hailspear', 'waterblitz', 'oceanwave'],
				baseSignatureMove: "electricshock",
				signatureMove: "Electric Shock",
			},
			"Biyomon": {
				species: "Biyomon",
				ability: "Vaccine",
				moves: ['wingshoes', 'windcutter', 'burningheart', 'heatbreath', 'firetower', 'meltdown', 'warcry', 'holyflash', 'rootbind'],
				baseSignatureMove: "spiraltwister",
				signatureMove: "Spiral Twister",
			},
			"ClearAgumon": {
				species: "ClearAgumon",
				ability: "Vaccine",
				moves: ['heatbreath', 'saintshield', 'saintray', 'holyflash', 'mechanicalclaw', 'upgrade', 'gigawattlaser'],
				baseSignatureMove: "preciousflame",
				signatureMove: "Precious Flame",
			},
			"DemiDevimon": {
				species: "DemiDevimon",
				ability: "Virus",
				moves: ['blackout', 'evilfantasy', 'shadowfall', 'hideandseek', 'windcutter', 'confusedstorm', 'cootieskick'],
				baseSignatureMove: "demidart",
				signatureMove: "Demi Dart",
			},
			"Dokunemon": {
				species: "Dokunemon",
				ability: "Virus",
				moves: ['staticelectricity', 'shadowfall', 'earthcoat', 'massmorph', 'bug', 'venomdisaster', 'blackout'],
				baseSignatureMove: "wormvenom",
				signatureMove: "Worm Venom",
			},
			"Dorumon": {
				species: "Dorumon",
				ability: "Data",
				moves: ['burningheart', 'megalospark', 'musclecharge', 'sonicjab', 'fightingaura', 'busterdrive', 'mechanicalclaw', 'antiattackfield'],
				baseSignatureMove: "metalcannon",
				signatureMove: "Metal Cannon",
			},
			"Elecmon": {
				species: "Elecmon",
				ability: "Data",
				moves: ['staticelectricity', 'electriccloud', 'megalospark', 'thunderjustice', 'saintheal', 'warcry', 'fightingaura'],
				baseSignatureMove: "superthunderstrike",
				signatureMove: "Super Thunder Strike",
			},
			"Gabumon": {
				species: "Gabumon",
				ability: "Data",
				moves: ['heatbreath', 'firetower', 'hailspear', 'winterblast', 'gigafreeze', 'icestatue', 'musclecharge', 'sonicjab'],
				baseSignatureMove: "blueblaster",
				signatureMove: "Blue Blaster",
			},
			"Goburimon": {
				species: "Goburimon",
				ability: "Virus",
				moves: ['heatbreath', 'firetower', 'infinityburn', 'musclecharge', 'burningheart', 'reboundstrike', 'megatonpunch', 'shadowfall', 'pooptoss'],
				baseSignatureMove: "goblinstrike",
				signatureMove: "Goblin Strike",
			},
			"Gomamon": {
				species: "Gomamon",
				ability: "Vaccine",
				moves: ['mechanicalclaw', 'waterblitz', 'oceanwave', 'icestatue', 'aurorafreeze', 'warcry', 'reboundstrike'],
				baseSignatureMove: "marchingfishes",
				signatureMove: "Marching Fishes",
			},
			"Gotsumon": {
				species: "Gotsumon",
				ability: "Data",
				moves: ['earthcoat', 'rockfall', 'charmperfume', 'venomdisaster', 'bug', 'megatonpunch', 'fightingaura'],
				baseSignatureMove: "rockfist",
				signatureMove: "Rock Fist",
			},
			"Kunemon": {
				species: "Kunemon",
				ability: "Virus",
				moves: ['staticelectricity', 'megalospark', 'earthcoat', 'massmorph', 'bug', 'venomdisaster', 'superstinkyjet'],
				baseSignatureMove: "electricthread",
				signatureMove: "Electric Thread",
			},
			"ModokiBetamon": {
				species: "ModokiBetamon",
				ability: "Vaccine",
				moves: ['staticelectricity', 'electriccloud', 'confusedstorm', 'hailspear', 'icestatue', 'rootbind', 'waterblitz'],
				baseSignatureMove: "aquatower",
				signatureMove: "Aqua Tower",
			},
			"Muchomon": {
				species: "Muchomon",
				ability: "Data",
				moves: ['burningheart', 'hailspear', 'waterblitz', 'icestatue', 'windcutter', 'infinityburn', 'firewall'],
				baseSignatureMove: "tropicalbeak",
				signatureMove: "Tropical Beak",
			},
			"Otamamon": {
				species: "Otamamon",
				ability: "Data",
				moves: ['hailspear', 'waterblitz', 'oceanwave', 'icestatue', 'bug', 'charmperfume', 'warcry'],
				baseSignatureMove: "lullabybubble",
				signatureMove: "Lullaby Bubble",
			},
			"Palmon": {
				species: "Palmon",
				ability: "Vaccine",
				moves: ['charmperfume', 'rootbind', 'venomdisaster', 'waterblitz', 'superstinkyjet', 'burningheart', 'confusedstorm'],
				baseSignatureMove: "poisonivy",
				signatureMove: "Poison Ivy",
			},
			"Patamon": {
				species: "Patamon",
				ability: "Data",
				moves: ['wingshoes', 'windcutter', 'sonicjab', 'busterdrive', 'saintheal', 'holybreath', 'holyflash'],
				baseSignatureMove: "boombubble",
				signatureMove: "Boom Bubble",
			},
			"Penguinmon": {
				species: "Penguinmon",
				ability: "Data",
				moves: ['musclecharge', 'hailspear', 'waterblitz', 'icestatue', 'windcutter', 'megalospark', 'earthcoat'],
				baseSignatureMove: "eternalslapping",
				signatureMove: "Eternal Slapping",
			},
			"Psychemon": {
				species: "Psychemon",
				ability: "Vaccine",
				moves: ['heatbreath', 'firetower', 'staticelectricity', 'winterblast', 'confusedstorm', 'icestatue', 'musclecharge', 'sonicjab'],
				baseSignatureMove: "coloredsparkle",
				signatureMove: "Colored Sparkle",
			},
			"Salamon": {
				species: "Salamon",
				ability: "Vaccine",
				moves: ['saintheal', 'holybreath', 'holyflash', 'saintray', 'warcry', 'antiattackfield', 'fightingaura'],
				baseSignatureMove: "puppyhowl",
				signatureMove: "Puppy Howl",
			},
			"Shamanmon": {
				species: "Shamanmon",
				ability: "Virus",
				moves: ['charmperfume', 'rootbind', 'rockfall', 'musclecharge', 'warcry', 'reboundstrike', 'megatonpunch', 'shadowfall', 'pooptoss'],
				baseSignatureMove: "dancingbone",
				signatureMove: "Dancing Bone",
			},
			"SnowAgumon": {
				species: "SnowAgumon",
				ability: "Vaccine",
				moves: ['burningheart', 'hailspear', 'winterblast', 'icestatue', 'musclecharge', 'sonicjab', 'windcutter'],
				baseSignatureMove: "littleblizzard",
				signatureMove: "Little Blizzard",
			},
			"SnowGoburimon": {
				species: "SnowGoburimon",
				ability: "Virus",
				moves: ['hailspear', 'winterblast', 'icestatue', 'musclecharge', 'warcry', 'reboundstrike', 'megatonpunch', 'shadowfall', 'pooptoss'],
				baseSignatureMove: "snowgobbolt",
				signatureMove: "SnowGob Bolt",
			},
			"Tentomon": {
				species: "Tentomon",
				ability: "Data",
				moves: ['staticelectricity', 'confusedstorm', 'electriccloud', 'megalospark', 'massmorph', 'bug', 'rockfall', 'fightingaura'],
				baseSignatureMove: "supershocker",
				signatureMove: "Super Shocker",
			},
			"ToyAgumon": {
				species: "ToyAgumon",
				ability: "Data",
				moves: ['heatbreath', 'firewall', 'prominencebeam', 'sonicjab', 'mechanicalclaw', 'upgrade', 'gigawattlaser'],
				baseSignatureMove: "plasticblaze",
				signatureMove: "Plastic Blaze",
			},
			"Tsukaimon": {
				species: "Tsukaimon",
				ability: "Virus",
				moves: ['wingshoes', 'windcutter', 'sonicjab', 'darkspirit', 'blackout', 'evilfantasy', 'chaoscloud'],
				baseSignatureMove: "evilspell",
				signatureMove: "Evil Spell",
			},
			//Champions//
			"Airdramon": {
				species: "Airdramon",
				ability: "Vaccine",
				moves: ['heatbreath', 'firetower', 'meltdown', 'infinityburn', 'wingshoes', 'windcutter', 'confusedstorm', 'holybreath'],
				baseSignatureMove: "spinningneedle",
				signatureMove: "Spinning Needle",
			},
			"Akatorimon": {
				species: "Akatorimon",
				ability: "Data",
				moves: ['heatbreath', 'firewall', 'wingshoes', 'windcutter', 'megalospark', 'icestatue', 'guerrillapoop'],
				baseSignatureMove: "scarredeye",
				signatureMove: "Scar-Red Eye",
			},
			"Angemon": {
				species: "Angemon",
				ability: "Vaccine",
				moves: ['wingshoes', 'windcutter', 'sonicjab', 'busterdrive', 'saintheal', 'holybreath', 'holyflash', 'saintray', 'holyjudgment'],
				baseSignatureMove: "handoffate",
				signatureMove: "Hand of Fate",
			},
			"Bakemon": {
				species: "Bakemon",
				ability: "Virus",
				moves: ['darkspirit', 'blackout', 'evilfantasy', 'shadowfall', 'massmorph', 'icestatue', 'staticelectricity', 'electriccloud', 'thunderjustice'],
				baseSignatureMove: "evilcharm",
				signatureMove: "Evil Charm",
			},
			"Birdramon": {
				species: "Birdramon",
				ability: "Vaccine",
				moves: ['wingshoes', 'windcutter', 'burningheart', 'heatbreath', 'firetower', 'meltdown', 'infinityburn', 'warcry', 'holyflash'],
				baseSignatureMove: "meteorwing",
				signatureMove: "Meteor Wing",
			},
			"BlackGatomon": {
				species: "BlackGatomon",
				ability: "Virus",
				moves: ['warcry', 'sonicjab', 'fightingaura', 'evilsquall', 'evilfantasy', 'hideandseek', 'gigafreeze'],
				baseSignatureMove: "darkpaw",
				signatureMove: "Dark Paw",
			},
			"Centarumon": {
				species: "Centarumon",
				ability: "Data",
				moves: ['firetower', 'firewall', 'prominencebeam', 'saintheal', 'saintray', 'fightingaura', 'upgrade', 'gigawattlaser'],
				baseSignatureMove: "solarray",
				signatureMove: "Solar Ray",
			},
			"Coelamon": {
				species: "Coelamon",
				ability: "Data",
				moves: ['waterblitz', 'icestatue', 'mechanicalclaw', 'upgrade', 'antiattackfield', 'massmorph', 'staticelectricity', 'deleteprogram'],
				baseSignatureMove: "variabledarts",
				signatureMove: "Variable Darts",
			},
			"Darkrizamon": {
				species: "Darkrizamon",
				ability: "Virus",
				moves: ['heatbreath', 'firetower', 'firewall', 'meltdown', 'darkspirit', 'evilfantasy', 'shadowfall', 'mechanicalclaw'],
				baseSignatureMove: "dreadfire",
				signatureMove: "Dread Fire",
			},
			"Devimon": {
				species: "Devimon",
				ability: "Virus",
				moves: ['darkspirit', 'windcutter', 'evilfantasy', 'chaoscloud', 'aurorafreeze', 'evilsquall', 'confusedstorm', 'wingshoes'],
				baseSignatureMove: "deathhand",
				signatureMove: "Death Hand",
			},
			"Dolphmon": {
				species: "Dolphmon",
				ability: "Vaccine",
				moves: ['waterblitz', 'gigafreeze', 'oceanwave', 'icestatue', 'warcry', 'sonicjab', 'fightingaura', 'holybreath', 'saintheal'],
				baseSignatureMove: "pulseblast",
				signatureMove: "Pulse Blast",
			},
			"Dorugamon": {
				species: "Dorugamon",
				ability: "Data",
				moves: ['burningheart', 'winterblast', 'megalospark', 'musclecharge', 'sonicjab', 'fightingaura', 'busterdrive', 'mechanicalclaw', 'antiattackfield'],
				baseSignatureMove: "powermetal",
				signatureMove: "Power Metal",
			},
			"Drimogemon": {
				species: "Drimogemon",
				ability: "Data",
				moves: ['mechanicalclaw', 'deleteprogram', 'earthcoat', 'massmorph', 'rootbind', 'rockfall'],
				baseSignatureMove: "drillspin",
				signatureMove: "Drill Spin",
			},
			"Flarerizamon": {
				species: "Flarerizamon",
				ability: "Data",
				moves: ['heatbreath', 'firetower', 'firewall', 'meltdown', 'sonicjab', 'warcry', 'megatonpunch', 'mechanicalclaw'],
				baseSignatureMove: "blazebuster",
				signatureMove: "Blaze Buster",
			},
			"Frigimon": {
				species: "Frigimon",
				ability: "Vaccine",
				moves: ['hailspear', 'icestatue', 'aurorafreeze', 'waterblitz', 'sonicjab', 'musclecharge', 'fightingaura'],
				baseSignatureMove: "subzeroicepunch",
				signatureMove: "Sub Zero Ice Punch",
			},
			"Fugamon": {
				species: "Fugamon",
				ability: "Virus",
				moves: ['staticelectricity', 'windcutter', 'megalospark', 'blackout', 'musclecharge', 'warcry', 'reboundstrike', 'megatonpunch'],
				baseSignatureMove: "evilhurricane",
				signatureMove: "Evil Hurricane",
			},
			"Garurumon": {
				species: "Garurumon",
				ability: "Data",
				moves: ['warcry', 'waterblitz', 'fightingaura', 'burningheart', 'heatbreath', 'gigafreeze', 'hailspear', 'meltdown', 'aurorafreeze'],
				baseSignatureMove: "howlingblaster",
				signatureMove: "Howling Blaster",
			},
			"Gatomon": {
				species: "Gatomon",
				ability: "Vaccine",
				moves: ['holybreath', 'sonicjab', 'fightingaura', 'saintray', 'saintheal', 'holyflash', 'confusedstorm'],
				baseSignatureMove: "lightningpaw",
				signatureMove: "Lightning Paw",
			},
			"Gekomon": {
				species: "Gekomon",
				ability: "Data",
				moves: ['hailspear', 'confusedstorm', 'oceanwave', 'icestatue', 'gigafreeze', 'warcry', 'charmperfume'],
				baseSignatureMove: "symphonycrusher",
				signatureMove: "Symphony Crusher",
			},
			"Geremon": {
				species: "Geremon",
				ability: "Virus",
				moves: ['gigafreeze', 'earthcoat', 'bug', 'venomdisaster', 'warcry', 'superstinkyjet', 'poopattackfield', 'guerrillapoop', 'extremepoopdeath'],
				baseSignatureMove: "hypersmell",
				signatureMove: "Hyper Smell",
			},
			"Greymon": {
				species: "Greymon",
				ability: "Vaccine",
				moves: ['burningheart', 'heatbreath', 'firetower', 'infinityburn', 'musclecharge', 'sonicjab', 'megalospark'],
				baseSignatureMove: "megaflame",
				signatureMove: "Mega Flame",
			},
			"Guardromon": {
				species: "Guardromon",
				ability: "Vaccine",
				moves: ['upgrade', 'reverseprogram', 'antiattackfield', 'gigawattlaser', 'megalospark', 'saintshield', 'firetower', 'firewall', 'thunderjustice'],
				baseSignatureMove: "guardianbarrage",
				signatureMove: "Guardian Barrage",
			},
			"Gururumon": {
				species: "Gururumon",
				ability: "Vaccine",
				moves: ['warcry', 'waterblitz', 'fightingaura', 'burningheart', 'blackout', 'gigafreeze', 'darkspirit', 'evilfantasy', 'aurorafreeze'],
				baseSignatureMove: "chaosblaster",
				signatureMove: "Chaos Blaster",
			},
			"Hyogamon": {
				species: "Hyogamon",
				ability: "Virus",
				moves: ['hailspear', 'winterblast', 'icestatue', 'blackout', 'musclecharge', 'warcry', 'reboundstrike', 'megatonpunch'],
				baseSignatureMove: "snowpunch",
				signatureMove: "snowpunch",
			},
			"IceDevimon": {
				species: "IceDevimon",
				ability: "Virus",
				moves: ['waterblitz', 'blackout', 'evilfantasy', 'icestatue', 'shadowfall', 'evilsquall', 'winterblast', 'gigafreeze'],
				baseSignatureMove: "frozenclaw",
				signatureMove: "Frozen Claw",
			},
			"Icemon": {
				species: "Icemon",
				ability: "Data",
				moves: ['earthcoat', 'rockfall', 'hailspear', 'aurorafreeze', 'gigafreeze', 'megatonpunch', 'fightingaura'],
				baseSignatureMove: "iceballbomb",
				signatureMove: "Iceball Bomb",
			},
			"Ikkakumon": {
				species: "Ikkakumon",
				ability: "Vaccine",
				moves: ['hailspear', 'oceanwave', 'icestatue', 'aurorafreeze', 'mechanicalclaw', 'warcry', 'reboundstrike'],
				baseSignatureMove: "harpoontorpedo",
				signatureMove: "Harpoon Torpedo",
			},
			"JungleMojyamon": {
				species: "JungleMojyamon",
				ability: "Vaccine",
				moves: ['earthcoat', 'rootbind', 'warcry', 'musclecharge', 'sonicjab', 'fightingaura', 'superstinkyjet', 'poopfling'],
				baseSignatureMove: "junglebone",
				signatureMove: "Jungle Bone",
			},
			"Kabuterimon": {
				species: "Kabuterimon",
				ability: "Vaccine",
				moves: ['confusedstorm', 'electriccloud', 'megalospark', 'thunderjustice', 'massmorph', 'bug', 'rockfall', 'fightingaura'],
				baseSignatureMove: "electroshocker",
				signatureMove: "Electro Shocker",
			},
			"Kokatorimon": {
				species: "Kokatorimon",
				ability: "Vaccine",
				moves: ['wingshoes', 'windcutter', 'megalospark', 'icestatue', 'cootieskick', 'pooptoss', 'guerrillapoop'],
				baseSignatureMove: "frozenfireshot",
				signatureMove: "Frozen Fire Shot",
			},
			"Kuwagamon": {
				species: "Kuwagamon",
				ability: "Virus",
				moves: ['sonicjab', 'busterdrive', 'massmorph', 'bug', 'venomdisaster', 'windcutter', 'blackout'],
				baseSignatureMove: "scissorclaw",
				signatureMove: "Scissor Claw",
			},
			"Leomon": {
				species: "Leomon",
				ability: "Vaccine",
				moves: ['musclecharge', 'warcry', 'sonicjab', 'meltdown', 'infinityburn', 'megatonpunch', 'earthcoat', 'saintshield', 'burningheart'],
				baseSignatureMove: "fistofthebeastking",
				signatureMove: "Fist of the Beast King",
			},
			"Meicoomon": {
				species: "Meicoomon",
				ability: "Data",
				moves: ['warcry', 'windcutter', 'fightingaura', 'megatonpunch', 'mechanicalclaw', 'venomdisaster', 'shadowfall', 'saintray'],
				baseSignatureMove: "xscratch",
				signatureMove: "X Scratch",
			},
			"Meramon": {
				species: "Meramon",
				ability: "Data",
				moves: ['burningheart', 'firewall', 'firetower', 'infinityburn', 'holyflash', 'fightingaura', 'sonicjab', 'megatonpunch'],
				baseSignatureMove: "burningfist",
				signatureMove: "Burning Fist",
			},
			"Mikemon": {
				species: "Mikemon",
				ability: "Data",
				moves: ['warcry', 'sonicjab', 'fightingaura', 'venomdisaster', 'evilfantasy', 'holyflash', 'bug'],
				baseSignatureMove: "catclaw",
				signatureMove: "Cat Claw",
			},
			"Mojyamon": {
				species: "Mojyamon",
				ability: "Vaccine",
				moves: ['warcry', 'musclecharge', 'sonicjab', 'fightingaura', 'hailspear', 'winterblast', 'superstinkyjet', 'poopfling'],
				baseSignatureMove: "boneboomerang",
				signatureMove: "Bone Boomerang",
			},
			"Monochromon": {
				species: "Monochromon",
				ability: "Data",
				moves: ['heatbreath', 'firetower', 'infinityburn', 'earthcoat', 'rockfall', 'musclecharge', 'busterdrive'],
				baseSignatureMove: "volcanicstrike",
				signatureMove: "Volcanic Strike",
			},
			"MoriShellmon": {
				species: "MoriShellmon",
				ability: "Data",
				moves: ['waterblitz', 'oceanwave', 'earthcoat', 'charmperfume', 'rootbind', 'venomdisaster', 'sonicjab'],
				baseSignatureMove: "mindfog",
				signatureMove: "Mind Fog",
			},
			"MudFrigimon": {
				species: "MudFrigimon",
				ability: "Vaccine",
				moves: ['rootbind', 'bug', 'rockfall', 'massmorph', 'sonicjab', 'earthcoat', 'fightingaura'],
				baseSignatureMove: "mudball",
				signatureMove: "Mud Ball",
			},
			"Nanimon": {
				species: "Nanimon",
				ability: "Virus",
				moves: ['musclecharge', 'sonicjab', 'fightingaura', 'pooptoss', 'poopattackfield', 'superstinkyjet', 'evilfantasy', 'blackout'],
				baseSignatureMove: "poopdunk",
				signatureMove: "Poop Dunk",
			},
			"Ninjamon": {
				species: "Ninjamon",
				ability: "Data",
				moves: ['warcry', 'sonicjab', 'musclecharge', 'charmperfume', 'rootbind', 'earthcoat', 'reboundstrike'],
				baseSignatureMove: "dancingleaves",
				signatureMove: "Dancing Leaves",
			},
			"NiseDrimogemon": {
				species: "NiseDrimogemon",
				ability: "Vaccine",
				moves: ['warcry', 'sonicjab', 'busterdrive', 'reboundstrike', 'mechanicalclaw', 'upgrade', 'deleteprogram', 'reverseprogram'],
				baseSignatureMove: "fakedrillspin",
				signatureMove: "Fake Drill Spin",
			},
			"Numemon": {
				species: "Numemon",
				ability: "Virus",
				moves: ['oceanwave', 'earthcoat', 'bug', 'icestatue', 'warcry', 'cootieskick', 'pooptoss', 'guerrillapoop', 'extremepoopdeath'],
				baseSignatureMove: "numesludge",
				signatureMove: "Nume-Sludge",
			},
			"Ogremon": {
				species: "Ogremon",
				ability: "Virus",
				moves: ['firetower', 'infinityburn', 'heatbreath', 'blackout', 'musclecharge', 'warcry', 'reboundstrike', 'megatonpunch'],
				baseSignatureMove: "pummelwhack",
				signatureMove: "Pummel Whack",
			},
			"Piddomon": {
				species: "Piddomon",
				ability: "Vaccine",
				moves: ['burningheart', 'firewall', 'infinityburn', 'holybreath', 'windcutter', 'sonicjab', 'saintheal', 'saintray', 'holyjudgment'],
				baseSignatureMove: "firefeather",
				signatureMove: "Fire Feather",
			},
			"PlatinumSukamon": {
				species: "PlatinumSukamon",
				ability: "Vaccine",
				moves: ['earthcoat', 'rockfall', 'holyflash', 'mechanicalclaw', 'reverseprogram', 'deleteprogram', 'cootieskick', 'superstinkyjet', 'guerrillapoop', 'extremepoopdeath'],
				baseSignatureMove: "raremetalpoop",
				signatureMove: "Rare Metal Poop",
			},
			"RedVegiemon": {
				species: "RedVegiemon",
				ability: "Virus",
				moves: ['heatbreath', 'meltdown', 'prominencebeam', 'massmorph', 'charmperfume', 'venomdisaster', 'earthcoat'],
				baseSignatureMove: "chilipepperpummel",
				signatureMove: "Chili Pepper Pummel",
			},
			"Rockmon": {
				species: "Rockmon",
				ability: "Virus",
				moves: ['mechanicalclaw', 'winterblast', 'gigafreeze', 'gigawattlaser', 'dgdimension', 'upgrade', 'sonicjab'],
				baseSignatureMove: "antidigibeam",
				signatureMove: "Anti-Digi Beam",
			},
			"Saberdramon": {
				species: "Saberdramon",
				ability: "Virus",
				moves: ['wingshoes', 'windcutter', 'burningheart', 'blackout', 'firetower', 'shadowfall', 'infinityburn', 'evilfantasy'],
				baseSignatureMove: "nightroar",
				signatureMove: "Night Roar",
			},
			"SandYanmamon": {
				species: "SandYanmamon",
				ability: "Virus",
				moves: ['electriccloud', 'windcutter', 'confusedstorm', 'thunderjustice', 'earthcoat', 'massmorph', 'charmperfume', 'bug', 'holyflash'],
				baseSignatureMove: "stunray",
				signatureMove: "Stun Ray",
			},
			"Seadramon": {
				species: "Seadramon",
				ability: "Data",
				moves: ['hailspear', 'waterblitz', 'gigafreeze', 'aurorafreeze', 'heatbreath', 'meltdown', 'holybreath'],
				baseSignatureMove: "iceblast",
				signatureMove: "Ice Blast",
			},
			"Shellmon": {
				species: "Shellmon",
				ability: "Data",
				moves: ['waterblitz', 'winterblast', 'oceanwave', 'aurorafreeze', 'massmorph', 'rockfall', 'sonicjab'],
				baseSignatureMove: "hydropressure",
				signatureMove: "Hydro Pressure",
			},
			"ShimaUnimon": {
				species: "ShimaUnimon",
				ability: "Data",
				moves: ['holybreath', 'electriccloud', 'confusedstorm', 'saintheal', 'holyflash', 'saintray', 'warcry', 'fightingaura', 'sonicjab', 'busterdrive'],
				baseSignatureMove: "lustershot",
				signatureMove: "Luster Shot",
			},
			"Soulmon": {
				species: "Soulmon",
				ability: "Virus",
				moves: ['darkspirit', 'blackout', 'evilfantasy', 'shadowfall', 'massmorph', 'staticelectricity', 'electriccloud', 'aurorafreeze'],
				baseSignatureMove: "necromagic",
				signatureMove: "Necro Magic",
			},
			"Sukamon": {
				species: "Sukamon",
				ability: "Virus",
				moves: ['earthcoat', 'bug', 'rockfall', 'warcry', 'cootieskick', 'superstinkyjet', 'guerrillapoop', 'extremepoopdeath', 'hideandseek'],
				baseSignatureMove: "poop",
				signatureMove: "Poop",
			},
			"Tankmon": {
				species: "Tankmon",
				ability: "Data",
				moves: ['burningheart', 'heatbreath', 'infinityburn', 'prominencebeam', 'earthcoat', 'antiattackfield', 'gigawattlaser', 'deleteprogram', 'upgrade'],
				baseSignatureMove: "hypercannon",
				signatureMove: "Hyper Cannon",
			},
			"Togemon": {
				species: "Togemon",
				ability: "Data",
				moves: ['massmorph', 'charmperfume', 'rootbind', 'venomdisaster', 'waterblitz', 'musclecharge', 'sonicjab', 'fightingaura', 'megatonpunch'],
				baseSignatureMove: "needlespray",
				signatureMove: "Needle Spray",
			},
			"Tyrannomon": {
				species: "Tyrannomon",
				ability: "Data",
				moves: ['burningheart', 'heatbreath', 'firetower', 'prominencebeam', 'musclecharge', 'sonicjab', 'reboundstrike', 'rockfall'],
				baseSignatureMove: "blazeblaster",
				signatureMove: "Blaze Blaster",
			},
			"Unimon": {
				species: "Unimon",
				ability: "Vaccine",
				moves: ['wingshoes', 'megalospark', 'thunderjustice', 'confusedstorm', 'rockfall', 'saintheal', 'holyjudgment', 'saintray', 'musclecharge'],
				baseSignatureMove: "aerialattack",
				signatureMove: "Aerial Attack",
			},
			"Vegiemon": {
				species: "Vegiemon",
				ability: "Virus",
				moves: ['waterblitz', 'gigafreeze', 'oceanwave', 'massmorph', 'charmperfume', 'venomdisaster', 'earthcoat'],
				baseSignatureMove: "sweetbreath",
				signatureMove: "Sweet Breath",
			},
			"Weedmon": {
				species: "Weedmon",
				ability: "Virus",
				moves: ['superstinkyjet', 'poopattackfield', 'extremepoopdeath', 'massmorph', 'charmperfume', 'venomdisaster', 'earthcoat'],
				baseSignatureMove: "deadlyweed",
				signatureMove: "Deadly Weed",
			},
			"Yanmamon": {
				species: "Yanmamon",
				ability: "Virus",
				moves: ['electriccloud', 'windcutter', 'confusedstorm', 'thunderjustice', 'earthcoat', 'massmorph', 'charmperfume', 'bug', 'holyflash'],
				baseSignatureMove: "thunderray",
				signatureMove: "Thunder Ray",
			},
			//Ultimates//
			"Andromon": {
				species: "Andromon",
				ability: "Vaccine",
				moves: ['windcutter', 'electriccloud', 'megalospark', 'thunderjustice', 'upgrade', 'antiattackfield', 'deleteprogram', 'gigawattlaser', 'bug'],
				baseSignatureMove: "spiralsword",
				signatureMove: "Spiral Sword",
			},
			"Angewomon": {
				species: "Angewomon",
				ability: "Vaccine",
				moves: ['wingshoes', 'windcutter', 'thunderjustice', 'fightingaura', 'electriccloud', 'saintheal', 'holybreath', 'holyflash', 'saintray', 'warcry'],
				baseSignatureMove: "celestialarrow",
				signatureMove: "Celestial Arrow",
			},
			"Beastmon": {
				species: "Beastmon",
				ability: "Virus",
				moves: ['warcry', 'sonicjab', 'megatonpunch', 'venomdisaster', 'shadowfall', 'gigafreeze', 'bug', 'icestatue'],
				baseSignatureMove: "vampirewave",
				signatureMove: "Vampire Wave",
			},
			"BlackWereGarurumon": {
				species: "BlackWereGarurumon",
				ability: "Virus",
				moves: ['warcry', 'musclecharge', 'sonicjab', 'megatonpunch', 'rockfall', 'burningheart', 'heatbreath', 'evilsquall', 'hideandseek', 'winterblast', 'gigafreeze'],
				baseSignatureMove: "fullmoonkick",
				signatureMove: "Full Moon Kick",
			},
			"BlueMeramon": {
				species: "BlueMeramon",
				ability: "Vaccine",
				moves: ['burningheart', 'firewall', 'meltdown', 'infinityburn', 'aurorafreeze', 'holyflash', 'fightingaura', 'gigafreeze'],
				baseSignatureMove: "coldflame",
				signatureMove: "Cold Flame",
			},
			"Digitamamon": {
				species: "Digitamamon",
				ability: "Data",
				moves: ['hailspear', 'blackout', 'bug', 'shadowfall', 'firetower', 'poopattackfield', 'poopfling', 'upgrade'],
				baseSignatureMove: "nightmaresyndrome",
				signatureMove: "Nightmare Syndrome",
			},
			"DoruGreymon": {
				species: "DoruGreymon",
				ability: "Data",
				moves: ['burningheart', 'infinityburn', 'megalospark', 'musclecharge', 'sonicjab', 'fightingaura', 'busterdrive', 'mechanicalclaw', 'antiattackfield'],
				baseSignatureMove: "metalmeteor",
				signatureMove: "Metal Meteor",
			},
			"Etemon": {
				species: "Etemon",
				ability: "Virus",
				moves: ['earthcoat', 'rockfall', 'sonicjab', 'megatonpunch', 'charmperfume', 'bug', 'guerrillapoop', 'extremepoopdeath'],
				baseSignatureMove: "loveserenade",
				signatureMove: "Love Serenade",
			},
			"Garudamon": {
				species: "Garudamon",
				ability: "Vaccine",
				moves: ['wingshoes', 'windcutter', 'burningheart', 'firetower', 'meltdown', 'infinityburn', 'warcry', 'busterdrive', 'holyflash'],
				baseSignatureMove: "shadowwing",
				signatureMove: "Shadow Wing",
			},
			"Gigadramon": {
				species: "Gigadramon",
				ability: "Data",
				moves: ['upgrade', 'gigawattlaser', 'dgdimension', 'darkspirit', 'hideandseek', 'windcutter', 'electriccloud', 'gigafreeze'],
				baseSignatureMove: "energyshot",
				signatureMove: "Energy Shot",
			},
			"Giromon": {
				species: "Giromon",
				ability: "Vaccine",
				moves: ['upgrade', 'deleteprogram', 'reverseprogram', 'reboundstrike', 'megatonpunch', 'staticelectricity', 'megalospark', 'firewall'],
				baseSignatureMove: "deadlybomb",
				signatureMove: "Deadly Bomb",
			},
			"IceLeomon": {
				species: "IceLeomon",
				ability: "Data",
				moves: ['musclecharge', 'warcry', 'gigafreeze', 'icestatue', 'megatonpunch', 'winterblast', 'aurorafreeze', 'saintshield', 'burningheart'],
				baseSignatureMove: "fistofice",
				signatureMove: "Fist of Ice",
			},
			"LadyDevimon": {
				species: "LadyDevimon",
				ability: "Virus",
				moves: ['wingshoes', 'windcutter', 'evilsquall', 'fightingaura', 'electriccloud', 'evilfantasy', 'charmperfume', 'darkspirit', 'chaoscloud', 'warcry'],
				baseSignatureMove: "darknesswave",
				signatureMove: "Darkness Wave",
			},
			"Lillymon": {
				species: "Lillymon",
				ability: "Data",
				moves: ['earthcoat', 'charmperfume', 'rootbind', 'venomdisaster', 'wingshoes', 'windcutter', 'confusedstorm', 'saintheal', 'holybreath'],
				baseSignatureMove: "flowercannon",
				signatureMove: "Flower Cannon",
			},
			"MagnaAngemon": {
				species: "MagnaAngemon",
				ability: "Vaccine",
				moves: ['saintheal', 'saintshield', 'shiningnova', 'thunderjustice', 'antiattackfield', 'gigawattlaser', 'deleteprogram', 'sonicjab', 'megalospark', 'reboundstrike', 'holyjudgment', 'wingshoes'],
				baseSignatureMove: "gateofdestiny",
				signatureMove: "Gate of Destiny",
			},
			"Mamemon": {
				species: "Mamemon",
				ability: "Data",
				moves: ['musclecharge', 'sonicjab', 'fightingaura', 'reboundstrike', 'antiattackfield', 'upgrade', 'reverseprogram', 'gigawattlaser', 'gigafreeze', 'burningheart'],
				baseSignatureMove: "smilebomber",
				signatureMove: "Smile Bomber",
			},
			"Megadramon": {
				species: "Megadramon",
				ability: "Virus",
				moves: ['mechanicalclaw', 'upgrade', 'deleteprogram', 'blackout', 'shadowfall', 'staticelectricity', 'megalospark', 'firetower'],
				baseSignatureMove: "genocideattack",
				signatureMove: "Genocide Attack",
			},
			"MegaKabuterimon": {
				species: "MegaKabuterimon",
				ability: "Vaccine",
				moves: ['staticelectricity', 'rockfall', 'megatonpunch', 'megalospark', 'reboundstrike', 'earthcoat', 'massmorph', 'bug'],
				baseSignatureMove: "hornbuster",
				signatureMove: "Horn Buster",
			},
			"MegaSeadramon": {
				species: "MegaSeadramon",
				ability: "Data",
				moves: ['hailspear', 'waterblitz', 'gigafreeze', 'aurorafreeze', 'heatbreath', 'meltdown', 'shiningnova', 'staticelectricity', 'megalospark'],
				baseSignatureMove: "lightningjavelin",
				signatureMove: "Lightning Javelin",
			},
			"Meicrackmon": {
				species: "meicrackmon",
				ability: "Vaccine",
				moves: ['warcry', 'windcutter', 'fightingaura', 'megatonpunch', 'mechanicalclaw', 'venomdisaster', 'holyjudgment', 'saintray', 'holybreath'],
				baseSignatureMove: "modestlystun",
				signatureMove: "Modestly Stun",
			},
			"MeicrackmonViciousMode": {
				name: "Meicrackmon",
				species: "meicrackmonviciousmode",
				ability: "Virus",
				moves: ['warcry', 'windcutter', 'fightingaura', 'megatonpunch', 'mechanicalclaw', 'venomdisaster', 'shadowfall', 'evilsquall', 'blackout'],
				baseSignatureMove: "berserkthinking",
				signatureMove: "Berserk Thinking",
			},
			"MetalGreymonVaccine": {
				name: "MetalGreymon",
				species: "metalgreymonvaccine",
				ability: "Vaccine",
				moves: ['burningheart', 'heatbreath', 'firetower', 'infinityburn', 'musclecharge', 'sonicjab', 'reboundstrike', 'busterdrive', 'mechanicalclaw', 'gigawattlaser', 'deleteprogram'],
				baseSignatureMove: "gigadestroyer",
				signatureMove: "Giga Destroyer",
			},
			"MetalGreymonVirus": {
				name: "MetalGreymon",
				species: "metalgreymonvirus",
				ability: "Virus",
				moves: ['burningheart', 'heatbreath', 'firetower', 'infinityburn', 'musclecharge', 'sonicjab', 'blackout', 'shadowfall', 'mechanicalclaw', 'gigawattlaser', 'deleteprogram'],
				baseSignatureMove: "revengeflame",
				signatureMove: "Revenge Flame",
			},
			"MetalMamemon": {
				species: "MetalMamemon",
				ability: "Data",
				moves: ['musclecharge', 'mechanicalclaw', 'fightingaura', 'reboundstrike', 'deleteprogram', 'upgrade', 'reverseprogram', 'megalospark', 'winterblast', 'burningheart'],
				baseSignatureMove: "energybomb",
				signatureMove: "Energy Bomb",
			},
			"Meteormon": {
				species: "Meteormon",
				ability: "Data",
				moves: ['earthcoat', 'rockfall', 'heatbreath', 'prominencebeam', 'gigafreeze', 'megatonpunch', 'fightingaura'],
				baseSignatureMove: "galacticflare",
				signatureMove: "Galactic Flare",
			},
			"Monzaemon": {
				species: "Monzaemon",
				ability: "Vaccine",
				moves: ['fightingaura', 'poopattackfield', 'reboundstrike', 'megatonpunch', 'saintheal', 'holybreath', 'saintshield', 'saintray', 'charmperfume'],
				baseSignatureMove: "heartsattack",
				signatureMove: "Hearts Attack",
			},
			"Myotismon": {
				species: "Myotismon",
				ability: "Virus",
				moves: ['darkspirit', 'blackout', 'evilfantasy', 'electriccloud', 'aurorafreeze', 'evilsquall', 'wingshoes', 'confusedstorm', 'venomdisaster', 'reverseprogram'],
				baseSignatureMove: "grislywing",
				signatureMove: "Grisly Wing",
			},
			"Piximon": {
				species: "Piximon",
				ability: "Data",
				moves: ['saintheal', 'holybreath', 'saintshield', 'fightingaura', 'shiningnova', 'wingshoes', 'windcutter', 'electriccloud', 'antiattackfield', 'earthcoat', 'bug'],
				baseSignatureMove: "pitbomb",
				signatureMove: "Pit Bomb",
			},
			"ShogunGekomon": {
				species: "ShogunGekomon",
				ability: "Data",
				moves: ['earthcoat', 'confusedstorm', 'oceanwave', 'icestatue', 'gigafreeze', 'aurorafreeze', 'warcry', 'fightingaura', 'charmperfume'],
				baseSignatureMove: "musicalfist",
				signatureMove: "Musical Fist",
			},
			"SkullGreymon": {
				species: "SkullGreymon",
				ability: "Virus",
				moves: ['blackout', 'shadowfall', 'evilfantasy', 'evilsquall', 'heatbreath', 'firetower', 'infinityburn', 'sonicjab', 'reboundstrike', 'busterdrive', 'mechanicalclaw', 'deleteprogram'],
				baseSignatureMove: "oblivionbird",
				signatureMove: "Oblivion Bird",
			},
			"Tekkamon": {
				species: "Tekkamon",
				ability: "Virus",
				moves: ['upgrade', 'deleteprogram', 'reverseprogram', 'reboundstrike', 'megatonpunch', 'staticelectricity', 'shadowfall', 'firewall'],
				baseSignatureMove: "fragbomb",
				signatureMove: "Frag Bomb",
			},
			"Vademon": {
				species: "Vademon",
				ability: "Virus",
				moves: ['massmorph', 'charmperfume', 'bug', 'rockfall', 'upgrade', 'deleteprogram', 'dgdimension', 'cootieskick'],
				baseSignatureMove: "unidentifiedflyingkiss",
				signatureMove: "Unidentified Flying Kiss",
			},
			"Vermilimon": {
				species: "Vermilimon",
				ability: "Data",
				moves: ['heatbreath', 'firetower', 'infinityburn', 'prominencebeam', 'earthcoat', 'rockfall', 'musclecharge', 'busterdrive'],
				baseSignatureMove: "volcanicstrikes",
				signatureMove: "Volcanic Strike S",
			},
			"WaruMonzaemon": {
				species: "WaruMonzaemon",
				ability: "Virus",
				moves: ['fightingaura', 'poopattackfield', 'reboundstrike', 'megatonpunch', 'darkspirit', 'evilfantasy', 'hideandseek', 'charmperfume'],
				baseSignatureMove: "heartbreakattack",
				signatureMove: "Heartbreak Attack",
			},
			"WaruSeadramon": {
				species: "WaruSeadramon",
				ability: "Virus",
				moves: ['hailspear', 'waterblitz', 'gigafreeze', 'aurorafreeze', 'heatbreath', 'meltdown', 'staticelectricity', 'megalospark', 'evilsquall'],
				baseSignatureMove: "evilicicle",
				signatureMove: "Evil Icicle",
			},
			"WereGarurumon": {
				species: "WereGarurumon",
				ability: "Data",
				moves: ['warcry', 'musclecharge', 'sonicjab', 'megatonpunch', 'rockfall', 'burningheart', 'heatbreath', 'icestatue', 'aurorafreeze', 'winterblast', 'gigafreeze'],
				baseSignatureMove: "wolfclaw",
				signatureMove: "Wolf Claw",
			},
			"Whamon": {
				species: "Whamon",
				ability: "Vaccine",
				moves: ['waterblitz', 'oceanwave', 'icestatue', 'aurorafreeze', 'massmorph', 'charmperfume', 'saintshield', 'confusedstorm', 'busterdrive', 'saintheal'],
				baseSignatureMove: "tidalwave",
				signatureMove: "Tidal Wave",
			},
			"Zudomon": {
				species: "Zudomon",
				ability: "Vaccine",
				moves: ['electriccloud', 'thunderjustice', 'hailspear', 'icestatue', 'mechanicalclaw', 'aurorafreeze', 'antiattackfield', 'warcry', 'reboundstrike'],
				baseSignatureMove: "vulcanshammer",
				signatureMove: "Vulcan's Hammer",
			},
			//Mega//
			"Alphamon": {
				species: "Alphamon",
				ability: "Vaccine",
				moves: ['saintshield', 'saintray', 'holyjudgment', 'shiningnova', 'warcry', 'sonicjab', 'reboundstrike', 'upgrade', 'deleteprogram', 'dgdimension', 'burningheart', 'thunderjustice'],
				baseSignatureMove: "bladeofthedragonking",
				signatureMove: "Blade of the Dragon King",
			},
			"BlackMetalGarurumon": {
				species: "BlackMetalGarurumon",
				ability: "Virus",
				moves: ['warcry', 'mechanicalclaw', 'megalospark', 'winterblast', 'gigafreeze', 'icestatue', 'shadowfall', 'evilfantasy', 'aurorafreeze'],
				baseSignatureMove: "garurutomahawk",
				signatureMove: "Garuru Tomahawk",
			},
			"BlackWarGreymon": {
				species: "BlackWarGreymon",
				ability: "Virus",
				moves: ['burningheart', 'firetower', 'firewall', 'shadowfall', 'musclecharge', 'blackout', 'busterdrive', 'mechanicalclaw', 'antiattackfield', 'deleteprogram', 'evilfantasy'],
				baseSignatureMove: "blacktornado",
				signatureMove: "Black Tornado",
			},
			"Boltmon": {
				species: "Boltmon",
				ability: "Data",
				moves: ['electriccloud', 'megalospark', 'fightingaura', 'megatonpunch', 'mechanicalclaw', 'gigawattlaser', 'meltdown', 'infinityburn'],
				baseSignatureMove: "tomahawkstinger",
				signatureMove: "Tomahawk Stinger",
			},
			"CherubimonEvil": {
				name: "Cherubimon",
				species: "CherubimonEvil",
				ability: "Virus",
				moves: ['wingshoes', 'thunderjustice', 'megalospark', 'megatonpunch', 'blackout', 'chaoscloud', 'shadowfall', 'evilsquall', 'dgdimension', 'gigawattlaser'],
				baseSignatureMove: "lightningspear",
				signatureMove: "Lightning Spear",
			},
			"CherubimonGood": {
				name: "Cherubimon",
				species: "CherubimonGood",
				ability: "Vaccine",
				moves: ['wingshoes', 'thunderjustice', 'megalospark', 'megatonpunch', 'holybreath', 'saintray', 'holyjudgment', 'shiningnova', 'dgdimension', 'gigawattlaser'],
				baseSignatureMove: "heavensjudgment",
				signatureMove: "Heaven's Judgment",
			},
			"Devitamamon": {
				species: "Devitamamon",
				ability: "Data",
				moves: ['hailspear', 'blackout', 'evilfantasy', 'shadowfall', 'evilsquall', 'poopattackfield', 'extremepoopdeath', 'firetower'],
				baseSignatureMove: "blackdeathcloud",
				signatureMove: "Black Death Cloud",
			},
			"Dorugoramon": {
				species: "Dorugoramon",
				ability: "Data",
				moves: ['burningheart', 'infinityburn', 'prominencebeam', 'megalospark', 'thunderjustice', 'fightingaura', 'busterdrive', 'sonicjab', 'mechanicalclaw', 'antiattackfield', 'deleteprogram', 'gigawattlaser'],
				baseSignatureMove: "bravemetal",
				signatureMove: "Brave Metal",
			},
			"Ebemon": {
				species: "Ebemon",
				ability: "Virus",
				moves: ['confusedstorm', 'electriccloud', 'massmorph', 'bug', 'upgrade', 'gigawattlaser', 'dgdimension', 'cootieskick'],
				baseSignatureMove: "brainrupture",
				signatureMove: "Brain Rupture",
			},
			"HerculesKabuterimon": {
				species: "HerculesKabuterimon",
				ability: "Data",
				moves: ['confusedstorm', 'electriccloud', 'megalospark', 'thunderjustice', 'charmperfume', 'massmorph', 'bug', 'saintshield', 'holyflash', 'fightingaura'],
				baseSignatureMove: "gigablaster",
				signatureMove: "Giga Blaster",
			},
			"HiAndromon": {
				species: "HiAndromon",
				ability: "Vaccine",
				moves: ['sonicjab', 'electriccloud', 'megalospark', 'thunderjustice', 'saintheal', 'upgrade', 'antiattackfield', 'deleteprogram', 'gigawattlaser', 'bug', 'busterdrive', 'megatonpunch'],
				baseSignatureMove: "atomicray",
				signatureMove: "Atomic Ray",
			},
			"Lilithmon": {
				species: "Lilithmon",
				ability: "Virus",
				moves: ['evilfantasy', 'chaoscloud', 'shadowfall', 'windcutter', 'confusedstorm', 'charmperfume', 'venomdisaster', 'bug', 'aurorafreeze', 'mechanicalclaw'],
				baseSignatureMove: "phantompain",
				signatureMove: "Phantom Pain",
			},
			"Machinedramon": {
				species: "Machinedramon",
				ability: "Virus",
				moves: ['mechanicalclaw', 'upgrade', 'gigawattlaser', 'dgdimension', 'megalospark', 'thunderjustice', 'electriccloud', 'hideandseek', 'firewall', 'gigafreeze'],
				baseSignatureMove: "infinitycannon",
				signatureMove: "Infinity Cannon",
			},
			"Magnadramon": {
				species: "Magnadramon",
				ability: "Vaccine",
				moves: ['saintheal', 'holybreath', 'holyflash', 'holyjudgment', 'burningheart', 'firetower', 'prominencebeam', 'wingshoes', 'busterdrive', 'fightingaura'],
				baseSignatureMove: "firetornado",
				signatureMove: "Fire Tornado",
			},
			"MarineAngemon": {
				species: "MarineAngemon",
				ability: "Vaccine",
				moves: ['waterblitz', 'oceanwave', 'aurorafreeze', 'icestatue', 'saintheal', 'holybreath', 'saintshield', 'shiningnova', 'confusedstorm', 'wingshoes', 'antiattackfield', 'earthcoat'],
				baseSignatureMove: "oceanlove",
				signatureMove: "Ocean Love",
			},
			"MetalEtemon": {
				species: "MetalEtemon",
				ability: "Virus",
				moves: ['reverseprogram', 'dgdimension', 'upgrade', 'gigawattlaser', 'charmperfume', 'holyflash', 'guerrillapoop', 'extremepoopdeath'],
				baseSignatureMove: "darkrecital",
				signatureMove: "Dark Recital",
			},
			"MetalGarurumon": {
				species: "MetalGarurumon",
				ability: "Data",
				moves: ['warcry', 'mechanicalclaw', 'busterdrive', 'winterblast', 'gigafreeze', 'icestatue', 'rockfall', 'meltdown', 'aurorafreeze'],
				baseSignatureMove: "icewolfclaw",
				signatureMove: "Ice Wolf Claw",
			},
			"MetalSeadramon": {
				species: "MetalSeadramon",
				ability: "Data",
				moves: ['waterblitz', 'winterblast', 'oceanwave', 'icestatue', 'infinityburn', 'staticelectricity', 'megalospark', 'upgrade', 'deleteprogram'],
				baseSignatureMove: "riverofpower",
				signatureMove: "River of Power",
			},
			"Ophanimon": {
				species: "Ophanimon",
				ability: "Vaccine",
				moves: ['wingshoes', 'windcutter', 'thunderjustice', 'fightingaura', 'aurorafreeze', 'saintheal', 'holybreath', 'saintshield', 'saintray', 'warcry'],
				baseSignatureMove: "edensjavelin",
				signatureMove: "Eden's Javelin",
			},
			"Phoenixmon": {
				species: "Phoenixmon",
				ability: "Vaccine",
				moves: ['wingshoes', 'windcutter', 'thunderjustice', 'burningheart', 'meltdown', 'prominencebeam', 'warcry', 'busterdrive', 'holyjudgment', 'shiningnova', 'infinityburn'],
				baseSignatureMove: "starlightexplosion",
				signatureMove: "Starlight Explosion",
			},
			"PrinceMamemon": {
				species: "PrinceMamemon",
				ability: "Data",
				moves: ['musclecharge', 'sonicjab', 'megatonpunch', 'fightingaura', 'upgrade', 'reverseprogram', 'deleteprogram', 'dgdimension', 'holyflash', 'poopattackfield'],
				baseSignatureMove: "smilewarhead",
				signatureMove: "Smile Warhead",
			},
			"Raguelmon": {
				species: "Raguelmon",
				ability: "Virus",
				moves: ['warcry', 'windcutter', 'fightingaura', 'megatonpunch', 'mechanicalclaw', 'venomdisaster', 'shadowfall', 'evilsquall', 'blackout', 'deleteprogram'],
				baseSignatureMove: "darknesszone",
				signatureMove: "Darkness Zone",
			},
			"Rasielmon": {
				species: "Rasielmon",
				ability: "Vaccine",
				moves: ['warcry', 'windcutter', 'fightingaura', 'megatonpunch', 'mechanicalclaw', 'venomdisaster', 'holyjudgment', 'saintray', 'holybreath', 'dgdimension'],
				baseSignatureMove: "knowledgestream",
				signatureMove: "Knowledge Stream",
			},
			"Rosemon": {
				species: "Rosemon",
				ability: "Data",
				moves: ['earthcoat', 'charmperfume', 'rootbind', 'venomdisaster', 'wingshoes', 'confusedstorm', 'evilfantasy', 'saintheal', 'shiningnova'],
				baseSignatureMove: "thornwhip",
				signatureMove: "Thorn Whip",
			},
			"SaberLeomon": {
				species: "SaberLeomon",
				ability: "Data",
				moves: ['musclecharge', 'warcry', 'fightingaura', 'busterdrive', 'earthcoat', 'venomdisaster', 'saintshield', 'holyjudgment', 'mechanicalclaw', 'burningheart', 'infinityburn', 'shiningnova'],
				baseSignatureMove: "howlingcrusher",
				signatureMove: "Howling Crusher",
			},
			"Seraphimon": {
				species: "Seraphimon",
				ability: "Vaccine",
				moves: ['saintheal', 'saintshield', 'shiningnova', 'thunderjustice', 'antiattackfield', 'gigawattlaser', 'deleteprogram', 'sonicjab', 'megalospark', 'reboundstrike', 'holyjudgment', 'wingshoes'],
				baseSignatureMove: "strikeofthesevenstars",
				signatureMove: "Strike of the Seven Stars",
			},
			"VenomMyotismon": {
				species: "VenomMyotismon",
				ability: "Virus",
				moves: ['darkspirit', 'blackout', 'evilfantasy', 'megalospark', 'icestatue', 'shadowfall', 'wingshoes', 'staticelectricity', 'venomdisaster', 'deleteprogram'],
				baseSignatureMove: "venominfusion",
				signatureMove: "Venom Infusion",
			},
			"Vikemon": {
				species: "Vikemon",
				ability: "Vaccine",
				moves: ['hailspear', 'winterblast', 'icestatue', 'aurorafreeze', 'mechanicalclaw', 'antiattackfield', 'warcry', 'reboundstrike', 'megatonpunch', 'holyflash'],
				baseSignatureMove: "arcticblizzard",
				signatureMove: "Arctic Blizzard",
			},
			"WarGreymon": {
				species: "WarGreymon",
				ability: "Vaccine",
				moves: ['burningheart', 'firetower', 'firewall', 'infinityburn', 'musclecharge', 'sonicjab', 'busterdrive', 'mechanicalclaw', 'antiattackfield', 'deleteprogram', 'fightingaura'],
				baseSignatureMove: "terraforce",
				signatureMove: "Terra Force",
			},
		};

		// Generate the team randomly.
		let pool = Object.keys(sets);
		let weakmonclause = false;
		for (let i = 0; i < 6; i++) {
			let name = this.sampleNoReplace(pool);
			let digiSet = sets[name];
			if (digiSet.moves.includes('acidbubble')) {
				if (weakmonclause === true) {
					// Skip this digimon
					i--;
					continue;
				} else {
					weakmonclause = true;
				}
			}

			/** @type {PokemonSet} */
			let set = {
				name: digiSet.name || name,
				species: digiSet.species,
				item: '',
				ability: Array.isArray(digiSet.ability) ? this.sampleNoReplace(digiSet.ability) : digiSet.ability,
				moves: [this.sampleNoReplace(digiSet.moves), this.sampleNoReplace(digiSet.moves), this.sampleNoReplace(digiSet.moves), 'Protect'],
				nature: this.sampleNoReplace(['Bashful', 'Docile', 'Hardy', 'Quirky', 'Serious']),
				gender: 'N',
				evs: {hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85},
				ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
				level: 0,
				shiny: false,
			};

			if (digiSet.signatureMove) {
				set.moves.push(digiSet.signatureMove);
			}

			// Inherit how pokemon does it with Kuramon instead of sunkern
			let mbstmin = 1381;

			let template = this.getTemplate(set.species);
			let stats = template.baseStats;
			// Modified base stat total assumes 31 IVs, 85 EVs in every stat
			let mbst = (stats["hp"] * 2 + 31 + 21 + 100) + 10;
			mbst += (stats["atk"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["def"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spa"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spd"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spe"] * 2 + 31 + 21 + 100) + 5;

			let level = Math.floor(100 * mbstmin / mbst); // Initial level guess will underestimate

			while (level < 100) {
				mbst = Math.floor((stats["hp"] * 2 + 31 + 21 + 100) * level / 100 + 10);
				mbst += Math.floor(((stats["atk"] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100); // Since damage is roughly proportional to level
				mbst += Math.floor((stats["def"] * 2 + 31 + 21 + 100) * level / 100 + 5);
				mbst += Math.floor(((stats["spa"] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
				mbst += Math.floor((stats["spd"] * 2 + 31 + 21 + 100) * level / 100 + 5);
				mbst += Math.floor((stats["spe"] * 2 + 31 + 21 + 100) * level / 100 + 5);

				if (mbst >= mbstmin) break;
				level++;
			}
			level = level + 20; // Add 20. It lessens the level gap
			if (level > 100) {
				level = 100;
			} else {
				level = (level % 5) >= 2.5 ? (level / 5) * 5 + 5 : (level / 5) * 5; //Rounds to the Nearest 5 for simplicity
			}
			set.level = level;

			team.push(set);
		}
		return team;
	}
}

module.exports = RandomDigimonTeams;
