import {Utils} from '../lib/utils';
import {toID, BasicEffect} from './dex-data';
import {EventMethods} from './dex-conditions';

export interface FormatData extends Partial<Format>, EventMethods {
	name: string;
}

export type FormatList = (FormatData | {section: string, column?: number})[];
export type ModdedFormatData = FormatData | Omit<FormatData, 'name'> & {inherit: true};

type FormatEffectType = 'Format' | 'Ruleset' | 'Rule' | 'ValidatorRule';

/** rule, source, limit, bans */
export type ComplexBan = [string, string, number, string[]];
export type ComplexTeamBan = ComplexBan;

/**
 * A RuleTable keeps track of the rules that a format has. The key can be:
 * - '[ruleid]' the ID of a rule in effect
 * - '-[thing]' or '-[category]:[thing]' ban a thing
 * - '+[thing]' or '+[category]:[thing]' allow a thing (override a ban)
 * [category] is one of: item, move, ability, species, basespecies
 *
 * The value is the name of the parent rule (blank for the active format).
 */
export class RuleTable extends Map<string, string> {
	complexBans: ComplexBan[];
	complexTeamBans: ComplexTeamBan[];
	// eslint-disable-next-line @typescript-eslint/ban-types
	checkLearnset: [Function, string] | null;
	timer: [Partial<GameTimerSettings>, string] | null;
	minSourceGen: [number, string] | null;

	constructor() {
		super();
		this.complexBans = [];
		this.complexTeamBans = [];
		this.checkLearnset = null;
		this.timer = null;
		this.minSourceGen = null;
	}

	isBanned(thing: string) {
		if (this.has(`+${thing}`)) return false;
		return this.has(`-${thing}`);
	}

	isBannedSpecies(species: Species) {
		if (this.has(`+pokemon:${species.id}`)) return false;
		if (this.has(`-pokemon:${species.id}`)) return true;
		if (this.has(`+basepokemon:${toID(species.baseSpecies)}`)) return false;
		if (this.has(`-basepokemon:${toID(species.baseSpecies)}`)) return true;
		const tier = species.tier === '(PU)' ? 'ZU' : species.tier === '(NU)' ? 'PU' : species.tier;
		if (this.has(`+pokemontag:${toID(tier)}`)) return false;
		if (this.has(`-pokemontag:${toID(tier)}`)) return true;
		const doublesTier = species.doublesTier === '(DUU)' ? 'DNU' : species.doublesTier;
		if (this.has(`+pokemontag:${toID(doublesTier)}`)) return false;
		if (this.has(`-pokemontag:${toID(doublesTier)}`)) return true;
		return this.has(`-pokemontag:allpokemon`);
	}

	isRestricted(thing: string) {
		if (this.has(`+${thing}`)) return false;
		return this.has(`*${thing}`);
	}

	isRestrictedSpecies(species: Species) {
		if (this.has(`+pokemon:${species.id}`)) return false;
		if (this.has(`*pokemon:${species.id}`)) return true;
		if (this.has(`+basepokemon:${toID(species.baseSpecies)}`)) return false;
		if (this.has(`*basepokemon:${toID(species.baseSpecies)}`)) return true;
		const tier = species.tier === '(PU)' ? 'ZU' : species.tier === '(NU)' ? 'PU' : species.tier;
		if (this.has(`+pokemontag:${toID(tier)}`)) return false;
		if (this.has(`*pokemontag:${toID(tier)}`)) return true;
		const doublesTier = species.doublesTier === '(DUU)' ? 'DNU' : species.doublesTier;
		if (this.has(`+pokemontag:${toID(doublesTier)}`)) return false;
		if (this.has(`*pokemontag:${toID(doublesTier)}`)) return true;
		return this.has(`*pokemontag:allpokemon`);
	}

	check(thing: string, setHas: {[id: string]: true} | null = null) {
		if (this.has(`+${thing}`)) return '';
		if (setHas) setHas[thing] = true;
		return this.getReason(`-${thing}`);
	}

	getReason(key: string): string | null {
		const source = this.get(key);
		if (source === undefined) return null;
		if (key === '-nonexistent' || key.startsWith('obtainable')) {
			return 'not obtainable';
		}
		return source ? `banned by ${source}` : `banned`;
	}

