/* eslint max-len: ["error", 240] */

import RandomGen4Teams from '../gen4/teams';
import { Teams } from '@pkmn/sets';

const sampleTeamsData = Teams.importTeams(
	`
		=== [gen3ou] Milotic SD Pass ===

		Metagross @ Leftovers
		Ability: Clear Body
		EVs: 152 HP / 252 Atk / 104 Spe
		Adamant Nature
		- Meteor Mash
		- Earthquake
		- Agility
		- Explosion

		Milotic @ Leftovers
		Ability: Marvel Scale
		EVs: 248 HP / 212 Def / 48 Spe
		Bold Nature
		IVs: 0 Atk
		- Hypnosis
		- Surf
		- Ice Beam
		- Recover

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 240 HP / 44 Def / 4 SpD / 220 Spe
		Jolly Nature
		- Swords Dance
		- Hidden Power [Rock]
		- Baton Pass
		- Recover

		Magneton @ Leftovers
		Ability: Magnet Pull
		EVs: 144 HP / 112 SpA / 252 Spe
		Timid Nature
		IVs: 2 Atk / 30 SpA / 30 Spe
		- Thunderbolt
		- Hidden Power [Fire]
		- Thunder Wave
		- Toxic

		Heracross @ Leftovers
		Ability: Guts
		EVs: 144 HP / 16 Atk / 184 SpD / 164 Spe
		Adamant Nature
		- Megahorn
		- Rock Slide
		- Hidden Power [Ghost]
		- Brick Break

		Gyarados @ Leftovers
		Ability: Intimidate
		EVs: 252 Atk / 4 Def / 252 Spe
		Jolly Nature
		- Hidden Power [Flying]
		- Double-Edge
		- Earthquake
		- Dragon Dance


		=== [gen3ou] SD Pass by z0mog ===

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 252 HP / 16 Def / 240 SpA
		Quiet Nature
		- Crunch
		- Pursuit
		- Ice Beam
		- Brick Break

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 252 HP / 76 Def / 144 SpD / 36 Spe
		Bold Nature
		IVs: 0 Atk
		- Leech Seed
		- Recover
		- Swords Dance
		- Baton Pass

		Magneton @ Magnet
		Ability: Magnet Pull
		EVs: 252 SpA / 40 SpD / 216 Spe
		Timid Nature
		IVs: 2 Atk / 30 SpA
		- Thunderbolt
		- Hidden Power [Grass]
		- Thunder Wave
		- Substitute

		Swampert (F) @ Leftovers
		Ability: Torrent
		EVs: 4 Atk / 252 SpA / 252 Spe
		Rash Nature
		- Hydro Pump
		- Ice Beam
		- Earthquake
		- Focus Punch

		Metagross @ Lum Berry
		Ability: Clear Body
		EVs: 72 HP / 252 Atk / 184 Spe
		Adamant Nature
		- Meteor Mash
		- Earthquake
		- Explosion
		- Agility

		Aerodactyl @ Liechi Berry
		Ability: Rock Head
		EVs: 12 HP / 244 Atk / 252 Spe
		Jolly Nature
		- Rock Slide
		- Double-Edge
		- Earthquake
		- Substitute


		=== [gen3ou] MagDol + Double Set-up ===

		Salamence (M) @ Choice Band
		Ability: Intimidate
		EVs: 4 HP / 252 Atk / 252 Spe
		Jolly Nature
		- Hidden Power [Flying]
		- Fire Blast
		- Earthquake
		- Brick Break

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 248 HP / 120 Def / 28 SpA / 92 SpD / 20 Spe
		Bold Nature
		IVs: 2 Atk / 30 SpA
		- Hidden Power [Grass]
		- Perish Song
		- Leech Seed
		- Recover

		Claydol @ Leftovers
		Ability: Levitate
		EVs: 252 HP / 200 Atk / 56 Spe
		Adamant Nature
		- Earthquake
		- Psychic
		- Explosion
		- Rapid Spin

		Magneton @ Leftovers
		Ability: Magnet Pull
		EVs: 172 HP / 252 SpA / 84 Spe
		Modest Nature
		IVs: 2 Atk / 30 SpA
		- Thunderbolt
		- Hidden Power [Grass]
		- Toxic
		- Thunder Wave

		Snorlax (M) @ Leftovers
		Ability: Immunity
		EVs: 92 HP / 128 Atk / 124 Def / 164 SpD
		Adamant Nature
		- Body Slam
		- Shadow Ball
		- Curse
		- Rest

		Suicune @ Leftovers
		Ability: Pressure
		EVs: 252 HP / 220 Def / 36 Spe
		Bold Nature
		IVs: 0 Atk
		- Surf
		- Roar
		- Calm Mind
		- Rest


		=== [gen3ou] CBMeta Mag SubPassBi DDSpam ===

		Metagross @ Choice Band
		Ability: Clear Body
		EVs: 224 Atk / 68 SpD / 216 Spe
		Jolly Nature
		- Brick Break
		- Double-Edge
		- Meteor Mash
		- Explosion

		Magneton @ Salac Berry
		Ability: Magnet Pull
		EVs: 252 SpA / 32 SpD / 224 Spe
		Timid Nature
		IVs: 2 Atk / 30 SpA
		- Endure
		- Substitute
		- Hidden Power [Grass]
		- Thunderbolt

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 252 HP / 4 SpD / 252 Spe
		Timid Nature
		IVs: 0 Atk
		- Substitute
		- Leech Seed
		- Psychic
		- Baton Pass

		Tyranitar @ Lum Berry
		Ability: Sand Stream
		EVs: 232 Atk / 24 SpA / 252 Spe
		Hasty Nature
		- Hidden Power [Grass]
		- Dragon Dance
		- Earthquake
		- Rock Slide

		Gyarados @ Leftovers
		Ability: Intimidate
		EVs: 28 HP / 252 Atk / 228 Spe
		Jolly Nature
		- Hidden Power [Ghost]
		- Double-Edge
		- Earthquake
		- Dragon Dance

		Salamence @ Leftovers
		Ability: Intimidate
		EVs: 180 Atk / 212 SpD / 116 Spe
		Adamant Nature
		IVs: 30 SpA / 30 SpD / 30 Spe
		- Hidden Power [Flying]
		- Rock Slide
		- Earthquake
		- Dragon Dance


		=== [gen3ou] Magneton Special Spam ===

		Zapdos @ Leftovers
		Ability: Pressure
		EVs: 4 HP / 252 SpA / 252 Spe
		Timid Nature
		IVs: 2 Atk / 30 SpA
		- Thunderbolt
		- Hidden Power [Grass]
		- Baton Pass
		- Roar

		Magneton @ Magnet
		Ability: Magnet Pull
		EVs: 4 Def / 252 SpA / 252 Spe
		Modest Nature
		IVs: 2 Atk / 30 SpA / 30 Spe
		- Thunderbolt
		- Hidden Power [Fire]
		- Metal Sound
		- Substitute

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 252 HP / 12 Def / 68 SpD / 176 Spe
		Timid Nature
		IVs: 0 Atk
		- Psychic
		- Calm Mind
		- Leech Seed
		- Baton Pass

		Swampert @ Salac Berry
		Ability: Torrent
		EVs: 252 SpA / 4 SpD / 252 Spe
		Timid Nature
		IVs: 0 Atk
		- Endeavor
		- Substitute
		- Surf
		- Roar

		Porygon2 @ Leftovers
		Ability: Trace
		EVs: 252 HP / 224 Def / 32 SpA
		Relaxed Nature
		- Ice Beam
		- Hidden Power [Fighting]
		- Recover
		- Thunder Wave

		Jirachi @ Leftovers
		Ability: Serene Grace
		EVs: 252 HP / 40 Def / 64 SpA / 152 Spe
		Modest Nature
		IVs: 2 Atk / 30 Def / 30 SpA
		- Calm Mind
		- Psychic
		- Hidden Power [Water]
		- Substitute


		=== [gen3ou] CM Spam by dekzeh ===

		Suicune @ Leftovers
		Ability: Pressure
		EVs: 28 HP / 252 SpA / 228 Spe
		Modest Nature
		- Calm Mind
		- Roar
		- Ice Beam
		- Hydro Pump

		Dugtrio (F) @ Choice Band
		Ability: Arena Trap
		EVs: 228 Atk / 48 SpD / 232 Spe
		Adamant Nature
		- Earthquake
		- Hidden Power [Bug]
		- Aerial Ace
		- Rock Slide

		Jirachi @ Leftovers
		Ability: Serene Grace
		EVs: 4 HP / 252 SpA / 252 Spe
		Timid Nature
		- Calm Mind
		- Fire Punch
		- Psychic
		- Hidden Power [Grass]

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 104 HP / 252 SpA / 152 Spe
		Timid Nature
		- Baton Pass
		- Calm Mind
		- Giga Drain
		- Hidden Power [Fire]

		Porygon2 @ Leftovers
		Ability: Trace
		EVs: 252 HP / 200 Def / 56 SpA
		Bold Nature
		- Recover
		- Ice Beam
		- Thunderbolt
		- Toxic

		Raikou @ Leftovers
		Ability: Pressure
		EVs: 4 HP / 252 SpA / 252 Spe
		Timid Nature
		- Calm Mind
		- Thunderbolt
		- Hidden Power [Ice]
		- Roar


		=== [gen3ou] Charizard CM Pass by SEA ===

		Zapdos @ Leftovers
		Ability: Pressure
		EVs: 220 SpA / 48 SpD / 240 Spe
		Modest Nature
		IVs: 2 Atk / 30 SpA
		- Thunderbolt
		- Hidden Power [Grass]
		- Baton Pass
		- Roar

		Metagross @ Choice Band
		Ability: Clear Body
		EVs: 128 HP / 252 Atk / 128 Spe
		Adamant Nature
		- Meteor Mash
		- Explosion
		- Earthquake
		- Rock Slide

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 208 HP / 84 Def / 36 SpA / 180 Spe
		Timid Nature
		IVs: 3 Atk / 30 Spe
		- Calm Mind
		- Giga Drain
		- Hidden Power [Ice]
		- Baton Pass

		Gengar @ Leftovers
		Ability: Levitate
		EVs: 8 HP / 200 Def / 116 SpA / 184 Spe
		Timid Nature
		- Thunderbolt
		- Ice Punch
		- Giga Drain
		- Explosion

		Swampert @ Leftovers
		Ability: Torrent
		EVs: 240 HP / 12 Def / 216 SpA / 40 Spe
		Quiet Nature
		- Hydro Pump
		- Earthquake
		- Ice Beam
		- Refresh

		Charizard @ Leftovers
		Ability: Blaze
		EVs: 4 Atk / 252 SpA / 252 Spe
		Mild Nature
		- Substitute
		- Hidden Power [Grass]
		- Fire Blast
		- Focus Punch


		=== [gen3ou] Smeargle Zapdos Offense ===

		Zapdos @ Leftovers
		Ability: Pressure
		EVs: 112 HP / 252 SpA / 144 Spe
		Modest Nature
		IVs: 2 Atk / 30 SpA
		- Thunderbolt
		- Hidden Power [Grass]
		- Thunder Wave
		- Baton Pass

		Smeargle @ Salac Berry
		Ability: Own Tempo
		EVs: 68 HP / 188 SpD / 252 Spe
		Jolly Nature
		- Spore
		- Will-O-Wisp
		- Explosion
		- Spikes

		Metagross @ Choice Band
		Ability: Clear Body
		EVs: 72 HP / 252 Atk / 184 Spe
		Adamant Nature
		- Meteor Mash
		- Earthquake
		- Explosion
		- Rock Slide

		Tyranitar @ Lum Berry
		Ability: Sand Stream
		EVs: 4 HP / 252 Atk / 252 Spe
		Jolly Nature
		- Dragon Dance
		- Rock Slide
		- Earthquake
		- Double-Edge

		Aerodactyl @ Choice Band
		Ability: Rock Head
		EVs: 4 HP / 252 Atk / 252 Spe
		Jolly Nature
		- Rock Slide
		- Double-Edge
		- Earthquake
		- Hidden Power [Bug]

		Swampert @ Salac Berry
		Ability: Torrent
		EVs: 4 Def / 252 SpA / 252 Spe
		Timid Nature
		IVs: 0 Atk
		- Hydro Pump
		- Endeavor
		- Ice Beam
		- Substitute


		=== [gen3ou] Smeargle Vaporeon Offense ===

		Vaporeon @ Salac Berry
		Ability: Water Absorb
		EVs: 16 HP / 228 SpA / 12 SpD / 252 Spe
		Timid Nature
		IVs: 0 Atk
		- Hydro Pump
		- Ice Beam
		- Substitute
		- Baton Pass

		Smeargle @ Salac Berry
		Ability: Own Tempo
		EVs: 4 HP / 20 Atk / 232 SpD / 252 Spe
		Jolly Nature
		- Spikes
		- Spore
		- Thunder Wave
		- Explosion

		Metagross @ Leftovers
		Ability: Clear Body
		EVs: 32 Atk / 252 SpA / 224 Spe
		Rash Nature
		- Thunder Punch
		- Hidden Power [Grass]
		- Earthquake
		- Explosion

		Gengar @ Leftovers
		Ability: Levitate
		EVs: 8 HP / 196 Def / 104 SpA / 200 Spe
		Timid Nature
		- Fire Punch
		- Ice Punch
		- Hidden Power [Grass]
		- Explosion

		Tyranitar @ Lum Berry
		Ability: Sand Stream
		EVs: 228 HP / 80 Atk / 84 SpD / 116 Spe
		Adamant Nature
		- Dragon Dance
		- Rock Slide
		- Earthquake
		- Double-Edge

		Aerodactyl @ Choice Band
		Ability: Rock Head
		EVs: 224 Atk / 32 SpD / 252 Spe
		Jolly Nature
		- Double-Edge
		- Earthquake
		- Hidden Power [Bug]
		- Rock Slide


		=== [gen3ou] ZapDug Offense ===

		Zapdos @ Leftovers
		Ability: Pressure
		EVs: 4 HP / 252 SpA / 252 Spe
		Timid Nature
		IVs: 2 Atk / 30 SpA
		- Thunderbolt
		- Hidden Power [Grass]
		- Thunder Wave
		- Baton Pass

		Dugtrio @ Choice Band
		Ability: Arena Trap
		EVs: 136 HP / 252 Atk / 24 SpD / 96 Spe
		Jolly Nature
		- Earthquake
		- Beat Up
		- Hidden Power [Bug]
		- Aerial Ace

		Swampert @ Leftovers
		Ability: Torrent
		EVs: 252 HP / 212 Def / 44 SpD
		Relaxed Nature
		- Hydro Pump
		- Ice Beam
		- Earthquake
		- Protect

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 252 HP / 64 Def / 192 SpD
		Calm Nature
		IVs: 0 Atk / 30 Spe
		- Leech Seed
		- Baton Pass
		- Recover
		- Psychic

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 248 HP / 252 Atk / 8 SpD
		Adamant Nature
		IVs: 30 SpD / 30 Spe
		- Rock Slide
		- Earthquake
		- Hidden Power [Bug]
		- Focus Punch

		Starmie @ Leftovers
		Ability: Natural Cure
		EVs: 4 HP / 252 SpA / 252 Spe
		Timid Nature
		IVs: 0 Atk
		- Hydro Pump
		- Thunderbolt
		- Ice Beam
		- Rapid Spin


		=== [gen3ou] Mixed Offence by thelinearcurve ===

		Salamence @ Leftovers
		Ability: Intimidate
		EVs: 4 Atk / 252 SpA / 252 Spe
		Naive Nature
		IVs: 30 Def / 30 SpA
		- Brick Break
		- Dragon Claw
		- Fire Blast
		- Hidden Power [Grass]

		Zapdos @ Leftovers
		Ability: Pressure
		EVs: 252 SpA / 4 SpD / 252 Spe
		Timid Nature
		IVs: 2 Atk / 30 Def
		- Thunderbolt
		- Hidden Power [Ice]
		- Thunder Wave
		- Roar

		Swampert @ Leftovers
		Ability: Torrent
		EVs: 28 Atk / 252 SpA / 228 Spe
		Rash Nature
		- Hydro Pump
		- Ice Beam
		- Earthquake
		- Focus Punch

		Tyranitar @ Lum Berry
		Ability: Sand Stream
		EVs: 252 Atk / 4 Def / 252 Spe
		Jolly Nature
		- Dragon Dance
		- Rock Slide
		- Earthquake
		- Hidden Power [Bug]

		Metagross @ Leftovers
		Ability: Clear Body
		EVs: 36 Atk / 252 SpA / 220 Spe
		Rash Nature
		IVs: 30 Def / 30 SpA / 30 Spe
		- Meteor Mash
		- Psychic
		- Hidden Power [Fire]
		- Explosion

		Snorlax @ Leftovers
		Ability: Immunity
		EVs: 16 HP / 176 Atk / 120 Def / 160 SpD / 36 Spe
		Adamant Nature
		- Body Slam
		- Focus Punch
		- Shadow Ball
		- Self-Destruct


		=== [gen3ou] Blue Offense By Noitu ===

		Suicune @ Leftovers
		Ability: Pressure
		EVs: 100 HP / 252 SpA / 156 Spe
		Modest Nature
		IVs: 0 Atk
		- Hydro Pump
		- Calm Mind
		- Ice Beam
		- Roar

		Snorlax @ Leftovers
		Ability: Immunity
		EVs: 16 HP / 244 Atk / 116 Def / 116 SpD / 16 Spe
		Adamant Nature
		- Body Slam
		- Earthquake
		- Shadow Ball
		- Self-Destruct

		Magneton @ Magnet
		Ability: Magnet Pull
		EVs: 68 HP / 252 SpA / 188 Spe
		Timid Nature
		IVs: 2 Atk / 30 SpA / 30 Spe
		- Thunderbolt
		- Hidden Power [Fire]
		- Rain Dance
		- Thunder Wave

		Salamence @ Leftovers
		Ability: Intimidate
		EVs: 4 Atk / 252 SpA / 252 Spe
		Rash Nature
		- Dragon Claw
		- Fire Blast
		- Hidden Power [Grass]
		- Brick Break

		Metagross @ Choice Band
		Ability: Clear Body
		EVs: 68 HP / 252 Atk / 188 Spe
		Adamant Nature
		- Meteor Mash
		- Earthquake
		- Rock Slide
		- Explosion

		Heracross @ Salac Berry
		Ability: Swarm
		EVs: 252 Atk / 4 SpD / 252 Spe
		Adamant Nature
		IVs: 30 HP
		- Substitute
		- Swords Dance
		- Megahorn
		- Rock Slide


		=== [gen3ou] SubZap OffYama SpinMie Balance ===

		Zapdos @ Leftovers
		Ability: Pressure
		EVs: 4 Def / 252 SpA / 252 Spe
		Timid Nature
		IVs: 2 Atk / 30 Def
		- Thunderbolt
		- Hidden Power [Ice]
		- Substitute
		- Baton Pass

		Hariyama @ Leftovers
		Ability: Guts
		EVs: 216 Atk / 108 Def / 124 SpD / 60 Spe
		Adamant Nature
		IVs: 30 SpD / 30 Spe
		- Brick Break
		- Focus Punch
		- Rock Slide
		- Hidden Power [Bug]

		Tyranitar (M) @ Leftovers
		Ability: Sand Stream
		EVs: 144 Atk / 252 SpA / 112 Spe
		Mild Nature
		- Rock Slide
		- Fire Blast
		- Hidden Power [Grass]
		- Focus Punch

		Blissey (F) @ Leftovers
		Ability: Natural Cure
		EVs: 252 HP / 252 Def / 4 SpD
		Bold Nature
		- Seismic Toss
		- Ice Beam
		- Wish
		- Soft-Boiled

		Starmie @ Leftovers
		Ability: Natural Cure
		EVs: 252 HP / 4 Def / 252 Spe
		Timid Nature
		IVs: 0 Atk
		- Surf
		- Thunder Wave
		- Rapid Spin
		- Recover

		Metagross @ Leftovers
		Ability: Clear Body
		EVs: 252 HP / 152 Def / 60 SpD / 44 Spe
		Impish Nature
		- Meteor Mash
		- Earthquake
		- Protect
		- Explosion


		=== [gen3ou] Hariyama Marowak SpinMie Balance ===

		Hariyama @ Leftovers
		Ability: Guts
		EVs: 228 Atk / 160 Def / 60 SpD / 60 Spe
		Adamant Nature
		IVs: 30 SpD / 30 Spe
		- Brick Break
		- Focus Punch
		- Knock Off
		- Hidden Power [Bug]

		Jirachi @ Leftovers
		Ability: Serene Grace
		EVs: 244 HP / 148 Def / 116 SpD
		Sassy Nature
		- Fire Punch
		- Body Slam
		- Wish
		- Protect

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 252 HP / 80 Def / 40 SpA / 136 Spe
		Bold Nature
		IVs: 2 Atk / 30 SpA
		- Psychic
		- Hidden Power [Grass]
		- Leech Seed
		- Recover

		Starmie @ Leftovers
		Ability: Natural Cure
		EVs: 252 HP / 40 Def / 8 SpA / 32 SpD / 176 Spe
		Timid Nature
		IVs: 0 Atk
		- Surf
		- Thunder Wave
		- Rapid Spin
		- Recover

		Salamence (M) @ Leftovers
		Ability: Intimidate
		EVs: 252 HP / 224 Def / 32 Spe
		Bold Nature
		IVs: 0 Atk
		- Flamethrower
		- Toxic
		- Wish
		- Protect

		Marowak @ Thick Club
		Ability: Rock Head
		EVs: 24 HP / 252 Atk / 4 SpD / 228 Spe
		Adamant Nature
		IVs: 30 SpD / 30 Spe
		- Earthquake
		- Rock Slide
		- Hidden Power [Bug]
		- Focus Punch


		=== [gen3ou] MiloDol TSS by Zokuru ===

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 184 HP / 196 Atk / 120 Def / 8 Spe
		Adamant Nature
		- Rock Slide
		- Earthquake
		- Hidden Power [Bug]
		- Roar

		Milotic @ Leftovers
		Ability: Marvel Scale
		EVs: 248 HP / 212 Def / 48 Spe
		Bold Nature
		IVs: 0 Atk
		- Surf
		- Toxic
		- Recover
		- Refresh

		Blissey (F) @ Leftovers
		Ability: Natural Cure
		EVs: 40 HP / 244 Def / 208 SpA / 16 Spe
		Bold Nature
		- Seismic Toss
		- Ice Beam
		- Thunder Wave
		- Soft-Boiled

		Skarmory @ Leftovers
		Ability: Keen Eye
		EVs: 248 HP / 236 SpD / 24 Spe
		Careful Nature
		- Drill Peck
		- Toxic
		- Spikes
		- Roar

		Claydol @ Leftovers
		Ability: Levitate
		EVs: 224 HP / 228 Atk / 36 SpA / 20 Spe
		Adamant Nature
		- Earthquake
		- Psychic
		- Refresh
		- Rapid Spin

		Dugtrio @ Choice Band
		Ability: Arena Trap
		EVs: 252 Atk / 4 SpD / 252 Spe
		Jolly Nature
		- Earthquake
		- Aerial Ace
		- Hidden Power [Bug]
		- Screech


		=== [gen3ou] Forretress TSS by MDragon ===

		Tyranitar (M) @ Leftovers
		Ability: Sand Stream
		EVs: 184 HP / 40 Def / 200 SpA / 84 Spe
		Modest Nature
		IVs: 0 Atk
		- Crunch
		- Flamethrower
		- Pursuit
		- Roar

		Forretress (M) @ Leftovers
		Ability: Sturdy
		EVs: 252 HP / 12 Def / 244 SpD
		Sassy Nature
		- Earthquake
		- Explosion
		- Rapid Spin
		- Spikes

		Dugtrio @ Choice Band
		Ability: Arena Trap
		EVs: 8 HP / 252 Atk / 20 SpD / 228 Spe
		Adamant Nature
		- Earthquake
		- Rock Slide
		- Aerial Ace
		- Hidden Power [Bug]

		Gengar @ Leftovers
		Ability: Levitate
		EVs: 248 HP / 52 Def / 112 SpD / 96 Spe
		Timid Nature
		- Thunderbolt
		- Ice Punch
		- Will-O-Wisp
		- Explosion

		Swampert (M) @ Leftovers
		Ability: Torrent
		EVs: 248 HP / 128 Def / 84 SpA / 48 Spe
		Relaxed Nature
		- Earthquake
		- Ice Beam
		- Protect
		- Refresh

		Blissey @ Leftovers
		Ability: Natural Cure
		EVs: 232 HP / 252 Def / 24 Spe
		Bold Nature
		IVs: 0 Atk / 30 SpA
		- Seismic Toss
		- Thunder Wave
		- Wish
		- Soft-Boiled


		=== [gen3ou] Double Status Zapdos + Dugtrio + CM Celebi Balance by Astamatitos ===

		Zapdos @ Leftovers
		Ability: Pressure
		EVs: 248 HP / 228 SpD / 32 Spe
		Calm Nature
		IVs: 0 Atk
		- Thunderbolt
		- Toxic
		- Thunder Wave
		- Rest

		Tyranitar (M) @ Leftovers
		Ability: Sand Stream
		EVs: 184 HP / 204 Atk / 120 Spe
		Adamant Nature
		- Rock Slide
		- Earthquake
		- Focus Punch
		- Hidden Power [Bug]

		Skarmory (M) @ Leftovers
		Ability: Keen Eye
		EVs: 248 HP / 216 SpD / 44 Spe
		Careful Nature
		IVs: 0 Atk
		- Spikes
		- Whirlwind
		- Toxic
		- Taunt

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 240 HP / 100 Def / 136 SpD / 32 Spe
		Calm Nature
		IVs: 0 Atk
		- Calm Mind
		- Psychic
		- Leech Seed
		- Recover

		Dugtrio (M) @ Choice Band
		Ability: Arena Trap
		EVs: 8 HP / 248 Atk / 252 Spe
		Jolly Nature
		- Earthquake
		- Rock Slide
		- Hidden Power [Bug]
		- Aerial Ace

		Swampert (M) @ Leftovers
		Ability: Torrent
		EVs: 240 HP / 188 Def / 56 SpD / 24 Spe
		Bold Nature
		IVs: 0 Atk
		- Surf
		- Toxic
		- Protect
		- Refresh


		=== [gen3ou] Regice Spikes Offense by Jirachee ===

		Skarmory @ Leftovers
		Ability: Keen Eye
		EVs: 252 HP / 252 SpD / 4 Spe
		Careful Nature
		- Drill Peck
		- Spikes
		- Protect
		- Roar

		Regice @ Leftovers
		Ability: Clear Body
		EVs: 240 HP / 16 Atk / 252 SpA
		Quiet Nature
		- Ice Beam
		- Thunderbolt
		- Thunder Wave
		- Explosion

		Gengar @ Leftovers
		Ability: Levitate
		EVs: 68 HP / 252 SpA / 188 Spe
		Timid Nature
		- Ice Punch
		- Hidden Power [Grass]
		- Fire Punch
		- Explosion

		Suicune @ Leftovers
		Ability: Pressure
		EVs: 240 HP / 252 SpA / 16 Spe
		Modest Nature
		IVs: 0 Atk
		- Surf
		- Calm Mind
		- Rest
		- Sleep Talk

		Claydol @ Leftovers
		Ability: Levitate
		EVs: 24 HP / 252 Atk / 232 Spe
		Adamant Nature
		- Earthquake
		- Psychic
		- Rapid Spin
		- Explosion

		Metagross @ Leftovers
		Ability: Clear Body
		EVs: 168 HP / 252 Atk / 88 Spe
		Adamant Nature
		- Meteor Mash
		- Earthquake
		- Rock Slide
		- Agility


		=== [gen3ou] refresh mixmence + offmie + agimeta ===

		Tyranitar @ Lum Berry
		Ability: Sand Stream
		EVs: 4 HP / 252 Atk / 252 Spe
		Adamant Nature
		- Dragon Dance
		- Rock Slide
		- Earthquake
		- Double-Edge

		Skarmory @ Leftovers
		Ability: Keen Eye
		EVs: 252 HP / 252 SpD / 4 Spe
		Careful Nature
		- Spikes
		- Toxic
		- Roar
		- Drill Peck

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 192 HP / 8 Def / 224 SpA / 84 Spe
		Modest Nature
		IVs: 2 Atk / 30 SpA / 30 Spe
		- Leech Seed
		- Psychic
		- Giga Drain
		- Hidden Power [Fire]

		Starmie @ Leftovers
		Ability: Natural Cure
		EVs: 4 HP / 252 SpA / 252 Spe
		Timid Nature
		IVs: 0 Atk
		- Rapid Spin
		- Hydro Pump
		- Ice Beam
		- Thunderbolt

		Salamence @ Leftovers
		Ability: Intimidate
		EVs: 24 HP / 24 Atk / 252 SpA / 208 Spe
		Mild Nature
		- Refresh
		- Dragon Claw
		- Fire Blast
		- Brick Break

		Metagross @ Leftovers
		Ability: Clear Body
		EVs: 168 HP / 196 Atk / 16 Def / 128 Spe
		Adamant Nature
		- Agility
		- Meteor Mash
		- Earthquake
		- Rock Slide


		=== [gen3ou] pump mixmence + bkctar ===

		Salamence @ Leftovers
		Ability: Intimidate
		EVs: 24 HP / 24 Atk / 252 SpA / 208 Spe
		Mild Nature
		- Dragon Claw
		- Fire Blast
		- Hydro Pump
		- Brick Break

		Skarmory @ Leftovers
		Ability: Keen Eye
		EVs: 252 HP / 252 SpD / 4 Spe
		Careful Nature
		- Spikes
		- Toxic
		- Roar
		- Drill Peck

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 192 HP / 8 Def / 224 SpA / 84 Spe
		Modest Nature
		IVs: 2 Atk / 30 SpA / 30 Spe
		- Leech Seed
		- Psychic
		- Giga Drain
		- Hidden Power [Fire]

		Swampert @ Leftovers
		Ability: Torrent
		EVs: 248 HP / 56 Atk / 64 Def / 140 SpA
		Quiet Nature
		- Curse
		- Hydro Pump
		- Ice Beam
		- Earthquake

		Aerodactyl @ Choice Band
		Ability: Rock Head
		EVs: 4 HP / 252 Atk / 252 Spe
		Jolly Nature
		- Rock Slide
		- Double-Edge
		- Earthquake
		- Hidden Power [Bug]

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 252 HP / 252 Atk / 4 Def
		Adamant Nature
		IVs: 30 SpD / 30 Spe
		- Rock Slide
		- Earthquake
		- Focus Punch
		- Hidden Power [Bug]


		=== [gen3ou] MixMence Aero Forre TSS ===

		Salamence @ Leftovers
		Ability: Intimidate
		EVs: 16 HP / 104 Def / 252 SpA / 136 Spe
		Rash Nature
		- Dragon Claw
		- Fire Blast
		- Brick Break
		- Roar

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 232 HP / 60 Def / 216 SpA
		Modest Nature
		IVs: 0 Atk
		- Crunch
		- Pursuit
		- Fire Blast
		- Counter

		Forretress @ Leftovers
		Ability: Sturdy
		EVs: 252 HP / 252 SpD / 4 Spe
		Careful Nature
		- Spikes
		- Earthquake
		- Explosion
		- Rapid Spin

		Blissey (F) @ Leftovers
		Ability: Natural Cure
		EVs: 252 HP / 252 Def / 4 SpD
		Bold Nature
		- Seismic Toss
		- Counter
		- Thunder Wave
		- Soft-Boiled

		Jirachi @ Leftovers
		Ability: Serene Grace
		EVs: 252 HP / 224 Def / 32 Spe
		Bold Nature
		IVs: 0 Atk
		- Fire Punch
		- Toxic
		- Wish
		- Protect

		Aerodactyl @ Choice Band
		Ability: Rock Head
		EVs: 4 HP / 252 Atk / 72 SpD / 180 Spe
		Jolly Nature
		- Rock Slide
		- Earthquake
		- Double-Edge
		- Hidden Power [Fighting]


		=== [gen3ou] Moltres TSS ===

		Tyranitar (F) @ Leftovers
		Ability: Sand Stream
		EVs: 252 HP / 108 Atk / 36 Def / 112 Spe
		Adamant Nature
		- Rock Slide
		- Earthquake
		- Taunt
		- Toxic

		Skarmory (M) @ Leftovers
		Ability: Keen Eye
		EVs: 252 HP / 212 SpD / 44 Spe
		Calm Nature
		IVs: 0 Atk
		- Toxic
		- Taunt
		- Spikes
		- Whirlwind

		Swampert @ Leftovers
		Ability: Torrent
		EVs: 248 HP / 148 Def / 64 SpA / 4 SpD / 44 Spe
		Relaxed Nature
		- Earthquake
		- Hydro Pump
		- Ice Beam
		- Protect

		Blissey @ Leftovers
		Ability: Natural Cure
		EVs: 252 Def / 236 SpA / 20 Spe
		Bold Nature
		IVs: 0 Atk
		- Toxic
		- Seismic Toss
		- Ice Beam
		- Soft-Boiled

		Gengar @ Leftovers
		Ability: Levitate
		EVs: 252 HP / 48 Def / 112 SpD / 96 Spe
		Timid Nature
		IVs: 0 Atk
		- Thunderbolt
		- Ice Punch
		- Taunt
		- Will-O-Wisp

		Moltres @ Leftovers
		Ability: Pressure
		EVs: 4 Def / 252 SpA / 252 Spe
		Modest Nature
		IVs: 2 Atk / 30 SpA
		- Flamethrower
		- Hidden Power [Grass]
		- Will-O-Wisp
		- Roar


		=== [gen3ou] SkarmMag + Aerodactyl TSS by BKC ===

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 240 HP / 92 Def / 176 Spe
		Timid Nature
		IVs: 2 Atk / 30 SpA
		- Light Screen
		- Hidden Power [Grass]
		- Leech Seed
		- Recover

		Swampert @ Leftovers
		Ability: Torrent
		EVs: 240 HP / 216 Def / 52 SpD
		Bold Nature
		IVs: 0 Atk
		- Surf
		- Protect
		- Toxic
		- Refresh

		Magneton @ Leftovers
		Ability: Magnet Pull
		EVs: 4 HP / 252 SpA / 252 Spe
		Modest Nature
		IVs: 2 Atk / 30 SpA / 30 Spe
		- Thunderbolt
		- Hidden Power [Fire]
		- Toxic
		- Protect

		Skarmory @ Leftovers
		Ability: Keen Eye
		EVs: 252 HP / 232 SpD / 24 Spe
		Careful Nature
		IVs: 0 Atk
		- Spikes
		- Whirlwind
		- Toxic
		- Protect

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 240 HP / 188 SpA / 48 SpD / 32 Spe
		Quiet Nature
		IVs: 2 Atk / 30 SpA
		- Crunch
		- Pursuit
		- Fire Blast
		- Hidden Power [Grass]

		Aerodactyl @ Choice Band
		Ability: Rock Head
		EVs: 4 HP / 252 Atk / 252 Spe
		Jolly Nature
		- Rock Slide
		- Earthquake
		- Double-Edge
		- Hidden Power [Bug]


		=== [gen3ou] Molt Superman by Golden Sun ===

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 252 HP / 252 SpA / 4 SpD
		Modest Nature
		- Crunch
		- Earthquake
		- Ice Beam
		- Pursuit

		Skarmory @ Leftovers
		Ability: Keen Eye
		EVs: 252 HP / 4 Def / 252 SpD
		Careful Nature
		IVs: 0 Atk
		- Spikes
		- Roar
		- Toxic
		- Protect

		Moltres @ Leftovers
		Ability: Pressure
		EVs: 252 SpA / 4 SpD / 252 Spe
		Timid Nature
		IVs: 2 Atk / 30 SpA
		- Will-O-Wisp
		- Fire Blast
		- Hidden Power [Grass]
		- Protect

		Jirachi @ Leftovers
		Ability: Serene Grace
		EVs: 248 HP / 44 Atk / 68 Def / 100 SpD / 48 Spe
		Sassy Nature
		- Body Slam
		- Fire Punch
		- Wish
		- Protect

		Gengar @ Leftovers
		Ability: Levitate
		EVs: 248 HP / 44 Def / 8 SpA / 112 SpD / 96 Spe
		Timid Nature
		IVs: 0 Atk
		- Will-O-Wisp
		- Thunderbolt
		- Ice Punch
		- Taunt

		Flygon @ Leftovers
		Ability: Levitate
		EVs: 252 HP / 224 Def / 32 Spe
		Impish Nature
		- Earthquake
		- Toxic
		- Protect
		- Rock Slide


		=== [gen3ou] Charizard double dd jolteon mixoff inspired by Giraffe ===

		Swampert @ Salac Berry
		Ability: Torrent
		EVs: 4 Def / 252 SpA / 252 Spe
		Timid Nature
		IVs: 0 Atk
		- Substitute
		- Roar
		- Hydro Pump
		- Endeavor

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 184 HP / 72 Atk / 252 Spe
		Adamant Nature
		- Dragon Dance
		- Earthquake
		- Rock Slide
		- Double-Edge

		Metagross @ Leftovers
		Ability: Clear Body
		EVs: 168 HP / 16 Def / 252 SpA / 72 Spe
		Rash Nature
		- Meteor Mash
		- Hidden Power [Fire]
		- Psychic
		- Explosion

		Jolteon @ Leftovers
		Ability: Volt Absorb
		EVs: 4 HP / 252 SpA / 252 Spe
		Timid Nature
		IVs: 2 Atk / 30 SpA
		- Thunderbolt
		- Hidden Power [Grass]
		- Baton Pass
		- Substitute

		Charizard @ Leftovers
		Ability: Blaze
		EVs: 4 Atk / 252 SpA / 252 Spe
		Mild Nature
		- Substitute
		- Fire Blast
		- Hidden Power [Grass]
		- Focus Punch

		Salamence @ Leftovers
		Ability: Intimidate
		EVs: 116 HP / 252 Atk / 140 Spe
		Adamant Nature
		IVs: 30 SpA / 30 SpD / 30 Spe
		- Dragon Dance
		- Earthquake
		- Rock Slide
		- Hidden Power [Flying]


		=== [gen3ou] Lax wish jirachi claydol based on Astamatitos ===

		Salamence @ Leftovers
		Ability: Intimidate
		EVs: 4 Atk / 252 SpA / 252 Spe
		Rash Nature
		IVs: 30 Def / 30 SpA
		- Dragon Claw
		- Brick Break
		- Hidden Power [Grass]
		- Fire Blast

		Snorlax @ Leftovers
		Ability: Immunity
		EVs: 24 HP / 136 Atk / 176 Def / 160 SpD / 12 Spe
		Adamant Nature
		- Curse
		- Self-Destruct
		- Body Slam
		- Focus Punch

		Suicune @ Leftovers
		Ability: Pressure
		EVs: 240 HP / 252 SpA / 16 Spe
		Modest Nature
		IVs: 0 Atk
		- Calm Mind
		- Surf
		- Rest
		- Sleep Talk

		Claydol @ Leftovers
		Ability: Levitate
		EVs: 252 HP / 216 Atk / 32 SpA / 8 Spe
		Adamant Nature
		- Rapid Spin
		- Earthquake
		- Psychic
		- Explosion

		Jirachi @ Leftovers
		Ability: Serene Grace
		EVs: 252 HP / 76 Def / 180 SpD
		Sassy Nature
		- Wish
		- Hidden Power [Fighting]
		- Fire Punch
		- Body Slam

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 204 HP / 224 SpA / 80 Spe
		Quiet Nature
		- Crunch
		- Pursuit
		- Flamethrower
		- Brick Break


		=== [gen3ou] Mence yama bliss wishjira ===

		Salamence @ Leftovers
		Ability: Intimidate
		EVs: 4 Atk / 252 SpA / 252 Spe
		Mild Nature
		IVs: 30 HP / 30 Atk / 30 Def / 30 SpA / 30 SpD
		- Dragon Claw
		- Brick Break
		- Hidden Power [Grass]
		- Fire Blast

		Hariyama @ Leftovers
		Ability: Guts
		EVs: 4 HP / 96 Atk / 240 Def / 160 SpD / 8 Spe
		Adamant Nature
		IVs: 30 SpD / 30 Spe
		- Knock Off
		- Focus Punch
		- Brick Break
		- Hidden Power [Bug]

		Claydol @ Leftovers
		Ability: Levitate
		EVs: 140 HP / 252 Atk / 116 Spe
		Adamant Nature
		- Earthquake
		- Shadow Ball
		- Rapid Spin
		- Explosion

		Suicune @ Leftovers
		Ability: Pressure
		EVs: 248 HP / 184 Def / 76 Spe
		Bold Nature
		IVs: 0 Atk
		- Calm Mind
		- Surf
		- Rest
		- Roar

		Jirachi @ Leftovers
		Ability: Serene Grace
		EVs: 248 HP / 224 Def / 36 Spe
		Bold Nature
		IVs: 0 Atk
		- Wish
		- Protect
		- Toxic
		- Fire Punch

		Blissey (F) @ Leftovers
		Ability: Natural Cure
		EVs: 252 Def / 252 SpA / 4 Spe
		Modest Nature
		IVs: 0 Atk
		- Thunderbolt
		- Ice Beam
		- Soft-Boiled
		- Aromatherapy


		=== [gen3ou] Mixzap houdini ddtar mixoff ===

		Zapdos @ Leftovers
		Ability: Pressure
		EVs: 240 HP / 120 Atk / 148 Spe
		Hasty Nature
		- Drill Peck
		- Hidden Power [Grass]
		- Baton Pass
		- Thunderbolt

		Metagross @ Choice Band
		Ability: Clear Body
		EVs: 4 HP / 252 Atk / 252 Spe
		Adamant Nature
		- Meteor Mash
		- Double-Edge
		- Earthquake
		- Explosion

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 184 HP / 112 Atk / 24 Def / 188 Spe
		Adamant Nature
		- Dragon Dance
		- Rock Slide
		- Earthquake
		- Double-Edge

		Swampert @ Leftovers
		Ability: Torrent
		EVs: 240 HP / 44 Def / 180 SpA / 44 Spe
		Quiet Nature
		- Earthquake
		- Focus Punch
		- Ice Beam
		- Hydro Pump

		Jirachi @ Leftovers
		Ability: Serene Grace
		EVs: 236 HP / 52 Def / 180 SpA / 40 Spe
		Modest Nature
		IVs: 2 Atk / 30 SpA
		- Calm Mind
		- Psychic
		- Fire Punch
		- Hidden Power [Grass]

		Salamence @ Leftovers
		Ability: Intimidate
		EVs: 116 HP / 252 Atk / 140 Spe
		Adamant Nature
		IVs: 30 SpA / 30 SpD / 30 Spe
		- Dragon Dance
		- Hidden Power [Flying]
		- Rock Slide
		- Earthquake


		=== [gen3ou] Bandmeta crocune skarm beatdown ===

		Metagross @ Choice Band
		Ability: Clear Body
		EVs: 252 Atk / 12 Def / 244 Spe
		Jolly Nature
		- Meteor Mash
		- Earthquake
		- Explosion
		- Double-Edge

		Snorlax @ Leftovers
		Ability: Immunity
		EVs: 24 HP / 176 Atk / 108 Def / 184 SpD / 16 Spe
		Adamant Nature
		- Body Slam
		- Focus Punch
		- Earthquake
		- Self-Destruct

		Suicune @ Leftovers
		Ability: Pressure
		EVs: 228 HP / 212 SpA / 68 Spe
		Modest Nature
		IVs: 0 Atk
		- Calm Mind
		- Surf
		- Rest
		- Sleep Talk

		Claydol @ Leftovers
		Ability: Levitate
		EVs: 112 HP / 240 Atk / 8 Def / 148 Spe
		Adamant Nature
		- Earthquake
		- Explosion
		- Rapid Spin
		- Rock Slide

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 184 HP / 244 SpA / 80 Spe
		Quiet Nature
		- Crunch
		- Pursuit
		- Fire Blast
		- Brick Break

		Salamence @ Leftovers
		Ability: Intimidate
		EVs: 116 HP / 252 Atk / 140 Spe
		Adamant Nature
		IVs: 30 SpA / 30 SpD / 30 Spe
		- Dragon Dance
		- Hidden Power [Flying]
		- Rock Slide
		- Earthquake


		=== [gen3ou] Zard houdini cmpass by SEA ===

		Zapdos @ Leftovers
		Ability: Pressure
		EVs: 220 SpA / 48 SpD / 240 Spe
		Modest Nature
		IVs: 2 Atk / 30 SpA
		- Thunderbolt
		- Hidden Power [Grass]
		- Baton Pass
		- Roar

		Metagross @ Choice Band
		Ability: Clear Body
		EVs: 128 HP / 252 Atk / 128 Spe
		Adamant Nature
		- Meteor Mash
		- Explosion
		- Earthquake
		- Rock Slide

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 208 HP / 84 Def / 36 SpA / 180 Spe
		Timid Nature
		IVs: 2 Atk / 30 Def
		- Calm Mind
		- Giga Drain
		- Hidden Power [Ice]
		- Baton Pass

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 176 HP / 108 Atk / 56 SpD / 168 Spe
		Naughty Nature
		- Rock Slide
		- Earthquake
		- Hidden Power [Grass]
		- Dragon Dance

		Swampert @ Leftovers
		Ability: Torrent
		EVs: 252 HP / 136 SpA / 120 Spe
		Rash Nature
		- Surf
		- Substitute
		- Focus Punch
		- Ice Beam

		Charizard @ Leftovers
		Ability: Blaze
		EVs: 4 Atk / 252 SpA / 252 Spe
		Mild Nature
		- Substitute
		- Hidden Power [Grass]
		- Fire Blast
		- Focus Punch


		=== [gen3ou] Double water mixoff by Shock3600 ===

		Zapdos @ Leftovers
		Ability: Pressure
		EVs: 216 HP / 144 SpA / 148 Spe
		Timid Nature
		IVs: 3 Atk / 30 Spe
		- Thunderbolt
		- Hidden Power [Ice]
		- Thunder Wave
		- Toxic

		Swampert @ Leftovers
		Ability: Torrent
		EVs: 240 HP / 252 SpA / 16 Spe
		Quiet Nature
		- Curse
		- Hydro Pump
		- Earthquake
		- Ice Beam

		Metagross @ Leftovers
		Ability: Clear Body
		EVs: 168 HP / 16 Def / 252 SpA / 72 Spe
		Rash Nature
		- Psychic
		- Hidden Power [Fire]
		- Meteor Mash
		- Explosion

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 184 HP / 72 Atk / 252 Spe
		Adamant Nature
		- Dragon Dance
		- Rock Slide
		- Earthquake
		- Double-Edge

		Suicune @ Leftovers
		Ability: Pressure
		EVs: 252 HP / 228 SpA / 28 Spe
		Modest Nature
		IVs: 0 Atk
		- Calm Mind
		- Hydro Pump
		- Ice Beam
		- Rest

		Salamence @ Leftovers
		Ability: Intimidate
		EVs: 4 HP / 252 Atk / 252 Spe
		Adamant Nature
		- Dragon Dance
		- Hidden Power [Flying]
		- Earthquake
		- Rock Slide


		=== [gen3ou] 4 bands by Mdragon ===

		Zapdos @ Leftovers
		Ability: Pressure
		EVs: 252 HP / 20 Def / 236 SpD
		Calm Nature
		IVs: 2 Atk / 30 SpA
		- Thunderbolt
		- Hidden Power [Grass]
		- Toxic
		- Rest

		Tyranitar @ Choice Band
		Ability: Sand Stream
		EVs: 168 HP / 212 Atk / 128 Spe
		Adamant Nature
		- Rock Slide
		- Focus Punch
		- Earthquake
		- Hidden Power [Bug]

		Swampert @ Leftovers
		Ability: Torrent
		EVs: 252 HP / 216 Def / 28 SpD / 12 Spe
		Bold Nature
		- Surf
		- Toxic
		- Protect
		- Refresh

		Aerodactyl @ Choice Band
		Ability: Rock Head
		EVs: 4 HP / 252 Atk / 252 Spe
		Jolly Nature
		- Rock Slide
		- Double-Edge
		- Earthquake
		- Hidden Power [Bug]

		Dugtrio @ Choice Band
		Ability: Arena Trap
		EVs: 252 Atk / 4 SpD / 252 Spe
		Jolly Nature
		- Earthquake
		- Hidden Power [Bug]
		- Aerial Ace
		- Rock Slide

		Metagross @ Choice Band
		Ability: Clear Body
		EVs: 196 HP / 252 Atk / 60 Spe
		Adamant Nature
		- Meteor Mash
		- Explosion
		- Earthquake
		- Rock Slide


		=== [gen3ou] Jynx dug special offense by Hclat ===

		Jynx (F) @ Leftovers
		Ability: Oblivious
		EVs: 36 HP / 252 SpA / 220 Spe
		Timid Nature
		IVs: 0 Atk
		- Ice Beam
		- Calm Mind
		- Substitute
		- Lovely Kiss

		Suicune @ Leftovers
		Ability: Pressure
		EVs: 56 HP / 220 SpA / 232 Spe
		Timid Nature
		IVs: 2 Atk / 30 SpA
		- Calm Mind
		- Hydro Pump
		- Ice Beam
		- Hidden Power [Grass]

		Dugtrio @ Choice Band
		Ability: Arena Trap
		EVs: 40 HP / 144 Atk / 100 SpD / 224 Spe
		Jolly Nature
		- Earthquake
		- Beat Up
		- Hidden Power [Bug]
		- Aerial Ace

		Claydol @ Leftovers
		Ability: Levitate
		EVs: 244 HP / 204 Atk / 32 SpA / 20 SpD / 8 Spe
		Adamant Nature
		- Rapid Spin
		- Earthquake
		- Psychic
		- Explosion

		Gengar @ Leftovers
		Ability: Levitate
		EVs: 168 HP / 164 SpD / 176 Spe
		Timid Nature
		- Explosion
		- Hidden Power [Grass]
		- Thunderbolt
		- Will-O-Wisp

		Jirachi @ Leftovers
		Ability: Serene Grace
		EVs: 252 HP / 4 SpA / 252 Spe
		Timid Nature
		IVs: 0 Atk
		- Calm Mind
		- Ice Punch
		- Thunderbolt
		- Substitute


		=== [gen3ou] Zapdug dol superbi ===

		Zapdos @ Leftovers
		Ability: Pressure
		EVs: 216 HP / 112 SpA / 180 Spe
		Modest Nature
		IVs: 2 Atk / 30 Def
		- Thunderbolt
		- Hidden Power [Ice]
		- Thunder Wave
		- Baton Pass

		Dugtrio @ Choice Band
		Ability: Arena Trap
		EVs: 40 HP / 144 Atk / 100 SpD / 224 Spe
		Jolly Nature
		- Aerial Ace
		- Earthquake
		- Hidden Power [Bug]
		- Beat Up

		Suicune @ Leftovers
		Ability: Pressure
		EVs: 56 HP / 220 SpA / 232 Spe
		Timid Nature
		IVs: 2 Atk / 30 SpA
		- Calm Mind
		- Hydro Pump
		- Ice Beam
		- Hidden Power [Grass]

		Claydol @ Leftovers
		Ability: Levitate
		EVs: 252 HP / 216 Atk / 32 SpA / 8 Spe
		Adamant Nature
		- Rapid Spin
		- Earthquake
		- Psychic
		- Explosion

		Metagross @ Leftovers
		Ability: Clear Body
		EVs: 196 HP / 16 Def / 228 SpA / 68 Spe
		Rash Nature
		- Psychic
		- Meteor Mash
		- Hidden Power [Fire]
		- Explosion

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 76 HP / 252 SpA / 180 Spe
		Timid Nature
		- Calm Mind
		- Giga Drain
		- Hidden Power [Fire]
		- Psychic


		=== [gen3ou] Aero sdpass by Z0mog ===

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 252 HP / 16 Def / 240 SpA
		Quiet Nature
		- Crunch
		- Pursuit
		- Ice Beam
		- Brick Break

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 252 HP / 76 Def / 144 SpD / 36 Spe
		Bold Nature
		IVs: 0 Atk
		- Leech Seed
		- Recover
		- Swords Dance
		- Baton Pass

		Magneton @ Magnet
		Ability: Magnet Pull
		EVs: 252 SpA / 40 SpD / 216 Spe
		Timid Nature
		IVs: 2 Atk / 30 SpA
		- Thunderbolt
		- Hidden Power [Grass]
		- Thunder Wave
		- Substitute

		Swampert (F) @ Leftovers
		Ability: Torrent
		EVs: 4 Atk / 252 SpA / 252 Spe
		Rash Nature
		- Hydro Pump
		- Ice Beam
		- Earthquake
		- Focus Punch

		Metagross @ Lum Berry
		Ability: Clear Body
		EVs: 72 HP / 252 Atk / 184 Spe
		Adamant Nature
		- Meteor Mash
		- Earthquake
		- Explosion
		- Agility

		Aerodactyl @ Liechi Berry
		Ability: Rock Head
		EVs: 12 HP / 244 Atk / 252 Spe
		Jolly Nature
		- Rock Slide
		- Double-Edge
		- Earthquake
		- Substitute


		=== [gen3ou] Medicham manacune by Mana ===

		Medicham @ Lum Berry
		Ability: Pure Power
		EVs: 252 Atk / 4 SpD / 252 Spe
		Jolly Nature
		- Focus Punch
		- Brick Break
		- Rock Slide
		- Shadow Ball

		Salamence @ Leftovers
		Ability: Intimidate
		EVs: 116 HP / 252 Atk / 140 Spe
		Adamant Nature
		- Dragon Dance
		- Hidden Power [Flying]
		- Rock Slide
		- Earthquake

		Suicune @ Leftovers
		Ability: Pressure
		EVs: 216 HP / 252 SpA / 40 Spe
		Calm Nature
		IVs: 0 Atk
		- Calm Mind
		- Surf
		- Ice Beam
		- Rest

		Snorlax @ Leftovers
		Ability: Immunity
		EVs: 12 HP / 216 Atk / 104 Def / 176 SpD
		Adamant Nature
		- Body Slam
		- Earthquake
		- Self-Destruct
		- Shadow Ball

		Magneton @ Magnet
		Ability: Magnet Pull
		EVs: 4 HP / 252 SpA / 252 Spe
		Modest Nature
		IVs: 2 Atk / 30 SpA / 30 Spe
		- Thunderbolt
		- Hidden Power [Fire]
		- Thunder Wave
		- Rain Dance

		Metagross @ Leftovers
		Ability: Clear Body
		EVs: 168 HP / 232 Atk / 16 Def / 92 Spe
		Adamant Nature
		- Agility
		- Meteor Mash
		- Earthquake
		- Explosion


		=== [gen3ou] Blue offense by Noitu ===

		Suicune @ Leftovers
		Ability: Pressure
		EVs: 100 HP / 252 SpA / 156 Spe
		Modest Nature
		IVs: 0 Atk
		- Hydro Pump
		- Calm Mind
		- Ice Beam
		- Roar

		Snorlax @ Leftovers
		Ability: Immunity
		EVs: 16 HP / 244 Atk / 116 Def / 116 SpD / 16 Spe
		Adamant Nature
		- Body Slam
		- Earthquake
		- Shadow Ball
		- Self-Destruct

		Magneton @ Magnet
		Ability: Magnet Pull
		EVs: 68 HP / 252 SpA / 188 Spe
		Timid Nature
		IVs: 2 Atk / 30 SpA / 30 Spe
		- Thunderbolt
		- Hidden Power [Fire]
		- Rain Dance
		- Thunder Wave

		Salamence @ Leftovers
		Ability: Intimidate
		EVs: 4 Atk / 252 SpA / 252 Spe
		Rash Nature
		- Dragon Claw
		- Fire Blast
		- Hidden Power [Grass]
		- Brick Break

		Metagross @ Choice Band
		Ability: Clear Body
		EVs: 68 HP / 252 Atk / 188 Spe
		Adamant Nature
		- Meteor Mash
		- Earthquake
		- Rock Slide
		- Explosion

		Heracross @ Salac Berry
		Ability: Swarm
		EVs: 252 Atk / 4 SpD / 252 Spe
		Adamant Nature
		IVs: 30 HP
		- Substitute
		- Swords Dance
		- Megahorn
		- Rock Slide


		=== [gen3ou] CBmence magdol by BKC ===

		Salamence @ Choice Band
		Ability: Intimidate
		EVs: 4 HP / 252 Atk / 252 Spe
		Adamant Nature
		- Rock Slide
		- Brick Break
		- Hidden Power [Flying]
		- Earthquake

		Metagross @ Leftovers
		Ability: Clear Body
		EVs: 252 HP / 216 Atk / 16 Def / 24 Spe
		Adamant Nature
		- Earthquake
		- Explosion
		- Meteor Mash
		- Rock Slide

		Suicune @ Leftovers
		Ability: Pressure
		EVs: 252 HP / 236 Def / 20 Spe
		Bold Nature
		IVs: 0 Atk
		- Roar
		- Calm Mind
		- Rest
		- Surf

		Claydol @ Leftovers
		Ability: Levitate
		EVs: 252 HP / 60 Atk / 180 Def / 16 SpA
		Impish Nature
		- Earthquake
		- Psychic
		- Rapid Spin
		- Explosion

		Blissey (F) @ Leftovers
		Ability: Natural Cure
		EVs: 252 Def / 252 SpA / 4 Spe
		Bold Nature
		IVs: 0 Atk
		- Soft-Boiled
		- Ice Beam
		- Seismic Toss
		- Wish

		Magneton @ Leftovers
		Ability: Magnet Pull
		EVs: 4 HP / 252 SpA / 252 Spe
		Modest Nature
		IVs: 2 Atk / 30 SpA / 30 Spe
		- Thunderbolt
		- Sunny Day
		- Thunder Wave
		- Hidden Power [Fire]


		=== [gen3ou] Charizard flygon spikes by Fruhdazi ===

		Zapdos @ Leftovers
		Ability: Pressure
		EVs: 216 HP / 112 SpA / 180 Spe
		Modest Nature
		IVs: 2 Atk / 30 Def
		- Thunderbolt
		- Hidden Power [Ice]
		- Thunder Wave
		- Toxic

		Skarmory @ Leftovers
		Ability: Keen Eye
		EVs: 252 HP / 180 SpD / 76 Spe
		Careful Nature
		IVs: 0 Atk
		- Spikes
		- Roar
		- Taunt
		- Toxic

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 184 HP / 112 Atk / 32 Def / 180 Spe
		Adamant Nature
		- Dragon Dance
		- Rock Slide
		- Earthquake
		- Double-Edge

		Flygon @ Leftovers
		Ability: Levitate
		EVs: 248 HP / 216 Def / 8 SpA / 36 Spe
		Lax Nature
		- Toxic
		- Earthquake
		- Rock Slide
		- Fire Blast

		Jirachi @ Leftovers
		Ability: Serene Grace
		EVs: 236 HP / 52 Def / 180 SpA / 40 Spe
		Modest Nature
		IVs: 2 Atk / 30 SpA
		- Calm Mind
		- Psychic
		- Fire Punch
		- Hidden Power [Grass]

		Charizard @ Leftovers
		Ability: Blaze
		EVs: 4 HP / 252 SpA / 252 Spe
		Timid Nature
		IVs: 2 Atk / 30 SpA
		- Dragon Claw
		- Beat Up
		- Flamethrower
		- Hidden Power [Grass]


		=== [gen3ou] Forretress restzap mence inspired by BIHI ===

		Zapdos @ Leftovers
		Ability: Pressure
		EVs: 252 HP / 216 SpD / 40 Spe
		Calm Nature
		- Thunderbolt
		- Rest
		- Toxic
		- Roar

		Forretress @ Leftovers
		Ability: Sturdy
		EVs: 252 HP / 4 Def / 252 SpD
		Careful Nature
		- Spikes
		- Rapid Spin
		- Hidden Power [Bug]
		- Explosion

		Blissey (F) @ Leftovers
		Ability: Natural Cure
		EVs: 200 HP / 252 Def / 56 Spe
		Bold Nature
		IVs: 0 Atk
		- Soft-Boiled
		- Seismic Toss
		- Thunder Wave
		- Aromatherapy

		Swampert (F) @ Leftovers
		Ability: Torrent
		EVs: 240 HP / 148 Def / 40 SpA / 44 SpD / 36 Spe
		Relaxed Nature
		- Earthquake
		- Ice Beam
		- Hydro Pump
		- Protect

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 236 HP / 228 SpA / 44 Spe
		Quiet Nature
		- Pursuit
		- Crunch
		- Fire Blast
		- Brick Break

		Salamence @ Leftovers
		Ability: Intimidate
		EVs: 4 Atk / 252 SpA / 252 Spe
		Rash Nature
		- Dragon Claw
		- Brick Break
		- Wish
		- Fire Blast


		=== [gen3ou] Smeargle endpert mixmeta spikes ===

		Smeargle @ Salac Berry
		Ability: Own Tempo
		EVs: 60 HP / 196 SpD / 252 Spe
		Timid Nature
		- Explosion
		- Spikes
		- Spore
		- Will-O-Wisp

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 184 HP / 72 Atk / 252 Spe
		Adamant Nature
		- Dragon Dance
		- Rock Slide
		- Earthquake
		- Double-Edge

		Swampert @ Salac Berry
		Ability: Torrent
		EVs: 4 Def / 252 SpA / 252 Spe
		Timid Nature
		IVs: 0 Atk
		- Substitute
		- Endeavor
		- Hydro Pump
		- Roar

		Metagross @ Leftovers
		Ability: Clear Body
		EVs: 168 HP / 16 Def / 252 SpA / 72 Spe
		Rash Nature
		- Psychic
		- Hidden Power [Fire]
		- Meteor Mash
		- Explosion

		Gengar @ Leftovers
		Ability: Levitate
		EVs: 164 HP / 168 SpD / 176 Spe
		Timid Nature
		IVs: 30 HP / 30 SpA
		- Fire Punch
		- Hidden Power [Grass]
		- Will-O-Wisp
		- Explosion

		Aerodactyl @ Liechi Berry
		Ability: Rock Head
		EVs: 4 HP / 252 Atk / 252 Spe
		Jolly Nature
		- Double-Edge
		- Earthquake
		- Substitute
		- Rock Slide


		=== [gen3ou] Mence mie bliss spikes ===

		Salamence @ Leftovers
		Ability: Intimidate
		EVs: 4 Atk / 252 SpA / 252 Spe
		Rash Nature
		- Dragon Claw
		- Brick Break
		- Hidden Power [Grass]
		- Fire Blast

		Blissey (F) @ Leftovers
		Ability: Natural Cure
		EVs: 252 Def / 252 SpA / 4 Spe
		Modest Nature
		IVs: 0 Atk
		- Soft-Boiled
		- Ice Beam
		- Seismic Toss
		- Wish

		Skarmory
		Ability: Keen Eye
		EVs: 252 HP / 240 SpD / 16 Spe
		Careful Nature
		- Spikes
		- Roar
		- Drill Peck
		- Thief

		Metagross @ Leftovers
		Ability: Clear Body
		EVs: 252 HP / 56 Atk / 140 Def / 60 Spe
		Adamant Nature
		- Explosion
		- Protect
		- Meteor Mash
		- Earthquake

		Starmie @ Leftovers
		Ability: Natural Cure
		EVs: 252 HP / 40 SpA / 216 Spe
		Timid Nature
		- Rapid Spin
		- Recover
		- Surf
		- Thunder Wave

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 252 HP / 124 Def / 40 SpA / 60 SpD / 32 Spe
		Bold Nature
		IVs: 2 Atk / 30 SpA
		- Leech Seed
		- Recover
		- Perish Song
		- Hidden Power [Grass]


		=== [gen3ou] Vir5in by Kerts ===

		Blissey (F) @ Leftovers
		Ability: Natural Cure
		EVs: 4 HP / 252 Def / 252 SpA
		Bold Nature
		IVs: 0 Atk
		- Seismic Toss
		- Ice Beam
		- Aromatherapy
		- Soft-Boiled

		Skarmory @ Leftovers
		Ability: Keen Eye
		EVs: 248 HP / 248 SpD / 12 Spe
		Careful Nature
		- Spikes
		- Drill Peck
		- Roar
		- Protect

		Milotic (M) @ Leftovers
		Ability: Marvel Scale
		EVs: 252 HP / 252 Def / 4 Spe
		Bold Nature
		IVs: 0 Atk
		- Surf
		- Toxic
		- Refresh
		- Recover

		Claydol @ Leftovers
		Ability: Levitate
		EVs: 252 HP / 116 Def / 44 SpA / 96 SpD
		Sassy Nature
		- Earthquake
		- Psychic
		- Rapid Spin
		- Rest

		Suicune @ Leftovers
		Ability: Pressure
		EVs: 252 HP / 240 Def / 16 Spe
		Bold Nature
		IVs: 0 Atk
		- Roar
		- Surf
		- Calm Mind
		- Rest

		Dugtrio @ Choice Band
		Ability: Arena Trap
		EVs: 252 Atk / 4 SpD / 252 Spe
		Jolly Nature
		- Earthquake
		- Hidden Power [Bug]
		- Aerial Ace
		- Screech


		=== [gen3ou] Starmie agilimeta spikes by Fruhdazi ===

		Tyranitar @ Leftovers
		Ability: Sand Stream
		Hidden Power: Bug
		EVs: 184 HP / 112 Atk / 32 Def / 180 Spe
		Adamant Nature
		- Dragon Dance
		- Rock Slide
		- Earthquake
		- Double-Edge

		Skarmory @ Leftovers
		Ability: Keen Eye
		EVs: 252 HP / 252 SpD / 4 Spe
		Careful Nature
		- Spikes
		- Toxic
		- Drill Peck
		- Roar

		Metagross @ Leftovers
		Ability: Clear Body
		EVs: 168 HP / 232 Atk / 16 Def / 92 Spe
		Adamant Nature
		- Agility
		- Meteor Mash
		- Earthquake
		- Rock Slide

		Salamence @ Leftovers
		Ability: Intimidate
		EVs: 16 Atk / 240 SpA / 252 Spe
		Mild Nature
		- Dragon Claw
		- Fire Blast
		- Refresh
		- Brick Break

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 192 HP / 8 Def / 240 SpA / 68 Spe
		Modest Nature
		IVs: 2 Atk / 30 SpA / 30 Spe
		- Leech Seed
		- Psychic
		- Giga Drain
		- Hidden Power [Fire]

		Starmie @ Leftovers
		Ability: Natural Cure
		EVs: 252 SpA / 4 SpD / 252 Spe
		Timid Nature
		IVs: 0 Atk
		- Surf
		- Ice Beam
		- Thunderbolt
		- Rapid Spin


		=== [gen3ou] Joltspikes by Kerts ===

		Skarmory @ Leftovers
		Ability: Keen Eye
		EVs: 252 HP / 252 SpD / 4 Spe
		Careful Nature
		IVs: 0 Atk
		- Spikes
		- Roar
		- Toxic
		- Protect

		Jolteon @ Leftovers
		Ability: Volt Absorb
		EVs: 4 HP / 252 SpA / 252 Spe
		Timid Nature
		IVs: 2 Atk / 30 SpA
		- Thunderbolt
		- Thunder Wave
		- Hidden Power [Grass]
		- Baton Pass

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 252 HP / 252 Atk / 4 Def
		Adamant Nature
		IVs: 30 SpD / 30 Spe
		- Focus Punch
		- Earthquake
		- Hidden Power [Bug]
		- Rock Slide

		Gengar @ Leftovers
		Ability: Levitate
		EVs: 40 HP / 252 SpA / 216 Spe
		Hasty Nature
		- Ice Punch
		- Fire Punch
		- Hidden Power [Grass]
		- Explosion

		Metagross @ Choice Band
		Ability: Clear Body
		EVs: 68 HP / 252 Atk / 188 Spe
		Adamant Nature
		- Meteor Mash
		- Earthquake
		- Rock Slide
		- Explosion

		Starmie @ Leftovers
		Ability: Natural Cure
		EVs: 4 HP / 252 SpA / 252 Spe
		Timid Nature
		IVs: 0 Atk
		- Hydro Pump
		- Thunderbolt
		- Ice Beam
		- Psychic


		=== [gen3ou] Aerobi zapdos by Fruhdazi ===

		Zapdos @ Leftovers
		Ability: Pressure
		EVs: 216 HP / 92 SpA / 200 Spe
		Modest Nature
		IVs: 2 Atk / 30 Def
		- Thunder Wave
		- Toxic
		- Thunderbolt
		- Hidden Power [Ice]

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 184 HP / 112 Atk / 32 Def / 180 Spe
		Adamant Nature
		- Dragon Dance
		- Rock Slide
		- Earthquake
		- Double-Edge

		Skarmory @ Leftovers
		Ability: Keen Eye
		EVs: 252 HP / 184 SpD / 72 Spe
		Careful Nature
		- Spikes
		- Roar
		- Taunt
		- Drill Peck

		Swampert @ Leftovers
		Ability: Torrent
		EVs: 240 HP / 88 Def / 164 SpA / 16 Spe
		Quiet Nature
		- Hydro Pump
		- Earthquake
		- Ice Beam
		- Curse

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 192 HP / 8 Def / 128 SpA / 180 Spe
		Modest Nature
		IVs: 2 Atk / 30 SpA / 30 Spe
		- Leech Seed
		- Psychic
		- Giga Drain
		- Hidden Power [Fire]

		Aerodactyl @ Choice Band
		Ability: Rock Head
		EVs: 4 HP / 252 Atk / 252 Spe
		Jolly Nature
		- Rock Slide
		- Double-Edge
		- Earthquake
		- Hidden Power [Bug]


		=== [gen3ou] Gengar jirachi superman ===

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 252 HP / 244 SpA / 12 Spe
		Modest Nature
		IVs: 30 HP / 30 SpA
		- Pursuit
		- Crunch
		- Fire Blast
		- Hidden Power [Grass]

		Skarmory (M) @ Leftovers
		Ability: Keen Eye
		EVs: 252 HP / 4 Def / 252 SpD
		Careful Nature
		- Spikes
		- Drill Peck
		- Roar
		- Protect

		Flygon (M) @ Leftovers
		Ability: Levitate
		EVs: 248 HP / 216 Def / 12 SpD / 32 Spe
		Impish Nature
		- Earthquake
		- Rock Slide
		- Toxic
		- Protect

		Zapdos @ Leftovers
		Ability: Pressure
		EVs: 224 HP / 252 SpD / 32 Spe
		Calm Nature
		IVs: 0 Atk
		- Thunderbolt
		- Roar
		- Rest
		- Toxic

		Gengar @ Leftovers
		Ability: Levitate
		EVs: 168 HP / 164 SpD / 176 Spe
		Timid Nature
		IVs: 0 Atk
		- Destiny Bond
		- Taunt
		- Will-O-Wisp
		- Thunderbolt

		Jirachi @ Leftovers
		Ability: Serene Grace
		EVs: 252 HP / 76 Def / 148 SpD / 32 Spe
		Calm Nature
		IVs: 0 Atk
		- Wish
		- Protect
		- Toxic
		- Fire Punch


		=== [gen3ou] El clasico by Hclat ===

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 252 HP / 80 Atk / 176 Spe
		Adamant Nature
		IVs: 30 SpD / 30 Spe
		- Dragon Dance
		- Hidden Power [Bug]
		- Earthquake
		- Rock Slide

		Skarmory @ Leftovers
		Ability: Keen Eye
		EVs: 248 HP / 244 SpD / 16 Spe
		Careful Nature
		- Spikes
		- Drill Peck
		- Protect
		- Roar

		Swampert @ Leftovers
		Ability: Torrent
		EVs: 252 HP / 168 Def / 88 SpD
		Bold Nature
		IVs: 0 Atk
		- Protect
		- Surf
		- Toxic
		- Refresh

		Gengar @ Leftovers
		Ability: Levitate
		EVs: 80 HP / 16 SpA / 236 SpD / 176 Spe
		Modest Nature
		IVs: 0 Atk
		- Taunt
		- Will-O-Wisp
		- Giga Drain
		- Thunderbolt

		Zapdos @ Leftovers
		Ability: Pressure
		EVs: 252 HP / 60 SpA / 196 Spe
		Modest Nature
		IVs: 2 Atk / 30 Def
		- Thunderbolt
		- Protect
		- Hidden Power [Ice]
		- Toxic

		Aerodactyl @ Choice Band
		Ability: Rock Head
		EVs: 224 Atk / 32 SpD / 252 Spe
		Jolly Nature
		- Earthquake
		- Rock Slide
		- Double-Edge
		- Hidden Power [Bug]


		=== [gen3ou] Mixmence claydol spikes ===

		Tyranitar @ Leftovers
		Ability: Sand Stream
		EVs: 184 HP / 116 Atk / 20 Def / 188 Spe
		Adamant Nature
		- Dragon Dance
		- Rock Slide
		- Earthquake
		- Hidden Power [Bug]

		Skarmory @ Leftovers
		Ability: Keen Eye
		EVs: 252 HP / 252 SpD / 4 Spe
		Careful Nature
		- Spikes
		- Roar
		- Protect
		- Drill Peck

		Blissey (F) @ Leftovers
		Ability: Natural Cure
		EVs: 252 Def / 228 SpA / 28 Spe
		Modest Nature
		IVs: 0 Atk
		- Thunderbolt
		- Calm Mind
		- Ice Beam
		- Soft-Boiled

		Metagross @ Leftovers
		Ability: Clear Body
		EVs: 252 HP / 56 Atk / 140 Def / 60 Spe
		Adamant Nature
		- Explosion
		- Protect
		- Meteor Mash
		- Earthquake

		Salamence @ Leftovers
		Ability: Intimidate
		EVs: 4 Atk / 252 SpA / 252 Spe
		Mild Nature
		IVs: 30 HP / 30 SpA
		- Dragon Claw
		- Brick Break
		- Hidden Power [Grass]
		- Flamethrower

		Claydol @ Leftovers
		Ability: Levitate
		EVs: 252 HP / 196 Atk / 60 Spe
		Adamant Nature
		- Earthquake
		- Psychic
		- Explosion
		- Rapid Spin


		=== [gen3ou] Beerlover by UD ===

		Tyranitar (F) @ Leftovers
		Ability: Sand Stream
		EVs: 248 HP / 252 Atk / 8 Spe
		Adamant Nature
		- Earthquake
		- Rock Slide
		- Hidden Power [Bug]
		- Focus Punch

		Skarmory (F) @ Leftovers
		Ability: Keen Eye
		EVs: 252 HP / 236 SpD / 20 Spe
		Careful Nature
		IVs: 0 Atk
		- Spikes
		- Protect
		- Roar
		- Toxic

		Blissey @ Leftovers
		Ability: Natural Cure
		EVs: 252 Def / 112 SpA / 144 Spe
		Modest Nature
		IVs: 0 Atk
		- Soft-Boiled
		- Ice Beam
		- Toxic
		- Fire Blast

		Swampert (F) @ Leftovers
		Ability: Torrent
		EVs: 248 HP / 160 Def / 84 SpA / 4 SpD / 12 Spe
		Relaxed Nature
		- Earthquake
		- Ice Beam
		- Hydro Pump
		- Protect

		Gengar (F) @ Leftovers
		Ability: Levitate
		EVs: 248 HP / 8 Atk / 44 Def / 12 SpA / 100 SpD / 96 Spe
		Timid Nature
		- Fire Punch
		- Giga Drain
		- Explosion
		- Will-O-Wisp

		Starmie @ Leftovers
		Ability: Natural Cure
		EVs: 4 HP / 252 SpA / 252 Spe
		Timid Nature
		IVs: 0 Atk
		- Hydro Pump
		- Ice Beam
		- Thunderbolt
		- Rapid Spin


		=== [gen3ou] Monoblissey skarmmag by ABR ===

		Skarmory (M) @ Leftovers
		Ability: Keen Eye
		EVs: 252 HP / 4 Def / 252 SpD
		Careful Nature
		- Spikes
		- Drill Peck
		- Roar
		- Protect

		Magneton @ Magnet
		Ability: Magnet Pull
		EVs: 48 HP / 252 SpA / 208 Spe
		Modest Nature
		- Substitute
		- Thunderbolt
		- Hidden Power [Fire]
		- Toxic

		Blissey (F) @ Leftovers
		Ability: Natural Cure
		EVs: 208 HP / 252 Def / 48 Spe
		Bold Nature
		- Thunder Wave
		- Seismic Toss
		- Aromatherapy
		- Soft-Boiled

		Swampert @ Leftovers
		Ability: Torrent
		EVs: 252 HP / 168 Def / 88 SpD
		Relaxed Nature
		- Curse
		- Rest
		- Earthquake
		- Ice Beam

		Celebi @ Leftovers
		Ability: Natural Cure
		EVs: 252 HP / 192 Def / 64 SpD
		Bold Nature
		- Leech Seed
		- Hidden Power [Grass]
		- Perish Song
		- Recover

		Aerodactyl (M) @ Choice Band
		Ability: Rock Head
		EVs: 252 Atk / 4 SpD / 252 Spe
		Adamant Nature
		IVs: 30 SpD / 30 Spe
		- Rock Slide
		- Double-Edge
		- Earthquake
		- Hidden Power [Bug]

	`
, undefined, false);

function randomIntFromInterval(max) {
	return Math.floor(Math.random() * (max));
}

export class RandomGen3Teams extends RandomGen4Teams {
	randomTeam() {
		const selectedTeam = sampleTeamsData[randomIntFromInterval(sampleTeamsData.length)];
		const members = [];
		for (const member of selectedTeam.team) {
			members.push({
				...member,
				name: member['species'],
				level: 100,
				shiny: this.randomChance(1, 8192),
			});
		}
		return members;
	}
}

export default RandomGen3Teams;
