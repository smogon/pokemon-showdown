# Data Guide — adding and editing your own content

Everything the game uses lives in `data/mods/fakemon/`. Nothing outside that
folder needs to change to add a Pokémon, move, ability, item or Mega Stone.

After **any** change:

```bash
node build                            # compile
node tools/fakemon/check.js           # catches typos, broken references, gaps
```

---

## Where things live

```
data/mods/fakemon/
  generated/          ← produced by tools/fakemon/build.py. DO NOT EDIT BY HAND.
    pokedex.ts          all species
    moves-generic.ts    the 717 moves from the expansion PDF + xlsx
    learnsets.ts        who learns what
    formats-data.ts     tiers
    index.ts            the inventory the rest of the code checks against
  pokedex.ts          ← your species overrides go in `Overrides` here
  learnsets.ts        ← your learnset overrides
  formats-data.ts     ← your tier overrides
  moves-signature.ts  ← hand-written moves
  abilities.ts        ← hand-written abilities
  items.ts            ← hand-written items and Mega Stones
  conditions.ts       ← new weather, rooms, fields and volatiles
  rulesets.ts         ← what is legal
  bot.ts              ← the AI
  assets.ts           ← image paths
```

The split matters: the `generated/` files are rebuilt from the PDFs and xlsx, so
anything you write there is lost on the next regeneration. Hand-written content
goes in the top-level files, which are merged **on top of** the generated data.

---

## Adding a Pokémon

Open `data/mods/fakemon/pokedex.ts` and add it to `Overrides`:

```ts
const Overrides: import('../../../sim/dex-species').ModdedSpeciesDataTable = {
	frostbloom: {
		num: 9001,                       // any unused number
		name: "Frostbloom",
		types: ["Ice", "Grass"],
		baseStats: { hp: 80, atk: 65, def: 95, spa: 120, spd: 100, spe: 70 },
		abilities: { 0: "Frozen Armor", 1: "Evergreen", H: "Sylvan Veil" },
		heightm: 1.4,
		weightkg: 48.0,
		color: "Blue",
		eggGroups: ["Grass"],
	},
};
```

Then give it moves in `data/mods/fakemon/learnsets.ts`:

```ts
const Overrides: import('../../../sim/dex-species').ModdedLearnsetDataTable = {
	frostbloom: {
		learnset: {
			sprinkleshower: ['9L1'],
			meltdown: ['9L1'],
			bramblewhip: ['9M'],
			cocorefresh: ['9M'],
		},
	},
};
```

and a tier in `data/mods/fakemon/formats-data.ts`:

```ts
const Overrides = {
	frostbloom: { tier: 'OU', doublesTier: 'DOU' },
};
```

Finally add its name to the inventory so the validator accepts it. Either
re-run `python3 tools/fakemon/build.py` (if you added it to the source PDF data)
or add it to `generated/index.ts`'s `species` and `baseSpecies` arrays.

> Every Pokémon can Mega Evolve for +20 to all stats without any extra work.
> Only a Mega **Stone** needs the extra pieces below.

## Adding a move

`data/mods/fakemon/moves-signature.ts`:

```ts
	frostlance: {
		num: 9001,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Frost Lance",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		secondary: { chance: 30, status: 'frz' },
		target: 'normal',
		type: "Ice",
		shortDesc: "30% chance to freeze.",
	},
```

Add its ID to `generated/index.ts` → `signatureMoves`, or the validator will
treat it as non-custom data and reject it.

**Effects are code, not text.** `shortDesc` is only what players read; the
behaviour has to be real. Common building blocks:

| You want | Write |
| --- | --- |
| a chance of a status | `secondary: { chance: 30, status: 'brn' }` |
| a chance of a stat drop | `secondary: { chance: 20, boosts: { def: -1 } }` |
| a guaranteed stat change on the user | `self: { boosts: { atk: 1 } }` |
| recoil / drain | `recoil: [33, 100]` / `drain: [1, 2]` |
| multi-hit | `multihit: [2, 5]` |
| conditional power | `onBasePower(basePower, source, target) { … }` |
| a lasting effect | `volatileStatus: 'myeffect'` + a `condition` block |
| a field effect | `pseudoWeather: 'myroom'` + an entry in `conditions.ts` |

## Adding an ability

`data/mods/fakemon/abilities.ts`:

```ts
	frostguard: {
		name: "Frost Guard",
		shortDesc: "Halves damage from Fire moves and thaws the user.",
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Fire') return this.chainModify(0.5);
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'frz') pokemon.cureStatus();
		},
		flags: { breakable: 1 },
		rating: 3,
		num: 9001,
	},
```

Add the ID to `generated/index.ts` → `abilities` (or `megaAbilities` if it may
only be reached by Mega Evolving).

