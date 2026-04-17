# Impulse Server: Custom HP & Status Mod

Welcome to the Impulse Server! This server features a custom mechanics mod that allows Pokémon to optionally start battles with a specific HP percentage and/or a major status condition.

This is perfect for creating custom scenarios, testing specific mechanics (like Guts or Blaze), or building unique challenge modes.

## 📖 How It Works

Because we use the official public Pokémon Showdown client (`play.pokemonshowdown.com`) to connect to our custom server, we have to bypass the client's strict teambuilder validation. If you try to type `HP: 20%` normally, your browser will delete it before it reaches our server!

To get around this, we use the **Nickname Hack**. You can encode your custom HP and Status conditions directly into your Pokémon's nickname using special bracket tags. When the battle starts, our server intercepts these tags, applies the stats, and magically cleans up the nickname so your opponent never sees the brackets.

---

## 🛠️ Formatting Syntax

Add the following tags to your Pokémon's nickname in the Teambuilder:

| Tag | Description |
|---|---|
| `[H:XX]` | Sets starting HP %. Replace `XX` with a number between `0` and `100`. |
| `[S:xxx]` | Sets starting Status Condition. Replace `xxx` with a valid 3-letter code (see below). |

### Status Codes

| Code | Status |
|---|---|
| `brn` | Burn |
| `par` | Paralyze |
| `slp` | Sleep |
| `frz` | Freeze |
| `psn` | Poison |
| `tox` | Badly Poisoned |

> **Important:** To use these tags in the public teambuilder, you *must* use the Parentheses format so the client knows it's a nickname:
> ```
> Nickname [H:XX] [S:xxx] (Species) @ Item
> ```

---

## 📋 Examples

### 1. Custom HP and Status (With a Nickname)

Name your Charizard "Smaug", start at 20% HP, and be Burned:

```
Smaug [H:20] [S:brn] (Charizard) @ Heavy-Duty Boots
Ability: Blaze
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
- Flamethrower
- Air Slash
- Roost
- Defog
```

> In-battle result: Sent out as Smaug with 20% HP and the Burn status.

---

### 2. Custom HP Only (No Nickname)

Start a standard Gholdengo at 1% HP without a custom nickname:

```
Gholdengo [H:1] (Gholdengo) @ Choice Scarf
Ability: Good as Gold
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
- Make It Rain
- Shadow Ball
- Trick
- Recover
```

> In-battle result: Sent out as Gholdengo with 1% HP.

---

### 3. Starting Fainted (0% HP)

A Pokémon at 0% HP starts the battle completely fainted. It will be pushed to the back of your party and cannot be selected as your active lead during Team Preview.

```
Zamazenta [H:0] (Zamazenta) @ Leftovers
Ability: Dauntless Shield
EVs: 252 HP / 4 Def / 252 Spe
Jolly Nature
- Iron Defense
- Body Press
- Heavy Slam
- Roar
```

> In-battle result: Starts the battle fainted in your party.

---

## ⚙️ Engine Features

This mod is fully integrated into the core battle engine:

- **Turn Zero Activation** — Abilities like Blaze or Guts will activate immediately on turn one based on your starting HP/Status.
- **Accurate Status Tracking** — Starting with `[S:tox]` begins the toxic counter at 0 and increments normally. Starting with `[S:slp]` randomizes sleep turns just like a mid-battle Hypnosis.
- **100% Optional** — Standard teams copy-pasted from Smogon work perfectly with 100% HP and no status.

---

## ⚠️ Known Limitations

- You cannot legitimately nickname a Pokémon `[H:50]` or `[S:brn]` without triggering the hack — the server will always intercept those tags.
- **Volatile statuses** (Confusion, Taunt, Leech Seed, etc.) are **not supported**. Only the major status conditions listed above will work.
