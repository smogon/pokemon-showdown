// src/engine.ts

export type EngineData = {
  species: Record<string, any>;
  moves: Record<string, any>;
  abilities: Record<string, any>;
  items: Record<string, any>;
  conditions?: Record<string, any>;
  formats?: Record<string, any>;
  rulesets?: Record<string, any>;
  learnsets?: Record<string, any>;
};

export class Engine {
  species: Record<string, any> = {};
  moves: Record<string, any> = {};
  abilities: Record<string, any> = {};
  items: Record<string, any> = {};
  conditions: Record<string, any> = {};
  formats: Record<string, any> = {};
  rulesets: Record<string, any> = {};
  learnsets: Record<string, any> = {};

  private initialized = false;

  init(data: EngineData) {
    this.species = data.species;
    this.moves = data.moves;
    this.abilities = data.abilities;
    this.items = data.items;

    this.conditions = data.conditions ?? {};
    this.formats = data.formats ?? {};
    this.rulesets = data.rulesets ?? {};
    this.learnsets = data.learnsets ?? {};

    this.initialized = true;
  }

  assertReady() {
    if (!this.initialized) {
      throw new Error("Engine not initialized. Call engine.init(data) first.");
    }
  }

  // -------------------------
  // CORE LOOKUPS
  // -------------------------

  getSpecies(id: string) {
    this.assertReady();
    return this.species[id] ?? null;
  }

  getMove(id: string) {
    this.assertReady();
    return this.moves[id] ?? null;
  }

  getAbility(id: string) {
    this.assertReady();
    return this.abilities[id] ?? null;
  }

  getItem(id: string) {
    this.assertReady();
    return this.items[id] ?? null;
  }

  // -------------------------
  // TEAM VALIDATION (ROSTER SAFE)
  // -------------------------

  validateTeam(team: any[]) {
    this.assertReady();

    return team.filter(mon => {
      const species = this.species[mon.species];
      return Boolean(species);
    });
  }

  // -------------------------
  // BATTLE CORE (MINIMAL BUT STABLE)
  // -------------------------

  createBattle(teamA: any[], teamB: any[], format = "default") {
    this.assertReady();

    return {
      format,
      turn: 0,
      teams: {
        a: this.validateTeam(teamA),
        b: this.validateTeam(teamB),
      },
      queue: [],
      log: [],
      state: "active"
    };
  }

  // -------------------------
  // MOVE RESOLUTION (SAFE DEFAULT)
  // -------------------------

  resolveMove(moveId: string) {
    this.assertReady();

    const move = this.moves[moveId];
    if (!move) return null;

    return {
      id: moveId,
      power: move.power ?? 0,
      type: move.type ?? "normal",
      category: move.category ?? "physical",
      accuracy: move.accuracy ?? 100,
      priority: move.priority ?? 0
    };
  }
}

// singleton export (recommended for your server)
export const engine = new Engine();
