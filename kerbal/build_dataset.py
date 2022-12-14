celestials = ['Sun', 'Moho', 'Eve', 'Gilly', 'Kerbin', 'Mun', 'Minmus', 'Duna',
              'Ike', 'Dres', 'Jool', 'Laythe', 'Vall', 'Tylo', 'Bop', 'Pol', 'Eeloo']
biomes = [
    [""],  # Sun
    ["NorthPole", "NorthernSinkholeRidge", "NorthernSinkhole", "Highlands", "Midlands", "MinorCraters",
        "CentralLowlands", "WesternLowlands", "SouthWesternLowlands", "SouthEasternLowlands", "Canyon", "SouthPole"],  # Moho
    ["Poles", "Lowlands", "Midlands", "Highlands", "Foothills", "Peaks", "ImpactEjecta", "ExplodiumSea",
        "AkatsukiLake", "Shallows", "CraterLake", "WesternSea", "Olympus", "Craters", "EasternSea"],  # Eve
    ["Lowlands", "Midlands", "Highlands"],  # Gilly
    ["IceCaps", "NorthernIceShelf", "SouthernIceShelf", "Tundra", "Highlands", "Mountains", "Grasslands", "Deserts", "Badlands", "Shores", "Water", "KSC",
        "Administration", "AstronautComplex", "Crawlerway", "FlagPole", "LaunchPad", "MissionControl", "R&D", "Runway", "SPH", "TrackingStation", "VAB"],  # Kerbin
    ["Poles", "PolarLowlands", "PolarCrater", "Highlands", "HighlandCraters", "Midlands", "MidlandCraters", "Lowlands", "NortheastBasin",
        "FarsideBasin", "NorthwestCrater", "EastFarsideCrater", "Canyons", "FarsideCrater", "EastCrater", "TwinCraters", "SouthwestCrater"],  # Mun
    ["Poles", "Lowlands", "Midlands", "Highlands", "Slopes", "Flats",
        "LesserFlats", "GreatFlats", "GreaterFlats"],  # Minmus
    ["Poles", "PolarHighlands", "PolarCraters", "Highlands", "Midlands", "Lowlands", "Craters", "MidlandSea",
        "NortheastBasin", "SouthernBasin", "NorthernShelf", "MidlandCanyon", "EasternCanyon", "WesternCanyon"],  # Duna
    ["PolarLowlands", "Midlands", "Lowlands", "EasternMountainRidge", "WesternMountainRidge",
        "CentralMountainRange", "SouthEasternMountainRange", "SouthPole"],  # Ike
    ["Poles", "Highlands", "Midlands", "Lowlands", "Ridges",
        "ImpactEjecta", "ImpactCraters", "Canyons"],  # Dres
    [""],  # Jool
    ["Poles", "Shores", "Dunes", "CrescentBay", "TheSagenSea", "CraterIsland",
        "Shallows", "CraterBay", "DegrasseSea", "Peaks"],  # Laythe
    ["Poles", "Highlands", "Midlands", "Lowlands", "Mountains", "NortheastBasin",
        "NorthwestBasin", "SouthernBasin", "SouthernValleys"],  # Vall
    ["Highlands", "Midlands", "Lowlands", "Mara", "MinorCraters", "GagarinCrater",
        "GrissomCrater", "GalileioCrater", "TychoCrater"],  # Tylo
    ["Poles", "Slopes", "Peaks", "Valley", "Ridges"],  # Bop
    ["Poles", "Lowlands", "Midlands", "Highlands"],  # Pol
    ["Poles", "NorthernGlaciers", "Midlands", "Lowlands", "IceCanyons", "Highlands",
        "Craters", "Fragipan", "BabbagePatch", "SouthernGlaciers", "MuGlacier"]]  # Eeloo
water_biomes = [
    [],  # Sun
    [],  # Moho
    [False, False, False, False, False, False, False, True,
        True, True, True, True, False, False, True],  # Eve
    [],  # Gilly
    [False, False, False, False, False, False, False, False, False, True, True, False,
        False, False, False, False, False, False, False, False, False, False, False],  # Kerbin
    [],  # Mun
    [],  # Minmus
    [],  # Duna
    [],  # Ike
    [],  # Dres
    [],  # Jool
    [False, True, False, True, True, False,
        True, True, True, False],  # Laythe
    [],  # Vall
    [],  # Tylo
    [],  # Bop
    [],  # Pol
    []]  # Eeloo
