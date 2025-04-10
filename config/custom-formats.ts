import { Dex } from '@pkmn/dex';
import { FormatList } from '@pkmn/sim';

const gen9 = Dex.forGen(9);

const redPokemonData = {
    "charizard": {
        "base": {
            "moves": ["Flamethrower", "Air Slash", "Roost", "Earthquake", "Dragon Pulse", "Solar Beam"],
            "ability": "Blaze",
            "item": "Charizardite Y",
            "evs": { "spa": 252, "spe": 252, "hp": 4 },
            "nature": "Timid"
        },
        "mega": {
            "species": "charizard-mega-y",
            "moves": ["Flamethrower", "Air Slash", "Roost", "Solar Beam", "Dragon Pulse", "Focus Blast"],
            "ability": "Drought",
            "evs": { "spa": 252, "spe": 252, "hp": 4 },
            "nature": "Timid"
        }
    },
    "flareon": {
        "moves": ["Flare Blitz", "Wish", "Protect", "Superpower", "Facade", "Will-O-Wisp"],
        "ability": "Flash Fire",
        "item": "Leftovers",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "magmar": {
        "moves": ["Fire Blast", "Thunderbolt", "Focus Blast", "Will-O-Wisp", "Psychic", "Lava Plume"],
        "ability": "Flame Body",
        "item": "Heavy-Duty Boots",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "magikarp": {
        "moves": ["Splash", "Tackle", "Flail", "Bounce"],
        "ability": "Swift Swim",
        "item": "Focus Sash",
        "evs": { "hp": 252, "def": 252, "spd": 4 },
        "nature": "Impish"
    },
    "gyarados": {
        "moves": ["Waterfall", "Crunch", "Dragon Dance", "Earthquake", "Outrage", "Ice Fang"],
        "ability": "Intimidate",
        "item": "Leftovers",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "moltres": {
        "moves": ["Fire Blast", "Hurricane", "Roost", "Defog", "U-turn", "Will-O-Wisp"],
        "ability": "Flame Body",
        "item": "Heavy-Duty Boots",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "typhlosion": {
        "moves": ["Eruption", "Focus Blast", "Shadow Ball", "Will-O-Wisp", "Flamethrower", "Thunder Punch"],
        "ability": "Blaze",
        "item": "Choice Specs",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "scizor": {
        "base": {
            "moves": ["Bullet Punch", "U-turn", "Swords Dance", "Close Combat", "Knock Off", "Quick Attack"],
            "ability": "Technician",
            "item": "Scizorite",
            "evs": { "atk": 252, "spe": 252, "hp": 4 },
            "nature": "Adamant"
        },
        "mega": {
            "species": "scizor-mega",
            "moves": ["Bullet Punch", "U-turn", "Swords Dance", "Bug Bite", "Knock Off", "Superpower"],
            "ability": "Technician",
            "evs": { "atk": 252, "spe": 252, "hp": 4 },
            "nature": "Adamant"
        }
    },
    "magby": {
        "moves": ["Fire Punch", "Thunder Punch", "Cross Chop", "Smokescreen", "Confuse Ray", "Will-O-Wisp"],
        "ability": "Flame Body",
        "item": "Eviolite",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "entei": {
        "moves": ["Sacred Fire", "Extreme Speed", "Stone Edge", "Will-O-Wisp", "Iron Head", "Stomping Tantrum"],
        "ability": "Pressure",
        "item": "Choice Band",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Adamant"
    },
    "torchic": {
        "moves": ["Ember", "Quick Attack", "Focus Energy", "Sand Attack", "Aerial Ace", "Fire Spin"],
        "ability": "Blaze",
        "item": "Eviolite",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Adamant"
    },
    "combusken": {
        "moves": ["Blaze Kick", "Quick Attack", "Bulk Up", "Sand Attack", "Aerial Ace", "Rock Tomb"],
        "ability": "Blaze",
        "item": "Eviolite",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Adamant"
    },
    "blaziken": {
        "moves": ["Blaze Kick", "High Jump Kick", "Swords Dance", "Protect", "U-turn", "Thunder Punch"],
        "ability": "Speed Boost",
        "item": "Heavy-Duty Boots",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Adamant"
    },
    "slugma": {
        "moves": ["Ember", "Yawn", "Rock Throw", "Acid Armor", "Lava Plume", "Earth Power"],
        "ability": "Magma Armor",
        "item": "Eviolite",
        "evs": { "spa": 252, "spd": 252, "hp": 4 },
        "nature": "Calm"
    },
    "magcargo": {
        "moves": ["Lava Plume", "Earth Power", "Stealth Rock", "Will-O-Wisp", "Recover", "Ancient Power"],
        "ability": "Flame Body",
        "item": "Heavy-Duty Boots",
        "evs": { "spa": 252, "spd": 252, "hp": 4 },
        "nature": "Calm"
    },
    "corphish": {
        "moves": ["Crabhammer", "Knock Off", "Aqua Jet", "Swords Dance", "Crunch", "Rock Tomb"],
        "ability": "Adaptability",
        "item": "Eviolite",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Adamant"
    },
    "crawdaunt": {
        "moves": ["Crabhammer", "Knock Off", "Aqua Jet", "Swords Dance", "Crunch", "Liquidation"],
        "ability": "Adaptability",
        "item": "Life Orb",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Adamant"
    },
    "groudon": {
        "moves": ["Earthquake", "Precipice Blades", "Swords Dance", "Stone Edge", "Rock Polish", "Fire Punch"],
        "ability": "Drought",
        "item": "Leftovers",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Adamant"
    },
    "chimchar": {
        "moves": ["Scratch", "Leer", "Ember", "Taunt", "Acrobatics", "Fake Out"],
        "ability": "Blaze",
        "item": "Eviolite",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "monferno": {
        "moves": ["Close Combat", "Flare Blitz", "U-turn", "Taunt", "Mach Punch", "Rock Slide"],
        "ability": "Blaze",
        "item": "Eviolite",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "infernape": {
        "moves": ["Close Combat", "Flare Blitz", "U-turn", "Mach Punch", "Nasty Plot", "Vacuum Wave"],
        "ability": "Blaze",
        "item": "Choice Scarf",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "magmortar": {
        "moves": ["Fire Blast", "Thunderbolt", "Focus Blast", "Will-O-Wisp", "Psychic", "Hyper Beam"],
        "ability": "Flame Body",
        "item": "Choice Specs",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "heatran": {
        "moves": ["Magma Storm", "Earth Power", "Flash Cannon", "Stealth Rock", "Toxic", "Protect"],
        "ability": "Flash Fire",
        "item": "Leftovers",
        "evs": { "spa": 252, "spd": 252, "hp": 4 },
        "nature": "Calm"
    },
    "darumaka": {
        "moves": ["Tackle", "Rollout", "Fire Punch", "Yawn", "Belly Drum", "U-turn"],
        "ability": "Hustle",
        "item": "Eviolite",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Adamant"
    },
    "darmanitan": {
        "moves": ["Flare Blitz", "U-turn", "Rock Slide", "Earthquake", "Superpower", "Will-O-Wisp"],
        "ability": "Sheer Force",
        "item": "Choice Scarf",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "archen": {
        "moves": ["Acrobatics", "Stone Edge", "U-turn", "Roost", "Earthquake", "Dragon Claw"],
        "ability": "Defeatist",
        "item": "Heavy-Duty Boots",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "archeops": {
        "moves": ["Acrobatics", "Stone Edge", "Earthquake", "U-turn", "Roost", "Brave Bird"],
        "ability": "Defeatist",
        "item": "Heavy-Duty Boots",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "reshiram": {
        "moves": ["Blue Flare", "Draco Meteor", "Roost", "Defog", "Earth Power", "Stone Edge"],
        "ability": "Turboblaze",
        "item": "Heavy-Duty Boots",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "fletchling": {
        "moves": ["Tackle", "Growl", "Peck", "Quick Attack", "Acrobatics", "Tailwind"],
        "ability": "Big Pecks",
        "item": "Eviolite",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "fletchinder": {
        "moves": ["Flame Charge", "Acrobatics", "Roost", "U-turn", "Will-O-Wisp", "Swords Dance"],
        "ability": "Flame Body",
        "item": "Eviolite",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "talonflame": {
        "moves": ["Brave Bird", "Flare Blitz", "Swords Dance", "Roost", "U-turn", "Will-O-Wisp"],
        "ability": "Gale Wings",
        "item": "Heavy-Duty Boots",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "volcanion": {
        "moves": ["Steam Eruption", "Fire Blast", "Sludge Wave", "Earth Power", "Hidden Power Grass", "U-turn"],
        "ability": "Water Absorb",
        "item": "Leftovers",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "litten": {
        "moves": ["Scratch", "Ember", "Growl", "Lick", "Fake Out", "Darkest Lariat"],
        "ability": "Blaze",
        "item": "Eviolite",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "torracat": {
        "moves": ["Flare Blitz", "Darkest Lariat", "U-turn", "Will-O-Wisp", "Leech Life", "Outrage"],
        "ability": "Blaze",
        "item": "Eviolite",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "incineroar": {
        "moves": ["Flare Blitz", "Darkest Lariat", "Parting Shot", "Will-O-Wisp", "Knock Off", "U-turn"],
        "ability": "Intimidate",
        "item": "Leftovers",
        "evs": { "atk": 252, "hp": 252, "def": 4 },
        "nature": "Adamant"
    },
    "salandit": {
        "moves": ["Poison Gas", "Ember", "Smog", "Dragon Rage", "Toxic", "Nasty Plot"],
        "ability": "Corrosion",
        "item": "Eviolite",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "salazzle": {
        "moves": ["Nasty Plot", "Sludge Wave", "Flamethrower", "Toxic", "Dragon Pulse", "Encore"],
        "ability": "Corrosion",
        "item": "Focus Sash",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "scorbunny": {
        "moves": ["Tackle", "Growl", "Ember", "Quick Attack", "Double Kick", "Pyro Ball"],
        "ability": "Blaze",
        "item": "Eviolite",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "raboot": {
        "moves": ["Pyro Ball", "Double Kick", "U-turn", "High Jump Kick", "Bulk Up", "Blaze Kick"],
        "ability": "Blaze",
        "item": "Eviolite",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "cinderace": {
        "moves": ["Pyro Ball", "High Jump Kick", "U-turn", "Court Change", "Sucker Punch", "Zen Headbutt"],
        "ability": "Libero",
        "item": "Heavy-Duty Boots",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "centiskorch": {
        "moves": ["Fire Lash", "Leech Life", "Knock Off", "Coil", "Power Whip", "Protect"],
        "ability": "Flash Fire",
        "item": "Heavy-Duty Boots",
        "evs": { "atk": 252, "hp": 252, "spd": 4 },
        "nature": "Adamant"
    },
    "fuecoco": {
        "moves": ["Ember", "Leer", "Round", "Incinerate", "Will-O-Wisp", "Slack Off"],
        "ability": "Blaze",
        "item": "Eviolite",
        "evs": { "spa": 252, "hp": 252, "def": 4 },
        "nature": "Modest"
    },
    "crocalor": {
        "moves": ["Torch Song", "Shadow Ball", "Will-O-Wisp", "Protect", "Flamethrower", "Hyper Voice"],
        "ability": "Blaze",
        "item": "Eviolite",
        "evs": { "spa": 252, "hp": 252, "def": 4 },
        "nature": "Modest"
    },
    "skeledirge": {
        "moves": ["Torch Song", "Shadow Ball", "Will-O-Wisp", "Slack Off", "Earth Power", "Hex"],
        "ability": "Unaware",
        "item": "Leftovers",
        "evs": { "spa": 252, "hp": 252, "def": 4 },
        "nature": "Modest"
    },
    "armarouge": {
        "moves": ["Armor Cannon", "Psychic", "Calm Mind", "Recover", "Energy Ball", "Shadow Ball"],
        "ability": "Flash Fire",
        "item": "Heavy-Duty Boots",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "annihilape": {
        "moves": ["Rage Fist", "Drain Punch", "U-turn", "Bulk Up", "Shadow Claw", "Ice Punch"],
        "ability": "Defiant",
        "item": "Leftovers",
        "evs": { "atk": 252, "hp": 252, "spe": 4 },
        "nature": "Adamant"
    },
    "mew": {
        "moves": ["Swords Dance", "Drain Punch", "Zen Headbutt", "U-turn", "Stealth Rock", "Will-O-Wisp"],
        "ability": "Synchronize",
        "item": "Leftovers",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "ho-oh": {
        "moves": ["Sacred Fire", "Brave Bird", "Roost", "Defog", "Earthquake", "U-turn"],
        "ability": "Regenerator",
        "item": "Heavy-Duty Boots",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Adamant"
    },
    "kyogre-primal": {
        "moves": ["Origin Pulse", "Thunder", "Ice Beam", "Calm Mind", "Water Spout", "Surf"],
        "ability": "Primordial Sea",
        "item": "Choice Specs",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "rayquaza": {
        "moves": ["Dragon Ascent", "Earthquake", "Outrage", "Swords Dance", "Extreme Speed", "V-create"],
        "ability": "Air Lock",
        "item": "Life Orb",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "deoxys-attack": {
        "moves": ["Psycho Boost", "Superpower", "Ice Beam", "Extreme Speed", "Knock Off", "Thunderbolt"],
        "ability": "Pressure",
        "item": "Choice Specs",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "deoxys-speed": {
        "moves": ["Psychic", "Ice Beam", "Thunderbolt", "Taunt", "Spikes", "Recover"],
        "ability": "Pressure",
        "item": "Light Clay",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "dialga": {
        "moves": ["Roar of Time", "Flash Cannon", "Thunderbolt", "Stealth Rock", "Dragon Pulse", "Earth Power"],
        "ability": "Pressure",
        "item": "Leftovers",
        "evs": { "spa": 252, "hp": 252, "def": 4 },
        "nature": "Modest"
    },
    "palkia": {
        "moves": ["Spacial Rend", "Hydro Pump", "Thunderbolt", "Surf", "Draco Meteor", "Fire Blast"],
        "ability": "Pressure",
        "item": "Choice Specs",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "giratina-origin": {
        "moves": ["Shadow Force", "Dragon Pulse", "Earthquake", "Defog", "Aura Sphere", "Will-O-Wisp"],
        "ability": "Levitate",
        "item": "Griseous Orb",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "victini": {
        "moves": ["V-create", "Bolt Strike", "U-turn", "Will-O-Wisp", "Psychic", "Grass Knot"],
        "ability": "Victory Star",
        "item": "Choice Band",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "genesect": {
        "moves": ["Techno Blast", "U-turn", "Iron Head", "Flamethrower", "Ice Beam", "Thunderbolt"],
        "ability": "Download",
        "item": "Choice Scarf",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "yveltal": {
        "moves": ["Dark Pulse", "Oblivion Wing", "U-turn", "Roost", "Knock Off", "Sucker Punch"],
        "ability": "Dark Aura",
        "item": "Heavy-Duty Boots",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "volcarona": {
        "moves": ["Quiver Dance", "Fiery Dance", "Bug Buzz", "Roost", "Giga Drain", "Hurricane"],
        "ability": "Flame Body",
        "item": "Heavy-Duty Boots",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "ceruledge": {
        "moves": ["Bitter Blade", "Shadow Sneak", "Swords Dance", "Will-O-Wisp", "Close Combat", "Psycho Cut"],
        "ability": "Flash Fire",
        "item": "Heavy-Duty Boots",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "ursaluna-bloodmoon": {
        "moves": ["Blood Moon", "Earth Power", "Hyper Voice", "Vacuum Wave", "Calm Mind", "Protect"],
        "ability": "Mind's Eye",
        "item": "Choice Specs",
        "evs": { "spa": 252, "hp": 252, "def": 4 },
        "nature": "Modest"
    },
    "walking wake": {
        "moves": ["Hydro Pump", "Draco Meteor", "Surf", "Calm Mind", "Flamethrower", "Dragon Pulse"],
        "ability": "Protosynthesis",
        "item": "Booster Energy",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "growlithe-hisui": {
        "moves": ["Flare Blitz", "Rock Slide", "Crunch", "Will-O-Wisp", "Extreme Speed", "Rock Tomb"],
        "ability": "Intimidate",
        "item": "Eviolite",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "arcanine-hisui": {
        "moves": ["Flare Blitz", "Rock Slide", "Extreme Speed", "Will-O-Wisp", "Head Smash", "Crunch"],
        "ability": "Intimidate",
        "item": "Heavy-Duty Boots",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "darmanitan-galar-zen": {
        "moves": ["Icicle Crash", "Flare Blitz", "Earthquake", "U-turn", "Stone Edge", "Superpower"],
        "ability": "Zen Mode",
        "item": "Choice Band",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "great tusk": {
        "moves": ["Headlong Rush", "Close Combat", "Knock Off", "Rapid Spin", "Earthquake", "Stone Edge"],
        "ability": "Protosynthesis",
        "item": "Booster Energy",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "brute bonnet": {
        "moves": ["Spore", "Giga Drain", "Knock Off", "Sucker Punch", "Rage Powder", "Clear Smog"],
        "ability": "Protosynthesis",
        "item": "Booster Energy",
        "evs": { "atk": 252, "hp": 252, "def": 4 },
        "nature": "Adamant"
    },
    "flutter mane": {
        "moves": ["Moonblast", "Shadow Ball", "Power Gem", "Thunderbolt", "Mystical Fire", "Dazzling Gleam"],
        "ability": "Protosynthesis",
        "item": "Booster Energy",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
    "slither wing": {
        "moves": ["First Impression", "Close Combat", "Acrobatics", "U-turn", "Flare Blitz", "Pollen Puff"],
        "ability": "Protosynthesis",
        "item": "Booster Energy",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "roaring moon": {
        "moves": ["Dragon Dance", "Outrage", "Acrobatics", "Earthquake", "Iron Head", "Knock Off"],
        "ability": "Protosynthesis",
        "item": "Booster Energy",
        "evs": { "atk": 252, "spe": 252, "hp": 4 },
        "nature": "Jolly"
    },
    "iron hands": {
        "moves": ["Close Combat", "Thunder Punch", "Volt Switch", "Drain Punch", "Wild Charge", "Swords Dance"],
        "ability": "Quark Drive",
        "item": "Booster Energy",
        "evs": { "atk": 252, "hp": 252, "def": 4 },
        "nature": "Adamant"
    },
    "iron bundle": {
        "moves": ["Hydro Pump", "Freeze-Dry", "Flip Turn", "Volt Switch", "Ice Beam", "Thunderbolt"],
        "ability": "Quark Drive",
        "item": "Booster Energy",
        "evs": { "spa": 252, "spe": 252, "hp": 4 },
        "nature": "Timid"
    },
};

const redPokemonIds = Object.keys(redPokemonData);

function getRandom<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[Math.floor(Math.random() * array.length)];
}

export const Formats: FormatList = [
    {
        section: "Impulse Custom Formats",
    },
    {
        name: "[Gen 9] Impulse Random Battle",
        desc: `Randomized teams of Pok&eacute;mon with sets that are generated to be competitively viable.`,
        mod: 'gen9',
        team: 'random',
        ruleset: ['PotD', 'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod'],
    },
    {
        name: "[Gen 9] Impulse Red Team (AG Rules)",
        desc: `Randomized teams of red colored Pok&eacute;mon (with Mega Evolutions holding their stones) under standard Anything Goes rules.`,
        mod: 'gen9',
		  team: 'random',
        team: (options) => {
            const teamSize = 6;
            const team: string[] = [];
            const usedPokemon = new Set<string>();

            if (redPokemonIds.length === 0) {
                return "Error: No red Pokémon defined in redPokemonData.";
            }

            while (team.length < teamSize && usedPokemon.size < redPokemonIds.length) {
                const randomPokemonId = getRandom(redPokemonIds.filter(id => !usedPokemon.has(id)));
                if (!randomPokemonId) break;

                usedPokemon.add(randomPokemonId);
                const pokemonEntry = redPokemonData[randomPokemonId as keyof typeof redPokemonData];

                if (pokemonEntry) {
                    let baseData;
                    let itemName: string | undefined;
                    let abilityName: string | undefined;
                    let natureName: string | undefined;
                    let evsObject: { hp?: number; atk?: number; def?: number; spa?: number; spd?: number; spe?: number } | undefined;
                    let movesList: string[] | undefined;
                    let speciesName = randomPokemonId;

                    if ('base' in pokemonEntry) {
                        baseData = pokemonEntry.base;
                        itemName = baseData.item;
                        abilityName = baseData.ability;
                        natureName = baseData.nature;
                        evsObject = baseData.evs;
                        movesList = baseData.moves;
                    } else {
                        itemName = pokemonEntry.item;
                        abilityName = pokemonEntry.ability;
                        natureName = pokemonEntry.nature;
                        evsObject = pokemonEntry.evs;
                        movesList = pokemonEntry.moves;
                    }

                    if (itemName && abilityName && natureName && evsObject && movesList) {
                        team.push(`${speciesName} @ ${itemName}`);
                        team.push(`Ability: ${abilityName}`);
                        const evString = `EVs: ${evsObject.hp || 0} HP / ${evsObject.atk || 0} Atk / ${evsObject.def || 0} Def / ${evsObject.spa || 0} SpA / ${evsObject.spd || 0} SpD / ${evsObject.spe || 0} Spe`;
                        team.push(evString);
                        team.push(`${natureName} Nature`);
                        const randomMoves = [];
                        const usedMoves = new Set<string>();
                        while (randomMoves.length < 4 && movesList.length > 0) {
                            const randomIndex = Math.floor(Math.random() * movesList.length);
                            const move = movesList[randomIndex];
                            if (!usedMoves.has(move)) {
                                randomMoves.push(move);
                                usedMoves.add(move);
                            }
                        }
                        for (const move of randomMoves) {
                            team.push(`- ${move}`);
                        }
                        team.push(`Tera Type: Fire`); // Placeholder
                        if (team.length < teamSize * 8) team.push('');
                    }
                }
            }

            return team.join('\n');
        },
        ruleset: ['Species Clause', 'Sleep Clause Mod', 'Evasion Clause', 'OHKO Clause', 'Moody Clause', 'Mega Evolution'],
    },
];
