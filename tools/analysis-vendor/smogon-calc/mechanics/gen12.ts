import type {Generation} from '../data/interface';
import {getItemBoostType} from '../items';
import type {RawDesc} from '../desc';
import type {Field} from '../field';
import type {Move} from '../move';
import type {Pokemon} from '../pokemon';
import {Result} from '../result';
import {computeFinalStats, getMoveEffectiveness, handleFixedDamageMoves} from './util';

export function calculateRBYGSC(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field
) {
  computeFinalStats(gen, attacker, defender, field, 'atk', 'def', 'spa', 'spd', 'spe');

  const desc: RawDesc = {
    attackerName: attacker.name,
    moveName: move.name,
    defenderName: defender.name,
  };

  const result = new Result(gen, attacker, defender, move, field, 0, desc);

  if (move.category === 'Status') {
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

  // Fixed damage moves (eg. Night Shade) ignore type effectiveness in Gen 1
  if (gen.num === 1) {
    const fixedDamage = handleFixedDamageMoves(attacker, move);
    if (fixedDamage) {
      result.damage = fixedDamage;
      return result;
    }
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

  if (secondDefenderType && firstDefenderType !== secondDefenderType && gen.num === 2) {
    const firstTypePrecedence = typeEffectivenessPrecedenceRules.indexOf(firstDefenderType);
    const secondTypePrecedence = typeEffectivenessPrecedenceRules.indexOf(secondDefenderType);

    if (firstTypePrecedence > secondTypePrecedence) {
      [firstDefenderType, secondDefenderType] = [secondDefenderType, firstDefenderType];
    }
  }

  const type1Effectiveness =
    getMoveEffectiveness(gen, move, firstDefenderType, field.defenderSide.isForesight);
  const type2Effectiveness = secondDefenderType
    ? getMoveEffectiveness(gen, move, secondDefenderType, field.defenderSide.isForesight)
    : 1;
  const typeEffectiveness = type1Effectiveness * type2Effectiveness;

  if (typeEffectiveness === 0) {
    return result;
  }

  if (gen.num === 2) {
    const fixedDamage = handleFixedDamageMoves(attacker, move);
    if (fixedDamage) {
      result.damage = fixedDamage;
      return result;
    }
  }

  if (move.hits > 1) {
    desc.hits = move.hits;
  }
  // Triple Kick's damage increases by 10 after each consecutive hit (10, 20, 30), this is a hack
  if (move.name === 'Triple Kick') {
    move.bp = move.hits === 2 ? 15 : move.hits === 3 ? 20 : 10;
    desc.moveBP = move.bp;
  }

  // Flail and Reversal are variable BP and never crit
  if (move.named('Flail', 'Reversal')) {
    move.isCrit = false;
    const p = Math.floor((48 * attacker.curHP()) / attacker.maxHP());
    move.bp = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
    desc.moveBP = move.bp;
  } else if (move.named('Present') && !move.bp) {
    // Present is technically 0 BP so we default to 40 in that case, but the UI may override the
    // base power in order to simulate the scenarios where it is 80 or 120 BP.
    move.bp = 40;
  }

  if (move.bp === 0) {
    return result;
  }

  const isPhysical = move.category === 'Physical';
  const attackStat = isPhysical ? 'atk' : 'spa';
  const defenseStat = isPhysical ? 'def' : 'spd';
  let at = attacker.stats[attackStat]!;
  let df = defender.stats[defenseStat]!;

  // Whether we ignore Reflect, Light Screen, stat stages, and burns if attack is a crit differs
  // by gen - in gen 2 we also need to check that the attacker does not have stat stage advantage
  const ignoreMods = move.isCrit &&
    (gen.num === 1 ||
    (gen.num === 2 && attacker.boosts[attackStat]! <= defender.boosts[defenseStat]!));

  let lv = attacker.level;
  if (ignoreMods) {
    at = attacker.rawStats[attackStat]!;
    df = defender.rawStats[defenseStat]!;
    if (gen.num === 1) {
      lv *= 2;
      desc.isCritical = true;
    }
  } else {
    if (attacker.boosts[attackStat] !== 0) desc.attackBoost = attacker.boosts[attackStat];
    if (defender.boosts[defenseStat] !== 0) desc.defenseBoost = defender.boosts[defenseStat];
    if (isPhysical && attacker.hasStatus('brn')) {
      at = Math.floor(at / 2);
      desc.isBurned = true;
    }
  }

  if (move.named('Explosion', 'Self-Destruct')) {
    df = Math.floor(df / 2);
  }

  if (!ignoreMods) {
    if (isPhysical && field.defenderSide.isReflect) {
      df *= 2;
      desc.isReflect = true;
    } else if (!isPhysical && field.defenderSide.isLightScreen) {
      df *= 2;
      desc.isLightScreen = true;
    }
  }

  if ((attacker.named('Pikachu') && attacker.hasItem('Light Ball') && !isPhysical) ||
      (attacker.named('Cubone', 'Marowak') && attacker.hasItem('Thick Club') && isPhysical)) {
    at *= 2;
    desc.attackerItem = attacker.item;
  }

  if (at > 255 || df > 255) {
    at = Math.floor(at / 4) % 256;
    df = Math.floor(df / 4) % 256;
  }

  // Gen 2 Present has a glitched damage calculation using the secondary types of the Pokemon
  // for the Attacker's Level and Defender's Defense.
  if (move.named('Present')) {
    const lookup: {[id: string]: number} = {
      Normal: 0, Fighting: 1, Flying: 2, Poison: 3, Ground: 4, Rock: 5, Bug: 7,
      Ghost: 8, Steel: 9, '???': 19, Fire: 20, Water: 21, Grass: 22, Electric: 23,
      Psychic: 24, Ice: 25, Dragon: 26, Dark: 27,
    };

    at = 10;
    df = Math.max(lookup[attacker.types[1] ? attacker.types[1] : attacker.types[0]], 1);
    lv = Math.max(lookup[defender.types[1] ? defender.types[1] : defender.types[0]], 1);
  }

  if (defender.named('Ditto') && defender.hasItem('Metal Powder')) {
    df = Math.floor(df * 1.5);
    desc.defenderItem = defender.item;
  }

  let baseDamage = Math.floor(
    Math.floor((Math.floor((2 * lv) / 5 + 2) * Math.max(1, at) * move.bp) / Math.max(1, df)) / 50
  );

  // Gen 1 handles move.isCrit above by doubling level
  if (gen.num === 2 && move.isCrit) {
    baseDamage *= 2;
    desc.isCritical = true;
  }

  if (move.named('Pursuit') && field.defenderSide.isSwitching === 'out') {
    baseDamage = Math.floor(baseDamage * 2);
    desc.isSwitching = 'out';
  }

  // In Gen 2 and no other gens, Dragon Fang is a no-op and Dragon Scale erroneously has its effect
  const itemBoostType =
    attacker.hasItem('Dragon Fang')
      ? undefined
      : getItemBoostType(attacker.hasItem('Dragon Scale') ? 'Dragon Fang' : attacker.item);

  if (move.hasType(itemBoostType) ||
    (move.named('Struggle') && itemBoostType === 'Normal')) {
    baseDamage = Math.floor(baseDamage * 1.1);
    desc.attackerItem = attacker.item;
  }

  baseDamage = Math.min(997, baseDamage) + 2;

  if ((field.hasWeather('Sun') && move.hasType('Fire')) ||
      (field.hasWeather('Rain') && move.hasType('Water'))) {
    baseDamage = Math.floor(baseDamage * 1.5);
    desc.weather = field.weather;
  } else if (
    (field.hasWeather('Sun') && move.hasType('Water')) ||
    (field.hasWeather('Rain') && (move.hasType('Fire') || move.named('Solar Beam')))
  ) {
    baseDamage = Math.floor(baseDamage / 2);
    desc.weather = field.weather;
  }

  if (move.hasType(...attacker.types)) {
    baseDamage = Math.floor(baseDamage * 1.5);
  }

  if (gen.num === 1) {
    baseDamage = Math.floor(baseDamage * type1Effectiveness);
    baseDamage = Math.floor(baseDamage * type2Effectiveness);
  } else {
    baseDamage = Math.floor(baseDamage * typeEffectiveness);
  }

  // Flail and Reversal don't use random factor
  if (move.named('Flail', 'Reversal')) {
    result.damage = baseDamage;
    return result;
  }

  const damage = [];
  for (let i = 217; i <= 255; i++) {
    if (gen.num === 2) { // in gen 2 damage is always rounded up to 1. TODO ADD TESTS
      damage[i - 217] = Math.max(1, Math.floor((baseDamage * i) / 255));
    } else {
      if (baseDamage === 1) { // in gen 1 the random factor multiplication is skipped if damage = 1
        damage[i - 217] = 1;
      } else {
        damage[i - 217] = Math.floor((baseDamage * i) / 255);
      }
    }
  }
  result.damage = damage;

  if (move.hits > 1) {
    const damageMatrix = [damage];
    for (let times = 1; times < move.hits; times++) {
      const damage = [];
      for (let damageMultiplier = 217; damageMultiplier <= 255; damageMultiplier++) {
        let newFinalDamage = 0;
        // in gen 2 damage is always rounded up to 1. TODO ADD TESTS
        if (gen.num === 2) {
          newFinalDamage = Math.max(1, Math.floor((baseDamage * damageMultiplier) / 255));
        } else {
          // in gen 1 the random factor multiplication is skipped if damage = 1
          if (baseDamage === 1) {
            newFinalDamage = 1;
          } else {
            newFinalDamage = Math.floor((baseDamage * damageMultiplier) / 255);
          }
        }
        damage[damageMultiplier - 217] = newFinalDamage;
      }
      damageMatrix[times] = damage;
    }
    result.damage = damageMatrix;
  }

  return result;
}
