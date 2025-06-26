import RandomTeams from '../../random-battles/gen9/teams';

export interface VPNSet {
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
interface VPNSets { [k: string]: VPNSet }

export const vpnSets: VPNSets = {
	Venusaur: {
		species: 'Venusaur', ability: 'Chlorophyll', item: 'Life Orb', gender: '',
		moves: ['Energy Ball', 'Sludge Bomb', 'Weather Ball'],
		signatureMove: 'Sunny Day',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Modest', teraType: 'Stellar', level: 84,
	},
	'Charizard Y': {
		species: 'Charizard', ability: 'Blaze', item: 'Charizardite Shard Y', gender: '',
		moves: [['Flamethrower', 'Overheat'], 'Wind Breaker', ['Rekindle', 'Focus Blast']],
		signatureMove: 'Solar Beam',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Fire', level: 84,
	},
	'Charizard X': {
		species: 'Charizard', ability: 'Blaze', item: 'Charizardite Shard X', gender: '',
		moves: ['Flare Blitz', ['Earthquake', 'Brick Break', 'Thunder Punch'], ['Dragon Dance', 'Swords Dance']],
		signatureMove: 'Outrage',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Dragon', level: 84,
	},
	Blastoise: {
		species: 'Blastoise', ability: 'Steely Spirit', item: 'White Herb', gender: '',
		moves: ['Snipe Shot', 'Ice Beam', 'Flash Cannon'],
		signatureMove: 'Shell Smash',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Modest', teraType: 'Stellar', level: 81,
	},
	Arbok: {
		species: 'Arbok', ability: 'Intimidate', item: 'Black Sludge', gender: '',
		moves: ['Gunk Shot', 'Earthquake', 'Knock Off'],
		signatureMove: 'Latent Venom',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 87,
	},
	Pikachu: {
		species: 'Pikachu', ability: 'Lightning Rod', item: 'Light Ball', gender: '',
		moves: ['Surf', 'Volt Switch', ['Play Rough', 'Fake Out', 'Knock Off']],
		signatureMove: 'Volt Tackle',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Hasty', teraType: 'Stellar', level: 93,
	},
	Raichu: {
		species: 'Raichu', ability: 'Lightning Rod', item: 'Life Orb', gender: '',
		moves: ['Surf', 'Thunderbolt', ['Nasty Plot', 'Volt Switch', 'Focus Blast']],
		signatureMove: 'Signal Beam',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 88,
	},
	'Raichu-Alola': {
		species: 'Raichu-Alola', ability: 'Surge Surfer', item: ['Life Orb', 'Choice Specs'], gender: '',
		moves: ['Psycho Boost', 'Volt Switch', ['Surf', 'Alluring Voice', 'Focus Blast']],
		signatureMove: 'Thunderbolt',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 87,
	},
	Sandslash: {
		species: 'Sandslash', ability: 'Momentum', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Rapid Spin', 'Rollout', ['Knock Off', 'Swords Dance', 'Spikes']],
		signatureMove: 'Earthquake',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Impish', teraType: 'Stellar', level: 88,
	},
	'Sandslash-Alola': {
		species: 'Sandslash-Alola', ability: 'Steely Spirit', item: 'Loaded Dice', gender: '',
		moves: [['Rapid Spin', 'Earthquake'], 'Swords Dance', 'Icicle Spear'],
		signatureMove: 'Shrapnel Shot',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 88,
	},
	Clefable: {
		species: 'Clefable', ability: ['Magic Guard', 'Unaware'], item: 'Leftovers', gender: '',
		moves: ['Moonlight', ['Thunder Wave', 'Stealth Rock'], ['Knock Off', 'Flamethrower', 'Snatch']],
		signatureMove: 'Moonblast',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Bold', teraType: 'Stellar', level: 83,
	},
	Ninetales: {
		species: 'Ninetales', ability: 'Drought', item: 'Heat Rock', gender: '',
		moves: ['Fire Blast', 'Solar Beam', 'Scorching Sands'],
		signatureMove: 'Nasty Plot',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 85,
	},
	'Ninetales-Alola': {
		species: 'Ninetales-Alola', ability: 'Snow Warning', item: 'Icy Rock', gender: '',
		moves: ['Aurora Veil', 'Blizzard', 'Moonblast'],
		signatureMove: 'Nasty Plot',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 85,
	},
	Wigglytuff: {
		species: 'Wigglytuff', ability: 'Wind Rider', item: 'Tuffy-Tuff', gender: '',
		moves: ['Tidy Up', ['Peekaboo', 'Spirit Break'], 'Knock Off'],
		signatureMove: 'Rage',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 96,
	},
	Vileplume: {
		species: 'Vileplume', ability: 'Seed Sower', item: 'Black Sludge', gender: '',
		moves: ['Giga Drain', 'Sludge Bomb', 'Strength Sap'],
		signatureMove: 'Latent Venom',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Bold', teraType: 'Stellar', level: 87,
	},
	Venomoth: {
		species: 'Venomoth', ability: 'Tinted Lens', item: 'Black Sludge', gender: '',
		moves: ['Quiver Dance', 'Sludge Wave', ['Morning Sun', 'Substitute']],
		signatureMove: 'Software Crash',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 85,
	},
	Dugtrio: {
		species: 'Dugtrio', ability: 'Arena Trap', item: 'Focus Sash', gender: '',
		moves: ['Stone Edge', 'Earthquake', ['Stealth Rock', 'Swords Dance']],
		signatureMove: 'Sucker Punch',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 83,
	},
	Persian: {
		species: 'Persian', ability: 'Green-Eyed', item: 'Choice Band', gender: '',
		moves: ['Double-Edge', 'Knock Off', ['U-turn', 'Gunk Shot']],
		signatureMove: 'Switcheroo',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 93,
	},
	'Persian-Alola': {
		species: 'Persian-Alola', ability: 'Fur Coat', item: 'Leftovers', gender: '',
		moves: ['Foul Play', 'Parting Shot', 'Thunder Wave'],
		signatureMove: 'Snatch',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 86,
	},
	Golduck: {
		species: 'Golduck', ability: 'Mud Wash', item: 'Life Orb', gender: '',
		moves: ['Mud Shot', 'Ice Beam', ['Nasty Plot', 'Flip Turn']],
		signatureMove: 'Muddy Water',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Modest', teraType: 'Stellar', level: 88,
	},
	Annihilape: {
		species: 'Annihilape', ability: 'Defiant', item: 'Chesto Berry', gender: '',
		moves: ['Bulk Up', 'Rest', 'Drain Punch'],
		signatureMove: 'Rage Fist',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 76,
	},
	Arcanine: {
		species: 'Arcanine', ability: 'Intimidate', item: 'Leftovers', gender: '',
		moves: ['Curse', 'Extreme Speed', 'Rekindle'],
		signatureMove: 'Raging Fury',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Careful', teraType: 'Stellar', level: 84,
	},
	'Arcanine-Hisui': {
		species: 'Arcanine-Hisui', ability: 'Rock Head', item: 'Protective Pads', gender: '',
		moves: ['Head Smash', ['Extreme Speed', 'Accelerock'], ['Close Combat', 'Wild Charge']],
		signatureMove: 'Flare Blitz',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 82,
	},
	Poliwrath: {
		species: 'Poliwrath', ability: 'Water Absorb', item: 'Leftovers', gender: '',
		moves: ['Drain Punch', 'Liquidation', 'Bulk Up'],
		signatureMove: 'Life Dew',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Careful', teraType: 'Stellar', level: 88,
	},
	Victreebel: {
		species: 'Victreebel', ability: 'Seed Sower', item: 'Black Sludge', gender: '',
		moves: ['Swords Dance', 'Poison Jab', ['Knock Off', 'Sucker Punch']],
		signatureMove: 'Root Pull',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 90,
	},
	Tentacruel: {
		species: 'Tentacruel', ability: 'Water Veil', item: 'Black Sludge', gender: '',
		moves: ['Flip Turn', 'Surf', ['Knock Off', 'Life Dew', 'Rapid Spin']],
		signatureMove: 'Sludge Bomb',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 85,
	},
	Golem: {
		species: 'Golem', ability: 'Blunt Force', item: 'Choice Band', gender: '',
		moves: ['Accelerock', 'Earthquake', 'Stone Edge'],
		signatureMove: 'Explosion',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 87,
	},
	'Golem-Alola': {
		species: 'Golem-Alola', ability: 'Galvanize', item: 'Loaded Dice', gender: '',
		moves: ['Double-Edge', ['Earthquake', 'Rollout'], 'Rock Blast'],
		signatureMove: 'Chain Lightning',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 92,
	},
	Slowbro: {
		species: 'Slowbro', ability: 'Regenerator', item: 'Leftovers', gender: '',
		moves: ['Scald', 'Slack Off', ['Thunder Wave', 'Calm Mind']],
		signatureMove: 'Psychic Noise',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Bold', teraType: 'Stellar', level: 84,
	},
	'Slowbro-Galar': {
		species: 'Slowbro-Galar', ability: 'Regenerator', item: 'Black Sludge', gender: '',
		moves: ['Shell Side Arm', 'Psychic', ['Nasty Plot', 'Calm Mind', 'Fire Blast']],
		signatureMove: 'Trick Room',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85 }, nature: 'Quiet', teraType: 'Stellar', level: 87,
	},
	Dodrio: {
		species: 'Dodrio', ability: 'Muscle Memory', item: ['Choice Band', 'Metronome'], gender: '',
		moves: ['Double-Edge', 'Flying Press', 'Chisel'],
		signatureMove: 'Brave Bird',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 85,
	},
	Dewgong: {
		species: 'Dewgong', ability: 'Water Veil', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Flip Turn', 'Life Dew', ['Knock Off', 'Wash Away', 'Hydro Pump']],
		signatureMove: 'Frost Breath',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Sassy', teraType: 'Stellar', level: 91,
	},
	Muk: {
		species: 'Muk', ability: 'Regenerator', item: 'Assault Vest', gender: '',
		moves: ['Gunk Shot', 'Flip Turn', ['Knock Off', 'Earthquake']],
		signatureMove: 'Wave Crash',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 85,
	},
	'Muk-Alola': {
		species: 'Muk-Alola', ability: 'Neutralizing Gas', item: 'Black Sludge', gender: '',
		moves: ['Gunk Shot', 'Recover', ['Curse', 'Stealth Rock']],
		signatureMove: 'Knock Off',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Careful', teraType: 'Stellar', level: 82,
	},
	Cloyster: {
		species: 'Cloyster', ability: 'Overcoat', item: 'Leftovers', gender: '',
		moves: ['Surf', 'Life Dew', ['Spikes', 'Shelter']],
		signatureMove: 'Frost Breath',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Relaxed', teraType: 'Stellar', level: 85,
	},
	'Cloyster 2': {
		species: 'Cloyster', ability: 'Battle Spines', item: 'White Herb', gender: '',
		moves: ['Hydro Pump', 'Signal Beam', 'Frost Breath'],
		signatureMove: 'Shell Smash',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 80,
	},
	Haunter: {
		species: 'Haunter', ability: 'Death Aura', item: 'Eviolite', gender: '',
		moves: ['Shadow Ball', 'Sludge Bomb', 'Focus Blast'],
		signatureMove: 'Nasty Plot',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 90,
	},
	Gengar: {
		species: 'Gengar', ability: ['Neutralizing Gas', 'Levitate'], item: 'Black Sludge', gender: '',
		moves: [['Nasty Plot', 'Encore', 'Will-O-Wisp'], 'Sludge Wave', 'Focus Blast'],
		signatureMove: 'Shadow Ball',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 81,
	},
	Hypno: {
		species: 'Hypno', ability: 'Synchronize', item: 'Leftovers', gender: '',
		moves: ['Psychic Noise', 'Protect', ['Knock Off', 'Snatch']],
		signatureMove: 'Toxic',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Sassy', teraType: 'Stellar', level: 95,
	},
	Electrode: {
		species: 'Electrode', ability: ['Aftermath', 'Static'], item: 'Heavy-Duty Boots', gender: '',
		moves: ['Rollout', 'Volt Switch', ['Thunder Wave', 'Taunt', 'Foul Play']],
		signatureMove: 'Software Crash',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Modest', teraType: 'Stellar', level: 92,
	},
	'Electrode-Hisui': {
		species: 'Electrode-Hisui', ability: 'Seed Sower', item: 'Choice Specs', gender: '',
		moves: ['Thunderbolt', 'Volt Switch', 'Signal Beam'],
		signatureMove: 'Leaf Storm',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Modest', teraType: 'Stellar', level: 87,
	},
	Exeggutor: {
		species: 'Exeggutor', ability: 'Synchronize', item: 'Leftovers', gender: '',
		moves: ['Psychic Noise', ['Leech Seed', 'Moonlight'], 'Stun Spore'],
		signatureMove: 'Wood Hammer',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Relaxed', teraType: 'Stellar', level: 88,
	},
	'Exeggutor-Alola': {
		species: 'Exeggutor-Alola', ability: 'Seed Sower', item: ['Assault Vest', 'Choice Specs'], gender: '',
		moves: ['Giga Drain', 'Leaf Storm', 'Flamethrower'],
		signatureMove: 'Draco Meteor',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Modest', teraType: 'Stellar', level: 89,
	},
	Hitmonlee: {
		species: 'Hitmonlee', ability: 'Unburden', item: 'Maranga Berry', gender: '',
		moves: ['Close Combat', ['Chisel', 'Poison Jab'], 'Knock Off'],
		signatureMove: 'Swords Dance',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 84,
	},
	Hitmonchan: {
		species: 'Hitmonchan', ability: 'Iron Fist', item: 'Punching Glove', gender: '',
		moves: ['Drain Punch', ['Rage Fist', 'Ice Punch'], ['Mach Punch', 'Rapid Spin']],
		signatureMove: 'Swords Dance',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 87,
	},
	Weezing: {
		species: 'Weezing', ability: ['Neutralizing Gas', 'Levitate'], item: 'Black Sludge', gender: '',
		moves: ['Hazardous Waste', 'Flamethrower', 'Pain Split'],
		signatureMove: 'Toxic Spikes',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Relaxed', teraType: 'Stellar', level: 88,
	},
	'Weezing-Galar': {
		species: 'Weezing-Galar', ability: ['Neutralizing Gas', 'Levitate'], item: 'Black Sludge', gender: '',
		moves: ['Strange Steam', 'Flamethrower', 'Life Dew'],
		signatureMove: 'Will-O-Wisp',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Bold', teraType: 'Stellar', level: 86,
	},
	Rhydon: {
		species: 'Rhydon', ability: 'Overcoat', item: 'Eviolite', gender: '',
		moves: ['Chisel', 'Megahorn', ['Swords Dance', 'Stealth Rock']],
		signatureMove: 'Earthquake',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 86,
	},
	Scyther: {
		species: 'Scyther', ability: 'Steadfast', item: 'Mantis Claw', gender: '',
		moves: ['U-turn', 'Close Combat', ['Swords Dance', 'Knock Off', 'Defog']],
		signatureMove: 'Dual Wingbeat',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 82,
	},
	Tauros: {
		species: 'Tauros', ability: 'Blunt Force', item: 'Baseball Bat', gender: '',
		moves: ['Double-Edge', 'Throat Chop', 'Rage'],
		signatureMove: 'Trailblaze',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 84,
	},
	'Tauros-Paldea-Combat': {
		species: 'Tauros-Paldea-Combat', ability: 'Cud Chew', item: 'Salac Berry', gender: '',
		moves: ['Close Combat', ['Throat Chop', 'Iron Head', 'Stone Edge'], 'Earthquake'],
		signatureMove: 'Bulk Up',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 84,
	},
	'Tauros-Paldea-Blaze': {
		species: 'Tauros-Paldea-Blaze', ability: 'Cud Chew', item: 'Ganlon Berry', gender: '',
		moves: ['Body Press', 'Raging Fury', 'Rekindle'],
		signatureMove: 'Bulk Up',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Impish', teraType: 'Stellar', level: 81,
	},
	'Tauros-Paldea-Aqua': {
		species: 'Tauros-Paldea-Aqua', ability: 'Cud Chew', item: 'Figy Berry', gender: '',
		moves: ['Wave Crash', 'Close Combat', ['Earthquake', 'Stone Edge']],
		signatureMove: 'Aqua Jet',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 81,
	},
	Gyarados: {
		species: 'Gyarados', ability: ['Intimidate', 'Moxie'], item: 'Razor Fang', gender: '',
		moves: ['Dragon Dance', 'Psychic Fangs', 'Ice Fang'],
		signatureMove: 'Waterfall',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 81,
	},
	Lapras: {
		species: 'Lapras', ability: 'Overcoat', item: 'Leftovers', gender: '',
		moves: ['Freeze-Dry', 'Life Dew', 'Sparkling Aria'],
		signatureMove: 'Frost Breath',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Quiet', teraType: 'Stellar', level: 88,
	},
	Ditto: {
		species: 'Ditto', ability: 'Imposter', item: 'Choice Scarf', gender: '',
		moves: [''],
		signatureMove: 'Transform',
		evs: { hp: 252, def: 252, spd: 4 }, nature: 'Relaxed', teraType: 'Rock', level: 87,
	},
	Vaporeon: {
		species: 'Vaporeon', ability: 'Mud Wash', item: 'Leftovers', gender: '',
		moves: ['Muddy Water', ['Ice Beam', 'Flip Turn'], 'Protect'],
		signatureMove: 'Wish',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Quiet', teraType: 'Stellar', level: 85,
	},
	Jolteon: {
		species: 'Jolteon', ability: 'Battle Spines', item: ['Heavy-Duty Boots', 'Life Orb'], gender: '',
		moves: ['Thunderbolt', 'Signal Beam', 'Alluring Voice'],
		signatureMove: 'Volt Switch',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 84,
	},
	Flareon: {
		species: 'Flareon', ability: 'Fur Coat', item: 'Leftovers', gender: '',
		moves: ['Curse', 'Rekindle', 'Snatch'],
		signatureMove: 'Raging Fury',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Careful', teraType: 'Stellar', level: 88,
	},
	Snorlax: {
		species: 'Snorlax', ability: 'Comatose', item: 'Leftovers', gender: '',
		moves: ['Slack Off', ['Earthquake', 'Crunch'], ['Tidy Up', 'Rollout', 'Curse']],
		signatureMove: 'Rage',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 82,
	},
	'Snorlax 2': {
		species: 'Snorlax', ability: 'Comatose', item: 'Choice Band', gender: '',
		moves: ['Sleep Talk'],
		signatureMove: 'Last Resort',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 83,
	},
	Articuno: {
		species: 'Articuno', ability: 'Gale Wings', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Freeze-Dry', 'Roost', ['Defog', 'Haze']],
		signatureMove: 'Wind Breaker',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Modest', teraType: 'Stellar', level: 86,
	},
	'Articuno-Galar': {
		species: 'Articuno-Galar', ability: 'Competitive', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Hurricane', ['Calm Mind', 'U-turn'], ['Roost', 'Signal Beam']],
		signatureMove: 'Freezing Glare',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 83,
	},
	Zapdos: {
		species: 'Zapdos', ability: 'Static', item: 'Heavy-Duty Boots', gender: '',
		moves: [['Heat Wave', 'U-turn'], 'Discharge', 'Roost'],
		signatureMove: 'Hurricane',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Modest', teraType: 'Stellar', level: 78,
	},
	'Zapdos-Galar': {
		species: 'Zapdos-Galar', ability: 'Defiant', item: 'Baseball Bat', gender: '',
		moves: [['Bulk Up', 'U-turn', 'Chisel'], 'Brave Bird', 'Knock Off'],
		signatureMove: 'Close Combat',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 77,
	},
	Moltres: {
		species: 'Moltres', ability: 'Flame Body', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Fire Blast', 'Roost', ['U-turn', 'Will-O-Wisp', 'Scorching Sands']],
		signatureMove: 'Wind Breaker',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Bold', teraType: 'Stellar', level: 81,
	},
	'Moltres-Galar': {
		species: 'Moltres-Galar', ability: 'Berserk', item: 'Kee Berry', gender: '',
		moves: ['Agility', 'Fiery Wrath', 'Nasty Plot'],
		signatureMove: 'Wind Breaker',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Modest', teraType: 'Stellar', level: 80,
	},
	Dragonite: {
		species: 'Dragonite', ability: 'Multiscale', item: 'Tie-Dye Band', gender: '',
		moves: ['Extreme Speed', 'Earthquake', ['Roost', 'Ice Spinner', 'Fire Punch']],
		signatureMove: 'Dragon Dance',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Normal', level: 74,
	},
	Mewtwo: {
		species: 'Mewtwo', ability: 'Synchronize', item: 'Life Orb', gender: '',
		moves: [['Nasty Plot', 'Recover'], 'Dark Pulse', ['Fire Blast', 'Aura Sphere']],
		signatureMove: 'Psystrike',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Serious', teraType: 'Stellar', level: 72,
	},
	Mew: {
		species: 'Mew', ability: 'Synchronize', item: 'Life Orb', gender: '',
		moves: [['U-turn', 'Recover'], 'Flare Blitz', ['Close Combat', 'Brave Bird', 'Knock Off']],
		signatureMove: 'Psycho Boost',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Hasty', teraType: 'Stellar', level: 80,
	},
	Meganium: {
		species: 'Meganium', ability: 'Sheer Heart', item: 'Leftovers', gender: '',
		moves: ['Leaf Storm', 'Knock Off', 'Jungle Healing'],
		signatureMove: 'Healing Stones',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Modest', teraType: 'Stellar', level: 90,
	},
	Typhlosion: {
		species: 'Typhlosion', ability: 'Blaze', item: ['Choice Scarf', 'Heavy-Duty Boots'], gender: '',
		moves: ['Fire Blast', 'Focus Blast', 'Rollout'],
		signatureMove: 'Eruption',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Modest', teraType: 'Stellar', level: 84,
	},
	'Typhlosion-Hisui': {
		species: 'Typhlosion-Hisui', ability: 'Death Aura', item: ['Choice Scarf', 'Choice Specs'], gender: '',
		moves: ['Fire Blast', 'Shadow Ball', ['Rollout', 'Focus Blast']],
		signatureMove: 'Eruption',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Modest', teraType: 'Stellar', level: 83,
	},
	Feraligatr: {
		species: 'Feraligatr', ability: 'Sheer Force', item: 'Life Orb', gender: '',
		moves: ['Dragon Dance', 'Ice Punch', 'Liquidation'],
		signatureMove: 'Throat Chop',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 80,
	},
	Furret: {
		species: 'Furret', ability: 'Cute Charm', item: 'Baseball Bat', gender: '',
		moves: ['Double-Edge', 'Brick Break', 'Knock Off'],
		signatureMove: 'Tidy Up',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 93,
	},
	Noctowl: {
		species: 'Noctowl', ability: 'Tinted Lens', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Hyper Voice', 'Roost', ['Calm Mind', 'Psychic Noise']],
		signatureMove: 'Hurricane',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 94,
	},
	Ariados: {
		species: 'Ariados', ability: 'Battle Spines', item: 'Focus Sash', gender: '',
		moves: ['Hazardous Waste', 'Shadow Sneak', 'Electroweb'],
		signatureMove: 'Dire Claw',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 93,
	},
	Lanturn: {
		species: 'Lanturn', ability: ['Volt Absorb', 'Water Veil'], item: 'Assault Vest', gender: '',
		moves: ['Volt Switch', 'Software Crash', 'Scald'],
		signatureMove: 'Electroweb',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Modest', teraType: 'Stellar', level: 89,
	},
	Ampharos: {
		species: 'Ampharos', ability: 'Cud Chew', item: 'Aguav Berry', gender: '',
		moves: [['Thunderbolt', 'Electroweb'], 'Signal Beam', ['Dazzling Gleam', 'Focus Blast']],
		signatureMove: 'Volt Switch',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Modest', teraType: 'Stellar', level: 88,
	},
	Bellossom: {
		species: 'Feraligatr', ability: ['Seed Sower', 'Healer'], item: 'Leftovers', gender: '',
		moves: ['Strength Sap', ['Sludge Bomb', 'Moonblast'], ['Healing Stones', 'Quiver Dance']],
		signatureMove: 'Giga Drain',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Bold', teraType: 'Stellar', level: 86,
	},
	Azumarill: {
		species: 'Azumarill', ability: 'Huge Power', item: 'Assault Vest', gender: '',
		moves: [['Peekaboo', 'Play Rough'], ['Rollout', 'Knock Off'], 'Liquidation'],
		signatureMove: 'Aqua Jet',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 82,
	},
	Sudowoodo: {
		species: 'Sudowoodo', ability: 'Rock Head', item: 'Protective Pads', gender: '',
		moves: ['Wood Hammer', 'Rollout', ['Earthquake', 'Sucker Punch']],
		signatureMove: 'Head Smash',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 93,
	},
	Politoed: {
		species: 'Politoed', ability: 'Drizzle', item: 'Damp Rock', gender: '',
		moves: [['Hydro Pump', 'Wash Away'], ['Ice Beam', 'Earth Power'], ['Encore', 'Haze']],
		signatureMove: 'Life Dew',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 88,
	},
	Jumpluff: {
		species: 'Jumpluff', ability: 'Cloud Nine', item: 'Leftovers', gender: '',
		moves: ['Strength Sap', 'Leech Seed', 'Substitute'],
		signatureMove: 'Wind Breaker',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 87,
	},
	Sunflora: {
		species: 'Sunflora', ability: 'Steadfast', item: 'Leftovers', gender: '',
		moves: [['Leech Seed', 'Sludge Bomb'], 'Earth Power', 'Giga Drain'],
		signatureMove: 'Morning Sun',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Bold', teraType: 'Stellar', level: 92,
	},
	Quagsire: {
		species: 'Quagsire', ability: 'Unaware', item: 'Leftovers', gender: '',
		moves: ['Recover', ['Ice Beam', 'Liquidation'], ['Spikes', 'Toxic']],
		signatureMove: 'Earthquake',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Relaxed', teraType: 'Stellar', level: 84,
	},
	Clodsire: {
		species: 'Clodsire', ability: ['Water Absorb', 'Unaware'], item: 'Black Sludge', gender: '',
		moves: ['Recover', 'Poison Jab', ['Curse', 'Stealth Rock', 'Latent Venom']],
		signatureMove: 'Earthquake',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Careful', teraType: 'Stellar', level: 81,
	},
	Espeon: {
		species: 'Espeon', ability: 'Synchronize', item: 'Life Orb', gender: '',
		moves: [['Lumina Crash', 'Psycho Boost'], 'Shadow Ball', 'Round'],
		signatureMove: 'Alluring Voice',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 84,
	},
	Umbreon: {
		species: 'Umbreon', ability: 'Fairy Ringer', item: 'Leftovers', gender: '',
		moves: [['Foul Play', 'Knock Off'], ['Toxic', 'Round'], 'Wish'],
		signatureMove: 'Protect',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Careful', teraType: 'Stellar', level: 84,
	},
	Slowking: {
		species: 'Slowking', ability: 'Regenerator', item: 'Heavy-Duty Boots', gender: '',
		moves: [['Psychic Noise', 'Future Sight'], 'Slack Off', 'Scald'],
		signatureMove: 'Chilly Reception',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Bold', teraType: 'Stellar', level: 88,
	},
	'Slowking-Galar': {
		species: 'Slowking', ability: 'Regenerator', item: 'Black Sludge', gender: '',
		moves: [['Slack Off', 'Latent Venom'], 'Sludge Bomb', 'Psychic Noise'],
		signatureMove: 'Chilly Reception',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Bold', teraType: 'Stellar', level: 85,
	},
	Misdreavus: {
		species: 'Misdreavus', ability: 'Death Aura', item: 'Eviolite', gender: '',
		moves: ['Pain Split', 'Will-O-Wisp', 'Snatch'],
		signatureMove: 'Hex',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 94,
	},
	Girafarig: {
		species: 'Girafarig', ability: 'Counteract', item: 'Eviolite', gender: '',
		moves: ['Hyper Voice', ['Psyshock', 'Psychic Noise'], ['Thunderbolt', 'Dazzling Gleam']],
		signatureMove: 'Nasty Plot',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 89,
	},
	Forretress: {
		species: 'Forretress', ability: 'Exoskeleton', item: 'Leftovers', gender: '',
		moves: ['Iron Head', ['Rollout', 'Body Press'], ['Stealth Rock', 'Shelter']],
		signatureMove: 'Rebuild',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Impish', teraType: 'Stellar', level: 84,
	},
	Dunsparce: {
		species: 'Dunsparce', ability: 'Serene Grace', item: 'Eviolite', gender: '',
		moves: ['Roost', 'Earthquake', 'Coil'],
		signatureMove: 'Body Slam',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Careful', teraType: 'Stellar', level: 86,
	},
	Granbull: {
		species: 'Granbull', ability: 'Intimidate', item: 'Leftovers', gender: '',
		moves: ['Close Combat', 'Healing Stones', ['Round', 'Thunder Wave']],
		signatureMove: 'Play Rough',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 88,
	},
	Qwilfish: {
		species: 'Qwilfish', ability: 'Intimidate', item: 'Life Orb', gender: '',
		moves: ['Gunk Shot', 'Swords Dance', 'Liquidation'],
		signatureMove: 'Aqua Jet',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 86,
	},
	'Qwilfish-Hisui': {
		species: 'Qwilfish-Hisui', ability: 'Intimidate', item: 'Eviolite', gender: '',
		moves: ['Spikes', 'Crunch', 'Barb Barrage'],
		signatureMove: 'Latent Venom',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Impish', teraType: 'Stellar', level: 84,
	},
	Overqwil: {
		species: 'Overqwil', ability: 'Swift Swim', item: 'Life Orb', gender: '',
		moves: ['Crunch', 'Swords Dance', 'Liquidation'],
		signatureMove: 'Gunk Shot',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 82,
	},
	Scizor: {
		species: 'Scizor', ability: 'Technician', item: 'Mantis Claw', gender: '',
		moves: ['Close Combat', ['Knock Off', 'Defog', 'Swords Dance'], 'U-turn'],
		signatureMove: 'Bullet Punch',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 79,
	},
	'Scizor 2': {
		species: 'Scizor', ability: 'Technician', item: 'Loaded Dice', gender: '',
		moves: ['Close Combat', 'Swords Dance', 'Shrapnel Shot'],
		signatureMove: 'Bullet Punch',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 79,
	},
	Heracross: {
		species: 'Heracross', ability: 'Guts', item: 'Flame Orb', gender: '',
		moves: ['Trailblaze', 'Close Combat', 'Knock Off'],
		signatureMove: 'Facade',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 80,
	},
	Ursaring: {
		species: 'Ursaring', ability: 'Guts', item: 'Eviolite', gender: '',
		moves: ['Rest', 'Sleep Talk', ['Earthquake', 'Throat Chop']],
		signatureMove: 'Rage',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Impish', teraType: 'Stellar', level: 84,
	},
	Magcargo: {
		species: 'Magcargo', ability: 'Smelt', item: 'Leftovers', gender: '',
		moves: ['Power Gem', 'Recover', ['Stealth Rock', 'Shelter']],
		signatureMove: 'Lava Plume',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Impish', teraType: 'Stellar', level: 93,
	},
	Delibird: {
		species: 'Delibird', ability: 'Hustle', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Brick Break', 'Ice Spinner', 'Ice Shard'],
		signatureMove: 'Brave Bird',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar',
	},
	Skarmory: {
		species: 'Skarmory', ability: 'Steely Spirit', item: 'Leftovers', gender: '',
		moves: ['Iron Defense', 'Roost', ['Iron Head', 'Brave Bird']],
		signatureMove: 'Body Press',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Impish', teraType: 'Stellar', level: 80,
	},
	Houndoom: {
		species: 'Houndoom', ability: 'Death Aura', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Fire Blast', 'Ceaseless Edge', ['Sludge Bomb', 'Snatch']],
		signatureMove: 'Dark Pulse',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 86,
	},
	Kingdra: {
		species: 'Kingdra', ability: 'Sniper', item: 'Choice Specs', gender: '',
		moves: ['Draco Meteor', 'Flip Turn', ['Ice Beam', 'Hurricane', 'Signal Beam']],
		signatureMove: 'Snipe Shot',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 85,
	},
	Donphan: {
		species: 'Donphan', ability: ['Overcoat', 'Sand Spit'], item: 'Assault Vest', gender: '',
		moves: ['Earthquake', ['Ice Spinner', 'Rapid Spin'], 'Knock Off'],
		signatureMove: 'Rollout',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 84,
	},
	Porygon2: {
		species: 'Porygon2', ability: 'Download', item: 'Eviolite', gender: '',
		moves: ['Recover', 'Ice Beam', 'Discharge'],
		signatureMove: 'Tri Attack',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Modest', teraType: 'Stellar', level: 84,
	},
	Smeargle: {
		species: 'Smeargle', ability: 'Outclass', item: 'Focus Sash', gender: '',
		moves: ['Ceaseless Edge', 'Stone Axe', ['Burning Bulwark', 'Explosion']],
		signatureMove: 'Sticky Web',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 89,
	},
	Hitmontop: {
		species: 'Hitmontop', ability: 'Momentum', item: 'Assault Vest', gender: '',
		moves: ['Triple Axel', 'Rapid Spin', 'Rollout'],
		signatureMove: 'Storm Throw',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 89,
	},
	Chansey: {
		species: 'Chansey', ability: 'Natural Cure', item: 'Eviolite', gender: '',
		moves: ['Soft-Boiled', 'Thunder Wave', ['Stealth Rock', 'Heal Bell']],
		signatureMove: 'Seismic Toss',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Bold', teraType: 'Stellar', level: 85,
	},
	Blissey: {
		species: 'Blissey', ability: 'Natural Cure', item: 'Leftovers', gender: '',
		moves: ['Soft-Boiled', ['Thunder Wave', 'Round'], ['Stealth Rock', 'Heal Bell']],
		signatureMove: 'Seismic Toss',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Bold', teraType: 'Stellar', level: 84,
	},
	Raikou: {
		species: 'Raikou', ability: 'Outclass', item: 'Life Orb', gender: '',
		moves: ['Signal Beam', 'Scald', 'Thunderbolt'],
		signatureMove: 'Volt Switch',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 80,
	},
	Entei: {
		species: 'Entei', ability: 'Smelt', item: 'Choice Band', gender: '',
		moves: [['Flare Blitz', 'Stone Edge'], 'Stomping Tantrum', 'Sacred Fire'],
		signatureMove: 'Extreme Speed',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 79,
	},
	Suicune: {
		species: 'Suicune', ability: 'Pressure', item: 'Leftovers', gender: '',
		moves: ['Scald', 'Frost Breath', 'Protect'],
		signatureMove: 'Calm Mind',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Bold', teraType: 'Stellar', level: 82,
	},
	Tyranitar: {
		species: 'Tyranitar', ability: 'Sand Stream', item: ['Smooth Rock', 'Choice Band'], gender: '',
		moves: ['Earthquake', 'Knock Off', 'Accelerock'],
		signatureMove: 'Chisel',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 79,
	},
	Lugia: {
		species: 'Lugia', ability: 'Gale Wings', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Earth Power', 'Recover', 'Calm Mind'],
		signatureMove: 'Aeroblast',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Modest', teraType: 'Stellar', level: 74,
	},
	'Ho-Oh': {
		species: 'Ho-Oh', ability: 'Regenerator', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Earthquake', 'Brave Bird', 'Recover'],
		signatureMove: 'Sacred Fire',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 72,
	},
	Sceptile: {
		species: 'Sceptile', ability: 'Overgrow', item: 'Sitrus Berry', gender: '',
		moves: ['Leaf Storm', 'Chisel', ['Earthquake', 'Focus Blast']],
		signatureMove: 'Shed Tail',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Hasty', teraType: 'Stellar', level: 87,
	},
	Combusken: {
		species: 'Combusken', ability: 'Speed Boost', item: 'Eviolite', gender: '',
		moves: ['Flare Blitz', 'Close Combat', 'Swords Dance'],
		signatureMove: 'Protect',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 93,
	},
	Blaziken: {
		species: 'Blaziken', ability: 'Speed Boost', item: 'Baseball Bat', gender: '',
		moves: [['Knock Off', 'Chisel', 'Protect'], 'Close Combat', 'Swords Dance'],
		signatureMove: 'Flare Blitz',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 76,
	},
	Swampert: {
		species: 'Swampert', ability: 'Mud Wash', item: 'Leftovers', gender: '',
		moves: ['Earthquake', 'Stealth Rock', ['Rollout', 'Roar', 'Knock Off']],
		signatureMove: 'Muddy Water',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Relaxed', teraType: 'Stellar', level: 83,
	},
	Mightyena: {
		species: 'Mightyena', ability: 'Intimidate', item: 'Baseball Bat', gender: '',
		moves: ['Play Rough', ['Poison Fang', 'Taunt', 'Ceaseless Edge'], 'Sucker Punch'],
		signatureMove: 'False Surrender',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 95,
	},
	Ludicolo: {
		species: 'Ludicolo', ability: 'Swift Swim', item: 'Life Orb', gender: '',
		moves: ['Hydro Pump', 'Ice Beam', 'Giga Drain'],
		signatureMove: 'Rain Dance',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Modest', teraType: 'Stellar', level: 90,
	},
	Shiftry: {
		species: 'Shiftry', ability: 'Wind Rider', item: 'Life Orb', gender: '',
		moves: ['Root Pull', 'Storm Throw', 'False Surrender'],
		signatureMove: 'Tailwind',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 89,
	},
	Pelipper: {
		species: 'Pelipper', ability: 'Drizzle', item: 'Damp Rock', gender: '',
		moves: [['Surf', 'Knock Off', 'Wash Away'], 'Roost', 'U-turn'],
		signatureMove: 'Hurricane',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Bold', teraType: 'Stellar', level: 85,
	},
	Gardevoir: {
		species: 'Gardevoir', ability: 'Synchronize', item: 'Life Orb', gender: '',
		moves: ['Moonblast', ['Healing Stones', 'Calm Mind'], ['Mystical Fire', 'Focus Blast']],
		signatureMove: 'Psycho Boost',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 83,
	},
	Masquerain: {
		species: 'Masquerain', ability: 'Intimidate', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Hydro Pump', 'Quiver Dance', ['Bug Buzz', 'Electroweb']],
		signatureMove: 'Hurricane',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 87,
	},
	Breloom: {
		species: 'Breloom', ability: 'Technician', item: ['Life Orb', 'Loaded Dice'], gender: '',
		moves: ['Bullet Seed', 'Mach Punch', 'Swords Dance'],
		signatureMove: 'Chisel',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 82,
	},
	Vigoroth: {
		species: 'Vigoroth', ability: 'Vital Spirit', item: 'Eviolite', gender: '',
		moves: ['Knock Off', 'Slack Off', 'Bulk Up'],
		signatureMove: 'Rage',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 85,
	},
	Slaking: {
		species: 'Slaking', ability: 'Truant', item: 'Choice Band', gender: '',
		moves: ['Double-Edge', 'Giga Impact', 'Earthquake'],
		signatureMove: 'Knock Off',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 84,
	},
	Hariyama: {
		species: 'Hariyama', ability: ['Fair Fight', 'Guts'], item: 'Assault Vest', gender: '',
		moves: ['Lash Out', 'Headlong Rush', 'Bullet Punch'],
		signatureMove: 'Close Combat',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 87,
	},
	'Hariyama 2': {
		species: 'Hariyama', ability: 'Purifying Salt', item: 'Leftovers', gender: '',
		moves: ['Storm Throw', 'Slack Off', ['Knock Off', 'Court Change']],
		signatureMove: 'Salt Cure',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 87,
	},
	Sableye: {
		species: 'Sableye', ability: 'Prankster', item: 'Leftovers', gender: '',
		moves: [['Foul Play', 'Knock Off'], 'Recover', ['Thunder Wave', 'Will-O-Wisp']],
		signatureMove: 'Encore',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Impish', teraType: 'Stellar', level: 90,
	},
	Medicham: {
		species: 'Medicham', ability: 'Pure Power', item: 'Life Orb', gender: '',
		moves: ['Close Combat', 'Ice Punch', ['Bullet Punch', 'Zen Headbutt', 'Poison Jab']],
		signatureMove: 'Cutting Remark',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 86,
	},
	Plusle: {
		species: 'Plusle', ability: 'Lightning Rod', item: 'Life Orb', gender: '',
		moves: ['Software Crash', 'Nasty Plot', 'Alluring Voice'],
		signatureMove: 'Grass Knot',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 94,
	},
	Minun: {
		species: 'Minun', ability: 'Volt Absorb', item: 'Life Orb', gender: '',
		moves: ['Software Crash', 'Nasty Plot', 'Alluring Voice'],
		signatureMove: 'Grass Knot',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Timid', teraType: 'Stellar', level: 93,
	},
	Volbeat: {
		species: 'Volbeat', ability: 'Prankster', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Roost', 'Thunder Wave', ['U-turn', 'Lunge']],
		signatureMove: 'Encore',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Impish', teraType: 'Stellar', level: 90,
	},
	Illumise: {
		species: 'Illumise', ability: 'Prankster', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Roost', 'Thunder Wave', 'Bug Buzz'],
		signatureMove: 'Encore',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Calm', teraType: 'Stellar', level: 92,
	},
	Swalot: {
		species: 'Swalot', ability: 'Gluttony', item: 'Salac Berry', gender: '',
		moves: ['Earthquake', 'Gunk Shot', 'Knock Off'],
		signatureMove: 'Swords Dance',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 90,
	},
	Camerupt: {
		species: 'Camerupt', ability: 'Cud Chew', item: 'Aguav Berry', gender: '',
		moves: ['Fire Blast', 'Rollout', ['Stealth Rock', 'Will-O-Wisp']],
		signatureMove: 'Earthquake',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Sassy', teraType: 'Stellar', level: 90,
	},
	Torkoal: {
		species: 'Torkoal', ability: 'Drought', item: 'Heat Rock', gender: '',
		moves: ['Solar Beam', ['Body Press', 'Earthquake'], ['Stealth Rock', 'Shelter']],
		signatureMove: 'Lava Plume',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Relaxed', teraType: 'Stellar', level: 88,
	},
	Grumpig: {
		species: 'Grumpig', ability: 'Sheer Heart', item: 'Choice Specs', gender: '',
		moves: ['Focus Blast', 'Earth Power', ['Shadow Ball', 'Trick']],
		signatureMove: 'Psycho Boost',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Modest', teraType: 'Stellar', level: 91,
	},
	Flygon: {
		species: 'Flygon', ability: 'Levitate', item: 'Life Orb', gender: '',
		moves: ['Dragon Dance', ['Outrage', 'U-turn'], 'Chisel'],
		signatureMove: 'Earthquake',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 82,
	},
	Cacturne: {
		species: 'Cacturne', ability: 'Battle Spines', item: 'Focus Sash', gender: '',
		moves: ['Leaf Storm', ['Sucker Punch', 'Snatch'], 'Focus Blast'],
		signatureMove: 'Ceaseless Edge',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Mild', teraType: 'Stellar', level: 92,
	},
	Altaria: {
		species: 'Altaria', ability: 'Sheer Heart', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Fire Blast', 'Roost', 'Hurricane'],
		signatureMove: 'Draco Meteor',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Modest', teraType: 'Stellar', level: 88,
	},
	Zangoose: {
		species: 'Zangoose', ability: 'Toxic Boost', item: 'Toxic Orb', gender: '',
		moves: ['Close Combat', 'Knock Off', ['Quick Attack', 'Swords Dance']],
		signatureMove: 'Facade',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Jolly', teraType: 'Stellar', level: 86,
	},
	Seviper: {
		species: 'Seviper', ability: 'Green-Eyed', item: 'Black Sludge', gender: '',
		moves: ['Swords Dance', 'Earthquake', ['Trailblaze', 'Snatch']],
		signatureMove: 'Gunk Shot',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Adamant', teraType: 'Stellar', level: 93,
	},
	Whiscash: {
		species: 'Whiscash', ability: 'Mud Wash', item: 'Life Orb', gender: '',
		moves: ['DragonDance', 'Stone Edge', 'Liquidation'],
		signatureMove: 'Muddy Water',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 }, nature: 'Rash', teraType: 'Stellar', level: 88,
	},
};

