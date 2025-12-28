/**
 * Scavengers Games Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This plugin stores the different possible game modes and twists that take place in scavengers room
 *
 * @license MIT license
 */

import {
	type ModEvents,
	sanitizeAnswer,
	ScavengerHunt,
	type Scavenger,
	type ScavengerHuntFinish,
} from "./scavengers";
import { Utils } from "../../lib";

export enum TwistType {
	PerfectScore = "perfectscore",
	BonusRound = "bonusround",
	Incognito = "incognito",
	SpamFilter = "spamfilter",
	BlindIncognito = "blindincognito",
	TimeTrial = "timetrial",
	ScavengersFeud = "scavengersfeud",
	Minesweeper = "minesweeper",
	Pointless = "pointless",

	JumpStart = "jumpstart",
}

export declare namespace Twists {
	/**
	 * This is the base interface for any hunt that applies one or more twists.
	 * In order to allow mods to stack, we need to make sure that hunt-level mod-specific data (eg: 'leftGame')
	 * doesn't get affected by other mods. We also make sure that mod-specific data inside fields (eg: 'completed')
	 * can all exist without conflicting keys.
	 */
	export interface TwistedHunt<T extends TwistType = never>
		extends Omit<ScavengerHunt, "playerTable"> {
		modData: T extends keyof CommonModData ?
			Required<Pick<CommonModData, T>> & CommonModData :
			CommonModData;
		playerTable: Record<string, TwistPlayer<T>>;
		completed: (ScavengerHuntFinish &
			Partial<
				PerfectScoreResult &
				BonusRoundResult &
				SpamFilterResult &
				TimeTrialResult
			>)[];
	}

	type CommonModData = Partial<{
		[TwistType.PerfectScore]: PerfectScoreModData,
		[TwistType.Incognito]: IncognitoModData,
		[TwistType.TimeTrial]: TimeTrialModData,
		[TwistType.ScavengersFeud]: ScavengersFeudModData,
		[TwistType.Pointless]: PointlessModData,
		[TwistType.Minesweeper]: MinesweeperModData,
		[TwistType.JumpStart]: JumpStartModData,
	}>;
	export interface PerfectScoreModData {
		leftGame: Set<string>;
	}
	export interface IncognitoModData {
		preCompleted: ScavengerHuntFinish[];
	}
	export interface TimeTrialModData {
		altIps: Record<string, { id: string, name: string }>;
		startTimes: Record<string, number>;
	}
	export interface ScavengersFeudModData {
		guesses: Record<string, string[]>;
		incorrect: Record<string, Set<string>>[];
	}
	export interface PointlessModData {
		correct: Record<string, string[]>[];
	}
	export interface MinesweeperModData {
		mines: string[][];
		guesses: { [playerId: string]: Set<string> }[];
	}
	export interface JumpStartModData {
		jumpstartTimers: NodeJS.Timeout[];
		answerLock: boolean;
	}

	/** Other types */

	export interface PerfectScoreResult extends ScavengerHuntFinish {
		isPerfect?: boolean;
	}
	export interface BonusRoundResult extends ScavengerHuntFinish {
		noSkipBonus?: boolean;
	}
	export interface SpamFilterResult extends ScavengerHuntFinish {
		totalTime: number;
	}
	export interface TimeTrialResult extends ScavengerHuntFinish {
		duration: number;
	}

	type CommonTwistPlayer = Scavenger & {
		modData: Partial<{
			[TwistType.PerfectScore]: PerfectScorePlayer,
			[TwistType.BonusRound]: BonusRoundPlayer,
			[TwistType.BlindIncognito]: BlindIncognitoPlayer,
			[TwistType.SpamFilter]: SpamFilterPlayer,
			[TwistType.Minesweeper]: MinesweeperPlayer,
		}>,
	};
	export type TwistPlayer<T extends TwistType = never> = CommonTwistPlayer & {
		modData: T extends keyof CommonTwistPlayer["modData"] ?
			Required<Pick<CommonTwistPlayer["modData"], T>> :
			unknown,
	};

	export interface PerfectScorePlayer extends Scavenger {
		answers: Record<number, string[]>;
	}
	export interface SpamFilterPlayer extends Scavenger {
		incorrect: string[];
	}
	export interface BonusRoundPlayer extends Scavenger {
		skippedQuestion: boolean;
	}
	export interface BlindIncognitoPlayer extends Scavenger {
		preCompleted?: boolean;
	}
	export interface MinesweeperPlayer extends Scavenger {
		mines: { index: number, mine: string }[];
	}
}

type ScavengerAsTwistPlayer<
	Params extends readonly unknown[],
	T extends TwistType = never,
> = {
	[P in keyof Params]: Params[P] extends Scavenger ?
		Twists.TwistPlayer<T> :
		Params[P];
};

export type Twist<T extends TwistType = never> = {
	name: string,
	id: string,
	isGameMode?: true,
	desc?: string,
} & {
	[E in keyof ModEvents as `on${E}`]?: (
		this: Twists.TwistedHunt<T>,
		...args: ScavengerAsTwistPlayer<Parameters<ModEvents[E]>, T>
	) => ReturnType<ModEvents[E]>;
} & {
	[E in keyof ModEvents as `on${E}Priority`]?: number;
};

type GameModeFunction = (this: ScavengerGameTemplate, ...args: any[]) => void;
interface GameMode {
	name: string;
	id: string;
	mod: Twist;
	round?: number;
	leaderboard?: true;
	teamAnnounce?: GameModeFunction;
	getPlayerTeam?: GameModeFunction;
	advanceTeam?: GameModeFunction;
	[k: string]: any;
}

function toSeconds(time: string) {
	// hhmmss => ss
	const parts = time.split(":").reverse();
	return parts
		.map((value, index) => parseInt(value) * 60 ** index)
		.reduce((a, b) => a + b);
}

class Leaderboard {
	data: { [userid: string]: AnyObject };

