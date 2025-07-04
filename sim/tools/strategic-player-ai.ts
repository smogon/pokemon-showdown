import { BattlePlayer } from "../battle-stream";
import { Dex, PRNG, toID } from "../../sim"; // assuming relevant imports for Dex and PRNG utilities
import {
	type PokemonSwitchRequestData,
	type ChoiceRequest,
	type MoveRequest,
	type PokemonMoveRequestData,
	type SwitchRequest,
	type TeamPreviewRequest,
} from "../side";

interface IActivePokemonRequest {
	moves: { move: string, id: string, pp: number, disabled: boolean }[];
	// ... other fields like maybe canMega, canTerastal, etc., if any
}

// Define MoveOption type to represent a move choice in the context of the AI
type MoveOption = {
	id: string,
	move?: string,
	pp?: number,
	disabled?: boolean,
};

// HeuristicsAIOptions for passing optional seed or difficulty
export interface HeuristicsAIOptions {
	seed?: PRNG | PRNGSeed | null;
	difficulty?: number;
}

export class StrongHeuristicsAI extends BattlePlayer {
	protected activeTracker: {
		myActive?: {
			pokemon: PokemonSwitchRequestData,
			currentHp: number,
			currentHpPercent: number,
			boosts: { [s: string]: number },
			stats: { [s: string]: number },
			currentAbility: string,
			currentTypes: string[],
		},
		opponentActive?: {
			pokemon: PokemonSwitchRequestData,
			currentHp: number,
			currentHpPercent: number,
			boosts: { [s: string]: number },
			stats: { [s: string]: number },
			currentAbility: string,
			currentTypes: string[],
		},
		myTeam: PokemonSwitchRequestData[],
		opponentTeam: PokemonSwitchRequestData[],
	};
	protected readonly prng: PRNG;
	protected readonly difficulty: number;

	// Behavioral parameters (can be tuned for difficulty)
	private speedTierCoefficient = 4.0;
	private trickRoomCoefficient = 1.0;
	private typeMatchupWeight = 2.5;
	private moveDamageWeight = 0.8;
	private antiBoostWeight = 25;
	private hpWeight = 0.25;
	private hpFractionCoefficient = 0.4;
	private boostWeightCoefficient = 1;
	private switchOutMatchupThreshold = -3;
	private lastSwitchTurn: number | null = null;
	private switchLockTurns = 2;
	private faintThresholdPercent = 0.1;
	private protectProbability = 0.15;
	private hpSwitchOutThreshold = 0.3;
	private currentWeather: string | null = null;

	// track last move used (by move ID) for each active slot
	private lastMove: { [activeSlot: number]: string } = {};

	// moves that were found to be disabled (via Imprison/Disable) to avoid retrying
	private disabledMoves = new Set<string>();

	// whether Stealth Rock has been set on opponent's side
	private stealthRockSet = false;

	// how many layers of Spikes set on opponent's side
	private spikesLayers = 0;

	constructor(
		playerStream: any,
		options: HeuristicsAIOptions = {},
		debug = false
	) {
		super(playerStream, debug);
		this.activeTracker = { myTeam: [], opponentTeam: [] };
		this.prng = PRNG.get(options.seed);
		this.difficulty = options.difficulty || 3;
	}

	/**
	 * Called if our chosen action is invalid (e.g. a move was disabled or otherwise unusable).
	 * We parse the error to avoid repeating the same mistake on the next choice.
	 */
	receiveError(error: Error): void {
		console.warn(`AI Error: "${error}"`);
		const [, suffix, message] =
			/^\[(.*?)\] (.*?): (.*)$/.exec(error.message) || [];
		if (suffix === "Can't move") {
			// A move we chose cannot be used (likely disabled by Imprison/Disable).
			// Extract the move name from the error message and mark it as disabled.
			const disabledMoveMatch = /'s (.+) is disabled/.exec(message);
			if (disabledMoveMatch) {
				const moveName = disabledMoveMatch[1];
				const moveId = toID(moveName); // convert to lowercase id
				this.disabledMoves.add(moveId);
			}
			// We will get a new |request| after this, and our receiveRequest will choose a different move.
		}
	}

