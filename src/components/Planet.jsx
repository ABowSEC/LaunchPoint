import * as THREE from "three"; 

// Planet class represents a single 3D planet object
class Planet {
  constructor(radius, distance, texturePath) {
    this.radius = radius;           // Size of the planet sphere
    this.distance = distance;       // Not currently used in this class, but useful for orbit spacing
    this.texturePath = texturePath; // Path or identifier for the planet texture
  }

  // Generates and returns a THREE.Mesh (sphere) with texture and lighting
  getMesh() {
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32); // Sphere geometry with smooth detail
    const material = new THREE.MeshPhongMaterial({ 
      map: this.getTexture(),       // Load texture based on path
      shininess: 10,                // Adds subtle light reflection
      specular: 0x333333            // Slight gray specular highlights
    });
    return new THREE.Mesh(geometry, material);
  }

  // Loads and returns a texture based on known planet names
  getTexture() {
    const loader = new THREE.TextureLoader();

    // Map of known planet texture file paths
    const textureMap = {
      mercury: "/textures/mercury.jpg",
      venus: "/textures/venus.jpg",
      earth: "/textures/earth.jpg",
      mars: "/textures/mars.jpg",
      jupiter: "/textures/jupiter.jpg",
      saturn: "/textures/saturn.jpg",
    };

    // Try to match part of the provided texturePath to a known planet
    const key = Object.keys(textureMap).find(name =>
      this.texturePath.toLowerCase().includes(name)
    );

    const textureFile = textureMap[key]; // Get the actual texture file path
    return loader.load(textureFile);     // Load and return the texture
  }
}

export default Planet;
