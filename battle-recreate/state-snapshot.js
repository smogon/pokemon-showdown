'use strict';

/**
 * Produces a plain-JSON snapshot of the parts of battle state that are
 * visible in the protocol log, for comparing "reconstructed state at turn N"
 * against "state actually observed at turn N in the real log" without
 * relying on fragile raw-text log comparison.
 */

function snapshotPokemon(p) {
	return {
		species: p.species.name,
		nickname: p.name,
		isActive: p.isActive,
		fainted: p.fainted,
		hp: p.hp,
		maxhp: p.maxhp,
		status: p.status,
		boosts: { ...p.boosts },
		item: p.item,
		ability: p.ability,
		terastallized: p.terastallized || null,
		// sorted: insertion order isn't meaningful game state, and differs
		// legitimately between two independently-built Battle instances
		volatiles: Object.keys(p.volatiles).sort(),
	};
}

function snapshotSide(side) {
	return {
		id: side.id,
		active: side.active.map(p => (p ? snapshotPokemon(p) : null)),
		team: side.pokemon.map(snapshotPokemon),
		sideConditions: Object.keys(side.sideConditions).sort(),
	};
}

function snapshotState(battle) {
	return {
		turn: battle.turn,
		weather: battle.field.weather || null,
		terrain: battle.field.terrain || null,
		pseudoWeather: Object.keys(battle.field.pseudoWeather).sort(),
		sides: battle.sides.map(snapshotSide),
	};
}

module.exports = { snapshotState, snapshotPokemon, snapshotSide };
