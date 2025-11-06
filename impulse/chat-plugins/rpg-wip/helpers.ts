/*
* Pokemon Showdown
* RPG Helper Systems
*
* Re-exports all helper system functions for backward compatibility.
* Individual systems are now in separate files for better modularity:
* - pokedex.ts: Pokemon seen/caught tracking
* - badges.ts: Gym badge management
* - travel.ts: Location and travel system
* - achievements.ts: Achievement tracking
*/

// Re-export Pokedex system
export * from './pokedex';

// Re-export Badge system
export * from './badges';

// Re-export Travel system
export * from './travel';

// Re-export Achievement system
export * from './achievements';
