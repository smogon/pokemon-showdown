Pokemon Showdown
========================================================================

Pokemon Showdown is a simulator of Pokemon battles. It currently supports singles battles in Generations 4-5 (HGSS, BW, BW2).

Installing
------------------------------------------------------------------------

Pokemon Showdown requires Node.js and npm (which is installed by default with Node.js since v0.6.3).

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

### Creating an Administrator account for yourself on your server

You have two options to create an Administrator (~) account on your new server.

#### config/usergroups.csv

For most users, the easiest way to become an Administrator will be to create a file named `config/usergroups.csv` containing

````
User,~
````

where `User` is the user that you would like to become an Administrator.

The user account `User` must be registered. If you do not have a registered Pokemon Showdown account, you can create one at http://pokemonshowdown.com/forum/register

#### localsysop setting

Alternatively, if you do not want to use `config/usergroups.csv`, you can use the following method to become an Administrator. In your `config/config.js` file, you can set `exports.localsysop = true` and then any users who join from `127.0.0.1` will automatically become Administrators, even if they are unregistered.

If you are running the Pokemon Showdown server on a remote computer without a desktop environment (such as a VPS), you can still connect from `127.0.0.1` using an SSH tunnel:

````bash
ssh user@example.com -L 3000:127.0.0.1:8000 -N
````

Replace `user` by your user account on the remote computer and replace `example.com` by the host name of the remote computer. Replace `8000` by the port that the server is running on. You can then point your browser to `http://play.pokemonshowdown.com/~~localhost:3000/` and it will connect to `example.com:8000`, but it will consider you to be connecting from `127.0.0.1`, so you will become an Administrator.


Browser support
------------------------------------------------------------------------

Showdown currently supports, in order of preference:

 - Chrome
 - Firefox
 - Safari
 - Chrome/Firefox/Safari for various mobile devices
 - Opera
 - Firefox for Android
 - IE9+

IE8 support can technically be added without too much difficulty, but it doesn't run PS fast enough to be usable.

As for older browsers (Firefox 3.6), I won't go out of my way to support them, but if there's a simple fix, you can suggest it to me and I'll implement it.

License
------------------------------------------------------------------------

Pokemon Showdown's server is distributed under the terms of the [MIT License][1].

  [1]: https://github.com/Zarel/Pokemon-Showdown/blob/master/LICENSE

Credits
------------------------------------------------------------------------

Pokemon Showdown was created by Guangcong Luo [Zarel].

Developers

- Guangcong Luo [Zarel]
- Bill Meltsner [bmelts]
- Cathy J. Fitzpatrick [cathyjf]

Contributors

- [The Immortal]
- [Marty-D]
- Cody Thompson [Rising_Dusk]
