import {
  canvasSize,
  center,
  demoPlanetList,
  eyeAdjustmentFactor,
  eyepieceFoV,
  myScopeNarrowLens,
  myScopeWideLens,
  offsetCenterForDemoZoom,
  planetLists,
  scopes,
  stars,
  targets
} from './data.js';
import {
  drawStar,
  getFoV,
  getMagnification,
  skyLocationToTelescopeFoV
} from './helpers.js';

let selectedTarget1 = center;
let selectedTarget2 = offsetCenterForDemoZoom;
let selectedScope1 = myScopeWideLens;
let selectedScope2 = myScopeNarrowLens;
let selectedPlanetList = demoPlanetList;

function setup() {
  const scope1Select = document.getElementById('scope1');
  const scope2Select = document.getElementById('scope2');
  const target1Select = document.getElementById('target1');
  const target2Select = document.getElementById('target2');
  const planetListSelect = document.getElementById('planets');

  // Add all the options to the selects
  for (const scope of scopes) {
    const option = document.createElement('option');
    option.value = scope.name;
    option.text = scope.name;
    scope1Select.appendChild(option);
    scope2Select.appendChild(option.cloneNode(true));
  }
  for (const target of targets) {
    const option = document.createElement('option');
    option.value = target.name;
    option.text = target.name;
    target1Select.appendChild(option);
    target2Select.appendChild(option.cloneNode(true));
  }
  for (const planetList of planetLists) {
    const option = document.createElement('option');
    option.value = planetList.name;
    option.text = planetList.name;
    planetListSelect.appendChild(option);
  }

  // Set the selects to the current values
  scope1Select.value = selectedScope1.name;
  scope2Select.value = selectedScope2.name;
  target1Select.value = selectedTarget1.name;
  target2Select.value = selectedTarget2.name;
  planetListSelect.value = selectedPlanetList.name;

  // Add event listeners to the selects
  scope1Select.addEventListener('change', () => {
    selectedScope1 = scopes.find(scope => scope.name === scope1Select.value);
    draw();
  });
  scope2Select.addEventListener('change', () => {
    selectedScope2 = scopes.find(scope => scope.name === scope2Select.value);
    draw();
  });
  target1Select.addEventListener('change', () => {
    selectedTarget1 = targets.find(target => target.name === target1Select.value);
    draw();
  });
  target2Select.addEventListener('change', () => {
    selectedTarget2 = targets.find(target => target.name === target2Select.value);
    draw();
  });
  planetListSelect.addEventListener('change', () => {
    selectedPlanetList = planetLists.find(target => target.name === planetListSelect.value);
    draw();
  });
}

setup();

function draw() {
  const start = performance.now();

  const views = [
    { scope: selectedScope1, target: selectedTarget1, planets: selectedPlanetList.planets },
    { scope: selectedScope2, target: selectedTarget2, planets: selectedPlanetList.planets },
  ];

  console.log(views);

  const scopes = document.getElementById('scopes');

  for (const [index, { scope, target, planets }] of views.entries()) {
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
      scopes.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Draw a black circle to represent the lens of the telescope
    ctx.beginPath();
    ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();

    // Draw stars
    for (const star of stars) {
      const locationInLens = skyLocationToTelescopeFoV({
        ...star.location,
        viewRAsc,
        viewDecl,
        viewRadius: fov,
      });
      if (locationInLens === null) continue;
      const x = (locationInLens.x + 1) * canvasSize / 2;
      const y = (locationInLens.y + 1) * canvasSize / 2;
      drawStar(ctx, x, y, star.magnitude, mirrorAdvantage, eyeAdjustmentFactor, canvasSize);
    }

    // Draw planets
    for (const planet of planets) {
      const locationInLens = skyLocationToTelescopeFoV({
        ...planet.location,
        viewRAsc,
        viewDecl,
        viewRadius: fov,
        planetDiameter: planet.diameter,
      });
      if (locationInLens === null) continue;
      const x = (locationInLens.x + 1) * canvasSize / 2;
      const y = (locationInLens.y + 1) * canvasSize / 2;

      const sizeOnSky = planet.diameter ?? 0;
      const shareOfSky = sizeOnSky / fov;
      const size = Math.max(1, shareOfSky * canvasSize);
      const brightness = size === 1 ? shareOfSky * canvasSize : 1;

      // Draw planet
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
      ctx.fillStyle = `hsl(${planet.hue ?? 50}, 10%, ${100 * brightness}%)`;
      ctx.fill();
    }
  }

  console.log(`Drawing took ${performance.now() - start} milliseconds.`);
}

draw();

const starCanvasSize = 100;
const starExampleScope = myScopeWideLens;
const exampleStars = [
  { magnitude: -1 },
  { magnitude: 0 },
  { magnitude: 1 },
  { magnitude: 2 },
  { magnitude: 3 },
  { magnitude: 4 },
  { magnitude: 5 },
  { magnitude: 6 },
  { magnitude: 7 },
  { magnitude: 8 },
]

function drawExampleStars() {
  const starContainer = document.querySelector('#stars');

  for (const star of exampleStars) {
    const name = `#star${star.magnitude}`
    const mirrorAdvantage = 4 * Math.PI * Math.pow(starExampleScope.mirrorDiameter, 2);

    // Check if the canvas already exists, if not create it
    const canvasExists = document.querySelector(name) !== null;
    const canvas = document.querySelector(name) ?? document.createElement('canvas');
    if (!canvasExists) {
      canvas.id = name.slice(1);
      canvas.width = starCanvasSize;
      canvas.height = starCanvasSize;
      starContainer.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Draw a black circle to represent the lens of the telescope
    ctx.beginPath();
    ctx.arc(starCanvasSize / 2, starCanvasSize / 2, starCanvasSize / 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();

    // Draw the star
    const x = starCanvasSize / 2;
    const y = starCanvasSize / 2;
    drawStar(ctx, x, y, star.magnitude, mirrorAdvantage, eyeAdjustmentFactor, starCanvasSize);
  }
}

drawExampleStars();

const exportSize = 64;

function exportStarImages() {
  const mirrorAdvantage = 4 * Math.PI * Math.pow(starExampleScope.mirrorDiameter, 2);

  for (const star of exampleStars) {
    // Create a new canvas
    const canvas = document.createElement('canvas');
    canvas.width = exportSize;
    canvas.height = exportSize;
    const ctx = canvas.getContext('2d');

    // Draw the star without blending
    const x = exportSize / 2;
    const y = exportSize / 2;
    drawStar(ctx, x, y, star.magnitude, mirrorAdvantage, eyeAdjustmentFactor, exportSize, 'noBlending');

    // Export the canvas
    const link = document.createElement('a');
    link.download = `star-${star.magnitude}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }
}

// Add export listener to export button
const exportButton = document.querySelector('#export');
exportButton.addEventListener('click', exportStarImages);