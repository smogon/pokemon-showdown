/**
 * Manual state edits at an analysis node (docs/analysis/plan.md D3/D5): the field layer, plus the entry
 * point that runs every layer in order (Pokémon state lives in analysis-pokemon-edits.ts).
 *
 * Edits write sim state directly instead of calling event-firing APIs (setWeather, addSideCondition, ...),
 * so they never consume RNG or trigger abilities. They then emit `[silent]` protocol lines for what changed,
 * so the client renderer shows the new state, plus one visible `-message` summarizing the edits. That message
 * carries `[analysisdurations]` with the exact turns remaining, because the protocol can't set them and the
 * client would otherwise show its estimates (analysis-battle.ts applies them).
 */
import type { Battle } from '../sim/battle';
import { toID } from '../sim/dex';
import { AnalysisPokemonEditor, clamp } from './analysis-pokemon-edits';
import { AnalysisTeamEditor } from './analysis-team-edits';
import {
	ANALYSIS_RAW_LINE, type AnalysisConditionEdit, type AnalysisEditLine, type AnalysisEditSummary,
	type AnalysisEdits, type AnalysisFieldStateEdit, type AnalysisSideEditsID, type AnalysisSideStateEdit,
	type AnalysisWeatherEdit,
} from './analysis-state';

export type AnalysisFieldEffectKind = 'weather' | 'terrain' | 'pseudoWeather' | 'sideCondition';

/** A field effect the edit form can set in this format. */
export interface AnalysisFieldEffectOption {
	id: string;
	kind: AnalysisFieldEffectKind;
	/** name used in edit summaries, e.g. "Electric Terrain" */
	name: string;
	/** button label; options that share a `group` form one segmented row */
	label: string;
	group: string;
	/**
	 * Visible options with the same `row` share a line in the form as joined buttons, each with its turns input
	 * below (a row with one visible option keeps the input beside it). Options without one get their own line.
	 */
	row?: string;
	/** shown without "Show more" */
	common: boolean;
	/** turns remaining when newly set (the condition's standard duration); absent if it doesn't expire */
	duration?: number;
	/** Spikes and Toxic Spikes */
	maxLayers?: number;
}

/** The edits a node actually made (entries that changed nothing are left out), and their summary. */
export interface AnalysisAppliedEdits {
	edits: AnalysisEdits;
	summary: AnalysisEditSummary;
}

/** `label` defaults to `name`, `group` to `id` */
type FieldEffectDefinition = Omit<AnalysisFieldEffectOption, 'duration' | 'group' | 'label'> & {
	group?: string, label?: string,
};

/**
 * Effects offered by the form, in display order. Left out on purpose: primal weathers (they come from an
 * active Pokémon's ability), effects that only last the turn they're used (Crafty Shield, Mat Block, Quick
 * Guard, Wide Guard, Ion Deluge), and slot conditions (Wish, Future Sight, ...).
 */
