'use strict';

/**
 * Applies EventLog entries directly to a live `Battle` object's state,
 * bypassing the choice/turn/RNG simulation engine entirely. This mirrors
 * (and extends, for `switch`/`faint`/etc) the same primitives Pokemon
 * Showdown's own `/editbattle` debug command uses (see
 * sim/battle-stream.ts `BattleStream.prototype.editbattle`):
 *   - Pokemon#sethp / status field assignment for HP & status
 *   - direct boosts[] arithmetic for stat stages
 *   - Pokemon#addVolatile / Side#addSideCondition / Field#setWeather /
 *     Field#setTerrain / Field#addPseudoWeather for conditions
 * plus a hand-rolled minimal `switchIn` (position bookkeeping only, no
 * onSwitchIn/entry-hazard event pipeline -- those effects are already
 * present as their own separate log lines, e.g. `-damage ... Stealth Rock`,
 * which get applied as their own entries) and a minimal `faint`.
 *
 * Every command not explicitly handled is reported via `onUnhandled`
 * (default: console.warn) rather than throwing, so unfamiliar/rare log
 * lines degrade gracefully instead of aborting the whole replay.
 */

const SLOT_INDEX = { a: 0, b: 1, c: 2, d: 3 };
const TERRAIN_IDS = new Set(['electricterrain', 'grassyterrain', 'mistyterrain', 'psychicterrain']);
// Conditions whose `-start`/`-end` log lines are purely informational: their
// actual state lives in `pokemon.abilityState` (a per-ability counter/flag),
// not `pokemon.volatiles`, unlike most other `-start` effects (found via
// testing -- see data/abilities.ts `slowstart`, which tracks its 5-turn
// countdown in `this.effectState.counter` under the ability, never touching
// `pokemon.volatiles`). Treating these as generic volatiles would create a
// phantom `pokemon.volatiles` entry a real battle never has.
const ABILITY_STATE_ONLY_STARTS = new Set(['slowstart']);
// Protosynthesis/Quark Drive append the boosted stat to their `-start`
// display text (e.g. "quarkdrivespa") -- see data/abilities.ts, where
// `add('-start', pokemon, 'quarkdrive' + bestStat)` is purely cosmetic; the
// actual `pokemon.volatiles` key stays the bare ability id (`addVolatile('quarkdrive')`).
const STAT_SUFFIXED_VOLATILES = ['protosynthesis', 'quarkdrive'];
function normalizeVolatileId(effectId) {
	const base = STAT_SUFFIXED_VOLATILES.find(b => effectId.startsWith(b) && effectId !== b);
	return base || effectId;
}

function parseIdent(ident) {
	const m = /^(p[1-4])([a-d])?:\s?(.*)$/.exec(ident.trim());
	if (!m) throw new Error(`Cannot parse Pokemon ident: "${ident}"`);
	const [, sideId, slotLetter, nickname] = m;
	return { sideId, slotLetter, nickname };
}

function parseDetails(details) {
	const parts = details.split(',').map(s => s.trim());
	const species = parts[0];
	let level = 100, gender = '', shiny = false, tera = null;
	for (const p of parts.slice(1)) {
		if (/^L\d+$/.test(p)) level = parseInt(p.slice(1), 10);
		else if (p === 'M' || p === 'F') gender = p;
		else if (p === 'shiny') shiny = true;
		else if (p.startsWith('tera:')) tera = p.slice(5);
	}
	return { species, level, gender, shiny, tera };
}

/** Parses a protocol "HP STATUS" field, e.g. "84/100 par", "100/100", "0 fnt". */
function parseHPStatus(str) {
	const trimmed = (str || '').trim();
	if (!trimmed) return null;
	const [hpPart, status] = trimmed.split(' ');
	if (hpPart === '0') return { fainted: true, status: status || 'fnt' };
	const [num, denom] = hpPart.split('/').map(Number);
	if (!denom) throw new Error(`Cannot parse HP field: "${str}"`);
	return { hpFraction: num / denom, status: status || '' };
}

