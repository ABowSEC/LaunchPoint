import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { registerSW } from 'virtual:pwa-register'
import theme from './theme' // optional custom theme
import App from './App.jsx'

// Service worker: precaches the app shell and keeps launch data, map tiles,
// and images available offline. autoUpdate swaps in new versions silently.
registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config?.initialColorMode} />
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)