	/**
	 * Main entry: handle a new request from the battle engine.
	 * This covers move selection, forced switches (after KO), and team preview.
	 */
	receiveRequest(request: ChoiceRequest): string {
		if (request.wait) {
			return ``;
		}
		// Track weather if present in the request (some formats include weather in request).
		if ((request as any).weather) {
			this.currentWeather = (request as any).weather || null;
		}
		if (request.forceSwitch) {
			// One of our Pokémon fainted or must switch out (e.g. U-turn effect).
			return this.handleForceSwitch(request);
		} else if ("active" in request) {
			// It's our turn to choose a move (or possibly to mega evolve / Z-move, but we focus on move).
			return this.chooseMove(request);
		} else {
			// Team Preview phase (request.teamPreview likely true)
			return this.chooseTeamPreview(request);
		}
	}

	/**
	 * Handle forced switch decisions (after a KO or pivoting move).
	 * We choose the best replacement Pokémon for each slot that must switch.
	 */
	private handleForceSwitch(request: SwitchRequest): string {
		const side = request.side;
		const forceSwitchSlots = request.forceSwitch || [];
		if (!side?.pokemon) return `pass`;

		const actions: string[] = [];
		const alreadyChosen = new Set<number>();
		forceSwitchSlots.forEach((mustSwitch, slotIndex) => {
			if (!mustSwitch) {
				// No switch required in this slot (e.g. in doubles, the other slot might need switching).
				actions.push(`pass`);
				return;
			}
			// Determine which of our bench Pokémon can switch in (not fainted, not already active).
			const availableMons = side.pokemon
				.map((p, idx) => ({ mon: p, idx: idx + 1 }))
				.filter(({ mon, idx }) => {
					if (mon.condition.endsWith(" fnt") || mon.active) return false;
					if (alreadyChosen.has(idx)) return false;
					return true;
				});
			if (!availableMons.length) {
				actions.push(`pass`);
				return;
			}
			// Pick the best switch-in based on matchup evaluation
			const bestSlot = this.chooseBestSwitch(
				availableMons.map(x => x.mon),
				request
			);
			alreadyChosen.add(bestSlot);
			// Reset move history for that slot (new Pokémon coming in has no last move)
			delete this.lastMove[slotIndex];
			actions.push(`switch ${bestSlot}`);
		});
		return actions.join(", ");
	}

	/**
	 * Decide a move for each active Pokémon we have on the field.
	 */
	private chooseMove(request: MoveRequest): string {
		this.updateActiveTracker(request);
		const side = request.side;
		const activeSlots = request.active;
		if (!side || !activeSlots) return `pass`;

		const decisions: string[] = activeSlots.map((active, index) => {
			const sidePoke = side.pokemon[index];
			if (!sidePoke || sidePoke.condition.endsWith(" fnt")) {
				return `pass`; // Pokémon is fainted (shouldn't happen in a move request normally)
			}
			// Get all available moves (excluding disabled or out-of-PP moves).
			const availableMoves = this.getAvailableMoves(active);
			if (!availableMoves.length) {
				return `pass`; // No moves can be chosen (rare; could happen if all moves disabled => will struggle)
			}

			// Consider if we should switch out instead of attacking
			const canSwitchTargets = this.canSwitch(request);
			const shouldSwitch = this.shouldSwitchOut(request, index);
			if (shouldSwitch && canSwitchTargets.length > 0) {
				// Determine switch chance based on AI difficulty (higher difficulty => more likely to execute smart switch)
				const switchSuccessProb = this.skillToSuccessProbability(
					this.difficulty,
					"switch"
				);
				if (this.prng.random() < switchSuccessProb) {
					const bestSwitchSlot = this.chooseBestSwitch(
						canSwitchTargets,
						request
					);
					// Clear last move for this slot since we are switching
					delete this.lastMove[index];
					return `switch ${bestSwitchSlot}`;
				}
			}

			// Occasionally attempt a Protect if beneficial (to scout or stall)
			if (this.prng.random() < this.protectProbability) {
				const protectMoveIndex = availableMoves.findIndex(
					m => Dex.getActiveMove(m.id)?.id === "protect"
				);
				if (protectMoveIndex >= 0 && this.lastMove[index] !== "protect") {
					// Use Protect (avoid double-protect attempts back-to-back)
					this.lastMove[index] = "protect";
					return `move ${protectMoveIndex + 1}`;
				}
			}

			// Otherwise, choose the best move to use
			const moveChoice = this.chooseBestMove(availableMoves, request, index);
			return moveChoice;
		});

		return decisions.join(", ");
	}

