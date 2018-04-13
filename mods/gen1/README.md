Gen 1, the beginning
====================

Introduction
------------
Generation 1 includes the original japanese Green and Red, Blue, and Yellow games.
It was very different than the game we get to know today, and it was, in fact, very different to Gen 2 as well.
The mechanics were very different, and the game was quite glitched, but most glitches were important parts of the metagame.
There were only 151 Pokémon plus Missingno, just a handful of moves, no abilities, no items, all stats were
EVd to the max and we had some kind of different IVs, which maxed at 15 and every point gave 2 to the stat, so in
a similar fashion, Pokes used to have 30 IVs on each stat.

The following sources have been used and extremly useful when developing this mod:
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

TODO. Glitches not implemented
------------------------------
There are a couple of divisions by zero in the original game in the cartridge. Those have not been implemented.
