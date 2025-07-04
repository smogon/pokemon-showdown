import { type ObjectReadWriteStream } from "../../lib/streams";
import { BattlePlayer, range } from "../battle-stream";
import { PRNG, type PRNGSeed } from "../prng";
import {
	type PokemonSwitchRequestData,
	type MoveRequest,
	type SwitchRequest,
	type ChoiceRequest,
} from "../side";

/**
 * Configuration options for the RandomPlayerAI.
 */
interface RandomAIOptions {
	/** Probability (0..1) of choosing a move over a switch. Defaults to 1.0 (always move). */
	move?: number;
	/** Probability (0..1) of attempting Mega/Ultra/Dyna/Tera if possible. Defaults to 0. */
	mega?: number;
	/** Seed for deterministic RNG (optional). */
	seed?: PRNG | PRNGSeed | null;
}

/**
 * Represents a move choice with choice string and move data.
 */
type MoveChoice = {
	choice: string,
	move: {
		slot: number,
		move: string,
		target?: string,
		zMove: boolean,
	},
};

export class RandomPlayerAI extends BattlePlayer {
	/** Probability to choose a move over a switch */
	protected readonly move: number;
	/** Probability to attempt Mega/Ultra/Dyna/Tera */
	protected readonly mega: number;
	/** Our PRNG for random decisions */
	protected readonly prng: PRNG;

	/**
	 * Constructs a new RandomPlayerAI.
	 * @param playerStream - The stream linking us to the battle simulator.
	 * @param options - AI config for random seeds, move probabilities, etc.
	 * @param debug - Whether to enable debug logging.
	 */
	constructor(
		playerStream: ObjectReadWriteStream<string>,
		options: RandomAIOptions = {},
		debug = false
	) {
		super(playerStream, debug);
		this.move = options.move || 1.0;
		this.mega = options.mega || 0;
		this.prng = PRNG.get(options.seed);
	}

	/**
	 * Receives an error from showdown, record this info, if needed.
	 * @param error - The error thrown by showdown.
	 */
	receiveError(error: Error): void {
		console.warn(`Trainer Random Error Message: "${error}"`);
		if (error.message.startsWith("[Unavailable choice]")) {
			// We'll receive a follow-up request to fix the choice
			return;
		}
		if (error.message.startsWith("[Invalid choice] Can't switch:")) {
			// We tried to switch but can't. We'll just wait for a new request.
			return;
		}
	}

	/**
	 * Receives a request from the battle engine and returns our chosen action(s).
	 * @param request - The Showdown request data (forceSwitch, active, side, etc.).
	 * @returns A string that represents our decisions (moves, switches, etc.).
	 */
	receiveRequest(request: ChoiceRequest): string | undefined {
		// If the request is to wait, we do nothing.
		if (request.wait) {
			return undefined;
		}

		// If forced to switch
		if (request.forceSwitch) {
			return this.handleForceSwitch(request);
		}

		// If we need to choose moves
		if ("active" in request) {
			return this.handleMoveRequest(request);
		}

		// Possibly team preview; default to "default"
		return this.chooseTeamPreview(request.side.pokemon);
	}

	/**
	 * Handles the forced-switch scenario.
	 * e.g., after a KO or U-turn, we must switch out.
	 *
	 * @param request - The Showdown request forcing a switch.
	 * @returns A comma-separated list of switch commands or "pass" if none possible.
	 */
	protected handleForceSwitch(request: SwitchRequest): string {
		const side = request.side;
		const pokemon = side.pokemon;
		const mustSwitchFlags = request.forceSwitch || [];
		const chosenSlots: number[] = [];

		const commands = mustSwitchFlags.map((mustSwitch, slotIndex) => {
			if (!mustSwitch) return "pass";

			// Identify valid bench slots
			const validSwitches = range(1, 6).filter(benchSlot => {
				const benchPoke = pokemon[benchSlot - 1];
				if (!benchPoke) return false;
				// skip active slots
				if (benchSlot <= mustSwitchFlags.length) return false;
				// skip if already chosen
				if (chosenSlots.includes(benchSlot)) return false;
				// skip fainted unless it's reviving
				const fainted = benchPoke.condition.endsWith(" fnt");
				if (fainted && !benchPoke.reviving) return false;
				return true;
			});

			if (!validSwitches.length) return "pass";

			const chosen = this.chooseSwitch(
				validSwitches.map(slot => ({ slot, pokemon: pokemon[slot - 1] }))
			);
			chosenSlots.push(chosen);
			return `switch ${chosen}`;
		});

		return commands.join(", ");
	}

