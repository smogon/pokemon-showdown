Generation NEXT!
========================================================================

Manifesto
------------------------------------------------------------------------

The goal of NEXT is to improve the diversity of the OU metagame by only doing
things that could plausibly be done between gens.

Specifically, the core rules of NEXT are:

1. no base stat changes
2. no removing from movepools
3. no removing from ability distribution
4. no typing changes (except on formes)
5. no buffing OU mons, except maybe tiny buffs to mons at the bottom of OU
6. no doing things that make zero sense flavor-wise

What's left is mainly changes to how abilities and moves work, which is
most of what NEXT is about.

A good example is what Game Freak did by giving Ditto the Imposter ability.
This gave a Ditto a role in OU, while still making sense flavor-wise, and
without removing anything it used to have.

A good example of what NEXT changes is Cherrim. We have taken an interesting
idea (ability designed for Sunny Day support) and made it viable in OU.

This approach is in sharp contrast to many mods that do change many things on
NEXT's "don't change" list. The result is a metagame that feels a lot like
a new generation: existing OU threats stay mostly the same, but many new
threats and strategies are introduced.

And yes, we know that "no base stat changes" has been broken in Gen 6. We're
still not doing it, because it's hard to constrain and hard to keep track of.

Recent changes
------------------------------------------------------------------------

A changelog for NEXT is available here:

https://github.com/Zarel/Pokemon-Showdown/commits/master/mods/gennext

Changes
------------------------------------------------------------------------

Generation NEXT currently makes the following changes:

Major changes:

- Stealth Rock now does 1/4 damage against Flying-types, and 1/8 damage against
  everything else. To prevent Volcarona from shooting into Ubers, Quiver Dance
  now grants +1 SpD +1 Spe +1 accuracy.

- Drives will change Genesect's typing immediately after switch-in, to Bug/Ice,
  Bug/Fire, Bug/Electric, or Bug/Water. However, Download will not activate
  unless Genesect holds a Drive.

- Unown gets an item named Strange Orb (select "Stick" in the teambuilder)
  It doubles its SpA, SpD, and Spe, and changes its type to the type of its
  Hidden Power.

- Weather-inducing abilities now last for only 5 turns (or 8 with the right
  item). Weather moves have +1 priority.

- Forecast will make weather moves last forever. Cherrim will make Sunny Day
  last forever. Phione will make Rain Dance last forever. Cryogonal will make
  Hail last forever. Probopass will make Sandstorm last forever.

- Hail is improved:
  - Silver Wind, Ominous Wind, and Avalanche deal 1.5x as much damage in Hail
  - Snow Cloak no longer modifies evasion, but instead decreases damage by 25%
    in Hail (and 12.5% out of Hail)
  - Ice Body has 30% chance of freezing a contact move (and grants passive
    healing out of Hail, too)
  - Thick Fat, Marvel Scale, and Flame Body grant immunity to Hail damage

- Freezing doesn't have a 20% thaw chance. Instead, thawing happens at the end
  of the second turn. Because this new freeze effect is a nerf, Blizzard now
  has a 30% chance of inflicting freeze.

- Every Hidden Ability is released.

- Moves with a charge turn are now a lot more powerful. They remove Protect and
  Substitute before hitting, they always crit (although their base power has
  been adjusted accordingly), they have perfect accuracy, and one other change
  depending on the move:
  - SolarBeam: heal 50% on the charge turn, 80 bp
  - Razor Wind: 100% confusion, 60 bp
  - Skull Bash: +1 Def, +1 SpD, +1 accuracy on the charge turn, 70 bp
  - Sky Attack: 100% -1 Def, 95 bp
  - Freeze Shock: 100% paralysis, 95 bp
  - Ice Burn: 100% burn, 95 bp
  - Bounce: 30% paralysis, 60 bp
  - Fly: 100% -1 Def, 60 bp
  - Dig: 100% -1 Def, 60 bp
  - Dive: 100% -1 Def, 60 bp
  - Shadow Force: 100% Ghost-Curse, 40 bp
  - Sky Drop: 100% -1 Def, 60 bp

- Recharge moves are similarly buffed. They have 100 base power, always crit,
  and they only recharge if they KO. Be careful - in return for a KO, they
  still give the foe a free switch-in _and_ a turn to set up.

- Flower Gift now only boosts Sp. Def, but if Sunny Day is used while Cherrim
  is out, the next switch-in also receives +1 SpD

