import type {Generation} from '../data/interface';
import {getItemBoostType} from '../items';
import type {RawDesc} from '../desc';
import type {Pokemon} from '../pokemon';
import type {Move} from '../move';
import type {Field} from '../field';
import {Result} from '../result';
import {
  getModifiedStat,
  getStatDescriptionText,
  getFinalSpeed,
  getMoveEffectiveness,
  checkAirLock,
  checkForecast,
  checkIntimidate,
  checkMultihitBoost,
  handleFixedDamageMoves,
} from './util';

export function calculateADV(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field
) {
  checkAirLock(attacker, field);
  checkAirLock(defender, field);
  checkForecast(attacker, field.weather);
  checkForecast(defender, field.weather);
  checkIntimidate(gen, attacker, defender);
  checkIntimidate(gen, defender, attacker);
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

  if (field.defenderSide.isProtected) {
    desc.isProtected = true;
    return result;
  }

  if (move.name === 'Pain Split') {
    const average = Math.floor((attacker.curHP() + defender.curHP()) / 2);
    const damage = Math.max(0, defender.curHP() - average);
    result.damage = damage;
    return result;
  }

  if (move.named('Weather Ball')) {
    move.type =
      field.hasWeather('Sun') ? 'Fire'
      : field.hasWeather('Rain') ? 'Water'
      : field.hasWeather('Sand') ? 'Rock'
      : field.hasWeather('Hail') ? 'Ice'
      : 'Normal';
    move.category = move.type === 'Rock' ? 'Physical' : 'Special';
    desc.weather = field.weather;
    desc.moveType = move.type;
    desc.moveBP = move.bp;
  } else if (move.named('Brick Break')) {
    field.defenderSide.isReflect = false;
    field.defenderSide.isLightScreen = false;
  }

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

  const type1Effectiveness = getMoveEffectiveness(
    gen,
    move,
    firstDefenderType,
    field.defenderSide.isForesight
  );
  const type2Effectiveness = secondDefenderType
    ? getMoveEffectiveness(gen, move, secondDefenderType, field.defenderSide.isForesight)
    : 1;
  const typeEffectiveness = type1Effectiveness * type2Effectiveness;

  if (typeEffectiveness === 0) {
    return result;
  }

  if ((defender.hasAbility('Flash Fire') && move.hasType('Fire')) ||
      (defender.hasAbility('Levitate') && move.hasType('Ground')) ||
      (defender.hasAbility('Volt Absorb') && move.hasType('Electric')) ||
      (defender.hasAbility('Water Absorb') && move.hasType('Water')) ||
      (defender.hasAbility('Wonder Guard') && !move.hasType('???') && typeEffectiveness <= 1) ||
      (defender.hasAbility('Soundproof') && move.flags.sound)
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

  let bp = calculateBasePowerADV(attacker, defender, move, desc);

  if (bp === 0) {
    return result;
  }
  bp = calculateBPModsADV(attacker, move, desc, bp);

  const isCritical = move.isCrit && !defender.hasAbility('Battle Armor', 'Shell Armor');
  const at = calculateAttackADV(gen, attacker, defender, move, desc, isCritical);
  const df = calculateDefenseADV(gen, defender, move, desc, isCritical);

  const lv = attacker.level;
  let baseDamage = Math.floor(Math.floor((Math.floor((2 * lv) / 5 + 2) * at * bp) / df) / 50);

  baseDamage = calculateFinalModsADV(baseDamage, attacker, move, field, desc, isCritical);

  baseDamage = Math.floor(baseDamage * type1Effectiveness);
  baseDamage = Math.floor(baseDamage * type2Effectiveness);
  const damage = [];
  for (let i = 85; i <= 100; i++) {
    damage[i - 85] = Math.max(1, Math.floor((baseDamage * i) / 100));
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
      const newAt = calculateAttackADV(gen, attacker, defender, move, desc, isCritical);
      let newBp = calculateBasePowerADV(attacker, defender, move, desc);
      newBp = calculateBPModsADV(attacker, move, desc, newBp);
      let newBaseDmg = Math.floor(
        Math.floor((Math.floor((2 * lv) / 5 + 2) * newAt * newBp) / df) / 50
      );
      newBaseDmg = calculateFinalModsADV(newBaseDmg, attacker, move, field, desc, isCritical);
      newBaseDmg = Math.floor(newBaseDmg * type1Effectiveness);
      newBaseDmg = Math.floor(newBaseDmg * type2Effectiveness);

      const damage = [];
      for (let i = 85; i <= 100; i++) {
        const newFinalDamage = Math.max(1, Math.floor((newBaseDmg * i) / 100));
        damage[i - 85] = newFinalDamage;
      }
      damageMatrix[times] = damage;
    }
    result.damage = damageMatrix;
    desc.defenseBoost = origDefBoost;
    desc.attackBoost = origAtkBoost;
  }

  return result;
}

