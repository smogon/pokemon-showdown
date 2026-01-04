import { type ScavengerGameTemplate } from "./scavenger-games";
import { type ScavengerHunt, type Scavenger } from "./scavengers";

/** Unmodified Scavenger hunts */

export type GameTypes =
	| "official" |
	"regular" |
	"mini" |
	"unrated" |
	"practice" |
	"recycled";

export interface QueuedHunt {
	hosts: { id: string, name: string, noUpdate?: boolean }[];
	questions: (string | string[])[];
	isHTML: boolean;
	staffHostId: string;
	staffHostName: string;
	gameType: GameTypes;
}
export interface FakeUser {
	name: string;
	id: string;
	noUpdate?: boolean;
}
export interface ModEvent {
	priority: number;
	exec: ModEvents[keyof ModEvents];
}

export interface ScavengerHuntFinish {
	name: string;
	id: string;
	time: string;
	blitz?: boolean;
	modData: Record<string, any>;
}

/** Twist / Gamemode types for Scavengers */

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
}
export enum GameModeType {
	JumpStart = "jumpstart",
	KOGames = "kogames",
	ScavengerGames = "scavengergames",
	PointRally = "pointrally",
	TeamScavengers = "teamscavengers",
}

export type ModEvents = {
	AfterEnd: (isReset?: boolean) => void,
	AfterLoad: () => void,
	AnySubmit: (player: Scavenger, value: string, originalValue: string) => void,
	Complete: (
		finish: ScavengerHuntFinish,
		player: Scavenger
	) => ScavengerHuntFinish | boolean | void,
	ConfirmCompletion: (
		player: Scavenger,
		time: string,
		blitz: boolean,
		place: string,
		result: ScavengerHuntFinish
	) => string | "silent" | void,
	Connect: (user: User, connection: Connection) => void,
	CorrectAnswer: (player: Scavenger, value: string) => void,
	CreateCallback: () => string | undefined,
	EditQuestion: (
		questionNumber: number,
		questionAnswer: string,
		value: string
	) => void,
	End: (isReset?: boolean) => void,
	GivePoints: () => boolean,
	HideCompletion: () => boolean,
	IncorrectAnswer: (player: Scavenger, value: string) => void,
	Join: (player: User) => void,
	Leave: (player: Scavenger) => void,
	Load: (questions: (string | string[])[]) => void,
	NotifyChange: (num: number) => void,
	PreComplete: (player: Scavenger) => void,
	SendQuestion: (player: Scavenger, showHints?: boolean) => void,
	ShowEndBoard: (endedBy?: User) => void,
	Submit: (player: Scavenger, value: string, originalValue: string) => void,
	ViewHunt: (user: User) => void,
};

/**
 * This is the base interface for any hunt that applies one or more twists.
 * In order to allow mods to stack, we need to make sure that mod-specific data (eg: 'leftGame')
 * doesn't get affected by other mods.
 */
interface TwistedHunt<T extends TwistType | GameModeType = never>
	extends Omit<ScavengerHunt, "playerTable"> {
	modData: T extends keyof CommonModData ?
		Required<Pick<CommonModData, T>> & CommonModData :
		CommonModData;
	playerTable: Record<string, TwistPlayer<T>>;
	completed: TwistResult<T>[];
}

export type Twist<T extends TwistType | GameModeType = never> = {
	name: string,
	id: TwistType | GameModeType,
	isGameMode?: true,
	desc?: string,
} & {
	[E in keyof ModEvents as `on${E}`]?: (
		this: TwistedHunt<T>,
		...args: UpdateParamsForTwists<Parameters<ModEvents[E]>, T>
	) => ReturnType<ModEvents[E]>;
} & {
	[E in keyof ModEvents as `on${E}Priority`]?: number;
};

// Data stored in the game object
type CommonModData = Partial<{
	[TwistType.PerfectScore]: {
		leftGame: Set<string>,
	},
	[TwistType.Incognito]: {
		preCompleted: ScavengerHuntFinish[],
	},
	[TwistType.TimeTrial]: {
		altIps: Record<string, { id: string, name: string }>,
		startTimes: Record<string, number>,
	},
	[TwistType.ScavengersFeud]: {
		guesses: Record<string, string[]>,
		incorrect: Record<string, Set<string>>[],
	},
	[TwistType.Pointless]: {
		correct: Record<string, string[]>[],
	},
	[TwistType.Minesweeper]: {
		mines: string[][],
		guesses: { [playerId: string]: Set<string> }[],
	},
	[GameModeType.JumpStart]: {
		jumpstartTimers: NodeJS.Timeout[],
		answerLock: boolean,
	},
}>;
// Data stored in each finish object
type CommonModResult = Partial<{
	[TwistType.PerfectScore]: { isPerfect?: boolean },
	[TwistType.BonusRound]: { noSkipBonus?: boolean },
	[TwistType.SpamFilter]: { totalTime: number, penalty: number },
	[TwistType.TimeTrial]: { duration: number },
}>;
// Data stored in each player object
type CommonTwistPlayer = Scavenger & {
	modData: Partial<{
		[TwistType.PerfectScore]: { answers: Record<number, string[]> },
		[TwistType.BonusRound]: { skippedQuestion: boolean },
		[TwistType.BlindIncognito]: { preCompleted?: boolean },
		[TwistType.SpamFilter]: { incorrect: string[] },
		[TwistType.Minesweeper]: { mines: { index: number, mine: string }[] },
	}>,
};

type TwistResult<T extends TwistType | GameModeType = never> =
	ScavengerHuntFinish & {
		modData: T extends keyof CommonModResult ?
			Required<Pick<CommonModResult, T>> & CommonModResult :
			CommonModResult,
	};
type TwistPlayer<T extends TwistType | GameModeType = never> =
	CommonTwistPlayer & {
		modData: T extends keyof CommonTwistPlayer["modData"] ?
			Required<Pick<CommonTwistPlayer["modData"], T>> :
			unknown,
	};

type UpdateParamsForTwists<
	Params extends readonly unknown[],
	T extends TwistType | GameModeType = never,
> = {
	[P in keyof Params]: Params[P] extends Scavenger ?
		TwistPlayer<T> :
		Params[P] extends ScavengerHuntFinish ?
			TwistResult<T> :
			Params[P];
};

type GameModeFunction = (this: ScavengerGameTemplate, ...args: any[]) => void;

export interface GameMode {
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
