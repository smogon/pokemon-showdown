/**
 * Dex Text
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */
import * as path from 'path';
import {
	OTHER_NAME_TABLES, toID,
	type EffectText, type ModdedEffectText, type OtherNameTable, type TextEffect, type TextLanguage,
} from './dex-data';
import type { DexTable } from './dex';
import type { TagData } from '../data/tags';

const TEXT_DIR = path.resolve(__dirname, '../data/text');

interface RawTextTableData extends Record<OtherNameTable, DexTable<TranslationString>> {
	Abilities: DexTable<AbilityText>;
	Items: DexTable<ItemText>;
	Moves: DexTable<MoveText>;
	Pokedex: DexTable<SpeciesText>;
	Tags: DexTable<TagText>;
	Default: DexTable<DefaultText>;
}

type EffectTextTable = 'Abilities' | 'Items' | 'Moves';

const TEXT_LANGUAGES = [
	{ code: "en", legacyId: "english", name: "English", fullName: "English" },
	{ code: "de", legacyId: "german", name: "Deutsch", fullName: "Deutsch (German)" },
	{ code: "es", legacyId: "spanish", name: "Español", fullName: "Español (Spanish)" },
	{ code: "fr", legacyId: "french", name: "Français", fullName: "Français (French)" },
	{ code: "it", legacyId: "italian", name: "Italiano", fullName: "Italiano (Italian)" },
	{ code: "nl", legacyId: "dutch", name: "Nederlands", fullName: "Nederlands (Dutch)" },
	{ code: "pt", legacyId: "portuguese", name: "Português", fullName: "Português (Portuguese)" },
	{ code: "tr", legacyId: "turkish", name: "Türkçe", fullName: "Türkçe (Turkish)" },
	{ code: "hi", legacyId: "hindi", name: "हिंदी", fullName: "हिंदी (Hindi)" },
	{ code: "ja", legacyId: "japanese", name: "日本語", fullName: "日本語 (Japanese)" },
	{ code: "zh-cn", legacyId: "simplifiedchinese", name: "简体中文", fullName: "简体中文 (Simplified Chinese)" },
	{ code: "zh-tw", legacyId: "traditionalchinese", name: "繁體中文", fullName: "繁體中文 (Traditional Chinese)" },
	{ code: "ko", legacyId: "korean", name: "한국어", fullName: "한국어 (Korean)" },
];
type Language = typeof TEXT_LANGUAGES[number];
const TEXT_LANGUAGE_TABLE: Record<string, Language> = {};
for (const lang of TEXT_LANGUAGES) {
	TEXT_LANGUAGE_TABLE[toID(lang.code)] = lang;
	TEXT_LANGUAGE_TABLE[lang.code] = lang;
	TEXT_LANGUAGE_TABLE[lang.legacyId] = lang;
	TEXT_LANGUAGE_TABLE[lang.name] = lang;
	TEXT_LANGUAGE_TABLE[lang.name.toLowerCase()] = lang;
}
TEXT_LANGUAGE_TABLE['en-afd'] = {
	code: "en-afd", legacyId: "english", name: "English (AFD)", fullName: "English (AFD)",
};

export class DexText {
	private static rawTextCache: { [lang: string]: RawTextTableData | undefined } = {};
	readonly dex: ModdedDex;

	constructor(dex: ModdedDex) {
		this.dex = dex;
	}

	static loadTextFile(
		name: string, exportName: string, optional = false
	): DexTable<MoveText | ItemText | AbilityText | TranslationString> {
		const filePath = `${TEXT_DIR}/${name}`;
		if (optional) {
			try {
				require.resolve(filePath);
			} catch (e: any) {
				if (e.code === 'MODULE_NOT_FOUND' || e.code === 'ENOENT') return {};
				throw e;
			}
		}
		return require(filePath)[exportName];
	}