	/**
	 * Choose the best lead Pokémon order at team preview (if applicable).
	 * This simple implementation picks the Pokémon with the overall best matchups as lead.
	 */
	private chooseTeamPreview(request: TeamPreviewRequest): string {
		const side = request.side;
		if (!side?.pokemon?.length || !side.foePokemon?.length) {
			return `default`;
		}
		let bestLeadIndex = 0;
		let bestLeadScore = -Infinity;
		// Evaluate each of our team Pokémon against the opponent’s team
		for (let i = 0; i < side.pokemon.length; i++) {
			const candidate = side.pokemon[i];
			if (!candidate || candidate.condition.endsWith(" fnt")) continue;
			let totalScore = 0;
			for (const foeMon of side.foePokemon) {
				totalScore += this.evaluateMatchup(candidate, foeMon);
			}
			if (totalScore > bestLeadScore) {
				bestLeadScore = totalScore;
				bestLeadIndex = i;
			}
		}
		// Put the best lead first, keep the rest of the order as-is
		const teamOrder = [
			bestLeadIndex,
			...Array.from({ length: side.pokemon.length }, (_, i) => i).filter(
				x => x !== bestLeadIndex
			),
		];
		return `team ${teamOrder.map(i => i + 1).join(",")}`;
	}

	/**
	 * Determines if we should switch out the active Pokémon at the given slot.
	 * Considers low HP, bad matchups, stat drops, etc.
	 */
	private shouldSwitchOut(request: MoveRequest, slotIndex: number): boolean {
		this.updateActiveTracker(request);
		const me = this.activeTracker.myActive;
		const foe = this.activeTracker.opponentActive;
		if (!me || !foe) return false;

		const myPokemon = me.pokemon;
		const foePokemon = foe.pokemon;

		// Avoid immediate switch back if we just switched this Pokémon in (to prevent ping-pong switching)
		const currentTurn = (request as any).turn || 0;
		if (
			this.lastSwitchTurn !== null &&
			currentTurn - this.lastSwitchTurn < this.switchLockTurns
		) {
			// We switched recently; hold off on switching again so soon.
			return false;
		}
		// Can't switch out if trapped by Mean Look/Shadow Tag etc. (Showdown marks Pokemon as trapped)
		if ((myPokemon as any).trapped) {
			return false;
		}
		// Emergency switch: extremely low HP and opponent is faster (to preserve the Pokémon)
		const myHPPercent = me.currentHpPercent;
		if (
			myHPPercent < this.faintThresholdPercent &&
			me.stats.spe < foe.stats.spe &&
			this.canSwitch(request).length > 0
		) {
			this.lastSwitchTurn = currentTurn;
			return true;
		}
		// If the matchup is very unfavorable, consider switching
		const matchupScore = this.evaluateMatchup(myPokemon, foePokemon);
		if (
			matchupScore < this.switchOutMatchupThreshold &&
			this.canSwitch(request).length > 0
		) {
			this.lastSwitchTurn = currentTurn;
			return true;
		}
		// If our key offensive stats are heavily debuffed, it may be better to switch out and reset
		if ((me.boosts.atk || 0) <= -3 && me.stats.atk >= me.stats.spa) {
			this.lastSwitchTurn = currentTurn;
			return true;
		}
		if ((me.boosts.spa || 0) <= -3 && me.stats.spa >= me.stats.atk) {
			this.lastSwitchTurn = currentTurn;
			return true;
		}
		// If HP is below a certain threshold, consider a safe switch (if not already handled by above)
		if (
			myHPPercent < this.hpSwitchOutThreshold &&
			this.canSwitch(request).length > 0
		) {
			this.lastSwitchTurn = currentTurn;
			return true;
		}

		return false;
	}

