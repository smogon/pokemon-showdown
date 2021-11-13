Node.js package
===============

Pokémon Showdown has a Node.js API. It currently only works in Node, not browsers, although we're working on unifying it to work in browsers.

You can install it with the usual:

    npm install pokemon-showdown

And you can use it to do the following things:


Simulating battles
------------------

See: [sim/SIMULATOR.md](./SIMULATOR.md)

Also available as a command-line API!


Validating, generating, and converting teams
--------------------------------------------

See: [sim/TEAMS.md](./TEAMS.md)

Also available as a command-line API!


Getting Pokédex information
---------------------------

See: [sim/DEX.md](./DEX.md)


Undocumented APIs
-----------------

Pokémon Showdown's Node.js package has TypeScript definitions for everything it exports, including a lot of undocumented APIs.

Please be aware that any undocumented API is unstable and should not be relied upon not to change. We do not follow semver for undocumented APIs. If you _really_ want to use an undocumented API, remember to pin the exact PS version in your dependencies. You probably also want to follow the API update channel in the Discord server: https://psim.us/devdiscord
