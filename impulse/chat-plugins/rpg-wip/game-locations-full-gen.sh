#!/bin/bash

# This script generates a comprehensive Pokemon RPG game spanning Kanto to Paldea

OUTPUT_FILE="impulse/chat-plugins/rpg-wip/game-locations.ts"

cat > "$OUTPUT_FILE" << 'EOF'
/**
 * Game Locations Configuration
 *
 * Complete Pokemon RPG story spanning 9 regions from Kanto to Paldea.
 * Features exciting routes, caves, towns with progressive difficulty.
 * Level caps are enforced based on badges to prevent over-leveling.
 *
 * LEVEL PROGRESSION:
 * - Kanto (Badges 0-8): Levels 5-55
 * - Johto (Badges 9-16): Levels 55-75
 * - Hoenn (Badges 17-24): Levels 70-85
 * - Sinnoh (Badges 25-32): Levels 80-92
 * - Unova (Badges 33-40): Levels 88-97
 * - Kalos (Badges 41-48): Levels 94-99
 * - Alola (Badges 49-56): Levels 98-100
 * - Galar (Badges 57-64): Levels 100
 * - Paldea (Badges 65-72): Levels 100
 */

// ============================================================================
// LEVEL CAPS BY BADGE COUNT (Prevents Over-leveling)
// ============================================================================

export const LEVEL_CAPS: Record<number, number> = {
// Kanto badges (0-8)
0: 15, 1: 20, 2: 25, 3: 30, 4: 35, 5: 40, 6: 45, 7: 50, 8: 55,
// Johto badges (9-16)
9: 58, 10: 61, 11: 64, 12: 66, 13: 68, 14: 70, 15: 72, 16: 75,
// Hoenn badges (17-24)
17: 77, 18: 79, 19: 81, 20: 83, 21: 84, 22: 85, 23: 86, 24: 88,
// Sinnoh badges (25-32)
25: 89, 26: 90, 27: 91, 28: 92, 29: 93, 30: 94, 31: 95, 32: 96,
// Unova badges (33-40)
33: 96, 34: 97, 35: 97, 36: 98, 37: 98, 38: 99, 39: 99, 40: 100,
// Kalos badges (41-48)
41: 100, 42: 100, 43: 100, 44: 100, 45: 100, 46: 100, 47: 100, 48: 100,
// Alola trials (49-56)
49: 100, 50: 100, 51: 100, 52: 100, 53: 100, 54: 100, 55: 100, 56: 100,
// Galar badges (57-64)
57: 100, 58: 100, 59: 100, 60: 100, 61: 100, 62: 100, 63: 100, 64: 100,
// Paldea badges (65-72)
65: 100, 66: 100, 67: 100, 68: 100, 69: 100, 70: 100, 71: 100, 72: 100,
};

// ============================================================================
// LOCATIONS
// ============================================================================

