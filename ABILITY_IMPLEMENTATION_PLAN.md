# Ability Implementation Plan for RPG-WIP

## Summary
- **Total Abilities Requested**: 314
- **Already Implemented**: 187 (59.6%)
- **Not Implemented**: 127 (40.4%)

## Analysis Results

### Implemented Abilities (187)
Adaptability, Aerilate, Aftermath, Air Lock, Analytic, Anger Point, Arena Trap, Armor Tail, Aroma Veil, Battle Armor, Beast Boost, Berserk, Big Pecks, Blaze, Bulletproof, Chilling Neigh, Chlorophyll, Clear Body, Cloud Nine, Comatose, Competitive, Compound Eyes, Contrary, Cursed Body, Cute Charm, Damp, Dazzling, Defiant, Disguise, Download, Drizzle, Drought, Dry Skin, Effect Spore, Electric Surge, Emergency Exit, Filter, Flame Body, Flash Fire, Flower Gift, Flower Veil, Fluffy, Forecast, Frisk, Full Metal Body, Fur Coat, Gale Wings, Galvanize, Good as Gold, Gooey, Gorilla Tactics, Grassy Surge, Grim Neigh, Guts, Heatproof, Huge Power, Hustle, Hydration, Hyper Cutter, Ice Body, Ice Scales, Immunity, Imposter, Infiltrator, Inner Focus, Insomnia, Intimidate, Iron Barbs, Iron Fist, Justified, Keen Eye, Klutz, Levitate, Lightning Rod, Limber, Long Reach, Magic Guard, Magma Armor, Magnet Pull, Marvel Scale, Mega Launcher, Minus, Misty Surge, Mold Breaker, Moody, Motor Drive, Moxie, Multiscale, Multitype, Natural Cure, Neutralizing Gas, Normalize, Oblivious, Overcoat, Overgrow, Own Tempo, Parental Bond, Pastel Veil, Pixilate, Poison Heal, Poison Point, Poison Touch, Prankster, Pressure, Prism Armor, Propeller Tail, Psychic Surge, Punk Rock, Pure Power, Purifying Salt, Queenly Majesty, Quick Feet, Rain Dish, Rattled, Reckless, Refrigerate, Regenerator, Rivalry, Rock Head, Rough Skin, Sand Force, Sand Rush, Sand Stream, Sand Veil, Sap Sipper, Schooling, Serene Grace, Shadow Shield, Shadow Tag, Shed Skin, Sheer Force, Shell Armor, Shield Dust, Shields Down, Simple, Skill Link, Slow Start, Slush Rush, Sniper, Snow Cloak, Snow Warning, Solar Power, Solid Rock, Soul-Heart, Soundproof, Speed Boost, Stall, Stalwart, Stamina, Stance Change, Static, Steadfast, Steelworker, Sticky Hold, Storm Drain, Strong Jaw, Sturdy, Suction Cups, Super Luck, Surge Surfer, Swarm, Sweet Veil, Swift Swim, Synchronize, Tangled Feet, Tangling Hair, Technician, Telepathy, Teravolt, Thick Fat, Tinted Lens, Torrent, Tough Claws, Trace, Triage, Truant, Turboblaze, Unaware, Unburden, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, Weak Armor, White Smoke, Wimp Out, Wonder Guard

