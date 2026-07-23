# Custom avatars directory

You can give your users custom avatars.

Put avatar files (80x80 PNG files) here, then use the `/addavatar` system to give users access to them.

## Local side servers

Side-server avatars are served directly by this server at
`/avatars/<filename>`. They do not require an entry in the official Pokémon
Showdown server registry.

Use a filename containing an extension, such as `example.png`, to distinguish a
local avatar from an official avatar ID. For example:

```text
/personalavatar UserName, example.png
/avatar example.png
```

You can verify that the server is serving the file by opening:

```text
http://localhost:8000/avatars/example.png
```

The web client must be a current build that resolves side-server avatars from
the connected server. See the Windows local-development instructions in
[`server/README.md`](../../server/README.md#running-the-server-and-client-locally-on-windows).
