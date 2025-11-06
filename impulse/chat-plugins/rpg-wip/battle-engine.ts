/*
* Pokemon Showdown
* RPG Battle Engine
*
* This file re-exports all battle-related functionality from:
* - battle-core.ts: Core battle mechanics, damage calculation
* - battle-effects.ts: End-of-turn effects, status effects, battle flow
* - battle-moves.ts: Specific logic for individual move effects
* - battle-shared.ts: Shared helper functions used by all battle files
*
* This allows other files to import from battle-engine.ts as before,
* maintaining backwards compatibility after the split.
*/

// Re-export everything from battle-core
export * from './battle-core';

// Re-export everything from battle-effects
export * from './battle-effects';

// Re-export everything from battle-moves
export * from './battle-moves';

// Re-export everything from battle-shared
export * from './battle-shared';