### Not Implemented Abilities (127)
Anger Shell, Anticipation, As One (Glastrier), As One (Spectrier), Aura Break, Bad Dreams, Ball Fetch, Battery, Battle Bond, Beads of Ruin, Cheek Pouch, Color Change, Commander, Corrosion, Costar, Cotton Down, Cud Chew, Curious Medicine, Dancer, Dark Aura, Dauntless Shield, Defeatist, Delta Stream, Desolate Land, Dragon's Maw, Early Bird, Earth Eater, Electromorphosis, Embody Aspect (Cornerstone), Embody Aspect (Hearthflame), Embody Aspect (Teal), Embody Aspect (Wellspring), Fairy Aura, Flare Boost, Forewarn, Friend Guard, Gluttony, Grass Pelt, Guard Dog, Gulp Missile, Hadron Engine, Harvest, Healer, Heavy Metal, Honey Gather, Hospitality, Hunger Switch, Ice Face, Illuminate, Illusion, Innards Out, Intrepid Sword, Leaf Guard, Libero, Light Metal, Lingering Aroma, Liquid Ooze, Liquid Voice, Magic Bounce, Magician, Merciless, Mimicry, Mind's Eye, Mirror Armor, Mountaineer, Mummy, Mycelium Might, Neuroforce, No Ability, No Guard, Opportunist, Orichalcum Pulse, Perish Body, Persistent, Pickpocket, Pickup, Plus, Poison Puppeteer, Power Construct, Power Spot, Power of Alchemy, Primordial Sea, Protean, Protosynthesis, Quark Drive, Quick Draw, RKS System, Rebound, Receiver, Ripen, Rocky Payload, Run Away, Sand Spit, Scrappy, Screen Cleaner, Seed Sower, Sharpness, Stakeout, Steam Engine, Steely Spirit, Stench, Supersweet Syrup, Supreme Overlord, Sword of Ruin, Symbiosis, Tablets of Ruin, Tera Shell, Tera Shift, Teraform Zero, Thermal Exchange, Toxic Boost, Toxic Chain, Toxic Debris, Transistor, Unnerve, Unseen Fist, Vessel of Ruin, Victory Star, Wandering Spirit, Water Bubble, Water Compaction, Well-Baked Body, Wind Power, Wind Rider, Wonder Skin, Zen Mode, Zero to Hero

## Implementation Plan (Organized by Complexity)

### Phase 1: Simple Immunity/Prevention Abilities (10 abilities)
**Complexity: Low** - Simple flag checks or basic prevention logic

1. **No Guard** - Makes all moves used by and against the Pokémon always hit (bypass accuracy checks)
2. **No Ability** - Placeholder ability with no effect
3. **Run Away** - Guarantees escape from wild battles (RPG-only feature)
4. **Illuminate** - Increases wild encounter rate (RPG-only feature)
5. **Honey Gather** - May gather Honey after battle (post-battle only)
6. **Stench** - 10% chance to make target flinch when dealing damage
7. **Pickpocket** - Steals item from attacker when hit by contact move
8. **Pickup** - May pick up items after battle (post-battle only)
9. **Leaf Guard** - Prevents status conditions in harsh sunlight
10. **Unnerve** - Prevents opponents from eating berries

**Implementation Location**: Primarily `abilities.ts` with minor hooks in `battle-core.ts`

### Phase 2: Simple Damage/Power Modifiers (12 abilities)
**Complexity: Low-Medium** - Direct multipliers to damage or power calculations

11. **Heavy Metal** - Doubles weight for weight-based moves
12. **Light Metal** - Halves weight for weight-based moves
13. **Neuroforce** - 1.25x damage multiplier on super effective hits
14. **Transistor** - 1.5x power for Electric-type moves
15. **Dragon's Maw** - 1.5x power for Dragon-type moves
16. **Rocky Payload** - 1.5x power for Rock-type moves
17. **Sharpness** - 1.5x power for slicing moves (moves with "slice", "cut", "claw", etc.)
18. **Toxic Boost** - 1.5x Attack when poisoned
19. **Flare Boost** - 1.5x Sp. Atk when burned
20. **Merciless** - Moves always critical hit against poisoned targets
21. **Steely Spirit** - 1.5x power for Steel moves (applies to allies too in doubles)
22. **Liquid Ooze** - Damages opponents that try to drain HP

**Implementation Location**: `POWER_MODIFIER_ABILITIES` and `STAT_MODIFIER_ABILITIES` in `abilities.ts`

### Phase 3: Simple Stat Boost/Drop Abilities (15 abilities)
**Complexity: Medium** - Trigger stat changes under specific conditions

