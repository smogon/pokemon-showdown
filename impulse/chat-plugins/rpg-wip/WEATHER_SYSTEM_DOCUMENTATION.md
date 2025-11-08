# Location Weather System Documentation

## Overview
The RPG system now automatically applies location-based weather to all battles (wild encounters, trainer battles, and scripted battles) initiated in that location.

## Implementation

### Core Function: `getLocationWeather()`
Located in: `commands.ts`

```typescript
function getLocationWeather(player: PlayerData): BattleState['weather'] | undefined
```

This function:
1. Retrieves the player's current location
2. Checks if the location has weather defined
3. Converts location weather format to battle weather format
4. Returns weather configuration or undefined

### Weather Mapping

| Location Weather | Battle Weather | Notes |
|-----------------|----------------|-------|
| `'sun'` | `'sun'` | Harsh sunlight |
| `'rain'` | `'rain'` | Rainy weather |
| `'sandstorm'` | `'sand'` | **Format conversion** |
| `'hail'` | `'hail'` | Hailing weather |
| `'fog'` | `undefined` | **Excluded** per requirements |

### Weather Duration
- **Permanent Location Weather**: 9999 turns
- **Move-Induced Weather**: 5 turns (8 with weather rocks)
- Weather from moves can override location weather
- When move-induced weather expires, the battle continues without weather (doesn't revert to location weather)

## Edge Cases Handled

### 1. No Location Found
**Scenario**: `player.location` doesn't match any key in `LOCATIONS`
```typescript
locationId = toID(player.location); // e.g., "invalidlocation"
LOCATIONS[locationId]; // undefined
```
**Result**: Returns `undefined` ✓
**Battle**: Starts with no weather

### 2. Location Exists But No Weather
**Scenario**: Location object exists but `weather` property is undefined
```typescript
location = { id: "startertown", type: "town", weather: undefined, ... }
```
**Result**: Returns `undefined` ✓
**Battle**: Starts with no weather

### 3. Fog Weather (Excluded)
**Scenario**: Location has fog weather
```typescript
location.weather = 'fog'
```
**Result**: Returns `undefined` ✓
**Reasoning**: Fog is excluded per requirements
**Battle**: Starts with no weather

### 4. Valid Weather
**Scenario**: Location has sun, rain, sandstorm, or hail
```typescript
location.weather = 'rain'
```
**Result**: Returns `{ type: 'rain', turns: 9999 }` ✓
**Battle**: Starts with rain weather

### 5. Sandstorm Format Conversion
**Scenario**: Location uses 'sandstorm' but battle uses 'sand'
```typescript
location.weather = 'sandstorm'
weatherMap['sandstorm'] // returns 'sand'
```
**Result**: Returns `{ type: 'sand', turns: 9999 }` ✓
**Battle**: Starts with sandstorm (internally 'sand')

### 6. Weather Override by Moves
**Scenario**: Battle starts with location weather, then a Pokémon uses Rain Dance
```typescript
// Initial state
battle.weather = { type: 'sun', turns: 9999 }

// After Rain Dance
battle.weather = { type: 'rain', turns: 5 }

// After 5 turns
battle.weather = undefined
```
**Result**: Move weather replaces location weather ✓
**Note**: Weather does NOT revert to location weather after move weather expires

### 7. Null vs Undefined
**Scenario**: TypeScript optional properties can be undefined
```typescript
weather?: string; // Can be undefined, not null
location?.weather // Safe navigation handles both
```
**Result**: Properly handled by optional chaining ✓

## Integration Points

### Wild Pokemon Battles
File: `commands.ts`, function: `wildpokemon`
```typescript
activeBattles.set(user.id, {
    // ... other fields
    weather: getLocationWeather(player), // Applied here
    // ... other fields
});
```

### Scripted Battles
File: `commands.ts`, function: `scriptedbattle`
```typescript
activeBattles.set(user.id, {
    // ... other fields
    weather: getLocationWeather(player), // Applied here
    // ... other fields
});
```

### Trainer Battles
File: `commands.ts`, function: `challenge`
```typescript
activeBattles.set(user.id, {
    // ... other fields
    weather: getLocationWeather(player), // Applied here
    // ... other fields
});
```

## Battle System Compatibility

### Weather Turn Countdown
The battle system decrements weather turns each turn:
```typescript
// In battle-eot.ts
battle.weather.turns--; // 9999 -> 9998 -> 9997...
if (battle.weather.turns <= 0) {
    battle.weather = undefined; // Clear weather
}
```

### Why 9999 Turns?
- Normal weather lasts 5-8 turns
- Battles rarely exceed 100 turns
- 9999 is effectively permanent while avoiding special case handling
- Works seamlessly with existing battle logic

## Weather Effects in Battle

When weather is active, the following effects occur automatically:

### Sun
- Fire moves: 1.5x damage
- Water moves: 0.5x damage
- Abilities like Solar Power, Chlorophyll activate

### Rain
- Water moves: 1.5x damage
- Fire moves: 0.5x damage
- Thunder never misses
- Abilities like Swift Swim, Rain Dish activate

### Sandstorm
- Rock types: 1.5x SpD
- Non-Rock/Steel/Ground types take chip damage each turn
- Abilities like Sand Rush, Sand Force activate

### Hail
- Ice types immune to chip damage
- Other types take chip damage each turn
- Blizzard never misses
- Abilities like Snow Cloak, Ice Body activate

## Example Usage

### Setting Up a Location with Weather
In `locations.ts`:
```typescript
export const LOCATIONS: Record<string, Location> = {
    'desertroute': {
        id: 'desertroute',
        name: 'Desert Route 5',
        type: 'desert',
        description: 'A hot, sandy route with constant sandstorms.',
        weather: 'sandstorm', // This will apply to all battles here
        encounterZones: ['desert_zone'],
        connectedLocations: [
            { id: 'oasistown', name: 'Oasis Town' },
        ],
    },
    'rainyroute': {
        id: 'rainyroute',
        name: 'Rainy Route 3',
        type: 'route',
        description: 'It never stops raining here.',
        weather: 'rain', // Permanent rain
        encounterZones: ['rainy_zone'],
        connectedLocations: [],
    },
};
```

### Testing Weather Application
1. Travel to a location with weather
2. Start any battle (wild/trainer/scripted)
3. Weather automatically applies at turn 0
4. Weather effects activate immediately

## Troubleshooting

### Weather Not Appearing
**Check**:
1. Is `player.location` correctly set?
2. Does the location exist in `LOCATIONS`?
3. Is `weather` property defined on the location?
4. Is the weather value valid (sun/rain/sandstorm/hail)?

### Weather Clearing Too Soon
**Issue**: Weather should last effectively forever
**Solution**: Ensure `turns: 9999` is being set
**Note**: If a Pokémon uses a weather move, it's INTENDED to override location weather

### Fog Not Working
**By Design**: Fog is intentionally excluded per requirements
**Solution**: Use one of the supported weather types instead

## Future Enhancements

Potential improvements (not currently implemented):
1. **Weather Restoration**: After move-induced weather expires, restore location weather
2. **Weather Override Prevention**: Certain locations could have "permanent" weather that can't be changed
3. **Visual Weather Indicators**: Show weather icon in battle UI
4. **Weather-Based Encounters**: Different Pokémon appear in different weather
5. **Weather Transitions**: Smooth weather changes between locations

## Technical Notes

### Type Safety
The function is fully type-safe:
```typescript
function getLocationWeather(player: PlayerData): BattleState['weather'] | undefined
```
- Returns exact type expected by `BattleState`
- Compiler ensures compatibility

### Performance
- O(1) lookup in `LOCATIONS` object
- O(1) lookup in `weatherMap` object
- No performance impact on battle initialization

### Memory
- No additional memory allocated
- Weather config reuses existing battle state structure

## Testing Checklist

- [ ] Battle in location with no weather -> No weather in battle
- [ ] Battle in location with sun -> Sun in battle
- [ ] Battle in location with rain -> Rain in battle
- [ ] Battle in location with sandstorm -> Sandstorm in battle
- [ ] Battle in location with hail -> Hail in battle
- [ ] Battle in location with fog -> No weather in battle (excluded)
- [ ] Use Rain Dance in sunny location -> Rain replaces sun
- [ ] Wait for Rain Dance to expire -> Weather clears (doesn't revert)
- [ ] Player in invalid location -> No weather in battle
- [ ] Weather effects activate correctly (damage bonuses, chip damage, etc.)

## Conclusion

The location weather system is fully integrated, handles all edge cases gracefully, and works seamlessly with the existing battle system. Weather enhances the strategic depth of battles while remaining transparent to players who don't care about weather mechanics.
