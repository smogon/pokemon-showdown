Pokemon-Showdown-Bot
====================

A chat bot for [Pokémon Showdown][1]. This bot has a number of commands, some helpful and some less so, as well as the capability to mod. It only reacts to basic offences such as flooding/caps/stretching.

  [1]: http://www.pokemonshowdown.com/


Installation
------------

[Click here][4] for an in-depth installation guide, courtesy of Rival Nick. Otherwise, basic instructions follow.

Pokémon Showdown Bot requires [node.js][2] to run.
This bot has not been tested on every `node.js` version possible, but has the same version requirements as [Pokémon Showdown][3]: either v0.6.3 through v0.8.22, or v0.10.2 and up.
Install `node.js` if you don't have it yet, try the last stable version.

Next up is cloning this bot. This can be done in two ways: cloning it via `git` or downloading as ZIP.
Downloading it as ZIP is the easy and lazy way, but is a lot less handy to update than cloning this repository.

To install dependencies, run:

    npm install

Copy `config-example.js` to `config.js` and edit the needed variables.
To change the commands that the bot responds to, edit `commands.js`.

Now, to start the bot, use:

    node main.js

Some information will be shown, and will automatically join the room(s) you specified if no error occurs.

  [2]: http://nodejs.org/
  [3]: https://github.com/Zarel/Pokemon-Showdown
  [4]: https://github.com/RivalNick/PS-Bot/wiki/How-To-set-up-Bot

Development
-----------

Everyone is more than welcome to contribute to the bot.
However, please refrain from adding more example commands.

Credits:
 - TalkTakesTime (Development)
 - Quinella (Development)
 - Rival Nick (Guide)

License
-------

Pokémon Showdown Bot is distributed under the terms of the [MIT License][5].

  [5]: https://github.com/Quinella/Pokemon-Showdown-Bot/blob/master/LICENSE
