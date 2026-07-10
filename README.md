# LaunchPoint

LaunchPoint is an interactive explorer for NASA and other open space data. It pulls live sources (the Astronomy Picture of the Day, ISS position and telemetry, upcoming launches, NASA's image library) and renders them next to an interactive Three.js solar system and a space history timeline. Everything runs in a single client-side React app.

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm (or yarn)
- A NASA API key, free from [api.nasa.gov](https://api.nasa.gov). The app falls back to NASA's shared `DEMO_KEY`, but that key is rate limited and shared globally, so a personal key is recommended.

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables. Copy the example file and add your key:
   ```bash
   cp .env.example .env
   ```
   ```env
   VITE_NASA_API_KEY=your_nasa_api_key_here
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open the app at the URL Vite prints in the terminal (default `http://localhost:5173`).

### Building for Production

```bash
npm run build     # output to dist/
npm run preview   # serve the production build locally
```

### Linting

```bash
npm run lint
```

## Features

- Astronomy Picture of the Day (APOD): the daily NASA image and explanation, shown on the home page.
- Launch Tracker: upcoming launches and mission details from the Launch Library, with a live countdown in the nav bar.
- Mars Imagery: rover imagery (Curiosity, Perseverance, Opportunity, Spirit) sourced from the NASA Image & Video Library.
- Explore: full-text search across NASA's image library, plus a timeline of space exploration milestones.
- ISS Live: real-time International Space Station position and telemetry (altitude, velocity, coordinates).
- 3D Solar System: an interactive Three.js simulation with orbit controls, planet focus, orbit-line toggles, and adjustable speed. This one is hidden, see below.
- Mission Terminal: a retro command console (`HALP://`) opened from the nav bar.

### Hidden surface

The 3D solar system at `/solarsim` is intentionally unlisted. Reach it by entering the [Konami code](https://en.wikipedia.org/wiki/Konami_Code) (up up down down left right left right B A) anywhere in the app, or by going to the route directly.

## Technology Stack

- React 18 and Vite for UI and build tooling
- Chakra UI and Emotion for components and styling
- React Router for client-side routing (route pages are code-split)
- Framer Motion for page transitions and animation (honors `prefers-reduced-motion`)
- Three.js for the 3D solar system, with custom orbit controls
- Leaflet and React-Leaflet for the ISS map
- ESLint for linting

## Data Sources

| Surface        | Source                                                                |
| -------------- | --------------------------------------------------------------------- |
| APOD           | `https://api.nasa.gov/planetary/apod` (NASA API key)                  |
| Mars / Explore | `https://images-api.nasa.gov/search` (NASA Image & Video Library)     |
| Launches       | `https://ll.thespacedevs.com/2.2.0/launch/upcoming/` (Launch Library) |
| ISS            | `https://api.wheretheiss.at/v1/satellites/25544`                      |

Note: NASA's classic Mars Rover Photos API was archived in October 2025. Mars imagery in LaunchPoint now comes from the NASA Image & Video Library instead.

## Project Structure

```
src/
  pages/        Route screens (Home, LaunchPage, MarsPage, ExplorePage, issLive, SolarSimPage)
  components/   Reusable UI (StarField, Timeline, MissionTerminal, MarsFeed, LaunchFeed, SolarSystemView)
  hooks/        Custom hooks (useAnimationFrame, useFullscreen, useKonamiCode)
  utils/        Three.js helpers, orbit controls, planet/scene data, math
  data/         Static data (timeline, terminal commands)
  theme.js      Chakra theme tokens
```

## Troubleshooting

NASA API errors or rate limiting:
- Check that `VITE_NASA_API_KEY` is set in `.env`.
- The shared `DEMO_KEY` is limited to about 30 requests/hour and 50/day. A personal key allows 1,000 requests/hour.

Data not loading:
- Check your network connection and the upstream API status. LaunchPoint reads several third-party services directly from the browser.

## License

Copyright (c) 2025 AJ Bowman.

Licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0). You may share and adapt the work with attribution, but not for commercial purposes. See [LICENSE](./LICENSE) for details.

NASA and other third-party data, imagery, and APIs are subject to their own terms.

## Acknowledgments

- NASA for free, open access to space data and imagery.
- The Space Devs for the Launch Library API.
- wheretheiss.at for ISS tracking data.
