// Core React and Router imports
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useLocation,
} from 'react-router-dom';

// Chakra UI components for layout and styling
import {
  Box,
  Flex,
  Link,
  Spacer,
  Container,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

// React lazy loading and suspense fallback
import { Suspense, lazy } from 'react';

//ReactBits
import  RotatingText  from './components/RotatingText'


// Custom UI components
import { ColorModeButton } from './components/ui/color-mode';
import ChatBotDrawer from './components/ChatBotDrawer';

// Page components
import Home from './pages/Home';
import LaunchPage from './pages/LaunchPage';
import MarsPage from './pages/MarsPage';
import SolViewer from './pages/SolViewer';
import ExplorePage from './pages/ExplorePage';
import SolarSimPage from './pages/SolarSimPage';
import ISSLivePage from './pages/issLive';

// Navigation menu config
const navigationItems = [
  { path: '/', label: 'Home', isHome: true },
  { path: '/launches', label: 'Launch Tracker' },
  { path: '/mars', label: 'Mars Photos' },
  { path: '/explore', label: 'Explore' },
  { path: '/solarsim', label: 'Solar System' },
  { path: '/iss', label: 'ISS Viewport' }
];

// Component to render the top navigation bar
function Navigation() {
  const location = useLocation(); // Used to highlight the active nav link

  return (
    <Box as="header" bg={useColorModeValue('gray.800', 'gray.900')} px={4} py={3}>
      <Container maxW="6xl">
        <Flex as="nav" align="center" gap={6}>
          {/* Loop through navigation items and render links */}
          {navigationItems.map(({ path, label }) => (
            <Link
              key={path}
              as={RouterLink}
              to={path}
              fontWeight={location.pathname === path ? 'bold' : 'medium'}
              color={
                location.pathname === path
                  ? 'teal.400'
                  : useColorModeValue('whiteAlpha.900', 'white')
              }
            >
              {label}
            </Link>
          ))}
          <Spacer />
          <ColorModeButton /> {/* Toggle light/dark mode */}
          <ChatBotDrawer />   {/* Chat assistant button */}
        </Flex>
      </Container>
    </Box>
  );
}

// Fallback component shown while lazy-loaded pages are loading
function LoadingFallback() {
  return <Text>Loading...</Text>;
}

// Main App component
function App() {
  return (
    <Router>
      <Box minH="100vh" bg={useColorModeValue('gray.50','gray.900')}>
        <Navigation /> {/* Top nav bar */}
        <Container maxW="6xl" py={10} as="main">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Define application routes and page components */}
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/launches" element={<LaunchPage />} />
              <Route path="/mars" element={<MarsPage />} />
              <Route path="/mars/sol/:solId" element={<SolViewer />} />
              <Route path="/iss" element={<ISSLivePage />} />
              <Route path="/solarsim" element={<SolarSimPage />} />

              {/* Fallback route for unknown paths */}
              <Route
                path="*"
                element={
                  <Box textAlign="center" py={20}>
                    <Text fontSize="2xl" mb={4}>Page Not Found</Text>
                    <Link as={RouterLink} to="/" color="teal.500">
                      Return to Home
                    </Link>
                  </Box>
                }
              />
            </Routes>
          </Suspense>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
