import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import theme from './theme' // optional custom theme

export function Provider({ children }) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </>
  )
}

// Alternative simpler version without custom theme:
export function SimpleProvider({ children }) {
  return (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  )
}