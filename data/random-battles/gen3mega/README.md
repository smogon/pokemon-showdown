# Gen 3 Mega Random Battle set dump

This is a human-readable mirror of [`sets.json`](./sets.json). The JSON, the
`gen3mega` mod data, and the random-team generator remain authoritative.

- The pool contains 52 transformations: 50 Megas and 2 Primals.
- Every generated team receives exactly one transformation.
- Every transformation currently has one fixed four-move template and one
  explicit first-pass balance level.
- The Pokémon enters battle as the listed base species holding its required
  stone or orb. Ability lines show the base ability followed by the
  transformed ability.
- EVs, IVs, and nature are derived at runtime from the final moveset, so they
  are intentionally not frozen in this dump.
- `Adjust Level` rules can override the listed default levels.

The entries are grouped by the debut generation of their base species, not by
the mechanical generation tag assigned to the custom transformation data.

## Generation I base species (21)

### Venusaur-Mega — Level 74

- Role: Staller
- Starts as: Venusaur @ Venusaurite
- Ability: Overgrow → Thick Fat
- Transformed typing: Grass / Poison
- Moves: Hidden Power Grass / Leech Seed / Sleep Powder / Sludge Bomb

### Charizard-Mega-X — Level 73

- Role: Wallbreaker
- Starts as: Charizard @ Charizardite X
- Ability: Blaze → Tough Claws
- Transformed typing: Fire / Dragon
- Moves: Brick Break / Dragon Claw / Earthquake / Fire Blast

### Charizard-Mega-Y — Level 73

- Role: Wallbreaker
- Starts as: Charizard @ Charizardite Y
- Ability: Blaze → Drought
- Transformed typing: Fire / Flying
- Moves: Fire Blast / Focus Punch / Hidden Power Grass / Substitute

### Blastoise-Mega — Level 75

- Role: Bulky Attacker
- Starts as: Blastoise @ Blastoisinite
- Ability: Torrent → Mega Launcher
- Transformed typing: Water
- Moves: Hydro Pump / Ice Beam / Rapid Spin / Toxic

### Beedrill-Mega — Level 80

- Role: Setup Sweeper
- Starts as: Beedrill @ Beedrillite
- Ability: Swarm → Adaptability
- Transformed typing: Bug / Poison
- Moves: Brick Break / Hidden Power Bug / Sludge Bomb / Swords Dance

### Pidgeot-Mega — Level 78

- Role: Fast Attacker
- Starts as: Pidgeot @ Pidgeotite
- Ability: Keen Eye → No Guard
- Transformed typing: Normal / Flying
- Moves: Aerial Ace / Double-Edge / Hidden Power Ground / Toxic

### Raichu-Mega-X — Level 75

- Role: Fast Attacker
- Starts as: Raichu @ Raichunite X
- Ability: Static → Static
- Transformed typing: Electric
- Moves: Brick Break / Double-Edge / Hidden Power Ice / Thunderbolt

### Raichu-Mega-Y — Level 75

- Role: Fast Attacker
- Starts as: Raichu @ Raichunite Y
- Ability: Static → No Guard
- Transformed typing: Electric
- Moves: Hidden Power Ice / Substitute / Surf / Thunder

### Clefable-Mega — Level 77

- Role: Bulky Setup
- Starts as: Clefable @ Clefablite
- Ability: Cute Charm → Magic Bounce
- Transformed typing: Normal / Flying
- Moves: Calm Mind / Ice Beam / Soft-Boiled / Thunderbolt

### Alakazam-Mega — Level 69

- Role: Setup Sweeper
- Starts as: Alakazam @ Alakazite
- Ability: Synchronize → Trace
- Transformed typing: Psychic
- Moves: Calm Mind / Fire Punch / Psychic / Recover

### Victreebel-Mega — Level 77

- Role: Bulky Attacker
- Starts as: Victreebel @ Victreebelite
- Ability: Chlorophyll → Innards Out
- Transformed typing: Grass / Poison
- Moves: Giga Drain / Sleep Powder / Sludge Bomb / Synthesis

