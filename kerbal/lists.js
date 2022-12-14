celestials = ['Sun', 'Moho', 'Eve', 'Gilly', 'Kerbin', 'Mun', 'Minmus', 'Duna', 'Ike', 'Dres', 'Jool', 'Laythe', 'Vall', 'Tylo', 'Bop', 'Pol', 'Eeloo'];
biomes = [
    [""],  // Sun
    ["NorthPole", "NorthernSinkholeRidge", "NorthernSinkhole", "Highlands", "Midlands", "MinorCraters",
        "CentralLowlands", "WesternLowlands", "SouthWesternLowlands", "SouthEasternLowlands", "Canyon", "SouthPole"],  // Moho
    ["Poles", "Lowlands", "Midlands", "Highlands", "Foothills", "Peaks", "ImpactEjecta", "ExplodiumSea",
        "AkatsukiLake", "Shallows", "CraterLake", "WesternSea", "Olympus", "Craters", "EasternSea"],  // Eve
    ["Lowlands", "Midlands", "Highlands"],  // Gilly
    ["IceCaps", "NorthernIceShelf", "SouthernIceShelf", "Tundra", "Highlands", "Mountains", "Grasslands", "Deserts", "Badlands", "Shores", "Water", "KSC", "Administration", "AstronautComplex", "Crawlerway", "FlagPole", "LaunchPad", "MissionControl", "R&D", "Runway", "SPH", "TrackingStation", "VAB"],  // Kerbin
    ["Poles", "PolarLowlands", "PolarCrater", "Highlands", "HighlandCraters", "Midlands", "MidlandCraters", "Lowlands", "NortheastBasin",
        "FarsideBasin", "NorthwestCrater", "EastFarsideCrater", "Canyons", "FarsideCrater", "EastCrater", "TwinCraters", "SouthwestCrater"],  // Mun
    ["Poles", "Lowlands", "Midlands", "Highlands", "Slopes", "Flats",
        "LesserFlats", "GreatFlats", "GreaterFlats"],  // Minmus
    ["Poles", "PolarHighlands", "PolarCraters", "Highlands", "Midlands", "Lowlands", "Craters", "MidlandSea",
        "NortheastBasin", "SouthernBasin", "NorthernShelf", "MidlandCanyon", "EasternCanyon", "WesternCanyon"],  // Duna
    ["PolarLowlands", "Midlands", "Lowlands", "EasternMountainRidge", "WesternMountainRidge",
        "CentralMountainRange", "SouthEasternMountainRange", "SouthPole"],  // Ike
    ["Poles", "Highlands", "Midlands", "Lowlands", "Ridges",
        "ImpactEjecta", "ImpactCraters", "Canyons"],  // Dres
    [""],  // Jool
    ["Poles", "Shores", "Dunes", "CrescentBay", "TheSagenSea", "CraterIsland",
        "Shallows", "CraterBay", "DegrasseSea", "Peaks"],  // Laythe
    ["Poles", "Highlands", "Midlands", "Lowlands", "Mountains", "NortheastBasin",
        "NorthwestBasin", "SouthernBasin", "SouthernValleys"],  // Vall
    ["Highlands", "Midlands", "Lowlands", "Mara", "MinorCraters", "GagarinCrater",
        "GrissomCrater", "GalileioCrater", "TychoCrater"],  // Tylo
    ["Poles", "Slopes", "Peaks", "Valley", "Ridges"],  // Bop
    ["Poles", "Lowlands", "Midlands", "Highlands"],  // Pol
    ["Poles", "NorthernGlaciers", "Midlands", "Lowlands", "IceCanyons", "Highlands",
        "Craters", "Fragipan", "BabbagePatch", "SouthernGlaciers", "MuGlacier"]]  // Eeloo
situations = ['Surface: Landed', 'Surface: Splashed', 'Flying Low', 'Flying High', 'In Space Low', 'In Space High'];
experiments = ['Surface Sample', 'EVA Report', 'Crew Report', 'Mystery Goo Observation', 'Materials Study', 'Temperature Scan', 'Atmospheric Pressure Scan', 'Seismic Scan', 'Atmosphere Analysis', 'Infrared Telescope', 'Gravity Scan'];
keys = {
    'In Space High': 'InSpaceHigh',
    'In Space Low': 'InSpaceLow',
    'Flying High': 'FlyingHigh',
    'Flying Low': 'FlyingLow',
    'Surface: Landed': 'SrfLanded',
    'Surface: Splashed': 'SrfSplashed',
    'Crew Report': 'crewReport',
    'EVA Report': 'evaReport',
    'Gravity Scan': 'gravityScan',
    'Mystery Goo Observation': 'mysteryGoo',
    'Seismic Scan': 'seismicScan',
    'Surface Sample': 'surfaceSample',
    'Materials Study': 'mobileMaterialsLab',
    'Atmospheric Pressure Scan': 'barometerScan',
    'Temperature Scan': 'temperatureScan',
    'Atmosphere Analysis': 'atmosphereAnalysis',
    'Infrared Telescope': 'infraredTelescope'
};