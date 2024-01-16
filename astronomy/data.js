import { degrees, random, randomSkyLocation, seed } from "./helpers.js";

// Constants
export const eyepieceFoV = 52;
export const eyeAdjustmentFactor = 5_000_000;
export const canvasSize = 600;

// Targets
export const center = { name: 'Centered', viewRAsc: 0, viewDecl: 0 };
export const offsetCenterForDemoZoom = { name: 'Centered with Offset for Demo Planets', viewRAsc: 1, viewDecl: 0 };
export const targets = [center, offsetCenterForDemoZoom];

// Scopes
export const babyScope = { name: '4-inch mirror with 60mm lens', mirrorDiameter: 4, telescopeFocalLength: 600, eyepieceFocalLength: 60 };
export const myScopeWideLens = { name: '8-inch mirror with 30mm lens.', mirrorDiameter: 8, telescopeFocalLength: 1200, eyepieceFocalLength: 30 };
export const myScopeNarrowLens = { name: '8-inch mirror with 9mm lens.', mirrorDiameter: 8, telescopeFocalLength: 1200, eyepieceFocalLength: 9 };
export const bigScopeWideLens = { name: '14-inch mirror with 30mm lens.', mirrorDiameter: 14, telescopeFocalLength: 1600, eyepieceFocalLength: 30 };
export const bigScopeNarrowLens = { name: '14-inch mirror with 9mm lens.', mirrorDiameter: 14, telescopeFocalLength: 1600, eyepieceFocalLength: 9 };
export const scopes = [babyScope, myScopeWideLens, myScopeNarrowLens, bigScopeWideLens, bigScopeNarrowLens];

// Objects
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
];
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
// Generate a random list of stars.
export const stars = [];
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
export const demoPlanetList = { name: 'Demo Planets', planets: demoPlanets };
const realPlanetList = { name: 'Real Planets', planets: realPlanets };
export const planetLists = [demoPlanetList, realPlanetList];