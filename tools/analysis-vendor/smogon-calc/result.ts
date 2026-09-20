import {type RawDesc, display, displayMove, getRecovery, getRecoil, getKOChance} from './desc';
import type {Generation} from './data/interface';
import type {Field} from './field';
import type {Move} from './move';
import type {Pokemon} from './pokemon';

export type Damage = number | number[] | [number, number] | number[][];

export class Result {
  gen: Generation;
  attacker: Pokemon;
  defender: Pokemon;
  move: Move;
  field: Field;
  damage: number | number[] | number[][];
  rawDesc: RawDesc;

  constructor(
    gen: Generation,
    attacker: Pokemon,
    defender: Pokemon,
    move: Move,
    field: Field,
    damage: Damage,
    rawDesc: RawDesc,
  ) {
    this.gen = gen;
    this.attacker = attacker;
    this.defender = defender;
    this.move = move;
    this.field = field;
    this.damage = damage;
    this.rawDesc = rawDesc;
  }

  /* get */ desc() {
    return this.fullDesc();
  }

  range(): [number, number] {
    const [min, max] = damageRange(this.damage);
    return [min, max];
  }

  fullDesc(notation = '%', err = true) {
    return display(
      this.gen,
      this.attacker,
      this.defender,
      this.move,
      this.field,
      this.damage,
      this.rawDesc,
      notation,
      err
    );
  }

  moveDesc(notation = '%') {
    return displayMove(this.gen, this.attacker, this.defender, this.move, this.damage, notation);
  }

  recovery(notation = '%') {
    return getRecovery(this.gen, this.attacker, this.defender, this.move, this.damage, notation);
  }

  recoil(notation = '%') {
    return getRecoil(this.gen, this.attacker, this.defender, this.move, this.damage, notation);
  }

  kochance(err = true) {
    return getKOChance(
      this.gen,
      this.attacker,
      this.defender,
      this.move,
      this.field,
      this.damage,
      err
    );
  }
}

export function damageRange(damage: Damage): [number, number] {
  const range = multiDamageRange(damage);
  if (typeof range[0] === 'number') return range as [number, number];
  const d = range as [number[], number[]];
  const summedRange: [number, number] = [0, 0];
  for (let i = 0; i < d[0].length; i++) {
    summedRange[0] += d[0][i];
    summedRange[1] += d[1][i];
  }
  return summedRange;
}

export function multiDamageRange(
  damage: Damage
): [number, number] | [number[], number[]] {
  // Fixed Damage
  if (typeof damage === 'number') return [damage, damage];
  // Multihit Damage
  if (typeof damage[0] !== 'number') {
    damage = damage as number[][];
    const ranges: [number[], number[]] = [[], []];
    for (const damageList of damage) {
      ranges[0].push(damageList[0]);
      ranges[1].push(damageList[damageList.length - 1]);
    }
    return ranges;
  }
  const d = damage as number[];
  // Fixed Multihit
  if (d.length < 16) {
    return [d, d];
  }
  // Standard Damage
  return [d[0], d[d.length - 1]];
}