- Butterfree, Beautifly, Masquerain, Mothim, and Lilligant get an item named
  GossamerWing (select "Stick" in the teambuilder). It makes them take half
  damage from Rock, Ice, and Electric moves, prevents them from taking double
  SR damage, and adds +1 SpA back to Quiver Dance.

- Relic Song switches Meloetta's SpA and Atk EVs, boosts, and certain natures,
  specifically: Modest <-> Adamant, Jolly <-> Timid, other natures are left
  untouched. It's now 60 base power +1 priority, with no secondary.

- Shuckle gets Berry Shell (select "Stick" in the teambuilder), which gives a
  50% boost to Defense and Sp. Def.

- Ambipom gets Sketch as an event move, allowing it to use exactly one move
  not normally in its learnset.

- Echoed Voice now has 80 base power, hits once, and then, 2 turns later,
  hits again for 80 base power. It's like Doom Desire, except it still hits
  that first time.

- Confusion now deals 30 base power damage every attack, but does not stop
  the attack. It now lasts 3-5 turns.

- Parental Bond now deals half damage on both hits, but confers perfect
  accuracy like all multi-hit moves.

- Life Orb now behaves much more consistently as normal recoil. Reckless
  will boost every move if Life Orb is held, and Rock Head will negate Life
  Orb recoil.

- Twister is now a 80 base power Flying move with a 30% confusion chance

- Diancie and Volcanion are released

New mechanic: Signature Pokemon:

- Certain moves have a Signature Pokemon associated with them. A move will
  deal 1.5x its usual damage when used by its Signature Pokemon. Some of these
  moves also receive other changes that apply to all Pokemon using the move -
  those changes are listed in parentheses.

  - Flareon: Fire Fang (20% burn, 30% flinch, 100% accuracy)

  - Walrein: Ice Fang (20% freeze, 30% flinch, 100% accuracy)

  - Luxray: Thunder Fang (20% paralysis, 30% flinch, 100% accuracy)

  - Drapion: Poison Fang (65 base power, 100% toxic poison, 30% flinch)

  - Seviper: Poison Tail (60 base power, 60% toxic poison)

  - Muk: Sludge (60 base power, 100% poison)

  - Weezing: Smog (75 base power, 100% poison, 100% accuracy)

  - Rapidash: Flame Charge (60 base power)

  - Darmanitan: Flame Wheel

  - Eelektross: Spark

  - Kingdra: BubbleBeam (30% -1 Spe)

  - Galvantula: Electroweb (60 base power, 100% accuracy)

  - Skarmory: Steel Wing (60 base power, 100% accuracy, 50% +1 Def)

  - Beautifly: Giga Drain

  - Glaceon: Icy Wind (60 base power, 100% accuracy)

  - Swampert: Mud Shot (60 base power, 100% accuracy)

  - Kyurem: Glaciate (80 base power, 100% accuracy)

  - Octillery: Octazooka (75 base power, 90% accuracy, 100% -1 accuracy)

  - Serperior: Leaf Tornado (75 base power, 90% accuracy, 100% -1 accuracy)

  - Weavile: Ice Shard

  - Sharpedo: Aqua Jet

  - Hitmonchan: Mach Punch

  - Banette: Shadow Sneak

  - Masquerain: Surf (10% -1 Spe)

  - Snorlax: Snore (100 base power)

  - Persian: Slash (60 base power 30% -1 Def)

- Again, note that while the Signature Pokemon will get the 1.5x damage boost,
  all Pokemon will get the other changes to the move listed above.

New mechanic: Intrinsics:

- Pokemon that previously get Levitate are now immune to Ground intrinsically.
  Instead, they get new abilities in addition to their Ground immunity:

  - Unown: Shadow Tag

  - Bronzong: Heatproof

  - Flygon: Compoundeyes, Sand Rush

  - Weezing: Aftermath

  - Eelektross: Poison Heal

  - Claydol: Filter

  - Cryogonal: Ice Body

  - Gengar: Cursed Body

  - Mismagius: Cursed Body

New: Type-specific items:

- Big Root: also acts like Leftovers + Shell Bell for Grass types

- Black Sludge: heals 1/8 per turn for pure Poison types

- Focus Band: always works, but breaks after getting hit once for
  pure Fighting types (so basically it'd be a Sash that stays intact
  after residual damage); does nothing for other pokemon

