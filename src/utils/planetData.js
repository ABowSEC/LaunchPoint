// Planet data for the solar system visualization

/**
 * Enhanced orbit data with realistic parameters - increased distances
 * @type {Object}
 */
export const planetOrbitData = {
  Mercury: { 
    a: 8, b: 7.8, period: 88, inclination: 7, 
    radius: 0.7, texture: 'textures/mercury.jpg' 
  },
  Venus: { 
    a: 12, b: 11.9, period: 225, inclination: 3.4, 
    radius: 1, texture: 'textures/venus.jpg' 
  },
  Earth: { 
    a: 16, b: 15.98, period: 365, inclination: 0, 
    radius: 1.2, texture: 'textures/earth.jpg' 
  },
  Mars: { 
    a: 20, b: 19.8, period: 687, inclination: 1.85, 
    radius: 1, texture: 'textures/mars.jpg' 
  },
  Jupiter: { 
    a: 28, b: 27.9, period: 4333, inclination: 1.3, 
    radius: 2, texture: 'textures/jupiter.jpg' 
  },
  Saturn: { 
    a: 38, b: 37.8, period: 10759, inclination: 2.5, 
    radius: 1.8, texture: 'textures/saturn.jpg', hasRings: true, ringType: 'saturn'
  },
  Uranus: { 
    a: 48, b: 47.8, period: 30687, inclination: 0.8, 
    radius: 1.4, texture: 'textures/uranus.jpg', hasRings: true, ringType: 'uranus'
  },
  Neptune: { 
    a: 58, b: 57.8, period: 60190, inclination: 1.8, 
    radius: 1.3, texture: 'textures/neptune.jpg', hasRings: true, ringType: 'neptune'
  },
  Pluto: { 
    a: 68, b: 67.5, period: 90520, inclination: 17.2, 
    radius: 0.5, texture: 'textures/pluto.jpg' 
  },
};

/**
 * Planet data for the selector UI
 * @type {Object}
 */
export const planetData = {
  Mercury: { texture: 'textures/mercury.jpg', symbol: '' },
  Venus: { texture: 'textures/venus.jpg', symbol: '' },
  Earth: { texture: 'textures/earth.jpg', symbol: '' },
  Mars: { texture: 'textures/mars.jpg', symbol: '' },
  Jupiter: { texture: 'textures/jupiter.jpg', symbol: '' },
  Saturn: { texture: 'textures/saturn.jpg', symbol: '' },
  Uranus: { texture: 'textures/uranus.jpg', symbol: '' },
  Neptune: { texture: 'textures/neptune.jpg', symbol: '' },
  Pluto: { texture: 'textures/pluto.jpg', symbol: '' },
};

/**
 * Get planet names as an array
 * @returns {string[]}
 */
export const getPlanetNames = () => Object.keys(planetOrbitData);

/**
 * Get planet data by name
 * @param {string} planetName
 * @returns {Object|null}
 */
export const getPlanetData = (planetName) => {
  return planetOrbitData[planetName] || null;
};

/**
 * Get planets with rings
 * @returns {string[]}
 */
export const getPlanetsWithRings = () => {
  return Object.entries(planetOrbitData).filter(([_, data]) => data.hasRings).map(([name, _]) => name);
}; 