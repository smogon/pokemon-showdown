# Translations

This directory contains translated strings for Pokémon Showdown. Each language has its own language-code directory; the `en-template/` directory contains all the strings that can possibly be translated.

Each directory can contain multiple `.ts` files containing translations.

Translatable strings are marked in code with `` TL`text` `` or `` TL("text", "context") ``.

`` TLkey`text` `` can be used to  literal strings marked this way reach the templates. A key that is only ever passed to `TL` through a variable (like a command help line) can be kept in a template by marking it `// DYNAMIC KEY` (in the same place `// NOT USED` goes); the build won't mark it `// NOT USED`.

Keys no longer used in the codebase will stay in the template and a `// NOT USED` comment will be added to the template, without deleting any translations. Deleting an unused key from the template means you want to delete all its translations, which will be done when you call `./build translations --sync`.
