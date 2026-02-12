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