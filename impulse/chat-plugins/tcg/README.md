# TCG System Architecture

This document explains how the Pokemon Trading Card Game (TCG) system files work together to provide a complete card collection, trading, and economy management system.

## File Structure Overview

The TCG system is organized into the following files:

- `interface.ts` - TypeScript interfaces defining data structures
- `tcg_collections.ts` - Database collection definitions
- `tcg_utils.ts` - Core utility functions for pack generation and caching
- `tcg_commands.ts` - Main command router and core user commands
- `tcg_admin_cmds.ts` - Administrative commands for moderators
- `tcg_economy_cmds.ts` - Shop, buying, selling, and gifting commands
- `tcg_trade_cmds.ts` - Trading system between users
- `tcg_collections_cmds.ts` - Collection viewing and profile commands

## Core Data Structures (interface.ts)

### TcgCard
Represents a single Pokémon Trading Card with all its properties including:
- Card identification (cardId, name, setId)
- Rarity information (rarity, rarityPoints)
- Card attributes (hp, types, subtypes, stage, attacks, abilities)
- Scoring data (totalPoints, setPoints, subtypePoints, rarityPoints)
- Artwork and legal information (imageUrl, legalities, regulationMark)

### TcgUser
Represents a card in a user's collection with:
- User ownership (userId, cardId)
- Acquisition timing (firstAcquiredAt, lastAcquiredAt)
- Card details cached from TcgCard for faster queries
- Quantity held by the user

### TcgUserProfile
Tracks overall statistics for a user including:
- Credits (in-game currency)
- Collection metrics (totalUniqueCards, totalQuantity, collectionPoints)
- Progression tracking (totalSetsCompleted, favoriteCards, totalTrades)
- Trade permissions (tradesEnabled)

### TcgUserPack
Represents unopened booster packs a user owns:
- Pack identification (setId, setName, setLogo)
- Quantity available
- Acquisition timestamp

### TcgDailyCooldown
Tracks daily reward cooldown status to prevent claim spam.

## Database Collections (tcg_collections.ts)

Five MongoDB collections are used:

1. `tcg_cards` - All available Pokémon cards (read-only, populated from external data)
2. `tcg_collections` - User card inventory (TcgUser documents)
3. `tcg_profiles` - User profile and statistics (TcgUserProfile documents)
4. `tcg_user_packs` - Unopened packs owned by users (TcgUserPack documents)
5. `tcg_cooldowns` - Daily claim cooldown tracking (TcgDailyCooldown documents)

## Core Utilities (tcg_utils.ts)

### Caching System

The system uses an in-memory caching layer to optimize performance:

- **cardsCache**: Maps cardId to full TcgCard objects
- **setsCache**: Maps setId to representative TcgCard from that set
- **packCache**: Organizes cards by set and rarity pool for pack generation
- **globalFallbackCache**: Common cards used when no rarity-specific cards available
- **dailyShopCache**: Cached rotating shop inventory with timestamp

Functions:
- `initializeCache()` - Loads all cards from database into memory
- `getCacheStats()` - Returns cache status information
- `clearCache()` - Purges all in-memory caches
- `getCard(cardId)` - Retrieves card from cache or database
- `getSet(setId)` - Retrieves set representative card

### Pack Generation

The pack generation system creates realistic TCG booster packs with rarity distribution:

- `generatePack(setId)` - Main function, decides between cache or database approach
- `generatePackFromCache(setId)` - Fast path using in-memory data
- `generatePackFromDB(setId)` - Fallback path when cache uninitialized

Pack composition (8 cards):
- 3 common cards
- 3 uncommon cards
- 1 rare/reverse rare card (or fallback)
- 1 special rare card (90% chance) or rare/fallback

### Collection Management

- `addCardsToCollection(user, pack)` - Adds cards to user's collection from a pack
  - Respects MAX_CARD_QUANTITY (10) limit
  - Awards CREDITS_PER_DUPLICATE (1) credit per excess card beyond limit
  - Updates user profile statistics
  - Uses bulk database operations for efficiency

### HTML Rendering

- `renderCardGridHtml(cards, title, subtitle, options)` - Formats cards as an interactive grid for display

