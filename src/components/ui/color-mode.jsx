// src/color-mode.js
import React from 'react'
import { 
  IconButton, 
  useColorMode, 
  useColorModeValue 
} from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'

// Color Mode Toggle Button Component
export function ColorModeButton(props) {
  const { colorMode, toggleColorMode } = useColorMode()
  
  return (
    <IconButton
      aria-label="Toggle color mode"
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      onClick={toggleColorMode}
      variant="ghost"
      size="md"
      {...props}
    />
  )
}

// Hook for color mode values (already provided by Chakra v2)
export { useColorMode, useColorModeValue } from '@chakra-ui/react'

// Optional: Custom theme configuration
// Create this in a separate theme.js file
export const themeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
}