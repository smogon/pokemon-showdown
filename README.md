Showdown
========================================================================

Showdown is a simulator of Pokemon battles. It currently only supports singles battles in Generation 5 (Pokemon Black and Pokemon White).

Installing
------------------------------------------------------------------------

Showdown requires Node.js and npm (which is installed by default with Node.js since v0.6.3).

Run `npm install` to install all necessary dependencies.

Copy `config/config-example.js` into `config/config.js`, and edit as you please.

After this, start Node:

	cd <location of PS>
	node app.js

You can also specify a port:

	node app.js 8000

Visit your server at `http://play.pokemonshowdown.com/~~SERVER:PORT/`

Replace `SERVER` with your server domain or IP, and `PORT` with the server's port. You can leave off `:PORT` if it is 8000 (the default).

Yes, you can test even if you are behind a NAT without port forwarding: `http://play.pokemonshowdown.com/~~localhost/` will connect to your local machine. Some browser setups might prevent this sort of connection, however (NoScript, for instance). If you can't get connecting locally to work in Firefox, try Chrome.

The reason your server is visited through `play.pokemonshowdown.com` is to make it more difficult for servers to see a user's password in any form, by handling logins globally. I realize that you might want your own login server and client hosted outside the `pokemonshowdown.com` domain, and I'll look more deeply into how to facilitate that when we're closer to leaving beta.

Browser support
------------------------------------------------------------------------

Showdown currently supports, in order of preference:

 - Chrome
 - Firefox 4+
 - Safari
 - Safari for iPhone/iPod/iPad
 - Firefox for Android
 - IE9+

The built-in Android browser is not supported because of [socket.io bug 651][1], but will be when that bug is fixed. In the meantime, Firefox for Android works.

IE8 has a few teambuilder issues that will be worked out when I have time.

I haven't looked into Opera much, but support for that is planned as long as it doesn't turn out to be too difficult.

As for older browsers (Firefox 3.6, IE7), I won't go out of my way to support them, but if there's a simple fix, you can suggest it to me and I'll implement it.

  [1]: https://github.com/LearnBoost/socket.io/issues/651
