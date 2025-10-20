/*
* Pokemon Showdown
* Color Module
*/
import * as crypto from 'crypto';
import { ImpulseDB } from '../impulse-db';

interface RGB { R: number; G: number; B: number; }
interface CustomColors { [userid: string]: string; }

let customColors: CustomColors = {};
const colorCache: Record<string, string> = {};

export const loadCustomColorsFromDB = async () => {
	try {
		const colorDocs = await ImpulseDB('customcolors').find({});
		customColors = {};
		colorDocs.forEach(doc => {
			customColors[doc.userid] = doc.color;
		});
	} catch (e) {
		console.error('Error loading colors:', e);
	}
};

loadCustomColorsFromDB().catch(err => console.error('Failed to init colors:', err));

export const getCustomColors = (): CustomColors => customColors;
export const setCustomColors = (colors: CustomColors) => { customColors = colors; };
export const reloadCustomColors = async () => {
	await loadCustomColorsFromDB();
	clearColorCache();
};

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
	let H = parseInt(hash.substr(4, 4), 16) % 360;
	const S = (parseInt(hash.substr(0, 4), 16) % 50) + 40;
	let L = Math.floor(parseInt(hash.substr(8, 4), 16) % 20 + 30);

	let { R, G, B } = HSLToRGB(H, S, L);

	const lum = R * R * R * 0.2126 + G * G * G * 0.7152 + B * B * B * 0.0722;
	let HLmod = (lum - 0.2) * -150;
	if (HLmod > 18) HLmod = (HLmod - 18) * 2.5;
	else if (HLmod < 0) HLmod /= 3;

	const Hdist = Math.min(Math.abs(180 - H), Math.abs(240 - H));
	if (Hdist < 15) HLmod += (15 - Hdist) / 3;

	L += HLmod;

	let { R: r, G: g, B: b } = HSLToRGB(H, S, L);

	const toHex = (x: number) => {
		const hex = Math.round(x * 255).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};

	const color = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	colorCache[id] = color;
	return color;
};

Impulse.hashColor = hashColor;

export const validateHexColor = (color: string): boolean => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color);

export const clearColorCache = () => {
	Object.keys(colorCache).forEach(key => delete colorCache[key]);
};

const nameColor = (name: string, bold = false, userGroup = false, room: Room | null = null): string => {
	const userId = toID(name);
	const symbol = userGroup && Users.globalAuth.get(userId) ? `<font color=#948A88>${Users.globalAuth.get(userId)}</font>` : '';
	const userName = Chat.escapeHTML(Users.getExact(name)?.name || name);
	return symbol + (bold ? '<b>' : '') + `<font color=${hashColor(name)}>${userName}</font>` + (bold ? '</b>' : '');
};

Impulse.nameColor = nameColor;