23. **Defeatist** - Halves Attack and Sp. Atk when HP is below 50%
24. **Dauntless Shield** - Raises Defense by 1 stage on switch-in
25. **Intrepid Sword** - Raises Attack by 1 stage on switch-in
26. **Rattled** - Raises Speed by 1 stage when hit by Bug, Ghost, or Dark-type move
27. **Anger Point** - Maximizes Attack stat when hit by a critical hit
28. **Anger Shell** - When HP drops below 50%, lowers Defense and Sp. Def, raises Atk, Sp. Atk, and Speed
29. **Guard Dog** - Raises Attack when intimidated; prevents being forced to switch out
30. **Opportunist** - Copies opponent's stat boosts when they occur
31. **Grass Pelt** - 1.5x Defense modifier in Grassy Terrain
32. **Plus** - 1.5x Sp. Atk if ally has Minus or Plus ability
33. **Battery** - Boosts allies' Special move power by 1.3x
34. **Power Spot** - Boosts allies' move power by 1.3x
35. **Friend Guard** - Reduces damage taken by allies by 25%
36. **Ripen** - Doubles the effect of berries eaten
37. **Victory Star** - Raises accuracy of user and allies by 10%

**Implementation Location**: `STAT_MODIFIER_ABILITIES`, switch-in handlers, and damage modifiers in `abilities.ts`

### Phase 4: Weather/Terrain Abilities (10 abilities)
**Complexity: Medium** - Interact with or create weather/terrain conditions

38. **Delta Stream** - Creates strong winds weather (negates Flying-type weaknesses to Rock, Electric, Ice)
39. **Desolate Land** - Creates harsh sunlight that prevents Water-type moves entirely
40. **Primordial Sea** - Creates heavy rain that prevents Fire-type moves entirely
41. **Hadron Engine** - Sets Electric Terrain on entry; 1.3x Sp. Atk in Electric Terrain
42. **Orichalcum Pulse** - Sets harsh sunlight on entry; 1.3x Attack in harsh sunlight
43. **Screen Cleaner** - Removes Light Screen, Reflect, and Aurora Veil on switch-in
44. **Seed Sower** - Creates Grassy Terrain when hit by an attack
45. **Mimicry** - Changes type based on active terrain
46. **Sand Spit** - Creates sandstorm when hit by an attack
47. **Ice Face** - Blocks first physical hit in hail/snow; changes form after hit

**Implementation Location**: `WEATHER_ABILITIES`, `TERRAIN_ABILITIES`, and switch-in handlers in `abilities.ts`

### Phase 5: Contact/Damage Response Abilities (12 abilities)
**Complexity: Medium-High** - Trigger effects when hit or when making contact

48. **Mummy** - Changes attacker's ability to Mummy when hit by contact move
49. **Wandering Spirit** - Swaps abilities with attacker when hit by contact move
50. **Lingering Aroma** - Changes attacker's ability to Lingering Aroma when hit by contact move
51. **Perish Body** - Both user and attacker begin to perish (faint in 3 turns) when hit by contact
52. **Innards Out** - Deals damage equal to HP lost when fainting
53. **Aftermath** - Deals 25% of attacker's max HP when fainting from contact move
54. **Cotton Down** - Lowers Speed of all other Pokémon by 1 stage when hit
55. **Water Compaction** - Raises Defense by 2 stages when hit by Water-type move
56. **Stamina** - Raises Defense by 1 stage each time it's hit
57. **Weak Armor** - Lowers Defense, raises Speed by 2 stages when hit by physical move
58. **Berserk** - Raises Sp. Atk when HP drops below 50% from an attack
59. **Thermal Exchange** - Raises Attack when hit by Fire-type move; prevents burn

**Implementation Location**: `CONTACT_ABILITIES` and on-damage handlers in `abilities.ts` and `battle-core.ts`

### Phase 6: Turn-Based/End-of-Turn Abilities (8 abilities)
**Complexity: Medium** - Trigger at end of turn or specific timing

60. **Bad Dreams** - Deals 1/8 max HP damage to sleeping opponents each turn
61. **Harvest** - 50% chance to restore eaten berry at end of turn (100% in harsh sunlight)
62. **Healer** - 30% chance to cure ally's status condition at end of turn
63. **Cheek Pouch** - Restores 1/3 HP when eating a berry
64. **Gluttony** - Eats HP-restoring berries at 50% HP instead of 25%
65. **Cud Chew** - Allows eating a berry twice (restored at end of turn after eating)
66. **Early Bird** - Reduces sleep duration by half
67. **Ball Fetch** - Retrieves first failed Poké Ball (RPG-specific mechanic)

**Implementation Location**: `END_OF_TURN_ABILITIES` in `abilities.ts` and `battle-eot.ts`