	getComplexBanIndex(complexBans: ComplexBan[], rule: string): number {
		const ruleId = toID(rule);
		let complexBanIndex = -1;
		for (let i = 0; i < complexBans.length; i++) {
			if (toID(complexBans[i][0]) === ruleId) {
				complexBanIndex = i;
				break;
			}
		}
		return complexBanIndex;
	}

	addComplexBan(rule: string, source: string, limit: number, bans: string[]) {
		const complexBanIndex = this.getComplexBanIndex(this.complexBans, rule);
		if (complexBanIndex !== -1) {
			if (this.complexBans[complexBanIndex][2] === Infinity) return;
			this.complexBans[complexBanIndex] = [rule, source, limit, bans];
		} else {
			this.complexBans.push([rule, source, limit, bans]);
		}
	}

	addComplexTeamBan(rule: string, source: string, limit: number, bans: string[]) {
		const complexBanTeamIndex = this.getComplexBanIndex(this.complexTeamBans, rule);
		if (complexBanTeamIndex !== -1) {
			if (this.complexTeamBans[complexBanTeamIndex][2] === Infinity) return;
			this.complexTeamBans[complexBanTeamIndex] = [rule, source, limit, bans];
		} else {
			this.complexTeamBans.push([rule, source, limit, bans]);
		}
	}
}

export class Format extends BasicEffect implements Readonly<BasicEffect> {
	readonly mod: string;
	/**
	 * Name of the team generator algorithm, if this format uses
	 * random/fixed teams. null if players can bring teams.
	 */
	readonly team?: string;
	readonly effectType: FormatEffectType;
	readonly debug: boolean;
	/**
	 * Whether or not a format will update ladder points if searched
	 * for using the "Battle!" button.
	 * (Challenge and tournament games will never update ladder points.)
	 * (Defaults to `true`.)
	 */
	readonly rated: boolean | string;
	/** Game type. */
	readonly gameType: GameType;
	/** List of rule names. */
	readonly ruleset: string[];
	/**
	 * Base list of rule names as specified in "./config/formats.ts".
	 * Used in a custom format to correctly display the altered ruleset.
	 */
	readonly baseRuleset: string[];
	/** List of banned effects. */
	readonly banlist: string[];
	/** List of effects that aren't completely banned. */
	readonly restricted: string[];
	/** List of inherited banned effects to override. */
	readonly unbanlist: string[];
	/** List of ruleset and banlist changes in a custom format. */
	readonly customRules: string[] | null;
	/** Table of rule names and banned effects. */
	ruleTable: RuleTable | null;
	/**
	 * The number of Pokemon players can bring to battle and
	 * the number that can actually be used.
	 */
	readonly teamLength?: {battle?: number, validate?: [number, number]};
	/** An optional function that runs at the start of a battle. */
	readonly onBegin?: (this: Battle) => void;
	/** Pokemon must be obtained from this generation or later. */
	readonly minSourceGen?: number;
	/**
	 * Maximum possible level pokemon you can bring. Note that this is
	 * still 100 in VGC, because you can bring level 100 pokemon,
	 * they'll just be set to level 50. Can be above 100 in special
	 * formats.
	 */
	readonly maxLevel: number;
	/**
	 * Default level of a pokemon without level specified. Mainly
	 * relevant to Custom Game where the default level is still 100
	 * even though higher level pokemon can be brought.
	 */
	readonly defaultLevel: number;
	/**
	 * Forces all pokemon brought in to this level. Certain Game Freak
	 * formats will change level 1 and level 100 pokemon to level 50,
	 * which is what this does.
	 *
	 * You usually want maxForcedLevel instead, which will bring level
	 * 100 pokemon down, but not level 1 pokemon up.
	 */
	readonly forcedLevel?: number;
	/**
	 * Forces all pokemon above this level down to this level. This
	 * will allow e.g. level 50 Hydreigon in Gen 5, which is not
	 * normally legal because Hydreigon doesn't evolve until level
	 * 64.
	 */
	readonly maxForcedLevel?: number;
	readonly noLog: boolean;

