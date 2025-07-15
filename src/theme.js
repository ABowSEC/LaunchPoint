// src/theme.js (or src/color-mode.js)

import { extendTheme } from '@chakra-ui/react';

// Custom brand colors (edit these to change your site's look)
const colors = {
  brand: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3', // Primary brand color
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
  accent: {
    500: '#ff9800', // Accent color
  },
};

// Semantic tokens for easy theming
const semanticTokens = {
  colors: {
    'bg.body': {
      default: 'gray.50',
      _dark: 'gray.900',
    },
    'bg.card': {
      default: 'white',
      _dark: 'gray.700',
    },
    'text.primary': {
      default: 'gray.800',
      _dark: 'whiteAlpha.900',
    },
    'text.secondary': {
      default: 'gray.600',
      _dark: 'gray.400',
    },
    'border.default': {
      default: 'gray.200',
      _dark: 'gray.600',
    },
    'brand.primary': {
      default: 'brand.500',
    },
    'brand.accent': {
      default: 'accent.500',
    },
  },
};

const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  colors,
  semanticTokens,
  styles: {
    global: (props) => ({
      body: {
        bg: 'bg.body',
        color: 'text.primary',
      },
    }),
  },
});

export default theme;