### Phase 7: Move/Type Modification Abilities (10 abilities)
**Complexity: Medium-High** - Change move properties or user's type

68. **Liquid Voice** - All sound-based moves become Water-type
69. **Scrappy** - Normal and Fighting-type moves can hit Ghost-type Pokémon
70. **Protean** - Changes user's type to match the type of move being used (before move)
71. **Libero** - Changes user's type to match the type of move being used (before move)
72. **Dancer** - Automatically uses any dance move used by another Pokémon
73. **Poison Puppeteer** - Poisoned targets become confused when poisoned by this Pokémon
74. **Toxic Chain** - 30% chance to badly poison target with damaging moves
75. **Toxic Debris** - Sets Toxic Spikes on user's side when hit by physical move (once per battle)
76. **Electromorphosis** - Gains Charge status when hit by any attack
77. **Wind Power** - Gains Charge status when hit by wind move

**Implementation Location**: `TYPE_MODIFIER_ABILITIES`, move execution in `abilities.ts` and `battle-flow.ts`

### Phase 8: Immunity/Absorption Abilities (8 abilities)
**Complexity: Medium** - Grant immunity and sometimes heal or boost stats

78. **Earth Eater** - Immune to Ground-type moves; restores 1/4 HP when hit by Ground move
79. **Well-Baked Body** - Immune to Fire-type moves; raises Defense by 2 stages when hit by Fire move
80. **Wind Rider** - Immune to wind moves; raises Attack by 1 stage when targeted by wind move
81. **Water Bubble** - Halves Fire damage taken, doubles Water move power, prevents burn
82. **Corrosion** - Can poison Steel and Poison-type Pokémon
83. **Unseen Fist** - Contact moves bypass protection (Protect, Detect, etc.)
84. **Mountaineer** - Immune to Ground-type moves (like Levitate)
85. **Symbiosis** - Passes held item to ally when ally uses its item

**Implementation Location**: `IMMUNITY_ABILITIES` and special handlers in `abilities.ts`

### Phase 9: Ability Copying/Information Abilities (7 abilities)
**Complexity: Medium-High** - Copy or reveal information about opponent

86. **Power of Alchemy** - Copies ally's ability when ally faints
87. **Receiver** - Copies ally's ability when ally faints (same as Power of Alchemy)
88. **Illusion** - Takes appearance of last party member until hit
89. **Anticipation** - Warns if opponent has super-effective or OHKO move
90. **Forewarn** - Reveals opponent's strongest move on entry
91. **Magician** - Steals target's held item when hitting with a move
92. **Mirror Armor** - Reflects stat-lowering effects back to the attacker

**Implementation Location**: Switch-in handlers and move execution in `abilities.ts` and `battle-flow.ts`

### Phase 10: Complex Form/State Change Abilities (12 abilities)
**Complexity: High** - Change form or state based on complex conditions

93. **Battle Bond** - Greninja transforms into Ash-Greninja after KOing opponent
94. **Zero to Hero** - Palafin transforms into Hero Form when switching out
95. **Power Construct** - Zygarde transforms to Complete Form when HP drops below 50%
96. **Zen Mode** - Darmanitan changes form when HP drops below 50%
97. **Hunger Switch** - Morpeko changes form each turn (Hangry ↔ Full Belly)
98. **Gulp Missile** - Cramorant catches prey with Surf/Dive; releases when hit
99. **Ice Face** - Eiscue's ice face blocks physical hit, breaks and changes form
100. **RKS System** - Changes Silvally's type based on held Memory
101. **Tera Shell** - Takes reduced damage when at full HP (Terapagos-specific)
102. **Tera Shift** - Terapagos transforms at start of battle
103. **Color Change** - Changes type to match the type of move hit by

**Implementation Location**: Form change handlers in `abilities.ts` and `battle-core.ts`

### Phase 11: Ruin & Aura Abilities (9 abilities)
**Complexity: High** - Global stat modifiers and aura effects