## Main Commands (tcg_commands.ts)

Entry point for all TCG commands. Routes to subcommand handlers.

### Core User Commands

- `/tcg card [cardId]` - Display individual card information with artwork
- `/tcg set [setId]` - Show set information with logo and totals
- `/tcg search [query]` - Advanced card search with filters
  - Supports: type:Fire, hp:>100, rarity:Secret, artist:"Name", set:sv1, legal:standard, reg:G
  - Paginated results (40 cards per page)
- `/tcg daily` - Claim free daily booster pack (24 hour cooldown)
- `/tcg leaderboard [stat]` - View top 10 collectors by: points, count, unique, credits, or sets

### Subcommand Routing

Routes to specialized command modules:
- `...adminCommands` - Administrative operations
- `...economyCommands` - Shop and economy
- `...tradeCommands` - Trading system
- `...collectionCommands` - Collection viewing

## Collection and Profile Commands (tcg_collections_cmds.ts)

### Viewing Commands

- `/tcg collection [user:], [filters:], [page]` - Browse user's card collection
  - Supports filtering by rarity, type, set, hp, series, etc.
  - Shows quantity badges on cards
  - Paginated (80 cards per page)

- `/tcg profile [user]` - Display user's profile card with:
  - Horizontal scrolling favorite cards gallery
  - Collection statistics
  - Set completion percentage
  - Trade history count

- `/tcg setprogress [setId]` - Show progress for completing a specific set
  - Visual progress bar
  - Card count breakdown

- `/tcg missing [setId], [user?], [page?]` - List cards missing from a set
  - Useful for set completion tracking
  - Paginated results

- `/tcg packs` - Display all unopened packs with quick-open buttons

### Favorite Cards

- `/tcg favorite [cardId]` - Add card to profile favorites (max 10)
- `/tcg unfavorite [cardId|all]` - Remove from favorites

### Stats Recalculation

- `/tcg recalculatestats [user]` - Recalculate statistics for a single user or self

## Economy Commands (tcg_economy_cmds.ts)

### Shop System

- `/tcg shop` - View daily rotating shop with 20 random sets
  - Shop refreshes daily
  - Shows pack prices (currently 0 credits)
  - Quick-buy buttons

- `/tcg buy [setId]` - Purchase a pack from the shop
  - Verifies user has sufficient credits
  - Adds pack to user inventory

### Selling Cards

- `/tcg sell [cardId], [quantity]` - Sell cards from collection
  - Awards CREDITS_PER_DUPLICATE per card
  - Updates collection statistics

- `/tcg sellduplicates [all|setId]` - Sell all duplicate cards
  - Keeps 1 copy of each card
  - Converts excess to credits

### Gifting System

- `/tcg giftcard [user], [cardId], [quantity]` - Give cards to another user
  - Respects quantity limits
  - Awards duplicate credits to recipient

- `/tcg giftpack [user], [setId], [quantity]` - Give unopened packs to another user

- `/tcg giftcredits [user], [amount]` - Transfer credits to another user
  - Includes error recovery with refund logic

## Trading System (tcg_trade_cmds.ts)

### Trade Flow

1. `/tcg trade [user]` - Initiate trade with another user
   - Verifies both users exist and have trades enabled
   - Creates ActiveTrade record

2. `/tcg tradeadd [cardId], [quantity]` - Add cards to your offer
   - Verifies user owns the card
   - Resets both users' ready status

3. `/tcg traderemove [cardId], [quantity]` - Remove cards from offer

4. `/tcg tradeaddcredits [amount]` - Add credits to offer

5. `/tcg tradeview` - Display current trade state with both offers

6. `/tcg tradeaccept` - Mark yourself as ready
   - When both accept, trade executes
   - Validates both parties still have items
   - Transfers ownership atomically

7. `/tcg tradecancel` - End active trade

### Trade Permissions

- `/tcg tradedisable` - Prevent other users from trading with you
- `/tcg tradeenable` - Allow trades from other users

### Trade Mechanics

- ActiveTrade map stores ongoing trades by sorted user IDs
- 10-minute timeout for inactive trades
- Atomic transfer on both-accept with validation
- Duplicate card handling during transfer
- Credit balance updates
- Trade counter increment for both parties

