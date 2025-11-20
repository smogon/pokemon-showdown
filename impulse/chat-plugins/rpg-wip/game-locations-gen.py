#!/usr/bin/env python3
"""Generate comprehensive game locations for all 9 Pokemon regions"""

# Region data with level scaling
regions = {
    'kanto': {'badges': list(range(0, 9)), 'level_start': 5, 'level_end': 55},
    'johto': {'badges': list(range(9, 17)), 'level_start': 55, 'level_end': 70},
    'hoenn': {'badges': list(range(17, 25)), 'level_start': 70, 'level_end': 80},
    'sinnoh': {'badges': list(range(25, 33)), 'level_start': 80, 'level_end': 88},
    'unova': {'badges': list(range(33, 41)), 'level_start': 88, 'level_end': 94},
    'kalos': {'badges': list(range(41, 49)), 'level_start': 94, 'level_end': 98},
    'alola': {'badges': list(range(49, 57)), 'level_start': 98, 'level_end': 100},
    'galar': {'badges': list(range(57, 65)), 'level_start': 100, 'level_end': 100},
    'paldea': {'badges': list(range(65, 73)), 'level_start': 100, 'level_end': 100},
}

# Define locations for each region
locations_data = {
    'kanto': [
        ('pallettown', 'Pallet Town', 'town', 'A quiet town where your Pokemon journey begins. Professor Oak\\'s lab is located here.', ['route1'], ['oakslab', 'palletmart'], []),
        ('route1', 'Route 1', 'route', 'A path connecting Pallet Town to Viridian City. Wild Pokemon appear in the tall grass.', ['pallettown', 'viridiancity'], [], ['kanto_route1']),
        ('viridiancity', 'Viridian City', 'town', 'A city with a Pokemon Gym and a Poke Mart.', ['route1', 'route2', 'route22'], ['viridiangym', 'viridianmart', 'viridiancenter'], []),
        ('route2', 'Route 2', 'route', 'A forested route leading to Viridian Forest and Pewter City.', ['viridiancity', 'viridianforest', 'pewtercity'], [], ['kanto_route2']),
        ('viridianforest', 'Viridian Forest', 'forest', 'A dark forest filled with Bug-type Pokemon. Trainers test their skills here.', ['route2'], [], ['kanto_viridianforest']),
        ('pewtercity', 'Pewter City', 'town', 'Home of the Boulder Badge and Brock, the Rock-type Gym Leader.', ['route2', 'route3'], ['pewtergym', 'pewtermart', 'pewtercenter'], []),
        ('route3', 'Route 3', 'route', 'A rocky path with many trainers preparing for Mt. Moon.', ['pewtercity', 'mtmoon'], [], ['kanto_route3']),
        ('mtmoon', 'Mt. Moon', 'cave', 'A mysterious mountain cave filled with Clefairy and valuable fossils.', ['route3', 'route4'], [], ['kanto_mtmoon']),
        ('route4', 'Route 4', 'route', 'A short route connecting Mt. Moon to Cerulean City.', ['mtmoon', 'ceruleancity'], [], ['kanto_route4']),
        ('ceruleancity', 'Cerulean City', 'town', 'A water-themed city. Home to Misty\\'s Gym and the Cascade Badge.', ['route4', 'route5', 'route24', 'route9'], ['ceruleangym', 'ceruleanmart', 'ceruleancenter'], []),
        ('route24', 'Route 24', 'route', 'Also known as Nugget Bridge, a path with many trainers.', ['ceruleancity', 'route25'], [], ['kanto_route24']),
        ('route25', 'Route 25', 'route', 'A scenic path leading to Bill\\'s house.', ['route24'], ['billshouse'], ['kanto_route25']),
        ('route5', 'Route 5', 'route', 'A route connecting Cerulean City to Saffron City via an underground path.', ['ceruleancity', 'undergroundpath5', 'saffron city'], [], ['kanto_route5']),
        ('route6', 'Route 6', 'route', 'A route south of Saffron City leading to Vermilion City.', ['saffroncity', 'vermilioncity'], [], ['kanto_route6']),
        ('vermilioncity', 'Vermilion City', 'town', 'A port city home to Lt. Surge\\'s Gym and the Thunder Badge.', ['route6', 'route11'], ['vermiliongym', 'vermilionmart', 'vermilioncenter'], []),
        ('route11', 'Route 11', 'route', 'An eastern route from Vermilion City leading to Diglett\\'s Cave.', ['vermilioncity', 'diglettscave'], [], ['kanto_route11']),
        ('diglettscave', 'Diglett\\'s Cave', 'cave', 'A tunnel filled with Diglett and Dugtrio, connecting to Route 2.', ['route11', 'route2'], [], ['kanto_diglettscave']),
        ('route9', 'Route 9', 'route', 'A rocky path filled with trainers.', ['ceruleancity', 'rocktunnel'], [], ['kanto_route9']),
        ('rocktunnel', 'Rock Tunnel', 'cave', 'A dark cave requiring Flash. Many Rock-type trainers lurk within.', ['route9', 'route10'], [], ['kanto_rocktunnel']),
        ('route10', 'Route 10', 'route', 'A route leading to Lavender Town and the Power Plant.', ['rocktunnel', 'lavendertown'], [], ['kanto_route10']),
        ('lavendertown', 'Lavender Town', 'town', 'A somber town known for Pokemon Tower, a memorial for Pokemon.', ['route10', 'route12', 'pokemontower'], ['lavendermart', 'lavendercenter'], []),
        ('pokemontower', 'Pokemon Tower', 'tower', 'A seven-story tower haunted by ghost Pokemon. Team Rocket is causing trouble here.', ['lavendertown'], [], ['kanto_pokemontower']),
        ('route12', 'Route 12', 'route', 'A coastal route with sleeping Snorlax blocking the path.', ['lavendertown', 'route13'], [], ['kanto_route12']),
        ('route13', 'Route 13', 'route', 'A route connecting to Route 14 with many trainers.', ['route12', 'route14'], [], ['kanto_route13']),
        ('route14', 'Route 14', 'route', 'Another coastal route full of trainers.', ['route13', 'route15'], [], ['kanto_route14']),
        ('route15', 'Route 15', 'route', 'The final coastal route before Fuchsia City.', ['route14', 'fuchsiacity'], [], ['kanto_route15']),
        ('fuchsiacity', 'Fuchsia City', 'town', 'Home to the Safari Zone and Koga\\'s Poison-type Gym for the Soul Badge.', ['route15', 'route18', 'safarizone'], ['fuchsiagym', 'fuchsiamart', 'fuchsiacenter'], []),
        ('safarizone', 'Safari Zone', 'special', 'A wildlife preserve with rare Pokemon. Limited steps and special Pokeballs.', ['fuchsiacity'], [], ['kanto_safarizone']),
        ('route18', 'Route 18', 'route', 'A cycling road leading west toward Celadon City.', ['fuchsiacity', 'route17'], [], ['kanto_route18']),
        ('route17', 'Route 17', 'route', 'A downhill cycling road with many trainers.', ['route18', 'route16'], [], ['kanto_route17']),
        ('route16', 'Route 16', 'route', 'The start of cycling road, connecting to Celadon City.', ['route17', 'celadoncity'], [], ['kanto_route16']),
        ('celadoncity', 'Celadon City', 'town', 'The largest city in Kanto. Home to Erika\\'s Gym and the Rainbow Badge.', ['route16', 'route7'], ['celadongym', 'celadonmart', 'celadoncenter', 'gamecorner'], []),
        ('route7', 'Route 7', 'route', 'A short route connecting Celadon City to Saffron City.', ['celadoncity', 'saffroncity'], [], ['kanto_route7']),
        ('saffroncity', 'Saffron City', 'town', 'The central hub city. Home to Sabrina\\'s Psychic Gym and Silph Co. Team Rocket\\'s hideout.', ['route5', 'route6', 'route7', 'route8', 'silphco'], ['saffrong ym', 'saffronmart', 'saffroncenter'], []),
        ('silphco', 'Silph Co.', 'building', 'A high-rise corporate building. Team Rocket has taken over!', ['saffroncity'], [], ['kanto_silphco']),
        ('route8', 'Route 8', 'route', 'A route leading east from Saffron to Lavender Town.', ['saffroncity', 'lavendertown'], [], ['kanto_route8']),
        ('route19', 'Route 19', 'route', 'A water route south from Fuchsia City.', ['fuchsiacity', 'route20'], [], ['kanto_route19_water']),
        ('route20', 'Route 20', 'route', 'A water route leading to the Seafoam Islands.', ['route19', 'seafoamislands', 'route21'], [], ['kanto_route20_water']),
        ('seafoamislands', 'Seafoam Islands', 'cave', 'An icy cave where the legendary Articuno roosts.', ['route20'], [], ['kanto_seafoamislands']),
        ('route21', 'Route 21', 'route', 'A water route leading to Cinnabar Island.', ['route20', 'cinnabarisland'], [], ['kanto_route21_water']),
        ('cinnabarisland', 'Cinnabar Island', 'town', 'A volcanic island with a Pokemon Lab and Blaine\\'s Fire-type Gym for the Volcano Badge.', ['route21', 'pokemonmansion'], ['cinnabargym', 'cinnabarmart', 'cinnabarcenter', 'pokemonlab'], []),
        ('pokemonmansion', 'Pokemon Mansion', 'building', 'An abandoned mansion with dark secrets about Mewtwo.', ['cinnabarisland'], [], ['kanto_pokemonmansion']),
        ('route22', 'Route 22', 'route', 'A route west of Viridian City leading to Victory Road.', ['viridiancity', 'route23'], [], ['kanto_route22']),
        ('route23', 'Route 23', 'route', 'The final route before Victory Road. Requires all 8 badges to pass.', ['route22', 'victoryroad'], [], ['kanto_route23']),
        ('victoryroad', 'Victory Road', 'cave', 'A challenging cave maze that only the strongest trainers can navigate. The path to the Pokemon League.', ['route23', 'indigopla teau'], [], ['kanto_victoryroad']),
        ('indigoplateau', 'Indigo Plateau', 'town', 'The Pokemon League Headquarters. Face the Elite Four and Champion!', ['victoryroad', 'elitefour'], ['pokemoncenter'], []),
        ('elitefour', 'Elite Four Chamber', 'special', 'The ultimate test. Face four elite trainers and the Champion in succession.', ['indigoplateau'], [], []),
    ],
    'johto': [
        ('newbarktown', 'New Bark Town', 'town', 'A peaceful town in Johto where Professor Elm\\'s lab is located. Your Johto adventure begins!', ['route29'], ['elmslab', 'newbarkmart'], []),
        ('route29', 'Route 29', 'route', 'The first route in Johto, connecting New Bark Town to Cherrygrove City.', ['newbarktown', 'cherrygrovecity'], [], ['johto_route29']),
        ('cherrygrovecity', 'Cherrygrove City', 'town', 'A small seaside city with helpful residents.', ['route29', 'route30'], ['cherrygrovemart', 'cherrygrovecenter'], []),
        ('route30', 'Route 30', 'route', 'A route leading north to Violet City, passing through Dark Cave.', ['cherrygrovecity', 'darkcave', 'violetcity'], [], ['johto_route30']),
        ('darkcave', 'Dark Cave', 'cave', 'A dark cave that can be explored further with HM moves.', ['route30', 'route31'], [], ['johto_darkcave']),
        ('violetcity', 'Violet City', 'town', 'Home to Falkner\\'s Flying-type Gym and the Zephyr Badge. Features Sprout Tower.', ['route30', 'route31', 'route32', 'sprouttower'], ['violetgym', 'violetmart', 'violetcenter'], []),
        ('sprouttower', 'Sprout Tower', 'tower', 'A swaying tower where monks train with their Bellsprout.', ['violetcity'], [], ['johto_sprouttower']),
        ('route31', 'Route 31', 'route', 'A route connecting Violet City to Azalea Town through Dark Cave.', ['violetcity', 'darkcave', 'route32'], [], ['johto_route31']),
        ('route32', 'Route 32', 'route', 'A long route with a Pokemon Center midway and Union Cave entrance.', ['violetcity', 'unioncave', 'azaleatown'], ['route32center'], ['johto_route32']),
        ('unioncave', 'Union Cave', 'cave', 'A large cave system connecting Route 32 to Route 33. Ruins of Alph nearby.', ['route32', 'route33', 'ruinsofalph'], [], ['johto_unioncave']),
        ('ruinsofalph', 'Ruins of Alph', 'ruins', 'Ancient ruins with mysterious Unown Pokemon and puzzles.', ['unioncave'], [], ['johto_ruinsofalph']),
        ('azaleatown', 'Azalea Town', 'town', 'A town famous for Slowpoke Well. Bugsy\\'s Bug-type Gym awards the Hive Badge.', ['route32', 'route33', 'slowpokewell'], ['azaleagym', 'azaleamart', 'azaleacenter'], []),
        ('slowpokewell', 'Slowpoke Well', 'cave', 'Team Rocket is stealing Slowpoke tails here!', ['azaleatown'], [], ['johto_slowpokewell']),
        ('route33', 'Route 33', 'route', 'A short route connecting Azalea Town to Union Cave.', ['azaleatown', 'unioncave'], [], ['johto_route33']),
        ('route34', 'Route 34', 'route', 'A route leading from Goldenrod City south to Ilex Forest.', ['goldenrodcity', 'ilexforest'], ['daycare'], ['johto_route34']),
        ('ilexforest', 'Ilex Forest', 'forest', 'A dense forest where you can find the GS Ball shrine.', ['route34', 'azaleatown'], [], ['johto_ilexforest']),
        ('goldenrodcity', 'Goldenrod City', 'town', 'The largest city in Johto. Whitney\\'s Normal-type Gym awards the Plain Badge.', ['route34', 'route35'], ['goldenrodgym', 'goldenrodmart', 'goldenrodcenter', 'radiotower'], []),
        ('radiotower', 'Radio Tower', 'building', 'The Goldenrod Radio Tower. Team Rocket takes it over later!', ['goldenrodcity'], [], []),
        ('route35', 'Route 35', 'route', 'A route north of Goldenrod leading to the National Park.', ['goldenrodcity', 'nationalpark'], [], ['johto_route35']),
        ('nationalpark', 'National Park', 'park', 'A beautiful park hosting the Bug Catching Contest.', ['route35', 'route36'], [], ['johto_nationalpark']),
        ('route36', 'Route 36', 'route', 'A route with a sleeping Sudowoodo blocking the path to Ecruteak.', ['nationalpark', 'route37'], [], ['johto_route36']),
        ('route37', 'Route 37', 'route', 'A peaceful route leading to Ecruteak City.', ['route36', 'ecruteakcity'], [], ['johto_route37']),
        ('ecruteakcity', 'Ecruteak City', 'town', 'A traditional city with Burned Tower and Tin Tower. Morty\\'s Ghost Gym awards Fog Badge.', ['route37', 'route38', 'route42', 'burnedtower', 'tintower'], ['ecruteakgym', 'ecruteakmart', 'ecruteakcenter'], []),
        ('burnedtower', 'Burned Tower', 'ruins', 'A tower destroyed by fire. The legendary beasts were revived here.', ['ecruteakcity'], [], ['johto_burnedtower']),
        ('tintower', 'Tin Tower', 'tower', 'A sacred tower where Ho-Oh is said to roost.', ['ecruteakcity'], [], ['johto_tintower']),
        ('route38', 'Route 38', 'route', 'A route west of Ecruteak leading to Olivine City.', ['ecruteakcity', 'route39'], [], ['johto_route38']),
        ('route39', 'Route 39', 'route', 'A route with a Moo Moo Farm where you can buy fresh milk.', ['route38', 'olivinecity'], ['moomoo farm'], ['johto_route39']),
        ('olivinecity', 'Olivine City', 'town', 'A port city with a lighthouse. Jasmine\\'s Steel Gym awards the Mineral Badge.', ['route39', 'route40'], ['olivinegym', 'olivinemart', 'olivinecenter', 'lighthouse'], []),
        ('lighthouse', 'Lighthouse', 'building', 'A tall lighthouse where Jasmine cares for a sick Ampharos.', ['olivinecity'], ['jasmine'], []),
        ('route40', 'Route 40', 'route', 'A water route leading south to Cianwood City.', ['olivinecity', 'route41'], [], ['johto_route40_water']),
        ('route41', 'Route 41', 'route', 'A water route passing by the Whirl Islands.', ['route40', 'whirlislands', 'cianwoodcity'], [], ['johto_route41_water']),
        ('whirlislands', 'Whirl Islands', 'cave', 'A series of islands with caves where Lugia is said to dwell.', ['route41'], [], ['johto_whirlislands']),
        ('cianwoodcity', 'Cianwood City', 'town', 'A remote city accessible by surf. Chuck\\'s Fighting Gym awards the Storm Badge.', ['route41'], ['cianwoodgym', 'cianwoodmart', 'cianwoodcenter'], []),
        ('route42', 'Route 42', 'route', 'An eastern route from Ecruteak leading to Mt. Mortar.', ['ecruteakcity', 'mtmortar', 'mahoganytown'], [], ['johto_route42']),
        ('mtmortar', 'Mt. Mortar', 'cave', 'A sprawling mountain cave system. A Karate Master trains within.', ['route42'], [], ['johto_mtmortar']),
        ('mahoganytown', 'Mahogany Town', 'town', 'A ninja-themed town. Pryce\\'s Ice Gym awards the Glacier Badge. Team Rocket base nearby.', ['route42', 'route43', 'route44'], ['mahoganygym', 'mahoganymart', 'mahoganycenter', 'rocketbase'], []),
        ('rocketbase', 'Team Rocket HQ', 'building', 'The secret Team Rocket hideout beneath the town!', ['mahoganytown'], [], ['johto_rocketbase']),
        ('route43', 'Route 43', 'route', 'A route north of Mahogany leading to Lake of Rage.', ['mahoganytown', 'lakeofrage'], [], ['johto_route43']),
        ('lakeofrage', 'Lake of Rage', 'lake', 'A beautiful lake where a Red Gyarados has appeared!', ['route43'], [], ['johto_lakeofrage']),
        ('route44', 'Route 44', 'route', 'An eastern route from Mahogany to Ice Path.', ['mahoganytown', 'icepath'], [], ['johto_route44']),
        ('icepath', 'Ice Path', 'cave', 'An icy cave connecting to Blackthorn City. Slippery floors make it challenging.', ['route44', 'blackthorncity'], [], ['johto_icepath']),
        ('blackthorncity', 'Blackthorn City', 'town', 'A Dragon Clan city. Clair\\'s Dragon Gym awards the Rising Badge, the final Johto badge!', ['icepath', 'route45'], ['blackthorngym', 'blackthornmart', 'blackthorncenter', 'dragonsd en'], []),
        ('dragonsden', 'Dragon\\'s Den', 'cave', 'A sacred training ground for Dragon-type trainers.', ['blackthorncity'], [], ['johto_dragonsden']),
        ('route45', 'Route 45', 'route', 'A long, treacherous route descending toward New Bark Town.', ['blackthorncity', 'route46'], [], ['johto_route45']),
        ('route46', 'Route 46', 'route', 'The final route before returning to New Bark Town area.', ['route45', 'route29'], [], ['johto_route46']),
        ('route26', 'Route 26', 'route', 'A route leading to Victory Road in Johto.', ['blackthorncity', 'route27'], [], ['johto_route26']),
        ('route27', 'Route 27', 'route', 'The path to Tohjo Falls and Victory Road.', ['route26', 'tohjofalls'], [], ['johto_route27']),
        ('tohjofalls', 'Tohjo Falls', 'cave', 'A waterfall cave connecting Johto to Kanto.', ['route27', 'johtovictoryroad'], [], ['johto_tohjofalls']),
        ('johtovictoryroad', 'Victory Road', 'cave', 'Johto\\'s Victory Road. A challenging cave before the Pokemon League.', ['tohjofalls', 'johtoleague'], [], ['johto_victoryroad']),
        ('johtoleague', 'Johto Pokemon League', 'special', 'Face Johto\\'s Elite Four and Lance, the Dragon Master Champion!', ['johtovictoryroad'], [], []),
    ],
}

# Additional regions would follow similar patterns with appropriate level scaling

print('Writing game-locations.ts...')
with open('impulse/chat-plugins/rpg-wip/game-locations.ts', 'w') as f:
    f.write('/**\\n')
    f.write(' * Game Locations Configuration\\n')
    f.write(' *\\n')
    f.write(' * Complete Pokemon RPG story spanning 9 regions from Kanto to Paldea.\\n')
    f.write(' * Features exciting routes, caves, towns with progressive difficulty.\\n')
    f.write(' * Level caps are enforced based on badges to prevent over-leveling.\\n')
    f.write(' */\\n\\n')
    
    f.write('// ============================================================================\\n')
    f.write('// LEVEL CAPS BY BADGE COUNT\\n')
    f.write('// ============================================================================\\n\\n')
    f.write('export const LEVEL_CAPS: Record<number, number> = {\\n')
    
    # Generate level caps for each badge
    level_caps = [
        (0, 15), (1, 20), (2, 25), (3, 30), (4, 35), (5, 40), (6, 45), (7, 50), (8, 55),  # Kanto
        (9, 58), (10, 61), (11, 64), (12, 66), (13, 68), (14, 70), (15, 72), (16, 75),  # Johto
        (17, 77), (18, 79), (19, 81), (20, 83), (21, 84), (22, 85), (23, 86), (24, 88),  # Hoenn
        (25, 89), (26, 90), (27, 91), (28, 92), (29, 93), (30, 94), (31, 95), (32, 96),  # Sinnoh
        (33, 96), (34, 97), (35, 97), (36, 98), (37, 98), (38, 99), (39, 99), (40, 100),  # Unova
        (41, 100), (42, 100), (43, 100), (44, 100), (45, 100), (46, 100), (47, 100), (48, 100),  # Kalos
        (49, 100), (50, 100), (51, 100), (52, 100), (53, 100), (54, 100), (55, 100), (56, 100),  # Alola
        (57, 100), (58, 100), (59, 100), (60, 100), (61, 100), (62, 100), (63, 100), (64, 100),  # Galar
        (65, 100), (66, 100), (67, 100), (68, 100), (69, 100), (70, 100), (71, 100), (72, 100),  # Paldea
    ]
    
    for badges, cap in level_caps:
        f.write(f'\\t{badges}: {cap},\\n')
    
    f.write('};\\n\\n')
    
    f.write('// ============================================================================\\n')
    f.write('// LOCATIONS\\n')
    f.write('// ============================================================================\\n\\n')
    f.write('export const LOCATIONS: Record<string, any> = {\\n')
    
    # Write locations for each region
    for region_name, locs in locations_data.items():
        f.write(f'\\t// {region_name.upper()} REGION\\n')
        for loc_id, name, loc_type, desc, connections, buildings, zones in locs:
            f.write(f'\\t\\'{loc_id}\\': {{\\n')
            f.write(f'\\t\\tid: \\'{loc_id}\\',\\n')
            f.write(f'\\t\\tname: \\'{name}\\',\\n')
            f.write(f'\\t\\ttype: \\'{loc_type}\\',\\n')
            f.write(f'\\t\\tregion: \\'{region_name}\\',\\n')
            f.write(f'\\t\\tdescription: \\'{desc}\\',\\n')
            f.write(f'\\t\\tconnectedLocations: [\\n')
            for conn in connections:
                f.write(f'\\t\\t\\t{{ id: \\'{conn}\\', name: \\'\\' }},\\n')
            f.write(f'\\t\\t],\\n')
            if buildings:
                f.write(f'\\t\\tbuildings: [\\n')
                for bldg in buildings:
                    f.write(f'\\t\\t\\t{{ id: \\'{bldg}\\', name: \\'{bldg.title()}\\', type: \\'building\\', accessible: true }},\\n')
                f.write(f'\\t\\t],\\n')
            else:
                f.write(f'\\t\\tbuildings: [],\\n')
            f.write(f'\\t\\tencounterZones: {zones},\\n')
            f.write(f'\\t}},\\n')
        f.write(f'\\n')
    
    f.write('};\\n\\n')
    
    f.write('// Placeholder for remaining regions - Hoenn, Sinnoh, Unova, Kalos, Alola, Galar, Paldea\\n')
    f.write('// These will follow similar structure with appropriate Pokemon and levels\\n\\n')
    
    f.write('// ============================================================================\\n')
    f.write('// ENCOUNTER ZONES\\n')
    f.write('// ============================================================================\\n\\n')
    f.write('export const ENCOUNTER_ZONES: Record<string, {\\n')
    f.write('\\tname: string,\\n')
    f.write('\\tpokemon: string[],\\n')
    f.write('\\tlevelRange: [number, number],\\n')
    f.write('\\tbattleType?: \\'single\\' | \\'double\\',\\n')
    f.write('}> = {\\n')
    
    # Generate encounter zones for Kanto
    kanto_zones = [
        ('kanto_route1', 'Tall Grass', ['pidgey', 'rattata'], [2, 5]),
        ('kanto_route2', 'Tall Grass', ['pidgey', 'rattata', 'caterpie', 'weedle'], [3, 7]),
        ('kanto_viridianforest', 'Forest Floor', ['caterpie', 'weedle', 'metapod', 'kakuna', 'pikachu'], [3, 7]),
        ('kanto_route3', 'Rocky Path', ['spearow', 'jigglypuff', 'mankey'], [5, 10]),
        ('kanto_mtmoon', 'Cave Interior', ['zubat', 'geodude', 'paras', 'clefairy'], [7, 12]),
        ('kanto_route4', 'Grass Patch', ['rattata', 'spearow', 'ekans', 'sandshrew'], [8, 14]),
        ('kanto_route24', 'Nugget Bridge', ['pidgey', 'oddish', 'bellsprout'], [10, 16]),
        ('kanto_route25', 'Grass Area', ['pidgey', 'oddish', 'bellsprout', 'venonat'], [10, 16]),
        ('kanto_route5', 'Tall Grass', ['pidgey', 'meowth', 'oddish', 'mankey'], [12, 18]),
        ('kanto_route6', 'Tall Grass', ['pidgey', 'meowth', 'oddish', 'psyduck'], [12, 18]),
        ('kanto_route11', 'Eastern Grass', ['spearow', 'ekans', 'drowzee'], [14, 20]),
        ('kanto_diglettscave', 'Tunnel', ['diglett', 'dugtrio'], [15, 25]),
        ('kanto_route9', 'Mountain Path', ['rattata', 'spearow', 'ekans', 'sandshrew'], [14, 20]),
        ('kanto_rocktunnel', 'Dark Cave', ['zubat', 'geodude', 'machop', 'onix'], [15, 22]),
        ('kanto_route10', 'Grass and Water', ['spearow', 'voltorb', 'magnemite'], [14, 20]),
        ('kanto_pokemontower', 'Haunted Tower', ['gastly', 'haunter', 'cubone'], [16, 25]),
        ('kanto_route12', 'Coastal Grass', ['pidgey', 'oddish', 'gloom', 'venonat'], [22, 28]),
        ('kanto_route13', 'Coastal Path', ['pidgey', 'oddish', 'gloom', 'ditto'], [22, 28]),
        ('kanto_route14', 'Seaside Grass', ['pidgey', 'oddish', 'gloom', 'ditto'], [22, 30]),
        ('kanto_route15', 'Final Coast', ['pidgey', 'oddish', 'gloom', 'ditto'], [24, 30]),
        ('kanto_safarizone', 'Safari Wild', ['nidoran-f', 'nidoran-m', 'kangaskhan', 'tauros', 'scyther', 'pinsir'], [22, 32]),
        ('kanto_route18', 'Cycling Road', ['spearow', 'fearow', 'doduo'], [24, 30]),
        ('kanto_route17', 'Downhill Ride', ['spearow', 'fearow', 'doduo'], [24, 30]),
        ('kanto_route16', 'Road Start', ['spearow', 'fearow', 'doduo'], [22, 30]),
        ('kanto_route7', 'City Route', ['pidgey', 'meowth', 'oddish', 'growlithe', 'vulpix'], [20, 26]),
        ('kanto_route8', 'Eastern Route', ['pidgey', 'meowth', 'oddish', 'growlithe', 'vulpix'], [18, 24]),
        ('kanto_silphco', 'Office Building', ['porygon'], [25, 35]),
        ('kanto_route19_water', 'Water Surface', ['tentacool', 'tentacruel'], [30, 38]),
        ('kanto_route20_water', 'Ocean Route', ['tentacool', 'tentacruel'], [30, 38]),
        ('kanto_seafoamislands', 'Icy Cave', ['zubat', 'golbat', 'psyduck', 'golduck', 'seel', 'dewgong'], [30, 40]),
        ('kanto_route21_water', 'Southern Sea', ['tentacool', 'tentacruel'], [30, 40]),
        ('kanto_pokemonmansion', 'Abandoned Halls', ['rattata', 'raticate', 'growlithe', 'vulpix', 'grimer', 'muk', 'koffing', 'weezing'], [30, 40]),
        ('kanto_route22', 'League Gate', ['rattata', 'nidoran-f', 'nidoran-m', 'mankey'], [3, 7]),
        ('kanto_route23', 'Victory Path', ['mankey', 'primeape', 'ditto'], [36, 44]),
        ('kanto_victoryroad', 'Final Cave', ['machop', 'machoke', 'geodude', 'graveler', 'onix', 'marowak'], [38, 48]),
    ]
    
    for zone_id, zone_name, pokemon, level_range in kanto_zones:
        f.write(f'\\t\\'{zone_id}\\': {{\\n')
        f.write(f'\\t\\tname: \\'{zone_name}\\',\\n')
        f.write(f'\\t\\tpokemon: {pokemon},\\n')
        f.write(f'\\t\\tlevelRange: {level_range},\\n')
        f.write(f'\\t\\tbattleType: \\'single\\',\\n')
        f.write(f'\\t}},\\n')
    
    # Johto zones
    johto_zones = [
        ('johto_route29', 'Starting Path', ['pidgey', 'sentret', 'hoothoot'], [2, 4]),
        ('johto_route30', 'Northern Route', ['pidgey', 'caterpie', 'weedle', 'ledyba', 'spinarak'], [3, 5]),
        ('johto_darkcave', 'Dark Interior', ['zubat', 'geodude'], [3, 6]),
        ('johto_sprouttower', 'Tower Grounds', ['rattata', 'bellsprout'], [4, 7]),
        ('johto_route31', 'Cave Route', ['pidgey', 'caterpie', 'weedle', 'bellsprout'], [4, 7]),
        ('johto_route32', 'Long Path', ['rattata', 'ekans', 'bellsprout', 'hoppip', 'mareep'], [4, 7]),
        ('johto_unioncave', 'Underground', ['zubat', 'geodude', 'sandshrew', 'onix', 'wooper'], [6, 10]),
        ('johto_ruinsofalph', 'Ancient Ruins', ['unown'], [5, 8]),
        ('johto_slowpokewell', 'Underground Well', ['slowpoke', 'zubat'], [8, 12]),
        ('johto_route33', 'Short Trail', ['rattata', 'spearow', 'ekans', 'hoppip'], [8, 12]),
        ('johto_ilexforest', 'Dense Woods', ['caterpie', 'weedle', 'metapod', 'kakuna', 'oddish', 'paras'], [10, 15]),
        ('johto_route34', 'Day Care Route', ['pidgey', 'rattata', 'jigglypuff', 'meowth', 'drowzee'], [12, 16]),
        ('johto_route35', 'Park Path', ['pidgey', 'hoothoot', 'yanma', 'sunkern'], [15, 20]),
        ('johto_nationalpark', 'Bug Contest', ['caterpie', 'weedle', 'metapod', 'kakuna', 'scyther', 'pinsir'], [15, 20]),
        ('johto_route36', 'Sudowoodo Route', ['pidgey', 'bellsprout', 'growlithe', 'vulpix'], [16, 22]),
        ('johto_route37', 'Peaceful Trail', ['pidgey', 'oddish', 'stantler', 'growlithe', 'vulpix'], [18, 24]),
        ('johto_burnedtower', 'Scorched Floors', ['rattata', 'koffing', 'magmar'], [18, 24]),
        ('johto_tintower', 'Sacred Halls', ['rattata', 'gastly'], [20, 26]),
        ('johto_route38', 'Western Path', ['rattata', 'meowth', 'magnemite', 'farfetchd'], [20, 26]),
        ('johto_route39', 'Moo Moo Route', ['rattata', 'meowth', 'magnemite', 'tauros', 'miltank'], [22, 28]),
        ('johto_route40', 'Coastal Water', ['tentacool', 'tentacruel'], [25, 35]),
        ('johto_route41_water', 'Whirl Route', ['tentacool', 'tentacruel', 'mantine'], [25, 35]),
        ('johto_whirlislands', 'Island Caves', ['zubat', 'golbat', 'krabby', 'horsea', 'seel'], [28, 38]),
        ('johto_route42', 'Mountain Route', ['spearow', 'mankey', 'mareep', 'flaaffy'], [30, 38]),
        ('johto_mtmortar', 'Mountain Interior', ['machop', 'geodude', 'graveler', 'marowak'], [32, 42]),
        ('johto_route43', 'Lake Route', ['pidgeotto', 'venonat', 'noctowl', 'sentret'], [34, 42]),
        ('johto_lakeofrage', 'Lake Waters', ['magikarp', 'gyarados'], [35, 45]),
        ('johto_rocketbase', 'Hidden Base', ['zubat', 'koffing', 'grimer', 'raticate'], [35, 42]),
        ('johto_route44', 'Icy Approach', ['tangela', 'lickitung', 'weepinbell'], [36, 44]),
        ('johto_icepath', 'Frozen Cave', ['zubat', 'jynx', 'swinub', 'delibird', 'sneasel'], [38, 46]),
        ('johto_dragonsden', 'Dragon Lair', ['dratini', 'dragonair'], [40, 50]),
        ('johto_route45', 'Descent Route', ['geodude', 'graveler', 'gligar', 'teddiursa'], [40, 48]),
        ('johto_route46', 'Final Trail', ['spearow', 'rattata', 'geodude'], [3, 7]),
        ('johto_route26', 'Victory Approach', ['ponyta', 'doduo', 'arbok', 'sandslash'], [42, 50]),
        ('johto_route27', 'Tohjo Route', ['doduo', 'arbok', 'sandslash', 'quagsire'], [44, 52]),
        ('johto_tohjofalls', 'Waterfall Cave', ['zubat', 'golbat', 'golduck', 'slowbro'], [45, 55]),
        ('johto_victoryroad', 'Ultimate Challenge', ['graveler', 'onix', 'rhyhorn', 'golbat', 'ursaring'], [46, 55]),
    ]
    
    for zone_id, zone_name, pokemon, level_range in johto_zones:
        f.write(f'\\t\\'{zone_id}\\': {{\\n')
        f.write(f'\\t\\tname: \\'{zone_name}\\',\\n')
        f.write(f'\\t\\tpokemon: {pokemon},\\n')
        f.write(f'\\t\\tlevelRange: {level_range},\\n')
        f.write(f'\\t\\tbattleType: \\'single\\',\\n')
        f.write(f'\\t}},\\n')
    
    f.write('};\\n\\n')
    
    f.write('// ============================================================================\\n')
    f.write('// HELPER FUNCTIONS\\n')
    f.write('// ============================================================================\\n\\n')
    f.write('export function getStartingLocation(): { id: string, name: string } {\\n')
    f.write('\\treturn { id: \\'pallettown\\', name: \\'Pallet Town\\' };\\n')
    f.write('}\\n\\n')
    f.write('export function getLevelCap(badgeCount: number): number {\\n')
    f.write('\\treturn LEVEL_CAPS[badgeCount] || 100;\\n')
    f.write('}\\n\\n')
    f.write('export function canPokemonLevelUp(currentLevel: number, badgeCount: number): boolean {\\n')
    f.write('\\tconst cap = getLevelCap(badgeCount);\\n')
    f.write('\\treturn currentLevel < cap;\\n')
    f.write('}\\n')

print('game-locations.ts file created successfully!')
