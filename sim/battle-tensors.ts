import { deepFreeze } from '../lib/utils';
import type { Battle } from './battle';
import { toID } from './dex';
import type { EffectState, Pokemon } from './pokemon';
import type { ChoiceRequest, MoveRequest, MoveRequestData, Side } from './side';

const BOOST_IDS: BoostID[] = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion'];
const PSEUDOWEATHER_IDS = ['trickroom', 'gravity', 'magicroom', 'wonderroom'] as const;
const SIDE_CONDITION_IDS = [
	'stealthrock', 'spikes', 'toxicspikes', 'stickyweb',
	'reflect', 'lightscreen', 'auroraveil', 'tailwind',
	'safeguard', 'mist', 'luckychant',
] as const;

const NONE_TOKEN = 0;
const UNKNOWN_TOKEN = 1;

type VisibilityMode = 'player' | 'omniscient';
type TensorData = Float32Array | Int32Array | Uint8Array;
type TensorDtype = 'float32' | 'int32' | 'uint8';
type VocabularyName = keyof Gen9RandomBattleTensorManifest['vocabularies'];

export interface Gen9RandomBattleTensorManifest {
	schemaVersion: string;
	supportedFormatIds: readonly string[];
	reservedTokens: { readonly none: number, readonly unknown: number };
	normalization: {
		readonly maxTurns: number,
		readonly maxDuration: number,
		readonly maxSideConditionLayers: number,
		readonly maxTeamSize: number,
		readonly maxMoveSlots: number,
	};
	vocabularies: {
		readonly species: readonly string[],
		readonly moves: readonly string[],
		readonly items: readonly string[],
		readonly abilities: readonly string[],
		readonly types: readonly string[],
		readonly weather: readonly string[],
		readonly terrain: readonly string[],
		readonly statuses: readonly string[],
		readonly requestStates: readonly string[],
	};
	fields: {
		readonly continuous: readonly string[],
		readonly categorical: readonly string[],
		readonly binary: readonly string[],
	};
	actions: readonly string[];
	schemaHash: string;
}

export interface EncodedTensor<T extends TensorData> {
	data: T;
	shape: readonly [number];
	labels: readonly string[];
	dtype: TensorDtype;
}

export interface EncodedBattleState {
	schemaVersion: string;
	schemaHash: string;
	visibility: VisibilityMode;
	formatid: ID;
	side: SideID;
	continuous: EncodedTensor<Float32Array>;
	categorical: EncodedTensor<Int32Array>;
	binary: EncodedTensor<Uint8Array>;
	actionMask: EncodedTensor<Uint8Array>;
}

export const GEN9_RANDOM_BATTLE_TENSOR_MANIFEST = deepFreeze(
	require('../data/random-battles/gen9/tensor-manifest.json') as Gen9RandomBattleTensorManifest
);
export const GEN9_RANDOM_BATTLE_ACTION_LABELS = GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.actions;
export const GEN9_SINGLES_ACTION_LABELS = GEN9_RANDOM_BATTLE_ACTION_LABELS;

interface ParsedCondition {
	hp: number;
	status: ID;
	fainted: boolean;
}

interface ParsedPublicDetails {
	species: ID;
	level: number;
	terastallized: string;
	condition: ParsedCondition;
}

class FeatureBuilder {
	readonly labels: string[] = [];
	readonly values: number[] = [];

	push(label: string, value: number) {
		this.labels.push(label);
		this.values.push(Number.isFinite(value) ? value : 0);
	}
}

const vocabularyMaps = createVocabularyMaps();

export function encodeBattleState(battle: Battle, side: Side | SideID): EncodedBattleState {
	return encodePlayerBattleState(battle, side);
}

export function encodePlayerBattleState(battle: Battle, side: Side | SideID): EncodedBattleState {
	const observer = resolveSide(battle, side);
	return encodeState(battle, observer, 'player');
}