	/**
	 * Select the best move from a list of available moves for a given active Pokémon.
	 * Evaluates damage (or utility) output for each move and returns the chosen move command.
	 */
	private chooseBestMove(
		moves: MoveOption[],
		request: MoveRequest,
		slotIndex: number
	): string {
		const me = this.activeTracker.myActive;
		const foe = this.activeTracker.opponentActive;
		if (!me || !foe) {
			// Default to first move if somehow we lack tracker info (shouldn't happen if updateActiveTracker was called)
			return `move 1`;
		}

		let bestMove: MoveOption = moves[0];
		let bestValue = -Infinity;
		let secondBestMove: MoveOption | null = null;
		let secondBestValue = -Infinity;

		for (const moveOption of moves) {
			const moveData = Dex.getActiveMove(moveOption.id);
			if (!moveData) continue;
			let moveValue = 0;
			if (moveData.category === "Status") {
				// Evaluate status, hazard, or stat-boosting moves
				moveValue = this.evaluateStatusMove(
					moveOption,
					me.pokemon,
					foe.pokemon
				);
			} else {
				// Offensive move: estimate damage or damage impact
				const foeCurrentHP = this.getCurrentHP(foe.pokemon.condition);
				const predictedDamage = this.estimateDamage(
					moveOption,
					me.pokemon,
					foe.pokemon
				);
				// Base weight: favor moves that deal more damage
				moveValue = predictedDamage * this.moveDamageWeight;
				// If this move can KO the opponent from current HP, give it a significant bonus
				if (predictedDamage >= foeCurrentHP) {
					moveValue += 40;
					// If opponent has a safe switch-in that is immune to this move’s type, be slightly less all-in
					// (we reduce the bonus to avoid always going for a move that the opponent can completely nullify)
					const moveType = moveData.type;
					for (const oppMon of this.activeTracker.opponentTeam) {
						if (!oppMon.condition.endsWith(" fnt")) {
							const type1 = oppMon.types[0],
								type2 = oppMon.types[1] || "";
							const effectiveness =
								Dex.getEffectiveness(moveType, type1) *
								(type2 ? Dex.getEffectiveness(moveType, type2) : 1);
							if (effectiveness === 0) {
								// An opponent has an immunity to this move type
								moveValue -= 20; // reduce the KO bonus, anticipating a possible switch
								break;
							}
						}
					}
				}
			}
			// Track top two moves by value
			if (moveValue > bestValue) {
				secondBestValue = bestValue;
				secondBestMove = bestMove;
				bestValue = moveValue;
				bestMove = moveOption;
			} else if (moveValue > secondBestValue) {
				secondBestValue = moveValue;
				secondBestMove = moveOption;
			}
		}

		// Avoid repeating the same move consecutively if a nearly-as-good alternative exists (to be less predictable)
		if (
			secondBestMove &&
			bestMove.id === this.lastMove[slotIndex] &&
			secondBestValue >= 0.9 * bestValue
		) {
			bestMove = secondBestMove;
			bestValue = secondBestValue;
		}

		// Determine target in multi-target formats (if doubles/triples, pick the best enemy target for this move)
		const targetIndex = this.chooseMoveTarget(bestMove, request, slotIndex);
		// Get the move index as per the request's move list (to format the command properly)
		const moveIndex =
			request.active[slotIndex].moves.findIndex(
				m => m.id === bestMove.id
			) + 1;

		// If the chosen move is a hazard or similar, update our internal tracking so we don’t repeat it unnecessarily
		const chosenMoveId = Dex.getActiveMove(bestMove.id)?.id || bestMove.id;
		if (chosenMoveId === "stealthrock") {
			this.stealthRockSet = true;
		} else if (chosenMoveId === "spikes") {
			this.spikesLayers = Math.min(3, this.spikesLayers + 1);
		}

		// Record this move as the last move used for this slot (for repetition checks next turn)
		this.lastMove[slotIndex] = chosenMoveId;

		// Get complete move data to check target type
		const moveData = Dex.getActiveMove(bestMove.id);
		const isMultiActive =
			(request.active as IActivePokemonRequest[]).length > 1;

		// Return the move command string
		if (isMultiActive) {
			// Check if move targets self/allies or doesn't need a target
			const isSelfTargeting =
				moveData &&
				(moveData.target === "self" ||
					moveData.target === "allySide" ||
					moveData.target === "allyTeam" ||
					moveData.target === "allies");

			// Only specify target for moves that target opponents
			if (!isSelfTargeting) {
				return `move ${moveIndex} ${targetIndex}`;
			}
		}

		// For singles or self-targeting moves in doubles, don't specify target
		return `move ${moveIndex}`;
	}

