import RandomTeams from '../../random-battles/gen9/teams';

export interface CPMSet {
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
interface CPMSets { [k: string]: CPMSet }

export const cpmSets: CPMSets = {
	Aesap: {
		species: 'Aesap', ability: 'Exhaust', item: 'Leppa Berry', gender: '',
		moves: ['Knock Off', 'U-turn', 'Strength Sap'],
		signatureMove: 'Let\'s Snuggle Forever',
		evs: { hp: 4, atk: 252, spe: 252 }, nature: 'Jolly', teraType: 'Flying',
	},
	Anxiousoil: {
		species: 'Anxiousoil', ability: 'Troubled', item: 'Leftovers', gender: '',
		moves: [['Earthquake', 'Earth Power'], ['Shadow Ball', 'Poltergeist'], ['Ice Beam', 'Spikes', 'Moonblast']],
		signatureMove: 'Taunt',
		evs: { hp: 252, spa: 4, spe: 252 }, nature: 'Naive', teraType: 'Steel',
	},
	Araquisis: {
		species: 'Araquisis', ability: 'Precognition', item: 'Leftovers', gender: '',
		moves: ['Zen Headbutt', ['Sticky Web', 'Trick Room'], ['Moonlight', 'Pursuit']],
		signatureMove: 'Knock Off',
		evs: { hp: 252, atk: 252, spd: 4 }, ivs: { spe: 0 }, nature: 'Adamant', teraType: 'Dark',
	},
	Arthrostrike: {
		species: 'Arthrostrike', ability: 'Preeminence', item: 'Loaded Dice', gender: '',
		moves: ['Pin Missile', 'Earthquake', ['Fell Stinger', 'U-turn']],
		signatureMove: 'Arm Thrust',
		evs: { hp: 248, atk: 252, spe: 8 }, nature: 'Adamant', teraType: 'Fairy',
	},
	Bleyabat: {
		species: 'Bleyabat', ability: 'Night Light', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Dual Wingbeat', 'Shadow Claw', 'Roost'],
		signatureMove: 'Bulk Up',
		evs: { hp: 252, def: 4, spd: 252 }, nature: 'Careful', teraType: 'Water',
	},
	Boillusk: {
		species: 'Boillusk', ability: 'Absorber', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Steam Eruption', 'Earth Power', ['Scald', 'Stealth Rock', 'Overheat']],
		signatureMove: 'Fire Blast',
		evs: { hp: 252, spa: 252, spe: 4 }, nature: 'Modest', teraType: 'Fire',
	},
	Boogeymancer: {
		species: 'Boogeymancer', ability: 'Broken Wand', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Shadow Ball', 'Energy Ball', ['Parting Shot', 'Calm Mind']],
		signatureMove: 'Lava Plume',
		evs: { atk: 4, spa: 252, spd: 252 }, nature: 'Timid', teraType: 'Dragon',
	},
	Buffball: {
		species: 'Buffball', ability: 'Preparation', item: 'Leftovers', gender: '',
		moves: ['Leech Life', 'Knock Off', ['Bulk Up', 'Agility']],
		signatureMove: "Close Combat",
		evs: { hp: 4, atk: 252, spe: 252 }, nature: 'Adamant', teraType: 'Ground',
	},
	Bugsome: {
		species: 'Bugsome', ability: 'Stat Leeching', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Lunge', ['Crunch', 'Psychic Fangs'], 'Close Combat'],
		signatureMove: "U-turn",
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Fire',
	},
	Cliffilisk: {
		species: 'Cliffilisk', ability: 'Crumble', item: 'Leftovers', gender: '',
		moves: ['Dragon Claw', ['Knock Off', 'Earthquake'], ['Stone Edge', 'Head Smash']],
		signatureMove: "Collision Course",
		evs: { hp: 252, atk: 252, spd: 4 }, nature: 'Adamant', teraType: 'Fighting',
	},
	Cogwyld: {
		species: 'Cogwyld', ability: 'Self-Repair', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Knock Off', 'Gear Grind', ['Heal Bell', 'Thunder Wave', 'Stealth Rock']],
		signatureMove: 'Parting Shot',
		evs: { hp: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Water',
	},
	Contradox: {
		species: 'Contradox', ability: 'Antimatter', item: 'Life Orb', gender: '',
		moves: ['Psychic Fangs', ['Earthquake', 'Fire Punch', 'Ice Shard'], 'U-turn'],
		signatureMove: 'Triple Axel',
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Poison',
	},
	Cosmole: {
		species: 'Cosmole', ability: 'Quick Thinking', item: 'Life Orb', gender: '',
		moves: [['Swords Dance', 'Rapid Spin', 'Close Combat'], 'Earthquake', 'Psychic Fangs'],
		signatureMove: 'Extreme Speed',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Adamant', teraType: 'Ground',
	},
	Crashtank: {
		species: 'Crashtank', ability: 'Brace for Impact', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Knock Off', 'Body Press', ['Rapid Spin', 'Spikes', 'U-turn']],
		signatureMove: 'Body Slam',
		evs: { hp: 248, def: 252, spd: 8 }, nature: 'Impish', teraType: 'Fairy',
	},
	Cryobser: {
		species: 'Cryobser', ability: 'Medic', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Ice Beam', 'Heal Bell', ['Discharge', 'Body Slam']],
		signatureMove: 'Revival Blessing',
		evs: { hp: 252, spd: 252, spe: 4 }, nature: 'Calm', teraType: 'Fairy',
	},
	Delirirak: {
		species: 'Delirirak', ability: 'Fumigation', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Recover', 'Ice Beam', ['Earth Power', 'Toxic', 'Will-O-Wisp']],
		signatureMove: 'Hex',
		evs: { hp: 4, spa: 252, spd: 252 }, nature: 'Modest', teraType: 'Stellar',
	},
	Depresloth: {
		species: 'Depresloth', ability: 'Exhaust', item: 'Leftovers', gender: '',
		moves: ['Thunderbolt', 'Shadow Ball', 'Volt Switch'],
		signatureMove: 'Signal Beam',
		evs: { hp: 252, def: 252, spa: 4 }, nature: 'Timid', teraType: 'Bug',
	},
	Faellen: {
		species: 'Faellen', ability: 'Broken Wand', item: 'Choice Specs', gender: '',
		moves: [['U-turn', 'Trick'], 'Dark Pulse', ['Flamethrower', 'Moonblast']],
		signatureMove: 'Light of Ruin',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Ghost',
	},
	Fightinfly: {
		species: 'Fightinfly', ability: 'Nocturnal', item: 'Choice Band', gender: '',
		moves: ['Close Combat', ['Knock Off', 'Stone Edge'], ['Earthquake', 'Flare Blitz']],
		signatureMove: 'U-turn',
		evs: { hp: 4, atk: 252, spe: 252 }, nature: 'Jolly', teraType: 'Fairy',
	},
	Folibower: {
		species: 'Folibower', ability: 'Treasure Craze', item: 'Salac Berry', gender: '',
		moves: ['Seed Bomb', 'Acrobatics', 'Recycle'],
		signatureMove: 'Stuff Cheeks',
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Fairy',
	},
	Frenzaiai: {
		species: 'Frenzaiai', ability: 'Asymmetry', item: 'Black Sludge', gender: '',
		moves: ['Toxic', 'U-turn', 'Knock Off'],
		signatureMove: 'Encore',
		evs: { hp: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Fairy',
	},
	Fungemory: {
		species: 'Fungemory', ability: 'Sealed Off', item: 'Leftovers', gender: 'M',
		moves: ['Psychic Noise', 'Scald', ['Tidy Up', 'Teleport']],
		signatureMove: 'Shadow Ball',
		evs: { hp: 252, spa: 4, spd: 252 }, nature: 'Calm', teraType: 'Psychic',
	},
	Guarden: {
		species: 'Guarden', ability: 'Royal Guard', item: 'Leftovers', gender: '',
		moves: ['Bulk Up', 'Leaf Blade', ['Body Press', 'Bitter Blade', 'Iron Head']],
		signatureMove: 'Spiky Shield',
		evs: { hp: 252, spd: 252, spe: 4 }, nature: 'Careful', teraType: 'Steel',
	},
	Hawksectiff: {
		species: 'Hawksectiff', ability: 'Pecking Order', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Dual Wingbeat', 'Knock Off', ['Roost', 'Sucker Punch']],
		signatureMove: 'Pursuit',
		evs: { hp: 4, atk: 252, spe: 252 }, nature: 'Jolly', teraType: 'Steel',
	},
	Ichthyocorn: {
		species: 'Ichthyocorn', ability: 'Capricious', item: 'Leftovers', gender: '',
		moves: [['Recover', 'Ice Beam'], 'Moonblast', ['Hydro Pump', 'Scald']],
		signatureMove: 'Flip Turn',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Rock',
	},
	Lampyre: {
		species: 'Lampyre', ability: 'Night Light', item: ['Air Balloon', 'Choice Specs'], gender: '',
		moves: ['Flash Cannon', 'Scald', ['Calm Mind', 'Overheat']],
		signatureMove: 'Fire Blast',
		evs: { hp: 252, def: 28, spd: 224 }, ivs: { atk: 0, spe: 0 }, nature: 'Relaxed',
	},
	Lazahrusk: {
		species: 'Lazahrusk', ability: 'Diseased', item: 'Heavy-Duty Boots', gender: '',
		moves: [['Leech Life', 'Shadow Ball'], 'Strength Sap', 'Revival Blessing'],
		signatureMove: 'Mortal Spin',
		evs: { hp: 252, def: 252, spd: 4 }, nature: 'Relaxed', teraType: 'Fairy',
	},
	Leviadon: {
		species: 'Leviadon', ability: 'Gangster', item: 'Leftovers', gender: '',
		moves: ['Close Combat', ['Glare', 'Flash Cannon', 'Fire Blast'], ['Dragon Tail', 'Stealth Rock']],
		signatureMove: 'Core Enforcer',
		evs: { hp: 252, spa: 252, spd: 4 }, nature: 'Modest', teraType: 'Water',
	},
	Liwyzard: {
		species: 'Liwyzard', ability: 'Magic Missile', item: 'Light Ball', gender: '',
		moves: ['Calm Mind', 'Mystical Fire', 'Moonlight'],
		signatureMove: 'Strange Steam',
		evs: { hp: 252, spa: 4, spe: 252 }, nature: 'Timid', teraType: 'Steel',
	},
	Magmouth: {
		species: 'Magmouth', ability: 'Searing Remark', item: 'Leftovers', gender: '',
		moves: ['Boomburst', 'Sandsear Storm', ['Parting Shot', 'Torch Song']],
		signatureMove: 'Burning Bulwark',
		evs: { hp: 252, def: 252, spd: 4 }, nature: 'Bold', teraType: ['Steel', 'Flying', 'Electric', 'Dark'],
	},
	Manticrash: {
		species: 'Manticrash', ability: 'Comeback', item: 'Assault Vest', gender: '',
		moves: ['Hyper Drill', ['Fake Out', 'First Impression'], ['Wild Charge', 'U-turn']],
		signatureMove: 'Headlong Rush',
		evs: { hp: 252, atk: 252, spd: 4 }, nature: 'Adamant', teraType: 'Grass',
	},
	Marlord: {
		species: 'Marlord', ability: 'Polychrome', item: 'Assault Vest', gender: '',
		moves: ['Close Combat', ['Head Smash', 'Knock Off'], 'Earthquake'],
		signatureMove: 'Iron Head',
		evs: { hp: 148, atk: 156, spd: 204 }, nature: 'Adamant', teraType: 'Steel',
	},
	Marsonmallow: {
		species: 'Marsonmallow', ability: 'big stick', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Play Rough', ['Recover', 'Leaf Blade'], ['Trick Room', 'Sticky Web']],
		signatureMove: 'Flare Blitz',
		evs: { hp: 252, atk: 252, def: 4 }, nature: 'Brave', teraType: 'Poison',
	},
	Mindwyrm: {
		species: 'Mindwyrm', ability: 'Quick Thinking', item: 'Sitrus Berry', gender: '',
		moves: ['Leech Life', ['Knock Off', 'Temper Flare'], 'Dragon Hammer'],
		signatureMove: 'Clangorous Soul',
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Any',
	},
	Minkai: {
		species: 'Minkai', ability: 'Nocturnal', item: ['Life Orb', 'Choice Specs'], gender: '',
		moves: ['Focus Blast', 'Earth Power', ['Calm Mind', 'Shadow Ball']],
		signatureMove: 'Ice Beam',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Any',
	},
	Mosstrosity: {
		species: 'Mosstrosity', ability: 'Clinch', item: 'Power Herb', gender: '',
		moves: ['Meteor Beam', 'Surf', 'Thunderbolt'],
		signatureMove: 'Solar Beam',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Any',
	},
	Nectaregal: {
		species: 'Nectaregal', ability: 'Electromagnetic Manipulation', item: 'Leftovers', gender: '',
		moves: ['Giga Drain', ['Volt Switch', 'Discharge', 'Mud Shot'], ['Spikes', 'Calm Mind']],
		signatureMove: 'Synthesis',
		evs: { hp: 252, def: 252, spd: 4 }, nature: 'Bold', teraType: 'Flying',
	},
	Nharboard: {
		species: 'Nharboard', ability: 'First-Class Ticket', item: 'Leftovers', gender: '',
		moves: ['Flash Cannon', 'Flip Turn', ['Hurricane', 'Defog']],
		signatureMove: 'Scald',
		evs: { hp: 252, def: 4, spa: 252 }, nature: 'Modest', teraType: 'Fairy',
	},
	Noyew: {
		species: 'Noyew', ability: 'Back at Ya!', item: 'Leftovers', gender: '',
		moves: ['Spikes', 'Toxic', 'Grass Knot'],
		signatureMove: 'Leech Seed',
		evs: { hp: 252, def: 128, spd: 128 }, nature: 'Careful', teraType: 'Fairy',
	},
	Nucleophage: {
		species: 'Nucleophage', ability: 'Diseased', item: 'Black Sludge', gender: '',
		moves: ['Psychic', 'Sludge Wave', 'Lava Plume'],
		signatureMove: 'Nasty Plot',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Psychic',
	},
	Nummanutts: {
		species: 'Nummanutts', ability: 'Dice Roller', item: 'Black Sludge', gender: '',
		moves: ['Knock Off', 'Recover', ['Mortal Spin', 'U-turn']],
		signatureMove: 'Sludge Bomb',
		evs: { hp: 252, spa: 4, spd: 252 }, nature: 'Sassy', teraType: 'Poison',
	},
	Obsallas: {
		species: 'Obsallas', ability: 'Crumble', item: 'Life Orb', gender: '',
		moves: [['Fire Fang', 'Explosion', 'Taunt'], 'Icicle Crash', 'Extreme Speed'],
		signatureMove: 'Head Smash',
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Fairy',
	},
	Oonoonsi: {
		species: 'Oonoonsi', ability: 'Puppet Master', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Psychic Noise', 'Bug Buzz', 'Focus Blast'],
		signatureMove: 'Tail Glow',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Poison',
	},
	Orchidauntless: {
		species: 'Orchidauntless', ability: 'Dewdrop', item: 'Choice Band', gender: '',
		moves: ['Zen Headbutt', ['Play Rough', 'Sacred Sword'], 'Flip Turn'],
		signatureMove: 'Horn Leech',
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Ghost',
	},
	Pestifer: {
		species: 'Pestifer', ability: 'Contagious', item: 'Flame Orb', gender: '',
		moves: ['Nasty Plot', 'Sludge Wave', ['Thunderbolt', 'Flamethrower', 'Rapid Spin']],
		signatureMove: 'Sandsear Storm',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Ghost',
	},
	Pomegrenade: {
		species: 'Pomegrenade', ability: 'Mind Bloom', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Moonblast', 'Synthesis', ['Calm Mind', 'Aromatherapy']],
		signatureMove: 'Lava Plume',
		evs: { hp: 252, spa: 4, spe: 252 }, nature: 'Timid', teraType: 'Ghost',
	},
	Raintoad: {
		species: 'Raintoad', ability: 'Color Wheel', item: 'Leftovers', gender: '',
		moves: ['Body Slam', ['U-turn', 'Zen Headbutt'], 'Toxic'],
		signatureMove: 'Protect',
		evs: { hp: 252, atk: 4, spe: 252 }, nature: 'Jolly', teraType: 'Ghost',
	},
	Remnant: {
		species: 'Remnant', ability: 'Night March', item: 'Leftovers', gender: '',
		moves: ['Circle Throw', 'Toxic', 'Protect'],
		signatureMove: 'Poltergeist',
		evs: { hp: 252, def: 128, spd: 128 }, nature: 'Impish', teraType: 'Ground',
	},
	Rizzquaza: {
		species: 'Rizzquaza', ability: 'Iron Fistening', item: 'Mystic Water', gender: '',
		moves: ['Dragon Dance', 'Ice Spinner', 'Outrage'],
		signatureMove: 'Fishious Rend',
		evs: { hp: 4, atk: 252, spe: 252 }, nature: 'Jolly', teraType: 'Ghost',
	},
	Roddammit: {
		species: 'Roddammit', ability: 'Outclass', item: 'Leftovers', gender: '',
		moves: [['Wicked Blow', 'Knock Off'], ['Gunk Shot', 'Synthesis', 'Spikes'], 'Chilly Reception'],
		signatureMove: 'Flower Trick',
		evs: { hp: 252, atk: 252, spd: 4 }, nature: 'Adamant', teraType: 'Fire',
	},
	Roolette: {
		species: 'Roolette', ability: 'Spin the Wheel', item: 'Leftovers', gender: '',
		moves: ['Close Combat', 'Knock Off', ['Rapid Spin', 'Protect', 'Triple Axel']],
		signatureMove: 'Double-Edge',
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Fire',
	},
	Rootfraction: {
		species: 'Rootfraction', ability: 'Refraction', item: 'Black Sludge', gender: '',
		moves: ['Giga Drain', 'Synthesis', ['Flamethrower', 'U-turn']],
		signatureMove: 'Malignant Chain',
		evs: { hp: 252, spa: 252, spe: 4 }, nature: 'Modest', teraType: 'Dark',
	},
	Shail: {
		species: 'Shail', ability: 'Snowhazard', item: 'White Herb', gender: '',
		moves: ['Blizzard', 'Earth Power', 'Power Gem'],
		signatureMove: 'Shell Smash',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: ['Dark', 'Poison', 'Ghost', 'Steel'],
	},
	Shufflux: {
		species: 'Shufflux', ability: 'Draw Four', item: ['Choice Specs', 'Choice Scarf'], gender: '',
		moves: ['Trick', 'Dazzling Gleam', 'Extrasensory'],
		signatureMove: 'Tri Attack',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Any',
	},
	Shurifluri: {
		species: 'Shurifluri', ability: 'Snowhazard', item: 'Never-Melt Ice', gender: '',
		moves: ['Ice Spinner', 'Ice Shard', 'Iron Head'],
		signatureMove: 'Bulk Up',
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Fire',
	},
	Skibidragon: {
		species: 'Skibidragon', ability: 'Bathroom Break', item: 'Choice Specs', gender: '',
		moves: ['Hydro Pump', 'Searing Shot', ['Defog', 'Thunderbolt', 'Sludge Wave']],
		signatureMove: 'Draco Meteor',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Dark',
	},
	Spreetah: {
		species: 'Spreetah', ability: 'Momentum', item: 'Metronome', gender: '',
		moves: ['Swords Dance', 'Flare Blitz', 'Volt Tackle'],
		signatureMove: 'Bonemerang',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Ghost',
	},
	Suragon: {
		species: 'Suragon', ability: 'Antimatter', item: 'Leftovers', gender: '',
		moves: ['Draco Meteor', ['Knock Off', 'Thunder Wave'], 'Psychic Noise'],
		signatureMove: 'Topsy-Turvy',
		evs: { hp: 252, def: 252, spa: 4 }, nature: 'Bold', teraType: 'Bug',
	},
	Surfsurge: {
		species: 'Surfsurge', ability: 'Strong Breeze', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Volt Switch', ['Thunderbolt', 'Rapid Spin'], ['Ice Beam', 'Thunder Wave']],
		signatureMove: 'Surf',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Fairy',
	},
	Tardeblade: {
		species: 'Tardeblade', ability: 'Hibernation', item: 'Leftovers', gender: '',
		moves: ['Body Press', 'Rest', 'Sleep Talk'],
		signatureMove: 'Stored Power',
		evs: { hp: 252, def: 128, spd: 128 }, nature: 'Bold', teraType: 'Water',
	},
	Trawlutre: {
		species: 'Trawlutre', ability: 'Super Rod', item: 'Leftovers', gender: '',
		moves: ['Close Combat', 'Knock Off', ['U-turn', 'Bulk Up', 'Aqua Jet']],
		signatureMove: 'Liquidation',
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Jolly', teraType: 'Flying',
	},
	Tuxquito: {
		species: 'Tuxquito', ability: 'Bloodsucking', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Hurricane', 'Fire Blast', 'Bug Buzz'],
		signatureMove: 'Quiver Dance',
		evs: { def: 4, spa: 252, spe: 252 }, nature: 'Modest', teraType: 'Normal',
	},
	Underhazard: {
		species: 'Underhazard', ability: 'Countermeasures', item: 'Black Sludge', gender: '',
		moves: ['Recover', 'Dark Pulse', 'Sludge Bomb'],
		signatureMove: 'Toxic Spikes',
		evs: { hp: 252, def: 4, spd: 252 }, nature: 'Careful', teraType: 'Water',
	},
};

export class RandomCPMTeams extends RandomTeams {
	randomCPMTeam(options: { inBattle?: boolean } = {}) {
		this.enforceNoDirectCustomBanlistChanges();

		const team: PokemonSet[] = [];
		const debug: string[] = []; // Set this to a list of CPM sets to override the normal pool for debugging.
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const monotype = this.forceMonotype || (ruleTable.has('sametypeclause') ?
			this.sample(this.dex.types.names().filter(x => x !== 'Stellar')) : false);

		let pool = Object.keys(cpmSets);
		if (debug.length) {
			while (debug.length < 6) {
				const fakemon = this.sampleNoReplace(pool);
				if (debug.includes(fakemon) || cpmSets[fakemon].skip) continue;
				debug.push(fakemon);
			}
			pool = debug;
		}
		if (monotype && !debug.length) {
			pool = pool.filter(x => this.dex.species.get(cpmSets[x].species).types.includes(monotype));
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
			const cpmSet: CPMSet = this.dex.deepClone(cpmSets[name]);
			if (cpmSet.skip) continue;

			// Enforce typing limits
			if (!(debug.length || monotype)) { // Type limits are ignored for debugging and monotype
				const species = this.dex.species.get(cpmSet.species);

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
				if (cpmSet.ability === 'Wonder Guard') {
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
			if (cpmSet.teraType) {
				teraType = cpmSet.teraType === 'Any' ?
					this.sample(this.dex.types.names()) :
					this.sampleIfArray(cpmSet.teraType);
			}
			const moves: string[] = [];
			while (moves.length < 3 && cpmSet.moves.length > 0) {
				let move = this.sampleNoReplace(cpmSet.moves);
				if (Array.isArray(move)) move = this.sampleNoReplace(move);
				moves.push(this.dex.moves.get(move).name);
			}
			moves.push(this.dex.moves.get(cpmSet.signatureMove).name);
			const ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...cpmSet.ivs };

			if (!moves.map(x => this.dex.moves.get(x)).some(x => x.category === 'Physical')) {
				ivs.atk = 0;
			}

			const set: PokemonSet = {
				name,
				species: cpmSet.species,
				item: this.sampleIfArray(cpmSet.item),
				ability: this.sampleIfArray(cpmSet.ability),
				moves,
				nature: cpmSet.nature ? Array.isArray(cpmSet.nature) ? this.sampleNoReplace(cpmSet.nature) : cpmSet.nature : 'Serious',
				gender: cpmSet.gender ? this.sampleIfArray(cpmSet.gender) : this.sample(['M', 'F', 'N']),
				evs: cpmSet.evs ? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...cpmSet.evs } :

				{ hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84 },
				ivs,
				level: this.adjustLevel || cpmSet.level || 100,
				happiness: typeof cpmSet.happiness === 'number' ? cpmSet.happiness : 255,
				shiny: typeof cpmSet.shiny === 'number' ? this.randomChance(1, cpmSet.shiny) : !!cpmSet.shiny,
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

export default RandomCPMTeams;
