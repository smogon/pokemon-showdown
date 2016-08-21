Contributing to Pokémon Showdown
========================================================================

In general, we welcome pull requests that fix bugs.

For large projects, please discuss with us at http://psim.us/development first. We'd hate to have to reject a pull request that you spent a long time working on...


License
------------------------------------------------------------------------

Your submitted code should be MIT licensed (for simplicity, it should be MIT licensed even if you're submitting client code). The first time you make a pull request, we'll ask you to explicitly state that you agree to MIT license it, just to be safe.

Even if we forget, we'll take the fact that your pull request contains a LICENSE file that says "MIT licensed" as evidence that your submitted code is MIT licensed.


Commit standards
------------------------------------------------------------------------

The first line of the commit summary should be under 50 characters long.

The first letter of a commit summary should be capitalized (unless the first word starts with a number or is case-sensitive, e.g. `ls`).

The commit summary should not end in a period.

- BAD: `refactor users to use classes`
- BAD: `Refactor Users to use classes.`
- GOOD: `Refactor Users to use classes`

If the first word is a verb, it should be in imperative mood (the first word doesn't have to be a verb, but we recommend it).

- BAD: `Adding namefilter`
- BAD: `Adds namefilter`
- GOOD: `Add namefilter`

Your commit summary should make it clear what part of the code you're talking about. For instance, if you're editing the Trivia plugin, you might want to add "Trivia: " to the beginning of your commit summary so it's clear.

- BAD: `Ban Genesect`
- GOOD: `Monotype: Ban Genesect` (notice the uppercase "B")

Do not make commits to fix commits in your pull request. Just squash/amend them into one commit.

- BAD: `Add /lock`, `Fix crash in /lock`, `Fix another crash in /lock` (if these are the same pullreq, they should be the same commit)
- GOOD: `Add /lock`
- GOOD: `Fix crash in /lock`

You may have more than one commit, as long as they make sense as separate commits, and none of your commits are just fixing an earlier commit in your pull request.

Here is a guide for squashing, if you need help with that: https://redew.github.io/rebaseguide/


Code standards
------------------------------------------------------------------------

We enforce most of our code standards through `eslint`. Just run `npm test` and it'll tell you if something's wrong.

Looking at your surrounding text is also a way to get a good idea of our coding style.

In particular:

- Tabs, not spaces (sorry! our more opinionated developers like tabs more)


ES5 and ES6
------------------------------------------------------------------------

In general, use modern features only if they're supported in Node 4 and reasonably performant in the latest version of Node.

- **let, const: ALWAYS** - Supported in Node 4+, good performance.

- **for-of on Arrays: SPARINGLY** - Poor performance. Acceptable outside of inner loops. For inner loops, use `for (let i = 0; i < array.length; i++)`

- **Array#forEach: NEVER** - Worse performance than `for-of` on Arrays. See `for-of`.

- **for-in on Arrays: NEVER** - Horrible performance, weird bugs due to string keys, poor interaction with Array prototype modification. Everyone tells you never to do it; we're no different. See `for-of`.

- **Map, Set: SOMETIMES** - Much worse write/iteration performance, much better read performance than `Object.create(null)`. Use whatever's faster for your use case.

- **for-of on Maps: NEVER** - Poor performance. Use `Map#forEach`.

- **Map#forEach: ALWAYS** - This is our preferred method of iterating `Map`s.

- **Object literal functions: ALWAYS** - Supported in Node 4+, good performance.

- **Arrow functions: ALWAYS** - Supported in Node 4+, good performance. Obviously use only for callbacks; don't use in situations where `this` shouldn't be bound.

- **Promises: ALWAYS** - Supported in Node 4+, great performance.

- **Function#bind: ALMOST NEVER** - Horrible performance. Use arrow functions. Basically, never use outside of the (deprecated) trick we use in battle-engine for split logs.

- **classes and subclasses: ALWAYS** - Supported in Node 4+ and good performance in Node 6+, please start refactoring existing code over.

- **String#includes: ALWAYS** - Supported in Node 4+, poor performance, but not really noticeable and worth the better readability.

- **Template strings: ALWAYS** - Supported in Node 4+ and good performance in Node 6+, please start refactoring existing code over.

Take "good performance" to mean "approximately on par with ES3" and "great performance" to mean "better than ES3".