	/**
	 * Evaluate the utility of a status or non-damaging move.
	 * Returns a heuristic value representing its usefulness in the current situation.
	 */
	private evaluateStatusMove(
		move: MoveOption,
		myPoke: PokemonSwitchRequestData,
		foePoke: PokemonSwitchRequestData
	): number {
		const moveData = Dex.getActiveMove(move.id);
		if (!moveData) return 0;
		const moveId = moveData.id;
		const foeStatused = foePoke.status && foePoke.status !== "none";
		let value = 0;
		switch (moveId) {
		case "willowisp":
			// Will-O-Wisp: Valuable if foe is physical attacker, not already statused, and not immune to burn
			if (
				!foeStatused &&
				foePoke.stats.atk > foePoke.stats.spa &&
				!foePoke.types.includes("Fire")
			) {
				value = 35;
			}
			break;
		case "thunderwave":
			// Thunder Wave: Valuable if foe is faster and not statused, and is not Ground-type or Electric-type
			if (
				!foeStatused &&
				foePoke.stats.spe > myPoke.stats.spe &&
				!foePoke.types.includes("Ground") &&
				!foePoke.types.includes("Electric")
			) {
				value = 30;
			}
			break;
		case "swordsdance":
		case "nastyplot":
			// Boosting moves: Only use if we haven’t boosted much yet and our Pokémon can make use of it
			const isPhysical = moveId === "swordsdance";
			const currentBoost = isPhysical ?
				myPoke.boosts.atk || 0 :
				myPoke.boosts.spa || 0;
			const suitableAttacker = isPhysical ?
				myPoke.stats.atk >= myPoke.stats.spa :
				myPoke.stats.spa >= myPoke.stats.atk;
			if (currentBoost < 2 && suitableAttacker) {
				value = 20;
			}
			break;
		case "stealthrock":
			// Stealth Rock: Use only if not already set on opponent’s side
			if (!this.stealthRockSet) {
				value = 20;
			}
			break;
		case "spikes":
			// Spikes: Use only if we have fewer than 3 layers set on opponent’s side
			if (this.spikesLayers < 3) {
				value = 15;
			}
			break;
			// ... other status moves like Recover, Light Screen could be evaluated if needed
		default:
			value = 0;
		}
		return value;
	}