export function encodeOmniscientBattleState(battle: Battle, side: Side | SideID = 'p1'): EncodedBattleState {
	const observer = resolveSide(battle, side);
	return encodeState(battle, observer, 'omniscient');
}

export function decodeGen9RandomBattleAction(battle: Battle, side: Side | SideID, actionIndex: number): string {
	assertSupportedBattle(battle);
	const observer = resolveSide(battle, side);
	const mask = buildActionMask(observer);
	if (!Number.isInteger(actionIndex) || actionIndex < 0 || actionIndex >= mask.data.length) {
		throw new Error(`Invalid Gen 9 Random Battle action index: ${actionIndex}`);
	}
	if (!mask.data[actionIndex]) {
		throw new Error(`Illegal Gen 9 Random Battle action: ${GEN9_RANDOM_BATTLE_ACTION_LABELS[actionIndex]}`);
	}

	const maxMoveSlots = GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.normalization.maxMoveSlots;
	if (actionIndex < maxMoveSlots * 2) {
		const request = asMoveRequest(observer.activeRequest);
		const active = observer.active[0];
		if (!request || !active) throw new Error(`Move action requested without an active move request`);
		const moveSlot = actionIndex % maxMoveSlots;
		const move = buildMoveActionMap(active, request.active[0])[moveSlot];
		if (!move) throw new Error(`Move action has no request move`);
		return `move ${move.id}${actionIndex >= maxMoveSlots ? ' terastallize' : ''}`;
	}
	return `switch ${actionIndex - (maxMoveSlots * 2) + 1}`;
}

function encodeState(battle: Battle, observer: Side, visibility: VisibilityMode): EncodedBattleState {
	assertSupportedBattle(battle);
	const continuous = new FeatureBuilder();
	const categorical = new FeatureBuilder();
	const binary = new FeatureBuilder();
	const request = observer.activeRequest;

	pushGlobalFeatures(continuous, categorical, binary, battle, observer);
	pushSideFeatures(continuous, categorical, binary, 'you', observer, request, true);
	pushSideFeatures(
		continuous, categorical, binary, 'foe', observer.foe, null, visibility === 'omniscient'
	);

	return {
		schemaVersion: GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.schemaVersion,
		schemaHash: GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.schemaHash,
		visibility,
		formatid: battle.format.id,
		side: observer.id,
		continuous: toFloatTensor(continuous, GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.fields.continuous),
		categorical: toIntTensor(categorical, GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.fields.categorical),
		binary: toByteTensor(binary, GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.fields.binary),
		actionMask: buildActionMask(observer),
	};
}

function assertSupportedBattle(battle: Battle) {
	if (!GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.supportedFormatIds.includes(battle.format.id)) {
		throw new Error(`Battle tensor encoder does not support format ${battle.format.id}`);
	}
	if (battle.gen !== 9 || battle.activePerHalf !== 1 || battle.sides.length !== 2) {
		throw new Error(`Battle tensor encoder only supports Gen 9 Random Battle singles`);
	}
}

function resolveSide(battle: Battle, side: Side | SideID): Side {
	const resolved = typeof side === 'string' ? battle.getSide(side) : side;
	if (resolved.battle !== battle) throw new Error(`Observer side does not belong to the supplied battle`);
	return resolved;
}

function createVocabularyMaps() {
	const maps = {} as Record<VocabularyName, Map<string, number>>;
	for (const name of Object.keys(GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.vocabularies) as VocabularyName[]) {
		maps[name] = new Map(
			GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.vocabularies[name].map((id, index) => [id, index])
		);
	}
	return maps;
}

function token(vocabulary: VocabularyName, value: string | ID | undefined, unknown = false) {
	if (unknown) return UNKNOWN_TOKEN;
	if (!value) return NONE_TOKEN;
	return vocabularyMaps[vocabulary].get(toID(value)) ?? UNKNOWN_TOKEN;
}

