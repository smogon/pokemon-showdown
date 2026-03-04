# FS Module Guide - Pokemon Showdown Filesystem Abstraction Layer

## Overview

This module provides an abstraction layer around Node.js's filesystem operations specifically designed for Pokemon Showdown. It simplifies file and directory management by offering a cleaner API, automatic path resolution, Promise-based operations, and built-in safety features.

### Why This Abstraction Layer Exists

The FS module was created to address several limitations in Node's native filesystem API:

- Write operations do nothing in unit tests (controlled via `global.Config.nofswriting`)
- All paths are automatically resolved relative to Pokemon Showdown's base directory
- Provides Promise-based operations instead of callbacks
- Offers a more intuitive API: `FS("foo.txt").write("bar")` for easier argument order
- Built-in `mkdirp` functionality for creating nested directories
- Safe write operations to prevent data corruption

### Where It's Used

FS is used nearly everywhere in Pokemon Showdown, with notable exceptions:

- `crashlogger.js` - in case the crash is in the FS module itself
- `repl.js` - which uses Unix sockets outside this file's scope
- Launch script - happens before modules are loaded
- `sim/` directory - intended to be self-contained

## Core Concepts

### Path Resolution

All paths in this module are automatically resolved relative to the Pokemon Showdown base directory. You never need to worry about where your script is running from - the module handles it for you.

### Global State

The module maintains a global state object (`__fsState`) that tracks pending file updates. This prevents race conditions when multiple parts of your code try to write to the same file simultaneously.

### Write Protection

The module respects a `global.Config.nofswriting` flag. When this is set to true (typically during unit tests), all write operations become no-ops, preventing tests from modifying your actual filesystem.

## CRITICAL: Data Persistence Behavior

### Understanding How Writes Work

This is extremely important to understand: **Most write operations in this module COMPLETELY REPLACE existing file content.**

#### Methods That OVERWRITE Files (Data Loss)

All of these methods will DELETE existing data:

- `write()` and `writeSync()`
- `safeWrite()` and `safeWriteSync()`
- `writeUpdate()`

```typescript
// WARNING: This deletes all existing data in the file
await FS('data.json').write(JSON.stringify(newData));

// The old content is gone forever
```

#### Only append() Preserves Data

```typescript
// This ADDS to the end of the file
await FS('log.txt').append('New log entry\n');

// Old content is preserved
```

### Data Persistence Summary Table

| Method | Behavior | Existing Data | Use Case |
|--------|----------|---------------|----------|
| `write()` | Overwrite | **LOST** | Replace entire file |
| `writeSync()` | Overwrite | **LOST** | Replace entire file (sync) |
| `safeWrite()` | Overwrite | **LOST** | Replace safely |
| `safeWriteSync()` | Overwrite | **LOST** | Replace safely (sync) |
| `writeUpdate()` | Overwrite | **LOST** | Replace with race protection |
| `append()` | Add to end | **PRESERVED** | Add to logs/CSV |
| `appendSync()` | Add to end | **PRESERVED** | Add to logs/CSV (sync) |

### Practical Examples

#### Working with JSON Files

```typescript
// WRONG: This deletes old data
const newUser = { id: 2, name: 'Bob' };
await FS('users.json').write(JSON.stringify(newUser));

// CORRECT: Read, merge, then write
const existing = JSON.parse(await FS('users.json').readIfExists() || '[]');
existing.push(newUser);
await FS('users.json').write(JSON.stringify(existing, null, 2));
```

#### Working with Text/Log Files

```typescript
// WRONG: This deletes old logs
await FS('server.log').write('New log entry\n');

// CORRECT: Use append
await FS('server.log').append('New log entry\n');
```

#### Working with CSV Files

```typescript
// Adding new rows - use append
await FS('battles.csv').append('battle123,player1,player2,result\n');

// Replacing entire CSV - use write
const newCsvContent = 'id,player1,player2,result\n' + rows.join('\n');
await FS('battles.csv').write(newCsvContent);
```

## Basic Usage

### Creating an FSPath Instance

```typescript
import { FS } from './lib/fs';

const file = FS('data/users.json');
```

The `FS()` function takes a path string and returns an `FSPath` object with methods for file operations.

## Reading Files

### Asynchronous Reading

**read()** - Reads a file as a string (UTF-8 by default)
```typescript
const content = await FS('config.txt').read();
```

**readBuffer()** - Reads a file as a Buffer (for binary data)
```typescript
const data = await FS('image.png').readBuffer();
```

**readIfExists()** - Reads a file, returns empty string if it doesn't exist
```typescript
const content = await FS('optional-config.txt').readIfExists();
```

### Synchronous Reading

**readSync()** - Synchronous version of read()
```typescript
const content = FS('config.txt').readSync();
```

