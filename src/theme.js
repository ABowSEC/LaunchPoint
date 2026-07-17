import { extendTheme } from '@chakra-ui/react';

const colors = {
  // Brand ramp built from the logo teal (#38B2AC at 500). Buttons and links
  // inherit it via colorScheme="brand"; nothing in the app should reach for
  // stock framework blues.
  brand: {
    50:  '#e4faf8',
    100: '#bff0ec',
    200: '#93e2dc',
    300: '#65d1c9',
    400: '#43c0b8',
    500: '#38B2AC',
    600: '#2c928e',
    700: '#227371',
    800: '#195755',
    900: '#113f3e',
  },
  space: {
    900: '#03050D',
    800: '#06091A',
    700: '#0B1120',
    600: '#101828',
    500: '#182135',
    400: '#243552',
  },
  // Brand palette from the Ephemeris logo sheet. Kept as named accents so the
  // teal→purple mark colors, the terminal-green and HAL-red variants can be
  // referenced directly (e.g. bgGradient="linear(to-r, accent.teal, accent.purple)").
  accent: {
    teal:     '#38B2AC',
    tealLight:'#5AD4D1',
    purple:   '#9F7AEA',
    terminal: '#00FF9D',
    hal:      '#FF3B30',
    ink:      '#0F1115',
    muted:    '#8B93A7',
  },
};

const semanticTokens = {
  colors: {
    'bg.body':     { default: '#06091A', _dark: '#06091A' },
    'bg.card':     { default: '#0B1120', _dark: '#0B1120' },
    'bg.elevated': { default: '#101828', _dark: '#101828' },
    'text.primary':   { default: '#E2E8F0', _dark: '#E2E8F0' },
    'text.secondary': { default: '#7A93B8', _dark: '#7A93B8' },
    'border.default': { default: '#1E2D45', _dark: '#1E2D45' },
    'brand.primary':  { default: 'brand.400' },
    // Logo accents, exposed as semantic tokens for use across the UI.
    // Flight-console rules: terminal green marks LIVE data (countdowns,
    // telemetry, status dots) and nothing else; teal is for interactive
    // things; HAL red only ever means scrub/hold/error.
    'accent.primary':   { default: 'accent.teal' },
    'accent.secondary': { default: 'accent.purple' },
    'accent.terminal':  { default: 'accent.terminal' },
    'accent.danger':    { default: 'accent.hal' },
  },
};

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors,
  semanticTokens,
  fonts: {
    // Orbitron is the brand display face (wordmark + headings); IBM Plex Sans
    // stays for body copy, where Orbitron's wide geometric forms hurt readability.
    heading: `'Orbitron', 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif`,
    body:    `'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: 'bg.body',
        color: 'text.primary',
        lineHeight: 'tall',
      },
      '::selection': {
        bg: 'brand.700',
        color: 'white',
      },
      // Honor the OS reduced-motion preference everywhere: CSS transitions and
      // keyframe animations collapse to ~instant, so hover lifts and reveals
      // snap to their end state instead of moving. JS-driven motion (Framer,
      // the StarField canvas) is handled at those components directly.
      '@media (prefers-reduced-motion: reduce)': {
        '*, *::before, *::after': {
          animationDuration: '0.01ms !important',
          animationIterationCount: '1 !important',
          transitionDuration: '0.01ms !important',
          scrollBehavior: 'auto !important',
        },
      },
    },
  },
  components: {
    Button: {
      defaultProps: { colorScheme: 'brand' },
    },
    Divider: {
      baseStyle: { borderColor: 'border.default', opacity: 1 },
    },
    Modal: {
      baseStyle: {
        dialog: { bg: 'bg.card' },
      },
    },
    Drawer: {
      baseStyle: {
        dialog: { bg: 'bg.card' },
      },
    },
  },
});

export default theme;
