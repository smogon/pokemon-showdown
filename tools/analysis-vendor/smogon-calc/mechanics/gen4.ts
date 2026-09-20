import type {Generation, AbilityName} from '../data/interface';
import {getItemBoostType, getNaturalGift, getFlingPower, getBerryResistType} from '../items';
import type {RawDesc} from '../desc';
import type {Field} from '../field';
import type {Move} from '../move';
import type {Pokemon} from '../pokemon';
import {Result} from '../result';
import {
  getModifiedStat,
  getStatDescriptionText,
  getFinalSpeed,
  getMoveEffectiveness,
  checkAirLock,
  checkForecast,
  checkItem,
  checkIntimidate,
  checkDownload,
  checkRawStatChanges,
  checkMultihitBoost,
  countBoosts,
  handleFixedDamageMoves,
} from './util';

export function calculateDPP(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field
) {
  // #region Initial

  checkAirLock(attacker, field);
  checkAirLock(defender, field);
  checkForecast(attacker, field.weather);
  checkForecast(defender, field.weather);
  checkItem(attacker);
  checkItem(defender);
  checkRawStatChanges(attacker, field.attackerSide.isPowerTrick);
  checkRawStatChanges(defender, field.defenderSide.isPowerTrick);
  checkIntimidate(gen, attacker, defender);
  checkIntimidate(gen, defender, attacker);
  checkDownload(attacker, defender);
  checkDownload(defender, attacker);
  attacker.stats.spe = getFinalSpeed(gen, attacker, field, field.attackerSide);
  defender.stats.spe = getFinalSpeed(gen, defender, field, field.defenderSide);

  const desc: RawDesc = {
    attackerName: attacker.name,
    moveName: move.name,
    defenderName: defender.name,
  };

  const result = new Result(gen, attacker, defender, move, field, 0, desc);

  if (move.category === 'Status' && !move.named('Nature Power')) {
    return result;
  }

  if (field.defenderSide.isProtected && !move.breaksProtect) {
    desc.isProtected = true;
    return result;
  }

  if (move.name === 'Pain Split') {
    const average = Math.floor((attacker.curHP() + defender.curHP()) / 2);
    const damage = Math.max(0, defender.curHP() - average);
    result.damage = damage;
    return result;
  }

  const defenderAbilityIgnored = defender.hasAbility(
    'Battle Armor', 'Clear Body', 'Damp', 'Dry Skin',
    'Filter', 'Flash Fire', 'Flower Gift', 'Heatproof',
    'Hyper Cutter', 'Immunity', 'Inner Focus', 'Insomnia',
    'Keen Eye', 'Leaf Guard', 'Levitate', 'Lightning Rod',
    'Limber', 'Magma Armor', 'Marvel Scale', 'Motor Drive',
    'Oblivious', 'Own Tempo', 'Sand Veil', 'Shell Armor',
    'Shield Dust', 'Simple', 'Snow Cloak', 'Solid Rock',
    'Soundproof', 'Sticky Hold', 'Storm Drain', 'Sturdy',
    'Suction Cups', 'Tangled Feet', 'Thick Fat', 'Unaware',
    'Vital Spirit', 'Volt Absorb', 'Water Absorb', 'Water Veil',
    'White Smoke', 'Wonder Guard'
  );

  if (attacker.hasAbility('Mold Breaker') && defenderAbilityIgnored) {
    defender.ability = '' as AbilityName;
    desc.attackerAbility = attacker.ability;
  }

  const isCritical = move.isCrit && !defender.hasAbility('Battle Armor', 'Shell Armor');

  if (move.named('Weather Ball')) {
    move.type =
      field.hasWeather('Sun') ? 'Fire'
      : field.hasWeather('Rain') ? 'Water'
      : field.hasWeather('Sand') ? 'Rock'
      : field.hasWeather('Hail') ? 'Ice'
      : 'Normal';
    desc.weather = field.weather;
    desc.moveType = move.type;
  } else if (move.named('Judgment') && attacker.item && attacker.item.includes('Plate')) {
    move.type = getItemBoostType(attacker.item)!;
  } else if (move.named('Natural Gift') && attacker.item?.endsWith('Berry')) {
    const gift = getNaturalGift(gen, attacker.item)!;
    move.type = gift.t;
    move.bp = gift.p;
    desc.attackerItem = attacker.item;
    desc.moveBP = move.bp;
    desc.moveType = move.type;
  } else if (move.named('Brick Break')) {
    field.defenderSide.isReflect = false;
    field.defenderSide.isLightScreen = false;
  }

  if (attacker.hasAbility('Normalize') && !move.named('Struggle')) {
    move.type = 'Normal';
    desc.attackerAbility = attacker.ability;
  }

  const isGhostRevealed = attacker.hasAbility('Scrappy') || field.defenderSide.isForesight;

  const typeEffectivenessPrecedenceRules = [
    'Normal',
    'Fire',
    'Water',
    'Electric',
    'Grass',
    'Ice',
    'Fighting',
    'Poison',
    'Ground',
    'Flying',
    'Psychic',
    'Bug',
    'Rock',
    'Ghost',
    'Dragon',
    'Dark',
    'Steel',
  ];

  let firstDefenderType = defender.types[0];
  let secondDefenderType = defender.types[1];

  if (secondDefenderType && firstDefenderType !== secondDefenderType) {
    const firstTypePrecedence = typeEffectivenessPrecedenceRules.indexOf(firstDefenderType);
    const secondTypePrecedence = typeEffectivenessPrecedenceRules.indexOf(secondDefenderType);

    if (firstTypePrecedence > secondTypePrecedence) {
      [firstDefenderType, secondDefenderType] = [secondDefenderType, firstDefenderType];
    }
  }

  let type1Effectiveness =
    getMoveEffectiveness(gen, move, firstDefenderType, isGhostRevealed, field.isGravity);
  let type2Effectiveness = secondDefenderType
    ? getMoveEffectiveness(gen, move, secondDefenderType, isGhostRevealed, field.isGravity)
    : 1;

  let typeEffectiveness = type1Effectiveness * type2Effectiveness;

  // Klutz doesn't let Iron Ball ground in generation 4
  if (typeEffectiveness === 0 && move.hasType('Ground') &&
    (defender.hasItem('Iron Ball') && !defender.hasAbility('Klutz'))) {
    if (type1Effectiveness === 0) {
      type1Effectiveness = 1;
    } else if (defender.types[1] && type2Effectiveness === 0) {
      type2Effectiveness = 1;
    }
    typeEffectiveness = type1Effectiveness * type2Effectiveness;
  }

  if (typeEffectiveness === 0) {
    return result;
  }

  const ignoresWonderGuard = move.hasType('???') || move.named('Fire Fang');
  if ((!ignoresWonderGuard && defender.hasAbility('Wonder Guard') && typeEffectiveness <= 1) ||
      (move.hasType('Fire') && defender.hasAbility('Flash Fire')) ||
      (move.hasType('Water') && defender.hasAbility('Dry Skin', 'Water Absorb')) ||
      (move.hasType('Electric') && defender.hasAbility('Motor Drive', 'Volt Absorb')) ||
      (move.hasType('Ground') && !field.isGravity &&
        !defender.hasItem('Iron Ball') && defender.hasAbility('Levitate')) ||
      (move.flags.sound && defender.hasAbility('Soundproof'))
  ) {
    desc.defenderAbility = defender.ability;
    return result;
  }

  desc.HPEVs = getStatDescriptionText(gen, defender, 'hp');

  const fixedDamage = handleFixedDamageMoves(attacker, move);
  if (fixedDamage) {
    result.damage = fixedDamage;
    return result;
  }

  if (move.hits > 1) {
    desc.hits = move.hits;
  }

  const isPhysical = move.category === 'Physical';

  // #endregion
  // #region Base Power

  let basePower = calculateBasePowerDPP(gen, attacker, defender, move, field, desc);
  if (basePower === 0) {
    return result;
  }
  basePower = calculateBPModsDPP(attacker, defender, move, field, desc, basePower);

  // #endregion
  // #region (Special) Attack
  const attack = calculateAttackDPP(gen, attacker, defender, move, field, desc, isCritical);

  // #endregion

  // #region (Special) Defense
  const defense = calculateDefenseDPP(gen, attacker, defender, move, field, desc, isCritical);

  // #endregion
  // #region Damage

  let baseDamage = Math.floor(
    Math.floor((Math.floor((2 * attacker.level) / 5 + 2) * basePower * attack) / 50) / defense
  );

  if (attacker.hasStatus('brn') && isPhysical && !attacker.hasAbility('Guts')) {
    baseDamage = Math.floor(baseDamage * 0.5);
    desc.isBurned = true;
  }

  baseDamage = calculateFinalModsDPP(baseDamage, attacker, move, field, desc, isCritical);

  // the random factor is applied between the LO mod and the STAB mod, so don't apply anything
  // below this until we're inside the loop
  let stabMod = 1;
  if (move.hasType(...attacker.types)) {
    if (attacker.hasAbility('Adaptability')) {
      stabMod = 2;
      desc.attackerAbility = attacker.ability;
    } else {
      stabMod = 1.5;
    }
  }

  let filterMod = 1;
  if (defender.hasAbility('Filter', 'Solid Rock') && typeEffectiveness > 1) {
    filterMod = 0.75;
    desc.defenderAbility = defender.ability;
  }

  let metronomeMod = 1;
  if (attacker.hasItem('Metronome') && move.timesUsedWithMetronome! >= 1) {
    const timesUsedWithMetronome = Math.floor(move.timesUsedWithMetronome!);
    if (timesUsedWithMetronome <= 9) {
      metronomeMod = 1 + 0.1 * timesUsedWithMetronome;
    } else {
      metronomeMod = 2;
    }
    desc.attackerItem = attacker.item;
  }

  let ebeltMod = 1;
  if (attacker.hasItem('Expert Belt') && typeEffectiveness > 1) {
    ebeltMod = 1.2;
    desc.attackerItem = attacker.item;
  }
  let tintedMod = 1;
  if (attacker.hasAbility('Tinted Lens') && typeEffectiveness < 1) {
    tintedMod = 2;
    desc.attackerAbility = attacker.ability;
  }
  let berryMod = 1;
  if (move.hasType(getBerryResistType(defender.item)) &&
    (typeEffectiveness > 1 || move.hasType('Normal'))) {
    berryMod = 0.5;
    desc.defenderItem = defender.item;
  }

  const damage: number[] = [];
  for (let i = 0; i < 16; i++) {
    damage[i] = Math.floor((baseDamage * (85 + i)) / 100);
    damage[i] = Math.floor(damage[i] * stabMod);
    damage[i] = Math.floor(damage[i] * type1Effectiveness);
    damage[i] = Math.floor(damage[i] * type2Effectiveness);
    damage[i] = Math.floor(damage[i] * filterMod);
    damage[i] = Math.floor(damage[i] * ebeltMod);
    damage[i] = Math.floor(damage[i] * metronomeMod);
    damage[i] = Math.floor(damage[i] * tintedMod);
    damage[i] = Math.floor(damage[i] * berryMod);
    damage[i] = Math.max(1, damage[i]);
  }
  result.damage = damage;

  if (move.timesUsed! > 1 || move.hits > 1) {
    // store boosts so intermediate boosts don't show.
    const origDefBoost = desc.defenseBoost;
    const origAtkBoost = desc.attackBoost;
    let numAttacks = 1;
    if (move.dropsStats && move.timesUsed! > 1) {
      desc.moveTurns = `over ${move.timesUsed} turns`;
      numAttacks = move.timesUsed!;
    } else {
      numAttacks = move.hits;
    }
    let usedItems = [false, false];
    const damageMatrix = [damage];
    for (let times = 1; times < numAttacks; times++) {
      usedItems = checkMultihitBoost(gen, attacker, defender, move,
        field, desc, usedItems[0], usedItems[1]);
      let newBasePower = calculateBasePowerDPP(gen, attacker, defender, move, field, desc);
      newBasePower = calculateBPModsDPP(attacker, defender, move, field, desc, newBasePower);
      const newAtk = calculateAttackDPP(gen, attacker, defender, move, field, desc, isCritical);
      let baseDamage = Math.floor(
        Math.floor(
          (Math.floor((2 * attacker.level) / 5 + 2) * newBasePower * newAtk) / 50
        ) / defense
      );
      if (attacker.hasStatus('brn') && isPhysical && !attacker.hasAbility('Guts')) {
        baseDamage = Math.floor(baseDamage * 0.5);
        desc.isBurned = true;
      }
      baseDamage = calculateFinalModsDPP(baseDamage, attacker, move, field, desc, isCritical);

      const damageArray = [];
      for (let i = 0; i < 16; i++) {
        let newFinalDamage = 0;
        newFinalDamage = Math.floor((baseDamage * (85 + i)) / 100);
        newFinalDamage = Math.floor(newFinalDamage * stabMod);
        newFinalDamage = Math.floor(newFinalDamage * type1Effectiveness);
        newFinalDamage = Math.floor(newFinalDamage * type2Effectiveness);
        newFinalDamage = Math.floor(newFinalDamage * filterMod);
        newFinalDamage = Math.floor(newFinalDamage * ebeltMod);
        newFinalDamage = Math.floor(newFinalDamage * metronomeMod);
        newFinalDamage = Math.floor(newFinalDamage * tintedMod);
        newFinalDamage = Math.max(1, newFinalDamage);
        damageArray[i] = newFinalDamage;
      }
      damageMatrix[times] = damageArray;
    }
    result.damage = damageMatrix;
    desc.defenseBoost = origDefBoost;
    desc.attackBoost = origAtkBoost;
  }

  // #endregion

  return result;
}