- Wise Glasses: 1.2x Special damage for pure Psychic types

- Muscle Band: 1.2x Physical damage for pure Fighting types

Minor move changes:

- Parabolic Charge now has 40 base power, but gives -1 SpA, -1 SpD to the
  target and +1 SpA, +1 SpD to the user

- Rock Throw now removes Stealth Rock from the user's side of the field,
  and has 100% accuracy

- Rapid Spin now has 30 base power

- Rock Throw and Rapid Spin remove hazards before fainting from Rocky
  Helmet etc

- All moves' accuracy is rounded up to the nearest multiple of 10%
  (except Jump Kick, which will be rebalanced later)

- Charge Beam and Rock Slide are now 100% accurate

- Blue Flare has 30% burn chance, Fire Blast has 20% burn chance and is
  80% accurate

- Focus Blast has 30% accuracy (use HP Fighting unless you have No Guard)

- Close Combat has been nerfed: it now gives -2 Def, -2 SpD

- Moves that were originally perfect accuracy have their base power increased
  to 90 (this includes Aerial Ace, Disarming Voice, and Aura Sphere, among
  others)

- Scald's damage is no longer affected by weather: instead, it gets 60% burn
  chance in sun

- High Jump Kick now has 100 base power

- Shadow Ball now has 90 base power and 30% -SpD

- Multi-hit moves are now all perfect-accuracy

- Whirlwind and Roar have perfect accuracy

- Silver Wind, Ominous Wind, and AncientPower have a 100% chance of raising
  one of Def/SpA/SpD/Spe at random, rather than a 10% chance of raising every
  stat

- Twineedle has a new base power of 50

- Tri Attack now hits 3 times and has a base power of 30

- Strength now has a 30% chance of raising user's Atk

- Cut and Rock Smash are 50 base power and now have a 100% chance of
  lowering foe's Def

- Drill Peck, Needle Arm, Attack Order, Leaf Blade, and Crabhammers's Base
  Powers are now 100

- Stomp and Steamroller now have 100 Base Power and perfect accuracy to
  reflect their thematic status as counters to Minimize

- Bide is now a +1 priority moves that gives the user Endure (the user
  survives all move damage with at least 1 HP) for its duration. Bide fails
  if the user has 1 HP when it's used, or if the user's last move used was
  Bide.

- Withdraw gives +1 SpD as well as +1 Def

- Muddy Water is now 85 base power and 100% accurate

- Leech Life is now 75 base power

- Sound-based moves are no longer affected by immunities (ghosts can hear
  things)

- Bonemerang and Bone Rush no longer affected by immunities (you can throw
  a bone to hit air), Bone Rush nerfed to 20 base power since it should never
  be viable

- Wing Attack and Power Gem are now like Dual Chop: 40 base power, 2-hit

- Autotomize now gives +3 Speed

- Zoroark gets a significantly wider movepool: It now learns: Ice Beam, Giga
  Drain, Earthquake, Stone Edge, Superpower, X-Scissor

- if Illusion is active, Night Daze now displays as a random non-Status move
  in the copied pokemon's moveset

- Selfdestruct and Explosion are now 200 and 250 base power autocrit moves,
  respectively, and they are both perfect-accuracy

- Acid and Acid Spray aren't affected by immunities

- Protect does not protect Substitutes (with passive healing being more
  common, Sub/Protect stalling could be overpowered) and Substitutes increase
  accuracy against them to 100%

- Dizzy Punch is 90 base power, 50% confusion chance

- Sacred Sword now has 95 base power

- Egg Bomb is now 40 base power autocrit

- Minimize only increases evasion by one stage

- Double Team takes 25% of user's max HP (like Substitute)

Minor learnset changes:

- Azumarill now gets Belly Drum with no incompatibilities

- Mantine gets many new moves: Recover, Whirlwind, Baton Pass, Wish, Soak,
  Lock-On, Acid Spray, Octazooka, Stockpile

- Masquerain gets Surf

- Butterfree, Beautifly, Masquerain, and Mothim get Hurricane

- Roserade gets Sludge

- Meloetta gets Fiery Dance

- Galvantula gets Zap Cannon

- Virizion gets Horn Leech

- Milotic, Scolipede, and Steelix get Coil

- Spinda gets Superpower with no incompatibilities

