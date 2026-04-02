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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(clearColor);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  if (shadowMap) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  return { scene, camera, renderer };
}

/**
 * Creates a starfield background for space scenes with color and size variation.
 * @param {number} starCount - Number of stars to generate
 * @param {number} spread - How far stars spread from center
 * @returns {THREE.Group} Starfield group with multiple point layers
 */
export function createStarfield(starCount = 8000, spread = 2000) {
  const group = new THREE.Group();

  // Stellar color palette weighted by star type frequency
  function starColor() {
    const roll = Math.random();
    if (roll < 0.55) {
      // White / yellow-white (G/K type)
      return new THREE.Color(1.0, 0.96 + Math.random() * 0.04, 0.82 + Math.random() * 0.12);
    } else if (roll < 0.80) {
      // Blue-white (B/A type)
      return new THREE.Color(0.70 + Math.random() * 0.15, 0.82 + Math.random() * 0.12, 1.0);
    } else if (roll < 0.92) {
      // Warm orange (K type)
      return new THREE.Color(1.0, 0.78 + Math.random() * 0.10, 0.50 + Math.random() * 0.15);
    } else {
      // Red-orange (M type)
      return new THREE.Color(1.0, 0.55 + Math.random() * 0.15, 0.35 + Math.random() * 0.15);
    }
  }

  // Three size layers: dim (majority), mid, bright (rare)
  const layers = [
    { fraction: 0.70, size: 0.8 },
    { fraction: 0.25, size: 1.6 },
    { fraction: 0.05, size: 3.0 },
  ];

  for (const layer of layers) {
    const count = Math.round(starCount * layer.fraction);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
      const c = starColor();
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: layer.size,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: false,
    });

    group.add(new THREE.Points(geometry, material));
  }

  return group;
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

  const group = new THREE.Group();
  group.add(sunMesh);

  // Inner corona — tight warm glow
  const innerCoronaGeo = new THREE.SphereGeometry(radius * 1.12, 32, 32);
  const innerCoronaMat = new THREE.MeshBasicMaterial({
    color: 0xff8800,
    transparent: true,
    opacity: 0.40,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const innerCorona = new THREE.Mesh(innerCoronaGeo, innerCoronaMat);
  innerCorona.renderOrder = 1;
  group.add(innerCorona);

  // Outer corona — wide pale halo
  const outerCoronaGeo = new THREE.SphereGeometry(radius * 1.45, 32, 32);
  const outerCoronaMat = new THREE.MeshBasicMaterial({
    color: 0xffdd88,
    transparent: true,
    opacity: 0.18,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const outerCorona = new THREE.Mesh(outerCoronaGeo, outerCoronaMat);
  outerCorona.renderOrder = 2;
  group.add(outerCorona);

  return group;
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
    starCount = 8000,
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