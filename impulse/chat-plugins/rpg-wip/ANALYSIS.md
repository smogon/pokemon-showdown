# RPG Plugin Analysis

## 1. System Overview
This is a **persistent, chat-based RPG system** for Pokemon Showdown. Unlike standard plugins that rely on the main simulator for everything, this project implements its own lightweight game engine (Overworld + Battle) to run inside a chat room. It uses MongoDB (`impulse-db`) for data persistence.

## 2. Codebase Structure
The codebase is modular, separated into **Data**, **Core Logic**, **Battle Engine**, and **UI/Interaction**.

### A. Core & Persistence
*   **`core.ts`**: The brain of the operation. It handles `RPGPlayer` class definitions, session management, and database read/write operations (Save/Load). It links PS users to their RPG save data.
*   **`game-config.ts`**: Global constants like level caps, starting money, and specific game IDs.
*   **`interface.ts`**: TypeScript definitions for all data structures (Player, Pokemon, Items, Quests), ensuring type safety across the plugin.
*   **`utils.ts`**: math helpers (EXP formulas), RNG wrappers, and string formatters.

### B. World & Content Data
*   **`game-locations.ts`**: Defines the map. It contains nodes (Zones), connections, wild encounter tables, and lists of NPCs present in each zone.
*   **`game-npcs.ts`**: Database of NPC entities, including their dialogue, sprite IDs, and Trainer AI data (teams).
*   **`game-shops.ts`**: configurations for vendors, defining inventories and badges required to purchase specific tiers of items.
*   **`items.ts`**: A custom Item database. It defines RPG-specific properties (price, restore amount, crafting usage) distinct from the standard Showdown Dex.
*   **`scripted-events.ts`**: Handles story triggers and cutscenes.
*   **`npc-actions.ts`**: Logic for interacting with NPCs beyond text (e.g., healing, starting a battle, giving items).

### C. The Custom Battle Engine
Notably, this RPG **does not** appear to use the full `sim/` directory of Pokemon Showdown for its PvE battles. Instead, it uses a custom, simplified implementation to handle battles within the plugin context:
*   **`battle-core.ts`**: Main loop for managing battle state.
*   **`battle-flow.ts`**: Handles turn order and phase progression.
*   **`battle-moves.ts`**: Implementation of move logic specific to this engine.
*   **`abilities.ts`**: Implementation of passive effects.
*   **`battle-eot.ts`**: End-of-turn effects (status damage, leftovers, etc.).
*   **`battle-tower.ts`**: Logic for a roguelike "Battle Tower" mode.

### D. Pokemon Data Overrides
The system uses manual data files to control progression, likely to balance the RPG differently from the main series games:
*   **`MANUAL_LEARNSETS.ts`**: Hardcoded move pools for Pokemon, overriding Gen 9 learnsets.
*   **`data-exp-evs-catch-rates.ts`**: Custom tables for Experience curves, EV yields, Catch Rates, and Evolution requirements.

### E. User Interface (HTML)
*   **`commands.ts`**: The entry point for user interaction (e.g., `/rpg map`, `/rpg bag`).
*   **`html.ts`**: A renderer that generates the visual interface (Map grid, buttons, health bars) using Showdown's HTML box capabilities.

## 3. Key Observations
1.  **Independence:** The battle engine is decoupled from the main simulator. This allows for faster, simplified battles but requires manual implementation of every move and ability (as seen in `battle-moves.ts` and `abilities.ts`).
2.  **Maintenance Load:** The heavy reliance on `MANUAL_*.ts` files means adding new Pokemon or updating Gen 9 data requires manual entry rather than fetching from `Dex`.
3.  **Persistence:** The system is designed for long-term play, saving exact EVs, IVs, and inventory to a database.
4.  **State:** It is currently in a "WIP" (Work In Progress) state, evidenced by the directory name and the simplified nature of some battle logic compared to the full simulator.
