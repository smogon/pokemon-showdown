import RandomTeams from '../../random-battles/gen9/teams';

export interface FERBSet {
	species: string;
	ability: string | string[];
	item: string | string[];
	gender: GenderName | GenderName[];
	moves: (string | string[])[];
	signatureMove: string;
	evs?: { hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number };
	ivs?: { hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number };
	nature?: string | string[];
	shiny?: number | boolean;
	level?: number;
	happiness?: number;
	skip?: string;
	teraType?: string | string[];
}
interface FERBSets { [k: string]: FERBSet }

export const ferbSets: FERBSets = {
	Revarantis: {
		species: 'Revarantis', ability: 'Unfiltered', item: 'Leftovers', gender: '',
		moves: ['Overheat', 'Spin Out', 'Synthesis'],
		signatureMove: 'Leaf Storm',
		evs: { hp: 252, spa: 252, spd: 4 }, nature: 'Modest', teraType: 'Flying', level: 79,
	},
	Rotoghold: {
		species: 'Rotoghold', ability: 'Holy Grail', item: 'Choice Scarf', gender: '',
		moves: ['Shadow Ball', 'Volt Switch', 'Trick'],
		signatureMove: 'Make It Rain',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Steel', level: 78,
	},
	Toedieleki: {
		species: 'Toedieleki', ability: 'Galvanic Relay', item: 'Assault Vest', gender: '',
		moves: ['Earth Power', ['Rapid Spin', 'Thunderbolt'], ['Knock Off', 'Leaf Storm']],
		signatureMove: 'Volt Switch',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Steel', level: 78,
	},
	'Arbolosion-Hisui': {
		species: 'Arbolosion-Hisui', ability: 'Grassy Surge', item: 'Eject Pack', gender: '',
		moves: ['Leaf Storm', 'Overheat', 'Earth Power'],
		signatureMove: 'Strength Sap',
		evs: { hp: 248, spa: 252, spd: 8 }, nature: 'Modest', teraType: 'Fairy', level: 85,
	},
	'Iron Meta': {
		species: 'Iron Meta', ability: 'Light Drive', item: 'Booster Energy', gender: 'N',
		moves: ['Acrobatics', ['Knock Off', 'Stealth Rock'], 'U-turn'],
		signatureMove: 'Meteor Mash',
		evs: { hp: 252, atk: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 75,
	},
	'Iron Meta-Mega': {
		species: 'Iron Meta', ability: 'Light Drive', item: 'Metagrossite', gender: 'N',
		moves: ['Bullet Punch', ['Knock Off', 'Fire Punch'], 'Earthquake'],
		signatureMove: 'Meteor Mash',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 71, skip: 'Iron Meta',
	},
	'Deciperior-Hisui': {
		species: 'Deciperior-Hisui', ability: 'Scrap Rock', item: 'Leftovers', gender: '',
		moves: ['Stealth Rock', ['Earthquake', 'Triple Arrows'], 'U-turn'],
		signatureMove: 'Roost',
		evs: { hp: 252, atk: 4, def: 252 }, nature: 'Modest', teraType: 'Fire', level: 84,
	},
	'Slither King': {
		species: 'Slither King', ability: 'Opening Act', item: 'Leftovers', gender: 'N',
		moves: ['Morning Sun', 'U-turn', ['Thunder Wave', 'Will-O-Wisp']],
		signatureMove: 'Spikes',
		evs: { hp: 252, atk: 4, spd: 252 }, nature: 'Careful', teraType: 'Ghost', level: 74,
	},
	Gargamise: {
		species: 'Gargamise', ability: 'Necromancer', item: 'Leftovers', gender: 'N',
		moves: ['Recover', ['Stealth Rock', 'Rapid Spin'], ['Knock Off', 'Protect']],
		signatureMove: "Salt Cure",
		evs: { hp: 252, atk: 4, spd: 252 }, nature: 'Careful', teraType: 'Ground', level: 79,
	},
	Drampiclus: {
		species: 'Drampiclus', ability: 'Regain Patience', item: 'Leftovers', gender: '',
		moves: ['Draco Meteor', ['Focus Blast', 'Fire Blast', 'Roost'], 'Psychic'],
		signatureMove: "Trick Room",
		evs: { hp: 252, def: 4, spa: 252 }, ivs: { spe: 0 }, nature: 'Quiet', teraType: 'Fire', level: 80,
	},
	'Muktaria-Alola': {
		species: 'Muktaria-Alola', ability: 'Neutralizing Gas', item: 'Black Sludge', gender: '',
		moves: ['Roost', ['Will-O-Wisp', 'Haze'], 'Knock Off'],
		signatureMove: 'Poison Fang',
		evs: { hp: 252, atk: 4, spd: 252 }, nature: 'Careful', teraType: 'Water', level: 86,
	},
	'Muktaria-Alola-Mega': {
		species: 'Muktaria-Alola', ability: 'Neutralizing Gas', item: 'Altarianite', gender: '',
		moves: ['Dragon Dance', ['Stone Edge', 'Roost'], 'Earthquake'],
		signatureMove: 'Double-Edge',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 86, skip: 'Muktaria-Alola',
	},
	'Whimsy Sands': {
		species: 'Whimsy Sands', ability: 'Once Upon a Time', item: 'Leftovers', gender: 'N',
		moves: ['Protect', 'Substitute', ['Moonblast', 'Earth Power']],
		signatureMove: "Leech Seed",
		evs: { hp: 252, spa: 4, spe: 252 }, nature: 'Timid', teraType: 'Fighting', level: 79,
	},
	'Roaring Sal': {
		species: 'Roaring Sal', ability: 'Primitive', item: 'Heavy-Duty Boots', gender: 'F',
		moves: [['Flare Blitz', 'Fire Lash'], 'U-turn', ['Roost', 'Earthquake', 'Taunt']],
		signatureMove: 'Knock Off',
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 74,
	},
	'Sol Valiant': {
		species: 'Sol Valiant', ability: 'Baryon Blade', item: 'Booster Energy', gender: 'N',
		moves: ['Play Rough', ['Close Combat', 'Fire Punch'], 'Swords Dance'],
		signatureMove: 'Night Slash',
		evs: { atk: 212, spd: 44, spe: 252 }, nature: 'Jolly', teraType: 'Poison', level: 77,
	},
	'Sol Valiant-Mega': {
		species: 'Sol Valiant', ability: 'Baryon Blade', item: 'Absolite', gender: 'N',
		moves: ['Knock Off', ['Fire Blast', 'Psychic', 'Close Combat'], 'Encore'],
		signatureMove: 'Moonblast',
		evs: { atk: 88, spa: 168, spe: 252 }, nature: 'Naive', teraType: 'Water', level: 72, skip: 'Sol Valiant',
	},
	'Meowscorio-Sensu': {
		species: 'Meowscorio-Sensu', ability: 'Choreography', item: 'Leftovers', gender: '',
		moves: ['Revelation Dance', 'Hurricane', 'Roost'],
		signatureMove: 'Quiver Dance',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Ground', level: 84,
	},
	Brambleswine: {
		species: 'Brambleswine', ability: 'Squall', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Icicle Crash', 'Rapid Spin', ['Knock Off', 'Spikes']],
		signatureMove: 'Power Whip',
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Fairy', level: 84,
	},
	Relishadow: {
		species: 'Relishadow', ability: 'Stone Wheel', item: 'Choice Band', gender: 'N',
		moves: ['Shadow Sneak', 'Close Combat', 'Head Smash'],
		signatureMove: 'Spectral Thief',
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Fairy', level: 84,
	},
	Garpyuku: {
		species: 'Garpyuku', ability: 'Eczema', item: 'Booster Energy', gender: '',
		moves: ['Earthquake', ['Stealth Rock', 'Toxic', 'Spikes'], 'Recover'],
		signatureMove: 'Liquidation',
		evs: { hp: 252, def: 252, spd: 4 }, nature: 'Impish', teraType: 'Poison', level: 81,
	},
	'Garpyuku-Mega': {
		species: 'Garpyuku', ability: 'Eczema', item: 'Garchompite', gender: '',
		moves: ['Earthquake', ['Stealth Rock', 'Toxic', 'Spikes'], 'Recover'],
		signatureMove: 'Liquidation',
		evs: { hp: 252, def: 252, spd: 4 }, nature: 'Impish', teraType: 'Water', level: 81, skip: 'Garpyuku',
	},
	Yveltox: {
		species: 'Yveltox', ability: 'Aura Shield', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Sludge Bomb', 'Heat Wave', ['Hurricane', 'Oblivion Wing']],
		signatureMove: 'Quiver Dance',
		evs: { hp: 4, spa: 252, spe: 252 }, nature: 'Timid', teraType: 'Stellar', level: 89,
	},
	'Iron Mimic': {
		species: 'Iron Mimic', ability: 'Faulty Photon', item: 'Booster Energy', gender: 'N',
		moves: ['Stone Edge', 'Earthquake', 'Dragon Dance'],
		signatureMove: 'Play Rough',
		evs: { hp: 4, atk: 252, spe: 252 }, nature: 'Jolly', teraType: 'Bug', level: 81,
	},
	'Iron Dirge': {
		species: 'Iron Dirge', ability: 'Firewall', item: 'Booster Energy', gender: 'N',
		moves: ['Slack Off', 'Earth Power', 'Rapid Spin'],
		signatureMove: 'Torch Song',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Ghost', level: 74,
	},
	'Iron Tornado': {
		species: 'Iron Tornado', ability: 'Nanorepairs', item: 'Booster Energy', gender: 'N',
		moves: ['Close Combat', 'Swords Dance', ['Earthquake', 'Knock Off']],
		signatureMove: 'Acrobatics',
		evs: { hp: 4, atk: 252, spe: 252 }, nature: 'Jolly', teraType: 'Fairy', level: 77,
	},
	Deliraidon: {
		species: 'Deliraidon', ability: 'Iron Sights', item: 'Life Orb', gender: 'N',
		moves: ['U-turn', ['Overheat', 'Thunder'], 'Blizzard'],
		signatureMove: 'Draco Meteor',
		evs: { spa: 252, def: 4, spe: 252 }, nature: 'Timid', teraType: 'Fairy', level: 79,
	},
	Stargrowth: {
		species: 'Stargrowth', ability: 'Rejuvenate', item: 'Leftovers', gender: 'N',
		moves: ['Giga Drain', ['Flip Turn', 'Leech Seed'], 'Recover'],
		signatureMove: 'Scald',
		evs: { hp: 252, def: 252, spa: 4 }, nature: 'Bold', teraType: 'Fairy', level: 79,
	},
	Floatzera: {
		species: 'Floatzera', ability: 'Electromagnetic Veil', item: 'Life Orb', gender: 'N',
		moves: ['Wave Crash', 'Flip Turn', ['Knock Off', 'Ice Spinner']],
		signatureMove: 'Plasma Fists',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Psychic', level: 80,
	},
	Crygargonal: {
		species: 'Crygargonal', ability: 'Rising Tension', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Nasty Plot', 'Sludge Wave', 'Focus Blast'],
		signatureMove: 'Freeze-Dry',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Steel', level: 85,
	},
	'Crygargonal-Mega': {
		species: 'Crygargonal', ability: 'Rising Tension', item: 'Gengarite', gender: 'N',
		moves: ['Freeze-Dry', ['Encore', 'Will-O-Wisp'], 'Sludge Wave'],
		signatureMove: 'Recover',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Water', level: 70, skip: 'Crygargonal',
	},
	Wopple: {
		species: 'Wopple', ability: 'Grindset', item: 'Choice Band', gender: 'N',
		moves: ['Outrage', 'Knock Off', 'U-turn'],
		signatureMove: 'Grav Apple',
		evs: { hp: 4, atk: 252, spe: 252 }, nature: 'Jolly', teraType: 'Steel', level: 84,
	},
	Amphamence: {
		species: 'Amphamence', ability: 'Shock Factor', item: 'Heavy-Duty Boots', gender: '',
		moves: [['Volt Switch', 'Discharge'], 'Hurricane', ['Hydro Pump', 'Flamethrower']],
		signatureMove: 'Roost',
		evs: { hp: 252, spa: 252, spe: 4 }, nature: 'Modest', teraType: 'Rock', level: 78,
	},
	'Amphamence-Mega-X': {
		species: 'Amphamence', ability: 'Shock Factor', item: 'Salamencite', gender: '',
		moves: ['Earthquake', 'Roost', 'Dragon Dance'],
		signatureMove: 'Double-Edge',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 73, skip: 'Amphamence',
	},
	'Amphamence-Mega-Y': {
		species: 'Amphamence', ability: 'Shock Factor', item: 'Ampharosite', gender: '',
		moves: ['Hydro Pump', 'Roost', 'Draco Meteor'],
		signatureMove: 'Thunderbolt',
		evs: { hp: 252, spa: 252, spe: 4 }, nature: 'Modest', teraType: 'Water', level: 73, skip: 'Amphamence',
	},
	'Iron Legion': {
		species: 'Iron Legion', ability: 'Circuit Breaker', item: 'Choice Specs', gender: 'N',
		moves: ['Hydro Pump', 'Freeze-Dry', 'Flip Turn'],
		signatureMove: 'Shadow Ball',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Fairy', level: 81,
	},
	Celedos: {
		species: 'Celedos', ability: 'Natural Pressures', item: 'Choice Specs', gender: 'N',
		moves: [['Trick', 'Healing Wish'], 'Volt Switch', 'Thunderbolt'],
		signatureMove: 'Leaf Storm',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Fairy', level: 81,
	},
	Primeleo: {
		species: 'Primeleo', ability: 'Vital Metal Body', item: 'Leftovers', gender: 'N',
		moves: [['Sunsteel Strike', 'Drain Punch'], 'Bulk Up', 'Morning Sun'],
		signatureMove: 'Rage Fist',
		evs: { hp: 252, spd: 252, spe: 4 }, nature: 'Careful', teraType: 'Water', level: 82,
	},
	Bellikiss: {
		species: 'Bellikiss', ability: 'Fortunomorphosis', item: 'Leftovers', gender: '',
		moves: ['Slack Off', 'Discharge', 'Volt Switch'],
		signatureMove: 'Dazzling Gleam',
		evs: { hp: 252, def: 252, spd: 4 }, nature: 'Bold', teraType: 'Steel', level: 75,
	},
	'Samuraiai-Hisui': {
		species: 'Samuraiai-Hisui', ability: 'Rebel\'s Blade', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Aqua Cutter', 'Cross Poison', ['Sacred Sword', 'U-turn', 'Flip Turn']],
		signatureMove: 'Ceaseless Edge',
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Steel', level: 77,
	},
	Florgerouge: {
		species: 'Florgerouge', ability: 'Burning Petals', item: ['Choice Specs', 'Choice Scarf'], gender: '',
		moves: ['Moonblast', 'Trick', ['Energy Ball', 'Psychic']],
		signatureMove: 'Armor Cannon',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Grass', level: 82,
	},
	'Urshiluxe-Rapid-Strike': {
		species: 'Urshiluxe-Rapid-Strike', ability: 'Snowblind', item: 'Assault Vest', gender: '',
		moves: ['Close Combat', 'U-turn', 'Ice Spinner'],
		signatureMove: 'Surging Strikes',
		evs: { hp: 4, atk: 252, spe: 252 }, nature: 'Adamant', teraType: 'Water', level: 82,
	},
	Tinkovish: {
		species: 'Tinkovish', ability: 'Slushie', item: 'Leftovers', gender: 'F',
		moves: ['Substitute', 'Gigaton Hammer', 'Swords Dance'],
		signatureMove: 'Fishious Rend',
		evs: { hp: 4, atk: 252, spe: 252 }, nature: 'Adamant', teraType: 'Water', level: 82,
	},
	'Goopert-Hisui': {
		species: 'Goopert-Hisui', ability: 'Pondweed', item: 'Leftovers', gender: '',
		moves: ['Stealth Rock', ['Draco Meteor', 'Flip Turn'], 'Knock Off'],
		signatureMove: 'Surf',
		evs: { hp: 252, spa: 4, spd: 252 }, nature: 'Sassy', teraType: 'Water', level: 83,
	},
	'Goopert-Hisui-Mega': {
		species: 'Goopert-Hisui', ability: 'Pondweed', item: 'Swampertite', gender: '',
		moves: ['Dragon Claw', ['Earthquake', 'Flip Turn'], 'Liquidation'],
		signatureMove: 'Rain Dance',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Adamant', teraType: 'Water', level: 75, skip: 'Goopert-Hisui',
	},
	'Baxgeist-Large': {
		species: 'Baxgeist-Large', ability: 'Frisk Exchange', item: 'Life Orb', gender: '',
		moves: ['Poltergeist', ['Shadow Sneak', 'Earthquake'], ['Swords Dance', 'Dragon Dance']],
		signatureMove: 'Glaive Rush',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Any', level: 83,
	},
	Cresserace: {
		species: 'Cresserace', ability: 'Free Flight', item: 'Heavy-Duty Boots', gender: 'F',
		moves: ['Pyro Ball', ['Recover', 'Moonlight'], ['U-turn', 'Healing Wish']],
		signatureMove: 'Court Change',
		evs: { hp: 252, spa: 4, spe: 252 }, nature: 'Timid', teraType: 'Any', level: 85,
	},
	'Tapu Titan': {
		species: 'Tapu Titan', ability: 'Force of Nature', item: 'Life Orb', gender: 'N',
		moves: ['Icicle Crash', 'Liquidation', 'Ice Shard'],
		signatureMove: 'Play Rough',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Adamant', teraType: 'Flying', level: 85,
	},
	'Necrotrik-Dawn-Wings': {
		species: 'Necrotrik-Dawn-Wings', ability: 'Airborne Armor', item: 'Leftovers', gender: 'N',
		moves: ['Trick Room', 'Thunderbolt', 'Giga Drain'],
		signatureMove: 'Moongeist Beam',
		evs: { hp: 252, spa: 252, spe: 4 }, ivs: { spe: 0 }, nature: 'Quiet', teraType: 'Water', level: 85,
	},
	'Necrotrik-Ultra': {
		species: 'Necrotrik-Dawn-Wings', ability: 'Airborne Armor', item: 'Depleted Ultranecrozium Z', gender: 'N',
		moves: ['Dragon Dance', 'Earthquake', 'Dragon Claw'],
		signatureMove: 'Wild Charge',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 85, skip: 'Necrotrik-Dawn-Wings',
	},
	Druddizor: {
		species: 'Druddizor', ability: 'Bleeding Edge', item: 'Leftovers', gender: '',
		moves: ['Stealth Rock', 'Bullet Punch', ['Dragon Tail', 'Breaking Swipe', 'U-turn']],
		signatureMove: 'Glare',
		evs: { hp: 252, def: 252, spd: 4 }, nature: 'Impish', teraType: 'Water', level: 84,
	},
	'Druddizor-Mega': {
		species: 'Druddizor', ability: 'Bleeding Edge', item: 'Scizorite', gender: '',
		moves: ['Swords Dance', 'Iron Head', 'Close Combat'],
		signatureMove: 'Scale Shot',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 83, skip: 'Druddizor',
	},
	'Great Kleav': {
		species: 'Great Kleav', ability: 'Ancient Marble', item: 'Choice Band', gender: 'N',
		moves: ['U-turn', 'Headlong Rush', 'X-Scissor'],
		signatureMove: 'Stone Axe',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Psychic', level: 83,
	},
	'Scream Cormorant': {
		species: 'Scream Cormorant', ability: 'Prehistoric Hunter', item: 'Rocky Helmet', gender: 'N',
		moves: ['Surf', 'Dazzling Gleam', 'Roost'],
		signatureMove: 'Defog',
		evs: { hp: 252, def: 4, spe: 252 }, nature: 'Timid', teraType: 'Poison', level: 74,
	},
	'Yu-Clod': {
		species: 'Yu-Clod', ability: 'Sponge of Ruin', item: 'Heavy-Duty Boots', gender: 'N',
		moves: [['Stealth Rock', 'Spikes', 'Toxic'], 'Recover', 'Sludge Bomb'],
		signatureMove: 'Lava Plume',
		evs: { hp: 252, def: 4, spd: 252 }, nature: 'Calm', teraType: 'Fairy', level: 81,
	},
	Mawlakazam: {
		species: 'Mawlakazam', ability: 'Overwhelming', item: 'Life Orb', gender: '',
		moves: ['Psychic', 'Dazzling Gleam', 'Fire Blast'],
		signatureMove: 'Focus Blast',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Water', level: 93,
	},
	'Mawlakazam-Mega-X': {
		species: 'Mawlakazam', ability: 'Overwhelming', item: 'Mawilite', gender: '',
		moves: ['Swords Dance', 'Play Rough', 'Sucker Punch'],
		signatureMove: 'Psychic Fangs',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 86, skip: 'Mawlakazam',
	},
	'Mawlakazam-Mega-Y': {
		species: 'Mawlakazam', ability: 'Overwhelming', item: 'Alakazite', gender: '',
		moves: [['Calm Mind', 'Nasty Plot'], 'Dazzling Gleam', ['Fire Blast', 'Focus Blast']],
		signatureMove: 'Psychic',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Water', level: 86, skip: 'Mawlakazam',
	},
	'Bouffa-Lu': {
		species: 'Bouffa-Lu', ability: 'Lawnmower of Ruin', item: 'Leftovers', gender: 'N',
		moves: ['Spikes', ['Body Slam', 'Earthquake'], 'Whirlwind'],
		signatureMove: 'Ruination',
		evs: { hp: 252, def: 4, spd: 252 }, nature: 'Careful', teraType: 'Ghost', level: 80,
	},
	Vikadrago: {
		species: 'Vikadrago', ability: 'Hellkite', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Earth Power', ['Bug Buzz', 'Volt Switch'], ['Dragon Energy', 'Draco Meteor']],
		signatureMove: 'Sticky Web',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Ghost', level: 92,
	},
	Icekrai: {
		species: 'Icekrai', ability: 'Winter Storm', item: ['Choice Specs', 'Choice Scarf'], gender: 'N',
		moves: ['Ice Beam', 'Trick', ['Focus Blast', 'Sludge Bomb', 'Thunderbolt']],
		signatureMove: 'Dark Pulse',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Ghost', level: 80,
	},
	'Weezaluna-Bloodmoon': {
		species: 'Weezaluna-Bloodmoon', ability: 'Air Control', item: 'Black Sludge', gender: 'M',
		moves: ['Moonlight', ['Calm Mind', 'Toxic Spikes'], ['Earth Power', 'Flamethrower']],
		signatureMove: 'Sludge Bomb',
		evs: { hp: 252, def: 252, spe: 4 }, nature: 'Bold', teraType: 'Ghost', level: 76,
	},
	'Amigotrio-Alola': {
		species: 'Amigotrio-Alola', ability: 'Lively Locks', item: 'Life Orb', gender: '',
		moves: [['U-turn', 'Swords Dance'], 'Earthquake', ['Stone Edge', 'Close Combat']],
		signatureMove: 'Brave Bird',
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Ground', level: 86,
	},
	'Iron Matcha': {
		species: 'Iron Matcha', ability: 'Heatproof Drive', item: 'Black Sludge', gender: 'N',
		moves: ['Flamethrower', 'Strength Sap', 'Calm Mind'],
		signatureMove: 'Matcha Gotcha',
		evs: { hp: 252, def: 252, spe: 4 }, nature: 'Bold', teraType: 'Ghost', level: 79,
	},
	'Aero Wake': {
		species: 'Aero Wake', ability: 'Dyschronometria', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Hydro Pump', ['Roost', 'Stealth Rock'], 'Flip Turn'],
		signatureMove: 'Hurricane',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Water', level: 85,
	},
	'Aero Wake-Mega': {
		species: 'Aero Wake', ability: 'Dyschronometria', item: 'Aerodactylite', gender: 'N',
		moves: ['Liquidation', 'Flip Turn', 'Dual Wingbeat'],
		signatureMove: 'Fire Fang',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 78, skip: 'Aero Wake',
	},
	Anoraidon: {
		species: 'Anoraidon', ability: 'Drizzle', item: 'Life Orb', gender: 'N',
		moves: ['Close Combat', 'Knock Off', ['Rapid Spin', 'Aqua Jet']],
		signatureMove: 'U-turn',
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 83,
	},
	'Deoxyslash-Speed': {
		species: 'Deoxyslash-Speed', ability: 'Forced Fencer', item: 'Weakness Policy', gender: 'N',
		moves: ['Recover', 'Nasty Plot', ['Focus Blast', 'Flash Cannon']],
		signatureMove: 'Psycho Boost',
		evs: { hp: 252, spa: 4, spe: 252 }, nature: 'Timid', teraType: 'Dark', level: 78,
	},
	'Lelecuno-Galar': {
		species: 'Lelecuno-Galar', ability: 'Mind Domain', item: ['Choice Specs', 'Choice Scarf'], gender: 'N',
		moves: ['Moonblast', ['Focus Blast', 'Shadow Ball'], 'Trick'],
		signatureMove: 'Expanding Force',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Dark', level: 76,
	},
	Guguzzparce: {
		species: 'Guguzzparce', ability: 'All-Devouring', item: 'Assault Vest', gender: 'N',
		moves: ['Draco Meteor', 'Dark Pulse', 'Fire Blast'],
		signatureMove: 'Boomburst',
		evs: { hp: 252, def: 4, spa: 252 }, nature: 'Modest', teraType: 'Any', level: 88,
	},
	'Golisoros-Paldea-Blaze': {
		species: 'Golisoros-Paldea-Blaze', ability: 'Mad Cow', item: 'Leftovers', gender: 'M',
		moves: ['Iron Defense', 'Protect', ['Knock Off', 'Liquidation']],
		signatureMove: 'Body Press',
		evs: { hp: 252, spd: 252, spe: 4 }, nature: 'Careful', teraType: 'Fire', level: 89,
	},
	'Aggram': {
		species: 'Aggram', ability: 'Molten Core', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Flare Blitz', ['Superpower', 'Dragon Dance'], 'Earthquake'],
		signatureMove: 'Head Smash',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Adamant', teraType: 'Water', level: 81,
	},
	'Aggram-Mega': {
		species: 'Aggram', ability: 'Molten Core', item: 'Aggronite', gender: 'N',
		moves: ['Stealth Rock', 'Will-O-Wisp', ['Body Press', 'Earthquake', 'Dragon Tail']],
		signatureMove: 'Stone Edge',
		evs: { hp: 252, spd: 252, spe: 4 }, nature: 'Careful', teraType: 'Water', level: 75, skip: 'Aggram',
	},
	Tyranix: {
		species: 'Tyranix', ability: 'Sand Wrath', item: 'Life Orb', gender: '',
		moves: ['Earth Power', ['Fire Blast', 'Thunderbolt'], 'Ice Beam'],
		signatureMove: 'Rock Slide',
		evs: { hp: 252, atk: 4, spa: 252 }, nature: 'Brave', teraType: 'Water', level: 90,
	},
	'Tyranix-Mega-X': {
		species: 'Tyranix', ability: 'Sand Wrath', item: 'Tyranitarite', gender: '',
		moves: ['Earthquake', 'Stone Edge', ['Fire Punch', 'Ice Punch']],
		signatureMove: 'Dragon Dance',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 90, skip: 'Tyranix',
	},
	'Tyranix-Mega-Y': {
		species: 'Tyranix', ability: 'Sand Wrath', item: 'Steelixite', gender: '',
		moves: [['Fire Punch', 'Ice Punch'], 'Stone Edge', 'Stealth Rock'],
		signatureMove: 'Earthquake',
		evs: { hp: 252, atk: 252, spd: 4 }, nature: 'Adamant', teraType: 'Water', level: 90, skip: 'Tyranix',
	},
	Conkelbun: {
		species: 'Conkelbun', ability: 'Adrenaline Aroma', item: 'Flame Orb', gender: '',
		moves: ['Play Rough', 'Close Combat', ['Mach Punch', 'Earthquake']],
		signatureMove: 'Facade',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Adamant', teraType: 'Ghost', level: 92,
	},
	Chomptry: {
		species: 'Chomptry', ability: 'Sand Rush', item: 'Loaded Dice', gender: '',
		moves: ['Knock Off', ['Earthquake', 'Poison Jab'], 'Swords Dance'],
		signatureMove: 'Scale Shot',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 93,
	},
	'Chomptry-Mega': {
		species: 'Chomptry', ability: 'Sand Rush', item: 'Garchompite', gender: '',
		moves: ['Nasty Plot', 'Draco Meteor', ['Fire Blast', 'Focus Blast', 'Extrasensory']],
		signatureMove: 'Dark Pulse',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Water', level: 93, skip: 'Chomptry',
	},
	Overgyara: {
		species: 'Overgyara', ability: 'Intimidate', item: 'Black Sludge', gender: '',
		moves: ['Scald', ['Toxic Spikes', 'Thunder Wave'], 'Spikes'],
		signatureMove: 'Barb Barrage',
		evs: { hp: 252, def: 252, spe: 4 }, nature: 'Impish', teraType: 'Water', level: 87,
	},
	'Overgyara-Mega': {
		species: 'Overgyara', ability: 'Intimidate', item: 'Gyaradosite', gender: '',
		moves: ['Liquidation', 'Dragon Dance', ['Earthquake', 'Temper Flare', 'Gunk Shot']],
		signatureMove: 'Crunch',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 87, skip: 'Overgyara',
	},
	'Sneasel-Prime': {
		species: 'Sneasel-Prime', ability: 'Inner Focus', item: 'Eviolite', gender: '',
		moves: ['Swords Dance', ['Knock Off', 'Close Combat', 'Ice Shard'], 'Gunk Shot'],
		signatureMove: 'Triple Axel',
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 89,
	},
	Brambleshao: {
		species: 'Brambleshao', ability: 'Storm Clinic', item: 'Life Orb', gender: '',
		moves: ['Close Combat', 'U-turn', ['Knock Off', 'Triple Axel', 'Rapid Spin']],
		signatureMove: 'Power Whip',
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Flying', level: 85,
	},
	Eisephalon: {
		species: 'Eisephalon', ability: 'Ultra Face', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Freeze-Dry', 'Fire Blast', 'Hydro Pump'],
		signatureMove: 'Overheat',
		evs: { def: 4, spa: 252, spe: 252 }, nature: 'Timid', teraType: 'Normal', level: 87,
	},
	Frosgambit: {
		species: 'Frosgambit', ability: 'Emperor\'s Clothes', item: ['Colbur Berry', 'Shuca Berry'], gender: '',
		moves: ['Pain Split', 'Poltergeist', ['Will-O-Wisp', 'Spikes', 'Shadow Sneak']],
		signatureMove: 'Iron Head',
		evs: { hp: 252, atk: 252, spd: 4 }, nature: 'Adamant', teraType: 'Water', level: 87,
	},
	Kabupult: {
		species: 'Kabupult', ability: 'No Nonsense', item: 'Choice Specs', gender: '',
		moves: ['U-turn', ['Fire Blast', 'Thunderbolt'], 'Hydro Pump'],
		signatureMove: 'Shadow Ball',
		evs: { def: 4, spa: 252, spe: 252 }, nature: 'Timid', teraType: 'Normal', level: 90,
	},
	Magnegiri: {
		species: 'Magnegiri', ability: 'Commanding Pull', item: 'Choice Specs', gender: 'N',
		moves: ['Thunderbolt', 'Draco Meteor', 'Flash Cannon'],
		signatureMove: 'Volt Switch',
		evs: { def: 4, spa: 252, spe: 252 }, nature: 'Timid', teraType: 'Normal', level: 81,
	},
	Celeblim: {
		species: 'Celeblim', ability: 'Ultra Shackles', item: 'Power Herb', gender: 'N',
		moves: ['Strength Sap', 'Air Slash', 'Fire Blast'],
		signatureMove: 'Meteor Beam',
		evs: { def: 4, spa: 252, spe: 252 }, nature: 'Modest', teraType: 'Normal', level: 86,
	},
	Tentazor: {
		species: 'Tentazor', ability: 'Hydrotechnic', item: 'Leftovers', gender: '',
		moves: ['Flip Turn', 'Bullet Punch', 'Knock Off'],
		signatureMove: 'Rapid Spin',
		evs: { hp: 252, atk: 4, spd: 252 }, nature: 'Careful', teraType: 'Water', level: 87,
	},
	'Tentazor-Mega': {
		species: 'Tentazor', ability: 'Hydrotechnic', item: 'Scizorite', gender: '',
		moves: ['Swords Dance', 'Bullet Punch', 'Close Combat'],
		signatureMove: 'Liquidation',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Adamant', teraType: 'Water', level: 86, skip: 'Tentazor',
	},
	'Golegon-Alola': {
		species: 'Golegon-Alola', ability: 'Magnetize', item: 'Choice Band', gender: '',
		moves: ['Double-Edge', 'U-turn', 'Earthquake'],
		signatureMove: 'Explosion',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Adamant', teraType: 'Water', level: 89,
	},
	'Maractorus-Therian': {
		species: 'Maractorus-Therian', ability: 'Daunting Storm', item: 'Leftovers', gender: 'M',
		moves: ['Giga Drain', 'U-turn', ['Spikes', 'Synthesis']],
		signatureMove: 'Sandsear Storm',
		evs: { hp: 252, atk: 4, def: 252 }, nature: 'Bold', teraType: 'Water', level: 87,
	},
	Necroqueen: {
		species: 'Necroqueen', ability: 'Shear Strength', item: 'Black Sludge', gender: 'F',
		moves: [['Sludge Bomb', 'Earth Power', 'Fire Blast'], ['Morning Sun', 'Moonlight'], 'Calm Mind'],
		signatureMove: 'Photon Geyser',
		evs: { hp: 252, def: 252, spa: 4 }, nature: 'Bold', teraType: 'Water', level: 88,
	},
	'Mr. Heat': {
		species: 'Mr. Heat', ability: 'Suppressive Fire', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Stealth Rock', ['Psychic', 'Earth Power'], ['Teleport', 'Toxic']],
		signatureMove: 'Magma Storm',
		evs: { hp: 252, def: 4, spe: 252 }, nature: 'Timid', teraType: 'Normal', level: 87,
	},
	Aerodirge: {
		species: 'Aerodirge', ability: 'Prehistoric Presence', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Torch Song', 'Roost', 'Hurricane'],
		signatureMove: 'Earth Power',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Water', level: 85,
	},
	'Aerodirge-Mega': {
		species: 'Aerodirge', ability: 'Prehistoric Presence', item: 'Aerodactylite', gender: '',
		moves: ['Roost', 'Dragon Dance', 'Flare Blitz'],
		signatureMove: 'Dual Wingbeat',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 82, skip: 'Aerodirge',
	},
	'Hydra-Pao': {
		species: 'Hydra-Pao', ability: 'Sword of Rejuvenation', item: 'Heavy-Duty Boots', gender: 'N',
		moves: [['Outrage', 'Swords Dance'], 'Earthquake', 'Ice Shard'],
		signatureMove: 'Icicle Crash',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 85,
	},
	'Sir Bundle': {
		species: 'Sir Bundle', ability: 'Innovate', item: 'Booster Energy', gender: 'N',
		moves: [['Hydro Pump', 'Knock Off'], 'Close Combat', 'Ice Spinner'],
		signatureMove: 'Flip Turn',
		evs: { atk: 252, spa: 4, spe: 252 }, nature: 'Naive', teraType: 'Water', level: 87,
	},
	Buzzscor: {
		species: 'Buzzscor', ability: 'Best Boost', item: 'Leftovers', gender: 'N',
		moves: [['Spikes', 'Knock Off'], 'Roost', 'U-turn'],
		signatureMove: 'Earthquake',
		evs: { hp: 252, def: 252, spe: 4 }, nature: 'Impish', teraType: 'Water', level: 88,
	},
	Hattepon: {
		species: 'Hattepon', ability: 'Magic Mirror', item: 'Life Orb', gender: 'F',
		moves: [['Knock Off', 'Superpower'], 'U-turn', 'Play Rough'],
		signatureMove: 'Ivy Cudgel',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Grass', level: 87,
	},
	'Hattepon-Hearthflame': {
		species: 'Hattepon-Hearthflame', ability: 'Mold Breaker', item: 'Hearthflame Mask', gender: 'F',
		moves: ['Trick Room', 'Swords Dance', 'Play Rough'],
		signatureMove: 'Ivy Cudgel',
		evs: { hp: 252, atk: 252, spd: 4 }, ivs: { spe: 0 }, nature: 'Brave', teraType: 'Fire', level: 87, skip: 'Hattepon',
	},
	'Hattepon-Wellspring': {
		species: 'Hattepon-Wellspring', ability: 'Water Absorb', item: 'Wellspring Mask', gender: 'F',
		moves: [['Play Rough', 'Knock Off'], 'U-turn', ['Synthesis', 'Nuzzle', 'Spikes']],
		signatureMove: 'Ivy Cudgel',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 87, skip: 'Hattepon',
	},
	'Hattepon-Cornerstone': {
		species: 'Hattepon-Cornerstone', ability: 'Sturdy', item: 'Cornerstone Mask', gender: 'F',
		moves: ['Trick Room', 'Stomping Tantrum', 'Play Rough'],
		signatureMove: 'Ivy Cudgel',
		evs: { hp: 252, atk: 252, spd: 4 }, ivs: { spe: 0 }, nature: 'Brave', teraType: 'Rock', level: 87, skip: 'Hattepon',
	},
	'Kilommo-o-Totem': {
		species: 'Kilommo-o-Totem', ability: 'Rogue', item: 'Choice Specs', gender: '',
		moves: ['Thunderbolt', 'U-turn', 'Flamethrower'],
		signatureMove: 'Clanging Scales',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Grass', level: 85,
	},
	Lunarunt: {
		species: 'Lunarunt', ability: 'Unidentified Flying Object', item: 'Colbur Berry', gender: 'N',
		moves: [['Stealth Rock', 'Parting Shot'], 'Recover', 'Hex'],
		signatureMove: 'Malignant Chain',
		evs: { hp: 252, def: 228, spe: 28 }, nature: 'Timid', teraType: 'Poison', level: 87,
	},
	'Zoroshark-Hisui': {
		species: 'Zoroshark-Hisui', ability: 'Afterimage', item: 'Life Orb', gender: '',
		moves: ['Crunch', 'U-turn', ['Psychic Fangs', 'Close Combat']],
		signatureMove: 'Poltergeist',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 85,
	},
	'Zoroshark-Hisui-Mega': {
		species: 'Zoroshark-Hisui', ability: 'Afterimage', item: 'Sharpedonite', gender: '',
		moves: ['Crunch', 'Swords Dance', 'Close Combat'],
		signatureMove: 'Poltergeist',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 82, skip: 'Zoroshark-Hisui',
	},
	Bombirdus: {
		species: 'Bombirdus', ability: 'Prank Rock', item: 'Mirror Herb', gender: 'M',
		moves: ['Acrobatics', 'Knock Off', 'Stone Edge'],
		signatureMove: 'Swagger',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 87,
	},
	Scoliraptor: {
		species: 'Scoliraptor', ability: 'Toxic Attitude', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Brave Bird', 'Spikes', ['U-turn', 'Roost']],
		signatureMove: 'Poison Jab',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 88,
	},
	Zarubok: {
		species: 'Zarubok', ability: 'Forest Fury', item: 'Leftovers', gender: '',
		moves: ['Bulk Up', 'Knock Off', 'Gunk Shot'],
		signatureMove: 'Jungle Healing',
		evs: { hp: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 86,
	},
	'Iron Pins': {
		species: 'Iron Pins', ability: 'Quark Surge', item: 'Life Orb', gender: 'N',
		moves: ['Zing Zap', 'Close Combat', 'Liquidation'],
		signatureMove: 'Psyblade',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 82,
	},
	'Bronze Bonnet': {
		species: 'Bronze Bonnet', ability: 'Weight of Life', item: 'Booster Energy', gender: 'N',
		moves: [['Stealth Rock', 'Sucker Punch', 'Trick Room'], 'Crunch', 'Synthesis'],
		signatureMove: 'Heavy Slam',
		evs: { hp: 252, atk: 252, spd: 4 }, nature: 'Adamant', teraType: 'Water', level: 85,
	},
	Zoinkazenta: {
		species: 'Zoinkazenta', ability: 'Pillage', item: 'Choice Band', gender: 'M',
		moves: ['Close Combat', 'Double-Edge', ['High Horsepower', 'Wild Charge', 'Quick Attack']],
		signatureMove: 'Crunch',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 85,
	},
	Decidulax: {
		species: 'Decidulax', ability: 'Fat Fingers', item: 'Leftovers', gender: '',
		moves: ['Body Slam', 'Roost', ['Defog', 'U-turn']],
		signatureMove: 'Spirit Shackle',
		evs: { hp: 252, def: 252, spd: 4 }, nature: 'Impish', teraType: 'Water', level: 87,
	},
	Okiferro: {
		species: 'Okiferro', ability: 'Barbed Chain', item: 'Leftovers', gender: 'M',
		moves: ['Power Whip', 'Knock Off', ['Swords Dance', 'Spikes']],
		signatureMove: 'Drain Punch',
		evs: { hp: 252, atk: 252, spd: 4 }, nature: 'Adamant', teraType: 'Water', level: 74,
	},
	Dragocoal: {
		species: 'Dragocoal', ability: 'Steamy Scales', item: 'Heavy-Duty Boots', gender: '',
		moves: [['Stealth Rock', 'Spikes'], ['Dragon Tail', 'Will-O-Wisp', 'Rapid Spin'], 'Roost'],
		signatureMove: 'Heat Crash',
		evs: { hp: 252, def: 252, spe: 4 }, nature: 'Impish', teraType: 'Water', level: 75,
	},
	'Empoliary-Hisui': {
		species: 'Empoliary-Hisui', ability: 'Sharp Goggles', item: 'Leftovers', gender: '',
		moves: ['Calm Mind', 'Roost', 'Surf'],
		signatureMove: 'Esper Wing',
		evs: { hp: 252, def: 252, spe: 4 }, nature: 'Bold', teraType: 'Water', level: 87,
	},
	Farinape: {
		species: 'Farinape', ability: 'Fired Up', item: 'Leftovers', gender: '',
		moves: ['Nasty Plot', 'Hyper Voice', 'Fire Blast'],
		signatureMove: 'Vacuum Wave',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Modest', teraType: 'Water', level: 87,
	},
	'Wo-Rupt': {
		species: 'Wo-Rupt', ability: 'Stones of Ruin', item: 'Leftovers', gender: 'N',
		moves: ['Stealth Rock', 'Earth Power', ['Will-O-Wisp', 'Leech Seed']],
		signatureMove: 'Ruination',
		evs: { hp: 252, def: 252, spd: 4 }, nature: 'Bold', teraType: 'Water', level: 86,
	},
	'Wo-Rupt-Mega': {
		species: 'Wo-Rupt', ability: 'Stones of Ruin', item: 'Cameruptite', gender: 'N',
		moves: ['Earth Power', 'Fire Blast', 'Energy Ball'],
		signatureMove: 'Dark Pulse',
		evs: { hp: 252, spa: 252, spe: 4 }, nature: 'Modest', teraType: 'Water', level: 85, skip: 'Wo-Rupt',
	},
	Aromalge: {
		species: 'Aromalge', ability: 'Unstoppable', item: 'Black Sludge', gender: '',
		moves: ['Protect', 'Sludge Bomb', 'Moonblast'],
		signatureMove: 'Wish',
		evs: { hp: 252, def: 252, spa: 4 }, nature: 'Bold', teraType: 'Water', level: 86,
	},
	Crawnacl: {
		species: 'Crawnacl', ability: 'Salted Lobster', item: 'Leftovers', gender: '',
		moves: ['Dragon Dance', 'Recover', ['Earthquake', 'Stone Edge']],
		signatureMove: 'Crabhammer',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Adamant', teraType: 'Water', level: 84,
	},
	Corvizolt: {
		species: 'Corvizolt', ability: 'Piezoelectric', item: 'Magnet', gender: 'N',
		moves: ['Agility', 'Drill Peck', ['Roost', 'Bulk Up']],
		signatureMove: 'Bolt Beak',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Adamant', teraType: 'Water', level: 85,
	},
	'Tapu Sala': {
		species: 'Tapu Sala', ability: 'Miasma', item: 'Black Sludge', gender: 'F',
		moves: ['Surf', 'Sludge Bomb', ['Protect', 'Flamethrower']],
		signatureMove: 'Calm Mind',
		evs: { hp: 252, def: 4, spe: 252 }, nature: 'Timid', teraType: 'Water', level: 88,
	},
	Jirabsca: {
		species: 'Jirabsca', ability: 'Serene Sync', item: 'Leftovers', gender: 'N',
		moves: ['U-turn', 'Recover', ['Stealth Rock', 'Thunder Wave']],
		signatureMove: 'Doom Desire',
		evs: { hp: 252, def: 4, spd: 252 }, nature: 'Careful', teraType: 'Water', level: 87,
	},
	'Donphurott-Hisui': {
		species: 'Donphurott-Hisui', ability: 'Sand Sword', item: 'Assault Vest', gender: '',
		moves: ['Ceaseless Edge', 'Earthquake', 'Flip Turn'],
		signatureMove: 'Rapid Spin',
		evs: { hp: 252, atk: 252, spe: 4 }, nature: 'Adamant', teraType: 'Water', level: 85,
	},
	Regithorn: {
		species: 'Regithorn', ability: 'Electric Fence', item: 'Leftovers', gender: 'N',
		moves: ['Volt Switch', 'Power Whip', ['Spikes', 'Rapid Spin']],
		signatureMove: 'Knock Off',
		evs: { hp: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 87,
	},
	Lanpass: {
		species: 'Lanpass', ability: 'Sturdy Shock', item: 'Assault Vest', gender: '',
		moves: ['Volt Switch', ['Scald', 'Ice Beam'], ['Earth Power', 'Flash Cannon']],
		signatureMove: 'Discharge',
		evs: { hp: 252, def: 4, spa: 252 }, nature: 'Modest', teraType: 'Water', level: 88,
	},
	Swoltres: {
		species: 'Swoltres', ability: 'Molten Glue', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Roost', 'Sludge Bomb', ['Will-O-Wisp', 'U-turn', 'Toxic Spikes']],
		signatureMove: 'Flamethrower',
		evs: { hp: 252, def: 252, spa: 4 }, nature: 'Bold', teraType: 'Water', level: 90,
	},
	'Appleking-Galar': {
		species: 'Appleking-Galar', ability: 'Healthy Diet', item: 'Assault Vest', gender: '',
		moves: ['Flamethrower', 'Sludge Bomb', ['Scald', 'Dragon Tail']],
		signatureMove: 'Apple Acid',
		evs: { hp: 252, def: 4, spa: 252 }, nature: 'Modest', teraType: 'Water', level: 90,
	},
	Orthaconda: {
		species: 'Orthaconda', ability: 'Sandworm', item: 'Leftovers', gender: '',
		moves: ['Stealth Rock', 'Earthquake', 'Glare'],
		signatureMove: 'Heavy Slam',
		evs: { hp: 252, def: 252, spa: 4 }, nature: 'Impish', teraType: 'Water', level: 90,
	},
	'Giracham-Origin': {
		species: 'Giracham-Origin', ability: 'Anointed', item: 'Leftovers', gender: 'N',
		moves: [['Draco Meteor', 'Aura Sphere'], 'Recover', 'Psychic'],
		signatureMove: 'Calm Mind',
		evs: { hp: 252, def: 252, spd: 4 }, nature: 'Bold', teraType: 'Water', level: 87,
	},
	'Giracham-Origin-Mega': {
		species: 'Giracham-Origin', ability: 'Anointed', item: 'Medichamite', gender: 'N',
		moves: [['Close Combat', 'Earthquake'], ['Recover', 'Fake Out'], 'Dragon Claw'],
		signatureMove: 'Zen Headbutt',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Adamant', teraType: 'Water', level: 70, skip: 'Giracham-Origin',
	},
	Eldetini: {
		species: 'Eldetini', ability: 'Hope Star', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Bolt Strike', 'Seed Bomb', 'U-turn'],
		signatureMove: 'V-Create',
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 88,
	},
	'Tinkophlosion-Hisui': {
		species: 'Tinkophlosion-Hisui', ability: 'Frisk Taker', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Calm Mind', 'Draining Kiss', 'Lava Plume'],
		signatureMove: 'Infernal Parade',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Water', level: 89,
	},
	Glimmocruel: {
		species: 'Glimmocruel', ability: 'Delayed Reaction', item: 'Power Herb', gender: '',
		moves: ['Meteor Beam', 'Earth Power', 'Sludge Wave'],
		signatureMove: 'Power Gem',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Water', level: 91,
	},
	'Diafetch\'d': {
		species: 'Diafetch\'d', ability: 'A Quack in Time', item: 'Leftovers', gender: 'N',
		moves: [['Knock Off', 'Earthquake'], 'Roost', ['Defog', 'Swords Dance', 'U-turn']],
		signatureMove: 'Brave Bird',
		evs: { hp: 252, spd: 252, spe: 4 }, nature: 'Careful', teraType: 'Water', level: 89,
	},
	Rhytrix: {
		species: 'Rhytrix', ability: 'Reachless', item: 'Eviolite', gender: '',
		moves: ['Earthquake', 'Brave Bird', ['U-turn', 'Stealth Rock']],
		signatureMove: 'Roost',
		evs: { hp: 252, def: 252, spd: 4 }, nature: 'Impish', teraType: 'Water', level: 88,
	},
	Varantis: {
		species: 'Varantis', ability: 'Quickstart', item: 'Choice Band', gender: '',
		moves: ['Leaf Blade', 'Superpower', ['Iron Head', 'Gunk Shot']],
		signatureMove: 'Parting Shot',
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water', level: 84,
	},
	'Fishkarp-Hisui': {
		species: 'Fishkarp-Hisui', ability: 'Fishy Threat', item: 'Eviolite', gender: '',
		moves: ['Spikes', 'Crunch', ['Taunt', 'Toxic Spikes']],
		signatureMove: 'Destiny Bond',
		evs: { hp: 252, def: 252, spe: 4 }, nature: 'Impish', teraType: 'Water',
	},
};

export class RandomFERBTeams extends RandomTeams {
	randomFERBTeam(options: { inBattle?: boolean } = {}) {
		this.enforceNoDirectCustomBanlistChanges();

		const team: PokemonSet[] = [];
		const debug: string[] = []; // Set this to a list of CPM sets to override the normal pool for debugging.
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const monotype = this.forceMonotype || (ruleTable.has('sametypeclause') ?
			this.sample(this.dex.types.names().filter(x => x !== 'Stellar')) : false);

		let pool = Object.keys(ferbSets);
		if (debug.length) {
			while (debug.length < 6) {
				const fakemon = this.sampleNoReplace(pool);
				if (debug.includes(fakemon) || ferbSets[fakemon].skip) continue;
				debug.push(fakemon);
			}
			pool = debug;
		}
		if (monotype && !debug.length) {
			pool = pool.filter(x => this.dex.species.get(ferbSets[x].species).types.includes(monotype));
		}
		if (global.Config?.disabledssbsets?.length) {
			pool = pool.filter(x => !global.Config.disabledssbsets.includes(this.dex.toID(x)));
		}
		const typePool: { [k: string]: number } = {};
		let depth = 0;
		while (pool.length && team.length < this.maxTeamSize) {
			if (depth >= 200) throw new Error(`Infinite loop in CPM team generation.`);
			depth++;
			const name = this.sampleNoReplace(pool);
			const ferbSet: FERBSet = this.dex.deepClone(ferbSets[name]);
			if (ferbSet.skip) continue;

			// Enforce typing limits
			if (!(debug.length || monotype)) { // Type limits are ignored for debugging and monotype
				const species = this.dex.species.get(ferbSet.species);

				const weaknesses = [];
				for (const type of this.dex.types.names()) {
					const typeMod = this.dex.getEffectiveness(type, species.types);
					if (typeMod > 0) weaknesses.push(type);
				}
				let rejected = false;
				for (const type of weaknesses) {
					if (typePool[type] === undefined) typePool[type] = 0;
					if (typePool[type] >= 3) {
						// Reject
						rejected = true;
						break;
					}
				}
				if (ferbSet.ability === 'Wonder Guard') {
					if (!typePool['wonderguard']) {
						typePool['wonderguard'] = 1;
					} else {
						rejected = true;
					}
				}
				if (rejected) continue;
				// Update type counts
				for (const type of weaknesses) {
					typePool[type]++;
				}
			}

			let teraType: string | undefined;
			if (ferbSet.teraType) {
				teraType = ferbSet.teraType === 'Any' ?
					this.sample(this.dex.types.names()) :
					this.sampleIfArray(ferbSet.teraType);
			}
			const moves: string[] = [];
			while (moves.length < 3 && ferbSet.moves.length > 0) {
				let move = this.sampleNoReplace(ferbSet.moves);
				if (Array.isArray(move)) move = this.sampleNoReplace(move);
				moves.push(this.dex.moves.get(move).name);
			}
			moves.push(this.dex.moves.get(ferbSet.signatureMove).name);
			const ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...ferbSet.ivs };

			if (!moves.map(x => this.dex.moves.get(x)).some(x => x.category === 'Physical')) {
				ivs.atk = 0;
			}

			const set: PokemonSet = {
				name,
				species: ferbSet.species,
				item: this.sampleIfArray(ferbSet.item),
				ability: this.sampleIfArray(ferbSet.ability),
				moves,
				nature: ferbSet.nature ? Array.isArray(ferbSet.nature) ? this.sampleNoReplace(ferbSet.nature) : ferbSet.nature : 'Lax',
				gender: ferbSet.gender ? this.sampleIfArray(ferbSet.gender) : this.sample(['M', 'F', 'N']),
				evs: ferbSet.evs ? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...ferbSet.evs } :

				{ hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84 },
				ivs,
				level: this.adjustLevel || ferbSet.level || 100,
				happiness: typeof ferbSet.happiness === 'number' ? ferbSet.happiness : 255,
				shiny: typeof ferbSet.shiny === 'number' ? this.randomChance(1, ferbSet.shiny) : !!ferbSet.shiny,
			};

			if (teraType) set.teraType = teraType;

			team.push(set);

			if (team.length === this.maxTeamSize && (set.ability === 'Illusion')) {
				team[this.maxTeamSize - 1] = team[this.maxTeamSize - 2];
				team[this.maxTeamSize - 2] = set;
			}
		}
		return team;
	}
}

export default RandomFERBTeams;
