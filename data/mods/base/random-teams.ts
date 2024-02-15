import { Dex, toID } from "../../../sim/dex";
import { Utils } from "../../../lib";
import { PRNG, PRNGSeed } from "../../../sim/prng";
import { RuleTable } from "../../../sim/dex-formats";
import { Tags } from "./tags";
import randomSets from "./random-sets.json";
import randomDoublesSets from "./random-doubles-sets.json";

export interface TeamData {
	typeCount: { [k: string]: number };
	typeComboCount: { [k: string]: number };
	baseFormes: { [k: string]: number };
	megaCount?: number;
	zCount?: number;
	has: { [k: string]: number };
	forceResult: boolean;
	weaknesses: { [k: string]: number };
	resistances: { [k: string]: number };
	weather?: string;
	eeveeLimCount?: number;
	gigantamax?: boolean;
}
export interface BattleFactorySpecies {
	flags: { limEevee?: 1 };
	sets: BattleFactorySet[];
}
interface BattleFactorySet {
	species: string;
	item: string;
	ability: string;
	nature: string;
	moves: string[];
	evs?: Partial<StatsTable>;
	ivs?: Partial<StatsTable>;
}
export class MoveCounter extends Utils.Multiset<string> {
	damagingMoves: Set<Move>;
	ironFist: number;

	constructor() {
		super();
		this.damagingMoves = new Set();
		this.ironFist = 0;
	}

	get(key: string): number {
		return super.get(key) || 0;
	}
}

type MoveEnforcementChecker = (
	movePool: string[],
	moves: Set<string>,
	abilities: Set<string>,
	types: string[],
	counter: MoveCounter,
	species: Species,
	teamDetails: RandomTeamsTypes.TeamDetails,
	isLead: boolean,
	isDoubles: boolean,
	teraType: string,
	role: RandomTeamsTypes.Role
) => boolean;

// Moves that restore HP:
const RECOVERY_MOVES = [
	"healorder",
	"milkdrink",
	"moonlight",
	"morningsun",
	"recover",
	"roost",
	"shoreup",
	"slackoff",
	"softboiled",
	"strengthsap",
	"synthesis",
];
// Moves that drop stats:
const CONTRARY_MOVES = [
	"armorcannon",
	"closecombat",
	"leafstorm",
	"makeitrain",
	"overheat",
	"spinout",
	"superpower",
	"vcreate",
];
// Moves that boost Attack:
const PHYSICAL_SETUP = [
	"bellydrum",
	"bulkup",
	"coil",
	"curse",
	"dragondance",
	"honeclaws",
	"howl",
	"meditate",
	"poweruppunch",
	"swordsdance",
	"tidyup",
	"victorydance",
];
// Moves which boost Special Attack:
const SPECIAL_SETUP = [
	"calmmind",
	"chargebeam",
	"geomancy",
	"nastyplot",
	"quiverdance",
	"tailglow",
	"torchsong",
];
// Moves that boost Attack AND Special Attack:
const MIXED_SETUP = [
	"clangoroussoul",
	"growth",
	"happyhour",
	"holdhands",
	"noretreat",
	"shellsmash",
	"workup",
];
// Some moves that only boost Speed:
const SPEED_SETUP = ["agility", "autotomize", "rockpolish", "trailblaze"];
// Conglomerate for ease of access
const SETUP = [
	"acidarmor",
	"agility",
	"autotomize",
	"bellydrum",
	"bulkup",
	"calmmind",
	"clangoroussoul",
	"coil",
	"curse",
	"dragondance",
	"flamecharge",
	"growth",
	"honeclaws",
	"howl",
	"irondefense",
	"meditate",
	"nastyplot",
	"noretreat",
	"poweruppunch",
	"quiverdance",
	"rockpolish",
	"shellsmash",
	"shiftgear",
	"swordsdance",
	"tailglow",
	"tidyup",
	"trailblaze",
	"workup",
	"victorydance",
];
const SPEED_CONTROL = [
	"electroweb",
	"glare",
	"icywind",
	"lowsweep",
	"quash",
	"rocktomb",
	"stringshot",
	"tailwind",
	"thunderwave",
	"trickroom",
];
// Moves that shouldn't be the only STAB moves:
const NO_STAB = [
	"accelerock",
	"aquajet",
	"beakblast",
	"bounce",
	"breakingswipe",
	"bulletpunch",
	"chatter",
	"chloroblast",
	"clearsmog",
	"covet",
	"dragontail",
	"electroweb",
	"eruption",
	"explosion",
	"fakeout",
	"feint",
	"flamecharge",
	"flipturn",
	"grassyglide",
	"iceshard",
	"icywind",
	"incinerate",
	"machpunch",
	"meteorbeam",
	"mortalspin",
	"nuzzle",
	"pluck",
	"pursuit",
	"quickattack",
	"rapidspin",
	"reversal",
	"selfdestruct",
	"shadowsneak",
	"skydrop",
	"snarl",
	"strugglebug",
	"suckerpunch",
	"uturn",
	"watershuriken",
	"vacuumwave",
	"voltswitch",
	"waterspout",
];
// Hazard-setting moves
const HAZARDS = ["spikes", "stealthrock", "stickyweb", "toxicspikes"];
// Protect and its variants
const PROTECT_MOVES = ["banefulbunker", "protect", "spikyshield"];
// Moves that switch the user out
const PIVOT_MOVES = [
	"chillyreception",
	"flipturn",
	"partingshot",
	"shedtail",
	"teleport",
	"uturn",
	"voltswitch",
];

// Moves that should be paired together when possible
const MOVE_PAIRS = [
	["lightscreen", "reflect"],
	["sleeptalk", "rest"],
	["protect", "wish"],
	["leechseed", "protect"],
];

/** Pokemon who always want priority STAB, and are fine with it as its only STAB move of that type */
const PRIORITY_POKEMON = [
	"breloom",
	"brutebonnet",
	"honchkrow",
	"mimikyu",
	"scizor",
];

/** Pokemon who should never be in the lead slot */
const NO_LEAD_POKEMON = ["Zacian", "Zamazenta"];
const DOUBLES_NO_LEAD_POKEMON = [
	"Basculegion",
	"Houndstone",
	"Roaring Moon",
	"Zacian",
	"Zamazenta",
];

function sereneGraceBenefits(move: Move) {
	return (
		move.secondary?.chance &&
		move.secondary.chance > 20 &&
		move.secondary.chance < 100
	);
}

export class RandomTeams {
	dex: ModdedDex;
	gen: number;
	factoryTier: string;
	format: Format;
	prng: PRNG;
	noStab: string[];
	readonly maxTeamSize: number;
	readonly adjustLevel: number | null;
	readonly maxMoveCount: number;
	readonly forceMonotype: string | undefined;

	/**
	 * Checkers for move enforcement based on types or other factors
	 *
	 * returns true to try to force the move type, false otherwise.
	 */
	moveEnforcementCheckers: { [k: string]: MoveEnforcementChecker };

	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		format = Dex.formats.get(format);
		this.dex = Dex.forFormat(format);
		this.gen = this.dex.gen;
		this.noStab = NO_STAB;

		const ruleTable = Dex.formats.getRuleTable(format);
		this.maxTeamSize = ruleTable.maxTeamSize;
		this.adjustLevel = ruleTable.adjustLevel;
		this.maxMoveCount = ruleTable.maxMoveCount;
		const forceMonotype = ruleTable.valueRules.get("forcemonotype");
		this.forceMonotype =
			forceMonotype && this.dex.types.get(forceMonotype).exists
				? this.dex.types.get(forceMonotype).name
				: undefined;

		this.factoryTier = "";
		this.format = format;
		this.prng = prng && !Array.isArray(prng) ? prng : new PRNG(prng);

