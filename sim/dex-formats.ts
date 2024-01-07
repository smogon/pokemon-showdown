import {Utils} from '../lib';
import {toID, BasicEffect} from './dex-data';
import {EventMethods} from './dex-conditions';
import {Tags} from '../data/tags';

const DEFAULT_MOD = 'gen9';

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
	checkCanLearn: [TeamValidator['checkCanLearn'], string] | null;
	timer: [Partial<GameTimerSettings>, string] | null;
	tagRules: string[];
	valueRules: Map<string, string>;

	minTeamSize!: number;
	maxTeamSize!: number;
	pickedTeamSize!: number | null;
	maxTotalLevel!: number | null;
	maxMoveCount!: number;
	minSourceGen!: number;
	minLevel!: number;
	maxLevel!: number;
	defaultLevel!: number;
	adjustLevel!: number | null;
	adjustLevelDown!: number | null;
	evLimit!: number | null;

	constructor() {
		super();
		this.complexBans = [];
		this.complexTeamBans = [];
		this.checkCanLearn = null;
		this.timer = null;
		this.tagRules = [];
		this.valueRules = new Map();
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
		for (const tagid in Tags) {
			const tag = Tags[tagid];
			if (this.has(`-pokemontag:${tagid}`)) {
				if ((tag.speciesFilter || tag.genericFilter)!(species)) return true;
			}
		}
		for (const tagid in Tags) {
			const tag = Tags[tagid];
			if (this.has(`+pokemontag:${tagid}`)) {
				if ((tag.speciesFilter || tag.genericFilter)!(species)) return false;
			}
		}
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
		for (const tagid in Tags) {
			const tag = Tags[tagid];
			if (this.has(`*pokemontag:${tagid}`)) {
				if ((tag.speciesFilter || tag.genericFilter)!(species)) return true;
			}
		}
		for (const tagid in Tags) {
			const tag = Tags[tagid];
			if (this.has(`+pokemontag:${tagid}`)) {
				if ((tag.speciesFilter || tag.genericFilter)!(species)) return false;
			}
		}
		return this.has(`*pokemontag:allpokemon`);
	}

	getTagRules() {
		const tagRules = [];
		for (const ruleid of this.keys()) {
			if (/^[+*-]pokemontag:/.test(ruleid)) {
				const banid = ruleid.slice(12);
				if (
					banid === 'allpokemon' || banid === 'allitems' || banid === 'allmoves' ||
					banid === 'allabilities' || banid === 'allnatures'
				) {
					// hardcoded and not a part of the ban rule system
				} else {
					tagRules.push(ruleid);
				}
			} else if ('+*-'.includes(ruleid.charAt(0)) && ruleid.slice(1) === 'nonexistent') {
				tagRules.push(ruleid.charAt(0) + 'pokemontag:nonexistent');
			}
		}
		this.tagRules = tagRules.reverse();
		return this.tagRules;
	}

	/**
	 * - non-empty string: banned, string is the reason
	 * - '': whitelisted
	 * - null: neither whitelisted nor banned
	 */
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

	blame(key: string): string {
		const source = this.get(key);
		return source ? ` from ${source}` : ``;
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

	/** After a RuleTable has been filled out, resolve its hardcoded numeric properties */
	resolveNumbers(format: Format, dex: ModdedDex) {
		const gameTypeMinTeamSize = ['triples', 'rotation'].includes(format.gameType as 'triples') ? 3 :
			format.gameType === 'doubles' ? 2 :
			1;

		// NOTE: These numbers are pre-calculated here because they're hardcoded
		// into the team validator and battle engine, and can affect validation
		// in complicated ways.

		// If you're making your own rule, it nearly definitely does not not
		// belong here: `onValidateRule`, `onValidateSet`, and `onValidateTeam`
		// should be enough for a validator rule, and the battle event system
		// should be enough for a battle rule.

		this.minTeamSize = Number(this.valueRules.get('minteamsize')) || 0;
		this.maxTeamSize = Number(this.valueRules.get('maxteamsize')) || 6;
		this.pickedTeamSize = Number(this.valueRules.get('pickedteamsize')) || null;
		this.maxTotalLevel = Number(this.valueRules.get('maxtotallevel')) || null;
		this.maxMoveCount = Number(this.valueRules.get('maxmovecount')) || 4;
		this.minSourceGen = Number(this.valueRules.get('minsourcegen')) || 1;
		this.minLevel = Number(this.valueRules.get('minlevel')) || 1;
		this.maxLevel = Number(this.valueRules.get('maxlevel')) || 100;
		this.defaultLevel = Number(this.valueRules.get('defaultlevel')) || 0;
		this.adjustLevel = Number(this.valueRules.get('adjustlevel')) || null;
		this.adjustLevelDown = Number(this.valueRules.get('adjustleveldown')) || null;
		this.evLimit = Number(this.valueRules.get('evlimit')) || null;

		if (this.valueRules.get('pickedteamsize') === 'Auto') {
			this.pickedTeamSize = (
				['doubles', 'rotation'].includes(format.gameType) ? 4 :
				format.gameType === 'triples' ? 6 :
				3
			);
		}
		if (this.valueRules.get('evlimit') === 'Auto') {
			this.evLimit = dex.gen > 2 ? 510 : null;
			if (format.mod === 'gen7letsgo') {
				this.evLimit = this.has('allowavs') ? null : 0;
			}
			// Gen 6 hackmons also has a limit, which is currently implemented
			// at the appropriate format.
		}

		// sanity checks; these _could_ be inside `onValidateRule` but this way
		// involves less string conversion.

		// engine hard limits
		if (this.maxTeamSize > 24) {
			throw new Error(`Max team size ${this.maxTeamSize}${this.blame('maxteamsize')} is unsupported (we only support up to 24).`);
		}
		if (this.maxLevel > 99999) {
			throw new Error(`Max level ${this.maxLevel}${this.blame('maxlevel')} is unsupported (we only support up to 99999)`);
		}
		if (this.maxMoveCount > 24) {
			// A limit is imposed here to prevent too much engine strain or
			// too much layout deformation - to be exact, this is the limit
			// allowed in Custom Game.
			throw new Error(`Max move count ${this.maxMoveCount}${this.blame('maxmovecount')} is unsupported (we only support up to 24)`);
		}

		if (!this.defaultLevel) {
			// defaultLevel will set level 100 pokemon to the default level, which can break
			// Max Total Level if Max Level is above 100.
			const maxTeamSize = this.pickedTeamSize || this.maxTeamSize;
			if (this.maxTotalLevel && this.maxLevel > 100 && this.maxLevel * maxTeamSize > this.maxTotalLevel) {
				this.defaultLevel = 100;
			} else {
				this.defaultLevel = this.maxLevel;
			}
		}
		if (this.minTeamSize && this.minTeamSize < gameTypeMinTeamSize) {
			throw new Error(`Min team size ${this.minTeamSize}${this.blame('minteamsize')} must be at least ${gameTypeMinTeamSize} for a ${format.gameType} game.`);
		}
		if (this.pickedTeamSize && this.pickedTeamSize < gameTypeMinTeamSize) {
			throw new Error(`Chosen team size ${this.pickedTeamSize}${this.blame('pickedteamsize')} must be at least ${gameTypeMinTeamSize} for a ${format.gameType} game.`);
		}
		if (this.minTeamSize && this.pickedTeamSize && this.minTeamSize < this.pickedTeamSize) {
			throw new Error(`Min team size ${this.minTeamSize}${this.blame('minteamsize')} is lower than chosen team size ${this.pickedTeamSize}${this.blame('pickedteamsize')}.`);
		}
		if (!this.minTeamSize) this.minTeamSize = Math.max(gameTypeMinTeamSize, this.pickedTeamSize || 0);
		if (this.maxTeamSize < gameTypeMinTeamSize) {
			throw new Error(`Max team size ${this.maxTeamSize}${this.blame('maxteamsize')} must be at least ${gameTypeMinTeamSize} for a ${format.gameType} game.`);
		}
		if (this.maxTeamSize < this.minTeamSize) {
			throw new Error(`Max team size ${this.maxTeamSize}${this.blame('maxteamsize')} must be at least min team size ${this.minTeamSize}${this.blame('minteamsize')}.`);
		}
		if (this.minLevel > this.maxLevel) {
			throw new Error(`Min level ${this.minLevel}${this.blame('minlevel')} should not be above max level ${this.maxLevel}${this.blame('maxlevel')}.`);
		}
		if (this.defaultLevel > this.maxLevel) {
			throw new Error(`Default level ${this.defaultLevel}${this.blame('defaultlevel')} should not be above max level ${this.maxLevel}${this.blame('maxlevel')}.`);
		}
		if (this.defaultLevel < this.minLevel) {
			throw new Error(`Default level ${this.defaultLevel}${this.blame('defaultlevel')} should not be below min level ${this.minLevel}${this.blame('minlevel')}.`);
		}
		if (this.adjustLevelDown && this.adjustLevelDown >= this.maxLevel) {
			throw new Error(`Adjust Level Down ${this.adjustLevelDown}${this.blame('adjustleveldown')} will have no effect because it's not below max level ${this.maxLevel}${this.blame('maxlevel')}.`);
		}
		if (this.adjustLevel && this.valueRules.has('minlevel')) {
			throw new Error(`Min Level ${this.minLevel}${this.blame('minlevel')} will have no effect because you're using Adjust Level ${this.adjustLevel}${this.blame('adjustlevel')}.`);
		}
		if (this.evLimit && this.evLimit >= 1512) {
			throw new Error(`EV Limit ${this.evLimit}${this.blame('evlimit')} will have no effect because it's not lower than 1512, the maximum possible combination of 252 EVs in every stat (if you currently have an EV limit, use "! EV Limit" to remove the limit).`);
		}
		if (this.evLimit && this.evLimit < 0) {
			throw new Error(`EV Limit ${this.evLimit}${this.blame('evlimit')} can't be less than 0 (you might have meant: "! EV Limit" to remove the limit, or "EV Limit = 0" to ban EVs).`);
		}

		if ((format as any).cupLevelLimit) {
			throw new Error(`cupLevelLimit.range[0], cupLevelLimit.range[1], cupLevelLimit.total are now rules, respectively: "Min Level = NUMBER", "Max Level = NUMBER", and "Max Total Level = NUMBER"`);
		}
		if ((format as any).teamLength) {
			throw new Error(`teamLength.validate[0], teamLength.validate[1], teamLength.battle are now rules, respectively: "Min Team Size = NUMBER", "Max Team Size = NUMBER", and "Picked Team Size = NUMBER"`);
		}
		if ((format as any).minSourceGen) {
			throw new Error(`minSourceGen is now a rule: "Min Source Gen = NUMBER"`);
		}
		if ((format as any).maxLevel) {
			throw new Error(`maxLevel is now a rule: "Max Level = NUMBER"`);
		}
		if ((format as any).defaultLevel) {
			throw new Error(`defaultLevel is now a rule: "Default Level = NUMBER"`);
		}
		if ((format as any).forcedLevel) {
			throw new Error(`forcedLevel is now a rule: "Adjust Level = NUMBER"`);
		}
		if ((format as any).maxForcedLevel) {
			throw new Error(`maxForcedLevel is now a rule: "Adjust Level Down = NUMBER"`);
		}
	}

	hasComplexBans() {
		return (this.complexBans?.length > 0) || (this.complexTeamBans?.length > 0);
	}
}

