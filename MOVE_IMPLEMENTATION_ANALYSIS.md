# RPG-WIP Battle Simulator - Move Implementation Analysis and Implementation Plan

## Executive Summary

This document provides a comprehensive analysis of move implementations in the RPG-WIP battle simulator, identifying which moves are working correctly, which need fixes, and which are not yet implemented. The analysis covers all files in the `impulse/chat-plugins/rpg-wip/` directory.

## Architecture Overview

The battle simulator uses a hybrid approach:
1. **Dex Moves**: Base move data from Pokémon Showdown's Dex (`sim/dex`)
2. **Hardcoded Move Logic**: Custom implementations in `battle-*.ts` files
3. **Generic Handlers**: System handlers for common move patterns

## Key Files

- `battle-moves.ts`: Core move implementations (1960+ lines)
- `battle-core.ts`: Damage calculation, type effectiveness (2111+ lines)
- `battle-flow.ts`: Turn processing, action queue, move execution (1366+ lines)
- `battle-eot.ts`: End-of-turn effects (600+ lines)
- `utils.ts`: Helper functions including `getMove()`
- `abilities.ts`: Ability interactions with moves

## Move Categories Analysis

### ✅ Fully Implemented & Working (Estimated: 150-200 moves)

#### Power-Varying Damaging Moves (in `getDamageBasePower`)
- **HP-Based**: Reversal, Flail, Eruption, Waterspout, Wring Out, Crush Grip
- **Weight-Based**: Grass Knot, Low Kick, Heavy Slam, Heat Crash
- **Speed-Based**: Gyro Ball, Electro Ball
- **Stat-Based**: Stored Power, Power Trip, Punishment
- **Item-Based**: Acrobatics, Knock Off, Trump Card
- **Status-Based**: Facade, Brine, Venoshock, Hex, Wake-Up Slap, Smelling Salts, Barb Barrage, Infernal Parade
- **Weather-Based**: Weather Ball, Solar Beam, Solar Blade
- **Terrain-Based**: Terrain Pulse, Rising Voltage, Expanding Force, Psyblade, Misty Explosion
- **Random**: Present, Magnitude
- **Special**: Spitup (Stockpile-based)

#### Special Damaging Moves (in `handleDamagingMovePreamble`)
- **Priority Checks**: Sucker Punch
- **Turn Checks**: Fake Out, First Impression
- **Requirement Checks**: Last Resort, Belch, Poltergeist, Synchronoise, Burn Up, Double Shock, Dream Eater
- **Screen Breaking**: Brick Break, Psychic Fangs, Raging Bull
- **Fixed Damage**: Final Gambit, Endeavor, Super Fang, Dragon Rage, Sonic Boom, Seismic Toss, Night Shade, Psywave
- **Delayed**: Future Sight, Doom Desire
- **Counter**: Counter, Mirror Coat
- **Item-Based**: Fling, Natural Gift
- **Terrain**: Steel Roller
- **OHKO**: Fissure, Sheer Cold, Guillotine, Horn Drill

#### Status Moves (in `handleSpecificStatusMove`)
- **Force Switch**: Roar, Whirlwind
- **Field Control**: Defog, Haze, Court Change
- **Volatile Status**: Leech Seed, Curse, Nightmare, Substitute, Protect, Detect
- **Redirection**: Follow Me, Rage Powder
- **Stat Manipulation**: Psych Up, Belly Drum, Stockpile, Swallow
- **Item Manipulation**: Trick, Switcheroo, Bestow
- **Copying**: Transform
- **Team Support**: Helping Hand, Flower Shield, Rototiller, Teatime
- **Healing**: Heal Bell, Aromatherapy, Rest, Wish, Roost, Synthesis, Moonlight, Morning Sun, Shore Up, Pain Split
- **Special**: Charge, Perish Song, Memento, Block, Mean Look, Spider Web

