import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useLocation,
} from 'react-router-dom';
import {
  Box,
  Flex,
  Link,
  Spacer,
  Container,
  Text,
} from '@chakra-ui/react';
import { Suspense, lazy } from 'react';
import { ColorModeButton } from './components/ui/color-mode';

import Home from './pages/Home';
import LaunchPage from './pages/LaunchPage';
import MarsPage from './pages/MarsPage';
import ExplorePage from './pages/ExplorePage';
import SolarSimPage from './pages/SolarSimPage';
import ISSLivePage from './pages/issLive';
import ChatBotDrawer from './components/ChatBotDrawer';

const navigationItems = [
  { path: '/', label: 'Home', isHome: true },
  { path: '/launches', label: 'Launch Tracker' },
  { path: '/mars', label: 'Mars Photos' },
  { path: '/explore', label: 'Explore' },
  { path: '/solarsim', label: 'Solar System' },
  { path: '/iss', label: 'ISS Viewport'}
];

function Navigation() {
  const location = useLocation();

  return (
    <Box as="header" bg="bg.card" px={4} py={3} boxShadow="sm" borderBottom="1px solid" borderColor="whiteAlpha.200">
      <Container maxW="6xl">
        <Flex as="nav" align="center" gap={6}>
          {navigationItems.map(({ path, label }) => (
            <Link
              key={path}
              as={RouterLink}
              to={path}
              fontWeight={location.pathname === path ? 'bold' : 'medium'}
              color={location.pathname === path ? 'brand.primary' : 'text.primary'}
              _hover={{ 
                color: 'brand.primary',
                transform: 'translateY(-1px)',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
              transition="all 0.2s"
              position="relative"
              _after={{
                content: '""',
                position: 'absolute',
                bottom: '-2px',
                left: '0',
                width: location.pathname === path ? '100%' : '0%',
                height: '2px',
                bgGradient: 'linear(to-r, teal.400, blue.500)',
                transition: 'width 0.2s'
              }}
            >
              {label}
            </Link>
          ))}
          <Spacer />
          <ColorModeButton />
          <ChatBotDrawer />
        </Flex>
      </Container>
    </Box>
  );
}

function LoadingFallback() {
  return <Text color="text.secondary">Loading...</Text>;
}

function App() {
  return (
    <Router>
      <Box minH="100vh" bg="bg.body">
        <Navigation />
        <Container maxW="6xl" py={10} as="main">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/launches" element={<LaunchPage />} />
              <Route path="/mars" element={<MarsPage />} />
              <Route path="/iss" element={<ISSLivePage />} />
              <Route path="/solarsim" element={<SolarSimPage />} />

              <Route
                path="*"
                element={
                  <Box textAlign="center" py={20}>
                    <Text fontSize="2xl" mb={4} color="text.primary">Page Not Found</Text>
                    <Link as={RouterLink} to="/" color="brand.primary">
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
