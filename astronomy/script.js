const seed = 1; // Math.floor(Math.random() * 1000 + 1);
function splitmix32(a) {
  return function () {
    a |= 0; a = a + 0x9e3779b9 | 0;
    var t = a ^ a >>> 16; t = Math.imul(t, 0x21f0aaad);
    t = t ^ t >>> 15; t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
  }
}
const random = splitmix32(seed);
function randomSkyLocation() {
  // Return a random location in the sky

  const u = random(seed);
  const v = random(seed);
  return {
    rasc: 2 * Math.PI * u * (180 / Math.PI),
    decl: Math.acos(2 * v - 1) * (180 / Math.PI) - 90,
  }
}
function skyLocationToTelescopeFoV({ rasc, decl, viewRAsc, viewDecl, viewRadius }) {
  // Calculate the smallest angles between the object and the center of the view

  const objectCoordinateSets = [{ rasc, decl }];
  const viewCoordinateSets = [{ viewRAsc, viewDecl }];
  // Right ascension is longitude, positive means the object is to the right of the center of the view.
  // To make sure we're handling loops correctly, we'll add coordinate sets on each side.
  objectCoordinateSets.push({ rasc: rasc + 360, decl });
  objectCoordinateSets.push({ rasc: rasc - 360, decl });
  viewCoordinateSets.push({ viewRAsc: viewRAsc + 360, viewDecl });
  viewCoordinateSets.push({ viewRAsc: viewRAsc - 360, viewDecl });

  // Declination is latitude and ranges from -90 to 90, positive means the object is above the center of the view.
  // We need to check the looped declinations as well in case the telescope is pointed straight up or down.
  objectCoordinateSets.push({ rasc: 360 - rasc, decl: decl + 180 });
  objectCoordinateSets.push({ rasc: 360 - rasc, decl: decl - 180 });
  viewCoordinateSets.push({ viewRAsc: 360 - viewRAsc, viewDecl: viewDecl + 180 });
  viewCoordinateSets.push({ viewRAsc: 360 - viewRAsc, viewDecl: viewDecl - 180 });

  // Loop through all combinations of object and view coordinates and find the smallest distance
  let smallestDistance = 1000;
  let smallestDistanceRAscDelta = 1000;
  let smallestDistanceDeclDelta = 1000;

  for (const { rasc, decl } of objectCoordinateSets) {
    for (const { viewRAsc, viewDecl } of viewCoordinateSets) {
      const rAscDelta = rasc - viewRAsc;
      const declDelta = decl - viewDecl;
      const distance = Math.sqrt((rAscDelta) ** 2 + (declDelta) ** 2);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        smallestDistanceRAscDelta = rAscDelta;
        smallestDistanceDeclDelta = declDelta;
      }
    }
  }

  // If the object isn't within 200% of the viewRadius from the center, return null
  if (smallestDistance > 2 * viewRadius) return null;

  // Return x and y values between -1 and 1 representing the object's position in the view
  return {
    x: smallestDistanceRAscDelta / viewRadius,
    y: smallestDistanceDeclDelta / viewRadius,
  }
}

const canvasSize = 600;

// Generate a random list of stars.
// Stars have a random position in the range [0, 200].
// Stars have a random magnitude selected from the pools below.
// Stars have a hue selected from the range [0, 360].
const magnitudePool = [
  { max: -1, poolSize: 1 },
  { max: 0, poolSize: 4 },
  { max: 1, poolSize: 15 },
  { max: 2, poolSize: 48 },
  { max: 3, poolSize: 171 },
  { max: 4, poolSize: 513 },
  { max: 5, poolSize: 1602 },
  { max: 6, poolSize: 4800 },
  { max: 6.5, poolSize: 9100 },
  { max: 7, poolSize: 14000 },
  { max: 8, poolSize: 42000 },
  { max: 9, poolSize: 121000 },
  { max: 10, poolSize: 340000 },
];
const totalMagnitudePoolSize = magnitudePool.reduce((acc, { poolSize }) => acc + poolSize, 0);
const stars = [];
for (let i = 0; i < totalMagnitudePoolSize; i++) {
  stars.push({
    location: randomSkyLocation(),
    magnitude: (() => {
      const positionInMagnitudePool = random(seed) * totalMagnitudePoolSize;
      let poolPassed = 0;
      let minMagnitude = 0;
      let maxMagnitude = 0;
      for (let i = 0; i < magnitudePool.length; i++) {
        poolPassed += magnitudePool[i].poolSize;
        if (positionInMagnitudePool < poolPassed) {
          minMagnitude = magnitudePool[i - 1]?.max ?? -2;
          maxMagnitude = magnitudePool[i].max;
          break;
        }
      }
      return random(seed) * (maxMagnitude - minMagnitude) + minMagnitude;
    })(),
    hue: random(seed) * 360,
  });
}

