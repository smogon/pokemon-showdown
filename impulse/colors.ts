/*
* Pokemon Showdown
* Colors Utility Functions
*/
import * as crypto from 'crypto';
import { FS, Utils } from '../lib';

interface RGB { R: number; G: number; B: number }
interface CustomColors { [userid: string]: string }

const DATA_FILE = 'impulse/db/custom-colors.json';

let customColors: CustomColors = {};
const colorCache: Record<string, string> = {};

const loadData = async (): Promise<void> => {
	try {
		const raw = await FS(DATA_FILE).readIfExists();
		if (raw) {
			customColors = JSON.parse(raw);
		}
	} catch (e) {
		console.error('Error loading colors:', e);
		customColors = {};
	}
};

void loadData();

const saveData = (): void => {
	FS(DATA_FILE).writeUpdate(() => JSON.stringify(customColors));
};

export const addCustomColor = (userid: string, color: string): void => {
	customColors[userid] = color;
	colorCache[userid] = color;
	saveData();
};

export const removeCustomColor = (userid: string): void => {
	delete customColors[userid];
	delete colorCache[userid];
	saveData();
};

export const getCustomColors = (): CustomColors => customColors;

export const reloadCustomColors = async (): Promise<void> => {
	await loadData();
	clearColorCache();
};

export const clearColorCache = (): void => {
	for (const key in colorCache) delete colorCache[key];
};

export const validateHexColor = (color: string): boolean =>
	/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color);

const HSLToRGB = (H: number, S: number, L: number): RGB => {
	const C = (100 - Math.abs(2 * L - 100)) * S / 100 / 100;
	const X = C * (1 - Math.abs((H / 60) % 2 - 1));
	const m = L / 100 - C / 2;
	let R1 = 0, G1 = 0, B1 = 0;

	const hCase = Math.floor(H / 60);
	if (hCase === 0) { R1 = C; G1 = X; }
	else if (hCase === 1) { R1 = X; G1 = C; }
	else if (hCase === 2) { G1 = C; B1 = X; }
	else if (hCase === 3) { G1 = X; B1 = C; }
	else if (hCase === 4) { R1 = X; B1 = C; }
	else if (hCase === 5) { R1 = C; B1 = X; }

	return { R: R1 + m, G: G1 + m, B: B1 + m };
};

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

export const nameColor = (
	name: string,
	bold = true,
	userGroup = false
): string => {
	const userId = toID(name);
	const symbol = userGroup && Users.globalAuth.get(userId) ?
		`<font color=#948A88>${Users.globalAuth.get(userId)}</font>` :
		'';
	const userName = Utils.escapeHTML(Users.getExact(name)?.name || name);
	return symbol + (bold ? '<b>' : '') + `<font color=${hashColor(name)}>${userName}</font>` + (bold ? '</b>' : '');
};