const FIELD_EFFECTS: FieldEffectDefinition[] = [
	{ id: 'sunnyday', kind: 'weather', name: 'Sun', group: 'weather', common: true },
	{ id: 'raindance', kind: 'weather', name: 'Rain', group: 'weather', common: true },
	{ id: 'sandstorm', kind: 'weather', name: 'Sandstorm', label: 'Sand', group: 'weather', common: true },
	{ id: 'snowscape', kind: 'weather', name: 'Snow', group: 'weather', common: true },
	{ id: 'hail', kind: 'weather', name: 'Hail', group: 'weather', common: true },
	{
		id: 'electricterrain', kind: 'terrain', name: 'Electric Terrain', label: 'Electric', group: 'terrain', common: true,
	},
	{ id: 'grassyterrain', kind: 'terrain', name: 'Grassy Terrain', label: 'Grassy', group: 'terrain', common: true },
	{ id: 'mistyterrain', kind: 'terrain', name: 'Misty Terrain', label: 'Misty', group: 'terrain', common: true },
	{
		id: 'psychicterrain', kind: 'terrain', name: 'Psychic Terrain', label: 'Psychic Terrain', group: 'terrain', common: true,
	},
	{ id: 'trickroom', kind: 'pseudoWeather', name: 'Trick Room', row: 'rooms', common: true },
	{ id: 'magicroom', kind: 'pseudoWeather', name: 'Magic Room', row: 'rooms', common: false },
	{ id: 'wonderroom', kind: 'pseudoWeather', name: 'Wonder Room', row: 'rooms', common: false },
	{ id: 'gravity', kind: 'pseudoWeather', name: 'Gravity', row: 'rooms', common: false },
	{ id: 'mudsport', kind: 'pseudoWeather', name: 'Mud Sport', row: 'rooms', common: false },
	{ id: 'watersport', kind: 'pseudoWeather', name: 'Water Sport', row: 'rooms', common: false },
	{ id: 'fairylock', kind: 'pseudoWeather', name: 'Fairy Lock', row: 'rooms', common: false },
	{ id: 'reflect', kind: 'sideCondition', name: 'Reflect', row: 'screens', common: true },
	{ id: 'lightscreen', kind: 'sideCondition', name: 'Light Screen', row: 'screens', common: true },
	{ id: 'auroraveil', kind: 'sideCondition', name: 'Aurora Veil', row: 'screens', common: true },
	{ id: 'tailwind', kind: 'sideCondition', name: 'Tailwind', common: true },
	{ id: 'stealthrock', kind: 'sideCondition', name: 'Stealth Rock', row: 'hazards', common: true },
	{ id: 'stickyweb', kind: 'sideCondition', name: 'Sticky Web', row: 'hazards', common: true },
	{
		id: 'gmaxsteelsurge', kind: 'sideCondition', name: 'G-Max Steelsurge', label: 'Steelsurge', row: 'hazards', common: false,
	},
	{ id: 'spikes', kind: 'sideCondition', name: 'Spikes', common: true, maxLayers: 3 },
	{ id: 'toxicspikes', kind: 'sideCondition', name: 'Toxic Spikes', common: true, maxLayers: 2 },
	{ id: 'safeguard', kind: 'sideCondition', name: 'Safeguard', row: 'protection', common: false },
	{ id: 'mist', kind: 'sideCondition', name: 'Mist', row: 'protection', common: false },
	{ id: 'luckychant', kind: 'sideCondition', name: 'Lucky Chant', row: 'protection', common: false },
	{ id: 'firepledge', kind: 'sideCondition', name: 'Sea of Fire', row: 'pledges', common: false },
	{ id: 'grasspledge', kind: 'sideCondition', name: 'Swamp', row: 'pledges', common: false },
	{ id: 'waterpledge', kind: 'sideCondition', name: 'Rainbow', row: 'pledges', common: false },
	{ id: 'gmaxvinelash', kind: 'sideCondition', name: 'G-Max Vine Lash', label: 'Vine Lash', row: 'gmax', common: false },
	{ id: 'gmaxwildfire', kind: 'sideCondition', name: 'G-Max Wildfire', label: 'Wildfire', row: 'gmax', common: false },
	{ id: 'gmaxcannonade', kind: 'sideCondition', name: 'G-Max Cannonade', label: 'Cannonade', row: 'gmax', common: false },
	{ id: 'gmaxvolcalith', kind: 'sideCondition', name: 'G-Max Volcalith', label: 'Volcalith', row: 'gmax', common: false },
];

const PRIMAL_WEATHERS = ['desolateland', 'primordialsea', 'deltastream'];
const MAX_DURATION = 99;
/** the sim caps `side.totalFainted` at 100 itself, so match that rather than the roster size */
const MAX_TOTAL_FAINTED = 100;