#### Generic System Implementations (working for 100+ moves)
- Stat boost moves (Swords Dance, Dragon Dance, etc.)
- Status inflict moves (Thunder Wave, Will-O-Wisp, Toxic, etc.)
- Volatile status moves (Confusion, Taunt, Encore, Torment, etc.)
- Heal moves (Recover, Softboiled, Slack Off, etc.)
- Field effects (Weather, Terrain, Rooms, Gravity, etc.)
- Side effects (Hazards, Screens, Guards, Tailwind, etc.)

### ⚠️ Partially Working / Needs Verification (Estimated: 20-30 moves)

#### Charging Moves
- **Status**: Implemented in `handleChargingMove`
- **Working**: Fly, Dig, Dive, Bounce, Shadow Force, Phantom Force, Solar Beam, Solar Blade, Sky Attack, Geomancy
- **Issue**: Edge cases with semi-invulnerable state and specific move interactions
- **Priority**: Medium - Test with Thunder, Hurricane, Earthquake against underground/flying targets

#### Multi-Hit Moves
- **Status**: Basic implementation via `RPGAbilities.getMultiHitCount`
- **Working**: Basic multi-hit (2-5 times)
- **Issue**: Loaded Dice item bonus needs verification
- **Priority**: Low - Verify Loaded Dice increases minimum hits

#### Recoil Moves
- **Status**: Implemented in `applyRecoilAndSelfEffects`
- **Working**: Basic recoil (Take Down, Double-Edge, etc.), Mind Blown, Steel Beam
- **Issue**: Rock Head ability interaction needs verification
- **Priority**: Low - Verify Rock Head prevents recoil

#### Draining Moves
- **Status**: Implemented in `handleDamagingMove`
- **Working**: Drain moves (Giga Drain, Drain Punch, etc.), Big Root boost, Liquid Ooze counter
- **Issue**: Heal Block interaction needs testing
- **Priority**: Low - Already implemented, just needs testing

### ❌ Not Implemented (Estimated: 50-70 moves)

#### Critical Missing Moves (Phase 1 - High Priority)
1. **False Swipe** - Leaves target at 1 HP minimum
   - **Impact**: Essential for catching mechanics in RPG
   - **Implementation**: Add check in damage calculation
   - **Effort**: 1-2 hours

2. **Sleep Talk** - Use random move while asleep
   - **Impact**: Strategic depth, Sleep viability
   - **Implementation**: Add to move execution with `sleepUsable` flag check
   - **Effort**: 2-3 hours

3. **Snore** - Damaging move usable while asleep
   - **Impact**: Similar to Sleep Talk
   - **Implementation**: Same as Sleep Talk
   - **Effort**: 1 hour

4. **Attract** - Infatuation status
   - **Impact**: Status condition variety
   - **Implementation**: Add volatile status for infatuation, add gender checks
   - **Effort**: 3-4 hours

5. **Destiny Bond** - Faint attacker if KO'd
   - **Impact**: Strategic revenge mechanic
   - **Implementation**: Add volatile flag, check on faint
   - **Effort**: 2-3 hours

6. **Grudge** - Deplete PP of move that KO'd
   - **Impact**: PP management strategy
   - **Implementation**: Add volatile flag, PP manipulation on faint
   - **Effort**: 2-3 hours

#### Battle Utility Moves (Phase 2 - Medium Priority)
7. **Power Swap** - Swap Attack/Sp.Atk stat stages
   - **Implementation**: Swap stat stage values
   - **Effort**: 1-2 hours

8. **Guard Swap** - Swap Defense/Sp.Def stat stages
   - **Implementation**: Swap stat stage values
   - **Effort**: 1-2 hours

9. **Speed Swap** - Swap Speed stats
   - **Implementation**: Swap actual Speed stats (not stages)
   - **Effort**: 1-2 hours

10. **Heart Swap** - Swap all stat stages
    - **Implementation**: Swap entire statStages object
    - **Effort**: 1-2 hours

11. **Skill Swap** - Swap abilities
    - **Implementation**: Temporary ability swap
    - **Effort**: 2-3 hours

12. **Role Play** - Copy target's ability
    - **Implementation**: Copy ability value
    - **Effort**: 1-2 hours

13. **Entrainment** - Force ability on target
    - **Implementation**: Replace target ability
    - **Effort**: 1-2 hours

