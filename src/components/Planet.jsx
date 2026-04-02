import * as THREE from "three";

const textureCache = {};

function getCachedTexture(path) {
  if (!textureCache[path]) {
    const loader = new THREE.TextureLoader();
    textureCache[path] = loader.load(path, undefined, undefined, (error) => {
      console.error(`Failed to load texture: ${path}`, error);
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#888888';
      ctx.fillRect(0, 0, 256, 256);
      textureCache[path] = new THREE.CanvasTexture(canvas);
    });
  }
  return textureCache[path];
}

const TEXTURE_MAP = {
  mercury: '/textures/mercury.jpg',
  venus:   '/textures/venus.jpg',
  earth:   '/textures/earth.jpg',
  mars:    '/textures/mars.jpg',
  jupiter: '/textures/jupiter.jpg',
  saturn:  '/textures/saturn.jpg',
  uranus:  '/textures/uranus.jpg',
  neptune: '/textures/neptune.jpg',
  pluto:   '/textures/pluto.jpg',
};

class Planet {
  constructor(radius, texturePath) {
    this.radius      = radius;
    this.texturePath = texturePath;
  }

  getMesh() {
    const geometry = new THREE.SphereGeometry(this.radius, 48, 48);
    const material = new THREE.MeshStandardMaterial({
      map:               this._getTexture(),
      roughness:         0.8,
      metalness:         0.1,
      emissive:          0x000000,
      emissiveIntensity: 0.1,
    });
    return new THREE.Mesh(geometry, material);
  }

  _getTexture() {
    const key = Object.keys(TEXTURE_MAP).find(
      (name) => this.texturePath.toLowerCase().includes(name)
    );
    if (!key) {
      console.warn(`No texture mapping found for: ${this.texturePath}`);
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#666666';
      ctx.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(canvas);
    }
    return getCachedTexture(TEXTURE_MAP[key]);
  }
}

export default Planet;
