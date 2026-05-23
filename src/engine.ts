// src/engine.ts

export type SpeciesData = Record<string, any>;
export type MoveData = Record<string, any>;
export type AbilityData = Record<string, any>;
export type ItemData = Record<string, any>;
export type LearnsetData = Record<string, any>;
export type ConditionData = Record<string, any>;

export interface EngineInitData {
  species: SpeciesData;
  moves: MoveData;
  abilities: AbilityData;
  items: ItemData;

  learnsets?: LearnsetData;
  conditions?: ConditionData;
}

export interface BattlePokemon {
  species: string;
  level: number;
  types: string[];

  hp: number;
  maxHp: number;

  status?: string;

  ability?: string;
  item?: string;

  fainted: boolean;

  moves: string[];

  volatile: Record<string, any>;

  boosts: {
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
}

export interface BattleState {
  id: string;

  turn: number;

  format: string;

  teams: {
    a: BattlePokemon[];
    b: BattlePokemon[];
  };

  active: {
    a: BattlePokemon | null;
    b: BattlePokemon | null;
  };

  queue: any[];

  log: string[];

  winner: string | null;

  ended: boolean;
}

export class Engine {
  private initialized = false;

  public species: SpeciesData = {};
  public moves: MoveData = {};
  public abilities: AbilityData = {};
  public items: ItemData = {};

  public learnsets: LearnsetData = {};
  public conditions: ConditionData = {};

  // =========================
  // INIT
  // =========================

  init(data: EngineInitData) {
    this.species = data.species;
    this.moves = data.moves;
    this.abilities = data.abilities;
    this.items = data.items;

    this.learnsets = data.learnsets ?? {};
    this.conditions = data.conditions ?? {};

    this.initialized = true;
  }

  private assertReady() {
    if (!this.initialized) {
      throw new Error(
        "Engine not initialized. Call engine.init() before use."
      );
    }
  }

  // =========================
  // LOOKUPS
  // =========================

  getSpecies(id: string) {
    this.assertReady();
    return this.species[id.toLowerCase()] ?? null;
  }

  getMove(id: string) {
    this.assertReady();
    return this.moves[id.toLowerCase()] ?? null;
  }

  getAbility(id: string) {
    this.assertReady();
    return this.abilities[id.toLowerCase()] ?? null;
  }

  getItem(id: string) {
    this.assertReady();
    return this.items[id.toLowerCase()] ?? null;
  }

  // =========================
  // VALIDATION
  // =========================

  validatePokemon(mon: any): boolean {
    if (!mon) return false;

    const species = this.getSpecies(mon.species);

    if (!species) return false;

    return true;
  }

  validateTeam(team: any[]) {
    this.assertReady();

    return team.filter(mon => this.validatePokemon(mon));
  }

  // =========================
  // POKEMON FACTORY
  // =========================

  createPokemon(input: any): BattlePokemon {
    this.assertReady();

    const species = this.getSpecies(input.species);

    if (!species) {
      throw new Error(`Invalid species: ${input.species}`);
    }

    const maxHp = species.baseStats?.hp ?? 100;

    return {
      species: species.name ?? input.species,

      level: input.level ?? 100,

      types: species.types ?? ["Normal"],

      hp: maxHp,
      maxHp,

      status: "",

      ability: input.ability ?? species.abilities?.["0"] ?? "",

      item: input.item ?? "",

      fainted: false,

      moves: input.moves ?? [],

      volatile: {},

      boosts: {
        atk: 0,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0,
      },
    };
  }

  // =========================
  // BATTLE CREATION
  // =========================

  createBattle(
    teamAInput: any[],
    teamBInput: any[],
    format = "konivr"
  ): BattleState {
    this.assertReady();

    const validatedA = this.validateTeam(teamAInput);
    const validatedB = this.validateTeam(teamBInput);

    const teamA = validatedA.map(mon => this.createPokemon(mon));
    const teamB = validatedB.map(mon => this.createPokemon(mon));

    return {
      id: crypto.randomUUID(),

      turn: 1,

      format,

      teams: {
        a: teamA,
        b: teamB,
      },

      active: {
        a: teamA[0] ?? null,
        b: teamB[0] ?? null,
      },

      queue: [],

      log: [],

      winner: null,

      ended: false,
    };
  }

  // =========================
  // DAMAGE
  // =========================

  applyDamage(target: BattlePokemon, amount: number) {
    target.hp -= amount;

    if (target.hp <= 0) {
      target.hp = 0;
      target.fainted = true;
    }
  }

  heal(target: BattlePokemon, amount: number) {
    target.hp += amount;

    if (target.hp > target.maxHp) {
      target.hp = target.maxHp;
    }
  }

  // =========================
  // MOVE RESOLUTION
  // =========================

  resolveMove(moveId: string) {
    this.assertReady();

    const move = this.getMove(moveId);

    if (!move) {
      throw new Error(`Unknown move: ${moveId}`);
    }

    return {
      id: moveId,

      name: move.name ?? moveId,

      type: move.type ?? "Normal",

      category: move.category ?? "Physical",

      power: move.basePower ?? 0,

      accuracy: move.accuracy ?? 100,

      priority: move.priority ?? 0,

      target: move.target ?? "normal",
    };
  }

  useMove(
    battle: BattleState,
    user: BattlePokemon,
    target: BattlePokemon,
    moveId: string
  ) {
    const move = this.resolveMove(moveId);

    battle.log.push(
      `${user.species} used ${move.name}!`
    );

    if (move.power > 0) {
      this.applyDamage(target, move.power);
    }

    if (target.fainted) {
      battle.log.push(
        `${target.species} fainted!`
      );
    }

    this.checkWinState(battle);
  }

  // =========================
  // WIN CHECK
  // =========================

  checkWinState(battle: BattleState) {
    const aAlive = battle.teams.a.some(mon => !mon.fainted);
    const bAlive = battle.teams.b.some(mon => !mon.fainted);

    if (!aAlive) {
      battle.winner = "Player B";
      battle.ended = true;
    }

    if (!bAlive) {
      battle.winner = "Player A";
      battle.ended = true;
    }
  }

  // =========================
  // TURN ADVANCE
  // =========================

  nextTurn(battle: BattleState) {
    if (battle.ended) return;

    battle.turn += 1;
  }
}

export const engine = new Engine();