14. **Imprison** - Block shared moves
    - **Implementation**: Add move blocking flag
    - **Effort**: 2-3 hours

15. **Snatch** - Steal beneficial status moves
    - **Implementation**: Redirect status moves
    - **Effort**: 3-4 hours

16. **Spite** - Reduce PP of last used move
    - **Implementation**: PP manipulation
    - **Effort**: 1-2 hours

#### Type/Ability Manipulation (Phase 3 - Medium Priority)
17. **Soak** - Change target to pure Water type
    - **Implementation**: Add temporary type change
    - **Effort**: 2-3 hours

18. **Magic Powder** - Change target to Psychic type
    - **Implementation**: Same as Soak
    - **Effort**: 1-2 hours

19. **Reflect Type** - Copy target's types
    - **Implementation**: Copy type array
    - **Effort**: 1-2 hours

20. **Worry Seed** - Replace ability with Insomnia
    - **Implementation**: Temporary ability override
    - **Effort**: 2-3 hours

21. **Gastro Acid** - Suppress ability
    - **Implementation**: Add ability suppression flag
    - **Effort**: 2-3 hours

22. **Simple Beam** - Change ability to Simple
    - **Implementation**: Temporary ability change
    - **Effort**: 1-2 hours

23. **Foresight** - Remove Ghost immunity to Normal/Fighting
    - **Implementation**: Add volatile flag, modify type effectiveness
    - **Effort**: 2-3 hours

24. **Miracle Eye** - Remove Dark immunity to Psychic
    - **Implementation**: Same as Foresight
    - **Effort**: 1-2 hours

#### Complex Mechanics (Phase 4 - Lower Priority)
25. **Beat Up** - Hit once per party member
    - **Implementation**: Multi-hit based on party size
    - **Effort**: 3-4 hours

26. **Triple Kick** - 3 hits with escalating power (10/20/30)
    - **Implementation**: Custom multi-hit with power array
    - **Effort**: 2-3 hours

27. **Triple Axel** - 3 hits with escalating power (20/40/60)
    - **Implementation**: Same as Triple Kick
    - **Effort**: 2-3 hours

28. **Pursuit** - Double power if target switches
    - **Implementation**: Check for switching action
    - **Effort**: 3-4 hours

29. **Fury Cutter** - Power doubles each consecutive hit (up to 160)
    - **Implementation**: Add consecutive counter
    - **Effort**: 2-3 hours

30. **Rollout / Ice Ball** - 5 turns, doubling power (30/60/120/240/480)
    - **Implementation**: Multi-turn counter with power multiplier
    - **Effort**: 3-4 hours

31. **Echoed Voice** - Power increases each turn used consecutively (40→200)
    - **Implementation**: Consecutive use counter
    - **Effort**: 2-3 hours

32. **Rage** - Attack +1 when hit
    - **Implementation**: Add volatile flag, increment on hit
    - **Effort**: 2-3 hours

#### Random/Copy Moves (Phase 5 - Lower Priority)
33. **Metronome** - Use random move
    - **Implementation**: Random move selection from Dex
    - **Effort**: 3-4 hours

34. **Assist** - Use random move from party
    - **Implementation**: Random move from team movesets
    - **Effort**: 2-3 hours

35. **Copycat** - Use opponent's last move
    - **Implementation**: Track last move, execute copy
    - **Effort**: 2-3 hours

36. **Mimic** - Replace this move with target's last move
    - **Implementation**: Moveset modification
    - **Effort**: 3-4 hours

37. **Me First** - Use target's move with 1.5x power
    - **Implementation**: Priority check, power boost
    - **Effort**: 3-4 hours

38. **Nature Power** - Different move based on terrain
    - **Implementation**: Terrain-based move replacement
    - **Effort**: 2-3 hours

39. **Camouflage** - Change type based on terrain
    - **Implementation**: Terrain-based type change
    - **Effort**: 2-3 hours

#### Utility Moves (Phase 6 - Lower Priority)
40. **Heal Pulse** - Heal target by 50%
    - **Implementation**: Target healing (ally or opponent)
    - **Effort**: 1-2 hours

