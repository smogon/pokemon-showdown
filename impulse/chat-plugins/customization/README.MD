# Custom Customization System - Documentation

This directory contains a suite of customization features for Pokemon Showdown, allowing room owners to personalize user profiles with avatars, colors, icons, symbols, and symbol colors.

## Overview

The customization system consists of five main modules, each handling a specific aspect of user personalization:

1. **custom-avatars.ts** - User profile avatars
2. **custom-colors.ts** - Username text colors in chat
3. **custom-icons.ts** - Userlist icons displayed next to usernames
4. **custom-symbol.ts** - Custom chat symbols/badges for users
5. **custom-symbol-color.ts** - Color customization for chat symbols

Each module operates independently but shares similar architectural patterns and database management approaches.

## Architecture

### Common Components

All modules utilize:
- **ImpulseDB** - Custom database abstraction layer for storing user customization data
- **FS (File System)** - File operations for reading/writing configuration files
- **CSS Generation** - Dynamic CSS generation and caching for visual customizations
- **User Notifications** - Popup messages to notify affected users of changes
- **Staff Room Logging** - Audit trail of all customization changes in the staff room

### Database Collections

- `customavatars` - Stores avatar metadata and URLs
- `customcolors` - Stores user color preferences
- `usericons` - Stores icon URLs and sizes
- `customsymbols` - Stores user symbols
- `symbolcolors` - Stores symbol color values

## Module Details

### custom-avatars.ts

Manages custom profile avatars for users.

**Commands:**
- `/customavatar set [user], [url]` - Download and set an avatar from a URL
- `/customavatar delete [user]` - Remove a user's custom avatar
- `/customavatar list [page]` - Display all set avatars with pagination
- `/customavatar help` - Show help information
- Aliases: `/ca`, `/cc`

**Key Features:**
- Downloads images from HTTP/HTTPS URLs with timeout protection (10 seconds)
- Validates image signatures to ensure file integrity (.jpg, .png, .gif)
- Enforces 5MB file size limit
- Stores avatars in `config/avatars/` directory
- Maintains metadata including who set the avatar and source URL
- Generates cache-busting URLs to prevent stale image caching
- Displays avatars in 80x80px format

**Flow:**
1. User provides username and image URL
2. System validates URL protocol and format
3. Image is downloaded with signature verification
4. Avatar is registered in the system and stored to disk
5. Metadata is saved to database
6. Target user receives notification
7. Action is logged to staff room

### custom-colors.ts

Manages custom text colors for usernames in chat.

**Commands:**
- `/customcolor set [user], [hex]` - Assign a hex color to a user's name
- `/customcolor delete [user]` - Remove custom color
- `/customcolor preview [user], [hex]` - Preview a color before applying
- `/customcolor list` - Display all users with custom colors
- `/customcolor reload` - Reload color configuration from database
- Aliases: `/cc`