	/**
	 * Estimate the damage an attacking Pokémon (atkSide) would deal to a defending Pokémon (defSide) using the given move.
	 * Uses a simplified version of the Pokémon damage formula, incorporating key Gen 9 factors.
	 */
	private estimateDamage(
		moveOption: MoveOption,
		atkSide: PokemonSwitchRequestData,
		defSide: PokemonSwitchRequestData
	): number {
		const move = Dex.getActiveMove(moveOption.id);
		if (!move?.basePower) return 0;
		let basePower = move.basePower;
		// Handle multi-hit moves by using average hits
		if (move.multihit) {
			if (Array.isArray(move.multihit)) {
				const [minHits, maxHits] = move.multihit;
				basePower *= (minHits + maxHits) / 2;
			} else {
				basePower *= move.multihit;
			}
		}

		// Determine attack vs defense stats
		const isPhysical = move.category === "Physical";
		const attackStatName: "atk" | "spa" = isPhysical ? "atk" : "spa";
		const defenseStatName: "def" | "spd" = isPhysical ? "def" : "spd";
		let atkStat = atkSide.stats[attackStatName];
		let defStat = defSide.stats[defenseStatName];

		// Apply stat stage boosts/drops
		atkStat *= this.getBoostMultiplier(atkSide.boosts[attackStatName] || 0);
		defStat *= this.getBoostMultiplier(defSide.boosts[defenseStatName] || 0);

		// Attack boosting abilities (Huge Power, Pure Power double physical attack)
		const attackerAbility = (
			atkSide.ability ||
			atkSide.baseAbility ||
			""
		).toLowerCase();
		if (
			isPhysical &&
			(attackerAbility === "hugepower" || attackerAbility === "purepower")
		) {
			atkStat *= 2;
		}
		// Apply attacker items like Choice Band/Specs that boost offense
		const attackerItem = atkSide.item.toLowerCase();
		if (
			isPhysical &&
			(attackerItem.includes("choice band") ||
				attackerItem.includes("choiceband"))
		) {
			atkStat *= 1.5;
		}
		if (
			!isPhysical &&
			(attackerItem.includes("choice specs") ||
				attackerItem.includes("choicespecs"))
		) {
			atkStat *= 1.5;
		}

		// Start damage calculation (simplified):
		// damage = (((2 * Level / 5 + 2) * basePower * (Atk / Def)) / 50 + 2)
		const level = (atkSide as any).level || 100;
		let damage =
			(((2 * level) / 5 + 2) * basePower * atkStat) / defStat / 50 + 2;

		// STAB (Same Type Attack Bonus): 1.5× if move’s type matches one of attacker's types, 2× if Adaptability or similar
		const stab = atkSide.types.includes(move.type);
		if (stab) {
			if (attackerAbility === "adaptability") {
				damage *= 2.0;
			} else {
				damage *= 1.5;
			}
		}
		// Type effectiveness multiplier
		let typeEffect = 1;
		for (const defType of defSide.types) {
			const eff = Dex.getEffectiveness(move.type, defType);
			typeEffect *= eff;
			damage *= eff;
		}
		// Weather effects: Rain boosts Water and halves Fire; Sun boosts Fire and halves Water
		if (this.currentWeather === "raindance") {
			if (move.type === "Water") damage *= 1.5;
			if (move.type === "Fire") damage *= 0.5;
		} else if (this.currentWeather === "sunnyday") {
			if (move.type === "Fire") damage *= 1.5;
			if (move.type === "Water") damage *= 0.5;
		}
		// Burn penalty: Physical moves from a burned Pokémon deal half damage (unless ability negates it)
		if (
			isPhysical &&
			atkSide.status === "brn" &&
			attackerAbility !== "guts"
		) {
			damage *= 0.5;
		}
		// Item boosts: Life Orb (+30% damage) and Expert Belt (+20% if super-effective)
		if (attackerItem.includes("life orb")) {
			damage *= 1.3;
		}
		if (attackerItem.includes("expert belt") && typeEffect > 1) {
			damage *= 1.2;
		}
		// Final random factor (use average 0.925 as no specific random value during planning; the engine will apply actual randomness)
		damage *= 0.925;

		// Ensure damage is not negative
		if (damage < 0) damage = 0;
		return damage;
	}

	/**
	 * Determine the target slot for a move in double/triple battles. In singles, always returns 1.
	 * Currently, this simply targets the opponent that would take the most damage from the move.
	 */
	private chooseMoveTarget(
		move: MoveOption,
		request: MoveRequest,
		slotIndex: number
	): number {
		const foeSide = request.side?.foePokemon;
		if (
			!foeSide ||
			foeSide.length === 0 ||
			!request.active ||
			request.active.length <= 1
		) {
			return 1; // in singles, target 1 (the only opponent)
		}
		// Identify all active opposing Pokémon on the field
		const activeFoes: { slot: number, foe: PokemonSwitchRequestData }[] = [];
		foeSide.forEach((foeMon, idx) => {
			if (foeMon.active && !foeMon.condition.endsWith(" fnt")) {
				activeFoes.push({ slot: idx + 1, foe: foeMon });
			}
		});
		if (activeFoes.length === 0) return 1;
		const me = this.activeTracker.myActive;
		let bestTargetSlot = activeFoes[0].slot;
		let highestDamage = -Infinity;
		for (const { slot, foe } of activeFoes) {
			const dmg = this.estimateDamage(move, me!.pokemon, foe);
			const foeHP = this.getCurrentHP(foe.condition);
			if (dmg >= foeHP) {
				// If this move could KO this foe, target them immediately
				return slot;
			}
			if (dmg > highestDamage) {
				highestDamage = dmg;
				bestTargetSlot = slot;
			}
		}
		return bestTargetSlot;
	}

	/**
	 * Calculate a multiplier for a given stat boost stage.
	 * (e.g. +2 -> 1.5×, -1 -> ~0.67×, etc.)
	 */
	private getBoostMultiplier(boost: number): number {
		if (boost >= 0) {
			return (2 + boost) / 2;
		} else {
			return 2 / (2 - boost);
		}
	}

	/**
	 * List all Pokémon on our side that are available to switch in (not active and not fainted).
	 */
	private canSwitch(request: MoveRequest): PokemonSwitchRequestData[] {
		const side = request.side;
		if (!side?.pokemon) return [];
		return side.pokemon.filter(
			p => !p.active && !p.condition.endsWith(" fnt")
		);
	}