	constructor() {
		this.data = {};
	}

	addPoints(name: string, aspect: string, points: number, noUpdate?: boolean) {
		const userid: string = toID(name);

		if (!userid || userid === "constructor" || !points) return this;
		if (!this.data[userid]) this.data[userid] = { name };

		if (!this.data[userid][aspect]) this.data[userid][aspect] = 0;
		this.data[userid][aspect] += points;

		if (!noUpdate) this.data[userid].name = name; // always keep the last used name

		return this; // allow chaining
	}

	visualize(sortBy: string): Promise<({ rank: number } & AnyObject)[]>;
	visualize(
		sortBy: string,
		userid: string
	): Promise<({ rank: number } & AnyObject) | undefined>;
	visualize(sortBy: string, userid?: string) {
		// FIXME: this is not how promises work
		// return a promise for async sorting - make this less exploitable
		return new Promise((resolve, reject) => {
			let lowestScore = Infinity;
			let lastPlacement = 1;

			const ladder = Utils.sortBy(
				Object.entries(this.data).filter(([u, bit]) => sortBy in bit),
				([u, bit]) => -bit[sortBy]
			).map(([u, bit], i) => {
				if (bit[sortBy] !== lowestScore) {
					lowestScore = bit[sortBy];
					lastPlacement = i + 1;
				}
				return {
					rank: lastPlacement,
					...bit,
				} as { rank: number } & AnyObject;
			}); // identify ties
			if (userid) {
				const rank = ladder.find(entry => toID(entry.name) === userid);
				resolve(rank);
			} else {
				resolve(ladder);
			}
		});
	}

	async htmlLadder(): Promise<string> {
		const data = await this.visualize("points");
		return `<div class="ladder" style="overflow-y: scroll; max-height: 170px;"><table style="width: 100%"><tr><th>Rank</th><th>Name</th><th>Points</th></tr>${data
			.map(
				line =>
					`<tr><td>${line.rank}</td><td>${line.name}</td><td>${line.points}</td></tr>`
			)
			.join("")}</table></div>`;
	}
}