export function calculateBasePowerADV(
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  desc: RawDesc,
  hit = 1,
) {
  let bp = move.bp;
  switch (move.name) {
  case 'Flail':
  case 'Reversal':
    const p = Math.floor((48 * attacker.curHP()) / attacker.maxHP());
    bp = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
    desc.moveBP = bp;
    break;
  case 'Eruption':
  case 'Water Spout':
    bp = Math.max(1, Math.floor((150 * attacker.curHP()) / attacker.maxHP()));
    desc.moveBP = bp;
    break;
  case 'Low Kick':
    const w = defender.weightkg;
    bp = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
    desc.moveBP = bp;
    break;
  case 'Facade':
    if (attacker.hasStatus('par', 'psn', 'tox', 'brn')) {
      bp = move.bp * 2;
      desc.moveBP = bp;
    }
    break;
  case 'Nature Power':
    move.category = 'Physical';
    bp = 60;
    desc.moveName = 'Swift';
    break;
  case 'Triple Kick':
    bp = hit * 10;
    desc.moveBP = move.hits === 2 ? 30 : move.hits === 3 ? 60 : 10;
    break;
  default:
    bp = move.bp;
  }
  return bp;
}

export function calculateBPModsADV(
  attacker: Pokemon,
  move: Move,
  desc: RawDesc,
  basePower: number,
) {
  if (attacker.curHP() <= attacker.maxHP() / 3 &&
    ((attacker.hasAbility('Overgrow') && move.hasType('Grass')) ||
     (attacker.hasAbility('Blaze') && move.hasType('Fire')) ||
     (attacker.hasAbility('Torrent') && move.hasType('Water')) ||
     (attacker.hasAbility('Swarm') && move.hasType('Bug')))
  ) {
    basePower = Math.floor(basePower * 1.5);
    desc.attackerAbility = attacker.ability;
  }

  return basePower;
}

export function calculateAttackADV(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  desc: RawDesc,
  isCritical = false
) {
  const isPhysical = move.category === 'Physical';
  const attackStat = isPhysical ? 'atk' : 'spa';
  desc.attackEVs = getStatDescriptionText(gen, attacker, attackStat);

  let at = attacker.rawStats[attackStat];

  if (isPhysical && attacker.hasAbility('Huge Power', 'Pure Power')) {
    at *= 2;
    desc.attackerAbility = attacker.ability;
  }

  if (!attacker.hasItem('Sea Incense') && (move.hasType(getItemBoostType(attacker.item))) ||
    (move.named('Struggle') && getItemBoostType(attacker.item) === 'Normal')) {
    at = Math.floor(at * 1.1);
    desc.attackerItem = attacker.item;
  } else if (attacker.hasItem('Sea Incense') && move.hasType('Water')) {
    at = Math.floor(at * 1.05);
    desc.attackerItem = attacker.item;
  } else if (
    (isPhysical && attacker.hasItem('Choice Band')) ||
    (!isPhysical && attacker.hasItem('Soul Dew') && attacker.named('Latios', 'Latias'))
  ) {
    at = Math.floor(at * 1.5);
    desc.attackerItem = attacker.item;
  } else if (
    (!isPhysical && attacker.hasItem('Deep Sea Tooth') && attacker.named('Clamperl')) ||
    (!isPhysical && attacker.hasItem('Light Ball') && attacker.named('Pikachu')) ||
    (isPhysical && attacker.hasItem('Thick Club') && attacker.named('Cubone', 'Marowak'))
  ) {
    at *= 2;
    desc.attackerItem = attacker.item;
  }

  if (defender.hasAbility('Thick Fat') && (move.hasType('Fire', 'Ice'))) {
    at = Math.floor(at / 2);
    desc.defenderAbility = defender.ability;
  }

  if ((isPhysical &&
    (attacker.hasAbility('Hustle') || (attacker.hasAbility('Guts') && attacker.status))) ||
    (!isPhysical && attacker.abilityOn && attacker.hasAbility('Plus', 'Minus'))
  ) {
    at = Math.floor(at * 1.5);
    desc.attackerAbility = attacker.ability;
  }

  const attackBoost = attacker.boosts[attackStat];
  if (attackBoost > 0 || (!isCritical && attackBoost < 0)) {
    at = getModifiedStat(at, attackBoost);
    desc.attackBoost = attackBoost;
  }
  return at;
}

