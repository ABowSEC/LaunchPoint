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
  useColorModeValue,
} from '@chakra-ui/react';
import { Suspense, lazy } from 'react';
import { ColorModeButton } from './components/ui/color-mode';

import Home from './pages/Home';
import LaunchPage from './pages/LaunchPage';
import MarsPage from './pages/MarsPage';
import SolViewer from './pages/SolViewer';
import ExplorePage from './pages/ExplorePage';   // New Page
import SolarSimPage from './pages/SolarSimPage'; // New Page

const navigationItems = [
  { path: '/', label: 'Home', isHome: true },
  { path: '/explore', label: 'Explore' },
  { path: '/launches', label: 'Launch Tracker' },
  { path: '/mars', label: 'Mars Photos' },
  { path: '/solarsim', label: 'SolarSim' },
];

function Navigation() {
  const location = useLocation();

  return (
    <Box as="header" bg={useColorModeValue('gray.800', 'gray.900')} px={4} py={3}>
      <Container maxW="6xl">
        <Flex as="nav" align="center" gap={6}>
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
          <ColorModeButton />
        </Flex>
      </Container>
    </Box>
  );
}

function LoadingFallback() {
  return <Text>Loading...</Text>;
}

function App() {
  return (
    <Router>
      <Box minH="100vh" bg="gray.50">
        <Navigation />
        <Container maxW="6xl" py={10} as="main">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/launches" element={<LaunchPage />} />
              <Route path="/mars" element={<MarsPage />} />
              <Route path="/mars/sol/:solId" element={<SolViewer />} />
              <Route path="/solarsim" element={<SolarSimPage />} />

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
