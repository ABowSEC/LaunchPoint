import * as THREE from 'three';

/**
 * Creates a basic Three.js scene with camera and renderer.
 * @param {number} width - Scene width
 * @param {number} height - Scene height
 * @param {Object} options - Configuration options
 * @returns {Object} Scene, camera, and renderer objects
 */
export function createBasicScene(width, height, options = {}) {
  const {
    fov = 75,
    near = 0.1,
    far = 1000,
    clearColor = 0x000011,
    antialias = true,
    shadowMap = true
  } = options;

  // Create scene
  const scene = new THREE.Scene();

  // Create camera
  const camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
  camera.position.set(0, 10, 40);

  // Create renderer
  const renderer = new THREE.WebGLRenderer({ antialias });
  renderer.setSize(width, height);
  renderer.setClearColor(clearColor);
  
  if (shadowMap) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  return { scene, camera, renderer };
}

/**
 * Creates a starfield background for space scenes.
 * @param {number} starCount - Number of stars to generate
 * @param {number} spread - How far stars spread from center
 * @returns {THREE.Points} Starfield points object
 */
export function createStarfield(starCount = 5000, spread = 2000) {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({ 
    color: 0xFFFFFF, 
    size: 1,
    transparent: true,
    opacity: 0.8
  });
  
  const starsVertices = [];
  for (let i = 0; i < starCount; i++) {
    const x = (Math.random() - 0.5) * spread;
    const y = (Math.random() - 0.5) * spread;
    const z = (Math.random() - 0.5) * spread;
    starsVertices.push(x, y, z);
  }
  
  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
  return new THREE.Points(starsGeometry, starsMaterial);
}

/**
 * Creates basic lighting setup for a scene.
 * @param {Object} options - Lighting configuration
 * @returns {Object} Light objects
 */
export function createBasicLighting(options = {}) {
  const {
    ambientIntensity = 1.2,
    ambientColor = 0x404040,
    pointLightIntensity = 35,
    pointLightDistance = 1000,
    directionalIntensity = 0.8,
    enableShadows = true
  } = options;

  const lights = {};

  // Ambient light for overall illumination
  lights.ambient = new THREE.AmbientLight(ambientColor, ambientIntensity);

  // Main point light (like the sun)
  lights.pointLight = new THREE.PointLight(0xffffff, pointLightIntensity, pointLightDistance);
  lights.pointLight.position.set(0, 0, 0);
  
  if (enableShadows) {
    lights.pointLight.castShadow = true;
    lights.pointLight.shadow.mapSize.width = 1024;
    lights.pointLight.shadow.mapSize.height = 1024;
  }

  // Additional directional light for better visibility
  lights.directional = new THREE.DirectionalLight(0xffffff, directionalIntensity);
  lights.directional.position.set(50, 50, 50);

  return lights;
}

/**
 * Creates a sun mesh with emissive material.
 * @param {number} radius - Sun radius
 * @param {string} texturePath - Path to sun texture
 * @param {Object} options - Material options
 * @returns {THREE.Mesh} Sun mesh
 */
export function createSun(radius = 4, texturePath = "/textures/sun.jpg", options = {}) {
  const {
    emissiveColor = 0xffaa00,
    emissiveIntensity = 2,
    shininess = 10
  } = options;

  const geometry = new THREE.SphereGeometry(radius, 64, 64);
  const texture = new THREE.TextureLoader().load(texturePath);
  const material = new THREE.MeshPhongMaterial({ 
    map: texture,
    emissive: new THREE.Color(emissiveColor),
    emissiveMap: texture,
    emissiveIntensity,
    shininess
  });

  const sunMesh = new THREE.Mesh(geometry, material);
  sunMesh.castShadow = false;
  sunMesh.receiveShadow = false;

  return sunMesh;
}

/**
 * Sets up a complete solar system scene with basic elements.
 * @param {number} width - Scene width
 * @param {number} height - Scene height
 * @param {Object} options - Scene configuration
 * @returns {Object} Complete scene setup
 */
export function createSolarSystemScene(width, height, options = {}) {
  const {
    starCount = 5000,
    starSpread = 2000,
    sunRadius = 4,
    sunTexture = "/textures/sun.jpg",
    ...sceneOptions
  } = options;

  // Create basic scene
  const { scene, camera, renderer } = createBasicScene(width, height, sceneOptions);

  // Add starfield
  const starfield = createStarfield(starCount, starSpread);
  scene.add(starfield);

  // Add lighting
  const lights = createBasicLighting(sceneOptions);
  Object.values(lights).forEach(light => scene.add(light));

  // Add sun
  const sun = createSun(sunRadius, sunTexture, sceneOptions);
  scene.add(sun);

  return {
    scene,
    camera,
    renderer,
    starfield,
    lights,
    sun
  };
}

/**
 * Handles window resize for a Three.js scene.
 * @param {THREE.Camera} camera - Camera to update
 * @param {THREE.WebGLRenderer} renderer - Renderer to resize
 * @param {HTMLElement} container - Container element
 * @returns {Function} Cleanup function
 */
export function setupResizeHandler(camera, renderer, container) {
  const handleResize = () => {
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  window.addEventListener("resize", handleResize);
  
  // Return cleanup function
  return () => {
    window.removeEventListener("resize", handleResize);
  };
} 