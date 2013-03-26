Pokemon Showdown
========================================================================

Pokemon Showdown is a simulator of Pokemon battles. It currently supports singles battles in Generations 4-5 (HGSS, BW, BW2).

This repository contains the files needed to set up your own Pokemon Showdown server. Note that to set up a server, you'll also need a server computer.

You can use your own computer as a server, but for other people to connect to your computer, you'll need to expose a port (default is 8000 but you can choose a different one) to connect to, by setting up any firewalls you might have to allow that port through to you (this sometimes isn't possible on certain internet connections).


Installing
------------------------------------------------------------------------

Pokemon Showdown requires [node.js][1], either v0.6.3 through v0.8.22, or v0.10.2-pre and up. (Unfortunately, v0.10.0 and v0.10.1 of `node.js` both contain [a bug][2] that crashes Pokemon Showdown in some cases, so these versions must be avoided.) Install `node.js` if you don't have it yet, but make sure you install a supported version (inconveniently, the latest "stable" release is v0.10.1, which, as mentioned, does **not** work).

Next, obtain a copy of Pokemon Showdown. If you're reading this outside of GitHub, you've probably already done this. If you're reading this in GitHub, there's a "Clone" button in the top left, or if you're really lazy, there's a "ZIP" download button. I recommend the Clone method - it's more time-consuming to set up, but much easier to update.

Pokemon Showdown is installed and run using a command line. In Mac OS X, open `Terminal` (it's in Utilities). In Windows, open `Command Prompt` (type `cmd` into the Start menu and it should be the first result). Type this into the command line:

    cd LOCATION

Replace `LOCATION` with the location Pokemon Showdown is in (ending up with, for instance, `cd "~/Downloads/Pokemon-Showdown"` or `cd "C:\Users\Bob\Downloads\Pokemon-Showdown\"`).

This will set your command line's location to Pokemon Showdown's folder. You'll have to do this each time you open a command line to run commands for Pokemon Showdown.

To install dependencies, run the command:

    npm install

Copy `config/config-example.js` into `config/config.js`, and edit as you please.

Congratulations, you're done setting up Pokemon Showdown.

Now, to start Pokemon Showdown, run the command:

    node app.js

You can also specify a port:

    node app.js 8000

Visit your server at `http://SERVER-PORT.psim.us`

Replace `SERVER` with your server domain or IP, and `PORT` with the server's port. You can leave off `-PORT` if it is 8000 (the default).

Yes, you can test even if you are behind a NAT without port forwarding: `http://localhost.psim.us` will connect to your local machine. Some browser setups might prevent this sort of connection, however (NoScript, for instance). If you can't get connecting locally to work in Firefox, try Chrome.

The reason your server is visited through `psim.us` is to make it more difficult for servers to see a user's password in any form, by handling logins globally. You can embed this in an `iframe` in your website if the URL is a big deal with you.

If you truly want to host the client yourself, there is [a repository for the Pokemon Showdown Client][3]. It's not recommended for beginners, though.

  [1]: http://nodejs.org/
  [2]: https://github.com/joyent/node/pull/5016
  [3]: https://github.com/Zarel/Pokemon-Showdown-Client


Setting up an Administrator account
------------------------------------------------------------------------

Once your server is up, you probably want to make yourself an Administrator (~) on it.

### config/usergroups.csv

The easiest way to become an Administrator is to create a file named `config/usergroups.csv` containing

    USER,~

Replace `USER` with the username that you would like to become an Administrator.

This username must be registered. If you do not have a registered Pokemon Showdown account, you can create one using [the registration form][3].

Once you're an administrator, you can promote/demote others easily with the `/admin`, `/leader`, `/mod`, etc commands.

  [3]: http://pokemonshowdown.com/forum/register

### localsysop setting

Alternatively, if you do not want to use `config/usergroups.csv`, you can use the following method to become an Administrator. In your `config/config.js` file, you can set `exports.localsysop = true` and then any users who join from `127.0.0.1` will automatically become Administrators, even if they are unregistered.

If you are running Pokemon Showdown on a remote server (such as a VPS), you can still connect from `127.0.0.1` using an SSH tunnel:

    ssh user@example.com -L 3000:127.0.0.1:8000 -N

Replace `user` by your user account on the remote computer and replace `example.com` by the host name of the remote computer. Replace `8000` by the port that the server is running on. You can then point your browser to `http://localhost-3000.psim.us` and it will connect to `example.com:8000`, but it will consider you to be connecting from `127.0.0.1`, so you will become an Administrator.


Browser support
------------------------------------------------------------------------

Pokemon Showdown currently supports, in order of preference:

 - Chrome
 - Firefox
 - Safari
 - Chrome/Firefox/Safari for various mobile devices
 - Opera
 - Firefox for Android
 - IE9+

IE8 support can technically be added without too much difficulty, but it doesn't run PS fast enough to be usable.

As for older browsers (Firefox 3.6), I won't go out of my way to support them, but if there's a simple fix, you can suggest it to me and I'll implement it.


Community
------------------------------------------------------------------------

The Pokemon Showdown development IRC channel is `#showdown` at `irc.synirc.net`.

[The Pokemon Showdown forums][4] are hosted on Smogon Forums.

  [4]: http://www.smogon.com/forums/forumdisplay.php?f=209


License
------------------------------------------------------------------------

Pokemon Showdown's server is distributed under the terms of the [MIT License][5].

  [5]: https://github.com/Zarel/Pokemon-Showdown/blob/master/LICENSE


Credits
------------------------------------------------------------------------

Pokemon Showdown was created by Guangcong Luo [Zarel].

Developers

- Guangcong Luo [Zarel]
- Cathy J. Fitzpatrick [cathyjf]
- Bill Meltsner [bmelts]

Contributors

- [Marty-D]
- [The Immortal]
- [Joim]
- Cody Thompson [Rising_Dusk]