micro_biomes = [
    [],  # Sun
    [],  # Moho
    [],  # Eve
    [],  # Gilly
    [False, False, False, False, False, False, False, False, False, False, False, True,
        True, True, True, True, True, True, True, True, True, True, True],  # Kerbin
    [],  # Mun
    [],  # Minmus
    [],  # Duna
    [],  # Ike
    [],  # Dres
    [],  # Jool
    [],  # Laythe
    [],  # Vall
    [],  # Tylo
    [],  # Bop
    [],  # Pol
    []]  # Eeloo
situations = ['SrfLanded', 'SrfSplashed', 'FlyingLow',
              'FlyingHigh', 'InSpaceLow', 'InSpaceHigh']
experiments = ['surfaceSample',
               'evaReport',
               'crewReport',
               'mysteryGoo',
               'mobileMaterialsLab',
               'temperatureScan',
               'barometerScan',
               'gravityScan',
               'seismicScan',
               'atmosphereAnalysis',
               'infraredTelescope']
base_cap = [40, 8, 5, 13, 32, 8, 12, 22, 22, 24, 22]
situation_biomes = [['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'x'],
                    ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'x', 'x', 'x'],
                    ['x', 'b', 'b', 'g', 'g', 'b', 'g', 'x', 'x', 'b', 'x'],
                    ['x', 'g', 'g', 'g', 'g', 'g', 'g', 'x', 'x', 'b', 'x'],
                    ['x', 'b', 'g', 'g', 'g', 'g', 'g', 'b', 'x', 'x', 'x'],
                    ['x', 'g', 'g', 'g', 'g', 'g', 'g', 'b', 'x', 'x', 'g'],
                    ]
multipliers = [[-1, -1, 1, 1, 11, 2],  # Sun
               [10, -1, -1, -1, 8, 7],  # Moho
               [8, 8, 6, 6, 7, 5],  # Eve
               [9, -1, -1, -1, 8, 6],  # Gilly
               [.3, .4, .7, .9, 1, 1.5],  # Kerbin
               [4, -1, -1, -1, 3, 2],  # Mun
               [5, -1, -1, -1, 4, 2.5],  # Minmus
               [8, -1, 5, 5, 7, 5],  # Duna
               [8, -1, -1, -1, 7, 5],  # Ike
               [8, -1, -1, -1, 7, 6],  # Dres
               [-1, -1, 12, 9, 7, 6],  # Jool
               [14, 12, 11, 10, 9, 8],  # Laythe
               [12, -1, -1, -1, 9, 8],  # Vall
               [12, -1, -1, -1, 10, 8],  # Tylo
               [12, -1, -1, -1, 9, 8],  # Bop
               [12, -1, -1, -1, 9, 8],  # Pol
               [15, -1, -1, -1, 12, 10]]  # Eeloo
count = 0
f = open('dataset.js', 'w')
f.write('dataset = [')
for c in range(len(celestials)):
    for s in range(len(situations)):
        if multipliers[c][s] != -1:
            for e in range(len(experiments)):
                if situation_biomes[s][e] == 'b':
                    for b in range(len(biomes[c])):
                        if situations[s] != "SrfSplashed" or water_biomes[c][b]:
                            if celestials[c] not in ["Kerbin", "Eve", "Laythe"] or situations[s] != "SrfLanded" or not water_biomes[c][b]:
                                if celestials[c] != "Kerbin" or situations[s] == "SrfLanded" or not micro_biomes[c][b]:
                                    f.write('{"experiment":"' + experiments[e] + '","location":"' + celestials[c] + situations[s]+biomes[c][b] +
                                            '","sci":0,"cap":'+str(multipliers[c][s]*base_cap[e])+',"celestial":"' + celestials[c] + '","biome":"' + biomes[c][b] + '","situation":"' + situations[s] + '"},')
                                    count += 1
                elif situation_biomes[s][e] == 'g':
                    f.write('{"experiment":"' + experiments[e] + '","location":"' + celestials[c] + situations[s] +
                            '","sci":0,"cap":'+str(multipliers[c][s]*base_cap[e])+',"celestial":"' + celestials[c] + '","biome":"","situation":"' + situations[s] + '"},')
                    count += 1
f.write("]")
print("Total output:", count)