**readBufferSync()** - Synchronous version of readBuffer()
```typescript
const data = FS('image.png').readBufferSync();
```

**readIfExistsSync()** - Synchronous version of readIfExists()
```typescript
const content = FS('optional-config.txt').readIfExistsSync();
```

## Writing Files

### Basic Writing

**write()** - Writes data to a file (OVERWRITES existing content)
```typescript
await FS('output.txt').write('Hello World');
```

**writeSync()** - Synchronous version (OVERWRITES existing content)
```typescript
FS('output.txt').writeSync('Hello World');
```

### Safe Writing

**safeWrite()** - Writes to a temporary file first, then renames it (OVERWRITES existing content)
```typescript
await FS('important-data.json').safeWrite(JSON.stringify(data));
```

This method protects against data loss if the process crashes during writing. It writes to `important-data.json.NEW` first, and only renames it to the final name after successful writing.

**safeWriteSync()** - Synchronous version (OVERWRITES existing content)
```typescript
FS('important-data.json').safeWriteSync(JSON.stringify(data));
```

### Update Writing (Race Condition Protection)

**writeUpdate()** - Safely updates a file with throttling support (OVERWRITES existing content)

This is the most sophisticated write method. It prevents race conditions when multiple parts of your code try to update the same file.

```typescript
FS('leaderboard.json').writeUpdate(() => {
    return JSON.stringify(currentLeaderboard);
}, { throttle: 5000 });
```

Key features:
- Takes a callback function that fetches the data to write
- The callback may not be called immediately if updates are happening frequently
- Ensures only one write operation happens at a time
- Optional throttling prevents writing more than once per specified milliseconds
- **Still overwrites the file completely**

How it works:
1. If no update is pending, it writes immediately
2. If an update is already pending, it replaces the pending callback with the new one
3. If throttling is enabled, it waits before writing
4. Multiple rapid calls will be batched into a single write

### Appending to Files

**append()** - Adds data to the end of a file (PRESERVES existing content)
```typescript
await FS('log.txt').append('New log entry\n');
```

**appendSync()** - Synchronous version (PRESERVES existing content)
```typescript
FS('log.txt').appendSync('New log entry\n');
```

## File Existence and Information

**exists()** - Check if a file exists
```typescript
const fileExists = await FS('config.txt').exists();
```

**existsSync()** - Synchronous version
```typescript
const fileExists = FS('config.txt').existsSync();
```

**isFile()** - Check if path points to a file
```typescript
const isFile = await FS('something').isFile();
```

**isDirectory()** - Check if path points to a directory
```typescript
const isDir = await FS('folder').isDirectory();
```

## Directory Operations

### Listing Directory Contents

**readdir()** - Lists files and subdirectories
```typescript
const files = await FS('data').readdir();
// returns: ['file1.txt', 'file2.json', 'subfolder']
```

**readdirSync()** - Synchronous version
```typescript
const files = FS('data').readdirSync();
```

**readdirIfExists()** - Lists contents, returns empty array if directory doesn't exist
```typescript
const files = await FS('maybe-exists').readdirIfExists();
```

**readdirIfExistsSync()** - Synchronous version
```typescript
const files = FS('maybe-exists').readdirIfExistsSync();
```

### Creating Directories

**mkdir()** - Creates a directory
```typescript
await FS('new-folder').mkdir();
```

**mkdirSync()** - Synchronous version
```typescript
FS('new-folder').mkdirSync();
```

**mkdirIfNonexistent()** - Creates directory only if it doesn't exist
```typescript
await FS('new-folder').mkdirIfNonexistent();
```

**mkdirIfNonexistentSync()** - Synchronous version
```typescript
FS('new-folder').mkdirIfNonexistentSync();
```

**mkdirp()** - Creates directory and all parent directories
```typescript
await FS('path/to/deep/folder').mkdirp();
```

This is similar to `mkdir -p` in Unix. If `path`, `path/to`, or `path/to/deep` don't exist, they'll all be created.

**mkdirpSync()** - Synchronous version
```typescript
FS('path/to/deep/folder').mkdirpSync();
```

### Deleting Directories

**rmdir()** - Removes a directory
```typescript
await FS('old-folder').rmdir(true); // true for recursive deletion
```

**rmdirSync()** - Synchronous version
```typescript
FS('old-folder').rmdirSync(true);
```

## File Operations

### Deleting Files

**unlinkIfExists()** - Deletes a file if it exists
```typescript
await FS('temp-file.txt').unlinkIfExists();
```

No error is thrown if the file doesn't exist.

**unlinkIfExistsSync()** - Synchronous version
```typescript
FS('temp-file.txt').unlinkIfExistsSync();
```

### Copying and Renaming

**copyFile()** - Copies a file to a new location
```typescript
await FS('source.txt').copyFile('destination.txt');
```