41. **Strength Sap** - Heal by target's Attack, lower Attack
    - **Implementation**: Heal + stat drop combo
    - **Effort**: 2-3 hours

42. **Spectral Thief** - Steal positive stat changes
    - **Implementation**: Copy and reset stat stages
    - **Effort**: 2-3 hours

43. **Topsy-Turvy** - Invert all stat changes
    - **Implementation**: Multiply stat stages by -1
    - **Effort**: 1-2 hours

44. **Acupressure** - Randomly boost stat by 2
    - **Implementation**: Random stat selection
    - **Effort**: 1-2 hours

45. **Pollen Puff** - Damage foe, heal ally
    - **Implementation**: Target-based effect selection
    - **Effort**: 2-3 hours

46. **Lunar Dance** - User faints, heal replacement fully
    - **Implementation**: Faint + heal flag for switch-in
    - **Effort**: 3-4 hours

47. **Healing Wish** - Same as Lunar Dance
    - **Implementation**: Same as Lunar Dance
    - **Effort**: 3-4 hours

#### Advanced/Niche Moves (Phase 7 - Lowest Priority)
48. **Pledge Combos** - Fire/Water/Grass Pledge synergy
    - **Implementation**: Multi-turn combo detection, field effects
    - **Effort**: 6-8 hours

49. **Instruct** - Make ally repeat last move
    - **Implementation**: Force move execution
    - **Effort**: 3-4 hours

50. **After You** - Make target move next
    - **Implementation**: Turn order manipulation
    - **Effort**: 3-4 hours

51. **Quash** - Make target move last
    - **Implementation**: Turn order manipulation
    - **Effort**: 2-3 hours

52. **Power Trick** - Swap Attack and Defense stats
    - **Implementation**: Swap stat values (not stages)
    - **Effort**: 2-3 hours

53. **Recycle** - Restore used item
    - **Implementation**: Track consumed items
    - **Effort**: 2-3 hours

54. **Conversion** - Change to type of first move
    - **Implementation**: Type change based on moveset
    - **Effort**: 2-3 hours

55. **Conversion 2** - Change to resist last move hit by
    - **Implementation**: Type change based on effectiveness
    - **Effort**: 3-4 hours

56. **Purify** - Heal target and cure status
    - **Implementation**: Heal + status cure combo
    - **Effort**: 1-2 hours

57. **Jungle Healing** - Heal and cure party
    - **Implementation**: Party-wide heal
    - **Effort**: 2-3 hours

58. **Round** - Power doubles if ally uses same turn
    - **Implementation**: Ally move detection
    - **Effort**: 2-3 hours

## Summary Statistics

- ✅ **Working Correctly**: ~150-200 moves (via Dex + custom implementations)
- ⚠️ **Partially Working**: ~20-30 moves (need verification/edge case fixes)
- ❌ **Not Implemented**: ~50-70 moves (mostly niche or complex mechanics)
- 🚫 **Intentionally Excluded**: Z-Moves, Dynamax/Max Moves (for RPG balance)

## Estimated Implementation Timeline

### Phase 1: Critical (1-2 weeks)
- False Swipe: 1-2 hours
- Sleep Talk/Snore: 3-4 hours total
- Attract: 3-4 hours
- Destiny Bond: 2-3 hours
- Grudge: 2-3 hours
- **Total: ~15-20 hours**

### Phase 2: Battle Utility (2-3 weeks)
- Stat/Ability swaps: 12-18 hours
- Imprison/Snatch/Spite: 6-9 hours
- **Total: ~18-27 hours**

### Phase 3: Type/Ability Manipulation (1-2 weeks)
- All type changes: 8-12 hours
- Ability manipulation: 6-10 hours
- **Total: ~14-22 hours**

### Phase 4: Complex Mechanics (2-3 weeks)
- Beat Up, Triple Kick/Axel: 7-11 hours
- Pursuit, Fury Cutter: 5-7 hours
- Rollout, Echoed Voice, Rage: 7-9 hours
- **Total: ~19-27 hours**