export function calculateBasePowerDPP(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  desc: RawDesc,
  hit = 1,
) {
  let basePower = move.bp;
  const turnOrder = attacker.stats.spe > defender.stats.spe ? 'first' : 'last';
  switch (move.name) {
  case 'Brine':
    if (defender.curHP() <= defender.maxHP() / 2) {
      basePower *= 2;
      desc.moveBP = basePower;
    }
    break;
  case 'Eruption':
  case 'Water Spout':
    basePower = Math.max(1, Math.floor((basePower * attacker.curHP()) / attacker.maxHP()));
    desc.moveBP = basePower;
    break;
  case 'Facade':
    if (attacker.hasStatus('par', 'psn', 'tox', 'brn')) {
      basePower = move.bp * 2;
      desc.moveBP = basePower;
    }
    break;
  case 'Flail':
  case 'Reversal':
    const p = Math.floor((64 * attacker.curHP()) / attacker.maxHP());
    basePower = p <= 1 ? 200 : p <= 5 ? 150 : p <= 12 ? 100 : p <= 21 ? 80 : p <= 42 ? 40 : 20;
    desc.moveBP = basePower;
    break;
  case 'Fling':
    basePower = getFlingPower(attacker.item, gen.num);
    desc.moveBP = basePower;
    desc.attackerItem = attacker.item;
    break;
  case 'Grass Knot':
  case 'Low Kick':
    const w = defender.weightkg;
    basePower = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
    desc.moveBP = basePower;
    break;
  case 'Gyro Ball':
    basePower = Math.min(150, Math.floor((25 * defender.stats.spe) / attacker.stats.spe));
    desc.moveBP = basePower;
    break;
  case 'Payback':
    if (turnOrder !== 'first') {
      basePower *= 2;
      desc.moveBP = basePower;
    }
    break;
  case 'Punishment':
    basePower = Math.min(200, 60 + 20 * countBoosts(gen, defender.boosts));
    desc.moveBP = basePower;
    break;
  case 'Pursuit':
    const switching = field.defenderSide.isSwitching === 'out';
    basePower = move.bp * (switching ? 2 : 1);
    if (switching) desc.isSwitching = 'out';
    desc.moveBP = basePower;
    break;
  case 'Wake-Up Slap':
    if (defender.hasStatus('slp')) {
      basePower *= 2;
      desc.moveBP = basePower;
    }
    break;
  case 'Nature Power':
    move.category = 'Special';
    move.secondaries = true;
    basePower = 80;
    desc.moveName = 'Tri Attack';
    break;
  case 'Crush Grip':
  case 'Wring Out':
    basePower = Math.floor((defender.curHP() * 120) / defender.maxHP()) + 1;
    desc.moveBP = basePower;
    break;
  case 'Triple Kick':
    basePower = hit * 10;
    desc.moveBP = move.hits === 2 ? 30 : move.hits === 3 ? 60 : 10;
    break;
  case 'Weather Ball':
    basePower = move.bp * (field.weather ? 2 : 1);
    desc.moveBP = basePower;
    break;
  default:
    basePower = move.bp;
  }
  return basePower;
}

