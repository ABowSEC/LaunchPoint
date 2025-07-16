import * as THREE from "three";

// Texture cache to avoid reloading the same texture multiple times
const textureCache = {};

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

class Planet {
  constructor(radius, distance, texturePath) {
    this.radius = radius;
    this.distance = distance;
    this.texturePath = texturePath;
  }

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
