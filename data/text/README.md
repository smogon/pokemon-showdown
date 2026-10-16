Showdown text
=============

Descriptions mostly by Marty

Text is official where possible - from the most recent game with that text. That means Champions if possible, falling back to SV, etc.

Egg groups are basically never mentioned by name, unfortunately, so egg group names are sourced from way back to Pokédex 3D Pro in Gen 5.

Unofficial in-battle text is usually surrounded by parentheses, but not always.

Translated names and descriptions sourced from PokeAPI/pokeapi commit c0a9bc75af3a455cdfa27dde21e4ec95aedd3f25

Translated battle messages in Champions sourced from projectpokemon/champout commit 0c1141656e1a66ae304ac3ee1e7126a00914d1f2

Translated battle messages from oldgens sourced from abcboy101/poke-corpus commit 9dbc7fdc8bf49042d8ae47a42fed67c94903a4b5

Translation notes
-----------------

`shortDesc` and `StatShortNames` entries need to fit in a dex chart row (teambuilder list).
Moves have extremely low space, so you'll need to account for that.

Approximate limits:
- move `shortDesc`: at most ~55 Latin characters (~27 CJK); ideally ~45 (~25)
- ability and item `shortDesc`: at most ~85 Latin characters (~42 CJK)
- `StatShortNames`: at most 3 Latin letters or 2 CJK characters

Untranslated text
-----------------

Use `null` when a localized string still needs translation. It falls back to the
English text. Empty strings are invalid and cause text loading to fail.

Battle message grammar
----------------------

Battle message placeholders look like `[POKEMON]`, `[MOVE]`, and `[ITEM]`.

Languages can add modifiers using colons:

    [ITEM:definite:accusative]
    [TRAINER:definite:capitalize]
    [POKEMON:de]
    [POKEMON:topic]

Modifiers used by Pokémon's battle text:

- `definite` - prepend the appropriate definite article (English "the")
- `indefinite` - prepend the appropriate indefinite article (English "a" or "an")
- `nominative` - use the nominative case (like English "I")
- `accusative` - use the accusative case (like English "me")
- `singular` - force singular grammatical agreement
- `plural` - force plural grammatical agreement
- `masculine` - force masculine grammatical agreement
- `capitalize` - capitalize the generated grammatical form
- `classified` - use Pokémon's `ItemClassified` form instead of its ordinary item-name form
- `a` - prepend French, Italian, or Spanish `a`/`à`, including contractions or elision
- `de` - prepend French or Spanish `de`, including contractions or elision
- `di` - prepend Italian `di`, including contractions
- `su` - prepend Italian `su`, including contractions
- `e` - prepend Italian `e` or `ed`
- `y` - prepend Spanish `y` or `e`
- `topic` - append the Korean topic particle `은` or `는`
- `object` - append the Korean object particle `을` or `를`
- `subject` - append the Korean subject particle `이` or `가`
- `conjunctive` - append the Korean conjunctive particle `과` or `와`
- `directional` - append the Korean directional particle `으로` or `로`

Modifiers can be in any order.

Text can be inflected with `[INFLECT]`:

    [INFLECT:ITEM:ms=est détruit:fs=est détruite:mp=sont détruits:fp=sont détruites]

The second field names the placeholder to inflect on. The rest are:

- `s=` - show if the placeholder is singular
- `p=` - show if the placeholder is plural
- `ms=` - show if the placeholder is masculine singular
- `mp=` - show if the placeholder is masculine plural
- `fs=` - show if the placeholder is feminine singular
- `fp=` - show if the placeholder is feminine plural

Text grammar
------------

Gender, singular/plural, and classified versions are stored for item and stat names, in languages that use them (Spanish, French, Italian, and German):

    name: "Agua Mística",
    grammar: "fu",
    articleRule: "stressed-a",
    classified: {
        name: "colgante de Agua Mística",
        grammar: "ms",
    },

- The first letter of `grammar` is gender (`m` - masculine, `f` - feminine, or `n` - neuter).
- The second letter is countability (`s` - singular, `p` - plural, or `u` - uncountable).
- `classified` is optional, for item names that change when they need to be counted.
  - Example: `¡Mew ha tirado al suelo el colgante de Agua Mística de Vaporeon!`
- `articleRule: "stressed-a"` is also optional, and is for Spanish feminine words which use "el" instead of "la" because of a stressed initial `a`.
  - Not actually used in any game text; kept around in case someone needs it for something else