- Rotom formes learn more things:
  - Rotom-Wash: BubbleBeam
  - Rotom-Fan: Hurricane, Twister
  - Rotom-Frost: Frost Breath
  - Rotom-Heat: Heat Wave
  - Rotom-Mow: Magical Leaf

- Starters get a new ability option
  - Venusaur: Leaf Guard
  - Charizard: Flash Fire
  - Blastoise: Shell Armor
  - Meganium: Harvest
  - Typhlosion: Flame Body
  - Feraligatr: Intimidate
  - Sceptile: Limber
  - Blaziken: Reckless
  - Swampert: Hydration
  - Torterra: Weak Armor
  - Infernape: No Guard
  - Empoleon: Ice Body
  - Serperior: Own Tempo
  - Emboar: Sheer Force
  - Samurott: Technician
  - Chesnaught: Battle Armor
  - Delphox: Magic Guard
  - Greninja: Pickpocket

Minor ability changes:

- Justified now caps base power to 100 against non-Dark foes:
  Musketeers are recommended to use Sacred Sword over Close Combat and
  Surf over Hydro Pump, other pokemon are recommended not to use
  Justified

- Weak Armor reduces incoming move damage by 1/8 of the user's max HP
  and increases the user's Speed for the first hit after switch-in (and
  does not activate again until the next switch-in) instead of its
  previous effect

- Shell Armor and Battle Armor reduce incoming move damage by 1/8 of
  the user's max HP in addition to their crit negation (also, Shell
  Armor is removed when using Shell Smash)

- Magma Armor reduces incoming move damage by 1/8 of the user's max HP,
  provides immunity to Hail and freeze, and provides a one-time immunity
  to Water and Ice, after which it turns into Shell Armor

- Adaptability is now 1.33x to non-STAB moves instead of to STAB moves

- Shadow Tag now lasts only one turn

- Static and Poison Point have a 100% chance of activating

- Speed Boost does not activate on turns Protect, Detect, Endure, etc
  are used

- Telepathy grants Imprison on switch-in

- Compoundeyes and Keen Eye now grant 1.6x accuracy (this replaces Keen
  Eye's previous effect)

- Victory Star grants 1.5x accuracy (but only for the user)

- Solid Rock and Filter now reduce 1/2 damage of SE moves, not 1/4

- Iron Fist now grants a 1.3x boost

- Outrage, Thrash, and Petal Dance don't lock if the user has Own Tempo

- Stench now grants a 40% flinch chance

- Slow Start now only lasts 3 turns instead of 5

- Truant will only activate if a move succeeds (e.g. not if it misses, fails,
  or is Protected against), and will heal the user by 33% during its Truant
  turn

- Clear Body and White Smoke prevents all stat lowering (relevant: the Regis'
  Superpower, Metagross' Hammer Arm, and Torkoal's Overheat)

- Thick Fat grants half damage from Fighting

- Aftermath no longer requires contact, and its damage is buffed to 1/3 of the
  foe's max HP

- Cursed Body works like Afermath now, but instead of dealing damage, it
  causes the foe to be Cursed (like Ghost-type Curse)

- Gluttony allows a Pokemon to use a Berry twice.

- Guts, Quick Feet, and Toxic Boost take half damage from poisoning

- Guts, Quick Feet, and Flare Boost take half damage from burns

- Sand Veil grants 20% damage reduction in sand (this replaces Sand Veil's
  usual effect)

- Water Veil grans 12.5% damage reduction out of rain and 25% damage
  reduction in rain, in addition to its usual effect

- Multiscale decreases damage by 1/3 rather than 1/2 (Sorry, Dragonite,
  this is in return for a usable physical Flying STAB in Aerial Ace)

Minor item changes:

- Zoom Lens now grants 1.6x accuracy

- Wide Lens now grants 1.3x accuracy

Bans:

- The OU banlist (i.e. Pokemon considered Uber) is now:
  - Every Pokemon with over 600 BST except Slaking and Regigigas
  - Deoxys (all formes)
  - Darkrai
  - Shaymin-Sky

- The following clauses are in effect:
  - OHKO Clause
  - Sleep Clause
  - Soul Dew is banned

Specifically, differences from regular OU:

- unbanned: Gengarite, Kangaskhanite, Lucarionite, Blaziken

- banned: Kyurem, Kyurem-Black, Deoxys-Speed, Deoxys-Defense

- There is no Moody Clause or Evasion Clause