## Administrative Commands (tcg_admin_cmds.ts)

Requires roomowner or bypassall permissions.

### Item Management

- `/tcg awardcredits [user], [amount]` - Grant credits
- `/tcg awardpack [user], [setId], [quantity]` - Give packs
- `/tcg awardcard [user], [cardId], [quantity]` - Give cards
- `/tcg takecard [user], [cardId], [quantity]` - Remove cards
- `/tcg takecredits [user], [amount]` - Remove credits
- `/tcg takepack [user], [setId], [quantity]` - Remove packs

### User Data Management

- `/tcg wipecollection [user]` - Complete reset of user's TCG data
- `/tcg resetdaily [user|all]` - Reset daily pack cooldown

### System Management

- `/tcg loadcache` - Initialize in-memory card cache from database
- `/tcg cachestats` - Display cache statistics
- `/tcg clearcache` - Clear in-memory caches
- `/tcg refreshshop` - Force shop refresh
- `/tcg recalculateallstats` - Recalculate all user statistics (background process)
- `/tcg createindexes` - Create MongoDB indexes for performance

## Command Flow Examples

### Opening a Daily Pack

1. User executes `/tcg daily`
2. `daily` command checks cooldown collection
3. If available, calls `generatePack()` with random set
4. `generatePack()` uses cache if initialized, otherwise queries database
5. Pack generation selects cards by rarity pools
6. `addCardsToCollection()` processes cards, respects limits, awards duplicate credits
7. User profile updated with new totals
8. HTML grid rendered showing opened cards

### Trading Between Users

1. User A initiates `/tcg trade userB`
2. ActiveTrade created and stored in memory
3. Both users add items with `/tcg tradeadd` and `/tcg tradeaddcredits`
4. Both execute `/tcg tradeaccept`
5. On second accept:
   - System validates both have items
   - Transfers cards from A to B
   - Transfers cards from B to A
   - Updates both profiles
   - Increments trade counters
   - Cleans up ActiveTrade from memory

### Searching and Collecting

1. User searches `/tcg search Charizard type:Fire hp:>200`
2. `parseSearchQuery()` parses filters
3. Database query executed with MongoDB aggregation
4. Results paginated and formatted as clickable card grid
5. User clicks card to view `/tcg card` details
6. User views collection with `/tcg collection rarity:Secret`
7. Cards filtered and aggregated by sets, displayed with quantities

## Performance Considerations

### Caching Strategy

- In-memory cache reduces database queries by 90%+ after initialization
- Cache must be loaded with `/tcg loadcache` for optimal performance
- Pack generation 10-100x faster from cache vs database

### Database Optimization

- Bulk operations used for mass inserts/updates
- Indexes on userId, cardId, and stat fields essential
- Aggregation pipelines for complex queries (leaderboards, stats)
- MongoDB upsert for atomic update-or-insert operations

### Memory Management

- Cache size depends on total cards in system (typically <500MB)
- ActiveTrade map auto-cleans expired trades (10 min timeout)
- Daily shop cache updates once per day

## Constants

- `CACHE_SAMPLE_SIZE = 10` - Cards sampled for weighted selection
- `DB_SAMPLE_SIZE = 10` - Database fallback sample size
- `HIT_CHANCE = 0.9` - Probability of rare card in pack slot 8
- `MAX_CARD_QUANTITY = 10` - Maximum duplicates before excess → credits
- `CREDITS_PER_DUPLICATE = 1` - Credit award per duplicate
- `MAX_PACK_SIZE = 8` - Cards per booster pack
- `TRADE_TIMEOUT = 10 * 60 * 1000` - 10 minute trade expiration
- `MAX_FAVORITE_CARDS = 10` - Maximum favorite cards on profile
- `SEARCH_PAGE_LIMIT = 40` - Cards per search results page
- `PACKS_IN_SHOP = 20` - Sets in daily shop

## Integration Points

The TCG system integrates with:

- **Pokemon Showdown** - User authentication and room system
- **ImpulseDB** - MongoDB wrapper for database operations
- **Utils** - HTML table generation for displays

Standalone commands are registered in the main commands router and respond to `/tcg` prefix with subcommands.