	/**
	 * Choose the best Pokémon from our bench to switch into battle.
	 * Uses matchup evaluation against the opponent’s current active Pokémon.
	 */
	private chooseBestSwitch(
		candidates: PokemonSwitchRequestData[],
		request: SwitchRequest | MoveRequest
	): number {
		const foeActive = this.activeTracker.opponentActive?.pokemon;
		if (!foeActive) {
			// Fallback: if no info, just pick the first valid candidate
			const firstIdx = request.side?.pokemon.indexOf(candidates[0]) || 0;
			return firstIdx + 1;
		}
		let bestScore = -Infinity;
		let bestCandidate = candidates[0];
		for (const candidate of candidates) {
			const score = this.evaluateMatchup(candidate, foeActive);
			if (score > bestScore) {
				bestScore = score;
				bestCandidate = candidate;
			}
		}
		const bestIndex = request.side?.pokemon.indexOf(bestCandidate);
		if (bestIndex === undefined || bestIndex < 0) {
			return 1;
		}
		return bestIndex + 1;
	}

	/**
	 * Evaluate how good the matchup is between `myPoke` and `foePoke`.
	 * Positive values mean an advantage for myPoke, negative means disadvantage.
	 */
	private evaluateMatchup(
		myPoke: PokemonSwitchRequestData,
		foePoke: PokemonSwitchRequestData
	): number {
		let score = 0;
		// Type matchup: how my Pokémon’s STAB types fare against the foe’s types
		const typeMultiplier = this.calculateTypeEffectiveness(
			myPoke.types,
			foePoke.types
		);
		score += typeMultiplier * this.typeMatchupWeight;
		// Speed advantage
		if (myPoke.stats.spe > foePoke.stats.spe) {
			score += this.speedTierCoefficient * this.trickRoomCoefficient;
		} else if (myPoke.stats.spe < foePoke.stats.spe) {
			score -= this.speedTierCoefficient * this.trickRoomCoefficient;
		}
		// Current HP difference
		const myHPFrac = this.getHPFraction(myPoke.condition);
		const foeHPFrac = this.getHPFraction(foePoke.condition);
		score +=
			(myHPFrac - foeHPFrac) * this.hpFractionCoefficient * this.hpWeight;
		// Stat boosts comparison
		const myBoostSum = this.sumBoosts(myPoke.boosts);
		const foeBoostSum = this.sumBoosts(foePoke.boosts);
		score += myBoostSum - foeBoostSum;
		// If foe is heavily boosted and we have an anti-boost move (like Haze), give a bonus for staying in
		if (this.isBoosted(foePoke) && this.hasAntiBoostMoves(myPoke)) {
			score += this.antiBoostWeight;
		}
		return score;
	}

	/** Sum all stat boosts for a Pokémon (to gauge overall boosted level). */
	private sumBoosts(boosts: { [s: string]: number }): number {
		let sum = 0;
		for (const stat in boosts) {
			sum += boosts[stat as keyof typeof boosts] || 0;
		}
		return sum;
	}

	/** Determine if a Pokémon has any significant positive boosts (above a certain threshold). */
	private isBoosted(poke: PokemonSwitchRequestData): boolean {
		const threshold = this.boostWeightCoefficient;
		return (
			(poke.boosts.atk || 0) > threshold ||
			(poke.boosts.def || 0) > threshold ||
			(poke.boosts.spa || 0) > threshold ||
			(poke.boosts.spd || 0) > threshold ||
			(poke.boosts.spe || 0) > threshold
		);
	}

	/** Check if a Pokémon has moves that can negate opponent boosts (e.g. Haze, Clear Smog). */
	private hasAntiBoostMoves(poke: PokemonSwitchRequestData): boolean {
		const antiBoostMoves = ["haze", "clearsmog", "spectralthief"];
		return poke.moves.some(m => antiBoostMoves.includes(toID(m)));
	}

	/** Compute combined type effectiveness of attacker’s types on defender’s types ( >1 means advantage, <1 disadvantage ). */
	private calculateTypeEffectiveness(
		attackerTypes: string[],
		defenderTypes: string[]
	): number {
		let mult = 1.0;
		for (const atkType of attackerTypes) {
			for (const defType of defenderTypes) {
				mult *= Dex.getEffectiveness(atkType, defType);
			}
		}
		return mult;
	}