function clampBoost(v) {
	return Math.max(-6, Math.min(6, v));
}

/** Strips the "move: "/"ability: "/"item: " prefix protocol effect names sometimes carry. */
function stripEffectPrefix(effect) {
	return effect.replace(/^(move|ability|item):\s*/i, '');
}

class LogApplier {
	constructor(battle, { onUnhandled } = {}) {
		this.battle = battle;
		this.toID = battle.toID.bind(battle);
		this.onUnhandled = onUnhandled || ((entry) => {
			console.warn(`[battle-recreate] unhandled log command: ${entry.raw}`);
		});
		// per-side-index nickname -> Pokemon binding, established as
		// switch/drag entries are processed
		this.nickMap = this.battle.sides.map(() => new Map());
		// Pokemon -> last move id used since its most recent switch-in. Used
		// by finalizeChoiceLock() to *infer* the choicelock volatile, which
		// (like `stall`, the Protect/Detect counter) is never itself logged
		// -- see data/conditions.ts `choicelock`/`stall`, whose onStart/etc
		// never call battle.add(). Choice-locking is inferable from visible
		// state (holds a Choice item + has moved since switching in); the
		// Protect success-counter is not reconstructible from the log at
		// all and is left as a known gap.
		this.lastMoveByPokemon = new Map();
	}

	getSideIndex(sideId) {
		return parseInt(sideId.slice(1), 10) - 1;
	}

	getSide(sideId) {
		return this.battle.sides[this.getSideIndex(sideId)];
	}

	/** Resolve a Pokemon reference for non-switch commands (uses active position when given). */
	resolvePokemon(ident) {
		const { sideId, slotLetter, nickname } = parseIdent(ident);
		const side = this.getSide(sideId);
		if (slotLetter) {
			const pokemon = side.active[SLOT_INDEX[slotLetter]];
			if (!pokemon) throw new Error(`No active Pokemon at ${ident}`);
			return pokemon;
		}
		const sideIdx = this.getSideIndex(sideId);
		const nickId = this.toID(nickname);
		const pokemon = this.nickMap[sideIdx].get(nickId);
		if (!pokemon) throw new Error(`Unknown inactive Pokemon reference: "${ident}"`);
		return pokemon;
	}

	/** Resolve (and bind, on first sighting) the Pokemon switching in, by species match. */
	resolveIncoming(ident, details) {
		const { sideId, nickname } = parseIdent(ident);
		const side = this.getSide(sideId);
		const sideIdx = this.getSideIndex(sideId);
		const nickId = this.toID(nickname);
		if (this.nickMap[sideIdx].has(nickId)) {
			return this.nickMap[sideIdx].get(nickId);
		}
		const { species } = parseDetails(details);
		const speciesId = this.toID(species);
		// Pokemon with battle-only formes triggered automatically on switch-in
		// (Zamazenta-Crowned/Zacian-Crowned via their signature item, etc.)
		// show that changed forme in their very first `|switch|`, not the
		// "base" name a pokepaste would list -- resolve through the dex's own
		// baseSpecies so this still matches.
		const logSpecies = this.battle.dex.species.get(species);
		const logBaseId = this.toID(logSpecies.baseSpecies || species);
		const bound = new Set(this.nickMap[sideIdx].values());
		const found = side.pokemon.find(p => {
			if (bound.has(p)) return false;
			const pSpeciesId = this.toID(p.species.name);
			const pBaseId = this.toID(p.species.baseSpecies);
			return pSpeciesId === speciesId || pBaseId === speciesId ||
				pSpeciesId === logBaseId || pBaseId === logBaseId;
		});
		if (!found) {
			throw new Error(
				`Could not match "${species}" (from log entry for ${ident}) to any unbound ` +
				`Pokemon on ${sideId}'s provided team. The Pokepaste likely doesn't match ` +
				`the real battle's team for this side.`
			);
		}
		this.nickMap[sideIdx].set(nickId, found);
		return found;
	}