function pushGlobalFeatures(
	continuous: FeatureBuilder,
	categorical: FeatureBuilder,
	binary: FeatureBuilder,
	battle: Battle,
	observer: Side,
) {
	const normalization = GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.normalization;
	continuous.push('battle.turn', clamp01(battle.turn / normalization.maxTurns));
	continuous.push('battle.weatherDuration', normalizeDuration(battle.field.weatherState.duration));
	continuous.push('battle.terrainDuration', normalizeDuration(battle.field.terrainState.duration));
	continuous.push('you.pokemonLeft', observer.pokemonLeft / normalization.maxTeamSize);
	continuous.push('you.totalFainted', observer.totalFainted / normalization.maxTeamSize);
	continuous.push('foe.pokemonLeft', observer.foe.pokemonLeft / normalization.maxTeamSize);
	continuous.push('foe.totalFainted', observer.foe.totalFainted / normalization.maxTeamSize);
	continuous.push('foe.revealedCount', countRevealedOpponentSlots(observer.foe) / normalization.maxTeamSize);

	categorical.push('battle.weather', token('weather', battle.field.weather));
	categorical.push('battle.terrain', token('terrain', battle.field.terrain));
	categorical.push('battle.request', token('requestStates', getRequestStateName(observer.activeRequest)));

	binary.push('battle.ended', battle.ended ? 1 : 0);
	for (const pseudoWeather of PSEUDOWEATHER_IDS) {
		binary.push(`battle.pseudoWeather.${pseudoWeather}`, battle.field.pseudoWeather[pseudoWeather] ? 1 : 0);
	}
	binary.push('you.teraUsed', sideHasTerastallized(observer) ? 1 : 0);
	binary.push('foe.teraUsed', sideHasTerastallized(observer.foe) ? 1 : 0);

	const activeRequest = asMoveRequest(observer.activeRequest)?.active[0];
	binary.push('you.canTerastallize', activeRequest?.canTerastallize ? 1 : 0);
	binary.push('you.trapped', activeRequest?.trapped ? 1 : 0);
	binary.push('you.maybeTrapped', activeRequest?.maybeTrapped ? 1 : 0);
	binary.push('you.maybeDisabled', activeRequest?.maybeDisabled ? 1 : 0);
	binary.push('you.maybeLocked', activeRequest?.maybeLocked ? 1 : 0);
	binary.push('you.noCancel', observer.activeRequest?.noCancel ? 1 : 0);
}

function pushSideFeatures(
	continuous: FeatureBuilder,
	categorical: FeatureBuilder,
	binary: FeatureBuilder,
	prefix: 'you' | 'foe',
	side: Side,
	request: ChoiceRequest | null,
	privateView: boolean,
) {
	for (const sideCondition of SIDE_CONDITION_IDS) {
		continuous.push(
			`${prefix}.sideCondition.${sideCondition}`,
			normalizeSideCondition(side.sideConditions[sideCondition])
		);
	}

	const maxTeamSize = GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.normalization.maxTeamSize;
	for (let i = 0; i < maxTeamSize; i++) {
		const pokemon = side.pokemon[i];
		const pokemonRequest = privateView && pokemon?.isActive ?
			asMoveRequest(request)?.active[pokemon.position] || null : null;
		pushPokemonFeatures(
			continuous, categorical, binary, `${prefix}.slot${i + 1}`, pokemon, pokemonRequest, privateView
		);
	}
}

function pushPokemonFeatures(
	continuous: FeatureBuilder,
	categorical: FeatureBuilder,
	binary: FeatureBuilder,
	prefix: string,
	pokemon: Pokemon | undefined,
	request: MoveRequest['active'][number] | null,
	privateView: boolean,
) {
	if (!pokemon) {
		pushEmptyPokemonFeatures(continuous, categorical, binary, prefix);
	} else if (privateView) {
		pushPrivatePokemonFeatures(continuous, categorical, binary, prefix, pokemon, request);
	} else {
		pushPublicPokemonFeatures(continuous, categorical, binary, prefix, pokemon);
	}
}

