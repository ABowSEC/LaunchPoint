import * as THREE from 'three';

/**
 * Creates a procedural ring texture for Saturn, Uranus, or Neptune.
 * @param {string} type - 'saturn', 'uranus', or 'neptune'
 * @param {number} innerRadius
 * @param {number} outerRadius
 * @returns {THREE.Texture}
 */
export function createRingTexture(type, innerRadius, outerRadius) {
  const canvas = document.createElement('canvas');
  const size = 512;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Clear canvas
  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, size, size);

  const center = size / 2;
  const maxRadius = size / 2 - 10;

  // Scale radii to canvas
  const scale = maxRadius / outerRadius;
  const scaledInner = innerRadius * scale;
  const scaledOuter = outerRadius * scale;

  switch (type) {
    case 'saturn': {
      // Saturn's rings with Cassini Division
      const gradient1 = ctx.createRadialGradient(center, center, scaledInner, center, center, scaledOuter);
      gradient1.addColorStop(0, 'rgba(212, 175, 55, 0.8)'); // Golden
      gradient1.addColorStop(0.3, 'rgba(212, 175, 55, 0.9)');
      gradient1.addColorStop(0.45, 'rgba(212, 175, 55, 0.3)'); // Cassini Division
      gradient1.addColorStop(0.55, 'rgba(212, 175, 55, 0.3)'); // Cassini Division
      gradient1.addColorStop(0.7, 'rgba(212, 175, 55, 0.9)');
      gradient1.addColorStop(1, 'rgba(212, 175, 55, 0.6)');

      ctx.fillStyle = gradient1;
      ctx.beginPath();
      ctx.arc(center, center, scaledOuter, 0, 2 * Math.PI);
      ctx.arc(center, center, scaledInner, 0, 2 * Math.PI, true);
      ctx.fill();

      // Add some noise/irregularities
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = scaledInner + Math.random() * (scaledOuter - scaledInner);
        const x = center + Math.cos(angle) * radius;
        const y = center + Math.sin(angle) * radius;
        const opacity = Math.random() * 0.3;

        ctx.fillStyle = `rgba(212, 175, 55, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 3 + 1, 0, 2 * Math.PI);
        ctx.fill();
      }
      break;
    }
    case 'uranus': {
      // Uranus's dark, subtle rings
      const gradient2 = ctx.createRadialGradient(center, center, scaledInner, center, center, scaledOuter);
      gradient2.addColorStop(0, 'rgba(74, 74, 74, 0.6)');
      gradient2.addColorStop(0.5, 'rgba(1, 111, 255, 0.49)');
      gradient2.addColorStop(1, 'rgba(76, 189, 255, 0.73)');

      ctx.fillStyle = gradient2;
      ctx.beginPath();
      ctx.arc(center, center, scaledOuter, 0, 2 * Math.PI);
      ctx.arc(center, center, scaledInner, 0, 2 * Math.PI, true);
      ctx.fill();

      // Add subtle variations
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = scaledInner + Math.random() * (scaledOuter - scaledInner);
        const x = center + Math.cos(angle) * radius;
        const y = center + Math.sin(angle) * radius;
        const opacity = Math.random() * 0.2;

        ctx.fillStyle = `rgba(74, 74, 74, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 2 + 1, 0, 2 * Math.PI);
        ctx.fill();
      }
      break;
    }
    case 'neptune': {
      // Neptune's faint, clumpy rings
      const gradient3 = ctx.createRadialGradient(center, center, scaledInner, center, center, scaledOuter);
      gradient3.addColorStop(0, 'rgba(102, 102, 102, 0.5)');
      gradient3.addColorStop(0.7, 'rgba(102, 102, 102, 0.3)');
      gradient3.addColorStop(1, 'rgba(102, 102, 102, 0.1)');

      ctx.fillStyle = gradient3;
      ctx.beginPath();
      ctx.arc(center, center, scaledOuter, 0, 2 * Math.PI);
      ctx.arc(center, center, scaledInner, 0, 2 * Math.PI, true);
      ctx.fill();

      // Add clumpy structures (arcs)
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = scaledInner + Math.random() * (scaledOuter - scaledInner);
        const x = center + Math.cos(angle) * radius;
        const y = center + Math.sin(angle) * radius;
        const opacity = Math.random() * 0.4 + 0.2;

        ctx.fillStyle = `rgba(102, 102, 102, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 4 + 2, 0, 2 * Math.PI);
        ctx.fill();
      }
      break;
    }
    default:
      // Default ring style
      ctx.fillStyle = 'rgba(150, 150, 150, 0.4)';
      ctx.beginPath();
      ctx.arc(center, center, scaledOuter, 0, 2 * Math.PI);
      ctx.arc(center, center, scaledInner, 0, 2 * Math.PI, true);
      ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates an inclined orbit ellipse as a THREE.Line.
 * @param {number} a - semi-major axis
 * @param {number} b - semi-minor axis
 * @param {number} inclination - degrees
 * @returns {THREE.Line}
 */
export function createOrbitEllipse(a, b, inclination) {
  const curve = new THREE.EllipseCurve(0, 0, a, b, 0, 2 * Math.PI, false, 0);
  const points = curve.getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints(
    points.map(p => {
      const x = p.x;
      const z = p.y;
      const y = Math.sin(inclination * Math.PI / 180) * z;
      return new THREE.Vector3(x, y, z);
    })
  );
  const material = new THREE.LineBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3 });
  return new THREE.Line(geometry, material);
}

const ATMOSPHERE_VERTEX_SHADER = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

// Fresnel rim glow: intensity peaks where the shell is edge-on to the camera
// (the planet's limb) and falls off toward the centre and the outer edge,
// so the atmosphere reads as scattered light rather than a flat halo.
const ATMOSPHERE_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3  uColor;
  uniform float uIntensity;
  uniform float uPower;
  varying vec3  vWorldNormal;
  varying vec3  vWorldPosition;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    // abs() keeps it stable for the BackSide shell, whose normals face inward.
    float rim = 1.0 - abs(dot(vWorldNormal, viewDir));
    float intensity = pow(rim, uPower) * uIntensity;
    gl_FragColor = vec4(uColor, clamp(intensity, 0.0, 1.0));
  }
`;

/**
 * Creates a Fresnel-based atmosphere glow shell around a planet. The glow is
 * concentrated on the limb and view-dependent, avoiding the flat "sticker"
 * look of a uniform-opacity halo.
 * @param {number} planetRadius - The planet's geometry radius
 * @param {number} color - Hex color for the atmosphere (e.g. 0x4488ff)
 * @param {Object} options
 * @param {number} options.scale - How much larger than the planet (default 1.18)
 * @param {number} options.opacity - Peak rim intensity (default 0.35)
 * @param {number} options.power - Falloff sharpness; higher = tighter rim (default 3.0)
 * @returns {THREE.Mesh}
 */
export function createAtmosphereGlow(planetRadius, color, options = {}) {
  const { scale = 1.18, opacity = 0.35, power = 3.0 } = options;
  const geometry = new THREE.SphereGeometry(planetRadius * scale, 48, 48);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor:     { value: new THREE.Color(color) },
      uIntensity: { value: opacity },
      uPower:     { value: power },
    },
    vertexShader: ATMOSPHERE_VERTEX_SHADER,
    fragmentShader: ATMOSPHERE_FRAGMENT_SHADER,
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = 2;
  return mesh;
}