	static loadRawTextData(lang: TextLanguage = 'en'): RawTextTableData {
		lang ||= 'en';
		const cached = this.rawTextCache[lang];
		if (cached) return cached;
		const langDir = lang === 'en' ? `` : `${lang}/`;
		const optional = lang !== 'en';
		const otherNameTables = Object.fromEntries(OTHER_NAME_TABLES.map(table => [
			table, this.loadTextFile(`${langDir}names`, table, optional) || {},
		])) as Pick<RawTextTableData, OtherNameTable>;
		const data: RawTextTableData = {
			Pokedex: this.loadTextFile(
				`${langDir}pokedex`, 'PokedexText', optional
			) as DexTable<SpeciesText>,
			Tags: (this.loadTextFile(`${langDir}tags`, 'TagsText', optional) || {}) as DexTable<TagText>,
			...otherNameTables,
			Moves: this.loadTextFile(`${langDir}moves`, 'MovesText', optional) as DexTable<MoveText>,
			Abilities: this.loadTextFile(`${langDir}abilities`, 'AbilitiesText', optional) as DexTable<AbilityText>,
			Items: this.loadTextFile(`${langDir}items`, 'ItemsText', optional) as DexTable<ItemText>,
			Default: this.loadTextFile(`${langDir}default`, 'DefaultText', optional) as DexTable<DefaultText>,
		};
		if (lang !== 'en') this.validateTranslations(data, lang);
		return (this.rawTextCache[lang] = data);
	}

	static resolveTagsTable(
		englishTable: DexTable<TagText>, localizedTable: DexTable<TagText>
	): DexTable<ResolvedTagText> {
		const FIELDS = ['name', 'hint', 'desc'] as const;
		const table: DexTable<ResolvedTagText> = {};
		for (const id in englishTable) {
			const entry: Partial<ResolvedTagText> = {};
			for (const field of FIELDS) {
				const value = localizedTable[id]?.[field] ?? englishTable[id][field];
				if (value) entry[field] = value;
			}
			table[id] = entry as ResolvedTagText;
		}
		return table;
	}

	private static resolveNameTable(
		englishTable: Record<string, TranslationString>, localizedTable: Record<string, TranslationString>
	): Record<string, string> {
		const table: Record<string, string> = {};
		for (const id in englishTable) {
			table[id] = localizedTable[id] ?? englishTable[id]!;
		}
		for (const id in localizedTable) {
			if (!(id in englishTable) && localizedTable[id] !== null) {
				table[id] = localizedTable[id]!;
			}
		}
		return table;
	}

	static resolveOtherNameTables(
		englishData: RawTextTableData, localizedData: RawTextTableData
	): Record<OtherNameTable, DexTable<string>> {
		return Object.fromEntries(OTHER_NAME_TABLES.map(table => [
			table, this.resolveNameTable(englishData[table], localizedData[table]),
		])) as Record<OtherNameTable, DexTable<string>>;
	}

	private static validateTranslations(value: unknown, lang: string, keyPath = ''): void {
		if (value === '') {
			throw new Error(`${lang} translation ${keyPath} must use null to fall back to English`);
		}
		if (!value || typeof value !== 'object') return;
		for (const [key, child] of Object.entries(value)) {
			this.validateTranslations(child, lang, keyPath ? `${keyPath}.${key}` : key);
		}
	}

	static getName(effect: TextEffect, lang: TextLanguage = 'en'): string {
		if (!('effectType' in effect)) {
			return this.tagName(effect.name, lang);
		}
		let table: EffectTextTable | 'Pokedex';
		switch (effect.effectType) {
		case 'Pokemon': table = 'Pokedex'; break;
		case 'Move': table = 'Moves'; break;
		case 'Item': table = 'Items'; break;
		case 'Ability': table = 'Abilities'; break;
		case 'Nature': return this.otherName('NatureNames', effect.name, lang);
		case 'Type': case 'EffectType': return this.otherName('TypeNames', effect.name, lang);
		default: throw new Error(`Unsupported effect type`);
		}
		return (this.loadRawTextData(lang)[table][effect.id]?.name ??
			this.loadRawTextData()[table][effect.id]?.name) || effect.name;
	}

	languages() {
		return TEXT_LANGUAGES;
	}
	findLanguage(lang: string) {
		return TEXT_LANGUAGE_TABLE[lang.toLowerCase()] || TEXT_LANGUAGE_TABLE[toID(lang)] || null;
	}