export class Format extends BasicEffect implements Readonly<BasicEffect> {
	readonly mod: string;
	/**
	 * Name of the team generator algorithm, if this format uses
	 * random/fixed teams. null if players can bring teams.
	 */
	declare readonly team?: string;
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
	/** Number of players, based on game type, for convenience */
	readonly playerCount: 2 | 4;
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
	/** An optional function that runs at the start of a battle. */
	readonly onBegin?: (this: Battle) => void;
	readonly noLog: boolean;

	/**
	 * Only applies to rules, not formats
	 */
	declare readonly hasValue?: boolean | 'integer' | 'positive-integer';
	declare readonly onValidateRule?: (
		this: {format: Format, ruleTable: RuleTable, dex: ModdedDex}, value: string
	) => string | void;
	/** ID of rule that can't be combined with this rule */
	declare readonly mutuallyExclusiveWith?: string;

	declare readonly battle?: ModdedBattleScriptsData;
	declare readonly pokemon?: ModdedBattlePokemon;
	declare readonly queue?: ModdedBattleQueue;
	declare readonly field?: ModdedField;
	declare readonly actions?: ModdedBattleActions;
	declare readonly challengeShow?: boolean;
	declare readonly searchShow?: boolean;
	declare readonly bestOfDefault?: boolean;
	declare readonly threads?: string[];
	declare readonly timer?: Partial<GameTimerSettings>;
	declare readonly tournamentShow?: boolean;
	declare readonly checkCanLearn?: (
		this: TeamValidator, move: Move, species: Species, setSources: PokemonSources, set: PokemonSet
	) => string | null;
	declare readonly getEvoFamily?: (this: Format, speciesid: string) => ID;
	declare readonly getSharedPower?: (this: Format, pokemon: Pokemon) => Set<string>;
	declare readonly getSharedItems?: (this: Format, pokemon: Pokemon) => Set<string>;
	declare readonly onChangeSet?: (
		this: TeamValidator, set: PokemonSet, format: Format, setHas?: AnyObject, teamHas?: AnyObject
	) => string[] | void;
	declare readonly onModifySpeciesPriority?: number;
	declare readonly onModifySpecies?: (
		this: Battle, species: Species, target?: Pokemon, source?: Pokemon, effect?: Effect
	) => Species | void;
	declare readonly onBattleStart?: (this: Battle) => void;
	declare readonly onTeamPreview?: (this: Battle) => void;
	declare readonly onValidateSet?: (
		this: TeamValidator, set: PokemonSet, format: Format, setHas: AnyObject, teamHas: AnyObject
	) => string[] | void;
	declare readonly onValidateTeam?: (
		this: TeamValidator, team: PokemonSet[], format: Format, teamHas: AnyObject
	) => string[] | void;
	declare readonly validateSet?: (this: TeamValidator, set: PokemonSet, teamHas: AnyObject) => string[] | null;
	declare readonly validateTeam?: (this: TeamValidator, team: PokemonSet[], options?: {
		removeNicknames?: boolean,
		skipSets?: {[name: string]: {[key: string]: boolean}},
	}) => string[] | void;
	declare readonly section?: string;
	declare readonly column?: number;

