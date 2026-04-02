// ── Terminal output line helpers ──────────────────────────────────────────────
export const C = {
  green: '#4ade80',
  dim:   '#166534',
  error: '#f87171',
  amber: '#fbbf24',
  cyan:  '#67e8f9',
  bg:    '#050a05',
};

export const gl  = (t) => ({ text: t, color: C.green });
export const dim = (t) => ({ text: t, color: C.dim   });
export const err = (t) => ({ text: t, color: C.error });
export const amb = (t) => ({ text: t, color: C.amber });
export const cyn = (t) => ({ text: t, color: C.cyan  });
export const sep = ()  => dim('─────────────────────────────────');

const NASA_KEY = () => import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

// ── Boot sequence ─────────────────────────────────────────────────────────────
export const BOOT_LINES = [
  gl ('HALP-9000  MISSION TERMINAL  v2.0'),
  dim('System online. All nodes nominal.'),
  dim("Type 'help' for available commands."),
  dim(''),
];

// ── Safe fetch helper — throws on non-ok ──────────────────────────────────────
async function safeFetch(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

// ── Command definitions ───────────────────────────────────────────────────────
export const COMMANDS = {
  help: async () => [
    amb('COMMANDS'),
    sep(),
    gl('  apod              '), dim('    Astronomy Picture of the Day'),
    gl('  iss               '), dim('    Live ISS position & telemetry'),
    gl('  launches          '), dim('    Next 3 upcoming launches'),
    gl('  rover [name]      '), dim('    Mars rover latest image info'),
    dim('    curiosity | perseverance | spirit | opportunity'),
    gl('  date              '), dim('    Current UTC date & time'),
    gl('  clear             '), dim('    Clear the terminal'),
    sep(),
  ],

  date: async () => [gl(new Date().toUTCString())],

  apod: async () => {
    const d = await safeFetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY()}`
    );
    const desc = (d.explanation ?? '').slice(0, 220) +
      (d.explanation?.length > 220 ? '...' : '');
    return [
      amb('ASTRONOMY PICTURE OF THE DAY'), sep(),
      gl(`DATE    ${d.date}`),
      gl(`TITLE   ${d.title}`),
      d.copyright ? gl(`CREDIT  ${d.copyright.trim()}`) : null,
      gl(`TYPE    ${(d.media_type ?? '').toUpperCase()}`),
      dim(''), dim(desc),
    ].filter(Boolean);
  },

  iss: async () => {
    const d = await safeFetch('https://api.wheretheiss.at/v1/satellites/25544');
    return [
      amb('ISS LIVE TELEMETRY'), sep(),
      gl(`LATITUDE    ${d.latitude.toFixed(4)}  ${d.latitude  >= 0 ? 'N' : 'S'}`),
      gl(`LONGITUDE   ${d.longitude.toFixed(4)} ${d.longitude >= 0 ? 'E' : 'W'}`),
      gl(`ALTITUDE    ${d.altitude.toFixed(1)} km`),
      gl(`VELOCITY    ${Math.round(d.velocity).toLocaleString()} km/h`),
      gl(`VISIBILITY  ${(d.visibility ?? '').toUpperCase()}`),
    ];
  },

  launches: async () => {
    const d = await safeFetch(
      'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=3'
    );
    const lines = [amb('UPCOMING LAUNCHES'), sep()];
    d.results.forEach((l, i) => {
      lines.push(gl(`[${i + 1}] ${l.name}`));
      lines.push(dim(`    DATE    ${new Date(l.window_start).toUTCString()}`));
      lines.push(dim(`    AGENCY  ${l.launch_service_provider?.name ?? 'Unknown'}`));
      lines.push(dim(`    PAD     ${l.pad?.name ?? 'TBD'}`));
      if (i < 2) lines.push(dim(''));
    });
    return lines;
  },

  rover: async (args) => {
    const VALID_ROVERS = ['curiosity', 'perseverance', 'spirit', 'opportunity'];
    // Whitelist check before any URL construction
    const name = (args[0] ?? 'curiosity').toLowerCase().trim();
    if (!VALID_ROVERS.includes(name)) {
      return [
        err(`UNKNOWN ROVER: ${name}`),
        dim(`Valid: ${VALID_ROVERS.join(' | ')}`),
      ];
    }
    const q = encodeURIComponent(`mars ${name} rover`);
    const d = await safeFetch(
      `https://images-api.nasa.gov/search?q=${q}&media_type=image&page_size=1`
    );
    const item = d.collection?.items?.[0];
    if (!item) return [err('NO RESULTS FOUND')];
    const meta = item.data?.[0] ?? {};
    const desc = (meta.description ?? '').slice(0, 200) +
      (meta.description?.length > 200 ? '...' : '');
    return [
      amb(`MARS ROVER: ${name.toUpperCase()}`), sep(),
      gl(`TITLE       ${meta.title ?? 'Unknown'}`),
      gl(`DATE        ${meta.date_created ? new Date(meta.date_created).toDateString() : 'Unknown'}`),
      gl(`TOTAL IMGS  ${d.collection.metadata?.total_hits?.toLocaleString() ?? '?'}`),
      desc ? dim('') : null,
      desc ? dim(desc) : null,
    ].filter(Boolean);
  },
};