	get(effect: Item, lang?: TextLanguage): ResolvedItemText;
	get(effect: Ability, lang?: TextLanguage): ResolvedAbilityText;
	get(effect: Move, lang?: TextLanguage): ResolvedMoveText;
	get(effect: Species, lang?: TextLanguage): ResolvedSpeciesText;
	get(effect: Nature | TypeInfo | TagData, lang?: TextLanguage): ResolvedNameText;
	get(effect: TextEffect, lang?: TextLanguage): EffectText;
	get(
		effect: TextEffect, lang: TextLanguage = 'en'
	): EffectText {
		if (!('effectType' in effect)) {
			return { name: this.tagName(effect.name, lang) };
		}
		let table: EffectTextTable;
		switch (effect.effectType) {
		case 'Pokemon': {
			const species = effect;
			return this.dex.loadTextData(lang).Pokedex[effect.id] || {
				name: species.name,
				baseSpecies: species.baseSpecies,
				...(species.forme ? { forme: species.forme } : {}),
			};
		}
		case 'Nature': return { name: this.otherName('NatureNames', effect.name, lang) };
		case 'Type': case 'EffectType': return { name: this.otherName('TypeNames', effect.name, lang) };
		case 'Item': table = 'Items'; break;
		case 'Ability': table = 'Abilities'; break;
		case 'Move': table = 'Moves'; break;
		default: throw new Error(`Unsupported effect type`);
		}

		const entry = this.dex.loadTextData(lang)[table][effect.id];
		const customText = effect as ModdedEffectText;
		if (customText.desc !== undefined || customText.shortDesc !== undefined) {
			const desc = customText.desc || customText.shortDesc || '';
			const shortDesc = customText.shortDesc || customText.desc || '';
			return { ...entry, name: effect.name, desc, shortDesc };
		}

		return entry || {
			name: effect.name,
			desc: '',
			shortDesc: '',
		};
	}

	typeName(name: string, lang: TextLanguage = 'en'): string {
		return this.otherName('TypeNames', name, lang);
	}

	natureName(name: string, lang: TextLanguage = 'en'): string {
		return this.otherName('NatureNames', name, lang);
	}

	categoryName(name: string, lang: TextLanguage = 'en'): string {
		return this.tagName(name, lang);
	}

	tagName(name: string, lang: TextLanguage = 'en'): string {
		return DexText.tagName(name, lang);
	}

	private static tagName(name: string, lang: TextLanguage): string {
		const id = toID(name);
		return (this.loadRawTextData(lang).Tags[id]?.name ?? this.loadRawTextData().Tags[id]?.name) || name;
	}

	genderName(name: string, lang: TextLanguage = 'en'): string {
		return this.otherName('GenderNames', name, lang);
	}

	eggGroupName(name: string, lang: TextLanguage = 'en'): string {
		return this.otherName('EggGroupNames', name, lang);
	}

	colorName(name: string, lang: TextLanguage = 'en'): string {
		return this.otherName('ColorNames', name, lang);
	}

	private otherName(table: OtherNameTable, name: string, lang: TextLanguage): string {
		return DexText.otherName(table, name, lang);
	}

	private static otherName(table: OtherNameTable, name: string, lang: TextLanguage): string {
		let id: string = toID(name);
		if (table === 'GenderNames') {
			id = ({ m: 'male', f: 'female', n: 'genderless' } as Record<string, string>)[id] || id;
		}
		return (this.loadRawTextData(lang)[table][id] ?? this.loadRawTextData()[table][id]) || name;
	}
}

export type TranslationCatalog = Record<string, string | null | Record<string, string | null>>;

const catalogs = new Map<string, TranslationCatalog>();
const TLs = new Map<string, Translator>();

function inLanguage(source: string, language: string, context = ''): string {
	const translation = catalogs.get(language)?.[source];
	return (typeof translation === 'string' ? translation : translation?.[context]) ?? source;
}

