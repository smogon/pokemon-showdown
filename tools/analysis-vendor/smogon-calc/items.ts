import type {Generation, TypeName, StatID, GenerationNum} from './data/interface';
import {toID} from './util';

export const SEED_BOOSTED_STAT: {[item: string]: StatID} = {
  'Electric Seed': 'def',
  'Grassy Seed': 'def',
  'Misty Seed': 'spd',
  'Psychic Seed': 'spd',
};

export function getItemBoostType(item: string | undefined) {
  switch (item) {
  case 'Draco Plate':
  case 'Dragon Fang':
    return 'Dragon';
  case 'Dread Plate':
  case 'Black Glasses':
    return 'Dark';
  case 'Earth Plate':
  case 'Soft Sand':
    return 'Ground';
  case 'Fist Plate':
  case 'Black Belt':
    return 'Fighting';
  case 'Flame Plate':
  case 'Charcoal':
    return 'Fire';
  case 'Icicle Plate':
  case 'Never-Melt Ice':
    return 'Ice';
  case 'Insect Plate':
  case 'Silver Powder':
    return 'Bug';
  case 'Iron Plate':
  case 'Metal Coat':
    return 'Steel';
  case 'Meadow Plate':
  case 'Rose Incense':
  case 'Miracle Seed':
    return 'Grass';
  case 'Mind Plate':
  case 'Odd Incense':
  case 'Twisted Spoon':
    return 'Psychic';
  case 'Fairy Feather':
  case 'Pixie Plate':
    return 'Fairy';
  case 'Sky Plate':
  case 'Sharp Beak':
    return 'Flying';
  case 'Splash Plate':
  case 'Sea Incense':
  case 'Wave Incense':
  case 'Mystic Water':
    return 'Water';
  case 'Spooky Plate':
  case 'Spell Tag':
    return 'Ghost';
  case 'Stone Plate':
  case 'Rock Incense':
  case 'Hard Stone':
    return 'Rock';
  case 'Toxic Plate':
  case 'Poison Barb':
    return 'Poison';
  case 'Zap Plate':
  case 'Magnet':
    return 'Electric';
  case 'Silk Scarf':
  case 'Pink Bow':
  case 'Polkadot Bow':
    return 'Normal';
  default:
    return undefined;
  }
}

export function getBerryResistType(berry: string | undefined) {
  switch (berry) {
  case 'Chilan Berry':
    return 'Normal';
  case 'Occa Berry':
    return 'Fire';
  case 'Passho Berry':
    return 'Water';
  case 'Wacan Berry':
    return 'Electric';
  case 'Rindo Berry':
    return 'Grass';
  case 'Yache Berry':
    return 'Ice';
  case 'Chople Berry':
    return 'Fighting';
  case 'Kebia Berry':
    return 'Poison';
  case 'Shuca Berry':
    return 'Ground';
  case 'Coba Berry':
    return 'Flying';
  case 'Payapa Berry':
    return 'Psychic';
  case 'Tanga Berry':
    return 'Bug';
  case 'Charti Berry':
    return 'Rock';
  case 'Kasib Berry':
    return 'Ghost';
  case 'Haban Berry':
    return 'Dragon';
  case 'Colbur Berry':
    return 'Dark';
  case 'Babiri Berry':
    return 'Steel';
  case 'Roseli Berry':
    return 'Fairy';
  default:
    return undefined;
  }
}

const FLING_120 = new Set([
  'TR24',
  'TR28',
  'TR34',
  'TR39',
  'TR53',
  'TR55',
  'TR64',
  'TR66',
  'TR72',
  'TR73',
]);

const FLING_100 = new Set([
  'Hard Stone',
  'Room Service',
  'Claw Fossil',
  'Dome Fossil',
  'Helix Fossil',
  'Old Amber',
  'Root Fossil',
  'Armor Fossil',
  'Old Amber',
  'Fossilized Bird',
  'Fossilized Dino',
  'Fossilized Drake',
  'Fossilized Fish',
  'Plume Fossil',
  'Jaw Fossil',
  'Cover Fossil',
  'Sail Fossil',
  'Rare Bone',
  'Skull Fossil',
  'TR10',
  'TR31',
  'TR75',
]);

const FLING_90 = new Set([
  'Deep Sea Tooth',
  'Thick Club',
  'TR02',
  'TR04',
  'TR05',
  'TR08',
  'TR11',
  'TR22',
  'TR35',
  'TR42',
  'TR45',
  'TR50',
  'TR61',
  'TR65',
  'TR67',
  'TR86',
  'TR90',
  'TR96',
]);

const FLING_85 = new Set(['TR01', 'TR41', 'TR62', 'TR93', 'TR97', 'TR98']);

const FLING_80 = new Set([
  'Assault Vest',
  'Blunder Policy',
  'Chipped Pot',
  'Cracked Pot',
  'Heavy-Duty Boots',
  'Weakness Policy',
  'Quick Claw',
  'Dawn Stone',
  'Dusk Stone',
  'Electirizer',
  'Magmarizer',
  'Oval Stone',
  'Protector',
  'Sachet',
  'Whipped Dream',
  'Razor Claw',
  'Shiny Stone',
  'TR16',
  'TR18',
  'TR19',
  'TR25',
  'TR32',
  'TR33',
  'TR47',
  'TR56',
  'TR57',
  'TR58',
  'TR59',
  'TR60',
  'TR63',
  'TR69',
  'TR70',
  'TR74',
  'TR84',
  'TR87',
  'TR92',
  'TR95',
  'TR99',
]);