const TWISTS: Partial<Record<TwistType, Twist>> = {
	[TwistType.PerfectScore]: {
		name: "Perfect Score",
		id: "perfectscore",
		desc: "Players who finish the hunt without submitting a single wrong answer get a shoutout!",

		onAfterLoad() {
			this.modData[TwistType.PerfectScore] = { leftGame: new Set() };
		},

		onLeave(player) {
			this.modData[TwistType.PerfectScore].leftGame.add(player.id);
		},

		onSubmitPriority: 1,
		onSubmit(player, value) {
			const currentQuestion = player.currentQuestion;
			const modData = player.modData[TwistType.PerfectScore];

			if (!modData.answers) modData.answers = {};
			if (!modData.answers[currentQuestion])
				modData.answers[currentQuestion] = [];

			if (modData.answers[currentQuestion].includes(value)) return;

			modData.answers[currentQuestion].push(value);
		},

		onComplete(player, time, blitz) {
			const isPerfect =
				!this.modData[TwistType.PerfectScore].leftGame?.has(player.id) &&
				Object.values(
					player.modData[TwistType.PerfectScore].answers ?? {}
				).every((attempts: any) => attempts.length <= 1);
			return { name: player.name, id: player.id, time, blitz, isPerfect };
		},

		onAfterEndPriority: 1,
		onAfterEnd(isReset) {
			if (isReset) return;
			const perfect = this.completed
				.filter(entry => entry.isPerfect)
				.map(entry => entry.name);
			if (perfect.length) {
				this.announce(
					Utils.html`${Chat.toListString(perfect)} ${
						perfect.length > 1 ? "have" : "has"
					} completed the hunt without a single wrong answer!`
				);
			}
		},
	} satisfies Twist<TwistType.PerfectScore>,

	[TwistType.BonusRound]: {
		name: "Bonus Round",
		id: "bonusround",
		desc: "Players can choose whether or not they choose to complete the 4th question.",

		onLoad(q: (string | string[])[]) {
			if (q.length < 8) {
				throw new Chat.ErrorMessage(
					"This twist requires at least four questions. Please reset the hunt and make it again."
				);
			}
		},
		onLoadPriority: 2,
		onAfterLoad() {
			if (this.questions.length === 3) {
				this.announce(
					"This twist requires at least four questions. Please reset the hunt and make it again."
				);
				this.huntLocked = true;
			} else {
				this.questions[this.questions.length - 1].hint +=
					" (You may choose to skip this question using ``/scavenge skip``.)";
			}
		},

		onAnySubmit(player) {
			if (this.huntLocked) {
				player.sendRoom(
					"The hunt was not set up correctly. Please wait for the host to reset the hunt and create a new one."
				);
				return true;
			}
		},

		onSubmitPriority: 1,
		onSubmit(player, value) {
			const currentQuestion = player.currentQuestion;

			if (
				value === "skip" &&
				currentQuestion + 1 === this.questions.length
			) {
				player.sendRoom("You have opted to skip the current question.");
				player.modData[TwistType.BonusRound].skippedQuestion = true;
				this.onComplete(player);
				return true;
			}
		},

		onComplete(player, time, blitz): Twists.BonusRoundResult | true {
			const noSkipBonus = !player.modData[TwistType.BonusRound].skippedQuestion;
			return { name: player.name, id: player.id, time, blitz, noSkipBonus };
		},

		onAfterEndPriority: 1,
		onAfterEnd(isReset) {
			if (isReset) return;
			const noSkip = this.completed
				.filter(entry => entry.noSkipBonus)
				.map(entry => entry.name);
			if (noSkip.length) {
				this.announce(
					Utils.html`${Chat.toListString(noSkip)} ${
						noSkip.length > 1 ? "have" : "has"
					} completed the hunt without skipping the last question!`
				);
			}
		},
	} satisfies Twist<TwistType.BonusRound>,

	[TwistType.Incognito]: {
		name: "Incognito",
		id: "incognito",
		desc: "Upon answering the last question correctly, the player's finishing time will not be announced in the room! Results will only be known at the end of the hunt.",

		onCorrectAnswer(player, value) {
			if (player.currentQuestion + 1 >= this.questions.length) {
				this.runEvent("PreComplete", player);

				player.sendRoom(
					`Congratulations! You have gotten the correct answer.`
				);
				player.sendRoom(
					`This is a special style where finishes aren't announced! To see your placement, wait for the hunt to end. Until then, it's your secret that you finished!`
				);
				return false;
			}
		},

		onPreComplete(player) {
			const now = Date.now();
			const time = Chat.toDurationString(now - this.startTime, {
				hhmmss: true,
			});
			const canBlitz = this.completed.length < 3;

			const blitz =
				now - this.startTime <= 60000 &&
				canBlitz &&
				(this.room.settings.scavSettings?.blitzPoints?.[this.gameType] ||
					this.gameType === "official");

			const fallbackResult = {
				name: player.name,
				id: player.id,
				time,
				blitz,
			};
			const result: ScavengerHuntFinish =
				this.runEvent("Complete", player, time, blitz) || fallbackResult;

			this.preCompleted = this.preCompleted ?
				[...this.preCompleted, result] :
				[result];
			player.completed = true;
			player.destroy();
		},

		onEnd() {
			this.completed = this.preCompleted || [];
		},
	} satisfies Twist<TwistType.Incognito>,

	spamfilter: {
		name: "Spam Filter",
		id: "spamfilter",

		desc: "Every wrong answer adds 30 seconds to your final time!",

		onIncorrectAnswer(player, value) {
			const modData = player.modData[TwistType.SpamFilter];
			if (!modData.incorrect) modData.incorrect = [];
			const id = `${player.currentQuestion}-${value}`;
			if (modData.incorrect.includes(id)) return;

			modData.incorrect.push(id);
		},

		onComplete(player, time, blitz): Twists.SpamFilterResult | true {
			const seconds = toSeconds(time);
			const incorrect = player.modData[TwistType.SpamFilter].incorrect;
			if (!incorrect) {
				return {
					name: player.name,
					id: player.id,
					totalTime: seconds,
					blitz,
					time,
				};
			}

			const totalTime = seconds + 30 * incorrect.length;
			const finalTime = Chat.toDurationString(totalTime * 1000, {
				hhmmss: true,
			});
			if (totalTime > 60) blitz = false;

			return {
				name: player.name,
				id: player.id,
				totalTime,
				blitz,
				time: finalTime,
			};
		},

		onConfirmCompletion(player, _time, _blitz, place, result) {
			const { blitz, time } = result;
			const incorrect = player.modData[TwistType.SpamFilter].incorrect;
			const deductionMessage = incorrect?.length ?
				Chat.count(incorrect, "incorrect guesses", "incorrect guess") :
				"Perfect!";
			return `<em>${Utils.escapeHTML(
				player.name
			)}</em> has finished the hunt! (Final Time: ${time} - ${deductionMessage}${
				blitz ? " - BLITZ" : ""
			})`;
		},

		onEnd() {
			Utils.sortBy(this.completed, entry => entry.totalTime ?? -1);
		},
	} satisfies Twist<TwistType.SpamFilter>,

	[TwistType.BlindIncognito]: {
		name: "Blind Incognito",
		id: "blindincognito",
		desc: "Upon completing the last question, neither you nor other players will know if the last question is correct! You may be in for a nasty surprise when the hunt ends!",

		onAnySubmit(player, value) {
			if (player.modData[TwistType.BlindIncognito].preCompleted) {
				player.sendRoom(
					`That may or may not be the right answer - if you aren't confident, you can try again!`
				);
				return true;
			}
		},

		onCorrectAnswer(player, value) {
			if (player.currentQuestion + 1 >= this.questions.length) {
				this.runEvent("PreComplete", player);

				player.sendRoom(
					`That may or may not be the right answer - if you aren't confident, you can try again!`
				);
				return true;
			}
		},

		onIncorrectAnswer(player, value) {
			if (player.currentQuestion + 1 >= this.questions.length) {
				player.sendRoom(
					`That may or may not be the right answer - if you aren't confident, you can try again!`
				);
				return false;
			}
		},

		onPreComplete(player) {
			const now = Date.now();
			const time = Chat.toDurationString(now - this.startTime, {
				hhmmss: true,
			});
			const canBlitz = this.completed.length < 3;

			const blitz =
				now - this.startTime <= 60000 &&
				canBlitz &&
				(this.room.settings.scavSettings?.blitzPoints?.[this.gameType] ||
					this.gameType === "official");

			const fallbackResult = {
				name: player.name,
				id: player.id,
				time,
				blitz,
			};
			const result: ScavengerHuntFinish =
				this.runEvent("Complete", player, time, blitz) || fallbackResult;

			this.preCompleted = this.preCompleted ?
				[...this.preCompleted, result] :
				[result];
			player.modData[TwistType.BlindIncognito].preCompleted = true;
		},

		onEnd() {
			this.completed = this.preCompleted || [];
		},
	} satisfies Twist<TwistType.BlindIncognito>,

	[TwistType.TimeTrial]: {
		name: "Time Trial",
		id: "timetrial",
		desc: "Time starts when the player starts the hunt!",

		onAfterLoad() {
			if (this.questions.length === 3) {
				this.announce(
					"This twist requires at least four questions. Please reset the hunt and make it again."
				);
				this.huntLocked = true;
			}
			const modData = this.modData[TwistType.TimeTrial];
			modData.altIps = {};
			modData.startTimes = {};
		},

		onJoin(user) {
			const modData = this.modData[TwistType.TimeTrial];
			if (!Config.noipchecks) {
				const altIp = user.ips?.find(
					ip => modData.altIps[ip] && modData.altIps[ip].id !== user.id
				);
				if (altIp) {
					user.sendTo(
						this.room,
						`You already have started the hunt as ${modData.altIps[altIp].name}.`
					);
					return true;
				}
			}
			if (!modData.startTimes[user.id])
				modData.startTimes[user.id] = Date.now();
			if (this.addPlayer(user)) {
				this.cacheUserIps(user);
				delete this.leftHunt[user.id];
				user.sendTo(
					this.room,
					"You joined the scavenger hunt! Use the command /scavenge to answer."
				);
				this.onSendQuestion(user);
			} else {
				user.sendTo(this.room, "You have already joined the hunt.");
			}
			return true;
		},

		onLeave(player) {
			for (const ip of player.joinIps) {
				this.modData[TwistType.TimeTrial].altIps[ip] = {
					id: player.id,
					name: player.name,
				};
			}
		},

		onAnySubmit(player) {
			if (this.huntLocked) {
				player.sendRoom(
					"The hunt was not set up correctly. Please wait for the host to reset the hunt and create a new one."
				);
				return true;
			}
		},

		onComplete(player, time, blitz) {
			const now = Date.now();
			const takenTime =
				now - this.modData[TwistType.TimeTrial].startTimes[player.id];
			const result: Twists.TimeTrialResult = {
				name: player.name,
				id: player.id,
				time: Chat.toDurationString(takenTime, { hhmmss: true }),
				duration: takenTime,
				blitz,
			};
			this.completed.push(result);
			const place = Utils.formatOrder(this.completed.length);

			this.announce(
				Utils.html`<em>${
					result.name
				}</em> is the ${place} player to finish the hunt! (${takenTime}${
					blitz ? " - BLITZ" : ""
				})`
			);
			Utils.sortBy(this.completed, entry => entry.duration ?? Infinity);

			player.destroy(); // remove from user.games;
			return true;
		},
	} satisfies Twist<TwistType.TimeTrial>,

	[TwistType.ScavengersFeud]: {
		id: "scavengersfeud",
		name: "Scavengers Feud",
		desc: "After completing the hunt, players will guess what the most common incorrect answer for each question is.",
		onAfterLoad() {
			this.modData[TwistType.ScavengersFeud].guesses = {};
			this.modData[TwistType.ScavengersFeud].incorrect = this.questions.map(
				() => ({})
			);

			this.questions.push({
				hint: "Please enter what you think are the most common incorrect answers to each question. (Enter your guesses in the order of the previous questions, and separate them with a comma)",
				answer: ["Any"],
				spoilers: [],
			});
		},

		onIncorrectAnswer(player, value) {
			const curr = player.currentQuestion;
			const incorrect = this.modData[TwistType.ScavengersFeud].incorrect;

			if (!incorrect[curr][value]) incorrect[curr][value] = new Set();
			incorrect[curr][value].add(player.id);
		},

		onSubmitPriority: 1,
		onSubmit(player, valueToId, value) {
			const currentQuestion = player.currentQuestion;

			if (currentQuestion + 1 === this.questions.length) {
				this.modData[TwistType.ScavengersFeud].guesses[player.id] = value
					.split(",")
					.map((part: string) => sanitizeAnswer(part));

				this.onComplete(player);
				return true;
			}
		},

		onEnd() {
			this.questions.pop(); // The last question is automatically added
		},

		onAfterEnd(isReset) {
			if (isReset) return;

			const buffer = [];
			for (const [idx, data] of this.modData[
				TwistType.ScavengersFeud
			].incorrect.entries()) {
				// collate the data for each question
				let collection = [];
				for (const str in data) {
					collection.push({ count: data[str].size, value: str });
				}
				collection = collection.sort((a, b) => b.count - a.count);
				const maxValue = collection[0]?.count || 0;

				const matches = collection
					.filter(pair => pair.count === maxValue)
					.map(pair => pair.value);

				const matchedPlayers = [];
				for (const playerid in this.modData[TwistType.ScavengersFeud]
					.guesses) {
					const guesses =
						this.modData[TwistType.ScavengersFeud].guesses[playerid];
					if (matches.includes(guesses[idx]))
						matchedPlayers.push(playerid);
				}

				// display the data
				const matchDisplay = matches.length ?
					matches.join(", ") :
					"No wrong answers!";
				const playerDisplay = matches.length ?
					matchedPlayers.length ?
						`- ${matchedPlayers.join(", ")}` :
						"- No one guessed correctly!" :
					"";
				buffer.push(`Q${idx + 1}: ${matchDisplay} ${playerDisplay}`);
			}

			this.announce(
				`<h3>Most common incorrect answers:</h3>${buffer.join("<br />")}`
			);
		},
	} satisfies Twist<TwistType.ScavengersFeud>,

	pointless: {
		id: "pointless",
		name: "Pointless",
		desc: "Players get bonus points for guessing the least commonly guessed answers.",
		onAfterLoad() {
			this.modData[TwistType.Pointless].correct = this.questions.map(
				() => ({})
			);
		},

		onCorrectAnswer(player, value) {
			const curr = player.currentQuestion;
			const correct = this.modData[TwistType.Pointless].correct;

			if (!correct[curr][value]) correct[curr][value] = [];
			if (correct[curr][value].includes(player.id)) return;

			correct[curr][value].push(player.id);
		},

		onAfterEnd(isReset) {
			if (isReset) return;

			const buffer = [];

			for (const [idx, data] of this.modData[
				TwistType.Pointless
			].correct.entries()) {
				// collect the data for each question
				const list = Object.entries<string[]>(data).map(
					([value, players]) => ({ players, count: players.length, value })
				);
				const minValue = Math.min(...list.map(entry => entry.count));

				const minEntries = list.filter(entry => entry.count === minValue);
				const matchDisplay = minEntries
					.map(entry =>
						this.questions[idx].answer.find(
							answer => toID(answer) === entry.value
						)
					)
					.join(", ");
				const playerDisplay = minEntries
					.flatMap(entry =>
						entry.players.map(
							foundPlayer =>
								this.players.find(
									player => player.id === foundPlayer
								)!.name
						)
					)
					.join(", ");
				buffer.push(`Q${idx + 1}: ${matchDisplay} - ${playerDisplay}`);
			}

			this.announce(
				`<h3>Least frequent correct answers:</h3>${buffer.join("<br />")}`
			);
		},
	} satisfies Twist<TwistType.Pointless>,

	[TwistType.Minesweeper]: {
		id: "minesweeper",
		name: "Minesweeper",
		desc: "The huntmaker adds 'mines' to the hunt using `!(mine)` - players that dodge all mines get extra points, while the huntmaker gets points every time a mine is hit.",
		onLoad(q) {
			for (let i = 0; i < q.length; i += 2) {
				const answer = q[i + 1] as string[];
				if (answer.filter(ans => ans.startsWith("!")).length === 0) {
					throw new Chat.ErrorMessage(
						`No mines were added for question #${i / 2 + 1}.`
					);
				}
				if (answer.filter(ans => !ans.startsWith("!")).length === 0) {
					throw new Chat.ErrorMessage(
						`No correct answers were added for question #${i / 2 + 1}.`
					);
				}
			}
		},
		onLoadPriority: 2,
		onAfterLoad() {
			this.modData[TwistType.Minesweeper].guesses = this.questions.map(
				() => ({})
			);
			this.modData[TwistType.Minesweeper].mines = [];
			for (const question of this.questions) {
				this.modData[TwistType.Minesweeper].mines.push(
					question.answer.filter(ans => ans.startsWith("!"))
				);
				question.answer = question.answer.filter(
					ans => !ans.startsWith("!")
				);
			}
		},

		onEditQuestion(questionNumber, questionAnswer, value) {
			if (questionAnswer === "question") questionAnswer = "hint";
			if (!["hint", "answer"].includes(questionAnswer)) return false;

			let answer: string[] = [];
			if (questionAnswer === "answer") {
				answer = value.split(";").map(p => p.trim());
			}

			if (
				!questionNumber ||
				questionNumber < 1 ||
				questionNumber > this.questions.length ||
				(!answer && !value)
			) {
				return false;
			}

			questionNumber--; // indexOf starts at 0

			if (questionAnswer === "answer") {
				// These two lines are the only difference from the original
				this.modData[TwistType.Minesweeper].mines[questionNumber] =
					answer.filter(ans => ans.startsWith("!"));
				this.questions[questionNumber].answer = answer.filter(
					ans => !ans.startsWith("!")
				);
			} else {
				this.questions[questionNumber].hint = value;
			}

			this.announce(
				`The ${questionAnswer} for question ${
					questionNumber + 1
				} has been edited.`
			);
			if (questionAnswer === "hint") {
				for (const p in this.playerTable) {
					this.playerTable[p].onNotifyChange(questionNumber);
				}
			}
			return true;
		},

		onIncorrectAnswer(player, value) {
			const curr = player.currentQuestion;

			const guesses = this.modData[TwistType.Minesweeper].guesses[curr];
			if (!guesses[player.id]) guesses[player.id] = new Set();
			guesses[player.id].add(sanitizeAnswer(value));

			throw new Chat.ErrorMessage("That is not the answer - try again!");
		},

		onShowEndBoard(endedBy) {
			const sliceIndex = this.gameType === "official" ? 5 : 3;
			const hosts = Chat.toListString(
				this.hosts.map(h => `<em>${Utils.escapeHTML(h.name)}</em>`)
			);

			const mines: { mine: string, users: string[] }[][] = [];

			for (const mineSet of this.modData[TwistType.Minesweeper].mines) {
				mines.push(
					mineSet.map(mine => ({
						mine: mine.substr(1),
						users: [] as string[],
					}))
				);
			}

			for (const player of Object.values(this.playerTable)) {
				if (!player) continue;
				const playerMines = player.modData[TwistType.Minesweeper].mines;
				for (const { index, mine } of playerMines) {
					mines[index]
						.find(obj => obj.mine === mine)
						?.users.push(player.name);
				}
			}

			for (const mineSet of mines) mineSet.sort();

			this.announce(
				`The ${
					this.gameType ? `${this.gameType} ` : ""
				}scavenger hunt by ${hosts} was ended ${
					endedBy ?
						"by " + Utils.escapeHTML(endedBy.name) :
						"automatically"
				}.<br />` +
				`${this.completed
					.slice(0, sliceIndex)
					.map(
						(p, i) =>
							`${Utils.formatOrder(
								i + 1
							)} place: <em>${Utils.escapeHTML(
								p.name
							)}</em> <span style="color: lightgreen;">[${
								p.time
							}]</span>.<br />`
					)
					.join("")}` +
					`${
						this.completed.length > sliceIndex ?
							`Consolation Prize: ${this.completed
								.slice(sliceIndex)
								.map(
									e =>
										`<em>${Utils.escapeHTML(
											e.name
										)}</em> <span style="color: lightgreen;">[${
											e.time
										}]</span>`
								)
								.join(", ")}<br />` :
							""
					}<br />` +
					`<details style="cursor: pointer;"><summary>Solution: </summary><br />` +
					`${this.questions
						.map(
							(q, i) =>
								`${i + 1}) ${this.formatOutput(
									q.hint
								)} <span style="color: lightgreen">[<em>${Utils.escapeHTML(
									q.answer.join(" / ")
								)}</em>]</span><br/>` +
								`<details style="cursor: pointer;"><summary>Mines: </summary>${mines[
									i
								]
									.map(({ mine, users }) =>
										Utils.escapeHTML(
											`${mine}: ${users.join(" / ") || "-"}`
										)
									)
									.join("<br />")}</details>`
						)
						.join("<br />")}` +
						`</details>`
			);
			return true;
		},

		onEnd(isReset) {
			if (isReset) return;
			for (const [q, guessObj] of this.modData[
				TwistType.Minesweeper
			].guesses.entries()) {
				const mines: string[] =
					this.modData[TwistType.Minesweeper].mines[q];
				for (const [playerId, guesses] of Object.entries(guessObj)) {
					const player = this.playerTable[playerId];
					if (!player) continue;
					if (!player.modData[TwistType.Minesweeper].mines)
						player.modData[TwistType.Minesweeper].mines = [];
					player.modData[TwistType.Minesweeper].mines.push(
						...mines
							.filter(mine => guesses.has(sanitizeAnswer(mine)))
							.map(mine => ({ index: q, mine: mine.substr(1) }))
					);
				}
			}
		},

		onAfterEndPriority: 1,
		onAfterEnd(isReset) {
			if (isReset) return;
			const noMines = [];
			for (const { name } of this.completed) {
				const player = this.playerTable[toID(name)];
				if (!player) continue;
				if (!player.modData[TwistType.Minesweeper].mines?.length)
					noMines.push(name);
			}
			if (noMines.length) {
				this.announce(
					Utils.html`${Chat.toListString(noMines)} ${
						noMines.length > 1 ? "have" : "has"
					} completed the hunt without hitting a single mine!`
				);
				// Points are awarded manually
			}
		},
	} satisfies Twist<TwistType.Minesweeper>,
};