		this.moveEnforcementCheckers = {
			Bug: (movePool) =>
				movePool.includes("megahorn") || movePool.includes("xscissor"),
			Dark: (movePool, moves, abilities, types, counter) =>
				!counter.get("Dark"),
			Dragon: (movePool, moves, abilities, types, counter) =>
				!counter.get("Dragon"),
			Electric: (movePool, moves, abilities, types, counter) =>
				!counter.get("Electric"),
			Fairy: (movePool, moves, abilities, types, counter) =>
				!counter.get("Fairy"),
			Fighting: (movePool, moves, abilities, types, counter) =>
				!counter.get("Fighting"),
			Fire: (movePool, moves, abilities, types, counter, species) =>
				!counter.get("Fire"),
			Flying: (movePool, moves, abilities, types, counter) =>
				!counter.get("Flying"),
			Ghost: (movePool, moves, abilities, types, counter) =>
				!counter.get("Ghost"),
			Grass: (movePool, moves, abilities, types, counter, species) =>
				!counter.get("Grass") &&
				(movePool.includes("leafstorm") ||
					species.baseStats.atk >= 100 ||
					types.includes("Electric") ||
					abilities.has("Seed Sower")),
			Ground: (movePool, moves, abilities, types, counter) =>
				!counter.get("Ground"),
			Ice: (movePool, moves, abilities, types, counter) =>
				movePool.includes("freezedry") || !counter.get("Ice"),
			Normal: (movePool, moves, types, counter) =>
				movePool.includes("boomburst") || movePool.includes("hypervoice"),
			Poison: (movePool, moves, abilities, types, counter) => {
				if (types.includes("Ground")) return false;
				return !counter.get("Poison");
			},
			Psychic: (movePool, moves, abilities, types, counter) => {
				if (counter.get("Psychic")) return false;
				if (
					movePool.includes("calmmind") ||
					movePool.includes("psychicfangs")
				)
					return true;
				return (
					abilities.has("Psychic Surge") ||
					["Electric", "Fighting", "Fire", "Poison"].some((m) =>
						types.includes(m)
					)
				);
			},
			Rock: (movePool, moves, abilities, types, counter, species) =>
				!counter.get("Rock") && species.baseStats.atk >= 80,
			Steel: (
				movePool,
				moves,
				abilities,
				types,
				counter,
				species,
				teamDetails,
				isLead,
				isDoubles
			) =>
				!counter.get("Steel") &&
				(isDoubles ||
					species.baseStats.atk > 95 ||
					movePool.includes("gigatonhammer") ||
					movePool.includes("makeitrain")),
			Water: (movePool, moves, abilities, types, counter) =>
				!counter.get("Water") && !types.includes("Ground"),
		};
	}

	setSeed(prng?: PRNG | PRNGSeed) {
		this.prng = prng && !Array.isArray(prng) ? prng : new PRNG(prng);
	}

	getTeam(options?: PlayerOptions | null): PokemonSet[] {
		const generatorName =
			typeof this.format.team === "string" &&
			this.format.team.startsWith("random")
				? this.format.team + "Team"
				: "";
		// @ts-ignore
		return this[generatorName || "randomTeam"](options);
	}

	randomChance(numerator: number, denominator: number) {
		return this.prng.randomChance(numerator, denominator);
	}

	sample<T>(items: readonly T[]): T {
		return this.prng.sample(items);
	}

	sampleIfArray<T>(item: T | T[]): T {
		if (Array.isArray(item)) {
			return this.sample(item);
		}
		return item;
	}

	random(m?: number, n?: number) {
		return this.prng.next(m, n);
	}

	/**
	 * Remove an element from an unsorted array significantly faster
	 * than .splice
	 */
	fastPop(list: any[], index: number) {
		// If an array doesn't need to be in order, replacing the
		// element at the given index with the removed element
		// is much, much faster than using list.splice(index, 1).
		const length = list.length;
		if (index < 0 || index >= list.length) {
			// sanity check
			throw new Error(`Index ${index} out of bounds for given array`);
		}

		const element = list[index];
		list[index] = list[length - 1];
		list.pop();
		return element;
	}

	/**
	 * Remove a random element from an unsorted array and return it.
	 * Uses the battle's RNG if in a battle.
	 */
	sampleNoReplace(list: any[]) {
		const length = list.length;
		if (length === 0) return null;
		const index = this.random(length);
		return this.fastPop(list, index);
	}

	/**
	 * Removes n random elements from an unsorted array and returns them.
	 * If n is less than the array's length, randomly removes and returns all the elements
	 * in the array (so the returned array could have length < n).
	 */
	multipleSamplesNoReplace<T>(list: T[], n: number): T[] {
		const samples = [];
		while (samples.length < n && list.length) {
			samples.push(this.sampleNoReplace(list));
		}

		return samples;
	}

	/**
	 * Check if user has directly tried to ban/unban/restrict things in a custom battle.
	 * Doesn't count bans nested inside other formats/rules.
	 */
	private hasDirectCustomBanlistChanges() {
		if (
			this.format.banlist.length ||
			this.format.restricted.length ||
			this.format.unbanlist.length
		)
			return true;
		if (!this.format.customRules) return false;
		for (const rule of this.format.customRules) {
			for (const banlistOperator of ["-", "+", "*"]) {
				if (rule.startsWith(banlistOperator)) return true;
			}
		}
		return false;
	}

	/**
	 * Inform user when custom bans are unsupported in a team generator.
	 */
	protected enforceNoDirectCustomBanlistChanges() {
		if (this.hasDirectCustomBanlistChanges()) {
			throw new Error(
				`Custom bans are not currently supported in ${this.format.name}.`
			);
		}
	}

	/**
	 * Inform user when complex bans are unsupported in a team generator.
	 */
	protected enforceNoDirectComplexBans() {
		if (!this.format.customRules) return false;
		for (const rule of this.format.customRules) {
			if (rule.includes("+") && !rule.startsWith("+")) {
				throw new Error(
					`Complex bans are not currently supported in ${this.format.name}.`
				);
			}
		}
	}

	/**
	 * Validate set element pool size is sufficient to support size requirements after simple bans.
	 */
	private enforceCustomPoolSizeNoComplexBans(
		effectTypeName: string,
		basicEffectPool: BasicEffect[],
		requiredCount: number,
		requiredCountExplanation: string
	) {
		if (basicEffectPool.length >= requiredCount) return;
		throw new Error(
			`Legal ${effectTypeName} count is insufficient to support ${requiredCountExplanation} (${basicEffectPool.length} / ${requiredCount}).`
		);
	}

	queryMoves(
		moves: Set<string> | null,
		species: Species,
		teraType: string,
		abilities: Set<string> = new Set()
	): MoveCounter {
		// This is primarily a helper function for random setbuilder functions.
		const counter = new MoveCounter();
		const types = species.types;
		if (!moves?.size) return counter;

		const categories = { Physical: 0, Special: 0, Status: 0 };

		// Iterate through all moves we've chosen so far and keep track of what they do:
		for (const moveid of moves) {
			const move = this.dex.moves.get(moveid);

			const moveType = this.getMoveType(move, species, abilities, teraType);
			if (move.damage || move.damageCallback) {
				// Moves that do a set amount of damage:
				counter.add("damage");
				counter.damagingMoves.add(move);
			} else {
				// Are Physical/Special/Status moves:
				categories[move.category]++;
			}
			// Moves that have a low base power:
			if (
				moveid === "lowkick" ||
				(move.basePower && move.basePower <= 60 && moveid !== "rapidspin")
			) {
				counter.add("technician");
			}
			// Moves that hit up to 5 times:
			if (
				move.multihit &&
				Array.isArray(move.multihit) &&
				move.multihit[1] === 5
			)
				counter.add("skilllink");
			if (move.recoil || move.hasCrashDamage) counter.add("recoil");
			if (move.drain) counter.add("drain");
			// Moves which have a base power:
			if (move.basePower || move.basePowerCallback) {
				if (
					!this.noStab.includes(moveid) ||
					(PRIORITY_POKEMON.includes(species.id) && move.priority > 0)
				) {
					counter.add(moveType);
					if (types.includes(moveType)) counter.add("stab");
					if (teraType === moveType) counter.add("stabtera");
					counter.damagingMoves.add(move);
				}
				if (move.flags["bite"]) counter.add("strongjaw");
				if (move.flags["punch"]) counter.ironFist++;
				if (move.flags["sound"]) counter.add("sound");
				if (
					move.priority > 0 ||
					(moveid === "grassyglide" && abilities.has("Grassy Surge"))
				) {
					counter.add("priority");
				}
			}
			// Moves with secondary effects:
			if (move.secondary || move.hasSheerForce) {
				counter.add("sheerforce");
				if (sereneGraceBenefits(move)) {
					counter.add("serenegrace");
				}
			}
			// Moves with low accuracy:
			if (move.accuracy && move.accuracy !== true && move.accuracy < 90)
				counter.add("inaccurate");

			// Moves that change stats:
			if (RECOVERY_MOVES.includes(moveid)) counter.add("recovery");
			if (CONTRARY_MOVES.includes(moveid)) counter.add("contrary");
			if (PHYSICAL_SETUP.includes(moveid)) counter.add("physicalsetup");
			if (SPECIAL_SETUP.includes(moveid)) counter.add("specialsetup");
			if (MIXED_SETUP.includes(moveid)) counter.add("mixedsetup");
			if (SPEED_SETUP.includes(moveid)) counter.add("speedsetup");
			if (SETUP.includes(moveid)) counter.add("setup");
			if (HAZARDS.includes(moveid)) counter.add("hazards");
		}

		counter.set("Physical", Math.floor(categories["Physical"]));
		counter.set("Special", Math.floor(categories["Special"]));
		counter.set("Status", categories["Status"]);
		return counter;
	}

	cullMovePool(
		types: string[],
		moves: Set<string>,
		abilities: Set<string>,
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role
	): void {
		if (moves.size + movePool.length <= this.maxMoveCount) return;
		// If we have two unfilled moves and only one unpaired move, cull the unpaired move.
		if (moves.size === this.maxMoveCount - 2) {
			const unpairedMoves = [...movePool];
			for (const pair of MOVE_PAIRS) {
				if (movePool.includes(pair[0]) && movePool.includes(pair[1])) {
					this.fastPop(unpairedMoves, unpairedMoves.indexOf(pair[0]));
					this.fastPop(unpairedMoves, unpairedMoves.indexOf(pair[1]));
				}
			}
			if (unpairedMoves.length === 1) {
				this.fastPop(movePool, movePool.indexOf(unpairedMoves[0]));
			}
		}

		// These moves are paired, and shouldn't appear if there is not room for them both.
		if (moves.size === this.maxMoveCount - 1) {
			for (const pair of MOVE_PAIRS) {
				if (movePool.includes(pair[0]) && movePool.includes(pair[1])) {
					this.fastPop(movePool, movePool.indexOf(pair[0]));
					this.fastPop(movePool, movePool.indexOf(pair[1]));
				}
			}
		}

		// Develop additional move lists
		const statusMoves = this.dex.moves
			.all()
			.filter((move) => move.category === "Status")
			.map((move) => move.id);

		// Team-based move culls
		if (teamDetails.screens && movePool.length >= this.maxMoveCount + 2) {
			if (movePool.includes("reflect"))
				this.fastPop(movePool, movePool.indexOf("reflect"));
			if (movePool.includes("lightscreen"))
				this.fastPop(movePool, movePool.indexOf("lightscreen"));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.stickyWeb) {
			if (movePool.includes("stickyweb"))
				this.fastPop(movePool, movePool.indexOf("stickyweb"));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.stealthRock) {
			if (movePool.includes("stealthrock"))
				this.fastPop(movePool, movePool.indexOf("stealthrock"));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.defog || teamDetails.rapidSpin) {
			if (movePool.includes("defog"))
				this.fastPop(movePool, movePool.indexOf("defog"));
			if (movePool.includes("rapidspin"))
				this.fastPop(movePool, movePool.indexOf("rapidspin"));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.toxicSpikes && teamDetails.toxicSpikes >= 2) {
			if (movePool.includes("toxicspikes"))
				this.fastPop(movePool, movePool.indexOf("toxicspikes"));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.spikes && teamDetails.spikes >= 2) {
			if (movePool.includes("spikes"))
				this.fastPop(movePool, movePool.indexOf("spikes"));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}

		if (isDoubles) {
			const doublesIncompatiblePairs = [
				// In order of decreasing generalizability
				[SPEED_CONTROL, SPEED_CONTROL],
				[HAZARDS, HAZARDS],
				["rockslide", "stoneedge"],
				[SETUP, ["fakeout", "helpinghand"]],
				[PROTECT_MOVES, "wideguard"],
				[["fierydance", "fireblast"], "heatwave"],
				["dazzlinggleam", ["fleurcannon", "moonblast"]],
				["poisongas", ["toxicspikes", "willowisp"]],
				[RECOVERY_MOVES, "healpulse"],
				["lifedew", "healpulse"],
				["haze", "icywind"],
				[["muddywater", "hydropump"], "scald"],
				["disable", "encore"],
				["freezedry", "icebeam"],
				["bodyslam", "doubleedge"],
				["energyball", "leafstorm"],
				["earthpower", "sandsearstorm"],
				["boomburst", "hyperdrill"],
			];

			for (const pair of doublesIncompatiblePairs)
				this.incompatibleMoves(moves, movePool, pair[0], pair[1]);

			if (role !== "Offensive Protect")
				this.incompatibleMoves(moves, movePool, PROTECT_MOVES, [
					"flipturn",
					"uturn",
				]);
		}

		// General incompatibilities
		const incompatiblePairs = [
			// These moves don't mesh well with other aspects of the set
			[statusMoves, ["healingwish", "switcheroo", "trick"]],
			[SETUP, PIVOT_MOVES],
			[SETUP, HAZARDS],
			[SETUP, ["defog", "nuzzle", "toxic", "waterspout", "yawn", "haze"]],
			[PHYSICAL_SETUP, PHYSICAL_SETUP],
			[SPECIAL_SETUP, "thunderwave"],
			["substitute", PIVOT_MOVES],
			[SPEED_SETUP, ["aquajet", "rest", "trickroom"]],
			["curse", "rapidspin"],
			["dragondance", "dracometeor"],

			// These attacks are redundant with each other
			["psychic", "psyshock"],
			["surf", "hydropump"],
			["liquidation", "wavecrash"],
			["aquajet", "flipturn"],
			["gigadrain", "leafstorm"],
			["powerwhip", "hornleech"],
			[
				["airslash", "bravebird", "hurricane"],
				["airslash", "bravebird", "hurricane"],
			],
			["knockoff", "foulplay"],
			["doubleedge", "headbutt"],
			["fireblast", ["fierydance", "flamethrower"]],
			["lavaplume", "magmastorm"],
			["thunderpunch", "wildcharge"],
			["gunkshot", ["direclaw", "poisonjab", "sludgebomb"]],
			["aurasphere", "focusblast"],
			["closecombat", "drainpunch"],
			["bugbite", "pounce"],
			["bittermalice", "shadowball"],
			[["dragonpulse", "spacialrend"], "dracometeor"],

			// These status moves are redundant with each other
			["taunt", "disable"],
			["toxic", ["willowisp", "thunderwave"]],
			[["thunderwave", "toxic", "willowisp"], "toxicspikes"],
			["thunderwave", "yawn"],

			// This space reserved for assorted hardcodes that otherwise make little sense out of context
			// Landorus and Thundurus
			["nastyplot", ["rockslide", "knockoff"]],
			// Persian
			["switcheroo", "fakeout"],
			// Beartic
			["snowscape", "swordsdance"],
			// Magnezone
			["bodypress", "mirrorcoat"],
			// Amoonguss, though this can work well as a general rule later
			["toxic", "clearsmog"],
			// Chansey and Blissey
			["healbell", "stealthrock"],
			// Azelf and Zoroarks
			["trick", "uturn"],
		];

		for (const pair of incompatiblePairs)
			this.incompatibleMoves(moves, movePool, pair[0], pair[1]);

		if (!types.includes("Ice"))
			this.incompatibleMoves(moves, movePool, "icebeam", "icywind");

		if (!isDoubles)
			this.incompatibleMoves(
				moves,
				movePool,
				["taunt", "strengthsap"],
				"encore"
			);

		if (!types.includes("Dark") && teraType !== "Dark")
			this.incompatibleMoves(moves, movePool, "knockoff", "suckerpunch");

		// This space reserved for assorted hardcodes that otherwise make little sense out of context
		if (species.id === "luvdisc") {
			this.incompatibleMoves(
				moves,
				movePool,
				["charm", "flipturn", "icebeam"],
				["charm", "flipturn"]
			);
		}
		if (species.id === "dugtrio")
			this.incompatibleMoves(moves, movePool, statusMoves, "memento");
		if (species.id === "cyclizar")
			this.incompatibleMoves(moves, movePool, "taunt", "knockoff");
		if (species.baseSpecies === "Dudunsparce")
			this.incompatibleMoves(moves, movePool, "earthpower", "shadowball");
		if (species.id === "mesprit")
			this.incompatibleMoves(moves, movePool, "healingwish", "uturn");
	}

	// Checks for and removes incompatible moves, starting with the first move in movesA.
	incompatibleMoves(
		moves: Set<string>,
		movePool: string[],
		movesA: string | string[],
		movesB: string | string[]
	): void {
		const moveArrayA = Array.isArray(movesA) ? movesA : [movesA];
		const moveArrayB = Array.isArray(movesB) ? movesB : [movesB];
		if (moves.size + movePool.length <= this.maxMoveCount) return;
		for (const moveid1 of moves) {
			if (moveArrayB.includes(moveid1)) {
				for (const moveid2 of moveArrayA) {
					if (moveid1 !== moveid2 && movePool.includes(moveid2)) {
						this.fastPop(movePool, movePool.indexOf(moveid2));
						if (moves.size + movePool.length <= this.maxMoveCount) return;
					}
				}
			}
			if (moveArrayA.includes(moveid1)) {
				for (const moveid2 of moveArrayB) {
					if (moveid1 !== moveid2 && movePool.includes(moveid2)) {
						this.fastPop(movePool, movePool.indexOf(moveid2));
						if (moves.size + movePool.length <= this.maxMoveCount) return;
					}
				}
			}
		}
	}

	// Adds a move to the moveset, returns the MoveCounter
	addMove(
		move: string,
		moves: Set<string>,
		types: string[],
		abilities: Set<string>,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		movePool: string[],
		teraType: string,
		role: RandomTeamsTypes.Role
	): MoveCounter {
		moves.add(move);
		this.fastPop(movePool, movePool.indexOf(move));
		const counter = this.queryMoves(moves, species, teraType, abilities);
		this.cullMovePool(
			types,
			moves,
			abilities,
			counter,
			movePool,
			teamDetails,
			species,
			isLead,
			isDoubles,
			teraType,
			role
		);
		return counter;
	}

	// Returns the type of a given move for STAB/coverage enforcement purposes
	getMoveType(
		move: Move,
		species: Species,
		abilities: Set<string>,
		teraType: string
	): string {
		if (move.id === "terablast") return teraType;
		if (["judgment", "revelationdance"].includes(move.id))
			return species.types[0];

		if (
			move.name === "Raging Bull" &&
			species.name.startsWith("Tauros-Paldea")
		) {
			if (species.name.endsWith("Combat")) return "Fighting";
			if (species.name.endsWith("Blaze")) return "Fire";
			if (species.name.endsWith("Aqua")) return "Water";
		}

		if (move.name === "Ivy Cudgel" && species.name.startsWith("Ogerpon")) {
			if (species.name.endsWith("Wellspring")) return "Water";
			if (species.name.endsWith("Hearthflame")) return "Fire";
			if (species.name.endsWith("Cornerstone")) return "Rock";
		}

		const moveType = move.type;
		if (moveType === "Normal") {
			if (abilities.has("Aerilate")) return "Flying";
			if (abilities.has("Galvanize")) return "Electric";
			if (abilities.has("Pixilate")) return "Fairy";
			if (abilities.has("Refrigerate")) return "Ice";
		}
		return moveType;
	}

	// Generate random moveset for a given species, role, tera type.
	randomMoveset(
		types: string[],
		abilities: Set<string>,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		movePool: string[],
		teraType: string,
		role: RandomTeamsTypes.Role
	): Set<string> {
		const moves = new Set<string>();
		let counter = this.queryMoves(moves, species, teraType, abilities);
		this.cullMovePool(
			types,
			moves,
			abilities,
			counter,
			movePool,
			teamDetails,
			species,
			isLead,
			isDoubles,
			teraType,
			role
		);

		// If there are only four moves, add all moves and return early
		if (movePool.length <= this.maxMoveCount) {
			for (const moveid of movePool) {
				moves.add(moveid);
			}
			return moves;
		}

		const runEnforcementChecker = (checkerName: string) => {
			if (!this.moveEnforcementCheckers[checkerName]) return false;
			return this.moveEnforcementCheckers[checkerName](
				movePool,
				moves,
				abilities,
				types,
				counter,
				species,
				teamDetails,
				isLead,
				isDoubles,
				teraType,
				role
			);
		};

		if (role === "Tera Blast user") {
			counter = this.addMove(
				"terablast",
				moves,
				types,
				abilities,
				teamDetails,
				species,
				isLead,
				isDoubles,
				movePool,
				teraType,
				role
			);
		}
		// Add required move (e.g. Relic Song for Meloetta-P)
		if (species.requiredMove) {
			const move = this.dex.moves.get(species.requiredMove).id;
			counter = this.addMove(
				move,
				moves,
				types,
				abilities,
				teamDetails,
				species,
				isLead,
				isDoubles,
				movePool,
				teraType,
				role
			);
		}

		// Add other moves you really want to have, e.g. STAB, recovery, setup.

		// Enforce Facade if Guts is a possible ability
		if (movePool.includes("facade") && abilities.has("Guts")) {
			counter = this.addMove(
				"facade",
				moves,
				types,
				abilities,
				teamDetails,
				species,
				isLead,
				isDoubles,
				movePool,
				teraType,
				role
			);
		}

		// Enforce Sticky Web
		if (movePool.includes("stickyweb")) {
			counter = this.addMove(
				"stickyweb",
				moves,
				types,
				abilities,
				teamDetails,
				species,
				isLead,
				isDoubles,
				movePool,
				teraType,
				role
			);
		}

		// Enforce Revelation Dance
		if (movePool.includes("revelationdance")) {
			counter = this.addMove(
				"revelationdance",
				moves,
				types,
				abilities,
				teamDetails,
				species,
				isLead,
				isDoubles,
				movePool,
				teraType,
				role
			);
		}

		// Enforce Revival Blessing
		if (movePool.includes("revivalblessing")) {
			counter = this.addMove(
				"revivalblessing",
				moves,
				types,
				abilities,
				teamDetails,
				species,
				isLead,
				isDoubles,
				movePool,
				teraType,
				role
			);
		}

		// Enforce Salt Cure
		if (movePool.includes("saltcure")) {
			counter = this.addMove(
				"saltcure",
				moves,
				types,
				abilities,
				teamDetails,
				species,
				isLead,
				isDoubles,
				movePool,
				teraType,
				role
			);
		}

		// Enforce Trick Room on Doubles Wallbreaker
		if (movePool.includes("trickroom") && role === "Doubles Wallbreaker") {
			counter = this.addMove(
				"trickroom",
				moves,
				types,
				abilities,
				teamDetails,
				species,
				isLead,
				isDoubles,
				movePool,
				teraType,
				role
			);
		}

		// Enforce hazard removal on Bulky Support if the team doesn't already have it
		if (
			role === "Bulky Support" &&
			!teamDetails.defog &&
			!teamDetails.rapidSpin
		) {
			if (movePool.includes("rapidspin")) {
				counter = this.addMove(
					"rapidspin",
					moves,
					types,
					abilities,
					teamDetails,
					species,
					isLead,
					isDoubles,
					movePool,
					teraType,
					role
				);
			}
			if (movePool.includes("defog")) {
				counter = this.addMove(
					"defog",
					moves,
					types,
					abilities,
					teamDetails,
					species,
					isLead,
					isDoubles,
					movePool,
					teraType,
					role
				);
			}
		}

		// Enforce moves in doubles
		if (isDoubles) {
			const doublesEnforcedMoves = ["auroraveil", "mortalspin", "spore"];
			for (const moveid of doublesEnforcedMoves) {
				if (movePool.includes(moveid)) {
					counter = this.addMove(
						moveid,
						moves,
						types,
						abilities,
						teamDetails,
						species,
						isLead,
						isDoubles,
						movePool,
						teraType,
						role
					);
				}
			}
			// Enforce Fake Out on slow Pokemon
			if (movePool.includes("fakeout") && species.baseStats.spe <= 50) {
				counter = this.addMove(
					"fakeout",
					moves,
					types,
					abilities,
					teamDetails,
					species,
					isLead,
					isDoubles,
					movePool,
					teraType,
					role
				);
			}
			// Enforce Tailwind on Prankster and Gale Wings users
			if (
				movePool.includes("tailwind") &&
				(abilities.has("Prankster") || abilities.has("Gale Wings"))
			) {
				counter = this.addMove(
					"tailwind",
					moves,
					types,
					abilities,
					teamDetails,
					species,
					isLead,
					isDoubles,
					movePool,
					teraType,
					role
				);
			}
			// Enforce Thunder Wave on Prankster users as well
			if (movePool.includes("thunderwave") && abilities.has("Prankster")) {
				counter = this.addMove(
					"thunderwave",
					moves,
					types,
					abilities,
					teamDetails,
					species,
					isLead,
					isDoubles,
					movePool,
					teraType,
					role
				);
			}
		}

		// Enforce STAB priority
		if (
			[
				"Bulky Attacker",
				"Bulky Setup",
				"Wallbreaker",
				"Doubles Wallbreaker",
			].includes(role) ||
			PRIORITY_POKEMON.includes(species.id)
		) {
			const priorityMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(
					move,
					species,
					abilities,
					teraType
				);
				if (
					types.includes(moveType) &&
					(move.priority > 0 ||
						(moveid === "grassyglide" &&
							abilities.has("Grassy Surge"))) &&
					(move.basePower || move.basePowerCallback)
				) {
					priorityMoves.push(moveid);
				}
			}
			if (priorityMoves.length) {
				const moveid = this.sample(priorityMoves);
				counter = this.addMove(
					moveid,
					moves,
					types,
					abilities,
					teamDetails,
					species,
					isLead,
					isDoubles,
					movePool,
					teraType,
					role
				);
			}
		}

		// Enforce STAB
		for (const type of types) {
			// Check if a STAB move of that type should be required
			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(
					move,
					species,
					abilities,
					teraType
				);
				if (
					!this.noStab.includes(moveid) &&
					(move.basePower || move.basePowerCallback) &&
					type === moveType
				) {
					stabMoves.push(moveid);
				}
			}
			while (runEnforcementChecker(type)) {
				if (!stabMoves.length) break;
				const moveid = this.sampleNoReplace(stabMoves);
				counter = this.addMove(
					moveid,
					moves,
					types,
					abilities,
					teamDetails,
					species,
					isLead,
					isDoubles,
					movePool,
					teraType,
					role
				);
			}
		}

		// Enforce Tera STAB
		if (
			!counter.get("stabtera") &&
			!["Bulky Support", "Doubles Support"].includes(role)
		) {
			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(
					move,
					species,
					abilities,
					teraType
				);
				if (
					!this.noStab.includes(moveid) &&
					(move.basePower || move.basePowerCallback) &&
					teraType === moveType
				) {
					stabMoves.push(moveid);
				}
			}
			if (stabMoves.length) {
				const moveid = this.sample(stabMoves);
				counter = this.addMove(
					moveid,
					moves,
					types,
					abilities,
					teamDetails,
					species,
					isLead,
					isDoubles,
					movePool,
					teraType,
					role
				);
			}
		}

		// If no STAB move was added, add a STAB move
		if (!counter.get("stab")) {
			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(
					move,
					species,
					abilities,
					teraType
				);
				if (
					!this.noStab.includes(moveid) &&
					(move.basePower || move.basePowerCallback) &&
					types.includes(moveType)
				) {
					stabMoves.push(moveid);
				}
			}
			if (stabMoves.length) {
				const moveid = this.sample(stabMoves);
				counter = this.addMove(
					moveid,
					moves,
					types,
					abilities,
					teamDetails,
					species,
					isLead,
					isDoubles,
					movePool,
					teraType,
					role
				);
			}
		}

		// Enforce recovery
		if (["Bulky Support", "Bulky Attacker", "Bulky Setup"].includes(role)) {
			const recoveryMoves = movePool.filter((moveid) =>
				RECOVERY_MOVES.includes(moveid)
			);
			if (recoveryMoves.length) {
				const moveid = this.sample(recoveryMoves);
				counter = this.addMove(
					moveid,
					moves,
					types,
					abilities,
					teamDetails,
					species,
					isLead,
					isDoubles,
					movePool,
					teraType,
					role
				);
			}
		}

		// Enforce setup
		if (role.includes("Setup") || role === "Tera Blast user") {
			// First, try to add a non-Speed setup move
			const nonSpeedSetupMoves = movePool.filter(
				(moveid) => SETUP.includes(moveid) && !SPEED_SETUP.includes(moveid)
			);
			if (nonSpeedSetupMoves.length) {
				const moveid = this.sample(nonSpeedSetupMoves);
				counter = this.addMove(
					moveid,
					moves,
					types,
					abilities,
					teamDetails,
					species,
					isLead,
					isDoubles,
					movePool,
					teraType,
					role
				);
			} else {
				// No non-Speed setup moves, so add any (Speed) setup move
				const setupMoves = movePool.filter((moveid) =>
					SETUP.includes(moveid)
				);
				if (setupMoves.length) {
					const moveid = this.sample(setupMoves);
					counter = this.addMove(
						moveid,
						moves,
						types,
						abilities,
						teamDetails,
						species,
						isLead,
						isDoubles,
						movePool,
						teraType,
						role
					);
				}
			}
		}

		// Enforce redirecting moves, or Fake Out if no redirecting move
		if (role === "Doubles Support") {
			const redirectMoves = movePool.filter((moveid) =>
				["followme", "ragepowder"].includes(moveid)
			);
			if (redirectMoves.length) {
				const moveid = this.sample(redirectMoves);
				counter = this.addMove(
					moveid,
					moves,
					types,
					abilities,
					teamDetails,
					species,
					isLead,
					isDoubles,
					movePool,
					teraType,
					role
				);
			} else {
				if (movePool.includes("fakeout")) {
					counter = this.addMove(
						"fakeout",
						moves,
						types,
						abilities,
						teamDetails,
						species,
						isLead,
						isDoubles,
						movePool,
						teraType,
						role
					);
				}
			}
		}

		// Enforce Protect
		if (role.includes("Protect") || species.id === "gliscor") {
			const protectMoves = movePool.filter((moveid) =>
				PROTECT_MOVES.includes(moveid)
			);
			if (protectMoves.length) {
				const moveid = this.sample(protectMoves);
				counter = this.addMove(
					moveid,
					moves,
					types,
					abilities,
					teamDetails,
					species,
					isLead,
					isDoubles,
					movePool,
					teraType,
					role
				);
			}
		}

		// Enforce a move not on the noSTAB list
		if (!counter.damagingMoves.size) {
			// Choose an attacking move
			const attackingMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				if (!this.noStab.includes(moveid) && move.category !== "Status")
					attackingMoves.push(moveid);
			}
			if (attackingMoves.length) {
				const moveid = this.sample(attackingMoves);
				counter = this.addMove(
					moveid,
					moves,
					types,
					abilities,
					teamDetails,
					species,
					isLead,
					isDoubles,
					movePool,
					teraType,
					role
				);
			}
		}

		// Enforce coverage move
		if (
			![
				"AV Pivot",
				"Fast Support",
				"Bulky Support",
				"Bulky Protect",
				"Doubles Support",
			].includes(role)
		) {
			if (counter.damagingMoves.size === 1) {
				// Find the type of the current attacking move
				const currentAttackType = counter.damagingMoves.values().next()
					.value.type;
				// Choose an attacking move that is of different type to the current single attack
				const coverageMoves = [];
				for (const moveid of movePool) {
					const move = this.dex.moves.get(moveid);
					const moveType = this.getMoveType(
						move,
						species,
						abilities,
						teraType
					);
					if (
						!this.noStab.includes(moveid) &&
						(move.basePower || move.basePowerCallback)
					) {
						if (currentAttackType !== moveType)
							coverageMoves.push(moveid);
					}
				}
				if (coverageMoves.length) {
					const moveid = this.sample(coverageMoves);
					counter = this.addMove(
						moveid,
						moves,
						types,
						abilities,
						teamDetails,
						species,
						isLead,
						isDoubles,
						movePool,
						teraType,
						role
					);
				}
			}
		}

		// Add (moves.size < this.maxMoveCount) as a condition if moves is getting larger than 4 moves.
		// If you want moves to be favored but not required, add something like && this.randomChance(1, 2) to your condition.

		// Choose remaining moves randomly from movepool and add them to moves list:
		while (moves.size < this.maxMoveCount && movePool.length) {
			if (moves.size + movePool.length <= this.maxMoveCount) {
				for (const moveid of movePool) {
					moves.add(moveid);
				}
				break;
			}
			const moveid = this.sample(movePool);
			counter = this.addMove(
				moveid,
				moves,
				types,
				abilities,
				teamDetails,
				species,
				isLead,
				isDoubles,
				movePool,
				teraType,
				role
			);
			for (const pair of MOVE_PAIRS) {
				if (moveid === pair[0] && movePool.includes(pair[1])) {
					counter = this.addMove(
						pair[1],
						moves,
						types,
						abilities,
						teamDetails,
						species,
						isLead,
						isDoubles,
						movePool,
						teraType,
						role
					);
				}
				if (moveid === pair[1] && movePool.includes(pair[0])) {
					counter = this.addMove(
						pair[0],
						moves,
						types,
						abilities,
						teamDetails,
						species,
						isLead,
						isDoubles,
						movePool,
						teraType,
						role
					);
				}
			}
		}
		return moves;
	}

	shouldCullAbility(
		ability: string,
		types: string[],
		moves: Set<string>,
		abilities: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role
	): boolean {
		if (
			[
				"Armor Tail",
				"Battle Bond",
				"Early Bird",
				"Flare Boost",
				"Galvanize",
				"Gluttony",
				"Harvest",
				"Hydration",
				"Ice Body",
				"Immunity",
				"Marvel Scale",
				"Misty Surge",
				"Moody",
				"Own Tempo",
				"Pressure",
				"Quick Feet",
				"Rain Dish",
				"Sand Veil",
				"Sniper",
				"Snow Cloak",
				"Steadfast",
				"Steam Engine",
			].includes(ability)
		)
			return true;

		switch (ability) {
			// Abilities which are primarily useful for certain moves
			case "Contrary":
			case "Serene Grace":
			case "Skill Link":
			case "Strong Jaw":
				return !counter.get(toID(ability));
			case "Chlorophyll":
				return (
					!moves.has("sunnyday") &&
					!teamDetails.sun &&
					species.id !== "lilligant"
				);
			case "Cloud Nine":
				return species.id !== "golduck";
			case "Competitive":
				return species.id === "kilowattrel" && !isDoubles;
			case "Compound Eyes":
			case "No Guard":
				return !counter.get("inaccurate");
			case "Cursed Body":
				return abilities.has("Infiltrator");
			case "Defiant":
				return (
					!counter.get("Physical") ||
					(abilities.has("Prankster") &&
						(moves.has("thunderwave") || moves.has("taunt")))
				);
			case "Flame Body":
				return species.id === "magcargo" && moves.has("shellsmash");
			case "Flash Fire":
				return (
					[
						"Drought",
						"Flame Body",
						"Intimidate",
						"Rock Head",
						"Weak Armor",
					].some((m) => abilities.has(m)) &&
					this.dex.getEffectiveness("Fire", species) < 0
				);
			case "Guts":
				return !moves.has("facade") && !moves.has("sleeptalk");
			case "Hustle":
				// some of this is just for Delibird in singles/doubles
				return (
					counter.get("Physical") < 2 ||
					moves.has("fakeout") ||
					moves.has("rapidspin")
				);
			case "Infiltrator":
				return isDoubles && abilities.has("Clear Body");
			case "Insomnia":
				return role === "Wallbreaker";
			case "Intimidate":
				if (abilities.has("Hustle")) return true;
				if (abilities.has("Sheer Force") && !!counter.get("sheerforce"))
					return true;
				return abilities.has("Stakeout");
			case "Iron Fist":
				return !counter.ironFist;
			case "Justified":
				return !counter.get("Physical");
			case "Libero":
			case "Protean":
				return (
					role === "Offensive Protect" ||
					(species.id === "meowscarada" && role === "Fast Attacker")
				);
			case "Mold Breaker":
				return abilities.has("Sharpness") || abilities.has("Unburden");
			case "Moxie":
				return !counter.get("Physical") || moves.has("stealthrock");
			case "Natural Cure":
				return species.id === "pawmot";
			case "Neutralizing Gas":
				return !isDoubles;
			case "Overcoat":
			case "Sweet Veil":
				return types.includes("Grass");
			case "Overgrow":
				return !counter.get("Grass");
			case "Prankster":
				return !counter.get("Status");
			case "Reckless":
				return !counter.get("recoil");
			case "Regenerator":
				return species.id === "mienshao" && role === "Wallbreaker";
			case "Rock Head":
				return !counter.get("recoil");
			case "Sand Force":
			case "Sand Rush":
				return !teamDetails.sand;
			case "Sap Sipper":
				return species.id === "wyrdeer";
			case "Seed Sower":
				return role === "Bulky Support";
			case "Shed Skin":
				return species.id === "seviper" || species.id === "arbok";
			case "Sheer Force":
				const braviaryCase =
					species.id === "braviaryhisui" &&
					(role === "Wallbreaker" || role === "Bulky Protect");
				const abilitiesCase =
					abilities.has("Guts") || abilities.has("Sharpness");
				return (
					!counter.get("sheerforce") ||
					moves.has("bellydrum") ||
					braviaryCase ||
					abilitiesCase
				);
			case "Slush Rush":
				return !teamDetails.snow;
			case "Solar Power":
				return !teamDetails.sun || !counter.get("Special");
			case "Speed Boost":
				return species.id === "yanmega" && !moves.has("protect");
			case "Sticky Hold":
				return species.id === "muk";
			case "Sturdy":
				return !!counter.get("recoil");
			case "Swarm":
				return !counter.get("Bug") || !!counter.get("recovery");
			case "Swift Swim":
				return (
					abilities.has("Intimidate") ||
					(!moves.has("raindance") && !teamDetails.rain)
				);
			case "Synchronize":
				return species.id !== "umbreon" && species.id !== "rabsca";
			case "Technician":
				return (
					!counter.get("technician") ||
					abilities.has("Punk Rock") ||
					abilities.has("Fur Coat")
				);
			case "Tinted Lens":
				const hbraviaryCase =
					species.id === "braviaryhisui" &&
					(role === "Setup Sweeper" || role === "Doubles Wallbreaker");
				const yanmegaCase =
					species.id === "yanmega" && moves.has("protect");
				return yanmegaCase || hbraviaryCase || species.id === "illumise";
			case "Unaware":
				return species.id === "clefable" && role !== "Bulky Support";
			case "Unburden":
				return abilities.has("Prankster") || !counter.get("setup");
			case "Volt Absorb":
				if (abilities.has("Iron Fist") && counter.ironFist >= 2)
					return true;
				return this.dex.getEffectiveness("Electric", species) < -1;
			case "Water Absorb":
				return (
					species.id === "politoed" ||
					species.id === "quagsire" ||
					moves.has("raindance")
				);
			case "Weak Armor":
				return moves.has("shellsmash") && species.id !== "magcargo";
		}

		return false;
	}

	getAbility(
		types: string[],
		moves: Set<string>,
		abilities: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role
	): string {
		const abilityData = Array.from(abilities).map((a) =>
			this.dex.abilities.get(a)
		);
		Utils.sortBy(abilityData, (abil) => -abil.rating);

		if (abilityData.length <= 1) return abilityData[0].name;

		// Hard-code abilities here
		if (species.id === "arcaninehisui") return "Rock Head";
		if (species.id === "scovillain") return "Chlorophyll";
		if (species.id === "empoleon") return "Competitive";
		if (species.id === "chandelure") return "Flash Fire";
		if (species.id === "golemalola" && moves.has("doubleedge"))
			return "Galvanize";
		if (
			abilities.has("Guts") &&
			(moves.has("facade") ||
				moves.has("sleeptalk") ||
				species.id === "gurdurr")
		)
			return "Guts";
		if (species.id === "copperajah" && moves.has("heavyslam"))
			return "Heavy Metal";
		if (species.id === "jumpluff") return "Infiltrator";
		if (species.id === "cetitan" && (role === "Wallbreaker" || isDoubles))
			return "Sheer Force";
		if (species.id === "ribombee") return "Shield Dust";
		if (species.id === "dipplin") return "Sticky Hold";
		if (species.id === "breloom") return "Technician";
		if (species.id === "shiftry" && moves.has("tailwind"))
			return "Wind Rider";

		// singles
		if (!isDoubles) {
			if (species.id === "hypno") return "Insomnia";
			if (species.id === "staraptor") return "Reckless";
			if (species.id === "vespiquen") return "Pressure";
			if (species.id === "enamorus" && moves.has("calmmind"))
				return "Cute Charm";
			if (species.id === "klawf" && role === "Setup Sweeper")
				return "Anger Shell";
			if (abilities.has("Cud Chew") && moves.has("substitute"))
				return "Cud Chew";
			if (
				abilities.has("Harvest") &&
				(moves.has("protect") || moves.has("substitute"))
			)
				return "Harvest";
			if (abilities.has("Serene Grace") && moves.has("headbutt"))
				return "Serene Grace";
			if (abilities.has("Own Tempo") && moves.has("petaldance"))
				return "Own Tempo";
			if (abilities.has("Slush Rush") && moves.has("snowscape"))
				return "Slush Rush";
			if (
				abilities.has("Soundproof") &&
				(moves.has("substitute") || moves.has("clangoroussoul"))
			)
				return "Soundproof";
		}

		// doubles, multi, and ffa
		if (isDoubles) {
			if (species.id === "farigiraf") return "Armor Tail";
			if (species.id === "dragapult") return "Clear Body";
			if (species.id === "altaria") return "Cloud Nine";
			if (species.id === "armarouge") return "Flash Fire";
			if (species.id === "talonflame") return "Gale Wings";
			if (
				["oinkologne", "oinkolognef", "snorlax", "swalot"].includes(
					species.id
				) &&
				role !== "Doubles Wallbreaker"
			)
				return "Gluttony";
			if (species.id === "conkeldurr" && role === "Doubles Wallbreaker")
				return "Guts";
			if (species.id === "tropius" || species.id === "trevenant")
				return "Harvest";
			if (species.id === "dragonite" || species.id === "lucario")
				return "Inner Focus";
			if (species.id === "ariados") return "Insomnia";
			if (species.id === "kommoo")
				return this.sample(["Overcoat", "Soundproof"]);
			if (species.id === "barraskewda") return "Propeller Tail";
			if (
				species.id === "flapple" ||
				(species.id === "appletun" && this.randomChance(1, 2))
			)
				return "Ripen";
			if (species.id === "gumshoos") return "Strong Jaw";
			if (species.id === "magnezone") return "Sturdy";
			if (species.id === "clefable" && role === "Doubles Support")
				return "Unaware";
			if (species.id === "drifblim") return "Unburden";
			if (abilities.has("Intimidate")) return "Intimidate";

			if (this.randomChance(1, 2) && species.id === "kingambit")
				return "Defiant";

			// just doubles and multi
			if (this.format.gameType !== "freeforall") {
				if (species.id === "florges") return "Flower Veil";
				if (
					species.id === "clefairy" ||
					(species.baseSpecies === "Maushold" &&
						role === "Doubles Support")
				)
					return "Friend Guard";
				if (species.id === "blissey") return "Healer";
				if (species.id === "sinistcha") return "Hospitality";
				if (
					species.id === "oranguru" ||
					(abilities.has("Pressure") && abilities.has("Telepathy"))
				)
					return "Telepathy";

				if (this.randomChance(1, 2) && species.id === "mukalola")
					return "Power of Alchemy";
			}
		}

		let abilityAllowed: Ability[] = [];
		// Obtain a list of abilities that are allowed (not culled)
		for (const ability of abilityData) {
			if (
				ability.rating >= 1 &&
				!this.shouldCullAbility(
					ability.name,
					types,
					moves,
					abilities,
					counter,
					teamDetails,
					species,
					isLead,
					isDoubles,
					teraType,
					role
				)
			) {
				abilityAllowed.push(ability);
			}
		}

		// If all abilities are rejected, re-allow all abilities
		if (!abilityAllowed.length) {
			for (const ability of abilityData) {
				if (ability.rating > 0) abilityAllowed.push(ability);
			}
			if (!abilityAllowed.length) abilityAllowed = abilityData;
		}

		if (abilityAllowed.length === 1) return abilityAllowed[0].name;
		// Sort abilities by rating with an element of randomness
		// All three abilities can be chosen
		if (
			abilityAllowed[2] &&
			abilityAllowed[0].rating - 0.5 <= abilityAllowed[2].rating
		) {
			if (abilityAllowed[1].rating <= abilityAllowed[2].rating) {
				if (this.randomChance(1, 2))
					[abilityAllowed[1], abilityAllowed[2]] = [
						abilityAllowed[2],
						abilityAllowed[1],
					];
			} else {
				if (this.randomChance(1, 3))
					[abilityAllowed[1], abilityAllowed[2]] = [
						abilityAllowed[2],
						abilityAllowed[1],
					];
			}
			if (abilityAllowed[0].rating <= abilityAllowed[1].rating) {
				if (this.randomChance(2, 3))
					[abilityAllowed[0], abilityAllowed[1]] = [
						abilityAllowed[1],
						abilityAllowed[0],
					];
			} else {
				if (this.randomChance(1, 2))
					[abilityAllowed[0], abilityAllowed[1]] = [
						abilityAllowed[1],
						abilityAllowed[0],
					];
			}
		} else {
			// Third ability cannot be chosen
			if (abilityAllowed[0].rating <= abilityAllowed[1].rating) {
				if (this.randomChance(1, 2))
					[abilityAllowed[0], abilityAllowed[1]] = [
						abilityAllowed[1],
						abilityAllowed[0],
					];
			} else if (
				abilityAllowed[0].rating - 0.5 <=
				abilityAllowed[1].rating
			) {
				if (this.randomChance(1, 3))
					[abilityAllowed[0], abilityAllowed[1]] = [
						abilityAllowed[1],
						abilityAllowed[0],
					];
			}
		}

		// After sorting, choose the first ability
		return abilityAllowed[0].name;
	}

	getPriorityItem(
		ability: string,
		types: string[],
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role
	) {
		if (!isDoubles) {
			if (
				!isLead &&
				role === "Bulky Setup" &&
				(ability === "Quark Drive" || ability === "Protosynthesis")
			) {
				return "Booster Energy";
			}
			if (species.id === "pincurchin") return "Shuca Berry";
			if (species.id === "lokix") {
				return role === "Fast Attacker" ? "Silver Powder" : "Life Orb";
			}
		}
		if (species.requiredItems) {
			// Z-Crystals aren't available in Gen 9, so require Plates
			if (species.baseSpecies === "Arceus") {
				return species.requiredItems[0];
			}
			return this.sample(species.requiredItems);
		}
		if (role === "AV Pivot") return "Assault Vest";
		if (species.id === "pikachu") return "Light Ball";
		if (species.id === "regieleki") return "Magnet";
		if (
			moves.has("clangoroussoul") ||
			(species.id === "toxtricity" && moves.has("shiftgear"))
		)
			return "Throat Spray";
		if (species.baseSpecies === "Magearna" && role === "Tera Blast user")
			return "Weakness Policy";
		if (moves.has("lastrespects") || moves.has("dragonenergy"))
			return "Choice Scarf";
		if (
			ability === "Imposter" ||
			(species.id === "magnezone" && moves.has("bodypress") && !isDoubles)
		)
			return "Choice Scarf";
		if (moves.has("bellydrum") && moves.has("substitute"))
			return "Salac Berry";
		if (
			["Cheek Pouch", "Cud Chew", "Harvest"].some((m) => ability === m) ||
			moves.has("bellydrum") ||
			moves.has("filletaway")
		) {
			return "Sitrus Berry";
		}
		if (["healingwish", "switcheroo", "trick"].some((m) => moves.has(m))) {
			if (
				species.baseStats.spe >= 60 &&
				species.baseStats.spe <= 108 &&
				role !== "Wallbreaker" &&
				role !== "Doubles Wallbreaker" &&
				!counter.get("priority")
			) {
				return "Choice Scarf";
			} else {
				return counter.get("Physical") > counter.get("Special")
					? "Choice Band"
					: "Choice Specs";
			}
		}
		if (species.id === "scyther" && !isDoubles)
			return isLead && !moves.has("uturn") ? "Eviolite" : "Heavy-Duty Boots";
		if (species.nfe || species.id === "dipplin") return "Eviolite";
		if (ability === "Poison Heal") return "Toxic Orb";
		if (
			(ability === "Guts" || moves.has("facade")) &&
			!moves.has("sleeptalk")
		) {
			return types.includes("Fire") || ability === "Toxic Boost"
				? "Toxic Orb"
				: "Flame Orb";
		}
		if (ability === "Sheer Force" && counter.get("sheerforce"))
			return "Life Orb";
		if (ability === "Anger Shell")
			return this.sample([
				"Rindo Berry",
				"Passho Berry",
				"Scope Lens",
				"Sitrus Berry",
			]);
		if (moves.has("courtchange")) return "Heavy-Duty Boots";
		if (moves.has("populationbomb")) return "Wide Lens";
		if (moves.has("scaleshot") && role !== "Choice Item user")
			return "Loaded Dice";
		if (moves.has("stuffcheeks"))
			return this.randomChance(1, 2) ? "Liechi Berry" : "Salac Berry";
		if (ability === "Unburden")
			return moves.has("closecombat") ? "White Herb" : "Sitrus Berry";
		if (moves.has("shellsmash") && ability !== "Weak Armor")
			return "White Herb";
		if (moves.has("acrobatics") && ability !== "Protosynthesis")
			return ability === "Grassy Surge" ? "Grassy Seed" : "";
		if (
			moves.has("auroraveil") ||
			(moves.has("lightscreen") && moves.has("reflect"))
		)
			return "Light Clay";
		if (ability === "Gluttony")
			return `${this.sample([
				"Aguav",
				"Figy",
				"Iapapa",
				"Mago",
				"Wiki",
			])} Berry`;
		if (
			moves.has("rest") &&
			!moves.has("sleeptalk") &&
			ability !== "Natural Cure" &&
			ability !== "Shed Skin"
		) {
			return "Chesto Berry";
		}
		if (
			species.id !== "yanmega" &&
			this.dex.getEffectiveness("Rock", species) >= 2 &&
			(!types.includes("Flying") || !isDoubles)
		)
			return "Heavy-Duty Boots";
	}

	/** Item generation specific to Random Doubles */
	getDoublesItem(
		ability: string,
		types: string[],
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role
	): string {
		const scarfReqs =
			!counter.get("priority") &&
			ability !== "Speed Boost" &&
			role !== "Doubles Wallbreaker" &&
			species.baseStats.spe >= 60 &&
			species.baseStats.spe <= 108 &&
			this.randomChance(1, 2);
		const offensiveRole = [
			"Doubles Fast Attacker",
			"Doubles Wallbreaker",
			"Doubles Setup Sweeper",
			"Offensive Protect",
		].some((m) => role === m);

		if (species.id === "ursalunabloodmoon") return "Silk Scarf";
		if (moves.has("covet")) return "Normal Gem";
		if (species.id === "calyrexice") return "Weakness Policy";
		if (moves.has("waterspout")) return "Choice Scarf";
		if (role === "Choice Item user") {
			if (
				scarfReqs ||
				(counter.get("Physical") < 4 &&
					counter.get("Special") < 3 &&
					!moves.has("memento"))
			) {
				return "Choice Scarf";
			}
			return counter.get("Physical") >= 3 ? "Choice Band" : "Choice Specs";
		}
		if (
			moves.has("blizzard") &&
			ability !== "Snow Warning" &&
			!teamDetails.snow
		)
			return "Blunder Policy";
		if (
			counter.get("Physical") >= 4 &&
			[
				"fakeout",
				"feint",
				"firstimpression",
				"rapidspin",
				"suckerpunch",
			].every((m) => !moves.has(m)) &&
			(moves.has("flipturn") ||
				moves.has("uturn") ||
				role === "Doubles Wallbreaker")
		) {
			return scarfReqs ? "Choice Scarf" : "Choice Band";
		}
		if (
			((counter.get("Special") >= 4 &&
				(moves.has("voltswitch") || role === "Doubles Wallbreaker")) ||
				(counter.get("Special") >= 3 &&
					(moves.has("uturn") || moves.has("flipturn")))) &&
			!moves.has("acidspray") &&
			!moves.has("electroweb")
		) {
			return scarfReqs ? "Choice Scarf" : "Choice Specs";
		}
		if (
			(role === "Bulky Protect" && counter.get("setup")) ||
			moves.has("substitute") ||
			species.id === "eternatus" ||
			species.id === "toxapex"
		)
			return "Leftovers";
		if (species.id === "sylveon") return "Pixie Plate";
		if (
			(offensiveRole ||
				(role === "Tera Blast user" &&
					species.baseStats.spe >= 80 &&
					!moves.has("trickroom"))) &&
			(!moves.has("fakeout") || species.id === "ambipom") &&
			!moves.has("incinerate") &&
			(!moves.has("uturn") ||
				types.includes("Bug") ||
				species.baseStats.atk >= 120 ||
				ability === "Libero") &&
			(!moves.has("icywind") || species.id === "ironbundle")
		) {
			return (ability === "Quark Drive" || ability === "Protosynthesis") &&
				["firstimpression", "uturn", "voltswitch"].every(
					(m) => !moves.has(m)
				) &&
				species.id !== "ironvaliant"
				? "Booster Energy"
				: "Life Orb";
		}
		if (
			isLead &&
			(species.id === "glimmora" ||
				([
					"Doubles Fast Attacker",
					"Doubles Wallbreaker",
					"Offensive Protect",
				].includes(role) &&
					species.baseStats.hp +
						species.baseStats.def +
						species.baseStats.spd <=
						230))
		)
			return "Focus Sash";
		if (
			([
				"Doubles Fast Attacker",
				"Doubles Wallbreaker",
				"Offensive Protect",
			].includes(role) &&
				moves.has("fakeout")) ||
			moves.has("incinerate")
		) {
			return this.dex.getEffectiveness("Rock", species) >= 1
				? "Heavy-Duty Boots"
				: "Clear Amulet";
		}
		if (!counter.get("Status")) return "Assault Vest";
		if (species.id === "pawmot") return "Leppa Berry";
		return "Sitrus Berry";
	}

	getItem(
		ability: string,
		types: string[],
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role
	): string {
		if (types.includes("Normal") && moves.has("fakeout")) return "Silk Scarf";
		if (
			species.id !== "jirachi" &&
			(counter.get("Physical") >= 4 ||
				(counter.get("Physical") >= 3 && moves.has("memento"))) &&
			[
				"fakeout",
				"firstimpression",
				"flamecharge",
				"rapidspin",
				"ruination",
				"superfang",
			].every((m) => !moves.has(m))
		) {
			const scarfReqs =
				role !== "Wallbreaker" &&
				(species.baseStats.atk >= 100 ||
					ability === "Huge Power" ||
					ability === "Pure Power") &&
				species.baseStats.spe >= 60 &&
				species.baseStats.spe <= 108 &&
				ability !== "Speed Boost" &&
				!counter.get("priority") &&
				!moves.has("aquastep");
			return scarfReqs && this.randomChance(1, 2)
				? "Choice Scarf"
				: "Choice Band";
		}
		if (
			counter.get("Special") >= 4 ||
			(counter.get("Special") >= 3 &&
				["flipturn", "partingshot", "uturn"].some((m) => moves.has(m)))
		) {
			const scarfReqs =
				role !== "Wallbreaker" &&
				species.baseStats.spa >= 100 &&
				species.baseStats.spe >= 60 &&
				species.baseStats.spe <= 108 &&
				ability !== "Speed Boost" &&
				ability !== "Tinted Lens" &&
				!counter.get("Physical");
			return scarfReqs && this.randomChance(1, 2)
				? "Choice Scarf"
				: "Choice Specs";
		}
		if (
			!counter.get("Status") &&
			(moves.has("rapidspin") ||
				!["Fast Attacker", "Wallbreaker", "Tera Blast user"].includes(role))
		) {
			return "Assault Vest";
		}
		if (counter.get("speedsetup") && role === "Bulky Setup")
			return "Weakness Policy";
		if (species.id === "golem") return "Custap Berry";
		if (species.id === "urshifurapidstrike") return "Punching Glove";
		if (species.id === "palkia") return "Lustrous Orb";
		if (moves.has("substitute") || ability === "Moody") return "Leftovers";
		if (moves.has("stickyweb") && isLead) return "Focus Sash";
		if (this.dex.getEffectiveness("Rock", species) >= 1)
			return "Heavy-Duty Boots";
		if (
			moves.has("chillyreception") ||
			(role === "Fast Support" &&
				[...PIVOT_MOVES, "defog", "mortalspin", "rapidspin"].some((m) =>
					moves.has(m)
				) &&
				!types.includes("Flying") &&
				ability !== "Levitate")
		)
			return "Heavy-Duty Boots";

		// Low Priority
		if (
			(species.id === "garchomp" && role === "Fast Support") ||
			(ability === "Regenerator" &&
				(role === "Bulky Support" || role === "Bulky Attacker") &&
				species.baseStats.hp + species.baseStats.def >= 180 &&
				this.randomChance(1, 2))
		)
			return "Rocky Helmet";
		if (moves.has("outrage")) return "Lum Berry";
		if (
			role === "Fast Support" &&
			isLead &&
			!counter.get("recovery") &&
			!counter.get("recoil") &&
			!moves.has("protect") &&
			species.baseStats.hp + species.baseStats.def + species.baseStats.spd <
				258
		)
			return "Focus Sash";
		if (
			!["Fast Attacker", "Wallbreaker", "Tera Blast user"].includes(role) &&
			ability !== "Levitate" &&
			this.dex.getEffectiveness("Ground", species) >= 2
		)
			return "Air Balloon";
		if (
			["Bulky Attacker", "Bulky Support", "Bulky Setup"].some(
				(m) => role === m
			)
		)
			return "Leftovers";
		if (species.id === "pawmot" && moves.has("nuzzle")) return "Leppa Berry";
		if (
			[
				"Fast Bulky Setup",
				"Fast Attacker",
				"Setup Sweeper",
				"Wallbreaker",
			].some((m) => role === m) &&
			types.includes("Dark") &&
			moves.has("suckerpunch") &&
			!PRIORITY_POKEMON.includes(species.id) &&
			counter.get("physicalsetup") &&
			counter.get("Dark")
		)
			return "Black Glasses";
		if (role === "Fast Support" || role === "Fast Bulky Setup") {
			return counter.get("Physical") + counter.get("Special") >= 3 &&
				!moves.has("nuzzle")
				? "Life Orb"
				: "Leftovers";
		}
		if (role === "Tera Blast user" && species.baseSpecies === "Florges")
			return "Leftovers";
		if (
			["flamecharge", "rapidspin", "trailblaze"].every(
				(m) => !moves.has(m)
			) &&
			[
				"Fast Attacker",
				"Setup Sweeper",
				"Tera Blast user",
				"Wallbreaker",
			].some((m) => role === m)
		)
			return "Life Orb";
		return "Leftovers";
	}

	getLevel(species: Species, isDoubles: boolean): number {
		if (this.adjustLevel) return this.adjustLevel;
		// doubles levelling
		if (isDoubles && this.randomDoublesSets[species.id]["level"])
			return this.randomDoublesSets[species.id]["level"]!;
		if (!isDoubles && this.randomSets[species.id]["level"])
			return this.randomSets[species.id]["level"]!;
		// Default to tier-based levelling
		const tier = species.tier;
		const tierScale: Partial<Record<Species["tier"], number>> = {
			Uber: 76,
			OU: 80,
			UUBL: 81,
			UU: 82,
			RUBL: 83,
			RU: 84,
			NUBL: 85,
			NU: 86,
			PUBL: 87,
			PU: 88,
			"(PU)": 88,
			NFE: 88,
		};
		return tierScale[tier] || 80;
	}

	randomSet(
		s: string | Species,
		teamDetails: RandomTeamsTypes.TeamDetails = {},
		isLead = false,
		isDoubles = false
	): RandomTeamsTypes.RandomSet {
		const species = this.dex.species.get(s);
		let forme = species.name;

		if (typeof species.battleOnly === "string") {
			// Only change the forme. The species has custom moves, and may have different typing and requirements.
			forme = species.battleOnly;
		}
		if (species.cosmeticFormes) {
			forme = this.sample([species.name].concat(species.cosmeticFormes));
		}
		const sets = (this as any)[`random${isDoubles ? "Doubles" : ""}Sets`][
			species.id
		]["sets"];
		const possibleSets = [];

		const ruleTable = this.dex.formats.getRuleTable(this.format);

		for (const set of sets) {
			// Prevent Tera Blast user if the team already has one, or if Terastallizion is prevented.
			if (
				(teamDetails.teraBlast || ruleTable.has("terastalclause")) &&
				set.role === "Tera Blast user"
			) {
				continue;
			}
			possibleSets.push(set);
		}
		const set = this.sampleIfArray(possibleSets);
		const role = set.role;
		const movePool: string[] = [];
		for (const movename of set.movepool) {
			movePool.push(this.dex.moves.get(movename).id);
		}
		const teraTypes = set.teraTypes;
		const teraType = this.sampleIfArray(teraTypes);

		let ability = "";
		let item = undefined;

		const evs = { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 };
		const ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };

		const types = species.types;
		const abilities = new Set(Object.values(species.abilities));
		if (species.unreleasedHidden) abilities.delete(species.abilities.H);

		// Get moves
		const moves = this.randomMoveset(
			types,
			abilities,
			teamDetails,
			species,
			isLead,
			isDoubles,
			movePool,
			teraType,
			role
		);
		const counter = this.queryMoves(moves, species, teraType, abilities);

		// Get ability
		ability = this.getAbility(
			types,
			moves,
			abilities,
			counter,
			teamDetails,
			species,
			isLead,
			isDoubles,
			teraType,
			role
		);

		// Get items
		// First, the priority items
		item = this.getPriorityItem(
			ability,
			types,
			moves,
			counter,
			teamDetails,
			species,
			isLead,
			isDoubles,
			teraType,
			role
		);
		if (item === undefined) {
			if (isDoubles) {
				item = this.getDoublesItem(
					ability,
					types,
					moves,
					counter,
					teamDetails,
					species,
					isLead,
					teraType,
					role
				);
			} else {
				item = this.getItem(
					ability,
					types,
					moves,
					counter,
					teamDetails,
					species,
					isLead,
					teraType,
					role
				);
			}
		}

		if (species.baseSpecies === "Pikachu") {
			forme =
				"Pikachu" +
				this.sample([
					"",
					"-Original",
					"-Hoenn",
					"-Sinnoh",
					"-Unova",
					"-Kalos",
					"-Alola",
					"-Partner",
					"-World",
				]);
		}

		// Get level
		const level = this.getLevel(species, isDoubles);

		// Prepare optimal HP
		const srImmunity =
			ability === "Magic Guard" || item === "Heavy-Duty Boots";
		let srWeakness = srImmunity
			? 0
			: this.dex.getEffectiveness("Rock", species);
		// Crash damage move users want an odd HP to survive two misses
		if (["axekick", "highjumpkick", "jumpkick"].some((m) => moves.has(m)))
			srWeakness = 2;
		while (evs.hp > 1) {
			const hp = Math.floor(
				(Math.floor(
					2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100
				) *
					level) /
					100 +
					10
			);
			if (
				moves.has("substitute") &&
				["Sitrus Berry", "Salac Berry"].includes(item)
			) {
				// Two Substitutes should activate Sitrus Berry
				if (hp % 4 === 0) break;
			} else if (
				(moves.has("bellydrum") || moves.has("filletaway")) &&
				(item === "Sitrus Berry" || ability === "Gluttony")
			) {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins
				if (
					srWeakness <= 0 ||
					ability === "Regenerator" ||
					["Leftovers", "Life Orb"].includes(item)
				)
					break;
				if (item !== "Sitrus Berry" && hp % (4 / srWeakness) > 0) break;
				// Minimise number of Stealth Rock switch-ins to activate Sitrus Berry
				if (item === "Sitrus Berry" && hp % (4 / srWeakness) === 0) break;
			}
			evs.hp -= 4;
		}

		// Minimize confusion damage
		const noAttackStatMoves = [...moves].every((m) => {
			const move = this.dex.moves.get(m);
			if (move.damageCallback || move.damage) return true;
			if (move.id === "shellsidearm") return false;
			// Magearna and doubles Dragonite, though these can work well as a general rule
			if (
				move.id === "terablast" &&
				(moves.has("shiftgear") ||
					species.baseStats.atk > species.baseStats.spa)
			)
				return false;
			return (
				move.category !== "Physical" ||
				move.id === "bodypress" ||
				move.id === "foulplay"
			);
		});
		if (
			noAttackStatMoves &&
			!moves.has("transform") &&
			this.format.mod !== "partnersincrime"
		) {
			evs.atk = 0;
			ivs.atk = 0;
		}

		if (moves.has("gyroball") || moves.has("trickroom")) {
			evs.spe = 0;
			ivs.spe = 0;
		}

		// shuffle moves to add more randomness to camomons
		const shuffledMoves = Array.from(moves);
		this.prng.shuffle(shuffledMoves);
		return {
			name: species.baseSpecies,
			species: forme,
			gender: species.gender,
			shiny: this.randomChance(1, 1024),
			level,
			moves: shuffledMoves,
			ability,
			evs,
			ivs,
			item,
			teraType,
			role,
		};
	}

	getPokemonPool(
		type: string,
		pokemonToExclude: RandomTeamsTypes.RandomSet[] = [],
		isMonotype = false,
		pokemonList: string[]
	) {
		const exclude = pokemonToExclude.map((p) => toID(p.species));
		const pokemonPool = [];
		const baseSpeciesPool = [];
		const baseSpeciesCount: { [k: string]: number } = {};
		for (const pokemon of pokemonList) {
			let species = this.dex.species.get(pokemon);
			if (exclude.includes(species.id)) continue;
			if (isMonotype) {
				if (!species.types.includes(type)) continue;
				if (typeof species.battleOnly === "string") {
					species = this.dex.species.get(species.battleOnly);
					if (!species.types.includes(type)) continue;
				}
			}
			pokemonPool.push(pokemon);
			baseSpeciesCount[species.baseSpecies] =
				(baseSpeciesCount[species.baseSpecies] || 0) + 1;
		}
		// Include base species 1x if 1-3 formes, 2x if 4-6 formes, 3x if 7+ formes
		for (const baseSpecies of Object.keys(baseSpeciesCount)) {
			for (
				let i = 0;
				i < Math.min(Math.ceil(baseSpeciesCount[baseSpecies] / 3), 3);
				i++
			) {
				baseSpeciesPool.push(baseSpecies);
				// Squawkabilly has 4 formes, but only 2 functionally different formes, so only include it 1x
				if (baseSpecies === "Squawkabilly") break;
			}
		}
		return [pokemonPool, baseSpeciesPool];
	}

	randomSets: {
		[species: string]: RandomTeamsTypes.RandomSpeciesData;
	} = randomSets as any;
	randomDoublesSets: {
		[species: string]: RandomTeamsTypes.RandomSpeciesData;
	} = randomDoublesSets as any;

	randomTeam() {
		this.enforceNoDirectCustomBanlistChanges();

		const seed = this.prng.seed;
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const pokemon: RandomTeamsTypes.RandomSet[] = [];

		// For Monotype
		const isMonotype =
			!!this.forceMonotype || ruleTable.has("sametypeclause");
		const isDoubles = this.format.gameType !== "singles";
		const typePool = this.dex.types.names();
		const type = this.forceMonotype || this.sample(typePool);

		// PotD stuff
		const usePotD = ruleTable.has("potd");
		const potd = usePotD ? this.dex.species.get(ruleTable.get("potd")) : null;

		const baseFormes: { [k: string]: number } = {};

		const typeCount: { [k: string]: number } = {};
		const typeComboCount: { [k: string]: number } = {};
		const typeWeaknesses: { [k: string]: number } = {};
		const teamDetails: RandomTeamsTypes.TeamDetails = {};

		const pokemonList = isDoubles
			? Object.keys(this.randomDoublesSets)
			: Object.keys(this.randomSets);
		const [pokemonPool, baseSpeciesPool] = this.getPokemonPool(
			type,
			pokemon,
			isMonotype,
			pokemonList
		);

		let leadsRemaining = this.format.gameType === "doubles" ? 2 : 1;
		while (baseSpeciesPool.length && pokemon.length < this.maxTeamSize) {
			const baseSpecies = this.sampleNoReplace(baseSpeciesPool);
			const currentSpeciesPool: Species[] = [];
			for (const poke of pokemonPool) {
				const species = this.dex.species.get(poke);
				if (species.baseSpecies === baseSpecies)
					currentSpeciesPool.push(species);
			}
			let species = this.sample(currentSpeciesPool);
			if (!species.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[species.baseSpecies]) continue;

			// Treat Ogerpon formes like the Tera Blast user role; reject if team has one already
			if (species.baseSpecies === "Ogerpon" && teamDetails.teraBlast)
				continue;

			// Illusion shouldn't be on the last slot
			if (
				species.baseSpecies === "Zoroark" &&
				pokemon.length >= this.maxTeamSize - 1
			)
				continue;

			const types = species.types;
			const typeCombo = types.slice().sort().join();
			// Dynamically scale limits for different team sizes. The default and minimum value is 1.
			const limitFactor = Math.round(this.maxTeamSize / 6) || 1;

			if (!isMonotype && !this.forceMonotype) {
				let skip = false;

				// Limit two of any type
				for (const typeName of types) {
					if (typeCount[typeName] >= 2 * limitFactor) {
						skip = true;
						break;
					}
				}
				if (skip) continue;

				// Limit three weak to any type
				for (const typeName of this.dex.types.names()) {
					// it's weak to the type
					if (this.dex.getEffectiveness(typeName, species) > 0) {
						if (!typeWeaknesses[typeName]) typeWeaknesses[typeName] = 0;
						if (typeWeaknesses[typeName] >= 3 * limitFactor) {
							skip = true;
							break;
						}
					}
				}
				if (skip) continue;
			}

			// Limit one of any type combination, three in Monotype
			if (
				!this.forceMonotype &&
				typeComboCount[typeCombo] >= (isMonotype ? 3 : 1) * limitFactor
			)
				continue;

			// The Pokemon of the Day
			if (potd?.exists && (pokemon.length === 1 || this.maxTeamSize === 1)) {
				species = potd;
			}

			let set: RandomTeamsTypes.RandomSet;
			if (leadsRemaining) {
				if (
					(isDoubles &&
						DOUBLES_NO_LEAD_POKEMON.includes(species.baseSpecies)) ||
					(!isDoubles && NO_LEAD_POKEMON.includes(species.baseSpecies))
				) {
					if (pokemon.length + leadsRemaining === this.maxTeamSize)
						continue;
					set = this.randomSet(species, teamDetails, false, isDoubles);
					pokemon.push(set);
				} else {
					set = this.randomSet(species, teamDetails, true, isDoubles);
					pokemon.unshift(set);
					leadsRemaining--;
				}
			} else {
				set = this.randomSet(species, teamDetails, false, isDoubles);
				pokemon.push(set);
			}

			// Don't bother tracking details for the last Pokemon
			if (pokemon.length === this.maxTeamSize) break;

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[species.baseSpecies] = 1;

			// Increment type counters
			for (const typeName of types) {
				if (typeName in typeCount) {
					typeCount[typeName]++;
				} else {
					typeCount[typeName] = 1;
				}
			}
			if (typeCombo in typeComboCount) {
				typeComboCount[typeCombo]++;
			} else {
				typeComboCount[typeCombo] = 1;
			}

			// Increment weakness counter
			for (const typeName of this.dex.types.names()) {
				// it's weak to the type
				if (this.dex.getEffectiveness(typeName, species) > 0) {
					typeWeaknesses[typeName]++;
				}
			}

			// Track what the team has
			if (set.ability === "Drizzle" || set.moves.includes("raindance"))
				teamDetails.rain = 1;
			if (
				set.ability === "Drought" ||
				set.ability === "Orichalcum Pulse" ||
				set.moves.includes("sunnyday")
			) {
				teamDetails.sun = 1;
			}
			if (set.ability === "Sand Stream") teamDetails.sand = 1;
			if (
				set.ability === "Snow Warning" ||
				set.moves.includes("snowscape") ||
				set.moves.includes("chillyreception")
			) {
				teamDetails.snow = 1;
			}
			if (
				set.moves.includes("spikes") ||
				set.moves.includes("ceaselessedge")
			) {
				teamDetails.spikes = (teamDetails.spikes || 0) + 1;
			}
			if (
				set.moves.includes("toxicspikes") ||
				set.ability === "Toxic Debris"
			) {
				teamDetails.toxicSpikes = (teamDetails.toxicSpikes || 0) + 1;
			}
			if (
				set.moves.includes("stealthrock") ||
				set.moves.includes("stoneaxe")
			)
				teamDetails.stealthRock = 1;
			if (set.moves.includes("stickyweb")) teamDetails.stickyWeb = 1;
			if (set.moves.includes("defog")) teamDetails.defog = 1;
			if (
				set.moves.includes("rapidspin") ||
				set.moves.includes("mortalspin")
			)
				teamDetails.rapidSpin = 1;
			if (
				set.moves.includes("auroraveil") ||
				(set.moves.includes("reflect") && set.moves.includes("lightscreen"))
			) {
				teamDetails.screens = 1;
			}
			if (
				set.role === "Tera Blast user" ||
				species.baseSpecies === "Ogerpon"
			)
				teamDetails.teraBlast = 1;
		}
		if (pokemon.length < this.maxTeamSize && pokemon.length < 12) {
			// large teams sometimes cannot be built
			throw new Error(
				`Could not build a random team for ${this.format} (seed=${seed})`
			);
		}

		return pokemon;
	}

	randomCCTeam(): RandomTeamsTypes.RandomSet[] {
		this.enforceNoDirectCustomBanlistChanges();

		const dex = this.dex;
		const team = [];

		const natures = this.dex.natures.all();
		const items = this.dex.items.all();

		const randomN = this.randomNPokemon(
			this.maxTeamSize,
			this.forceMonotype,
			undefined,
			undefined,
			true
		);

		for (let forme of randomN) {
			let species = dex.species.get(forme);
			if (species.isNonstandard)
				species = dex.species.get(species.baseSpecies);

			// Random legal item
			let item = "";
			let isIllegalItem;
			let isBadItem;
			if (this.gen >= 2) {
				do {
					item = this.sample(items).name;
					isIllegalItem =
						this.dex.items.get(item).gen > this.gen ||
						this.dex.items.get(item).isNonstandard;
					isBadItem =
						item.startsWith("TR") || this.dex.items.get(item).isPokeball;
				} while (isIllegalItem || (isBadItem && this.randomChance(19, 20)));
			}

			// Make sure forme is legal
			if (species.battleOnly) {
				if (typeof species.battleOnly === "string") {
					species = dex.species.get(species.battleOnly);
				} else {
					species = dex.species.get(this.sample(species.battleOnly));
				}
				forme = species.name;
			} else if (
				species.requiredItems &&
				!species.requiredItems.some((req) => toID(req) === item)
			) {
				if (!species.changesFrom)
					throw new Error(`${species.name} needs a changesFrom value`);
				species = dex.species.get(species.changesFrom);
				forme = species.name;
			}

			// Make sure that a base forme does not hold any forme-modifier items.
			let itemData = this.dex.items.get(item);
			if (
				itemData.forcedForme &&
				forme === this.dex.species.get(itemData.forcedForme).baseSpecies
			) {
				do {
					itemData = this.sample(items);
					item = itemData.name;
				} while (
					itemData.gen > this.gen ||
					itemData.isNonstandard ||
					(itemData.forcedForme &&
						forme ===
							this.dex.species.get(itemData.forcedForme).baseSpecies)
				);
			}

			// Random legal ability
			const abilities = Object.values(species.abilities).filter(
				(a) => this.dex.abilities.get(a).gen <= this.gen
			);
			const ability: string =
				this.gen <= 2 ? "No Ability" : this.sample(abilities);

			// Four random unique moves from the movepool
			let pool = ["struggle"];
			if (forme === "Smeargle") {
				pool = this.dex.moves
					.all()
					.filter(
						(move) =>
							!(
								move.isNonstandard ||
								move.isZ ||
								move.isMax ||
								move.realMove
							)
					)
					.map((m) => m.id);
			} else {
				const formes = ["gastrodoneast", "pumpkaboosuper", "zygarde10"];
				let learnset = this.dex.species.getLearnset(species.id);
				let learnsetSpecies = species;
				if (formes.includes(species.id) || !learnset) {
					learnsetSpecies = this.dex.species.get(species.baseSpecies);
					learnset = this.dex.species.getLearnset(learnsetSpecies.id);
				}
				if (learnset) {
					pool = Object.keys(learnset).filter((moveid) =>
						learnset![moveid].find((learned) =>
							learned.startsWith(String(this.gen))
						)
					);
				}
				if (
					learnset &&
					learnsetSpecies === species &&
					species.changesFrom
				) {
					learnset = this.dex.species.getLearnset(
						toID(species.changesFrom)
					);
					for (const moveid in learnset) {
						if (
							!pool.includes(moveid) &&
							learnset[moveid].some((source) =>
								source.startsWith(String(this.gen))
							)
						) {
							pool.push(moveid);
						}
					}
				}
				const evoRegion =
					learnsetSpecies.evoRegion && learnsetSpecies.gen !== this.gen;
				for (let i = 0; i < 2 && learnsetSpecies.prevo; i++) {
					learnsetSpecies = this.dex.species.get(learnsetSpecies.prevo);
					learnset = this.dex.species.getLearnset(learnsetSpecies.id);
					for (const moveid in learnset) {
						if (
							!pool.includes(moveid) &&
							learnset[moveid].some(
								(source) =>
									source.startsWith(String(this.gen)) &&
									(!evoRegion || source.charAt(1) === "E")
							)
						) {
							pool.push(moveid);
						}
					}
				}
			}

			const moves = this.multipleSamplesNoReplace(pool, this.maxMoveCount);

			// Random EVs
			const evs: StatsTable = {
				hp: 0,
				atk: 0,
				def: 0,
				spa: 0,
				spd: 0,
				spe: 0,
			};
			const s: StatID[] = ["hp", "atk", "def", "spa", "spd", "spe"];
			let evpool = 510;
			do {
				const x = this.sample(s);
				const y = this.random(Math.min(256 - evs[x], evpool + 1));
				evs[x] += y;
				evpool -= y;
			} while (evpool > 0);

			// Random IVs
			const ivs = {
				hp: this.random(32),
				atk: this.random(32),
				def: this.random(32),
				spa: this.random(32),
				spd: this.random(32),
				spe: this.random(32),
			};

			// Random nature
			const nature = this.sample(natures).name;

			// Level balance--calculate directly from stats rather than using some silly lookup table
			const mbstmin = 1307; // Sunkern has the lowest modified base stat total, and that total is 807

			let stats = species.baseStats;
			// If Wishiwashi, use the school-forme's much higher stats
			if (species.baseSpecies === "Wishiwashi")
				stats = Dex.species.get("wishiwashischool").baseStats;

			// Modified base stat total assumes 31 IVs, 85 EVs in every stat
			let mbst = stats["hp"] * 2 + 31 + 21 + 100 + 10;
			mbst += stats["atk"] * 2 + 31 + 21 + 100 + 5;
			mbst += stats["def"] * 2 + 31 + 21 + 100 + 5;
			mbst += stats["spa"] * 2 + 31 + 21 + 100 + 5;
			mbst += stats["spd"] * 2 + 31 + 21 + 100 + 5;
			mbst += stats["spe"] * 2 + 31 + 21 + 100 + 5;

			let level;
			if (this.adjustLevel) {
				level = this.adjustLevel;
			} else {
				level = Math.floor((100 * mbstmin) / mbst); // Initial level guess will underestimate

				while (level < 100) {
					mbst = Math.floor(
						((stats["hp"] * 2 + 31 + 21 + 100) * level) / 100 + 10
					);
					// Since damage is roughly proportional to level
					mbst += Math.floor(
						((((stats["atk"] * 2 + 31 + 21 + 100) * level) / 100 + 5) *
							level) /
							100
					);
					mbst += Math.floor(
						((stats["def"] * 2 + 31 + 21 + 100) * level) / 100 + 5
					);
					mbst += Math.floor(
						((((stats["spa"] * 2 + 31 + 21 + 100) * level) / 100 + 5) *
							level) /
							100
					);
					mbst += Math.floor(
						((stats["spd"] * 2 + 31 + 21 + 100) * level) / 100 + 5
					);
					mbst += Math.floor(
						((stats["spe"] * 2 + 31 + 21 + 100) * level) / 100 + 5
					);

					if (mbst >= mbstmin) break;
					level++;
				}
			}

			// Random happiness
			const happiness = this.random(256);

			// Random shininess
			const shiny = this.randomChance(1, 1024);

			const set: RandomTeamsTypes.RandomSet = {
				name: species.baseSpecies,
				species: species.name,
				gender: species.gender,
				item,
				ability,
				moves,
				evs,
				ivs,
				nature,
				level,
				happiness,
				shiny,
			};
			if (this.gen === 9) {
				// Tera type
				set.teraType = this.sample(this.dex.types.all()).name;
			}
			team.push(set);
		}

		return team;
	}

	randomNPokemon(
		n: number,
		requiredType?: string,
		minSourceGen?: number,
		ruleTable?: RuleTable,
		requireMoves = false
	) {
		// Picks `n` random pokemon--no repeats, even among formes
		// Also need to either normalize for formes or select formes at random
		// Unreleased are okay but no CAP
		const last = [0, 151, 251, 386, 493, 649, 721, 807, 898, 1010][this.gen];

		if (n <= 0 || n > last)
			throw new Error(`n must be a number between 1 and ${last} (got ${n})`);
		if (requiredType && !this.dex.types.get(requiredType).exists) {
			throw new Error(`"${requiredType}" is not a valid type.`);
		}

		const isNotCustom = !ruleTable;

		const pool: number[] = [];
		let speciesPool: Species[] = [];
		if (isNotCustom) {
			speciesPool = [...this.dex.species.all()];
			for (const species of speciesPool) {
				if (
					species.isNonstandard &&
					species.isNonstandard !== "Unobtainable"
				)
					continue;
				if (requireMoves) {
					const hasMovesInCurrentGen = Object.values(
						this.dex.species.getLearnset(species.id) || {}
					).some((sources) =>
						sources.some((source) => source.startsWith("9"))
					);
					if (!hasMovesInCurrentGen) continue;
				}
				if (requiredType && !species.types.includes(requiredType)) continue;
				if (minSourceGen && species.gen < minSourceGen) continue;
				const num = species.num;
				if (num <= 0 || pool.includes(num)) continue;
				if (num > last) break;
				pool.push(num);
			}
		} else {
			const EXISTENCE_TAG = [
				"past",
				"future",
				"lgpe",
				"unobtainable",
				"cap",
				"custom",
				"nonexistent",
			];
			const nonexistentBanReason = ruleTable.check("nonexistent");
			// Assume tierSpecies does not differ from species here (mega formes can be used without their stone, etc)
			for (const species of this.dex.species.all()) {
				if (requiredType && !species.types.includes(requiredType)) continue;

				let banReason = ruleTable.check("pokemon:" + species.id);
				if (banReason) continue;
				if (banReason !== "") {
					if (species.isMega && ruleTable.check("pokemontag:mega"))
						continue;

					banReason = ruleTable.check(
						"basepokemon:" + toID(species.baseSpecies)
					);
					if (banReason) continue;
					if (
						banReason !== "" ||
						this.dex.species.get(species.baseSpecies).isNonstandard !==
							species.isNonstandard
					) {
						const nonexistentCheck =
							Tags.nonexistent.genericFilter!(species) &&
							nonexistentBanReason;
						let tagWhitelisted = false;
						let tagBlacklisted = false;
						for (const ruleid of ruleTable.tagRules) {
							if (ruleid.startsWith("*")) continue;
							const tagid = ruleid.slice(12);
							const tag = Tags[tagid];
							if ((tag.speciesFilter || tag.genericFilter)!(species)) {
								const existenceTag = EXISTENCE_TAG.includes(tagid);
								if (ruleid.startsWith("+")) {
									if (!existenceTag && nonexistentCheck) continue;
									tagWhitelisted = true;
									break;
								}
								tagBlacklisted = true;
								break;
							}
						}
						if (tagBlacklisted) continue;
						if (!tagWhitelisted) {
							if (ruleTable.check("pokemontag:allpokemon")) continue;
						}
					}
				}
				speciesPool.push(species);
				const num = species.num;
				if (pool.includes(num)) continue;
				pool.push(num);
			}
		}

		const hasDexNumber: { [k: string]: number } = {};
		for (let i = 0; i < n; i++) {
			const num = this.sampleNoReplace(pool);
			hasDexNumber[num] = i;
		}

		const formes: string[][] = [];
		for (const species of speciesPool) {
			if (!(species.num in hasDexNumber)) continue;
			if (
				isNotCustom &&
				(species.gen > this.gen ||
					(species.isNonstandard &&
						species.isNonstandard !== "Unobtainable"))
			)
				continue;
			if (!formes[hasDexNumber[species.num]])
				formes[hasDexNumber[species.num]] = [];
			formes[hasDexNumber[species.num]].push(species.name);
		}

		if (formes.length < n) {
			throw new Error(
				`Legal Pokemon forme count insufficient to support Max Team Size: (${formes.length} / ${n}).`
			);
		}

		const nPokemon = [];
		for (let i = 0; i < n; i++) {
			if (!formes[i].length) {
				throw new Error(
					`Invalid pokemon gen ${this.gen}: ${JSON.stringify(
						formes
					)} numbers ${JSON.stringify(hasDexNumber)}`
				);
			}
			nPokemon.push(this.sample(formes[i]));
		}
		return nPokemon;
	}

	randomHCTeam(): PokemonSet[] {
		const hasCustomBans = this.hasDirectCustomBanlistChanges();
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const hasNonexistentBan = hasCustomBans && ruleTable.check("nonexistent");
		const hasNonexistentWhitelist = hasCustomBans && hasNonexistentBan === "";

		if (hasCustomBans) {
			this.enforceNoDirectComplexBans();
		}

		// Item Pool
		const doItemsExist = this.gen > 1;
		let itemPool: Item[] = [];
		if (doItemsExist) {
			if (!hasCustomBans) {
				itemPool = [...this.dex.items.all()].filter(
					(item) => item.gen <= this.gen && !item.isNonstandard
				);
			} else {
				const hasAllItemsBan = ruleTable.check("pokemontag:allitems");
				for (const item of this.dex.items.all()) {
					let banReason = ruleTable.check("item:" + item.id);
					if (banReason) continue;
					if (banReason !== "" && item.id) {
						if (hasAllItemsBan) continue;
						if (item.isNonstandard) {
							banReason = ruleTable.check(
								"pokemontag:" + toID(item.isNonstandard)
							);
							if (banReason) continue;
							if (
								banReason !== "" &&
								item.isNonstandard !== "Unobtainable"
							) {
								if (hasNonexistentBan) continue;
								if (!hasNonexistentWhitelist) continue;
							}
						}
					}
					itemPool.push(item);
				}
				if (ruleTable.check("item:noitem")) {
					this.enforceCustomPoolSizeNoComplexBans(
						"item",
						itemPool,
						this.maxTeamSize,
						"Max Team Size"
					);
				}
			}
		}

		// Ability Pool
		const doAbilitiesExist =
			this.gen > 2 && this.dex.currentMod !== "gen7letsgo";
		let abilityPool: Ability[] = [];
		if (doAbilitiesExist) {
			if (!hasCustomBans) {
				abilityPool = [...this.dex.abilities.all()].filter(
					(ability) => ability.gen <= this.gen && !ability.isNonstandard
				);
			} else {
				const hasAllAbilitiesBan = ruleTable.check(
					"pokemontag:allabilities"
				);
				for (const ability of this.dex.abilities.all()) {
					let banReason = ruleTable.check("ability:" + ability.id);
					if (banReason) continue;
					if (banReason !== "") {
						if (hasAllAbilitiesBan) continue;
						if (ability.isNonstandard) {
							banReason = ruleTable.check(
								"pokemontag:" + toID(ability.isNonstandard)
							);
							if (banReason) continue;
							if (banReason !== "") {
								if (hasNonexistentBan) continue;
								if (!hasNonexistentWhitelist) continue;
							}
						}
					}
					abilityPool.push(ability);
				}
				if (ruleTable.check("ability:noability")) {
					this.enforceCustomPoolSizeNoComplexBans(
						"ability",
						abilityPool,
						this.maxTeamSize,
						"Max Team Size"
					);
				}
			}
		}

		// Move Pool
		const setMoveCount = ruleTable.maxMoveCount;
		let movePool: Move[] = [];
		if (!hasCustomBans) {
			movePool = [...this.dex.moves.all()].filter(
				(move) => move.gen <= this.gen && !move.isNonstandard
			);
		} else {
			const hasAllMovesBan = ruleTable.check("pokemontag:allmoves");
			for (const move of this.dex.moves.all()) {
				let banReason = ruleTable.check("move:" + move.id);
				if (banReason) continue;
				if (banReason !== "") {
					if (hasAllMovesBan) continue;
					if (move.isNonstandard) {
						banReason = ruleTable.check(
							"pokemontag:" + toID(move.isNonstandard)
						);
						if (banReason) continue;
						if (
							banReason !== "" &&
							move.isNonstandard !== "Unobtainable"
						) {
							if (hasNonexistentBan) continue;
							if (!hasNonexistentWhitelist) continue;
						}
					}
				}
				movePool.push(move);
			}
			this.enforceCustomPoolSizeNoComplexBans(
				"move",
				movePool,
				this.maxTeamSize * setMoveCount,
				"Max Team Size * Max Move Count"
			);
		}

		// Nature Pool
		const doNaturesExist = this.gen > 2;
		let naturePool: Nature[] = [];
		if (doNaturesExist) {
			if (!hasCustomBans) {
				naturePool = [...this.dex.natures.all()];
			} else {
				const hasAllNaturesBan = ruleTable.check("pokemontag:allnatures");
				for (const nature of this.dex.natures.all()) {
					let banReason = ruleTable.check("nature:" + nature.id);
					if (banReason) continue;
					if (banReason !== "" && nature.id) {
						if (hasAllNaturesBan) continue;
						if (nature.isNonstandard) {
							banReason = ruleTable.check(
								"pokemontag:" + toID(nature.isNonstandard)
							);
							if (banReason) continue;
							if (
								banReason !== "" &&
								nature.isNonstandard !== "Unobtainable"
							) {
								if (hasNonexistentBan) continue;
								if (!hasNonexistentWhitelist) continue;
							}
						}
					}
					naturePool.push(nature);
				}
				// There is no 'nature:nonature' rule so do not constrain pool size
			}
		}

		const randomN = this.randomNPokemon(
			this.maxTeamSize,
			this.forceMonotype,
			undefined,
			hasCustomBans ? ruleTable : undefined
		);

		const team = [];
		for (const forme of randomN) {
			// Choose forme
			const species = this.dex.species.get(forme);

			// Random unique item
			let item = "";
			let itemData;
			let isBadItem;
			if (doItemsExist) {
				// We discard TRs and Balls with 95% probability because of their otherwise overwhelming presence
				do {
					itemData = this.sampleNoReplace(itemPool);
					item = itemData?.name;
					isBadItem = item.startsWith("TR") || itemData.isPokeball;
				} while (
					isBadItem &&
					this.randomChance(19, 20) &&
					itemPool.length > this.maxTeamSize
				);
			}

			// Random unique ability
			let ability = "No Ability";
			let abilityData;
			if (doAbilitiesExist) {
				abilityData = this.sampleNoReplace(abilityPool);
				ability = abilityData?.name;
			}

			// Random unique moves
			const m = [];
			do {
				const move = this.sampleNoReplace(movePool);
				m.push(move.id);
			} while (m.length < setMoveCount);

			// Random EVs
			const evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
			if (this.gen === 6) {
				let evpool = 510;
				do {
					const x = this.sample(Dex.stats.ids());
					const y = this.random(Math.min(256 - evs[x], evpool + 1));
					evs[x] += y;
					evpool -= y;
				} while (evpool > 0);
			} else {
				for (const x of Dex.stats.ids()) {
					evs[x] = this.random(256);
				}
			}

			// Random IVs
			const ivs: StatsTable = {
				hp: this.random(32),
				atk: this.random(32),
				def: this.random(32),
				spa: this.random(32),
				spd: this.random(32),
				spe: this.random(32),
			};

			// Random nature
			let nature = "";
			if (doNaturesExist && naturePool.length > 0) {
				nature = this.sample(naturePool).name;
			}

			// Level balance
			const mbstmin = 1307;
			const stats = species.baseStats;
			let mbst = stats["hp"] * 2 + 31 + 21 + 100 + 10;
			mbst += stats["atk"] * 2 + 31 + 21 + 100 + 5;
			mbst += stats["def"] * 2 + 31 + 21 + 100 + 5;
			mbst += stats["spa"] * 2 + 31 + 21 + 100 + 5;
			mbst += stats["spd"] * 2 + 31 + 21 + 100 + 5;
			mbst += stats["spe"] * 2 + 31 + 21 + 100 + 5;

			let level;
			if (this.adjustLevel) {
				level = this.adjustLevel;
			} else {
				level = Math.floor((100 * mbstmin) / mbst);
				while (level < 100) {
					mbst = Math.floor(
						((stats["hp"] * 2 + 31 + 21 + 100) * level) / 100 + 10
					);
					mbst += Math.floor(
						((((stats["atk"] * 2 + 31 + 21 + 100) * level) / 100 + 5) *
							level) /
							100
					);
					mbst += Math.floor(
						((stats["def"] * 2 + 31 + 21 + 100) * level) / 100 + 5
					);
					mbst += Math.floor(
						((((stats["spa"] * 2 + 31 + 21 + 100) * level) / 100 + 5) *
							level) /
							100
					);
					mbst += Math.floor(
						((stats["spd"] * 2 + 31 + 21 + 100) * level) / 100 + 5
					);
					mbst += Math.floor(
						((stats["spe"] * 2 + 31 + 21 + 100) * level) / 100 + 5
					);
					if (mbst >= mbstmin) break;
					level++;
				}
			}

			// Random happiness
			const happiness = this.random(256);

			// Random shininess
			const shiny = this.randomChance(1, 1024);

			const set: PokemonSet = {
				name: species.baseSpecies,
				species: species.name,
				gender: species.gender,
				item,
				ability,
				moves: m,
				evs,
				ivs,
				nature,
				level,
				happiness,
				shiny,
			};
			if (this.gen === 9) {
				// Random Tera type
				set.teraType = this.sample(this.dex.types.all()).name;
			}
			team.push(set);
		}

		return team;
	}
}

export default RandomTeams;
