Showdown
========================================================================

Showdown is a simulator of Pokemon battles. It currently only supports Generation 5 (Pokemon Black and Pokemon White).

Installing
------------------------------------------------------------------------

Showdown requires Node.js (and perhaps also Socket.IO).

Copy `config/config-example.js` into `config/config.js`, and edit as you please.

After this, start Node:

    cd <location of PS>
    node app.js

Visit your server at `http://play.pokemonshowdown.com/?server=SERVER&serverport=PORT`

Replace `SERVER` with your server domain or IP, and `PORT` with the server's port (default is 8000).

Currently, this workflow works for testing Pokemon Showdown and testing your patches before submitting pull requests, but I wouldn't recommend running a production server this way. I'll make it easier to host your own server in the future.