**Key Features:**
- Validates hex color formats (#RGB or #RRGGBB)
- Generates CSS selectors that target usernames in chat and userlists
- Dynamically updates `config/custom.css` file
- Integrates with Pokemon Showdown's custom CSS system
- Triggers server-side CSS reload via HTTPS request
- Supports color preview before application

**Flow:**
1. Admin provides username and hex color
2. System validates color format
3. Color data is stored in database
4. CSS is regenerated with new color rules
5. CSS file is updated
6. Server cache is cleared and reloaded
7. Changes apply to all instances of the user's name

### custom-icons.ts

Manages small icons displayed next to usernames in the userlist.

**Commands:**
- `/icon set [user], [url], [size]` - Set a userlist icon for a user
- `/icon update [user], [url], [size]` - Update existing icon or size
- `/icon delete [user]` - Remove a user's icon
- `/icon list [page]` - Display all icons with pagination
- `/icon help` - Show help information
- Aliases: `/usericon`, `/ic`

**Key Features:**
- Accepts image URLs with optional size parameter (1-100px, default 24px)
- Stores icon metadata including creator and creation date
- Generates CSS with background-image rules for userlist display
- Implements cache busting with timestamps
- Prevents duplicate icons on same user
- Icons display on right side of usernames in userlist (32x32px display)
- Update command allows changing URL or size without deletion

**Constraints:**
- Users can only have one icon at a time
- Size range: 1-100 pixels
- Icon displayed at 32x32px but CSS size property can differ

### custom-symbol.ts

Assigns custom symbols or badges that appear next to user symbols in chat.

**Commands:**
- `/symbol set [user], [symbol]` - Assign a single character symbol
- `/symbol update [user], [symbol]` - Change existing symbol
- `/symbol delete [user]` - Remove custom symbol
- `/symbol list [page]` - Display all custom symbols
- `/symbol help` - Show help information
- Aliases: `/customsymbol`, `/cs`

**Key Features:**
- Only accepts single character symbols
- Stores symbol in database and applies to user identity
- Modifies user's displayed group symbol in chat
- Persists across user reconnections via login filter
- Overrides default group symbols
- Maintains original group information for restoration
- Respects punishment symbols (locked, muted, semilocked)

**Flow:**
1. Admin assigns single character symbol to user
2. Symbol is stored in database
3. Symbol is applied immediately if user is online
4. User's identity is updated to reflect new symbol
5. On user login (loginfilter), symbol is automatically reapplied
6. Chat messages display the custom symbol instead of group symbol

**Advanced Implementation:**
- Overrides `Users.User.prototype.getIdentity()` function
- Preserves punishment-related symbols (takes precedence over custom)
- Handles room-specific and global identity display

### custom-symbol-color.ts

Customizes the color of symbols and badges in chat.

**Commands:**
- `/symbolcolor set [user], [hex]` - Set symbol color
- `/symbolcolor update [user], [hex]` - Change symbol color
- `/symbolcolor delete [user]` - Remove symbol color
- `/symbolcolor list [page]` - Display all symbol colors
- `/symbolcolor help` - Show help information
- Aliases: `/sc`

**Key Features:**
- Validates hex color format (#RGB or #RRGGBB)
- Generates CSS targeting symbol elements in both userlist and chat
- Applies color to userlist group buttons and chat message symbols
- Uses color preview with colored square character in responses
- Prevents duplicate symbol colors on same user

**CSS Selectors:**
- Targets userlist symbols via `[id$="-userlist-user-{id}"] button > em.group`
- Targets chat symbols via `[class$="chatmessage-{id}"] strong small`

## Shared Utilities

### Database Operations

All modules use consistent database patterns:
- `ImpulseDB.upsert()` - Insert or update records
- `ImpulseDB.findOne()` - Retrieve single document
- `ImpulseDB.find()` - Retrieve multiple documents
- `ImpulseDB.findPaginated()` - Retrieve paginated results
- `ImpulseDB.deleteOne()` - Remove a record
- `ImpulseDB.exists()` - Check document existence
- `ImpulseDB.insertOne()` - Insert new document

### CSS Management

All visual customizations update `config/custom.css`:
- CSS is divided into named sections with START/END comments
- Existing sections are replaced to avoid duplication
- Changes trigger `Impulse.reloadCSS()` to push updates to clients
- Timestamps added to image URLs for cache busting

### User Notifications

Consistent notification patterns:
- Users receive popups when customizations are applied
- Target users get notification of changes
- Online status is checked before sending popups
- Refresh prompts included where visual changes require them

### Staff Room Logging

All changes logged to staff room:
- Uses `Rooms.get('staff')` to access staff room
- Logs include who made the change, target user, and the change details
- Messages use HTML formatting with infobox styling
- Color-coded user names for readability

## Permission System

All customization commands require:
- **Permission Level**: `roomowner` (represented by `&` symbol)
- **Checked via**: `this.checkCan('roomowner')`
- Commands will error if user lacks sufficient permissions

## File Storage

### Avatar Storage
- Location: `config/avatars/`
- Naming: `{userid}.{ext}` (e.g., `ash.png`)
- Max size: 5MB
- Supported formats: .jpg, .png, .gif

### CSS Storage
- Location: `config/custom.css`
- Contains sections for: colors, icons, symbol colors
- Auto-generated and updated dynamically

## Error Handling

All modules implement robust error handling:
- URL validation (protocol, format, timeout)
- File signature verification
- Database operation try-catch blocks
- User existence validation
- Permission checking
- File operation error suppression during cleanup

## Data Models

### Avatar Document
```
{
  userid: string,
  filename: string,
  setBy: string,
  sourceUrl: string,
  updatedAt: Date
}
```

### Color Document
```
{
  userid: string,
  color: string,
  updatedBy: string,
  updatedAt: Date
}
```

### Icon Document
```
{
  _id: string (userid),
  url: string,
  size: number,
  setBy: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Custom Symbol Document
```
{
  _id: string (userid),
  symbol: string,
  setBy: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Symbol Color Document
```
{
  _id: string (userid),
  color: string,
  setBy: string,
  createdAt: Date,
  updatedAt: Date
}
```

## Integration Points

### With Pokemon Showdown Core
- `Users.get(id)` - Access user objects
- `Users.Avatars` - Avatar system integration
- `Rooms.get(id)` - Access room objects
- `Chat.escapeHTML()` - HTML sanitization
- `toID()` - Username normalization

### Configuration
- `Config.avatarUrl` - Custom avatar URL base (falls back to default)
- `Config.serverid` - Server identifier for CSS reload
- `Config.punishgroups` - Punishment symbol configuration

## Pagination

Multiple modules implement pagination for list commands:
- Default page: 1
- Default limit: 20 items per page
- Navigation buttons automatically generated
- Supports next/previous controls

## Security Considerations

- Image downloads validated with file signatures
- HTTP/HTTPS protocol enforcement for URLs
- Username length validation (max 19 characters)
- HTML escaping for user-provided content
- Timeout protection for fetch operations (10 seconds)
- Permission checks on all admin commands
