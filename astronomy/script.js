import {
  canvasSize,
  center,
  demoPlanets,
  eyepieceFoV,
  myScopeNarrowLens,
  myScopeWideLens,
  offsetCenterForDemoZoom
} from './data.js';
import {
  getFoV,
  getMagnification,
  skyLocationToTelescopeFoV
} from './helpers.js';

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