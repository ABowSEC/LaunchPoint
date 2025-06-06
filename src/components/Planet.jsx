import * as THREE from "three";

class Planet {
  constructor(radius, distance, texturePath) {
    this.radius = radius;
    this.distance = distance;
    this.texturePath = texturePath;
  }

  getMesh() {
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    // Using placeholder textures since we can't load external images
    const material = new THREE.MeshPhongMaterial({ 
      color: this.getColor()
    });
    return new THREE.Mesh(geometry, material);
  }

  getColor() {
    //  color mapping based on texture path
    if (this.texturePath.includes('mercury')) return 0x8C7853;
    if (this.texturePath.includes('venus')) return 0xFFC649;
    if (this.texturePath.includes('earth')) return 0x6B93D6;
    if (this.texturePath.includes('mars')) return 0xCD5C5C;
    if (this.texturePath.includes('jupiter')) return 0xD8CA9D;
    if (this.texturePath.includes('saturn')) return 0xFAD5A5;
    return 0xFFFFFF;
  }

  
}

export default Planet;
