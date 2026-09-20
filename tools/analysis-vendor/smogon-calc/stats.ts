import type {Natures, Generation, TypeName, StatID, StatsTable} from './data/interface';
import {toID} from './util';

const RBY: Array<StatID | 'spc'> = ['hp', 'atk', 'def', 'spc', 'spe'];
const GSC: StatID[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const ADV: StatID[] = GSC;
const DPP: StatID[] = GSC;
const BW: StatID[] = GSC;
const XY: StatID[] = GSC;
const SM: StatID[] = GSC;
const SS: StatID[] = GSC;
const SV: StatID[] = GSC;

export const STATS: Array<Array<StatID | 'spc'> | StatID[]> =
  [[], RBY, GSC, ADV, DPP, BW, XY, SM, SS, SV];

type HPTypeName = Exclude<TypeName, 'Normal' | 'Fairy' | 'Stellar' | '???'>;

const HP_TYPES = [
  'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel',
  'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark',
];

const HP: {[type in HPTypeName]: {ivs: Partial<StatsTable>; dvs: Partial<StatsTable>}} = {
  Bug: {ivs: {atk: 30, def: 30, spd: 30}, dvs: {atk: 13, def: 13}},
  Dark: {ivs: {}, dvs: {}},
  Dragon: {ivs: {atk: 30}, dvs: {def: 14}},
  Electric: {ivs: {spa: 30}, dvs: {atk: 14}},
  Fighting: {ivs: {def: 30, spa: 30, spd: 30, spe: 30}, dvs: {atk: 12, def: 12}},
  Fire: {ivs: {atk: 30, spa: 30, spe: 30}, dvs: {atk: 14, def: 12}},
  Flying: {ivs: {hp: 30, atk: 30, def: 30, spa: 30, spd: 30}, dvs: {atk: 12, def: 13}},
  Ghost: {ivs: {def: 30, spd: 30}, dvs: {atk: 13, def: 14}},
  Grass: {ivs: {atk: 30, spa: 30}, dvs: {atk: 14, def: 14}},
  Ground: {ivs: {spa: 30, spd: 30}, dvs: {atk: 12}},
  Ice: {ivs: {atk: 30, def: 30}, dvs: {def: 13}},
  Poison: {ivs: {def: 30, spa: 30, spd: 30}, dvs: {atk: 12, def: 14}},
  Psychic: {ivs: {atk: 30, spe: 30}, dvs: {def: 12}},
  Rock: {ivs: {def: 30, spd: 30, spe: 30}, dvs: {atk: 13, def: 12}},
  Steel: {ivs: {spd: 30}, dvs: {atk: 13}},
  Water: {ivs: {atk: 30, def: 30, spa: 30}, dvs: {atk: 14, def: 13}},
};

export const Stats = new (class {
  displayStat(stat: StatID | 'spc') {
    switch (stat) {
    case 'hp':
      return 'HP';
    case 'atk':
      return 'Atk';
    case 'def':
      return 'Def';
    case 'spa':
      return 'SpA';
    case 'spd':
      return 'SpD';
    case 'spe':
      return 'Spe';
    case 'spc':
      return 'Spc';
    default:
      throw new Error(`unknown stat ${stat}`);
    }
  }

  shortForm(stat: StatID | 'spc') {
    switch (stat) {
    case 'hp':
      return 'hp';
    case 'atk':
      return 'at';
    case 'def':
      return 'df';
    case 'spa':
      return 'sa';
    case 'spd':
      return 'sd';
    case 'spe':
      return 'sp';
    case 'spc':
      return 'sl';
    }
  }

  getHPDV(ivs: {atk: number; def: number; spe: number; spc: number}) {
    return (
      (this.IVToDV(ivs.atk) % 2) * 8 +
      (this.IVToDV(ivs.def) % 2) * 4 +
      (this.IVToDV(ivs.spe) % 2) * 2 +
      (this.IVToDV(ivs.spc) % 2)
    );
  }

  IVToDV(iv: number) {
    return Math.floor(iv / 2);
  }

  DVToIV(dv: number) {
    return dv * 2;
  }

  EVToStatEXP(ev: number) {
    return (ev - 1) * (ev - 1) + 1;
  }

  StatEXPToEv(statexp: number) {
    return Math.floor((Math.sqrt(statexp - 1) + 1) / 4) * 4;
  }

  DVsToIVs(dvs: Readonly<Partial<StatsTable>>) {
    const ivs: Partial<StatsTable> = {};
    let dv: StatID;
    for (dv in dvs) {
      ivs[dv] = Stats.DVToIV(dvs[dv]!);
    }
    return ivs;
  }

  calcStat(
    gen: Generation,
    stat: StatID,
    base: number,
    iv: number,
    ev: number,
    level: number,
    nature?: string
  ) {
    if (gen.num < 0 || gen.num > 9) throw new Error(`Invalid generation ${gen.num}`);
    if (gen.num === 0) return this.calcStatChampions(gen.natures, stat, base, ev, nature);
    if (gen.num < 3) return this.calcStatRBY(stat, base, iv, ev, level);
    return this.calcStatADV(gen.natures, stat, base, iv, ev, level, nature);
  }

  calcStatChampions(
    natures: Natures,
    stat: StatID,
    base: number,
    sp: number,
    nature?: string
  ) {
    if (stat === 'hp') {
      return base === 1
        ? base
        : base + sp + 75;
    }
    let mods: [StatID?, StatID?] = [undefined, undefined];
    if (nature) {
      const nat = natures.get(toID(nature));
      mods = [nat?.plus, nat?.minus];
    }
    const n =
        mods[0] === stat && mods[1] === stat
          ? 1
          : mods[0] === stat
            ? 1.1
            : mods[1] === stat
              ? 0.9
              : 1;
    return Math.floor(n * (base + sp + 20));
  }

  calcStatADV(
    natures: Natures,
    stat: StatID,
    base: number,
    iv: number,
    ev: number,
    level: number,
    nature?: string
  ) {
    if (stat === 'hp') {
      return base === 1
        ? base
        : Math.floor(((base * 2 + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
    } else {
      let mods: [StatID?, StatID?] = [undefined, undefined];
      if (nature) {
        const nat = natures.get(toID(nature));
        mods = [nat?.plus, nat?.minus];
      }
      const n =
        mods[0] === stat && mods[1] === stat
          ? 1
          : mods[0] === stat
            ? 1.1
            : mods[1] === stat
              ? 0.9
              : 1;

      return Math.floor((Math.floor(((base * 2 + iv + Math.floor(ev / 4)) * level) / 100) + 5) * n);
    }
  }

  calcStatRBY(stat: StatID, base: number, iv: number, ev: number, level: number) {
    return this.calcStatRBYFromDV(stat, base, this.IVToDV(iv), this.EVToStatEXP(ev), level);
  }

  calcStatRBYFromDV(stat: StatID, base: number, dv: number, statexp: number, level: number) {
    if (stat === 'hp') {
      return Math.floor((((base + dv) * 2 + Math.floor((Math.sqrt(statexp - 1) + 1) / 4)) *
      level) / 100) + level + 10;
    } else {
      return Math.floor((((base + dv) * 2 + Math.floor((Math.sqrt(statexp - 1) + 1) / 4)) *
      level) / 100) + 5;
    }
  }

  getHiddenPowerIVs(gen: Generation, hpType: HPTypeName) {
    const hp = HP[hpType];
    if (!hp) return undefined;
    return gen.num === 2 ? Stats.DVsToIVs(hp.dvs) : hp.ivs;
  }

  getHiddenPower(gen: Generation, ivs: StatsTable) {
    const tr = (num: number, bits = 0) => {
      if (bits) return (num >>> 0) % (2 ** bits);
      return num >>> 0;
    };
    const stats = {hp: 31, atk: 31, def: 31, spe: 31, spa: 31, spd: 31};
    if (gen.num <= 2) {
      // Gen 2 specific Hidden Power check. IVs are still treated 0-31 so we get them 0-15
      const atkDV = tr(ivs.atk / 2);
      const defDV = tr(ivs.def / 2);
      const speDV = tr(ivs.spe / 2);
      const spcDV = tr(ivs.spa / 2);
      return {
        type: HP_TYPES[4 * (atkDV % 4) + (defDV % 4)] as TypeName,
        power: tr(
          (5 * ((spcDV >> 3) +
            (2 * (speDV >> 3)) +
            (4 * (defDV >> 3)) +
            (8 * (atkDV >> 3))) +
            (spcDV % 4)) / 2 + 31
        ),
      };
    } else {
      // Hidden Power check for Gen 3 onwards
      let hpTypeX = 0;
      let hpPowerX = 0;
      let i = 1;
      for (const s in stats) {
        hpTypeX += i * (ivs[s as StatID] % 2);
        hpPowerX += i * (tr(ivs[s as StatID] / 2) % 2);
        i *= 2;
      }
      return {
        type: HP_TYPES[tr(hpTypeX * 15 / 63)] as TypeName,
        // After Gen 6, Hidden Power is always 60 base power
        power: (gen.num && gen.num < 6) ? tr(hpPowerX * 40 / 63) + 30 : 60,
      };
    }
  }
})();