const FLING_70 = new Set([
  'Poison Barb',
  'Dragon Fang',
  'Power Anklet',
  'Power Band',
  'Power Belt',
  'Power Bracer',
  'Power Lens',
  'Power Weight',
]);

const FLING_60 = new Set([
  'Adamant Orb',
  'Damp Rock',
  'Heat Rock',
  'Leek',
  'Lustrous Orb',
  'Macho Brace',
  'Rocky Helmet',
  'Stick',
  'Utility Umbrella',
  'Terrain Extender',
]);
const FLING_30 = new Set([
  'Absorb Bulb',
  'Black Belt',
  'Black Sludge',
  'Black Glasses',
  'Cell Battery',
  'Charcoal',
  'Deep Sea Scale',
  'Flame Orb',
  'King\'s Rock',
  'Life Orb',
  'Light Ball',
  'Light Clay',
  'Magnet',
  'Metal Coat',
  'Miracle Seed',
  'Mystic Water',
  'Never-Melt Ice',
  'Razor Fang',
  'Scope Lens',
  'Soul Dew',
  'Spell Tag',
  'Sweet Apple',
  'Tart Apple',
  'Throat Spray',
  'Toxic Orb',
  'Twisted Spoon',
  'Dragon Scale',
  'Energy Powder',
  'Fire Stone',
  'Leaf Stone',
  'Moon Stone',
  'Sun Stone',
  'Thunder Stone',
  'Up-Grade',
  'Water Stone',
  'Berry Juice',
  'Black Sludge',
  'Prism Scale',
  'Ice Stone',
  'Gold Bottle Cap',
  'Luminous Moss',
  'Eject Button',
  'Snowball',
  'Bottle Cap',
]);
const FLING_10 = new Set([
  'Air Balloon',
  'Berry Sweet',
  'Choice Band',
  'Choice Scarf',
  'Choice Specs',
  'Clover Sweet',
  'Destiny Knot',
  'Electric Seed',
  'Expert Belt',
  'Flower Sweet',
  'Focus Band',
  'Focus Sash',
  'Full Incense',
  'Grassy Seed',
  'Lagging Tail',
  'Lax Incense',
  'Leftovers',
  'Love Sweet',
  'Mental Herb',
  'Metal Powder',
  'Mint Berry',
  'Miracle Berry',
  'Misty Seed',
  'Muscle Band',
  'Power Herb',
  'Psychic Seed',
  'Odd Incense',
  'Quick Powder',
  'Reaper Cloth',
  'Red Card',
  'Ribbon Sweet',
  'Ring Target',
  'Rock Incense',
  'Rose Incense',
  'Sea Incense',
  'Shed Shell',
  'Silk Scarf',
  'Silver Powder',
  'Smooth Rock',
  'Soft Sand',
  'Soothe Bell',
  'Star Sweet',
  'Strawberry Sweet',
  'Wave Incense',
  'White Herb',
  'Wide Lens',
  'Wise Glasses',
  'Zoom Lens',
  'Silver Powder',
  'Power Herb',
  'TR00',
  'TR07',
  'TR12',
  'TR13',
  'TR14',
  'TR17',
  'TR20',
  'TR21',
  'TR23',
  'TR26',
  'TR27',
  'TR29',
  'TR30',
  'TR37',
  'TR38',
  'TR40',
  'TR44',
  'TR46',
  'TR48',
  'TR49',
  'TR51',
  'TR52',
  'TR54',
  'TR68',
  'TR76',
  'TR77',
  'TR79',
  'TR80',
  'TR83',
  'TR85',
  'TR88',
  'TR91',
]);

// TODO: move this data to the data files instead.
export function getFlingPower(item?: string, gen: GenerationNum = 9) {
  if (!item) return 0;
  if (item === 'Big Nugget' && gen <= 7) return 30;
  if (['Big Nugget', 'Iron Ball', 'TR43', 'TR71'].includes(item)) return 130;
  if (FLING_120.has(item)) return 85;
  if (['TR03', 'TR06', 'TR09', 'TR15', 'TR89'].includes(item)) return 110;
  if (FLING_100.has(item)) return 100;
  if (['TR36', 'TR78', 'TR81', 'TR94'].includes(item)) return 95;
  if (item.includes('Plate') || FLING_90.has(item)) return 90;
  if (FLING_85.has(item)) return 85;
  if (FLING_80.has(item)) return 80;
  if (FLING_70.has(item)) return 70;
  if (FLING_60.has(item)) return 60;
  if (['Eject Pack', 'Sharp Beak', 'Dubious Disc'].includes(item)) return 50;
  if (['Icy Rock', 'Eviolite', 'Lucky Punch'].includes(item)) return 40;
  if (FLING_30.has(item)) return 30;
  if (['TR82', 'Pretty Feather'].includes(item)) return 20;
  if (item.includes('Berry') || FLING_10.has(item)) return 10;
  return 0;
}

export function getNaturalGift(gen: Generation, item: string) {
  const gift = gen.items.get(toID(item))?.naturalGift;
  return gift ? {t: gift.type, p: gift.basePower} : {t: 'Normal' as TypeName, p: 1};
}

export function getTechnoBlast(item: string) {
  switch (item) {
  case 'Burn Drive':
    return 'Fire';
  case 'Chill Drive':
    return 'Ice';
  case 'Douse Drive':
    return 'Water';
  case 'Shock Drive':
    return 'Electric';
  default:
    return undefined;
  }
}

export function getMultiAttack(item: string) {
  if (item.includes('Memory')) {
    return item.substring(0, item.indexOf(' ')) as TypeName;
  }
  return undefined;
}