export function calculateBPModsDPP(
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  desc: RawDesc,
  basePower: number,
) {
  if (field.attackerSide.isHelpingHand) {
    basePower = Math.floor(basePower * 1.5);
    desc.isHelpingHand = true;
  }

  if (field.attackerSide.isCharge && move.hasType('Electric')) {
    basePower = Math.floor(basePower * 2);
    desc.isCharge = true;
  }

  if (attacker.hasAbility('Technician') && basePower <= 60) {
    basePower = Math.floor(basePower * 1.5);
    desc.attackerAbility = attacker.ability;
  }

  const isPhysical = move.category === 'Physical';
  if ((attacker.hasItem('Muscle Band') && isPhysical) ||
      (attacker.hasItem('Wise Glasses') && !isPhysical)) {
    basePower = Math.floor(basePower * 1.1);
    desc.attackerItem = attacker.item;
  } else if (move.hasType(getItemBoostType(attacker.item)) ||
    (attacker.hasItem('Adamant Orb') &&
     attacker.named('Dialga') &&
     move.hasType('Steel', 'Dragon')) ||
    (attacker.hasItem('Lustrous Orb') &&
     attacker.named('Palkia') &&
     move.hasType('Water', 'Dragon')) ||
    (attacker.hasItem('Griseous Orb') &&
     attacker.named('Giratina-Origin') &&
     move.hasType('Ghost', 'Dragon')) ||
    (move.named('Struggle') && getItemBoostType(attacker.item) === 'Normal')
  ) {
    basePower = Math.floor(basePower * 1.2);
    desc.attackerItem = attacker.item;
  }

  if ((attacker.hasAbility('Reckless') && (move.recoil || move.hasCrashDamage)) ||
      (attacker.hasAbility('Iron Fist') && move.flags.punch)) {
    basePower = Math.floor(basePower * 1.2);
    desc.attackerAbility = attacker.ability;
  } else if ((attacker.curHP() <= attacker.maxHP() / 3 &&
    ((attacker.hasAbility('Overgrow') && move.hasType('Grass')) ||
      (attacker.hasAbility('Blaze') && move.hasType('Fire')) ||
      (attacker.hasAbility('Torrent') && move.hasType('Water')) ||
      (attacker.hasAbility('Swarm') && move.hasType('Bug'))))
  ) {
    basePower = Math.floor(basePower * 1.5);
    desc.attackerAbility = attacker.ability;
  }

  if ((defender.hasAbility('Heatproof') && move.hasType('Fire')) ||
      (defender.hasAbility('Thick Fat') && (move.hasType('Fire', 'Ice')))) {
    basePower = Math.floor(basePower * 0.5);
    desc.defenderAbility = defender.ability;
  } else if (defender.hasAbility('Dry Skin') && move.hasType('Fire')) {
    basePower = Math.floor(basePower * 1.25);
    desc.defenderAbility = defender.ability;
  }

  if (attacker.hasAbility('Rivalry') && ![attacker.gender, defender.gender].includes('N')) {
    if (attacker.gender === defender.gender) {
      basePower = Math.floor(basePower * 1.25);
      desc.rivalry = 'buffed';
    } else {
      basePower = Math.floor(basePower * 0.75);
      desc.rivalry = 'nerfed';
    }
    desc.attackerAbility = attacker.ability;
  }

  return basePower;
}

