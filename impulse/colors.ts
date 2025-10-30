/*
* Pokemon Showdown
* Colors Utility Functions
*/
import * as crypto from 'crypto';
import { FS } from '../lib/fs';

/**
 * Represents an RGB color structure.
 */
interface RGB {
	R: number;
	G: number;
	B: number;
}

/**
 * Maps user IDs to their custom hex color strings.
 */
interface CustomColors {
	[userid: string]: string;
}

/**
 * Document format for storing custom colors in the database file.
 */
interface ColorDocument {
	userid: string;
	color: string;
}

let customColors: CustomColors = {};
const colorCache: Record<string, string> = {};

/**
 * The file path for storing custom color data.
 */
const CUSTOM_COLORS_FILE = 'impulse/db/customcolors.json';

/**
 * Loads custom colors from the database file into memory.
 */
export const loadCustomColorsFromDB = async (): Promise<void> => {
	try {
		const data = await FS(CUSTOM_COLORS_FILE).readIfExists();
		let parsed: CustomColors | ColorDocument[] = {};
		if (data) parsed = JSON.parse(data);
		customColors = {};
		if (Array.isArray(parsed)) {
			parsed.forEach(doc => {
				if (doc.userid && doc.color) {
					customColors[doc.userid] = doc.color;
				}
			});
		} else {
			Object.assign(customColors, parsed);
		}
	} catch (e) {
		console.error('Error loading colors:', e);
		customColors = {};
	}
};

/**
 * Saves the current custom colors map to the database file.
 */
export const saveCustomColorsToDB = async (): Promise<void> => {
	try {
		await FS(CUSTOM_COLORS_FILE).safeWrite(JSON.stringify(customColors, null, 2));
	} catch (e) {
		console.error('Error saving colors:', e);
	}
};

loadCustomColorsFromDB().catch(err => console.error('Failed to init colors:', err));

/**
 * Retrieves the in-memory map of custom colors.
 * @returns The CustomColors map.
 */
export const getCustomColors = (): CustomColors => customColors;

/**
 * Sets the in-memory map of custom colors and saves them to the database.
 * @param colors The new map of custom colors.
 */
export const setCustomColors = (colors: CustomColors): void => {
	customColors = colors;
	void saveCustomColorsToDB();
};

/**
 * Reloads custom colors from the database and clears the color cache.
 */
export const reloadCustomColors = async (): Promise<void> => {
	await loadCustomColorsFromDB();
	clearColorCache();
};

/**
 * Converts HSL color values to RGB color values.
 * @param H Hue (0-360).
 * @param S Saturation (0-100).
 * @param L Lightness (0-100).
 * @returns The RGB color object with R, G, B components normalized to 0-1.
 */
const HSLToRGB = (H: number, S: number, L: number): RGB => {
	const C = (100 - Math.abs(2 * L - 100)) * S / 100 / 100;
	const X = C * (1 - Math.abs((H / 60) % 2 - 1));
	const m = L / 100 - C / 2;
	let R1 = 0, G1 = 0, B1 = 0;

	const hCase = Math.floor(H / 60);
	if (hCase === 0) { R1 = C; G1 = X; } else if (hCase === 1) { R1 = X; G1 = C; } else if (hCase === 2) { G1 = C; B1 = X; } else if (hCase === 3) { G1 = X; B1 = C; } else if (hCase === 4) { R1 = X; B1 = C; } else if (hCase === 5) { R1 = C; B1 = X; }

	return { R: R1 + m, G: G1 + m, B: B1 + m };
};

/**
 * Calculates a unique, accessible color for a given name using an MD5 hash.
 * Prioritizes custom colors and cache lookup.
 * @param name The name to generate a color for.
 * @returns The hex color string (e.g., '#AABBCC').
 */
const hashColor = (name: string): string => {
	const id = toID(name);

	if (customColors[id]) return customColors[id];
	if (colorCache[id]) return colorCache[id];

	const hash = crypto.createHash('md5').update(id).digest('hex');
	const H = parseInt(hash.substr(4, 4), 16) % 360;
	const S = (parseInt(hash.substr(0, 4), 16) % 50) + 40;
	let L = Math.floor(parseInt(hash.substr(8, 4), 16) % 20 + 30);

	const { R, G, B } = HSLToRGB(H, S, L);

	const lum = R * R * R * 0.2126 + G * G * G * 0.7152 + B * B * B * 0.0722;
	let HLmod = (lum - 0.2) * -150;
	if (HLmod > 18) HLmod = (HLmod - 18) * 2.5;
	else if (HLmod < 0) HLmod /= 3;

	const Hdist = Math.min(Math.abs(180 - H), Math.abs(240 - H));
	if (Hdist < 15) HLmod += (15 - Hdist) / 3;

	L += HLmod;

	const { R: r, G: g, B: b } = HSLToRGB(H, S, L);

	const toHex = (x: number): string => {
		const hex = Math.round(x * 255).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};

	const color = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	colorCache[id] = color;
	return color;
};

/**
 * Checks if a string is a valid CSS hex color code (3 or 6 digits, prefixed with #).
 * @param color The hex color string to validate.
 * @returns True if the color is a valid hex code, false otherwise.
 */
export const validateHexColor = (color: string): boolean =>
	/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color);

/**
 * Clears the in-memory color cache.
 */
export const clearColorCache = (): void => {
	Object.keys(colorCache).forEach(key => delete colorCache[key]);
};

/**
 * Formats a name with its unique color wrapped in HTML for display.
 * @param name The user's name or a plain string.
 * @param bold If true, wrap the name in bold tags. Defaults to true.
 * @param userGroup If true, prepends the user's global authority group symbol. Defaults to false.
 * @param room The room context (optional, currently unused in implementation).
 * @returns The HTML string for the colored name.
 */
export const nameColor = (
	name: string,
	bold = true,
	userGroup = false,
	room: Room | null = null
): string => {
	const userId = toID(name);
	const symbol = userGroup && Users.globalAuth.get(userId) ?
		`<font color=#948A88>${Users.globalAuth.get(userId)}</font>` :
		'';
	const userName = Chat.escapeHTML(Users.getExact(name)?.name || name);
	return symbol + (bold ? '<b>' : '') + `<font color=${hashColor(name)}>${userName}</font>` + (bold ? '</b>' : '');
};
