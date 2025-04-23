/**
 * Simulator State
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Helper functions for serializing Battle instances to JSON and back.
 *
 * (You might also consider using input logs instead.)
 *
 * @license MIT
 */

import { Battle } from './battle';
import { Dex } from './dex';
import { Field } from './field';
import { Pokemon } from './pokemon';
import { PRNG } from './prng';
import { type Choice, Side } from './side';

// The simulator supports up to 24 different Pokemon on a team. Serialization
// uses letters instead of numbers to indicate indices/positions, but where
// the simulator only gives a position to active Pokemon, serialization
// uses letters for every Pokemon on a team. Active pokemon will still
// have the same letter as their position would indicate, but non-active
// team members are filled in with subsequent letters.
const POSITIONS = 'abcdefghijklmnopqrstuvwx';

// Several types we serialize as 'references' in the form '[Type]' because
// they are either circular or they are (or at least, should be) immutable
// and thus can simply be reconsituted as needed.
// NOTE: Species is not strictly immutable as some OM formats rely on an
// onModifySpecies event - deserialization is not possible for such formats.
type Referable = Battle | Field | Side | Pokemon | Condition | Ability | Item | Move | Species;

// Certain fields are either redundant (transient caches, constants, duplicate
// information) or require special treatment. These sets contain the specific
// keys which we skip during default (de)serialization and (the keys which)
// need special treatment from these sets are then handled manually.

const BATTLE = new Set([
	'dex', 'gen', 'ruleTable', 'id', 'log', 'inherit', 'format', 'teamGenerator',
	'HIT_SUBSTITUTE', 'NOT_FAIL', 'FAIL', 'SILENT_FAIL', 'field', 'sides', 'prng', 'hints',
	'deserialized', 'queue', 'actions',
]);
const FIELD = new Set(['id', 'battle']);
const SIDE = new Set(['battle', 'team', 'pokemon', 'choice', 'activeRequest']);
const POKEMON = new Set([
	'side', 'battle', 'set', 'name', 'fullname', 'id',
	'happiness', 'level', 'pokeball', 'baseMoveSlots',
]);
const CHOICE = new Set(['switchIns']);
const ACTIVE_MOVE = new Set(['move']);