export function calculateAttackDPP(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  desc: RawDesc,
  isCritical = false
) {
  const isPhysical = move.category === 'Physical';
  const attackStat = isPhysical ? 'atk' : 'spa';
  desc.attackEVs =
    getStatDescriptionText(gen, attacker, attackStat, field.attackerSide.isPowerTrick);
  if (field.attackerSide.isPowerTrick && isPhysical) {
    desc.isPowerTrickAttacker = true;
  }
  let attack = attacker.rawStats[attackStat];
  const attackBoost = attacker.boosts[attackStat];

  if (defender.hasAbility('Unaware')) {
    desc.defenderAbility = defender.ability;
  } else if (attacker.hasAbility('Simple')) {
    attack = getSimpleModifiedStat(attack, attackBoost);
    desc.attackerAbility = attacker.ability;
    desc.attackBoost = attackBoost;
  } else if (attackBoost > 0 || (!isCritical && attackBoost < 0)) {
    attack = getModifiedStat(attack, attackBoost);
    desc.attackBoost = attackBoost;
  }

  if (isPhysical && attacker.hasAbility('Pure Power', 'Huge Power')) {
    attack *= 2;
    desc.attackerAbility = attacker.ability;
  } else if (field.hasWeather('Sun') &&
    (attacker.hasAbility(isPhysical ? 'Flower Gift' : 'Solar Power'))
  ) {
    attack = Math.floor(attack * 1.5);
    desc.attackerAbility = attacker.ability;
    desc.weather = field.weather;
  } else if (
    (isPhysical &&
      (attacker.hasAbility('Hustle') || (attacker.hasAbility('Guts') && attacker.status)) ||
    (!isPhysical && attacker.abilityOn && attacker.hasAbility('Plus', 'Minus')))
  ) {
    attack = Math.floor(attack * 1.5);
    desc.attackerAbility = attacker.ability;
  } else if (isPhysical && attacker.hasAbility('Slow Start') && attacker.abilityOn) {
    attack = Math.floor(attack / 2);
    desc.attackerAbility = attacker.ability;
  }

  if (field.attackerSide.isFlowerGift && !attacker.hasAbility('Flower Gift') &&
    field.hasWeather('Sun') && isPhysical) {
    attack = Math.floor(attack * 1.5);
    desc.weather = field.weather;
    desc.isFlowerGiftAttacker = true;
  }

  if ((isPhysical ? attacker.hasItem('Choice Band') : attacker.hasItem('Choice Specs')) ||
      (!isPhysical && attacker.hasItem('Soul Dew') && attacker.named('Latios', 'Latias'))) {
    attack = Math.floor(attack * 1.5);
    desc.attackerItem = attacker.item;
  } else if (
    (attacker.hasItem('Light Ball') && attacker.named('Pikachu')) ||
    (attacker.hasItem('Thick Club') && attacker.named('Cubone', 'Marowak') && isPhysical) ||
    (attacker.hasItem('Deep Sea Tooth') && attacker.named('Clamperl') && !isPhysical)
  ) {
    attack *= 2;
    desc.attackerItem = attacker.item;
  }
  return attack;
}