	readonly battle?: ModdedBattleScriptsData;
	readonly pokemon?: ModdedBattlePokemon;
	readonly queue?: ModdedBattleQueue;
	readonly field?: ModdedField;
	readonly cannotMega?: string[];
	readonly challengeShow?: boolean;
	readonly searchShow?: boolean;
	readonly threads?: string[];
	readonly timer?: Partial<GameTimerSettings>;
	readonly tournamentShow?: boolean;
	readonly checkLearnset?: (
		this: TeamValidator, move: Move, species: Species, setSources: PokemonSources, set: PokemonSet
	) => {type: string, [any: string]: any} | null;
	readonly getEvoFamily?: (this: Format, speciesid: string) => ID;
	readonly getSharedPower?: (this: Format, pokemon: Pokemon) => Set<string>;
	readonly onAfterMega?: (this: Battle, pokemon: Pokemon) => void;
	readonly onChangeSet?: (
		this: TeamValidator, set: PokemonSet, format: Format, setHas?: AnyObject, teamHas?: AnyObject
	) => string[] | void;
	readonly onModifySpecies?: (
		this: Battle, species: Species, target?: Pokemon, source?: Pokemon, effect?: Effect
	) => Species | void;
	readonly onStart?: (this: Battle) => void;
	readonly onTeamPreview?: (this: Battle) => void;
	readonly onValidateSet?: (
		this: TeamValidator, set: PokemonSet, format: Format, setHas: AnyObject, teamHas: AnyObject
	) => string[] | void;
	readonly onValidateTeam?: (
		this: TeamValidator, team: PokemonSet[], format: Format, teamHas: AnyObject
	) => string[] | void;
	readonly validateSet?: (this: TeamValidator, set: PokemonSet, teamHas: AnyObject) => string[] | null;
	readonly validateTeam?: (this: TeamValidator, team: PokemonSet[], options?: {
		removeNicknames?: boolean,
		skipSets?: {[name: string]: {[key: string]: boolean}},
	}) => string[] | void;
	readonly section?: string;
	readonly column?: number;

	constructor(data: AnyObject, ...moreData: (AnyObject | null)[]) {
		super(data, ...moreData);
		data = this;

		this.mod = Utils.getString(data.mod) || 'gen8';
		this.effectType = Utils.getString(data.effectType) as FormatEffectType || 'Format';
		this.debug = !!data.debug;
		this.rated = (typeof data.rated === 'string' ? data.rated : data.rated !== false);
		this.gameType = data.gameType || 'singles';
		this.ruleset = data.ruleset || [];
		this.baseRuleset = data.baseRuleset || [];
		this.banlist = data.banlist || [];
		this.restricted = data.restricted || [];
		this.unbanlist = data.unbanlist || [];
		this.customRules = data.customRules || null;
		this.ruleTable = null;
		this.teamLength = data.teamLength || undefined;
		this.onBegin = data.onBegin || undefined;
		this.minSourceGen = data.minSourceGen || undefined;
		this.maxLevel = data.maxLevel || 100;
		this.defaultLevel = data.defaultLevel || this.maxLevel;
		this.forcedLevel = data.forcedLevel || undefined;
		this.maxForcedLevel = data.maxForcedLevel || undefined;
		this.noLog = !!data.noLog;
	}
}

/** merges format lists from config/formats and config/custom-formats */
export function mergeFormatLists(main: FormatList, custom: FormatList | undefined): FormatList {
	// interface for the builder.
	interface FormatSection {
		section: string;
		column?: number;
		formats: FormatData[];
	}

	// result that is return and makes the actual list for formats.
	const result: FormatList = [];

	// used as a intermediary to build the final list.
	const build: FormatSection[] = [];

	// used to track current section to keep formats under their sections.
	let current: FormatSection | undefined = {section: "", formats: []};

	// populates the original sections and formats easily
	// there should be no repeat sections at this point.
	for (const element of main) {
		if (element.section) {
			current = {section: element.section, column: element.column, formats: []};
			build.push(current);
		} else if ((element as FormatData).name) {
			current.formats.push((element as FormatData));
		}
	}

	// merges the second list the hard way. Accounts for repeats.
	if (custom !== undefined) {
		for (const element of custom) {
			// finds the section and makes it if it doesn't exist.
			if (element.section) {
				current = build.find(e => e.section === element.section);

				// if it's new it makes a new entry.
				if (current === undefined) {
					current = {section: element.section, column: element.column, formats: []};
					build.push(current);
				}
			} else if ((element as FormatData).name) { // otherwise, adds the element to its section.
				current.formats.push(element as FormatData);
			}
		}
	}

	// builds the final result.
	for (const element of build) {
		// adds the section to the list.
		result.push({section: element.section, column: element.column}, ...element.formats);
	}

	return result;
}