const MODES: { [k: string]: GameMode | string } = {
	ko: "kogames",
	kogames: {
		name: "KO Games",
		id: "kogames",

		mod: {
			name: "KO Games",
			id: "KO Games",
			isGameMode: true,

			onLoad() {
				this.allowRenames = false; // don't let people change their name in the middle of the hunt.
			},

			onJoin(user: User) {
				const game = this.room.scavgame!;
				if (game.playerlist && !game.playerlist.includes(user.id)) {
					user.sendTo(
						this.room,
						"You are not allowed to join this scavenger hunt."
					);
					return true;
				}
			},

			onAfterEnd() {
				const game = this.room.scavgame!;
				if (!this.completed.length) {
					this.announce(
						"No one has completed the hunt - the round has been void."
					);
					return;
				}

				game.round++;

				// elimination
				if (!game.playerlist) {
					game.playerlist = this.completed.map(entry =>
						toID(entry.name)
					);
					this.announce(
						`Round ${game.round} - ${Chat.toListString(
							this.completed.map(p => `<em>${p.name}</em>`)
						)} have successfully completed the last hunt and have moved on to the next round!`
					);
				} else {
					let eliminated = [];
					const completed = this.completed.map(entry =>
						toID(entry.name)
					) as string[];
					if (completed.length === game.playerlist.length) {
						eliminated.push(completed.pop()); // eliminate one
						game.playerlist = game.playerlist.filter(userid =>
							completed.includes(userid)
						);
					} else {
						eliminated = game.playerlist.filter(
							userid => !completed.includes(userid)
						);
						for (const username of eliminated) {
							const userid = toID(username);
							game.playerlist = game.playerlist.filter(
								pid => pid !== userid
							);
						}
					}

					this.announce(
						`Round ${game.round} - ${Chat.toListString(
							eliminated.map(n => `<em>${n}</em>`)
						)} ${Chat.plural(
							eliminated,
							"have",
							"has"
						)} been eliminated! ${Chat.toListString(
							game.playerlist.map(
								p => `<em>${this.playerTable[p].name}</em>`
							)
						)} have successfully completed the last hunt and have moved on to the next round!`
					);
				}

				// process end of game
				if (game.playerlist.length === 1) {
					const winningUser = Users.get(game.playerlist[0]);
					const winner = winningUser ?
						winningUser.name :
						game.playerlist[0];

					this.announce(`Congratulations to the winner - ${winner}!`);
					game.destroy();
				} else if (!game.playerlist.length) {
					this.announce(
						"Everyone has been eliminated! Better luck next time!"
					);
					game.destroy();
				}
			},
		},

		round: 0,
		playerlist: null,
	},

	scav: "scavengergames",
	scavgames: "scavengergames",
	scavengergames: {
		name: "Scavenger Games",
		id: "scavengergames",

		mod: {
			name: "Scavenger Games",
			id: "scavengergames",
			isGameMode: true,

			onLoad() {
				this.allowRenames = false; // don't let people change their name in the middle of the hunt.
				this.setTimer(1);
			},

			onJoin(user: User) {
				const game = this.room.scavgame!;
				if (game.playerlist && !game.playerlist.includes(user.id)) {
					user.sendTo(
						this.room,
						"You are not allowed to join this scavenger hunt."
					);
					return true;
				}
			},

			onAfterEnd() {
				const game = this.room.scavgame!;
				if (!this.completed.length) {
					this.announce(
						"No one has completed the hunt - the round has been void."
					);
					return;
				}
				game.round++;

				let eliminated: string[] = [];
				if (!game.playerlist) {
					game.playerlist = this.completed.map(
						entry => toID(entry.name) as string
					);
				} else {
					const completed = this.completed.map(
						entry => toID(entry.name) as string
					);
					eliminated = game.playerlist.filter(
						userid => !completed.includes(userid)
					);
					for (const username of eliminated) {
						const userid = toID(username);
						game.playerlist = game.playerlist.filter(
							pid => pid !== userid
						);
					}
				}

				this.announce(
					`Round ${game.round} - ${Chat.toListString(
						eliminated.map(n => `<em>${n}</em>`)
					)} ${
						eliminated.length ?
							`${Chat.plural(
								eliminated,
								"have",
								"has"
							)} been eliminated!` :
							""
					} ${Chat.toListString(
						game.playerlist.map(
							p => `<em>${this.playerTable[p].name}</em>`
						)
					)} have successfully completed the last hunt and have moved on to the next round!`
				);

				// process end of game
				if (game.playerlist.length === 1) {
					const winningUser = Users.get(game.playerlist[0]);
					const winner = winningUser ?
						winningUser.name :
						game.playerlist[0];

					this.announce(`Congratulations to the winner - ${winner}!`);
					game.destroy();
				} else if (!game.playerlist.length) {
					this.announce(
						"Everyone has been eliminated! Better luck next time!"
					);
					game.destroy();
				}
			},
		},

		round: 0,
		playerlist: null,
	},

	pr: "pointrally",
	pointrally: {
		name: "Point Rally",
		id: "pointrally",

		pointDistribution: [50, 40, 32, 25, 20, 15, 10],

		mod: {
			name: "Point Rally",
			id: "pointrally",
			isGameMode: true,

			onLoad() {
				const game = this.room.scavgame!;
				this.announce(`Round ${++game.round}`);
			},

			onAfterEnd() {
				const game = this.room.scavgame!;
				for (const [i, completed] of this.completed
					.map(e => e.name)
					.entries()) {
					const points =
						game.pointDistribution[i] ||
						game.pointDistribution[game.pointDistribution.length - 1];
					game.leaderboard.addPoints(completed, "points", points);
				}
				// post leaderboard
				const room = this.room;
				game.leaderboard.htmlLadder().then((html: string) => {
					room.add(`|raw|${html}`).update();
				});
			},
		},
		round: 0,
		leaderboard: true,
	},

	js: "jumpstart",
	jump: "jumpstart",
	jumpstart: {
		name: "Jump Start",
		id: "jumpstart",

		jumpstart: [60, 40, 30, 20, 10],
		round: 0,
		mod: {
			name: "Jump Start",
			id: "jumpstart",
			isGameMode: true,

			onLoad() {
				const game = this.room.scavgame!;
				if (game.round === 0) return;
				const maxTime = Math.max(...game.jumpstart);

				this.modData[TwistType.JumpStart].jumpstartTimers = [];
				const jumpstartTimers =
					this.modData[TwistType.JumpStart].jumpstartTimers;
				this.modData[TwistType.JumpStart].answerLock = true;

				for (const [i, time] of game.jumpstart.entries()) {
					if (!game.completed[i]) break;

					jumpstartTimers[i] = setTimeout(() => {
						const target = game.completed.shift();
						if (!target) return;

						const staffHost = Users.get(this.staffHostId);
						const targetUser = Users.get(target);

						if (targetUser) {
							if (staffHost)
								staffHost.sendTo(
									this.room,
									`${targetUser.name} has received their first hint early.`
								);
							targetUser.sendTo(
								this.room,
								`|raw|<strong>The first hint to the next hunt is:</strong> <div style="overflow:auto; max-height: 50vh"> ${this.formatOutput(
									this.questions[0].hint
								)}</div>`
							);
							targetUser.sendTo(
								this.room,
								`|notify|Early Hint|The first hint to the next hunt is: <div style="overflow:auto; max-height: 50vh"> ${this.formatOutput(
									this.questions[0].hint
								)}</div>`
							);
						}
					}, (maxTime - time) * 1000 + 5000);
				}

				// when the jump starts are all given to eligible players
				jumpstartTimers[jumpstartTimers.length] = setTimeout(() => {
					this.modData[TwistType.JumpStart].answerLock = false;
					const message = this.getCreationMessage(true);
					this.room.add(message).update();
					this.announce("You may start guessing!");
					this.startTime = Date.now();
				}, 1000 * (maxTime + 5));
			},

			onJoin(user) {
				if (this.modData[TwistType.JumpStart].answerLock) {
					user.sendTo(this.room, `The hunt is not open for guesses yet!`);
					return true;
				}
			},

			onViewHunt(user) {
				if (
					this.modData[TwistType.JumpStart].answerLock &&
					!(
						this.hosts.some(h => h.id === user.id) ||
						user.id === this.staffHostId
					)
				) {
					return true;
				}
			},

			onCreateCallback() {
				if (this.modData[TwistType.JumpStart].answerLock) {
					return (
						`|raw|<div class="broadcast-blue"><strong>${
							["official", "unrated"].includes(this.gameType) ?
								"An" :
								"A"
						} ${this.gameType} ` +
						`Scavenger Hunt by <em>${Utils.escapeHTML(
							Chat.toListString(this.hosts.map(h => h.name))
						)}</em> ` +
						`has been started${
							this.hosts.some(h => h.id === this.staffHostId) ?
								"" :
								` by <em>${Utils.escapeHTML(this.staffHostName)}</em>`
						}.` +
						`<br />The first hint is currently being handed out to early finishers.`
					);
				}
			},

			onEnd(reset) {
				const jumpstartTimers =
					this.modData[TwistType.JumpStart].jumpstartTimers;
				if (jumpstartTimers) {
					for (const timer of jumpstartTimers) {
						clearTimeout(timer);
					}
				}
				const game = this.room.scavgame!;
				if (!reset) {
					if (game.round === 0) {
						game.completed = this.completed.map(entry =>
							toID(entry.name)
						);
						game.round++;
					} else {
						game.destroy();
					}
				}
			},
		} satisfies Twist<TwistType.JumpStart>,
	},

	ts: "teamscavs",
	tscav: "teamscavs",
	teamscavengers: "teamscavs",
	teamscavs: {
		name: "Team Scavs",
		id: "teamscavs",
		/* {
			[team
			name: string]: {
			name: string[],
			players: UserID[],
			answers: string[],
			question: number,
			completed: boolean
			}
		} */
		teams: {},

		teamAnnounce(player: Scavenger | User, message: string) {
			const team = this.getPlayerTeam(player);

			for (const userid of team.players) {
				const user = Users.getExact(userid);
				if (!user?.connected) continue; // user is offline

				user.sendTo(
					this.room,
					`|raw|<div class="infobox">${message}</div>`
				);
			}
		},

		getPlayerTeam(player: Scavenger | User) {
			const game = this.room.scavgame!;
			for (const teamID in game.teams) {
				const team = game.teams[teamID];
				if (team.players.includes(player.id)) {
					return team;
				}
			}
			return null;
		},

		advanceTeam(answerer: Scavenger, isFinished?: boolean) {
			const hunt = this.room.getGame(ScavengerHunt)!;

			const team = this.getPlayerTeam(answerer);

			team.question++;
			const question = hunt.getQuestion(team.question);
			for (const userid of team.players) {
				const user = Users.getExact(userid);
				if (!user) continue;

				user.sendTo(this.room, question);
			}
			team.answers = [];
		},

		mod: {
			name: "Team Scavs",
			id: "teamscavs",
			isGameMode: true,

			onLoad() {
				// don't let people change their name in the middle of the hunt.
				this.allowRenames = false;
			},

			onViewHunt(user: User) {
				const game = this.room.scavgame!;
				const team = game.getPlayerTeam(user);
				const player = this.playerTable[user.id];

				if (!player || !team) return;

				if (player.currentQuestion !== team.question - 1)
					player.currentQuestion = team.question - 1;
				if (team.completed) player.completed = true;
			},

			onSendQuestion(player: Scavenger) {
				const game = this.room.scavgame!;
				const team = game.getPlayerTeam(player);

				if (!team) return;

				if (player.currentQuestion !== team.question - 1)
					player.currentQuestion = team.question - 1;
				if (team.completed) {
					player.completed = true;
					player.sendRoom("Your team has already completed the hunt!");
					return true;
				}
			},

			onConnect(user: User) {
				const player = this.playerTable[user.id];
				if (!player) return;

				const game = this.room.scavgame!;
				const team = game.getPlayerTeam(player);

				if (team) {
					if (player.currentQuestion !== team.question - 1)
						player.currentQuestion = team.question - 1;
					if (team.completed) player.completed = true;
				}
			},

			onJoin(user: User) {
				const game = this.room.scavgame!;
				const team = game.getPlayerTeam(user);
				if (!team) {
					user.sendTo(
						this.room,
						"You are not allowed to join this scavenger hunt as you are not on any of the teams."
					);
					return true;
				}
			},

			onAfterLoadPriority: -9999,
			onAfterLoad() {
				const game = this.room.scavgame!;

				if (Object.keys(game.teams).length === 0) {
					this.announce(
						"Teams have not been set up yet. Please reset the hunt."
					);
				}
			},

			// -1 so that blind incog takes precedence of this
			onCorrectAnswerPriority: -1,
			onCorrectAnswer(player: Scavenger, value: string) {
				const game = this.room.scavgame!;

				if (player.currentQuestion + 1 < this.questions.length) {
					game.teamAnnounce(
						player,
						Utils.html`<strong>${
							player.name
						}</strong> has gotten the correct answer (${value}) for question #${
							player.currentQuestion + 1
						}.`
					);
					game.advanceTeam(player);

					return false;
				}
			},

			onAnySubmit(player: Scavenger, value: string) {
				const game = this.room.scavgame!;

				const team = game.getPlayerTeam(player);

				if (!team) return true; // handle players who get kicked during the hunt.

				if (player.currentQuestion !== team.question - 1)
					player.currentQuestion = team.question - 1;
				if (team.completed) player.completed = true;

				if (player.completed) return;

				if (team.answers.includes(value)) return;
				game.teamAnnounce(
					player,
					Utils.html`${player.name} has guessed "${value}".`
				);
				team.answers.push(value);
			},

			onCompletePriority: 2,
			onComplete(player: Scavenger, time: string, blitz: boolean) {
				const game = this.room.scavgame!;

				const team = game.getPlayerTeam(player);
				return { name: team.name, time, blitz };
			},

			// workaround that gives the answer after verifying that completion should not be hidden
			onConfirmCompletion(player: Scavenger, time: string, blitz: boolean) {
				const game = this.room.scavgame!;
				const team = game.getPlayerTeam(player);
				team.completed = true;
				team.question++;

				game.teamAnnounce(
					player,
					Utils.html`<strong>${player.name}</strong> has gotten the correct answer for question #${player.currentQuestion}. Your team has completed the hunt!`
				);
			},

			onEnd() {
				const game = this.room.scavgame!;
				for (const teamID in game.teams) {
					const team = game.teams[teamID];
					team.answers = [];
					team.question = 1;
					team.completed = false;
				}
			},
		},
	},
};

