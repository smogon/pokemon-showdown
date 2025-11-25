# Battle Simulator Accuracy Analysis and Improvement Suggestions

This document outlines the discrepancies found between the `rpg-wip` battle simulator and the official Pokémon Scarlet and Violet mechanics. It also provides suggestions for improvements.

## 1. Damage Formula and Rounding

The core damage formula is the foundation of the battle simulator. While the current implementation is close, there are inaccuracies in the order of operations and rounding that can lead to incorrect damage calculations.

### Discrepancy: Incorrect Rounding and Modifier Application

The official damage calculation for Generations V+ follows a strict order of operations with specific rounding rules at each step. The current implementation applies modifiers in a slightly different order and uses a mix of `Math.floor` and a custom `pokeRound` function, which doesn't precisely match the official "round half to even" or "round half down" standards used in the games at various stages.

**Current Implementation (`battle-core.ts`):**
```typescript
// ... base damage calculation ...
damage = pokeRound(damage * stabMultiplier);
damage = Math.floor(damage * effectivenessMultiplier);
damage = pokeRound(damage * criticalMultiplier);
damage = Math.floor(damage * randomMultiplier);
damage = pokeRound(damage * spreadMultiplier);
```

**Official Pokémon Showdown approach (simplified):** The process is a long chain of multiplications and divisions, often using intermediate values and specific rounding at each step. For example, modifiers are often applied to a "base damage" value before the final random factor is applied.

### Suggestion: Refactor Damage Calculation

Refactor the `calculateDamage` function to follow the official formula's order of operations more strictly. This involves:
1.  Calculating the base damage.
2.  Applying a chain of modifiers in the correct order (e.g., weather, abilities, items).
3.  Using the correct rounding method (typically rounding down or rounding to the nearest integer with halves rounded down) at each step of the modifier chain.
4.  Applying the final random multiplier.

## 2. End-of-Turn Order

The sequence of events at the end of a turn is critical for many strategies. The current implementation deviates slightly from the official order.

### Discrepancy: Leech Seed Placement

In `battle-eot.ts`, Leech Seed damage and healing are applied *after* status condition damage (Burn, Poison). In the official games, Leech Seed is typically processed before status damage, alongside other healing effects like Leftovers.

**Current Order (`battle-eot.ts`):**
1. Weather Effects
2. Healing Effects (Aqua Ring, Ingrain, etc.)
3. Item Effects (Leftovers, Black Sludge, Flame Orb)
4. Status Damage (Burn, Poison)
5. **Leech Seed**
6. Volatile Status Damage (Curse, etc.)

### Suggestion: Reorder End-of-Turn Effects

Modify `processEndOfTurn` in `battle-eot.ts` to process Leech Seed healing and damage alongside other healing effects like Aqua Ring and Leftovers, and before status-inflicted damage.

## 3. Missing and Incomplete Mechanics

The simulator is missing several key features from Pokémon Scarlet and Violet.

### Discrepancy: Incomplete Terastallization Implementation

The simulator has partial support for Terastallization (e.g., a `terastallized` property and some logic for Tera Blast), but it is far from a complete implementation. Key missing features include:
*   The core mechanic of changing a Pokémon's type for the duration of the battle.
*   The specific STAB (Same-Type Attack Bonus) rules for Terastallized Pokémon.
*   The once-per-battle limitation.

### Suggestion: Fully Implement Terastallization

A significant effort would be required to fully implement Terastallization. This would involve:
1.  Modifying the `calculateDamage` function to account for the new STAB rules.
2.  Ensuring that a Pokémon's type is correctly changed for defensive purposes.
3.  Adding UI elements to the battle screen to allow the player to Terastallize a Pokémon.
4.  Tracking the once-per-battle usage of Terastallization.

### Discrepancy: Missing Moves and Abilities

Many moves and abilities introduced in recent generations, particularly Scarlet and Violet, are not implemented. While the simulator has a good foundation, the absence of these key components limits its accuracy.

**Examples of missing abilities:**
*   `Opportunist`: Copies an opponent's stat boosts.
*   `Good as Gold`: Provides immunity to status moves.

### Suggestion: Implement Missing Moves and Abilities

Incrementally add the missing moves and abilities, starting with those that are most common in competitive play or have the most significant impact on battle outcomes. This would be an ongoing effort to keep the simulator up-to-date.

## 4. General Suggestions for Improvement

Beyond fixing discrepancies, several improvements could enhance the battle simulator.

### Suggestion: Create a Battle Log

The current `messageLog` is cleared and rebuilt each turn. A persistent battle log that records all actions, damage, and effects throughout the battle would be invaluable for debugging and for players to review the battle's progression.

### Suggestion: Improve AI

The current AI in `generateAiAction` is very basic, choosing a random damaging move. The AI could be improved by:
*   Making it aware of type effectiveness.
*   Allowing it to use status moves strategically.
*   Making it capable of switching Pokémon.

### Suggestion: Add Support for Different Battle Formats

The simulator is currently hardcoded for single and double battles. Adding support for other formats, such as Multi-Battles or Tera Raid Battles, would greatly expand the RPG's potential.
