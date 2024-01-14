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
export function skyLocationToTelescopeFoV({ rasc, decl, viewRAsc, viewDecl, viewRadius }) {
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