function pushPrivatePokemonFeatures(
	continuous: FeatureBuilder,
	categorical: FeatureBuilder,
	binary: FeatureBuilder,
	prefix: string,
	pokemon: Pokemon,
	request: MoveRequest['active'][number] | null,
) {
	const types = pokemon.getTypes();
	continuous.push(`${prefix}.hp`, pokemon.maxhp ? pokemon.hp / pokemon.maxhp : 0);
	continuous.push(`${prefix}.level`, clamp01(pokemon.level / 100));
	for (const boost of BOOST_IDS) continuous.push(`${prefix}.boost.${boost}`, pokemon.boosts[boost] / 6);

	categorical.push(`${prefix}.species`, token('species', pokemon.species.id));
	categorical.push(`${prefix}.ability`, token('abilities', pokemon.ability || pokemon.baseAbility));
	categorical.push(`${prefix}.item`, token('items', pokemon.item));
	categorical.push(`${prefix}.teraType`, token('types', pokemon.teraType));
	categorical.push(`${prefix}.terastallized`, token('types', pokemon.terastallized || ''));
	categorical.push(`${prefix}.type1`, token('types', types[0]));
	categorical.push(`${prefix}.type2`, token('types', types[1]));
	categorical.push(`${prefix}.status`, token('statuses', pokemon.fainted ? 'fnt' : pokemon.status));

	pushPokemonKnowledge(binary, prefix, {
		active: pokemon.isActive, revealed: true, fainted: pokemon.fainted,
		hp: true, level: true, species: true, ability: true, item: true, teraType: true, type: true, status: true,
	});
	pushPrivateMoveFeatures(continuous, categorical, binary, prefix, pokemon, request);
}

function pushPublicPokemonFeatures(
	continuous: FeatureBuilder,
	categorical: FeatureBuilder,
	binary: FeatureBuilder,
	prefix: string,
	pokemon: Pokemon,
) {
	const isVisible = pokemon.isActive;
	const fainted = pokemon.fainted;
	const detailsKnown = isVisible || fainted;
	const parsed = isVisible ? parsePublicDetails(pokemon) : null;
	const species = parsed?.species || (fainted ? pokemon.species.id : '');
	const level = parsed?.level || (fainted ? pokemon.level : 0);
	const apparentTypes = isVisible ? pokemon.apparentType.split('/') : (fainted ? pokemon.species.types : []);
	const status = parsed?.condition.status || (fainted ? toID('fnt') : '');
	const teraKnown = !!parsed?.terastallized;

	continuous.push(`${prefix}.hp`, parsed?.condition.hp || 0);
	continuous.push(`${prefix}.level`, clamp01(level / 100));
	for (const boost of BOOST_IDS) {
		continuous.push(`${prefix}.boost.${boost}`, isVisible ? pokemon.boosts[boost] / 6 : 0);
	}

	categorical.push(`${prefix}.species`, token('species', species, !detailsKnown));
	categorical.push(`${prefix}.ability`, token('abilities', undefined, true));
	categorical.push(`${prefix}.item`, token('items', undefined, true));
	categorical.push(`${prefix}.teraType`, token('types', parsed?.terastallized, !teraKnown));
	categorical.push(`${prefix}.terastallized`, token('types', parsed?.terastallized, !detailsKnown));
	categorical.push(`${prefix}.type1`, token('types', apparentTypes[0], !detailsKnown));
	categorical.push(`${prefix}.type2`, token('types', apparentTypes[1], !detailsKnown));
	categorical.push(`${prefix}.status`, token('statuses', status, !detailsKnown));

	pushPokemonKnowledge(binary, prefix, {
		active: isVisible,
		revealed: isVisible || pokemon.previouslySwitchedIn > 0 || fainted,
		fainted,
		hp: detailsKnown,
		level: detailsKnown,
		species: detailsKnown,
		ability: false,
		item: false,
		teraType: teraKnown,
		type: detailsKnown,
		status: detailsKnown,
	});
	pushUnknownMoveFeatures(continuous, categorical, binary, prefix);
}

