import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    50:  '#e8f1ff',
    100: '#c0d6ff',
    200: '#91b8ff',
    300: '#5e97ff',
    400: '#3b82f6',
    500: '#2563eb',
    600: '#1d4ed8',
    700: '#1e40af',
    800: '#1e3a8a',
    900: '#1e3363',
  },
  space: {
    900: '#03050D',
    800: '#06091A',
    700: '#0B1120',
    600: '#101828',
    500: '#182135',
    400: '#243552',
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
    heading: `'Inter', -apple-system, sans-serif`,
    body:    `'Inter', -apple-system, sans-serif`,
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