function degrees(degrees = 0, arcminutes = 0, arcseconds = 0) {
  const sign = degrees < 0 ? -1 :
    degrees > 0 ? 1 :
      arcminutes < 0 ? -1 :
        arcminutes > 0 ? 1 :
          arcseconds < 0 ? -1 :
            arcseconds > 0 ? 1 : 0;
  return sign * (degrees + arcminutes / 60 + arcseconds / 3600);
}

const realPlanets = [
  { name: 'Sun', diameter: degrees(0, 30), magnitude: -26.778, hue: 50, location: { rasc: degrees(19, 39, 8.76), decl: degrees(-21, 28, 57.0) } },
  { name: 'Moon', diameter: degrees(0, 30), magnitude: -7.338, hue: 50, location: { rasc: degrees(22, 4, 29.23), decl: degrees(-16, 2, 14.4) } },
  { name: 'Mercury', diameter: degrees(0, 0, 13), magnitude: -0.197, hue: 50, location: { rasc: degrees(17, 58, 1.94), decl: degrees(-22, 3, 17.5) } },
  { name: 'Venus', diameter: degrees(0, 0, 65), magnitude: -3.993, hue: 50, location: { rasc: degrees(17, 9, 5.62), decl: degrees(-21, 26, 11.7) } },
  { name: 'Mars', diameter: degrees(0, 0, 25), magnitude: 1.414, hue: 50, location: { rasc: degrees(18, 29, 15.03), decl: degrees(-23, 56, 30.9) } },
  // { name: 'Jupiter', diameter: degrees(0, 0, 50), magnitude: -2.94, hue: 50, location: { rasc: degrees(1, 5), decl: 0 } },
  // { name: 'Saturn', diameter: degrees(0, 0, 20), magnitude: 0.09, hue: 50, location: { rasc: degrees(1, 10), decl: 0 } },
  // { name: 'Uranus', diameter: degrees(0, 0, 4), magnitude: 5.33, hue: 50, location: { rasc: degrees(1, 15), decl: 0 } },
  // { name: 'Neptune', diameter: degrees(0, 0, 2.5), magnitude: 7.78, hue: 50, location: { rasc: degrees(1, 20), decl: 0 } },
  // { name: 'Pluto', diameter: degrees(0, 0, 0.04), magnitude: 13.65, hue: 50, location: { rasc: degrees(1, 25), decl: 0 } },
]

const eyepieceFoV = 52;
const eyeAdjustmentFactor = 1000000;


const demoPlanets = [
  { name: 'Sun', diameter: degrees(0, 30), magnitude: -26.74, hue: 50, location: { rasc: degrees(359, 15), decl: 0 } },
  { name: 'Moon', diameter: degrees(0, 30), magnitude: -12.74, hue: 50, location: { rasc: degrees(0, 15), decl: 0 } },
  { name: 'Mercury', diameter: degrees(0, 0, 13), magnitude: -0.42, hue: 50, location: { rasc: degrees(0, 50), decl: 0 } },
  { name: 'Venus', diameter: degrees(0, 0, 65), magnitude: -4.4, hue: 50, location: { rasc: degrees(0, 55), decl: 0 } },
  { name: 'Mars', diameter: degrees(0, 0, 25), magnitude: -2.91, hue: 50, location: { rasc: degrees(1), decl: 0 } },
  { name: 'Jupiter', diameter: degrees(0, 0, 50), magnitude: -2.94, hue: 50, location: { rasc: degrees(1, 5), decl: 0 } },
  { name: 'Saturn', diameter: degrees(0, 0, 20), magnitude: 0.09, hue: 50, location: { rasc: degrees(1, 10), decl: 0 } },
  { name: 'Uranus', diameter: degrees(0, 0, 4), magnitude: 5.33, hue: 50, location: { rasc: degrees(1, 15), decl: 0 } },
  { name: 'Neptune', diameter: degrees(0, 0, 2.5), magnitude: 7.78, hue: 50, location: { rasc: degrees(1, 20), decl: 0 } },
  { name: 'Pluto', diameter: degrees(0, 0, 0.04), magnitude: 13.65, hue: 50, location: { rasc: degrees(1, 25), decl: 0 } },
];