interface PokemonKnowledge {
	active: boolean;
	revealed: boolean;
	fainted: boolean;
	hp: boolean;
	level: boolean;
	species: boolean;
	ability: boolean;
	item: boolean;
	teraType: boolean;
	type: boolean;
	status: boolean;
}

function pushPokemonKnowledge(binary: FeatureBuilder, prefix: string, known: PokemonKnowledge) {
	binary.push(`${prefix}.present`, 1);
	binary.push(`${prefix}.active`, known.active ? 1 : 0);
	binary.push(`${prefix}.revealed`, known.revealed ? 1 : 0);
	binary.push(`${prefix}.fainted`, known.fainted ? 1 : 0);
	for (const field of ['hp', 'level', 'species', 'ability', 'item', 'teraType', 'type', 'status'] as const) {
		binary.push(`${prefix}.${field}Known`, known[field] ? 1 : 0);
	}
}

function pushPrivateMoveFeatures(
	continuous: FeatureBuilder,
	categorical: FeatureBuilder,
	binary: FeatureBuilder,
	prefix: string,
	pokemon: Pokemon,
	request: MoveRequest['active'][number] | null,
) {
	const maxMoveSlots = GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.normalization.maxMoveSlots;
	const requestMoves = request?.moves || [];
	for (let i = 0; i < maxMoveSlots; i++) {
		const slot = pokemon.moveSlots[i];
		continuous.push(`${prefix}.move${i + 1}.pp`, slot?.maxpp ? slot.pp / slot.maxpp : 0);
	}
	for (let i = 0; i < maxMoveSlots; i++) {
		categorical.push(`${prefix}.move${i + 1}.id`, token('moves', pokemon.moveSlots[i]?.id));
	}
	for (let i = 0; i < maxMoveSlots; i++) {
		const slot = pokemon.moveSlots[i];
		const requestMove = slot ? findRequestMove(requestMoves, slot.id) : null;
		const disabled = slot ? (requestMove ? !!requestMove.disabled : isDisabledMoveSlot(slot)) : false;
		binary.push(`${prefix}.move${i + 1}.present`, slot ? 1 : 0);
		binary.push(`${prefix}.move${i + 1}.revealed`, slot ? 1 : 0);
		binary.push(`${prefix}.move${i + 1}.disabled`, disabled ? 1 : 0);
	}
}

function pushUnknownMoveFeatures(
	continuous: FeatureBuilder,
	categorical: FeatureBuilder,
	binary: FeatureBuilder,
	prefix: string,
) {
	const maxMoveSlots = GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.normalization.maxMoveSlots;
	for (let i = 1; i <= maxMoveSlots; i++) continuous.push(`${prefix}.move${i}.pp`, 0);
	for (let i = 1; i <= maxMoveSlots; i++) {
		categorical.push(`${prefix}.move${i}.id`, token('moves', undefined, true));
	}
	for (let i = 1; i <= maxMoveSlots; i++) {
		binary.push(`${prefix}.move${i}.present`, 1);
		binary.push(`${prefix}.move${i}.revealed`, 0);
		binary.push(`${prefix}.move${i}.disabled`, 0);
	}
}