### Slowbro-Mega — Level 75

- Role: Bulky Setup
- Starts as: Slowbro @ Slowbronite
- Ability: Own Tempo → Shell Armor
- Transformed typing: Water / Psychic
- Moves: Calm Mind / Psychic / Rest / Surf

### Gengar-Mega — Level 67

- Role: Fast Attacker
- Starts as: Gengar @ Gengarite
- Ability: Levitate → Shadow Tag
- Transformed typing: Ghost / Poison
- Moves: Explosion / Ice Punch / Thunderbolt / Will-O-Wisp

### Kangaskhan-Mega — Level 70

- Role: Bulky Attacker
- Starts as: Kangaskhan @ Kangaskhanite
- Ability: Early Bird → Parental Bond
- Transformed typing: Normal
- Moves: Body Slam / Earthquake / Protect / Wish

### Starmie-Mega — Level 66

- Role: Bulky Attacker
- Starts as: Starmie @ Starminite
- Ability: Natural Cure → Huge Power
- Transformed typing: Water / Psychic
- Moves: Double-Edge / Hidden Power Fighting / Recover / Surf

### Pinsir-Mega — Level 72

- Role: Setup Sweeper
- Starts as: Pinsir @ Pinsirite
- Ability: Hyper Cutter → Aerilate
- Transformed typing: Bug / Flying
- Moves: Earthquake / Return / Rock Slide / Swords Dance

### Gyarados-Mega — Level 67

- Role: Setup Sweeper
- Starts as: Gyarados @ Gyaradosite
- Ability: Intimidate → Mold Breaker
- Transformed typing: Water / Dark
- Moves: Double-Edge / Dragon Dance / Earthquake / Hidden Power Rock

### Aerodactyl-Mega — Level 67

- Role: Fast Attacker
- Starts as: Aerodactyl @ Aerodactylite
- Ability: Rock Head → Tough Claws
- Transformed typing: Rock / Flying
- Moves: Aerial Ace / Double-Edge / Earthquake / Rock Slide

### Dragonite-Mega — Level 69

- Role: Wallbreaker
- Starts as: Dragonite @ Dragoninite
- Ability: Inner Focus → Multiscale
- Transformed typing: Dragon / Flying
- Moves: Dragon Claw / Fire Blast / Ice Beam / Thunderbolt

### Mewtwo-Mega-X — Level 62

- Role: Wallbreaker
- Starts as: Mewtwo @ Mewtwonite X
- Ability: Pressure → Steadfast
- Transformed typing: Psychic / Fighting
- Moves: Brick Break / Psychic / Recover / Shadow Ball

### Mewtwo-Mega-Y — Level 62

- Role: Bulky Setup
- Starts as: Mewtwo @ Mewtwonite Y
- Ability: Pressure → Insomnia
- Transformed typing: Psychic
- Moves: Calm Mind / Ice Beam / Psychic / Recover

## Generation II base species (9)

### Meganium-Mega — Level 78

- Role: Staller
- Starts as: Meganium @ Meganiumite
- Ability: Overgrow → Mega Sol
- Transformed typing: Grass
- Moves: Hidden Power Fire / Leech Seed / Solar Beam / Synthesis

### Feraligatr-Mega — Level 74

- Role: Wallbreaker
- Starts as: Feraligatr @ Feraligite
- Ability: Torrent → Dragonize
- Transformed typing: Water / Dragon
- Moves: Earthquake / Hydro Pump / Rock Slide / Swords Dance

### Ampharos-Mega — Level 74

- Role: Bulky Attacker
- Starts as: Ampharos @ Ampharosite
- Ability: Static → Mold Breaker
- Transformed typing: Electric / Dragon
- Moves: Fire Punch / Heal Bell / Hidden Power Ice / Thunderbolt

### Steelix-Mega — Level 75

