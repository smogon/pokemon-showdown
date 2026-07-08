Gen 1, the beginning
====================

Introduction
------------
Generation 1 includes the original japanese Green and Red, Blue, and Yellow games.
It was very different than the game we get to know today, and it was, in fact, very different to Gen 2 as well.
The mechanics were very different, and the game was quite glitched, but most glitches were important parts of the metagame.
There were only 151 Pokémon plus MissingNo, just a handful of moves, no abilities, no items, all stats were
EVd to the max and we had some kind of different IVs, which maxed at 15 and every point gave 2 to the stat, so in
a similar fashion, Pokes used to have 30 IVs on each stat.

The following sources have been used and extremely useful when developing this mod:
https://raw.github.com/po-devs/pokemon-online/master/bin/database/rby-stuff.txt
https://www.smogon.com/rb/articles/differences
https://www.smogon.com/forums/threads/past-gens-research-thread.3506992/#post-5878612

Special Stat
------------
Back then, there weren't Special Defense and Special Attack stats. It was just "Special", and moves raised and lowered it.
That's why Special walls were so OP in Gen 1.

In order to achieve a similar effect without heavily changing other scripts rather than just the mod, the mod's Pokedex
and the mod's moves have been edited in order to emulate it, making all Pokémon have the old special stat in both SpA and
SpD and making moves raise and lower both SpA and SpD at the same time.

Critical Hits
-------------
Critical hits in Gen 1 work with Speed. The faster you are, the more you crit.
This is the regular critical hit formula:
CH% = BaseSpeed * 100 / 512.
This is the high critical hit moves formula:
CH% = BaseSpeed * 100 / 64.
That means that a Persian with Slash is going to crit. This made the metagame adapt so OU prefers all the faster Pokémon
in the game.

However, if you used Focus Energy, your crit rate was ruined instead of increased, so if you were slower than your
opponent you couldn't crit at all.

Status
------
Freeze never thaws unless hit by a Fire-type attack or by Haze.
Sleep lasts 1-7 turns and you wake up at the end of the turn.

1/256 miss
----------
All moves but Swift and Bide (while on duration, not first hit) have a 1/256 chance to miss.

Partial Trapping Moves
----------------------
Partial trapping moves let either Pokémon switch but target will be unable to move for its duration.

RBY desyncs and Desync Clause Mod
-----------------
These are the mechanics for the Desync Clause Mod:
1. Psywave would never roll a 0.
2. Bide's accumulated damage is not reset if the opponent faints.
3. Thawing before acting makes the thawed Pokémon use the last move selected by its team, even if that Pokémon does not have that move. If that team hasn't selected a move yet, the Pokémon will use a corrupted move with Fissure's animation, 102 base power, ??? type, Special category, and around 31.6% accuracy.
4. The priority of a sleeping/frozen Pokémon would always be the same as the last move used by its team. For example, if a Jynx gets put to sleep while using Counter, its priority will remain -1 for the duration of its sleep or until another move is used by its team. The same happens with Quick Attack, but with higher priority.
5. If Mirror Move copies a trapping move and the opponent switches out, the player would reuse the trapping move from turn zero. Metronome would still fall back to using Metronome.
6. Counter has 2 parts:
    - Counter reacts based on the last move used by the opponent's team. A move counts as used as soon as the message "<Pokémon> used <move>!" appears, even if it fails. So if a Pokémon gets full paralyzed, it doesn't count. For example, if a Chansey gets Ice Beamed by a paralyzed Snorlax, then the next turn it clicks Counter as the Snorlax clicks Body Slam and gets full para'd, Counter will fail.
    - Counter fails if the opponent switches to a sleeping Pokemon that spends a turn sleeping and has Counter as its first move. For example—assume the Cloyster in the back is asleep and has Counter as its first move—if Chansey uses Counter as Snorlax switches into Cloyster, Counter might not fail. But if Snorlax switches into Cloyster, and in the following turn, Chansey clicks Counter as Cloyster spends a turn sleeping, Counter will always fail. This makes it optimal to put Counter in the first slot (we could probably code this into PS).

TODO. Glitches not implemented
------------------------------
There are a couple of divisions by zero in the original game in the cartridge. Those have not been implemented.