function pushEmptyPokemonFeatures(
	continuous: FeatureBuilder,
	categorical: FeatureBuilder,
	binary: FeatureBuilder,
	prefix: string,
) {
	continuous.push(`${prefix}.hp`, 0);
	continuous.push(`${prefix}.level`, 0);
	for (const boost of BOOST_IDS) continuous.push(`${prefix}.boost.${boost}`, 0);

	for (const field of ['species', 'ability', 'item', 'teraType', 'terastallized', 'type1', 'type2', 'status']) {
		categorical.push(`${prefix}.${field}`, NONE_TOKEN);
	}
	for (const field of [
		'present', 'active', 'revealed', 'fainted', 'hpKnown', 'levelKnown', 'speciesKnown',
		'abilityKnown', 'itemKnown', 'teraTypeKnown', 'typeKnown', 'statusKnown',
	]) {
		binary.push(`${prefix}.${field}`, 0);
	}

	const maxMoveSlots = GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.normalization.maxMoveSlots;
	for (let i = 1; i <= maxMoveSlots; i++) continuous.push(`${prefix}.move${i}.pp`, 0);
	for (let i = 1; i <= maxMoveSlots; i++) categorical.push(`${prefix}.move${i}.id`, NONE_TOKEN);
	for (let i = 1; i <= maxMoveSlots; i++) {
		binary.push(`${prefix}.move${i}.present`, 0);
		binary.push(`${prefix}.move${i}.revealed`, 0);
		binary.push(`${prefix}.move${i}.disabled`, 0);
	}
}

function buildActionMask(side: Side): EncodedTensor<Uint8Array> {
	const labels = GEN9_RANDOM_BATTLE_ACTION_LABELS;
	const data = new Uint8Array(labels.length);
	const request = side.activeRequest;
	const maxMoveSlots = GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.normalization.maxMoveSlots;
	if (!request) return { data, shape: [data.length], labels, dtype: 'uint8' };

	if ('active' in request && request.active) {
		const active = side.active[0];
		const activeRequest = request.active[0];
		if (active && activeRequest) {
			const actionMoves = buildMoveActionMap(active, activeRequest);
			for (let i = 0; i < maxMoveSlots; i++) {
				const move = actionMoves[i];
				if (!move || move.disabled) continue;
				data[i] = 1;
				if (activeRequest.canTerastallize) data[maxMoveSlots + i] = 1;
			}
			if (!activeRequest.trapped) pushSwitchMask(data, request, maxMoveSlots * 2);
		}
	} else if ('forceSwitch' in request && request.forceSwitch) {
		pushSwitchMask(data, request, maxMoveSlots * 2);
	}
	return { data, shape: [data.length], labels, dtype: 'uint8' };
}

function buildMoveActionMap(pokemon: Pokemon, request: MoveRequest['active'][number]) {
	const maxMoveSlots = GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.normalization.maxMoveSlots;
	const result: (MoveRequestData | null)[] = Array(maxMoveSlots).fill(null);
	for (let i = 0; i < Math.min(pokemon.moveSlots.length, maxMoveSlots); i++) {
		result[i] = findRequestMove(request.moves, pokemon.moveSlots[i].id);
	}
	if (!result.some(move => move) && request.moves.length === 1) result[0] = request.moves[0];
	return result;
}

function pushSwitchMask(data: Uint8Array, request: ChoiceRequest, offset: number) {
	const maxTeamSize = GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.normalization.maxTeamSize;
	for (let i = 0; i < Math.min(request.side.pokemon.length, maxTeamSize); i++) {
		const pokemon = request.side.pokemon[i];
		if (!pokemon.active && !pokemon.condition.includes('fnt')) data[offset + i] = 1;
	}
}

function getRequestStateName(request: ChoiceRequest | null) {
	if (!request) return '';
	if (request.wait) return 'wait';
	if ('teamPreview' in request && request.teamPreview) {
		throw new Error(`Gen 9 Random Battle tensor schema does not support Team Preview`);
	}
	if ('forceSwitch' in request && request.forceSwitch) return 'switch';
	if ('active' in request && request.active) return 'move';
	return '';
}

function asMoveRequest(request: ChoiceRequest | null): MoveRequest | null {
	if (request && 'active' in request && request.active) return request;
	return null;
}

function findRequestMove(moves: readonly MoveRequestData[], moveId: ID) {
	return moves.find(move => move.id === moveId) || null;
}