/**
 * Builds a white radial-gradient texture (bright centre → transparent edge)
 * for additive sprite glows. Tint it via the sprite material's `color`.
 * @returns {THREE.CanvasTexture}
 */
function createGlowSpriteTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const c = size / 2;
  const gradient = ctx.createRadialGradient(c, c, 0, c, c, c);
  gradient.addColorStop(0.0, 'rgba(255, 255, 255, 0.90)');
  gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.35)');
  gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.08)');
  gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

/**
 * Creates a subtle camera-facing halo sprite around a planet — the soft outer
 * bloom that complements the Fresnel rim atmosphere. The planet disc occludes
 * the bright centre (depthTest on), leaving a glow that hugs the limb.
 * @param {number} planetRadius - The planet's geometry radius
 * @param {number} color - Hex tint for the halo (e.g. 0x4488ff)
 * @param {Object} options
 * @param {number} options.scale - Halo diameter as a multiple of radius (default 3.0)
 * @param {number} options.opacity - Halo strength (default 0.3)
 * @returns {THREE.Sprite}
 */
export function createPlanetHalo(planetRadius, color, options = {}) {
  const { scale = 3.0, opacity = 0.3 } = options;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: createGlowSpriteTexture(),
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  sprite.scale.setScalar(planetRadius * scale);
  sprite.renderOrder = 3;
  return sprite;
}