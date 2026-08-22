Showdown text
=============

Descriptions mostly by Marty

Translated names and descriptions sourced from PokeAPI/pokeapi commit c0a9bc75af3a455cdfa27dde21e4ec95aedd3f25

Translated battle messages in Champions sourced from projectpokemon/champout commit 0c1141656e1a66ae304ac3ee1e7126a00914d1f2

Translated battle messages from oldgens sourced from abcboy101/poke-corpus commit 9dbc7fdc8bf49042d8ae47a42fed67c94903a4b5

Battle message grammar
----------------------

Battle message placeholders look like `[POKEMON]`, `[MOVE]`, and `[ITEM]`.

Languages can add modifiers using colons:

    [ITEM:definite:accusative]
    [TRAINER:definite:capitalize]
    [POKEMON:de]
    [POKEMON:topic]

Modifiers used by Pokémon's battle text:

- `definite` - add the appropriate definite article (English "the")
- `indefinite` - add the appropriate indefinite article (English "a" or "an")
- `nominative` - use the nominative case (like English "I")
- `accusative` - use the accusative case (like English "me")
- `singular` - force singular grammatical agreement
- `plural` - force plural grammatical agreement
- `masculine` - force masculine grammatical agreement
- `capitalize` - capitalize the generated grammatical form
- `classified` - use Pokémon's `ItemClassified` form instead of its ordinary item-name form
- `a` - add French, Italian, or Spanish `a`/`à`, including contractions or elision
- `de` - add French or Spanish `de`, including contractions or elision
- `di` - add Italian `di`, including contractions
- `su` - add Italian `su`, including contractions
- `e` - select Italian `e` or `ed`
- `y` - select Spanish `y` or `e`
- `topic` - add the Korean topic particle `은` or `는`
- `object` - add the Korean object particle `을` or `를`
- `subject` - add the Korean subject particle `이` or `가`
- `conjunctive` - add the Korean conjunctive particle `과` or `와`
- `directional` - add the Korean directional particle `으로` or `로`

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
