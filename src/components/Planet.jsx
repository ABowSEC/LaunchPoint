import * as THREE from "three";

/**
 * Texture cache to avoid reloading the same texture multiple times
 */
const textureCache = {};

/**
 * Get a cached texture or load it if not already cached
 * 
 * This function implements a texture caching system to avoid reloading
 * the same textures multiple times. If a texture is already cached,
 * it returns the cached version. Otherwise, it loads the texture and
 * caches it for future use.
 * 
 * @param {string} path - Path to the texture file
 * @returns {THREE.Texture} The loaded or cached texture
 * 
 * @example
 * const earthTexture = getCachedTexture('/textures/earth.jpg');
 */
function getCachedTexture(path) {
  if (!textureCache[path]) {
    const loader = new THREE.TextureLoader();
    textureCache[path] = loader.load(
      path,
      // onLoad callback
      (texture) => {
        console.log(`Texture loaded successfully: ${path}`);
      },
      // onProgress callback
      undefined,
      // onError callback
      (error) => {
        console.error(`Failed to load texture: ${path}`, error);
        // Use a fallback texture (e.g., a solid color)
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#888888';
        ctx.fillRect(0, 0, 256, 256);
        textureCache[path] = new THREE.CanvasTexture(canvas);
      }
    );
  }
  return textureCache[path];
}

/**
 * Planet class for creating 3D planet objects in the solar system
 * 
 * This class encapsulates the creation of planet meshes with textures,
 * providing a clean interface for creating planets with different
 * sizes, distances, and surface textures.
 * 
 * @example
 * const earth = new Planet(1.2, 12, 'textures/earth.jpg');
 * const earthMesh = earth.getMesh();
 */
class Planet {
  /**
   * Create a new Planet instance
   * 
   * @param {number} radius - Radius of the planet in units
   * @param {number} distance - Distance from the sun !!Currently NOT used!!
   * @param {string} texturePath - Path to the planet's texture file
   */
  constructor(radius, distance, texturePath) {
    this.radius = radius;
    this.distance = distance;
    this.texturePath = texturePath;
  }

  /**
   * Create and return a Three.js mesh for the planet
   * 
   * Creates a sphere geometry with the planet's radius and applies
   * a standard material with the planet's texture. The material
   * includes realistic lighting properties for better visual quality.
   * 
   * @returns {THREE.Mesh} The planet mesh ready for scene rendering
   */
  getMesh() {
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ 
      map: this.getTexture(),
      roughness: 0.8,
      metalness: 0.1,
      emissive: 0x000000,
      emissiveIntensity: 0.1
    });
    return new THREE.Mesh(geometry, material);
  }

  getTexture() {
    // Map of planet names to their texture files
    // fallback texture is a gray canvas
    const textureMap = {
      mercury: "/textures/mercury.jpg",
      venus: "/textures/venus.jpg",
      earth: "/textures/earth.jpg",
      mars: "/textures/mars.jpg",
      jupiter: "/textures/jupiter.jpg",
      saturn: "/textures/saturn.jpg",
      uranus: "/textures/uranus.jpg",
      neptune: "/textures/neptune.jpg",
      pluto: "/textures/pluto.jpg",
    };

    // Find the matching texture based on the texture path
    const key = Object.keys(textureMap).find(name => this.texturePath.toLowerCase().includes(name));
    const textureFile = textureMap[key];
    
    if (!textureFile) {
      console.warn(`No texture mapping found for: ${this.texturePath}`);
      // Return a fallback texture
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#666666';
      ctx.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(canvas);
    }
    
    return getCachedTexture(textureFile);
  }
}

export default Planet;
