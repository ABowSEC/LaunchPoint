// Math utility functions for the solar system project

/**
 * Converts degrees to radians.
 * @param {number} deg
 * @returns {number}
 */
export function degToRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Linear interpolation between a and b by t (0-1).
 * @param {number} a
 * @param {number} b
 * @param {number} t
 * @returns {number}
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Clamps a value between min and max.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
} 