Useful hooks: `onStart`, `onSwitchIn`, `onModifyAtk/SpA/Def/SpD/Spe`,
`onBasePower`, `onSourceModifyDamage`, `onDamagingHit`, `onTryHit`,
`onAfterMove`, `onResidual`, `onTryBoost`, `onFaint`, `onAnyFaint`,
`onModifyType`, `onEffectiveness`, `onModifyPriority`.

`flags: { breakable: 1 }` marks an ability that a move can ignore.

## Adding an item

`data/mods/fakemon/items.ts`. **Every item needs `isNonstandard: 'Custom'`** —
that flag is how the mod tells custom items from the original ones it deletes.

```ts
	frostcharm: {
		name: "Frost Charm",
		spritenum: 0,
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Ice') return this.chainModify(1.2);
		},
		isNonstandard: 'Custom',
		num: 9001,
		gen: 9,
		desc: "The holder's Ice moves deal 20% more damage.",
	},
```

To make it a **food item** (so Sugar Rush, Crispy Charge, Nibble, Evergreen Cud,
Itemfinder and Nectar Dash all recognise it), add its ID to the `FOOD_ITEMS`
array at the top of the same file. That array is the single list every one of
those effects checks.

## Adding a Mega Stone

Three pieces, all of which the data check verifies:

**1. The Mega forme**, in `pokedex.ts` → `Overrides`:

```ts
	frostbloommega: {
		num: 9001,                          // same num as the base forme
		name: "Frostbloom-Mega",
		baseSpecies: "Frostbloom",
		forme: "Mega",
		types: ["Ice", "Grass"],
		// must be EXACTLY +100 BST over the base forme, and must not change HP
		baseStats: { hp: 80, atk: 75, def: 120, spa: 160, spd: 115, spe: 80 },
		abilities: { 0: "Frost Guard" },    // the Mega ability
		heightm: 1.4,
		weightkg: 48.0,
		color: "Blue",
		eggGroups: ["Grass"],
		requiredItem: "Frostbloomite",
		battleOnly: "Frostbloom",           // cannot be put on a team directly
	},
```

**2. The stone**, in `items.ts`:

```ts
	frostbloomite: {
		name: "Frostbloomite",
		spritenum: 0,
		megaStone: { "Frostbloom": "Frostbloom-Mega" },
		itemUser: ["Frostbloom"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 9002,
		gen: 9,
		desc: "If held by Frostbloom, this item allows it to Mega Evolve.",
	},
```

**3. The registration**, in `generated/index.ts` → `megas`:

```ts
	"frostbloom": {
		"stone": "Frostbloomite",
		"stoneId": "frostbloomite",
		"forme": "Frostbloom-Mega",
		"ability": "Frost Guard"
	}
```

The Mega ability must appear on **no** base forme, or the data check will fail.

## Adding a field effect

`data/mods/fakemon/conditions.ts`. A field-wide effect is a pseudo-weather:

```ts
	frostfield: {
		name: 'Frost Field',
		effectType: 'Weather',
		duration: 5,
		onFieldStart() {
			this.add('-fieldstart', 'move: Frost Field');
		},
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (move.type === 'Ice') return this.chainModify(1.5);
		},
		onFieldResidualOrder: 27,
		onFieldEnd() {
			this.add('-fieldend', 'move: Frost Field');
		},
	},
```

A move sets it with `pseudoWeather: 'frostfield'` and `target: 'all'`; a side
effect uses `sideCondition:` with `onSideStart`/`onSideEnd`; a per-Pokémon
effect uses `volatileStatus:` with `onStart`/`onResidual`/`onEnd`.

## Re-importing from the source files

If you update the PDFs or the spreadsheet:

```bash
python3 tools/fakemon/parse_dex.py   <dex.pdf>            tools/fakemon/raw/dex.json
python3 tools/fakemon/parse_moves.py <moves.xlsx> <moves.pdf> tools/fakemon/raw/moves.json
python3 tools/fakemon/build.py        # regenerates data/mods/fakemon/generated/
node build && node tools/fakemon/check.js
```

`tools/fakemon/effects.py` is the rule library that turns an effect description
into real move fields. If the importer meets wording it does not understand, it
says so instead of shipping an inert move — add a rule there, or implement the
move by hand in `moves-signature.ts`.

## Replacing the placeholder images

See `assets/README.md`. Short version: drop a PNG named after the entry's ID
into the right folder (`assets/pokemon/hallowisp.png`) and it is picked up
automatically. `assets/manifest.json` lists all 733 expected paths, and
`data/mods/fakemon/assets.ts` is the only file that knows where images live.

## Updating the Teambuilder

The Teambuilder is part of the separate client repository. After changing data:

```bash
node tools/fakemon/export-client.js
```

then copy `dist-client/data/*.js` over `play.pokemonshowdown.com/data/` in your
copy of `pokemon-showdown-client`. The server is always the authority — an
out-of-date client cannot get an illegal team into a battle.
