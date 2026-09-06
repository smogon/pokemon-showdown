/**
 * Dex Text
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */
import {
	toID, type EffectText, type ModdedEffectText, type OtherNameTable, type TextEffect, type TextLanguage,
} from './dex-data';
import { Dex } from './dex';
import type { TagData } from '../data/tags';

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
	readonly dex: ModdedDex;

	constructor(dex: ModdedDex) {
		this.dex = dex;
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

	termName(name: string, lang: TextLanguage = 'en'): string {
		return this.otherName('TermNames', name, lang);
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
		return this.dex.loadTextData(lang).Tags[toID(name)]?.name || name;
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
		let id: string = toID(name);
		if (table === 'GenderNames') {
			id = ({ m: 'male', f: 'female', n: 'genderless' } as Record<string, string>)[id] || id;
		}
		return this.dex.loadTextData(lang)[table][id] || name;
	}
}

export type TranslationCatalog = Record<string, string | null | Record<string, string | null>>;

const catalogs = new Map<string, TranslationCatalog>();
const TLs = new Map<string, Translator>();

function inLanguage(source: string, language: string, context = 'default'): string {
	const translation = catalogs.get(language)?.[source];
	return (typeof translation === 'string' ? translation : translation?.[context]) ?? source;
}

function createTL(language: string) {
	function translate(strings: TemplateStringsArray, ...values: unknown[]): string;
	function translate(text: string | TextEffect, context?: string): string;
	function translate(strings: TemplateStringsArray | string | TextEffect, ...values: unknown[]): string {
		if (typeof strings !== 'string' && !Array.isArray(strings)) {
			const effect = strings as TextEffect;
			if ('effectType' in effect) {
				switch (effect.effectType) {
				case 'Move': return text.Moves[effect.id]?.name || effect.name;
				case 'Item': return text.Items[effect.id]?.name || effect.name;
				case 'Ability': return text.Abilities[effect.id]?.name || effect.name;
				}
			}
			return Dex.text.get(effect, language as TextLanguage).name;
		}

		let source: string;
		let context = 'default';
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

	const text = Dex.loadTextData(language as TextLanguage);
	const TL = Object.assign(translate, {
		/** `TL.label("Ability", "Intimidate")` === `"Ability: Intimidate"` */
		label(label: string, value?: unknown) {
			const labelText = (TL.term.label || '{LABEL}: ').replace('{LABEL}', label);
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
		term: text.TermNames,
		type: text.TypeNames,
		nature: text.NatureNames,
		gender: text.GenderNames,
		egggroup: text.EggGroupNames,
		tag: tagField(text.Tags, 'name'),
		tagHint: tagField(text.Tags, 'hint'),
		color: text.ColorNames,
		status: text.StatusNames,
		target: text.TargetNames,
		stat: text.StatNames,
		statShort: text.StatShortNames,
		statMedium: text.StatMediumNames,
		ui: { ...Dex.loadTextData('en').Default.ui, ...text.Default.ui } as Record<string, string>,
	});
	return TL;
}

function tagField(tags: ReturnType<ModdedDex['loadTextData']>['Tags'], field: 'name' | 'hint' | 'desc') {
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
 * translated later with `TL(key)`. The build scans these like `TL` calls.
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
