# Clan System Documentation

## Overview

This is a comprehensive clan management and warfare system for Pokemon Showdown. It provides functionality for creating clans, managing members and ranks, handling clan wars with ELO ratings, and tracking battle statistics.

## File Structure and Architecture

### Core Files

#### 1. database.ts
Database layer that defines and exports MongoDB collection interfaces and instances.

**Key Components:**
- Defines TypeScript types for all data models with MongoDB document types
- Exports database collection instances: Clans, UserClans, ClanLogs, ClanPointsLogs, ClanBans, ClanBattleLogs, ClanWars
- Uses ImpulseDB wrapper for database operations
- All types include MongoDB _id field and Document interface

**Data Collections:**
- Clans: Stores clan information and settings
- UserClans: Maps users to their clan membership and pending invitations
- ClanLogs: Activity audit trail for clans
- ClanPointsLogs: Tracks point transactions
- ClanBans: Tracks banned users
- ClanBattleLogs: Records individual battle outcomes in wars
- ClanWars: Stores war state and progression

#### 2. interface.ts
Type definitions for all clan-related data structures.

**Key Types:**
- ClanPermission: Individual permission flags (canInvite, canKick, canPromote, etc.)
- ClanPermissions: Object containing permission flags
- CustomClanRank: Defines a rank with ID, name, permission level, and permissions
- ClanMember: Member data including rank, join date, and points contributed
- ClanStats: War statistics including ELO, battle wins/losses, tournament wins
- Clan: Complete clan data including members, ranks, points, icon, description
- ClanWar: War instance with participating clans, scores, status, and format
- ClanBattleLogEntry: Individual battle outcome record
- ClanLog: Activity log entry
- ClanPointsLogEntry: Points transaction record

#### 3. utils.ts
Utility functions for common operations across the clan system.

**Key Functions:**
- logClanActivity(): Inserts activity logs into ClanLogs collection
- hasClanPermission(): Checks if a user has a specific permission in their clan
- to(): Formats dates to ISO or customizable date/time strings
- toDurationString(): Converts milliseconds to human-readable duration format
- getExpectedScore(): Calculates expected win probability using ELO formula
- calculateElo(): Computes new ELO ratings for winner and loser based on match outcome
- generateWarCard(): Creates HTML representation of a war with different perspectives

**ELO System:**
- Uses K_FACTOR of 32 for rating adjustments
- Implements standard ELO formula: 1 / (1 + 10^((opponentRating - myRating)/400))
- ELO change calculated as: K_FACTOR * (1 - expectedScore), minimum 1

#### 4. commands.ts
Main command handler for clan management operations.

**Command Categories:**

**Clan Management:**
- create: Creates new clan (admin only)
- delete: Deletes clan and all related data (admin only)
- join: Joins an open or invited clan
- leave: Leaves current clan (non-owners only)

**Member Management:**
- kick: Remove member from clan
- invite: Send clan invitation
- deinvite: Revoke pending invitation
- invites: View pending invitations
- members: List all clan members

**Rank Management:**
- createrank: Create custom rank with permissions
- deleterank: Remove custom rank
- editrank: Toggle permissions for a rank
- promote: Increase member rank
- demote: Lower member rank
- transfer: Change clan ownership
- ranks: Display all ranks

**Clan Settings:**
- setdesc: Set clan description (up to 80 characters)
- settag: Set clan tag (up to 3 uppercase letters)
- setmotw: Designate member of the week
- seticon: Set clan icon URL
- inviteonly: Toggle invite-only membership mode
- announce: Send announcement to online members

**Information:**
- list: Display clans sorted by ELO or points
- profile: View clan profile with stats
- logs: View activity logs
- pointslog: View points transaction history
- battlelogs: View clan's battle history

**Admin Commands:**
- addpoints/removepoints: Adjust clan points
- addtourwins/removetourwins: Adjust tournament wins
- addeventwins/removeeventwins: Adjust event wins
- setlevel/addlevel/removelevel: Manage clan level
- resetstats: Reset non-war statistics
- setdescadmin/settagadmin/seticonadmin: Admin setting overrides
- kickall/clearmembers: Remove all non-owner members
- clearinvites: Remove pending invitations
- banuser/unbanuser: Ban/unban users from clans
- export: Export clan data as JSON
- transferadmin: Force ownership transfer
- clearlogs: Delete activity logs

#### 5. clan-battles.ts
Handles clan war battle completion and score tracking.

**Key Function: handleClanBattleEnd()**

Processes when a 1v1 battle ends during an active war:

1. Validates battle is 1v1 and not a tournament
2. Retrieves player clan memberships
3. Finds active war between the two clans
4. Updates war score for winning clan
5. If score reaches winsNeeded:
   - Calculates ELO changes using calculateElo()
   - Creates battle log entry
   - Updates both clans' ELO and win/loss stats
   - Marks war as completed
   - Sends end-of-war card to all relevant rooms
6. If war continues:
   - Creates battle log entry with 0 ELO change
   - Updates war score
   - Sends updated war card to all relevant rooms

**Error Handling:**
- Validates war status is active and not paused
- Logs crashes to Monitor with detailed context
- Handles missing room updates gracefully

#### 6. war-commands.ts
Comprehensive clan war system with challenge, management, and statistics tracking.

**War Lifecycle Commands:**

**Initiation:**
- challenge: Challenge another clan to war (24-hour cooldown, odd bestOf 1-101)
- rematch: Challenge previous opponent without cooldown