export class RandomVPNTeams extends RandomTeams {
	randomVPNTeam(options: { inBattle?: boolean } = {}) {
		this.enforceNoDirectCustomBanlistChanges();

		const team: PokemonSet[] = [];
		const debug: string[] = []; // Set this to a list of CPM sets to override the normal pool for debugging.
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const monotype = this.forceMonotype || (ruleTable.has('sametypeclause') ?
			this.sample(this.dex.types.names().filter(x => x !== 'Stellar')) : false);

		let pool = Object.keys(vpnSets);
		if (debug.length) {
			while (debug.length < 6) {
				const fakemon = this.sampleNoReplace(pool);
				if (debug.includes(fakemon) || vpnSets[fakemon].skip) continue;
				debug.push(fakemon);
			}
			pool = debug;
		}
		if (monotype && !debug.length) {
			pool = pool.filter(x => this.dex.species.get(vpnSets[x].species).types.includes(monotype));
		}
		if (global.Config?.disabledssbsets?.length) {
			pool = pool.filter(x => !global.Config.disabledssbsets.includes(this.dex.toID(x)));
		}
		const typePool: { [k: string]: number } = {};
		let depth = 0;
		while (pool.length && team.length < this.maxTeamSize) {
			if (depth >= 200) throw new Error(`Infinite loop in VPN team generation.`);
			depth++;
			const name = this.sampleNoReplace(pool);
			const vpnSet: VPNSet = this.dex.deepClone(vpnSets[name]);
			if (vpnSet.skip) continue;

			// Enforce typing limits
			if (!(debug.length || monotype)) { // Type limits are ignored for debugging and monotype
				const species = this.dex.species.get(vpnSet.species);

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
				if (vpnSet.ability === 'Wonder Guard') {
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
			if (vpnSet.teraType) {
				teraType = vpnSet.teraType === 'Any' ?
					this.sample(this.dex.types.names()) :
					this.sampleIfArray(vpnSet.teraType);
			}
			const moves: string[] = [];
			while (moves.length < 3 && vpnSet.moves.length > 0) {
				let move = this.sampleNoReplace(vpnSet.moves);
				if (Array.isArray(move)) move = this.sampleNoReplace(move);
				moves.push(this.dex.moves.get(move).name);
			}
			moves.push(this.dex.moves.get(vpnSet.signatureMove).name);
			const ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...vpnSet.ivs };

			if (!moves.map(x => this.dex.moves.get(x)).some(x => x.category === 'Physical')) {
				ivs.atk = 0;
			}

			const set: PokemonSet = {
				name,
				species: vpnSet.species,
				item: this.sampleIfArray(vpnSet.item),
				ability: this.sampleIfArray(vpnSet.ability),
				moves,
				nature: vpnSet.nature ? Array.isArray(vpnSet.nature) ? this.sampleNoReplace(vpnSet.nature) : vpnSet.nature : 'Lax',
				gender: vpnSet.gender ? this.sampleIfArray(vpnSet.gender) : this.sample(['M', 'F', 'N']),
				evs: vpnSet.evs ? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...vpnSet.evs } :

				{ hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84 },
				ivs,
				level: this.adjustLevel || vpnSet.level || 100,
				happiness: typeof vpnSet.happiness === 'number' ? vpnSet.happiness : 255,
				shiny: typeof vpnSet.shiny === 'number' ? this.randomChance(1, vpnSet.shiny) : !!vpnSet.shiny,
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

export default RandomVPNTeams;