export function calculateDefenseDPP(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  desc: RawDesc,
  isCritical = false
) {
  const isPhysical = move.category === 'Physical';
  const defenseStat = isPhysical ? 'def' : 'spd';
  desc.defenseEVs =
    getStatDescriptionText(gen, defender, defenseStat, field.defenderSide.isPowerTrick);
  let defense = defender.rawStats[defenseStat];
  if (field.defenderSide.isPowerTrick && isPhysical) {
    desc.isPowerTrickDefender = true;
  }
  const defenseBoost = defender.boosts[defenseStat];

  if (attacker.hasAbility('Unaware')) {
    desc.attackerAbility = attacker.ability;
  } else if (defender.hasAbility('Simple')) {
    defense = getSimpleModifiedStat(defense, defenseBoost);
    desc.defenderAbility = defender.ability;
    desc.defenseBoost = defenseBoost;
  } else if (defenseBoost < 0 || (!isCritical && defenseBoost > 0)) {
    defense = getModifiedStat(defense, defenseBoost);
    desc.defenseBoost = defenseBoost;
  }

  if (defender.hasAbility('Marvel Scale') && defender.status && isPhysical) {
    defense = Math.floor(defense * 1.5);
    desc.defenderAbility = defender.ability;
  } else if (defender.hasAbility('Flower Gift') && field.hasWeather('Sun') && !isPhysical) {
    defense = Math.floor(defense * 1.5);
    desc.defenderAbility = defender.ability;
    desc.weather = field.weather;
  } else if (field.defenderSide.isFlowerGift && field.hasWeather('Sun') && !isPhysical) {
    defense = Math.floor(defense * 1.5);
    desc.weather = field.weather;
    desc.isFlowerGiftDefender = true;
  }

  if (defender.hasItem('Soul Dew') && defender.named('Latios', 'Latias') && !isPhysical) {
    defense = Math.floor(defense * 1.5);
    desc.defenderItem = defender.item;
  } else if (
    (defender.hasItem('Deep Sea Scale') && defender.named('Clamperl') && !isPhysical) ||
    (defender.hasItem('Metal Powder') && defender.named('Ditto') && isPhysical)
  ) {
    defense *= 2;
    desc.defenderItem = defender.item;
  }

  if (field.hasWeather('Sand') && defender.hasType('Rock') && !isPhysical) {
    defense = Math.floor(defense * 1.5);
    desc.weather = field.weather;
  }

  if (move.named('Explosion') || move.named('Self-Destruct')) {
    defense = Math.floor(defense * 0.5);
  }

  if (defense < 1) {
    defense = 1;
  }
  return defense;
}