**Response:**
- accept: Accept pending war challenge
- deny: Reject pending war challenge
- cancel: Withdraw sent challenge

**War Management:**
- pause: Propose pausing active war (dual confirmation)
- resume: Propose resuming paused war (dual confirmation)
- tie: Propose war tie (dual confirmation to complete)
- extend: Propose extending bestOf value (dual confirmation)
- forfeit: Forfeit active war to opponent

**Statistics:**
- status: View clan's pending/active wars
- ladder: Ranked ladder sorted by ELO, wins, losses, or win rate
- stats: Detailed war statistics including win rate, streaks, ELO
- history: Completed war history with results
- record: Head-to-head record between two clans
- mvp: Top performers in clan wars

**Admin War Commands:**
- forceend: Forcibly end active war
- forcetie: Forcibly declare war a tie
- forfeitadmin: Force one clan to forfeit
- resetcooldown: Remove challenge cooldown
- setscore: Manually adjust war score
- setbestof: Change bestOf format
- forcepause: Forcibly pause war
- forceresume: Forcibly resume war
- clearpending: Delete pending war challenge
- forcecreate: Instantly create active war

**War State Management:**

Wars progress through states:
- pending: Challenge sent, awaiting response
- active: War in progress, battles being fought
- completed: War concluded

**Dual Confirmation System:**
- Some actions require both clans to confirm (tie, extend, pause, resume)
- Confirmations stored in war document arrays
- Action completes when second clan confirms
- Partial confirmation persists on war card as "Waiting for..."

**ELO Application:**
- Only applied when war is won (final score determines winner)
- Not applied during individual battles in ongoing wars
- Forfeit applies ELO change immediately
- Uses calculateElo() from utils.ts

## Data Flow and Integration

### User Creates/Joins Clan
1. User runs /clan create or /clan join
2. commands.ts processes request
3. database.ts operations create/update Clans and UserClans collections
4. Activity logged via logClanActivity() to ClanLogs
5. Clan chatroom created/user added to clan chatroom

### War Challenge Flow
1. User runs /clan war challenge
2. war-commands.ts validates permissions and creates ClanWar document
3. generateWarCard() creates HTML for challenge notification
4. Card sent to both clan rooms and lobby
5. Opponent runs /clan war accept
6. War status changes to active
7. When battles occur, handleClanBattleEnd() processes results
8. ClanBattleLogs records individual battles
9. When winning score reached, war completes with ELO changes

### Permission System
- Each rank has CustomClanRank with specific permissions
- hasClanPermission() checks user's rank against required permission
- Owner always has all permissions
- Permissions control: invites, kicks, promotions, war declarations, etc.
- Custom ranks can be created with subset of permissions

### Statistics Tracking
- ClanStats stored on Clan document
- Individual battles logged to ClanBattleLogs
- War outcomes logged to ClanLogs
- Point transactions logged to ClanPointsLogs
- Ladder commands aggregate stats across all clans
- MVP system counts winning battles per user

## Room Integration

All major events broadcast to three room contexts:

1. **Challenger Clan Room**: Shows challenger perspective of war card
2. **Target Clan Room**: Shows target perspective of war card
3. **Lobby Room**: Public perspective visible to all players

Different perspectives display relevant buttons:
- Challenger sees "Withdraw Challenge" or "Pause War" options
- Target sees "Accept"/"Deny" or decision requests
- Public sees generic war information without action buttons

## Key Features

### Flexible Rank System
- 4 default ranks: owner, leader, officer, member
- Unlimited custom ranks with granular permissions
- Permission level determines seniority
- Cannot modify ranks above your own permission level

### Dual Confirmation System
- War extensions, pauses, resumes, and ties require both clans to confirm
- First confirmation shows "Waiting for opponent..."
- Second confirmation executes action
- Provides protection against accidental state changes

### ELO Rating System
- Tracks clan strength through individual war victory
- Expected score accounts for rating difference
- Higher rated clans gain less ELO from upsets
- Minimum ELO change of 1 per win

### Cooldown System
- 24-hour cooldown between war challenges per clan
- rematch bypasses cooldown for previous opponents
- resetcooldown admin command removes cooldown
- Cooldown removed when challenge denied

### Activity Logging
- All significant actions logged to ClanLogs
- Includes actor, action type, affected target, old/new values
- Used for audit trail and transparency
- Admin commands prefixed with [ADMIN] in notes

## Error Handling

System implements comprehensive error handling:

- Permission checks prevent unauthorized actions
- War state validation prevents invalid transitions
- Clan membership validation prevents cross-clan issues
- Room existence checks prevent missing broadcasts
- Crash logging via Monitor for server errors
- User-friendly error messages for validation failures

## Database Operations

All operations use MongoDB patterns:
- insertOne: Create new documents (wars, logs)
- updateOne: Single document updates (ELO changes, settings)
- updateMany: Batch updates (user clan membership removal)
- deleteOne: Single deletion (war challenges, user bans)
- deleteMany: Batch deletion (clan data removal)
- find: Querying with sort and limit for pagination
- upsert: Insert or update pattern for UserClans

## Performance Considerations

- Parallel Promise.all() for non-dependent database queries
- Pagination support in ladder and history displays
- Limits on log retrieval (default 50, max 100)
- Efficient query filters using $all, $in, $or operators
- Indexed lookups on _id fields