	/** Minimal switch-in: position bookkeeping only, no event pipeline. */
	directSwitchIn(pokemon, pos) {
		const side = pokemon.side;
		const oldActive = side.active[pos];
		if (oldActive && oldActive !== pokemon) {
			oldActive.isActive = false;
			oldActive.isStarted = false;
			oldActive.position = pokemon.position;
			if (oldActive.fainted) oldActive.status = '';
			oldActive.clearVolatile();
			pokemon.position = pos;
			side.pokemon[pokemon.position] = pokemon;
			side.pokemon[oldActive.position] = oldActive;
		} else {
			pokemon.position = pos;
		}
		pokemon.isActive = true;
		side.active[pos] = pokemon;
		pokemon.activeTurns = 0;
		pokemon.activeMoveActions = 0;
		for (const moveSlot of pokemon.moveSlots) moveSlot.used = false;
	}

	directFaint(pokemon) {
		// idempotent: a faint is typically observed twice in the log (once via
		// the "0 fnt" HP field on -damage, once via the explicit |faint| line)
		if (pokemon.fainted) return;
		pokemon.hp = 0;
		// mirrors Battle#faintMessages' exact sequence: clearVolatile() resets
		// boosts/volatiles/ability(->base)/moveSlots/lastMove, same as a
		// normal switch-out -- a fainted Pokemon isn't just "still there at
		// 0 HP", its transient battle state is wiped too.
		pokemon.clearVolatile(false);
		pokemon.fainted = true;
		pokemon.faintQueued = false;
		pokemon.illusion = null;
		pokemon.isActive = false;
		pokemon.isStarted = false;
		delete pokemon.terastallized;
		// matches Battle#checkFainted, which is what actually sets this
		// in a normal playthrough (not `pokemon.status = ''`)
		pokemon.status = 'fnt';
		if (pokemon.side.pokemonLeft) pokemon.side.pokemonLeft--;
	}

	applyHPStatus(pokemon, str) {
		const parsed = parseHPStatus(str);
		if (!parsed) return;
		if (parsed.fainted) {
			this.directFaint(pokemon);
			return;
		}
		const targetHP = Math.max(1, Math.round(parsed.hpFraction * pokemon.maxhp));
		pokemon.sethp(targetHP);
		if (parsed.status) {
			const statusId = this.toID(parsed.status);
			if (pokemon.status !== statusId) pokemon.setStatus(statusId, null, null, true);
		} else if (pokemon.status) {
			pokemon.setStatus('');
		}
	}

	applyBoostDelta(pokemon, stat, delta) {
		pokemon.boosts[stat] = clampBoost((pokemon.boosts[stat] || 0) + delta);
	}