export const LOCATIONS: Record<string, any> = {
// ========================================================================
// KANTO REGION (Badges 0-8) - Where it all begins!
// ========================================================================

pallettown: {
id: 'pallettown',
name: 'Pallet Town',
type: 'town',
region: 'kanto',
description: 'A quiet town where dreams and adventures begin. Professor Oak awaits you!',
connectedLocations: [{ id: 'route1', name: 'Route 1' }],
buildings: [
{ id: 'oakslab', name: "Professor Oak's Lab", type: 'lab', accessible: true, npcs: ['professoroak'] },
{ id: 'palletmart', name: 'Pallet Mart', type: 'pokemart', accessible: true },
],
encounterZones: [],
},

route1: {
id: 'route1',
name: 'Route 1',
type: 'route',
region: 'kanto',
description: 'The first route! Wild Pokemon lurk in the tall grass.',
connectedLocations: [{ id: 'pallettown', name: 'Pallet Town' }, { id: 'viridiancity', name: 'Viridian City' }],
buildings: [],
encounterZones: ['kanto_route1'],
},

viridiancity: {
id: 'viridiancity',
name: 'Viridian City',
type: 'town',
region: 'kanto',
description: 'A beautiful city with a mysterious Gym. The leader is nowhere to be found...',
connectedLocations: [
{ id: 'route1', name: 'Route 1' },
{ id: 'route2', name: 'Route 2' },
{ id: 'route22', name: 'Route 22' },
],
buildings: [
{ id: 'viridiangym', name: 'Viridian Gym', type: 'gym', accessible: false, gymLeader: 'giovanni' },
{ id: 'viridianmart', name: 'Viridian Mart', type: 'pokemart', accessible: true },
],
encounterZones: [],
},

route2: {
id: 'route2',
name: 'Route 2',
type: 'route',
region: 'kanto',
description: 'A forested path leading to Viridian Forest and Pewter City.',
connectedLocations: [
{ id: 'viridiancity', name: 'Viridian City' },
{ id: 'viridianforest', name: 'Viridian Forest' },
{ id: 'pewtercity', name: 'Pewter City' },
],
buildings: [],
encounterZones: ['kanto_route2'],
},

viridianforest: {
id: 'viridianforest',
name: 'Viridian Forest',
type: 'forest',
region: 'kanto',
description: 'A dark, mysterious forest teeming with Bug Pokemon and trainers!',
connectedLocations: [{ id: 'route2', name: 'Route 2' }],
buildings: [],
encounterZones: ['kanto_viridianforest'],
},

pewtercity: {
id: 'pewtercity',
name: 'Pewter City',
type: 'town',
region: 'kanto',
description: 'A rugged city known for Rock Pokemon. Brock awaits challengers at his Gym!',
connectedLocations: [
{ id: 'route2', name: 'Route 2' },
{ id: 'route3', name: 'Route 3' },
],
buildings: [
{ id: 'pewtergym', name: 'Pewter Gym', type: 'gym', accessible: true, gymLeader: 'brock' },
{ id: 'pewtermart', name: 'Pewter Mart', type: 'pokemart', accessible: true },
{ id: 'pewtermuseum', name: 'Pewter Museum', type: 'building', accessible: true },
],
encounterZones: [],
},

route3: {
id: 'route3',
name: 'Route 3',
type: 'route',
region: 'kanto',
description: 'A rocky mountain path filled with eager trainers. Mt. Moon lies ahead!',
connectedLocations: [
{ id: 'pewtercity', name: 'Pewter City' },
{ id: 'mtmoon', name: 'Mt. Moon' },
],
buildings: [{ id: 'route3center', name: 'Pokemon Center', type: 'pokecenter', accessible: true }],
encounterZones: ['kanto_route3'],
},

mtmoon: {
id: 'mtmoon',
name: 'Mt. Moon',
type: 'cave',
region: 'kanto',
description: 'A massive cave filled with mysteries, fossils, and Team Rocket grunts!',
connectedLocations: [
{ id: 'route3', name: 'Route 3' },
{ id: 'route4', name: 'Route 4' },
],
buildings: [],
encounterZones: ['kanto_mtmoon'],
},

route4: {
id: 'route4',
name: 'Route 4',
type: 'route',
region: 'kanto',
description: 'A winding trail descending from Mt. Moon toward Cerulean City.',
connectedLocations: [
{ id: 'mtmoon', name: 'Mt. Moon' },
{ id: 'ceruleancity', name: 'Cerulean City' },
],
buildings: [],
encounterZones: ['kanto_route4'],
},

ceruleancity: {
id: 'ceruleancity',
name: 'Cerulean City',
type: 'town',
region: 'kanto',
description: 'A beautiful water-themed city. Misty guards the Cascade Badge!',
connectedLocations: [
{ id: 'route4', name: 'Route 4' },
{ id: 'route24', name: 'Route 24' },
{ id: 'route5', name: 'Route 5' },
{ id: 'route9', name: 'Route 9' },
],
buildings: [
{ id: 'ceruleangym', name: 'Cerulean Gym', type: 'gym', accessible: true, gymLeader: 'misty' },
{ id: 'ceruleanmart', name: 'Cerulean Mart', type: 'pokemart', accessible: true },
],
encounterZones: [],
},

route24: {
id: 'route24',
name: 'Route 24 (Nugget Bridge)',
type: 'route',
region: 'kanto',
description: 'Famous Nugget Bridge! Five trainers stand in your way.',
connectedLocations: [
{ id: 'ceruleancity', name: 'Cerulean City' },
{ id: 'route25', name: 'Route 25' },
],
buildings: [],
encounterZones: ['kanto_route24'],
},

route25: {
id: 'route25',
name: 'Route 25',
type: 'route',
region: 'kanto',
description: "A scenic path leading to Bill's cottage by the sea.",
connectedLocations: [{ id: 'route24', name: 'Route 24' }],
buildings: [{ id: 'billshouse', name: "Bill's House", type: 'house', accessible: true, npcs: ['bill'] }],
encounterZones: ['kanto_route25'],
},

route5: {
id: 'route5',
name: 'Route 5',
type: 'route',
region: 'kanto',
description: 'A route leading south toward Saffron City.',
connectedLocations: [
{ id: 'ceruleancity', name: 'Cerulean City' },
{ id: 'undergroundpath5', name: 'Underground Path' },
],
buildings: [{ id: 'daycarekantoroute5', name: 'Pokemon Day Care', type: 'daycare', accessible: true }],
encounterZones: ['kanto_route5'],
},

undergroundpath5: {
id: 'undergroundpath5',
name: 'Underground Path 5-6',
type: 'tunnel',
region: 'kanto',
description: 'A subway tunnel connecting Routes 5 and 6.',
connectedLocations: [
{ id: 'route5', name: 'Route 5' },
{ id: 'route6', name: 'Route 6' },
],
buildings: [],
encounterZones: [],
},

route6: {
id: 'route6',
name: 'Route 6',
type: 'route',
region: 'kanto',
description: 'A southern route connecting to Vermilion City.',
connectedLocations: [
{ id: 'undergroundpath5', name: 'Underground Path' },
{ id: 'vermilioncity', name: 'Vermilion City' },
],
buildings: [],
encounterZones: ['kanto_route6'],
},

vermilioncity: {
id: 'vermilioncity',
name: 'Vermilion City',
type: 'town',
region: 'kanto',
description: 'A bustling port city. Lt. Surge commands the Electric-type Gym!',
connectedLocations: [
{ id: 'route6', name: 'Route 6' },
{ id: 'route11', name: 'Route 11' },
],
buildings: [
{ id: 'vermiliongym', name: 'Vermilion Gym', type: 'gym', accessible: true, gymLeader: 'surge' },
{ id: 'vermilionmart', name: 'Vermilion Mart', type: 'pokemart', accessible: true },
{ id: 'vermiliondocks', name: 'S.S. Anne Dock', type: 'building', accessible: true },
],
encounterZones: [],
},

route11: {
id: 'route11',
name: 'Route 11',
type: 'route',
region: 'kanto',
description: 'An eastern route with many trainers. Diglett Cave is here!',
connectedLocations: [
{ id: 'vermilioncity', name: 'Vermilion City' },
{ id: 'diglettscave', name: "Diglett's Cave" },
],
buildings: [],
encounterZones: ['kanto_route11'],
},

diglettscave: {
id: 'diglettscave',
name: "Diglett's Cave",
type: 'cave',
region: 'kanto',
description: 'A tunnel dug by countless Diglett. Connects back to Route 2!',
connectedLocations: [
{ id: 'route11', name: 'Route 11' },
{ id: 'route2', name: 'Route 2' },
],
buildings: [],
encounterZones: ['kanto_diglettscave'],
},

route9: {
id: 'route9',
name: 'Route 9',
type: 'route',
region: 'kanto',
description: 'A rocky mountain path leading to the Rock Tunnel.',
connectedLocations: [
{ id: 'ceruleancity', name: 'Cerulean City' },
{ id: 'rocktunnel', name: 'Rock Tunnel' },
],
buildings: [],
encounterZones: ['kanto_route9'],
},

rocktunnel: {
id: 'rocktunnel',
name: 'Rock Tunnel',
type: 'cave',
region: 'kanto',
description: 'A pitch-black cave. You need Flash to see! Many trainers hide within.',
connectedLocations: [
{ id: 'route9', name: 'Route 9' },
{ id: 'route10', name: 'Route 10' },
],
buildings: [],
encounterZones: ['kanto_rocktunnel'],
},

route10: {
id: 'route10',
name: 'Route 10',
type: 'route',
region: 'kanto',
description: 'A route near the Power Plant, leading to Lavender Town.',
connectedLocations: [
{ id: 'rocktunnel', name: 'Rock Tunnel' },
{ id: 'lavendertown', name: 'Lavender Town' },
],
buildings: [{ id: 'powerplant', name: 'Power Plant', type: 'building', accessible: true }],
encounterZones: ['kanto_route10'],
},

lavendertown: {
id: 'lavendertown',
name: 'Lavender Town',
type: 'town',
region: 'kanto',
description: 'A somber town with a haunting atmosphere. Pokemon Tower holds many secrets...',
connectedLocations: [
{ id: 'route10', name: 'Route 10' },
{ id: 'route8', name: 'Route 8' },
{ id: 'route12', name: 'Route 12' },
],
buildings: [
{ id: 'pokemontower', name: 'Pokemon Tower', type: 'tower', accessible: true },
{ id: 'lavendermart', name: 'Lavender Mart', type: 'pokemart', accessible: true },
],
encounterZones: [],
},

pokemontower: {
id: 'pokemontower',
name: 'Pokemon Tower',
type: 'tower',
region: 'kanto',
description: 'A seven-story memorial for Pokemon spirits. Ghost Pokemon haunt these halls...',
connectedLocations: [{ id: 'lavendertown', name: 'Lavender Town' }],
buildings: [],
encounterZones: ['kanto_pokemontower'],
},

route8: {
id: 'route8',
name: 'Route 8',
type: 'route',
region: 'kanto',
description: 'A route connecting Lavender Town back to Saffron City.',
connectedLocations: [
{ id: 'lavendertown', name: 'Lavender Town' },
{ id: 'saffroncity', name: 'Saffron City' },
],
buildings: [{ id: 'undergroundpath7', name: 'Underground Path 7-8', type: 'tunnel', accessible: true }],
encounterZones: ['kanto_route8'],
},

route7: {
id: 'route7',
name: 'Route 7',
type: 'route',
region: 'kanto',
description: 'A short route connecting Celadon City to Saffron City.',
connectedLocations: [
{ id: 'celadoncity', name: 'Celadon City' },
{ id: 'saffroncity', name: 'Saffron City' },
],
buildings: [{ id: 'undergroundpath7b', name: 'Underground Path 7-8', type: 'tunnel', accessible: true }],
encounterZones: ['kanto_route7'],
},

saffroncity: {
id: 'saffroncity',
name: 'Saffron City',
type: 'town',
region: 'kanto',
description: 'The central metropolis of Kanto. Sabrina awaits in her Psychic Gym. Silph Co. is here!',
connectedLocations: [
{ id: 'route5', name: 'Route 5' },
{ id: 'route6', name: 'Route 6' },
{ id: 'route7', name: 'Route 7' },
{ id: 'route8', name: 'Route 8' },
],
buildings: [
{ id: 'saffrong ym', name: 'Saffron Gym', type: 'gym', accessible: true, gymLeader: 'sabrina' },
{ id: 'saffronmart', name: 'Saffron Mart', type: 'pokemart', accessible: true },
{ id: 'silphco', name: 'Silph Co.', type: 'building', accessible: true },
],
encounterZones: [],
},

silphco: {
id: 'silphco',
name: 'Silph Co.',
type: 'building',
region: 'kanto',
description: 'A massive corporate building. Team Rocket has taken over!',
connectedLocations: [{ id: 'saffroncity', name: 'Saffron City' }],
buildings: [],
encounterZones: ['kanto_silphco'],
},

celadoncity: {
id: 'celadoncity',
name: 'Celadon City',
type: 'town',
region: 'kanto',
description: 'The largest city in Kanto! Erika trains Grass Pokemon. The Game Corner is here!',
connectedLocations: [
{ id: 'route7', name: 'Route 7' },
{ id: 'route16', name: 'Route 16' },
],
buildings: [
{ id: 'celadongym', name: 'Celadon Gym', type: 'gym', accessible: true, gymLeader: 'erika' },
{ id: 'celadonmart', name: 'Celadon Department Store', type: 'pokemart', accessible: true },
{ id: 'gamecorner', name: 'Game Corner', type: 'building', accessible: true },
{ id: 'rocketbasement', name: 'Team Rocket Hideout', type: 'building', accessible: false },
],
encounterZones: [],
},

route16: {
id: 'route16',
name: 'Route 16',
type: 'route',
region: 'kanto',
description: 'The entrance to Cycling Road! Bike required to pass.',
connectedLocations: [
{ id: 'celadoncity', name: 'Celadon City' },
{ id: 'route17', name: 'Route 17' },
],
buildings: [],
encounterZones: ['kanto_route16'],
},

route17: {
id: 'route17',
name: 'Route 17 (Cycling Road)',
type: 'route',
region: 'kanto',
description: 'A thrilling downhill bike ride! Watch out for trainers!',
connectedLocations: [
{ id: 'route16', name: 'Route 16' },
{ id: 'route18', name: 'Route 18' },
],
buildings: [],
encounterZones: ['kanto_route17'],
},

route18: {
id: 'route18',
name: 'Route 18',
type: 'route',
region: 'kanto',
description: 'The end of Cycling Road, leading to Fuchsia City.',
connectedLocations: [
{ id: 'route17', name: 'Route 17' },
{ id: 'fuchsiacity', name: 'Fuchsia City' },
],
buildings: [],
encounterZones: ['kanto_route18'],
},

route12: {
id: 'route12',
name: 'Route 12',
type: 'route',
region: 'kanto',
description: 'A coastal route. A sleeping Snorlax blocks the southern path!',
connectedLocations: [
{ id: 'lavendertown', name: 'Lavender Town' },
{ id: 'route13', name: 'Route 13' },
],
buildings: [],
encounterZones: ['kanto_route12'],
},

route13: {
id: 'route13',
name: 'Route 13',
type: 'route',
region: 'kanto',
description: 'A coastal route filled with trainers eager to battle.',
connectedLocations: [
{ id: 'route12', name: 'Route 12' },
{ id: 'route14', name: 'Route 14' },
],
buildings: [],
encounterZones: ['kanto_route13'],
},

route14: {
id: 'route14',
name: 'Route 14',
type: 'route',
region: 'kanto',
description: 'More trainers line this coastal path to Fuchsia City.',
connectedLocations: [
{ id: 'route13', name: 'Route 13' },
{ id: 'route15', name: 'Route 15' },
],
buildings: [],
encounterZones: ['kanto_route14'],
},

route15: {
id: 'route15',
name: 'Route 15',
type: 'route',
region: 'kanto',
description: 'The final coastal route before reaching Fuchsia City.',
connectedLocations: [
{ id: 'route14', name: 'Route 14' },
{ id: 'fuchsiacity', name: 'Fuchsia City' },
],
buildings: [],
encounterZones: ['kanto_route15'],
},

fuchsiacity: {
id: 'fuchsiacity',
name: 'Fuchsia City',
type: 'town',
region: 'kanto',
description: 'Home to the Safari Zone and Koga, master of Poison Pokemon!',
connectedLocations: [
{ id: 'route15', name: 'Route 15' },
{ id: 'route18', name: 'Route 18' },
{ id: 'route19', name: 'Route 19' },
],
buildings: [
{ id: 'fuchsiagym', name: 'Fuchsia Gym', type: 'gym', accessible: true, gymLeader: 'koga' },
{ id: 'fuchsiamart', name: 'Fuchsia Mart', type: 'pokemart', accessible: true },
{ id: 'safarizone', name: 'Safari Zone', type: 'special', accessible: true },
],
encounterZones: [],
},

safarizone: {
id: 'safarizone',
name: 'Safari Zone',
type: 'special',
region: 'kanto',
description: 'A wildlife preserve with rare Pokemon! Limited steps and Safari Balls.',
connectedLocations: [{ id: 'fuchsiacity', name: 'Fuchsia City' }],
buildings: [],
encounterZones: ['kanto_safarizone'],
},

route19: {
id: 'route19',
name: 'Route 19',
type: 'route',
region: 'kanto',
description: 'A water route. Surf south toward the Seafoam Islands!',
connectedLocations: [
{ id: 'fuchsiacity', name: 'Fuchsia City' },
{ id: 'route20', name: 'Route 20' },
],
buildings: [],
encounterZones: ['kanto_route19_water'],
},

route20: {
id: 'route20',
name: 'Route 20',
type: 'route',
region: 'kanto',
description: 'An ocean route passing the mysterious Seafoam Islands.',
connectedLocations: [
{ id: 'route19', name: 'Route 19' },
{ id: 'seafoamislands', name: 'Seafoam Islands' },
{ id: 'route21', name: 'Route 21' },
],
buildings: [],
encounterZones: ['kanto_route20_water'],
},

seafoamislands: {
id: 'seafoamislands',
name: 'Seafoam Islands',
type: 'cave',
region: 'kanto',
description: 'Icy caverns where the legendary Articuno is said to dwell!',
connectedLocations: [{ id: 'route20', name: 'Route 20' }],
buildings: [],
encounterZones: ['kanto_seafoamislands'],
},

route21: {
id: 'route21',
name: 'Route 21',
type: 'route',
region: 'kanto',
description: 'A southern sea route leading to Cinnabar Island.',
connectedLocations: [
{ id: 'route20', name: 'Route 20' },
{ id: 'cinnabarisland', name: 'Cinnabar Island' },
],
buildings: [],
encounterZones: ['kanto_route21_water'],
},

cinnabarisland: {
id: 'cinnabarisland',
name: 'Cinnabar Island',
type: 'town',
region: 'kanto',
description: 'A volcanic island with a Pokemon Lab. Blaine tests trainers with fire and riddles!',
connectedLocations: [{ id: 'route21', name: 'Route 21' }],
buildings: [
{ id: 'cinnabargym', name: 'Cinnabar Gym', type: 'gym', accessible: true, gymLeader: 'blaine' },
{ id: 'cinnabarmart', name: 'Cinnabar Mart', type: 'pokemart', accessible: true },
{ id: 'pokemonlab', name: 'Pokemon Lab', type: 'lab', accessible: true },
{ id: 'pokemonmansion', name: 'Pokemon Mansion', type: 'building', accessible: true },
],
encounterZones: [],
},

pokemonmansion: {
id: 'pokemonmansion',
name: 'Pokemon Mansion',
type: 'building',
region: 'kanto',
description: 'An abandoned, burning mansion with dark secrets about Mewtwo...',
connectedLocations: [{ id: 'cinnabarisland', name: 'Cinnabar Island' }],
buildings: [],
encounterZones: ['kanto_pokemonmansion'],
},

route22: {
id: 'route22',
name: 'Route 22',
type: 'route',
region: 'kanto',
description: 'A western route where your rival awaits! Victory Road entrance is here.',
connectedLocations: [
{ id: 'viridiancity', name: 'Viridian City' },
{ id: 'route23', name: 'Route 23' },
],
buildings: [],
encounterZones: ['kanto_route22'],
},

route23: {
id: 'route23',
name: 'Route 23',
type: 'route',
region: 'kanto',
description: 'The final route! All 8 badges required to proceed to Victory Road!',
connectedLocations: [
{ id: 'route22', name: 'Route 22' },
{ id: 'victoryroad', name: 'Victory Road' },
],
buildings: [],
encounterZones: ['kanto_route23'],
},

victoryroad: {
id: 'victoryroad',
name: 'Victory Road',
type: 'cave',
region: 'kanto',
description: 'A treacherous cave maze. Only the strongest trainers make it through!',
connectedLocations: [
{ id: 'route23', name: 'Route 23' },
{ id: 'indigoplateau', name: 'Indigo Plateau' },
],
buildings: [],
encounterZones: ['kanto_victoryroad'],
},

indigoplateau: {
id: 'indigoplateau',
name: 'Indigo Plateau',
type: 'town',
region: 'kanto',
description: 'The Pokemon League! Face the Elite Four and become the Champion!',
connectedLocations: [{ id: 'victoryroad', name: 'Victory Road' }],
buildings: [
{ id: 'pokemoncenter', name: 'Pokemon Center', type: 'pokecenter', accessible: true },
{ id: 'elitefourchamber', name: 'Elite Four Chamber', type: 'special', accessible: true },
],
encounterZones: [],
},
EOF

echo "Part 1 complete: Kanto region created!"
echo "File size so far: $(wc -l < "$OUTPUT_FILE") lines"