/**
 * The field effects that exist in this battle's generation and mod: the condition exists, the move that
 * creates it isn't a past or future move, and (for plain moves) the move really sets that field effect
 * (e.g. Mud Sport is a volatile in Gen 5).
 */
export function getFieldEffectOptions(battle: Battle): AnalysisFieldEffectOption[] {
	const { dex } = battle;
	const options: AnalysisFieldEffectOption[] = [];
	for (const definition of FIELD_EFFECTS) {
		const condition = dex.conditions.get(definition.id);
		const move = dex.moves.get(definition.id);
		if (!condition.exists || !move.exists || ['Past', 'Future'].includes(move.isNonstandard as string)) continue;
		const createdEffect = move.weather || move.terrain || move.pseudoWeather || move.sideCondition;
		if (createdEffect ? toID(createdEffect) !== definition.id : move.volatileStatus === definition.id) continue;
		const duration = condition.duration || (condition.durationCallback ? 5 : undefined);
		options.push({
			...definition, label: definition.label || definition.name, group: definition.group || definition.id, duration,
		});
	}
	return options;
}

/** `3 Turns`, or `On` for effects that don't expire */
function turns(duration: number | undefined) {
	return duration ? `${duration} Turn${duration === 1 ? '' : 's'}` : 'On';
}

function layerCount(layers: number) {
	return `${layers} Layer${layers === 1 ? '' : 's'}`;
}

class FieldEditor {
	battle: Battle;
	options: Map<string, AnalysisFieldEffectOption>;
	applied: AnalysisFieldStateEdit = {};
	summary: AnalysisEditSummary = { field: [], p1: [], p2: [] };
	lines: AnalysisEditLine[] = [];
	/** `weather:3`, `trickroom:2` (pseudo-weather or terrain id), `p1:reflect:5` */
	durations: string[] = [];
	droppedEdits: string[] = [];

	constructor(battle: Battle) {
		this.battle = battle;
		this.options = new Map(getFieldEffectOptions(battle).map(option => [option.id, option]));
	}

	option(id: string | undefined, kind: AnalysisFieldEffectKind) {
		const option = this.options.get(toID(id));
		return option?.kind === kind ? option : null;
	}

	/** The edit's turns remaining, or the standard duration if it's missing or invalid. */
	duration(edit: AnalysisConditionEdit, option: AnalysisFieldEffectOption) {
		if (!option.duration) return undefined;
		const value = Math.trunc(Number(edit.duration));
		return value >= 1 && value <= MAX_DURATION ? value : option.duration;
	}

	layers(edit: AnalysisConditionEdit, option: AnalysisFieldEffectOption) {
		if (!option.maxLayers) return undefined;
		const value = Math.trunc(Number(edit.layers));
		return value >= 1 ? Math.min(value, option.maxLayers) : option.maxLayers;
	}

	conditionName(id: string) {
		return this.battle.dex.conditions.get(id).name;
	}

	applyWeather(edit: AnalysisWeatherEdit | null) {
		const { field } = this.battle;
		if (PRIMAL_WEATHERS.includes(field.weather)) {
			this.droppedEdits.push(`weather: ${this.conditionName(field.weather)} comes from an ability`);
			return;
		}
		if (!edit) {
			if (!field.weather) return;
			field.weather = '';
			field.weatherState = this.battle.initEffectState({ id: '' });
			this.lines.push(['-weather', 'none', '[silent]']);
			this.applied.weather = null;
			this.summary.field.push('Weather (Off)');
			return;
		}
		const option = this.option(edit.id, 'weather');
		if (!option) {
			this.droppedEdits.push(`weather: ${edit.id} isn't available`);
			return;
		}
		const duration = this.duration(edit, option);
		if (field.weather === option.id && field.weatherState.duration === duration) return;
		if (field.weather === option.id) {
			field.weatherState.duration = duration;
		} else {
			field.weather = option.id as ID;
			field.weatherState = this.battle.initEffectState({ id: option.id, duration });
			this.lines.push(['-weather', this.conditionName(option.id), '[silent]']);
		}
		this.applied.weather = { id: option.id, duration };
		if (duration) this.durations.push(`weather:${duration}`);
		this.summary.field.push(`${option.name} (${turns(duration)})`);
	}