function calculateFinalModsDPP(
  baseDamage: number,
  attacker: Pokemon,
  move: Move,
  field: Field,
  desc: RawDesc,
  isCritical = false,
) {
  const isPhysical = move.category === 'Physical';
  if (!isCritical) {
    const screenMultiplier = field.gameType !== 'Singles' ? 2 / 3 : 1 / 2;
    if (isPhysical && field.defenderSide.isReflect) {
      baseDamage = Math.floor(baseDamage * screenMultiplier);
      desc.isReflect = true;
    } else if (!isPhysical && field.defenderSide.isLightScreen) {
      baseDamage = Math.floor(baseDamage * screenMultiplier);
      desc.isLightScreen = true;
    }
  }

  if (field.gameType !== 'Singles' &&
      ['allAdjacent', 'allAdjacentFoes'].includes(move.target)) {
    baseDamage = Math.floor((baseDamage * 3) / 4);
  }

  if ((field.hasWeather('Sun') && move.hasType('Fire')) ||
      (field.hasWeather('Rain') && move.hasType('Water'))) {
    baseDamage = Math.floor(baseDamage * 1.5);
    desc.weather = field.weather;
  } else if (
    (field.hasWeather('Sun') && move.hasType('Water')) ||
    (field.hasWeather('Rain') && move.hasType('Fire')) ||
    (move.named('Solar Beam') && field.hasWeather('Rain', 'Sand', 'Hail'))
  ) {
    baseDamage = Math.floor(baseDamage * 0.5);
    desc.weather = field.weather;
  }

  if (attacker.hasAbility('Flash Fire') && attacker.abilityOn && move.hasType('Fire')) {
    baseDamage = Math.floor(baseDamage * 1.5);
    desc.attackerAbility = 'Flash Fire';
  }

  baseDamage += 2;

  if (isCritical) {
    if (attacker.hasAbility('Sniper')) {
      baseDamage *= 3;
      desc.attackerAbility = attacker.ability;
    } else {
      baseDamage *= 2;
    }
    desc.isCritical = isCritical;
  }

  if (attacker.hasItem('Life Orb')) {
    baseDamage = Math.floor(baseDamage * 1.3);
    desc.attackerItem = attacker.item;
  }

  return baseDamage;
}

function getSimpleModifiedStat(stat: number, mod: number) {
  const simpleMod = Math.min(6, Math.max(-6, mod * 2));
  return simpleMod > 0
    ? Math.floor((stat * (2 + simpleMod)) / 2)
    : simpleMod < 0 ? Math.floor((stat * 2) / (2 - simpleMod)) : stat;
}