function isDisabledMoveSlot(moveSlot: Pokemon['moveSlots'][number]) {
	return moveSlot.pp <= 0 || !!moveSlot.disabled;
}

function normalizeDuration(duration?: number) {
	if (!duration) return 0;
	return clamp01(duration / GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.normalization.maxDuration);
}

function normalizeSideCondition(state?: EffectState) {
	if (!state) return 0;
	const layers = typeof state.layers === 'number' ? state.layers : 1;
	return clamp01(layers / GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.normalization.maxSideConditionLayers);
}

function sideHasTerastallized(side: Side) {
	return side.pokemon.some(pokemon => !!pokemon.terastallized);
}

function countRevealedOpponentSlots(side: Side) {
	return side.pokemon.filter(
		pokemon => pokemon.isActive || pokemon.previouslySwitchedIn > 0 || pokemon.fainted
	).length;
}

function parsePublicDetails(pokemon: Pokemon): ParsedPublicDetails {
	const [details, condition] = pokemon.getFullDetails().shared.split('|');
	const parts = details.split(',').map(part => part.trim());
	const species = pokemon.battle.dex.species.get(parts[0]).id;
	let level = 100;
	let terastallized = '';
	for (const part of parts.slice(1)) {
		if (part.startsWith('L')) {
			const parsedLevel = Number(part.slice(1));
			if (!Number.isNaN(parsedLevel)) level = parsedLevel;
		}
		if (part.startsWith('tera:')) terastallized = part.slice(5);
	}
	return { species, level, terastallized, condition: parseCondition(condition) };
}

function parseCondition(condition: string): ParsedCondition {
	const parts = condition.trim().split(/\s+/);
	if (!parts.length || parts[0] === '0' || parts[0] === '0/0' || parts.includes('fnt')) {
		const fainted = parts.includes('fnt');
		return { hp: 0, status: fainted ? toID('fnt') : toID(''), fainted };
	}
	const match = /^(\d+)\/(\d+)/.exec(parts[0]);
	const hp = match ? Number(match[1]) / Number(match[2]) : 0;
	const status = parts[1] && parts[1] !== 'fnt' ? toID(parts[1]) : toID('');
	return { hp, status, fainted: false };
}

function toFloatTensor(builder: FeatureBuilder, expectedLabels: readonly string[]): EncodedTensor<Float32Array> {
	assertLabels(builder.labels, expectedLabels);
	return {
		data: Float32Array.from(builder.values), shape: [builder.values.length],
		labels: expectedLabels, dtype: 'float32',
	};
}

function toIntTensor(builder: FeatureBuilder, expectedLabels: readonly string[]): EncodedTensor<Int32Array> {
	assertLabels(builder.labels, expectedLabels);
	return {
		data: Int32Array.from(builder.values), shape: [builder.values.length],
		labels: expectedLabels, dtype: 'int32',
	};
}

function toByteTensor(builder: FeatureBuilder, expectedLabels: readonly string[]): EncodedTensor<Uint8Array> {
	assertLabels(builder.labels, expectedLabels);
	return {
		data: Uint8Array.from(builder.values), shape: [builder.values.length],
		labels: expectedLabels, dtype: 'uint8',
	};
}

function assertLabels(actual: readonly string[], expected: readonly string[]) {
	if (actual.length !== expected.length) {
		throw new Error(`Tensor schema mismatch: expected ${expected.length} fields, received ${actual.length}`);
	}
	for (let i = 0; i < expected.length; i++) {
		if (actual[i] !== expected[i]) {
			throw new Error(`Tensor schema mismatch at field ${i}: expected ${expected[i]}, received ${actual[i]}`);
		}
	}
}

function clamp01(value: number) {
	if (!Number.isFinite(value)) return 0;
	if (value <= 0) return 0;
	if (value >= 1) return 1;
	return value;
}