	applyTerrain(edit: AnalysisWeatherEdit | null) {
		const { field } = this.battle;
		const previous = field.terrain;
		if (!edit) {
			if (!previous) return;
			field.terrain = '';
			field.terrainState = this.battle.initEffectState({ id: '' });
			this.lines.push(['-fieldend', `move: ${this.conditionName(previous)}`, '[silent]']);
			this.applied.terrain = null;
			this.summary.field.push('Terrain (Off)');
			return;
		}
		const option = this.option(edit.id, 'terrain');
		if (!option) {
			this.droppedEdits.push(`terrain: ${edit.id} isn't available`);
			return;
		}
		const duration = this.duration(edit, option);
		if (previous === option.id && field.terrainState.duration === duration) return;
		if (previous === option.id) {
			field.terrainState.duration = duration;
		} else {
			if (previous) this.lines.push(['-fieldend', `move: ${this.conditionName(previous)}`, '[silent]']);
			field.terrain = option.id as ID;
			field.terrainState = this.battle.initEffectState({ id: option.id, duration });
			this.lines.push(['-fieldstart', `move: ${this.conditionName(option.id)}`, '[silent]']);
		}
		this.applied.terrain = { id: option.id, duration };
		if (duration) this.durations.push(`${option.id}:${duration}`);
		this.summary.field.push(`${option.name} (${turns(duration)})`);
	}

	applyPseudoWeather(id: string, edit: AnalysisConditionEdit | null) {
		const { field } = this.battle;
		const option = this.option(id, 'pseudoWeather');
		if (!option) {
			this.droppedEdits.push(`field: ${id} isn't available`);
			return;
		}
		const state = field.pseudoWeather[option.id];
		if (!edit) {
			if (!state) return;
			delete field.pseudoWeather[option.id];
			this.lines.push(['-fieldend', `move: ${this.conditionName(option.id)}`, '[silent]']);
			(this.applied.pseudoWeather ||= {})[option.id] = null;
			this.summary.field.push(`${option.name} (Off)`);
			return;
		}
		const duration = this.duration(edit, option);
		if (state?.duration === duration) return;
		if (state) {
			state.duration = duration;
		} else {
			field.pseudoWeather[option.id] = this.battle.initEffectState({ id: option.id, duration });
			this.lines.push(['-fieldstart', `move: ${this.conditionName(option.id)}`, '[silent]']);
		}
		(this.applied.pseudoWeather ||= {})[option.id] = { duration };
		if (duration) this.durations.push(`${option.id}:${duration}`);
		this.summary.field.push(`${option.name} (${turns(duration)})`);
	}

	applySideCondition(sideId: 'p1' | 'p2', id: string, edit: AnalysisConditionEdit | null) {
		const side = this.battle.sides[sideId === 'p1' ? 0 : 1];
		const option = this.option(id, 'sideCondition');
		if (!side || !option) {
			this.droppedEdits.push(`${sideId}: ${id} isn't available`);
			return;
		}
		const state = side.sideConditions[option.id];
		const record = (value: AnalysisConditionEdit | null) => {
			((this.applied.sides ||= {})[sideId] ||= {})[option.id] = value;
		};
		const start = ['-sidestart', side.toString(), `move: ${this.conditionName(option.id)}`, '[silent]'];
		const end = ['-sideend', side.toString(), `move: ${this.conditionName(option.id)}`, '[silent]'];
		if (!edit) {
			if (!state) return;
			delete side.sideConditions[option.id];
			this.lines.push(end);
			record(null);
			this.summary[sideId].push(`${option.name} (${option.maxLayers ? layerCount(0) : 'Off'})`);
			return;
		}
		const duration = this.duration(edit, option);
		const layers = this.layers(edit, option);
		if (state && state.duration === duration && state.layers === layers) return;
		if (state) {
			state.duration = duration;
			if (state.layers !== layers) {
				// the client adds a layer per -sidestart, so rebuild the layer count from scratch
				this.lines.push(end);
				for (let layer = 0; layer < (layers || 1); layer++) this.lines.push(start);
			}
			state.layers = layers;
		} else {
			side.sideConditions[option.id] = this.battle.initEffectState({ id: option.id, target: side, duration, layers });
			for (let layer = 0; layer < (layers || 1); layer++) this.lines.push(start);
		}
		record({ duration, layers });
		if (duration) this.durations.push(`${sideId}:${option.id}:${duration}`);
		this.summary[sideId].push(`${option.name} (${layers ? layerCount(layers) : turns(duration)})`);
	}