	/**
	 * Handles the normal "active move" scenario.
	 * We might choose to move or to switch out randomly.
	 *
	 * @param request - The Showdown request to choose moves.
	 * @returns Our chosen commands (moves, switch, etc.).
	 */
	protected handleMoveRequest(request: MoveRequest): string {
		const side = request.side;
		const myPokemon = side.pokemon;
		const chosenSlots: number[] = [];
		const activeSlots = request.active || [];

		const commands = activeSlots.map((active, i) => {
			// If fainted or un-command-able, pass.
			if (
				myPokemon[i].condition.endsWith(" fnt") ||
				myPokemon[i].commanding
			) {
				return "pass";
			}

			// Track transformations
			let canMegaEvo = !!active.canMegaEvo;
			let canUltraBurst = !!active.canUltraBurst;
			let canZMove = !!active.canZMove;
			let canDynamax = !!active.canDynamax;
			let canTerastallize = !!active.canTerastallize;

			// Possibly decide to transform (mega/dyna/tera/etc.)
			const doTransform =
				(canMegaEvo || canUltraBurst || canDynamax) &&
				this.prng.random() < this.mega;

			// If forced to use maxMoves or if deciding to transform with dynamax
			const usingMaxMoves =
				(!active.canDynamax && active.maxMoves) ||
				(doTransform && canDynamax);
			const rawMoves = usingMaxMoves ?
				active.maxMoves!.maxMoves :
				active.moves;

			// Build a list of possible move objects
			const moveObjs = range(1, rawMoves.length)
				.filter(idx => !rawMoves[idx - 1].disabled)
				.map(idx => {
					const rm = rawMoves[idx - 1];
					return {
						slot: idx,
						move: rm.move,
						target: rm.target,
						zMove: false,
					};
				});

			// Also consider Z-moves
			if (canZMove && active.canZMove) {
				for (let z = 0; z < active.canZMove.length; z++) {
					const zInfo = active.canZMove[z];
					if (zInfo) {
						moveObjs.push({
							slot: z + 1,
							move: zInfo.move,
							target: zInfo.target,
							zMove: true,
						});
					}
				}
			}

			// Filter out "adjacentAlly" if no ally alive
			const hasAlly =
				myPokemon.length > 1 &&
				!myPokemon[i ^ 1].condition.endsWith(" fnt");
			const finalMoves = moveObjs.filter(
				m => m.target !== "adjacentAlly" || hasAlly
			);

			// Potential switches
			const validSwitchSlots = range(1, 6).filter(benchSlot => {
				const benchPoke = myPokemon[benchSlot - 1];
				if (!benchPoke) return false;
				if (benchPoke.active) return false;
				if (chosenSlots.includes(benchSlot)) return false;
				if (benchPoke.condition.endsWith(" fnt")) return false;
				return true;
			});
			const canSwitch = active.trapped ? [] : validSwitchSlots;

			// Decide if we switch or pick a move
			if (
				canSwitch.length &&
				(!finalMoves.length || this.prng.random() > this.move)
			) {
				// Switch out
				const switchTarget = this.chooseSwitch(
					canSwitch.map(slot => ({ slot, pokemon: myPokemon[slot - 1] }))
				);
				chosenSlots.push(switchTarget);
				return `switch ${switchTarget}`;
			}

			if (!finalMoves.length) {
				// No moves => error or pass
				return "pass";
			}

			// We must supply an array of { choice, move } objects to chooseMove
			const moveChoices: MoveChoice[] = finalMoves.map(mOpt => {
				// Build a "choice" string e.g. "move 2"
				let choiceStr = `move ${mOpt.slot}`;

				// If multi-battle, we might pick a target
				// (For simplicity, pick random foe or ally if needed)
				if (request.active && request.active.length > 1) {
					if (
						["normal", "any", "adjacentFoe"].includes(mOpt.target ?? "")
					) {
						choiceStr += ` ${1 + Math.floor(this.prng.random() * 2)}`;
					}
					if (mOpt.target === "adjacentAlly") {
						choiceStr += ` -${(i ^ 1) + 1}`;
					} else if (mOpt.target === "adjacentAllyOrSelf") {
						if (hasAlly) {
							choiceStr += ` -${1 + Math.floor(this.prng.random() * 2)}`;
						} else {
							choiceStr += ` -${i + 1}`;
						}
					}
				}
				if (mOpt.zMove) {
					choiceStr += " zmove";
				}

				return {
					choice: choiceStr,
					move: {
						slot: mOpt.slot,
						move: mOpt.move,
						target: mOpt.target,
						zMove: mOpt.zMove,
					},
				};
			});

			// Pick one move
			const chosenMove = this.chooseMove(moveChoices);

			// If Z-move, we can't Z-move again
			if (chosenMove.endsWith(" zmove")) {
				canZMove = false;
				return chosenMove;
			}

			// If we decided to transform
			if (doTransform) {
				if (canTerastallize) {
					canTerastallize = false;
					return `${chosenMove} terastallize`;
				} else if (canDynamax) {
					canDynamax = false;
					return `${chosenMove} dynamax`;
				} else if (canMegaEvo) {
					canMegaEvo = false;
					return `${chosenMove} mega`;
				} else if (canUltraBurst) {
					canUltraBurst = false;
					return `${chosenMove} ultra`;
				}
			}

			// Otherwise just return the chosen move
			return chosenMove;
		});

		return commands.join(", ");
	}

	/**
	 * Chooses a team order or lead at Team Preview.
	 * By default, we just return "default".
	 * @param team - Array of our side's Pokémon info.
	 * @returns The team order command.
	 */
	protected chooseTeamPreview(team: PokemonSwitchRequestData[]): string {
		return "default";
	}

	/**
	 * Picks randomly from a list of move choices.
	 * Each element has {choice: string, move: MoveChoice}.
	 *
	 * @param moves - A list of possible moves, each with a "choice" string.
	 * @returns The "choice" string of the randomly picked move.
	 */
	protected chooseMove(moves: MoveChoice[]): string {
		return this.prng.sample(moves).choice;
	}

	/**
	 * Picks randomly from a list of possible switch targets.
	 *
	 * @param switches - An array of objects with {slot, pokemon}.
	 * @returns The slot number of the chosen switch target.
	 */
	protected chooseSwitch(
		switches: { slot: number, pokemon: PokemonSwitchRequestData }[]
	): number {
		return this.prng.sample(switches).slot;
	}
}