	/** Applies one EventLog entry directly to battle state. Returns true if handled. */
	apply(entry) {
		const { cmd, args } = entry;
		const battle = this.battle;

		switch (cmd) {
		// --- setup / metadata: no state effect on our pre-built Battle ---
		case 'player': case 'teamsize': case 'gametype': case 'gen': case 'tier':
		case 'rule': case 'clearpoke': case 'poke': case 'teampreview': case 'start':
		case 'rated': case 't:': case '': case 'upkeep': case 'raw': case 'html':
		case 'j': case 'J': case 'l': case 'L': case 'n': case 'N':
			return true;

		case 'turn':
			battle.turn = parseInt(args[0], 10);
			return true;

		case 'switch': case 'drag': case 'replace': {
			const [ident, details, hpStatus] = args;
			const { sideId, slotLetter } = parseIdent(ident);
			const pos = SLOT_INDEX[slotLetter];
			const pokemon = this.resolveIncoming(ident, details);
			// Battle-only formes (Zamazenta-Crowned, etc) reveal themselves
			// in this very details string, ahead of any explicit
			// detailschange/-formechange entry -- sync species now.
			const { species: switchInSpecies } = parseDetails(details);
			if (this.toID(pokemon.species.name) !== this.toID(switchInSpecies)) {
				pokemon.setSpecies(battle.dex.species.get(switchInSpecies), null, true);
			}
			this.directSwitchIn(pokemon, pos);
			this.lastMoveByPokemon.delete(pokemon);
			if (hpStatus) this.applyHPStatus(pokemon, hpStatus);
			return true;
		}

		case 'swap': {
			const [ident, posStr] = args;
			const pokemon = this.resolvePokemon(ident);
			const side = pokemon.side;
			const newPos = parseInt(posStr, 10);
			const oldPos = pokemon.position;
			const other = side.active[newPos];
			side.active[newPos] = pokemon;
			side.active[oldPos] = other;
			pokemon.position = newPos;
			if (other) other.position = oldPos;
			return true;
		}

		case 'faint': {
			const pokemon = this.resolvePokemon(args[0]);
			this.directFaint(pokemon);
			return true;
		}

		case '-damage': case '-heal': {
			const [ident, hpStatus] = args;
			const pokemon = this.resolvePokemon(ident);
			this.applyHPStatus(pokemon, hpStatus);
			return true;
		}

		case '-sethp': {
			const [ident, hp] = args;
			const pokemon = this.resolvePokemon(ident);
			this.applyHPStatus(pokemon, hp);
			return true;
		}

		case '-status': {
			const [ident, status] = args;
			const pokemon = this.resolvePokemon(ident);
			pokemon.setStatus(this.toID(status), null, null, true);
			return true;
		}

		case '-curestatus': {
			const pokemon = this.resolvePokemon(args[0]);
			pokemon.status = '';
			return true;
		}

		case '-cureteam': {
			const pokemon = this.resolvePokemon(args[0]);
			for (const p of pokemon.side.pokemon) p.status = '';
			return true;
		}

		case '-boost': case '-unboost': {
			const [ident, stat, amountStr] = args;
			const pokemon = this.resolvePokemon(ident);
			let amount = parseInt(amountStr, 10);
			if (cmd === '-unboost') amount = -amount;
			this.applyBoostDelta(pokemon, stat, amount);
			return true;
		}

		case '-setboost': {
			const [ident, stat, amountStr] = args;
			const pokemon = this.resolvePokemon(ident);
			pokemon.boosts[stat] = clampBoost(parseInt(amountStr, 10));
			return true;
		}

		case '-swapboost': {
			const [sourceIdent, targetIdent, statsStr] = args;
			const source = this.resolvePokemon(sourceIdent);
			const target = this.resolvePokemon(targetIdent);
			const stats = statsStr.split(',').map(s => s.trim());
			for (const stat of stats) {
				const tmp = source.boosts[stat];
				source.boosts[stat] = target.boosts[stat];
				target.boosts[stat] = tmp;
			}
			return true;
		}

		case '-copyboost': {
			const [sourceIdent, targetIdent] = args;
			const source = this.resolvePokemon(sourceIdent);
			const target = this.resolvePokemon(targetIdent);
			target.boosts = { ...source.boosts };
			return true;
		}

		case '-invertboost': {
			const pokemon = this.resolvePokemon(args[0]);
			for (const stat in pokemon.boosts) pokemon.boosts[stat] = -pokemon.boosts[stat];
			return true;
		}

		case '-clearboost': {
			const pokemon = this.resolvePokemon(args[0]);
			pokemon.clearBoosts();
			return true;
		}

		case '-clearpositiveboost': {
			const pokemon = this.resolvePokemon(args[0]);
			for (const stat in pokemon.boosts) if (pokemon.boosts[stat] > 0) pokemon.boosts[stat] = 0;
			return true;
		}

		case '-clearnegativeboost': {
			const pokemon = this.resolvePokemon(args[0]);
			for (const stat in pokemon.boosts) if (pokemon.boosts[stat] < 0) pokemon.boosts[stat] = 0;
			return true;
		}

		case '-clearallboost': {
			for (const side of battle.sides) {
				for (const pokemon of side.active) {
					if (pokemon) pokemon.clearBoosts();
				}
			}
			return true;
		}

		case '-weather': {
			const [weather] = args;
			if (weather === 'none') {
				battle.field.clearWeather();
			} else {
				battle.field.setWeather(this.toID(weather), 'debug');
			}
			return true;
		}

		case '-fieldstart': {
			// `-fieldstart` covers both terrain and non-weather pseudo-weather
			// (Trick Room, Gravity, ...) -- see e.g. data/moves.ts's Grassy
			// Terrain/Electric Terrain handlers, which both `add('-fieldstart', ...)`.
			// Terrain lives in a separate `field.terrain` slot, not pseudoWeather.
			const conditionId = this.toID(stripEffectPrefix(args[0]));
			if (TERRAIN_IDS.has(conditionId)) {
				battle.field.setTerrain(conditionId, 'debug');
			} else {
				battle.field.addPseudoWeather(conditionId, 'debug');
			}
			return true;
		}

		case '-fieldend': {
			const conditionId = this.toID(stripEffectPrefix(args[0]));
			if (TERRAIN_IDS.has(conditionId)) {
				battle.field.clearTerrain();
			} else {
				battle.field.removePseudoWeather(conditionId);
			}
			return true;
		}

		case '-sidestart': {
			const [sideIdent, condition] = args;
			const side = this.getSide(sideIdent.split(':')[0].trim());
			side.addSideCondition(this.toID(stripEffectPrefix(condition)), 'debug');
			return true;
		}

		case '-sideend': {
			const [sideIdent, condition] = args;
			const side = this.getSide(sideIdent.split(':')[0].trim());
			side.removeSideCondition(this.toID(stripEffectPrefix(condition)));
			return true;
		}

		case '-start': {
			const [ident, effect, extra] = args;
			const pokemon = this.resolvePokemon(ident);
			const effectId = normalizeVolatileId(this.toID(stripEffectPrefix(effect)));
			if (effectId === 'typechange') {
				// Not a real volatile/condition (see e.g. Double Shock, Soak,
				// Reflect Type in data/moves.ts): `-start|...|typechange|TYPES`
				// is purely an informational log line for a direct
				// `pokemon.setType()` call. Applying it as a generic volatile
				// would create a phantom `volatiles.typechange` entry that
				// doesn't exist in the real engine.
				if (extra) pokemon.setType(extra.split('/'), true);
				return true;
			}
			if (ABILITY_STATE_ONLY_STARTS.has(effectId)) return true;
			if (effectId && !pokemon.volatiles[effectId]) pokemon.addVolatile(effectId);
			return true;
		}

		case '-end': {
			const [ident, effect] = args;
			const pokemon = this.resolvePokemon(ident);
			const effectId = normalizeVolatileId(this.toID(stripEffectPrefix(effect)));
			if (pokemon.volatiles[effectId]) pokemon.removeVolatile(effectId);
			return true;
		}

		case '-item': {
			const [ident, item] = args;
			const pokemon = this.resolvePokemon(ident);
			pokemon.item = this.toID(item);
			return true;
		}

		case '-enditem': {
			const [ident] = args;
			const pokemon = this.resolvePokemon(ident);
			pokemon.item = '';
			return true;
		}

		case '-ability': {
			const [ident, ability] = args;
			const pokemon = this.resolvePokemon(ident);
			pokemon.ability = this.toID(ability);
			return true;
		}

		case '-transform': {
			// Deep transform-state cloning (stats/moves/types) is out of scope
			// for direct application; surfaced as unhandled so callers are aware.
			this.onUnhandled(entry);
			return false;
		}

		case '-mega': case '-burst': {
			// `add('-mega', this, apparentSpecies, requiredItem)` / same for -burst:
			// args[1] is the (plain, not full-details) new species name.
			const [ident, species] = args;
			const pokemon = this.resolvePokemon(ident);
			if (species) pokemon.species = battle.dex.species.get(species);
			return true;
		}

		case '-primal': {
			// `add('-primal', this, requiredItem)` -- no species name is logged
			// (the client infers Groudon/Kyogre -> their Primal forme itself);
			// primal reversion is pre-Gen9 and out of scope to special-case here.
			this.onUnhandled(entry);
			return false;
		}

		case 'detailschange': {
			// args[1] is a full DETAILS string ("Mimikyu-Busted, L82, M"), not
			// a bare species name -- must be parsed first.
			const [ident, details] = args;
			const pokemon = this.resolvePokemon(ident);
			const { species } = parseDetails(details);
			pokemon.setSpecies(battle.dex.species.get(species), null, true);
			return true;
		}

		case '-formechange': {
			// args[1] here *is* already a bare species name (see
			// sim/pokemon.ts: `add('-formechange', this, species.name, ...)`).
			const [ident, species] = args;
			const pokemon = this.resolvePokemon(ident);
			pokemon.setSpecies(battle.dex.species.get(species), null, false);
			return true;
		}

		case '-terastallize': {
			const [ident, type] = args;
			const pokemon = this.resolvePokemon(ident);
			pokemon.terastallized = type;
			return true;
		}

		case 'win': case 'tie':
			return true;

		case 'move': {
			// No direct effect from the move itself (its consequences --
			// damage, boosts, etc -- arrive as their own separate log
			// entries), but `pokemon.lastMove` is real, persistent Pokemon
			// state that several conditions' onStart depend on (e.g. Encore
			// reads `target.lastMove` -- see data/moves.ts) -- and, like
			// choicelock, is otherwise silently unrecoverable.
			const [ident, moveName] = args;
			const pokemon = this.resolvePokemon(ident);
			if (moveName) {
				const moveId = this.toID(moveName);
				this.lastMoveByPokemon.set(pokemon, moveId);
				pokemon.lastMove = battle.dex.moves.get(moveId);
			}
			return true;
		}

		// purely cosmetic / no state change
		case '-fail': case '-block': case '-notarget': case '-miss': case '-crit':
		case '-supereffective': case '-resisted': case '-immune': case '-hint':
		case '-message': case '-combine': case '-waiting': case '-prepare':
		case '-mustrecharge': case '-nothing': case '-hitcount': case '-singlemove':
		case '-singleturn': case '-center': case '-activate': case '-endability':
		case '-zpower': case '-zbroken': case 'cant': case '-swapsideconditions':
			return true;

		default:
			this.onUnhandled(entry);
			return false;
		}
	}