	apply(edit: AnalysisFieldStateEdit) {
		if (edit.weather !== undefined) this.applyWeather(edit.weather);
		if (edit.terrain !== undefined) this.applyTerrain(edit.terrain);
		for (const [id, conditionEdit] of Object.entries(edit.pseudoWeather || {})) {
			this.applyPseudoWeather(id, conditionEdit);
		}
		for (const sideId of ['p1', 'p2'] as const) {
			for (const [id, conditionEdit] of Object.entries(edit.sides?.[sideId] || {})) {
				this.applySideCondition(sideId, id, conditionEdit);
			}
		}
	}
}

/**
 * Applies a node's manual edits at the start of its turn. Values are absolute; entries that change nothing
 * are left out of the returned `applied` edits, so the client can store exactly what took effect.
 * Layers run in order (plan.md D3): teams and sets first, then the active swaps, then per-Pokémon state,
 * then per-side state, then the field. Active swaps come before state edits, so a Pokémon sent out here can
 * be given boosts in the same save; edits name Pokémon by team slot, so the order is safe either way.
 */
/**
 * Per-side state that isn't a side condition. Only `totalFainted` so far, which Last Respects reads for its
 * base power and Supreme Overlord for its boost — both format-defining, and neither expressible any other
 * way: a reconstructed battle has nobody fainted, so an imported turn-8 position would have Last Respects
 * stuck at 50 BP. The protocol can't say it either, so it rides on the `analysis*` escape hatch that
 * `analysis-battle.ts` reads, the same pattern as `analysiscounter`.
 */
function applySideState(battle: Battle, edits: { [side in AnalysisSideEditsID]?: AnalysisSideStateEdit }) {
	const droppedEdits: string[] = [];
	const summary: { p1: string[], p2: string[] } = { p1: [], p2: [] };
	const lines: AnalysisEditLine[] = [];
	const applied: { [side in AnalysisSideEditsID]?: AnalysisSideStateEdit } = {};

	for (const sideId of ['p1', 'p2'] as const) {
		const edit = edits[sideId];
		if (!edit) continue;
		const side = battle.sides.find(candidate => candidate.id === sideId);
		if (!side) {
			droppedEdits.push(`${sideId}: no such side`);
			continue;
		}
		if (edit.totalFainted === undefined) continue;
		// The sim caps it at 100 itself (`battle.ts` faint handling), so match that rather than the roster.
		const wanted = clamp(edit.totalFainted, 0, MAX_TOTAL_FAINTED, side.totalFainted);
		applied[sideId] = { totalFainted: wanted };
		if (wanted === side.totalFainted) continue;
		side.totalFainted = wanted;
		lines.push(['-message', 'analysisfaintcounter', sideId, `${wanted}`, '[silent]']);
		summary[sideId].push(`Fainted (${wanted})`);
	}
	return { droppedEdits, summary, lines, applied };
}

