/*
 * Pokemon Showdown - Impulse Server
 * Control Panel Plugin
 * @author PrinceSky-Git
 *
 * Pages:
 * view-controlpanel — main dashboard (Handles all sub-views dynamically)
 */

import { FS } from '../../../lib';
import { toID } from '../../../sim/dex';
import { Table } from '../../utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const ICONS_DATA_FILE = 'impulse/db/custom-icons.json';
const COLORS_DATA_FILE = 'impulse/db/custom-colors.json';
const SYMBOL_COLORS_DATA_FILE = 'impulse/db/custom-symbol-colors.json';
const SYMBOLS_DATA_FILE = 'impulse/db/custom-symbol.json';

const DEFAULT_ICON_SIZE = 24;

// ─── State Management ─────────────────────────────────────────────────────────

const panelViews = new Map<string, string>();

function refreshControlPanel(user: User): void {
	for (const conn of user.connections) {
		if (conn.openPages?.has('controlpanel')) {
			Chat.parse('/join view-controlpanel', null, user, conn);
		}
	}
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface IconEntry { url: string; size: number; setBy: string; createdAt: number; updatedAt: number; }
interface IconData { [userid: string]: IconEntry; }

interface CustomColorsData { [userid: string]: string; }

interface SymbolColorEntry { color: string; setBy: string; createdAt: number; updatedAt: number; }
interface SymbolColorData { [userid: string]: SymbolColorEntry; }

interface CustomSymbolEntry { symbol: string; setBy: string; createdAt: number; updatedAt: number; }
interface CustomSymbolData { [userid: string]: CustomSymbolEntry; }

// ─── Shared Data Loaders & Helpers ────────────────────────────────────────────

async function loadJSON<T>(filePath: string): Promise<T> {
	try {
		const raw = await FS(filePath).readIfExists();
		if (raw) return JSON.parse(raw) as T;
	} catch (e) {
		console.error(`[ControlPanel] Failed to read ${filePath}:`, e);
	}
	return {} as T;
}

function formatDate(timestamp: number): string {
	return new Date(timestamp).toLocaleDateString('en-GB', {
		day: '2-digit', month: 'short', year: 'numeric',
	});
}

function renderColorSwatch(color: string): string {
	return `<span style="display:inline-block;width:12px;height:12px;background-color:${color};border:1px solid #000;vertical-align:middle;margin-right:6px;"></span><code>${color}</code>`;
}

function createHeader(title: string): string {
	return (
		'<div style="' +
			'display: flex; align-items: center;' +
			'border-bottom: 1px solid #ccc; padding-bottom: 8px; margin-bottom: 14px;' +
		'">' +
			'<strong style="font-size: 1.2em;">Control Panel — ' + title + '</strong>' +
			// Added margin-left: auto; here to ensure it pushes to the far right
			'<button class="button" name="send" value="/controlpanel view home" style="margin-left: auto;">← Back to Control Panel</button>' +
		'</div>'
	);
}

// ─── View Renderers ───────────────────────────────────────────────────────────

function renderHome(user: User): string {
	const cards = [
		{
			label: 'Custom Avatars', view: 'avatars',
			desc: 'Manage custom trainer sprites/avatars uploaded for users. (<code>/ca set</code>)',
		},
		{
			label: 'Custom Colors', view: 'colors',
			desc: 'Manage custom chat name colors. (<code>/cc set</code>)',
		},
		{
			label: 'Custom Symbols', view: 'symbols',
			desc: 'Manage custom auth symbols replacing the default ones. (<code>/cs set</code>)',
		},
		{
			label: 'Symbol Colors', view: 'symbolcolors',
			desc: 'Manage colors for user auth symbols. (<code>/sc set</code>)',
		},
		{
			label: 'User Icons', view: 'icons',
			desc: 'Manage custom userlist icons assigned to players. (<code>/icon set</code>)',
		},
	];

	cards.sort((a, b) => a.label.localeCompare(b.label));

	const cardHtml = cards.map(c =>
		'<div style="' +
			'background: rgba(216, 238, 245, 0.6); border: 1px solid #ccc; border-radius: 8px; padding: 12px 16px; margin-bottom: 10px;' +
			'display: flex; align-items: center; gap: 14px;' +
		'">' +
			'<div style="flex: 1; color: black;">' +
				'<strong>' + c.label + '</strong>' +
				'<div style="font-size: 0.9em; color: black;">' + c.desc + '</div>' +
			'</div>' +
			'<button class="button" name="send" value="/controlpanel view ' + c.view + '" style="margin-left: auto;">Open →</button>' +
		'</div>'
	).join('');

	return (
		'<div class="pad">' +
			'<div style="border-bottom: 1px solid #ccc; padding-bottom: 8px; margin-bottom: 14px;">' +
				'<strong style="font-size: 1.2em;">Control Panel</strong>' +
			'</div>' +
			'<p style="color: #555; margin-bottom: 14px;">Welcome, ' + Impulse.nameColor(user.name, true, false) + '. Select a section to manage.</p>' +
			cardHtml +
		'</div>'
	);
}

async function renderIcons(user: User): Promise<string> {
	const data = await loadJSON<IconData>(ICONS_DATA_FILE);
	const entries = Object.entries(data);
	const header = createHeader('User Icons');

	if (!entries.length) return `<div class="pad">${header}<p>No icons set.</p></div>`;

	const rows = entries.map(([userid, entry]) => [
		Impulse.nameColor(userid, true, false),
		`<img src="${entry.url}" width="32" height="32" style="object-fit: contain;" />`,
		entry.size !== DEFAULT_ICON_SIZE ? `${entry.size}px` : `${DEFAULT_ICON_SIZE}px (default)`,
		Impulse.nameColor(entry.setBy, true, false),
		formatDate(entry.createdAt),
		`<button class="button" name="send" value="/controlpanel deleteicon ${userid}" style="color:#c00;border-color:#c00;">🗑 Delete</button>`,
	]);

	return `<div class="pad">${header}${Table('User Icons', ['User', 'Icon', 'Size', 'Set By', 'Added', 'Action'], rows)}</div>`;
}

async function renderColors(user: User): Promise<string> {
	const data = await loadJSON<CustomColorsData>(COLORS_DATA_FILE);
	const entries = Object.entries(data);
	const header = createHeader('Custom Colors');

	if (!entries.length) return `<div class="pad">${header}<p>No custom colors set.</p></div>`;

	const rows = entries.map(([userid, color]) => [
		Impulse.nameColor(userid, true, false),
		renderColorSwatch(color),
		`<button class="button" name="send" value="/controlpanel deletecolor ${userid}" style="color:#c00;border-color:#c00;">Delete</button>`,
	]);

	return `<div class="pad">${header}${Table('Custom Colors', ['User', 'Hex Color', 'Action'], rows)}</div>`;
}

async function renderSymbolColors(user: User): Promise<string> {
	const data = await loadJSON<SymbolColorData>(SYMBOL_COLORS_DATA_FILE);
	const entries = Object.entries(data);
	const header = createHeader('Symbol Colors');

	if (!entries.length) return `<div class="pad">${header}<p>No symbol colors set.</p></div>`;

	const rows = entries.map(([userid, entry]) => [
		Impulse.nameColor(userid, true, false),
		renderColorSwatch(entry.color),
		Impulse.nameColor(entry.setBy, true, false),
		formatDate(entry.createdAt),
		`<button class="button" name="send" value="/controlpanel deletesymbolcolor ${userid}" style="color:#c00;border-color:#c00;">Delete</button>`,
	]);

	return `<div class="pad">${header}${Table('Symbol Colors', ['User', 'Hex Color', 'Set By', 'Added', 'Action'], rows)}</div>`;
}

async function renderSymbols(user: User): Promise<string> {
	const data = await loadJSON<CustomSymbolData>(SYMBOLS_DATA_FILE);
	const entries = Object.entries(data);
	const header = createHeader('Custom Symbols');

	if (!entries.length) return `<div class="pad">${header}<p>No custom symbols set.</p></div>`;

	const rows = entries.map(([userid, entry]) => [
		Impulse.nameColor(userid, true, false),
		`<strong style="font-size:1.2em;">${entry.symbol}</strong>`,
		Impulse.nameColor(entry.setBy, true, false),
		formatDate(entry.createdAt),
		`<button class="button" name="send" value="/controlpanel deletesymbol ${userid}" style="color:#c00;border-color:#c00;">Delete</button>`,
	]);

	return `<div class="pad">${header}${Table('Custom Symbols', ['User', 'Symbol', 'Set By', 'Added', 'Action'], rows)}</div>`;
}

function renderAvatars(user: User): string {
	const header = createHeader('Custom Avatars');
	
	const allAvatars = Users.Avatars?.avatars || {};
	
	const entries = Object.entries(allAvatars).filter(([userid, data]) => {
		const filename = (data as any).allowed?.[0];
		return filename && !filename.startsWith('#') && !/^\d+$/.test(filename);
	});

	if (!entries.length) return `<div class="pad">${header}<p>No custom avatars set.</p></div>`;

	let rawBaseUrl = Config.avatarUrl || 'impulse-ps.mooo.com/avatars/';
	const baseUrl = rawBaseUrl.startsWith('http') || rawBaseUrl.startsWith('//') ? rawBaseUrl : `//${rawBaseUrl}`;
	const cacheBuster = Date.now();

	const rows = entries.map(([userid, data]) => {
		const filename = (data as any).allowed[0];
		const imgUrl = `${baseUrl}${filename}?v=${cacheBuster}`;
		
		return [
			Impulse.nameColor(userid, true, false),
			`<img src="${imgUrl}" width="80" height="80" style="object-fit: contain; background: rgba(0,0,0,0.1); border-radius: 4px;" />`,
			`<code>${filename}</code>`,
			`<button class="button" name="send" value="/controlpanel deleteavatar ${userid}" style="color:#c00;border-color:#c00;">Delete</button>`,
		];
	});

	return `<div class="pad">${header}${Table('Custom Avatars', ['User', 'Avatar Image', 'Filename', 'Action'], rows)}</div>`;
}

// ─── Page Registrations ───────────────────────────────────────────────────────

export const pages: Chat.PageTable = {
	async controlpanel(query, user, connection) {
		this.checkCan('roomowner');
		const view = panelViews.get(user.id) || 'home';

		switch (view) {
			case 'icons':
				this.title = 'Control Panel — Icons';
				return await renderIcons(user);
			case 'colors':
				this.title = 'Control Panel — Colors';
				return await renderColors(user);
			case 'symbolcolors':
				this.title = 'Control Panel — Symbol Colors';
				return await renderSymbolColors(user);
			case 'symbols':
				this.title = 'Control Panel — Symbols';
				return await renderSymbols(user);
			case 'avatars':
				this.title = 'Control Panel — Avatars';
				return renderAvatars(user);
			default:
				this.title = 'Control Panel';
				return renderHome(user);
		}
	},
};

// ─── Commands ─────────────────────────────────────────────────────────────────

export const commands: Chat.ChatCommands = {
	controlpanel: {
		''(target, room, user) {
			this.checkCan('roomowner');
			panelViews.set(user.id, 'home');
			return this.parse('/join view-controlpanel');
		},

		view(target, room, user) {
			this.checkCan('roomowner');
			const view = toID(target) || 'home';
			panelViews.set(user.id, view);
			refreshControlPanel(user);
		},

		deleteicon(target, room, user) {
			this.checkCan('roomowner');
			const targetId = toID(target);
			if (!targetId) return;
			this.parse(`/icon delete ${targetId}`);
			setTimeout(() => refreshControlPanel(user), 100);
		},

		deletecolor(target, room, user) {
			this.checkCan('roomowner');
			const targetId = toID(target);
			if (!targetId) return;
			this.parse(`/cc delete ${targetId}`);
			setTimeout(() => refreshControlPanel(user), 100);
		},

		deletesymbolcolor(target, room, user) {
			this.checkCan('roomowner');
			const targetId = toID(target);
			if (!targetId) return;
			this.parse(`/sc delete ${targetId}`);
			setTimeout(() => refreshControlPanel(user), 100);
		},

		deletesymbol(target, room, user) {
			this.checkCan('roomowner');
			const targetId = toID(target);
			if (!targetId) return;
			this.parse(`/cs delete ${targetId}`);
			setTimeout(() => refreshControlPanel(user), 100);
		},

		deleteavatar(target, room, user) {
			this.checkCan('roomowner');
			const targetId = toID(target);
			if (!targetId) return;
			this.parse(`/ca delete ${targetId}`);
			setTimeout(() => refreshControlPanel(user), 100);
		},

		help: [
			'<strong>Control Panel commands</strong>',
			'/controlpanel — Open the staff control panel.',
			'Aliases: /cp, /panel',
		],
	},

	cp: 'controlpanel',
	panel: 'controlpanel',
	cphelp: 'controlpanel help',
};
