// Randomization
function splitmix32(a) {
  return function () {
    a |= 0; a = a + 0x9e3779b9 | 0;
    var t = a ^ a >>> 16; t = Math.imul(t, 0x21f0aaad);
    t = t ^ t >>> 15; t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
  }
}
export const seed = 1;
export const random = splitmix32(seed);
export function randomSkyLocation() {
  // Return a random location in the sky

  const u = random(seed);
  const v = random(seed);
  return {
    rasc: 2 * Math.PI * u * (180 / Math.PI),
    decl: Math.acos(2 * v - 1) * (180 / Math.PI) - 90,
  }
}

// Conversions
export function skyLocationToTelescopeFoV({ rasc, decl, viewRAsc, viewDecl, viewRadius, planetDiameter }) {
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
  if (smallestDistance > viewRadius + (planetDiameter ?? 0)) return null;

  // Return x and y values between -1 and 1 representing the object's position in the view
  return {
    x: smallestDistanceRAscDelta / viewRadius,
    y: smallestDistanceDeclDelta / viewRadius,
  }
}

export function degrees(degrees = 0, arcminutes = 0, arcseconds = 0) {
  const sign = degrees < 0 ? -1 :
    degrees > 0 ? 1 :
      arcminutes < 0 ? -1 :
        arcminutes > 0 ? 1 :
          arcseconds < 0 ? -1 :
            arcseconds > 0 ? 1 : 0;
  return sign * (degrees + arcminutes / 60 + arcseconds / 3600);
}

export function getMagnification({ telescopeFocalLength, eyepieceFocalLength }) {
  return telescopeFocalLength / eyepieceFocalLength;
}
export function getFoV({ eyepieceFoV, magnification }) {
  return eyepieceFoV / magnification;
}

export function drawStar(ctx, canvasX, canvasY, magnitude, mirrorAdvantage, eyeAdjustmentFactor, canvasSize, noBlending) {
  const lumens = Math.pow(4, (-14.18 - magnitude) / 2.5) / 40000;
  const advantagedLumens = lumens * mirrorAdvantage;
  const adjustedLumens = advantagedLumens * eyeAdjustmentFactor;
  const maxBrightness = Math.min(1, adjustedLumens);

  const magnitudeSize = Math.ceil(Math.pow(2, 16) / (Math.pow(magnitude + 4, 2) + 16));
  const size = Math.min(canvasSize * 2, magnitudeSize);
  const canvasXStart = Math.floor(canvasX - size / 2);
  const canvasYStart = Math.floor(canvasY - size / 2);
  const image = ctx.getImageData(canvasXStart, canvasYStart, size, size);

  const range = Array.from({ length: size }, (_, i) => i);
  const rawData = Array.from({ length: size * size }, () => 0);

  for (const x of range) {
    for (const y of range) {
      const index = x + y * size;
      const centerOffsetX = Math.abs(x - size / 2);
      const centerOffsetY = Math.abs(y - size / 2);
      const centerPoint = centerOffsetX < 1 && centerOffsetY < 1;
      const brightness = centerPoint ? maxBrightness : maxBrightness / (Math.pow(centerOffsetX, 3 / 4) + Math.pow(centerOffsetY, 3 / 4) + 1);
      rawData[index] = brightness;
    }
  }

  for (const [index, brightness] of rawData.entries()) {
    // Scale the brightness to drop off more quickly
    const relativeBrightness = 1.1 * (brightness / maxBrightness) - 0.1 * maxBrightness;
    if (relativeBrightness < 0) continue;

    if (noBlending) {
      // Set the pixel values directly
      image.data[index * 4] = 255
      image.data[index * 4 + 1] = 255;
      image.data[index * 4 + 2] = 255;
      image.data[index * 4 + 3] = 255 * Math.min(1, relativeBrightness * adjustedLumens)
    } else {
      // Get current pixel data and compute pixel brightness from star
      const absoluteBrightness = Math.min(1, relativeBrightness * adjustedLumens);
      const currentR = image.data[index * 4];
      const currentG = image.data[index * 4 + 1];
      const currentB = image.data[index * 4 + 2];
      const currentA = image.data[index * 4 + 3];
      const starR = 255;
      const starG = 255;
      const starB = 255;
      const starA = 255 * absoluteBrightness;
      // Overlay the star color over the current color
      image.data[index * 4] = (starR * starA + currentR * (255 - starA)) / 255;
      image.data[index * 4 + 1] = (starG * starA + currentG * (255 - starA)) / 255;
      image.data[index * 4 + 2] = (starB * starA + currentB * (255 - starA)) / 255;
      // Max it to avoid bad overlaps
      // image.data[index * 4 + 3] = (starA + currentA * (255 - starA)) / 255;
      image.data[index * 4 + 3] = Math.max(currentA, starA);
    }
  }

  ctx.putImageData(image, canvasXStart, canvasYStart);
}