const center = { viewRAsc: 0, viewDecl: 0 };
const offsetCenterForDemoZoom = { viewRAsc: 1, viewDecl: 0 };
const targets = [center, offsetCenterForDemoZoom];

const babyScope = { mirrorDiameter: 4, telescopeFocalLength: 600, eyepieceFocalLength: 60 };
const myScopeWideLens = { mirrorDiameter: 8, telescopeFocalLength: 1200, eyepieceFocalLength: 30 };
const myScopeNarrowLens = { mirrorDiameter: 8, telescopeFocalLength: 1200, eyepieceFocalLength: 9 };
const bigScopeWideLens = { mirrorDiameter: 14, telescopeFocalLength: 1600, eyepieceFocalLength: 30 };
const bigScopeNarrowLens = { mirrorDiameter: 14, telescopeFocalLength: 1600, eyepieceFocalLength: 9 };
const scopes = [babyScope, myScopeWideLens, myScopeNarrowLens, bigScopeWideLens, bigScopeNarrowLens]
function getMagnification({ telescopeFocalLength, eyepieceFocalLength }) {
  return telescopeFocalLength / eyepieceFocalLength;
}
function getFoV({ eyepieceFoV, magnification }) {
  return eyepieceFoV / magnification;
}

const views = [
  { scope: myScopeWideLens, target: center, objects: demoPlanets },
  { scope: myScopeNarrowLens, target: offsetCenterForDemoZoom, objects: demoPlanets },
]

function draw() {
  const start = performance.now();

  for (const [index, { scope, target, objects }] of views.entries()) {
    const { mirrorDiameter, telescopeFocalLength, eyepieceFocalLength } = scope;
    const { viewRAsc, viewDecl } = target;

    const name = `#view${index}`
    const magnification = getMagnification({ telescopeFocalLength, eyepieceFocalLength });
    const fov = getFoV({ eyepieceFoV, magnification });
    const mirrorAdvantage = 4 * Math.PI * Math.pow(mirrorDiameter, 2);

    console.log(`The telescope has magnification of ${magnification} and a field of view of ${fov} degrees.`);
    console.log(`The telescope is pointed at ${viewRAsc} degrees right ascension and ${viewDecl} degrees declination.`);

    // Check if the canvas already exists, if not create it
    const canvasExists = document.querySelector(name) !== null;
    const canvas = document.querySelector(name) ?? document.createElement('canvas');
    if (!canvasExists) {
      canvas.id = name.slice(1);
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');

    // Draw a black circle to represent the lens of the telescope
    ctx.beginPath();
    ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();

    // Draw objects
    for (const object of objects) {
      // const relativeMagnitude = 0.4 ** object.magnitude;
      // const baseBrightness = 1;
      // const brightness = baseBrightness * relativeMagnitude * mirrorAdvantage * eyeAdjustmentFactor;

      const locationInLens = skyLocationToTelescopeFoV({
        ...object.location,
        viewRAsc,
        viewDecl,
        viewRadius: fov,
      });
      if (locationInLens === null) continue;
      const x = (locationInLens.x + 1) * canvasSize / 2;
      const y = (locationInLens.y + 1) * canvasSize / 2;

      const sizeOnSky = object.diameter ?? 0;
      const shareOfSky = sizeOnSky / fov;
      const size = Math.max(1, shareOfSky * canvasSize);
      const brightness = size === 1 ? shareOfSky * canvasSize : 1;

      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
      ctx.fillStyle = `hsl(${object.hue ?? 50}, 10%, ${100 * brightness}%)`;
      ctx.fill();
    }
  }

  console.log(`Drawing took ${performance.now() - start} milliseconds.`);
}

draw();