export class ScavengerGameTemplate {
	room: Room;
	playerlist: null | string[] = null;
	timer: NodeJS.Timeout | null = null;
	mod: string | string[] = [];

	[k: string]: any;
	constructor(room: Room) {
		this.room = room;
	}

	destroy(force?: boolean) {
		if (this.timer) clearTimeout(this.timer);
		const game = this.room.getGame(ScavengerHunt);
		if (force && game) game.onEnd(false);
		this.room.scavgame = null;
	}

	eliminate(userid: string) {
		if (!this.playerlist?.includes(userid)) return false;
		this.playerlist = this.playerlist.filter(pid => pid !== userid);

		if (this.leaderboard) delete this.leaderboard.data[userid];
		return true;
	}

	announce(msg: string) {
		this.room
			.add(`|raw|<div class="broadcast-blue"><strong>${msg}</strong></div>`)
			.update();
	}
}

const LoadGame = function (room: Room, gameid: string) {
	let game = MODES[gameid];
	if (!game) return false; // invalid id
	if (typeof game === "string") game = MODES[game];

	const base = new ScavengerGameTemplate(room);

	const scavgame = Object.assign(base, Utils.deepClone(game));

	// initialize leaderboard if required
	if (scavgame.leaderboard) {
		scavgame.leaderboard = new Leaderboard();
	}
	return scavgame;
};

export const ScavMods = {
	LoadGame,
	twists: TWISTS,
	modes: MODES,
};