**rename()** - Renames or moves a file
```typescript
await FS('old-name.txt').rename('new-name.txt');
```

**renameSync()** - Synchronous version
```typescript
FS('old-name.txt').renameSync('new-name.txt');
```

### Symbolic Links

**symlinkTo()** - Creates a symbolic link
```typescript
await FS('link-name').symlinkTo('target-file.txt');
```

**symlinkToSync()** - Synchronous version
```typescript
FS('link-name').symlinkToSync('target-file.txt');
```

### Real Path Resolution

**realpath()** - Resolves symbolic links to actual path
```typescript
const actualPath = await FS('some-link').realpath();
```

**realpathSync()** - Synchronous version
```typescript
const actualPath = FS('some-link').realpathSync();
```

## Streams

### Read Streams

**createReadStream()** - Creates a readable stream for large files
```typescript
const stream = FS('large-file.txt').createReadStream();
```

Useful when you need to process a file in chunks rather than loading it entirely into memory.

### Write Streams

**createWriteStream()** - Creates a writable stream
```typescript
const stream = FS('output.txt').createWriteStream();
```

**createAppendStream()** - Creates a stream that appends to a file
```typescript
const stream = FS('log.txt').createAppendStream();
```

## File Watching

**onModify()** - Execute callback when file is modified
```typescript
FS('config.json').onModify(() => {
    console.log('Config file changed!');
});
```

**unwatch()** - Stop watching a file
```typescript
FS('config.json').unwatch();
```

## Utility Methods

**parentDir()** - Get the parent directory as an FSPath object
```typescript
const parent = FS('path/to/file.txt').parentDir();
// parent.path will be 'path/to'
```

## Error Handling

All asynchronous methods return Promises that reject on error. Always use try-catch with async/await or .catch() with promises:

```typescript
try {
    const content = await FS('file.txt').read();
} catch (error) {
    console.error('Failed to read file:', error);
}
```

For synchronous methods, use traditional try-catch:

```typescript
try {
    const content = FS('file.txt').readSync();
} catch (error) {
    console.error('Failed to read file:', error);
}
```

## Best Practices

### When to Use Synchronous vs Asynchronous

**Use asynchronous methods when:**
- Running in a server environment where blocking is bad
- Working with large files
- Performing multiple file operations in sequence

**Use synchronous methods when:**
- Running initialization code at startup
- In build scripts or CLI tools
- When the simplicity is worth the performance trade-off

### Choosing the Right Write Method

**Use write()** for simple, one-time writes where data loss isn't critical and you want to replace the entire file.

**Use safeWrite()** when writing important data that shouldn't be corrupted if the process crashes, and you want to replace the entire file.

**Use writeUpdate()** when multiple parts of your code might try to update the same file simultaneously, or when you want to throttle frequent updates that replace the entire file.

**Use append()** when you want to add data to the end of an existing file without losing the old content.

### Preserving Existing Data

**For JSON files:**
```typescript
// Read existing data first
const existing = JSON.parse(await FS('data.json').readIfExists() || '{}');

// Merge with new data
const merged = { ...existing, ...newData };

// Write back
await FS('data.json').safeWrite(JSON.stringify(merged, null, 2));
```

**For arrays in JSON:**
```typescript
// Read existing array
const existing = JSON.parse(await FS('users.json').readIfExists() || '[]');

// Add new item
existing.push(newUser);

// Write back
await FS('users.json').safeWrite(JSON.stringify(existing, null, 2));
```

**For log files:**
```typescript
// Just use append - it preserves existing content
await FS('server.log').append(`[${new Date().toISOString()}] ${message}\n`);
```

### Memory Considerations

For large files, prefer streams over reading the entire file into memory:

```typescript
// Bad for large files
const content = await FS('huge-file.txt').read();

// Good for large files
const stream = FS('huge-file.txt').createReadStream();
```

## Common Patterns

### Reading JSON Configuration

```typescript
async function loadConfig() {
    const content = await FS('config.json').readIfExists();
    return content ? JSON.parse(content) : {};
}
```

### Saving Data Safely

```typescript
async function saveUserData(userId, data) {
    await FS(`users/${userId}.json`).safeWrite(JSON.stringify(data, null, 2));
}
```

### Updating JSON Data Without Loss

```typescript
async function addBattleResult(battleData) {
    // Read existing battles
    const existing = JSON.parse(await FS('battles.json').readIfExists() || '[]');
    
    // Add new battle
    existing.push(battleData);
    
    // Write back safely
    await FS('battles.json').safeWrite(JSON.stringify(existing, null, 2));
}
```

### Periodic Data Persistence

```typescript
function scheduleDataSave() {
    FS('game-state.json').writeUpdate(() => {
        return JSON.stringify(getCurrentGameState());
    }, { throttle: 10000 }); // Save at most once every 10 seconds
}
```