### Phase 5: Random/Copy (2 weeks)
- Metronome, Assist: 5-7 hours
- Copycat, Mimic, Me First: 8-10 hours
- Nature Power, Camouflage: 4-5 hours
- **Total: ~17-22 hours**

### Phase 6: Utility (1-2 weeks)
- Heal Pulse, Strength Sap: 3-5 hours
- Spectral Thief, Topsy-Turvy: 3-4 hours
- Acupressure, Pollen Puff: 3-4 hours
- Lunar Dance, Healing Wish: 6-8 hours
- **Total: ~15-21 hours**

### Phase 7: Advanced (2-3 weeks)
- Pledge combos: 6-8 hours
- Turn order moves: 8-11 hours
- Misc advanced: 8-12 hours
- **Total: ~22-31 hours**

**Grand Total Estimated Effort**: 120-170 hours

## Recommendations

### Immediate Action Items
1. **Implement False Swipe** - Critical for RPG catching mechanics
2. **Implement Sleep Talk/Snore** - Improve sleep viability
3. **Add comprehensive move tests** - Create test suite for all custom implementations

### Strategic Priorities
1. **Phase 1-2 first** - Covers most competitive battle needs
2. **Phase 3 if type variety needed** - Adds strategic depth
3. **Phase 4-5 for fun factor** - Metronome, random moves add excitement
4. **Phase 6-7 optional** - Nice-to-have but not essential

### Quality Assurance
1. **Test all charging moves** - Semi-invulnerable state edge cases
2. **Verify multi-hit mechanics** - Loaded Dice, Parental Bond, etc.
3. **Test all OHKO moves** - Sturdy, level checks
4. **Verify all force-switch moves** - Roar, Dragon Tail, etc.
5. **Test all screen-breaking moves** - Brick Break, Psychic Fangs, etc.

### Documentation
1. **Document intentionally excluded moves** - Z-Moves, Dynamax for clarity
2. **Create move compatibility matrix** - Which moves work in RPG mode
3. **Add developer comments** - Explain complex implementations

## Implementation Order (Sorted by Priority)

### Tier 1: Must-Have (Weeks 1-2)
1. False Swipe
2. Sleep Talk
3. Snore
4. Attract
5. Destiny Bond
6. Grudge

### Tier 2: Should-Have (Weeks 3-5)
7. Power Swap
8. Guard Swap
9. Speed Swap
10. Heart Swap
11. Skill Swap
12. Role Play
13. Entrainment
14. Imprison
15. Snatch
16. Spite

### Tier 3: Nice-to-Have (Weeks 6-8)
17. Soak
18. Magic Powder
19. Reflect Type
20. Worry Seed
21. Gastro Acid
22. Simple Beam
23. Foresight
24. Miracle Eye

### Tier 4: Optional (Weeks 9-11)
25-32. Complex mechanics (Beat Up, Triple Kick, Pursuit, etc.)

### Tier 5: Enhancement (Weeks 12-14)
33-39. Random/Copy moves (Metronome, Assist, etc.)

### Tier 6: Polish (Weeks 15-16)
40-47. Utility moves (Heal Pulse, Strength Sap, etc.)

### Tier 7: Advanced (Weeks 17-19)
48-58. Advanced/Niche moves (Pledge combos, etc.)

## Notes for Developers

1. **Architecture is Solid**: Generic handlers make most moves work automatically
2. **Dex Integration**: Base data for ALL moves exists, just need custom logic
3. **Testing is Key**: Many implementations exist but need verification
4. **Balance Consideration**: Some moves (Z-Moves, Dynamax) excluded intentionally
5. **RPG Focus**: Prioritize moves that enhance RPG experience (False Swipe, catching)

## Conclusion

The RPG-WIP battle simulator has a strong foundation with ~150-200 moves working correctly through a combination of Dex data and custom implementations. The remaining ~50-70 unimplemented moves represent opportunities for enhancement rather than critical gaps. Following this phased implementation plan will systematically improve battle depth while maintaining code quality and system stability.
