
import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      html: {
        height: '100%',
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
      },
      body: {
        minHeight: '100vh',
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
        margin: 0,
        padding: 0,
        overflowX: 'hidden', // prevents white slivers from horizontal scroll
      },
      '#root': {
        minHeight: '100vh', 
      },
    }),
  },
});

export default theme;