export function applyAnalysisEdits(battle: Battle, edits: AnalysisEdits | undefined) {
	const droppedEdits: string[] = [];
	if (!edits) return { droppedEdits, applied: null };
	const applied: AnalysisAppliedEdits = { edits: {}, summary: { field: [], p1: [], p2: [] } };
	const lines: AnalysisEditLine[] = [];
	const { summary } = applied;
	/** keywords on the edits message for state the protocol can't express (see analysis-battle.ts) */
	const keywords: string[] = [];

	/** team slots whose Pokémon the team layer replaced, so their state edits no longer mean anything */
	let invalidatedSlots = new Set<string>();
	if (edits.teams) {
		const editor = new AnalysisTeamEditor(battle);
		editor.apply(edits);
		droppedEdits.push(...editor.droppedEdits);
		invalidatedSlots = editor.invalidatedSlots;
		if (editor.changed) {
			Object.assign(applied.edits, editor.applied);
			summary.p1.push(...editor.summary.p1);
			summary.p2.push(...editor.summary.p2);
			lines.push(...editor.lines);
		}
	}

	if (edits.active || edits.pokemon) {
		const editor = new AnalysisPokemonEditor(battle);
		editor.apply(edits, invalidatedSlots);
		droppedEdits.push(...editor.droppedEdits);
		if (editor.changed) {
			// `active` is merged per slot, not overwritten: the team layer records the replacements it
			// had to make when a Pokémon was removed off the field
			const { active, ...rest } = editor.applied;
			Object.assign(applied.edits, rest);
			for (const sideId of ['p1', 'p2'] as const) {
				const slots = active?.[sideId];
				if (!slots) continue;
				const merged = [...(applied.edits.active?.[sideId] || [])];
				for (let slot = 0; slot < slots.length; slot++) {
					if (slots[slot] !== null && slots[slot] !== undefined) merged[slot] = slots[slot];
				}
				(applied.edits.active ||= {})[sideId] = merged;
			}
			summary.p1.push(...editor.summary.p1);
			summary.p2.push(...editor.summary.p2);
			lines.push(...editor.lines);
		}
	}

	// After the Pokémon layer on purpose: fainting and reviving move `totalFainted` themselves, and an
	// imported replay's count is the authority on where it should end up.
	if (edits.sides) {
		const sideState = applySideState(battle, edits.sides);
		droppedEdits.push(...sideState.droppedEdits);
		if (sideState.summary.p1.length || sideState.summary.p2.length) {
			applied.edits.sides = sideState.applied;
			summary.p1.push(...sideState.summary.p1);
			summary.p2.push(...sideState.summary.p2);
			lines.push(...sideState.lines);
		}
	}

	if (edits.field) {
		const editor = new FieldEditor(battle);
		editor.apply(edits.field);
		droppedEdits.push(...editor.droppedEdits);
		const fieldSummary = editor.summary;
		if (fieldSummary.field.length || fieldSummary.p1.length || fieldSummary.p2.length) {
			applied.edits.field = editor.applied;
			summary.field.push(...fieldSummary.field);
			summary.p1.push(...fieldSummary.p1);
			summary.p2.push(...fieldSummary.p2);
			lines.push(...editor.lines);
			if (editor.durations.length) keywords.push(`[analysisdurations] ${editor.durations.join(',')}`);
		}
	}

	if (summary.field.length || summary.p1.length || summary.p2.length) {
		for (const line of lines) {
			// a line the sim already serialized, moved into this channel to keep the order right
			if (line[0] === ANALYSIS_RAW_LINE) battle.log.push(line[1] as string);
			else battle.add(...line);
		}
		const parts = [
			summary.field.join(', '),
			summary.p1.length ? `Team 1: ${summary.p1.join(', ')}` : '',
			summary.p2.length ? `Team 2: ${summary.p2.join(', ')}` : '',
		];
		battle.add('-message', `Analysis edits: ${parts.filter(Boolean).join('; ')}`, ...keywords);
	}
	return { droppedEdits, applied };
}