- Role: Bulky Attacker
- Starts as: Steelix @ Steelixite
- Ability: Rock Head → Sand Force
- Transformed typing: Steel / Ground
- Moves: Earthquake / Explosion / Hidden Power Rock / Roar

### Scizor-Mega — Level 75

- Role: Setup Sweeper
- Starts as: Scizor @ Scizorite
- Ability: Swarm → Technician
- Transformed typing: Bug / Steel
- Moves: Hidden Power Ground / Silver Wind / Steel Wing / Swords Dance

### Heracross-Mega — Level 70

- Role: Setup Sweeper
- Starts as: Heracross @ Heracronite
- Ability: Guts → Skill Link
- Transformed typing: Bug / Fighting
- Moves: Brick Break / Megahorn / Rock Slide / Swords Dance

### Skarmory-Mega — Level 65

- Role: Generalist
- Starts as: Skarmory @ Skarmorite
- Ability: Keen Eye → Stalwart
- Transformed typing: Steel / Flying
- Moves: Drill Peck / Spikes / Steel Wing / Taunt

### Houndoom-Mega — Level 70

- Role: Fast Attacker
- Starts as: Houndoom @ Houndoominite
- Ability: Flash Fire → Solar Power
- Transformed typing: Dark / Fire
- Moves: Crunch / Fire Blast / Solar Beam / Sunny Day

### Tyranitar-Mega — Level 69

- Role: Setup Sweeper
- Starts as: Tyranitar @ Tyranitarite
- Ability: Sand Stream → Sand Stream
- Transformed typing: Rock / Dark
- Moves: Dragon Dance / Earthquake / Hidden Power Flying / Rock Slide

## Generation III base species (20)

### Sceptile-Mega — Level 75

- Role: Fast Attacker
- Starts as: Sceptile @ Sceptilite
- Ability: Overgrow → Lightning Rod
- Transformed typing: Grass / Dragon
- Moves: Dragon Claw / Hidden Power Fire / Leaf Blade / Substitute

### Blaziken-Mega — Level 74

- Role: Setup Sweeper
- Starts as: Blaziken @ Blazikenite
- Ability: Blaze → Speed Boost
- Transformed typing: Fire / Fighting
- Moves: Fire Blast / Rock Slide / Sky Uppercut / Swords Dance

### Swampert-Mega — Level 72

- Role: Bulky Attacker
- Starts as: Swampert @ Swampertite
- Ability: Torrent → Swift Swim
- Transformed typing: Water / Ground
- Moves: Earthquake / Hydro Pump / Ice Beam / Rain Dance

### Gardevoir-Mega — Level 72

- Role: Setup Sweeper
- Starts as: Gardevoir @ Gardevoirite
- Ability: Trace → Trace
- Transformed typing: Psychic
- Moves: Calm Mind / Fire Punch / Psychic / Will-O-Wisp

### Sableye-Mega — Level 81

- Role: Bulky Support
- Starts as: Sableye @ Sablenite
- Ability: Keen Eye → Magic Bounce
- Transformed typing: Dark / Ghost
- Moves: Knock Off / Recover / Seismic Toss / Toxic

### Mawile-Mega — Level 83

- Role: Setup Sweeper
- Starts as: Mawile @ Mawilite
- Ability: Intimidate → Huge Power
- Transformed typing: Steel
- Moves: Brick Break / Hidden Power Steel / Rock Slide / Swords Dance

### Aggron-Mega — Level 78

- Role: Wallbreaker
- Starts as: Aggron @ Aggronite
- Ability: Rock Head → Filter
- Transformed typing: Steel
- Moves: Earthquake / Iron Tail / Rock Slide / Thunder Wave

### Medicham-Mega — Level 71

- Role: Setup Sweeper
- Starts as: Medicham @ Medichamite
- Ability: Pure Power → Pure Power
- Transformed typing: Fighting / Psychic
- Moves: Brick Break / Bulk Up / Recover / Shadow Ball

