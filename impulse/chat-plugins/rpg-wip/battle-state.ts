/**
 * Battle State Management
 *
 * This module contains shared state that is used across battle-related modules.
 * It's separated to avoid circular dependencies between commands.ts,
 * battle-commands.ts, battle-flow.ts, and battle-tower.ts.
 */

/**
 * Tracks the Terastallization toggle state for each user during battle.
 * Key: userId, Value: whether Tera toggle is active
 */
export const teraToggleState = new Map<string, boolean>();

/**
 * Tracks active scripted events for each user.
 * Key: userId, Value: eventId
 */
export const activeScriptedEvents = new Map<string, string>();
