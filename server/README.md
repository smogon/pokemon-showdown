Pokémon Showdown Server
========================================================================

This repository contains the files needed to set up your own Pokémon Showdown server. Note that to set up a server, you'll also need a server computer.

You can use your own computer as a server, but for other people to connect to your computer, you'll need to expose a port (default is 8000 but you can choose a different one) to connect to, which sometimes requires [port forwarding][5]. Note that some internet providers don't let you host a server at all, in which case you'll have to rent a VPS to use as a server.


Installing
------------------------------------------------------------------------

    ./pokemon-showdown

(Requires Node.js v16+)

If your distro package manager has an old Node.js version, the simplest way to upgrade is `n` – usually no root necessary:

    npm install --global n
    n latest


Detailed installation instructions
------------------------------------------------------------------------

Pokémon Showdown requires you to have [Node.js][6] installed, v14.x or later.

Next, obtain a copy of Pokémon Showdown. If you're reading this outside of GitHub, you've probably already done this. If you're reading this in GitHub, there's a "Clone or download" button near the top right (it's green). I recommend the "Open in Desktop" method - you need to install GitHub Desktop which is more work than "Download ZIP", but it makes it much easier to update in the long run (it lets you use the `/updateserver` command).

Pokémon Showdown is installed and run using a command line. In Mac OS X, open `Terminal` (it's in Utilities). In Windows, open `Command Prompt` (type `cmd` into the Start menu and it should be the first result). Type this into the command line:

    cd LOCATION

Replace `LOCATION` with the location Pokémon Showdown is in (ending up with, for instance, `cd "~/Downloads/Pokemon-Showdown"` or `cd "C:\Users\Bob\Downloads\Pokemon-Showdown\"`).

This will set your command line's location to Pokémon Showdown's folder. You'll have to do this each time you open a command line to run commands for Pokémon Showdown.

Copy `config/config-example.js` into `config/config.js`, and edit as you please.

If you're on Windows, you may need to link Git's UNIX commands to your `PATH` in order to build Pokémon Showdown. Git provides directions to do so [here](https://github.com/git-for-windows/git/wiki/FAQ#running-without-git-bash).

Congratulations, you're done setting up Pokémon Showdown.

Now, to start Pokémon Showdown, run the command:

    node pokemon-showdown

(If you're not on Windows, we recommend doing `./pokemon-showdown` instead.)

You can also specify a port:

    node pokemon-showdown 8000

Visit your server at `http://SERVER:8000`

Replace `SERVER` with your server domain or IP. Replace `8000` with your port if it's not `8000` (the default port).

Yes, you can test even if you are behind a NAT without port forwarding: `http://localhost:8000` will connect to your local machine. Some browser setups might prevent this sort of connection, however (NoScript, for instance). If you can't get connecting locally to work in Firefox, try Chrome.

You will be redirected to `http://SERVER.insecure.psim.us`, with `SERVER` converted to a format that can be put in a URL (replacing `.` with `-`, `:` with `--`, and `-` with `---`).

The `psim.us` domain is used for shared account logins with PS Main. The `insecure.psim.us` subdomain is for servers missing a HTTPS certificate (which you won't have unless you have a domain and manually set that up).

If the URL is a big deal for you, our `psim.us` site may be embedded in an `iframe` in your website. Alternatively, if you truly want to host the client yourself, there is [a repository for the Pokémon Showdown Client][7]. It's not recommended for beginners, though.

  [6]: https://nodejs.org/
  [7]: https://github.com/smogon/pokemon-showdown-client


Setting up an Administrator account
------------------------------------------------------------------------

Once your server is up, you probably want to make yourself an Administrator (~) on it.

### config/usergroups.csv

To become an Administrator, create a file named `config/usergroups.csv` containing

    USER,~

Replace `USER` with the username that you would like to become an Administrator. Do not put a space between the comma and the ampersand.

This username must be registered. If you do not have a registered account, you can create one using the Register button in the settings menu (it looks like a gear) in the upper-right of Pokémon Showdown.

Once you're an administrator, you can promote/demote others easily with the `/globaladmin`, `/globalmod`, `/globaldriver`, etc commands.