export const State = new class {
	// REFERABLE is used to determine which objects are of the Referable type by
	// comparing their constructors. Unfortunately, we need to set this dynamically
	// due to circular module dependencies on Battle and Field instead
	// of simply initializing it as a const. See isReferable for where this
	// gets lazily created on demand.
	REFERABLE?: Set<Function>;

	serializeBattle(battle: Battle): /* Battle */ AnyObject {
		const state: /* Battle */ AnyObject = this.serialize(battle, BATTLE, battle);
		state.field = this.serializeField(battle.field);
		state.sides = new Array(battle.sides.length);
		for (const [i, side] of battle.sides.entries()) {
			state.sides[i] = this.serializeSide(side);
		}
		state.prng = battle.prng.getSeed();
		state.hints = Array.from(battle.hints);
		// We treat log specially because we only set it back on Battle after everything
		// else has been deserialized to avoid anything accidentally `add`-ing to it.
		state.log = battle.log;
		state.queue = this.serializeWithRefs(battle.queue.list, battle);
		state.formatid = battle.format.id;
		return state;
	}

	// Deserialization can only really be done on the root Battle object as
	// the leaf nodes like Side or Pokemon contain backreferences to Battle
	// but don't contain the information to fill it in because the cycles in
	// the graph have been serialized as references. Once deserialzized, the
	// Battle can then be restarted (and provided with a `send` function for
	// receiving updates).
	deserializeBattle(serialized: string | /* Battle */ AnyObject): Battle {
		const state: /* Battle */ AnyObject =
			typeof serialized === 'string' ? JSON.parse(serialized) : serialized;
		const options = {
			formatid: state.formatid,
			seed: state.prngSeed,
			rated: state.rated,
			debug: state.debugMode,
			// We need to tell the Battle that we're creating that it's been
			// deserialized so that it allows us to populate it correctly and
			// doesn't attempt to start playing out until we're ready.
			deserialized: true,
			strictChoices: state.strictChoices,
		};
		for (const side of state.sides) {
			// When we instantiate the Battle again we need the pokemon to be in
			// the correct order they were in at the start of the Battle which was
			// serialized. See serializeSide below for an explanation about the
			// encoding format used deserializeSide for where we reorder the Side's
			// pokemon to match their ordering at the point of serialization.
			const team = side.team.split(side.team.length > 9 ? ',' : '');
			// @ts-expect-error index signature
			options[side.id] = {
				name: side.name,
				avatar: side.avatar,
				team: team.map((p: string) => side.pokemon[Number(p) - 1].set),
			};
		}
		// We create the Battle, allowing it to instantiate the Field/Side/Pokemon
		// objects for us. The objects it creates will be incorrect, but we descend
		// down through the fields and repopulate all of the objects with the
		// correct state afterwards.
		const battle = new Battle(options);
		// Calling `new Battle(...)` means side.pokemon is ordered to match what it
		// was at the start of the battle (state.team), but we need to order the Pokemon
		// back in their correct order based on how the battle has progressed. We need
		// do to this before making any deserialization calls so that `fromRef` will
		// be correct.
		for (const [i, s] of state.sides.entries()) {
			const side = battle.sides[i];
			const ordered = new Array(side.pokemon.length);
			const team = s.team.split(s.team.length > 9 ? ',' : '');
			for (const [j, pos] of team.entries()) {
				ordered[Number(pos) - 1] = side.pokemon[j];
			}
			side.pokemon = ordered;
		}
		this.deserialize(state, battle, BATTLE, battle);
		this.deserializeField(state.field, battle.field);
		let activeRequests = false;
		for (const [i, side] of state.sides.entries()) {
			this.deserializeSide(side, battle.sides[i]);
			activeRequests = activeRequests || side.activeRequest === undefined;
		}
		// Since battle.getRequests depends on the state of each side we can't combine
		// this loop with the one above which deserializes the sides. We also only do this
		// if there are any active requests, not only to avoid have to recompute request
		// states we wouldnt be using, but also because battle.getRequests will mutate
		// state on occasion (eg. `pokemon.getMoves` sets `pokemon.trapped = true` if locked).
		if (activeRequests) {
			const requests = battle.getRequests(battle.requestState);
			for (const [i, side] of state.sides.entries()) {
				battle.sides[i].activeRequest = side.activeRequest === null ? null : requests[i];
			}
		}
		battle.prng = new PRNG(state.prng);
		const queue = this.deserializeWithRefs(state.queue, battle);
		battle.queue.list = queue;
		(battle as any).hints = new Set(state.hints);
		(battle as any).log = state.log;
		return battle;
	}

	// Direct comparisons of serialized state will be flakey as the timestamp
	// protocol message |t:| can diverge between two different runs over the same state.
	// State must first be normalized before it is comparable.
	normalize(state: AnyObject) {
		state.log = this.normalizeLog(state.log);
		return state;
	}

	normalizeLog(log?: null | string | string[]) {
		if (!log) return log;
		const normalized = (typeof log === 'string' ? log.split('\n') : log).map(line =>
			line.startsWith(`|t:|`) ? `|t:|` : line);
		return (typeof log === 'string' ? normalized.join('\n') : normalized);
	}

	serializeField(field: Field): /* Field */ AnyObject {
		return this.serialize(field, FIELD, field.battle);
	}

	deserializeField(state: /* Field */ AnyObject, field: Field) {
		this.deserialize(state, field, FIELD, field.battle);
	}

	serializeSide(side: Side): /* Side */ AnyObject {
		const state: /* Side */ AnyObject = this.serialize(side, SIDE, side.battle);
		state.pokemon = new Array(side.pokemon.length);
		const team = new Array(side.pokemon.length);
		for (const [i, pokemon] of side.pokemon.entries()) {
			state.pokemon[i] = this.serializePokemon(pokemon);
			team[side.team.indexOf(pokemon.set)] = i + 1;
		}
		// We encode the team such that it could be used as a valid `/team` command
		// during decoding to transform the current ordering of the serialized Side's
		// pokemon array into the original team ordering at the start of the battle.
		// This is *not* the same as the original `/team` command used to order the
		// pokemon in team preview, but this encoding results in the most intuitive
		// and readable debugging of the raw JSON, so we're willing to add a small
		// amount of complexity to the encoding/decoding process to accommodate this.
		state.team = team.join(team.length > 9 ? ',' : '');
		state.choice = this.serializeChoice(side.choice, side.battle);
		// If activeRequest is null we encode it as a tombstone indicator to ensure
		// that during serialization when we recompute the activeRequest we don't turn
		// `activeRequest = null` into  `activeRequest = { wait: true, ... }`.
		if (side.activeRequest === null) state.activeRequest = null;
		return state;
	}

	deserializeSide(state: /* Side */ AnyObject, side: Side) {
		this.deserialize(state, side, SIDE, side.battle);
		for (const [i, pokemon] of state.pokemon.entries()) {
			this.deserializePokemon(pokemon, side.pokemon[i]);
		}
		this.deserializeChoice(state.choice, side.choice, side.battle);
	}

	serializePokemon(pokemon: Pokemon): /* Pokemon */ AnyObject {
		const state: /* Pokemon */ AnyObject = this.serialize(pokemon, POKEMON, pokemon.battle);
		state.set = pokemon.set;
		// Only serialize the baseMoveSlots if they differ from moveSlots. We could get fancy and
		// only serialize the diff and its index but thats overkill for a pretty niche case anyway.
		if (pokemon.baseMoveSlots.length !== pokemon.moveSlots.length ||
			!pokemon.baseMoveSlots.every((ms, i) => ms === pokemon.moveSlots[i])) {
			state.baseMoveSlots = this.serializeWithRefs(pokemon.baseMoveSlots, pokemon.battle);
		}
		return state;
	}

	deserializePokemon(state: /* Pokemon */ AnyObject, pokemon: Pokemon) {
		this.deserialize(state, pokemon, POKEMON, pokemon.battle);
		(pokemon as any).set = state.set;
		// baseMoveSlots and moveSlots need to point to the same objects (ie. identity, not equality).
		// If we serialized the baseMoveSlots, replace any that match moveSlots to preserve the
		// identity relationship requirement.
		let baseMoveSlots;
		if (state.baseMoveSlots) {
			baseMoveSlots = this.deserializeWithRefs(state.baseMoveSlots, pokemon.battle);
			for (const [i, baseMoveSlot] of baseMoveSlots.entries()) {
				const moveSlot = pokemon.moveSlots[i];
				if (moveSlot.id === baseMoveSlot.id && !moveSlot.virtual) {
					baseMoveSlots[i] = moveSlot;
				}
			}
		} else {
			baseMoveSlots = pokemon.moveSlots.slice();
		}
		(pokemon as any).baseMoveSlots = baseMoveSlots;
		if (state.showCure === undefined) pokemon.showCure = undefined;
	}

	serializeChoice(choice: Choice, battle: Battle): /* Choice */ AnyObject {
		const state: /* Choice */ AnyObject = this.serialize(choice, CHOICE, battle);
		state.switchIns = Array.from(choice.switchIns);
		return state;
	}

	deserializeChoice(state: /* Choice */ AnyObject, choice: Choice, battle: Battle) {
		this.deserialize(state, choice, CHOICE, battle);
		choice.switchIns = new Set(state.switchIns);
	}

	// Simply looking for a 'hit' field to determine if an object is an ActiveMove or not seems
	// pretty fragile, but its no different than what the simulator is doing. We go further and
	// also check if the object has an 'id', as that's what we will interpret as the Move.
	isActiveMove(obj: AnyObject): obj is ActiveMove {
		return obj.hasOwnProperty('hit') && (obj.hasOwnProperty('id') || obj.hasOwnProperty('move'));
	}

	// ActiveMove is somewhat problematic (#5415) as it sometimes extends a Move and adds on
	// some mutable fields. We'd like to avoid displaying all the readonly fields of Move
	// (which in theory should not be changed by the ActiveMove...), so we collapse them
	// into a 'move: [Move:...]' reference.  If isActiveMove returns a false positive *and*
	// and object contains an 'id' field matching a Move *and* it contains fields with the
	// same name as said Move then we'll miss them during serialization and won't
	// deserialize properly. This is unlikely to be the case, and would probably indicate
	// a bug in the simulator if it ever happened, but if not, the isActiveMove check can
	// be extended.
	serializeActiveMove(move: ActiveMove, battle: Battle): /* ActiveMove */ AnyObject {
		const base = battle.dex.moves.get(move.id);
		const skip = new Set([...ACTIVE_MOVE]);
		for (const [key, value] of Object.entries(base)) {
			// This should really be a deepEquals check to see if anything on ActiveMove was
			// modified from the base Move, but that ends up being expensive and mostly unnecessary
			// as ActiveMove currently only mutates its simple fields (eg. `type`, `target`) anyway.
			// @ts-expect-error index signature
			if (typeof value === 'object' || move[key] === value) skip.add(key);
		}
		const state: /* ActiveMove */ AnyObject = this.serialize(move, skip, battle);
		state.move = `[Move:${move.id}]`;
		return state;
	}

	deserializeActiveMove(state: /* ActiveMove */ AnyObject, battle: Battle): ActiveMove {
		const move = battle.dex.getActiveMove(this.fromRef(state.move, battle)! as Move);
		this.deserialize(state, move, ACTIVE_MOVE, battle);
		return move;
	}

	serializeWithRefs(obj: unknown, battle: Battle): unknown {
		switch (typeof obj) {
		case 'function':
			return undefined; // elide functions
		case 'undefined':
		case 'boolean':
		case 'number':
		case 'string':
			return obj;
		case 'object':
			if (obj === null) return null;
			if (Array.isArray(obj)) {
				const arr = new Array(obj.length);
				for (const [i, o] of obj.entries()) {
					arr[i] = this.serializeWithRefs(o, battle);
				}
				return arr;
			}

			if (this.isActiveMove(obj)) return this.serializeActiveMove(obj, battle);
			if (this.isReferable(obj)) return this.toRef(obj);
			if (obj.constructor !== Object) {
				// If we're getting this error, some 'special' field has been added to
				// an object and we need to update the logic in this file to handle it.
				// The most common case it that someone added a Set/Map which probably
				// needs to be serialized as an Array/Object respectively - see how
				// Battle 'hints' or Choice 'switchIns' are handled (and you will likely
				// need to add the new field to the respective skip constant).
				throw new TypeError(`Unsupported type ${obj.constructor.name}: ${obj as any}`);
			}

			const o: any = {};
			for (const [key, value] of Object.entries(obj)) {
				o[key] = this.serializeWithRefs(value, battle);
			}
			return o;
		default:
			throw new TypeError(`Unexpected typeof === '${typeof obj}': ${obj}`);
		}
	}

	deserializeWithRefs(obj: unknown, battle: Battle) {
		switch (typeof obj) {
		case 'undefined':
		case 'boolean':
		case 'number':
			return obj;
		case 'string':
			return this.fromRef(obj, battle) || obj;
		case 'object':
			if (obj === null) return null;
			if (Array.isArray(obj)) {
				const arr = new Array(obj.length);
				for (const [i, o] of obj.entries()) {
					arr[i] = this.deserializeWithRefs(o, battle);
				}
				return arr;
			}

			if (this.isActiveMove(obj)) return this.deserializeActiveMove(obj, battle);

			const o: any = {};
			for (const [key, value] of Object.entries(obj)) {
				o[key] = this.deserializeWithRefs(value, battle);
			}
			return o;
		case 'function': // lol wtf
		default:
			throw new TypeError(`Unexpected typeof === '${typeof obj}': ${obj}`);
		}
	}

	isReferable(obj: object): obj is Referable {
		// NOTE: see explanation on the declaration above for why this must be defined lazily.
		if (!this.REFERABLE) {
			this.REFERABLE = new Set([
				Battle, Field, Side, Pokemon, Dex.Condition,
				Dex.Ability, Dex.Item, Dex.Move, Dex.Species,
			]);
		}
		return this.REFERABLE.has(obj.constructor);
	}

	toRef(obj: Referable): string {
		// Pokemon's 'id' is not only more verbose than a position, it also isn't guaranteed
		// to be uniquely identifying in custom games without Nickname/Species Clause.
		const id = obj instanceof Pokemon ? `${obj.side.id}${POSITIONS[obj.position]}` : `${obj.id}`;
		return `[${obj.constructor.name}${id ? ':' : ''}${id}]`;
	}

	fromRef(ref: string, battle: Battle): Referable | undefined {
		// References are sort of fragile - we're mostly just counting on there
		// being a low chance that some string field in a simulator object will not
		// 'look' like one. However, it also needs to match one of the Referable
		// class types to be decode, so we're probably OK. We could make the reference
		// markers more esoteric with additional sigils etc to avoid collisions, but
		// we're making a conscious decision to favor readability over robustness.
		if (!ref.startsWith('[') && !ref.endsWith(']')) return undefined;

		ref = ref.substring(1, ref.length - 1);
		// There's only one instance of these thus they don't need an id to differentiate.
		if (ref === 'Battle') return battle;
		if (ref === 'Field') return battle.field;

		const [type, id] = ref.split(':');
		switch (type) {
		case 'Side': return battle.sides[Number(id[1]) - 1];
		case 'Pokemon': return battle.sides[Number(id[1]) - 1].pokemon[POSITIONS.indexOf(id[2])];
		case 'Ability': return battle.dex.abilities.get(id);
		case 'Item': return battle.dex.items.get(id);
		case 'Move': return battle.dex.moves.get(id);
		case 'Condition': return battle.dex.conditions.get(id);
		case 'Species': return battle.dex.species.get(id);
		default: return undefined; // maybe we actually got unlucky and its a string
		}
	}

	serialize(obj: object, skip: Set<string>, battle: Battle): AnyObject {
		const state: AnyObject = {};
		for (const [key, value] of Object.entries(obj)) {
			if (skip.has(key)) continue;
			const val = this.serializeWithRefs(value, battle);
			// JSON.stringify will get rid of keys with undefined values anyway, but
			// we also do it here so that assert.deepEqual works on battle.toJSON().
			if (typeof val !== 'undefined') state[key] = val;
		}
		return state;
	}

	deserialize(state: AnyObject, obj: object, skip: Set<string>, battle: Battle) {
		for (const [key, value] of Object.entries(state)) {
			if (skip.has(key)) continue;
			// @ts-expect-error index signature
			obj[key] = this.deserializeWithRefs(value, battle);
		}
	}
};