104. **Beads of Ruin** - Lowers Sp. Def of all opponents by 25%
105. **Tablets of Ruin** - Lowers Attack of all opponents by 25%
106. **Sword of Ruin** - Lowers Defense of all opponents by 25%
107. **Vessel of Ruin** - Lowers Sp. Atk of all opponents by 25%
108. **Fairy Aura** - 1.33x power for Fairy-type moves used by all Pokémon
109. **Dark Aura** - 1.33x power for Dark-type moves used by all Pokémon
110. **Aura Break** - Reverses Fairy Aura and Dark Aura effects (reduces instead of boosts)
111. **Hospitality** - Restores 1/4 HP of ally on switch-in
112. **Commander** - Tatsugiri is eaten by Dondozo, boosting Dondozo's stats significantly

**Implementation Location**: Global stat modifiers and switch-in handlers in `abilities.ts` and `battle-core.ts`

### Phase 12: Paradox & Modern Complex Abilities (15 abilities)
**Complexity: Very High** - Gen 9 abilities with complex mechanics

113. **Protosynthesis** - Boosts highest stat by 30% in sun or with Booster Energy
114. **Quark Drive** - Boosts highest stat by 30% in Electric Terrain or with Booster Energy
115. **Embody Aspect (Teal)** - Ogerpon-Teal: raises Speed on switch-in
116. **Embody Aspect (Wellspring)** - Ogerpon-Wellspring: raises Sp. Def on switch-in
117. **Embody Aspect (Hearthflame)** - Ogerpon-Hearthflame: raises Attack on switch-in
118. **Embody Aspect (Cornerstone)** - Ogerpon-Cornerstone: raises Defense on switch-in
119. **Costar** - Copies ally's stat changes on switch-in
120. **Supreme Overlord** - 10% damage boost per fainted ally (max 50%)
121. **Mycelium Might** - Status moves are slower but ignore abilities
122. **Curious Medicine** - Resets all stat changes of all Pokémon on switch-in
123. **As One (Glastrier)** - Combines Unnerve and Chilling Neigh
124. **As One (Spectrier)** - Combines Unnerve and Grim Neigh

**Implementation Location**: Complex handlers across multiple files

### Phase 13: Priority/Turn Order Abilities (4 abilities)
**Complexity: Medium-High** - Affect move priority or turn order

125. **Quick Draw** - 30% chance to move first within priority bracket
126. **Stakeout** - Doubles damage to targets that switched in this turn

**Implementation Location**: Priority and damage calculation in `abilities.ts` and `battle-flow.ts`

### Phase 14: Special Mechanics Abilities (7 abilities)
**Complexity: Very High** - Unique mechanics requiring special implementation

127. **Wonder Skin** - Status moves targeting this Pokémon have 50% accuracy
128. **Magic Bounce** - Reflects status moves back to the user
129. **Rebound** - Reflects status moves (similar to Magic Bounce)
130. **Persistent** - Sharply raises Speed when flinched
131. **Steam Engine** - Sharply raises Speed when hit by Fire or Water move
132. **Mind's Eye** - Ignores accuracy/evasion changes; Normal/Fighting hit Ghost
133. **Teraform Zero** - Removes weather and terrain when Terastallized

**Implementation Location**: Move execution and special handlers across multiple files

## Files Structure

### Main Files to Modify
- **abilities.ts** (1,721 lines) - Main ability definitions and handlers
- **battle-core.ts** (52,516 bytes) - Core battle calculations
- **battle-flow.ts** (54,082 bytes) - Battle flow and move execution
- **battle-eot.ts** (22,775 bytes) - End of turn effects
- **battle-moves.ts** (59,556 bytes) - Move-specific interactions
- **battle-shared.ts** (17,737 bytes) - Shared utility functions

### Testing Files
- **test/rpg/** - RPG-specific test suite
- **test/rpg-terrain-abilities.js** - Terrain ability tests

## Implementation Strategy

1. **Start with simplest abilities** (Phase 1) to establish patterns
2. **Build incrementally** - Add abilities in order of complexity
3. **Test frequently** - Run tests after each phase
4. **Reuse existing patterns** - Follow established code structure
5. **Document edge cases** - Note interactions with Mold Breaker, Terastallization, etc.

## Next Steps

1. Begin with Phase 1 abilities (10 simple abilities)
2. Test each ability thoroughly
3. Proceed to Phase 2 and beyond
4. Create/update tests as needed
5. Document any breaking changes or considerations
