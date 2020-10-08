Gen 2
====================

Introduction
------------
Generation 2 includes the games Pokémon Silver, Gold, and Crystal. Stadium 2 may also be counted, but for simulating purposes the mechanics of choice are those of Crystal.
In this metagame we find 251 Pokémon, three of which are banned to Ubers, that have no abilities, basically can only use Leftovers as an item, have poor attacking moves, no coverage, and Rest and Sleep Talk which can use Rest. Therefore we find a very stally meta, for the defense overcomes the offense easily.

EVs and IVs
------------
Since Generation 2 was still a Game Boy game and it's retrocompatible with Generation 1, the Special EV and IV was still used for both Special Attack and Special Defense.
IVs were still called DVs and they ranged from 0 to 15, each giving 2 points to the stat.
The DVs decided the gender, male to female ratio, shinyness, Hidden Power base power and type, and Unown's letter. The EVs could all still be maxed as happened with Stat Experience in Generation 1.

Hidden Power
------------
Hidden Power is an excellent coverage move and it's decided by a Pokémon's DVs.
The type was decided with the following operation:
4 * (atkDV % 4) + (defDV % 4)
Which gives as a number from 0 to 16, giving us the index in the type table to use.
The Hidden Power base power was decided with the following formula:
Math.floor((5 * ((spcDV >> 3) + (2 * (speDV >> 3)) + (4 * (defDV >> 3)) + (8 * (atkDV >> 3))) + (spcDV > 2 ? 3 : spcDV)) / 2 + 31);
The DVs are shifted 3 positions, taking thus the most important byte, thus having no value under 8 DVs and a value on 8 and higher.
The most important DV was attack and special.

Critical Hits
-------------
Critical hits ignore defensive boosts but not defensive drops.

Status
------
Sleep lasts 1-5 turns and the counter is not reset upon switch.