	/**
	 * Best-effort inference of the (never-logged) `choicelock` volatile:
	 * any currently-active Pokemon holding a Choice item that has used a
	 * move since its last switch-in must be locked into that move. Call
	 * once, after applyAll() has processed all pre-turn-N entries.
	 */
	finalizeChoiceLock() {
		for (const side of this.battle.sides) {
			for (const pokemon of side.active) {
				if (!pokemon || pokemon.fainted || pokemon.volatiles.choicelock) continue;
				const item = this.battle.dex.items.get(pokemon.item);
				const moveId = this.lastMoveByPokemon.get(pokemon);
				if (!item.isChoice || !moveId) continue;
				// Trick/Switcheroo can be how the Pokemon *got* this item mid-move;
				// using them doesn't lock you into repeating them next turn.
				if (moveId === 'trick' || moveId === 'switcheroo') continue;
				if (pokemon.hasMove?.(moveId)) {
					pokemon.volatiles.choicelock = this.battle.initEffectState({
						id: 'choicelock', target: pokemon, move: moveId,
					});
				}
			}
		}
	}

	applyAll(entries) {
		for (const entry of entries) {
			try {
				this.apply(entry);
			} catch (e) {
				this.onUnhandled({ ...entry, raw: `${entry.raw}  (error: ${e.message})` });
			}
		}
	}
}

module.exports = { LogApplier, parseIdent, parseDetails, parseHPStatus };
