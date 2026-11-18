# Translations

This directory contains translated strings for Pokémon Showdown. Each language has its own language-code directory; the `en-template/` directory contains all the strings that can possibly be translated.

Each directory can contain multiple `.ts` files containing translations.

Translatable strings are marked in code with `` TL`text` `` or `` TL("text", "context") ``.

Context maps use `""` for calls without a context (including tagged templates), e.g. `"Type": { "": null, "kind": null }`. Use contexts to distinguish meanings, such as Pokémon types versus general classifications.

Keys no longer used in the codebase will stay in the template and a `// NOT USED` comment will be added to the template, without deleting any translations. Deleting an unused key from the template means you want to delete all its translations, which will be done when you call `./build translations --sync`.

`` TLkey`text` `` can be used to mark TL keys as used, to be passed to `TL(...)` later. If you can't do that for whatever reason, replace `// NOT USED` with `// DYNAMIC KEY`.
