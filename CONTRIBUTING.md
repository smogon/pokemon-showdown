Contributing to Pokémon Showdown
========================================================================

In general, we welcome pull requests that fix bugs.

For feature additions and large projects, please discuss with us at http://psim.us/development first. We'd hate to have to reject a pull request that you spent a long time working on...

If you're looking for inspiration for something to do, the Ideas issue is a good place to look: https://github.com/Zarel/Pokemon-Showdown/issues/2444


License
------------------------------------------------------------------------

Your submitted code should be MIT licensed. The GitHub ToS (and the fact that your fork also contains our LICENSE file) ensures this, so we won't ask when you submit a pull request, but keep this in mind.

For simplicity (mostly to make relicensing easier), client code should be also be MIT licensed. The first time you make a client pull request, we'll ask you to explicitly state that you agree to MIT license it.


Commit standards
------------------------------------------------------------------------

Commits should describe what the code _does_, not how it does it.

In other words:

- BAD: `Change Wonder Guard from onBeforeMove to onTryHit`
- GOOD: `Fix Mold Breaker Wonder Guard interaction`

The details of how you achieve the fix should be left for the second paragraph of the commit message.

If this is not possible because your code does not make any functionality changes, your commit summary should ideally start with the word "Refactor" (or at least it contain it in some way).

Commits should usually start with a verb in imperative mood, such as "Add", "Fix", "Refactor", etc (if the verb is there, it should be imperative, but it doesn't have to be there).

- BAD: `Adding namefilter`
- BAD: `Adds namefilter`
- GOOD: `Add namefilter`

The first line of the commit summary should be under 50 characters long.

The first letter of a commit summary should be capitalized (unless the first word starts with a number or is case-sensitive, e.g. `ls`).

The commit summary should not end in a period.

- BAD: `refactor users to use classes`
- BAD: `Refactor Users to use classes.`
- GOOD: `Refactor Users to use classes`

Your commit summary should make it clear what part of the code you're talking about. For instance, if you're editing the Trivia plugin, you might want to add "Trivia: " to the beginning of your commit summary so it's clear.

- BAD: `Ban Genesect`
- GOOD: `Monotype: Ban Genesect` (notice the uppercase "B")

OPTIONAL: If you make commits to fix commits in your pull request, you can squash/amend them into one commit. This is no longer required now that GitHub supports squash-merging.

- BAD: `Add /lock`, `Fix crash in /lock`, `Fix another crash in /lock` (if these are the same pullreq, they should be the same commit)
- GOOD: `Add /lock`
- GOOD: `Fix crash in /lock`

If you want to have more than one commit in Git master's history after merge (i.e. you want your pull request to be rebase-merged instead of squash-merged), your commits need to all make sense as separate commits, and none of your commits should be just fixing an earlier commit in your pull request (those need to be squashed/amended).

Here is a guide for squashing, if you need help with that: https://redew.github.io/rebaseguide/

If while rebasing, you somehow unintentionally break your pull request, do not close it and make a new one to replace it. Instead, you can ask in the Development chatroom for help on trying to fix it; it can almost always be fixed.


Code standards
------------------------------------------------------------------------

We enforce most of our code standards through `eslint`. Just run `npm test` and it'll tell you if something's wrong.

Looking at your surrounding text is also a way to get a good idea of our coding style.

### Strings

The codebase currently uses a mix of `"` and `'` and `` ` `` for strings.

Our current convention is to use `'` for IDs; `"` for names (i.e. usernames, move names, etc), English text in object literals such as in `data/`, and help entries of chat commands; and `` ` `` for code (i.e. protocol code and HTML) and English text outside of object literals (yes, including strings that don't need interpolation). As far as I know, we don't use strings for anything else, but if you need to use strings in a way that doesn't conform the the above three, ask Zarel in the Development chatroom to decide (and default to `` ` `` in lieu of a decision).

Unfortunately, since this is not a convention the linter can test for (and also because our older string standards predate PS), a lot of existing code is wrong on this, so you can't look at surrounding code to get an idea of what the convention should be. Refer to the above paragraph as the definitive rule.


ES5 and ES6
------------------------------------------------------------------------

In general, use modern features only if they're supported in Node 6 and reasonably performant in the latest version of Node.

- **let, const: ALWAYS** - Supported in Node 4+, good performance.

- **for-of on Arrays: ALWAYS** - Supported in Node 4+, good performance in Node 8+.

- **Array#forEach: NEVER** - Worse performance than `for-of` on Arrays. See `for-of`.

- **for-in on Arrays: NEVER** - Horrible performance, weird bugs due to string keys, poor interaction with Array prototype modification. Everyone tells you never to do it; we're no different. See `for-of`.

- **Map, Set: SOMETIMES** - Much worse write/iteration performance, much better read performance than `Object.create(null)`. Use whatever's faster for your use case.

- **for-in on Objects: SOMETIMES** - `Object.keys` is apparently a lot faster. Use that if you can.

- **for-of on Maps: NEVER** - Poor performance. Use `Map#forEach`.

- **Map#forEach: ALWAYS** - This is our preferred method of iterating `Map`s.

- **Object literal functions: ALWAYS** - Supported in Node 4+, good performance.

- **Arrow functions: ALWAYS** - Supported in Node 4+, good performance. Obviously use only for callbacks; don't use in situations where `this` shouldn't be bound.

- **Promises: ALWAYS** - Supported in Node 4+, poor performance but worth the readability.

- **async/await: ALWAYS** - Supported in Node 8+, good performance.

- **Function#bind: NEVER** - Horrible performance. Use arrow functions.

- **classes and subclasses: ALWAYS** - Supported in Node 4+ and good performance in Node 6+.

- **String#includes: ALWAYS** - Supported in Node 4+, poor performance, but not really noticeable and worth the better readability.

- **Template strings: ALWAYS** - Supported in Node 4+ and good performance in Node 6+; please start refactoring existing code over, but be careful not to use them for IDs (follow the String standards). Look at existing uses for guidance.

Take "good performance" to mean "approximately on par with ES3" and "great performance" to mean "better than ES3".