export function calculateDefenseADV(
  gen: Generation,
  defender: Pokemon,
  move: Move,
  desc: RawDesc,
  isCritical = false
) {
  const isPhysical = move.category === 'Physical';
  const defenseStat = isPhysical ? 'def' : 'spd';
  desc.defenseEVs = getStatDescriptionText(gen, defender, defenseStat);

  let df = defender.rawStats[defenseStat];

  if (!isPhysical && defender.hasItem('Soul Dew') && defender.named('Latios', 'Latias')) {
    df = Math.floor(df * 1.5);
    desc.defenderItem = defender.item;
  } else if (
    (!isPhysical && defender.hasItem('Deep Sea Scale') && defender.named('Clamperl')) ||
    (isPhysical && defender.hasItem('Metal Powder') && defender.named('Ditto'))
  ) {
    df *= 2;
    desc.defenderItem = defender.item;
  }

  if (isPhysical && defender.hasAbility('Marvel Scale') && defender.status) {
    df = Math.floor(df * 1.5);
    desc.defenderAbility = defender.ability;
  }

  if (move.named('Explosion', 'Self-Destruct')) {
    df = Math.floor(df / 2);
  }

  const defenseBoost = defender.boosts[defenseStat];
  if (defenseBoost < 0 || (!isCritical && defenseBoost > 0)) {
    df = getModifiedStat(df, defenseBoost);
    desc.defenseBoost = defenseBoost;
  }
  return df;
}

function calculateFinalModsADV(
  baseDamage: number,
  attacker: Pokemon,
  move: Move,
  field: Field,
  desc: RawDesc,
  isCritical = false,
) {
  const isPhysical = move.category === 'Physical';
  if (attacker.hasStatus('brn') && isPhysical && !attacker.hasAbility('Guts')) {
    baseDamage = Math.floor(baseDamage / 2);
    desc.isBurned = true;
  }

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

  if (field.gameType !== 'Singles' && move.target === 'allAdjacentFoes') {
    baseDamage = Math.floor(baseDamage / 2);
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
    baseDamage = Math.floor(baseDamage / 2);
    desc.weather = field.weather;
  }

  if (attacker.hasAbility('Flash Fire') && attacker.abilityOn && move.hasType('Fire')) {
    baseDamage = Math.floor(baseDamage * 1.5);
    desc.attackerAbility = 'Flash Fire';
  }

  baseDamage = (move.category === 'Physical' ? Math.max(1, baseDamage) : baseDamage) + 2;
  if (isCritical) {
    baseDamage *= 2;
    desc.isCritical = true;
  }

  if (move.named('Pursuit') && field.defenderSide.isSwitching === 'out') {
    baseDamage = Math.floor(baseDamage * 2);
    desc.isSwitching = 'out';
  }

  if (move.named('Weather Ball') && field.weather) {
    baseDamage *= 2;
    desc.moveBP = move.bp * 2;
  }

  if (field.attackerSide.isCharge && move.hasType('Electric')) {
    baseDamage *= 2;
    desc.isCharge = true;
  }

  if (field.attackerSide.isHelpingHand) {
    baseDamage = Math.floor(baseDamage * 1.5);
    desc.isHelpingHand = true;
  }

  if (move.hasType(...attacker.types)) {
    baseDamage = Math.floor(baseDamage * 1.5);
  }
  return baseDamage;
}