	/** Helper to get current HP as a number from a condition string like "123/321" or "0 fnt". */
	private getCurrentHP(condition: string): number {
		// condition format: "<current>/<max> [status]" or "<current> fnt"
		const hpPart = condition.split(" ")[0];
		if (hpPart.includes("/")) {
			const [curr] = hpPart.split("/");
			return parseInt(curr) || 0;
		}
		// if condition is like "0 fnt"
		const currHP = parseInt(hpPart);
		return isNaN(currHP) ? 0 : currHP;
	}

	/** Helper to get HP fraction (current HP% of max) from condition string. */
	private getHPFraction(condition: string): number {
		const parts = condition.split(" ")[0].split("/");
		if (parts.length === 2) {
			const [curr, max] = parts;
			const currHP = parseInt(curr),
				maxHP = parseInt(max);
			if (maxHP) {
				return Math.max(0, Math.min(1, currHP / maxHP));
			}
		}
		return 0;
	}

	/** Convert AI "skill" (difficulty level) into a probability of making an optimal decision in certain scenarios. */
	private skillToSuccessProbability(
		difficulty: number,
		actionType: "move" | "switch"
	): number {
		// Higher difficulty yields higher chance to choose the optimal action.
		// For simplicity, scale difficulty (1-5) to a probability range. We can differentiate moves vs switches if needed.
		const base = Math.max(0, Math.min(1, (difficulty - 1) / 4)); // difficulty 1 => 0, 5 => 1
		if (actionType === "switch") {
			// Maybe make switching slightly less trigger-happy at lower skill
			return base;
		}
		return base;
	}

	/**
	 * Update our internal tracking of active Pokémon on each side (my side and opponent’s side).
	 * This should be called at the start of decision-making to have up-to-date info.
	 */
	private updateActiveTracker(request: MoveRequest): void {
		const side = request.side;
		if (!side) return;
		const foeTeam = side.foePokemon;
		// Identify our currently active Pokémon and opponent’s active Pokémon from the request data
		const myActive = side.pokemon.find(p => p.active);
		const oppActive = foeTeam?.find(p => p.active);
		if (!myActive || !oppActive) {
			// If either side has no active (shouldn't happen except maybe end of battle), just update teams
			this.activeTracker.myActive = undefined;
			this.activeTracker.opponentActive = undefined;
			this.activeTracker.myTeam = side.pokemon;
			this.activeTracker.opponentTeam = foeTeam || [];
			return;
		}
		// Update my active tracker
		this.activeTracker.myActive = {
			pokemon: myActive,
			currentHp: this.getCurrentHP(myActive.condition),
			currentHpPercent: this.getHPFraction(myActive.condition),
			boosts: myActive.boosts,
			stats: myActive.stats,
			currentAbility: myActive.ability || myActive.baseAbility || "",
			currentTypes: myActive.types,
		};
		// Update opponent active tracker
		this.activeTracker.opponentActive = {
			pokemon: oppActive,
			currentHp: this.getCurrentHP(oppActive.condition),
			currentHpPercent: this.getHPFraction(oppActive.condition),
			boosts: oppActive.boosts,
			stats: oppActive.stats,
			currentAbility: oppActive.ability || oppActive.baseAbility || "",
			currentTypes: oppActive.types,
		};
		// Update full team info
		this.activeTracker.myTeam = side.pokemon;
		this.activeTracker.opponentTeam = foeTeam || [];
	}

	/**
	 * Filter the moves that our active Pokémon can currently use, removing disabled or depleted moves.
	 */
	private getAvailableMoves(
		activeRequest: PokemonMoveRequestData
	): MoveOption[] {
		const moves: MoveOption[] = [];
		activeRequest.moves.forEach((move, idx) => {
			if (move.disabled) return;
			const moveId = move.id;
			if (this.disabledMoves.has(moveId)) return; // avoid moves we know are disabled (Imprison/Disable)
			if (move.pp === 0) return;
			// Represent the move option with its id and any other needed info
			moves.push({
				id: moveId,
				move: move.move,
				pp: move.pp,
				disabled: Boolean(move.disabled),
			});
		});
		return moves;
	}
}