### Ensuring Directory Exists Before Writing

```typescript
async function writeToDeepPath() {
    await FS('data/users/profiles').mkdirp();
    await FS('data/users/profiles/user123.json').write('{}');
}
```

### Appending to CSV Files

```typescript
async function logBattle(player1, player2, winner) {
    const row = `${Date.now()},${player1},${player2},${winner}\n`;
    await FS('battle-log.csv').append(row);
}
```

### Safe Bulk Updates

```typescript
async function updateLeaderboard(newScores) {
    // Read current leaderboard
    const leaderboard = JSON.parse(
        await FS('leaderboard.json').readIfExists() || '[]'
    );
    
    // Update scores
    for (const score of newScores) {
        const existing = leaderboard.find(s => s.id === score.id);
        if (existing) {
            existing.score = score.score;
        } else {
            leaderboard.push(score);
        }
    }
    
    // Sort and write back
    leaderboard.sort((a, b) => b.score - a.score);
    await FS('leaderboard.json').safeWrite(
        JSON.stringify(leaderboard, null, 2)
    );
}
```

## Understanding the Pending Updates System

The `writeUpdate()` method uses a sophisticated system to manage concurrent writes:

**PendingUpdate Object Structure:**
- `isWriting` - Boolean indicating if a write is currently in progress
- `pendingDataFetcher` - The callback function to fetch fresh data
- `pendingOptions` - Options for the write operation
- `throttleTime` - Timestamp when throttling expires
- `throttleTimer` - Timer handle for scheduled updates

When you call `writeUpdate()`:
1. If no update is pending and no throttle, it writes immediately
2. If an update is pending, it replaces the old callback with the new one
3. If throttled, it schedules the write for later
4. When a write completes, it checks if another update was requested and processes it

This ensures data integrity while batching rapid successive updates efficiently.

**Important:** Even with all this sophistication, `writeUpdate()` still completely replaces the file content. If you need to preserve data, your callback function must read and merge the data:

```typescript
FS('data.json').writeUpdate(async () => {
    // Your callback must handle reading existing data
    const existing = JSON.parse(await FS('data.json').readIfExists() || '{}');
    const merged = { ...existing, ...newData };
    return JSON.stringify(merged);
}, { throttle: 5000 });
```

## Common Pitfalls to Avoid

### Pitfall 1: Assuming write() Preserves Data

```typescript
// WRONG: This deletes all existing players
await FS('players.json').write(JSON.stringify({ newPlayer: data }));

// CORRECT: Read, merge, write
const players = JSON.parse(await FS('players.json').readIfExists() || '{}');
players.newPlayer = data;
await FS('players.json').write(JSON.stringify(players));
```

### Pitfall 2: Using write() for Logs

```typescript
// WRONG: Each write deletes previous logs
await FS('error.log').write(`Error: ${message}\n`);

// CORRECT: Use append
await FS('error.log').append(`Error: ${message}\n`);
```

### Pitfall 3: Forgetting to Create Parent Directories

```typescript
// WRONG: Fails if 'data/users' doesn't exist
await FS('data/users/profile.json').write('{}');

// CORRECT: Create directories first
await FS('data/users').mkdirp();
await FS('data/users/profile.json').write('{}');
```

### Pitfall 4: Not Handling Missing Files

```typescript
// WRONG: Crashes if file doesn't exist
const data = JSON.parse(await FS('config.json').read());

// CORRECT: Use readIfExists
const data = JSON.parse(await FS('config.json').readIfExists() || '{}');
```

## Quick Reference

### Read Operations
- `read()` / `readSync()` - Read as string
- `readBuffer()` / `readBufferSync()` - Read as Buffer
- `readIfExists()` / `readIfExistsSync()` - Read or return empty string

### Write Operations (OVERWRITE)
- `write()` / `writeSync()` - Basic write
- `safeWrite()` / `safeWriteSync()` - Safe write with temp file
- `writeUpdate()` - Write with race protection

### Append Operations (PRESERVE)
- `append()` / `appendSync()` - Add to end of file

### Directory Operations
- `readdir()` / `readdirSync()` - List contents
- `mkdir()` / `mkdirSync()` - Create directory
- `mkdirp()` / `mkdirpSync()` - Create with parents
- `rmdir()` / `rmdirSync()` - Remove directory

### File Operations
- `exists()` / `existsSync()` - Check existence
- `unlinkIfExists()` / `unlinkIfExistsSync()` - Delete file
- `rename()` / `renameSync()` - Rename/move file
- `copyFile()` - Copy file

### Streams
- `createReadStream()` - Read stream
- `createWriteStream()` - Write stream
- `createAppendStream()` - Append stream

## License

MIT License - Created by Guangcong Luo for Pokemon Showdown