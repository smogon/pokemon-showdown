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

Visit your server at `http://play.pokemonshowdown.com/~~SERVER:PORT`

Replace `SERVER` with your server domain or IP, and `PORT` with the server's port (default is 8000).

Currently, this workflow works for testing Pokemon Showdown and testing your patches before submitting pull requests, but it ends up with somewhat ugly URLs. I'll make it easier to host your own server in the future, when we're closer to leaving beta.

Browser support
------------------------------------------------------------------------

Showdown currently supports, in order of preference:

 - Chrome
 - Firefox 4+
 - Safari
 - Safari Mobile
 - IE9+

Android is not supported because of [socket.io bug 651][1], but will be when that bug is fixed.

IE8 has a few teambuilder issues that will be worked out when I have time.

I haven't looked into Opera much, but support for that is planned as long as it doesn't turn out to be too difficult.

As for older browsers (Firefox 3.6, IE7), I won't go out of my way to support them, but if there's a simple fix, you can suggest it to me and I'll implement it.

  [1]: https://github.com/LearnBoost/socket.io/issues/651