### Manectric-Mega — Level 75

- Role: Fast Attacker
- Starts as: Manectric @ Manectite
- Ability: Static → Intimidate
- Transformed typing: Electric
- Moves: Crunch / Hidden Power Ice / Thunderbolt / Thunder Wave

### Sharpedo-Mega — Level 77

- Role: Wallbreaker
- Starts as: Sharpedo @ Sharpedonite
- Ability: Rough Skin → Strong Jaw
- Transformed typing: Water / Dark
- Moves: Crunch / Earthquake / Hydro Pump / Ice Beam

### Camerupt-Mega — Level 81

- Role: Wallbreaker
- Starts as: Camerupt @ Cameruptite
- Ability: Magma Armor → Sheer Force
- Transformed typing: Fire / Ground
- Moves: Earthquake / Explosion / Fire Blast / Rock Slide

### Altaria-Mega — Level 77

- Role: Setup Sweeper
- Starts as: Altaria @ Altarianite
- Ability: Natural Cure → Natural Cure
- Transformed typing: Dragon / Flying
- Moves: Dragon Dance / Earthquake / Hidden Power Flying / Rest

### Banette-Mega — Level 80

- Role: Wallbreaker
- Starts as: Banette @ Banettite
- Ability: Insomnia → Prankster
- Transformed typing: Ghost
- Moves: Destiny Bond / Hidden Power Fighting / Shadow Ball / Will-O-Wisp

### Chimecho-Mega — Level 78

- Role: Bulky Setup
- Starts as: Chimecho @ Chimechite
- Ability: Levitate → Levitate
- Transformed typing: Psychic / Steel
- Moves: Calm Mind / Hidden Power Fire / Psychic / Rest

### Absol-Mega — Level 79

- Role: Setup Sweeper
- Starts as: Absol @ Absolite
- Ability: Pressure → Magic Bounce
- Transformed typing: Dark
- Moves: Double-Edge / Hidden Power Fighting / Shadow Ball / Swords Dance

### Glalie-Mega — Level 73

- Role: Wallbreaker
- Starts as: Glalie @ Glalitite
- Ability: Inner Focus → Refrigerate
- Transformed typing: Ice
- Moves: Double-Edge / Earthquake / Explosion / Spikes

### Salamence-Mega — Level 66

- Role: Setup Sweeper
- Starts as: Salamence @ Salamencite
- Ability: Intimidate → Aerilate
- Transformed typing: Dragon / Flying
- Moves: Double-Edge / Dragon Dance / Earthquake / Fire Blast

### Metagross-Mega — Level 68

- Role: Wallbreaker
- Starts as: Metagross @ Metagrossite
- Ability: Clear Body → Tough Claws
- Transformed typing: Steel / Psychic
- Moves: Earthquake / Explosion / Meteor Mash / Rock Slide

### Latias-Mega — Level 70

- Role: Bulky Setup
- Starts as: Latias @ Latiasite
- Ability: Levitate → Levitate
- Transformed typing: Dragon / Psychic
- Moves: Calm Mind / Dragon Claw / Psychic / Recover

### Latios-Mega — Level 70

- Role: Bulky Attacker
- Starts as: Latios @ Latiosite
- Ability: Levitate → Levitate
- Transformed typing: Dragon / Psychic
- Moves: Dragon Claw / Psychic / Recover / Thunderbolt

## Primals (2)

### Kyogre-Primal — Level 62

- Role: Bulky Setup
- Starts as: Kyogre @ Blue Orb
- Ability: Drizzle → Primordial Sea
- Transformed typing: Water
- Moves: Calm Mind / Ice Beam / Surf / Thunder

### Groudon-Primal — Level 64

- Role: Wallbreaker
- Starts as: Groudon @ Red Orb
- Ability: Drought → Desolate Land
- Transformed typing: Ground / Fire
- Moves: Earthquake / Fire Blast / Solar Beam / Swords Dance