function createTL(language: string) {
	function translate(strings: TemplateStringsArray, ...values: unknown[]): string;
	function translate(text: string | TextEffect, context?: string): string;
	function translate(strings: TemplateStringsArray | string | TextEffect, ...values: unknown[]): string {
		if (typeof strings !== 'string' && !Array.isArray(strings)) {
			return DexText.getName(strings as TextEffect, language as TextLanguage);
		}

		let source: string;
		let context = '';
		if (typeof strings === 'string') {
			source = strings;
			if (values.length) context = values[0] as string;
			values = [];
		} else {
			const parts = strings as TemplateStringsArray;
			source = parts[0];
			for (let i = 1; i < parts.length; i++) {
				source += `{${i - 1}}${parts[i]}`;
			}
		}

		const translated = inLanguage(source, language, context);
		return translated.replace(/\{(\d+)\}/g, (placeholder, indexText) => {
			const index = Number(indexText);
			return index < values.length ? String(values[index]) : placeholder;
		});
	}

	const english = DexText.loadRawTextData();
	const localized = DexText.loadRawTextData(language as TextLanguage);
	const text = DexText.resolveOtherNameTables(english, localized);
	const tags = DexText.resolveTagsTable(english.Tags, localized.Tags);
	const TL = Object.assign(translate, {
		/** `TL.label("Ability", "Intimidate")` === `"Ability: Intimidate"` */
		label(label: string, value?: unknown) {
			const labelText = TL`${label}: `;
			return value === undefined ? labelText : labelText + String(value as any);
		},
		orList(items: readonly string[]) {
			if (items.length <= 1) return items.join();
			if (items.length === 2) {
				return TL`${items[0]} or ${items[1]}`;
			}
			let list = items[0];
			for (const item of items.slice(1, -1)) list += TL`, ${item}`;
			const last = items[items.length - 1];
			return list + TL`, or ${last}`;
		},
		andList(items: readonly string[]) {
			if (items.length <= 1) return items.join();
			if (items.length === 2) {
				return TL`${items[0]} and ${items[1]}`;
			}
			let list = items[0];
			for (const item of items.slice(1, -1)) list += TL`, ${item}`;
			const last = items[items.length - 1];
			return list + TL`, and ${last}`;
		},
		/** Asian translations use "person" counters, so don't use this for non-people */
		cappedUserList(items: readonly string[], cap: number) {
			if (items.length > cap + 1) {
				let list = items[0];
				for (const item of items.slice(1, cap)) list += TL`, ${item}`;
				const others = items.length - cap;
				return list + TL`, and ${others} others`;
			}
			return TL.andList(items);
		},
		type: text.TypeNames,
		nature: text.NatureNames,
		gender: text.GenderNames,
		egggroup: text.EggGroupNames,
		tag: tagField(tags, 'name'),
		tagHint: tagField(tags, 'hint'),
		color: text.ColorNames,
		status: text.StatusNames,
		target: text.TargetNames,
		stat: text.StatNames,
		statShort: text.StatShortNames,
		statMedium: text.StatMediumNames,
		ui: {
			...english.Default.ui,
			...localized.Default.ui,
		} as Record<string, string>,
	});
	return TL;
}

function tagField(tags: DexTable<ResolvedTagText>, field: 'name' | 'hint' | 'desc') {
	const table: Record<string, string> = {};
	for (const id in tags) {
		const value = tags[id][field];
		if (value) table[id] = value;
	}
	return table;
}

export type Translator = ReturnType<typeof createTL>;

export function TLfor(language: string): Translator {
	let translator = TLs.get(language);
	if (!translator) {
		translator = createTL(language);
		TLs.set(language, translator);
	}
	return translator;
}

/**
 * Marks a string as a translation key without translating it, for strings
 * defined where no language is known yet (like a module-level table) and
 * translated later with `TL(key)`. The build scans these like TL calls.
 * Keys can't contain `${}` substitutions, since `TL(key)` never substitutes.
 */
export function TLkey(strings: TemplateStringsArray): string {
	return strings[0];
}

/** Merge catalogs into a language's shared translations. Null resets an entry to English fallback. */
export function TLadd(language: string, additions: readonly TranslationCatalog[]) {
	const merged: TranslationCatalog = catalogs.get(language) || Object.create(null);
	for (const catalog of additions) {
		for (const [key, value] of Object.entries(catalog)) {
			const placeholders: string[] = [];
			const source = key.replace(/\{([^{}]+)\}/g, (placeholder, name) => {
				placeholders.push(name);
				return `{${placeholders.length - 1}}`;
			});
			const resolvePlaceholders = (text: string) => text.replace(/\{([^{}]+)\}/g, (placeholder, name) => {
				const index = placeholders.indexOf(name);
				return index < 0 ? placeholder : `{${index}}`;
			});
			if (value === null) {
				merged[source] = null;
			} else if (typeof value === 'string') {
				merged[source] = resolvePlaceholders(value);
			} else {
				const previous = merged[source];
				merged[source] = {
					...(typeof previous === 'object' && previous ? previous : {}),
					...Object.fromEntries(Object.entries(value)
						.map(([context, text]) => [context, text === null ? null : resolvePlaceholders(text)])),
				};
			}
		}
	}
	catalogs.set(language, merged);
}
