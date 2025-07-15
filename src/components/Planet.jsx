import * as THREE from "three";

// Texture cache to avoid reloading the same texture multiple times
const textureCache = {};

function getCachedTexture(path) {
  if (!textureCache[path]) {
    textureCache[path] = new THREE.TextureLoader().load(path);
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
    const material = new THREE.MeshPhongMaterial({ 
      map: this.getTexture(),
      shininess:10,
      specular: 0x333333
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
    };

    const key = Object.keys(textureMap).find(name => this.texturePath.toLowerCase().includes(name));
    const textureFile = textureMap[key];
    return getCachedTexture(textureFile);
  }
}

export default Planet;
