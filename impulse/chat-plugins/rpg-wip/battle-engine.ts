/*
* Pokemon Showdown
* RPG Battle Engine
*
* This file re-exports all battle-related functionality from:
* - battle-core.ts: Core battle mechanics, damage calculation, move execution
* - battle-effects.ts: End-of-turn effects, status effects, battle flow
*
* This allows other files to import from battle-engine.ts as before,
* maintaining backwards compatibility after the split.
*/

// Re-export everything from battle-core
export * from './battle-core';

// Re-export everything from battle-effects
export * from './battle-effects';