	constructor(data: AnyObject) {
		super(data);
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		data = this;

		this.mod = Utils.getString(data.mod) || 'gen9';
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
		this.onBegin = data.onBegin || undefined;
		this.noLog = !!data.noLog;
		this.playerCount = (this.gameType === 'multi' || this.gameType === 'freeforall' ? 4 : 2);
	}
}

/** merges format lists from config/formats and config/custom-formats */
function mergeFormatLists(main: FormatList, custom: FormatList | undefined): FormatList {
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

export class DexFormats {
	readonly dex: ModdedDex;
	rulesetCache = new Map<ID, Format>();
	formatsListCache: readonly Format[] | null;

	constructor(dex: ModdedDex) {
		this.dex = dex;
		this.formatsListCache = null;
	}

	load(): this {
		if (!this.dex.isBase) throw new Error(`This should only be run on the base mod`);
		this.dex.includeMods();
		if (this.formatsListCache) return this;

		const formatsList = [];

		// Load formats
		let customFormats;
		try {
			customFormats = require(`${__dirname}/../config/custom-formats`).Formats;
			if (!Array.isArray(customFormats)) {
				throw new TypeError(`Exported property 'Formats' from "./config/custom-formats.ts" must be an array`);
			}
		} catch (e: any) {
			if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') {
				throw e;
			}
		}
		let Formats: AnyObject[] = require(`${__dirname}/../config/formats`).Formats;
		if (!Array.isArray(Formats)) {
			throw new TypeError(`Exported property 'Formats' from "./config/formats.ts" must be an array`);
		}
		if (customFormats) Formats = mergeFormatLists(Formats as any, customFormats);

		let section = '';
		let column = 1;
		for (const [i, format] of Formats.entries()) {
			const id = toID(format.name);
			if (format.section) section = format.section;
			if (format.column) column = format.column;
			if (!format.name && format.section) continue;
			if (!id) {
				throw new RangeError(`Format #${i + 1} must have a name with alphanumeric characters, not '${format.name}'`);
			}
			if (!format.section) format.section = section;
			if (!format.column) format.column = column;
			if (this.rulesetCache.has(id)) throw new Error(`Format #${i + 1} has a duplicate ID: '${id}'`);
			format.effectType = 'Format';
			format.baseRuleset = format.ruleset ? format.ruleset.slice() : [];
			if (format.challengeShow === undefined) format.challengeShow = true;
			if (format.searchShow === undefined) format.searchShow = true;
			if (format.tournamentShow === undefined) format.tournamentShow = true;
			if (format.bestOfDefault === undefined) format.bestOfDefault = false;
			if (format.mod === undefined) format.mod = 'gen9';
			if (!this.dex.dexes[format.mod]) throw new Error(`Format "${format.name}" requires nonexistent mod: '${format.mod}'`);

			const ruleset = new Format(format);
			this.rulesetCache.set(id, ruleset);
			formatsList.push(ruleset);
		}

		this.formatsListCache = formatsList;
		return this;
	}

	/**
	 * Returns a sanitized format ID if valid, or throws if invalid.
	 */
	validate(name: string) {
		const [formatName, customRulesString] = name.split('@@@', 2);
		const format = this.get(formatName);
		if (!format.exists) throw new Error(`Unrecognized format "${formatName}"`);
		if (!customRulesString) return format.id;
		const ruleTable = this.getRuleTable(format);
		const customRules = customRulesString.split(',').map(rule => {
			rule = rule.replace(/[\r\n|]*/g, '').trim();
			const ruleSpec = this.validateRule(rule);
			if (typeof ruleSpec === 'string' && ruleTable.has(ruleSpec)) return null;
			return rule;
		}).filter(Boolean);
		if (!customRules.length) throw new Error(`The format already has your custom rules`);
		const validatedFormatid = format.id + '@@@' + customRules.join(',');
		const moddedFormat = this.get(validatedFormatid, true);
		this.getRuleTable(moddedFormat);
		return validatedFormatid;
	}

	get(name?: string | Format, isTrusted = false): Format {
		if (name && typeof name !== 'string') return name;

		name = (name || '').trim();
		let id = toID(name);

		if (!name.includes('@@@')) {
			const ruleset = this.rulesetCache.get(id);
			if (ruleset) return ruleset;
		}

		if (this.dex.data.Aliases.hasOwnProperty(id)) {
			name = this.dex.data.Aliases[id];
			id = toID(name);
		}
		if (this.dex.data.Rulesets.hasOwnProperty(DEFAULT_MOD + id)) {
			id = (DEFAULT_MOD + id) as ID;
		}
		let supplementaryAttributes: AnyObject | null = null;
		if (name.includes('@@@')) {
			if (!isTrusted) {
				try {
					name = this.validate(name);
					isTrusted = true;
				} catch {}
			}
			const [newName, customRulesString] = name.split('@@@', 2);
			name = newName.trim();
			id = toID(name);
			if (isTrusted && customRulesString) {
				supplementaryAttributes = {
					customRules: customRulesString.split(','),
					searchShow: false,
				};
			}
		}
		let effect;
		if (this.dex.data.Rulesets.hasOwnProperty(id)) {
			effect = new Format({name, ...this.dex.data.Rulesets[id] as any, ...supplementaryAttributes});
		} else {
			effect = new Format({id, name, exists: false});
		}
		return effect;
	}

	all() {
		this.load();
		return this.formatsListCache!;
	}

	getRuleTable(format: Format, depth = 1, repeals?: Map<string, number>): RuleTable {
		if (format.ruleTable && !repeals) return format.ruleTable;
		if (format.name.length > 50) {
			throw new Error(`Format "${format.name}" has a name longer than 50 characters`);
		}
		if (depth === 1) {
			const dex = this.dex.mod(format.mod);
			if (dex !== this.dex) {
				return dex.formats.getRuleTable(format, 2, repeals);
			}
		}
		const ruleTable = new RuleTable();

		const ruleset = format.ruleset.slice();
		for (const ban of format.banlist) {
			ruleset.push('-' + ban);
		}
		for (const ban of format.restricted) {
			ruleset.push('*' + ban);
		}
		for (const ban of format.unbanlist) {
			ruleset.push('+' + ban);
		}
		if (format.customRules) {
			ruleset.push(...format.customRules);
		}
		if (format.checkCanLearn) {
			ruleTable.checkCanLearn = [format.checkCanLearn, format.name];
		}
		if (format.timer) {
			ruleTable.timer = [format.timer, format.name];
		}

		// apply rule repeals before other rules
		// repeals is a ruleid:depth map (positive: unused, negative: used)
		for (const rule of ruleset) {
			if (rule.startsWith('!') && !rule.startsWith('!!')) {
				const ruleSpec = this.validateRule(rule, format) as string;
				if (!repeals) repeals = new Map();
				repeals.set(ruleSpec.slice(1), depth);
			}
		}

		for (const rule of ruleset) {
			const ruleSpec = this.validateRule(rule, format);

			if (typeof ruleSpec !== 'string') {
				if (ruleSpec[0] === 'complexTeamBan') {
					const complexTeamBan: ComplexTeamBan = ruleSpec.slice(1) as ComplexTeamBan;
					ruleTable.addComplexTeamBan(complexTeamBan[0], complexTeamBan[1], complexTeamBan[2], complexTeamBan[3]);
				} else if (ruleSpec[0] === 'complexBan') {
					const complexBan: ComplexBan = ruleSpec.slice(1) as ComplexBan;
					ruleTable.addComplexBan(complexBan[0], complexBan[1], complexBan[2], complexBan[3]);
				} else {
					throw new Error(`Unrecognized rule spec ${ruleSpec}`);
				}
				continue;
			}

			if (rule.startsWith('!') && !rule.startsWith('!!')) {
				const repealDepth = repeals!.get(ruleSpec.slice(1));
				if (repealDepth === undefined) throw new Error(`Multiple "${rule}" rules in ${format.name}`);
				if (repealDepth === depth) {
					throw new Error(`Rule "${rule}" did nothing because "${rule.slice(1)}" is not in effect`);
				}
				if (repealDepth === -depth) repeals!.delete(ruleSpec.slice(1));
				continue;
			}

			if ('+*-'.includes(ruleSpec.charAt(0))) {
				if (ruleTable.has(ruleSpec)) {
					throw new Error(`Rule "${rule}" in "${format.name}" already exists in "${ruleTable.get(ruleSpec) || format.name}"`);
				}
				for (const prefix of '+*-') ruleTable.delete(prefix + ruleSpec.slice(1));
				ruleTable.set(ruleSpec, '');
				continue;
			}
			let [formatid, value] = ruleSpec.split('=');
			const subformat = this.get(formatid);
			const repealAndReplace = ruleSpec.startsWith('!!');
			if (repeals?.has(subformat.id)) {
				repeals.set(subformat.id, -Math.abs(repeals.get(subformat.id)!));
				continue;
			}
			if (subformat.hasValue) {
				if (value === undefined) throw new Error(`Rule "${ruleSpec}" should have a value (like "${ruleSpec} = something")`);
				if (value === 'Current Gen') value = `${this.dex.gen}`;
				if ((subformat.id === 'pickedteamsize' || subformat.id === 'evlimit') && value === 'Auto') {
					// can't be resolved until later
				} else if (subformat.hasValue === 'integer' || subformat.hasValue === 'positive-integer') {
					const intValue = parseInt(value);
					if (isNaN(intValue) || value !== `${intValue}`) {
						throw new Error(`In rule "${ruleSpec}", "${value}" must be an integer number.`);
					}
				}
				if (subformat.hasValue === 'positive-integer') {
					if (parseInt(value) === 0) {
						throw new Error(`In rule "${ruleSpec}", "${value}" must be positive (to remove it, use the rule "! ${subformat.name}").`);
					}
					if (parseInt(value) <= 0) {
						throw new Error(`In rule "${ruleSpec}", "${value}" must be positive.`);
					}
				}
				const oldValue = ruleTable.valueRules.get(subformat.id);
				if (oldValue === value) {
					throw new Error(`Rule "${ruleSpec}" is redundant with existing rule "${subformat.id}=${value}"${ruleTable.blame(subformat.id)}.`);
				} else if (repealAndReplace) {
					if (oldValue === undefined) {
						if (subformat.mutuallyExclusiveWith && ruleTable.valueRules.has(subformat.mutuallyExclusiveWith)) {
							if (this.dex.formats.get(subformat.mutuallyExclusiveWith).ruleset.length) {
								throw new Error(`This format does not support "!!"`);
							}
							ruleTable.valueRules.delete(subformat.mutuallyExclusiveWith);
							ruleTable.delete(subformat.mutuallyExclusiveWith);
						} else {
							throw new Error(`Rule "${ruleSpec}" is not replacing anything (it should not have "!!")`);
						}
					}
				} else {
					if (oldValue !== undefined) {
						throw new Error(`Rule "${ruleSpec}" conflicts with "${subformat.id}=${oldValue}"${ruleTable.blame(subformat.id)} (Use "!! ${ruleSpec}" to override "${subformat.id}=${oldValue}".)`);
					}
					if (subformat.mutuallyExclusiveWith && ruleTable.valueRules.has(subformat.mutuallyExclusiveWith)) {
						const oldRule = `"${subformat.mutuallyExclusiveWith}=${ruleTable.valueRules.get(subformat.mutuallyExclusiveWith)}"`;
						throw new Error(`Format can't simultaneously have "${ruleSpec}" and ${oldRule}${ruleTable.blame(subformat.mutuallyExclusiveWith)} (Use "!! ${ruleSpec}" to override ${oldRule}.)`);
					}
				}
				ruleTable.valueRules.set(subformat.id, value);
			} else {
				if (value !== undefined) throw new Error(`Rule "${ruleSpec}" should not have a value (no equals sign)`);
				if (repealAndReplace) throw new Error(`"!!" is not supported for this rule`);
				if (ruleTable.has(subformat.id) && !repealAndReplace) {
					throw new Error(`Rule "${rule}" in "${format.name}" already exists in "${ruleTable.get(subformat.id) || format.name}"`);
				}
			}
			ruleTable.set(subformat.id, '');
			if (depth > 16) {
				throw new Error(`Excessive ruleTable recursion in ${format.name}: ${ruleSpec} of ${format.ruleset}`);
			}
			const subRuleTable = this.getRuleTable(subformat, depth + 1, repeals);
			for (const [ruleid, sourceFormat] of subRuleTable) {
				// don't check for "already exists" here; multiple inheritance is allowed
				if (!repeals?.has(ruleid)) {
					const newValue = subRuleTable.valueRules.get(ruleid);
					const oldValue = ruleTable.valueRules.get(ruleid);
					if (newValue !== undefined) {
						// set a value
						const subSubFormat = this.get(ruleid);
						if (subSubFormat.mutuallyExclusiveWith && ruleTable.valueRules.has(subSubFormat.mutuallyExclusiveWith)) {
							// mutually exclusive conflict!
							throw new Error(`Rule "${ruleid}=${newValue}" from ${subformat.name}${subRuleTable.blame(ruleid)} conflicts with "${subSubFormat.mutuallyExclusiveWith}=${ruleTable.valueRules.get(subSubFormat.mutuallyExclusiveWith)}"${ruleTable.blame(subSubFormat.mutuallyExclusiveWith)} (Repeal one with ! before adding another)`);
						}
						if (newValue !== oldValue) {
							if (oldValue !== undefined) {
								// conflict!
								throw new Error(`Rule "${ruleid}=${newValue}" from ${subformat.name}${subRuleTable.blame(ruleid)} conflicts with "${ruleid}=${oldValue}"${ruleTable.blame(ruleid)} (Repeal one with ! before adding another)`);
							}
							ruleTable.valueRules.set(ruleid, newValue);
						}
					}
					ruleTable.set(ruleid, sourceFormat || subformat.name);
				}
			}
			for (const [subRule, source, limit, bans] of subRuleTable.complexBans) {
				ruleTable.addComplexBan(subRule, source || subformat.name, limit, bans);
			}
			for (const [subRule, source, limit, bans] of subRuleTable.complexTeamBans) {
				ruleTable.addComplexTeamBan(subRule, source || subformat.name, limit, bans);
			}
			if (subRuleTable.checkCanLearn) {
				if (ruleTable.checkCanLearn) {
					throw new Error(
						`"${format.name}" has conflicting move validation rules from ` +
						`"${ruleTable.checkCanLearn[1]}" and "${subRuleTable.checkCanLearn[1]}"`
					);
				}
				ruleTable.checkCanLearn = subRuleTable.checkCanLearn;
			}
			if (subRuleTable.timer) {
				if (ruleTable.timer) {
					throw new Error(
						`"${format.name}" has conflicting timer validation rules from "${ruleTable.timer[1]}" and "${subRuleTable.timer[1]}"`
					);
				}
				ruleTable.timer = subRuleTable.timer;
			}
		}
		ruleTable.getTagRules();

		ruleTable.resolveNumbers(format, this.dex);

		const canMegaEvo = this.dex.gen <= 7 || ruleTable.has('+pokemontag:past');
		if (ruleTable.has('obtainableformes') && canMegaEvo &&
			ruleTable.isBannedSpecies(this.dex.species.get('rayquazamega')) &&
			!ruleTable.isBannedSpecies(this.dex.species.get('rayquaza'))
		) {
			// Banning Rayquaza-Mega implicitly adds Mega Rayquaza Clause
			// note that already having it explicitly in the ruleset is ok
			ruleTable.set('megarayquazaclause', '');
		}

		for (const rule of ruleTable.keys()) {
			if ("+*-!".includes(rule.charAt(0))) continue;
			const subFormat = this.dex.formats.get(rule);
			if (subFormat.exists) {
				const value = subFormat.onValidateRule?.call({format, ruleTable, dex: this.dex}, ruleTable.valueRules.get(rule as ID)!);
				if (typeof value === 'string') ruleTable.valueRules.set(subFormat.id, value);
			}
		}

		if (!repeals) format.ruleTable = ruleTable;
		return ruleTable;
	}

	validateRule(rule: string, format: Format | null = null) {
		if (rule !== rule.trim()) throw new Error(`Rule "${rule}" should be trimmed`);
		switch (rule.charAt(0)) {
		case '-':
		case '*':
		case '+':
			if (rule.slice(1).includes('>') || rule.slice(1).includes('+')) {
				let buf = rule.slice(1);
				const gtIndex = buf.lastIndexOf('>');
				let limit = rule.startsWith('+') ? Infinity : 0;
				if (gtIndex >= 0 && /^[0-9]+$/.test(buf.slice(gtIndex + 1).trim())) {
					if (limit === 0) limit = parseInt(buf.slice(gtIndex + 1));
					buf = buf.slice(0, gtIndex);
				}
				let checkTeam = buf.includes('++');
				const banNames = buf.split(checkTeam ? '++' : '+').map(v => v.trim());
				if (banNames.length === 1 && limit > 0) checkTeam = true;
				const innerRule = banNames.join(checkTeam ? ' ++ ' : ' + ');
				const bans = banNames.map(v => this.validateBanRule(v));

				if (checkTeam) {
					return ['complexTeamBan', innerRule, '', limit, bans];
				}
				if (bans.length > 1 || limit > 0) {
					return ['complexBan', innerRule, '', limit, bans];
				}
				throw new Error(`Confusing rule ${rule}`);
			}
			return rule.charAt(0) + this.validateBanRule(rule.slice(1));
		default:
			const [ruleName, value] = rule.split('=');
			let id: string = toID(ruleName);
			const ruleset = this.dex.formats.get(id);
			if (!ruleset.exists) {
				throw new Error(`Unrecognized rule "${rule}"`);
			}
			if (typeof value === 'string') id = `${id}=${value.trim()}`;
			if (rule.startsWith('!!')) return `!!${id}`;
			if (rule.startsWith('!')) return `!${id}`;
			return id;
		}
	}

	validPokemonTag(tagid: ID) {
		const tag = Tags.hasOwnProperty(tagid) && Tags[tagid];
		if (!tag) return false;
		return !!(tag.speciesFilter || tag.genericFilter);
	}

	validateBanRule(rule: string) {
		let id = toID(rule);
		if (id === 'unreleased') return 'unreleased';
		if (id === 'nonexistent') return 'nonexistent';
		const matches = [];
		let matchTypes = ['pokemon', 'move', 'ability', 'item', 'nature', 'pokemontag'];
		for (const matchType of matchTypes) {
			if (rule.startsWith(`${matchType}:`)) {
				matchTypes = [matchType];
				id = id.slice(matchType.length) as ID;
				break;
			}
		}
		const ruleid = id;
		if (this.dex.data.Aliases.hasOwnProperty(id)) id = toID(this.dex.data.Aliases[id]);
		for (const matchType of matchTypes) {
			if (matchType === 'item' && ruleid === 'noitem') return 'item:noitem';
			let table;
			switch (matchType) {
			case 'pokemon': table = this.dex.data.Pokedex; break;
			case 'move': table = this.dex.data.Moves; break;
			case 'item': table = this.dex.data.Items; break;
			case 'ability': table = this.dex.data.Abilities; break;
			case 'nature': table = this.dex.data.Natures; break;
			case 'pokemontag':
				// valid pokemontags
				const validTags = [
					// all
					'allpokemon', 'allitems', 'allmoves', 'allabilities', 'allnatures',
				];
				if (validTags.includes(ruleid) || this.validPokemonTag(ruleid)) {
					matches.push('pokemontag:' + ruleid);
				}
				continue;
			default:
				throw new Error(`Unrecognized match type.`);
			}
			if (table.hasOwnProperty(id)) {
				if (matchType === 'pokemon') {
					const species: Species = table[id] as Species;
					if ((species.otherFormes || species.cosmeticFormes) && ruleid !== species.id + toID(species.baseForme)) {
						matches.push('basepokemon:' + id);
						continue;
					}
				}
				matches.push(matchType + ':' + id);
			} else if (matchType === 'pokemon' && id.endsWith('base')) {
				id = id.slice(0, -4) as ID;
				if (table.hasOwnProperty(id)) {
					matches.push('pokemon:' + id);
				}
			}
		}
		if (matches.length > 1) {
			throw new Error(`More than one thing matches "${rule}"; please specify one of: ` + matches.join(', '));
		}
		if (matches.length < 1) {
			throw new Error(`Nothing matches "${rule}"`);
		}
		return matches[0];
	}
}
