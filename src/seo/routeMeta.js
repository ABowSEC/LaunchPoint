// Single source of truth for per-route SEO metadata. Consumed at runtime by
// usePageMeta (SPA navigations) and at build time by scripts/prerender.mjs,
// which stamps these values into a static HTML file per route so crawlers
// and link-preview bots (Discord, Slack, X) see them without running JS.
// Keep this file dependency-free: the prerender script imports it from Node.

export const SITE_NAME = 'Ephemeris';
export const SITE_URL = 'https://ephemeris-online.com';

// `full: true` uses the title as-is; otherwise " · Ephemeris" is appended.
// `hidden: true` keeps a route out of sitemap.xml (easter eggs).
export const routeMeta = {
  '/': {
    title: 'Ephemeris - Live Rocket Launch Tracker',
    full: true,
    description:
      'Track rocket launches worldwide: live countdowns, a world launch map, tracked-launch alerts, and calendar export.',
  },
  '/launches': {
    title: 'Upcoming Rocket Launches',
    description:
      'Every upcoming rocket launch with live countdowns: SpaceX, NASA, ULA, Rocket Lab, and more. Track missions, get alerts, and export launches to your calendar.',
  },
  '/map': {
    title: 'World Launch Map',
    description:
      'Interactive world map of rocket launch sites with upcoming missions from Cape Canaveral, Starbase, Vandenberg, Baikonur, and beyond.',
  },
  '/mars': {
    title: 'Mars Rover Photos',
    description:
      "Browse the latest photos from NASA's Mars rovers, straight from the surface of the Red Planet.",
  },
  '/explore': {
    title: 'Explore NASA Imagery',
    description:
      "Search NASA's image library: nebulae, galaxies, astronauts, and missions from decades of space exploration.",
  },
  '/iss': {
    title: 'ISS Live Tracker',
    description:
      "Track the International Space Station in real time: live position on a world map plus NASA's live video feed from orbit.",
  },
  '/solarsim': {
    title: 'Solar System Simulator',
    hidden: true,
    description:
      'An interactive 3D solar system you can fly through, rendered in your browser.',
  },
};
